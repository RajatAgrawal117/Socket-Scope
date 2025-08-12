import { Header } from "../components/Header.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import { Badge } from "../components/ui/badge.jsx";
import { useSocketStore } from "../features/socketStore.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Clock, AlertTriangle, Users } from "lucide-react";

export default function Metrics() {
  const { metrics, connections } = useSocketStore();

  // Mock time series data for charts
  const timeSeriesData = Array.from({ length: 24 }, (_, i) => ({
    time: `${23 - i}:00`,
    messages: Math.floor(Math.random() * 100) + 20,
    latency: Math.floor(Math.random() * 50) + 50,
    errors: Math.floor(Math.random() * 5),
    connections: Math.floor(Math.random() * 20) + 10,
  })).reverse();

  const statusData = [
    {
      name: "Connected",
      value: connections.filter((c) => c.status === "connected").length,
      color: "#3b82f6",
    },
    {
      name: "Disconnected",
      value: connections.filter((c) => c.status === "disconnected").length,
      color: "#6b7280",
    },
    {
      name: "Error",
      value: connections.filter((c) => c.status === "error").length,
      color: "#ef4444",
    },
  ];

  const topTalkersData = metrics.topTalkers.map((talker) => ({
    client: talker.clientId.slice(0, 8),
    messages: talker.messageCount,
    bytes: talker.bytesTransferred,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-6 py-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Detailed Metrics</h2>
          <p className="text-muted-foreground">
            Comprehensive analytics for your WebSocket connections
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Peak Connections
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.max(...timeSeriesData.map((d) => d.connections))}
              </div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Peak Messages/min
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.max(...timeSeriesData.map((d) => d.messages))}
              </div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Min Latency</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.min(...timeSeriesData.map((d) => d.latency))}ms
              </div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Errors
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {timeSeriesData.reduce((sum, d) => sum + d.errors, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Message Throughput Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Message Throughput (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="messages"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Latency Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Average Latency (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="latency"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Connection Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Connection Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Talkers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Talkers (Message Count)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topTalkersData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="client"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar dataKey="messages" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        <Card>
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.avgLatency > 150 && (
                <div className="flex items-center gap-2 p-3 border-l-4 border-l-warning bg-warning/5 rounded">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <div>
                    <div className="font-medium">High Latency Detected</div>
                    <div className="text-sm text-muted-foreground">
                      Average latency is {metrics.avgLatency.toFixed(0)}ms
                      (threshold: 150ms)
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    Warning
                  </Badge>
                </div>
              )}

              {metrics.errorRate > 0.05 && (
                <div className="flex items-center gap-2 p-3 border-l-4 border-l-error bg-error/5 rounded">
                  <AlertTriangle className="h-4 w-4 text-error" />
                  <div>
                    <div className="font-medium">High Error Rate</div>
                    <div className="text-sm text-muted-foreground">
                      Error rate is {(metrics.errorRate * 100).toFixed(1)}%
                      (threshold: 5%)
                    </div>
                  </div>
                  <Badge variant="destructive" className="ml-auto">
                    Critical
                  </Badge>
                </div>
              )}

              {metrics.avgLatency <= 150 && metrics.errorRate <= 0.05 && (
                <div className="flex items-center gap-2 p-3 border-l-4 border-l-success bg-success/5 rounded">
                  <div className="h-4 w-4 rounded-full bg-success"></div>
                  <div>
                    <div className="font-medium">All Systems Operational</div>
                    <div className="text-sm text-muted-foreground">
                      No critical alerts at this time
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-auto text-success">
                    Normal
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
