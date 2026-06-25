function requireAdmin(req, res, next) {
  const password = process.env.ADMIN_PASSWORD || 'flashadmin2026';
  const auth = req.headers['authorization'];
  if (!auth || auth !== `Bearer ${password}`) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  next();
}

module.exports = { requireAdmin };
