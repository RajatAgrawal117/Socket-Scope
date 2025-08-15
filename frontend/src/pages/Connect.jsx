import { useState } from 'react';
import { Header } from "../components/Header.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";
import { Badge } from "../components/ui/badge.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.jsx";
import { Copy, Code, Zap, Globe, Server } from "lucide-react";

export default function Connect() {
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const jsClientCode = `// Connect your JavaScript app to SocketScope
import { io } from 'socket.io-client';

const socket = io('http://localhost:3002', {
  query: { appName: 'MyApp', version: '1.0.0' }
});

// Send messages through SocketScope
socket.emit('message', {
  to: 'user123',
  content: 'Hello from MyApp!',
  type: 'chat'
});

// Listen for messages
socket.on('message_received', (data) => {
  console.log('Received:', data);
});`;

  const pythonClientCode = `# Connect your Python app to SocketScope
import socketio

sio = socketio.Client()

@sio.event
def connect():
    print('Connected to SocketScope')
    sio.emit('message', {
        'to': 'user123',
        'content': 'Hello from Python!',
        'type': 'data'
    })

@sio.event
def message_received(data):
    print('Received:', data)

sio.connect('http://localhost:3002')`;

  const nodeServerCode = `// Integrate SocketScope into your Node.js server
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

// Connect to SocketScope for monitoring
const monitorSocket = require('socket.io-client')('http://localhost:3002');

io.on('connection', (socket) => {
  // Forward connection events to SocketScope
  monitorSocket.emit('connection_event', {
    type: 'new_connection',
    clientId: socket.id,
    timestamp: new Date()
  });

  socket.on('message', (data) => {
    // Forward messages to SocketScope for monitoring
    monitorSocket.emit('message', {
      from: socket.id,
      to: data.to,
      content: data.content,
      type: 'user_message'
    });
  });
});`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-6 py-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Connect Your Apps</h1>
            <Badge variant="secondary">Integration Guide</Badge>
          </div>
          <p className="text-muted-foreground text-lg">
            Connect your existing WebSocket applications to SocketScope for real-time monitoring and visualization.
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary mb-2">1</div>
                <h3 className="font-semibold mb-2">Start SocketScope</h3>
                <p className="text-sm text-muted-foreground">Run your SocketScope server on port 3002</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary mb-2">2</div>
                <h3 className="font-semibold mb-2">Connect Your App</h3>
                <p className="text-sm text-muted-foreground">Use the code examples below to connect</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary mb-2">3</div>
                <h3 className="font-semibold mb-2">Monitor & Visualize</h3>
                <p className="text-sm text-muted-foreground">Watch real-time data on the Dashboard</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Examples */}
        <Tabs defaultValue="javascript" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="javascript">JavaScript Client</TabsTrigger>
            <TabsTrigger value="python">Python Client</TabsTrigger>
            <TabsTrigger value="nodejs">Node.js Server</TabsTrigger>
          </TabsList>

          <TabsContent value="javascript">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  JavaScript/React Client Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{jsClientCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(jsClientCode, 'js')}
                  >
                    <Copy className="h-4 w-4" />
                    {copied === 'js' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Install:</strong> <code>npm install socket.io-client</code>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="python">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Python Client Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{pythonClientCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(pythonClientCode, 'python')}
                  >
                    <Copy className="h-4 w-4" />
                    {copied === 'python' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Install:</strong> <code>pip install python-socketio</code>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nodejs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Node.js Server Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{nodeServerCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(nodeServerCode, 'node')}
                  >
                    <Copy className="h-4 w-4" />
                    {copied === 'node' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>Install:</strong> <code>npm install socket.io socket.io-client</code>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Connection Details */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Connection Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">SocketScope Server</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">URL:</span>
                    <code className="bg-muted px-2 py-1 rounded">http://localhost:3002</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Protocol:</span>
                    <code className="bg-muted px-2 py-1 rounded">Socket.IO</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transport:</span>
                    <code className="bg-muted px-2 py-1 rounded">WebSocket, Polling</code>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Message Format</h4>
                <div className="bg-muted p-3 rounded text-sm">
                  <code>{`{
  "to": "client_id",
  "content": "message content",
  "type": "chat|data|system",
  "timestamp": "2024-01-01T12:00:00Z"
}`}</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}