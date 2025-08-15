import { dbService } from './dbService.js';
import { publishMessage } from '../kafka/producer.js';
import { config } from '../config/index.js';

export const replayService = {
  async replayMessages(fromTimestamp, toTimestamp, clientId = null) {
    try {
      const messages = await dbService.getMessagesByTimeRange(fromTimestamp, toTimestamp, clientId);
      
      for (const message of messages) {
        await publishMessage(config.kafka.topics.replay, {
          ...message,
          isReplay: true,
          originalTimestamp: message.timestamp,
          replayTimestamp: new Date()
        });
      }
      
      return { success: true, messageCount: messages.length };
    } catch (error) {
      console.error('Replay error:', error);
      throw error;
    }
  },

  async getReplayableTimeRanges() {
    try {
      const result = await dbService.getMessageTimeRanges();
      return result;
    } catch (error) {
      console.error('Error getting replay ranges:', error);
      throw error;
    }
  },

  async scheduleReplay(fromTimestamp, toTimestamp, intervalMs = 1000) {
    const messages = await dbService.getMessagesByTimeRange(fromTimestamp, toTimestamp);
    
    return new Promise((resolve) => {
      let index = 0;
      const interval = setInterval(async () => {
        if (index >= messages.length) {
          clearInterval(interval);
          resolve({ success: true, messageCount: messages.length });
          return;
        }

        const message = messages[index];
        await publishMessage(config.kafka.topics.replay, {
          ...message,
          isReplay: true,
          originalTimestamp: message.timestamp,
          replayTimestamp: new Date()
        });
        
        index++;
      }, intervalMs);
    });
  }
};