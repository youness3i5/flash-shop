import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { SkeletonProductGrid } from '../components/Skeleton.jsx';
import { api } from '../api.js';

const CATEGORIES = [
  { name: 'Été', emoji: '☀️' },
  { name: 'Mode', emoji: '👕' },
  { name: 'Audio', emoji: '🎧' },
  { name: 'Maison', emoji: '🏠' },
];

const SORTS = [
  { label: 'Par défaut', value: '' },
  { label: 'Prix croissant', value: 'price_asc' },
  { label: 'Prix décroissant', value: 'price_desc' },
];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('');

  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const [search, setSearch] = useState(searchParam);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (categoryParam) params.category = categoryParam;
    if (searchParam) params.search = searchParam;
    api.getProducts(params)
      .then(data => {
        let sorted = [...data];
        if (sort === 'price_asc') sorted.sort((a, b) => a.price - b.price);
        if (sort === 'price_desc') sorted.sort((a, b) => b.price - a.price);
        setProducts(sorted);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [categoryParam, searchParam, sort]);

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

  const activeCat = CATEGORIES.find(c => c.name === categoryParam);

  return (
    <div className="catalog-page">
      <div className="catalog-hero">
        <div className="container">
          <div className="cat-hero-text">
            <h1 className="catalog-title anim-fade-up">
              {activeCat ? `${activeCat.emoji} ${categoryParam}` : '✨ Tous les produits'}
            </h1>
            <p className="catalog-sub anim-fade-up anim-d1">
              {loading ? '…' : `${products.length} produit${products.length > 1 ? 's' : ''} tendance`}
            </p>
          </div>

          <form className="search-form anim-fade-up anim-d2" onSubmit={handleSearch}>
            <div className="search-wrap">
              <svg className="si" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="search"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="search-input cat-search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary">Rechercher</button>
          </form>
        </div>
      </div>

      <div className="container catalog-body">
        <div className="catalog-controls">
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
          </div>

          <div className="sort-wrap">
            <select
              className="sort-select"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {loading && <SkeletonProductGrid count={8} />}
        {error && <p className="error-msg">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <div className="empty-state anim-scale-in">
            <div className="empty-icon">🔍</div>
            <h3>Aucun produit trouvé</h3>
            <p>Essaie une autre catégorie ou modifie ta recherche.</p>
          </div>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="products-grid anim-fade-in">
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>

      <style>{`
        .catalog-page { padding-bottom: 80px; }
        .catalog-hero {
          background: linear-gradient(160deg, #0d0d0d 0%, #1a1a2e 100%);
          padding: 48px 0 40px;
          position: relative; overflow: hidden;
        }
        .catalog-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 700px 400px at 70% 50%, rgba(255,59,92,0.08), transparent);
          pointer-events: none;
        }
        .catalog-hero .container { position: relative; z-index: 1; }
        .cat-hero-text { margin-bottom: 24px; }
        .catalog-title {
          font-size: clamp(26px, 4vw, 40px);
          font-weight: 900;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
          color: white;
        }
        .catalog-sub {
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          font-weight: 500;
        }
        .search-form { display: flex; gap: 10px; max-width: 560px; }
        .search-wrap { position: relative; flex: 1; }
        .si {
          position: absolute;
          left: 14px; top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .cat-search-input { background: rgba(255,255,255,0.95); }
        .search-input { padding-left: 42px; }

        .catalog-body { padding-top: 32px; }

        .catalog-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .filters { display: flex; gap: 8px; flex-wrap: wrap; }
        .filter-btn {
          background: white;
          border: 1.5px solid var(--border);
          border-radius: 20px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
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
        .sort-select {
          width: auto;
          padding: 9px 36px 9px 14px;
          font-size: 13px;
          font-weight: 600;
          border-radius: 20px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          appearance: none;
          cursor: pointer;
        }

        .empty-state {
          text-align: center;
          padding: 100px 0 60px;
          color: var(--text-muted);
        }
        .empty-icon { font-size: 60px; margin-bottom: 20px; }
        .empty-state h3 { font-size: 22px; font-weight: 800; color: var(--text); margin-bottom: 8px; }
        .empty-state p { font-size: 14px; }

        @media (max-width: 640px) {
          .search-form { flex-direction: column; }
          .catalog-controls { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
