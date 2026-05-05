// ============================================================
// KundaliBaba — Gemstone Shop Page
// ============================================================

function ShopPage({ onNavigate }) {
  const isMobile = useMobile();

  const gems = [
    { name:'Yellow Sapphire (Pukhraj)', planet:'Jupiter ♃', price:'₹4,999', icon:'💛', benefit:'Enhances wisdom, wealth & career growth.', color:'#F5C842' },
    { name:'Blue Sapphire (Neelam)',    planet:'Saturn ♄',  price:'₹8,999', icon:'💙', benefit:'Brings discipline, success & removes obstacles.', color:'#1565C0' },
    { name:'Ruby (Manik)',              planet:'Sun ☉',      price:'₹6,499', icon:'❤️', benefit:'Boosts confidence, authority & vitality.', color:'#C62828' },
    { name:'Emerald (Panna)',           planet:'Mercury ☿',  price:'₹5,499', icon:'💚', benefit:'Sharpens intellect, communication & business.', color:'#2E7D32' },
    { name:'Red Coral (Moonga)',        planet:'Mars ♂',     price:'₹3,499', icon:'🔴', benefit:'Energizes drive, courage & health.', color:'#E8890C' },
    { name:'Pearl (Moti)',              planet:'Moon ☽',     price:'₹2,999', icon:'⚪', benefit:'Calms mind, improves relationships & intuition.', color:'#6B4C2A' },
    { name:'Hessonite (Gomed)',         planet:'Rahu ☊',     price:'₹3,999', icon:'🟤', benefit:'Removes confusion, strengthens focus & career.', color:'#8B1A1A' },
    { name:'Cat\'s Eye (Lehsunia)',     planet:'Ketu ☋',     price:'₹4,499', icon:'🟡', benefit:'Provides protection, intuition & spiritual growth.', color:'#A07850' },
    { name:'White Sapphire (Safed)',    planet:'Venus ♀',    price:'₹5,999', icon:'🤍', benefit:'Brings love, luxury, beauty & artistic success.', color:'#9C27B0' },
  ];

  const features = [
    { icon:'💎', title:'GIA/IGI Certified', desc:'Every gemstone comes with a lab certificate guaranteeing authenticity and quality.' },
    { icon:'🕉️', title:'Pandit Energized', desc:'Stones are energized with Vedic mantras during an auspicious muhurat by our pandits.' },
    { icon:'🚚', title:'Free Delivery', desc:'Free delivery across India on orders above ₹999. Arrives in secure, tamper-proof packaging.' },
    { icon:'↩️', title:'7-Day Returns', desc:'Not satisfied? Return within 7 days for a full refund — no questions asked.' },
  ];

  return (
    <div style={{ background:'#FFF9F0', minHeight:'100vh' }}>

      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg,#060D20 0%,#0D1B3E 60%,#152855 100%)', padding: isMobile ? '48px 16px 40px' : '72px 32px 56px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, rgba(245,200,66,0.05) 1px, transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} />
        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'#F5C842', marginBottom:12 }}>✦ Certified & Energized</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 32 : 48, fontWeight:800, color:'white', margin:'0 0 14px', lineHeight:1.1 }}>Ratna &amp; Gemstone Shop</h2>
          <p style={{ fontSize: isMobile ? 14 : 16, color:'rgba(253,246,236,0.6)', margin:'0 0 32px', maxWidth:520, lineHeight:1.7 }}>
            GIA/IGI certified gemstones sourced from verified vendors, energized by pandits during auspicious muhurat for maximum planetary benefit.
          </p>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            {[['💎','GIA/IGI Certified'],['🕉️','Pandit Energized'],['🚚','Free Delivery ₹999+'],['↩️','7-Day Returns']].map(([icon, label]) => (
              <div key={label} style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(245,200,66,0.08)', border:'1px solid rgba(245,200,66,0.2)', borderRadius:999, padding:'6px 14px', fontSize:12, color:'rgba(253,246,236,0.8)', fontWeight:500 }}>
                <span>{icon}</span>{label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature strip */}
      <div style={{ background:'white', borderBottom:'1px solid #EDD9B8', padding: isMobile ? '20px 16px' : '24px 32px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: isMobile ? 16 : 24 }}>
          {features.map(f => (
            <div key={f.title} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
              <span style={{ fontSize:22, flexShrink:0 }}>{f.icon}</span>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:'#1A0A00', marginBottom:2 }}>{f.title}</div>
                <div style={{ fontSize:11, color:'#A07850', lineHeight:1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gemstone grid */}
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile ? '36px 16px' : '56px 32px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32, flexWrap:'wrap', gap:12 }}>
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 22 : 28, fontWeight:700, color:'#0D1B3E', margin:'0 0 4px' }}>Shop by Planet</h2>
            <p style={{ fontSize:13, color:'#A07850', margin:0 }}>Select the gemstone recommended for your Kundali</p>
          </div>
          <div style={{ fontSize:12, color:'#6B4C2A', background:'rgba(232,137,12,0.08)', border:'1px solid rgba(232,137,12,0.2)', padding:'6px 14px', borderRadius:999 }}>
            💡 Not sure which to pick? <span onClick={() => onNavigate('chat')} style={{ color:'#E8890C', fontWeight:700, cursor:'pointer' }}>Ask a Pandit →</span>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: isMobile ? 12 : 24, marginBottom:48 }}>
          {gems.map(g => (
            <div key={g.name} style={{ background:'white', borderRadius:16, padding: isMobile ? 18 : 28, border:'1px solid #EDD9B8', boxShadow:'0 2px 8px rgba(13,27,62,0.06)', cursor:'pointer', transition:'all 200ms', display:'flex', flexDirection:'column' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(13,27,62,0.13)'; e.currentTarget.style.borderColor='#E8890C'; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 2px 8px rgba(13,27,62,0.06)'; e.currentTarget.style.borderColor='#EDD9B8'; }}
            >
              <div style={{ fontSize: isMobile ? 32 : 40, marginBottom:12 }}>{g.icon}</div>
              <div style={{ fontSize: isMobile ? 13 : 15, fontWeight:700, color:'#1A0A00', marginBottom:4 }}>{g.name}</div>
              <div style={{ fontSize:11, color:'#E8890C', fontWeight:600, marginBottom:8 }}>{g.planet}</div>
              <div style={{ fontSize: isMobile ? 11 : 13, color:'#6B4C2A', lineHeight:1.65, marginBottom:16, flex:1 }}>{g.benefit}</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize: isMobile ? 16 : 18, fontWeight:800, color:'#1A0A00' }}>{g.price}</span>
                <KBButton variant="primary" size="sm">Add to Cart</KBButton>
              </div>
            </div>
          ))}
        </div>

        {/* Pandit CTA banner */}
        <div style={{ background:'linear-gradient(135deg,#0D1B3E,#152855)', borderRadius:20, padding: isMobile ? '28px 20px' : '40px 52px', border:'1px solid rgba(245,200,66,0.2)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:24, flexWrap:'wrap' }}>
          <div>
            <div style={{ fontSize: isMobile ? 15 : 17, fontWeight:700, color:'white', marginBottom:6 }}>Not sure which gemstone to wear?</div>
            <div style={{ fontSize: isMobile ? 12 : 13, color:'rgba(253,246,236,0.55)', maxWidth:400, lineHeight:1.6 }}>
              Our pandits analyse your Kundali and recommend the exact ratna, weight, and finger to wear it on for maximum benefit.
            </div>
          </div>
          <KBButton variant="gold" onClick={() => onNavigate('chat')}>💬 Ask a Pandit Free</KBButton>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ShopPage });
