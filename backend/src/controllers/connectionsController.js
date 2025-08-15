import { dbService } from '../services/dbService.js';

export const getConnections = async (req, res) => {
  try {
    const connections = await dbService.getConnections();
    res.json(connections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};