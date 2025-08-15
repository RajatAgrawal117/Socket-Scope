import { useState, useEffect } from "react";
import { Header } from "../components/Header.jsx";
import { MetricsGrid } from "../components/MetricsGrid.jsx";
import { NetworkGraphSimple } from "../components/NetworkGraphSimple.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import { Badge } from "../components/ui/badge.jsx";
import { ScrollArea } from "../components/ui/scroll-area.jsx";
import { useSocketStore } from "../features/socketStore.js";
import { apiClient } from "../config/api.js";
import { socketClient } from "../services/socketClient.js";
import { Clock, MessageSquare, User } from "lucide-react";

export default function Dashboard() {
  const {
    connections,
    messages,
    selectedConnection,
    setConnections,
    setMessages,
    addMessage,
    updateMetrics,
    setConnectedStatus,
  } = useSocketStore();
  const [loading, setLoading] = useState(true);

  // WebSocket connection for real-time updates
  useEffect(() => {
    socketClient.connect();

    socketClient.on('connection_status', (connected) => {
      setConnectedStatus(connected);
    });

    socketClient.on('connections_updated', (updatedConnections) => {
      setConnections(updatedConnections);
    });

    socketClient.on('message_received', (message) => {
      addMessage({
        ...message,
        from: message.clientId,
        to: message.data?.to || 'broadcast',
        timestamp: new Date(message.timestamp).getTime(),
        size: JSON.stringify(message.data).length,
        type: message.type,
        latency: message.data?.latency || 0
      });
    });

    socketClient.on('kafka_message_received', (message) => {
      addMessage({
        id: `kafka-${Date.now()}`,
        from: message.clientId || 'kafka',
        to: message.data?.to || 'broadcast',
        timestamp: new Date(message.timestamp).getTime(),
        size: JSON.stringify(message.data).length,
        type: 'kafka',
        status: 'success',
        latency: message.data?.latency || 0
      });
    });

    socketClient.on('kafka_metrics_received', (metrics) => {
      updateMetrics(metrics);
    });

    socketClient.on('replay_message_received', (message) => {
      addMessage({
        ...message,
        id: `replay-${message.id}`,
        type: 'replay',
        status: 'replayed'
      });
    });

    return () => {
      socketClient.disconnect();
    };
  }, [setConnectedStatus, setConnections, addMessage]);

  // Fetch real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [connectionsData, messagesData, metricsData] = await Promise.all([
          apiClient.get('/connections'),
          apiClient.get('/messages?limit=50'),
          apiClient.get('/metrics')
        ]);

        setConnections(connectionsData.map(conn => ({
          ...conn,
          clientId: conn.client_id,
          connectedAt: new Date(conn.connected_at).getTime(),
          lastActivity: new Date(conn.last_activity).getTime(),
          messageCount: conn.message_count,
          bytesTransferred: conn.bytes_transferred,
          ip: conn.ip_address
        })));

        setMessages(messagesData.map(msg => ({
          ...msg,
          from: msg.from_client,
          to: msg.to_client,
          timestamp: new Date(msg.timestamp).getTime(),
          size: msg.size_bytes,
          type: msg.message_type,
          latency: msg.latency_ms
        })));

        updateMetrics(metricsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [setConnections, setMessages, updateMetrics]);

  const selectedConn = connections.find(
    (c) => c.clientId === selectedConnection,
  );
  const recentMessages = messages.slice(0, 20);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-6 py-6">
        <MetricsGrid />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Network Graph - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <NetworkGraphSimple />
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Connection Details */}
            {selectedConn && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Connection Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm font-medium">Client ID</div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {selectedConn.clientId}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">IP Address</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedConn.ip}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Status</div>
                    <Badge
                      variant={
                        selectedConn.status === "connected"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {selectedConn.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Messages</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedConn.messageCount}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Latency</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedConn.latency.toFixed(0)}ms
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Connected</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(selectedConn.connectedAt).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Recent Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="p-4 space-y-2">
                    {recentMessages.map((message) => (
                      <div
                        key={message.id}
                        className="border-l-2 border-l-info pl-3 py-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-mono text-muted-foreground">
                            {message.from.slice(0, 8)} →{" "}
                            {message.to.slice(0, 8)}
                          </div>
                          <Badge
                            variant={
                              message.status === "success"
                                ? "default"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {message.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                          <span>•</span>
                          <span>{message.size} bytes</span>
                          <span>•</span>
                          <span>{message.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
