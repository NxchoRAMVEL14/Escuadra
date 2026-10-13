/* Escuadra · Normas oficiales (v1.26). Apartado para que el docente estudie y repase las NOM que tocan a la carrera de
   Mecatrónica: ficha de cada una (qué regula, obligaciones, qué significa en el taller de la escuela), cómo la cita el
   programa SEP y cuál es la versión vigente, dónde aparece en el contenido de la app, enlace a su ficha oficial en el
   Catálogo Mexicano de Normas (PLATIICA, Secretaría de Economía: ahí está el PDF y su estado) y repaso con preguntas que
   vuelven a salir según lo que fallas (repetición espaciada, cajas de Leitner).
   Vigencia verificada el 12 de octubre de 2026 contra PLATIICA, el DOF y notas de despachos (Holland & Knight, IDC, Hogan
   Lovells). Las NOM-STPS obligan a los centros de trabajo; con los alumnos sirven como formación y buena práctica.
   Los datos numéricos de la NOM-002-STPS-2010 (simulacros, extintores) se tomaron del PDF oficial de la norma. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const NR = E.normas = {};
  const VERIF = '2026-10-12';
  const PLAT = s => 'https://platiica.economia.gob.mx/normalizacion/' + s + '/';
  NR.DOF = 'https://www.dof.gob.mx/';
  NR.AREAS = { proteccion: '🦺 Protección y maquinaria', electrica: '⚡ Electricidad', quimicos: '🧪 Sustancias y residuos', emergencias: '🔥 Emergencias y señales', organizacion: '🤝 Organización y salud', medicion: '📏 Medición' };
  // pr: [pregunta, [correcta, distractor, distractor, distractor], explicación]
  NR.LISTA = [
    { id: '017-STPS', clave: 'NOM-017-STPS-2024', area: 'proteccion', tit: 'Equipo de protección personal: selección, uso y manejo en los centros de trabajo', dof: '2025-03-28', vigor: '2025-09-28', antes: 'NOM-017-STPS-2008', slug: 'nom-017-stps-2024',
      que: 'Dice cómo elegir, dar, usar, revisar y desechar el equipo de protección personal (EPP) según los riesgos de cada puesto. Sustituyó a la versión 2008 el 28 de septiembre de 2025 y abrogó la NOM-101-STPS-1994 (extintores de espuma química).',
      patron: ['Identificar y analizar los riesgos de cada puesto y área para elegir el EPP.', 'Dar EPP adecuado al riesgo, de la talla correcta y compatible con otros equipos (lentes graduados, audífonos).', 'Capacitar en su uso, revisión, limpieza, mantenimiento, resguardo y disposición final.', 'Supervisar que se use y señalizar las áreas donde es obligatorio.', 'Novedad 2024: manejo del EPP contaminado con sustancias peligrosas.'],
      trab: ['Usar y revisar el EPP como se le capacitó.', 'Reportar daños o fallas en su función de protección.'],
      taller: ['El EPP es la última barrera: antes se elimina el peligro, se aísla o se pone guarda.', 'Lentes al cortar, perforar, soldar o trabajar con resortes y aire a presión.', 'Cabello recogido; sin anillos, pulseras ni ropa suelta cerca de piezas que giran.', 'Tu reglamento y la revisión de Seguridad ya lo piden antes de cada práctica.'],
      rx: /./,
      pr: [['¿Qué norma sustituyó a la NOM-017-STPS-2008?', ['NOM-017-STPS-2024', 'NOM-017-STPS-2018', 'NOM-019-STPS-2011', 'NOM-026-STPS-2008'], 'Se publicó en el DOF el 28/03/2025 y entró en vigor seis meses después (28/09/2025).'],
        ['¿En qué se basa la selección del EPP según la norma?', ['En el análisis de riesgos del puesto y del área', 'En el presupuesto de la empresa', 'En lo que prefiera cada trabajador', 'Solo en el giro de la empresa'], 'Primero se identifican y analizan los riesgos; con eso se elige el EPP.'],
        ['Un trabajador nota que su careta está estrellada. Según la norma, ¿qué le toca?', ['Reportar la falla al patrón', 'Repararla con cinta', 'Seguir usándola hasta el cambio anual', 'Comprar otra por su cuenta'], 'La obligación del trabajador es revisar su EPP y reportar daños o fallas.'],
        ['¿Qué lugar ocupa el EPP en la jerarquía de controles de riesgos?', ['El último recurso, después de eliminar, sustituir y aislar el peligro', 'La primera medida', 'Reemplaza a las guardas de las máquinas', 'Solo aplica cuando no hay capacitación'], 'El EPP protege a la persona pero no quita el peligro: va al final de la jerarquía.'],
        ['¿Qué norma abrogó la NOM-017-STPS-2024?', ['La NOM-101-STPS-1994 (extintores de espuma química)', 'La NOM-004-STPS-1999', 'La NOM-035-STPS-2018', 'Ninguna'], 'Además de sustituir a la versión 2008, abrogó la NOM-101-STPS-1994.']] },
    { id: '004-STPS', clave: 'NOM-004-STPS-1999', area: 'proteccion', tit: 'Sistemas de protección y dispositivos de seguridad en la maquinaria y equipo', dof: '1999-05-31', slug: 'nom-004-stps-1999', proy: 'Existe un proyecto de actualización (PROY-NOM-004-STPS-2020) que hasta octubre de 2026 no se ha publicado como norma definitiva.',
      que: 'Pide que la maquinaria y el equipo tengan protectores y dispositivos de seguridad y que haya un programa para operarla y darle mantenimiento sin accidentes.',
      patron: ['Hacer el estudio o análisis de riesgos de la maquinaria y equipo.', 'Tener un programa específico de seguridad para su operación y mantenimiento.', 'Poner protectores y dispositivos de seguridad (guardas, paro de emergencia, interruptores de puerta).', 'Bloquear las fuentes de energía durante el mantenimiento (candado y tarjeta).', 'Capacitar a quienes la operan y la mantienen; señalizar.'],
      trab: ['No retirar ni anular protectores ni dispositivos de seguridad.', 'Reportar fallas de la maquinaria y de sus protecciones.', 'Seguir el programa de seguridad y usar el EPP.'],
      taller: ['Nunca se puentea un paro de emergencia ni un interruptor de puerta, ni «para probar».', 'La máquina se prepara apagada y bloqueada; el docente la energiza.', 'Guardas en partes móviles: bandas, engranes, husillos.'],
      rx: /m[aá]quina|motor|taladr|cnc|torno|fresad|robot|banda|engran|transportad|herramient/i,
      pr: [['¿Qué prohíbe la norma a los trabajadores?', ['Retirar o anular protectores y dispositivos de seguridad', 'Usar el EPP', 'Reportar fallas', 'Seguir el programa de mantenimiento'], 'Anular un dispositivo de seguridad es la causa clásica de atrapamientos.'],
        ['¿Cuál es la versión vigente en octubre de 2026?', ['NOM-004-STPS-1999', 'NOM-004-STPS-2020', 'NOM-004-STPS-2024', 'Ninguna: se canceló'], 'El PROY-NOM-004-STPS-2020 no se ha publicado como norma definitiva.'],
        ['Durante el mantenimiento de una máquina, ¿qué se hace con sus fuentes de energía?', ['Se bloquean con candado y tarjeta y se verifica energía cero', 'Se dejan conectadas para probar', 'Se apaga solo el botón de arranque', 'Se avisa de palabra y basta'], 'Bloqueo y etiquetado: nadie puede energizar mientras alguien trabaja.'],
        ['¿Qué debe tener el patrón por escrito para cada máquina?', ['Un programa específico de seguridad para operación y mantenimiento', 'La factura de compra', 'El manual en inglés', 'Una foto del operador'], 'El programa dice cómo operarla, mantenerla y bloquearla con seguridad.']] },
    { id: '029-STPS', clave: 'NOM-029-STPS-2011', area: 'electrica', tit: 'Mantenimiento de las instalaciones eléctricas en los centros de trabajo: condiciones de seguridad', dof: '2011-12-29', slug: 'nom-029-stps-2011',
      que: 'Fija las condiciones de seguridad para dar mantenimiento a instalaciones eléctricas, para evitar choques, quemaduras y arcos eléctricos.',
      patron: ['Tener el diagrama unifilar de la instalación actualizado.', 'Contar con procedimientos de seguridad para cada tipo de mantenimiento.', 'Autorizar solo a personal capacitado para hacer trabajos eléctricos.', 'Dar EPP y herramienta aislada; aplicar bloqueo y señalización.', 'Tener un plan para atender emergencias por choque eléctrico.'],
      trab: ['Seguir los procedimientos y usar el EPP dieléctrico.', 'No trabajar en instalaciones energizadas sin autorización.'],
      taller: ['Cinco reglas de oro: desconectar, bloquear, verificar ausencia de tensión, poner a tierra (en alta tensión) y señalizar.', 'En la escuela: prácticas a 12 V; el lado de 127 V lo conecta y prueba el docente.', 'Se cablea sin energía; se energiza solo después de que el docente revisó.'],
      rx: /127|el[eé]ctric|tablero|contactor|relevador|motor|instalaci[oó]n|fuente|cablead/i,
      pr: [['Antes de intervenir un tablero, ¿qué secuencia se sigue?', ['Desconectar, bloquear, verificar ausencia de tensión y señalizar', 'Medir con la mano si hay calor', 'Avisar y trabajar rápido', 'Bajar solo el interruptor general'], 'Son las reglas de oro; la norma pide procedimientos como estos.'],
        ['¿Quién puede dar mantenimiento a una instalación eléctrica?', ['Personal capacitado y autorizado por el patrón', 'Cualquier trabajador con experiencia', 'Solo un ingeniero titulado', 'El que esté de turno'], 'La autorización la da el patrón a personal capacitado.'],
        ['¿Qué documento de la instalación pide tener actualizado?', ['El diagrama unifilar', 'El organigrama', 'La lista de proveedores', 'El recibo de luz'], 'Sin unifilar no se sabe qué se desconecta ni qué queda energizado.']] },
    { id: '001-SEDE', clave: 'NOM-001-SEDE-2012', area: 'electrica', tit: 'Instalaciones eléctricas (utilización)', dof: '2012-11-29', vigor: '2013-05-29', slug: 'NOM-001-SEDE-2012', dep: 'SENER', proy: 'En 2025 se presentó un anteproyecto de actualización; sigue vigente la 2012.',
      que: 'Especificaciones técnicas para que las instalaciones eléctricas de utilización protejan a las personas y los bienes: choque eléctrico, efectos térmicos, sobrecorrientes y fallas a tierra.',
      patron: ['Que la instalación cumpla la norma (en obra nueva la revisa una unidad de verificación).', 'Calibres, protecciones y puesta a tierra según sus tablas y artículos.'],
      trab: ['Respetar los colores de los conductores y las protecciones de cada circuito.'],
      taller: ['Puesta a tierra de equipos: verde, verde con franjas amarillas o desnudo; neutro: blanco o gris.', 'Calibre según la corriente (tabla 310-15(b)(16), columna de 60 °C): 14 AWG hasta 15 A, 12 AWG hasta 20 A, 10 AWG hasta 30 A (artículo 240-4).', 'Cada circuito con su protección contra sobrecorriente.'],
      rx: /cable|calibre|tablero|instalaci[oó]n|fusible|termomagn/i,
      pr: [['¿De qué color es el conductor de puesta a tierra de los equipos?', ['Verde, verde con franjas amarillas o desnudo', 'Blanco o gris', 'Rojo', 'Negro'], 'Así lo identifica la NOM-001-SEDE-2012.'],
        ['¿De qué color es el conductor neutro?', ['Blanco o gris', 'Verde', 'Azul', 'Negro'], 'El neutro (conductor puesto a tierra) es blanco o gris.'],
        ['Con la columna de 60 °C, ¿hasta cuántos amperes se protege un 12 AWG?', ['20 A', '15 A', '30 A', '40 A'], 'Tabla 310-15(b)(16) y artículo 240-4: 14 AWG 15 A, 12 AWG 20 A, 10 AWG 30 A.']] },
    { id: '022-STPS', clave: 'NOM-022-STPS-2015', area: 'electrica', tit: 'Electricidad estática en los centros de trabajo: condiciones de seguridad', dof: '2016-04-01', antes: 'NOM-022-STPS-2008', slug: 'nom-022-stps-2015',
      que: 'Pide controlar la electricidad estática y proteger contra descargas atmosféricas donde puedan causar incendio, explosión o daño a personas y equipos.',
      patron: ['Identificar dónde se acumula electricidad estática y dónde es peligrosa (inflamables, polvos).', 'Tener puesta a tierra, conexión equipotencial y, si aplica, pararrayos.', 'Medir y registrar la red de puesta a tierra y su continuidad.'],
      trab: ['Usar los medios de descarga (pulseras, calzado o tapetes) donde se indique.'],
      taller: ['En electrónica, la descarga daña los circuitos integrados: toca metal aterrizado antes y no los tomes por las patitas.', 'Donde hay vapores inflamables, una chispa estática puede ser fuente de ignición.'],
      rx: /integrad|electr[oó]nic|esd|arduino|microcontrol/i,
      pr: [['¿Qué versión sustituyó a la NOM-022-STPS-2008?', ['NOM-022-STPS-2015', 'NOM-022-STPS-2024', 'NOM-029-STPS-2011', 'NOM-001-SEDE-2012'], 'La NOM-022-STPS-2015 se publicó en el DOF en abril de 2016.'],
        ['¿Para qué sirve la conexión a tierra y equipotencial contra la estática?', ['Para descargar la carga acumulada sin chispa peligrosa', 'Para subir el voltaje', 'Para medir corriente', 'Para ahorrar energía'], 'Igualar potenciales evita la descarga en forma de chispa.']] },
    { id: '018-STPS', clave: 'NOM-018-STPS-2015', area: 'quimicos', tit: 'Sistema armonizado para la identificación y comunicación de peligros y riesgos por sustancias químicas peligrosas', dof: '2015-10-09', antes: 'NOM-018-STPS-2000', slug: 'nom-018-stps-2015',
      que: 'Adopta el Sistema Globalmente Armonizado (SGA): cada sustancia peligrosa debe tener su hoja de datos de seguridad (HDS) y estar señalizada con pictogramas y palabras de advertencia.',
      patron: ['Tener la hoja de datos de seguridad de cada sustancia, en español y a la mano.', 'Señalizar recipientes con pictogramas, palabra de advertencia e indicaciones de peligro.', 'Capacitar sobre lo que dicen las HDS y la señalización.'],
      trab: ['Consultar la HDS antes de manejar una sustancia y respetar la señalización.'],
      taller: ['Cloruro férrico, alcohol isopropílico, flux y acetona: frasco etiquetado y HDS a la mano.', 'Las HDS del SGA tienen 16 secciones (identificación, peligros, primeros auxilios, manejo, EPP…).'],
      rx: /cloruro|qu[ií]mic|[aá]cido|solvente|acetona|alcohol|flux|lubric|aceite|placa/i,
      pr: [['¿Qué sistema adopta la NOM-018-STPS-2015?', ['El Sistema Globalmente Armonizado (SGA)', 'El sistema de rombos de la NFPA', 'El sistema métrico', 'El sistema de colores de tuberías'], 'Por eso se le conoce como «la norma del SGA».'],
        ['¿Cuántas secciones tiene una hoja de datos de seguridad según el SGA?', ['16', '8', '10', '24'], 'Del 1 (identificación) al 16 (otra información).'],
        ['¿Cuáles son las palabras de advertencia del SGA?', ['«Peligro» y «Atención»', '«Alto» y «Siga»', '«Tóxico» y «Seguro»', '«Rojo» y «Amarillo»'], '«Peligro» para lo más grave y «Atención» para lo menos grave.']] },
    { id: '005-STPS', clave: 'NOM-005-STPS-1998', area: 'quimicos', tit: 'Condiciones de seguridad e higiene para el manejo, transporte y almacenamiento de sustancias químicas peligrosas', dof: '1999-02-02', slug: 'nom-005-stps-1998', prog: 'El programa del Módulo I cita el PROY-NOM-005-STPS-2017, que no llegó a publicarse como definitivo.',
      que: 'Pide manejar, transportar y almacenar las sustancias químicas peligrosas con procedimientos, recipientes adecuados, ventilación, EPP y capacitación.',
      patron: ['Estudio de riesgos de las sustancias que se manejan.', 'Procedimientos de manejo, transporte y almacenamiento; recipientes identificados.', 'Capacitación y EPP; regaderas o lavaojos donde se requieran.'],
      trab: ['Seguir los procedimientos y usar el EPP.'],
      taller: ['Ventilación, guantes de nitrilo y lentes con cloruro férrico; nunca se tira al drenaje.', 'Recipientes cerrados, etiquetados y lejos de calor y del área de soldadura.'],
      rx: /cloruro|qu[ií]mic|[aá]cido|solvente|acetona/i,
      pr: [['¿Qué versión de la NOM-005-STPS está vigente?', ['NOM-005-STPS-1998', 'NOM-005-STPS-2017', 'NOM-005-STPS-2023', 'Ninguna'], 'El proyecto 2017 que cita el programa no se publicó como definitivo.'],
        ['¿Qué se hace con el cloruro férrico usado del taller?', ['Se guarda en recipiente cerrado para reusar o entregar a disposición', 'Se tira al drenaje con mucha agua', 'Se evapora al sol', 'Se mezcla con cloro'], 'Es corrosivo y contiene cobre disuelto: es residuo peligroso.']] },
    { id: '052-SEMARNAT', clave: 'NOM-052-SEMARNAT-2005', area: 'quimicos', tit: 'Características, procedimiento de identificación, clasificación y listados de los residuos peligrosos', dof: '2006-06-23', slug: 'nom-052-semarnat-2005', dep: 'SEMARNAT', proy: 'Su revisión sistemática de agosto de 2026 concluyó «Modificación»: puede salir una versión nueva.',
      que: 'Dice cuándo un residuo es peligroso: si está en sus listados o si tiene alguna característica CRETIB.',
      patron: ['Identificar y clasificar sus residuos; separar y entregar los peligrosos a un gestor autorizado (Ley General para la Prevención y Gestión Integral de los Residuos).'],
      trab: ['Separar los residuos como se indique.'],
      taller: ['Peligrosos típicos del taller: aceite usado y estopas con aceite, cloruro férrico agotado, pilas y baterías, envases de solventes.', 'Se separan, se etiquetan y se entregan; no van a la basura común.'],
      rx: /aceite|lubric|estopa|pila|bater[ií]a|cloruro/i,
      pr: [['¿Qué significa CRETIB?', ['Corrosivo, Reactivo, Explosivo, Tóxico, Inflamable y Biológico-infeccioso', 'Calor, Riesgo, Energía, Temperatura, Impacto y Bloqueo', 'Combustible, Radiactivo, Eléctrico, Térmico, Inerte y Básico', 'Ninguna de las anteriores'], 'Si un residuo tiene cualquiera de esas características, es peligroso.'],
        ['¿Qué se hace con las estopas con aceite del mantenimiento?', ['Se separan como residuo peligroso y se entregan a un gestor', 'A la basura común', 'Se queman', 'Se lavan y se tiran'], 'Están impregnadas de aceite usado: residuo peligroso.']] },
    { id: '002-STPS', clave: 'NOM-002-STPS-2010', area: 'emergencias', tit: 'Prevención y protección contra incendios en los centros de trabajo', dof: '2010-12-09', vigor: '2011-06-09', slug: 'nom-002-stps-2010',
      que: 'Pide clasificar el riesgo de incendio (ordinario o alto), tener extintores y otros medios, brigadas, plan de atención a emergencias y simulacros.',
      patron: ['Clasificar el riesgo de incendio del centro de trabajo (Apéndice A).', 'Extintores del tipo y capacidad adecuados; revisión mensual y mantenimiento al menos una vez al año.', 'Plan de atención a emergencias y brigadas capacitadas.', 'Simulacros: al menos uno al año con riesgo ordinario; dos con riesgo alto.'],
      trab: ['Participar en simulacros y brigadas; no obstruir extintores ni salidas.'],
      taller: ['Extintor colgado a no más de 1.50 m del piso (a su parte más alta), visible y sin obstáculos.', 'Clases de fuego: A sólidos, B líquidos y gases inflamables, C equipo eléctrico energizado, D metales, K aceites de cocina.', 'Distancia máxima de recorrido al extintor con riesgo ordinario: 23 m (clases A, C y D) y 15 m (clase B).', 'Registra tus simulacros en Seguridad → Simulacros.'],
      rx: /sold|caut[ií]n|l[aá]ser|el[eé]ctric|127/i,
      pr: [['Con riesgo de incendio ordinario, ¿cada cuándo se hacen simulacros?', ['Al menos una vez al año', 'Cada mes', 'Cada cinco años', 'Solo cuando hay inspección'], 'Numeral 5.7: una vez al año con riesgo ordinario y dos con riesgo alto.'],
        ['¿Cada cuándo se revisan los extintores?', ['Cada mes', 'Cada año', 'Cada semana', 'Solo después de usarlos'], 'Revisión mensual con programa anual (numeral 7.2); mantenimiento al menos una vez al año.'],
        ['¿A qué altura máxima se coloca un extintor?', ['1.50 m del piso a su parte más alta', '2.00 m', '1.00 m', 'A cualquier altura si se ve'], 'Numeral 7.17, inciso f.'],
        ['¿Qué clase de fuego es un tablero eléctrico energizado?', ['Clase C', 'Clase A', 'Clase B', 'Clase K'], 'C: equipo eléctrico energizado; se usa CO₂ o polvo químico seco, nunca agua.'],
        ['Con riesgo ordinario, ¿cuál es la distancia máxima de recorrido a un extintor para fuego clase A?', ['23 m', '15 m', '10 m', '50 m'], 'Tabla 1: 23 m para clases A, C y D; 15 m para clase B; 10 m para clase K.']] },
    { id: '026-STPS', clave: 'NOM-026-STPS-2008', area: 'emergencias', tit: 'Colores y señales de seguridad e higiene, e identificación de riesgos por fluidos conducidos en tuberías', dof: '2008-11-25', slug: 'nom-026-stps-2008',
      que: 'Define los colores, formas y símbolos de las señales de seguridad y cómo identificar las tuberías según el fluido que llevan.',
      patron: ['Señalizar con los colores y formas de la norma; capacitar para entenderlas.', 'Identificar las tuberías por color y con el nombre del fluido y la dirección del flujo.'],
      trab: ['Respetar la señalización.'],
      taller: ['Rojo: paro, prohibición y equipo contra incendio. Amarillo: advertencia. Verde: condición segura. Azul: obligación.', 'Formas: círculo con banda diagonal = prohibición; triángulo = advertencia; círculo azul = obligación; cuadrado o rectángulo = información.', 'Botón de paro de emergencia: rojo sobre fondo amarillo.'],
      rx: /neum[aá]tic|hidr[aá]ulic|tuber|paro|señal/i,
      pr: [['¿Qué significa el color azul en una señal de seguridad?', ['Obligación (por ejemplo, usar lentes)', 'Prohibición', 'Advertencia', 'Condición segura'], 'Azul = acción obligatoria.'],
        ['¿Qué significa el amarillo?', ['Advertencia o precaución', 'Obligación', 'Ruta de evacuación', 'Equipo contra incendio'], 'Amarillo con negro: advertencia de peligro.'],
        ['¿Qué forma tiene una señal de prohibición?', ['Círculo con banda diagonal', 'Triángulo', 'Cuadrado', 'Rombo'], 'Rojo, círculo con banda diagonal.'],
        ['¿Qué significa el verde?', ['Condición segura (salidas, primeros auxilios)', 'Prohibición', 'Obligación', 'Peligro eléctrico'], 'Verde = condición segura.']] },
    { id: '003-SEGOB', clave: 'NOM-003-SEGOB-2011', area: 'emergencias', tit: 'Señales y avisos para protección civil: colores, formas y símbolos a utilizar', dof: '2011-12-23', vigor: '2012-03-22', slug: 'nom-003-segob-2011', dep: 'SEGOB',
      que: 'Unifica las señales de protección civil: rutas de evacuación, salidas de emergencia, punto de reunión, equipo contra incendio y zonas de riesgo.',
      patron: ['Señalizar rutas de evacuación, salidas, punto de reunión y equipo de emergencia en inmuebles públicos y privados.'],
      trab: ['Conocer la ruta de evacuación y el punto de reunión.'],
      taller: ['Señaliza la ruta de evacuación del taller y el punto de reunión; revísalos en cada simulacro.'],
      rx: /simulacro|evacua/i,
      pr: [['¿Qué norma regula las señales de protección civil (ruta de evacuación, punto de reunión)?', ['NOM-003-SEGOB-2011', 'NOM-026-STPS-2008', 'NOM-002-STPS-2010', 'NOM-017-STPS-2024'], 'La NOM-026 es de seguridad e higiene en el trabajo; la de protección civil es la NOM-003-SEGOB.']] },
    { id: '001-STPS', clave: 'NOM-001-STPS-2008', area: 'emergencias', tit: 'Edificios, locales, instalaciones y áreas en los centros de trabajo: condiciones de seguridad', dof: '2008-11-24', slug: 'nom-001-stps-2008',
      que: 'Condiciones de seguridad de los inmuebles: pisos, escaleras, rampas, puertas, pasillos, orden y limpieza, y su verificación periódica.',
      patron: ['Mantener el inmueble en condiciones seguras y verificarlo periódicamente.', 'Orden y limpieza; pasillos y salidas libres.'],
      trab: ['Mantener su área ordenada y reportar condiciones inseguras.'],
      taller: ['Pasillos libres, sin cables sueltos ni aceite en el piso.', 'Al terminar, cada quien deja limpio su lugar (ya está en tu reglamento).'],
      rx: /taller/i,
      pr: [['¿Qué regula la NOM-001-STPS-2008?', ['Condiciones de seguridad de edificios, locales, instalaciones y áreas', 'El equipo de protección personal', 'Los extintores', 'La iluminación'], 'Pisos, escaleras, puertas, pasillos, orden y limpieza.']] },
    { id: '009-STPS', clave: 'NOM-009-STPS-2011', area: 'proteccion', tit: 'Condiciones de seguridad para realizar trabajos en altura', dof: '2011-05-06', slug: 'nom-009-stps-2011',
      que: 'Aplica a trabajos a más de 1.80 m sobre el nivel de referencia: sistemas de protección contra caídas, andamios, escaleras, plataformas y capacitación.',
      patron: ['Análisis de riesgos y procedimientos para trabajos en altura.', 'Sistemas de protección personal contra caídas (arnés, línea de vida) revisados.', 'Autorización por escrito y capacitación.'],
      trab: ['Usar el sistema contra caídas y revisar el equipo antes de usarlo.'],
      taller: ['En la escuela no se trabaja en altura; para alcanzar algo alto se usa escalera en buen estado y con apoyo de otra persona.'],
      rx: /altura|escalera/i,
      pr: [['¿A partir de qué altura es «trabajo en altura» según la NOM-009-STPS-2011?', ['A más de 1.80 m', 'A más de 3 m', 'A más de 1 m', 'Solo en azoteas'], 'Sobre el piso o nivel de referencia.']] },
    { id: '027-STPS', clave: 'NOM-027-STPS-2008', area: 'proteccion', tit: 'Actividades de soldadura y corte: condiciones de seguridad e higiene', dof: '2008-11-07', slug: 'nom-027-stps-2008',
      que: 'Condiciones para soldar y cortar sin incendios, quemaduras ni intoxicación por humos: análisis de riesgos, procedimientos, ventilación, EPP y autorización en áreas peligrosas.',
      patron: ['Análisis de riesgos y procedimientos de soldadura y corte.', 'Ventilación o extracción de humos; áreas libres de materiales inflamables.', 'EPP: careta o lentes con filtro adecuado, guantes y ropa de protección.', 'Autorización para soldar en áreas peligrosas (espacios confinados, recipientes con inflamables).'],
      trab: ['Usar el EPP y seguir los procedimientos y permisos.'],
      taller: ['El cautín (soldadura blanda) siempre en su soporte; ventilación por el humo del flux; nada de soplar ni sacudir la soldadura.', 'Lejos del área de solventes y del cloruro férrico.'],
      rx: /sold|caut[ií]n|esta[nñ]o/i,
      pr: [['¿Qué condición del área pide la norma para soldar?', ['Libre de materiales inflamables y con ventilación', 'Cerrada para que no entre aire', 'Con piso mojado', 'Junto a los solventes'], 'Las chispas y los humos son los riesgos principales.'],
        ['¿Qué riesgo de salud principal trae el humo de soldadura y del flux?', ['Intoxicación o irritación por inhalación', 'Ruido', 'Vibración', 'Radiación ionizante'], 'Por eso la ventilación o extracción local.']] },
    { id: '033-STPS', clave: 'NOM-033-STPS-2015', area: 'proteccion', tit: 'Condiciones de seguridad para realizar trabajos en espacios confinados', dof: '2015-08-31', slug: 'nom-033-stps-2015',
      que: 'Lugares con entrada y salida limitadas y ventilación deficiente (tanques, fosas, ductos): permiso de trabajo, monitoreo de la atmósfera, vigía y rescate.',
      patron: ['Identificar los espacios confinados y su riesgo.', 'Autorización por escrito para entrar; monitoreo de oxígeno, inflamables y tóxicos.', 'Vigía afuera y plan de rescate; capacitación.'],
      trab: ['No entrar sin autorización ni monitoreo; seguir al vigía.'],
      taller: ['Tema del Módulo V (mantenimiento): en la escuela solo se estudia, no se practica.'],
      rx: /confinad/i,
      pr: [['¿Qué es un espacio confinado?', ['Un lugar con entrada y salida limitadas y ventilación deficiente', 'Cualquier cuarto cerrado con llave', 'Un taller sin ventanas grandes', 'Una oficina pequeña'], 'Además, no está hecho para que alguien trabaje ahí de forma continua.'],
        ['¿Qué se mide antes de entrar a un espacio confinado?', ['Oxígeno, gases inflamables y tóxicos', 'Solo la temperatura', 'El ruido', 'La humedad'], 'Atmósfera peligrosa = principal causa de muerte en estos espacios.']] },
    { id: '019-STPS', clave: 'NOM-019-STPS-2011', area: 'organizacion', tit: 'Constitución, integración, organización y funcionamiento de las comisiones de seguridad e higiene', dof: '2011-04-13', slug: 'nom-019-stps-2011',
      que: 'Cada centro de trabajo integra una comisión de seguridad e higiene (representantes del patrón y de los trabajadores) que hace recorridos de verificación y propone medidas.',
      patron: ['Constituir la comisión e integrarla con representantes de ambas partes.', 'Dar facilidades para sus recorridos de verificación y atender sus recomendaciones.'],
      trab: ['Participar en la comisión cuando se le designe y reportar condiciones inseguras.'],
      taller: ['Tu bitácora de incidentes y casi-accidentes (Seguridad) es buena evidencia para la comisión de tu plantel.'],
      rx: /^$/,
      pr: [['¿Quiénes integran la comisión de seguridad e higiene?', ['Representantes del patrón y de los trabajadores', 'Solo el patrón', 'Solo el sindicato', 'Inspectores de la STPS'], 'Es una comisión mixta.']] },
    { id: '030-STPS', clave: 'NOM-030-STPS-2009', area: 'organizacion', tit: 'Servicios preventivos de seguridad y salud en el trabajo: funciones y actividades', dof: '2009-12-22', slug: 'nom-030-stps-2009',
      que: 'Pide designar a un responsable de seguridad y salud, hacer un diagnóstico y llevar un programa (o relación de acciones) preventivas.',
      patron: ['Designar a un responsable de los servicios preventivos.', 'Diagnóstico de seguridad y salud en el trabajo y programa de acciones.'],
      trab: ['Colaborar con el diagnóstico y las acciones.'],
      taller: ['Diagnóstico → programa → seguimiento: lo mismo que haces con tu inventario, revisiones e incidentes.'],
      rx: /^$/,
      pr: [['¿Qué es lo primero que pide la NOM-030-STPS-2009 después de designar al responsable?', ['Un diagnóstico de seguridad y salud en el trabajo', 'Comprar EPP', 'Contratar un médico', 'Un simulacro'], 'Con el diagnóstico se arma el programa de acciones.']] },
    { id: '035-STPS', clave: 'NOM-035-STPS-2018', area: 'organizacion', tit: 'Factores de riesgo psicosocial en el trabajo: identificación, análisis y prevención', dof: '2018-10-23', slug: 'nom-035-stps-2018',
      que: 'Identificar y prevenir factores de riesgo psicosocial (cargas excesivas, jornadas, violencia laboral) y promover un entorno organizacional favorable. Lo que se exige crece según el número de trabajadores (hasta 15, de 16 a 50 y más de 50).',
      patron: ['Política de prevención de riesgos psicosociales y de la violencia laboral.', 'Identificar a quienes vivieron acontecimientos traumáticos severos y canalizarlos.', 'Con más de 15 trabajadores: identificar y analizar factores de riesgo psicosocial; con más de 50, también evaluar el entorno organizacional.'],
      trab: ['Participar en la identificación y en las medidas; reportar prácticas contrarias al entorno favorable.'],
      taller: ['Te toca como trabajador del plantel. Con los alumnos, tus rutinas de relación y la encuesta del mes apuntan en el mismo sentido.'],
      rx: /^$/,
      pr: [['¿Qué factores atiende la NOM-035-STPS-2018?', ['Riesgo psicosocial: cargas, jornadas, violencia laboral', 'Ruido y vibración', 'Iluminación', 'Sustancias químicas'], 'Y promueve un entorno organizacional favorable.'],
        ['¿Cómo cambian las obligaciones según el tamaño del centro de trabajo?', ['Crecen en tres rangos: hasta 15, de 16 a 50 y más de 50 trabajadores', 'Son iguales para todos', 'Solo aplica a más de 100 trabajadores', 'Solo aplica al gobierno'], 'Con pocos trabajadores basta la política y la atención de acontecimientos traumáticos.']] },
    { id: '008-SE', clave: 'NOM-008-SE-2021', area: 'medicion', tit: 'Sistema General de Unidades de Medida', dof: '2023-12-29', vigor: '2024-06-28', antes: 'NOM-008-SCFI-2002', slug: 'nom-008-se-2021', dep: 'Secretaría de Economía',
      que: 'Establece el Sistema General de Unidades de Medida (basado en el Sistema Internacional) y las reglas para escribir unidades, símbolos y prefijos. Canceló la NOM-008-SCFI-2002 al entrar en vigor el 28 de junio de 2024.',
      patron: ['Usar las unidades del Sistema General en documentos, etiquetas y comercio.'],
      trab: [],
      taller: ['Símbolos sin punto ni plural y con espacio después del número: 5 km, 12 V, 25.4 mm.', 'Prefijos en minúscula hasta kilo (k); M, G, T en mayúscula: «kΩ», no «KΩ».', 'En los planos se escribe solo el número (80) y el cuadro de datos aclara «Medidas en mm».'],
      rx: /medic|unidad|vernier|plano|mult[ií]metro/i,
      pr: [['¿Qué norma sustituyó a la NOM-008-SCFI-2002?', ['NOM-008-SE-2021', 'NOM-008-SCFI-2024', 'NOM-001-SEDE-2012', 'NOM-026-STPS-2008'], 'Se publicó en el DOF el 29/12/2023 y entró en vigor el 28/06/2024.'],
        ['¿Cuál está bien escrita?', ['5 km', '5 Km.', '5 kms', '5km.'], 'Símbolo en minúscula, sin punto, sin plural y con espacio.'],
        ['¿Cómo se escribe el prefijo kilo?', ['k (minúscula)', 'K (mayúscula)', 'Kg siempre', 'Cualquiera'], 'Solo M, G, T y mayores van en mayúscula.']] }
  ];
  NR.byId = id => NR.LISTA.find(x => x.id === id);
  NR.byClave = c => NR.LISTA.find(x => x.clave === c);
  const KEST = 'normasEst';
  NR.est = () => { const d = S.get(KEST) || {}; return { q: d.q || {}, ver: d.ver || {}, notas: d.notas || {}, leidas: d.leidas || {}, ses: d.ses || [] }; };
  const upd = fn => S.update(KEST, d => { d.q = d.q || {}; d.ver = d.ver || {}; d.notas = d.notas || {}; d.leidas = d.leidas || {}; d.ses = d.ses || []; fn(d); }, {});
  const CAJA_DIAS = [0, 1, 3, 7, 14, 30];
  const qid = (n, i) => n.id + ':' + i;
  NR.preguntas = id => { const out = []; NR.LISTA.forEach(n => { if (id && n.id !== id) return; n.pr.forEach((p, i) => out.push({ n: n, i: i, id: qid(n, i), q: p[0], ops: p[1], ex: p[2] })); }); return out; };
  NR.pendientes = id => { const e = NR.est(), hoy = u.today(); return NR.preguntas(id).filter(p => { const s = e.q[p.id]; return !s || !s.sig || s.sig <= hoy; }); };
  NR.dominio = n => { const e = NR.est(), ps = NR.preguntas(n ? n.id : null); if (!ps.length) return 0; return ps.filter(p => (e.q[p.id] || {}).caja >= 3).length / ps.length; };
  NR.verificada = n => NR.est().ver[n.id] || VERIF;
  NR.porVerificar = () => { const hoy = u.today(); return NR.LISTA.filter(n => u.diffDays(NR.verificada(n), hoy) > 180); };
  // normas que aplican a la práctica de un día (para la tarjeta de seguridad)
  NR.delDia = items => { const txt = items.map(x => [x.it.t, x.it.tipo, x.it.mat, x.it.obj, x.b && x.b.lugar].join(' ')).join(' '); return NR.LISTA.filter(n => n.rx && n.rx.source !== '^$' && (n.id === '017-STPS' || n.rx.test(txt))).slice(0, 4); };
  const mapa = () => window.ESCUADRA_NORMAS_MAPA || { contenido: {}, programa: {} };
  const MODN = { I: 'Módulo I', II: 'Módulo II', III: 'Módulo III', IV: 'Módulo IV', V: 'Módulo V' };
  const chipEstado = n => '<span class="chip ok">Vigente</span>' + (n.antes ? ' <span class="chip info" title="Versión anterior">sustituyó a la ' + esc(n.antes.replace(/^NOM-\d+-\w+-/, '')) + '</span>' : '') + (n.proy ? ' <span class="chip warn">hay proyecto</span>' : '');

  /* ---------- pantallas ---------- */
  V.normas = (sub, id) => {
    if (sub === 'ficha') return fichaV(NR.byId(id));
    if (sub === 'repaso') return repasoV(id);
    const e = NR.est(), pend = NR.pendientes(), tot = NR.preguntas().length, dom = NR.preguntas().filter(p => (e.q[p.id] || {}).caja >= 3).length, porV = NR.porVerificar();
    const racha = e.ses.slice(-30).length;
    let h = card('<h3>📘 Normas oficiales para tu taller</h3><p class="small">Fichas de las ' + NR.LISTA.length + ' NOM que tocan a la carrera, cómo las cita el programa SEP y cuál está vigente, con enlace a su ficha oficial. Es para ti: las preguntas de repaso no se usan con los alumnos.</p>' +
      '<div class="en-kpis"><div><b>' + dom + '/' + tot + '</b><span>preguntas dominadas</span></div><div class="' + (pend.length ? 'warn' : 'ok') + '"><b>' + pend.length + '</b><span>para repasar hoy</span></div><div><b>' + racha + '</b><span>sesiones de repaso</span></div><div class="' + (porV.length ? 'warn' : 'ok') + '"><b>' + (NR.LISTA.length - porV.length) + '/' + NR.LISTA.length + '</b><span>vigencia revisada</span></div></div>' +
      '<div class="bar"><span style="width:' + Math.round(dom / Math.max(1, tot) * 100) + '%"></span></div>' +
      '<div class="row gap wrap mt">' + (pend.length ? link('🧠 Repasar ahora (' + Math.min(10, pend.length) + ')', 'normas/repaso', 'primary') : '<span class="chip ok">✓ Al día con el repaso</span>') + btn('🖨 Imprimir fichas', 'nr-print', '', 'small') + '<a class="btn small ghost" href="' + NR.DOF + '" target="_blank" rel="noopener">DOF</a></div>');
    if (porV.length) h += card('<p class="note warn small"><b>Revisa la vigencia</b> de ' + porV.length + (porV.length === 1 ? ' norma' : ' normas') + ': hace más de 6 meses que no la confirmas. Abre su ficha oficial (dice «Vigente» o «Cancelada») y toca «La revisé hoy».</p>');
    h += card('<details data-sec="nr-sep"><summary><b>📗 Cómo las cita el programa SEP</b></summary><p class="small">Nos guiamos por el programa. Cuando cita una versión que ya fue sustituida, la app enseña la vigente y lo dice:</p><ul class="small">' +
      NR.LISTA.filter(n => (mapa().programa[n.id] || []).length).map(n => { const p = mapa().programa[n.id]; const citas = Array.from(new Set(p.map(x => x.cita))); const igual = citas.length === 1 && citas[0] === n.clave; return '<li><b>' + p.map(x => MODN[x.m]).join(', ') + ':</b> ' + esc(citas.join(', ')) + (igual ? ' <span class="okc">· vigente</span>' : ' → hoy rige la <b>' + esc(n.clave) + '</b>') + '</li>'; }).join('') + '</ul></details>');
    Object.keys(NR.AREAS).forEach(ar => {
      const L = NR.LISTA.filter(n => n.area === ar); if (!L.length) return;
      h += card('<h3>' + NR.AREAS[ar] + '</h3><ul class="nr-l">' + L.map(n => { const d = NR.dominio(n), np = NR.pendientes(n.id).length; return '<li><a href="#/normas/ficha/' + n.id + '"><b>' + esc(n.clave) + '</b><span>' + esc(n.tit) + '</span><small class="muted">' + Math.round(d * 100) + '% dominada' + (np ? ' · ' + np + ' por repasar' : '') + (e.leidas[n.id] ? ' · leída ' + u.fCorta(e.leidas[n.id]) : '') + '</small></a></li>'; }).join('') + '</ul>');
    });
    h += '<p class="muted small">Vigencia verificada el ' + u.fFecha(VERIF) + ' en el Catálogo Mexicano de Normas (PLATIICA) y el DOF. Las NOM-STPS obligan a los centros de trabajo; con los alumnos funcionan como formación y buena práctica.</p>';
    return { t: 'Normas', h: h };
  };
  function fichaV(n) {
    if (!n) return { t: 'Normas', h: card('<p>No encontré esa norma.</p>' + link('‹ Normas', 'normas', 'small')) };
    const e = NR.est(), mp = mapa(), cont = mp.contenido[n.id] || [], prog = mp.programa[n.id] || [], np = NR.pendientes(n.id).length;
    const ls = (t, L) => L && L.length ? '<h4>' + t + '</h4><ul class="small">' + L.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '';
    const KND = { tema: '📖 Tema', clase: '🗓 Clase', pregunta: '❓ Pregunta del banco', idea: '💡 Idea', contenido: '• Contenido', industria: '🏭 Industria' };
    let h = card('<div class="row between gap wrap"><div><h3>' + esc(n.clave) + '</h3><p class="small">' + esc(n.tit) + '</p></div>' + link('‹ Normas', 'normas', 'small ghost') + '</div><p>' + chipEstado(n) + '</p>' +
      '<dl class="kv small"><dt>Publicada en el DOF</dt><dd>' + u.fFecha(n.dof) + '</dd>' + (n.vigor ? '<dt>En vigor</dt><dd>' + u.fFecha(n.vigor) + '</dd>' : '') + (n.antes ? '<dt>Sustituyó a</dt><dd>' + esc(n.antes) + '</dd>' : '') + '<dt>Dependencia</dt><dd>' + esc(n.dep || 'STPS') + '</dd><dt>Vigencia revisada</dt><dd>' + u.fCorta(NR.verificada(n)) + '</dd></dl>' +
      (n.proy ? '<p class="note warn small">' + esc(n.proy) + '</p>' : '') + (n.prog ? '<p class="note info small">' + esc(n.prog) + '</p>' : '') +
      '<div class="row gap wrap"><a class="btn primary small" href="' + PLAT(n.slug) + '" target="_blank" rel="noopener">📄 Ficha oficial y PDF</a>' + btn('✓ La revisé hoy', 'nr-ver', 'data-id="' + n.id + '"', 'small') + (np ? link('🧠 Repasar (' + np + ')', 'normas/repaso/' + n.id, 'small') : link('🧠 Repasar', 'normas/repaso/' + n.id, 'small ghost')) + '</div>');
    h += card('<h3>¿Qué regula?</h3><p>' + esc(n.que) + '</p>' + ls('Le toca al patrón (la escuela, en tu caso)', n.patron) + ls('Le toca al trabajador', n.trab) + ls('En tu taller', n.taller));
    h += card('<h3>📗 En el programa SEP</h3>' + (prog.length ? '<p class="small">' + prog.map(x => MODN[x.m] + ': <b>' + esc(x.cita) + '</b>').join(' · ') + (prog.some(x => x.cita !== n.clave) ? '<br>Hoy rige la <b>' + esc(n.clave) + '</b>; la app enseña la vigente y anota la del programa.' : '') + '</p>' : '<p class="small muted">El programa no la cita por nombre; aparece en el contenido de la app o es útil para tu formación.</p>') +
      '<h4>En el contenido de Escuadra</h4>' + (cont.length ? '<ul class="small">' + cont.map(x => '<li>' + (KND[x.k] || '•') + ' · ' + esc(x.t) + (x.m ? ' <span class="muted">(' + esc(x.m.replace(/^([IV]+)-(\d)$/, 'Módulo $1, sub. $2').replace(/^([IV]+)$/, 'Módulo $1')) + ')</span>' : '') + '</li>').join('') + '</ul>' : '<p class="small muted">No aparece todavía en temas, clases ni preguntas.</p>'));
    h += card('<h3>📝 Tus notas</h3><p class="muted small">Lo que subrayaste al releerla, dudas, artículos clave.</p><textarea class="inp" rows="4" data-ch="nr-nota" data-id="' + n.id + '" placeholder="Ej. 5.7: simulacros…">' + esc(e.notas[n.id] || '') + '</textarea>');
    return { t: n.clave, h: h, after: () => { if (!(E.solidez && E.solidez.ro()) && e.leidas[n.id] !== u.today()) setTimeout(() => { S.update(KEST, d => { d.leidas = d.leidas || {}; d.leidas[n.id] = u.today(); }, {}); }, 0); } };
  }
  // repaso: hasta 10 preguntas pendientes (o de una norma), una por una
  function repasoV(id) {
    const n = id ? NR.byId(id) : null;
    let st = E.ui.nr;
    if (!st || st.id !== (id || '') || st.done) {
      let ps = NR.pendientes(id); if (!ps.length && id) ps = NR.preguntas(id);
      ps = u.shuffle(ps).slice(0, 10);
      st = E.ui.nr = { id: id || '', ids: ps.map(p => p.id), i: 0, ok: 0, resp: null, ord: {}, done: false };
    }
    const ps = NR.preguntas(), cur = ps.find(p => p.id === st.ids[st.i]);
    if (!st.ids.length) return { t: 'Repaso', h: card('<h3>✓ Nada pendiente</h3><p>Ya repasaste todo lo que tocaba hoy. Vuelve mañana o repasa una norma desde su ficha.</p>' + link('‹ Normas', 'normas', 'small')) };
    if (!cur) { st.done = true; return { t: 'Repaso', h: card('<h3>🎉 Terminaste</h3><p>' + st.ok + ' de ' + st.ids.length + ' bien. Las que fallaste vuelven mañana; las que acertaste, en unos días.</p><div class="row gap wrap">' + link('‹ Normas', 'normas', 'primary small') + (n ? link('Ficha de ' + esc(n.clave), 'normas/ficha/' + n.id, 'small') : '') + '</div>') }; }
    if (!st.ord[cur.id]) st.ord[cur.id] = u.shuffle(cur.ops.map((x, i) => i));
    const ord = st.ord[cur.id], resp = st.resp;
    let h = card('<div class="row between gap"><span class="muted small">' + (st.i + 1) + ' de ' + st.ids.length + ' · ' + esc(cur.n.clave) + '</span>' + link('Salir', 'normas', 'small ghost') + '</div><div class="bar"><span style="width:' + Math.round(st.i / st.ids.length * 100) + '%"></span></div>' +
      '<h3 class="mt">' + esc(cur.q) + '</h3><div class="nr-ops">' + ord.map(k => { const cls = resp == null ? '' : k === 0 ? ' ok on' : k === resp ? ' bad on' : ''; return btn(esc(cur.ops[k]), 'nr-resp', 'data-k="' + k + '"' + (resp != null ? ' disabled' : ''), 'nr-op' + cls); }).join('') + '</div>' +
      (resp != null ? '<p class="note ' + (resp === 0 ? 'ok' : 'bad') + ' small"><b>' + (resp === 0 ? '✓ Bien.' : '✗ Era: ' + esc(cur.ops[0]) + '.') + '</b> ' + esc(cur.ex) + '</p><div class="row gap wrap">' + btn('Siguiente ›', 'nr-sig', '', 'primary') + link('Ver ficha', 'normas/ficha/' + cur.n.id, 'small ghost') + '</div>' : ''));
    return { t: 'Repaso de normas', h: h };
  }
  A['nr-resp'] = el => {
    const st = E.ui.nr; if (!st || st.resp != null) return; const k = Number(el.dataset.k), id = st.ids[st.i]; st.resp = k; if (k === 0) st.ok++;
    S.update(KEST, d => { d.q = d.q || {}; const s = d.q[id] = d.q[id] || { caja: 0 }; s.caja = k === 0 ? Math.min(5, (s.caja || 0) + 1) : 1; s.sig = u.addDays(u.today(), CAJA_DIAS[s.caja]); s.ult = u.today(); s.n = (s.n || 0) + 1; }, {});
  };
  A['nr-sig'] = () => { const st = E.ui.nr; if (!st) return; st.i++; st.resp = null; if (st.i >= st.ids.length) S.update(KEST, d => { d.ses = (d.ses || []).concat([{ f: u.today(), n: st.ids.length, ok: st.ok }]).slice(-200); }, {}); else E.render(); };
  A['nr-ver'] = el => { upd(d => { d.ver[el.dataset.id] = u.today(); }); u.toast('Vigencia revisada hoy', 'ok'); };
  CH['nr-nota'] = el => upd(d => { d.notas[el.dataset.id] = el.value; });
  A['nr-print'] = () => {
    const ls = L => L && L.length ? '<ul>' + L.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '';
    E.print.run('<div class="pr"><div class="p-title">NORMAS OFICIALES PARA EL TALLER DE MECATRÓNICA</div><p class="tiny c">Vigencia revisada el ' + u.fFecha(VERIF) + ' · Fichas oficiales en platiica.economia.gob.mx</p>' +
      NR.LISTA.map(n => '<div class="nr-pf"><h4>' + esc(n.clave) + ' · ' + esc(n.tit) + '</h4><p class="tiny">DOF ' + u.fDM(n.dof) + '/' + n.dof.slice(0, 4) + (n.antes ? ' · sustituyó a la ' + esc(n.antes) : '') + (n.proy ? ' · ' + esc(n.proy) : '') + '</p><p>' + esc(n.que) + '</p><b>En el taller:</b>' + ls(n.taller) + '</div>').join('') + '</div>', { title: 'Normas oficiales', margin: '12mm' });
  };

  /* ---------- en la práctica del día: qué normas aplican ---------- */
  if (E.seguridad && E.seguridad.antesHTML) {
    const ah = E.seguridad.antesHTML;
    E.seguridad.antesHTML = function (g, f) {
      const h = ah.apply(null, arguments); if (!h) return h;
      const L = NR.delDia(E.seguridad.riesgoDia(g, f)); if (!L.length) return h;
      const x = '<div class="nr-dia"><b>📘 Normas que aplican:</b> ' + L.map(n => '<a href="#/normas/ficha/' + n.id + '">' + esc(n.clave.replace(/-\d{4}$/, '')) + '</a>').join(' · ') + '<ul class="small">' + L.slice(0, 2).map(n => '<li>' + esc(n.taller[0]) + '</li>').join('') + '</ul></div>';
      const i = h.lastIndexOf('</section>'); return i >= 0 ? h.slice(0, i) + x + h.slice(i) : h + x;
    };
  }
})();
