const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const session = require('express-session');

dotenv.config();

// Helper function to encode MongoDB URI password
function encodeMongoURI(uri) {
  if (!uri || uri === 'mongodb://localhost:27017/pushnotifications') {
    return uri;
  }
  
  try {
    // Parse the URI to extract and encode the password
    const url = new URL(uri);
    if (url.password) {
      // Encode the password
      const encodedPassword = encodeURIComponent(url.password);
      // Reconstruct the URI with encoded password
      return uri.replace(`:${url.password}@`, `:${encodedPassword}@`);
    }
    return uri;
  } catch (error) {
    // If URL parsing fails, try a regex approach for MongoDB connection strings
    // Match pattern: mongodb://username:password@host or mongodb+srv://username:password@host
    const match = uri.match(/^(mongodb\+srv?:\/\/)([^:]+):([^@]+)@(.+)$/);
    if (match) {
      const [, protocol, username, password, rest] = match;
      const encodedPassword = encodeURIComponent(password);
      return `${protocol}${username}:${encodedPassword}@${rest}`;
    }
    return uri;
  }
}

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Session configuration for Passport
app.use(session({
  secret: process.env.JWT_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Database connection
const mongoURI = encodeMongoURI(process.env.MONGODB_URI || 'mongodb://localhost:27017/pushnotifications');
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  if (process.env.NODE_ENV !== 'production') {
    console.log('💡 Make sure MongoDB is running or check MONGODB_URI in .env');
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/subscribers', require('./routes/subscribers'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/events', require('./routes/events'));
app.use('/api/automations', require('./routes/automations'));
app.use('/api/webhook', require('./routes/webhook'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware (must be last)
app.use(require('./utils/errorHandler'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

