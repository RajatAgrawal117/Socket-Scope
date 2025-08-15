import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { config } from './config/index.js';
import { producer } from './kafka/producer.js';
import { consumer, startConsumer, setSocketIO } from './kafka/consumer.js';
import { handleConnection } from './sockets/socketHandler.js';
import routes from './routes/index.js';
import { logger } from './utils/logger.js';
import { initDB } from './db/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

handleConnection(io);
setSocketIO(io);

const startServer = async () => {
  try {
    await initDB();
    
    // Start server first, then try Kafka
    server.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
    
    // Try Kafka connection with retries
    setTimeout(async () => {
      try {
        await producer.connect();
        await consumer.connect();
        await startConsumer();
        logger.info('Kafka connected successfully');
      } catch (kafkaError) {
        logger.warn('Kafka connection failed, running without Kafka:', kafkaError.message);
      }
    }, 5000);
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  await producer.disconnect();
  await consumer.disconnect();
  process.exit(0);
});

startServer();