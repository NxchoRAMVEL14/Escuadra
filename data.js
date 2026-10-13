/* Escuadra · datos del programa de estudios y valores iniciales.
   Fuente del programa: Programa de estudios "Técnico en Mecatrónica", SEP/SEMS/COSFAC,
   clave 3071300008-23, 2ª edición, julio 2024. Las páginas indicadas (pag) son las del PDF oficial.
   Aquí NO hay datos de alumnos: la lista se importa desde la app y vive solo en tu cuenta. */
window.E = window.E || {};
(function (E) {
  'use strict';

  E.FUENTE_PROGRAMA = 'Programa de estudios Técnico en Mecatrónica, SEP/SEMS/COSFAC, clave 3071300008-23, 2ª ed., julio 2024';

  E.PROGRAMA = {
    nombre: 'Técnico en Mecatrónica',
    modulos: {
      I: {
        nombre: 'Construye circuitos electrónicos', horas: 272, semestre: 2, pag: 13,
        resultados: ['Construir circuitos electrónicos', 'Comprobar el funcionamiento de circuitos electrónicos', 'Ensamblar circuitos electrónicos analógicos', 'Diseñar circuitos electrónicos digitales'],
        sinco: ['2633 Técnicos en mantenimiento y reparación de maquinaria e instrumentos industriales', '2634 Mecánicos en mantenimiento y reparación de maquinaria e instrumentos industriales'],
        scian: ['334519 Fabricación de otros instrumentos de medición, control, navegación, y equipo médico electrónico', '811410 Reparación y mantenimiento de aparatos eléctricos para el hogar y personales', '811219 Reparación y mantenimiento de otro equipo electrónico y de equipo de precisión'],
        fuentes: [
          'Bolton, W. (2013). Mecatrónica: sistemas de control electrónico en ingeniería (5ª ed.). Alfaomega.',
          'Botero, O. (2022). Electrónica digital. Conceptos y métodos básicos. Red Educativa Digital Descartes.',
          'Boylestad, R. L. y Nashelsky, L. (2009). Electrónica: teoría de circuitos y dispositivos electrónicos (10ª ed.). Pearson.',
          'Datasheetcatalog (2010). Hojas de datos de componentes electrónicos. datasheetcatalog.com',
          'Hayt, W., Kemmerly, J. y Durbin, S. (2012). Análisis de circuitos en ingeniería (8ª ed.). McGraw-Hill.',
          'Hermosa, A. (2009). Principios de electricidad y electrónica 1 (3ª ed.). Alfaomega.',
          'Lajara, J. y Pelegrí, J. (2013). Diseño de circuitos impresos con Eagle. Marcombo.',
          'Pérez Montiel, H. (2015). Física general, unidad 12: Electricidad. Grupo Editorial Patria.',
          'Tocci, R. (2007). Sistemas digitales: principios y aplicaciones (10ª ed.). Pearson.',
          'NMX-J-136-ANCE-2019. Abreviaturas y símbolos para diagramas, planos y equipos eléctricos.',
          'NOM-008-SCFI-2002. Sistema general de unidades de medida. (Hoy rige la NOM-008-SE-2021, DOF 29/12/2023.)',
          'NOM-017-STPS-2008. Equipo de protección personal. (Hoy rige la NOM-017-STPS-2024, DOF 28/03/2025.)',
          'NOM-018-STPS-2000. Identificación y comunicación de peligros por sustancias químicas. (Hoy rige la NOM-018-STPS-2015.)',
          'PROY-NOM-005-STPS-2017. Manejo de sustancias químicas peligrosas. (Quedó en proyecto; hoy rige la NOM-005-STPS-1998.)',
          'NOM-022-STPS-2008. Electricidad estática. (Hoy rige la NOM-022-STPS-2015.)'
        ],
        sub: {
          '1': {
            nombre: 'Comprueba el funcionamiento de circuitos electrónicos', horas: 64,
            ac: [
              {
                titulo: 'Interpreta planos y diagramas electrónicos', pag: 14, ev: 'D',
                producto: 'La identificación de los componentes electrónicos, funciones, simbología y sus interconexiones en un plano y diagramas', instr: 'R',
                desarrollo: [
                  'Identifica los componentes físicos y las funciones (fuentes de voltaje, resistores, capacitores, inductores, transformadores, transistores, líneas de conexión, entre otros) del circuito electrónico desarmando diversos dispositivos electrónicos; siguiendo instrucciones del jefe inmediato, utilizando herramientas y equipos y atendiendo las normas de seguridad e higiene.',
                  'Distingue el tipo de conexión de acuerdo con su diseño en serie, paralelo o mixto utilizando resistencias, capacitancias, inductancias y otros elementos electrónicos en conexiones RC y RLC, colaborando en equipos de trabajo, asumiendo una actitud de respeto con sus pares y comunicación empática.',
                  'Reconoce los elementos, nombres, valores, códigos de colores y simbología electrónica en un plano y diagrama, identificando sus componentes, su funcionamiento y cómo se conectan entre ellos, trabajando en equipo y reportando su resultado a su jefe inmediato mediante el uso de las TIC.'
                ],
                tx: [[2,7,14,18,22],[0,2,7,10,11,13,14,15,18,22],[0,2,4,7,11,14,18,22]],
                criterios: ['Identifica cada componente físico y su función (fuente, resistor, capacitor, inductor, diodo, transistor, transformador)', 'Relaciona cada componente con su símbolo en el diagrama', 'Lee el valor de resistores (código de colores) y de capacitores', 'Distingue conexiones en serie, paralelo y mixtas en el diagrama', 'Desarma y extrae componentes con la herramienta adecuada, sin dañar la placa', 'Trabaja con orden y sigue las normas de seguridad (EPP, cautín, descarga electrostática)']
              },
              {
                titulo: 'Verifica las variables eléctricas del circuito electrónico', pag: 15, ev: 'P',
                producto: 'Los valores de las variables eléctricas del circuito electrónico calculadas y contrastadas con la hoja del fabricante', instr: 'R',
                desempeno: 'La comparación de los valores de las mediciones de los componentes electrónicos con las especificaciones de las hojas del fabricante, utilizando herramientas de diagnóstico', instrD: 'GO',
                desarrollo: [
                  'Calcula los valores de corriente, voltaje y potencia eléctrica, utilizando las leyes fundamentales de la electrónica (ley de Ohm, ley de Watt, leyes de Kirchhoff) siguiendo métodos matemáticos establecidos, trabajando de manera autónoma y en colaboración con el equipo; reportando sus resultados a su jefe inmediato mediante las TIC.',
                  'Interpreta los datos de los componentes electrónicos analizando las partes, simbología, tipos de conexión, tabla de valores, entre otros, especificadas en la hoja del fabricante (datasheet); utilizando el pensamiento matemático y asumiendo una postura crítica al resolver problemas y tomar decisiones.',
                  'Compara el valor real de las variables eléctricas del circuito electrónico con la especificación de las hojas del fabricante; utilizando herramientas y equipos de medición, aplicando técnicas y métodos establecidos, regulando sus emociones para concentrarse y evitar accidentes, siguiendo las normas de seguridad e higiene vigentes para el logro de metas; reportando a su jefe inmediato sus resultados mediante las TIC.'
                ],
                tx: [[2,7,18,21],[0,2,4,7,18,20,22],[0,2,4,7,9,12,15,18,20,21]],
                criterios: ['Calcula corriente, voltaje y potencia con la ley de Ohm y la ley de Watt', 'Aplica las leyes de Kirchhoff en circuitos serie, paralelo y mixtos', 'Obtiene los datos clave de la hoja del fabricante (valores máximos, terminales, tolerancia)', 'Mide voltaje, corriente y resistencia con el multímetro en la función y conexión correctas', 'Compara lo calculado con lo medido y explica la diferencia (tolerancia, error)', 'Reporta los resultados en tabla y con unidades']
              }
            ]
          },
          '2': {
            nombre: 'Ensambla circuitos electrónicos analógicos', horas: 112,
            ac: [
              {
                titulo: 'Arma circuitos electrónicos analógicos', pag: 17, ev: 'P',
                producto: 'El circuito electrónico analógico armado, utilizando el software de simulación y la tablilla experimental', instr: 'LC',
                desarrollo: [
                  'Selecciona los componentes del sistema electrónico, considerando su funcionamiento (pasivo o activo), de acuerdo con su aplicación y las hojas de especificaciones; colaborando en equipos de trabajo, regulando sus emociones para concentrarse y evitar accidentes, siguiendo las normas de seguridad e higiene vigentes y considerando la economía ecológica.',
                  'Comprueba el diseño de circuitos electrónicos establecido, utilizando software de simulación; considerando el impacto ecológico de los desechos, siguiendo instrucciones, trabajando en equipo y comunicándose asertivamente.',
                  'Ensambla los circuitos electrónicos, utilizando la tablilla experimental (protoboard); siguiendo instrucciones de su jefe inmediato, colaborando en equipo y de forma autónoma; comunicándose de manera asertiva y empática; regulando sus emociones para concentrarse y evitar accidentes, siguiendo las normas de seguridad e higiene vigentes.'
                ],
                tx: [[0,1,7,9,12,14,18,22,26],[0,2,4,7,9,14,18,21,22,26],[0,2,4,7,9,12,14,22,26]],
                criterios: ['Selecciona componentes según su función y la hoja de datos (pasivos y activos)', 'Simula el circuito antes de armarlo y corrige errores', 'Arma en protoboard con orden, sin puentes sueltos ni cortos', 'Respeta la polaridad de diodos, LED, capacitores electrolíticos y transistores', 'El circuito funciona y sus mediciones coinciden con la simulación', 'Separa los desechos electrónicos para reciclaje']
              },
              {
                titulo: 'Monta circuitos electrónicos en placas de circuito impreso', pag: 18, ev: 'P',
                producto: 'El circuito electrónico montado en placas impresas', instr: 'LC',
                desarrollo: [
                  'Dibuja el circuito en placas de fabricación, optimizando el espacio, utilizando software de diseño PCB y aplicando técnicas e ideas creativas para la resolución de problemas, colaborando en equipo y asumiendo una actitud de respeto con sus pares para el logro de metas.',
                  'Instala los circuitos electrónicos en placas de circuito impreso (PCB) aplicando técnicas y metodologías establecidas (impresión y/o maquinado con fresadora CNC) optimizando el uso de los materiales disponibles; colaborando en equipo de trabajo y de forma autónoma, regulando sus emociones para concentrarse y evitar accidentes, siguiendo las normas de seguridad e higiene y atendiendo las instrucciones del jefe inmediato.',
                  'Suelda los componentes en placa PCB, de acuerdo con el diseño del circuito electrónico de forma autónoma y colaborativa; utilizando materiales y equipo, optimizando los recursos; asumiendo una actitud de respeto y responsabilidad, siguiendo las normas de seguridad e higiene para evitar accidentes.'
                ],
                tx: [[2,4,7,11,14,17,18,20,22,26],[7,9,11,12,15,18,20,22,26],[7,9,11,12,14,18,22,26]],
                criterios: ['Diseña el PCB a partir del esquemático, con pistas sin cruces y de ancho adecuado', 'Acomoda los componentes optimizando el espacio de la placa', 'Fabrica o arma la placa siguiendo el procedimiento y las medidas de seguridad', 'Suelda con puntos brillantes, sin puentes ni soldadura fría', 'Comprueba continuidad y ausencia de cortos antes de energizar', 'El circuito funciona en la placa']
              }
            ]
          },
          '3': {
            nombre: 'Diseña circuitos electrónicos digitales', horas: 96,
            ac: [
              {
                titulo: 'Elabora el diagrama del circuito electrónico digital', pag: 20, ev: 'P',
                producto: 'El diagrama del circuito electrónico digital elaborado, aplicando métodos y técnicas', instr: 'LC',
                desarrollo: [
                  'Define la función del circuito digital aplicando el sistema de numeración adecuado (decimal, binario, octal, hexadecimal y BCD) al realizar las conversiones entre sistemas de numeración; utilizando el pensamiento matemático, siguiendo instrucciones y comunicando sus resultados a su jefe inmediato.',
                  'Diseña circuitos lógicos digitales, identificando el funcionamiento de las compuertas lógicas y su simbología combinándolas mediante diversos métodos como, circuito esquemático, expresión booleana y tabla de verdad, utilizando las tecnologías de información y comunicación; trabajando de forma autónoma y colaborativa, asumiendo una actitud empática hacia las ideas y opiniones de sus pares.',
                  'Aplica técnicas de reducción de circuitos lógicos (álgebra de Boole, mapas de Karnaugh) optimizando la cantidad de elementos necesarios para la construcción del circuito regulando sus emociones y sentimientos para concentrarse y mejorar la toma de decisiones para la resolución de problemas.',
                  'Determina la secuencia lógica (síncrona y asíncrona), en contadores (ascendentes y descendentes) para representar esquemas y diagramas de circuitos digitales, utilizando el pensamiento matemático, trabajando de forma individual y en equipo; respetando las ideas y opiniones de sus pares para el logro de sus objetivos y metas.'
                ],
                tx: [[0,2,4,7,18,20],[2,4,7,11,14,16,18,20,22],[2,4,7,11,12,18,20,22,26],[2,4,7,10,12,14,16,18,20,21,22]],
                criterios: ['Convierte entre decimal, binario, octal, hexadecimal y BCD', 'Obtiene la tabla de verdad a partir del enunciado', 'Escribe la expresión booleana y la simplifica (álgebra de Boole o mapa de Karnaugh)', 'Dibuja el diagrama con la simbología de compuertas y la numeración de terminales', 'Determina la secuencia de un contador (ascendente o descendente)']
              },
              {
                titulo: 'Verifica el funcionamiento del circuito digital', pag: 22, ev: 'P',
                producto: 'El circuito digital en funcionamiento', instr: 'LC',
                desarrollo: [
                  'Simula el circuito digital, utilizando software de diseño o aplicaciones móviles, trabajando de forma creativa, autónoma y colaborativa; respetando las ideas y opiniones de sus pares en la solución de problemas, logro de sus objetivos y metas; ahorrando los recursos energéticos.',
                  'Arma el circuito digital en la tablilla experimental (protoboard) optimizando la cantidad de compuertas y cableado para su construcción, considerando el concepto central del Nexo impacto ecológico; trabajando de forma autónoma y colaborativa, regulando sus emociones, sentimientos e impulsos en la toma de decisiones para la resolución de problemas y logro de metas.',
                  'Valida el funcionamiento del circuito controlando las señales de entrada con interruptores dip switch o señales de reloj, visualizando las de salida en lámparas lógicas y display de 7 segmentos, colaborando en equipo y con mentalidad de crecimiento, respetando las ideas y opiniones de sus pares en la toma de decisiones en la solución de problemas y logro de metas.'
                ],
                tx: [[1,2,4,7,10,14,17,18,21,22,23],[2,4,7,12,14,20,21,22,23],[1,2,4,7,10,11,14,18,20,21,26]],
                criterios: ['Simula el circuito y comprueba la tabla de verdad', 'Arma en protoboard con los circuitos integrados bien alimentados (Vcc y GND)', 'Usa interruptores DIP o reloj en las entradas y LED o display en las salidas', 'El circuito cumple la tabla de verdad o la secuencia del contador', 'Optimiza compuertas y cableado', 'Localiza y corrige fallas con método']
              }
            ]
          }
        }
      },
      II: {
        nombre: 'Construye sistemas mecatrónicos', horas: 272, semestre: 3, pag: 32,
        resultados: ['Construir sistemas mecatrónicos', 'Dibujar planos de elementos mecánicos', 'Construir mecanismos de sistemas mecatrónicos', 'Instalar sistemas neumáticos, electroneumáticos, hidráulicos y electrohidráulicos'],
        sinco: ['2633 Técnicos en mantenimiento y reparación de maquinaria e instrumentos industriales', '2634 Mecánicos en mantenimiento y reparación de maquinaria e instrumentos industriales', '8211 Ensambladores y montadores de herramientas, maquinaria, equipos y productos metálicos'],
        scian: ['541340 Servicios de dibujo', '3399 Otras industrias manufactureras', '811312 Reparación y mantenimiento de maquinaria y equipo industrial'],
        fuentes: [
          'Bolton, W. (2013). Mecatrónica: sistemas de control electrónico en la ingeniería mecánica y eléctrica (5ª ed.). Alfaomega.',
          'Myszka, D. H. (2012). Máquinas y mecanismos (4ª ed.). Pearson.',
          'Rivera, J. C. D. (2021). Manual de Mecanismos. Centro Nacional de Actualización Docente (CNAD).',
          'Olmedo, J. F. y Echeverría, J. F. (2018). Máquinas y Mecanismos. Universidad de las Fuerzas Armadas ESPE.',
          'Estrada, J. A. y Llamas, A. E. (2012). Dibujo Técnico I. Universidad Autónoma de Sinaloa.',
          'Guillén, A. S. (1999). Introducción a la Neumática. Alfaomega Marcombo.',
          'Serrano, A. (2009). Neumática práctica. Paraninfo.',
          'Ruiz, R. G. (2015). Manual de Neumática. CNAD.',
          'NMX-J-136-ANCE-2019. Abreviaturas y símbolos para diagramas, planos y equipos eléctricos.',
          'NOM-008-SCFI-2002. Sistema general de unidades de medida. (Hoy rige la NOM-008-SE-2021, DOF 29/12/2023.)',
          'NOM-017-STPS-2008. Equipo de protección personal. (Hoy rige la NOM-017-STPS-2024, DOF 28/03/2025.)',
          'NOM-Z-68-1986. Dibujo técnico: dimensiones y formatos de las láminas de dibujo.'
        ],
        sub: {
          '1': {
            nombre: 'Dibuja planos de elementos mecánicos', horas: 64,
            ac: [
              {
                titulo: 'Representa el elemento mecánico en un plano o diagrama', pag: 33,
                producto: 'El elemento mecánico representado en un plano o diagrama de vistas ortogonales e isométricas', instr: 'LC',
                desarrollo: [
                  'Aplica los sistemas de unidades en la elaboración de dibujos 2D, realizando conversiones, utilizando técnicas de dibujo, de acuerdo con la normatividad vigente, empleando el pensamiento matemático, creatividad y autonomía en el trabajo.',
                  'Elabora dibujo isométrico y proyección de vistas ortogonales empleando procedimientos de dibujo técnico, creatividad, con una mentalidad de crecimiento; siguiendo instrucciones del jefe inmediato; trabajando de manera autónoma y colaborativa para ser retroalimentado.',
                  'Representa piezas mecánicas en un plano o diagrama, aplicando métodos y técnicas de dibujo con creatividad; utilizando instrumentos y equipos, siguiendo instrucciones del jefe inmediato, manteniendo comunicación y mentalidad de crecimiento durante la retroalimentación.'
                ],
                criterios: ['Usa el sistema de unidades indicado y convierte correctamente', 'Traza el isométrico con proporciones correctas', 'Proyecta y alinea las vistas ortogonales', 'Aplica el alfabeto de líneas (visibles, ocultas, ejes, cotas)', 'Acota fuera del contorno y sin cruzar líneas', 'Entrega limpio, con escala y cuadro de datos']
              },
              {
                titulo: 'Diseña el elemento mecánico en un plano 2D y 3D', pag: 34,
                producto: 'El elemento mecánico diseñado en un plano 2D y 3D', instr: 'LC',
                desarrollo: [
                  'Esboza elementos mecánicos en 2D, utilizando software de CAD, identificando sus funciones y comandos; siguiendo instrucciones del jefe inmediato, trabajando de manera autónoma y creativa; reportando sus resultados.',
                  'Determina el método de elaboración de un modelo mecánico en 3D, atendiendo la aplicación y función de la pieza, considerando el impacto ecológico de los materiales para su fabricación, trabajando de manera autónoma, colaborativa y creativa; reportando sus resultados.',
                  'Aplica funciones (extruir, revolución, vaciado, entre otras) para la construcción de piezas en 3D acorde con las características y necesidades del modelo que se solicita, siguiendo instrucciones del jefe inmediato, trabajando de manera autónoma y creativa; reportando sus resultados.',
                  'Modela piezas mecánicas en un plano, con los elementos que la conforman (vistas ortogonales, cotas, cuadro de datos, escalas, material, entre otros); seleccionando el método de elaboración, siguiendo instrucciones y evitando desperdicio de recursos.'
                ],
                criterios: ['El boceto 2D queda completamente restringido en FreeCAD', 'Elige la operación 3D adecuada (extrusión, revolución, vaciado)', 'El modelo 3D respeta las medidas del plano', 'El plano incluye vistas, cotas, escala, material y cuadro de datos', 'Justifica el material considerando su impacto ecológico']
              }
            ]
          },
          '2': {
            nombre: 'Construye mecanismos de sistemas mecatrónicos', horas: 112,
            ac: [
              {
                titulo: 'Representa el ensamble mecánico en vista explosionada', pag: 36,
                producto: 'El ensamble mecánico en vista explosionada representado en un plano', instr: 'LC',
                desarrollo: [
                  'Ensambla piezas mecánicas prediseñadas, identificando sus funciones (coincidente, concéntrica, tangente, paralelo y ortogonal, entre otras), siguiendo instrucciones del jefe inmediato y las normas de seguridad e higiene, trabajando de manera autónoma y creativa; reportando sus resultados; cuidando los recursos disponibles.',
                  'Verifica el funcionamiento de las piezas mecánicas por medio de simulación, modificando, en su caso, los posibles fallos por colisión entre los elementos y considerando el impacto ecológico que genera el análisis de movimiento previo a su fabricación, siguiendo instrucciones para el logro de metas.',
                  'Obtiene plano del ensamble mecánico en vista explosionada con los elementos que la conforman (cotas, cuadro de datos, escalas, material, entre otros), mostrando el resultado a su jefe inmediato, manteniendo una comunicación efectiva y regulando sus emociones durante la retroalimentación.'
                ],
                criterios: ['Ensambla las piezas con las uniones correctas (coincidente, concéntrica, paralela…)', 'Simula el movimiento y corrige colisiones', 'La vista explosionada muestra todas las piezas en orden de armado', 'El plano incluye lista de partes, escala, material y cuadro de datos', 'Explica el funcionamiento del ensamble al revisar']
              },
              {
                titulo: 'Modela piezas mecánicas', pag: 37,
                producto: 'La pieza mecánica modelada en plantillas de diferentes materiales', instr: 'LC',
                desarrollo: [
                  'Clasifica los elementos que conforman los mecanismos de piezas mecánicas, de acuerdo con su funcionamiento, características, tipo de construcción y movimiento siguiendo instrucciones del jefe inmediato.',
                  'Diseña modelos de piezas mecánicas en plantillas de diferentes materiales (MDF o plástico) que cumplan con las características para ser aplicadas en un mecanismo, considerando la optimización de recursos trabajando de manera autónoma y creativa; reportando sus resultados para el logro de metas.'
                ],
                criterios: ['Clasifica los elementos del mecanismo por función y tipo de movimiento', 'Las plantillas tienen medidas y barrenos correctos (escala 1:1)', 'Acomoda las plantillas para desperdiciar el mínimo de material', 'La plantilla permite fabricar la pieza sin ajustes mayores']
              },
              {
                titulo: 'Arma mecanismos de sistemas mecatrónicos', pag: 38,
                producto: 'El mecanismo de sistema mecatrónico armado', instr: 'LC',
                desarrollo: [
                  'Diseña piezas o elementos que conforma un mecanismo mecatrónico (base, eslabón motriz, eslabón conector y eslabón conducido) colaborando en equipo, siguiendo instrucciones utilizando el pensamiento matemático, técnicas de dibujo y tecnología.',
                  'Determina el tipo de material y la geometría de las piezas mecánicas, considerando el impacto ecológico que genera su fabricación y las normas de seguridad e higiene vigentes; trabajando en forma autónoma y colaborativa, siguiendo instrucciones y reportando al jefe inmediato sus resultados; regulando sus emociones al momento de recibir retroalimentación.',
                  'Construye piezas o elementos, usando herramientas manuales para su armado con base en su aplicación optimizando los materiales disponibles y siguiendo las normas de seguridad e higiene vigentes, e instrucciones del jefe inmediato, reportando sus logros, con una comunicación asertiva y uso de las TIC.',
                  'Ensambla piezas mecánicas por medio de pares de enlace para el análisis, funcionamiento y movimiento del mecanismo, considerando el impacto ecológico; trabajando en forma colaborativa, reconociendo y regulando la expresión de emociones, sentimientos e impulsos para el logro de metas y objetivos.'
                ],
                criterios: ['Identifica base, eslabón motriz, conector y conducido', 'Justifica material y geometría de las piezas', 'Corta y perfora con herramienta manual de forma segura', 'Los pares de enlace permiten el movimiento sin juego excesivo', 'El mecanismo completa su ciclo sin trabarse ni colisionar', 'Registra en la bitácora fallas y ajustes']
              }
            ]
          },
          '3': {
            nombre: 'Instala sistemas neumáticos, electroneumáticos, hidráulicos y electrohidráulicos', horas: 96,
            ac: [
              {
                titulo: 'Interpreta planos de sistemas neumáticos, electroneumáticos, hidráulicos y electrohidráulicos', pag: 40,
                producto: 'La interpretación de planos de sistemas neumáticos, electroneumáticos, hidráulicos y electrohidráulicos (propiedades, simbología, unidades y conversiones)', instr: 'GO',
                desarrollo: [
                  'Identifica las propiedades de los fluidos utilizados en neumática, electroneumática e hidráulica, electrohidráulica (presión, caudal y fuerza), simbología, unidades y sistemas de medición y su conversión entre ellos, siguiendo las normas de seguridad e higiene, e instrucciones del jefe inmediato, trabajando en forma colaborativa y comunicándose asertivamente.',
                  'Reconoce sistemas neumáticos, electroneumáticos, hidráulicos y electrohidráulicos en un plano, considerando sus propiedades, simbología, unidades, sistemas de medición y su conversión entre ellos; trabajando en equipo y reportando su resultado a su jefe inmediato; regulando sus emociones al momento de recibir retroalimentación.'
                ],
                criterios: ['Explica presión, caudal y fuerza con sus unidades', 'Convierte unidades (bar, psi, Pa; l/min, cm³/s)', 'Reconoce la simbología ISO 1219 de los componentes', 'Explica el funcionamiento del circuito leyendo el plano']
              },
              {
                titulo: 'Diseña elementos neumáticos, electroneumáticos, hidráulicos y electrohidráulicos', pag: 41,
                producto: 'Los elementos neumáticos, electroneumáticos, hidráulicos y electrohidráulicos diseñados en simulador', instr: 'LC',
                desarrollo: [
                  'Selecciona elementos neumáticos, electroneumáticos, hidráulicos y electrohidráulicos considerando sus características y función, los sistemas socioecológicos y el NEXO; haciendo el cálculo de fuerza y caudal; atendiendo a las instrucciones del jefe inmediato, ejerciendo la toma de decisiones y comunicando sus resultados de manera efectiva y clara; utilizando las TIC, así como el pensamiento matemático.',
                  'Elabora los diagramas neumáticos, electroneumáticos, hidráulicos y electrohidráulicos, mediante un simulador especializado, atendiendo a las instrucciones del jefe inmediato, ejerciendo la toma de decisiones, su creatividad y comunicando sus resultados, mediante una comunicación efectiva, así como el pensamiento matemático.'
                ],
                criterios: ['Selecciona componentes según su función', 'Calcula fuerza (F = P·A) y caudal', 'Dibuja el diagrama con simbología correcta', 'Verifica el diagrama antes de armar']
              },
              {
                titulo: 'Arma sistemas neumáticos, electroneumáticos, hidráulicos y electrohidráulicos', pag: 42,
                producto: 'El sistema neumático, electroneumático, hidráulico o electrohidráulico armado', instr: 'LC',
                desarrollo: [
                  'Prepara componentes eléctricos seleccionados, de acuerdo con el diagrama de escalera establecido, trabajando en forma autónoma y colaborativa, utilizando el pensamiento matemático; cuidando los recursos disponibles y comunicando sus resultados al jefe inmediato.',
                  'Realiza conexiones entre los diferentes componentes neumáticos, electroneumáticos, hidráulicos y electrohidráulicos, de acuerdo con el diagrama, aplicando las normas de seguridad e higiene, trabajando en forma autónoma y colaborativa, siguiendo las instrucciones del jefe inmediato; cuidando los recursos para evitar desperdicios; mantiene comunicación asertiva en la resolución de problemas.'
                ],
                criterios: ['Prepara los componentes eléctricos según el diagrama de escalera', 'Conecta según el diagrama sin errores', 'El sistema hidráulico no tiene fugas ni aire atrapado', 'El circuito eléctrico no tiene cortos y está aislado', 'Trabaja con orden cuidando los materiales']
              },
              {
                titulo: 'Verifica el funcionamiento de los sistemas neumáticos, electroneumáticos, hidráulicos y electrohidráulicos', pag: 43,
                producto: 'El sistema neumático, electroneumático, hidráulico o electrohidráulico en funcionamiento', instr: 'R',
                desarrollo: [
                  'Opera el circuito neumático, electroneumático, hidráulico y electrohidráulico, aplicando las normas de seguridad e higiene, siguiendo las instrucciones del jefe inmediato; cuidando su integridad física corporal en todo momento.',
                  'Valida el funcionamiento del sistema neumático, electroneumático, hidráulico y electrohidráulico, modificando en caso de presentar falla, aplicando las normas de seguridad e higiene, siguiendo las instrucciones del jefe inmediato y reportándole el resultado; manteniendo una comunicación empática y mentalidad de crecimiento.'
                ],
                criterios: ['Opera el sistema siguiendo las normas de seguridad', 'El sistema cumple la tarea solicitada (levanta y mueve la carga)', 'Detecta y corrige fallas', 'Reporta resultados y fallas en la bitácora']
              }
            ]
          }
        }
      },
      III: {
        nombre: 'Programa dispositivos de control', horas: 272, semestre: 4, pag: 54,
        resultados: ['Programar dispositivos de control', 'Instalar elementos de potencia y control', 'Programar controladores lógicos', 'Programar sistemas embebidos'],
        sinco: ['2633 Técnicos en mantenimiento y reparación de maquinaria e instrumentos industriales', '2634 Mecánicos en mantenimiento y reparación de maquinaria e instrumentos industriales', '2640 Supervisores de técnicos eléctricos, en electrónica y de equipos en telecomunicaciones y electromecánicos', '2643 Técnicos en instalación y reparación de equipos electrónicos, telecomunicaciones y electrodomésticos', '2645 Técnicos en reparación de equipos electromecánicos', '8181 Ensambladores y montadores de herramientas, maquinaria, equipos y productos metálicos', '8211 Operadores de máquinas e instalaciones para la generación de energía'],
        scian: ['3399 Otras industrias manufactureras'],
        fuentes: [
          'Alcalde, M., García, J. J. y Salmerón, F. (2021). Representación gráfica de sistemas mecatrónicos. Paraninfo.',
          'Antonsen, T. M. (2020). Controles PLC con texto estructurado (ST): IEC 61131-3. BoD.',
          'Baker, R. (2021). Proyectos Arduino: su guía para crear proyectos sencillos de Arduino. KDP.',
          'Berger, H. (1998). Automating with STEP 7 in STL and SCL. Siemens.',
          'Grey, G. (2018). Raspberry Pi: guía paso a paso para principiantes.',
          'Kosow, I. L. (1977). Control de máquinas eléctricas. Reverté.',
          'Siemens. LOGO! Basic Modules (siemens.com).',
          'Perdigones, A. (2011). PLC Programming LOGO! by Siemens. Universidad Politécnica de Madrid.',
          'Raspberry Pi documentation: Getting started (raspberrypi.com).',
          'Ruiz Vázquez, T. (2004). Análisis básico de circuitos eléctricos y electrónicos. Pearson.',
          'Tello, S. S. (2020). Prácticas de automatización. Marcombo.',
          'Thorpe, E. (2019). Arduino para principiantes.',
          'Arduino. UNO R3 documentation (docs.arduino.cc).'
        ],
        sub: {
          '1': {
            nombre: 'Instala elementos de potencia y control', horas: 96,
            ac: [
              {
                titulo: 'Interpreta planos y diagramas del tablero de control', pag: 55, ev: 'D',
                producto: 'La interpretación de planos y diagramas de elementos eléctricos y electrónicos en un tablero de control', instr: 'GO',
                desarrollo: [
                  'Identifica elementos eléctricos y electrónicos en un tablero de control de forma física y mediante simbología; trabajando de manera autónoma o colaborativa, siguiendo las instrucciones del jefe inmediato y manteniendo comunicación empática y mentalidad de crecimiento.',
                  'Determina los voltajes de operación de cada elemento en el plano o diagrama, empleando el pensamiento matemático, siguiendo las instrucciones del jefe inmediato y las normas de seguridad e higiene; trabajando de manera autónoma o colaborativa.'
                ],
                tx: [[0,1,4,11,13,14,19,22],[0,2,11,14,22]],
                criterios: ['Identifica los elementos del tablero (interruptor termomagnético, contactor, relevador, guardamotor, botones, luces piloto) en físico y en símbolo', 'Lee diagramas de fuerza y de control con simbología normalizada', 'Determina el voltaje de operación de cada elemento (bobinas, control y fuerza)', 'Explica la secuencia de funcionamiento del circuito']
              },
              {
                titulo: 'Selecciona componentes periféricos del sistema de potencia y control', pag: 56, ev: 'P',
                producto: 'Los componentes periféricos del sistema de potencia y control, seleccionados de acuerdo con las dimensiones, mediciones y normas', instr: 'LC',
                desarrollo: [
                  'Mide los voltajes y amperajes del tablero, utilizando equipo de medición, registrando los datos obtenidos en la bitácora u hoja de servicio, aplicando las normas de seguridad e higiene vigentes; cuidando su bienestar físico corporal; trabajando de forma autónoma y colaborativa, reportando sus resultados al jefe inmediato.',
                  'Determina el calibre del conductor, dimensiones de los componentes y protecciones del circuito, de acuerdo con las tablas de especificaciones, realizando cálculos de voltaje, amperaje y potencia, economizando recursos y materiales, empleando el pensamiento matemático; siguiendo las instrucciones del jefe inmediato y considerando las normas de seguridad e higiene.'
                ],
                tx: [[0,1,4,7,9,11,14,23],[0,1,2,4,7,11,20,22]],
                criterios: ['Mide voltaje y corriente con el equipo y el EPP adecuados', 'Calcula la corriente de la carga y elige el calibre del conductor con tabla', 'Elige la protección (fusible, termomagnético, relevador de sobrecarga) según la corriente', 'Registra las mediciones en la bitácora u hoja de servicio', 'Justifica la selección con hojas de datos y normas']
              },
              {
                titulo: 'Ensambla elementos de potencia y control', pag: 57, ev: 'P',
                producto: 'El ensamble de los elementos de potencia y control del circuito o tablero, realizando las mediciones correspondientes', instr: 'LC',
                desarrollo: [
                  'Selecciona las herramientas y equipo considerando el tamaño, forma y dimensión de los elementos de potencia y control, así como el espacio de trabajo, aplicando las normas de seguridad e higiene; trabajando de forma autónoma y colaborativa.',
                  'Realiza mediciones de voltaje con las herramientas y equipo de medición, siguiendo las instrucciones del jefe inmediato, aplicando las normas de seguridad e higiene trabajando en forma individual o colaborativa, y cuidando en todo momento su integridad física corporal; tomando decisiones basadas en evidencia al resolver problemas.',
                  'Conecta los elementos de potencia y control del circuito o tablero, optimizando recursos, trabajando de manera autónoma o colaborativa, siguiendo las instrucciones del jefe inmediato y aplicando las normas de seguridad e higiene vigentes.'
                ],
                tx: [[0,4,9,11,14,17,18,20,22],[0,4,9,14,18,20,22,23],[0,1,4,7,9,11,14,18,21,22,24]],
                criterios: ['Selecciona la herramienta adecuada para cada elemento', 'Monta los elementos ordenados y bien fijos', 'Cablea según el diagrama, con terminales y colores de conductor', 'Mide voltajes antes y después de conectar, con el circuito protegido', 'Cablea sin energía (bloqueo y etiquetado)']
              },
              {
                titulo: 'Comprueba el funcionamiento del sistema de potencia y control', pag: 58, ev: 'P',
                producto: 'El circuito con interruptores, sensores y actuadores funcionando', instr: 'LC',
                desarrollo: [
                  'Realiza la verificación del sistema activando interruptores, sensores y actuadores, utilizando equipo de medición, trabajando de forma colaborativa o autónoma, siguiendo las normas de seguridad e higiene y reportando al jefe inmediato sus resultados; cuidando en todo momento su integridad física corporal y la de sus compañeros.',
                  'Corrige el circuito, de acuerdo con las hojas de especificaciones del proveedor implementando un plan de trabajo, reportando sus resultados a su jefe inmediato y siguiendo normas de seguridad e higiene; encaminado al logro de metas y regulando sus emociones durante el desarrollo de la competencia.'
                ],
                tx: [[0,7,9,11,14,18,22,23],[0,2,4,7,9,11,14,18,22,23]],
                criterios: ['Prueba la secuencia completa: arranque, paro, enclavamiento y protecciones', 'Verifica sensores y actuadores con mediciones', 'Localiza y corrige fallas con el diagrama y la hoja del fabricante', 'Reporta resultados y correcciones']
              }
            ]
          },
          '2': {
            nombre: 'Programa controladores lógicos', horas: 96,
            ac: [
              {
                titulo: 'Inspecciona el funcionamiento y cableado del PLC', pag: 59, ev: 'P',
                producto: 'El diagrama eléctrico para ensamblar el PLC en el tablero con los puertos de entrada, salida, voltaje y comunicación del PLC en funcionamiento', instr: 'LC',
                desarrollo: [
                  'Identifica los puertos de entrada y salida del controlador, así como de voltaje y comunicación, considerando información de manuales, tutoriales, hojas de datos; trabajando de manera autónoma o colaborativa.',
                  'Determina el funcionamiento de los periféricos del controlador, generando ideas y técnicas innovadoras, siguiendo las instrucciones del jefe inmediato; trabajando de forma autónoma o colaborativa y aplicando las normas de seguridad e higiene vigentes.',
                  'Clasifica las funciones que pueden realizarse utilizando el controlador; logrando la meta asignada por el jefe inmediato; regulando sus emociones durante el trabajo colaborativo y mantiene una comunicación empática.',
                  'Elabora un diagrama eléctrico para ensamblar el PLC en el tablero, empleando el pensamiento matemático y la lengua extranjera; haciendo uso de técnicas y las TIC; trabajando de manera autónoma o colaborativa.'
                ],
                tx: [[0,1,4,7,14,18,21],[0,1,4,14,17,20,22],[0,4,7,14,16],[0,1,2,4,7,14,22]],
                criterios: ['Identifica entradas, salidas, alimentación y puerto de comunicación del controlador', 'Distingue entradas digitales y analógicas, y salidas a relevador o a transistor', 'Elabora el diagrama de conexión del controlador con botones, sensores y cargas', 'Clasifica las funciones del controlador (enclavar, temporizar, contar, comparar)']
              },
              {
                titulo: 'Formula el programa para el controlador', pag: 60, ev: 'P',
                producto: 'El programa de acuerdo con las especificaciones lógicas de las entradas y salidas del controlador', instr: 'R',
                desarrollo: [
                  'Identifica las funciones booleanas y tablas de verdad, estableciendo planes de trabajo y logro de metas, utilizando el pensamiento matemático, un segundo idioma y trabajando de manera autónoma o colaborativa.',
                  'Determina los estados lógicos de las entradas y salida, para encontrar una solución deseada, reportando sus resultados al jefe inmediato mediante el uso de las TIC.',
                  'Realiza una tabla de verdad para obtener la función booleana y las compuertas lógicas, estableciendo un plan de trabajo encaminado al logro de metas, utilizando el pensamiento matemático y trabajando de manera autónoma o colaborativa.',
                  'Elabora un diagrama de escalera para cargarlo al PLC, implementando ideas o técnicas innovadoras, siguiendo las instrucciones de su jefe inmediato y trabajando de manera autónoma o colaborativa.'
                ],
                tx: [[0,1,2,4,14,18,20,21,22],[0,1,2,4,14,18,20,21,22],[0,2,4,11,14,18,20,22],[0,2,4,14,17,18,20,21,22]],
                criterios: ['Define los estados lógicos de entradas y salidas para la solución', 'Obtiene la tabla de verdad y la función booleana', 'Traduce la lógica a diagrama de escalera (contactos, bobinas, enclavamiento)', 'Usa temporizadores y contadores cuando se requieren', 'Documenta la tabla de direcciones (entradas, salidas y marcas)']
              },
              {
                titulo: 'Verifica el funcionamiento del programa', pag: 62, ev: 'P',
                producto: 'El circuito lógico programable con sus especificaciones lógicas del entorno funcionando', instr: 'R',
                desarrollo: [
                  'Identifica el puerto de comunicación del programador, trabajando de forma autónoma o colaborativa, siguiendo las instrucciones del jefe inmediato.',
                  'Ensambla los elementos de potencia y control, de manera física o mediante simulación, estableciendo un plan de trabajo; siguiendo las instrucciones de su jefe inmediato; trabajando de manera autónoma o colaborativa y reporta los resultados obtenidos; cuidando los recursos disponibles para evitar desperdicios.',
                  'Captura el programa en el software del PLC trabajando de forma autónoma o colaborativa; atendiendo las instrucciones del jefe inmediato.',
                  'Carga el programa en el PLC utilizando el puerto de comunicación o simulador, siguiendo las instrucciones de su jefe inmediato y trabajando de manera autónoma o colaborativa.',
                  'Comprueba el funcionamiento del circuito lógico programado, optimizando el uso de energía y componentes económicos, ecológicos y tecnológicos; reporta los resultados al jefe inmediato utilizando las TIC y la comunicación asertiva.'
                ],
                tx: [[0,4,7,11,22],[0,1,4,14,18,21,22,24],[0,1,4,11,14,18,20,22],[0,1,4,11,14,18,22],[0,4,11,14,17,18,21,25]],
                criterios: ['Captura el programa en el software sin errores', 'Carga el programa al controlador o al simulador', 'Prueba todas las condiciones de la tabla de verdad o de la secuencia', 'Corrige fallas y documenta la versión final', 'Cablea entradas y salidas de forma segura']
              }
            ]
          },
          '3': {
            nombre: 'Programa sistemas embebidos', horas: 80,
            ac: [
              {
                titulo: 'Inspecciona el funcionamiento interno y cableado del sistema embebido', pag: 63, ev: 'D',
                producto: 'La inspección durante el funcionamiento interno y cableado del sistema embebido considerando el diagrama', instr: 'GO',
                desarrollo: [
                  'Identifica los puertos de entrada, salida, voltaje y comunicación del sistema embebido, haciendo uso de la información disponible y trabajando de manera autónoma o colaborativa.',
                  'Determina la función de los periféricos del sistema embebido; trabajando en forma creativa, autónoma o colaborativa y siguiendo las instrucciones del jefe inmediato.',
                  'Elabora el diagrama para ensamblar o simular el sistema embebido, utilizando la creatividad y las TIC; empleando el pensamiento matemático, siguiendo las instrucciones del jefe inmediato y trabajando en forma autónoma y colaborativa.',
                  'Verifica el funcionamiento interno del sistema embebido utilizando el diagrama y tecnología, herramientas y el pensamiento matemático; siguiendo las instrucciones del jefe inmediato y reportando sus resultados.'
                ],
                tx: [[0,1,4,11,18],[0,1,4,7,11,14,17,19,21,22],[0,2,4,22],[0,2,4,11,14,17,21,22]],
                criterios: ['Identifica terminales digitales, analógicas, PWM, de alimentación y de comunicación de la tarjeta', 'Explica la función de los periféricos (sensores, actuadores, módulos)', 'Elabora el diagrama de conexión en simulador o en papel', 'Verifica conexiones y voltajes antes de energizar']
              },
              {
                titulo: 'Programa el código para la tarjeta', pag: 65, ev: 'P',
                producto: 'El programa con las especificaciones lógicas y la compilación', instr: 'R',
                desarrollo: [
                  'Identifica el software, instrucciones o bloques para realizar el programa, estableciendo de manera creativa planes de trabajo, siguiendo las instrucciones del jefe inmediato.',
                  'Aplica las instrucciones o bloques para elaborar el código, siguiendo las instrucciones del jefe inmediato; manteniendo comunicación empática y reportando las inconsistencias para su solución.',
                  'Captura el código con la sintaxis correcta utilizando compilador o simulador, de forma individual o colaborativa, utilizando el pensamiento matemático.'
                ],
                tx: [[0,1,4,11,17,22],[0,1,4,11,18,19,20,22],[0,1,4,14,21,22]],
                criterios: ['Estructura el programa (setup, loop, variables y funciones)', 'Usa las instrucciones correctas para entradas, salidas, tiempos y decisiones', 'Compila sin errores y comenta el código', 'El programa resuelve la lógica pedida']
              },
              {
                titulo: 'Verifica el funcionamiento del sistema', pag: 65, ev: 'P',
                producto: 'El sistema embebido con los elementos de potencia y control del circuito, especificaciones lógicas del programa en funcionamiento', instr: 'LC',
                desarrollo: [
                  'Ensambla los elementos de potencia y control del circuito, siguiendo las normas de seguridad e higiene vigentes; trabajando de forma autónoma o colaborativa, reportando sus resultados a su jefe inmediato.',
                  'Carga el programa en la tarjeta utilizando el puerto de comunicación o simulador, siguiendo el plan de trabajo y reporta sus resultados a su jefe inmediato.',
                  'Comprueba el funcionamiento del sistema embebido, optimizando el uso de energía y aplicando el nexo Agua Energía-Alimento, trabajando en forma autónoma y colaborativa, y siguiendo las instrucciones de su jefe inmediato.'
                ],
                tx: [[0,1,4,9,14,21,22],[0,1,4,9,14,18,21,22],[0,1,4,14,18,21,22,23,24]],
                criterios: ['Ensambla la etapa de potencia (transistor, relevador o driver) de forma segura', 'Carga el programa y comprueba cada función', 'Usa el monitor serie para diagnosticar', 'Optimiza el consumo de energía', 'Documenta los resultados']
              }
            ]
          }
        }
      },
      IV: {
        nombre: 'Opera sistemas flexibles de manufactura de piezas mecánicas', horas: 192, semestre: 5, pag: 76,
        resultados: ['Operar sistemas flexibles de manufactura de piezas mecánicas', 'Configurar equipos de manufactura de piezas mecánicas', 'Programar sistemas robóticos'],
        sinco: ['2633 Técnicos en mantenimiento y reparación de maquinaria e instrumentos industriales', '2634 Mecánicos en mantenimiento y reparación de maquinaria e instrumentos industriales', '8211 Ensambladores y montadores de herramientas, maquinaria, equipos y productos metálicos', '8123 Operadores de máquinas que cortan, perforan, doblan, troquelan y sueldan piezas y productos metálicos'],
        scian: ['332710 Maquinado de piezas metálicas para maquinaria y equipo en general', '3363 Fabricación de partes para vehículos automotores'],
        fuentes: [
          'Chang, T.-C., Wysk, R. A. y Wang, H.-P. (2006). Computer-Aided Manufacturing. Pearson.',
          'Cruz, F. (2007). Control numérico y programación. Alfaomega.',
          'Giesecke, F. E. et al. (2012). Technical Drawing with Engineering Graphics. Pearson.',
          'Groover, M. P. (1997). Fundamentos de manufactura moderna. Pearson.',
          'Groover, M. P. (2008). Automation, Production Systems, and Computer-Integrated Manufacturing. Pearson.',
          'Krar, S., Gill, A. y Smid, P. (2009). Tecnología de las máquinas herramienta. Alfaomega.',
          'Mompín, J. (1988). Sistemas CAD/CAM/CAE. Marcombo.',
          'Puncochar, D. E. y Evans, K. (2010). Interpretation of Geometric Dimensioning and Tolerancing. Industrial Press.',
          'Smid, P. (2005). CNC Control Setup for Milling and Turning. Industrial Press.',
          'Smid, P. (2013). CNC Programming Handbook. Industrial Press.',
          'Hammer, W. (2000). Cómo leer dibujos industriales. Industrial Press.'
        ],
        sub: {
          '1': {
            nombre: 'Configura equipos de manufactura de piezas mecánicas', horas: 96,
            ac: [
              {
                titulo: 'Manipula equipos y máquinas-herramienta para la manufactura de piezas mecánicas', pag: 77, ev: 'D',
                producto: 'La operación de máquinas-herramienta para la manufactura de piezas mecánicas', instr: 'GO',
                desarrollo: [
                  'Identifica las diferentes operaciones de los equipos o máquinas-herramienta para la manufactura de piezas mecánicas, empleando pensamiento crítico y el pensamiento matemático, utilizando los manuales del fabricante disponibles y haciendo uso de las tecnologías de la información y la lengua extranjera.',
                  'Realiza los cálculos de velocidades (de giro y de avance) para el funcionamiento de una máquina-herramienta y a la elección sostenible del material de acuerdo con las especificaciones para la fabricación de una pieza, utilizando el pensamiento matemático y trabajando de manera individual y en equipo; verificando los resultados para entregarlos al jefe inmediato y recibir retroalimentación.',
                  'Acondiciona la máquina-herramienta de acuerdo con sus parámetros de operación (lubricación, iluminación, presión de aire, nivelación, refrigeración y colocación de herramientas de corte) especificados en los estándares para el manejo eficiente de las mismas, trabajando en equipo y atendiendo las instrucciones de su jefe inmediato; cuidando en todo momento su integridad física y corporal.',
                  'Opera máquinas-herramientas convencionales para la fabricación de piezas mecánicas, de acuerdo con especificaciones, considerando el impacto ecológico de los desechos, siguiendo instrucciones, trabajando y de forma individual y en equipo; comunicándose asertivamente y aplicando las normas de seguridad e higiene vigentes.'
                ],
                tx: [[1,4,7,18,22],[0,2,7,14,18,20,22],[1,7,9,14,23],[0,1,8,11,14,20,22,23]],
                criterios: ['Identifica las operaciones de torno, fresadora, taladro y cortadora láser', 'Calcula velocidad de corte, revoluciones por minuto y avance', 'Acondiciona la máquina (lubricación, herramienta, sujeción, iluminación)', 'Opera con EPP y normas de seguridad', 'Elige el material considerando su impacto ecológico']
              },
              {
                titulo: 'Programa equipos (CNC) para la manufactura de piezas mecánicas', pag: 79, ev: 'P',
                producto: 'El equipo (CNC) programado para la manufactura de piezas mecánicas', instr: 'LC',
                desarrollo: [
                  'Reconoce el principio de funcionamiento de las máquinas de control numérico, tipos, sus partes, sistemas de referencia, ventajas y desventajas para la fabricación de piezas mecánicas considerando un enfoque sostenible, trabajando de manera individual y en equipo, comunicándose de manera asertiva y empática; regulando sus emociones para concentrarse y evitar accidentes, siguiendo las normas de seguridad e higiene vigentes.',
                  'Reconoce los códigos G y M (funciones básicas y ciclos de maquinado) para la programación de máquinas de control numérico, de acuerdo con estándares industriales trabajando de manera individual y en equipo, comunicándose de manera asertiva y empática.',
                  'Aplica los códigos G y M de programación de máquinas de control numérico en el desarrollo de programas para la manufactura de piezas mecánicas, trabajando de manera individual y en equipo, siguiendo las instrucciones de su jefe inmediato; comunicándose de manera asertiva y empática.'
                ],
                tx: [[1,2,4,7,11,14,15,25],[0,2,7,13,16,18,21],[0,2,7,14,16,18,21,22]],
                criterios: ['Explica partes, ejes y sistemas de referencia de una máquina CNC', 'Usa los códigos G y M básicos y los ciclos de maquinado', 'Escribe el programa con encabezado, cero pieza, trayectoria y fin', 'Calcula coordenadas absolutas e incrementales']
              },
              {
                titulo: 'Comprueba la manufactura de piezas mecánicas con simuladores y materiales de prueba', pag: 81, ev: 'P',
                producto: 'Las piezas mecánicas en funcionamiento mediante simuladores y materiales de prueba', instr: 'LC',
                desarrollo: [
                  'Registra el código G en la herramienta de software de simulación de CNC de acuerdo con su operación y configuración del entorno: definición de espacio de máquina, medidas del material en bruto, herramientas, trabajando de forma creativa, autónoma y colaborativa; respetando las ideas y opiniones de sus pares en la solución de problemas, logro de sus objetivos y metas.',
                  'Valida el correcto funcionamiento del programa desarrollado, verificando los cambios de herramienta, que no existan colisiones o trayectorias inadecuadas y/o habilita la máquina CNC con las condiciones necesarias para su ejecución: home de pieza, altura de herramientas, herramientas de corte, refrigerante y la correcta colocación del material para poner en funcionamiento la máquina CNC en la manufactura de piezas mecánicas, colaborando en equipo y con mentalidad de crecimiento, respetando las ideas y opiniones de sus pares en la toma de decisiones en la solución de problemas y logro de metas; siguiendo las normas de seguridad vigentes.',
                  'Verifica las dimensiones de la pieza mecánica obtenida, haciendo uso de instrumentos de medición para determinar el cumplimiento de las tolerancias de acuerdo con las especificaciones y a las normas industriales vigentes; colaborando en equipo y con mentalidad de crecimiento, respetando las ideas y opiniones de sus pares en la toma de decisiones para la solución de problemas y logro de metas, reportando sus resultados a su jefe inmediato; siguiendo las normas de seguridad vigentes.'
                ],
                tx: [[0,3,6,20,26],[0,2,7,13,14,18,19,20],[0,2,7,11,18,20,22]],
                criterios: ['Configura el simulador: material en bruto, herramientas y cero pieza', 'Detecta y corrige colisiones o trayectorias inadecuadas', 'Fabrica la pieza de prueba (láser o material blando) con seguridad', 'Mide la pieza y verifica tolerancias']
              }
            ]
          },
          '2': {
            nombre: 'Programa sistemas robóticos', horas: 96,
            ac: [
              {
                titulo: 'Prepara el sistema robótico de acuerdo con el proceso de producción', pag: 83, ev: 'P',
                producto: 'El sistema robótico articulado de acuerdo con el proceso de producción', instr: 'LC',
                desarrollo: [
                  'Distingue los diferentes tipos de robots que se emplean, derivado de la elección entre diferentes opciones, con base en las necesidades del sector de aplicación y la resolución de problemas; trabajando de manera individual y en equipo, asumiendo una actitud de respeto con sus pares.',
                  'Reconoce el funcionamiento y articulación de las diferentes opciones de robots por medio de una toma de decisiones, con una perspectiva innovadora y con orientación al logro de metas, trabajando de manera individual y en equipo.',
                  'Selecciona el robot que cumpla con las metas de aplicación para encontrar una solución al proceso de manufactura, trabajando de forma individual y en equipo; respetando las ideas y opiniones de sus pares para el logro de sus objetivos y metas y reporta sus resultados a su jefe inmediato.',
                  'Acondiciona la aplicación de robots, respetando sus condiciones iniciales de operación, funcionamiento y la articulación de las diferentes opciones, por medio de una toma de decisiones con una perspectiva innovadora, trabajando de forma individual y en equipo; aplicando las normas de higiene y seguridad vigentes.'
                ],
                tx: [[0,1,4,14,18,20,22],[0,1,4,14,17,22],[0,1,4,14,18,21],[1,4,11,16,17,20,26]],
                criterios: ['Distingue tipos de robots y su aplicación (cartesiano, SCARA, articulado, delta, colaborativo)', 'Identifica grados de libertad, área de trabajo y efector final', 'Selecciona el robot adecuado para la tarea', 'Arma o acondiciona el brazo para operar con seguridad']
              },
              {
                titulo: 'Desarrolla la programación del sistema robótico de acuerdo con el proceso de producción', pag: 85, ev: 'P',
                producto: 'La programación del sistema robótico de acuerdo con el proceso de producción', instr: 'R',
                desarrollo: [
                  'Diseña el diagrama de flujo planificando el logro del objetivo entre diferentes opciones del algoritmo de programación, utilizando el pensamiento matemático, trabajando de forma individual y en equipo; respetando las ideas y opiniones de sus pares para el logro de sus objetivos y metas.',
                  'Reconoce las diferentes opciones de programación de un robot (en línea y fuera de línea) identificando comandos y software de programación para la implementación de una solución; trabajando de forma individual y en equipo; respetando las ideas y opiniones de sus pares para el logro de sus objetivos y metas.',
                  'Registra y establece el código derivado del algoritmo de programación para el funcionamiento de la aplicación deseada del robot, utilizando el pensamiento matemático, trabajando de forma individual y en equipo; respetando las ideas y opiniones de sus pares para el logro de sus objetivos y metas. Reporta sus resultados a su jefe inmediato.',
                  'Verifica el funcionamiento del robot a través del simulador y de manera física considerando las normas de seguridad e higiene vigentes, las instrucciones del jefe inmediato; reportando sus resultados en la bitácora mediante el uso de las TIC.'
                ],
                tx: [[1,2,4,11,16,17,19,20,21,26],[1,2,4,11,16,18,20,21,22,26],[0,1,4,11,12,14,18,19,21,22],[0,4,18,20,22]],
                criterios: ['Elabora el diagrama de flujo de la tarea', 'Distingue la programación en línea y fuera de línea', 'Programa posiciones y secuencia (puntos, movimientos y pinza)', 'Verifica en simulador y en físico']
              },
              {
                titulo: 'Valida la programación del sistema robótico por medio de simuladores de producción', pag: 87, ev: 'P',
                producto: 'El sistema robótico en funcionamiento por medio de simuladores de producción', instr: 'R',
                desarrollo: [
                  'Verifica el funcionamiento simulado y físico de operación de un robot, trabajando de forma creativa, autónoma y colaborativa; respetando las ideas y opiniones de sus pares en la solución de problemas, logro de sus objetivos y metas; considerando las normas de seguridad e higiene vigentes. Reporta sus resultados a su jefe inmediato.',
                  'Realiza los ajustes en la programación en caso de ser necesario, tomando medidas lógicas a fin de encontrar una solución deseada acorde a la aplicación del robot, trabajando de forma creativa, autónoma y colaborativa; respetando las ideas y opiniones de sus pares en la solución de problemas, logro de sus objetivos y metas. Reporta sus resultados a su jefe inmediato.'
                ],
                tx: [[1,4,7,14,18,19,21],[0,1,4,7,11,18,19,20,21,22]],
                criterios: ['Comprueba el ciclo completo sin colisiones', 'Ajusta posiciones, velocidades y tiempos', 'Reporta resultados en la bitácora', 'Respeta la zona de seguridad']
              }
            ]
          }
        }
      },
      V: {
        nombre: 'Opera sistemas mecatrónicos', horas: 192, semestre: 6, pag: 97,
        resultados: ['Operar sistemas mecatrónicos', 'Automatizar sistemas mecatrónicos', 'Mantener sistemas mecatrónicos en funcionamiento'],
        sinco: ['2633 Técnicos en mantenimiento y reparación de maquinaria e instrumentos industriales', '2634 Mecánicos en mantenimiento y reparación de maquinaria e instrumentos industriales', '2645 Técnicos en reparación de equipos electromecánicos', '8181 Operadores de máquinas e instalaciones para la generación de energía'],
        scian: ['333510 Fabricación de maquinaria y equipo para la industria metalmecánica', '3399 Otras industrias manufactureras'],
        fuentes: [
          'Bolton, W. (2013). Mecatrónica: sistemas de control electrónico en la ingeniería mecánica y eléctrica. Alfaomega.',
          'Emd, E. (2022). Mantenimiento mecatrónico: TPM, 5S, procedimiento, control, calidad. KDP.',
          'García, J., Escaño, J. M. y Nuevo, A. (2019). Integración de sistemas de automatización industrial. Paraninfo.',
          'González, R. H. (2016). Mantenimiento industrial: organización, control y gestión.',
          'Mantenimiento industrial práctico (2ª ed., 2022). Fidestec.',
          'Mora, A. (2009). Mantenimiento: planeación, ejecución y control. Alfaomega.',
          'Reyes, F., Cid, J. y Vargas, E. (2013). Mecatrónica: control y automatización. Alfaomega.',
          'NOM-004-STPS-1999. Sistemas de protección y dispositivos de seguridad en la maquinaria.',
          'NOM-029-STPS-2011. Mantenimiento de las instalaciones eléctricas en los centros de trabajo.',
          'NOM-009-STPS-2011. Trabajos en altura.',
          'NOM-033-STPS-2015. Trabajos en espacios confinados.'
        ],
        sub: {
          '1': {
            nombre: 'Automatiza sistemas mecatrónicos', horas: 96,
            ac: [
              {
                titulo: 'Diseña soluciones para automatizar sistemas mecatrónicos', pag: 98, ev: 'P',
                producto: 'El diseño de diagramas eléctricos, electrónicos, neumáticos e hidráulicos con soluciones de automatización', instr: 'R',
                desarrollo: [
                  'Reconoce las condiciones y características de operación del proceso a automatizar, para encontrar una solución deseada; atendiendo las indicaciones y requerimientos del jefe inmediato; comunicándose asertivamente y utilizando las TIC al registrar sus resultados.',
                  'Identifica tareas que se pueden automatizar, tomando medidas lógicas a fin de encontrar una solución; considera la eficiencia de los recursos materiales y económicos, validados por el jefe inmediato.',
                  'Selecciona sensores, actuadores, controladores e interfaces y tecnologías necesarias basados en criterios específicos e información disponible para la automatización del sistema mecatrónico, ya sea en forma individual o grupal, notificando a su jefe inmediato por medio de una tabla comparativa.',
                  'Elabora dibujos y diagramas eléctricos, electrónicos, neumáticos e hidráulicos, así como, algoritmos de programación y sistemas control, necesarios en la automatización de las tareas seleccionadas; utilizando las TIC, la creatividad y mentalidad de crecimiento; trabajando ya sea en forma individual o grupal, reportando a su jefe inmediato.'
                ],
                tx: [[0,4,5,7,22],[0,2,4,18,20,24],[0,1,2,4,7,8,14,20,24],[0,2,4,7,14,17,19,22]],
                criterios: ['Describe el proceso y sus condiciones de operación', 'Identifica las tareas que conviene automatizar y lo justifica', 'Selecciona sensores, actuadores y controlador con una tabla comparativa', 'Elabora los diagramas (eléctrico, electrónico, neumático o hidráulico) y el algoritmo de control', 'Estima costo y uso eficiente de recursos']
              },
              {
                titulo: 'Ensambla componentes del sistema automatizado', pag: 100, ev: 'P',
                producto: 'El ensamble de los componentes del sistema automatizado establecido en el diseño', instr: 'LC',
                desarrollo: [
                  'Reúne los componentes del sistema mecatrónico para ensamblarlos de acuerdo con el diseño de la automatización, planificando el trabajo para lograr la meta ya sea de forma individual o grupal, maximizando los recursos materiales y evitando desperdicios.',
                  'Instala los componentes mecánicos, eléctricos, electrónicos, neumáticos, hidráulicos y de control de acuerdo con el resultado del diseño de la automatización del sistema mecatrónico; aplicando las medidas de seguridad e higiene; evitando accidentes y manteniendo una comunicación efectiva con su equipo de trabajo y con su jefe inmediato para el logro de la meta.',
                  'Prepara los sistemas control, tarjetas de potencia, microcontroladores, PLC, compresores, válvulas reguladoras, bombas, para poner en funcionamiento el sistema mecatrónico, aplicando ideas, técnicas e ideas innovadoras ya sea de forma individual o colaborativa; siguiendo las instrucciones y las medidas de seguridad e higiene.'
                ],
                tx: [[0,4,9,14,21,22,23],[0,2,4,8,14,18,20,21,22],[0,4,9,10,14,17,20,22]],
                criterios: ['Reúne los componentes de acuerdo con el diseño', 'Instala componentes mecánicos, eléctricos, electrónicos y de control', 'Prepara el controlador (tarjeta o PLC) y la etapa de potencia', 'Aplica las medidas de seguridad y mantiene orden en el cableado']
              },
              {
                titulo: 'Comprueba el funcionamiento del sistema automatizado', pag: 101, ev: 'P',
                producto: 'El sistema automatizado en funcionamiento', instr: 'LC',
                desarrollo: [
                  'Verifica el funcionamiento de la automatización del sistema mecatrónico, siguiendo las instrucciones del jefe inmediato y normas de seguridad vigentes; mantiene comunicación con su equipo de trabajo para resolver problemas y tomar decisiones.',
                  'Modifica los componentes, conexiones, parámetros y programación en caso de ser necesario, estableciendo objetivos tangibles; optimizando los recursos materiales y económicos; trabajando de forma individual o grupal; comunica sus decisiones al jefe inmediato y corrige de ser necesario.'
                ],
                tx: [[0,14,18,20,22],[0,4,11,12,14,18,19,21,22]],
                criterios: ['Verifica la secuencia completa del sistema automatizado', 'Detecta y corrige fallas en componentes, conexiones o programa', 'Ajusta parámetros (tiempos, umbrales)', 'Comunica y documenta los cambios']
              }
            ]
          },
          '2': {
            nombre: 'Mantiene sistemas mecatrónicos en funcionamiento', horas: 96,
            ac: [
              {
                titulo: 'Ejecuta órdenes de mantenimiento preventivo de componentes del sistema mecatrónico', pag: 102, ev: 'D',
                producto: 'El mantenimiento preventivo al sistema mecatrónico, conforme al diagnóstico y a la orden', instr: 'GO',
                desarrollo: [
                  'Manipula equipo, herramientas, insumos e instrumentos (engrasadora, llaves, pinzas, estopas, desarmadores, calibradores, micrómetros, extractores, multímetro, equipo de seguridad, entre otros) que se utilizan en el mantenimiento preventivo; utilizando manuales de operación; reconociendo su propósito, proceso y actividades en las que se utilizan. Sigue las instrucciones del jefe inmediato y las normas de seguridad e higiene vigentes (NOM-004-STPS-1999, NOM-029-STPS-2011, NOM-009-STPS-2011, NOM-033-STPS-2015); registrando la información de puntos a considerar durante el mantenimiento.',
                  'Diagnostica el funcionamiento del sistema mecatrónico; identificando sus componentes, conexiones, parámetros y programación, describiendo el estado físico de cada elemento; registrando la información en el instrumento que le proporciona el jefe inmediato; aplicando la normatividad vigente y utilizando las TIC y lenguaje técnico en el reporte general de funcionamiento del sistema mecatrónico.',
                  'Elabora plan de mantenimiento preventivo considerando las inconsistencias detectadas en el diagnóstico en colaboración con el jefe inmediato y su equipo de trabajo; manteniendo una mentalidad de crecimiento, comunicación empática; considerando en sus decisiones el cuidado de los recursos disponibles y el menor daño al medio ambiente; utilizando las TIC y lenguaje técnico para presentar el resultado.',
                  'Realiza mantenimiento preventivo al sistema mecatrónico de acuerdo con la orden que le proporciona el jefe inmediato; aplicando la normatividad vigente; manteniendo comunicación con el equipo de trabajo; resolviendo problemas y tomando decisiones consultadas previamente. Registrando en el instrumento las actividades realizadas, manejando lenguaje técnico.'
                ],
                tx: [[0,4,7,8,9,19,21,22,23],[0,4,18,20,22],[0,1,4,5,8,11,14,19,20,22,23,26],[0,1,4,22,23]],
                criterios: ['Usa herramientas e instrumentos según su manual y propósito', 'Aplica bloqueo y etiquetado y las NOM de seguridad', 'Diagnostica el estado de cada componente y lo registra', 'Elabora el plan de mantenimiento preventivo', 'Ejecuta la orden y registra las actividades con lenguaje técnico']
              },
              {
                titulo: 'Ejecuta órdenes de mantenimiento correctivo del sistema mecatrónico', pag: 105, ev: 'D',
                producto: 'El mantenimiento correctivo al sistema mecatrónico, conforme al diagnóstico y a la orden', instr: 'GO',
                desarrollo: [
                  'Manipula equipo, herramientas, insumos e instrumentos (engrasadora, llaves, pinzas, estopas, desarmadores, calibradores, micrómetros, extractores, multímetro, escáner, taladro, aspiradora, compresor, gatos hidráulicos, prensas, escalera telescópica, grúa, polipastos, patines, montacargas, esmeril, cortadoras, equipo de seguridad, entre otros) que se utilizan en el mantenimiento correctivo; utilizando manuales de operación; reconociendo su propósito, proceso y actividades en las que se utilizan. Sigue las instrucciones del jefe inmediato y las normas de seguridad e higiene vigentes (NOM-004-STPS-1999, NOM-029-STPS-2011, NOM-009-STPS-2011, NOM-033-STPS-2015); registrando la información de puntos a considerar durante el mantenimiento.',
                  'Diagnostica el funcionamiento del sistema mecatrónico; verificando el funcionamiento de sus componentes, conexiones, parámetros y programación, describiendo el estado físico de cada uno de ellos; registrando la información la orden de trabajo, bitácora, reporte de falla o en el instrumento que le proporciona el jefe inmediato; utilizando las TIC y lenguaje técnico; aplicando la normatividad vigente.',
                  'Elabora plan de mantenimiento correctivo considerando las fallas detectadas en el diagnóstico en colaboración con el jefe inmediato y su equipo de trabajo; manteniendo una mentalidad de crecimiento, comunicación empática; considerando en sus decisiones el cuidado de los recursos disponibles y el menor daño al medio ambiente; utilizando las TIC y lenguaje técnico para presentar el resultado.',
                  'Repara la falla detectada en el sistema, equipo o maquinaria, realizando ajustes, cambio de piezas, calibraciones, actualizaciones del código de programación de la tarjeta, entre otras acciones que le indique el jefe inmediato; organizando el trabajo, gestionando el tiempo adecuadamente, sosteniendo el impulso y motivación del compromiso de reparación, optimizando los recursos materiales y económicos.'
                ],
                tx: [[0,4,7,8,9,19,21,22,23],[0,4,18,20,22],[0,1,4,5,8,11,14,19,20,22,23,26],[0,1,4,22,23]],
                criterios: ['Diagnostica la falla con método (del síntoma a la causa)', 'Elabora el plan de reparación con materiales y tiempos', 'Repara (ajuste, cambio de pieza, calibración o código)', 'Prueba el equipo después de reparar', 'Registra la orden de trabajo']
              },
              {
                titulo: 'Ejecuta órdenes de mantenimiento predictivo del sistema mecatrónico', pag: 108, ev: 'D',
                producto: 'El mantenimiento predictivo al sistema mecatrónico, conforme al diagnóstico de funcionamiento y a la orden', instr: 'GO',
                desarrollo: [
                  'Manipula equipo, herramientas, insumos e instrumentos (llaves, pinzas, desarmadores, calibradores, micrómetros, multímetro, analizador de vibraciones, cámara termografía, equipo de seguridad, entre otros) que se utilizan en el mantenimiento predictivo; utilizando manuales de operación; reconociendo su propósito, proceso y actividades en las que se utilizan. Sigue las instrucciones del jefe inmediato y las normas de seguridad e higiene vigentes (NOM-004-STPS-1999, NOM-029-STPS-2011, NOM-009-STPS-2011, NOM-033-STPS-2015); registrando la información de puntos a considerar durante el mantenimiento.',
                  'Diagnostica el estado funcional de los sistemas mecatrónicos, identificando parámetros funcionales, deterioro de piezas internas, vibraciones, señales acústicas, detección de fugas, temperatura, alineaciones, balanceos, entre otras, en tiempo real; utilizando técnicas de monitoreo, equipos, materiales y herramientas; registrando en instrumentos que le proporcione el jefe inmediato la información y las predicciones de posibles fallas; empleando un lenguaje técnico y utilizando las TIC.',
                  'Repara la falla detectada en el sistema, equipo o maquinaria durante el diagnóstico; realizando las actividades y tareas que le indique el jefe inmediato; organizando el trabajo, gestionando el tiempo adecuadamente, sosteniendo el impulso y motivación del compromiso de reparación, optimizando los recursos materiales y económicos.'
                ],
                tx: [[0,4,7,8,9,19,21,22,23],[0,4,18,20,22],[0,1,4,5,8,11,14,19,20,22,23,26]],
                criterios: ['Mide variables de condición (temperatura, vibración, corriente, ruido)', 'Compara con valores de referencia y su tendencia', 'Predice fallas y propone la intervención', 'Registra en el formato con lenguaje técnico']
              }
            ]
          }
        }
      }
    }
  };

  // Columnas de elementos transversales de las tablas «Proceso para la formación en competencias» (programa 2024).
  // Cada actividad clave trae en «tx» las columnas marcadas con X en cada renglón de «desarrollo de la competencia».
  E.TX_COLS = ['Lengua y Comunicación', 'Inglés', 'Pensamiento Matemático', 'Conciencia Histórica', 'Cultura Digital', 'Humanidades', 'Ciencias Sociales', 'Ciencias Naturales, Exp. y Tecnología',
    'Responsabilidad Social', 'Cuidado Físico Corporal', 'Bienestar Emocional Afectivo',
    'Comunicación', 'Regulación de emociones', 'Autoconocimiento', 'Colaboración y trabajo en equipo', 'Conciencia social', 'Empatía', 'Creatividad', 'Resolución de problemas', 'Mentalidad de crecimiento', 'Toma de decisiones', 'Logro de metas', 'Autonomía en el trabajo',
    'Nexo Agua-Energía-Alimento', 'Servicios ecosistémicos', 'Sistemas socioecológicos', 'Economía ecológica'];
  (function () {
    const TX = {"1":[[[2,7,13,17,22],[2,14,17,22],[0,2,7,11,17,19,22]],[[0,2,4,7,11,17,18,21,22],[4,7,8,14,17,18,21,22,26],[4,7,14,17,18,20],[4,7,11,14,17,18,21,22,26]]],"2":[[[4,7,11,14,17,21,23],[2,4,7,11,17,18,21,26],[0,2,4,7,11,12,17,18,26]],[[0,2,7,14,21],[2,4,11,14,17,22,26]],[[2,4,7,14,17,18,21,22],[2,4,7,12,14,17,18,21,26],[0,2,4,7,9,14,17,18,21,26],[0,2,7,11,12,14,17,18,20,21,22,26]]],"3":[[[0,5,12,16,20,24,25],[2,7,11,14,18,22]],[[0,2,4,7,11,20,23,25],[0,2,4,7,11,17,19]],[[0,7,14,18,22,23],[0,2,7,9,11,14,18,20,22,23]],[[0,7,9,20,21],[0,2,7,9,11,12,19,20,21,22]]]};
    Object.keys(TX).forEach(s => TX[s].forEach((t, i) => { const ac = E.PROGRAMA.modulos.II.sub[s].ac[i]; if (ac) ac.tx = t; }));
  })();

  // Catálogos del formato de planeación (programa, pp. 14 y 146-152)
  E.FUND = {
    soc: ['Lengua y Comunicación', 'Inglés', 'Pensamiento Matemático', 'Cultura Digital', 'Conciencia Histórica'],
    areas: ['Humanidades', 'Ciencias Sociales', 'Ciencias Naturales, Exp. y Tecnología']
  };
  E.AMP = ['Responsabilidad Social', 'Cuidado Físico Corporal', 'Bienestar Emocional Afectivo'];
  E.HVYT = [
    { dim: 'Empoderamiento', items: ['Comunicación', 'Regulación de emociones', 'Autoconocimiento'] },
    { dim: 'Ciudadanía activa', items: ['Colaboración y trabajo en equipo', 'Conciencia social', 'Empatía'] },
    { dim: 'Aprendizaje', items: ['Creatividad', 'Resolución de problemas', 'Mentalidad de crecimiento'] },
    { dim: 'Empleabilidad', items: ['Toma de decisiones', 'Logro de metas', 'Autonomía en el trabajo'] }
  ];
  E.COCEDS = ['Nexo Agua-Energía-Alimento', 'Servicios ecosistémicos', 'Sistemas socioecológicos', 'Economía ecológica'];
  E.INSTR = { R: 'Rúbrica', LC: 'Lista de cotejo', GO: 'Guía de observación', B: 'Bitácora', Exa: 'Examen', Otro: 'Otro' };

  // Valores iniciales (tu cuaderno, tu horario y el Excel de listas de la escuela)
  E.DEFAULTS = {
    config: {
      docente: 'Oscar Saúl Ignacio Ramírez Velázquez',
      docenteCorto: 'Nacho',
      plantel: 'CETAC 19',
      plantelNombre: 'Centro de Estudios Tecnológicos en Aguas Continentales No. 19',
      cct: '11DCM0005Z',
      entidad: 'GUANAJUATO',
      municipio: 'Purísima del Rincón',
      turno: 'MATUTINO',
      opcion: 'ESCOLARIZADO',
      ciclo: '2026 - 2027',
      periodo: '1',
      semestreTexto: 'Agosto 2026 – Enero 2027',
      pond: { examen: 50, trabajos: 40, asistencia: 5, participacion: 5 },
      metaPart: 10,
      partModo: 'max',
      vaciasCero: true,
      retardoCuenta: true,
      justCuenta: true,
      conteoActa: 'dias',
      escalaActa: 100,
      minAsis: 80,
      minAprob: 60, umbralBien: 80,
      grupoActivo: '3AMEC',
      tema: 'auto',
      abrirDonde: true, autoSalto: true, tardeValor: 0.75
    },
    parciales: [
      { id: 'P1', nombre: '1er parcial', inicio: '2026-08-31', fin: '2026-09-25', captura: '2026-10-01', asuetos: ['2026-09-16', '2026-09-25'] },
      { id: 'P2', nombre: '2º parcial', inicio: '2026-09-28', fin: '2026-11-06', captura: '2026-11-12', asuetos: ['2026-10-21', '2026-10-30', '2026-11-02'] },
      { id: 'P3', nombre: '3er parcial', inicio: '2026-11-09', fin: '2026-12-18', captura: '2027-01-07', asuetos: ['2026-11-16', '2026-11-27'] }
    ],
    grupo3AMEC: {
      id: '3AMEC', nombre: '3°A Mecatrónica', carrera: 'TÉCNICO EN MECATRÓNICA 2025', semestre: '3', grupo: '3A',
      modulo: 'II', submodulos: { P1: '1', P2: '2', P3: '3' }, inicioDocente: '2026-10-06',
      // Horario 3 MEC: celdas azules "MÓDULO" (16 h/semana)
      horario: [
        { dia: 2, inicio: '07:30', fin: '10:00', horas: 3 },
        { dia: 2, inicio: '12:10', fin: '13:00', horas: 1 },
        { dia: 3, inicio: '07:30', fin: '10:00', horas: 3 },
        { dia: 3, inicio: '10:30', fin: '12:10', horas: 2 },
        { dia: 4, inicio: '09:10', fin: '10:00', horas: 1 },
        { dia: 4, inicio: '10:30', fin: '12:10', horas: 2 },
        { dia: 5, inicio: '07:30', fin: '10:00', horas: 3, lugar: 'computo' },
        { dia: 5, inicio: '10:30', fin: '11:20', horas: 1, lugar: 'computo' }
      ],
      alumnos: []
    }
  };

  // Borradores de planeación: basados en tus .docx del 2º y 3er parcial, corregidos al programa 2024
  // y ajustados a las horas reales del calendario (inicio con el grupo: 6 oct 2026).
  (function () {
    const II = E.PROGRAMA.modulos.II;
    const s2 = II.sub['2'].ac, s3 = II.sub['3'].ac;
    E.PLAN_SEEDS = [
      {
        id: 'plan_3AMEC_P2', grupoId: '3AMEC', parcial: 'P2', modulo: 'II', sm: '2', estado: 'Borrador',
        origen: 'Basada en tu "2do parcial 3ro.docx", corregida al programa 2024 y a las 71 h reales (inicias el 6 oct).',
        ident: { parcialTxt: '2do', elaboracion: 'Individual', docente: E.DEFAULTS.config.docente, fechas: '28 de septiembre al 06 de noviembre de 2026 (inicio con el grupo: 06 de octubre)', grupoTxt: '3°A', horasMD: 71, horasEI: 18, horasTot: 89 },
        resModulo: II.resultados.slice(),
        resSM: 'Construir mecanismos de sistemas mecatrónicos.',
        proceso: s2.map(a => a.titulo),
        desarrollo: [s2[0].desarrollo[0], s2[0].desarrollo[2], s2[1].desarrollo[1], s2[2].desarrollo[2], s2[2].desarrollo[3]],
        transv: { fund: ['Pensamiento Matemático', 'Cultura Digital'], amp: [], hvyt: ['Colaboración y trabajo en equipo', 'Resolución de problemas'], cocends: ['Economía ecológica'] },
        paec: 'Proyecto: "Diseño, corte y ensamble de un mecanismo articulado (garra o brazo) en cartón/madera"',
        paecEvid: 'Mecanismo funcionando (Producto) y defensa (Desempeño)',
        uac: [{}, {}, {}],
        estrategia: {
          diag: 'Examen diagnóstico teórico y práctico de dibujo técnico y FreeCAD (contenido del Submódulo 1)',
          form: 'Supervisión del uso seguro de herramientas manuales (cúter/segueta), del trazado de plantillas y del ensamble en FreeCAD',
          sum: 'Mecanismo funcionando sin colisiones, plano en vista explosionada, bitácora de fallas y ajustes, y examen del parcial'
        },
        practicas: [
          'Demostrativa: trazado de plantillas de eslabones a escala 1:1 y corte seguro con cúter/segueta.',
          'Guiada: modelado de eslabones, ensamble y vista explosionada en FreeCAD.',
          'Supervisada: corte y perforación de piezas de cartón/madera.',
          'Autónoma: ensamble físico con pares de enlace (tornillería M3 o alambre) y prueba del mecanismo.'
        ],
        secuencia: {
          apertura: { periodo: '6 y 7 de octubre', horas: 7, ei: 2, desc: 'Encuadre: criterios de evaluación (Examen 50 · Libreta/Proyecto/Bitácora 40 · Asistencia 5 · Participación 5), reglamento de taller y roles de equipo. Examen diagnóstico de dibujo técnico y FreeCAD. Lluvia de ideas sobre transmisión de movimiento con objetos reales.', tecnicas: ['Exposición magistral', 'Lluvia de ideas sobre la transmisión de movimiento', 'Evaluación diagnóstica (examen teórico y práctico 2D)'], evidencias: ['Examen diagnóstico resuelto (Desempeño)'], eval: { H: true }, instr: { GO: true, Exa: true }, otro: '', pond: 10 },
          desarrollo: { periodo: '7 de octubre al 3 de noviembre', horas: 52, ei: 13, desc: 'Clasificación de mecanismos y pares cinemáticos. Modelado de eslabones en FreeCAD, ensamble y vista explosionada. Plantillas 1:1 impresas desde FreeCAD. Corte, perforación y ensamble de piezas en cartón/madera con pares de enlace.', tecnicas: ['Aprendizaje basado en proyectos (ABP)', 'Práctica guiada en FreeCAD: ensamble y vista explosionada', 'Taller de trazado y corte de plantillas', 'Ensamble de piezas mediante pares de enlace'], evidencias: ['Plano del ensamble en vista explosionada (Producto)', 'Piezas cortadas con dimensiones correctas (Producto)', 'Uso seguro de herramientas manuales (Desempeño)'], eval: { C: true, H: true }, instr: { LC: true }, otro: '', pond: 40 },
          cierre: { periodo: '4 al 6 de noviembre', horas: 12, ei: 3, desc: 'Exposición de proyectos, pruebas de funcionamiento del mecanismo, plenaria de resultados y examen del parcial.', tecnicas: ['Exposición de proyectos', 'Pruebas de funcionamiento físico del mecanismo', 'Plenaria de resultados', 'Examen del parcial'], evidencias: ['Mecanismo de cartón/madera funcionando sin colisiones (Producto)', 'Bitácora de fallas y ajustes (Producto)', 'Defensa del proyecto (Desempeño)'], eval: { A: true, H: true }, instr: { R: true, GO: true, B: true, Exa: true }, otro: '', pond: 50 }
        },
        recursos: {
          material: ['FreeCAD 1.x (Sketcher, Part Design, Assembly y TechDraw)', 'Cartón grueso, madera balsa o cascarón', 'Pegamento blanco o silicón', 'Tornillería M3/M4 con tuercas, broches latonados, cinchos o alambre recocido (ejes)'],
          equipo: ['Computadoras del plantel con FreeCAD', 'Cúter industrial o exactos y seguetas de arco pequeño', 'Regla metálica, compás y escuadras', 'Desarmadores de cruz y plano'],
          fuentes: [E.FUENTE_PROGRAMA + ', Módulo II, pp. 32-53.', 'Myszka, D. H. (2012). Máquinas y mecanismos (4ª ed.). Pearson.', 'Rivera, J. C. D. (2021). Manual de Mecanismos. CNAD.', 'Diagramas esquemáticos de mecanismos de 4 barras (impresos o PDF).', 'Reglamento de seguridad del taller.']
        },
        valida: { elaboro: E.DEFAULTS.config.docente, reviso: '', avalo: '' },
        notas: 'Correcciones respecto a tu .docx: nombre del módulo según el programa 2024 ("Construye sistemas mecatrónicos"), resultado del módulo, "Desarrollo de la competencia" llenado con el programa, ponderaciones del inciso D alineadas con la secuencia (10/40/50), horas ajustadas a 71 y se agregó la actividad clave de vista explosionada en FreeCAD.'
      },
      {
        id: 'plan_3AMEC_P3', grupoId: '3AMEC', parcial: 'P3', modulo: 'II', sm: '3', estado: 'Borrador',
        origen: 'Basada en tu "3er parcial 3ro.docx", corregida al programa 2024 y a las 92 h reales del calendario.',
        ident: { parcialTxt: '3er', elaboracion: 'Individual', docente: E.DEFAULTS.config.docente, fechas: '09 de noviembre al 18 de diciembre de 2026', grupoTxt: '3°A', horasMD: 92, horasEI: 23, horasTot: 115 },
        resModulo: II.resultados.slice(),
        resSM: 'Instalar sistemas neumáticos, electroneumáticos, hidráulicos y electrohidráulicos.',
        proceso: s3.map(a => a.titulo),
        desarrollo: [s3[0].desarrollo[0], s3[2].desarrollo[0], s3[2].desarrollo[1], s3[3].desarrollo[0], s3[3].desarrollo[1]],
        transv: { fund: ['Pensamiento Matemático'], amp: ['Cuidado Físico Corporal'], hvyt: ['Colaboración y trabajo en equipo', 'Resolución de problemas', 'Toma de decisiones'], cocends: ['Economía ecológica'] },
        paec: 'Proyecto integrador: "Construcción y operación de una Grúa Mecatrónica Hidráulica y Motorizada"',
        paecEvid: 'Grúa operando (Producto) y defensa oral (Desempeño)',
        uac: [{}, {}, {}],
        estrategia: {
          diag: 'Cuestionario inicial sobre propiedades de los fluidos, Principio de Pascal y nociones básicas de circuitos eléctricos',
          form: 'Supervisión directa durante el ensamblaje, sellado de mangueras, purgado y conexión segura de motores DC; asesoría en la resolución de fugas o fallas eléctricas',
          sum: 'Evaluación práctica y defensa final de la grúa operando integradamente (levantando y moviendo carga), bitácora técnica de fallas y examen del parcial'
        },
        practicas: [
          'Demostrativa: trazado en libreta del circuito hidráulico (simbología ISO 1219) y del diagrama de escalera del motor.',
          'Guiada: montaje, sellado y purgado de un sistema hidráulico cerrado con jeringas y mangueras.',
          'Supervisada: instalación de un circuito eléctrico de CD (motor, portapilas e interruptor).',
          'Autónoma: integración electrohidráulica en el mecanismo del 2º parcial para operar la grúa.'
        ],
        secuencia: {
          apertura: { periodo: '10 y 11 de noviembre', horas: 9, ei: 2, desc: 'Exposición sobre el Principio de Pascal, fuerza y fluidos. Lluvia de ideas sobre usos industriales (retroexcavadoras, frenos, prensas). Cuestionario diagnóstico. Asignación de materiales a comprar.', tecnicas: ['Exposición magistral', 'Lluvia de ideas', 'Cuestionario diagnóstico'], evidencias: ['Cuestionario diagnóstico contestado (Desempeño)', 'Participación en clase (Desempeño)'], eval: { H: true }, instr: { GO: true, Exa: true }, otro: '', pond: 10 },
          desarrollo: { periodo: '12 de noviembre al 4 de diciembre', horas: 51, ei: 13, desc: 'Taller de diagramas en libreta (hidráulico con simbología ISO 1219 y eléctrico de escalera). Instalación física: jeringas y mangueras purgadas con agua, empalme de cables del motor DC con pilas e interruptor, adaptando todo al mecanismo del 2º parcial.', tecnicas: ['Aprendizaje basado en proyectos (ABP)', 'Taller de conexión: diagramas en la libreta', 'Instalación hidráulica y eléctrica'], evidencias: ['Diagramas en libreta (Producto)', 'Instalación hidráulica purgada sin fugas (Desempeño)', 'Circuito eléctrico funcionando sin cortos (Desempeño)'], eval: { C: true, H: true }, instr: { LC: true }, otro: '', pond: 40 },
          cierre: { periodo: '7 al 18 de diciembre', horas: 32, ei: 8, desc: 'Feria de proyectos: pruebas de funcionamiento de la grúa levantando y moviendo carga, detección y corrección de fallas en tiempo real, examen del parcial y plenaria final.', tecnicas: ['Exposición de proyectos (feria)', 'Pruebas de funcionamiento con carga', 'Detección y corrección de fallas en tiempo real', 'Plenaria final de aprendizajes'], evidencias: ['Grúa mecatrónica operando correctamente (Producto)', 'Defensa oral del proyecto (Desempeño)', 'Bitácora técnica de fallas y soluciones (Producto)'], eval: { A: true, H: true }, instr: { R: true, B: true, Exa: true }, otro: '', pond: 50 }
        },
        recursos: {
          material: ['Jeringas de plástico nuevas sin aguja (10 ml y 20 ml)', 'Manguera transparente flexible (de acuario o silicón)', 'Agua con colorante vegetal', 'Motores DC de 3 a 5 V, portapilas AA y pilas', 'Interruptores de botón o palanca; cable calibre 22 o 24', 'Cinchos, cinta de aislar e hilo resistente (polea del motor)', 'Mecanismo de cartón/madera del 2º parcial'],
          equipo: ['Pinzas de corte y de punta', 'Pistolas de silicón caliente', 'Pelacables o cúter industrial', 'Computadoras del plantel con FreeCAD (dibujo de la estructura)'],
          fuentes: [E.FUENTE_PROGRAMA + ', Módulo II, pp. 40-53.', 'Guillén, A. S. (1999). Introducción a la Neumática. Alfaomega Marcombo.', 'Ruiz, R. G. (2015). Manual de Neumática. CNAD.', 'Bolton, W. (2013). Mecatrónica (5ª ed.). Alfaomega.', 'NOM-017-STPS-2008. Equipo de protección personal. (Hoy rige la NOM-017-STPS-2024, DOF 28/03/2025.)']
        },
        valida: { elaboro: E.DEFAULTS.config.docente, reviso: '', avalo: '' },
        notas: 'Correcciones respecto a tu .docx: nombre del módulo y resultado del módulo según el programa 2024, las 4 actividades clave del Submódulo 3, desarrollo de la competencia con el texto del programa y horas ajustadas a 92 (10 + 39 + 48 sumaban 97). Ojo: el programa incluye neumática y simulación; considera la idea "Jeringa de aire vs. agua" del banco de ideas para cubrir neumática sin compresor.'
      }
    ];
  })();
})(window.E);
