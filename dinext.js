/* Escuadra · Más dinámicas (v1.37.0): activadores de 2 a 5 minutos, juegos de repaso del tema, retos mecatrónicos rápidos
   con material barato y cierres de clase. Se suman al catálogo de Dinámicas, se pueden imprimir (ficha y material) y se
   abren desde la clase con el botón «🎲 Dinámica rápida» según cómo esté el grupo. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, esc = u.esc;
  const A = E.actions, H = E.h, btn = H.btn, DN = E.dinamicas, L = E.DINAMICAS, FU = E.FUENTES_DIN;
  if (!DN || !L) return;

  /* ---------- fuentes nuevas ---------- */
  Object.assign(FU, {
    watson: ['Watson y col. (2017). La actividad física en el salón mejora la conducta en la tarea (DME = 0.60). International Journal of Behavioral Nutrition and Physical Activity, 14:114', 'https://doi.org/10.1186/s12966-017-0569-9'],
    rosen: ['Rosenshine (2012). Principles of Instruction: repaso diario de 5 a 8 min, pasos pequeños, muchas preguntas y revisar la comprensión. American Educator 36(1)', 'https://www.aft.org/sites/default/files/periodicals/Rosenshine.pdf'],
    roediger: ['Roediger y Karpicke (2006). Recordar con preguntas (práctica de recuperación) fija más que volver a leer. Psychological Science 17(3)', 'https://doi.org/10.1111/j.1467-9280.2006.01693.x'],
    perry: ['Perry y col. (2021). Ciencia cognitiva en el salón: revisión de evidencia (EEF). La práctica de recuperación tiene buen respaldo, sobre todo para datos y vocabulario', 'https://educationendowmentfoundation.org.uk/education-evidence/evidence-reviews/cognitive-science-approaches-in-the-classroom'],
    hulleman: ['Hulleman y Harackiewicz (2009). Escribir para qué les sirve el tema aumenta el interés y el desempeño, sobre todo en quien espera ir mal. Science 326(5958)', 'https://doi.org/10.1126/science.1177067']
  });

  /* ---------- nuevos objetivos ---------- */
  [['activar', '⚡ Activarlos (2 a 5 min)'], ['repasar', '🧠 Repasar el tema jugando'], ['reto', '🛠️ Reto mecatrónico'], ['cerrar', '🏁 Cerrar la clase']].forEach(o => { if (!DN.OBJ.some(x => x[0] === o[0])) DN.OBJ.push(o); });

  // atajo para escribir cada dinámica: [id, ico, título, obj, min, energía, grupo, material, para, alumnos, pasos, instr, cierre, cuidar, fuentes, extra]
  const mk = (a) => Object.assign({ id: a[0], ico: a[1], t: a[2], obj: a[3], min: a[4], en: a[5], lugar: ['aula'], grupo: a[6], riesgo: 'bajo', mat: a[7], para: a[8], alumnos: a[9], pasos: a[10], instr: a[11], cierre: a[12], cuidar: a[13] || [], f: a[14] || [] }, a[15] || {});
  const NUEVAS = [
    /* ===== activadores de 2 a 5 minutos ===== */
    ['simon', '🤖', 'El PLC dice (Simón dice mecatrónico)', ['activar'], 3, 'alta', 'Todo el grupo, de pie', '',
      'Despertarlos en 3 minutos y repasar actuadores con el cuerpo.', 'Solo obedece si la orden empieza con «El PLC dice». Si no, te quedas quieto.',
      [[1, 'De pie. Explica: brazos al frente = cilindro extendido; brazos al pecho = retraído; girar = motor; manos arriba = alarma.'], [2, 'Da órdenes rápidas, unas con «El PLC dice» y otras sin. Quien se equivoca ayuda a dar la siguiente orden.']],
      ['Ponte de pie', 'Solo obedece si escuchas «El PLC dice»', 'Brazos al frente = cilindro extendido · al pecho = retraído', 'Girar = motor · manos arriba = alarma'],
      ['¿Qué pasa en una máquina si un actuador obedece una señal que no era para él?'], ['Que nadie quede fuera por equivocarse: pasa a ser «programador».'], ['watson']],
    ['evolucion', '✊', 'Piedra, papel o tijera: evolución', ['activar', 'integrar'], 4, 'alta', 'Todo el grupo, caminando', '',
      'Subir la energía y mezclar al grupo.', 'Todos empiezan como «tornillo». Gana y subes: tornillo → engrane → motor → robot. Solo juegas con alguien de tu mismo nivel.',
      [[1, 'Explica los niveles y la mímica de cada uno (tornillo: girar el dedo; engrane: manos que giran; motor: brrr; robot: paso robótico).'], [3, 'Caminan, buscan a alguien del mismo nivel y juegan. Quien llega a robot ayuda a animar.']],
      ['Busca a alguien de tu mismo nivel', 'Gana = subes de nivel; pierdes = bajas uno', 'Tornillo → engrane → motor → robot'], ['¿Quién llegó a robot? ¿Cuántas veces bajaste antes de lograrlo?'], ['Mueve las bancas si hace falta espacio.'], ['watson']],
    ['contar', '🔢', 'Contar a 20 sin chocar', ['activar', 'calma', 'colaborar'], 4, 'calma', 'Todo el grupo', '',
      'Enfocar a un grupo disperso: exige escucharse.', 'Cuenten del 1 al 20 en voz alta, una persona a la vez y sin ponerse de acuerdo. Si dos hablan al mismo tiempo, se empieza de nuevo.',
      [[1, 'Ojos cerrados o mirando al piso. Nadie se pone de acuerdo ni hace señas.'], [3, 'Cuentan. Si chocan, de vuelta al 1. Celebren cada récord.']],
      ['Una persona dice un número a la vez', 'Si dos hablan juntos, se reinicia', 'No hay turnos ni señas'], ['¿Qué tuvieron que hacer para no chocar?', '¿Dónde más nos sirve escuchar antes de actuar?'], [], ['watson']],
    ['zip', '⚡', 'Zip-Zap-Boing', ['activar', 'integrar'], 4, 'alta', 'Círculo de 10 a 15', '',
      'Reflejos y risa para salir del sueño.', 'Zip pasa la energía al de al lado, Zap a alguien del otro lado señalándolo, Boing la regresa.',
      [[1, 'En círculo. Explica: Zip (al lado), Zap (señalas a otro), Boing (rebota de regreso).'], [3, 'Jueguen rápido. Quien se equivoca da una vuelta en su lugar y sigue.']],
      ['Zip = al de al lado', 'Zap = a quien señales', 'Boing = rebota de regreso'], ['¿Qué pasó cuando subimos la velocidad?'], [], ['watson']],
    ['estira', '🙆', 'Estiramiento de 60 segundos', ['activar', 'calma'], 2, 'calma', 'Todo el grupo', '',
      'Una pausa corta después de mucho tiempo sentados.', 'Sigue los movimientos: cuello, hombros, brazos, espalda. Respira lento.',
      [[2, 'Guía: girar hombros (10 s), estirar brazos arriba (10 s), cuello a cada lado (20 s), torsión de espalda sentados (20 s).']],
      ['Movimientos suaves, sin forzar', 'Respira lento'], ['¿Cómo te sientes ahora para seguir?'], ['Que nadie haga movimientos bruscos; quien tenga alguna molestia puede solo respirar.'], ['watson']],
    ['esquinas', '🧭', 'Cuatro esquinas', ['activar', 'repasar'], 5, 'media', 'Todo el grupo', 'Letreros A, B, C y D en las esquinas (o el pizarrón)',
      'Moverse y repasar al mismo tiempo.', 'Escucha la pregunta y camina a la esquina de tu respuesta (A, B, C o D).',
      [[1, 'Marca las esquinas A, B, C y D.'], [4, 'Lee 4 o 5 preguntas de opción múltiple. Antes de dar la respuesta, pide que alguien de cada esquina diga por qué la eligió.']],
      ['Escucha la pregunta', 'Camina a la esquina de tu respuesta', 'Prepárate para decir por qué'], ['¿Quién cambió de esquina al escuchar a otros? ¿Por qué?'], [], ['watson', 'roediger']],
    ['programa', '🦾', 'Programa a tu compañero', ['activar', 'comunicar', 'reto'], 5, 'media', 'Parejas', 'Hoja y pluma',
      'Entender que una máquina hace exactamente lo que le dices, no lo que quisiste decir.', 'Uno es el programador y da instrucciones exactas; el otro es el robot y hace solo lo que escucha, al pie de la letra.',
      [[1, 'Explica: el robot no adivina. Reto: que el robot dibuje una casa (o se ponga la chamarra) solo con instrucciones.'], [3, 'Juegan; a la mitad cambian de papel.'], [1, 'Comenten los «errores de programa» más chistosos.']],
      ['Programador: instrucciones exactas, paso a paso', 'Robot: haz solo lo que escuchas', 'A la mitad cambian'], ['¿Qué instrucción falló? ¿Cómo la escribirías como código?'], [], ['colab']],
    ['manos', '✋', 'Mano derecha, mano izquierda', ['activar', 'calma'], 2, 'calma', 'Todo el grupo', '',
      'Reto de coordinación que obliga a concentrarse.', 'Con una mano dibuja círculos en el aire y con la otra triángulos. Luego cambia.',
      [[2, 'Círculos con la derecha y triángulos con la izquierda (30 s); cambien (30 s); el pie derecho hace círculos mientras escriben su nombre en el aire (30 s).']],
      ['Una mano círculos, la otra triángulos', 'Luego cambia'], ['¿Qué tuvo que hacer tu cerebro para lograrlo?'], [], []],
    ['relampago', '🙋', 'Pregunta relámpago de pie', ['activar', 'repasar'], 5, 'media', 'Todo el grupo, de pie', '',
      'Repasar rápido y despertar: todos de pie, quien responde bien se sienta.', 'Todos de pie. Te sientas cuando respondas una pregunta bien. Si alguien está atorado, el grupo puede darle una pista.',
      [[1, 'Todos de pie.'], [4, 'Preguntas cortas del tema, alternando nombres al azar (🎲). Quien responde se sienta; permite pistas del grupo.']],
      ['Todos de pie', 'Respondes bien y te sientas', 'Puedes dar una pista a quien siga de pie'], ['¿Qué pregunta les costó más? Esa la repasamos.'], ['Nadie queda al final solo: si faltan 3, que se sienten juntos con ayuda del grupo.'], ['roediger', 'rosen']],
    ['ritmo', '👏', 'Aplauso en cadena', ['activar', 'integrar', 'calma'], 3, 'media', 'Todo el grupo', '',
      'Sincronizar al grupo y recuperar su atención.', 'Pasa el aplauso a la persona de al lado lo más rápido posible, sin que se rompa la cadena.',
      [[1, 'En círculo o por filas: el aplauso viaja de uno en uno.'], [2, 'Midan el tiempo de una vuelta; intenten bajar el récord. Luego cambien de sentido.']],
      ['Aplaude cuando te llegue', 'Pásalo rápido al de al lado'], ['¿Qué ayudó a bajar el tiempo?'], [], []],

    /* ===== juegos de repaso del tema ===== */
    ['trivia', '🏆', 'Trivia por equipos del tema', ['repasar', 'colaborar'], 15, 'media', 'Equipos de 4', 'Hojas para responder (o pizarrón por equipo)',
      'Repasar con preguntas del banco del tema: cada equipo responde por escrito y se revela la respuesta.', 'Por equipo: escuchen la pregunta, pónganse de acuerdo y escriban su respuesta. Un punto por acierto.',
      [[2, 'Forma equipos de 4 (al azar). Cada equipo nombra a quien escribe.'], [11, 'Proyecta 8 preguntas del tema (botón en la clase). 1 minuto por pregunta; luego revela y anota puntos.'], [2, 'Repasen la pregunta que más fallaron.']],
      ['Escuchen la pregunta', 'Pónganse de acuerdo y escriban', 'Un punto por acierto'], ['¿Cuál pregunta fallaron más equipos? ¿Por qué?'], ['Rota a quien escribe en cada pregunta para que todos participen.'], ['roediger', 'perry'], { trivia: 1 }],
    ['quiensoy', '🕵️', '¿Qué componente soy?', ['repasar', 'comunicar'], 15, 'media', 'Equipos de 4', 'Tarjetas impresas con componentes',
      'Repasar componentes describiendo su función.', 'Toma una tarjeta sin verla y póntela en la frente. Haz preguntas de sí o no para adivinar qué componente eres.',
      [[1, 'Reparte las tarjetas boca abajo.'], [12, 'Por turnos: preguntas de sí o no («¿giro?», «¿convierto energía?», «¿me controla un PLC?»).'], [2, 'Cada quien explica para qué sirve su componente.']],
      ['No veas tu tarjeta', 'Solo preguntas de sí o no', 'Al adivinar, explica para qué sirves'], ['¿Qué pregunta te ayudó más a adivinar?'], [], ['roediger'], { imp: 'quiensoy' }],
    ['vfcuerpo', '↕️', 'Verdadero o falso con el cuerpo', ['repasar', 'activar'], 8, 'media', 'Todo el grupo', '',
      'Revisar la comprensión de todos a la vez.', 'De pie = verdadero. Sentado = falso. Todos responden al mismo tiempo.',
      [[1, 'Explica la señal.'], [7, 'Lee 8 afirmaciones del tema (puedes usar las de verdadero o falso del banco). Pide a alguien de cada postura que explique.']],
      ['De pie = verdadero', 'Sentado = falso', 'Todos responden a la vez'], ['¿En cuál se dividió el grupo? Esa la explicamos otra vez.'], [], ['rosen', 'roediger']],
    ['tabu', '🚫', 'Tabú técnico', ['repasar', 'comunicar'], 15, 'alta', 'Dos equipos', 'Tarjetas impresas de tabú',
      'Explicar conceptos con sus propias palabras.', 'Describe el concepto de tu tarjeta sin decir las palabras prohibidas. Tu equipo tiene 1 minuto para adivinar.',
      [[1, 'Explica las reglas.'], [12, 'Turnos de 1 minuto por equipo. Un punto por concepto adivinado.'], [2, '¿Qué conceptos costaron más?']],
      ['Describe sin decir las palabras prohibidas', 'Tienes 1 minuto', 'Un punto por concepto'], ['¿Qué palabras usaste en lugar de las prohibidas?'], [], ['roediger'], { imp: 'tabu' }],
    ['relevos', '🏃', 'Relevos en el pizarrón', ['repasar', 'colaborar', 'activar'], 10, 'alta', 'Equipos de 4 o 5', 'Pizarrón y plumones',
      'Repasar una lista (pasos, partes, fórmulas) en equipo y con movimiento.', 'Por turnos, corre al pizarrón y escribe una cosa de la lista. Luego pasa el plumón al siguiente.',
      [[1, 'Divide el pizarrón en columnas, una por equipo. Da la consigna: «partes de un motor», «pasos para soldar», etc.'], [6, 'Relevos de 3 minutos por consigna (dos consignas).'], [3, 'Revisen juntos: punto por respuesta correcta y no repetida.']],
      ['Uno a la vez', 'Escribe una sola cosa y pasa el plumón', 'No se vale repetir'], ['¿Qué faltó en todas las columnas?'], ['Que caminen rápido, no corran entre bancas.'], ['watson', 'roediger']],
    ['errorint', '🔍', 'Encuentra el error', ['repasar', 'perseverar'], 10, 'calma', 'Parejas', 'Un diagrama, cálculo o programa con un error a propósito',
      'Revisar con ojo crítico, como en el trabajo real.', 'En este diagrama (o cálculo o programa) hay un error. Encuéntrenlo y expliquen cómo corregirlo.',
      [[1, 'Proyecta o dibuja el ejemplo con un error a propósito.'], [6, 'En parejas lo buscan y escriben la corrección.'], [3, 'Compartan: ¿cómo lo encontraron?']],
      ['Hay un error a propósito', 'Encuéntrenlo y corríjanlo', 'Expliquen cómo lo encontraron'], ['¿Qué revisas primero cuando algo no funciona?'], [], ['rosen']],
    ['domino', '🁫', 'Dominó de conceptos', ['repasar', 'colaborar'], 15, 'calma', 'Equipos de 3 o 4', 'Fichas impresas (las llenas con tus conceptos)',
      'Unir conceptos con su definición o su símbolo.', 'Junten las fichas: cada concepto debe tocar su definición. Gana el equipo que cierra la cadena primero y bien.',
      [[1, 'Reparte un juego de fichas por equipo.'], [10, 'Arman la cadena.'], [4, 'Revisan con el profe; corrigen.']],
      ['Une cada concepto con su definición', 'Cierren la cadena'], ['¿Cuáles pares les costaron?'], [], ['roediger'], { imp: 'domino' }],
    ['mapa5', '🗺️', 'Mapa mental en 5 minutos', ['repasar', 'crear'], 8, 'calma', 'Individual o parejas', 'Hoja',
      'Ordenar lo visto antes de un examen o al cerrar un tema.', 'En el centro, el tema. Alrededor, todo lo que recuerdes, sin ver tus apuntes. Luego completa con otro color.',
      [[5, 'Sin apuntes: escriben todo lo que recuerdan en ramas.'], [3, 'Con otro color completan con sus apuntes o con un compañero.']],
      ['Sin ver tus apuntes', 'El tema en el centro, ramas alrededor', 'Después completa con otro color'], ['Lo que escribiste con otro color es lo que debes repasar.'], [], ['roediger', 'perry']],

    /* ===== retos mecatrónicos rápidos ===== */
    ['catapulta', '🎯', 'Catapulta de abatelenguas', ['reto', 'crear', 'colaborar'], 20, 'alta', 'Equipos de 3', '7 abatelenguas, 5 ligas, una tapa de botella y bolitas de papel por equipo',
      'Ver la palanca y la energía elástica en acción.', 'Construyan una catapulta con el material. Gana la que lance más lejos y la que pegue en el blanco.',
      [[3, 'Muestra el principio: palanca + liga que guarda energía.'], [10, 'Construyen.'], [5, 'Competencia: distancia y puntería.'], [2, '¿Qué cambiaron para lanzar más lejos?']],
      ['Solo el material entregado', 'Prueben y mejoren', 'Retos: distancia y puntería'], ['¿Dónde está el punto de apoyo? ¿Qué pasa si lo mueven?', '¿Qué máquinas usan palancas así?'], ['Lancen solo bolitas de papel y nunca hacia personas.'], ['colab']],
    ['manorob', '🦾', 'Mano robótica de popotes', ['reto', 'crear'], 25, 'media', 'Parejas', 'Cartulina, 5 popotes, hilo, cinta y tijeras por pareja',
      'Entender tendones y actuadores: así se mueven los dedos de un robot.', 'Dibuja tu mano en cartulina, pega popotes en las falanges y pasa hilos como tendones. Al jalar, los dedos se doblan.',
      [[3, 'Muestra un ejemplo terminado.'], [18, 'Construyen.'], [4, 'Reto: tomar un vaso de papel con la mano robótica.']],
      ['Recorta la mano y marca las articulaciones', 'Popotes cortados = falanges', 'Los hilos son los tendones'], ['¿Qué actuador pondrías para jalar los hilos solo?'], ['Cuidado con las tijeras.'], []],
    ['jeringas', '💉', 'Brazo hidráulico de jeringas', ['reto', 'colaborar'], 30, 'media', 'Equipos de 3', '4 pares de jeringas, manguera de venoclisis, agua con colorante, cartón y abatelenguas por equipo',
      'Ver la hidráulica de verdad: una jeringa empuja y la otra se mueve.', 'Conecten dos jeringas con manguera y agua. Úsenlas para mover las partes de un brazo de cartón.',
      [[4, 'Muestra: dos jeringas conectadas, una empuja y la otra sale (Pascal).'], [20, 'Construyen el brazo con 2 o 3 ejes.'], [6, 'Reto: levantar una goma de borrar.']],
      ['Llena las jeringas sin burbujas', 'Una jeringa por movimiento', 'Prueba antes de pegar'], ['¿Qué pasa si una jeringa es más grande que la otra?', '¿Dónde se usa esto en la industria?'], ['Usa agua, nunca aceite; seca la mesa al terminar.'], []],
    ['grafito', '✏️', 'Circuito con lápiz de grafito', ['reto', 'crear'], 15, 'calma', 'Parejas', 'Lápiz 6B (o de puntillas suave), hoja, un LED y una pila de 9 V por pareja',
      'Ver que el grafito conduce y que el largo del trazo cambia la resistencia.', 'Dibuja una línea gruesa con el lápiz y conéctale el LED y la pila. Prueba trazos cortos y largos.',
      [[2, 'Muestra el montaje.'], [10, 'Prueban trazos de diferente largo y grosor; anotan qué pasa con el brillo.'], [3, 'Concluyen con la ley de Ohm.']],
      ['Línea gruesa y bien marcada', 'Cambia el largo y el grosor', 'Anota cómo cambia el brillo'], ['¿Por qué brilla menos con un trazo largo?'], ['Usa solo pila de 9 V; nunca corriente del contacto.'], []],
    ['engranes', '⚙️', 'Engranes de cartón', ['reto', 'crear'], 20, 'calma', 'Parejas', 'Plantillas impresas de engranes, cartón, tijeras, chinchetas o palillos',
      'Descubrir la relación de transmisión contando vueltas.', 'Recorta los engranes, móntalos en cartón y gira el pequeño. Cuenta cuántas vueltas da el grande.',
      [[2, 'Reparte las plantillas.'], [12, 'Recortan y montan.'], [6, 'Cuentan vueltas y calculan la relación (dientes grande / dientes chico).']],
      ['Recorta con cuidado los dientes', 'Monta los engranes para que engranen', 'Cuenta vueltas'], ['¿Qué ganas y qué pierdes con un engrane más grande?'], ['Cuidado con tijeras y chinchetas.'], [], { imp: 'engranes' }],
    ['globo', '🎈', 'Carrito impulsado por globo', ['reto', 'crear', 'colaborar'], 30, 'alta', 'Equipos de 3', 'Cartón, 4 tapas, 2 palitos de brocheta, un popote, un globo y cinta por equipo',
      'Acción y reacción, fricción y diseño en 30 minutos.', 'Construyan un carrito que avance solo con el aire del globo. Gana el que llegue más lejos.',
      [[3, 'Explica: el aire sale para atrás y el carro va para adelante.'], [20, 'Construyen y prueban.'], [7, 'Carrera y reflexión.']],
      ['Solo el material entregado', 'Prueba y mejora', 'Mide la distancia'], ['¿Qué frenaba a tu carrito?', '¿Qué cambiarías con más tiempo?'], ['Un globo por persona: no compartan la boquilla.'], ['colab']],
    ['palanca', '📏', 'Levanta un libro con un dedo', ['reto', 'activar'], 10, 'media', 'Parejas', 'Una regla de 30 cm, un lápiz y un libro por pareja',
      'Sentir la ventaja mecánica de una palanca.', 'Usa la regla como palanca y el lápiz como apoyo. Encuentra dónde poner el apoyo para levantar el libro con un solo dedo.',
      [[2, 'Muestra el montaje.'], [6, 'Prueban el apoyo en 3 posiciones y anotan cuál cuesta menos.'], [2, 'Relacionan con brazo de potencia y brazo de resistencia.']],
      ['Regla = palanca, lápiz = apoyo', 'Prueba 3 posiciones del apoyo', 'Anota cuál cuesta menos'], ['¿Por qué cuesta menos cuando el apoyo está cerca del libro?'], [], []],
    ['semhumano', '🚦', 'Semáforo humano (programa sin PLC)', ['reto', 'colaborar', 'activar'], 10, 'media', 'Equipos de 4', 'Tres hojas de colores (rojo, amarillo, verde) por equipo',
      'Entender una secuencia y un temporizador como en un PLC.', 'Tres personas son las luces y una es el PLC: da las órdenes con tiempos exactos. Luego agreguen un botón de peatón.',
      [[2, 'Explica la secuencia: verde 5 s, amarillo 2 s, rojo 5 s.'], [5, 'Cada equipo la ejecuta; luego agregan botón de peatón (alguien aplaude y el PLC debe responder).'], [3, 'Escriben la secuencia como pasos de programa.']],
      ['Luces: solo se encienden cuando el PLC lo dice', 'PLC: cuenta el tiempo exacto', 'Después: botón de peatón'], ['¿Qué pasó cuando llegó el botón a la mitad de la secuencia?'], [], []],
    ['humedad', '💧', 'Sensor de humedad con dos clavos', ['reto', 'crear'], 15, 'calma', 'Equipos de 3', '2 clavos, cables, un LED, una resistencia de 220 Ω, una pila de 9 V, un vaso con tierra seca y agua',
      'Ver que el agua conduce y que así funciona un sensor sencillo.', 'Clava los dos clavos en la tierra y conéctalos en serie con el LED. Agrega agua poco a poco y observa.',
      [[3, 'Muestra el circuito.'], [9, 'Arman y prueban con tierra seca y mojada.'], [3, '¿Cómo lo usarías para un riego automático?']],
      ['Arma el circuito en serie', 'Primero tierra seca, luego agrega agua', 'Observa el LED'], ['¿Qué parte haría de sensor en un sistema de riego con Arduino?'], ['Solo pila de 9 V. Lávense las manos al terminar.'], []],
    ['cajanegra', '📦', 'La caja negra', ['reto', 'perseverar', 'colaborar'], 15, 'media', 'Equipos de 4', 'Cajas cerradas con un mecanismo dentro (o una caja preparada por ti) y hojas',
      'Deducir qué mecanismo hay dentro solo observando entradas y salidas, como en un diagnóstico de fallas.', 'Muevan la entrada, observen la salida y dibujen qué mecanismo creen que hay dentro.',
      [[2, 'Reparte la caja (por ejemplo, gira una manivela y sale un movimiento de ida y vuelta).'], [9, 'Observan, miden y dibujan su hipótesis.'], [4, 'Abren la caja y comparan.']],
      ['No abran la caja', 'Observen la entrada y la salida', 'Dibujen su hipótesis'], ['¿Qué pista les sirvió más?', '¿Así se diagnostica una máquina que no puedes abrir?'], [], []],

    /* ===== cierres de clase ===== */
    ['boleto', '🎟️', 'Boleto de salida', ['cerrar', 'repasar'], 5, 'calma', 'Individual', 'Boletos impresos o papelitos',
      'Saber en 5 minutos qué entendió cada quien.', 'Antes de salir, responde en el boleto y entrégalo en la puerta.',
      [[4, 'Responden 2 preguntas: una del tema y «¿qué no me quedó claro?».'], [1, 'Lo entregan al salir.']],
      ['Responde las dos preguntas', 'Entrégalo en la puerta'], ['Al revisar: separa los boletos en «lo entendió», «casi» y «no»; empieza la siguiente clase con lo que faltó.'], [], ['rosen', 'fb'], { imp: 'boleto' }],
    ['tres21', '3️⃣', '3-2-1', ['cerrar', 'conocerse'], 5, 'calma', 'Individual', 'Hojas 3-2-1 impresas o una hoja',
      'Cerrar con lo aprendido, las dudas y la aplicación.', 'Escribe 3 cosas que aprendiste, 2 preguntas que te quedaron y 1 forma de usarlo.',
      [[4, 'Escriben.'], [1, 'Recoge o pide 2 voluntarios que lean su «1».']],
      ['3 cosas que aprendí', '2 preguntas que me quedaron', '1 forma en que lo usaría'], ['Las preguntas que se repiten son el inicio de la siguiente clase.'], [], ['rosen'], { imp: 'tres21' }],
    ['semcomp', '🚦', 'Semáforo de comprensión', ['cerrar', 'repasar'], 2, 'calma', 'Todo el grupo', 'Tarjetas verde, amarilla y roja (o dedos: 5, 3, 1)',
      'Ver en segundos cómo va todo el grupo.', 'Levanta la tarjeta: verde = lo entendí y lo puedo explicar; amarillo = más o menos; rojo = no lo entendí.',
      [[1, 'Todos levantan su tarjeta al mismo tiempo.'], [1, 'Si hay mucho rojo o amarillo, reexplica o forma parejas verde-rojo.']],
      ['Verde = lo puedo explicar', 'Amarillo = más o menos', 'Rojo = no lo entendí'], ['Pide a un verde que se lo explique a un rojo.'], ['Agradece el rojo: decir «no entendí» es lo más útil para aprender.'], ['rosen'], { imp: 'semaforo' }],
    ['palabra', '💬', 'Una palabra', ['cerrar', 'emociones'], 3, 'calma', 'Todo el grupo', '',
      'Cierre rápido para escuchar a todos.', 'Di una sola palabra que resuma la clase de hoy (o cómo te vas).',
      [[3, 'Ronda rápida, sin explicar. Se vale pasar.']], ['Una sola palabra', 'Se vale pasar'], ['¿Qué palabra se repitió más?'], [], ['sel']],
    ['titular', '📰', 'Titular de periódico', ['cerrar', 'comunicar', 'crear'], 5, 'calma', 'Parejas', 'Hoja',
      'Resumir lo esencial con creatividad.', 'Escriban el titular de periódico de la clase de hoy, en máximo 10 palabras.',
      [[3, 'Escriben el titular.'], [2, 'Leen 3 o 4 en voz alta.']], ['Máximo 10 palabras', 'Que diga lo más importante'], ['¿Qué titular resume mejor la clase?'], [], []],
    ['manana', '❓', 'La pregunta para mañana', ['cerrar'], 2, 'calma', 'Todo el grupo', '',
      'Dejar curiosidad para que lleguen a la siguiente clase.', 'Piensa en esta pregunta; mañana empezamos con ella.',
      [[2, 'Plantea una pregunta intrigante del siguiente tema (por ejemplo: «¿cómo sabe un elevador en qué piso está?»).']], ['Piénsala', 'Mañana la resolvemos'], [], [], []],
    ['utilidad', '🔧', '¿Para qué me sirve esto?', ['cerrar', 'conocerse'], 7, 'calma', 'Individual', 'Hoja o libreta',
      'Que encuentren por sí mismos la utilidad del tema: sube el interés.', 'Escribe 2 o 3 renglones: ¿para qué te sirve lo de hoy en tu vida, en tu casa o en el trabajo que quieres tener?',
      [[5, 'Escriben (no se califica la ortografía, solo que sea suyo).'], [2, 'Dos voluntarios leen.']],
      ['Escribe 2 o 3 renglones', 'Con un ejemplo de tu vida o del trabajo que quieres', 'No se califica la ortografía'], ['¿A quién le sorprendió la utilidad que encontró otro compañero?'], ['Que lo escriban ellos: decirles tú la utilidad no tiene el mismo efecto.'], ['hulleman']],
    ['metaprox', '🎯', 'Mi meta para la próxima clase', ['cerrar', 'perseverar'], 3, 'calma', 'Individual', 'Libreta',
      'Que cada quien se ponga una meta pequeña y concreta.', 'Escribe una meta pequeña para la próxima clase (por ejemplo: «terminar el circuito», «preguntar mi duda»).',
      [[3, 'Escriben su meta en la libreta; la próxima clase la revisan.']], ['Una meta pequeña y concreta', 'La revisamos la próxima clase'], [], [], ['bandura']]
  ].map(mk);
  NUEVAS.forEach(d => { if (!L.some(x => x.id === d.id)) L.push(d); });

  /* ---------- material para imprimir ---------- */
  const COMP = ['Resistencia', 'Capacitor', 'Diodo', 'LED', 'Transistor', 'Relevador', 'Fusible', 'Motor de CD', 'Motor a pasos', 'Servomotor', 'Cilindro de doble efecto', 'Válvula 5/2', 'Compresor', 'Sensor inductivo', 'Sensor ultrasónico', 'Final de carrera', 'PLC', 'Arduino', 'Engrane', 'Polea', 'Leva', 'Tornillo sin fin', 'Rodamiento', 'Multímetro'];
  const TABU = [['Resistencia', 'ohm', 'corriente', 'oponer'], ['Relevador', 'bobina', 'contacto', 'interruptor'], ['Cilindro', 'aire', 'vástago', 'émbolo'], ['Sensor', 'detectar', 'señal', 'medir'], ['PLC', 'programa', 'controlador', 'industria'], ['Engrane', 'dientes', 'girar', 'rueda'], ['Diodo', 'sentido', 'corriente', 'semiconductor'], ['Motor', 'girar', 'eléctrico', 'eje'], ['Compresor', 'aire', 'presión', 'tanque'], ['Arduino', 'programar', 'placa', 'pines'], ['Voltaje', 'volts', 'pila', 'diferencia'], ['Palanca', 'apoyo', 'fuerza', 'barra'], ['Soldar', 'cautín', 'estaño', 'pegar'], ['Polea', 'cuerda', 'rueda', 'subir'], ['Válvula', 'abrir', 'cerrar', 'paso'], ['Capacitor', 'carga', 'guardar', 'faradio']];
  DN.IMP = {
    quiensoy: { t: 'Tarjetas', html: () => '<div class="pr dx-cards">' + COMP.map(c => '<div class="dx-card"><b>' + esc(c) + '</b><small>¿Qué componente soy?</small></div>').join('') + '</div>' },
    tabu: { t: 'Tarjetas', html: () => '<div class="pr dx-cards">' + TABU.map(c => '<div class="dx-card tb"><b>' + esc(c[0]) + '</b><small>No digas:</small><span>' + c.slice(1).map(esc).join('<br>') + '</span></div>').join('') + '</div>' },
    domino: { t: 'Fichas en blanco', html: () => '<div class="pr"><p class="tiny">Escribe en cada ficha un concepto (izquierda) y la definición de OTRO concepto (derecha). La última definición debe ser del primer concepto, para que la cadena se cierre.</p><div class="dx-dom">' + Array.from({ length: 12 }, () => '<div class="dx-ficha"><div></div><div></div></div>').join('') + '</div></div>' },
    boleto: { t: 'Boletos', html: () => '<div class="pr dx-bol">' + Array.from({ length: 6 }, () => '<div class="dx-b"><b>🎟️ Boleto de salida</b><p>Nombre: ________________________ No. ____</p><p>1. Lo más importante de hoy fue:</p><div class="dx-l"></div><div class="dx-l"></div><p>2. Lo que no me quedó claro:</p><div class="dx-l"></div></div>').join('') + '</div>' },
    tres21: { t: 'Hojas 3-2-1', html: () => '<div class="pr dx-bol">' + Array.from({ length: 4 }, () => '<div class="dx-b"><b>3-2-1</b> <span class="tiny">Nombre: ____________________</span><p>3 cosas que aprendí:</p><div class="dx-l"></div><div class="dx-l"></div><div class="dx-l"></div><p>2 preguntas que me quedaron:</p><div class="dx-l"></div><div class="dx-l"></div><p>1 forma en que lo usaría:</p><div class="dx-l"></div></div>').join('') + '</div>' },
    semaforo: { t: 'Tarjetas de colores', html: () => '<div class="pr dx-sem">' + ['#2e9d57', '#f2b705', '#d63b2f'].map((c, i) => '<div class="dx-s" style="background:' + c + '"><b>' + ['Lo entendí', 'Más o menos', 'No lo entendí'][i] + '</b></div>').join('') + '<p class="tiny">Imprime en color, recorta y pega en abatelenguas (un juego por alumno o por pareja).</p></div>' },
    engranes: { t: 'Plantilla de engranes', html: () => { const g = (n, r) => { const m = 2 * Math.PI / n, R = r, ri = r - 7; let p = ''; for (let i = 0; i < n; i++) { const a = i * m; [[ri, a], [R, a + m * 0.2], [R, a + m * 0.5], [ri, a + m * 0.7]].forEach((q, j) => { p += (i || j ? 'L' : 'M') + (r + 10 + q[0] * Math.cos(q[1])).toFixed(1) + ' ' + (r + 10 + q[0] * Math.sin(q[1])).toFixed(1) + ' '; }); } return '<svg width="' + (2 * r + 20) + '" height="' + (2 * r + 20) + '" viewBox="0 0 ' + (2 * r + 20) + ' ' + (2 * r + 20) + '"><path d="' + p + 'Z" fill="none" stroke="#000" stroke-width="1"/><circle cx="' + (r + 10) + '" cy="' + (r + 10) + '" r="3" fill="#000"/><text x="' + (r + 10) + '" y="' + (r + 26) + '" text-anchor="middle" font-size="11">' + n + ' dientes</text></svg>'; };
      return '<div class="pr"><p class="tiny">Pega la hoja en cartón, recorta y monta cada engrane con una chincheta en el centro. Cuenta las vueltas: relación = dientes del grande ÷ dientes del chico.</p><div class="dx-gears">' + g(12, 60) + g(24, 115) + g(36, 165) + '</div></div>'; } }
  };
  // ficha de cualquier dinámica en una hoja
  DN.fichaHTML = d => '<div class="pr dx-ficha-p"><h1>' + d.ico + ' ' + esc(d.t) + '</h1><p class="dx-meta">' + d.pasos.reduce((a, p) => a + p[0], 0) + ' min · ' + esc(d.grupo) + (d.mat ? ' · Material: ' + esc(d.mat) : '') + '</p><p><b>Para qué:</b> ' + esc(d.para) + '</p>' +
    '<h2>Paso a paso</h2><ol>' + d.pasos.map(p => '<li><b>' + p[0] + ' min.</b> ' + esc(p[1]) + '</li>').join('') + '</ol><h2>Lo que ven los alumnos</h2><p><i>' + esc(d.alumnos) + '</i></p><ul>' + d.instr.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' +
    (d.cierre.length ? '<h2>Para cerrar</h2><ol>' + d.cierre.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol>' : '') + (d.cuidar.length ? '<h2>Cuida</h2><ul>' + d.cuidar.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '') +
    (d.f.length ? '<p class="tiny">Respaldo: ' + d.f.map(k => FU[k] ? esc(FU[k][0]) : '').filter(Boolean).join(' · ') + '</p>' : '') + '</div>';
  A['dn-ficha'] = el => { const d = L.find(x => x.id === el.dataset.id); if (d) E.print.run(DN.fichaHTML(d), { title: 'Dinámica · ' + d.t, unaHoja: true }); };
  A['dn-imp'] = el => { const d = L.find(x => x.id === el.dataset.id), m = d && DN.IMP[d.imp || d.id]; if (m) E.print.run(m.html(), { title: d.t + ' · ' + m.t, margin: '8mm' }); };

  /* ---------- trivia del tema (preguntas del banco) ---------- */
  DN.temasDia = (g, f) => { const d = E.clases && E.clases.dia ? E.clases.dia(g, f) : null, s = new Set(); if (d) d.bloques.forEach(b => (b.parts || []).forEach(p => { if (p.it && p.it.tema) s.add(p.it.tema); })); return Array.from(s); };
  DN.preguntas = (temas, n) => { const B = (E.BANCO || []).filter(b => temas.indexOf(b.tema) >= 0 && (b.tipo === 'om' || b.tipo === 'vf')), a = B.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, n || 8); };
  A['dn-trivia'] = el => {
    const g = D.grupoActual(), f = el.dataset.f || u.today(); let t = DN.temasDia(g, f);
    if (!DN.preguntas(t, 1).length && E.clases) { const ant = E.calc.claseAnterior ? E.calc.claseAnterior(g, f) : null; if (ant) t = t.concat(DN.temasDia(g, ant)); }
    const qs = DN.preguntas(t, 8); if (!qs.length) { u.toast('Este tema todavía no tiene preguntas en el banco. Usa «Verdadero o falso con el cuerpo» con tus propias preguntas.', 'err', 5000); return; }
    const s = [{ k: 'cover', h: '🏆 Trivia por equipos', sub: qs.length + ' preguntas · 1 minuto cada una', p: 'Pónganse de acuerdo y escriban su respuesta. Un punto por acierto.' }].concat(qs.map((b, i) => {
      if (b.tipo === 'vf') return { k: 'q', h: 'Pregunta ' + (i + 1), q: b.q, opts: ['Verdadero', 'Falso'], ok: b.v ? 0 : 1, a: b.exp || '' };
      const ord = b.op.map((o, j) => [o, j]); for (let k = ord.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [ord[k], ord[j]] = [ord[j], ord[k]]; }
      return { k: 'q', h: 'Pregunta ' + (i + 1), q: b.q, opts: ord.map(x => x[0]), ok: ord.findIndex(x => x[1] === 0), a: b.exp || '' };
    }));
    s.push({ k: 'list', h: '¿Quién ganó?', items: ['Sumen sus puntos', 'Repasemos la pregunta que más fallaron'] });
    if (E.modal) E.modal.close(); E.proj.abrir({ id: 'trivia', titulo: 'Trivia del tema' }, s);
  };

  /* ---------- botón «Dinámica rápida» en la clase ---------- */
  DN.SIT = [
    ['disperso', '😵 Dispersos', ['activar', 'calma'], { calma: 3, media: 2, alta: 1 }],
    ['aburrido', '🥱 Aburridos o con sueño', ['activar', 'reto'], { alta: 3, media: 2, calma: 0 }],
    ['inquieto', '⚡ Inquietos', ['activar', 'calma'], { calma: 3, media: 1, alta: 0 }],
    ['tenso', '😠 Tensos o en conflicto', ['calma', 'emociones'], { calma: 3, media: 1, alta: 0 }],
    ['repasar', '🧠 Repasar el tema', ['repasar'], { media: 2, alta: 2, calma: 1 }],
    ['reto', '🛠️ Reto mecatrónico', ['reto'], { media: 2, alta: 2, calma: 1 }],
    ['cerrar', '🏁 Cerrar la clase', ['cerrar'], { calma: 2, media: 1, alta: 0 }]
  ];
  DN.rapida = (g, sit, min, salto) => {
    const s = DN.SIT.find(x => x[0] === sit) || DN.SIT[0], hoy = u.today();
    const c = L.filter(d => d.min <= min && d.obj.some(o => s[2].indexOf(o) >= 0)).map(d => { const ul = g ? DN.ultima(g, d.id) : null, dias = ul ? u.diffDays(ul.f, hoy) : 999;
      return { d: d, s: (s[3][d.en] || 0) + (s[2].indexOf(d.obj[0]) >= 0 ? 2 : 0) + (dias > 14 ? 1 : dias < 3 ? -3 : 0) + (sit === 'tenso' && d.riesgo === 'bajo' ? 1 : 0) }; })
      .sort((a, b) => b.s - a.s || (a.d.id < b.d.id ? -1 : 1));
    if (!c.length) return [];
    const k = ((salto || 0) * 3) % c.length, out = []; for (let i = 0; i < Math.min(3, c.length); i++) out.push(c[(k + i) % c.length]); return out;
  };
  const st = () => (E.ui.dnr = E.ui.dnr || { sit: 'disperso', min: 5, salto: 0, f: u.today() });
  const pintaRapida = () => {
    const g = D.grupoActual(), o = st(), rec = DN.rapida(g, o.sit, o.min, o.salto);
    const seg = (k, opts, cur) => '<div class="cl-seg">' + opts.map(x => btn(x[1], 'dnr-o', 'data-k="' + k + '" data-v="' + x[0] + '"', 'small' + (String(cur) === String(x[0]) ? ' on' : ''))).join('') + '</div>';
    const conTrivia = o.sit === 'repasar' && g && DN.preguntas(DN.temasDia(g, o.f), 1).length;
    E.modal.open('🎲 Dinámica rápida', '<p class="small muted">¿Cómo está el grupo?</p>' + seg('sit', DN.SIT.map(x => [x[0], x[1]]), o.sit) +
      '<p class="small muted mt">¿Cuánto tiempo tienes?</p>' + seg('min', [[3, '3 min'], [5, '5'], [10, '10'], [20, '20'], [30, '30']], o.min) +
      (o.sit === 'repasar' ? '<div class="note info small mt">' + (conTrivia ? '🏆 Hay preguntas del banco para el tema de hoy. ' + btn('Proyectar trivia del tema', 'dn-trivia', 'data-f="' + o.f + '"', 'small primary') : 'El tema de hoy no tiene preguntas en el banco: usa tus propias preguntas.') + '</div>' : '') +
      (rec.length ? '<ul class="dn-list dnr-list mt">' + rec.map(x => { const d = x.d, imp = DN.IMP[d.imp || d.id];
        return '<li class="dn-it"><div class="dnr-it"><span class="dn-ico">' + d.ico + '</span><span class="dn-tx"><b>' + esc(d.t) + '</b><small>' + esc(d.para) + '</small><span class="dn-ch"><span class="chip">⏱ ' + d.min + ' min</span><span class="chip">' + esc(d.grupo) + '</span>' + (d.mat ? '<span class="chip">📦 material</span>' : '') + '</span></span></div>' +
          '<div class="row gap wrap">' + btn('📽 Proyectar', 'dn-proy', 'data-id="' + d.id + '"', 'small primary') + btn('⏱ Temporizador', 'dn-run', 'data-id="' + d.id + '"', 'small') + '<a class="btn small ghost" href="#/dinamica/' + d.id + '">Ver</a>' + (imp ? btn('🖨 ' + imp.t, 'dn-imp', 'data-id="' + d.id + '"', 'small ghost') : '') + '</div></li>'; }).join('') + '</ul>' +
        '<div class="row gap wrap mt">' + btn('🔄 Otras opciones', 'dnr-otra', '', 'ghost') + '<a class="btn ghost" href="#/dinamicas">Todas las dinámicas</a></div>'
        : '<p class="small muted mt">Nada cabe en ese tiempo. Sube el tiempo.</p>'));
  };
  A['dn-rapida'] = el => { const o = st(); o.f = el.dataset.f || u.today(); o.salto = 0; pintaRapida(); };
  A['dnr-o'] = el => { const o = st(); o[el.dataset.k] = el.dataset.k === 'min' ? Number(el.dataset.v) : el.dataset.v; o.salto = 0; pintaRapida(); };
  A['dnr-otra'] = () => { const o = st(); o.salto = (o.salto || 0) + 1; pintaRapida(); };
  DN.botonClase = f => btn('🎲 Dinámica rápida', 'dn-rapida', 'data-f="' + f + '"', 'dnr-btn');
})();
