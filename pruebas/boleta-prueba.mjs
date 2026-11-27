// Genera una boleta grupal de prueba con el mismo acomodo que la de control escolar (nombres inventados).
import { PDFDocument, StandardFonts } from '/opt/npm-tools/node_modules/pdf-lib/cjs/index.js';
import { writeFileSync } from 'node:fs';
const AL = [['SOTO MENA BETO', '0011', [[5, 7], [9, 6], [5, 7], [5, 5], [6, 5], [6, 6]], [[12, 16], [6, 7], [11, 14], [7, 5], [10, 10], [16, 12]]],
  ['PEREZ LARA ANA', '0003', [[7, 8], [8, 8], [5, 7], [6, 6], [9, 8], [8, 9]], [[12, 17], [7, 10], [12, 17], [7, 11], [11, 17], [16, 18]]],
  ['DIAZ ORTIZ CARLA', '0021', [[8, 9], [8, 7], [9, 9], [8, 9], [8, 8], [9, 9]], [[12, 17], [7, 10], [12, 17], [7, 11], [11, 17], [16, 18]]]];
const MAT = [['30222-0016-25F', 'Inglés III. What we were, we share'], ['30226-0012-25F', 'Pensamiento Filosófico y Humanidades II. Las', 'reflexiones filosóficas sobre el Conocer'], ['30520-0025-25F', 'Ciencias Naturales, Experimentales y Tecnología', 'III. Nuestro hogar. El sistema terrestre'], ['30531-0021-25F', 'Pensamiento Matemático III. Pensamiento', 'algebraico e introducción a geometría plana'], ['30224-0017-25F', 'Lengua y Comunicación III. Describir culturas,', 'apropiarse de las palabras'], ['3071300008-23M2', 'Construye sistemas mecatrónicos'], ['3071300008-23M2S1', 'Dibuja planos de elementos mecánicos']];
const doc = await PDFDocument.create(), f = await doc.embedFont(StandardFonts.Helvetica);
for (const [nom, nc, cal, asi] of AL) { const p = doc.addPage([841.89, 595.28]), t = (s, x, y) => p.drawText(s, { x, y, size: 8, font: f });
  t('BOLETA DE CALIFICACIONES', 343, 480); t('NO. CONTROL:', 110, 420); t('2521104019' + nc, 178, 420); t('NOMBRE:', 110, 410); t(nom, 155, 410); t('GRUPO:', 500, 430); t('3A', 539, 430); t('SEMESTRE:', 110, 400); t('3', 165, 400);
  t('MATERIAS', 81, 367); t('1ER. P.', 450, 367); t('2DO. P.', 505, 367); t('3ER. P.', 561, 367); t('1ER.', 615, 367); t('2DO.', 670, 367); t('3ER.', 726, 367); t('A.', 615, 356); t('A.', 670, 356); t('A.', 726, 356);
  let y = 342, k = 0; MAT.forEach(m => { t(m[0], 81, y); t(m[1], 198, y); if (m[2]) t(m[2], 198, y - 12); if (!/M2$/.test(m[0])) { t(String(cal[k][0]), 450, y); t(String(cal[k][1]), 505, y); t(String(asi[k][0]), 615, y); t(String(asi[k][1]), 670, y); k++; } y -= m[2] ? 25 : 13; });
  t('MARIO DIRECTOR', 354, 123); t('_____________________________________', 328, 92); t('DIRECTOR GENERAL', 375, 81); }
writeFileSync(new URL('./boleta-prueba.pdf', import.meta.url), await doc.save());
