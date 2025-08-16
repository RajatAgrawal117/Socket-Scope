import { io } from 'socket.io-client';

const socket = io('http://localhost:8080', {
  query: { appName: 'ClientA', version: '1.0.0' }
});

socket.on('connect', () => {
  console.log('🟢 Client A connected:', socket.id);
  
  // Wait 2 seconds then send P2P message
  setTimeout(() => {
    console.log('📤 Client A sending message to Client B...');
    socket.emit('message', {
      to: 'client-b',
      content: 'Hello from Client A! This is a P2P message.',
      type: 'p2p',
      timestamp: new Date()
    });
  }, 2000);
});

socket.on('message_received', (data) => {
  console.log('📨 Client A received P2P message:', {
    from: data.from,
    content: data.content,
    type: data.type
  });
});

socket.on('disconnect', () => {
  console.log('🔴 Client A disconnected');
});

// Keep the process running
process.stdin.resume();