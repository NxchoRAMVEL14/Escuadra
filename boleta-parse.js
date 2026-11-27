/* Escuadra · lectura de la boleta de calificaciones (PDF de control escolar DGETAyCM). v1.50.0
   Recibe el texto de cada página con su posición ({ s, x, y }) y devuelve los alumnos con sus materias:
   columnas 1ER. P., 2DO. P., 3ER. P. (calificaciones) y 1ER. A., 2DO. A., 3ER. A. (asistencias). Sirve para la boleta
   grupal (una página por alumno) y la individual. Las filas sin calificación (el nombre del módulo) se guardan como
   encabezado del módulo. */
(function (root) {
  'use strict';
  const CODIGO = /^\d{5,}[-A-Z0-9]*$/i, CERCA = 2.5;
  const limpia = s => String(s || '').replace(/\s+/g, ' ').trim();
  function pagina(items) {
    const it = items.map(i => ({ s: limpia(i.s), x: i.x, y: i.y, w: i.w || 0 })).filter(i => i.s);
    const tras = (etq) => { const e = it.find(i => i.s.toUpperCase() === etq); if (!e) return ''; const L = it.filter(i => Math.abs(i.y - e.y) < CERCA && i.x > e.x + 1).sort((a, b) => a.x - b.x); return L.length ? L[0].s : ''; };
    const nombre = tras('NOMBRE:'); if (!nombre) return null;
    // columnas: los encabezados «1ER. P.», «2DO. P.», «3ER. P.» y los tres «1ER.», «2DO.», «3ER.» de asistencias
    const cab = it.filter(i => /^(1ER|2DO|3ER)\.( P\.)?$/i.test(i.s)).sort((a, b) => a.x - b.x);
    const cols = cab.map(i => ({ x: i.x + (i.w || 0) / 2, k: /P\.$/i.test(i.s) ? 'p' : 'a', n: { '1ER': 0, '2DO': 1, '3ER': 2 }[i.s.slice(0, 3).toUpperCase()] }));
    const yCab = cab.length ? Math.max.apply(null, cab.map(i => i.y)) : 1e9, x0 = cols.length ? Math.min.apply(null, cols.map(c => c.x)) - 20 : 430;
    const fir = it.filter(i => /^_{5,}$/.test(i.s) || /^DIRECTOR/i.test(i.s)), piso = fir.length ? Math.max.apply(null, fir.map(i => i.y)) + 40 : 0;
    const cods = it.filter(i => CODIGO.test(i.s) && i.y < yCab - 5 && i.y > piso).sort((a, b) => b.y - a.y);
    const mats = cods.map((c, k) => {
      const yFin = k + 1 < cods.length ? cods[k + 1].y : -1e9;
      const nom = it.filter(i => i.x > c.x + 40 && i.x < x0 && i.y <= c.y + CERCA && i.y > yFin + CERCA && i.y > piso).sort((a, b) => b.y - a.y || a.x - b.x).map(i => i.s).join(' ');
      const m = { clave: c.s, nombre: limpia(nom), p: [null, null, null], a: [null, null, null] };
      it.filter(i => Math.abs(i.y - c.y) < CERCA && i.x >= x0 - 5).forEach(i => { const cx = i.x + (i.w || 0) / 2; let best = null, d = 1e9; cols.forEach(col => { const dd = Math.abs(col.x - cx); if (dd < d) { d = dd; best = col; } }); if (best && d < 30) { const v = /^\d+(\.\d+)?$/.test(i.s) ? Number(i.s) : i.s.toUpperCase(); m[best.k][best.n] = v; } });
      m.vacia = m.p.every(v => v == null) && m.a.every(v => v == null);
      return m; });
    return { nombre: nombre, control: tras('NO. CONTROL:'), grupo: tras('GRUPO:'), semestre: tras('SEMESTRE:'), carrera: tras('CARRERA:'), materias: mats };
  }
  function lee(paginas) { const out = []; paginas.forEach(p => { const r = pagina(p); if (r && r.materias.length) out.push(r); }); return out; }
  // nombre corto de cada materia para las columnas
  function corto(m) { const n = m.nombre || ''; const s = (m.clave.match(/M(\d)S(\d)$/i) || []);
    if (s.length) return 'M' + s[1] + 'S' + s[2]; if (/ingl[eé]s/i.test(n)) return 'Inglés'; if (/filos/i.test(n)) return 'Filosofía'; if (/matem/i.test(n)) return 'Matemáticas'; if (/lengua y comunicaci/i.test(n)) return 'Lengua';
    if (/ciencias naturales|reacciones qu|qu[ií]mica/i.test(n)) return 'Ciencias'; if (/ciencias sociales/i.test(n)) return 'Sociales'; if (/conciencia hist/i.test(n)) return 'Historia'; if (/socioemocional/i.test(n)) return 'Socioemoc.'; if (/cultura digital/i.test(n)) return 'Digital';
    return n.split(/[ .]/)[0].slice(0, 10); }
  const api = { pagina: pagina, lee: lee, corto: corto };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.BoletaParse = api;
})(typeof window !== 'undefined' ? window : this);
