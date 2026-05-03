// ============================================================
// KundaliBaba — API Layer
// ============================================================

const API_BASE = 'https://kundalibaba-backend-production.up.railway.app/api/v1';

const Auth = {
  getToken: () => localStorage.getItem('kb_token'),
  setToken: (t) => localStorage.setItem('kb_token', t),
  setRefresh: (t) => localStorage.setItem('kb_refresh', t),
  getRefresh: () => localStorage.getItem('kb_refresh'),
  clear: () => { localStorage.removeItem('kb_token'); localStorage.removeItem('kb_refresh'); localStorage.removeItem('kb_user'); },
  setUser: (u) => localStorage.setItem('kb_user', JSON.stringify(u)),
  getUser: () => { try { return JSON.parse(localStorage.getItem('kb_user')); } catch { return null; } },
  isLoggedIn: () => !!localStorage.getItem('kb_token'),
};

async function apiFetch(path, options = {}) {
  const token = Auth.getToken();
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || 'Something went wrong');
  return json;
}

const KBApi = {
  // Auth
  googleLogin: (idToken) => apiFetch('/auth/google', { method: 'POST', body: JSON.stringify({ idToken }) }),
  sendOtp: (phone) => apiFetch('/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }) }),
  verifyOtp: (phone, otp) => apiFetch('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp }) }),
  getMe: () => apiFetch('/auth/me'),
  logout: (refreshToken) => apiFetch('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) }),

  // Kundali
  generateKundali: (data) => apiFetch('/kundali', { method: 'POST', body: JSON.stringify(data) }),
  listKundalis: () => apiFetch('/kundali'),
  matchKundali: (data) => apiFetch('/kundali/match', { method: 'POST', body: JSON.stringify(data) }),

  // Geocode city to lat/lon using OpenStreetMap (free, no key needed)
  geocode: async (place) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    const results = await res.json();
    if (!results.length) throw new Error('City not found. Please enter a valid city name.');
    return { lat: parseFloat(results[0].lat), lon: parseFloat(results[0].lon) };
  },
};

Object.assign(window, { KBApi, Auth });
