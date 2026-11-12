// v1.34.0 · Formatos de la escuela (acta y lista llenadas sin cambiar el formato) y Muestra Profesiográfica
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t173';
mkdirSync(OUT, { recursive: true });
const PORT = process.env.PORT || 8765;
// Excel de prueba con la misma estructura que el de control escolar (nombres inventados)
const PY = `
import openpyxl, sys
from openpyxl.styles import Font, Border, Side, Alignment
wb = openpyxl.Workbook(); wb.remove(wb.active)
th = Side(style='thin'); B = Border(left=th, right=th, top=th, bottom=th)
def hoja(nom, carrera, sem, gr, tipo, al):
    ws = wb.create_sheet(nom)
    ws['A1'] = 'OPCION EDUCATIVA: ESCOLARIZADO'; ws['A3'] = 'CARRERA: ' + carrera; ws['A4'] = 'SEMESTRE: ' + sem; ws['C4'] = 'GRUPO: ' + gr
    ws['A6'] = 'LISTA DE ASISTENCIA ' if tipo == 'lista' else 'ACTA PARA ENVIO DE CALIFICACIONES'
    ws['A8'] = 'No.'; ws['B8'] = 'NOMBRE'
    cols = 35 if tipo == 'lista' else 13
    if tipo == 'acta':
        for c, t in zip('CDEFGHIJKM', ['1 PAR', 'ASIS', 'FAL', '2 PAR', 'ASIS', 'FAL', '3 PAR', 'ASIS', 'FAL', 'CALIFICACION FINAL']): ws[c + '8'] = t
    for c in range(1, cols + 1):
        x = ws.cell(8, c); x.font = Font(name='Calibri', size=12, bold=True); x.border = B; x.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    ws.row_dimensions[8].height = 15.75
    for i, n in enumerate(al):
        r = 9 + i; ws.cell(r, 1, i + 1); ws.cell(r, 2, n)
        for c in range(1, cols + 1): ws.cell(r, c).border = B; ws.cell(r, c).font = Font(name='Calibri', size=11)
        if tipo == 'acta': ws.cell(r, 13, '=C%d+F%d+I%d/3' % (r, r, r))
    if tipo == 'lista':
        for c in range(3, 36): ws.column_dimensions[openpyxl.utils.get_column_letter(c)].width = 1.57
mec = ['DIMAS LOPEZ JUAN CARLOS', 'DOMINGUEZ RUIZ ANA SOFIA', 'GRANADOS PAZ LUIS', 'GUERRERO MORA EVA']
uno = lambda g, n: ['ALUMNO%s%02d APELLIDO PRUEBA' % (g, i) for i in range(1, n + 1)]
hoja('LISTA DE ASISTENCIA 1A', 'TRONCO COMUN', '1', '1A', 'lista', uno('A', 9))
hoja('ACTA CAL. 1A ', 'TRONCO COMUN', '1', '1A', 'acta', uno('A', 9))
hoja('LISTA DE ASISTENCIA 1B', 'TRONCO COMUN', '1', '1B', 'lista', uno('B', 8))
hoja('LISTA DE ASISTENCIA 3A RH', 'TÉCNICO EN ADMINISTRACIÓN DE RECURSOS HUMANOS 2025', '3', '3A', 'lista', uno('R', 5))
hoja('ACTA CAL.3A RH', 'TÉCNICO EN ADMINISTRACIÓN DE RECURSOS HUMANOS 2025', '3', '3A', 'acta', uno('R', 5))
hoja('LISTA DE ASISTENCIA 3A MEC', 'TÉCNICO EN MECATRÓNICA 2025', '3', '3A', 'lista', mec)
hoja('ACTA CAL.3A MEC', 'TÉCNICO EN MECATRÓNICA 2025', '3', '3A', 'acta', mec)
wb.save(sys.argv[1])
`;
writeFileSync(OUT + '/hacer.py', PY);
const XLS = OUT + '/escuela.xlsx';
execFileSync('python3', ['-I', OUT + '/hacer.py', XLS]);
const py = code => execFileSync('python3', ['-I', '-c', code]).toString().trim();

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City', acceptDownloads: true });
const JSZ = ['/opt/npm-tools/node_modules/jszip/dist/jszip.min.js'].find(f => existsSync(f)); // sin internet: la copia local
await ctx.route('**/*', r => { const u = r.request().url(); if (JSZ && /jszip\.min\.js/.test(u)) return r.fulfill({ body: readFileSync(JSZ, 'utf8'), contentType: 'application/javascript' }); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost') || /cdnjs|jsdelivr/.test(u)) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-11-12T08:10:00-06:00') });
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));
await p.goto('http://localhost:' + PORT + '/#/inicio'); await p.waitForTimeout(1500);
await p.evaluate(() => { location.hash = '#/alumnos'; }); await p.waitForTimeout(500);
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, ['DIMAS LOPEZ JUAN CARLOS', 'DOMINGUEZ RUIZ ANA SOFIA', 'GRANADOS PAZ LUIS', 'GUERRERO MORA EVA']); await p.waitForTimeout(500);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); window.print = () => { }; window.E.store.update('config', c => { c.vistaImpresion = false; }, {}); }); await p.waitForTimeout(500);
// calificaciones del 1er parcial y del 3º (el 3º no ha terminado: no debe salir en el acta)
await p.evaluate(() => { const E = window.E, S = E.store, g = E.data.grupoActual(), al = E.data.alumnos(g);
  ['P1', 'P3'].forEach(pid => ['examen', 'proyecto', 'trabajos'].forEach(cat => { const notas = {}; al.forEach(a => { notas[a.id] = 95; }); S.put('act:' + g.id + ':x' + pid + cat, { id: 'x' + pid + cat, parcial: pid, categoria: cat, nombre: cat, peso: 1, max: 100, fecha: pid === 'P1' ? '2026-09-10' : '2026-11-11', cuenta: true, notas: notas }, { silent: true }); })); });
