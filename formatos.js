/* Escuadra · Formatos de la escuela (v1.34.0). Se sube el Excel tal como lo manda control escolar (listas de asistencia y
   actas de calificaciones) y Escuadra lo llena SIN cambiar su formato: mismas hojas, mismas celdas, mismos estilos.
   - Acta: solo se llenan los parciales concluidos (cerrados en Escuadra o ya terminados); los demás quedan en blanco.
   - Lista de asistencia de un parcial: las fechas en el renglón de encabezado (día arriba, mes abajo, en letra chica para
     que se vean en la celda angosta) y, si se pide, la asistencia de cada alumno con los mismos símbolos de la app.
   El archivo se edita por dentro (XML) con JSZip para no tocar estilos, anchos ni combinaciones; la única fórmula que se
   cambia es la de la calificación final del acta, que no promediaba bien. */
(function () {
  const E = window.E, S = E.store, D = E.data, C = E.calc, u = E.u, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h, card = H.card, btn = H.btn;
  const FM = E.formatos = {};
  const KEY = 'formato:escuela', NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
  FM.JSZIP = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
  FM.SYM = { A: '•', F: 'F', R: 'R', J: 'J' };
  FM.doc = () => S.get(KEY);

  /* ---------- bytes ⇄ base64 ---------- */
  const aB64 = buf => { const b = new Uint8Array(buf); let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(s); };
  const deB64 = t => { const s = atob(t), b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i); return b; };

  /* ---------- leer el libro ---------- */
  const xml = t => new DOMParser().parseFromString(t, 'application/xml');
  const txt = d => { const x = new XMLSerializer().serializeToString(d); return /^<\?xml/.test(x) ? x : '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n' + x; };
  const colN = l => l.split('').reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0);
  const colL = n => { let s = ''; while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; };
  const parte = ref => { const m = /^([A-Z]+)(\d+)$/.exec(ref); return { c: colN(m[1]), r: +m[2] }; };
  FM.abrir = async (bytes) => {
    if (!window.JSZip) await u.loadScript(FM.JSZIP);
    const d = FM.doc(); bytes = bytes || (d && deB64(d.b64)); if (!bytes) throw new Error('Primero sube el Excel de la escuela');
    const zip = await window.JSZip.loadAsync(bytes);
    const wb = xml(await zip.file('xl/workbook.xml').async('string')), rels = xml(await zip.file('xl/_rels/workbook.xml.rels').async('string'));
    const rid = {}; Array.from(rels.getElementsByTagName('Relationship')).forEach(r => { rid[r.getAttribute('Id')] = r.getAttribute('Target'); });
    const hojas = Array.from(wb.getElementsByTagName('sheet')).map(s => { const t = rid[s.getAttribute('r:id') || s.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id')]; return { nombre: s.getAttribute('name'), path: 'xl/' + String(t).replace(/^\/?xl\//, '').replace(/^\//, '') }; });
    const ssF = zip.file('xl/sharedStrings.xml'), ss = [];
    if (ssF) { const sd = xml(await ssF.async('string')); Array.from(sd.getElementsByTagName('si')).forEach(si => { ss.push(Array.from(si.getElementsByTagName('t')).map(t => t.textContent).join('')); }); }
    const ctx = { zip: zip, wb: wb, hojas: hojas, ss: ss, docs: {} };
    for (const h of hojas) { const f = zip.file(h.path); if (f) ctx.docs[h.path] = xml(await f.async('string')); }
    hojas.forEach(h => { h.info = FM.info(ctx, h); });
    return ctx;
  };
  FM.celda = (doc, ref) => { const cs = doc.getElementsByTagName('c'); for (let i = 0; i < cs.length; i++) if (cs[i].getAttribute('r') === ref) return cs[i]; return null; };
  FM.leer = (ctx, doc, ref) => {
    const c = FM.celda(doc, ref); if (!c) return '';
    const t = c.getAttribute('t'), v = c.getElementsByTagName('v')[0];
    if (t === 's') return v ? (ctx.ss[+v.textContent] || '') : '';
    if (t === 'inlineStr') return Array.from(c.getElementsByTagName('t')).map(x => x.textContent).join('');
    return v ? v.textContent : '';
  };
  // qué es cada hoja: lista o acta, de qué grupo y carrera (renglones 3, 4 y 6 del formato)
  FM.info = (ctx, h) => {
    const d = ctx.docs[h.path]; if (!d) return null;
    const L = r => FM.leer(ctx, d, r), tit = u.norm(L('A6'));
    const tipo = /ACTA/.test(tit) ? 'acta' : /ASISTENCIA/.test(tit) ? 'lista' : null; if (!tipo) return null;
    return { tipo: tipo, carrera: L('A3').replace(/^CARRERA:\s*/i, '').trim(), semestre: L('A4').replace(/^SEMESTRE:\s*/i, '').trim(), grupo: L('C4').replace(/^GRUPO:\s*/i, '').trim() };
  };
  FM.deGrupo = (ctx, g) => {
    const ok = h => h.info && u.norm(h.info.grupo).replace(/[^0-9A-Z]/g, '') === u.norm(g.grupo).replace(/[^0-9A-Z]/g, '') && (!g.carrera || u.norm(h.info.carrera) === u.norm(g.carrera) || u.norm(h.info.carrera).split(' ').filter(w => w.length > 5 && w !== 'TECNICO').some(w => u.norm(g.carrera).indexOf(w) >= 0));
    return { lista: ctx.hojas.find(h => ok(h) && h.info.tipo === 'lista'), acta: ctx.hojas.find(h => ok(h) && h.info.tipo === 'acta') };
  };

  /* ---------- escribir sin tocar el formato ---------- */
  const fila = (doc, r) => {
    const sd = doc.getElementsByTagName('sheetData')[0], rows = sd.getElementsByTagName('row');
    for (let i = 0; i < rows.length; i++) { const n = +rows[i].getAttribute('r'); if (n === r) return rows[i]; if (n > r) { const nr = doc.createElementNS(NS, 'row'); nr.setAttribute('r', r); sd.insertBefore(nr, rows[i]); return nr; } }
    const nr = doc.createElementNS(NS, 'row'); nr.setAttribute('r', r); sd.appendChild(nr); return nr;
  };
  const celdaW = (doc, ref) => {
    let c = FM.celda(doc, ref); if (c) return c;
    const p = parte(ref), row = fila(doc, p.r), cs = row.getElementsByTagName('c');
    c = doc.createElementNS(NS, 'c'); c.setAttribute('r', ref); const izq = Array.from(cs).filter(x => parte(x.getAttribute('r')).c < p.c).pop(); if (izq && izq.getAttribute('s')) c.setAttribute('s', izq.getAttribute('s'));
    for (let i = 0; i < cs.length; i++) if (parte(cs[i].getAttribute('r')).c > p.c) { row.insertBefore(c, cs[i]); return c; }
    row.appendChild(c); return c;
  };
  const vaciar = c => { while (c.firstChild) c.removeChild(c.firstChild); c.removeAttribute('t'); };
  FM.num = (doc, ref, n) => { const c = celdaW(doc, ref); vaciar(c); if (n === '' || n == null) return; const v = doc.createElementNS(NS, 'v'); v.textContent = String(n); c.appendChild(v); };
  FM.str = (doc, ref, s, sz) => {
    const c = celdaW(doc, ref); vaciar(c); if (s === '' || s == null) return;
    c.setAttribute('t', 'inlineStr'); const is = doc.createElementNS(NS, 'is'), r = doc.createElementNS(NS, 'r');
    if (sz) { const rp = doc.createElementNS(NS, 'rPr'), z = doc.createElementNS(NS, 'sz'), f = doc.createElementNS(NS, 'rFont'); z.setAttribute('val', sz); f.setAttribute('val', 'Calibri'); rp.appendChild(z); rp.appendChild(f); r.appendChild(rp); }
    const t = doc.createElementNS(NS, 't'); t.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve'); t.textContent = String(s); r.appendChild(t); is.appendChild(r); c.appendChild(is);
  };
  // los alumnos del formato (desde el renglón 9 mientras haya número de lista)
  // el número puede venir como 1, «1.0» (Excel guardado desde Google Sheets o el celular) o vacío; se lee hasta que se acaban los nombres
  FM.filas = (ctx, doc) => { const out = []; let prev = 0;
    for (let r = 9; r < 300; r++) { const n = String(FM.leer(ctx, doc, 'A' + r)).trim(), nom = String(FM.leer(ctx, doc, 'B' + r)).trim(); if (!nom) break;
      let k = /^\d+(\.0+)?$/.test(n) ? Math.round(Number(n)) : n === '' ? prev + 1 : NaN; if (!(k > 0)) break;
      out.push({ r: r, num: k, nombre: nom.replace(/\s+/g, ' ') }); prev = k; }
    return out; };
  FM.empata = (filas, al) => { const porN = {}; al.forEach(a => { porN[u.norm(a.nombre)] = a; }); return filas.map(f => ({ f: f, a: porN[u.norm(f.nombre)] || al.find(a => +a.num === f.num && u.norm(a.nombre).split(' ')[0] === u.norm(f.nombre).split(' ')[0]) || null })); };
  FM.concluido = (g, p) => !!S.get('cerrado:' + g.id + ':' + p.id) || u.today() > p.fin;
  const recalcular = ctx => { const cp = ctx.wb.getElementsByTagName('calcPr')[0]; if (cp) cp.setAttribute('fullCalcOnLoad', '1'); else { const w = ctx.wb.documentElement, c = ctx.wb.createElementNS(NS, 'calcPr'); c.setAttribute('fullCalcOnLoad', '1'); w.appendChild(c); } };
  // al abrir el archivo se ve (y se imprime) solo la hoja que llenaste; las demás quedan ocultas, sin borrarse
  FM.enfocar = (ctx, hoja) => {
    const sh = Array.from(ctx.wb.getElementsByTagName('sheet')), idx = Math.max(0, sh.findIndex(s => s.getAttribute('name') === hoja));
    sh.forEach((s, i) => { if (i === idx) s.removeAttribute('state'); else if (s.getAttribute('state') !== 'veryHidden') s.setAttribute('state', 'hidden'); });
    const wv = ctx.wb.getElementsByTagName('workbookView')[0]; if (wv) { wv.setAttribute('activeTab', idx); wv.setAttribute('firstSheet', idx); }
    ctx.hojas.forEach(h => { const d = ctx.docs[h.path], sv = d && d.getElementsByTagName('sheetView')[0]; if (!sv) return; if (h.nombre === hoja) sv.setAttribute('tabSelected', '1'); else sv.removeAttribute('tabSelected'); });
  };
  const guardar = async (ctx, nombre, hoja) => {
    if (hoja) FM.enfocar(ctx, hoja);
    Object.keys(ctx.docs).forEach(p => ctx.zip.file(p, txt(ctx.docs[p]))); recalcular(ctx); ctx.zip.file('xl/workbook.xml', txt(ctx.wb));
    const blob = await ctx.zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', compression: 'DEFLATE' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nombre; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); return blob;
  };

  /* ---------- llenar ---------- */
  // acta: 1 PAR, ASIS, FAL (C, D, E) · 2 PAR (F, G, H) · 3 PAR (I, J, K); la calificación final queda con la fórmula corregida
  FM.llenarActa = (ctx, g) => {
    const h = FM.deGrupo(ctx, g).acta; if (!h) throw new Error('No encontré el acta de ' + g.grupo + ' en el Excel');
    const doc = ctx.docs[h.path], ps = D.parciales(), m = FM.empata(FM.filas(ctx, doc), C.actaAlumnos(g)), res = { hoja: h.nombre, llenos: 0, sin: [], parciales: [] };
    ps.slice(0, 3).forEach((p, i) => { if (FM.concluido(g, p)) res.parciales.push(p.nombre); });
    m.forEach(x => {
      if (!x.a) { res.sin.push(x.f.nombre); return; }
      const row = C.actaFila(g, x.a.id); res.llenos++;
      ps.slice(0, 3).forEach((p, i) => { const L = ['CDE', 'FGH', 'IJK'][i], ok = FM.concluido(g, p);
        for (let k = 0; k < 3; k++) { const v = row[i * 3 + k]; FM.num(doc, L[k] + x.f.r, ok && v !== '' && v != null ? v : ''); } });
    });
    res.formula = FM.arreglaFinal(doc);
    return res;
  };
  // la calificación final del acta: la fórmula de la escuela (=C9+F9+I9/3) solo dividía el 3er parcial entre 3. Se cambia
  // por el promedio de los 3 parciales, y queda en blanco mientras falte alguno (para que no salga un promedio a medias).
  FM.MALA = /^\s*=?\s*([A-Z]+)(\d+)\s*\+\s*([A-Z]+)\2\s*\+\s*([A-Z]+)\2\s*\/\s*3\s*$/;
  FM.arreglaFinal = doc => {
    const cs = Array.from(doc.getElementsByTagName('c')), master = {}; let n = 0;
    cs.forEach(c => { const f = c.getElementsByTagName('f')[0]; if (f && f.getAttribute('t') === 'shared' && f.getAttribute('ref')) master[f.getAttribute('si')] = f.textContent; });
    cs.forEach(c => {
      const f = c.getElementsByTagName('f')[0]; if (!f) return;
      const t = f.textContent || (f.getAttribute('t') === 'shared' ? master[f.getAttribute('si')] : ''), m = FM.MALA.exec(t || ''); if (!m) return;
      const r = parte(c.getAttribute('r')).r, x = [m[1] + r, m[3] + r, m[4] + r];
      f.removeAttribute('t'); f.removeAttribute('ref'); f.removeAttribute('si'); f.textContent = 'IF(COUNT(' + x.join(',') + ')<3,"",(' + x.join('+') + ')/3)';
      const v = c.getElementsByTagName('v')[0]; if (v) c.removeChild(v); c.removeAttribute('t'); n++;
    });
    return n;
  };
  // lista de asistencia de un parcial: fechas del C8 al AI8 (33 columnas) y, si se pide, la asistencia
  FM.COLS = 33;
  FM.llenarLista = (ctx, g, p, marcas) => {
    const h = FM.deGrupo(ctx, g).lista; if (!h) throw new Error('No encontré la lista de asistencia de ' + g.grupo + ' en el Excel');
    const doc = ctx.docs[h.path], fechas = C.fechasLista(g, p), usa = fechas.slice(0, FM.COLS), m = FM.empata(FM.filas(ctx, doc), D.alumnos(g));
    for (let i = 0; i < FM.COLS; i++) { const f = usa[i], ref = colL(3 + i) + '8'; FM.str(doc, ref, f ? f.slice(8, 10) + '\n' + f.slice(5, 7) : '', 6); }
    const docs = {}; usa.forEach(f => { docs[f] = S.get('asis:' + g.id + ':' + f) || null; });
    m.forEach(x => { for (let i = 0; i < FM.COLS; i++) { const f = usa[i], ref = colL(3 + i) + x.f.r; let s = '';
      if (marcas && f && x.a && docs[f]) { const st = C.marca(docs[f], x.a.id, (C.clasesCuenta(g, f) || [])[0]); s = st ? FM.SYM[st] || '' : ''; }
      FM.str(doc, ref, s); } });
    return { hoja: h.nombre, dias: fechas.length, fuera: Math.max(0, fechas.length - FM.COLS), sin: m.filter(x => !x.a).map(x => x.f.nombre) };
  };

  /* ---------- pantalla (en Imprimir) ---------- */
  const nombreArch = (g, que) => (que + '_' + g.grupo + '_' + u.today()).replace(/[^A-Za-z0-9_-]+/g, '_') + '.xlsx';
  FM.cardHTML = g => {
    const d = FM.doc(), ps = D.parciales(), cur = C.parcialActual();
    return card('<h3>📄 Formatos de la escuela (Excel)</h3><p class="muted small">Sube el Excel tal como lo manda control escolar. Escuadra llena tu lista y tu acta sin cambiar nada del formato.</p>' +
      (d ? '<p class="small">Archivo: <b>' + esc(d.nombre) + '</b> · subido el ' + esc(u.fCorta(d.fecha)) + (d.hojas ? ' · tu grupo: ' + esc(d.hojas) : '') + '</p>' : '<p class="small">Todavía no has subido el archivo.</p>') +
      '<div class="row gap wrap"><label class="btn ' + (d ? '' : 'primary ') + 'filebtn">' + (d ? 'Cambiar archivo' : 'Subir Excel de la escuela') + '<input type="file" accept=".xlsx" data-ch="fm-subir" hidden></label></div>' +
      (d ? '<div class="row gap wrap mt">' + btn('📄 Acta (parciales concluidos)', 'fm-acta', '', 'primary') + '</div>' +
        '<div class="row gap wrap mt"><select class="inp" id="fm-p" aria-label="Parcial">' + ps.map(p => '<option value="' + p.id + '"' + (p.id === cur.id ? ' selected' : '') + '>' + esc(p.nombre) + '</option>').join('') + '</select>' +
        btn('📋 Lista con asistencia', 'fm-lista', 'data-m="1"', '') + btn('📋 Lista solo con fechas', 'fm-lista', 'data-m="0"', 'ghost') + '</div>' +
        '<p class="muted small">El acta solo trae los parciales cerrados o ya terminados; los que siguen quedan en blanco. La calificación final se corrige para que sea el promedio de los 3 parciales (sale cuando ya están los 3). En la lista, cada fecha va con el día arriba y el mes abajo, en letra chica para que se lea en la celda angosta.</p>' : ''));
  };
  // guarda el Excel de la escuela como plantilla (también se usa desde la Muestra, si aún no habías subido uno)
  FM.guardarPlantilla = async (nombre, buf) => {
    const ctx = await FM.abrir(new Uint8Array(buf)), g = D.grupoActual(), mio = g ? FM.deGrupo(ctx, g) : {};
    S.put(KEY, { nombre: nombre, fecha: u.today(), b64: aB64(buf), hojas: [mio.lista && mio.lista.nombre, mio.acta && mio.acta.nombre].filter(Boolean).join(' y ') });
    return mio;
  };
  CH['fm-subir'] = async el => {
    const f = el.files && el.files[0]; if (!f) return;
    try {
      const buf = await f.arrayBuffer(); if (buf.byteLength > 3 * 1024 * 1024) { u.toast('El archivo pesa más de 3 MB', 'err'); return; }
      const mio = await FM.guardarPlantilla(f.name, buf);
      u.toast(mio.lista || mio.acta ? 'Listo: encontré ' + [mio.lista && 'tu lista', mio.acta && 'tu acta'].filter(Boolean).join(' y ') : 'Se guardó, pero no encontré hojas de tu grupo', mio.lista || mio.acta ? 'ok' : 'err', 4500);
    } catch (e) { u.toast('No pude leer el Excel: ' + e.message, 'err', 5000); }
  };
  A['fm-acta'] = async () => {
    const g = D.grupoActual(); try { u.toast('Llenando el acta…'); const ctx = await FM.abrir(), r = FM.llenarActa(ctx, g); await guardar(ctx, nombreArch(g, 'Acta'), r.hoja);
      u.toast('Acta lista: ' + r.llenos + ' alumnos' + (r.parciales.length ? ' · ' + r.parciales.join(', ') : ' · ningún parcial concluido todavía') + (r.sin.length ? ' · sin empatar: ' + r.sin.length : ''), 'ok', 6000);
    } catch (e) { u.toast(e.message, 'err', 5000); }
  };
  A['fm-lista'] = async el => {
    const g = D.grupoActual(), sel = document.getElementById('fm-p'), p = C.parcial(sel ? sel.value : C.parcialActual().id);
    try { u.toast('Llenando la lista…'); const ctx = await FM.abrir(), r = FM.llenarLista(ctx, g, p, el.dataset.m === '1'); await guardar(ctx, nombreArch(g, 'Lista_' + p.nombre), r.hoja);
      u.toast('Lista de ' + p.nombre + ': ' + r.dias + ' días' + (r.fuera ? ' (no cupieron ' + r.fuera + ')' : '') + (r.sin.length ? ' · sin empatar: ' + r.sin.length : ''), r.fuera ? 'err' : 'ok', 6000);
    } catch (e) { u.toast(e.message, 'err', 5000); }
  };
  if (V.imprimir) { const vi = V.imprimir; V.imprimir = function () { const o = vi.apply(null, arguments), g = D.grupoActual(); if (!o || !g || /Algo falló/.test(o.h)) return o; o.h = FM.cardHTML(g) + o.h; return o; }; }
})();
