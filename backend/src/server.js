require('dotenv').config();

// Startup Validations
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 64) {
  console.error('FATAL: JWT_SECRET must be set and at least 64 chars');
  process.exit(1);
}

const encryptionKey = process.env.ENCRYPTION_KEY;
if (!encryptionKey || Buffer.from(encryptionKey, 'hex').length !== 32) {
  console.error('FATAL: ENCRYPTION_KEY must be a 64-char hex string (32 bytes)');
  process.exit(1);
}

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
  console.error('FATAL: FRONTEND_URL must be set in production');
  process.exit(1);
}

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const assetRoutes = require('./routes/assets');
const claimRoutes = require('./routes/claims');
const docRoutes = require('./routes/docs');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors({
  origin: frontendUrl,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Request body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Varasat AI Backend'
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/docs', docRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Express uncaught error handler:', err);
  res.status(500).json({ 
    success: false, 
    message: 'An unexpected internal server error occurred.' 
  });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` Varasat Core Backend Server is online!`);
  console.log(` Port: ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=========================================`);
});
