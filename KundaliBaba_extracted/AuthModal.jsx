// ============================================================
// KundaliBaba — Auth Modal (Google + Phone OTP Login)
// ============================================================

const GOOGLE_CLIENT_ID = '112774249048-rfnms6tnvqi4d6gcaureisbqfd2jb7de.apps.googleusercontent.com';

function AuthModal({ onClose, onSuccess }) {
  const [step, setStep] = React.useState('main'); // 'main' | 'phone' | 'otp'
  const [phone, setPhone] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [devOtp, setDevOtp] = React.useState(null);
  const googleBtnRef = React.useRef(null);

  const inputSt = {
    height: 48, padding: '0 16px', border: '1.5px solid #EDD9B8', borderRadius: 10,
    background: 'white', fontFamily: 'inherit', fontSize: 16, color: '#1A0A00',
    outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'border-color 150ms',
  };

  // Initialize Google Sign-In button when on main step
  React.useEffect(() => {
    if (step !== 'main') return;
    const interval = setInterval(() => {
      if (googleBtnRef.current && window.google?.accounts?.id) {
        clearInterval(interval);
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredential,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: 328,
          text: 'signin_with',
          shape: 'rectangular',
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, [step]);

  const handleGoogleCredential = async (response) => {
    setLoading(true); setError('');
    try {
      const res = await KBApi.googleLogin(response.credential);
      Auth.setToken(res.data.accessToken);
      Auth.setRefresh(res.data.refreshToken);
      Auth.setUser(res.data.user);
      onSuccess(res.data.user);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    if (phone.replace(/\D/g, '').length < 10) { setError('Enter a valid 10-digit mobile number'); return; }
    setLoading(true); setError('');
    try {
      const res = await KBApi.sendOtp(phone.replace(/\D/g, ''));
      if (res.data?.devOtp) setDevOtp(res.data.devOtp);
      setStep('otp');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length < 4) { setError('Enter the OTP'); return; }
    setLoading(true); setError('');
    try {
      const res = await KBApi.verifyOtp(phone.replace(/\D/g, ''), otp);
      Auth.setToken(res.data.accessToken);
      Auth.setRefresh(res.data.refreshToken);
      Auth.setUser(res.data.user);
      onSuccess(res.data.user);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,13,32,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 36, width: '100%', maxWidth: 400, boxShadow: '0 24px 64px rgba(13,27,62,0.2)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 18, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#A07850', lineHeight: 1 }}>×</button>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔮</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: '#0D1B3E', margin: '0 0 6px' }}>
            {step === 'main' ? 'Login to KundaliBaba' : step === 'phone' ? 'Enter Mobile Number' : 'Enter OTP'}
          </h2>
          <p style={{ fontSize: 13, color: '#A07850', margin: 0 }}>
            {step === 'main' ? 'Choose how you want to continue' : step === 'phone' ? 'Enter your mobile number' : `OTP sent to +91 ${phone}`}
          </p>
        </div>

        {/* ── Main step: Google only ── */}
        {step === 'main' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            {loading && <div style={{ fontSize: 13, color: '#A07850' }}>Signing in with Google…</div>}
            {error && <div style={{ fontSize: 13, color: '#C62828', background: 'rgba(198,40,40,0.07)', padding: '8px 12px', borderRadius: 8, width: '100%', textAlign: 'center' }}>{error}</div>}

            {/* Google button rendered here */}
            <div ref={googleBtnRef} style={{ minHeight: 44 }} />

            <div style={{ textAlign: 'center', fontSize: 12, color: '#A07850' }}>By continuing, you agree to our Terms &amp; Privacy Policy</div>
          </div>
        )}

        {/* ── Phone step ── */}
        {step === 'phone' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#6B4C2A', fontWeight: 600 }}>+91</span>
              <input
                value={phone} onChange={e => setPhone(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendOtp()}
                placeholder="Mobile number"
                maxLength={10}
                style={{ ...inputSt, paddingLeft: 48 }}
                onFocus={e => e.target.style.borderColor = '#E8890C'}
                onBlur={e => e.target.style.borderColor = '#EDD9B8'}
              />
            </div>
            {error && <div style={{ fontSize: 13, color: '#C62828', background: 'rgba(198,40,40,0.07)', padding: '8px 12px', borderRadius: 8 }}>{error}</div>}
            <KBButton variant="primary" size="lg" onClick={sendOtp} disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Sending…' : 'Send OTP →'}
            </KBButton>
            <button onClick={() => { setStep('main'); setError(''); }} style={{ background: 'none', border: 'none', color: '#E8890C', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
              ← Back
            </button>
          </div>
        )}

        {/* ── OTP step ── */}
        {step === 'otp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {devOtp && (
              <div style={{ background: 'rgba(46,125,50,0.08)', border: '1px solid rgba(46,125,50,0.25)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#2E7D32', fontWeight: 600 }}>
                📱 SMS not configured — your OTP is: <strong style={{ fontSize: 18, letterSpacing: 4 }}>{devOtp}</strong>
              </div>
            )}
            <input
              value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyDown={e => e.key === 'Enter' && verifyOtp()}
              placeholder="Enter 6-digit OTP"
              style={{ ...inputSt, textAlign: 'center', letterSpacing: 8, fontSize: 22, fontWeight: 700 }}
              onFocus={e => e.target.style.borderColor = '#E8890C'}
              onBlur={e => e.target.style.borderColor = '#EDD9B8'}
            />
            {error && <div style={{ fontSize: 13, color: '#C62828', background: 'rgba(198,40,40,0.07)', padding: '8px 12px', borderRadius: 8 }}>{error}</div>}
            <KBButton variant="primary" size="lg" onClick={verifyOtp} disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Verifying…' : 'Verify & Login'}
            </KBButton>
            <button onClick={() => { setStep('phone'); setOtp(''); setError(''); setDevOtp(null); }} style={{ background: 'none', border: 'none', color: '#E8890C', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
              ← Change number
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { AuthModal });
