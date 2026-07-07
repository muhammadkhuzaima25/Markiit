import express from 'express';
import mongoose from 'mongoose';
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

app.set('trust proxy', 1);

const isVercel = process.env.VERCEL === '1';

const allowedOrigins = [
  'http://localhost:5173',
  'https://markiitapp.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

const dbMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next();
  }
};

app.use(dbMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }), authRoutes);
app.use('/api/users', rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }), userRoutes);
app.use('/api/products', rateLimit({ windowMs: 60 * 60 * 1000, max: 20 }), productRoutes);
app.use('/api/services', rateLimit({ windowMs: 60 * 60 * 1000, max: 20 }), serviceRoutes);
app.use('/api/bookings', rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }), bookingRoutes);
app.use('/api/reviews', rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }), reviewRoutes);
app.use('/api/messages', rateLimit({ windowMs: 60 * 1000, max: 30 }), messageRoutes);
app.use('/api/notifications', rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }), notificationRoutes);
app.use('/api/admin', rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }), adminRoutes);
app.use('/api/listings/nearby', rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }), nearbyRoutes);
app.use('/api/reports', rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }), reportRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: isVercel ? 'vercel' : 'local'
  });
});

app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));
app.use(errorHandler);

export const handler = serverless(app);
export default app;
