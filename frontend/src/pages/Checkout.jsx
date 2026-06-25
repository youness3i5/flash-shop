import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../api.js';

const STEPS = ['Informations', 'Livraison', 'Paiement'];

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step] = useState(1);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', zip: '', country: 'FR',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const shipping = totalPrice >= 50 ? 0 : 4.99;
  const total = totalPrice + shipping;

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 16px' }}>
        <p style={{ fontSize: 18, marginBottom: 20, color: 'var(--text-muted)' }}>Ton panier est vide.</p>
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
      const { url } = await api.checkout(items.map(i => ({ id: i.id, quantity: i.quantity })), customer);
      clearCart();
      window.location.href = url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="co-page">
      <div className="container">
        <div className="co-progress">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`co-step${i + 1 <= step ? ' done' : ''}${i + 1 === step ? ' active' : ''}`}>
                <div className="co-step-dot">{i + 1 <= step ? (i + 1 < step ? '✓' : i + 1) : i + 1}</div>
                <span>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`co-line${i + 1 < step ? ' done' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="co-layout">
          <form className="co-form" onSubmit={handleSubmit}>
            <div className="co-section">
              <h2 className="co-section-title">
                <span className="co-num">1</span>
                Informations personnelles
              </h2>
              <div className="co-row">
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
            </div>

            <div className="co-section">
              <h2 className="co-section-title">
                <span className="co-num">2</span>
                Adresse de livraison
              </h2>
              <div className="form-group">
                <label>Adresse *</label>
                <input name="address" value={form.address} onChange={handleChange} required placeholder="12 rue de la Paix" />
              </div>
              <div className="co-row">
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
                  <option value="FR">🇫🇷 France</option>
                  <option value="BE">🇧🇪 Belgique</option>
                  <option value="CH">🇨🇭 Suisse</option>
                  <option value="LU">🇱🇺 Luxembourg</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="error-msg" style={{ marginBottom: 16 }}>
                {error.includes('configuré') ? '⚠️ Le paiement n\'est pas encore configuré. Stripe non activé.' : error}
              </div>
            )}

            <button className="btn btn-primary submit-btn" type="submit" disabled={loading}>
              {loading ? (
                <><span className="btn-spinner" /> Redirection vers Stripe…</>
              ) : (
                `🔒 Payer ${total.toFixed(2)} € →`
              )}
            </button>

            <div className="secure-row">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="stripe-logo" />
              <span>Paiement sécurisé · Données jamais stockées</span>
            </div>
          </form>

          <aside className="co-summary">
            <h3 className="co-sum-title">Votre commande</h3>
            <ul className="co-items">
              {items.map(item => (
                <li key={item.id} className="co-item">
                  <div className="co-item-img-wrap">
                    <img
                      src={item.imageUrl} alt={item.name}
                      onError={e => { e.target.src = 'https://placehold.co/56x56/f3f4f6/9ca3af?text=?'; }}
                    />
                    <span className="co-qty-badge">{item.quantity}</span>
                  </div>
                  <span className="co-item-name">{item.name}</span>
                  <span className="co-item-price">{(item.price * item.quantity).toFixed(2)} €</span>
                </li>
              ))}
            </ul>
            <div className="co-totals">
              <div className="co-tot-row"><span>Sous-total</span><span>{totalPrice.toFixed(2)} €</span></div>
              <div className="co-tot-row">
                <span>Livraison</span>
                <span style={{ color: shipping === 0 ? '#059669' : 'inherit', fontWeight: shipping === 0 ? 700 : 400 }}>
                  {shipping === 0 ? 'Gratuite 🎉' : `${shipping.toFixed(2)} €`}
                </span>
              </div>
              <div className="co-divider" />
              <div className="co-tot-row co-grand-total">
                <strong>Total</strong>
                <strong className="co-amount">{total.toFixed(2)} €</strong>
              </div>
            </div>
            <div className="co-back">
              <Link to="/panier">← Retour au panier</Link>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .co-page { padding: 36px 0 100px; }

        .co-progress {
          display: flex; align-items: center; justify-content: center;
          gap: 0; margin-bottom: 40px; flex-wrap: wrap;
        }
        .co-step {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; font-weight: 600; color: var(--text-muted);
        }
        .co-step.active { color: var(--primary); }
        .co-step.done { color: #059669; }
        .co-step-dot {
          width: 30px; height: 30px; border-radius: 50%;
          background: var(--border); color: var(--text-muted);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 800;
        }
        .co-step.active .co-step-dot { background: var(--gradient); color: white; }
        .co-step.done .co-step-dot { background: #059669; color: white; }
        .co-line { flex: 1; max-width: 60px; height: 2px; background: var(--border); margin: 0 8px; }
        .co-line.done { background: #059669; }

        .co-layout {
          display: grid; grid-template-columns: 1fr 380px; gap: 40px; align-items: start;
        }
        .co-form { display: flex; flex-direction: column; gap: 0; }
        .co-section {
          background: white; border: 1px solid var(--border);
          border-radius: var(--radius); padding: 28px; margin-bottom: 20px;
        }
        .co-section-title {
          display: flex; align-items: center; gap: 12px;
          font-size: 16px; font-weight: 800; margin-bottom: 22px;
          padding-bottom: 14px; border-bottom: 1px solid var(--border);
        }
        .co-num {
          width: 28px; height: 28px; background: var(--gradient);
          color: white; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 800; flex-shrink: 0;
        }
        .co-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .submit-btn { width: 100%; padding: 17px; font-size: 16px; margin-bottom: 14px; }
        .btn-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
          border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
        }
        .secure-row {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          font-size: 12px; color: var(--text-muted);
        }
        .stripe-logo { height: 22px; opacity: 0.6; filter: grayscale(1); }

        .co-summary {
          background: white; border: 1px solid var(--border);
          border-radius: var(--radius); padding: 24px;
          position: sticky; top: 80px;
        }
        .co-sum-title {
          font-size: 16px; font-weight: 800; margin-bottom: 20px;
          padding-bottom: 14px; border-bottom: 1px solid var(--border);
        }
        .co-items { list-style: none; display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }
        .co-item { display: flex; align-items: center; gap: 12px; }
        .co-item-img-wrap { position: relative; flex-shrink: 0; }
        .co-item-img-wrap img {
          width: 56px; height: 56px; object-fit: cover;
          border-radius: 8px; background: var(--bg-gray);
        }
        .co-qty-badge {
          position: absolute; top: -6px; right: -6px;
          background: var(--bg-dark); color: white;
          width: 20px; height: 20px; border-radius: 50%;
          font-size: 10px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
        }
        .co-item-name {
          flex: 1; font-size: 13px; font-weight: 600;
          overflow: hidden; text-overflow: ellipsis; display: -webkit-box;
          -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        }
        .co-item-price { font-size: 14px; font-weight: 800; flex-shrink: 0; }
        .co-totals { display: flex; flex-direction: column; gap: 10px; }
        .co-tot-row { display: flex; justify-content: space-between; font-size: 14px; color: var(--text-muted); }
        .co-divider { height: 1px; background: var(--border); }
        .co-grand-total { font-size: 16px; color: var(--text); }
        .co-amount { font-size: 22px; color: var(--primary); }
        .co-back { margin-top: 16px; }
        .co-back a { font-size: 13px; color: var(--text-muted); transition: color 0.2s; }
        .co-back a:hover { color: var(--primary); }

        @media (max-width: 820px) {
          .co-layout { grid-template-columns: 1fr; }
          .co-summary { position: static; }
          .co-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
