import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import hackathonRoutes from './routes/hackathonRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { seedDatabase } from './utils/seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Base API status endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    platform: 'HackSphere Hackathon Management Platform API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Seed API endpoint for easy reset during testing/demos
app.post('/api/seed', async (req, res, next) => {
  try {
    await seedDatabase();
    res.json({ message: 'HackSphere platform successfully seeded with fresh demo data!' });
  } catch (err) {
    next(err);
  }
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  // Auto-seed if database is empty
  try {
    await seedDatabase();
  } catch (err) {
    console.warn('[Auto-seed Note]:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 HackSphere REST Server Running on http://localhost:${PORT}`);
    console.log(`=======================================================`);
  });
};

startServer();
