const BACKEND = 'https://kundalibaba-backend-production.up.railway.app/api/v1';
const BASE    = 'https://kundalibaba.com';
const today   = () => new Date().toISOString().slice(0, 10);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Fix /admin infinite 307 redirect loop
    if (url.pathname === '/admin' || url.pathname === '/admin/') {
      return env.ASSETS.fetch(new Request(new URL('/admin.html', url), request));
    }

    // ── Sitemaps ────────────────────────────────────────────────────────────────
    if (url.pathname === '/sitemap_index.xml')  return serveSitemapIndex(ctx);
    if (url.pathname === '/sitemap_static.xml') return serveStaticSitemap();
    if (url.pathname === '/sitemap_blog.xml')   return serveBlogSitemap(ctx);
    if (url.pathname === '/sitemap_pages.xml')  return servePagesSitemap(ctx);

    // Only inject SEO for HTML document requests (skip assets)
    const accept = request.headers.get('accept') || '';
    const isAsset = /\.(js|css|jsx|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|json|txt|xml|map)(\?.*)?$/.test(url.pathname);

    if (accept.includes('text/html') && !isAsset) {
      const pageKey = pathnameToPageKey(url.pathname);
      const seo = await fetchSeo(pageKey, ctx);

      if (seo && (seo.metaTitle || seo.metaDesc || seo.ogImage)) {
        const assetResp = await env.ASSETS.fetch(request);
        const html = await assetResp.text();
        const injected = injectSeoMeta(html, seo);
        const headers = new Headers(assetResp.headers);
        headers.set('content-type', 'text/html; charset=utf-8');
        headers.set('cache-control', 'public, max-age=60, stale-while-revalidate=300');
        return new Response(injected, { status: assetResp.status, headers });
      }
    }

    return env.ASSETS.fetch(request);
  },
};

// ── Sitemap helpers ─────────────────────────────────────────────────────────────

function xmlResponse(body) {
  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}

function urlEntry(loc, { lastmod, changefreq, priority } = {}) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    lastmod    ? `    <lastmod>${lastmod}</lastmod>` : '',
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : '',
    priority   ? `    <priority>${priority}</priority>` : '',
    '  </url>',
  ].filter(Boolean).join('\n');
}

// ── sitemap_index.xml ───────────────────────────────────────────────────────────

