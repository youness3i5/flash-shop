const express = require('express');
const router = express.Router();
const { readProducts } = require('../db');

router.get('/', (req, res) => {
  const products = readProducts();
  const { category, search, featured } = req.query;
  let result = products;

  if (category) {
    result = result.filter(p => p.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  if (featured === 'true') {
    result = result.filter(p => p.featured);
  }

  res.json(result);
});

router.get('/:id', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Produit introuvable' });
  res.json(product);
});

module.exports = router;
