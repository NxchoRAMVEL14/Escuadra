/* Escuadra · Datos delicados protegidos (v1.27).
   El teléfono de casa, el contacto y teléfono de emergencia, el número del seguro facultativo y las notas de emergencia
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
  S.get = function (key) {
    const d = get0.call(this, key);
    if (!d || !llave || String(key).indexOf('grupo:') !== 0 || !Array.isArray(d.alumnos)) return d;
    const ts = (this.docs[key] || {}).ts + '|' + ver, c = cache[key]; if (c && c.ts === ts) return c.d;
    const out = Object.assign({}, d, { alumnos: d.alumnos.map(a => { const m = mapa[a.id]; return m ? Object.assign({}, a, m) : a; }) });
    cache[key] = { ts: ts, d: out }; return out;
  };
  /* ---------- guardar: los campos delicados nunca entran al documento en claro ---------- */
  const put0 = S.put;
  S.put = function (key, data, opt) {
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
    const k = llave; if (!k) return; const sec = {};
    for (const id of ids) { const m = mapa[id] || {}; sec[id] = F.some(f => m[f]) ? await cifra(k, m) : null; }
    const cur = get0.call(S, key); if (!cur) return;
    const d = Object.assign({}, cur, { alumnos: cur.alumnos.map(a => { if (!(a.id in sec)) return a; const b = Object.assign({}, a); if (sec[a.id]) b.sec = sec[a.id]; else delete b.sec; return b; }) });
    put0.call(S, key, d, { silent: true });
  }
  // descifra todos los grupos (al desbloquear y cuando llegan datos de otro aparato)
  SC.descifraTodo = async () => {
    if (!llave) return; const nuevo = {};
    for (const k of S.keys('grupo:')) { const g = get0.call(S, k); for (const a of ((g && g.alumnos) || [])) { if (!a.sec) continue; try { nuevo[a.id] = Object.assign(nuevo[a.id] || {}, await descifra(llave, a.sec)); } catch (e) { console.warn('No se pudo descifrar', a.id); } } }
    mapa = Object.assign({}, mapa, nuevo); ver++; if (E.render) E.render();
  };
  S.on(k => { if ((k === '__pull' || k === '__restore') && llave) SC.descifraTodo(); });

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
      if (toca) put0.call(S, k, Object.assign({}, g, { alumnos: al }));
    }
    // lo que se escribió estando bloqueado
    const pd = pendiente; pendiente = {};
    for (const id of Object.keys(pd)) { mapa[id] = Object.assign({}, mapa[id] || {}, pd[id]); for (const k of S.keys('grupo:')) { const g = get0.call(S, k); if (g && (g.alumnos || []).some(a => a.id === id)) await recifra(k, [id]); } }
    ver++; return n;
  };
  SC.activar = async (pin, recordar) => {
    const salt = b64(crypto.getRandomValues(new Uint8Array(16))), k = await deriva(pin, salt), check = await cifra(k, 'escuadra-ok');
    put0.call(S, KCFG, { v: 1, salt: salt, check: check, iter: ITER, desde: u.today() });
    llave = k; if (recordar) await kSet(k); const n = await SC.migra(); await SC.descifraTodo(); return n;
  };
  SC.abrir = async (pin, recordar) => {
    const c = SC.cfg(); if (!c) return false; let k; try { k = await deriva(pin, c.salt, c.iter); if ((await descifra(k, c.check)) !== 'escuadra-ok') return false; } catch (e) { return false; }
    llave = k; if (recordar) await kSet(k); await SC.descifraTodo(); await SC.migra(); return true;
  };
  SC.bloquear = async olvidar => { llave = null; mapa = {}; ver++; if (olvidar) await kSet(null); if (E.render) E.render(); };
  SC.quitar = async () => {
    if (!llave) return; await SC.descifraTodo(); const m = mapa;
    for (const k of S.keys('grupo:')) { const g = get0.call(S, k); if (!g || !Array.isArray(g.alumnos)) continue; put0.call(S, k, Object.assign({}, g, { alumnos: g.alumnos.map(a => { const b = Object.assign({}, a, m[a.id] || {}); delete b.sec; return b; }) })); }
    S.del(KCFG); llave = null; mapa = {}; ver++; await kSet(null);
  };
  // al arrancar: si la llave quedó recordada en este aparato, abre solo
  const load0 = S.load; S.load = async function () { const r = await load0.apply(this, arguments); try { if (SC.activa()) { const k = await kGet(); if (k) { const c = SC.cfg(); try { if ((await descifra(k, c.check)) === 'escuadra-ok') { llave = k; await SC.descifraTodo(); await SC.migra(); } } catch (e) { await kSet(null); } } } } catch (e) { console.warn(e); } return r; };

  /* ---------- pantallas ---------- */
  SC.candado = (txt) => card('<div class="row between gap wrap"><p class="small">🔒 ' + esc(txt || 'Teléfonos y datos de emergencia protegidos con tu PIN.') + '</p>' + btn('Desbloquear', 'sc-pide', '', 'small primary') + '</div>');
  A['sc-pide'] = () => E.modal.open('🔒 Datos protegidos', '<p class="small">Escribe tu PIN para ver y editar teléfonos y datos de emergencia.</p><label class="fld"><span>PIN</span><input class="inp" id="sc-pin" type="password" inputmode="numeric" maxlength="12" autocomplete="off"></label><label class="switch"><input type="checkbox" id="sc-rec" checked><span>Recordar en este aparato</span></label><div class="row gap wrap">' + btn('Desbloquear', 'sc-abrir', '', 'primary') + '</div><p class="muted small">El PIN no se guarda; con «recordar» se guarda una llave que no se puede copiar fuera del navegador.</p>');
  A['sc-abrir'] = async () => { const pin = ((document.getElementById('sc-pin') || {}).value || '').trim(), rec = (document.getElementById('sc-rec') || {}).checked; const ok = await SC.abrir(pin, rec); if (!ok) { u.toast('PIN incorrecto', 'err'); return; } E.modal.close(); u.toast('Datos protegidos desbloqueados', 'ok'); E.render(); };
  A['sc-bloq'] = () => SC.bloquear(true);
  A['sc-activar'] = async () => {
    const p1 = ((document.getElementById('sc-p1') || {}).value || '').trim(), p2 = ((document.getElementById('sc-p2') || {}).value || '').trim(), rec = (document.getElementById('sc-rec2') || {}).checked;
    if (!/^\d{4,12}$/.test(p1)) { u.toast('El PIN debe tener de 4 a 12 números', 'err'); return; } if (p1 !== p2) { u.toast('Los dos PIN no coinciden', 'err'); return; }
    if (!confirm('Si olvidas este PIN, los teléfonos y datos de emergencia no se podrán recuperar. ¿Activar la protección?')) return;
    const n = await SC.activar(p1, rec); u.toast('Protección activada: ' + n + ' alumnos con datos cifrados', 'ok', 5000); E.render();
  };
  A['sc-quitar'] = async () => { if (!confirm('¿Quitar la protección? Los datos delicados volverán a guardarse sin cifrar.')) return; await SC.quitar(); u.toast('Protección quitada', 'ok'); E.render(); };
  SC.ajustesHTML = () => {
    if (!SC.activa()) return card('<h3>🔐 Proteger datos delicados</h3><p class="small">Cifra con tu PIN el teléfono de casa, el contacto y teléfono de emergencia, el número del seguro facultativo y las notas de emergencia. Sin el PIN no se pueden leer en la nube ni en un respaldo.</p><div class="fgrid"><label class="fld"><span>PIN (4 a 12 números)</span><input class="inp" id="sc-p1" type="password" inputmode="numeric" maxlength="12" autocomplete="new-password"></label><label class="fld"><span>Repite el PIN</span><input class="inp" id="sc-p2" type="password" inputmode="numeric" maxlength="12" autocomplete="new-password"></label></div><label class="switch"><input type="checkbox" id="sc-rec2" checked><span>Recordar en este aparato</span></label>' + btn('🔐 Activar protección', 'sc-activar', '', 'primary small') + '<p class="muted small">Entre más largo el PIN, más difícil de adivinar: con 4 números hay 10 000 combinaciones; con 6, un millón. No uses el mismo PIN que le das a la co-tutora.</p>');
    return card('<h3>🔐 Datos delicados protegidos</h3><p class="small">Activa desde el ' + u.fCorta(SC.cfg().desde || u.today()) + '. ' + (SC.abierta() ? '<span class="okc">Desbloqueada en este aparato.</span>' : 'Bloqueada en este aparato.') + '</p><div class="row gap wrap">' + (SC.abierta() ? btn('🔒 Bloquear y olvidar en este aparato', 'sc-bloq', '', 'small') + btn('Quitar la protección', 'sc-quitar', '', 'small ghost danger') : btn('Desbloquear', 'sc-pide', '', 'small primary')) + '</div>');
  };
  if (V.ajustes) { const va = V.ajustes; V.ajustes = function () { const o = va.apply(null, arguments); if (o && o.h && !/Algo falló/.test(o.h)) o.h += SC.ajustesHTML(); return o; }; }
  // en la ficha y en emergencias: si está bloqueada, en lugar de los campos aparece el candado
  const bloqueada = () => SC.activa() && !SC.abierta();
  if (V.alumno) { const va = V.alumno; V.alumno = function () { const o = va.apply(null, arguments); if (o && o.h && bloqueada()) { o.h = o.h.replace(/<label class="fld"><span>WhatsApp de su madre[\s\S]*?<\/label>/, '<p class="small muted">🔒 Teléfono protegido. ' + btn('Desbloquear', 'sc-pide', '', 'small') + '</p>').replace(/<h3>🚑 Ficha de emergencia<\/h3>[\s\S]*?<\/section>/, '<h3>🚑 Ficha de emergencia</h3><p class="small">🔒 Protegida con tu PIN. ' + btn('Desbloquear', 'sc-pide', '', 'small primary') + '</p></section>'); } return o; }; }
  if (V.emergencia) { const ve = V.emergencia; V.emergencia = function () { const o = ve.apply(null, arguments); if (o && o.h && bloqueada()) o.h = SC.candado('El directorio de emergencia está protegido con tu PIN.') + o.h; return o; }; }
})();
