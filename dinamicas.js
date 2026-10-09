/* Escuadra · Dinámicas y convivencia: actividades para integrar al grupo, desarrollar capacidades (habilidades
   socioemocionales y técnicas), mejorar la relación docente-alumno y que se sientan mejor consigo mismos.
   Recomienda según objetivo, tiempo, lugar y cómo está el grupo; se proyecta, se da con temporizador y se registra. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link, icon = E.icon;
  const DN = E.dinamicas = {};
  const KD = g => 'dinam:' + g.id;
  const val = id => ((document.getElementById(id) || {}).value || '').trim();

  /* ---------- fuentes ---------- */
  const EEF = 'https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/';
  const FU = E.FUENTES_DIN = {
    ct: ['SEP-SEMS y PNUD. Construye T: seis habilidades socioemocionales para la educación media superior', 'https://www.undp.org/es/node/290216'],
    dgb: ['SEP-DGB (2025). Orientaciones para el abordaje de la Formación Socioemocional en el aula', 'https://dgb.sep.gob.mx/storage/recursos/2025/06/FyHNentp2H-Orientaciones-para-el-abordaje-de-la-formacion-socioemocional-en-el-aula.pdf'],
    sel: ['EEF · Aprendizaje socioemocional (+3 meses en promedio, +5 en secundaria y bachillerato; evidencia moderada)', EEF + 'social-and-emotional-learning'],
    colab: ['EEF · Aprendizaje colaborativo (+5 meses; evidencia baja; mejor con tareas estructuradas, roles y equipos de 3 a 5)', EEF + 'collaborative-learning-approaches'],
    fb: ['EEF · Retroalimentación (+6 meses, evidencia alta)', EEF + 'feedback'],
    cook: ['Cook y col. (2018). Positive Greetings at the Door. Journal of Positive Behavior Interventions, 20(3)', 'https://experts.umn.edu/en/publications/positive-greetings-at-the-door-evaluation-of-a-low-cost-high-yiel/'],
    wise: ['Yeager y col. (2014). Retroalimentación "sabia": expectativas altas + confianza en el alumno', 'https://sparq.stanford.edu/solutions/wise-critiques-help-students-succeed'],
    roorda: ['Roorda y col. (2011). La relación docente-alumno y el compromiso escolar (metaanálisis de 99 estudios). Review of Educational Research', 'https://doi.org/10.3102/0034654311421793'],
    jigsaw: ['Aronson. The Jigsaw Classroom (rompecabezas de expertos)', 'https://www.jigsaw.org'],
    wujec: ['Wujec (2010). Build a tower, build a team (reto del malvavisco). TED', 'https://www.ted.com/talks/tom_wujec_build_a_tower_build_a_team'],
    bandura: ['Bandura (1977). Autoeficacia: la confianza crece con logros propios y con el ánimo de otros. Psychological Review', 'https://doi.org/10.1037/0033-295X.84.2.191'],
    dweck: ['Mueller y Dweck (1998). Elogiar el esfuerzo y la estrategia, no la inteligencia', 'https://doi.org/10.1037/0022-3514.75.1.33']
  };

  /* ---------- objetivos y capacidades ---------- */
  DN.OBJ = [['integrar', '🤝 Integrar al grupo'], ['capacidad', '🚀 Desarrollar una capacidad'], ['relacion', '🧑‍🏫 Mejorar la relación contigo'], ['confianza', '💪 Que se sientan mejor consigo mismos'], ['calma', '🌿 Calmar y enfocar al grupo']];
  DN.CAP = [
    { id: 'comunicar', ico: '🗣️', t: 'Comunicarse y hablar en público', ct: 'Relaciona T', ruta: ['dictado', 'escucha', 'pitch', 'jigsaw'] },
    { id: 'colaborar', ico: '🧩', t: 'Trabajo en equipo', ct: 'Colaboración (Relaciona T)', ruta: ['roles', 'torre', 'puente', 'jigsaw'] },
    { id: 'empatia', ico: '🫶', t: 'Ponerse en el lugar del otro', ct: 'Conciencia social (Relaciona T)', ruta: ['comun', 'escucha', 'ciegas', 'telarana'] },
    { id: 'conocerse', ico: '🪞', t: 'Conocerse a sí mismo', ct: 'Autoconocimiento (Conoce T)', ruta: ['mueve', 'objeto', 'fortalezas', 'carta'] },
    { id: 'emociones', ico: '🌡️', t: 'Manejar sus emociones', ct: 'Autorregulación (Conoce T)', ruta: ['respira', 'termometro', 'error', 'escucha'] },
    { id: 'liderar', ico: '🧭', t: 'Liderazgo y decisiones', ct: 'Toma responsable de decisiones (Elige T)', ruta: ['roles', 'decide', 'consejo', 'pitch'] },
    { id: 'perseverar', ico: '🧗', t: 'Perseverar ante lo difícil', ct: 'Perseverancia (Elige T)', ruta: ['antes', 'error', 'puente', 'carta'] },
    { id: 'crear', ico: '💡', t: 'Creatividad', ct: 'Habilidad técnica del perfil de egreso', ruta: ['usos', 'scamper', 'invento', 'torre'] }
  ];
  const capT = id => (DN.CAP.find(c => c.id === id) || {}).t || id;
  const ANIMO = [['normal', 'Normal'], ['apagado', 'Apagado o cansado'], ['inquieto', 'Inquieto, con mucha energía'], ['tenso', 'Tenso o con algún conflicto']];

  /* ---------- catálogo ---------- */
  // obj: objetivos y capacidades que trabaja · min: duración · en: energía (calma, media, alta) · lugar: aula, patio
  const L = E.DINAMICAS = [
    { id: 'presenta', ico: '🙋', t: 'Nombre y algo que sé hacer con las manos', obj: ['integrar', 'conocerse', 'comunicar', 'confianza'], min: 10, en: 'calma', lugar: ['aula', 'patio'], grupo: 'Todo el grupo', riesgo: 'bajo', mat: '',
      para: 'Que se aprendan los nombres y descubran habilidades útiles para el taller.', alumnos: 'Conocer qué sabe hacer cada quien: puede ser tu próximo compañero de equipo.',
      pasos: [[1, 'Explica la regla: nombre y algo que sabes hacer con las manos (armar, reparar, cocinar, dibujar). Tú empiezas.'], [7, 'Ronda rápida: 15 segundos cada quien. Anota las habilidades en el pizarrón.'], [2, 'Cierre: ¿qué habilidades del pizarrón nos sirven para el proyecto?']],
      instr: ['Di tu nombre', 'Di algo que sabes hacer con las manos', 'Máximo 15 segundos'], cierre: ['¿Quién tiene una habilidad que le serviría a tu equipo?', '¿Qué habilidad te gustaría aprender este semestre?'],
      cuidar: ['Si alguien se queda en blanco, ayúdale con opciones; nadie se queda trabado frente al grupo.'], f: ['ct'] },
    { id: 'bingo', ico: '🎯', t: 'Bingo humano de mecatrónica', obj: ['integrar', 'comunicar'], min: 15, en: 'alta', lugar: ['aula', 'patio'], grupo: 'Todo el grupo', riesgo: 'bajo', mat: 'Hoja de bingo (botón "Imprimir bingo": cada hoja sale distinta)', hoja: true,
      para: 'Que hablen con compañeros con los que casi no conviven.', alumnos: 'Encuentra a un compañero distinto para cada casilla.',
      pasos: [[2, 'Reparte las hojas y explica: una firma por compañero, sin repetir nombres.'], [10, 'Se levantan y buscan firmas. Gana quien complete una línea; luego, la hoja.'], [3, 'Cierre: lee 3 casillas y pregunta quién firmó; que lo cuente en una frase.']],
      instr: ['Busca a alguien que cumpla cada casilla', 'Que firme en esa casilla', 'Un compañero distinto por casilla', 'Gana quien complete una línea'], cierre: ['¿Qué descubriste de alguien con quien casi no hablas?', '¿A quién buscarías para tu equipo y por qué?'],
      cuidar: ['Las casillas no tocan temas personales (familia, dinero, apariencia).'], f: ['ct'] },
    { id: 'comun', ico: '🔗', t: 'Tres cosas en común', obj: ['integrar', 'empatia'], min: 10, en: 'media', lugar: ['aula', 'patio'], grupo: 'Parejas al azar', riesgo: 'bajo', mat: '',
      para: 'Mezclar subgrupos y descubrir que tienen más en común de lo que creen.', alumnos: 'Con tu pareja, encuentra 3 cosas en común que no se vean a simple vista.',
      pasos: [[1, 'Forma parejas al azar (botón Formar equipos, de 2) con alguien con quien casi no hablan.'], [6, 'Buscan 3 cosas en común que no se noten (no vale "los dos somos de 3°A").'], [3, 'Cuatro o cinco parejas comparten la más sorprendente.']],
      instr: ['Busquen 3 cosas en común', 'Que no se vean a simple vista', 'Elijan la más sorprendente'], cierre: ['¿Qué te sorprendió?', '¿Fue fácil o difícil encontrar coincidencias?'],
      cuidar: ['Parejas al azar para que no se junten siempre los mismos.'], f: ['ct'] },
    { id: 'torre', ico: '🗼', t: 'Torre de espagueti y malvavisco', obj: ['integrar', 'colaborar', 'crear', 'perseverar'], min: 30, en: 'alta', lugar: ['aula'], grupo: 'Equipos de 4', riesgo: 'bajo', mat: 'Por equipo: 20 espaguetis, 90 cm de cinta, 90 cm de hilo y 1 malvavisco',
      para: 'Trabajo en equipo y prototipar: los equipos que prueban pronto ganan.', alumnos: 'La torre más alta que sostenga el malvavisco en la punta. 18 minutos.',
      pasos: [[3, 'Reparte el material y explica: el malvavisco va arriba, se mide desde la mesa y al final nadie la sostiene.'], [18, 'Construyen. Avisa a los 9, 5 y 1 minutos.'], [2, 'Mide las torres que siguen en pie.'], [7, 'Cierre: ¿qué hicieron distinto los que ganaron? Conecta con prototipar rápido, probar antes y corregir.']],
      instr: ['La torre más alta que se sostenga sola', 'El malvavisco va en la punta', 'Pueden romper espaguetis y usar la cinta y el hilo', '18 minutos'], cierre: ['¿Cuándo pusieron el malvavisco? ¿Qué pasó?', '¿Quién tomó las decisiones en su equipo?', '¿Qué harían distinto en su proyecto de mecanismo?'],
      cuidar: ['Que nadie se quede mirando: cada integrante con una tarea.'], f: ['wujec', 'colab'] },
    { id: 'linea', ico: '🤫', t: 'Fila sin palabras', obj: ['integrar', 'comunicar', 'colaborar'], min: 10, en: 'media', lugar: ['aula', 'patio'], grupo: 'Todo el grupo', riesgo: 'bajo', mat: '',
      para: 'Comunicación no verbal y cooperación de todo el grupo.', alumnos: 'Fórmense por fecha de cumpleaños sin hablar.',
      pasos: [[1, 'Reto: ordenarse en una fila por día y mes de cumpleaños, sin hablar ni escribir.'], [6, 'Lo resuelven solo con señas.'], [3, 'Verifican diciendo su fecha en voz alta y cierre.']],
      instr: ['Fórmense por fecha de cumpleaños (día y mes)', 'Sin hablar ni escribir', 'Solo con señas'], cierre: ['¿Cómo se pusieron de acuerdo sin hablar?', '¿Quién ayudó a organizar?', '¿En el taller cuándo necesitas señas en lugar de palabras?'],
      cuidar: ['Si alguien prefiere no decir su fecha, usen su número favorito (nunca estatura ni peso).'], f: ['ct'] },
    { id: 'objeto', ico: '🎒', t: 'El objeto que me representa', obj: ['integrar', 'conocerse', 'confianza'], min: 20, en: 'calma', lugar: ['aula'], grupo: 'Equipos de 4', riesgo: 'bajo', mat: 'Un objeto o foto que cada quien trae (o elige de su mochila)',
      para: 'Que se conozcan más allá de la escuela, en grupos pequeños donde es más fácil hablar.', alumnos: 'Muestra un objeto y cuenta por qué te representa (1 minuto).',
      pasos: [[2, 'Explica: cada quien muestra un objeto y dice por qué lo representa. Tú empiezas.'], [12, 'En equipos de 4 cada uno comparte; los demás le hacen una pregunta.'], [6, 'Cada equipo comparte algo que aprendió de un compañero, con su permiso.']],
      instr: ['Muestra tu objeto', 'Cuenta por qué te representa', 'Tu equipo te hace una pregunta'], cierre: ['¿Qué aprendiste de alguien que no sabías?', '¿Te costó hablar de ti? ¿Por qué?'],
      cuidar: ['Derecho a pasar: puede elegir cualquier objeto de su mochila y contar algo sencillo.'], f: ['ct'] },
    { id: 'telarana', ico: '🕸️', t: 'Telaraña de reconocimientos', obj: ['integrar', 'confianza', 'empatia'], min: 20, en: 'calma', lugar: ['aula', 'patio'], grupo: 'Todo el grupo', riesgo: 'medio', mat: 'Una bola de estambre',
      para: 'Que cada quien reciba un reconocimiento de un compañero; cierra bien un parcial o un proyecto.', alumnos: 'Lanza el estambre y reconoce algo concreto de un compañero.',
      pasos: [[2, 'En círculo. Tú empiezas: lanzas el estambre a alguien y le reconoces algo concreto ("me ayudó a…").'], [15, 'Quien recibe sostiene su parte del hilo y lo lanza a alguien que aún no tiene hilo.'], [3, 'Al final todos sostienen la red: si uno suelta, se cae. Cierre.']],
      instr: ['Lanza el estambre a alguien que aún no tiene hilo', 'Dile algo concreto que le reconoces', 'Sostén tu parte de la red'], cierre: ['¿Cómo te sentiste al recibir tu reconocimiento?', '¿Qué pasa con la red si alguien la suelta? ¿Y con el grupo?'],
      cuidar: ['Regla: solo a quien no tiene hilo, para que nadie quede fuera.', 'Reconocimientos sobre acciones, nunca sobre apariencia.'], f: ['ct'] },
    { id: 'dictado', ico: '✏️', t: 'Dibujo dictado de espaldas', obj: ['comunicar', 'empatia'], min: 15, en: 'media', lugar: ['aula'], grupo: 'Parejas', riesgo: 'bajo', mat: 'Hojas y lápiz; una figura de Temas en el celular de quien describe',
      para: 'Comunicación precisa: es lo mismo que leer y explicar un plano.', alumnos: 'Describe la figura sin decir qué es; tu pareja la dibuja sin verla.',
      pasos: [[2, 'Parejas espalda con espalda. A ve una figura (de Temas) y la describe; B dibuja sin verla.'], [4, 'Primera ronda: B no puede preguntar.'], [4, 'Segunda ronda con otra figura: ahora B sí puede preguntar.'], [5, 'Comparan dibujos y cierre.']],
      instr: ['Espalda con espalda', 'Quien ve la figura la describe sin decir qué es', 'Quien dibuja no la ve', 'Ronda 2: ya se vale preguntar'], cierre: ['¿Qué ronda salió mejor y por qué?', '¿Qué palabras ayudaron más (medidas, posición, formas)?', '¿Qué tiene que ver con leer un plano?'],
      cuidar: ['Que se rían con su pareja, no de su pareja.'], f: ['colab'] },
    { id: 'pitch', ico: '🎤', t: 'Pitch de 60 segundos', obj: ['comunicar', 'confianza', 'liderar'], min: 20, en: 'media', lugar: ['aula'], grupo: 'Equipos de 4', riesgo: 'medio', mat: '',
      para: 'Hablar frente a otros en algo corto y preparado; la confianza sube con cada intento.', alumnos: 'En 60 segundos: qué es tu proyecto, para qué sirve y por qué es buena idea.',
      pasos: [[5, 'Cada quien prepara 60 segundos sobre su mecanismo o proyecto.'], [10, 'En equipos de 4 cada uno presenta; los demás dan 2 estrellas (lo que estuvo bien) y 1 deseo (algo a mejorar).'], [5, 'Voluntarios presentan al grupo.']],
      instr: ['60 segundos: qué es, para qué sirve, por qué es buena idea', 'Tu equipo te da 2 estrellas y 1 deseo'], cierre: ['¿Qué te ayudó a hablar con más seguridad?', '¿Qué deseo vas a trabajar para la próxima?'],
      cuidar: ['Primero en equipo pequeño; frente al grupo, solo voluntarios.', 'Las estrellas van antes que el deseo.'], f: ['ct', 'fb'] },
    { id: 'escucha', ico: '👂', t: 'Escucha activa en tríos', obj: ['comunicar', 'empatia', 'emociones'], min: 15, en: 'calma', lugar: ['aula'], grupo: 'Tríos', riesgo: 'bajo', mat: '',
      para: 'Aprender a escuchar sin interrumpir y a confirmar lo que entendieron.', alumnos: 'Uno habla, otro escucha y repite con sus palabras, otro observa.',
      pasos: [[2, 'Roles: A habla, B escucha y repite con sus palabras, C observa.'], [9, 'Tres rondas de 3 minutos; rotan roles. Tema: "algo que construí, arreglé o aprendí a hacer".'], [4, 'Los observadores comparten qué vieron que funcionó.']],
      instr: ['A habla 2 minutos', 'B escucha sin interrumpir y repite lo que entendió', 'C observa', 'Rotan los roles'], cierre: ['¿Cómo se siente que te repitan bien lo que dijiste?', '¿Qué hace que alguien escuche de verdad?'],
      cuidar: ['El tema es de la escuela o de algo que hicieron, no de su vida privada.'], f: ['ct'] },
    { id: 'jigsaw', ico: '🧩', t: 'Rompecabezas de expertos', obj: ['colaborar', 'comunicar', 'empatia', 'integrar'], min: 50, en: 'media', lugar: ['aula'], grupo: 'Equipos de 4', riesgo: 'bajo', mat: 'Un tema dividido en 4 partes (por ejemplo, 4 tipos de mecanismos)',
      para: 'Cada alumno es necesario: aprende su parte y la enseña. Mejora la convivencia y el aprendizaje.', alumnos: 'Te vuelves experto en una parte y se la enseñas a tu equipo.',
      pasos: [[3, 'Equipos base de 4. Cada integrante recibe una parte distinta del tema.'], [15, 'Grupos de expertos: se juntan los que tienen la misma parte, la estudian y preparan cómo enseñarla.'], [20, 'Regresan a su equipo base y cada experto enseña su parte (5 minutos cada uno).'], [12, 'Mini examen individual de las 4 partes y cierre.']],
      instr: ['Estudia tu parte con los otros expertos', 'Prepara cómo enseñarla en 5 minutos', 'Regresa y enséñala a tu equipo', 'Al final hay un mini examen de todo'], cierre: ['¿Cómo te fue enseñando a tus compañeros?', '¿Qué pasó cuando alguien no preparó bien su parte?'],
      cuidar: ['Revisa a los grupos de expertos para que todos lleven su parte bien entendida.'], f: ['jigsaw', 'colab'] },
    { id: 'roles', ico: '🎭', t: 'Equipo con roles que rotan', obj: ['colaborar', 'liderar'], min: 10, en: 'media', lugar: ['aula', 'patio'], grupo: 'Equipos de 4', riesgo: 'bajo', mat: '',
      para: 'Que nadie cargue con todo ni nadie se esconda. Úsalo al inicio de cada práctica.', alumnos: 'Cada quien tiene un rol en la práctica de hoy.',
      pasos: [[3, 'Asigna roles: coordinación, material y seguridad, bitácora, vocería.'], [2, 'Cada rol lee su tarjeta (proyéctalas).'], [5, 'Al final de la práctica, cada rol dice en una frase cómo le fue.']],
      instr: ['Coordinación: reparte tareas y cuida el tiempo', 'Material y seguridad: pide, cuida y regresa el material', 'Bitácora: anota decisiones, medidas y errores', 'Vocería: presenta los resultados'], cierre: ['¿Qué rol te costó más?', '¿Qué rol quieres probar la próxima vez?'],
      cuidar: ['Rota los roles en cada práctica.'], f: ['colab'] },
    { id: 'puente', ico: '🌉', t: 'Puente de una hoja', obj: ['colaborar', 'crear', 'perseverar'], min: 25, en: 'alta', lugar: ['aula'], grupo: 'Equipos de 3', riesgo: 'bajo', mat: 'Por equipo: 1 hoja carta, 30 cm de cinta y monedas o rondanas',
      para: 'Estructuras con muy poco material: prueban, fallan y mejoran.', alumnos: 'Un puente de una hoja que sostenga el mayor número de monedas.',
      pasos: [[2, 'Reto: con una hoja y 30 cm de cinta, un puente entre dos libros separados 15 cm que sostenga el mayor número de monedas.'], [15, 'Construyen y prueban.'], [3, 'Prueba final frente al grupo.'], [5, 'Cierre: ¿qué formas resistieron más? (pliegues, triángulos).']],
      instr: ['Una hoja y 30 cm de cinta', 'Entre dos libros separados 15 cm', 'Gana el que sostenga más monedas'], cierre: ['¿Qué cambió entre su primer intento y el último?', '¿Qué tiene que ver con los triángulos de las estructuras?'],
      cuidar: [], f: ['colab'] },
    { id: 'ciegas', ico: '🙈', t: 'Armado a ciegas', obj: ['colaborar', 'comunicar', 'empatia'], min: 20, en: 'media', lugar: ['aula'], grupo: 'Equipos de 3', riesgo: 'bajo', mat: 'Paliacate o antifaz y una pluma de clic desarmada (u otro objeto sencillo)',
      para: 'Confianza y comunicación clara: uno arma con los ojos tapados guiado por la voz de su equipo.', alumnos: 'Uno arma con los ojos tapados; su equipo lo guía solo con palabras.',
      pasos: [[2, 'Uno se tapa los ojos; los otros dos solo pueden hablar, no tocar.'], [12, 'Arman la pluma desarmada. Rotan.'], [6, 'Cierre.']],
      instr: ['Uno arma con los ojos tapados', 'Los demás solo guían con palabras', 'Nadie toca las piezas excepto quien arma', 'Rotan'], cierre: ['¿Qué instrucciones sirvieron y cuáles no?', '¿Cómo se siente depender de otros?'],
      cuidar: ['Nada filoso ni caliente; quien tiene los ojos tapados no se levanta.', 'Si alguien no quiere taparse los ojos, que los cierre o que sea guía.'], f: ['ct'] },
    { id: 'usos', ico: '📎', t: 'Cien usos de un clip', obj: ['crear'], min: 15, en: 'media', lugar: ['aula'], grupo: 'Equipos de 4', riesgo: 'bajo', mat: 'Un clip por equipo',
      para: 'Pensar en muchas ideas antes de elegir: primero cantidad, luego calidad.', alumnos: 'La mayor cantidad de usos para un clip en 4 minutos. Sin criticar.',
      pasos: [[1, 'Reto: la mayor cantidad de usos para un clip en 4 minutos. No se vale criticar.'], [4, 'Lluvia de ideas.'], [5, 'Eligen el uso más útil y lo dibujan como invento.'], [5, 'Comparten y cierre.']],
      instr: ['Todos los usos que se les ocurran', '4 minutos', 'No se vale criticar', 'Luego eligen el más útil'], cierre: ['¿Las mejores ideas salieron al principio o al final?', '¿Qué pasa con las ideas cuando alguien critica muy pronto?'],
      cuidar: [], f: ['ct'] },
    { id: 'scamper', ico: '🔧', t: 'Mejora un objeto (SCAMPER)', obj: ['crear', 'colaborar'], min: 25, en: 'media', lugar: ['aula'], grupo: 'Equipos de 4', riesgo: 'bajo', mat: 'Un objeto común por equipo: engrapadora, lapicera, cargador',
      para: 'Creatividad con método: 7 preguntas para mejorar cualquier cosa.', alumnos: 'Usen las 7 preguntas para mejorar su objeto.',
      pasos: [[3, 'Proyecta las 7 preguntas de SCAMPER.'], [12, 'Cada equipo las aplica a su objeto y elige la mejor mejora.'], [10, 'Boceto y presentación de 1 minuto.']],
      instr: ['Sustituir: ¿qué material o pieza cambio?', 'Combinar: ¿con qué lo junto?', 'Adaptar: ¿qué idea de otra cosa le copio?', 'Modificar: ¿qué agrando, achico o cambio de forma?', 'Poner otro uso: ¿para qué más sirve?', 'Eliminar: ¿qué le quito?', 'Reordenar: ¿qué cambio de orden o de lugar?'], cierre: ['¿Qué pregunta les dio la mejor idea?', '¿Cómo la usarían en su proyecto?'],
      cuidar: [], f: ['ct'] },
    { id: 'invento', ico: '🛠️', t: 'Si no hubiera límites', obj: ['crear', 'conocerse', 'colaborar'], min: 30, en: 'media', lugar: ['aula'], grupo: 'Equipos de 4', riesgo: 'bajo', mat: 'Hojas grandes y plumones',
      para: 'Unir sus intereses en un invento; parte de lo que escribieron en "Lo que me mueve".', alumnos: 'Combinen sus ideas en un solo invento y dibújenlo con sus partes.',
      pasos: [[5, 'Cada quien escribe un invento que haría si no hubiera límites.'], [15, 'En equipo combinan sus ideas en un solo invento y lo dibujan con sus partes (mecanismos, sensores, motores).'], [10, 'Presentan en 1 minuto; el grupo dice qué parte ya podrían construir.']],
      instr: ['Cada quien: un invento sin límites', 'En equipo: combínenlos en uno', 'Dibújenlo con sus partes', 'Preséntenlo en 1 minuto'], cierre: ['¿Qué parte de su invento ya podrían hacer con lo que saben?', '¿Qué tendrían que aprender?'],
      cuidar: [], f: ['ct'] },
    { id: 'decide', ico: '⚖️', t: 'Decidir en equipo con criterios', obj: ['liderar', 'colaborar'], min: 20, en: 'calma', lugar: ['aula'], grupo: 'Equipos de 4', riesgo: 'bajo', mat: '',
      para: 'Tomar decisiones con criterios, no por quien grita más.', alumnos: 'Elijan con una tabla de criterios, no por votación rápida.',
      pasos: [[3, 'Plantea una decisión real: qué material usar para la base del proyecto (cartón, MDF o acrílico).'], [10, 'Cada equipo hace una tabla: opciones contra criterios (costo, rigidez, facilidad, seguridad) y califica de 1 a 3.'], [7, 'Comparan y explican su elección.']],
      instr: ['Escriban las opciones', 'Escriban los criterios', 'Califiquen cada opción de 1 a 3', 'Gana la que sume más; expliquen por qué'], cierre: ['¿La decisión cambió al usar criterios?', '¿Cómo decidían antes?'],
      cuidar: [], f: ['ct'] },
    { id: 'consejo', ico: '🏛️', t: 'Consejo del grupo (10 minutos)', obj: ['liderar', 'empatia', 'integrar'], min: 10, en: 'calma', lugar: ['aula'], grupo: 'Todo el grupo', riesgo: 'medio', mat: 'Buzón de propuestas',
      para: 'Que el grupo resuelva sus problemas con reglas claras. Una vez por semana.', alumnos: 'El grupo propone, discute y vota un acuerdo.',
      pasos: [[1, 'Reglas: habla quien tiene la palabra; se habla de situaciones, no de personas.'], [3, 'Una o dos propuestas del buzón o del grupo.'], [4, 'Ideas de solución.'], [2, 'Votan un acuerdo y se anota.']],
      instr: ['Habla quien tiene la palabra', 'Hablamos de situaciones, no de personas', 'Proponemos soluciones', 'Votamos un acuerdo'], cierre: ['¿Cumplimos el acuerdo de la semana pasada?'],
      cuidar: ['Un conflicto serio entre personas se trata en privado, no en el consejo.'], f: ['ct', 'dgb'] },
    { id: 'mueve', ico: '🔥', t: 'Lo que me mueve', obj: ['conocerse', 'relacion'], min: 20, en: 'calma', lugar: ['aula'], grupo: 'Individual', riesgo: 'medio', mat: 'Hoja en 3 columnas',
      para: 'Conocer pasiones, frustraciones y sueños de cada alumno para personalizar tu clase. Solo tú lo lees.', alumnos: 'Tres columnas: lo que te apasiona, lo que te drena en la escuela y lo que inventarías sin límites.',
      pasos: [[2, 'Explica que solo tú lo vas a leer y para qué: conocerlos para que la clase les sirva.'], [15, 'Escriben las tres columnas.'], [3, 'Lo recoges. En la semana, comenta algo con 3 o 4 alumnos ("vi que te gusta…").']],
      instr: ['¿Qué hace que el tiempo se te pase volando?', '¿Qué te drena la energía en la escuela?', 'Si no hubiera límites, ¿qué inventarías?'], cierre: ['(Para ti) Usa lo que leíste en tus ejemplos y al formar equipos.'],
      cuidar: ['Es confidencial: no lo leas en voz alta ni lo comentes frente al grupo.', 'Si alguien escribe algo que preocupa, canaliza con orientación.'], f: ['roorda'] },
    { id: 'fortalezas', ico: '💪', t: 'Mis fortalezas con evidencia', obj: ['confianza', 'conocerse'], min: 20, en: 'calma', lugar: ['aula'], grupo: 'Parejas', riesgo: 'bajo', mat: '',
      para: 'Confianza basada en hechos: recuerdan cuándo lo lograron y un compañero lo confirma.', alumnos: 'Escribe 3 cosas que haces bien y cuándo lo demostraste.',
      pasos: [[7, 'Cada quien escribe 3 cosas que hace bien y una prueba de cada una ("soy bueno para armar: armé…").'], [8, 'En parejas se las leen y la pareja agrega una fortaleza que haya visto en el otro.'], [5, 'Voluntarios comparten la fortaleza que les agregaron.']],
      instr: ['3 cosas que haces bien', 'Una prueba de cada una: ¿cuándo lo hiciste?', 'Tu pareja te agrega una fortaleza'], cierre: ['¿Te costó escribir fortalezas? ¿Por qué?', '¿Cómo usas una de tus fortalezas en el taller?'],
      cuidar: ['Si alguien dice "no soy bueno para nada", ayúdale con una pregunta: ¿qué te piden que hagas en casa o tus amigos?'], f: ['bandura'] },
    { id: 'antes', ico: '📈', t: 'Antes y después', obj: ['confianza', 'perseverar'], min: 15, en: 'calma', lugar: ['aula'], grupo: 'Individual', riesgo: 'bajo', mat: 'Su primer trabajo del parcial y uno reciente',
      para: 'Que vean su propio avance: el primer croquis contra el de hoy.', alumnos: 'Compara tu primer trabajo con el de hoy: ¿qué haces mejor?',
      pasos: [[3, 'Cada quien saca su primer trabajo del parcial y uno reciente.'], [7, 'Escriben 3 cosas que hoy hacen mejor y qué hicieron para lograrlo.'], [5, 'Comentan en pareja; tú reconoces el esfuerzo y la estrategia, no el talento.']],
      instr: ['Pon lado a lado tu primer trabajo y uno de hoy', '3 cosas que hoy haces mejor', '¿Qué hiciste para lograrlo?'], cierre: ['¿Qué cambió y qué lo hizo cambiar?', '¿Qué quieres mejorar para el siguiente parcial?'],
      cuidar: [], f: ['bandura', 'dweck'] },
    { id: 'error', ico: '🔁', t: 'Mi mejor error', obj: ['perseverar', 'confianza', 'emociones'], min: 15, en: 'calma', lugar: ['aula'], grupo: 'Equipos de 4', riesgo: 'medio', mat: '',
      para: 'Normalizar el error como parte de aprender. Tú empiezas contando uno tuyo.', alumnos: 'Cuenta un error de la escuela o del taller y qué aprendiste.',
      pasos: [[3, 'Cuenta un error tuyo (de la escuela o del trabajo) y qué aprendiste.'], [7, 'En equipos de 4, cada uno cuenta un error de la escuela o del taller y qué aprendió.'], [5, 'Arman entre todos la lista "lo que aprendimos de equivocarnos".']],
      instr: ['Un error de la escuela o del taller', '¿Qué pasó?', '¿Qué aprendiste?', '¿Qué haces ahora distinto?'], cierre: ['¿Qué error te enseñó más?', '¿Qué haces ahora distinto?'],
      cuidar: ['Errores de la escuela o del taller, no temas personales.'], f: ['dweck'] },
    { id: 'carta', ico: '✉️', t: 'Carta a mí del fin de semestre', obj: ['conocerse', 'perseverar', 'confianza'], min: 15, en: 'calma', lugar: ['aula'], grupo: 'Individual', riesgo: 'bajo', mat: 'Hoja y sobre',
      para: 'Metas propias que se revisan al final del semestre; tú guardas las cartas.', alumnos: 'Escribe una carta para ti que leerás en diciembre.',
      pasos: [[2, 'Explica: escriben una carta para leerla en diciembre.'], [10, 'Qué quieren lograr este semestre, qué les puede costar y qué harán cuando cueste.'], [3, 'Cierran el sobre con su nombre; tú los guardas.']],
      instr: ['¿Qué quiero lograr este semestre?', '¿Qué me puede costar?', '¿Qué haré cuando me cueste?'], cierre: ['(En diciembre) ¿Qué cumpliste? ¿Qué te ayudó?'],
      cuidar: [], f: ['ct'] },
    { id: 'respira', ico: '🌬️', t: 'Respiración 4-4-6', obj: ['emociones', 'calma'], min: 3, en: 'calma', lugar: ['aula', 'patio'], grupo: 'Todo el grupo', riesgo: 'bajo', mat: '',
      para: 'Bajar nervios antes de un examen o después del receso.', alumnos: 'Inhala 4, sostén 4, exhala 6. Cinco veces.',
      pasos: [[1, 'Sentados, espalda recta, pies en el piso.'], [2, 'Inhalan contando 4, sostienen 4 y exhalan en 6. Cinco veces; tú cuentas en voz alta.']],
      instr: ['Inhala contando 4', 'Sostén contando 4', 'Exhala contando 6', 'Repite 5 veces'], cierre: ['¿Cómo te sientes ahora, del 1 al 5?'],
      cuidar: ['Si alguien se marea, que respire normal.'], f: ['ct'] },
    { id: 'termometro', ico: '🌡️', t: 'Termómetro del grupo', obj: ['emociones', 'relacion', 'calma'], min: 3, en: 'calma', lugar: ['aula'], grupo: 'Individual', riesgo: 'bajo', mat: 'Papelitos',
      para: 'Saber cómo llega el grupo sin exponer a nadie. Anota los totales aquí para ver si el clima mejora.', alumnos: 'Sin nombre: del 1 (muy mal) al 5 (muy bien), ¿cómo llegas hoy?',
      pasos: [[1, 'Papelito sin nombre: del 1 (muy mal) al 5 (muy bien), ¿cómo llegas hoy?'], [2, 'Junta, cuenta frente a ellos y anota los totales en el Termómetro de esta pantalla.']],
      instr: ['Sin nombre', 'Del 1 (muy mal) al 5 (muy bien)', '¿Cómo llegas hoy?'], cierre: ['Si salen muchos 1 y 2, pregunta en general qué está pesando esta semana, sin buscar a nadie.'],
      cuidar: ['No busques quién puso qué. Si alguien quiere hablar, que se acerque al final.'], f: ['dgb', 'sel'] },
    { id: 'buzon', ico: '📮', t: 'Buzón: ustedes dijeron, yo hice', obj: ['relacion'], min: 10, en: 'calma', lugar: ['aula'], grupo: 'Individual', riesgo: 'bajo', mat: 'Papelitos y una caja',
      para: 'Que vean que su opinión cambia la clase: la relación contigo mejora cuando te ven escuchar y cumplir.', alumnos: 'Sin nombre: una cosa que te ayuda a aprender en esta clase y una que cambiarías.',
      pasos: [[3, 'Papelito sin nombre: algo que te ayuda a aprender en esta clase y algo que cambiarías.'], [5, 'Lo lees en casa y eliges una sugerencia que sí puedas hacer.'], [2, 'La siguiente clase dices: "Ustedes dijeron… yo voy a…".']],
      instr: ['Sin nombre', 'Algo que te ayuda a aprender en esta clase', 'Algo que cambiarías'], cierre: ['Cumple lo que prometes y dilo cuando lo hagas.'],
      cuidar: ['No respondas a la defensiva a una crítica; agradécela.'], f: ['roorda'] }
  ];
  const din = id => L.find(x => x.id === id);

  /* ---------- rutinas para la relación docente-alumno ---------- */
  DN.RUTINAS = [
    { id: 'saludo', ico: '🚪', t: 'Saludo en la puerta', que: 'Recibe a cada alumno por su nombre en la puerta con un saludo positivo o una pregunta breve, y deja en el pizarrón la primera instrucción.', ev: 'Estudio con grupo control en secundaria: más tiempo trabajando y menos interrupciones.', f: ['cook'] },
    { id: 'sabia', ico: '📝', t: 'Retroalimentación con expectativas altas', que: 'Al corregir di: "Te hago estos comentarios porque tengo expectativas altas y sé que puedes alcanzarlas", y luego una sola cosa concreta a mejorar.', ev: 'Más alumnos corrigieron su trabajo, sobre todo los que menos confiaban en la escuela.', f: ['wise', 'fb'] },
    { id: '2x10', ico: '⏱️', t: 'Dos minutos durante diez días', que: 'Con un alumno con el que la relación está difícil: 2 minutos diarios, 10 días seguidos, platicando de algo que no sea la escuela (sus intereses).', ev: 'Práctica docente con poca evidencia formal; se apoya en que la buena relación docente-alumno se asocia con más compromiso escolar.', f: ['roorda'] },
    { id: 'intereses', ico: '🎮', t: 'Ejemplos con sus intereses', que: 'Usa lo que escribieron en "Lo que me mueve" (motos, música, futbol, videojuegos) en tus ejemplos y problemas.', ev: 'La relación y la relevancia aumentan el compromiso con la clase.', f: ['roorda'] },
    { id: 'publico', ico: '🔒', t: 'Reconoce en público, corrige en privado', que: 'El reconocimiento frente al grupo; la llamada de atención, en corto y sin audiencia.', ev: 'Práctica docente: cuida la dignidad del alumno y la relación.', f: [] },
    { id: 'cero', ico: '🌅', t: 'Empezar de cero cada clase', que: 'Después de un regaño, la siguiente clase saluda normal y busca algo positivo: corriges la conducta, no le guardas rencor a la persona.', ev: 'Práctica docente: evita que un conflicto se vuelva una relación negativa, que pesa en el compromiso.', f: ['roorda'] },
    { id: 'nombres', ico: '📛', t: 'Nombres desde la primera semana', que: 'Aprende y usa el nombre de cada alumno (ayúdate con la lista y el Pase de lista).', ev: 'Práctica docente: es la base de cualquier relación.', f: [] }
  ];
  DN.PRINCIPIOS = [
    ['Participación voluntaria y derecho a pasar', 'Nadie está obligado a contar algo personal; siempre hay una forma sencilla de participar.'],
    ['Tú empiezas', 'Si lo haces tú primero, ellos se animan y ven que va en serio.'],
    ['Siempre cierra con 2 o 3 preguntas', '¿Qué pasó? ¿Qué aprendí? ¿Cómo lo uso en clase o en el taller? Sin cierre es solo un juego.'],
    ['Poco y seguido', '10 a 15 minutos cada semana, dentro de tus clases, valen más que un día de integración al año.'],
    ['Mezcla al azar y observa', 'Equipos al azar rompen subgrupos; fíjate quién queda fuera y acércate.'],
    ['Nada que exponga', 'Ni apariencia, ni dinero, ni familia, ni contacto físico obligatorio.'],
    ['Conecta con la técnica', 'Estructuras, planos, prototipos y bitácora: así no se siente "pérdida de tiempo".'],
    ['Mide y registra', 'El termómetro y el registro te dicen si el clima del grupo está mejorando.'],
    ['Si surge algo serio', 'Escucha, no prometas guardar el secreto y canaliza con orientación (ver Tutoría).']
  ];

  /* ---------- registro y termómetro ---------- */
  DN.doc = g => S.get(KD(g)) || {};
  DN.ultima = (g, id) => { const r = (DN.doc(g).reg || []).filter(x => x.din === id).sort((a, b) => b.f < a.f ? -1 : 1)[0]; return r || null; };
  // recomendación: objetivo y tiempo obligatorios; suma puntos por energía según cómo está el grupo, por no repetir y por ser de la ruta
  DN.recomendar = (g, o) => {
    const meta = o.obj === 'capacidad' ? o.cap : o.obj, ruta = o.obj === 'capacidad' ? ((DN.CAP.find(c => c.id === o.cap) || {}).ruta || []) : [];
    const pref = { normal: { calma: 1, media: 1, alta: 1 }, apagado: { alta: 3, media: 2, calma: 0 }, inquieto: { media: 3, alta: 1, calma: 2 }, tenso: { calma: 3, media: 1, alta: 0 } }[o.animo || 'normal'];
    const hoy = u.today();
    return L.filter(d => d.obj.indexOf(meta) >= 0 && d.min <= o.min && (!o.lugar || d.lugar.indexOf(o.lugar) >= 0)).map(d => {
      const ul = DN.ultima(g, d.id), dias = ul ? u.diffDays(ul.f, hoy) : 999;
      let s = pref[d.en] + (dias > 30 ? 3 : dias > 14 ? 1 : -2) + (ruta.indexOf(d.id) >= 0 ? 2 - ruta.indexOf(d.id) * 0.3 : 0) + (o.animo === 'tenso' && d.riesgo === 'bajo' ? 2 : 0);
      return { d: d, s: s, ul: ul };
    }).sort((a, b) => b.s - a.s).slice(0, 5);
  };
  const promTermo = c => { const n = c.reduce((a, b) => a + b, 0); return n ? c.reduce((a, b, i) => a + b * (i + 1), 0) / n : null; };

  /* ---------- vista principal ---------- */
  const chips = d => '<span class="chip">⏱ ' + d.min + ' min</span><span class="chip">' + esc(d.grupo) + '</span><span class="chip">' + ({ calma: '🌿 calma', media: '⚡ media', alta: '🔥 alta' })[d.en] + '</span>' + (d.riesgo === 'medio' ? '<span class="chip warn" title="Pide confianza: hazla cuando el grupo ya se conozca">pide confianza</span>' : '');
  const dcard = (g, d, extra) => { const ul = DN.ultima(g, d.id); return '<li class="dn-it"><a href="#/dinamica/' + d.id + '"><span class="dn-ico">' + d.ico + '</span><span class="dn-tx"><b>' + esc(d.t) + '</b><small>' + esc(d.para) + '</small><span class="dn-ch">' + chips(d) + (ul ? '<span class="chip ok">hecha ' + u.fCorta(ul.f) + '</span>' : '') + (extra || '') + '</span></span></a></li>'; };
  V.dinamicas = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup();
    const o = E.ui.dn = E.ui.dn || { obj: 'integrar', cap: 'colaborar', min: 20, lugar: 'aula', animo: 'normal' };
    const rec = DN.recomendar(g, o), doc = DN.doc(g);
    const seg = (k, opts, cur) => '<div class="cl-seg">' + opts.map(x => btn(x[1], 'dn-o', 'data-k="' + k + '" data-v="' + x[0] + '"', 'small' + (String(cur) === String(x[0]) ? ' on' : ''))).join('') + '</div>';
    let h = card('<h3>🎯 ¿Qué quieres lograr hoy?</h3>' + seg('obj', DN.OBJ, o.obj) +
      (o.obj === 'capacidad' ? '<p class="small muted mt">¿Qué capacidad?</p>' + seg('cap', DN.CAP.map(c => [c.id, c.ico + ' ' + c.t]), o.cap) : '') +
      '<div class="dn-filtros"><div><span class="small muted">Tiempo</span>' + seg('min', [[5, '5 min'], [10, '10'], [20, '20'], [30, '30'], [50, '50']], o.min) + '</div>' +
      '<div><span class="small muted">Dónde</span>' + seg('lugar', [['aula', 'Aula o taller'], ['patio', 'Patio']], o.lugar) + '</div>' +
      '<div><span class="small muted">¿Cómo está el grupo?</span>' + seg('animo', ANIMO, o.animo) + '</div></div>' +
      '<h4 class="mt">Te recomiendo</h4>' + (rec.length ? '<ul class="dn-list">' + rec.map(x => dcard(g, x.d)).join('') + '</ul>' : '<p class="muted small">Nada cabe en ese tiempo para ese objetivo. Sube el tiempo o elige otro objetivo.</p>'));
    if (o.obj === 'capacidad') { const c = DN.CAP.find(x => x.id === o.cap); if (c) h += card('<h3>' + c.ico + ' Ruta para ' + esc(c.t.toLowerCase()) + '</h3><p class="muted small">Una por semana, en este orden. Construye T: ' + esc(c.ct) + '.</p><ol class="dn-ruta">' + c.ruta.map(id => { const d = din(id), ul = DN.ultima(g, id); return '<li><a href="#/dinamica/' + id + '">' + d.ico + ' ' + esc(d.t) + '</a> <small class="muted">' + d.min + ' min</small>' + (ul ? ' <span class="chip ok">✓ ' + u.fCorta(ul.f) + '</span>' : '') + '</li>'; }).join('') + '</ol>'); }
    if (o.obj === 'relacion') h += rutinasHTML();
    h += termoHTML(g, doc);
    h += card('<details class="sub" id="dn-princ"><summary>🧭 Principios para que se sientan seguros</summary><ol class="dn-princ">' + DN.PRINCIPIOS.map(p => '<li><b>' + esc(p[0]) + '.</b> ' + esc(p[1]) + '</li>').join('') + '</ol><p class="muted small">Basado en Construye T (SEP-PNUD), en las orientaciones de formación socioemocional de la DGB y en la EEF: las sesiones cortas, frecuentes y dentro de la clase funcionan mejor.</p></details>');
    if (o.obj !== 'relacion') h += card('<details class="sub" id="dn-rut"><summary>🧑‍🏫 Rutinas para tu relación con ellos</summary>' + rutinasHTML(true) + '</details>');
    const reg = (doc.reg || []).slice().sort((a, b) => b.f < a.f ? -1 : 1);
    h += card('<details class="sub" id="dn-todas"><summary>📚 Todas las dinámicas (' + L.length + ')</summary><ul class="dn-list">' + L.map(d => dcard(g, d)).join('') + '</ul></details>' +
      (reg.length ? '<details class="sub" id="dn-hist"><summary>📒 Registro (' + reg.length + ')</summary><ul class="risk">' + reg.slice(0, 30).map(r => { const d = din(r.din) || { t: r.din, ico: '•' }; return '<li><span>' + d.ico + ' ' + esc(d.t) + ' <small class="muted">' + u.fCorta(r.f) + '</small>' + (r.nota ? '<br><small>' + esc(r.nota) + '</small>' : '') + '</span><span>' + (r.como ? '⭐'.repeat(r.como) : '') + ' ' + btn(icon('trash'), 'dn-reg-del', 'data-id="' + r.id + '" aria-label="Borrar registro"', 'small ghost') + '</span></li>'; }).join('') + '</ul></details>' : ''));
    h += card('<h3>Fuentes</h3><ul class="small est-fuentes">' + Object.keys(FU).map(k => '<li><a href="' + FU[k][1] + '" target="_blank" rel="noopener">' + esc(FU[k][0]) + '</a></li>').join('') + '</ul>');
    return { t: 'Dinámicas', h: h };
  };
  const fuentes = keys => (keys || []).map(k => '<a href="' + FU[k][1] + '" target="_blank" rel="noopener">' + esc(FU[k][0]) + '</a>').join('<br>');
  function rutinasHTML(plano) {
    const h = '<ul class="dn-rut">' + DN.RUTINAS.map(r => '<li><b>' + r.ico + ' ' + esc(r.t) + '</b><p class="small">' + esc(r.que) + '</p><p class="small muted">' + esc(r.ev) + '</p>' + (r.f.length ? '<p class="small est-src">' + fuentes(r.f) + '</p>' : '') + '</li>').join('') + '</ul>' +
      '<p class="small">Y para conocerlos: <a href="#/dinamica/mueve">🔥 Lo que me mueve</a> y <a href="#/dinamica/buzon">📮 Buzón: ustedes dijeron, yo hice</a>.</p>';
    return plano ? h : card('<h3>🧑‍🏫 Rutinas para tu relación con ellos</h3><p class="muted small">La buena relación docente-alumno se asocia con más compromiso escolar, sobre todo en grados altos (metaanálisis de 99 estudios). Estas rutinas toman minutos.</p>' + h);
  }
  function termoHTML(g, doc) {
    const t = (doc.termo || []).slice().sort((a, b) => a.f < b.f ? -1 : 1), ult = t.slice(-10);
    let graf = '';
    if (ult.length) {
      const W = 300, Hh = 90, px = i => ult.length === 1 ? W / 2 : 14 + i * (W - 28) / (ult.length - 1), py = v => 8 + (5 - v) / 4 * (Hh - 24);
      const pts = ult.map((x, i) => [px(i), py(promTermo(x.c))]);
      graf = '<svg class="dn-termo" viewBox="0 0 ' + W + ' ' + Hh + '" role="img" aria-label="Promedio del termómetro en las últimas mediciones">' + [1, 3, 5].map(v => '<line x1="0" x2="' + W + '" y1="' + py(v) + '" y2="' + py(v) + '" class="gl"/><text x="2" y="' + (py(v) - 2) + '" class="tl">' + v + '</text>').join('') +
        (pts.length > 1 ? '<polyline points="' + pts.map(p => p.join(',')).join(' ') + '" class="ln"/>' : '') + pts.map((p, i) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" class="pt"><title>' + esc(u.fCorta(ult[i].f) + ': ' + promTermo(ult[i].c).toFixed(1)) + '</title></circle>').join('') +
        ult.map((x, i) => '<text x="' + px(i) + '" y="' + (Hh - 2) + '" text-anchor="middle" class="tx">' + esc(u.fCorta(x.f)) + '</text>').join('') + '</svg>';
    }
    const last = t[t.length - 1], n = last ? last.c.reduce((a, b) => a + b, 0) : 0;
    return card('<div class="row between gap wrap"><h3>🌡️ Termómetro del grupo</h3>' + link('Cómo hacerlo', 'dinamica/termometro', 'small') + '</div><p class="muted small">Papelitos sin nombre del 1 (muy mal) al 5 (muy bien). Anota cuántos salieron de cada número.</p>' +
      '<div class="dn-tin">' + [1, 2, 3, 4, 5].map(k => '<label><span>' + ['😣', '🙁', '😐', '🙂', '😄'][k - 1] + ' ' + k + '</span><input type="number" min="0" id="tm-' + k + '" inputmode="numeric"></label>').join('') + '</div>' +
      '<div class="row gap wrap"><label class="fld"><span>Fecha</span><input type="date" id="tm-f" value="' + u.today() + '"></label></div>' + btn('Guardar medición', 'dn-termo', '', 'primary') +
      (last ? '<p class="small mt">Última (' + u.fCorta(last.f) + '): promedio <b>' + promTermo(last.c).toFixed(1) + '</b> · ' + Math.round((last.c[3] + last.c[4]) / (n || 1) * 100) + '% llegó bien (4 o 5) · ' + Math.round((last.c[0] + last.c[1]) / (n || 1) * 100) + '% mal (1 o 2)</p>' + graf + (t.length > 1 ? '<p class="muted small">' + (promTermo(last.c) - promTermo(t[t.length - 2].c) >= 0 ? '↑ Mejoró' : '↓ Bajó') + ' respecto a la medición anterior.</p>' : '') : ''));
  }

  /* ---------- vista de una dinámica ---------- */
  V.dinamica = id => {
    const g = D.grupoActual(), d = din(id); if (!d) return { t: 'Dinámica', h: card('<p>No encontré esa dinámica.</p>' + link('Ver dinámicas', 'dinamicas', 'primary')) };
    const ul = g ? DN.ultima(g, id) : null, tot = d.pasos.reduce((s, p) => s + p[0], 0), hoy = u.today();
    const caps = DN.CAP.filter(c => d.obj.indexOf(c.id) >= 0);
    let h = '<p><a href="#/dinamicas">‹ Dinámicas</a></p>';
    h += card('<div class="dn-hd"><span class="dn-big">' + d.ico + '</span><div><h3>' + esc(d.t) + '</h3><div class="dn-ch">' + chips(d) + '</div></div></div><p>' + esc(d.para) + '</p>' +
      (caps.length ? '<p class="small muted">Desarrolla: ' + caps.map(c => c.ico + ' ' + esc(c.t)).join(' · ') + '</p>' : '') + (d.mat ? '<p class="small"><b>Material:</b> ' + esc(d.mat) + '</p>' : '') + (ul ? '<p class="small"><span class="chip ok">La hiciste el ' + u.fCorta(ul.f) + (ul.como ? ' · ' + '⭐'.repeat(ul.como) : '') + '</span></p>' : '') +
      '<div class="row gap wrap">' + btn(icon('screen') + ' Proyectar instrucciones', 'dn-proy', 'data-id="' + id + '"', 'primary') + btn('⏱ Dar con temporizador', 'dn-run', 'data-id="' + id + '"') +
      btn(icon('team') + ' Formar equipos', 'equipos', 'data-fecha="' + hoy + '"', 'small') + btn(icon('dice') + ' Al azar', 'azar', 'data-fecha="' + hoy + '"', 'small') + (d.hoja ? btn(icon('print') + ' Imprimir bingo', 'dn-bingo', '', 'small') : '') + '</div>');
    h += card('<h3>Paso a paso <small class="muted">· ' + tot + ' min</small></h3><ol class="cl-pasos">' + d.pasos.map(p => '<li><span class="min">' + p[0] + ' min</span>' + esc(p[1]) + '</li>').join('') + '</ol>' +
      '<h4>Lo que ven los alumnos</h4><p class="small"><i>' + esc(d.alumnos) + '</i></p><ul class="small">' + d.instr.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>');
    h += card('<h3>💬 Para cerrar (no te lo saltes)</h3><ol>' + d.cierre.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol><p class="muted small">El cierre convierte el juego en aprendizaje: qué pasó, qué aprendí y cómo lo uso en clase o en el taller.</p>' +
      (d.cuidar.length ? '<h4>🛟 Cuida</h4><ul class="small">' + d.cuidar.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '') + '<p class="small muted">Recuerda: participación voluntaria y derecho a pasar.</p>');
    h += card('<h3>✓ ¿Cómo salió?</h3><div class="cl-seg" id="dn-como">' + [1, 2, 3, 4, 5].map(k => btn('⭐'.repeat(k), 'dn-como', 'data-v="' + k + '"', 'small' + ((E.ui.dnComo || 0) === k ? ' on' : ''))).join('') + '</div>' +
      '<label class="fld mt"><span>Nota (opcional)</span><textarea id="dn-nota" rows="2" placeholder="Qué funcionó, quién participó poco, qué cambiarías. Sin datos personales delicados."></textarea></label>' +
      '<div class="row gap wrap"><label class="fld"><span>Fecha</span><input type="date" id="dn-f" value="' + hoy + '"></label></div>' + btn('Registrar que la hice', 'dn-reg', 'data-id="' + id + '"', 'primary') + ' ' + btn(icon('book') + ' También en la bitácora', 'dn-reg', 'data-id="' + id + '" data-bit="1"', 'small'));
    if (d.f.length) h += '<p class="small est-src"><b>Respaldo:</b><br>' + fuentes(d.f) + '</p>';
    return { t: d.t, h: h };
  };

  /* ---------- acciones ---------- */
  A['dn-o'] = el => { const o = E.ui.dn; const k = el.dataset.k; o[k] = k === 'min' ? Number(el.dataset.v) : el.dataset.v; E.render(); };
  A['dn-como'] = el => { E.ui.dnComo = Number(el.dataset.v); document.querySelectorAll('#dn-como .btn').forEach(b => b.classList.toggle('on', b === el)); };
  A['dn-reg'] = el => {
    const g = D.grupoActual(), d = din(el.dataset.id); if (!g || !d) return; const f = val('dn-f') || u.today(), nota = val('dn-nota');
    S.update(KD(g), x => { x.reg = x.reg || []; x.reg.push({ id: u.uid('dn'), f: f, din: d.id, como: E.ui.dnComo || 0, nota: nota }); }, {});
    if (el.dataset.bit) { const id = u.uid('bit'); S.put('bit:' + id, { id: id, fecha: f, grupoId: g.id, texto: 'Dinámica: ' + d.t + (E.ui.dnComo ? ' (' + E.ui.dnComo + '/5)' : '') + (nota ? '\n' + nota : '') }); }
    E.ui.dnComo = 0; u.toast('Registrada' + (el.dataset.bit ? ' (también en la bitácora)' : ''), 'ok');
  };
  A['dn-reg-del'] = el => { const g = D.grupoActual(); if (!confirm('¿Borrar este registro?')) return; S.update(KD(g), x => { x.reg = (x.reg || []).filter(r => r.id !== el.dataset.id); }, {}); };
  A['dn-termo'] = () => {
    const g = D.grupoActual(), c = [1, 2, 3, 4, 5].map(k => Math.max(0, Number(val('tm-' + k)) || 0)); if (!c.some(x => x)) { u.toast('Anota cuántos papelitos salieron de cada número', 'err'); return; }
    S.update(KD(g), x => { x.termo = x.termo || []; x.termo.push({ id: u.uid('tm'), f: val('tm-f') || u.today(), c: c }); }, {}); u.toast('Medición guardada', 'ok');
  };
  A['dn-proy'] = el => {
    const d = din(el.dataset.id); if (!d) return; const s = [{ k: 'cover', h: d.t, sub: 'Dinámica · ' + d.pasos.reduce((a, p) => a + p[0], 0) + ' min · ' + d.grupo, p: d.alumnos }];
    for (let i = 0; i < d.instr.length; i += 4) s.push({ k: 'list', h: 'Instrucciones', items: d.instr.slice(i, i + 4) });
    s.push({ k: 'list', h: 'Para cerrar', items: d.cierre });
    s.push({ k: 'vida', h: 'Recuerda', p: 'Participa con respeto. Si no quieres compartir algo personal, puedes pasar.' });
    E.proj.abrir({ id: 'din-' + d.id, titulo: d.t }, s);
  };
  // temporizador paso a paso
  const fmt = s => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  A['dn-run'] = el => {
    const d = din(el.dataset.id); if (!d) return; clearInterval(DN.h);
    DN.r = { id: d.id, i: 0, end: Date.now() + d.pasos[0][0] * 60000, pausa: 0, sono: false };
    pintaRun(); DN.h = setInterval(tick, 500);
  };
  function pintaRun() {
    const r = DN.r, d = din(r.id), p = d.pasos[r.i];
    E.modal.open(d.ico + ' ' + d.t, '<div class="dn-run"><p class="kicker">Paso ' + (r.i + 1) + ' de ' + d.pasos.length + '</p><div class="timer" id="dn-t">' + fmt((r.pausa ? r.pausa : r.end - Date.now()) / 1000) + '</div><p class="dn-paso">' + esc(p[1]) + '</p>' +
      (d.pasos[r.i + 1] ? '<p class="small muted">Sigue: ' + esc(d.pasos[r.i + 1][1]) + '</p>' : '<p class="small muted">Último paso. Después, las preguntas de cierre.</p>') +
      '<div class="row gap wrap center">' + btn('‹', 'dn-run-ir', 'data-d="-1" aria-label="Paso anterior"' + (r.i ? '' : ' disabled')) + btn(r.pausa ? '▶ Seguir' : '⏸ Pausa', 'dn-run-pausa', '', '') + btn(d.pasos[r.i + 1] ? 'Siguiente ›' : 'Terminar', 'dn-run-ir', 'data-d="1"', 'primary') + '</div></div>');
  }
  function tick() {
    const r = DN.r, el = document.getElementById('dn-t'); if (!r || !el) { clearInterval(DN.h); return; } if (r.pausa) return;
    const left = (r.end - Date.now()) / 1000; el.textContent = fmt(left); el.classList.toggle('done', left <= 0);
    if (left <= 0 && !r.sono) { r.sono = true; if (E.beep) E.beep(); if (navigator.vibrate) navigator.vibrate([200, 100, 200]); }
  }
  A['dn-run-ir'] = el => {
    const r = DN.r, d = r && din(r.id); if (!d) return; const n = r.i + Number(el.dataset.d);
    if (n >= d.pasos.length) { clearInterval(DN.h); DN.r = null; E.modal.close(); location.hash = '#/dinamica/' + d.id; u.toast('¡Listo! Haz las preguntas de cierre y registra cómo salió', 'ok', 5000); return; }
    if (n < 0) return; r.i = n; r.end = Date.now() + d.pasos[n][0] * 60000; r.pausa = 0; r.sono = false; pintaRun();
  };
  A['dn-run-pausa'] = () => { const r = DN.r; if (!r) return; if (r.pausa) { r.end = Date.now() + r.pausa; r.pausa = 0; } else r.pausa = Math.max(0, r.end - Date.now()); pintaRun(); };
  // bingo imprimible: cada hoja con casillas distintas
  DN.BINGO = ['Ha desarmado un aparato para ver cómo funciona', 'Ha reparado algo en su casa', 'Sabe usar desarmador plano y de cruz', 'Le gusta dibujar', 'Quiere usar una impresora 3D', 'Sabe para qué sirve un fusible', 'Ha visto un robot en persona', 'Le gustan los rompecabezas', 'Sabe cambiar una llanta', 'Ha programado algo (aunque sea un juego)', 'Juega un deporte en equipo', 'Toca un instrumento', 'Sabe cocinar una receta completa', 'Ha soldado o quiere aprender', 'Conoce a alguien que trabaja en una fábrica', 'Habla un poco de inglés', 'Ha ayudado a alguien a estudiar', 'Ha armado un mueble con instructivo', 'Le gusta la música en vivo', 'Ha hecho un experimento en casa', 'Sabe hacer un nudo que no se suelta', 'Ha usado FreeCAD u otro programa de diseño', 'Prefiere el taller que el salón', 'Quiere estudiar ingeniería'];
  A['dn-bingo'] = () => {
    const g = D.grupoActual(), n = Math.max(2, (g ? D.alumnos(g).length : 0) || 24), cf = D.cfg();
    const hoja = () => { const a = DN.BINGO.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } const c = a.slice(0, 16);
      return '<div class="bingo"><div class="p-title">BINGO HUMANO · ' + esc(g ? g.nombre : '') + '</div><p class="tiny c">Busca a alguien que cumpla cada casilla y que firme. Un compañero distinto por casilla. ' + esc(cf.plantel || '') + '</p><table class="grid bingo-t"><tbody>' + [0, 1, 2, 3].map(r => '<tr>' + c.slice(r * 4, r * 4 + 4).map(x => '<td><span>' + esc(x) + '</span><i>Firma:</i></td>').join('') + '</tr>').join('') + '</tbody></table></div>'; };
    let h = '<div class="pr">'; for (let i = 0; i < n; i++) h += hoja(); E.print.run(h + '</div>', { title: 'Bingo humano', margin: '8mm' });
  };
})();
