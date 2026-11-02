/* Escuadra · Respaldos diarios (v1.28).
   Una vez al día la app guarda una copia completa y comprimida de tus datos:
   - en este aparato (los últimos 7 días), aunque no tengas Supabase;
   - en tu Supabase (los últimos 30 días), en la misma tabla protegida por tu usuario (claves «respaldo:AAAA-MM-DD»).
     Esas filas no se bajan a los aparatos con la sincronización normal; solo se leen al restaurar.
   Con Supabase, la copia del día se hace después de sincronizar (para que traiga todo lo de tus otros aparatos).
   Restaurar regresa TODO a como estaba ese día. Antes guarda cómo está ahora (en el aparato y, si aún no hay copia de
   hoy, en la nube); si no puede, te descarga un archivo y te pregunta. Si el respaldo trae mucho menos que lo que tienes,
   te avisa antes. Lo protegido con PIN viaja cifrado igual que en la nube. Las fotos de Evidencias no van aquí. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, esc = u.esc;
  const A = E.actions, H = E.h;
  const btn = H.btn;
  const RS = E.respaldo = {};
  const DIAS_LOCAL = 7, DIAS_NUBE = 30, ANTES = 3, KIDX = 'respIdx', KL = f => 'resp:' + f, KN = f => 'respaldo:' + f;
  const b64 = by => { let s = ''; const a = new Uint8Array(by); for (let i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000)); return btoa(s); };
  const unb64 = s => { const b = atob(s), a = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; };
  const viva = () => { const o = {}; Object.keys(S.docs).forEach(k => { const d = S.docs[k]; if (!d || d.deleted || d.data == null || k.indexOf('respaldo:') === 0) return; o[k] = d.data; }); return o; };
  RS.cuantos = () => Object.keys(viva()).length;
  // comprime con gzip (si el navegador puede); si no, va el JSON tal cual
  RS.empaca = async (fecha, motivo) => {
    const docs = viva(), json = JSON.stringify({ app: 'escuadra', v: E.VERSION, f: fecha, docs: docs });
    const base = { v: 1, f: fecha, ts: new Date().toISOString(), n: Object.keys(docs).length, ver: E.VERSION, motivo: motivo || 'diario', crudo: json.length };
    if (window.CompressionStream) { try { const z = new Uint8Array(await new Response(new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer()); return Object.assign(base, { z: b64(z), bytes: z.length }); } catch (e) { } }
    return Object.assign(base, { j: json, bytes: json.length });
  };
  RS.abre = async x => {
    let json = x.j;
    if (!json && x.z) json = await new Response(new Blob([unb64(x.z)]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
    const d = JSON.parse(json); if (!d || d.app !== 'escuadra' || !d.docs) throw new Error('No es un respaldo de Escuadra'); return d;
  };

  /* ---------- en este aparato ---------- */
  const hayIdb = () => !!(E.idb && E.idb.db);
  const idx = async () => { try { return (hayIdb() && (await E.idb.get(KIDX))) || []; } catch (e) { return []; } };
  RS.locales = async () => (await idx()).slice().sort((a, b) => String(b.ts).localeCompare(String(a.ts)));
  // clave: la fecha (copia diaria) o «antes-…» (copia antes de restaurar; se guardan las últimas 3)
  RS.local = async (motivo, clave) => {
    if (!hayIdb()) throw new Error('Este aparato no puede guardar copias (sin IndexedDB)');
    const f = clave || u.today(), x = await RS.empaca(u.today(), motivo);
    await E.idb.set(KL(f), x);
    let L = (await idx()).filter(y => y.f !== f); L.push({ f: f, ts: x.ts, n: x.n, bytes: x.bytes, motivo: x.motivo });
    const quita = [];
    const diarios = L.filter(y => /^\d{4}-\d{2}-\d{2}$/.test(y.f)).sort((a, b) => a.f.localeCompare(b.f)); quita.push(...diarios.slice(0, Math.max(0, diarios.length - DIAS_LOCAL)));
    const antes = L.filter(y => /^antes/.test(y.f)).sort((a, b) => String(a.ts).localeCompare(String(b.ts))); quita.push(...antes.slice(0, Math.max(0, antes.length - ANTES)));
    for (const y of quita) { await E.idb.set(KL(y.f), null); L = L.filter(z => z.f !== y.f); }
    await E.idb.set(KIDX, L); return x;
  };
  RS.localHoy = async () => { if (!hayIdb() || !RS.cuantos()) return false; const L = await idx(); if (L.some(y => y.f === u.today())) return false; await RS.local('diario'); return true; };

  /* ---------- en la nube (Supabase) ---------- */
  const Y = () => E.sync;
  const nubeOk = () => !!(Y() && Y().client && Y().user && navigator.onLine);
  const conNube = () => { try { const c = Y() && Y().creds(); return !!(c && c.url && c.key); } catch (e) { return false; } };
  RS.nubeHoy = async () => {
    if (!nubeOk()) return false; const m = Y().meta(), hoy = u.today(); if (m.respNube === hoy) return false;
    const x = await RS.empaca(hoy, 'diario');
    // si otro aparato ya subió la de hoy con bastante más, se queda esa (este podría no tener todo todavía)
    try {
      const r0 = await Y().client.from('escuadra_docs').select('key,n:data->n').eq('key', KN(hoy)).limit(1), row = r0 && !r0.error && (r0.data || [])[0];
      const n0 = row ? (row.n != null ? Number(row.n) : row.data && row.data.n) : null;
      if (n0 != null && n0 > x.n * 1.1 + 5) { Y().setMeta({ respNube: hoy }); return false; }
    } catch (e) { console.warn(e); }
    const r = await Y().client.from('escuadra_docs').upsert([{ user_id: Y().user.id, key: KN(hoy), data: x, deleted: false, client_ts: x.ts }], { onConflict: 'user_id,key' });
    if (r && r.error) throw r.error;
    Y().setMeta({ respNube: hoy });
    try { await Y().client.from('escuadra_docs').delete().like('key', 'respaldo:%').lt('key', KN(u.addDays(hoy, -DIAS_NUBE))); } catch (e) { console.warn(e); }
    return true;
  };
  RS.nube = async () => {
    if (!nubeOk()) return [];
    const r = await Y().client.from('escuadra_docs').select('key,client_ts').like('key', 'respaldo:%').order('key', { ascending: false }).limit(60);
    if (r.error) throw r.error; return (r.data || []).map(x => ({ f: x.key.slice(9), ts: x.client_ts }));
  };
  RS.bajaNube = async f => {
    const r = await Y().client.from('escuadra_docs').select('data').eq('key', KN(f)).limit(1);
    if (r.error) throw r.error; const row = (r.data || [])[0]; if (!row || !row.data) throw new Error('No encontré el respaldo del ' + f); return row.data;
  };
  // tras sincronizar bien: la copia del día (aquí y en la nube) ya con todo lo de tus aparatos
  RS.trasSync = () => { RS.localHoy().catch(e => console.warn('Respaldo diario', e)); RS.nubeHoy().catch(e => console.warn('Respaldo diario', e)); };
  // al activar el PIN (o cifrar datos que estaban en claro): los respaldos anteriores los traen en claro; se cambian por uno nuevo
  RS.purgaClaro = async motivo => {
    if (hayIdb()) { for (const y of await idx()) await E.idb.set(KL(y.f), null); await E.idb.set(KIDX, []); await RS.local(motivo); }
    if (nubeOk()) { await Y().client.from('escuadra_docs').delete().like('key', 'respaldo:%'); Y().setMeta({ respNube: '' }); await RS.nubeHoy(); }
  };

  /* ---------- restaurar: TODO queda como ese día ---------- */
  RS.restaura = async (x, etiqueta) => {
    const d = await RS.abre(x), keep = Object.assign({}, d.docs), ahora = RS.cuantos(), n = Object.keys(keep).length;
    if (ahora > 20 && n < ahora * 0.6 && !confirm('Ojo: ese respaldo trae ' + n + ' documentos y ahora tienes ' + ahora + '. Al restaurarlo se borrarían ' + (ahora - n) + '. ¿Seguro que es el que quieres?')) return null;
    // 1) copia de cómo está ahora: en el aparato y, si hoy todavía no hay copia en la nube, también allá
    let copia = false;
    try { copia = !!(await RS.local('antes de restaurar ' + etiqueta, 'antes-' + Date.now())); } catch (e) { console.warn(e); }
    if (nubeOk() && Y().meta().respNube !== u.today()) { try { if (await RS.nubeHoy()) copia = true; } catch (e) { console.warn(e); } }
    if (!copia) {
      u.download('escuadra-antes-de-restaurar-' + u.today() + '.json', JSON.stringify({ app: 'escuadra', version: E.VERSION, fecha: u.now(), docs: S.docs }), 'application/json');
      if (!confirm('No pude guardar la copia de cómo están tus datos ahora, así que te descargué un archivo con ellos (guárdalo). ¿Restaurar de todos modos?')) return null;
    }
    // 2) la protección con PIN de ahora se conserva si el respaldo es de antes de activarla (lo restaurado se vuelve a cifrar)
    const sc = S.docs.secCfg; if (!('secCfg' in keep) && sc && !sc.deleted && sc.data) keep.secCfg = sc.data;
    // 3) hoy ya no se sube otra copia a la nube con lo restaurado (la de hoy es la de antes)
    if (nubeOk()) Y().setMeta({ respNube: u.today() });
    const now = u.now();
    Object.keys(S.docs).forEach(k => { if (k.indexOf('respaldo:') === 0) return; const cur = S.docs[k]; if (!(k in keep) && cur && !cur.deleted) S.docs[k] = { data: null, ts: now, dirty: true, deleted: true }; });
    Object.keys(keep).forEach(k => { S.docs[k] = { data: keep[k], ts: now, dirty: true, deleted: false }; });
    S.invalidar(); S.persist(); if (E.sync) E.sync.schedule(); S.emit('__restore'); if (E.reparar) E.reparar();
    return Object.keys(keep).length;
  };

  /* ---------- pantalla (en Ajustes → Respaldos diarios) ---------- */
  const tam = b => b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
  const hora = ts => new Date(ts).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  RS.html = () => '<div id="rs-box"><p class="muted small">Cargando respaldos…</p></div>';
  RS.pinta = async () => {
    const el = document.getElementById('rs-box'); if (!el) return;
    const L = await RS.locales(); let N = [], nErr = '';
    try { N = await RS.nube(); } catch (e) { nErr = Y().explica ? Y().explica(e) : e.message; }
    const fila = (t, sub, act, data) => '<li><span>' + t + '<br><small class="muted">' + sub + '</small></span><span class="row gap">' + btn('↺ Restaurar', act, data, 'small') + '</span></li>';
    const nom = y => /^antes/.test(y.f) ? 'Antes de restaurar · ' + u.fCorta(String(y.ts).slice(0, 10)) : u.cap(u.fLarga(y.f));
    el.innerHTML = '<p class="small">Cada día la app guarda sola una copia de todo: aquí (' + DIAS_LOCAL + ' días) y, con Supabase, en tu nube (' + DIAS_NUBE + ' días). Restaurar regresa <b>todo</b> a como estaba ese día; antes guarda cómo está ahora, por si te arrepientes.</p>' +
      '<h4>En este aparato</h4>' + (!hayIdb() ? '<p class="muted small">Este navegador no permite guardar copias aquí.</p>' : L.length ? '<ul class="risk">' + L.map(y => fila(nom(y), hora(y.ts) + ' · ' + y.n + ' documentos · ' + tam(y.bytes || 0), 'rs-rest-l', 'data-f="' + esc(y.f) + '"')).join('') + '</ul>' : '<p class="muted small">Todavía no hay. ' + (conNube() ? 'Se hace solo después de sincronizar.' : 'El primero se hace solo en unos segundos.') + '</p>') +
      '<h4>En tu nube</h4>' + (nubeOk() ? (nErr ? '<p class="note warn small">' + esc(nErr) + '</p>' : N.length ? '<ul class="risk">' + N.map(y => fila(u.cap(u.fLarga(y.f)), hora(y.ts), 'rs-rest-n', 'data-f="' + esc(y.f) + '"')).join('') + '</ul>' : '<p class="muted small">Todavía no hay. Se hace solo después de sincronizar.</p>') : '<p class="muted small">Conecta Supabase e inicia sesión para guardar también en la nube.</p>') +
      '<div class="row gap wrap mt">' + btn('💾 Hacer un respaldo ahora', 'rs-ahora', '', 'small') + '</div>';
  };
  A['rs-ahora'] = async () => {
    try { await RS.local('a mano'); if (nubeOk()) { const m = Y().meta(); Y().setMeta({ respNube: '' }); await RS.nubeHoy().catch(e => { Y().setMeta({ respNube: m.respNube || '' }); throw e; }); } u.toast('Respaldo guardado' + (nubeOk() ? ' aquí y en tu nube' : ' en este aparato'), 'ok'); }
    catch (e) { u.toast('No se pudo guardar el respaldo: ' + e.message, 'err', 5000); }
    RS.pinta();
  };
  const confirma = et => confirm('¿Regresar TODOS tus datos a como estaban ' + et + '? Lo que hiciste después se pierde (antes se guarda una copia de cómo está ahora).');
  const listo = (n, et) => { if (n == null) return; u.toast('Listo: tus datos quedaron como ' + et + ' (' + n + ' documentos)', 'ok', 5000); E.render(); };
  A['rs-rest-l'] = async el => {
    const f = el.dataset.f, et = /^antes/.test(f) ? 'antes de esa restauración' : 'el ' + u.fLarga(f); if (!confirma(et)) return;
    try { const x = await E.idb.get(KL(f)); if (!x) throw new Error('No encontré ese respaldo'); listo(await RS.restaura(x, et), et); }
    catch (e) { u.toast('No se pudo restaurar: ' + e.message, 'err', 6000); }
  };
  A['rs-rest-n'] = async el => {
    const f = el.dataset.f, et = 'el ' + u.fLarga(f); if (!confirma(et)) return;
    try { const x = await RS.bajaNube(f); listo(await RS.restaura(x, et), et); }
    catch (e) { u.toast('No se pudo restaurar: ' + e.message, 'err', 6000); }
  };
  const load0 = S.load; S.load = async function () {
    const r = await load0.apply(this, arguments);
    // si una versión anterior bajó respaldos de la nube como si fueran datos, se quitan de este aparato (siguen en la nube)
    const viejos = Object.keys(S.docs).filter(k => k.indexOf('respaldo:') === 0); if (viejos.length) { viejos.forEach(k => { delete S.docs[k]; }); S.invalidar(); S.persist(); }
    // sin Supabase: la copia del día unos segundos después de abrir. Con Supabase: después de sincronizar (core.js → trasSync)
    if (!conNube()) setTimeout(() => { RS.localHoy().catch(e => console.warn('Respaldo diario', e)); }, 8000);
    return r;
  };
})();
