import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const shipping = totalPrice >= 50 ? 0 : 4.99;
  const total = totalPrice + shipping;
  const freeShippingProgress = Math.min((totalPrice / 50) * 100, 100);
  const remaining = Math.max(0, 50 - totalPrice);

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-blob">🛒</div>
        <h1>Ton panier est vide</h1>
        <p>Découvre nos produits tendance TikTok !</p>
        <Link to="/catalogue" className="btn btn-primary">Explorer le catalogue →</Link>
        <style>{`
          .cart-empty {
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; padding: 120px 16px; gap: 18px; text-align: center;
          }
          .empty-blob { font-size: 72px; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.1)); }
          .cart-empty h1 { font-size: 26px; font-weight: 900; }
          .cart-empty p { color: var(--text-muted); font-size: 15px; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-top">
          <div>
            <h1 className="cart-title">Mon panier</h1>
            <p className="cart-count">{items.reduce((s, i) => s + i.quantity, 0)} article{items.reduce((s,i) => s+i.quantity, 0) > 1 ? 's' : ''}</p>
          </div>
          <button className="btn btn-ghost clear-btn" onClick={clearCart}>Vider</button>
        </div>

        {/* Barre livraison gratuite */}
        {remaining > 0 && (
          <div className="shipping-bar">
            <div className="shipping-bar-text">
              <span>🚚 Plus que <strong>{remaining.toFixed(2)} €</strong> pour la livraison gratuite !</span>
              <span className="shipping-pct">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="shipping-track">
              <div className="shipping-fill" style={{ width: `${freeShippingProgress}%` }} />
            </div>
          </div>
        )}
        {remaining === 0 && (
          <div className="shipping-unlocked">
            🎉 Livraison gratuite débloquée !
          </div>
        )}

        <div className="cart-layout">
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item anim-fade-up">
                <Link to={`/produit/${item.id}`} className="item-img-link">
                  <img
                    src={item.imageUrl} alt={item.name}
                    className="item-img"
                    onError={e => { e.target.src = 'https://placehold.co/100x100/f3f4f6/9ca3af?text=?'; }}
                  />
                </Link>
                <div className="item-details">
                  <Link to={`/produit/${item.id}`} className="item-name">{item.name}</Link>
                  <p className="item-unit">{item.price.toFixed(2)} € / unité</p>
                  <div className="item-row">
                    <div className="qty-controls">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span className="qty-val">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="remove-btn" onClick={() => removeItem(item.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                      Retirer
                    </button>
                  </div>
                </div>
                <div className="item-total">{(item.price * item.quantity).toFixed(2)} €</div>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Récapitulatif</h2>
            <div className="sum-row"><span>Sous-total</span><span>{totalPrice.toFixed(2)} €</span></div>
            <div className="sum-row">
              <span>Livraison</span>
              <span style={{ color: shipping === 0 ? '#059669' : 'inherit', fontWeight: shipping === 0 ? 700 : 400 }}>
                {shipping === 0 ? '🎉 Gratuite' : `${shipping.toFixed(2)} €`}
              </span>
            </div>
            <div className="sum-divider" />
            <div className="sum-row sum-total">
              <span>Total</span>
              <span className="sum-total-amount">{total.toFixed(2)} €</span>
            </div>
            <Link to="/checkout" className="btn btn-primary checkout-btn">
              Finaliser la commande →
            </Link>
            <Link to="/catalogue" className="btn btn-ghost continue-btn">Continuer mes achats</Link>
            <div className="payment-trust">
              <span>🔒 Paiement sécurisé</span>
              <span>🔄 Retours 30 jours</span>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .cart-page { padding: 40px 0 100px; }
        .cart-top {
          display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;
        }
        .cart-title { font-size: 30px; font-weight: 900; letter-spacing: -0.5px; }
        .cart-count { font-size: 13px; color: var(--text-muted); font-weight: 600; margin-top: 3px; }
        .clear-btn { color: var(--text-muted); font-size: 13px; }

        .shipping-bar {
          background: #fff7ed; border: 1.5px solid #fed7aa;
          border-radius: var(--radius-sm); padding: 12px 16px; margin-bottom: 24px;
        }
        .shipping-bar-text {
          display: flex; justify-content: space-between; align-items: center;
          font-size: 13px; font-weight: 600; margin-bottom: 8px;
        }
        .shipping-pct { font-size: 12px; color: var(--text-muted); }
        .shipping-track {
          height: 6px; background: #fed7aa; border-radius: 3px; overflow: hidden;
        }
        .shipping-fill {
          height: 100%; background: linear-gradient(90deg, #FB923C, #F59E0B);
          border-radius: 3px; transition: width 0.4s ease;
        }
        .shipping-unlocked {
          background: #ecfdf5; border: 1.5px solid #6ee7b7;
          border-radius: var(--radius-sm); padding: 12px 16px; margin-bottom: 24px;
          font-size: 13px; font-weight: 700; color: #059669;
        }

        .cart-layout {
          display: grid; grid-template-columns: 1fr 360px; gap: 32px; align-items: start;
        }
        .cart-items { display: flex; flex-direction: column; gap: 14px; }
        .cart-item {
          display: flex; gap: 16px; padding: 18px;
          background: white; border: 1px solid var(--border);
          border-radius: var(--radius); align-items: center;
          transition: box-shadow 0.2s;
        }
        .cart-item:hover { box-shadow: var(--shadow); }
        .item-img-link { flex-shrink: 0; }
        .item-img {
          width: 90px; height: 90px; object-fit: cover;
          border-radius: var(--radius-sm); background: var(--bg-gray);
        }
        .item-details { flex: 1; min-width: 0; }
        .item-name {
          font-size: 14.5px; font-weight: 700; display: block; margin-bottom: 4px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          transition: color 0.2s;
        }
        .item-name:hover { color: var(--primary); }
        .item-unit { font-size: 12px; color: var(--text-muted); margin-bottom: 10px; }
        .item-row { display: flex; align-items: center; gap: 16px; }
        .qty-controls { display: flex; align-items: center; gap: 8px; }
        .qty-btn {
          background: var(--bg-gray); border: 1.5px solid var(--border);
          width: 30px; height: 30px; border-radius: 6px; font-size: 16px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; font-family: 'Poppins', sans-serif;
        }
        .qty-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }
        .qty-val { font-size: 15px; font-weight: 800; min-width: 24px; text-align: center; }
        .remove-btn {
          display: flex; align-items: center; gap: 5px;
          background: none; border: none; cursor: pointer;
          color: var(--text-muted); font-size: 12px; font-weight: 600;
          padding: 5px 10px; border-radius: 6px; transition: all 0.2s;
          font-family: 'Poppins', sans-serif;
        }
        .remove-btn:hover { color: var(--primary); background: var(--primary-light); }
        .item-total {
          font-size: 17px; font-weight: 900; color: var(--primary);
          flex-shrink: 0; min-width: 80px; text-align: right;
        }

        .cart-summary {
          background: white; border: 1px solid var(--border); border-radius: var(--radius);
          padding: 24px; display: flex; flex-direction: column; gap: 14px;
          position: sticky; top: 80px;
        }
        .cart-summary h2 { font-size: 17px; font-weight: 800; border-bottom: 1px solid var(--border); padding-bottom: 14px; }
        .sum-row {
          display: flex; justify-content: space-between;
          font-size: 14px; color: var(--text-muted);
        }
        .sum-divider { height: 1px; background: var(--border); }
        .sum-total { font-size: 15px; font-weight: 700; color: var(--text); }
        .sum-total-amount { font-size: 24px; font-weight: 900; color: var(--primary); }
        .checkout-btn { width: 100%; padding: 15px; font-size: 15px; }
        .continue-btn { width: 100%; font-size: 13px; color: var(--text-muted); }
        .payment-trust {
          display: flex; justify-content: center; gap: 16px;
          font-size: 11.5px; font-weight: 600; color: var(--text-muted);
        }

        @media (max-width: 800px) {
          .cart-layout { grid-template-columns: 1fr; }
          .cart-summary { position: static; }
        }
        @media (max-width: 480px) {
          .cart-item { flex-wrap: wrap; }
          .item-img { width: 72px; height: 72px; }
          .item-total { width: 100%; text-align: left; }
        }
      `}</style>
    </div>
  );
}
