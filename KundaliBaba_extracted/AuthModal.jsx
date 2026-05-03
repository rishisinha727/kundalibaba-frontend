// ============================================================
// KundaliBaba — Auth Modal (Google Login)
// ============================================================

const GOOGLE_CLIENT_ID = '112774249048-rfnms6tnvqi4d6gcaureisbqfd2jb7de.apps.googleusercontent.com';

function AuthModal({ onClose, onSuccess }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [status, setStatus] = React.useState('loading'); // 'loading' | 'ready' | 'error'
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    // Store callback globally to avoid stale closure
    window.__kbGoogleCallback = async (response) => {
      setLoading(true);
      setError('');
      try {
        const res = await KBApi.googleLogin(response.credential);
        Auth.setToken(res.data.accessToken);
        Auth.setRefresh(res.data.refreshToken);
        Auth.setUser(res.data.user);
        onSuccess(res.data.user);
        onClose();
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };

    let attempts = 0;
    const tryRender = () => {
      attempts++;
      if (containerRef.current && window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: window.__kbGoogleCallback,
          });
          window.google.accounts.id.renderButton(containerRef.current, {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            width: 328,
          });
          setStatus('ready');
        } catch (e) {
          setStatus('error');
          setError('Google Sign-In failed to load. Please refresh the page.');
        }
      } else if (attempts < 40) {
        setTimeout(tryRender, 250);
      } else {
        setStatus('error');
        setError('Google Sign-In could not be loaded. Please refresh the page.');
      }
    };

    // Wait 400ms for modal to fully render before trying
    const t = setTimeout(tryRender, 400);
    return () => {
      clearTimeout(t);
      delete window.__kbGoogleCallback;
    };
  }, []);

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(6,13,32,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: 'white', borderRadius: 20, padding: 36, width: '100%', maxWidth: 400, boxShadow: '0 24px 64px rgba(13,27,62,0.2)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 18, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#A07850', lineHeight: 1 }}>×</button>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔮</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: '#0D1B3E', margin: '0 0 6px' }}>Login to KundaliBaba</h2>
          <p style={{ fontSize: 13, color: '#A07850', margin: 0 }}>Sign in to get your Kundali and more</p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', fontSize: 14, color: '#A07850', marginBottom: 16 }}>Signing in...</div>
        )}

        {error && (
          <div style={{ fontSize: 13, color: '#C62828', background: 'rgba(198,40,40,0.07)', padding: '10px 14px', borderRadius: 8, marginBottom: 16, textAlign: 'center' }}>{error}</div>
        )}

        {/* Google Sign-In button container — fixed 328px width */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div ref={containerRef} style={{ width: 328, minHeight: 44 }}>
            {status === 'loading' && (
              <div style={{ width: 328, height: 44, border: '1px solid #dadce0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#A07850', gap: 8 }}>
                <span>⟳</span> Loading Google Sign-In...
              </div>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: 12, color: '#A07850', marginTop: 8 }}>
          By continuing, you agree to our Terms &amp; Privacy Policy
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AuthModal });
