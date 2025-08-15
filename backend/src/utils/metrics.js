import client from 'prom-client';

const register = new client.Registry();

export const connectionsGauge = new client.Gauge({
  name: 'socketscope_active_connections',
  help: 'Number of active WebSocket connections',
  registers: [register]
});

export const messagesCounter = new client.Counter({
  name: 'socketscope_messages_total',
  help: 'Total number of messages processed',
  registers: [register]
});

client.collectDefaultMetrics({ register });