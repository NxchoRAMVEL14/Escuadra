/* Escuadra · «Conócete» (v1.42.0): 6 estudios cortos para que los alumnos se conozcan y aprendan mejor. Datos compartidos
   por la página de los alumnos (conocete.html) y la app. Todos los reactivos son de Escuadra (escritos para este fin);
   se basan en modelos publicados, pero NO son las pruebas originales ni pruebas estandarizadas con normas:
   1) ¿Cómo estudias?: técnicas de estudio según la revisión de Dunlosky et al. (2013).
   2) Mentalidad: teorías implícitas de la inteligencia (Dweck); estudio nacional de Yeager et al. (2019).
   3) Emociones: inteligencia emocional percibida en 3 partes (atención, claridad y reparación), como el modelo de la
      TMMS (Salovey y Mayer; versión TMMS-24 de Fernández-Berrocal et al.), con frases propias.
   4) Retos de razonamiento: 4 tipos de ejercicio como los del proyecto ICAR (series, matrices, rotación y verbal), con
      ejercicios propios. No es un test de CI.
   5) Confianza en mecatrónica: autoeficacia por área (Bandura), con frases propias.
   6) Nervios en los exámenes: ansiedad ante los exámenes en 2 partes (preocupación y tensión), con frases propias.
   Archivo independiente: no depende de Escuadra. */
