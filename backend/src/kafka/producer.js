import { Kafka } from 'kafkajs';
import { config } from '../config/index.js';

const kafka = new Kafka({
  clientId: 'socketscope-producer',
  brokers: config.kafka.brokers
});

export const producer = kafka.producer();

export const publishMessage = async (topic, message) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }]
    });
  } catch (error) {
    console.error('Kafka publish error:', error);
  }
};