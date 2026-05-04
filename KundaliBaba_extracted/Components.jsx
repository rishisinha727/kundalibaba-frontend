// ============================================================
// KundaliBaba — Shared Components
// ============================================================

const KB = {
  saffron: '#E8890C',
  saffronLight: '#F5A83C',
  saffronDark: '#C4700A',
  gold: '#F5C842',
  goldMuted: '#D4A82A',
  midnight: '#060D20',
  deepNavy: '#0D1B3E',
  navy: '#152855',
  maroon: '#8B1A1A',
  cream: '#FDF6EC',
  warmWhite: '#FFF9F0',
  warmGray: '#F5EDE0',
  border: '#EDD9B8',
  text: '#1A0A00',
  textSec: '#6B4C2A',
  textTert: '#A07850',
  textInv: '#FDF6EC',
  success: '#2E7D32',
};

// ---- useMobile hook ----
function useMobile() {
  const [mobile, setMobile] = React.useState(window.innerWidth < 768);
  React.useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mobile;
}

// ---- KBButton ----
function KBButton({ children, variant = 'primary', size = 'md', onClick, style: ex = {}, disabled }) {
  const base = { fontFamily:'inherit', cursor: disabled ? 'not-allowed' : 'pointer', border:'none', fontWeight:600, transition:'all 150ms ease', display:'inline-flex', alignItems:'center', gap:6, opacity: disabled ? 0.55 : 1 };
  const variants = {
    primary: { background:'#E8890C', color:'white', borderRadius:999, boxShadow:'0 4px 14px rgba(232,137,12,0.35)' },
    secondary: { background:'transparent', color:'#E8890C', border:'2px solid #E8890C', borderRadius:8 },
    gold: { background:'linear-gradient(135deg,#E8890C,#F5C842)', color:'#1A0A00', borderRadius:8, boxShadow:'0 0 20px rgba(232,137,12,0.25)' },
    ghost: { background:'rgba(253,246,236,0.10)', color:'#FDF6EC', border:'1.5px solid rgba(253,246,236,0.25)', borderRadius:8 },
    ghostDark: { background:'transparent', color:'#E8890C', border:'1.5px solid rgba(232,137,12,0.4)', borderRadius:8 },
  };
  const sizes = {
    sm: { padding:'6px 16px', fontSize:12 },
    md: { padding:'10px 24px', fontSize:14 },
    lg: { padding:'14px 36px', fontSize:16, fontWeight:700 },
  };
  return (
    <button disabled={disabled} onClick={onClick}
      style={{ ...base, ...variants[variant], ...sizes[size], ...ex }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.filter = 'brightness(1.08)'; } }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.filter = ''; }}
      onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = ''; }}
    >{children}</button>
  );
}

// ---- StarRating ----
function StarRating({ rating, count }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
      <span style={{ color:'#F5C842', fontSize:12 }}>{'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}</span>
      <span style={{ fontSize:12, fontWeight:700, color:KB.text }}>{rating}</span>
      {count !== undefined && <span style={{ fontSize:11, color:KB.textTert }}>({count})</span>}
    </span>
  );
}

// ---- SectionHeader ----
function SectionHeader({ label, title, subtitle, light }) {
  const isMobile = useMobile();
  return (
    <div style={{ textAlign:'center', marginBottom:40 }}>
      {label && <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color: light ? '#F5C842' : '#E8890C', marginBottom:10 }}>✦ {label}</div>}
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 26 : 36, fontWeight:700, color: light ? 'white' : '#0D1B3E', margin:'0 0 14px', lineHeight:1.2, letterSpacing:'-0.01em' }}>{title}</h2>
      {subtitle && <p style={{ fontSize: isMobile ? 14 : 15, color: light ? 'rgba(253,246,236,0.65)' : '#6B4C2A', maxWidth:520, margin:'0 auto', lineHeight:1.65 }}>{subtitle}</p>}
    </div>
  );
}

