/* Escuadra · Memorama de simbología ISO 1219 (v1.36.0). El juego vive en memorama.html (sin cuenta, sin instalar):
   - En el celular: cada alumno o pareja lo abre con el QR; al terminar le da un código de 4 dígitos (su primer juego).
   - En el proyector: un tablero para todo el grupo, por equipos y por turnos.
   Tres niveles: símbolo ↔ nombre, símbolo ↔ función y válvula completa ↔ nombre. Los símbolos están en iso1219.js.
   Aquí: enlaces y QR, registrar códigos, pasarlo a participación o a tareas, y fichas y cartas para imprimir. */
(function () {
  const E = window.E, S = E.store, D = E.data, C = E.calc, u = E.u, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h, card = H.card, btn = H.btn;
  const MM = E.memo = {}, KC = 'memoCfg', K = g => 'memo:' + g.id;
  const hash = s => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const base = pag => { const l = location.href.split('#')[0].split('?')[0]; return l.replace(/[^/]*$/, '') + pag; };
  MM.NIV = { 1: 'Símbolo ↔ nombre', 2: 'Símbolo ↔ función', 3: 'Válvula completa ↔ nombre' };
  MM.PARES = [6, 8, 10, 12];
  MM.cfg = () => Object.assign({ niv: 1, p: 8, cats: ['val', 'acc'], eq: 4 }, S.get(KC) || {});
  MM.doc = g => Object.assign({ gen: {}, res: {}, part: {} }, S.get(K(g)) || {});
  MM.sal = (g, f) => hash(g.id + '|mem|' + f).toString(16);
  MM.codigo = (c, num, niv, p, b) => String(1000 + hash('mem|' + c + '|' + num + '|' + niv + '|' + p + '|' + b) % 9000);
  MM.BANDA = { 3: 'excelente', 2: 'bien', 1: 'terminó' };
  const b64 = o => { const by = new TextEncoder().encode(JSON.stringify(o)); let s = ''; by.forEach(x => { s += String.fromCharCode(x); }); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  // enlace del juego; el de los celulares anota la fecha para reconocer después los códigos
  MM.url = (g, modo) => {
    const c = MM.cfg(), f = u.today(), o = { v: 1, k: 'mem', n: c.niv, p: c.p, cats: c.cats, m: modo === 'p' ? 'p' : 'c' };
    if (g) { o.g = g.nombre; if (modo !== 'p') { o.c = MM.sal(g, f); S.update(K(g), d => { d.gen = d.gen || {}; d.gen[f] = 1; const lim = u.addDays(f, -90); Object.keys(d.gen).forEach(k => { if (k < lim) delete d.gen[k]; }); }, {}); } }
    if (modo === 'p') o.eq = c.eq;
    return base('memorama.html') + '#j' + b64(o);
  };
  // ¿de qué juego es el código que trae el alumno? (fecha del enlace, nivel, pares y qué tan bien le fue)
  MM.verifica = (g, a, cod) => {
    cod = String(cod || '').replace(/\D/g, ''); if (cod.length !== 4) return null;
    for (const f of Object.keys(MM.doc(g).gen || {}).sort().reverse()) { const c = MM.sal(g, f);
      for (const niv of [1, 2, 3]) for (const p of MM.PARES) for (const b of [3, 2, 1]) if (MM.codigo(c, a.num, niv, p, b) === cod) return { f: f, niv: niv, p: p, b: b }; }
    return null;
  };
  MM.res = (g, aid) => (MM.doc(g).res || {})[aid] || [];
  MM.jugaron = g => D.alumnos(g).filter(a => MM.res(g, a.id).length);
  const resTxt = r => 'Nivel ' + r.niv + ' · ' + r.p + ' pares · ' + MM.BANDA[r.b] + ' · ' + u.fCorta(r.f);

  /* ---------- configuración ---------- */
  CH['mm-cfg'] = el => S.update(KC, d => { const b = MM.cfg(); Object.keys(b).forEach(k => { if (d[k] == null) d[k] = b[k]; });
    if (el.dataset.k === 'cats') d.cats = Array.from(document.querySelectorAll('[data-ch=mm-cfg][data-k=cats]:checked')).map(x => x.value); else d[el.dataset.k] = Number(el.value); }, {});

  /* ---------- QR, proyector ---------- */
  const qrBox = (url, txt) => '<div class="ca-qr">' + (E.cam ? E.cam.qrSVG(url, 'ca-qrsvg', 'L') : '') + '<p class="small muted">' + txt + '</p></div>';
  A['mm-qr'] = async () => {
    const g = D.grupoActual(), c = MM.cfg(); if (c.niv < 3 && !c.cats.length) { u.toast('Elige al menos un tema', 'err'); return; }
    if (E.cam && E.cam.qrListo) await E.cam.qrListo(); const url = MM.url(g, 'c'); E.ui.mmUrl = url;
    E.modal.open('🃏 Memorama en los celulares', qrBox(url, 'Nivel ' + c.niv + ' (' + MM.NIV[c.niv] + ') · ' + c.p + ' pares. Lo abren sin cuenta; pueden cambiar el nivel en su celular. Al terminar les da un código de 4 dígitos que capturas en «Registrar códigos».') +
      '<div class="row gap wrap">' + btn('📋 Copiar enlace', 'mm-copiar', '', 'primary') + '<a class="btn" href="' + esc(url) + '" target="_blank" rel="noopener">Probar</a>' + btn('📽 Proyectar QR', 'mm-proj', '', '') + '</div>');
  };
  A['mm-copiar'] = async () => { const ok = await u.copy(E.ui.mmUrl || ''); u.toast(ok ? 'Enlace copiado' : 'No se pudo copiar', ok ? 'ok' : 'err'); };
  A['mm-proj'] = () => { if (!E.proj || !E.ui.mmUrl) return; E.modal.close(); E.proj.abrir({ id: 'memo-qr', titulo: 'Memorama ISO 1219' }, [{ k: 'html', h: '🃏 Memorama de simbología ISO 1219', html: '<div class="pj-qrbox">' + E.cam.qrSVG(E.ui.mmUrl, 'pj-qr', 'L') + '<div><p>Escanea el código con tu celular y juega. Al terminar, guarda tu código de 4 dígitos para tu profe.</p></div></div>' }]); };
  A['mm-tablero'] = () => { const g = D.grupoActual(), c = MM.cfg(); if (c.niv < 3 && !c.cats.length) { u.toast('Elige al menos un tema', 'err'); return; } window.open(MM.url(g, 'p'), '_blank', 'noopener'); };

  /* ---------- registrar códigos ---------- */
  const fila = (g, a) => { const L = MM.res(g, a.id), ul = L[L.length - 1];
    return '<li><div><b>' + a.num + '. ' + esc(u.corto(a.nombre)) + '</b><br><small class="muted" id="mm-r-' + a.id + '">' + (ul ? '✓ ' + resTxt(ul) + (L.length > 1 ? ' · ' + L.length + ' juegos' : '') : 'Sin código') + '</small></div><input class="inp" style="max-width:96px;text-align:center" inputmode="numeric" maxlength="4" placeholder="0000" data-ch="mm-cod" data-aid="' + a.id + '" aria-label="Código de ' + esc(a.nombre) + '"></li>'; };
  A['mm-reg'] = () => { const g = D.grupoActual();
    E.modal.open('✅ Códigos del memorama', '<p class="small">Al terminar, cada alumno ve un código de 4 dígitos (de su primer juego en ese nivel). Escríbelo junto a su nombre: la app reconoce el día, el nivel, los pares y qué tan bien le fue.</p>' +
      (Object.keys(MM.doc(g).gen || {}).length ? '' : '<p class="note warn small">Primero genera el QR para los celulares: los códigos se reconocen por el enlace de ese día.</p>') +
      '<ul class="ap-list">' + D.alumnos(g).map(a => fila(g, a)).join('') + '</ul>'); };
  CH['mm-cod'] = el => {
    const g = D.grupoActual(), a = D.alumno(g, el.dataset.aid), cod = el.value.trim(); if (!a || !cod) return;
    const r = MM.verifica(g, a, cod);
    if (!r) { u.toast('El código ' + cod + ' no es de un memorama de ' + u.corto(a.nombre) + '. Revisa el número de lista o el código.', 'err', 4500); if (el.select) el.select(); return; }
    const ya = MM.res(g, a.id).some(x => x.f === r.f && x.niv === r.niv && x.p === r.p);
    if (!ya) S.update(K(g), d => { d.res = d.res || {}; (d.res[a.id] = d.res[a.id] || []).push(Object.assign({ reg: u.today() }, r)); }, {});
    el.value = ''; const sm = document.getElementById('mm-r-' + a.id); if (sm) sm.textContent = '✓ ' + resTxt(r);
    u.toast((ya ? 'Ya estaba: ' : '✓ ') + a.num + '. ' + u.corto(a.nombre) + ' · ' + resTxt(r), 'ok', 2500);
    const li = el.closest('li'), sig = li && li.nextElementSibling && li.nextElementSibling.querySelector('input'); if (sig) sig.focus();
  };

  /* ---------- pasarlo a calificaciones ---------- */
  // ⭐ una participación hoy a quien registró código (una sola vez por alumno y por día)
  A['mm-part'] = () => {
    const g = D.grupoActual(), hoy = u.today(), dd = MM.doc(g), quien = MM.jugaron(g).filter(a => ((dd.part || {})[a.id] || []).indexOf(hoy) < 0);
    if (!quien.length) { u.toast('No hay códigos nuevos para sumar hoy', 'err'); return; }
    S.update('part:' + g.id + ':' + hoy, d => { quien.forEach(a => { d[a.id] = Number(d[a.id] || 0) + 1; }); }, {});
    S.update(K(g), d => { d.part = d.part || {}; quien.forEach(a => { (d.part[a.id] = d.part[a.id] || []).push(hoy); }); }, {});
    u.toast('⭐ +1 participación a ' + quien.length + ' alumno' + (quien.length > 1 ? 's' : ''), 'ok', 3500);
  };
  // 📝 actividad en tareas y ejercicios del parcial en curso: 100 a quien lo terminó (la memoria no se califica, el esfuerzo sí)
  A['mm-act'] = () => {
    const g = D.grupoActual(), p = C.parcialActual(), al = MM.jugaron(g); if (!al.length) { u.toast('Todavía no registras códigos', 'err'); return; }
    const id = 'memo' + p.id, k = 'act:' + g.id + ':' + id, prev = S.get(k), notas = Object.assign({}, prev && prev.notas || {});
    al.forEach(a => { notas[a.id] = 100; });
    S.put(k, Object.assign({ id: id, parcial: p.id, categoria: 'trabajos', nombre: 'Memorama de simbología ISO 1219', peso: 1, max: 100, fecha: u.today(), cuenta: true }, prev || {}, { notas: notas }));
    u.toast('📝 «Memorama de simbología ISO 1219» en ' + C.catLbl('trabajos', p.id) + ' del ' + p.nombre + ': 100 a ' + al.length + ' alumno' + (al.length > 1 ? 's' : ''), 'ok', 5000);
  };

  /* ---------- fichas y cartas para imprimir ---------- */
  const lista = () => { const c = MM.cfg(), I = window.ISO1219; return c.niv === 3 ? I.COMPLETAS : I.SIM.filter(s => c.cats.indexOf(s.cat) >= 0); };
  A['mm-fichas'] = () => { const L = lista(), I = window.ISO1219; if (!L.length) { u.toast('Elige al menos un tema', 'err'); return; }
    const grupos = MM.cfg().niv === 3 ? [['comp', 'Válvulas completas']] : Object.keys(I.CAT).filter(k => L.some(s => s.cat === k)).map(k => [k, I.CAT[k]]);
    E.print.run('<div class="pr mm-pf"><h1>Simbología neumática ISO 1219</h1>' + grupos.map(gq => '<h2>' + esc(gq[1]) + '</h2><div class="mm-fg">' + L.filter(s => s.cat === gq[0]).map(s => '<div class="mm-fi"><div class="mm-fs">' + s.svg + '</div><div><b>' + esc(s.n) + '</b><br><span>' + esc(s.f) + '</span></div></div>').join('') + '</div>').join('') + '</div>', { title: 'Fichas · simbología ISO 1219' }); };
  A['mm-cartas'] = () => { const L = lista(), c = MM.cfg(); if (!L.length) { u.toast('Elige al menos un tema', 'err'); return; }
    const cs = []; L.forEach(s => { cs.push('<div class="mm-ct"><div class="mm-cs">' + s.svg + '</div></div>'); cs.push('<div class="mm-ct tx"><span>' + esc(c.niv === 2 ? s.f : s.n) + '</span></div>'); });
    let h = ''; for (let i = 0; i < cs.length; i += 12) h += '<div class="bt-pg"><div class="pr mm-cg">' + cs.slice(i, i + 12).join('') + '</div></div>';
    E.print.run(h, { title: 'Cartas del memorama (' + cs.length + ')', propioLogo: true, margin: '8mm' }); };

  /* ---------- en la clase ---------- */
  MM.enClase = it => !!it && /memorama/i.test(JSON.stringify([it.t, it.pasos || [], it.ideas || []])) && /1219|simbolog|neum|válvul|valvul|iso/i.test(JSON.stringify([it.t, it.pasos || [], it.ideas || []]));
  MM.claseHTML = () => '<div class="row gap wrap">' + H.link('🃏 Memorama en el celular o el proyector', 'memorama', 'small') + '</div>';

  /* ---------- pantalla ---------- */
  V.memorama = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup();
    const c = MM.cfg(), I = window.ISO1219, al = D.alumnos(g), jug = MM.jugaron(g), n = c.niv === 3 ? I.COMPLETAS.length : I.SIM.filter(s => c.cats.indexOf(s.cat) >= 0).length;
    const radio = (k, v, l) => '<label class="chk"><input type="radio" name="mm-' + k + '" data-ch="mm-cfg" data-k="' + k + '" value="' + v + '"' + (c[k] === v ? ' checked' : '') + '> ' + l + '</label>';
    let h = card('<h3>🃏 Memorama de simbología ISO 1219</h3><p class="small">Sin imprimir un juego por alumno: lo juegan en su celular (solos o en pareja) o todo el grupo en el proyector por equipos. Al hacer pareja ven el símbolo en grande, su nombre y para qué sirve.</p>' +
      '<p class="small"><b>Nivel</b></p><div class="row gap wrap">' + [1, 2, 3].map(v => radio('niv', v, 'Nivel ' + v + ': ' + MM.NIV[v])).join('') + '</div>' +
      (c.niv < 3 ? '<p class="small mt"><b>Temas</b></p><div class="row gap wrap">' + Object.keys(I.CAT).map(k => '<label class="chk"><input type="checkbox" data-ch="mm-cfg" data-k="cats" value="' + k + '"' + (c.cats.indexOf(k) >= 0 ? ' checked' : '') + '> ' + esc(I.CAT[k]) + ' (' + I.SIM.filter(s => s.cat === k).length + ')</label>').join('') + '</div>' : '<p class="small muted mt">Nivel 3: ' + I.COMPLETAS.length + ' válvulas completas (vías y posiciones + mando + retorno).</p>') +
      '<p class="small mt"><b>Pares</b></p><div class="row gap wrap">' + MM.PARES.map(v => radio('p', v, v + ' (' + v * 2 + ' cartas)')).join('') + '</div>' +
      '<p class="small muted">' + n + ' símbolos en este juego; cada partida toma ' + Math.min(c.p, n) + ' al azar.</p>' +
      '<div class="row gap wrap mt">' + btn('📱 QR para los celulares', 'mm-qr', '', 'primary') + btn('📽 Jugar en el proyector', 'mm-tablero', '', '') + '</div>' +
      '<p class="small mt"><b>Equipos en el proyector</b></p><div class="row gap wrap">' + [2, 3, 4, 5, 6].map(v => radio('eq', v, String(v))).join('') + '</div>');
    h += card('<h3>✅ Quién lo jugó</h3><p class="small">' + (al.length ? jug.length + ' de ' + al.length + ' alumnos con código registrado.' : 'Agrega tus alumnos para registrar sus códigos.') + '</p>' +
      (jug.length ? '<p class="small muted">' + jug.slice(0, 40).map(a => { const L = MM.res(g, a.id), r = L[L.length - 1]; return a.num + ' (N' + r.niv + ', ' + MM.BANDA[r.b] + ')'; }).join(' · ') + '</p>' : '') +
      '<div class="row gap wrap">' + btn('✅ Registrar códigos', 'mm-reg', '', jug.length ? '' : 'primary') + (jug.length ? btn('⭐ +1 participación (hoy)', 'mm-part', '', '') + btn('📝 Contar en tareas y ejercicios', 'mm-act', '', '') : '') + '</div>' +
      '<p class="muted small">La participación suma 1 hoy a quien trae código. La actividad pone 100 a quien lo terminó (no califica la memoria, sino que lo hizo).</p>');
    h += card('<h3>🖨 Para imprimir</h3><div class="row gap wrap">' + btn('📖 Fichas de estudio', 'mm-fichas', '', '') + btn('🃏 Cartas (por si no hay celular)', 'mm-cartas', '', 'ghost') + '</div><p class="muted small">Las fichas traen cada símbolo con su nombre y para qué sirve; las cartas, 12 por hoja, de los temas y el nivel que elegiste.</p>');
    return { t: 'Memorama ISO 1219', h: h };
  };
})();
