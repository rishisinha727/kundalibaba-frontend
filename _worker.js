const BACKEND = 'https://kundalibaba-backend-production.up.railway.app/api/v1';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Fix /admin infinite 307 redirect loop
    if (url.pathname === '/admin' || url.pathname === '/admin/') {
      return env.ASSETS.fetch(new Request(new URL('/admin.html', url), request));
    }

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

// Pretty URL → internal page key mapping (mirrors PAGE_TO_URL in index.html)
const URL_TO_KEY = {
  'free-kundali-online':     'kundali',
  'kundali-matching-online': 'matching',
  'chat-with-astrologer':    'chat',
};

function pathnameToPageKey(pathname) {
  const p = pathname.replace(/^\//, '').replace(/\/$/, '');
  if (!p) return 'home';
  // Translate pretty URLs to internal keys
  if (URL_TO_KEY[p]) return URL_TO_KEY[p];
  // Horoscope weekly/monthly sign pages fall back to today's sign key for SEO
  // e.g. horoscope/weekly/aries → horoscope/today/aries
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
  // Remove stale CMS block
  result = result.replace(/<!-- SEO:CMS -->[\s\S]*?<!-- \/SEO:CMS -->/g, '');
  // Remove old <title> if we have a new one
  if (seo.metaTitle) result = result.replace(/<title>[^<]*<\/title>/, '');
  // Inject before </head>
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
