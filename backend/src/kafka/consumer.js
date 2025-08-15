import { Kafka } from 'kafkajs';
import { config } from '../config/index.js';

const kafka = new Kafka({
  clientId: 'socketscope-consumer',
  brokers: config.kafka.brokers
});

export const consumer = kafka.consumer({ groupId: 'socketscope-group' });
let io = null;

export const setSocketIO = (socketIO) => {
  io = socketIO;
};

export const startConsumer = async () => {
  await consumer.subscribe({ topics: [config.kafka.topics.messages, config.kafka.topics.metrics, config.kafka.topics.replay] });
  
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value.toString());
      console.log(`Received from ${topic}:`, data);
      
      // Forward to WebSocket clients
      if (io) {
        switch (topic) {
          case config.kafka.topics.messages:
            io.emit('kafka_message', data);
            break;
          case config.kafka.topics.metrics:
            io.emit('kafka_metrics', data);
            break;
          case config.kafka.topics.replay:
            io.emit('replay_message', data);
            break;
        }
      }
    }
  });
};