// ============================================================
// KundaliBaba — Astrology Calculators Hub + 20 Sub-Pages
// ============================================================

const CALC_BACKEND = 'https://kundalibaba-backend-production.up.railway.app/api/v1';

const CALC_META = [
  { slug:'love-calculator-by-name',        icon:'❤️',  title:'Love Calculator',            shortDesc:'Check love compatibility by name',          category:'Love & Relationships', frontend:true  },
  { slug:'flames-calculator',              icon:'🔥',  title:'FLAMES Calculator',          shortDesc:'Find your relationship with FLAMES',        category:'Love & Relationships', frontend:true  },
  { slug:'friendship-calculator',          icon:'🤝',  title:'Friendship Calculator',      shortDesc:'Measure friendship compatibility',           category:'Love & Relationships', frontend:true  },
  { slug:'numerology-calculator',          icon:'🔢',  title:'Numerology Calculator',      shortDesc:'Discover your life path & destiny number',  category:'Numerology',           frontend:true  },
  { slug:'lucky-vehicle-number-calculator',icon:'🚗',  title:'Lucky Vehicle Number',       shortDesc:'Is your vehicle number lucky for you?',     category:'Numerology',           frontend:true  },
  { slug:'lo-shu-grid-calculator',         icon:'🔲',  title:'Lo Shu Grid',               shortDesc:'Magic square numerology from date of birth', category:'Numerology',           frontend:true  },
  { slug:'sun-sign-calculator',            icon:'☀️',  title:'Sun Sign Calculator',        shortDesc:'Find your Vedic & Western sun sign',         category:'Vedic Astrology',      frontend:true  },
  { slug:'moon-phase-calculator',          icon:'🌕',  title:'Moon Phase Calculator',      shortDesc:'Current & historical moon phase finder',     category:'Vedic Astrology',      frontend:true  },
  { slug:'moon-sign-calculator',           icon:'🌙',  title:'Moon Sign Calculator',       shortDesc:'Your Chandra Rashi from birth details',      category:'Vedic Astrology',      frontend:false },
  { slug:'ascendant-calculator',           icon:'🌅',  title:'Ascendant Calculator',       shortDesc:'Find your Lagna / rising sign',              category:'Vedic Astrology',      frontend:false },
  { slug:'nakshatra-calculator',           icon:'⭐',  title:'Nakshatra Calculator',       shortDesc:'Your birth star & pada',                    category:'Vedic Astrology',      frontend:false },
  { slug:'birth-chart-calculator',         icon:'🗺️', title:'Birth Chart Generator',      shortDesc:'Full Vedic Kundali with all 12 houses',      category:'Birth Chart',          frontend:false },
  { slug:'mangal-dosha-calculator',        icon:'🔴',  title:'Mangal Dosha Calculator',    shortDesc:'Check if Mars dosha affects your chart',    category:'Doshas & Yogas',       frontend:false },
  { slug:'kaal-sarp-dosh-calculator',      icon:'🐍',  title:'Kaal Sarp Dosh Calculator',  shortDesc:'Are all planets between Rahu–Ketu?',         category:'Doshas & Yogas',       frontend:false },
  { slug:'sade-sati-calculator',           icon:'🪐',  title:'Sade Sati Calculator',       shortDesc:'Is Saturn transiting your moon sign?',      category:'Doshas & Yogas',       frontend:false },
  { slug:'dasha-calculator',               icon:'📅',  title:'Dasha Calculator',           shortDesc:'Vimshottari Dasha periods & timeline',       category:'Dasha & Predictions',  frontend:false },
  { slug:'atmakaraka-calculator',          icon:'👑',  title:'Atmakaraka Calculator',      shortDesc:'Your soul significator planet',              category:'Dasha & Predictions',  frontend:false },
  { slug:'ishta-devata-calculator',        icon:'🙏',  title:'Ishta Devata Calculator',    shortDesc:'Find your personal deity through Jaimini',   category:'Dasha & Predictions',  frontend:false },
  { slug:'transit-chart-calculator',       icon:'🌍',  title:'Transit Chart Calculator',   shortDesc:'Current planets over your natal chart',      category:'Transits',             frontend:false },
  { slug:'darakaraka-calculator',          icon:'💑',  title:'Darakaraka Calculator',      shortDesc:'The planet that represents your spouse',    category:'Transits',             frontend:false },
];

const CALC_SLUGS = CALC_META.map(c => c.slug);

// ── Numerology helpers ─────────────────────────────────────────────────────────
const PYTH_MAP = { a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8 };

function nameNumber(name) {
  return name.toLowerCase().replace(/[^a-z]/g,'').split('').reduce((s,c) => s + (PYTH_MAP[c]||0), 0);
}
function reduceNum(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((s,d) => s + parseInt(d), 0);
  }
  return n;
}
function dobNumber(dob) {
  return reduceNum(dob.replace(/-/g,'').split('').reduce((s,d) => s + parseInt(d), 0));
}

const NUM_MEANING = {
  1:'Leader, independent, ambitious. You forge your own path.',
  2:'Peacemaker, intuitive, diplomatic. You thrive in partnerships.',
  3:'Creative, expressive, joyful. Communication is your gift.',
  4:'Disciplined, practical, trustworthy. You build lasting things.',
  5:'Freedom-seeker, adventurous, adaptable. Change energises you.',
  6:'Nurturing, responsible, harmonious. Family is your strength.',
  7:'Spiritual, analytical, introspective. You seek deeper truths.',
  8:'Powerful, ambitious, material success. Manifestation is natural to you.',
  9:'Humanitarian, compassionate, wise. You serve a higher purpose.',
  11:'Master intuitive. Highly sensitive spiritual messenger.',
  22:'Master builder. Turns dreams into lasting reality.',
  33:'Master teacher. Devoted to uplifting all humanity.',
};

// ── Sun sign helpers ───────────────────────────────────────────────────────────
const WESTERN_SIGNS = [
  { name:'Capricorn', start:[12,22], end:[1,19],  symbol:'♑', color:'#455A64' },
  { name:'Aquarius',  start:[1,20],  end:[2,18],  symbol:'♒', color:'#1565C0' },
  { name:'Pisces',    start:[2,19],  end:[3,20],  symbol:'♓', color:'#4A148C' },
  { name:'Aries',     start:[3,21],  end:[4,19],  symbol:'♈', color:'#B71C1C' },
  { name:'Taurus',    start:[4,20],  end:[5,20],  symbol:'♉', color:'#2E7D32' },
  { name:'Gemini',    start:[5,21],  end:[6,20],  symbol:'♊', color:'#F57F17' },
  { name:'Cancer',    start:[6,21],  end:[7,22],  symbol:'♋', color:'#BDB76B' },
  { name:'Leo',       start:[7,23],  end:[8,22],  symbol:'♌', color:'#E65100' },
  { name:'Virgo',     start:[8,23],  end:[9,22],  symbol:'♍', color:'#558B2F' },
  { name:'Libra',     start:[9,23],  end:[10,22], symbol:'♎', color:'#4DD0E1' },
  { name:'Scorpio',   start:[10,23], end:[11,21], symbol:'♏', color:'#880E4F' },
  { name:'Sagittarius',start:[11,22],end:[12,21], symbol:'♐', color:'#9C27B0' },
];
function getWesternSign(dob) {
  const d = new Date(dob); const m = d.getMonth()+1; const day = d.getDate();
  for (const s of WESTERN_SIGNS) {
    const [sm,sd]=s.start, [em,ed]=s.end;
    if (sm<=em ? (m===sm&&day>=sd)||(m===em&&day<=ed)||(m>sm&&m<em) : (m===sm&&day>=sd)||m>sm||(m===em&&day<=ed)||m<em) return s;
  }
  return WESTERN_SIGNS[0];
}

const VEDIC_SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const VEDIC_DESCS = {
  Aries:'Mesh rashi. Ruled by Mars. Bold, energetic, pioneering.',
  Taurus:'Vrishabha rashi. Ruled by Venus. Stable, sensual, determined.',
  Gemini:'Mithuna rashi. Ruled by Mercury. Curious, communicative, dual-natured.',
  Cancer:'Karka rashi. Ruled by Moon. Emotional, nurturing, intuitive.',
  Leo:'Simha rashi. Ruled by Sun. Confident, generous, authoritative.',
  Virgo:'Kanya rashi. Ruled by Mercury. Analytical, perfectionist, service-oriented.',
  Libra:'Tula rashi. Ruled by Venus. Balanced, artistic, relationship-focused.',
  Scorpio:'Vrishchika rashi. Ruled by Mars. Intense, transformative, perceptive.',
  Sagittarius:'Dhanu rashi. Ruled by Jupiter. Optimistic, philosophical, expansive.',
  Capricorn:'Makar rashi. Ruled by Saturn. Disciplined, ambitious, patient.',
  Aquarius:'Kumbha rashi. Ruled by Saturn. Humanitarian, innovative, independent.',
  Pisces:'Meena rashi. Ruled by Jupiter. Spiritual, compassionate, imaginative.',
};

