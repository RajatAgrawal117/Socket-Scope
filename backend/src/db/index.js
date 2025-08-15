import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

export const query = (text, params) => pool.query(text, params);

export const initDB = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS connections (
        id SERIAL PRIMARY KEY,
        client_id VARCHAR(255) UNIQUE NOT NULL,
        ip_address INET,
        connected_at TIMESTAMP DEFAULT NOW(),
        disconnected_at TIMESTAMP,
        status VARCHAR(50) DEFAULT 'connected',
        message_count INTEGER DEFAULT 0,
        bytes_transferred BIGINT DEFAULT 0,
        last_activity TIMESTAMP DEFAULT NOW()
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        from_client VARCHAR(255) NOT NULL,
        to_client VARCHAR(255),
        content TEXT,
        message_type VARCHAR(50) DEFAULT 'data',
        size_bytes INTEGER,
        timestamp TIMESTAMP DEFAULT NOW(),
        status VARCHAR(50) DEFAULT 'success',
        latency_ms FLOAT,
        kafka_offset BIGINT
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_connections_client_id ON connections(client_id);
      CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
      CREATE INDEX IF NOT EXISTS idx_messages_clients ON messages(from_client, to_client);
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};