/* Escuadra · Presentador: el proyector muestra solo las diapositivas y tu pantalla (laptop o celular) muestra
   el control, las respuestas, tus notas y el temporizador. Funciona con dos ventanas del mismo navegador
   (laptop en modo "Extender" o Galaxy con DeX) y, si conectaste la sincronización, también entre dos aparatos. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, esc = u.esc;
  const V = E.views, A = E.actions, H = E.h;
  const card = H.card, btn = H.btn, link = H.link, icon = E.icon;
  E.modoPantalla = /^#\/pantalla/.test(location.hash);

  const PR = E.pres = { negro: false, vivo: 0, bc: null, rt: null, aplicando: false };
  const st = () => E.ui.pres || (E.ui.pres = { tema: null, i: 0, rev: false, dark: false, negro: false });

  /* ---------- transporte: misma compu (BroadcastChannel) y otro aparato (Supabase Realtime, si hay sesión) ---------- */
  function abrirCanal() {
    if (!PR.bc && 'BroadcastChannel' in window) { PR.bc = new BroadcastChannel('escuadra-presentador'); PR.bc.onmessage = e => recibir(e.data); }
    const sy = E.sync;
    if (!PR.rt && sy && sy.client && sy.user && sy.client.channel) {
      try {
        PR.rt = sy.client.channel('escuadra-pres-' + sy.user.id, { config: { broadcast: { self: false } } });
        PR.rt.on('broadcast', { event: 'm' }, x => recibir(x.payload)).subscribe();
      } catch (e) { PR.rt = null; }
    }
  }
  function enviar(m) {
    m.de = E.modoPantalla ? 'pantalla' : 'control';
    try { if (PR.bc) PR.bc.postMessage(m); } catch (e) { }
    try { if (PR.rt) PR.rt.send({ type: 'broadcast', event: 'm', payload: m }); } catch (e) { }
  }
  function recibir(m) {
    if (!m || m.de === (E.modoPantalla ? 'pantalla' : 'control')) return;
    if (E.modoPantalla) return alPantalla(m);
    // en el control
    if (m.tipo === 'hola' || m.tipo === 'vivo') { const antes = PR.conectada(); PR.vivo = Date.now(); if (m.tipo === 'hola') enviarEstado(); if (!antes) pintarEstado(); }
    if (m.tipo === 'estado') { const s = st(); if (m.tema === s.tema) { s.i = m.i; s.rev = m.rev; if (/^#\/presentador/.test(location.hash)) E.render(); } }
  }
  PR.conectada = () => Date.now() - PR.vivo < 7000;
  const enviarEstado = () => { const s = st(); if (s.tema) enviar({ tipo: 'estado', tema: s.tema, i: s.i, rev: s.rev, dark: s.dark, negro: s.negro }); };
  function pintarEstado() { const el = document.getElementById('pres-con'); if (el) { const ok = PR.conectada(); el.className = 'chip ' + (ok ? 'ok' : 'warn'); el.textContent = ok ? 'Pantalla conectada' : 'Sin pantalla conectada'; } }

  /* ---------- ventana del proyector ---------- */
  function alPantalla(m) {
    const P = E.proj;
    if (m.tipo === 'estado') {
      // si nada cambió (o solo la pantalla en negro), no se vuelve a dibujar: así un video no se reinicia
      const igual = P.t && P.t.id === m.tema && P.i === m.i && P.rev === !!m.rev && P.dark === !!m.dark;
      if (igual) { PR.negro = !!m.negro; const ng = document.getElementById('pj-negro'); if (ng) ng.hidden = !PR.negro; if (PR.negro) videoCmd('pauseVideo'); espera(false); return; }
      PR.aplicando = true;
      if (!P.t || P.t.id !== m.tema) P.open(m.tema);
      P.i = Math.max(0, Math.min(m.i, P.s.length - 1)); P.rev = !!m.rev; P.dark = !!m.dark; PR.negro = !!m.negro; P.draw();
      PR.aplicando = false; espera(false);
    }
    if (m.tipo === 'video') videoCmd(m.cmd);
    if (m.tipo === 'azar') { const g = D.grupoActual(), a = g && D.alumno(g, m.aid); const box = document.getElementById('pj-azar'); if (box) { box.hidden = false; box.innerHTML = '<div class="pj-azar-in"><span>Contesta</span><b>' + esc(a ? a.nombre : (m.nombre || '')) + '</b></div>'; } }
    if (m.tipo === 'azar-x') { const box = document.getElementById('pj-azar'); if (box) box.hidden = true; }
    if (m.tipo === 'cerrar') { P.close(); espera(true); }
  }
  // controla el video de YouTube que está en el proyector (API de mensajes del reproductor)
  function videoCmd(cmd) {
    const f = document.querySelector('#proj .pj-video iframe');
    if (f && f.contentWindow) try { f.contentWindow.postMessage(JSON.stringify({ event: 'command', func: cmd, args: [] }), '*'); } catch (e) { }
  }
  // cuando el profe cambia de diapositiva desde la laptop (teclado o toque), el control se entera
  PR.alDibujar = () => { if (E.modoPantalla && !PR.aplicando && E.proj.t) enviar({ tipo: 'estado', tema: E.proj.t.id, i: E.proj.i, rev: E.proj.rev }); };
  function espera(on) {
    let el = document.getElementById('pant-espera');
    if (!on) { if (el) el.remove(); return; }
    if (!el) { el = document.createElement('div'); el.id = 'pant-espera'; document.body.appendChild(el); }
    el.innerHTML = '<div class="pe-in">' + E.logo() + '<h1>Pantalla del proyector</h1><p>Lleva esta ventana a la pantalla del proyector y tócala para verla completa. Todo se controla desde tu celular o desde la otra ventana.</p></div>';
  }
  function botonCompleta() {
    let b = document.getElementById('pant-full');
    if (!b) { b = document.createElement('button'); b.id = 'pant-full'; b.type = 'button'; b.textContent = '⛶ Pantalla completa'; b.addEventListener('click', e => { e.stopPropagation(); document.documentElement.requestFullscreen().catch(() => { }); }); document.body.appendChild(b); }
    b.hidden = !!document.fullscreenElement;
  }
  PR.pantalla = () => {
    document.body.classList.add('pantalla'); document.title = 'Pantalla · Escuadra';
    const app = document.getElementById('app'); if (app) app.innerHTML = '';
    abrirCanal(); espera(true); botonCompleta();
    document.addEventListener('fullscreenchange', botonCompleta);
    document.addEventListener('click', () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => { }); });
    enviar({ tipo: 'hola' }); setInterval(() => enviar({ tipo: 'vivo' }), 3000);
    // si la sincronización se conecta después, también escucha al celular
    setTimeout(() => { if (E.sync && E.sync.init) E.sync.init().then(() => { abrirCanal(); enviar({ tipo: 'hola' }); }).catch(() => { }); }, 300);
  };

  /* ---------- control (tu laptop o tu celular) ---------- */
  V.presentador = id => {
    const t = E.TEMAS.find(x => x.id === id); if (!t) return { t: 'Presentador', h: card('<p>No encontré ese tema.</p>' + link('Ver temas', 'temas', 'primary')) };
    abrirCanal(); const s = st(); if (s.tema !== t.id) { s.tema = t.id; s.i = 0; s.rev = false; s.negro = false; }
    const sl = E.proj.slides(t), n = sl.length; s.i = Math.min(s.i, n - 1); const cur = sl[s.i], sig = sl[s.i + 1];
    const remoto = !!(E.sync && E.sync.user);
    let h = '<p><a href="#/tema/' + t.id + '">‹ ' + esc(t.titulo) + '</a></p>';
    h += card('<div class="row between gap wrap"><h3>' + icon('screen') + ' Presentador</h3><span id="pres-con" class="chip ' + (PR.conectada() ? 'ok' : 'warn') + '">' + (PR.conectada() ? 'Pantalla conectada' : 'Sin pantalla conectada') + '</span></div>' +
      '<p class="muted small">El proyector muestra solo la diapositiva; aquí ves respuestas, notas y el tiempo. ' + (remoto ? 'Como tienes la sincronización conectada, también puedes abrir la pantalla en otra computadora con tu sesión.' : '') + '</p>' +
      '<div class="row gap wrap">' + btn(icon('screen') + ' Abrir pantalla del proyector', 'pres-abrir', '', 'primary') + btn('Cómo conectarlo', 'pres-ayuda', '', 'ghost') + '</div>');
    h += '<div class="pres-grid"><div>' +
      '<div class="kicker">En el proyector · ' + (s.i + 1) + ' de ' + n + (s.negro ? ' · <b class="badc">pantalla en negro</b>' : '') + '</div>' +
      '<div class="pres-mini ' + (s.dark ? 'pj-dark' : '') + (s.negro ? ' negro' : '') + '"><div class="pj-slide">' + E.proj.body(cur, s.rev, true) + '</div></div>' +
      '<div class="pres-ctl">' + btn('‹', 'pres-ir', 'data-d="-1" aria-label="Anterior"', 'big') + (cur.k === 'q' && !s.rev ? btn('Mostrar respuesta', 'pres-rev', '', 'big accent') : '') + btn('Siguiente ›', 'pres-ir', 'data-d="1"', 'big primary') + '</div>' +
      (cur.k === 'video' ? '<div class="row gap wrap center">' + btn('▶ Reproducir video', 'pres-vid', 'data-cmd="playVideo"', 'accent') + btn('⏸ Pausar', 'pres-vid', 'data-cmd="pauseVideo"') + '</div>' : '') +
      '<div class="row gap wrap center">' + btn(icon('dice') + ' Al azar', 'pres-azar', '', 'small') + btn(s.negro ? '☀️ Encender pantalla' : '⬛ Pantalla en negro', 'pres-negro', '', 'small') + btn('🌓 Claro u oscuro', 'pres-dark', '', 'small') + btn('Cerrar proyección', 'pres-cerrar', '', 'small ghost danger') + '</div>' +
      '<div id="pres-azar"></div></div><div>' +
      card('<div class="kicker">Solo tú lo ves</div>' + (cur.k === 'q' ? '<p class="note ok"><b>Respuesta:</b> ' + esc(cur.a) + '</p>' : '') +
        (cur.k === 'fig' && E.FIGS[cur.fig] ? '<p class="note info"><b>Qué señalar:</b> ' + esc(E.FIGS[cur.fig].d) + '</p>' : '') +
        (cur.k === 'video' ? '<p class="note info">El video se ve en el proyector y necesita internet. Si no arranca con el botón, toca ▶ una vez en la pantalla del proyector (el navegador pide un primer toque para reproducir con sonido).</p>' : '') +
        '<p class="small"><b>Sigue:</b> ' + (sig ? esc(sig.k === 'q' ? sig.h + ': ' + sig.q : sig.h) : 'Fin del tema') + '</p>' +
        '<details class="sub" open><summary>Explicación para ti</summary>' + (t.explica || []).map(p => '<p class="small">' + esc(p) + '</p>').join('') + '</details>' +
        (t.errores && t.errores.length ? '<details class="sub"><summary>Errores comunes</summary><ul class="small">' + t.errores.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></details>' : '') +
        (t.ejemplo ? '<details class="sub"><summary>Ejemplo resuelto</summary><p class="small"><b>' + esc(t.ejemplo.titulo) + '</b></p><ol class="small">' + t.ejemplo.pasos.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol><p class="small">' + esc(t.ejemplo.resultado) + '</p></details>' : '')) +
      card('<div class="kicker">Ir a</div><ol class="pres-lista">' + sl.map((x, i) => '<li class="' + (i === s.i ? 'on' : '') + '"><button type="button" data-act="pres-saltar" data-i="' + i + '">' + esc(x.k === 'cover' ? x.h : x.k === 'q' ? x.h : x.h) + '</button></li>').join('') + '</ol>') +
      '</div></div>';
    return { t: 'Presentador', h: h, after: () => enviarEstado() };
  };
  const mover = d => { const s = st(), t = E.TEMAS.find(x => x.id === s.tema); if (!t) return; const n = E.proj.slides(t).length; const sl = E.proj.slides(t)[s.i];
    if (d > 0 && sl.k === 'q' && !s.rev) { s.rev = true; } else { const k = s.i + d; if (k < 0 || k >= n) return; s.i = k; s.rev = false; }
    E.render(); };
  A['pres-ir'] = el => mover(Number(el.dataset.d));
  A['pres-vid'] = el => { enviar({ tipo: 'video', cmd: el.dataset.cmd }); u.toast(el.dataset.cmd === 'playVideo' ? 'Reproduciendo en el proyector' : 'Video en pausa', 'ok'); };
  A['pres-rev'] = () => { st().rev = true; E.render(); };
  A['pres-saltar'] = el => { const s = st(); s.i = Number(el.dataset.i); s.rev = false; E.render(); };
  A['pres-negro'] = () => { const s = st(); s.negro = !s.negro; E.render(); };
  A['pres-dark'] = () => { const s = st(); s.dark = !s.dark; E.render(); };
  A['pres-cerrar'] = () => { enviar({ tipo: 'cerrar' }); u.toast('Proyección cerrada', 'ok'); };
  A['pres-azar'] = () => {
    const g = D.grupoActual(); const doc = g && S.get('asis:' + g.id + ':' + u.today());
    const list = g ? D.alumnos(g).filter(a => !doc || ['A', 'R'].indexOf(doc[a.id] || 'A') >= 0) : [];
    if (!list.length) { u.toast('Importa tu lista para usar el azar', 'err'); return; }
    const a = list[Math.floor(Math.random() * list.length)]; enviar({ tipo: 'azar', aid: a.id });
    const box = document.getElementById('pres-azar'); if (box) box.innerHTML = '<p class="note info">En el proyector: <b>' + esc(a.nombre) + '</b> ' + btn('+1 participación', 'pres-azar-ok', 'data-aid="' + a.id + '"', 'small accent') + btn('Quitar', 'pres-azar-x', '', 'small ghost') + '</p>';
  };
  A['pres-azar-ok'] = el => { const g = D.grupoActual(); S.update('part:' + g.id + ':' + u.today(), d => { d[el.dataset.aid] = Number(d[el.dataset.aid] || 0) + 1; }, {}); A['pres-azar-x'](); u.toast('+1 participación', 'ok'); };
  A['pres-azar-x'] = () => { enviar({ tipo: 'azar-x' }); const box = document.getElementById('pres-azar'); if (box) box.innerHTML = ''; };
  A['pres-abrir'] = async () => {
    const url = location.href.split('#')[0] + '#/pantalla'; let feats = 'popup,width=1280,height=720';
    try {
      // en Chrome de computadora con dos pantallas, la abre directo en la del proyector (pide permiso la primera vez)
      if ('getScreenDetails' in window) { const sd = await window.getScreenDetails(); const ext = sd.screens.find(x => x !== sd.currentScreen); if (ext) feats = 'popup,left=' + ext.availLeft + ',top=' + ext.availTop + ',width=' + ext.availWidth + ',height=' + ext.availHeight; }
    } catch (e) { }
    PR.win = window.open(url, 'escuadra-pantalla', feats);
    if (!PR.win) u.toast('El navegador bloqueó la ventana: permite ventanas emergentes para Escuadra', 'err', 7000);
    else u.toast('Lleva la ventana nueva al proyector y tócala para pantalla completa', 'ok', 6000);
  };
  A['pres-ayuda'] = () => E.modal.open('Cómo separar proyector y control', '<ol class="steps">' +
    '<li><b>Laptop con cable al proyector:</b> presiona <b>Windows + P</b> y elige <b>Extender</b>. Toca "Abrir pantalla del proyector", arrastra esa ventana al proyector y tócala para pantalla completa. Esta ventana se queda en tu laptop.</li>' +
    '<li><b>Galaxy S26 Ultra:</b> conéctalo con un adaptador USB-C a HDMI (o inalámbrico a una pantalla con Miracast) y entra en <b>Samsung DeX</b>: la pantalla del proyector trabaja aparte de la del celular. Abre ahí la pantalla del proyector y deja el control en tu celular.</li>' +
    '<li><b>Celular como control de otra computadora:</b> funciona cuando tengas la sincronización conectada y la misma sesión en los dos aparatos.</li>' +
    '<li><b>Si solo "duplicas" la pantalla</b> (Smart View, Chromecast o "Duplicar" en Windows), el proyector muestra exactamente lo mismo que tu aparato: ahí no se puede separar.</li></ol>' + btn('Entendido', 'modal-close', '', 'primary'));
  // con el teclado de la laptop también se controla desde la ventana del presentador
  document.addEventListener('keydown', e => {
    if (E.modoPantalla || !/^#\/presentador/.test(location.hash) || (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName))) return;
    if (['ArrowRight', 'PageDown', ' '].indexOf(e.key) >= 0) { e.preventDefault(); mover(1); }
    else if (['ArrowLeft', 'PageUp'].indexOf(e.key) >= 0) { e.preventDefault(); mover(-1); }
    else if (e.key === 'b' || e.key === 'B' || e.key === '.') { A['pres-negro'](); }
  });
  setInterval(() => { if (!E.modoPantalla) pintarEstado(); }, 4000);
})();
