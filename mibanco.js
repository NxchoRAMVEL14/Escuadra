/* Escuadra · Tu propio banco de preguntas. Las que agregues (a mano, pegadas o preparadas con Claude) entran solas a
   Ejercicios, Calentamiento, Boleto de salida y Examen recomendado, y se sincronizan con tu cuenta (no son por grupo). */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn;
  const MB = E.mibanco = {};
  const KB = 'banco:propias';
  const TIPO = { om: 'Opción múltiple', vf: 'Verdadero o falso', ab: 'Abierta' };
  const NIV = { 1: 'Recordar', 2: 'Comprender', 3: 'Aplicar' };
  MB.items = () => ((S.get(KB) || {}).items || []).filter(x => x && x.id && x.q);
  // las propias viven dentro de E.BANCO con id que empieza con «pp_»
  MB.sync = () => { if (!E.BANCO) return; for (let i = E.BANCO.length - 1; i >= 0; i--) if (String(E.BANCO[i].id).indexOf('pp_') === 0) E.BANCO.splice(i, 1); MB.items().forEach(x => E.BANCO.push(x)); };
  MB.sync();
  S.on(k => { if (!k || k === KB || String(k).indexOf('__') === 0) MB.sync(); });
  const temas = () => (E.TEMAS || []).filter(t => t.sm !== 'gen');
  const tTit = id => { const t = (E.TEMAS || []).find(x => x.id === id); return t ? t.titulo : id; };
  const norm = s => u.norm(s).replace(/[^A-Z0-9 ]/g, '');
  const temaDe = s => { s = String(s || '').trim(); if (!s) return null; const ts = E.TEMAS || []; const id = ts.find(t => t.id === s.toLowerCase()); if (id) return id.id; const n = norm(s); const m = ts.find(t => norm(t.titulo) === n) || ts.find(t => norm(t.titulo).indexOf(n) === 0) || ts.find(t => n && norm(t.titulo).indexOf(n) >= 0); return m ? m.id : null; };

  /* ---------- pegar varias: formato sencillo ---------- */
  // Bloques separados por una línea en blanco. P: pregunta · A) B) C) D) opciones (A es la correcta, o CORRECTA: B) ·
  // V/F: V o F · R: respuesta modelo (abierta) · EXP: explicación · NIVEL: 1, 2 o 3 · TEMA: id o título (vale para lo que sigue)
  MB.parse = (txt, temaDef) => {
    const out = [], err = []; let tema = temaDef || null, niv = 2;
    String(txt || '').replace(/\r/g, '').split(/\n\s*\n/).forEach((blq, bi) => {
      const L = blq.split('\n').map(x => x.trim()).filter(Boolean); if (!L.length) return;
      let q = '', op = [], cor = null, vf = null, r = '', exp = '', nb = null;
      L.forEach(l => {
        let m;
        if ((m = l.match(/^TEMA\s*:\s*(.+)$/i))) { const t = temaDe(m[1]); if (t) tema = t; else err.push('Bloque ' + (bi + 1) + ': no reconozco el tema «' + m[1] + '».'); }
        else if ((m = l.match(/^NIVEL\s*:\s*([123])/i))) { nb = Number(m[1]); niv = nb; }
        else if ((m = l.match(/^P\s*[:.)]\s*(.+)$/i)) || (m = l.match(/^PREGUNTA\s*:\s*(.+)$/i))) q = m[1];
        else if ((m = l.match(/^([A-Da-d])\s*[).:]\s*(.+)$/))) op.push([m[1].toUpperCase(), m[2]]);
        else if ((m = l.match(/^CORRECTA\s*:\s*([A-Da-d])/i))) cor = m[1].toUpperCase();
        else if ((m = l.match(/^V\s*\/\s*F\s*:\s*(V|F|VERDADERO|FALSO)/i))) vf = /^V/i.test(m[1]);
        else if ((m = l.match(/^(R|RESPUESTA)\s*:\s*(.+)$/i))) r = m[2];
        else if ((m = l.match(/^(EXP|EXPLICACI[OÓ]N)\s*:\s*(.+)$/i))) exp = m[2];
        else if (q && !op.length && vf == null && !r) q += ' ' + l;
      });
      if (!q) { if (L.some(l => /^(P|PREGUNTA)\s*[:.)]/i.test(l))) err.push('Bloque ' + (bi + 1) + ': falta la pregunta.'); return; }
      if (!tema) { err.push('«' + q.slice(0, 40) + '…»: falta el TEMA.'); return; }
      const it = { id: 'pp_' + u.uid('q').slice(2), tema: tema, niv: nb || niv, q: q, f: u.today(), propia: true };
      if (op.length) {
        if (op.length < 3 || op.length > 4) { err.push('«' + q.slice(0, 40) + '…»: necesita 3 o 4 opciones.'); return; }
        let ops = op.map(o => o[1]); if (cor) { const i = op.findIndex(o => o[0] === cor); if (i > 0) { const c = ops.splice(i, 1)[0]; ops.unshift(c); } }
        if (new Set(ops).size !== ops.length) { err.push('«' + q.slice(0, 40) + '…»: hay opciones repetidas.'); return; }
        Object.assign(it, { tipo: 'om', op: ops }); if (exp) it.exp = exp;
      } else if (vf != null) Object.assign(it, { tipo: 'vf', v: vf, exp: exp || '' });
      else if (r) Object.assign(it, { tipo: 'ab', r: r });
      else { err.push('«' + q.slice(0, 40) + '…»: falta opciones (A, B, C…), V/F o R (respuesta modelo).'); return; }
      out.push(it);
    });
    return { items: out, err: err };
  };
  MB.prompt = (tid, n) => {
    const t = (E.TEMAS || []).find(x => x.id === tid); if (!t) return '';
    return 'Escríbeme ' + n + ' preguntas para evaluar a alumnos de bachillerato técnico (Técnico en Mecatrónica, 3er semestre) sobre el tema «' + t.titulo + '».\n' +
      'Objetivo del tema: ' + t.objetivo + '\nConceptos clave: ' + (t.clave || []).map(k => k[0]).join(', ') + '.\n' +
      'Mezcla opción múltiple (4 opciones), verdadero o falso y una abierta; niveles 1 (recordar), 2 (comprender) y 3 (aplicar). Distractores creíbles y de largo parecido a la correcta; nada de «todas las anteriores».\n' +
      'Usa EXACTAMENTE este formato, sin texto extra, una pregunta por bloque y una línea en blanco entre bloques. En opción múltiple la A siempre es la correcta (la app revuelve las opciones):\n\n' +
      'TEMA: ' + t.id + '\nNIVEL: 2\nP: (pregunta)\nA) (correcta)\nB) (distractor)\nC) (distractor)\nD) (distractor)\nEXP: (por qué la A es correcta)\n\nNIVEL: 1\nP: (afirmación)\nV/F: V\nEXP: (explicación)\n\nNIVEL: 3\nP: (pregunta abierta)\nR: (respuesta modelo breve)';
  };

  /* ---------- vista ---------- */
  V.banco = () => {
    const ui = E.ui.mb = E.ui.mb || { tipo: 'om', tema: (temas()[0] || {}).id, prev: null };
    const pro = MB.items(), base = (E.BANCO || []).filter(b => String(b.id).indexOf('pp_') !== 0);
    let h = card('<h3>❓ Banco de preguntas</h3><p class="muted small">La app trae ' + base.length + ' preguntas; tú llevas ' + pro.length + '. Las tuyas entran solas a Ejercicios, Calentamiento, Boleto de salida y Examen recomendado, y se sincronizan con tu cuenta.</p>' +
      '<details class="sub" data-sec="mb-tab"><summary>Preguntas por tema</summary><table class="fc-glos"><thead><tr><th>Tema</th><th>De la app</th><th>Tuyas</th></tr></thead><tbody>' + temas().map(t => '<tr><td>' + esc(t.titulo) + '</td><td>' + base.filter(b => b.tema === t.id).length + '</td><td>' + pro.filter(b => b.tema === t.id).length + '</td></tr>').join('') + '</tbody></table></details>');
    const opt = sel => temas().map(t => '<option value="' + t.id + '"' + (t.id === sel ? ' selected' : '') + '>' + esc(t.titulo) + '</option>').join('');
    h += card('<h3>➕ Agregar una pregunta</h3><div class="fgrid c3"><label class="fld"><span>Tema</span><select data-ch="mb-ui" data-k="tema">' + opt(ui.tema) + '</select></label><label class="fld"><span>Tipo</span><select data-ch="mb-ui" data-k="tipo">' + Object.keys(TIPO).map(k => '<option value="' + k + '"' + (k === ui.tipo ? ' selected' : '') + '>' + TIPO[k] + '</option>').join('') + '</select></label><label class="fld"><span>Nivel</span><select id="mb-niv">' + [1, 2, 3].map(n => '<option value="' + n + '"' + (n === 2 ? ' selected' : '') + '>' + n + ' · ' + NIV[n] + '</option>').join('') + '</select></label></div>' +
      '<label class="fld"><span>Pregunta</span><textarea class="inp" id="mb-q" rows="2"></textarea></label>' +
      (ui.tipo === 'om' ? '<div class="fgrid"><label class="fld"><span>A) Correcta</span><input id="mb-a"></label><label class="fld"><span>B)</span><input id="mb-b"></label><label class="fld"><span>C)</span><input id="mb-c"></label><label class="fld"><span>D) (opcional)</span><input id="mb-d"></label></div><p class="muted small">Escribe la correcta en A: la app revuelve las opciones.</p>' :
        ui.tipo === 'vf' ? '<label class="fld"><span>Respuesta</span><select id="mb-vf"><option value="1">Verdadero</option><option value="0">Falso</option></select></label>' : '') +
      '<label class="fld"><span>' + (ui.tipo === 'ab' ? 'Respuesta modelo' : 'Explicación (opcional, sale al revelar)') + '</span><input id="mb-exp"></label>' + btn('Agregar', 'mb-add', '', 'primary'));
    h += card('<h3>🤖 Pídeselas a Claude</h3><p class="muted small">Copia las instrucciones, pégalas en tu chat con Claude y pega aquí abajo lo que te conteste.</p><div class="row gap wrap"><label class="fld grow"><span>Tema</span><select id="mb-pt">' + opt(ui.tema) + '</select></label><label class="fld"><span>Cuántas</span><input id="mb-pn" type="number" min="3" max="20" value="8" style="max-width:90px"></label></div>' + btn('📋 Copiar instrucciones', 'mb-prompt', '', ''));
    h += card('<h3>📥 Pegar varias</h3><p class="muted small">Una pregunta por bloque, con una línea en blanco entre bloques. <b>TEMA:</b> (id o título) · <b>NIVEL:</b> 1-3 · <b>P:</b> pregunta · <b>A) B) C) D)</b> opciones (A es la correcta, o agrega <b>CORRECTA: C</b>) · <b>V/F:</b> V o F · <b>R:</b> respuesta modelo · <b>EXP:</b> explicación.</p>' +
      '<textarea class="inp" id="mb-paste" rows="8" placeholder="TEMA: sm2-engranes&#10;NIVEL: 2&#10;P: ¿Qué deben compartir dos engranes para engranar?&#10;A) El módulo&#10;B) El número de dientes&#10;C) El diámetro&#10;D) El material">' + esc(ui.txt || '') + '</textarea>' + btn('Revisar', 'mb-revisar', '', '') +
      (ui.prev ? '<div class="mt">' + (ui.prev.err.length ? '<div class="note warn small">' + ui.prev.err.map(esc).join('<br>') + '</div>' : '') + (ui.prev.items.length ? '<p class="small"><b>' + ui.prev.items.length + '</b> listas para agregar:</p><ol class="small">' + ui.prev.items.map(x => '<li>' + esc(x.q) + ' <span class="muted">· ' + esc(tTit(x.tema)) + ' · ' + TIPO[x.tipo] + ' · nivel ' + x.niv + '</span></li>').join('') + '</ol>' + btn('Agregar ' + ui.prev.items.length, 'mb-pegar', '', 'primary') : '') + '</div>' : ''));
    if (pro.length) {
      const por = {}; pro.forEach(x => { (por[x.tema] = por[x.tema] || []).push(x); });
      h += card('<h3>Tus preguntas</h3>' + Object.keys(por).map(t => '<details class="sub" data-sec="mb-' + t + '"><summary>' + esc(tTit(t)) + ' (' + por[t].length + ')</summary><ul class="mb-list">' + por[t].map(x => '<li><div><b>' + esc(x.q) + '</b><br><small class="muted">' + TIPO[x.tipo] + ' · nivel ' + x.niv + ' · ' + esc(x.tipo === 'om' ? 'R: ' + x.op[0] : x.tipo === 'vf' ? (x.v ? 'Verdadero' : 'Falso') : x.r) + '</small></div>' + btn('🗑', 'mb-del', 'data-id="' + x.id + '" aria-label="Borrar"', 'small ghost') + '</li>').join('') + '</ul></details>').join(''));
    }
    return { t: 'Banco de preguntas', h: h };
  };
  const val = id => ((document.getElementById(id) || {}).value || '').trim();
  const guarda = its => S.update(KB, d => { d.items = (d.items || []).concat(its); }, { items: [] });
  CH['mb-ui'] = el => { const ui = E.ui.mb; ui[el.dataset.k] = el.value; E.render(); };
  A['mb-add'] = () => {
    const ui = E.ui.mb, q = val('mb-q'); if (!q) { u.toast('Escribe la pregunta', 'err'); return; }
    const it = { id: 'pp_' + u.uid('q').slice(2), tema: ui.tema, tipo: ui.tipo, niv: Number(val('mb-niv')) || 2, q: q, f: u.today(), propia: true }, ex = val('mb-exp');
    if (ui.tipo === 'om') { const ops = ['mb-a', 'mb-b', 'mb-c', 'mb-d'].map(val).filter(Boolean); if (ops.length < 3 || !val('mb-a')) { u.toast('Escribe la correcta (A) y al menos dos distractores', 'err'); return; } if (new Set(ops).size !== ops.length) { u.toast('Hay opciones repetidas', 'err'); return; } it.op = ops; if (ex) it.exp = ex; }
    else if (ui.tipo === 'vf') { it.v = val('mb-vf') === '1'; it.exp = ex; }
    else { if (!ex) { u.toast('Escribe la respuesta modelo', 'err'); return; } it.r = ex; }
    guarda([it]); u.toast('Agregada: ya sale en ejercicios y examen', 'ok');
  };
  A['mb-revisar'] = () => { E.ui.mb.txt = val('mb-paste'); E.ui.mb.prev = MB.parse(E.ui.mb.txt, null); E.render(); };
  A['mb-pegar'] = () => { const p = E.ui.mb.prev; if (!p || !p.items.length) return; guarda(p.items); u.toast(p.items.length + ' preguntas agregadas', 'ok'); E.ui.mb.prev = null; E.ui.mb.txt = ''; E.render(); };
  A['mb-del'] = el => { if (!confirm('¿Borrar esta pregunta?')) return; S.update(KB, d => { d.items = (d.items || []).filter(x => x.id !== el.dataset.id); }, { items: [] }); };
  A['mb-prompt'] = async () => { const t = val('mb-pt'), n = Math.max(3, Math.min(20, Number(val('mb-pn')) || 8)), ok = await u.copy(MB.prompt(t, n)); u.toast(ok ? 'Copiado: pégalo en tu chat con Claude' : 'No se pudo copiar', ok ? 'ok' : 'err', 4500); };
})();
