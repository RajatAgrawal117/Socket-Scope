import { dbService } from '../services/dbService.js';
import { connectionService } from '../services/connectionService.js';

export const getMetrics = async (req, res) => {
  try {
    const connections = await dbService.getConnections();
    const messages = await dbService.getMessages(100);
    
    const activeConnections = connections.filter(c => c.status === 'connected').length;
    const totalMessages = messages.length;
    const avgLatency = messages.reduce((sum, m) => sum + (m.latency_ms || 0), 0) / totalMessages || 0;
    const errorRate = messages.filter(m => m.status === 'error').length / totalMessages || 0;
    
    res.json({
      totalConnections: connections.length,
      activeConnections,
      messagesPerSecond: totalMessages / 60,
      avgLatency,
      errorRate,
      bytesPerSecond: messages.reduce((sum, m) => sum + (m.size_bytes || 0), 0) / 60
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};