/* Escuadra · Menú a tu medida (v1.27).
   Cuenta qué secciones abres (en este aparato), pone arriba de «Más» lo que más usas y te propone esconder lo que no
   has abierto en un mes. Lo escondido no se borra: queda en «Secciones escondidas» y se sigue pudiendo abrir.
   Lo que escondes se guarda en tu cuenta (igual en el celular y en la compu) y también se quita del menú lateral. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, esc = u.esc;
  const V = E.views, A = E.actions, H = E.h;
  const card = H.card, btn = H.btn;
  const MN = E.menu = {};
  const KU = 'escuadra.uso', KD = 'escuadra.usoDesde';
  const FIJAS = ['mas', 'ajustes', 'ayuda', 'inicio'];
  MN.uso = () => { try { return JSON.parse(localStorage.getItem(KU) || '{}') || {}; } catch (e) { return {}; } };
  MN.desde = () => { try { let d = localStorage.getItem(KD); if (!d) { d = u.today(); localStorage.setItem(KD, d); } return d; } catch (e) { return u.today(); } };
  MN.ocultas = () => (D.cfg().menuOcultos || []);
  MN.oculta = r => FIJAS.indexOf(r) < 0 && MN.ocultas().indexOf(r) >= 0;
  const cuenta = () => { const r = (location.hash.replace(/^#\/?/, '').split('/')[0]) || 'inicio'; const x = MN.uso(); const o = x[r] = x[r] || { n: 0 }; o.n++; o.ult = u.today(); try { localStorage.setItem(KU, JSON.stringify(x)); } catch (e) { } };
  window.addEventListener('hashchange', cuenta); MN.desde();
  // puntaje: usos de los últimos 30 días pesan más
  MN.puntaje = r => { const o = MN.uso()[r]; if (!o) return 0; const d = o.ult ? u.diffDays(o.ult, u.today()) : 99; return o.n * (d <= 7 ? 3 : d <= 30 ? 1.5 : 0.3); };
  MN.sinUso = rutas => { const x = MN.uso(), hoy = u.today(); return rutas.filter(r => FIJAS.indexOf(r) < 0 && !MN.oculta(r) && (!x[r] || !x[r].ult || u.diffDays(x[r].ult, hoy) > 30)); };
  const setOcultas = L => { S.update('config', c => { c.menuOcultos = Array.from(new Set(L)).filter(r => FIJAS.indexOf(r) < 0); }, {}); if (E.pintaSide) setTimeout(E.pintaSide, 0); };
  if (V.mas) {
    const vm = V.mas;
    V.mas = function () {
      const o = vm.apply(null, arguments); if (!o || !o.h) return o;
      const items = [], rx = /<a href="#\/([^"]+)">[\s\S]*?<\/a>/g; let m; while ((m = rx.exec(o.h))) items.push({ r: m[1], h: m[0] });
      if (!items.length) return o;
      const ed = !!E.ui.menuEdit, vis = items.filter(x => !MN.oculta(x.r)), ocu = items.filter(x => MN.oculta(x.r));
      const top = vis.filter(x => MN.puntaje(x.r) > 0).sort((a, b) => MN.puntaje(b.r) - MN.puntaje(a.r)).slice(0, 6);
      const tile = x => ed ? x.h.replace('<a href="#/' + x.r + '">', '<a href="#/' + x.r + '" class="mn-ed' + (MN.oculta(x.r) ? ' off' : '') + '" data-act="mn-tog" data-r="' + esc(x.r) + '">').replace('</a>', '<b class="mn-eye">' + (MN.oculta(x.r) ? '👁‍🗨 Mostrar' : '🙈 Esconder') + '</b></a>') : x.h;
      const dias = u.diffDays(MN.desde(), u.today()), sug = dias >= 14 ? MN.sinUso(vis.map(x => x.r)) : [];
      let h = '';
      if (!ed && sug.length >= 4) h += card('<div class="row between gap wrap"><p class="small">🧹 <b>' + sug.length + ' secciones</b> no las has abierto en un mes en este aparato. ¿Las escondo para que el menú quede más limpio? Siguen disponibles abajo.</p><div class="row gap">' + btn('Esconderlas', 'mn-sug', '', 'small primary') + btn('Elegir yo', 'mn-edit', '', 'small ghost') + '</div></div>');
      if (!ed && top.length >= 3) h += '<h4 class="mn-h">⭐ Lo que más usas</h4><div class="mas-grid mn-top">' + top.map(x => x.h).join('') + '</div><h4 class="mn-h">Todo</h4>';
      h += '<div class="row between gap wrap mn-bar"><span class="muted small">' + (ed ? 'Toca una sección para esconderla o mostrarla.' : vis.length + ' secciones' + (ocu.length ? ' · ' + ocu.length + ' escondidas' : '')) + '</span>' + btn(ed ? '✓ Listo' : '✏️ Acomodar menú', 'mn-edit', '', 'small' + (ed ? ' primary' : ' ghost')) + '</div>';
      h += '<div class="mas-grid">' + (ed ? items : vis).map(tile).join('') + '</div>';
      if (!ed && ocu.length) h += '<details class="sub mt" data-sec="mn-ocu"><summary>Secciones escondidas (' + ocu.length + ')</summary><div class="mas-grid">' + ocu.map(x => x.h).join('') + '</div>' + btn('Mostrar todas', 'mn-todas', '', 'small ghost') + '</details>';
      o.h = h; return o;
    };
  }
  A['mn-edit'] = () => { E.ui.menuEdit = !E.ui.menuEdit; E.render(); };
  A['mn-tog'] = (el, e) => { if (e) e.preventDefault(); const r = el.dataset.r, L = MN.ocultas().slice(), i = L.indexOf(r); if (i >= 0) L.splice(i, 1); else L.push(r); setOcultas(L); };
  A['mn-sug'] = () => { const L = MN.ocultas().concat(MN.sinUso(Array.from(document.querySelectorAll('.mas-grid a[href^="#/"]')).map(a => a.getAttribute('href').slice(2)))); setOcultas(L); u.toast('Listo: menú más limpio. Lo escondido queda al final.', 'ok', 4500); };
  A['mn-todas'] = () => setOcultas([]);
  S.on(k => { if (k === 'config' || k === '__pull' || k === '__restore') { if (E.pintaSide) E.pintaSide(); } });
})();