// ── Moon phase helper ──────────────────────────────────────────────────────────
function getMoonPhase(date) {
  const d = new Date(date);
  const known = new Date('2000-01-06');
  const diff = (d - known) / (1000*60*60*24);
  const cycle = 29.53059;
  const phase = ((diff % cycle) + cycle) % cycle;
  const phases = [
    { name:'New Moon',        emoji:'🌑', range:[0,1.85],   desc:'New beginnings, set intentions, plant seeds of desire.' },
    { name:'Waxing Crescent', emoji:'🌒', range:[1.85,7.38], desc:'Build momentum, take action, pursue your goals.' },
    { name:'First Quarter',   emoji:'🌓', range:[7.38,11.08],desc:'Make decisions, overcome challenges, push forward.' },
    { name:'Waxing Gibbous',  emoji:'🌔', range:[11.08,14.77],desc:'Refine, perfect, prepare for culmination.' },
    { name:'Full Moon',       emoji:'🌕', range:[14.77,16.62],desc:'Peak energy, revelations, heightened emotions.' },
    { name:'Waning Gibbous',  emoji:'🌖', range:[16.62,22.15],desc:'Gratitude, share wisdom, begin releasing.' },
    { name:'Last Quarter',    emoji:'🌗', range:[22.15,25.85],desc:'Let go, forgive, clear out what no longer serves.' },
    { name:'Waning Crescent', emoji:'🌘', range:[25.85,29.53],desc:'Rest, reflect, prepare for new cycle.' },
  ];
  const p = phases.find(x => phase >= x.range[0] && phase < x.range[1]) || phases[7];
  return { ...p, phase: Math.round(phase*10)/10 };
}

// ── Lo Shu Grid ────────────────────────────────────────────────────────────────
const LO_SHU_POS = [[4,9,2],[3,5,7],[8,1,6]];
const LO_SHU_MEANING = {
  1:'Water — Career, life path, willpower',
  2:'Earth — Relationships, partnerships',
  3:'Wood — Family, health, foundations',
  4:'Wood — Wealth, creativity, growth',
  5:'Earth — Center, balance, grounding',
  6:'Metal — Helpful people, travel, mentors',
  7:'Metal — Children, joy, creative projects',
  8:'Earth — Knowledge, self-improvement',
  9:'Fire — Fame, reputation, recognition',
};
function loShuGrid(dob) {
  const digits = dob.replace(/-/g,'').split('').map(Number).filter(n=>n>0);
  const counts = {};
  for (let i=1;i<=9;i++) counts[i] = digits.filter(d=>d===i).length;
  return { counts, grid: LO_SHU_POS };
}

// ── FLAMES ─────────────────────────────────────────────────────────────────────
function flames(name1, name2) {
  let n1 = name1.toLowerCase().replace(/\s/g,''), n2 = name2.toLowerCase().replace(/\s/g,'');
  let arr1 = n1.split(''), arr2 = n2.split('');
  for (let i=0;i<arr1.length;i++) { const idx=arr2.indexOf(arr1[i]); if(idx>-1){arr1[i]='*';arr2[idx]='*';} }
  const count = arr1.filter(c=>c!=='*').length + arr2.filter(c=>c!=='*').length;
  const f=['F','L','A','M','E','S'];
  let idx=0, arr=[...f];
  while(arr.length>1){
    idx=(idx+count-1)%arr.length;
    arr.splice(idx,1);
    if(idx>=arr.length) idx=0;
  }
  const map={F:{label:'Friends',emoji:'🤝',desc:'A strong, lasting friendship.'},L:{label:'Love',emoji:'❤️',desc:'A deep romantic connection.'},A:{label:'Affection',emoji:'💛',desc:'Warm, caring affection for each other.'},M:{label:'Marriage',emoji:'💍',desc:'A bond that could lead to marriage.'},E:{label:'Enemies',emoji:'⚔️',desc:'Conflict and friction between you.'},S:{label:'Siblings',emoji:'👫',desc:'A protective, sibling-like bond.'}};
  return { result: arr[0], count, ...map[arr[0]] };
}

// ── Love score ─────────────────────────────────────────────────────────────────
function loveScore(n1, n2) {
  const clean = s => s.toLowerCase().replace(/[^a-z]/g,'');
  const combined = (clean(n1)+' loves '+clean(n2)).split('').reduce((s,c,i)=>s+(c.charCodeAt(0)*((i%7)+1)),0);
  const score = 40 + (combined % 55); // keep between 40-94
  let label, color, emoji;
  if(score>=85){label='Soulmates';color='#C62828';emoji='💞';}
  else if(score>=70){label='Great Match';color='#E65100';emoji='❤️';}
  else if(score>=55){label='Good Match';color='#F57F17';emoji='💛';}
  else {label='Average Match';color='#558B2F';emoji='💚';}
  return { score, label, color, emoji };
}

// ── Friendship score ───────────────────────────────────────────────────────────
function friendScore(n1, n2) {
  const combined = (n1+n2).toLowerCase().replace(/[^a-z]/g,'').split('').reduce((s,c,i)=>s+(c.charCodeAt(0)*(i%5+1)),0);
  const score = 45 + (combined % 50);
  let label, color;
  if(score>=85){label='Best Friends Forever';color:'#1565C0';}
  else if(score>=70){label='Great Friends';color='#2E7D32';}
  else if(score>=55){label='Good Friends';color='#F57F17';}
  else{label='Casual Friends';color='#A07850';}
  color = score>=85?'#1565C0':score>=70?'#2E7D32':score>=55?'#F57F17':'#A07850';
  return { score, label, color };
}

// ── Shared components ──────────────────────────────────────────────────────────
function CalcCard({ calc, onNavigate }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={() => onNavigate(calc.slug)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ background:'white', borderRadius:16, padding:'24px 20px', border:'1px solid', borderColor:hover?'#E8890C':'#EDD9B8', cursor:'pointer', transition:'all 180ms', transform:hover?'translateY(-4px)':'none', boxShadow:hover?'0 12px 32px rgba(13,27,62,0.12)':'0 2px 8px rgba(13,27,62,0.06)' }}
    >
      <div style={{ fontSize:36, marginBottom:12 }}>{calc.icon}</div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:'#0D1B3E', marginBottom:6, lineHeight:1.3 }}>{calc.title}</div>
      <div style={{ fontSize:13, color:'#6B4C2A', lineHeight:1.6, marginBottom:14 }}>{calc.shortDesc}</div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'#A07850' }}>{calc.category}</span>
        <span style={{ color:'#E8890C', fontSize:16 }}>→</span>
      </div>
    </div>
  );
}

function CalcLayout({ meta, children, onNavigate }) {
  const isMobile = useMobile();
  return (
    <div style={{ background:'#FFF9F0', minHeight:'100vh' }}>
      <div style={{ maxWidth:760, margin:'0 auto', padding: isMobile ? '24px 16px 48px' : '40px 24px 72px' }}>
        <button onClick={() => onNavigate('astrology-calculators')} style={{ background:'none', border:'none', color:'#E8890C', cursor:'pointer', fontSize:13, fontWeight:600, marginBottom:20, padding:0, display:'flex', alignItems:'center', gap:6 }}>
          ← All Calculators
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:8 }}>
          <span style={{ fontSize:44 }}>{meta.icon}</span>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#E8890C', marginBottom:4 }}>{meta.category}</div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 24 : 32, fontWeight:800, color:'#0D1B3E', margin:0, lineHeight:1.2 }}>{meta.title}</h1>
          </div>
        </div>
        <p style={{ fontSize:14, color:'#6B4C2A', marginBottom:32, lineHeight:1.7 }}>{meta.shortDesc}</p>
        <div style={{ background:'white', borderRadius:20, padding: isMobile ? '24px 16px' : '36px 40px', border:'1px solid #EDD9B8', boxShadow:'0 4px 16px rgba(13,27,62,0.06)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, type='text', placeholder='', min, max }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={{ fontSize:13, fontWeight:600, color:'#1A0A00' }}>{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        min={min} max={max}
        style={{ height:44, padding:'0 14px', border:'1.5px solid #EDD9B8', borderRadius:10, fontSize:14, color:'#1A0A00', outline:'none', fontFamily:'inherit', background:'#FFFDF8' }}
        onFocus={e=>e.target.style.borderColor='#E8890C'}
        onBlur={e=>e.target.style.borderColor='#EDD9B8'}
      />
    </div>
  );
}

function CalcButton({ onClick, loading, children }) {
  return (
    <button onClick={onClick} disabled={loading}
      style={{ padding:'12px 32px', background:loading?'#ccc':'linear-gradient(135deg,#E8890C,#F5C842)', color:'white', border:'none', borderRadius:12, fontWeight:700, fontSize:15, cursor:loading?'not-allowed':'pointer', width:'100%', marginTop:8, fontFamily:'inherit' }}>
      {loading ? 'Calculating...' : children}
    </button>
  );
}