await p.evaluate(() => { location.hash = '#/imprimir'; }); await p.waitForTimeout(800);
ok('Imprimir trae la tarjeta de formatos de la escuela', await p.evaluate(() => !!document.querySelector('[data-ch=fm-subir]')));
await p.setInputFiles('[data-ch=fm-subir]', XLS); await p.waitForTimeout(1500);
const guardado = await p.evaluate(() => { const d = window.E.formatos.doc(); return d && d.hojas; });
ok('encuentra la lista y el acta de su grupo (no las de RH con el mismo 3A)', guardado === 'LISTA DE ASISTENCIA 3A MEC y ACTA CAL.3A MEC', guardado);
await p.evaluate(() => { location.hash = '#/inicio'; }); await p.waitForTimeout(300); await p.evaluate(() => { location.hash = '#/imprimir'; }); await p.waitForTimeout(800);
const baja = async (act, extra) => { const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 15000 }), p.evaluate(([a, x]) => document.querySelector('[data-act=' + a + ']' + (x || '')).click(), [act, extra])]); const f = OUT + '/' + dl.suggestedFilename(); await dl.saveAs(f); return f; };
const fa = await baja('fm-acta');
ok('el acta se descarga como xlsx', /Acta_3A_.*\.xlsx$/.test(fa), fa);
const acta = JSON.parse(py(`
import openpyxl, json
wb = openpyxl.load_workbook(${JSON.stringify(fa)}); ws = wb['ACTA CAL.3A MEC']; o = wb['ACTA CAL.3A RH']; w0 = openpyxl.load_workbook(${JSON.stringify(XLS)})['ACTA CAL.3A MEC']
print(json.dumps({'c9': ws['C9'].value, 'd9': ws['D9'].value, 'f9': ws['F9'].value, 'i9': ws['I9'].value, 'k12': ws['K12'].value, 'm9': ws['M9'].value, 'm12': ws['M12'].value, 'rh': o['C9'].value,
  'vis': [s.title for s in wb.worksheets if s.sheet_state == 'visible'], 'n': len(wb.sheetnames),
  'fmt': all(ws.cell(r, c).font.name == w0.cell(r, c).font.name and ws.cell(r, c).font.sz == w0.cell(r, c).font.sz and ws.cell(r, c).border.left.style == w0.cell(r, c).border.left.style for r in range(8, 13) for c in range(1, 14))}))`));
