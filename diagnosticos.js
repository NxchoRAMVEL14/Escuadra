/* Escuadra · Cuestionarios diagnósticos (v1.29.1).
   Toda clase cuyo guion diga «examen diagnóstico» o «cuestionario diagnóstico» trae aquí sus preguntas (10 a 15),
   listas para imprimir (una hoja por alumno con su nombre, o en blanco), proyectar (una pregunta por diapositiva,
   con la respuesta al tocar) y su clave. Los que tienen preguntas escritas a mano van en SETS; los demás se arman
   solos con el Banco de preguntas (opción múltiple y verdadero/falso de nivel 1 y 2) o, si no hay, con las preguntas
   de los temas del parcial. Un diagnóstico no cuenta para la calificación: solo dice de dónde parten. */
(function () {
  'use strict';
  const E = window.E, D = E.data, S = E.store, u = E.u, H = E.h, A = E.actions, esc = u.esc, btn = H.btn;
  const DG = E.diag = {};

  // om: la primera opción es la correcta (al imprimir se revuelven siempre igual); vf: v = verdadero o falso
  const SETS = {
    encuadre3: { titulo: 'Diagnóstico: fluidos, Pascal y circuitos', preguntas: [
      { tipo: 'om', q: '¿Qué es la presión?', op: ['La fuerza que se aplica sobre cada unidad de área', 'La cantidad de líquido que cabe en un recipiente', 'La velocidad con la que corre un fluido', 'El peso de un objeto'], exp: 'Presión = fuerza repartida en un área.' },
      { tipo: 'om', q: '¿Cuál es la fórmula de la presión?', op: ['P = F / A', 'P = F × A', 'P = A / F', 'P = m × a'], exp: 'Fuerza entre área: a más área, menos presión con la misma fuerza.' },
      { tipo: 'om', q: '¿En qué unidad del Sistema Internacional se mide la presión?', op: ['Pascal (Pa)', 'Newton (N)', 'Joule (J)', 'Watt (W)'], exp: '1 Pa = 1 N/m². En el taller también se usan bar y psi.' },
      { tipo: 'vf', q: 'Los líquidos casi no se pueden comprimir; el aire sí.', v: true, exp: 'Por eso la hidráulica es firme y la neumática es «esponjosa».' },
      { tipo: 'om', q: '¿Qué dice el principio de Pascal?', op: ['La presión aplicada a un líquido encerrado se transmite igual en todas direcciones', 'Todo cuerpo sumergido recibe un empuje hacia arriba', 'Un gas pierde presión cuando se calienta', 'El agua siempre sube por los tubos más delgados'], exp: 'Es la base de prensas, gatos y frenos hidráulicos.' },
      { tipo: 'om', q: '¿Cuál de estas máquinas funciona con el principio de Pascal?', op: ['El gato hidráulico de un taller mecánico', 'Una bicicleta', 'Un ventilador de techo', 'Una polea simple'], exp: 'El gato multiplica la fuerza con dos émbolos de distinto tamaño.' },
      { tipo: 'om', q: 'Conectas una jeringa chica y una grande con una manguera llena de agua. Si empujas la chica, la grande…', op: ['Sale con más fuerza pero avanza menos', 'Sale con menos fuerza y avanza más', 'No se mueve', 'Sale con la misma fuerza y avanza lo mismo'], exp: 'Ganas fuerza a cambio de recorrido.' },
      { tipo: 'om', q: 'Si en la manguera de tus jeringas queda una burbuja de aire, la jeringa de salida…', op: ['Responde tarde y se siente «esponjosa»', 'Se mueve más rápido', 'Hace más fuerza', 'Funciona igual'], exp: 'El aire se comprime antes de empujar: hay que purgarlo.' },
      { tipo: 'om', q: '¿Cuál es la diferencia principal entre neumática e hidráulica?', op: ['La neumática usa aire y la hidráulica usa un líquido', 'La neumática usa electricidad y la hidráulica usa aire', 'Son lo mismo con distinto nombre', 'La hidráulica solo funciona con agua de la llave'], exp: 'Neumática: aire comprimido. Hidráulica: aceite (o agua en el proyecto).' },
      { tipo: 'om', q: '¿Qué necesita un circuito para que circule la corriente?', op: ['Un camino cerrado de la fuente a la carga y de regreso', 'Solo una pila', 'Un cable conectado a un solo polo de la pila', 'Un interruptor abierto'], exp: 'Sin camino cerrado no hay corriente.' },
      { tipo: 'om', q: '¿Cómo se escribe la ley de Ohm?', op: ['V = I × R', 'V = I / R', 'I = V × R', 'R = V × I'], exp: 'Voltaje = corriente × resistencia.' },
      { tipo: 'om', q: '¿En qué unidad se mide la corriente eléctrica?', op: ['Ampere (A)', 'Volt (V)', 'Ohm (Ω)', 'Watt (W)'], exp: 'El volt mide voltaje y el ohm, resistencia.' },
      { tipo: 'om', q: 'Dos pilas AA de 1.5 V conectadas en serie dan…', op: ['3 V', '1.5 V', '0.75 V', '6 V'], exp: 'En serie los voltajes se suman.' },
      { tipo: 'om', q: '¿Cómo cambias el sentido de giro de un motor de corriente directa?', op: ['Invirtiendo la polaridad (cambiando + y −)', 'Subiendo el voltaje', 'Poniéndole una resistencia', 'No se puede cambiar'], exp: 'Por eso el proyecto usa un interruptor DPDT o un puente H.' },
      { tipo: 'vf', q: 'Un interruptor abierto deja pasar la corriente.', v: false, exp: 'Abierto = circuito cortado; cerrado = pasa la corriente.' }
    ] },
    // 2º parcial: qué traen del Submódulo 1 (dibujo y FreeCAD)
    encuadre: { titulo: 'Diagnóstico: dibujo técnico y FreeCAD', temas: ['sm1-planos', 'sm1-restricciones'] }
  };

  const RX = /(examen|cuestionario)\s+diagn[oó]stico/i;
  DG.es = it => !!it && (RX.test(it.t || '') || RX.test(it.ev || '') || (it.pasos || []).some(p => RX.test(String(p[1] || ''))));

  // revuelve las opciones siempre igual para la misma pregunta (la clave y la pantalla coinciden con la hoja)
  const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const revuelve = (q, sem) => {
    if (q.tipo !== 'om') return q;
    const idx = q.op.map((o, i) => i); let h = hash(sem + '|' + q.q);
    for (let i = idx.length - 1; i > 0; i--) { h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0; const j = h % (i + 1); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    return Object.assign({}, q, { ops: idx.map(i => q.op[i]), ok: idx.indexOf(0) });
  };
  // del banco: opción múltiple y verdadero/falso de nivel 1-2 (sin problemas con cálculo), repartidas entre los temas
  const delBanco = temas => {
    const por = temas.map(t => (E.BANCO || []).filter(b => b.tema === t && (b.tipo === 'om' || b.tipo === 'vf') && (b.niv || 1) <= 2));
    const out = []; for (let r = 0; out.length < 15 && por.some(l => l[r]); r++) por.forEach(l => { if (l[r] && out.length < 15) out.push({ tipo: l[r].tipo, q: l[r].q, op: l[r].op, v: l[r].v, exp: l[r].exp }); });
    return out;
  };
  // de las preguntas de los temas (abiertas, con respuesta modelo)
  const deTemas = temas => {
    const por = temas.map(id => { const t = (E.TEMAS || []).find(x => x.id === id); return t ? (t.preguntas || []) : []; });
    const out = []; for (let r = 0; out.length < 12 && por.some(l => l[r]); r++) por.forEach(l => { if (l[r] && out.length < 12) out.push({ tipo: 'ab', q: l[r][0], exp: l[r][1] }); });
    return out;
  };
  // temas del parcial donde está la clase
  const temasDe = (g, pid) => { const seq = E.clases && E.clases.seq ? E.clases.seq(g, pid) : []; const ids = []; seq.forEach(x => { if (x.tema && ids.indexOf(x.tema) < 0) ids.push(x.tema); }); return ids; };

  DG.de = (g, pid, it) => {
    const s = SETS[it.id]; let titulo = (s && s.titulo) || ('Diagnóstico: ' + String(it.t || '').replace(/^.*?(examen|cuestionario)\s+diagn[oó]stico\s*(de|del)?\s*/i, '').replace(/^Encuadre[^y]*y\s*/i, '') || it.t), qs = [];
    if (s && s.preguntas) qs = s.preguntas;
    else { const ts = (s && s.temas) || temasDe(g, pid); qs = delBanco(ts); if (qs.length < 10) qs = qs.concat(deTemas(ts)).slice(0, 15); }
    if (/^Diagnóstico:\s*$/.test(titulo) || titulo === 'Diagnóstico: ') titulo = 'Cuestionario diagnóstico';
    return { id: it.id, titulo: titulo, qs: qs.map(q => revuelve(q, it.id)) };
  };

  /* ---------- hoja para imprimir ---------- */
  const CSS = '<style>.dg{font:9pt/1.25 Arial,Helvetica,sans-serif;color:#000;page-break-after:always}.dg:last-child{page-break-after:auto}.dg h1{font-size:13pt;text-align:center;margin:0 0 1mm}.dg .sub{text-align:center;font-size:9pt;margin:0 0 2.5mm}' +
    '.dg .dat{display:flex;gap:5mm;align-items:flex-end;margin-bottom:2mm}.dg .dat .n{flex:1}.dg .nom{border-bottom:1px solid #000;font-weight:bold;min-height:5mm;padding:0 1mm}.dg .fl{border-bottom:1px solid #000;display:inline-block;min-width:24mm}' +
    '.dg .ins{border:1px solid #999;border-radius:1.5mm;padding:1.5mm 3mm;font-size:8.5pt;margin-bottom:2.5mm}.dg ol.qs{margin:0;padding-left:6mm;columns:2;column-gap:7mm}.dg ol.qs>li{break-inside:avoid;margin:0 0 1.8mm}' +
    '.dg .op{display:block;margin:.3mm 0 0 1mm}.dg .op i{display:inline-block;width:3.4mm;height:3.4mm;border:1px solid #000;border-radius:50%;vertical-align:-.7mm;margin-right:1.4mm}.dg .vf{display:block;margin-top:.6mm}.dg .vf i{display:inline-block;width:3.4mm;height:3.4mm;border:1px solid #000;vertical-align:-.7mm;margin:0 1mm 0 3mm}' +
    '.dg .ab{display:block;border-bottom:1px solid #777;height:6mm}.dg .ab+.ab{height:6mm}.dg.clave li{margin-bottom:1.6mm}.dg.clave .k{font-weight:bold}.dg .pie{font-size:7.5pt;color:#444;margin-top:2mm}</style>';
  const pregHTML = (q, conResp) => {
    if (q.tipo === 'om') return esc(q.q) + q.ops.map((o, i) => '<span class="op"' + (conResp && i === q.ok ? ' style="font-weight:bold"' : '') + '><i></i>' + 'ABCD'[i] + ') ' + esc(o) + '</span>').join('');
    if (q.tipo === 'vf') return esc(q.q) + '<span class="vf"><i></i>Verdadero<i></i>Falso</span>';
    return esc(q.q) + '<span class="ab"></span><span class="ab"></span>';
  };
  DG.hoja = (g, dg, nombre) => {
    const cf = D.cfg();
    return '<div class="dg"><h1>' + esc(dg.titulo) + '</h1><p class="sub">' + esc(cf.plantel || '') + ' · ' + esc(g.carrera || '') + ' · Grupo ' + esc(g.nombre) + ' · ' + esc(cf.docente || '') + '</p>' +
      '<div class="dat"><div class="n"><b>Nombre:</b><div class="nom">' + esc(nombre || '') + '</div></div><div><b>Fecha:</b> <span class="fl"></span></div><div><b>Aciertos:</b> <span class="fl" style="min-width:12mm"></span> / ' + dg.qs.length + '</div></div>' +
      '<div class="ins"><b>Instrucciones:</b> contesta con lo que sabes, sin consultar. No cuenta para tu calificación: sirve para saber de dónde partimos. En opción múltiple rellena el círculo de una sola respuesta.</div>' +
      '<ol class="qs">' + dg.qs.map(q => '<li>' + pregHTML(q) + '</li>').join('') + '</ol></div>';
  };
  DG.clave = (g, dg) => '<div class="dg clave"><h1>Clave · ' + esc(dg.titulo) + '</h1><p class="sub">Para el docente · ' + dg.qs.length + ' preguntas · Grupo ' + esc(g.nombre) + '</p><ol>' +
    dg.qs.map(q => '<li>' + esc(q.q) + ' → <span class="k">' + (q.tipo === 'om' ? 'ABCD'[q.ok] + ') ' + esc(q.ops[q.ok]) : q.tipo === 'vf' ? (q.v ? 'Verdadero' : 'Falso') : esc(q.exp || '')) + '</span>' + (q.exp && q.tipo !== 'ab' ? ' <span class="tiny">· ' + esc(q.exp) + '</span>' : '') + '</li>').join('') + '</ol></div>';

  // cada hoja cabe en una carta: si no, se reduce un poco (como las rúbricas)
  const MG = 10, ANCHO = 215.9 - 2 * MG, ALTO = 279.4 - MG - (MG + 19) - 4;
  DG.ajusta = hojas => {
    const box = document.createElement('div'), mm = 96 / 25.4; box.style.cssText = 'position:absolute;left:-10000px;top:0;visibility:hidden;width:' + ANCHO + 'mm';
    box.innerHTML = CSS + hojas.join(''); document.body.appendChild(box);
    try { return [...box.querySelectorAll('.dg')].map(h => { const alto = h.getBoundingClientRect().height / mm; if (alto > ALTO) { const z = Math.max(0.6, Math.floor(ALTO / alto * 1000) / 1000); h.style.zoom = String(z); h.style.width = (ANCHO / z).toFixed(2) + 'mm'; h.dataset.zoom = String(z); } return h.outerHTML; }); }
    finally { box.remove(); }
  };

  /* ---------- proyectar: una pregunta por diapositiva ---------- */
  DG.slides = dg => [{ k: 'cover', sub: 'Cuestionario diagnóstico', h: dg.titulo, p: dg.qs.length + ' preguntas · contesta con lo que sabes · no cuenta para tu calificación' }]
    .concat(dg.qs.map((q, i) => ({ k: 'q', h: 'Pregunta ' + (i + 1) + ' de ' + dg.qs.length, q: q.q, opts: q.tipo === 'om' ? q.ops : q.tipo === 'vf' ? ['Verdadero', 'Falso'] : null, ok: q.tipo === 'om' ? q.ok : q.tipo === 'vf' ? (q.v ? 0 : 1) : null, a: q.exp || '' })));

  /* ---------- en la clase ---------- */
  DG.claseHTML = (g, pid, it) => {
    if (!DG.es(it)) return ''; const dg = DG.de(g, pid, it); if (!dg.qs.length) return '';
    const d = 'data-pid="' + pid + '" data-id="' + it.id + '"', n = D.alumnos(g).length;
    return '<div class="note info small mt"><b>📋 ' + esc(dg.titulo) + '</b> · ' + dg.qs.length + ' preguntas, listo para imprimir o proyectar.<div class="row gap wrap mt">' +
      btn('🖨 Una hoja por alumno' + (n ? ' (' + n + ')' : ''), 'dg-print', d + ' data-q="grupo"' + (n ? '' : ' disabled'), 'small primary') + btn('🖨 En blanco', 'dg-print', d + ' data-q="blanco"', 'small') +
      btn('📽 Proyectar', 'dg-proj', d, 'small') + btn('🔑 Clave', 'dg-print', d + ' data-q="clave"', 'small ghost') + btn('➕ Actividad para anotar aciertos', 'dg-act', d, 'small ghost') + '</div></div>';
  };
  const busca = el => { const g = D.grupoActual(), pid = el.dataset.pid, it = (E.clases.seq(g, pid) || []).find(x => x.id === el.dataset.id); return { g: g, pid: pid, it: it, dg: it ? DG.de(g, pid, it) : null }; };
  A['dg-print'] = el => {
    const x = busca(el); if (!x.dg) return; const q = el.dataset.q;
    const hojas = q === 'clave' ? [DG.clave(x.g, x.dg)] : q === 'grupo' ? D.alumnos(x.g).map(a => DG.hoja(x.g, x.dg, a.nombre)) : [DG.hoja(x.g, x.dg, '')];
    E.print.run(CSS + (q === 'clave' ? hojas.join('') : DG.ajusta(hojas).join('')), { title: (q === 'clave' ? 'Clave · ' : '') + x.dg.titulo + ' · ' + x.g.nombre, margin: MG + 'mm' });
  };
  A['dg-proj'] = el => { const x = busca(el); if (x.dg) E.proj.abrir({ id: 'diag-' + x.it.id, titulo: x.dg.titulo }, DG.slides(x.dg)); };
  A['dg-act'] = el => {
    const x = busca(el); if (!x.dg) return; const ya = S.list('act:' + x.g.id + ':').find(a => a.diag === x.it.id);
    if (ya) { location.hash = '#/actividad/' + ya.id; return; }
    const id = u.uid('act'); S.put('act:' + x.g.id + ':' + id, { id: id, parcial: x.pid, categoria: 'diagnostico', nombre: x.dg.titulo, peso: 1, max: x.dg.qs.length, fecha: u.today(), instrumento: 'Exa', cuenta: false, notas: {}, diag: x.it.id }, {});
    u.toast('Listo: anota los aciertos de cada alumno (de ' + x.dg.qs.length + '). No cuenta para la calificación.', 'ok', 5000); location.hash = '#/actividad/' + id;
  };
})();
