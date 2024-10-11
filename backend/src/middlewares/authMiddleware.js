// authMiddleware.js
/**
 * Middleware to authenticate JWT token
 */
const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ message: 'Access token missing or malformed' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Middleware to authorize based on user roles
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient rights' });
        }
        next();
    };
}

module.exports = {
    authenticateToken,
    authorizeRoles
}; // Export the middleware
