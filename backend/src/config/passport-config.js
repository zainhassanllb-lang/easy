const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const Client = require('../models/Client');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google OAuth Strategy
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (googleClientId && googleClientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('[GOOGLE AUTH] Processing Google profile:', profile.id);

          // Check if user already exists with this Google ID
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            console.log('[GOOGLE AUTH] Existing user found:', user._id);
            return done(null, user);
          }

          // Check if user exists with this email
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          if (!email) {
            return done(new Error('No email found in Google profile'), null);
          }

          user = await User.findOne({ email: email.toLowerCase() });

          if (user) {
            // Link Google account to existing user
            console.log('[GOOGLE AUTH] Linking Google account to existing user:', user._id);
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
          }

          // Create new client profile
          const displayName = profile.displayName || 'Google User';
          const profileImage = profile.photos && profile.photos[0] ? profile.photos[0].value : '';

          console.log('[GOOGLE AUTH] Creating new client profile');
          const client = await Client.create({
            name: displayName,
            email: email,
            phone: '', // Will be updated by user later if needed
            city: '', // Will be updated by user later
            locality: '',
            profileImage: profileImage
          });

          // Create new user with client role
          console.log('[GOOGLE AUTH] Creating new user with client role');
          user = await User.create({
            email: email,
            googleId: profile.id,
            role: 'client', // Always create as client
            client: client._id,
            passwordHash: null // No password for OAuth users
          });

          console.log('[GOOGLE AUTH] New user created:', user._id);
          return done(null, user);
        } catch (err) {
          console.error('[GOOGLE AUTH] Error:', err);
          return done(err, null);
        }
      }
    )
  );
} else {
  console.warn('[GOOGLE AUTH] Skipping Google Strategy: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET missing in .env');
}

module.exports = passport;
