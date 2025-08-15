import { io } from 'socket.io-client';

class SocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect(url = 'http://localhost:3002') {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(url, {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      this.emit('connection_status', true);
      console.log('Connected to SocketScope server');
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      this.emit('connection_status', false);
      console.log('Disconnected from SocketScope server');
    });

    this.socket.on('connection_update', (connections) => {
      this.emit('connections_updated', connections);
    });

    this.socket.on('message_update', (message) => {
      this.emit('message_received', message);
    });

    this.socket.on('kafka_message', (message) => {
      this.emit('kafka_message_received', message);
    });

    this.socket.on('kafka_metrics', (metrics) => {
      this.emit('kafka_metrics_received', metrics);
    });

    this.socket.on('replay_message', (message) => {
      this.emit('replay_message_received', message);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  sendMessage(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('message', data);
    }
  }
}

export const socketClient = new SocketClient();