function ResultBox({ children }) {
  return (
    <div style={{ marginTop:28, padding:'24px', background:'linear-gradient(135deg,#FDF6EC,#FFF9F0)', borderRadius:16, border:'1px solid #EDD9B8' }}>
      {children}
    </div>
  );
}

// ── Geocoding helper ───────────────────────────────────────────────────────────
async function geocodePlace(place) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { 'Accept-Language':'en' } });
  const data = await res.json();
  if (!data.length) throw new Error('Place not found. Try a more specific name.');
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), display: data[0].display_name };
}

// ── Shared birth details form ─────────────────────────────────────────────────
function BirthDetailsForm({ onResult, fields = ['dob','tob','place'], buttonLabel = 'Calculate' }) {
  const [dob, setDob]     = React.useState('');
  const [tob, setTob]     = React.useState('12:00');
  const [place, setPlace] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError]     = React.useState('');

  const go = async () => {
    if (fields.includes('dob') && !dob)   { setError('Please enter date of birth'); return; }
    if (fields.includes('place') && !place) { setError('Please enter place of birth'); return; }
    setError(''); setLoading(true);
    try {
      let lat=28.6139, lon=77.2090;
      if (fields.includes('place') && place) {
        const g = await geocodePlace(place);
        lat = g.lat; lon = g.lon;
      }
      const res = await fetch(`${CALC_BACKEND}/kundali/calculate`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ dateOfBirth: dob, timeOfBirth: tob||'12:00', latitude: lat, longitude: lon }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Calculation failed');
      onResult(json.data, { dob, tob, place, lat, lon });
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {fields.includes('dob')   && <InputField label="Date of Birth" value={dob}   onChange={setDob}   type="date" />}
      {fields.includes('tob')   && <InputField label="Time of Birth" value={tob}   onChange={setTob}   type="time" />}
      {fields.includes('place') && <InputField label="Place of Birth" value={place} onChange={setPlace} placeholder="e.g. Mumbai, India" />}
      {error && <div style={{ fontSize:13, color:'#C62828', padding:'8px 12px', background:'rgba(198,40,40,0.06)', borderRadius:8 }}>{error}</div>}
      <CalcButton onClick={go} loading={loading}>{buttonLabel}</CalcButton>
    </div>
  );
}

// ── Planet display helper ──────────────────────────────────────────────────────
const PLANET_EMOJI = { SUN:'☀️', MOON:'🌙', MARS:'🔴', MERCURY:'☿', JUPITER:'♃', VENUS:'♀', SATURN:'🪐', RAHU:'☊', KETU:'☋', LAGNA:'⬆️' };

// ══════════════════════════════════════════════════════════════════════════════
// PURE FRONTEND CALCULATORS
// ══════════════════════════════════════════════════════════════════════════════

function LoveCalc({ meta, onNavigate }) {
  const [n1,setN1]=React.useState(''); const [n2,setN2]=React.useState(''); const [res,setRes]=React.useState(null);
  const go = () => { if(!n1.trim()||!n2.trim()) return; setRes(loveScore(n1,n2)); };
  return (
    <CalcLayout meta={meta} onNavigate={onNavigate}>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <InputField label="Your Name" value={n1} onChange={setN1} placeholder="Enter your full name" />
        <InputField label="Partner's Name" value={n2} onChange={setN2} placeholder="Enter partner's full name" />
        <CalcButton onClick={go}>Calculate Love Score</CalcButton>
      </div>
      {res && (
        <ResultBox>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:64 }}>{res.emoji}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:52, fontWeight:800, color:res.color, lineHeight:1 }}>{res.score}%</div>
            <div style={{ fontSize:22, fontWeight:700, color:'#0D1B3E', margin:'8px 0 4px' }}>{res.label}</div>
            <div style={{ fontSize:14, color:'#6B4C2A', marginBottom:16 }}>{n1} & {n2}</div>
            <div style={{ fontSize:13, color:'#A07850', lineHeight:1.6, maxWidth:420, margin:'0 auto' }}>
              {res.score>=85?'The stars have aligned a powerful connection. Your names vibrate at a frequency that creates deep understanding and harmony.':res.score>=70?'A strong connection with natural chemistry. Nurture this bond and it will flourish beautifully.':res.score>=55?'A compatible pairing with room to grow. Understanding and communication will strengthen your bond.':'Every relationship takes effort. Focus on communication and mutual respect to build something special.'}
            </div>
          </div>
        </ResultBox>
      )}
    </CalcLayout>
  );
}

function FlamesCalc({ meta, onNavigate }) {
  const [n1,setN1]=React.useState(''); const [n2,setN2]=React.useState(''); const [res,setRes]=React.useState(null);
  const go = () => { if(!n1.trim()||!n2.trim()) return; setRes(flames(n1,n2)); };
  return (
    <CalcLayout meta={meta} onNavigate={onNavigate}>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <InputField label="Your Name" value={n1} onChange={setN1} placeholder="Enter your name" />
        <InputField label="Their Name" value={n2} onChange={setN2} placeholder="Enter their name" />
        <CalcButton onClick={go}>Calculate FLAMES</CalcButton>
      </div>
      {res && (
        <ResultBox>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:64, marginBottom:8 }}>{res.emoji}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:800, color:'#E8890C' }}>{res.label}</div>
            <div style={{ fontSize:14, color:'#6B4C2A', margin:'12px auto', maxWidth:360, lineHeight:1.7 }}>{res.desc}</div>
            <div style={{ display:'inline-block', padding:'6px 16px', background:'rgba(232,137,12,0.08)', border:'1px solid rgba(232,137,12,0.2)', borderRadius:20, fontSize:13, color:'#A07850' }}>
              Common letters removed: {res.count} remaining
            </div>
            <div style={{ display:'flex', justifyContent:'center', gap:12, marginTop:20, fontSize:20, fontWeight:800 }}>
              {['F','L','A','M','E','S'].map(l => (
                <div key={l} style={{ width:40, height:40, borderRadius:'50%', background: l===res.result?'#E8890C':'rgba(232,137,12,0.1)', color:l===res.result?'white':'#A07850', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:700, transition:'all 200ms' }}>{l}</div>
              ))}
            </div>
          </div>
        </ResultBox>
      )}
    </CalcLayout>
  );
}

function FriendshipCalc({ meta, onNavigate }) {
  const [n1,setN1]=React.useState(''); const [n2,setN2]=React.useState(''); const [res,setRes]=React.useState(null);
  const go = () => { if(!n1.trim()||!n2.trim()) return; setRes(friendScore(n1,n2)); };
  return (
    <CalcLayout meta={meta} onNavigate={onNavigate}>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <InputField label="Your Name" value={n1} onChange={setN1} placeholder="Enter your name" />
        <InputField label="Friend's Name" value={n2} onChange={setN2} placeholder="Enter friend's name" />
        <CalcButton onClick={go}>Check Friendship</CalcButton>
      </div>
      {res && (
        <ResultBox>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:64 }}>🤝</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:52, fontWeight:800, color:res.color }}>{res.score}%</div>
            <div style={{ fontSize:22, fontWeight:700, color:'#0D1B3E', margin:'8px 0 12px' }}>{res.label}</div>
            <div style={{ fontSize:13, color:'#A07850', lineHeight:1.7, maxWidth:380, margin:'0 auto' }}>
              {res.score>=85?'A rare and cherished connection. This friendship is built on deep understanding, loyalty, and mutual respect.':res.score>=70?'A wonderful friendship with genuine care and good energy between you.':res.score>=55?'A solid friendship with good potential. Shared experiences will strengthen this bond.':'Differences can make friendships interesting! Focus on what you have in common.'}
            </div>
          </div>
        </ResultBox>
      )}
    </CalcLayout>
  );
}

