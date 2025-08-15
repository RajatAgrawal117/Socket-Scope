import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('✅ Connected to Socket-Scope backend');
  
  // Send test message
  socket.emit('message', { test: 'Hello Socket-Scope!' });
  
  setTimeout(() => {
    socket.disconnect();
    console.log('✅ Test completed successfully');
    process.exit(0);
  }, 1000);
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection failed:', error.message);
  process.exit(1);
});

socket.on('message_update', (message) => {
  console.log('✅ Received message update:', message);
});

console.log('🔄 Testing Socket-Scope connection...');