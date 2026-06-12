const jwt = require('jsonwebtoken');

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
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.userId;
    req.userRole = verified.role; // Extract role from JWT
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(403).json({ success: false, message: 'Session expired or invalid token.' });
  }
}

/**
 * Express middleware to restrict endpoints by user role
 */
function requireRole(role) {
  return (req, res, next) => {
    if (req.userRole !== role) {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole
};