const fila = await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(); return E.calc.actaFila(g, E.data.alumnos(g)[0].id); });
const v = x => (x === '' || x == null ? null : x);
ok('1º y 2º parciales concluidos: llevan lo mismo que el acta de la app', acta.c9 === v(fila[0]) && acta.d9 === v(fila[1]) && acta.f9 === v(fila[3]), JSON.stringify(acta) + ' · ' + JSON.stringify(fila));
ok('3er parcial sin concluir: queda en blanco aunque ya tenga calificación', acta.i9 == null && acta.k12 == null && fila[6] === 9, fila[6]);
ok('la calificación final queda como promedio de los 3 parciales (en blanco si falta alguno)', acta.m9 === '=IF(COUNT(C9,F9,I9)<3,"",(C9+F9+I9)/3)' && acta.m12 === '=IF(COUNT(C12,F12,I12)<3,"",(C12+F12+I12)/3)', acta.m9 + ' · ' + acta.m12);
ok('no toca las otras hojas (el acta de RH sigue vacía)', acta.rh == null);
ok('se conservan todas las hojas, solo se ve la del acta', acta.n === 7 && acta.vis.length === 1 && acta.vis[0] === 'ACTA CAL.3A MEC', acta.vis.join(','));
ok('mismo formato de celdas (fuente, tamaño y bordes)', acta.fmt === true);
await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(); E.store.put('cerrado:' + g.id + ':P3', { f: '2026-11-12', alumnos: {} }); });
const fa2 = await baja('fm-acta');
const i9 = py(`import openpyxl; print(openpyxl.load_workbook(${JSON.stringify(fa2)})['ACTA CAL.3A MEC']['I9'].value)`);
ok('al cerrar el 3er parcial ya aparece en el acta', i9 === '9', i9);
await p.evaluate(() => { const s = document.getElementById('fm-p'); s.value = 'P2'; });
const fl = await baja('fm-lista', '[data-m="0"]');
const lis = JSON.parse(py(`
import openpyxl, json, zipfile, re
wb = openpyxl.load_workbook(${JSON.stringify(fl)}); ws = wb['LISTA DE ASISTENCIA 3A MEC']; w0 = openpyxl.load_workbook(${JSON.stringify(XLS)})['LISTA DE ASISTENCIA 3A MEC']
x = zipfile.ZipFile(${JSON.stringify(fl)}).read('xl/worksheets/sheet6.xml').decode()
c8 = re.search(r'<c r="C8"[^>]*>.*?</c>', x, re.S).group(0)
fechas = [ws.cell(8, c).value for c in range(3, 36) if ws.cell(8, c).value]
print(json.dumps({'c8': c8, 'n': len(fechas), 'f0': fechas[0] if fechas else None, 'ancho': ws.column_dimensions['C'].width, 'alto': ws.row_dimensions[8].height, 'vis': [s.title for s in wb.worksheets if s.sheet_state == 'visible'],
  'fmt': all(ws.cell(r, c).font.name == w0.cell(r, c).font.name and ws.cell(r, c).border.top.style == w0.cell(r, c).border.top.style and ws.cell(r, c).alignment.wrap_text == w0.cell(r, c).alignment.wrap_text for r in range(8, 13) for c in range(1, 36)), 'marcas': ws['C9'].value}))`));
