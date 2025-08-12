import { create } from "zustand";

export interface ConnectionNode {
  id: string;
  clientId: string;
  ip: string;
  connectedAt: number;
  lastActivity: number;
  status: "connected" | "disconnected" | "error";
  messageCount: number;
  bytesTransferred: number;
  latency: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface MessageFlow {
  id: string;
  from: string;
  to: string;
  timestamp: number;
  size: number;
  type: string;
  status: "success" | "error" | "pending";
}

export interface MetricsData {
  totalConnections: number;
  activeConnections: number;
  messagesPerSecond: number;
  avgLatency: number;
  errorRate: number;
  bytesPerSecond: number;
  topTalkers: Array<{
    clientId: string;
    messageCount: number;
    bytesTransferred: number;
  }>;
}

interface SocketStore {
  connections: ConnectionNode[];
  messages: MessageFlow[];
  metrics: MetricsData;
  isConnected: boolean;
  selectedConnection: string | null;

  // Actions
  setConnections: (connections: ConnectionNode[]) => void;
  addConnection: (connection: ConnectionNode) => void;
  removeConnection: (clientId: string) => void;
  updateConnection: (
    clientId: string,
    updates: Partial<ConnectionNode>,
  ) => void;
  addMessage: (message: MessageFlow) => void;
  updateMetrics: (metrics: Partial<MetricsData>) => void;
  setSelectedConnection: (clientId: string | null) => void;
  setConnectedStatus: (connected: boolean) => void;
}

const initialMetrics: MetricsData = {
  totalConnections: 0,
  activeConnections: 0,
  messagesPerSecond: 0,
  avgLatency: 0,
  errorRate: 0,
  bytesPerSecond: 0,
  topTalkers: [],
};

export const useSocketStore = create<SocketStore>((set, get) => ({
  connections: [],
  messages: [],
  metrics: initialMetrics,
  isConnected: false,
  selectedConnection: null,

  setConnections: (connections) => set({ connections }),

  addConnection: (connection) =>
    set((state) => ({
      connections: [...state.connections, connection],
    })),

  removeConnection: (clientId) =>
    set((state) => ({
      connections: state.connections.filter(
        (conn) => conn.clientId !== clientId,
      ),
    })),

  updateConnection: (clientId, updates) =>
    set((state) => ({
      connections: state.connections.map((conn) =>
        conn.clientId === clientId ? { ...conn, ...updates } : conn,
      ),
    })),

  addMessage: (message) =>
    set((state) => ({
      messages: [message, ...state.messages.slice(0, 99)], // Keep last 100 messages
    })),

  updateMetrics: (metrics) =>
    set((state) => ({
      metrics: { ...state.metrics, ...metrics },
    })),

  setSelectedConnection: (clientId) => set({ selectedConnection: clientId }),

  setConnectedStatus: (connected) => set({ isConnected: connected }),
}));
