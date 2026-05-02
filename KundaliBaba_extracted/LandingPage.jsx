// ============================================================
// KundaliBaba — LandingPage (High-Converting)
// Agent 3 + Agent 4 implementation
// ============================================================

function LandingPage({ onNavigate }) {
  const [openFaq, setOpenFaq] = React.useState(null);
  const [activeBenefit, setActiveBenefit] = React.useState('career');

  const heroInputSt = {
    height:46, padding:'0 16px',
    background:'rgba(253,246,236,0.07)',
    border:'1.5px solid rgba(245,200,66,0.2)',
    borderRadius:10, color:'white',
    fontFamily:'inherit', fontSize:14,
    outline:'none', width:'100%',
    boxSizing:'border-box',
    transition:'border-color 150ms',
  };

  // ── Data ────────────────────────────────────────────────

  const painPoints = [
    { icon:'🧭', title:'Career Confusion',      pain:'Should I switch jobs? Is this the right field? When will I get recognized?',   color:'#1565C0' },
    { icon:'💍', title:'Marriage Uncertainty',  pain:'Is this the right match? When will I find my partner? Will this last?',        color:'#8B1A1A' },
    { icon:'📉', title:'Financial Stress',      pain:'Why is money not flowing? When will things improve? Is this investment safe?', color:'#2E7D32' },
    { icon:'😔', title:'Life Feels Blocked',    pain:'Why does everything feel stuck? What am I doing wrong? When does it get better?', color:'#E8890C' },
  ];

  const steps = [
    { step:'01', icon:'📍', color:'#E8890C', title:'Enter Birth Details',  desc:'Name, date, time and place of birth. No birth time? We use noon and our pandits can rectify it.', note:'Takes 30 seconds' },
    { step:'02', icon:'⚡', color:'#F5C842', title:'Get Instant Kundali',   desc:'Our AI generates your complete birth chart — planetary positions, Dasha, Nakshatra, yogas and doshas.', note:'Instant results' },
    { step:'03', icon:'🔮', color:'#1565C0', title:'Unlock Deep Insights',  desc:'Read your AI predictions or connect with a verified pandit for a personal session. First 3 minutes are free.', note:'Start for free' },
  ];

  const benefits = {
    career: {
      icon:'💼', title:'Career & Success',
      tagline:'Know your power windows — act at the right time, not in the dark.',
      insights:[
        'Peak career growth: June 2025 – March 2027 (Jupiter in 10th house)',
        'Best-aligned sectors: Technology, Finance, Administration',
        'Current Dasha: Jupiter Mahadasha — expansion, leadership ahead',
        'Best timing for job change: October–November 2025',
      ],
      cta:'Get Career Reading',
    },
    marriage: {
      icon:'💑', title:'Love & Marriage',
      tagline:'Find clarity on compatibility, timing, and who truly complements your chart.',
      insights:[
        '7th house lord Venus in Libra — natural partnership energy',
        'Most compatible rashis: Tula, Meen, Kark',
        'Auspicious marriage muhurat: November 2025 – February 2026',
        'Recommended minimum for kundali matching: 29 out of 36 gunas',
      ],
      cta:'Check Compatibility',
    },
    finance: {
      icon:'💰', title:'Finance & Wealth',
      tagline:'Understand your wealth yoga, lucky periods, and risks to avoid.',
      insights:[
        'Dhana Yoga active in your 2nd and 11th houses',
        'Favorable investment periods: Q1 and Q3 of 2026',
        'Risk periods to avoid: March–April 2026 (Saturn retrograde)',
        'Best investment types for your chart: Mutual funds and real estate',
      ],
      cta:'Get Financial Insight',
    },
    health: {
      icon:'🏥', title:'Health & Wellbeing',
      tagline:'Proactive awareness based on your planetary placements.',
      insights:[
        'Sun in 6th house — digestive system needs attention',
        'Recommended practice: Surya Namaskar and warm diet',
        'Sensitive period: June–July 2025 (Rahu transit)',
        'Protective ratna: Red Coral strengthens energy and immunity',
      ],
      cta:'Get Health Reading',
    },
  };

  const pandits = [
    { id:1, init:'R', name:'Pt. Rajesh Kumar',  spec:'Vedic · Kundali · Vastu',      exp:12, rating:4.8, reviews:1240, rate:18, online:true,          lang:'Hindi, English',           queue:0 },
    { id:2, init:'A', name:'Acharya Vikram',     spec:'KP · Nadi · Lal Kitab',        exp:18, rating:4.9, reviews:3200, rate:25, online:true, featured:true, lang:'Hindi, English, Marathi', queue:2 },
    { id:3, init:'S', name:'Pt. Sunita Devi',    spec:'Numerology · Tarot',           exp:8,  rating:4.6, reviews:850,  rate:12, online:false, busy:true, lang:'Hindi, Tamil',             queue:1 },
    { id:4, init:'M', name:'Pt. Mahesh Joshi',   spec:'Vedic · Marriage',             exp:15, rating:4.7, reviews:2100, rate:20, online:true,           lang:'Hindi, Gujarati',          queue:0 },
  ];

  const testimonials = [
    { name:'Priya S.',  city:'Mumbai',    useCase:'Marriage Guidance',  text:'I was confused about a rishta proposal for months. One session with Pt. Rajesh and I had complete clarity. The kundali matching was eerily accurate. We got married in January — best decision ever.', rating:5, icon:'P', color:'#E8890C' },
    { name:'Ravi K.',   city:'Delhi',     useCase:'Career Timing',      text:'Was about to quit my job out of frustration. Acharya Vikram told me to wait 3 months — Jupiter transit was approaching. I waited. Got promoted. Doubled my salary. Completely floored.', rating:5, icon:'R', color:'#1565C0' },
    { name:'Anita M.',  city:'Bangalore', useCase:'Financial Clarity',  text:'Skeptic turned believer. The pandit told me to avoid a property investment in March. My colleague ignored similar advice. The deal fell through. Mine did not.', rating:5, icon:'A', color:'#2E7D32' },
    { name:'Suresh P.', city:'Chennai',   useCase:'Health Guidance',    text:'Free kundali itself gave me more insight than I expected. The AI predictions flagged my 6th house issues — I got a checkup and caught something early. Genuinely grateful.', rating:5, icon:'S', color:'#8B1A1A' },
  ];

  const faqs = [
    { q:'Is astrology actually accurate?',
      a:'Vedic astrology is a 5,000-year-old system based on precise astronomical positions at the exact moment of your birth. Unlike sun-sign horoscopes, your Kundali is unique to you — calculated using date, time, and place. Our pandits carry an average 4.8 rating across 10 lakh+ consultations.' },
    { q:'What if I do not know my exact birth time?',
      a:'We use noon as a default if birth time is unknown. Sun sign, Moon sign, and most planetary positions remain accurate. For Ascendant and house-based predictions, our pandits offer birth time rectification during consultation.' },
    { q:'Is the free Kundali complete or just a teaser?',
      a:'The free Kundali includes your complete D1 birth chart, all 9 planetary positions, Nakshatra, active Dasha period, and an AI summary of key life areas. It is genuinely complete. Pandit consultation is optional — never forced.' },
    { q:'How do I choose the right pandit?',
      a:'Filter by specialization (Vedic, KP, Numerology), language, experience, and rating. Every pandit is verified, background-checked, and rated by real users. Read their reviews before connecting.' },
    { q:'Is my birth data kept private?',
      a:'Absolutely. Your birth details are encrypted and never shared with third parties. We use bank-grade SSL and our privacy policy guarantees no data sale — ever.' },
    { q:'Are the gemstones genuine and certified?',
      a:'Every gemstone is GIA or IGI certified, sourced from verified vendors, and energized by our pandits during an auspicious muhurat. We offer 7-day returns and free delivery above Rs. 999.' },
  ];

  const bData = benefits[activeBenefit];

  // ── Render ──────────────────────────────────────────────

  return (
    <div style={{ background:'#FFF9F0' }}>

      {/* ── HERO ── */}
      <section style={{ background:'linear-gradient(135deg,#060D20 0%,#0D1B3E 55%,#1a0d38 100%)', padding:'88px 32px 80px', position:'relative', overflow:'hidden' }}>
        {[...Array(32)].map((_,i) => (
          <div key={i} style={{ position:'absolute', width:i%4===0?2.5:1.5, height:i%4===0?2.5:1.5, borderRadius:'50%', background:i%6===0?'#F5C842':'white', opacity:0.12+(i%5)*0.08, left:`${(i*43+17)%96}%`, top:`${(i*29+9)%92}%`, animation:`twinkle ${2+(i%3)}s ease-in-out infinite`, animationDelay:`${(i*0.3)%2}s`, pointerEvents:'none' }} />
        ))}
        <div style={{ position:'absolute', right:'-60px', top:'50%', transform:'translateY(-50%)', width:480, height:480, borderRadius:'50%', border:'1px solid rgba(245,200,66,0.06)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', right:'20px', top:'50%', transform:'translateY(-50%)', width:320, height:320, borderRadius:'50%', border:'1px solid rgba(245,200,66,0.09)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(245,200,66,0.1)', border:'1px solid rgba(245,200,66,0.25)', borderRadius:999, padding:'5px 16px', marginBottom:28 }}>
            <span style={{ fontSize:12, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#F5C842' }}>✦ Free Birth Chart · Trusted by 10L+ Indians</span>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 400px', gap:72, alignItems:'center' }}>
            {/* Left copy */}
            <div>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:56, fontWeight:800, color:'white', lineHeight:1.08, margin:'0 0 22px', letterSpacing:'-0.02em' }}>
                The Answers You've Been Seeking —<br/>
                <span style={{ color:'#E8890C', fontStyle:'italic' }}>Hidden in Your Birth Chart</span>
              </h1>
              <p style={{ fontSize:17, color:'rgba(253,246,236,0.65)', lineHeight:1.72, marginBottom:36, maxWidth:480 }}>
                Get your free personalized Kundali and discover what the stars hold for your career, love life, and financial future. 1 crore+ Indians already have.
              </p>
              <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:40 }}>
                <KBButton variant="primary" size="lg" onClick={() => onNavigate('kundali')}>Get My Free Kundali →</KBButton>
                <KBButton variant="ghost" size="lg" onClick={() => onNavigate('chat')}>Talk to a Pandit</KBButton>
              </div>
              {/* Social proof strip */}
              <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ display:'flex' }}>
                  {['P','R','A','S','M','D','K'].map((l,i) => (
                    <div key={i} style={{ width:34, height:34, borderRadius:'50%', background:`hsl(${i*47+15},65%,42%)`, border:'2px solid #0D1B3E', marginLeft:i>0?-10:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'white', flexShrink:0 }}>{l}</div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:'rgba(253,246,236,0.9)', marginBottom:2 }}>
                    <span style={{ color:'#F5C842' }}>★★★★★</span>{' '}4.8 · 10L+ consultations
                  </div>
                  <div style={{ fontSize:12, color:'rgba(253,246,236,0.45)' }}>Rated India's #1 astrology platform · App Store &amp; Play</div>
                </div>
              </div>
            </div>

            {/* Right: quick-entry form */}
            <div style={{ background:'rgba(13,27,62,0.7)', border:'1px solid rgba(245,200,66,0.22)', borderRadius:22, padding:30, backdropFilter:'blur(16px)' }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#F5C842', marginBottom:6 }}>✦ Start Your Free Reading</div>
              <div style={{ fontSize:20, fontFamily:"'Playfair Display',serif", fontWeight:700, color:'white', marginBottom:22 }}>Your Kundali in 60 Seconds</div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                <input placeholder="Your full name" style={heroInputSt}
                  onFocus={e => e.target.style.borderColor='rgba(232,137,12,0.6)'}
                  onBlur={e => e.target.style.borderColor='rgba(245,200,66,0.2)'}
                />
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                  {['DD','MM','YYYY'].map(ph => (
                    <input key={ph} placeholder={ph} style={{ ...heroInputSt, textAlign:'center' }}
                      onFocus={e => e.target.style.borderColor='rgba(232,137,12,0.6)'}
                      onBlur={e => e.target.style.borderColor='rgba(245,200,66,0.2)'}
                    />
                  ))}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {['HH (hour)','MM (min)'].map(ph => (
                    <input key={ph} placeholder={ph} style={{ ...heroInputSt, textAlign:'center' }}
                      onFocus={e => e.target.style.borderColor='rgba(232,137,12,0.6)'}
                      onBlur={e => e.target.style.borderColor='rgba(245,200,66,0.2)'}
                    />
                  ))}
                </div>
                <input placeholder="Birth city (e.g. New Delhi, India)" style={heroInputSt}
                  onFocus={e => e.target.style.borderColor='rgba(232,137,12,0.6)'}
                  onBlur={e => e.target.style.borderColor='rgba(245,200,66,0.2)'}
                />
                <button onClick={() => onNavigate('kundali')} style={{ width:'100%', padding:'13px 0', background:'linear-gradient(135deg,#E8890C,#F5A83C)', border:'none', borderRadius:12, color:'white', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 6px 20px rgba(232,137,12,0.45)', transition:'all 150ms' }}
                  onMouseEnter={e => { e.currentTarget.style.filter='brightness(1.08)'; e.currentTarget.style.transform='translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.filter=''; e.currentTarget.style.transform=''; }}
                >✦ Generate My Free Kundali</button>
                <div style={{ textAlign:'center', fontSize:11, color:'rgba(253,246,236,0.4)' }}>No registration · No payment · 100% free forever</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* ── PAIN POINTS ── */}
      <section style={{ padding:'80px 32px', background:'#FFF9F0' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'#E8890C', marginBottom:12 }}>✦ You Are Not Alone</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:40, fontWeight:700, color:'#0D1B3E', margin:'0 0 16px', lineHeight:1.2 }}>
              Life's Biggest Questions Deserve Real Answers
            </h2>
            <p style={{ fontSize:16, color:'#6B4C2A', maxWidth:560, margin:'0 auto', lineHeight:1.72 }}>
              Most of us turn to friends, search engines, or gut feeling — and still feel uncertain. Your birth chart holds answers nobody else can give you.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:52 }}>
            {painPoints.map(item => (
              <div key={item.title} style={{ background:'white', borderRadius:18, padding:28, border:'1px solid #EDD9B8', boxShadow:'0 2px 12px rgba(13,27,62,0.06)', transition:'all 220ms cubic-bezier(0.34,1.56,0.64,1)' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='0 14px 36px rgba(13,27,62,0.12)'; e.currentTarget.style.borderColor=item.color+'55'; }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 2px 12px rgba(13,27,62,0.06)'; e.currentTarget.style.borderColor='#EDD9B8'; }}
              >
                <div style={{ fontSize:36, marginBottom:14 }}>{item.icon}</div>
                <div style={{ fontSize:16, fontWeight:700, color:'#1A0A00', marginBottom:10 }}>{item.title}</div>
                <div style={{ fontSize:13, color:'#6B4C2A', lineHeight:1.7, fontStyle:'italic' }}>{item.pain}</div>
              </div>
            ))}
          </div>
          {/* Bridge banner */}
          <div style={{ background:'linear-gradient(135deg,#0D1B3E,#152855)', borderRadius:20, padding:'44px 52px', border:'1px solid rgba(245,200,66,0.15)', textAlign:'center' }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, color:'white', marginBottom:14, lineHeight:1.4 }}>
              What if the universe has already mapped out your path — and you just need to read the map?
            </div>
            <p style={{ fontSize:15, color:'rgba(253,246,236,0.6)', marginBottom:28, lineHeight:1.75, maxWidth:560, margin:'0 auto 28px' }}>
              Your Kundali is not fortune-telling. It is a precise astronomical blueprint calculated for the exact second you were born. No two charts are identical.
            </p>
            <KBButton variant="primary" size="lg" onClick={() => onNavigate('kundali')}>See What Your Chart Reveals →</KBButton>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding:'80px 32px', background:'linear-gradient(135deg,#FDF6EC,#F5EDE0)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHeader label="Simple Process" title="Your Reading in 3 Steps" subtitle="No complicated forms. No waiting. Your free Kundali in under 60 seconds." />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:28 }}>
            {steps.map((s,i) => (
              <div key={s.step} style={{ position:'relative' }}>
                {i < 2 && <div style={{ position:'absolute', top:44, left:'calc(100% - 14px)', width:28, height:2, background:'linear-gradient(90deg,#E8890C,transparent)', zIndex:1 }} />}
                <div style={{ background:'white', borderRadius:20, padding:32, border:'1px solid #EDD9B8', boxShadow:'0 4px 16px rgba(13,27,62,0.07)', height:'100%' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
                    <div style={{ width:52, height:52, borderRadius:14, background:`linear-gradient(135deg,${s.color},${s.color}aa)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{s.icon}</div>
                    <div style={{ fontSize:11, fontWeight:800, letterSpacing:'0.08em', color:'#A07850' }}>STEP {s.step}</div>
                  </div>
                  <div style={{ fontSize:18, fontWeight:700, color:'#0D1B3E', marginBottom:10 }}>{s.title}</div>
                  <div style={{ fontSize:13.5, color:'#6B4C2A', lineHeight:1.7, marginBottom:16 }}>{s.desc}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:'#2E7D32', background:'rgba(46,125,50,0.1)', display:'inline-block', padding:'3px 10px', borderRadius:999 }}>✓ {s.note}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:40 }}>
            <KBButton variant="primary" size="lg" onClick={() => onNavigate('kundali')}>Start Now — It's Free</KBButton>
          </div>
        </div>
      </section>

      {/* ── BENEFITS TABBED PREVIEW ── */}
      <section style={{ padding:'80px 32px', background:'#FFF9F0' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHeader label="What You'll Discover" title="Real Insights, Not Generic Predictions" subtitle="Every insight is derived from your unique planetary positions — not a shared sun-sign template." />
          {/* Tabs */}
          <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:36, flexWrap:'wrap' }}>
            {Object.entries(benefits).map(([key, b]) => (
              <button key={key} onClick={() => setActiveBenefit(key)} style={{ padding:'10px 24px', border:'2px solid', borderRadius:999, fontFamily:'inherit', fontSize:14, fontWeight:600, cursor:'pointer', transition:'all 150ms', borderColor:activeBenefit===key?'#E8890C':'#EDD9B8', background:activeBenefit===key?'#E8890C':'white', color:activeBenefit===key?'white':'#6B4C2A' }}>
                {b.icon} {b.title}
              </button>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, alignItems:'center' }}>
            {/* Left: preview card */}
            <div style={{ background:'linear-gradient(135deg,#0D1B3E,#152855)', borderRadius:20, padding:36, border:'1px solid rgba(245,200,66,0.2)' }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#F5C842', marginBottom:10 }}>✦ Sample Insight Preview</div>
              <div style={{ fontSize:22, fontFamily:"'Playfair Display',serif", fontWeight:700, color:'white', marginBottom:10 }}>{bData.title}</div>
              <div style={{ fontSize:14, color:'rgba(253,246,236,0.55)', marginBottom:24, fontStyle:'italic', lineHeight:1.6 }}>{bData.tagline}</div>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {bData.insights.map((ins,i) => (
                  <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                    <div style={{ width:20, height:20, borderRadius:'50%', background:'rgba(245,200,66,0.15)', border:'1px solid rgba(245,200,66,0.35)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#F5C842', flexShrink:0, marginTop:2 }}>✦</div>
                    <div style={{ fontSize:13, color:'rgba(253,246,236,0.75)', lineHeight:1.65 }}>{ins}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:24, padding:'12px 16px', background:'rgba(232,137,12,0.08)', border:'1px solid rgba(232,137,12,0.2)', borderRadius:10, fontSize:11.5, color:'rgba(253,246,236,0.5)', display:'flex', gap:8, alignItems:'center' }}>
                <span>🔒</span> Your full reading is personalized to your exact birth chart — these are illustrative examples only.
              </div>
            </div>
            {/* Right: value prop */}
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div style={{ fontSize:32, fontFamily:"'Playfair Display',serif", fontWeight:700, color:'#0D1B3E', lineHeight:1.25 }}>Stop guessing.<br/>Start knowing.</div>
              <div style={{ fontSize:15, color:'#6B4C2A', lineHeight:1.78 }}>
                Unlike daily horoscopes that apply to millions born in the same month, your Kundali is calculated to the exact second and latitude of your birth. It is the most personalized guidance system in existence.
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[
                  'Derived from 5,000 years of Vedic wisdom',
                  'Calculated with modern astronomical precision',
                  'Interpreted by verified expert pandits',
                  'AI-powered to surface what matters most to you',
                ].map(p => (
                  <div key={p} style={{ display:'flex', gap:10, alignItems:'center' }}>
                    <div style={{ width:22, height:22, borderRadius:'50%', background:'rgba(46,125,50,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'#2E7D32', flexShrink:0, fontWeight:700 }}>✓</div>
                    <span style={{ fontSize:14, color:'#1A0A00' }}>{p}</span>
                  </div>
                ))}
              </div>
              <div>
                <KBButton variant="primary" onClick={() => onNavigate('kundali')}>{bData.cta} →</KBButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOP PANDITS ── */}
      <section style={{ padding:'80px 32px', background:'linear-gradient(135deg,#060D20 0%,#0D1B3E 60%,#152855 100%)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, rgba(245,200,66,0.04) 1px, transparent 1px)', backgroundSize:'32px 32px', pointerEvents:'none' }} />
        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative' }}>
          <SectionHeader light label="Verified Experts" title="India's Best Astrologers, On-Demand" subtitle="1,200+ background-checked pandits available 24/7. First 3 minutes absolutely free on your first consultation." />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:18, marginBottom:36 }}>
            {pandits.map(p => (
              <PanditCard key={p.id} p={p} onNavigate={onNavigate} onChat={() => onNavigate('chat')} />
            ))}
          </div>
          <div style={{ textAlign:'center', display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <KBButton variant="primary" onClick={() => onNavigate('chat')}>View All 1,200+ Pandits</KBButton>
            <KBButton variant="ghost" onClick={() => onNavigate('chat')}>Start Free Consultation</KBButton>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding:'80px 32px', background:'#FFF9F0' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHeader label="Real Stories" title="What Our Users Say" subtitle="Not actors. Not scripts. Real experiences from real Indians who found clarity through KundaliBaba." />
          {/* Aggregate stats */}
          <div style={{ display:'flex', justifyContent:'center', gap:52, marginBottom:44, flexWrap:'wrap' }}>
            {[['4.8','★ Average Rating'],['10L+','Consultations Done'],['98%','Satisfaction Rate'],['1200+','Verified Pandits']].map(([val,label]) => (
              <div key={label} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:800, color:'#E8890C', lineHeight:1 }}>{val}</div>
                <div style={{ fontSize:12, color:'#A07850', marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:18 }}>
            {testimonials.map(t => (
              <div key={t.name} style={{ background:'white', borderRadius:18, padding:26, border:'1px solid #EDD9B8', boxShadow:'0 2px 10px rgba(13,27,62,0.06)', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:12, right:18, fontSize:54, color:'rgba(232,137,12,0.08)', fontFamily:"'Playfair Display',serif", lineHeight:1, userSelect:'none' }}>"</div>
                <div style={{ display:'flex', gap:2, marginBottom:4 }}>
                  {[...Array(t.rating)].map((_,i) => <span key={i} style={{ color:'#F5C842', fontSize:13 }}>★</span>)}
                </div>
                <div style={{ fontSize:10, fontWeight:700, color:'#E8890C', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:12 }}>{t.useCase}</div>
                <p style={{ fontSize:13, color:'#6B4C2A', lineHeight:1.72, marginBottom:20, fontStyle:'italic' }}>{t.text}</p>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg,${t.color},${t.color}aa)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'white', flexShrink:0 }}>{t.icon}</div>
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

      {/* ── FAQ ── */}
      <section style={{ padding:'80px 32px', background:'linear-gradient(135deg,#FDF6EC,#FFF9F0)' }}>
        <div style={{ maxWidth:760, margin:'0 auto' }}>
          <SectionHeader label="Got Questions?" title="Frequently Asked Questions" subtitle="Honest answers for curious and skeptical minds alike." />
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {faqs.map((faq,i) => (
              <div key={i} style={{ background:'white', borderRadius:14, border:'1px solid', borderColor:openFaq===i?'#E8890C':'#EDD9B8', overflow:'hidden', transition:'border-color 200ms', boxShadow:'0 2px 8px rgba(13,27,62,0.05)' }}>
                <button onClick={() => setOpenFaq(openFaq===i ? null : i)} style={{ width:'100%', padding:'18px 22px', display:'flex', justifyContent:'space-between', alignItems:'center', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', textAlign:'left', gap:16 }}>
                  <span style={{ fontSize:15, fontWeight:600, color:'#1A0A00', lineHeight:1.4 }}>{faq.q}</span>
                  <span style={{ fontSize:20, color:'#E8890C', flexShrink:0, transition:'transform 200ms', transform:openFaq===i?'rotate(45deg)':'none' }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding:'0 22px 20px' }}>
                    <div style={{ paddingTop:14, borderTop:'1px solid #EDD9B8', fontSize:14, color:'#6B4C2A', lineHeight:1.78 }}>{faq.a}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding:'88px 32px', background:'linear-gradient(135deg,#060D20 0%,#0D1B3E 50%,#8B1A1A 100%)', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, rgba(245,200,66,0.05) 1px, transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} />
        <div style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(232,137,12,0.07),transparent 70%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:640, margin:'0 auto', position:'relative' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'#F5C842', marginBottom:20 }}>✦ Your Future Awaits</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:44, fontWeight:800, color:'white', lineHeight:1.15, margin:'0 0 18px', letterSpacing:'-0.01em' }}>
            Your future doesn't have to feel uncertain.
          </h2>
          <p style={{ fontSize:16, color:'rgba(253,246,236,0.6)', marginBottom:14, lineHeight:1.75 }}>
            Join 1 crore+ Indians who trust KundaliBaba for life's most important decisions — career, marriage, finance, and health.
          </p>
          <p style={{ fontSize:13, color:'rgba(253,246,236,0.38)', marginBottom:40 }}>
            Start with your free Kundali — no registration, no payment, no commitment.
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <KBButton variant="primary" size="lg" onClick={() => onNavigate('kundali')}>Get My Free Kundali</KBButton>
            <KBButton variant="ghost" size="lg" onClick={() => onNavigate('chat')}>Talk to a Pandit Now</KBButton>
          </div>
          <div style={{ marginTop:30, fontSize:16, color:'rgba(245,200,66,0.35)', letterSpacing:'0.12em' }}>
            ♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓
          </div>
        </div>
      </section>

      <style>{`
        @keyframes twinkle {
          0%,100% { opacity:0.12; transform:scale(1); }
          50% { opacity:0.7; transform:scale(1.5); }
        }
        .hero-input::placeholder { color: rgba(253,246,236,0.35); }
      `}</style>
    </div>
  );
}

Object.assign(window, { LandingPage });