function NumerologyCalc({ meta, onNavigate }) {
  const [name,setName]=React.useState(''); const [dob,setDob]=React.useState(''); const [res,setRes]=React.useState(null);
  const go = () => {
    if(!name.trim()&&!dob) return;
    const destiny = name ? reduceNum(nameNumber(name)) : null;
    const lifePath = dob ? dobNumber(dob) : null;
    setRes({ destiny, lifePath, name, dob });
  };
  return (
    <CalcLayout meta={meta} onNavigate={onNavigate}>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <InputField label="Full Name (for Destiny Number)" value={name} onChange={setName} placeholder="Enter your full name" />
        <InputField label="Date of Birth (for Life Path Number)" value={dob} onChange={setDob} type="date" />
        <CalcButton onClick={go}>Calculate Numbers</CalcButton>
      </div>
      {res && (
        <ResultBox>
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {res.destiny && (
              <div style={{ textAlign:'center', padding:'20px', background:'rgba(232,137,12,0.05)', borderRadius:14 }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#E8890C', marginBottom:8 }}>Destiny Number</div>
                <div style={{ fontSize:64, fontWeight:900, color:'#E8890C', lineHeight:1, fontFamily:"'Playfair Display',serif" }}>{res.destiny}</div>
                <div style={{ fontSize:14, color:'#6B4C2A', marginTop:10, lineHeight:1.7 }}>{NUM_MEANING[res.destiny]}</div>
              </div>
            )}
            {res.lifePath && (
              <div style={{ textAlign:'center', padding:'20px', background:'rgba(21,101,192,0.05)', borderRadius:14 }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#1565C0', marginBottom:8 }}>Life Path Number</div>
                <div style={{ fontSize:64, fontWeight:900, color:'#1565C0', lineHeight:1, fontFamily:"'Playfair Display',serif" }}>{res.lifePath}</div>
                <div style={{ fontSize:14, color:'#6B4C2A', marginTop:10, lineHeight:1.7 }}>{NUM_MEANING[res.lifePath]}</div>
              </div>
            )}
          </div>
        </ResultBox>
      )}
    </CalcLayout>
  );
}

function LuckyVehicleCalc({ meta, onNavigate }) {
  const [num,setNum]=React.useState(''); const [dob,setDob]=React.useState(''); const [res,setRes]=React.useState(null);
  const go = () => {
    if(!num.trim()) return;
    const digits = num.replace(/[^0-9]/g,'').split('').map(Number);
    if(!digits.length) return;
    const vehNum = reduceNum(digits.reduce((a,b)=>a+b,0));
    const dobNum = dob ? dobNumber(dob) : null;
    const compat = dobNum ? (vehNum===dobNum || (vehNum+dobNum)%9===0 ? 'Highly Lucky' : Math.abs(vehNum-dobNum)<=2 ? 'Lucky' : 'Neutral') : null;
    const meanings = {1:'Sun number. Leadership, success, independence.',2:'Moon number. Emotional balance, intuition.',3:'Jupiter number. Growth, prosperity, wisdom.',4:'Rahu number. Transformation, change. Best paired with caution.',5:'Mercury number. Speed, communication, flexibility.',6:'Venus number. Comfort, luxury, smooth journeys.',7:'Ketu number. Spiritual, introspective. Good for long journeys.',8:'Saturn number. Discipline, reliability, endurance.',9:'Mars number. Power, energy, courage.'};
    setRes({ vehNum, dobNum, compat, meaning: meanings[vehNum] });
  };
  return (
    <CalcLayout meta={meta} onNavigate={onNavigate}>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <InputField label="Vehicle Number" value={num} onChange={setNum} placeholder="e.g. MH 12 AB 1234" />
        <InputField label="Your Date of Birth (optional)" value={dob} onChange={setDob} type="date" />
        <CalcButton onClick={go}>Check Lucky Number</CalcButton>
      </div>
      {res && (
        <ResultBox>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:64, fontWeight:900, color:'#E8890C', fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{res.vehNum}</div>
            <div style={{ fontSize:20, fontWeight:700, color:'#0D1B3E', margin:'8px 0' }}>Vehicle Numerology: {res.vehNum}</div>
            <div style={{ fontSize:14, color:'#6B4C2A', lineHeight:1.7, maxWidth:380, margin:'0 auto 16px' }}>{res.meaning}</div>
            {res.compat && (
              <div style={{ display:'inline-block', padding:'8px 20px', borderRadius:20, background: res.compat==='Highly Lucky'?'rgba(46,125,50,0.1)':res.compat==='Lucky'?'rgba(232,137,12,0.1)':'rgba(160,120,80,0.1)', color: res.compat==='Highly Lucky'?'#2E7D32':res.compat==='Lucky'?'#E8890C':'#A07850', fontWeight:700, fontSize:14 }}>
                {res.compat==='Highly Lucky'?'✅':res.compat==='Lucky'?'⭐':'➖'} {res.compat} for you
              </div>
            )}
          </div>
        </ResultBox>
      )}
    </CalcLayout>
  );
}

function LoShuCalc({ meta, onNavigate }) {
  const [dob,setDob]=React.useState(''); const [res,setRes]=React.useState(null);
  const go = () => { if(!dob) return; setRes(loShuGrid(dob)); };
  const cellStyle = (num, counts) => ({
    width:80, height:80, borderRadius:12, border:'2px solid', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2,
    borderColor: counts[num]>0?'#E8890C':'#EDD9B8',
    background: counts[num]>0?'linear-gradient(135deg,#FDF6EC,#FFF0D0)':'#FAFAFA',
  });
  return (
    <CalcLayout meta={meta} onNavigate={onNavigate}>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <InputField label="Date of Birth" value={dob} onChange={setDob} type="date" />
        <CalcButton onClick={go}>Generate Lo Shu Grid</CalcButton>
      </div>
      {res && (
        <ResultBox>
          <div style={{ textAlign:'center', marginBottom:20 }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:'#0D1B3E', marginBottom:16 }}>Your Lo Shu Magic Square</div>
            <div style={{ display:'inline-grid', gridTemplateColumns:'repeat(3,80px)', gap:8 }}>
              {res.grid.map((row,ri) => row.map((num,ci) => (
                <div key={`${ri}-${ci}`} style={cellStyle(num,res.counts)}>
                  <div style={{ fontSize:22, fontWeight:900, color: res.counts[num]>0?'#E8890C':'#CCC' }}>{num}</div>
                  {res.counts[num]>0 && <div style={{ fontSize:10, color:'#A07850' }}>×{res.counts[num]}</div>}
                </div>
              )))}
            </div>
            <div style={{ marginTop:20, display:'flex', flexDirection:'column', gap:8, textAlign:'left' }}>
              {Object.entries(LO_SHU_MEANING).filter(([n])=>res.counts[n]>0).map(([n,m])=>(
                <div key={n} style={{ display:'flex', gap:10, padding:'8px 12px', background:'rgba(232,137,12,0.05)', borderRadius:10 }}>
                  <span style={{ fontWeight:700, color:'#E8890C', minWidth:20 }}>{n}</span>
                  <span style={{ fontSize:13, color:'#6B4C2A' }}>{m}</span>
                </div>
              ))}
              {!Object.entries(LO_SHU_MEANING).some(([n])=>res.counts[n]>0) && <div style={{ fontSize:13, color:'#A07850', textAlign:'center' }}>No digits in your birth date (0s excluded by Lo Shu)</div>}
            </div>
          </div>
        </ResultBox>
      )}
    </CalcLayout>
  );
}

function SunSignCalc({ meta, onNavigate }) {
  const [dob,setDob]=React.useState(''); const [res,setRes]=React.useState(null);
  const go = () => { if(!dob) return; setRes(getWesternSign(dob)); };
  return (
    <CalcLayout meta={meta} onNavigate={onNavigate}>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <InputField label="Date of Birth" value={dob} onChange={setDob} type="date" />
        <CalcButton onClick={go}>Find My Sun Sign</CalcButton>
      </div>
      {res && (
        <ResultBox>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:72, marginBottom:8 }}>{res.symbol}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:800, color:res.color }}>{res.name}</div>
            <div style={{ fontSize:13, color:'#A07850', margin:'8px 0 20px' }}>Western Sun Sign</div>
            <div style={{ padding:'16px', background:'rgba(232,137,12,0.05)', borderRadius:12, marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#E8890C', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.08em' }}>Vedic (Sidereal) Equivalent</div>
              <div style={{ fontSize:15, fontWeight:600, color:'#0D1B3E' }}>
                {(() => { const d=new Date(dob); const idx=Math.floor(((d.getMonth()*30+d.getDate()-80+360)%360)/30); return VEDIC_SIGNS[idx]; })()}
              </div>
              <div style={{ fontSize:13, color:'#6B4C2A', marginTop:6, lineHeight:1.6 }}>
                {(() => { const d=new Date(dob); const idx=Math.floor(((d.getMonth()*30+d.getDate()-80+360)%360)/30); return VEDIC_DESCS[VEDIC_SIGNS[idx]]; })()}
              </div>
            </div>
          </div>
        </ResultBox>
      )}
    </CalcLayout>
  );
}

function MoonPhaseCalc({ meta, onNavigate }) {
  const [date,setDate]=React.useState(new Date().toISOString().split('T')[0]); const [res,setRes]=React.useState(null);
  const go = () => { if(!date) return; setRes(getMoonPhase(date)); };
  return (
    <CalcLayout meta={meta} onNavigate={onNavigate}>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <InputField label="Date" value={date} onChange={setDate} type="date" />
        <CalcButton onClick={go}>Find Moon Phase</CalcButton>
      </div>
      {res && (
        <ResultBox>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:80 }}>{res.emoji}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:800, color:'#0D1B3E', margin:'8px 0 4px' }}>{res.name}</div>
            <div style={{ fontSize:13, color:'#A07850', marginBottom:16 }}>{res.phase} days into lunar cycle</div>
            <div style={{ fontSize:15, color:'#6B4C2A', lineHeight:1.7, maxWidth:380, margin:'0 auto', fontStyle:'italic' }}>{res.desc}</div>
            <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:20 }}>
              {['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'].map((e,i) => (
                <span key={i} style={{ fontSize: e===res.emoji?28:18, opacity: e===res.emoji?1:0.3, transition:'all 200ms' }}>{e}</span>
              ))}
            </div>
          </div>
        </ResultBox>
      )}
    </CalcLayout>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// BACKEND-POWERED CALCULATORS
