# Escuadra · Control docente (v1.12.0)

App web instalable (PWA) para tus clases de Mecatrónica en el CETAC 19: pase de lista y participación,
calificaciones con tu esquema (Examen 50 · Libreta/Proyecto/Bitácora 40 · Asistencia 5 · Participación 5),
acta con las mismas columnas que la de la escuela, impresión de listas, lista de cotejo y rúbrica,
planeaciones en el formato SEMS con revisión automática y exportación a Word, banco de ideas,
herramientas de clase (alumno al azar, equipos, temporizador), bitácora y lista de mejoras.

**Nuevo en v1.1:** sección **Temas** con 26 explicaciones del Módulo II (nivelación del Submódulo 1, mecanismos,
neumática e hidráulica y formación integral) y **modo Proyector**: diapositivas a pantalla completa generadas solas,
con preguntas que revelan la respuesta y alumno al azar. Además, 24 ideas nuevas para clase con proyector.

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

> Si Supabase no te deja crear otro proyecto gratis, la app funciona igual **solo en un dispositivo** (sin Supabase) y puedes pasar datos con *Ajustes → Respaldo*.

## 2. GitHub Pages

1. GitHub → **New repository** → nombre `escuadra` → *Public* → Create.
2. **Add file → Upload files** → arrastra **todos** los archivos de este zip (sin carpeta) → **Commit changes**.
3. **Settings → Pages** → *Source: Deploy from a branch* → *Branch: main / (root)* → **Save**.
4. En 1–2 minutos queda en `https://TU-USUARIO.github.io/escuadra/`

El repositorio puede ser público: **el código no contiene nombres de alumnos**. La lista la importas desde la app
y se guarda solo en tu dispositivo y en tu Supabase, protegida con tu contraseña.

## 3. Instalar y conectar

1. Abre la URL en Chrome de tu Galaxy → menú ⋮ → **Agregar a pantalla principal / Instalar app**. En la PC, el ícono de instalar en la barra de direcciones.
2. **Ajustes → Sincronización**: pega URL y llave → *Guardar y conectar* → inicia sesión.
   - Atajo: si pones la URL y la llave en `config.js` antes de subirlo, todos tus dispositivos se conectan solos.
3. **Alumnos → Subir Excel** → elige el archivo de listas de la escuela → hoja **LISTA DE ASISTENCIA 3A MEC** → *Importar*.

## 4. Actualizar a una versión nueva

Sube los archivos nuevos encima de los anteriores (mismo nombre) con *Upload files*. La app toma la versión nueva
al abrirla con internet. Tus datos no se tocan.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Página principal |
| `styles.css` | Diseño (claro/oscuro, celular y PC, impresión) |
| `data.js` | Programa de estudios 2024 (Módulo II completo), tus fechas de parciales, horario y borradores de planeación |
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
| `practicas.js` | 15 prácticas de FreeCAD con plano acotado, ejercicios del banco para proyectar |
| `repaso.js` | Calentamiento, boleto de salida y temas a reforzar |
| `proyecto.js` | Avance del proyecto por equipo |
| `industria.js` | Ejemplos de la industria del Bajío y planeador de visitas y charlas |
| `reconoce.js` | Reconocimientos semanales por avance |
| `presentador.js` | Modo Presentador: proyector y control separados |
| `clases.js` | Secuencia de clases de cada submódulo y pantalla Clases |
| `paquete.js` | "Pegar datos de Claude": carga de listas y calificaciones desde texto |
| `views.js` | Pantallas |
| `print.js` | Impresión, acta en Excel y planeación en Word |
| `app.js` | Arranque y navegación |
| `sw.js`, `manifest.json`, `icon-*` | Instalación como app y funcionamiento sin internet |
| `config.js` | (Opcional) conexión a Supabase |
| `schema.sql` | Tabla y reglas de seguridad para Supabase (no hace falta subirlo a GitHub) |

## Fuentes de los datos cargados

