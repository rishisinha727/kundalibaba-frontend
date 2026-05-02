// ============================================================
// KundaliBaba — KundaliPage (Free Kundali + Matching)
// ============================================================

function KundaliPage({ onNavigate, tweaks, initialSubPage, onShowAuth }) {
  const [subPage, setSubPage] = React.useState(initialSubPage || 'kundali'); // 'kundali' | 'matching'
  const [step, setStep] = React.useState('form');
  const [form, setForm] = React.useState({ name:'', day:'', month:'', year:'', hour:'', min:'', place:'', gender:'Male' });
  const [activeTab, setActiveTab] = React.useState('chart');
  const [loading, setLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState('');
  const [kundaliResult, setKundaliResult] = React.useState(null);

  // Matching state
  const [mStep, setMStep] = React.useState('form');
  const [boy, setBoy] = React.useState({ name:'', day:'', month:'', year:'', place:'' });
  const [girl, setGirl] = React.useState({ name:'', day:'', month:'', year:'', place:'' });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const inputBase = {
    height:44, padding:'0 14px',
    border:'1.5px solid #EDD9B8', borderRadius:8,
    background:'white', fontFamily:'inherit', fontSize:14,
    color:'#1A0A00', outline:'none', width:'100%', boxSizing:'border-box',
    transition:'border-color 150ms, box-shadow 150ms',
  };
  const focusIn = e => { e.target.style.borderColor='#E8890C'; e.target.style.boxShadow='0 0 0 3px rgba(232,137,12,0.12)'; };
  const focusOut = e => { e.target.style.borderColor='#EDD9B8'; e.target.style.boxShadow='none'; };
  const labelSt = { fontSize:13, fontWeight:600, color:'#1A0A00', marginBottom:5, display:'block' };

  // North Indian chart data
  const houses = [
    [0,0,12],[0,1,1],[0,2,2],[0,3,3],
    [1,0,11],[1,3,4],
    [2,0,10],[2,3,5],
    [3,0,9],[3,1,8],[3,2,7],[3,3,6],
  ];
  const planetMap = { 1:'Su Mo', 2:'Ma', 5:'Ju', 7:'Ve Me', 9:'Sa', 10:'Ra', 4:'Ke' };

  const gunas = [
    { name:'Varna', max:1, score:1, desc:'Spiritual compatibility' },
    { name:'Vashya', max:2, score:2, desc:'Mutual attraction & control' },
    { name:'Tara', max:3, score:2, desc:'Birth star compatibility' },
    { name:'Yoni', max:4, score:3, desc:'Physical compatibility' },
    { name:'Graha Maitri', max:5, score:4, desc:'Friendship of Rashis' },
    { name:'Gana', max:6, score:5, desc:'Temperament match' },
    { name:'Bhakoot', max:7, score:6, desc:'Love & emotions' },
    { name:'Nadi', max:8, score:6, desc:'Health & progeny' },
  ];
  const gunaTotal = gunas.reduce((s, g) => s + g.score, 0);
  const gunaMax = gunas.reduce((s, g) => s + g.max, 0);

  const keyPositions = [
    ['Lagna (Ascendant)', 'Simha (Leo) ♌'],
    ['Rashi (Moon Sign)', 'Mesh (Aries) ♈'],
    ['Nakshatra', 'Ashwini — Pada 2'],
    ['Sun Sign', 'Kanya (Virgo) ♍'],
    ['Active Yoga', 'Raj Yoga (10th house)'],
    ['Current Dasha', 'Jupiter — 2021–2037'],
  ];

  const dashaPeriods = [
    { planet:'Jupiter', symbol:'♃', start:'2021', end:'2037', active:true, color:'#F5C842' },
    { planet:'Saturn', symbol:'♄', start:'2037', end:'2056', active:false, color:'#6B4C2A' },
    { planet:'Mercury', symbol:'☿', start:'2056', end:'2073', active:false, color:'#2E7D32' },
    { planet:'Ketu', symbol:'☊', start:'2073', end:'2080', active:false, color:'#8B1A1A' },
  ];

  // ── Sub-nav tabs ──
  const SubNav = () => (
    <div style={{ background:'linear-gradient(135deg,#0D1B3E,#152855)', padding:'0 32px' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', gap:0 }}>
        {[['kundali','Free Kundali'],['matching','Kundali Matching']].map(([id,label]) => (
          <div key={id} onClick={() => { setSubPage(id); setStep('form'); setMStep('form'); }} style={{
            padding:'14px 24px', fontSize:14, fontWeight:600, cursor:'pointer',
            color: subPage === id ? '#F5C842' : 'rgba(253,246,236,0.55)',
            borderBottom: subPage === id ? '2.5px solid #E8890C' : '2.5px solid transparent',
            transition:'all 150ms',
          }}>{label}</div>
        ))}
      </div>
    </div>
  );

  // ── KUNDALI FORM ──
  if (subPage === 'kundali' && step === 'form') return (
    <div style={{ background:'#FFF9F0', minHeight:'100vh' }}>
      <div style={{ background:'linear-gradient(135deg,#0D1B3E,#152855)', padding:'40px 32px 0' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#F5C842', marginBottom:10 }}>✦ Vedic Astrology</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:42, fontWeight:700, color:'white', margin:'0 0 8px' }}>Free Kundali</h1>
          <p style={{ fontSize:15, color:'rgba(253,246,236,0.55)', margin:'0 0 0' }}>Generate your complete Janam Kundali — planetary positions, Dasha & AI predictions.</p>
        </div>
        <SubNav />
      </div>

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'48px 32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, alignItems:'start' }}>
          {/* Form card */}
          <div style={{ background:'white', borderRadius:18, padding:36, border:'1px solid #EDD9B8', boxShadow:'0 4px 20px rgba(13,27,62,0.08)' }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:'#0D1B3E', margin:'0 0 28px' }}>Enter Birth Details</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div>
                <label style={labelSt}>Full Name</label>
                <input style={inputBase} placeholder="e.g. Rahul Sharma" value={form.name} onChange={e => update('name', e.target.value)} onFocus={focusIn} onBlur={focusOut} />
              </div>
              <div>
                <label style={labelSt}>Date of Birth</label>
                <div style={{ display:'flex', gap:10 }}>
                  {[['day','DD',70],['month','MM',70],['year','YYYY',120]].map(([k,ph,w]) => (
                    <input key={k} style={{ ...inputBase, textAlign:'center', fontFamily:"'JetBrains Mono',monospace", maxWidth:w }} placeholder={ph} value={form[k]} onChange={e => update(k, e.target.value)} onFocus={focusIn} onBlur={focusOut} />
                  ))}
                </div>
              </div>
              <div>
                <label style={labelSt}>Birth Time <span style={{ fontWeight:400, color:'#A07850' }}>(24-hr)</span></label>
                <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                  <input style={{ ...inputBase, textAlign:'center', fontFamily:"'JetBrains Mono',monospace", maxWidth:80 }} placeholder="HH" value={form.hour} onChange={e => update('hour', e.target.value)} onFocus={focusIn} onBlur={focusOut} />
                  <span style={{ fontSize:20, color:'#A07850', fontWeight:700, flexShrink:0 }}>:</span>
                  <input style={{ ...inputBase, textAlign:'center', fontFamily:"'JetBrains Mono',monospace", maxWidth:80 }} placeholder="MM" value={form.min} onChange={e => update('min', e.target.value)} onFocus={focusIn} onBlur={focusOut} />
                  <span style={{ fontSize:12, color:'#A07850', marginLeft:4 }}>Don't know? We'll use noon</span>
                </div>
              </div>
              <div>
                <label style={labelSt}>Birth Place</label>
                <input style={inputBase} placeholder="e.g. New Delhi, India" value={form.place} onChange={e => update('place', e.target.value)} onFocus={focusIn} onBlur={focusOut} />
              </div>
              <div>
                <label style={labelSt}>Gender</label>
                <div style={{ display:'flex', gap:12 }}>
                  {['Male','Female','Other'].map(g => (
                    <label key={g} onClick={() => update('gender', g)} style={{
                      display:'flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:14,
                      padding:'8px 16px', borderRadius:8, border:'1.5px solid',
                      borderColor: form.gender === g ? '#E8890C' : '#EDD9B8',
                      background: form.gender === g ? 'rgba(232,137,12,0.07)' : 'white',
                      color: form.gender === g ? '#C4700A' : '#6B4C2A',
                      transition:'all 150ms',
                    }}>
                      <div style={{ width:14, height:14, borderRadius:'50%', border:'2px solid', borderColor: form.gender === g ? '#E8890C' : '#EDD9B8', background: form.gender === g ? '#E8890C' : 'transparent', transition:'all 150ms' }} />
                      {g}
                    </label>
                  ))}
                </div>
              </div>
              {apiError && <div style={{ fontSize:13, color:'#C62828', background:'rgba(198,40,40,0.07)', padding:'10px 14px', borderRadius:8 }}>{apiError}</div>}
              <KBButton variant="primary" size="lg" disabled={loading} onClick={async () => {
                if (!form.name || !form.day || !form.month || !form.year || !form.place) { setApiError('Please fill in all required fields'); return; }
                if (!Auth.isLoggedIn()) { onShowAuth(); return; }
                setLoading(true); setApiError('');
                try {
                  const { lat, lon } = await KBApi.geocode(form.place);
                  const dateOfBirth = `${form.year}-${String(form.month).padStart(2,'0')}-${String(form.day).padStart(2,'0')}`;
                  const hour = form.hour || '12'; const min = form.min || '00';
                  const timeOfBirth = `${String(hour).padStart(2,'0')}:${String(min).padStart(2,'0')}`;
                  const payload = {
                    name: form.name,
                    gender: form.gender.toUpperCase(),
                    dateOfBirth,
                    timeOfBirth,
                    placeOfBirth: form.place,
                    latitude: lat,
                    longitude: lon,
                    timezone: 'Asia/Kolkata',
                  };
                  const res = await KBApi.generateKundali(payload);
                  setKundaliResult(res.data);
                  setStep('result');
                } catch(e) {
                  setApiError(e.message);
                } finally {
                  setLoading(false);
                }
              }} style={{ width:'100%', justifyContent:'center', marginTop:8 }}>
                {loading ? '⏳ Generating...' : '✦ Generate Free Kundali'}
              </KBButton>
              <div style={{ textAlign:'center', fontSize:12, color:'#A07850' }}>Login required · Instant results · 100% free</div>
            </div>
          </div>

          {/* Right info panel */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div style={{ background:'linear-gradient(135deg,#0D1B3E,#152855)', borderRadius:16, padding:28, border:'1px solid rgba(245,200,66,0.18)' }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#F5C842', marginBottom:16 }}>What You'll Get</div>
              {[
                'Complete Janam Kundali (D1 chart)',
                'Lagna, Rashi & Nakshatra details',
                '9 Planet (Navagraha) positions',
                'Vimshottari Dasha periods',
                'Yogas & Doshas analysis',
                'Personalized AI predictions',
                'Gemstone & remedy suggestions',
              ].map(item => (
                <div key={item} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                  <div style={{ width:18, height:18, borderRadius:'50%', background:'rgba(46,125,50,0.9)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'white', flexShrink:0 }}>✓</div>
                  <span style={{ fontSize:13, color:'rgba(253,246,236,0.72)' }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Pandit upsell */}
            <div style={{ background:'rgba(232,137,12,0.07)', border:'1px solid rgba(232,137,12,0.2)', borderRadius:14, padding:22 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#C4700A', marginBottom:6 }}>💬 Want Expert Interpretation?</div>
              <div style={{ fontSize:13, color:'#6B4C2A', marginBottom:16, lineHeight:1.65 }}>Our pandits explain your kundali in detail. First 3 minutes are absolutely free.</div>
              <KBButton variant="primary" onClick={() => onNavigate('chat')}>Talk to Pandit Now</KBButton>
            </div>

            {/* SEO keyword snippets */}
            <div style={{ background:'white', borderRadius:14, padding:20, border:'1px solid #EDD9B8' }}>
              <div style={{ fontSize:12, fontWeight:600, color:'#A07850', marginBottom:12, textTransform:'uppercase', letterSpacing:'0.08em' }}>Popular Searches</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {['Free kundali online','Janam kundali in Hindi','Kundali by name','Kundali with prediction','Lal Kitab kundali','Navamsa chart'].map(kw => (
                  <span key={kw} style={{ fontSize:11, color:'#6B4C2A', background:'#F5EDE0', padding:'4px 10px', borderRadius:999, cursor:'pointer', border:'1px solid #EDD9B8' }}>{kw}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── KUNDALI RESULT ──
  if (subPage === 'kundali' && step === 'result') return (
    <div style={{ background:'#FFF9F0', minHeight:'100vh' }}>
      <div style={{ background:'linear-gradient(135deg,#0D1B3E,#152855)', padding:'40px 32px 0' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', paddingBottom:0 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#F5C842', marginBottom:8 }}>✦ Your Kundali</div>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:700, color:'white', margin:'0 0 6px' }}>{kundaliResult?.name || form.name || 'Your'} Kundali</h1>
              <div style={{ fontSize:13, color:'rgba(253,246,236,0.5)' }}>
                {kundaliResult?.dateOfBirth || [form.day, form.month, form.year].filter(Boolean).join('/')} · {kundaliResult?.timeOfBirth || [form.hour, form.min].filter(Boolean).join(':')} · {kundaliResult?.placeOfBirth || form.place}
              </div>
            </div>
            <button onClick={() => setStep('form')} style={{ padding:'8px 18px', border:'1.5px solid rgba(245,200,66,0.25)', borderRadius:8, background:'transparent', color:'rgba(253,246,236,0.7)', fontSize:13, cursor:'pointer', fontFamily:'inherit', marginTop:8 }}>← Edit Details</button>
          </div>
        </div>
        <SubNav />
      </div>

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'36px 32px' }}>
        {/* Tabs */}
        <div style={{ display:'flex', gap:2, marginBottom:28, background:'white', padding:4, borderRadius:10, width:'fit-content', border:'1px solid #EDD9B8' }}>
          {[['chart','Birth Chart'],['planets','Planets'],['dasha','Dasha'],['predictions','Predictions']].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{
              padding:'8px 20px', border:'none', borderRadius:8, fontFamily:'inherit',
              fontSize:13, fontWeight:600, cursor:'pointer',
              background: activeTab === id ? '#0D1B3E' : 'transparent',
              color: activeTab === id ? 'white' : '#6B4C2A',
              transition:'all 150ms',
            }}>{label}</button>
          ))}
        </div>

        {/* CHART TAB */}
        {activeTab === 'chart' && (
          <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:32, alignItems:'start' }}>
            {/* North Indian chart */}
            <div style={{ background:'white', borderRadius:16, padding:20, border:'1.5px solid rgba(245,200,66,0.35)', boxShadow:'0 4px 20px rgba(13,27,62,0.1)' }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#A07850', marginBottom:14, textAlign:'center' }}>North Indian Birth Chart</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,82px)', gridTemplateRows:'repeat(4,82px)', position:'relative' }}>
                {houses.map(([row, col, num]) => (
                  <div key={num} style={{
                    gridColumn: col + 1, gridRow: row + 1,
                    border:'1px solid rgba(245,200,66,0.3)',
                    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                    background: num === 1 ? 'rgba(232,137,12,0.07)' : 'white',
                    position:'relative',
                  }}>
                    <div style={{ fontSize:9, color:'#A07850', position:'absolute', top:4, left:6, fontFamily:"'JetBrains Mono',monospace" }}>{num}</div>
                    <div style={{ fontSize:11, fontWeight:700, color:'#0D1B3E', textAlign:'center', lineHeight:1.4 }}>{planetMap[num] || ''}</div>
                  </div>
                ))}
                {/* Center diamond */}
                <div style={{
                  gridColumn:'2/4', gridRow:'2/4',
                  border:'1px solid rgba(245,200,66,0.3)',
                  background:'linear-gradient(135deg,rgba(13,27,62,0.04),rgba(245,200,66,0.06))',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  clipPath:'polygon(50% 0%,100% 50%,50% 100%,0% 50%)',
                }}>
                  <span style={{ fontSize:16, color:'#E8890C', fontFamily:"'Playfair Display',serif", fontWeight:700 }}>KB</span>
                </div>
              </div>
              {/* Planet legend */}
              <div style={{ marginTop:16, display:'flex', flexWrap:'wrap', gap:6, justifyContent:'center' }}>
                {[['Su','Sun'],['Mo','Moon'],['Ma','Mars'],['Me','Mercury'],['Ju','Jupiter'],['Ve','Venus'],['Sa','Saturn'],['Ra','Rahu'],['Ke','Ketu']].map(([abbr, full]) => (
                  <span key={abbr} style={{ fontSize:10, color:'#6B4C2A', background:'#F5EDE0', padding:'2px 7px', borderRadius:999 }} title={full}>{abbr}</span>
                ))}
              </div>
            </div>

            {/* Right: key positions + AI */}
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div style={{ background:'white', borderRadius:14, padding:24, border:'1px solid #EDD9B8', boxShadow:'0 2px 8px rgba(13,27,62,0.06)' }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#0D1B3E', marginBottom:18 }}>Key Positions</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {keyPositions.map(([l, v]) => (
                    <div key={l} style={{ padding:'10px 14px', background:'#FFF9F0', borderRadius:8, border:'1px solid #EDD9B8' }}>
                      <div style={{ fontSize:10, color:'#A07850', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:3 }}>{l}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:'#1A0A00' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background:'linear-gradient(135deg,#0D1B3E,#152855)', borderRadius:14, padding:24, border:'1px solid rgba(245,200,66,0.18)' }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#F5C842', marginBottom:12 }}>✦ AI Prediction</div>
                <p style={{ fontSize:13, color:'rgba(253,246,236,0.72)', lineHeight:1.72, margin:'0 0 18px' }}>
                  With Leo rising and Jupiter as your current Dasha lord, 2024–2026 brings significant career growth and recognition. A Raj Yoga in the 10th house indicates leadership opportunities. Marriage prospects are favorable from mid-2025. Wear Yellow Sapphire for Jupiter's blessings.
                </p>
                <KBButton variant="gold" onClick={() => onNavigate('chat')}>Talk to Pandit for Details</KBButton>
              </div>

              <div style={{ display:'flex', gap:12 }}>
                <button style={{ flex:1, padding:'10px 0', border:'1.5px solid #EDD9B8', borderRadius:8, background:'white', color:'#6B4C2A', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>📄 Download PDF</button>
                <button style={{ flex:1, padding:'10px 0', border:'1.5px solid #EDD9B8', borderRadius:8, background:'white', color:'#6B4C2A', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>🔗 Share Kundali</button>
              </div>
            </div>
          </div>
        )}

        {/* PLANETS TAB */}
        {activeTab === 'planets' && (
          <div style={{ background:'white', borderRadius:16, padding:28, border:'1px solid #EDD9B8', boxShadow:'0 2px 8px rgba(13,27,62,0.06)' }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:'#0D1B3E', marginBottom:22 }}>Planetary Positions</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
              {[
                { planet:'Sun', symbol:'☉', rashi:'Kanya', house:'2nd', deg:'22°34\'', status:'Neutral' },
                { planet:'Moon', symbol:'☽', rashi:'Mesh', house:'1st', deg:'14°12\'', status:'Strong' },
                { planet:'Mars', symbol:'♂', rashi:'Vrishabh', house:'2nd', deg:'08°45\'', status:'Neutral' },
                { planet:'Mercury', symbol:'☿', rashi:'Kanya', house:'2nd', deg:'18°20\'', status:'Exalted' },
                { planet:'Jupiter', symbol:'♃', rashi:'Simha', house:'1st', deg:'29°10\'', status:'Strong' },
                { planet:'Venus', symbol:'♀', rashi:'Tula', house:'3rd', deg:'05°33\'', status:'Own Sign' },
                { planet:'Saturn', symbol:'♄', rashi:'Makar', house:'9th', deg:'11°58\'', status:'Exalted' },
                { planet:'Rahu', symbol:'☊', rashi:'Mithun', house:'10th', deg:'14°22\'', status:'Neutral' },
                { planet:'Ketu', symbol:'☋', rashi:'Dhanu', house:'4th', deg:'14°22\'', status:'Neutral' },
              ].map(p => (
                <div key={p.planet} style={{ background:'#FFF9F0', borderRadius:12, padding:16, border:'1px solid #EDD9B8' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontSize:20, color:'#E8890C' }}>{p.symbol}</span>
                      <span style={{ fontSize:14, fontWeight:700, color:'#1A0A00' }}>{p.planet}</span>
                    </div>
                    <span style={{ fontSize:10, fontWeight:700, color: p.status === 'Exalted' || p.status === 'Strong' ? '#2E7D32' : '#A07850', background: p.status === 'Exalted' || p.status === 'Strong' ? 'rgba(46,125,50,0.1)' : '#F5EDE0', padding:'2px 8px', borderRadius:999 }}>{p.status}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <div>
                      <div style={{ fontSize:10, color:'#A07850', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:2 }}>Rashi</div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#1A0A00' }}>{p.rashi}</div>
                    </div>
                    <div>
                      <div style={{ fontSize:10, color:'#A07850', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:2 }}>House</div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#1A0A00' }}>{p.house}</div>
                    </div>
                    <div>
                      <div style={{ fontSize:10, color:'#A07850', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:2 }}>Degree</div>
                      <div style={{ fontSize:12, fontWeight:600, color:'#1A0A00', fontFamily:"'JetBrains Mono',monospace" }}>{p.deg}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DASHA TAB */}
        {activeTab === 'dasha' && (
          <div style={{ background:'white', borderRadius:16, padding:28, border:'1px solid #EDD9B8', boxShadow:'0 2px 8px rgba(13,27,62,0.06)' }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:'#0D1B3E', marginBottom:22 }}>Vimshottari Dasha Periods</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {dashaPeriods.map(d => (
                <div key={d.planet} style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 20px', borderRadius:12, background: d.active ? 'linear-gradient(135deg,#0D1B3E,#152855)' : '#FFF9F0', border: d.active ? '1px solid rgba(245,200,66,0.3)' : '1px solid #EDD9B8', transition:'all 150ms' }}>
                  <span style={{ fontSize:24, color: d.active ? '#F5C842' : d.color }}>{d.symbol}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:700, color: d.active ? 'white' : '#1A0A00', marginBottom:2 }}>{d.planet} Mahadasha</div>
                    <div style={{ fontSize:12, color: d.active ? 'rgba(253,246,236,0.5)' : '#A07850' }}>{d.start} – {d.end}</div>
                  </div>
                  {d.active && <span style={{ fontSize:10, fontWeight:700, color:'#69f0ae', background:'rgba(46,125,50,0.2)', padding:'3px 10px', borderRadius:999 }}>Active Now</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PREDICTIONS TAB */}
        {activeTab === 'predictions' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            {[
              { area:'Career', icon:'💼', color:'#1565C0', text:'Jupiter in Lagna and its favorable dasha indicate strong career growth from 2024–2026. Promotion or new role likely before end of 2025. Government jobs and management roles are highlighted.' },
              { area:'Marriage', icon:'💑', color:'#8B1A1A', text:'7th house lord Venus in own sign Tula is very favorable for marriage. Partnership opportunities are strong. Auspicious muhurat for marriage in late 2025 or early 2026.' },
              { area:'Finance', icon:'💰', color:'#2E7D32', text:'Mercury\'s exaltation in 2nd house (house of wealth) indicates financial growth through intelligence and communication. Avoid speculation. Mutual funds favored.' },
              { area:'Health', icon:'🏥', color:'#E8890C', text:'Sun in Kanya (6th from Moon) indicates digestive system needs attention. Regular yoga and Surya Namaskar recommended. Overall health is satisfactory during Jupiter period.' },
            ].map(p => (
              <div key={p.area} style={{ background:'white', borderRadius:14, padding:24, border:'1px solid #EDD9B8', boxShadow:'0 2px 8px rgba(13,27,62,0.06)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:`${p.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{p.icon}</div>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#0D1B3E' }}>{p.area}</span>
                </div>
                <p style={{ fontSize:13, color:'#6B4C2A', lineHeight:1.72, margin:0 }}>{p.text}</p>
              </div>
            ))}
            <div style={{ gridColumn:'1/-1', textAlign:'center', paddingTop:8 }}>
              <KBButton variant="primary" size="lg" onClick={() => onNavigate('chat')}>Get Detailed Reading from a Pandit</KBButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── MATCHING FORM ──
  if (subPage === 'matching' && mStep === 'form') return (
    <div style={{ background:'#FFF9F0', minHeight:'100vh' }}>
      <div style={{ background:'linear-gradient(135deg,#0D1B3E,#152855)', padding:'40px 32px 0' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#F5C842', marginBottom:10 }}>✦ 36-Gun Milan</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:42, fontWeight:700, color:'white', margin:'0 0 8px' }}>Kundali Matching</h1>
          <p style={{ fontSize:15, color:'rgba(253,246,236,0.55)', margin:0 }}>AI-powered Ashta Koota Milan for marriage compatibility analysis.</p>
        </div>
        <SubNav />
      </div>
      <div style={{ maxWidth:900, margin:'0 auto', padding:'48px 32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:28 }}>
          {[['Boy / Groom', boy, setBoy, '♂', '#152855'], ['Girl / Bride', girl, setGirl, '♀', '#8B1A1A']].map(([title, data, setData, sym, accent]) => (
            <div key={title} style={{ background:'white', borderRadius:18, padding:28, border:'1px solid #EDD9B8', boxShadow:'0 4px 16px rgba(13,27,62,0.07)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background:`${accent}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, color:accent }}>{sym}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:'#0D1B3E', margin:0 }}>{title}</h3>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div>
                  <label style={labelSt}>Full Name</label>
                  <input style={inputBase} placeholder="Enter full name" value={data.name} onChange={e => setData(d => ({ ...d, name:e.target.value }))} onFocus={focusIn} onBlur={focusOut} />
                </div>
                <div>
                  <label style={labelSt}>Date of Birth</label>
                  <div style={{ display:'flex', gap:8 }}>
                    {[['day','DD',60],['month','MM',60],['year','YYYY',90]].map(([k,ph,w]) => (
                      <input key={k} style={{ ...inputBase, textAlign:'center', fontFamily:"'JetBrains Mono',monospace", maxWidth:w }} placeholder={ph} value={data[k]} onChange={e => setData(d => ({ ...d, [k]:e.target.value }))} onFocus={focusIn} onBlur={focusOut} />
                    ))}
                  </div>
                </div>
                <div>
                  <label style={labelSt}>Birth Place</label>
                  <input style={inputBase} placeholder="City, State" value={data.place} onChange={e => setData(d => ({ ...d, place:e.target.value }))} onFocus={focusIn} onBlur={focusOut} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign:'center' }}>
          <KBButton variant="primary" size="lg" onClick={() => setMStep('result')} style={{ minWidth:280, justifyContent:'center' }}>
            💑 Check Compatibility
          </KBButton>
          <div style={{ fontSize:12, color:'#A07850', marginTop:10 }}>Free analysis · Instant results · No registration required</div>
        </div>
      </div>
    </div>
  );

  // ── MATCHING RESULT ──
  return (
    <div style={{ background:'#FFF9F0', minHeight:'100vh' }}>
      <div style={{ background:'linear-gradient(135deg,#0D1B3E,#152855)', padding:'40px 32px 0' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#F5C842', marginBottom:10 }}>✦ Compatibility Report</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:700, color:'white', margin:'0 0 4px' }}>Kundali Matching Report</h1>
          <p style={{ fontSize:14, color:'rgba(253,246,236,0.5)', margin:0 }}>{boy.name || 'Boy'} &amp; {girl.name || 'Girl'}</p>
        </div>
        <SubNav />
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'40px 32px' }}>
        {/* Score card */}
        <div style={{ background:'linear-gradient(135deg,#060D20,#0D1B3E)', borderRadius:20, padding:36, marginBottom:28, border:'1px solid rgba(245,200,66,0.2)', textAlign:'center' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'#F5C842', marginBottom:18 }}>Ashta Koota Score</div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:32, marginBottom:24 }}>
            {[[boy.name || 'Groom', '♂','rgba(21,40,85,0.6)'], [girl.name || 'Bride', '♀', 'rgba(139,26,26,0.5)']].map(([name, sym, bg], i) => (
              <React.Fragment key={name}>
                <div style={{ textAlign:'center' }}>
                  <div style={{ width:56, height:56, borderRadius:'50%', background:bg, border:'2px solid rgba(245,200,66,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:700, color:'#FDF6EC', margin:'0 auto 8px' }}>{sym}</div>
                  <div style={{ fontSize:13, color:'rgba(253,246,236,0.65)', maxWidth:100 }}>{name}</div>
                </div>
                {i === 0 && <div style={{ fontSize:32, color:'rgba(245,200,66,0.4)' }}>💑</div>}
              </React.Fragment>
            ))}
          </div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:72, fontWeight:800, color:'#F5C842', lineHeight:1 }}>{gunaTotal}</div>
          <div style={{ fontSize:18, color:'rgba(253,246,236,0.5)', marginBottom:14 }}>out of {gunaMax} Gunas</div>
          <div style={{ display:'inline-block', background:'rgba(46,125,50,0.15)', border:'1px solid rgba(46,125,50,0.35)', borderRadius:999, padding:'7px 22px', fontSize:14, fontWeight:700, color:'#69f0ae' }}>✓ Highly Compatible Match</div>
        </div>

        {/* Guna breakdown */}
        <div style={{ background:'white', borderRadius:16, padding:28, border:'1px solid #EDD9B8', marginBottom:24, boxShadow:'0 2px 8px rgba(13,27,62,0.06)' }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:'#0D1B3E', marginBottom:22 }}>Ashta Koota Milan</div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {gunas.map(g => (
              <div key={g.name} style={{ display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ minWidth:120, fontSize:13, fontWeight:600, color:'#1A0A00' }}>{g.name}</div>
                <div style={{ flex:1, height:8, background:'#F5EDE0', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${(g.score / g.max) * 100}%`, background:'linear-gradient(90deg,#E8890C,#F5C842)', borderRadius:4, transition:'width 600ms ease' }} />
                </div>
                <div style={{ minWidth:48, fontSize:13, fontWeight:700, color:'#1A0A00', textAlign:'right', fontFamily:"'JetBrains Mono',monospace" }}>{g.score}/{g.max}</div>
                <div style={{ minWidth:180, fontSize:11, color:'#A07850' }}>{g.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', gap:14 }}>
          <KBButton variant="primary" onClick={() => onNavigate('chat')} style={{ flex:1, justifyContent:'center' }}>💬 Consult a Pandit</KBButton>
          <KBButton variant="secondary" onClick={() => setMStep('form')} style={{ flex:1, justifyContent:'center' }}>← Try Another Match</KBButton>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { KundaliPage });