// ══════════════════════════════════════════════════════════════════════════════

function MoonSignCalc({ meta, onNavigate }) {
  const [result, setResult] = React.useState(null);
  const handleResult = (data) => setResult(data);
  return (
    <CalcLayout meta={meta} onNavigate={onNavigate}>
      <BirthDetailsForm onResult={handleResult} buttonLabel="Find Moon Sign" />
      {result && (
        <ResultBox>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:64 }}>🌙</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:800, color:'#1565C0', margin:'8px 0 4px' }}>{result.positions.MOON.rashi}</div>
            <div style={{ fontSize:14, color:'#A07850', marginBottom:16 }}>Your Chandra Rashi (Moon Sign)</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
              {[['Nakshatra', result.positions.MOON.nakshatra],['Pada', result.positions.MOON.pada],['Degree', `${result.positions.MOON.degree.toFixed(1)}°`]].map(([l,v])=>(
                <div key={l} style={{ padding:'12px 8px', background:'rgba(21,101,192,0.05)', borderRadius:10 }}>
                  <div style={{ fontSize:11, color:'#A07850', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>{l}</div>
                  <div style={{ fontSize:15, fontWeight:700, color:'#0D1B3E' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize:13, color:'#6B4C2A', lineHeight:1.7 }}>{VEDIC_DESCS[result.positions.MOON.rashi]}</div>
          </div>
        </ResultBox>
      )}
    </CalcLayout>
  );
}

function AscendantCalc({ meta, onNavigate }) {
  const [result, setResult] = React.useState(null);
  return (
    <CalcLayout meta={meta} onNavigate={onNavigate}>
      <BirthDetailsForm onResult={r=>setResult(r)} buttonLabel="Find Ascendant" />
      {result && (
        <ResultBox>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:64 }}>🌅</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:800, color:'#E8890C', margin:'8px 0 4px' }}>{result.positions.LAGNA.rashi}</div>
            <div style={{ fontSize:14, color:'#A07850', marginBottom:16 }}>Your Lagna (Ascendant / Rising Sign)</div>
            <div style={{ fontSize:13, color:'#6B4C2A', lineHeight:1.7, maxWidth:400, margin:'0 auto 16px' }}>{VEDIC_DESCS[result.positions.LAGNA.rashi]}</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
              {[['Degree in Sign', `${result.positions.LAGNA.degree.toFixed(2)}°`],['Nakshatra', result.positions.LAGNA.nakshatra]].map(([l,v])=>(
                <div key={l} style={{ padding:'12px', background:'rgba(232,137,12,0.05)', borderRadius:10 }}>
                  <div style={{ fontSize:11, color:'#A07850', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>{l}</div>
                  <div style={{ fontSize:15, fontWeight:700, color:'#0D1B3E' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </ResultBox>
      )}
    </CalcLayout>
  );
}

function NakshatraCalc({ meta, onNavigate }) {
  const [result, setResult] = React.useState(null);
  return (
    <CalcLayout meta={meta} onNavigate={onNavigate}>
      <BirthDetailsForm onResult={r=>setResult(r)} buttonLabel="Find Nakshatra" />
      {result && (
        <ResultBox>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:64 }}>⭐</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:800, color:'#4A148C', margin:'8px 0 4px' }}>{result.positions.MOON.nakshatra}</div>
            <div style={{ fontSize:14, color:'#A07850', marginBottom:16 }}>Your Janma Nakshatra (Birth Star)</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
              {[['Pada', result.positions.MOON.pada],['Moon Sign', result.positions.MOON.rashi],['Moon Degree', `${result.positions.MOON.degree.toFixed(1)}°`]].map(([l,v])=>(
                <div key={l} style={{ padding:'12px 8px', background:'rgba(74,20,140,0.05)', borderRadius:10 }}>
                  <div style={{ fontSize:11, color:'#A07850', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>{l}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#0D1B3E' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize:13, color:'#6B4C2A', lineHeight:1.7, padding:'12px', background:'rgba(74,20,140,0.04)', borderRadius:10 }}>
              In Vedic astrology, your Janma Nakshatra determines your Dasha sequence, innate temperament, and spiritual tendencies. Nakshatra {result.positions.MOON.nakshatra} Pada {result.positions.MOON.pada} gives specific characteristics based on the navamsa division.
            </div>
          </div>
        </ResultBox>
      )}
    </CalcLayout>
  );
}

function BirthChartCalc({ meta, onNavigate }) {
  const [result, setResult] = React.useState(null);
  const isMobile = useMobile();
  return (
    <CalcLayout meta={meta} onNavigate={onNavigate}>
      <BirthDetailsForm onResult={r=>setResult(r)} buttonLabel="Generate Birth Chart" />
      {result && (
        <ResultBox>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:'#0D1B3E', marginBottom:16, textAlign:'center' }}>Your Vedic Birth Chart</div>
          <div style={{ display:'grid', gridTemplateColumns: isMobile?'repeat(3,1fr)':'repeat(4,1fr)', gap:8, marginBottom:20 }}>
            {result.chart.map(h => (
              <div key={h.house} style={{ padding:'10px 8px', background: h.planets.length?'linear-gradient(135deg,#FDF6EC,#FFF0D0)':'#FAFAFA', borderRadius:10, border:'1px solid', borderColor:h.planets.length?'#E8890C':'#EDD9B8', minHeight:64 }}>
                <div style={{ fontSize:10, fontWeight:700, color:'#A07850', marginBottom:4 }}>House {h.house} · {h.rashi}</div>
                <div style={{ fontSize:12, color:'#E8890C', fontWeight:600 }}>
                  {h.planets.map(p=>`${PLANET_EMOJI[p]||''}${p}`).join(' ')}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'repeat(2,1fr)', gap:8 }}>
            {Object.entries(result.positions).filter(([p])=>p!=='LAGNA').map(([planet,data])=>(
              <div key={planet} style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 12px', background:'rgba(13,27,62,0.03)', borderRadius:8 }}>
                <span style={{ fontSize:18 }}>{PLANET_EMOJI[planet]||'🔵'}</span>
                <div>
                  <span style={{ fontSize:13, fontWeight:600, color:'#0D1B3E' }}>{planet}</span>
                  <span style={{ fontSize:12, color:'#A07850', marginLeft:8 }}>{data.rashi} {data.degree.toFixed(1)}° · {data.nakshatra}</span>
                </div>
              </div>
            ))}
          </div>
        </ResultBox>
      )}
    </CalcLayout>
  );
}

function MangalDoshaCalc({ meta, onNavigate }) {
  const [result, setResult] = React.useState(null);
  const checkMangal = (data) => {
    const lagnaIdx = data.positions.LAGNA.rashiIndex;
    const marsIdx  = data.positions.MARS.rashiIndex;
    const houseOfMars = ((marsIdx - lagnaIdx + 12) % 12) + 1;
    const doshaHouses = [1,2,4,7,8,12];
    const hasMangal = doshaHouses.includes(houseOfMars);
    setResult({ hasMangal, houseOfMars, marsSign: data.positions.MARS.rashi, data });
  };
  return (
    <CalcLayout meta={meta} onNavigate={onNavigate}>
      <BirthDetailsForm onResult={checkMangal} buttonLabel="Check Mangal Dosha" />
      {result && (
        <ResultBox>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:64 }}>{result.hasMangal?'🔴':'✅'}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:800, color:result.hasMangal?'#B71C1C':'#2E7D32', margin:'8px 0 8px' }}>
              {result.hasMangal ? 'Mangal Dosha Present' : 'No Mangal Dosha'}
            </div>
            <div style={{ fontSize:14, color:'#A07850', marginBottom:16 }}>Mars is in House {result.houseOfMars} ({result.marsSign})</div>
            <div style={{ fontSize:14, color:'#6B4C2A', lineHeight:1.75, maxWidth:480, margin:'0 auto', padding:'16px', background: result.hasMangal?'rgba(183,28,28,0.05)':'rgba(46,125,50,0.05)', borderRadius:12 }}>
              {result.hasMangal
                ? `Mars placed in house ${result.houseOfMars} creates Mangal Dosha. This dosha can create friction in marital life and is traditionally managed by marrying another Manglik. Many remedies exist — wearing Red Coral, reciting Hanuman Chalisa, and donating red lentils on Tuesdays. Consult a pandit for personalised remedies.`
                : 'Mars is placed in a neutral house. There is no Mangal Dosha in this chart. The native can marry anyone without the Manglik concern. Mars still influences the chart through its position and aspects.'}
            </div>
          </div>
        </ResultBox>
      )}
    </CalcLayout>
  );
}

