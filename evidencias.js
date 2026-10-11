/* Escuadra · Fotos de evidencias de trabajos: libretas, planos, prototipos, maquetas. NUNCA caras de alumnos.
   La foto se reduce (lado mayor 1280 px) y se vuelve a guardar como JPEG: así pierde los datos de la cámara (ubicación, modelo).
   Se guarda primero en este aparato y luego se sube a un espacio privado de tu Supabase (solo tu usuario puede verla).
   En la sincronización normal solo viaja la ficha de la foto: fecha, actividad, de quién es y una nota escolar. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link, icon = E.icon;
  const EV = E.evid = {};
  const KE = gid => 'evid:' + gid, BUCKET = 'evidencias';
  const lista = g => (((S.get(KE(g.id)) || {}).items) || []).filter(x => x && x.id && !x.borrada);

  /* ---------- fotos en el aparato (IndexedDB) ---------- */
  let dbp = null;
  const db = () => dbp || (dbp = new Promise((res, rej) => {
    if (!window.indexedDB) { rej(new Error('Este navegador no puede guardar fotos')); return; }
    const r = indexedDB.open('escuadra-fotos', 1); r.onupgradeneeded = () => { r.result.createObjectStore('fotos', { keyPath: 'id' }); }; r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  }));
  const req = (modo, fn) => db().then(d => new Promise((res, rej) => { const t = d.transaction('fotos', modo), r = fn(t.objectStore('fotos')); let out; if (r) r.onsuccess = () => { out = r.result; }; t.oncomplete = () => res(out); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error); }));
  const local = { put: o => req('readwrite', st => st.put(o)), get: id => req('readonly', st => st.get(id)).catch(() => null), del: id => req('readwrite', st => st.delete(id)).catch(() => null) };
  EV.local = local;

  /* ---------- preparar la foto: reducir y quitar datos de la cámara ---------- */
  const aBlob = (c, q) => new Promise(res => c.toBlob(b => res(b), 'image/jpeg', q));
  const carga = async file => {
    try { return await createImageBitmap(file); } catch (e) { /* respaldo: <img> */ }
    const im = new Image(), url = URL.createObjectURL(file); im.src = url; try { await im.decode(); return im; } finally { URL.revokeObjectURL(url); }
  };
  const reduce = async (src, max, q) => {
    const w0 = src.width, h0 = src.height, k = Math.min(1, max / Math.max(w0, h0)), c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w0 * k)); c.height = Math.max(1, Math.round(h0 * k)); c.getContext('2d').drawImage(src, 0, 0, c.width, c.height);
    const b = await aBlob(c, q), o = { b: b, w: c.width, h: c.height, c: c }; return o;
  };
  // si el navegador sabe detectar caras (FaceDetector), avisa antes de guardar
  const hayCara = async c => { try { if (!('FaceDetector' in window)) return false; const fd = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 }); return (await fd.detect(c)).length > 0; } catch (e) { return false; } };
  EV.prepara = async file => {
    const src = await carga(file), full = await reduce(src, 1280, 0.82), mini = await reduce(src, 260, 0.7); if (src.close) src.close();
    const cara = await hayCara(full.c); full.c.width = full.c.height = 0; mini.c.width = mini.c.height = 0;
    return { full: full.b, mini: mini.b, w: full.w, h: full.h, cara: cara };
  };
  EV.agrega = async (g, file, meta) => {
    const p = await EV.prepara(file);
    if (p.cara && !confirm('Parece que en la foto sale una cara. Las evidencias son solo de trabajos, nunca de alumnos. ¿Guardarla de todos modos?')) return null;
    const id = u.uid('ev'); await local.put({ id: id, gid: g.id, full: p.full, mini: p.mini });
    const it = { id: id, f: meta.f || u.today(), t: new Date().toISOString(), aids: (meta.aids || []).slice(), act: meta.act || '', nota: meta.nota || '', w: p.w, h: p.h, kb: Math.round(p.full.size / 1024), subido: false };
    S.update(KE(g.id), d => { d.items = d.items || []; d.items.push(it); }, {});
    return it;
  };

  /* ---------- subir a Supabase (y borrar lo que quitaste) ---------- */
  EV.estado = ''; EV.err = '';
  const nube = () => { const Y = E.sync; return Y && Y.client && Y.user && navigator.onLine ? Y : null; };
  EV.subir = async () => {
    const Y = nube(); if (!Y || EV.subiendo) return 0;
    EV.subiendo = true; let n = 0;
    try {
      const st = Y.client.storage.from(BUCKET);
      for (const k of S.keys('evid:')) {
        const d0 = S.get(k) || {}, gid = k.slice(5);
        // primero lo que se borró
        if ((d0.borrar || []).length) { const r = await st.remove(d0.borrar); if (r.error) throw r.error; const ya = d0.borrar.slice(); S.update(k, d => { d.borrar = (d.borrar || []).filter(p => ya.indexOf(p) < 0); }, {}); }
        for (const it of (d0.items || []).filter(x => x && !x.subido && !x.borrada)) {
          const loc = await local.get(it.id); if (!loc || !loc.full) continue;          // la tomaste en otro aparato: se sube desde allá
          const base = Y.user.id + '/' + gid + '/' + it.id;
          for (const par of [[base + '.jpg', loc.full], [base + '_m.jpg', loc.mini]]) {
            const r = await st.upload(par[0], par[1], { contentType: 'image/jpeg', upsert: false });
            if (r.error && !/exist|duplicate/i.test(r.error.message || '')) throw r.error;
          }
          S.update(k, d => { const x = (d.items || []).find(y => y.id === it.id); if (x) { x.subido = true; x.path = base; } }, {});
          await local.put({ id: it.id, gid: gid, mini: loc.mini, full: null });           // ya está respaldada: aquí solo queda la miniatura
          n++;
        }
      }
      EV.estado = ''; EV.err = '';
    } catch (e) {
      const m = String((e && (e.message || e.error)) || e); console.warn(e); EV.err = m;
      EV.estado = /bucket not found|not found|row-level security|violates|unauthorized|403|404/i.test(m) ? 'sin-sql' : 'error';
    } finally { EV.subiendo = false; }
    if (n || EV.estado) E.render();
    return n;
  };
  window.addEventListener('online', () => { setTimeout(EV.subir, 3000); });
  setInterval(() => { if (document.visibilityState === 'visible') EV.subir(); }, 120000);

  /* ---------- ver las fotos ---------- */
  const urls = {};
  EV.url = async (it, mini) => {
    const key = it.id + (mini ? '|m' : ''), c = urls[key]; if (c && (!c.exp || c.exp > Date.now())) return c.u;
    const loc = await local.get(it.id), b = loc && (mini ? loc.mini : loc.full);
    if (b) { const x = URL.createObjectURL(b); urls[key] = { u: x }; return x; }
    const Y = nube(); if (!it.subido || !it.path || !Y) return null;
    const r = await Y.client.storage.from(BUCKET).createSignedUrl(it.path + (mini ? '_m.jpg' : '.jpg'), 3600);
    if (r.error || !r.data) return null; urls[key] = { u: r.data.signedUrl, exp: Date.now() + 3500e3 }; return r.data.signedUrl;
  };
  // llena las imágenes después de dibujar la pantalla
  EV.pinta = root => {
    const g = D.grupoActual(); if (!g) return; const its = lista(g);
    (root || document).querySelectorAll('img[data-ev]:not([data-ok])').forEach(im => {
      im.dataset.ok = '1'; const it = its.find(x => x.id === im.dataset.ev); if (!it) return;
      EV.url(it, im.dataset.mini === '1').then(x => { if (x) im.src = x; else im.parentNode.classList.add('ev-nube'); }).catch(() => { });
    });
  };
  const miniHTML = it => '<button type="button" class="ev-t" data-act="ev-ver" data-id="' + it.id + '" aria-label="Ver foto del ' + u.fCorta(it.f) + '"><img data-ev="' + it.id + '" data-mini="1" alt="">' + (it.subido ? '' : '<i title="Falta respaldarla en Supabase">⏳</i>') + '</button>';
  const orden = its => its.slice().sort((a, b) => String(b.t).localeCompare(String(a.t)));
  // tira de fotos para una actividad ({ act }) o un alumno ({ aid })
  EV.tiraHTML = (g, o) => {
    const its = orden(lista(g).filter(it => o.act ? it.act === o.act : (it.aids || []).indexOf(o.aid) >= 0));
    return card('<div class="row between gap wrap"><h3>📷 Evidencias' + (its.length ? ' (' + its.length + ')' : '') + '</h3>' + btn('＋ Foto', 'ev-abrir', o.act ? 'data-act-id="' + o.act + '"' : 'data-aid="' + o.aid + '"', 'small') + '</div>' +
      (its.length ? '<div class="ev-tira">' + its.slice(0, 12).map(miniHTML).join('') + '</div>' + (its.length > 12 ? link('Ver todas', 'evidencias', 'small') : '') : '<p class="muted small">Fotos de libretas, planos o prototipos (nunca caras).</p>'));
  };
  EV.alumnoHTML = (g, a) => EV.tiraHTML(g, { aid: a.id });

  /* ---------- tomar o elegir fotos ---------- */
  const actividades = g => S.list('act:' + g.id + ':').filter(a => a && a.id).sort((a, b) => String(b.fecha || '').localeCompare(String(a.fecha || '')));
  function nuevaHTML() {
    const s = E.ui.ev, g = D.grupoActual(), al = D.alumnos(g), acts = actividades(g), dis = s.ok ? '' : ' disabled';
    return '<label class="ck ev-ok"><input type="checkbox" data-ch="ev-sincaras"' + (s.ok ? ' checked' : '') + '><span><b>Es la foto de un trabajo y no sale ningún alumno.</b> Nunca fotos de caras: si sale alguien, tómala otra vez.</span></label>' +
      '<label class="fld"><span>Actividad (opcional)</span><select data-ch="ev-act"><option value="">— Sin actividad —</option>' + acts.map(a => '<option value="' + a.id + '"' + (a.id === s.act ? ' selected' : '') + '>' + esc(a.nombre || 'Actividad') + '</option>').join('') + '</select></label>' +
      '<p class="small">¿De quién es el trabajo? Toca uno o varios (si es de equipo, a todos).</p><div class="ev-al">' + al.map(a => '<button type="button" class="ev-chip' + (s.aids.indexOf(a.id) >= 0 ? ' on' : '') + '" data-act="ev-al" data-aid="' + a.id + '">' + a.num + ' · ' + esc(u.corto(a.nombre)) + '</button>').join('') + '</div>' +
      '<label class="fld"><span>Nota (opcional, solo lo escolar)</span><input class="inp" id="ev-nota" value="' + esc(s.nota || '') + '" placeholder="Ej. Plano de la pieza 3: le faltan cotas"></label>' +
      '<div class="row gap wrap mt"><label class="btn primary' + dis + '"><input type="file" accept="image/*" capture="environment" hidden data-ch="ev-foto"' + dis + '>📷 Tomar foto</label><label class="btn' + dis + '"><input type="file" accept="image/*" multiple hidden data-ch="ev-foto"' + dis + '>🖼 De la galería</label></div>' +
      '<p class="muted small">La foto se reduce y pierde los datos de la cámara (ubicación). ' + (nube() ? 'Se respalda en tu Supabase privado.' : 'Por ahora se queda solo en este aparato: con Supabase conectado se respalda sola.') + '</p>';
  }
  A['ev-abrir'] = el => {
    const g = D.grupoActual(); if (!g || !D.alumnos(g).length) { u.toast('Primero importa tu lista', 'err'); return; }
    const d = (el && el.dataset) || {};
    E.ui.ev = { ok: !!EV.okSesion, act: d.actId || '', aids: d.aid ? [d.aid] : [], nota: '' };
    E.modal.open('📷 Foto de evidencia', nuevaHTML());
  };
  CH['ev-sincaras'] = el => { E.ui.ev.ok = EV.okSesion = el.checked; E.ui.ev.nota = (document.getElementById('ev-nota') || {}).value || E.ui.ev.nota; E.modal.body(nuevaHTML()); };
  CH['ev-act'] = el => { E.ui.ev.act = el.value; };
  A['ev-al'] = el => { const s = E.ui.ev, i = s.aids.indexOf(el.dataset.aid); if (i >= 0) s.aids.splice(i, 1); else s.aids.push(el.dataset.aid); el.classList.toggle('on', i < 0); };
  CH['ev-foto'] = async el => {
    const s = E.ui.ev, g = D.grupoActual(), fs = Array.prototype.slice.call(el.files || []); el.value = '';
    if (!s || !s.ok || !fs.length) return;
    s.nota = ((document.getElementById('ev-nota') || {}).value || '').trim();
    let n = 0;
    for (const f of fs) { try { if (await EV.agrega(g, f, { act: s.act, aids: s.aids, nota: s.nota })) n++; } catch (e) { console.warn(e); u.toast('No pude leer esa imagen', 'err'); } }
    E.modal.close();
    if (n) u.toast(n === 1 ? 'Foto guardada' : n + ' fotos guardadas', 'ok', 2500);
    E.render(); EV.subir();
  };

  /* ---------- ver una foto y borrarla ---------- */
  A['ev-ver'] = el => {
    const g = D.grupoActual(), it = lista(g).find(x => x.id === el.dataset.id); if (!it) return;
    const al = (it.aids || []).map(id => D.alumno(g, id)).filter(Boolean), a = it.act && S.get('act:' + g.id + ':' + it.act);
    E.modal.open('📷 ' + u.cap(u.fLarga(it.f)), '<div class="ev-big"><img data-ev="' + it.id + '" alt="Foto de evidencia"></div>' +
      '<p class="small">' + (a ? '<b>' + esc(a.nombre) + '</b><br>' : '') + (al.length ? al.map(x => x.num + ' · ' + esc(u.corto(x.nombre))).join(', ') : 'Sin alumno') + (it.nota ? '<br><i>' + esc(it.nota) + '</i>' : '') + '</p>' +
      '<p class="muted small">' + (it.subido ? '☁️ Respaldada en tu Supabase.' : '⏳ Solo en el aparato donde la tomaste: se respalda al conectarte.') + ' ' + it.w + ' × ' + it.h + ' px · ' + it.kb + ' KB</p>' +
      '<div class="row gap wrap">' + btn(icon('trash') + ' Borrar foto', 'ev-borrar', 'data-id="' + it.id + '"', 'ghost danger') + btn('Cerrar', 'modal-close', '', 'primary') + '</div>');
    EV.pinta(document.getElementById('modal'));
  };
  A['ev-borrar'] = async el => {
    const g = D.grupoActual(), id = el.dataset.id, it = lista(g).find(x => x.id === id); if (!it) return;
    if (!confirm('¿Borrar esta foto? No se puede deshacer.')) return;
    await local.del(id); delete urls[id]; delete urls[id + '|m'];   // (después de esperar: así no entra a «Deshacer»)
    S.update(KE(g.id), d => { d.items = (d.items || []).filter(x => x.id !== id); if (it.subido && it.path) d.borrar = (d.borrar || []).concat([it.path + '.jpg', it.path + '_m.jpg']); }, {});
    E.modal.close(); u.toast('Foto borrada', 'ok'); E.render(); EV.subir();
  };

  /* ---------- todas las fotos del grupo ---------- */
  V.evidencias = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup();
    const f = E.ui.evF = E.ui.evF || { aid: '', act: '' }, al = D.alumnos(g), acts = actividades(g), todas = lista(g);
    const its = orden(todas.filter(it => (!f.aid || (it.aids || []).indexOf(f.aid) >= 0) && (!f.act || it.act === f.act))), pend = todas.filter(x => !x.subido).length;
    let h = card('<div class="row between gap wrap"><h3>📷 Evidencias de trabajos</h3>' + btn('＋ Foto', 'ev-abrir', '', 'primary') + '</div><p class="muted small">Libretas, planos, prototipos y maquetas: nunca caras de alumnos. ' + todas.length + (todas.length === 1 ? ' foto' : ' fotos') + (pend ? ' · ' + pend + ' por respaldar' : '') + '.</p>' +
      (EV.estado === 'sin-sql' ? '<p class="note warn">Para respaldar fotos falta preparar el espacio en Supabase: en <a href="#/ajustes/sync">Ajustes → Sincronización</a>, paso 2b («Copiar SQL de fotos»).</p>' : EV.estado === 'error' ? '<p class="note bad">No se pudieron subir: ' + esc(EV.err) + '</p>' : '') +
      (pend && nube() ? btn('☁️ Respaldar ahora', 'ev-subir', '', 'small') : pend && !E.sync.user ? '<p class="small muted">Conecta Supabase e inicia sesión en Ajustes para respaldarlas; mientras, solo están en este aparato.</p>' : '') +
      '<div class="fgrid mt"><label class="fld"><span>Alumno</span><select data-ch="ev-f" data-k="aid"><option value="">Todos</option>' + al.map(a => '<option value="' + a.id + '"' + (a.id === f.aid ? ' selected' : '') + '>' + a.num + ' · ' + esc(u.corto(a.nombre)) + '</option>').join('') + '</select></label>' +
      '<label class="fld"><span>Actividad</span><select data-ch="ev-f" data-k="act"><option value="">Todas</option>' + acts.filter(a => todas.some(x => x.act === a.id)).map(a => '<option value="' + a.id + '"' + (a.id === f.act ? ' selected' : '') + '>' + esc(a.nombre) + '</option>').join('') + '</select></label></div>');
    if (!its.length) h += card('<p class="muted">' + (todas.length ? 'Ninguna foto con ese filtro.' : 'Todavía no hay fotos. Úsalas para el portafolio, la junta con padres o la evidencia de la planeación.') + '</p>');
    else { const porF = {}; its.forEach(it => { (porF[it.f] = porF[it.f] || []).push(it); }); h += Object.keys(porF).sort().reverse().map(fe => card('<h4>' + u.cap(u.fLarga(fe)) + '</h4><div class="ev-tira">' + porF[fe].map(miniHTML).join('') + '</div>')).join(''); }
    return { t: 'Evidencias', h: h };
  };
  CH['ev-f'] = el => { E.ui.evF[el.dataset.k] = el.value; E.render(); };
  A['ev-subir'] = async () => { const n = await EV.subir(); u.toast(n ? n + (n === 1 ? ' foto respaldada' : ' fotos respaldadas') : EV.estado ? 'No se pudieron subir' : 'Nada por respaldar', n ? 'ok' : EV.estado ? 'err' : '', 3500); };

  /* ---------- SQL para el espacio de fotos (Supabase Storage) ---------- */
  E.STORAGE_SQL = `-- Escuadra · espacio PRIVADO para las fotos de evidencias (Supabase Storage)
-- Pega esto en Supabase → SQL Editor → New query → Run. Solo se corre una vez.
-- Cada usuario solo puede ver, subir y borrar las fotos de su propia carpeta (la carpeta lleva su id).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('evidencias', 'evidencias', false, 3145728, array['image/jpeg'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "escuadra evidencias: ver lo mío" on storage.objects;
drop policy if exists "escuadra evidencias: subir lo mío" on storage.objects;
drop policy if exists "escuadra evidencias: borrar lo mío" on storage.objects;

create policy "escuadra evidencias: ver lo mío" on storage.objects for select to authenticated
  using (bucket_id = 'evidencias' and (storage.foldername(name))[1] = (select auth.jwt()->>'sub'));
create policy "escuadra evidencias: subir lo mío" on storage.objects for insert to authenticated
  with check (bucket_id = 'evidencias' and (storage.foldername(name))[1] = (select auth.jwt()->>'sub'));
create policy "escuadra evidencias: borrar lo mío" on storage.objects for delete to authenticated
  using (bucket_id = 'evidencias' and (storage.foldername(name))[1] = (select auth.jwt()->>'sub'));
`;
  A['sync-sql-fotos'] = async () => { const ok = await u.copy(E.STORAGE_SQL); u.toast(ok ? 'SQL de fotos copiado: pégalo en Supabase → SQL Editor → Run' : 'No se pudo copiar', ok ? 'ok' : 'err', 5000); };
  setTimeout(() => { EV.subir(); }, 8000);
})();
