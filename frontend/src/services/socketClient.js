import io from 'socket.io-client';
import { useSocketStore } from '../features/socketStore';

class SocketClient {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect() {
    try {
      // Connect to backend WebSocket server
      this.socket = io('ws://localhost:3001', {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.setupEventListeners();
      
    } catch (error) {
      console.error('Failed to connect to WebSocket server:', error);
      this.handleReconnect();
    }
  }

  setupEventListeners() {
    const store = useSocketStore.getState();

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      store.setConnectedStatus(true);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      store.setConnectedStatus(false);
      this.handleReconnect();
    });

    this.socket.on('connection_update', (data) => {
      if (data.type === 'new_connection') {
        store.addConnection(data.connection);
      } else if (data.type === 'disconnection') {
        store.removeConnection(data.clientId);
      } else if (data.type === 'update') {
        store.updateConnection(data.clientId, data.updates);
      }
    });

    this.socket.on('message_update', (message) => {
      store.addMessage(message);
    });

    this.socket.on('metrics_update', (metrics) => {
      store.updateMetrics(metrics);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      store.setConnectedStatus(false);
      this.handleReconnect();
    });
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Send message through WebSocket
  sendMessage(type, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(type, data);
    } else {
      console.warn('Socket not connected, cannot send message');
    }
  }
}

// Create singleton instance
export const socketClient = new SocketClient();

// Auto-connect when module is imported
socketClient.connect();