function KaalSarpCalc({ meta, onNavigate }) {
  const [result, setResult] = React.useState(null);
  const check = (data) => {
    const { positions } = data;
    const rahuLon = positions.RAHU.longitude;
    const ketuLon = positions.KETU.longitude;
    const planets = ['SUN','MOON','MARS','MERCURY','JUPITER','VENUS','SATURN'];
    const rahu = rahuLon, ketu = ketuLon;
    const between = (lon, r, k) => {
      if(r<k) return lon>r && lon<k;
      return lon>r || lon<k;
    };
    const allBetween = planets.every(p => between(positions[p].longitude, rahu, ketu));
    const allOpposite = planets.every(p => between(positions[p].longitude, ketu, rahu));
    const has = allBetween || allOpposite;
    const type = allBetween ? 'Kaal Sarp Yoga (Serpent Head leads)' : 'Partial / Reversed Kaal Sarp';
    setResult({ has, type, rahuSign: positions.RAHU.rashi, ketuSign: positions.KETU.rashi });
  };
  return (
    <CalcLayout meta={meta} onNavigate={onNavigate}>
      <BirthDetailsForm onResult={check} buttonLabel="Check Kaal Sarp Dosh" />
      {result && (
        <ResultBox>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:64 }}>{result.has?'🐍':'✅'}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:800, color:result.has?'#B71C1C':'#2E7D32', margin:'8px 0 8px' }}>
              {result.has ? result.type : 'No Kaal Sarp Dosh'}
            </div>
            <div style={{ fontSize:13, color:'#A07850', marginBottom:16 }}>Rahu in {result.rahuSign} · Ketu in {result.ketuSign}</div>
            <div style={{ fontSize:14, color:'#6B4C2A', lineHeight:1.75, maxWidth:480, margin:'0 auto', padding:'16px', background:result.has?'rgba(183,28,28,0.05)':'rgba(46,125,50,0.05)', borderRadius:12 }}>
              {result.has
                ? 'Kaal Sarp Yoga occurs when all seven planets fall between Rahu and Ketu. This creates a focused and often intense life experience — success may come after initial struggles. Remedies include Kaal Sarp Puja at Tryambakeshwar or Nashik, and reciting the Nag Stotra on Nag Panchami.'
                : 'All planets are not confined between Rahu and Ketu. No Kaal Sarp Dosh is present in this chart. The native\'s life unfolds without the specific challenges this yoga would create.'}
            </div>
          </div>
        </ResultBox>
      )}
    </CalcLayout>
  );
}

function SadeSatiCalc({ meta, onNavigate }) {
  const [result, setResult] = React.useState(null);
  const check = (data) => {
    const moonIdx  = data.positions.MOON.rashiIndex;
    const saturnIdx = data.positions.SATURN.rashiIndex;
    // Current Saturn position (approximate from today's date)
    const today = new Date();
    const jd = 2440587.5 + today.getTime()/86400000;
    const satTropical = ((50.07 + 0.0334442282*(jd-2451545))%360+360)%360;
    const ayanamsa = 23.85 + (jd-2415020.0)*(50.3/3600)/365.25;
    const currentSaturnSidereal = ((satTropical - ayanamsa)%360+360)%360;
    const currentSaturnRashi = Math.floor(currentSaturnSidereal/30);
    const inSadeSati = [moonIdx-1, moonIdx, moonIdx+1].map(i=>(i+12)%12).includes(currentSaturnRashi);
    const phase = currentSaturnRashi === (moonIdx-1+12)%12 ? 'Rising Phase (Dhaiya begins)' : currentSaturnRashi === moonIdx ? 'Peak Phase (Saturn on Moon)' : 'Setting Phase (Dhaiya ends)';
    setResult({ inSadeSati, moonSign: data.positions.MOON.rashi, currentSaturnSign: ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'][currentSaturnRashi], phase });
  };
  return (
    <CalcLayout meta={meta} onNavigate={onNavigate}>
      <BirthDetailsForm onResult={check} fields={['dob','tob','place']} buttonLabel="Check Sade Sati" />
      {result && (
        <ResultBox>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:64 }}>{result.inSadeSati?'🪐':'✅'}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:800, color:result.inSadeSati?'#4A148C':'#2E7D32', margin:'8px 0 8px' }}>
              {result.inSadeSati ? `Sade Sati Active — ${result.phase}` : 'Not in Sade Sati'}
            </div>
            <div style={{ fontSize:13, color:'#A07850', marginBottom:16 }}>Moon in {result.moonSign} · Saturn currently in {result.currentSaturnSign}</div>
            <div style={{ fontSize:14, color:'#6B4C2A', lineHeight:1.75, maxWidth:480, margin:'0 auto', padding:'16px', background:result.inSadeSati?'rgba(74,20,140,0.05)':'rgba(46,125,50,0.05)', borderRadius:12 }}>
              {result.inSadeSati
                ? `Saturn is currently transiting ${result.currentSaturnSign}, which activates Sade Sati for Moon in ${result.moonSign}. Sade Sati is a 7.5-year period of Saturn's influence on the natal Moon. It brings transformation, hard work, and introspection. Recommended remedies: donate sesame oil on Saturdays, recite Shani Stotra, visit Shani temples.`
                : `Saturn is in ${result.currentSaturnSign}, away from your Moon sign (${result.moonSign}). You are currently not experiencing Sade Sati. It will begin when Saturn enters the sign before ${result.moonSign}.`}
            </div>
          </div>
        </ResultBox>
      )}
    </CalcLayout>
  );
}

function DashaCalc({ meta, onNavigate }) {
  const [result, setResult] = React.useState(null);
  const DASHA_COLORS = { KETU:'#4A148C', VENUS:'#E91E63', SUN:'#F57F17', MOON:'#1565C0', MARS:'#B71C1C', RAHU:'#263238', JUPITER:'#E65100', SATURN:'#37474F', MERCURY:'#2E7D32' };
  return (
    <CalcLayout meta={meta} onNavigate={onNavigate}>
      <BirthDetailsForm onResult={r=>setResult(r)} buttonLabel="Calculate Dasha" />
      {result && (
        <ResultBox>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:'#0D1B3E', marginBottom:4, textAlign:'center' }}>Vimshottari Dasha Timeline</div>
          <div style={{ fontSize:13, color:'#A07850', textAlign:'center', marginBottom:20 }}>Moon in {result.positions.MOON.nakshatra} Nakshatra</div>
          {result.dasha.currentDasha && (
            <div style={{ padding:'16px', background:'linear-gradient(135deg,#E8890C15,#F5C84215)', borderRadius:12, border:'2px solid #E8890C', marginBottom:16 }}>
              <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#E8890C', marginBottom:6 }}>Current Mahadasha</div>
              <div style={{ fontSize:26, fontWeight:800, color:'#0D1B3E', fontFamily:"'Playfair Display',serif" }}>{result.dasha.currentDasha.planet} ({result.dasha.currentDasha.years} yrs)</div>
              <div style={{ fontSize:13, color:'#6B4C2A', marginTop:4 }}>
                Until {new Date(result.dasha.currentDasha.end).toLocaleDateString('en-IN',{year:'numeric',month:'long'})}
              </div>
            </div>
          )}
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {result.dasha.dashas.map((d,i) => {
              const now = new Date(), s=new Date(d.start), e=new Date(d.end);
              const active = now>=s && now<=e;
              const past = e<now;
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:10, background:active?'rgba(232,137,12,0.07)':past?'rgba(0,0,0,0.02)':'rgba(13,27,62,0.02)', border:`1px solid ${active?'#E8890C':'#EDD9B8'}`, opacity:past?0.6:1 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:DASHA_COLORS[d.planet]||'#A07850', flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <span style={{ fontWeight:700, color:'#0D1B3E', fontSize:14 }}>{d.planet}</span>
                    <span style={{ color:'#A07850', fontSize:12, marginLeft:8 }}>{d.years} years</span>
                  </div>
                  <div style={{ fontSize:12, color:'#6B4C2A' }}>{s.getFullYear()} – {e.getFullYear()}</div>
                  {active && <div style={{ fontSize:11, fontWeight:700, color:'#E8890C', background:'rgba(232,137,12,0.1)', padding:'2px 8px', borderRadius:10 }}>NOW</div>}
                </div>
              );
            })}
          </div>
        </ResultBox>
      )}
    </CalcLayout>
  );
}

