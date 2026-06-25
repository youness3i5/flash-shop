const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const { readOrders } = require('../db');

router.get('/', requireAdmin, (req, res) => {
  const orders = readOrders();
  res.json(orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

module.exports = router;
