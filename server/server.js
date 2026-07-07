import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v2 as cloudinary } from 'cloudinary';
import rateLimit from 'express-rate-limit';
import serverless from 'serverless-http';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import serviceRoutes from './routes/services.js';
import bookingRoutes from './routes/bookings.js';
import reviewRoutes from './routes/reviews.js';
import messageRoutes from './routes/messages.js';
import notificationRoutes from './routes/notifications.js';
import adminRoutes from './routes/admin.js';
import nearbyRoutes from './routes/nearby.js';
import reportRoutes from './routes/reports.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const isVercel = process.env.VERCEL === '1';
let dbConnected = false;
let server;

// Track database connection status.
// NOTE: `connectDB` is an imported binding — imports are read-only,
// so it can never be reassigned (that caused the "Assignment to constant
// variable" crash on Vercel). Wrap it in a new function instead.
const initDB = async () => {
  try {
    await connectDB();
    dbConnected = true;
    console.log('✅ Database connected successfully');
  } catch (error) {
    dbConnected = false;
    console.error('❌ Database connection failed:', error.message);
  }
};

initDB();

// Always initialize the io slot on app, even in serverless mode,
// so req.app.get('io') never throws when code elsewhere expects it.
app.set('io', null);

if (!isVercel) {
  server = createServer(app);

  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
    });
    socket.on('disconnect', () => {});
  });

  app.set('io', io);

  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
  });

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
  });
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many uploads, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const messageLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many messages, please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', apiLimiter, userRoutes);
app.use('/api/products', uploadLimiter, productRoutes);
app.use('/api/services', uploadLimiter, serviceRoutes);
app.use('/api/bookings', apiLimiter, bookingRoutes);
app.use('/api/reviews', apiLimiter, reviewRoutes);
app.use('/api/messages', messageLimiter, messageRoutes);
app.use('/api/notifications', apiLimiter, notificationRoutes);
app.use('/api/admin', apiLimiter, adminRoutes);
app.use('/api/listings/nearby', apiLimiter, nearbyRoutes);
app.use('/api/reports', apiLimiter, reportRoutes);

app.get('/api/health', (req, res) => {
  const status = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected',
    api: 'working',
    environment: isVercel ? 'vercel' : 'local',
    message: dbConnected
      ? '✅ Database connected and API is working'
      : '❌ Database disconnected - API may not function correctly',
  };
  res.json(status);
});

// Catch-all 404 handler — registered AFTER all real routes above,
// and BEFORE the error handler. Turns a silent/blank 404 into a
// clear JSON message telling you exactly which method + path was not found,
// which is the fastest way to spot a frontend/backend URL mismatch.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorHandler);

// Only start listening on a real port when NOT running on Vercel.
if (!isVercel) {
  const PORT = process.env.PORT || 5000;
  server.timeout = 300000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API Status: ${dbConnected ? 'Database Connected ✅' : 'Database Disconnected ❌'}`);
  });
}

export const handler = serverless(app);
export default app;
