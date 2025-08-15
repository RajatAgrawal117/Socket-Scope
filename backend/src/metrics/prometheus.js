import client from 'prom-client';

const register = new client.Registry();

// Default metrics
client.collectDefaultMetrics({ register });

// Custom metrics
export const metrics = {
  activeConnections: new client.Gauge({
    name: 'websocket_active_connections',
    help: 'Number of active WebSocket connections',
    registers: [register]
  }),

  totalMessages: new client.Counter({
    name: 'websocket_messages_total',
    help: 'Total number of messages processed',
    labelNames: ['type', 'status'],
    registers: [register]
  }),

  messageLatency: new client.Histogram({
    name: 'websocket_message_latency_seconds',
    help: 'Message processing latency in seconds',
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
    registers: [register]
  }),

  connectionDuration: new client.Histogram({
    name: 'websocket_connection_duration_seconds',
    help: 'Connection duration in seconds',
    buckets: [1, 5, 10, 30, 60, 300, 600, 1800, 3600],
    registers: [register]
  }),

  kafkaMessages: new client.Counter({
    name: 'kafka_messages_total',
    help: 'Total Kafka messages produced/consumed',
    labelNames: ['topic', 'operation'],
    registers: [register]
  }),

  dbQueries: new client.Counter({
    name: 'database_queries_total',
    help: 'Total database queries executed',
    labelNames: ['operation', 'table'],
    registers: [register]
  }),

  dbQueryDuration: new client.Histogram({
    name: 'database_query_duration_seconds',
    help: 'Database query duration in seconds',
    labelNames: ['operation', 'table'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
    registers: [register]
  })
};

export const getMetrics = () => register.metrics();