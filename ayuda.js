/* Escuadra · Ayuda y manual (v1.24). El botón «?» de arriba abre el manual en la sección de la pantalla donde estás.
   El contenido está en ayuda-data.js (el mismo del manual en PDF, ayuda/manual-escuadra.pdf) y funciona sin internet. */
(function () {
  'use strict';
  const E = window.E, u = E.u, esc = u.esc;
  const V = E.views, A = E.actions, IN = E.inputs, H = E.h;
  const card = H.card;
  const datos = () => (window.ESCUADRA_AYUDA || { secciones: [] });
  // sección que corresponde a la pantalla actual
  const deRuta = r => { const ss = datos().secciones; return (ss.find(s => (s.rutas || []).indexOf(r) >= 0) || {}).id || ''; };
  A.ayuda = () => { const r = location.hash.replace(/^#\/?/, '').split('/')[0] || 'inicio'; location.hash = '#/ayuda/' + (r === 'ayuda' ? '' : deRuta(r)); };
  V.ayuda = sec => {
    const d = datos(), q = (E.ui.ayQ || '').trim(), nq = u.norm(q).toLowerCase();
    const ss = d.secciones.filter(s => !nq || u.norm(s.t + ' ' + s.texto).toLowerCase().indexOf(nq) >= 0);
    let h = card('<h3>❓ Ayuda y manual de Escuadra</h3><p class="muted small">Cómo usar cada pantalla, con capturas. El botón <b>?</b> de arriba te trae a la parte de la pantalla donde estás. Versión ' + esc(E.VERSION) + '.</p>' +
      '<div class="ay-top"><input id="ay-q" type="search" placeholder="Buscar en el manual: lista, QR, acta, monitores…" value="' + esc(q) + '" data-in="ay-q" autocomplete="off">' +
      '<a class="btn primary" href="ayuda/manual-escuadra.pdf" target="_blank" rel="noopener" download>⬇ Manual en PDF</a></div>' +
      '<div class="ay-idx">' + d.secciones.map(s => '<a class="chip' + (s.id === sec ? ' brand' : '') + '" href="#/ayuda/' + s.id + '">' + esc(s.corto || s.t) + (s.nuevo ? ' ✨' : '') + '</a>').join('') + '</div>');
    if (!ss.length) h += card('<p class="small">No encontré «' + esc(q) + '» en el manual.</p>');
    h += ss.map(s => '<section class="card ay-sec' + (s.id === sec ? ' aqui' : '') + '" id="ay-' + s.id + '">' + s.html + '</section>').join('');
    return { t: 'Ayuda', h: h + (sec ? '<span data-scroll="ay-' + esc(sec) + '"></span>' : ''), after: () => { if (q) { const i = document.getElementById('ay-q'); if (i && document.activeElement !== i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } } } };
  };
  let t = 0;
  IN['ay-q'] = el => { clearTimeout(t); t = setTimeout(() => { E.ui.ayQ = el.value; E.render(); }, 250); };
})();
