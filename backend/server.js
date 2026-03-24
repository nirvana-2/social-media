const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Import database connections
const sequelize = require('./config/database');
const connectMongo = require('./config/mongodb');
const redisClient = require('./config/redis');

// Import routes
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');

const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');
const followRoutes = require('./routes/follow');

const likesRoutes = require('./routes/likes');
const commentsRoutes = require('./routes/comments');
const messagesRoutes = require('./routes/messages');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

// Middleware
app.use(express.json({ limit: process.env.MAX_UPLOAD_SIZE || '10mb' }));
app.use(express.urlencoded({ limit: process.env.MAX_UPLOAD_SIZE || '10mb', extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Serve static files
app.use(express.static('public'));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/follow', followRoutes);

app.use('/api/likes', likesRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/messages', messagesRoutes);

// Socket.io connection
require('./sockets/messageSocket')(io);

// Store io instance for use in routes
app.set('io', io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to PostgreSQL
    await sequelize.authenticate();
    console.log('✓ PostgreSQL connected');

    // Sync models
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✓ Database models synced');

    // Connect to MongoDB
    await connectMongo();
    console.log('✓ MongoDB connected');

    // Connect to Redis
    redisClient.connect().catch((err) => {
      console.warn('Redis connection deferred (non-critical):', err.message);
    });

    // Start server
    const PORT = process.env.PORT || 8080;
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`\n✓ Server running on http://0.0.0.0:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();