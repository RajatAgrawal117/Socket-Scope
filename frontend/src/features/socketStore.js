import { create } from "zustand";

const initialMetrics = {
  totalConnections: 0,
  activeConnections: 0,
  messagesPerSecond: 0,
  avgLatency: 0,
  errorRate: 0,
  bytesPerSecond: 0,
  topTalkers: [],
};

export const useSocketStore = create((set, get) => ({
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

  setMessages: (messages) => set({ messages }),

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
