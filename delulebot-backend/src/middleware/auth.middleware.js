const { findById } = require('../services/auth.service');

function requireAuth(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'No autorizado. Iniciá sesión.' });
  }
  const user = findById(req.session.userId);
  if (!user) {
    return res.status(401).json({ error: 'Sesión inválida. Iniciá sesión nuevamente.' });
  }
  req.user = user;
  next();
}

module.exports = requireAuth;
