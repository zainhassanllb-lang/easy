const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('./config/passport-config');

const errorHandler = require('./middleware/error');

const authRoutes = require('./routes/auth');
const workerRoutes = require('./routes/workers');
const clientRoutes = require('./routes/clients');
const adminRoutes = require('./routes/admin');
const statsRoutes = require('./routes/stats');
const paymentRoutes = require('./routes/payments');
const sessionRoutes = require('./routes/session');
const reviewRoutes = require('./routes/reviews');

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(morgan('dev'));
  app.use(cookieParser());

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Session configuration for Passport
  app.use(
    session({
      secret: process.env.JWT_SECRET || 'lol-easy-lol',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      }
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  const origin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  app.use(
    cors({
      origin: origin.split(',').map((s) => s.trim()),
      credentials: true
    })
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 600,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  const uploadRoot = process.env.UPLOAD_DIR || 'uploads';
  app.use('/uploads', express.static(uploadRoot));

  app.get('/health', (req, res) => res.json({ ok: true }));

  // Mount routes under /api to match frontend calls
  app.use('/api', authRoutes);
  app.use('/api', sessionRoutes);
  app.use('/api', workerRoutes);
  app.use('/api', clientRoutes);
  app.use('/api', adminRoutes);
  app.use('/api', statsRoutes);
  app.use('/api', paymentRoutes);
  app.use('/api', reviewRoutes);

  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
