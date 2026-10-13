/* Escuadra · Encuesta anónima del mes y «Ustedes dijeron, yo hice» (v1.25).
   3 preguntas cortas por QR (encuesta.html): cómo se sienten en la clase, qué les ayudó y qué cambiarían. Las respuestas
   llegan a tu Supabase sin nombre ni número de lista (tabla escuadra_encuesta: cualquiera puede responder y solo tú puedes
   leer; corre una vez el SQL de esta pantalla). Sin Supabase: imprimes papeletas anónimas y capturas el conteo a mano.
   Con los resultados eliges lo que te dijeron, escribes qué vas a hacer y lo proyectas: «Ustedes dijeron → Yo hice»
   (rutina de relación docente-alumno que ya está en Dinámicas). */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const EK = E.encuesta = {};
  const KE = (g, id) => 'enc:' + g.id + ':' + (id || '');
  const CARAS = ['😣', '😕', '😐', '🙂', '😄'];
  EK.PREG = [
    { t: '¿Cómo te sientes en esta clase?', tipo: 'escala' },
    { t: '¿Qué te ayudó más a aprender este mes?', tipo: 'opciones', ops: ['Las prácticas', 'El proyector y los temas', 'FreeCAD', 'Trabajar en equipo', 'Las explicaciones del profe', 'Los ejercicios y calentamientos'] },
    { t: '¿Qué cambiarías de la clase?', tipo: 'abierta' }
  ];
  EK.SQL = `-- Escuadra · encuesta anónima (corre esto una vez en Supabase → SQL Editor → Run)
-- Cualquiera con el enlace puede RESPONDER; solo tú puedes LEER y BORRAR. No se guarda nombre ni número de lista.
create table if not exists public.escuadra_encuesta (
  id        bigint generated always as identity primary key,
  owner     uuid not null references auth.users(id) on delete cascade,
  encuesta  text not null check (length(encuesta) <= 60),
  resp      jsonb not null check (pg_column_size(resp) < 4000),
  creado    timestamptz not null default now()
);
create index if not exists escuadra_encuesta_owner on public.escuadra_encuesta (owner, encuesta);
alter table public.escuadra_encuesta enable row level security;
drop policy if exists "encuesta: responder" on public.escuadra_encuesta;
drop policy if exists "encuesta: leer lo mío" on public.escuadra_encuesta;
drop policy if exists "encuesta: borrar lo mío" on public.escuadra_encuesta;
create policy "encuesta: responder" on public.escuadra_encuesta for insert to anon, authenticated with check (true);
create policy "encuesta: leer lo mío" on public.escuadra_encuesta for select using (auth.uid() = owner);
create policy "encuesta: borrar lo mío" on public.escuadra_encuesta for delete using (auth.uid() = owner);`;
  EK.lista = g => S.list(KE(g)).filter(x => x && x.id).sort((a, b) => String(b.f).localeCompare(String(a.f)));
  const nube = () => E.sync && E.sync.client && E.sync.user ? E.sync : null;
  EK.url = async (g, x) => { const Y = nube(); const data = { v: 1, o: Y ? Y.user.id : '', e: x.id, g: g.nombre, q: x.preguntas }; return location.href.split('#')[0].replace(/[^/]*$/, '') + 'encuesta.html#' + (E.casa ? await E.casa.empaca(data) : 'j' + btoa(unescape(encodeURIComponent(JSON.stringify(data))))); };
  EK.resultados = async (g, x) => {
    if (x.modo === 'mano') return { n: Number((x.manual || {}).n) || 0, esc: (x.manual || {}).esc || [0, 0, 0, 0, 0], ops: (x.manual || {}).ops || {}, txt: ((x.manual || {}).txt || []).map(t => ({ t: t })) };
    const Y = nube(); if (!Y) throw new Error('Inicia sesión en Supabase para ver las respuestas (Ajustes → Sincronización).');
    const r = await Y.client.from('escuadra_encuesta').select('resp,creado').eq('encuesta', x.id).order('creado', { ascending: true }).limit(500); if (r.error) throw r.error;
    const out = { n: 0, esc: [0, 0, 0, 0, 0], ops: {}, txt: [] };
    (r.data || []).forEach(row => { const a = row.resp || {}; out.n++; x.preguntas.forEach((p, i) => { const v = a['p' + i]; if (v == null || v === '') return; if (p.tipo === 'escala') { const k = Math.max(1, Math.min(5, Number(v))) - 1; out.esc[k]++; } else if (p.tipo === 'opciones') { (Array.isArray(v) ? v : [v]).forEach(o => { out.ops[o] = (out.ops[o] || 0) + 1; }); if (a['p' + i + 'o']) out.txt.push({ t: String(a['p' + i + 'o']).slice(0, 300), q: i }); } else out.txt.push({ t: String(v).slice(0, 400), q: i }); }); });
    return out;
  };
  V.encuesta = id => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const xs = EK.lista(g), x = id && xs.find(y => y.id === id);
    if (x) return detalle(g, x);
    const Y = nube(), cache = E.ui.ekRes || {};
    let h = card('<h3>🗳 Encuesta anónima del mes</h3><p class="muted small">3 preguntas por QR, sin nombre ni número de lista. Con lo que respondan eliges qué cambiar y se lo cuentas: «Ustedes dijeron → Yo hice». Hacerlo cada mes construye confianza (Roorda y col., 2011).</p>' +
      '<div class="row gap wrap">' + btn('＋ Nueva encuesta' + (Y ? ' (QR)' : ''), 'ek-nueva', 'data-m="' + (Y ? 'nube' : 'mano') + '"', 'primary') + (Y ? btn('Papeletas en papel', 'ek-nueva', 'data-m="mano"', 'small ghost') : '') + '</div>' +
      (Y ? '' : '<p class="note small">Sin sesión de Supabase la encuesta va en papeletas y capturas el conteo. Para el QR, conecta Supabase (Ajustes → Sincronización) y corre una vez el SQL de abajo.</p>') +
      '<details class="sub" data-sec="ek-sql"><summary>SQL de la encuesta (una sola vez)</summary><p class="small muted">Crea la tabla donde llegan las respuestas: cualquiera puede responder; solo tú las lees.</p>' + btn('📋 Copiar SQL', 'ek-sql', '', 'small') + '</details>');
    if (xs.length) h += card('<h3>📅 Tus encuestas</h3><ul class="pc-l">' + xs.map(y => '<li class="' + ((y.yoHice || []).length ? 'ok' : 'info') + '"><span class="pc-i">' + ((y.yoHice || []).length ? '✓' : '🗳') + '</span><div><b><a href="#/encuesta/' + y.id + '">' + esc(y.titulo) + '</a></b><small class="muted">' + u.fCorta(y.f) + ' · ' + (y.modo === 'mano' ? 'papeletas' : 'QR') + ((y.yoHice || []).length ? ' · ' + y.yoHice.length + ' «yo hice»' : ' · falta «ustedes dijeron, yo hice»') + '</small></div></li>').join('') + '</ul>');
    return { t: 'Encuesta', h: h };
  };
  function detalle(g, x) {
    const res = (E.ui.ekRes || {})[x.id], hoy = u.today();
    let h = '<p><a href="#/encuesta">‹ Encuestas</a></p>' + card('<h3>🗳 ' + esc(x.titulo) + '</h3><p class="muted small">' + u.cap(u.fLarga(x.f)) + ' · ' + (x.modo === 'mano' ? 'papeletas en papel' : 'QR, respuestas anónimas en tu Supabase') + '</p>' +
      '<div class="row gap wrap">' + (x.modo === 'mano' ? btn('🖨 Papeletas', 'ek-papel', 'data-id="' + x.id + '"', 'small primary') : btn('📽 Proyectar QR', 'ek-proj', 'data-id="' + x.id + '"', 'small primary') + btn('📋 Copiar enlace', 'ek-copiar', 'data-id="' + x.id + '"', 'small')) + btn('↻ Ver resultados', 'ek-res', 'data-id="' + x.id + '"', 'small') + btn('Borrar', 'ek-del', 'data-id="' + x.id + '"', 'small ghost danger') + '</div>');
    if (x.modo === 'mano') h += card('<h3>✍️ Captura de papeletas</h3><div class="fgrid c3"><label class="fld"><span>Papeletas</span><input type="number" min="0" data-ch="ek-man" data-id="' + x.id + '" data-k="n" value="' + esc((x.manual || {}).n || '') + '"></label></div><p class="small"><b>' + esc(x.preguntas[0].t) + '</b></p><div class="ek-esc">' + CARAS.map((c, i) => '<label class="fld"><span>' + c + '</span><input type="number" min="0" data-ch="ek-man" data-id="' + x.id + '" data-k="esc" data-i="' + i + '" value="' + esc(((x.manual || {}).esc || [])[i] || '') + '"></label>').join('') + '</div>' +
      (x.preguntas[1] && x.preguntas[1].ops ? '<p class="small"><b>' + esc(x.preguntas[1].t) + '</b></p><div class="fgrid c3">' + x.preguntas[1].ops.map(o => '<label class="fld"><span>' + esc(o) + '</span><input type="number" min="0" data-ch="ek-man" data-id="' + x.id + '" data-k="ops" data-o="' + esc(o) + '" value="' + esc(((x.manual || {}).ops || {})[o] || '') + '"></label>').join('') + '</div>' : '') +
      '<label class="fld"><span>Comentarios que quieras guardar (uno por renglón, sin nombres)</span><textarea class="inp" rows="4" data-ch="ek-man" data-id="' + x.id + '" data-k="txt">' + esc(((x.manual || {}).txt || []).join('\n')) + '</textarea></label>');
    if (res && res.err) h += card('<p class="note bad small">' + esc(res.err) + '</p>');
    else if (res) {
      const tot = res.esc.reduce((a, b) => a + b, 0), prom = tot ? res.esc.reduce((s, v, i) => s + v * (i + 1), 0) / tot : null, ops = Object.keys(res.ops).sort((a, b) => res.ops[b] - res.ops[a]), mx = Math.max(1, ...res.esc);
      h += card('<h3>📊 Resultados · ' + res.n + (res.n === 1 ? ' respuesta' : ' respuestas') + '</h3><p class="small"><b>' + esc(x.preguntas[0].t) + '</b>' + (prom != null ? ' · promedio ' + CARAS[Math.round(prom) - 1] + ' ' + prom.toFixed(1) + ' de 5' : '') + '</p><div class="ek-bars">' + res.esc.map((v, i) => '<div><span>' + CARAS[i] + '</span><i style="height:' + Math.round(v / mx * 70) + 'px"></i><b>' + v + '</b></div>').join('') + '</div>' +
        (ops.length ? '<p class="small"><b>' + esc((x.preguntas[1] || {}).t || '') + '</b></p><ul class="risk">' + ops.map(o => '<li><span>' + esc(o) + '</span><span class="chip">' + res.ops[o] + '</span></li>').join('') + '</ul>' : '') +
        (res.txt.length ? '<p class="small"><b>Lo que escribieron</b> (toca para llevarlo a «Ustedes dijeron»)</p><div class="ek-txt">' + res.txt.map(t => '<button type="button" class="rt-chip" data-act="ek-dijeron" data-id="' + x.id + '" data-t="' + esc(t.t) + '">' + esc(t.t) + '</button>').join('') + '</div>' : '<p class="small muted">Sin comentarios escritos.</p>'));
    }
    const yh = x.yoHice || [];
    h += card('<h3>💬 Ustedes dijeron → Yo hice</h3><p class="muted small">Elige 1 a 3 cosas que te dijeron y escribe qué vas a hacer (o ya hiciste). Proyéctalo la siguiente clase: que vean que su voz cuenta.</p>' +
      (yh.length ? '<ul class="ek-yh">' + yh.map((y, i) => '<li><label class="fld"><span>Ustedes dijeron</span><input class="inp" data-ch="ek-yh" data-id="' + x.id + '" data-i="' + i + '" data-k="d" value="' + esc(y.d) + '"></label><label class="fld"><span>Yo hice / haré</span><input class="inp" data-ch="ek-yh" data-id="' + x.id + '" data-i="' + i + '" data-k="h" value="' + esc(y.h) + '" placeholder="Ej. Desde el lunes, 5 minutos de dudas al final"></label>' + btn('✕', 'ek-yh-del', 'data-id="' + x.id + '" data-i="' + i + '"', 'small ghost') + '</li>').join('') + '</ul>' : '') +
      '<div class="row gap wrap">' + btn('＋ Agregar', 'ek-dijeron', 'data-id="' + x.id + '" data-t=""', 'small') + (yh.length ? btn('📽 Proyectar «Ustedes dijeron → Yo hice»', 'ek-yh-proj', 'data-id="' + x.id + '"', 'small primary') : '') + '</div>');
    return { t: 'Encuesta', h: h };
  }
  const upd = (id, fn) => { const g = D.grupoActual(); S.update(KE(g, id), d => { fn(d); }, {}); };
  A['ek-nueva'] = el => {
    const g = D.grupoActual(), modo = (el && el.dataset.m) || 'nube', id = u.uid('ek').replace(/[^a-z0-9_]/gi, '');
    const mes = u.MESES[u.parse(u.today()).getMonth()];
    S.put(KE(g, id), { id: id, f: u.today(), titulo: 'Encuesta de ' + mes, modo: modo, preguntas: u.clone(EK.PREG), manual: {}, yoHice: [] });
    location.hash = '#/encuesta/' + id;
  };
  A['ek-sql'] = async () => { const ok = await u.copy(EK.SQL); u.toast(ok ? 'SQL copiado: pégalo en Supabase → SQL Editor → Run' : 'No se pudo copiar', ok ? 'ok' : 'err', 5000); };
  const get = id => { const g = D.grupoActual(); return S.get(KE(g, id)); };
  A['ek-copiar'] = async el => { const g = D.grupoActual(), ok = await u.copy(await EK.url(g, get(el.dataset.id))); u.toast(ok ? 'Enlace copiado' : 'No se pudo copiar', ok ? 'ok' : 'err'); };
  A['ek-proj'] = async el => {
    const g = D.grupoActual(), x = get(el.dataset.id); if (!E.cam || !E.proj) return; await E.cam.qrListo(); const url = await EK.url(g, x);
    E.proj.abrir({ id: 'ek-' + x.id, titulo: 'Encuesta' }, [{ k: 'html', h: '🗳 Encuesta anónima · 1 minuto', html: '<div class="pj-qrbox">' + E.cam.qrSVG(url, 'pj-qr', 'L') + '<div><p>Escanea con tu celular y contesta 3 preguntas.</p><p><b>No pide tu nombre ni tu número.</b> Sé honesto: lo que digas me ayuda a mejorar la clase.</p></div></div>' }]);
  };
  A['ek-res'] = async el => {
    const g = D.grupoActual(), x = get(el.dataset.id); E.ui.ekRes = E.ui.ekRes || {};
    try { E.ui.ekRes[x.id] = await EK.resultados(g, x); } catch (e) { const m = String((e && e.message) || e); E.ui.ekRes[x.id] = { err: /escuadra_encuesta|42P01|does not exist|schema cache/i.test(m) ? 'Falta crear la tabla de la encuesta: copia el SQL (en Encuestas) y córrelo en Supabase.' : m }; }
    E.render();
  };
  CH['ek-man'] = el => upd(el.dataset.id, d => { d.manual = d.manual || {}; const k = el.dataset.k; if (k === 'n') d.manual.n = Number(el.value) || 0; else if (k === 'esc') { d.manual.esc = d.manual.esc || [0, 0, 0, 0, 0]; d.manual.esc[Number(el.dataset.i)] = Number(el.value) || 0; } else if (k === 'ops') { d.manual.ops = d.manual.ops || {}; d.manual.ops[el.dataset.o] = Number(el.value) || 0; } else if (k === 'txt') d.manual.txt = el.value.split('\n').map(t => t.trim()).filter(Boolean); });
  A['ek-dijeron'] = el => upd(el.dataset.id, d => { d.yoHice = d.yoHice || []; if (d.yoHice.length >= 5) return; d.yoHice.push({ d: el.dataset.t || '', h: '' }); });
  CH['ek-yh'] = el => upd(el.dataset.id, d => { const y = (d.yoHice || [])[Number(el.dataset.i)]; if (y) y[el.dataset.k] = el.value; });
  A['ek-yh-del'] = el => upd(el.dataset.id, d => { (d.yoHice || []).splice(Number(el.dataset.i), 1); });
  A['ek-yh-proj'] = el => { const x = get(el.dataset.id); if (!E.proj) return; E.proj.abrir({ id: 'ekyh-' + x.id, titulo: 'Ustedes dijeron' }, [{ k: 'cover', h: 'Ustedes dijeron → Yo hice', sub: esc(x.titulo), p: 'Gracias por contestar con honestidad.' }].concat((x.yoHice || []).filter(y => y.d || y.h).map((y, i) => ({ k: 'list', h: (i + 1) + '. Ustedes dijeron: «' + y.d + '»', items: ['Yo hice: ' + (y.h || '…')] })))); };
  A['ek-del'] = el => { if (!confirm('¿Borrar esta encuesta? (Las respuestas en Supabase se quedan; puedes borrarlas desde Supabase)')) return; const g = D.grupoActual(); S.del(KE(g, el.dataset.id)); location.hash = '#/encuesta'; };
  A['ek-papel'] = el => { const g = D.grupoActual(), x = get(el.dataset.id), one = '<div class="ek-pap"><b>Encuesta anónima · ' + esc(g.nombre) + '</b> <span class="tiny">(no escribas tu nombre)</span><p>1. ' + esc(x.preguntas[0].t) + '<br>' + CARAS.map(c => '☐ ' + c).join('   ') + '</p>' + (x.preguntas[1] && x.preguntas[1].ops ? '<p>2. ' + esc(x.preguntas[1].t) + '<br>' + x.preguntas[1].ops.map(o => '☐ ' + esc(o)).join('   ') + '</p>' : '') + '<p>3. ' + esc((x.preguntas[2] || {}).t || '') + '</p><div class="ek-lin"></div></div>'; E.print.run('<div class="pr ek-paps">' + new Array(4).fill(one).join('') + '</div>', { title: 'Encuesta ' + g.nombre, margin: '8mm' }); };
  // en Dinámicas y en Tutoría: acceso
  ['dinamicas', 'tutoria'].forEach(k => { if (V[k]) { const v0 = V[k]; V[k] = function () { const o = v0.apply(null, arguments), g = D.grupoActual(); if (o && g && !/Algo falló|Primero importa|No hay grupo/.test(o.h) && !arguments[0]) { const xs = EK.lista(g), ult = xs[0], dias = ult ? u.diffDays(ult.f, u.today()) : null; o.h += card('<div class="row between gap wrap"><div><h3>🗳 Encuesta anónima del mes</h3><p class="muted small">' + (ult ? 'Última: ' + u.fCorta(ult.f) + (dias >= 28 ? ' · ya toca otra' : '') : 'Pregúntales cómo se sienten y qué cambiarían; luego «Ustedes dijeron → Yo hice».') + '</p></div>' + link('Abrir', 'encuesta', 'small' + (!ult || dias >= 28 ? ' primary' : '')) + '</div>'); } return o; }; } });
})();
