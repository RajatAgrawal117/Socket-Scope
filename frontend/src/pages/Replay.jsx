import { useState, useEffect } from "react";
import { Header } from "../components/Header.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";
import { Badge } from "../components/ui/badge.jsx";
import { Play, Pause, RotateCcw, Clock, MessageSquare } from "lucide-react";

export default function Replay() {
  const [timeRanges, setTimeRanges] = useState(null);
  const [selectedRange, setSelectedRange] = useState({ from: "", to: "" });
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayStatus, setReplayStatus] = useState(null);

  useEffect(() => {
    fetchTimeRanges();
  }, []);

  const fetchTimeRanges = async () => {
    try {
      const response = await fetch("/api/replay/ranges");
      const data = await response.json();
      setTimeRanges(data);
      
      if (data.earliest && data.latest) {
        const from = new Date(data.latest);
        from.setHours(from.getHours() - 1);
        setSelectedRange({
          from: from.toISOString().slice(0, 16),
          to: new Date(data.latest).toISOString().slice(0, 16)
        });
      }
    } catch (error) {
      console.error("Failed to fetch time ranges:", error);
    }
  };

  const startReplay = async () => {
    if (!selectedRange.from || !selectedRange.to) return;

    setIsReplaying(true);
    try {
      const response = await fetch("/api/replay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromTimestamp: selectedRange.from,
          toTimestamp: selectedRange.to
        })
      });

      const result = await response.json();
      setReplayStatus(result);
    } catch (error) {
      console.error("Replay failed:", error);
      setReplayStatus({ success: false, error: error.message });
    } finally {
      setIsReplaying(false);
    }
  };

  const scheduleReplay = async () => {
    if (!selectedRange.from || !selectedRange.to) return;

    setIsReplaying(true);
    try {
      const response = await fetch("/api/replay/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromTimestamp: selectedRange.from,
          toTimestamp: selectedRange.to,
          intervalMs: 1000
        })
      });

      const result = await response.json();
      setReplayStatus(result);
    } catch (error) {
      console.error("Scheduled replay failed:", error);
      setReplayStatus({ success: false, error: error.message });
    } finally {
      setIsReplaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-6 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Message Replay</h1>
          <p className="text-muted-foreground">
            Replay historical WebSocket messages for analysis and debugging
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time Range Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {timeRanges && (
                <div className="p-4 bg-muted rounded-md">
                  <h4 className="font-medium mb-2">Available Data Range</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Earliest:</strong> {new Date(timeRanges.earliest).toLocaleString()}<br />
                    <strong>Latest:</strong> {new Date(timeRanges.latest).toLocaleString()}<br />
                    <strong>Total Messages:</strong> {timeRanges.total?.toLocaleString()}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">From</label>
                  <input
                    type="datetime-local"
                    value={selectedRange.from}
                    onChange={(e) => setSelectedRange(prev => ({ ...prev, from: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">To</label>
                  <input
                    type="datetime-local"
                    value={selectedRange.to}
                    onChange={(e) => setSelectedRange(prev => ({ ...prev, to: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={startReplay} 
                  disabled={isReplaying || !selectedRange.from || !selectedRange.to}
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isReplaying ? "Replaying..." : "Instant Replay"}
                </Button>
                
                <Button 
                  onClick={scheduleReplay} 
                  disabled={isReplaying || !selectedRange.from || !selectedRange.to}
                  variant="outline"
                  className="flex-1"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Scheduled Replay
                </Button>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    const now = new Date();
                    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
                    setSelectedRange({
                      from: oneHourAgo.toISOString().slice(0, 16),
                      to: now.toISOString().slice(0, 16)
                    });
                  }}
                  variant="outline"
                  size="sm"
                >
                  Last Hour
                </Button>
                
                <Button 
                  onClick={() => {
                    const now = new Date();
                    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                    setSelectedRange({
                      from: oneDayAgo.toISOString().slice(0, 16),
                      to: now.toISOString().slice(0, 16)
                    });
                  }}
                  variant="outline"
                  size="sm"
                >
                  Last 24h
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Replay Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {replayStatus ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={replayStatus.success ? "default" : "destructive"}>
                      {replayStatus.success ? "Success" : "Failed"}
                    </Badge>
                    {replayStatus.success && (
                      <span className="text-sm text-muted-foreground">
                        {replayStatus.messageCount} messages replayed
                      </span>
                    )}
                  </div>

                  {replayStatus.error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                      <p className="text-sm text-destructive">{replayStatus.error}</p>
                    </div>
                  )}

                  <Button 
                    onClick={() => setReplayStatus(null)} 
                    variant="outline" 
                    size="sm"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear Status
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a time range and start replay to see status here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How Message Replay Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Instant Replay</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Immediately replays all messages from the selected time range through Kafka topics.
                  Messages are marked with replay flags and original timestamps.
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Fast bulk replay</li>
                  <li>• Preserves original timing data</li>
                  <li>• Useful for batch analysis</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Scheduled Replay</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Replays messages with controlled timing intervals, simulating the original 
                  message flow for real-time analysis and debugging.
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Controlled timing intervals</li>
                  <li>• Simulates real-time flow</li>
                  <li>• Better for debugging scenarios</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}