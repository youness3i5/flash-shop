import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { api } from '../api.js';

const CATEGORIES = [
  { name: 'Été', emoji: '☀️', color: '#FF4D4D', bg: '#fff0f0' },
  { name: 'Audio', emoji: '🎧', color: '#3498DB', bg: '#eaf4fd' },
  { name: 'Mode', emoji: '👕', color: '#9B59B6', bg: '#f5eeff' },
  { name: 'Maison', emoji: '🏠', color: '#27AE60', bg: '#eafaf1' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getProducts({ featured: 'true' })
      .then(data => setFeatured(data.slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <div className="hero-badge">⚡ Tendances TikTok</div>
            <h1 className="hero-title">
              Les meilleurs<br />
              <span className="hero-highlight">deals de l'été</span>
            </h1>
            <p className="hero-subtitle">
              Produits tendance livrés rapidement en France. Prix imbattables, qualité vérifiée.
            </p>
            <div className="hero-actions">
              <Link to="/catalogue" className="btn btn-primary hero-cta">
                Voir le catalogue →
              </Link>
              <Link to="/catalogue?category=Été" className="btn btn-outline">
                ☀️ Collection Été
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-cards">
              <div className="floating-card">🔥 Viral TikTok</div>
              <div className="floating-card" style={{ top: '60%', right: '-10px' }}>⚡ Prix Flash</div>
              <div className="floating-card" style={{ bottom: '10%', left: '20%' }}>🚚 Livraison rapide</div>
            </div>
            <div className="hero-img-placeholder">
              <span>☀️</span>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Catégories</h2>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.name}
                to={`/catalogue?category=${cat.name}`}
                className="cat-card"
                style={{ '--cat-color': cat.color, '--cat-bg': cat.bg }}
              >
                <span className="cat-emoji">{cat.emoji}</span>
                <span className="cat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Produits vedettes</h2>
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

      <section className="trust-section">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <span className="trust-icon">🚚</span>
              <strong>Livraison suivie</strong>
              <p>Expédition rapide en France et Europe</p>
            </div>
            <div className="trust-item">
              <span className="trust-icon">💳</span>
              <strong>Paiement sécurisé</strong>
              <p>Powered by Stripe — 100% sécurisé</p>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🔥</span>
              <strong>Tendances TikTok</strong>
              <p>Produits viraux sélectionnés chaque semaine</p>
            </div>
            <div className="trust-item">
              <span className="trust-icon">💬</span>
              <strong>Support client</strong>
              <p>On répond dans les 24h par email</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .home { padding-bottom: 60px; }

        .hero {
          background: linear-gradient(135deg, #fff5f5 0%, #fff 50%, #f0f7ff 100%);
          padding: 60px 0 80px;
          overflow: hidden;
        }
        .hero-inner {
          display: flex;
          align-items: center;
          gap: 48px;
        }
        .hero-text {
          flex: 1;
          min-width: 0;
        }
        .hero-badge {
          display: inline-block;
          background: var(--primary-light);
          color: var(--primary);
          border: 1px solid rgba(255,77,77,0.2);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .hero-title {
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 16px;
          letter-spacing: -1px;
        }
        .hero-highlight { color: var(--primary); }
        .hero-subtitle {
          font-size: 16px;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 32px;
          max-width: 440px;
        }
        .hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .hero-cta { padding: 14px 28px; font-size: 16px; }
        .hero-visual {
          flex: 0 0 320px;
          position: relative;
          height: 280px;
        }
        .hero-img-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #FF4D4D22, #FF4D4D44);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 80px;
        }
        .hero-cards {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }
        .floating-card {
          position: absolute;
          top: 10%;
          left: -20px;
          background: white;
          border-radius: 10px;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 700;
          box-shadow: var(--shadow);
          animation: float 3s ease-in-out infinite;
        }
        .floating-card:nth-child(2) { animation-delay: 1s; }
        .floating-card:nth-child(3) { animation-delay: 2s; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .categories-section { padding: 60px 0 0; }
        .section-title {
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 24px;
        }
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .cat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 28px 16px;
          background: var(--cat-bg);
          border-radius: var(--radius);
          transition: transform var(--transition), box-shadow var(--transition);
          border: 1px solid transparent;
        }
        .cat-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-hover);
          border-color: var(--cat-color);
        }
        .cat-emoji { font-size: 36px; }
        .cat-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--cat-color);
        }

        .featured-section { padding: 60px 0 0; }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .see-all {
          color: var(--primary);
          font-weight: 600;
          font-size: 14px;
        }
        .see-all:hover { text-decoration: underline; }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        .trust-section {
          padding: 60px 0 0;
        }
        .trust-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          padding: 32px;
          background: var(--bg-gray);
          border-radius: var(--radius);
        }
        .trust-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
        }
        .trust-icon { font-size: 28px; }
        .trust-item strong { font-size: 14px; }
        .trust-item p { font-size: 12px; color: var(--text-muted); line-height: 1.4; }

        @media (max-width: 900px) {
          .hero-visual { display: none; }
          .categories-grid { grid-template-columns: repeat(2, 1fr); }
          .trust-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .hero { padding: 40px 0 60px; }
          .trust-grid { grid-template-columns: 1fr; padding: 20px; }
        }
      `}</style>
    </div>
  );
}
