/* Escuadra · Clases: qué dar en cada clase. Secuencia hora por hora de cada submódulo, alineada con tu
   planeación (apertura, desarrollo y cierre) y con las actividades clave del programa SEP 2024.
   La app la acomoda sola en los bloques de tu horario según el lugar (aula, centro de cómputo o taller);
   si una clase no se da, todo se recorre. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, H = E.h;
  const card = H.card, btn = H.btn, link = H.link, icon = E.icon;

  /* id: clave · m: a = apertura, d = desarrollo, c = cierre · lugar: 'computo' (necesita computadoras) o 'taller'
     (práctica con herramientas; también se puede en el aula) · noComputo: no se hace en el centro de cómputo (agua,
     corte) · dep: actividades que deben estar terminadas antes (si son de otro lugar, la clase solo avisa) · firme: de esas,
     las que sí detienen la clase aunque sean de otro lugar (no se arma sin piezas cortadas, no se programa sin diagnóstico) · ac/dc: actividad clave y renglón de "desarrollo de la
     competencia" del programa · pasos: [minutos, qué hacer] (1 h de horario = 50 min) · pre: palabras para adelantar el tema */
  E.CLASES = {
    'II-2': [
      { id: 'encuadre', h: 3, m: 'a', tipo: 'Encuadre', t: 'Encuadre del parcial y examen diagnóstico', obj: 'Que conozcan cómo se les evalúa, las reglas del taller y el proyecto, y que muestren qué traen del Submódulo 1.', ac: null,
        pasos: [[20, 'Encuadre: Examen 50 · Libreta/Proyecto/Bitácora 40 · Asistencia 5 · Participación 5.'], [15, 'Reglamento de taller y roles de equipo.'], [10, 'Presenta el proyecto: garra o brazo articulado de cartón que levante un objeto ligero.'], [90, 'Examen diagnóstico de dibujo técnico y FreeCAD (Submódulo 1).'], [15, 'Dinámica: pasiones, frustraciones y visión.']],
        ev: 'Examen diagnóstico resuelto (Desempeño)', ideas: ['primer-dia', 'roles-equipo'], pre: 'evaluación · proyecto · roles' },
      { id: 'mochila', h: 1, m: 'a', tipo: 'Teoría', t: 'Los mecanismos que traes en la mochila', obj: 'Distinguir máquina de mecanismo y nombrar eslabones y pares en objetos reales.', ac: 1, dc: 0, tema: 'sm2-mecanismo',
        pasos: [[5, 'Reto: desarmar y armar su pluma de clic en 2 minutos.'], [10, 'Máquina, mecanismo, eslabones y pares (proyecta el tema).'], [15, 'Cacería en parejas: tabla en la libreta con 2 objetos de la mochila.'], [12, 'Al azar: 4 o 5 explican su objeto en 60 segundos.'], [8, 'Boleto de salida y tarea.']],
        tarea: 'Mecanismos en mi casa: 3 objetos (par giratorio, prismático y helicoidal) con dibujo esquemático. Reto: algo que convierta un giro en un ir y venir.', ideas: ['ing-inversa', 'pr-explica-60', 'boleto-salida'], pre: 'eslabón · par giratorio · par prismático' },
      { id: 'movimientos', h: 3, m: 'a', tipo: 'Teoría', t: 'Tipos de movimiento: del giro al vaivén', obj: 'Elegir el mecanismo según el movimiento que entra y el que se necesita.', ac: 1, dc: 0, tema: 'sm2-movimientos',
        pasos: [[15, 'Revisa la tarea: ¿quién encontró algo que gire y vaya y venga? (ventilador, máquina de coser, limpiaparabrisas).'], [25, 'Tema en proyector: giratorio, lineal, alternativo y oscilante.'], [20, 'La máquina misteriosa: video sin audio, ¿qué mecanismo hay adentro?'], [50, 'Lluvia de ideas por equipos con objetos reales: clasifican 10 mecanismos por movimiento de entrada y de salida en un cartel.'], [25, 'Galería: cada equipo explica 2 de sus mecanismos.'], [15, 'Mapa mental colectivo.']],
        ev: 'Cartel de clasificación de mecanismos (Producto)', tarea: 'Para el jueves: 6 tiras de cartón de 2 × 15 cm y 6 broches latonados por pareja.', ideas: ['pr-maquina-misteriosa', 'pr-camara-lenta', 'pr-mapa-mental'], pre: 'manivela · biela · balancín' },
      { id: 'planos', h: 1, m: 'd', tipo: 'Teoría', t: 'Leer un plano: vistas, líneas y cotas', obj: 'Interpretar las vistas y cotas de un plano sencillo.', ac: 0, dc: 2, tema: 'sm1-planos',
        pasos: [[10, 'Pregunta-reto: ¿qué pieza es? (muestra solo sus 3 vistas).'], [20, 'Tema en proyector: líneas, vistas, cotas y escalas.'], [15, 'En parejas: dibujan las 3 vistas de su goma o sacapuntas.'], [5, 'Boleto de salida.']],
        ideas: ['pregunta-reto', 'pr-error-del-dia'], pre: 'vista frontal · cota · escala' },
      { id: 'biela', h: 1, m: 'd', tipo: 'Teoría', t: 'Biela-manivela: del giro al vaivén', obj: 'Explicar cómo una biela-manivela convierte giro en movimiento alternativo.', ac: 1, dc: 0, tema: 'sm2-biela',
        pasos: [[5, 'Cámara lenta: un pistón o un juguete con manivela.'], [25, 'Tema en proyector.'], [15, 'Boceto en la libreta: una compuerta movida por biela-manivela.'], [5, 'Boleto de salida.']],
        ideas: ['pr-camara-lenta', 'biela-compuerta'], pre: 'biela · carrera · punto muerto' },
      { id: 'levas', h: 1, m: 'd', tipo: 'Teoría', t: 'Levas y seguidores', obj: 'Reconocer cómo una leva programa un movimiento.', ac: 1, dc: 0, tema: 'sm2-levas',
        pasos: [[5, 'Pregunta-reto: ¿cómo "sabe" la máquina de coser cuándo subir la aguja?'], [25, 'Tema en proyector.'], [15, 'Diseño rápido en la libreta: perfil de leva para un alimentador.'], [5, 'Boleto de salida.']],
        ideas: ['leva-alimentador', 'pregunta-reto'], pre: 'leva · seguidor · perfil' },
      { id: 'gdl', h: 2, m: 'd', tipo: 'Práctica', t: 'Grados de libertad con tiras de cartón', obj: 'Calcular la movilidad de un mecanismo y comprobarla armándolo.', ac: 2, dc: 0, tema: 'sm2-gdl',
        pasos: [[20, 'Tema: M = 3(n − 1) − 2·j1 − j2.'], [50, 'Taller: con tiras de cartón y broches latonados arman 3, 4 y 5 barras; predicen M y comprueban moviéndolo.'], [20, 'Puesta en común: ¿por qué el triángulo no se mueve? ¿por qué el de 5 barras necesita dos manos?'], [10, 'Boleto de salida.']],
        mat: 'Tiras de cartón de 2 × 15 cm, broches latonados, regla y perforadora.', ev: 'Tabla de predicción y comprobación en la libreta', ideas: ['pares-baratos', 'pr-pausa-predice'], pre: 'grados de libertad · base · par de un grado' },
      { id: 'fc-nivel', h: 2, m: 'd', lugar: 'computo', tipo: 'FreeCAD', t: 'Nivelación FreeCAD: bocetos con restricciones', obj: 'Hacer un boceto totalmente restringido de un eslabón.', ac: 1, dc: 1, tema: 'sm1-restricciones',
        pasos: [[10, 'Resultados del diagnóstico en pantalla, sin nombres: este es nuestro punto de partida.'], [20, 'Yo modelo, tú modelas: boceto de un eslabón con extremos redondos.'], [40, 'Restricciones (horizontal, vertical, coincidente, tangente, distancia, radio) hasta que el boceto quede en verde.'], [20, 'Mini-reto cronometrado: eslabón de 100 mm entre centros con dos barrenos de 5 mm.'], [10, 'Guardan con nombre correcto.']],
        nota: 'Sienta a los alumnos que necesitan apoyo junto a un monitor.', ideas: ['pr-diagnostico-visible', 'pr-freecad-espejo', 'mini-retos'], pre: 'boceto · restricción · totalmente restringido' },
      { id: 'fc-eslabones', h: 2, m: 'd', lugar: 'computo', tipo: 'FreeCAD', t: 'FreeCAD Part Design: eslabones con barrenos', obj: 'Modelar en 3D los eslabones de un cuatro barras con extrusiones y barrenos.', ac: 1, dc: 1, dep: ['fc-nivel'],
        pasos: [[30, 'Yo modelo, tú modelas: Pad (extrusión), Pocket (vaciado) y barrenos.'], [50, 'Modelan base, eslabón motriz, conector y conducido de un cuatro barras.'], [15, 'Revisión por parejas con lista de cotejo.'], [5, 'Boleto de salida.']],
        ev: 'Eslabones modelados (Producto)', ideas: ['pr-freecad-espejo', 'semaforo'], pre: 'Pad · Pocket · barreno' },
      { id: 'grashof', h: 3, m: 'd', tipo: 'Práctica', t: 'Cuatro barras y ley de Grashof', obj: 'Predecir con números si un mecanismo de cuatro barras dará vueltas completas.', ac: 2, dc: 0, tema: 'sm2-4barras',
        pasos: [[30, 'Tema en proyector: Grashof y tipos de cuatro barras.'], [20, 'Simulador PMKS+ en el proyector: cambian longitudes y observan.'], [60, 'Reto Grashof: cada equipo recibe medidas, predice el tipo y luego lo arma con cartón.'], [25, 'Galería de errores: casos que no salieron como predijeron.'], [15, 'Bitácora: qué predije, qué pasó y por qué.']],
        ev: 'Cuatro barras de cartón con predicción correcta (Desempeño)', ideas: ['grashof', 'pr-linkage-sim', 'galeria-errores'], pre: 'manivela · balancín · acoplador · Grashof' },
      { id: 'engranes', h: 1, m: 'd', tipo: 'Teoría', t: 'Engranes y relación de transmisión', obj: 'Calcular la relación de transmisión y el sentido de giro de un par de engranes.', ac: 1, dc: 0, tema: 'sm2-engranes',
        pasos: [[5, 'Pregunta-reto: ¿por qué cambias de velocidad en la bici?'], [25, 'Tema: i = Z2/Z1, sentido de giro y distancia entre centros.'], [15, 'Ejercicios en parejas.'], [5, 'Votación con tarjetas para revisar.']],
        ideas: ['engranes-carton', 'pr-plickers'], pre: 'piñón · rueda · relación de transmisión' },
      { id: 'proyecto', h: 3, m: 'd', tipo: 'Proyecto', t: 'Proyecto: equipos, idea y esquema cinemático', obj: 'Definir el diseño del mecanismo del equipo: base, eslabón motriz, conector y conducido.', ac: 2, dc: 0,
        pasos: [[15, 'Equipos equilibrados (Perfiles) y roles rotativos.'], [20, 'El reto: garra o brazo articulado que levante un objeto ligero; criterios de la rúbrica.'], [45, 'Bocetos: cada integrante propone y eligen uno.'], [40, 'Esquema cinemático con base, motriz, conector y conducido; calculan M.'], [20, 'Lista de piezas con medidas aproximadas.'], [10, 'Semáforo de avance.']],
        ev: 'Boceto y esquema cinemático del proyecto (Producto)', tarea: 'Conseguir cartón grueso y broches latonados o tornillos M3 con tuerca.', ideas: ['roles-equipo', 'semaforo', 'bloque-3h'], pre: 'esquema cinemático · eslabón motriz · conducido' },
      { id: 'prototipo', h: 2, m: 'd', lugar: 'taller', tipo: 'Taller', t: 'Prototipo rápido de cartón: probar la idea', obj: 'Comprobar con un prototipo burdo que el mecanismo se mueve como esperan, antes de modelarlo.', ac: 2, dc: 1, dep: ['proyecto'],
        pasos: [[10, 'Por qué los ingenieros prueban en cartón antes de fabricar.'], [70, 'Arman un prototipo a mano con tiras y broches; miden qué longitudes funcionan.'], [20, 'Anotan en la bitácora las medidas que sí funcionaron.']],
        mat: 'Cartón, tijeras, broches latonados, regla.', ideas: ['pares-baratos', 'bitacora-fallas'], pre: 'prototipo · medida · prueba' },
      { id: 'poleas', h: 1, m: 'd', tipo: 'Teoría', t: 'Poleas, bandas y cadenas', obj: 'Calcular velocidades en transmisiones por polea.', ac: 1, dc: 0, tema: 'sm2-poleas',
        pasos: [[5, 'Pregunta-reto: ¿qué tienen en común una lavadora y una bici?'], [25, 'Tema en proyector.'], [15, 'Ejercicios: relación de poleas.'], [5, 'Boleto de salida.']],
        pre: 'polea motriz · polea conducida · banda' },
      { id: 'croquis', h: 2, m: 'd', tipo: 'Proyecto', t: 'Croquis acotado de las piezas y materiales', obj: 'Dejar listas las medidas de cada pieza y su material para modelarlas el viernes.', ac: 2, dc: 1, tema: 'sm2-materiales', dep: ['prototipo'],
        pasos: [[20, 'Tema: cartón, MDF y plástico; impacto ecológico.'], [60, 'Croquis acotado de cada pieza a partir del prototipo: largo, ancho, espesor y centros de barrenos.'], [20, 'Revisión: ¿alcanza para modelar sin adivinar medidas?']],
        ev: 'Croquis acotado de las piezas (Producto)', pre: 'croquis · cota · espesor' },
      { id: 'fc-piezas', h: 4, m: 'd', lugar: 'computo', tipo: 'FreeCAD', t: 'FreeCAD: piezas del proyecto', obj: 'Modelar en 3D todas las piezas del mecanismo del equipo a partir del croquis.', ac: 2, dc: 0, dep: ['fc-eslabones', 'croquis'],
        pasos: [[10, 'Revisión rápida del croquis de cada equipo.'], [160, 'Cada integrante modela sus piezas con las medidas del croquis.'], [20, 'Revisión cruzada de medidas.'], [10, 'Guardan todo en una carpeta del equipo y semáforo.']],
        ev: 'Piezas del proyecto modeladas (Producto)', ideas: ['semaforo', 'mini-retos'], pre: 'pieza · medida · barreno' },
      { id: 'ing-inversa', h: 3, m: 'd', lugar: 'taller', tipo: 'Práctica', t: 'Ingeniería inversa de un mecanismo real', obj: 'Desarmar un objeto, identificar eslabones y pares, y dibujar su esquema.', ac: 1, dc: 0,
        pasos: [[15, 'Reglas: desarmar con cuidado, fotografiar cada paso, no perder piezas.'], [80, 'Por equipo desarman una engrapadora, un juguete o un cortaúñas; identifican eslabones, pares y tipo de movimiento.'], [35, 'Dibujan su esquema cinemático y lo vuelven a armar.'], [20, 'Galería: cada equipo explica su objeto.']],
        mat: 'Objetos que traigan de casa (con permiso), desarmadores.', ideas: ['ing-inversa', 'pr-camara-doc'], pre: 'desarmar · esquema · par' },
      { id: 'tornillo', h: 1, m: 'd', tipo: 'Teoría', t: 'Tornillo-tuerca y piñón-cremallera', obj: 'Explicar cómo se convierte un giro en avance lineal.', ac: 1, dc: 0, tema: 'sm2-tornillo',
        pasos: [[5, 'Objeto en mano: gato de tijera o prensa.'], [25, 'Tema en proyector.'], [15, 'Ejercicios: avance por vuelta.'], [5, 'Boleto de salida.']],
        pre: 'paso · cremallera · avance' },
      { id: 'seguridad', h: 1, m: 'd', tipo: 'Taller', t: 'Seguridad en el taller', obj: 'Usar cúter, segueta y regla metálica de forma segura.', ac: 2, dc: 2, tema: 'sm2-seguridad',
        pasos: [[10, '5 minutos de seguridad: dirección de corte y posición de las manos.'], [20, 'Tema: equipo de protección y reglas.'], [15, 'Demostración de corte seguro.'], [5, 'Firman el reglamento.']],
        ev: 'Reglamento firmado', ideas: ['seguridad-cuter'], pre: 'EPP · dirección de corte' },
      { id: 'repaso-medio', h: 1, m: 'd', tipo: 'Evaluación', t: 'Repaso de medio parcial', obj: 'Revisar qué temas ya dominan y cuáles no, a tiempo.', ac: null,
        pasos: [[35, '"¿Quién quiere ser técnico?" con los temas vistos.'], [15, 'Semáforo personal: qué tema necesito repasar.']], ideas: ['pr-quien-quiere'] },
      { id: 'error', h: 1, m: 'd', tipo: 'Formación', t: 'El error es información', obj: 'Ver los errores del proyecto como datos para mejorar.', ac: null, tema: 'gen-mentalidad',
        pasos: [[5, 'Historia de un error famoso.'], [25, 'Tema en proyector.'], [15, 'Bitácora: mi error de la semana y qué aprendí.'], [5, 'Boleto de salida.']],
        ideas: ['pr-error-del-dia', 'bitacora-fallas'], pre: 'todavía · error · bitácora' },
      { id: 'fc-ensamble', h: 2, m: 'd', lugar: 'computo', tipo: 'FreeCAD', t: 'Ensamble, movimiento y colisiones en FreeCAD', obj: 'Ensamblar las piezas con uniones y verificar que se mueven sin chocar antes de fabricar.', ac: 0, dc: 1, tema: 'sm2-explosionada', dep: ['fc-piezas'],
        pasos: [[15, 'Yo modelo, tú modelas: Assembly, pieza fija y uniones (fija, giratoria, deslizante).'], [55, 'Ensamblan su proyecto y lo mueven arrastrando la manivela.'], [20, 'Detectan choques y corrigen medidas.'], [10, 'Bitácora: qué chocó y cómo lo corrigieron.']],
        ev: 'Ensamble que se mueve sin colisiones (Desempeño)', ideas: ['fc-ensamble-explosionada', 'bitacora-fallas'], pre: 'ensamble · unión giratoria · colisión' },
      { id: 'fc-plano', h: 2, m: 'd', lugar: 'computo', tipo: 'FreeCAD', t: 'Plano en vista explosionada y plantillas 1:1', obj: 'Obtener el plano del ensamble en vista explosionada y las plantillas para cortar.', ac: 0, dc: 2, dep: ['fc-ensamble'],
        pasos: [[15, 'Vista explosionada en Assembly.'], [50, 'TechDraw: vistas, cotas principales, cuadro de datos (nombre, escala, material) y lista de piezas.'], [25, 'Plantillas 1:1 de cada pieza; verifican la escala con regla al imprimir.'], [10, 'Exportan a PDF.']],
        ev: 'Plano del ensamble en vista explosionada (Producto · actividad clave)', ideas: ['fc-ensamble-explosionada', 'fc-plantillas'], pre: 'vista explosionada · cuadro de datos · escala 1:1' },
      { id: 'corte', h: 3, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Taller', t: 'Trazado y corte con plantillas 1:1', obj: 'Pasar las piezas del CAD al material y cortarlas con seguridad.', ac: 1, dc: 1, dep: ['fc-plano', 'seguridad'],
        pasos: [[10, '5 minutos de seguridad.'], [40, 'Pegan plantillas en cartón o MDF, trazan y marcan centros de barrenos.'], [90, 'Corte supervisado; verifican medidas contra el plano.'], [10, 'Limpieza.']],
        mat: 'Plantillas impresas, cartón grueso, pegamento en barra, cúter, regla metálica y base para cortar.', ev: 'Piezas cortadas con dimensiones correctas (Producto) y uso seguro de herramientas (Desempeño)', ideas: ['seguridad-cuter'], pre: 'plantilla · trazo · centro de barreno' },
      { id: 'revision-plano', h: 1, m: 'd', tipo: 'Evaluación', t: 'Revisión de planos y bitácora', obj: 'Corregir el plano con retroalimentación concreta.', ac: 0, dc: 2, dep: ['fc-plano'],
        pasos: [[10, 'Galería de planos impresos.'], [30, 'Retroalimentación con lista de cotejo; anotan correcciones.'], [10, 'Bitácora.']],
        ideas: ['galeria-errores', 'coevaluacion'] },
      { id: 'ensamble', h: 3, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Taller', t: 'Perforación y ensamble con pares de enlace', obj: 'Ensamblar el mecanismo con pares giratorios que permitan su movimiento.', ac: 2, dc: 3, dep: ['corte'],
        pasos: [[15, 'Demostración: par giratorio con tornillo M3 y tuerca o broche latonado; la holgura importa.'], [110, 'Perforan y ensamblan su mecanismo.'], [25, 'Primera prueba de movimiento y bitácora.']],
        ideas: ['pares-baratos', 'bitacora-fallas'], pre: 'par giratorio · holgura · tuerca' },
      { id: 'pruebas', h: 2, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Taller', t: 'Ensamble y primeras pruebas', obj: 'Lograr que el mecanismo levante el objeto.', ac: 2, dc: 3, dep: ['ensamble'],
        pasos: [[80, 'Terminan el ensamble y prueban levantar el objeto.'], [20, 'Semáforo y bitácora.']], ideas: ['semaforo'] },
      { id: 'galeria', h: 1, m: 'd', tipo: 'Evaluación', t: 'Galería de errores del ensamble', obj: 'Aprender de las fallas de todos los equipos.', ac: null,
        pasos: [[35, 'Cada equipo muestra una falla y cómo la resolvió (o no).'], [15, 'Lista común de "trucos" para el ajuste.']], ideas: ['galeria-errores', 'pr-camara-doc'] },
      { id: 'ajustes', h: 2, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Taller', t: 'Ajustes: sin colisiones ni trabas', obj: 'Corregir holguras y refuerzos hasta que el mecanismo funcione suave.', ac: 2, dc: 3, dep: ['pruebas'],
        pasos: [[80, 'Ajustan holguras, refuerzan piezas y prueban.'], [20, 'Bitácora.']], ideas: ['bitacora-fallas'] },
      { id: 'acabado', h: 3, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Proyecto', t: 'Acabado, prueba final y ensayo de defensa', obj: 'Dejar el mecanismo listo y practicar cómo explicarlo.', ac: 2, dc: 3, dep: ['ajustes'],
        pasos: [[90, 'Acabado y prueba de funcionamiento con el objeto.'], [40, 'Ensayo de defensa: 2 minutos por equipo.'], [20, 'Retroalimentación de compañeros.']],
        ideas: ['pr-explica-60', 'coevaluacion'] },
      { id: 'repaso-final', h: 1, m: 'd', tipo: 'Evaluación', t: 'Repaso final y dudas', obj: 'Llegar al examen con las fórmulas claras: M, Grashof e i.', ac: null,
        pasos: [[10, 'Pregunta-reto.'], [30, 'Repaso de fórmulas y ejercicios tipo examen.'], [10, 'Un minuto para respirar: cómo llegar tranquilo al examen.']], ideas: ['pr-plickers', 'pr-respira'] },
      { id: 'expo', h: 3, m: 'c', noComputo: true, tipo: 'Proyecto', t: 'Exposición de proyectos y pruebas de funcionamiento', obj: 'Demostrar el mecanismo funcionando y defenderlo.', ac: 2, dc: 3,
        pasos: [[10, 'Montaje.'], [120, 'Cada equipo: 5 minutos de defensa y prueba en vivo; evalúas con rúbrica.'], [20, 'Retroalimentación.']],
        ev: 'Mecanismo funcionando sin colisiones (Producto) y defensa (Desempeño)', ideas: ['coevaluacion'] },
      { id: 'expo2', h: 2, m: 'c', noComputo: true, tipo: 'Proyecto', t: 'Exposición (continuación) y coevaluación', obj: 'Terminar exposiciones y evaluarse entre compañeros.', ac: 2, dc: 3,
        pasos: [[70, 'Equipos restantes.'], [30, 'Coevaluación con lista de cotejo.']], ideas: ['coevaluacion'] },
      { id: 'plenaria', h: 1, m: 'c', tipo: 'Evaluación', t: 'Plenaria de resultados', obj: 'Reflexionar qué funcionó y qué fallaría en la industria.', ac: null,
        pasos: [[10, 'Muro de logros.'], [30, 'Plenaria: qué funcionó, qué mejorarían, qué fallaría en una planta.'], [10, 'Entrega de bitácoras.']],
        ev: 'Bitácora de fallas y ajustes (Producto)', ideas: ['pr-muro-logros', 'pr-mapa-mental'] },
      { id: 'examen', h: 2, m: 'c', tipo: 'Evaluación', t: 'Examen del 2º parcial', obj: 'Evaluar lo aprendido en el submódulo.', ac: null,
        pasos: [[5, 'Un minuto para respirar.'], [85, 'Examen.'], [10, 'Recoge y cierra.']], ev: 'Examen del parcial', ideas: ['pr-respira'] },
      { id: 'retro', h: 3, m: 'c', tipo: 'Evaluación', t: 'Retroalimentación del examen y pendientes', obj: 'Aprender de los errores del examen y cerrar evidencias (en cómputo pueden corregir sus planos).', ac: null,
        pasos: [[40, 'Errores comunes del examen en pantalla, sin nombres.'], [80, 'Recuperación de evidencias pendientes y corrección de planos en FreeCAD.'], [30, 'Revisión de calificaciones con cada alumno.']], ideas: ['galeria-errores'] },
      { id: 'meta', h: 1, m: 'c', tipo: 'Formación', t: 'Autoevaluación y meta para el 3er parcial', obj: 'Cerrar el parcial con una meta personal.', ac: null,
        pasos: [[20, 'Autoevaluación.'], [20, 'Lo que viene: neumática e hidráulica; su mecanismo será la base de la grúa.'], [10, 'Meta personal en la libreta.']],
        tarea: 'Guardar el mecanismo: será la base de la grúa del 3er parcial.', ideas: ['pr-yo-25'] }
    ],
    'II-3': [
      { id: 'encuadre3', h: 3, m: 'a', tipo: 'Encuadre', t: 'Encuadre del 3er parcial y cuestionario diagnóstico', obj: 'Presentar el proyecto de la grúa y conocer qué saben de fluidos y circuitos.', ac: null,
        pasos: [[15, 'Encuadre y criterios de evaluación.'], [25, 'Pregunta-reto: ¿cómo levanta una retroexcavadora dos toneladas? Lluvia de ideas: frenos, prensas, sillas de dentista.'], [20, 'El proyecto: grúa mecatrónica hidráulica y motorizada sobre su mecanismo del 2º parcial.'], [60, 'Cuestionario diagnóstico: fluidos, Pascal y circuitos.'], [30, 'Equipos (Perfiles) y lista de materiales.']],
        ev: 'Cuestionario diagnóstico contestado (Desempeño)', tarea: 'Conseguir 4 jeringas (2 de 10 ml y 2 de 20 ml), 1 m de manguera, motor DC de 3 a 5 V, portapilas e interruptor.', ideas: ['pregunta-reto', 'industria-real'], pre: 'fluido · presión · hidráulica' },
      { id: 'presion', h: 1, m: 'a', tipo: 'Teoría', t: 'Presión: fuerza sobre área', obj: 'Calcular presión y convertir sus unidades.', ac: 0, dc: 0, tema: 'sm3-presion',
        pasos: [[5, 'Pregunta: ¿por qué duele más el pisotón de un tacón que el de un tenis?'], [25, 'Tema en proyector.'], [15, 'Ejercicios de conversión: Pa, bar y psi.'], [5, 'Boleto de salida.']], pre: 'presión · área · bar' },
      { id: 'pascal', h: 3, m: 'a', noComputo: true, tipo: 'Práctica', t: 'Principio de Pascal con jeringas', obj: 'Comprobar con jeringas que la fuerza se multiplica con la relación de áreas.', ac: 0, dc: 0, tema: 'sm3-pascal',
        pasos: [[20, 'Tema en proyector.'], [15, 'Simulación PhET "Bajo presión" en el proyector.'], [70, 'Práctica: jeringas de 10 y 20 ml conectadas; miden diámetros y calculan F2 = F1·A2/A1.'], [30, 'Conclusiones y bitácora.'], [15, 'Boleto de salida.']],
        mat: 'Jeringas de 10 y 20 ml, manguera, agua con colorante, regla o vernier.', ev: 'Reporte de la práctica de Pascal (Producto)', ideas: ['pascal-jeringas', 'pr-phet-presion'], pre: 'Pascal · émbolo · relación de áreas' },
      { id: 'comparativa', h: 2, m: 'a', tipo: 'Proyecto', t: 'Neumática, hidráulica o eléctrica: ¿cuál uso?', obj: 'Decidir qué tecnología mueve cada parte de la grúa.', ac: 1, dc: 0, tema: 'sm3-comparativa',
        pasos: [[10, 'Jeringa de aire contra jeringa de agua.'], [35, 'Tema en proyector.'], [45, 'Equipos: bocetan su grúa y deciden qué mueve cada eje (hidráulica o motor).'], [10, 'Semáforo de avance.']], ideas: ['aire-vs-agua'], pre: 'neumática · hidráulica · compresible' },
      { id: 'unidades', h: 1, m: 'd', tipo: 'Teoría', t: 'Taller de unidades y conversiones', obj: 'Convertir unidades de fuerza, presión, área y caudal sin errores.', ac: 0, dc: 0,
        pasos: [[10, 'Repaso: N, Pa, bar, psi, mm², cm³ y L/min.'], [30, 'Ejercicios en parejas.'], [10, 'Votación con tarjetas para revisar.']], ideas: ['pr-plickers'], pre: 'N · Pa · bar · psi' },
      { id: 'aire', h: 2, m: 'd', tipo: 'Teoría', t: 'Del compresor al cilindro', obj: 'Reconocer los elementos de un sistema neumático y su función.', ac: 0, dc: 1, tema: 'sm3-aire',
        pasos: [[40, 'Tema en proyector.'], [20, 'Lee un catálogo industrial real.'], [30, 'Esquema en la libreta: compresor, unidad de mantenimiento, válvula y cilindro.'], [10, 'Boleto de salida.']], ideas: ['pr-catalogo-real'], pre: 'compresor · unidad de mantenimiento · cilindro' },
      { id: 'cilindros', h: 3, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Cilindros: cálculo de fuerza en hoja de cálculo', obj: 'Calcular la fuerza de avance y retroceso de un cilindro y automatizarlo en una hoja de cálculo.', ac: 1, dc: 0, tema: 'sm3-cilindros',
        pasos: [[40, 'Tema y ejemplo resuelto en proyector.'], [60, 'Hoja de cálculo: diámetro, vástago y presión → fuerza de avance y retroceso.'], [30, 'Usan su hoja para medir y calcular la fuerza de sus jeringas.'], [20, 'Problemas: elegir el cilindro para una carga.']],
        ev: 'Hoja de cálculo de fuerzas (Producto)', pre: 'émbolo · vástago · simple y doble efecto' },
      { id: 'caudal', h: 1, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Caudal y velocidad del cilindro', obj: 'Relacionar caudal y velocidad (Q = A · v) con su hoja de cálculo.', ac: 1, dc: 0, dep: ['cilindros'],
        pasos: [[15, 'Q = A · v con un ejemplo.'], [25, 'Agregan caudal y velocidad a su hoja de cálculo.'], [10, 'Boleto de salida.']], ideas: ['caudal-cronometro'], pre: 'caudal · velocidad · L/min' },
      { id: 'valvulas', h: 3, m: 'd', tipo: 'Teoría', t: 'Válvulas: vías, posiciones y accionamientos', obj: 'Nombrar válvulas por vías y posiciones y leer su símbolo.', ac: 0, dc: 1, tema: 'sm3-valvulas',
        pasos: [[50, 'Tema en proyector.'], [40, 'Memorama de simbología ISO 1219.'], [40, 'Ejercicios: nombrar válvulas en diagramas.'], [20, 'Boleto de salida.']], ideas: ['memorama-iso'], pre: 'vía · posición · 3/2 · 5/2' },
      { id: 'iso', h: 1, m: 'd', tipo: 'Teoría', t: 'Diagramas con ISO 1219', obj: 'Dibujar un circuito básico con símbolos normalizados.', ac: 0, dc: 1, tema: 'sm3-iso1219',
        pasos: [[30, 'Tema en proyector.'], [15, 'Primer diagrama: cilindro de simple efecto con válvula 3/2.'], [5, 'Boleto de salida.']], pre: 'símbolo · línea de trabajo · escape' },
      { id: 'leer-planos', h: 3, m: 'd', tipo: 'Práctica', t: 'Leer planos neumáticos e hidráulicos', obj: 'Reconocer sistemas en un plano con su simbología, unidades y presiones.', ac: 0, dc: 1,
        pasos: [[20, 'El error del día: un diagrama mal dibujado.'], [60, 'Escape room de simbología.'], [50, 'En equipo leen planos reales: identifican componentes, unidades y presiones.'], [20, 'Plenaria.']],
        ev: 'Interpretación de planos (Producto · actividad clave)', ideas: ['pr-escape-iso', 'pr-error-del-dia'], pre: 'plano · simbología · presión de trabajo' },
      { id: 'electro', h: 2, m: 'd', tipo: 'Teoría', t: 'Electroneumática: mando eléctrico', obj: 'Explicar cómo un botón mueve un cilindro a través de un relevador y un solenoide.', ac: 2, dc: 0, tema: 'sm3-electro',
        pasos: [[40, 'Tema en proyector.'], [40, 'Ejemplos: botón → relevador → solenoide; enclavamiento.'], [20, 'Boleto de salida.']], pre: 'solenoide · relevador · contacto NA' },
      { id: 'seguridad3', h: 1, m: 'd', tipo: 'Taller', t: 'Seguridad con fluidos y electricidad', obj: 'Trabajar con presión, mangueras y pilas sin riesgos.', ac: 3, dc: 0,
        pasos: [[10, 'Casos reales de accidentes, sin morbo.'], [25, 'Reglas: presión, mangueras, pilas en corto y equipo de protección (NOM-017-STPS).'], [15, 'Firman el reglamento del proyecto.']], ideas: ['seguridad-cuter'], pre: 'EPP · corto circuito · presión' },
      { id: 'escalera', h: 2, m: 'd', tipo: 'Práctica', t: 'Diagrama de escalera en papel', obj: 'Dibujar el diagrama de escalera del motor de la grúa.', ac: 2, dc: 0, dep: ['electro'],
        pasos: [[20, 'Reglas del diagrama de escalera.'], [60, 'Dibujan el circuito del motor: interruptor, motor e inversión de giro.'], [20, 'Revisión cruzada entre equipos.']],
        ev: 'Diagrama de escalera en la libreta (Producto)', ideas: ['escalera-papel'], pre: 'escalera · riel · bobina' },
      { id: 'simulador', h: 3, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Circuitos neumáticos en la computadora', obj: 'Elaborar los diagramas de circuitos básicos en la computadora y probarlos (simulador si lo hay).', ac: 1, dc: 1, dep: ['valvulas', 'iso'],
        pasos: [[20, 'Demostración: con el simulador del plantel si lo hay; si no, dibujan los diagramas ISO 1219 en la computadora y los validan con "Pausa y predice".'], [100, 'Cilindro de simple efecto con válvula 3/2 y de doble efecto con válvula 5/2; predicen y comprueban.'], [30, 'Guardan e imprimen sus diagramas.']],
        ev: 'Elementos diseñados en simulador (Producto · actividad clave)', ideas: ['pr-pausa-predice'], pre: 'simulador · 3/2 · 5/2' },
      { id: 'phet-motor', h: 1, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Simula el circuito del motor antes de cablear', obj: 'Probar en PhET el circuito con pila, interruptor y motor antes de armarlo.', ac: 2, dc: 0, dep: ['escalera'],
        pasos: [[10, 'Abren PhET "Kit de construcción de circuitos: CD".'], [30, 'Arman su circuito y prueban qué pasa con un corto.'], [10, 'Captura de pantalla a su bitácora.']], ideas: ['pr-phet-circuitos'], pre: 'circuito · corto · polaridad' },
      { id: 'motor', h: 3, m: 'd', lugar: 'taller', tipo: 'Práctica', t: 'Motor de CD e inversión de giro', obj: 'Conectar un motor de CD y cambiar su sentido de giro sin cortos.', ac: 2, dc: 0, tema: 'sm3-motordc', dep: ['escalera'],
        pasos: [[30, 'Tema en proyector.'], [100, 'Práctica: motor, portapilas e interruptor; invierten el giro.'], [20, 'Bitácora y limpieza.']],
        mat: 'Motor DC de 3 a 5 V, portapilas AA, interruptor de doble polo, cable, cinta de aislar.', ev: 'Circuito eléctrico funcionando sin cortos (Desempeño)', ideas: ['inversion-giro'], pre: 'polaridad · corto circuito · doble polo' },
      { id: 'fallas', h: 1, m: 'd', tipo: 'Teoría', t: 'Método para diagnosticar fallas', obj: 'Ir del síntoma a la causa con un método.', ac: 3, dc: 1, tema: 'sm3-fallas',
        pasos: [[30, 'Tema en proyector.'], [15, 'Casos: síntoma → causa → solución.'], [5, 'Boleto de salida.']], pre: 'síntoma · causa · solución' },
      { id: 'diseno-grua', h: 3, m: 'd', tipo: 'Proyecto', t: 'Diseño de la grúa: cálculos y boceto', obj: 'Seleccionar jeringas y calcular la fuerza para la carga de la grúa.', ac: 1, dc: 0, dep: ['cilindros'],
        pasos: [[20, 'Requisito: levantar y mover una carga ligera (define cuántos gramos).'], [60, 'Cálculo: fuerza necesaria, jeringas y relación de áreas (usan su hoja de cálculo).'], [50, 'Boceto con medidas sobre el mecanismo del 2º parcial.'], [20, 'Lista final de materiales.']],
        ev: 'Memoria de cálculo y boceto (Producto)', pre: 'carga · relación de áreas · selección' },
      { id: 'diagrama-grua', h: 2, m: 'd', tipo: 'Práctica', t: 'Diagrama hidráulico de la grúa', obj: 'Dibujar el circuito de su grúa con simbología ISO 1219.', ac: 0, dc: 1, dep: ['diseno-grua'],
        pasos: [[70, 'Dibujan el circuito hidráulico de su grúa en la libreta.'], [30, 'Revisión cruzada y correcciones.']], ev: 'Diagrama hidráulico en la libreta (Producto)' },
      { id: 'repaso-calc', h: 1, m: 'd', tipo: 'Evaluación', t: 'Repaso de cálculos', obj: 'Repasar presión, Pascal y fuerza jugando.', ac: null,
        pasos: [[40, '"¿Quién quiere ser técnico?" con presión, Pascal y fuerza.'], [10, 'Dudas.']], ideas: ['pr-quien-quiere'] },
      { id: 'montaje', h: 2, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Taller', t: 'Montaje hidráulico: sellado y purgado', obj: 'Conectar jeringas y mangueras sin aire ni fugas.', ac: 2, dc: 1, dep: ['diagrama-grua', 'seguridad3'],
        pasos: [[15, 'Demostración: llenar con agua y colorante sin burbujas.'], [70, 'Montaje: jeringas, manguera y sujeción a la estructura.'], [15, 'Prueba de fugas y bitácora.']],
        mat: 'Jeringas, manguera, agua con colorante, cinchos, silicón y trapos.', ev: 'Instalación hidráulica purgada sin fugas (Desempeño)', ideas: ['bitacora-fallas'], pre: 'purgar · fuga · sellado' },
      { id: 'montaje2', h: 3, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Taller', t: 'Montaje hidráulico y circuito del motor', obj: 'Terminar la hidráulica e instalar el motor según su diagrama de escalera.', ac: 2, dc: 1, dep: ['montaje', 'motor'],
        pasos: [[80, 'Terminan el montaje hidráulico y prueban cada eje.'], [60, 'Instalan motor, portapilas e interruptor según su diagrama.'], [10, 'Bitácora.']] },
      { id: 'bitacora3', h: 1, m: 'd', tipo: 'Evaluación', t: 'Bitácora técnica y revisión de avances', obj: 'Revisar la bitácora y planear lo que falta.', ac: 3, dc: 1,
        pasos: [[30, 'Revisión de bitácoras con lista de cotejo.'], [20, 'Plan de trabajo para terminar.']], ideas: ['bitacora-fallas'] },
      { id: 'integracion', h: 3, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Proyecto', t: 'Integración con el mecanismo del 2º parcial', obj: 'Unir estructura, hidráulica y motor en una sola grúa.', ac: 2, dc: 1, dep: ['montaje2'],
        pasos: [[130, 'Integran estructura, hidráulica y motor.'], [20, 'Prueba en vacío.']], ideas: ['semaforo'] },
      { id: 'opera', h: 2, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Práctica', t: 'Opera el circuito', obj: 'Operar la grúa con seguridad y registrar su desempeño.', ac: 3, dc: 0, dep: ['integracion'],
        pasos: [[10, 'Reglas de operación segura.'], [70, 'Operan: suben, bajan y giran; registran tiempos y carga.'], [20, 'Bitácora.']] },
      { id: 'ensayo', h: 1, m: 'd', tipo: 'Proyecto', t: 'Ensayo de defensa oral', obj: 'Explicar su grúa en 2 minutos con claridad.', ac: null,
        pasos: [[40, 'Pitch de 2 minutos por equipo.'], [10, 'Retroalimentación.']], ideas: ['pr-explica-60'] },
      { id: 'pruebas3', h: 2, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Taller', t: 'Pruebas y corrección de fallas', obj: 'Validar el funcionamiento con carga y corregir fallas.', ac: 3, dc: 1, dep: ['opera'],
        pasos: [[80, 'Prueban con carga; corrigen fugas, trabas y falsos contactos.'], [20, 'Bitácora.']], ev: 'Sistema en funcionamiento (Producto · actividad clave)' },
      { id: 'doc-grua', h: 3, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Documentación técnica: plano de la grúa en FreeCAD', obj: 'Hacer el plano "como quedó" de la grúa y su lista de materiales.', ac: 0, dc: 1, dep: ['integracion'],
        pasos: [[20, 'Qué es un plano "como quedó" (as-built) y para qué sirve en la industria.'], [100, 'Modelan la estructura y los soportes de las jeringas; plano con medidas y lista de materiales.'], [30, 'Exportan a PDF para su portafolio.']],
        ev: 'Plano de la grúa (Producto)', ideas: ['pr-antes-despues'], pre: 'plano como quedó · lista de materiales' },
      { id: 'presentacion', h: 1, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Presentación digital para la feria', obj: 'Preparar 3 diapositivas que expliquen su grúa.', ac: null, dep: ['doc-grua'],
        pasos: [[40, 'Tres diapositivas: problema, cómo funciona (diagrama) y resultados de las pruebas.'], [10, 'Guardan y comparten.']] },
      { id: 'carga1', h: 3, m: 'c', lugar: 'taller', noComputo: true, tipo: 'Evaluación', t: 'Pruebas con carga (equipos 1 a 3)', obj: 'Evaluar el funcionamiento de la grúa con rúbrica.', ac: 3, dc: 0,
        pasos: [[10, 'Montaje.'], [120, 'Prueba con rúbrica: levanta, mueve y deposita la carga.'], [20, 'Retroalimentación.']], ev: 'Grúa operando correctamente (Producto)' },
      { id: 'correccion', h: 1, m: 'c', lugar: 'taller', noComputo: true, tipo: 'Taller', t: 'Corrección de fallas en tiempo real', obj: 'Resolver fallas detectadas en las pruebas.', ac: 3, dc: 1,
        pasos: [[45, 'Corrigen lo detectado en las pruebas.'], [5, 'Bitácora.']] },
      { id: 'carga2', h: 3, m: 'c', lugar: 'taller', noComputo: true, tipo: 'Evaluación', t: 'Pruebas con carga (equipos 4 a 6)', obj: 'Evaluar el funcionamiento de la grúa con rúbrica.', ac: 3, dc: 0,
        pasos: [[10, 'Montaje.'], [120, 'Prueba con rúbrica.'], [20, 'Retroalimentación.']], ev: 'Grúa operando correctamente (Producto)' },
      { id: 'bitacoras', h: 2, m: 'c', tipo: 'Evaluación', t: 'Entrega y revisión de bitácoras', obj: 'Cerrar la bitácora técnica de fallas y soluciones.', ac: 3, dc: 1,
        pasos: [[60, 'Completan y entregan su bitácora.'], [40, 'Revisión con lista de cotejo.']], ev: 'Bitácora técnica de fallas y soluciones (Producto)' },
      { id: 'repaso3', h: 1, m: 'c', tipo: 'Evaluación', t: 'Repaso para el examen', obj: 'Llegar al examen con los cálculos claros.', ac: null,
        pasos: [[40, 'Repaso con tarjetas.'], [10, 'Un minuto para respirar.']], ideas: ['pr-plickers', 'pr-respira'] },
      { id: 'examen3', h: 2, m: 'c', tipo: 'Evaluación', t: 'Examen del 3er parcial', obj: 'Evaluar lo aprendido en el submódulo.', ac: null,
        pasos: [[5, 'Un minuto para respirar.'], [85, 'Examen.'], [10, 'Recoge y cierra.']], ev: 'Examen del parcial', ideas: ['pr-respira'] },
      { id: 'cartel', h: 4, m: 'c', lugar: 'computo', tipo: 'Cómputo', t: 'Cartel y presentación para la feria', obj: 'Preparar el cartel digital y el pitch de la feria.', ac: null,
        pasos: [[120, 'Cartel digital: problema, diagrama, cálculos, fotos de pruebas y equipo.'], [60, 'Pitch con su presentación.'], [20, 'Imprimen o guardan para la feria.']], ideas: ['industria-real'] },
      { id: 'feria1', h: 3, m: 'c', noComputo: true, tipo: 'Proyecto', t: 'Feria de proyectos: defensa oral (1)', obj: 'Defender el proyecto ante invitados.', ac: 3, dc: 1,
        pasos: [[10, 'Montaje.'], [130, 'Defensa oral y demostración.'], [10, 'Cierre.']], ev: 'Defensa oral del proyecto (Desempeño)', ideas: ['industria-real', 'pr-videollamada'] },
      { id: 'retro3', h: 1, m: 'c', tipo: 'Evaluación', t: 'Retroalimentación del examen', obj: 'Aprender de los errores del examen.', ac: null,
        pasos: [[40, 'Errores comunes del examen, sin nombres.'], [10, 'Dudas.']], ideas: ['galeria-errores'] },
      { id: 'feria2', h: 3, m: 'c', noComputo: true, tipo: 'Proyecto', t: 'Feria de proyectos: defensa oral (2)', obj: 'Defender el proyecto ante invitados.', ac: 3, dc: 1,
        pasos: [[10, 'Montaje.'], [130, 'Defensa oral y demostración.'], [10, 'Cierre.']], ev: 'Defensa oral del proyecto (Desempeño)' },
      { id: 'coeval', h: 2, m: 'c', tipo: 'Evaluación', t: 'Coevaluación y recuperación', obj: 'Evaluarse entre compañeros y cerrar pendientes.', ac: null,
        pasos: [[40, 'Coevaluación con lista de cotejo.'], [60, 'Recuperación de evidencias pendientes.']], ideas: ['coevaluacion'] },
      { id: 'plenaria3', h: 1, m: 'c', tipo: 'Formación', t: 'Plenaria final de aprendizajes', obj: 'Reconocer lo aprendido en el semestre.', ac: null,
        pasos: [[10, 'Muro de logros.'], [35, 'Mapa mental colectivo del semestre.'], [5, 'Agradecimiento.']], ideas: ['pr-mapa-mental', 'pr-muro-logros'] },
      { id: 'desmontaje', h: 2, m: 'c', lugar: 'taller', noComputo: true, tipo: 'Taller', t: 'Desmontaje responsable y reciclaje', obj: 'Separar materiales reutilizables y reciclables (economía ecológica).', ac: null,
        pasos: [[60, 'Desmontan y separan materiales reutilizables y reciclables.'], [25, 'Inventario de herramientas.'], [15, 'Reflexión: ¿cuánto cuesta lo que se tira en una planta?']] },
      { id: 'portafolio', h: 3, m: 'c', lugar: 'computo', tipo: 'Cómputo', t: 'Portafolio digital y revisión de calificaciones', obj: 'Reunir sus evidencias del semestre y revisar su calificación contigo.', ac: null,
        pasos: [[90, 'Portafolio digital: plano del 2º parcial, diagramas, hoja de cálculo, fotos y bitácora.'], [60, 'Mientras, revisas la calificación con cada alumno.']] },
      { id: 'yo25', h: 1, m: 'c', tipo: 'Formación', t: 'Cierre del semestre: mi yo de 25 años', obj: 'Conectar lo aprendido con su proyecto de vida.', ac: null,
        pasos: [[30, 'Mi yo de 25 años.'], [15, '¿Dónde voy a trabajar? El Bajío industrial.'], [5, 'Despedida.']], ideas: ['pr-yo-25', 'pr-carreras'] }
    ]
  };

  /* ---------- motor: acomoda la secuencia en los bloques del horario ---------- */
  const K = E.clases = {};
  const MOM = { a: ['Apertura', 'brand'], d: ['Desarrollo', 'info'], c: ['Cierre', 'warn'] };
  const MOMK = { a: 'apertura', d: 'desarrollo', c: 'cierre' };
  K.smKey = (g, pid) => D.smKey(g, pid);
  K.estado = g => S.get('clases:' + g.id) || {};
  K.LUGARES = { aula: ['Aula', '🏫'], computo: ['Centro de cómputo', '💻'], taller: ['Taller', '🛠️'] };
  // los planes se guardan mientras no cambie nada (se piden muchas veces al pintar)
  let PC = {}; S.on(() => { PC = {}; }); K.limpia = () => { PC = {}; };
  // «de corrido»: los submódulos siguen de un parcial al otro (módulos IV y V); el submódulo de cada parcial es con el que arranca
  K.flujo = g => !!(g && g.flujo);
  const todosSM = g => {
    const out = []; (E.mods ? E.mods.smKeys(g.modulo) : []).forEach((k, smi) => (E.CLASES[k] || []).forEach(x => out.push(Object.assign({}, x, { sm: k.split('-')[1], smi: smi }))));
    return out;
  };
  K.tiene = (g, pid) => {
    if (!g || !(g.submodulos || {})[pid]) return false;
    return K.flujo(g) ? todosSM(g).some(x => Number(x.sm) >= Number(g.submodulos[pid])) : !!E.CLASES[K.smKey(g, pid)];
  };
  const baseDe = (g, pid) => {
    if (!K.flujo(g)) { const n = (g.submodulos || {})[pid]; return (E.CLASES[K.smKey(g, pid)] || []).map(x => Object.assign({}, x, { sm: n, smi: 0 })); }
    const ps = D.parciales(), i = ps.findIndex(p => p.id === pid), n = Number((g.submodulos || {})[pid]) || 0;
    if (i < 0 || !n) return [];
    const prev = i > 0 && (g.submodulos || {})[ps[i - 1].id] ? ps[i - 1] : null;
    const pend = prev ? K.plan(g, prev.id).resto : todosSM(g).map(x => ({ it: x, rem: x.h }));
    // lo pendiente del parcial anterior sigue completo (aunque sea de un submódulo anterior): de corrido nada se pierde
    return pend.filter(x => x.rem > 0 && (prev || Number(x.it.sm) >= n)).map(x => Object.assign({}, x.it, x.rem < x.it.h ? { h0: x.rem } : {}));
  };
  // de corrido: el examen de cada parcial va al final del parcial aunque el submódulo siga en el siguiente
  K.examenFlujo = (g, pid, h) => {
    const p = C.parcial(pid); if (!p || !K.flujo(g)) return null; h = h || 2;
    return { id: 'examen-' + pid, h: h, m: 'c', tipo: 'Evaluación', t: 'Examen del ' + p.nombre, obj: 'Evaluar lo visto en el parcial: Escuadra arma el examen con los temas que diste (Más → Examen recomendado).', ac: null, auto: true,
      sm: String((g.submodulos || {})[pid] || ''), smi: 0, pasos: h >= 2 ? [[10, 'Indicaciones y respiración antes del examen.'], [h * 50 - 20, 'Examen escrito con los temas del parcial.'], [10, 'Recoges y comentas lo que viene.']] : [[5, 'Indicaciones.'], [40, 'Examen escrito con los temas del parcial.'], [5, 'Recoges.']],
      ev: 'Examen del parcial', ideas: ['pr-respira'] };
  };
  K.seq = (g, pid) => {
    const base = baseDe(g, pid); const ord = (K.estado(g).orden || {})[pid];
    const ids = base.map(x => x.id);
    const ok = Array.isArray(ord) && ord.length === ids.length && ids.every(id => ord.indexOf(id) >= 0);
    return (ok ? ord : ids).map((id, pos) => Object.assign({}, base[ids.indexOf(id)], { idx: ids.indexOf(id), pos: pos }));
  };
  K.bloques = (g, p) => {
    const out = [], st = K.estado(g), lug = st.lugares || {};
    C.clases(g, p).forEach(c => C.bloquesDia(g, c.fecha).forEach(b => {
      const key = c.fecha + '@' + b.inicio, def = b.lugar || 'aula';
      out.push({ fecha: c.fecha, inicio: b.inicio, fin: b.fin, horas: Number(b.horas) || 1, key: key, lugarDef: def, lugar: lug[key] || def });
    }));
    return out;
  };
  // Acomoda la secuencia en los bloques: lo de computadora solo en el centro de cómputo, el taller jala las prácticas,
  // respeta apertura → desarrollo → cierre y las dependencias (por ejemplo, cortar después de tener el plano).
  K.plan = (g, pid) => {
    const ck = g.id + '|' + pid; if (PC[ck]) return PC[ck];
    const r = planCalc(g, pid); PC[ck] = r; return r;
  };
  const planCalc = (g, pid) => {
    const p = C.parcial(pid), seq = K.seq(g, pid), st = K.estado(g), perd = st.perdidas || {}, rec = st.recortes || {}, ade = st.adelantos || {};
    const bl = K.bloques(g, p), rem = seq.map(x => x.h0 != null ? x.h0 : x.h), done = seq.map(() => false), ORD = { a: 0, d: 1, c: 2 };
    const pos = {}; seq.forEach((x, j) => { pos[x.id] = j; });
    const lane = x => x.lugar === 'computo' ? 'c' : 'g';
    // si la dependencia es de otro lugar (aula ↔ cómputo) es "blanda": la clase no se detiene, solo avisa
    const deps = j => (seq[j].dep || []).concat((seq[j].firme || []).filter(id => (seq[j].dep || []).indexOf(id) < 0));
    const blandas = j => deps(j).filter(id => pos[id] != null && !done[pos[id]] && lane(seq[j]) !== lane(seq[pos[id]]) && (seq[j].firme || []).indexOf(id) < 0);
    // apertura → desarrollo → cierre (de cada submódulo, en orden); lo pendiente de cómputo no detiene el cierre del aula (y viceversa)
    const rk = x => (x.smi || 0) * 3 + ORD[x.m];
    const bloquea = (k, j) => rk(seq[k]) < rk(seq[j]) && (seq[k].m === 'a' || lane(seq[k]) === lane(seq[j]));
    const elegible = j => !done[j] && seq.every((x, k) => done[k] || !bloquea(k, j)) && deps(j).every(id => pos[id] == null || done[pos[id]] || blandas(j).indexOf(id) >= 0);
    const primero = L => seq.findIndex((x, k) => !done[k] && lane(x) === L);
    const cur = { c: -1, g: -1 };
    const tomar = (j, b, cap) => {
      const it = seq[j], take = Math.min(cap, rem[j]), bl = blandas(j);
      b.parts.push({ it: it, h: take, antes: it.h - rem[j], sigue: take < rem[j], aviso: bl.length ? 'Todavía no se da «' + seq[pos[bl[0]]].t + '»' + (lane(seq[pos[bl[0]]]) === 'c' ? ' (centro de cómputo)' : '') + ': que trabajen con lo que tengan (croquis, boceto o medidas a mano).' : '' });
      rem[j] -= take; const L = lane(it);
      if (rem[j] <= 0) { done[j] = true; if (cur[L] === j) cur[L] = -1; } else cur[L] = j;
      return take;
    };
    // de corrido: se aparta el último bloque de 2 h o más (fuera del centro de cómputo) para el examen del parcial
    let exK = null, exIt = null;
    if (K.flujo(g) && seq.length) {
      const vivos = bl.filter(b => !perd[b.key]);
      for (let i = vivos.length - 1; i >= 0 && !exK; i--) if (vivos[i].lugar !== 'computo' && vivos[i].horas >= 2) exK = vivos[i].key;
      for (let i = vivos.length - 1; i >= 0 && !exK; i--) if (vivos[i].lugar !== 'computo') exK = vivos[i].key;
      if (exK) { const bx = vivos.find(b => b.key === exK); exIt = K.examenFlujo(g, pid, Math.min(2, bx.horas)); }
    }
    // lo que ya diste (✓ Ya la di): desde las clases de hoy en adelante ya no se planea; las pasadas no cambian
    // ✓ Ya la di: guarda cuándo la marcaste; solo cambian las clases que empiezan después de ese momento
    const dadasP = Object.entries(st.dadas || {}).map(([id, desde]) => [id, typeof desde === 'string' ? desde : '0000']);
    bl.forEach(b => {
      b.perdida = !!perd[b.key]; b.parts = []; b.libre = 0; if (b.perdida) return;
      dadasP.forEach(([id, desde]) => { if (b.fecha + '@' + String(b.inicio).padStart(5, '0') < desde) return; const j = pos[id]; if (j != null && !done[j]) { done[j] = true; rem[j] = 0; } });
      b.recorte = Math.min(b.horas, Number(rec[b.key]) || 0);
      // te adelantaste: el bloque cubrió más horas del plan de las que dura (lo siguiente se jala aquí)
      b.adelanto = b.recorte ? 0 : Math.max(0, Number(ade[b.key]) || 0);
      let cap = b.horas - b.recorte + b.adelanto;
      const exH = b.key === exK && exIt ? Math.min(exIt.h, Math.max(0, cap)) : 0; cap -= exH;
      while (cap > 0) {
        // tema cambiado para esta clase (⇄ Cambiar tema): esa hora se da con la actividad elegida
        const sHora = b.parts.reduce((a, x) => a + x.h, 0), ov = (st.cclase || {})[b.key + '#' + sHora], jf = ov ? seq.findIndex(x => x.id === ov) : -1;
        if (jf >= 0 && !done[jf] && rem[jf] > 0) { const np = b.parts.length; cap -= tomar(jf, b, 1); if (b.parts[np]) b.parts[np].cambio = true; continue; }
        let j = -1; const L = b.lugar, cg = cur.g >= 0 && !done[cur.g] ? cur.g : -1, cc = cur.c >= 0 && !done[cur.c] ? cur.c : -1;
        if (L === 'computo') {
          if (cc >= 0) j = cc;
          if (j < 0) { const k = primero('c'); if (k >= 0 && elegible(k)) j = k; }
          if (j < 0 && cg >= 0 && !seq[cg].noComputo) j = cg;
          if (j < 0) j = seq.findIndex((x, k) => lane(x) === 'g' && !x.noComputo && elegible(k));
        } else if (L === 'taller') {
          // en taller casi no se expone: primero prácticas y proyecto; la teoría solo si no queda otra cosa
          const teo = x => x.tipo === 'Teoría';
          if (cg >= 0 && seq[cg].lugar === 'taller') j = cg;
          if (j < 0) j = seq.findIndex((x, k) => x.lugar === 'taller' && elegible(k));
          if (j < 0 && cg >= 0 && !teo(seq[cg])) j = cg;
          if (j < 0) j = seq.findIndex((x, k) => lane(x) === 'g' && !teo(x) && elegible(k));
          if (j < 0 && cg >= 0) j = cg;
          if (j < 0) { const k = primero('g'); if (k >= 0 && elegible(k)) j = k; }
        } else {
          if (cg >= 0) j = cg;
          if (j < 0) { const k = primero('g'); if (k >= 0 && elegible(k)) j = k; }
        }
        // si lo que sigue espera algo del centro de cómputo (dependencia firme), avanza con lo siguiente que ya se puede dar
        if (j < 0 && L !== 'computo') j = seq.findIndex((x, k) => lane(x) === 'g' && elegible(k));
        if (j < 0) break;
        // el tramo normal se corta en la siguiente clase con tema cambiado
        const hasta = c => { for (let t = 1; t < c; t++) if ((st.cclase || {})[b.key + '#' + (sHora + t)]) return t; return c; };
        cap -= tomar(j, b, hasta(cap));
      }
      if (exH) b.parts.push({ it: exIt, h: exH, antes: 0, sigue: false, aviso: '' });
      b.libre = cap;
      if (cap > 0) {
        const kg = primero('g'), kc = primero('c');
        if (kg < 0 && kc >= 0 && b.lugar !== 'computo') b.espera = 'Lo que falta del parcial («' + seq[kc].t + '») necesita centro de cómputo.';
        else if (kg >= 0) { const x = seq[kg], f = (x.dep || []).map(id => seq[pos[id]]).filter(y => y && !done[pos[y.id]]); b.espera = f.length ? '«' + x.t + '» necesita antes «' + f[0].t + '»' + (f[0].lugar === 'computo' ? ' (centro de cómputo)' : '') + '.' : (b.lugar === 'computo' && x.noComputo ? '«' + x.t + '» no se hace en el centro de cómputo.' : ''); }
      }
    });
    const pend = seq.filter((x, j) => !done[j]), faltan = seq.reduce((s, x, j) => s + (done[j] ? 0 : rem[j]), 0);
    const hh = x => x.h0 != null ? x.h0 : x.h, tot = seq.reduce((s, x) => s + hh(x), 0) + (exIt ? exIt.h : 0), cal = bl.filter(b => !b.perdida).reduce((s, b) => s + b.horas, 0);
    const hc = { nec: seq.filter(x => x.lugar === 'computo').reduce((s, x) => s + hh(x), 0), hay: bl.filter(b => !b.perdida && b.lugar === 'computo').reduce((s, b) => s + b.horas, 0) };
    // lo que queda para el parcial siguiente (de corrido)
    const resto = seq.map((x, j) => { const it = Object.assign({}, x); delete it.idx; delete it.pos; delete it.h0; return { it: it, rem: done[j] ? 0 : rem[j] }; });
    return { p: p, seq: seq, bloques: bl, faltan: faltan, pend: pend, tot: tot, cal: cal, computo: hc, resto: resto, examen: exIt };
  };
  K.dia = (g, f) => { const p = D.parciales().find(x => f >= x.inicio && f <= x.fin); if (!p) return null; const pl = K.plan(g, p.id); return { p: p, plan: pl, bloques: pl.bloques.filter(b => b.fecha === f) }; };
  K.resumenDia = (g, f) => { const d = K.dia(g, f); if (!d || !d.bloques.length) return null; return d.bloques.map(b => ({ b: b, txt: b.perdida ? 'Sin clase (se recorrió)' : (b.parts.map(x => x.it.t).join(' + ') || 'Libre: ' + (b.espera || 'repaso o avance del proyecto')) })); };

  /* ---------- piezas ---------- */
  const momChip = m => '<span class="chip ' + MOM[m][1] + '">' + MOM[m][0] + '</span>';
  function programa(g, pid, it) {
    if (it.ac == null) return '';
    const m = E.PROGRAMA.modulos[g.modulo] || {}, sm = (m.sub || {})[it.sm || (g.submodulos || {})[pid]]; const ac = sm && sm.ac[it.ac]; if (!ac) return '';
    const dc = it.dc != null && ac.desarrollo ? ac.desarrollo[it.dc] : '';
    return '<details class="sub"><summary>Programa SEP: «' + esc(ac.titulo) + '» (p. ' + esc(ac.pag) + ')</summary><p class="small">' + (dc ? esc(dc) : '') + '</p><p class="small muted">Producto de la actividad clave: ' + esc(ac.producto) + '</p></details>';
  }
  let medVistos = null;
  function actHTML(g, pid, part, bloqueKey) {
    const it = part.it, min = it.pasos ? it.pasos.reduce((s, x) => s + x[0], 0) : 0;
    let h = '<div class="cl-act"><div class="row between gap wrap"><div>' + momChip(it.m) + ' <span class="chip">' + esc(it.tipo) + '</span>' + (part.h !== it.h ? ' <span class="chip">' + part.h + ' de ' + it.h + ' h</span>' : ' <span class="chip">' + it.h + ' h</span>') + '</div>' +
      (it.auto ? '<span class="chip">Automático: fin del parcial</span>' : btn('⇄ Cambiar con la siguiente', 'cl-swap', 'data-pid="' + pid + '" data-pos="' + it.pos + '"', 'small ghost') + ' ' + btn(((K.estado(g).dadas || {})[it.id] ? '↺ Ya no la di' : '✓ Ya la di'), 'cl-dada', 'data-pid="' + pid + '" data-id="' + it.id + '"', 'small ' + ((K.estado(g).dadas || {})[it.id] ? 'ghost' : ''))) + '</div>' +
      '<h4>' + esc(it.t) + '</h4>' + (it.lugar === 'computo' ? '<p class="small muted">💻 Necesita centro de cómputo.</p>' : it.lugar === 'taller' ? '<p class="small muted">🛠️ Mejor en taller (también se puede en el aula).</p>' : '') + (part.antes ? '<p class="note">Continúa de la clase anterior (' + part.antes + ' h ya dadas).</p>' : '') + (part.sigue ? '<p class="note">Sigue en la próxima clase.</p>' : '') + (part.aviso ? '<p class="note warn">' + esc(part.aviso) + '</p>' : '') +
      '<p><b>Objetivo:</b> ' + esc(it.obj) + '</p>';
    const rp = E.run && E.run.r && E.run.r.key === bloqueKey ? E.run.r.pasos[E.run.r.i] : null;
    const w0 = part.antes * 50, w1 = (part.antes + part.h) * 50; let acc = 0;
    if (it.pasos) h += '<ol class="cl-pasos">' + it.pasos.map(x => { const a = acc; acc += x[0]; const fuera = part.h !== it.h && (Math.min(acc, w1) - Math.max(a, w0) <= 0); return '<li class="' + (rp && rp.act === it.t && rp.t === x[1] ? 'now' : fuera ? 'fuera' : '') + '"><span class="min">' + x[0] + ' min</span>' + esc(x[1]) + (fuera ? ' <small>(' + (a < w0 ? 'clase anterior' : 'siguiente clase') + ')</small>' : '') + '</li>'; }).join('') + '</ol>' + (min ? '<p class="muted small">Guion pensado para ' + it.h + ' h de horario (' + it.h * 50 + ' min).</p>' : '');
    if (it.mat) h += '<p class="small"><b>Material:</b> ' + esc(it.mat) + '</p>';
    if (it.nota) h += '<p class="small"><b>Tip:</b> ' + esc(it.nota) + '</p>';
    if (it.ev) h += '<p class="small"><b>Evidencia:</b> ' + esc(it.ev) + '</p>';
    if (it.tarea) h += '<p class="note info small"><b>Tarea:</b> ' + esc(it.tarea) + '</p>';
    if (it.pre) h += '<p class="small"><b>Para adelantar el tema</b> a quien lo necesite: <i>' + esc(it.pre) + '</i></p>';
    if (it.guia) h += K.guiaHTML(it, pid);
    h += programa(g, pid, it);
    const tm = it.tema && E.TEMAS.find(t => t.id === it.tema);
    // imágenes y videos del tema (una sola vez por día aunque el tema siga en otra actividad)
    if (tm && E.medios && !(medVistos && medVistos.has(tm.id))) { if (medVistos) medVistos.add(tm.id); h += E.medios.claseHTML(tm.id); }
    const ids = (it.ideas || []).map(id => E.IDEAS.find(x => x.id === id)).filter(Boolean);
    // proyectar: la clase (meta, agenda y prácticas), el tema, sus ejercicios y las prácticas de FreeCAD
    const prs = E.fc ? E.fc.de(it.id) : [], nEj = tm && E.ejer ? E.ejer.hay(tm.id) : 0;
    h += '<div class="row gap wrap mt">' + btn('📽 Proyectar la clase', 'cl-proj', 'data-pid="' + pid + '" data-id="' + it.id + '"', 'small primary') +
      (tm ? btn(icon('screen') + ' Proyectar tema', 'proj-open', 'data-id="' + tm.id + '"', 'small') : '') + (nEj ? btn('📝 Ejercicios', 'ej-proj', 'data-id="' + tm.id + '"', 'small') : '') +
      (tm ? link('Presentador', 'presentador/' + tm.id, 'small ghost') + link('Ver tema', 'tema/' + tm.id, 'small ghost') : '') + '</div>';
    if (prs.length) h += '<div class="fc-blq"><b>💻 Práctica' + (prs.length > 1 ? 's' : '') + ' de FreeCAD de esta clase</b>' + prs.map(p => E.fc.fila(p)).join('') + '<p class="small muted">Ya van dentro de «Proyectar la clase»; también puedes imprimir la hoja desde la práctica.</p></div>';
    if (ids.length) h += '<div class="row gap wrap mt">' + ids.map(x => link(icon('bulb') + ' ' + esc(x.titulo), 'ideas/' + x.id, 'small ghost')).join('') + '</div>';
    return h + '</div>';
  }

  /* ---------- hoja de práctica de una clase (simuladores, mediciones, armado): pasos, tabla para llenar, revisión y entrega ---------- */
  const pasoTxt = x => Array.isArray(x) ? x : ['', x];
  K.guiaHTML = (it, pid) => {
    const gu = it.guia;
    return '<details class="sub cl-guia"><summary>🧪 Hoja de práctica' + (gu.sw ? ' · ' + esc(gu.sw) : '') + '</summary>' +
      (gu.link ? '<p class="small"><a href="' + esc(gu.link) + '" target="_blank" rel="noopener">↗ Abrir ' + esc(gu.sw || gu.link.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]) + '</a></p>' : '') +
      '<ol class="fc-pasos">' + gu.pasos.map(x => { x = pasoTxt(x); return '<li>' + (x[0] ? '<span class="fc-tool">' + esc(x[0]) + '</span>' : '') + '<span>' + esc(x[1]) + '</span></li>'; }).join('') + '</ol>' +
      (gu.tabla ? '<div class="tbl-wrap"><table class="fc-tabla"><thead><tr>' + gu.tabla.cab.map(c => '<th>' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + (Array.isArray(gu.tabla.filas) ? gu.tabla.filas : Array.from({ length: Math.min(3, gu.tabla.filas || 3) }, () => gu.tabla.cab.map(() => ''))).map(f => '<tr>' + f.map(c => '<td>' + esc(String(c)) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>' : '') +
      (gu.revisa ? '<p class="small"><b>Revisa antes de entregar:</b></p><ul class="small">' + gu.revisa.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '') +
      (gu.seguridad ? '<p class="note warn small">⚠️ ' + esc(gu.seguridad) + '</p>' : '') +
      (gu.entrega ? '<p class="small"><b>Entrega:</b> ' + esc(gu.entrega) + '</p>' : '') +
      btn('🖨 Imprimir hoja de práctica', 'cl-hoja', 'data-pid="' + pid + '" data-id="' + it.id + '"', 'small') + '</details>';
  };
  K.hojaHTML = (g, pid, it) => {
    const gu = it.guia, p = C.parcial(pid), m = E.PROGRAMA.modulos[g.modulo] || {}, sm = (m.sub || {})[it.sm] || {};
    const filas = gu.tabla ? (Array.isArray(gu.tabla.filas) ? gu.tabla.filas : Array.from({ length: gu.tabla.filas || 6 }, () => gu.tabla.cab.map(() => ''))) : [];
    return '<div class="pr hoja-pr"><div class="p-title">HOJA DE PRÁCTICA · ' + esc(it.t.toUpperCase()) + '</div>' +
      '<p class="tiny c">' + esc(D.cfg().plantel) + ' · ' + esc(g.nombre) + ' · Módulo ' + esc(g.modulo) + (it.sm ? ', Submódulo ' + esc(it.sm) + (sm.nombre ? ': ' + esc(sm.nombre) : '') : '') + (p ? ' · ' + esc(p.nombre) : '') + '</p>' +
      '<table class="grid"><tr><td><b>Nombre / equipo:</b> ________________________________________</td><td><b>Fecha:</b> ____________</td></tr></table>' +
      '<p><b>Objetivo:</b> ' + esc(it.obj) + '</p>' + (it.mat ? '<p><b>Material:</b> ' + esc(it.mat) + '</p>' : '') + (gu.sw ? '<p><b>Programa:</b> ' + esc(gu.sw) + (gu.link ? ' (' + esc(gu.link) + ')' : '') + '</p>' : '') +
      (gu.seguridad ? '<p><b>Seguridad:</b> ' + esc(gu.seguridad) + '</p>' : '') +
      '<ol>' + gu.pasos.map(x => { x = pasoTxt(x); return '<li>' + (x[0] ? '<b>' + esc(x[0]) + ':</b> ' : '') + esc(x[1]) + '</li>'; }).join('') + '</ol>' +
      (filas.length ? '<table class="grid"><tr>' + gu.tabla.cab.map(c => '<th>' + esc(c) + '</th>').join('') + '</tr>' + filas.map(f => '<tr>' + f.map(c => '<td style="height:22px">' + esc(String(c)) + '</td>').join('') + '</tr>').join('') + '</table>' : '') +
      (gu.revisa ? '<p><b>Revisa antes de entregar</b></p><ul>' + gu.revisa.map(x => '<li>☐ ' + esc(x) + '</li>').join('') + '</ul>' : '') +
      (gu.preguntas ? '<p><b>Preguntas</b></p><ol>' + gu.preguntas.map(q => '<li>' + esc(q) + '<br>_______________________________________________________________</li>').join('') + '</ol>' : '') +
      (gu.entrega ? '<p><b>Entrega:</b> ' + esc(gu.entrega) + '</p>' : '') + '</div>';
  };
  A['cl-hoja'] = el => { const g = D.grupoActual(); if (!g) return; const it = K.seq(g, el.dataset.pid).find(x => x.id === el.dataset.id) || (E.CLASES[K.smKey(g, el.dataset.pid)] || []).find(x => x.id === el.dataset.id); if (it && it.guia) E.print.run(K.hojaHTML(g, el.dataset.pid, it), { title: 'Práctica · ' + it.t, margin: '10mm' }); };

  /* ---------- proyectar la clase: meta, agenda, material, prácticas de FreeCAD, palabras clave y entrega ---------- */
  const chunkK = (a, n) => { const out = []; for (let i = 0; i < a.length; i += n) out.push(a.slice(i, i + n)); return out; };
  const capi = x => { x = String(x).trim().replace(/\.$/, ''); return x.charAt(0).toUpperCase() + x.slice(1); };
  K.deck = it => {
    const lug = it.lugar === 'computo' ? ' · Centro de cómputo' : it.lugar === 'taller' ? ' · Taller' : '';
    const s = [{ k: 'cover', h: it.t, sub: it.tipo + ' · ' + it.h + ' h' + lug, p: 'Meta de hoy: ' + it.obj }];
    if (it.pasos) { const ch = chunkK(it.pasos, 6); ch.forEach((c, i) => s.push({ k: 'html', h: 'Lo que haremos hoy' + (ch.length > 1 ? ' (' + (i + 1) + ' de ' + ch.length + ')' : ''), html: '<ol class="pj-agenda">' + c.map(x => '<li><span class="pj-min">' + x[0] + ' min</span><span>' + esc(x[1]) + '</span></li>').join('') + '</ol>' })); }
    if (it.pre) s.push({ k: 'list', h: 'Palabras clave de hoy', items: it.pre.split(' · ').map(capi) });
    if (it.mat) s.push({ k: 'list', h: 'Material', items: it.mat.split(/,\s*/).map(capi) });
    if (it.guia) {
      const ps = it.guia.pasos.map(pasoTxt), ch = chunkK(ps, 4);
      ch.forEach((c, i) => s.push({ k: 'html', h: 'Práctica' + (it.guia.sw ? ' · ' + it.guia.sw : '') + (ch.length > 1 ? ' (' + (i + 1) + ' de ' + ch.length + ')' : ''), html: '<ol class="fc-pasos" start="' + (i * 4 + 1) + '">' + c.map(x => '<li>' + (x[0] ? '<span class="fc-tool">' + esc(x[0]) + '</span>' : '') + '<span>' + esc(x[1]) + '</span></li>').join('') + '</ol>' }));
      if (it.guia.revisa) s.push({ k: 'list', h: 'Revisa antes de entregar', items: it.guia.revisa, foot: it.guia.entrega ? 'Entrega: ' + it.guia.entrega : '' });
    }
    if (E.fc) E.fc.de(it.id).forEach(p => E.fc.slides(p).forEach(x => s.push(x)));
    if (it.ev || it.tarea) s.push({ k: 'list', h: it.ev ? 'Qué entregas hoy' : 'Tarea', items: [it.ev ? capi(it.ev) : capi(it.tarea)], foot: it.ev && it.tarea ? 'Tarea: ' + it.tarea : '' });
    return s;
  };
  A['cl-proj'] = el => {
    const g = D.grupoActual(); if (!g) return;
    const it = K.seq(g, el.dataset.pid).find(x => x.id === el.dataset.id) || (el.dataset.id === 'examen-' + el.dataset.pid ? K.examenFlujo(g, el.dataset.pid) : null); if (!it) return;
    E.proj.abrir({ id: 'clase-' + it.id, titulo: it.t }, K.deck(it));
  };

  /* ---------- vista: lista de clases del parcial ---------- */
  V.clases = pid => {
    const g = D.grupoActual(); if (!g) return H.noGroup();
    const hoy = u.today(), ps = D.parciales().filter(p => K.tiene(g, p.id));
    if (!ps.length) {
      const m = E.PROGRAMA.modulos[g.modulo] || {}, cargando = E.mods && E.mods.cargando(g.modulo), sinSM = !Object.keys(g.submodulos || {}).some(k => g.submodulos[k]);
      return { t: 'Clases', h: card('<h3>' + icon('board') + ' Clases de ' + esc(g.nombre) + '</h3>' + (cargando ? '<p>Cargando las clases del Módulo ' + esc(g.modulo) + '…</p>' :
        sinSM ? '<p>Elige qué submódulo va en cada parcial (Ajustes → Grupo y horario) y aquí aparece la secuencia de clases del <b>Módulo ' + esc(g.modulo || '') + (m.nombre ? ' · ' + esc(m.nombre) : '') + '</b>.</p>' + link('Ir a Ajustes', 'ajustes/grupo', 'small primary') :
        '<p>Todavía no hay secuencia de clases para este submódulo del <b>Módulo ' + esc(g.modulo || '') + (m.nombre ? ' · ' + esc(m.nombre) : '') + '</b>.</p><p class="muted small">Mientras, el pase de lista, calificaciones, acta y todo lo demás funcionan igual.</p>' + link('Ver Mis grupos', 'grupos', 'small'))) };
    }
    const act = C.parcialActual(hoy); pid = ps.some(p => p.id === pid) ? pid : (ps.find(p => p.id === act.id) || ps[0]).id;
    const pl = K.plan(g, pid), p = pl.p, flujo = K.flujo(g), smsP = Array.from(new Set(flujo ? pl.bloques.reduce((a, b) => a.concat(b.parts.filter(t => !t.it.auto).map(t => t.it.sm)), []) : pl.seq.map(x => x.sm))).filter(Boolean).sort();
    const smTab = x => { if (!flujo) return 'SM' + (g.submodulos || {})[x.id]; const ss = Array.from(new Set(K.plan(g, x.id).bloques.reduce((a, b) => a.concat(b.parts.map(t => t.it.sm)), []))).filter(Boolean).sort(); return ss.length ? 'SM' + ss.join('→SM') : 'SM' + (g.submodulos || {})[x.id]; };
    const plan = D.planes(g.id).find(x => x.parcial === pid);
    let h = '<div class="filters">' + ps.map(x => '<a class="tab ' + (x.id === pid ? 'on' : '') + '" href="#/clases/' + x.id + '">' + esc(x.nombre) + ' · ' + smTab(x) + '</a>').join('') + '</div>';
    // de corrido la secuencia trae todo lo que falta del módulo: se cuentan solo las horas que caen en este parcial
    const porM = { a: 0, d: 0, c: 0 }; if (flujo) pl.bloques.forEach(b => b.parts.forEach(t => { porM[t.it.m] += t.h; })); else pl.seq.forEach(x => { porM[x.m] += x.h0 != null ? x.h0 : x.h; });
    const totP = flujo ? porM.a + porM.d + porM.c : pl.tot, usoC = pl.bloques.reduce((s, b) => s + b.parts.filter(t => t.it.lugar === 'computo').reduce((a, t) => a + t.h, 0), 0);
    const sm = smsP.length;
    let chk = '';
    if (plan && plan.secuencia) { const dif = ['a', 'd', 'c'].filter(k => plan.secuencia[MOMK[k]] && Number(plan.secuencia[MOMK[k]].horas) !== porM[k]); if (dif.length) chk = '<p class="note warn">Tu planeación marca ' + dif.map(k => MOM[k][0].toLowerCase() + ' ' + plan.secuencia[MOMK[k]].horas + ' h').join(', ') + '; esta secuencia usa ' + dif.map(k => porM[k] + ' h').join(', ') + '.</p>'; }
    const hechas = pl.bloques.filter(b => b.fecha < hoy && !b.perdida).reduce((s, b) => s + b.horas, 0);
    const ips = D.parciales().findIndex(x => x.id === pid), sigP = D.parciales()[ips + 1], sigue = flujo && sigP && (g.submodulos || {})[sigP.id];
    // empezaste con el grupo después de este parcial: la secuencia queda de referencia, sin avisos de horas que faltan
    const antes = !!(g.inicioDocente && g.inicioDocente > p.fin);
    h += card('<h3>' + icon('board') + ' Clases del ' + esc(p.nombre) + (sm ? ' · Submódulo' + (smsP.length > 1 ? 's ' + smsP.slice(0, -1).join(', ') + ' y ' + smsP[smsP.length - 1] : ' ' + smsP[0]) : '') + '</h3>' + (flujo ? '<p class="small muted">De corrido: lo que no alcance en este parcial sigue en el siguiente, y al terminar un submódulo empieza el otro.</p>' : '') +
      '<p class="muted small">' + totP + ' h de ' + (flujo ? 'clases' : 'secuencia') + ' en ' + pl.cal + ' h de tu horario · apertura ' + porM.a + ' h, desarrollo ' + porM.d + ' h, cierre ' + porM.c + ' h, igual que tu planeación. Cada clase dice qué actividad clave del programa SEP 2024 trabaja.</p>' +
      '<div class="bar"><span style="width:' + (pl.cal ? Math.min(100, hechas / pl.cal * 100) : 0) + '%"></span></div><p class="small">' + hechas + ' de ' + pl.cal + ' h dadas</p>' + chk +
      (antes ? '<p class="note info">Empezaste con este grupo el ' + esc(u.fLarga(g.inicioDocente)) + ': este parcial no te tocó. La secuencia queda como referencia para cuando des este submódulo.</p>' : sigue ? '<p class="small muted">💻 ' + usoC + ' h de computadora en tus ' + pl.computo.hay + ' h de centro de cómputo; lo que no alcance sigue en el ' + esc(sigP.nombre) + '.</p>' : pl.computo.nec > pl.computo.hay ? '<p class="note warn">Las actividades de computadora suman ' + pl.computo.nec + ' h y tu horario tiene ' + pl.computo.hay + ' h en centro de cómputo: marca otro bloque como 💻 o cambia de orden.</p>' : '<p class="small muted">💻 ' + pl.computo.nec + ' h de computadora acomodadas en tus ' + pl.computo.hay + ' h de centro de cómputo.</p>') +
      (!antes && pl.faltan ? (sigue ? '<p class="note info">Lo demás del módulo (' + pl.faltan + ' h) sigue en el ' + esc(sigP.nombre) + ', de corrido: «' + pl.pend.map(x => x.t).slice(0, 2).join('», «') + '»' + (pl.pend.length > 2 ? '…' : '') + '.</p>' : '<p class="note bad">Por clases que no se dieron o por el lugar, te faltan ' + pl.faltan + ' h: no caben "' + pl.pend.map(x => x.t).slice(0, 3).join('", "') + '"' + (pl.pend.length > 3 ? '…' : '') + '. Junta o recorta actividades.</p>') : ''));
    const hoyD = K.resumenDia(g, hoy), sig = C.siguienteClase(g, hoy), sigD = sig && K.resumenDia(g, sig);
    if (hoyD || sigD) h += '<div class="grid2">' + (hoyD ? card('<div class="kicker">Hoy</div>' + diaMini(hoyD) + link('Ver guion de hoy', 'clase/' + hoy, 'small primary'), 'cl-hoy') : '') + (sigD ? card('<div class="kicker">Próxima clase · ' + u.fLarga(sig) + '</div>' + diaMini(sigD) + link('Preparar', 'clase/' + sig, 'small')) : '') + '</div>';
    const semanas = {}; pl.bloques.forEach(b => { const d = u.parse(b.fecha); const lun = u.addDays(b.fecha, -((d.getDay() + 6) % 7)); (semanas[lun] = semanas[lun] || {})[b.fecha] = (semanas[lun][b.fecha] || []).concat([b]); });
    Object.keys(semanas).sort().forEach((lun, wi) => {
      h += '<h4 class="cl-sem">Semana ' + (wi + 1) + ' · ' + u.fCorta(lun) + '</h4><div class="cl-dias">' + Object.keys(semanas[lun]).sort().map(f => {
        const bs = semanas[lun][f], lista = !!S.get('asis:' + g.id + ':' + f);
        return '<a class="cl-dia ' + (f === hoy ? 'hoy ' : '') + (f < hoy ? 'pasada' : '') + '" href="#/clase/' + f + '"><div class="cl-f"><b>' + u.DIAS3[u.dow(f)] + ' ' + u.fDM(f) + '</b>' + (f < hoy && lista ? ' <span class="okc">✓</span>' : '') + '</div>' +
          bs.map(b => b.perdida ? '<div class="cl-b"><span class="muted small">' + b.inicio + ' · ' + b.horas + ' h</span> <s class="muted">sin clase</s></div>' : K.sesiones(b).map(se => '<div class="cl-b"><span class="muted small">' + (b.lugar !== 'aula' ? K.LUGARES[b.lugar][1] + ' ' : '') + se.ini + '–' + se.fin + '</span> ' + (se.parts.map(x => '<span class="cl-dot ' + x.it.m + '"></span>' + esc(x.it.t)).join(' · ') || '<span class="muted">libre</span>') + '</div>').join('')).join('') + '</a>';
      }).join('') + '</div>';
    });
    h += '<p class="muted small mt">Toca un día para ver el guion. 💻 = centro de cómputo, 🛠️ = taller: lo de computadora se acomoda solo en tus bloques de cómputo (Ajustes → Grupo y horario) y si un día te toca taller, cámbialo en ese día y se trae la siguiente práctica. Si una clase no se dio, márcala y todo se recorre; con "⇄" cambias el orden de dos actividades.</p>';
    return { t: 'Clases', h: h };
  };
  const diaMini = rs => '<ul class="cl-mini">' + rs.map(r => '<li><b>' + r.b.inicio + '–' + r.b.fin + '</b> ' + esc(r.txt) + '</li>').join('') + '</ul>';

  // ¿cómo salió la clase? completa, faltó una parte (por horas) o no se dio
  const salioHTML = b => {
    if (b.perdida) return '<div class="row end mt">' + btn('↺ Sí se dio esta clase', 'cl-perdida', 'data-key="' + b.key + '"', 'small ghost') + '</div>';
    const k = 'data-key="' + b.key + '"', on = c => c ? ' on' : '', rango = n => Array.from({ length: n }, (x, i) => i + 1);
    let h = '<div class="cl-salio mt"><b class="small">¿Cómo salió esta clase?</b>' +
      '<div class="cl-seg">' + btn('✓ Como se planeó', 'cl-ajuste', k + ' data-h="0"', 'small' + on(!b.recorte && !b.adelanto)) + btn('No se dio', 'cl-perdida', k, 'small ghost danger') + '</div>';
    if (b.horas > 1) h += '<div class="cl-fila"><span class="small muted">Me faltó tiempo:</span><div class="cl-seg">' + rango(b.horas - 1).map(x => btn('−' + x + ' h', 'cl-ajuste', k + ' data-h="-' + x + '"', 'small' + on(b.recorte === x))).join('') + '</div></div>';
    h += '<div class="cl-fila"><span class="small muted">Me adelanté:</span><div class="cl-seg">' + rango(Math.max(1, b.horas)).map(x => btn('+' + x + ' h', 'cl-ajuste', k + ' data-h="' + x + '"', 'small' + on(b.adelanto === x))).join('') + '</div></div>';
    return h + '<p class="muted small">Faltó tiempo: lo pendiente pasa a la siguiente clase. Te adelantaste (lo diste en menos tiempo y seguiste con lo que venía): lo siguiente se jala a esta clase y todo el parcial se recorre hacia antes.</p></div>';
  };

  /* ---------- vista: guion de un día ---------- */
  // una clase de 50 min dentro del bloque: sus actividades (o las partes que caen en ella) y su temporizador
  function sesionHTML(g, pid, f, b, se) {
    const key = b.key + '#' + se.s, enCurso = E.run.activo() && E.run.r.key === key;
    const rot = (se.n > 1 ? 'Clase ' + (se.s + 1) + ' de ' + se.n + ' · ' : '') + se.ini + '–' + se.fin + ' · 50 min';
    const boton = enCurso ? '<span class="chip ok">⏱ Clase en curso</span>' : btn('⏱ ' + (se.n > 1 ? 'Dar la clase ' + (se.s + 1) : 'Dar esta clase') + ' con temporizador', 'run-start', 'data-f="' + f + '" data-key="' + b.key + '" data-s="' + se.s + '"', 'primary');
    const cambio = se.parts.some(x => x.cambio) ? ' <span class="chip warn">Tema cambiado</span>' : '';
    return '<div class="cl-ses"><div class="row between gap wrap cl-ses-h"><b>' + rot + '</b>' + cambio + '</div><div class="row gap wrap">' + (se.parts.length ? boton : '') + btn('⇄ Cambiar tema', 'cl-tema', 'data-pid="' + pid + '" data-key="' + b.key + '" data-s="' + se.s + '"', 'small ghost') + '</div>' +
      (se.parts.map(x => actHTML(g, pid, x, key)).join('') || '<p class="muted small">Sin actividad de la secuencia en esta clase: úsala para repaso, recuperación o avance del proyecto.</p>') + '</div>';
  }

  V.clase = f => {
    const g = D.grupoActual(); if (!g) return H.noGroup();
    f = f || u.today(); const d = K.dia(g, f);
    const ant = C.claseAnterior(g, f), sig = C.siguienteClase(g, f);
    let h = '<div class="datebar"><button type="button" class="iconbtn" data-act="go" data-to="clase/' + (ant || f) + '" ' + (ant ? '' : 'disabled') + ' aria-label="Clase anterior">' + icon('chevL') + '</button><div class="datebox"><b>' + u.cap(u.fLarga(f)) + '</b><a class="small" href="#/clases' + (d ? '/' + d.p.id : '') + '">Ver todas las clases</a></div><button type="button" class="iconbtn" data-act="go" data-to="clase/' + (sig || f) + '" ' + (sig ? '' : 'disabled') + ' aria-label="Clase siguiente">' + icon('chevR') + '</button></div>';
    medVistos = new Set();
    if (!d || !d.bloques.length) return { t: 'Clase', h: h + card('<p>No tienes clase con ' + esc(g.nombre) + ' este día.</p>' + (sig ? link('Ir a la próxima clase', 'clase/' + sig, 'primary') : '')) };
    if (E.repaso) h += E.repaso.calHTML(g, f, d);
    d.bloques.forEach(b => {
      h += card('<div class="row between gap wrap"><h3>' + b.inicio + '–' + b.fin + ' · ' + b.horas + ' h</h3><label class="cl-lugar">' + K.LUGARES[b.lugar][1] + ' <select data-ch="cl-lugar" data-key="' + b.key + '" data-def="' + b.lugarDef + '" aria-label="Lugar de esta clase">' + Object.keys(K.LUGARES).map(k => '<option value="' + k + '" ' + (b.lugar === k ? 'selected' : '') + '>' + K.LUGARES[k][0] + '</option>').join('') + '</select></label></div>' +
        (b.lugar !== b.lugarDef ? '<p class="small muted">Solo este día; en tu horario este bloque es ' + K.LUGARES[b.lugarDef][0].toLowerCase() + '.</p>' : '') + (b.espera && b.libre ? '<p class="note">' + esc(b.espera) + '</p>' : '') +
        (b.perdida ? '<p class="muted">Marcaste que esta clase no se dio: sus actividades pasaron a la siguiente.</p>' : (b.lugar === 'taller' ? '<p class="note info small">🛠️ Taller: que trabajen en su proyecto. Explica solo lo indispensable (5 a 10 min) y deja el tiempo para armar y probar.</p>' : '') + K.sesiones(b).map(se => sesionHTML(g, d.p.id, f, b, se)).join('')) +
        (b.libre && b.parts.length ? '<p class="note">Te sobra ' + b.libre + ' h en este bloque.</p>' : '') +
        (!b.perdida && b.lugar === 'computo' && E.fc ? E.fc.bloqueHTML(g, d.p.id, b, d.bloques.filter(x => !x.perdida)) : '') +
        (b.recorte ? '<p class="note warn">' + (b.recorte === 1 ? 'Faltó 1 h' : 'Faltaron ' + b.recorte + ' h') + ': aquí queda solo lo que sí se dio y lo que no alcanzaste pasó a la siguiente clase' + (sig ? ' (' + u.fCorta(sig) + ')' : '') + '. ' + btn('↺ Quitar', 'cl-recorte-x', 'data-key="' + b.key + '"', 'small ghost') + '</p>' : '') +
        (b.adelanto ? '<p class="note ok">Te adelantaste ' + b.adelanto + ' h: esta clase cubrió también lo que venía después y todo el parcial se recorrió hacia antes. ' + btn('↺ Quitar', 'cl-recorte-x', 'data-key="' + b.key + '"', 'small ghost') + '</p>' : '') +
        salioHTML(b), 'cl-bloque');
    });
    if (E.repaso) h += E.repaso.bolHTML(g, f, d);
    h += '<div class="row gap wrap">' + link(icon('check') + ' Pasar lista', 'lista/' + f, 'primary') + (E.aula ? link(icon('grid') + ' Modo clase', 'aula/' + f, '') : '') + (E.cierre ? link('📝 Cierre del día', 'cierre/' + f, '') : '') + btn(icon('book') + ' Anotar en bitácora', 'cl-bit', 'data-f="' + f + '"') + '</div>';
    return { t: 'Clase', h: h };
  };

  /* ---------- acciones ---------- */
  E.changes['cl-lugar'] = el => {
    const g = D.grupoActual(), k = el.dataset.key, v = el.value, def = el.dataset.def;
    S.update('clases:' + g.id, st => { st.lugares = st.lugares || {}; if (v === def) delete st.lugares[k]; else st.lugares[k] = v; }, {});
    u.toast(v === 'taller' ? 'Listo: traje a este bloque la siguiente práctica de taller' : v === 'computo' ? 'Listo: este bloque ahora usa lo de computadora' : 'Listo: clase en el aula', 'ok', 4000);
  };
  A['cl-perdida'] = el => { const g = D.grupoActual(), k = el.dataset.key; S.update('clases:' + g.id, st => { st.perdidas = st.perdidas || {}; if (st.perdidas[k]) delete st.perdidas[k]; else st.perdidas[k] = true; }, {}); };
  A['cl-swap'] = el => {
    const g = D.grupoActual(), pid = el.dataset.pid, pos = Number(el.dataset.pos), seq = K.seq(g, pid);
    if (pos >= seq.length - 1) { u.toast('Es la última actividad del parcial', 'err'); return; }
    const ord = seq.map(x => x.id); const t = ord[pos]; ord[pos] = ord[pos + 1]; ord[pos + 1] = t;
    S.update('clases:' + g.id, st => { st.orden = st.orden || {}; st.orden[pid] = ord; }, {});
    u.toast('Cambié "' + seq[pos].t + '" por "' + seq[pos + 1].t + '"', 'ok', 4000);
  };
  // h < 0: faltó tiempo (se recorre hacia después) · h > 0: te adelantaste (se jala hacia antes) · 0: como se planeó
  A['cl-ajuste'] = el => {
    const g = D.grupoActual(), k = el.dataset.key, h = Number(el.dataset.h) || 0;
    S.update('clases:' + g.id, st => {
      st.recortes = st.recortes || {}; st.adelantos = st.adelantos || {}; delete st.recortes[k]; delete st.adelantos[k];
      if (h < 0) st.recortes[k] = -h; if (h > 0) st.adelantos[k] = h;
    }, {});
    u.toast(h < 0 ? 'Listo: ' + (h === -1 ? 'la hora que faltó pasa' : 'las ' + -h + ' h que faltaron pasan') + ' a la siguiente clase y todo se recorre' : h > 0 ? 'Listo: te adelantaste ' + h + ' h; lo siguiente se jaló a esta clase y todo se recorrió hacia antes' : 'Clase como se planeó', 'ok', 4500);
  };
  // ⇄ Cambiar tema: elige qué actividad del parcial se da en esa clase de 50 min (lo planeado se recorre)
  A['cl-tema'] = el => {
    const g = D.grupoActual(), pid = el.dataset.pid, key = el.dataset.key + '#' + el.dataset.s;
    const cur = (K.estado(g).cclase || {})[key];
    // solo lo de este parcial (no lo del siguiente, aunque vaya de corrido) y solo lo que todavía no das
    const pl = K.plan(g, pid), hoy = u.today(), ahora = new Date().toTimeString().slice(0, 5);
    const enParcial = new Set(), dadas = new Set();
    pl.bloques.forEach(b => b.parts.forEach(x => {
      enParcial.add(x.it.id);
      const ya = b.fecha < hoy || (b.fecha === hoy && b.fin <= ahora);
      if (ya && !b.perdida) dadas.add(x.it.id);
    }));
    const marcadas = K.estado(g).dadas || {};
    const lista = pl.seq.filter(x => enParcial.has(x.id) && !dadas.has(x.id) && !marcadas[x.id]).map(x => btn(x.t + ' · ' + x.tipo + ' · ' + (x.h0 != null ? x.h0 : x.h) + ' h', 'cl-tema-set', 'data-key="' + key + '" data-id="' + x.id + '"', 'small' + (cur === x.id ? ' primary' : ''))).join('');
    E.modal.open('Tema de esta clase', '<p class="small">Solo las actividades de ' + esc(C.parcial(pid).nombre) + ' que todavía no das. Lo que estaba planeado en esta hora se recorre a la siguiente clase.</p><div class="row gap wrap">' + (lista || '<span class="muted small">No quedan actividades pendientes de este parcial.</span>') + '</div>' +
      (cur ? '<div class="mt">' + btn('↺ Volver al plan', 'cl-tema-set', 'data-key="' + key + '" data-id=""', 'ghost') + '</div>' : ''));
  };
  // ✓ Ya la di: la actividad sale de lo pendiente (las clases ya pasadas no cambian)
  A['cl-dada'] = el => {
    const g = D.grupoActual(), id = el.dataset.id;
    const d = new Date(), p2 = n => String(n).padStart(2, '0');
    const desde = u.ymd(d) + '@' + p2(d.getHours()) + ':' + p2(d.getMinutes());
    S.update('clases:' + g.id, st => { st.dadas = st.dadas || {}; if (st.dadas[id]) delete st.dadas[id]; else st.dadas[id] = desde; }, {});
    u.toast((K.estado(g).dadas || {})[id] ? 'Listo: marcada como dada; las clases que siguen ya no la incluyen' : 'Listo: vuelve a estar pendiente', 'ok', 4000);
  };
  A['cl-tema-set'] = el => {
    const g = D.grupoActual(), key = el.dataset.key, id = el.dataset.id;
    S.update('clases:' + g.id, st => { st.cclase = st.cclase || {}; if (id) st.cclase[key] = id; else delete st.cclase[key]; }, {});
    E.modal.close(); u.toast(id ? 'Listo: esa clase va con el tema que elegiste' : 'Listo: esa clase vuelve al plan', 'ok', 4000);
  };
  A['cl-recorte-x'] = el => { const g = D.grupoActual(), k = el.dataset.key; S.update('clases:' + g.id, st => { if (st.recortes) delete st.recortes[k]; if (st.adelantos) delete st.adelantos[k]; }, {}); };
  A['cl-bit'] = el => {
    const g = D.grupoActual(), f = el.dataset.f, rs = K.resumenDia(g, f) || [], id = u.uid('bit');
    S.put('bit:' + id, { id: id, fecha: f, grupoId: g.id, texto: 'Clase: ' + rs.map(r => r.b.inicio + ' ' + r.txt).join(' | ') + '\nCómo salió: ' });
    location.hash = '#/bitacora';
  };

  /* ---------- dar la clase con temporizador: paso por paso, con aviso si te estás tardando ---------- */
  const LS_RUN = 'escuadra.run';
  const R = E.run = { r: null, h: null, lock: null };
  const mmss = s => { const n = Math.abs(Math.round(s)); return Math.floor(n / 60) + ':' + u.pad(n % 60); };
  R.activo = () => !!R.r;
  R.guardar = () => { try { if (R.r) localStorage.setItem(LS_RUN, JSON.stringify(R.r)); else localStorage.removeItem(LS_RUN); } catch (e) { } };
  // los pasos del guion que caen en este bloque (si una actividad se parte en dos clases, solo su parte).
  // Con s (0, 1, 2…) solo los pasos de esa clase de 50 min: la hora s del bloque.
  K.pasosBloque = (b, s) => {
    const out = [], lo = s == null ? -Infinity : s * 50, hi = s == null ? Infinity : (s + 1) * 50;
    let P = 0; // minuto del bloque donde empieza cada parte
    b.parts.forEach(x => {
      const it = x.it, ini = x.antes * 50, fin = (x.antes + x.h) * 50; let acc = 0;
      (it.pasos || [[it.h * 50, it.t]]).forEach(ps => {
        const a = acc, z = acc + ps[0]; acc = z;
        const m = Math.min(z, fin) - Math.max(a, ini); if (m <= 0) return;
        const bs = P + Math.max(a, ini) - ini, mm = Math.min(bs + m, hi) - Math.max(bs, lo);
        if (mm > 0) out.push({ t: ps[1], act: it.t, min: Math.round(mm), real: 0 });
      });
      P += x.h * 50;
    });
    return out;
  };
  // el bloque de 2 o 3 h se parte en clases de 50 min: cada hora del bloque es una clase con sus actividades
  const minHM = (hm, m) => { const [h, mi] = String(hm).split(':').map(Number), t = h * 60 + mi + m; return u.pad(Math.floor(t / 60) % 24) + ':' + u.pad(t % 60); };
  K.sesiones = b => {
    const tot = b.parts.reduce((s, x) => s + x.h, 0), n = Math.max(1, Math.ceil(b.horas), Math.ceil(tot));
    const hs = C.horasClases(b.inicio, n, b.fin), out = []; for (let s = 0; s < n; s++) out.push({ s: s, n: n, ini: hs[s].ini, fin: hs[s].fin, parts: [] });
    let P = 0;
    b.parts.forEach(x => {
      for (let s = P; s < P + x.h; s++) {
        const lo = Math.max(P, s), hi = Math.min(P + x.h, s + 1);
        out[s].parts.push({ it: x.it, h: hi - lo, antes: x.antes + (lo - P), sigue: hi < P + x.h || !!x.sigue, aviso: lo === P ? x.aviso : '', cambio: !!x.cambio });
      }
      P += x.h;
    });
    return out;
  };
  const ahora = () => R.r && R.r.pausa ? R.r.pausa : Date.now();
  R.calc = () => {
    const r = R.r, now = ahora(), p = r.pasos[r.i], el = (now - r.t0) / 1000, rest = p.min * 60 - el;
    let atraso = 0; for (let j = 0; j < r.i; j++) atraso += r.pasos[j].real - r.pasos[j].min * 60;
    atraso += Math.max(0, el - p.min * 60);
    let falta = Math.max(0, rest); for (let j = r.i + 1; j < r.pasos.length; j++) falta += r.pasos[j].min * 60;
    let quedan = null; if (r.fecha === u.today()) { const fin = u.parse(r.fecha); const hm = r.fin.split(':'); fin.setHours(Number(hm[0]), Number(hm[1]), 0, 0); quedan = (fin.getTime() - Date.now()) / 1000; if (quedan < -1800) quedan = null; }
    return { p: p, el: el, rest: rest, atraso: atraso, falta: falta, quedan: quedan };
  };
  // la ventana del proyector nunca muestra el temporizador (se revisa la dirección: el aviso puede llegar antes que presentador.js)
  const enPantalla = () => E.modoPantalla || /^#\/pantalla/.test(location.hash);
  R.barra = () => {
    if (enPantalla()) return;
    let el = document.getElementById('runbar');
    if (!R.r) { if (el) el.remove(); document.body.classList.remove('running'); return; }
    if (!el) { el = document.createElement('div'); el.id = 'runbar'; el.className = 'runbar'; document.body.appendChild(el); }
    document.body.classList.add('running');
    const r = R.r, p = r.pasos[r.i];
    el.innerHTML = '<div class="rb-row"><a class="rb-txt" href="#/clase/' + r.fecha + '" title="' + esc(p.act) + '"><span class="rb-k">Paso ' + (r.i + 1) + ' de ' + r.pasos.length + ' · <span id="rb-pace"></span></span><span class="rb-p">' + esc(p.t) + '</span></a><b class="rb-time" id="rb-time"></b></div>' +
      '<div class="rb-bar"><span id="rb-fill"></span></div>' +
      '<div class="rb-row rb-ctl"><span class="rb-left" id="rb-left"></span><span class="rb-btns"><button type="button" class="rb-b" data-act="run-prev" aria-label="Paso anterior" title="Paso anterior" ' + (r.i ? '' : 'disabled') + '>‹</button><button type="button" class="rb-b" data-act="run-pause" aria-label="' + (r.pausa ? 'Seguir' : 'Pausa') + '" title="' + (r.pausa ? 'Seguir' : 'Pausa') + '">' + icon(r.pausa ? 'play' : 'pause') + '</button><button type="button" class="rb-b" data-act="run-end" aria-label="Terminar la clase" title="Terminar la clase">' + icon('stop') + '</button><button type="button" class="rb-b rb-next" data-act="run-next">' + (r.i < r.pasos.length - 1 ? 'Siguiente ›' : 'Terminar ✓') + '</button></span></div>';
    R.tick(true);
  };
  const alerta = (msg, fuerte) => { u.toast(msg, fuerte ? 'err' : 'ok', 7000); if (fuerte && E.beep) E.beep(); if (navigator.vibrate) navigator.vibrate(fuerte ? [250, 120, 250] : 120); };
  R.tick = soloPintar => {
    if (!R.r) return; const r = R.r, k = R.calc(), al = r.alertas = r.alertas || {};
    const t = document.getElementById('rb-time'), f = document.getElementById('rb-fill'), pc = document.getElementById('rb-pace'), lf = document.getElementById('rb-left'), bar = document.getElementById('runbar');
    const est = k.rest > 60 ? 'ok' : k.rest > 0 ? 'warn' : 'over';
    const tx = (k.rest >= 0 ? '' : '+') + mmss(k.rest);
    if (t) t.textContent = tx; if (f) f.style.width = Math.min(100, k.el / (k.p.min * 60) * 100) + '%';
    if (bar) bar.dataset.st = r.pausa ? 'pausa' : est;
    const am = Math.round(k.atraso / 60);
    const pace = r.pausa ? 'en pausa' : am >= 2 ? '⚠ vas ' + am + ' min atrasado' : am <= -2 ? 'vas ' + (-am) + ' min adelantado' : 'a tiempo';
    if (pc) { pc.textContent = pace; pc.className = am >= 2 && !r.pausa ? 'badc' : ''; }
    if (lf) lf.textContent = k.quedan != null ? 'Quedan ' + Math.max(0, Math.round(k.quedan / 60)) + ' min de clase' : 'Guion: ' + Math.round(k.falta / 60) + ' min por dar';
    const pj = document.getElementById('pj-run'); if (pj) { pj.textContent = '⏱ ' + tx; pj.dataset.st = est; }
    if (soloPintar || r.pausa) return;
    if (k.rest <= 0 && !al['fin' + r.i]) { al['fin' + r.i] = 1; alerta('Se acabó el tiempo de «' + k.p.t.slice(0, 60) + '». Si ya terminaste, toca Siguiente.', true); R.guardar(); }
    if (k.rest <= -300 && !al['mas' + r.i]) { al['mas' + r.i] = 1; alerta('Llevas 5 min de más en este paso: ¿lo cierras o recortas otro?', true); R.guardar(); }
    if (k.quedan != null && k.falta - k.quedan > 180 && !al.noalc) { al.noalc = 1; alerta('No alcanzas: te faltan ' + Math.round(k.falta / 60) + ' min de guion y quedan ' + Math.max(0, Math.round(k.quedan / 60)) + ' min de clase. Recorta un paso o, al terminar, recorre lo que falte.', true); R.guardar(); }
  };
  R.loop = () => { clearInterval(R.h); R.h = setInterval(() => R.tick(false), 1000); };
  R.wake = async on => { try { if (on && navigator.wakeLock && !R.lock) R.lock = await navigator.wakeLock.request('screen'); if (!on && R.lock) { await R.lock.release(); R.lock = null; } } catch (e) { } };
  A['run-start'] = el => {
    const g = D.grupoActual(), f = el.dataset.f, bk = el.dataset.key, d = K.dia(g, f), b = d && d.bloques.find(x => x.key === bk);
    if (!b || !b.parts.length) { u.toast('Esta clase no tiene actividades', 'err'); return; }
    if (R.r && !confirm('Ya tienes una clase en curso. ¿Terminarla sin guardar y empezar esta?')) return;
    const now = Date.now(), s = el.dataset.s != null && el.dataset.s !== '' ? Number(el.dataset.s) : null;
    const se = s != null ? K.sesiones(b)[s] : null, pasos = K.pasosBloque(b, s);
    if (!pasos.length) { u.toast('Esta clase no tiene pasos de guion: úsala para repaso o avance', 'err'); return; }
    // con sesión: el temporizador dura 50 min y su tiempo no recorre el bloque (eso se marca con «¿Cómo salió?»)
    R.r = { key: se ? bk + '#' + s : bk, sess: s, fecha: f, inicio: se ? se.ini : b.inicio, fin: se ? se.fin : b.fin, horas: se ? 1 : b.horas, ids: (se ? se.parts : b.parts).map(x => x.it.id), pasos: pasos, i: 0, t0: now, start: now, pausa: 0, alertas: {} };
    try { E.ui.audio = E.ui.audio || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { }
    R.guardar(); R.barra(); R.loop(); R.wake(true); E.render();
    u.toast('⏱ Clase en curso: te aviso cuando se acabe el tiempo de cada paso', 'ok', 4000);
  };
  A['run-next'] = () => {
    const r = R.r; if (!r || r.pausa) { if (r && r.pausa) A['run-pause'](); return; }
    const now = Date.now(); r.pasos[r.i].real = (now - r.t0) / 1000; r.pasos[r.i].done = true;
    if (r.i >= r.pasos.length - 1) { R.fin(); return; }
    r.i++; r.t0 = now; R.guardar(); R.barra(); E.render();
  };
  A['run-prev'] = () => {
    const r = R.r; if (!r || !r.i) return; const now = ahora();
    r.i--; const p = r.pasos[r.i]; r.t0 = now - (p.real || 0) * 1000; p.real = 0; p.done = false; delete (r.alertas || {})['fin' + r.i]; delete (r.alertas || {})['mas' + r.i];
    R.guardar(); R.barra(); E.render();
  };
  A['run-pause'] = () => {
    const r = R.r; if (!r) return;
    if (r.pausa) { const d = Date.now() - r.pausa; r.t0 += d; r.start += d; r.pausa = 0; } else r.pausa = Date.now();
    R.guardar(); R.barra();
  };
  A['run-end'] = () => { if (R.r) R.fin(); };
  R.fin = () => {
    const r = R.r, now = ahora(); clearInterval(R.h);
    if (!r.pasos[r.i].done) r.pasos[r.i].real = (now - r.t0) / 1000;
    const plan = r.pasos.reduce((s, p) => s + p.min, 0), real = r.pasos.reduce((s, p) => s + (p.real || 0), 0) / 60;
    let faltan = 0; r.pasos.forEach((p, j) => { if (!p.done) faltan += j === r.i ? Math.max(0, p.min - (p.real || 0) / 60) : p.min; });
    // con sesión de 50 min el tiempo no recorre ni adelanta el bloque: eso se ajusta en «¿Cómo salió?»
    const conSesion = r.sess != null;
    const hRec = conSesion ? 0 : Math.min(r.horas, Math.round(faltan / 50 * 2) / 2);
    // terminaste el guion con tiempo de sobra: si seguiste con lo que venía, se puede adelantar
    const hAde = conSesion ? 0 : !faltan && plan - real >= 40 ? Math.max(1, Math.min(r.horas, Math.round((plan - real) / 50))) : 0;
    R.resumen = { r: r, plan: plan, real: real, faltan: faltan, hRec: hRec, hAde: hAde };
    const fila = p => '<tr><td class="l">' + esc(p.t) + '</td><td>' + p.min + '</td><td>' + (p.real ? Math.round(p.real / 60) : '—') + '</td><td class="' + (p.real && p.real / 60 - p.min > 2 ? 'badc' : '') + '">' + (p.real ? ((p.real / 60 - p.min >= 0 ? '+' : '') + Math.round(p.real / 60 - p.min)) : '') + '</td></tr>';
    E.modal.open('¿Cómo te fue con el tiempo?', '<p>Planeado <b>' + plan + ' min</b> · real <b>' + Math.round(real) + ' min</b>' + (faltan ? ' · te faltaron <b>' + Math.round(faltan) + ' min</b> del guion' : ' · completaste el guion') + '.</p>' +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">Paso</th><th>Plan</th><th>Real</th><th>±</th></tr></thead><tbody>' + r.pasos.map(fila).join('') + '</tbody></table></div>' +
      (hAde ? '<p class="note ok small">Terminaste ' + Math.round(plan - real) + ' min antes. Si en ese tiempo seguiste con lo que venía, toca <b>Guardar y adelantar</b>: lo siguiente se jala a esta clase y todo se recorre hacia antes.</p>' : '') +
      '<div class="row gap wrap mt">' + (hRec > 0 ? btn('Guardar y recorrer ' + hRec + ' h a la próxima clase', 'run-save', 'data-rec="1"', 'primary') + btn('Solo guardar', 'run-save', 'data-rec="0"') : hAde ? btn('Guardar y adelantar ' + hAde + ' h', 'run-save', 'data-ade="1"', 'primary') + btn('Solo guardar', 'run-save', 'data-rec="0"') : btn('Guardar en la bitácora', 'run-save', 'data-rec="0"', 'primary')) + btn('Seguir con la clase', 'run-resume', '', 'ghost') + '</div>' +
      '<p class="muted small">Se guarda en tu bitácora con los tiempos de cada paso. ' + (conSesion ? 'Si esta clase se te alargó, lo que falte ponlo en «¿Cómo salió esta clase?» (Me faltó tiempo) para que pase a la siguiente.' : 'Si recorres, lo que faltó pasa a la siguiente clase y todo el parcial se acomoda.') + '</p>');
  };
  A['run-resume'] = () => { E.modal.close(); if (R.r) { R.loop(); R.barra(); } };
  A['run-save'] = el => {
    const z = R.resumen; if (!z) return; const r = z.r, g = D.grupoActual(), id = u.uid('bit');
    const det = r.pasos.map(p => '• ' + p.t.slice(0, 70) + ': plan ' + p.min + ' / real ' + (p.real ? Math.round(p.real / 60) : '—') + ' min').join('\n');
    S.put('bit:' + id, { id: id, fecha: r.fecha, grupoId: g.id, texto: 'Clase ' + r.inicio + '–' + r.fin + ' con temporizador: planeado ' + z.plan + ' min, real ' + Math.round(z.real) + ' min' + (z.faltan ? ', faltaron ' + Math.round(z.faltan) + ' min' : '') + (el.dataset.rec === '1' ? ' (se recorrieron ' + z.hRec + ' h a la siguiente clase)' : '') + (el.dataset.ade === '1' ? ' (se adelantaron ' + z.hAde + ' h del plan)' : '') + '.\n' + det });
    S.update('tiempos:' + g.id, l => { l.push({ fecha: r.fecha, key: r.key, ids: r.ids, pasos: r.pasos.map(p => [p.t.slice(0, 60), p.min, p.real ? Math.round(p.real / 60) : null]) }); return l.slice(-200); }, []);
    if (el.dataset.rec === '1' && z.hRec > 0) S.update('clases:' + g.id, st => { st.recortes = st.recortes || {}; st.recortes[r.key] = z.hRec; if (st.adelantos) delete st.adelantos[r.key]; }, {});
    if (el.dataset.ade === '1' && z.hAde > 0) S.update('clases:' + g.id, st => { st.adelantos = st.adelantos || {}; st.adelantos[r.key] = z.hAde; if (st.recortes) delete st.recortes[r.key]; }, {});
    R.r = null; R.resumen = null; R.guardar(); R.barra(); R.wake(false); E.modal.close();
    u.toast(el.dataset.rec === '1' ? 'Guardado. Lo que faltó pasó a la siguiente clase.' : el.dataset.ade === '1' ? 'Guardado. Te adelantaste: todo se recorrió hacia antes.' : 'Guardado en la bitácora', 'ok', 5000);
  };
  // si la página se recargó a media clase, el temporizador sigue
  setTimeout(() => { if (enPantalla()) return; try { const x = JSON.parse(localStorage.getItem(LS_RUN) || 'null'); if (x && x.pasos && x.pasos.length) { R.r = x; R.barra(); R.loop(); } } catch (e) { } }, 0);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && R.r) { R.tick(false); if (!R.r.pausa) R.wake(true); } });
})();
