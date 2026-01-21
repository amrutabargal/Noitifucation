const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Google OAuth Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Only initialize if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const callbackURL = process.env.GOOGLE_CALLBACK_URL || 
    `${process.env.CLIENT_URL || 'http://localhost:5000'}/api/auth/google/callback`;
  
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      user.lastLogin = new Date();
      await user.save();
      return done(null, user);
    }

    // Normalize email: lowercase and trim whitespace
    const normalizedEmail = profile.emails[0].value.toLowerCase().trim();
    user = await User.findOne({ email: normalizedEmail });
    
    if (user) {
      user.googleId = profile.id;
      user.picture = profile.photos[0].value;
      user.lastLogin = new Date();
      await user.save();
      return done(null, user);
    }

    // Create user without phone field to avoid null duplicate key errors
    user = await User.create({
      googleId: profile.id,
      email: normalizedEmail,
      name: profile.displayName,
      picture: profile.photos[0].value,
      role: 'admin'
    });

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
  }));
} else {
  console.warn('⚠️  Google OAuth credentials not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env');
}

passport.serializeUser((user, done) => {
  done(null, user._id || user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth routes
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({ 
      error: 'Google OAuth not configured',
      message: 'Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env file',
      setupUrl: 'https://console.cloud.google.com/apis/credentials'
    });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback',
  (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=oauth_not_configured`);
    }
    passport.authenticate('google', { session: false }, (err, user, info) => {
      if (err) {
        console.error('Google OAuth error:', err);
        // Handle specific OAuth errors
        if (err.message && err.message.includes('invalid_client')) {
          return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=invalid_client`);
        }
        return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=oauth_error`);
      }
      if (!user) {
        return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=auth_failed`);
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  (req, res) => {
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=auth_failed`);
    }
    
    try {
      const token = jwt.sign(
        { userId: req.user._id || req.user.id },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '7d' }
      );
      
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/callback?token=${token}`);
    } catch (error) {
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=token_error`);
    }
  }
);

// Get current user
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    const user = await User.findById(userId)
      .populate('projects')
      .select('-__v');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register with email/password
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Normalize email: lowercase and trim whitespace
    const normalizedEmail = email.toLowerCase().trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Debug logging
    console.log(`[REGISTER] Attempting registration for email: ${normalizedEmail}`);

    // Check if user exists - query with normalized email
    // Since schema has lowercase: true, all emails should be stored in lowercase
    const existingUser = await User.findOne({ email: normalizedEmail });
    
    if (existingUser) {
      console.log(`[REGISTER] User already exists: ${normalizedEmail} (ID: ${existingUser._id})`);
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    console.log(`[REGISTER] No existing user found, proceeding with registration for: ${normalizedEmail}`);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (using normalized email)
    // Explicitly exclude phone field to avoid null duplicate key errors
    let user;
    try {
      const userData = {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: 'admin'
      };
      // Don't include phone field at all (undefined, not null)
      user = await User.create(userData);
    } catch (createError) {
      // Handle duplicate key error more gracefully
      if (createError.code === 11000) {
        console.error(`[REGISTER] Duplicate key error for email: ${normalizedEmail}`, createError);
        
        // Check which field caused the duplicate key error
        const duplicateField = createError.keyPattern ? Object.keys(createError.keyPattern)[0] : 'unknown';
        
        if (duplicateField === 'email') {
          // Email duplicate - double-check
          const raceCheckUser = await User.findOne({ email: normalizedEmail });
          if (raceCheckUser) {
            console.log(`[REGISTER] Race condition detected: User created between checks for email: ${normalizedEmail}`);
            return res.status(400).json({ error: 'User already exists with this email' });
          }
          return res.status(400).json({ error: 'Email already registered. Please try logging in.' });
        } else {
          // Other duplicate key issue (like phone index from old schema)
          console.error(`[REGISTER] Duplicate key error on field: ${duplicateField}. This might be a database index issue.`);
          console.error(`[REGISTER] Please run: node backend/scripts/fix-phone-index.js to fix the database index.`);
          return res.status(400).json({ error: 'Registration failed due to database configuration issue. Please contact support or run the database fix script.' });
        }
      }
      throw createError; // Re-throw if it's not a duplicate key error
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      // Final fallback for duplicate key errors
      return res.status(400).json({ error: 'Email already registered. Please try logging in.' });
    }
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Login with email/password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Normalize email: lowercase and trim whitespace
    const normalizedEmail = email.toLowerCase().trim();

    // Find user with password (using normalized email)
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user has password (might be Google-only user)
    if (!user.password) {
      return res.status(401).json({ 
        error: 'This email is registered with Google. Please use Google login.' 
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;

