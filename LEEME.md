# Escuadra · Control docente (v1.25.0)

App web instalable (PWA) para tus clases de Mecatrónica en el CETAC 19: pase de lista y participación,
calificaciones con tu esquema (Examen 50 · Libreta/Proyecto/Bitácora 40 · Asistencia 5 · Participación 5),
acta con las mismas columnas que la de la escuela, impresión de listas, lista de cotejo y rúbrica,
planeaciones en el formato SEMS con revisión automática y exportación a Word, banco de ideas,
herramientas de clase (alumno al azar, equipos, temporizador), bitácora y lista de mejoras.

**Nuevo en v1.1:** sección **Temas** con 26 explicaciones del Módulo II (nivelación del Submódulo 1, mecanismos,
neumática e hidráulica y formación integral) y **modo Proyector**: diapositivas a pantalla completa generadas solas,
con preguntas que revelan la respuesta y alumno al azar. Además, 24 ideas nuevas para clase con proyector.

**Nuevo en v1.25 · cambio de semestre, seguridad y lo que tus alumnos se llevan:**
- **Cambio de semestre** (Mis grupos → Pasar al siguiente semestre): archiva cada grupo con sus fechas y crea el nuevo con los mismos
  alumnos y números de lista, el módulo que sigue, sus submódulos y el horario; pones las fechas de los parciales nuevos.
- **El guion aprende** (Clases → aviso, o Más): compara lo planeado con lo que pasó y guarda ajustes de horas por actividad que se
  aplican a los grupos que empiecen después (nunca al grupo en curso).
- **Seguridad en el taller** (Más → Seguridad): reglamento editable con hoja de firmas (alumno y casa), revisión antes de cada práctica
  con herramienta o corriente (en el guion y en «Hoy»), aviso de quién no ha firmado y bitácora de incidentes con reporte.
- **Portafolio y constancias** (ficha del alumno, Imprimir y Más → Constancias): portafolio para prácticas o empleo con lo que sabe hacer,
  FreeCAD, proyectos, logros y fotos de trabajos; constancias de logro con folio (reconocimiento del docente).
- **Inventario** (Más → Inventario): artículos, préstamos, lo que piden tus guiones en 3 semanas y lista de compras.
- **Vista para la co-tutora** (Tutoría): enlace cifrado con PIN (`tutora.html`, AES-GCM), solo lectura, sin servidor.
- **Encuesta anónima del mes** (Más → Encuesta): por QR (`encuesta.html`; corre una vez `schema-encuesta.sql` en Supabase) o en papel,
  con «Ustedes dijeron → Yo hice» para proyectar.

**Nuevo en v1.24 · menos tiempo en la app, clases que rinden más y resultados que llegan antes a casa:**
- **Ayuda y manual** (botón **?** arriba): abre el manual en la sección de la pantalla donde estás, con buscador y capturas; también
  en PDF (`ayuda/manual-escuadra.pdf`). Sube la carpeta `ayuda` junto con los demás archivos.
- **Inicio compacto «Hoy»:** arriba solo tu clase (con Pasar lista, Guion o Cierre según la hora), lo más urgente y a quién atender hoy
  (rota cada día entre los que van mal); lo demás queda plegado en «Ver todo lo demás». Se cambia en Ajustes → Novedades.
- **Cerrar semana** (Inicio, Cierre del día o Más): cierra de un jalón los días sin cerrar; por omisión, como se planeó y, si no pasaste
  lista, todos presentes (desmarcas los días en que alguien faltó).
- **Actividades del guion solas:** las evidencias que marca el guion se crean como actividades de Libreta/Proyecto/Bitácora con su
  rúbrica sugerida y siguen la fecha de la clase si la mueves. No cuentan (ni bajan a nadie) hasta que les pones la primera calificación.
  Se apaga en Ajustes → Novedades; Calificaciones tiene «Crear actividades del guion».
- **Datos en IndexedDB:** sin el límite de ~5 MB de localStorage y sin trabar la pantalla al guardar. La primera vez se pasan solos;
  si el navegador no tiene IndexedDB, sigue con localStorage. Ajustes → Novedades dice cuánto espacio usas.
- **Del boleto al calentamiento:** si una pregunta del boleto de salida sale abajo de 60 %, su tema abre el calentamiento siguiente.
- **Monitores rotativos** en el guion de cómputo: cada monitor apoya a 1 o 2 compañeros que van mal o aún no completan una práctica;
  rotan (primero quienes menos veces han sido monitores, sin repetir pareja). «Usar estas parejas» guarda el registro en la ficha.
- **Tablero de entregas** (Más → Entregas): qué pedir hoy y la próxima clase (con mensaje para el grupo), resumen, tablero por
  entregable (próximas · por revisar · les falta · completas) y matriz de quién entregó qué; tiras «lo que me debes» y lista sin nombres.
