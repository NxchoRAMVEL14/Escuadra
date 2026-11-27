/* Escuadra · v1.48.0 · Paquete 5 (clases)
   25) Simuladores de diagrama escalera (sim.html): arranque y paro, semáforo con temporizadores, banda con sensor, cilindro
       neumático A+ A− y prensa a dos manos, además del elevador. Se abren en el proyector o en el celular (QR).
   26) Del diagrama a la práctica: de cada simulador sale la lista de material (contada del diagrama) y la hoja de práctica
       imprimible (objetivo, material, diagrama, entradas y salidas, pasos, preguntas y lista de cotejo).
   28) Retos FreeCAD: una pieza con plano acotado (placa con barrenos, escuadra, brida, eje escalonado, placa con ranura);
       la modelan y reportan el volumen que da FreeCAD; la app lo compara con el exacto (±1 %) y lo pasa a calificaciones.
   29) Clase invertida: antes de una clase de tu plan mandas el material (video o lectura) y 4 preguntas de su tema por QR;
       con los códigos sabes quién lo hizo y cuántas tuvo bien, para empezar la clase desde ahí.
   30) Banco de proyectos: 12 proyectos de mecanismos que luego se mueven con hidráulica (jeringas), con dificultad,
       material, qué aprenden y retos extra; se asignan a cada equipo.
   31) Cobertura del programa: cada actividad clave y cada desarrollo de la competencia del programa SEP contra las clases
       de tu plan (cuántas horas van dadas, qué falta y qué no está en tu plan), con su producto y criterios. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h, card = H.card, btn = H.btn, link = H.link;
  const corto = n => (u.corto ? u.corto(n) : n);
  const base = pag => location.href.split('#')[0].split('?')[0].replace(/[^/]*$/, '') + pag;
  const qrModal = async (tit, url, txt) => { if (E.cam && E.cam.qrListo) await E.cam.qrListo(); E.ui.c5Url = url; E.ui.c5T = tit;
    E.modal.open(tit, '<div class="c">' + E.cam.qrSVG(url, 'pj-qr', 'L') + '</div><p class="small">' + (txt || '') + '</p><div class="row gap wrap">' + btn('📋 Copiar enlace', 'c5-copiar', '', 'primary') + '<a class="btn" href="' + esc(url) + '" target="_blank" rel="noopener">Abrir</a></div>'); };
  A['c5-copiar'] = async () => { const ok = await u.copy(E.ui.c5T + ': ' + E.ui.c5Url); u.toast(ok ? 'Enlace copiado' : 'No se pudo copiar', ok ? 'ok' : 'err'); };

  /* ---------- 25 y 26 · simuladores y hoja de práctica ---------- */
  V.simuladores = () => {
    const SM = E.sims; if (!SM) return { t: 'Simuladores', h: card('<p>No se cargaron los simuladores.</p>') };
    let h = card('<h3>🕹️ Simuladores de diagrama escalera</h3><p class="small">Para explicar en el proyector y para que practiquen en el celular: presionan los botones y ven qué conduce en el diagrama. De cada uno sale la hoja de práctica con la lista de material contada del diagrama.</p>');
    h += card('<div class="sm-c"><div><b>🛗 Elevador de 2 pisos</b><small>El de la clase del 19 de noviembre</small></div><div class="row gap wrap"><a class="btn small primary" href="elevador.html" target="_blank" rel="noopener">Abrir</a>' + btn('📲 QR', 'c5-qr-el', '', 'small') + '</div></div>');
    h += SM.LIST.map(s => card('<div class="sm-c"><div><b>' + s.ico + ' ' + esc(s.t) + '</b><small>' + esc(s.sub) + '</small></div><div class="row gap wrap"><a class="btn small primary" href="sim.html#' + s.id + '" target="_blank" rel="noopener">Abrir</a>' + btn('📲 QR', 'c5-qr-sim', 'data-id="' + s.id + '"', 'small') + btn('🖨 Hoja de práctica', 'c5-hoja', 'data-id="' + s.id + '"', 'small') + '</div></div><details class="sub"><summary>Material (' + SM.material(s).length + ')</summary><ul class="small">' + SM.material(s).map(m => '<li>' + m[1] + ' × ' + esc(m[0]) + '</li>').join('') + '</ul></details>')).join('');
    return { t: 'Simuladores', h: h };
  };
  A['c5-qr-sim'] = el => { const s = E.sims.get(el.dataset.id); qrModal('🕹️ ' + s.t, base('sim.html#' + s.id), 'Abre el simulador en el celular. Presionen los botones y expliquen qué conduce.'); };
  A['c5-qr-el'] = () => qrModal('🛗 Elevador de 2 pisos', base('elevador.html'), 'El simulador del elevador con su diagrama escalera.');
  A['c5-hoja'] = el => { const s = E.sims.get(el.dataset.id), g = D.grupoActual(), cf = D.cfg(), mat = E.sims.material(s);
    const io = Object.keys(s.vars).map(k => { const d = s.vars[k]; return '<tr><td><b>' + k + '</b></td><td style="text-align:left">' + esc(d[0]) + '</td><td>' + (d[1] === 'ton' ? 'TON ' + d[3] + ' s' : esc(d[1])) + '</td></tr>'; }).join('');
    E.print.run('<div class="pr fs-pr c5-pr"><h2>Práctica: ' + esc(s.t) + '</h2><p class="fs-sub">' + esc((cf.plantel || 'CETAC 19') + (g ? ' · ' + g.nombre : '') + ' · ' + (cf.docente || '')) + ' · Equipo: ____________________ · Fecha: __________</p><p><b>Objetivo:</b> ' + esc(s.obj) + '</p>' +
      '<div class="c5-dos"><div><h3>Material</h3><table class="fs-t"><tr><th>Cant.</th><th>Material</th><th>✓</th></tr>' + mat.map(m => '<tr><td>' + m[1] + '</td><td style="text-align:left">' + esc(m[0]) + '</td><td></td></tr>').join('') + '</table></div><div><h3>Entradas y salidas</h3><table class="fs-t"><tr><th>Clave</th><th>Elemento</th><th>Tipo</th></tr>' + io + '</table></div></div>' +
      '<h3>Diagrama escalera</h3><div class="c5-lad">' + E.sims.svg(s, {}, { vivo: false }) + '</div><h3>Procedimiento</h3><ol>' + s.pasos.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol><p class="c5-seg">⚠️ Antes de energizar: revisa con tu profe, trabaja con 24 V y desconecta para hacer cambios.</p>' +
      '<h3>Preguntas</h3><ol>' + s.preguntas.map(x => '<li>' + esc(x) + '<div class="c5-lin"></div></li>').join('') + '</ol><h3>Lista de cotejo</h3><table class="fs-t"><tr><th>Criterio</th><th>Sí</th><th>No</th></tr>' + s.criterios.map(c => '<tr><td style="text-align:left">' + esc(c) + '</td><td></td><td></td></tr>').join('') + '</table></div>', { title: 'Práctica: ' + s.t }); };

  /* ---------- 28 · retos FreeCAD ---------- */
  const KR = g => 'retofc:' + g.id, PI = Math.PI;
  const rng = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const pick = (r, a) => a[Math.floor(r() * a.length)];
  E.retofc = {};
  E.retofc.TIPOS = {
    placa: { t: 'Placa con 4 barrenos', gen: r => ({ L: pick(r, [60, 70, 80, 90, 100]), W: pick(r, [40, 50, 60]), T: pick(r, [5, 6, 8, 10]), d: pick(r, [6, 8, 10]), m: pick(r, [8, 10]) }), vol: p => p.L * p.W * p.T - 4 * PI * (p.d / 2) ** 2 * p.T },
    escuadra: { t: 'Escuadra en L', gen: r => ({ L: pick(r, [50, 60, 70, 80]), H: pick(r, [40, 50, 60]), W: pick(r, [20, 25, 30]), T: pick(r, [4, 5, 6, 8]) }), vol: p => (p.L * p.T + (p.H - p.T) * p.T) * p.W },
    brida: { t: 'Brida con 4 barrenos', gen: r => ({ D: pick(r, [60, 70, 80, 90]), d1: pick(r, [20, 25, 30]), d2: pick(r, [6, 8]), T: pick(r, [6, 8, 10, 12]) }), vol: p => PI / 4 * (p.D * p.D - p.d1 * p.d1 - 4 * p.d2 * p.d2) * p.T },
    eje: { t: 'Eje escalonado', gen: r => ({ D1: pick(r, [20, 25, 30]), L1: pick(r, [30, 40, 50]), D2: pick(r, [10, 12, 15]), L2: pick(r, [20, 30, 40]) }), vol: p => PI / 4 * (p.D1 * p.D1 * p.L1 + p.D2 * p.D2 * p.L2) },
    ranura: { t: 'Placa con ranura', gen: r => ({ L: pick(r, [70, 80, 90, 100]), W: pick(r, [30, 40, 50]), T: pick(r, [5, 6, 8]), s: pick(r, [30, 40]), a: pick(r, [8, 10, 12]) }), vol: p => (p.L * p.W - ((p.s - p.a) * p.a + PI * (p.a / 2) ** 2)) * p.T }
  };
  const cota = (x1, y1, x2, y2, t, off, vert) => vert ? '<line x1="' + (x1 - off) + '" y1="' + y1 + '" x2="' + (x1 - off) + '" y2="' + y2 + '" class="cot"/><text x="' + (x1 - off - 4) + '" y="' + ((y1 + y2) / 2) + '" class="ct" text-anchor="end" dominant-baseline="middle">' + t + '</text>' : '<line x1="' + x1 + '" y1="' + (y1 - off) + '" x2="' + x2 + '" y2="' + (y2 - off) + '" class="cot"/><text x="' + ((x1 + x2) / 2) + '" y="' + (y1 - off - 4) + '" class="ct" text-anchor="middle">' + t + '</text>';
  E.retofc.plano = (tipo, p) => { // dos vistas (superior y frontal) con cotas, sin escala
    const st = '<style>.pz{fill:#e2e8f0;stroke:#0f172a;stroke-width:1.6}.hl{fill:#fff;stroke:#0f172a;stroke-width:1.4}.cot{stroke:#b91c1c;stroke-width:1;marker-start:url(#a);marker-end:url(#a)}.ct{font:11px sans-serif;fill:#b91c1c}.vt{font:10px sans-serif;fill:#64748b}.ej{stroke:#64748b;stroke-dasharray:6 3 1 3;stroke-width:.8}</style><defs><marker id="a" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#b91c1c"/></marker></defs>';
    let g = '';
    if (tipo === 'placa' || tipo === 'ranura') { const k = 200 / p.L, w = p.L * k, h = p.W * k, x = 60, y = 40, t = Math.max(8, p.T * k);
      g += '<rect class="pz" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"/>';
      if (tipo === 'placa') { [[p.m, p.m], [p.L - p.m, p.m], [p.m, p.W - p.m], [p.L - p.m, p.W - p.m]].forEach(c => { g += '<circle class="hl" cx="' + (x + c[0] * k) + '" cy="' + (y + c[1] * k) + '" r="' + (p.d / 2 * k) + '"/>'; }); g += cota(x, y + h, x + p.m * k, y + h, p.m, -14) + '<text x="' + (x + p.m * k + 8) + '" y="' + (y + p.m * k - 8) + '" class="ct">4 × Ø' + p.d + ' pasado</text>'; }
      else { const sx = x + (p.L / 2 - p.s / 2) * k, sw = p.s * k, sh = p.a * k, sy = y + h / 2 - sh / 2; g += '<rect class="hl" x="' + sx + '" y="' + sy + '" width="' + sw + '" height="' + sh + '" rx="' + (sh / 2) + '"/>' + cota(sx, sy, sx + sw, sy, p.s, 8) + '<text x="' + (sx + sw + 6) + '" y="' + (sy + sh / 2 + 4) + '" class="ct">ancho ' + p.a + ', centrada, pasada</text>'; }
      g += cota(x, y, x + w, y, p.L, 14) + cota(x, y, x, y + h, p.W, 10, true) + '<text x="' + x + '" y="' + (y + h + 34) + '" class="vt">Vista superior</text>';
      const y2 = y + h + 50; g += '<rect class="pz" x="' + x + '" y="' + y2 + '" width="' + w + '" height="' + t + '"/>' + cota(x, y2, x, y2 + t, p.T, 10, true) + '<text x="' + x + '" y="' + (y2 + t + 16) + '" class="vt">Vista frontal</text>';
      return '<svg viewBox="0 0 320 ' + (y2 + t + 24) + '" xmlns="http://www.w3.org/2000/svg">' + st + g + '</svg>'; }
    if (tipo === 'escuadra') { const k = 160 / Math.max(p.L, p.H), x = 70, y = 30; const L = p.L * k, Hh = p.H * k, T = Math.max(6, p.T * k), W = p.W * k;
      g += '<path class="pz" d="M' + x + ' ' + y + 'h' + T + 'v' + (Hh - T) + 'h' + (L - T) + 'v' + T + 'h' + (-L) + 'z"/>' + cota(x, y + Hh, x + L, y + Hh, p.L, -16) + cota(x, y, x, y + Hh, p.H, 10, true) + cota(x, y, x + T, y, p.T, 8) + '<text x="' + x + '" y="' + (y + Hh + 40) + '" class="vt">Vista frontal (perfil en L)</text>';
      const x2 = x + L + 40; g += '<rect class="pz" x="' + x2 + '" y="' + y + '" width="' + W + '" height="' + Hh + '"/>' + cota(x2, y, x2 + W, y, p.W, 8) + '<text x="' + x2 + '" y="' + (y + Hh + 16) + '" class="vt">Vista lateral</text>';
      return '<svg viewBox="0 0 ' + (x2 + W + 20) + ' ' + (y + Hh + 50) + '" xmlns="http://www.w3.org/2000/svg">' + st + g + '</svg>'; }
    if (tipo === 'brida') { const k = 150 / p.D, cx = 110, cy = 105, R = p.D / 2 * k, rb = (p.D / 2 + p.d1 / 2) / 2 * k;
      g += '<circle class="pz" cx="' + cx + '" cy="' + cy + '" r="' + R + '"/><circle class="hl" cx="' + cx + '" cy="' + cy + '" r="' + (p.d1 / 2 * k) + '"/>' + [0, 90, 180, 270].map(a => '<circle class="hl" cx="' + (cx + rb * Math.cos(a * PI / 180)) + '" cy="' + (cy + rb * Math.sin(a * PI / 180)) + '" r="' + (p.d2 / 2 * k) + '"/>').join('') + '<circle cx="' + cx + '" cy="' + cy + '" r="' + rb + '" fill="none" class="ej"/>';
      g += cota(cx - R, cy - R, cx + R, cy - R, 'Ø' + p.D, 10) + '<text x="' + cx + '" y="' + (cy + 4) + '" class="ct" text-anchor="middle">Ø' + p.d1 + '</text><text x="' + (cx + R + 6) + '" y="' + (cy + R) + '" class="ct">4 × Ø' + p.d2 + ' a 90°, centros a la mitad entre Ø' + p.d1 + ' y Ø' + p.D + '</text><text x="' + (cx - R) + '" y="' + (cy + R + 18) + '" class="vt">Vista superior · espesor ' + p.T + '</text>';
      return '<svg viewBox="0 0 420 ' + (cy + R + 26) + '" xmlns="http://www.w3.org/2000/svg">' + st + g + '</svg>'; }
    const k = 220 / (p.L1 + p.L2), x = 40, cy = 80, h1 = p.D1 * k, h2 = p.D2 * k; // eje
    g += '<rect class="pz" x="' + x + '" y="' + (cy - h1 / 2) + '" width="' + (p.L1 * k) + '" height="' + h1 + '"/><rect class="pz" x="' + (x + p.L1 * k) + '" y="' + (cy - h2 / 2) + '" width="' + (p.L2 * k) + '" height="' + h2 + '"/><line class="ej" x1="' + (x - 10) + '" y1="' + cy + '" x2="' + (x + (p.L1 + p.L2) * k + 10) + '" y2="' + cy + '"/>' +
      cota(x, cy - h1 / 2, x + p.L1 * k, cy - h1 / 2, p.L1, 12) + cota(x + p.L1 * k, cy - h2 / 2, x + (p.L1 + p.L2) * k, cy - h2 / 2, p.L2, 22) + cota(x, cy - h1 / 2, x, cy + h1 / 2, 'Ø' + p.D1, 8, true) + '<text x="' + (x + (p.L1 + p.L2) * k + 8) + '" y="' + (cy + 4) + '" class="ct">Ø' + p.D2 + '</text><text x="' + x + '" y="' + (cy + h1 / 2 + 22) + '" class="vt">Vista frontal (pieza de revolución)</text>';
    return '<svg viewBox="0 0 330 ' + (cy + h1 / 2 + 30) + '" xmlns="http://www.w3.org/2000/svg">' + st + g + '</svg>';
  };
  E.retofc.lista = g => (S.get(KR(g)) || []).filter(x => x && x.id);
  E.retofc.revisa = (x, v) => { v = Number(String(v).replace(/,/g, '')); if (!(v > 0)) return null; const e = Math.abs(v - x.vol) / x.vol; return e <= 0.01 ? 'ok' : e <= 0.05 ? 'cerca' : 'no'; };
  V.retosfc = id => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const L = E.retofc.lista(g), x = id && L.find(y => y.id === id);
    if (!x) { let h = card('<h3>🧊 Retos FreeCAD</h3><p class="small">Una pieza con plano acotado para modelar en 10 a 20 minutos. Reportan el <b>volumen</b> que da FreeCAD y tú lo comparas con el exacto: ✓ si está dentro de ±1 %. Sirve de calentamiento o para quien termina antes.</p><div class="row gap wrap">' + Object.keys(E.retofc.TIPOS).map(k => btn('＋ ' + E.retofc.TIPOS[k].t, 'rf-nuevo', 'data-t="' + k + '"', 'small')).join('') + btn('🎲 Al azar', 'rf-nuevo', '', 'small primary') + '</div>');
      if (L.length) h += card('<h3>Tus retos</h3><ul class="plain sv-l">' + L.slice().reverse().map(y => '<li><a href="#/retosfc/' + y.id + '"><b>' + esc(y.titulo) + '</b></a> <small class="muted">' + u.fCorta(y.f) + ' · ' + Object.values(y.res || {}).filter(r => r.e === 'ok').length + ' ✓</small></li>').join('') + '</ul>');
      return { t: 'Retos FreeCAD', h: h }; }
    const al = D.alumnos(g), res = x.res || {}, nOk = al.filter(a => (res[a.id] || {}).e === 'ok').length;
    let h = card('<div class="row between gap wrap"><h3>🧊 ' + esc(x.titulo) + '</h3>' + link('‹ Retos', 'retosfc', 'small') + '</div><div class="rf-plano">' + E.retofc.plano(x.tipo, x.p) + '</div><p class="small">Medidas en mm. Modela la pieza y saca su volumen: en FreeCAD abre <b>Ver → Paneles → Consola de Python</b>, selecciona la pieza y escribe <code>App.ActiveDocument.ActiveObject.Shape.Volume</code>.</p><div class="row gap wrap">' + btn('📽 Proyectar', 'rf-proj', 'data-id="' + x.id + '"', 'small primary') + btn('🖨 Imprimir', 'rf-imp', 'data-id="' + x.id + '"', 'small') + '</div><details class="sub"><summary>Ver el volumen exacto</summary><p><b>' + Math.round(x.vol).toLocaleString('es-MX') + ' mm³</b> (se acepta ±1 %: ' + Math.round(x.vol * 0.99).toLocaleString('es-MX') + ' a ' + Math.round(x.vol * 1.01).toLocaleString('es-MX') + ')</p></details>');
    h += card('<div class="row between gap wrap"><h3>✍️ Volumen que reportó cada quien (' + nOk + ' ✓)</h3>' + (nOk ? btn(x.act ? '✓ Actualizar en calificaciones' : '➜ Pasar a calificaciones', 'rf-act', 'data-id="' + x.id + '"', 'small') : '') + '</div><ul class="plain fa-l">' + al.map(a => { const r = res[a.id] || {}; return '<li><span>' + a.num + '. ' + esc(corto(a.nombre)) + '</span><span class="row gap"><input class="inp" inputmode="decimal" style="width:7.5em" placeholder="mm³" data-ch="rf-v" data-id="' + x.id + '" data-aid="' + a.id + '" value="' + esc(r.v || '') + '"><b class="rf-' + (r.e || '') + '">' + (r.e === 'ok' ? '✓' : r.e === 'cerca' ? '≈ revisa una cota' : r.e === 'no' ? '✗' : '') + '</b></span></li>'; }).join('') + '</ul><p class="small muted">✓ dentro de ±1 % · ≈ dentro de ±5 % (casi siempre una cota o un barreno mal) · ✗ más lejos. Al pasarlo: ✓ = 10, ≈ = 7.</p>');
    return { t: 'Reto FreeCAD', h: h };
  };
  A['rf-nuevo'] = el => { const g = D.grupoActual(), r = rng(Date.now() & 0xffffffff), ks = Object.keys(E.retofc.TIPOS), tipo = el.dataset.t || pick(r, ks), T = E.retofc.TIPOS[tipo], p = T.gen(r), n = E.retofc.lista(g).length + 1;
    const x = { id: u.uid('rf'), f: u.today(), tipo: tipo, p: p, vol: T.vol(p), titulo: 'Reto ' + n + ': ' + T.t, res: {} }; S.update(KR(g), L => { L.push(x); }, []); location.hash = '#/retosfc/' + x.id; };
  const rbusca = id => { const g = D.grupoActual(); return E.retofc.lista(g).find(y => y.id === id); };
  CH['rf-v'] = el => { const g = D.grupoActual(); S.update(KR(g), L => { const x = L.find(y => y.id === el.dataset.id); if (!x) return; x.res = x.res || {}; const v = el.value.trim(); if (!v) delete x.res[el.dataset.aid]; else x.res[el.dataset.aid] = { v: v, e: E.retofc.revisa(x, v) }; }, []); };
  A['rf-proj'] = el => { const x = rbusca(el.dataset.id); if (x && E.proj) E.proj.abrir({ id: 'reto', titulo: x.titulo }, [{ k: 'html', h: '🧊 ' + esc(x.titulo), html: '<div class="rf-plano rf-big">' + E.retofc.plano(x.tipo, x.p) + '</div><p>Medidas en mm. Modélala y reporta su <b>volumen</b> (consola de Python: <code>App.ActiveDocument.ActiveObject.Shape.Volume</code>).</p>' }]); };
  A['rf-imp'] = el => { const x = rbusca(el.dataset.id); if (x) E.print.run('<div class="pr fs-pr"><h2>🧊 ' + esc(x.titulo) + '</h2><p class="fs-sub">Medidas en mm · Nombre: ______________________ · Volumen: __________ mm³</p><div class="rf-plano">' + E.retofc.plano(x.tipo, x.p) + '</div><p>1. Modela la pieza con las medidas del plano. 2. Selecciónala y en Ver → Paneles → Consola de Python escribe <b>App.ActiveDocument.ActiveObject.Shape.Volume</b>. 3. Anota el volumen y enséñaselo a tu profe.</p></div>', { title: x.titulo }); };
  A['rf-act'] = el => { const g = D.grupoActual(), x = rbusca(el.dataset.id); if (!x) return; const notas = {}; Object.keys(x.res || {}).forEach(aid => { const e = x.res[aid].e; if (e === 'ok') notas[aid] = 100; else if (e === 'cerca') notas[aid] = 70; });
    const p = C.parcialActual(), id = x.act || u.uid('act'), k = 'act:' + g.id + ':' + id, prev = S.get(k) || {};
    S.put(k, Object.assign({}, prev, { id: id, parcial: prev.parcial || p.id, categoria: prev.categoria || 'trabajos', nombre: x.titulo, peso: prev.peso || 1, max: 100, fecha: prev.fecha || x.f, notas: Object.assign({}, prev.notas || {}, notas), instrumento: 'Reto FreeCAD' }));
    S.update(KR(g), L => { const y = L.find(z => z.id === x.id); if (y) y.act = id; }, []); u.toast('Quedó como actividad del ' + p.nombre, 'ok'); };

  /* ---------- 29 · clase invertida ---------- */
  const KI = g => 'invertida:' + g.id;
  E.invertida = {};
  E.invertida.proximas = g => { const hoy = u.today(), out = []; D.parciales().filter(p => p.fin >= hoy).slice(0, 2).forEach(p => { let pl = null; try { pl = E.clases.plan(g, p.id); } catch (e) { } if (!pl) return;
    const conB = t => (E.BANCO || []).some(q => q.tema === t && q.tipo !== 'ab');
    pl.bloques.forEach(b => { if (b.perdida || b.fecha <= hoy) return; b.parts.forEach(pt => { const it = pt.it; if (!it || it.auto || out.some(o => o.it.id === it.id)) return;
      let ts = it.tema && conB(it.tema) ? [it.tema] : []; if (!ts.length && E.examen && E.examen.temasVistos) { const tv = E.examen.temasVistos(g, p.id, b.fecha); ts = Object.keys(tv).filter(conB).sort((x, y) => (tv[y] || 0) - (tv[x] || 0)).slice(0, 3); }
      if (!ts.length) { const k = D.smKey(g, p.id), pre = k ? 'sm' + k.split('-')[1] + '-' : '', deb = E.examen && E.examen.debilidad ? E.examen.debilidad(g) : {}; ts = Array.from(new Set((E.BANCO || []).filter(q => pre && String(q.tema).indexOf(pre) === 0 && q.tipo !== 'ab').map(q => q.tema))).sort((x, y) => (deb[x] == null ? 0.7 : deb[x]) - (deb[y] == null ? 0.7 : deb[y])).slice(0, 3); }
      if (ts.length) out.push({ f: b.fecha, it: it, ts: ts }); }); }); });
    return out.slice(0, 8); };
  E.invertida.lista = g => (S.get(KI(g)) || []).filter(x => x && x.id);
  E.invertida.preguntas = (g, x) => { const r = rng(parseInt(String(x.id).replace(/\D/g, '').slice(-8) || '7', 10)), ts = x.temas || [x.tema], pool = (E.BANCO || []).filter(q => ts.indexOf(q.tema) >= 0 && q.tipo !== 'ab' && (q.niv || 2) <= 2).map(q => ({ q: q, k: r() })).sort((a, b) => a.k - b.k).map(o => o.q), out = [];
    pool.forEach(b => { if (out.length >= 4) return; const q = E.ejer && E.ejer.pregunta(b, r); if (q && q.opts) out.push([String(q.q).slice(0, 200), q.opts.map(o => String(o).slice(0, 90)), q.ok, String(q.a || '').slice(0, 150), ((E.TEMAS || []).find(t => t.id === b.tema) || {}).titulo || x.titT || '']); }); return out; };
  E.invertida.url = async (g, x) => { const q = E.invertida.preguntas(g, x); if (!q.length) return null; if (E.casa && E.casa.anotaGen) E.casa.anotaGen(g, x.f, 'g', x.temas || [x.tema], q.length);
    return base('repaso.html') + '#' + await E.casa.empaca({ v: 1, k: 'rep', t: 'Antes de la clase', g: g.nombre, n: null, f: x.f, fu: 'la clase del ' + u.fCorta(x.f), q: q, c: E.casa.sal(g, 'g', x.f), pre: { t: x.t, u: x.url || '', n: x.nota || '' } }); };
  V.invertida = id => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const L = E.invertida.lista(g), x = id && L.find(y => y.id === id);
    if (!x) { const P = E.invertida.proximas(g);
      let h = card('<h3>🔄 Clase invertida</h3><p class="small">Antes de una clase les mandas el material (un video o una lectura corta) y 4 preguntas de ese tema por QR. Al llegar te dan su código: sabes quién lo hizo y cuánto entendió, y la clase empieza desde ahí (práctica y dudas) en lugar de explicar todo desde cero.</p>');
      h += card('<h3>Próximas clases de tu plan</h3>' + (P.length ? '<ul class="plain fa-l">' + P.map(o => '<li><div><b>' + esc(o.it.t) + '</b><small>' + u.cap(u.fLarga(o.f)) + '</small></div>' + btn('＋ Invertir', 'iv-nueva', 'data-f="' + o.f + '" data-it="' + esc(o.it.id) + '"', 'small') + '</li>').join('') + '</ul>' : '<p class="muted small">No encontré clases próximas con preguntas en el banco.</p>'));
      if (L.length) h += card('<h3>Tus clases invertidas</h3><ul class="plain sv-l">' + L.slice().reverse().map(y => '<li><a href="#/invertida/' + y.id + '"><b>' + esc(y.t) + '</b></a> <small class="muted">' + u.fCorta(y.f) + '</small></li>').join('') + '</ul>');
      return { t: 'Clase invertida', h: h }; }
    const res = D.alumnos(g).map(a => ({ a: a, r: (E.casa ? E.casa.resultados(g, a.id) : []).find(z => z.f === x.f && z.k === 'g') }));
    const hech = res.filter(o => o.r), prom = hech.length ? hech.reduce((s, o) => s + o.r.ok / o.r.n, 0) / hech.length : null;
    let h = card('<div class="row between gap wrap"><h3>🔄 ' + esc(x.t) + '</h3>' + link('‹ Todas', 'invertida', 'small') + '</div><p class="small muted">Clase del ' + u.fLarga(x.f) + '</p><div class="fgrid"><label class="fld"><span>Material (enlace a video o lectura)</span><input class="inp" data-ch="iv-c" data-id="' + x.id + '" data-k="url" value="' + esc(x.url || '') + '" placeholder="https://…"></label><label class="fld"><span>Indicación</span><input class="inp" data-ch="iv-c" data-id="' + x.id + '" data-k="nota" value="' + esc(x.nota || '') + '" placeholder="Ej. mira del minuto 2 al 8 y anota 2 dudas"></label></div><div class="row gap wrap">' + btn('📲 QR para los alumnos', 'iv-qr', 'data-id="' + x.id + '"', 'small primary') + '</div>');
    h += card('<h3>¿Quién lo hizo? (' + hech.length + ' de ' + res.length + ')' + (prom != null ? ' · ' + Math.round(prom * 100) + ' % de aciertos' : '') + '</h3><p class="small muted">Escribe el código de 4 dígitos que les dio el repaso.</p><ul class="plain fa-l">' + res.map(o => '<li><span>' + o.a.num + '. ' + esc(corto(o.a.nombre)) + '</span>' + (o.r ? '<b class="rf-ok">✓ ' + o.r.ok + ' de ' + o.r.n + '</b>' : '<input class="inp" data-ch="rc-cod" data-aid="' + o.a.id + '" inputmode="numeric" maxlength="4" placeholder="código" style="width:6em">') + '</li>').join('') + '</ul>' + (prom != null && prom < 0.6 ? '<p class="note warn small">Menos de 60 % de aciertos: empieza aclarando el tema antes de la práctica.</p>' : ''));
    return { t: 'Clase invertida', h: h };
  };
  A['iv-nueva'] = el => { const g = D.grupoActual(), P = E.invertida.proximas(g), o = P.find(z => z.it.id === el.dataset.it && z.f === el.dataset.f); if (!o) return; const tt = (E.TEMAS || []).find(t => t.id === o.it.tema);
    const x = { id: u.uid('iv'), f: o.f, itId: o.it.id, t: o.it.t, tema: o.ts[0], temas: o.ts, titT: tt ? tt.titulo : '', url: '', nota: '' }; S.update(KI(g), L => { L.push(x); }, []); location.hash = '#/invertida/' + x.id; };
  CH['iv-c'] = el => { const g = D.grupoActual(); S.update(KI(g), L => { const x = L.find(y => y.id === el.dataset.id); if (x) x[el.dataset.k] = el.value.trim(); }, []); };
  A['iv-qr'] = async el => { const g = D.grupoActual(), x = E.invertida.lista(g).find(y => y.id === el.dataset.id); if (!x) return; const url = await E.invertida.url(g, x); if (!url) { u.toast('No hay preguntas en el banco para ese tema', 'err'); return; } qrModal('🔄 ' + x.t, url, 'Primero ven el material, luego contestan 4 preguntas y les sale un código para ti.'); };

  /* ---------- 30 · banco de proyectos ---------- */
  E.PROYECTOS = [
    ['garra3', 'Garra de 3 dedos', 1, 'Palancas y articulaciones', 'Cierra y abre con una jeringa', 'Toma objetos ligeros (una pelota de unicel) y los suelta.', 'Cartón grueso o MDF de 3 mm, 2 jeringas de 10 ml, manguera de suero, palitos de madera, tornillos o remaches', 'Que levante y gire con una segunda jeringa'],
    ['brazo2', 'Brazo articulado de 2 grados', 2, 'Eslabones y pares de giro', 'Hombro y codo con 2 pares de jeringas', 'Lleva un objeto de un punto a otro.', 'MDF de 3 mm, 4 jeringas de 10 ml, manguera, tornillos con tuerca, base pesada', 'Agregar base giratoria (3er grado)'],
    ['grua', 'Grúa de pluma', 2, 'Palanca y polea', 'La pluma sube y baja con jeringa', 'Levanta una carga de 50 g con un gancho.', 'Palitos de madera, cartón, hilo, carrete, 2 jeringas de 20 ml, manguera', 'Calcular la ventaja mecánica de la pluma'],
    ['tijera', 'Elevador de tijera', 2, 'Mecanismo de tijera (pantógrafo)', 'Una jeringa empuja la tijera', 'Sube una plataforma con carga de 100 g.', 'Palitos de madera, tornillos, MDF para la plataforma, 2 jeringas de 20 ml, manguera', 'Medir la altura contra el volumen de líquido'],
    ['pala', 'Excavadora (pala)', 3, 'Varias palancas encadenadas', 'Brazo, cucharón y giro con 3 pares de jeringas', 'Recoge arena o arroz y lo deposita en otro lugar.', 'MDF de 3 mm, 6 jeringas, manguera, tornillos, caja para el material', 'Control de los 3 movimientos por una sola persona'],
    ['puente', 'Puente levadizo', 1, 'Palanca de primer género', 'La jeringa levanta el tablero', 'Sube y baja el tablero para dejar pasar un barco.', 'Cartón grueso, palitos, 2 jeringas de 10 ml, manguera, hilo', 'Contrapeso para que suba con menos fuerza'],
    ['compuerta', 'Compuerta de canal', 1, 'Corredera y guías', 'La jeringa sube la compuerta', 'Abre y cierra el paso del agua en un canal de botella.', 'Botella de PET, acrílico o cartón plastificado, 2 jeringas, manguera', 'Que selle sin fugas'],
    ['mano', 'Mano robótica', 3, 'Tendones (hilos) y articulaciones', 'Cada dedo con una jeringa que jala un hilo', 'Cierra los dedos para tomar un vaso.', 'Popotes, hilo de nylon, cartón, 5 jeringas pequeñas, manguera', 'Que agarre con dos dedos (pinza)'],
    ['prensa', 'Prensa de palanca', 1, 'Palanca y biela', 'Un cilindro de jeringa baja el pisón', 'Aplasta una lata o una bolita de plastilina.', 'MDF de 3 mm, tornillos, 2 jeringas de 20 ml, manguera', 'Medir la fuerza con un dinamómetro o báscula'],
    ['plataforma', 'Plataforma con piñón-cremallera', 2, 'Engrane y cremallera', 'Una jeringa empuja la cremallera que gira el engrane', 'Gira una plataforma 90°.', 'Engranes impresos o de cartón, MDF, palitos, 2 jeringas, manguera', 'Calcular el ángulo por cada ml de líquido'],
    ['limpia', 'Limpiaparabrisas', 2, 'Biela-manivela', 'Movimiento de vaivén con jeringa', 'El brazo barre un parabrisas de acetato.', 'Cartón, palitos, tornillos, 2 jeringas, manguera, acetato', 'Comparar el ángulo con el de un auto real'],
    ['clasificador', 'Clasificador de piezas', 3, 'Compuerta con palanca y rampa', 'La jeringa desvía la pieza a la izquierda o a la derecha', 'Separa piezas por color o tamaño en una rampa.', 'Cartón o MDF, canicas o tapitas, 2 jeringas, manguera', 'Agregar un sensor o final de carrera en la simulación de escalera']
  ];
  const DIF = ['', '🟢 Fácil', '🟡 Media', '🔴 Retadora'];
  V.proyectos = () => {
    const g = D.grupoActual(); const PJ = E.proyecto, pid = g && PJ ? PJ.canon(g, C.parcialActual().id) : null, eqs = g && PJ ? (PJ.doc(g, pid).equipos || []) : [];
    let h = card('<h3>🧰 Banco de proyectos</h3><p class="small">Mecanismos que primero construyen (Submódulo 2: eslabones, palancas, engranes) y luego mueven con hidráulica de jeringas (Submódulo 3), como pide el proyecto del módulo. Elige con cada equipo según su nivel y asígnalo: queda como el proyecto del equipo.</p>');
    h += E.PROYECTOS.map(p => { const de = eqs.filter(e => e.proy === p[1]); return card('<div class="row between gap wrap"><h3>' + esc(p[1]) + '</h3><span class="chip">' + DIF[p[2]] + '</span></div><p class="small"><b>Mecanismo:</b> ' + esc(p[3]) + ' · <b>Hidráulica:</b> ' + esc(p[4]) + '</p><p class="small"><b>Tiene que:</b> ' + esc(p[5]) + '</p><p class="small muted"><b>Material:</b> ' + esc(p[6]) + '</p><p class="small"><b>Reto extra:</b> ' + esc(p[7]) + '</p>' +
      (eqs.length ? '<div class="row gap wrap">' + (de.length ? '<span class="small">Lo hace: <b>' + de.map(e => esc(e.nombre)).join(', ') + '</b></span>' : '') + '<select class="inp" data-ch="bp-asig" data-p="' + p[0] + '"><option value="">Asignar a…</option>' + eqs.map(e => '<option value="' + e.id + '">' + esc(e.nombre) + (e.proy ? ' (' + esc(e.proy) + ')' : '') + '</option>').join('') + '</select></div>' : '')); }).join('');
    if (!eqs.length) h += card('<p class="small">Para asignarlos, arma primero los equipos en Proyecto.</p>' + link('Ir a Proyecto', 'proyecto', 'small'));
    return { t: 'Banco de proyectos', h: h };
  };
  CH['bp-asig'] = el => { if (!el.value) return; const g = D.grupoActual(), PJ = E.proyecto, pid = PJ.canon(g, C.parcialActual().id), p = E.PROYECTOS.find(x => x[0] === el.dataset.p);
    S.update('proy:' + g.id + ':' + pid, d => { const e = (d.equipos || []).find(x => x.id === el.value); if (e) e.proy = p[1]; }, {}); u.toast(p[1] + ' asignado', 'ok'); };

  /* ---------- 31 · cobertura del programa ---------- */
  E.cobertura = g => {
    const hoy = u.today(), out = {}; D.parciales().forEach(p => { const k0 = D.smKey(g, p.id); if (!k0) return; let pl = null; try { pl = E.clases.plan(g, p.id); } catch (e) { } if (!pl) return;
      pl.bloques.forEach(b => b.parts.forEach(pt => { const it = pt.it; if (!it || it.ac == null) return; const k = it.sm ? (g.modulo || 'II') + '-' + it.sm : k0, o = out[k] = out[k] || { k: k, ac: {}, plan: 0, dadas: 0 }, a = o.ac[it.ac] = o.ac[it.ac] || { dc: {}, plan: 0, dadas: 0 }, dk = it.dc == null ? 'x' : it.dc, d = a.dc[dk] = a.dc[dk] || { plan: 0, dadas: 0, cl: [], prox: null };
        const ya = !b.perdida && b.fecha <= hoy; d.plan += pt.h; a.plan += pt.h; o.plan += pt.h; if (ya) { d.dadas += pt.h; a.dadas += pt.h; o.dadas += pt.h; } else if (!d.prox || b.fecha < d.prox) d.prox = b.fecha; if (d.cl.indexOf(it.t) < 0) d.cl.push(it.t); })); });
    return Object.keys(out).map(k => out[k]);
  };
  V.cobertura = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const L = E.cobertura(g), M = (E.PROGRAMA.modulos || {})[g.modulo || 'II'] || {};
    let h = card('<h3>📐 Cobertura del programa</h3><p class="small">Cada actividad clave y cada desarrollo de la competencia del programa SEP contra las clases de tu plan: cuántas horas van dadas, qué falta y qué <b>no está en tu plan</b>. Útil antes del cierre del submódulo y para la planeación.</p>');
    if (!L.length) return { t: 'Cobertura del programa', h: h + card('<p class="muted">No encontré un plan de clases con submódulos para este grupo.</p>') };
    L.forEach(o => { const sm = (M.sub || {})[o.k.split('-')[1]]; if (!sm) return; const pct = o.plan ? Math.round(o.dadas / o.plan * 100) : 0;
      h += card('<h3>Submódulo ' + esc(o.k.split('-')[1]) + ': ' + esc(sm.nombre) + '</h3><div class="bar"><span style="width:' + pct + '%"></span></div><p class="small">' + o.dadas + ' de ' + o.plan + ' h de tu plan dadas (' + pct + ' %) · el programa marca ' + sm.horas + ' h.</p>' +
        sm.ac.map((ac, i) => { const a = o.ac[i] || { dc: {}, plan: 0, dadas: 0 }; return '<div class="cb-ac"><h4>' + (i + 1) + '. ' + esc(ac.titulo) + ' <small class="muted">(p. ' + esc(ac.pag) + ')</small></h4><p class="small muted">Producto: ' + esc(ac.producto) + ' · ' + a.dadas + '/' + a.plan + ' h</p><ul class="plain cb-l">' +
          (ac.desarrollo || []).map((dc, j) => { const d = a.dc[j]; const est = !d ? ['⚠️', 'No está en tu plan', 'bad'] : d.dadas >= d.plan ? ['✅', 'Visto (' + d.dadas + ' h)', 'ok'] : d.dadas > 0 ? ['◐', d.dadas + ' de ' + d.plan + ' h' + (d.prox ? ' · sigue el ' + u.fCorta(d.prox) : ''), 'warn'] : ['○', 'Planeado' + (d.prox ? ' para el ' + u.fCorta(d.prox) : ''), ''];
            return '<li class="cb-' + est[2] + '"><span>' + est[0] + '</span><div><p class="small">' + esc(String(dc).split(/[;,]/)[0]) + '…</p><small>' + est[1] + (d && d.cl.length ? ' · ' + esc(d.cl.slice(0, 3).join(' · ')) : '') + '</small></div></li>'; }).join('') + '</ul>' +
          (ac.criterios ? '<details class="sub"><summary>Criterios para evaluar el producto</summary><ul class="small">' + ac.criterios.map(c => '<li>' + esc(c) + '</li>').join('') + '</ul></details>' : '') + '</div>'; }).join('')); });
    return { t: 'Cobertura del programa', h: h };
  };
})();