const [nf, f1] = await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(), f = E.calc.fechasLista(g, E.calc.parcial('P2')); return [Math.min(33, f.length), f[0]]; });
ok('lista del 2º parcial: una fecha por columna (día arriba, mes abajo)', lis.n === nf && lis.f0 === f1.slice(8, 10) + '\n' + f1.slice(5, 7), lis.n + ' de ' + nf + ' · ' + JSON.stringify(lis.f0));
ok('la fecha va en letra chica para que se vea en la celda, sin cambiar el estilo de la celda', /<sz val="6"\/>/.test(lis.c8) && /s="\d+"/.test(lis.c8), lis.c8.slice(0, 160));
ok('mismo ancho de columna, alto de renglón y formato de celdas', Math.abs(lis.ancho - 1.57) < 0.01 && lis.alto === 15.75 && lis.fmt === true, lis.ancho + ' · ' + lis.alto);
ok('«solo con fechas» deja vacía la asistencia', lis.marcas == null && lis.vis.length === 1, lis.marcas);
await p.evaluate(f => { const E = window.E, g = E.data.grupoActual(), al = E.data.alumnos(g), d = {}; d[al[0].id] = 'F'; E.store.put('asis:' + g.id + ':' + f, d); }, f1);
const fl2 = await baja('fm-lista', '[data-m="1"]');
const m2 = py(`import openpyxl; ws = openpyxl.load_workbook(${JSON.stringify(fl2)})['LISTA DE ASISTENCIA 3A MEC']; print(''.join(str(ws.cell(r, c).value or '') for r in (9, 10) for c in range(3, 36)))`);
ok('«con asistencia» pone F a quien faltó y • a quien vino, solo en los días con lista pasada', m2 === 'F•', m2);
// Muestra Profesiográfica
await p.evaluate(() => { location.hash = '#/muestra'; }); await p.waitForTimeout(800);
const vt = await p.evaluate(() => document.body.innerText);
ok('la pantalla trae la rotación con maestros y lugares', /Muestra Profesiográfica Interna/.test(vt) && /Zendy/.test(vt) && /Nacho/.test(vt) && /Tejabán/.test(vt) && (vt.match(/10:30–10:55/) || []).length === 1, '');
ok('celdas de la rotación: 8 turnos × 6 maestros', await p.evaluate(() => document.querySelectorAll('.mu-t tbody td[style]').length) === 8 * 6 + 4);
await p.click('[data-act=mu-leer]'); await p.waitForTimeout(1200);
const L = await p.evaluate(() => { const L = window.E.muestra.listas(); return L && Object.keys(L.g).sort().map(g => g + L.g[g].length).join(','); });
ok('lee las listas de 1º del Excel de la escuela (solo 1er semestre)', L === 'A9,B8', L);
const imp = async nombre => { await p.emulateMedia({ media: 'print' }); await p.pdf({ path: OUT + '/' + nombre + '.pdf', preferCSSPageSize: true, printBackground: true }); await p.emulateMedia({ media: 'screen' }); return Number((execFileSync('pdfinfo', [OUT + '/' + nombre + '.pdf']).toString().match(/Pages:\s+(\d+)/) || [])[1]); };
const txt = (nombre, pg) => execFileSync('pdftotext', ['-f', String(pg || 1), '-l', String(pg || 1), OUT + '/' + nombre + '.pdf', '-']).toString();
const clic = async a => { await p.evaluate(() => { location.hash = '#/muestra'; }); await p.waitForTimeout(500); await p.evaluate(a => document.querySelector('[data-act=' + a + ']').click(), a); await p.waitForTimeout(1200); };
await clic('mu-rot'); let n = await imp('rotacion');
ok('rotación: 1 hoja', n === 1 && /Técnico Laboratorista Ambiental/.test(txt('rotacion')), n);
execFileSync('pdftoppm', ['-r', '50', '-png', OUT + '/rotacion.pdf', OUT + '/rot']);
await clic('mu-listas'); n = await imp('listas');
const t1 = txt('listas');
ok('listas por mitad: una hoja por grupo con sus dos mitades y su ruta', n === 2 && /Grupo A1/.test(t1) && /Grupo A2/.test(t1) && /núm\. 1 al 5/.test(t1) && /núm\. 6 al 9/.test(t1) && /Ruta del grupo A1/.test(t1) && /En su salón/.test(t1), n);
await clic('mu-pas'); n = await imp('pasaportes');
const tp = txt('pasaportes');
ok('pasaportes con nombre: 17 alumnos = 9 hojas', n === 9, n);
ok('el pasaporte trae nombre, grupo con su mitad, turno en Mecatrónica y premio', /Alumnoa01 Apellido Prueba/.test(tp) && /1ºA · A1/.test(tp) && /Tu turno en Mecatrónica: 1:00 a 1:50/.test(tp) && /premio especial/.test(tp) && !/Pluma/.test(tp), tp.slice(0, 300).replace(/\n+/g, ' | '));
execFileSync('pdftoppm', ['-r', '50', '-png', '-f', '1', '-l', '1', OUT + '/pasaportes.pdf', OUT + '/pas']);
ok('sin errores de JavaScript', errs.length === 0, errs.join(' | '));
await b.close();
