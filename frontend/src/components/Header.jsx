import { Badge } from "./ui/badge.jsx";
import { Button } from "./ui/button.jsx";
import { useSocketStore } from "../features/socketStore.js";
import { Activity, Wifi, WifiOff } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  const { isConnected, metrics } = useSocketStore();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-info" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  SocketScope
                </h1>
                <p className="text-sm text-muted-foreground">
                  Real-Time Connection Visualizer
                </p>
              </div>
            </div>
            
            <nav className="flex items-center gap-6 ml-8">
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/metrics" className="text-sm font-medium hover:text-primary transition-colors">
                Metrics
              </Link>
              <Link to="/test" className="text-sm font-medium hover:text-primary transition-colors">
                Test Lab
              </Link>
              <Link to="/wiki" className="text-sm font-medium hover:text-primary transition-colors">
                Socket Wiki
              </Link>
              <Link to="/replay" className="text-sm font-medium hover:text-primary transition-colors">
                Replay
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge
                variant={isConnected ? "default" : "destructive"}
                className="gap-1"
              >
                {isConnected ? (
                  <Wifi className="h-3 w-3" />
                ) : (
                  <WifiOff className="h-3 w-3" />
                )}
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium text-foreground">
                  {metrics.activeConnections}
                </div>
                <div className="text-muted-foreground">Active</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-foreground">
                  {metrics.messagesPerSecond.toFixed(1)}
                </div>
                <div className="text-muted-foreground">Msg/s</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-foreground">
                  {metrics.avgLatency.toFixed(0)}ms
                </div>
                <div className="text-muted-foreground">Latency</div>
              </div>
            </div>

            <Button variant="outline" size="sm">
              Settings
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
