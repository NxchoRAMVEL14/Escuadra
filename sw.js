/* Escuadra · service worker: funciona sin internet y se actualiza solo. Cambia VERSION en cada entrega. */
const VERSION = 'escuadra-v1.27.16';
const SHELL = ['./', 'index.html', 'styles.css', 'config.js', 'escuadra.min.js', 'tutora.html', 'encuesta.html', 'ver.html', 'consulta.html', 'repaso.html', 'm1s1.js', 'm1s2.js', 'm1s3.js', 'm2s1.js', 'm3s1.js', 'm3s2.js', 'm3s3.js', 'm4s1.js', 'm4s2.js', 'm5s1.js', 'm5s2.js', 'cam-worker.js', 'lib-qrcode.js', 'lib-jsqr.js', 'lib-aruco.js', 'manifest.json', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'icon-apple-180.png', 'favicon-32.png', 'sc-lista.png', 'sc-clase.png', 'sc-cierre.png'];

const SHELL_SET = new Set(SHELL.map(x => x === './' ? 'index.html' : x));
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL.map(x => new Request(x, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.endsWith('supabase.co') || url.hostname.endsWith('supabase.in')) return; // datos: siempre en línea
  if (url.origin === self.location.origin) {
    // v1.27: lo de la app abre directo de la copia guardada (rápido aunque haya mala señal). La versión nueva llega
    // cuando cambia este archivo (sw.js): se descarga completa en segundo plano y se usa al volver a abrir.
    const p = url.pathname.replace(/^.*\//, '') || 'index.html';
    if (p === 'config.js' || !SHELL_SET.has(p)) {
      e.respondWith(fetch(new Request(url.href, { cache: 'no-cache', credentials: 'same-origin' })).then(r => { if (r.ok) { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); } return r; })
        .catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('index.html'))));
      return;
    }
    e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(r => { if (r.ok) { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); } return r; })).catch(() => caches.match('index.html')));
    return;
  }
  if (/cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com/.test(url.hostname)) {
    e.respondWith(caches.open(VERSION).then(async c => {
      const hit = await c.match(req); if (hit) return hit;
      const r = await fetch(req); if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r;
    }));
  }
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then(list => list.length ? list[0].focus() : self.clients.openWindow('./#/inicio')));
});
