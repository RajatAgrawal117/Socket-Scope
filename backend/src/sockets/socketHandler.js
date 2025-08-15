import { connectionService } from '../services/connectionService.js';
import { metricsService } from '../services/metricsService.js';
import { dbService } from '../services/dbService.js';
import { publishMessage } from '../kafka/producer.js';
import { config } from '../config/index.js';
import { metrics } from '../metrics/prometheus.js';

export const handleConnection = (io) => {
  io.on('connection', async (socket) => {
    const clientId = socket.id;
    const ipAddress = socket.handshake.address;
    
    try {
      await dbService.saveConnection(clientId, ipAddress);
      connectionService.addConnection(clientId, socket);
      
      const activeCount = connectionService.getConnectionCount();
      metricsService.updateMetrics({ activeConnections: activeCount });
      metrics.activeConnections.set(activeCount);

      io.emit('connection_update', connectionService.getConnections());

      // Publish connection event to Kafka
      try {
        publishMessage(config.kafka.topics.connections, {
          clientId,
          ipAddress,
          timestamp: new Date(),
          type: 'connected'
        });
      } catch (kafkaError) {
        console.warn('Kafka publish for new connection failed:', kafkaError.message);
      }
    } catch (error) {
      console.error('Error saving connection:', error);
    }

    socket.on('message', async (data) => {
      const message = {
        clientId,
        data,
        timestamp: new Date(),
        type: 'message'
      };

      try {
        const startTime = Date.now();
        
        await dbService.saveMessage({
          from_client: clientId,
          to_client: data.to || null,
          content: JSON.stringify(data),
          message_type: data.type || 'data',
          size_bytes: JSON.stringify(data).length,
          status: 'success',
          latency_ms: data.latency || null
        });

        await dbService.updateConnection(clientId, {
          message_count: (connectionService.connections.get(clientId)?.messageCount || 0) + 1
        });

        try {
          publishMessage(config.kafka.topics.messages, message);
        } catch (kafkaError) {
          console.warn('Kafka publish failed:', kafkaError.message);
        }
        metricsService.incrementMessages();
        
        // Prometheus metrics
        metrics.totalMessages.inc({ type: data.type || 'data', status: 'success' });
        metrics.messageLatency.observe((Date.now() - startTime) / 1000);
        
        connectionService.updateConnection(clientId, { 
          lastActivity: new Date(),
          messageCount: (connectionService.connections.get(clientId)?.messageCount || 0) + 1
        });

        // Route message to specific client or broadcast
        if (data.to && data.to !== 'broadcast') {
          // Send to specific client
          const targetSocket = Array.from(io.sockets.sockets.values())
            .find(s => s.id === data.to);
          
          if (targetSocket) {
            targetSocket.emit('message_received', {
              ...message,
              from: clientId
            });
          }
        } else {
          // Broadcast to all clients except sender
          socket.broadcast.emit('message_received', {
            ...message,
            from: clientId
          });
        }

        // Update dashboard
        io.emit('message_update', message);
      } catch (error) {
        console.error('Error handling message:', error);
        metrics.totalMessages.inc({ type: data.type || 'data', status: 'error' });
      }
    });

    socket.on('disconnect', async () => {
      try {
        await dbService.disconnectConnection(clientId);
        connectionService.removeConnection(clientId);
        
        const activeCount = connectionService.getConnectionCount();
        metricsService.updateMetrics({ activeConnections: activeCount });
        metrics.activeConnections.set(activeCount);
        
        io.emit('connection_update', connectionService.getConnections());
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });
  });
};