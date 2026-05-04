export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // Cloudflare Workers html-clean-url + SPA mode causes an infinite 307 loop
    // for /admin because admin.html exists. Explicitly serve admin.html here.
    if (url.pathname === '/admin' || url.pathname === '/admin/') {
      return env.ASSETS.fetch(new Request(new URL('/admin.html', url), request));
    }
    return env.ASSETS.fetch(request);
  },
};
