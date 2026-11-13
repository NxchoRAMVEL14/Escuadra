/* Escuadra · Muestra Profesiográfica Interna (v1.34.0). Los 4 grupos de 1º, partidos a la mitad (A1 = primera mitad de la
   lista, A2 = segunda), rotan por las 3 carreras: 4 bloques de 50 minutos; en cada carrera hay 2 maestros y a los 25 minutos
   las mitades se intercambian de maestro. Un grupo se queda en clase en cada bloque.
   Las listas de 1º se leen del Excel de la escuela (se guardan solo en tu cuenta, nunca en el código). */
(function () {
  const E = window.E, S = E.store, D = E.data, u = E.u, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h, card = H.card, btn = H.btn, link = H.link;
  const M = E.muestra = {}, KEY = 'muestra', KL = 'muestra:listas';
  M.BASE = {
    nombre: 'Muestra Profesiográfica Interna', lema: 'Elige tu futuro', fecha: '2026-11-26',
    bloques: [['10:30', '11:20'], ['11:20', '12:10'], ['12:10', '1:00'], ['1:00', '1:50']],
    // grupo de 1º por bloque: [Recursos Humanos, Laboratorio, Mecatrónica, en clase]
    rot: [['A', 'B', 'C', 'D'], ['D', 'A', 'B', 'C'], ['B', 'C', 'D', 'A'], ['C', 'D', 'A', 'B']],
    areas: [
      { n: 'Recursos Humanos', largo: 'Técnico en Administración de Recursos Humanos', lugar: 'Centro de cómputo y explanada', m: ['Zendy', 'Erik'] },
      { n: 'Lab. Ambiental', largo: 'Técnico Laboratorista Ambiental', lugar: 'En el laboratorio', m: ['Jazmin', 'Victoria'] },
      { n: 'Mecatrónica', largo: 'Técnico en Mecatrónica', lugar: 'Tejabán (parte de atrás)', m: ['Ana Bel', 'Nacho'] }],
    mec: 2
  };
  M.doc = () => { const d = Object.assign({}, M.BASE, S.get(KEY) || {}); d.areas = M.BASE.areas.map((a, i) => Object.assign({}, a, (d.areas || [])[i] || {}, { m: ((d.areas || [])[i] || a).m || a.m })); return d; };
  M.listas = () => S.get(KL) || null;
  const COL = { A: '#dce9f7', B: '#dff1e0', C: '#fbe7d3', D: '#ece3f6' };
  const mins = h => { let [a, b] = h.split(':').map(Number); if (a < 8) a += 12; return a * 60 + b; };
  const fmt = m => { let h = Math.floor(m / 60), mi = m % 60; if (h > 12) h -= 12; return h + ':' + String(mi).padStart(2, '0'); };
  // 8 turnos de 25 minutos: [inicio, fin, bloque, mitad]
  M.slots = d => { const o = []; d.bloques.forEach((b, i) => { const x = mins(b[0]), y = mins(b[1]), mid = Math.round((x + y) / 2); o.push([fmt(x), fmt(mid), i, 0]); o.push([fmt(mid), fmt(y), i, 1]); }); return o; };
  // qué medio grupo tiene cada maestro en cada turno: en la 1ª mitad del bloque, el 1er maestro tiene la mitad 1; después se invierte
  M.celda = (d, s, area, mi) => d.rot[s[2]][area] + (mi === s[3] ? '1' : '2');
  M.ruta = (d, gr) => M.slots(d).map(s => { let t = null; d.areas.forEach((a, ai) => [0, 1].forEach(mi => { if (M.celda(d, s, ai, mi) === gr) t = { a: a, m: a.m[mi] }; })); return { s: s, t: t }; });
  M.turnoMec = (d, gr) => { const i = d.rot.findIndex(r => r[d.mec] === gr[0]); return i < 0 ? '' : d.bloques[i][0] + ' a ' + d.bloques[i][1] + ' · ' + d.areas[d.mec].lugar.replace(/ \(.*\)/, ''); };
  M.mitades = al => { const k = Math.ceil(al.length / 2); return [al.slice(0, k), al.slice(k)]; };
  const tc = s => String(s || '').toLowerCase().replace(/(^|[\s-])([a-záéíóúñü])/g, (m, a, b) => a + b.toUpperCase());

  /* ---------- tabla de rotación ---------- */
  M.tabla = d => '<table class="mu-t"><thead><tr><th>Hora</th>' + d.areas.map(a => '<th colspan="2">' + esc(a.n) + '<br><small>' + esc(a.lugar) + '</small></th>').join('') + '<th>En clase</th></tr>' +
    '<tr><th></th>' + d.areas.map(a => a.m.map(m => '<th class="mu-m">' + esc(m) + '</th>').join('')).join('') + '<th></th></tr></thead><tbody>' +
    M.slots(d).map(s => '<tr' + (s[3] ? ' class="mu-2"' : '') + '><td class="mu-h">' + s[0] + '–' + s[1] + '</td>' + d.areas.map((a, ai) => [0, 1].map(mi => { const c = M.celda(d, s, ai, mi); return '<td style="background:' + COL[c[0]] + '"><b>' + c + '</b></td>'; }).join('')).join('') +
      (s[3] ? '' : '<td rowspan="2" style="background:' + COL[d.rot[s[2]][3]] + '"><b>1º' + d.rot[s[2]][3] + '</b></td>') + '</tr>').join('') + '</tbody></table>';

  /* ---------- listas de 1º desde el Excel de la escuela ---------- */
  M.leer = async bytes => {
    const FM = E.formatos, ctx = await FM.abrir(bytes), out = {};
    ctx.hojas.forEach(h => { if (!h.info || h.info.tipo !== 'lista' || String(h.info.semestre).trim() !== '1') return; const g = (/1\s*([A-D])/i.exec(h.info.grupo) || [])[1]; if (!g) return;
      out[g.toUpperCase()] = FM.filas(ctx, ctx.docs[h.path]).map(f => [f.num, f.nombre]); });
    if (!Object.keys(out).length || !Object.keys(out).some(g => out[g].length)) throw new Error('No encontré alumnos de 1er semestre en ese Excel (hojas «LISTA DE ASISTENCIA 1A», 1B…)');
    S.put(KL, { f: u.today(), g: out }); return out;
  };
  CH['mu-subir'] = async el => { const f = el.files && el.files[0]; if (!f) return; try { const buf = await f.arrayBuffer(), o = await M.leer(new Uint8Array(buf)); if (E.formatos && !E.formatos.doc() && E.formatos.guardarPlantilla) E.formatos.guardarPlantilla(f.name, buf); u.toast('Listas de 1º: ' + Object.keys(o).sort().map(g => '1º' + g + ' (' + o[g].length + ')').join(', '), 'ok', 5000); } catch (e) { u.toast(e.message, 'err', 5000); } };
  A['mu-leer'] = async () => { try { const o = await M.leer(); u.toast('Listas de 1º: ' + Object.keys(o).sort().map(g => '1º' + g + ' (' + o[g].length + ')').join(', '), 'ok', 5000); } catch (e) { u.toast(e.message, 'err', 5000); } };
  CH['mu-m'] = el => { const i = +el.dataset.a, j = +el.dataset.m; S.update(KEY, d => { const b = M.doc(); d.areas = (d.areas && d.areas.length ? d.areas : b.areas.map(a => ({ m: a.m.slice() }))); d.areas[i] = d.areas[i] || { m: b.areas[i].m.slice() }; d.areas[i].m = (d.areas[i].m || b.areas[i].m).slice(); d.areas[i].m[j] = el.value.trim(); }, {}); };
  CH['mu-f'] = el => { S.update(KEY, d => { d[el.dataset.k] = el.value; }, {}); };

  /* ---------- impresos ---------- */
  const LOGO = () => (E.print && E.print.LOGO) || '';
  const cab = (d, t) => '<div class="mu-top"><div><h1>' + esc(t) + '</h1><p>' + esc(d.nombre) + ' · ' + esc(u.fLarga(d.fecha)) + ' · ' + esc(d.bloques[0][0]) + ' a ' + esc(d.bloques[d.bloques.length - 1][1]) + '</p></div><img src="' + LOGO() + '" alt="CETAC"></div>';
  A['mu-rot'] = () => { const d = M.doc();
    E.print.run('<div class="bt-pg"><div class="pr mu-p">' + cab(d, 'Rotación por carreras · 1er semestre') + M.tabla(d) +
      '<p class="mu-nota">Cada grupo de 1º se parte a la mitad: <b>1</b> = primera mitad de la lista (de arriba hacia abajo) y <b>2</b> = segunda mitad. Cada bloque dura 50 minutos; a los 25 las mitades se cambian de maestro dentro de la misma carrera. El grupo «en clase» se queda en su salón.</p>' +
      '<div class="mu-car">' + d.areas.map(a => '<div><b>' + esc(a.largo) + '</b><br>' + esc(a.lugar) + '<br><small>' + esc(a.m.join(' y ')) + '</small></div>').join('') + '</div></div></div>', { title: 'Rotación · ' + d.nombre, landscape: true, unaHoja: true, propioLogo: true }); };
  const necesitaListas = () => { const L = M.listas(); if (!L) u.toast('Primero lee las listas de 1º del Excel de la escuela', 'err', 4500); return L; };
  A['mu-listas'] = () => { const d = M.doc(), L = necesitaListas(); if (!L) return;
    const col = (gr, m) => '<div class="mu-col"><h2 style="background:' + COL[gr[0]] + '">Grupo ' + gr + ' <small>· ' + m.length + ' alumnos' + (m.length ? ' · núm. ' + m[0][0] + ' al ' + m[m.length - 1][0] : '') + '</small></h2>' +
      '<table class="mu-l"><tr><th>No.</th><th>Nombre</th><th>Asistió</th></tr>' + m.map(x => '<tr><td class="n">' + esc(x[0]) + '</td><td>' + esc(x[1]) + '</td><td class="ck"></td></tr>').join('') + '</table>' +
      '<h3>Ruta del grupo ' + gr + '</h3><table class="mu-r">' + M.ruta(d, gr).map(r => '<tr><td class="h">' + r.s[0] + '–' + r.s[1] + '</td><td>' + (r.t ? '<b>' + esc(r.t.a.n) + '</b> · ' + esc(r.t.m) + '<br><small>' + esc(r.t.a.lugar) + '</small>' : '<i>En su salón (clase)</i>') + '</td></tr>').join('') + '</table></div>';
    E.print.run(Object.keys(L.g).sort().map(g => { const mm = M.mitades(L.g[g]); return '<div class="bt-pg"><div class="pr mu-p">' + cab(d, '1º' + g + ' · listas por mitad') + '<div class="mu-cols">' + col(g + '1', mm[0]) + col(g + '2', mm[1]) + '</div></div></div>'; }).join(''), { title: 'Listas de 1º por mitad', propioLogo: true, margin: '9mm' }); };
  A['mu-pas'] = () => { const d = M.doc(), L = necesitaListas(); if (!L || !E.expo) return; const X = E.expo, g = D.grupoActual(), ed = X.doc(g || {}), lista = [];
    Object.keys(L.g).sort().forEach(G => M.mitades(L.g[G]).forEach((m, i) => { const gr = G + (i + 1); m.forEach(x => lista.push({ nombre: tc(x[1]), grupo: '1º' + G + ' · ' + gr, num: x[0], turno: M.turnoMec(d, gr), sub: d.nombre + ' · ' + u.fLarga(d.fecha) })); }));
    E.print.run(X.hojasPas(ed, lista), { title: 'Pasaportes de 1er semestre (' + lista.length + ')', propioLogo: true, margin: '8mm' }); };

  /* ---------- pantalla ---------- */
  V.muestra = () => {
    const d = M.doc(), L = M.listas(), FM = E.formatos, tieneXls = FM && FM.doc();
    let h = card('<h3>🧭 ' + esc(d.nombre) + '</h3><p class="small"><b>' + esc(u.fLarga(d.fecha)) + '</b> · ' + esc(d.bloques[0][0]) + ' a ' + esc(d.bloques[d.bloques.length - 1][1]) + ' · «' + esc(d.lema) + '»</p>' +
      '<p class="muted small">4 grupos de 1º partidos a la mitad (A1 = primera mitad de la lista, A2 = la segunda). Cada bloque es de 50 minutos y a los 25 las mitades cambian de maestro. Un grupo se queda en clase.</p>' +
      '<div class="mu-scroll">' + M.tabla(d) + '</div>' +
      '<div class="row gap wrap mt">' + btn('🖨 Rotación', 'mu-rot', '', 'primary') + btn('🖨 Listas por mitad', 'mu-listas', '', '') + btn('🖨 Pasaportes con nombre', 'mu-pas', '', '') + '<a class="btn ghost" href="muestra-flyer.jpg" target="_blank" rel="noopener">🖼 Flyer</a>' + link('🎪 Expo de Mecatrónica', 'expo', 'ghost') + '</div>');
    h += card('<h3>📋 Listas de 1º</h3>' + (L ? '<p class="small">' + Object.keys(L.g).sort().map(g => { const mm = M.mitades(L.g[g]); return '<b>1º' + g + '</b>: ' + L.g[g].length + ' (' + g + '1: ' + mm[0].length + ' · ' + g + '2: ' + mm[1].length + ')'; }).join(' · ') + '</p><p class="muted small">Leídas el ' + esc(u.fCorta(L.f)) + '. Se guardan solo en tu cuenta.</p>' : '<p class="small">Lee las listas de 1º del Excel de la escuela para imprimir las listas por mitad y los pasaportes con nombre.</p>') +
      '<div class="row gap wrap">' + (tieneXls ? btn('Leer del Excel que ya subiste', 'mu-leer', '', L ? '' : 'primary') : '') + '<label class="btn ' + (tieneXls || L ? '' : 'primary ') + 'filebtn">Subir Excel de listas<input type="file" accept=".xlsx" data-ch="mu-subir" hidden></label></div>');
    h += card('<h3>👩‍🏫 Maestros y lugares</h3>' + d.areas.map((a, i) => '<div class="momento"><b>' + esc(a.largo) + '</b> <span class="small muted">· ' + esc(a.lugar) + '</span><div class="row gap wrap mt">' + a.m.map((m, j) => '<input class="inp" style="max-width:12em" data-ch="mu-m" data-a="' + i + '" data-m="' + j + '" value="' + esc(m) + '" aria-label="Maestro ' + (j + 1) + ' de ' + esc(a.n) + '">').join('') + '</div></div>').join('') +
      '<details class="sub"><summary>Fecha</summary><label class="fld"><span>Día de la muestra</span><input class="inp" type="date" data-ch="mu-f" data-k="fecha" value="' + esc(d.fecha) + '"></label></details>');
    return { t: 'Muestra Profesiográfica', h: h };
  };
})();
