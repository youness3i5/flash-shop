import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { api } from '../api.js';

const CATEGORIES = [
  { name: 'Été', emoji: '☀️', desc: '23 produits', color: '#FF6B35', bg: 'linear-gradient(135deg,#fff4e6,#ffe8cc)', img: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  { name: 'Mode', emoji: '👕', desc: '8 produits', color: '#8B5CF6', bg: 'linear-gradient(135deg,#f5f3ff,#ede9fe)', img: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  { name: 'Audio', emoji: '🎧', desc: '4 produits', color: '#3B82F6', bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)', img: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
  { name: 'Maison', emoji: '🏠', desc: '7 produits', color: '#10B981', bg: 'linear-gradient(135deg,#ecfdf5,#d1fae5)', img: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
];

const TICKS = ['🚚 Livraison offerte dès 50€', '💳 Paiement 100% sécurisé', '🔄 Retours sous 30 jours', '🇫🇷 Expédié depuis la France'];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tickIdx, setTickIdx] = useState(0);

  useEffect(() => {
    api.getProducts({ featured: 'true' })
      .then(data => setFeatured(data.slice(0, 8)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTickIdx(i => (i + 1) % TICKS.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="home">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="badge-dot" />
              Tendances TikTok 2026
            </div>
            <h1 className="hero-title">
              Des produits <span className="hero-grad">viraux</span><br />
              livrés en France
            </h1>
            <p className="hero-subtitle">
              Parasols, fans, mode, tech… Tout ce qui buzz sur TikTok, au meilleur prix.
              Livraison rapide, paiement sécurisé.
            </p>
            <div className="hero-tick">{TICKS[tickIdx]}</div>
            <div className="hero-actions">
              <Link to="/catalogue" className="btn btn-primary hero-cta">
                Voir tous les produits →
              </Link>
              <Link to="/catalogue?category=Été" className="btn btn-dark">
                ☀️ Collection Été
              </Link>
            </div>
          </div>

          <div className="hero-mosaic">
            <div className="mosaic-main">
              <img src="https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=500" alt="Produits été" />
            </div>
            <div className="mosaic-side">
              <img src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300" alt="Écouteurs" />
              <img src="https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300" alt="Lunettes" />
            </div>
            <div className="hero-float hero-float-1">🔥 Viral</div>
            <div className="hero-float hero-float-2">⚡ Prix Flash</div>
          </div>
        </div>
      </section>

      {/* ── CATÉGORIES ── */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Parcourir par catégorie</h2>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.name}
                to={`/catalogue?category=${cat.name}`}
                className="cat-card"
                style={{ '--cat-bg': cat.bg, '--cat-color': cat.color }}
              >
                <div className="cat-img-wrap">
                  <img src={cat.img} alt={cat.name} loading="lazy" />
                </div>
                <div className="cat-info">
                  <span className="cat-emoji">{cat.emoji}</span>
                  <span className="cat-name">{cat.name}</span>
                  <span className="cat-desc">{cat.desc}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUITS VEDETTES ── */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">🔥 Sélection du moment</h2>
              <p className="section-sub">Les plus demandés cette semaine</p>
            </div>
            <Link to="/catalogue" className="see-all">Voir tout →</Link>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── BANDEAU PROMO ── */}
      <section className="promo-band">
        <div className="container promo-inner">
          <div className="promo-text">
            <h2>Livraison offerte<br /><span>dès 50€ d'achat</span></h2>
            <p>Profitez de la livraison gratuite sur toute la France et une partie de l'Europe.</p>
            <Link to="/catalogue" className="btn btn-primary">Je commande →</Link>
          </div>
          <div className="promo-imgs">
            <img src="https://images.pexels.com/photos/1038628/pexels-photo-1038628.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Plage" />
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className="section">
        <div className="container">
          <div className="trust-grid">
            {[
              { icon: '🚚', title: 'Livraison suivie', text: 'Expédié en 24h — suivi en temps réel' },
              { icon: '💳', title: 'Paiement sécurisé', text: 'Stripe SSL — 0% fraude garantie' },
              { icon: '🔥', title: 'Tendances TikTok', text: 'Produits viraux sélectionnés chaque semaine' },
              { icon: '💬', title: 'Support 7j/7', text: 'On répond dans les 12h — promis !' },
            ].map(t => (
              <div key={t.title} className="trust-item">
                <span className="trust-icon">{t.icon}</span>
                <strong>{t.title}</strong>
                <p>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER MINI ── */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="logo-icon">⚡</span>
            <span>Flash<strong>Shop</strong></span>
          </div>
          <div className="footer-links">
            <Link to="/catalogue">Catalogue</Link>
            <Link to="/aide">Aide & FAQ</Link>
            <Link to="/aide#contact">Contact</Link>
          </div>
          <p className="footer-copy">© 2026 FlashShop — Tous droits réservés</p>
        </div>
      </footer>

      <style>{`
        .home { padding-bottom: 0; }

        /* Hero */
        .hero {
          background: linear-gradient(135deg, #fff5f5 0%, #ffffff 40%, #f0f4ff 100%);
          padding: 72px 0 80px;
          overflow: hidden;
        }
        .hero-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--primary-light);
          color: var(--primary);
          border: 1px solid rgba(255,59,92,0.25);
          border-radius: 20px;
          padding: 7px 16px;
          font-size: 12.5px;
          font-weight: 800;
          margin-bottom: 22px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .badge-dot {
          width: 8px; height: 8px;
          background: var(--primary);
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        .hero-title {
          font-size: clamp(34px, 4.5vw, 58px);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 18px;
          letter-spacing: -1.5px;
        }
        .hero-grad {
          background: var(--gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          font-size: 15.5px;
          color: var(--text-muted);
          line-height: 1.7;
          max-width: 460px;
          margin-bottom: 16px;
        }
        .hero-tick {
          font-size: 13px;
          font-weight: 700;
          color: #059669;
          margin-bottom: 28px;
          transition: all 0.3s;
        }
        .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .hero-cta { padding: 15px 30px; font-size: 15px; }

        .hero-mosaic {
          position: relative;
          display: grid;
          grid-template-columns: 2fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 10px;
          height: 340px;
        }
        .mosaic-main {
          grid-row: 1 / 3;
          border-radius: var(--radius);
          overflow: hidden;
        }
        .mosaic-main img { width: 100%; height: 100%; object-fit: cover; }
        .mosaic-side { display: flex; flex-direction: column; gap: 10px; }
        .mosaic-side img {
          flex: 1;
          width: 100%;
          object-fit: cover;
          border-radius: var(--radius-sm);
        }
        .hero-float {
          position: absolute;
          background: white;
          border-radius: 10px;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 800;
          box-shadow: var(--shadow);
          animation: float 3s ease-in-out infinite;
        }
        .hero-float-1 { top: -10px; left: -16px; }
        .hero-float-2 { bottom: 20px; right: -12px; animation-delay: 1.5s; }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        /* Sections */
        .section { padding: 72px 0 0; }
        .section-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 28px;
          gap: 12px;
        }
        .section-title { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; }
        .section-sub { font-size: 14px; color: var(--text-muted); margin-top: 4px; }
        .see-all {
          color: var(--primary);
          font-weight: 700;
          font-size: 14px;
          white-space: nowrap;
          padding: 8px 16px;
          border: 1.5px solid var(--primary);
          border-radius: 20px;
          transition: all var(--transition);
        }
        .see-all:hover { background: var(--primary); color: white; }

        /* Categories */
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .cat-card {
          border-radius: var(--radius);
          overflow: hidden;
          background: var(--cat-bg);
          transition: transform 0.25s, box-shadow 0.25s;
          display: flex;
          flex-direction: column;
          border: 1px solid transparent;
        }
        .cat-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-hover); border-color: var(--cat-color); }
        .cat-img-wrap { height: 130px; overflow: hidden; }
        .cat-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .cat-card:hover .cat-img-wrap img { transform: scale(1.08); }
        .cat-info {
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .cat-emoji { font-size: 22px; }
        .cat-name {
          font-size: 15px;
          font-weight: 800;
          color: var(--cat-color);
          flex: 1;
        }
        .cat-desc { font-size: 11px; color: var(--text-muted); font-weight: 600; }

        /* Promo band */
        .promo-band {
          margin-top: 72px;
          background: var(--bg-dark);
          color: white;
          overflow: hidden;
        }
        .promo-inner {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 40px;
          padding-top: 56px;
          padding-bottom: 56px;
        }
        .promo-text h2 {
          font-size: clamp(26px, 3vw, 40px);
          font-weight: 900;
          line-height: 1.15;
          margin-bottom: 14px;
        }
        .promo-text h2 span { color: var(--primary); }
        .promo-text p { color: #9CA3AF; font-size: 14px; margin-bottom: 24px; max-width: 400px; }
        .promo-imgs { width: 240px; height: 180px; border-radius: var(--radius); overflow: hidden; flex-shrink: 0; }
        .promo-imgs img { width: 100%; height: 100%; object-fit: cover; }

        /* Trust */
        .trust-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          padding: 40px 36px;
          background: var(--bg-gray);
          border-radius: var(--radius);
          border: 1px solid var(--border);
        }
        .trust-item { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; }
        .trust-icon { font-size: 32px; }
        .trust-item strong { font-size: 14px; font-weight: 800; }
        .trust-item p { font-size: 12.5px; color: var(--text-muted); line-height: 1.5; }

        /* Footer */
        .site-footer {
          margin-top: 72px;
          background: var(--bg-dark);
          color: #6B7280;
          padding: 40px 0;
        }
        .footer-inner { display: flex; align-items: center; gap: 32px; flex-wrap: wrap; justify-content: space-between; }
        .footer-brand { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 700; color: white; }
        .footer-brand strong { background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .footer-brand .logo-icon { font-size: 22px; }
        .footer-links { display: flex; gap: 24px; }
        .footer-links a { font-size: 13px; color: #9CA3AF; font-weight: 500; transition: color var(--transition); }
        .footer-links a:hover { color: white; }
        .footer-copy { font-size: 12px; }

        @media (max-width: 900px) {
          .hero-inner { grid-template-columns: 1fr; }
          .hero-mosaic { display: none; }
          .cat-grid { grid-template-columns: repeat(2, 1fr); }
          .trust-grid { grid-template-columns: repeat(2, 1fr); }
          .promo-imgs { display: none; }
        }
        @media (max-width: 600px) {
          .hero { padding: 48px 0 56px; }
          .cat-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .trust-grid { grid-template-columns: 1fr 1fr; padding: 24px 20px; }
          .footer-inner { flex-direction: column; align-items: flex-start; gap: 20px; }
          .section { padding-top: 48px; }
        }
      `}</style>
    </div>
  );
}