// ---- TrustBar ----
function TrustBar() {
  const isMobile = useMobile();
  const stats = [
    { val:'10L+', label:'Consultations' },
    { val:'1200+', label:'Verified Pandits' },
    { val:'4.8★', label:'App Rating' },
    { val:'24/7', label:'Available' },
    { val:'₹10/min', label:'Starting Price' },
  ];
  return (
    <div style={{ background:'rgba(245,200,66,0.07)', borderTop:'1px solid rgba(245,200,66,0.18)', borderBottom:'1px solid rgba(245,200,66,0.18)', padding: isMobile ? '12px 16px' : '14px 32px' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', justifyContent:'center', gap: isMobile ? 16 : 40, flexWrap:'wrap' }}>
        {stats.map(s => (
          <div key={s.val} style={{ textAlign:'center' }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 16 : 20, fontWeight:700, color:'#F5C842', lineHeight:1 }}>{s.val}</div>
            <div style={{ fontSize:10, color:'rgba(253,246,236,0.5)', marginTop:3, letterSpacing:'0.05em' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- KBNav ----
function KBNav({ currentPage, onNavigate, tweaks, user, onSignIn, onLogout }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isMobile = useMobile();

  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close mobile menu on nav
  const navigate = (pg) => { onNavigate(pg); setMobileOpen(false); };

  const links = [
    { id:'horoscope', label:'Horoscope' },
    { id:'kundali', label:'Free Kundali' },
    { id:'matching', label:'Kundali Match' },
    { id:'chat', label:'Talk to Pandit' },
    { id:'shop', label:'Shop' },
  ];

  const navBg = scrolled
    ? 'rgba(6,13,32,0.92)'
    : (tweaks?.darkNav ? '#060D20' : '#0D1B3E');

  return (
    <div style={{ position:'sticky', top:0, zIndex:400 }}>
      <nav style={{
        background: navBg,
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: '1px solid rgba(245,200,66,0.12)',
        transition:'all 300ms ease',
        height:64, display:'flex', alignItems:'center',
        padding: isMobile ? '0 16px' : '0 32px',
      }}>
        {/* Logo */}
        <div onClick={() => navigate('home')} style={{ display:'flex', alignItems:'center', gap:8, marginRight: isMobile ? 0 : 40, cursor:'pointer', flexShrink:0 }}>
          <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="29" stroke="#E8890C" strokeWidth="2" fill="none" opacity="0.4"/>
            <polygon points="32,6 35.5,24 50,16 40,29 56,32 40,35 50,48 35.5,40 32,58 28.5,40 14,48 24,35 8,32 24,29 14,16 28.5,24" fill="#E8890C" opacity="0.9"/>
            <circle cx="32" cy="32" r="5" fill="#F5C842"/>
          </svg>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 17 : 19, fontWeight:700, color:'#F5C842', letterSpacing:'-0.2px' }}>Kundalibaba</span>
        </div>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display:'flex', alignItems:'center', gap:2, flex:1 }}>
            {links.map(l => {
              const isActive = currentPage === l.id || currentPage.startsWith(l.id + '/');
              return (
                <span key={l.id} onClick={() => navigate(l.id)} style={{
                  padding:'8px 13px', fontSize:13.5, fontWeight:500,
                  color: isActive ? '#F5C842' : 'rgba(253,246,236,0.72)',
                  borderRadius:6, cursor:'pointer',
                  borderBottom: isActive ? '2px solid #E8890C' : '2px solid transparent',
                  transition:'all 150ms',
                }}
                  onMouseEnter={e => { if (!isActive) e.target.style.color = 'white'; }}
                  onMouseLeave={e => { if (!isActive) e.target.style.color = 'rgba(253,246,236,0.72)'; }}
                >{l.label}</span>
              );
            })}
          </div>
        )}

        {/* Desktop actions */}
        {!isMobile && (
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {user ? (
              <>
                <div style={{ fontSize:13, color:'rgba(253,246,236,0.7)', fontWeight:500 }}>👤 {user.name || user.phone}</div>
                <button onClick={onLogout} style={{ padding:'7px 18px', border:'1.5px solid rgba(245,200,66,0.35)', borderRadius:8, background:'transparent', color:'#F5C842', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all 150ms' }}
                  onMouseEnter={e => { e.target.style.background = 'rgba(245,200,66,0.1)'; }}
                  onMouseLeave={e => { e.target.style.background = 'transparent'; }}
                >Logout</button>
              </>
            ) : (
              <button onClick={onSignIn} style={{ padding:'7px 18px', border:'1.5px solid rgba(245,200,66,0.35)', borderRadius:8, background:'transparent', color:'#F5C842', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all 150ms' }}
                onMouseEnter={e => { e.target.style.background = 'rgba(245,200,66,0.1)'; }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; }}
              >Sign In</button>
            )}
            <button onClick={() => navigate('chat')} style={{ padding:'8px 20px', background:'#E8890C', border:'none', borderRadius:999, color:'white', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 3px 12px rgba(232,137,12,0.45)', transition:'all 150ms' }}
              onMouseEnter={e => { e.target.style.filter = 'brightness(1.1)'; }}
              onMouseLeave={e => { e.target.style.filter = ''; }}
            >Talk Now</button>
          </div>
        )}

        {/* Mobile right side */}
        {isMobile && (
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10 }}>
            <button onClick={() => navigate('chat')} style={{ padding:'7px 14px', background:'#E8890C', border:'none', borderRadius:999, color:'white', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>Talk Now</button>
            <button onClick={() => setMobileOpen(o => !o)} style={{ background:'none', border:'none', cursor:'pointer', padding:'4px', color:'#F5C842', fontSize:22, lineHeight:1, display:'flex', alignItems:'center' }}>
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        )}
      </nav>

      {/* Mobile dropdown */}
      {isMobile && mobileOpen && (
        <div style={{ background:'#0D1B3E', borderBottom:'1px solid rgba(245,200,66,0.2)', padding:'8px 0', position:'absolute', width:'100%', zIndex:399, boxShadow:'0 8px 24px rgba(0,0,0,0.4)' }}>
          {links.map(l => {
            const isActive = currentPage === l.id || currentPage.startsWith(l.id + '/');
            return (
              <div key={l.id} onClick={() => navigate(l.id)} style={{ padding:'13px 20px', fontSize:15, fontWeight:500, color: isActive ? '#F5C842' : 'rgba(253,246,236,0.8)', cursor:'pointer', borderLeft: isActive ? '3px solid #E8890C' : '3px solid transparent', transition:'all 150ms' }}>
                {l.label}
              </div>
            );
          })}
          <div style={{ borderTop:'1px solid rgba(245,200,66,0.1)', margin:'8px 0' }} />
          {user ? (
            <div style={{ padding:'8px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:13, color:'rgba(253,246,236,0.7)' }}>👤 {user.name || user.phone}</span>
              <button onClick={() => { onLogout(); setMobileOpen(false); }} style={{ padding:'6px 14px', border:'1.5px solid rgba(245,200,66,0.35)', borderRadius:8, background:'transparent', color:'#F5C842', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Logout</button>
            </div>
          ) : (
            <div style={{ padding:'8px 20px' }}>
              <button onClick={() => { onSignIn(); setMobileOpen(false); }} style={{ width:'100%', padding:'10px 0', border:'1.5px solid rgba(245,200,66,0.35)', borderRadius:8, background:'transparent', color:'#F5C842', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Sign In with Google</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---- KBFooter ----
function KBFooter({ onNavigate }) {
  const isMobile = useMobile();
  return (
    <footer style={{ background:'#060D20', padding: isMobile ? '40px 20px 24px' : '56px 32px 28px', borderTop:'1px solid rgba(245,200,66,0.1)' }}>
      <div style={{ maxWidth:1280, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr', gap: isMobile ? 32 : 48, marginBottom:40 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
              <svg width="24" height="24" viewBox="0 0 64 64" fill="none">
                <polygon points="32,6 35.5,24 50,16 40,29 56,32 40,35 50,48 35.5,40 32,58 28.5,40 14,48 24,35 8,32 24,29 14,16 28.5,24" fill="#E8890C" opacity="0.9"/>
                <circle cx="32" cy="32" r="5" fill="#F5C842"/>
              </svg>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#F5C842' }}>Kundalibaba</span>
            </div>
            <p style={{ fontSize:13, color:'rgba(253,246,236,0.45)', lineHeight:1.75, maxWidth:240, marginBottom:18 }}>
              AI-powered Vedic astrology platform. Talk to verified pandits, get your free kundali, and shop certified ratna.
            </p>
            <div style={{ display:'flex', gap:8 }}>
              {['App Store', 'Google Play'].map(s => (
                <div key={s} style={{ background:'rgba(253,246,236,0.07)', border:'1px solid rgba(245,200,66,0.18)', borderRadius:8, padding:'7px 13px', fontSize:11, color:'rgba(253,246,236,0.65)', cursor:'pointer' }}>{s}</div>
              ))}
            </div>
          </div>
          {isMobile ? (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
              {[
                { title:'Services', links:['Free Kundali','Kundali Matching','Daily Horoscope','Talk to Pandit','Gemstone Shop'] },
                { title:'Support', links:['Help Center','Privacy Policy','Terms of Use','Contact Us'] },
              ].map(col => (
                <div key={col.title}>
                  <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(253,246,236,0.35)', marginBottom:12 }}>{col.title}</div>
                  {col.links.map(l => (
                    <div key={l} style={{ fontSize:13, color:'rgba(253,246,236,0.55)', marginBottom:8, cursor:'pointer' }}>{l}</div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            [
              { title:'Services', links:['Free Kundali','Kundali Matching','Daily Horoscope','Numerology','Talk to Pandit','Gemstone Shop'] },
              { title:'Company', links:['About Us','Blog','Our Astrologers','Careers','Press Kit'] },
              { title:'Support', links:['Help Center','Privacy Policy','Terms of Use','Refund Policy','Contact Us'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(253,246,236,0.35)', marginBottom:16 }}>{col.title}</div>
                {col.links.map(l => (
                  <div key={l} style={{ fontSize:13, color:'rgba(253,246,236,0.55)', marginBottom:10, cursor:'pointer', transition:'color 150ms' }}
                    onMouseEnter={e => e.target.style.color='#E8890C'}
                    onMouseLeave={e => e.target.style.color='rgba(253,246,236,0.55)'}
                  >{l}</div>
                ))}
              </div>
            ))
          )}
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:20, display:'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent:'space-between', alignItems: isMobile ? 'center' : 'center', gap:12, textAlign: isMobile ? 'center' : 'left' }}>
          <div style={{ fontSize:12, color:'rgba(253,246,236,0.3)' }}>© 2026 Kundalibaba Technologies Pvt. Ltd. All rights reserved.</div>
          <div style={{ fontSize: isMobile ? 13 : 16, color:'rgba(245,200,66,0.4)', letterSpacing:'0.12em' }}>♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓</div>
        </div>
      </div>
    </footer>
  );
}

// ---- PanditCard ----
function PanditCard({ p, onNavigate, onChat, compact }) {
  return (
    <div style={{
      background: p.featured ? 'linear-gradient(135deg,#0D1B3E,#152855)' : 'white',
      border: p.featured ? '1px solid rgba(245,200,66,0.3)' : '1px solid #EDD9B8',
      borderRadius:14, overflow:'hidden',
      boxShadow: p.featured ? '0 0 24px rgba(232,137,12,0.2)' : '0 2px 8px rgba(13,27,62,0.06)',
      transition:'all 200ms cubic-bezier(0.34,1.56,0.64,1)',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = p.featured ? '0 12px 36px rgba(232,137,12,0.3)' : '0 10px 28px rgba(13,27,62,0.14)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = p.featured ? '0 0 24px rgba(232,137,12,0.2)' : '0 2px 8px rgba(13,27,62,0.06)'; }}
    >
      <div style={{ height:88, background: p.featured ? 'linear-gradient(135deg,#1B0A40,#2a1060)' : 'linear-gradient(135deg,#0D1B3E,#152855)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
        <div style={{
          width:56, height:56, borderRadius:'50%',
          background: p.featured ? 'linear-gradient(135deg,#E8890C,#F5C842)' : 'rgba(232,137,12,0.55)',
          border: p.featured ? '2.5px solid rgba(245,200,66,0.6)' : '2px solid rgba(232,137,12,0.4)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:20, fontWeight:700, color: p.featured ? '#1A0A00' : '#FDF6EC',
          fontFamily:"'Playfair Display',serif",
        }}>{p.init}</div>
        <div style={{
          position:'absolute', top:8, right:8,
          background: p.busy ? 'rgba(245,127,23,0.9)' : p.online ? 'rgba(46,125,50,0.92)' : 'rgba(80,60,50,0.75)',
          color:'white', padding:'2px 8px', borderRadius:999, fontSize:10, fontWeight:700,
          display:'flex', alignItems:'center', gap:4,
        }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background: p.busy ? '#FFD740' : p.online ? '#69f0ae' : '#ccc' }} />
          {p.busy ? 'Busy' : p.online ? 'Online' : 'Offline'}
        </div>
        {p.featured && <div style={{ position:'absolute', bottom:8, left:8, background:'linear-gradient(135deg,#E8890C,#F5C842)', color:'#1A0A00', fontSize:9, fontWeight:800, padding:'2px 8px', borderRadius:999, letterSpacing:'0.06em' }}>✦ TOP RATED</div>}
      </div>
      <div style={{ padding:'12px 14px 14px' }}>
        <div style={{ fontSize:14, fontWeight:700, color: p.featured ? 'white' : '#1A0A00', marginBottom:2 }}>{p.name}</div>
        <div style={{ fontSize:11, color: p.featured ? '#F5C842' : '#E8890C', fontWeight:500, marginBottom:4 }}>{p.spec}</div>
        <div style={{ fontSize:10, color: p.featured ? 'rgba(253,246,236,0.45)' : '#A07850', marginBottom:8 }}>{p.lang} · {p.exp} yrs exp</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <StarRating rating={p.rating} count={p.reviews > 999 ? `${(p.reviews/1000).toFixed(1)}k` : p.reviews} />
        </div>
        <div style={{ fontSize:12, marginBottom:10, color: p.featured ? 'rgba(253,246,236,0.85)' : '#1A0A00' }}>
          ₹<strong style={{ fontSize:15, color: p.featured ? '#E8890C' : '#1A0A00' }}>{p.rate}</strong>
          <span style={{ fontSize:10, color: p.featured ? 'rgba(253,246,236,0.4)' : '#A07850' }}>/min</span>
          <span style={{ fontSize:10, color:'#2E7D32', fontWeight:700, marginLeft:6 }}>3 min free</span>
        </div>
        <button onClick={() => onChat && onChat(p.id)} style={{
          width:'100%', padding:'8px 0',
          background: p.featured ? 'linear-gradient(135deg,#E8890C,#F5C842)' : p.busy ? '#EDD9B8' : '#E8890C',
          border:'none', borderRadius:8,
          color: p.featured ? '#1A0A00' : p.busy ? '#A07850' : 'white',
          fontSize:13, fontWeight:700, cursor: p.busy ? 'default' : 'pointer', fontFamily:'inherit',
          transition:'all 150ms',
        }}>
          {p.busy ? '⏳ In Session' : '💬 Chat Now'}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { KB, useMobile, KBButton, StarRating, SectionHeader, TrustBar, KBNav, KBFooter, PanditCard });
