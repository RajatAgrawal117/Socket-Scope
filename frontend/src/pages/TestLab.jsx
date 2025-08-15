import { Header } from "../components/Header.jsx";
import { ClientSimulator } from "../components/ClientSimulator.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx";
import { Badge } from "../components/ui/badge.jsx";
import { Beaker, Zap, MessageCircle, Network } from "lucide-react";

export default function TestLab() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-6 py-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Beaker className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Socket Test Lab</h1>
            <Badge variant="secondary">Live Demo</Badge>
          </div>
          <p className="text-muted-foreground text-lg">
            Test real-time WebSocket communication and see how messages flow through the system.
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <MessageCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold">P2P Messaging</h3>
              <p className="text-sm text-muted-foreground">Send messages between clients</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Network className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold">Real-time Updates</h3>
              <p className="text-sm text-muted-foreground">See connections live</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-semibold">Kafka Integration</h3>
              <p className="text-sm text-muted-foreground">Messages flow through Kafka</p>
            </CardContent>
          </Card>
        </div>

        {/* Client Simulator */}
        <ClientSimulator />

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">1</Badge>
              <div>
                <p className="font-medium">Open Multiple Tabs</p>
                <p className="text-sm text-muted-foreground">Open this page in multiple browser tabs to simulate different clients</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">2</Badge>
              <div>
                <p className="font-medium">Send Messages</p>
                <p className="text-sm text-muted-foreground">Type messages and send them to specific clients or broadcast to all</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">3</Badge>
              <div>
                <p className="font-medium">Watch Dashboard</p>
                <p className="text-sm text-muted-foreground">Go to the Dashboard to see real-time network visualization and message flow</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}