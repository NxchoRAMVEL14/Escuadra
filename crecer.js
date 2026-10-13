/* Escuadra · v1.27
   4) Repaso espaciado para los alumnos: cada semana un QR con preguntas de lo que vieron hace ~1 semana, ~1 mes y al
      inicio del semestre (repasar espaciado y en forma de pregunta ayuda a recordar a largo plazo: Roediger y Karpicke
      2006; Cepeda y col. 2006). Usa repaso.html; registras cuántos acertaron y eso alimenta «temas que cuestan».
   6) Evidencias de tu práctica docente: planeaciones, resultados, lo que escuchaste del grupo y lo que hiciste,
      apoyos dados, seguridad, tu formación y tu reflexión de cada parcial, en un documento.
   7) Pídeselo a Claude: mensajes listos (sin nombres de alumnos) para preparar una clase, hacer preguntas en el formato
      de «Mi banco», atender un caso, planear un submódulo o escribir a una familia. Copias, abres Claude y pegas. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const corto = (t, n) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
  const tTit = id => { const t = (E.TEMAS || []).find(x => x.id === id); return t ? t.titulo : id; };
  const hash = s => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const lunes = f => { const d = u.parse(f); return u.addDays(f, -((d.getDay() + 6) % 7)); };
  const base = pag => { const l = location.href.split('#')[0].split('?')[0]; return l.replace(/[^/]*$/, '') + pag; };

  /* ================= 4) REPASO ESPACIADO ================= */
  const RE = E.espaciado = {};
  const conB = t => (E.BANCO || []).some(b => b.tema === t && b.tipo !== 'ab');
  RE.cubetas = (g, f) => {
    let vis = {}; try { vis = E.repaso ? E.repaso.vistos(g, f) : {}; } catch (e) { vis = {}; }
    const ts = Object.keys(vis).filter(conB), edad = t => u.diffDays(vis[t].fin, f), usados = new Set();
    const toma = (fn, n) => { const L = ts.filter(t => !usados.has(t) && fn(t)).sort((a, b) => edad(a) - edad(b)).slice(0, n); L.forEach(t => usados.add(t)); return L; };
    const semana = toma(t => edad(t) >= 4 && edad(t) <= 13, 2), mes = toma(t => edad(t) >= 21 && edad(t) <= 45, 2);
    const ini = ts.filter(t => !usados.has(t) && edad(t) > 45).sort((a, b) => vis[a].ini.localeCompare(vis[b].ini)).slice(0, 2); ini.forEach(t => usados.add(t));
    // si falta, completa con lo más viejo que haya
    const resto = ts.filter(t => !usados.has(t) && edad(t) >= 4).sort((a, b) => edad(b) - edad(a)).slice(0, Math.max(0, 5 - semana.length - mes.length - ini.length));
    return { semana: semana, mes: mes, inicio: ini, resto: resto, vis: vis };
  };
  RE.datos = (g, f) => {
    const cb = RE.cubetas(g, f), L = [].concat(cb.semana.map(t => [t, 'hace 1 semana']), cb.mes.map(t => [t, 'hace 1 mes']), cb.inicio.map(t => [t, 'al inicio']), cb.resto.map(t => [t, 'de antes'])); if (!L.length || !E.ejer) return null;
    const rnd = rng(hash(g.id + '|esp|' + lunes(f))), qs = [];
    L.forEach(x => { const c = (E.BANCO || []).filter(b => b.tema === x[0] && b.tipo !== 'ab').map(b => ({ b: b, r: rnd() })).sort((a, b) => a.r - b.r).slice(0, L.length <= 3 ? 2 : 1); c.forEach(y => { const q = E.ejer.pregunta(y.b, rnd); if (q && q.opts) qs.push([corto(q.q, 320), q.opts.map(o => corto(o, 120)), q.ok, corto(q.a || '', 220), tTit(x[0]), x[1], x[0]]); }); });
    if (!qs.length) return null;
    return { v: 1, k: 'rep', t: 'Repaso de la semana', g: g.nombre, n: null, f: u.today(), fu: 'repaso espaciado: lo que vieron hace 1 semana, hace 1 mes y al inicio del semestre', q: qs.slice(0, 8).map(q => q.slice(0, 5)), meta: qs.slice(0, 8).map(q => [q[6], q[5]]) };
  };
  const KR = (g, f) => 'rep:' + g.id + ':' + f;
  V.espaciado = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const hoy = u.today(), d = RE.datos(g, hoy), L = lunes(hoy);
    let h = card('<h3>🔁 Repaso espaciado de la semana</h3><p class="small">Preguntas de lo que vieron <b>hace 1 semana</b>, <b>hace 1 mes</b> y <b>al inicio del semestre</b>. Contestar de memoria, con días de por medio, es de lo que más ayuda a que no se les olvide. Cambia cada lunes; los alumnos lo contestan en su celular con el QR (sus respuestas no se mandan a ningún lado).</p>' +
      (d ? '<div class="row gap wrap">' + btn('📱 QR para los alumnos', 'esp-qr', '', 'primary small') + btn('🖨 Hoja impresa', 'esp-print', '', 'small') + '</div>' : '<p class="note info">Todavía no hay temas vistos con al menos 4 días de antigüedad que tengan preguntas en el banco.</p>'));
    if (d) {
      const reg = ((S.get(KR(g, hoy)) || {}).esp) || null, pres = (() => { const a = S.get('asis:' + g.id + ':' + hoy); return a ? D.alumnos(g).filter(x => ['A', 'R'].indexOf(a[x.id] || 'A') >= 0).length : D.alumnos(g).length; })();
      h += card('<h3>Preguntas de esta semana</h3><ol class="small">' + d.q.map((q, i) => '<li><b>' + esc(q[4]) + '</b> <span class="chip info">' + esc(d.meta[i][1]) + '</span><br>' + esc(q[0]) + '</li>').join('') + '</ol>');
      h += card('<h3>¿Cuántos acertaron?</h3><p class="muted small">Opcional: a mano alzada, cuántos de los ' + pres + ' presentes tuvieron bien cada una. Se suma a «temas que cuestan» y al examen recomendado.</p><div class="esp-reg">' + d.q.map((q, i) => '<label class="fld"><span>' + (i + 1) + '. ' + esc(corto(q[4], 40)) + '</span><input class="inp" type="number" min="0" max="' + pres + '" inputmode="numeric" id="esp-' + i + '" value="' + (reg && reg.items[i] && reg.items[i].ok != null ? reg.items[i].ok : '') + '"></label>').join('') + '</div>' + btn('Guardar', 'esp-save', 'data-n="' + pres + '"', 'small primary') + (reg ? ' <span class="chip ok">✓ registrado</span>' : ''));
    }
    return { t: 'Repaso espaciado', h: h };
  };
  A['esp-qr'] = async () => { const g = D.grupoActual(), d = RE.datos(g, u.today()); if (!d) return; const url = base('repaso.html') + '#' + await E.casa.empaca(Object.assign({}, d, { meta: undefined })); if (E.cam && E.cam.qrListo) await E.cam.qrListo(); E.ui.apUrl = url; E.modal.open('🔁 Repaso de la semana', '<div class="ca-qr">' + E.cam.qrSVG(url, 'ca-qrsvg', 'L') + '<p class="small muted">Que lo escaneen al inicio de la clase o lo contesten en casa. ' + d.q.length + ' preguntas.</p></div><div class="row gap wrap">' + btn('📽 Proyectar QR', 'ap-proj', 'data-t="Repaso de la semana"', 'primary') + btn('📋 Copiar enlace', 'ap-copiar', '', '') + '</div>'); };
  A['esp-print'] = () => { const g = D.grupoActual(), d = RE.datos(g, u.today()); if (!d) return; E.print.run('<div class="pr"><div class="p-title">REPASO DE LA SEMANA · ' + esc(g.nombre) + '</div><p class="tiny c">Del ' + u.fFecha(lunes(u.today())) + ' · Contesta de memoria, sin libreta.</p><ol>' + d.q.map(q => '<li class="n3-q"><b>' + esc(q[4]) + ':</b> ' + esc(q[0]) + '<br>' + q[1].map(o => '( ) ' + esc(o)).join('&nbsp;&nbsp; ') + '</li>').join('') + '</ol><p class="tiny">Nombre: ______________________________ No. ____</p></div>', { title: 'Repaso de la semana', margin: '12mm' }); };
  A['esp-save'] = el => { const g = D.grupoActual(), d = RE.datos(g, u.today()), n = Number(el.dataset.n) || 1; if (!d) return; const items = d.q.map((q, i) => { const v = (document.getElementById('esp-' + i) || {}).value; return { tema: d.meta[i][0], ok: v === '' ? null : Math.max(0, Math.min(n, Number(v))), n: n }; }); S.update(KR(g, u.today()), x => { x.esp = { n: n, items: items }; }, {}); u.toast('Registrado', 'ok'); };
  (E.inicioExtras = E.inicioExtras || []).push((g, hoy) => { if (!g || u.dow(hoy) !== 1 || !C.esClase(g, hoy)) return ''; let d = null; try { d = RE.datos(g, hoy); } catch (e) { d = null; } return d ? card('<div class="row between gap wrap"><p class="small">🔁 Ya está el <b>repaso espaciado</b> de esta semana (' + d.q.length + ' preguntas).</p>' + link('Abrir', 'espaciado', 'small') + '</div>') : ''; });

  /* ================= 6) EVIDENCIAS DE TU PRÁCTICA DOCENTE ================= */
  const KX = () => 'reflex:' + (D.parciales()[0] || { inicio: u.today() }).inicio.slice(0, 7);
  RE.practica = () => {
    const gs = D.gruposActivos(), ps = D.parciales(), out = { grupos: [] };
    gs.forEach(g => {
      const r = { g: g, planes: D.planes(g.id).length, par: [], enc: [], apoyos: 0, seg: {} };
      ps.forEach(p => { if (p.inicio > u.today()) return; const x = E.resultados ? E.resultados.ind(g, p) : null; if (x) r.par.push({ p: p, apr: x.pctApr, prom: x.prom, asis: x.pa }); });
      try { r.enc = (S.list('enc:' + g.id + ':') || []).filter(x => x && x.id).map(x => ({ f: x.f, t: x.titulo, yh: (x.yoHice || []).filter(y => y.h) })); } catch (e) { r.enc = []; }
      r.apoyos = (((S.get('apoyos:' + g.id) || {}).items) || []).length;
      const sg = S.get('seg:' + g.id) || {}; r.seg = { firmas: Object.keys(sg.firmas || {}).length, n: D.alumnos(g).length, inc: (S.get('segInc:' + g.id) || []).length };
      r.juntas = (S.get('junta:' + g.id) || []).length;
      out.grupos.push(r);
    });
    out.sim = ((S.get('segSim') || {}).reg || []).length;
    out.normas = E.normas ? Math.round(E.normas.dominio() * 100) : null;
    out.vinc = (S.get('vinc') || {}).asign ? S.get('vinc').asign.length : 0;
    out.reflex = S.get(KX()) || {};
    return out;
  };
  V.mipractica = () => {
    const r = RE.practica(), ps = D.parciales(), f = v => v == null ? '—' : Math.round(v);
    let h = card('<h3>🧑‍🏫 Evidencias de tu práctica docente</h3><p class="small">Lo que ya registra Escuadra, ordenado para cuando te pidan evidencias de tu trabajo (evaluación, promoción, academia o dirección). Agrega tu reflexión de cada parcial: es lo que más pesa en estos procesos y nadie más la puede escribir.</p>' + btn('🖨 Imprimir evidencias', 'mp-print', '', 'primary small'));
    r.grupos.forEach(x => {
      h += card('<h3>' + esc(x.g.nombre) + '</h3><ul class="small"><li><b>Planeaciones:</b> ' + x.planes + '</li>' +
        (x.par.length ? '<li><b>Resultados:</b> ' + x.par.map(y => esc(y.p.nombre) + ': ' + f(y.apr) + '% aprobando, promedio ' + f(y.prom) + ', asistencia ' + f(y.asis) + '%').join(' · ') + '</li>' : '') +
        '<li><b>Escuché al grupo:</b> ' + x.enc.length + ' encuestas' + (x.enc.some(e => e.yh.length) ? ' · «Yo hice»: ' + x.enc.reduce((s, e) => s.concat(e.yh.map(y => y.h)), []).slice(0, 4).map(t => esc(corto(t, 60))).join('; ') : '') + '</li>' +
        '<li><b>Apoyos registrados:</b> ' + x.apoyos + ' · <b>juntas con familias:</b> ' + x.juntas + '</li><li><b>Seguridad:</b> reglamento firmado ' + x.seg.firmas + '/' + x.seg.n + ', ' + x.seg.inc + ' incidentes registrados</li></ul>');
    });
    h += card('<h3>Tu formación y el taller</h3><ul class="small"><li>Simulacros registrados: ' + r.sim + '</li>' + (r.normas != null ? '<li>Normas oficiales: ' + r.normas + '% de las preguntas de repaso dominadas</li>' : '') + (r.vinc ? '<li>Vinculación: ' + r.vinc + ' alumnos en prácticas o visitas</li>' : '') + '</ul>');
    h += card('<h3>✍️ Tu reflexión</h3><p class="muted small">Por parcial: qué funcionó, qué cambiarías y qué hiciste con lo que te dijeron los alumnos. Tres o cuatro renglones bastan.</p>' + ps.map(p => '<label class="fld"><span>' + esc(p.nombre) + '</span><textarea class="inp" rows="3" data-ch="mp-ref" data-pid="' + p.id + '">' + esc(r.reflex[p.id] || '') + '</textarea></label>').join(''));
    return { t: 'Mi práctica docente', h: h };
  };
  CH['mp-ref'] = el => S.update(KX(), d => { d[el.dataset.pid] = el.value; }, {});
  A['mp-print'] = () => {
    const r = RE.practica(), cf = D.cfg(), f = v => v == null ? '—' : Math.round(v);
    E.print.run('<div class="pr"><div class="p-title">EVIDENCIAS DE MI PRÁCTICA DOCENTE</div><p class="tiny c">' + esc(cf.docente || '') + ' · ' + esc(cf.plantel || '') + ' · ' + u.fFecha(u.today()) + '</p>' +
      r.grupos.map(x => '<h4>' + esc(x.g.nombre) + '</h4><table class="grid"><thead><tr><th class="l">PARCIAL</th><th>APROBANDO</th><th>PROMEDIO</th><th>ASISTENCIA</th></tr></thead><tbody>' + x.par.map(y => '<tr><td>' + esc(y.p.nombre) + '</td><td class="c">' + f(y.apr) + '%</td><td class="c">' + f(y.prom) + '</td><td class="c">' + f(y.asis) + '%</td></tr>').join('') + '</tbody></table><p class="tiny">Planeaciones: ' + x.planes + ' · Encuestas al grupo: ' + x.enc.length + ' · Apoyos registrados: ' + x.apoyos + ' · Juntas con familias: ' + x.juntas + ' · Reglamento firmado: ' + x.seg.firmas + '/' + x.seg.n + '</p>' + (x.enc.some(e => e.yh.length) ? '<p class="tiny"><b>Ustedes dijeron → Yo hice:</b> ' + x.enc.reduce((s, e) => s.concat(e.yh.map(y => (y.d ? y.d + ' → ' : '') + y.h)), []).map(esc).join(' · ') + '</p>' : '')).join('') +
      '<h4>Reflexión docente</h4>' + D.parciales().map(p => '<p><b>' + esc(p.nombre) + ':</b> ' + esc(r.reflex[p.id] || '—') + '</p>').join('') + '<p class="tiny">Simulacros: ' + r.sim + (r.normas != null ? ' · Normas oficiales dominadas: ' + r.normas + '%' : '') + '</p></div>', { title: 'Evidencias de mi práctica', margin: '12mm' });
  };

  /* ================= 7) PÍDESELO A CLAUDE ================= */
  const CL = E.claude = {};
  const pie = '\n\nResponde en español de México, claro y concreto. Si te falta un dato importante, pregúntame antes de empezar.';
  const ctxDocente = () => { const c = D.cfg(), g = D.grupoActual(); return 'Soy docente de la carrera Técnico en Mecatrónica (bachillerato tecnológico, programa SEP 2024)' + (g ? ', grupo de ' + (g.semestre ? g.semestre + '° semestre' : 'bachillerato') + ', Módulo ' + (g.modulo || '') + ', ' + D.alumnos(g).length + ' alumnos' : '') + '.'; };
  const semaf = g => { const p = C.parcialActual(), c = { mal: 0, reg: 0, bien: 0 }; D.alumnos(g).forEach(a => { const v = C.cal(g, p.id, a.id).final; const n = E.semaforo ? E.semaforo.nivel(v) : null; if (n) c[n]++; }); return c.mal + ' van mal, ' + c.reg + ' regular, ' + c.bien + ' van bien'; };
  CL.T = {
    clase: { t: '🗓 Preparar o adaptar la clase', d: 'Con el guion del día y cómo va el grupo', f: (g, x) => { const f = x || C.fechaListaDefault(g, u.today()); let d = null; try { d = E.clases.dia(g, f); } catch (e) { d = null; } const its = []; (d ? d.bloques : []).forEach(b => { if (b.perdida) return; b.parts.forEach(pt => its.push('- ' + pt.it.t + ' (' + pt.h + ' h, ' + (b.lugar || 'aula') + '). Objetivo: ' + (pt.it.obj || '—') + (pt.it.pasos ? '. Pasos: ' + pt.it.pasos.map(s => s[0] + ' min ' + s[1]).join('; ') : '') + (pt.it.ev ? '. Evidencia: ' + pt.it.ev : ''))); });
      return ctxDocente() + '\n\nMi clase del ' + u.fLarga(f) + ':\n' + (its.join('\n') || '- (sin guion ese día)') + '\n\nCómo va el grupo: ' + semaf(g) + '.\n\nAyúdame a:\n1. Mejorar el inicio para engancharlos en 5 minutos.\n2. Una variante de la actividad para los que van mal (con apoyo) y un reto para los que van bien.\n3. Una pregunta de cierre para saber si lo entendieron.\nTengo el tiempo exacto del guion; no lo alargues.' + pie; } },
    banco: { t: '❓ Preguntas para Mi banco', d: 'En el formato que se pega directo en la app', f: g => { const p = C.parcialActual(); let ts = {}; try { ts = E.examen.temasVistos(g, p.id, u.addDays(u.today(), 1)); } catch (e) { ts = {}; } const L = Object.keys(ts).map(tTit).slice(0, 8);
      return ctxDocente() + '\n\nHazme 10 preguntas de opción múltiple sobre estos temas que ya vimos: ' + (L.join(', ') || '[escribe los temas]') + '.\nMezcla niveles: 3 de recordar, 4 de comprender y 3 de aplicar (con un pequeño cálculo o caso del taller).\n\nUsa EXACTAMENTE este formato, con una línea en blanco entre preguntas (la primera opción, A, es la correcta):\nTEMA: nombre del tema\nP: texto de la pregunta\nA) opción correcta\nB) distractor\nC) distractor\nD) distractor\nEXP: por qué la correcta es correcta, en una línea\nNIVEL: 1, 2 o 3\n\nLos distractores deben ser errores típicos de alumnos, no opciones absurdas.' + pie; } },
    caso: { t: '🧑‍🎓 Atender el caso de un alumno', d: 'Sin su nombre: solo sus números', f: (g, aid) => { const a = aid && D.alumno(g, aid), p = C.parcialActual(); if (!a) return ctxDocente() + '\n\n[Elige un alumno desde su ficha → Pídeselo a Claude]'; const k = C.cal(g, p.id, a.id), as = C.asis(g, p, a.id); let r = null; try { r = E.aprobar.analiza(g, p.id, a.id); } catch (e) { r = null; } const w = D.cfg().pond;
      return ctxDocente() + '\n\nUn alumno (le llamo «el alumno»; no doy su nombre) del ' + p.nombre + ':\n- Calificación actual: ' + (k.final == null ? 'sin calificación' : k.final) + ' (mínimo aprobatorio ' + D.cfg().minAprob + ').\n- Por rubro: examen ' + Math.round(k.comp.examen || 0) + ' (vale ' + w.examen + '%), libreta/proyecto ' + Math.round(k.comp.trabajos || 0) + ' (' + w.trabajos + '%), asistencia ' + Math.round(as.pct || 0) + '% (' + as.f + ' faltas, racha actual ' + as.racha + ').\n' + (r && r.pend && r.pend.length ? '- Le falta: ' + r.pend.slice(0, 6).map(x => x.t).join('; ') + '.\n' : '') + '\nAyúdame con:\n1. Qué puede estar pasando (hipótesis, sin diagnosticar).\n2. Un plan de 2 semanas con acciones concretas mías y suyas.\n3. Un mensaje breve y respetuoso para su familia por WhatsApp.' + pie; } },
    planeacion: { t: '📄 Planear un submódulo', d: 'Secuencia didáctica con el programa SEP', f: g => { const p = C.parcialActual(), sm = D.submodulo(g, p.id); return ctxDocente() + '\n\nVoy a planear ' + (sm ? 'el Submódulo ' + sm.num + ' «' + sm.nombre + '» del Módulo ' + sm.modulo + ' «' + sm.moduloNombre + '» (' + sm.horas + ' h)' : 'el submódulo [nombre]') + ' para el ' + p.nombre + ' (' + u.fCorta(p.inicio) + ' a ' + u.fCorta(p.fin) + ').\n' + (sm && sm.ac ? 'Actividades clave del programa: ' + sm.ac.map((x, i) => (i + 1) + ') ' + (x.titulo || x.t || x.nombre || '')).join(' ').slice(0, 900) + '\n' : '') + '\nPropón una secuencia apertura–desarrollo–cierre con horas, evidencias por actividad clave, instrumentos de evaluación y un proyecto integrador sencillo con material barato. Respeta las actividades clave tal como las pide el programa.' + pie; } },
    familia: { t: '💬 Mensaje difícil a una familia', d: 'Firme, respetuoso y con un acuerdo', f: () => ctxDocente() + '\n\nNecesito escribirle a la madre/padre de un alumno sobre: [describe la situación sin nombres].\nQuiero que el mensaje sea breve (para WhatsApp), respetuoso, con un dato concreto, una propuesta de acuerdo con fecha y una invitación a hablar. Dame 2 versiones: una más cálida y una más formal.' + pie },
    grupo: { t: '📊 Leer cómo va el grupo', d: 'Qué hacer esta semana', f: g => { const p = C.parcialActual(), x = E.resultados ? E.resultados.ind(g, p) : null; return ctxDocente() + '\n\nAsí va el grupo en el ' + p.nombre + ': ' + semaf(g) + (x ? '; ' + Math.round(x.pctApr || 0) + '% aprobando, promedio ' + Math.round(x.prom || 0) + ', asistencia ' + Math.round(x.pa || 0) + '%, ' + x.aband.length + ' en riesgo de abandono' : '') + '.\n\nDame 3 acciones concretas para esta semana (una para los que van mal, una para todo el grupo y una para mí), con cómo sabré si funcionó.' + pie; } }
  };
  CL.abrir = (k, x) => { const g = D.grupoActual(), T = CL.T[k]; if (!T || !g) return; const txt = T.f(g, x); E.ui.clTxt = txt; E.modal.open(T.t, '<p class="muted small">Revísalo, ajústalo si quieres, cópialo y pégalo en Claude. No lleva nombres de alumnos.</p><textarea class="inp" id="cl-txt" rows="14">' + esc(txt) + '</textarea><div class="row gap wrap mt">' + btn('📋 Copiar', 'cl-copy', '', 'primary') + '<a class="btn" href="https://claude.ai/new" target="_blank" rel="noopener">Abrir Claude</a></div>' + (k === 'banco' ? '<p class="small mt">Cuando te conteste, cópialo y pégalo en <a href="#/banco">Mi banco → Pegar varias</a>.</p>' : '')); };
  A['cl-abrir'] = el => CL.abrir(el.dataset.k, el.dataset.x);
  A['cl-copy'] = async () => { const t = (document.getElementById('cl-txt') || {}).value || E.ui.clTxt || ''; const ok = await u.copy(t); u.toast(ok ? 'Copiado: pégalo en Claude' : 'No se pudo copiar', ok ? 'ok' : 'err'); };
  V.claude = () => ({ t: 'Pídeselo a Claude', h: card('<h3>✨ Pídeselo a Claude</h3><p class="small">Mensajes listos con el contexto de tu grupo, <b>sin nombres de alumnos</b>. Mientras más concreto el contexto, mejor la respuesta: estos ya lo traen.</p><div class="mas-grid">' + Object.keys(CL.T).map(k => '<a href="#/claude" data-act="cl-abrir" data-k="' + k + '"><span class="mg-e">' + CL.T[k].t.split(' ')[0] + '</span><span>' + esc(CL.T[k].t.replace(/^\S+\s/, '')) + '</span><small>' + esc(CL.T[k].d) + '</small></a>').join('') + '</div>') + card('<p class="small"><b>Tip:</b> después de su primera respuesta, dile qué cambiar en concreto («más corto», «con material de la tlapalería», «para 45 minutos»). Iterar 2 o 3 veces da mejores resultados que pedir todo perfecto a la primera.</p>') });
  // botones en contexto
  if (V.alumno) { const va = V.alumno; V.alumno = function (id) { const o = va.apply(null, arguments), g = D.grupoActual(), a = g && D.alumno(g, id); if (o && a && !/Algo falló/.test(o.h)) o.h = E.fichaInsert(o.h, card('<div class="row between gap wrap"><p class="small">✨ Plan de apoyo y mensaje a casa con ayuda de Claude (sin su nombre).</p>' + btn('Pídeselo a Claude', 'cl-abrir', 'data-k="caso" data-x="' + a.id + '"', 'small') + '</div>')); return o; }; }
  if (V.clase) { const vc = V.clase; V.clase = function (f) { const o = vc.apply(null, arguments); if (o && o.h && !/Algo falló/.test(o.h)) o.h += card('<div class="row between gap wrap"><p class="small">✨ Adaptar esta clase para los que van mal y los que van bien.</p>' + btn('Pídeselo a Claude', 'cl-abrir', 'data-k="clase" data-x="' + esc(f || u.today()) + '"', 'small') + '</div>'); return o; }; }
  if (V.banco) { const vb = V.banco; V.banco = function () { const o = vb.apply(null, arguments); if (o && o.h && !/Algo falló/.test(o.h)) o.h = card('<div class="row between gap wrap"><p class="small">✨ 10 preguntas de lo que ya vieron, en el formato para pegar aquí.</p>' + btn('Pídeselo a Claude', 'cl-abrir', 'data-k="banco"', 'small') + '</div>') + o.h; return o; }; }
})();
