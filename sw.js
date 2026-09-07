const CACHE = 'mlbb-flex-v4-shell';
const SHELL = ['./','index.html','style.css','script.js','api.js','catalog-local.js','hero-skin-catalog.js','manifest.json','skins-live.json','feature-engine.js','sw.js'];
const PUBLIC_PATH = /^(?:\/(?:index\.html|style\.css|script\.js|api\.js|catalog-local\.js|hero-skin-catalog\.js|feature-engine\.js|manifest\.json|skins-live\.json|sw\.js)|\/assets\/)/;

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin === location.origin && PUBLIC_PATH.test(u.pathname)) {
    e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(r => {
      if (!r.ok) return r;
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    })));
    return;
  }
  if (u.protocol === 'https:' && /raw\.githubusercontent\.com$/.test(u.hostname) && /\.(png|jpe?g|webp|gif|svg)$/i.test(u.pathname)) {
    e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(r => {
      if (!r.ok) return r;
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    })));
  }
});
