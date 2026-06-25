import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function CartDrawer() {
  const { items, totalCount, totalPrice, isOpen, setIsOpen, updateQuantity, removeItem } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={() => setIsOpen(false)} />
      <aside className="cart-drawer">
        <div className="drawer-header">
          <h2 className="drawer-title">Mon panier ({totalCount})</h2>
          <button className="close-btn" onClick={() => setIsOpen(false)} aria-label="Fermer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="drawer-empty">
            <div className="empty-icon">🛒</div>
            <p>Votre panier est vide</p>
            <button className="btn btn-primary" onClick={() => setIsOpen(false)}>
              Continuer mes achats
            </button>
          </div>
        ) : (
          <>
            <ul className="drawer-items">
              {items.map(item => (
                <li key={item.id} className="drawer-item">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="item-img"
                    onError={e => { e.target.src = 'https://placehold.co/64x64/f0f0f0/999?text=?'; }}
                  />
                  <div className="item-info">
                    <p className="item-name">{item.name}</p>
                    <p className="item-price">{(item.price * item.quantity).toFixed(2)} €</p>
                    <div className="qty-controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >−</button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >+</button>
                    </div>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                    aria-label="Supprimer"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            <div className="drawer-footer">
              <div className="total-row">
                <span>Total</span>
                <span className="total-amount">{totalPrice.toFixed(2)} €</span>
              </div>
              <Link
                to="/checkout"
                className="btn btn-primary checkout-cta"
                onClick={() => setIsOpen(false)}
              >
                Commander →
              </Link>
              <button
                className="btn btn-ghost continue-btn"
                onClick={() => setIsOpen(false)}
              >
                Continuer mes achats
              </button>
            </div>
          </>
        )}
      </aside>

      <style>{`
        .drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 200;
          animation: fadeIn 0.2s ease;
        }
        .cart-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(420px, 100vw);
          background: white;
          z-index: 201;
          display: flex;
          flex-direction: column;
          box-shadow: -8px 0 32px rgba(0,0,0,0.12);
          animation: slideIn 0.25s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border);
        }
        .drawer-title {
          font-size: 18px;
          font-weight: 700;
        }
        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          color: var(--text-muted);
          transition: background var(--transition);
        }
        .close-btn:hover { background: var(--bg-gray); }
        .drawer-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 40px;
        }
        .empty-icon { font-size: 48px; }
        .drawer-empty p { color: var(--text-muted); }
        .drawer-items {
          flex: 1;
          overflow-y: auto;
          padding: 16px 24px;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .drawer-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .item-img {
          width: 64px;
          height: 64px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          flex-shrink: 0;
          background: var(--bg-gray);
        }
        .item-info {
          flex: 1;
          min-width: 0;
        }
        .item-name {
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .item-price {
          font-size: 14px;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 8px;
        }
        .qty-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .qty-btn {
          background: var(--bg-gray);
          border: none;
          width: 26px;
          height: 26px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--transition);
        }
        .qty-btn:hover { background: var(--border); }
        .qty-val { font-size: 14px; font-weight: 600; min-width: 20px; text-align: center; }
        .remove-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          padding: 4px;
          border-radius: 4px;
          transition: color var(--transition);
          flex-shrink: 0;
        }
        .remove-btn:hover { color: var(--primary); }
        .drawer-footer {
          padding: 20px 24px;
          border-top: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 16px;
        }
        .total-amount {
          font-size: 20px;
          font-weight: 800;
          color: var(--primary);
        }
        .checkout-cta {
          width: 100%;
          padding: 14px;
          font-size: 16px;
        }
        .continue-btn {
          width: 100%;
          font-size: 14px;
          color: var(--text-muted);
        }
      `}</style>
    </>
  );
}
