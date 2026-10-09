/* Escuadra · Tutoría del grupo: alerta temprana, cooperaciones (dinero con cuentas claras), tu plan de tutoría,
   seguimiento por alumno y banco de ideas para tutores con fuentes. Todo es del grupo actual. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link, icon = E.icon;
  const T = E.tutoria = {};
  const $ = n => '$' + (Math.round((Number(n) || 0) * 100) / 100).toLocaleString('es-MX', { maximumFractionDigits: 2 });
  const nombreCorto = n => { const p = String(n).split(' '); return p.length >= 3 ? p[p.length - 2] + ' ' + p[0] : n; };
  const KT = g => 'tut:' + g.id, KS = g => 'tutseg:' + g.id, KC = (g, id) => 'coop:' + g.id + ':' + (id || '');
  const val = id => ((document.getElementById(id) || {}).value || '').trim();
  T.cfg = g => S.get(KT(g)) || {};
  T.coops = g => S.list(KC(g)).filter(c => c && c.id).sort((a, b) => String(b.creada || '').localeCompare(String(a.creada || '')));
  T.seg = g => S.get(KS(g)) || {};
  const coTxt = g => T.cfg(g).cotutora || 'Co-tutora';
  const RESP = g => ({ yo: 'Yo', co: coTxt(g), ambos: 'Los dos', grupo: 'El grupo' });

  /* ---------- fuentes ---------- */
  const EEF = 'https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/';
  const FU = E.FUENTES_TUT = {
    a9: ['SEP · Comité Directivo del SNB (2009). Acuerdo 9/CD/2009: lineamientos de la acción tutorial en la EMS (copia publicada por el CETI)', 'https://colomos.ceti.mx/documentos/tutorias/Acuerdo_9_comites_tutorias_SEMS.pdf'],
    yna: ['SEP · SEMS (2014). Yo no abandono: Manual para prevenir los riesgos del abandono escolar en la EMS (alerta temprana)', 'https://educacionmediasuperior.sep.gob.mx/work/models/sems/Resource/13734/1/images/yna_manual_1(1).pdf'],
    lge: ['Ley General de Educación, art. 7, fracción IV: gratuidad y aportaciones voluntarias (última reforma DOF 15-01-2026)', 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LGE.pdf'],
    dgb: ['SEP · DGB (2025). Orientaciones para el abordaje de la Formación Socioemocional en el aula', 'https://dgb.sep.gob.mx/storage/recursos/2025/06/FyHNentp2H-Orientaciones-para-el-abordaje-de-la-formacion-socioemocional-en-el-aula.pdf'],
    ca: ['SEP · SEMS/DGB (2023). Currículum ampliado del Marco Curricular Común de la EMS', 'https://dgb.sep.gob.mx/storage/recursos/2024/01/jNdEKcmw7p-Curriculum-Ampliado.pdf'],
    wwc: ['IES · What Works Clearinghouse (2017). Preventing Drop-out in Secondary Schools', 'https://ies.ed.gov/ncee/WWC/PracticeGuide/24'],
    pad: ['EEF · Participación de las familias (+4 meses, evidencia alta; menos estudios en secundaria y bachillerato)', EEF + 'parental-engagement'],
    sel: ['EEF · Aprendizaje socioemocional (+3 meses en promedio, +5 en secundaria y bachillerato; evidencia moderada)', EEF + 'social-and-emotional-learning'],
    men: ['EEF · Mentoría (+2 meses; mayor efecto en actitud, asistencia y conducta que en calificaciones)', EEF + 'mentoring'],
    par: ['EEF · Tutoría entre pares (+6 meses, evidencia alta)', EEF + 'peer-tutoring'],
    dun: ['Dunlosky y col. (2013). Improving Students’ Learning With Effective Learning Techniques', 'https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html']
  };

  /* ---------- banco de ideas para tutores ---------- */
  E.TUT_CATS = [['org', '🗂️ Organización del grupo'], ['acad', '📊 Seguimiento académico'], ['socio', '💬 Convivencia y socioemocional'], ['fam', '🏠 Familias'], ['vida', '🧭 Proyecto de vida'], ['cuidado', '🛟 Cuidado y canalización']];
  const I = E.TUT_IDEAS = [
    { id: 'acuerdos', cat: 'org', tipo: 'convivencia', ico: '🤝', t: 'Acuerdos de convivencia del grupo', cuando: 'Al inicio y cada parcial',
      que: 'Reglas que el grupo propone y firma: se cumplen más que las que se imponen y te dan algo concreto a qué volver cuando hay conflicto.',
      pasos: ['En equipos, que propongan 3 acuerdos sobre respeto, limpieza, celular y puntualidad.', 'Junten y voten hasta quedarse con 5 a 7, redactados en positivo ("Llegamos a tiempo").', 'Que todos firmen el cartel y tómale foto.', 'Revísenlos 10 minutos cada parcial: ¿cuál cumplimos y cuál no?'], f: ['a9', 'dgb'] },
    { id: 'comites', cat: 'org', tipo: 'actividad', ico: '🗂️', t: 'Cargos y comités que rotan', cuando: 'Cada parcial',
      que: 'Jefe(a) de grupo, tesorería (2 personas), limpieza y eventos. Repartir tareas les da responsabilidad y te quita carga.',
      pasos: ['Define los cargos y qué hace cada uno en una hoja.', 'Que el grupo elija; la tesorería siempre con 2 personas.', 'Rótenlos cada parcial para que más alumnos participen.', 'Reconoce públicamente a quien cumplió su cargo.'], f: ['a9'] },
    { id: 'cuentas', cat: 'org', tipo: 'actividad', ico: '💵', t: 'Cooperaciones con cuentas claras', cuando: 'Cada vez que se junte dinero',
      que: 'En escuela pública las aportaciones son voluntarias: no pueden condicionar inscripción, entrada, exámenes, entrega de documentos ni el trato a nadie. Cuentas claras evitan problemas con familias y dirección.',
      pasos: ['Que el grupo acuerde el monto, para qué es y la fecha; anótalo aquí en Cooperaciones.', 'Que el dinero lo reciban 2 tesoreros y lo registren en la app al momento.', 'Guarda foto de cada ticket de gasto y regístralo.', 'Cada mes comparte el corte de caja con el grupo (totales y gastos, sin señalar a nadie).', 'Si alguien no puede cooperar, márcalo como "no paga" sin exponerlo.'], f: ['lge'] },
    { id: 'alerta', cat: 'acad', tipo: 'seguimiento', ico: '🚨', t: 'Alerta temprana cada mes (ABC)', cuando: 'Una vez al mes',
      que: 'Revisa Asistencia, Bajo desempeño y Conducta. Quien junta 2 o más señales necesita atención urgente; actuar temprano evita el abandono.',
      pasos: ['Usa la tarjeta "Alerta temprana" de esta sección (con lo que registras en tu módulo).', 'Pide a los demás docentes del grupo los nombres de quien reprueba o falta en su materia.', 'Para cada alumno con 2 o más señales: plática corta, aviso a la familia y una acción concreta.', 'Anota el seguimiento en "Alumnos" y revisa el mes siguiente si mejoró.'], f: ['yna', 'wwc'] },
    { id: 'docentes', cat: 'acad', tipo: 'seguimiento', ico: '👥', t: 'Concentrar información de los demás docentes', cuando: 'A mitad y al cierre de cada parcial',
      que: 'El tutor de grupo coordina a los profesores del grupo. Un mensaje corto a cada docente te da el mapa completo del grupo.',
      pasos: ['Manda a cada docente: "¿Quién va reprobando o faltando en tu materia? Solo nombres".', 'Concentra en una lista y cruza con tu alerta temprana.', 'Comparte con tu co-tutora y decidan quién habla con quién.'], f: ['a9'] },
    { id: 'entrevista', cat: 'acad', tipo: 'seguimiento', ico: '🗣️', t: 'Plática 1 a 1 de 10 minutos', cuando: 'Con quien tenga señales de alerta',
      que: 'Un adulto que da seguimiento personal es de lo que más ayuda a quien va en riesgo. Diez minutos bien usados bastan para empezar.',
      pasos: ['Empieza por algo positivo que hayas visto de él o ella.', 'Pregunta: "¿Qué se te está complicando más?" y escucha sin interrumpir.', 'Acuerden una sola acción para esta semana (entregar algo, venir a asesoría, hablar con un docente).', 'Anota el acuerdo (no lo personal) y vuelve a preguntar en una semana.'], f: ['wwc', 'men'] },
    { id: 'pares', cat: 'acad', tipo: 'actividad', ico: '🤝', t: 'Tutoría entre pares en todas las materias', cuando: 'Antes de exámenes',
      que: 'Compañeros que van bien ayudan a quien va atrás a repasar. Funciona en cualquier materia y ambos aprenden.',
      pasos: ['Usa "Parejas de tutoría" (Semáforo → Plan para subir de nivel) como base.', 'Pide a los docentes de otras materias que sugieran monitores.', 'Sesiones cortas de repaso, no de tema nuevo, 2 o 3 veces por semana.'], f: ['par'] },
    { id: 'estudio', cat: 'acad', tipo: 'actividad', ico: '📚', t: 'Mini taller de cómo estudiar', cuando: 'Antes del primer examen de cada parcial',
      que: 'Releer y subrayar casi no sirve; practicar recordando y repasar en días distintos sí. Enseñarlo en 20 minutos les sirve para todas las materias.',
      pasos: ['Pregunta cómo estudian (casi todos dirán "leyendo").', 'Explica 2 técnicas: hacerse preguntas sin ver los apuntes y repasar en 3 días cortos.', 'Practíquenlo ahí con un tema de cualquier materia.', 'Que armen su agenda de repaso para la semana de exámenes.'], f: ['dun'] },
    { id: 'checkin', cat: 'socio', tipo: 'convivencia', ico: '🌡️', t: 'Termómetro de 1 minuto', cuando: 'Al inicio de cada sesión de tutoría',
      que: 'Cada quien marca en un papelito, sin nombre, cómo llega del 1 al 5. Te da una lectura rápida del grupo y les enseña a nombrar cómo se sienten.',
      pasos: ['Reparte papelitos y que escriban un número del 1 al 5.', 'Junta y cuenta frente a ellos.', 'Si hay muchos 1 y 2, pregunta en general qué está pesando (exámenes, entregas) y ajusta la sesión.', 'No busques a quién puso qué; si alguien quiere hablar, que se acerque al final.'], f: ['dgb', 'sel'] },
    { id: 'circulo', cat: 'socio', tipo: 'convivencia', ico: '⭕', t: 'Círculo de diálogo', cuando: 'Cuando haya un conflicto en el grupo',
      que: 'Sillas en círculo, una pregunta y un objeto que da el turno. Baja la tensión y todos hablan, no solo los que siempre hablan.',
      pasos: ['Acomoden sillas en círculo y explica la regla: habla quien tiene el objeto.', 'Pregunta abierta: "¿Qué pasó y cómo nos afectó?".', 'Segunda ronda: "¿Qué podemos hacer distinto?".', 'Cierra con un acuerdo concreto y agrégalo a los acuerdos del grupo.'], f: ['dgb'] },
    { id: 'integracion', cat: 'socio', tipo: 'convivencia', ico: '🧩', t: 'Juegos cooperativos para integrar', cuando: 'Si el grupo está dividido o llega alguien nuevo',
      que: 'Retos que solo se ganan en equipo y con equipos al azar mezclan subgrupos y mejoran cómo se tratan.',
      pasos: ['Forma equipos al azar (Herramientas → Equipos).', 'Reto de 15 minutos: la torre más alta con 20 popotes y cinta, o un problema de ingenio.', 'Al final pregunta qué hizo funcionar al equipo ganador.'], f: ['dgb', 'sel'] },
    { id: 'reconoce', cat: 'socio', tipo: 'actividad', ico: '🏅', t: 'Reconocimiento del mes', cuando: 'Cada fin de mes',
      que: 'Reconocer avances (no solo al de 10) motiva a los demás: asistencia completa, quien más subió, quien más ayudó.',
      pasos: ['Revisa el Semáforo (quién subió) y la asistencia del mes.', 'Nombra 3 o 4 reconocimientos de esfuerzo y mejora.', 'Si puedes, avisa a la familia con un mensaje.'], f: ['pad'] },
    { id: 'msgpos', cat: 'fam', tipo: 'familias', ico: '📩', t: 'Mensajes positivos a casa', cuando: 'Un par por semana',
      que: 'Las familias casi solo oyen de la escuela cuando hay problemas. Un mensaje por un logro abre la puerta para cuando necesites su apoyo.',
      pasos: ['Elige 2 alumnos por semana con un logro concreto.', 'Mensaje corto: qué hizo bien y qué sigue ("Esta semana entregó todo; el reto es el examen del viernes").', 'Lleva el registro aquí para que a todos les toque en el semestre.'], f: ['pad'] },
    { id: 'junta', cat: 'fam', tipo: 'junta', ico: '🧑‍🤝‍🧑', t: 'Junta de padres de 30 minutos con agenda', cuando: 'Al inicio del semestre y tras el 1er parcial',
      que: 'Una junta corta y ordenada da confianza: saben a quién buscar, cuándo hay calificaciones y cómo va el grupo.',
      pasos: ['Presenten a los dos tutores y el medio de contacto.', 'Calendario: fechas de parciales y entregas de calificaciones.', 'Cómo va el grupo en general (sin exponer a nadie) y acuerdos de convivencia.', 'Cooperaciones con cuentas claras: para qué, cuánto, quién lleva el registro.', 'Al final, citas individuales con las familias de quien tiene señales de alerta.'], f: ['a9', 'pad'] },
    { id: 'avisofaltas', cat: 'fam', tipo: 'familias', ico: '📞', t: 'Aviso temprano de faltas', cuando: 'Desde la 2ª falta seguida',
      que: 'Avisar pronto a la familia es la acción que recomienda Yo no abandono para la asistencia; esperar al final del parcial es tarde.',
      pasos: ['Revisa la alerta temprana cada semana (o tu Pase de lista).', 'Mensaje breve y sin regaño: "Notamos que ha faltado; ¿todo bien? Queremos ayudarle a ponerse al corriente".', 'Si sigue faltando, cita a la familia con tu co-tutora.'], f: ['yna'] },
    { id: 'plan3', cat: 'vida', tipo: 'actividad', ico: '🗺️', t: 'Mi plan a 3 años', cuando: 'Una sesión por semestre',
      que: 'Pensar dónde quieren estar al egresar (trabajo técnico, universidad, emprender) le da sentido a lo que hacen hoy.',
      pasos: ['Que respondan: ¿dónde quiero estar al terminar el bachillerato? ¿qué necesito saber hacer?', 'Que conecten 2 materias de este semestre con esa meta.', 'Que escriban una acción para este parcial y la guarden; revísenla al final del semestre.'], f: ['a9', 'yna'] },
    { id: 'industria', cat: 'vida', tipo: 'actividad', ico: '🏭', t: 'Charla de la industria o de un egresado', cuando: 'Una vez por semestre',
      que: 'Conectar la escuela con el trabajo real es una de las recomendaciones para prevenir el abandono: ven para qué sirve terminar.',
      pasos: ['Invita a un egresado o a alguien que trabaje en una planta de la región (20 minutos y preguntas).', 'Que preparen 3 preguntas antes: qué hace en un día, qué estudió, cuánto se gana al empezar.', 'Cierra pidiendo que escriban qué les sirvió.'], f: ['wwc'] },
    { id: 'mentor', cat: 'vida', tipo: 'seguimiento', ico: '🧑‍🏫', t: 'Mentoría semanal para casos clave', cuando: 'Durante todo el semestre',
      que: 'Para 2 o 3 alumnos con más riesgo: una plática breve cada semana con un adulto de confianza. Mejora sobre todo asistencia y actitud.',
      pasos: ['Elige con tu co-tutora a quién y repártanselos.', '5 a 10 minutos cada semana, el mismo día.', 'Una meta corta por semana y revisarla la siguiente.', 'Planea qué pasa al terminar el semestre para no cortar de golpe.'], f: ['men'] },
    { id: 'canaliza', cat: 'cuidado', tipo: 'seguimiento', ico: '🛟', t: 'Si un alumno te cuenta algo serio', cuando: 'Siempre',
      que: 'El tutor de grupo identifica y canaliza; no le toca investigar ni resolver solo. Orientación y dirección tienen los protocolos del plantel.',
      pasos: ['Escucha con calma y agradécele la confianza.', 'No prometas guardar el secreto: dile que vas a buscar ayuda con alguien que sabe.', 'Avisa ese mismo día a orientación o a dirección, según el protocolo del plantel.', 'En la app anota solo "canalizado a orientación" y la fecha, sin detalles.'], f: ['a9'] },
    { id: 'cotutor', cat: 'cuidado', tipo: 'seguimiento', ico: '🤜', t: 'Coordinación con tu co-tutora', cuando: '15 minutos cada 2 semanas',
      que: 'Dos tutores dan más cobertura si se reparten el trabajo y dan el mismo mensaje al grupo.',
      pasos: ['Repartan: por ejemplo, una lleva cooperaciones y familias; otro, alerta temprana y docentes.', 'Cada 2 semanas compartan el resumen (botón "Copiar resumen para la co-tutora").', 'Acuerden juntos lo importante antes de anunciarlo al grupo.'], f: ['a9'] }
  ];
  const idea = id => I.find(x => x.id === id);
  const TIPOS = { actividad: 'Actividad', junta: 'Junta', convivencia: 'Convivencia', seguimiento: 'Seguimiento', familias: 'Familias', otro: 'Otro' };
  const SEG = { ok: ['Sin pendientes', ''], seg: ['En seguimiento', 'warn'], can: ['Canalizado', 'info'] };
  const fuentes = keys => (keys || []).map(k => '<a href="' + FU[k][1] + '" target="_blank" rel="noopener">' + esc(FU[k][0]) + '</a>').join('<br>');

  /* ---------- alerta temprana (con lo que registras en tu módulo) ---------- */
  // Yo no abandono: A asistencia (2 o más faltas en el mes), B bajo desempeño, C conducta; 2 o más señales = atención urgente.
  T.alertas = g => {
    const hoy = u.today(), desde = u.addDays(hoy, -30), al = D.alumnos(g), fal = {}, neg = {}, mal = {};
    S.keys('asis:' + g.id + ':').forEach(k => { const f = k.split(':').pop(); if (f < desde || f > hoy) return; const doc = S.get(k) || {}; al.forEach(a => { if (!C.cuenta(doc[a.id] || 'A')) fal[a.id] = (fal[a.id] || 0) + 1; }); });
    const negIds = (E.OBS || []).filter(o => o.pos < 0).map(o => o.id);
    S.keys('obs:' + g.id + ':').forEach(k => { const f = k.split(':').pop(); if (f < desde || f > hoy) return; const doc = S.get(k) || {}; Object.keys(doc).forEach(aid => { const n = (doc[aid] || []).filter(x => negIds.indexOf(x) >= 0).length; if (n) neg[aid] = (neg[aid] || 0) + n; }); });
    if (E.semaforo) { const p = C.parcialActual(hoy), per = E.semaforo.periodos(g).find(x => x.id === p.id); if (per) E.semaforo.datos(g, per.id).filas.forEach(r => { if (r.n === 'mal') mal[r.a.id] = r; }); }
    const seg = T.seg(g);
    return al.map(a => {
      const x = { a: a, A: fal[a.id] || 0, B: mal[a.id] ? Math.round(mal[a.id].v) : null, C: neg[a.id] || 0, est: (seg[a.id] || {}).estado || '' };
      x.sA = x.A >= 2; x.sB = x.B != null; x.sC = x.C >= 3; x.n = (x.sA ? 1 : 0) + (x.sB ? 1 : 0) + (x.sC ? 1 : 0); return x;
    }).filter(x => x.n || x.est === 'seg' || x.est === 'can').sort((p, q) => q.n - p.n || p.a.num - q.a.num);
  };
  const senales = x => (x.sA ? '<span class="chip bad">A · ' + x.A + ' faltas</span> ' : '') + (x.sB ? '<span class="chip bad">B · 🔴 ' + x.B + '</span> ' : '') + (x.sC ? '<span class="chip warn">C · ' + x.C + ' llamadas de atención</span> ' : '');
  const estChip = e => e && SEG[e] ? '<span class="chip ' + SEG[e][1] + '">' + SEG[e][0] + '</span>' : '';

  /* ---------- cooperaciones ---------- */
  T.calc = (g, c) => {
    const al = D.alumnos(g), monto = Number(c.monto) || 0, pagos = c.pagos || {}, ex = c.exentos || {};
    const suma = aid => (pagos[aid] || []).reduce((s, x) => s + (Number(x.m) || 0), 0);
    const filas = al.map(a => {
      const pg = suma(a.id), e = !!ex[a.id], debe = e ? 0 : monto;
      const st = e ? 'ex' : monto > 0 ? (pg >= debe - 0.001 ? 'ok' : pg > 0 ? 'par' : 'pend') : (pg > 0 ? 'ok' : 'pend');
      return { a: a, pg: pg, ex: e, debe: debe, falta: Math.max(0, debe - pg), st: st, ult: (pagos[a.id] || []).slice(-1)[0] };
    });
    const rec = Object.keys(pagos).reduce((s, aid) => s + suma(aid), 0), gas = (c.gastos || []).reduce((s, x) => s + (Number(x.m) || 0), 0);
    const esperado = filas.reduce((s, r) => s + r.debe, 0);
    return { filas: filas, monto: monto, rec: rec, gas: gas, caja: rec - gas, esperado: esperado, pendiente: filas.reduce((s, r) => s + r.falta, 0),
      nOk: filas.filter(r => r.st === 'ok').length, nPend: filas.filter(r => r.st === 'pend' || r.st === 'par').length, nEx: filas.filter(r => r.st === 'ex').length };
  };
  const ST = { ok: ['Pagó', 'ok'], par: ['Parcial', 'warn'], pend: ['Pendiente', ''], ex: ['No paga', 'info'] };

  /* ---------- vista ---------- */
  const TABS = [['inicio', 'Inicio'], ['coop', '💵 Cooperaciones'], ['plan', '📝 Mi plan'], ['alumnos', '👥 Alumnos'], ['ideas', '💡 Ideas']];
  V.tutoria = (tab, id) => {
    const g = D.grupoActual(); if (!g) return H.noGroup();
    tab = tab || 'inicio';
    const act = tab === 'alumno' ? 'alumnos' : tab;
    let h = '<div class="filters">' + TABS.map(x => '<a class="tab ' + (x[0] === act ? 'on' : '') + '" href="#/tutoria/' + x[0] + '">' + x[1] + '</a>').join('') + '</div>';
    if (tab === 'coop') h += id ? coopDet(g, id) : coopLista(g);
    else if (tab === 'plan') h += planV(g);
    else if (tab === 'alumnos') h += alumnosV(g);
    else if (tab === 'alumno') h += alumnoV(g, id);
    else if (tab === 'ideas') h += ideasV(g, id);
    else h += inicioV(g);
    return { t: 'Tutoría', h: h };
  };

  function inicioV(g) {
    const cf = T.cfg(g), al = T.alertas(g), coops = T.coops(g).filter(c => !c.cerrada), hoy = u.today();
    const plan = (cf.plan || []).filter(x => x.estado !== 'hecha');
    const prox = plan.filter(x => x.fecha && x.fecha >= hoy).sort((a, b) => a.fecha.localeCompare(b.fecha)).slice(0, 4);
    let h = card('<h3>🧭 Tutoría de ' + esc(g.nombre) + '</h3><p class="muted small">Como tutor de grupo das seguimiento a cada alumno, coordinas a los docentes del grupo, involucras a las familias y canalizas a orientación cuando hace falta (Acuerdo 9 de la SEMS).</p>' +
      '<label class="fld"><span>Co-tutor(a)</span><input id="tut-co" value="' + esc(cf.cotutora || '') + '" placeholder="Nombre de tu compañera tutora" data-ch="tut-cfg" data-f="cotutora"></label>' +
      '<div class="row gap wrap">' + btn(icon('copy') + ' Copiar resumen para la co-tutora', 'tut-resumen', '', 'primary') + link('💡 Ideas para tutores', 'tutoria/ideas', '') + '</div>');
    h += card('<div class="row between gap wrap"><h3>' + icon('alert') + ' Alerta temprana</h3>' + link('Ver alumnos', 'tutoria/alumnos', 'small') + '</div>' +
      '<p class="muted small">Últimos 30 días con lo que registras en tu módulo: <b>A</b> 2 o más faltas · <b>B</b> va mal en el semáforo · <b>C</b> 3 o más llamadas de atención (💤, 🎒). Con 2 o más señales, atención urgente. Pide a los demás docentes lo de sus materias.</p>' +
      (al.length ? '<ul class="risk tut-al">' + al.slice(0, 8).map(x => '<li><a href="#/tutoria/alumno/' + x.a.id + '">' + esc(x.a.nombre) + '</a><span class="tut-sen">' + (x.n >= 2 ? '<b class="badc small">urgente</b> ' : '') + senales(x) + estChip(x.est) + '</span></li>').join('') + '</ul>' + (al.length > 8 ? '<p class="small"><a href="#/tutoria/alumnos">Ver los ' + al.length + ' ›</a></p>' : '') : '<p class="note ok small">Nadie con señales de alerta en tu módulo.</p>'));
    h += card('<div class="row between gap wrap"><h3>💵 Cooperaciones</h3>' + link('Ver todas', 'tutoria/coop', 'small') + '</div>' +
      (coops.length ? '<ul class="risk">' + coops.map(c => { const k = T.calc(g, c); return '<li><a href="#/tutoria/coop/' + c.id + '">' + esc(c.concepto) + '</a><span class="small">' + $(k.rec) + (k.esperado ? ' de ' + $(k.esperado) : '') + ' · ' + k.nPend + ' pendientes · en caja <b>' + $(k.caja) + '</b></span></li>'; }).join('') + '</ul>' : '<p class="muted small">Sin cooperaciones activas. ' + link('Crear una', 'tutoria/coop', 'small') + '</p>'));
    h += card('<div class="row between gap wrap"><h3>📝 Lo que sigue</h3>' + link('Mi plan', 'tutoria/plan', 'small') + '</div>' +
      (prox.length ? '<ul class="risk">' + prox.map(x => '<li><span>' + esc(x.t) + ' <small class="muted">' + esc(RESP(g)[x.resp] || '') + '</small></span><span class="chip">' + u.fCorta(x.fecha) + '</span></li>').join('') + '</ul>' : '<p class="muted small">Sin actividades con fecha. Agrega tus ideas en <a href="#/tutoria/plan">Mi plan</a>.</p>') +
      (plan.filter(x => !x.fecha).length ? '<p class="small muted">' + plan.filter(x => !x.fecha).length + ' ideas sin fecha en tu plan.</p>' : ''));
    return h;
  }

  /* ---------- cooperaciones: lista y alta ---------- */
  function coopLista(g) {
    const cs = T.coops(g), cf = T.cfg(g);
    let h = card('<h3>💵 Nueva cooperación</h3><p class="muted small">Por ejemplo, limpieza de baños. Escribe el monto por alumno (o 0 si es "lo que cada quien pueda").</p>' +
      '<label class="fld"><span>Para qué es</span><input id="tc-con" placeholder="Limpieza de baños"></label>' +
      '<div class="row gap wrap"><label class="fld grow"><span>Monto por alumno</span><input id="tc-monto" type="number" min="0" step="0.5" inputmode="decimal" placeholder="30"></label><label class="fld grow"><span>Fecha límite</span><input id="tc-lim" type="date"></label></div>' +
      '<label class="fld"><span>Quién guarda el dinero</span><input id="tc-guarda" value="' + esc(cf.guarda || '') + '" placeholder="Tesorería del grupo (2 alumnos)"></label>' +
      '<label class="fld"><span>Nota (opcional)</span><input id="tc-nota" placeholder="Ej. productos de limpieza para el semestre"></label>' +
      btn('Crear cooperación', 'tc-crear', '', 'primary') +
      '<p class="note small mt">En escuela pública las aportaciones son <b>voluntarias</b>: no pueden condicionar inscripción, entrada, exámenes, entrega de documentos ni el trato a ningún alumno (Ley General de Educación, art. 7, fr. IV). Marca como "No paga" a quien no pueda, sin exponerlo.</p>');
    h += cs.length ? cs.map(c => { const k = T.calc(g, c), pct = k.esperado ? Math.min(100, k.rec / k.esperado * 100) : 0; return card('<div class="row between gap wrap"><h3>' + esc(c.concepto) + (c.cerrada ? ' <span class="chip">cerrada</span>' : '') + '</h3>' + link('Abrir', 'tutoria/coop/' + c.id, 'small primary') + '</div>' +
      '<p class="small muted">' + (k.monto ? $(k.monto) + ' por alumno' : 'Voluntaria: lo que cada quien pueda') + (c.limite ? ' · límite ' + u.fCorta(c.limite) : '') + '</p>' + (k.esperado ? '<div class="bar"><span style="width:' + pct + '%"></span></div>' : '') +
      '<p class="small">Recaudado <b>' + $(k.rec) + '</b>' + (k.esperado ? ' de ' + $(k.esperado) : '') + ' · ' + k.nOk + ' pagaron · ' + k.nPend + ' pendientes · en caja <b>' + $(k.caja) + '</b></p>'); }).join('') : '';
    return h;
  }
  A['tc-crear'] = () => {
    const g = D.grupoActual(), con = val('tc-con'), monto = Number(val('tc-monto')) || 0;
    if (!con) { u.toast('Escribe para qué es la cooperación', 'err'); return; }
    const id = u.uid('coop'), guarda = val('tc-guarda');
    S.put(KC(g, id), { id: id, concepto: con, monto: monto, limite: val('tc-lim'), guarda: guarda, nota: val('tc-nota'), creada: u.today(), pagos: {}, exentos: {}, gastos: [] });
    if (guarda) S.update(KT(g), d => { d.guarda = guarda; }, {});
    location.hash = '#/tutoria/coop/' + id; u.toast('Cooperación creada', 'ok');
  };

  /* ---------- cooperaciones: detalle ---------- */
  function coopDet(g, id) {
    const c = S.get(KC(g, id)); if (!c) return card('<p>No encontré esa cooperación.</p>' + link('Ver cooperaciones', 'tutoria/coop', 'primary'));
    const k = T.calc(g, c), f = E.ui.tutF || 'todos';
    let h = '<p><a href="#/tutoria/coop">‹ Cooperaciones</a></p>';
    h += card('<div class="row between gap wrap"><h3>💵 ' + esc(c.concepto) + '</h3>' + btn('Editar', 'tc-editar', 'data-id="' + c.id + '"', 'small ghost') + '</div>' +
      '<p class="small muted">' + (k.monto ? $(k.monto) + ' por alumno' : 'Voluntaria: lo que cada quien pueda') + (c.limite ? ' · fecha límite ' + u.fCorta(c.limite) : '') + (c.guarda ? ' · lo guarda: ' + esc(c.guarda) : '') + (c.nota ? '<br>' + esc(c.nota) : '') + '</p>' +
      '<div class="tut-tiles">' + [['Recaudado', $(k.rec), 'ok'], ['Pendiente', k.esperado ? $(k.pendiente) : '—', k.pendiente ? 'warn' : ''], ['Gastado', $(k.gas), ''], ['En caja', $(k.caja), k.caja < 0 ? 'bad' : 'brand']].map(x => '<div class="tut-tile ' + x[2] + '"><span>' + x[0] + '</span><b>' + x[1] + '</b></div>').join('') + '</div>' +
      '<p class="small">' + k.nOk + ' pagaron · ' + k.nPend + ' pendientes' + (k.nEx ? ' · ' + k.nEx + ' no pagan' : '') + (k.esperado ? ' · esperado ' + $(k.esperado) : '') + '</p>' +
      '<div class="row gap wrap">' + btn(icon('copy') + ' Corte de caja para el grupo', 'tc-corte', 'data-id="' + c.id + '"', 'small') + btn(icon('copy') + ' Pendientes (para tesorería)', 'tc-pend', 'data-id="' + c.id + '"', 'small') + btn(icon('print') + ' Imprimir control', 'tc-print', 'data-id="' + c.id + '"', 'small') + '</div>');
    let filas = k.filas; if (f === 'pend') filas = filas.filter(r => r.st === 'pend' || r.st === 'par'); if (f === 'ok') filas = filas.filter(r => r.st === 'ok');
    h += '<div class="filters">' + [['todos', 'Todos'], ['pend', 'Pendientes (' + k.nPend + ')'], ['ok', 'Pagaron (' + k.nOk + ')']].map(x => '<button type="button" class="tab ' + (f === x[0] ? 'on' : '') + '" data-act="tc-f" data-f="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>';
    h += '<ul class="tut-pagos">' + (filas.length ? filas.map(r => '<li class="' + r.st + '"><span class="num">' + r.a.num + '</span><button type="button" class="tut-nm" data-act="tc-al" data-id="' + c.id + '" data-aid="' + r.a.id + '">' + esc(r.a.nombre) + '<small>' + (r.pg ? $(r.pg) + (r.ult ? ' · ' + u.fCorta(r.ult.f) : '') : '') + (r.st === 'par' ? ' · faltan ' + $(r.falta) : '') + '</small></button>' +
      (r.st !== 'pend' ? '<span class="chip ' + ST[r.st][1] + '">' + ST[r.st][0] + '</span>' : '') + (r.st === 'pend' || r.st === 'par' ? btn('✓ Pagó', 'tc-pago', 'data-id="' + c.id + '" data-aid="' + r.a.id + '"', 'small primary') : '') + '</li>').join('') : '<li class="muted small">Nadie en este filtro.</li>') + '</ul>' +
      '<p class="muted small">"✓ Pagó" registra lo que le falta con fecha de hoy. Toca el nombre para un pago parcial, otra fecha, quitar un pago o marcar que no paga.</p>';
    h += card('<h3>🧾 Gastos</h3>' + ((c.gastos || []).length ? '<ul class="risk">' + c.gastos.map(x => '<li><span>' + esc(x.concepto) + ' <small class="muted">' + u.fCorta(x.f) + (x.nota ? ' · ' + esc(x.nota) : '') + '</small></span><span><b>' + $(x.m) + '</b> ' + btn(icon('trash'), 'tc-gasto-del', 'data-id="' + c.id + '" data-gid="' + x.id + '" aria-label="Borrar gasto"', 'small ghost') + '</span></li>').join('') + '</ul>' : '<p class="muted small">Sin gastos todavía.</p>') +
      '<div class="row gap wrap"><label class="fld grow"><span>Concepto</span><input id="tg-con" placeholder="Cloro, jabón y papel"></label><label class="fld"><span>Monto</span><input id="tg-m" type="number" min="0" step="0.5" inputmode="decimal" style="max-width:110px"></label></div>' +
      '<div class="row gap wrap"><label class="fld"><span>Fecha</span><input id="tg-f" type="date" value="' + u.today() + '"></label><label class="fld grow"><span>Comprobante (opcional)</span><input id="tg-nota" placeholder="Ticket de la tienda, foto en mi galería"></label></div>' +
      btn('Agregar gasto', 'tc-gasto', 'data-id="' + c.id + '"', 'primary'));
    h += '<div class="row end">' + btn(c.cerrada ? '↺ Reabrir' : 'Cerrar cooperación', 'tc-cerrar', 'data-id="' + c.id + '"', 'small ghost') + btn(icon('trash') + ' Borrar', 'tc-borrar', 'data-id="' + c.id + '"', 'small ghost danger') + '</div>';
    return h;
  }
  const upd = (id, fn) => { const g = D.grupoActual(); S.update(KC(g, id), d => { d.pagos = d.pagos || {}; d.exentos = d.exentos || {}; d.gastos = d.gastos || []; fn(d); }, {}); };
  A['tc-f'] = el => { E.ui.tutF = el.dataset.f; E.render(); };
  A['tc-pago'] = el => {
    const g = D.grupoActual(), c = S.get(KC(g, el.dataset.id)); if (!c) return;
    const r = T.calc(g, c).filas.find(x => x.a.id === el.dataset.aid); if (!r) return;
    if (!r.falta) { A['tc-al'](el); return; }
    upd(c.id, d => { (d.pagos[r.a.id] = d.pagos[r.a.id] || []).push({ f: u.today(), m: r.falta }); });
    u.toast(nombreCorto(r.a.nombre) + ': ' + $(r.falta) + ' registrados', 'ok');
  };
  A['tc-al'] = el => {
    const g = D.grupoActual(), c = S.get(KC(g, el.dataset.id)); if (!c) return;
    const r = T.calc(g, c).filas.find(x => x.a.id === el.dataset.aid); if (!r) return;
    const pg = (c.pagos || {})[r.a.id] || [];
    E.modal.open(r.a.nombre, '<p class="small">' + esc(c.concepto) + ' · <span class="chip ' + ST[r.st][1] + '">' + ST[r.st][0] + '</span> · pagado ' + $(r.pg) + (r.falta ? ' · faltan ' + $(r.falta) : '') + '</p>' +
      (pg.length ? '<ul class="risk">' + pg.map((x, i) => '<li><span>' + $(x.m) + ' <small class="muted">' + u.fCorta(x.f) + '</small></span>' + btn('Quitar', 'tc-pago-del', 'data-id="' + c.id + '" data-aid="' + r.a.id + '" data-i="' + i + '"', 'small ghost danger') + '</li>').join('') + '</ul>' : '') +
      '<div class="row gap wrap"><label class="fld"><span>Monto</span><input id="tpay-m" type="number" min="0" step="0.5" inputmode="decimal" value="' + (r.falta || '') + '" style="max-width:120px"></label><label class="fld"><span>Fecha</span><input id="tpay-f" type="date" value="' + u.today() + '"></label></div>' +
      '<div class="row gap wrap">' + btn('Registrar pago', 'tc-pago-add', 'data-id="' + c.id + '" data-aid="' + r.a.id + '"', 'primary') + btn(r.ex ? 'Sí paga' : 'No paga (exentar)', 'tc-exento', 'data-id="' + c.id + '" data-aid="' + r.a.id + '"', 'ghost') + btn('Cerrar', 'modal-close', '', 'ghost') + '</div>' +
      '<p class="muted small">"No paga" lo saca del esperado sin exponerlo. La cooperación es voluntaria.</p>');
  };
  A['tc-pago-add'] = el => {
    const m = Number(val('tpay-m')) || 0, f = val('tpay-f') || u.today(); if (m <= 0) { u.toast('Escribe un monto mayor a 0', 'err'); return; }
    upd(el.dataset.id, d => { (d.pagos[el.dataset.aid] = d.pagos[el.dataset.aid] || []).push({ f: f, m: m }); }); E.modal.close(); u.toast('Pago de ' + $(m) + ' registrado', 'ok');
  };
  A['tc-pago-del'] = el => { upd(el.dataset.id, d => { const l = d.pagos[el.dataset.aid] || []; l.splice(Number(el.dataset.i), 1); if (!l.length) delete d.pagos[el.dataset.aid]; }); E.modal.close(); u.toast('Pago quitado', 'ok'); };
  A['tc-exento'] = el => { upd(el.dataset.id, d => { if (d.exentos[el.dataset.aid]) delete d.exentos[el.dataset.aid]; else d.exentos[el.dataset.aid] = true; }); E.modal.close(); };
  A['tc-gasto'] = el => {
    const con = val('tg-con'), m = Number(val('tg-m')) || 0; if (!con || m <= 0) { u.toast('Escribe el concepto y el monto del gasto', 'err'); return; }
    upd(el.dataset.id, d => { d.gastos.push({ id: u.uid('gas'), f: val('tg-f') || u.today(), concepto: con, m: m, nota: val('tg-nota') }); }); u.toast('Gasto registrado', 'ok');
  };
  A['tc-gasto-del'] = el => { if (!confirm('¿Borrar este gasto?')) return; upd(el.dataset.id, d => { d.gastos = d.gastos.filter(x => x.id !== el.dataset.gid); }); };
  A['tc-cerrar'] = el => upd(el.dataset.id, d => { d.cerrada = !d.cerrada; });
  A['tc-borrar'] = el => { const g = D.grupoActual(); if (!confirm('¿Borrar esta cooperación con todos sus pagos y gastos?')) return; S.del(KC(g, el.dataset.id)); location.hash = '#/tutoria/coop'; };
  A['tc-editar'] = el => {
    const g = D.grupoActual(), c = S.get(KC(g, el.dataset.id)); if (!c) return;
    E.modal.open('Editar cooperación', '<label class="fld"><span>Para qué es</span><input id="te-con" value="' + esc(c.concepto) + '"></label>' +
      '<div class="row gap wrap"><label class="fld"><span>Monto por alumno</span><input id="te-monto" type="number" min="0" step="0.5" value="' + (c.monto || 0) + '"></label><label class="fld"><span>Fecha límite</span><input id="te-lim" type="date" value="' + esc(c.limite || '') + '"></label></div>' +
      '<label class="fld"><span>Quién guarda el dinero</span><input id="te-guarda" value="' + esc(c.guarda || '') + '"></label><label class="fld"><span>Nota</span><input id="te-nota" value="' + esc(c.nota || '') + '"></label>' +
      btn('Guardar', 'tc-editar-ok', 'data-id="' + c.id + '"', 'primary'));
  };
  A['tc-editar-ok'] = el => { const con = val('te-con'); if (!con) return; upd(el.dataset.id, d => { d.concepto = con; d.monto = Number(val('te-monto')) || 0; d.limite = val('te-lim'); d.guarda = val('te-guarda'); d.nota = val('te-nota'); }); E.modal.close(); };
  const copiar = async (txt, ok) => { const r = await u.copy(txt); u.toast(r ? ok : 'No se pudo copiar', r ? 'ok' : 'err'); };
  A['tc-corte'] = el => {
    const g = D.grupoActual(), c = S.get(KC(g, el.dataset.id)); if (!c) return; const k = T.calc(g, c);
    copiar('Corte de caja · ' + c.concepto + ' · ' + g.nombre + ' (al ' + u.fCorta(u.today()) + ')\nRecaudado: ' + $(k.rec) + ' (' + k.nOk + ' compañeros cooperaron)' + ((c.gastos || []).length ? '\nGastos:\n' + c.gastos.map(x => '- ' + x.concepto + ': ' + $(x.m) + ' (' + u.fCorta(x.f) + ')').join('\n') : '\nGastos: ninguno todavía') + '\nEn caja: ' + $(k.caja) + (c.guarda ? '\nLo guarda: ' + c.guarda : '') + '\n¡Gracias a quienes cooperaron!', 'Corte de caja copiado (sin nombres)');
  };
  A['tc-pend'] = el => {
    const g = D.grupoActual(), c = S.get(KC(g, el.dataset.id)); if (!c) return; const k = T.calc(g, c), p = k.filas.filter(r => r.st === 'pend' || r.st === 'par');
    copiar(c.concepto + ' · pendientes (' + p.length + ')\n' + p.map((r, i) => (i + 1) + '. ' + r.a.nombre + (r.falta ? ' (' + $(r.falta) + ')' : '')).join('\n'), 'Pendientes copiados: compártelos solo con tesorería o tu co-tutora');
  };
  A['tc-print'] = el => {
    const g = D.grupoActual(), c = S.get(KC(g, el.dataset.id)); if (!c) return; const k = T.calc(g, c), cf = D.cfg();
    const rows = k.filas.map(r => '<tr><td class="c">' + r.a.num + '</td><td class="nm">' + esc(r.a.nombre) + '</td><td class="c">' + (r.st === 'ex' ? 'No paga' : r.pg ? $(r.pg) : '') + '</td><td class="c">' + (r.ult ? u.fCorta(r.ult.f) : '') + '</td><td></td></tr>').join('');
    E.print.run('<div class="pr"><div class="p-title">CONTROL DE COOPERACIÓN · ' + esc(c.concepto.toUpperCase()) + '</div><p class="tiny c">' + esc(cf.plantelNombre || cf.plantel || '') + ' · Grupo ' + esc(g.nombre) + ' · ' + (k.monto ? $(k.monto) + ' por alumno' : 'Aportación voluntaria') + (c.limite ? ' · Fecha límite: ' + u.fFecha(c.limite) : '') + ' · Tutores: ' + esc(cf.docente) + (T.cfg(g).cotutora ? ' y ' + esc(T.cfg(g).cotutora) : '') + '</p>' +
      '<table class="grid"><thead><tr><th>No.</th><th class="l">NOMBRE</th><th>APORTACIÓN</th><th>FECHA</th><th>FIRMA DE QUIEN RECIBE</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<p class="tiny">Recaudado ' + $(k.rec) + ' · Gastos ' + $(k.gas) + ' · En caja ' + $(k.caja) + '. Aportación voluntaria: no condiciona inscripción, acceso, exámenes, documentos ni el trato a ningún alumno (Ley General de Educación, art. 7, fr. IV).</p>' +
      ((c.gastos || []).length ? '<table class="grid"><thead><tr><th class="l">GASTO</th><th>MONTO</th><th>FECHA</th><th class="l">COMPROBANTE</th></tr></thead><tbody>' + c.gastos.map(x => '<tr><td>' + esc(x.concepto) + '</td><td class="c">' + $(x.m) + '</td><td class="c">' + u.fCorta(x.f) + '</td><td>' + esc(x.nota || '') + '</td></tr>').join('') + '</tbody></table>' : '') +
      '<div class="sig" style="gap:40px"><div>Tesorería del grupo</div><div>' + esc(cf.docente) + '<br>Tutor(a) de grupo</div></div></div>', { title: 'Cooperación ' + c.concepto, margin: '10mm' });
  };

  /* ---------- mi plan de tutoría (tus ideas y actividades) ---------- */
  const formPlan = (g, x) => {
    x = x || {}; const R = RESP(g);
    return '<label class="fld"><span>Qué</span><input id="tp-t" value="' + esc(x.t || '') + '" placeholder="Ej. Cooperación para limpieza de baños"></label>' +
      '<div class="row gap wrap"><label class="fld grow"><span>Tipo</span><select id="tp-tipo">' + Object.keys(TIPOS).map(k => '<option value="' + k + '" ' + (x.tipo === k ? 'selected' : '') + '>' + TIPOS[k] + '</option>').join('') + '</select></label>' +
      '<label class="fld grow"><span>Quién</span><select id="tp-resp">' + Object.keys(R).map(k => '<option value="' + k + '" ' + ((x.resp || 'yo') === k ? 'selected' : '') + '>' + esc(R[k]) + '</option>').join('') + '</select></label>' +
      '<label class="fld"><span>Fecha (opcional)</span><input id="tp-f" type="date" value="' + esc(x.fecha || '') + '"></label></div>' +
      '<label class="fld"><span>Nota (opcional)</span><textarea id="tp-nota" rows="2" placeholder="Detalles, material, acuerdos">' + esc(x.nota || '') + '</textarea></label>';
  };
  function planV(g) {
    const cf = T.cfg(g), pl = (cf.plan || []).slice(), hoy = u.today(), R = RESP(g);
    const item = x => '<li class="tut-it ' + x.estado + '"><button type="button" class="tut-chk" data-act="tp-hecha" data-id="' + x.id + '" aria-label="Marcar como hecha">' + (x.estado === 'hecha' ? '✓' : '') + '</button><div class="tut-itm"><b>' + esc(x.t) + '</b><small class="muted">' + esc(TIPOS[x.tipo] || '') + ' · ' + esc(R[x.resp] || '') + (x.fecha ? ' · ' + u.fCorta(x.fecha) : '') + (x.idea ? ' · del banco de ideas' : '') + '</small>' + (x.nota ? '<small>' + esc(x.nota) + '</small>' : '') + '</div>' +
      btn('✏️', 'tp-edit', 'data-id="' + x.id + '" aria-label="Editar"', 'small ghost') + btn(icon('trash'), 'tp-del', 'data-id="' + x.id + '" aria-label="Borrar"', 'small ghost') + '</li>';
    const pend = pl.filter(x => x.estado !== 'hecha');
    const atras = pend.filter(x => x.fecha && x.fecha < hoy).sort((a, b) => a.fecha.localeCompare(b.fecha));
    const prox = pend.filter(x => x.fecha && x.fecha >= hoy).sort((a, b) => a.fecha.localeCompare(b.fecha));
    const sin = pend.filter(x => !x.fecha), hechas = pl.filter(x => x.estado === 'hecha').sort((a, b) => String(b.hechaF || '').localeCompare(String(a.hechaF || '')));
    let h = card('<h3>📝 Agregar a mi plan de tutoría</h3><p class="muted small">Tus ideas y actividades del grupo. Con fecha aparecen en "Lo que sigue"; sin fecha quedan como idea.</p>' + formPlan(g) + btn('Agregar', 'tp-add', '', 'primary') + ' ' + link('💡 Tomar del banco de ideas', 'tutoria/ideas', ''));
    if (atras.length) h += card('<h3>⏰ Con fecha pasada</h3><ul class="tut-list">' + atras.map(item).join('') + '</ul>');
    h += card('<h3>📅 Próximas</h3>' + (prox.length ? '<ul class="tut-list">' + prox.map(item).join('') + '</ul>' : '<p class="muted small">Nada con fecha próxima.</p>'));
    h += card('<h3>💭 Ideas sin fecha</h3>' + (sin.length ? '<ul class="tut-list">' + sin.map(item).join('') + '</ul>' : '<p class="muted small">Aquí van tus ideas para el grupo.</p>'));
    if (hechas.length) h += card('<details class="sub" id="tp-hechas"><summary>✓ Hechas (' + hechas.length + ')</summary><ul class="tut-list">' + hechas.map(item).join('') + '</ul></details>');
    return h;
  }
  const leerPlan = () => ({ t: val('tp-t'), tipo: val('tp-tipo') || 'actividad', resp: val('tp-resp') || 'yo', fecha: val('tp-f'), nota: val('tp-nota') });
  A['tp-add'] = () => {
    const g = D.grupoActual(), x = leerPlan(); if (!x.t) { u.toast('Escribe qué quieres hacer', 'err'); return; }
    S.update(KT(g), d => { d.plan = d.plan || []; d.plan.push(Object.assign({ id: u.uid('tp'), estado: x.fecha ? 'prog' : 'idea', creada: u.today() }, x)); }, {}); u.toast('Agregado a tu plan', 'ok');
  };
  A['tp-hecha'] = el => { const g = D.grupoActual(); S.update(KT(g), d => { const x = (d.plan || []).find(y => y.id === el.dataset.id); if (!x) return; if (x.estado === 'hecha') { x.estado = x.fecha ? 'prog' : 'idea'; delete x.hechaF; } else { x.estado = 'hecha'; x.hechaF = u.today(); } }, {}); };
  A['tp-del'] = el => { const g = D.grupoActual(); if (!confirm('¿Borrar del plan?')) return; S.update(KT(g), d => { d.plan = (d.plan || []).filter(y => y.id !== el.dataset.id); }, {}); };
  A['tp-edit'] = el => { const g = D.grupoActual(), x = (T.cfg(g).plan || []).find(y => y.id === el.dataset.id); if (!x) return; E.modal.open('Editar', formPlan(g, x) + btn('Guardar', 'tp-edit-ok', 'data-id="' + x.id + '"', 'primary')); };
  A['tp-edit-ok'] = el => {
    const g = D.grupoActual(), n = leerPlan(); if (!n.t) return;
    S.update(KT(g), d => { const x = (d.plan || []).find(y => y.id === el.dataset.id); if (!x) return; Object.assign(x, n); if (x.estado !== 'hecha') x.estado = x.fecha ? 'prog' : 'idea'; }, {}); E.modal.close();
  };
  CH['tut-cfg'] = el => { const g = D.grupoActual(); S.update(KT(g), d => { d[el.dataset.f] = el.value.trim(); }, {}); u.toast('Guardado', 'ok'); };

  /* ---------- banco de ideas ---------- */
  function ideasV(g, cat) {
    cat = cat && E.TUT_CATS.some(c => c[0] === cat) ? cat : 'todas';
    const enPlan = {}; (T.cfg(g).plan || []).forEach(x => { if (x.idea) enPlan[x.idea] = true; });
    let h = card('<h3>💡 Ideas para ser tutor de grupo</h3><p class="muted small">' + I.length + ' ideas prácticas con su fuente (SEP, Ley General de Educación e investigación educativa). Toca "A mi plan" para guardarla en tu plan de tutoría y darle fecha.</p>');
    h += '<div class="filters">' + [['todas', 'Todas']].concat(E.TUT_CATS).map(c => '<a class="tab ' + (cat === c[0] ? 'on' : '') + '" href="#/tutoria/ideas/' + c[0] + '">' + c[1] + '</a>').join('') + '</div>';
    E.TUT_CATS.filter(c => cat === 'todas' || c[0] === cat).forEach(c => {
      const l = I.filter(x => x.cat === c[0]); if (!l.length) return;
      h += card('<h3>' + c[1] + '</h3>' + l.map(x => '<details class="sub est" id="ti-' + x.id + '"><summary><span class="est-ico" aria-hidden="true">' + x.ico + '</span><span class="est-t">' + esc(x.t) + '</span>' + (enPlan[x.id] ? '<span class="chip ok">En tu plan</span>' : '') + '</summary>' +
        '<p class="small">' + esc(x.que) + '</p><ol class="small est-pasos">' + x.pasos.map(p => '<li>' + esc(p) + '</li>').join('') + '</ol><p class="muted small">🕒 ' + esc(x.cuando) + '</p>' +
        '<p class="small est-src"><b>Fuente:</b><br>' + fuentes(x.f) + '</p>' + (enPlan[x.id] ? '' : btn('➕ A mi plan', 'ti-plan', 'data-id="' + x.id + '"', 'small primary')) + '</details>').join(''));
    });
    h += card('<h3>Fuentes</h3><ul class="small est-fuentes">' + Object.keys(FU).map(k => '<li><a href="' + FU[k][1] + '" target="_blank" rel="noopener">' + esc(FU[k][0]) + '</a></li>').join('') + '</ul><p class="muted small">"Meses" es el avance extra promedio en un ciclo escolar que reporta la Education Endowment Foundation al revisar cientos de estudios.</p>');
    return h;
  }
  A['ti-plan'] = el => { const g = D.grupoActual(), x = idea(el.dataset.id); if (!x) return; S.update(KT(g), d => { d.plan = d.plan || []; d.plan.push({ id: u.uid('tp'), t: x.t, tipo: x.tipo, resp: 'yo', fecha: '', nota: x.cuando, estado: 'idea', idea: x.id, creada: u.today() }); }, {}); u.toast('Agregada a tu plan: ponle fecha en Mi plan', 'ok', 4000); };

  /* ---------- seguimiento por alumno ---------- */
  function alumnosV(g) {
    const al = D.alumnos(g), seg = T.seg(g), ale = {}; T.alertas(g).forEach(x => { ale[x.a.id] = x; });
    const cnt = { seg: 0, can: 0 }; al.forEach(a => { const e = (seg[a.id] || {}).estado; if (cnt[e] != null) cnt[e]++; });
    let h = card('<h3>👥 Seguimiento de tutoría</h3><p class="muted small">' + Object.keys(ale).length + ' con señales de alerta · ' + cnt.seg + ' en seguimiento · ' + cnt.can + ' canalizados. Toca un nombre para anotar acuerdos y su estado.</p>');
    h += '<ul class="sf-list tut-seg">' + al.map(a => { const x = ale[a.id], s = seg[a.id] || {}, ul = (s.notas || []).slice(-1)[0]; return '<li class="sf-row"><span class="num">' + a.num + '</span><div class="sf-main"><a href="#/tutoria/alumno/' + a.id + '">' + esc(a.nombre) + '</a><span class="sf-tray">' + (x ? senales(x) : '') + estChip(s.estado) + (ul ? ' <small class="muted">nota ' + u.fCorta(ul.f) + '</small>' : '') + '</span></div></li>'; }).join('') + '</ul>';
    return h;
  }
  function alumnoV(g, aid) {
    const a = D.alumno(g, aid); if (!a) return card('<p>No encontré a este alumno.</p>');
    const s = T.seg(g)[aid] || {}, x = T.alertas(g).find(y => y.a.id === aid);
    let h = '<p><a href="#/tutoria/alumnos">‹ Seguimiento</a></p>';
    h += card('<h3>' + esc(a.nombre) + '</h3><p class="muted small">No. ' + a.num + ' · ' + link('Ficha del alumno', 'alumno/' + aid, 'small') + '</p>' + (x && x.n ? '<p>' + senales(x) + (x.n >= 2 ? ' <b class="badc small">2 o más señales: atención urgente</b>' : '') + '</p>' : '<p class="muted small">Sin señales de alerta en tu módulo.</p>') +
      '<div class="cl-seg">' + Object.keys(SEG).map(k => btn(SEG[k][0], 'ts-estado', 'data-aid="' + aid + '" data-e="' + k + '"', 'small' + ((s.estado || 'ok') === k ? ' on' : ''))).join('') + '</div>');
    h += card('<h3>Notas de tutoría</h3>' + ((s.notas || []).length ? '<ul class="risk">' + s.notas.slice().reverse().map(n => '<li><span><small class="muted">' + u.fCorta(n.f) + '</small><br>' + esc(n.t) + '</span>' + btn(icon('trash'), 'ts-del', 'data-aid="' + aid + '" data-id="' + n.id + '" aria-label="Borrar nota"', 'small ghost') + '</li>').join('') + '</ul>' : '<p class="muted small">Sin notas.</p>') +
      '<label class="fld"><span>Nueva nota</span><textarea id="ts-txt" rows="3" placeholder="Ej. Platicamos: se compromete a entregar la práctica 3 el viernes. Aviso a la familia por mensaje."></textarea></label>' +
      '<p class="note small">Anota solo lo escolar: acuerdos, avances, avisos a la familia y a quién canalizaste y cuándo. No escribas diagnósticos, salud, situación familiar ni detalles de casos delicados; eso lo resguarda orientación.</p>' +
      btn('Guardar nota', 'ts-add', 'data-aid="' + aid + '"', 'primary'));
    return h;
  }
  const updSeg = (aid, fn) => { const g = D.grupoActual(); S.update(KS(g), d => { const s = d[aid] = d[aid] || { notas: [] }; s.notas = s.notas || []; fn(s); }, {}); };
  A['ts-estado'] = el => updSeg(el.dataset.aid, s => { s.estado = el.dataset.e; });
  A['ts-add'] = el => { const t = val('ts-txt'); if (!t) { u.toast('Escribe la nota', 'err'); return; } updSeg(el.dataset.aid, s => { s.notas.push({ id: u.uid('tn'), f: u.today(), t: t }); if (!s.estado || s.estado === 'ok') s.estado = 'seg'; }); u.toast('Nota guardada', 'ok'); };
  A['ts-del'] = el => { if (!confirm('¿Borrar esta nota?')) return; updSeg(el.dataset.aid, s => { s.notas = s.notas.filter(n => n.id !== el.dataset.id); }); };

  /* ---------- resumen para la co-tutora y piezas para otras pantallas ---------- */
  A['tut-resumen'] = () => {
    const g = D.grupoActual(), cf = T.cfg(g), hoy = u.today(), al = T.alertas(g), seg = T.seg(g);
    const coops = T.coops(g).filter(c => !c.cerrada).map(c => { const k = T.calc(g, c); return '• ' + c.concepto + ': ' + $(k.rec) + (k.esperado ? ' de ' + $(k.esperado) : '') + ', ' + k.nPend + ' pendientes, en caja ' + $(k.caja); });
    const prox = (cf.plan || []).filter(x => x.estado !== 'hecha' && x.fecha && x.fecha >= hoy).sort((a, b) => a.fecha.localeCompare(b.fecha)).slice(0, 6).map(x => '• ' + u.fCorta(x.fecha) + ': ' + x.t + ' (' + (RESP(g)[x.resp] || '') + ')');
    const sen = x => [x.sA ? x.A + ' faltas' : '', x.sB ? 'va mal en el Módulo ' + (g.modulo || 'II') : '', x.sC ? 'llamadas de atención' : ''].filter(Boolean).join(', ');
    const txt = 'Tutoría ' + g.nombre + ' · resumen al ' + u.fCorta(hoy) + (cf.cotutora ? '\nPara: ' + cf.cotutora : '') +
      '\n\nAlerta temprana (Módulo ' + (g.modulo || 'II') + ', últimos 30 días):\n' + (al.length ? al.map(x => '• ' + x.a.nombre + (sen(x) ? ': ' + sen(x) : '') + (seg[x.a.id] && seg[x.a.id].estado && seg[x.a.id].estado !== 'ok' ? ' [' + SEG[seg[x.a.id].estado][0].toLowerCase() + ']' : '')).join('\n') : '• Sin señales en mi módulo') +
      '\n\nCooperaciones:\n' + (coops.length ? coops.join('\n') : '• Ninguna activa') + '\n\nPróximas actividades:\n' + (prox.length ? prox.join('\n') : '• Sin fechas') + '\n\n¿Cómo van en tus materias? ¿Alguien más que debamos atender?';
    copiar(txt, 'Resumen copiado (sin notas personales): pégalo en WhatsApp');
  };
  T.alumnoHTML = (g, a) => {
    const s = T.seg(g)[a.id] || {}, x = T.alertas(g).find(y => y.a.id === a.id), ul = (s.notas || []).slice(-1)[0];
    if (!x && !s.estado && !ul) return card('<div class="row between gap wrap"><h3>🧭 Tutoría</h3>' + link('Anotar seguimiento', 'tutoria/alumno/' + a.id, 'small') + '</div><p class="muted small">Sin señales de alerta ni notas de tutoría.</p>');
    return card('<div class="row between gap wrap"><h3>🧭 Tutoría</h3>' + link('Seguimiento', 'tutoria/alumno/' + a.id, 'small') + '</div><p>' + (x ? senales(x) : '') + estChip(s.estado) + '</p>' + (ul ? '<p class="small"><small class="muted">' + u.fCorta(ul.f) + '</small> ' + esc(ul.t) + '</p>' : ''));
  };
  T.resumenHTML = g => {
    const al = T.alertas(g).filter(x => x.n >= 2), coops = T.coops(g).filter(c => !c.cerrada), hoy = u.today();
    const prox = (T.cfg(g).plan || []).filter(x => x.estado !== 'hecha' && x.fecha && x.fecha >= hoy && x.fecha <= u.addDays(hoy, 7));
    if (!al.length && !coops.length && !prox.length) return '';
    return card('<div class="row between gap wrap"><h3>🧭 Tutoría</h3>' + link('Abrir', 'tutoria', 'small') + '</div>' +
      (al.length ? '<p class="small"><b class="badc">Atención urgente:</b> ' + al.map(x => '<a href="#/tutoria/alumno/' + x.a.id + '">' + esc(nombreCorto(x.a.nombre)) + '</a>').join(', ') + '</p>' : '') +
      coops.map(c => { const k = T.calc(g, c); return '<p class="small">💵 ' + esc(c.concepto) + ': ' + $(k.rec) + (k.esperado ? ' de ' + $(k.esperado) : '') + ' · ' + k.nPend + ' pendientes</p>'; }).join('') +
      (prox.length ? '<p class="small">📅 ' + prox.map(x => esc(x.t) + ' (' + u.fCorta(x.fecha) + ')').join(' · ') + '</p>' : ''));
  };
})();
