import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../api.js';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: 'FR',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 16px' }}>
        <p style={{ fontSize: 18, marginBottom: 16 }}>Votre panier est vide.</p>
        <Link to="/catalogue" className="btn btn-primary">Voir le catalogue</Link>
      </div>
    );
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const customer = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        address: `${form.address}, ${form.zip} ${form.city}, ${form.country}`,
      };

      const { url } = await api.checkout(
        items.map(i => ({ id: i.id, quantity: i.quantity })),
        customer
      );

      clearCart();
      window.location.href = url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  const shipping = totalPrice >= 50 ? 0 : 4.99;
  const total = totalPrice + shipping;

  return (
    <div className="checkout-page">
      <div className="container">
        <Link to="/panier" className="back-link">← Retour au panier</Link>
        <h1 className="checkout-title">Finaliser la commande</h1>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <section className="form-section">
              <h2>Informations personnelles</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom *</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} required placeholder="Jean" />
                </div>
                <div className="form-group">
                  <label>Nom *</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Dupont" />
                </div>
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="jean@exemple.fr" />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+33 6 12 34 56 78" />
              </div>
            </section>

            <section className="form-section">
              <h2>Adresse de livraison</h2>
              <div className="form-group">
                <label>Adresse *</label>
                <input name="address" value={form.address} onChange={handleChange} required placeholder="12 rue de la Paix" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Code postal *</label>
                  <input name="zip" value={form.zip} onChange={handleChange} required placeholder="75001" />
                </div>
                <div className="form-group">
                  <label>Ville *</label>
                  <input name="city" value={form.city} onChange={handleChange} required placeholder="Paris" />
                </div>
              </div>
              <div className="form-group">
                <label>Pays *</label>
                <select name="country" value={form.country} onChange={handleChange}>
                  <option value="FR">France</option>
                  <option value="BE">Belgique</option>
                  <option value="CH">Suisse</option>
                  <option value="LU">Luxembourg</option>
                </select>
              </div>
            </section>

            {error && <p className="error-msg">{error}</p>}

            <button className="btn btn-primary submit-btn" type="submit" disabled={loading}>
              {loading ? 'Redirection vers Stripe...' : `Payer ${total.toFixed(2)} € →`}
            </button>

            <p className="secure-note">
              🔒 Paiement 100% sécurisé par Stripe. Vos données bancaires ne sont jamais stockées.
            </p>
          </form>

          <aside className="order-summary">
            <h2>Votre commande</h2>
            <ul className="order-items">
              {items.map(item => (
                <li key={item.id} className="order-item">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="order-item-img"
                    onError={e => { e.target.src = 'https://placehold.co/50x50/f0f0f0/999?text=?'; }}
                  />
                  <div className="order-item-info">
                    <span className="order-item-name">{item.name}</span>
                    <span className="order-item-qty">× {item.quantity}</span>
                  </div>
                  <span className="order-item-price">{(item.price * item.quantity).toFixed(2)} €</span>
                </li>
              ))}
            </ul>
            <div className="order-totals">
              <div className="order-row">
                <span>Sous-total</span><span>{totalPrice.toFixed(2)} €</span>
              </div>
              <div className="order-row">
                <span>Livraison</span>
                <span>{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} €`}</span>
              </div>
              <div className="order-divider" />
              <div className="order-row order-total-row">
                <strong>Total</strong>
                <strong className="order-total-amount">{total.toFixed(2)} €</strong>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .checkout-page { padding: 32px 0 80px; }
        .back-link {
          display: inline-block;
          color: var(--text-muted);
          font-size: 14px;
          margin-bottom: 24px;
          transition: color var(--transition);
        }
        .back-link:hover { color: var(--primary); }
        .checkout-title { font-size: 28px; font-weight: 800; margin-bottom: 32px; }

        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 40px;
          align-items: start;
        }

        .checkout-form { display: flex; flex-direction: column; gap: 0; }
        .form-section {
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 24px;
          margin-bottom: 20px;
        }
        .form-section h2 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .submit-btn {
          width: 100%;
          padding: 16px;
          font-size: 16px;
          margin-bottom: 12px;
        }
        .secure-note {
          text-align: center;
          font-size: 12px;
          color: var(--text-muted);
        }

        .order-summary {
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 24px;
          position: sticky;
          top: 80px;
        }
        .order-summary h2 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
        }
        .order-items { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
        .order-item { display: flex; align-items: center; gap: 10px; }
        .order-item-img {
          width: 50px; height: 50px;
          object-fit: cover;
          border-radius: 6px;
          background: var(--bg-gray);
          flex-shrink: 0;
        }
        .order-item-info { flex: 1; min-width: 0; }
        .order-item-name {
          display: block;
          font-size: 13px;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .order-item-qty { font-size: 12px; color: var(--text-muted); }
        .order-item-price { font-size: 14px; font-weight: 700; flex-shrink: 0; }
        .order-totals { display: flex; flex-direction: column; gap: 10px; }
        .order-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: var(--text-muted);
        }
        .order-divider { height: 1px; background: var(--border); }
        .order-total-row { font-size: 16px; color: var(--text); }
        .order-total-amount { color: var(--primary); font-size: 20px; }

        @media (max-width: 768px) {
          .checkout-layout { grid-template-columns: 1fr; }
          .order-summary { position: static; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
