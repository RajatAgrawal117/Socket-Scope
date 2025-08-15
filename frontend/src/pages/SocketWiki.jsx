import { useState } from "react";
import { Header } from "../components/Header.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx";
import { Badge } from "../components/ui/badge.jsx";
import { Button } from "../components/ui/button.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.jsx";
import { Play, Code, BookOpen, Zap } from "lucide-react";

const WebSocketAnimation = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "Client initiates HTTP request",
    "Server responds with 101 Switching Protocols",
    "WebSocket connection established",
    "Bidirectional communication active"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          WebSocket Handshake Animation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 border rounded">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                Client
              </div>
            </div>
            <div className="flex-1 mx-4">
              <div className={`h-2 bg-gradient-to-r transition-all duration-1000 ${
                step >= 1 ? 'from-blue-500 to-green-500' : 'from-gray-300 to-gray-300'
              }`} />
              <div className="text-center mt-2 text-sm">
                {step >= 1 ? steps[step - 1] : "Ready to connect"}
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                Server
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={() => setStep((s) => Math.min(s + 1, 4))}>
              Next Step
            </Button>
            <Button variant="outline" onClick={() => setStep(0)}>
              Reset
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Step {step}/4: {step > 0 ? steps[step - 1] : "Click 'Next Step' to begin"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CodeExample = ({ title, code, language = "javascript" }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Code className="h-4 w-4" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </CardContent>
  </Card>
);

const MiniLab = () => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const connect = () => {
    setConnected(true);
    setMessages([{ type: "system", text: "Connected to demo WebSocket server", time: new Date() }]);
  };

  const disconnect = () => {
    setConnected(false);
    setMessages(prev => [...prev, { type: "system", text: "Disconnected from server", time: new Date() }]);
  };

  const sendMessage = () => {
    if (inputMessage.trim() && connected) {
      setMessages(prev => [...prev, 
        { type: "sent", text: inputMessage, time: new Date() },
        { type: "received", text: `Echo: ${inputMessage}`, time: new Date() }
      ]);
      setInputMessage("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Interactive WebSocket Lab
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={connected ? disconnect : connect}
            variant={connected ? "destructive" : "default"}
          >
            {connected ? "Disconnect" : "Connect"}
          </Button>
          <Badge variant={connected ? "default" : "secondary"}>
            {connected ? "Connected" : "Disconnected"}
          </Badge>
        </div>

        <div className="border rounded p-4 h-48 overflow-y-auto bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className={`text-sm mb-2 ${
              msg.type === "system" ? "text-gray-500 italic" :
              msg.type === "sent" ? "text-blue-600" : "text-green-600"
            }`}>
              <span className="text-xs text-gray-400">
                {msg.time.toLocaleTimeString()}
              </span> {msg.text}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            disabled={!connected}
            className="flex-1 px-3 py-2 border rounded"
          />
          <Button onClick={sendMessage} disabled={!connected}>
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function SocketWiki() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-6 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Socket Wiki</h1>
          <p className="text-muted-foreground">
            Learn WebSockets through interactive examples and visualizations
          </p>
        </div>

        <Tabs defaultValue="basics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="handshake">Handshake</TabsTrigger>
            <TabsTrigger value="code">Code Examples</TabsTrigger>
            <TabsTrigger value="lab">Mini Lab</TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  What are WebSockets?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  WebSockets provide a persistent, full-duplex communication channel between 
                  a client and server. Unlike traditional HTTP requests, WebSockets maintain 
                  an open connection allowing real-time data exchange.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded">
                    <h4 className="font-semibold text-green-600 mb-2">✅ WebSocket Benefits</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Real-time bidirectional communication</li>
                      <li>• Lower latency than HTTP polling</li>
                      <li>• Reduced server overhead</li>
                      <li>• Native browser support</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <h4 className="font-semibold text-blue-600 mb-2">🔧 Common Use Cases</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Chat applications</li>
                      <li>• Live data feeds</li>
                      <li>• Gaming applications</li>
                      <li>• Collaborative editing</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="handshake" className="space-y-6">
            <WebSocketAnimation />
            
            <Card>
              <CardHeader>
                <CardTitle>Handshake Process Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">1. Client Request</h4>
                    <pre className="text-xs bg-gray-100 p-2 rounded">
{`GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13`}
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">2. Server Response</h4>
                    <pre className="text-xs bg-gray-100 p-2 rounded">
{`HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CodeExample
                title="Client-Side WebSocket"
                code={`// Create WebSocket connection
const socket = new WebSocket('ws://localhost:3001');

// Connection opened
socket.addEventListener('open', (event) => {
  console.log('Connected to server');
  socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', (event) => {
  console.log('Message from server:', event.data);
});

// Handle errors
socket.addEventListener('error', (error) => {
  console.error('WebSocket error:', error);
});

// Connection closed
socket.addEventListener('close', (event) => {
  console.log('Connection closed');
});`}
              />
              
              <CodeExample
                title="Server-Side (Node.js)"
                code={`import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  // Send welcome message
  ws.send('Welcome to the server!');
  
  // Handle incoming messages
  ws.on('message', (data) => {
    console.log('Received:', data.toString());
    
    // Echo message back to client
    ws.send(\`Echo: \${data}\`);
  });
  
  // Handle disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});`}
              />
            </div>
          </TabsContent>

          <TabsContent value="lab" className="space-y-6">
            <MiniLab />
            
            <Card>
              <CardHeader>
                <CardTitle>Lab Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Click "Connect" to establish a WebSocket connection</li>
                  <li>Type a message in the input field and press Enter or click "Send"</li>
                  <li>Observe how messages are sent and echoed back in real-time</li>
                  <li>Try disconnecting and reconnecting to see connection states</li>
                  <li>Notice the timestamps showing real-time communication</li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}