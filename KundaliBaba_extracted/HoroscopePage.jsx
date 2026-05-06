// ============================================================
// KundaliBaba — Horoscope Pages
// /horoscope          → all rashis + today/weekly/monthly tabs
// /horoscope/today    → all rashis today
// /horoscope/today/aries → individual rashi
// ============================================================

const RASHIS = [
  { slug:'aries',       name:'Aries',       hindi:'Mesh',       symbol:'♈', element:'Fire',  lord:'Mars',    dates:'Mar 21 – Apr 19', icon:'🐏', color:'#E53E3E' },
  { slug:'taurus',      name:'Taurus',      hindi:'Vrishabh',   symbol:'♉', element:'Earth', lord:'Venus',   dates:'Apr 20 – May 20', icon:'🐂', color:'#38A169' },
  { slug:'gemini',      name:'Gemini',      hindi:'Mithun',     symbol:'♊', element:'Air',   lord:'Mercury', dates:'May 21 – Jun 20', icon:'👯', color:'#D69E2E' },
  { slug:'cancer',      name:'Cancer',      hindi:'Kark',       symbol:'♋', element:'Water', lord:'Moon',    dates:'Jun 21 – Jul 22', icon:'🦀', color:'#3182CE' },
  { slug:'leo',         name:'Leo',         hindi:'Simha',      symbol:'♌', element:'Fire',  lord:'Sun',     dates:'Jul 23 – Aug 22', icon:'🦁', color:'#DD6B20' },
  { slug:'virgo',       name:'Virgo',       hindi:'Kanya',      symbol:'♍', element:'Earth', lord:'Mercury', dates:'Aug 23 – Sep 22', icon:'👧', color:'#805AD5' },
  { slug:'libra',       name:'Libra',       hindi:'Tula',       symbol:'♎', element:'Air',   lord:'Venus',   dates:'Sep 23 – Oct 22', icon:'⚖️', color:'#E53E3E' },
  { slug:'scorpio',     name:'Scorpio',     hindi:'Vrishchik',  symbol:'♏', element:'Water', lord:'Mars',    dates:'Oct 23 – Nov 21', icon:'🦂', color:'#2D3748' },
  { slug:'sagittarius', name:'Sagittarius', hindi:'Dhanu',      symbol:'♐', element:'Fire',  lord:'Jupiter', dates:'Nov 22 – Dec 21', icon:'🏹', color:'#9C4221' },
  { slug:'capricorn',   name:'Capricorn',   hindi:'Makar',      symbol:'♑', element:'Earth', lord:'Saturn',  dates:'Dec 22 – Jan 19', icon:'🐐', color:'#2D3748' },
  { slug:'aquarius',    name:'Aquarius',    hindi:'Kumbh',      symbol:'♒', element:'Air',   lord:'Saturn',  dates:'Jan 20 – Feb 18', icon:'🏺', color:'#2B6CB0' },
  { slug:'pisces',      name:'Pisces',      hindi:'Meen',       symbol:'♓', element:'Water', lord:'Jupiter', dates:'Feb 19 – Mar 20', icon:'🐟', color:'#285E61' },
];

const PERIODS     = ['yesterday', 'today', 'tomorrow', 'weekly', 'monthly'];
const HUB_PERIODS = ['today', 'weekly', 'monthly'];
const BACKEND     = 'https://kundalibaba-backend-production.up.railway.app/api/v1';

// Map URL slug → API period value
const PERIOD_API   = { yesterday: 'daily', today: 'daily', weekly: 'weekly', monthly: 'monthly', tomorrow: 'daily' };
// Map URL slug → display label
const PERIOD_LABEL = { yesterday: 'Yesterday', today: 'Today', weekly: 'Weekly', monthly: 'Monthly', tomorrow: 'Tomorrow' };

