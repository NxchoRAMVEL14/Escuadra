/* Escuadra · QR del grupo para el salón (v1.28). Una hoja para pegar en el salón con un QR grande que abre grupo.html:
   próximas entregas, fecha del examen y temas que entran, y cuándo termina el parcial. La misma información va escrita
   en la hoja, para quien no escanee. Como la consulta, los datos viajan dentro del enlace (después del #): no lleva
   nombres de alumnos ni calificaciones y no se guarda en ningún servidor. Cuando cambie algo, imprime otra. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, H = E.h;
  const card = H.card, btn = H.btn;
  const SL = E.salon = {};
  const corto = (t, n) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
  const tTit = id => { const t = (E.TEMAS || []).find(x => x.id === id); return t ? t.titulo : id; };
  SL.datos = (g, pid) => {
    const hoy = u.today(), p = C.parcial(pid) || C.parcialActual(), cf = D.cfg();
    const en = C.acts(g, p.id).filter(a => a.fecha && a.fecha >= hoy && a.categoria !== 'examen' && a.cuenta !== false).slice(0, 10).map(a => [a.fecha, corto(a.nombre, 70)]);
    let ex = null;
    if (E.examen) {
      const xs = E.examen.list(g).filter(x => x.parcial === p.id && x.fecha >= hoy), x = xs[0];
      if (x) ex = [x.fecha, Array.from(new Set((x.items || []).map(it => ((E.BANCO || []).find(b => b.id === it.id) || {}).tema).filter(Boolean))).map(tTit).slice(0, 10)];
      else { const fx = E.examen.fechaExamen(g, p.id); if (fx && fx.f >= hoy) { let hs = {}; try { hs = E.examen.temasVistos(g, p.id, fx.f); } catch (e) { } ex = [fx.f, Object.keys(hs).sort((a, b) => hs[b] - hs[a]).slice(0, 10).map(tTit)]; } }
    }
    return { v: 1, k: 'grupo', g: g.nombre, pl: cf.plantel || '', d: cf.docente || '', f: hoy, p: p.nombre, pf: p.fin, en: en, ex: ex };
  };
  SL.url = async (g, pid) => { const l = location.href.split('#')[0].split('?')[0].replace(/[^/]*$/, ''); return l + 'grupo.html#' + await E.casa.empaca(SL.datos(g, pid)); };
  const fl = f => u.cap(u.fLarga(f));
  A['sl-print'] = async el => {
    const g = D.grupoActual(); if (!g) return; const pid = el.dataset.pid || C.parcialActual().id;
    if (E.cam && E.cam.qrListo) await E.cam.qrListo();
    const d = SL.datos(g, pid), url = await SL.url(g, pid);
    const lis = (L, f) => L.length ? '<ul style="margin:2mm 0 0;padding-left:6mm;font-size:12pt;line-height:1.5">' + L.map(f).join('') + '</ul>' : '<p style="font-size:11pt">—</p>';
    E.print.run('<div class="pr" style="font-size:12pt">' +
      '<h1 style="font-size:24pt;margin:0 0 2mm">' + esc(g.nombre) + ' · ' + esc(d.p) + '</h1><p style="font-size:11pt;margin:0 0 6mm">' + esc(d.pl) + ' · al ' + esc(fl(d.f)) + '</p>' +
      '<div style="display:flex;gap:10mm;align-items:flex-start"><div style="width:80mm;flex:none;text-align:center">' + E.cam.qrSVG(url, 'sl-qr', 'M').replace('<svg ', '<svg style="width:80mm;height:80mm" ') + '<p style="font-size:11pt;margin:2mm 0 0"><b>Escanéalo con tu celular</b><br>para ver esto en tu teléfono</p></div><div style="flex:1">' +
      '<h2 style="font-size:15pt;margin:0 0 1mm">📌 Próximas entregas</h2>' + lis(d.en, x => '<li><b>' + esc(u.fCorta(x[0])) + '</b> · ' + esc(x[1]) + '</li>') +
      (d.ex ? '<h2 style="font-size:15pt;margin:5mm 0 1mm">📝 Examen: ' + esc(fl(d.ex[0])) + '</h2>' + (d.ex[1].length ? '<p style="margin:0;font-size:11pt">Temas que entran:</p>' + lis(d.ex[1], t => '<li>' + esc(t) + '</li>') : '') : '') +
      '<p style="font-size:11pt;margin-top:5mm">El ' + esc(d.p) + ' termina el <b>' + esc(fl(d.pf)) + '</b>. Lo entregado tarde vale ' + Math.round(C.tardeVale() * 100) + ' %.</p></div></div></div>',
      { title: 'QR del grupo · ' + g.nombre, margin: '12mm' });
  };
  if (V.imprimir) {
    const vi = V.imprimir;
    V.imprimir = function () {
      const o = vi.apply(null, arguments), g = D.grupoActual(); if (!o || !g || /Algo falló/.test(o.h)) return o;
      const pid = (E.ui.print && E.ui.print.pid) || C.parcialActual().id;
      o.h += card('<h3>📌 Para el salón</h3><p class="muted small">Una hoja con un QR grande para pegar en el salón: próximas entregas, fecha del examen y temas que entran. Va escrita también, para quien no tenga celular. Sin nombres ni calificaciones.</p><div class="row gap wrap">' + btn('🖨 QR del grupo (entregas y examen)', 'sl-print', 'data-pid="' + pid + '"', 'primary') + '</div>');
      return o;
    };
  }
})();
