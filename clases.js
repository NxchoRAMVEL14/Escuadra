/* Escuadra · Clases: qué dar en cada clase. Secuencia hora por hora de cada submódulo, alineada con tu
   planeación (apertura, desarrollo y cierre) y con las actividades clave del programa SEP 2024.
   La app la acomoda sola en los bloques de tu horario; si una clase no se da, todo se recorre. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, H = E.h;
  const card = H.card, btn = H.btn, link = H.link, icon = E.icon;

  /* m: a = apertura, d = desarrollo, c = cierre · ac/dc: actividad clave y renglón de "desarrollo de la competencia"
     del programa · pasos: [minutos, qué hacer] (1 h de horario = 50 min) · pre: palabras para adelantar el tema */
  E.CLASES = {
    'II-2': [
      { h: 3, m: 'a', tipo: 'Encuadre', t: 'Encuadre del parcial y examen diagnóstico', obj: 'Que conozcan cómo se les evalúa, las reglas del taller y el proyecto, y que muestren qué traen del Submódulo 1.', ac: null,
        pasos: [[20, 'Encuadre: Examen 50 · Libreta/Proyecto/Bitácora 40 · Asistencia 5 · Participación 5.'], [15, 'Reglamento de taller y roles de equipo.'], [10, 'Presenta el proyecto: garra o brazo articulado de cartón que levante un objeto ligero.'], [90, 'Examen diagnóstico de dibujo técnico y FreeCAD (Submódulo 1).'], [15, 'Dinámica: pasiones, frustraciones y visión.']],
        ev: 'Examen diagnóstico resuelto (Desempeño)', ideas: ['primer-dia', 'roles-equipo'], pre: 'evaluación · proyecto · roles' },
      { h: 1, m: 'a', tipo: 'Teoría', t: 'Los mecanismos que traes en la mochila', obj: 'Distinguir máquina de mecanismo y nombrar eslabones y pares en objetos reales.', ac: 1, dc: 0, tema: 'sm2-mecanismo',
        pasos: [[5, 'Reto: desarmar y armar su pluma de clic en 2 minutos.'], [10, 'Máquina, mecanismo, eslabones y pares (proyecta el tema).'], [15, 'Cacería en parejas: tabla en la libreta con 2 objetos de la mochila.'], [12, 'Al azar: 4 o 5 explican su objeto en 60 segundos.'], [8, 'Boleto de salida y tarea.']],
        tarea: 'Mecanismos en mi casa: 3 objetos (par giratorio, prismático y helicoidal) con dibujo esquemático. Reto: algo que convierta un giro en un ir y venir.', ideas: ['ing-inversa', 'pr-explica-60', 'boleto-salida'], pre: 'eslabón · par giratorio · par prismático' },
      { h: 3, m: 'a', tipo: 'Teoría', t: 'Tipos de movimiento: del giro al vaivén', obj: 'Elegir el mecanismo según el movimiento que entra y el que se necesita.', ac: 1, dc: 0, tema: 'sm2-movimientos',
        pasos: [[15, 'Revisa la tarea: ¿quién encontró algo que gire y vaya y venga? (ventilador, máquina de coser, limpiaparabrisas).'], [25, 'Tema en proyector: giratorio, lineal, alternativo y oscilante.'], [20, 'La máquina misteriosa: video sin audio, ¿qué mecanismo hay adentro?'], [50, 'Lluvia de ideas por equipos con objetos reales: clasifican 10 mecanismos por movimiento de entrada y de salida en un cartel.'], [25, 'Galería: cada equipo explica 2 de sus mecanismos.'], [15, 'Mapa mental colectivo.']],
        ev: 'Cartel de clasificación de mecanismos (Producto)', ideas: ['pr-maquina-misteriosa', 'pr-camara-lenta', 'pr-mapa-mental'], pre: 'manivela · biela · balancín' },
      { h: 2, m: 'd', tipo: 'FreeCAD', t: 'Nivelación FreeCAD: dibujar con restricciones', obj: 'Hacer un boceto totalmente restringido de un eslabón.', ac: 1, dc: 1, tema: 'sm1-restricciones',
        pasos: [[10, 'Resultados del diagnóstico en pantalla, sin nombres: este es nuestro punto de partida.'], [20, 'Yo modelo, tú modelas: boceto de un eslabón con extremos redondos.'], [40, 'Restricciones (horizontal, vertical, coincidente, tangente, distancia, radio) hasta que el boceto quede en verde.'], [20, 'Mini-reto cronometrado: eslabón de 100 mm entre centros con dos barrenos de 5 mm.'], [10, 'Boleto de salida.']],
        mat: 'Computadoras con FreeCAD y proyector. Sienta a los alumnos que necesitan apoyo junto a un monitor.', ideas: ['pr-diagnostico-visible', 'pr-freecad-espejo', 'mini-retos'], pre: 'boceto · restricción · totalmente restringido' },
      { h: 1, m: 'd', tipo: 'Teoría', t: 'Leer un plano: vistas, líneas y cotas', obj: 'Interpretar las vistas y cotas de un plano sencillo.', ac: 0, dc: 2, tema: 'sm1-planos',
        pasos: [[10, 'Pregunta-reto: ¿qué pieza es? (muestra solo sus 3 vistas).'], [20, 'Tema en proyector: líneas, vistas, cotas y escalas.'], [15, 'En parejas: dibujan las 3 vistas de su goma o sacapuntas.'], [5, 'Boleto de salida.']],
        ideas: ['pregunta-reto', 'pr-error-del-dia'], pre: 'vista frontal · cota · escala' },
      { h: 2, m: 'd', tipo: 'Práctica', t: 'Grados de libertad con tiras de cartón', obj: 'Calcular la movilidad de un mecanismo y comprobarla armándolo.', ac: 2, dc: 0, tema: 'sm2-gdl',
        pasos: [[20, 'Tema: M = 3(n − 1) − 2·j1 − j2.'], [50, 'Taller: con tiras de cartón y broches latonados arman 3, 4 y 5 barras; predicen M y comprueban moviéndolo.'], [20, 'Puesta en común: ¿por qué el triángulo no se mueve? ¿por qué el de 5 barras necesita dos manos?'], [10, 'Boleto de salida.']],
        mat: 'Tiras de cartón de 2 × 15 cm, broches latonados, regla y perforadora.', ev: 'Tabla de predicción y comprobación en la libreta', ideas: ['pares-baratos', 'pr-pausa-predice'], pre: 'grados de libertad · base · par de un grado' },
      { h: 3, m: 'd', tipo: 'Práctica', t: 'Cuatro barras y ley de Grashof', obj: 'Predecir con números si un mecanismo de cuatro barras dará vueltas completas.', ac: 2, dc: 0, tema: 'sm2-4barras',
        pasos: [[30, 'Tema en proyector: Grashof y tipos de cuatro barras.'], [20, 'Simulador PMKS+ o Sketcher de FreeCAD: cambian longitudes y observan.'], [60, 'Reto Grashof: cada equipo recibe medidas, predice el tipo y luego lo arma con cartón.'], [25, 'Galería de errores: casos que no salieron como predijeron.'], [15, 'Bitácora: qué predije, qué pasó y por qué.']],
        ev: 'Cuatro barras de cartón con predicción correcta (Desempeño)', ideas: ['grashof', 'pr-linkage-sim', 'fc-4barras-sketch', 'galeria-errores'], pre: 'manivela · balancín · acoplador · Grashof' },
      { h: 1, m: 'd', tipo: 'Teoría', t: 'Biela-manivela: del giro al vaivén', obj: 'Explicar cómo una biela-manivela convierte giro en movimiento alternativo.', ac: 1, dc: 0, tema: 'sm2-biela',
        pasos: [[5, 'Cámara lenta: un pistón o un juguete con manivela.'], [25, 'Tema en proyector.'], [15, 'Boceto en la libreta: una compuerta movida por biela-manivela.'], [5, 'Boleto de salida.']],
        ideas: ['pr-camara-lenta', 'biela-compuerta'], pre: 'biela · carrera · punto muerto' },
      { h: 3, m: 'd', tipo: 'FreeCAD', t: 'FreeCAD Part Design: modelar eslabones', obj: 'Modelar en 3D los eslabones de un mecanismo con extrusiones y barrenos.', ac: 1, dc: 1,
        pasos: [[15, 'Mini-reto de restricciones para calentar.'], [45, 'Yo modelo, tú modelas: Pad (extrusión), Pocket (vaciado) y barrenos de un eslabón.'], [60, 'Práctica: modelan base, eslabón motriz, conector y conducido de un cuatro barras.'], [20, 'Revisión por parejas con lista de cotejo.'], [10, 'Guardan con nombre correcto y boleto de salida.']],
        ev: 'Eslabones modelados (Producto)', ideas: ['pr-freecad-espejo', 'mini-retos', 'semaforo'], pre: 'Pad · Pocket · barreno' },
      { h: 1, m: 'd', tipo: 'Teoría', t: 'Levas y seguidores', obj: 'Reconocer cómo una leva programa un movimiento.', ac: 1, dc: 0, tema: 'sm2-levas',
        pasos: [[5, 'Pregunta-reto: ¿cómo "sabe" la máquina de coser cuándo subir la aguja?'], [25, 'Tema en proyector.'], [15, 'Diseño rápido en la libreta: perfil de leva para un alimentador.'], [5, 'Boleto de salida.']],
        ideas: ['leva-alimentador', 'pregunta-reto'], pre: 'leva · seguidor · perfil' },
      { h: 3, m: 'd', tipo: 'Proyecto', t: 'Proyecto: equipos, idea y esquema cinemático', obj: 'Definir el diseño del mecanismo del equipo: base, eslabón motriz, conector y conducido.', ac: 2, dc: 0,
        pasos: [[15, 'Equipos equilibrados (Perfiles) y roles rotativos.'], [20, 'El reto: garra o brazo articulado que levante un objeto ligero; criterios de la rúbrica.'], [45, 'Bocetos: cada integrante propone y eligen uno.'], [40, 'Esquema cinemático con base, motriz, conector y conducido; calculan M.'], [20, 'Lista de piezas con medidas y material.'], [10, 'Semáforo de avance.']],
        ev: 'Boceto y esquema cinemático del proyecto (Producto)', tarea: 'Conseguir cartón grueso y broches latonados o tornillos M3 con tuerca.', ideas: ['roles-equipo', 'semaforo', 'bloque-3h'], pre: 'esquema cinemático · eslabón motriz · conducido' },
      { h: 2, m: 'd', tipo: 'FreeCAD', t: 'FreeCAD: piezas del proyecto (1)', obj: 'Modelar las piezas del mecanismo del equipo.', ac: 2, dc: 0,
        pasos: [[10, 'Revisión rápida del esquema de cada equipo.'], [80, 'Cada integrante modela una pieza del proyecto.'], [10, 'Guardan y semáforo de avance.']],
        ideas: ['semaforo', 'mini-retos'], pre: 'pieza · medida · barreno' },
      { h: 1, m: 'd', tipo: 'Teoría', t: 'Engranes y relación de transmisión', obj: 'Calcular la relación de transmisión y el sentido de giro de un par de engranes.', ac: 1, dc: 0, tema: 'sm2-engranes',
        pasos: [[5, 'Pregunta-reto: ¿por qué cambias de velocidad en la bici?'], [25, 'Tema: i = Z2/Z1, sentido de giro y distancia entre centros.'], [15, 'Ejercicios en parejas.'], [5, 'Votación con tarjetas para revisar.']],
        ideas: ['engranes-carton', 'pr-plickers'], pre: 'piñón · rueda · relación de transmisión' },
      { h: 2, m: 'd', tipo: 'FreeCAD', t: 'FreeCAD: piezas del proyecto (2) y materiales', obj: 'Elegir material y espesor de cada pieza considerando su impacto ecológico.', ac: 2, dc: 1, tema: 'sm2-materiales',
        pasos: [[25, 'Tema: cartón, MDF y plástico; impacto ecológico.'], [65, 'Terminan de modelar; eligen material y espesor de cada pieza.'], [10, 'Semáforo de avance.']],
        ev: 'Piezas del proyecto modeladas (Producto)', pre: 'MDF · espesor · impacto ecológico' },
      { h: 3, m: 'd', tipo: 'FreeCAD', t: 'Ensamble en FreeCAD', obj: 'Ensamblar las piezas con uniones que respeten su función (fija, giratoria, deslizante).', ac: 0, dc: 0, tema: 'sm2-explosionada',
        pasos: [[20, 'Tema en proyector: del modelo al ensamble.'], [40, 'Yo modelo, tú modelas: Assembly, pieza fija y uniones (equivalen a coincidente, concéntrica, paralela…).'], [70, 'Ensamblan su proyecto.'], [20, 'Revisión por parejas.']],
        ideas: ['fc-ensamble-explosionada', 'pr-freecad-espejo'], pre: 'ensamble · unión giratoria · pieza fija' },
      { h: 1, m: 'd', tipo: 'Teoría', t: 'Poleas, bandas y cadenas', obj: 'Calcular velocidades en transmisiones por polea.', ac: 1, dc: 0, tema: 'sm2-poleas',
        pasos: [[5, 'Pregunta-reto: ¿qué tienen en común una lavadora y una bici?'], [25, 'Tema en proyector.'], [15, 'Ejercicios: relación de poleas.'], [5, 'Boleto de salida.']],
        pre: 'polea motriz · polea conducida · banda' },
      { h: 3, m: 'd', tipo: 'FreeCAD', t: 'Simulación de movimiento y colisiones', obj: 'Verificar el movimiento del ensamble y corregir choques antes de fabricar.', ac: 0, dc: 1,
        pasos: [[20, 'Demostración: mover el ensamble arrastrando la manivela.'], [70, 'Mueven su mecanismo, detectan choques entre piezas y corrigen medidas.'], [30, 'Bitácora de fallas: qué chocó y cómo lo corrigieron.'], [30, 'Revisión por equipo.']],
        ev: 'Ensamble que se mueve sin colisiones (Desempeño)', ideas: ['bitacora-fallas', 'pr-antes-despues'], pre: 'colisión · holgura · simulación' },
      { h: 1, m: 'd', tipo: 'Teoría', t: 'Tornillo-tuerca y piñón-cremallera', obj: 'Explicar cómo se convierte un giro en avance lineal.', ac: 1, dc: 0, tema: 'sm2-tornillo',
        pasos: [[5, 'Objeto en mano: gato de tijera o prensa.'], [25, 'Tema en proyector.'], [15, 'Ejercicios: avance por vuelta.'], [5, 'Boleto de salida.']],
        pre: 'paso · cremallera · avance' },
      { h: 1, m: 'd', tipo: 'Taller', t: 'Seguridad en el taller', obj: 'Usar cúter, segueta y regla metálica de forma segura.', ac: 2, dc: 2, tema: 'sm2-seguridad',
        pasos: [[10, '5 minutos de seguridad: dirección de corte y posición de las manos.'], [20, 'Tema: equipo de protección y reglas.'], [15, 'Demostración de corte seguro.'], [5, 'Firman el reglamento.']],
        ev: 'Reglamento firmado', ideas: ['seguridad-cuter'], pre: 'EPP · dirección de corte' },
      { h: 2, m: 'd', tipo: 'FreeCAD', t: 'Plano en vista explosionada (TechDraw)', obj: 'Obtener el plano del ensamble en vista explosionada con cotas, cuadro de datos y escala.', ac: 0, dc: 2, tema: 'sm2-explosionada',
        pasos: [[20, 'Vista explosionada en Assembly.'], [60, 'TechDraw: vistas, cotas principales, cuadro de datos (nombre, escala, material) y lista de piezas.'], [20, 'Exportan a PDF y revisan con lista de cotejo.']],
        ev: 'Plano del ensamble en vista explosionada (Producto · actividad clave)', ideas: ['fc-ensamble-explosionada'], pre: 'vista explosionada · cuadro de datos · lista de piezas' },
      { h: 3, m: 'd', tipo: 'Taller', t: 'Plantillas 1:1 y trazado', obj: 'Pasar las piezas del CAD al material con plantillas a escala real.', ac: 1, dc: 1,
        pasos: [[20, 'Imprimen plantillas 1:1 desde FreeCAD y verifican la escala con regla.'], [20, 'Seguridad antes de cortar.'], [80, 'Pegan plantillas en cartón o MDF, trazan y marcan centros de barrenos.'], [30, 'Inician corte supervisado.']],
        mat: 'Plantillas impresas, cartón grueso, pegamento en barra, cúter, regla metálica y base para cortar.', ev: 'Plantillas trazadas (Producto)', ideas: ['fc-plantillas', 'seguridad-cuter'], pre: 'escala 1:1 · plantilla · centro de barreno' },
      { h: 1, m: 'd', tipo: 'Evaluación', t: 'Revisión de planos y retroalimentación', obj: 'Corregir el plano con retroalimentación concreta.', ac: 0, dc: 2,
        pasos: [[10, 'Galería de planos.'], [30, 'Retroalimentación con lista de cotejo; corrigen.'], [10, 'Bitácora.']],
        ideas: ['galeria-errores', 'coevaluacion'] },
      { h: 3, m: 'd', tipo: 'Taller', t: 'Corte y perforación de piezas', obj: 'Construir las piezas con las dimensiones del plano usando herramientas manuales con seguridad.', ac: 2, dc: 2,
        pasos: [[10, '5 minutos de seguridad.'], [120, 'Cortan y perforan; verifican medidas contra el plano.'], [20, 'Limpieza y bitácora.']],
        ev: 'Piezas cortadas con dimensiones correctas (Producto) y uso seguro de herramientas (Desempeño)', ideas: ['seguridad-cuter', 'bitacora-fallas'] },
      { h: 1, m: 'd', tipo: 'Formación', t: 'El error es información', obj: 'Ver los errores del proyecto como datos para mejorar.', ac: null, tema: 'gen-mentalidad',
        pasos: [[5, 'Historia de un error famoso.'], [25, 'Tema en proyector.'], [15, 'Bitácora: mi error de la semana y qué aprendí.'], [5, 'Boleto de salida.']],
        ideas: ['pr-error-del-dia', 'bitacora-fallas'], pre: 'todavía · error · bitácora' },
      { h: 3, m: 'd', tipo: 'Taller', t: 'Ensamble con pares de enlace', obj: 'Ensamblar el mecanismo con pares giratorios que permitan su movimiento.', ac: 2, dc: 3,
        pasos: [[15, 'Demostración: par giratorio con tornillo M3 y tuerca o broche latonado; la holgura importa.'], [110, 'Ensamblan su mecanismo.'], [25, 'Primera prueba de movimiento y bitácora.']],
        ideas: ['pares-baratos', 'bitacora-fallas'], pre: 'par giratorio · holgura · tuerca' },
      { h: 2, m: 'd', tipo: 'Taller', t: 'Ensamble y primeras pruebas', obj: 'Lograr que el mecanismo levante el objeto.', ac: 2, dc: 3,
        pasos: [[80, 'Terminan el ensamble y prueban levantar el objeto.'], [20, 'Semáforo y bitácora.']], ideas: ['semaforo'] },
      { h: 1, m: 'd', tipo: 'Evaluación', t: 'Repaso: ¿Quién quiere ser técnico?', obj: 'Repasar los temas del parcial jugando.', ac: null,
        pasos: [[40, 'Juego de repaso con preguntas de los temas.'], [10, 'Dudas.']], ideas: ['pr-quien-quiere', 'pr-plickers'] },
      { h: 2, m: 'd', tipo: 'Taller', t: 'Ajustes: sin colisiones ni trabas', obj: 'Corregir holguras y refuerzos hasta que el mecanismo funcione suave.', ac: 2, dc: 3,
        pasos: [[80, 'Ajustan holguras, refuerzan piezas y prueban.'], [20, 'Bitácora.']], ideas: ['bitacora-fallas'] },
      { h: 3, m: 'd', tipo: 'Proyecto', t: 'Acabado, prueba final y ensayo de defensa', obj: 'Dejar el mecanismo listo y practicar cómo explicarlo.', ac: 2, dc: 3,
        pasos: [[90, 'Acabado y prueba de funcionamiento con el objeto.'], [40, 'Ensayo de defensa: 2 minutos por equipo.'], [20, 'Retroalimentación de compañeros.']],
        ideas: ['pr-explica-60', 'coevaluacion'] },
      { h: 1, m: 'd', tipo: 'Evaluación', t: 'Repaso final y dudas', obj: 'Llegar al examen con las fórmulas claras: M, Grashof e i.', ac: null,
        pasos: [[10, 'Pregunta-reto.'], [30, 'Repaso de fórmulas y ejercicios tipo examen.'], [10, 'Un minuto para respirar: cómo llegar tranquilo al examen.']], ideas: ['pr-plickers', 'pr-respira'] },
      { h: 3, m: 'c', tipo: 'Proyecto', t: 'Exposición de proyectos y pruebas de funcionamiento', obj: 'Demostrar el mecanismo funcionando y defenderlo.', ac: 2, dc: 3,
        pasos: [[10, 'Montaje.'], [120, 'Cada equipo: 5 minutos de defensa y prueba en vivo; evalúas con rúbrica.'], [20, 'Retroalimentación.']],
        ev: 'Mecanismo funcionando sin colisiones (Producto) y defensa (Desempeño)', ideas: ['coevaluacion'] },
      { h: 2, m: 'c', tipo: 'Proyecto', t: 'Exposición (continuación) y coevaluación', obj: 'Terminar exposiciones y evaluarse entre compañeros.', ac: 2, dc: 3,
        pasos: [[70, 'Equipos restantes.'], [30, 'Coevaluación con lista de cotejo.']], ideas: ['coevaluacion'] },
      { h: 1, m: 'c', tipo: 'Evaluación', t: 'Plenaria de resultados', obj: 'Reflexionar qué funcionó y qué fallaría en la industria.', ac: null,
        pasos: [[10, 'Muro de logros.'], [30, 'Plenaria: qué funcionó, qué mejorarían, qué fallaría en una planta.'], [10, 'Entrega de bitácoras.']],
        ev: 'Bitácora de fallas y ajustes (Producto)', ideas: ['pr-muro-logros', 'pr-mapa-mental'] },
      { h: 2, m: 'c', tipo: 'Evaluación', t: 'Examen del 2º parcial', obj: 'Evaluar lo aprendido en el submódulo.', ac: null,
        pasos: [[5, 'Un minuto para respirar.'], [85, 'Examen.'], [10, 'Recoge y cierra.']], ev: 'Examen del parcial', ideas: ['pr-respira'] },
      { h: 3, m: 'c', tipo: 'Evaluación', t: 'Retroalimentación del examen y pendientes', obj: 'Aprender de los errores del examen y cerrar evidencias.', ac: null,
        pasos: [[40, 'Errores comunes del examen en pantalla, sin nombres.'], [80, 'Recuperación de evidencias pendientes y corrección de planos.'], [30, 'Revisión de calificaciones con cada alumno.']], ideas: ['galeria-errores'] },
      { h: 1, m: 'c', tipo: 'Formación', t: 'Autoevaluación y meta para el 3er parcial', obj: 'Cerrar el parcial con una meta personal.', ac: null,
        pasos: [[20, 'Autoevaluación.'], [20, 'Lo que viene: neumática e hidráulica; su mecanismo será la base de la grúa.'], [10, 'Meta personal en la libreta.']],
        tarea: 'Guardar el mecanismo: será la base de la grúa del 3er parcial.', ideas: ['pr-yo-25'] }
    ],
    'II-3': [
      { h: 3, m: 'a', tipo: 'Encuadre', t: 'Encuadre del 3er parcial y cuestionario diagnóstico', obj: 'Presentar el proyecto de la grúa y conocer qué saben de fluidos y circuitos.', ac: null,
        pasos: [[15, 'Encuadre y criterios de evaluación.'], [25, 'Pregunta-reto: ¿cómo levanta una retroexcavadora dos toneladas? Lluvia de ideas: frenos, prensas, sillas de dentista.'], [20, 'El proyecto: grúa mecatrónica hidráulica y motorizada sobre su mecanismo del 2º parcial.'], [60, 'Cuestionario diagnóstico: fluidos, Pascal y circuitos.'], [30, 'Equipos (Perfiles) y lista de materiales.']],
        ev: 'Cuestionario diagnóstico contestado (Desempeño)', tarea: 'Conseguir 4 jeringas (2 de 10 ml y 2 de 20 ml), 1 m de manguera, motor DC de 3 a 5 V, portapilas e interruptor.', ideas: ['pregunta-reto', 'industria-real'], pre: 'fluido · presión · hidráulica' },
      { h: 1, m: 'a', tipo: 'Teoría', t: 'Presión: fuerza sobre área', obj: 'Calcular presión y convertir sus unidades.', ac: 0, dc: 0, tema: 'sm3-presion',
        pasos: [[5, 'Pregunta: ¿por qué duele más el pisotón de un tacón que el de un tenis?'], [25, 'Tema en proyector.'], [15, 'Ejercicios de conversión: Pa, bar y psi.'], [5, 'Boleto de salida.']], pre: 'presión · área · bar' },
      { h: 3, m: 'a', tipo: 'Práctica', t: 'Principio de Pascal con jeringas', obj: 'Comprobar con jeringas que la fuerza se multiplica con la relación de áreas.', ac: 0, dc: 0, tema: 'sm3-pascal',
        pasos: [[20, 'Tema en proyector.'], [15, 'Simulación PhET "Bajo presión".'], [70, 'Práctica: jeringas de 10 y 20 ml conectadas; miden diámetros y calculan F2 = F1·A2/A1.'], [30, 'Conclusiones y bitácora.'], [15, 'Boleto de salida.']],
        mat: 'Jeringas de 10 y 20 ml, manguera, agua con colorante, regla o vernier.', ev: 'Reporte de la práctica de Pascal (Producto)', ideas: ['pascal-jeringas', 'pr-phet-presion'], pre: 'Pascal · émbolo · relación de áreas' },
      { h: 2, m: 'a', tipo: 'Proyecto', t: 'Neumática, hidráulica o eléctrica: ¿cuál uso?', obj: 'Decidir qué tecnología mueve cada parte de la grúa.', ac: 1, dc: 0, tema: 'sm3-comparativa',
        pasos: [[10, 'Jeringa de aire contra jeringa de agua.'], [35, 'Tema en proyector.'], [45, 'Equipos: bocetan su grúa y deciden qué mueve cada eje (hidráulica o motor).'], [10, 'Semáforo de avance.']], ideas: ['aire-vs-agua'], pre: 'neumática · hidráulica · compresible' },
      { h: 1, m: 'd', tipo: 'Teoría', t: 'Taller de unidades y conversiones', obj: 'Convertir unidades de fuerza, presión, área y caudal sin errores.', ac: 0, dc: 0,
        pasos: [[10, 'Repaso: N, Pa, bar, psi, mm², cm³ y L/min.'], [30, 'Ejercicios en parejas.'], [10, 'Votación con tarjetas para revisar.']], ideas: ['pr-plickers'], pre: 'N · Pa · bar · psi' },
      { h: 2, m: 'd', tipo: 'Teoría', t: 'Del compresor al cilindro', obj: 'Reconocer los elementos de un sistema neumático y su función.', ac: 0, dc: 1, tema: 'sm3-aire',
        pasos: [[40, 'Tema en proyector.'], [20, 'Lee un catálogo industrial real.'], [30, 'Esquema en la libreta: compresor, unidad de mantenimiento, válvula y cilindro.'], [10, 'Boleto de salida.']], ideas: ['pr-catalogo-real'], pre: 'compresor · unidad de mantenimiento · cilindro' },
      { h: 3, m: 'd', tipo: 'Práctica', t: 'Cilindros: cálculo de fuerza', obj: 'Calcular la fuerza de avance y retroceso de un cilindro.', ac: 1, dc: 0, tema: 'sm3-cilindros',
        pasos: [[40, 'Tema y ejemplo resuelto en proyector.'], [60, 'Práctica: miden el diámetro de sus jeringas y calculan su fuerza.'], [30, 'Problemas: elegir el cilindro para una carga.'], [20, 'Boleto de salida.']],
        ev: 'Hoja de cálculo de fuerzas (Producto)', pre: 'émbolo · vástago · simple y doble efecto' },
      { h: 1, m: 'd', tipo: 'Práctica', t: 'Caudal y velocidad del cilindro', obj: 'Relacionar caudal y velocidad: Q = A · v.', ac: 1, dc: 0,
        pasos: [[15, 'Q = A · v con un ejemplo.'], [25, 'Práctica: caudal con jeringa y cronómetro.'], [10, 'Boleto de salida.']], ideas: ['caudal-cronometro'], pre: 'caudal · velocidad · L/min' },
      { h: 3, m: 'd', tipo: 'Teoría', t: 'Válvulas: vías, posiciones y accionamientos', obj: 'Nombrar válvulas por vías y posiciones y leer su símbolo.', ac: 0, dc: 1, tema: 'sm3-valvulas',
        pasos: [[50, 'Tema en proyector.'], [40, 'Memorama de simbología ISO 1219.'], [40, 'Ejercicios: nombrar válvulas en diagramas.'], [20, 'Boleto de salida.']], ideas: ['memorama-iso'], pre: 'vía · posición · 3/2 · 5/2' },
      { h: 1, m: 'd', tipo: 'Teoría', t: 'Diagramas con ISO 1219', obj: 'Dibujar un circuito básico con símbolos normalizados.', ac: 0, dc: 1, tema: 'sm3-iso1219',
        pasos: [[30, 'Tema en proyector.'], [15, 'Primer diagrama: cilindro de simple efecto con válvula 3/2.'], [5, 'Boleto de salida.']], pre: 'símbolo · línea de trabajo · escape' },
      { h: 3, m: 'd', tipo: 'Práctica', t: 'Leer planos neumáticos e hidráulicos', obj: 'Reconocer sistemas en un plano con su simbología, unidades y presiones.', ac: 0, dc: 1,
        pasos: [[20, 'El error del día: un diagrama mal dibujado.'], [60, 'Escape room de simbología.'], [50, 'En equipo leen planos reales: identifican componentes, unidades y presiones.'], [20, 'Plenaria.']],
        ev: 'Interpretación de planos (Producto · actividad clave)', ideas: ['pr-escape-iso', 'pr-error-del-dia'], pre: 'plano · simbología · presión de trabajo' },
      { h: 2, m: 'd', tipo: 'Práctica', t: 'Diagramas en simulador', obj: 'Elaborar y probar circuitos básicos en un simulador.', ac: 1, dc: 1,
        pasos: [[20, 'Demostración en el simulador del plantel; si no hay, en la libreta y con "Pausa y predice".'], [70, 'Dibujan y prueban: cilindro de simple y de doble efecto.'], [10, 'Guardan su trabajo.']],
        ev: 'Elementos diseñados en simulador (Producto · actividad clave)', ideas: ['pr-pausa-predice'], pre: 'simulador · circuito · doble efecto' },
      { h: 1, m: 'd', tipo: 'Teoría', t: 'Electroneumática: mando eléctrico', obj: 'Explicar cómo un botón mueve un cilindro a través de un solenoide.', ac: 2, dc: 0, tema: 'sm3-electro',
        pasos: [[30, 'Tema en proyector.'], [15, 'Ejemplo: botón → relevador → solenoide.'], [5, 'Boleto de salida.']], pre: 'solenoide · relevador · contacto NA' },
      { h: 2, m: 'd', tipo: 'Práctica', t: 'Diagrama de escalera en papel', obj: 'Dibujar el diagrama de escalera del motor de la grúa.', ac: 2, dc: 0,
        pasos: [[20, 'Reglas del diagrama de escalera.'], [60, 'Dibujan el circuito del motor: interruptor, motor e inversión de giro.'], [20, 'Revisión cruzada entre equipos.']],
        ev: 'Diagrama de escalera en la libreta (Producto)', ideas: ['escalera-papel'], pre: 'escalera · riel · bobina' },
      { h: 3, m: 'd', tipo: 'Práctica', t: 'Motor de CD e inversión de giro', obj: 'Conectar un motor de CD y cambiar su sentido de giro sin cortos.', ac: 2, dc: 0, tema: 'sm3-motordc',
        pasos: [[30, 'Tema en proyector.'], [15, 'Simulan el circuito en PhET antes de cablear.'], [80, 'Práctica: motor, portapilas e interruptor; invierten el giro.'], [25, 'Bitácora y limpieza.']],
        mat: 'Motor DC de 3 a 5 V, portapilas AA, interruptor de doble polo, cable, cinta de aislar.', ev: 'Circuito eléctrico funcionando sin cortos (Desempeño)', ideas: ['inversion-giro', 'pr-phet-circuitos'], pre: 'polaridad · corto circuito · doble polo' },
      { h: 1, m: 'd', tipo: 'Taller', t: 'Seguridad con fluidos y electricidad', obj: 'Trabajar con presión, mangueras y pilas sin riesgos.', ac: 3, dc: 0,
        pasos: [[10, 'Casos reales de accidentes, sin morbo.'], [25, 'Reglas: presión, mangueras, pilas en corto y equipo de protección (NOM-017-STPS).'], [15, 'Firman el reglamento del proyecto.']], ideas: ['seguridad-cuter'], pre: 'EPP · corto circuito · presión' },
      { h: 3, m: 'd', tipo: 'Proyecto', t: 'Diseño de la grúa: cálculos y boceto', obj: 'Seleccionar jeringas y calcular la fuerza para la carga de la grúa.', ac: 1, dc: 0,
        pasos: [[20, 'Requisito: levantar y mover una carga ligera (define cuántos gramos).'], [60, 'Cálculo: fuerza necesaria, jeringas y relación de áreas.'], [50, 'Boceto con medidas sobre el mecanismo del 2º parcial.'], [20, 'Lista final de materiales.']],
        ev: 'Memoria de cálculo y boceto (Producto)', pre: 'carga · relación de áreas · selección' },
      { h: 1, m: 'd', tipo: 'Práctica', t: 'Diagrama hidráulico de la grúa', obj: 'Dibujar el circuito de su grúa con simbología ISO 1219.', ac: 0, dc: 1,
        pasos: [[40, 'Dibujan el circuito de su grúa en la libreta.'], [10, 'Revisión.']], ev: 'Diagrama hidráulico en la libreta (Producto)' },
      { h: 3, m: 'd', tipo: 'Taller', t: 'Montaje hidráulico: sellado y purgado', obj: 'Conectar jeringas y mangueras sin aire ni fugas.', ac: 2, dc: 1,
        pasos: [[15, 'Demostración: llenar con agua y colorante sin burbujas.'], [110, 'Montaje: jeringas, manguera y sujeción a la estructura.'], [25, 'Prueba de fugas y bitácora.']],
        mat: 'Jeringas, manguera, agua con colorante, cinchos, silicón y trapos.', ev: 'Instalación hidráulica purgada sin fugas (Desempeño)', ideas: ['bitacora-fallas'], pre: 'purgar · fuga · sellado' },
      { h: 2, m: 'd', tipo: 'Taller', t: 'Montaje hidráulico (continuación)', obj: 'Terminar el montaje y probar cada eje.', ac: 2, dc: 1,
        pasos: [[80, 'Terminan el montaje y prueban cada eje.'], [20, 'Bitácora.']] },
      { h: 1, m: 'd', tipo: 'Teoría', t: 'Método para diagnosticar fallas', obj: 'Ir del síntoma a la causa con un método.', ac: 3, dc: 1, tema: 'sm3-fallas',
        pasos: [[30, 'Tema en proyector.'], [15, 'Casos: síntoma → causa → solución.'], [5, 'Boleto de salida.']], pre: 'síntoma · causa · solución' },
      { h: 2, m: 'd', tipo: 'Taller', t: 'Circuito eléctrico del motor en la grúa', obj: 'Instalar el motor según su diagrama de escalera.', ac: 2, dc: 0,
        pasos: [[80, 'Instalan motor, portapilas e interruptor según su diagrama.'], [20, 'Prueba y bitácora.']] },
      { h: 3, m: 'd', tipo: 'Proyecto', t: 'Integración con el mecanismo del 2º parcial', obj: 'Unir estructura, hidráulica y motor en una sola grúa.', ac: 2, dc: 1,
        pasos: [[130, 'Integran estructura, hidráulica y motor.'], [20, 'Semáforo de avance.']], ideas: ['semaforo'] },
      { h: 1, m: 'd', tipo: 'Evaluación', t: 'Bitácora técnica y revisión de avances', obj: 'Revisar la bitácora y planear lo que falta.', ac: 3, dc: 1,
        pasos: [[30, 'Revisión de bitácoras con lista de cotejo.'], [20, 'Plan de trabajo para terminar.']], ideas: ['bitacora-fallas'] },
      { h: 3, m: 'd', tipo: 'Proyecto', t: 'Integración electrohidráulica', obj: 'Terminar la integración y probar en vacío.', ac: 2, dc: 1,
        pasos: [[130, 'Terminan la integración.'], [20, 'Prueba en vacío.']] },
      { h: 2, m: 'd', tipo: 'Práctica', t: 'Opera el circuito', obj: 'Operar la grúa con seguridad y registrar su desempeño.', ac: 3, dc: 0,
        pasos: [[10, 'Reglas de operación segura.'], [70, 'Operan: suben, bajan y giran; registran tiempos y carga.'], [20, 'Bitácora.']] },
      { h: 1, m: 'd', tipo: 'Evaluación', t: 'Repaso de cálculos', obj: 'Repasar presión, Pascal y fuerza jugando.', ac: null,
        pasos: [[40, '"¿Quién quiere ser técnico?" con presión, Pascal y fuerza.'], [10, 'Dudas.']], ideas: ['pr-quien-quiere'] },
      { h: 2, m: 'd', tipo: 'Taller', t: 'Pruebas y corrección de fallas', obj: 'Validar el funcionamiento con carga y corregir fallas.', ac: 3, dc: 1,
        pasos: [[80, 'Prueban con carga; corrigen fugas, trabas y falsos contactos.'], [20, 'Bitácora.']], ev: 'Sistema en funcionamiento (Producto · actividad clave)' },
      { h: 3, m: 'd', tipo: 'Taller', t: 'Ajustes finales y pruebas con carga', obj: 'Dejar la grúa lista para la evaluación.', ac: 3, dc: 1,
        pasos: [[120, 'Ajustes finales.'], [30, 'Prueba cronometrada con carga.']] },
      { h: 1, m: 'd', tipo: 'Proyecto', t: 'Ensayo de defensa oral', obj: 'Explicar su grúa en 2 minutos con claridad.', ac: null,
        pasos: [[40, 'Pitch de 2 minutos por equipo.'], [10, 'Retroalimentación.']], ideas: ['pr-explica-60'] },
      { h: 3, m: 'c', tipo: 'Evaluación', t: 'Pruebas con carga (equipos 1 a 3)', obj: 'Evaluar el funcionamiento de la grúa con rúbrica.', ac: 3, dc: 0,
        pasos: [[10, 'Montaje.'], [120, 'Prueba con rúbrica: levanta, mueve y deposita la carga.'], [20, 'Retroalimentación.']], ev: 'Grúa operando correctamente (Producto)' },
      { h: 1, m: 'c', tipo: 'Taller', t: 'Corrección de fallas en tiempo real', obj: 'Resolver fallas detectadas en las pruebas.', ac: 3, dc: 1,
        pasos: [[45, 'Corrigen lo detectado en las pruebas.'], [5, 'Bitácora.']] },
      { h: 3, m: 'c', tipo: 'Evaluación', t: 'Pruebas con carga (equipos 4 a 6)', obj: 'Evaluar el funcionamiento de la grúa con rúbrica.', ac: 3, dc: 0,
        pasos: [[10, 'Montaje.'], [120, 'Prueba con rúbrica.'], [20, 'Retroalimentación.']], ev: 'Grúa operando correctamente (Producto)' },
      { h: 2, m: 'c', tipo: 'Evaluación', t: 'Entrega y revisión de bitácoras', obj: 'Cerrar la bitácora técnica de fallas y soluciones.', ac: 3, dc: 1,
        pasos: [[60, 'Completan y entregan su bitácora.'], [40, 'Revisión con lista de cotejo.']], ev: 'Bitácora técnica de fallas y soluciones (Producto)' },
      { h: 1, m: 'c', tipo: 'Evaluación', t: 'Repaso para el examen', obj: 'Llegar al examen con los cálculos claros.', ac: null,
        pasos: [[40, 'Repaso con tarjetas.'], [10, 'Un minuto para respirar.']], ideas: ['pr-plickers', 'pr-respira'] },
      { h: 2, m: 'c', tipo: 'Evaluación', t: 'Examen del 3er parcial', obj: 'Evaluar lo aprendido en el submódulo.', ac: null,
        pasos: [[5, 'Un minuto para respirar.'], [85, 'Examen.'], [10, 'Recoge y cierra.']], ev: 'Examen del parcial', ideas: ['pr-respira'] },
      { h: 3, m: 'c', tipo: 'Proyecto', t: 'Preparación de la feria de proyectos', obj: 'Preparar montaje, cartel y pitch.', ac: null,
        pasos: [[90, 'Montaje, cartel y pitch.'], [60, 'Ensayo general.']], ideas: ['industria-real'] },
      { h: 1, m: 'c', tipo: 'Evaluación', t: 'Retroalimentación del examen', obj: 'Aprender de los errores del examen.', ac: null,
        pasos: [[40, 'Errores comunes del examen, sin nombres.'], [10, 'Dudas.']], ideas: ['galeria-errores'] },
      { h: 3, m: 'c', tipo: 'Proyecto', t: 'Feria de proyectos: defensa oral (1)', obj: 'Defender el proyecto ante invitados.', ac: 3, dc: 1,
        pasos: [[10, 'Montaje.'], [130, 'Defensa oral y demostración.'], [10, 'Cierre.']], ev: 'Defensa oral del proyecto (Desempeño)', ideas: ['industria-real', 'pr-videollamada'] },
      { h: 1, m: 'c', tipo: 'Evaluación', t: 'Coevaluación', obj: 'Evaluarse entre compañeros con criterios claros.', ac: null,
        pasos: [[40, 'Coevaluación con lista de cotejo.'], [10, 'Comentarios.']], ideas: ['coevaluacion'] },
      { h: 3, m: 'c', tipo: 'Proyecto', t: 'Feria de proyectos: defensa oral (2)', obj: 'Defender el proyecto ante invitados.', ac: 3, dc: 1,
        pasos: [[10, 'Montaje.'], [130, 'Defensa oral y demostración.'], [10, 'Cierre.']], ev: 'Defensa oral del proyecto (Desempeño)' },
      { h: 2, m: 'c', tipo: 'Evaluación', t: 'Recuperación y pendientes', obj: 'Dar una última oportunidad de cerrar evidencias.', ac: null,
        pasos: [[90, 'Recuperación de evidencias pendientes.'], [10, 'Cierre.']] },
      { h: 1, m: 'c', tipo: 'Formación', t: 'Plenaria final de aprendizajes', obj: 'Reconocer lo aprendido en el semestre.', ac: null,
        pasos: [[10, 'Muro de logros.'], [35, 'Mapa mental colectivo del semestre.'], [5, 'Agradecimiento.']], ideas: ['pr-mapa-mental', 'pr-muro-logros'] },
      { h: 2, m: 'c', tipo: 'Evaluación', t: 'Revisión de calificaciones con cada alumno', obj: 'Que cada alumno conozca y entienda su calificación.', ac: null,
        pasos: [[90, 'Revisión individual mientras el grupo termina pendientes.'], [10, 'Cierre.']] },
      { h: 3, m: 'c', tipo: 'Taller', t: 'Desmontaje responsable y reciclaje', obj: 'Separar materiales reutilizables y reciclables (economía ecológica).', ac: null,
        pasos: [[90, 'Desmontan y separan materiales reutilizables y reciclables.'], [40, 'Inventario de herramientas.'], [20, 'Reflexión: ¿cuánto cuesta lo que se tira en una planta?']] },
      { h: 1, m: 'c', tipo: 'Formación', t: 'Cierre del semestre: mi yo de 25 años', obj: 'Conectar lo aprendido con su proyecto de vida.', ac: null,
        pasos: [[30, 'Mi yo de 25 años.'], [15, '¿Dónde voy a trabajar? El Bajío industrial.'], [5, 'Despedida.']], ideas: ['pr-yo-25', 'pr-carreras'] }
    ]
  };

  /* ---------- motor: acomoda la secuencia en los bloques del horario ---------- */
  const K = E.clases = {};
  const MOM = { a: ['Apertura', 'brand'], d: ['Desarrollo', 'info'], c: ['Cierre', 'warn'] };
  const MOMK = { a: 'apertura', d: 'desarrollo', c: 'cierre' };
  K.smKey = (g, pid) => { const n = (g.submodulos || {})[pid]; return n ? 'II-' + n : null; };
  K.estado = g => S.get('clases:' + g.id) || {};
  K.seq = (g, pid) => {
    const base = E.CLASES[K.smKey(g, pid)] || []; const ord = (K.estado(g).orden || {})[pid];
    const ok = Array.isArray(ord) && ord.length === base.length && ord.every(i => base[i]);
    return (ok ? ord : base.map((_, i) => i)).map((i, pos) => Object.assign({ idx: i, pos: pos }, base[i]));
  };
  K.bloques = (g, p) => {
    const out = [];
    C.clases(g, p).forEach(c => C.bloquesDia(g, c.fecha).forEach(b => out.push({ fecha: c.fecha, inicio: b.inicio, fin: b.fin, horas: Number(b.horas) || 1, key: c.fecha + '@' + b.inicio })));
    return out;
  };
  K.plan = (g, pid) => {
    const p = C.parcial(pid), seq = K.seq(g, pid), st = K.estado(g), perd = st.perdidas || {};
    const bl = K.bloques(g, p); let i = 0, rem = seq.length ? seq[0].h : 0;
    bl.forEach(b => {
      b.perdida = !!perd[b.key]; b.parts = []; if (b.perdida) return;
      let cap = b.horas;
      while (cap > 0 && i < seq.length) {
        const it = seq[i], take = Math.min(cap, rem), antes = it.h - rem;
        b.parts.push({ it: it, h: take, antes: antes, sigue: take < rem });
        cap -= take; rem -= take; if (rem <= 0) { i++; rem = i < seq.length ? seq[i].h : 0; }
      }
      b.libre = cap;
    });
    let faltan = 0; const pend = [];
    if (i < seq.length) { faltan = rem; pend.push(seq[i]); for (let j = i + 1; j < seq.length; j++) { faltan += seq[j].h; pend.push(seq[j]); } }
    const tot = seq.reduce((s, x) => s + x.h, 0), cal = bl.filter(b => !b.perdida).reduce((s, b) => s + b.horas, 0);
    return { p: p, seq: seq, bloques: bl, faltan: faltan, pend: pend, tot: tot, cal: cal };
  };
  K.dia = (g, f) => { const p = D.parciales().find(x => f >= x.inicio && f <= x.fin); if (!p) return null; const pl = K.plan(g, p.id); return { p: p, plan: pl, bloques: pl.bloques.filter(b => b.fecha === f) }; };
  K.resumenDia = (g, f) => { const d = K.dia(g, f); if (!d || !d.bloques.length) return null; return d.bloques.map(b => ({ b: b, txt: b.perdida ? 'Sin clase (se recorrió)' : (b.parts.map(x => x.it.t).join(' + ') || 'Libre: repaso o recuperación') })); };

  /* ---------- piezas ---------- */
  const momChip = m => '<span class="chip ' + MOM[m][1] + '">' + MOM[m][0] + '</span>';
  function programa(g, pid, it) {
    if (it.ac == null) return '';
    const sm = E.PROGRAMA.modulos.II.sub[(g.submodulos || {})[pid]]; const ac = sm && sm.ac[it.ac]; if (!ac) return '';
    const dc = it.dc != null && ac.desarrollo ? ac.desarrollo[it.dc] : '';
    return '<details class="sub"><summary>Programa SEP: «' + esc(ac.titulo) + '» (p. ' + esc(ac.pag) + ')</summary><p class="small">' + (dc ? esc(dc) : '') + '</p><p class="small muted">Producto de la actividad clave: ' + esc(ac.producto) + '</p></details>';
  }
  function actHTML(g, pid, part, bloqueKey) {
    const it = part.it, min = it.pasos ? it.pasos.reduce((s, x) => s + x[0], 0) : 0;
    let h = '<div class="cl-act"><div class="row between gap wrap"><div>' + momChip(it.m) + ' <span class="chip">' + esc(it.tipo) + '</span>' + (part.h !== it.h ? ' <span class="chip">' + part.h + ' de ' + it.h + ' h</span>' : ' <span class="chip">' + it.h + ' h</span>') + '</div>' +
      btn('⇄ Cambiar con la siguiente', 'cl-swap', 'data-pid="' + pid + '" data-pos="' + it.pos + '"', 'small ghost') + '</div>' +
      '<h4>' + esc(it.t) + '</h4>' + (part.antes ? '<p class="note">Continúa de la clase anterior (' + part.antes + ' h ya dadas).</p>' : '') + (part.sigue ? '<p class="note">Sigue en la próxima clase.</p>' : '') +
      '<p><b>Objetivo:</b> ' + esc(it.obj) + '</p>';
    if (it.pasos) h += '<ol class="cl-pasos">' + it.pasos.map(x => '<li><span class="min">' + x[0] + ' min</span>' + esc(x[1]) + '</li>').join('') + '</ol>' + (min ? '<p class="muted small">Guion pensado para ' + it.h + ' h de horario (' + it.h * 50 + ' min).</p>' : '');
    if (it.mat) h += '<p class="small"><b>Material:</b> ' + esc(it.mat) + '</p>';
    if (it.ev) h += '<p class="small"><b>Evidencia:</b> ' + esc(it.ev) + '</p>';
    if (it.tarea) h += '<p class="note info small"><b>Tarea:</b> ' + esc(it.tarea) + '</p>';
    if (it.pre) h += '<p class="small"><b>Para adelantar el tema</b> a quien lo necesite: <i>' + esc(it.pre) + '</i></p>';
    h += programa(g, pid, it);
    const tm = it.tema && E.TEMAS.find(t => t.id === it.tema);
    const ids = (it.ideas || []).map(id => E.IDEAS.find(x => x.id === id)).filter(Boolean);
    if (tm || ids.length) h += '<div class="row gap wrap mt">' + (tm ? btn(icon('screen') + ' Proyectar tema', 'proj-open', 'data-id="' + tm.id + '"', 'small primary') + link('Ver tema', 'tema/' + tm.id, 'small') : '') + ids.map(x => link(icon('bulb') + ' ' + esc(x.titulo), 'ideas/' + x.id, 'small ghost')).join('') + '</div>';
    return h + '</div>';
  }

  /* ---------- vista: lista de clases del parcial ---------- */
  V.clases = pid => {
    const g = D.grupoActual(); if (!g) return H.noGroup();
    const hoy = u.today(), ps = D.parciales().filter(p => E.CLASES[K.smKey(g, p.id)]);
    if (!ps.length) return { t: 'Clases', h: card('<p>No hay secuencia de clases para este grupo.</p>') };
    const act = C.parcialActual(hoy); pid = pid || (ps.find(p => p.id === act.id) || ps[0]).id;
    const pl = K.plan(g, pid), p = pl.p, sm = E.PROGRAMA.modulos.II.sub[(g.submodulos || {})[pid]];
    const plan = D.planes(g.id).find(x => x.parcial === pid);
    let h = '<div class="filters">' + ps.map(x => '<a class="tab ' + (x.id === pid ? 'on' : '') + '" href="#/clases/' + x.id + '">' + esc(x.nombre) + ' · SM' + (g.submodulos || {})[x.id] + '</a>').join('') + '</div>';
    const porM = { a: 0, d: 0, c: 0 }; pl.seq.forEach(x => { porM[x.m] += x.h; });
    let chk = '';
    if (plan && plan.secuencia) { const dif = ['a', 'd', 'c'].filter(k => plan.secuencia[MOMK[k]] && Number(plan.secuencia[MOMK[k]].horas) !== porM[k]); if (dif.length) chk = '<p class="note warn">Tu planeación marca ' + dif.map(k => MOM[k][0].toLowerCase() + ' ' + plan.secuencia[MOMK[k]].horas + ' h').join(', ') + '; esta secuencia usa ' + dif.map(k => porM[k] + ' h').join(', ') + '.</p>'; }
    const hechas = pl.bloques.filter(b => b.fecha < hoy && !b.perdida).reduce((s, b) => s + b.horas, 0);
    h += card('<h3>' + icon('board') + ' Clases del ' + esc(p.nombre) + (sm ? ' · Submódulo ' + (g.submodulos || {})[pid] : '') + '</h3>' +
      '<p class="muted small">' + pl.tot + ' h de secuencia en ' + pl.cal + ' h de tu horario · apertura ' + porM.a + ' h, desarrollo ' + porM.d + ' h, cierre ' + porM.c + ' h, igual que tu planeación. Cada clase dice qué actividad clave del programa SEP 2024 trabaja.</p>' +
      '<div class="bar"><span style="width:' + (pl.cal ? Math.min(100, hechas / pl.cal * 100) : 0) + '%"></span></div><p class="small">' + hechas + ' de ' + pl.cal + ' h dadas</p>' + chk +
      (pl.faltan ? '<p class="note bad">Por clases que no se dieron, te faltan ' + pl.faltan + ' h: no caben "' + pl.pend.map(x => x.t).slice(0, 3).join('", "') + '"' + (pl.pend.length > 3 ? '…' : '') + '. Junta o recorta actividades.</p>' : ''));
    const hoyD = K.resumenDia(g, hoy), sig = C.siguienteClase(g, hoy), sigD = sig && K.resumenDia(g, sig);
    if (hoyD || sigD) h += '<div class="grid2">' + (hoyD ? card('<div class="kicker">Hoy</div>' + diaMini(hoyD) + link('Ver guion de hoy', 'clase/' + hoy, 'small primary'), 'cl-hoy') : '') + (sigD ? card('<div class="kicker">Próxima clase · ' + u.fLarga(sig) + '</div>' + diaMini(sigD) + link('Preparar', 'clase/' + sig, 'small')) : '') + '</div>';
    const semanas = {}; pl.bloques.forEach(b => { const d = u.parse(b.fecha); const lun = u.addDays(b.fecha, -((d.getDay() + 6) % 7)); (semanas[lun] = semanas[lun] || {})[b.fecha] = (semanas[lun][b.fecha] || []).concat([b]); });
    Object.keys(semanas).sort().forEach((lun, wi) => {
      h += '<h4 class="cl-sem">Semana ' + (wi + 1) + ' · ' + u.fCorta(lun) + '</h4><div class="cl-dias">' + Object.keys(semanas[lun]).sort().map(f => {
        const bs = semanas[lun][f], lista = !!S.get('asis:' + g.id + ':' + f);
        return '<a class="cl-dia ' + (f === hoy ? 'hoy ' : '') + (f < hoy ? 'pasada' : '') + '" href="#/clase/' + f + '"><div class="cl-f"><b>' + u.DIAS3[u.dow(f)] + ' ' + u.fDM(f) + '</b>' + (f < hoy && lista ? ' <span class="okc">✓</span>' : '') + '</div>' +
          bs.map(b => '<div class="cl-b"><span class="muted small">' + b.inicio + ' · ' + b.horas + ' h</span> ' + (b.perdida ? '<s class="muted">sin clase</s>' : b.parts.map(x => '<span class="cl-dot ' + x.it.m + '"></span>' + esc(x.it.t)).join(' · ') || '<span class="muted">libre</span>') + '</div>').join('') + '</a>';
      }).join('') + '</div>';
    });
    h += '<p class="muted small mt">Toca un día para ver el guion. Si una clase no se dio, márcala en su día y todo se recorre. Con "⇄" cambias el orden de dos actividades (por ejemplo, si ese día no hay sala de cómputo).</p>';
    return { t: 'Clases', h: h };
  };
  const diaMini = rs => '<ul class="cl-mini">' + rs.map(r => '<li><b>' + r.b.inicio + '–' + r.b.fin + '</b> ' + esc(r.txt) + '</li>').join('') + '</ul>';

  /* ---------- vista: guion de un día ---------- */
  V.clase = f => {
    const g = D.grupoActual(); if (!g) return H.noGroup();
    f = f || u.today(); const d = K.dia(g, f);
    const ant = C.claseAnterior(g, f), sig = C.siguienteClase(g, f);
    let h = '<div class="datebar"><button type="button" class="iconbtn" data-act="go" data-to="clase/' + (ant || f) + '" ' + (ant ? '' : 'disabled') + ' aria-label="Clase anterior">' + icon('chevL') + '</button><div class="datebox"><b>' + u.cap(u.fLarga(f)) + '</b><a class="small" href="#/clases' + (d ? '/' + d.p.id : '') + '">Ver todas las clases</a></div><button type="button" class="iconbtn" data-act="go" data-to="clase/' + (sig || f) + '" ' + (sig ? '' : 'disabled') + ' aria-label="Clase siguiente">' + icon('chevR') + '</button></div>';
    if (!d || !d.bloques.length) return { t: 'Clase', h: h + card('<p>No tienes clase con ' + esc(g.nombre) + ' este día.</p>' + (sig ? link('Ir a la próxima clase', 'clase/' + sig, 'primary') : '')) };
    d.bloques.forEach(b => {
      h += card('<h3>' + b.inicio + '–' + b.fin + ' · ' + b.horas + ' h</h3>' +
        (b.perdida ? '<p class="muted">Marcaste que esta clase no se dio: sus actividades pasaron a la siguiente.</p>' : (b.parts.map(x => actHTML(g, d.p.id, x, b.key)).join('') || '<p class="muted">Ya no quedan actividades en la secuencia: úsala para repaso, recuperación o avance del proyecto.</p>')) +
        (b.libre && b.parts.length ? '<p class="note">Te sobra ' + b.libre + ' h en este bloque.</p>' : '') +
        '<div class="row end mt">' + btn(b.perdida ? '↺ Sí se dio esta clase' : 'Esta clase no se dio: recorrer', 'cl-perdida', 'data-key="' + b.key + '"', 'small ghost' + (b.perdida ? '' : ' danger')) + '</div>', 'cl-bloque');
    });
    h += '<div class="row gap wrap">' + link(icon('check') + ' Pasar lista', 'lista/' + f, 'primary') + btn(icon('book') + ' Anotar en bitácora', 'cl-bit', 'data-f="' + f + '"') + '</div>';
    return { t: 'Clase', h: h };
  };

  /* ---------- acciones ---------- */
  A['cl-perdida'] = el => { const g = D.grupoActual(), k = el.dataset.key; S.update('clases:' + g.id, st => { st.perdidas = st.perdidas || {}; if (st.perdidas[k]) delete st.perdidas[k]; else st.perdidas[k] = true; }, {}); };
  A['cl-swap'] = el => {
    const g = D.grupoActual(), pid = el.dataset.pid, pos = Number(el.dataset.pos), seq = K.seq(g, pid);
    if (pos >= seq.length - 1) { u.toast('Es la última actividad del parcial', 'err'); return; }
    const ord = seq.map(x => x.idx); const t = ord[pos]; ord[pos] = ord[pos + 1]; ord[pos + 1] = t;
    S.update('clases:' + g.id, st => { st.orden = st.orden || {}; st.orden[pid] = ord; }, {});
    u.toast('Cambié "' + seq[pos].t + '" por "' + seq[pos + 1].t + '"', 'ok', 4000);
  };
  A['cl-bit'] = el => {
    const g = D.grupoActual(), f = el.dataset.f, rs = K.resumenDia(g, f) || [], id = u.uid('bit');
    S.put('bit:' + id, { id: id, fecha: f, grupoId: g.id, texto: 'Clase: ' + rs.map(r => r.b.inicio + ' ' + r.txt).join(' | ') + '\nCómo salió: ' });
    location.hash = '#/bitacora';
  };
})();
