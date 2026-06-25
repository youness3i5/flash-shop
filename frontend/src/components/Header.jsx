import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const CATEGORIES = [
  { name: 'Été', emoji: '☀️' },
  { name: 'Audio', emoji: '🎧' },
  { name: 'Mode', emoji: '👕' },
  { name: 'Maison', emoji: '🏠' },
];

export default function Header() {
  const { totalCount, setIsOpen } = useCart();
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <span className="logo-bolt">⚡</span>
          <span>Flash Shop</span>
        </Link>

        <nav className="header-nav">
          {CATEGORIES.map(c => (
            <Link
              key={c.name}
              to={`/catalogue?category=${c.name}`}
              className="nav-link"
            >
              {c.emoji} {c.name}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link to="/catalogue" className="btn btn-ghost search-btn" title="Rechercher">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </Link>
          <button
            className="cart-btn"
            onClick={() => setIsOpen(true)}
            aria-label={`Panier (${totalCount} articles)`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {totalCount > 0 && <span className="badge">{totalCount}</span>}
          </button>
        </div>
      </div>

      <style>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: white;
          border-bottom: 1px solid var(--border);
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .header-inner {
          display: flex;
          align-items: center;
          gap: 24px;
          height: 60px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 20px;
          font-weight: 800;
          color: var(--text);
          letter-spacing: -0.5px;
          flex-shrink: 0;
        }
        .logo-bolt {
          font-size: 22px;
        }
        .header-nav {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
        }
        .nav-link {
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 14px;
          font-weight: 500;
          color: var(--text-muted);
          transition: all var(--transition);
          white-space: nowrap;
        }
        .nav-link:hover {
          color: var(--primary);
          background: var(--primary-light);
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .search-btn {
          padding: 8px;
          border-radius: var(--radius-sm);
        }
        .cart-btn {
          position: relative;
          background: none;
          border: none;
          padding: 8px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          color: var(--text);
          transition: background var(--transition);
        }
        .cart-btn:hover {
          background: var(--bg-gray);
        }
        .cart-btn .badge {
          position: absolute;
          top: 2px;
          right: 2px;
        }
        @media (max-width: 640px) {
          .header-nav {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
