# SocketScope - Real-Time WebSocket Connection Visualizer

A comprehensive WebSocket monitoring and visualization platform with Kafka message streaming, PostgreSQL persistence, and educational content.

## 🚀 Features

### ✅ Completed Features

#### **Core Infrastructure**
- ✅ **Docker Setup**: Full docker-compose with Kafka, Zookeeper, Redis, PostgreSQL
- ✅ **Backend**: Express + Socket.IO server with proper architecture
- ✅ **Frontend**: React + Vite with routing and modern UI components
- ✅ **Real-time WebSocket**: Socket.IO handling connections and messages

#### **Database Integration**
- ✅ **PostgreSQL**: Complete schema with connections, messages, and users tables
- ✅ **Data Persistence**: Connection and message history storage
- ✅ **Database Service**: Full CRUD operations for all entities

#### **Authentication & Security**
- ✅ **JWT Authentication**: Login/register with role-based access
- ✅ **Protected Routes**: Middleware for route protection
- ✅ **User Management**: Admin user creation and management

#### **Advanced Observability**
- ✅ **Prometheus Integration**: Custom metrics for WebSocket, Kafka, and DB
- ✅ **Grafana Dashboards**: Pre-configured monitoring dashboards
- ✅ **Metrics Endpoint**: `/api/prometheus` for metrics scraping

#### **Production Features**
- ✅ **Message Replay**: Historical message playback functionality
- ✅ **Error Handling**: Comprehensive error middleware
- ✅ **Connection History**: Track connection lifecycle
- ✅ **Advanced Logging**: Structured logging with Winston

#### **Educational Content**
- ✅ **Socket Wiki**: Interactive WebSocket tutorials
- ✅ **Visual Learning**: Step-by-step WebSocket handshake animation
- ✅ **Mini Lab**: Interactive WebSocket testing environment
- ✅ **Code Examples**: Client and server implementation samples

#### **Frontend Features**
- ✅ **Dashboard**: Real-time network visualization with D3.js
- ✅ **Metrics Page**: Comprehensive performance monitoring
- ✅ **Replay Interface**: Time-range selection and replay controls
- ✅ **Login System**: Authentication UI with demo credentials

## 🛠 Tech Stack

**Frontend**
- React.js + Vite
- D3.js (network visualization)
- TailwindCSS + shadcn/ui
- Zustand (state management)
- React Router

**Backend**
- Node.js + Express.js
- Socket.IO for WebSocket handling
- Kafka (Apache Kafka + kafkajs)
- PostgreSQL (pg driver)
- JWT authentication
- Prometheus metrics

**Infrastructure**
- Docker + Docker Compose
- Kafka + Zookeeper
- PostgreSQL
- Redis
- Prometheus + Grafana

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd Socket-Scope/Socket-Scope
```

### 2. Start Infrastructure
```bash
# Start all services
npm run docker:up

# Or start individual services
docker-compose up -d postgres kafka redis prometheus grafana
```

### 3. Install Dependencies
```bash
# Install all dependencies
npm run install:all
```

### 4. Create Admin User
```bash
# Create default admin user (admin/password)
cd backend && npm run create-admin
```

### 5. Start Development
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:backend  # Backend on :3001
npm run dev:frontend # Frontend on :5173
```

## 📊 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin)

## 🔐 Authentication

### Demo Credentials
- **Username**: `admin`
- **Password**: `password`

### API Endpoints
```bash
# Register new user
POST /api/auth/register
{
  "username": "user",
  "password": "password",
  "role": "user"
}

# Login
POST /api/auth/login
{
  "username": "admin",
  "password": "password"
}
```

## 📈 Monitoring & Metrics

### Prometheus Metrics
- `websocket_active_connections` - Active WebSocket connections
- `websocket_messages_total` - Total messages processed
- `websocket_message_latency_seconds` - Message processing latency
- `database_queries_total` - Database query count
- `kafka_messages_total` - Kafka message count

### Grafana Dashboards
Pre-configured dashboards available at http://localhost:3000:
- WebSocket Connection Monitoring
- Message Throughput Analysis
- Database Performance
- System Resource Usage

## 🔄 Message Replay

### Instant Replay
```bash
POST /api/replay
{
  "fromTimestamp": "2024-01-01T00:00:00Z",
  "toTimestamp": "2024-01-01T01:00:00Z",
  "clientId": "optional-client-filter"
}
```

### Scheduled Replay
```bash
POST /api/replay/schedule
{
  "fromTimestamp": "2024-01-01T00:00:00Z",
  "toTimestamp": "2024-01-01T01:00:00Z",
  "intervalMs": 1000
}
```

## 🏗 Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Frontend  │────│   Backend    │────│ PostgreSQL  │
│  (React)    │    │ (Express+IO) │    │             │
└─────────────┘    └──────────────┘    └─────────────┘
                           │
                   ┌───────┴───────┐
                   │               │
            ┌─────────────┐ ┌─────────────┐
            │    Kafka    │ │ Prometheus  │
            │             │ │   Grafana   │
            └─────────────┘ └─────────────┘
```

## 🔧 Development

### Environment Variables
```bash
# Backend (.env)
PORT=3001
KAFKA_BROKERS=localhost:9092
REDIS_URL=redis://localhost:6379
DB_URL=postgresql://postgres:password@localhost:5432/socketscope
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
```

### Database Schema
- **connections**: Client connection tracking
- **messages**: Message history and metadata
- **users**: Authentication and user management

### API Routes
- `GET /api/health` - Health check
- `GET /api/prometheus` - Prometheus metrics
- `GET /api/connections` - Active connections
- `GET /api/metrics` - Application metrics
- `POST /api/auth/*` - Authentication endpoints
- `POST /api/replay/*` - Message replay endpoints

## 📚 Socket Wiki

Interactive educational content available at `/wiki`:
- **Basics**: WebSocket fundamentals and use cases
- **Handshake**: Visual WebSocket handshake process
- **Code Examples**: Client and server implementations
- **Mini Lab**: Interactive WebSocket testing environment

## 🐳 Docker Services

```yaml
services:
  - postgres:5432    # Database
  - kafka:9092       # Message streaming
  - zookeeper:2181   # Kafka coordination
  - redis:6379       # Caching
  - prometheus:9090  # Metrics collection
  - grafana:3000     # Monitoring dashboards
  - backend:3001     # API server
  - frontend:5173    # Web interface
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**SocketScope** - Real-time WebSocket monitoring made simple and educational! 🚀