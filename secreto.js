/* Escuadra · Datos delicados protegidos (v1.27).
   El teléfono de casa, el contacto y teléfono de emergencia, el número del seguro facultativo y las notas de emergencia
   (y desde la v1.28 los adeudos e inscripción y el seguimiento y notas de tutoría)
   se guardan CIFRADOS (AES-GCM 256, llave derivada de tu PIN con PBKDF2-SHA-256, 600 000 iteraciones) en este aparato
   y en Supabase: sin tu PIN nadie los puede leer, ni siquiera con acceso a la base de datos o a un respaldo.
   - El PIN no se guarda en ningún lado ni va en el código. Se guarda solo un «testigo» cifrado para saber si es el correcto.
   - «Recordar en este aparato» guarda la llave (no el PIN) en el navegador, sin que se pueda exportar.
   - Si olvidas el PIN, esos datos no se pueden recuperar: lo demás de la app (listas, calificaciones) no se cifra.
   Funciona así: al guardar un grupo, los campos delicados salen del documento y entran cifrados en «sec»; al leerlo,
   la app junta lo descifrado (que vive solo en memoria) con el resto. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const SC = E.secreto = {};
  const F = ['tel', 'emNom', 'emTel', 'nss', 'emNota'], KCFG = 'secCfg', ITER = 600000;
  const vac = v => v === '' || v == null;
  let llave = null, mapa = {}, ver = 0, pendiente = {};
  SC.cfg = () => S.get(KCFG) || null;
  SC.activa = () => { const c = SC.cfg(); return !!(c && c.salt && c.check); };
  SC.abierta = () => !!llave;
  const b64 = by => { let s = ''; const a = new Uint8Array(by); for (let i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); return btoa(s); };
  const unb64 = s => { const b = atob(s), a = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; };
  const deriva = async (pin, salt, it) => { const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(String(pin)), 'PBKDF2', false, ['deriveKey']); return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: unb64(salt), iterations: it || ITER, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']); };
  const cifra = async (k, obj) => { const iv = crypto.getRandomValues(new Uint8Array(12)); const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, k, new TextEncoder().encode(JSON.stringify(obj))); return { iv: b64(iv), ct: b64(ct) }; };
  const descifra = async (k, x) => JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(x.iv) }, k, unb64(x.ct))));

  /* ---------- llave recordada en este aparato (IndexedDB aparte; la llave no se puede exportar) ---------- */
  const kdb = () => new Promise((res, rej) => { const r = indexedDB.open('escuadra-llave', 1); r.onupgradeneeded = () => r.result.createObjectStore('k'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const kGet = async () => { try { const db = await kdb(); return await new Promise(res => { const q = db.transaction('k').objectStore('k').get('llave'); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); }); } catch (e) { return null; } };
  const kSet = async v => { try { const db = await kdb(); await new Promise(res => { const t = db.transaction('k', 'readwrite'); if (v) t.objectStore('k').put(v, 'llave'); else t.objectStore('k').delete('llave'); t.oncomplete = res; t.onerror = res; }); } catch (e) { } };

  /* ---------- leer: juntar lo descifrado (en memoria) con el grupo ---------- */
  const cache = {};
  const get0 = S.get;
  /* v1.28: también van cifrados completos los adeudos (materias, pagos, documentos, inscripción) y el seguimiento y las
     notas de tutoría. En el documento queda solo {__enc, sec}; lo descifrado vive en memoria (docMem). */
  const DOCS = ['tutadeu:', 'tutseg:'];
  const esDoc = k => DOCS.some(p => String(k).indexOf(p) === 0);
  SC.esDoc = esDoc;
  const docMem = {}, deciendo = {}, cola = {}, fallo = {}, enVuelo = new Set();
  const descifraDoc = key => {
    if (!llave || deciendo[key]) return; const raw = get0.call(S, key); if (!raw || !raw.__enc) return;
    const ts = (S.docs[key] || {}).ts, k = llave; deciendo[key] = true;
    descifra(k, raw.sec).then(d => { if ((S.docs[key] || {}).ts === ts && llave === k && !(docMem[key] && docMem[key].pend)) { delete fallo[key]; docMem[key] = { ts: ts, data: d }; if (E.render) E.render(); } }, e => { console.warn('No se pudo descifrar ' + key, e); fallo[key] = ts; if (E.render) E.render(); }).finally(() => { delete deciendo[key]; });
  };
  const getDoc = function (key) {
    const raw = get0.call(this, key); if (!raw || !raw.__enc) return raw;
    if (!llave) return undefined;
    const m = docMem[key], ts = (this.docs[key] || {}).ts; if (m && (m.pend || m.ts === ts)) return m.data;
    if (fallo[key] === ts) return undefined;
    descifraDoc(key); return m ? m.data : undefined;
  };
  const docsTut = () => S.keys('tutadeu:').concat(S.keys('tutseg:'));
  SC.docBloqueado = () => SC.activa() && ((!llave && docsTut().some(k => (get0.call(S, k) || {}).__enc)) || Object.keys(fallo).length > 0);
  S.get = function (key) {
    if (esDoc(key)) return getDoc.call(this, key);
    const d = get0.call(this, key);
    if (!d || !llave || String(key).indexOf('grupo:') !== 0 || !Array.isArray(d.alumnos)) return d;
    const ts = (this.docs[key] || {}).ts + '|' + ver, c = cache[key]; if (c && c.ts === ts) return c.d;
    const out = Object.assign({}, d, { alumnos: d.alumnos.map(a => { const m = mapa[a.id]; return m ? Object.assign({}, a, m) : a; }) });
    cache[key] = { ts: ts, d: out }; return out;
  };
  /* ---------- guardar: los campos delicados nunca entran al documento en claro ---------- */
  const put0 = S.put;
  const putDoc = (key, data, opt) => {
    if (data && data.__enc) { delete docMem[key]; return put0.call(S, key, data, opt); }
    // bloqueada: no se guarda nada de tutoría (ni documentos nuevos, que quedarían en claro)
    if (!llave) { u.toast('🔒 Desbloquea con tu PIN para guardar los datos de tutoría', 'err', 4500); return; }
    // solo se escribe encima de lo que ya se pudo abrir con esta llave (si no, se perdería lo de otro aparato)
    const raw = get0.call(S, key), m0 = docMem[key];
    if (raw && raw.__enc && !(m0 && (m0.pend || m0.ts === (S.docs[key] || {}).ts))) { descifraDoc(key); u.toast(fallo[key] ? '🔒 No pude abrir estos datos de tutoría con tu PIN. Desbloquea de nuevo.' : 'Un momento: abriendo los datos de tutoría. Intenta otra vez.', 'err', 4500); return; }
    const copia = u.clone(data); docMem[key] = { pend: true, data: copia }; if (E.render) E.render();
    const k = llave;
    cola[key] = (cola[key] || Promise.resolve()).then(() => cifra(k, copia)).then(sec => {
      if (llave !== k || docMem[key] && docMem[key].data !== copia) return;
      const run = fn => (E.undo ? E.undo.run('tut-cifra', fn) : fn());
      run(() => put0.call(S, key, { __enc: 1, sec: sec }, opt));
      docMem[key] = { ts: (S.docs[key] || {}).ts, data: copia };
    }).catch(e => { console.error(e); if (docMem[key] && docMem[key].data === copia) delete docMem[key]; if (E.render) E.render(); u.toast('No se guardó: no se pudo cifrar (' + e.message + ')', 'err', 5000); });
  };
  if (E.undo && E.undo.NOMBRE) E.undo.NOMBRE['tut-cifra'] = 'tutoría';
  S.put = function (key, data, opt) {
    if (esDoc(key) && SC.activa()) return putDoc(key, data, opt);
    if (!SC.activa() || String(key).indexOf('grupo:') !== 0 || !data || !Array.isArray(data.alumnos)) return put0.call(this, key, data, opt);
    const raw = get0.call(this, key) || {}, viejo = {}; (raw.alumnos || []).forEach(a => { viejo[a.id] = a; });
    const cambia = [], d2 = Object.assign({}, data, { alumnos: data.alumnos.map(a => {
      const b = Object.assign({}, a), val = {}; let hay = false; F.forEach(f => { if (f in b) { hay = true; val[f] = vac(b[f]) ? '' : String(b[f]); } delete b[f]; });
      const ant = viejo[a.id]; if (!b.sec && ant && ant.sec) b.sec = ant.sec;
      if (hay) {
        if (llave) { const m = mapa[a.id] || {}; if (F.some(f => (val[f] || '') !== (m[f] || '') && f in val) || (!b.sec && F.some(f => val[f]))) { mapa[a.id] = Object.assign({}, m, val); cambia.push(a.id); } }
        else if (F.some(f => val[f]) && !(b.sec)) { pendiente[a.id] = Object.assign(pendiente[a.id] || {}, val); }
      }
      return b; }) });
    if (!llave && Object.keys(pendiente).length) u.toast('🔒 Desbloquea los datos protegidos para guardar teléfonos y datos de emergencia', 'err', 5000);
    const r = put0.call(this, key, d2, opt);
    if (cambia.length) { ver++; recifra(key, cambia); }
    return r;
  };
  async function recifra(key, ids) {
    const k = llave; if (!k) return; const sec = {}; ids.forEach(id => enVuelo.add(id));
    try { for (const id of ids) { const m = mapa[id] || {}; sec[id] = F.some(f => m[f]) ? await cifra(k, m) : null; } } finally { ids.forEach(id => enVuelo.delete(id)); }
    if (llave !== k) return;
    const cur = get0.call(S, key); if (!cur) return;
    const d = Object.assign({}, cur, { alumnos: cur.alumnos.map(a => { if (!(a.id in sec)) return a; const b = Object.assign({}, a); if (sec[a.id]) b.sec = sec[a.id]; else delete b.sec; return b; }) });
    put0.call(S, key, d, { silent: true });
  }
  // descifra todos los grupos (al desbloquear y cuando llegan datos de otro aparato)
  SC.descifraTodo = async () => {
    if (!llave) return; const nuevo = {};
    for (const k of S.keys('grupo:')) { const g = get0.call(S, k); for (const a of ((g && g.alumnos) || [])) { if (!a.sec) continue; try { nuevo[a.id] = Object.assign(nuevo[a.id] || {}, await descifra(llave, a.sec)); } catch (e) { console.warn('No se pudo descifrar', a.id); } } }
    // se rehace desde lo guardado (si algo se revirtió, no queda el dato viejo en memoria); se respeta lo que se está cifrando
    const quedan = {}; enVuelo.forEach(id => { if (mapa[id]) quedan[id] = mapa[id]; }); mapa = Object.assign({}, nuevo, quedan); ver++;
    for (const k of docsTut()) {
      const raw = get0.call(S, k); if (!raw || !raw.__enc || (docMem[k] && docMem[k].pend)) continue; const ts = (S.docs[k] || {}).ts;
      try { const d = await descifra(llave, raw.sec); if ((S.docs[k] || {}).ts === ts && !(docMem[k] && docMem[k].pend)) { docMem[k] = { ts: ts, data: d }; delete fallo[k]; } }
      catch (e) { console.warn('No se pudo descifrar ' + k, e); fallo[k] = ts; }
    }
    if (E.render) E.render();
  };
  const olvida = () => { llave = null; mapa = {}; Object.keys(docMem).forEach(k => { delete docMem[k]; }); Object.keys(fallo).forEach(k => { delete fallo[k]; }); ver++; };
  SC.verifica = async () => {
    if (!llave) return false; const c = SC.cfg();
    let ok = false; if (c) { try { ok = (await descifra(llave, c.check)) === 'escuadra-ok'; } catch (e) { ok = false; } }
    if (!ok) { olvida(); await kSet(null); if (c) u.toast('🔒 Tu PIN cambió (en otro aparato o al restaurar). Desbloquea de nuevo.', 'err', 6000); if (E.render) E.render(); }
    return ok;
  };
  S.on(k => { if ((k === '__pull' || k === '__restore') && llave) SC.verifica().then(ok => { if (!ok) return; return SC.descifraTodo().then(() => SC.migra()).then(n => { if (n) avisaMigra(n); }); }).catch(e => console.error(e)); });
  // al cifrar datos que estaban en claro, los respaldos y el historial anteriores los traen en claro: se reemplazan por uno nuevo
  const avisaMigra = n => { if (E.historial && E.historial.borrar) E.historial.borrar(); if (E.respaldo && E.respaldo.purgaClaro) E.respaldo.purgaClaro('después de cifrar datos que estaban en claro').catch(e => console.warn(e)); };

  /* ---------- activar, desbloquear, bloquear, quitar ---------- */
  // pasa a cifrado lo que esté en claro en todos los grupos (activación o datos viejos)
  SC.migra = async () => {
    if (!llave) return 0; let n = 0;
    for (const k of S.keys('grupo:')) {
      const g = get0.call(S, k); if (!g || !Array.isArray(g.alumnos)) continue; let toca = false;
      const al = [];
      for (const a of g.alumnos) {
        const val = {}; F.forEach(f => { if (!vac(a[f])) val[f] = String(a[f]); });
        if (!Object.keys(val).length) { al.push(a); continue; }
        let prev = {}; if (a.sec) { try { prev = await descifra(llave, a.sec); } catch (e) { prev = {}; } }
        const m = Object.assign({}, prev, val); mapa[a.id] = Object.assign({}, mapa[a.id] || {}, m);
        const b = Object.assign({}, a); F.forEach(f => { delete b[f]; }); b.sec = await cifra(llave, m); al.push(b); toca = true; n++;
      }
      if (toca) { if (get0.call(S, k) !== g) continue; put0.call(S, k, Object.assign({}, g, { alumnos: al })); }
    }
    for (const k of docsTut()) { const raw = get0.call(S, k); if (!raw || raw.__enc) continue; const ts = (S.docs[k] || {}).ts, sec = await cifra(llave, raw); if ((S.docs[k] || {}).ts !== ts) continue; put0.call(S, k, { __enc: 1, sec: sec }); docMem[k] = { ts: (S.docs[k] || {}).ts, data: raw }; n++; }
    // lo que se escribió estando bloqueado
    const pd = pendiente; pendiente = {};
    for (const id of Object.keys(pd)) { mapa[id] = Object.assign({}, mapa[id] || {}, pd[id]); for (const k of S.keys('grupo:')) { const g = get0.call(S, k); if (g && (g.alumnos || []).some(a => a.id === id)) await recifra(k, [id]); } }
    ver++; return n;
  };
  SC.activar = async (pin, recordar) => {
    const salt = b64(crypto.getRandomValues(new Uint8Array(16))), k = await deriva(pin, salt), check = await cifra(k, 'escuadra-ok');
    put0.call(S, KCFG, { v: 1, salt: salt, check: check, iter: ITER, desde: u.today() });
    llave = k; if (recordar) await kSet(k); const n = await SC.migra(); await SC.descifraTodo(); avisaMigra(n); return n;
  };
  SC.abrir = async (pin, recordar) => {
    const c = SC.cfg(); if (!c) return false; let k; try { k = await deriva(pin, c.salt, c.iter); if ((await descifra(k, c.check)) !== 'escuadra-ok') return false; } catch (e) { return false; }
    llave = k; if (recordar) await kSet(k); await SC.descifraTodo(); const n = await SC.migra(); if (n) avisaMigra(n); return true;
  };
  SC.bloquear = async olvidar => { await Promise.all(Object.keys(cola).map(k => cola[k].catch(() => { }))); olvida(); if (olvidar) await kSet(null); if (E.render) E.render(); };
  // quitar la protección: primero se abre TODO; si algo no se puede abrir con este PIN, no se quita nada
  SC.quitar = async () => {
    if (!llave || !(await SC.verifica())) return false;
    const gr = {}, dc = {};
    try {
      for (const k of S.keys('grupo:')) { const g = get0.call(S, k); if (!g || !Array.isArray(g.alumnos)) continue; const al = []; for (const a of g.alumnos) { const b = Object.assign({}, a); if (a.sec) Object.assign(b, await descifra(llave, a.sec)); delete b.sec; al.push(b); } gr[k] = { g: g, al: al }; }
      for (const k of docsTut()) { const raw = get0.call(S, k); if (raw && raw.__enc) dc[k] = { raw: raw, d: await descifra(llave, raw.sec) }; }
    } catch (e) { console.error(e); u.toast('No pude abrir todos los datos con este PIN; la protección se queda como está.', 'err', 6000); return false; }
    await Promise.all(Object.keys(cola).map(k => cola[k].catch(() => { })));
    Object.keys(gr).forEach(k => { if (get0.call(S, k) === gr[k].g) put0.call(S, k, Object.assign({}, gr[k].g, { alumnos: gr[k].al })); });
    Object.keys(dc).forEach(k => { if (get0.call(S, k) === dc[k].raw) put0.call(S, k, dc[k].d); });
    S.del(KCFG); olvida(); await kSet(null); return true;
  };
  // al arrancar: si la llave quedó recordada en este aparato, abre solo
  const load0 = S.load; S.load = async function () { const r = await load0.apply(this, arguments); try { if (SC.activa()) { const k = await kGet(); if (k) { const c = SC.cfg(); try { if ((await descifra(k, c.check)) === 'escuadra-ok') { llave = k; await SC.descifraTodo(); await SC.migra(); } } catch (e) { await kSet(null); } } } } catch (e) { console.warn(e); } return r; };

  /* ---------- pantallas ---------- */
  SC.candado = (txt) => card('<div class="row between gap wrap"><p class="small">🔒 ' + esc(txt || 'Teléfonos y datos de emergencia protegidos con tu PIN.') + '</p>' + btn('Desbloquear', 'sc-pide', '', 'small primary') + '</div>');
  A['sc-pide'] = () => E.modal.open('🔒 Datos protegidos', '<p class="small">Escribe tu PIN para ver y editar teléfonos, datos de emergencia y lo protegido de Tutoría.</p><label class="fld"><span>PIN</span><input class="inp" id="sc-pin" type="password" inputmode="numeric" maxlength="12" autocomplete="off"></label><label class="switch"><input type="checkbox" id="sc-rec" checked><span>Recordar en este aparato</span></label><div class="row gap wrap">' + btn('Desbloquear', 'sc-abrir', '', 'primary') + '</div><p class="muted small">El PIN no se guarda; con «recordar» se guarda una llave que no se puede copiar fuera del navegador.</p>');
  A['sc-abrir'] = async () => { const pin = ((document.getElementById('sc-pin') || {}).value || '').trim(), rec = (document.getElementById('sc-rec') || {}).checked; const ok = await SC.abrir(pin, rec); if (!ok) { u.toast('PIN incorrecto', 'err'); return; } E.modal.close(); u.toast('Datos protegidos desbloqueados', 'ok'); E.render(); };
  A['sc-bloq'] = () => SC.bloquear(true);
  A['sc-activar'] = async () => {
    const p1 = ((document.getElementById('sc-p1') || {}).value || '').trim(), p2 = ((document.getElementById('sc-p2') || {}).value || '').trim(), rec = (document.getElementById('sc-rec2') || {}).checked;
    if (!/^\d{4,12}$/.test(p1)) { u.toast('El PIN debe tener de 4 a 12 números', 'err'); return; } if (p1 !== p2) { u.toast('Los dos PIN no coinciden', 'err'); return; }
    if (!confirm('Si olvidas este PIN, los teléfonos, datos de emergencia y datos de tutoría no se podrán recuperar. Los respaldos diarios y el historial de cambios anteriores (que los traen sin cifrar) se reemplazan por uno nuevo ya cifrado. ¿Activar la protección?')) return;
    const n = await SC.activar(p1, rec); u.toast('Protección activada: ' + n + ' alumnos con datos cifrados', 'ok', 5000); E.render();
  };
  A['sc-quitar'] = async () => { if (!confirm('¿Quitar la protección? Los datos delicados volverán a guardarse sin cifrar.')) return; if (await SC.quitar()) u.toast('Protección quitada', 'ok'); E.render(); };
  SC.ajustesHTML = () => {
    if (!SC.activa()) return card('<h3>🔐 Proteger datos delicados</h3><p class="small">Cifra con tu PIN el teléfono de casa, el contacto y teléfono de emergencia, el número del seguro facultativo, las notas de emergencia y, en Tutoría, los adeudos, la inscripción y las notas de seguimiento. Sin el PIN no se pueden leer en la nube ni en un respaldo.</p><div class="fgrid"><label class="fld"><span>PIN (4 a 12 números)</span><input class="inp" id="sc-p1" type="password" inputmode="numeric" maxlength="12" autocomplete="new-password"></label><label class="fld"><span>Repite el PIN</span><input class="inp" id="sc-p2" type="password" inputmode="numeric" maxlength="12" autocomplete="new-password"></label></div><label class="switch"><input type="checkbox" id="sc-rec2" checked><span>Recordar en este aparato</span></label>' + btn('🔐 Activar protección', 'sc-activar', '', 'primary small') + '<p class="muted small">Entre más largo el PIN, más difícil de adivinar: con 4 números hay 10 000 combinaciones; con 6, un millón. No uses el mismo PIN que le das a la co-tutora.</p>');
    return card('<h3>🔐 Datos delicados protegidos</h3><p class="small">Activa desde el ' + u.fCorta(SC.cfg().desde || u.today()) + '. ' + (SC.abierta() ? '<span class="okc">Desbloqueada en este aparato.</span>' : 'Bloqueada en este aparato.') + '</p><div class="row gap wrap">' + (SC.abierta() ? btn('🔒 Bloquear y olvidar en este aparato', 'sc-bloq', '', 'small') + btn('Quitar la protección', 'sc-quitar', '', 'small ghost danger') : btn('Desbloquear', 'sc-pide', '', 'small primary')) + '</div>');
  };
  if (V.ajustes) { const va = V.ajustes; V.ajustes = function () { const o = va.apply(null, arguments); if (o && o.h && !/Algo falló/.test(o.h)) o.h += SC.ajustesHTML(); return o; }; }
  // en la ficha y en emergencias: si está bloqueada, en lugar de los campos aparece el candado
  const bloqueada = () => SC.activa() && !SC.abierta();
  if (V.alumno) { const va = V.alumno; V.alumno = function () { const o = va.apply(null, arguments); if (o && o.h && bloqueada()) { o.h = o.h.replace(/<label class="fld"><span>WhatsApp de su madre[\s\S]*?<\/label>/, '<p class="small muted">🔒 Teléfono protegido. ' + btn('Desbloquear', 'sc-pide', '', 'small') + '</p>').replace(/<h3>🚑 Ficha de emergencia<\/h3>[\s\S]*?<\/section>/, '<h3>🚑 Ficha de emergencia</h3><p class="small">🔒 Protegida con tu PIN. ' + btn('Desbloquear', 'sc-pide', '', 'small primary') + '</p></section>'); } return o; }; }
  if (V.tutoria) { const vt = V.tutoria; V.tutoria = function () { const o = vt.apply(null, arguments); if (o && o.h && SC.docBloqueado() && !/Algo falló|No hay grupo/.test(o.h)) { const i = o.h.indexOf('</div>') + 6; o.h = o.h.slice(0, i) + SC.candado('Adeudos, inscripción y notas de tutoría protegidos con tu PIN. Desbloquea para verlos o cambiarlos.') + o.h.slice(i); } return o; }; }
  if (V.emergencia) { const ve = V.emergencia; V.emergencia = function () { const o = ve.apply(null, arguments); if (o && o.h && bloqueada()) o.h = SC.candado('El directorio de emergencia está protegido con tu PIN.') + o.h; return o; }; }
})();
