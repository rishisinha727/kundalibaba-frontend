// ============================================================
// KundaliBaba — HomePage
// ============================================================

function HomePage({ onNavigate, tweaks }) {
  const [activeZodiac, setActiveZodiac] = React.useState('♌');
  const [horoscopeShown, setHoroscopeShown] = React.useState(false);

  const zodiacSigns = [
    { sym:'♈', name:'Mesh', en:'Aries' }, { sym:'♉', name:'Vrishabh', en:'Taurus' },
    { sym:'♊', name:'Mithun', en:'Gemini' }, { sym:'♋', name:'Kark', en:'Cancer' },
    { sym:'♌', name:'Simha', en:'Leo' }, { sym:'♍', name:'Kanya', en:'Virgo' },
    { sym:'♎', name:'Tula', en:'Libra' }, { sym:'♏', name:'Vrishchik', en:'Scorpio' },
    { sym:'♐', name:'Dhanu', en:'Sagittarius' }, { sym:'♑', name:'Makar', en:'Capricorn' },
    { sym:'♒', name:'Kumbh', en:'Aquarius' }, { sym:'♓', name:'Meen', en:'Pisces' },
  ];

  const horoscopes = {
    '♈': 'Mars energizes your ambitions today. A financial opportunity arises — act decisively. Avoid conflicts with colleagues. Lucky number: 9.',
    '♉': 'Venus blesses relationships today. Reconnect with loved ones. Financial stability improves. Good day for property matters. Lucky color: Pink.',
    '♊': 'Mercury sharpens your communication skills. Great day for negotiations, writing or sales. Health needs attention. Lucky number: 5.',
    '♋': 'Moon heightens your intuition. Trust your gut in business decisions. Family matters need attention. Avoid overspending.',
    '♌': "Jupiter's transit brings career opportunities. Expect recognition for past efforts. Love life flourishes. Lucky color: Saffron.",
    '♍': 'Mercury favors analytical work. Perfect day for detailed tasks, research or accounts. Health improves. Travel plans materialize.',
    '♎': 'Venus brings harmony to partnerships. Collaborative ventures succeed today. Legal matters resolve favorably. Lucky day for investments.',
    '♏': 'Mars drives transformation. Unresolved issues find resolution. Avoid impulsive decisions in finances. Spiritual practices bring peace.',
    '♐': 'Jupiter expands horizons. Excellent day for learning and travel. Business proposals receive positive response. Lucky number: 3.',
    '♑': 'Saturn rewards discipline. Hard work gets recognized. Avoid shortcuts. Health improvement through routine. Lucky color: Navy blue.',
    '♒': 'Rahu brings unexpected changes. Be flexible and open to new ideas. Networking yields results. Lucky metal: Iron.',
    '♓': 'Neptune heightens spirituality. Creative projects flourish. Avoid confusion in financial decisions. Lucky stone: Pearl.',
  };

  const features = [
    { icon:'📜', title:'Free Kundali', desc:'Complete birth chart with planetary positions, Dasha & AI predictions.', page:'kundali', cta:'Get Free Kundali', badge:'Free' },
    { icon:'💑', title:'Kundali Matching', desc:'AI-powered 36-Gun Milan analysis for marriage compatibility.', page:'matching', cta:'Match Now', badge:'Free' },
    { icon:'🔢', title:'Numerology', desc:'Life path, destiny & personality numbers from name and birth date.', page:'home', cta:'Calculate', badge:'Free' },
    { icon:'💬', title:'Talk to Pandit', desc:'Chat or call 1200+ verified astropandits. First 3 minutes free.', page:'chat', cta:'Talk Now', badge:'3 min free' },
    { icon:'📅', title:'Daily Horoscope', desc:'Personalized daily, weekly & monthly Rashifal for all 12 rashis.', page:'home', cta:'Read Today\'s', badge:null },
    { icon:'💎', title:'Ratna Shop', desc:'Certified gemstones & energized kavach — delivered to you.', page:'shop', cta:'Browse', badge:'COD' },
  ];

  const astrologers = [
    { id:1, init:'R', name:'Pt. Rajesh Kumar', spec:'Vedic · Kundali · Vastu', exp:12, rating:4.8, reviews:1240, rate:18, online:true, lang:'Hindi, English' },
    { id:2, init:'A', name:'Acharya Vikram', spec:'KP · Nadi · Lal Kitab', exp:18, rating:4.9, reviews:3200, rate:25, online:true, lang:'Hindi, English, Marathi', featured:true },
    { id:3, init:'S', name:'Pt. Sunita Devi', spec:'Numerology · Tarot', exp:8, rating:4.6, reviews:850, rate:12, online:false, busy:true, lang:'Hindi, Tamil' },
    { id:4, init:'M', name:'Pt. Mahesh Joshi', spec:'Vedic · Marriage', exp:15, rating:4.7, reviews:2100, rate:20, online:true, lang:'Hindi, Gujarati' },
  ];

  const testimonials = [
    { name:'Priya S.', city:'Mumbai', text:'The kundali matching was incredibly accurate. We got married and couldn\'t be happier. The pandit explained everything so patiently.', rating:5 },
    { name:'Ravi K.', city:'Delhi', text:'I was skeptical, but the daily horoscope has been spot-on for 3 months straight. The AI insights genuinely help me plan my week.', rating:5 },
    { name:'Anita M.', city:'Bangalore', text:'Ordered a yellow sapphire — came with certification, properly energized. Fast delivery and great quality. Fully satisfied!', rating:5 },
  ];

  const blogPosts = [
    { tag:'Kundali', title:'What is Raj Yoga? Complete Guide to Powerful Planetary Combinations', date:'Apr 28, 2026', read:'6 min' },
    { tag:'Rashifal', title:'May 2026 Monthly Horoscope for All 12 Rashis — Detailed Predictions', date:'May 1, 2026', read:'12 min' },
    { tag:'Gemstones', title:'Which Gemstone Should You Wear? A Pandit\'s Guide to Ratna Shastra', date:'Apr 22, 2026', read:'8 min' },
  ];

  return (
    <div style={{ background:'#FFF9F0' }}>

      {/* ── HERO ── */}
      <section style={{
        background:'linear-gradient(135deg, #060D20 0%, #0D1B3E 55%, #1a0d38 100%)',
        padding:'80px 32px 64px', position:'relative', overflow:'hidden',
      }}>
        {/* Star field */}
        {[...Array(28)].map((_, i) => (
          <div key={i} style={{
            position:'absolute',
            width: i % 4 === 0 ? 2.5 : 1.5,
            height: i % 4 === 0 ? 2.5 : 1.5,
            borderRadius:'50%',
            background: i % 6 === 0 ? '#F5C842' : 'white',
            opacity: 0.2 + (i % 5) * 0.1,
            left:`${(i * 43 + 17) % 96}%`,
            top:`${(i * 29 + 9) % 92}%`,
            animation:`twinkle ${2 + (i % 3)}s ease-in-out infinite`,
            animationDelay:`${(i * 0.3) % 2}s`,
          }} />
        ))}

        {/* Decorative orbit ring */}
        <div style={{
          position:'absolute', right:'-80px', top:'50%', transform:'translateY(-50%)',
          width:520, height:520, borderRadius:'50%',
          border:'1px solid rgba(245,200,66,0.07)',
          pointerEvents:'none',
        }} />
        <div style={{
          position:'absolute', right:'-20px', top:'50%', transform:'translateY(-50%)',
          width:380, height:380, borderRadius:'50%',
          border:'1px solid rgba(245,200,66,0.1)',
          pointerEvents:'none',
        }} />

        <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center', position:'relative' }}>
          {/* Left */}
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(245,200,66,0.1)', border:'1px solid rgba(245,200,66,0.25)', borderRadius:999, padding:'5px 14px', marginBottom:24 }}>
              <span style={{ fontSize:12, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#F5C842' }}>✦ AI-Powered Vedic Astrology</span>
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize: tweaks?.heroSize || 54, fontWeight:800, color:'white', lineHeight:1.08, margin:'0 0 22px', letterSpacing:'-0.02em' }}>
              Discover What<br/>the Stars Hold<br/><span style={{ color:'#E8890C', fontStyle:'italic' }}>for You</span>
            </h1>
            <p style={{ fontSize:16, color:'rgba(253,246,236,0.65)', lineHeight:1.7, marginBottom:36, maxWidth:440, textWrap:'pretty' }}>
              Apna kundali dekho, daily rashifal paao aur India's best astropandits se baat karo — sab kuch ek jagah. Powered by AI.
            </p>
            <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:36 }}>
              <KBButton variant="primary" size="lg" onClick={() => onNavigate('kundali')}>
                Get Free Kundali
              </KBButton>
              <KBButton variant="ghost" size="lg" onClick={() => onNavigate('chat')}>
                Talk to Pandit →
              </KBButton>
            </div>
            {/* Social proof */}
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ display:'flex' }}>
                {['R','A','S','M','D'].map((l,i) => (
                  <div key={i} style={{ width:32, height:32, borderRadius:'50%', background:`hsl(${i*37+20},60%,45%)`, border:'2px solid #0D1B3E', marginLeft: i>0 ? -10 : 0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'white' }}>{l}</div>
                ))}
              </div>
              <div style={{ fontSize:12, color:'rgba(253,246,236,0.55)', lineHeight:1.5 }}>
                <strong style={{ color:'rgba(253,246,236,0.9)' }}>10 lakh+</strong> consultations done<br/>
                <span style={{ color:'#F5C842' }}>★★★★★</span> <span>4.8 rated on App Store</span>
              </div>
            </div>
          </div>

          {/* Right — Daily Horoscope widget */}
          <div style={{
            background:'rgba(13,27,62,0.6)',
            border:'1px solid rgba(245,200,66,0.2)',
            borderRadius:20, padding:24,
            backdropFilter:'blur(12px)',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#F5C842' }}>Today's Rashifal</div>
              <div style={{ fontSize:11, color:'rgba(253,246,236,0.4)' }}>Tap your rashi</div>
            </div>
            {/* Zodiac grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:8, marginBottom:18 }}>
              {zodiacSigns.map(z => (
                <div key={z.sym} onClick={() => { setActiveZodiac(z.sym); setHoroscopeShown(true); }} style={{
                  background: activeZodiac === z.sym ? 'rgba(232,137,12,0.25)' : 'rgba(253,246,236,0.05)',
                  border:`1px solid ${activeZodiac === z.sym ? 'rgba(232,137,12,0.6)' : 'rgba(245,200,66,0.12)'}`,
                  borderRadius:10, padding:'8px 2px', textAlign:'center', cursor:'pointer',
                  transition:'all 150ms',
                }}>
                  <div style={{ fontSize:18, lineHeight:1, color: activeZodiac === z.sym ? '#F5C842' : '#E8890C' }}>{z.sym}</div>
                  <div style={{ fontSize:9, color:'rgba(253,246,236,0.45)', marginTop:3, letterSpacing:'0.02em' }}>{z.name}</div>
                </div>
              ))}
            </div>

            {/* Reading */}
            <div style={{ background:'rgba(6,13,32,0.5)', borderRadius:12, padding:16, border:'1px solid rgba(245,200,66,0.1)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <span style={{ fontSize:24, color:'#F5C842' }}>{activeZodiac}</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:'white' }}>
                    {zodiacSigns.find(z => z.sym === activeZodiac)?.name} — {zodiacSigns.find(z => z.sym === activeZodiac)?.en}
                  </div>
                  <div style={{ fontSize:10, color:'rgba(253,246,236,0.4)' }}>Today · {new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</div>
                </div>
              </div>
              <p style={{ fontSize:12.5, color:'rgba(253,246,236,0.7)', lineHeight:1.65, margin:0 }}>
                {horoscopes[activeZodiac]}
              </p>
            </div>
            <div style={{ marginTop:14, textAlign:'center' }}>
              <span onClick={() => {}} style={{ fontSize:12, color:'#E8890C', fontWeight:600, cursor:'pointer' }}>
                View Full Weekly Rashifal →
              </span>
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* ── FEATURES GRID ── */}
      <section style={{ padding:'72px 32px', background:'#FFF9F0' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHeader label="Our Services" title="Everything Astrology, In One Place" subtitle="Free kundali to live pandits — all AI-powered, all in one platform." />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:22 }}>
            {features.map(f => (
              <div key={f.title} onClick={() => onNavigate(f.page)} style={{
                background:'white', borderRadius:16, padding:26,
                border:'1px solid #EDD9B8', boxShadow:'0 2px 8px rgba(13,27,62,0.05)',
                cursor:'pointer', transition:'all 220ms cubic-bezier(0.34,1.56,0.64,1)',
                position:'relative', overflow:'hidden',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 10px 30px rgba(13,27,62,0.13)'; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor='#E8890C'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='0 2px 8px rgba(13,27,62,0.05)'; e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='#EDD9B8'; }}
              >
                {f.badge && <div style={{ position:'absolute', top:16, right:16, background:'rgba(46,125,50,0.12)', color:'#2E7D32', padding:'2px 8px', borderRadius:999, fontSize:10, fontWeight:700 }}>{f.badge}</div>}
                <div style={{ width:52, height:52, background:'rgba(232,137,12,0.09)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, marginBottom:16 }}>{f.icon}</div>
                <div style={{ fontSize:16, fontWeight:700, color:'#1A0A00', marginBottom:6 }}>{f.title}</div>
                <div style={{ fontSize:13, color:'#6B4C2A', lineHeight:1.65, marginBottom:18 }}>{f.desc}</div>
                <span style={{ fontSize:13, fontWeight:600, color:'#E8890C', display:'flex', alignItems:'center', gap:4 }}>{f.cta} <span>→</span></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP ASTROLOGERS ── */}
      <section style={{ padding:'72px 32px', background:'linear-gradient(135deg,#060D20 0%,#0D1B3E 60%,#152855 100%)', position:'relative', overflow:'hidden' }}>
        {/* Background motif */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, rgba(245,200,66,0.04) 1px, transparent 1px)', backgroundSize:'32px 32px', pointerEvents:'none' }} />
        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative' }}>
          <SectionHeader light label="Our Pandits" title="Talk to India's Best Astrologers" subtitle="1200+ verified pandits online 24/7. First 3 minutes free on your first consultation." />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:18, marginBottom:32 }}>
            {astrologers.map(p => (
              <PanditCard key={p.id} p={p} onNavigate={onNavigate} onChat={() => onNavigate('chat')} />
            ))}
          </div>
          <div style={{ textAlign:'center' }}>
            <KBButton variant="ghost" onClick={() => onNavigate('chat')}>View All 1200+ Pandits →</KBButton>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding:'72px 32px', background:'#FFF9F0' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHeader label="How It Works" title="Consultation in 3 Simple Steps" subtitle="Start your spiritual journey in minutes — no waiting, no friction." />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:32 }}>
            {[
              { step:'01', icon:'🔍', title:'Choose a Pandit', desc:'Browse 1200+ verified astropandits by specialization, language & rating. Filter by availability.' },
              { step:'02', icon:'💬', title:'Start Free Chat', desc:'Your first 3 minutes are absolutely free. Ask about career, marriage, health or any life question.' },
              { step:'03', icon:'✨', title:'Get Guidance', desc:'Receive personalized astrological guidance with remedies, mantras and gemstone recommendations.' },
            ].map((s, i) => (
              <div key={s.step} style={{ position:'relative' }}>
                {i < 2 && <div style={{ position:'absolute', top:28, left:'calc(100% - 16px)', width:32, height:2, background:'linear-gradient(90deg,#E8890C,transparent)', zIndex:1 }} />}
                <div style={{ background:'white', borderRadius:16, padding:28, border:'1px solid #EDD9B8', boxShadow:'0 2px 8px rgba(13,27,62,0.05)', height:'100%' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                    <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#E8890C,#F5C842)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'#1A0A00', flexShrink:0 }}>{s.step}</div>
                    <div style={{ fontSize:28 }}>{s.icon}</div>
                  </div>
                  <div style={{ fontSize:17, fontWeight:700, color:'#0D1B3E', marginBottom:8 }}>{s.title}</div>
                  <div style={{ fontSize:13, color:'#6B4C2A', lineHeight:1.65 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:36 }}>
            <KBButton variant="primary" size="lg" onClick={() => onNavigate('chat')}>Start Free Consultation</KBButton>
          </div>
        </div>
      </section>

      {/* ── GEMSTONE TEASER ── */}
      <section style={{ padding:'72px 32px', background:'linear-gradient(135deg,#FDF6EC,#F5EDE0)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:56, alignItems:'center' }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'#E8890C', marginBottom:14 }}>✦ Certified & Energized</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:38, fontWeight:700, color:'#0D1B3E', lineHeight:1.2, margin:'0 0 16px' }}>Authentic Ratna &amp;<br/>Gemstone Shop</h2>
            <p style={{ fontSize:15, color:'#6B4C2A', lineHeight:1.7, marginBottom:28, textWrap:'pretty' }}>
              GIA/IGI certified gemstones, energized by our pandits during auspicious muhurat. From Pukhraj to Neelam — delivered to your doorstep.
            </p>
            <div style={{ display:'flex', gap:16, marginBottom:28 }}>
              {[['🔬','Lab Certified'],['🙏','Pandit Energized'],['🚚','Free Delivery'],['↩️','7-Day Return']].map(([i,l]) => (
                <div key={l} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:22, marginBottom:4 }}>{i}</div>
                  <div style={{ fontSize:11, fontWeight:600, color:'#6B4C2A', lineHeight:1.3 }}>{l}</div>
                </div>
              ))}
            </div>
            <KBButton variant="primary" onClick={() => onNavigate('shop')}>Browse Gemstone Shop →</KBButton>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {[
              { name:'Yellow Sapphire', planet:'Jupiter ♃', price:'₹4,999', color:'#F5C842', savings:'37%' },
              { name:'Blue Sapphire', planet:'Saturn ♄', price:'₹8,999', color:'#1565C0', savings:'40%' },
              { name:'Ruby (Manik)', planet:'Sun ☉', price:'₹6,499', color:'#8B1A1A', savings:'35%' },
              { name:'Emerald (Panna)', planet:'Mercury ☿', price:'₹5,499', color:'#2E7D32', savings:'35%' },
            ].map(g => (
              <div key={g.name} onClick={() => onNavigate('shop')} style={{
                background:'white', borderRadius:14, padding:18,
                border:'1px solid #EDD9B8', boxShadow:'0 2px 8px rgba(13,27,62,0.06)',
                cursor:'pointer', transition:'all 200ms',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(13,27,62,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 2px 8px rgba(13,27,62,0.06)'; }}
              >
                <div style={{ width:48, height:48, borderRadius:'50%', background:`radial-gradient(circle, ${g.color}55, ${g.color}18)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, marginBottom:10 }}>💎</div>
                <div style={{ fontSize:13, fontWeight:700, color:'#1A0A00', marginBottom:3 }}>{g.name}</div>
                <div style={{ fontSize:11, color:'#E8890C', fontWeight:500, marginBottom:8 }}>{g.planet}</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:15, fontWeight:800, color:'#1A0A00' }}>{g.price}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:'#2E7D32', background:'rgba(46,125,50,0.1)', padding:'1px 6px', borderRadius:999 }}>-{g.savings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding:'72px 32px', background:'#FFF9F0' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHeader label="Testimonials" title="Lakhs Trust Kundalibaba" subtitle="Real stories from real users across India." />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:22 }}>
            {testimonials.map(t => (
              <div key={t.name} style={{ background:'white', borderRadius:16, padding:28, border:'1px solid #EDD9B8', boxShadow:'0 2px 8px rgba(13,27,62,0.05)', position:'relative' }}>
                <div style={{ fontSize:48, color:'rgba(232,137,12,0.12)', fontFamily:"'Playfair Display',serif", lineHeight:1, marginBottom:-10, userSelect:'none' }}>"</div>
                <div style={{ color:'#F5C842', fontSize:14, marginBottom:12 }}>{'★'.repeat(t.rating)}</div>
                <p style={{ fontSize:14, color:'#6B4C2A', lineHeight:1.72, marginBottom:20, fontStyle:'italic' }}>{t.text}</p>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,#E8890C,#F5C842)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:700, color:'#1A0A00' }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#1A0A00' }}>{t.name}</div>
                    <div style={{ fontSize:11, color:'#A07850' }}>{t.city} · Verified User</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG / SEO SECTION ── */}
      <section style={{ padding:'72px 32px', background:'linear-gradient(135deg,#FDF6EC,#FFF9F0)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHeader label="Astrology Knowledge" title="Learn from Our Pandits" subtitle="Guides, predictions and deep dives — all free." />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:22 }}>
            {blogPosts.map(b => (
              <div key={b.title} style={{ background:'white', borderRadius:16, overflow:'hidden', border:'1px solid #EDD9B8', boxShadow:'0 2px 8px rgba(13,27,62,0.05)', cursor:'pointer', transition:'all 200ms' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(13,27,62,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 2px 8px rgba(13,27,62,0.05)'; }}
              >
                <div style={{ height:120, background:'linear-gradient(135deg,#0D1B3E,#152855)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, rgba(245,200,66,0.06) 1px, transparent 1px)', backgroundSize:'16px 16px' }} />
                  <span style={{ fontSize:40, color:'rgba(245,200,66,0.4)' }}>✦</span>
                </div>
                <div style={{ padding:20 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                    <span style={{ fontSize:10, fontWeight:700, color:'#E8890C', background:'rgba(232,137,12,0.1)', padding:'2px 8px', borderRadius:999, letterSpacing:'0.04em' }}>{b.tag}</span>
                    <span style={{ fontSize:10, color:'#A07850' }}>{b.read} read</span>
                  </div>
                  <div style={{ fontSize:14, fontWeight:600, color:'#1A0A00', lineHeight:1.5, marginBottom:10, textWrap:'pretty' }}>{b.title}</div>
                  <div style={{ fontSize:11, color:'#A07850' }}>{b.date}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:32 }}>
            <KBButton variant="ghostDark">Browse All Articles →</KBButton>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{
        padding:'64px 32px',
        background:'linear-gradient(135deg,#060D20 0%,#0D1B3E 50%,#8B1A1A 100%)',
        textAlign:'center', position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, rgba(245,200,66,0.05) 1px, transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} />
        <div style={{ maxWidth:640, margin:'0 auto', position:'relative' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'#F5C842', marginBottom:16 }}>✦ Start Your Journey</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:40, fontWeight:700, color:'white', lineHeight:1.2, margin:'0 0 16px' }}>
            Apna Bhavishya Jaano —<br/><span style={{ color:'#E8890C' }}>Aaj Hi</span>
          </h2>
          <p style={{ fontSize:15, color:'rgba(253,246,236,0.6)', marginBottom:32, lineHeight:1.7 }}>
            Join 10 lakh+ Indians who trust Kundalibaba for life's most important decisions.
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <KBButton variant="primary" size="lg" onClick={() => onNavigate('kundali')}>Get Free Kundali</KBButton>
            <KBButton variant="ghost" size="lg" onClick={() => onNavigate('chat')}>Talk to Pandit</KBButton>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}

Object.assign(window, { HomePage });
