/* Escuadra · Capturar calificaciones rápido (v1.15): pegar una columna o «nombre calificación» (también de Excel, Google
   Forms y lo que te devuelva Claude a partir de una foto), por equipo, rúbrica de un toque, tarjetas para deslizar
   (libreta, prácticas y cierre), dictado por voz y «seguir donde me quedé». Siempre muestra antes lo que va a cambiar
   y todo se puede deshacer. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const A = E.actions, CH = E.changes, H = E.h, UD = E.undo;
  const btn = H.btn, link = H.link, icon = E.icon;
  const CP = E.cap = {};
  const val = id => ((document.getElementById(id) || {}).value || '').trim();
  const corto = (t, n) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
  const presente = st => ['A', 'R'].indexOf(st || 'A') >= 0;
  const actDe = id => { const g = D.grupoActual(); return g ? S.get('act:' + g.id + ':' + id) : null; };

  /* =================== reconocer alumnos por nombre (con errores de dedo) =================== */
  const STOP = ['DE', 'DEL', 'LA', 'LAS', 'LOS', 'Y', 'EL'];
  const toks = s => u.norm(s).replace(/[^A-Z0-9 ]/g, ' ').split(' ').filter(t => t.length >= 2 && STOP.indexOf(t) < 0 && !/^\d+$/.test(t));
  const lev = (a, b) => {
    if (Math.abs(a.length - b.length) > 2) return 9; let p = []; for (let j = 0; j <= b.length; j++) p[j] = j;
    for (let i = 1; i <= a.length; i++) { const c = [i]; for (let j = 1; j <= b.length; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; }
    return p[b.length];
  };
  const punt = (q, a) => {
    const nt = toks(a.nombre); let s = 0, hit = 0;
    q.forEach(t => { let b = 0; nt.forEach(x => { let v = 0; if (x === t) v = 2; else if (t.length >= 3 && x.indexOf(t) === 0) v = 1.5; else if (t.length >= 4 && lev(t, x) <= (t.length >= 7 ? 2 : 1)) v = 1.2; if (v > b) b = v; }); if (b) hit++; s += b; });
    return { s: s, hit: hit };
  };
  // el alumno que mejor coincide; null si nadie o si hay empate (cand trae los parecidos)
  CP.alumno = (al, texto) => {
    const q = toks(texto); if (!q.length) return { a: null, cand: [], s: 0 };
    const sc = al.map(a => ({ a: a, r: punt(q, a) })).filter(x => x.r.s > 0).sort((x, y) => y.r.s - x.r.s || y.r.hit - x.r.hit);
    if (!sc.length) return { a: null, cand: [], s: 0 };
    const b = sc[0], s2 = sc[1], ok = b.r.s >= 1.2 && (!s2 || b.r.s - s2.r.s >= 0.5);
    return { a: ok ? b.a : null, cand: sc.slice(0, 5).map(x => x.a), s: b.r.s };
  };
  CP.parecido = (a, texto) => { const q = toks(texto); return q.length ? punt(q, a).s : null; };

  /* =================== pegar calificaciones =================== */
  const NUM = '(\\d+(?:[.,]\\d+)?)', RX_FR = new RegExp(NUM + '\\s*\\/\\s*' + NUM);
  const nnum = s => Number(String(s).replace(',', '.'));
  // quita correos, fechas y horas (Google Forms) para que no se confundan con calificaciones
  const limpia = s => String(s).replace(/\S+@\S+/g, ' ').replace(/\b\d{1,4}[\/-]\d{1,2}[\/-]\d{2,4}\b(\s+\d{1,2}:\d{2}(:\d{2})?(\s*[ap]\.?\s*m\.?)?)?/gi, ' ').replace(/\b\d{1,2}:\d{2}(:\d{2})?\b/g, ' ').replace(/\s+/g, ' ').trim();
  const valor = (s, mx) => {
    s = String(s || '').trim(); if (!s) return {};
    if (/^\?+$|ilegible|no se lee/i.test(s)) return { ileg: true };
    if (/^(NE|N\/E|N\.E\.?|-|—|SC|S\/C|no entreg[oó])$/i.test(s)) return { ne: true };
    const fr = s.match(RX_FR); if (fr) { const y = nnum(fr[2]); return y > 0 ? { v: u.round(nnum(fr[1]) / y * mx, 1) } : {}; }
    const m = s.match(/^(-?\d+(?:[.,]\d+)?)\s*%?$/); return m ? { v: u.round(nnum(m[1]), 1) } : {};
  };
  function linea(raw, mx) {
    const t0 = limpia(raw); if (!t0) return { vacia: true };
    const ps = t0.split('|').map(x => x.trim());
    if (ps.length >= 3) { const n = parseInt(ps[0], 10); return Object.assign({ num: isNaN(n) ? null : n, nom: ps.slice(1, -1).join(' ').trim() }, valor(ps[ps.length - 1], mx)); }
    let t = ps.join(' ').replace(/\s+/g, ' ').trim(), v = {};
    const fr = t.match(RX_FR);
    if (fr) { v = valor(fr[0], mx); t = t.replace(fr[0], ' '); }
    else {
      const m = t.match(/(-?\d+(?:[.,]\d+)?)\s*%?\s*$/);
      if (m) { v = { v: u.round(nnum(m[1]), 1) }; t = t.slice(0, m.index); }
      else { const ne = t.match(/(?:^|\s)(NE|N\/E|\?+)\s*$/i); if (ne) { v = /\?/.test(ne[1]) ? { ileg: true } : { ne: true }; t = t.slice(0, ne.index); } }
    }
    t = t.replace(/[;,:|\-–]+\s*$/, '').trim();
    let num = null; const mn = t.match(/^(\d{1,3})(?:[.)\-:]+\s*|\s+|$)/);
    if (mn) { num = Number(mn[1]); t = t.slice(mn[0].length).trim(); }
    const nom = /[A-Za-zÁÉÍÓÚÑáéíóúñÜü]/.test(t) ? t : '';
    return Object.assign({ num: num, nom: nom, soloValor: num == null && !nom }, v);
  }
  CP.parsea = (txt, a, al) => {
    const mx = C.maxPts(a); const L = String(txt || '').replace(/\r/g, '').split('\n');
    while (L.length && !L[L.length - 1].trim()) L.pop(); while (L.length && !L[0].trim()) L.shift();
    const P = L.map(r => Object.assign({ txt: r.trim() }, linea(r, mx))), llenas = P.filter(p => !p.vacia);
    const posicional = llenas.length > 0 && llenas.every(p => p.soloValor && (p.v != null || p.ne || p.ileg));
    const rows = [];
    P.forEach((p, i) => {
      if (p.vacia) { if (posicional) rows.push({ i: i, txt: '', aid: al[i] ? al[i].id : null, v: null, nota: 'renglón vacío', pos: true }); return; }
      const r = { i: i, txt: p.txt, v: p.v == null ? null : p.v, aid: null, nota: '', cand: [] };
      // renglones sin ninguna calificación (encabezados, comentarios): no se buscan
      if (!posicional && r.v == null && !p.ne && !p.ileg) { r.ign = true; r.nota = 'sin calificación: se ignora'; rows.push(r); return; }
      if (posicional) { r.aid = al[i] ? al[i].id : null; r.pos = true; if (!al[i]) r.nota = 'sobra: hay más renglones que alumnos'; }
      else if (p.num != null && !p.nom) { const x = al.find(y => y.num === p.num); r.aid = x ? x.id : null; if (!x) r.nota = 'No hay alumno con el número ' + p.num; }
      else if (p.num != null) {
        const x = al.find(y => y.num === p.num), b = CP.alumno(al, p.nom);
        if (x) { r.aid = x.id; const s = CP.parecido(x, p.nom); if (s != null && s < 1.2) { if (b.a && b.a.id !== x.id && b.s >= 2) { r.aid = b.a.id; r.nota = 'El número ' + p.num + ' es de otro alumno: usé el nombre'; } else r.nota = 'Revisa: el nombre no se parece al del número ' + p.num; } }
        else { r.aid = b.a ? b.a.id : null; r.cand = b.cand.map(c => c.id); if (!b.a) r.nota = 'No lo encontré: elige'; }
      } else if (p.nom) { const b = CP.alumno(al, p.nom); r.aid = b.a ? b.a.id : null; r.cand = b.cand.map(c => c.id); if (!b.a) r.nota = b.cand.length > 1 ? 'Hay varios parecidos: elige' : 'No lo encontré: elige'; }
      if (p.ileg) r.nota = 'No se leyó la calificación: escríbela a mano'; if (p.ne) r.nota = 'NE: se queda vacío';
      rows.push(r);
    });
    return { rows: rows, posicional: posicional };
  };
  const dups = rows => { const c = {}, last = {}; rows.forEach(r => { if (r.aid && r.v != null) { c[r.aid] = (c[r.aid] || 0) + 1; last[r.aid] = r.i; } }); return { c: c, last: last }; };
  const estado = (r, a, mx, d) => {
    if (r.ign && !r.aid) return ['', ''];
    if (!r.aid) return r.txt ? ['sin alumno', 'warn'] : ['', ''];
    if (r.v == null) return ['sin calificación', ''];
    if (r.v < 0 || r.v > mx) return ['fuera de 0 a ' + mx, 'bad'];
    if (d.c[r.aid] > 1 && d.last[r.aid] !== r.i) return ['repetido: vale el último', 'warn'];
    const cur = a.notas && a.notas[r.aid];
    if (cur === '' || cur == null) return ['nueva', 'ok'];
    if (Math.abs(Number(cur) - r.v) < 0.001) return ['igual', ''];
    return ['cambia ' + cur + ' → ' + r.v, 'info'];
  };
  const aplica = (r, a, mx, d, sobre) => { const e = estado(r, a, mx, d)[0]; return e === 'nueva' || (/^cambia/.test(e) && sobre); };
  function pgPrev() {
    const st = E.ui.pg, a = actDe(st.id), g = D.grupoActual(); if (!a) return '';
    const al = D.alumnos(g), mx = C.maxPts(a), d = dups(st.rows), cnt = { nueva: 0, cambia: 0, sin: 0 };
    st.rows.forEach(r => { const e = estado(r, a, mx, d)[0]; if (e === 'nueva') cnt.nueva++; else if (/^cambia/.test(e)) cnt.cambia++; else if (e === 'sin alumno') cnt.sin++; });
    const n = cnt.nueva + (st.sobre ? cnt.cambia : 0);
    const op = (x, sel) => '<option value="' + x.id + '"' + (x.id === sel ? ' selected' : '') + '>' + x.num + '. ' + esc(x.nombre) + '</option>';
    // si hay varios parecidos, van primero
    const opts = (sel, cand) => '<option value="">— nadie —</option>' + (!sel && cand && cand.length > 1 ? '<optgroup label="Parecidos">' + cand.map(id => al.find(x => x.id === id)).filter(Boolean).map(x => op(x, sel)).join('') + '</optgroup><optgroup label="Todos">' + al.map(x => op(x, sel)).join('') + '</optgroup>' : al.map(x => op(x, sel)).join(''));
    return (st.posicional ? '<p class="note info small">Pegaste solo calificaciones: van en orden de lista (renglón 1 = número 1).' + (st.rows.length !== al.length ? ' Pegaste ' + st.rows.length + ' renglones y tienes ' + al.length + ' alumnos: revisa que no falte ni sobre ninguno.' : '') + '</p>' : '') +
      '<p class="small"><b>' + cnt.nueva + '</b> nuevas · <b>' + cnt.cambia + '</b> cambian una que ya tenía' + (cnt.sin ? ' · <b>' + cnt.sin + '</b> sin alumno (elígelo en la lista)' : '') + '</p>' +
      (cnt.cambia ? '<label class="switch"><input type="checkbox" data-ch="cap-pg-sobre"' + (st.sobre ? ' checked' : '') + '><span>Reemplazar las ' + cnt.cambia + ' que ya tenían calificación</span></label>' : '') +
      '<ul class="pg-l">' + st.rows.map((r, i) => { const e = estado(r, a, mx, d);
        if (r.ign && !r.aid) return '<li class="no"><div class="pg-t">' + esc(r.txt.replace(/\t/g, ' · ')) + '</div><small class="muted">Sin calificación: se ignora</small></li>';
        return '<li class="' + (aplica(r, a, mx, d, st.sobre) ? 'si' : 'no') + '"><div class="pg-t">' + (r.txt ? esc(r.txt.replace(/\t/g, ' · ')) : '<i>(renglón vacío)</i>') + '</div><div class="pg-x"><select data-ch="cap-pg-al" data-i="' + i + '" aria-label="Alumno del renglón ' + (i + 1) + '">' + opts(r.aid, r.cand) + '</select><b class="pg-v">' + (r.v == null ? '—' : r.v) + '</b>' + (e[0] ? '<span class="chip ' + e[1] + '">' + esc(e[0]) + '</span>' : '') + '</div>' + (r.nota ? '<small class="muted">' + esc(r.nota) + '</small>' : '') + '</li>'; }).join('') + '</ul>' +
      '<div class="row gap wrap mt">' + btn('✓ Aplicar ' + n + (n === 1 ? ' calificación' : ' calificaciones'), 'cap-pg-ok', n ? '' : 'disabled', 'primary') + btn('‹ Corregir lo pegado', 'cap-pegar', 'data-id="' + st.id + '" data-back="1"', 'ghost') + '</div>';
  }
  A['cap-pegar'] = el => {
    const id = el.dataset.id, a = actDe(id); if (!a) return;
    const prev = el.dataset.back && E.ui.pg && E.ui.pg.id === id ? E.ui.pg.txt : '';
    E.ui.pg = { id: id, txt: prev, sobre: true, rows: [] };
    E.modal.open('📋 Pegar calificaciones', '<p class="muted small">Pega desde Excel, Google Forms, WhatsApp o lo que te devuelva Claude. Sirve cualquiera de estas formas:</p><ul class="small pg-ej"><li>Una columna solo con calificaciones, en orden de lista.</li><li>Nombre y calificación: <code>Pérez 85</code> (aunque tenga errores de dedo o solo el apellido).</li><li>Número de lista y calificación: <code>12 85</code> o <code>12 | Pérez Ruiz | 85</code>.</li><li>Puntuación de Google Forms: <code>17 / 20</code> se convierte a ' + C.maxPts(a) + '.</li></ul>' +
      '<textarea class="inp" id="pg-txt" rows="8" placeholder="Pega aquí…">' + esc(prev) + '</textarea><div class="row gap wrap mt">' + btn('Revisar', 'cap-pg-rev', '', 'primary') + '</div><p class="muted small">Antes de guardar te muestro qué cambia; después también puedes deshacer.</p>');
    setTimeout(() => { const t = document.getElementById('pg-txt'); if (t) t.focus(); }, 30);
  };
  A['cap-pg-rev'] = () => {
    const st = E.ui.pg, a = actDe(st.id); if (!a) return; st.txt = (document.getElementById('pg-txt') || {}).value || '';
    if (!st.txt.trim()) { u.toast('Pega algo primero', 'err'); return; }
    const r = CP.parsea(st.txt, a, D.alumnos(D.grupoActual())); st.rows = r.rows; st.posicional = r.posicional; E.modal.body(pgPrev());
  };
  CH['cap-pg-al'] = el => { const r = E.ui.pg.rows[Number(el.dataset.i)]; if (r) { r.aid = el.value || null; r.nota = ''; } E.modal.body(pgPrev()); };
  CH['cap-pg-sobre'] = el => { E.ui.pg.sobre = el.checked; E.modal.body(pgPrev()); };
  A['cap-pg-ok'] = () => {
    const st = E.ui.pg, g = D.grupoActual(), k = 'act:' + g.id + ':' + st.id, a = S.get(k); if (!a) return;
    const mx = C.maxPts(a), d = dups(st.rows), set = {}; st.rows.forEach(r => { if (aplica(r, a, mx, d, st.sobre)) set[r.aid] = r.v; });
    const n = Object.keys(set).length; if (!n) return;
    S.update(k, x => { x.notas = x.notas || {}; Object.keys(set).forEach(aid => { x.notas[aid] = set[aid]; }); });
    E.modal.close(); u.toast(n + (n === 1 ? ' calificación aplicada' : ' calificaciones aplicadas') + ' · ↶ Deshacer si algo salió mal', 'ok', 4000);
  };

  /* =================== capturar con Claude (foto → texto) =================== */
  CP.prompt = (g, a, nombres) => {
    const al = D.alumnos(g), mx = C.maxPts(a);
    return 'Te paso una foto con las calificaciones de «' + a.nombre + '» de mi grupo ' + g.nombre + ' (escala de 0 a ' + mx + ').\n' +
      'Lee la calificación de cada alumno y respóndeme SOLO con renglones en este formato, sin texto antes ni después y sin tabla:\n' +
      (nombres ? 'número | nombre | calificación\n' : 'número | calificación\n') + 'Reglas:\n' +
      (nombres ? '- Usa el número y el nombre como vienen en la lista de abajo (elige el más parecido aunque en la foto esté abreviado, con apodo o con faltas de ortografía).\n' : '- Usa el número de lista que aparece en la foto.\n') +
      '- Si la calificación viene como fracción (por ejemplo 17/20) o en otra escala, conviértela a la escala de 0 a ' + mx + '.\n' +
      '- Si no alcanzas a leer una calificación, escribe ? en su lugar. Si un alumno no aparece en la foto, no lo pongas.\n- No inventes calificaciones.\n' +
      (nombres ? '\nLista del grupo:\n' + al.map(x => x.num + ' | ' + x.nombre).join('\n') + '\n' : '');
  };
  const clHTML = a => '<ol class="steps small"><li>Toma una foto clara de tu lista o registro con las calificaciones de «' + esc(a.nombre) + '».</li><li>Copia las instrucciones y pégalas en Claude junto con la foto.<div class="mt">' + btn(icon('copy') + ' Copiar instrucciones', 'cap-claude-copy', '', 'primary') + '</div></li>' +
    '<li>Copia lo que te responda (renglones <code>número | nombre | calificación</code>) y pégalo aquí: ' + btn(icon('clip') + ' Pegar respuesta', 'cap-pegar', 'data-id="' + a.id + '"', 'small') + '</li></ol>' +
    '<label class="switch"><input type="checkbox" data-ch="cap-claude-nom"' + (E.ui.cl.nombres ? ' checked' : '') + '><span>Incluir los nombres de la lista en las instrucciones (ayuda a leer nombres escritos a mano)</span></label>' +
    '<p class="muted small">Solo van número de lista y nombre, nada más. Sin nombres, Claude responde <code>número | calificación</code>: úsalo si tu hoja trae el número de lista.</p>';
  A['cap-claude'] = el => { const a = actDe(el.dataset.id); if (!a) return; E.ui.cl = { id: a.id, nombres: E.ui.cl ? E.ui.cl.nombres !== false : true }; E.modal.open('📷 Capturar con Claude', clHTML(a)); };
  CH['cap-claude-nom'] = el => { E.ui.cl.nombres = el.checked; };
  A['cap-claude-copy'] = async () => { const g = D.grupoActual(), a = actDe(E.ui.cl.id); if (!a) return; const ok = await u.copy(CP.prompt(g, a, E.ui.cl.nombres)); u.toast(ok ? 'Copiadas: pégalas en Claude con la foto' : 'No se pudo copiar', ok ? 'ok' : 'err', 3500); };

  /* =================== rúbricas de un toque =================== */
  E.RUBRICAS = {
    cartel: { n: 'Cartel o mapa', crit: ['Contenido correcto y completo', 'Usa los términos técnicos del tema', 'Dibujos o esquemas con el nombre de sus partes', 'Organizado y fácil de leer', 'Limpieza y ortografía'] },
    plano: { n: 'Plano o modelo', crit: ['Vistas y escala correctas', 'Cotas completas y legibles', 'Medidas que coinciden con la pieza', 'Croquis restringido y modelo sin errores', 'Cuadro de datos, nombre del archivo y orden'] },
    expo: { n: 'Exposición o defensa', crit: ['Explica cómo funciona con términos técnicos', 'Responde preguntas con seguridad', 'Demuestra el funcionamiento o usa apoyo visual', 'Organización y tiempo', 'Todos participan'] },
    prototipo: { n: 'Prototipo o mecanismo', crit: ['Funciona como se diseñó', 'Medidas y ensamble correctos', 'Solidez y acabado', 'Uso seguro de herramientas y material', 'Ajustes registrados en la bitácora'] },
    bitacora: { n: 'Bitácora técnica', crit: ['Registro con fecha de cada sesión', 'Problemas encontrados y cómo los resolvieron', 'Dibujos, medidas o cálculos', 'Reparto de tareas del equipo', 'Orden, limpieza y conclusiones'] },
    reporte: { n: 'Reporte de práctica', crit: ['Objetivo y material', 'Procedimiento con dibujos o esquemas', 'Datos y cálculos correctos, con unidades', 'Conclusiones con sus palabras', 'Orden y limpieza'] }
  };
  const NIV = [['E', 'Excelente'], ['B', 'Bien'], ['S', 'Suficiente'], ['I', 'Insuficiente']];
  CP.NIV = NIV;
  CP.rubs = () => { const d = (S.get('rubricas') || {}).tpl || {}, out = {}; Object.keys(E.RUBRICAS).forEach(k => { out[k] = Object.assign({}, E.RUBRICAS[k], d[k] || {}); }); Object.keys(d).forEach(k => { if (!out[k] && d[k] && (d[k].crit || []).length) out[k] = d[k]; }); return out; };
  CP.niv = () => { const v = (S.get('rubricas') || {}).niv; return Array.isArray(v) && v.length === 4 ? v.map(Number) : [100, 85, 70, 50]; };
  const nivDe = a => (a && a.rub && Array.isArray(a.rub.niv) && a.rub.niv.length === 4 ? a.rub.niv.map(Number) : CP.niv());
  const ptsNiv = (a, i) => u.round(nivDe(a)[i] * C.maxPts(a) / 100, 1);
  CP.rubRow = (a, x) => {
    const v = a.notas && a.notas[x.id], cr = a.rub.cr && a.rub.cr[x.id];
    const on = i => v !== '' && v != null && Math.abs(Number(v) - ptsNiv(a, i)) < 0.06;
    return '<span class="rubn">' + NIV.map((n, i) => '<button type="button" class="rb' + (!cr && on(i) ? ' on' : '') + '" data-act="cap-niv" data-id="' + a.id + '" data-aid="' + x.id + '" data-v="' + i + '" title="' + n[1] + ' (' + ptsNiv(a, i) + ')" aria-label="' + n[1] + ' para ' + esc(x.nombre) + '">' + n[0] + '</button>').join('') +
      '<button type="button" class="rb crit' + (cr ? ' on' : '') + '" data-act="cap-crit" data-id="' + a.id + '" data-aid="' + x.id + '" title="Por criterio" aria-label="Calificar por criterio a ' + esc(x.nombre) + '">≡</button></span>';
  };
  const rubInfo = a => '<details class="sub rub-info" data-sec="rub-info"><summary>🧾 ' + esc(a.rub.n) + ': toca ' + NIV.map((n, i) => n[0] + ' ' + ptsNiv(a, i)).join(' · ') + '</summary><ol class="small">' + a.rub.crit.map(c => '<li>' + esc(c) + '</li>').join('') + '</ol><p class="muted small">Con ≡ calificas criterio por criterio; la calificación es el promedio de los niveles.</p></details>';
  A['cap-niv'] = el => {
    const g = D.grupoActual(), k = 'act:' + g.id + ':' + el.dataset.id, i = Number(el.dataset.v);
    S.update(k, a => { a.notas = a.notas || {}; a.notas[el.dataset.aid] = ptsNiv(a, i); if (a.rub && a.rub.cr) delete a.rub.cr[el.dataset.aid]; });
    if (navigator.vibrate) navigator.vibrate(8);
  };
  function rubPick(a) {
    const T = CP.rubs(), nv = CP.niv(), mx = C.maxPts(a);
    return '<p class="muted small">Elige la rúbrica de «' + esc(a.nombre) + '». Junto a cada alumno aparecen <b>E · B · S · I</b>: un toque pone Excelente ' + nv[0] + ', Bien ' + nv[1] + ', Suficiente ' + nv[2] + ' o Insuficiente ' + nv[3] + (mx !== 100 ? ' (convertido a ' + mx + ' puntos)' : '') + '. Con ≡ calificas criterio por criterio.</p>' +
      '<div class="rub-tpls">' + Object.keys(T).map(k => '<button type="button" class="rub-tpl' + (a.rub && a.rub.tpl === k ? ' on' : '') + '" data-act="cap-rub-usar" data-t="' + k + '"><b>' + esc(T[k].n) + '</b><small>' + esc(T[k].crit.join(' · ')) + '</small></button>').join('') + '</div>' +
      '<div class="row gap wrap mt">' + (a.rub ? btn('Quitar la rúbrica', 'cap-rub-quitar', '', 'small ghost danger') : '') + btn('✏️ Editar plantillas', 'rub-edit', a.rub ? 'data-t="' + a.rub.tpl + '"' : '', 'small ghost') + btn('🖨 Imprimir', 'rub-print', 'data-t="' + (a.rub ? a.rub.tpl : 'cartel') + '"', 'small ghost') + '</div>';
  }
  A['cap-rub'] = el => { const a = actDe(el.dataset.id); if (!a) return; E.ui.rubAct = a.id; E.modal.open('🧾 Rúbrica de un toque', rubPick(a)); };
  A['cap-rub-usar'] = el => {
    const g = D.grupoActual(), T = CP.rubs()[el.dataset.t]; if (!T) return;
    S.update('act:' + g.id + ':' + E.ui.rubAct, a => { a.rub = { tpl: el.dataset.t, n: T.n, crit: T.crit.slice(), niv: CP.niv() }; a.instrumento = 'R'; });
    E.modal.close(); u.toast('Rúbrica «' + T.n + '»: toca E · B · S · I junto a cada alumno', 'ok', 3500);
  };
  A['cap-rub-quitar'] = () => { const g = D.grupoActual(); S.update('act:' + g.id + ':' + E.ui.rubAct, a => { delete a.rub; }); E.modal.close(); };
  // por criterio
  const calcCrit = (a, sel) => { const nv = nivDe(a), vs = (sel || []).filter(v => v != null); if (!vs.length) return null; return u.round(vs.reduce((s, v) => s + nv[v], 0) / vs.length * C.maxPts(a) / 100, 1); };
  function critHTML() {
    const st = E.ui.cr, a = actDe(st.id), g = D.grupoActual(), x = g && D.alumno(g, st.aid); if (!a || !x || !a.rub) return '<p>No encontré la rúbrica.</p>';
    const vv = calcCrit(a, st.sel), mx = C.maxPts(a), n = st.sel.filter(v => v != null).length;
    return '<p><b>' + x.num + '. ' + esc(x.nombre) + '</b><br><span class="muted small">' + esc(a.rub.n) + '</span></p><table class="crit-t"><tbody>' + a.rub.crit.map((c, ci) => '<tr><td>' + esc(c) + '</td><td><span class="rubn">' + NIV.map((nn, i) => '<button type="button" class="rb' + (st.sel[ci] === i ? ' on' : '') + '" data-act="cap-crit-niv" data-c="' + ci + '" data-v="' + i + '" title="' + nn[1] + '">' + nn[0] + '</button>').join('') + '</span></td></tr>').join('') + '</tbody></table>' +
      '<p class="small mt">Calificación: <b>' + (vv == null ? '—' : vv + (mx !== 100 ? ' de ' + mx : '')) + '</b>' + (vv != null && n < a.rub.crit.length ? ' <span class="muted">(con ' + n + ' de ' + a.rub.crit.length + ' criterios)</span>' : '') + '</p>' +
      '<div class="row gap wrap">' + btn('Guardar', 'cap-crit-ok', '', 'primary') + btn('Guardar y siguiente ›', 'cap-crit-ok', 'data-sig="1"') + '</div>';
  }
  A['cap-crit'] = el => { const a = actDe(el.dataset.id); if (!a || !a.rub) return; E.ui.cr = { id: a.id, aid: el.dataset.aid, sel: (((a.rub.cr || {})[el.dataset.aid]) || []).slice() }; E.modal.open('🧾 Por criterio', critHTML()); };
  A['cap-crit-niv'] = el => { E.ui.cr.sel[Number(el.dataset.c)] = Number(el.dataset.v); E.modal.body(critHTML()); };
  A['cap-crit-ok'] = el => {
    const st = E.ui.cr, g = D.grupoActual(), k = 'act:' + g.id + ':' + st.id, a = S.get(k); if (!a) return;
    const vv = calcCrit(a, st.sel); if (vv == null) { u.toast('Marca al menos un criterio', 'err'); return; }
    const sel = a.rub.crit.map((c, i) => st.sel[i] == null ? null : st.sel[i]);
    S.update(k, x => { x.notas = x.notas || {}; x.notas[st.aid] = vv; x.rub = x.rub || {}; x.rub.cr = x.rub.cr || {}; x.rub.cr[st.aid] = sel; });
    if (el.dataset.sig) { const al = D.alumnos(g), i = al.findIndex(y => y.id === st.aid), nx = al[i + 1]; if (nx) { const a2 = S.get(k); E.ui.cr = { id: st.id, aid: nx.id, sel: (((a2.rub.cr || {})[nx.id]) || []).slice() }; E.modal.body(critHTML()); return; } }
    E.modal.close();
  };
  // editar plantillas
  function rbeHTML() {
    const T = CP.rubs(), t = T[E.ui.rbe.t] ? E.ui.rbe.t : 'cartel', x = T[t], nv = CP.niv();
    return '<div class="filters">' + Object.keys(T).map(k => '<button type="button" class="tab' + (k === t ? ' on' : '') + '" data-act="rub-tab" data-t="' + k + '">' + esc(T[k].n) + '</button>').join('') + '</div>' +
      '<label class="fld"><span>Nombre</span><input class="inp" id="rb-n" value="' + esc(x.n) + '"></label><label class="fld"><span>Criterios (uno por renglón)</span><textarea class="inp" id="rb-c" rows="6">' + esc(x.crit.join('\n')) + '</textarea></label>' +
      '<div class="fgrid c4">' + NIV.map((n, i) => '<label class="fld"><span>' + n[1] + '</span><input type="number" class="inp" id="rb-v' + i + '" min="0" max="100" inputmode="numeric" value="' + nv[i] + '"></label>').join('') + '</div><p class="muted small">Los valores de los niveles (base 100) son para todas las rúbricas; las actividades que ya tienen rúbrica conservan la suya.</p>' +
      '<div class="row gap wrap">' + btn('Guardar', 'rub-save', '', 'primary') + btn('Restaurar la original', 'rub-reset', '', 'small ghost') + btn('🖨 Imprimir', 'rub-print', 'data-t="' + t + '"', 'small ghost') + '</div>';
  }
  A['rub-edit'] = el => { E.ui.rbe = { t: (el && el.dataset && el.dataset.t) || (E.ui.rbe && E.ui.rbe.t) || 'cartel' }; E.modal.open('✏️ Plantillas de rúbrica', rbeHTML()); };
  A['rub-tab'] = el => { E.ui.rbe.t = el.dataset.t; E.modal.body(rbeHTML()); };
  A['rub-save'] = () => {
    const t = E.ui.rbe.t, crit = ((document.getElementById('rb-c') || {}).value || '').split('\n').map(s => s.trim()).filter(Boolean), nv = [0, 1, 2, 3].map(i => Math.max(0, Math.min(100, Number(val('rb-v' + i)) || 0)));
    if (!crit.length) { u.toast('Escribe al menos un criterio', 'err'); return; }
    S.update('rubricas', d => { d.tpl = d.tpl || {}; d.tpl[t] = { n: val('rb-n') || CP.rubs()[t].n, crit: crit }; d.niv = nv; }, {});
    u.toast('Plantilla guardada', 'ok'); E.modal.body(rbeHTML());
  };
  A['rub-reset'] = () => { const t = E.ui.rbe.t; S.update('rubricas', d => { if (d.tpl) delete d.tpl[t]; }, {}); E.modal.body(rbeHTML()); };
  A['rub-print'] = el => {
    const T = CP.rubs()[el.dataset.t] || CP.rubs().cartel, nv = CP.niv(), g = D.grupoActual(), cf = D.cfg();
    const DESC = ['Completo, correcto y por su cuenta.', 'Correcto, con detalles menores.', 'En parte o con errores que corrige con apoyo.', 'No lo hace o tiene errores graves.'];
    E.print.run('<div class="pr rub-pr"><div class="p-title">RÚBRICA · ' + esc(T.n.toUpperCase()) + '</div><p class="tiny c">' + esc(cf.plantelNombre || cf.plantel || '') + (g ? ' · Grupo ' + esc(g.nombre) : '') + ' · Docente: ' + esc(cf.docente) + '</p>' +
      '<table class="grid"><tr><td><b>Nombre o equipo:</b> ______________________________________________ <b>Fecha:</b> ____________</td></tr></table><br>' +
      '<table class="grid"><thead><tr><th class="l" style="width:28%">Criterio</th>' + NIV.map((n, i) => '<th>' + n[1] + ' (' + nv[i] + ')</th>').join('') + '</tr></thead><tbody>' + T.crit.map(c => '<tr><td><b>' + esc(c) + '</b></td>' + DESC.map(d => '<td class="tiny">☐ ' + d + '</td>').join('') + '</tr>').join('') + '</tbody></table>' +
      '<p class="tiny">Calificación = promedio de los niveles marcados. Total: ________</p><p class="tiny"><b>Retroalimentación:</b></p><div class="box"></div></div>', { title: 'Rúbrica ' + T.n, margin: '10mm' });
  };

  /* =================== calificar por equipo =================== */
  CP.equipos = (g, pid) => {
    if (!E.proyecto) return []; let eqs = (E.proyecto.doc(g, pid).equipos || []).filter(e => (e.al || []).length);
    if (!eqs.length) { const otro = E.proyecto.parciales(g).find(p => p.id !== pid && (E.proyecto.doc(g, p.id).equipos || []).length); if (otro) eqs = E.proyecto.doc(g, otro.id).equipos.filter(e => (e.al || []).length); }
    return eqs;
  };
  function eqHTML(g, a, eqs) {
    const mx = C.maxPts(a), asis = a.fecha ? S.get('asis:' + g.id + ':' + a.fecha) : null;
    return '<p class="muted small">Una calificación por equipo (de 0 a ' + mx + ') o toca un nivel: se le pone a cada integrante. Luego ajustas a quien haga falta en la lista.</p><div class="eq-l">' +
      eqs.map((e, i) => { const mi = e.al.map(id => D.alumno(g, id)).filter(Boolean); return '<div class="eq-r"><div class="eq-n"><b>' + esc(e.nombre) + '</b><small>' + mi.map(x => esc(u.corto(x.nombre))).join(', ') + '</small></div><div class="eq-v"><input type="number" class="score" id="eqv-' + i + '" min="0" max="' + mx + '" step="any" inputmode="decimal" placeholder="—" aria-label="Calificación de ' + esc(e.nombre) + '"><span class="rubn">' + NIV.map((n, j) => '<button type="button" class="rb" data-act="cap-eq-niv" data-i="' + i + '" data-v="' + j + '" title="' + n[1] + ' (' + ptsNiv(a, j) + ')">' + n[0] + '</button>').join('') + '</span></div></div>'; }).join('') + '</div>' +
      (asis ? '<label class="switch mt"><input type="checkbox" id="eq-pres" checked><span>No ponerle a quien faltó el ' + u.fCorta(a.fecha) + '</span></label>' : '') +
      '<label class="switch"><input type="checkbox" id="eq-sobre" checked><span>Reemplazar si ya tenían calificación</span></label><div class="row gap wrap">' + btn('Aplicar', 'cap-eq-ok', '', 'primary') + '</div>';
  }
  A['cap-equipo'] = el => {
    const g = D.grupoActual(), a = actDe(el.dataset.id); if (!a) return; E.ui.eq = { id: a.id }; const eqs = CP.equipos(g, a.parcial);
    if (!eqs.length) { E.modal.open('👥 Calificar por equipo', '<p>Todavía no tienes equipos en Proyecto.</p><p class="muted small">Ármalos una vez (equilibrados o al azar): sirven para el proyecto y para calificar por equipo.</p><a class="btn primary" href="#/proyecto/' + a.parcial + '" data-act="modal-close-go" data-to="proyecto/' + a.parcial + '">Armar equipos</a>'); return; }
    E.modal.open('👥 Calificar por equipo', eqHTML(g, a, eqs));
  };
  A['cap-eq-niv'] = el => { const a = actDe(E.ui.eq.id), inp = document.getElementById('eqv-' + el.dataset.i); if (!a || !inp) return; inp.value = ptsNiv(a, Number(el.dataset.v)); el.parentNode.querySelectorAll('.rb').forEach(b => b.classList.toggle('on', b === el)); };
  A['cap-eq-ok'] = () => {
    const g = D.grupoActual(), k = 'act:' + g.id + ':' + E.ui.eq.id, a = S.get(k); if (!a) return;
    const eqs = CP.equipos(g, a.parcial), mx = C.maxPts(a), pres = !!(document.getElementById('eq-pres') || {}).checked, sobre = !!(document.getElementById('eq-sobre') || {}).checked, asis = a.fecha ? S.get('asis:' + g.id + ':' + a.fecha) : null;
    let bad = 0, n = 0; const set = {};
    eqs.forEach((e, i) => { const s = String((document.getElementById('eqv-' + i) || {}).value || '').trim(); if (s === '') return; const v = Number(s.replace(',', '.')); if (isNaN(v) || v < 0 || v > mx) { bad++; return; } e.al.forEach(aid => { if (!D.alumno(g, aid) || (pres && asis && !presente(asis[aid]))) return; set[aid] = u.round(v, 1); }); });
    if (bad) { u.toast(bad + (bad === 1 ? ' equipo tiene' : ' equipos tienen') + ' calificación fuera de 0 a ' + mx, 'err'); return; }
    if (!Object.keys(set).length) { u.toast('Escribe la calificación de al menos un equipo', 'err'); return; }
    S.update(k, x => { x.notas = x.notas || {}; Object.keys(set).forEach(aid => { const cur = x.notas[aid]; if (!sobre && cur !== '' && cur != null) return; x.notas[aid] = set[aid]; n++; }); });
    E.modal.close(); u.toast(n + (n === 1 ? ' alumno calificado' : ' alumnos calificados') + ' por equipo', 'ok');
  };

  /* =================== tarjetas para deslizar =================== */
  // → completa (2) · ↑ incompleta (1) · ← no la hizo (0). También con botones o con 1, 2, 3.
  const ETQ = { 2: ['✓', 'Completa', 'ok'], 1: ['½', 'Incompleta', 'warn'], 0: ['✗', 'No la hizo', 'bad'] };
  CP.tarjetas = cfg => { E.ui.tj = { cfg: cfg, i: 0, hechos: { 2: 0, 1: 0, 0: 0 } }; E.modal.open(cfg.titulo, tjHTML()); };
  function tjHTML() {
    const st = E.ui.tj, L = st.cfg.lista, n = L.length, et = Object.assign({}, ETQ, st.cfg.etq || {});
    if (st.i >= n) return '<div class="tj-fin"><p class="tj-big">🎉</p><p><b>¡Listo!</b> Revisaste ' + n + (n === 1 ? ' alumno' : ' alumnos') + '.</p><p class="small">' + st.hechos[2] + ' ✓ · ' + st.hechos[1] + ' ½ · ' + st.hechos[0] + ' ✗</p><div class="row gap wrap center">' + btn('Cerrar', 'modal-close', '', 'primary') + btn('↺ Volver a empezar', 'tj-otra', '', 'ghost') + '</div></div>';
    const x = L[st.i], v = st.cfg.valor(x.aid), p = u.partesNombre(x.nombre);
    return '<p class="muted small tj-sub">' + esc(st.cfg.sub || '') + ' · <b>' + (st.i + 1) + '</b> de ' + n + '</p>' +
      '<div class="tj-stage"><div class="tj-card" id="tj-card"><span class="tj-hint r">✓</span><span class="tj-hint l">✗</span><span class="tj-hint u">½</span>' +
      '<span class="tj-num">' + x.num + '</span><b class="tj-nom">' + esc(p.nom) + '</b><span class="tj-ap">' + esc((p.ap1 + ' ' + p.ap2).trim()) + '</span>' + (x.extra ? '<small class="tj-extra">' + esc(x.extra) + '</small>' : '') +
      (v != null && et[v] ? '<span class="chip tj-cur ' + et[v][2] + '">Ya tiene: ' + et[v][0] + ' ' + et[v][1] + '</span>' : '') + '</div></div>' +
      '<div class="tj-btns">' + [0, 1, 2].map(k => btn(et[k][0] + '<small>' + et[k][1] + '</small>', 'tj-v', 'data-v="' + k + '"', 'tj-' + et[k][2])).join('') + '</div>' +
      '<div class="row between gap mt">' + btn('‹ Anterior', 'tj-prev', st.i ? '' : 'disabled', 'small ghost') + '<span class="muted small">desliza → ✓ · ↑ ½ · ← ✗</span>' + btn('Saltar ›', 'tj-skip', '', 'small ghost') + '</div>';
  }
  const marcaTj = v => {
    const st = E.ui.tj; if (!st) return; const x = st.cfg.lista[st.i]; if (!x) return;
    UD.run('tarjeta', () => st.cfg.marca(x.aid, v)); st.hechos[v]++; st.i++;
    if (navigator.vibrate) navigator.vibrate(12); E.modal.body(tjHTML());
  };
  const vuela = (el, v, cb) => {
    if (!el) { cb(); return; } el.style.transition = 'transform .17s ease-in, opacity .17s'; el.style.opacity = '0';
    el.style.transform = v === 2 ? 'translate(130%,0) rotate(16deg)' : v === 0 ? 'translate(-130%,0) rotate(-16deg)' : 'translate(0,-120%)'; setTimeout(cb, 160);
  };
  A['tj-v'] = el => { const v = Number(el.dataset.v); vuela(document.getElementById('tj-card'), v, () => marcaTj(v)); };
  A['tj-prev'] = () => { const st = E.ui.tj; if (!st || !st.i) return; st.i--; E.modal.body(tjHTML()); };
  A['tj-skip'] = () => { const st = E.ui.tj; if (!st) return; st.i++; E.modal.body(tjHTML()); };
  A['tj-otra'] = () => { const st = E.ui.tj; if (!st) return; st.i = 0; st.hechos = { 2: 0, 1: 0, 0: 0 }; E.modal.body(tjHTML()); };
  let drag = null;
  const dir = (dx, dy) => Math.abs(dx) >= Math.abs(dy) ? (dx > 80 ? 2 : dx < -80 ? 0 : null) : (dy < -80 ? 1 : null);
  document.addEventListener('pointerdown', e => {
    const c = e.target.closest && e.target.closest('#tj-card'); if (!c || e.button > 0) return;
    drag = { x: e.clientX, y: e.clientY, dx: 0, dy: 0, el: c, id: e.pointerId }; try { c.setPointerCapture(e.pointerId); } catch (_) { } c.style.transition = 'none';
  });
  document.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.dx = dx; drag.dy = dy;
    drag.el.style.transform = 'translate(' + dx + 'px,' + Math.min(dy, 40) + 'px) rotate(' + (dx / 18) + 'deg)'; const k = dir(dx, dy); drag.el.dataset.dir = k == null ? '' : k;
  });
  const suelta = e => {
    if (!drag || (e && e.pointerId !== drag.id)) return; const d = drag; drag = null; const k = e && e.type === 'pointerup' ? dir(d.dx, d.dy) : null;
    d.el.style.transition = ''; if (k == null) { d.el.style.transform = ''; d.el.dataset.dir = ''; return; } vuela(d.el, k, () => marcaTj(k));
  };
  document.addEventListener('pointerup', suelta); document.addEventListener('pointercancel', suelta);
  // teclado con las tarjetas abiertas
  CP.tecla = e => {
    if (!E.ui.tj || !document.getElementById('modal-body') || !document.querySelector('#modal-body .tj-stage,#modal-body .tj-fin')) return false;
    const k = e.key, card = document.getElementById('tj-card');
    if (!card) return false;
    const v = k === '1' || k === 'ArrowRight' ? 2 : k === '2' || k === 'ArrowUp' ? 1 : k === '3' || k === 'ArrowLeft' ? 0 : null;
    if (v != null) { e.preventDefault(); vuela(card, v, () => marcaTj(v)); return true; }
    if (k === 'Backspace') { e.preventDefault(); A['tj-prev'](); return true; }
    if (k === 'ArrowDown') { e.preventDefault(); A['tj-skip'](); return true; }
    return false;
  };
  const lista = (al, mk) => { const sin = al.filter(a => mk(a.id) == null); return { L: (sin.length ? sin : al).map(a => ({ aid: a.id, num: a.num, nombre: a.nombre })), sub: sin.length ? sin.length + ' sin revisar' : 'Todos ya tenían marca: puedes corregir' }; };
  // libreta: elige la tarea y revisa alumno por alumno
  A['tj-lib'] = el => {
    const g = D.grupoActual(), pid = el.dataset.pid, ts = E.libreta.tareas(g, pid).cuentan, doc = E.libreta.doc(g, pid), al = D.alumnos(g);
    if (!ts.length) { u.toast('No hay tareas que cuenten en este parcial', 'err'); return; }
    const marc = t => al.filter(a => (((doc.marcas || {})[a.id]) || {})[t.key] != null).length;
    E.modal.open('🃏 Revisar por tarjetas', '<p class="muted small">Elige la tarea: pasas alumno por alumno y deslizas → completa, ← no la hizo, ↑ incompleta.</p><div class="tj-tareas">' +
      ts.map((t, i) => btn('<b>T' + (i + 1) + '</b> ' + esc(corto(t.t, 80)) + '<small>' + (t.f ? u.fCorta(t.f) + ' · ' : '') + marc(t) + ' de ' + al.length + ' revisadas</small>', 'tj-lib-go', 'data-pid="' + pid + '" data-key="' + esc(t.key) + '"', 'tj-tarea')).reverse().join('') + '</div>');
  };
  A['tj-lib-go'] = el => {
    const g = D.grupoActual(), pid = el.dataset.pid, key = el.dataset.key, t = E.libreta.tareas(g, pid).cuentan.find(x => x.key === key); if (!t) return;
    const mk = aid => { const v = ((((E.libreta.doc(g, pid).marcas || {})[aid]) || {})[key]); return v == null ? null : Number(v); };
    const r = lista(D.alumnos(g), mk);
    CP.tarjetas({ titulo: '🃏 ' + corto(t.t, 44), sub: r.sub, lista: r.L, valor: mk, marca: (aid, v) => { S.update('libreta:' + g.id + ':' + pid, d => { d.marcas = d.marcas || {}; d.quitar = d.quitar || {}; d.poner = d.poner || {}; d.extra = d.extra || []; (d.marcas[aid] = d.marcas[aid] || {})[key] = v; }, {}); E.libreta.sync(g, pid); } });
  };
  // práctica de FreeCAD: los presentes de hoy
  A['tj-fc'] = el => {
    const g = D.grupoActual(), id = el.dataset.id, pid = el.dataset.pid, p = E.fc.get(id); if (!p) return;
    const KF = 'fcal:' + g.id + ':' + pid, mk = aid => { const v = ((((S.get(KF) || {}).marcas || {})[aid]) || {})[id]; return v == null ? null : Number(v); };
    const asis = S.get('asis:' + g.id + ':' + u.today()), r = lista(D.alumnos(g).filter(a => !asis || presente(asis[a.id])), mk);
    CP.tarjetas({ titulo: '🃏 ' + corto(p.t, 44), sub: r.sub, lista: r.L, valor: mk, etq: { 1: ['½', 'A medias', 'warn'] },
      marca: (aid, v) => { S.update(KF, d => { d.marcas = d.marcas || {}; d.fechas = d.fechas || {}; d.orden = d.orden || []; (d.marcas[aid] = d.marcas[aid] || {})[id] = v; (d.fechas[aid] = d.fechas[aid] || {})[id] = u.today(); if (d.orden.indexOf(id) < 0) d.orden.push(id); }, {}); E.fc.sync(g, pid); } });
  };
  // cierre del día: la tarea que tocaba, con los presentes
  A['tj-cr'] = el => {
    const g = D.grupoActual(), f = el.dataset.f, s = E.cierre.tareaSel(g, f); if (!s.t) { u.toast('Primero elige la tarea que revisaste', 'err'); return; }
    const mk = aid => { const v = ((((E.libreta.doc(g, s.T.pid).marcas || {})[aid]) || {})[s.key]); return v == null ? null : Number(v); };
    const asis = S.get('asis:' + g.id + ':' + f), r = lista(D.alumnos(g).filter(a => !asis || presente(asis[a.id])), mk);
    CP.tarjetas({ titulo: '🃏 Tarea del ' + u.fCorta(f), sub: corto(s.t.t, 50) + ' · ' + r.sub, lista: r.L, valor: mk, marca: (aid, v) => E.cierre.marca(g, f, aid, v, false, true) });
  };

  /* =================== dictado por voz =================== */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  CP.puedeDictar = !!SR;
  const W = { cero: 0, un: 1, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12, trece: 13, catorce: 14, quince: 15, dieciseis: 16, diecisiete: 17, dieciocho: 18, diecinueve: 19, veinte: 20, veintiuno: 21, veintiun: 21, veintidos: 22, veintitres: 23, veinticuatro: 24, veinticinco: 25, veintiseis: 26, veintisiete: 27, veintiocho: 28, veintinueve: 29, treinta: 30, cuarenta: 40, cincuenta: 50, sesenta: 60, setenta: 70, ochenta: 80, noventa: 90, cien: 100, ciento: 100 };
  const leeNum = (tk, i) => {
    const t = tk[i]; if (t == null) return null;
    if (/^\d+([.,]\d+)?$/.test(t)) return { v: nnum(t), j: i + 1 };
    if (W[t] == null) return null; let v = W[t], j = i + 1;
    if (v >= 30 && v <= 90 && tk[j] === 'y' && W[tk[j + 1]] != null && W[tk[j + 1]] < 10) { v += W[tk[j + 1]]; j += 2; }
    if ((tk[j] === 'punto' || tk[j] === 'coma') && tk[j + 1] != null && (/^\d$/.test(tk[j + 1]) || (W[tk[j + 1]] != null && W[tk[j + 1]] < 10))) { v += nnum(/^\d$/.test(tk[j + 1]) ? tk[j + 1] : W[tk[j + 1]]) / 10; j += 2; }
    return { v: v, j: j };
  };
  // «Pérez 85», «número 12, 85», «el 7 noventa», «12 85», «Pérez 85 Ruiz 90»
  CP.pares = txt => {
    const tk = u.norm(txt).toLowerCase().split(/\s+/).map(t => t.replace(/^[,;:.]+|[,;:]+$/g, '').replace(/\.$/, '')).filter(Boolean);
    const out = [], NUMW = /^(numero|num|no|lista|el|la)$/, FILL = /^(y|de|del|calificacion|tiene|saco|lleva|con|puntos|pts|es|le|pon|ponle|ponme|a|al|para|que)$/;
    let nom = [], num = null, i = 0;
    while (i < tk.length) {
      const n = leeNum(tk, i);
      if (n) {
        if (num == null && !nom.length) { const n2 = leeNum(tk, n.j); if (n2) { out.push({ num: n.v, v: n2.v }); i = n2.j; continue; } num = n.v; i = n.j; continue; }
        out.push({ num: num, nom: nom.join(' '), v: n.v }); num = null; nom = []; i = n.j; continue;
      }
      const t = tk[i];
      if (NUMW.test(t) && !nom.length && num == null) { const n1 = leeNum(tk, i + 1); if (n1) { num = n1.v; i = n1.j; continue; } }
      if (!FILL.test(t)) nom.push(t); i++;
    }
    return out.filter(p => p.num != null || p.nom);
  };
  const DIC = () => (E.ui.dic = E.ui.dic || { on: false, id: null, log: [], txt: '' });
  let rec = null, reinicios = [];
  CP.dictar = (id, txt) => {
    const d = DIC(), g = D.grupoActual(), k = 'act:' + g.id + ':' + id, a = S.get(k); if (!a) return [];
    const al = D.alumnos(g), mx = C.maxPts(a), ps = CP.pares(txt), res = [];
    if (!ps.length) res.push({ ok: false, t: '«' + String(txt).trim() + '»: no encontré una calificación' });
    ps.forEach(p => {
      let x = p.num != null ? al.find(y => y.num === p.num) : null;
      if (!x && p.nom) { const r = CP.alumno(al, p.nom); x = r.a; if (!x) { res.push({ ok: false, t: '«' + p.nom + '»: ' + (r.cand.length > 1 ? 'hay varios (' + r.cand.slice(0, 3).map(c => u.corto(c.nombre)).join(', ') + '); di el apellido completo o el número' : 'no lo encontré') }); return; } }
      if (!x) { res.push({ ok: false, t: 'No hay alumno con el número ' + p.num }); return; }
      if (!(p.v >= 0 && p.v <= mx)) { res.push({ ok: false, t: x.num + ' · ' + u.corto(x.nombre) + ': ' + p.v + ' está fuera de 0 a ' + mx }); return; }
      const v = u.round(p.v, 1); UD.run('dictado', () => S.update(k, a2 => { a2.notas = a2.notas || {}; a2.notas[x.id] = v; }));
      res.push({ ok: true, t: x.num + ' · ' + u.corto(x.nombre) + ' → ' + v, aid: x.id });
    });
    d.log = res.concat(d.log).slice(0, 4);
    const ult = res.filter(r => r.ok).slice(-1)[0];
    if (ult) setTimeout(() => { const r = document.getElementById('row-' + ult.aid); if (r) { r.classList.remove('flash'); void r.offsetWidth; r.classList.add('flash'); r.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }, 120);
    if (navigator.vibrate) navigator.vibrate(res.some(r => r.ok) ? 15 : [30, 40, 30]); barra();
    return res;
  };
  function barra() {
    let el = document.getElementById('dic-bar'); const d = DIC();
    if (!d.on) { if (el) el.remove(); document.body.classList.remove('dictando'); return; }
    if (!el) { el = document.createElement('div'); el.id = 'dic-bar'; el.setAttribute('aria-live', 'polite'); document.body.appendChild(el); }
    document.body.classList.add('dictando');
    el.innerHTML = '<div class="dic-h"><span class="dic-dot"></span><div><b>Escuchando…</b><small>Di «Pérez 85» o «número 12, 85». Usa el reconocimiento de voz de Chrome (servicio de Google): necesita internet.</small></div>' + btn('Detener', 'cap-dictar', 'data-id="' + d.id + '"', 'small') + '</div>' +
      (d.txt ? '<p class="small dic-int">' + esc(d.txt) + '…</p>' : '') + '<ul class="dic-log">' + d.log.map(x => '<li class="' + (x.ok ? 'ok' : 'bad') + '">' + (x.ok ? '✓ ' : '✗ ') + esc(x.t) + '</li>').join('') + '</ul>';
  }
  CP.parar = () => { const d = DIC(); d.on = false; d.txt = ''; try { if (rec) rec.stop(); } catch (e) { } rec = null; barra(); const b = document.querySelector('[data-act="cap-dictar"].on'); if (b) b.classList.remove('on'); };
  function arranca() {
    const d = DIC(); if (!d.on) return;
    try {
      rec = new SR(); rec.lang = 'es-MX'; rec.continuous = true; rec.interimResults = true; rec.maxAlternatives = 1;
      rec.onresult = ev => { let it = ''; for (let i = ev.resultIndex; i < ev.results.length; i++) { const r = ev.results[i]; if (r.isFinal) CP.dictar(d.id, r[0].transcript); else it += r[0].transcript; } d.txt = it; barra(); };
      rec.onerror = ev => { const m = { 'not-allowed': 'Permite el micrófono para Escuadra (candado junto a la dirección).', 'service-not-allowed': 'Este navegador no permite el dictado aquí.', network: 'El dictado necesita internet.', 'audio-capture': 'No encontré el micrófono.', 'language-not-supported': 'Este navegador no tiene dictado en español.' }[ev.error]; if (m) { u.toast(m, 'err', 6000); CP.parar(); } };
      rec.onend = () => { if (!d.on) return; const t = Date.now(); reinicios = reinicios.filter(x => t - x < 8000).concat(t); if (reinicios.length > 6) { u.toast('El dictado se detuvo: vuelve a tocar 🎤', 'err', 4000); CP.parar(); return; } try { rec.start(); } catch (e) { CP.parar(); } };
      rec.start();
    } catch (e) { u.toast('No se pudo iniciar el dictado: ' + e.message, 'err', 5000); CP.parar(); }
  }
  A['cap-dictar'] = el => {
    const d = DIC(); if (d.on) { CP.parar(); return; }
    if (!SR) { u.toast('Este navegador no tiene dictado: usa Chrome en Android o en la compu', 'err', 5000); return; }
    d.on = true; d.id = el.dataset.id; d.log = []; d.txt = ''; reinicios = []; el.classList.add('on'); arranca(); barra();
  };
  window.addEventListener('hashchange', () => { if (DIC().on && location.hash !== '#/actividad/' + DIC().id) CP.parar(); });

  /* =================== barra de captura en la actividad y «seguir» =================== */
  CP.barraHTML = (g, a) => {
    const auto = a.libreta ? 'Tareas y libreta' : a.freecad ? 'FreeCAD (revisar por alumno)' : a.examen ? 'Examen recomendado (captura por alumno)' : null;
    if (auto) return '<p class="note info small">Esta actividad se llena sola desde ' + auto + ': captura allá.</p>' + E.rap.filtroHTML('act');
    return '<div class="capbar">' + E.rap.filtroHTML('act') + '<div class="capbtns">' + btn(icon('clip') + ' Pegar', 'cap-pegar', 'data-id="' + a.id + '"', 'small') + btn('📷 Con Claude', 'cap-claude', 'data-id="' + a.id + '"', 'small') +
      btn(icon('team') + ' Por equipo', 'cap-equipo', 'data-id="' + a.id + '"', 'small') + btn('🧾 ' + (a.rub ? esc(a.rub.n) : 'Rúbrica'), 'cap-rub', 'data-id="' + a.id + '"', 'small' + (a.rub ? ' on' : '')) +
      (SR ? btn(icon('mic') + ' Dictar', 'cap-dictar', 'data-id="' + a.id + '"', 'small' + (DIC().on && DIC().id === a.id ? ' on' : '')) : '') + '</div></div>' + (a.rub ? rubInfo(a) : '');
  };
  CP.ult = () => { try { return JSON.parse(localStorage.getItem('escuadra.ult') || 'null'); } catch (e) { return null; } };
  CP.marcaUlt = id => { try { localStorage.setItem('escuadra.ult', JSON.stringify({ id: id, t: Date.now() })); } catch (e) { } };
  CP.seguir = g => {
    const x = CP.ult(); if (!x || !g || Date.now() - x.t > 10 * 864e5) return null;
    const a = S.get('act:' + g.id + ':' + x.id); if (!a || a.libreta || a.freecad) return null;
    const al = D.alumnos(g), st = C.actStats(a, al); if (!st.faltan || (!st.capturadas && Date.now() - x.t > 864e5)) return null;
    return { a: a, faltan: st.faltan, n: al.length };
  };
  CP.seguirHTML = g => { const s = CP.seguir(g); return s ? '<p class="seguir">' + link('↪ Seguir capturando «' + esc(corto(s.a.nombre, 40)) + '»', 'actividad/' + s.a.id, 'small') + ' <span class="muted small">faltan ' + s.faltan + ' de ' + s.n + '</span></p>' : ''; };
})();
