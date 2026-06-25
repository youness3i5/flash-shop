import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  function handleAdd(e) {
    e.preventDefault();
    addItem(product, 1);
  }

  return (
    <article className="product-card">
      <Link to={`/produit/${product.id}`} className="card-img-link">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="card-img"
          loading="lazy"
          onError={e => { e.target.src = 'https://placehold.co/400x400/f0f0f0/999?text=Image'; }}
        />
        <span className="card-category">{product.category}</span>
      </Link>
      <div className="card-body">
        <Link to={`/produit/${product.id}`} className="card-name">{product.name}</Link>
        <div className="card-footer">
          <span className="card-price">{product.price.toFixed(2)} €</span>
          <button className="add-btn" onClick={handleAdd} aria-label="Ajouter au panier">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        .product-card {
          background: white;
          border-radius: var(--radius);
          overflow: hidden;
          border: 1px solid var(--border);
          transition: transform var(--transition), box-shadow var(--transition);
          display: flex;
          flex-direction: column;
        }
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
        }
        .card-img-link {
          position: relative;
          display: block;
          overflow: hidden;
          aspect-ratio: 1;
          background: var(--bg-gray);
        }
        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .product-card:hover .card-img {
          transform: scale(1.05);
        }
        .card-category {
          position: absolute;
          top: 10px;
          left: 10px;
          background: white;
          border-radius: 20px;
          padding: 3px 10px;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }
        .card-body {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }
        .card-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4;
        }
        .card-name:hover { color: var(--primary); }
        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }
        .card-price {
          font-size: 17px;
          font-weight: 800;
          color: var(--primary);
        }
        .add-btn {
          background: var(--primary);
          color: white;
          border: none;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition);
          flex-shrink: 0;
        }
        .add-btn:hover {
          background: var(--primary-dark);
          transform: scale(1.1);
        }
      `}</style>
    </article>
  );
}
