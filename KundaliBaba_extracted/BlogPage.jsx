// ============================================================
// KundaliBaba — Blog / Articles System
// ArticlesSlider (global), Articles Hub (/articles), Article Detail (/articles/:slug)
// ============================================================

const BLOG_API = 'https://kundalibaba-backend-production.up.railway.app/api/v1';
const SITE_URL = 'https://kundalibaba.com';

const BLOG_CATEGORIES = [
  { id:'vedic-astrology',   label:'Vedic Astrology',    icon:'🔮' },
  { id:'horoscope',         label:'Horoscope',          icon:'♈' },
  { id:'numerology',        label:'Numerology',         icon:'🔢' },
  { id:'kundali',           label:'Kundali',            icon:'🗺️' },
  { id:'planets-transits',  label:'Planets & Transits', icon:'🪐' },
  { id:'remedies-rituals',  label:'Remedies & Rituals', icon:'🙏' },
  { id:'astro-calculators', label:'Astro Calculators',  icon:'🧮' },
  { id:'love-marriage',     label:'Love & Marriage',    icon:'💍' },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
}
function readTime(content) {
  if (!content) return 5;
  return Math.max(1, Math.round(content.replace(/<[^>]+>/g,'').split(' ').length / 200));
}
function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, '').slice(0, 160);
}

// ── Article JSON-LD Schema ─────────────────────────────────────────────────────
function injectArticleSchema(article) {
  const existing = document.getElementById('article-schema');
  if (existing) existing.remove();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || stripHtml(article.content),
    image: article.coverImage || `${SITE_URL}/KundaliBaba_extracted/assets/og-default.jpg`,
    author: { '@type': 'Person', name: article.authorName || 'KundaliBaba' },
    publisher: {
      '@type': 'Organization',
      name: 'KundaliBaba',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/KundaliBaba_extracted/assets/logo.png` },
    },
    datePublished: article.publishedAt || article.createdAt,
    dateModified:  article.updatedAt   || article.publishedAt || article.createdAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/articles/${article.slug}` },
    keywords: (article.tags || []).join(', '),
    articleSection: article.category || 'Astrology',
  };
  const el = document.createElement('script');
  el.id = 'article-schema';
  el.type = 'application/ld+json';
  el.textContent = JSON.stringify(schema);
  document.head.appendChild(el);
}

function removeArticleSchema() {
  const el = document.getElementById('article-schema');
  if (el) el.remove();
}

// ── Article Card ───────────────────────────────────────────────────────────────
function ArticleCard({ article, onNavigate, compact }) {
  const [hover, setHover] = React.useState(false);
  const slug = `articles/${article.slug}`;
  const catMeta = BLOG_CATEGORIES.find(c => c.id === article.category);

  if (compact) {
    return (
      <div onClick={() => onNavigate(slug)}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ cursor:'pointer', display:'flex', gap:12, padding:'12px 0', borderBottom:'1px solid #EDD9B8' }}>
        {article.coverImage && (
          <img src={article.coverImage} alt={article.title}
            style={{ width:72, height:56, objectFit:'cover', borderRadius:8, flexShrink:0 }} />
        )}
        <div>
          <div style={{ fontSize:11, color:'#E8890C', fontWeight:700, marginBottom:4, textTransform:'uppercase', letterSpacing:'0.06em' }}>{catMeta?.label || article.category}</div>
          <div style={{ fontSize:13, fontWeight:700, color: hover?'#E8890C':'#0D1B3E', lineHeight:1.35, transition:'color 150ms' }}>{article.title}</div>
          <div style={{ fontSize:11, color:'#A07850', marginTop:4 }}>{fmtDate(article.publishedAt)} · {article.readTime || readTime(article.content)} min read</div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={() => onNavigate(slug)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background:'white', borderRadius:16, overflow:'hidden', border:'1px solid', borderColor:hover?'#E8890C':'#EDD9B8', cursor:'pointer', transition:'all 180ms', transform:hover?'translateY(-4px)':'none', boxShadow:hover?'0 12px 32px rgba(13,27,62,0.12)':'0 2px 8px rgba(13,27,62,0.05)', display:'flex', flexDirection:'column' }}>
      {article.coverImage
        ? <img src={article.coverImage} alt={article.title} style={{ width:'100%', height:180, objectFit:'cover' }} />
        : <div style={{ width:'100%', height:180, background:'linear-gradient(135deg,#0D1B3E,#E8890C22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:48 }}>{catMeta?.icon || '🔮'}</div>
      }
      <div style={{ padding:'16px 18px 20px', flex:1, display:'flex', flexDirection:'column' }}>
        {article.category && (
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#E8890C', marginBottom:8 }}>
            {catMeta?.icon} {catMeta?.label || article.category}
          </div>
        )}
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:'#0D1B3E', lineHeight:1.35, marginBottom:8, flex:1 }}>{article.title}</div>
        {article.excerpt && <div style={{ fontSize:13, color:'#6B4C2A', lineHeight:1.65, marginBottom:12 }}>{article.excerpt.slice(0,100)}{article.excerpt.length>100?'…':''}</div>}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'auto' }}>
          <div style={{ fontSize:11, color:'#A07850' }}>{fmtDate(article.publishedAt)} · {article.readTime || readTime(article.content)} min read</div>
          <div style={{ fontSize:12, color:'#E8890C', fontWeight:700 }}>Read →</div>
        </div>
      </div>
    </div>
  );
}

