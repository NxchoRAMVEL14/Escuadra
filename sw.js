/* Escuadra · service worker: funciona sin internet y se actualiza solo. Cambia VERSION en cada entrega. */
const VERSION = 'escuadra-v1.16.0';
const SHELL = ['./', 'index.html', 'styles.css', 'config.js', 'data.js', 'ideas.js', 'temas.js', 'core.js', 'views.js', 'perfil.js', 'paquete.js', 'clases.js', 'presentador.js', 'semaforo.js', 'figuras.js', 'videos.js', 'estrategias.js', 'tutoria.js', 'dinamicas.js', 'libreta.js', 'banco.js', 'examen.js', 'practicas.js', 'repaso.js', 'proyecto.js', 'industria.js', 'reconoce.js', 'aprobar.js', 'retro.js', 'mibanco.js', 'cierre.js', 'rapido.js', 'aula.js', 'captura.js', 'pendientes.js', 'camara.js', 'omr.js', 'evidencias.js', 'formularios.js', 'cam-worker.js', 'lib-qrcode.js', 'lib-jsqr.js', 'lib-aruco.js', 'print.js', 'app.js', 'manifest.json', 'icon.svg', 'icon-192.png', 'icon-512.png', 'sc-lista.png', 'sc-clase.png', 'sc-cierre.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
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
    // primero la red, preguntando siempre al servidor si hay versión nueva (no-cache); sin internet usa la copia guardada
    e.respondWith(fetch(new Request(url.href, { cache: 'no-cache', credentials: 'same-origin' })).then(r => { if (r.ok) { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); } return r; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('index.html'))));
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
