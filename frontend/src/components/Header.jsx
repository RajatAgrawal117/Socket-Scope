import { Badge } from "./ui/badge.jsx";
import { Button } from "./ui/button.jsx";
import { useSocketStore } from "../features/socketStore.js";
import { Activity, Wifi, WifiOff } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  const { isConnected, metrics } = useSocketStore();

  return (
    <header className="border-b border-border bg-gradient-to-r from-background via-background to-background/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  SocketScope
                </h1>
                <p className="text-xs text-muted-foreground">
                  WebSocket Monitor
                </p>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/" className="px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                Dashboard
              </Link>
              <Link to="/connect" className="px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                Connect
              </Link>
              <Link to="/test" className="px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                Test Lab
              </Link>
              <Link to="/metrics" className="px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                Metrics
              </Link>
              <Link to="/replay" className="px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                Replay
              </Link>
              <Link to="/wiki" className="px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                Wiki
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
