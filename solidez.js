/* Escuadra · Solidez de la app (v1.26).
   18) Aviso de privacidad para madres, padres o tutores: texto base editable (qué datos, para qué, dónde se guardan,
       con quién se comparten y cómo ejercer sus derechos ante el plantel), uno por alumno con firma, y registro de firmas.
       La escuela es la responsable de los datos (Ley General de Protección de Datos Personales en Posesión de Sujetos
       Obligados): revísalo con la dirección.
   19) Semáforo accesible: íconos además de colores (✓ ! ✕), para daltonismo y para el proyector.
   20) Prueba de restauración: abre un respaldo SIN restaurarlo y comprueba qué trae; te recuerda hacerlo cada mes.
   21) Modo solo lectura: para proyectar o enseñar sin cambiar nada por accidente (en este aparato).
   22) Registro de cambios: cada calificación capturada, cambiada o borrada queda con fecha, hora, antes y después;
       se ve en la ficha del alumno y en Más → Registro de cambios. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const SO = E.solidez = {};
  const corto = (t, n) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; };

  /* ================= 21) SOLO LECTURA + 22) REGISTRO DE CAMBIOS (envuelven el guardado) ================= */
  const RO = 'escuadra.soloLectura';
  SO.ro = () => { try { return localStorage.getItem(RO) === '1'; } catch (e) { return false; } };
  const KC = (gid, mes) => 'cambios:' + gid + ':' + mes;
  const disp = () => /Mobi|Android|iPhone/i.test(navigator.userAgent || '') ? 'celular' : 'compu';
  let avisoRO = 0, ultUI = 0;
  ['click', 'change'].forEach(ev => document.addEventListener(ev, () => { ultUI = Date.now(); }, true));
  const put0 = S.put;
  S.put = function (key, data, opt) {
    if (SO.ro() && String(key).indexOf('cambios:') !== 0) { if (Date.now() - avisoRO > 2500) { avisoRO = Date.now(); u.toast('🔒 Solo lectura: no se guardó. Sal del modo en la franja de arriba.', 'err', 3500); } if (Date.now() - ultUI < 1500) setTimeout(() => E.render && E.render(), 0); return; }
    try { registra(key, data); } catch (e) { console.error(e); }
    return put0.call(this, key, data, opt);
  };
  const del0 = S.del;
  S.del = function (key) { if (SO.ro()) { u.toast('🔒 Solo lectura: no se borró.', 'err'); return; } return del0.call(this, key); };
  function registra(key, data) {
    const m = /^act:([^:]+):(.+)$/.exec(key); if (!m || !data || typeof data !== 'object') return;
    const prev = S.get(key) || {}, a0 = prev.notas || {}, a1 = data.notas || {}, ids = new Set(Object.keys(a0).concat(Object.keys(a1))), out = [];
    const vac = v => v === '' || v == null;
    ids.forEach(aid => { const x = a0[aid], y = a1[aid]; if ((vac(x) && vac(y)) || String(x) === String(y)) return; out.push({ t: new Date().toISOString(), aid: aid, act: data.id || m[2], n: corto(data.nombre || '', 60), de: vac(x) ? null : x, a: vac(y) ? null : y, d: disp() }); });
    if (!out.length) return; const mes = u.today().slice(0, 7), k = KC(m[1], mes), cur = S.get(k) || [];
    put0.call(S, k, cur.concat(out).slice(-4000), { silent: true });
  }
  SO.cambios = (gid, meses) => { const L = []; S.keys('cambios:' + gid + ':').sort().slice(-(meses || 6)).forEach(k => (S.get(k) || []).forEach(x => L.push(x))); return L.sort((a, b) => b.t.localeCompare(a.t)); };
  const hora = t => { const d = new Date(t); return u.fCorta(u.ymd(d)) + ' ' + d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }); };
  const fila = (g, x, conNombre) => { const a = D.alumno(g, x.aid); return '<li><span><b>' + hora(x.t) + '</b> · ' + (conNombre ? esc(a ? u.corto(a.nombre) : '¿?') + ' · ' : '') + esc(x.n) + '</span><span>' + (x.de == null ? '<span class="chip ok">capturó ' + esc(x.a) + '</span>' : x.a == null ? '<span class="chip bad">borró ' + esc(x.de) + '</span>' : '<span class="chip warn">' + esc(x.de) + ' → ' + esc(x.a) + '</span>') + ' <small class="muted">' + esc(x.d || '') + '</small></span></li>'; };
  V.cambios = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const L = SO.cambios(g.id, 6), ui = E.ui.cmb = E.ui.cmb || { solo: true };
    const X = ui.solo ? L.filter(x => x.de != null) : L;
    return { t: 'Registro de cambios', h: card('<h3>🕓 Registro de cambios · ' + esc(g.nombre) + '</h3><p class="small">Cada calificación capturada, cambiada o borrada (últimos 6 meses), con fecha, hora y aparato. Útil para aclaraciones: «el 12 de octubre capturé 80 y el 20 lo subí a 90 porque entregó la corrección».</p><label class="switch"><input type="checkbox" data-ch="cmb-solo"' + (ui.solo ? ' checked' : '') + '><span>Solo cambios y borrados (sin las capturas nuevas)</span></label>' +
      (X.length ? '<ul class="cmb-l">' + X.slice(0, 300).map(x => fila(g, x, true)).join('') + '</ul>' : '<p class="muted small">Sin cambios registrados todavía (el registro empezó con la v1.26).</p>')) };
  };
  CH['cmb-solo'] = el => { E.ui.cmb = { solo: el.checked }; E.render(); };
  if (V.alumno) { const va = V.alumno; V.alumno = function (id) { const o = va.apply(null, arguments), g = D.grupoActual(), a = g && D.alumno(g, id); if (o && a && !/Algo falló/.test(o.h)) { const L = SO.cambios(g.id, 6).filter(x => x.aid === a.id); if (L.length) o.h = E.fichaInsert(o.h, card('<details data-sec="al-cmb"><summary><b>🕓 Historial de calificaciones (' + L.length + ')</b></summary><ul class="cmb-l">' + L.slice(0, 40).map(x => fila(g, x, false)).join('') + '</ul></details>')); } return o; }; }
  // franja de solo lectura
  SO.franja = () => { let b = document.getElementById('ro-band'); if (SO.ro()) { if (!b) { b = document.createElement('button'); b.type = 'button'; b.id = 'ro-band'; b.className = 'ro-band'; b.dataset.act = 'ro-off'; b.textContent = '🔒 Solo lectura: puedes ver y proyectar, nada se guarda · toca para salir'; document.body.appendChild(b); } } else if (b) b.remove(); };
  A['ro-on'] = () => { try { localStorage.setItem(RO, '1'); } catch (e) { } SO.franja(); u.toast('Modo solo lectura activado en este aparato', 'ok'); E.render(); };
  A['ro-off'] = () => { try { localStorage.removeItem(RO); } catch (e) { } SO.franja(); u.toast('Ya puedes guardar cambios', 'ok'); E.render(); };
  document.addEventListener('DOMContentLoaded', () => setTimeout(SO.franja, 300));

  /* ================= 19) SEMÁFORO ACCESIBLE ================= */
  SO.aplicaA11y = () => { const on = !!D.cfg().semIconos; document.documentElement.classList.toggle('sem-ico', on); };
  const load0 = S.load; S.load = async function () { const r = await load0.apply(this, arguments); setTimeout(() => { try { SO.aplicaA11y(); } catch (e) { } }, 0); return r; };
  S.on(k => { if (k === 'config' || k === '__pull' || k === '__restore') { try { SO.aplicaA11y(); } catch (e) { } } });

  /* ================= 20) PRUEBA DE RESTAURACIÓN ================= */
  const meta = () => (E.sync && E.sync.meta ? E.sync.meta() : {});
  SO.revisa = d => {
    if (!d || d.app !== 'escuadra' || !d.docs || typeof d.docs !== 'object') throw new Error('Este archivo no es un respaldo de Escuadra.');
    const docs = d.docs, ks = Object.keys(docs).filter(k => docs[k] && !docs[k].deleted), dato = k => docs[k].data;
    const gs = ks.filter(k => k.indexOf('grupo:') === 0).map(dato).filter(Boolean), al = gs.reduce((s, g) => s + (g.alumnos || []).filter(a => a.activo !== false).length, 0);
    const acts = ks.filter(k => k.indexOf('act:') === 0), notas = acts.reduce((s, k) => s + Object.keys((dato(k) || {}).notas || {}).length, 0), asis = ks.filter(k => k.indexOf('asis:') === 0).length, planes = ks.filter(k => k.indexOf('plan:') === 0).length;
    const ult = ks.reduce((m, k) => docs[k].ts > m ? docs[k].ts : m, '');
    // contra lo que hay ahora en la app
    const cur = Object.keys(S.docs).filter(k => !S.docs[k].deleted), faltan = cur.filter(k => !docs[k]), nuevos = cur.filter(k => docs[k] && Date.parse(S.docs[k].ts) > Date.parse(docs[k].ts));
    return { fecha: d.fecha, version: d.version, docs: ks.length, grupos: gs.map(g => g.nombre || g.id), alumnos: al, acts: acts.length, notas: notas, asis: asis, planes: planes, ult: ult, faltan: faltan.length, nuevos: nuevos.length, actual: cur.length };
  };
  CH['rs-probar'] = async el => {
    const f = el.files && el.files[0]; if (!f) return;
    try { const r = SO.revisa(JSON.parse(await f.text())); E.ui.rsP = Object.assign(r, { archivo: f.name, ok: true }); if (E.sync && E.sync.setMeta) E.sync.setMeta({ lastRestoreTest: u.now() }); }
    catch (e) { E.ui.rsP = { ok: false, archivo: f.name, err: e.message }; }
    E.render();
  };
  V.respaldo = () => {
    const m = meta(), db = m.lastBackupAt ? u.diffDays(String(m.lastBackupAt).slice(0, 10), u.today()) : null, dt = m.lastRestoreTest ? u.diffDays(String(m.lastRestoreTest).slice(0, 10), u.today()) : null, r = E.ui.rsP, sinc = !!(E.sync && E.sync.user);
    let h = card('<h3>💾 Respaldo y prueba de restauración</h3><p class="small">Un respaldo solo sirve si se puede restaurar. Una vez al mes descárgalo y pruébalo aquí: la app lo abre <b>sin restaurarlo</b> y te dice qué trae.</p>' +
      '<div class="en-kpis"><div class="' + (db == null || db > 30 ? 'warn' : 'ok') + '"><b>' + (db == null ? '—' : db === 0 ? 'hoy' : 'hace ' + db + ' d') + '</b><span>último respaldo</span></div><div class="' + (dt == null || dt > 31 ? 'warn' : 'ok') + '"><b>' + (dt == null ? '—' : dt === 0 ? 'hoy' : 'hace ' + dt + ' d') + '</b><span>última prueba</span></div><div class="' + (sinc ? 'ok' : 'warn') + '"><b>' + (sinc ? '☁️' : '📱') + '</b><span>' + (sinc ? 'sincronizado' : 'solo en este aparato') + '</span></div></div>' +
      '<div class="row gap wrap">' + btn(E.icon('download') + ' 1. Descargar respaldo', 'backup-dl', '', 'primary') + '<label class="btn filebtn">🧪 2. Probar un respaldo<input type="file" accept=".json" data-ch="rs-probar" hidden></label>' + link('Restaurar (Ajustes)', 'ajustes/datos', 'small ghost') + '</div>');
    if (r) h += card(r.ok ? '<h3>✓ El respaldo se puede restaurar</h3><p class="small"><b>' + esc(r.archivo) + '</b> · hecho el ' + esc(String(r.fecha || r.ult || '').slice(0, 10)) + ' con la v' + esc(r.version || '¿?') + '</p><ul class="small"><li>' + r.docs + ' documentos</li><li>Grupos: ' + esc(r.grupos.join(', ') || '—') + ' · ' + r.alumnos + ' alumnos</li><li>' + r.acts + ' actividades con ' + r.notas + ' calificaciones</li><li>' + r.asis + ' días de asistencia · ' + r.planes + ' planeaciones</li></ul>' +
      (r.nuevos || r.faltan ? '<p class="note warn small">Desde ese respaldo cambiaste ' + r.nuevos + ' documentos y creaste ' + r.faltan + ' nuevos: si lo restauras, esos cambios no se pierden (se queda la versión más nueva de cada documento), pero conviene descargar uno de hoy.</p>' : '<p class="note ok small">Coincide con lo que tienes ahora.</p>')
      : '<h3>✕ No se pudo leer</h3><p class="note bad small">' + esc(r.archivo) + ': ' + esc(r.err) + '</p>');
    return { t: 'Respaldo', h: h };
  };
  (E.inicioExtras = E.inicioExtras || []).push(() => { const m = meta(), dt = m.lastRestoreTest ? u.diffDays(String(m.lastRestoreTest).slice(0, 10), u.today()) : 999; if (dt <= 31 || Number(u.today().slice(8)) < 25) return ''; return card('<div class="row between gap wrap"><p class="small">🧪 Este mes no has probado tu respaldo. Toma un minuto.</p>' + link('Probar', 'respaldo', 'small') + '</div>'); });

  /* ================= 18) AVISO DE PRIVACIDAD ================= */
  const KP = 'privCfg', KF = g => 'priv:' + g.id;
  SO.aviso = () => {
    const cf = D.cfg(), d = S.get(KP) || {};
    return d.texto || ['Responsable: ' + (cf.plantel || '[nombre del plantel]') + '. Los datos los maneja el docente ' + (cf.docente || '[nombre]') + ' para la asignatura que imparte.',
      'Datos que se usan: nombre del alumno(a), número de lista, asistencia, calificaciones y trabajos; teléfono de su madre, padre o tutor(a) y contacto de emergencia (si la familia los da); fotos de trabajos y prácticas, nunca del rostro.',
      'Para qué: llevar el control de asistencia y calificaciones, avisar a la familia sobre el avance, atender emergencias y reconocer logros. No se usan para otro fin.',
      'Dónde se guardan: en el celular o computadora del docente y en un servicio de almacenamiento en la nube con acceso solo con su usuario y contraseña. Los enlaces o códigos QR de consulta llevan los datos dentro del enlace, sin nombre completo.',
      'Con quién se comparten: solo con la dirección y el personal del plantel que lo necesite (por ejemplo, control escolar o tutoría). No se venden ni se entregan a terceros, salvo que la ley lo pida.',
      'Sus derechos: puede pedir acceso, corrección o cancelación de los datos, u oponerse a su uso, ante la dirección del plantel.',
      'Si no está de acuerdo con algún punto (por ejemplo, las fotos de trabajos o el teléfono), indíquelo abajo y se respetará.'].join('\n');
  };
  V.privacidad = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const al = D.alumnos(g); if (!al.length) return H.needAlumnos('Aviso de privacidad');
    const fir = S.get(KF(g)) || {}, n = al.filter(a => fir[a.id]).length;
    let h = card('<h3>🔐 Aviso de privacidad para las familias</h3><p class="small">Escuadra guarda datos de menores de edad. Un aviso sencillo, firmado por la familia, deja claro qué datos usas y para qué. <b>La escuela es la responsable</b> de los datos personales y puede tener su propio aviso: revísalo con la dirección antes de entregarlo.</p>' +
      '<div class="en-kpis"><div class="' + (n === al.length ? 'ok' : 'warn') + '"><b>' + n + '/' + al.length + '</b><span>firmados</span></div></div><div class="row gap wrap">' + btn('🖨 Uno por alumno (con firma)', 'pv-print', '', 'primary small') + '</div>');
    h += card('<details data-sec="pv-txt"><summary><b>✏️ Texto del aviso</b> (uno por renglón)</summary><textarea class="inp" id="pv-t" rows="12">' + esc(SO.aviso()) + '</textarea><div class="row gap wrap mt">' + btn('Guardar texto', 'pv-save', '', 'small') + btn('Volver al texto base', 'pv-base', '', 'small ghost') + '</div></details>');
    h += card('<h3>✍️ ¿Quién lo firmó?</h3>' + (E.rap ? E.rap.filtroHTML('privacidad') : '') + '<ul class="sg-l">' + al.map(a => '<li' + (E.rap ? E.rap.qAttr(a) : '') + '><span><b>' + a.num + '.</b> ' + esc(a.nombre) + '</span>' + btn(fir[a.id] ? '✓ ' + u.fCorta(fir[a.id]) : 'Firmó', 'pv-firma', 'data-aid="' + a.id + '"', 'small' + (fir[a.id] ? ' on ok' : '')) + '</li>').join('') + '</ul>');
    return { t: 'Aviso de privacidad', h: h };
  };
  A['pv-save'] = () => { const t = ((document.getElementById('pv-t') || {}).value || '').trim(); S.update(KP, d => { d.texto = t; }, {}); u.toast('Texto guardado', 'ok'); };
  A['pv-base'] = () => { if (!confirm('¿Volver al texto base?')) return; S.update(KP, d => { delete d.texto; }, {}); };
  A['pv-firma'] = el => { const g = D.grupoActual(); S.update(KF(g), d => { if (d[el.dataset.aid]) delete d[el.dataset.aid]; else d[el.dataset.aid] = u.today(); }, {}); };
  A['pv-print'] = () => { const g = D.grupoActual(), cf = D.cfg(), L = SO.aviso().split('\n').filter(x => x.trim());
    E.print.run('<div class="pr">' + D.alumnos(g).map(a => '<div class="p-title">AVISO DE PRIVACIDAD PARA MADRES, PADRES O TUTORES</div><p class="tiny c">' + esc(cf.plantel || '') + ' · ' + esc(g.nombre) + '</p><p>Alumno(a): <b>' + esc(a.nombre) + '</b> · No. ' + a.num + '</p><ol class="small">' + L.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol><p class="small">No autorizo (marque si aplica): ☐ fotos de trabajos ☐ guardar mi teléfono ☐ consulta por QR</p><div class="firmas"><div>Nombre y firma de la madre, padre o tutor(a)</div><div>Fecha</div></div><div class="pbreak"></div>').join('') + '</div>', { title: 'Aviso de privacidad', margin: '14mm' }); };

  /* ================= Ajustes: accesibilidad y proyector ================= */
  if (V.ajustes) { const va = V.ajustes; V.ajustes = function () { const o = va.apply(null, arguments); if (!o || /Algo falló/.test(o.h)) return o; const c = D.cfg();
    o.h += card('<h3>👁 Accesibilidad y proyector</h3><label class="switch"><input type="checkbox" data-ch="cfg" data-path="semIconos" ' + (c.semIconos ? 'checked' : '') + '><span>Semáforo con íconos además de colores (✓ va bien · ! regular · ✕ va mal): para daltonismo y proyector</span></label>' +
      '<p class="small">' + (SO.ro() ? btn('🔓 Salir de solo lectura', 'ro-off', '', 'small primary') : btn('🔒 Modo solo lectura en este aparato', 'ro-on', '', 'small')) + ' <span class="muted">Para proyectar o enseñar la app sin cambiar nada por accidente.</span></p>' +
      '<p class="small">' + link('🧪 Probar mi respaldo', 'respaldo', 'small ghost') + ' ' + link('🕓 Registro de cambios', 'cambios', 'small ghost') + ' ' + link('🔐 Aviso de privacidad', 'privacidad', 'small ghost') + '</p>');
    return o; }; }
})();