function serveSitemapIndex(ctx) {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <sitemap><loc>${BASE}/sitemap_static.xml</loc><lastmod>${today()}</lastmod></sitemap>`,
    `  <sitemap><loc>${BASE}/sitemap_blog.xml</loc><lastmod>${today()}</lastmod></sitemap>`,
    `  <sitemap><loc>${BASE}/sitemap_pages.xml</loc><lastmod>${today()}</lastmod></sitemap>`,
    '</sitemapindex>',
  ].join('\n');
  return xmlResponse(xml);
}

// ── sitemap_static.xml — all hardcoded pages ────────────────────────────────────

const RASHIS = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];
const CALC_SLUGS = [
  'love-calculator-by-name','flames-calculator','friendship-calculator','numerology-calculator',
  'lucky-vehicle-number-calculator','lo-shu-grid-calculator','sun-sign-calculator',
  'moon-phase-calculator','moon-sign-calculator','ascendant-calculator','nakshatra-calculator',
  'birth-chart-calculator','mangal-dosha-calculator','kaal-sarp-dosh-calculator',
  'sade-sati-calculator','dasha-calculator','atmakaraka-calculator','ishta-devata-calculator',
  'transit-chart-calculator','darakaraka-calculator',
];

function serveStaticSitemap() {
  const entries = [];

  // Main pages
  entries.push(urlEntry(`${BASE}/`,                          { lastmod: today(), changefreq: 'daily',   priority: '1.0' }));
  entries.push(urlEntry(`${BASE}/free-kundali-online`,       { lastmod: today(), changefreq: 'weekly',  priority: '0.9' }));
  entries.push(urlEntry(`${BASE}/kundali-matching-online`,   { lastmod: today(), changefreq: 'weekly',  priority: '0.9' }));
  entries.push(urlEntry(`${BASE}/horoscope`,                 { lastmod: today(), changefreq: 'daily',   priority: '0.9' }));
  entries.push(urlEntry(`${BASE}/articles`,                  { lastmod: today(), changefreq: 'daily',   priority: '0.8' }));
  entries.push(urlEntry(`${BASE}/astrology-calculators`,     { lastmod: today(), changefreq: 'weekly',  priority: '0.8' }));
  entries.push(urlEntry(`${BASE}/chat-with-astrologer`,      { lastmod: today(), changefreq: 'weekly',  priority: '0.8' }));
  entries.push(urlEntry(`${BASE}/shop`,                      { lastmod: today(), changefreq: 'weekly',  priority: '0.7' }));

  // Horoscope category pages
  entries.push(urlEntry(`${BASE}/horoscope/today`,   { lastmod: today(), changefreq: 'daily',   priority: '0.8' }));
  entries.push(urlEntry(`${BASE}/horoscope/weekly`,  { lastmod: today(), changefreq: 'weekly',  priority: '0.8' }));
  entries.push(urlEntry(`${BASE}/horoscope/monthly`, { lastmod: today(), changefreq: 'monthly', priority: '0.8' }));

  // Horoscope rashi pages — today / weekly / monthly
  for (const rashi of RASHIS) {
    entries.push(urlEntry(`${BASE}/horoscope/today/${rashi}`,   { lastmod: today(), changefreq: 'daily',   priority: '0.7' }));
    entries.push(urlEntry(`${BASE}/horoscope/weekly/${rashi}`,  { lastmod: today(), changefreq: 'weekly',  priority: '0.6' }));
    entries.push(urlEntry(`${BASE}/horoscope/monthly/${rashi}`, { lastmod: today(), changefreq: 'monthly', priority: '0.6' }));
  }

  // Calculator pages
  for (const slug of CALC_SLUGS) {
    entries.push(urlEntry(`${BASE}/${slug}`, { lastmod: today(), changefreq: 'monthly', priority: '0.7' }));
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
  ].join('\n');
  return xmlResponse(xml);
}

// ── sitemap_blog.xml — fetched dynamically ──────────────────────────────────────

async function serveBlogSitemap(ctx) {
  let items = [];
  try {
    const res = await fetch(`${BACKEND}/content/blogs?limit=1000`, {
      cf: { cacheTtl: 3600, cacheEverything: true },
    });
    if (res.ok) {
      const body = await res.json();
      items = body?.data?.items || body?.data || [];
    }
  } catch {}

  const entries = items
    .filter(b => b.slug)
    .map(b => urlEntry(`${BASE}/articles/${b.slug}`, {
      lastmod:    (b.publishedAt || b.updatedAt || today()).slice(0, 10),
      changefreq: 'weekly',
      priority:   '0.6',
    }));

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
  ].join('\n');
  return xmlResponse(xml);
}

// ── sitemap_pages.xml — fetched dynamically ─────────────────────────────────────

async function servePagesSitemap(ctx) {
  let items = [];
  try {
    const res = await fetch(`${BACKEND}/cms/custom-pages`, {
      cf: { cacheTtl: 3600, cacheEverything: true },
    });
    if (res.ok) {
      const body = await res.json();
      items = body?.data || [];
    }
  } catch {}

  const entries = items
    .filter(p => p.slug && p.isPublished)
    .map(p => urlEntry(`${BASE}/${p.slug}`, {
      lastmod:    (p.updatedAt || today()).slice(0, 10),
      changefreq: 'weekly',
      priority:   '0.6',
    }));

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
  ].join('\n');
  return xmlResponse(xml);
}

// ── SEO injection (unchanged) ───────────────────────────────────────────────────

const URL_TO_KEY = {
  'free-kundali-online':     'kundali',
  'kundali-matching-online': 'matching',
  'chat-with-astrologer':    'chat',
};

function pathnameToPageKey(pathname) {
  const p = pathname.replace(/^\//, '').replace(/\/$/, '');
  if (!p) return 'home';
  if (URL_TO_KEY[p]) return URL_TO_KEY[p];
  const horoMatch = p.match(/^horoscope\/(weekly|monthly)\/(.+)$/);
  if (horoMatch) return `horoscope/today/${horoMatch[2]}`;
  return p;
}

async function fetchSeo(pageKey, ctx) {
  const cacheKey = new Request(`https://kb-seo-cache.internal/${pageKey}`);
  const cache = caches.default;

  const cached = await cache.match(cacheKey);
  if (cached) {
    try { return await cached.json(); } catch {}
  }

  try {
    const res = await fetch(`${BACKEND}/cms/pages/${pageKey}`, {
      cf: { cacheTtl: 300, cacheEverything: true },
    });
    if (!res.ok) return null;
    const body = await res.json();
    const seo = body?.data;
    if (seo && ctx) {
      const toCache = new Response(JSON.stringify(seo), {
        headers: { 'cache-control': 'public, max-age=300', 'content-type': 'application/json' },
      });
      ctx.waitUntil(cache.put(cacheKey, toCache));
    }
    return seo;
  } catch {
    return null;
  }
}

function injectSeoMeta(html, seo) {
  const tags = [];
  if (seo.metaTitle) tags.push(`<title>${esc(seo.metaTitle)}</title>`);
  if (seo.metaDesc) tags.push(`<meta name="description" content="${esc(seo.metaDesc)}">`);
  const ogTitle = seo.ogTitle || seo.metaTitle;
  const ogDesc = seo.ogDesc || seo.metaDesc;
  if (ogTitle) tags.push(`<meta property="og:title" content="${esc(ogTitle)}">`);
  if (ogDesc) tags.push(`<meta property="og:description" content="${esc(ogDesc)}">`);
  if (seo.ogImage) tags.push(`<meta property="og:image" content="${esc(seo.ogImage)}">`);
  if (seo.canonical) tags.push(`<link rel="canonical" href="${esc(seo.canonical)}">`);
  tags.push(`<meta property="og:url" content="${esc(seo.canonical || '')}">`);
  tags.push(`<meta name="twitter:card" content="summary_large_image">`);
  if (ogTitle) tags.push(`<meta name="twitter:title" content="${esc(ogTitle)}">`);
  if (ogDesc) tags.push(`<meta name="twitter:description" content="${esc(ogDesc)}">`);
  if (seo.ogImage) tags.push(`<meta name="twitter:image" content="${esc(seo.ogImage)}">`);

  const block = `<!-- SEO:CMS -->\n${tags.join('\n')}\n<!-- /SEO:CMS -->`;

  let result = html;
  result = result.replace(/<!-- SEO:CMS -->[\s\S]*?<!-- \/SEO:CMS -->/g, '');
  if (seo.metaTitle) result = result.replace(/<title>[^<]*<\/title>/, '');
  result = result.replace('</head>', `${block}\n</head>`);
  return result;
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