(function () {
  'use strict';
  const LIK5 = ['Nunca', 'Pocas veces', 'A veces', 'Seguido', 'Siempre'];
  const ACU5 = ['Nada de acuerdo', 'Poco', 'Más o menos', 'Bastante', 'Totalmente'];
  const CAP5 = ['Nada capaz', 'Poco', 'Más o menos', 'Bastante', 'Muy capaz'];
  const LIK4 = ['Nunca', 'A veces', 'Seguido', 'Casi siempre'];
  const it = (d, t, inv) => ({ d: d, t: t, inv: !!inv });

  const T = [
    { id: 'estudio', L: 'E', ico: '📚', t: '¿Cómo estudias?', dur: '5 min', esc: LIK5,
      intro: 'Qué tan seguido haces cada cosa cuando estudias. No hay respuestas buenas ni malas: es para encontrar tu siguiente paso.',
      dims: [
        { n: 'Ponerte a prueba', bueno: true, alto: 'Te pones a prueba sin ver tus apuntes: es de las técnicas que más funcionan.', bajo: 'Casi no te pones a prueba. Es de lo que más ayuda: después de leer, cierra el cuaderno y escribe lo que recuerdas o resuelve ejercicios.', tip: 'Haz 5 preguntas de lo que viste y contéstalas al otro día sin ver.' },
        { n: 'Repartir el estudio', bueno: true, alto: 'Repartes el estudio en varios días: tu memoria lo agradece.', bajo: 'Estudias casi todo a última hora. Repartirlo en varios días ayuda mucho más que una sola sesión larga.', tip: '15 minutos 3 días antes del examen valen más que 45 minutos la noche anterior.' },
        { n: 'Explicar y mezclar', bueno: true, alto: 'Te explicas el porqué y mezclas tipos de ejercicio: así se entiende de verdad.', bajo: 'Pocas veces te explicas el porqué. Pregúntate «¿por qué funciona así?» y mezcla tipos de ejercicio.', tip: 'Explícale el tema a alguien en 2 minutos, sin ver tus apuntes.' },
        { n: 'Solo releer y subrayar', bueno: false, alto: 'Dependes mucho de releer y subrayar: se siente que aprendes, pero ayuda poco si no te pones a prueba.', bajo: 'No dependes solo de releer o subrayar. ¡Bien!', tip: 'Cambia la segunda leída por un mini examen hecho por ti.' },
        { n: 'Concentración', bueno: true, alto: 'Cuidas tu concentración: celular lejos y buen lugar.', bajo: 'Te distraes fácil. El celular cerca roba atención aunque no lo uses.', tip: 'Estudia 25 minutos con el celular en otro cuarto y descansa 5.' },
        { n: 'Organización', bueno: true, alto: 'Planeas y preguntas a tiempo.', bajo: 'Te falta planear y preguntar pronto cuando no entiendes.', tip: 'Anota en el calendario de tu celular cada examen y cuándo vas a estudiar.' }
      ],
      items: [it(0, 'Después de estudiar, me pongo a prueba sin ver mis apuntes (preguntas, tarjetas o ejercicios).'), it(1, 'Estudio un poco varios días antes del examen, no todo la noche anterior.'), it(2, 'Me explico a mí mismo (o a alguien) por qué funciona algo, no solo cómo se hace.'), it(3, 'Mi forma principal de estudiar es volver a leer los apuntes o el libro.'), it(4, 'Cuando estudio, dejo el celular lejos o en silencio.'), it(5, 'Anoto las fechas de entregas y exámenes y planeo cuándo estudiar.'),
        it(0, 'Resuelvo exámenes o ejercicios de práctica antes del examen.'), it(1, 'Repaso temas de semanas pasadas aunque ya no «vengan».'), it(2, 'Cuando practico, mezclo distintos tipos de ejercicios en lugar de hacer muchos iguales seguidos.'), it(3, 'Subrayo o marco mucho texto con color.'), it(4, 'Estudio en un lugar donde me puedo concentrar.'), it(5, 'Si no entiendo algo, pregunto al profe o a un compañero pronto.')],
      guia: { mide: 'Qué técnicas de estudio usa y qué tan seguido: ponerse a prueba, repartir el estudio, explicarse y mezclar, depender de releer y subrayar, concentración y organización.', noMide: 'Qué tan inteligente es ni cuánto sabe. Es lo que el alumno dice que hace.', leer: 'Lo más importante: «Ponerte a prueba» y «Repartir el estudio» bajos con «Solo releer y subrayar» alto. Es el perfil más común y el que más se puede mejorar.', ayudar: ['Usa repasos y memorama en clase: son práctica de ponerse a prueba.', 'Da exámenes cortos sin valor (o de puntos extra) antes del examen real.', 'Retoma temas de semanas pasadas en los boletos de salida (repaso repartido).', 'Mezcla tipos de ejercicio en las hojas de práctica.'], fuente: 'Dunlosky, J., et al. (2013). Improving students’ learning with effective learning techniques. Psychological Science in the Public Interest, 14(1), 4–58.' } },

    { id: 'mente', L: 'M', ico: '🌱', t: 'Mentalidad: ¿la habilidad se desarrolla?', dur: '3 min', esc: ACU5,
      intro: 'Qué tan de acuerdo estás con cada frase. Contesta lo que de verdad piensas.',
      dims: [{ n: 'Mentalidad de crecimiento', bueno: true, alto: 'Crees que la habilidad se desarrolla con práctica y buenas estrategias: así los errores se vuelven aprendizaje.', medio: 'A veces crees que puedes mejorar y a veces que «no eres bueno para eso». Fíjate en cuándo te pasa.', bajo: 'Piensas que la habilidad casi no cambia. Pero el cerebro sí aprende: lo difícil hoy se vuelve fácil con práctica.', tip: 'Cambia «no soy bueno para esto» por «todavía no me sale». Y pregunta: ¿qué estrategia puedo cambiar?' }],
      items: [it(0, 'Con práctica y buenas estrategias, cualquiera puede mejorar mucho en matemáticas.'), it(0, 'Hay personas que nacen buenas para la electrónica y otras que no, y eso no cambia.', true), it(0, 'Equivocarme en una práctica me enseña algo que me sirve.'), it(0, 'Si algo me cuesta mucho trabajo, seguro no soy bueno para eso.', true),
        it(0, 'Mi inteligencia puede crecer si aprendo cosas nuevas y difíciles.'), it(0, 'Prefiero hacer solo ejercicios fáciles para no verme mal.', true), it(0, 'Cuando un compañero hace algo mejor que yo, puedo aprender de cómo lo hizo.'), it(0, 'Si tengo que esforzarme mucho, significa que no tengo talento.', true)],
      guia: { mide: 'Si el alumno cree que la habilidad se desarrolla (mentalidad de crecimiento) o que es fija.', noMide: 'Esfuerzo real ni calificaciones. Es una creencia, y cambia.', leer: 'Bajo = cree que «no es bueno para eso». Suele rendirse rápido ante lo difícil.', ayudar: ['Elogia la estrategia y el proceso, no el «qué listo eres».', 'Usa «todavía»: «todavía no te sale».', 'Muestra errores tuyos y cómo los corregiste.', 'Ojo: una plática sola casi no cambia nada; funciona si el grupo y tú lo refuerzan todos los días.'], fuente: 'Yeager, D. S., et al. (2019). A national experiment reveals where a growth mindset improves achievement. Nature, 573, 364–369. Dweck, C. S. (2006). Mindset.' } },

    { id: 'emoc', L: 'C', ico: '💛', t: 'Mis emociones', dur: '4 min', esc: ACU5,
      intro: 'Qué tan de acuerdo estás con cada frase sobre cómo vives tus emociones. Nadie más ve tus respuestas.',
      dims: [
        { n: 'Atención', bueno: true, medioOk: true, alto: 'Le pones mucha atención a lo que sientes. Ojo: si además te cuesta entenderlo o calmarte, puedes quedarte dándole vueltas.', medio: 'Le pones atención a lo que sientes sin quedarte atorado: buen punto de partida.', bajo: 'Casi no te fijas en lo que sientes. Date unos segundos al día para notar cómo estás.', tip: 'Dos veces al día pregúntate: ¿cómo me siento ahorita, del 1 al 10?' },
        { n: 'Claridad', bueno: true, alto: 'Entiendes y nombras bien lo que sientes.', medio: 'Muchas veces sabes lo que sientes; a veces se te revuelve.', bajo: 'Te cuesta saber qué sientes exactamente. Ponerle nombre (enojo, tristeza, preocupación, cansancio) ya ayuda.', tip: 'Cuando algo te mueva, termina la frase «me siento… porque…».' },
        { n: 'Reparación', bueno: true, alto: 'Sabes recuperarte y calmarte cuando algo sale mal.', medio: 'Casi siempre te recuperas; algunas veces te cuesta más.', bajo: 'Te cuesta calmarte o recuperarte. Busca qué te ayuda (respirar lento, caminar, platicar con alguien de confianza).', tip: 'Respira lento: 4 segundos al entrar el aire y 6 al sacarlo, 5 veces.' }
      ],
      items: [it(0, 'Pongo atención a lo que siento.'), it(1, 'Puedo decir con palabras lo que estoy sintiendo.'), it(2, 'Cuando estoy triste, sé qué hacer para sentirme mejor.'), it(0, 'Pienso seguido en mis emociones.'), it(1, 'Distingo si estoy enojado, triste, preocupado o cansado.'), it(2, 'Aunque algo salga mal, trato de ver el lado bueno.'),
        it(0, 'Me doy cuenta cuando cambia mi estado de ánimo.'), it(1, 'Entiendo por qué me siento como me siento.'), it(2, 'Cuando me enojo, puedo calmarme antes de actuar.'), it(0, 'Sé que lo que siento influye en cómo actúo.'), it(1, 'Casi siempre sé lo que siento.'), it(2, 'Si algo me preocupa, busco cómo resolverlo o despejarme de forma sana.'),
        it(0, 'Me tomo un momento para pensar cómo me siento.'), it(1, 'Puedo explicarle a alguien cómo me siento.'), it(2, 'Después de un mal día, me recupero pronto.')],
      guia: { mide: 'Inteligencia emocional percibida en 3 partes: atención (se fija en lo que siente), claridad (lo entiende y lo nombra) y reparación (se calma y se recupera).', noMide: 'No es un diagnóstico ni mide problemas emocionales o de salud mental. Es cómo el alumno se ve a sí mismo.', leer: 'En atención, lo sano es un punto medio: mucha atención con poca claridad y poca reparación puede ser darle vueltas a las cosas. Claridad y reparación: entre más, mejor.', ayudar: ['Conecta con Construye T: Conoce T (autoconocimiento y autorregulación), Relaciona T y Elige T.', 'Usa las dinámicas de «Para que se conozcan» y el termómetro emocional al iniciar la clase.', 'Si ves reparación baja junto con señales de que la está pasando mal, platica con él en privado y canaliza a orientación.', 'Nunca lo uses para calificar ni lo comentes frente al grupo.'], fuente: 'Modelo de la TMMS: Salovey, P., et al. (1995); TMMS-24: Fernández-Berrocal, P., Extremera, N. y Ramos, N. (2004). Frases propias de Escuadra, no son la escala original. Construye T (SEP).' } },

    { id: 'razon', L: 'R', ico: '🧩', t: 'Retos de razonamiento', dur: '15 min', raz: true,
      intro: '16 retos de 4 tipos. Tómate tu tiempo y elige la opción que creas correcta. No es un examen ni un test de CI: es para descubrir en qué tipo de razonamiento eres más fuerte.',
      dims: [
        { n: 'Series', mec: 'Encontrar patrones: programación, secuencias de una máquina y diagnóstico.', tip: 'Busca qué cambia de un número al siguiente: ¿suma, multiplica o alterna?' },
        { n: 'Matrices', mec: 'Lógica visual: leer diagramas, encontrar fallas y entender reglas de un sistema.', tip: 'Revisa qué cambia por renglón y qué cambia por columna, por separado.' },
        { n: 'Rotación de figuras', mec: 'Imaginar piezas en el espacio: planos, FreeCAD y armado de mecanismos.', tip: 'Fíjate en una esquina o una «pata» de la pieza y síguela al girar.' },
        { n: 'Razonamiento verbal', mec: 'Leer manuales, seguir instrucciones y explicar cómo funciona algo.', tip: 'Subraya las palabras clave (todos, ninguno, antes, después) y descarta opciones.' }
      ],
      guia: { mide: 'Cuántos retos resolvió de 4 tipos: series, matrices, rotación de figuras y razonamiento verbal (4 de cada uno).', noMide: 'No es un test de CI ni tiene normas: no compara con otros jóvenes de su edad. Un día cansado o con prisa baja el resultado.', leer: 'Úsalo para ver fortalezas («eres fuerte en rotación: te va a ir bien en CAD») y para formar equipos con tipos distintos. Nunca le digas a nadie que es «poco inteligente».', ayudar: ['Pon un reto de razonamiento como inicio de clase y que expliquen cómo lo resolvieron.', 'Para rotación: piezas físicas, FreeCAD y dibujo de vistas.', 'Para series y matrices: secuencias de máquinas y diagramas de escalera.', 'Si un resultado te llama mucho la atención (muy alto o muy bajo), platícalo con orientación: aquí no se diagnostica.'], fuente: 'Tipos de ejercicio como los del International Cognitive Ability Resource (ICAR; Condon y Revelle, 2014). Ejercicios propios de Escuadra.' } },

    { id: 'confianza', L: 'A', ico: '🔧', t: 'Confianza en mecatrónica', dur: '3 min', esc: CAP5,
      intro: 'Qué tan capaz te sientes HOY de hacer cada cosa. No es lo que sabes: es qué tanta confianza te tienes.',
      dims: [
        { n: 'Electricidad y electrónica', ico: '⚡' }, { n: 'Programación', ico: '💻' }, { n: 'Mecánica y CAD', ico: '⚙️' }, { n: 'Neumática e hidráulica', ico: '💨' }, { n: 'Taller y armado', ico: '🛠️' }, { n: 'Matemáticas y cálculos', ico: '📐' }
      ],
      items: [it(0, 'Armar un circuito siguiendo un diagrama.'), it(1, 'Escribir un programa sencillo que prenda y apague algo.'), it(2, 'Dibujar una pieza con medidas en FreeCAD.'), it(3, 'Leer un diagrama neumático con símbolos ISO 1219.'), it(4, 'Usar con seguridad las herramientas del taller.'), it(5, 'Calcular presión, fuerza o velocidad con una fórmula.'),
        it(0, 'Encontrar por qué un circuito no funciona usando el multímetro.'), it(1, 'Encontrar y corregir un error en un programa.'), it(2, 'Entender cómo se mueve un mecanismo (engranes, levas, palancas).'), it(3, 'Armar un circuito con un cilindro y una válvula.'), it(4, 'Armar una estructura que quede firme y bien hecha.'), it(5, 'Despejar una fórmula y usar las unidades correctas.')],
      guia: { mide: 'Autoeficacia: qué tan capaz se siente en 6 áreas de la carrera.', noMide: 'Lo que sabe hacer de verdad. Hay quien sabe mucho y se tiene poca confianza, y al revés.', leer: 'Las áreas con poca confianza son donde conviene enseñar con pasos chicos y éxitos rápidos. Compara con lo que ves en el taller.', ayudar: ['La confianza crece con logros reales: prácticas cortas que sí salen.', 'Que vea a un compañero parecido a él lograrlo (modelos cercanos).', 'Retroalimentación concreta: «tu soldadura quedó firme porque…».', 'En equipos, junta a quien tiene confianza en un área con quien no.'], fuente: 'Bandura, A. (1997). Self-efficacy: The exercise of control. Frases propias de Escuadra.' } },

    { id: 'nervios', L: 'X', ico: '😮‍💨', t: 'Nervios en los exámenes', dur: '3 min', esc: LIK4,
      intro: 'Qué tan seguido te pasa cada cosa con los exámenes. Sentir algo de nervios es normal: es para saber cómo ayudarte.',
      dims: [
        { n: 'Preocupación', bueno: false, alto: 'Te preocupas mucho antes y durante los exámenes: esos pensamientos le quitan espacio a lo que sí sabes.', medio: 'Te preocupas un poco: es normal.', bajo: 'Casi no te preocupan los exámenes.', tip: 'Haz exámenes de práctica: lo conocido da menos miedo. En el examen empieza por lo que sí sabes.' },
        { n: 'Tensión en el cuerpo', bueno: false, alto: 'Tu cuerpo se pone muy tenso (estómago, manos, corazón). Se puede bajar con respiración lenta.', medio: 'Algo de tensión: normal, y hasta te pone alerta.', bajo: 'Tu cuerpo casi no se tensa con los exámenes.', tip: 'Antes del examen: respira 4 segundos al entrar el aire y 6 al sacarlo, 5 veces. Y duerme bien la noche anterior.' }
      ],
      items: [it(0, 'Antes de un examen pienso que me va a ir mal aunque haya estudiado.'), it(1, 'Antes de un examen me sudan las manos o me duele el estómago.'), it(0, 'Durante el examen pienso en lo que pasará si repruebo.'), it(1, 'Me cuesta dormir la noche antes de un examen.'),
        it(0, 'Me comparo con mis compañeros y siento que saben más.'), it(1, 'Durante el examen siento el corazón acelerado.'), it(0, 'Se me olvidan cosas que sí sabía en cuanto empieza el examen.'), it(1, 'Me pongo tan nervioso que me cuesta concentrarme.')],
      guia: { mide: 'Ansiedad ante los exámenes en 2 partes: preocupación (pensamientos) y tensión (cuerpo).', noMide: 'No es un diagnóstico de ansiedad. Algo de nervios es normal y útil.', leer: 'Alto en las dos = al alumno le cuesta mostrar lo que sabe en el examen. Puede rendir mejor en prácticas que en exámenes escritos.', ayudar: ['Exámenes de práctica sin valor: la familiaridad baja los nervios.', 'Al empezar el examen, 1 minuto de respiración lenta con todo el grupo.', 'Examen con preguntas fáciles al inicio y tiempo suficiente.', 'Si es muy alto y se nota que la pasa mal, platícalo en privado y canaliza a orientación.'], fuente: 'Modelo de dos partes de la ansiedad ante los exámenes (preocupación y emocionalidad; Liebert y Morris, 1967). Frases propias de Escuadra.' } }
  ];

  /* ---------- retos de razonamiento (propios) ---------- */
  // matrices: cada celda es una lista de figuras; s: circ | sq | tri | dia | arr (r: grados) | vl | hl | d1 | d2 ; n: cuántas ; f: 0 vacía, 1 rayada, 2 llena
  const C = (s, n, f, r) => [{ s: s, n: n || 1, f: f == null ? 2 : f, r: r || 0 }];
  const MAT = [
    { celdas: [C('circ', 1), C('circ', 2), C('circ', 3), C('sq', 1), C('sq', 2), C('sq', 3), C('tri', 1), C('tri', 2), null], op: [C('tri', 2), C('tri', 3), C('sq', 3), C('circ', 3)], ok: 1 },
    { celdas: [C('circ', 1, 0), C('sq', 1, 0), C('tri', 1, 0), C('sq', 1, 1), C('tri', 1, 1), C('circ', 1, 1), C('tri', 1, 2), C('circ', 1, 2), null], op: [C('sq', 1, 0), C('circ', 1, 2), C('tri', 1, 2), C('sq', 1, 2)], ok: 3 },
    { celdas: [C('arr', 1, 2, 0), C('arr', 1, 2, 90), C('arr', 1, 2, 180), C('arr', 1, 2, 90), C('arr', 1, 2, 180), C('arr', 1, 2, 270), C('arr', 1, 2, 180), C('arr', 1, 2, 270), null], op: [C('arr', 1, 2, 0), C('arr', 1, 2, 270), C('arr', 1, 2, 90), C('arr', 1, 2, 180)], ok: 0 },
    { celdas: [C('vl'), C('hl'), C('vl').concat(C('hl')), C('d1'), C('d2'), C('d1').concat(C('d2')), C('circ', 1, 0), C('vl'), null], op: [C('circ', 1, 0), C('circ', 1, 0).concat(C('hl')), C('circ', 1, 0).concat(C('vl')), C('vl')], ok: 2 }
  ];
  // rotación: piezas de cuadritos; cada opción es la pieza girada r × 90° y, si m = 1, volteada (espejo)
  const ROT = [
    { p: [[0, 0], [0, 1], [0, 2], [1, 2]], op: [{ m: 1, r: 1 }, { m: 0, r: 1 }, { m: 1, r: 2 }, { m: 1, r: 3 }], ok: 1 },
    { p: [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]], op: [{ m: 1, r: 0 }, { m: 1, r: 2 }, { m: 1, r: 3 }, { m: 0, r: 2 }], ok: 3 },
    { p: [[0, 0], [0, 1], [1, 1], [1, 2], [1, 3]], op: [{ m: 0, r: 3 }, { m: 1, r: 1 }, { m: 1, r: 3 }, { m: 1, r: 0 }], ok: 0 },
    { p: [[1, 0], [0, 1], [1, 1], [1, 2], [1, 3]], op: [{ m: 1, r: 2 }, { m: 1, r: 1 }, { m: 0, r: 1 }, { m: 1, r: 3 }], ok: 2 }
  ];
  const RAZ = [
    { d: 0, q: '2, 4, 8, 16, …', op: ['32', '24', '30', '36'], ok: 0 },
    { d: 0, q: '2, 3, 5, 9, 17, …', op: ['25', '31', '33', '34'], ok: 2 },
    { d: 0, q: '5, 10, 8, 16, 14, …', op: ['12', '28', '30', '18'], ok: 1 },
    { d: 0, q: 'A, C, F, J, …', op: ['M', 'N', 'P', 'O'], ok: 3 },
    { d: 1, mat: 0, q: '¿Qué figura va en el cuadro vacío?' }, { d: 1, mat: 1, q: '¿Qué figura va en el cuadro vacío?' }, { d: 1, mat: 2, q: '¿Qué figura va en el cuadro vacío?' }, { d: 1, mat: 3, q: '¿Qué figura va en el cuadro vacío?' },
    { d: 2, rot: 0, q: '¿Cuál es la misma pieza, solo girada (sin voltearla)?' }, { d: 2, rot: 1, q: '¿Cuál es la misma pieza, solo girada (sin voltearla)?' }, { d: 2, rot: 2, q: '¿Cuál es la misma pieza, solo girada (sin voltearla)?' }, { d: 2, rot: 3, q: '¿Cuál es la misma pieza, solo girada (sin voltearla)?' },
    { d: 3, q: 'Motor es a movimiento como sensor es a…', op: ['energía', 'detección', 'cable', 'velocidad'], ok: 1 },
    { d: 3, q: 'Todos los relevadores tienen bobina. K1 es un relevador. Entonces…', op: ['K1 tiene bobina', 'K1 es un contactor', 'Toda bobina es un relevador', 'No se puede saber'], ok: 0 },
    { d: 3, q: '¿Cuál NO pertenece al grupo?', op: ['tornillo', 'tuerca', 'multímetro', 'rondana'], ok: 2 },
    { d: 3, q: 'El cilindro A sale antes que el B. El C sale después que el B. ¿Cuál sale primero?', op: ['B', 'C', 'A', 'No se puede saber'], ok: 2 }
  ];
  RAZ.forEach(x => { if (x.mat != null) { x.ok = MAT[x.mat].ok; x.op = [0, 1, 2, 3]; } if (x.rot != null) { x.ok = ROT[x.rot].ok; x.op = [0, 1, 2, 3]; } });
  T.find(x => x.id === 'razon').items = RAZ;

  // dibujo de celdas de matriz y piezas (SVG sin variables de CSS: se ve igual en claro y oscuro)
  const INK = '#12221f';
  const fig = (x, cx, cy, k) => { const s = 13 * k, col = INK, fill = x.f === 2 ? INK : x.f === 1 ? 'url(#rayas)' : '#fff';
    if (x.s === 'circ') return '<circle cx="' + cx + '" cy="' + cy + '" r="' + s + '" fill="' + fill + '" stroke="' + col + '" stroke-width="2.4"/>';
    if (x.s === 'sq') return '<rect x="' + (cx - s) + '" y="' + (cy - s) + '" width="' + (2 * s) + '" height="' + (2 * s) + '" fill="' + fill + '" stroke="' + col + '" stroke-width="2.4"/>';
    if (x.s === 'tri') return '<path d="M' + cx + ' ' + (cy - s * 1.1) + ' L' + (cx + s * 1.1) + ' ' + (cy + s * .9) + ' L' + (cx - s * 1.1) + ' ' + (cy + s * .9) + 'Z" fill="' + fill + '" stroke="' + col + '" stroke-width="2.4" stroke-linejoin="round"/>';
    if (x.s === 'dia') return '<path d="M' + cx + ' ' + (cy - s * 1.2) + ' L' + (cx + s) + ' ' + cy + ' L' + cx + ' ' + (cy + s * 1.2) + ' L' + (cx - s) + ' ' + cy + 'Z" fill="' + fill + '" stroke="' + col + '" stroke-width="2.4"/>';
    if (x.s === 'arr') return '<g transform="rotate(' + x.r + ' ' + cx + ' ' + cy + ')"><path d="M' + cx + ' ' + (cy - 26) + ' L' + (cx + 15) + ' ' + (cy - 6) + ' L' + (cx + 6) + ' ' + (cy - 6) + ' L' + (cx + 6) + ' ' + (cy + 24) + ' L' + (cx - 6) + ' ' + (cy + 24) + ' L' + (cx - 6) + ' ' + (cy - 6) + ' L' + (cx - 15) + ' ' + (cy - 6) + 'Z" fill="' + INK + '"/></g>';
    const L = { vl: [cx, cy - 26, cx, cy + 26], hl: [cx - 26, cy, cx + 26, cy], d1: [cx - 22, cy - 22, cx + 22, cy + 22], d2: [cx - 22, cy + 22, cx + 22, cy - 22] }[x.s];
    if (L) return '<line x1="' + L[0] + '" y1="' + L[1] + '" x2="' + L[2] + '" y2="' + L[3] + '" stroke="' + INK + '" stroke-width="3.2" stroke-linecap="round"/>';
    if (x.s === 'circ0') return '';
    return ''; };
  const celda = (c, x0, y0) => { if (!c) return '<rect x="' + (x0 + 3) + '" y="' + (y0 + 3) + '" width="64" height="64" rx="6" fill="#fff7d6" stroke="#c99a06" stroke-width="2" stroke-dasharray="5 4"/><text x="' + (x0 + 35) + '" y="' + (y0 + 46) + '" text-anchor="middle" font-size="28" font-weight="800" fill="#c99a06">?</text>';
    let s = '<rect x="' + (x0 + 3) + '" y="' + (y0 + 3) + '" width="64" height="64" rx="6" fill="#fff" stroke="#9aa9a6" stroke-width="1.5"/>';
    c.forEach(x => { const n = x.n || 1, k = n > 2 ? .55 : n > 1 ? .7 : 1, pos = n === 1 ? [[35, 35]] : n === 2 ? [[22, 35], [48, 35]] : [[35, 18], [20, 48], [50, 48]]; pos.forEach(p => { s += fig(x, x0 + p[0], y0 + p[1], k); }); });
    return s; };
  const defs = '<defs><pattern id="rayas" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#fff"/><line x1="0" y1="0" x2="0" y2="6" stroke="#12221f" stroke-width="2.6"/></pattern></defs>';
  const matSVG = i => { const M = MAT[i]; let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 216 216" class="cn-mat" role="img" aria-label="Matriz de 3 por 3 con un cuadro vacío">' + defs; M.celdas.forEach((c, j) => { s += celda(c, (j % 3) * 72, Math.floor(j / 3) * 72); }); return s + '</svg>'; };
  const opMatSVG = (i, j) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" class="cn-op" role="img" aria-label="Opción ' + 'ABCD'[j] + '">' + defs + celda(MAT[i].op[j], 0, 0) + '</svg>';
  const tf = (p, m, r) => { let q = p.map(c => [m ? -c[0] : c[0], c[1]]); for (let k = 0; k < r; k++) q = q.map(c => [-c[1], c[0]]); const mx = Math.min.apply(null, q.map(c => c[0])), my = Math.min.apply(null, q.map(c => c[1])); return q.map(c => [c[0] - mx, c[1] - my]).sort((a, b) => a[0] - b[0] || a[1] - b[1]); };
  const pieza = (cells, lado, col) => { const w = Math.max.apply(null, cells.map(c => c[0])) + 1, h = Math.max.apply(null, cells.map(c => c[1])) + 1, k = lado / Math.max(w, h, 4), ox = (lado - w * k) / 2, oy = (lado - h * k) / 2;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + lado + ' ' + lado + '" class="cn-pz" role="img" aria-label="Pieza">' + '<rect width="' + lado + '" height="' + lado + '" rx="8" fill="#fff"/>' + cells.map(c => '<rect x="' + (ox + c[0] * k + 1) + '" y="' + (oy + c[1] * k + 1) + '" width="' + (k - 2) + '" height="' + (k - 2) + '" rx="3" fill="' + (col || '#0e5e5a') + '"/>').join('') + '</svg>'; };
  const rotSVG = i => pieza(ROT[i].p, 120, '#0e5e5a');
  const opRotSVG = (i, j) => { const o = ROT[i].op[j]; return pieza(tf(ROT[i].p, o.m, o.r), 90, '#e0791b'); };

  /* ---------- puntajes ---------- */
  const test = id => T.find(x => x.id === id || x.L === id);
  const nOp = t => t.esc ? t.esc.length : 4;
  // cuántos reactivos por dimensión y rango de cada puntaje (para empacar el código)
  T.forEach(t => { t.n = t.dims.map((_, d) => t.items.filter(x => x.d === d).length); t.rad = t.raz ? t.n.map(n => n + 1) : t.n.map(n => n * (nOp(t) - 1) + 1); });
  // r: respuestas { índice: valor (1..n) o índice de opción }; regresa la suma por dimensión desde 0
  const puntua = (id, r) => { const t = test(id); const s = t.dims.map(() => 0);
    t.items.forEach((x, i) => { const v = r[i]; if (v == null || v === '') return; if (t.raz) { if (Number(v) === x.ok) s[x.d]++; } else { const n = nOp(t); s[x.d] += (x.inv ? n + 1 - Number(v) : Number(v)) - 1; } });
    return s; };
  const completo = (id, r) => { const t = test(id); return t.items.every((_, i) => r && r[i] != null && r[i] !== ''); };
  const contestadas = (id, r) => { const t = test(id); return t.items.filter((_, i) => r && r[i] != null && r[i] !== '').length; };
  // nivel 0 bajo, 1 medio, 2 alto (con el puntaje en proporción 0..1)
  const prop = (id, d, s) => { const t = test(id); return t.rad[d] > 1 ? s / (t.rad[d] - 1) : 0; };
  const nivel = (id, d, s) => { const t = test(id), p = prop(id, d, s); if (t.raz) return s >= 3 ? 2 : s >= 2 ? 1 : 0; return p >= 0.7 ? 2 : p >= 0.4 ? 1 : 0; };
  const NIV = ['bajo', 'medio', 'alto'];

  /* ---------- código para el profe: letra + datos + 1 de verificación ---------- */
  const ALF = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const fnv = s => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const largo = t => { let p = t.rad.reduce((a, b) => a * b, 1), n = 0; while (p > 1) { p /= 32; n++; } return Math.max(1, n); };
  const codigo = (c, num, id, s) => { const t = test(id); let p = 0; s.forEach((x, i) => { p = p * t.rad[i] + Math.max(0, Math.min(t.rad[i] - 1, x | 0)); }); let d = ''; for (let i = 0; i < largo(t); i++) { d = ALF[p % 32] + d; p = Math.floor(p / 32); }
    return t.L + d + ALF[fnv('cono|' + c + '|' + num + '|' + t.L + d) % 32]; };
  const limpia = cod => String(cod || '').toUpperCase().replace(/[^0-9A-Z]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1').replace(/U/g, 'V');
  const lee = (c, num, cod) => { const s = limpia(cod), t = test(s[0]); if (!t || s.length !== largo(t) + 2) return null; const d = s.slice(1, -1);
    if (ALF[fnv('cono|' + c + '|' + num + '|' + t.L + d) % 32] !== s[s.length - 1]) return null;
    let p = 0; for (const ch of d) { const v = ALF.indexOf(ch); if (v < 0) return null; p = p * 32 + v; }
    const out = []; for (let i = t.rad.length - 1; i >= 0; i--) { out.unshift(p % t.rad[i]); p = Math.floor(p / t.rad[i]); } if (p) return null; return { id: t.id, s: out }; };
  const fmt = cod => { const s = limpia(cod); return s.length > 5 ? s.slice(0, Math.ceil(s.length / 2)) + '-' + s.slice(Math.ceil(s.length / 2)) : s; };
  // QR con todos los códigos de un alumno: ESCC1|c|num|cod1.cod2…
  const qrTxt = (c, num, cods) => 'ESCC1|' + c + '|' + num + '|' + cods.join('.');
  const leeQR = txt => { const p = String(txt || '').split('|'); if (p[0] !== 'ESCC1' || p.length < 4) return null; return { c: p[1], num: Number(p[2]), cods: p[3].split('.').filter(Boolean) }; };

  window.CONO = { T: T, test: test, MAT: MAT, ROT: ROT, matSVG: matSVG, opMatSVG: opMatSVG, rotSVG: rotSVG, opRotSVG: opRotSVG, tf: tf, puntua: puntua, completo: completo, contestadas: contestadas, prop: prop, nivel: nivel, NIV: NIV,
    codigo: codigo, lee: lee, fmt: fmt, qrTxt: qrTxt, leeQR: leeQR, largo: largo,
    AVISO: 'Son autoevaluaciones para conocerte y aprender mejor, no exámenes ni diagnósticos. No cuentan para tu calificación. Solo tu profe ve tus resultados.',
    FUENTE: 'Reactivos escritos para Escuadra a partir de modelos publicados (Dunlosky et al., 2013; Dweck; Yeager et al., 2019; TMMS de Salovey y Mayer y TMMS-24 de Fernández-Berrocal et al., 2004; ICAR de Condon y Revelle, 2014; Bandura, 1997; Liebert y Morris, 1967). No son las pruebas originales ni tienen normas.' };
})();
