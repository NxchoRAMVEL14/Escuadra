/* Escuadra · "Pegar datos de Claude": importa asistencia, calificaciones, participación y observaciones
   que Claude prepara a partir de tus fotos de listas y exámenes. Empareja alumnos por nombre. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, esc = u.esc;
  const A = E.actions, H = E.h, btn = H.btn, icon = E.icon;
  const PK = E.paquete = {};

  PK.html = abierto => '<details class="sub" ' + (abierto ? 'open' : '') + ' id="pk-det"><summary>' + icon('download') + ' Pegar datos de Claude</summary>' +
    '<p class="muted small">Cuando me mandes la foto de una lista o de un examen calificado, te devuelvo un bloque de texto que empieza con <code>{"escuadra"</code>. Cópialo completo, pégalo aquí y toca <b>Revisar</b>: verás qué se va a cargar antes de aplicarlo.</p>' +
    '<textarea class="inp" id="pk-txt" rows="6" placeholder=\'{"escuadra":1, …}\' spellcheck="false" autocapitalize="off" autocomplete="off"></textarea><div class="mt">' + btn('Revisar', 'pk-revisar', '', 'primary') + '</div></details>';

  /* ---------- lectura y emparejamiento ---------- */
  function leer(txt) {
    txt = String(txt || '').replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
    const i = txt.indexOf('{'), j = txt.lastIndexOf('}'); if (i < 0 || j <= i) throw new Error('No encontré el bloque de datos: debe empezar con { y terminar con }');
    const pk = JSON.parse(txt.slice(i, j + 1));
    if (!pk || !pk.escuadra) throw new Error('Ese texto no es un paquete de Escuadra');
    return pk;
  }
  const tokens = s => u.norm(s).split(' ').filter(Boolean);
  function emparejar(g, pk) {
    const al = D.alumnos(g, true), byN = {}; al.forEach(a => { byN[u.norm(a.nombre)] = a; });
    const lista = (pk.alumnos || []).map(x => Array.isArray(x) ? { num: Number(x[0]), nombre: String(x[1]) } : { num: Number(x.num), nombre: String(x.nombre) });
    const map = {}, sin = [], dudosos = [];
    lista.forEach(x => {
      let a = byN[u.norm(x.nombre)], how = 'exacto';
      if (!a) {
        const tk = tokens(x.nombre); let best = null, bs = 0;
        al.forEach(b => { const tb = tokens(b.nombre); const s = tk.filter(t => tb.indexOf(t) >= 0).length; if (s > bs) { bs = s; best = b; } });
        if (best && (bs >= 3 || (bs >= 2 && best.num === x.num))) { a = best; how = 'parecido'; }
      }
      if (a) { map[x.num] = a.id; if (how !== 'exacto') dudosos.push(x.nombre + ' → ' + a.nombre); } else sin.push(x.num + '. ' + x.nombre);
    });
    return { lista: lista, map: map, sin: sin, dudosos: dudosos };
  }
  const actId = clave => 'act_' + u.norm(clave).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  /* ---------- revisión ---------- */
  PK.esPaquete = txt => /"escuadra"\s*:/.test(String(txt || '').replace(/[“”]/g, '"'));
  A['pk-revisar'] = (el, ev, txtDirecto) => {
    let pk; try { pk = leer(txtDirecto != null ? txtDirecto : (document.getElementById('pk-txt') || {}).value); } catch (e) { u.toast('No pude leerlo: ' + e.message, 'err', 6000); return; }
    const g = D.grupoActual(); if (!g) { u.toast('Primero configura tu grupo', 'err'); return; }
    const vacio = !D.alumnos(g, true).length;
    const m = vacio ? { lista: [], map: {}, sin: [], dudosos: [] } : emparejar(g, pk);
    E.ui.paquete = pk;
    const nAl = (pk.alumnos || []).length;
    let h = '<p class="small">' + esc(pk.titulo || 'Paquete de datos') + (pk.grupo && pk.grupo !== g.id ? ' · <b class="badc">viene para el grupo ' + esc(pk.grupo) + '</b>, se cargará en ' + esc(g.nombre) : ' · ' + esc(g.nombre)) + '</p>';
    if (vacio) h += '<p class="note info">Tu grupo aún no tiene lista: se crearán los <b>' + nAl + '</b> alumnos del paquete.</p>';
    else h += '<p>Alumnos encontrados: <b>' + Object.keys(m.map).length + ' de ' + nAl + '</b></p>' +
      (m.sin.length ? '<p class="note warn">No encontré en tu lista: ' + m.sin.map(esc).join(', ') + '. Sus datos no se cargarán.</p>' : '') +
      (m.dudosos.length ? '<p class="note">Emparejados por parecido: ' + m.dudosos.map(esc).join('; ') + '</p>' : '');
    const li = [];
    (pk.asistencia || []).forEach(x => { const ex = Object.keys(x.excepto || {}).length; li.push('Asistencia del ' + u.fLarga(x.fecha) + ': ' + (ex ? ex + ' con falta, retardo o justificación; los demás presentes' : 'todos presentes') + (S.get('asis:' + g.id + ':' + x.fecha) ? ' <b>(reemplaza la que ya tenías)</b>' : '')); });
    (pk.actividades || []).forEach(x => { const n = Object.keys(x.notas || {}).length; const ya = S.get('act:' + g.id + ':' + actId(x.clave || x.nombre)); li.push((ya ? 'Actualiza' : 'Nueva') + ' actividad "' + esc(x.nombre) + '" (' + (E.CAT_LBL[x.categoria] || x.categoria) + (x.max && Number(x.max) !== 100 ? ', de ' + x.max + ' puntos' : '') + '): ' + n + ' calificaciones'); });
    (pk.participacion || []).forEach(x => li.push('Participación del ' + u.fLarga(x.fecha) + ': ' + Object.keys(x.valores || {}).length + ' alumnos'));
    (pk.observaciones || []).forEach(x => li.push('Observaciones del ' + u.fLarga(x.fecha) + ': ' + Object.keys(x.valores || {}).length + ' alumnos'));
    h += li.length ? '<ul class="vlist">' + li.map(x => '<li>' + x + '</li>').join('') + '</ul>' : '<p class="muted">El paquete no trae datos.</p>';
    h += '<div class="row gap wrap mt">' + btn('Aplicar', 'pk-aplicar', '', 'primary') + btn('Cancelar', 'modal-close') + '</div>';
    E.modal.open('Revisar datos de Claude', h);
  };

  /* ---------- aplicar ---------- */
  A['pk-aplicar'] = () => {
    const pk = E.ui.paquete, g0 = D.grupoActual(); if (!pk || !g0) return;
    if (!D.alumnos(g0, true).length && (pk.alumnos || []).length) {
      S.update('grupo:' + g0.id, gr => { gr.alumnos = (pk.alumnos || []).map(x => { const o = Array.isArray(x) ? { num: x[0], nombre: x[1] } : x; return { id: u.uid('al'), num: Number(o.num), nombre: String(o.nombre).replace(/\s+/g, ' ').trim(), activo: true, notas: '' }; }); });
    }
    const g = D.grupoActual(), m = emparejar(g, pk), ids = D.alumnos(g).map(a => a.id); let n = 0;
    (pk.asistencia || []).forEach(x => {
      const d = {}; ids.forEach(id => { d[id] = x.todos || 'A'; });
      Object.keys(x.excepto || {}).forEach(num => { const id = m.map[num]; if (id) d[id] = String(x.excepto[num]).toUpperCase().charAt(0); });
      S.put('asis:' + g.id + ':' + x.fecha, d); n++;
    });
    (pk.actividades || []).forEach(x => {
      const id = actId(x.clave || x.nombre), k = 'act:' + g.id + ':' + id, cur = S.get(k) || {};
      const cat = x.categoria || 'trabajos';
      const a = Object.assign({ id: id, peso: 1, instrumento: cat === 'trabajos' ? 'LC' : 'Exa', notas: {} }, cur, {
        nombre: x.nombre || cur.nombre, categoria: cat, parcial: x.parcial || cur.parcial || E.calc.parcialActual().id,
        fecha: x.fecha || cur.fecha || u.today(), max: Number(x.max) > 0 ? Number(x.max) : (cur.max || 100), cuenta: cat === 'diagnostico' ? false : (x.cuenta !== false), tema: x.tema || cur.tema || ''
      });
      a.notas = Object.assign({}, cur.notas || {});
      Object.keys(x.notas || {}).forEach(num => { const aid = m.map[num]; if (aid) a.notas[aid] = x.notas[num] === '' || x.notas[num] == null ? '' : Number(x.notas[num]); });
      S.put(k, a); n++;
    });
    (pk.participacion || []).forEach(x => { S.update('part:' + g.id + ':' + x.fecha, d => { Object.keys(x.valores || {}).forEach(num => { const aid = m.map[num]; if (aid) d[aid] = Number(x.valores[num]) || 0; }); }, {}); n++; });
    (pk.observaciones || []).forEach(x => { S.update('obs:' + g.id + ':' + x.fecha, d => { Object.keys(x.valores || {}).forEach(num => { const aid = m.map[num]; if (!aid) return; const l = d[aid] = d[aid] || []; [].concat(x.valores[num]).forEach(id => { if (l.indexOf(id) < 0) l.push(id); }); }); }, {}); n++; });
    E.modal.close(); E.ui.paquete = null; const t = document.getElementById('pk-txt'); if (t) t.value = '';
    u.toast('Listo: ' + n + (n === 1 ? ' bloque cargado' : ' bloques cargados'), 'ok', 4000);
    location.hash = '#/perfiles';
  };
})();
