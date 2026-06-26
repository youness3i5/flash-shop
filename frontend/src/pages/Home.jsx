import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { SkeletonProductGrid } from '../components/Skeleton.jsx';
import { api } from '../api.js';

const CATEGORIES = [
  { name: 'Été', emoji: '☀️', color: '#FF6B35', bg: '#fff4ed', img: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=400&h=260&fit=crop' },
  { name: 'Mode', emoji: '👕', color: '#8B5CF6', bg: '#f5f3ff', img: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=400&h=260&fit=crop' },
  { name: 'Audio', emoji: '🎧', color: '#3B82F6', bg: '#eff6ff', img: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=260&fit=crop' },
  { name: 'Maison', emoji: '🏠', color: '#10B981', bg: '#ecfdf5', img: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=400&h=260&fit=crop' },
];

const TICKS = ['🚚 Livraison offerte dès 50€', '💳 Paiement 100% sécurisé', '🔄 Retours sous 30 jours', '⚡ Expédition en 24h'];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tickIdx, setTickIdx] = useState(0);

  useEffect(() => {
    api.getProducts({ featured: 'true' })
      .then(d => setFeatured(d.slice(0, 8)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTickIdx(i => (i + 1) % TICKS.length), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="home">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <div className="hero-eyebrow anim-fade-up">
              <span className="eyebrow-dot" />
              Tendances TikTok 2026
            </div>
            <h1 className="hero-h1 anim-fade-up anim-d1">
              Des produits<br />
              <span className="grad-text">viraux</span> au<br />
              meilleur prix
            </h1>
            <p className="hero-p anim-fade-up anim-d2">
              Parasols, fans, mode, tech… Tout ce qui buzz sur TikTok livré en France rapidement.
            </p>
            <div className="hero-tick anim-fade-up anim-d2">{TICKS[tickIdx]}</div>
            <div className="hero-btns anim-fade-up anim-d3">
              <Link to="/catalogue" className="btn btn-primary hero-cta">Voir le catalogue →</Link>
              <Link to="/catalogue?category=Été" className="btn btn-dark">☀️ Collection Été</Link>
            </div>
          </div>
          <div className="hero-visual anim-scale-in anim-d2">
            <div className="hero-mosaic">
              <img className="mosaic-a" src="https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=560" alt="" />
              <img className="mosaic-b" src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=280" alt="" />
              <img className="mosaic-c" src="https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=280" alt="" />
            </div>
            <div className="hero-pill pill-1">🔥 Viral TikTok</div>
            <div className="hero-pill pill-2">⚡ Prix Flash</div>
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,40 C360,0 1080,80 1440,20 L1440,60 L0,60 Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section className="stats-band">
        <div className="container stats-inner">
          {[
            { n: '25+', label: 'Produits tendance' },
            { n: '4.8★', label: 'Note moyenne' },
            { n: '24h', label: 'Expédition rapide' },
            { n: '100%', label: 'Paiement sécurisé' },
          ].map((s, i) => (
            <div key={i} className={`stat-item anim-fade-up anim-d${i + 1}`}>
              <span className="stat-n">{s.n}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATÉGORIES ── */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <div>
              <h2 className="section-title">Explorer par catégorie</h2>
              <p className="section-sub">Trouve le produit parfait pour toi</p>
            </div>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.name}
                to={`/catalogue?category=${cat.name}`}
                className="cat-card reveal"
                style={{ '--c': cat.color, transitionDelay: `${i * 0.08}s` }}
              >
                <div className="cat-img">
                  <img src={cat.img} alt={cat.name} loading="lazy" />
                  <div className="cat-overlay" />
                </div>
                <div className="cat-label">
                  <span>{cat.emoji}</span>
                  <strong>{cat.name}</strong>
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
              <p className="section-sub">Les plus commandés cette semaine</p>
            </div>
            <Link to="/catalogue" className="see-all">Tout voir →</Link>
          </div>
          {loading ? <SkeletonProductGrid count={8} /> : (
            <div className="products-grid anim-fade-in">
              {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── BANDEAU LIVRAISON ── */}
      <section className="promo-band">
        <div className="container promo-inner">
          <div className="promo-text anim-fade-up">
            <p className="promo-eyebrow">Offre spéciale</p>
            <h2>Livraison offerte<br /><span className="grad-text">dès 50€ d'achat</span></h2>
            <p className="promo-desc">France, Belgique, Suisse, Luxembourg. Suivi en temps réel inclus.</p>
            <Link to="/catalogue" className="btn btn-primary">Je commence mes achats →</Link>
          </div>
          <div className="promo-visual anim-slide-left">
            <img src="https://images.pexels.com/photos/1038628/pexels-photo-1038628.jpeg?auto=compress&cs=tinysrgb&w=560" alt="" />
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 40 }}>Pourquoi choisir FlashShop ?</h2>
          <div className="trust-grid">
            {[
              { icon: '🚚', title: 'Livraison suivie', text: 'Expédié sous 24h, suivi en temps réel par email.' },
              { icon: '💳', title: 'Paiement sécurisé', text: 'Stripe SSL — vos données bancaires protégées.' },
              { icon: '🔥', title: 'Tendances TikTok', text: 'Produits viraux sélectionnés chaque semaine.' },
              { icon: '💬', title: 'Support 7j/7', text: 'Réponse garantie en moins de 12h.' },
            ].map((t, i) => (
              <div key={i} className="trust-item reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="trust-icon-wrap">{t.icon}</div>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-col">
            <div className="footer-brand">
              <span>⚡</span>
              <span>Flash<strong>Shop</strong></span>
            </div>
            <p className="footer-tagline">Les meilleures tendances TikTok au meilleur prix. Livraison rapide en France et Europe.</p>
          </div>
          <div className="footer-col">
            <h4>Catalogue</h4>
            <Link to="/catalogue">Tous les produits</Link>
            <Link to="/catalogue?category=Été">Été ☀️</Link>
            <Link to="/catalogue?category=Mode">Mode 👕</Link>
            <Link to="/catalogue?category=Audio">Audio 🎧</Link>
            <Link to="/catalogue?category=Maison">Maison 🏠</Link>
          </div>
          <div className="footer-col">
            <h4>Aide</h4>
            <Link to="/aide">FAQ & Contact</Link>
            <Link to="/aide#livraison">Livraison</Link>
            <Link to="/aide#retours">Retours</Link>
            <a href="mailto:flashshop.contact@gmail.com">Email</a>
          </div>
          <div className="footer-col">
            <h4>Suivez-nous</h4>
            <div className="social-links">
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.27 8.27 0 0 0 4.83 1.55V6.79a4.85 4.85 0 0 1-1.07-.1z"/></svg>
                TikTok
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                Instagram
              </a>
            </div>
            <div className="payment-icons" style={{ marginTop: 12 }}>
              <span className="pay-icon">VISA</span>
              <span className="pay-icon">MC</span>
              <span className="pay-icon">CB</span>
            </div>
            <p className="footer-secure">🔒 Paiements sécurisés Stripe</p>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <span>© 2026 FlashShop — Tous droits réservés</span>
            <div className="footer-legal">
              <Link to="/legal/cgv">CGV</Link>
              <Link to="/legal/mentions">Mentions légales</Link>
              <a href="mailto:flashshop.contact@gmail.com">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .home { padding-bottom: 0; }

        /* Hero */
        .hero {
          background: linear-gradient(160deg, #0d0d0d 0%, #1a0a0a 50%, #0d1a2e 100%);
          padding: 90px 0 80px;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 800px 600px at 60% 50%, rgba(255,59,92,0.12), transparent);
          pointer-events: none;
        }
        .hero-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,59,92,0.15);
          color: #FF6B8A;
          border: 1px solid rgba(255,59,92,0.3);
          border-radius: 20px;
          padding: 7px 16px;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 24px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .eyebrow-dot {
          width: 7px; height: 7px;
          background: var(--primary);
          border-radius: 50%;
          animation: pulse 1.6s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
        .hero-h1 {
          font-size: clamp(38px, 5vw, 64px);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -2px;
          color: white;
          margin-bottom: 18px;
        }
        .hero-p {
          font-size: 16px;
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
          max-width: 420px;
          margin-bottom: 16px;
        }
        .hero-tick {
          font-size: 13px;
          font-weight: 700;
          color: #34d399;
          margin-bottom: 32px;
          transition: all 0.4s;
        }
        .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }
        .hero-cta { padding: 16px 32px; font-size: 15px; }

        .hero-visual { position: relative; }
        .hero-mosaic {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 10px;
          border-radius: var(--radius);
          overflow: hidden;
        }
        .mosaic-a { grid-row: 1/3; width: 100%; height: 100%; object-fit: cover; }
        .mosaic-b, .mosaic-c { width: 100%; height: 160px; object-fit: cover; border-radius: 8px; }
        .hero-pill {
          position: absolute;
          background: white;
          border-radius: 24px;
          padding: 9px 16px;
          font-size: 12px;
          font-weight: 800;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          white-space: nowrap;
          animation: floatPill 3s ease-in-out infinite;
        }
        .pill-1 { top: -12px; left: -16px; }
        .pill-2 { bottom: 20px; right: -16px; animation-delay: 1.5s; }
        @keyframes floatPill { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        .hero-wave {
          position: absolute;
          bottom: -1px; left: 0; right: 0;
          height: 60px;
        }
        .hero-wave svg { width: 100%; height: 100%; }

        /* Stats */
        .stats-band {
          background: var(--bg-gray);
          border-bottom: 1px solid var(--border);
          padding: 28px 0;
        }
        .stats-inner {
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }
        .stat-item { text-align: center; }
        .stat-n { display: block; font-size: 28px; font-weight: 900; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .stat-label { font-size: 12px; font-weight: 600; color: var(--text-muted); letter-spacing: 0.04em; text-transform: uppercase; }

        /* Sections */
        .section { padding: 80px 0 0; }
        .section-head { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 32px; gap: 12px; }
        .section-title { font-size: 28px; font-weight: 900; letter-spacing: -0.5px; }
        .section-sub { font-size: 14px; color: var(--text-muted); margin-top: 4px; }
        .see-all {
          color: var(--primary); font-weight: 700; font-size: 13.5px;
          padding: 9px 20px; border: 1.5px solid var(--primary);
          border-radius: 20px; transition: all 0.2s; white-space: nowrap;
        }
        .see-all:hover { background: var(--primary); color: white; }

        /* Categories */
        .cat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
        .cat-card {
          border-radius: var(--radius);
          overflow: hidden;
          position: relative;
          display: block;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .cat-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-hover); }
        .cat-img { height: 180px; overflow: hidden; position: relative; }
        .cat-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .cat-card:hover .cat-img img { transform: scale(1.1); }
        .cat-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%);
        }
        .cat-label {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
          font-weight: 800;
          font-size: 15px;
        }
        .cat-label span:first-child { font-size: 22px; }

        /* Promo band */
        .promo-band {
          margin-top: 80px;
          background: linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 100%);
          overflow: hidden;
          position: relative;
        }
        .promo-band::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 600px 400px at 30% 50%, rgba(255,59,92,0.1), transparent);
        }
        .promo-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 48px;
          padding: 72px 0;
          position: relative;
          z-index: 1;
        }
        .promo-eyebrow {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--primary);
          margin-bottom: 12px;
        }
        .promo-text h2 {
          font-size: clamp(28px, 3vw, 44px);
          font-weight: 900;
          line-height: 1.15;
          color: white;
          margin-bottom: 16px;
          letter-spacing: -1px;
        }
        .promo-desc { color: rgba(255,255,255,0.55); font-size: 14.5px; margin-bottom: 28px; max-width: 380px; }
        .promo-visual { border-radius: var(--radius); overflow: hidden; height: 280px; }
        .promo-visual img { width: 100%; height: 100%; object-fit: cover; }

        /* Trust */
        .trust-grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 24px;
        }
        .trust-item {
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 28px 24px;
          text-align: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .trust-item:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
        .trust-icon-wrap { font-size: 36px; margin-bottom: 14px; }
        .trust-item h3 { font-size: 15px; font-weight: 800; margin-bottom: 8px; }
        .trust-item p { font-size: 13px; color: var(--text-muted); line-height: 1.6; }

        /* Footer */
        .site-footer { background: var(--bg-dark); color: #9CA3AF; margin-top: 80px; }
        .footer-inner {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          padding: 60px 0 40px;
        }
        .footer-brand {
          display: flex; align-items: center; gap: 8px;
          font-size: 20px; font-weight: 700; color: white;
          margin-bottom: 14px;
        }
        .footer-brand strong { background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .footer-tagline { font-size: 13px; line-height: 1.7; max-width: 240px; }
        .footer-col { display: flex; flex-direction: column; gap: 10px; }
        .footer-col h4 { color: white; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
        .footer-col a { font-size: 13px; transition: color 0.2s; }
        .footer-col a:hover { color: white; }
        .payment-icons { display: flex; gap: 8px; flex-wrap: wrap; }
        .pay-icon { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); color: white; font-size: 11px; font-weight: 700; padding: 5px 10px; border-radius: 6px; }
        .footer-secure { font-size: 12px; color: #34d399; margin-top: 8px; }
        .social-links { display: flex; flex-direction: column; gap: 8px; }
        .social-link {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: #9CA3AF; transition: color 0.2s;
        }
        .social-link:hover { color: white; }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 18px 0;
          font-size: 12.5px;
        }
        .footer-bottom-inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
        .footer-legal { display: flex; gap: 16px; align-items: center; }
        .footer-legal a { font-size: 12px; color: rgba(255,255,255,0.4); transition: color 0.2s; }
        .footer-legal a:hover { color: rgba(255,255,255,0.8); }

        @media (max-width: 960px) {
          .hero-inner { grid-template-columns: 1fr; }
          .hero-visual { display: none; }
          .cat-grid { grid-template-columns: repeat(2,1fr); }
          .trust-grid { grid-template-columns: repeat(2,1fr); }
          .promo-inner { grid-template-columns: 1fr; }
          .promo-visual { display: none; }
          .footer-inner { grid-template-columns: 1fr 1fr; gap: 32px; }
        }
        @media (max-width: 600px) {
          .hero { padding: 60px 0 70px; }
          .stats-inner { gap: 12px; }
          .cat-grid { gap: 10px; }
          .cat-img { height: 130px; }
          .trust-grid { grid-template-columns: 1fr 1fr; gap: 14px; }
          .trust-item { padding: 20px 16px; }
          .footer-inner { grid-template-columns: 1fr; gap: 28px; }
          .footer-bottom .container { flex-direction: column; gap: 4px; text-align: center; }
        }
      `}</style>
    </div>
  );
}