- Programa de estudios *Técnico en Mecatrónica*, SEP/SEMS/COSFAC, clave 3071300008-23, 2ª ed., julio 2024.
- Fechas de parciales, asuetos y capturas: tu cuaderno (foto del 5 oct 2026).
- Horario: hoja "3 MEC" (bloques azules de MÓDULO, 16 h/semana).
- Planeaciones: tus archivos "2do parcial 3ro.docx" y "3er parcial 3ro.docx".
- Formato de acta y lista: "LISTAS DE ASISTENCIA AGOSTO ENERO 2026.xlsx".
- Temas: el propio programa SEP 2024 y su bibliografía (Myszka, *Máquinas y mecanismos*; Bolton, *Mecatrónica*; Guillén, *Introducción a la Neumática*; Serrano, *Neumática práctica*; manuales CNAD de Rivera y Ruiz), más ISO 1219 y las NOM que cita el programa. Cada tema dice su fuente al final.
- Simuladores sugeridos: PhET (Universidad de Colorado, gratuitos) y PMKS+ (Worcester Polytechnic Institute, gratuito y sin registro).
- Videos: canales de YouTube indicados en cada video (verificados el 7 oct 2026 con el servicio oEmbed de YouTube). Las animaciones son originales de la app.
- Estrategias: Education Endowment Foundation, *Teaching and Learning Toolkit* (retroalimentación, metacognición, tutoría entre pares, aprendizaje para el dominio); Dunlosky y col. (2013); Roediger y Karpicke (2006); Rosenshine (2012); Mueller y Dweck (1998); Ryan y Deci (2000). Los enlaces están en Más → Estrategias → Fuentes.
- Tutoría: SEP-SNB, Acuerdo 9/CD/2009 (acción tutorial); SEMS (2014), *Yo no abandono*: manual de alerta temprana; Ley General de Educación, art. 7, fr. IV (aportaciones voluntarias); SEP-DGB (2023) Currículum ampliado y (2025) Orientaciones para la formación socioemocional; IES-WWC (2017) *Preventing Drop-out in Secondary Schools*; EEF (familias, socioemocional, mentoría, tutoría entre pares). Enlaces en Tutoría → Ideas → Fuentes.
- Examen: preguntas escritas a partir del contenido de Temas (programa SEP 2024 y su bibliografía) y revisadas una por una; los problemas calculan su respuesta con las fórmulas del curso. Reparto por horas = tabla de especificaciones. Repaso de temas bajos: práctica de recuperación y espaciada (Dunlosky y col., 2013).
- Dinámicas: Construye T (SEP-SEMS y PNUD); SEP-DGB (2025) Orientaciones para la formación socioemocional; EEF (aprendizaje socioemocional, aprendizaje colaborativo, retroalimentación); Cook y col. (2018) saludo en la puerta; Yeager y col. (2014) retroalimentación sabia; Roorda y col. (2011) relación docente-alumno; Aronson (rompecabezas); Wujec (2010) reto del malvavisco; Bandura (1977) autoeficacia. Enlaces en Dinámicas → Fuentes.
- Prácticas de FreeCAD: nombres de herramientas y flujo de trabajo de la documentación oficial de FreeCAD 1.0 (wiki: Part Design, Sketcher, Assembly y TechDraw; espejo en GitHub *FreeCAD-documentation*); fórmulas de los Temas de la app (Grashof, carrera = 2r, i = Z2/Z1, a = m·(Z1+Z2)/2, F = P·A, τ = F·r). Consejos del centro de cómputo: Rosenshine (2012), *Principles of Instruction*.
- Calentamiento y boleto: práctica de recuperación espaciada (Dunlosky y col., 2013; Roediger y Karpicke, 2006) y revisar la comprensión al cerrar (Rosenshine, 2012). Reconocimientos: elogiar el esfuerzo y la estrategia (Mueller y Dweck, 1998).
- Industria: armadoras, motores, transmisiones y regiones de Guanajuato según *mexicoindustry.com* (20 ago 2026); Guanajuato primer productor de vehículos ligeros en 2025 según *Mexico Business News* (22 ene 2026, datos de Cluster Industrial).
- Perfil: criterios propios de la app (cada dato muestra de dónde sale). El lenguaje de "todavía" sigue a Dweck (2006), *Mindset*; el cuidado con etiquetas, a Jussim y Harber (2005) sobre expectativas del docente.
