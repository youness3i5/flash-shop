import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="nf-page">
      <div className="nf-inner anim-scale-in">
        <div className="nf-code">404</div>
        <h1 className="nf-title">Page introuvable</h1>
        <p className="nf-text">Cette page n'existe pas ou a été déplacée.</p>
        <div className="nf-btns">
          <Link to="/" className="btn btn-primary">Retour à l'accueil →</Link>
          <Link to="/catalogue" className="btn btn-ghost">Voir le catalogue</Link>
        </div>
      </div>

      <style>{`
        .nf-page {
          min-height: calc(100vh - 100px);
          display: flex; align-items: center; justify-content: center;
          padding: 60px 16px;
          background: var(--bg-gray);
        }
        .nf-inner { text-align: center; max-width: 460px; }
        .nf-code {
          font-size: 120px; font-weight: 900; line-height: 1;
          background: var(--gradient);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
          letter-spacing: -4px;
        }
        .nf-title { font-size: 28px; font-weight: 900; margin-bottom: 12px; }
        .nf-text { color: var(--text-muted); font-size: 15px; margin-bottom: 32px; }
        .nf-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
      `}</style>
    </div>
  );
}
