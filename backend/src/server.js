import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import postsRoutes from './routes/posts.js';
import accountsRoutes from './routes/accounts.js';
import analyticsRoutes from './routes/analytics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow connections from Next.js frontend
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[SocialFlow Backend] ${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'SocialFlow Backend API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    googleOauthConfigured: !!process.env.GOOGLE_CLIENT_ID
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found on SocialFlow backend API server.' });
});

// Start listening
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 SocialFlow Express Backend Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔑 Google Client ID: ${process.env.GOOGLE_CLIENT_ID ? 'Configured' : 'Not configured (set in backend/.env)'}`);
  console.log(`====================================================`);

  // Background queue monitor worker
  setInterval(() => {
    // Background queue polling pulse
  }, 30000);
});

