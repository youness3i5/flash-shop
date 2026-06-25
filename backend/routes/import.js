const express = require('express');
const router = express.Router();
const https = require('https');
const http = require('http');
const { requireAdmin } = require('../middleware/auth');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      },
    };

    const req = lib.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function extractMeta(html, property) {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, 'i'),
    new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return m[1].trim();
  }
  return null;
}

function extractPrice(html) {
  const patterns = [
    /["']price["']\s*:\s*["']?([\d.,]+)["']?/i,
    /class=["'][^"']*price[^"']*["'][^>]*>([\d.,]+\s*€?)/i,
    /<meta[^>]+property=["']product:price:amount["'][^>]+content=["']([\d.,]+)["']/i,
    /itemprop=["']price["'][^>]+content=["']([\d.,]+)["']/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) {
      const val = parseFloat(m[1].replace(',', '.'));
      if (!isNaN(val) && val > 0) return val;
    }
  }
  return null;
}

router.post('/', requireAdmin, async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL requise' });

  let html;
  try {
    html = await fetchUrl(url);
  } catch (err) {
    return res.status(422).json({ error: 'Impossible de récupérer la page', detail: err.message });
  }

  const title = extractMeta(html, 'og:title') ||
    extractMeta(html, 'twitter:title') ||
    (html.match(/<title>([^<]+)<\/title>/i) || [])[1] || null;

  const image = extractMeta(html, 'og:image') ||
    extractMeta(html, 'twitter:image');

  const description = extractMeta(html, 'og:description') ||
    extractMeta(html, 'twitter:description');

  const price = extractPrice(html);

  if (!title && !image) {
    return res.status(422).json({ error: 'Impossible d\'extraire les données produit depuis cette URL' });
  }

  res.json({
    name: title ? title.substring(0, 100) : '',
    description: description ? description.substring(0, 500) : '',
    imageUrl: image || '',
    price: price || null,
    sourceUrl: url,
  });
});

module.exports = router;
