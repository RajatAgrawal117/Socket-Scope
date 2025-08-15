class ConnectionService {
  constructor() {
    this.connections = new Map();
  }

  addConnection(clientId, socket) {
    this.connections.set(clientId, {
      clientId,
      ip: socket.handshake.address,
      joinTime: new Date(),
      messageCount: 0,
      lastActivity: new Date()
    });
  }

  removeConnection(clientId) {
    this.connections.delete(clientId);
  }

  updateConnection(clientId, updates) {
    const conn = this.connections.get(clientId);
    if (conn) {
      this.connections.set(clientId, { ...conn, ...updates });
    }
  }

  getConnections() {
    return Array.from(this.connections.values());
  }

  getConnectionCount() {
    return this.connections.size;
  }
}

export const connectionService = new ConnectionService();