import { query } from '../db/index.js';

export const dbService = {
  async saveConnection(clientId, ipAddress) {
    const result = await query(
      'INSERT INTO connections (client_id, ip_address) VALUES ($1, $2) ON CONFLICT (client_id) DO UPDATE SET connected_at = NOW(), status = $3 RETURNING *',
      [clientId, ipAddress, 'connected']
    );
    return result.rows[0];
  },

  async updateConnection(clientId, updates) {
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 2}`).join(', ');
    const values = [clientId, ...Object.values(updates)];
    const result = await query(
      `UPDATE connections SET ${fields}, last_activity = NOW() WHERE client_id = $1 RETURNING *`,
      values
    );
    return result.rows[0];
  },

  async disconnectConnection(clientId) {
    const result = await query(
      'UPDATE connections SET status = $1, disconnected_at = NOW() WHERE client_id = $2 RETURNING *',
      ['disconnected', clientId]
    );
    return result.rows[0];
  },

  async saveMessage(messageData) {
    const { from_client, to_client, content, message_type, size_bytes, status, latency_ms } = messageData;
    const result = await query(
      'INSERT INTO messages (from_client, to_client, content, message_type, size_bytes, status, latency_ms) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [from_client, to_client, content, message_type, size_bytes, status, latency_ms]
    );
    return result.rows[0];
  },

  async getConnections(limit = 100) {
    const result = await query(
      'SELECT * FROM connections ORDER BY connected_at DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  },

  async getMessages(limit = 100) {
    const result = await query(
      'SELECT * FROM messages ORDER BY timestamp DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  },

  async getConnectionHistory(clientId) {
    const result = await query(
      'SELECT * FROM connections WHERE client_id = $1 ORDER BY connected_at DESC',
      [clientId]
    );
    return result.rows;
  },

  async getMessageHistory(fromClient, toClient, limit = 50) {
    const result = await query(
      'SELECT * FROM messages WHERE (from_client = $1 AND to_client = $2) OR (from_client = $2 AND to_client = $1) ORDER BY timestamp DESC LIMIT $3',
      [fromClient, toClient, limit]
    );
    return result.rows;
  },

  async getMessagesByTimeRange(fromTimestamp, toTimestamp, clientId = null) {
    let queryText = 'SELECT * FROM messages WHERE timestamp BETWEEN $1 AND $2';
    let params = [fromTimestamp, toTimestamp];
    
    if (clientId) {
      queryText += ' AND (from_client = $3 OR to_client = $3)';
      params.push(clientId);
    }
    
    queryText += ' ORDER BY timestamp ASC';
    
    const result = await query(queryText, params);
    return result.rows;
  },

  async getMessageTimeRanges() {
    const result = await query(
      'SELECT MIN(timestamp) as earliest, MAX(timestamp) as latest, COUNT(*) as total FROM messages'
    );
    return result.rows[0];
  }
};