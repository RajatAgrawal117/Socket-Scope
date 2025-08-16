import { io } from 'socket.io-client';

const socket = io('http://localhost:8080', {
  query: { appName: 'ClientB', version: '1.0.0' }
});

socket.on('connect', () => {
  console.log('🟢 Client B connected:', socket.id);
  console.log('⏳ Client B waiting for P2P messages...');
});

socket.on('message_received', (data) => {
  console.log('📨 Client B received P2P message:', {
    from: data.from,
    content: data.content,
    type: data.type
  });
  
  // Auto-reply back to sender
  setTimeout(() => {
    console.log('📤 Client B replying back...');
    socket.emit('message', {
      to: data.from,
      content: 'Hello back from Client B! P2P connection working!',
      type: 'p2p_reply',
      timestamp: new Date()
    });
  }, 1000);
});

socket.on('disconnect', () => {
  console.log('🔴 Client B disconnected');
});

// Keep the process running
process.stdin.resume();