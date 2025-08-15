import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import { ScrollArea } from './ui/scroll-area.jsx';
import { Send, Users, MessageSquare } from 'lucide-react';

export function ClientSimulator() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [clientId, setClientId] = useState('');
  const [connectedClients, setConnectedClients] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [targetClient, setTargetClient] = useState('broadcast');

  useEffect(() => {
    const newSocket = io('http://localhost:3002');
    
    newSocket.on('connect', () => {
      setIsConnected(true);
      setClientId(newSocket.id);
      setSocket(newSocket);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      setClientId('');
    });

    newSocket.on('connection_update', (connections) => {
      setConnectedClients(connections.filter(c => c.clientId !== newSocket.id));
    });

    newSocket.on('message_received', (message) => {
      setMessages(prev => [...prev, {
        ...message,
        id: Date.now(),
        timestamp: new Date(),
        direction: 'received'
      }]);
    });

    return () => newSocket.close();
  }, []);

  const sendMessage = () => {
    if (socket && messageText.trim()) {
      const message = {
        to: targetClient === 'broadcast' ? null : targetClient,
        content: messageText,
        type: 'chat',
        timestamp: new Date()
      };

      socket.emit('message', message);
      
      setMessages(prev => [...prev, {
        ...message,
        id: Date.now(),
        from: clientId,
        direction: 'sent'
      }]);
      
      setMessageText('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Client Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Client Simulator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            {clientId && (
              <span className="text-sm text-muted-foreground font-mono">
                ID: {clientId.slice(0, 8)}...
              </span>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Send to:</label>
            <select 
              value={targetClient} 
              onChange={(e) => setTargetClient(e.target.value)}
              className="w-full mt-1 p-2 border rounded bg-background text-foreground"
            >
              <option value="broadcast">Broadcast to All</option>
              {connectedClients.map(client => (
                <option key={client.clientId} value={client.clientId}>
                  {client.clientId.slice(0, 8)}... ({client.ip})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded bg-background text-foreground placeholder:text-muted-foreground"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage} disabled={!isConnected || !messageText.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages ({messages.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <div className="p-4 space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded border-l-4 ${
                    message.direction === 'sent' 
                      ? 'border-l-blue-500 bg-blue-50' 
                      : 'border-l-green-500 bg-green-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>
                      {message.direction === 'sent' ? 'You' : `From: ${message.from?.slice(0, 8)}...`}
                    </span>
                    <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-sm">{message.content}</div>
                  {message.to && (
                    <div className="text-xs text-muted-foreground mt-1">
                      To: {message.to.slice(0, 8)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}