- **Comunicar a casa** (ficha del alumno, Para aprobar e Imprimir): **consulta con QR** (`consulta.html`, sin nombre: número de lista e
  iniciales; los datos viajan en el enlace después del #, no se guardan en ningún servidor), **WhatsApp a casa** con lo que debe, cuánto
  sube, la fecha límite y el enlace (teléfono opcional en la ficha) y **repaso para casa** (`repaso.html`, 5 preguntas de sus temas débiles).
- **Pre-cierre de captura** (Inicio desde 7 días antes, Calificaciones y Más): días sin lista, actividades vacías, examen, libreta,
  FreeCAD, participación y alumnos sin calificación, con su enlace; luego copias o descargas el acta.

**Nuevo en v1.23 · Reporte para el consejo técnico** (Más → Consejo técnico):
- **Uno por grupo**, con lo que pasó desde la sesión anterior: indicadores (asistencia, promedio, aprobando, avance, entregas
  y alumnos que requieren atención), **avance del programa** (horas dadas, actividades clave, temas y clases perdidas),
  **aprovechamiento** (por parcial, semáforo y temas débiles de los exámenes), **asistencia por semana**, entregas (trabajos,
  libreta, FreeCAD y proyecto), **alumnos que requieren atención** con las señales de alerta temprana de *Yo no abandono*
  (A asistencia · B rendimiento · C conducta) y lo que propones para cada uno, **logros**, **estrategias que aplicaste**,
  **propuestas** que salen solas de tus datos, espacio para **acuerdos, compromisos y apoyos** que solicitas, y **próximas fechas**.
- **Imprimir** (un grupo o todos, uno por hoja, con encabezado de la escuela y firma) o **proyectar** (con opción de mostrar
  solo el número de lista).
- La sesión es el **último viernes de cada mes**; si tu plantel la cambia, cambias la fecha ahí mismo. La semana del consejo
  aparece un aviso en Inicio.
- Solo datos escolares: no lleva las notas de tutoría ni datos personales.

**Nuevo en v1.22 · Submódulo 1 del Módulo II («Dibuja planos de elementos mecánicos», 3er semestre, 1er parcial):**
- 55 h de clases con dos caminos a la vez: **dibujo técnico a mano** en el aula (formato y cuadro de datos, unidades y pulgadas,
  alfabeto de líneas, trazos geométricos, escalas, isométrico, vistas en primer y tercer diedro, acotación y cortes) y **FreeCAD**
  los días de centro de cómputo (croquis con restricciones, Pad, Pocket, Revolution, Thickness y plano en TechDraw).
- 13 temas nuevos para proyectar con figuras animadas (más los 2 que ya había), 78 preguntas de examen con problemas que cambian
  (conversiones, escalas, formato, cotas en cadena y en paralelo, masa de una pieza), 7 láminas con su hoja para imprimir,
  12 tareas para casa y 12 ideas.
- Proyecto **«Del objeto al plano»**: croquis acotado de una pieza real, plano a mano (actividad clave), modelo y plano en
  FreeCAD (actividad clave) y expediente; PAEC: catálogo de planos de piezas de repuesto para el mantenimiento del plantel.
- **Prácticas de FreeCAD**: dos nuevas (bloque escalonado del isométrico al modelo, y caja con paredes de 2 mm con Thickness);
  la placa, el eslabón, la escuadra, la polea y el plano en TechDraw ya aparecen en las clases del 1er parcial. Ahora son 17.
- El examen del 1er parcial queda entero en un bloque de 2 h, con retroalimentación y cierre después.
- Si empezaste con un grupo después de un parcial (como el 3°A, en octubre), Clases muestra ese parcial como referencia, sin
  avisos de horas que faltan.
- Con esto ya está el contenido de los 5 módulos de la carrera.

**Nuevo en v1.21 · Módulo IV completo (5º semestre, «Opera sistemas flexibles de manufactura de piezas mecánicas», de corrido):**
- Clases hora por hora de los 2 submódulos (80 h de máquinas-herramienta y CNC y 76 h de robótica) con tareas, evidencias,
  **hojas de práctica para imprimir**, temas para proyectar con figuras animadas, banco de examen (144 preguntas, con problemas que
  cambian en cada versión: rpm y avance, tiempo de corte, coordenadas absolutas e incrementales, kerf, tolerancias, cinemática,
  paletizado, fuerza de agarre, par del servo y piezas por hora) e ideas.
- **Dos proyectos que se encadenan**:
  1. *Piezas por CNC*: plano y hoja de proceso, programa G escrito a mano, simulación en NC Viewer y CAMotics, diseño en FreeCAD
     y corte de prueba en tu cortadora láser (es una máquina CNC de 2 ejes), inspección con vernier y expediente de manufactura.
     Las piezas que salen son las del brazo robótico.
  2. *Brazo robótico*: brazo de 4 servos con Arduino que toma, deja y paletiza: cinemática, movimiento suave, programa por
     enseñanza con potenciómetros, robots industriales en simulador (Webots o CoppeliaSim Edu), celda con sensor e interbloqueo,
     validación con bitácora y feria.
- **Sin máquinas CNC ni robot industrial**: se programa a mano, se simula y se comprueba con lo que tienes (cortadora láser,
  Arduino, servos y el centro de cómputo).
- **Seguridad**: la cortadora láser la operas solo tú (nunca PVC ni vinil); el brazo trabaja a 5 V con paro de emergencia y el lado
  de 127 V de la fuente lo conectas tú.
- **Tareas para casa**: 17 en el Módulo IV y 14 nuevas en el Módulo V (ejercicios, croquis, programas a mano, entrevistas y
  observación de aparatos de casa); salen en Más → Tareas y libreta.
- Submódulo 1 del Módulo II: listo en v1.22.

**Nuevo en v1.20 · Módulo V completo (6º semestre, «Opera sistemas mecatrónicos», de corrido):**
- Clases hora por hora de los 2 submódulos (80 h de automatización y 76 h de mantenimiento) con tareas, evidencias, **hojas de
  práctica para imprimir**, temas para proyectar con figuras animadas, banco de examen (144 preguntas, con problemas que cambian en
  cada versión) e ideas.
- **Dos proyectos que se encadenan**:
  1. *Automatiza*: estación automatizada de clasificación de tapas (banda de MDF cortada en tu cortadora láser, sensores IR,
     inductivo y de color, servos, motor a pasos, empujador hidráulico de jeringas, modos manual y automático, alarmas, paro de
     emergencia y documentación «como quedó»).
  2. *Mantiene*: programa de mantenimiento del taller con su estación como primer equipo: bloqueo y etiquetado, 5S, lubricación,
     rodamientos y bandas, órdenes de trabajo, preventivo, correctivo (causa raíz y actualización del programa de la tarjeta) y
     predictivo con el celular (phyphox), termómetro infrarrojo y un monitor con Arduino; MTBF, MTTR, disponibilidad y OEE.
- **Examen automático en los módulos de corrido**: Clases aparta el último bloque de 2 h (fuera del centro de cómputo) de cada
  parcial para el examen, aunque el submódulo siga en el siguiente parcial.
- **De corrido, sin pérdidas**: lo que no alcanza en un parcial sigue completo en el siguiente, aunque sea de un submódulo anterior.
  Clases muestra solo las horas y submódulos que caen en ese parcial, y las prácticas que necesitan algo del centro de cómputo
  (no se arma sin las piezas diseñadas, no se pone en marcha sin el programa) esperan a que se dé, con un aviso.
- **Seguridad**: todo a 12 V; el lado de 127 V lo conectas y pruebas solo tú. Nada de trabajos en altura ni en espacios confinados:
  esas NOM se estudian para el trabajo real.
- Módulo IV: listo en v1.21.

**Nuevo en v1.19 · Módulo III completo (4º semestre, «Programa dispositivos de control»):**
- Clases hora por hora de los 3 submódulos con tareas, evidencias, **hojas de práctica para imprimir**, temas para proyectar con
  figuras animadas, banco de examen (214 preguntas, con problemas que cambian en cada versión) e ideas.
- **Tres proyectos que se encadenan sobre el mismo tablero de 12 V**:
  1. *Potencia y control*: tablero didáctico con relevadores de 12 V, botones de 22 mm y panel cortado en tu cortadora láser:
     arranque-paro, inversión de giro con enclavamiento, finales de carrera, sensor de 3 hilos y localización de fallas.
  2. *PLC*: el mismo tablero lo controla un Arduino Uno que funciona como PLC con OpenPLC (escalera, temporizadores, contadores,
     GRAFCET y señal analógica): estación de conteo con apagado automático para ahorrar energía.
  3. *Sistemas embebidos*: riego automático programado en C++ (sensor de humedad, MOSFET, máquina de estados, nivel del depósito,
     consumo de agua y energía; nexo agua-energía-alimento) y feria de automatización del semestre.
- **Seguridad**: todo se arma a 12 V de CD; el lado de 127 V de la fuente lo conectas solo tú. Bloqueo y etiquetado desde la
  primera clase.
- **Simuladores gratuitos**: CADe_SIMU (Windows, para tableros de 127/220 V sin riesgo), OpenPLC Editor, Wokwi, Tinkercad e Inkscape.
- Módulo V: listo en v1.20.

**Nuevo en v1.18 · Contenido por módulo (el grupo que te toque jala su contenido):**
- **Programa SEP 2024 completo de los 5 módulos** (tomado de tu PDF, pp. 13-118): actividades clave con su página, desarrollo de la
  competencia, producto o desempeño con su instrumento, criterios para listas de cotejo y rúbricas, y los elementos transversales que el
  programa marca con X. Con eso, cualquier grupo tiene **actividades sugeridas** (Calificaciones), **listas de cotejo y rúbricas** para
  imprimir y una **planeación** que se llena sola: transversales del programa, recursos, PAEC y apertura/desarrollo/cierre con sus clases.
- **Módulo I completo (2º semestre)**: clases hora por hora de los 3 submódulos (mediciones y diagramas; circuitos analógicos y PCB;
  circuitos digitales) con tareas, evidencias y **hojas de práctica para imprimir** (Tinkercad Circuits, Falstad, KiCad y CircuitVerse,
  gratuitos), temas para proyectar con figuras animadas, banco de examen con problemas que cambian en cada versión, ideas y 3 proyectos:
  expediente técnico de un aparato, luz intermitente con 555 en su propia placa y contador de piezas 0-9 con display.
- **De corrido** (Ajustes → Grupo y horario): en los módulos de 2 submódulos (IV y V) lo que no alcance en un parcial sigue en el
  siguiente y al terminar un submódulo empieza el otro. Se marca solo al elegir esos módulos.
- **Temas e Ideas** muestran los del módulo de tu grupo (con un selector para ver otro módulo).
- El contenido de cada módulo solo se carga si tienes un grupo de ese módulo: la app abre igual de rápido.
- Módulo III: listo en v1.19.

**Nuevo en v1.17 · Mis grupos (Más → Mis grupos, o Ajustes → Grupo y horario → «Mis grupos»):**
- **Agregar grupo**: grupo (ej. 5B), semestre, carrera, nombre corto, módulo, submódulo de cada parcial y su **horario** (día, hora
  de inicio y fin, horas —se calculan solas con módulos de 50 min— y si es aula, centro de cómputo o taller). Avisa si choca con
  el horario de otro grupo. Al crearlo te lleva a importar su lista (Excel de la escuela o pegando nombres).
- Cada grupo tiene **por separado** su lista, asistencias, participación, calificaciones, acta, libreta, exámenes, mapa del salón,
  evidencias y formularios. Las fechas de los parciales y asuetos, las ponderaciones y lo que vale lo entregado tarde son las mismas
  para todos (Ajustes).
- **Cambiar de grupo**: el botón debajo del título (aparece cuando tienes 2 o más grupos) o el de Inicio. Cada aparato recuerda el
  suyo. **Al abrir desde el ícono** entra solo al grupo que tiene clase en ese momento (o al que le falta su cierre del día).
- **Inicio → «Tus grupos hoy»**: las clases del día de todos tus grupos en orden, si ya pasaste lista y sus pendientes. El contador
  de **Pendientes** suma todos tus grupos y su pantalla te muestra los de tus otros grupos.
- **Fin de semestre → Archivar**: el grupo deja de salir para cambiar y en pendientes, y guarda sus fechas de parciales para que su
  historial no cambie cuando pongas las del semestre nuevo. Lo puedes ver, reactivar o **borrar con todo** (escribiendo su grupo).
- Clases, Temas, Banco de preguntas y Examen recomendado traen el contenido del módulo de cada grupo (ver v1.18).

**Nuevo en v1.16.1 · entregas tarde «sobre 75»:** cuando un alumno te entregue tarde, márcalo con **⏰** (en la actividad, en
cada tarea de la libreta con el botón «⏰ Tarde» o la tecla T, en las prácticas de FreeCAD, al escanear su QR con «Son entregas
tarde», o con **«📥 Recibir»** en «¿Qué le falta para aprobar?» de su ficha). Su calificación se multiplica por lo que vale lo
tardío: **75 %** por omisión (perfecto → 75; un 80 → 60). Lo cambias en **Ajustes → Calificación** (100, 90, 80, 75, 70, 60 o 50 %);
lo que ya marcaste conserva el porcentaje con el que lo recibiste. Si el retraso está justificado, desmarca «Entregado tarde» al recibir.

**Nuevo en v1.16 (con la cámara · Más → Cámara):**
- **Libretas con QR**: imprimes una etiqueta por alumno (el QR solo trae un número interno de Escuadra, nunca el nombre) y la pegas
  en la portada de su libreta. Al revisar, escaneas y queda ✓ la tarea; con un toque la cambias a ½ o ✗. El mismo escaneo sirve para
  pasar lista («Terminar: los demás faltan»), sumar participación, revisar una práctica de FreeCAD o abrir su ficha. Suena y vibra con
  cada lectura y se deshace con «↶ Deshacer».
- **Tarjetas de respuesta** (como Plickers): imprimes las tarjetas (2 por hoja, sin nombre: cada alumno usa la de su número de lista).
  Para contestar giran la tarjeta para que su letra (A, B, C o D) quede arriba y la levantan; tú escaneas el salón y ves cuántos
  contestaron cada letra, cuántos acertaron y quiénes faltan. Desde **Herramientas** (pregunta rápida, con +1 participación a quien
  acierte) y con el botón **🃏 Con tarjetas** del calentamiento y del boleto de salida del guion (guarda los aciertos solo).
  En pruebas con imágenes simuladas, una tarjeta de 12.5 cm se lee bien desde unos 4 a 5 m con buena luz.
- **Hojas de respuestas que se califican con la cámara** (Examen → Capturar resultados → 📷 Con foto): imprimes la hoja de burbujas de
  tu examen (una por alumno con su número ya relleno, o en blanco para fotocopiar). La escaneas con la hoja quieta sobre la mesa y se
  lee sola: número de lista, versión A o B y cada respuesta, calificada con la clave de su versión. Ves en verde lo bien, en rojo lo mal
  (con la correcta) y en amarillo lo que hay que revisar (dos marcas o muy tenue); corriges con un toque y guardas: la calificación llega
  a la actividad del examen. Las abiertas se califican «Por alumno» y no se borran al volver a escanear. También puedes subir fotos.
- **Evidencias de trabajos**: fotos de libretas, planos, prototipos y maquetas, **nunca de caras** (primero confirmas que no sale
  ningún alumno). Se ligan a la actividad y a los alumnos (en equipo, a todos), se reducen a 1280 px y pierden los datos de la cámara
  (ubicación, modelo). Se guardan en el aparato y se respaldan en un **espacio privado** de tu Supabase (paso 2b). Las ves en la
  actividad, en la ficha de cada alumno y en Más → Evidencias.
- **Formularios** (Más → Formularios): guardas el enlace de tu Google Forms, proyectas su QR para que lo abran en el celular y luego pegas
  las respuestas (o subes el .csv): cuestionario (columna «Puntuación»), autoevaluación o coevaluación (promedio de lo que le pusieron
  sus compañeros, sin contar su propia evaluación). La calificación cae en la actividad que elijas; las respuestas no se guardan.
- Todo lo de la cámara se procesa en tu aparato; la imagen no sale de él (salvo las fotos de evidencias, a tu Supabase privado).

**Nuevo en v1.15 (captura rápida):**
- **↶ Deshacer** después de cada cambio (arriba, junto a la lupa; en la compu también Ctrl + Z): si te equivocas de alumno o de
  botón, regresa como estaba.
- **Buscar alumno**: la lupa de arriba (o la tecla /) busca por número de lista o parte del nombre y abre su ficha; desde ahí
  también +1 participación u observación. Las listas largas (pase de lista, calificaciones, cierre, revisión de prácticas y Alumnos)
  tienen su buscador: escribes «12», Enter y capturas; al terminar regresa solo al buscador.
- **Modo clase** (desde el ícono, Inicio, el pase de lista o el guion): nombres grandes; toca = +1 participación, mantén presionado =
  observación (⭐ 👎 y más). Con «Asistencia», cada toque cambia falta → retardo → justificada → asistió. Se acomoda como tu
  **mapa del salón** (uno para el aula y otro para el centro de cómputo; usa el del lugar del bloque) y lo puedes ver «desde el frente».
- **Pase de lista**: un toque marca falta (otro toque, asistió); mantener presionado (o clic derecho) da retardo o justificada.
  **Justificar faltas por fechas** desde la ficha del alumno (solo se guarda la fecha, nunca el motivo).
- **Abre en lo que toca**: desde el ícono, durante tu clase va al pase de lista (o al guion si ya pasaste lista) y al terminar, al
  cierre del día; se apaga en Ajustes → Captura rápida. **Accesos del ícono** (mantenlo presionado): Pasar lista, Modo clase y Cierre
  del día. **Barra de abajo**: eliges sus 4 botones.
- **Calificaciones**: salta solo al siguiente alumno (85 salta; 10 espera por si es 100) y el Enter de costumbre no se salta a nadie;
  ↑ ↓ en la compu; «llenar vacíos» solo a quienes asistieron ese día; **pegar** una columna, «nombre calificación» (aunque tenga errores
  de dedo) o la puntuación de Google Forms (17 / 20), siempre con vista previa; **📷 con Claude**: copias instrucciones con tu lista, le
  mandas la foto y pegas lo que te responda; **por equipo** (los equipos de Proyecto); **rúbricas de un toque** E · B · S · I (cartel,
  plano, exposición, prototipo, bitácora y reporte; editables e imprimibles) o criterio por criterio; **dictado** en Chrome:
  «Pérez 85» o «número 12, 85» (usa el reconocimiento de voz de Google y necesita internet).
- **Tarjetas para deslizar** en libreta, prácticas de FreeCAD y cierre: → completa, ↑ incompleta, ← no la hizo (también con
  botones o con 1 · 2 · 3).
- **Pendientes de captura** (contador arriba, en Inicio y en Más): días sin cerrar, listas sin pasar, evidencias del guion,
  actividades vencidas sin calificar, exámenes sin capturar, tareas y prácticas sin revisar, calentamientos y boletos sin anotar y
  etapas del proyecto. Las **evidencias del guion** (cartel, plano, prototipo, defensa…) se vuelven actividad con su rúbrica sugerida
  en un toque, también desde el cierre del día. **«↪ Seguir capturando»** te regresa a la última actividad que dejaste a medias.
- **Atajos de teclado** en la compu (? para verlos) y nombres cortos correctos con nombres de 3 o 5 palabras.

**Nuevo en v1.14:** **Cierre del día** (Inicio te lo recuerda desde que termina tu última clase; también está en el guion del día
y en Más). En una sola pantalla: lista (o «todos presentes»), confirmas o ajustas lo que se hizo, revisas la tarea que tocaba
entregar (✓ ½ ✗, entra a la libreta), sumas participación y puntos extra, marcas ⭐ excelente o 👎 muy mal con motivo (solo escolar)
y dejas una nota que va a tu bitácora. Te muestra los días de la última semana sin cerrar y, si activaste notificaciones, te avisa al
abrir la app después de clase. Inicio te dice quién lleva 2 o más días «muy mal» en 2 semanas; los días ⭐ cuentan en los
reconocimientos y los dos aparecen en el pase de lista y en el perfil.

**Nuevo en v1.13:**
- **¿Qué le falta para aprobar?** (Más → Para aprobar y en la ficha de cada alumno): lo pendiente (actividades vencidas, tareas de
  libreta, prácticas de FreeCAD) y cuánto sube su calificación si lo entrega, con tus ponderaciones; si el examen aún no se aplica,
  cuánto necesita sacar. Eliges cuánto vale lo entregado tarde (100, 80 o 60 %). Hoja **«Mi plan para aprobar»** para dársela en privado.
- **Informe para padres** (ficha, Para aprobar o Imprimir → Junta con padres): calificación con desglose, asistencia y faltas,
  FreeCAD, fortalezas, lo que le falta, cómo apoyar en casa, tus comentarios y firma de enterado. Uno por página.
- **Retroalimentación rápida** (💬 al revisar libreta y prácticas, y en la ficha): frases de lo que hizo bien, qué mejorar y su
  siguiente paso; se guarda en su historial, se copia y las 2 más recientes salen en el informe para padres (puedes quitarlas).
- **Banco de preguntas propio** (Más → Banco de preguntas): agregas preguntas, pegas varias en un formato sencillo o copias las
  instrucciones para que Claude te las prepare. Entran solas a ejercicios, calentamiento, boleto de salida y examen recomendado.

**Nuevo en v1.12:**
- **Supabase conectado en `config.js`**: tus dispositivos se conectan solos; en cada uno solo inicias sesión (Ajustes → Sincronización).
  Inicio te recuerda descargar un respaldo: cada semana si tus datos solo están en el dispositivo, cada mes si ya sincronizan.
- **FreeCAD por alumno**: en cada práctica, «✅ Revisar por alumno» (✓ 100 · ½ 50 · ✗ 0; sin marca = pendiente). Entra sola a
  Libreta/Proyecto/Bitácora como «Prácticas de FreeCAD». Cada alumno tiene su **nivel FreeCAD** en su ficha y el guion del viernes
  sugiere el **acomodo** (quién va junto a un monitor y quién puede serlo).
- **Prepara tu clase de cómputo**: desde 2 días antes, Inicio te muestra las prácticas que tocan; las haces tú con cronómetro,
  anotas dónde te atoraste y te calcula cuánto tardará el grupo (2 a 3 veces tu tiempo). Tu nota sale en el guion del día.
- **Calentamiento** (5 min al inicio) y **boleto de salida** (al final) en el guion de cada clase, para proyectar. Anotas cuántos
  acertaron (mano alzada) y eso alimenta el examen recomendado y los **temas a reforzar** (en Semáforo y en Examen).
- **Proyecto por equipo** (Más → Proyecto): equipos equilibrados o al azar, etapas de la garra y de la grúa con fecha meta tomada
  de tu guion, semáforo por equipo y aviso en Inicio de los equipos atrasados.
- **Industria** (Más → Industria): «¿Dónde se usa en el Bajío?» en cada tema y en el proyector; planeador de visitas, charlas y
  demostraciones con lista de pendientes, autorización imprimible para padres y preguntas para el invitado.
- **Reconocimientos**: cada semana Inicio sugiere hasta 3 alumnos que mejoraron (asistencia, tareas, participación, prácticas o
  examen contra diagnóstico), con el motivo, para reconocer su esfuerzo.

**Nuevo en v1.11:** todo se proyecta, también los viernes en el centro de cómputo.
- **Proyectar la clase**: cada actividad del guion (Clases) tiene su botón; proyecta la meta de hoy, lo que harán con minutos,
  palabras clave, material, qué entregan y, si es de FreeCAD, la práctica completa con su plano y pasos.
- **Ejercicios para proyectar** (en la clase y en cada tema): las preguntas del banco del tema con opciones A–D; al revelar se
  marca la correcta y su explicación. Los problemas salen dos veces con números nuevos: «lo resolvemos juntos» y «ahora tú».
- **15 prácticas de FreeCAD** (Más → FreeCAD) en 3 niveles: placa, eslabón, leva, biela-manivela, escuadra, brida con patrón
  polar, polea, engranes, abrazadera y carrete de la grúa, plano en TechDraw, resorte, ensamble de cuatro barras, vista
  explosionada y cilindro neumático. Cada una trae plano acotado (sin internet), pasos con el nombre de la herramienta en
  inglés y español, qué revisar, errores comunes, reto y entrega. Se proyectan, se imprimen (hoja o cuadernillo) y se marcan
  como hechas. En los bloques de cómputo, el guion sugiere «si terminan antes» las que el grupo todavía no hace.
  Pensadas para FreeCAD 1.0 o más nuevo.

**Nuevo en v1.10:** sección **Dinámicas** (Más → Dinámicas). Eliges qué quieres lograr hoy (integrar al grupo,
desarrollar una capacidad, mejorar la relación contigo, que se sientan mejor consigo mismos o calmar al grupo), el tiempo,
el lugar y cómo está el grupo, y te recomienda dinámicas sin repetir las recientes. Son 27, cada una con guion paso a paso,
lo que ven los alumnos (se proyecta), preguntas de cierre y qué cuidar. Hay rutas de 4 sesiones para 8 capacidades
(comunicación, trabajo en equipo, empatía, autoconocimiento, manejo de emociones, liderazgo, perseverancia y creatividad,
alineadas a las habilidades de Construye T), rutinas para tu relación con ellos (saludo en la puerta, retroalimentación con
expectativas altas, 2 × 10, ustedes dijeron-yo hice), temporizador por paso, registro de cómo salió, **termómetro del grupo**
con tendencia y **bingo humano** imprimible.

**Nuevo en v1.9:**
- **Examen recomendado** (Más → Examen recomendado, o desde Calificaciones → Examen): toma los temas que diste en Clases hasta
  la fecha del examen y reparte las preguntas según las horas de cada tema; lo que salió bajo en exámenes anteriores lleva más
  peso y entra un repaso. Banco de 126 preguntas (opción múltiple, verdadero o falso, abiertas y problemas con datos que cambian
  en cada versión). Imprime versión A y B y la clave; cambia o quita preguntas. Captura por alumno (marcas qué falló y la
  calificación llega sola a Calificaciones) o rápida (cuántos fallaron cada pregunta). El análisis dice qué temas reenseñar,
  qué preguntas fallaron más, a quién darle segunda oportunidad y qué le costó a cada alumno (también en su ficha).
- **Tareas y libreta** (Más → Tareas y libreta, o Calificaciones → Libreta): junta las tareas y los trabajos en libreta de las
  clases que diste más las que agregues; revisas alumno por alumno (✓ completa, ½ incompleta, ✗ no) y la calificación entra sola
  como actividad de Libreta. Lista de cotejo imprimible.
- **Puntos extra ⭐** en cada actividad: suman a la participación. La participación ahora es relativa: el que más participa en
  el parcial = 100% y los demás en proporción (en Calificaciones ves quién tiene su 5% completo). La meta fija sigue en Ajustes.

**Nuevo en v1.8:** **adelantar clases** y sección **Tutoría**.
- En Clases, "¿Cómo salió esta clase?" ahora tiene **Me adelanté +1 h**: úsalo cuando diste la clase en menos tiempo y con el
  tiempo que sobró seguiste con lo que venía. Lo siguiente se jala a ese bloque y todo el parcial se recorre hacia antes.
  Si terminaste antes pero ya no avanzaste, déjala en "Como se planeó". El temporizador también lo ofrece si terminas antes.
- **Más → Tutoría**: alerta temprana ABC con lo de tu módulo (A: 2 o más faltas en 30 días, B: va mal en el semáforo,
  C: 3 o más llamadas de atención), **cooperaciones** con cuentas claras (quién pagó, parciales, quién no paga, gastos con
  comprobante, dinero en caja, corte de caja para el grupo sin nombres, pendientes para tesorería e impresión del control),
  **Mi plan** de tutoría con responsable (tú, tu co-tutora, los dos o el grupo), **seguimiento por alumno** con notas
  (solo lo escolar) y **20 ideas para tutores** con fuentes. "Copiar resumen para la co-tutora" arma el mensaje para WhatsApp.

**Nuevo en v1.7.1:** al final de cada bloque en Clases está **"¿Cómo salió esta clase?"**. Si un tema te llevó más
tiempo, toca **Faltó 1 h** (o las horas que falten): el bloque queda solo con lo que sí diste y lo demás se recorre a la
siguiente clase. **Completa** lo regresa y **No se dio** recorre el bloque entero.

**Nuevo en v1.7:** **imágenes y videos en cada tema**. 21 animaciones propias (mecanismos, cuatro barras, biela, leva,
engranes, poleas, tornillo, vistas, presión, Pascal, aire comprimido, cilindro, válvula 5/2, símbolos ISO 1219, escalera
eléctrica, motor de CD…) que funcionan **sin internet**, con pausa y cámara lenta, y 44 videos de YouTube revisados que se
ven dentro de la app (esos sí necesitan internet). Aparecen en el tema, en el guion de la clase (toca ▶ Animar) y como
diapositivas del Proyector; en el Presentador hay botones para reproducir y pausar el video que está en el proyector.
En cada tema puedes **agregar tus propios** videos, imágenes o páginas (pegas el enlace). Revisa cada video antes de proyectarlo.

**Plan para subir de nivel (v1.7):** dentro del Semáforo y en Más → **Estrategias**. Para los que van mal (rescate),
los regulares (empujón) y los que van bien (mantener y retar) propone estrategias con respaldo de investigación, elegidas
según por qué va así cada alumno (no entrega, examen bajo, faltas). Forma **parejas de tutoría** solas (va mal con va bien)
con guía para monitores, registras qué apoyo diste a quién (también desde la ficha del alumno) y **"¿Funcionan los apoyos?"**
compara el promedio de cada alumno el día del apoyo con el de hoy. En la lista del semáforo, 🛟 marca a quien ya recibió apoyo.

**Nuevo en v1.6:** **Semáforo del grupo** (Más → Semáforo, también en Inicio y en la ficha de cada alumno). Cada alumno
queda como 🔴 va mal (menos de 60), 🟡 regular (60 a 79) o 🟢 va bien (80 o más) según su promedio de examen y
libreta/proyecto/bitácora con tus ponderaciones; mientras no haya calificaciones, cuenta el diagnóstico como punto de partida.
Ves cuántos hay de cada uno y su porcentaje, la lista de atención especial con el motivo, puedes ordenar de mal a bien y filtrar
(va mal, regular, va bien, mejoraron, bajaron, asistencia). Cada viernes se guarda solo un corte para ver si los que van mal
suben a regular. Los límites se cambian en Ajustes → Calificación.

**Nuevo en v1.5:** **modo Presentador**. En cada tema (o desde Clases) toca *Presentador*: el proyector muestra solo la
diapositiva y tu laptop o celular muestra los controles, la respuesta antes de revelarla, tus notas, lo que sigue, alumno al
azar y "pantalla en negro". Se usa con dos ventanas: laptop conectada al proyector en modo **Extender** (Windows + P) o Galaxy
con **Samsung DeX**. Si solo *duplicas* la pantalla, el proyector muestra lo mismo que tu aparato.

**Nuevo en v1.4:** **lugar de cada clase**. En *Ajustes → Grupo y horario* cada bloque dice si es 🏫 aula, 💻 centro de
cómputo o 🛠️ taller (este semestre: viernes en cómputo). Clases acomoda sola lo de computadora en esos bloques, nunca
pone corte ni agua en el centro de cómputo, y si un día te toca taller lo cambias en ese día y se trae la siguiente
práctica. Actualiza los lugares cada semestre.

**Clase con temporizador (v1.4):** en el guion de cada bloque toca **⏱ Dar esta clase con temporizador**. Una barra abajo te lleva
paso a paso con su tiempo; avisa con sonido y vibración cuando se acaba el tiempo de un paso, te dice si vas atrasado o
adelantado y si ya no alcanzas antes de que termine el bloque. El tiempo también se ve en el modo Proyector. Al terminar,
guarda en la bitácora cuánto te tomó cada paso y, si no alcanzaste, recorre lo que faltó a la siguiente clase.

**Nuevo en v1.3:** pantalla **Clases** (en la barra de abajo). Para cada bloque de tu horario dice qué dar: actividad,
objetivo, guion por minutos, material, evidencia, tarea y palabras para adelantar el tema, con el botón para proyectar.
La secuencia suma las mismas horas que tu planeación (2º parcial: 7 + 52 + 12 = 71 h; 3er parcial: 9 + 51 + 32 = 92 h)
y cada actividad indica qué actividad clave del programa SEP trabaja. Si una clase no se da, márcala y todo se recorre;
con "⇄" cambias el orden de dos actividades. Además: la app se repara sola si se pegaron renglones que no eran nombres,
busca versión nueva cada vez que la abres y Ajustes → Sincronización trae la guía paso a paso con el SQL para copiar.

**Nuevo en v1.2:** **Perfiles**. Cada alumno tiene un perfil aproximado del semestre: punto de partida (diagnóstico),
conocimiento, trabajos, constancia, participación y actitud, con fortalezas, áreas de oportunidad, siguiente paso y
cuántos datos lo sostienen. La vista del grupo muestra posibles monitores, a quién apoyar primero, equipos equilibrados,
fichas imprimibles para juntas y una copia **sin nombres** para analizar con Claude. Además:
- **Observaciones de un toque:** en el Pase de lista toca el nombre del alumno (🤝 explicó, ❓ buena pregunta, 💤 se distrajo…).
- **Puntos máximos** en cada actividad (ej. examen de 94 puntos): escribes los puntos y la app los convierte a base 100.
- **Rubro Diagnóstico:** no cuenta para la calificación, marca el punto de partida.
- **Pegar datos de Claude** (Alumnos → Pegar datos de Claude): pegas el bloque que Claude arma desde tus fotos de listas o exámenes, revisas y aplicas.

**Cómo proyectar:** conecta la laptop al proyector → abre *Temas* → elige el tema → **Proyectar**.
Teclas: → o espacio avanza (o muestra la respuesta), ← regresa, **R** muestra la respuesta, **Esc** sale.
En celular o tableta, toca la pantalla para avanzar y el borde izquierdo para regresar.

No necesita compilar nada: se sube tal cual a GitHub Pages arrastrando los archivos.

---

## 1. Supabase (para tener los mismos datos en tu Galaxy y en tu PC)

Te recomiendo un proyecto **nuevo** y separado de Brida, porque aquí vivirán datos de alumnos menores de edad.

1. En supabase.com → **New project** (nombre: `escuadra`). Guarda la contraseña de la base.
2. **SQL Editor → New query** → pega todo `schema.sql` → **Run**.
3. **Authentication → Users → Add user → Create new user**: tu correo + una contraseña, marca **Auto Confirm User**.
4. **Authentication → Sign In / Providers → Email**: desactiva **Allow new users to sign up** (así nadie más puede crear cuenta).
5. **Project Settings → API** (o *Data API / API Keys*): copia **Project URL** y la **anon public key** (o *publishable key*).

**2b. Para las fotos de evidencias (una sola vez, aunque ya hayas hecho el paso 2):** en **SQL Editor → New query** pega todo
`schema-fotos.sql` (o en la app: Ajustes → Sincronización → «Copiar SQL de fotos») → **Run**. Crea un espacio de archivos
**privado** llamado `evidencias` (solo fotos JPG de hasta 3 MB) y reglas para que cada usuario solo vea, suba y borre lo de su
propia carpeta. Sin este paso, las fotos se quedan solo en el aparato donde las tomaste.

> Si Supabase no te deja crear otro proyecto gratis, la app funciona igual **solo en un dispositivo** (sin Supabase) y puedes pasar datos con *Ajustes → Respaldo*.

## 2. GitHub Pages

1. GitHub → **New repository** → nombre `escuadra` → *Public* → Create.
2. **Add file → Upload files** → arrastra **todos** los archivos de este zip, incluida la carpeta `ayuda` → **Commit changes**.
3. **Settings → Pages** → *Source: Deploy from a branch* → *Branch: main / (root)* → **Save**.
4. En 1–2 minutos queda en `https://TU-USUARIO.github.io/escuadra/`

El repositorio puede ser público: **el código no contiene nombres de alumnos**. La lista la importas desde la app
y se guarda solo en tu dispositivo y en tu Supabase, protegida con tu contraseña.

## 3. Instalar y conectar

1. Abre la URL en Chrome de tu Galaxy → menú ⋮ → **Agregar a pantalla principal / Instalar app**. En la PC, el ícono de instalar en la barra de direcciones.
2. **Ajustes → Sincronización**: pega URL y llave → *Guardar y conectar* → inicia sesión.
   - Atajo: si pones la URL y la llave en `config.js` antes de subirlo, todos tus dispositivos se conectan solos.
3. **Alumnos → Subir Excel** → elige el archivo de listas de la escuela → hoja **LISTA DE ASISTENCIA 3A MEC** → *Importar*.
4. ¿Más de un grupo? **Más → Mis grupos → Agregar grupo** (con su horario) y luego importa su lista igual que en el paso 3.

## 4. Actualizar a una versión nueva

Sube los archivos nuevos encima de los anteriores (mismo nombre) con *Upload files*. La app toma la versión nueva
al abrirla con internet. Tus datos no se tocan.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Página principal |
| `styles.css` | Diseño (claro/oscuro, celular y PC, impresión) |
| `data.js` | Programa de estudios 2024 (los 5 módulos completos), tus fechas de parciales, horario y borradores de planeación |
| `ideas.js` | Banco de 52 ideas: prácticas, FreeCAD, manejo de grupo, evaluación y 24 para clase con proyector |
| `temas.js` | 26 temas con explicación, ejemplo resuelto, preguntas y contenido para el modo Proyector |
| `core.js` | Guardado, sincronización y cálculos |
| `perfil.js` | Perfil de cada alumno, observaciones, equipos equilibrados y fichas |
| `semaforo.js` | Semáforo del grupo: va mal, regular o va bien, filtros y avance semanal |
| `figuras.js` | 21 figuras animadas de los temas (dibujadas por la app, sin internet) |
| `videos.js` | Videos seleccionados por tema, tus recursos propios y diapositivas de video e imagen |
| `estrategias.js` | Estrategias para subir de nivel, parejas de tutoría y registro de apoyos |
| `tutoria.js` | Sección Tutoría: alerta temprana, cooperaciones, plan, seguimiento e ideas para tutores |
| `dinamicas.js` | Dinámicas de integración y capacidades, rutinas de relación, termómetro y bingo |
| `libreta.js` | Tareas del parcial y revisión de libreta |
| `banco.js` | Banco de preguntas y problemas con datos variables |
| `examen.js` | Examen recomendado, versiones, captura y análisis |
| `practicas.js` | 17 prácticas de FreeCAD con plano acotado, ejercicios del banco para proyectar |
| `repaso.js` | Calentamiento, boleto de salida y temas a reforzar |
| `proyecto.js` | Avance del proyecto por equipo |
| `industria.js` | Ejemplos de la industria del Bajío y planeador de visitas y charlas |
| `reconoce.js` | Reconocimientos semanales por avance |
| `aprobar.js` | Qué le falta a cada alumno para aprobar, plan imprimible e informe para padres |
| `retro.js` | Retroalimentación rápida con banco de frases |
| `mibanco.js` | Tu propio banco de preguntas (agregar, pegar e instrucciones para Claude) |
| `cierre.js` | Cierre del día: recordatorio, tarea, participación, destacados y nota |
| `rapido.js` | Deshacer, buscar alumno, buscador en listas, mantener presionado, atajos de teclado y salto automático |
| `aula.js` | Modo clase, mapa del salón, pase de lista con mantener presionado, justificar por fechas y abrir en lo que toca |
| `captura.js` | Pegar calificaciones, capturar con Claude, por equipo, rúbricas de un toque, tarjetas y dictado |
| `pendientes.js` | Pendientes de captura y evidencias del guion |
| `camara.js`, `cam-worker.js` | Visor de cámara, etiquetas QR de libretas y tarjetas de respuesta (la lectura de tarjetas corre en un hilo aparte) |
| `omr.js` | Hoja de respuestas de burbujas: impresión, lectura con la cámara o con fotos y revisión |
| `evidencias.js` | Fotos de evidencias de trabajos (nunca caras), respaldo privado en Supabase |
| `formularios.js` | QR de tus formularios e importación de respuestas (cuestionario, autoevaluación y coevaluación) |
| `grupos.js` | Mis grupos: agregar con horario, cambiar de grupo, quién tiene clase ahora, archivar y borrar |
| `consejo.js` | Reporte para el consejo técnico: uno por grupo, para imprimir o proyectar, con acuerdos y próximas fechas |
| `semestre.js` | Cambio de semestre: archivar y crear los grupos nuevos con sus alumnos |
| `aprende.js` | El guion aprende: horas reales contra planeadas y ajustes para los próximos grupos |
| `seguridad.js` | Reglamento y firmas, revisión antes de la práctica e incidentes |
| `portafolio.js` | Portafolio del alumno y constancias de logro |
| `inventario.js` | Inventario, préstamos y compras del taller |
| `cotutora.js`, `tutora.html` | Vista cifrada para la co-tutora |
| `encuesta.js`, `encuesta.html`, `schema-encuesta.sql` | Encuesta anónima del mes y «Ustedes dijeron → Yo hice» |
| `entregas.js` | Tablero de entregas: qué pedir, tablero por entregable, matriz y tiras; actividades del guion creadas solas |
| `hoy.js` | Inicio compacto «Hoy», cerrar semana y pre-cierre de captura |
| `monitores.js` | Monitores rotativos en el centro de cómputo y su registro |
| `casa.js` | Consulta con QR, WhatsApp a casa y repaso para casa |
| `consulta.html`, `repaso.html` | Páginas que abren alumnos y padres desde el QR (sin datos en servidor) |
| `ayuda.js`, `ayuda-data.js`, `ayuda/` | Ayuda dentro de la app (botón ?), capturas y manual en PDF |
| `mods.js` | Contenido por módulo: carga solo el de los módulos de tus grupos y lo integra a Clases, Temas, Banco e Ideas |
| `m1s1.js`, `m1s2.js`, `m1s3.js` | Módulo I: clases, temas, banco de examen, ideas, figuras y proyecto de cada submódulo |
| `m2s1.js` | Módulo II, Submódulo 1 (dibujo y FreeCAD): clases, temas, banco de examen, ideas, figuras y proyecto |
| `m3s1.js`, `m3s2.js`, `m3s3.js` | Módulo III: clases, temas, banco de examen, ideas, figuras y proyecto de cada submódulo |
| `m4s1.js`, `m4s2.js` | Módulo IV: clases, temas, banco de examen, ideas, figuras y proyecto de cada submódulo |
| `m5s1.js`, `m5s2.js` | Módulo V: clases, temas, banco de examen, ideas, figuras y proyecto de cada submódulo |
| `lib-qrcode.js`, `lib-jsqr.js`, `lib-aruco.js` | Bibliotecas libres para dibujar y leer QR y leer las tarjetas (ver `LICENCIAS.txt`) |
| `presentador.js` | Modo Presentador: proyector y control separados |
| `clases.js` | Secuencia de clases de cada submódulo y pantalla Clases |
| `paquete.js` | "Pegar datos de Claude": carga de listas y calificaciones desde texto |
| `views.js` | Pantallas |
| `print.js` | Impresión, acta en Excel y planeación en Word |
| `app.js` | Arranque y navegación |
| `sw.js`, `manifest.json`, `icon-*`, `sc-*` | Instalación como app, accesos del ícono y funcionamiento sin internet |
| `config.js` | (Opcional) conexión a Supabase |
| `schema.sql` | Tabla y reglas de seguridad para Supabase (no hace falta subirlo a GitHub) |
| `schema-fotos.sql` | Espacio privado para las fotos de evidencias en Supabase (paso 2b; tampoco hace falta subirlo) |
| `LICENCIAS.txt` | Licencias de las bibliotecas de terceros incluidas (MIT, BSD y Apache 2.0) |

## Fuentes de los datos cargados

- Programa de estudios *Técnico en Mecatrónica*, SEP/SEMS/COSFAC, clave 3071300008-23, 2ª ed., julio 2024.
- Módulos I a V (v1.18): tablas «Proceso para la formación en competencias» y «Estrategia de evaluación» de ese mismo programa
  (pp. 13-118), leídas del PDF que compartiste; la estrategia didáctica sugerida del Módulo I (pp. 128-145) y la lista de recursos
  (pp. 119-122). Contenido del Módulo I: bibliografía del programa (Boylestad y Nashelsky; Hayt, Kemmerly y Durbin; Hermosa; Pérez
  Montiel; Tocci; Botero; Lajara y Pelegrí), hojas de datos de los fabricantes (1N4007, LM7805, 2N2222, BC547, NE555, LM358, serie
  74LS/74HC, CD4511) y la documentación de KiCad, Tinkercad Circuits, Falstad y CircuitVerse. Los problemas del banco se verificaron
  con un recálculo independiente en 14,500 casos.
- Módulo III (v1.19): programa SEP 2024, pp. 54-66, anexo de Conceptos Centrales de la Educación para el Desarrollo Sostenible (p. 150)
  y recursos de la carrera (pp. 118-122); bibliografía del programa (Kosow; Ruiz Vázquez; Tello; Alcalde, García y Salmerón;
  Antonsen; Perdigones; Baker; Thorpe; documentación de Arduino UNO R3); NOM-001-SEDE-2012 (tabla 310-15(b)(16) y artículos
  200-6, 240-4, 250-119 y 430-22), NOM-029-STPS-2011, NOM-017-STPS-2008; IEC 60617, 60947, 60204-1, 61131-3 y 60848; hojas de datos
  (ULN2003A, IRLZ44N, 1N4007, LM35, DHT11, HC-SR04); documentación de OpenPLC (autonomylogic.com), Arduino (docs.arduino.cc),
  Wokwi y Tinkercad; FAO-AQUASTAT y CONAGUA para el nexo agua-energía-alimento. Los problemas del banco se verificaron con un
  recálculo independiente (22,500 casos de los Módulos I y III).
- Módulo V (v1.20): programa SEP 2024, pp. 97-110, y recursos de la carrera (pp. 118-122); bibliografía del programa (Bolton;
  García, Escaño y Nuevo; Reyes, Cid y Vargas; Mora; González; Emd; Mantenimiento industrial práctico); NOM-004-STPS-1999,
  NOM-029-STPS-2011, NOM-009-STPS-2011, NOM-033-STPS-2015, NOM-017-STPS-2008 y NOM-052-SEMARNAT-2005; IEC 60204-1, ISO 12100,
  ISO 1219, IEC 60848, ISO 3448, ISO 15 e ISO 20816; Moubray (curva P-F) y Nakajima (OEE); criterios de termografía de NETA;
  hojas de datos (HC-SR04, TCS34725, TCS3200, SG90, 28BYJ-48, A4988, L298N, DS18B20, ACS712, MPU6050); documentación de Arduino,
  Wokwi y phyphox (RWTH Aachen). Los problemas del banco se verificaron con un recálculo independiente (29,000 casos de los
  Módulos I, III y V).
- Módulo IV (v1.21): programa SEP 2024, pp. 76-87, y recursos de la carrera (pp. 118-122); bibliografía del programa (Krar, Gill y
  Smid, *Tecnología de las máquinas herramienta*; Smid, *CNC Programming Handbook* y *CNC Control Setup for Milling and Turning*; Groover, *Automation,
  Production Systems, and Computer-Integrated Manufacturing*; Cruz, *Control numérico y programación*; Chang, Wysk y Wang, *Computer-Aided Manufacturing*); ISO 841 (ejes y sentidos), ISO 6983
  (código G), ISO 8373 (vocabulario de robots), ISO 10218-1/-2 e ISO/TS 15066 (seguridad de robots), NOM-004-STPS-1999;
  documentación de GRBL y LaserGRBL, CAMotics (GPL-2.0), NC Viewer, FreeCAD 1.0 (CAM), Webots (Apache 2.0), CoppeliaSim Edu,
  RoboDK, Arduino (librería Servo) y Wokwi; diseño abierto MeArm (CC BY-SA). Los problemas del banco se verificaron con un recálculo
  independiente (34,500 casos de los Módulos I, III, IV y V).
- Módulo II, Submódulo 1 (v1.22): programa SEP 2024, pp. 32-35, y su bibliografía (Estrada y Llamas, *Dibujo Técnico I*);
  NOM-Z-68-1986 (formatos de las láminas), NOM-008-SCFI-2002 (unidades); ISO 216 (formatos A), ISO 5457 (márgenes y marco),
  ISO 7200 (cuadro de datos), ISO 128 (líneas, vistas y cortes), ISO 129-1 (acotación), ISO 3098 (rotulación), ISO 5455 (escalas)
  e ISO 5456 (primer y tercer diedro); documentación oficial de FreeCAD 1.0 y 1.1 (Part Design, Sketcher, TechDraw); densidades
  de tablas de materiales y The Aluminum Association (energía del aluminio reciclado). Los problemas del banco se verificaron con
  un recálculo independiente (37,000 casos de los Módulos I a V).
- Fechas de parciales, asuetos y capturas: tu cuaderno (foto del 5 oct 2026).
- Horario: hoja "3 MEC" (bloques azules de MÓDULO, 16 h/semana).
- Planeaciones: tus archivos "2do parcial 3ro.docx" y "3er parcial 3ro.docx".
- Formato de acta y lista: "LISTAS DE ASISTENCIA AGOSTO ENERO 2026.xlsx".
- Temas: el propio programa SEP 2024 y su bibliografía (Myszka, *Máquinas y mecanismos*; Bolton, *Mecatrónica*; Guillén, *Introducción a la Neumática*; Serrano, *Neumática práctica*; manuales CNAD de Rivera y Ruiz), más ISO 1219 y las NOM que cita el programa. Cada tema dice su fuente al final.
- Simuladores sugeridos: PhET (Universidad de Colorado, gratuitos) y PMKS+ (Worcester Polytechnic Institute, gratuito y sin registro).
- Videos: canales de YouTube indicados en cada video (verificados el 7 oct 2026 con el servicio oEmbed de YouTube). Las animaciones son originales de la app.
- Estrategias: Education Endowment Foundation, *Teaching and Learning Toolkit* (retroalimentación, metacognición, tutoría entre pares, aprendizaje para el dominio); Dunlosky y col. (2013); Roediger y Karpicke (2006); Rosenshine (2012); Mueller y Dweck (1998); Ryan y Deci (2000). Los enlaces están en Más → Estrategias → Fuentes.
- Consejo técnico (v1.23): SEP-SEMS (2014), *Yo no abandono*: manual de alerta temprana (señales de asistencia, rendimiento y conducta); SEP, orientaciones de las sesiones de Consejo Técnico Escolar 2025-2026 (sesiones ordinarias el último viernes de cada mes, revisión del avance y acuerdos del colectivo).
- Tutoría: SEP-SNB, Acuerdo 9/CD/2009 (acción tutorial); SEMS (2014), *Yo no abandono*: manual de alerta temprana; Ley General de Educación, art. 7, fr. IV (aportaciones voluntarias); SEP-DGB (2023) Currículum ampliado y (2025) Orientaciones para la formación socioemocional; IES-WWC (2017) *Preventing Drop-out in Secondary Schools*; EEF (familias, socioemocional, mentoría, tutoría entre pares). Enlaces en Tutoría → Ideas → Fuentes.
- Examen: preguntas escritas a partir del contenido de Temas (programa SEP 2024 y su bibliografía) y revisadas una por una; los problemas calculan su respuesta con las fórmulas del curso. Reparto por horas = tabla de especificaciones. Repaso de temas bajos: práctica de recuperación y espaciada (Dunlosky y col., 2013).
- Dinámicas: Construye T (SEP-SEMS y PNUD); SEP-DGB (2025) Orientaciones para la formación socioemocional; EEF (aprendizaje socioemocional, aprendizaje colaborativo, retroalimentación); Cook y col. (2018) saludo en la puerta; Yeager y col. (2014) retroalimentación sabia; Roorda y col. (2011) relación docente-alumno; Aronson (rompecabezas); Wujec (2010) reto del malvavisco; Bandura (1977) autoeficacia. Enlaces en Dinámicas → Fuentes.
- Prácticas de FreeCAD: nombres de herramientas y flujo de trabajo de la documentación oficial de FreeCAD 1.0 (wiki: Part Design, Sketcher, Assembly y TechDraw; espejo en GitHub *FreeCAD-documentation*); fórmulas de los Temas de la app (Grashof, carrera = 2r, i = Z2/Z1, a = m·(Z1+Z2)/2, F = P·A, τ = F·r). Consejos del centro de cómputo: Rosenshine (2012), *Principles of Instruction*.
- Calentamiento y boleto: práctica de recuperación espaciada (Dunlosky y col., 2013; Roediger y Karpicke, 2006) y revisar la comprensión al cerrar (Rosenshine, 2012). Reconocimientos: elogiar el esfuerzo y la estrategia (Mueller y Dweck, 1998).
- Retroalimentación: concreta y con siguiente paso (EEF, *Teaching and Learning Toolkit*: Feedback). Informe para padres: consejos de estudio por recuperación (Dunlosky y col., 2013).
- Industria: armadoras, motores, transmisiones y regiones de Guanajuato según *mexicoindustry.com* (20 ago 2026); Guanajuato primer productor de vehículos ligeros en 2025 según *Mexico Business News* (22 ene 2026, datos de Cluster Industrial).
- Captura rápida: accesos del ícono según el *Web App Manifest* (Chrome en Android muestra hasta 3; web.dev, «App shortcuts»);
  dictado con la *Web Speech API* (MDN: en Chrome usa un servicio de reconocimiento en línea, por eso necesita internet); los accesos del ícono se actualizan como máximo una vez al día; rúbricas
  analíticas de 4 niveles con criterios propios de la app (editables).
- Cámara (v1.16): QR con *qrcode-generator* (Kazuhiko Arase, MIT) y lectura con el lector del navegador (*Shape Detection API*,
  `BarcodeDetector`) o, si no hay, con *jsQR* (Apache 2.0). Tarjetas: marcadores del diccionario ARUCO_MIP_36h12 de ArUco
  (Garrido-Jurado, Muñoz-Salinas y col., *Pattern Recognition*, 2016) leídos con *js-aruco2* (MIT); se aceptan lecturas con hasta 5
  bits dudosos, menos de la mitad de la distancia mínima del diccionario (12), para que nunca confunda un número con otro.
  Hoja de respuestas: diseño y lectura propios de la app (4 marcas de esquina, homografía y comparación de cada burbuja con el papel
  de alrededor), probados con fotos simuladas: giradas, con perspectiva, sombra, desenfoque y JPEG. Espacio de fotos y reglas de
  acceso según la guía de Supabase *Storage Access Control* (supabase.com/docs/guides/storage/security/access-control).
- v1.25: NOM-017-STPS-2008, NOM-004-STPS-1999 y NOM-029-STPS-2011 (seguridad en el taller); Web Crypto (AES-GCM y PBKDF2) según MDN para la vista de la co-tutora; Roorda y col. (2011) sobre la relación docente-alumno para «Ustedes dijeron → Yo hice»; políticas RLS de Supabase (*Row Level Security*) para la encuesta.
- v1.24: monitores y tutoría entre pares (EEF, *Teaching and Learning Toolkit*: Peer tutoring; Rosenshine, 2012); recuperación del boleto en el calentamiento (Dunlosky y col., 2013); IndexedDB y `navigator.storage.persist()` según MDN; compresión de los enlaces con `CompressionStream('deflate-raw')` (MDN); enlaces de WhatsApp `wa.me` según el Centro de ayuda de WhatsApp («Cómo usar el enlace para chatear»).
- Perfil: criterios propios de la app (cada dato muestra de dónde sale). El lenguaje de "todavía" sigue a Dweck (2006), *Mindset*; el cuidado con etiquetas, a Jussim y Harber (2005) sobre expectativas del docente.
