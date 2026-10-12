/* Escuadra · Consejo técnico: un reporte por grupo para la sesión del consejo técnico escolar (viernes de fin de mes).
   Junta lo que ya registras en Escuadra desde el consejo anterior: avance del programa, aprovechamiento, asistencia,
   entregas, alumnos que requieren atención (alerta temprana: asistencia, rendimiento y conducta, como en «Yo no abandono»),
   logros, estrategias que aplicaste, propuestas y próximas fechas, con espacio para los acuerdos. Se imprime o se proyecta.
   Solo datos escolares: no lleva las notas de tutoría ni datos personales. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const CT = E.consejo = {};
  const KF = 'ctefechas', KN = (g, f) => 'cte:' + g.id + ':' + String(f).slice(0, 7);   // notas por mes: si cambias la fecha de la sesión, no se pierden
  const O = { mal: 0, reg: 1, bien: 2 };
  const pct = (a, b) => b ? Math.round(a / b * 100) : null;
  const pctTxt = v => v == null ? '—' : v + ' %';
  const corto = n => u.corto(n);
  const enRango = (f, a, b) => f && f >= a && f <= b;
  const lista = (arr, n) => arr.slice(0, n).join(', ') + (arr.length > n ? ' y ' + (arr.length - n) + ' más' : '');
  const uniq = arr => arr.filter((x, i) => x && arr.indexOf(x) === i);

  /* ---------- fechas de las sesiones: último viernes de cada mes del semestre (se puede cambiar) ---------- */
  CT.fechas = () => {
    const ps = D.parciales(); if (!ps.length) return [];
    const ini = ps.map(p => p.inicio).sort()[0], fin = ps.map(p => p.fin).sort().slice(-1)[0], man = S.get(KF) || {}, out = [];
    let y = Number(ini.slice(0, 4)), m = Number(ini.slice(5, 7));
    const ym = (yy, mm) => yy + '-' + String(mm).padStart(2, '0');
    while (ym(y, m) <= fin.slice(0, 7)) {
      const k = ym(y, m); let f = man[k];
      if (!f) { let d = new Date(y, m, 0).getDate(); f = k + '-' + String(d).padStart(2, '0'); while (u.dow(f) !== 5) { d--; f = k + '-' + String(d).padStart(2, '0'); } }
      if (man[k] || (f >= ini && f <= fin)) out.push({ mes: k, f: f, auto: !man[k] });
      m++; if (m > 12) { m = 1; y++; }
    }
    Object.keys(man).forEach(k => { if (!out.some(x => x.mes === k) && man[k]) out.push({ mes: k, f: man[k], auto: false }); });
    return out.sort((a, b) => a.f.localeCompare(b.f));
  };
  // la sesión que toca: la próxima (o la última, si ya pasaron todas)
  CT.actual = hoy => { hoy = hoy || u.today(); const fs = CT.fechas(); return (fs.find(x => x.f >= hoy) || fs[fs.length - 1] || {}).f || null; };
  CT.periodo = (g, f) => {
    const fs = CT.fechas(), i = fs.findIndex(x => x.f === f), ps = D.parciales(), hoy = u.today();
    let desde = i > 0 ? u.addDays(fs[i - 1].f, 1) : ps.map(p => p.inicio).sort()[0];
    if (g.inicioDocente && g.inicioDocente > desde) desde = g.inicioDocente;
    const corte = f < hoy ? f : hoy, sig = i >= 0 && fs[i + 1] ? fs[i + 1].f : null;
    return { f: f, desde: desde, corte: corte, ant: i > 0 ? fs[i - 1].f : null, sig: sig, hasta: sig || u.addDays(f, 35), futuro: f > hoy, sinDatos: corte < desde };
  };

  /* ---------- datos del reporte de un grupo ---------- */
  CT.datos = (g, f) => {
    const per = CT.periodo(g, f), hoy = u.today(), cfg = D.cfg(), al = D.alumnos(g), minA = Number(cfg.minAprob) || 60, minAs = Number(cfg.minAsis) || 80;
    const ps = D.parciales().filter(p => p.inicio <= per.f && p.fin >= per.desde && D.submodulo(g, p.id));
    const pAct = ps.find(p => per.corte >= p.inicio && per.corte <= p.fin) || ps.filter(p => p.inicio <= per.corte).slice(-1)[0] || ps[0] || null;
    const R = { g: g, per: per, al: al, ps: ps, pAct: pAct, hoy: hoy };
    const sms = uniq(ps.map(p => D.submodulo(g, p.id)).map(sm => sm && sm.num)); R.sms = sms.map(n => ({ num: n, nombre: ((E.PROGRAMA.modulos[g.modulo] || {}).sub || {})[n] ? E.PROGRAMA.modulos[g.modulo].sub[n].nombre : '' }));
    const NOM = {}; al.forEach(a => { NOM[a.id] = a; });

    /* asistencia del periodo */
    const pre = 'asis:' + g.id + ':', fechas = S.keys(pre).map(k => k.slice(pre.length)).filter(x => enRango(x, per.desde, per.corte)).sort();
    const as = {}, sem = {}; al.forEach(a => { as[a.id] = { ses: 0, a: 0, f: 0, r: 0, j: 0 }; });
    fechas.forEach(x => {
      const doc = S.get(pre + x) || {}, lun = u.addDays(x, -((u.dow(x) + 6) % 7)), w = sem[lun] = sem[lun] || { a: 0, s: 0 };
      al.forEach(a => { const st = doc[a.id] || 'A', r = as[a.id]; r.ses++; w.s++; if (st === 'R') r.r++; if (st === 'J') r.j++; if (C.cuenta(st)) { r.a++; w.a++; } else r.f++; });
    });
    const tA = al.reduce((s, a) => s + as[a.id].a, 0), tS = al.reduce((s, a) => s + as[a.id].ses, 0);
    R.asis = { dias: fechas.length, pct: pct(tA, tS), por: as, semanas: Object.keys(sem).sort().map(k => ({ lun: k, pct: pct(sem[k].a, sem[k].s) })),
      faltas: al.filter(a => as[a.id].f > 0).map(a => ({ a: a, f: as[a.id].f, p: pct(as[a.id].a, as[a.id].ses) })).sort((x, y) => y.f - x.f),
      perfecta: al.filter(a => as[a.id].ses >= 3 && !as[a.id].f), retardos: al.reduce((s, a) => s + as[a.id].r, 0), just: al.reduce((s, a) => s + as[a.id].j, 0) };
    R.asis.bajo = R.asis.faltas.filter(x => x.f >= 3 || (as[x.a.id].ses >= 3 && x.p < minAs));

    /* calificaciones de los parciales del periodo */
    R.cal = ps.map(p => {
      const rows = al.map(a => ({ a: a, k: C.cal(g, p.id, a.id) })), con = rows.filter(r => r.k.final != null && (r.k.manual || (r.k.comp || {}).examen != null || (r.k.comp || {}).trabajos != null));
      return { p: p, n: con.length, prom: con.length ? Math.round(con.reduce((s, r) => s + r.k.final, 0) / con.length * 10) / 10 : null, aprob: con.filter(r => r.k.final >= minA).length,
        reprob: con.filter(r => r.k.final < minA), sin: rows.length - con.length, enCurso: p.fin >= per.corte || con.some(r => r.k.enCurso), cerrado: p.fin < per.corte };
    }).filter(x => x.p.inicio <= per.corte);

    /* semáforo: cómo van ahora y cómo iban al empezar el periodo */
    const SF = E.semaforo; R.sem = null;
    if (SF && pAct && !D.manual(g, pAct.id).activo && pAct.inicio <= per.corte) {
      const ini = per.desde > pAct.inicio ? u.addDays(per.desde, -1) : null;
      const filas = al.map(a => { const x = SF.prom(g, a.id, pAct.id, per.corte, per.corte === hoy), x0 = ini ? SF.prom(g, a.id, pAct.id, ini, false) : null;
        return { a: a, x: x, v: x ? x.v : null, n: SF.nivel(x ? x.v : null), n0: x0 ? SF.nivel(x0.v) : null, razon: x ? SF.razon(x) : '' }; });
      const cnt = { mal: 0, reg: 0, bien: 0, sin: 0 }; filas.forEach(r => { cnt[r.n || 'sin']++; });
      R.sem = { p: pAct, filas: filas, cnt: cnt, diag: filas.filter(r => r.x && r.x.partida).length, subieron: filas.filter(r => r.n && r.n0 && O[r.n] > O[r.n0]), bajaron: filas.filter(r => r.n && r.n0 && O[r.n] < O[r.n0]), conInicio: !!ini };
    }

    /* exámenes del periodo (los armados en Escuadra) */
    const X = E.examen; R.exam = [];
    if (X) X.list(g).filter(ex => enRango(ex.fecha, per.desde, per.corte)).forEach(ex => {
      const an = X.analisis(g, ex); if (!an) { R.exam.push({ ex: ex, an: null }); return; }
      const deb = Object.keys(an.temas).map(t => ({ t: t, p: an.temas[t].p })).filter(x => x.p < 0.7).sort((a, b) => a.p - b.p).map(x => ({ titulo: ((E.TEMAS || []).find(y => y.id === x.t) || {}).titulo || x.t, p: Math.round(x.p * 100) }));
      R.exam.push({ ex: ex, an: an, pct: ex.total ? Math.round(an.prom / ex.total * 100) : null, n: an.n, debiles: deb });
    });

    /* entregas: actividades calificables del periodo, tareas de libreta y prácticas de FreeCAD */
    const acts = [].concat.apply([], ps.map(p => C.acts(g, p.id))).filter(a => a.cuenta !== false && enRango(a.fecha, per.desde, per.corte));
    const trab = acts.filter(a => a.categoria === 'trabajos'), venc = trab.filter(a => a.fecha < hoy), pend = {}; let ent = 0, esp = 0, tarde = 0;
    venc.forEach(a => al.forEach(x => { esp++; if (C.nota(a, x.id) != null) ent++; else pend[x.id] = (pend[x.id] || 0) + 1; }));
    acts.forEach(a => { tarde += Object.keys(a.tarde || {}).length; });
    const promA = arr => { const v = []; arr.forEach(a => al.forEach(x => { const n = C.nota(a, x.id); if (n != null) v.push(n); })); return v.length ? Math.round(v.reduce((s, y) => s + y, 0) / v.length) : null; };
    R.ent = { acts: acts.length, trab: trab.length, examenes: acts.filter(a => a.categoria === 'examen').length, pct: pct(ent, esp), prom: promA(trab), promEx: promA(acts.filter(a => a.categoria === 'examen')), pend: pend, tarde: tarde };
    let lt = 0, lrev = 0, lok = 0;
    if (E.libreta) ps.forEach(p => {
      let T; try { T = E.libreta.tareas(g, p.id); } catch (e) { return; }
      const ks = T.todas.filter(x => x.cuenta && enRango(x.f, per.desde, per.corte)).map(x => x.key), mk = E.libreta.doc(g, p.id).marcas || {};
      lt += ks.length; ks.forEach(k => al.forEach(x => { const v = (mk[x.id] || {})[k]; if (v != null) { lrev++; if (Number(v) === 2) lok++; } }));
    });
    R.lib = { tareas: lt, revisadas: pct(lrev, lt * al.length), completas: pct(lok, lrev) };
    let fcN = 0, fcOk = 0;
    if (E.fc && E.fc.rev) ps.forEach(p => { const d = E.fc.rev(g, p.id); Object.keys(d.fechas || {}).forEach(aid => Object.keys(d.fechas[aid] || {}).forEach(id => { if (!enRango(d.fechas[aid][id], per.desde, per.corte)) return; fcN++; if (Number(((d.marcas || {})[aid] || {})[id]) === 2) fcOk++; })); });
    R.fc = { n: fcN, ok: fcOk };

    /* proyecto por equipo */
    const PJ = E.proyecto; R.pj = null;
    if (PJ && pAct) {
      const pid = PJ.canon(g, pAct.id), def = PJ.ETAPAS[E.clases.smKey(g, pid)], eqs = (PJ.doc(g, pid).equipos || []);
      if (def && eqs.length) { const est = eqs.map(eq => ({ eq: eq, r: PJ.estado(g, pid, eq, per.corte) })); R.pj = { nombre: def.nombre, pid: pid, eqs: est, ok: est.filter(x => x.r.nv === 'ok').length, atr: est.filter(x => x.r.nv !== 'ok'), metas: PJ.metas(g, pid) || [] }; }
    }

    /* avance del programa (de la secuencia de Clases) */
    R.av = []; R.prox = []; const mats = [];
    ps.filter(p => E.clases.tiene(g, p.id)).forEach(p => {
      let pl; try { pl = E.clases.plan(g, p.id); } catch (e) { return; }
      const enPer = pl.bloques.filter(b => enRango(b.fecha, per.desde, per.corte)), dadas = enPer.filter(b => !b.perdida), perd = enPer.filter(b => b.perdida);
      const hParts = bs => bs.reduce((s, b) => s + b.parts.reduce((a, t) => a + t.h, 0), 0);
      const its = [], acs = [], evs = [];
      dadas.forEach(b => b.parts.forEach(t => {
        if (!its.some(x => x.id === t.it.id)) its.push(t.it);
        if (t.it.ac != null) { const sub = ((E.PROGRAMA.modulos[g.modulo] || {}).sub || {})[t.it.sm || (g.submodulos || {})[p.id]], ac = sub && sub.ac[t.it.ac]; if (ac && acs.indexOf(ac.titulo) < 0) acs.push(ac.titulo); }
        if (t.it.ev && !t.sigue && evs.indexOf(t.it.ev) < 0) evs.push(t.it.ev);
      }));
      const tot = pl.bloques.filter(b => !b.perdida), hechas = tot.filter(b => b.fecha <= per.corte);
      R.av.push({ p: p, sm: D.submodulo(g, p.id), hDadas: hParts(dadas), nPerd: perd.length, hPerd: perd.reduce((s, b) => s + b.horas, 0), its: its, acs: acs, evs: evs,
        hParcial: hParts(hechas), cal: pl.cal, faltan: pl.faltan, flujo: E.clases.flujo(g), temas: uniq(its.map(x => x.tema)).map(t => ((E.TEMAS || []).find(y => y.id === t) || {}).titulo).filter(Boolean),
        computo: pl.computo });
      pl.bloques.filter(b => !b.perdida && b.fecha > per.corte && b.fecha <= per.hasta).forEach(b => b.parts.forEach(t => {
        const it = t.it; if (it.mat && b.fecha > hoy) mats.push(it.mat);
        if (t.sigue) return;
        if (/^examen/.test(it.id) || it.tipo === 'Evaluación' || /actividad clave/.test(it.ev || '')) R.prox.push({ f: b.fecha, t: it.t, tipo: /^examen/.test(it.id) ? 'examen' : 'eval' });
      }));
    });
    R.mats = uniq(mats).slice(0, 6);

    /* observaciones del periodo (de un toque y del cierre del día) */
    const negIds = (E.OBS || []).filter(o => o.pos < 0).map(o => o.id), posIds = (E.OBS || []).filter(o => o.pos > 0).map(o => o.id), obs = {};
    S.keys('obs:' + g.id + ':').forEach(k => { const x = k.split(':').pop(); if (!enRango(x, per.desde, per.corte)) return; const doc = S.get(k) || {};
      Object.keys(doc).forEach(aid => { const o = obs[aid] = obs[aid] || { neg: 0, pos: 0, exc: 0 }; (doc[aid] || []).forEach(id => { if (negIds.indexOf(id) >= 0) o.neg++; if (posIds.indexOf(id) >= 0) o.pos++; if (id === 'excelente') o.exc++; }); }); });

    /* alumnos que requieren atención: señales A (asistencia), B (rendimiento) y C (conducta), más entregas pendientes */
    const seg = E.tutoria ? E.tutoria.seg(g) : {}, AP = E.apoyos, ESTR = E.ESTRATEGIAS || [];
    const apoyos = AP ? AP.lista(g).filter(x => enRango(x.fecha, per.desde, per.corte)) : [];
    const semDe = {}; if (R.sem) R.sem.filas.forEach(r => { semDe[r.a.id] = r; });
    R.riesgo = al.map(a => {
      const x = { a: a, F: as[a.id].f, P: pct(as[a.id].a, as[a.id].ses), sem: semDe[a.id] || null, neg: (obs[a.id] || {}).neg || 0, pend: pend[a.id] || 0, est: (seg[a.id] || {}).estado || '',
        apoyos: uniq(apoyos.filter(y => y.aids.indexOf(a.id) >= 0).map(y => { const e = ESTR.find(z => z.id === y.est); return e ? e.t : ''; })) };
      x.sA = x.F >= 2; x.sB = !!(x.sem && x.sem.n === 'mal' && !x.sem.x.partida); x.sC = x.neg >= 3; x.sD = x.pend >= 2;
      x.n = (x.sA ? 1 : 0) + (x.sB ? 1 : 0) + (x.sC ? 1 : 0); x.sug = sugiere(x); return x;
    }).filter(x => x.n || x.sD || x.est === 'seg' || x.est === 'can').sort((p, q) => q.n - p.n || (q.sD ? 1 : 0) - (p.sD ? 1 : 0) || p.a.num - q.a.num);

    /* logros */
    const partP = {}; S.keys('part:' + g.id + ':').forEach(k => { const x = k.split(':').pop(); if (!enRango(x, per.desde, per.corte)) return; const doc = S.get(k) || {}; Object.keys(doc).forEach(aid => { partP[aid] = (partP[aid] || 0) + Number(doc[aid] || 0); }); });
    R.logros = {
      subieron: R.sem ? R.sem.subieron.map(r => r.a) : [],
      perfecta: R.asis.perfecta,
      reconocidos: E.reconoce ? al.filter(a => E.reconoce.historial(g, a.id).some(x => enRango(x, per.desde, per.corte))) : [],
      destacados: al.filter(a => (obs[a.id] || {}).exc >= 2 || (obs[a.id] || {}).pos >= 3).map(a => ({ a: a, n: (obs[a.id] || {}).pos })).sort((x, y) => y.n - x.n),
      participan: al.filter(a => partP[a.id] > 0).sort((x, y) => partP[y.id] - partP[x.id]).slice(0, 3).map(a => ({ a: a, n: partP[a.id] })),
      equiposAlDia: R.pj ? R.pj.eqs.filter(x => x.r.nv === 'ok').map(x => x.eq.nombre) : []
    };

    /* lo que hiciste: estrategias y registros del periodo */
    const dn = E.dinamicas ? (E.dinamicas.doc(g).reg || []).filter(x => enRango(x.f, per.desde, per.corte)) : [];
    const apG = {}; apoyos.forEach(y => { const e = ESTR.find(z => z.id === y.est); if (!e) return; const o = apG[y.est] = apG[y.est] || { e: e, n: new Set() }; y.aids.forEach(i => o.n.add(i)); });
    const rt = S.get('retro:' + g.id) || {}; let nRet = 0; Object.keys(rt).forEach(aid => (rt[aid] || []).forEach(x => { if (enRango(x.f, per.desde, per.corte)) nRet++; }));
    const bits = S.list('bit:').filter(b => b.grupoId === g.id && enRango(b.fecha, per.desde, per.corte));
    const ev = ((S.get('evid:' + g.id) || {}).items || []).filter(x => x && !x.borrada && enRango(x.f, per.desde, per.corte));
    R.hice = {
      dinamicas: dn.map(x => ({ f: x.f, t: ((E.DINAMICAS || []).find(d => d.id === x.din) || {}).t || x.din, como: x.como })),
      apoyos: Object.keys(apG).map(k => ({ t: apG[k].e.t, ico: apG[k].e.ico, n: apG[k].n.size })),
      retro: nRet, temas: bits.filter(b => /^Tema visto/.test(b.texto || '')).length,
      cierres: S.keys('cierre:' + g.id + ':').filter(k => enRango(k.split(':').pop(), per.desde, per.corte)).length,
      bitacora: bits.length, evidencias: ev.length, reconocimientos: R.logros.reconocidos.length
    };

    /* tutoría (solo cifras y acciones, sin notas) */
    R.tut = null;
    if (E.tutoria) {
      const tc = E.tutoria.cfg(g), cnt = { seg: 0, can: 0 }; Object.keys(seg).forEach(aid => { if (NOM[aid] && cnt[seg[aid].estado] != null) cnt[seg[aid].estado]++; });
      const plan = tc.plan || [], hechas = plan.filter(x => x.estado === 'hecha' && enRango(x.hechaF, per.desde, per.corte)), prox = plan.filter(x => x.estado !== 'hecha' && x.fecha && x.fecha > per.corte && x.fecha <= per.hasta);
      if (cnt.seg || cnt.can || hechas.length || prox.length) R.tut = { seg: cnt.seg, can: cnt.can, hechas: hechas.map(x => x.t), prox: prox.map(x => ({ f: x.fecha, t: x.t })) };
    }

    /* próximas fechas hasta el siguiente consejo */
    const fx = [];
    D.parciales().forEach(p => {
      if (enRango(p.fin, u.addDays(per.corte, 1), per.hasta)) fx.push({ f: p.fin, t: 'Cierra el ' + p.nombre });
      if (enRango(p.captura, u.addDays(per.corte, 1), per.hasta)) fx.push({ f: p.captura, t: 'Captura de calificaciones del ' + p.nombre });
      (p.asuetos || []).forEach(a => { if (enRango(a, u.addDays(per.corte, 1), per.hasta) && a !== per.sig && a !== per.f) fx.push({ f: a, t: 'Sin clases (asueto)' }); });
    });
    R.prox.forEach(x => fx.push({ f: x.f, t: x.tipo === 'examen' ? x.t : 'Evaluación: ' + x.t }));
    if (R.pj) R.pj.metas.forEach(m => { if (enRango(m.f, u.addDays(per.corte, 1), per.hasta)) fx.push({ f: m.f, t: 'Proyecto: ' + m.t }); });
    if (R.tut) R.tut.prox.forEach(x => fx.push({ f: x.f, t: 'Tutoría: ' + x.t }));
    if (per.sig) fx.push({ f: per.sig, t: 'Siguiente consejo técnico' });
    if (per.f > per.corte) fx.push({ f: per.f, t: 'Esta sesión del consejo técnico' });
    R.fechas = fx.filter((x, i) => fx.findIndex(y => y.f === x.f && y.t === x.t) === i).sort((a, b) => a.f.localeCompare(b.f));

    /* indicadores y propuestas */
    const cAct = R.cal.find(x => pAct && x.p.id === pAct.id) || R.cal[R.cal.length - 1] || null, avAct = R.av.find(x => pAct && x.p.id === pAct.id) || R.av[R.av.length - 1] || null;
    R.kpi = {
      asis: R.asis.pct, prom: cAct ? cAct.prom : null, aprob: cAct && cAct.n ? cAct.aprob : null, nCal: cAct ? cAct.n : 0, reprob: cAct ? cAct.reprob.length : 0,
      avance: avAct && avAct.cal ? pct(avAct.hParcial, avAct.cal) : null, ent: R.ent.pct, atencion: R.riesgo.filter(x => x.n).length, rojo: R.sem ? R.sem.cnt.mal : null
    };
    R.cAct = cAct; R.avAct = avAct;
    R.propuestas = propone(R); R.propuestasAnon = propone(R, true);
    return R;
  };
  function sugiere(x) {
    const s = [];
    if (x.est === 'can') s.push('Canalizado: seguimiento con orientación');
    if (x.n >= 2) s.push('Revisar el caso con los docentes del grupo y su familia');
    if (x.sA) s.push('Contactar a su familia por ' + x.F + ' faltas');
    if (x.sD) s.push('Plan de entregas: ' + x.pend + ' trabajos pendientes');
    if (x.sB && x.sem && /examen/.test(x.sem.razon)) s.push('Asesoría y retroalimentación del examen');
    else if (x.sB) s.push('Asesoría y metas semanales');
    if (x.sC) s.push('Plática sobre su actitud en clase (con tutoría si sigue)');
    if (!s.length && x.est === 'seg') s.push('Continuar el seguimiento de tutoría');
    return s.slice(0, 2);
  }
  function propone(R, anon) {
    const out = [], rA = R.riesgo.filter(x => x.sA), rB = R.riesgo.filter(x => x.sB), rD = R.riesgo.filter(x => x.sD), multi = R.riesgo.filter(x => x.n >= 2);
    if (multi.length) out.push('Revisar con los demás docentes del grupo a ' + lista(multi.map(x => anon ? 'No. ' + x.a.num : corto(x.a.nombre)), 5) + ' (dos o más señales de alerta).');
    if (rA.length) out.push('Contactar a las familias de ' + rA.length + (rA.length === 1 ? ' alumno' : ' alumnos') + ' con 2 o más faltas en el periodo.');
    if (rB.length) out.push('Plan de recuperación para ' + rB.length + (rB.length === 1 ? ' alumno' : ' alumnos') + ' en rojo: asesoría, metas semanales y retroalimentación.');
    if (rD.length) out.push('Calendario de entregas para ' + rD.length + (rD.length === 1 ? ' alumno' : ' alumnos') + ' con 2 o más trabajos pendientes.');
    const deb = uniq([].concat.apply([], R.exam.map(x => (x.debiles || []).map(d => d.titulo)))); if (deb.length) out.push('Reforzar en clase: ' + lista(deb, 3) + '.');
    if (R.ent.pct != null && R.ent.pct < 70) out.push('La entrega de trabajos fue de ' + R.ent.pct + ' %: recordar fechas en clase y revisar libreta al momento.');
    const av = R.avAct; if (av && av.faltan > 0 && !av.flujo) out.push('Con los días que quedan faltan ' + av.faltan + ' h de la secuencia: priorizar las actividades clave del programa.');
    if (av && av.computo && av.computo.nec > av.computo.hay) out.push('Solicitar más horas de centro de cómputo: la secuencia necesita ' + av.computo.nec + ' h y el horario tiene ' + av.computo.hay + ' h.');
    if (R.pj && R.pj.atr.length) out.push('Apoyar a los equipos con el proyecto atrasado: ' + lista(R.pj.atr.map(x => x.eq.nombre), 4) + '.');
    if (R.mats.length) out.push('Material para el siguiente mes: ' + lista(R.mats, 4) + '.');
    if (!out.length) out.push('El grupo va bien: mantener las estrategias y reconocer el esfuerzo.');
    return out;
  }
  CT.notas = (g, f) => S.get(KN(g, f)) || {};
  const CAMPOS = [['acuerdos', 'Acuerdos del consejo', 'Lo que se acuerde en la sesión para este grupo'], ['compromisos', 'Mis compromisos', 'Qué haré antes del siguiente consejo'], ['apoyos', 'Apoyos que solicito', 'De dirección, orientación, tutoría o las familias'], ['obs', 'Observaciones', 'Algo más que quieras comentar del grupo']];

  /* ---------- piezas comunes ---------- */
  const fT = f => u.fCorta(f), nombre = (a, anon) => anon ? 'No. ' + a.num : a.nombre;
  const smTxt = R => (R.g.modulo ? 'Módulo ' + R.g.modulo : '') + (R.sms.length ? ' · ' + R.sms.map(s => 'Submódulo ' + s.num + (s.nombre ? ': ' + s.nombre : '')).join(' · ') : '');
  const kpis = R => {
    const k = R.kpi, nAl = R.al.length;
    return [
      ['Asistencia', pctTxt(k.asis), diasTxt(R.asis.dias) + ' con lista', k.asis == null ? '' : k.asis >= 90 ? 'ok' : k.asis >= 80 ? 'warn' : 'bad'],
      ['Promedio', k.prom == null ? '—' : String(k.prom), R.cAct ? R.cAct.p.nombre + (R.cAct.enCurso ? ' (en curso)' : '') : '', k.prom == null ? '' : k.prom >= 80 ? 'ok' : k.prom >= 60 ? 'warn' : 'bad'],
      ['Aprobando', k.aprob == null ? '—' : k.aprob + ' de ' + k.nCal, k.reprob ? k.reprob + ' con menos de ' + (Number(D.cfg().minAprob) || 60) : 'nadie por debajo', k.aprob == null ? '' : k.reprob ? (k.reprob / Math.max(1, k.nCal) > 0.2 ? 'bad' : 'warn') : 'ok'],
      ['Avance', pctTxt(k.avance), R.avAct ? R.avAct.hParcial + ' de ' + R.avAct.cal + ' h del ' + R.avAct.p.nombre : '', k.avance == null ? '' : 'ok'],
      ['Entregas', pctTxt(k.ent), R.ent.trab + ' trabajos calificables', k.ent == null ? '' : k.ent >= 85 ? 'ok' : k.ent >= 70 ? 'warn' : 'bad'],
      ['Requieren atención', String(k.atencion), 'de ' + nAl + ' alumnos', k.atencion ? (k.atencion / Math.max(1, nAl) > 0.2 ? 'bad' : 'warn') : 'ok']
    ];
  };
  const riesgoFilas = (R, anon) => R.riesgo.map(x => [String(x.a.num), nombre(x.a, anon), (x.sA ? 'A' : '') + (x.sB ? 'B' : '') + (x.sC ? 'C' : '') || '—',
    String(x.F) + (x.P != null ? ' (' + x.P + ' %)' : ''), x.sem && x.sem.v != null ? String(Math.round(x.sem.v)) + (x.sem.x && x.sem.x.partida ? '*' : '') : '—', String(x.pend || 0), String(x.neg || 0),
    ({ seg: 'En seguimiento', can: 'Canalizado' })[x.est] || '', x.apoyos.length ? x.apoyos.join('; ') : '', x.sug.join('. ')]);
  const semNota = R => !R.sem || !R.sem.diag ? '' : R.sem.diag === R.sem.filas.filter(r => r.x).length ? ' (con el diagnóstico: todavía no hay calificaciones del parcial)' : ' (' + R.sem.diag + ' todavía solo con el diagnóstico)';
  const diasTxt = n => n + (n === 1 ? ' día' : ' días'), nTxt = (n, a, b) => n + ' ' + (n === 1 ? a : b);
  const RCAB = ['No.', 'Alumno', 'Señal', 'Faltas', 'Prom.', 'Pend.', 'Obs. neg.', 'Tutoría', 'Apoyos dados', 'Qué propongo'];

  /* ---------- vista ---------- */
  V.consejo = fsel => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); if (!D.alumnos(g).length) return H.needAlumnos('Consejo técnico');
    const fs = CT.fechas(); if (!fs.length) return { t: 'Consejo técnico', h: card('<p>Configura las fechas de los parciales en Ajustes.</p>') };
    const f = fs.some(x => x.f === fsel) ? fsel : CT.actual(), R = CT.datos(g, f), per = R.per, nt = CT.notas(g, f), multi = D.gruposActivos().length > 1;
    let h = '<div class="filters">' + fs.map(x => '<a class="tab ' + (x.f === f ? 'on' : '') + '" href="#/consejo/' + x.f + '">' + esc(u.cap(u.MESES[Number(x.mes.slice(5, 7)) - 1])) + ' · ' + esc(u.fDM(x.f)) + '</a>').join('') + '</div>';
    if (multi) h += '<div class="row gap wrap cte-gr">' + D.gruposActivos().map(x => btn(esc(x.nombre), 'cte-grupo', 'data-gid="' + x.id + '"', 'small' + (x.id === g.id ? ' primary' : ' ghost'))).join('') + '</div>';
    h += card('<div class="row between gap wrap"><h3>🏛️ Consejo técnico · ' + esc(g.nombre) + '</h3><span class="chip">' + esc(u.cap(u.fLarga(f))) + '</span></div>' +
      '<p class="muted small">' + esc(smTxt(R)) + '</p>' +
      '<p class="small">Periodo: <b>' + esc(u.fLarga(per.desde)) + '</b> al <b>' + esc(u.fLarga(per.f)) + '</b>' + (per.futuro ? ' · datos al ' + esc(u.fLarga(per.corte)) + '; se actualiza solo hasta el día de la sesión' : '') + '.</p>' +
      '<div class="row gap wrap mt">' + btn('🖨 Imprimir reporte', 'cte-print', 'data-f="' + f + '"', 'primary') + btn('📽 Proyectar', 'cte-proj', 'data-f="' + f + '"') + (multi ? btn('🖨 Todos mis grupos (uno por hoja)', 'cte-print-all', 'data-f="' + f + '"', 'ghost') : '') + '</div>' +
      '<div class="row gap wrap mt"><label class="fld cte-fecha"><span>Fecha de la sesión</span><input type="date" data-ch="cte-fecha" data-mes="' + f.slice(0, 7) + '" value="' + f + '"></label>' +
      '<label class="switch"><input type="checkbox" data-ch="cte-anon" ' + (E.ui.cteAnon ? 'checked' : '') + '><span>Al proyectar, solo número de lista (sin nombres)</span></label></div>' +
      '<p class="muted small">Por omisión es el último viernes de cada mes; cámbiala si tu plantel lo hace otro día.</p>');
    if (per.sinDatos) return { t: 'Consejo técnico', h: h + card(g.inicioDocente && g.inicioDocente > per.f ? '<p>Empezaste con ' + esc(g.nombre) + ' el ' + esc(u.fLarga(g.inicioDocente)) + ': este periodo no te tocó.</p>' : '<p>Este periodo empieza el ' + esc(u.fLarga(per.desde)) + '. El reporte se llena solo con lo que registres hasta el día de la sesión.</p>') };
    // antes de la sesión: lo que falta capturar para que el reporte salga completo (solo lo ves tú)
    if (per.f >= R.hoy) { const pd = E.pend ? E.pend.lista(g).filter(x => x.tipo !== 'cierre').length : 0, sinRev = R.lib.tareas && R.lib.revisadas != null && R.lib.revisadas < 100;
      if (pd || sinRev) h += card('<h3>✅ Antes de la sesión</h3><p class="small">Para que el reporte salga con datos completos:</p><ul class="small">' + (pd ? '<li>Tienes <a href="#/pendientes">' + pd + (pd === 1 ? ' pendiente' : ' pendientes') + ' de captura</a> (lista, calificaciones o evidencias).</li>' : '') +
        (sinRev ? '<li>Revisa la <a href="#/libreta">libreta</a>: va ' + R.lib.revisadas + ' % de las tareas del periodo marcadas.</li>' : '') + '</ul><p class="muted small">Esto no sale en la hoja ni al proyectar.</p>', 'accent'); }
    // indicadores
    h += '<div class="cte-kpis">' + kpis(R).map(k => '<div class="cte-k ' + k[3] + '"><span>' + esc(k[0]) + '</span><b>' + esc(k[1]) + '</b><small>' + esc(k[2]) + '</small></div>').join('') + '</div>';
    // avance
    h += card('<h3>📚 Avance del programa</h3>' + (R.av.length ? R.av.map(av => '<div class="cte-sec"><h4>' + esc(av.p.nombre) + (av.sm ? ' · Submódulo ' + esc(av.sm.num) : '') + '</h4>' +
      '<div class="bar"><span style="width:' + Math.min(100, av.cal ? av.hParcial / av.cal * 100 : 0) + '%"></span></div><p class="small">' + av.hParcial + ' de ' + av.cal + ' h del parcial dadas · en el periodo: ' + av.hDadas + ' h' + (av.nPerd ? ' · ' + av.nPerd + (av.nPerd === 1 ? ' clase perdida' : ' clases perdidas') + ' (' + av.hPerd + ' h)' : '') + '</p>' +
      (av.faltan > 0 && !av.flujo ? '<p class="note warn small">Con los días que quedan faltan ' + av.faltan + ' h de la secuencia.</p>' : '') +
      (av.acs.length ? '<p class="small"><b>Actividades clave trabajadas:</b> ' + esc(av.acs.join('; ')) + '</p>' : '') +
      (av.temas.length ? '<p class="small"><b>Temas:</b> ' + esc(lista(av.temas, 8)) + '</p>' : '') +
      (av.evs.length ? '<details class="sub"><summary>Evidencias del periodo (' + av.evs.length + ')</summary><ul class="small">' + av.evs.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></details>' : '') + '</div>').join('') : '<p class="muted small">Este grupo no tiene secuencia de clases en el periodo.</p>'));
    // aprovechamiento
    h += card('<h3>📈 Aprovechamiento</h3>' + (R.cal.length ? '<div class="tbl-wrap"><table class="tbl cte-t"><thead><tr><th>Parcial</th><th>Promedio</th><th>Aprobando</th><th>Menos de ' + (Number(D.cfg().minAprob) || 60) + '</th><th>Sin calificación</th></tr></thead><tbody>' +
      R.cal.map(c => '<tr><td>' + esc(c.p.nombre) + (c.enCurso ? ' <small class="muted">en curso</small>' : '') + '</td><td>' + (c.prom == null ? '—' : c.prom) + '</td><td>' + c.aprob + '</td><td>' + c.reprob.length + '</td><td>' + c.sin + '</td></tr>').join('') + '</tbody></table></div>' : '<p class="muted small">Sin calificaciones todavía.</p>') +
      (R.sem ? '<p class="small mt"><b>Semáforo (' + esc(R.sem.p.nombre) + '):</b> 🔴 ' + R.sem.cnt.mal + ' · 🟡 ' + R.sem.cnt.reg + ' · 🟢 ' + R.sem.cnt.bien + (R.sem.cnt.sin ? ' · sin datos ' + R.sem.cnt.sin : '') + esc(semNota(R)) +
        (R.sem.conInicio ? '. En el periodo subieron de nivel ' + R.sem.subieron.length + ' y bajaron ' + R.sem.bajaron.length : '') + '.</p>' : '') +
      (R.exam.length ? '<p class="small"><b>Exámenes del periodo:</b> ' + R.exam.map(x => esc(x.ex.titulo) + (x.pct != null ? ' (' + x.pct + ' % de aciertos, ' + x.n + ' alumnos)' : ' (sin capturar)')).join('; ') + '</p>' +
        uniq([].concat.apply([], R.exam.map(x => (x.debiles || []).map(d => d.titulo + ' ' + d.p + ' %')))).map(t => '<span class="chip warn">' + esc(t) + '</span> ').join('') : '') +
      (R.ent.promEx != null && !R.exam.length ? '<p class="small">Promedio de exámenes capturados en el periodo: ' + R.ent.promEx + '.</p>' : ''));
    // asistencia y entregas
    h += '<div class="grid2">' + card('<h3>🗓️ Asistencia</h3><p class="small">Asistencia del grupo: <b>' + pctTxt(R.asis.pct) + '</b> en ' + diasTxt(R.asis.dias) + ' con lista · ' + nTxt(R.asis.retardos, 'retardo', 'retardos') + ' · ' + nTxt(R.asis.just, 'justificada', 'justificadas') + '.</p>' +
        (R.asis.semanas.length ? '<div class="cte-sem">' + R.asis.semanas.map(w => '<div><span style="height:' + (w.pct || 0) + '%"></span><small>' + esc(u.fDM(w.lun)) + '<br>' + pctTxt(w.pct) + '</small></div>').join('') + '</div>' : '') +
        (R.asis.bajo.length ? '<p class="small mt"><b>Con 3 o más faltas o menos de ' + (Number(D.cfg().minAsis) || 80) + ' %:</b> ' + esc(R.asis.bajo.map(x => corto(x.a.nombre) + ' (' + x.f + ')').join(', ')) + '</p>' : '<p class="small mt">Nadie con 3 o más faltas en el periodo.</p>')) +
      card('<h3>📝 Entregas</h3><ul class="small"><li>Trabajos entregados: <b>' + pctTxt(R.ent.pct) + '</b> (' + R.ent.trab + ' actividades; promedio ' + (R.ent.prom == null ? '—' : R.ent.prom) + ')</li>' +
        '<li>Tareas de libreta: ' + R.lib.tareas + (R.lib.tareas ? ' · revisadas ' + pctTxt(R.lib.revisadas) + ' · completas ' + pctTxt(R.lib.completas) : '') + '</li>' +
        (R.fc.n ? '<li>Prácticas de FreeCAD revisadas: ' + R.fc.n + ' (' + pct(R.fc.ok, R.fc.n) + ' % completas)</li>' : '') +
        '<li>Entregas tarde recibidas: ' + R.ent.tarde + '</li>' +
        (R.pj ? '<li>Proyecto «' + esc(R.pj.nombre) + '»: ' + R.pj.ok + ' de ' + R.pj.eqs.length + ' equipos al día' + (R.pj.atr.length ? ' · atrasados: ' + esc(R.pj.atr.map(x => x.eq.nombre).join(', ')) : '') + '</li>' : '') + '</ul>') + '</div>';
    // alumnos que requieren atención
    h += card('<h3>🚦 Alumnos que requieren atención</h3><p class="muted small">Señales de alerta temprana del periodo: <b>A</b> 2 o más faltas · <b>B</b> semáforo en rojo · <b>C</b> 3 o más observaciones negativas (se distrajo, sin material, día muy malo). También aparecen quienes deben 2 o más trabajos y quienes están en seguimiento de tutoría.</p>' +
      (R.riesgo.length ? '<div class="tbl-wrap"><table class="tbl cte-t cte-rk"><thead><tr>' + RCAB.map(c => '<th>' + c + '</th>').join('') + '</tr></thead><tbody>' + riesgoFilas(R).map((r, i) => '<tr>' + r.map((c, j) => '<td>' + (j === 1 ? '<a href="#/alumno/' + R.riesgo[i].a.id + '">' + esc(c) + '</a>' : esc(c)) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>' +
        '<p class="muted small">* Promedio de su diagnóstico (todavía sin calificaciones del parcial).</p>' : '<p class="small">Nadie con señales de alerta en el periodo. 🎉</p>'));
    // logros, estrategias y tutoría
    h += '<div class="grid2">' + card('<h3>⭐ Logros del grupo</h3><ul class="small">' + logrosTxt(R).map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>') +
      card('<h3>🧰 Lo que hice con el grupo</h3><ul class="small">' + hiceTxt(R).map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' + (R.tut ? '<h4 class="mt">Tutoría</h4><ul class="small">' + tutTxt(R).map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '')) + '</div>';
    // propuestas, acuerdos y fechas
    h += card('<h3>💡 Propuestas</h3><ul>' + R.propuestas.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><p class="muted small">Salen solas de tus datos; edítalas o complétalas abajo.</p>');
    h += card('<h3>🤝 Acuerdos y notas de la sesión</h3>' + CAMPOS.map(c => '<label class="fld"><span>' + esc(c[1]) + '</span><textarea rows="3" data-ch="cte-nota" data-f="' + f + '" data-k="' + c[0] + '" placeholder="' + esc(c[2]) + '">' + esc(nt[c[0]] || '') + '</textarea></label>').join('') +
      '<p class="muted small">Se guardan para este grupo y esta sesión, y salen en la hoja impresa y en lo que proyectas.</p>');
    h += card('<h3>📅 Próximas fechas</h3>' + (R.fechas.length ? '<ul class="small">' + R.fechas.map(x => '<li><b>' + esc(u.cap(u.fLarga(x.f))) + ':</b> ' + esc(x.t) + '</li>').join('') + '</ul>' : '<p class="muted small">Sin fechas próximas registradas.</p>'));
    h += '<p class="muted small">Solo datos escolares que ya registras en Escuadra (lista, calificaciones, libreta, Clases, proyecto, observaciones, estrategias y tutoría); no incluye notas de tutoría ni datos personales. Señales de alerta: SEP-SEMS (2014), <i>Yo no abandono</i>, manual de alerta temprana.</p>';
    return { t: 'Consejo técnico', h: h };
  };
  // anon: al proyectar sin nombres, cuántos alumnos (y número de lista donde importa quién)
  function logrosTxt(R, anon) {
    const L = R.logros, out = [], nom = (arr, n) => anon ? arr.length + (arr.length === 1 ? ' alumno' : ' alumnos') : lista(arr.map(a => corto(a.nombre)), n);
    if (L.subieron.length) out.push('Subieron de nivel en el semáforo: ' + nom(L.subieron, 6) + '.');
    if (L.perfecta.length) out.push(L.perfecta.length + (L.perfecta.length === 1 ? ' alumno' : ' alumnos') + ' sin faltas en el periodo.');
    if (L.reconocidos.length) out.push('Reconocí el esfuerzo de ' + nom(L.reconocidos, 6) + '.');
    if (L.destacados.length) out.push('Destacados en clase: ' + nom(L.destacados.map(x => x.a), 5) + '.');
    if (L.participan.length) out.push('Más participación: ' + L.participan.map(x => (anon ? 'No. ' + x.a.num : corto(x.a.nombre)) + ' (' + x.n + ')').join(', ') + '.');
    if (L.equiposAlDia.length) out.push('Equipos con el proyecto al día: ' + lista(L.equiposAlDia, 6) + '.');
    if (R.asis.pct != null && R.asis.pct >= 90) out.push('Asistencia del grupo de ' + R.asis.pct + ' %.');
    if (!out.length) out.push('Todavía sin registros de logros en el periodo (semáforo, reconocimientos u observaciones).');
    return out;
  }
  function hiceTxt(R) {
    const Hc = R.hice, out = [];
    if (Hc.dinamicas.length) out.push('Dinámicas: ' + lista(uniq(Hc.dinamicas.map(x => x.t)), 5) + '.');
    if (Hc.apoyos.length) out.push('Estrategias de apoyo: ' + Hc.apoyos.map(x => x.t + ' (' + x.n + ')').join('; ') + '.');
    if (Hc.retro) out.push(Hc.retro + (Hc.retro === 1 ? ' retroalimentación individual' : ' retroalimentaciones individuales') + '.');
    if (Hc.reconocimientos) out.push(Hc.reconocimientos + (Hc.reconocimientos === 1 ? ' reconocimiento' : ' reconocimientos') + ' de esfuerzo.');
    if (Hc.temas) out.push(Hc.temas + ' temas proyectados.');
    if (Hc.cierres) out.push(Hc.cierres + ' cierres del día registrados.');
    if (Hc.evidencias) out.push(Hc.evidencias + ' fotos de evidencias de trabajos.');
    if (R.fc.n) out.push(R.fc.n + ' revisiones de prácticas de FreeCAD.');
    if (Hc.bitacora) out.push(Hc.bitacora + ' notas en la bitácora.');
    if (!out.length) out.push('Sin registros de estrategias en el periodo.');
    return out;
  }
  function tutTxt(R) {
    const T = R.tut, out = []; if (!T) return out;
    out.push(T.seg + ' en seguimiento · ' + T.can + ' canalizados.');
    if (T.hechas.length) out.push('Acciones hechas: ' + lista(T.hechas, 4) + '.');
    if (T.prox.length) out.push('Próximas: ' + T.prox.map(x => fT(x.f) + ' ' + x.t).join('; ') + '.');
    return out;
  }

  /* ---------- impresión ---------- */
  CT.hoja = (g, f) => {
    const R = CT.datos(g, f), per = R.per, nt = CT.notas(g, f), P = E.print, cfg = D.cfg();
    const sec = t => '<div class="cte-pt">' + esc(t) + '</div>';
    const tabla = (cab, filas, cls) => '<table class="grid ' + (cls || '') + '"><thead><tr>' + cab.map(c => '<th>' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + filas.map(r => '<tr>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
    const ul = arr => '<ul class="cte-ul">' + arr.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
    let h = '<div class="pr cte-pr">' + (P.head ? P.head(g, 'REPORTE DEL GRUPO PARA EL CONSEJO TÉCNICO ESCOLAR', 'SESIÓN: ' + u.fLargaA(f).toUpperCase()) : '<div class="p-title">REPORTE PARA EL CONSEJO TÉCNICO · ' + esc(g.nombre) + '</div>');
    h += '<p class="tiny">' + esc(smTxt(R)) + ' · Docente: ' + esc(cfg.docente) + ' · Periodo: del ' + esc(u.fLarga(per.desde)) + ' al ' + esc(u.fLargaA(per.f)) + (per.futuro ? ' (datos al ' + esc(u.fLarga(per.corte)) + ')' : '') + ' · Alumnos: ' + R.al.length + '</p>';
    if (per.sinDatos) return h + '<p>El periodo todavía no empieza para este grupo.</p></div>';
    h += sec('1. Indicadores del periodo') + tabla(kpis(R).map(k => k[0]), [kpis(R).map(k => k[1] + (k[2] ? ' · ' + k[2] : ''))], 'cte-kp');
    h += sec('2. Avance del programa') + (R.av.length ? tabla(['Parcial', 'Horas dadas / del parcial', 'En el periodo', 'Clases perdidas', 'Actividades clave trabajadas'], R.av.map(av => [av.p.nombre + (av.sm ? ' · SM' + av.sm.num : ''), av.hParcial + ' / ' + av.cal + ' h (' + (pct(av.hParcial, av.cal) || 0) + ' %)', av.hDadas + ' h', av.nPerd ? av.nPerd + ' (' + av.hPerd + ' h)' : '0', av.acs.join('; ') || '—'])) +
      ul(R.av.filter(av => av.temas.length).map(av => 'Temas (' + av.p.nombre + '): ' + lista(av.temas, 10) + '.').concat(R.av.filter(av => av.faltan > 0 && !av.flujo).map(av => 'Con los días que quedan del ' + av.p.nombre + ' faltan ' + av.faltan + ' h de la secuencia.'))) : '<p class="tiny">Sin secuencia de clases en el periodo.</p>');
    h += sec('3. Aprovechamiento') + (R.cal.length ? tabla(['Parcial', 'Promedio', 'Aprobando', 'Menos de ' + (Number(cfg.minAprob) || 60), 'Sin calificación', 'Alumnos por debajo'], R.cal.map(c => [c.p.nombre + (c.enCurso ? ' (en curso)' : ''), c.prom == null ? '—' : String(c.prom), String(c.aprob), String(c.reprob.length), String(c.sin), lista(c.reprob.map(r => corto(r.a.nombre) + ' ' + r.k.final), 8) || '—'])) : '') +
      ul([].concat(R.sem ? ['Semáforo (' + R.sem.p.nombre + '): rojo ' + R.sem.cnt.mal + ', amarillo ' + R.sem.cnt.reg + ', verde ' + R.sem.cnt.bien + semNota(R) + (R.sem.conInicio ? '; en el periodo subieron de nivel ' + R.sem.subieron.length + ' y bajaron ' + R.sem.bajaron.length : '') + '.'] : [],
        R.exam.map(x => x.ex.titulo + (x.pct != null ? ': ' + x.pct + ' % de aciertos (' + x.n + ' alumnos)' + (x.debiles.length ? '; temas a reforzar: ' + x.debiles.map(d => d.titulo + ' ' + d.p + ' %').join(', ') : '') : ': sin capturar') + '.')));
    h += sec('4. Asistencia y entregas') + ul(['Asistencia del grupo: ' + pctTxt(R.asis.pct) + ' en ' + diasTxt(R.asis.dias) + ' con lista; ' + nTxt(R.asis.retardos, 'retardo', 'retardos') + ' y ' + nTxt(R.asis.just, 'justificada', 'justificadas') + '.' + (R.asis.semanas.length ? ' Por semana: ' + R.asis.semanas.map(w => u.fDM(w.lun) + ' ' + pctTxt(w.pct)).join(', ') + '.' : ''),
      R.asis.bajo.length ? 'Con 3 o más faltas o baja asistencia: ' + R.asis.bajo.map(x => corto(x.a.nombre) + ' (' + x.f + ' faltas)').join(', ') + '.' : 'Nadie con 3 o más faltas en el periodo.',
      'Trabajos entregados: ' + pctTxt(R.ent.pct) + ' de ' + R.ent.trab + ' actividades (promedio ' + (R.ent.prom == null ? '—' : R.ent.prom) + '); tareas de libreta: ' + R.lib.tareas + (R.lib.tareas ? ', revisadas ' + pctTxt(R.lib.revisadas) + ', completas ' + pctTxt(R.lib.completas) : '') + '; entregas tarde: ' + R.ent.tarde + '.']
      .concat(R.fc.n ? ['Prácticas de FreeCAD revisadas: ' + R.fc.n + ' (' + pct(R.fc.ok, R.fc.n) + ' % completas).'] : []).concat(R.pj ? ['Proyecto «' + R.pj.nombre + '»: ' + R.pj.ok + ' de ' + R.pj.eqs.length + ' equipos al día' + (R.pj.atr.length ? '; atrasados: ' + R.pj.atr.map(x => x.eq.nombre).join(', ') : '') + '.'] : []));
    h += sec('5. Alumnos que requieren atención (alerta temprana: A asistencia · B rendimiento · C conducta)') + (R.riesgo.length ? tabla(RCAB, riesgoFilas(R), 'cte-rt') : '<p class="tiny">Nadie con señales de alerta en el periodo.</p>');
    h += sec('6. Logros del grupo') + ul(logrosTxt(R));
    h += sec('7. Estrategias aplicadas') + ul(hiceTxt(R).concat(R.tut ? tutTxt(R).map(x => 'Tutoría: ' + x) : []));
    h += sec('8. Propuestas') + ul(R.propuestas);
    h += sec('9. Acuerdos y notas de la sesión') + CAMPOS.map(c => '<div class="cte-campo"><b>' + esc(c[1]) + ':</b> ' + (nt[c[0]] ? esc(nt[c[0]]).replace(/\n/g, '<br>') : '<span class="cte-lin"></span><span class="cte-lin"></span>') + '</div>').join('');
    h += sec('10. Próximas fechas') + (R.fechas.length ? ul(R.fechas.map(x => u.cap(u.fLarga(x.f)) + ': ' + x.t)) : '<p class="tiny">Sin fechas próximas.</p>');
    h += (P.firma ? P.firma() : '') + '<p class="tiny c">Elaborado con Escuadra con los registros del docente. Solo datos escolares.</p></div>';
    return h;
  };
  A['cte-print'] = el => { const g = D.grupoActual(); E.print.run(CT.hoja(g, el.dataset.f), { title: 'Consejo técnico ' + g.nombre + ' ' + el.dataset.f, margin: '10mm' }); };
  A['cte-print-all'] = el => { const gs = D.gruposActivos().filter(g => D.alumnos(g).length); E.print.run(gs.map(g => CT.hoja(g, el.dataset.f)).join('<div class="cte-salto"></div>'), { title: 'Consejo técnico ' + el.dataset.f, margin: '10mm' }); };

  /* ---------- proyector ---------- */
  CT.slides = (g, f, anon) => {
    const R = CT.datos(g, f), per = R.per, nt = CT.notas(g, f), s = [];
    s.push({ k: 'cover', sub: 'Consejo técnico · ' + u.fLargaA(f), h: g.nombre, p: smTxt(R) + ' · del ' + u.fLarga(per.desde) + ' al ' + u.fLarga(per.f) });
    if (per.sinDatos) return s;
    s.push({ k: 'html', h: 'Indicadores del periodo', html: '<div class="cte-kpis pj">' + kpis(R).map(k => '<div class="cte-k ' + k[3] + '"><span>' + esc(k[0]) + '</span><b>' + esc(k[1]) + '</b><small>' + esc(k[2]) + '</small></div>').join('') + '</div>' });
    if (R.av.length) s.push({ k: 'html', h: 'Avance del programa', html: R.av.map(av => '<div class="cte-pav"><div class="cte-pav-t"><b>' + esc(av.p.nombre) + (av.sm ? ' · Submódulo ' + esc(av.sm.num) : '') + '</b><span>' + av.hParcial + ' de ' + av.cal + ' h</span></div><div class="cte-pbar"><span style="width:' + Math.min(100, av.cal ? av.hParcial / av.cal * 100 : 0) + '%"></span></div>' +
      (av.acs.length ? '<p>' + esc(av.acs.join(' · ')) + '</p>' : '') + (av.nPerd ? '<p class="cte-pm">' + av.nPerd + (av.nPerd === 1 ? ' clase perdida' : ' clases perdidas') + ' en el periodo</p>' : '') + '</div>').join('') });
    if (R.cal.length || R.sem) s.push({ k: 'html', h: 'Aprovechamiento', html: (R.cal.length ? '<table class="cte-pt"><thead><tr><th>Parcial</th><th>Promedio</th><th>Aprobando</th><th>Por debajo</th></tr></thead><tbody>' + R.cal.map(c => '<tr><td>' + esc(c.p.nombre) + '</td><td>' + (c.prom == null ? '—' : c.prom) + '</td><td>' + c.aprob + '</td><td>' + c.reprob.length + '</td></tr>').join('') + '</tbody></table>' : '') +
      (R.sem ? '<div class="cte-semf"><span class="r" style="flex:' + (R.sem.cnt.mal || 0.0001) + '">🔴 ' + R.sem.cnt.mal + '</span><span class="y" style="flex:' + (R.sem.cnt.reg || 0.0001) + '">🟡 ' + R.sem.cnt.reg + '</span><span class="v" style="flex:' + (R.sem.cnt.bien || 0.0001) + '">🟢 ' + R.sem.cnt.bien + '</span></div>' : '') +
      (R.exam.some(x => x.debiles && x.debiles.length) ? '<p class="cte-pm">Temas a reforzar: ' + esc(uniq([].concat.apply([], R.exam.map(x => (x.debiles || []).map(d => d.titulo)))).slice(0, 4).join(' · ')) + '</p>' : '') });
    s.push({ k: 'html', h: 'Asistencia y entregas', html: '<div class="cte-pcols"><div><div class="cte-big">' + pctTxt(R.asis.pct) + '</div><p>asistencia del grupo</p>' + (R.asis.semanas.length ? '<div class="cte-sem pj">' + R.asis.semanas.map(w => '<div><span style="height:' + (w.pct || 0) + '%"></span><small>' + esc(u.fDM(w.lun)) + '<br>' + pctTxt(w.pct) + '</small></div>').join('') + '</div>' : '') + '</div>' +
      '<div><div class="cte-big">' + pctTxt(R.ent.pct) + '</div><p>trabajos entregados</p>' + (R.ent.trab ? '<p class="cte-pm">' + nTxt(R.ent.trab, 'actividad calificable', 'actividades calificables') + (R.ent.prom != null ? ' · promedio ' + R.ent.prom : '') + '</p>' : '') +
      (R.lib.tareas && R.lib.completas != null ? '<p class="cte-pm">Libreta: ' + R.lib.completas + ' % de las tareas revisadas, completas</p>' : '') + (R.pj ? '<p class="cte-pm">Proyecto: ' + R.pj.ok + ' de ' + R.pj.eqs.length + ' equipos al día</p>' : '') + (R.fc.n ? '<p class="cte-pm">FreeCAD: ' + R.fc.n + ' prácticas revisadas</p>' : '') + '</div></div>' });
    s.push({ k: 'html', h: 'Alumnos que requieren atención', html: R.riesgo.length ? '<table class="cte-pt sm"><thead><tr><th>' + (anon ? 'No.' : 'Alumno') + '</th><th>Señal</th><th>Faltas</th><th>Prom.</th><th>Pend.</th><th>Qué propongo</th></tr></thead><tbody>' +
      R.riesgo.slice(0, 10).map(x => '<tr><td>' + esc(anon ? 'No. ' + x.a.num : corto(x.a.nombre)) + '</td><td>' + ((x.sA ? 'A' : '') + (x.sB ? 'B' : '') + (x.sC ? 'C' : '') || '—') + '</td><td>' + x.F + '</td><td>' + (x.sem && x.sem.v != null ? Math.round(x.sem.v) : '—') + '</td><td>' + (x.pend || 0) + '</td><td>' + esc(x.sug.join('. ')) + '</td></tr>').join('') + '</tbody></table>' +
      (R.riesgo.length > 10 ? '<p class="cte-pm">y ' + (R.riesgo.length - 10) + ' más en el reporte impreso</p>' : '') + '<p class="cte-pm">A asistencia · B rendimiento · C conducta</p>' : '<p class="pj-vida">Nadie con señales de alerta en el periodo. 🎉</p>' });
    // listas con letra un poco menor que la de clase: aquí los renglones son largos
    const lst = (h, items) => ({ k: 'html', h: h, html: '<ul class="pj-list cte-pl">' + items.map(x => '<li>' + x + '</li>').join('') + '</ul>' });
    s.push(lst('Logros del grupo', logrosTxt(R, anon).map(esc)));
    s.push(lst('Lo que hice con el grupo', hiceTxt(R).concat(R.tut ? tutTxt(R).map(x => 'Tutoría: ' + x) : []).slice(0, 7).map(esc)));
    s.push(lst('Propuestas', (anon ? R.propuestasAnon : R.propuestas).slice(0, 6).map(esc)));
    const ac = CAMPOS.filter(c => nt[c[0]]);
    if (ac.length) s.push(lst('Acuerdos y compromisos', ac.map(c => '<b>' + esc(c[1]) + ':</b> ' + esc(nt[c[0]]).replace(/\n/g, '<br>'))));
    if (R.fechas.length) s.push(lst('Próximas fechas', R.fechas.slice(0, 8).map(x => '<b>' + esc(u.cap(u.fLarga(x.f))) + ':</b> ' + esc(x.t))));
    return s;
  };
  A['cte-proj'] = el => { const g = D.grupoActual(); E.proj.abrir({ id: 'cte-' + g.id, titulo: 'Consejo técnico · ' + g.nombre }, CT.slides(g, el.dataset.f, !!E.ui.cteAnon)); };

  /* ---------- cambios ---------- */
  CH['cte-fecha'] = el => { const v = el.value; if (!v) return; S.update(KF, d => { delete d[el.dataset.mes]; d[v.slice(0, 7)] = v; }, {}); location.hash = '#/consejo/' + v; };
  CH['cte-nota'] = el => { const g = D.grupoActual(); S.update(KN(g, el.dataset.f), d => { d[el.dataset.k] = el.value; }, {}); };
  CH['cte-anon'] = el => { E.ui.cteAnon = el.checked; };
  A['cte-grupo'] = el => { if (E.grupos && E.grupos.usar) E.grupos.usar(el.dataset.gid, true); else { D.setGrupo(el.dataset.gid); E.render(); } };

  /* ---------- aviso en Inicio la semana del consejo ---------- */
  CT.inicioHTML = hoy => {
    const f = CT.actual(hoy); if (!f) return ''; const d = u.diffDays(hoy, f); if (d < 0 || d > 7) return '';
    const gs = D.gruposActivos().filter(g => D.alumnos(g).length);
    return card('<h3>🏛️ ' + (d === 0 ? 'Hoy es consejo técnico' : 'Consejo técnico el ' + esc(u.fLarga(f))) + '</h3><p class="small">' + (gs.length > 1 ? 'Tus reportes de ' + esc(lista(gs.map(g => g.nombre), 6).replace(/, ([^,]*)$/, ' y $1')) + ' ya están listos' : 'Tu reporte de ' + esc(gs.length ? gs[0].nombre : 'tu grupo') + ' ya está listo') + ' con los datos del mes: avance, aprovechamiento, asistencia, alumnos que requieren atención y propuestas. Agrega tus acuerdos ahí mismo.</p>' +
      link('Abrir el reporte', 'consejo/' + f, 'small primary'), 'accent');
  };
})();
