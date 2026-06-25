const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(s => s.trim())
  : true;

app.use(cors({ origin: allowedOrigins }));

app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhook') return next();
  express.json()(req, res, next);
});

app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.get('/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

app.get('/api/config', (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '' });
});

app.use('/api/products', require('./routes/products'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/admin/import-url', require('./routes/import'));
app.use('/api/orders', require('./routes/orders'));

app.post('/api/checkout', async (req, res) => {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey || stripeKey.startsWith('sk_test_placeholder')) {
    return res.status(503).json({ error: 'Paiement non configuré. Ajoutez votre clé Stripe.' });
  }

  const stripe = require('stripe')(stripeKey);
  const { items, customer } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: 'Panier vide' });
  }

  const { readProducts, readOrders, writeOrders } = require('./db');
  const { nanoid } = require('./utils');
  const products = readProducts();

  const lineItems = [];
  for (const item of items) {
    const product = products.find(p => p.id === item.id);
    if (!product) return res.status(400).json({ error: `Produit introuvable: ${item.id}` });
    lineItems.push({
      price_data: {
        currency: 'eur',
        product_data: {
          name: product.name,
          images: product.imageUrl ? [product.imageUrl] : [],
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: item.quantity,
    });
  }

  const orderId = nanoid();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
    cancel_url: `${frontendUrl}/cart`,
    customer_email: customer?.email,
    metadata: { orderId },
    shipping_address_collection: {
      allowed_countries: ['FR', 'BE', 'CH', 'LU'],
    },
  });

  const orders = readOrders();
  orders.push({
    id: orderId,
    sessionId: session.id,
    status: 'pending',
    customer: customer || {},
    items: items.map(item => {
      const p = products.find(pr => pr.id === item.id);
      return { id: item.id, name: p?.name, price: p?.price, quantity: item.quantity };
    }),
    total: lineItems.reduce((sum, li, i) => sum + (li.price_data.unit_amount / 100) * items[i].quantity, 0),
    createdAt: new Date().toISOString(),
  });
  writeOrders(orders);

  res.json({ url: session.url });
});

app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) return res.json({ received: true });

  const stripe = require('stripe')(stripeKey);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { readOrders, writeOrders } = require('./db');
    const orders = readOrders();
    const idx = orders.findIndex(o => o.sessionId === session.id);
    if (idx !== -1) {
      orders[idx].status = 'paid';
      orders[idx].paidAt = new Date().toISOString();
      orders[idx].stripeCustomer = session.customer;
      if (session.shipping_details) {
        orders[idx].shippingAddress = session.shipping_details.address;
      }
      writeOrders(orders);
    }
  }

  res.json({ received: true });
});

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));
app.get('*', (req, res) => {
  const indexPath = path.join(publicDir, 'index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Frontend non buildé' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Flash Shop backend sur http://localhost:${PORT}`);
});
