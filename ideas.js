/* Escuadra · banco de ideas. Pensado para un plantel con computadoras + FreeCAD y materiales de bajo costo.
   sm: 'II-2' (mecanismos), 'II-3' (neumática/hidráulica), 'gen' (sirve para cualquier submódulo). */
window.E = window.E || {};
(function (E) {
  'use strict';
  E.IDEAS = [
    {
      id: 'primer-dia', titulo: 'Primer día: encuadre que sí se recuerda', sm: ['gen'], tipo: 'Docencia', dur: '60 min', costo: '$0',
      obj: 'Arrancar con reglas claras, criterios de evaluación y un reto que enganche desde el minuto uno.',
      mat: ['Hoja con criterios: Examen 50 · Libreta/Proyecto/Bitácora 40 · Asistencia 5 · Participación 5', 'Un mecanismo real: engrapadora, pinza de presión o tijeras'],
      pasos: ['Preséntate en 2 minutos contando qué haces en la industria: les da un "para qué" real.', 'Muestra el mecanismo y pregunta: ¿qué pieza se mueve primero y cuál al final? Escucha 3 respuestas sin corregir todavía.', 'Explica criterios y reglas del taller (cúter cerrado al caminar, nada de comida junto a las computadoras).', 'Forma equipos y asigna roles (líder, seguridad, materiales, bitácora).', 'Cierra con un boleto de salida: "¿Qué mecanismo usas todos los días sin darte cuenta?"'],
      evid: 'Boletos de salida y equipos registrados', tip: 'Pide que copien los criterios en la primera hoja de la libreta y la firmen: evita reclamos al cerrar el parcial.'
    },
    {
      id: 'fc-4barras-sketch', titulo: 'Simula un mecanismo de 4 barras en el Sketcher', sm: ['II-2'], tipo: 'FreeCAD', dur: '50 min', costo: '$0',
      obj: 'Ver el movimiento de un mecanismo antes de cortar una sola pieza, usando solo restricciones del Sketcher.',
      mat: ['Computadoras con FreeCAD'],
      pasos: ['Dibuja 4 líneas unidas por sus extremos (restricción de coincidencia).', 'Fija la línea de la base con restricciones de bloqueo.', 'Da longitud a cada eslabón (por ejemplo 40, 100, 80 y 90 mm).', 'Arrastra con el mouse el extremo de la manivela: el boceto se mueve como el mecanismo real.', 'Cambien una longitud y anoten si la manivela da la vuelta completa o se traba.'],
      evid: 'Captura de pantalla del boceto en dos posiciones + anotación en la bitácora', tip: 'Funciona en cualquier versión de FreeCAD: es el plan B si el plantel no tiene la 1.0 con el banco Assembly.'
    },
    {
      id: 'fc-ensamble-explosionada', titulo: 'Ensamble y vista explosionada en FreeCAD 1.x', sm: ['II-2'], tipo: 'FreeCAD', dur: '2 sesiones de 3 h', costo: '$0',
      obj: 'Cubrir la actividad clave "Representa el ensamble mecánico en vista explosionada" del programa (p. 36).',
      mat: ['FreeCAD 1.0 o superior (trae el banco de trabajo Assembly integrado)', 'Eslabones modelados en Part Design'],
      pasos: ['Modelen cada eslabón en Part Design: boceto, extrusión (Pad) y barrenos (Pocket).', 'Creen un ensamble nuevo, inserten las piezas y anclen la base (que no se mueva).', 'Unan los pivotes con uniones giratorias y prueben el movimiento arrastrando la manivela.', 'Si dos piezas chocan, corrijan longitudes: eso es "verificar por simulación y corregir colisiones".', 'Creen la vista explosionada y la lista de materiales, y llévenlas a una hoja de TechDraw con escala y cuadro de datos.'],
      evid: 'Plano PDF con vista explosionada y lista de partes (Lista de cotejo)', tip: 'Haz tú el ensamble completo una vez en vivo (práctica demostrativa) y deja un archivo base en cada computadora para la guiada.'
    },
    {
      id: 'fc-plantillas', titulo: 'Plantillas 1:1 impresas desde FreeCAD', sm: ['II-2'], tipo: 'FreeCAD', dur: '50 min', costo: 'Bajo',
      obj: 'Conectar el CAD con la fabricación: la pieza que se corta es la misma que se dibujó.',
      mat: ['Hoja de TechDraw a escala 1:1', 'Impresora del plantel o de papelería', 'Pegamento en barra'],
      pasos: ['Pongan todas las piezas en una hoja de TechDraw a escala 1:1 con los centros de barrenos marcados.', 'Exporten a PDF e impriman al 100 % ("tamaño real", nunca "ajustar a página").', 'Midan con regla una cota conocida para verificar la escala antes de pegar.', 'Peguen la plantilla sobre cartón o madera, acomodando para el mínimo desperdicio.', 'Perforen primero los barrenos y después corten el contorno.'],
      evid: 'Plantillas pegadas y piezas cortadas (Lista de cotejo "Modela piezas mecánicas")', tip: 'El acomodo para minimizar desperdicio te da evidencia del concepto "Economía ecológica" que marcaste en tu planeación.'
    },
    {
      id: 'grashof', titulo: 'Reto Grashof: predice antes de armar', sm: ['II-2'], tipo: 'Práctica', dur: '40 min', costo: '$0',
      obj: 'Usar pensamiento matemático para predecir si un mecanismo de 4 barras dará vueltas completas.',
      mat: ['Abatelenguas o tiras de cartón', 'Broches latonados (de papelería) o chinches', 'Regla'],
      pasos: ['Explica la regla: si el más corto + el más largo ≤ la suma de los otros dos, al menos un eslabón gira completo.', 'Cada equipo recibe 4 longitudes distintas y predice por escrito el tipo de movimiento.', 'Arman el mecanismo con broches y comprueban.', 'Comparten en plenaria quién acertó y por qué.'],
      evid: 'Predicción vs. resultado en la bitácora', tip: 'Las combinaciones que NO cumplen son las que más enseñan: incluye al menos una a propósito.'
    },
    {
      id: 'biela-compuerta', titulo: 'Biela-manivela: compuerta de riego', sm: ['II-2'], tipo: 'Práctica', dur: '3 h', costo: 'Bajo',
      obj: 'Convertir giro en movimiento lineal con un contexto del CETAC (aguas continentales y riego).',
      mat: ['Cartón grueso o madera balsa', 'Popote grueso como guía lineal', 'Tornillos M3 o broches latonados'],
      pasos: ['Pregunta: ¿cómo abrirían una compuerta de canal girando una manivela?', 'Diseñan manivela, biela y compuerta deslizante; la carrera de la compuerta es el doble del radio de la manivela.', 'Fabrican con plantillas y montan la guía con el popote.', 'Prueban y miden la carrera real contra la calculada.'],
      evid: 'Mecanismo funcionando + cálculo de carrera en la libreta', tip: 'Liga el proyecto al PAEC de riego si tu plantel lo pide como evidencia articuladora.'
    },
    {
      id: 'leva-alimentador', titulo: 'Leva y seguidor: alimentador de peces', sm: ['II-2'], tipo: 'Práctica', dur: '3 h', costo: 'Bajo',
      obj: 'Entender cómo una leva convierte giro en un movimiento programado, aplicado a acuacultura.',
      mat: ['Tapas de garrafón o cartón grueso', 'Palito de paleta como seguidor', 'Vasito de plástico como tolva'],
      pasos: ['Dibujen en FreeCAD (o a compás) una leva excéntrica y una de "corazón".', 'Monten la leva en un eje y el seguidor con una guía.', 'El seguidor empuja una compuerta pequeña que deja caer alimento.', 'Comparen cuánto "alimento" sale con cada tipo de leva.'],
      evid: 'Dosificador funcionando y perfil de la leva dibujado', tip: 'Deja que cada equipo proponga su propio perfil: la creatividad cuenta en las HVyT.'
    },
    {
      id: 'engranes-carton', titulo: 'Tren de engranes con relación de transmisión', sm: ['II-2'], tipo: 'FreeCAD', dur: '2 sesiones', costo: 'Bajo',
      obj: 'Calcular y comprobar la relación de transmisión i = Z2/Z1.',
      mat: ['FreeCAD (Part Design → Engrane de evolvente)', 'Cartón corrugado doble o MDF delgado', 'Clavos o tornillos como ejes'],
      pasos: ['Generen dos engranes con el mismo módulo y distinto número de dientes (por ejemplo 12 y 36).', 'Impriman a 1:1, peguen y corten.', 'Calculen cuántas vueltas da el pequeño por cada vuelta del grande.', 'Comprueben marcando un diente y contando vueltas.'],
      evid: 'Cálculo y comprobación en la bitácora', tip: 'Si los dientes del cartón se deforman, súbanle el módulo: dientes más grandes, menos fallas.'
    },
    {
      id: 'pantografo', titulo: 'Pantógrafo para ampliar dibujos', sm: ['II-2'], tipo: 'Práctica', dur: '2 h', costo: '$0',
      obj: 'Aplicar el paralelogramo articulado y repasar escalas de dibujo técnico.',
      mat: ['4 abatelenguas', 'Broches latonados', 'Lápiz y punta seca'],
      pasos: ['Armen el paralelogramo con barrenos a distancias iguales.', 'Fijen un punto, pongan la punta seca en el siguiente y el lápiz en el extremo.', 'Calquen una figura sencilla y midan: ¿salió a escala 2:1?', 'Relacionen con la escala de ampliación del examen diagnóstico.'],
      evid: 'Dibujo ampliado y medición de la escala', tip: 'Excelente para cerrar huecos del Submódulo 1 (escalas) sin dar una clase teórica.'
    },
    {
      id: 'ing-inversa', titulo: 'Ingeniería inversa de objetos cotidianos', sm: ['II-2'], tipo: 'Práctica', dur: '50 min', costo: '$0',
      obj: 'Identificar eslabones y pares cinemáticos en objetos reales (actividad "Clasifica los elementos…").',
      mat: ['Engrapadora, pinzas, tijeras, sacapuntas de manivela, juguetes viejos'],
      pasos: ['Cada equipo recibe un objeto.', 'Identifican base, eslabón motriz, conector y conducido.', 'Clasifican los pares: giratorio, prismático, leva o engrane.', 'Dibujan el diagrama cinemático en la libreta y lo presentan en 1 minuto.'],
      evid: 'Diagrama cinemático en la libreta', tip: 'Rota los objetos entre equipos y que critiquen el diagrama del otro (coevaluación).'
    },
    {
      id: 'pares-baratos', titulo: 'Kit de pares de enlace de $0', sm: ['II-2'], tipo: 'Práctica', dur: '30 min', costo: '$0',
      obj: 'Que todo el grupo pueda armar mecanismos aunque no compre tornillería.',
      mat: ['Broches latonados (mariposa)', 'Popotes como bujes', 'Palillos de brocheta como ejes', 'Tapas de garrafón como ruedas o poleas', 'Ligas como bandas'],
      pasos: ['Muestra cada material y qué par cinemático resuelve.', 'Prueben qué unión tiene menos juego: broche, palillo con popote o tornillo.', 'Elijan la mejor para su mecanismo y justifíquenlo en la bitácora.'],
      evid: 'Justificación del material en la bitácora', tip: 'Cubre el criterio "Determina el tipo de material" sin que nadie se quede atrás por presupuesto.'
    },
    {
      id: 'seguridad-cuter', titulo: '5 minutos de seguridad antes de cortar', sm: ['II-2', 'II-3'], tipo: 'Docencia', dur: '5 min', costo: '$0',
      obj: 'Prevenir accidentes y documentar la evidencia de "normas de seguridad e higiene".',
      mat: ['Regla metálica', 'Base de cartón para cortar'],
      pasos: ['Cada sesión de corte inicia con 3 reglas en voz alta: corte hacia afuera, regla metálica del lado de la mano, cúter cerrado al caminar.', 'El responsable de seguridad de cada equipo revisa que se cumplan.', 'Anota incidentes o "casi accidentes" en la bitácora del equipo.'],
      evid: 'Registro de seguridad en la bitácora (Guía de observación)', tip: 'Rotar el rol de responsable de seguridad hace que todos lo practiquen.'
    },
    {
      id: 'roles-equipo', titulo: 'Roles rotativos en cada equipo', sm: ['gen'], tipo: 'Docencia', dur: 'Todo el parcial', costo: '$0',
      obj: 'Que todos trabajen y no solo "el que sabe"; evidencia de colaboración y trabajo en equipo.',
      mat: ['Tarjetas con el nombre del rol'],
      pasos: ['Roles: líder (tiempos y metas), seguridad, materiales y bitacorista.', 'Rotan cada semana; el bitacorista anota quién tuvo qué rol.', 'En la coevaluación final cada quien califica cómo cumplió el otro su rol.'],
      evid: 'Registro de roles en la bitácora', tip: 'Usa "Equipos" en Herramientas para armar equipos al azar y evitar los grupitos de siempre.'
    },
    {
      id: 'bloque-3h', titulo: 'Cómo aprovechar un bloque de 3 horas (7:30–10:00)', sm: ['gen'], tipo: 'Docencia', dur: '3 h', costo: '$0',
      obj: 'Mantener la atención en tus bloques largos de martes, miércoles y viernes.',
      mat: ['Temporizador de la app'],
      pasos: ['0–15 min: pregunta-reto o repaso rápido con alumno al azar.', '15–40 min: demostración tuya (práctica demostrativa).', '40–120 min: práctica guiada o supervisada con el temporizador en metas de 25 minutos.', 'Pausa activa de 5 minutos a la mitad.', 'Últimos 15 min: limpieza, bitácora y boleto de salida.'],
      evid: 'Bitácora del día', tip: 'Muestra la meta de cada bloque de 25 minutos en el pizarrón: los avances se notan más.'
    },
    {
      id: 'boleto-salida', titulo: 'Boleto de salida en 3 minutos', sm: ['gen'], tipo: 'Evaluación', dur: '3 min', costo: '$0',
      obj: 'Saber qué entendieron sin calificar un examen.',
      mat: ['Cuartos de hoja'],
      pasos: ['Tres renglones: algo que aprendí, una duda y dónde lo usaría.', 'Recógelos en la puerta.', 'Al día siguiente empieza resolviendo las 2 dudas más repetidas.'],
      evid: 'Boletos (evaluación formativa)', tip: 'Las dudas repetidas son oro para la plenaria y para ajustar tu planeación.'
    },
    {
      id: 'semaforo', titulo: 'Semáforo de avance por equipo', sm: ['gen'], tipo: 'Docencia', dur: 'Permanente', costo: '$0',
      obj: 'Atender primero a quien está atorado sin que el grupo se detenga.',
      mat: ['Tres tarjetas por equipo: verde, amarilla y roja'],
      pasos: ['Verde: vamos bien. Amarilla: tenemos una duda pero seguimos. Roja: estamos detenidos.', 'Atiendes siempre primero las rojas.', 'Si un equipo está en verde mucho tiempo, dale un reto extra.'],
      evid: 'No aplica (gestión de grupo)', tip: 'Reduce mucho las filas de alumnos en tu escritorio.'
    },
    {
      id: 'galeria-errores', titulo: 'Galería de errores', sm: ['gen'], tipo: 'Evaluación', dur: '20 min', costo: '$0',
      obj: 'Normalizar el error y aprender a diagnosticar (mentalidad de crecimiento).',
      mat: ['Fotos de fallas reales: piezas que chocan, barrenos desalineados, fugas'],
      pasos: ['Proyecta o muestra fallas sin nombres.', 'En parejas diagnostican la causa y proponen solución.', 'Comparan con lo que realmente pasó.'],
      evid: 'Bitácora de fallas y soluciones', tip: 'Toma fotos de las fallas durante el parcial: tú mismo armas la galería para el cierre.'
    },
    {
      id: 'mini-retos', titulo: 'Mini-retos cronometrados de FreeCAD', sm: ['II-2'], tipo: 'FreeCAD', dur: '15 min', costo: '$0',
      obj: 'Practicar comandos con presión sana y medir avance real.',
      mat: ['Temporizador de la app', 'Computadoras con FreeCAD'],
      pasos: ['Ejemplo: "en 15 minutos modela un eslabón de 80 mm entre centros, con 2 barrenos de Ø6 y extremos redondeados".', 'El boceto debe quedar completamente restringido.', 'Revisas 3 al azar y resuelves en el proyector el que tuvo más fallas.'],
      evid: 'Archivo del reto (Lista de cotejo rápida)', tip: 'Sube la dificultad cada semana y guarda los mejores como ejemplo.'
    },
    {
      id: 'industria-real', titulo: 'Trae la industria al salón', sm: ['gen'], tipo: 'Docencia', dur: '20 min', costo: '$0',
      obj: 'Conectar lo que hacen con equipos reales del Bajío.',
      mat: ['Componentes industriales de muestra: botoneras, contactores, sensores, cilindros, fichas técnicas'],
      pasos: ['Lleva una pieza real por semana y pásala por los equipos.', 'Pregunta: ¿qué mecanismo o sistema tiene dentro? ¿dónde la han visto?', 'Muestra su ficha técnica y lean juntos un dato (presión máxima, voltaje, carrera).'],
      evid: 'Participación', tip: 'Aprovecha tu trabajo en automatización industrial: es tu mejor recurso didáctico.'
    },
    {
      id: 'coevaluacion', titulo: 'Coevaluación con lista de cotejo', sm: ['gen'], tipo: 'Evaluación', dur: '20 min', costo: 'Impresión',
      obj: 'Que los alumnos evalúen con criterios claros (la planeación pide coevaluación).',
      mat: ['Lista de cotejo impresa desde Escuadra → Imprimir'],
      pasos: ['Cada equipo evalúa el producto de otro equipo con la lista.', 'Anotan una fortaleza y una mejora.', 'Tú validas y resuelves desacuerdos.'],
      evid: 'Listas de cotejo llenadas', tip: 'Imprime la versión "por equipos" para usar una sola hoja por grupo.'
    },
    {
      id: 'pascal-jeringas', titulo: 'Principio de Pascal con jeringas de 10 y 20 ml', sm: ['II-3'], tipo: 'Práctica', dur: '50 min', costo: 'Bajo',
      obj: 'Comprobar que la fuerza se multiplica según el área: F2 = F1 · (A2/A1).',
      mat: ['Jeringas de 10 y 20 ml sin aguja', 'Manguera de acuario', 'Agua con colorante', 'Bolsitas de arena como pesas'],
      pasos: ['Midan el diámetro interior de cada jeringa y calculen su área.', 'Conecten ambas con agua sin burbujas.', 'Pongan peso en la jeringa grande y empujen la chica: ¿cuánto cuesta levantarlo?', 'Comparen con el cálculo y expliquen la diferencia (fricción, aire).'],
      evid: 'Cálculo y medición en la libreta', tip: 'Es la apertura perfecta del Submódulo 3 y conecta con la grúa del proyecto.'
    },
    {
      id: 'aire-vs-agua', titulo: 'Jeringa de aire vs. agua: neumática sin compresor', sm: ['II-3'], tipo: 'Práctica', dur: '30 min', costo: 'Bajo',
      obj: 'Cubrir la parte neumática del programa: el aire se comprime, el agua no.',
      mat: ['Pares de jeringas con manguera: uno con aire y otro con agua'],
      pasos: ['Empujen el sistema con aire y luego el de agua.', 'Anoten la diferencia: el de aire "rebota" y responde tarde.', 'Discutan: ¿por qué las grúas usan aceite y las pinzas de una línea de ensamble usan aire?', 'Relacionen con presión (bar, psi) y caudal.'],
      evid: 'Conclusión escrita en la bitácora', tip: 'Así tu proyecto de grúa cubre neumática y no solo hidráulica, como pide el programa.'
    },
    {
      id: 'memorama-iso', titulo: 'Memorama de simbología ISO 1219', sm: ['II-3'], tipo: 'Dinámica', dur: '25 min', costo: 'Impresión',
      obj: 'Aprender los símbolos de neumática e hidráulica jugando.',
      mat: ['Tarjetas impresas: símbolo en una y nombre en otra (cilindro de simple y doble efecto, válvula 3/2 y 5/2, compresor, bomba, unidad de mantenimiento, regulador de caudal)'],
      pasos: ['En equipos de 4 juegan memorama.', 'Quien hace un par explica para qué sirve el componente.', 'Cierra con un diagrama sencillo que deban leer en voz alta.'],
      evid: 'Lectura correcta del diagrama (Guía de observación)', tip: 'Cubre la actividad clave "Interpreta planos…" (p. 40 del programa).'
    },
    {
      id: 'escalera-papel', titulo: 'Diagrama de escalera en papel antes de cablear', sm: ['II-3'], tipo: 'Práctica', dur: '40 min', costo: '$0',
      obj: 'Cumplir "Prepara componentes eléctricos de acuerdo con el diagrama de escalera" antes de tocar un cable.',
      mat: ['Libreta', 'Motor DC, portapilas e interruptor'],
      pasos: ['Dibuja en el pizarrón un diagrama de escalera: interruptor normalmente abierto en serie con el motor.', 'Cada equipo lo copia y marca con color por dónde pasa la corriente.', 'Solo cuando revises el diagrama les entregas el material.'],
      evid: 'Diagrama revisado y firmado por ti', tip: 'El "no hay material sin diagrama aprobado" baja muchísimo los cortos.'
    },
    {
      id: 'inversion-giro', titulo: 'Inversión de giro con interruptor de doble polo', sm: ['II-3'], tipo: 'Práctica', dur: '50 min', costo: 'Bajo',
      obj: 'Que la grúa suba y baje la carga con un solo motor.',
      mat: ['Interruptor de doble polo doble tiro (DPDT)', 'Motor DC, pilas y cable'],
      pasos: ['Explica cómo el interruptor cruza la polaridad del motor.', 'Dibujan el circuito y lo arman en la mesa.', 'Prueban subir y bajar con la polea de hilo.', 'Agregan el circuito a la grúa.'],
      evid: 'Circuito funcionando (Lista de cotejo)', tip: 'Es la versión de taller de lo que hace un arrancador con inversión de giro en la industria.'
    },
    {
      id: 'caudal-cronometro', titulo: 'Caudal con jeringa y cronómetro', sm: ['II-3'], tipo: 'Práctica', dur: '30 min', costo: '$0',
      obj: 'Calcular caudal (Q = V/t) y convertir unidades.',
      mat: ['Jeringa graduada', 'Temporizador de la app o del celular'],
      pasos: ['Vacían 20 ml a través de la manguera y toman el tiempo.', 'Calculan Q en ml/s y lo convierten a l/min.', 'Repiten con una manguera más delgada y comparan.'],
      evid: 'Cálculos en la libreta', tip: 'Cubre "haciendo el cálculo de fuerza y caudal" de la actividad clave "Diseña elementos…".'
    },
    {
      id: 'bitacora-fallas', titulo: 'Bitácora técnica de fallas', sm: ['II-2', 'II-3'], tipo: 'Evaluación', dur: '10 min por sesión', costo: '$0',
      obj: 'Convertir cada falla en evidencia del 40 % de Libreta/Proyecto/Bitácora.',
      mat: ['Libreta'],
      pasos: ['Tabla fija por sesión: fecha · objetivo · qué hice · falla · causa · solución · foto o esquema.', 'Revisas 5 bitácoras al azar por semana y las sellas.', 'Al cierre del parcial, la bitácora completa se califica con rúbrica.'],
      evid: 'Bitácora (Rúbrica)', tip: 'Revisar 5 al azar por semana es mucho más llevadero que 22 el último día.'
    },
    {
      id: 'pregunta-reto', titulo: 'Pregunta-reto para abrir la clase', sm: ['gen'], tipo: 'Dinámica', dur: '5 min', costo: '$0',
      obj: 'Despertar curiosidad antes de explicar.',
      mat: ['Un objeto o un video corto de un mecanismo en movimiento'],
      pasos: ['Muestra el mecanismo sin explicar nada.', 'Pregunta: "¿cómo creen que funciona?" y da 1 minuto para pensar en parejas.', 'Elige respuestas con "Alumno al azar" y suma participación.', 'Retoma la pregunta al final de la clase.'],
      evid: 'Participación', tip: 'Junta 3 o 4 objetos de cocina o taller y rótalos durante el parcial.'
    },

    /* ======== AULA CON PROYECTOR (v1.1) ======== */
    {
      id: 'pr-modo-proyector', titulo: 'Teoría en 15 minutos con el modo Proyector', sm: ['gen'], tipo: 'Proyector', dur: '15 min', costo: '$0',
      obj: 'Dar la teoría corta y clara, y dedicar el resto de la sesión a la práctica.',
      mat: ['Laptop con Escuadra conectada al proyector'],
      pasos: ['Abre Escuadra → Temas y elige el tema del día.', 'Toca "Proyectar": la pantalla muestra lo esencial con letra grande.', 'Avanza con las flechas o tocando la pantalla; en las preguntas, toca para revelar la respuesta.', 'Cierra con la diapositiva "¿Para qué me sirve?" y pasa directo a la práctica.'],
      evid: 'Participación en las preguntas proyectadas', tip: 'Usa "Alumno al azar" para que contesten las preguntas proyectadas: todos ponen atención porque cualquiera puede salir.'
    },
    {
      id: 'pr-camara-doc', titulo: 'Tu celular como cámara de documentos', sm: ['gen'], tipo: 'Proyector', dur: 'Permanente', costo: '$0',
      obj: 'Que todos vean en grande lo pequeño: un barreno, un empalme, una conexión de manguera.',
      mat: ['Celular', 'Cable USB-C a HDMI o duplicación inalámbrica de pantalla (en Samsung: Smart View, si el proyector o la pantalla la admite)', 'Un soporte o un vaso para sostener el celular'],
      pasos: ['Pon el celular en modo cámara apuntando a tu mesa.', 'Duplica la pantalla al proyector.', 'Haz la demostración en vivo: todos ven tus manos en grande.', 'Pasa a un alumno a explicar su pieza con la cámara.'],
      evid: 'Práctica demostrativa (programa: demostrativa → guiada → supervisada → autónoma)', tip: 'Es la forma más barata de tener una "cámara de documentos" como las de las universidades.'
    },
    {
      id: 'pr-camara-lenta', titulo: 'Cámara lenta para analizar mecanismos', sm: ['II-2', 'II-3'], tipo: 'Proyector', dur: '20 min', costo: '$0',
      obj: 'Ver lo que el ojo no alcanza: dónde choca un eslabón o cuándo se detiene un seguidor.',
      mat: ['Celular con video en cámara lenta', 'Proyector'],
      pasos: ['Graba en cámara lenta el mecanismo de un equipo funcionando.', 'Proyéctalo y pausa cuadro por cuadro en el momento crítico.', 'Pregunta: ¿qué eslabón está en su punto muerto? ¿dónde se pierde fuerza?', 'El equipo propone la corrección y la registra en la bitácora.'],
      evid: 'Bitácora de fallas y ajustes', tip: 'Graba también los mecanismos que SÍ funcionan: verlos en grande motiva muchísimo.'
    },
    {
      id: 'pr-freecad-espejo', titulo: '"Yo modelo, tú modelas" en FreeCAD', sm: ['II-1', 'II-2'], tipo: 'Proyector', dur: '50 min', costo: '$0',
      obj: 'Práctica guiada de FreeCAD donde nadie se queda atrás.',
      mat: ['Laptop con FreeCAD al proyector', 'Computadoras del plantel'],
      pasos: ['Proyecta FreeCAD con la letra y los íconos grandes.', 'Haz un paso, di "manos arriba" cuando termines y espera a que todos lo repliquen.', 'Cada 3 pasos, un alumno al azar explica qué hiciste y por qué.', 'Al final, cambia una cota y muestra cómo se actualiza todo (paramétrico).'],
      evid: 'Archivo del modelo (Lista de cotejo)', tip: 'Antes de clase, guarda el archivo terminado: si alguien se pierde, lo abre y se reincorpora.'
    },
    {
      id: 'pr-pausa-predice', titulo: 'Pausa y predice', sm: ['II-2', 'II-3'], tipo: 'Proyector', dur: '15 min', costo: '$0',
      obj: 'Entrenar el razonamiento mecánico antes de la explicación.',
      mat: ['Video corto de una máquina o mecanismo (búscalo con "animación mecanismo …" o "cilindro neumático animación")'],
      pasos: ['Reproduce el video hasta justo antes del momento clave y páusalo.', 'Pregunta: ¿qué va a pasar ahora? ¿hacia dónde se mueve? En parejas, 1 minuto.', 'Recoge 3 predicciones con "Alumno al azar".', 'Reproduce y comenten quién acertó y por qué.'],
      evid: 'Participación', tip: 'Las predicciones equivocadas son las mejores para enseñar: no las corrijas antes de ver el video.'
    },
    {
      id: 'pr-maquina-misteriosa', titulo: 'La máquina misteriosa', sm: ['II-2', 'II-3'], tipo: 'Proyector', dur: '20 min', costo: '$0',
      obj: 'Identificar mecanismos y tecnologías (neumática, hidráulica, eléctrica) en máquinas industriales reales.',
      mat: ['Video sin audio de una máquina industrial: empacadora, prensa, robot de paletizado, línea de embotellado'],
      pasos: ['Proyecta el video sin decir qué máquina es.', 'En equipos llenan una tabla: mecanismos que ven, ¿neumático, hidráulico o eléctrico?, ¿qué sensores habría?', 'Cada equipo defiende una respuesta.', 'Revela qué máquina es y para qué industria trabaja.'],
      evid: 'Tabla de análisis por equipo', tip: 'Usa máquinas de industrias del Bajío (automotriz, alimentos, plásticos): les muestra dónde podrían trabajar.'
    },
    {
      id: 'pr-phet-presion', titulo: 'Simulación PhET "Bajo presión"', sm: ['II-3'], tipo: 'Proyector', dur: '25 min', costo: '$0',
      obj: 'Visualizar cómo cambia la presión de un líquido con la profundidad, la densidad y la gravedad.',
      mat: ['Simulación gratuita PhET (Universidad de Colorado), funciona en el navegador'], link: 'https://phet.colorado.edu/es/simulations/under-pressure',
      pasos: ['Proyecta la simulación y coloca el manómetro a distintas profundidades.', 'Pregunta antes de mover: si bajo el doble, ¿qué pasa con la presión?', 'Cambia el fluido (más denso) y la gravedad; anoten resultados.', 'Conecta con Pascal: si empujo el líquido, ¿a dónde se va la presión?'],
      evid: 'Tabla de lecturas en la libreta', tip: 'Muéstrales que la presión se lee en kPa y pídeles convertir a bar y psi: repasa unidades sin que lo noten.'
    },
    {
      id: 'pr-phet-circuitos', titulo: 'Simula el circuito antes de cablear (PhET)', sm: ['II-3'], tipo: 'Proyector', dur: '30 min', costo: '$0',
      obj: 'Armar el circuito de la grúa de forma virtual y entender por qué un corto es peligroso.',
      mat: ['Simulación gratuita PhET "Kit de construcción de circuitos: CD"'], link: 'https://phet.colorado.edu/es/simulations/circuit-construction-kit-dc',
      pasos: ['Arma en vivo pila + interruptor + foco (el foco hace de motor).', 'Mide voltaje y corriente con los instrumentos de la simulación.', 'Provoca un corto a propósito y comenten lo que muestra la simulación.', 'Después cada equipo dibuja su circuito real en la libreta.'],
      evid: 'Diagrama aprobado antes de recibir material', tip: 'Ver el corto en pantalla convence más que cualquier advertencia verbal.'
    },
    {
      id: 'pr-linkage-sim', titulo: 'Simulador de mecanismos en el navegador (PMKS+)', sm: ['II-2'], tipo: 'Proyector', dur: '30 min', costo: '$0',
      obj: 'Comprobar la ley de Grashof y ver trayectorias de cuatro barras y biela-manivela en vivo.',
      mat: ['PMKS+: simulador gratuito de mecanismos planos (Worcester Polytechnic Institute), sin cuenta'], link: 'https://pmksplus.com',
      pasos: ['Proyecta y arma un cuatro barras con las medidas del reto Grashof.', 'Pide predicciones antes de animarlo.', 'Anima y cambia una longitud: ¿sigue dando la vuelta completa?', 'Muestra la trayectoria del acoplador: así se diseñan movimientos especiales.'],
      evid: 'Predicción vs. resultado en la bitácora', tip: 'Haz primero el mecanismo en cartón y luego en el simulador: comparan lo real con lo ideal.'
    },
    {
      id: 'pr-plickers', titulo: 'Votación con tarjetas (Plickers)', sm: ['gen'], tipo: 'Proyector', dur: '10 min', costo: '$0',
      obj: 'Saber en segundos quién entendió, sin que los alumnos usen celular.',
      mat: ['Cuenta gratuita en plickers.com', 'Tarjetas impresas (una por alumno)', 'App de Plickers en tu celular'], link: 'https://www.plickers.com',
      pasos: ['Crea 4 o 5 preguntas de opción múltiple del tema.', 'Proyecta la pregunta; cada alumno levanta su tarjeta girada según su respuesta.', 'Escanea el salón con tu celular y proyecta los resultados.', 'Si menos del 70 % acierta, re-explica antes de seguir.'],
      evid: 'Reporte de respuestas por alumno', tip: 'Asigna la tarjeta según el número de lista de Escuadra: así coinciden tus registros.'
    },
    {
      id: 'pr-quien-quiere', titulo: '"¿Quién quiere ser técnico?" (repaso)', sm: ['gen'], tipo: 'Proyector', dur: '30 min', costo: '$0',
      obj: 'Repasar antes del examen con emoción y sin presión.',
      mat: ['Preguntas de los Temas de Escuadra en diapositivas', 'Temporizador de Escuadra'],
      pasos: ['Prepara 10 preguntas de dificultad creciente.', 'Dos equipos compiten; cada pregunta con 30 segundos en el temporizador.', 'Comodines: "pregúntale al equipo", "50/50" y "llamada al profe" (una sola vez).', 'Al final, repasa las preguntas que más fallaron.'],
      evid: 'Participación', tip: 'Haz que los equipos escriban dos preguntas cada uno para el juego: preparar preguntas es la mejor forma de estudiar.'
    },
    {
      id: 'pr-escape-iso', titulo: 'Escape room de simbología ISO 1219', sm: ['II-3'], tipo: 'Proyector', dur: '40 min', costo: 'Impresión',
      obj: 'Leer diagramas neumáticos con un reto que engancha.',
      mat: ['4 diagramas proyectados, uno por "candado"', 'Sobres con la siguiente pista'],
      pasos: ['Cada candado es una pregunta sobre el diagrama proyectado: ¿qué válvula es? ¿qué vía es el escape? ¿en qué posición está el cilindro?', 'La respuesta da un número; con el código abren (piden) el siguiente sobre.', 'Gana el equipo que "escapa" primero con todo correcto.', 'Cierra explicando el diagrama más difícil.'],
      evid: 'Respuestas del equipo (Guía de observación)', tip: 'Cubre la actividad clave "Interpreta planos…" sin que parezca examen.'
    },
    {
      id: 'pr-muro-logros', titulo: 'Muro de logros del viernes', sm: ['gen'], tipo: 'Proyector', dur: '10 min', costo: '$0',
      obj: 'Celebrar avances y construir orgullo de grupo (HVyT: logro de metas).',
      mat: ['Fotos que tomas durante la semana de piezas, mecanismos y equipos trabajando'],
      pasos: ['El viernes proyecta una presentación rápida con las fotos de la semana.', 'Cada equipo comenta en 30 segundos qué logró y qué sigue.', 'Reconoce el esfuerzo y la estrategia, no solo el resultado.'],
      evid: 'No aplica (clima de aula)', tip: 'Antes de proyectar fotos donde salgan alumnos, confirma con la escuela su política de imagen de menores; puedes mostrar solo manos y piezas.'
    },
    {
      id: 'pr-videollamada', titulo: 'Un profesional de la industria en el aula', sm: ['gen'], tipo: 'Proyector', dur: '20 min', costo: '$0',
      obj: 'Que escuchen de primera mano cómo es el trabajo de un técnico o ingeniero.',
      mat: ['Videollamada proyectada con bocinas', 'Preguntas preparadas por los alumnos'],
      pasos: ['Invita a alguien de tu red: técnico de mantenimiento, integrador, egresado del CETAC.', 'Los alumnos preparan 5 preguntas: ¿qué hace un día normal?, ¿qué estudió?, ¿qué le hubiera gustado saber a su edad?', 'La plática dura 15 minutos y 5 de preguntas.', 'Al día siguiente, cada alumno escribe una idea que lo inspiró.'],
      evid: 'Reflexión escrita', tip: 'Tu experiencia en automatización industrial te da una red de contactos que pocos docentes tienen: úsala.'
    },
    {
      id: 'pr-carreras', titulo: '"¿Dónde voy a trabajar?" Mapa del Bajío industrial', sm: ['gen'], tipo: 'Proyector', dur: '30 min', costo: '$0',
      obj: 'Conectar la carrera con oportunidades reales cerca de casa.',
      mat: ['Mapa proyectado del corredor industrial del Bajío', 'Lista de ocupaciones del programa (SINCO): técnicos y mecánicos en mantenimiento, ensambladores de maquinaria, técnicos en equipos electromecánicos'],
      pasos: ['Proyecta el mapa y marquen juntos parques industriales y tipos de industria de la región.', 'Relaciona cada industria con un submódulo: ¿dónde se usan mecanismos?, ¿dónde neumática?', 'Cada alumno elige un lugar donde le gustaría trabajar y por qué.', 'Cierra con los tres caminos: trabajar, seguir estudiando o emprender.'],
      evid: 'Reflexión en la libreta', tip: 'Combínalo con "Mi yo de 25 años" para cerrar el parcial con visión de futuro.'
    },
    {
      id: 'pr-yo-25', titulo: 'Mi yo de 25 años (proyecto de vida)', sm: ['gen'], tipo: 'Proyector', dur: '30 min', costo: '$0',
      obj: 'Que se pongan metas concretas (HVyT: logro de metas, autoconocimiento).',
      mat: ['Preguntas guía proyectadas', 'Hoja para una carta'],
      pasos: ['Proyecta: ¿dónde vives?, ¿en qué trabajas?, ¿qué sabes hacer que hoy no sabes?, ¿qué hiciste a los 16 para llegar ahí?', 'Escriben una carta de su yo de 25 años a su yo de hoy.', 'Cada quien define una meta para este parcial y la escribe en la libreta.', 'Guarda las cartas (cerradas) y regrésalas al final del semestre.'],
      evid: 'Meta del parcial en la libreta', tip: 'Las cartas son personales: no se califican ni se leen en voz alta, a menos que alguien quiera compartir.'
    },
    {
      id: 'pr-respira', titulo: 'Un minuto para respirar antes del examen', sm: ['gen'], tipo: 'Proyector', dur: '2 min', costo: '$0',
      obj: 'Bajar la ansiedad antes de evaluar (HVyT: regulación de emociones).',
      mat: ['Temporizador de Escuadra en pantalla completa'],
      pasos: ['Pon el temporizador en 1 minuto en el proyector.', 'Guía: inhalan contando 4, sostienen 4, exhalan contando 4, sostienen 4.', 'Al terminar: "Ya estudiaron; ahora solo demuestren lo que saben".'],
      evid: 'No aplica', tip: 'Si lo haces siempre igual, se vuelve un ritual que les da seguridad.'
    },
    {
      id: 'pr-explica-60', titulo: 'Explícalo en 60 segundos', sm: ['gen'], tipo: 'Proyector', dur: '20 min', costo: '$0',
      obj: 'Practicar comunicación técnica clara (HVyT: comunicación).',
      mat: ['Foto o video del mecanismo de cada equipo', 'Temporizador de Escuadra'],
      pasos: ['Proyecta la foto del mecanismo de un equipo.', 'Un integrante al azar lo explica en 60 segundos: qué entra, qué sale y qué mecanismo lo transforma.', 'El grupo da una fortaleza y una sugerencia.'],
      evid: 'Guía de observación de la exposición', tip: 'Ensaya la "defensa del proyecto" del cierre de parcial sin que se sienta como examen.'
    },
    {
      id: 'pr-error-del-dia', titulo: 'El error del día', sm: ['II-1', 'II-3'], tipo: 'Proyector', dur: '10 min', costo: '$0',
      obj: 'Entrenar el ojo crítico para planos y diagramas.',
      mat: ['Un plano o diagrama con 3 errores intencionales (cota cruzada, línea equivocada, válvula mal conectada)'],
      pasos: ['Proyecta el plano o diagrama al iniciar la clase.', 'En parejas, 3 minutos para encontrar los 3 errores.', 'Revelen y expliquen cómo se corrige cada uno.'],
      evid: 'Participación', tip: 'Usa los errores reales que veas en sus libretas (sin nombres): aprenden de lo que realmente les pasa.'
    },
    {
      id: 'pr-catalogo-real', titulo: 'Lee un catálogo industrial de verdad', sm: ['II-3'], tipo: 'Proyector', dur: '30 min', costo: '$0',
      obj: 'Extraer datos de una ficha técnica real y usarlos para calcular.',
      mat: ['Ficha técnica en PDF de un cilindro neumático o un motorreductor de un fabricante conocido'],
      pasos: ['Proyecta la ficha y busquen juntos: diámetro del émbolo, del vástago, carrera y presión máxima.', 'Calculen la fuerza de avance y retroceso a 6 bar.', 'Comparen con lo que dice el catálogo.', 'Discutan: ¿este cilindro sirve para levantar 30 kg?'],
      evid: 'Cálculo en la libreta', tip: 'Leer catálogos es exactamente lo que hacen los técnicos y vendedores técnicos en la industria.'
    },
    {
      id: 'pr-mapa-mental', titulo: 'Mapa mental colectivo al cerrar el tema', sm: ['gen'], tipo: 'Proyector', dur: '15 min', costo: '$0',
      obj: 'Consolidar lo aprendido conectando conceptos.',
      mat: ['Diapositiva o pizarra digital en blanco proyectada'],
      pasos: ['Escribe el tema al centro.', 'Con "Alumno al azar", cada quien agrega un concepto y lo conecta con otro.', 'Toma foto del resultado y súbela a la bitácora del día en Escuadra.'],
      evid: 'Foto del mapa en la bitácora', tip: 'Al final del parcial, proyecta todos los mapas juntos: ven cuánto avanzaron.'
    },
    {
      id: 'pr-historia', titulo: '5 minutos de historia: máquinas que cambiaron el mundo', sm: ['gen'], tipo: 'Proyector', dur: '5 min', costo: '$0',
      obj: 'Dar contexto humano y curiosidad a los temas técnicos.',
      mat: ['Una imagen proyectada por sesión'],
      pasos: ['Ejemplos: el mecanismo de paralelogramo de James Watt para su máquina de vapor (1784); el telar de Jacquard con tarjetas perforadas (1804), antecesor de la programación; el origen de la palabra mecatrónica (Yaskawa, 1969).', 'Pregunta: ¿qué problema resolvía? ¿qué mecanismo usa?', 'Conecta con el tema del día.'],
      evid: 'Participación', tip: 'Pide que cada equipo traiga una "máquina que cambió el mundo" para exponer en 2 minutos.'
    },
    {
      id: 'pr-diagnostico-visible', titulo: 'Resultados del diagnóstico en pantalla (sin nombres)', sm: ['II-1'], tipo: 'Proyector', dur: '15 min', costo: '$0',
      obj: 'Decidir juntos qué repasar del Submódulo 1 que no les tocó contigo.',
      mat: ['Porcentaje de aciertos por pregunta del examen diagnóstico'],
      pasos: ['Proyecta una gráfica de aciertos por pregunta, sin nombres.', 'Pregunta: ¿qué tema necesitamos reforzar como grupo?', 'Agenda micro-repasos (Temas de nivelación) al inicio de las próximas sesiones.'],
      evid: 'No aplica', tip: 'Ver que el problema es de todos (no de uno) baja la vergüenza y sube la disposición a repasar.'
    },
    {
      id: 'pr-antes-despues', titulo: 'Antes y después: del CAD a la pieza real', sm: ['II-2'], tipo: 'Proyector', dur: '15 min', costo: '$0',
      obj: 'Comparar lo diseñado con lo fabricado y hablar de tolerancias.',
      mat: ['Captura del modelo en FreeCAD y foto de la pieza cortada'],
      pasos: ['Proyecta lado a lado el modelo y la pieza real.', 'Midan la pieza real y comparen con el plano.', '¿Cuánto se desvió? ¿Por qué? (corte, plantilla mal impresa, material).', 'Introduce la idea de tolerancia: cuánto error es aceptable.'],
      evid: 'Tabla de medidas en la bitácora', tip: 'Cierra con la pregunta: ¿cómo lo harían en una fábrica para que todas salgan iguales?'
    }
  ];
})(window.E);
