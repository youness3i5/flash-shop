const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`);
  return data;
}

export const api = {
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/products${qs ? '?' + qs : ''}`);
  },
  getProduct: (id) => request(`/products/${id}`),
  getConfig: () => request('/config'),

  checkout: (items, customer) => request('/checkout', { method: 'POST', body: { items, customer } }),

  admin: {
    headers: () => {
      const pw = localStorage.getItem('admin-token') || '';
      return { Authorization: `Bearer ${pw}` };
    },
    getOrders: () => request('/orders', { headers: api.admin.headers() }),
    createProduct: (data) => request('/admin/products', { method: 'POST', body: data, headers: api.admin.headers() }),
    updateProduct: (id, data) => request(`/admin/products/${id}`, { method: 'PUT', body: data, headers: api.admin.headers() }),
    deleteProduct: (id) => request(`/admin/products/${id}`, { method: 'DELETE', headers: api.admin.headers() }),
    importUrl: (url) => request('/admin/import-url', { method: 'POST', body: { url }, headers: api.admin.headers() }),
  },
};
