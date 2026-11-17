/* Escuadra · Para mí como profe (v1.37.0): ideas con respaldo para tener al grupo atento, atraerlos a la mecatrónica y
   crecer como docente y como ejemplo. Incluye retos semanales para marcar, una encuesta anónima para que los alumnos
   opinen de la clase y una reflexión semanal que se guarda en la bitácora. */
(function () {
  const E = window.E, S = E.store, D = E.data, u = E.u, esc = u.esc;
  const V = E.views, A = E.actions, H = E.h, card = H.card, btn = H.btn, link = H.link;
  const PF = E.profe = {}, KR = 'profe:retos';
  const F = {
    rosen: ['Rosenshine (2012). Principles of Instruction. American Educator 36(1)', 'https://www.aft.org/sites/default/files/periodicals/Rosenshine.pdf'],
    watson: ['Watson y col. (2017). Actividad física en el salón y conducta en la tarea (DME = 0.60)', 'https://doi.org/10.1186/s12966-017-0569-9'],
    roediger: ['Roediger y Karpicke (2006). Práctica de recuperación. Psychological Science 17(3)', 'https://doi.org/10.1111/j.1467-9280.2006.01693.x'],
    perry: ['Perry y col. (2021). Ciencia cognitiva en el salón (EEF)', 'https://educationendowmentfoundation.org.uk/education-evidence/evidence-reviews/cognitive-science-approaches-in-the-classroom'],
    cook: ['Cook y col. (2018). Saludo positivo en la puerta', 'https://experts.umn.edu/en/publications/positive-greetings-at-the-door-evaluation-of-a-low-cost-high-yiel/'],
    hulleman: ['Hulleman y Harackiewicz (2009). Valor de utilidad en ciencias de prepa. Science 326(5958)', 'https://doi.org/10.1126/science.1177067'],
    kash: ['Kashefpakdel, Percy y Rehill (2019). Motivated to achieve: charlas de la industria y motivación (Education and Employers)', 'https://www.educationandemployers.org/research/motivated-to-achieve/'],
    kash16: ['Kashefpakdel y Percy (2017). Charlas de carrera a los 14-16 años y empleo a los 26. Journal of Education and Work 30(3)', 'https://researchportal.bath.ac.uk/en/publications/career-education-that-works-an-economic-analysis-using-the-britis/'],
    rohl: ['Röhl (2021). Metaanálisis: la retroalimentación de los alumnos mejora la enseñanza (d = 0.21)', 'https://link.springer.com/chapter/10.1007/978-3-030-75150-0_9'],
    rohl25: ['Metaanálisis (2025): el efecto es mayor cuando el profe platica los resultados con sus alumnos', 'https://phfr.bsz-bw.de/frontdoor/index/index/year/2025/docId/3487'],
    eefpd: ['EEF (2021). Effective Professional Development: aprender, motivarse, practicar la técnica y anclarla', 'https://educationendowmentfoundation.org.uk/news/eef-blog-a-balanced-approach-to-professional-development'],
    roorda: ['Roorda y col. (2011). Relación docente-alumno y compromiso escolar (metaanálisis)', 'https://doi.org/10.3102/0034654311421793'],
    wise: ['Yeager y col. (2014). Retroalimentación sabia', 'https://sparq.stanford.edu/solutions/wise-critiques-help-students-succeed'],
    dweck: ['Mueller y Dweck (1998). Elogiar el esfuerzo y la estrategia', 'https://doi.org/10.1037/0022-3514.75.1.33'],
    conocer: ['CONOCER: EC0217.01 Impartición de cursos de formación del capital humano de manera presencial grupal', 'https://www.ciidet.tecnm.mx/ciidet/pdf/EC0217.pdf']
  };
  PF.F = F;
  PF.SEC = [
    { id: 'atentos', ico: '🎯', t: 'Tenerlos atentos y pegados a la clase', items: [
      ['Arranca con 5 a 8 minutos de repaso', 'Tres o cuatro preguntas de la clase anterior antes del tema nuevo. Activa lo que ya saben y te dice desde dónde empezar.', ['rosen']],
      ['Pasos pequeños y muchas preguntas a todos', 'Explica un poco, pregunta, practican, sigue. Que respondan todos a la vez (dedos, hojas, pizarrón chico) y usa el 🎲 al azar en lugar de esperar manos.', ['rosen']],
      ['Pausas activas de 2 a 5 minutos', 'Cuando los veas dispersos: «🎲 Dinámica rápida» en la clase. Moverse un poco mejora la atención en la tarea.', ['watson']],
      ['Preguntas para recordar, no para calificar', 'Mini quiz sin calificación, boleto de salida o trivia: recordar fija más que volver a leer.', ['roediger', 'perry']],
      ['Algo que se toque en cada tema', 'Una pieza, un componente, un video corto o un reto de 10 minutos. En mecatrónica, lo que se ve y se arma se queda.', []],
      ['Recíbelos en la puerta', 'Por su nombre y con algo positivo. Toma segundos y cambia cómo arranca la clase.', ['cook']]
    ] },
    { id: 'mecatronica', ico: '🤖', t: 'Que se enamoren de la mecatrónica', items: [
      ['Que ellos escriban para qué les sirve', 'Al cerrar un tema: 2 o 3 renglones de cómo lo usarían en su casa o en el trabajo que quieren («¿Para qué me sirve esto?»). Funciona más si lo escriben ellos que si se los dices tú.', ['hulleman']],
      ['Trae la industria al salón', 'Charlas cortas de técnicos e ingenieros (en persona o videollamada), sobre todo para los que dudan. Tu propia experiencia en la industria cuenta: tus historias de planta, de fallas y de clientes enganchan.', ['kash', 'kash16']],
      ['Muestra equipo real', 'Un PLC, un variador, un sensor industrial, una electroválvula: que lo toquen y lo conecten, aunque sea en una demostración.', []],
      ['Proyectos con sentido', 'Que resuelvan algo de su casa, su escuela o su comunidad (riego, alarmas, contadores). El «para qué» engancha más que el «qué».', []],
      ['Egresados que regresen', 'Un exalumno que ya trabaja o estudia ingeniería vale más que cualquier discurso: «si yo pude, tú puedes».', []],
      ['Retos y competencias', 'Torneos de robótica, ferias de ciencia, la Expo de la carrera: una meta pública les da sentido a semanas de práctica.', []]
    ] },
    { id: 'crecer', ico: '🌱', t: 'Crecer como profesor', items: [
      ['Pídeles su opinión de tu clase', 'Encuesta anónima de 2 minutos dos veces por parcial (abajo la puedes imprimir). Después platica con ellos qué vas a cambiar: así el efecto es mayor.', ['rohl', 'rohl25']],
      ['Un cambio a la vez, practicado', 'Elige una sola técnica por semana (los retos de abajo), practícala varias veces y pon un recordatorio. Así se vuelve hábito.', ['eefpd']],
      ['Grábate 10 minutos', 'Con el celular, una parte de tu clase. Fíjate en una sola cosa: cuánto hablas tú vs. ellos, o a quién le preguntas.', []],
      ['Observa a un compañero', 'Pide permiso para ver 20 minutos de otra clase, con un foco concreto (cómo arranca, cómo cierra). Luego invítalo a la tuya.', ['eefpd']],
      ['Bitácora semanal de 5 minutos', '¿Qué funcionó? ¿Qué no? ¿Qué cambio pruebo la próxima semana? (abajo se guarda en tu bitácora).', []],
      ['Certifícate como instructor', 'El estándar EC0217.01 del CONOCER (impartición de cursos) avala tu capacidad para planear, conducir y evaluar; te sirve en la escuela y en la industria.', ['conocer']]
    ] },
    { id: 'ejemplo', ico: '🧑‍🏫', t: 'Ser un mejor ejemplo', items: [
      ['Lo que haces enseña más que lo que dices', 'Puntualidad, orden en tu mesa de trabajo, equipo de protección siempre puesto y cumplir lo que prometes.', []],
      ['Equivócate en voz alta', 'Cuando algo no te sale, di cómo lo vas a resolver. Les enseñas que el error es parte del oficio (y que no pasa nada).', ['dweck']],
      ['Exige mucho y diles que confías en ellos', '«Te lo corrijo porque sé que puedes lograrlo»: expectativas altas con apoyo.', ['wise']],
      ['Cuida la relación', 'La buena relación con el profe se asocia con más compromiso, sobre todo en grados altos. Reconoce en público, corrige en privado y empieza de cero cada clase.', ['roorda']],
      ['Cuida tu energía', 'Descansa, pon límites a la hora de trabajo y celebra lo que sí sale. Un profe agotado no contagia ganas.', []]
    ] }
  ];
  PF.RETOS = [
    ['saludo', 'Saluda a cada alumno por su nombre en la puerta, toda la semana'], ['repaso', 'Abre cada clase con 3 preguntas de repaso'], ['pausa', 'Usa una pausa activa de 2 a 5 minutos por clase'],
    ['todos', 'Haz que respondan todos a la vez al menos 3 veces por clase'], ['utilidad', 'Cierra un tema con «¿Para qué me sirve esto?»'], ['encuesta', 'Aplica la encuesta anónima y comparte qué cambiarás'],
    ['grabate', 'Grábate 10 minutos y fíjate en una sola cosa'], ['industria', 'Invita a alguien de la industria (videollamada vale)'], ['2x10', 'Haz el 2×10 con un alumno con el que la relación esté difícil'],
    ['sabia', 'Corrige con retroalimentación sabia (expectativas altas + confianza)'], ['observa', 'Observa 20 minutos la clase de un compañero'], ['balance', 'Revisa tu bitácora y escribe tus 3 aprendizajes del parcial']
  ];
  const src = ks => ks.length ? '<p class="small est-src">' + ks.map(k => '<a href="' + F[k][1] + '" target="_blank" rel="noopener">' + esc(F[k][0]) + '</a>').join('<br>') + '</p>' : '';
  PF.retos = () => S.get(KR) || {};
  A['pf-reto'] = el => { const id = el.dataset.id; S.update(KR, d => { if (d[id]) delete d[id]; else d[id] = u.today(); }, {}); };
  A['pf-encuesta'] = () => {
    const q = ['Entiendo lo que el profe explica', 'En esta clase aprendo cosas útiles para mi carrera', 'El profe me trata con respeto', 'Me dan ganas de participar', 'Las prácticas y retos me ayudan a aprender', 'El profe me ayuda cuando no entiendo'];
    const una = '<div class="pf-enc"><b>¿Cómo va la clase? (anónima)</b><p class="tiny">Marca de 1 (nada) a 5 (mucho). No escribas tu nombre.</p><table>' + q.map(t => '<tr><td>' + esc(t) + '</td><td class="vd-esc">1 2 3 4 5</td></tr>').join('') + '</table><p class="tiny"><b>Lo que más me ayuda a aprender en esta clase:</b></p><div class="vd-l"></div><p class="tiny"><b>Lo que cambiaría:</b></p><div class="vd-l"></div></div>';
    E.print.run('<div class="pr pf-encs">' + una + una + '</div>', { title: 'Encuesta anónima de la clase', unaHoja: true, margin: '8mm' });
  };
  A['pf-reflex'] = () => { const t = ((document.getElementById('pf-r') || {}).value || '').trim(); if (!t) { u.toast('Escribe tu reflexión', 'err'); return; }
    const g = D.grupoActual(), id = u.uid('bit'); S.put('bit:' + id, { id: id, fecha: u.today(), grupoId: g ? g.id : '', texto: 'Reflexión docente: ' + t }); document.getElementById('pf-r').value = ''; u.toast('Guardada en tu bitácora', 'ok'); };
  V.profe = () => {
    const r = PF.retos(), hechos = PF.RETOS.filter(x => r[x[0]]).length;
    let h = card('<h3>🌱 Para mí como profe</h3><p class="small">Ideas con respaldo para tener al grupo atento, que se enamoren de la mecatrónica y para crecer tú. No es una lista para hacer todo de golpe: elige un reto por semana.</p><p class="small"><b>' + hechos + ' de ' + PF.RETOS.length + '</b> retos hechos.</p>' +
      '<div class="row gap wrap">' + link('🎲 Dinámicas', 'dinamicas', 'small') + link('🧭 Test de vida y carrera', 'vida', 'small') + btn('🖨 Encuesta anónima', 'pf-encuesta', '', 'small') + '</div>');
    PF.SEC.forEach(s => { h += card('<details class="sub"' + (s.id === 'atentos' ? ' open' : '') + '><summary>' + s.ico + ' ' + esc(s.t) + '</summary><ul class="pf-list">' + s.items.map(it => '<li><b>' + esc(it[0]) + '.</b> ' + esc(it[1]) + src(it[2]) + '</li>').join('') + '</ul></details>'); });
    h += card('<h3>✅ Retos semanales</h3><p class="small muted">Uno por semana. Tócalo cuando lo hayas hecho.</p><ul class="pf-retos">' + PF.RETOS.map((x, i) => '<li>' + btn((r[x[0]] ? '✅' : '⬜') + ' Semana ' + (i + 1) + ': ' + esc(x[1]) + (r[x[0]] ? ' <small class="muted">· ' + esc(u.fCorta(r[x[0]])) + '</small>' : ''), 'pf-reto', 'data-id="' + x[0] + '"', 'ghost pf-rb' + (r[x[0]] ? ' on' : '')) + '</li>').join('') + '</ul>');
    h += card('<h3>📝 Mi reflexión de la semana</h3><p class="small muted">¿Qué funcionó? ¿Qué no? ¿Qué cambio pruebo la próxima semana?</p><label class="fld"><span>Reflexión</span><textarea id="pf-r" rows="3"></textarea></label>' + btn('Guardar en mi bitácora', 'pf-reflex', '', 'primary'));
    return { t: 'Para mí como profe', h: h };
  };
})();
