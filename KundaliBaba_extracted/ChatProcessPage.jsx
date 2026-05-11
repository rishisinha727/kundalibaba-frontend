// ============================================================
// KundaliBaba — ChatProcessPage  (v=1)
// Admin dashboard for managing all live consultations
// Route: /chat-process
// ============================================================

const ADMIN_API = (window.KBApi && window.KBApi.BASE) || 'https://kundalibaba-backend-production.up.railway.app/api/v1';

// ── Socket (admin mode) ───────────────────────────────────────────────────────
let _adminSocket = null;
function getAdminSocket() {
  if (_adminSocket) return _adminSocket;
  if (typeof io === 'undefined') return null;
  _adminSocket = io(ADMIN_API.replace('/api/v1', ''), {
    transports: ['websocket', 'polling'],
    auth: {},
  });
  return _adminSocket;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtSecsAdmin(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
function fmtTimeAdmin(ts) {
  return ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
}
async function adminFetch(path, opts = {}) {
  const res = await fetch(`${ADMIN_API}${path}`, {
    headers: { 'content-type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()).data;
}

// ── SessionTimer (ticking clock per session) ─────────────────────────────────
function SessionTimer({ session }) {
  const [secs, setSecs] = React.useState(session.totalSeconds || 0);
  const timerRef        = React.useRef(null);

  React.useEffect(() => {
    setSecs(session.totalSeconds || 0);
    if (session.status === 'active') {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => setSecs(s => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [session._id, session.status, session.totalSeconds]);

  const cost = ((secs / 60) * (session.pricePerMin || 0)).toFixed(2);
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: session.status === 'active' ? '#FF6600' : '#94a3b8', fontFamily: 'monospace' }}>
        {fmtSecsAdmin(secs)}
      </div>
      <div style={{ fontSize: 11, color: '#64748b' }}>₹{cost}</div>
    </div>
  );
}

// ── SessionCard (left panel) ──────────────────────────────────────────────────
function SessionCard({ session, isActive, onClick }) {
  const lastMsg = session.messages && session.messages.length > 0
    ? session.messages[session.messages.length - 1]
    : null;
  const unread = session.messages ? session.messages.filter(m => m.sender === 'user' && !m.read).length : 0;

  const statusColor = { waiting: '#f59e0b', active: '#22c55e', ended: '#94a3b8' }[session.status] || '#94a3b8';

  return (
    <div onClick={onClick} style={{
      padding: '14px 16px', cursor: 'pointer',
      background: isActive ? '#fff7f0' : '#fff',
      borderLeft: isActive ? '3px solid #FF6600' : '3px solid transparent',
      borderBottom: '1px solid #f1f5f9',
      transition: 'background .15s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {session.userName}
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            via {session.personaName}
          </div>
          {lastMsg && (
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {lastMsg.sender === 'admin' ? '→ ' : ''}{lastMsg.content}
            </div>
          )}
        </div>
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: statusColor, fontWeight: 700, textTransform: 'uppercase' }}>{session.status}</div>
          {unread > 0 && (
            <div style={{
              marginTop: 4, background: '#FF6600', color: '#fff', borderRadius: '50%',
              width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, marginLeft: 'auto',
            }}>{unread}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main ChatProcessPage ──────────────────────────────────────────────────────
function ChatProcessPage({ onNavigate }) {
  const [sessions, setSessions]       = React.useState([]);
  const [activeId, setActiveId]       = React.useState(null);
  const [messages, setMessages]       = React.useState([]);
  const [reply, setReply]             = React.useState('');
  const [sending, setSending]         = React.useState(false);
  const [loading, setLoading]         = React.useState(true);
  const [personas, setPersonas]       = React.useState([]);
  const [switchPersonaId, setSwitchPersonaId] = React.useState('');
  const [filter, setFilter]           = React.useState('all'); // all | waiting | active | ended
  const [toastMsg, setToastMsg]       = React.useState('');
  const messagesRef                   = React.useRef(null);
  const socketRef                     = React.useRef(null);
  const toastTimer                    = React.useRef(null);

  const activeSession = sessions.find(s => s._id === activeId);

  // Toast
  const showToast = (msg) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(''), 3000);
  };

  // Fetch active sessions on mount
  const fetchSessions = async () => {
    try {
      const data = await adminFetch('/consult/sessions/active');
      setSessions(data || []);
    } catch (err) { console.error('Failed to fetch sessions', err); }
    finally { setLoading(false); }
  };

  React.useEffect(() => {
    fetchSessions();
    // Refresh every 30s
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch personas for switcher
  React.useEffect(() => {
    adminFetch('/personas?limit=200&sortBy=rating').then(d => setPersonas(d.items || [])).catch(() => {});
  }, []);

  // Auto-scroll messages
  React.useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  // When active session changes, load its messages
  React.useEffect(() => {
    if (!activeId) return;
    const session = sessions.find(s => s._id === activeId);
    if (session) {
      setMessages(session.messages || []);
      setSwitchPersonaId('');
    }
  }, [activeId, sessions]);

  // Socket setup
  React.useEffect(() => {
    const sock = getAdminSocket();
    socketRef.current = sock;
    if (!sock) return;

    // Join admin room
    if (activeId) sock.emit('consult:join', { sessionId: activeId, role: 'admin' });

    sock.on('consult:new_message', (msg) => {
      setMessages(prev => [...prev, msg]);
      // Update session's messages in state too
      setSessions(prev => prev.map(s => {
        if (s._id !== activeId) return s;
        return { ...s, messages: [...(s.messages || []), msg] };
      }));
    });

    sock.on('consult:user_message_notify', ({ sessionId, personaName, content, userName }) => {
      showToast(`💬 ${userName} → ${personaName}: ${content.slice(0, 40)}…`);
      // Refresh sessions to pick up new unread
      fetchSessions();
    });

    sock.on('consult:session_ended', ({ sessionId }) => {
      setSessions(prev => prev.map(s => s._id === sessionId ? { ...s, status: 'ended' } : s));
    });

    return () => {
      sock.off('consult:new_message');
      sock.off('consult:user_message_notify');
      sock.off('consult:session_ended');
    };
  }, [activeId]);

  // When switching active session, re-join socket room
  const selectSession = (id) => {
    const sock = socketRef.current || getAdminSocket();
    if (sock && id) sock.emit('consult:join', { sessionId: id, role: 'admin' });
    setActiveId(id);
  };

  const sendReply = async () => {
    if (!reply.trim() || sending || !activeId) return;
    const text = reply.trim();
    setReply('');
    setSending(true);
    try {
      const optimistic = { sender: 'admin', content: text, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, optimistic]);
      const sock = socketRef.current || getAdminSocket();
      if (sock) {
        sock.emit('consult:admin_reply', { sessionId: activeId, content: text });
      } else {
        await adminFetch(`/consult/sessions/${activeId}/admin-reply`, {
          method: 'POST',
          body: JSON.stringify({ content: text }),
        });
      }
      // Move session to active if it was waiting
      setSessions(prev => prev.map(s =>
        s._id === activeId && s.status === 'waiting'
          ? { ...s, status: 'active', startTime: new Date().toISOString() }
          : s
      ));
    } catch (err) {
      console.error('Reply failed', err);
    } finally {
      setSending(false);
    }
  };

  const endSession = async (id) => {
    try {
      await adminFetch(`/consult/sessions/${id}/end`, { method: 'POST', body: '{}' });
      const sock = socketRef.current || getAdminSocket();
      if (sock) sock.emit('consult:end', { sessionId: id });
      setSessions(prev => prev.map(s => s._id === id ? { ...s, status: 'ended' } : s));
      showToast('Session ended');
    } catch (err) { console.error('End session failed', err); }
  };

  // Quick reply templates
  const QUICK_REPLIES = [
    'Namaste 🙏 I am here to assist you. Please share your date, time and place of birth.',
    'Please wait a moment while I analyse your kundali.',
    'Based on your birth chart, I can see that Saturn is currently transiting your 7th house.',
    'Your Mahadasha period is quite favourable for career growth this year.',
    'I recommend wearing a Yellow Sapphire (Pukhraj) on the index finger of your right hand.',
    'Thank you for this consultation. May Shri Ganesh bless you with success and happiness 🙏',
  ];

  const filteredSessions = sessions.filter(s => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const waitingCount = sessions.filter(s => s.status === 'waiting').length;
  const activeCount  = sessions.filter(s => s.status === 'active').length;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', fontFamily: 'inherit', overflow: 'hidden' }}>

      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: 'fixed', top: 16, right: 16, background: '#1e293b', color: '#fff',
          padding: '12px 20px', borderRadius: 12, fontSize: 13, zIndex: 9999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)', maxWidth: 320,
        }}>{toastMsg}</div>
      )}

      {/* ── Left Panel: Session list ──────────────────────────────────── */}
      <div style={{
        width: 300, flexShrink: 0, background: '#fff', borderRight: '1px solid #f1f5f9',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Chat Process</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              {waitingCount > 0 && (
                <span style={{
                  background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a',
                  borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700,
                }}>{waitingCount} waiting</span>
              )}
              {activeCount > 0 && (
                <span style={{
                  background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0',
                  borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700,
                }}>{activeCount} active</span>
              )}
            </div>
          </div>
          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 4 }}>
            {['all','waiting','active','ended'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                flex: 1, padding: '5px 0', borderRadius: 8, border: 'none',
                background: filter === f ? '#FF6600' : '#f1f5f9',
                color: filter === f ? '#fff' : '#64748b',
                fontSize: 11, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
              }}>{f}</button>
            ))}
          </div>
        </div>

        {/* Session list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Loading sessions…</div>
          ) : filteredSessions.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔮</div>
              <div style={{ fontSize: 13 }}>No {filter !== 'all' ? filter : ''} sessions</div>
            </div>
          ) : (
            filteredSessions.map(s => (
              <SessionCard
                key={s._id}
                session={s}
                isActive={s._id === activeId}
                onClick={() => selectSession(s._id)}
              />
            ))
          )}
        </div>

        {/* Refresh */}
        <div style={{ padding: '10px 16px', borderTop: '1px solid #f1f5f9', flexShrink: 0 }}>
          <button onClick={fetchSessions} style={{
            width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8,
            padding: '8px', fontSize: 12, color: '#64748b', cursor: 'pointer',
          }}>↻ Refresh</button>
        </div>
      </div>

      {/* ── Right Panel: Active chat ──────────────────────────────────── */}
      {!activeId ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 64 }}>💬</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Select a session</div>
          <div style={{ fontSize: 14, color: '#94a3b8' }}>Click a session from the list to start replying</div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Chat header */}
          <div style={{
            background: '#fff', borderBottom: '1px solid #f1f5f9',
            padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b' }}>
                {activeSession?.userName}
                <span style={{ marginLeft: 8, fontSize: 12, color: '#94a3b8', fontWeight: 400 }}>
                  via {activeSession?.personaName}
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                ₹{activeSession?.pricePerMin}/min
                {activeSession?.userEmail ? ` · ${activeSession.userEmail}` : ''}
              </div>
            </div>

            {/* Timer */}
            {activeSession && <SessionTimer session={activeSession} />}

            {/* Persona switcher */}
            <select
              value={switchPersonaId}
              onChange={e => setSwitchPersonaId(e.target.value)}
              style={{
                border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 12px',
                fontSize: 12, color: '#475569', background: '#fff', cursor: 'pointer', maxWidth: 160,
              }}
            >
              <option value="">Switch Persona…</option>
              {personas.slice(0, 50).map(p => (
                <option key={p._id} value={p._id}>{p.name} (₹{p.pricePerMin})</option>
              ))}
            </select>

            {/* End session */}
            {activeSession?.status !== 'ended' && (
              <button onClick={() => endSession(activeId)} style={{
                background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8,
                padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>End Session</button>
            )}
          </div>

          {/* Messages */}
          <div ref={messagesRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8, background: '#f8fafc' }}>
            {activeSession?.status === 'waiting' && (
              <div style={{
                textAlign: 'center', background: '#fef3c7', border: '1px solid #fde68a',
                borderRadius: 10, padding: '10px 16px', fontSize: 13, color: '#d97706', marginBottom: 8,
              }}>
                ⏳ User is waiting for you to reply. Send a message to start the session.
              </div>
            )}
            {messages.map((msg, i) => {
              const isAdmin = msg.sender === 'admin';
              return (
                <div key={i} style={{ display: 'flex', justifyContent: isAdmin ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
                  {!isAdmin && (
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', background: '#6366f1',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 10, fontWeight: 700, flexShrink: 0,
                    }}>U</div>
                  )}
                  <div style={{
                    maxWidth: '68%',
                    background: isAdmin ? '#FF6600' : '#fff',
                    color: isAdmin ? '#fff' : '#1e293b',
                    borderRadius: isAdmin ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    padding: '10px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    fontSize: 14, lineHeight: 1.5,
                  }}>
                    <div>{msg.content}</div>
                    <div style={{ fontSize: 10, opacity: 0.65, marginTop: 4, textAlign: isAdmin ? 'right' : 'left' }}>
                      {fmtTimeAdmin(msg.timestamp)}
                      {isAdmin && <span style={{ marginLeft: 6 }}>✓</span>}
                    </div>
                  </div>
                  {isAdmin && (
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', background: '#FF6600',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 10, fontWeight: 700, flexShrink: 0,
                    }}>A</div>
                  )}
                </div>
              );
            })}
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: '32px 0' }}>
                No messages yet. Reply below to begin.
              </div>
            )}
          </div>

          {/* Quick replies */}
          {activeSession?.status !== 'ended' && (
            <div style={{ padding: '8px 20px', background: '#fff', borderTop: '1px solid #f1f5f9', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                {QUICK_REPLIES.map((qr, i) => (
                  <button key={i} onClick={() => setReply(qr)} style={{
                    flexShrink: 0, padding: '5px 12px', borderRadius: 20, border: '1px solid #e2e8f0',
                    background: '#f8fafc', color: '#475569', fontSize: 11, cursor: 'pointer',
                    whiteSpace: 'nowrap', fontFamily: 'inherit',
                  }}>
                    {qr.slice(0, 30)}…
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          {activeSession?.status !== 'ended' ? (
            <div style={{
              background: '#fff', borderTop: '1px solid #f1f5f9',
              padding: '12px 20px', display: 'flex', gap: 10, flexShrink: 0,
            }}>
              <textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                placeholder="Reply as astrologer…"
                rows={2}
                style={{
                  flex: 1, border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '10px 14px',
                  fontSize: 14, resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.5,
                }}
                onFocus={e => e.target.style.borderColor = '#FF6600'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
              <button onClick={sendReply} disabled={!reply.trim() || sending} style={{
                padding: '0 20px', borderRadius: 12, border: 'none',
                background: reply.trim() ? '#FF6600' : '#e2e8f0',
                color: reply.trim() ? '#fff' : '#94a3b8',
                cursor: reply.trim() ? 'pointer' : 'default',
                fontWeight: 700, fontSize: 14,
              }}>Send</button>
            </div>
          ) : (
            <div style={{ background: '#f0fdf4', borderTop: '1px solid #bbf7d0', padding: '14px 20px', textAlign: 'center', fontSize: 13, color: '#166534' }}>
              ✅ Session ended · Total: {fmtSecsAdmin(activeSession?.totalSeconds || 0)} · ₹{(activeSession?.totalCost || 0).toFixed(2)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
