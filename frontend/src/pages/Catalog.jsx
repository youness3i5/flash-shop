import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { api } from '../api.js';

const CATEGORIES = [
  { name: 'Été', emoji: '☀️' },
  { name: 'Mode', emoji: '👕' },
  { name: 'Audio', emoji: '🎧' },
  { name: 'Maison', emoji: '🏠' },
];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const [search, setSearch] = useState(searchParam);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (categoryParam) params.category = categoryParam;
    if (searchParam) params.search = searchParam;
    api.getProducts(params)
      .then(setProducts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [categoryParam, searchParam]);

  function handleSearch(e) {
    e.preventDefault();
    const p = new URLSearchParams(searchParams);
    if (search) p.set('search', search);
    else p.delete('search');
    setSearchParams(p);
  }

  function handleCategory(cat) {
    const p = new URLSearchParams(searchParams);
    if (cat === categoryParam) p.delete('category');
    else p.set('category', cat);
    setSearchParams(p);
  }

  return (
    <div className="catalog-page">
      <div className="catalog-top">
        <div className="container">
          <h1 className="catalog-title">
            {categoryParam ? (
              <>{CATEGORIES.find(c => c.name === categoryParam)?.emoji} {categoryParam}</>
            ) : 'Tous les produits ✨'}
          </h1>
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-wrap">
              <svg className="si" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="search"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary">Rechercher</button>
          </form>
        </div>
      </div>

      <div className="container catalog-body">
        <div className="filters">
          <button
            className={`filter-btn${!categoryParam ? ' active' : ''}`}
            onClick={() => { const p = new URLSearchParams(searchParams); p.delete('category'); setSearchParams(p); }}
          >
            Tous
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.name}
              className={`filter-btn${categoryParam === cat.name ? ' active' : ''}`}
              onClick={() => handleCategory(cat.name)}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
          {!loading && (
            <span className="result-count">
              {products.length} produit{products.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {loading && <div className="spinner" />}
        {error && <p className="error-msg">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Aucun produit trouvé</h3>
            <p>Essaie une autre catégorie ou modifie ta recherche.</p>
          </div>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="products-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      <style>{`
        .catalog-top {
          background: var(--bg-gray);
          border-bottom: 1px solid var(--border);
          padding: 36px 0 28px;
        }
        .catalog-title {
          font-size: 30px;
          font-weight: 900;
          margin-bottom: 20px;
          letter-spacing: -0.5px;
        }
        .search-form { display: flex; gap: 10px; max-width: 560px; }
        .search-wrap { position: relative; flex: 1; }
        .si {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .search-input { padding-left: 42px; }

        .catalog-body { padding-top: 32px; padding-bottom: 80px; }

        .filters {
          display: flex;
          gap: 8px;
          margin-bottom: 32px;
          flex-wrap: wrap;
          align-items: center;
        }
        .filter-btn {
          background: var(--bg-gray);
          border: 1.5px solid var(--border);
          border-radius: 20px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition);
          color: var(--text-muted);
          font-family: 'Poppins', sans-serif;
        }
        .filter-btn:hover { border-color: var(--primary); color: var(--primary); }
        .filter-btn.active {
          background: var(--gradient);
          border-color: transparent;
          color: white;
          box-shadow: var(--shadow-primary);
        }
        .result-count {
          margin-left: auto;
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 600;
        }

        .empty-state {
          text-align: center;
          padding: 100px 0 60px;
          color: var(--text-muted);
        }
        .empty-icon { font-size: 56px; margin-bottom: 16px; }
        .empty-state h3 { font-size: 20px; font-weight: 800; color: var(--text); margin-bottom: 8px; }
        .empty-state p { font-size: 14px; }

        @media (max-width: 600px) {
          .search-form { flex-direction: column; }
          .result-count { display: none; }
        }
      `}</style>
    </div>
  );
}
