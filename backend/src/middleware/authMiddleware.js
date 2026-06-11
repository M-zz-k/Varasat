const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'varasat_secret_key_12345';

/**
 * Express middleware to verify JWT authorization headers
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. No session token provided.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.userId = verified.userId;
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(403).json({ success: false, message: 'Session expired or invalid token.' });
  }
}

module.exports = authenticateToken;
