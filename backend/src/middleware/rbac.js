/**
 * Role-Based Access Control Middleware
 * Returns a middleware that restricts access to users with specific roles.
 *
 * Usage: router.delete('/:id', auth, requireRole('ADMIN'), deleteTask)
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

module.exports = { requireRole };
