// ============================================================
// KundaliBaba — ChatPage (Astrologer Listing + Live Chat)
// ============================================================

function ChatPage({ onNavigate, tweaks }) {
  const [view, setView] = React.useState('list');
  const [selectedId, setSelectedId] = React.useState(null);
  const [messages, setMessages] = React.useState([
    { from:'pandit', text:'Namaste 🙏 I am Pt. Rajesh Kumar. How can I help you today?', time:'2:31 PM' },
    { from:'user', text:'I want to know about my career prospects for 2026.', time:'2:32 PM' },
    { from:'pandit', text:'Please share your date, time and place of birth. I will check your Dasha periods and upcoming transits for detailed career guidance.', time:'2:32 PM' },
  ]);
  const [input, setInput] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const [balance] = React.useState(120);
  const [freeTime, setFreeTime] = React.useState(180); // seconds
  const [timerActive, setTimerActive] = React.useState(false);
  const [typing, setTyping] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const messagesEndRef = React.useRef(null);

  const pandits = [
    { id:1, init:'R', name:'Pt. Rajesh Kumar', spec:'Vedic · Kundali · Vastu', exp:12, rating:4.8, reviews:1240, rate:18, online:true, lang:'Hindi, English', queue:0, about:'15+ years of experience in Vedic astrology and Vastu Shastra. Expert in birth chart analysis and career guidance.' },
    { id:2, init:'A', name:'Acharya Vikram', spec:'KP · Nadi · Lal Kitab', exp:18, rating:4.9, reviews:3200, rate:25, online:true, lang:'Hindi, English, Marathi', queue:2, featured:true, about:'18 years experience. Specialist in KP astrology and Nadi predictions. Ranked #1 on our platform.' },
    { id:3, init:'S', name:'Pt. Sunita Devi', spec:'Numerology · Tarot', exp:8, rating:4.6, reviews:850, rate:12, online:false, busy:true, lang:'Hindi, Tamil', queue:1, about:'Expert numerologist and tarot reader. Specializes in name correction and relationship guidance.' },
    { id:4, init:'M', name:'Pt. Mahesh Joshi', spec:'Vedic · Marriage', exp:15, rating:4.7, reviews:2100, rate:20, online:true, lang:'Hindi, Gujarati', queue:0, about:'Marriage and relationship specialist. 15 years experience with thousands of successful kundali matchings.' },
    { id:5, init:'D', name:'Pt. Deepak Shastri', spec:'Palmistry · Face Reading', exp:10, rating:4.5, reviews:620, rate:10, online:true, lang:'Hindi', queue:0, about:'Expert in Samudrik Shastra — palm and face reading. Provides unique insights not available through horoscope.' },
    { id:6, init:'N', name:'Pt. Neha Trivedi', spec:'Vedic · Remedies', exp:6, rating:4.7, reviews:430, rate:8, online:true, lang:'Hindi, English', queue:0, about:'Specializes in astrological remedies — mantras, gemstones, puja vidhi. Affordable rates for all budgets.' },
  ];

  const filters = ['all', 'online', 'vedic', 'numerology', 'top rated', 'low price'];

  const filteredPandits = pandits.filter(p => {
    const matchSearch = search === '' || p.name.toLowerCase().includes(search.toLowerCase()) || p.spec.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === 'online') return p.online && !p.busy;
    if (filter === 'vedic') return p.spec.toLowerCase().includes('vedic');
    if (filter === 'numerology') return p.spec.toLowerCase().includes('numerology');
    if (filter === 'top rated') return p.rating >= 4.7;
    if (filter === 'low price') return p.rate <= 12;
    return true;
  });

  const selectedPandit = pandits.find(p => p.id === selectedId);

  React.useEffect(() => {
    if (messagesEndRef.current && view === 'chat') {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages, view]);

  React.useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setFreeTime(t => {
        if (t <= 1) { clearInterval(interval); setTimerActive(false); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = secs => `${Math.floor(secs/60)}:${String(secs%60).padStart(2,'0')}`;

  const panditResponses = [
    'I can see from your birth chart that Jupiter is transiting your 10th house, which is very favorable for career growth in 2026.',
    'According to your Vimshottari Dasha, you are currently in Jupiter period which brings expansion and opportunities.',
    'I would recommend wearing a Yellow Sapphire to enhance Jupiter\'s positive influence on your career and finances.',
    'The period between June–October 2026 is particularly auspicious for career transitions and promotions.',
    'For best results, chant the Guru Beej Mantra: "Om Gram Greem Graum Sah Guruve Namah" 108 times every Thursday.',
  ];
  let responseIdx = 0;

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = { from:'user', text:input, time:new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }) };
    setMessages(m => [...m, newMsg]);
    setInput('');
    setTyping(true);
    if (!timerActive && freeTime > 0) setTimerActive(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, {
        from:'pandit',
        text: panditResponses[responseIdx % panditResponses.length],
        time: new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
      }]);
      responseIdx++;
    }, 1500 + Math.random() * 800);
  };

  // ── CHAT VIEW ──
  if (view === 'chat' && selectedPandit) {
    const p = selectedPandit;
    return (
      <div style={{ background:'#FFF9F0', height:'calc(100vh - 64px)', display:'flex', flexDirection:'column' }}>
        {/* Chat header */}
        <div style={{ background:'#0D1B3E', padding:'0 24px', height:64, display:'flex', alignItems:'center', gap:14, borderBottom:'1px solid rgba(245,200,66,0.12)', flexShrink:0 }}>
          <button onClick={() => setView('list')} style={{ background:'none', border:'none', color:'rgba(253,246,236,0.65)', fontSize:18, cursor:'pointer', padding:'4px 8px', transition:'color 150ms' }}
            onMouseEnter={e => e.target.style.color='white'} onMouseLeave={e => e.target.style.color='rgba(253,246,236,0.65)'}
          >←</button>
          <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#E8890C,#F5C842)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, color:'#1A0A00', fontFamily:"'Playfair Display',serif" }}>{p.init}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:700, color:'white' }}>{p.name}</div>
            <div style={{ fontSize:11, color:'#69f0ae', display:'flex', alignItems:'center', gap:4 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'#69f0ae' }} />
              Online · {p.spec}
            </div>
          </div>
          <div style={{ textAlign:'right', marginRight:8 }}>
            <div style={{ fontSize:10, color:'rgba(253,246,236,0.4)' }}>Wallet Balance</div>
            <div style={{ fontSize:14, fontWeight:700, color:'#F5C842' }}>₹{balance}</div>
          </div>
          <button style={{ padding:'6px 14px', background:'rgba(46,125,50,0.2)', border:'1px solid rgba(46,125,50,0.35)', borderRadius:8, color:'#69f0ae', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>+ Add Money</button>
          <div style={{ display:'flex', gap:8 }}>
            {['📞','📹'].map(icon => (
              <button key={icon} style={{ width:36, height:36, borderRadius:8, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'white', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 150ms' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(232,137,12,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.07)'}
              >{icon}</button>
            ))}
          </div>
        </div>

        {/* Free minutes banner */}
        <div style={{
          background: freeTime > 0 ? 'rgba(46,125,50,0.1)' : 'rgba(232,137,12,0.1)',
          borderBottom: `1px solid ${freeTime > 0 ? 'rgba(46,125,50,0.2)' : 'rgba(232,137,12,0.25)'}`,
          padding:'7px 24px', display:'flex', alignItems:'center', justifyContent:'center', gap:8, flexShrink:0,
        }}>
          {freeTime > 0 ? (
            <span style={{ fontSize:12, color:'#2E7D32', fontWeight:700 }}>
              ✓ FREE — {formatTime(freeTime)} remaining · Chat at no cost
            </span>
          ) : (
            <span style={{ fontSize:12, color:'#C4700A', fontWeight:700 }}>
              ₹{p.rate}/min · Charged from wallet balance
            </span>
          )}
        </div>

        {/* Messages area */}
        <div ref={messagesEndRef} style={{ flex:1, overflowY:'auto', padding:'20px 24px', display:'flex', flexDirection:'column', gap:14 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display:'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start', gap:10, alignItems:'flex-end' }}>
              {msg.from === 'pandit' && (
                <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#E8890C,#F5C842)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#1A0A00', flexShrink:0, fontFamily:"'Playfair Display',serif" }}>{p.init}</div>
              )}
              <div style={{
                maxWidth:'68%', padding:'11px 15px',
                borderRadius: msg.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.from === 'user' ? '#E8890C' : 'white',
                color: msg.from === 'user' ? 'white' : '#1A0A00',
                fontSize:13.5, lineHeight:1.62,
                boxShadow:'0 2px 8px rgba(13,27,62,0.08)',
                border: msg.from === 'pandit' ? '1px solid #EDD9B8' : 'none',
              }}>
                {msg.text}
                <div style={{ fontSize:10, marginTop:5, textAlign:'right', opacity:0.55 }}>{msg.time}</div>
              </div>
            </div>
          ))}
          {typing && (
            <div style={{ display:'flex', justifyContent:'flex-start', gap:10, alignItems:'flex-end' }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#E8890C,#F5C842)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#1A0A00', flexShrink:0, fontFamily:"'Playfair Display',serif" }}>{p.init}</div>
              <div style={{ padding:'11px 18px', borderRadius:'18px 18px 18px 4px', background:'white', border:'1px solid #EDD9B8', display:'flex', gap:4, alignItems:'center' }}>
                {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#A07850', animation:'bounce 1.2s ease infinite', animationDelay:`${i*0.2}s` }} />)}
              </div>
            </div>
          )}
        </div>

        {/* Quick replies */}
        <div style={{ padding:'0 24px 10px', display:'flex', gap:8, flexWrap:'wrap', flexShrink:0 }}>
          {['Share birth details','Ask about marriage','Career in 2026','Lucky remedies','Gemstone advice'].map(q => (
            <button key={q} onClick={() => setInput(q)} style={{
              padding:'5px 13px', border:'1.5px solid #EDD9B8', borderRadius:999,
              background:'white', color:'#6B4C2A', fontSize:12, cursor:'pointer', fontFamily:'inherit',
              transition:'all 150ms',
            }}
              onMouseEnter={e => { e.target.style.borderColor='#E8890C'; e.target.style.color='#E8890C'; }}
              onMouseLeave={e => { e.target.style.borderColor='#EDD9B8'; e.target.style.color='#6B4C2A'; }}
            >{q}</button>
          ))}
        </div>

        {/* Input bar */}
        <div style={{ padding:'10px 24px 18px', background:'white', borderTop:'1px solid #EDD9B8', display:'flex', gap:10, alignItems:'center', flexShrink:0 }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Type your message… (Enter to send)"
            style={{ flex:1, height:44, padding:'0 16px', border:'1.5px solid #EDD9B8', borderRadius:999, background:'#FFF9F0', fontFamily:'inherit', fontSize:14, outline:'none', transition:'border-color 150ms' }}
            onFocus={e => e.target.style.borderColor='#E8890C'}
            onBlur={e => e.target.style.borderColor='#EDD9B8'}
          />
          <button onClick={sendMessage} style={{
            width:44, height:44, borderRadius:'50%', background:'#E8890C', border:'none',
            display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
            fontSize:18, color:'white', flexShrink:0, boxShadow:'0 3px 10px rgba(232,137,12,0.35)',
            transition:'all 150ms',
          }}
            onMouseEnter={e => e.currentTarget.style.filter='brightness(1.1)'}
            onMouseLeave={e => e.currentTarget.style.filter=''}
          >→</button>
        </div>

        <style>{`
          @keyframes bounce {
            0%,80%,100% { transform: translateY(0); }
            40% { transform: translateY(-6px); }
          }
        `}</style>
      </div>
    );
  }

  // ── LIST VIEW ──
  return (
    <div style={{ background:'#FFF9F0', minHeight:'100vh' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#060D20 0%,#0D1B3E 60%,#152855 100%)', padding:'48px 32px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#F5C842', marginBottom:10 }}>✦ 1200+ Verified Pandits</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:44, fontWeight:700, color:'white', margin:'0 0 10px' }}>Talk to a Pandit</h2>
          <p style={{ fontSize:15, color:'rgba(253,246,236,0.58)', margin:'0 0 28px', maxWidth:520 }}>
            Chat or video call with expert astrologers 24/7. First 3 minutes free on your first consultation.
          </p>
          {/* Search */}
          <div style={{ position:'relative', maxWidth:460 }}>
            <span style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'rgba(253,246,236,0.35)', fontSize:16 }}>⌕</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or specialization…"
              style={{ width:'100%', height:48, paddingLeft:46, paddingRight:16, border:'1.5px solid rgba(245,200,66,0.2)', borderRadius:999, background:'rgba(253,246,236,0.07)', color:'white', fontFamily:'inherit', fontSize:14, outline:'none', boxSizing:'border-box', transition:'border-color 150ms' }}
              onFocus={e => e.target.style.borderColor='rgba(232,137,12,0.5)'}
              onBlur={e => e.target.style.borderColor='rgba(245,200,66,0.2)'}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'32px' }}>
        {/* Filters */}
        <div style={{ display:'flex', gap:8, marginBottom:28, flexWrap:'wrap' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:'7px 18px', border:'1.5px solid', borderRadius:999,
              fontFamily:'inherit', fontSize:13, fontWeight:500, cursor:'pointer',
              borderColor: filter === f ? '#E8890C' : '#EDD9B8',
              background: filter === f ? 'rgba(232,137,12,0.07)' : 'white',
              color: filter === f ? '#C4700A' : '#6B4C2A',
              textTransform:'capitalize', transition:'all 150ms',
            }}>{f}</button>
          ))}
          <div style={{ marginLeft:'auto', fontSize:12, color:'#A07850', alignSelf:'center' }}>
            {filteredPandits.length} pandits available
          </div>
        </div>

        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
          {filteredPandits.map(p => (
            <div key={p.id} style={{
              background: p.featured ? 'linear-gradient(135deg,#0D1B3E,#152855)' : 'white',
              border: p.featured ? '1px solid rgba(245,200,66,0.28)' : '1px solid #EDD9B8',
              borderRadius:16,
              boxShadow: p.featured ? '0 0 24px rgba(232,137,12,0.18)' : '0 2px 8px rgba(13,27,62,0.06)',
              transition:'all 220ms cubic-bezier(0.34,1.56,0.64,1)',
              overflow:'hidden',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=p.featured?'0 12px 32px rgba(232,137,12,0.28)':'0 10px 28px rgba(13,27,62,0.13)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=p.featured?'0 0 24px rgba(232,137,12,0.18)':'0 2px 8px rgba(13,27,62,0.06)'; }}
            >
              <div style={{ padding:'20px 20px 0', display:'flex', gap:14 }}>
                <div style={{ position:'relative', flexShrink:0 }}>
                  <div style={{ width:56, height:56, borderRadius:'50%', background: p.featured ? 'linear-gradient(135deg,#E8890C,#F5C842)' : 'rgba(232,137,12,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:700, color: p.featured ? '#1A0A00' : '#FDF6EC', border: p.featured ? '2px solid rgba(245,200,66,0.5)' : '2px solid rgba(232,137,12,0.3)', fontFamily:"'Playfair Display',serif" }}>{p.init}</div>
                  <div style={{ position:'absolute', bottom:1, right:1, width:13, height:13, borderRadius:'50%', background: p.busy ? '#F57F17' : p.online ? '#2E7D32' : '#8B8B8B', border:'2px solid', borderColor: p.featured ? '#0D1B3E' : 'white' }} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:6 }}>
                    <div style={{ fontSize:15, fontWeight:700, color: p.featured ? 'white' : '#1A0A00' }}>{p.name}</div>
                    {p.featured && <span style={{ background:'linear-gradient(135deg,#E8890C,#F5C842)', color:'#1A0A00', fontSize:9, fontWeight:800, padding:'2px 7px', borderRadius:999, letterSpacing:'0.06em', flexShrink:0 }}>✦ TOP</span>}
                  </div>
                  <div style={{ fontSize:12, color: p.featured ? '#F5C842' : '#E8890C', fontWeight:500, marginTop:2 }}>{p.spec}</div>
                  <div style={{ fontSize:11, color: p.featured ? 'rgba(253,246,236,0.45)' : '#A07850', marginTop:2 }}>{p.lang} · {p.exp} yrs exp</div>
                </div>
              </div>

              {/* About */}
              <div style={{ padding:'10px 20px', fontSize:12, color: p.featured ? 'rgba(253,246,236,0.55)' : '#6B4C2A', lineHeight:1.6 }}>
                {p.about}
              </div>

              <div style={{ padding:'10px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid', borderBottom:'1px solid', borderColor: p.featured ? 'rgba(245,200,66,0.1)' : '#F5EDE0' }}>
                <StarRating rating={p.rating} count={p.reviews > 999 ? `${(p.reviews/1000).toFixed(1)}k` : p.reviews} />
                <div style={{ fontSize:11, color: p.featured ? 'rgba(253,246,236,0.5)' : '#A07850' }}>
                  {p.queue > 0 ? `${p.queue} waiting` : 'No wait'}
                </div>
              </div>

              <div style={{ padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                <div>
                  <span style={{ fontSize:18, fontWeight:800, color: p.featured ? '#E8890C' : '#1A0A00' }}>₹{p.rate}</span>
                  <span style={{ fontSize:11, color: p.featured ? 'rgba(253,246,236,0.4)' : '#A07850' }}>/min</span>
                  <div style={{ fontSize:11, fontWeight:700, color:'#2E7D32', marginTop:1 }}>3 min free</div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button style={{ padding:'8px 14px', background:'transparent', border:'1.5px solid', borderColor: p.featured ? 'rgba(245,200,66,0.3)' : '#EDD9B8', borderRadius:8, color: p.featured ? 'rgba(253,246,236,0.7)' : '#6B4C2A', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all 150ms' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='#E8890C'; e.currentTarget.style.color='#E8890C'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor=p.featured?'rgba(245,200,66,0.3)':'#EDD9B8'; e.currentTarget.style.color=p.featured?'rgba(253,246,236,0.7)':'#6B4C2A'; }}
                  >📞 Call</button>
                  <button onClick={() => { setSelectedId(p.id); setView('chat'); setMessages([{ from:'pandit', text:`Namaste 🙏 I am ${p.name}. How can I help you today?`, time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) }]); }} style={{
                    padding:'8px 18px',
                    background: p.busy ? '#EDD9B8' : p.featured ? 'linear-gradient(135deg,#E8890C,#F5C842)' : '#E8890C',
                    border:'none', borderRadius:8,
                    color: p.featured ? '#1A0A00' : p.busy ? '#A07850' : 'white',
                    fontSize:13, fontWeight:700, cursor: p.busy ? 'default' : 'pointer', fontFamily:'inherit',
                    transition:'all 150ms',
                    boxShadow: !p.busy ? '0 3px 10px rgba(232,137,12,0.3)' : 'none',
                  }}>
                    {p.busy ? '⏳ Busy' : '💬 Chat'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recharge CTA */}
        <div style={{ marginTop:48, background:'linear-gradient(135deg,#0D1B3E,#152855)', borderRadius:16, padding:'28px 36px', border:'1px solid rgba(245,200,66,0.18)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:24, flexWrap:'wrap' }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:'white', marginBottom:6 }}>Add money to your wallet</div>
            <div style={{ fontSize:13, color:'rgba(253,246,236,0.55)' }}>Recharge to continue consultations. All payments are secure and encrypted.</div>
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {[100, 200, 500, 1000].map(amt => (
              <button key={amt} style={{ padding:'9px 20px', background:'rgba(245,200,66,0.1)', border:'1.5px solid rgba(245,200,66,0.25)', borderRadius:8, color:'#F5C842', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit', transition:'all 150ms' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(245,200,66,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(245,200,66,0.1)'; }}
              >₹{amt}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ChatPage });