// ── Articles Slider (global, context-aware) ────────────────────────────────────
function ArticlesSlider({ context = {}, onNavigate }) {
  const [articles, setArticles] = React.useState([]);
  const [loading, setLoading]   = React.useState(true);
  const scrollRef = React.useRef(null);
  const isMobile  = useMobile();

  React.useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: 10 });
    if (context.category)    params.set('category',    context.category);
    if (context.subCategory) params.set('subCategory', context.subCategory);
    if (context.tag)         params.set('tag',         context.tag);
    if (context.excludeSlug) params.set('excludeSlug', context.excludeSlug);

    fetch(`${BLOG_API}/content/blogs?${params}`)
      .then(r => r.json())
      .then(r => { setArticles(r.data?.items || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [context.category, context.subCategory, context.tag, context.excludeSlug]);

  if (!loading && articles.length === 0) return null;

  const scroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 300, behavior:'smooth' });
  };

  const label = context.category
    ? (BLOG_CATEGORIES.find(c=>c.id===context.category)?.label || 'Related') + ' Articles'
    : context.tag ? `Articles on "${context.tag}"` : 'Latest Articles';

  return (
    <section style={{ background:'#0D1B3E', padding: isMobile?'36px 0 32px':'48px 0 44px', borderTop:'1px solid rgba(245,200,66,0.1)' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 16px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: isMobile?16:24 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'#F5C842', marginBottom:6 }}>✦ From Our Blog</div>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile?18:24, fontWeight:700, color:'white', margin:0, lineHeight:1.2 }}>{label}</h3>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <button onClick={() => scroll(-1)} style={{ width:36, height:36, borderRadius:'50%', border:'1px solid rgba(245,200,66,0.3)', background:'none', color:'#F5C842', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
            <button onClick={() => scroll(1)}  style={{ width:36, height:36, borderRadius:'50%', border:'1px solid rgba(245,200,66,0.3)', background:'none', color:'#F5C842', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>›</button>
            <button onClick={() => onNavigate('articles')} style={{ padding:'8px 18px', background:'rgba(245,200,66,0.1)', border:'1px solid rgba(245,200,66,0.3)', borderRadius:20, color:'#F5C842', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>View All</button>
          </div>
        </div>

        {loading ? (
          <div style={{ display:'flex', gap:16 }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ minWidth:240, height:280, borderRadius:14, background:'rgba(255,255,255,0.05)', flexShrink:0 }} />
            ))}
          </div>
        ) : (
          <div ref={scrollRef} style={{ display:'flex', gap:16, overflowX:'auto', scrollbarWidth:'none', msOverflowStyle:'none', paddingBottom:4 }}>
            {articles.map(a => (
              <div key={a._id || a.slug} style={{ minWidth: isMobile?240:280, maxWidth: isMobile?240:280, flexShrink:0 }}>
                <ArticleCard article={a} onNavigate={onNavigate} />
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`.articles-scroll::-webkit-scrollbar{display:none}`}</style>
    </section>
  );
}

// ── Articles Hub — /articles ───────────────────────────────────────────────────
function ArticlesHub({ onNavigate }) {
  const isMobile = useMobile();
  const [articles, setArticles]   = React.useState([]);
  const [total, setTotal]         = React.useState(0);
  const [page, setPage]           = React.useState(1);
  const [loading, setLoading]     = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState('');

  React.useEffect(() => {
    setLoading(true); setPage(1);
    const params = new URLSearchParams({ limit:12 });
    if (activeCategory) params.set('category', activeCategory);
    fetch(`${BLOG_API}/content/blogs?${params}`)
      .then(r => r.json())
      .then(r => { setArticles(r.data?.items||[]); setTotal(r.data?.total||0); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeCategory]);

  const loadMore = () => {
    const nextPage = page + 1;
    const params = new URLSearchParams({ limit:12, page:nextPage });
    if (activeCategory) params.set('category', activeCategory);
    fetch(`${BLOG_API}/content/blogs?${params}`)
      .then(r => r.json())
      .then(r => { setArticles(prev => [...prev, ...(r.data?.items||[])]); setPage(nextPage); })
      .catch(() => {});
  };

  return (
    <div style={{ background:'#FFF9F0', minHeight:'100vh' }}>
      {/* Hero */}
      <section style={{ background:'linear-gradient(135deg,#060D20 0%,#0D1B3E 60%,#1A0A4E 100%)', padding: isMobile?'48px 16px 40px':'72px 24px 56px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(245,200,66,0.05) 1px,transparent 1px)', backgroundSize:'30px 30px', pointerEvents:'none' }} />
        <div style={{ maxWidth:760, margin:'0 auto', textAlign:'center', position:'relative' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'#F5C842', marginBottom:14 }}>✦ Vedic Wisdom · Expert Insights</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile?28:52, fontWeight:800, color:'white', lineHeight:1.15, margin:'0 0 14px' }}>Astrology Articles</h1>
          <p style={{ fontSize: isMobile?14:17, color:'rgba(253,246,236,0.7)', lineHeight:1.75, maxWidth:520, margin:'0 auto' }}>
            Deep dives into Vedic astrology, horoscopes, numerology, remedies, and the ancient science of self-knowledge.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <div style={{ background:'white', borderBottom:'1px solid #EDD9B8', overflowX:'auto', padding:'0 16px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', gap:0 }}>
          <button onClick={() => setActiveCategory('')}
            style={{ padding: isMobile?'12px 14px':'14px 20px', background:'none', border:'none', borderBottom:`2.5px solid ${!activeCategory?'#E8890C':'transparent'}`, color:!activeCategory?'#E8890C':'#6B4C2A', fontWeight:!activeCategory?700:500, fontSize: isMobile?12:13, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit' }}>
            All Articles
          </button>
          {BLOG_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              style={{ padding: isMobile?'12px 14px':'14px 20px', background:'none', border:'none', borderBottom:`2.5px solid ${activeCategory===cat.id?'#E8890C':'transparent'}`, color:activeCategory===cat.id?'#E8890C':'#6B4C2A', fontWeight:activeCategory===cat.id?700:500, fontSize: isMobile?12:13, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit' }}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile?'24px 16px 48px':'40px 24px 72px' }}>
        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'repeat(3,1fr)', gap:20 }}>
            {[1,2,3,4,5,6].map(i => <div key={i} style={{ height:340, borderRadius:16, background:'#EDD9B8', animation:'pulse 1.5s infinite' }} />)}
          </div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0', color:'#A07850' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📝</div>
            <div style={{ fontSize:18, fontWeight:700, color:'#0D1B3E', marginBottom:8 }}>No articles yet</div>
            <div style={{ fontSize:14 }}>Check back soon — our pandits are writing.</div>
          </div>
        ) : (
          <>
            {/* Featured first article */}
            {articles[0] && !activeCategory && (
              <div onClick={() => onNavigate(`articles/${articles[0].slug}`)}
                style={{ background:'white', borderRadius:20, overflow:'hidden', border:'1px solid #EDD9B8', cursor:'pointer', display: isMobile?'block':'grid', gridTemplateColumns:'1fr 1fr', marginBottom:24, boxShadow:'0 4px 16px rgba(13,27,62,0.07)' }}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 12px 40px rgba(13,27,62,0.14)';}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow='0 4px 16px rgba(13,27,62,0.07)';}}>
                {articles[0].coverImage
                  ? <img src={articles[0].coverImage} alt={articles[0].title} style={{ width:'100%', height: isMobile?200:320, objectFit:'cover' }} />
                  : <div style={{ width:'100%', height: isMobile?200:320, background:'linear-gradient(135deg,#060D20,#E8890C33)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:72 }}>🔮</div>
                }
                <div style={{ padding: isMobile?'24px 20px':'36px 40px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#E8890C', marginBottom:12 }}>✦ Featured Article</div>
                  <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile?22:30, fontWeight:800, color:'#0D1B3E', margin:'0 0 12px', lineHeight:1.25 }}>{articles[0].title}</h2>
                  <p style={{ fontSize:14, color:'#6B4C2A', lineHeight:1.75, marginBottom:20 }}>{articles[0].excerpt || stripHtml(articles[0].content).slice(0,160)}…</p>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ fontSize:12, color:'#A07850' }}>{fmtDate(articles[0].publishedAt)} · {articles[0].readTime||5} min read</div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#E8890C' }}>Read Article →</div>
                  </div>
                </div>
              </div>
            )}
            <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'repeat(3,1fr)', gap: isMobile?14:20 }}>
              {(activeCategory ? articles : articles.slice(1)).map(a => (
                <ArticleCard key={a._id||a.slug} article={a} onNavigate={onNavigate} />
              ))}
            </div>
            {articles.length < total && (
              <div style={{ textAlign:'center', marginTop:36 }}>
                <button onClick={loadMore} style={{ padding:'12px 36px', border:'2px solid #E8890C', background:'none', color:'#E8890C', borderRadius:12, fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'inherit' }}>Load More Articles</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Article Detail — /articles/:slug ──────────────────────────────────────────
function ArticleDetail({ slug, onNavigate }) {
  const isMobile = useMobile();
  const [article, setArticle] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError]     = React.useState(false);

  React.useEffect(() => {
    setLoading(true); setError(false); setArticle(null);
    fetch(`${BLOG_API}/content/blogs/${slug}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(r => {
        const a = r.data;
        setArticle(a);
        injectArticleSchema(a);
        // Set page title + meta
        if (a.title)  document.title = `${a.title} — KundaliBaba`;
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
    return () => removeArticleSchema();
  }, [slug]);

  if (loading) return (
    <div style={{ minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#A07850', fontSize:14 }}>
      Loading article...
    </div>
  );
  if (error || !article) return (
    <div style={{ minHeight:'60vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
      <div style={{ fontSize:48 }}>📄</div>
      <div style={{ fontSize:20, fontWeight:700, color:'#0D1B3E' }}>Article Not Found</div>
      <button onClick={() => onNavigate('articles')} style={{ padding:'10px 24px', background:'#E8890C', color:'white', border:'none', borderRadius:8, cursor:'pointer', fontWeight:600 }}>Browse Articles</button>
    </div>
  );

  const catMeta = BLOG_CATEGORIES.find(c => c.id === article.category);
  const rt = article.readTime || readTime(article.content);

  return (
    <div style={{ background:'#FFF9F0', minHeight:'100vh' }}>
      {/* Article hero */}
      <div style={{ background:'linear-gradient(180deg,#060D20 0%,#0D1B3E 100%)', padding: isMobile?'40px 16px 32px':'64px 24px 48px' }}>
        <div style={{ maxWidth:760, margin:'0 auto' }}>
          <button onClick={() => onNavigate('articles')} style={{ background:'none', border:'none', color:'rgba(245,200,66,0.7)', cursor:'pointer', fontSize:13, fontWeight:600, padding:0, marginBottom:20, display:'flex', alignItems:'center', gap:6 }}>
            ← All Articles
          </button>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
            {catMeta && (
              <span style={{ padding:'4px 12px', background:'rgba(232,137,12,0.15)', border:'1px solid rgba(232,137,12,0.3)', borderRadius:20, fontSize:12, fontWeight:700, color:'#F5C842' }}>
                {catMeta.icon} {catMeta.label}
              </span>
            )}
            {article.subCategory && (
              <span style={{ padding:'4px 12px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:20, fontSize:12, color:'rgba(253,246,236,0.6)' }}>
                {article.subCategory}
              </span>
            )}
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile?26:44, fontWeight:800, color:'white', lineHeight:1.2, margin:'0 0 16px' }}>{article.title}</h1>
          {article.excerpt && <p style={{ fontSize: isMobile?14:17, color:'rgba(253,246,236,0.65)', lineHeight:1.75, margin:'0 0 20px' }}>{article.excerpt}</p>}
          <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#E8890C,#F5C842)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'white' }}>
                {(article.authorName||'K').charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:'white' }}>{article.authorName || 'KundaliBaba'}</div>
                <div style={{ fontSize:11, color:'rgba(253,246,236,0.5)' }}>{fmtDate(article.publishedAt)}</div>
              </div>
            </div>
            <div style={{ fontSize:12, color:'rgba(253,246,236,0.5)', display:'flex', alignItems:'center', gap:4 }}>⏱ {rt} min read</div>
            {article.views > 0 && <div style={{ fontSize:12, color:'rgba(253,246,236,0.5)' }}>👁 {article.views.toLocaleString()} views</div>}
          </div>
        </div>
      </div>

      {/* Cover image */}
      {article.coverImage && (
        <div style={{ maxWidth:760, margin:'0 auto', padding:'0 16px' }}>
          <img src={article.coverImage} alt={article.title}
            style={{ width:'100%', maxHeight:400, objectFit:'cover', borderRadius: isMobile?'0 0 16px 16px':'0 0 20px 20px', display:'block' }} />
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth:760, margin:'0 auto', padding: isMobile?'28px 16px 56px':'40px 24px 72px' }}>
        <div
          style={{ fontSize: isMobile?15:16, lineHeight:1.9, color:'#1A0A00' }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div style={{ marginTop:36, paddingTop:24, borderTop:'1px solid #EDD9B8' }}>
            <div style={{ fontSize:12, fontWeight:700, color:'#A07850', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Tags</div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {article.tags.map(tag => (
                <button key={tag} onClick={() => onNavigate(`articles?tag=${encodeURIComponent(tag)}`)}
                  style={{ padding:'5px 14px', border:'1px solid #EDD9B8', borderRadius:20, background:'white', fontSize:12, color:'#6B4C2A', cursor:'pointer', fontFamily:'inherit' }}>
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop:40, padding: isMobile?'24px 20px':'32px 36px', background:'linear-gradient(135deg,#060D20,#0D1B3E)', borderRadius:20, textAlign:'center' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#F5C842', marginBottom:10 }}>✦ Go Deeper</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile?20:26, fontWeight:700, color:'white', marginBottom:10, lineHeight:1.3 }}>Want a personalised reading?</div>
          <p style={{ fontSize:13, color:'rgba(253,246,236,0.6)', marginBottom:20, lineHeight:1.7 }}>Your birth chart reveals insights no general article can. Get your free Kundali in 30 seconds.</p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <KBButton variant="primary" onClick={() => onNavigate('kundali')}>Get Free Kundali</KBButton>
            <KBButton variant="ghost" onClick={() => onNavigate('chat')}>Talk to a Pandit</KBButton>
          </div>
        </div>
      </div>

      {/* Related articles slider */}
      <ArticlesSlider
        context={{ category: article.category, excludeSlug: article.slug }}
        onNavigate={onNavigate}
      />
    </div>
  );
}

// ── Router ─────────────────────────────────────────────────────────────────────
function BlogPage({ path, onNavigate }) {
  // path: 'articles' | 'articles/some-slug'
  const parts = path.split('/');
  const sub   = parts[1]; // slug if present

  if (!sub) return <ArticlesHub onNavigate={onNavigate} />;
  return <ArticleDetail slug={sub} onNavigate={onNavigate} />;
}

Object.assign(window, { BlogPage, ArticlesSlider, BLOG_CATEGORIES });
