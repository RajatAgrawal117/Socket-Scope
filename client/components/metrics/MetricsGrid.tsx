import { useSocketStore } from "@/store/socketStore";
import { MetricsCard } from "./MetricsCard";
import {
  Users,
  MessageSquare,
  Clock,
  AlertTriangle,
  Database,
  TrendingUp,
} from "lucide-react";

export function MetricsGrid() {
  const { metrics } = useSocketStore();

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      <MetricsCard
        title="Active Connections"
        value={metrics.activeConnections}
        icon={Users}
        description="Currently connected clients"
        valueColor="info"
      />

      <MetricsCard
        title="Total Connections"
        value={metrics.totalConnections}
        icon={Database}
        description="All-time connections"
        valueColor="default"
      />

      <MetricsCard
        title="Messages/sec"
        value={metrics.messagesPerSecond.toFixed(1)}
        icon={MessageSquare}
        description="Real-time message throughput"
        valueColor="success"
      />

      <MetricsCard
        title="Avg Latency"
        value={`${metrics.avgLatency.toFixed(0)}ms`}
        icon={Clock}
        description="Average response time"
        valueColor={metrics.avgLatency > 100 ? "warning" : "success"}
      />

      <MetricsCard
        title="Error Rate"
        value={`${(metrics.errorRate * 100).toFixed(1)}%`}
        icon={AlertTriangle}
        description="Failed message percentage"
        valueColor={metrics.errorRate > 0.05 ? "error" : "success"}
      />

      <MetricsCard
        title="Throughput"
        value={formatBytes(metrics.bytesPerSecond) + "/s"}
        icon={TrendingUp}
        description="Data transfer rate"
        valueColor="info"
      />
    </div>
  );
}