// Returns ISO date string offset from today
function getDateForPeriod(period) {
  const d = new Date();
  if (period === 'yesterday') d.setDate(d.getDate() - 1);
  if (period === 'tomorrow')  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function useHoroscopes(period) {
  const [data, setData] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(true);
    const apiPeriod = PERIOD_API[period] || period;
    const date = (period === 'yesterday' || period === 'tomorrow') ? getDateForPeriod(period) : '';
    const url = `${BACKEND}/content/horoscopes?period=${apiPeriod}${date ? `&date=${date}` : ''}`;
    fetch(url)
      .then(r => r.json())
      .then(r => {
        const map = {};
        (r.data || []).forEach(h => { map[h.sign.toLowerCase()] = h; });
        setData(map);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [period]);
  return { data, loading };
}

// ── Rashi Card (used in grid + slider) ─────────────────────────
function RashiCard({ rashi, horoscope, period, onNavigate, compact }) {
  const isMobile = useMobile();
  const text = horoscope?.content || 'Your horoscope for today is being prepared by our pandits. Check back soon.';
  const preview = text.length > 110 ? text.slice(0, 110) + '…' : text;

  return (
    <div
      onClick={() => onNavigate(`horoscope/${period}/${rashi.slug}`)}
      style={{ background:'white', borderRadius:16, border:'1px solid #EDD9B8', cursor:'pointer', overflow:'hidden', transition:'all 200ms', flexShrink: compact ? 0 : undefined, width: compact ? (isMobile ? 220 : 260) : '100%' }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(13,27,62,0.13)'; e.currentTarget.style.borderColor='#E8890C'; }}
      onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; e.currentTarget.style.borderColor='#EDD9B8'; }}
    >
      <div style={{ background:`linear-gradient(135deg, ${rashi.color}22, ${rashi.color}11)`, padding: compact ? '16px 16px 12px' : '20px 20px 14px', borderBottom:`2px solid ${rashi.color}33` }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize: compact ? 28 : 32 }}>{rashi.icon}</span>
          <div>
            <div style={{ fontSize: compact ? 15 : 17, fontWeight:800, color:'#0D1B3E' }}>{rashi.symbol} {rashi.name}</div>
            <div style={{ fontSize:11, color:'#A07850', fontWeight:500 }}>{rashi.hindi} · {rashi.dates}</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:6, marginTop:10, flexWrap:'wrap' }}>
          <span style={{ fontSize:10, fontWeight:600, background:`${rashi.color}22`, color:rashi.color, padding:'2px 8px', borderRadius:999 }}>{rashi.element}</span>
          <span style={{ fontSize:10, fontWeight:600, background:'rgba(232,137,12,0.1)', color:'#E8890C', padding:'2px 8px', borderRadius:999 }}>Lord: {rashi.lord}</span>
        </div>
      </div>
      <div style={{ padding: compact ? '12px 16px 14px' : '14px 20px 18px' }}>
        <p style={{ fontSize: compact ? 12 : 13, color:'#6B4C2A', lineHeight:1.65, margin:'0 0 12px' }}>{preview}</p>
        {horoscope?.lucky && (
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:10 }}>
            {[['🔢', `Lucky #${horoscope.lucky.number}`], ['🎨', horoscope.lucky.color], ['📅', horoscope.lucky.day]].map(([ic, val]) => (
              <span key={val} style={{ fontSize:10, background:'#FFF9F0', border:'1px solid #EDD9B8', padding:'3px 8px', borderRadius:6, color:'#6B4C2A' }}>{ic} {val}</span>
            ))}
          </div>
        )}
        <span style={{ fontSize:12, fontWeight:700, color:'#E8890C' }}>Read {PERIOD_LABEL[period] || period} Horoscope →</span>
      </div>
    </div>
  );
}

