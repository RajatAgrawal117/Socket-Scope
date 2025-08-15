import { dbService } from '../services/dbService.js';

export const getMessages = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const messages = await dbService.getMessages(parseInt(limit));
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessageHistory = async (req, res) => {
  try {
    const { fromClient, toClient, limit = 50 } = req.query;
    const messages = await dbService.getMessageHistory(fromClient, toClient, parseInt(limit));
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};