function AtmakarakaCalc({ meta, onNavigate }) {
  const [result, setResult] = React.useState(null);
  const calc = (data) => {
    const planets = ['SUN','MOON','MARS','MERCURY','JUPITER','VENUS','SATURN'];
    const withDeg = planets.map(p => ({ planet:p, degree:data.positions[p].degree }));
    withDeg.sort((a,b) => b.degree - a.degree);
    const atma = withDeg[0];
    const dara = withDeg[withDeg.length-1];
    const atmaDescs = { SUN:'Sun as Atmakaraka: Your soul seeks recognition, authority, and leadership. Serve humbly and the Sun blesses you with power.', MOON:'Moon as Atmakaraka: Your soul seeks nourishment, care, and emotional fulfilment. Nurture others and inner peace follows.', MARS:'Mars as Atmakaraka: Your soul seeks courage, discipline, and righteous action. Channel ambition into purposeful deeds.', MERCURY:'Mercury as Atmakaraka: Your soul seeks knowledge, communication, and skill. Teaching and writing are your spiritual paths.', JUPITER:'Jupiter as Atmakaraka: Your soul seeks wisdom, dharma, and spiritual growth. The guru within leads you forward.', VENUS:'Venus as Atmakaraka: Your soul seeks beauty, love, and harmony. Devotion and creative expression are your path.', SATURN:'Saturn as Atmakaraka: Your soul seeks detachment, service, and justice. Hard work and humility unlock your destiny.', RAHU:'Rahu as Atmakaraka: Your soul seeks transcendence beyond conventional limits. Embrace transformation.' };
    setResult({ atma, dara, all: withDeg, data });
  };
  return (
    <CalcLayout meta={meta} onNavigate={onNavigate}>
      <BirthDetailsForm onResult={calc} buttonLabel="Find Atmakaraka" />
      {result && (
        <ResultBox>
          <div style={{ textAlign:'center', marginBottom:20 }}>
            <div style={{ fontSize:64 }}>👑</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:800, color:'#E8890C', margin:'4px 0' }}>{result.atma.planet}</div>
            <div style={{ fontSize:14, color:'#A07850', marginBottom:12 }}>Atmakaraka — Soul Significator ({result.atma.degree.toFixed(2)}°)</div>
            <div style={{ fontSize:14, color:'#6B4C2A', lineHeight:1.7, maxWidth:440, margin:'0 auto 20px', padding:'12px', background:'rgba(232,137,12,0.05)', borderRadius:12 }}>
              {atmaDescs[result.atma.planet] || `${result.atma.planet} as Atmakaraka guides your soul's journey.`}
            </div>
            <div style={{ padding:'12px 16px', background:'rgba(21,101,192,0.05)', borderRadius:12, display:'inline-block' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#1565C0', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>💑 Darakaraka (Spouse Significator)</div>
              <div style={{ fontSize:20, fontWeight:800, color:'#1565C0' }}>{result.dara.planet} ({result.dara.degree.toFixed(2)}°)</div>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {result.all.map((p,i)=>(
              <div key={p.planet} style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 12px', borderRadius:8, background:i===0?'rgba(232,137,12,0.06)':i===result.all.length-1?'rgba(21,101,192,0.06)':'rgba(13,27,62,0.02)' }}>
                <span style={{ fontSize:16 }}>{PLANET_EMOJI[p.planet]||'🔵'}</span>
                <span style={{ flex:1, fontSize:14, fontWeight:600, color:'#0D1B3E' }}>{p.planet}</span>
                <span style={{ fontSize:13, color:'#A07850' }}>{p.degree.toFixed(2)}° in sign</span>
                {i===0 && <span style={{ fontSize:11, fontWeight:700, color:'#E8890C', background:'rgba(232,137,12,0.1)', padding:'2px 8px', borderRadius:8 }}>AK</span>}
                {i===result.all.length-1 && <span style={{ fontSize:11, fontWeight:700, color:'#1565C0', background:'rgba(21,101,192,0.1)', padding:'2px 8px', borderRadius:8 }}>DK</span>}
              </div>
            ))}
          </div>
        </ResultBox>
      )}
    </CalcLayout>
  );
}

function IshtaDevataCalc({ meta, onNavigate }) {
  const [result, setResult] = React.useState(null);
  const calc = (data) => {
    const lagnaIdx = data.positions.LAGNA.rashiIndex;
    const h12Rashi = (lagnaIdx + 11) % 12;
    const lords = ['MARS','VENUS','MERCURY','MOON','SUN','MERCURY','VENUS','MARS','JUPITER','SATURN','SATURN','JUPITER'];
    const h12Lord = lords[h12Rashi];
    const devatas = { SUN:'Lord Surya / Rama', MOON:'Lord Shiva / Krishna', MARS:'Lord Hanuman / Kartikeya', MERCURY:'Lord Vishnu / Ganesha', JUPITER:'Lord Vishnu / Brahma', VENUS:'Goddess Lakshmi / Durga', SATURN:'Lord Shani / Shiva', RAHU:'Goddess Durga / Saraswati', KETU:'Lord Ganesha / Shiva' };
    const mantra = { SUN:'Om Suryaya Namah', MOON:'Om Chandraya Namah', MARS:'Om Angarakaya Namah', MERCURY:'Om Budhaya Namah', JUPITER:'Om Brihaspataye Namah', VENUS:'Om Shukraya Namah', SATURN:'Om Shanaischaraya Namah', RAHU:'Om Rahave Namah', KETU:'Om Ketave Namah' };
    setResult({ h12Lord, devata: devatas[h12Lord]||'Seek guidance from a pandit', mantra: mantra[h12Lord], h12Rashi: ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'][h12Rashi] });
  };
  return (
    <CalcLayout meta={meta} onNavigate={onNavigate}>
      <BirthDetailsForm onResult={calc} buttonLabel="Find Ishta Devata" />
      {result && (
        <ResultBox>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:64 }}>🙏</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:800, color:'#4A148C', margin:'8px 0 4px' }}>{result.devata}</div>
            <div style={{ fontSize:14, color:'#A07850', marginBottom:16 }}>Your Ishta Devata (Personal Deity)</div>
            <div style={{ padding:'16px', background:'rgba(74,20,140,0.05)', borderRadius:12, marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#4A148C', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Calculation Basis</div>
              <div style={{ fontSize:13, color:'#6B4C2A', lineHeight:1.7 }}>
                12th house is in <strong>{result.h12Rashi}</strong>, ruled by <strong>{result.h12Lord}</strong>.<br/>
                The lord of the 12th house from the Lagna indicates the deity most aligned with your soul's liberation path.
              </div>
            </div>
            {result.mantra && (
              <div style={{ padding:'14px 20px', background:'rgba(74,20,140,0.08)', borderRadius:12, fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, color:'#4A148C', letterSpacing:'0.05em' }}>
                🕉️ {result.mantra}
              </div>
            )}
          </div>
        </ResultBox>
      )}
    </CalcLayout>
  );
}

function TransitCalc({ meta, onNavigate }) {
  const [result, setResult] = React.useState(null);
  const [transitData, setTransitData] = React.useState(null);
  const calc = async (data, info) => {
    setResult(data);
    // Also fetch today's transits
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`${CALC_BACKEND}/kundali/calculate`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ dateOfBirth: today, timeOfBirth:'12:00', latitude: info.lat, longitude: info.lon }),
      });
      const j = await res.json();
      setTransitData(j.data);
    } catch(e) {}
  };
  const isMobile = useMobile();
  return (
    <CalcLayout meta={meta} onNavigate={onNavigate}>
      <p style={{ fontSize:13, color:'#6B4C2A', marginBottom:16, lineHeight:1.6 }}>Enter your birth details to see current planetary positions over your natal chart.</p>
      <BirthDetailsForm onResult={calc} buttonLabel="View Transit Chart" />
      {result && transitData && (
        <ResultBox>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:'#0D1B3E', marginBottom:16, textAlign:'center' }}>Natal vs Current Transits</div>
          <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'auto 1fr 1fr', gap:8, marginBottom:8 }}>
            <div style={{ fontWeight:700, fontSize:12, color:'#A07850', textTransform:'uppercase' }}>Planet</div>
            <div style={{ fontWeight:700, fontSize:12, color:'#1565C0', textTransform:'uppercase' }}>Natal Position</div>
            <div style={{ fontWeight:700, fontSize:12, color:'#E8890C', textTransform:'uppercase' }}>Transit Today</div>
          </div>
          {['SUN','MOON','MARS','MERCURY','JUPITER','VENUS','SATURN','RAHU'].map(p=>(
            <div key={p} style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'auto 1fr 1fr', gap:8, padding:'8px 0', borderBottom:'1px solid #EDD9B8', alignItems:'center' }}>
              <div style={{ fontSize:14, fontWeight:600, color:'#0D1B3E', display:'flex', alignItems:'center', gap:6 }}><span>{PLANET_EMOJI[p]}</span>{p}</div>
              <div style={{ fontSize:13, color:'#1565C0' }}>{result.positions[p]?.rashi} {result.positions[p]?.degree.toFixed(0)}°</div>
              <div style={{ fontSize:13, color:'#E8890C' }}>{transitData.positions[p]?.rashi} {transitData.positions[p]?.degree.toFixed(0)}°</div>
            </div>
          ))}
        </ResultBox>
      )}
    </CalcLayout>
  );
}

