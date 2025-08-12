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
import { Clock, MessageSquare, User } from "lucide-react";

// Mock data generator for demo purposes
const generateMockData = () => {
  const connections = [];
  const messages = [];

  // Generate random connections
  for (let i = 0; i < 12; i++) {
    connections.push({
      id: `conn-${i}`,
      clientId: `client-${Math.random().toString(36).substr(2, 8)}`,
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
      connectedAt: Date.now() - Math.random() * 3600000,
      lastActivity: Date.now() - Math.random() * 60000,
      status:
        Math.random() > 0.1
          ? "connected"
          : Math.random() > 0.5
            ? "disconnected"
            : "error",
      messageCount: Math.floor(Math.random() * 1000),
      bytesTransferred: Math.floor(Math.random() * 1000000),
      latency: Math.random() * 300,
    });
  }

  // Generate random messages
  for (let i = 0; i < 50; i++) {
    const from =
      connections[Math.floor(Math.random() * connections.length)]?.clientId;
    const to =
      connections[Math.floor(Math.random() * connections.length)]?.clientId;

    if (from && to && from !== to) {
      messages.push({
        id: `msg-${i}`,
        from,
        to,
        timestamp: Date.now() - Math.random() * 300000,
        size: Math.floor(Math.random() * 10000),
        type: ["data", "heartbeat", "command", "response"][
          Math.floor(Math.random() * 4)
        ],
        status: Math.random() > 0.05 ? "success" : "error",
        latency: Math.random() * 300,
      });
    }
  }

  return { connections, messages };
};

export default function Dashboard() {
  const {
    connections,
    messages,
    selectedConnection,
    setConnections,
    addMessage,
    updateMetrics,
  } = useSocketStore();

  // Initialize with mock data for demo
  useEffect(() => {
    const { connections: mockConnections, messages: mockMessages } =
      generateMockData();
    setConnections(mockConnections);

    mockMessages.forEach((msg) => addMessage(msg));

    // Calculate and update metrics
    const activeConnections = mockConnections.filter(
      (c) => c.status === "connected",
    ).length;
    const totalMessages = mockMessages.length;
    const avgLatency =
      mockMessages.reduce((sum, m) => sum + (m.latency || 0), 0) /
      totalMessages;
    const errorRate =
      mockMessages.filter((m) => m.status === "error").length / totalMessages;
    const bytesPerSecond =
      mockConnections.reduce((sum, c) => sum + c.bytesTransferred, 0) / 60;

    updateMetrics({
      totalConnections: mockConnections.length,
      activeConnections,
      messagesPerSecond: totalMessages / 60,
      avgLatency,
      errorRate,
      bytesPerSecond,
      topTalkers: mockConnections
        .sort((a, b) => b.messageCount - a.messageCount)
        .slice(0, 5)
        .map((c) => ({
          clientId: c.clientId,
          messageCount: c.messageCount,
          bytesTransferred: c.bytesTransferred,
        })),
    });

    // Simulate real-time updates
    const interval = setInterval(() => {
      // Add random message
      const activeConns = mockConnections.filter(
        (c) => c.status === "connected",
      );
      if (activeConns.length >= 2) {
        const from =
          activeConns[Math.floor(Math.random() * activeConns.length)];
        const to = activeConns[Math.floor(Math.random() * activeConns.length)];

        if (from.clientId !== to.clientId) {
          addMessage({
            id: `msg-${Date.now()}`,
            from: from.clientId,
            to: to.clientId,
            timestamp: Date.now(),
            size: Math.floor(Math.random() * 5000),
            type: "data",
            status: Math.random() > 0.05 ? "success" : "error",
            latency: Math.random() * 200,
          });
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [setConnections, addMessage, updateMetrics]);

  const selectedConn = connections.find(
    (c) => c.clientId === selectedConnection,
  );
  const recentMessages = messages.slice(0, 20);

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
