/* Escuadra · Cámara (v1.16): visor de cámara, etiquetas QR para las libretas y tarjetas de respuesta (como Plickers).
   El QR solo lleva un código interno del alumno, nunca su nombre; las tarjetas solo llevan el número de lista.
   Lee con el lector del navegador (BarcodeDetector) o, si no hay, con jsQR; las tarjetas con js-aruco2. Todo en el aparato. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h, UD = E.undo;
  const card = H.card, btn = H.btn, link = H.link, icon = E.icon;
  const CAM = E.cam = {};
  const presente = st => ['A', 'R'].indexOf(st || 'A') >= 0;
  const corto = (t, n) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; };

  /* =================== visor de cámara =================== */
  let st = null;
  CAM.activa = () => !!st;
  CAM.abrir = async cfg => {
    CAM.cerrar(true);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { u.toast('Aquí no se puede usar la cámara: abre Escuadra en Chrome desde su dirección https', 'err', 6000); return false; }
    const el = document.createElement('div'); el.id = 'cam'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', cfg.titulo);
    el.innerHTML = '<div class="cam-top"><b>' + esc(cfg.titulo) + '</b><button type="button" class="iconbtn" data-act="cam-cerrar" aria-label="Cerrar cámara">' + icon('x') + '</button></div>' +
      '<div class="cam-vid"><video playsinline muted autoplay></video><canvas class="cam-ov"></canvas>' + (cfg.guia ? '<div class="cam-guia ' + cfg.guia + '"></div>' : '') + '<p class="cam-msg" id="cam-msg">Abriendo la cámara…</p></div><div class="cam-pan" id="cam-pan"></div>';
    document.body.appendChild(el); document.body.classList.add('con-cam');
    st = { cfg: cfg, el: el, video: el.querySelector('video'), ov: el.querySelector('.cam-ov'), work: document.createElement('canvas'), t: 0, busy: false, raf: 0 };
    CAM.panel();
    const sesion = st;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: cfg.ancho || 1280 }, height: { ideal: cfg.alto || 720 } } });
      if (st !== sesion) { stream.getTracks().forEach(t => t.stop()); return false; }
      st.stream = stream; st.video.srcObject = stream; await st.video.play().catch(() => { });
      const m = document.getElementById('cam-msg'); if (m) m.remove();
      bucle(); return true;
    } catch (e) {
      const m = { NotAllowedError: 'Permite la cámara para Escuadra: toca el candado junto a la dirección → Permisos → Cámara.', NotFoundError: 'No encontré ninguna cámara.', NotReadableError: 'Otra app está usando la cámara: ciérrala e intenta de nuevo.', OverconstrainedError: 'La cámara no acepta esa resolución.' }[e.name] || ('No se pudo abrir la cámara: ' + e.message);
      u.toast(m, 'err', 7000); CAM.cerrar(); return false;
    }
  };
  function bucle() {
    if (!st) return; const v = st.video;
    if (v.readyState >= 2 && v.videoWidth && !st.busy && Date.now() - st.t >= (st.cfg.cada || 180)) {
      st.busy = true; st.t = Date.now(); const ses = st;
      const w = v.videoWidth, h = v.videoHeight, k = Math.min(1, (st.cfg.proc || 960) / Math.max(w, h)), W = Math.round(w * k), Hh = Math.round(h * k), c = st.work;
      if (c.width !== W || c.height !== Hh) { c.width = W; c.height = Hh; }
      const ctx = c.getContext('2d', { willReadFrequently: true }); ctx.drawImage(v, 0, 0, W, Hh);
      Promise.resolve().then(() => st.cfg.frame(c, ctx, W, Hh, v)).then(r => { if (st === ses) dibuja(r || [], W, Hh); }).catch(e => console.warn(e)).finally(() => { if (st === ses) st.busy = false; });
    }
    st.raf = requestAnimationFrame(bucle);
  }
  // dibuja lo detectado encima del video (el video se ve completo: object-fit contain)
  function dibuja(r, W, Hh) {
    const ov = st.ov, box = ov.parentNode.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    const bw = Math.round(box.width * dpr), bh = Math.round(box.height * dpr); if (ov.width !== bw || ov.height !== bh) { ov.width = bw; ov.height = bh; }
    const ctx = ov.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, box.width, box.height);
    const k = Math.min(box.width / W, box.height / Hh), ox = (box.width - W * k) / 2, oy = (box.height - Hh * k) / 2;
    r.forEach(d => {
      if (d.c) { ctx.beginPath(); ctx.arc(ox + d.c[0] * k, oy + d.c[1] * k, Math.max(3, d.c[2] * k), 0, Math.PI * 2); if (d.fill) { ctx.fillStyle = d.fill; ctx.fill(); } ctx.lineWidth = 2; ctx.strokeStyle = d.color || '#1c7c45'; ctx.stroke(); return; }
      if (!d.pts || d.pts.length < 3) return; ctx.beginPath(); d.pts.forEach((p, i) => { const x = ox + p.x * k, y = oy + p.y * k; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }); ctx.closePath();
      ctx.lineWidth = 3; ctx.strokeStyle = d.color || '#1c7c45'; ctx.stroke();
      if (d.label) { const cx = ox + d.pts.reduce((s, p) => s + p.x, 0) / d.pts.length * k, cy = oy + d.pts.reduce((s, p) => s + p.y, 0) / d.pts.length * k; ctx.font = 'bold 16px system-ui, sans-serif'; const tw = ctx.measureText(d.label).width; ctx.fillStyle = d.color || '#1c7c45'; ctx.fillRect(cx - tw / 2 - 5, cy - 12, tw + 10, 24); ctx.fillStyle = '#fff'; ctx.fillText(d.label, cx - tw / 2, cy + 6); }
    });
  }
  CAM.panel = () => { const p = document.getElementById('cam-pan'); if (p && st && st.cfg.panel) p.innerHTML = st.cfg.panel(); };
  CAM.cerrar = silencio => {
    if (!st) return; const s = st; st = null; cancelAnimationFrame(s.raf);
    try { if (s.stream) s.stream.getTracks().forEach(t => t.stop()); } catch (e) { }
    s.el.remove(); document.body.classList.remove('con-cam'); if (!silencio && s.cfg.alCerrar) s.cfg.alCerrar();
  };
  A['cam-cerrar'] = () => CAM.cerrar();
  window.addEventListener('hashchange', () => CAM.cerrar());
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && st) CAM.cerrar(); });
  let ac = null;
  CAM.bip = ok => {
    try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(), gn = ac.createGain(); o.frequency.value = ok === false ? 220 : 880; gn.gain.value = 0.06; o.connect(gn); gn.connect(ac.destination); o.start(); o.stop(ac.currentTime + 0.08); } catch (e) { }
    if (navigator.vibrate) navigator.vibrate(ok === false ? [40, 50, 40] : 25);
  };

  /* =================== QR: generar y leer =================== */
  const QRP = 'ESQ1';
  CAM.qrTexto = (g, a) => QRP + '|' + g.id + '|' + a.id;
  CAM.qrListo = async () => { if (!window.qrcode) await u.loadScript('lib-qrcode.js'); };
  // SVG de un QR (hay que llamar antes a qrListo)
  CAM.qrSVG = (txt, cls, nivel) => {
    const q = window.qrcode(0, nivel || 'M'); q.addData(txt); q.make();
    const n = q.getModuleCount(), m = 4; let d = '';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += 'M' + (c + m) + ' ' + (r + m) + 'h1v1h-1z';
    return '<svg class="' + (cls || 'qr') + '" viewBox="0 0 ' + (n + 2 * m) + ' ' + (n + 2 * m) + '" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#fff"/><path d="' + d + '" fill="#000"/></svg>';
  };
  let lector = null;
  CAM.lectorQR = async () => {
    if (lector) return lector;
    try {
      if ('BarcodeDetector' in window) {
        const f = await window.BarcodeDetector.getSupportedFormats();
        if (f.indexOf('qr_code') >= 0) { const bd = new window.BarcodeDetector({ formats: ['qr_code'] }); lector = async c => (await bd.detect(c)).map(x => ({ txt: x.rawValue, pts: x.cornerPoints })); return lector; }
      }
    } catch (e) { }
    if (!window.jsQR) await u.loadScript('lib-jsqr.js');
    lector = async (c, ctx, W, Hh) => { const img = (ctx || c.getContext('2d', { willReadFrequently: true })).getImageData(0, 0, W || c.width, Hh || c.height); const r = window.jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' }); return r ? [{ txt: r.data, pts: [r.location.topLeftCorner, r.location.topRightCorner, r.location.bottomRightCorner, r.location.bottomLeftCorner] }] : []; };
    return lector;
  };

  /* ---------- etiquetas QR para las libretas ---------- */
  A['qr-print'] = async () => {
    const g = D.grupoActual(), al = D.alumnos(g); if (!al.length) { u.toast('Primero importa tu lista', 'err'); return; }
    await CAM.qrListo(); const cf = D.cfg();
    E.print.run('<div class="pr qr-hoja"><div class="p-title">ETIQUETAS QR PARA LAS LIBRETAS · ' + esc(g.nombre.toUpperCase()) + '</div><p class="tiny c">Recorta y pega cada etiqueta en la portada de la libreta. El código solo trae un número interno de Escuadra, no el nombre. ' + esc(cf.plantel || '') + '</p>' +
      '<div class="qr-grid">' + al.map(a => '<div class="qr-cel">' + CAM.qrSVG(CAM.qrTexto(g, a)) + '<div><b>' + a.num + '</b><span>' + esc(u.corto(a.nombre)) + '</span><small>' + esc(g.nombre) + '</small></div></div>').join('') + '</div></div>', { title: 'Etiquetas QR ' + g.nombre, margin: '8mm' });
  };

  /* ---------- escanear libretas ---------- */
  const MODOS = [['tarea', '📒 Tarea'], ['asis', '✅ Asistencia'], ['part', '⭐ Participación'], ['fc', '💻 Práctica'], ['ficha', '👤 Ficha']];
  const tareasDe = (g, pid) => { try { return E.libreta.tareas(g, pid).cuentan; } catch (e) { return []; } };
  const practicas = () => (E.PRACTICAS || []).slice();
  function escHTML() {
    const s = E.ui.esc, g = D.grupoActual(), ps = D.parciales(), p = E.calc.parcial(s.pid) || E.calc.parcialActual();
    let h = '<div class="filters">' + MODOS.map(m => '<button type="button" class="tab' + (s.modo === m[0] ? ' on' : '') + '" data-act="esc-modo" data-m="' + m[0] + '">' + m[1] + '</button>').join('') + '</div>';
    if (s.modo === 'tarea') {
      const ts = tareasDe(g, p.id);
      h += '<label class="fld"><span>Tarea que revisas (cada QR = ✓ completa; luego puedes cambiarla a ½ o ✗)</span><select data-ch="esc-key">' + (ts.length ? ts.slice().reverse().map(t => '<option value="' + esc(t.key) + '"' + (t.key === s.key ? ' selected' : '') + '>' + (t.f ? u.fCorta(t.f) + ' · ' : '') + esc(corto(t.t, 70)) + '</option>').join('') : '<option value="">No hay tareas en el ' + esc(p.nombre) + '</option>') + '</select></label>';
    } else if (s.modo === 'fc') {
      const pr = practicas(); h += '<label class="fld"><span>Práctica que revisas (cada QR = ✓ completa)</span><select data-ch="esc-prac">' + pr.map(x => '<option value="' + x.id + '"' + (x.id === s.prac ? ' selected' : '') + '>N' + x.nivel + ' · ' + esc(x.t) + '</option>').join('') + '</select></label>';
    } else if (s.modo === 'asis') h += '<p class="small">Pasa lista del <b>' + u.fLarga(s.f) + '</b> escaneando las libretas que te entregan; al final, «Terminar» marca falta a quien no escaneaste.</p>';
    else if (s.modo === 'part') h += '<p class="small">Cada QR suma +1 participación de hoy (el mismo alumno cuenta otra vez después de 6 segundos).</p>';
    else h += '<p class="small">Escanea y se abre la ficha del alumno.</p>';
    h += '<div class="row gap wrap mt">' + btn('📷 Abrir cámara', 'esc-go', '', 'primary') + btn('🖨 Imprimir etiquetas QR', 'qr-print', '', 'small') + '</div>' +
      '<p class="muted small">Acerca cada libreta a unos 15–25 cm. Suena y vibra con cada lectura. Las etiquetas solo traen un número interno, no el nombre.</p>';
    return h;
  }
  A['esc-abrir'] = el => {
    const g = D.grupoActual(); if (!g || !D.alumnos(g).length) { u.toast('Primero importa tu lista', 'err'); return; }
    const p = E.calc.parcialActual(), hoy = u.today(), ts = tareasDe(g, p.id); let key = '';
    try { const sel = E.cierre && E.cierre.tareaSel(g, hoy); key = sel && sel.t ? sel.key : ''; } catch (e) { }
    if (!key && ts.length) key = (ts.filter(t => !t.f || t.f <= hoy).slice(-1)[0] || ts[ts.length - 1]).key;
    const prev = E.ui.esc || {};
    E.ui.esc = { modo: (el && el.dataset && el.dataset.m) || prev.modo || 'tarea', pid: p.id, key: key, prac: prev.prac || ((practicas()[0] || {}).id), f: hoy, vistos: {}, log: [], ult: null };
    E.modal.open('📷 Escanear libretas (QR)', escHTML());
  };
  A['esc-modo'] = el => { E.ui.esc.modo = el.dataset.m; E.modal.body(escHTML()); };
  CH['esc-key'] = el => { E.ui.esc.key = el.value; };
  CH['esc-prac'] = el => { E.ui.esc.prac = el.value; };
  // aplica lo que toca con un alumno escaneado
  CAM.aplicaQR = (txt, ahora) => {
    const g = D.grupoActual(), s = E.ui.esc, p = String(txt || '').split('|'); if (!g || !s) return null;
    if (p[0] !== QRP) return { err: 'Ese QR no es una etiqueta de Escuadra' };
    if (p[1] !== g.id) return { err: 'Esa etiqueta es de otro grupo' };
    const a = D.alumno(g, p[2]); if (!a || a.activo === false) return { err: 'No encontré a ese alumno en la lista' };
    const t = ahora || Date.now(); if (s.vistos[a.id] && t - s.vistos[a.id] < (s.modo === 'part' ? 6000 : 3000)) return null;
    s.vistos[a.id] = t; s.ult = a.id; let msg = '';
    UD.run('qr', () => {
      if (s.modo === 'tarea') {
        if (!s.key) { msg = 'Elige primero la tarea'; return; }
        S.update('libreta:' + g.id + ':' + s.pid, d => { d.marcas = d.marcas || {}; d.quitar = d.quitar || {}; d.poner = d.poner || {}; d.extra = d.extra || []; (d.marcas[a.id] = d.marcas[a.id] || {})[s.key] = 2; }, {});
        E.libreta.sync(g, s.pid); msg = '✓ Tarea completa';
      } else if (s.modo === 'asis') { E.aula.setAsis(g, s.f, a.id, 'A'); msg = '✅ Presente'; }
      else if (s.modo === 'part') { S.update('part:' + g.id + ':' + s.f, d => { d[a.id] = Number(d[a.id] || 0) + 1; }, {}); msg = '⭐ +1 participación (lleva ' + ((S.get('part:' + g.id + ':' + s.f) || {})[a.id] || 1) + ')'; }
      else if (s.modo === 'fc') {
        const pid = s.pid, id = s.prac; S.update('fcal:' + g.id + ':' + pid, d => { d.marcas = d.marcas || {}; d.fechas = d.fechas || {}; d.orden = d.orden || []; (d.marcas[a.id] = d.marcas[a.id] || {})[id] = 2; (d.fechas[a.id] = d.fechas[a.id] || {})[id] = u.today(); if (d.orden.indexOf(id) < 0) d.orden.push(id); }, {});
        E.fc.sync(g, pid); msg = '✓ Práctica completa';
      }
    });
    if (s.modo === 'ficha') { CAM.cerrar(true); E.modal.close(); location.hash = '#/alumno/' + a.id; return { a: a, msg: 'Ficha' }; }
    s.log.unshift({ aid: a.id, t: msg }); s.log = s.log.slice(0, 6); return { a: a, msg: msg };
  };
  const panelQR = () => {
    const s = E.ui.esc, g = D.grupoActual(), a = s.ult && D.alumno(g, s.ult), n = Object.keys(s.vistos).length, al = D.alumnos(g);
    const v = a && s.modo === 'tarea' ? ((((E.libreta.doc(g, s.pid).marcas || {})[a.id]) || {})[s.key]) : null;
    return '<div class="cam-res">' + (a ? '<b>' + a.num + ' · ' + esc(u.corto(a.nombre)) + '</b><span>' + esc((s.log[0] || {}).t || '') + '</span>' : '<span>Apunta al QR de la libreta</span>') + '</div>' +
      (a && s.modo === 'tarea' ? '<div class="cl-seg cam-seg">' + [[2, '✓ Completa', 'ok'], [1, '½ Incompleta', 'warn'], [0, '✗ No la hizo', 'bad']].map(x => btn(x[1], 'esc-cambia', 'data-v="' + x[0] + '"', 'small' + (v != null && Number(v) === x[0] ? ' on ' + x[2] : ''))).join('') + '</div>' : '') +
      '<div class="row between gap wrap"><span class="small">' + n + (n === 1 ? ' escaneado' : ' escaneados') + (s.modo === 'asis' ? ' de ' + al.length : '') + '</span><span class="row gap">' + (s.modo === 'asis' && n ? btn('Terminar: los demás faltan', 'esc-fin-asis', '', 'small') : '') + btn('Listo', 'cam-cerrar', '', 'small primary') + '</span></div>';
  };
  A['esc-go'] = async () => {
    const s = E.ui.esc; if (s.modo === 'tarea' && !s.key) { u.toast('No hay tarea que revisar en este parcial', 'err'); return; }
    E.modal.close(); const leer = await CAM.lectorQR();
    CAM.abrir({ titulo: MODOS.find(m => m[0] === s.modo)[1] + ' · QR', guia: 'qr', cada: 150, proc: 800, panel: panelQR,
      frame: async (c, ctx, W, Hh) => {
        const r = await leer(c, ctx, W, Hh); const out = [];
        r.forEach(x => { const res = CAM.aplicaQR(x.txt); if (res && res.err) { out.push({ pts: x.pts, label: '?', color: '#bf342b' }); if (s.errT !== res.err || Date.now() - (s.errAt || 0) > 4000) { s.errT = res.err; s.errAt = Date.now(); u.toast(res.err, 'err', 2500); CAM.bip(false); } } else { if (res) { CAM.bip(true); CAM.panel(); } out.push({ pts: x.pts, label: '✓', color: '#1c7c45' }); } });
        return out;
      } });
  };
  A['esc-cambia'] = el => {
    const s = E.ui.esc, g = D.grupoActual(), aid = s.ult; if (!aid) return; const v = Number(el.dataset.v);
    S.update('libreta:' + g.id + ':' + s.pid, d => { d.marcas = d.marcas || {}; (d.marcas[aid] = d.marcas[aid] || {})[s.key] = v; }, {}); E.libreta.sync(g, s.pid);
    s.log[0] = { aid: aid, t: v === 2 ? '✓ Tarea completa' : v === 1 ? '½ Tarea incompleta' : '✗ No la hizo' }; CAM.panel();
  };
  A['esc-fin-asis'] = () => {
    const s = E.ui.esc, g = D.grupoActual(), al = D.alumnos(g), faltan = al.filter(a => !s.vistos[a.id]);
    if (!confirm('Se marcará falta a ' + faltan.length + (faltan.length === 1 ? ' alumno' : ' alumnos') + ' que no escaneaste. ¿Continuar?')) return;
    S.update('asis:' + g.id + ':' + s.f, d => { al.forEach(a => { d[a.id] = s.vistos[a.id] ? (d[a.id] === 'R' ? 'R' : 'A') : (d[a.id] === 'J' ? 'J' : 'F'); }); }, {});
    u.toast('Lista registrada: ' + (al.length - faltan.length) + ' presentes, ' + faltan.length + ' faltas', 'ok', 3500); CAM.cerrar(); location.hash = '#/lista/' + s.f;
  };

  /* =================== tarjetas de respuesta (como Plickers) =================== */
  // diccionario de 36 bits con distancia mínima de 12: se aceptan lecturas con hasta 5 bits mal (nunca confunde un número con otro)
  const DIC = 'ARUCO_MIP_36h12', MAXH = 6;
  let det = null, dic = null, wk = null, wkN = 0;
  const wkCb = {};
  CAM.tarjetasListo = async () => { if (!window.AR) await u.loadScript('lib-aruco.js'); if (!dic) dic = new window.AR.Dictionary(DIC); };
  // qué letra quedó arriba: A arriba, B a la derecha, C abajo, D a la izquierda (se gira la tarjeta)
  CAM.letra = c => { const a = Math.atan2(c[1].y - c[0].y, c[1].x - c[0].x) * 180 / Math.PI; return Math.abs(a) <= 45 ? 'A' : (a < -45 && a > -135) ? 'B' : Math.abs(a) >= 135 ? 'C' : 'D'; };
  CAM.enHilo = () => !!wk;
  const local = img => (det || (det = new window.AR.Detector({ dictionaryName: DIC, maxHammingDistance: MAXH }))).detect(img);
  // lee en un hilo aparte (cam-worker.js) para que la pantalla no se trabe; si no se puede, aquí mismo
  CAM.leeTarjetas = img => new Promise(res => {
    // si una tarjeta sale dos veces (borde y figura interior), se queda la lectura más limpia
    const fin = ms => { const por = {}; (ms || []).forEach(m => { const d = m.d != null ? m.d : m.hammingDistance; if (!por[m.id] || d < por[m.id].d) por[m.id] = { id: m.id, d: d, letra: CAM.letra(m.corners), pts: m.corners }; }); res(Object.keys(por).map(k => por[k])); };
    if (wk === null) {
      try {
        wk = new Worker('cam-worker.js');
        wk.onmessage = e => { const cb = wkCb[e.data.id]; delete wkCb[e.data.id]; if (cb) cb(e.data.ms); };
        wk.onerror = () => { wk = false; Object.keys(wkCb).forEach(k => { const cb = wkCb[k]; delete wkCb[k]; cb([]); }); };
      } catch (e) { wk = false; }
    }
    if (!wk) { fin(local(img)); return; }
    const id = ++wkN; wkCb[id] = fin;
    wk.postMessage({ id: id, dic: DIC, maxH: MAXH, w: img.width, h: img.height, buf: img.data.buffer }, [img.data.buffer]);
  });
  A['tj2-print'] = async () => {
    const g = D.grupoActual(), al = g ? D.alumnos(g) : []; await CAM.tarjetasListo();
    const n = Math.max(30, al.reduce((m, a) => Math.max(m, Number(a.num) || 0), 0)), cards = [];
    for (let i = 1; i <= n; i++) cards.push('<div class="tj2-card"><span class="tj2-l t">A</span><span class="tj2-l r">B</span><span class="tj2-l b">C</span><span class="tj2-l l">D</span><div class="tj2-m">' + dic.generateSVG(i) + '</div><span class="tj2-n">' + i + '</span></div>');
    let h = ''; for (let i = 0; i < cards.length; i += 2) h += '<div class="pr tj2-hoja">' + cards.slice(i, i + 2).join('') + '</div>';
    E.print.run(h + '<div class="pr tj2-hoja tj2-inst"><h2>Tarjetas de respuesta</h2><ul><li>Cada alumno usa la tarjeta con su número de lista (el número chico de la esquina). No llevan nombre: sirven para cualquier grupo.</li><li>Para contestar, gira la tarjeta para que la letra de tu respuesta quede <b>arriba</b> y levántala con el dibujo hacia el maestro.</li><li>El maestro escanea el salón con la cámara del celular: de lejos funciona mejor con buena luz y sin reflejos.</li><li>Imprime en hojas blancas, de preferencia gruesas, sin escalar (100 %).</li></ul></div>', { title: 'Tarjetas de respuesta', margin: '8mm' });
  };
  // sesión de lectura: origen = { tipo: 'rep', f, t, i } (calentamiento o boleto) o { tipo: 'libre' }
  CAM.tarjetas = async o => {
    const g = D.grupoActual(); if (!g || !D.alumnos(g).length) { u.toast('Primero importa tu lista', 'err'); return; }
    await CAM.tarjetasListo();
    const al = D.alumnos(g), porNum = {}; al.forEach(a => { porNum[a.num] = a; });
    const s = E.ui.tj2 = { o: o, titulo: o.titulo || 'Pregunta', opts: o.opts || ['A', 'B', 'C', 'D'], ok: o.ok == null ? null : o.ok, res: {}, part: false };
    // se procesa la imagen completa (1920 × 1080): una tarjeta de 12.5 cm se lee bien desde unos 4 a 5 m
    CAM.abrir({ titulo: '🃏 Tarjetas · ' + corto(s.titulo, 40), guia: '', cada: 200, proc: o.proc || 1920, ancho: 1920, alto: 1080, panel: panelTj,
      frame: async (c, ctx, W, Hh) => {
        const ms = await CAM.leeTarjetas(ctx.getImageData(0, 0, W, Hh)); let nuevo = false;
        ms.forEach(m => { const a = porNum[m.id]; if (!a || LETRAS.indexOf(m.letra) >= s.opts.length) return; if (s.res[a.id] !== m.letra) { s.res[a.id] = m.letra; nuevo = true; } });
        if (nuevo) { CAM.bip(true); CAM.panel(); }
        return ms.map(m => ({ pts: m.pts, label: m.id + ' ' + m.letra, color: porNum[m.id] ? (s.ok == null ? '#285ca8' : 'ABCD'[s.ok] === m.letra ? '#1c7c45' : '#bf342b') : '#999' }));
      } });
  };
  const LETRAS = 'ABCD';
  function panelTj() {
    const s = E.ui.tj2, g = D.grupoActual(), al = D.alumnos(g), ids = Object.keys(s.res), n = ids.length, cnt = { A: 0, B: 0, C: 0, D: 0 };
    ids.forEach(id => { cnt[s.res[id]]++; }); const faltan = al.filter(a => !s.res[a.id]).map(a => a.num), okL = s.ok == null ? null : LETRAS[s.ok];
    return '<div class="tj2-cnt">' + s.opts.map((t, i) => { const L = LETRAS[i]; return '<span class="' + (okL === L ? 'ok' : '') + '"><b>' + L + '</b>' + cnt[L] + (t !== L ? '<small>' + esc(corto(t, 22)) + '</small>' : '') + '</span>'; }).join('') + '</div>' +
      '<p class="small"><b>' + n + '</b> de ' + al.length + ' leídas' + (okL ? ' · <b>' + (cnt[okL] || 0) + '</b> correctas (' + okL + ')' : '') + (faltan.length && faltan.length <= 14 ? '<br><span class="muted">Faltan: ' + faltan.join(', ') + '</span>' : '') + '</p>' +
      (s.o.tipo === 'libre' ? '<label class="switch small"><input type="checkbox" data-ch="tj2-part"' + (s.part ? ' checked' : '') + '><span>+1 participación a quien acierte</span></label>' : '') +
      '<div class="row gap wrap">' + btn('↺ Empezar otra vez', 'tj2-reset', '', 'small ghost') + btn('✓ Guardar', 'tj2-guardar', n ? '' : 'disabled', 'small primary') + '</div>';
  }
  CH['tj2-part'] = el => { E.ui.tj2.part = el.checked; };
  A['tj2-reset'] = () => { E.ui.tj2.res = {}; CAM.panel(); };
  A['tj2-guardar'] = () => {
    const s = E.ui.tj2, g = D.grupoActual(), o = s.o, n = Object.keys(s.res).length; if (!n) return;
    const okL = s.ok == null ? null : LETRAS[s.ok], bien = Object.keys(s.res).filter(id => s.res[id] === okL);
    if (o.tipo === 'rep' && E.repaso) E.repaso.guardaTarjetas(g, o.f, o.t, o.i, s.res, okL);
    if (o.tipo === 'libre' && s.part && okL) { const f = u.today(); S.update('part:' + g.id + ':' + f, d => { bien.forEach(id => { d[id] = Number(d[id] || 0) + 1; }); }, {}); }
    u.toast(n + ' respuestas guardadas' + (okL ? ': ' + bien.length + ' correctas' : ''), 'ok', 3000); CAM.cerrar();
  };
  // pregunta libre (desde Herramientas o Cámara)
  function libreHTML() {
    const s = E.ui.tjl;
    return '<p class="muted small">Proyecta o di la pregunta con 4 opciones (A, B, C, D). Los alumnos giran su tarjeta para que su respuesta quede arriba y la levantan.</p>' +
      '<label class="fld"><span>Pregunta (opcional)</span><input class="inp" id="tjl-q" value="' + esc(s.q || '') + '" placeholder="Ej. ¿Qué mecanismo convierte giro en vaivén?"></label>' +
      '<p class="small">Respuesta correcta (opcional):</p><div class="cl-seg">' + ['A', 'B', 'C', 'D'].map((L, i) => btn(L, 'tjl-ok', 'data-i="' + i + '"', 'small' + (s.ok === i ? ' on ok' : ''))).join('') + btn('Sin respuesta correcta', 'tjl-ok', 'data-i="-1"', 'small' + (s.ok == null ? ' on' : '')) + '</div>' +
      '<div class="row gap wrap mt">' + btn('📷 Escanear tarjetas', 'tjl-go', '', 'primary') + btn('🖨 Imprimir tarjetas', 'tj2-print', '', 'small') + '</div>';
  }
  A['tjl-abrir'] = () => { E.ui.tjl = E.ui.tjl || { q: '', ok: null }; E.modal.open('🃏 Tarjetas de respuesta', libreHTML()); };
  A['tjl-ok'] = el => { const s = E.ui.tjl; s.q = (document.getElementById('tjl-q') || {}).value || s.q; const i = Number(el.dataset.i); s.ok = i < 0 ? null : i; E.modal.body(libreHTML()); };
  A['tjl-go'] = () => { const s = E.ui.tjl; s.q = ((document.getElementById('tjl-q') || {}).value || '').trim(); E.modal.close(); CAM.tarjetas({ tipo: 'libre', titulo: s.q || 'Pregunta rápida', ok: s.ok }); };
  // desde el calentamiento o el boleto del guion
  A['tj2-rep'] = el => {
    const g = D.grupoActual(), f = el.dataset.f, t = el.dataset.t, i = Number(el.dataset.i), x = E.repaso && E.repaso.pregunta(g, f, t, i); if (!x) return;
    CAM.tarjetas({ tipo: 'rep', f: f, t: t, i: i, titulo: x.q, opts: x.opts || ['A', 'B', 'C', 'D'], ok: x.ok });
  };

  /* =================== pantalla Cámara (todo junto) =================== */
  V.camara = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup();
    let h = card('<h3>📷 Cámara</h3><p class="muted small">Captura con la cámara del celular. Las etiquetas y tarjetas no llevan nombres: solo un número interno o el número de lista. Nada sale de tu aparato salvo las fotos de evidencias, que van a tu Supabase privado.</p>');
    h += '<div class="grid2">' + card('<h3>📒 Libretas con QR</h3><p class="small">Pega una etiqueta QR en cada libreta. Al revisar, escaneas y queda ✓ la tarea (o asistencia, participación, práctica o su ficha).</p><div class="row gap wrap">' + btn('📷 Escanear', 'esc-abrir', '', 'primary') + btn('🖨 Etiquetas', 'qr-print', '', 'small') + '</div>') +
      card('<h3>🃏 Tarjetas de respuesta</h3><p class="small">Cada alumno levanta su tarjeta girada con su respuesta arriba; escaneas el salón y ves quién contestó qué. También desde el calentamiento y el boleto del guion.</p><div class="row gap wrap">' + btn('📷 Pregunta rápida', 'tjl-abrir', '', 'primary') + btn('🖨 Imprimir tarjetas', 'tj2-print', '', 'small') + '</div>') +
      card('<h3>📝 Hojas de respuestas</h3><p class="small">Imprime la hoja de burbujas de tu examen; al escanearla se califica sola (las abiertas, a mano).</p>' + btn('📷 Calificar hojas', 'omr-ir', '', 'primary')) +
      (E.evid ? card('<h3>🖼 Evidencias de trabajos</h3><p class="small">Fotos de libretas, planos y prototipos, nunca de caras. Se respaldan en tu Supabase privado.</p><div class="row gap wrap">' + btn('📷 Tomar foto', 'ev-abrir', '', 'primary') + link('Ver todas', 'evidencias', 'small') + '</div>') : '') +
      (E.forms ? card('<h3>📋 Formularios</h3><p class="small">Muestra el QR de tu Google Forms en el proyector e importa las respuestas (autoevaluación, coevaluación o cuestionario).</p>' + link('Abrir', 'formularios', 'small primary')) : '') + '</div>';
    return { t: 'Cámara', h: h };
  };
})();
