const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');

function extractToken(req) {
  const cookieName = process.env.COOKIE_NAME || 'easy_token';
  const cookieToken = req.cookies?.[cookieName];
  const header = req.headers.authorization || '';
  const bearerToken = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : '';
  return cookieToken || bearerToken || null;
}

async function auth(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.sub).select('_id email role worker client');
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    req.user = { id: user._id.toString(), email: user.email, role: user.role, worker: user.worker, client: user.client };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

async function optionalAuth(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.sub).select('_id email role worker client');
    if (!user) {
      req.user = null;
      return next();
    }

    req.user = { id: user._id.toString(), email: user.email, role: user.role, worker: user.worker, client: user.client };
    return next();
  } catch (err) {
    req.user = null;
    return next();
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    return next();
  };
}

module.exports = { auth, optionalAuth, requireRole };
