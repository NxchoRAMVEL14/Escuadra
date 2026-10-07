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
        sub: {
          '1': { nombre: 'Comprueba el funcionamiento de circuitos electrónicos', horas: 64, ac: [{ titulo: 'Interpreta planos y diagramas electrónicos' }, { titulo: 'Verifica las variables eléctricas del circuito electrónico' }] },
          '2': { nombre: 'Ensambla circuitos electrónicos analógicos', horas: 112, ac: [{ titulo: 'Arma circuitos electrónicos analógicos' }, { titulo: 'Monta circuitos electrónicos en placas de circuito impreso' }] },
          '3': { nombre: 'Diseña circuitos electrónicos digitales', horas: 96, ac: [{ titulo: 'Elabora el diagrama del circuito electrónico digital' }, { titulo: 'Verifica el funcionamiento del circuito digital' }] }
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
          'NOM-008-SCFI-2002. Sistema general de unidades de medida.',
          'NOM-017-STPS-2008. Equipo de protección personal.',
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
        sub: {
          '1': { nombre: 'Instala elementos de potencia y control', horas: 96, ac: [{ titulo: 'Interpreta planos y diagramas del tablero de control' }, { titulo: 'Selecciona componentes periféricos del sistema de potencia y control' }, { titulo: 'Ensambla elementos de potencia y control' }, { titulo: 'Comprueba el funcionamiento del sistema de potencia y control' }] },
          '2': { nombre: 'Programa controladores lógicos', horas: 96, ac: [{ titulo: 'Inspecciona el funcionamiento y cableado del PLC' }, { titulo: 'Formula el programa para el controlador' }, { titulo: 'Verifica el funcionamiento del programa' }] },
          '3': { nombre: 'Programa sistemas embebidos', horas: 80, ac: [{ titulo: 'Inspecciona el funcionamiento interno y cableado del sistema embebido' }, { titulo: 'Programa el código para la tarjeta' }, { titulo: 'Verifica el funcionamiento del sistema' }] }
        }
      },
      IV: {
        nombre: 'Opera sistemas flexibles de manufactura de piezas mecánicas', horas: 192, semestre: 5, pag: 76,
        resultados: ['Operar sistemas flexibles de manufactura de piezas mecánicas', 'Configurar equipos de manufactura de piezas mecánicas', 'Programar sistemas robóticos'],
        sub: {
          '1': { nombre: 'Configura equipos de manufactura de piezas mecánicas', horas: 96, ac: [{ titulo: 'Manipula equipos y máquinas-herramienta para la manufactura de piezas mecánicas' }, { titulo: 'Programa equipos (CNC) para la manufactura de piezas mecánicas' }, { titulo: 'Comprueba la manufactura de piezas mecánicas con simuladores y materiales de prueba' }] },
          '2': { nombre: 'Programa sistemas robóticos', horas: 96, ac: [{ titulo: 'Prepara el sistema robótico de acuerdo con el proceso de producción' }, { titulo: 'Desarrolla la programación del sistema robótico de acuerdo con el proceso de producción' }, { titulo: 'Valida la programación del sistema robótico por medio de simuladores de producción' }] }
        }
      },
      V: {
        nombre: 'Opera sistemas mecatrónicos', horas: 192, semestre: 6, pag: 97,
        resultados: ['Operar sistemas mecatrónicos', 'Automatizar sistemas mecatrónicos', 'Mantener sistemas mecatrónicos en funcionamiento'],
        sub: {
          '1': { nombre: 'Automatiza sistemas mecatrónicos', horas: 96, ac: [{ titulo: 'Diseña soluciones para automatizar sistemas mecatrónicos' }, { titulo: 'Ensambla componentes del sistema automatizado' }, { titulo: 'Comprueba el funcionamiento del sistema automatizado' }] },
          '2': { nombre: 'Mantiene sistemas mecatrónicos en funcionamiento', horas: 96, ac: [{ titulo: 'Ejecuta órdenes de mantenimiento preventivo de componentes del sistema mecatrónico' }, { titulo: 'Ejecuta órdenes de mantenimiento correctivo del sistema mecatrónico' }, { titulo: 'Ejecuta órdenes de mantenimiento predictivo del sistema mecatrónico' }] }
        }
      }
    }
  };

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
      vaciasCero: true,
      retardoCuenta: true,
      justCuenta: true,
      conteoActa: 'dias',
      escalaActa: 100,
      minAsis: 80,
      minAprob: 60,
      grupoActivo: '3AMEC',
      tema: 'auto'
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
        { dia: 5, inicio: '07:30', fin: '10:00', horas: 3 },
        { dia: 5, inicio: '10:30', fin: '11:20', horas: 1 }
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
          fuentes: [E.FUENTE_PROGRAMA + ', Módulo II, pp. 40-53.', 'Guillén, A. S. (1999). Introducción a la Neumática. Alfaomega Marcombo.', 'Ruiz, R. G. (2015). Manual de Neumática. CNAD.', 'Bolton, W. (2013). Mecatrónica (5ª ed.). Alfaomega.', 'NOM-017-STPS-2008. Equipo de protección personal.']
        },
        valida: { elaboro: E.DEFAULTS.config.docente, reviso: '', avalo: '' },
        notas: 'Correcciones respecto a tu .docx: nombre del módulo y resultado del módulo según el programa 2024, las 4 actividades clave del Submódulo 3, desarrollo de la competencia con el texto del programa y horas ajustadas a 92 (10 + 39 + 48 sumaban 97). Ojo: el programa incluye neumática y simulación; considera la idea "Jeringa de aire vs. agua" del banco de ideas para cubrir neumática sin compresor.'
      }
    ];
  })();
})(window.E);
