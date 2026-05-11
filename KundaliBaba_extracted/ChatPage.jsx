// ============================================================
// KundaliBaba — ChatPage  (v=20)
// Astrologer listing → Profile → Live chat (Socket.io)
// ============================================================

const CONSULT_API = (window.KBApi && window.KBApi.BASE) || 'https://kundalibaba-backend-production.up.railway.app/api/v1';

// ── Socket loader (loaded once) ──────────────────────────────────────────────
let _consultSocket = null;
function getConsultSocket() {
  if (_consultSocket) return _consultSocket;
  if (typeof io === 'undefined') return null;
  _consultSocket = io(CONSULT_API.replace('/api/v1', ''), {
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5,
    auth: {}, // guest connection - no token needed
  });
  return _consultSocket;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmtTime(ts) {
  const d = ts ? new Date(ts) : new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function fmtSecs(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
function uid() {
  return 'guest_' + Math.random().toString(36).slice(2, 10);
}

// ── API helpers ──────────────────────────────────────────────────────────────
async function apiGetConsult(path) {
  const res = await fetch(`${CONSULT_API}${path}`);
  if (!res.ok) throw new Error(await res.text());
  const j = await res.json();
  return j.data;
}
async function apiPostConsult(path, body) {
  const res = await fetch(`${CONSULT_API}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  const j = await res.json();
  return j.data;
}

// ── SkillBadge ───────────────────────────────────────────────────────────────
function SkillBadge({ skill }) {
  const colors = {
    'Vedic Astrology': '#FF6600', 'KP Astrology': '#9333ea', 'Lal Kitab': '#dc2626',
    'Nadi Astrology': '#0891b2', 'Numerology': '#059669', 'Tarot Reading': '#7c3aed',
    'Palmistry': '#b45309', 'Vastu Shastra': '#0d9488',
  };
  const bg = colors[skill] || '#6B7280';
  return (
    <span style={{
      background: bg + '18', color: bg, border: `1px solid ${bg}44`,
      borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
    }}>{skill}</span>
  );
}

// ── AstrologerCard ───────────────────────────────────────────────────────────
function AstrologerCard({ p, onSelect }) {
  const statusColor = p.isOnline ? '#22c55e' : '#94a3b8';
  const statusText  = p.isOnline ? 'Online' : 'Offline';
  return (
    <div onClick={() => onSelect(p)} style={{
      background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      padding: '18px 16px', cursor: 'pointer', transition: 'transform .15s, box-shadow .15s',
      border: p.featured ? '2px solid #FF6600' : '1px solid #f1f5f9',
      position: 'relative', overflow: 'hidden',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'; }}
    >
      {p.featured && (
        <div style={{
          position: 'absolute', top: 0, right: 0, background: '#FF6600', color: '#fff',
          fontSize: 10, fontWeight: 700, padding: '3px 10px', borderBottomLeftRadius: 10,
        }}>⭐ FEATURED</div>
      )}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%', background: p.avatarColor || '#6366f1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 18, fontWeight: 700, letterSpacing: 1,
          }}>{(p.avatarInitials || p.name.slice(0,2)).toUpperCase()}</div>
          <span style={{
            position: 'absolute', bottom: 2, right: 2, width: 11, height: 11,
            borderRadius: '50%', background: statusColor, border: '2px solid #fff',
          }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 2 }}>{p.name}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>
            {p.skills.slice(0,3).join(' · ')}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
            {p.skills.slice(0,2).map(s => <SkillBadge key={s} skill={s} />)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600 }}>★ {p.rating.toFixed(1)}</span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>({p.reviewCount})</span>
              <span style={{ fontSize: 11, color: '#64748b' }}>{p.experience} yrs</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#FF6600' }}>₹{p.pricePerMin}/min</div>
              <div style={{ fontSize: 10, color: statusColor, fontWeight: 600 }}>{statusText}</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#94a3b8' }}>📍 {p.city}</span>
        <span style={{ fontSize: 11, color: '#94a3b8' }}>🗣️ {p.languages.join(', ')}</span>
      </div>
    </div>
  );
}

// ── ProfileView ──────────────────────────────────────────────────────────────
function AstrologerProfileView({ p, onBack, onStartChat }) {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', paddingBottom: 80 }}>
      <button onClick={onBack} style={{
        background: 'none', border: 'none', color: '#FF6600', fontWeight: 600,
        cursor: 'pointer', padding: '12px 0', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6,
      }}>← Back to Astrologers</button>

      <div style={{
        background: '#fff', borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        padding: 24, marginBottom: 16,
      }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', background: p.avatarColor || '#6366f1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 26, fontWeight: 700, flexShrink: 0,
          }}>{(p.avatarInitials || p.name.slice(0,2)).toUpperCase()}</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 4px', fontSize: 20, color: '#1e293b' }}>{p.name}</h2>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{p.skills.slice(0,4).join(' · ')}</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: '#f59e0b', fontWeight: 600 }}>★ {p.rating.toFixed(1)}</span>
              <span style={{ fontSize: 13, color: '#64748b' }}>({p.reviewCount} reviews)</span>
              <span style={{ fontSize: 13, color: '#64748b' }}>{p.experience} yrs exp</span>
              <span style={{ fontSize: 13, color: p.isOnline ? '#22c55e' : '#94a3b8', fontWeight: 600 }}>
                ● {p.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16, padding: '14px 0', borderTop: '1px solid #f1f5f9' }}>
          <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#1e293b' }}>About</h4>
          <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{p.bio}</p>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
          marginTop: 16, padding: '14px 0', borderTop: '1px solid #f1f5f9',
        }}>
          {[
            { label: 'Total Chats', value: p.totalChats ? p.totalChats.toLocaleString() : '—' },
            { label: 'Languages', value: p.languages.join(', ') },
            { label: 'City', value: p.city },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h4 style={{ margin: '0 0 12px', fontSize: 14, color: '#1e293b' }}>Specialisations</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {p.skills.map(s => <SkillBadge key={s} skill={s} />)}
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #FF6600 0%, #ff8c42 100%)',
        borderRadius: 16, padding: 20, color: '#fff',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>₹{p.pricePerMin}<span style={{ fontSize: 14, fontWeight: 400 }}>/min</span></div>
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>First 3 mins FREE · Cancel anytime</div>
          </div>
          <button onClick={() => onStartChat(p)} style={{
            background: '#fff', color: '#FF6600', border: 'none', borderRadius: 12,
            padding: '12px 28px', fontWeight: 700, fontSize: 15, cursor: 'pointer',
          }}>
            {p.isOnline ? '💬 Chat Now' : '📅 Request Consultation'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ChatView ─────────────────────────────────────────────────────────────────
function LiveChatView({ session, persona, onBack }) {
  const [messages, setMessages]     = React.useState(session.messages || []);
  const [input, setInput]           = React.useState('');
  const [elapsed, setElapsed]       = React.useState(session.totalSeconds || 0);
  const [cost, setCost]             = React.useState(session.totalCost || 0);
  const [status, setStatus]         = React.useState(session.status || 'waiting');
  const [sending, setSending]       = React.useState(false);
  const [ended, setEnded]           = React.useState(false);
  const messagesRef                 = React.useRef(null);
  const timerRef                    = React.useRef(null);
  const socketRef                   = React.useRef(null);

  React.useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  React.useEffect(() => {
    const sock = getConsultSocket();
    socketRef.current = sock;
    if (!sock) return;
    sock.emit('consult:join', { sessionId: session._id, role: 'user' });
    sock.on('consult:new_message', (msg) => setMessages(prev => [...prev, msg]));
    sock.on('consult:admin_joined', () => setStatus('active'));
    sock.on('consult:timer_tick', ({ totalSeconds, totalCost }) => {
      setElapsed(totalSeconds);
      setCost(totalCost);
    });
    sock.on('consult:ended', () => {
      setEnded(true);
      setStatus('ended');
      if (timerRef.current) clearInterval(timerRef.current);
    });
    return () => {
      sock.off('consult:new_message');
      sock.off('consult:admin_joined');
      sock.off('consult:timer_tick');
      sock.off('consult:ended');
    };
  }, [session._id]);

  React.useEffect(() => {
    if (status === 'active' && !ended) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status, ended]);

  const sendMessage = async () => {
    if (!input.trim() || sending || ended) return;
    const text = input.trim();
    setInput('');
    setSending(true);
    try {
      setMessages(prev => [...prev, { sender: 'user', content: text, timestamp: new Date().toISOString() }]);
      const sock = socketRef.current || getConsultSocket();
      if (sock) sock.emit('consult:user_message', { sessionId: session._id, content: text });
      else await apiPostConsult(`/consult/sessions/${session._id}/message`, { content: text });
    } catch (err) { console.error('Send failed', err); }
    finally { setSending(false); }
  };

  const endConsultation = () => {
    const sock = socketRef.current || getConsultSocket();
    if (sock) sock.emit('consult:end', { sessionId: session._id });
    setEnded(true); setStatus('ended');
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #f1f5f9',
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#64748b', padding: 4 }}>←</button>
        <div style={{
          width: 40, height: 40, borderRadius: '50%', background: persona.avatarColor || '#6366f1',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700, flexShrink: 0,
        }}>{(persona.avatarInitials || persona.name.slice(0,2)).toUpperCase()}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{persona.name}</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: status === 'active' ? '#22c55e' : status === 'waiting' ? '#f59e0b' : '#94a3b8' }}>
            {status === 'waiting' ? '⏳ Waiting for astrologer…' : status === 'active' ? '🟢 Connected' : '🔴 Session ended'}
          </div>
        </div>
        {status === 'active' && !ended && (
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#FF6600', fontFamily: 'monospace' }}>{fmtSecs(elapsed)}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>₹{cost.toFixed(2)}</div>
          </div>
        )}
        {!ended && (
          <button onClick={endConsultation} style={{
            background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8,
            padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
          }}>End</button>
        )}
      </div>

      {ended && (
        <div style={{
          background: '#f0fdf4', borderBottom: '1px solid #bbf7d0',
          padding: '10px 16px', textAlign: 'center', fontSize: 13, color: '#166534',
        }}>
          ✅ Ended · {fmtSecs(elapsed)} · ₹{cost.toFixed(2)}
          <button onClick={onBack} style={{
            marginLeft: 16, background: '#FF6600', color: '#fff', border: 'none',
            borderRadius: 8, padding: '4px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 600,
          }}>Back to Listing</button>
        </div>
      )}

      {/* Messages */}
      <div ref={messagesRef} style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>
          Session started with {persona.name} · First 3 minutes free
        </div>
        {messages.map((msg, i) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={i} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
              {!isUser && (
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', background: persona.avatarColor || '#6366f1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 10, fontWeight: 700, flexShrink: 0, marginRight: 8, alignSelf: 'flex-end',
                }}>{(persona.avatarInitials || persona.name.slice(0,2)).toUpperCase()}</div>
              )}
              <div style={{
                maxWidth: '72%',
                background: isUser ? '#FF6600' : '#fff',
                color: isUser ? '#fff' : '#1e293b',
                borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding: '10px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                fontSize: 14, lineHeight: 1.5,
              }}>
                <div>{msg.content}</div>
                <div style={{ fontSize: 10, opacity: 0.65, marginTop: 4, textAlign: isUser ? 'right' : 'left' }}>
                  {fmtTime(msg.timestamp)}
                </div>
              </div>
            </div>
          );
        })}
        {status === 'waiting' && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', background: persona.avatarColor || '#6366f1',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700,
            }}>{(persona.avatarInitials || persona.name.slice(0,2)).toUpperCase()}</div>
            <div style={{ background: '#fff', borderRadius: '18px 18px 18px 4px', padding: '12px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#94a3b8', animation: `dotpulse 1.4s ${i*0.2}s ease-in-out infinite` }} />)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      {!ended && (
        <div style={{ background: '#fff', borderTop: '1px solid #f1f5f9', padding: '12px 16px', display: 'flex', gap: 10, flexShrink: 0 }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Type your message…"
            rows={1}
            style={{
              flex: 1, border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '10px 14px',
              fontSize: 14, resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.5,
            }}
            onFocus={e => e.target.style.borderColor = '#FF6600'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
          <button onClick={sendMessage} disabled={!input.trim() || sending} style={{
            width: 44, height: 44, borderRadius: '50%', border: 'none',
            background: input.trim() ? '#FF6600' : '#e2e8f0',
            color: input.trim() ? '#fff' : '#94a3b8', cursor: input.trim() ? 'pointer' : 'default', fontSize: 18,
          }}>➤</button>
        </div>
      )}
      <style>{`@keyframes dotpulse { 0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)} }`}</style>
    </div>
  );
}

// ── StartChatModal ────────────────────────────────────────────────────────────
function StartChatModal({ persona, onClose, onConfirm }) {
  const [name, setName]       = React.useState('');
  const [email, setEmail]     = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [err, setErr]         = React.useState('');

  const handleStart = async () => {
    if (!name.trim()) { setErr('Please enter your name'); return; }
    setLoading(true); setErr('');
    try {
      const guestId = uid();
      const session = await apiPostConsult('/consult/sessions', {
        userId:    guestId,
        userName:  name.trim(),
        userEmail: email.trim(),
        personaId: persona._id,
      });
      onConfirm(session, { id: guestId, name: name.trim() });
    } catch (e) {
      setErr('Could not start session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#fff', borderRadius: '20px 20px 0 0', padding: '28px 24px 40px',
        width: '100%', maxWidth: 480, boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%', background: persona.avatarColor || '#6366f1',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 700,
          }}>{(persona.avatarInitials || persona.name.slice(0,2)).toUpperCase()}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#1e293b' }}>{persona.name}</div>
            <div style={{ fontSize: 13, color: '#FF6600' }}>₹{persona.pricePerMin}/min · First 3 mins free</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Enter your name to begin the consultation.</div>
        <input type="text" placeholder="Your name *" value={name} onChange={e => setName(e.target.value)}
          style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '12px 14px', fontSize: 14, marginBottom: 12, boxSizing: 'border-box', outline: 'none' }}
          onFocus={e => e.target.style.borderColor = '#FF6600'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
        />
        <input type="email" placeholder="Email (optional)" value={email} onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '12px 14px', fontSize: 14, marginBottom: 16, boxSizing: 'border-box', outline: 'none' }}
          onFocus={e => e.target.style.borderColor = '#FF6600'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
        />
        {err && <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 12 }}>{err}</div>}
        <button onClick={handleStart} disabled={loading} style={{
          width: '100%', background: '#FF6600', color: '#fff', border: 'none',
          borderRadius: 12, padding: 14, fontSize: 16, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
        }}>{loading ? 'Starting…' : '💬 Start Consultation'}</button>
        <button onClick={onClose} style={{ width: '100%', background: 'none', border: 'none', marginTop: 10, color: '#64748b', fontSize: 14, cursor: 'pointer', padding: 8 }}>Cancel</button>
      </div>
    </div>
  );
}

// ── Main ChatPage ─────────────────────────────────────────────────────────────
function ChatPage({ onNavigate, tweaks, user, onShowAuth }) {
  const [view, setView]                 = React.useState('list');
  const [astrologers, setAstrologers]   = React.useState([]);
  const [total, setTotal]               = React.useState(0);
  const [loading, setLoading]           = React.useState(true);
  const [page, setPage]                 = React.useState(1);
  const [search, setSearch]             = React.useState('');
  const [filterSkill, setFilterSkill]   = React.useState('');
  const [filterCity, setFilterCity]     = React.useState('');
  const [onlineOnly, setOnlineOnly]     = React.useState(false);
  const [sortBy, setSortBy]             = React.useState('rating');
  const [selectedPersona, setSelectedPersona] = React.useState(null);
  const [startModal, setStartModal]     = React.useState(null);
  const [activeSession, setActiveSession] = React.useState(null);
  const [guestInfo, setGuestInfo]       = React.useState(null);
  const [cities, setCities]             = React.useState([]);
  const LIMIT = 12;

  React.useEffect(() => {
    apiGetConsult('/personas/cities').then(d => setCities(d || [])).catch(() => {});
  }, []);

  React.useEffect(() => {
    if (view !== 'list') return;
    setLoading(true);
    const params = new URLSearchParams({ page, limit: LIMIT, sortBy });
    if (search)      params.set('search', search);
    if (filterSkill) params.set('skill', filterSkill);
    if (filterCity)  params.set('city', filterCity);
    if (onlineOnly)  params.set('online', 'true');
    apiGetConsult(`/personas?${params}`)
      .then(d => { setAstrologers(d.items || d || []); setTotal(d.total || 0); })
      .catch(() => setAstrologers([]))
      .finally(() => setLoading(false));
  }, [view, page, search, filterSkill, filterCity, onlineOnly, sortBy]);

  const totalPages = Math.ceil(total / LIMIT);

  const handleSelectPersona = (p) => { setSelectedPersona(p); setView('profile'); window.scrollTo(0,0); };
  const handleStartChat     = (p) => setStartModal(p);
  const handleConfirmSession = (session, guest) => {
    setStartModal(null);
    setActiveSession(session);
    setGuestInfo(guest);
    setView('chat');
    window.scrollTo(0,0);
  };

  if (view === 'chat' && activeSession) {
    return (
      <LiveChatView
        session={activeSession}
        persona={selectedPersona}
        onBack={() => { setView('list'); setActiveSession(null); setGuestInfo(null); }}
      />
    );
  }

  if (view === 'profile' && selectedPersona) {
    return (
      <div style={{ padding: '16px', maxWidth: 700, margin: '0 auto' }}>
        {startModal && <StartChatModal persona={startModal} onClose={() => setStartModal(null)} onConfirm={handleConfirmSession} />}
        <AstrologerProfileView p={selectedPersona} onBack={() => { setView('list'); window.scrollTo(0,0); }} onStartChat={handleStartChat} />
      </div>
    );
  }

  // ── Listing ──
  const QUICK_SKILLS = ['Vedic Astrology','KP Astrology','Numerology','Tarot Reading','Lal Kitab','Vastu Shastra','Palmistry'];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {startModal && <StartChatModal persona={startModal} onClose={() => setStartModal(null)} onConfirm={handleConfirmSession} />}

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0D1B3E 0%, #1a2d5a 50%, #0D1B3E 100%)',
        padding: '32px 16px 24px', textAlign: 'center',
      }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#fff' }}>🔮 Chat with Astrologers</h1>
        <p style={{ margin: '8px 0 20px', fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
          5000+ verified astrologers · Real-time consultation · First 3 mins free
        </p>
        <div style={{
          display: 'flex', gap: 8, maxWidth: 500, margin: '0 auto',
          background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: 6,
        }}>
          <input type="text" placeholder="Search by name or speciality…" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{
              flex: 1, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 8,
              padding: '10px 14px', fontSize: 14, outline: 'none', color: '#1e293b',
            }}
          />
        </div>
      </div>

      {/* Quick skill filters */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', padding: '12px 16px' }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {['', ...QUICK_SKILLS].map(s => (
            <button key={s} onClick={() => { setFilterSkill(s); setPage(1); }} style={{
              flexShrink: 0, padding: '6px 16px', borderRadius: 20,
              border: filterSkill === s ? 'none' : '1px solid #e2e8f0',
              background: filterSkill === s ? '#FF6600' : '#f8fafc',
              color: filterSkill === s ? '#fff' : '#64748b',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
            }}>{s || 'All'}</button>
          ))}
        </div>
      </div>

      {/* Filters row */}
      <div style={{ padding: '12px 16px', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={filterCity} onChange={e => { setFilterCity(e.target.value); setPage(1); }}
          style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 12px', fontSize: 13, color: '#475569', background: '#fff', cursor: 'pointer' }}>
          <option value="">All Cities</option>
          {cities.slice(0, 100).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}
          style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 12px', fontSize: 13, color: '#475569', background: '#fff', cursor: 'pointer' }}>
          <option value="rating">Top Rated</option>
          <option value="experience">Most Experienced</option>
          <option value="pricePerMin_asc">Price: Low to High</option>
          <option value="totalChats">Most Popular</option>
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: '#475569' }}>
          <input type="checkbox" checked={onlineOnly} onChange={e => { setOnlineOnly(e.target.checked); setPage(1); }} style={{ accentColor: '#22c55e' }} />
          Online Now
        </label>
        <div style={{ marginLeft: 'auto', fontSize: 13, color: '#94a3b8' }}>
          {loading ? 'Loading…' : `${total.toLocaleString()} astrologers`}
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: '0 16px 32px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {Array(6).fill(0).map((_, i) => (
              <div key={i} style={{
                background: '#e2e8f0', borderRadius: 16, height: 160,
                animation: 'shimmer 1.5s ease-in-out infinite',
              }} />
            ))}
          </div>
        ) : astrologers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔮</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#475569' }}>No astrologers found</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Try adjusting your filters</div>
            <button onClick={() => { setFilterSkill(''); setFilterCity(''); setOnlineOnly(false); setSearch(''); setPage(1); }}
              style={{ marginTop: 16, background: '#FF6600', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', cursor: 'pointer', fontWeight: 600 }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {astrologers.map(p => <AstrologerCard key={p._id} p={p} onSelect={handleSelectPersona} />)}
            </div>
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} style={{
                  padding: '8px 18px', borderRadius: 8, border: '1px solid #e2e8f0',
                  background: page===1 ? '#f8fafc' : '#fff', color: page===1 ? '#94a3b8' : '#475569',
                  cursor: page===1 ? 'default' : 'pointer', fontWeight: 600, fontSize: 13,
                }}>← Prev</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pg = Math.max(1, Math.min(page-2, totalPages-4)) + i;
                  return (
                    <button key={pg} onClick={() => setPage(pg)} style={{
                      width: 36, height: 36, borderRadius: 8, border: 'none',
                      background: page===pg ? '#FF6600' : '#fff', color: page===pg ? '#fff' : '#475569',
                      cursor: 'pointer', fontWeight: 600, fontSize: 13, boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    }}>{pg}</button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} style={{
                  padding: '8px 18px', borderRadius: 8, border: '1px solid #e2e8f0',
                  background: page===totalPages ? '#f8fafc' : '#fff', color: page===totalPages ? '#94a3b8' : '#475569',
                  cursor: page===totalPages ? 'default' : 'pointer', fontWeight: 600, fontSize: 13,
                }}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
      <style>{`@keyframes shimmer{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
}
