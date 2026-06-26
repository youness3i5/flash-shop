import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from './Toast.jsx';

const BADGE_COLORS = {
  'Viral TikTok': { bg: '#FF3B5C', color: '#fff' },
  'Viral':        { bg: '#FF3B5C', color: '#fff' },
  'Bestseller':   { bg: '#FF6B35', color: '#fff' },
  'Top vente':    { bg: '#FF6B35', color: '#fff' },
  'Nouveau':      { bg: '#00C9B1', color: '#fff' },
  'Tendance':     { bg: '#8B5CF6', color: '#fff' },
  'HairTok':      { bg: '#EC4899', color: '#fff' },
  'SkincareTok':  { bg: '#F472B6', color: '#fff' },
  'RoomTok':      { bg: '#6366F1', color: '#fff' },
  'FitnessTok':   { bg: '#10B981', color: '#fff' },
  'SleepTok':     { bg: '#6366F1', color: '#fff' },
  'Éco-friendly': { bg: '#059669', color: '#fff' },
  'IPX7':         { bg: '#3B82F6', color: '#fff' },
};

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const toast = useToast();
  const [adding, setAdding] = useState(false);

  function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdding(true);
    toast?.(`✓ ${product.name.slice(0, 28)}${product.name.length > 28 ? '…' : ''} ajouté au panier`);
    setTimeout(() => setAdding(false), 1500);
  }

  const badgeStyle = product.badge && BADGE_COLORS[product.badge]
    ? BADGE_COLORS[product.badge]
    : { bg: '#374151', color: '#fff' };

  const stars = 4 + Math.floor(Math.abs(product.id?.charCodeAt(1) - 50) % 2);
  const reviews = 18 + (parseInt(product.id?.replace('p', '') || '1') * 7);
  const sold = 40 + (parseInt(product.id?.replace('p', '') || '1') * 17) % 200;
  const delay = Math.min(index, 7) * 0.06;

  return (
    <article
      className="product-card anim-fade-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <Link to={`/produit/${product.id}`} className="card-img-link">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="card-img"
          loading="lazy"
          onError={e => { e.target.src = 'https://placehold.co/500x500/f3f4f6/9ca3af?text=Photo'; }}
        />
        {product.badge && (
          <span className="card-badge" style={{ background: badgeStyle.bg, color: badgeStyle.color }}>
            {product.badge}
          </span>
        )}
        <div className="card-overlay">
          <button className={`quick-add${adding ? ' quick-added' : ''}`} onClick={handleAdd}>
            {adding ? '✓ Ajouté !' : '🛒 Ajouter au panier'}
          </button>
        </div>
      </Link>

      <div className="card-body">
        <span className="card-category">{product.category}</span>
        <Link to={`/produit/${product.id}`} className="card-name">{product.name}</Link>
        <div className="card-stars">
          <span className="stars-filled">{'★'.repeat(stars)}</span>
          <span className="stars-empty">{'☆'.repeat(5 - stars)}</span>
          <span className="card-reviews">({reviews})</span>
        </div>
        <div className="card-sold">🔥 {sold} commandés</div>
        <div className="card-footer">
          <span className="card-price">{product.price.toFixed(2)} €</span>
          <button
            className={`add-btn${adding ? ' added' : ''}`}
            onClick={handleAdd}
            aria-label="Ajouter au panier"
            title="Ajouter au panier"
          >
            {adding
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            }
          </button>
        </div>
      </div>

      <style>{`
        .product-card {
          background: white;
          border-radius: var(--radius);
          overflow: hidden;
          border: 1px solid var(--border);
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, border-color 0.3s ease;
          display: flex; flex-direction: column;
          position: relative;
        }
        .product-card:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: var(--shadow-hover);
          border-color: transparent;
        }

        .card-img-link {
          position: relative; display: block;
          overflow: hidden; aspect-ratio: 1;
          background: var(--bg-gray);
        }
        .card-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .product-card:hover .card-img { transform: scale(1.09); }

        .card-badge {
          position: absolute; top: 10px; left: 10px;
          border-radius: 20px; padding: 4px 10px;
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.05em; text-transform: uppercase;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2); z-index: 1;
        }

        .card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%);
          display: flex; align-items: flex-end;
          justify-content: center; padding-bottom: 14px;
          opacity: 0; transition: opacity 0.3s ease;
        }
        .product-card:hover .card-overlay { opacity: 1; }

        .quick-add {
          background: white; color: var(--text);
          border: none; border-radius: 20px;
          padding: 9px 20px; font-size: 12.5px; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          font-family: 'Poppins', sans-serif;
          transform: translateY(6px);
          opacity: 0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        }
        .product-card:hover .quick-add {
          transform: translateY(0); opacity: 1;
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .quick-add:hover { background: var(--primary); color: white; }
        .quick-add.quick-added { background: #10B981; color: white; }

        .card-body {
          padding: 14px 16px 16px;
          display: flex; flex-direction: column; gap: 5px;
          flex: 1;
        }
        .card-category {
          font-size: 10.5px; font-weight: 700;
          color: var(--text-muted); text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .card-name {
          font-size: 13.5px; font-weight: 700; color: var(--text);
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
          line-height: 1.45; transition: color var(--transition);
        }
        .card-name:hover { color: var(--primary); }

        .card-stars { display: flex; align-items: center; gap: 2px; }
        .stars-filled { font-size: 12px; color: #F59E0B; letter-spacing: 1px; }
        .stars-empty  { font-size: 12px; color: #D1D5DB; letter-spacing: 1px; }
        .card-reviews {
          color: var(--text-light); font-size: 11px;
          margin-left: 4px; font-weight: 500;
        }
        .card-sold {
          font-size: 11px; font-weight: 700; color: #c2410c;
          background: #fff7ed; border-radius: 12px;
          padding: 3px 8px; display: inline-block;
        }

        .card-footer {
          display: flex; align-items: center;
          justify-content: space-between; margin-top: 4px;
        }
        .card-price { font-size: 18px; font-weight: 900; color: var(--primary); }

        .add-btn {
          background: var(--gradient); color: white;
          border: none; width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          flex-shrink: 0; box-shadow: 0 4px 12px rgba(255,59,92,0.3);
        }
        .add-btn:hover { transform: scale(1.15); box-shadow: var(--shadow-primary); }
        .add-btn.added { background: #10B981; box-shadow: 0 4px 12px rgba(16,185,129,0.3); }
        .add-btn:active { transform: scale(0.95); }
      `}</style>
    </article>
  );
}
