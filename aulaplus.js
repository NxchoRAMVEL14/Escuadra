/* Escuadra · Tus clases (v1.26).
   7) Kit «te lo perdiste»: cuando un alumno que faltó vuelve, la app te avisa en el pase de lista y le das un QR con lo que
      se vio, la tarea y la evidencia que debe (página ver.html; los datos viajan en el enlace, no en un servidor).
   8) Actividad en 3 niveles: apoyo, estándar y reto para el tema de la clase, con preguntas del banco por nivel
      (recordar, comprender, aplicar) y los alumnos acomodados según el semáforo; se imprime en una hoja.
   9) Participación equitativa: ruleta que prefiere a quien no ha participado en la semana y suma la participación.
   10) Rúbrica antes de la entrega: QR con la rúbrica de la actividad para que sepan cómo se calificará.
   11) Simulacros y revisión mensual (extintor, botiquín, ruta de evacuación), con lo que pide la NOM-002-STPS-2010.
   12) Ficha de emergencia: teléfonos, número del seguro facultativo (IMSS) y notas que la familia autorice; directorio
       a un toque que funciona sin internet. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const AP = E.aulaplus = {};
  const corto = (t, n) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
  const base = pag => { const l = location.href.split('#')[0].split('?')[0]; return l.replace(/[^/]*$/, '') + pag; };
  const verURL = async d => base('ver.html') + '#' + await E.casa.empaca(d);
  const qrModal = async (titulo, url, txt) => { if (E.cam && E.cam.qrListo) await E.cam.qrListo(); E.ui.apUrl = url; E.modal.open(titulo, '<div class="ca-qr">' + (E.cam ? E.cam.qrSVG(url, 'ca-qrsvg', 'L') : '') + '<p class="small muted">' + txt + '</p></div><div class="row gap wrap">' + btn('📋 Copiar enlace', 'ap-copiar', '', 'primary') + '<a class="btn" href="' + esc(url) + '" target="_blank" rel="noopener">Probar</a>' + btn('📽 Proyectar QR', 'ap-proj', 'data-t="' + esc(titulo) + '"', '') + '</div>'); };
  A['ap-copiar'] = async () => { const ok = await u.copy(E.ui.apUrl || ''); u.toast(ok ? 'Enlace copiado' : 'No se pudo copiar', ok ? 'ok' : 'err'); };
  A['ap-proj'] = el => { if (!E.proj || !E.ui.apUrl) return; E.modal.close(); E.proj.abrir({ id: 'ap-qr', titulo: el.dataset.t }, [{ k: 'html', h: el.dataset.t, html: '<div class="pj-qrbox">' + E.cam.qrSVG(E.ui.apUrl, 'pj-qr', 'L') + '<div><p>Escanéalo con tu celular.</p></div></div>' }]); };

  /* ================= 7) KIT «TE LO PERDISTE» ================= */
  const KK = g => 'kit:' + g.id;
  // faltas recientes (14 días) que todavía no tienen kit entregado
  AP.faltas = (g, aid, hasta) => {
    const out = [], ent = (S.get(KK(g)) || {})[aid] || {};
    for (let i = 1; i <= 14; i++) { const f = u.addDays(hasta, -i); if (!C.esClase(g, f)) continue; const d = S.get('asis:' + g.id + ':' + f); if (!d) continue; if (d[aid] === 'F' && !ent[f]) out.push(f); }
    return out.sort();
  };
  // quiénes regresaron hoy después de faltar
  AP.regresaron = (g, f) => { const d = S.get('asis:' + g.id + ':' + f) || null; return D.alumnos(g).filter(a => (!d || ['A', 'R'].indexOf(d[a.id] || 'A') >= 0)).map(a => ({ a: a, f: AP.faltas(g, a.id, f) })).filter(x => x.f.length); };
  AP.kitDatos = (g, a, fechas) => {
    const cf = D.cfg(), sec = [];
    fechas.forEach(f => {
      let d = null; try { d = E.clases.dia(g, f); } catch (e) { d = null; } const L = [], tar = [], ev = [], pre = [];
      (d ? d.bloques : []).forEach(b => { if (b.perdida) return; b.parts.forEach(pt => { const it = pt.it; if (L.indexOf(it.t) < 0) L.push(it.t); if (it.tarea && tar.indexOf(it.tarea) < 0 && !pt.sigue) tar.push(it.tarea); if (it.ev && !pt.sigue && ev.indexOf(it.ev) < 0) ev.push(it.ev); if (it.pre) pre.push(it.pre); if (it.obj && L.length < 6) L.push('Objetivo: ' + it.obj); }); });
      const acts = C.acts(g, (D.parciales().find(p => f >= p.inicio && f <= p.fin) || {}).id || '').filter(x => x.fecha === f && !C.sinCal(x)).map(x => x.nombre);
      sec.push({ h: u.cap(u.fLarga(f)), l: L.length ? L : ['Revisa con un compañero lo que se vio.'], extra: [].concat(tar.map(t => '📝 Tarea: ' + t), ev.map(t => '📌 Evidencia: ' + t), acts.map(t => '📌 Se pidió: ' + t), pre.length ? ['🔑 Palabras clave: ' + pre.join(' · ')] : []) });
    });
    return { v: 1, tipo: 'kit', g: g.nombre, pl: cf.plantel || '', t: 'Lo que te perdiste', sub: 'No. ' + a.num + ' · ' + (E.casa.iniciales ? E.casa.iniciales(a.nombre) : ''), sec: sec, pie: 'Pídele la libreta a un compañero, ponte al corriente y entrégalo a tu docente' + (cf.docente ? ' (' + cf.docente + ')' : '') + '. Generado el ' + u.fFecha(u.today()) + '.' };
  };
  AP.kitHTML = (g, f) => {
    const L = AP.regresaron(g, f); if (!L.length) return '';
    return card('<h3>🎒 Regresaron después de faltar</h3><p class="muted small">Dales su kit «te lo perdiste»: un QR con lo que se vio, la tarea y lo que deben entregar.</p><ul class="sg-l">' + L.map(x => '<li><span><b>' + x.a.num + '.</b> ' + esc(u.corto(x.a.nombre)) + ' <small class="muted">faltó ' + x.f.map(u.fCorta).join(', ') + '</small></span><span class="row gap">' + btn('🎒 Kit (QR)', 'kit-qr', 'data-aid="' + x.a.id + '" data-f="' + f + '"', 'small primary') + btn('✓ Ya lo tiene', 'kit-ok', 'data-aid="' + x.a.id + '" data-f="' + f + '"', 'small ghost') + '</span></li>').join('') + '</ul>' + (L.length > 1 ? btn('🖨 Imprimir tiras', 'kit-print', 'data-f="' + f + '"', 'small') : ''));
  };
  A['kit-qr'] = async el => { const g = D.grupoActual(), a = D.alumno(g, el.dataset.aid), fs = AP.faltas(g, a.id, el.dataset.f); const url = await verURL(AP.kitDatos(g, a, fs)); await qrModal('🎒 Kit de ' + u.corto(a.nombre), url, 'Que lo escanee con su celular. Muestra lo que se vio el ' + fs.map(u.fCorta).join(', ') + ', la tarea y lo que debe entregar.'); };
  A['kit-ok'] = el => { const g = D.grupoActual(), fs = AP.faltas(g, el.dataset.aid, el.dataset.f); S.update(KK(g), d => { const x = d[el.dataset.aid] = d[el.dataset.aid] || {}; fs.forEach(f => { x[f] = u.today(); }); }, {}); };
  A['kit-print'] = el => {
    const g = D.grupoActual(), L = AP.regresaron(g, el.dataset.f);
    E.print.run('<div class="pr">' + L.map(x => { const d = AP.kitDatos(g, x.a, x.f); return '<div class="tira"><b>' + esc(d.t) + ' · ' + esc(x.a.num + '. ' + u.corto(x.a.nombre)) + '</b>' + d.sec.map(s => '<p class="tiny"><b>' + esc(s.h) + ':</b> ' + esc(s.l.join(' · ')) + (s.extra.length ? '<br>' + esc(s.extra.join(' · ')) : '') + '</p>').join('') + '</div>'; }).join('') + '</div>', { title: 'Kits te lo perdiste', margin: '10mm' });
  };
  if (V.lista) { const vl = V.lista; V.lista = function (f) { const o = vl.apply(null, arguments), g = D.grupoActual(); if (o && g && !/Algo falló|Primero importa/.test(o.h)) { const fe = f || C.fechaListaDefault(g, u.today()); try { o.h += AP.kitHTML(g, fe); } catch (e) { console.error(e); } } return o; }; }

  /* ================= 8) ACTIVIDAD EN 3 NIVELES ================= */
  const NIV3 = { apoyo: { t: 'Apoyo', ico: '🧩', niv: 1, cls: 'bad', consigna: 'Con el ejemplo resuelto a la vista y con tu pareja tutora: contesta paso a paso. Pide ayuda en cuanto te atores.' }, estandar: { t: 'Estándar', ico: '📘', niv: 2, cls: 'warn', consigna: 'Resuelve solo y después compara con tu compañero de al lado.' }, reto: { t: 'Reto', ico: '🚀', niv: 3, cls: 'ok', consigna: 'Resuelve y explica por qué; al terminar, apoya a alguien del nivel de apoyo.' } };
  const usable = b => b && typeof b.q === 'string' && b.tipo !== 'ab' && Array.isArray(b.op);
  AP.preg = (tema, niv, n, evita) => { const ok = b => b.tema === tema && usable(b) && !(evita && evita.has(b.id)); let L = u.shuffle((E.BANCO || []).filter(b => ok(b) && Number(b.niv || 2) === niv)); if (L.length < n) L = L.concat(u.shuffle((E.BANCO || []).filter(b => ok(b) && Math.abs(Number(b.niv || 2) - niv) === 1 && L.indexOf(b) < 0))); return L.slice(0, n); };
  AP.nivelDe = (g, aid, pid) => { const ov = ((E.ui.n3 || {}).ov || {})[aid]; if (ov) return ov; const v = C.cal(g, pid, aid).final; const n = E.semaforo ? E.semaforo.nivel(v) : (v == null ? null : v >= 80 ? 'bien' : v >= 60 ? 'reg' : 'mal'); return n === 'mal' ? 'apoyo' : n === 'bien' ? 'reto' : 'estandar'; };
  AP.temasClase = (g, f) => { let d = null; try { d = E.clases.dia(g, f); } catch (e) { d = null; } const ts = []; (d ? d.bloques : []).forEach(b => { if (b.perdida) return; b.parts.forEach(pt => { if (pt.it.tema && ts.indexOf(pt.it.tema) < 0) ts.push(pt.it.tema); }); }); return ts; };
  const tTit = id => { const t = (E.TEMAS || []).find(x => x.id === id); return t ? t.titulo : id; };
  V.niveles = f => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const al = D.alumnos(g); if (!al.length) return H.needAlumnos('3 niveles');
    f = f || C.fechaListaDefault(g, u.today()); const p = C.parcialActual(f), ui = E.ui.n3 = E.ui.n3 || { ov: {}, tema: null, sem: 1 };
    const conB = (E.TEMAS || []).filter(t => (E.BANCO || []).some(b => b.tema === t.id && usable(b))), deHoy = AP.temasClase(g, f).filter(t => conB.some(x => x.id === t));
    const tema = ui.tema && conB.some(t => t.id === ui.tema) ? ui.tema : (deHoy[0] || (conB[0] || {}).id);
    if (!tema) return { t: '3 niveles', h: card('<p>No hay preguntas en el banco para tus temas todavía.</p>') };
    const grupos = { apoyo: [], estandar: [], reto: [] }; al.forEach(a => grupos[AP.nivelDe(g, a.id, p.id)].push(a));
    let h = card('<h3>🪜 Actividad en 3 niveles</h3><p class="small">Mismo tema, tres caminos: <b>apoyo</b> (recordar, con ejemplo y pareja), <b>estándar</b> (comprender) y <b>reto</b> (aplicar). Los alumnos se acomodan solos según el semáforo; tócalos para moverlos.</p>' +
      '<label class="fld"><span>Tema' + (deHoy.length ? ' (los de la clase van primero)' : '') + '</span><select data-ch="n3-tema">' + deHoy.concat(conB.map(t => t.id).filter(id => deHoy.indexOf(id) < 0)).map(id => '<option value="' + esc(id) + '"' + (id === tema ? ' selected' : '') + '>' + (deHoy.indexOf(id) >= 0 ? '★ ' : '') + esc(tTit(id)) + '</option>').join('') + '</select></label>' +
      '<div class="row gap wrap">' + btn('🖨 Imprimir hojas por nivel', 'n3-print', 'data-tema="' + esc(tema) + '"', 'primary small') + btn('🎲 Otras preguntas', 'n3-otra', '', 'small ghost') + '</div>');
    const pr = {}, usadas = new Set(); ['estandar', 'apoyo', 'reto'].forEach(k => { pr[k] = AP.preg(tema, NIV3[k].niv, 4, usadas); pr[k].forEach(b => usadas.add(b.id)); });
    ui.pr = { tema: tema, ids: Object.keys(pr).reduce((o, k) => { o[k] = pr[k].map(b => b.id); return o; }, {}) };
    Object.keys(NIV3).forEach(k => { const N = NIV3[k];
      h += card('<div class="row between gap wrap"><h3>' + N.ico + ' ' + N.t + ' (' + grupos[k].length + ')</h3><span class="chip ' + N.cls + '">nivel ' + N.niv + '</span></div><p class="small muted">' + esc(N.consigna) + '</p>' +
        '<p class="small">' + (grupos[k].length ? grupos[k].map(a => '<button type="button" class="chip n3-al" data-act="n3-mover" data-aid="' + a.id + '" title="Mover de nivel">' + esc(u.corto(a.nombre)) + '</button>').join(' ') : '<span class="muted">Nadie</span>') + '</p>' +
        (pr[k].length ? '<ol class="small">' + pr[k].map(b => '<li>' + esc(b.q) + '</li>').join('') + '</ol>' : '<p class="small muted">No hay preguntas de este nivel en el tema.</p>'));
    });
    return { t: '3 niveles', h: h };
  };
  CH['n3-tema'] = el => { E.ui.n3.tema = el.value; E.render(); };
  A['n3-otra'] = () => E.render();
  A['n3-mover'] = el => { const g = D.grupoActual(), ui = E.ui.n3, p = C.parcialActual(), cur = AP.nivelDe(g, el.dataset.aid, p.id), ord = ['apoyo', 'estandar', 'reto']; ui.ov[el.dataset.aid] = ord[(ord.indexOf(cur) + 1) % 3]; E.render(); };
  A['n3-print'] = () => {
    const g = D.grupoActual(), ui = E.ui.n3, p = C.parcialActual(), al = D.alumnos(g), tema = ui.pr.tema;
    const hoja = k => { const N = NIV3[k], bs = (ui.pr.ids[k] || []).map(id => (E.BANCO || []).find(b => b.id === id)).filter(Boolean), quien = al.filter(a => AP.nivelDe(g, a.id, p.id) === k);
      return '<div class="pr"><div class="p-title">' + esc(tTit(tema)).toUpperCase() + ' · NIVEL ' + N.t.toUpperCase() + '</div><p class="tiny c">' + esc(g.nombre) + ' · ' + u.fFecha(u.today()) + '</p><p><b>Consigna:</b> ' + esc(N.consigna) + '</p><p class="tiny"><b>Para:</b> ' + quien.map(a => esc(u.corto(a.nombre))).join(', ') + '</p><ol>' + bs.map(b => '<li class="n3-q">' + esc(b.q) + (b.tipo === 'vf' ? '<br>( ) Verdadero ( ) Falso' : '<br>' + u.shuffle(b.op.slice()).map(o => '( ) ' + esc(o)).join('&nbsp;&nbsp; ')) + '</li>').join('') + '</ol><p class="tiny">Nombre: ______________________________ No. ____</p></div><div class="pbreak"></div>'; };
    E.print.run(Object.keys(NIV3).map(hoja).join(''), { title: '3 niveles · ' + tTit(tema), margin: '12mm' });
  };

  /* ================= 9) PARTICIPACIÓN EQUITATIVA ================= */
  const lunes = f => { const d = u.parse(f); return u.addDays(f, -((d.getDay() + 6) % 7)); };
  AP.partSemana = (g, f) => { const L = lunes(f), out = {}; for (let i = 0; i < 7; i++) { const d = S.get('part:' + g.id + ':' + u.addDays(L, i)) || {}; Object.keys(d).forEach(k => { out[k] = (out[k] || 0) + Number(d[k] || 0); }); } return out; };
  AP.presentes = (g, f) => { const d = S.get('asis:' + g.id + ':' + f); return D.alumnos(g).filter(a => !d || ['A', 'R'].indexOf(d[a.id] || 'A') >= 0); };
  AP.ruleta = (g, f) => {
    const ps = AP.presentes(g, f), sem = AP.partSemana(g, f), ui = E.ui.rul = E.ui.rul || { rec: [] };
    const min = ps.reduce((m, a) => Math.min(m, sem[a.id] || 0), Infinity);
    let cand = ps.filter(a => (sem[a.id] || 0) === min && ui.rec.indexOf(a.id) < 0); if (!cand.length) cand = ps.filter(a => ui.rec.indexOf(a.id) < 0); if (!cand.length) { ui.rec = []; cand = ps; }
    return cand[Math.floor(Math.random() * cand.length)] || null;
  };
  V.ruleta = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); if (!D.alumnos(g).length) return H.needAlumnos('Ruleta');
    const f = u.today(), ui = E.ui.rul = E.ui.rul || { rec: [] }, sem = AP.partSemana(g, f), ps = AP.presentes(g, f), cur = ui.cur && D.alumno(g, ui.cur), nadie = ps.filter(a => !sem[a.id]);
    let h = card('<div class="rul">' + (cur ? '<div class="rul-n">' + esc(u.corto(cur.nombre)) + '</div><p class="muted">No. ' + cur.num + ' · ' + (sem[cur.id] ? sem[cur.id] + ' participaciones esta semana' : 'aún no participa esta semana') + '</p>' : '<div class="rul-n muted">¿Quién sigue?</div>') +
      '<div class="row gap wrap center">' + btn('🎯 Elegir', 'rul-go', '', 'primary big') + (cur ? btn('⭐ +1 participación', 'rul-mas', 'data-aid="' + cur.id + '"', 'big') + btn('Otro', 'rul-go', '', 'ghost') : '') + '</div></div>');
    h += card('<h3>⚖️ Esta semana</h3><p class="small">' + nadie.length + ' de ' + ps.length + ' presentes no han participado. La ruleta elige primero entre quienes llevan menos y no repite a los últimos.</p>' + (nadie.length ? '<p class="small">' + nadie.map(a => '<span class="chip">' + esc(u.corto(a.nombre)) + '</span>').join(' ') + '</p>' : '<p class="note ok small">✓ Todos los presentes ya participaron.</p>'));
    return { t: 'Participación equitativa', h: h };
  };
  A['rul-go'] = () => { const g = D.grupoActual(), a = AP.ruleta(g, u.today()), ui = E.ui.rul; if (!a) return; ui.cur = a.id; ui.rec = [a.id].concat(ui.rec).slice(0, Math.max(3, Math.floor(D.alumnos(g).length / 3))); E.render(); };
  A['rul-mas'] = el => { const g = D.grupoActual(); S.update('part:' + g.id + ':' + u.today(), d => { d[el.dataset.aid] = Number(d[el.dataset.aid] || 0) + 1; }, {}); u.toast('+1 participación', 'ok'); };
  if (V.herramientas) { const vh = V.herramientas; V.herramientas = function () { const o = vh.apply(null, arguments); if (o && o.h) o.h = card('<div class="row between gap wrap"><div><h3>⚖️ Participación equitativa</h3><p class="small muted">Ruleta que prefiere a quien no ha participado esta semana.</p></div>' + link('Abrir', 'ruleta', 'primary small') + '</div>') + card('<div class="row between gap wrap"><div><h3>🪜 Actividad en 3 niveles</h3><p class="small muted">Apoyo, estándar y reto según el semáforo.</p></div>' + link('Abrir', 'niveles', 'small') + '</div>') + o.h; return o; }; }

  /* ================= 10) RÚBRICA ANTES DE LA ENTREGA ================= */
  const NIVN = ['Excelente', 'Bien', 'Suficiente', 'Por mejorar'];
  AP.rubDatos = (g, nombre, rub, mx) => { const nv = rub.niv && rub.niv.length === 4 ? rub.niv : [100, 85, 70, 50]; const cf = D.cfg();
    return { v: 1, tipo: 'rubrica', g: g.nombre, pl: cf.plantel || '', t: 'Rúbrica: ' + nombre, sub: 'Así se va a calificar. Revísala antes de entregar.', tabla: { cab: ['Criterio'].concat(NIVN.map((n, i) => n + ' (' + Math.round(nv[i] / 100 * (mx || 100)) + ')')), filas: (rub.crit || []).map(c => [c, '✓', '✓', '✓', '✓']) }, sec: [{ h: 'Cómo se usa', l: ['Cada criterio se califica en uno de los cuatro niveles.', 'La calificación es el promedio de los criterios.', 'Revisa cada criterio antes de entregar: ¿en qué nivel está tu trabajo?'] }], pie: (cf.docente ? cf.docente + ' · ' : '') + u.fFecha(u.today()) };
  };
  A['rub-qr'] = async el => {
    const g = D.grupoActual(); let nombre, rub, mx = 100;
    if (el.dataset.id) { const a = S.get('act:' + g.id + ':' + el.dataset.id); if (!a || !a.rub) { u.toast('Esta actividad no tiene rúbrica', 'err'); return; } nombre = a.nombre; rub = a.rub; mx = C.maxPts(a); }
    else { const T = (E.cap && E.cap.rubs ? E.cap.rubs() : null) || {}, t = T[el.dataset.tpl]; if (!t) return; nombre = t.n; rub = { crit: t.crit, niv: null }; }
    const url = await verURL(AP.rubDatos(g, nombre, rub, mx)); await qrModal('📋 Rúbrica: ' + corto(nombre, 40), url, 'Proyéctalo o compártelo antes de que empiecen: así saben exactamente qué se evalúa.');
  };
  if (V.actividad) { const va = V.actividad; V.actividad = function (id) { const o = va.apply(null, arguments), g = D.grupoActual(), a = g && S.get('act:' + g.id + ':' + id); if (o && a && a.rub && !/Algo falló/.test(o.h)) { const x = card('<div class="row between gap wrap"><div><h3>📋 Rúbrica para los alumnos</h3><p class="small muted">QR con los criterios, para antes de la entrega.</p></div>' + btn('📱 QR de la rúbrica', 'rub-qr', 'data-id="' + a.id + '"', 'small primary') + '</div>'); const i = o.h.indexOf('</section>'); o.h = i >= 0 ? o.h.slice(0, i + 10) + x + o.h.slice(i + 10) : o.h + x; } return o; }; }

  /* ================= 11) SIMULACROS Y REVISIÓN MENSUAL ================= */
  const KS = 'segSim';
  AP.sim = () => { const d = S.get(KS) || {}; return { reg: d.reg || [], prog: d.prog || [], rev: d.rev || {} }; };
  const REV = ['Extintor: manómetro en verde, con seguro y sello, sin golpes', 'Extintor visible, sin obstáculos y a no más de 1.50 m del piso', 'Botiquín completo y en su lugar', 'Ruta de evacuación señalizada y libre', 'Salida del taller sin obstáculos; punto de reunión conocido'];
  const TIPOS = { evacuacion: '🚪 Evacuación', incendio: '🔥 Incendio', sismo: '🌎 Sismo', otro: '• Otro' };
  AP.simEstado = () => { const s = AP.sim(), hoy = u.today(), ult = s.reg.slice().sort((a, b) => b.f.localeCompare(a.f))[0], mes = hoy.slice(0, 7), rv = s.rev[mes] || {}; return { ult: ult, dias: ult ? u.diffDays(ult.f, hoy) : null, mesOk: REV.every((x, i) => rv[i]), rv: rv, mes: mes }; };
  AP.simHTML = () => {
    const s = AP.sim(), st = AP.simEstado(), ui = E.ui.sim = E.ui.sim || {}, al = (D.grupoActual() ? D.alumnos(D.grupoActual()) : []).length;
    return card('<h3>🚨 Simulacros y revisión del mes</h3><p class="muted small">La NOM-002-STPS-2010 pide simulacros al menos una vez al año (riesgo ordinario) y revisar los extintores cada mes. Tu plantel organiza los suyos; aquí registras los del taller y tu revisión.</p>' +
      '<div class="en-kpis"><div class="' + (st.dias == null || st.dias > 365 ? 'warn' : 'ok') + '"><b>' + (st.ult ? u.fCorta(st.ult.f) : '—') + '</b><span>último simulacro</span></div><div class="' + (st.mesOk ? 'ok' : 'warn') + '"><b>' + REV.filter((x, i) => st.rv[i]).length + '/' + REV.length + '</b><span>revisión de ' + u.MESES[Number(st.mes.slice(5)) - 1] + '</span></div></div>' +
      '<h4>Revisión de ' + u.MESES[Number(st.mes.slice(5)) - 1] + '</h4><ul class="sg-chk">' + REV.map((x, i) => '<li><label><input type="checkbox" data-ch="sim-rev" data-i="' + i + '"' + (st.rv[i] ? ' checked' : '') + '><span>' + esc(x) + '</span></label></li>').join('') + '</ul>' +
      '<h4>Simulacro</h4>' + (ui.ini ? '<p class="note info">⏱ Simulacro en curso desde las ' + new Date(ui.ini).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) + '. Al llegar todos al punto de reunión, toca «Terminar».</p>' + btn('⏹ Terminar', 'sim-fin', '', 'primary') :
        '<div class="fgrid"><label class="fld"><span>Tipo</span><select id="sim-t">' + Object.keys(TIPOS).map(k => '<option value="' + k + '">' + TIPOS[k] + '</option>').join('') + '</select></label><label class="fld"><span>Participantes</span><input id="sim-n" type="number" min="0" value="' + al + '"></label></div>' + btn('⏱ Iniciar simulacro', 'sim-ini', '', 'small') + ' ' + btn('Registrar uno ya hecho', 'sim-man', '', 'small ghost')) +
      (s.reg.length ? '<ul class="small mt">' + s.reg.slice().sort((a, b) => b.f.localeCompare(a.f)).map(x => '<li><b>' + u.fCorta(x.f) + '</b> · ' + esc((TIPOS[x.tipo] || '').replace(/^\S+\s/, '')) + (x.seg ? ' · ' + Math.floor(x.seg / 60) + ' min ' + (x.seg % 60) + ' s' : '') + (x.n ? ' · ' + x.n + ' personas' : '') + (x.obs ? ' · ' + esc(x.obs) : '') + ' ' + btn('✕', 'sim-del', 'data-id="' + x.id + '"', 'small ghost') + '</li>').join('') + '</ul>' : '') +
      '<p class="small"><a href="#/normas/ficha/002-STPS">📘 Lo que dice la NOM-002-STPS-2010</a> · <a href="#/normas/ficha/003-SEGOB">Señales de protección civil</a></p>');
  };
  CH['sim-rev'] = el => { const mes = u.today().slice(0, 7); S.update(KS, d => { d.rev = d.rev || {}; const r = d.rev[mes] = d.rev[mes] || {}; if (el.checked) r[el.dataset.i] = u.today(); else delete r[el.dataset.i]; }, {}); };
  A['sim-ini'] = () => { E.ui.sim = { ini: Date.now(), tipo: (document.getElementById('sim-t') || {}).value || 'evacuacion', n: Number((document.getElementById('sim-n') || {}).value) || 0 }; E.render(); };
  A['sim-fin'] = () => { const s = E.ui.sim || {}; if (!s.ini) return; const seg = Math.round((Date.now() - s.ini) / 1000), obs = prompt('Observaciones (opcional): ¿qué se puede mejorar?') || ''; S.update(KS, d => { d.reg = d.reg || []; d.reg.push({ id: u.uid('sim'), f: u.today(), tipo: s.tipo, seg: seg, n: s.n, obs: obs.trim() }); }, {}); E.ui.sim = {}; u.toast('Simulacro registrado: ' + Math.floor(seg / 60) + ' min ' + (seg % 60) + ' s', 'ok', 5000); };
  A['sim-man'] = () => { const f = prompt('Fecha del simulacro (AAAA-MM-DD)', u.today()); if (!f || !/^\d{4}-\d{2}-\d{2}$/.test(f)) return; const min = Number(prompt('¿Cuántos minutos tardó la evacuación? (opcional)') || 0); S.update(KS, d => { d.reg = d.reg || []; d.reg.push({ id: u.uid('sim'), f: f, tipo: (document.getElementById('sim-t') || {}).value || 'evacuacion', seg: Math.round(min * 60), n: Number((document.getElementById('sim-n') || {}).value) || 0, obs: '' }); }, {}); };
  A['sim-del'] = el => { if (!confirm('¿Borrar este registro?')) return; S.update(KS, d => { d.reg = (d.reg || []).filter(x => x.id !== el.dataset.id); }, {}); };
  if (V.seguridad) { const vs = V.seguridad; V.seguridad = function (sub) { const o = vs.apply(null, arguments); if (o && o.h && !sub && !/Algo falló|Primero importa|No hay grupo/.test(o.h)) { const i = o.h.indexOf('<section', 10); const x = AP.simHTML(); o.h = i > 0 ? o.h.slice(0, i) + x + o.h.slice(i) : o.h + x; } return o; }; }
  // aviso en Inicio: revisión del mes pendiente (después del día 5) o más de un año sin simulacro
  (E.inicioExtras = E.inicioExtras || []).push(() => { const st = AP.simEstado(), d = Number(u.today().slice(8)); const L = []; if (!st.mesOk && d >= 5) L.push('Revisión de seguridad de ' + u.MESES[Number(st.mes.slice(5)) - 1] + ' (extintor, botiquín, ruta)'); if (st.dias == null || st.dias > 365) L.push(st.ult ? 'Más de un año sin simulacro en el taller' : 'Sin simulacros registrados en el taller'); return L.length ? card('<div class="row between gap wrap"><h3>🚨 Seguridad</h3>' + link('Revisar', 'seguridad', 'small') + '</div><p class="small">' + L.map(esc).join(' · ') + '</p>') : ''; });

  /* ================= 12) FICHA DE EMERGENCIA ================= */
  const telDig = s => String(s || '').replace(/\D/g, '');
  AP.emHTML = (g, a) => card('<h3>🚑 Ficha de emergencia</h3><p class="muted small">Solo lo que la familia autorice. Se guarda en tu cuenta y está a la mano sin internet en Más → Emergencias.</p>' +
    '<div class="fgrid"><label class="fld"><span>Contacto de emergencia (nombre y parentesco)</span><input data-ch="alumno-f" data-aid="' + a.id + '" data-f="emNom" value="' + esc(a.emNom || '') + '" placeholder="Ej. María López (mamá)"></label><label class="fld"><span>Teléfono de emergencia</span><input inputmode="tel" data-ch="alumno-f" data-aid="' + a.id + '" data-f="emTel" value="' + esc(a.emTel || '') + '" placeholder="10 dígitos"></label></div>' +
    '<div class="fgrid"><label class="fld"><span>Número de seguro social (seguro facultativo IMSS)</span><input inputmode="numeric" data-ch="alumno-f" data-aid="' + a.id + '" data-f="nss" value="' + esc(a.nss || '') + '" placeholder="11 dígitos"></label><label class="fld"><span>Notas que autoriza la familia</span><input data-ch="alumno-f" data-aid="' + a.id + '" data-f="emNota" value="' + esc(a.emNota || '') + '" placeholder="Ej. alergia que deben saber, a qué clínica llevarlo"></label></div>' +
    (a.emTel || a.tel ? '<div class="row gap wrap">' + (a.emTel ? '<a class="btn small primary" href="tel:' + telDig(a.emTel) + '">📞 Llamar a ' + esc(a.emNom || 'emergencia') + '</a>' : '') + (a.tel ? '<a class="btn small" href="tel:' + telDig(a.tel) + '">📞 Casa</a>' : '') + '</div>' : ''));
  if (V.alumno) { const va = V.alumno; V.alumno = function (id) { const o = va.apply(null, arguments), g = D.grupoActual(), a = g && D.alumno(g, id); if (o && a && !/Algo falló/.test(o.h)) o.h = E.fichaInsert(o.h, AP.emHTML(g, a)); return o; }; }
  V.emergencia = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const al = D.alumnos(g); if (!al.length) return H.needAlumnos('Emergencias');
    const con = al.filter(a => a.emTel || a.tel).length, nss = al.filter(a => a.nss).length;
    let h = card('<h3>🚑 Directorio de emergencia · ' + esc(g.nombre) + '</h3><p class="small">' + con + ' de ' + al.length + ' con teléfono · ' + nss + ' con número de seguro facultativo. Funciona sin internet. Los datos se capturan en la ficha de cada alumno.</p>' + (E.rap ? E.rap.filtroHTML('emergencia') : '') + btn('🖨 Imprimir directorio', 'em-print', '', 'small') +
      '<p class="note info small">En una emergencia: atiende y llama al 911; avisa a la dirección y a la familia. El seguro facultativo cubre a estudiantes inscritos en planteles públicos de nivel medio superior y superior; la atención es en su Unidad de Medicina Familiar o en urgencias del IMSS.</p>');
    h += card('<ul class="em-l">' + al.map(a => '<li' + (E.rap ? E.rap.qAttr(a) : '') + '><div><b>' + a.num + '. ' + esc(a.nombre) + '</b><small class="muted">' + (a.emNom ? esc(a.emNom) + ' · ' : '') + (a.nss ? 'NSS ' + esc(a.nss) : '<span class="badc">sin NSS</span>') + (a.emNota ? ' · ' + esc(a.emNota) : '') + '</small></div><div class="row gap">' + (a.emTel ? '<a class="btn small primary" href="tel:' + telDig(a.emTel) + '">📞</a>' : '') + (a.tel ? '<a class="btn small" href="tel:' + telDig(a.tel) + '">🏠</a>' : '') + (!a.emTel && !a.tel ? link('Capturar', 'alumno/' + a.id, 'small ghost') : '') + '</div></li>').join('') + '</ul>');
    return { t: 'Emergencias', h: h };
  };
  A['em-print'] = () => { const g = D.grupoActual(), al = D.alumnos(g); E.print.run('<div class="pr"><div class="p-title">DIRECTORIO DE EMERGENCIA · ' + esc(g.nombre) + '</div><p class="tiny c">Confidencial: solo para el docente y la dirección · ' + u.fFecha(u.today()) + ' · Emergencias: 911</p><table class="grid"><thead><tr><th>No.</th><th class="l">ALUMNO</th><th class="l">CONTACTO</th><th>TELÉFONO</th><th>CASA</th><th>NSS</th><th class="l">NOTAS</th></tr></thead><tbody>' + al.map(a => '<tr><td class="c">' + a.num + '</td><td class="nm">' + esc(a.nombre) + '</td><td>' + esc(a.emNom || '') + '</td><td class="c">' + esc(a.emTel || '') + '</td><td class="c">' + esc(a.tel || '') + '</td><td class="c">' + esc(a.nss || '') + '</td><td>' + esc(a.emNota || '') + '</td></tr>').join('') + '</tbody></table></div>', { landscape: true, title: 'Directorio de emergencia', margin: '10mm' }); };
})();
