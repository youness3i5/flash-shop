import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Header() {
  const { totalCount, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <>
      <div className="announce-bar">
        🔥 Livraison GRATUITE dès 50€ · 🚚 Expédié en 24h · Retours 30 jours
      </div>

      <header className={`header${scrolled ? ' scrolled' : ''}`}>
        <div className="container header-inner">
          <Link to="/" className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Flash<strong>Shop</strong></span>
          </Link>

          <nav className="header-nav">
            <NavLink to="/catalogue" end className={({ isActive }) => `nav-link${isActive ? ' nav-active' : ''}`}>Catalogue</NavLink>
            <Link to="/catalogue?category=Été" className={`nav-link${location.search.includes('Été') ? ' nav-active' : ''}`}>☀️ Été</Link>
            <Link to="/catalogue?category=Mode" className={`nav-link${location.search.includes('Mode') ? ' nav-active' : ''}`}>👕 Mode</Link>
            <Link to="/catalogue?category=Audio" className={`nav-link${location.search.includes('Audio') ? ' nav-active' : ''}`}>🎧 Audio</Link>
            <Link to="/catalogue?category=Maison" className={`nav-link${location.search.includes('Maison') ? ' nav-active' : ''}`}>🏠 Maison</Link>
            <NavLink to="/aide" className={({ isActive }) => `nav-link nav-link-help${isActive ? ' nav-active-help' : ''}`}>💬 Aide</NavLink>
          </nav>

          <div className="header-actions">
            <Link to="/catalogue" className="icon-btn" title="Rechercher" aria-label="Rechercher">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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

            <button
              className="burger"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <span className={`burger-line${menuOpen ? ' open' : ''}`} />
              <span className={`burger-line${menuOpen ? ' open' : ''}`} />
              <span className={`burger-line${menuOpen ? ' open' : ''}`} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="mobile-menu">
            <Link to="/catalogue" className="mob-link">Tous les produits</Link>
            <Link to="/catalogue?category=Été" className="mob-link">☀️ Été</Link>
            <Link to="/catalogue?category=Mode" className="mob-link">👕 Mode</Link>
            <Link to="/catalogue?category=Audio" className="mob-link">🎧 Audio</Link>
            <Link to="/catalogue?category=Maison" className="mob-link">🏠 Maison</Link>
            <Link to="/aide" className="mob-link">💬 Aide & Contact</Link>
          </nav>
        )}
      </header>

      <style>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          transition: box-shadow 0.2s;
        }
        .header.scrolled { box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .header-inner {
          display: flex;
          align-items: center;
          gap: 20px;
          height: 64px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          text-decoration: none;
        }
        .logo-icon {
          font-size: 26px;
          filter: drop-shadow(0 2px 4px rgba(255,59,92,0.4));
        }
        .logo-text {
          font-size: 19px;
          font-weight: 600;
          color: var(--text);
          letter-spacing: -0.3px;
        }
        .logo-text strong {
          font-weight: 900;
          background: var(--gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .header-nav {
          display: flex;
          align-items: center;
          gap: 2px;
          flex: 1;
        }
        .nav-link {
          padding: 7px 13px;
          border-radius: var(--radius-xs);
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-muted);
          transition: all var(--transition);
          white-space: nowrap;
        }
        .nav-link:hover {
          color: var(--primary);
          background: var(--primary-light);
        }
        .nav-active { color: var(--primary) !important; background: var(--primary-light); }
        .nav-link-help { color: var(--accent); }
        .nav-link-help:hover { background: var(--accent-light); color: var(--accent); }
        .nav-active-help { background: var(--accent-light) !important; }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .icon-btn {
          background: none;
          border: none;
          padding: 9px;
          border-radius: var(--radius-xs);
          cursor: pointer;
          color: var(--text-muted);
          transition: all var(--transition);
          display: flex;
          align-items: center;
        }
        .icon-btn:hover { background: var(--bg-gray); color: var(--text); }
        .cart-btn {
          position: relative;
          background: none;
          border: none;
          padding: 9px;
          border-radius: var(--radius-xs);
          cursor: pointer;
          display: flex;
          align-items: center;
          color: var(--text);
          transition: background var(--transition);
        }
        .cart-btn:hover { background: var(--bg-gray); }
        .cart-btn .badge {
          position: absolute;
          top: 1px;
          right: 1px;
          min-width: 18px;
          height: 18px;
          font-size: 10px;
        }
        .burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          border-radius: var(--radius-xs);
        }
        .burger-line {
          display: block;
          width: 20px;
          height: 2px;
          background: var(--text);
          border-radius: 2px;
          transition: all 0.25s;
        }
        .burger-line.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .burger-line.open:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .burger-line.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        .mobile-menu {
          display: flex;
          flex-direction: column;
          background: var(--bg);
          border-top: 1px solid var(--border);
          padding: 8px 0 16px;
        }
        .mob-link {
          padding: 13px 20px;
          font-size: 15px;
          font-weight: 600;
          color: var(--text);
          border-bottom: 1px solid var(--border-light);
          transition: background var(--transition);
        }
        .mob-link:hover { background: var(--bg-gray); }

        @media (max-width: 820px) {
          .header-nav { display: none; }
          .burger { display: flex; }
        }
        @media (min-width: 821px) {
          .mobile-menu { display: none; }
        }
      `}</style>
    </>
  );
}
