# Escuadra · Control docente (v1.5.0)

App web instalable (PWA) para tus clases de Mecatrónica en el CETAC 19: pase de lista y participación,
calificaciones con tu esquema (Examen 50 · Libreta/Proyecto/Bitácora 40 · Asistencia 5 · Participación 5),
acta con las mismas columnas que la de la escuela, impresión de listas, lista de cotejo y rúbrica,
planeaciones en el formato SEMS con revisión automática y exportación a Word, banco de ideas,
herramientas de clase (alumno al azar, equipos, temporizador), bitácora y lista de mejoras.

**Nuevo en v1.1:** sección **Temas** con 26 explicaciones del Módulo II (nivelación del Submódulo 1, mecanismos,
neumática e hidráulica y formación integral) y **modo Proyector**: diapositivas a pantalla completa generadas solas,
con preguntas que revelan la respuesta y alumno al azar. Además, 24 ideas nuevas para clase con proyector.

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
- Perfil: criterios propios de la app (cada dato muestra de dónde sale). El lenguaje de "todavía" sigue a Dweck (2006), *Mindset*; el cuidado con etiquetas, a Jussim y Harber (2005) sobre expectativas del docente.
