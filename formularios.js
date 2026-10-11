/* Escuadra · Formularios de alumnos (Google Forms u otro): proyectas el QR para que lo abran en su celular y luego pegas las
   respuestas (cuestionario con puntuación, autoevaluación o coevaluación). La calificación que resulta cae en una actividad.
   Escuadra no guarda las respuestas: solo el enlace del formulario y la calificación. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h, UD = E.undo;
  const card = H.card, btn = H.btn, icon = E.icon;
  const F = E.forms = {};
  const KF = g => 'forms:' + g.id;
  const lista = g => (((S.get(KF(g)) || {}).items) || []).filter(x => x && x.id);
  const TIPOS = {
    quiz: ['📝 Cuestionario', 'Formulario en modo cuestionario: trae la columna «Puntuación» (por ejemplo 8 / 10).'],
    auto: ['🪞 Autoevaluación', 'Cada alumno se califica con escalas (1 a 5, 1 a 10…): se promedian y pasan a base 100.'],
    coev: ['🤝 Coevaluación', 'Cada alumno evalúa a sus compañeros: a cada quien le queda el promedio de lo que le pusieron.']
  };
  const actividades = g => S.list('act:' + g.id + ':').filter(a => a && a.id).sort((a, b) => String(b.fecha || '').localeCompare(String(a.fecha || '')));
  const nh = s => u.norm(s).toLowerCase();
  const nnum = s => Number(String(s).replace(',', '.'));
  // número al inicio de la celda: «4», «4 - Bien», «8.5»
  const numDe = s => { const m = String(s == null ? '' : s).trim().match(/^(-?\d+(?:[.,]\d+)?)(?:\s|$|\s*[-–:)])/); return m ? nnum(m[1]) : null; };

  /* =================== pantalla =================== */
  V.formularios = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup();
    const fs = lista(g), acts = actividades(g), aN = id => { const a = acts.find(x => x.id === id); return a ? a.nombre : ''; };
    let h = card('<h3>📋 Formularios para tus alumnos</h3><p class="muted small">Haz el formulario en Google Forms (o el que uses), guarda aquí su enlace y proyecta el QR: lo abren con su celular. Al terminar, copia las respuestas de la hoja de cálculo y pégalas: la calificación cae sola en la actividad. Escuadra no guarda las respuestas, solo la calificación.</p>');
    if (fs.length) h += card('<h3>Tus formularios</h3><ul class="fm-l">' + fs.map(f => '<li><div><b>' + esc(f.titulo) + '</b><small class="muted">' + TIPOS[f.tipo][0] + (f.act && aN(f.act) ? ' → ' + esc(aN(f.act)) : '') + (f.imp ? ' · importado ' + u.fCorta(f.imp) : '') + '</small></div>' +
      '<div class="row gap wrap">' + btn('📽 Proyectar QR', 'fm-proj', 'data-id="' + f.id + '"', 'small primary') + btn('📥 Importar respuestas', 'fm-imp', 'data-id="' + f.id + '"', 'small') + btn(icon('trash'), 'fm-del', 'data-id="' + f.id + '" aria-label="Quitar formulario"', 'small ghost') + '</div></li>').join('') + '</ul>');
    h += card('<h3>＋ Agregar formulario</h3><div class="fgrid">' +
      '<label class="fld"><span>Título</span><input class="inp" id="fm-tit" placeholder="Ej. Autoevaluación del proyecto"></label>' +
      '<label class="fld"><span>Enlace del formulario</span><input class="inp" id="fm-url" inputmode="url" placeholder="https://forms.gle/…"></label>' +
      '<label class="fld"><span>Tipo</span><select id="fm-tipo">' + Object.keys(TIPOS).map(k => '<option value="' + k + '">' + TIPOS[k][0] + '</option>').join('') + '</select></label>' +
      '<label class="fld"><span>Actividad donde cae (opcional)</span><select id="fm-act"><option value="">La elijo al importar</option>' + acts.map(a => '<option value="' + a.id + '">' + esc(a.nombre || 'Actividad') + '</option>').join('') + '</select></label></div>' +
      btn('Guardar', 'fm-add', '', 'primary'));
    h += card('<details class="sub" id="fm-tips"><summary>💡 Cómo armar el formulario para que se importe bien</summary><ul class="small">' +
      '<li>Pon como <b>primera pregunta «Número de lista»</b> (respuesta corta, solo número). Con eso Escuadra sabe quién contestó; el nombre es opcional.</li>' +
      '<li><b>Cuestionario:</b> en Google Forms → Configuración → «Convertir en cuestionario» y asigna puntos. Se usa la columna «Puntuación».</li>' +
      '<li><b>Autoevaluación:</b> preguntas de «Escala lineal» (por ejemplo 1 a 5). Se promedian.</li>' +
      '<li><b>Coevaluación:</b> agrega «Número de lista del compañero que evalúas» y las escalas; cada alumno lo llena una vez por compañero. La autoevaluación que se cuele (su propio número) no cuenta.</li>' +
      '<li>Para importar: abre las respuestas en la hoja de cálculo, selecciona todo (Ctrl+A), copia y pega aquí. También sirve el archivo .csv de «Descargar respuestas».</li>' +
      '<li>No pidas datos que no necesitas (correo, teléfono): con el número de lista basta.</li></ul></details>');
    return { t: 'Formularios', h: h };
  };
  const val = id => ((document.getElementById(id) || {}).value || '').trim();
  A['fm-add'] = () => {
    const g = D.grupoActual(), t = val('fm-tit'), url = val('fm-url'), tipo = val('fm-tipo') || 'quiz', act = val('fm-act');
    if (!t) { u.toast('Escribe un título', 'err'); return; }
    if (!/^https?:\/\/\S+\.\S+/i.test(url)) { u.toast('Pega el enlace completo (https://…)', 'err'); return; }
    S.update(KF(g), d => { d.items = d.items || []; d.items.push({ id: u.uid('fm'), titulo: t, url: url, tipo: tipo, act: act, creado: u.today() }); }, {});
    u.toast('Formulario guardado', 'ok');
  };
  A['fm-del'] = el => { const g = D.grupoActual(); if (!confirm('¿Quitar este formulario de la lista? (No se borra de Google Forms ni las calificaciones)')) return; S.update(KF(g), d => { d.items = (d.items || []).filter(x => x.id !== el.dataset.id); }, {}); };
  A['fm-proj'] = async el => {
    const g = D.grupoActual(), f = lista(g).find(x => x.id === el.dataset.id); if (!f) return;
    await E.cam.qrListo();
    E.proj.abrir({ id: 'fm-' + f.id, titulo: f.titulo }, [{ k: 'html', h: f.titulo, html: '<div class="pj-qrbox">' + E.cam.qrSVG(f.url, 'pj-qr', 'M') + '<div><p class="pj-qrurl">' + esc(f.url.replace(/^https?:\/\//, '')) + '</p><p>Apunta la cámara de tu celular al código y escribe tu <b>número de lista</b>.</p></div></div>' }]);
  };

  /* =================== importar respuestas =================== */
  // tabla de lo pegado (tabuladores de la hoja de cálculo, o .csv con comas o punto y coma; respeta comillas)
  F.tabla = txt => {
    txt = String(txt || '').replace(/^﻿/, ''); const l0 = txt.split('\n')[0], cnt = ch => (l0.match(new RegExp(ch === '\t' ? '\\t' : ch, 'g')) || []).length;
    const sep = cnt('\t') ? '\t' : cnt(';') > cnt(',') ? ';' : ',', rows = []; let row = [], cell = '', q = false;
    for (let i = 0; i < txt.length; i++) {
      const c = txt[i];
      if (q) { if (c === '"') { if (txt[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
      else if (c === '"' && cell === '') q = true;
      else if (c === sep) { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && txt[i + 1] === '\n') i++; row.push(cell); cell = ''; if (row.some(x => x.trim())) rows.push(row); row = []; }
      else cell += c;
    }
    row.push(cell); if (row.some(x => x.trim())) rows.push(row);
    return rows.map(r => r.map(x => x.trim()));
  };
  // qué columna es qué
  F.detecta = (tab, tipo) => {
    const head = tab[0] || [], rows = tab.slice(1), hs = head.map(nh), find = (re, no) => hs.findIndex((h, i) => re.test(h) && (no || []).indexOf(i) < 0);
    const obj = tipo === 'coev' ? find(/compa|evalua|a quien/) : -1;
    const num = find(/numero de lista|no\.? de lista|num(\.|ero)? ?(de )?lista|^n(o|um|°|º)?\.?$|^#$/, [obj]);
    const nom = find(/nombre/, [obj, num]), punt = find(/^puntuaci|^score|^puntos|^calificaci/, [obj, num, nom]);
    const ign = [find(/marca temporal|timestamp|fecha y hora/), find(/correo|e-?mail|direcci/)];
    const esNum = i => { const vs = rows.map(r => r[i]).filter(v => v != null && v !== ''); return vs.length > 0 && vs.filter(v => numDe(v) != null).length / vs.length >= 0.7; };
    const cols = head.map((h, i) => i).filter(i => [obj, num, nom, punt].concat(ign).indexOf(i) < 0 && esNum(i));
    let mx = 0; cols.forEach(i => rows.forEach(r => { const v = numDe(r[i]); if (v != null && v > mx) mx = v; }));
    const max = [3, 4, 5, 10, 20, 100].find(x => x >= mx) || Math.ceil(mx) || 5;
    return { obj: obj, num: num, nom: nom, punt: tipo === 'quiz' ? punt : -1, cols: tipo === 'quiz' && punt >= 0 ? [] : cols, max: max };
  };
  // quién es: número de lista al inicio (o solo), y si no, el nombre
  const quien = (al, txt, nombre) => {
    const t = String(txt || '').trim(), m = t.match(/^(\d{1,3})(?:\b|$)/);
    if (m) { const a = al.find(x => Number(x.num) === Number(m[1])); if (a) return a; }
    const n = (m ? t.slice(m[0].length) : t).replace(/^[\s.\-–)]+/, '').trim() || String(nombre || '').trim();
    if (n && E.cap) { const r = E.cap.alumno(al, n); return r.a || null; }
    return null;
  };
  F.calcula = (g, s) => {
    const al = D.alumnos(g), m = s.map, rows = s.tab.slice(1), out = {}, orden = [];
    rows.forEach((r, ri) => {
      let pct = null;
      if (m.punt >= 0) { const fr = String(r[m.punt] || '').match(/(\d+(?:[.,]\d+)?)\s*\/\s*(\d+(?:[.,]\d+)?)/); if (fr && nnum(fr[2]) > 0) pct = nnum(fr[1]) / nnum(fr[2]) * 100; else if (numDe(r[m.punt]) != null) pct = numDe(r[m.punt]) / (m.max || 100) * 100; }
      else { const vs = m.cols.map(i => numDe(r[i])).filter(v => v != null); if (vs.length) pct = vs.reduce((a, b) => a + b, 0) / vs.length / (m.max || 5) * 100; }
      if (pct == null) return;
      pct = Math.max(0, Math.min(100, pct));
      const quienTxt = s.tipo === 'coev' ? r[m.obj] : [m.num >= 0 ? r[m.num] : '', m.nom >= 0 ? r[m.nom] : ''].filter(Boolean).join(' ');
      let a = s.fix[ri] != null ? (s.fix[ri] ? al.find(x => x.id === s.fix[ri]) : null) : quien(al, quienTxt, s.tipo === 'coev' ? '' : (m.nom >= 0 ? r[m.nom] : ''));
      if (s.tipo === 'coev' && a && m.num >= 0) { const ev = quien(al, r[m.num], m.nom >= 0 ? r[m.nom] : ''); if (ev && ev.id === a.id) return; }   // se evaluó a sí mismo: no cuenta
      const k = a ? a.id : '?' + ri;
      if (s.tipo === 'coev') { const o = out[k] = out[k] || { s: 0, n: 0, txt: quienTxt, ri: ri }; o.s += pct; o.n++; }
      else { if (!out[k]) orden.push(k); out[k] = { s: pct, n: 1, txt: quienTxt, ri: ri }; }   // si contestó dos veces, cuenta la última
      if (orden.indexOf(k) < 0) orden.push(k);
    });
    return orden.map(k => ({ aid: k[0] === '?' ? '' : k, txt: out[k].txt, ri: out[k].ri, pct: Math.round(out[k].s / out[k].n * 10) / 10, n: out[k].n }));
  };
  function impHTML() {
    const s = E.ui.fm, g = D.grupoActual();
    if (!s.tab) return '<p class="small">Pega las respuestas copiadas de la hoja de cálculo <b>con la fila de títulos</b>, o sube el .csv.</p><textarea class="inp" id="fm-txt" rows="7" placeholder="Marca temporal&#9;Número de lista&#9;Puntuación…">' + esc(s.txt) + '</textarea>' +
      '<div class="row gap wrap mt">' + btn('Revisar', 'fm-rev', '', 'primary') + '<label class="btn"><input type="file" accept=".csv,.tsv,text/csv,text/plain" hidden data-ch="fm-csv">📄 Subir .csv</label></div>';
    const head = s.tab[0], m = s.map, al = D.alumnos(g), res = F.calcula(g, s), acts = actividades(g);
    const opc = (sel, vacio) => '<option value="-1">' + vacio + '</option>' + head.map((h, i) => '<option value="' + i + '"' + (i === sel ? ' selected' : '') + '>' + esc(h || 'Columna ' + (i + 1)) + '</option>').join('');
    let h = '<p class="small"><b>' + (s.tab.length - 1) + '</b> respuestas · ' + TIPOS[s.tipo][0] + '</p><div class="fgrid">' +
      (s.tipo === 'coev' ? '<label class="fld"><span>A quién evalúa</span><select data-ch="fm-map" data-k="obj">' + opc(m.obj, '— elige —') + '</select></label>' : '') +
      '<label class="fld"><span>' + (s.tipo === 'coev' ? 'Quién evalúa (para no contar su autoevaluación)' : 'Número de lista') + '</span><select data-ch="fm-map" data-k="num">' + opc(m.num, '— no hay —') + '</select></label>' +
      '<label class="fld"><span>Nombre</span><select data-ch="fm-map" data-k="nom">' + opc(m.nom, '— no hay —') + '</select></label>' +
      (s.tipo === 'quiz' ? '<label class="fld"><span>Puntuación</span><select data-ch="fm-map" data-k="punt">' + opc(m.punt, '— usar escalas —') + '</select></label>' : '') +
      (m.punt < 0 ? '<label class="fld"><span>Escala: máximo</span><input type="number" min="1" class="inp" value="' + m.max + '" data-ch="fm-max"></label>' : '') + '</div>' +
      (m.punt < 0 ? '<p class="small">Columnas que califican:</p><div class="fm-cols">' + head.map((t, i) => [m.obj, m.num, m.nom].indexOf(i) >= 0 ? '' : '<label class="ck small"><input type="checkbox" data-ch="fm-col" data-i="' + i + '"' + (m.cols.indexOf(i) >= 0 ? ' checked' : '') + '><span>' + esc(u.cap(String(t || 'Columna ' + (i + 1)).slice(0, 60))) + '</span></label>').join('') + '</div>' : '');
    h += '<ul class="pg-l fm-res">' + res.map(r => { const a = r.aid && al.find(x => x.id === r.aid);
      return '<li class="' + (a ? '' : 'no') + '"><span class="pg-t">' + esc(String(r.txt || '(sin dato)')) + (s.tipo === 'coev' ? ' · ' + r.n + (r.n === 1 ? ' evaluación' : ' evaluaciones') : '') + '</span><div class="pg-x"><select data-ch="fm-fix" data-ri="' + r.ri + '"><option value="">' + (a ? '— no aplicar —' : '¿Quién es? (no lo encontré)') + '</option>' + al.map(x => '<option value="' + x.id + '"' + (a && x.id === a.id ? ' selected' : '') + '>' + x.num + ' · ' + esc(u.corto(x.nombre)) + '</option>').join('') + '</select><b class="pg-v g ' + H.gclass(r.pct) + '">' + u.round(r.pct, 1) + '</b></div></li>'; }).join('') + '</ul>';
    const ok = res.filter(r => r.aid).length, sin = al.filter(a => !res.some(r => r.aid === a.id)).length;
    h += '<p class="muted small">' + ok + ' alumnos con calificación (base 100)' + (sin ? ' · ' + sin + ' sin respuesta (no se toca su calificación)' : '') + '.</p>' +
      '<label class="fld"><span>¿En qué actividad cae?</span><select id="fm-dest"><option value="__nueva">＋ Crear actividad «' + esc(s.titulo) + '»</option>' + acts.map(a => '<option value="' + a.id + '"' + (a.id === s.act ? ' selected' : '') + '>' + esc(a.nombre || 'Actividad') + '</option>').join('') + '</select></label>' +
      '<div class="row gap wrap">' + btn('✓ Aplicar ' + ok + ' calificaciones', 'fm-aplicar', ok ? '' : 'disabled', 'primary') + btn('‹ Pegar otra vez', 'fm-otra', '', 'ghost') + '</div>';
    return h;
  }
  A['fm-imp'] = el => {
    const g = D.grupoActual(), f = lista(g).find(x => x.id === el.dataset.id); if (!f) return;
    E.ui.fm = { id: f.id, titulo: f.titulo, tipo: f.tipo, act: f.act || '', txt: '', tab: null, map: null, fix: {} };
    E.modal.open('📥 ' + f.titulo, impHTML());
  };
  const revisa = txt => {
    const s = E.ui.fm, tab = F.tabla(txt); s.txt = txt;
    if (tab.length < 2) { u.toast('Pega también la fila de títulos y al menos una respuesta', 'err'); return; }
    s.tab = tab; s.map = F.detecta(tab, s.tipo); s.fix = {}; E.modal.body(impHTML());
  };
  A['fm-rev'] = () => revisa((document.getElementById('fm-txt') || {}).value || '');
  CH['fm-csv'] = async el => { const f = el.files && el.files[0]; el.value = ''; if (f) revisa(await f.text()); };
  A['fm-otra'] = () => { E.ui.fm.tab = null; E.modal.body(impHTML()); };
  CH['fm-map'] = el => { const s = E.ui.fm, k = el.dataset.k; s.map[k] = Number(el.value); if (k !== 'punt') s.map.cols = s.map.cols.filter(i => i !== s.map[k]); s.fix = {}; E.modal.body(impHTML()); };
  CH['fm-max'] = el => { E.ui.fm.map.max = Math.max(1, Number(el.value) || 5); E.modal.body(impHTML()); };
  CH['fm-col'] = el => { const m = E.ui.fm.map, i = Number(el.dataset.i); m.cols = el.checked ? m.cols.concat([i]) : m.cols.filter(x => x !== i); E.modal.body(impHTML()); };
  CH['fm-fix'] = el => { E.ui.fm.fix[el.dataset.ri] = el.value; E.modal.body(impHTML()); };
  A['fm-aplicar'] = () => {
    const s = E.ui.fm, g = D.grupoActual(), res = F.calcula(g, s).filter(r => r.aid); if (!res.length) return;
    let dest = val('fm-dest') || '__nueva';
    if (dest === '__nueva') {
      dest = u.uid('act'); const p = C.parcialActual();
      S.put('act:' + g.id + ':' + dest, { id: dest, parcial: p.id, categoria: 'trabajos', nombre: s.titulo, peso: 1, max: 100, fecha: u.today(), instrumento: s.tipo === 'quiz' ? 'Exa' : 'Otro', cuenta: true, notas: {} }, { silent: true });
    }
    const a = S.get('act:' + g.id + ':' + dest); if (!a) return; const mx = C.maxPts(a);
    UD.run('formulario', () => {
      S.update('act:' + g.id + ':' + dest, x => { x.notas = x.notas || {}; res.forEach(r => { x.notas[r.aid] = Math.round(r.pct / 100 * mx * 10) / 10; }); });
      S.update(KF(g), d => { const f = (d.items || []).find(y => y.id === s.id); if (f) { f.act = dest; f.imp = u.today(); } }, {});
    });
    E.modal.close(); u.toast(res.length + ' calificaciones en «' + (a.nombre || 'la actividad') + '»', 'ok', 3500); location.hash = '#/actividad/' + dest;
  };
})();
