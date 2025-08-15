import { publishMessage } from '../kafka/producer.js';
import { config } from '../config/index.js';

class MetricsService {
  constructor() {
    this.metrics = {
      totalConnections: 0,
      activeConnections: 0,
      messagesPerSecond: 0,
      avgLatency: 0,
      errorRate: 0,
      bytesPerSecond: 0,
      topTalkers: []
    };
    this.messageCount = 0;
    this.startTime = Date.now();
  }

  updateMetrics(data) {
    this.metrics = { ...this.metrics, ...data };
    publishMessage(config.kafka.topics.metrics, this.metrics);
  }

  incrementMessages() {
    this.messageCount++;
    const elapsed = (Date.now() - this.startTime) / 1000;
    this.metrics.messagesPerSecond = Math.round(this.messageCount / elapsed);
  }

  getMetrics() {
    return this.metrics;
  }
}

export const metricsService = new MetricsService();