// ── Individual Rashi Page ────────────────────────────────────────
function RashiDetailPage({ rashiSlug, period, onNavigate }) {
  const isMobile = useMobile();
  const rashi = RASHIS.find(r => r.slug === rashiSlug);
  const [horoscope, setHoroscope] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [activePeriod, setActivePeriod] = React.useState(period || 'today');

  React.useEffect(() => {
    setLoading(true);
    const apiPeriod = PERIOD_API[activePeriod] || activePeriod;
    const date = (activePeriod === 'yesterday' || activePeriod === 'tomorrow') ? getDateForPeriod(activePeriod) : '';
    fetch(`${BACKEND}/content/horoscopes/${rashiSlug}?period=${apiPeriod}${date ? `&date=${date}` : ''}`)
      .then(r => r.json())
      .then(r => { setHoroscope(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [rashiSlug, activePeriod]);

  if (!rashi) return (
    <div style={{ minHeight:'60vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontSize:48, marginBottom:12 }}>🔮</div>
      <div style={{ fontSize:20, fontWeight:700, color:'#0D1B3E', marginBottom:16 }}>Rashi not found</div>
      <button onClick={() => onNavigate('horoscope')} style={{ padding:'10px 24px', background:'#E8890C', color:'white', border:'none', borderRadius:8, cursor:'pointer', fontWeight:600 }}>Back to Horoscope</button>
    </div>
  );

  const idx = RASHIS.findIndex(r => r.slug === rashiSlug);
  const prev = RASHIS[(idx - 1 + 12) % 12];
  const next = RASHIS[(idx + 1) % 12];

  return (
    <div style={{ background:'#FFF9F0', minHeight:'100vh' }}>
      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg, #060D20 0%, #0D1B3E 60%, ${rashi.color}44 100%)`, padding: isMobile ? '48px 16px 40px' : '64px 32px 56px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, rgba(245,200,66,0.04) 1px, transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} />
        <div style={{ maxWidth:860, margin:'0 auto', position:'relative' }}>
          <button onClick={() => onNavigate(`horoscope/${activePeriod}`)} style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', color:'rgba(253,246,236,0.7)', padding:'6px 14px', borderRadius:8, fontSize:12, cursor:'pointer', marginBottom:20 }}>← Back to {PERIOD_LABEL[activePeriod] || activePeriod} Horoscope</button>
          <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:20, flexWrap:'wrap' }}>
            <span style={{ fontSize: isMobile ? 56 : 72 }}>{rashi.icon}</span>
            <div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'#F5C842', marginBottom:6 }}>{rashi.symbol} {rashi.hindi} Rashi</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 36 : 52, fontWeight:800, color:'white', margin:'0 0 6px', lineHeight:1.1 }}>{rashi.name}</h2>
              <div style={{ fontSize:13, color:'rgba(253,246,236,0.6)' }}>{rashi.dates} · {rashi.element} · Ruled by {rashi.lord}</div>
            </div>
          </div>
          {/* Period tabs */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {PERIODS.map(p => (
              <button key={p} onClick={() => { setActivePeriod(p); onNavigate(`horoscope/${p}/${rashiSlug}`); }}
                style={{ padding:'8px 18px', borderRadius:999, border:'none', fontFamily:'inherit', fontWeight:600, fontSize:13, cursor:'pointer', background: activePeriod===p ? '#F5C842' : 'rgba(255,255,255,0.1)', color: activePeriod===p ? '#0D1B3E' : 'rgba(253,246,236,0.7)', transition:'all 150ms' }}>
                {PERIOD_LABEL[p] || p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:860, margin:'0 auto', padding: isMobile ? '32px 16px' : '48px 32px' }}>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 280px', gap:24 }}>
          {/* Main horoscope text */}
          <div style={{ background:'white', borderRadius:16, padding: isMobile ? '24px' : '36px', border:'1px solid #EDD9B8', boxShadow:'0 2px 12px rgba(13,27,62,0.06)' }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#E8890C', marginBottom:12 }}>
              {PERIOD_LABEL[activePeriod] || activePeriod} Horoscope
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 20 : 24, fontWeight:700, color:'#0D1B3E', marginBottom:20 }}>
              {rashi.name} {PERIOD_LABEL[activePeriod] || activePeriod} Horoscope
            </h2>
            {loading ? (
              <div style={{ color:'#A07850', fontSize:14 }}>Loading your horoscope...</div>
            ) : (
              <p style={{ fontSize:15, lineHeight:1.9, color:'#374151', margin:0 }}>
                {horoscope?.content || 'Your horoscope is being prepared by our pandits. Please check back soon.'}
              </p>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Lucky panel */}
            {horoscope?.lucky && (
              <div style={{ background:'white', borderRadius:16, padding:20, border:'1px solid #EDD9B8' }}>
                <div style={{ fontSize:12, fontWeight:700, color:'#0D1B3E', marginBottom:14 }}>✨ Today's Lucky</div>
                {[['🔢','Lucky Number', horoscope.lucky.number], ['🎨','Lucky Color', horoscope.lucky.color], ['📅','Lucky Day', horoscope.lucky.day]].map(([ic, label, val]) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #FFF9F0' }}>
                    <span style={{ fontSize:13, color:'#6B4C2A' }}>{ic} {label}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:'#0D1B3E' }}>{val}</span>
                  </div>
                ))}
              </div>
            )}
            {/* Rashi info */}
            <div style={{ background:'white', borderRadius:16, padding:20, border:'1px solid #EDD9B8' }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#0D1B3E', marginBottom:14 }}>ℹ️ About {rashi.name}</div>
              {[['Symbol',rashi.symbol],['Element',rashi.element],['Ruling Planet',rashi.lord],['Dates',rashi.dates]].map(([k,v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid #FFF9F0', fontSize:12 }}>
                  <span style={{ color:'#A07850' }}>{k}</span><span style={{ fontWeight:600, color:'#0D1B3E' }}>{v}</span>
                </div>
              ))}
            </div>
            {/* CTA */}
            <div style={{ background:'linear-gradient(135deg,#0D1B3E,#152855)', borderRadius:16, padding:20, border:'1px solid rgba(245,200,66,0.2)' }}>
              <div style={{ fontSize:13, fontWeight:700, color:'white', marginBottom:8 }}>Get Personalized Prediction</div>
              <div style={{ fontSize:12, color:'rgba(253,246,236,0.55)', marginBottom:16 }}>Talk to a pandit about your Kundali for accurate predictions.</div>
              <KBButton variant="gold" onClick={() => onNavigate('chat')} style={{ width:'100%' }}>💬 Talk to Pandit</KBButton>
            </div>
          </div>
        </div>

        {/* Other rashis nav */}
        <div style={{ marginTop:40 }}>
          <div style={{ fontSize:14, fontWeight:700, color:'#0D1B3E', marginBottom:16 }}>Other Rashis</div>
          <div style={{ display:'flex', justifyContent:'space-between', gap:16 }}>
            <div onClick={() => onNavigate(`horoscope/${activePeriod}/${prev.slug}`)}
              style={{ flex:1, background:'white', borderRadius:12, padding:'14px 18px', border:'1px solid #EDD9B8', cursor:'pointer', display:'flex', alignItems:'center', gap:10 }}
              onMouseEnter={e => e.currentTarget.style.borderColor='#E8890C'}
              onMouseLeave={e => e.currentTarget.style.borderColor='#EDD9B8'}>
              <span style={{ fontSize:24 }}>{prev.icon}</span>
              <div><div style={{ fontSize:10, color:'#A07850' }}>← Previous</div><div style={{ fontSize:13, fontWeight:700 }}>{prev.name}</div></div>
            </div>
            <div onClick={() => onNavigate(`horoscope/${activePeriod}/${next.slug}`)}
              style={{ flex:1, background:'white', borderRadius:12, padding:'14px 18px', border:'1px solid #EDD9B8', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'flex-end', gap:10, textAlign:'right' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='#E8890C'}
              onMouseLeave={e => e.currentTarget.style.borderColor='#EDD9B8'}>
              <div><div style={{ fontSize:10, color:'#A07850' }}>Next →</div><div style={{ fontSize:13, fontWeight:700 }}>{next.name}</div></div>
              <span style={{ fontSize:24 }}>{next.icon}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── All Rashis listing (period page) ────────────────────────────
function HoroscopeListPage({ period, onNavigate }) {
  const isMobile = useMobile();
  const { data, loading } = useHoroscopes(period);

  return (
    <div style={{ background:'#FFF9F0', minHeight:'100vh' }}>
      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg,#060D20 0%,#0D1B3E 60%,#152855 100%)', padding: isMobile ? '48px 16px 40px' : '64px 32px 56px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, rgba(245,200,66,0.04) 1px, transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} />
        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'#F5C842', marginBottom:12 }}>✦ Vedic Astrology</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 32 : 48, fontWeight:800, color:'white', margin:'0 0 10px', lineHeight:1.1 }}>
            {PERIOD_LABEL[period] || period} Horoscope
          </h2>
          <p style={{ fontSize:14, color:'rgba(253,246,236,0.6)', margin:'0 0 28px', maxWidth:520 }}>
            {period==='yesterday' ? "Yesterday's planetary alignments for all 12 rashis — reflect on what the stars revealed." :
             period==='today'     ? "What does today hold for your rashi? Read your personalized Vedic prediction." :
             period==='weekly'    ? "Your week ahead — love, career, health and spiritual growth by rashi." :
             period==='monthly'   ? "Monthly cosmic overview for all 12 rashis — plan your month with planetary guidance." :
             "Prepare for tomorrow's planetary alignments — know what the stars have in store."}
          </p>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {PERIODS.map(p => (
              <button key={p} onClick={() => onNavigate(`horoscope/${p}`)}
                style={{ padding:'8px 18px', borderRadius:999, border:'none', fontFamily:'inherit', fontWeight:600, fontSize:13, cursor:'pointer', background: period===p ? '#F5C842' : 'rgba(255,255,255,0.1)', color: period===p ? '#0D1B3E' : 'rgba(253,246,236,0.7)', transition:'all 150ms' }}>
                {PERIOD_LABEL[p] || p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile ? '32px 16px' : '48px 32px' }}>
        {loading ? (
          <div style={{ textAlign:'center', padding:48, color:'#A07850' }}>Loading horoscopes...</div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 16 : 24 }}>
            {RASHIS.map(r => (
              <RashiCard key={r.slug} rashi={r} horoscope={data[r.slug]} period={period} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Horoscope Hub Page (/horoscope) ────────────────────────
function HoroscopeHubPage({ onNavigate }) {
  const isMobile = useMobile();
  const [activePeriod, setActivePeriod] = React.useState('today');
  const { data, loading } = useHoroscopes(activePeriod);
  const sliderRef = React.useRef(null);

  const scroll = (dir) => { if (sliderRef.current) sliderRef.current.scrollBy({ left: dir * 280, behavior:'smooth' }); };

  return (
    <div style={{ background:'#FFF9F0', minHeight:'100vh' }}>
      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg,#060D20 0%,#0D1B3E 60%,#152855 100%)', padding: isMobile ? '48px 16px 40px' : '72px 32px 56px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, rgba(245,200,66,0.04) 1px, transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} />
        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative', textAlign:'center' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'#F5C842', marginBottom:12 }}>✦ Vedic Astrology · 12 Rashis</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 34 : 54, fontWeight:800, color:'white', margin:'0 0 14px', lineHeight:1.1 }}>Today's Horoscope</h2>
          <p style={{ fontSize: isMobile ? 14 : 16, color:'rgba(253,246,236,0.6)', margin:'0 auto 32px', maxWidth:520, lineHeight:1.7 }}>
            Free today's, weekly & monthly horoscope for all 12 rashis based on Vedic astrology principles.
          </p>
          {/* Period selector */}
          <div style={{ display:'inline-flex', gap:4, background:'rgba(255,255,255,0.08)', padding:4, borderRadius:999, border:'1px solid rgba(255,255,255,0.12)' }}>
            {HUB_PERIODS.map(p => (
              <button key={p} onClick={() => setActivePeriod(p)}
                style={{ padding:'9px 24px', borderRadius:999, border:'none', fontFamily:'inherit', fontWeight:600, fontSize:13, cursor:'pointer', background: activePeriod===p ? '#F5C842' : 'transparent', color: activePeriod===p ? '#0D1B3E' : 'rgba(253,246,236,0.7)', transition:'all 150ms' }}>
                {PERIOD_LABEL[p] || p}
              </button>
            ))}
          </div>
          {/* Quick links for yesterday / tomorrow */}
          <div style={{ marginTop:16, display:'flex', gap:12, justifyContent:'center' }}>
            <button onClick={() => onNavigate('horoscope/yesterday')}
              style={{ background:'none', border:'1px solid rgba(245,200,66,0.3)', color:'rgba(245,200,66,0.75)', padding:'5px 16px', borderRadius:999, fontFamily:'inherit', fontSize:12, cursor:'pointer', transition:'all 150ms' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#F5C842'; e.currentTarget.style.color='#F5C842'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(245,200,66,0.3)'; e.currentTarget.style.color='rgba(245,200,66,0.75)'; }}>
              ← Yesterday
            </button>
            <button onClick={() => onNavigate('horoscope/tomorrow')}
              style={{ background:'none', border:'1px solid rgba(245,200,66,0.3)', color:'rgba(245,200,66,0.75)', padding:'5px 16px', borderRadius:999, fontFamily:'inherit', fontSize:12, cursor:'pointer', transition:'all 150ms' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#F5C842'; e.currentTarget.style.color='#F5C842'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(245,200,66,0.3)'; e.currentTarget.style.color='rgba(245,200,66,0.75)'; }}>
              Tomorrow →
            </button>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile ? '32px 0' : '48px 0' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding: isMobile ? '0 16px' : '0 32px', marginBottom:20 }}>
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 20 : 26, fontWeight:700, color:'#0D1B3E', margin:0 }}>
              {PERIOD_LABEL[activePeriod] || activePeriod} Horoscope — All Rashis
            </h2>
          </div>
          {!isMobile && (
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => scroll(-1)} style={{ width:36, height:36, borderRadius:'50%', border:'1px solid #EDD9B8', background:'white', cursor:'pointer', fontSize:16 }}>←</button>
              <button onClick={() => scroll(1)} style={{ width:36, height:36, borderRadius:'50%', border:'1px solid #EDD9B8', background:'white', cursor:'pointer', fontSize:16 }}>→</button>
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:48, color:'#A07850' }}>Loading horoscopes...</div>
        ) : (
          <div ref={sliderRef} style={{ display:'flex', gap:16, overflowX:'auto', padding: isMobile ? '0 16px 16px' : '0 32px 16px', scrollbarWidth:'none', WebkitOverflowScrolling:'touch' }}>
            {RASHIS.map(r => (
              <RashiCard key={r.slug} rashi={r} horoscope={data[r.slug]} period={activePeriod} onNavigate={onNavigate} compact />
            ))}
          </div>
        )}

        <div style={{ padding: isMobile ? '0 16px' : '0 32px', marginTop:8 }}>
          <button onClick={() => onNavigate(`horoscope/${activePeriod}`)}
            style={{ background:'none', border:'1.5px solid #E8890C', color:'#E8890C', padding:'10px 24px', borderRadius:999, fontFamily:'inherit', fontWeight:600, fontSize:13, cursor:'pointer' }}>
            View All {PERIOD_LABEL[activePeriod] || activePeriod} Horoscopes →
          </button>
        </div>
      </div>

      {/* All 12 rashis grid */}
      <div style={{ background:'white', padding: isMobile ? '36px 16px' : '56px 32px', borderTop:'1px solid #EDD9B8' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 22 : 28, fontWeight:700, color:'#0D1B3E', marginBottom:8 }}>Choose Your Rashi</h2>
          <p style={{ fontSize:13, color:'#A07850', marginBottom:28 }}>Select your zodiac sign for today's, weekly and monthly predictions</p>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? 'repeat(3,1fr)' : 'repeat(6,1fr)', gap: isMobile ? 10 : 16 }}>
            {RASHIS.map(r => (
              <div key={r.slug} onClick={() => onNavigate(`horoscope/${activePeriod}/${r.slug}`)}
                style={{ background:`linear-gradient(135deg,${r.color}11,${r.color}06)`, border:`1.5px solid ${r.color}33`, borderRadius:12, padding: isMobile ? '14px 8px' : '20px 12px', textAlign:'center', cursor:'pointer', transition:'all 200ms' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=r.color; e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=`${r.color}33`; e.currentTarget.style.transform=''; }}>
                <div style={{ fontSize: isMobile ? 28 : 36, marginBottom:6 }}>{r.icon}</div>
                <div style={{ fontSize: isMobile ? 11 : 13, fontWeight:700, color:'#0D1B3E' }}>{r.name}</div>
                <div style={{ fontSize:10, color:'#A07850' }}>{r.hindi}</div>
                <div style={{ fontSize:9, color:'#A07850', marginTop:2 }}>{r.symbol}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Router ───────────────────────────────────────────────────────
function HoroscopePage({ path, onNavigate }) {
  // path examples: 'horoscope', 'horoscope/daily', 'horoscope/daily/aries'
  const parts = (path || 'horoscope').split('/');
  const period = parts[1]; // daily | weekly | monthly | undefined
  const rashiSlug = parts[2];

  if (rashiSlug && PERIODS.includes(period)) return <RashiDetailPage rashiSlug={rashiSlug} period={period} onNavigate={onNavigate} />;
  if (rashiSlug) return <RashiDetailPage rashiSlug={rashiSlug} period={period || 'today'} onNavigate={onNavigate} />;
  if (period && PERIODS.includes(period)) return <HoroscopeListPage period={period} onNavigate={onNavigate} />;
  return <HoroscopeHubPage onNavigate={onNavigate} />;
}

// ── Homepage horoscope section (rashi slider + grid) ─────────────
function HoroscopeHomeSectionInner({ onNavigate, isMobile }) {
  const [activePeriod, setActivePeriod] = React.useState('today');
  const { data, loading } = useHoroscopes(activePeriod);
  const sliderRef = React.useRef(null);
  const scroll = (dir) => { if (sliderRef.current) sliderRef.current.scrollBy({ left: dir * 280, behavior:'smooth' }); };

  return (
    <div>
      {/* Period tabs */}
      <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom: isMobile ? 20 : 32, padding:'0 16px' }}>
        {PERIODS.map(p => (
          <button key={p} onClick={() => setActivePeriod(p)}
            style={{ padding:'8px 22px', borderRadius:999, border:'1.5px solid', fontFamily:'inherit', fontWeight:600, fontSize:13, cursor:'pointer', transition:'all 150ms',
              background: activePeriod===p ? '#E8890C' : 'white',
              borderColor: activePeriod===p ? '#E8890C' : '#EDD9B8',
              color: activePeriod===p ? 'white' : '#A07850' }}>
            {PERIOD_LABEL[p] || p}
          </button>
        ))}
      </div>

      {/* Rashi slider */}
      {loading ? (
        <div style={{ textAlign:'center', padding:'32px 0', color:'#A07850', fontSize:14 }}>Loading horoscopes...</div>
      ) : (
        <div style={{ position:'relative' }}>
          {!isMobile && (
            <>
              <button onClick={() => scroll(-1)} style={{ position:'absolute', left:8, top:'50%', transform:'translateY(-50%)', zIndex:2, width:36, height:36, borderRadius:'50%', border:'1px solid #EDD9B8', background:'white', cursor:'pointer', boxShadow:'0 2px 8px rgba(13,27,62,0.1)', fontSize:16 }}>←</button>
              <button onClick={() => scroll(1)} style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', zIndex:2, width:36, height:36, borderRadius:'50%', border:'1px solid #EDD9B8', background:'white', cursor:'pointer', boxShadow:'0 2px 8px rgba(13,27,62,0.1)', fontSize:16 }}>→</button>
            </>
          )}
          <div ref={sliderRef} style={{ display:'flex', gap:16, overflowX:'auto', padding: isMobile ? '0 16px 16px' : '0 48px 16px', scrollbarWidth:'none', WebkitOverflowScrolling:'touch' }}>
            {RASHIS.map(r => (
              <RashiCard key={r.slug} rashi={r} horoscope={data[r.slug]} period={activePeriod} onNavigate={onNavigate} compact />
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{ textAlign:'center', marginTop: isMobile ? 20 : 28, padding:'0 16px' }}>
        <button onClick={() => onNavigate('horoscope')}
          style={{ background:'linear-gradient(135deg,#0D1B3E,#152855)', color:'white', border:'none', padding: isMobile ? '12px 28px' : '14px 36px', borderRadius:999, fontFamily:'inherit', fontWeight:700, fontSize: isMobile ? 14 : 15, cursor:'pointer', boxShadow:'0 4px 16px rgba(13,27,62,0.2)', transition:'all 150ms' }}
          onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform=''}>
          See All Horoscopes →
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { HoroscopePage, RASHIS, HoroscopeHomeSectionInner });
