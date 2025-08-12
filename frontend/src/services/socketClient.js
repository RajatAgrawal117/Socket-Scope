// SocketClient for demo purposes - disabled auto-connect
// import io from 'socket.io-client';
import { useSocketStore } from "../features/socketStore.js";

class SocketClient {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.isConnected = false;
  }

  connect() {
    console.log("Socket client connect method called - demo mode");
    // For demo purposes, simulate connection
    this.isConnected = true;
    const store = useSocketStore.getState();
    store.setConnectedStatus(false); // Show disconnected for demo
  }

  disconnect() {
    console.log("Socket client disconnect method called");
    this.isConnected = false;
  }

  sendMessage(type, data) {
    console.log("Socket client sendMessage called:", { type, data });
  }
}

// Create singleton instance
export const socketClient = new SocketClient();

// Don't auto-connect for demo
// socketClient.connect();
