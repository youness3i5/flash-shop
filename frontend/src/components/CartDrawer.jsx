import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function CartDrawer() {
  const { items, totalCount, totalPrice, isOpen, setIsOpen, updateQuantity, removeItem } = useCart();

  const shipping = totalPrice >= 50 ? 0 : 4.99;
  const total = totalPrice + shipping;
  const freeShippingProgress = Math.min((totalPrice / 50) * 100, 100);
  const remaining = Math.max(0, 50 - totalPrice);

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={() => setIsOpen(false)} />
      <aside className="cart-drawer">
        <div className="drawer-header">
          <div className="drawer-header-left">
            <h2 className="drawer-title">Panier</h2>
            {totalCount > 0 && <span className="drawer-count">{totalCount}</span>}
          </div>
          <button className="close-btn" onClick={() => setIsOpen(false)} aria-label="Fermer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="drawer-empty">
            <div className="empty-blob">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <strong>Ton panier est vide</strong>
            <p>Découvre nos produits tendance</p>
            <button className="btn btn-primary" onClick={() => setIsOpen(false)}>
              Explorer →
            </button>
          </div>
        ) : (
          <>
            {remaining > 0 ? (
              <div className="drawer-shipping-bar">
                <p className="shipping-msg">
                  Plus que <strong>{remaining.toFixed(2)} €</strong> pour la livraison gratuite 🚚
                </p>
                <div className="shipping-track">
                  <div className="shipping-fill" style={{ width: `${freeShippingProgress}%` }} />
                </div>
              </div>
            ) : (
              <div className="drawer-shipping-unlocked">
                🎉 Livraison gratuite débloquée !
              </div>
            )}

            <ul className="drawer-items">
              {items.map(item => (
                <li key={item.id} className="drawer-item">
                  <Link to={`/produit/${item.id}`} className="item-img-link" onClick={() => setIsOpen(false)}>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="item-img"
                      onError={e => { e.target.src = 'https://placehold.co/72x72/f3f4f6/9ca3af?text=?'; }}
                    />
                  </Link>
                  <div className="item-info">
                    <Link to={`/produit/${item.id}`} className="item-name-link" onClick={() => setIsOpen(false)}>
                      {item.name}
                    </Link>
                    <p className="item-price-unit">{item.price.toFixed(2)} € / unité</p>
                    <div className="item-row">
                      <div className="qty-controls">
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                        <span className="qty-val">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <span className="item-subtotal">{(item.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => removeItem(item.id)} aria-label="Supprimer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            <div className="drawer-footer">
              <div className="totals-block">
                <div className="tot-row">
                  <span>Sous-total</span>
                  <span>{totalPrice.toFixed(2)} €</span>
                </div>
                <div className="tot-row">
                  <span>Livraison</span>
                  <span style={{ color: shipping === 0 ? '#059669' : 'inherit', fontWeight: shipping === 0 ? 700 : 400 }}>
                    {shipping === 0 ? 'Gratuite 🎉' : `${shipping.toFixed(2)} €`}
                  </span>
                </div>
                <div className="tot-divider" />
                <div className="tot-row tot-total">
                  <strong>Total</strong>
                  <strong className="tot-amount">{total.toFixed(2)} €</strong>
                </div>
              </div>

              <Link to="/checkout" className="btn btn-primary checkout-cta" onClick={() => setIsOpen(false)}>
                🔒 Commander · {total.toFixed(2)} €
              </Link>
              <Link to="/panier" className="btn btn-ghost view-cart-btn" onClick={() => setIsOpen(false)}>
                Voir mon panier
              </Link>
            </div>
          </>
        )}
      </aside>

      <style>{`
        .drawer-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.48);
          z-index: 200;
          animation: overlayIn 0.22s ease;
          backdrop-filter: blur(2px);
        }
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }

        .cart-drawer {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: min(420px, 100vw);
          background: white; z-index: 201;
          display: flex; flex-direction: column;
          box-shadow: -12px 0 48px rgba(0,0,0,0.15);
          animation: drawerIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes drawerIn {
          from { transform: translateX(100%); opacity: 0.5; }
          to   { transform: translateX(0); opacity: 1; }
        }

        .drawer-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px 18px 24px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-gray);
        }
        .drawer-header-left { display: flex; align-items: center; gap: 10px; }
        .drawer-title { font-size: 17px; font-weight: 800; }
        .drawer-count {
          background: var(--gradient); color: white;
          width: 22px; height: 22px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 800;
        }
        .close-btn {
          background: none; border: none; cursor: pointer;
          padding: 8px; border-radius: 8px;
          color: var(--text-muted); transition: all 0.2s;
        }
        .close-btn:hover { background: var(--border); color: var(--text); }

        .drawer-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 12px; padding: 40px; text-align: center;
        }
        .empty-blob {
          width: 80px; height: 80px;
          background: var(--bg-gray); border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted);
          margin-bottom: 4px;
        }
        .drawer-empty strong { font-size: 16px; font-weight: 800; }
        .drawer-empty p { color: var(--text-muted); font-size: 13px; }
        .drawer-empty .btn { margin-top: 4px; }

        .drawer-shipping-bar {
          padding: 10px 20px 12px;
          background: #fff7ed; border-bottom: 1px solid #fed7aa;
        }
        .shipping-msg { font-size: 12px; font-weight: 600; margin-bottom: 7px; color: #92400e; }
        .shipping-track {
          height: 5px; background: #fed7aa; border-radius: 3px; overflow: hidden;
        }
        .shipping-fill {
          height: 100%; background: linear-gradient(90deg, #FB923C, #F59E0B);
          border-radius: 3px; transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .drawer-shipping-unlocked {
          padding: 10px 20px;
          background: #ecfdf5; border-bottom: 1px solid #6ee7b7;
          font-size: 12px; font-weight: 700; color: #059669;
        }

        .drawer-items {
          flex: 1; overflow-y: auto;
          padding: 14px 20px; list-style: none;
          display: flex; flex-direction: column; gap: 14px;
        }
        .drawer-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding-bottom: 14px; border-bottom: 1px solid var(--border-light);
        }
        .drawer-item:last-child { border-bottom: none; padding-bottom: 0; }
        .item-img-link { flex-shrink: 0; }
        .item-img {
          width: 72px; height: 72px; object-fit: cover;
          border-radius: var(--radius-sm); background: var(--bg-gray);
          transition: transform 0.2s;
        }
        .item-img-link:hover .item-img { transform: scale(1.04); }

        .item-info { flex: 1; min-width: 0; }
        .item-name-link {
          font-size: 13px; font-weight: 700; display: block;
          margin-bottom: 3px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          transition: color 0.2s;
        }
        .item-name-link:hover { color: var(--primary); }
        .item-price-unit { font-size: 11.5px; color: var(--text-muted); margin-bottom: 8px; }
        .item-row { display: flex; align-items: center; justify-content: space-between; }
        .qty-controls { display: flex; align-items: center; gap: 6px; }
        .qty-btn {
          background: var(--bg-gray); border: 1.5px solid var(--border);
          width: 26px; height: 26px; border-radius: 6px; font-size: 14px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; font-family: 'Poppins', sans-serif; font-weight: 700;
        }
        .qty-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }
        .qty-val { font-size: 14px; font-weight: 800; min-width: 18px; text-align: center; }
        .item-subtotal { font-size: 14px; font-weight: 800; color: var(--primary); }
        .remove-btn {
          background: none; border: none; cursor: pointer;
          color: var(--text-light); padding: 4px; border-radius: 4px;
          transition: all 0.2s; flex-shrink: 0; margin-top: 2px;
        }
        .remove-btn:hover { color: var(--primary); background: var(--primary-light); }

        .drawer-footer {
          padding: 16px 20px; border-top: 1px solid var(--border);
          display: flex; flex-direction: column; gap: 10px;
          background: var(--bg-gray);
        }
        .totals-block {
          background: white; border: 1px solid var(--border);
          border-radius: var(--radius-sm); padding: 14px 16px;
          display: flex; flex-direction: column; gap: 8px; margin-bottom: 2px;
        }
        .tot-row { display: flex; justify-content: space-between; font-size: 13.5px; color: var(--text-muted); }
        .tot-divider { height: 1px; background: var(--border); }
        .tot-total { font-size: 15px; color: var(--text); }
        .tot-amount { font-size: 19px; color: var(--primary); }
        .checkout-cta { width: 100%; padding: 15px; font-size: 15px; }
        .view-cart-btn { width: 100%; font-size: 13px; color: var(--text-muted); }
      `}</style>
    </>
  );
}
