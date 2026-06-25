import React, { useState, useEffect } from 'react';
import { api } from '../api.js';

const CATEGORIES = ['Été', 'Audio', 'Mode', 'Maison'];
const EMPTY_FORM = {
  name: '', description: '', price: '', category: 'Été',
  imageUrl: '', sourceUrl: '', stock: '', featured: false,
};

function LoginGate({ onLogin }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    localStorage.setItem('admin-token', pw);
    try {
      await api.admin.getOrders();
      onLogin();
    } catch {
      localStorage.removeItem('admin-token');
      setError('Mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-gate">
      <div className="login-card">
        <div className="admin-logo">⚡ Admin</div>
        <h1>Flash Shop Admin</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              placeholder="Mot de passe admin"
              autoFocus
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
            {loading ? 'Vérification...' : 'Connexion'}
          </button>
        </form>
      </div>
    </div>
  );
}

function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [importing, setImporting] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importError, setImportError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleImport() {
    if (!importUrl) return;
    setImporting(true);
    setImportError(null);
    try {
      const data = await api.admin.importUrl(importUrl);
      setForm(f => ({
        ...f,
        name: data.name || f.name,
        description: data.description || f.description,
        imageUrl: data.imageUrl || f.imageUrl,
        price: data.price ? String(data.price) : f.price,
        sourceUrl: data.sourceUrl || f.sourceUrl,
      }));
    } catch (err) {
      setImportError(err.message);
    } finally {
      setImporting(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
      };
      await onSave(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{initial?.id ? 'Modifier le produit' : 'Nouveau produit'}</h2>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        <div className="import-section">
          <label>Importer depuis une URL (Hacoo / AliExpress)</label>
          <div className="import-row">
            <input
              type="url"
              placeholder="https://hacoo.com/..."
              value={importUrl}
              onChange={e => setImportUrl(e.target.value)}
            />
            <button className="btn btn-outline" onClick={handleImport} disabled={importing || !importUrl}>
              {importing ? '...' : 'Importer'}
            </button>
          </div>
          {importError && <p className="error-msg" style={{ marginTop: 6 }}>{importError}</p>}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nom *</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="Nom du produit" />
            </div>
            <div className="form-group">
              <label>Catégorie *</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Description du produit..." />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Prix (€) *</label>
              <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required placeholder="9.99" />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} placeholder="100" />
            </div>
          </div>
          <div className="form-group">
            <label>URL image</label>
            <input name="imageUrl" type="url" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label>URL source (Hacoo / AliExpress)</label>
            <input name="sourceUrl" type="url" value={form.sourceUrl} onChange={handleChange} placeholder="https://..." />
          </div>
          <label className="checkbox-label">
            <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} />
            Produit vedette (affiché en page d'accueil)
          </label>

          {error && <p className="error-msg" style={{ marginTop: 12 }}>{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onCancel}>Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem('admin-token'));
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (!authed) return;
    loadData();
  }, [authed, tab]);

  async function loadData() {
    setLoading(true);
    try {
      if (tab === 'products') {
        const data = await api.getProducts();
        setProducts(data);
      } else {
        const data = await api.admin.getOrders();
        setOrders(data);
      }
    } catch (err) {
      if (err.message.includes('autorisé')) {
        localStorage.removeItem('admin-token');
        setAuthed(false);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(data) {
    if (editProduct?.id) {
      await api.admin.updateProduct(editProduct.id, data);
    } else {
      await api.admin.createProduct(data);
    }
    setShowForm(false);
    setEditProduct(null);
    loadData();
  }

  async function handleDelete(id) {
    await api.admin.deleteProduct(id);
    setDeleteId(null);
    loadData();
  }

  function handleLogout() {
    localStorage.removeItem('admin-token');
    setAuthed(false);
  }

  if (!authed) return <LoginGate onLogin={() => setAuthed(true)} />;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container admin-header-inner">
          <div className="admin-brand">⚡ Flash Shop Admin</div>
          <div className="admin-tabs">
            <button className={`tab-btn ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
              Produits
            </button>
            <button className={`tab-btn ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
              Commandes
            </button>
          </div>
          <button className="btn btn-ghost logout-btn" onClick={handleLogout}>Déconnexion</button>
        </div>
      </div>

      <div className="container admin-content">
        {tab === 'products' && (
          <div>
            <div className="admin-toolbar">
              <h1 className="admin-title">Produits ({products.length})</h1>
              <button className="btn btn-primary" onClick={() => { setEditProduct(null); setShowForm(true); }}>
                + Nouveau produit
              </button>
            </div>

            {loading ? <div className="spinner" /> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Nom</th>
                      <th>Catégorie</th>
                      <th>Prix</th>
                      <th>Stock</th>
                      <th>Vedette</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="table-img"
                            onError={e => { e.target.src = 'https://placehold.co/50x50/f0f0f0/999?text=?'; }}
                          />
                        </td>
                        <td className="td-name">{p.name}</td>
                        <td><span className="cat-pill">{p.category}</span></td>
                        <td className="td-price">{p.price.toFixed(2)} €</td>
                        <td className={p.stock <= 5 ? 'td-low-stock' : ''}>{p.stock}</td>
                        <td>{p.featured ? '⭐' : '—'}</td>
                        <td>
                          <div className="table-actions">
                            <button className="btn-action edit" onClick={() => { setEditProduct(p); setShowForm(true); }}>
                              Modifier
                            </button>
                            <button className="btn-action delete" onClick={() => setDeleteId(p.id)}>
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'orders' && (
          <div>
            <h1 className="admin-title">Commandes ({orders.length})</h1>
            {loading ? <div className="spinner" /> : orders.length === 0 ? (
              <p className="empty-orders">Aucune commande pour l'instant.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Réf</th>
                      <th>Date</th>
                      <th>Client</th>
                      <th>Articles</th>
                      <th>Total</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td className="td-ref">#{o.id.toUpperCase().slice(0, 8)}</td>
                        <td>{new Date(o.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td className="td-customer">
                          <span>{o.customer?.name || '—'}</span>
                          <small>{o.customer?.email || ''}</small>
                        </td>
                        <td>{o.items?.length || 0} article(s)</td>
                        <td className="td-price">{o.total?.toFixed(2)} €</td>
                        <td>
                          <span className={`status-badge status-${o.status}`}>
                            {o.status === 'paid' ? '✅ Payé' : o.status === 'pending' ? '⏳ En attente' : o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <ProductForm
          initial={editProduct}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditProduct(null); }}
        />
      )}

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <h2>Supprimer ce produit ?</h2>
            <p>Cette action est irréversible.</p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Annuler</button>
              <button className="btn btn-primary" style={{ background: '#e74c3c' }} onClick={() => handleDelete(deleteId)}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .login-gate {
          min-height: calc(100vh - 60px);
          display: flex; align-items: center; justify-content: center;
          background: var(--bg-gray);
          padding: 40px 16px;
        }
        .login-card {
          background: white;
          border-radius: var(--radius);
          padding: 40px;
          width: 100%;
          max-width: 380px;
          box-shadow: var(--shadow);
          text-align: center;
        }
        .admin-logo { font-size: 28px; font-weight: 900; margin-bottom: 8px; color: var(--primary); }
        .login-card h1 { font-size: 20px; font-weight: 700; margin-bottom: 24px; }

        .admin-page { min-height: calc(100vh - 60px); background: var(--bg-gray); }
        .admin-header {
          background: white;
          border-bottom: 1px solid var(--border);
          position: sticky; top: 60px; z-index: 50;
        }
        .admin-header-inner {
          display: flex; align-items: center; gap: 24px; height: 52px;
        }
        .admin-brand { font-weight: 800; font-size: 16px; color: var(--primary); flex-shrink: 0; }
        .admin-tabs { display: flex; gap: 4px; flex: 1; }
        .tab-btn {
          background: none; border: none; cursor: pointer;
          padding: 6px 16px; border-radius: 6px; font-size: 14px; font-weight: 600;
          color: var(--text-muted); transition: all var(--transition);
        }
        .tab-btn.active, .tab-btn:hover { background: var(--primary-light); color: var(--primary); }
        .logout-btn { font-size: 13px; color: var(--text-muted); }

        .admin-content { padding: 32px 0 80px; }
        .admin-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .admin-title { font-size: 22px; font-weight: 800; }

        .admin-table-wrap {
          background: white; border-radius: var(--radius);
          border: 1px solid var(--border); overflow: auto;
        }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th {
          text-align: left; padding: 12px 16px;
          font-size: 12px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.5px; color: var(--text-muted);
          border-bottom: 1px solid var(--border);
          background: var(--bg-gray);
        }
        .admin-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); font-size: 14px; }
        .admin-table tr:last-child td { border-bottom: none; }
        .admin-table tr:hover td { background: var(--bg-gray); }
        .table-img { width: 48px; height: 48px; object-fit: cover; border-radius: 6px; background: var(--bg-gray); }
        .td-name { font-weight: 600; max-width: 240px; }
        .td-price { font-weight: 700; color: var(--primary); }
        .td-low-stock { color: #e74c3c; font-weight: 700; }
        .td-ref { font-family: monospace; font-size: 12px; color: var(--text-muted); }
        .td-customer { display: flex; flex-direction: column; gap: 2px; }
        .td-customer small { color: var(--text-muted); font-size: 12px; }
        .cat-pill {
          background: var(--primary-light); color: var(--primary);
          border-radius: 20px; padding: 2px 10px; font-size: 12px; font-weight: 600;
        }
        .table-actions { display: flex; gap: 8px; }
        .btn-action {
          background: none; border: 1.5px solid var(--border); cursor: pointer;
          padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;
          transition: all var(--transition);
        }
        .btn-action.edit:hover { border-color: var(--primary); color: var(--primary); }
        .btn-action.delete:hover { border-color: #e74c3c; color: #e74c3c; }

        .status-badge {
          display: inline-block; padding: 3px 10px;
          border-radius: 20px; font-size: 12px; font-weight: 600;
        }
        .status-paid { background: #eafaf1; color: #27ae60; }
        .status-pending { background: #fef9e7; color: #e67e22; }

        .empty-orders { padding: 40px; text-align: center; color: var(--text-muted); }

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          z-index: 300; display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .modal {
          background: white; border-radius: var(--radius);
          padding: 32px; width: 100%; max-width: 560px;
          max-height: 90vh; overflow-y: auto;
          box-shadow: var(--shadow-hover);
          animation: slideUp 0.25s ease;
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .confirm-modal { max-width: 380px; text-align: center; gap: 12px; display: flex; flex-direction: column; }
        .confirm-modal p { color: var(--text-muted); }
        .modal-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border);
        }
        .modal-header h2 { font-size: 18px; font-weight: 700; }
        .close-btn {
          background: none; border: none; cursor: pointer;
          font-size: 18px; color: var(--text-muted);
          width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
          border-radius: 6px; transition: background var(--transition);
        }
        .close-btn:hover { background: var(--bg-gray); }

        .import-section {
          background: var(--bg-gray); border-radius: var(--radius-sm);
          padding: 16px; margin-bottom: 20px;
        }
        .import-section label { font-size: 12px; margin-bottom: 8px; }
        .import-row { display: flex; gap: 8px; }
        .import-row input { flex: 1; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        textarea { resize: vertical; min-height: 80px; }
        .checkbox-label {
          display: flex; align-items: center; gap: 8px;
          font-size: 14px; font-weight: 500; cursor: pointer;
          margin-top: 4px; margin-bottom: 8px;
        }
        .checkbox-label input { width: auto; }
        .modal-actions {
          display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;
        }
      `}</style>
    </div>
  );
}
