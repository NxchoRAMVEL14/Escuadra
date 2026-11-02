/* Escuadra · Registro (v1.28). Se carga justo después de core.js para no perder nada.
   1) Errores: lo que falle en la app (pantallas, sincronización, promesas) se anota en este aparato para que, desde
      Ajustes → Reporte de errores, copies un reporte y se lo pases a Claude. No se manda a ningún lado.
   2) Historial del día: cada acción tuya que guarda datos queda anotada con cómo estaban los documentos antes, para
      revertir una en particular (Más → Historial de cambios). Vive solo en este aparato (IndexedDB) y guarda hoy y ayer.
      Se engancha debajo de la protección con PIN: lo cifrado se anota cifrado. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store;

  /* =================== 1) errores =================== */
  const KERR = 'escuadra.errores', MAXE = 30;
  const leeE = () => { try { return JSON.parse(localStorage.getItem(KERR) || '[]') || []; } catch (e) { return []; } };
  const ER = E.errores = {};
  ER.lista = () => leeE();
  ER.borrar = () => { try { localStorage.removeItem(KERR); } catch (e) { } };
  let ultimo = '';
  ER.anota = (err, origen) => {
    try {
      const msg = String((err && (err.message || err.reason || err)) || 'Error desconocido').slice(0, 400);
      const stack = String((err && err.stack) || '').split('\n').slice(0, 8).join('\n').slice(0, 1500);
      const firma = msg + '|' + stack.slice(0, 120), l = leeE();
      // el mismo error que ya se anotó: se queda una vez, con el origen más preciso (pantalla o página antes que «atrapado»)
      if (firma === ultimo) { const x = l[l.length - 1]; if (x && x.o === 'atrapado' && origen && origen !== 'atrapado') { x.o = origen; localStorage.setItem(KERR, JSON.stringify(l)); } return; }
      ultimo = firma; l.push({ t: new Date().toISOString(), v: E.VERSION || '', r: location.hash || '#/', o: origen || 'error', m: msg, s: stack });
      localStorage.setItem(KERR, JSON.stringify(l.slice(-MAXE)));
    } catch (e) { }
  };
  window.addEventListener('error', ev => { if (ev && (ev.error || ev.message)) ER.anota(ev.error || ev.message, 'error'); });
  window.addEventListener('unhandledrejection', ev => ER.anota(ev && ev.reason, 'promesa'));
  // los errores que la app atrapa y manda a la consola también cuentan (solo los que son Error de verdad)
  const ce = console.error.bind(console);
  console.error = function () { try { const e = [].slice.call(arguments).find(x => x instanceof Error); if (e) ER.anota(e, 'atrapado'); } catch (x) { } return ce.apply(null, arguments); };
  ER.reporte = () => {
    const l = leeE(), sy = E.sync || {}, n = Object.keys(S.docs || {}).length;
    const lin = ['Reporte de errores de Escuadra', 'Versión: ' + (E.VERSION || '?'), 'Fecha: ' + new Date().toLocaleString('es-MX'), 'Pantalla: ' + (location.hash || '#/'),
      'Aparato: ' + navigator.userAgent, 'Datos: ' + n + ' documentos · guardado en ' + (S.modo || '?') + ' · sincronización: ' + (sy.msg || sy.state || '?'), ''];
    if (!l.length) lin.push('Sin errores registrados.');
    l.slice(-10).reverse().forEach((x, i) => { lin.push((i + 1) + ') ' + new Date(x.t).toLocaleString('es-MX') + ' · v' + x.v + ' · ' + x.r + ' · ' + x.o); lin.push('   ' + x.m); if (x.s) lin.push(x.s.split('\n').map(s => '   ' + s.trim()).join('\n')); });
    lin.push('', '(No lleva nombres de alumnos ni calificaciones.)');
    return lin.join('\n');
  };

  /* =================== 2) historial del día =================== */
  const HK = 'hist', MAXH = 150;
  const H = E.historial = { dias: {}, listo: false };
  const hoy = () => u.today();
  let tGuarda = 0;
  const guarda = () => { clearTimeout(tGuarda); tGuarda = setTimeout(() => { try { if (E.idb && E.idb.db) E.idb.set(HK, H.dias).catch(() => { }); } catch (e) { } }, 400); };
  H.carga = async () => {
    try { if (E.idb && E.idb.db) { const d = await E.idb.get(HK); if (d && typeof d === 'object') H.dias = d; } } catch (e) { }
    const f = hoy(), ay = u.addDays(f, -1); Object.keys(H.dias).forEach(k => { if (k !== f && k !== ay) delete H.dias[k]; });
    H.listo = true;
  };
  const load0 = S.load; S.load = async function () { const r = await load0.apply(this, arguments); await H.carga(); return r; };
  const foto = k => { const d = S.docs[k]; return d ? { data: d.data == null ? null : u.clone(d.data), deleted: !!d.deleted } : null; };
  let cur = null, curRef = null;
  // agrupa en una entrada todo lo que guarda una misma acción (un toque, un cambio)
  const entrada = () => {
    const ud = E.undo && E.undo.cur; if (!ud) return null;
    if (curRef === ud && cur) return cur;
    const f = hoy(), L = H.dias[f] = H.dias[f] || [];
    cur = { id: u.uid('h'), t: new Date().toISOString(), lbl: ud.lbl || '', r: (location.hash || '#/').slice(2, 60), prev: {}, after: {} };
    curRef = ud; L.push(cur); if (L.length > MAXH) L.splice(0, L.length - MAXH);
    return cur;
  };
  const anota = (k, antes) => {
    if (String(k).indexOf('respaldo:') === 0) return;
    const x = entrada(); if (!x) return;
    if (!Object.prototype.hasOwnProperty.call(x.prev, k)) x.prev[k] = antes;
    x.after[k] = (S.docs[k] || {}).ts || null; guarda();
  };
  const put0 = S.put, del0 = S.del;
  S.put = function (key, data, opt) { const a = foto(key), r = put0.call(this, key, data, opt); anota(key, a); return r; };
  S.del = function (key) { const a = foto(key), r = del0.call(this, key); anota(key, a); return r; };
  H.entradas = f => (H.dias[f || hoy()] || []).slice().reverse();
  H.borrar = () => { H.dias = {}; cur = null; curRef = null; guarda(); };
  // revertir una entrada: cada documento vuelve a como estaba antes de esa acción. Pasa por la entrada normal de datos
  // (Deshacer, solo lectura, registro de calificaciones y protección con PIN), así que se puede deshacer.
  H.cambiadoDespues = x => Object.keys(x.after).filter(k => ((S.docs[k] || {}).ts || null) !== x.after[k]);
  H.revertir = x => {
    const run = fn => (E.undo ? E.undo.run('hist-revertir', fn) : fn());
    H.revirtiendo = true;
    try {
      run(() => Object.keys(x.prev).forEach(k => {
        const p = x.prev[k], hay = S.docs[k] && !S.docs[k].deleted;
        if (!p || p.deleted) { if (hay) S.del(k); } else S.put(k, u.clone(p.data));
      }));
    } finally { H.revirtiendo = false; }
    x.revertida = new Date().toISOString(); guarda(); S.emit('__restore');
  };
})();