function DarakarakaCalc({ meta, onNavigate }) {
  const [result, setResult] = React.useState(null);
  const calc = (data) => {
    const planets = ['SUN','MOON','MARS','MERCURY','JUPITER','VENUS','SATURN'];
    const withDeg = planets.map(p => ({ planet:p, degree:data.positions[p].degree, rashi:data.positions[p].rashi, nakshatra:data.positions[p].nakshatra }));
    withDeg.sort((a,b) => a.degree - b.degree);
    const dara = withDeg[0];
    const spouseDescs = { SUN:'Your spouse will be dignified, authoritative, and well-regarded in society. Likely from a respectable family.', MOON:'Your spouse will be caring, nurturing, and emotionally intuitive. A warm and loving home is important to them.', MARS:'Your spouse will be energetic, ambitious, and assertive. They have a strong personality and natural leadership.', MERCURY:'Your spouse will be intelligent, communicative, and witty. They may be younger or involved in business or writing.', JUPITER:'Your spouse will be wise, dharmic, and generous. A teacher-like quality and great moral strength.', VENUS:'Your spouse will be beautiful, artistic, and charming. They appreciate beauty, comfort, and the finer things.', SATURN:'Your spouse will be mature, responsible, and hardworking. An older soul who values discipline and commitment.' };
    setResult({ dara, all: withDeg, desc: spouseDescs[dara.planet] });
  };
  return (
    <CalcLayout meta={meta} onNavigate={onNavigate}>
      <BirthDetailsForm onResult={calc} buttonLabel="Find Darakaraka" />
      {result && (
        <ResultBox>
          <div style={{ textAlign:'center', marginBottom:20 }}>
            <div style={{ fontSize:64 }}>💑</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:800, color:'#1565C0', margin:'4px 0' }}>{result.dara.planet}</div>
            <div style={{ fontSize:14, color:'#A07850', marginBottom:12 }}>Darakaraka — Spouse Significator ({result.dara.degree.toFixed(2)}° in {result.dara.rashi})</div>
            <div style={{ fontSize:14, color:'#6B4C2A', lineHeight:1.7, maxWidth:440, margin:'0 auto 20px', padding:'12px 16px', background:'rgba(21,101,192,0.05)', borderRadius:12, textAlign:'left' }}>
              {result.desc}
            </div>
          </div>
          <div style={{ fontSize:12, fontWeight:700, color:'#A07850', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Karaka Degrees (ascending)</div>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {result.all.map((p,i)=>(
              <div key={p.planet} style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 12px', borderRadius:8, background:i===0?'rgba(21,101,192,0.06)':'rgba(13,27,62,0.02)' }}>
                <span style={{ fontSize:16 }}>{PLANET_EMOJI[p.planet]||'🔵'}</span>
                <span style={{ flex:1, fontSize:14, fontWeight:600, color:'#0D1B3E' }}>{p.planet}</span>
                <span style={{ fontSize:13, color:'#A07850' }}>{p.degree.toFixed(2)}° · {p.rashi}</span>
                {i===0 && <span style={{ fontSize:11, fontWeight:700, color:'#1565C0', background:'rgba(21,101,192,0.1)', padding:'2px 8px', borderRadius:8 }}>DK</span>}
              </div>
            ))}
          </div>
        </ResultBox>
      )}
    </CalcLayout>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CALCULATORS HUB — /astrology-calculators
// ══════════════════════════════════════════════════════════════════════════════

const CALC_CATEGORIES = [...new Set(CALC_META.map(c=>c.category))];

function CalculatorsHub({ onNavigate }) {
  const isMobile = useMobile();
  const [activeCategory, setActiveCategory] = React.useState('All');
  const filtered = activeCategory==='All' ? CALC_META : CALC_META.filter(c=>c.category===activeCategory);

  return (
    <div style={{ background:'#FFF9F0', minHeight:'100vh' }}>
      {/* Hero */}
      <section style={{ background:'linear-gradient(135deg,#060D20 0%,#0D1B3E 60%,#1A0A4E 100%)', padding: isMobile?'48px 16px 40px':'72px 24px 56px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, rgba(245,200,66,0.05) 1px, transparent 1px)', backgroundSize:'30px 30px', pointerEvents:'none' }} />
        <div style={{ maxWidth:860, margin:'0 auto', textAlign:'center', position:'relative' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'#F5C842', marginBottom:14 }}>✦ Vedic Astrology Tools</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile?28:52, fontWeight:800, color:'white', lineHeight:1.15, margin:'0 0 16px' }}>
            Free Astrology Calculators
          </h1>
          <p style={{ fontSize: isMobile?14:17, color:'rgba(253,246,236,0.7)', lineHeight:1.75, maxWidth:600, margin:'0 auto', marginBottom:0 }}>
            20 free Vedic astrology tools — from numerology and love compatibility to birth charts, doshas, and planetary dashas.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <div style={{ background:'white', borderBottom:'1px solid #EDD9B8', padding:'0 16px', overflowX:'auto' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', gap:0 }}>
          {['All', ...CALC_CATEGORIES].map(cat => (
            <button key={cat} onClick={()=>setActiveCategory(cat)}
              style={{ padding: isMobile?'12px 14px':'14px 20px', background:'none', border:'none', borderBottom:`2.5px solid ${activeCategory===cat?'#E8890C':'transparent'}`, color:activeCategory===cat?'#E8890C':'#6B4C2A', fontWeight:activeCategory===cat?700:500, fontSize: isMobile?12:13, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit', transition:'all 150ms' }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile?'24px 16px 48px':'40px 24px 72px' }}>
        <div style={{ display:'grid', gridTemplateColumns: isMobile?'repeat(2,1fr)':'repeat(4,1fr)', gap: isMobile?12:20 }}>
          {filtered.map(calc => <CalcCard key={calc.slug} calc={calc} onNavigate={onNavigate} />)}
        </div>
      </div>

      {/* CTA */}
      <section style={{ background:'linear-gradient(135deg,#060D20,#0D1B3E)', padding: isMobile?'48px 16px':'64px 24px', textAlign:'center' }}>
        <div style={{ maxWidth:560, margin:'0 auto' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'#F5C842', marginBottom:12 }}>✦ Deeper Insights</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile?24:36, fontWeight:800, color:'white', margin:'0 0 12px', lineHeight:1.2 }}>Want Your Full Kundali Reading?</h2>
          <p style={{ fontSize: isMobile?13:15, color:'rgba(253,246,236,0.6)', marginBottom:28, lineHeight:1.7 }}>These calculators give individual insights. Your complete birth chart ties everything together — get the full picture for free.</p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <KBButton variant="primary" onClick={() => onNavigate('kundali')}>Get Free Kundali</KBButton>
            <KBButton variant="ghost" onClick={() => onNavigate('chat')}>Talk to a Pandit</KBButton>
          </div>
        </div>
      </section>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CALCULATOR ROUTER
// ══════════════════════════════════════════════════════════════════════════════

const CALC_COMPONENTS = {
  'love-calculator-by-name':         LoveCalc,
  'flames-calculator':               FlamesCalc,
  'friendship-calculator':           FriendshipCalc,
  'numerology-calculator':           NumerologyCalc,
  'lucky-vehicle-number-calculator': LuckyVehicleCalc,
  'lo-shu-grid-calculator':          LoShuCalc,
  'sun-sign-calculator':             SunSignCalc,
  'moon-phase-calculator':           MoonPhaseCalc,
  'moon-sign-calculator':            MoonSignCalc,
  'ascendant-calculator':            AscendantCalc,
  'nakshatra-calculator':            NakshatraCalc,
  'birth-chart-calculator':          BirthChartCalc,
  'mangal-dosha-calculator':         MangalDoshaCalc,
  'kaal-sarp-dosh-calculator':       KaalSarpCalc,
  'sade-sati-calculator':            SadeSatiCalc,
  'dasha-calculator':                DashaCalc,
  'atmakaraka-calculator':           AtmakarakaCalc,
  'ishta-devata-calculator':         IshtaDevataCalc,
  'transit-chart-calculator':        TransitCalc,
  'darakaraka-calculator':           DarakarakaCalc,
};

function CalculatorsPage({ path, onNavigate }) {
  // path examples: 'astrology-calculators', 'love-calculator-by-name'
  const slug = path === 'astrology-calculators' ? null : path;
  const meta = slug ? CALC_META.find(c => c.slug === slug) : null;
  const Comp = slug ? CALC_COMPONENTS[slug] : null;

  if (!slug) return <CalculatorsHub onNavigate={onNavigate} />;
  if (!Comp || !meta) return (
    <div style={{ minHeight:'60vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
      <div style={{ fontSize:48 }}>🔮</div>
      <div style={{ fontSize:20, fontWeight:700, color:'#0D1B3E' }}>Calculator Not Found</div>
      <button onClick={() => onNavigate('astrology-calculators')} style={{ padding:'10px 24px', background:'#E8890C', color:'white', border:'none', borderRadius:8, cursor:'pointer', fontWeight:600 }}>View All Calculators</button>
    </div>
  );
  return <Comp meta={meta} onNavigate={onNavigate} />;
}

Object.assign(window, { CalculatorsPage, CALC_SLUGS, CALC_META });
