# Escuadra · Control docente (v1.0.0)

App web instalable (PWA) para tus clases de Mecatrónica en el CETAC 19: pase de lista y participación,
calificaciones con tu esquema (Examen 50 · Libreta/Proyecto/Bitácora 40 · Asistencia 5 · Participación 5),
acta con las mismas columnas que la de la escuela, impresión de listas, lista de cotejo y rúbrica,
planeaciones en el formato SEMS con revisión automática y exportación a Word, banco de ideas,
herramientas de clase (alumno al azar, equipos, temporizador), bitácora y lista de mejoras.

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
| `ideas.js` | Banco de 28 ideas de práctica y manejo de grupo |
| `core.js` | Guardado, sincronización y cálculos |
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
