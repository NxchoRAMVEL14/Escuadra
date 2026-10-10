/* Escuadra · Estrategias para subir de nivel: qué hacer con los que van mal, con los regulares y con los que van bien,
   con respaldo de investigación educativa. Forma parejas de tutoría, registra qué apoyo diste a quién
   y muestra si los que recibieron apoyo subieron. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, H = E.h;
  const card = H.card, btn = H.btn, link = H.link, icon = E.icon;
  const SF = E.semaforo;

  /* ---------- fuentes ---------- */
  const EEF = 'https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/';
  const FU = E.FUENTES_EST = {
    fb: ['EEF Teaching and Learning Toolkit · Retroalimentación (+6 meses, evidencia alta; oral +7)', EEF + 'feedback'],
    meta: ['EEF Teaching and Learning Toolkit · Metacognición y autorregulación (+8 meses, evidencia alta)', EEF + 'metacognition-and-self-regulation'],
    par: ['EEF Teaching and Learning Toolkit · Tutoría entre pares (+6 meses, evidencia alta)', EEF + 'peer-tutoring'],
    dom: ['EEF Teaching and Learning Toolkit · Aprendizaje para el dominio (+5 meses, evidencia baja; +3 en secundaria y bachillerato)', EEF + 'mastery-learning'],
    dun: ['Dunlosky y col. (2013). Improving Students’ Learning With Effective Learning Techniques. Psychological Science in the Public Interest', 'https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html'],
    rk: ['Roediger y Karpicke (2006). Test-Enhanced Learning. Psychological Science', 'https://doi.org/10.1111/j.1467-9280.2006.01693.x'],
    ros: ['Rosenshine (2012). Principles of Instruction. American Educator', 'https://www.aft.org/sites/default/files/periodicals/Rosenshine.pdf'],
    dw: ['Mueller y Dweck (1998). Praise for intelligence can undermine children’s motivation and performance', 'https://doi.org/10.1037/0022-3514.75.1.33'],
    sdt: ['Ryan y Deci (2000). Self-determination theory and the facilitation of intrinsic motivation', 'https://doi.org/10.1037/0003-066X.55.1.68']
  };

  /* ---------- catálogo ---------- */
  // ev: texto corto del respaldo · evc: color del chip (ok = evidencia alta, info = investigación, warn = evidencia baja, '' = práctica docente)
  E.NIV_EST = {
    mal: { t: 'Rescate: de 🔴 a 🟡', d: 'Primero la causa. Luego práctica guiada, retroalimentación en el momento y un compañero que lo acompañe.' },
    reg: { t: 'Empujón: de 🟡 a 🟢', d: 'Ya entienden lo básico: que practiquen recordando, repasen espaciado y sepan qué distingue un trabajo de 10.' },
    bien: { t: 'Mantener y retar 🟢', d: 'Que no se aburran ni se confíen: retos, rol de monitor y reconocimiento del esfuerzo.' }
  };
  const L = E.ESTRATEGIAS = [
    /* ---- 🔴 → 🟡 ---- */
    { id: 'causa', niv: 'mal', ico: '🔎', t: 'Averigua la causa en 2 minutos', ev: 'Práctica docente', evc: '', tiempo: '2 min por alumno',
      que: 'No es lo mismo no entregar, no entender o faltar. Una plática corta y en privado te dice qué apoyo sí le va a servir.',
      pasos: ['Mientras el grupo trabaja, acércate y pregúntale: "¿Qué se te está complicando más: entender, entregar o venir?"', 'Empieza con la razón que ya muestra el semáforo (trabajos sin entregar, examen bajo, faltas).', 'Acuerden una sola acción concreta para esta semana y regístrala aquí como apoyo.', 'Si te cuenta algo fuera de lo académico, canalízalo con tutoría u orientación del plantel y no lo anotes en la app.'] },
    { id: 'tutoria', niv: 'mal', ico: '🤝', t: 'Tutoría entre pares', ev: 'EEF: +6 meses · evidencia alta', evc: 'ok', f: ['par'], tiempo: '10 a 15 min, 2 o 3 veces por semana',
      que: 'Un compañero que va bien (monitor) repasa con él lo que ya viste. Es de lo que más ayuda a quien va atrás, y el monitor también aprende.',
      pasos: ['Forma las parejas con el botón "Parejas de tutoría": va mal con va bien.', 'Entrena a los monitores 5 minutos con la guía (no dar la respuesta, preguntar, dar pistas).', 'Úsala para repasar y practicar lo ya explicado, no para tema nuevo.', 'Sesiones cortas y frecuentes durante 4 a 6 semanas, con las preguntas del tema como guion.'] },
    { id: 'retro', niv: 'mal', ico: '💬', t: 'Retroalimentación oral en el momento', ev: 'EEF: +6 meses · evidencia alta', evc: 'ok', f: ['fb'], tiempo: '1 a 2 min por alumno',
      que: 'Una calificación sola no le dice cómo subir. Dile qué hizo bien, qué corregir y qué hacer ahora, mientras trabaja.',
      pasos: ['Revisa su libreta o práctica en clase, no días después.', 'Usa 1 + 1 + 1: algo que hizo bien, un error concreto y el siguiente paso ("Te faltó contar la bancada como eslabón; vuelve a contar n").', 'Dale 5 minutos para corregir ahí mismo y vuelve a verlo.', 'Habla del trabajo, no de la persona: "este cálculo", no "eres flojo".'] },
    { id: 'ejemplo', niv: 'mal', ico: '🧩', t: 'Ejemplo resuelto y práctica guiada', ev: 'Rosenshine 2012 · respaldo de investigación', evc: 'info', f: ['ros'], tiempo: '15 min',
      que: 'Primero lo ve resuelto paso a paso, luego completa uno a medias y al final hace uno solo. Así no se pierde.',
      pasos: ['Proyecta el ejemplo del tema y resuélvelo en voz alta, diciendo por qué haces cada paso.', 'Dale uno igual con los últimos pasos en blanco para que los complete.', 'Después uno completo él solo; si acierta 4 de 5, ya puede seguir.', 'Pregunta a varios (al azar) para saber quién sí entendió antes de avanzar.'] },
    { id: 'segunda', niv: 'mal', ico: '🔁', t: 'Segunda oportunidad hasta el 80%', ev: 'EEF: +5 meses · evidencia baja', evc: 'warn', f: ['dom'], tiempo: '20 min en la semana',
      que: 'Si reprueba un examen o práctica, corrige sus errores y presenta una versión corta. La meta es dominar el tema, no solo pasar. Funciona mejor junto con trabajo en pareja o equipo.',
      pasos: ['Devuelve el examen marcado y que corrija sus errores con su pareja de tutoría.', 'Aplica una versión corta (3 a 5 preguntas del mismo tema) esa semana.', 'Fija la meta en 80% para seguir; si no llega, otra ronda de práctica guiada.', 'Decide desde el inicio si la nueva nota sustituye o se promedia, y captúrala como actividad nueva.'] },
    { id: 'entrega', niv: 'mal', ico: '📥', t: 'Rescate de entregas pendientes', ev: 'Práctica docente', evc: '', tiempo: '5 min + 10 min de clase',
      que: 'Los ceros por no entregar hunden el promedio más que una nota baja. Acuerden una fecha y lo mínimo que debe tener para contar.',
      pasos: ['Muéstrale en la app qué trabajos le faltan y cuánto le están bajando.', 'Acuerden fecha (esta semana) y qué es lo mínimo aceptable.', 'Dale 10 minutos de la clase para empezarlo frente a ti.', 'Cuando lo entregue, captúralo y reconócelo.'] },
    { id: 'asis', niv: 'mal', ico: '📅', t: 'Seguimiento de faltas', ev: 'Práctica docente', evc: '', tiempo: '5 min',
      que: 'Con faltas seguidas el rezago crece rápido. Avisar pronto y darle lo que se perdió evita que se desconecte.',
      pasos: ['Desde la 2ª o 3ª falta seguida, avisa a prefectura o al tutor del grupo.', 'Cuando regrese, dale el guion de la clase que perdió (Clases → ese día) y el video del tema.', 'Asígnale un compañero que le pase los apuntes.'] },
    { id: 'pre', niv: 'mal', ico: '⏩', t: 'Adelantarle el tema', ev: 'Práctica docente', evc: '', tiempo: '5 min el día anterior',
      que: 'Si llega con una idea del tema, entiende más rápido y no se queda atrás desde el inicio.',
      pasos: ['En Clases, cada actividad trae "Para adelantar el tema": compártelo con él un día antes.', 'Pídele que vea el video o la animación del tema y traiga una pregunta.', 'En clase hazle a él una primera pregunta fácil: que tenga un acierto temprano.'] },
    /* ---- 🟡 → 🟢 ---- */
    { id: 'quiz', niv: 'reg', ico: '⚡', t: 'Mini examen de 3 preguntas al inicio', ev: 'Dunlosky 2013 · utilidad alta', evc: 'ok', f: ['dun', 'rk'], tiempo: '8 min',
      que: 'Recordar sin ver los apuntes fija lo aprendido mucho más que releer. Va sin calificación o con poco peso: es práctica, no castigo.',
      pasos: ['Al iniciar, 3 preguntas de clases anteriores (usa "Copiar preguntas" del tema o Plickers).', 'Que contesten solos en 3 minutos, sin libreta.', 'Corrijan juntos al momento y que cada quien vea en qué falló.', 'Repítelo cada semana.'] },
    { id: 'espaciado', niv: 'reg', ico: '🗓️', t: 'Repaso espaciado', ev: 'Dunlosky 2013 · utilidad alta', evc: 'ok', f: ['dun'], tiempo: '5 min por clase',
      que: 'Volver a un tema varios días después, en vez de todo el mismo día, hace que se quede para el examen.',
      pasos: ['En cada mini examen mezcla una pregunta de hoy, una de la semana pasada y una de hace un mes.', 'Antes del examen, reparte el repaso en 3 días cortos en vez de uno largo.', 'Explícales por qué: "lo que cuesta recordar es lo que se queda".'] },
    { id: 'meta', niv: 'reg', ico: '🧠', t: 'Explícalo en 60 segundos', ev: 'EEF: +8 meses · evidencia alta', evc: 'ok', f: ['meta'], tiempo: '10 min',
      que: 'Explicar cómo lo resolvió y revisarlo con una lista le hace notar sus propios errores (metacognición).',
      pasos: ['Piensa en voz alta frente a ellos: "primero cuento eslabones, luego pares, luego reviso…".', 'Arma con el grupo una lista de verificación del tema (¿unidades?, ¿conté la bancada?, ¿marqué el sentido de giro?).', 'Antes de entregar, que revisen con la lista y le expliquen a un compañero en 60 segundos cómo lo hicieron.'] },
    { id: 'criterios', niv: 'reg', ico: '🎯', t: 'Criterios claros con un ejemplo de 10', ev: 'EEF metacognición y retroalimentación · evidencia alta', evc: 'ok', f: ['meta', 'fb'], tiempo: '15 min',
      que: 'Muchos regulares no saben qué distingue un trabajo de 10. Muéstraselo antes de que empiecen.',
      pasos: ['Proyecta un trabajo de 10 y uno de 7 del mismo tema, sin nombres.', 'Que digan en parejas qué tiene el de 10 que no tiene el otro.', 'Convierte sus respuestas en la lista de cotejo (Imprimir → Cotejo).', 'Al entregar, que se autoevalúen con esa lista.'] },
    { id: 'errores', niv: 'reg', ico: '🔍', t: 'Galería de errores', ev: 'EEF retroalimentación · evidencia alta', evc: 'ok', f: ['fb'], tiempo: '10 min',
      que: 'Corregir errores reales (anónimos) enseña más que ver solo la respuesta correcta.',
      pasos: ['Junta 3 o 4 errores frecuentes del examen o la práctica (cada tema trae "Errores comunes").', 'Proyéctalos sin nombres y que el grupo encuentre y corrija cada error.', 'Cierra con la regla para no volver a caer.'] },
    { id: 'reto', niv: 'reg', ico: '🪜', t: 'Reto con pistas escalonadas', ev: 'Rosenshine 2012 · respaldo de investigación', evc: 'info', f: ['ros'], tiempo: '15 min',
      que: 'Un problema un poco más difícil, con pistas que se piden una a una: llegan solos sin que les des la respuesta.',
      pasos: ['Prepara un problema un nivel arriba (un tren de 3 engranes, un mecanismo real).', 'Escribe 3 pistas: la primera orienta, la segunda da el método y la tercera casi lo resuelve.', 'Que pidan pista solo después de intentarlo 3 minutos.'] },
    /* ---- 🟢 mantener ---- */
    { id: 'monitor', niv: 'bien', ico: '🧑‍🏫', t: 'Rol de monitor', ev: 'EEF tutoría entre pares · evidencia alta', evc: 'ok', f: ['par'], tiempo: '10 a 15 min, 2 o 3 veces por semana',
      que: 'Explicarle a otro consolida lo que sabe: en la tutoría entre pares el monitor también avanza.',
      pasos: ['Invítalo (no lo obligues) a ser monitor de un compañero.', 'Dale la guía de monitores y 5 minutos de entrenamiento.', 'Rota a los monitores cada 2 o 3 semanas para que no se cansen.', 'Reconoce su trabajo frente al grupo y, si quieres, con puntos de participación.'] },
    { id: 'extension', niv: 'bien', ico: '🚀', t: 'Retos de extensión', ev: 'Práctica docente', evc: '', tiempo: 'Cuando termine antes',
      que: 'Cuando acaba antes, que tenga algo más retador que hacer, no más de lo mismo.',
      pasos: ['Ten listo un reto por tema: modelar el mecanismo en FreeCAD, calcular la relación de una bicicleta real, armar el circuito de un cilindro en simulador.', 'Busca retos en Ideas y en "Para adelantar el tema" de la siguiente clase.', 'Que lo presente al grupo en 2 minutos durante el cierre.'] },
    { id: 'elogio', niv: 'bien', ico: '👏', t: 'Reconoce el proceso, no el talento', ev: 'Mueller y Dweck 1998 · estudio experimental', evc: 'info', f: ['dw'], tiempo: 'Siempre',
      que: 'Elogiar "qué listo eres" hace que eviten retos para no fallar; elogiar el esfuerzo y la estrategia los hace persistir.',
      pasos: ['Cambia "eres muy bueno" por "te salió porque revisaste las unidades".', 'Cuando falle un reto, nombra lo que sí hizo bien y la estrategia que puede cambiar.', 'Celebra a quien corrige un error, no solo a quien acierta.'] },
    { id: 'eleccion', niv: 'bien', ico: '🎛️', t: 'Que elija cómo demostrarlo', ev: 'Ryan y Deci 2000 · autodeterminación', evc: 'info', f: ['sdt'], tiempo: 'Por proyecto',
      que: 'Tener opciones aumenta la motivación propia y los mantiene enganchados.',
      pasos: ['Con los mismos criterios, que elija: maqueta, video explicativo, simulación o reporte.', 'Que proponga su propio mini proyecto del tema, con tu visto bueno.', 'Revisa con la misma lista de cotejo para que sea justo.'] },
    { id: 'industria', niv: 'bien', ico: '🏭', t: 'Conexión con la industria', ev: 'Práctica docente', evc: '', tiempo: '15 min',
      que: 'Ver dónde se usa en una planta real le da sentido al tema y lo proyecta a su carrera.',
      pasos: ['Trae un componente o catálogo real (cilindro, válvula, sensor, PLC) y que expliquen cómo funciona.', 'Proyecta un video de una línea de producción y que identifiquen los mecanismos.', 'Que investiguen qué empresa cercana usa lo que vieron y para qué.'] },
    { id: 'metaPersonal', niv: 'bien', ico: '📈', t: 'Meta personal', ev: 'EEF metacognición · evidencia alta', evc: 'ok', f: ['meta'], tiempo: '2 min cada viernes',
      que: 'Ponerse una meta propia y revisar su avance mantiene el esfuerzo aunque ya vaya bien.',
      pasos: ['Que escriba su meta del parcial (por ejemplo, de 85 a 92) y qué hará para lograrla.', 'Cada viernes, 2 minutos para ver su avance contigo.', 'Al cierre del parcial, que diga qué estrategia le funcionó.'] }
  ];
  E.GUIA_MONITOR = ['No le des la respuesta: pregúntale "¿qué sabes?" y "¿qué harías primero?".', 'Pídele que te explique su paso en voz alta.', 'Si se atora, dale una pista, no el resultado.', 'Di algo que hizo bien antes de corregir.', 'Al final, que resuelva uno solo y revísenlo juntos.'];
  const est = id => L.find(x => x.id === id);
  const ORD = { mal: 0, reg: 1, bien: 2 };

  /* ---------- registro de apoyos (apoyos:{grupo}) ---------- */
  const AP = E.apoyos = {};
  AP.lista = g => ((S.get('apoyos:' + g.id) || {}).items || []).filter(x => x && x.aids && est(x.est));
  AP.periodo = g => { const p = C.parcialActual(); return SF.periodos(g).find(x => x.id === p.id) || null; };
  AP.conApoyo = (g, per) => { const s = new Set(); AP.lista(g).forEach(x => { if (!per || (x.fecha >= per.ini && x.fecha <= per.fin)) x.aids.forEach(a => s.add(a)); }); return s; };
  const nombreCorto = n => u.corto(n, true);

  // por qué va mal (para elegir la estrategia)
  AP.causas = r => {
    const t = SF.umbral(), x = r.ult || {}, c = [];
    if (r.asisMal) c.push('asis');
    if (x.ne) c.push('entrega');
    if (x.partida) c.push('diag');
    if (x.ex != null && Math.round(x.ex) < t.reg) c.push('examen');
    if (x.tr != null && Math.round(x.tr) < t.reg && !x.ne) c.push('trabajos');
    return c;
  };
  // estrategias recomendadas para un nivel y para quiénes
  AP.recomendar = (niv, filas, hayMonitores) => {
    const del = filas.filter(r => r.n === niv); if (!del.length) return [];
    if (niv === 'reg') return ['quiz', 'meta', 'criterios'].map(id => ({ e: est(id), a: del }));
    if (niv === 'bien') return ['monitor', 'extension', 'elogio'].map(id => ({ e: est(id), a: del }));
    const con = ks => del.filter(r => AP.causas(r).some(k => ks.indexOf(k) >= 0));
    const out = [{ e: est('causa'), a: del }];
    if (hayMonitores !== false) out.push({ e: est('tutoria'), a: del });
    const ent = con(['entrega']); if (ent.length) out.push({ e: est('entrega'), a: ent });
    const apr = con(['examen', 'trabajos', 'diag']); if (apr.length) out.push({ e: est('ejemplo'), a: apr }, { e: est('retro'), a: apr });
    const ex = con(['examen']); if (ex.length) out.push({ e: est('segunda'), a: ex });
    const as = con(['asis']); if (as.length) out.push({ e: est('asis'), a: as });
    if (out.length < 4) out.push({ e: est('retro'), a: del });
    return out.filter((x, i) => out.findIndex(y => y.e.id === x.e.id) === i);
  };

  // ¿funcionan? compara el promedio el día del apoyo con el de hoy
  AP.efecto = g => {
    const per = AP.periodo(g); if (!per) return null;
    const items = AP.lista(g).filter(x => x.fecha >= per.ini && x.fecha <= per.fin); if (!items.length) return null;
    const d = SF.datos(g, per.id), now = {}; d.filas.forEach(r => { now[r.a.id] = r; });
    const prim = {}; // primera fecha de cada estrategia para cada alumno
    items.forEach(x => x.aids.forEach(aid => { const k = x.est + '|' + aid; if (!prim[k] || x.fecha < prim[k]) prim[k] = x.fecha; }));
    const por = {}, hoy = u.today();
    Object.keys(prim).forEach(k => {
      const p = k.split('|'), id = p[0], aid = p[1], f = prim[k], r = now[aid];
      const o = por[id] || (por[id] = { e: est(id), n: 0, med: 0, sube: 0, mejora: 0, dsum: 0, pronto: 0, sin: 0 }); o.n++;
      const base = SF.prom(g, aid, per.id, f, false);
      if (!base || !r || r.v == null) { o.sin++; return; }
      const dv = r.v - base.v;
      if (Math.abs(dv) < 0.05) { o.sin++; return; }
      o.med++; o.dsum += dv; if (dv >= 3) o.mejora++;
      if (r.n && ORD[r.n] > ORD[SF.nivel(base.v)]) o.sube++;
      if (u.diffDays(f, hoy) < 7) o.pronto++;
    });
    return Object.keys(por).map(k => por[k]).sort((a, b) => b.n - a.n);
  };
  AP.efectoHTML = g => {
    const ef = AP.efecto(g); if (!ef) return '';
    return '<h4 class="mt">🛟 ¿Funcionan los apoyos?</h4><ul class="risk est-ef">' +
      ef.map(o => '<li><span>' + o.e.ico + ' <b>' + esc(o.e.t) + '</b><br><small class="muted">' + o.n + (o.n === 1 ? ' alumno' : ' alumnos') + (o.med ? ' · ' + o.sube + ' de ' + o.med + ' subieron de nivel · ' + o.mejora + ' de ' + o.med + ' mejoraron 3 puntos o más' : ' · aún sin calificaciones nuevas') + '</small></span>' +
        (o.med ? '<span class="g ' + (o.dsum >= 0 ? 'ok' : 'bad') + '" title="Cambio promedio desde el apoyo">' + (o.dsum >= 0 ? '+' : '') + (o.dsum / o.med).toFixed(1) + '</span>' : '<span class="g na">—</span>') + '</li>').join('') +
      '</ul><p class="muted small">Compara el promedio de cada alumno el día que registraste el apoyo con el de hoy (el número es el cambio promedio). Dale de 2 a 4 semanas antes de juzgar una estrategia' + (ef.some(o => o.pronto) ? '; algunos apoyos tienen menos de una semana' : '') + '.</p>';
  };

  /* ---------- piezas de interfaz ---------- */
  const fuentes = e => (e.f || []).map(k => '<a href="' + FU[k][1] + '" target="_blank" rel="noopener">' + esc(FU[k][0]) + '</a>').join('<br>');
  const evChip = e => '<span class="chip ' + (e.evc || '') + ' est-ev">' + esc(e.ev) + '</span>';
  AP.estHTML = (e, para, abierto, idDet) => {
    const aids = (para || []).map(r => r.a.id).join(',');
    return '<details class="sub est" ' + (idDet ? 'id="' + idDet + '"' : '') + (abierto ? ' open' : '') + '><summary><span class="est-ico" aria-hidden="true">' + e.ico + '</span><span class="est-t">' + esc(e.t) + '</span>' + evChip(e) + '</summary>' +
      '<p class="small">' + esc(e.que) + '</p><ol class="small est-pasos">' + e.pasos.map(p => '<li>' + esc(p) + '</li>').join('') + '</ol>' +
      '<p class="muted small">⏱ ' + esc(e.tiempo) + '</p>' +
      (para && para.length ? '<p class="small"><b>Para:</b> ' + para.map(r => esc(nombreCorto(r.a.nombre))).join(', ') + '</p>' : '') +
      (e.f ? '<p class="small est-src"><b>Respaldo:</b><br>' + fuentes(e) + '</p>' : '<p class="muted small">Respaldo: práctica docente (sin estudio específico).</p>') +
      '<div class="row gap wrap">' + btn('✓ Lo apliqué: registrar', 'est-reg', 'data-est="' + e.id + '" data-aids="' + aids + '"', 'small primary') + (e.id === 'tutoria' || e.id === 'monitor' ? btn(icon('team') + ' Parejas de tutoría', 'est-pares', '', 'small') : '') + '</div></details>';
  };

  // tarjeta "Plan para subir de nivel" dentro del Semáforo
  AP.planHTML = (g, d) => {
    const cnt = { mal: 0, reg: 0, bien: 0 }; d.filas.forEach(r => { if (r.n) cnt[r.n]++; });
    if (!cnt.mal && !cnt.reg && !cnt.bien) return '';
    const hayMon = cnt.bien > 0 || cnt.reg > 1;
    let h = '<h3>🧭 Plan para subir de nivel</h3><p class="muted small">Estrategias con respaldo de investigación, elegidas según por qué va así cada alumno. Cuando apliques una, regístrala y aquí verás si los que la recibieron suben.</p>' +
      '<div class="row gap wrap">' + (cnt.mal ? btn(icon('team') + ' Parejas de tutoría', 'est-pares', '', 'primary') : '') + link('📚 Todas las estrategias', 'estrategias', '') + btn('Guía para monitores', 'est-guia', '', 'ghost') + '</div>';
    ['mal', 'reg', 'bien'].forEach(nv => {
      if (!cnt[nv]) return;
      const rec = AP.recomendar(nv, d.filas, hayMon), del = d.filas.filter(r => r.n === nv).sort((a, b) => a.v - b.v);
      const otras = L.filter(e => e.niv === nv && !rec.some(x => x.e.id === e.id));
      h += '<details class="sub est-niv ' + SF.NIV[nv].cls + '" id="estn-' + nv + '"' + (nv === 'mal' || (!cnt.mal && nv === 'reg') ? ' open' : '') + '><summary><b>' + esc(E.NIV_EST[nv].t) + '</b> <span class="muted small">· ' + cnt[nv] + (cnt[nv] === 1 ? ' alumno' : ' alumnos') + '</span></summary>' +
        '<p class="small">' + esc(E.NIV_EST[nv].d) + '</p>' +
        (nv === 'mal' ? '<ul class="est-quien small">' + del.map(r => '<li><a href="#/alumno/' + r.a.id + '">' + esc(nombreCorto(r.a.nombre)) + '</a> <span class="muted">' + esc(SF.razon(r.ult)) + (r.asisMal ? ' · faltas' : '') + '</span></li>').join('') + '</ul>' : '<p class="muted small">' + del.map(r => esc(nombreCorto(r.a.nombre))).join(', ') + '</p>') +
        '<p class="kicker">Empieza por aquí</p>' + rec.map(x => AP.estHTML(x.e, x.a, false, 'est-' + nv + '-' + x.e.id)).join('') +
        (otras.length ? '<p class="small muted">Más opciones: ' + otras.map(e => '<a href="#/estrategias/' + nv + '/' + e.id + '">' + e.ico + ' ' + esc(e.t) + '</a>').join(' · ') + '</p>' : '') + '</details>';
    });
    h += AP.efectoHTML(g);
    return card(h, 'est-plan');
  };

  // ficha del alumno
  AP.alumnoHTML = (g, a) => {
    const per = AP.periodo(g), d = per ? SF.datos(g, per.id) : null, r = d ? d.filas.find(x => x.a.id === a.id) : null;
    const mios = AP.lista(g).filter(x => x.aids.indexOf(a.id) >= 0).sort((x, y) => y.fecha < x.fecha ? -1 : 1);
    let h = '<div class="row between gap wrap"><h3>🛟 Apoyos para subir</h3>' + btn('Registrar apoyo', 'est-reg', 'data-aid="' + a.id + '"', 'small primary') + '</div>';
    if (r && r.n) {
      const rec = AP.recomendar(r.n, [r]).slice(0, 3);
      h += '<p class="small"><b>Sugeridas para ' + esc(SF.NIV[r.n].t.toLowerCase()) + ':</b> ' + rec.map(x => '<a href="#/estrategias/' + r.n + '/' + x.e.id + '">' + x.e.ico + ' ' + esc(x.e.t) + '</a>').join(' · ') + '</p>';
    }
    if (mios.length) h += '<ul class="risk est-hist">' + mios.map(x => {
      const e = est(x.est); let ef = '';
      if (per && r && r.v != null && x.fecha >= per.ini) { const b = SF.prom(g, a.id, per.id, x.fecha, false); if (b) { const dv = r.v - b.v; ef = Math.abs(dv) < 0.05 ? '<small class="muted">sin calificaciones nuevas</small>' : '<small class="' + (dv >= 0 ? 'okc' : 'badc') + '">desde entonces ' + Math.round(b.v) + ' → ' + Math.round(r.v) + '</small>'; } }
      return '<li><span>' + e.ico + ' ' + esc(e.t) + ' <small class="muted">' + u.fCorta(x.fecha) + '</small>' + (x.nota ? '<br><small>' + esc(x.nota) + '</small>' : '') + '</span>' + ef + '</li>';
    }).join('') + '</ul>';
    else h += '<p class="muted small">Todavía no registras apoyos para este alumno.</p>';
    return card(h, 'est-al');
  };

  /* ---------- parejas de tutoría ---------- */
  AP.pares = (g, rot) => {
    const per = AP.periodo(g); if (!per) return null;
    const d = SF.datos(g, per.id), con = d.filas.filter(r => r.v != null && r.n);
    let tutees = con.filter(r => r.n === 'mal').sort((a, b) => a.v - b.v), soloReg = false;
    const regs = con.filter(r => r.n === 'reg').sort((a, b) => a.v - b.v);
    if (!tutees.length) { tutees = regs.slice(0, Math.floor(regs.length / 2)); soloReg = true; }
    let tutors = con.filter(r => r.n === 'bien').sort((a, b) => b.v - a.v), conReg = false;
    if (tutors.length < tutees.length) {
      const extra = regs.filter(r => tutees.indexOf(r) < 0).sort((a, b) => b.v - a.v);
      const n = Math.min(tutees.length - tutors.length, Math.ceil(extra.length / 2)); if (n > 0) { tutors = tutors.concat(extra.slice(0, n)); conReg = true; }
    }
    if (!tutors.length || !tutees.length) return { vacio: true };
    const k = (rot || 0) % tutors.length, tt = tutors.slice(k).concat(tutors.slice(0, k));
    const grupos = tt.slice(0, Math.min(tt.length, tutees.length)).map(m => ({ m: m, a: [] }));
    tutees.forEach((r, i) => grupos[i % grupos.length].a.push(r));
    return { grupos: grupos, soloReg: soloReg, conReg: conReg, rot: rot || 0 };
  };
  const guiaHTML = () => '<ol class="small">' + E.GUIA_MONITOR.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol>';
  const pv = r => '<span class="est-p">' + SF.NIV[r.n].ico + ' ' + esc(r.a.nombre) + ' <b>' + Math.round(r.v) + '</b></span>';
  A['est-pares'] = el => {
    const g = D.grupoActual(); if (!g) return;
    const rot = el && el.dataset && el.dataset.rot ? Number(el.dataset.rot) : 0, res = AP.pares(g, rot);
    if (!res || res.vacio) { E.modal.open('Parejas de tutoría', '<p>Para formar parejas necesito alumnos que van mal (o regulares) y alumnos que van bien. Captura calificaciones y vuelve a intentarlo.</p>' + btn('Cerrar', 'modal-close', '', 'primary')); return; }
    E.ui.estPares = res;
    E.modal.open('Parejas de tutoría', '<p class="muted small">' + (res.soloReg ? 'No hay alumnos en rojo: emparejé a los regulares más bajos con los que van bien.' : 'Cada alumno que va mal con un monitor que va bien' + (res.conReg ? ' (faltaban monitores: agregué a los regulares más altos)' : '') + '.') + ' Úsenlas para repasar lo ya visto, de 10 a 15 minutos, 2 o 3 veces por semana durante 4 a 6 semanas.</p>' +
      '<ol class="est-pares">' + res.grupos.map(x => '<li><div class="est-mon">🧑‍🏫 ' + pv(x.m) + '</div><div class="est-tut">' + x.a.map(pv).join('') + '</div></li>').join('') + '</ol>' +
      '<details class="sub"><summary>Guía para los monitores (léesela antes de empezar)</summary>' + guiaHTML() + '</details>' +
      '<p class="muted small">Las calificaciones solo las ves tú: al copiar las parejas se copian solo los nombres.</p>' +
      '<div class="row gap wrap">' + btn('🔄 Otra combinación', 'est-pares', 'data-rot="' + (res.rot + 1) + '"') + btn(icon('copy') + ' Copiar parejas', 'est-pares-copiar') + btn('✓ Guardar como apoyo', 'est-pares-guardar', '', 'primary') + '</div>');
  };
  A['est-pares-copiar'] = async () => {
    const res = E.ui.estPares, g = D.grupoActual(); if (!res || !g) return;
    const txt = 'Parejas de tutoría · ' + g.nombre + '\n' + res.grupos.map((x, i) => (i + 1) + '. Monitor: ' + x.m.a.nombre + ' → ' + x.a.map(r => r.a.nombre).join(' y ')).join('\n') + '\n\nGuía para monitores:\n' + E.GUIA_MONITOR.map((x, i) => (i + 1) + '. ' + x).join('\n');
    const ok = await u.copy(txt); u.toast(ok ? 'Parejas copiadas (solo nombres)' : 'No se pudo copiar', ok ? 'ok' : 'err');
  };
  A['est-pares-guardar'] = () => {
    const res = E.ui.estPares, g = D.grupoActual(); if (!res || !g) return; const f = u.today();
    S.update('apoyos:' + g.id, d => {
      d.items = d.items || [];
      d.items.push({ id: u.uid('ap'), fecha: f, est: 'tutoria', aids: [].concat.apply([], res.grupos.map(x => x.a.map(r => r.a.id))), pares: res.grupos.map(x => [x.m.a.id, x.a.map(r => r.a.id)]), nota: '' });
      d.items.push({ id: u.uid('ap'), fecha: f, est: 'monitor', aids: res.grupos.map(x => x.m.a.id), nota: '' });
    }, { items: [] });
    E.modal.close(); u.toast('Parejas guardadas como apoyo de hoy', 'ok');
  };
  A['est-guia'] = () => E.modal.open('Guía para monitores', '<p class="small">Léela con tus monitores antes de la primera sesión (5 minutos). La tutoría funciona mejor cuando el monitor guía con preguntas en vez de dar la respuesta.</p>' + guiaHTML() + '<div class="row gap wrap">' + btn(icon('copy') + ' Copiar', 'est-guia-copiar') + btn('Cerrar', 'modal-close', '', 'primary') + '</div>');
  A['est-guia-copiar'] = async () => { const ok = await u.copy('Guía para monitores\n' + E.GUIA_MONITOR.map((x, i) => (i + 1) + '. ' + x).join('\n')); u.toast(ok ? 'Guía copiada' : 'No se pudo copiar', ok ? 'ok' : 'err'); };

  /* ---------- registrar un apoyo ---------- */
  A['est-reg'] = el => {
    const g = D.grupoActual(); if (!g) return;
    const eid = el.dataset.est, aid = el.dataset.aid, pre = (el.dataset.aids || '').split(',').filter(Boolean), al = D.alumnos(g);
    let h = '';
    if (eid) { const e = est(eid); h += '<input type="hidden" id="ap-est" value="' + eid + '"><p class="small">' + e.ico + ' <b>' + esc(e.t) + '</b></p>'; }
    else {
      let def = ''; const per = AP.periodo(g);
      if (aid && per) { const r = SF.datos(g, per.id).filas.find(x => x.a.id === aid); if (r && r.n) { const rec = AP.recomendar(r.n, [r]); def = rec.length ? rec[0].e.id : ''; } }
      h += '<label class="fld"><span>Estrategia</span><select id="ap-est">' + ['mal', 'reg', 'bien'].map(nv => '<optgroup label="' + esc(E.NIV_EST[nv].t) + '">' + L.filter(e => e.niv === nv).map(e => '<option value="' + e.id + '" ' + (e.id === def ? 'selected' : '') + '>' + e.ico + ' ' + esc(e.t) + '</option>').join('') + '</optgroup>').join('') + '</select></label>';
    }
    h += '<label class="fld"><span>Fecha</span><input type="date" id="ap-fecha" value="' + u.today() + '"></label>';
    if (aid) { const a = al.find(x => x.id === aid); h += '<input type="hidden" id="ap-aid" value="' + aid + '"><p class="small">Alumno: <b>' + esc(a ? a.nombre : '') + '</b></p>'; }
    else h += '<div class="fld"><span>Alumnos</span><div class="ap-al">' + al.map(a => '<label class="ap-chk"><input type="checkbox" name="ap-al" value="' + a.id + '" ' + (pre.indexOf(a.id) >= 0 ? 'checked' : '') + '> <span>' + a.num + '. ' + esc(a.nombre) + '</span></label>').join('') + '</div></div>';
    h += '<label class="fld"><span>Nota (opcional)</span><textarea id="ap-nota" rows="2" placeholder="Qué hiciste y qué acordaron. Solo lo pedagógico: sin diagnósticos ni datos de salud."></textarea></label>' +
      '<div class="row gap wrap">' + btn('Guardar apoyo', 'est-guardar', '', 'primary') + btn('Cancelar', 'modal-close', '', 'ghost') + '</div>';
    E.modal.open('Registrar apoyo', h);
  };
  A['est-guardar'] = () => {
    const g = D.grupoActual(); if (!g) return; const v = id => (document.getElementById(id) || {}).value || '';
    const eid = v('ap-est'), fecha = v('ap-fecha') || u.today(), nota = v('ap-nota').trim();
    const aids = v('ap-aid') ? [v('ap-aid')] : Array.prototype.map.call(document.querySelectorAll('input[name="ap-al"]:checked'), x => x.value);
    if (!est(eid)) { u.toast('Elige una estrategia', 'err'); return; }
    if (!aids.length) { u.toast('Marca al menos un alumno', 'err'); return; }
    S.update('apoyos:' + g.id, d => { d.items = d.items || []; d.items.push({ id: u.uid('ap'), fecha: fecha, est: eid, aids: aids, nota: nota }); }, { items: [] });
    E.modal.close(); u.toast('Apoyo registrado' + (aids.length > 1 ? ' para ' + aids.length + ' alumnos' : ''), 'ok');
  };
  A['est-del'] = el => { const g = D.grupoActual(); if (!g || !confirm('¿Borrar este registro de apoyo?')) return; S.update('apoyos:' + g.id, d => { d.items = (d.items || []).filter(x => x.id !== el.dataset.id); }, { items: [] }); };

  /* ---------- vista: catálogo de estrategias ---------- */
  V.estrategias = (nv, eid) => {
    nv = E.NIV_EST[nv] ? nv : 'mal';
    const g = D.grupoActual(), per = g ? AP.periodo(g) : null, d = g && per && D.alumnos(g).length ? SF.datos(g, per.id) : null;
    let h = '<div class="filters">' + ['mal', 'reg', 'bien'].map(k => '<a class="tab ' + (k === nv ? 'on' : '') + '" href="#/estrategias/' + k + '">' + esc(E.NIV_EST[k].t) + '</a>').join('') + '</div>';
    const del = d ? d.filas.filter(r => r.n === nv).sort((a, b) => a.v - b.v) : [];
    h += card('<h3>' + esc(E.NIV_EST[nv].t) + '</h3><p class="small">' + esc(E.NIV_EST[nv].d) + '</p>' + (del.length ? '<p class="small muted"><b>En este nivel hoy (' + del.length + '):</b> ' + del.map(r => '<a href="#/alumno/' + r.a.id + '">' + esc(nombreCorto(r.a.nombre)) + '</a>').join(', ') + '</p>' : '') +
      (eid ? '<span data-scroll="est-cat-' + eid + '"></span>' : '') +
      L.filter(e => e.niv === nv).map(e => AP.estHTML(e, del, e.id === eid, 'est-cat-' + e.id)).join(''));
    h += card('<div class="row between gap wrap"><h3>' + icon('team') + ' Tutoría entre pares</h3>' + btn('Formar parejas', 'est-pares', '', 'small primary') + '</div><p class="small">Guía para los monitores:</p>' + guiaHTML());
    if (g) {
      const hist = AP.lista(g).slice().sort((a, b) => b.fecha < a.fecha ? -1 : 1), al = {}; D.alumnos(g, true).forEach(a => { al[a.id] = a; });
      h += card('<h3>🛟 Registro de apoyos</h3>' + (hist.length ? '<ul class="risk est-hist">' + hist.slice(0, 30).map(x => { const e = est(x.est); return '<li><span>' + e.ico + ' ' + esc(e.t) + ' <small class="muted">' + u.fCorta(x.fecha) + '</small><br><small>' + x.aids.map(id => al[id] ? esc(nombreCorto(al[id].nombre)) : '—').join(', ') + '</small>' + (x.nota ? '<br><small class="muted">' + esc(x.nota) + '</small>' : '') + '</span>' + btn(icon('trash'), 'est-del', 'data-id="' + x.id + '" aria-label="Borrar registro"', 'small ghost') + '</li>'; }).join('') + '</ul>' + (hist.length > 30 ? '<p class="muted small">Y ' + (hist.length - 30) + ' registros anteriores.</p>' : '') : '<p class="muted small">Cuando apliques una estrategia, toca "Lo apliqué: registrar". Así el semáforo te dice si funcionó.</p>') +
        btn('Registrar apoyo', 'est-reg', '', 'small') + AP.efectoHTML(g));
    }
    h += card('<h3>Fuentes</h3><ul class="small est-fuentes">' + Object.keys(FU).map(k => '<li><a href="' + FU[k][1] + '" target="_blank" rel="noopener">' + esc(FU[k][0]) + '</a></li>').join('') + '</ul><p class="muted small">"Meses" es el avance extra promedio en un ciclo escolar que reporta la Education Endowment Foundation (Reino Unido) al revisar cientos de estudios. "Práctica docente" son recomendaciones de sentido común sin un estudio específico detrás.</p>');
    return { t: 'Estrategias', h: h };
  };
})();
