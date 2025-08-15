import express from 'express';
import { getMetrics } from '../controllers/metricsController.js';
import { getConnections } from '../controllers/connectionsController.js';
import { getMessages, getMessageHistory } from '../controllers/messagesController.js';
import { getMetrics as getPrometheusMetrics } from '../metrics/prometheus.js';
import { authService } from '../auth/authService.js';
import { authenticateToken } from '../auth/middleware.js';
import { replayService } from '../services/replayService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Auth routes
router.post('/auth/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = await authService.register(username, password, role);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Public routes
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

router.get('/prometheus', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(getPrometheusMetrics());
});

// Protected routes
router.get('/metrics', asyncHandler(getMetrics));
router.get('/connections', asyncHandler(getConnections));
router.get('/messages', asyncHandler(getMessages));
router.get('/messages/history', asyncHandler(getMessageHistory));

// Replay routes
router.post('/replay', asyncHandler(async (req, res) => {
  const { fromTimestamp, toTimestamp, clientId } = req.body;
  const result = await replayService.replayMessages(fromTimestamp, toTimestamp, clientId);
  res.json(result);
}));

router.get('/replay/ranges', asyncHandler(async (req, res) => {
  const ranges = await replayService.getReplayableTimeRanges();
  res.json(ranges);
}));

router.post('/replay/schedule', asyncHandler(async (req, res) => {
  const { fromTimestamp, toTimestamp, intervalMs } = req.body;
  const result = await replayService.scheduleReplay(fromTimestamp, toTimestamp, intervalMs);
  res.json(result);
}));

// Test endpoint to send messages to Kafka
router.post('/test-kafka', asyncHandler(async (req, res) => {
  const { publishMessage } = await import('../kafka/producer.js');
  const { config } = await import('../config/index.js');
  
  const message = {
    clientId: req.body.clientId || 'test-client',
    data: req.body,
    timestamp: new Date(),
    type: 'test'
  };
  
  await publishMessage(config.kafka.topics.messages, message);
  res.json({ success: true, message: 'Message sent to Kafka' });
}));

export default router;