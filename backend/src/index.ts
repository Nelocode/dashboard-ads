import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import prisma from './lib/prisma';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Ads Dashboard API is running' });
});

import authRoutes from './routes/auth';
import adsRoutes from './routes/ads';
import aiRoutes from './routes/ai';
import configRoutes from './routes/config';
import companiesRoutes from './routes/companies';

app.use('/api/auth', authRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/config', configRoutes);
app.use('/api/companies', companiesRoutes);

// Global Error Handler (must be after routes)
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export { prisma };
