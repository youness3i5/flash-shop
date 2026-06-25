import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api.js';
import { useCart } from '../context/CartContext.jsx';

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
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (error || !product) return (
    <div className="container" style={{ padding: '80px 16px', textAlign: 'center' }}>
      <p className="error-msg">Produit introuvable.</p>
      <Link to="/catalogue" className="btn btn-primary" style={{ marginTop: 16 }}>
        Retour au catalogue
      </Link>
    </div>
  );

  return (
    <div className="product-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Accueil</Link>
          <span>/</span>
          <Link to="/catalogue">Catalogue</Link>
          <span>/</span>
          <Link to={`/catalogue?category=${product.category}`}>{product.category}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="product-layout">
          <div className="product-img-wrap">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-img"
              onError={e => { e.target.src = 'https://placehold.co/600x600/f0f0f0/999?text=Image'; }}
            />
            <span className="product-cat-badge">{product.category}</span>
          </div>

          <div className="product-info">
            <h1 className="product-name">{product.name}</h1>
            <div className="product-price">{product.price.toFixed(2)} €</div>

            <p className="product-desc">{product.description}</p>

            {product.stock <= 5 && product.stock > 0 && (
              <p className="stock-warning">⚠️ Plus que {product.stock} en stock !</p>
            )}
            {product.stock === 0 && (
              <p className="out-of-stock">Rupture de stock</p>
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
              className={`btn btn-primary add-to-cart-btn ${added ? 'added' : ''}`}
              onClick={handleAdd}
              disabled={product.stock === 0}
            >
              {added ? '✓ Ajouté au panier !' : '🛒 Ajouter au panier'}
            </button>

            {product.sourceUrl && (
              <a
                href={product.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="source-link"
              >
                Voir la source →
              </a>
            )}

            <div className="product-badges">
              <span className="p-badge">🚚 Livraison suivie</span>
              <span className="p-badge">💳 Paiement sécurisé</span>
              <span className="p-badge">🔄 Retours acceptés</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .product-page { padding: 32px 0 80px; }
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .breadcrumb a:hover { color: var(--primary); }
        .breadcrumb span { color: var(--border); }
        .breadcrumb span:last-child { color: var(--text); font-weight: 500; }

        .product-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }
        .product-img-wrap {
          position: relative;
          border-radius: var(--radius);
          overflow: hidden;
          background: var(--bg-gray);
          aspect-ratio: 1;
        }
        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .product-cat-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: white;
          border-radius: 20px;
          padding: 5px 14px;
          font-size: 12px;
          font-weight: 700;
          box-shadow: var(--shadow);
        }
        .product-info {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .product-name {
          font-size: 28px;
          font-weight: 800;
          line-height: 1.2;
        }
        .product-price {
          font-size: 32px;
          font-weight: 900;
          color: var(--primary);
        }
        .product-desc {
          font-size: 15px;
          color: var(--text-muted);
          line-height: 1.7;
        }
        .stock-warning { color: #e67e22; font-size: 13px; font-weight: 600; }
        .out-of-stock { color: var(--primary); font-size: 13px; font-weight: 700; }

        .qty-row { display: flex; flex-direction: column; gap: 8px; }
        .qty-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .qty-btn {
          background: var(--bg-gray);
          border: 1.5px solid var(--border);
          width: 36px;
          height: 36px;
          border-radius: 8px;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition);
        }
        .qty-btn:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); }
        .qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .qty-val { font-size: 18px; font-weight: 700; min-width: 32px; text-align: center; }

        .add-to-cart-btn {
          width: 100%;
          padding: 16px;
          font-size: 16px;
          border-radius: var(--radius-sm);
          transition: all 0.3s ease;
        }
        .add-to-cart-btn.added {
          background: #27ae60;
        }

        .source-link {
          color: var(--text-muted);
          font-size: 13px;
          text-decoration: underline;
        }
        .source-link:hover { color: var(--primary); }

        .product-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .p-badge {
          background: var(--bg-gray);
          border-radius: 20px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .product-layout { grid-template-columns: 1fr; gap: 24px; }
          .product-name { font-size: 22px; }
          .product-price { font-size: 26px; }
        }
      `}</style>
    </div>
  );
}
