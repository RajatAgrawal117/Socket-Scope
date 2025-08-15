import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  kafka: {
    brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
    topics: {
      messages: 'socket-messages',
      metrics: 'socket-metrics'
    }
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  }
};