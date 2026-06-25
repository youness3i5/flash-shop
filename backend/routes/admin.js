const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const { readProducts, writeProducts } = require('../db');
const { nanoid } = require('../utils');

router.post('/products', requireAdmin, (req, res) => {
  const { name, description, price, category, imageUrl, sourceUrl, stock, featured } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Champs obligatoires : name, price, category' });
  }

  const products = readProducts();
  const product = {
    id: nanoid(),
    name,
    description: description || '',
    price: parseFloat(price),
    category,
    imageUrl: imageUrl || 'https://placehold.co/400x400/FF4D4D/white?text=FlashShop',
    sourceUrl: sourceUrl || '',
    stock: parseInt(stock) || 0,
    featured: featured === true || featured === 'true',
    createdAt: new Date().toISOString(),
  };

  products.push(product);
  writeProducts(products);
  res.status(201).json(product);
});

router.put('/products/:id', requireAdmin, (req, res) => {
  const products = readProducts();
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Produit introuvable' });

  const { name, description, price, category, imageUrl, sourceUrl, stock, featured } = req.body;
  const updated = {
    ...products[idx],
    ...(name !== undefined && { name }),
    ...(description !== undefined && { description }),
    ...(price !== undefined && { price: parseFloat(price) }),
    ...(category !== undefined && { category }),
    ...(imageUrl !== undefined && { imageUrl }),
    ...(sourceUrl !== undefined && { sourceUrl }),
    ...(stock !== undefined && { stock: parseInt(stock) }),
    ...(featured !== undefined && { featured: featured === true || featured === 'true' }),
  };

  products[idx] = updated;
  writeProducts(products);
  res.json(updated);
});

router.delete('/products/:id', requireAdmin, (req, res) => {
  const products = readProducts();
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Produit introuvable' });

  products.splice(idx, 1);
  writeProducts(products);
  res.json({ ok: true });
});

module.exports = router;
