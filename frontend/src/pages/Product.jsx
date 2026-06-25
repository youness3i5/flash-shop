import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import { SkeletonProductPage } from '../components/Skeleton.jsx';

const BADGE_COLORS = {
  'Viral TikTok': '#FF3B5C',
  'Viral':        '#FF3B5C',
  'Bestseller':   '#FF6B35',
  'Top vente':    '#FF6B35',
  'Nouveau':      '#00C9B1',
  'Tendance':     '#8B5CF6',
};

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    api.getProduct(id)
      .then(setProduct)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAdd() {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  if (loading) return <div className="container"><SkeletonProductPage /></div>;
  if (error || !product) return (
    <div className="container" style={{ padding: '80px 16px', textAlign: 'center' }}>
      <p style={{ fontSize: 48, marginBottom: 16 }}>😕</p>
      <h2 style={{ marginBottom: 8 }}>Produit introuvable</h2>
      <p className="error-msg" style={{ marginBottom: 24 }}>Ce produit n'existe pas ou a été supprimé.</p>
      <Link to="/catalogue" className="btn btn-primary">Retour au catalogue</Link>
    </div>
  );

  const stars = 4 + Math.floor(Math.abs(product.id?.charCodeAt(1) - 50) % 2);
  const reviews = 18 + (parseInt(product.id?.replace('p','') || '1') * 7);
  const badgeColor = product.badge && BADGE_COLORS[product.badge] ? BADGE_COLORS[product.badge] : '#374151';

  return (
    <div className="product-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Accueil</Link>
          <span>›</span>
          <Link to="/catalogue">Catalogue</Link>
          <span>›</span>
          <Link to={`/catalogue?category=${product.category}`}>{product.category}</Link>
          <span>›</span>
          <span className="bc-current">{product.name}</span>
        </nav>

        <div className="product-layout">
          <div className="product-img-wrap">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-img"
              onError={e => { e.target.src = 'https://placehold.co/600x600/f3f4f6/9ca3af?text=Photo'; }}
            />
            {product.badge && (
              <span className="product-badge" style={{ background: badgeColor }}>
                {product.badge}
              </span>
            )}
          </div>

          <div className="product-info anim-fade-up">
            <span className="product-cat-tag">{product.category}</span>
            <h1 className="product-name">{product.name}</h1>

            <div className="product-stars">
              {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
              <span className="reviews-count">{reviews} avis clients</span>
            </div>

            <div className="product-price-wrap">
              <span className="product-price">{product.price.toFixed(2)} €</span>
              <span className="product-shipping">🚚 Livraison offerte dès 50€</span>
            </div>

            <p className="product-desc">{product.description}</p>

            {product.stock > 0 && product.stock <= 10 && (
              <div className="stock-alert">
                <span>⚡ Plus que {product.stock} en stock — commande vite !</span>
              </div>
            )}
            {product.stock === 0 && (
              <div className="stock-alert out">Rupture de stock</div>
            )}

            <div className="qty-row">
              <label>Quantité</label>
              <div className="qty-controls">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >−</button>
                <span className="qty-val">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))}
                  disabled={quantity >= (product.stock || 99)}
                >+</button>
              </div>
            </div>

            <button
              className={`btn btn-primary add-cart-btn${added ? ' added' : ''}`}
              onClick={handleAdd}
              disabled={product.stock === 0}
            >
              {added
                ? '✓ Produit ajouté au panier !'
                : `🛒 Ajouter au panier — ${(product.price * quantity).toFixed(2)} €`
              }
            </button>

            <div className="trust-badges">
              <span>🔒 Paiement sécurisé</span>
              <span>🚚 Livraison suivie</span>
              <span>🔄 Retours 30j</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .product-page { padding: 28px 0 100px; }
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          color: var(--text-muted);
          margin-bottom: 36px;
          flex-wrap: wrap;
        }
        .breadcrumb a:hover { color: var(--primary); }
        .breadcrumb > span { color: var(--border); }
        .bc-current { color: var(--text); font-weight: 600; }

        .product-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: start;
        }
        .product-img-wrap {
          position: relative;
          border-radius: var(--radius);
          overflow: hidden;
          background: var(--bg-gray);
          aspect-ratio: 1;
          border: 1px solid var(--border);
        }
        .product-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .product-img-wrap:hover .product-img { transform: scale(1.04); }
        .product-badge {
          position: absolute;
          top: 14px; left: 14px;
          color: white;
          border-radius: 20px;
          padding: 5px 12px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        .product-info { display: flex; flex-direction: column; gap: 18px; }
        .product-cat-tag {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
        }
        .product-name {
          font-size: 28px;
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }
        .product-stars {
          font-size: 15px;
          color: #F59E0B;
          letter-spacing: 2px;
        }
        .reviews-count {
          color: var(--text-muted);
          font-size: 12px;
          margin-left: 8px;
          letter-spacing: 0;
          font-weight: 600;
        }
        .product-price-wrap { display: flex; align-items: baseline; gap: 16px; flex-wrap: wrap; }
        .product-price {
          font-size: 38px;
          font-weight: 900;
          background: var(--gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .product-shipping {
          font-size: 12.5px;
          font-weight: 700;
          color: #059669;
          background: #ecfdf5;
          padding: 4px 10px;
          border-radius: 20px;
        }
        .product-desc {
          font-size: 14.5px;
          color: var(--text-muted);
          line-height: 1.75;
        }
        .stock-alert {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 700;
          color: #c2410c;
        }
        .stock-alert.out { background: var(--primary-light); border-color: rgba(255,59,92,0.3); color: var(--primary); }

        .qty-row { display: flex; flex-direction: column; gap: 8px; }
        .qty-controls { display: flex; align-items: center; gap: 12px; }
        .qty-btn {
          background: var(--bg-gray);
          border: 1.5px solid var(--border);
          width: 40px; height: 40px;
          border-radius: 10px;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition);
          font-family: 'Poppins', sans-serif;
        }
        .qty-btn:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }
        .qty-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .qty-val { font-size: 20px; font-weight: 800; min-width: 36px; text-align: center; }

        .add-cart-btn {
          width: 100%;
          padding: 17px;
          font-size: 15px;
          border-radius: var(--radius-sm);
          letter-spacing: 0.02em;
        }
        .add-cart-btn.added {
          background: linear-gradient(135deg, #059669, #10B981) !important;
          box-shadow: 0 8px 24px rgba(16,185,129,0.4) !important;
        }

        .trust-badges {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .trust-badges span {
          font-size: 12px;
          font-weight: 700;
          padding: 7px 14px;
          background: var(--bg-gray);
          border-radius: 20px;
          border: 1px solid var(--border);
          color: var(--text-muted);
        }

        @media (max-width: 800px) {
          .product-layout { grid-template-columns: 1fr; gap: 28px; }
          .product-name { font-size: 22px; }
          .product-price { font-size: 30px; }
        }
      `}</style>
    </div>
  );
}
