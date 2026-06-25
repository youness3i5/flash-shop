import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { api } from '../api.js';

const CATEGORIES = ['Été', 'Audio', 'Mode', 'Maison'];

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
      <div className="container">
        <div className="catalog-header">
          <h1 className="catalog-title">
            {categoryParam ? `${categoryParam}` : 'Tous les produits'}
            {!loading && <span className="count"> ({products.length})</span>}
          </h1>
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-wrap">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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

        <div className="filters">
          <button
            className={`filter-btn ${!categoryParam ? 'active' : ''}`}
            onClick={() => { const p = new URLSearchParams(searchParams); p.delete('category'); setSearchParams(p); }}
          >
            Tous
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${categoryParam === cat ? 'active' : ''}`}
              onClick={() => handleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && <div className="spinner" />}
        {error && <p className="error-msg">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <div className="empty-state">
            <p>Aucun produit trouvé.</p>
          </div>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="products-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      <style>{`
        .catalog-page { padding: 40px 0 80px; }
        .catalog-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .catalog-title {
          font-size: 28px;
          font-weight: 800;
        }
        .count {
          font-size: 18px;
          color: var(--text-muted);
          font-weight: 400;
        }
        .search-form {
          display: flex;
          gap: 8px;
          flex: 0 0 auto;
        }
        .search-wrap {
          position: relative;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .search-input {
          padding-left: 36px;
          width: 240px;
        }
        .filters {
          display: flex;
          gap: 8px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .filter-btn {
          background: var(--bg-gray);
          border: 1.5px solid var(--border);
          border-radius: 20px;
          padding: 7px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition);
          color: var(--text-muted);
        }
        .filter-btn:hover, .filter-btn.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }
        .empty-state {
          text-align: center;
          padding: 80px 0;
          color: var(--text-muted);
          font-size: 16px;
        }
        @media (max-width: 600px) {
          .catalog-header { flex-direction: column; }
          .search-form { width: 100%; }
          .search-input { width: 100%; }
        }
      `}</style>
    </div>
  );
}
