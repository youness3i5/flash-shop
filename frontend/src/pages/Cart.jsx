import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-empty-page">
        <div className="empty-icon">🛒</div>
        <h1>Votre panier est vide</h1>
        <p>Découvrez nos produits tendance !</p>
        <Link to="/catalogue" className="btn btn-primary">Voir le catalogue</Link>

        <style>{`
          .cart-empty-page {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 100px 16px;
            gap: 16px;
            text-align: center;
          }
          .empty-icon { font-size: 64px; }
          .cart-empty-page h1 { font-size: 24px; font-weight: 800; }
          .cart-empty-page p { color: var(--text-muted); }
        `}</style>
      </div>
    );
  }

  const shipping = totalPrice >= 50 ? 0 : 4.99;
  const total = totalPrice + shipping;

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Mon panier</h1>
          <button className="btn btn-ghost clear-btn" onClick={clearCart}>
            Vider le panier
          </button>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <Link to={`/produit/${item.id}`} className="item-img-link">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="item-img"
                    onError={e => { e.target.src = 'https://placehold.co/100x100/f0f0f0/999?text=?'; }}
                  />
                </Link>
                <div className="item-details">
                  <Link to={`/produit/${item.id}`} className="item-name">{item.name}</Link>
                  <p className="item-unit-price">{item.price.toFixed(2)} € / unité</p>
                  <div className="item-actions">
                    <div className="qty-controls">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span className="qty-val">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="remove-btn" onClick={() => removeItem(item.id)}>
                      Supprimer
                    </button>
                  </div>
                </div>
                <div className="item-total">{(item.price * item.quantity).toFixed(2)} €</div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Récapitulatif</h2>
            <div className="summary-row">
              <span>Sous-total</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
            <div className="summary-row">
              <span>Livraison</span>
              <span>{shipping === 0 ? <span style={{ color: '#27ae60' }}>Gratuite</span> : `${shipping.toFixed(2)} €`}</span>
            </div>
            {shipping > 0 && (
              <p className="free-shipping-hint">
                Plus que {(50 - totalPrice).toFixed(2)} € pour la livraison gratuite !
              </p>
            )}
            <div className="summary-divider" />
            <div className="summary-row summary-total">
              <span>Total</span>
              <span className="total-amount">{total.toFixed(2)} €</span>
            </div>
            <Link to="/checkout" className="btn btn-primary checkout-btn">
              Commander →
            </Link>
            <Link to="/catalogue" className="btn btn-ghost continue-btn">
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .cart-page { padding: 40px 0 80px; }
        .cart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }
        .cart-header h1 { font-size: 28px; font-weight: 800; }
        .clear-btn { color: var(--text-muted); font-size: 13px; }

        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 32px;
          align-items: start;
        }
        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .cart-item {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          align-items: center;
        }
        .item-img-link { flex-shrink: 0; }
        .item-img {
          width: 90px;
          height: 90px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          background: var(--bg-gray);
        }
        .item-details { flex: 1; min-width: 0; }
        .item-name {
          font-size: 15px;
          font-weight: 600;
          display: block;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .item-name:hover { color: var(--primary); }
        .item-unit-price { font-size: 12px; color: var(--text-muted); margin-bottom: 10px; }
        .item-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .qty-controls { display: flex; align-items: center; gap: 8px; }
        .qty-btn {
          background: var(--bg-gray);
          border: 1.5px solid var(--border);
          width: 30px; height: 30px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all var(--transition);
        }
        .qty-btn:hover { border-color: var(--primary); color: var(--primary); }
        .qty-val { font-size: 15px; font-weight: 700; min-width: 24px; text-align: center; }
        .remove-btn {
          background: none; border: none; cursor: pointer;
          color: var(--text-muted); font-size: 13px;
          transition: color var(--transition);
        }
        .remove-btn:hover { color: var(--primary); }
        .item-total {
          font-size: 17px; font-weight: 800;
          color: var(--primary);
          flex-shrink: 0;
          min-width: 80px;
          text-align: right;
        }

        .cart-summary {
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          position: sticky;
          top: 80px;
        }
        .cart-summary h2 { font-size: 18px; font-weight: 700; }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: var(--text-muted);
        }
        .free-shipping-hint {
          font-size: 12px;
          color: #e67e22;
          font-weight: 600;
          background: #fef9e7;
          padding: 8px 10px;
          border-radius: 6px;
        }
        .summary-divider { height: 1px; background: var(--border); }
        .summary-total {
          font-size: 16px;
          font-weight: 700;
          color: var(--text);
        }
        .total-amount { font-size: 22px; font-weight: 900; color: var(--primary); }
        .checkout-btn { width: 100%; padding: 14px; font-size: 15px; }
        .continue-btn { width: 100%; font-size: 13px; color: var(--text-muted); }

        @media (max-width: 768px) {
          .cart-layout { grid-template-columns: 1fr; }
          .cart-summary { position: static; }
        }
        @media (max-width: 480px) {
          .cart-item { flex-wrap: wrap; }
          .item-img { width: 70px; height: 70px; }
          .item-total { width: 100%; text-align: left; }
        }
      `}</style>
    </div>
  );
}
