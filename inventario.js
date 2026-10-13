/* Escuadra · Inventario y préstamos del taller (v1.25). Qué hay, dónde está, en qué estado, quién se llevó qué y qué falta
   comprar. Es uno para todos tus grupos. «Lo que piden tus guiones» junta el material de las clases de las próximas
   3 semanas para que lo tengas a tiempo. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const IV = E.inventario = {};
  const K = 'inv';
  IV.doc = () => { const d = S.get(K) || {}; return { items: d.items || [], prestamos: d.prestamos || [], compras: d.compras || [] }; };
  const upd = fn => S.update(K, d => { d.items = d.items || []; d.prestamos = d.prestamos || []; d.compras = d.compras || []; fn(d); }, {});
  const CATS = { medicion: '📏 Medición', herramienta: '🔧 Herramienta', electronica: '🔌 Electrónica', seguridad: '🦺 Seguridad', consumible: '📦 Consumible', computo: '💻 Cómputo', otro: '• Otro' };
  const EST = { ok: ['Bien', 'ok'], danado: ['Dañado', 'bad'], revisar: ['Revisar', 'warn'] };
  const BASE = [['Vernier (calibrador)', 'medicion', 4], ['Multímetro digital', 'medicion', 4], ['Flexómetro', 'medicion', 2], ['Regla metálica 30 cm', 'medicion', 6], ['Fuente de 12 V', 'electronica', 4], ['Protoboard', 'electronica', 8], ['Arduino UNO', 'electronica', 6], ['Servomotor SG90', 'electronica', 12], ['Cautín y base', 'herramienta', 3], ['Pinzas de corte', 'herramienta', 6], ['Pinzas de punta', 'herramienta', 6], ['Desarmadores (juego)', 'herramienta', 4], ['Cúter industrial', 'herramienta', 6], ['Segueta de arco pequeño', 'herramienta', 4], ['Pistola de silicón', 'herramienta', 4], ['Lentes de seguridad', 'seguridad', 30], ['Botiquín', 'seguridad', 1], ['Extintor', 'seguridad', 1], ['Broches latonados', 'consumible', 100], ['Barras de silicón', 'consumible', 40]];
  // material que piden las clases de los próximos días (todos tus grupos activos)
  IV.guion = (dias) => {
    const hoy = u.today(), hasta = u.addDays(hoy, dias || 21), out = [], vistos = {};
    D.gruposActivos().forEach(g => D.parciales().forEach(p => {
      if (p.fin < hoy || p.inicio > hasta) return; let pl = null; try { pl = E.clases.tiene(g, p.id) ? E.clases.plan(g, p.id) : null; } catch (e) { pl = null; } if (!pl) return;
      pl.bloques.forEach(b => { if (b.perdida || b.fecha < hoy || b.fecha > hasta) return; b.parts.forEach(pt => { const it = pt.it; if (!it.mat || pt.antes > 0) return; const k = g.id + '|' + it.id; if (vistos[k]) return; vistos[k] = 1; out.push({ f: b.fecha, g: g, t: it.t, mat: it.mat, lugar: b.lugar }); }); });
    }));
    return out.sort((a, b) => a.f.localeCompare(b.f));
  };
  const nPrest = (d, id) => d.prestamos.filter(x => x.item === id && !x.dev).reduce((s, x) => s + (Number(x.cant) || 1), 0);
  V.inventario = () => {
    const d = IV.doc(), g = D.grupoActual(), al = g ? D.alumnos(g) : [], hoy = u.today(), ui = E.ui.iv = E.ui.iv || { cat: 'herramienta', item: '', aid: '', cant: 1 };
    const bajos = d.items.filter(x => Number(x.min) > 0 && (Number(x.cant) || 0) - nPrest(d, x.id) < Number(x.min)), dan = d.items.filter(x => x.estado === 'danado'), fuera = d.prestamos.filter(x => !x.dev), gu = IV.guion(21);
    let h = card('<h3>🧰 Inventario del taller</h3><div class="en-kpis"><div><b>' + d.items.length + '</b><span>artículos</span></div><div class="' + (fuera.length ? 'warn' : '') + '"><b>' + fuera.length + '</b><span>préstamos sin devolver</span></div><div class="' + (bajos.length ? 'warn' : '') + '"><b>' + bajos.length + '</b><span>abajo del mínimo</span></div><div class="' + (dan.length ? 'warn' : '') + '"><b>' + dan.length + '</b><span>dañados</span></div></div>' +
      (!d.items.length ? '<p class="small">Empieza con lo básico de un taller de mecatrónica (lo ajustas después) o agrega tus artículos abajo.</p>' + btn('＋ Agregar lo básico', 'iv-base', '', 'primary small') : '') + btn('🖨 Imprimir inventario', 'iv-print', '', 'small ghost'));
    // préstamos
    h += card('<h3>🤝 Préstamos</h3>' + (fuera.length ? '<ul class="pc-l">' + fuera.map(x => { const it = d.items.find(y => y.id === x.item) || { n: '¿?' }, dias = u.diffDays(x.f, hoy); return '<li class="' + (dias >= 1 ? 'warn' : 'info') + '"><span class="pc-i">' + (dias >= 1 ? '!' : '↗') + '</span><div><b>' + esc(it.n) + (x.cant > 1 ? ' × ' + x.cant : '') + '</b><small class="muted">' + esc(x.quien) + ' · desde el ' + u.fCorta(x.f) + (dias >= 1 ? ' (' + dias + (dias === 1 ? ' día' : ' días') + ')' : ' · hoy') + '</small></div>' + btn('✓ Devolvió', 'iv-dev', 'data-id="' + x.id + '"', 'small') + '</li>'; }).join('') + '</ul>' : '<p class="small muted">Nada prestado ahora.</p>') +
      (d.items.length ? '<div class="fgrid mt"><label class="fld"><span>Artículo</span><select id="iv-item">' + d.items.map(x => '<option value="' + x.id + '"' + (ui.item === x.id ? ' selected' : '') + '>' + esc(x.n) + ' (' + Math.max(0, (Number(x.cant) || 0) - nPrest(d, x.id)) + ' disp.)</option>').join('') + '</select></label><label class="fld"><span>Cantidad</span><input id="iv-cant" type="number" min="1" value="1"></label></div>' +
        '<label class="fld"><span>¿Quién se lo lleva?</span><select id="iv-quien"><option value="">— Elige —</option>' + al.map(a => '<option value="' + a.id + '">' + a.num + '. ' + esc(a.nombre) + '</option>').join('') + '<option value="_otro">Otro (escribir abajo)</option></select></label><label class="fld"><span>Otro (equipo, docente…)</span><input id="iv-otro" placeholder="Ej. Equipo 3"></label>' + btn('Prestar', 'iv-prestar', '', 'primary small') : ''));
    // lo que piden los guiones
    h += card('<h3>📋 Lo que piden tus guiones (3 semanas)</h3>' + (gu.length ? '<ul class="risk">' + gu.map(x => '<li><span><b>' + u.cap(u.fCorta(x.f)) + '</b> · ' + esc(x.g.nombre) + ' · ' + esc(x.t) + '<br><small class="muted">' + esc(x.mat) + '</small></span>' + btn('＋ Compras', 'iv-comprar', 'data-t="' + esc(x.mat.slice(0, 140)) + '"', 'small ghost') + '</li>').join('') + '</ul>' : '<p class="small muted">Tus próximas clases no piden material especial.</p>'));
    // compras
    const comp = d.compras.filter(x => !x.hecho);
    h += card('<h3>🛒 Por comprar o conseguir</h3>' + (bajos.length ? '<p class="small"><b>Abajo del mínimo:</b> ' + bajos.map(x => esc(x.n) + ' (' + Math.max(0, (Number(x.cant) || 0) - nPrest(d, x.id)) + '/' + x.min + ')').join(' · ') + '</p>' : '') +
      (comp.length ? '<ul class="sg-l">' + comp.map(x => '<li><span>' + esc(x.t) + '</span>' + btn('✓ Listo', 'iv-comp-ok', 'data-id="' + x.id + '"', 'small') + '</li>').join('') + '</ul>' : '') +
      '<div class="row gap wrap"><input class="inp grow" id="iv-comp-t" placeholder="Agregar: ej. 2 paquetes de broches latonados">' + btn('＋', 'iv-comp-add', '', 'small') + '</div>' + (comp.length || bajos.length ? btn('📋 Copiar lista', 'iv-comp-copy', '', 'small ghost') : ''));
    // artículos
    const cats = Object.keys(CATS).filter(c => d.items.some(x => (x.cat || 'otro') === c));
    h += card('<h3>📦 Artículos</h3>' + cats.map(c => '<h4>' + CATS[c] + '</h4><ul class="iv-l">' + d.items.filter(x => (x.cat || 'otro') === c).map(x => { const pr = nPrest(d, x.id), bajo = Number(x.min) > 0 && (Number(x.cant) || 0) - pr < Number(x.min);
      return '<li><div><b>' + esc(x.n) + '</b><small class="muted">' + (x.ubic ? esc(x.ubic) + ' · ' : '') + (pr ? pr + ' prestado' + (pr > 1 ? 's' : '') + ' · ' : '') + 'mínimo ' + (x.min || 0) + (bajo ? ' · <b class="badc">abajo del mínimo</b>' : '') + '</small></div><div class="row gap">' + btn('−', 'iv-cant', 'data-id="' + x.id + '" data-d="-1"', 'small ghost') + '<b class="iv-n">' + (Number(x.cant) || 0) + '</b>' + btn('+', 'iv-cant', 'data-id="' + x.id + '" data-d="1"', 'small') +
        '<select data-ch="iv-est" data-id="' + x.id + '" aria-label="Estado">' + Object.keys(EST).map(k => '<option value="' + k + '"' + ((x.estado || 'ok') === k ? ' selected' : '') + '>' + EST[k][0] + '</option>').join('') + '</select>' + btn('✕', 'iv-del', 'data-id="' + x.id + '"', 'small ghost') + '</div></li>'; }).join('') + '</ul>').join('') +
      '<details class="sub" id="iv-nuevo"' + (d.items.length ? '' : ' open') + '><summary>＋ Agregar artículo</summary><div class="fgrid"><label class="fld"><span>Nombre</span><input id="iv-n" placeholder="Ej. Vernier digital"></label><label class="fld"><span>Categoría</span><select id="iv-cat">' + Object.keys(CATS).map(k => '<option value="' + k + '">' + CATS[k] + '</option>').join('') + '</select></label></div><div class="fgrid c3"><label class="fld"><span>Cantidad</span><input id="iv-c" type="number" min="0" value="1"></label><label class="fld"><span>Mínimo</span><input id="iv-min" type="number" min="0" value="0"></label><label class="fld"><span>Dónde está</span><input id="iv-ubic" placeholder="Ej. Gabinete 2"></label></div>' + btn('Agregar', 'iv-add', '', 'primary small') + '</details>');
    return { t: 'Inventario', h: h };
  };
  const val = id => ((document.getElementById(id) || {}).value || '').trim();
  A['iv-base'] = () => upd(d => { BASE.forEach(b => { if (!d.items.some(x => u.norm(x.n) === u.norm(b[0]))) d.items.push({ id: u.uid('iv'), n: b[0], cat: b[1], cant: b[2], min: Math.max(1, Math.round(b[2] / 4)), ubic: '', estado: 'ok' }); }); });
  A['iv-add'] = () => { const n = val('iv-n'); if (!n) { u.toast('Escribe el nombre', 'err'); return; } upd(d => { d.items.push({ id: u.uid('iv'), n: n, cat: val('iv-cat') || 'otro', cant: Number(val('iv-c')) || 0, min: Number(val('iv-min')) || 0, ubic: val('iv-ubic'), estado: 'ok' }); }); u.toast('Agregado', 'ok'); };
  A['iv-cant'] = el => upd(d => { const x = d.items.find(y => y.id === el.dataset.id); if (x) x.cant = Math.max(0, (Number(x.cant) || 0) + Number(el.dataset.d)); });
  CH['iv-est'] = el => upd(d => { const x = d.items.find(y => y.id === el.dataset.id); if (x) x.estado = el.value; });
  A['iv-del'] = el => { if (!confirm('¿Quitar este artículo del inventario?')) return; upd(d => { d.items = d.items.filter(y => y.id !== el.dataset.id); }); };
  A['iv-prestar'] = () => {
    const g = D.grupoActual(), item = val('iv-item'), q = val('iv-quien'), otro = val('iv-otro'), cant = Math.max(1, Number(val('iv-cant')) || 1);
    const a = q && q !== '_otro' ? D.alumno(g, q) : null, quien = a ? a.num + '. ' + u.corto(a.nombre) + ' (' + g.nombre + ')' : otro;
    if (!item || !quien) { u.toast('Elige el artículo y a quién', 'err'); return; }
    const d = IV.doc(), it = d.items.find(x => x.id === item); if (it && nPrest(d, item) + cant > (Number(it.cant) || 0) && !confirm('No hay tantos disponibles según el inventario. ¿Prestar de todos modos?')) return;
    upd(dd => { dd.prestamos.push({ id: u.uid('pr'), item: item, cant: cant, quien: quien, gid: g ? g.id : '', aid: a ? a.id : '', f: u.today() }); }); E.ui.iv = Object.assign(E.ui.iv || {}, { item: item }); u.toast('Préstamo registrado', 'ok');
  };
  A['iv-dev'] = el => upd(d => { const x = d.prestamos.find(y => y.id === el.dataset.id); if (x) x.dev = u.today(); });
  A['iv-comprar'] = el => { upd(d => { d.compras.push({ id: u.uid('cp'), t: el.dataset.t, hecho: false }); }); u.toast('Agregado a compras', 'ok'); };
  A['iv-comp-add'] = () => { const t = val('iv-comp-t'); if (!t) return; upd(d => { d.compras.push({ id: u.uid('cp'), t: t, hecho: false }); }); };
  A['iv-comp-ok'] = el => upd(d => { const x = d.compras.find(y => y.id === el.dataset.id); if (x) x.hecho = u.today(); });
  A['iv-comp-copy'] = async () => { const d = IV.doc(), b = d.items.filter(x => Number(x.min) > 0 && (Number(x.cant) || 0) - nPrest(d, x.id) < Number(x.min)); const l = ['Por comprar o conseguir (' + u.fCorta(u.today()) + '):'].concat(b.map(x => '• ' + x.n + ': faltan ' + (Number(x.min) - Math.max(0, (Number(x.cant) || 0) - nPrest(d, x.id)))), d.compras.filter(x => !x.hecho).map(x => '• ' + x.t)); const ok = await u.copy(l.join('\n')); u.toast(ok ? 'Lista copiada' : 'No se pudo copiar', ok ? 'ok' : 'err'); };
  A['iv-print'] = () => { const d = IV.doc(), cf = D.cfg(); E.print.run('<div class="pr"><div class="p-title">INVENTARIO DEL TALLER · ' + u.fFecha(u.today()) + '</div><p class="tiny c">' + esc(cf.plantel || '') + ' · Responsable: ' + esc(cf.docente || '') + '</p><table class="grid"><thead><tr><th class="l">ARTÍCULO</th><th>CATEGORÍA</th><th>CANT.</th><th>PRESTADOS</th><th>ESTADO</th><th class="l">UBICACIÓN</th></tr></thead><tbody>' + d.items.map(x => '<tr><td class="nm">' + esc(x.n) + '</td><td class="c">' + esc((CATS[x.cat] || '').replace(/^\S+\s/, '')) + '</td><td class="c">' + (Number(x.cant) || 0) + '</td><td class="c">' + (nPrest(d, x.id) || '') + '</td><td class="c">' + esc((EST[x.estado || 'ok'] || EST.ok)[0]) + '</td><td>' + esc(x.ubic || '') + '</td></tr>').join('') + '</tbody></table></div>', { title: 'Inventario del taller', margin: '10mm' }); };
  // en Inicio («ver todo»): préstamos de más de un día
  IV.inicioHTML = () => { const d = IV.doc(), v = d.prestamos.filter(x => !x.dev && u.diffDays(x.f, u.today()) >= 1); if (!v.length) return ''; return card('<div class="row between gap wrap"><h3>🧰 Préstamos sin devolver</h3>' + link('Inventario', 'inventario', 'small') + '</div><p class="small">' + v.slice(0, 4).map(x => { const it = d.items.find(y => y.id === x.item) || { n: '¿?' }; return esc(it.n) + ' · ' + esc(x.quien); }).join(' · ') + (v.length > 4 ? ' y ' + (v.length - 4) + ' más' : '') + '</p>'); };
})();
