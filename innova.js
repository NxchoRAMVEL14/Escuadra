/* Escuadra · v1.49.0 · Paquete 6 (innovar)
   34) Asistente con Claude: eliges qué necesitas (cómo va el grupo, plan para un alumno, preparar la junta, la clase de
       mañana, un mensaje difícil) y la app arma la petición con tus datos, sin nombres (solo números de lista), para
       pegarla en Claude. Tus datos no salen de la app hasta que tú los pegas.
   35) Lista con QR: proyectas un QR que cambia cada 15 segundos; cada alumno lo escanea al entrar y elige su número. Con
       «Guardar en la lista» quedan presentes, con retardo los que llegaron tarde y con falta los que no se registraron.
       Un celular solo registra un número por día. Usa tu Supabase (la tabla de la Encuesta).
   36) Inventario con QR: etiquetas con QR para cada artículo del taller; al escanearla prestas o recibes en un toque.
   38) Tu enseñanza en números: clases dadas y perdidas, horas por lugar y por momento, asistencia por día y por hora,
       resultados por parcial, temas, reconocimiento contra corrección y contacto con las familias.
   39) Sin internet: aviso cuando no hay señal, cuántos cambios faltan por subir, revisión de que todo está guardado
       en el celular, descarga de las librerías y almacenamiento persistente.
   40) Expediente del semestre: un ZIP con el expediente en HTML (para imprimir o guardar en PDF), CSV de alumnos,
       calificaciones, asistencia y actividades, las fotos de evidencias y el respaldo completo. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h, card = H.card, btn = H.btn, link = H.link;
  const corto = n => (u.corto ? u.corto(n) : n);
  const nube = () => E.sync && E.sync.client && E.sync.user ? E.sync : null;
  const hash = s => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const pag = p => location.href.split('#')[0].split('?')[0].replace(/[^/]*$/, '') + p;

  /* ---------- 34 · asistente con Claude ---------- */
  const AI = E.asistente = {};
  const N = a => 'Alumno ' + a.num;
  AI.contexto = (g, conNombres) => {
    const p = C.parcialActual(), al = D.alumnos(g), m10 = C.min10(), nm = a => conNombres ? a.nombre : N(a);
    const filas = al.map(a => { const k = C.cal(g, p.id, a.id), as = C.asis(g, p, a.id), r = E.aprobar ? E.aprobar.analiza(g, p.id, a.id) : null, pr = E.seguir ? E.seguir.pred(g, a.id) : null;
      return '- ' + nm(a) + ': ' + p.nombre + ' ' + (k.final == null ? 'sin calificación' : C.oficial(k.final)) + ', asistencia ' + (as.ses ? Math.round(as.pct) + ' %' : '—') + (as.racha >= 2 ? ' (faltó sus últimas ' + as.racha + ')' : '') + (r && r.pend.length ? ', debe ' + r.pend.length + ' (' + r.pend.slice(0, 3).map(x => x.t).join('; ') + ')' : '') + (pr && pr.est !== 'sin' ? ', semestre: ' + pr.t : ''); });
    const tg = E.casa && E.casa.temasGrupo ? E.casa.temasGrupo(g).ts.map(t => ((E.TEMAS || []).find(x => x.id === t) || {}).titulo || t) : [];
    return 'Contexto: soy docente de bachillerato tecnológico (Técnico en Mecatrónica, CETAC 19, México), grupo ' + g.nombre + ', ' + al.length + ' alumnos, ' + p.nombre + ' (' + u.fCorta(p.inicio) + ' a ' + u.fCorta(p.fin) + '), mínimo aprobatorio ' + m10 + '.\n' + (tg.length ? 'Temas que más le cuestan al grupo: ' + tg.join(', ') + '.\n' : '') + 'Situación de cada alumno:\n' + filas.join('\n');
  };
  AI.TAREAS = [
    ['semana', '📋 ¿Qué hago esta semana con el grupo?', 'Con estos datos, dime en una lista corta: 1) a quién atender primero y por qué, 2) qué hacer con los que van bien para que no se aburran, 3) una actividad de 15 minutos para reforzar el tema que más cuesta. Sé concreto y práctico.'],
    ['alumno', '🎯 Plan de apoyo para un alumno', 'Haz un plan de apoyo de 2 semanas para el alumno que te indico abajo: metas pequeñas, qué le pido entregar y cuándo, cómo le doy seguimiento y un mensaje breve y respetuoso para su familia. Alumno: '],
    ['junta', '👪 Preparar la junta con papás', 'Prepárame la junta con papás: a quién citar primero, qué decirle a cada familia en 2 o 3 frases (empezando por algo positivo) y qué acuerdo proponer. Tono respetuoso y claro.'],
    ['clase', '🛠️ Ideas para la clase de mañana', 'Dame 3 ideas para una clase de 50 minutos de taller sobre el tema que más le cuesta al grupo: apertura de 5 min, actividad práctica con material barato y un boleto de salida de 3 preguntas.'],
    ['mensaje', '💬 Redactar un mensaje difícil', 'Ayúdame a redactar un mensaje de WhatsApp para una familia sobre esta situación, respetuoso, breve y con un siguiente paso claro: ']
  ];
  V.asistente = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); if (!D.alumnos(g).length) return H.needAlumnos('Asistente');
    const st = E.ui.ai || {}, t = AI.TAREAS.find(x => x[0] === st.t) || AI.TAREAS[0];
    let h = card('<h3>🤖 Asistente con Claude</h3><p class="small">Elige qué necesitas: la app arma la petición con los datos de tu grupo <b>sin nombres</b> (solo números de lista) para que la pegues en Claude. Nada sale de la app hasta que tú la pegas.</p><div class="ai-t">' + AI.TAREAS.map(x => '<button type="button" class="chip' + (x[0] === t[0] ? ' on' : '') + '" data-act="ai-t" data-t="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>' +
      (t[0] === 'alumno' || t[0] === 'mensaje' ? '<label class="fld"><span>' + (t[0] === 'alumno' ? 'Número de lista y lo que sabes de él' : 'La situación') + '</span><input class="inp" id="ai-extra" value="' + esc(st.extra || '') + '" placeholder="' + (t[0] === 'alumno' ? 'Ej. Alumno 12: falta mucho los lunes, trabaja en las tardes' : 'Ej. le vi copiar en el examen') + '"></label>' : '') +
      '<label class="chk small"><input type="checkbox" id="ai-nom"' + (st.nom ? ' checked' : '') + '> Incluir nombres (no recomendado: son datos de menores)</label><div class="row gap wrap mt">' + btn('📋 Copiar y abrir Claude', 'ai-go', '', 'primary') + btn('Ver la petición', 'ai-ver', '', 'small ghost') + '</div>' + (st.ver ? '<pre class="fa-pre ai-pre">' + esc(AI.prompt(g, t, st)) + '</pre>' : ''));
    h += card('<p class="small muted">💡 Consejo para pedirle a Claude: di quién eres, qué quieres que te entregue (una lista, un mensaje, un plan) y en qué formato. Si la respuesta no te sirve, dile qué cambiar («más corto», «para leerlo en voz alta») en lugar de empezar de nuevo.</p>');
    return { t: 'Asistente', h: h };
  };
  AI.prompt = (g, t, st) => AI.contexto(g, !!st.nom) + '\n\nLo que necesito: ' + t[2] + (st.extra || '');
  const lee = () => { const st = E.ui.ai = E.ui.ai || {}; const ex = document.getElementById('ai-extra'), nm = document.getElementById('ai-nom'); if (ex) st.extra = ex.value.trim(); if (nm) st.nom = nm.checked; return st; };
  A['ai-t'] = el => { const st = lee(); st.t = el.dataset.t; st.ver = false; E.render(); };
  A['ai-ver'] = () => { const st = lee(); st.ver = !st.ver; E.render(); };
  A['ai-go'] = async () => { const g = D.grupoActual(), st = lee(), t = AI.TAREAS.find(x => x[0] === st.t) || AI.TAREAS[0]; const ok = await u.copy(AI.prompt(g, t, st)); u.toast(ok ? 'Copiado: pégalo en Claude' : 'No se pudo copiar', ok ? 'ok' : 'err', 3500); window.open('https://claude.ai/new', '_blank'); };

  /* ---------- 35 · lista con QR ---------- */
  const QL = E.qrlista = {}, KQ = (g, f) => 'qrlista:' + g.id + ':' + f, VENT = 15000;
  QL.doc = (g, f) => S.get(KQ(g, f || u.today())) || null;
  QL.tk = (seed, w) => String(hash(seed + '|' + w) % 1000000).padStart(6, '0');
  QL.url = async (g, d) => { const w = Math.floor(Date.now() / VENT); return pag('encuesta.html') + '#' + await E.casa.empaca({ v: 1, k: 'lis', o: nube() ? nube().user.id : '', e: 'lis-' + g.id, g: g.nombre, f: d.f, w: w, tk: QL.tk(d.seed, w), n: D.alumnos(g).map(a => a.num) }); };
  QL.valida = (d, rows) => { // { num: { t, w, dev } } con el primer registro válido de cada número
    const out = {}, devs = {}; (rows || []).forEach(r => { const v = r.resp || {}; if (v.f !== d.f || !v.num) return; const wc = Math.floor(new Date(r.creado).getTime() / VENT); if (!(v.w >= wc - 3 && v.w <= wc + 1) || QL.tk(d.seed, v.w) !== v.tk) return;
      if (!out[v.num]) { out[v.num] = { t: r.creado, dev: v.dev || '' }; (devs[v.dev] = devs[v.dev] || []).push(v.num); } });
    Object.keys(out).forEach(n => { const dv = devs[out[n].dev] || []; if (out[n].dev && dv.length > 1) out[n].dup = dv.filter(x => String(x) !== String(n)); }); return out; };
  V.qrlista = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); if (!D.alumnos(g).length) return H.needAlumnos('Lista con QR');
    const Y = nube(), d = QL.doc(g), reg = (E.ui.qlReg || {})[g.id];
    let h = card('<h3>📲 Lista con QR</h3><p class="small">Proyecta el QR (cambia cada 15 segundos, así no sirve una foto mandada por WhatsApp). Cada quien lo escanea al entrar y elige su número; un celular registra un solo número por día. Al final tocas «Guardar en la lista».</p>' +
      (Y ? '<div class="row gap wrap"><label class="fld"><span>Hora de inicio</span><input type="time" id="ql-ini" value="' + esc((d && d.ini) || new Date().toTimeString().slice(0, 5)) + '"></label><label class="fld"><span>Tolerancia (min)</span><input type="number" id="ql-tol" min="0" max="60" value="' + ((d && d.tol) != null ? d.tol : 10) + '" style="width:5em"></label></div><div class="row gap wrap">' + btn('📽 Mostrar el QR', 'ql-ver', '', 'primary') + (d ? btn('🔄 Leer registros', 'ql-lee', '', 'small') : '') + '</div>' : '<p class="note small">Necesita Supabase: conéctalo en Ajustes → Sincronización y corre una vez el SQL de la Encuesta. Es la misma tabla.</p>'));
    if (reg && d) { const al = D.alumnos(g), ok = al.filter(a => reg[a.num]), no = al.filter(a => !reg[a.num]), tarde = a => { const r = reg[a.num]; return !!r && new Date(r.t).toTimeString().slice(0, 5) > QL.limite(d); };
      h += card('<div class="row between gap wrap"><h3>✓ Se registraron ' + ok.length + ' de ' + al.length + '</h3>' + btn('💾 Guardar en la lista de hoy', 'ql-guarda', '', 'small primary') + '</div><ul class="plain fa-l">' + ok.map(a => { const r = reg[a.num]; return '<li><span>' + a.num + '. ' + esc(corto(a.nombre)) + '</span><span class="small">' + new Date(r.t).toTimeString().slice(0, 5) + (tarde(a) ? ' <b class="rf-cerca">retardo</b>' : '') + (r.dup ? ' <b class="rf-no">mismo celular que ' + r.dup.join(', ') + '</b>' : '') + '</span></li>'; }).join('') + '</ul>' + (no.length ? '<p class="small"><b>No se registraron (falta):</b> ' + no.map(a => a.num + '. ' + esc(corto(a.nombre))).join(', ') + '</p>' : '') + '<p class="small muted">Revisa a quien salga «mismo celular»: puede que uno registró al otro.</p>'); }
    return { t: 'Lista con QR', h: h };
  };
  QL.limite = d => { const p = String(d.ini || '07:00').split(':').map(Number), t = p[0] * 60 + p[1] + (Number(d.tol) || 0); return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0'); };
  let qlTimer = null;
  A['ql-ver'] = async () => { const g = D.grupoActual(), f = u.today(), prev = QL.doc(g, f), ini = (document.getElementById('ql-ini') || {}).value || '07:00', tol = Number((document.getElementById('ql-tol') || {}).value) || 0;
    const d = Object.assign({ f: f, seed: (prev && prev.seed) || u.uid('s') }, prev || {}, { ini: ini, tol: tol }); S.put(KQ(g, f), d); if (E.cam && E.cam.qrListo) await E.cam.qrListo();
    E.modal.open('📲 Escanea y elige tu número', '<div class="c ql-big" id="ql-box"></div><p class="small c">Cambia cada 15 segundos · ' + esc(g.nombre) + ' · ' + u.fLarga(f) + '</p>');
    const pinta = async () => { const box = document.getElementById('ql-box'); if (!box) { clearInterval(qlTimer); qlTimer = null; return; } box.innerHTML = E.cam.qrSVG(await QL.url(g, d), 'pj-qr', 'M'); };
    clearInterval(qlTimer); await pinta(); qlTimer = setInterval(pinta, 5000); };
  A['ql-lee'] = async () => { const g = D.grupoActual(), d = QL.doc(g), Y = nube(); if (!d || !Y) return; const r = await Y.client.from('escuadra_encuesta').select('resp,creado').eq('encuesta', 'lis-' + g.id).gte('creado', d.f + 'T00:00:00').order('creado', { ascending: true }).limit(500); if (r.error) { u.toast(r.error.message, 'err', 4000); return; }
    E.ui.qlReg = E.ui.qlReg || {}; E.ui.qlReg[g.id] = QL.valida(d, r.data); E.render(); };
  A['ql-guarda'] = () => { const g = D.grupoActual(), d = QL.doc(g), reg = (E.ui.qlReg || {})[g.id]; if (!d || !reg) return; const lim = QL.limite(d), al = D.alumnos(g);
    if (!confirm('Se guarda la lista de hoy: presentes los que se registraron' + ' (con retardo después de las ' + lim + ')' + ' y falta a los demás. ¿Continuar?')) return;
    S.update('asis:' + g.id + ':' + d.f, doc => { al.forEach(a => { const r = reg[a.num]; if (!r) doc[a.id] = 'F'; else { const hm = new Date(r.t).toTimeString().slice(0, 5); if (hm > lim) doc[a.id] = 'R'; else delete doc[a.id]; } }); }, {}); u.toast('Lista guardada', 'ok'); };

  /* ---------- 36 · inventario con QR ---------- */
  const IV = E.inventario;
  if (IV && V.inventario) {
    const vi = V.inventario; V.inventario = function () { const o = vi.apply(null, arguments); if (o && o.h && IV.doc().items.length) o.h = card('<div class="row between gap wrap"><div><h3>🏷️ Etiquetas con QR</h3><p class="small muted">Pega una etiqueta en cada caja o herramienta: al escanearla prestas o recibes en un toque.</p></div><div class="row gap wrap">' + btn('📷 Escanear', 'iq-scan', '', 'small primary') + btn('🖨 Etiquetas', 'iq-imp', '', 'small') + '</div></div>') + o.h; return o; };
    A['iq-imp'] = async () => { if (E.cam && E.cam.qrListo) await E.cam.qrListo(); const its = IV.doc().items;
      E.print.run('<div class="pr iq-pr">' + its.map(x => '<div class="iq-et">' + E.cam.qrSVG('ESC-INV:' + x.id, 'iq-qr', 'M') + '<div><b>' + esc(x.n) + '</b><small>' + esc(x.ubic || '') + '</small><small>Taller de Mecatrónica · CETAC 19</small></div></div>').join('') + '</div>', { title: 'Etiquetas del inventario' }); };
    IV.modalItem = id => { const d = IV.doc(), it = d.items.find(x => x.id === id); if (!it) { u.toast('Esa etiqueta no está en tu inventario', 'err'); return; } const g = D.grupoActual(), al = g ? D.alumnos(g) : [], fuera = d.prestamos.filter(x => x.item === id && !x.dev), pr = fuera.reduce((s, x) => s + (Number(x.cant) || 1), 0);
      E.modal.open('🏷️ ' + esc(it.n), '<p class="small">' + (Number(it.cant) || 0) + ' en total · ' + pr + ' prestado' + (pr === 1 ? '' : 's') + (it.ubic ? ' · ' + esc(it.ubic) : '') + '</p>' +
        (fuera.length ? '<h4>Recibir</h4><ul class="plain fa-l">' + fuera.map(x => '<li><span>' + esc(x.quien) + ' <small class="muted">desde ' + u.fCorta(x.f) + (x.cant > 1 ? ' · ' + x.cant : '') + '</small></span>' + btn('✓ Devuelto', 'iq-dev', 'data-id="' + x.id + '" data-it="' + it.id + '"', 'small') + '</li>').join('') + '</ul>' : '') +
        '<h4>Prestar</h4><input type="hidden" id="iv-item" value="' + it.id + '"><div class="row gap wrap"><select id="iv-quien" class="inp"><option value="">¿Quién se lo lleva?</option>' + al.map(a => '<option value="' + a.id + '">' + a.num + '. ' + esc(a.nombre) + '</option>').join('') + '<option value="_otro">Otra persona</option></select><input id="iv-otro" class="inp" placeholder="Nombre (si es otra persona)"><input id="iv-cant" class="inp" type="number" min="1" value="1" style="width:5em">' + btn('Prestar', 'iq-prestar', '', 'small primary') + '</div>'); };
    A['iq-prestar'] = () => { A['iv-prestar'](); E.modal.close(); };
    A['iq-dev'] = el => { A['iv-dev'](el); E.modal.close(); u.toast('Devuelto', 'ok'); };
    A['iq-scan'] = async () => { const leer = await E.cam.lectorQR(); let hecho = false;
      E.cam.abrir({ titulo: 'Escanea la etiqueta', guia: 'qr', cada: 150, proc: 600, frame: async (c, ctx, W, Hh) => { if (hecho) return []; const r = await leer(c, ctx, W, Hh), x = r.find(y => /^ESC-INV:/.test(y.txt)); if (x) { hecho = true; E.cam.bip(true); E.cam.cerrar(true); setTimeout(() => IV.modalItem(x.txt.slice(8)), 50); } return []; } }); };
  }

  /* ---------- 38 · tu enseñanza en números ---------- */
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  E.ensenanza = g => {
    const hoy = u.today(), r = { dadas: 0, perdidas: 0, lugar: {}, mom: { a: 0, d: 0, c: 0 }, dia: {}, hora: {}, par: [], obs: { pos: 0, neg: 0 }, fam: { bien: 0, otros: 0 }, ins: 0 };
    D.parciales().forEach(p => { if (p.inicio > hoy) return; let pl = null; try { pl = E.clases.plan(g, p.id); } catch (e) { }
      if (pl) pl.bloques.forEach(b => { if (b.fecha > hoy) return; if (b.perdida) { r.perdidas++; return; } r.dadas++; const hs = b.parts.reduce((s, x) => s + x.h, 0); r.lugar[b.lugar || 'aula'] = (r.lugar[b.lugar || 'aula'] || 0) + hs; b.parts.forEach(x => { if (x.it && r.mom[x.it.m] != null) r.mom[x.it.m] += x.h; }); });
      C.fechasRegistradas(g, p).forEach(f => { if (f > hoy) return; const al = D.alumnos(g), doc = S.get('asis:' + g.id + ':' + f) || {}, pres = al.filter(a => C.cuenta(C.marca(doc, a.id))).length, d = new Date(f + 'T12:00:00').getDay(), o = r.dia[d] = r.dia[d] || [0, 0]; o[0] += pres; o[1] += al.length;
        const bl = (C.bloquesDia(g, f) || [])[0], hh = bl ? String(bl.inicio).slice(0, 2) + ':00' : '—', q = r.hora[hh] = r.hora[hh] || [0, 0]; q[0] += pres; q[1] += al.length; }); });
    if (E.seguir) r.par = E.seguir.resumen(g).filter(x => x.empezo);
    const OB = {}; (E.OBS || []).forEach(o => { OB[o.id] = o; }); S.keys('obs:' + g.id + ':').forEach(k => { const d = S.get(k) || {}; Object.keys(d).forEach(aid => (d[aid] || []).forEach(id => { const o = OB[id]; if (o) { if (o.pos > 0) r.obs.pos++; else r.obs.neg++; } })); });
    const fd = S.get('familia:' + g.id) || {}; Object.keys(fd.env || {}).forEach(k => { if (k.indexOf('bien:') === 0) r.fam.bien++; else r.fam.otros++; });
    const ins = S.get('insig:' + g.id) || {}; Object.keys(ins).forEach(aid => { r.ins += Object.keys(ins[aid] || {}).length; });
    return r;
  };
  const barra = (t, n, d, extra) => '<div class="en-b"><span>' + t + '</span><i><b style="width:' + (d ? Math.round(n / d * 100) : 0) + '%"></b></i><em>' + (d ? Math.round(n / d * 100) + ' %' : '—') + (extra || '') + '</em></div>';
  V.ensenanza = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); if (!D.alumnos(g).length) return H.needAlumnos('Tu enseñanza');
    const r = E.ensenanza(g), hs = Object.values(r.lugar).reduce((s, x) => s + x, 0), hm = r.mom.a + r.mom.d + r.mom.c, tot = r.dadas + r.perdidas;
    let h = card('<h3>🪞 Tu enseñanza en números · ' + esc(g.nombre) + '</h3><p class="small">Para mirarte con datos, no para juzgarte: qué tanto se dio de lo planeado, dónde y cómo das la clase, cuándo vienen más los alumnos y qué tanto reconoces.</p>' +
      '<div class="fs-kpi"><div class="ok"><b>' + r.dadas + '</b><span>clases dadas</span></div><div class="' + (r.perdidas ? 'warn' : '') + '"><b>' + r.perdidas + '</b><span>perdidas' + (tot ? ' (' + Math.round(r.perdidas / tot * 100) + ' %)' : '') + '</span></div><div><b>' + r.ins + '</b><span>insignias ganadas</span></div></div>');
    h += card('<h3>📍 Dónde y cómo das la clase</h3>' + Object.keys(r.lugar).map(k => barra(({ aula: 'Aula', taller: 'Taller', computo: 'Cómputo', lab: 'Laboratorio' })[k] || k, r.lugar[k], hs, ' · ' + r.lugar[k] + ' h')).join('') + '<h4>Momentos de la clase</h4>' + barra('Apertura', r.mom.a, hm) + barra('Desarrollo', r.mom.d, hm) + barra('Cierre', r.mom.c, hm) + '<p class="small muted">Si el cierre sale muy bajo, quizá se está comiendo el tiempo: un boleto de salida de 3 minutos ayuda.</p>');
    const ds = Object.keys(r.dia).sort();
    if (ds.length) h += card('<h3>🗓️ Asistencia por día y por hora</h3>' + ds.map(d => barra(u.cap(DIAS[d]), r.dia[d][0], r.dia[d][1])).join('') + Object.keys(r.hora).sort().map(k => barra(k, r.hora[k][0], r.hora[k][1])).join(''));
    if (r.par.length) h += card('<h3>📈 Resultados por parcial</h3>' + r.par.map(x => barra(esc(x.p.nombre), x.apr, x.n, ' aprueban · promedio ' + (x.prom == null ? '—' : x.prom.toFixed(1)))).join(''));
    const ob = r.obs.pos + r.obs.neg; h += card('<h3>👍 Reconocimiento y corrección</h3>' + (ob ? '<p class="small">Registraste <b>' + r.obs.pos + '</b> observaciones positivas y <b>' + r.obs.neg + '</b> a corregir (' + (r.obs.neg ? (r.obs.pos / r.obs.neg).toFixed(1) : r.obs.pos) + ' a 1).</p>' + barra('Positivas', r.obs.pos, ob) : '<p class="muted small">Sin observaciones registradas.</p>') + (r.fam.bien + r.fam.otros ? '<p class="small">Avisos a casa: <b>' + r.fam.bien + '</b> buenas noticias y <b>' + r.fam.otros + '</b> de preocupación.</p>' : '') + '<p class="small muted">Reconocer lo que sí hacen, con hechos concretos, mejora la conducta y el clima de la clase más que solo corregir.</p>');
    return { t: 'Tu enseñanza', h: h };
  };

  /* ---------- 39 · sin internet ---------- */
  const banda = () => { let b = document.getElementById('off-band'); if (navigator.onLine) { if (b) b.remove(); return; } if (!b) { b = document.createElement('div'); b.id = 'off-band'; b.setAttribute('role', 'status'); document.body.appendChild(b); } b.textContent = '📴 Sin internet: todo se guarda en este celular' + (nube() && S.dirtyCount && S.dirtyCount() ? ' · ' + S.dirtyCount() + ' cambios por subir' : ''); };
  window.addEventListener('online', banda); window.addEventListener('offline', banda); setTimeout(banda, 1500);
  const LIBS = () => [['Excel (importar y exportar)', E.XLSX_CDN], ['ZIP (paquetes y expediente)', E.formatos ? E.formatos.JSZIP : 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'], ['Lector de QR', 'lib-jsqr.js']];
  V.sininternet = () => {
    const r = E.ui.off || {};
    let h = card('<h3>📴 Usar sin internet</h3><p class="small">Escuadra funciona sin señal: todo se guarda en este celular y se sube a Supabase cuando vuelve el internet. Aquí revisas que todo esté listo antes de ir a un salón sin señal.</p><p class="small">Estado ahora: <b>' + (navigator.onLine ? '🟢 Con internet' : '📴 Sin internet') + '</b>' + (nube() ? ' · ' + (S.dirtyCount ? S.dirtyCount() : 0) + ' cambios por subir' : ' · sin Supabase: todo vive en este celular, haz respaldos') + '.</p><div class="row gap wrap">' + btn('🔍 Revisar y preparar', 'off-prep', '', 'primary') + '</div>');
    if (r.ok) h += card('<h3>Resultado</h3><ul class="plain fa-l">' + r.items.map(x => '<li><span>' + esc(x[0]) + '</span><b class="' + (x[1] ? 'rf-ok' : 'rf-no') + '">' + (x[1] ? '✓' : '✗') + (x[2] ? ' <small>' + esc(x[2]) + '</small>' : '') + '</b></li>').join('') + '</ul>' + (r.items.every(x => x[1]) ? '<p class="note ok small">Todo listo para usar sin internet.</p>' : '<p class="note warn small">Hay algo pendiente: vuelve a revisar con internet.</p>'));
    return { t: 'Sin internet', h: h };
  };
  A['off-prep'] = async () => { const items = [];
    try { const c = await caches.keys(), v = c.find(k => k.indexOf('escuadra-') === 0); const ca = v ? await caches.open(v) : null; let n = 0, tot = 0; for (const p of ['index.html', 'escuadra.min.js', 'styles.css', 'repaso.html', 'consulta.html', 'encuesta.html', 'sim.html', 'elevador.html']) { tot++; if (ca && await ca.match(p, { ignoreSearch: true })) n++; } items.push(['La app guardada en el celular', n === tot, n + ' de ' + tot]); } catch (e) { items.push(['La app guardada en el celular', false, 'sin service worker']); }
    for (const l of LIBS()) { let ok = false; try { const r = await fetch(l[1], { mode: l[1].indexOf('http') === 0 ? 'cors' : 'same-origin' }); ok = r.ok; } catch (e) { } items.push([l[0], ok]); }
    try { const p = navigator.storage && navigator.storage.persist ? await navigator.storage.persist() : false; items.push(['Almacenamiento que no se borra solo', !!p, p ? '' : 'el navegador no lo permitió']); } catch (e) { items.push(['Almacenamiento que no se borra solo', false]); }
    try { const es = navigator.storage && navigator.storage.estimate ? await navigator.storage.estimate() : null; if (es) items.push(['Espacio usado', true, (es.usage / 1048576).toFixed(1) + ' MB de ' + Math.round(es.quota / 1048576) + ' MB']); } catch (e) { }
    if (nube()) items.push(['Sin cambios pendientes de subir', !(S.dirtyCount && S.dirtyCount()), S.dirtyCount ? S.dirtyCount() + ' pendientes' : '']);
    E.ui.off = { ok: true, items: items }; E.render(); };

  /* ---------- 40 · expediente del semestre ---------- */
  const csv = rows => '﻿' + rows.map(r => r.map(x => { const s = x == null ? '' : String(x); return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(',')).join('\r\n');
  E.expediente = g => {
    const ps = D.parciales(), al = D.alumnos(g), cf = D.cfg(), hoy = u.today(), files = {};
    files['alumnos.csv'] = csv([['Número', 'Nombre', 'Teléfono de casa']].concat(al.map(a => [a.num, a.nombre, a.tel || ''])));
    files['calificaciones.csv'] = csv([['Número', 'Nombre'].concat(ps.map(p => p.nombre), ['Final', 'Situación'])].concat(al.map(a => { const fs = C.finalSem(g, a.id); return [a.num, a.nombre].concat(ps.map(p => { const k = C.cal(g, p.id, a.id); return k.final == null ? '' : C.oficial(k.final); }), [fs.final == null ? '' : fs.final, fs.completo ? (fs.aprobado ? 'Aprobado' : 'Extraordinario') : 'En curso']); })));
    const fechas = []; ps.forEach(p => C.fechasRegistradas(g, p).forEach(f => { if (f <= hoy && fechas.indexOf(f) < 0) fechas.push(f); })); fechas.sort();
    files['asistencia.csv'] = csv([['Número', 'Nombre'].concat(fechas)].concat(al.map(a => [a.num, a.nombre].concat(fechas.map(f => C.marca(S.get('asis:' + g.id + ':' + f) || {}, a.id))))));
    const acts = []; ps.forEach(p => C.acts(g, p.id).forEach(x => acts.push([p, x])));
    files['actividades.csv'] = csv([['Parcial', 'Actividad', 'Categoría', 'Fecha'].concat(al.map(a => a.num + '. ' + a.nombre))].concat(acts.map(([p, x]) => [p.nombre, x.nombre, x.categoria, x.fecha || ''].concat(al.map(a => { const v = C.nota(x, a.id); return v == null ? '' : C.c10(v); })))));
    const R = E.seguir ? E.seguir.resumen(g) : [], J = E.resultados && E.resultados.juntas ? E.resultados.juntas(g) : [], cob = E.cobertura ? E.cobertura(g) : [];
    const tabla = (hd, rows) => '<table><tr>' + hd.map(x => '<th>' + esc(x) + '</th>').join('') + '</tr>' + rows.map(r => '<tr>' + r.map(x => '<td>' + esc(x == null ? '' : x) + '</td>').join('') + '</tr>').join('') + '</table>';
    files['expediente.html'] = '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Expediente ' + esc(g.nombre) + '</title><style>body{font:11pt Arial,sans-serif;color:#152626;max-width:900px;margin:20px auto;padding:0 16px}h1{color:#0e5e5a}h2{border-bottom:2px solid #0e5e5a;padding-bottom:3px;margin-top:26px}table{border-collapse:collapse;width:100%;font-size:9.5pt;margin:6px 0}th,td{border:1px solid #c9d3d1;padding:3px 5px;text-align:left}th{background:#eef5f4}.s{color:#5b6b69}@media print{h2{page-break-before:always}h2:first-of-type{page-break-before:auto}}</style></head><body>' +
      '<h1>Expediente del semestre</h1><p><b>' + esc(cf.plantel || 'CETAC 19') + '</b> · Grupo ' + esc(g.nombre) + (g.modulo ? ' · Módulo ' + esc(g.modulo) : '') + ' · Docente: ' + esc(cf.docente || '') + '</p><p class="s">Generado el ' + u.fLarga(hoy) + ' con Escuadra v' + E.VERSION + '. Contiene: alumnos, calificaciones por parcial y final, asistencia, actividades, cobertura del programa, juntas y acuerdos. Los CSV de esta carpeta se abren en Excel.</p>' +
      '<h2>1. Resultados por parcial</h2>' + tabla(['Parcial', 'Promedio', 'Aprueban', 'Asistencia'], R.filter(r => r.empezo).map(r => [r.p.nombre, r.prom == null ? '—' : r.prom.toFixed(1), r.n ? r.apr + ' de ' + r.n : '—', r.asis == null ? '—' : Math.round(r.asis) + ' %'])) +
      '<h2>2. Calificaciones</h2>' + tabla(['#', 'Alumno'].concat(ps.map(p => p.nombre), ['Final']), al.map(a => { const fs = C.finalSem(g, a.id); return [a.num, a.nombre].concat(ps.map(p => { const k = C.cal(g, p.id, a.id); return k.final == null ? '' : C.oficial(k.final); }), [fs.final == null ? '' : fs.final]); })) +
      '<h2>3. Asistencia</h2>' + tabla(['#', 'Alumno'].concat(ps.map(p => p.nombre)), al.map(a => [a.num, a.nombre].concat(ps.map(p => { const x = C.asis(g, p, a.id); return x.ses ? Math.round(x.pct) + ' % (' + x.f + ' faltas)' : ''; })))) +
      '<h2>4. Actividades evaluadas</h2>' + tabla(['Parcial', 'Actividad', 'Categoría', 'Fecha'], acts.map(([p, x]) => [p.nombre, x.nombre, x.categoria, x.fecha ? u.fCorta(x.fecha) : ''])) +
      (cob.length ? '<h2>5. Cobertura del programa</h2>' + tabla(['Submódulo', 'Horas dadas', 'Horas en el plan'], cob.map(o => [o.k, o.dadas, o.plan])) : '') +
      (J.length ? '<h2>6. Juntas y acuerdos con familias</h2>' + tabla(['Fecha', 'Tipo', 'Acuerdos'], J.map(j => [u.fCorta(j.fecha), j.general ? 'General' : 'Citados: ' + Object.keys(j.citados || {}).length, (j.acuerdos || []).map(x => { const a = x.aid && D.alumno(g, x.aid); return (a ? a.num + '. ' : '') + x.t; }).join(' · ')])) : '') + '</body></html>';
    return files;
  };
  A['xp-zip'] = async () => { const g = D.grupoActual(); if (!g) return; u.toast('Armando el expediente…', '', 2500);
    try { if (!window.JSZip) await u.loadScript(E.formatos ? E.formatos.JSZIP : 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'); } catch (e) { u.toast('No pude cargar la librería ZIP: necesitas internet la primera vez', 'err', 4000); return; }
    const z = new window.JSZip(), F = E.expediente(g), dir = 'Expediente ' + g.nombre.replace(/[\\/:*?"<>|]/g, '') + '/'; Object.keys(F).forEach(n => z.file(dir + n, F[n]));
    let nf = 0; const its = (((S.get('evid:' + g.id) || {}).items) || []).filter(x => x && x.id && !x.borrada);
    for (const it of its) { try { const url = await E.evid.url(it, false); if (!url) continue; const b = await (await fetch(url)).blob(); z.file(dir + 'evidencias/' + it.f + '_' + (++nf) + '.jpg', b); } catch (e) { } }
    z.file(dir + 'respaldo-completo.json', JSON.stringify({ app: 'escuadra', version: E.VERSION, fecha: u.now(), docs: S.docs }));
    const blob = await z.generateAsync({ type: 'blob' }), a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'expediente-' + g.nombre.replace(/\W+/g, '-') + '-' + u.today() + '.zip'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000); u.toast('Expediente descargado' + (nf ? ' con ' + nf + ' fotos' : ''), 'ok', 3500); };
  A['xp-ver'] = () => { const g = D.grupoActual(); if (!g) return; const w = window.open('', '_blank'); if (w) { w.document.write(E.expediente(g)['expediente.html']); w.document.close(); } };
  const zipCard = () => card('<h3>🗂️ Expediente del semestre en ZIP</h3><p class="small">Todo el semestre en un ZIP para la dirección, una auditoría o tu archivo: el expediente en HTML (ábrelo e imprímelo o guárdalo en PDF), los CSV de alumnos, calificaciones, asistencia y actividades para Excel, las fotos de evidencias y el respaldo completo de Escuadra.</p><div class="row gap wrap">' + btn('⬇️ Descargar ZIP', 'xp-zip', '', 'primary') + btn('👀 Ver el expediente', 'xp-ver', '', 'small') + '</div><p class="small muted">Contiene datos personales de menores: guárdalo en un lugar seguro y compártelo solo con quien corresponde.</p>');
  if (V.expediente) { const ve = V.expediente; V.expediente = function () { const o = ve.apply(null, arguments), g = D.grupoActual(); if (o && o.h && g && D.alumnos(g).length) o.h = zipCard() + o.h; return o; }; }
  if (V.finsem) { const vf = V.finsem; V.finsem = function () { const o = vf.apply(null, arguments); if (o && o.h) o.h += card('<div class="row between gap wrap"><div><h3>🗂️ Expediente del semestre</h3><p class="small muted">Todo el semestre en un ZIP como evidencia.</p></div>' + btn('⬇️ Descargar ZIP', 'xp-zip', '', 'small primary') + '</div>'); return o; }; }
})();
