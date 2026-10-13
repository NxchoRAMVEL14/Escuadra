/* Escuadra · Vista para la co-tutora (v1.25). Un enlace que ella abre en su celular (tutora.html) con lo de tutoría del
   grupo: alerta temprana, asistencia del mes, semáforo, estado de seguimiento, cooperaciones y el plan de tutoría.
   Va CIFRADO con un PIN que tú le das aparte (por llamada o en persona): AES-GCM con llave derivada del PIN (PBKDF2,
   200 000 vueltas). Los datos viajan dentro del enlace (después del #) y no se guardan en ningún servidor; ella solo puede
   verlos, no cambiarlos. Es una foto de ese día: cuando cambie algo, mándale otro enlace. No lleva tus notas privadas. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, H = E.h;
  const card = H.card, btn = H.btn;
  const CT = E.cotutora = {};
  const b64 = bytes => { let s = ''; for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  CT.cifra = async (obj, pin) => {
    let raw = new TextEncoder().encode(JSON.stringify(obj)), z = 0;
    if (window.CompressionStream) { try { raw = new Uint8Array(await new Response(new Blob([raw]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer()); z = 1; } catch (e) { } }
    const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(String(pin)), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: salt, iterations: 200000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, raw)), out = new Uint8Array(1 + 16 + 12 + ct.length);
    out[0] = z; out.set(salt, 1); out.set(iv, 17); out.set(ct, 29);
    return 'x' + b64(out);
  };
  CT.datos = g => {
    const cf = D.cfg(), hoy = u.today(), p = C.parcialActual(hoy), al = D.alumnos(g), T = E.tutoria, seg = T ? T.seg(g) : {}, alertas = T ? T.alertas(g) : [];
    const sem = {}; if (E.semaforo && p) { try { E.semaforo.datos(g, p.id).filas.forEach(r => { sem[r.a.id] = r.n; }); } catch (e) { } }
    const desde = u.addDays(hoy, -30), fal = {}; S.keys('asis:' + g.id + ':').forEach(k => { const f = k.split(':').pop(); if (f < desde || f > hoy) return; const doc = S.get(k) || {}; al.forEach(a => { if (!C.cuenta(doc[a.id] || 'A')) fal[a.id] = (fal[a.id] || 0) + 1; }); });
    const sig = {}; alertas.forEach(x => { sig[x.a.id] = (x.sA ? 'A' : '') + (x.sB ? 'B' : '') + (x.sC ? 'C' : ''); });
    const tcf = T ? T.cfg(g) : {}, RESP = { yo: cf.docenteCorto || 'Docente', co: 'Co-tutora', ambos: 'Los dos', grupo: 'El grupo' };
    return {
      v: 1, g: g.nombre, pl: cf.plantel || '', f: hoy, d: cf.docente || '', p: p ? p.nombre : '',
      al: al.map(a => [a.num, u.corto(a.nombre), fal[a.id] || 0, sem[a.id] || '', sig[a.id] || '', (seg[a.id] || {}).estado || '']),
      co: T ? T.coops(g).slice(0, 4).map(c => { const r = T.calc(g, c); return [c.concepto || 'Cooperación', r.monto, r.nOk, r.nPend, r.caja, r.filas.filter(x => x.st === 'pend' || x.st === 'par').map(x => x.a.num)]; }) : [],
      pn: (tcf.plan || []).filter(x => x.estado !== 'hecha').slice(0, 8).map(x => [x.fecha || '', x.t, RESP[x.resp] || x.resp || '']),
      cs: E.consejo && E.consejo.actual ? (E.consejo.actual(hoy) || '') : ''
    };
  };
  A['ct-abrir'] = () => {
    E.modal.open('👩‍🏫 Vista para la co-tutora', '<p class="small">Genera un enlace cifrado con lo de tutoría del grupo (alerta temprana, faltas del mes, semáforo, seguimiento, cooperaciones y plan). Ella lo abre en su celular con el PIN; no puede cambiar nada.</p>' +
      '<label class="fld"><span>PIN (4 a 8 números; dáselo aparte, no en el mismo mensaje)</span><input class="inp" id="ct-pin" inputmode="numeric" maxlength="8" placeholder="Ej. 4821"></label>' + btn('🔒 Generar enlace', 'ct-gen', '', 'primary') + '<div id="ct-out"></div>');
  };
  A['ct-gen'] = async () => {
    const pin = ((document.getElementById('ct-pin') || {}).value || '').trim(); if (!/^\d{4,8}$/.test(pin)) { u.toast('El PIN debe tener de 4 a 8 números', 'err'); return; }
    if (!window.crypto || !crypto.subtle) { u.toast('Este navegador no puede cifrar (abre la app con https)', 'err'); return; }
    const g = D.grupoActual(), url = location.href.split('#')[0].replace(/[^/]*$/, '') + 'tutora.html#' + await CT.cifra(CT.datos(g), pin); E.ui.ctUrl = url;
    const msg = 'Hola. Te comparto la vista de tutoría del grupo ' + g.nombre + ' al ' + u.fLarga(u.today()) + ' (solo lectura). Ábrela en tu celular; el PIN te lo doy aparte: ' + url;
    E.ui.ctMsg = msg; const o = document.getElementById('ct-out');
    if (o) o.innerHTML = '<p class="note ok small">Listo: enlace cifrado (' + Math.round(url.length / 1024 * 10) / 10 + ' KB). Mándale el enlace por WhatsApp y el PIN por otro medio.</p><div class="row gap wrap">' + btn('💬 WhatsApp', 'ct-wa', '', 'primary small') + btn('📋 Copiar mensaje', 'ct-copiar', '', 'small') + '<a class="btn small ghost" href="' + esc(url) + '" target="_blank" rel="noopener">Probar</a></div>';
    S.update('tut:' + g.id, d => { d.ctLog = (d.ctLog || []).concat([u.today()]).slice(-20); }, {});
  };
  A['ct-copiar'] = async () => { const ok = await u.copy(E.ui.ctMsg || ''); u.toast(ok ? 'Mensaje copiado' : 'No se pudo copiar', ok ? 'ok' : 'err'); };
  A['ct-wa'] = () => { window.open('https://wa.me/?text=' + encodeURIComponent(E.ui.ctMsg || ''), '_blank', 'noopener'); };
  // en Tutoría: botón junto a «Copiar resumen para la co-tutora»
  if (V.tutoria) { const vt = V.tutoria; V.tutoria = function () { const o = vt.apply(null, arguments), g = D.grupoActual(); if (o && g && !/Algo falló|Primero importa|No hay grupo/.test(o.h)) { const lg = ((S.get('tut:' + g.id) || {}).ctLog || []); const c = card('<div class="row between gap wrap"><div><h3>👩‍🏫 Vista para la co-tutora</h3><p class="muted small">Enlace cifrado con PIN, solo lectura, sin servidor.' + (lg.length ? ' Último: ' + u.fCorta(lg[lg.length - 1]) + '.' : '') + '</p></div>' + btn('🔒 Compartir', 'ct-abrir', '', 'small primary') + '</div>'); const i = o.h.indexOf('<section', o.h.indexOf('<section') + 1); o.h = i > 0 ? o.h.slice(0, i) + c + o.h.slice(i) : o.h + c; } return o; }; }
})();
