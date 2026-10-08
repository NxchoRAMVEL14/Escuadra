/* Escuadra · Imágenes y videos de cada tema: figuras animadas propias, videos seleccionados (verificados en YouTube)
   y tus propios recursos (videos, imágenes o páginas que agregues). Todo se ve en el tema, en la clase y en el proyector. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, esc = u.esc;
  const A = E.actions, H = E.h, btn = H.btn, card = H.card, icon = E.icon;

  // Videos verificados el 7 de octubre de 2026 con el servicio oEmbed de YouTube (existen y permiten insertarse).
  // Revísalos antes de mostrarlos al grupo: se eligieron por título y canal.
  E.VIDEOS = {
    'sm1-planos': [['A9klEF5PFvg', 'Dibujo Técnico: ¿Cómo es la Proyección Ortogonal? "Sistema Monge"', 'Alejandro Miles'], ['v1vjHB60c8Q', 'Acotación - Normas básicas para aprender a acotar', 'Arturo Geometría']],
    'sm1-restricciones': [['1DMKBExok00', 'Curso FreeCad 1.0 Restricciones de geometría y dimensionales', 'Rafael 3D'], ['qMr_QDaq8IQ', 'Curso FreeCad 1.0 Restricciones de geometría y dimensionales. Parte 2', 'Rafael 3D']],
    'sm2-mecanismo': [['08CvcKj_NzM', 'Tutorial - Pares cinemáticos', 'Jose Maria Rico'], ['05c2cBSFQwU', 'Tipos de eslabones y representaciones de elementos en diagramas cinemáticos', 'Learning with style']],
    'sm2-movimientos': [['qVj52hP0hdU', 'Mecanismos 3 - Transformación circular lineal y oscilante', 'Gmedrano TIC'], ['hmd6YW0xaRw', 'Transmisión y transformación del movimiento', 'AprendoEnCasaRMurcia']],
    'sm2-gdl': [['nGoH7MmjFzA', 'Criterio de Grübler: grados de libertad biela-manivela-corredera', 'Doctor Felipe Nerhi'], ['j6A5LoUG-YY', 'Grados de libertad (GDL) · Grübler · Kutzbach · ejercicio Myszka 1-19', 'dcahue-ingeniería']],
    'sm2-4barras': [['aCGVCuPfl4U', 'Mecanismos de 4 barras, condición de Grashof', 'Los mecatrónicos'], ['kmU6jFP6IW4', 'Mecanismos de 4 barras y Ley de Grashof', 'Ernesto García Camacho']],
    'sm2-biela': [['Dyee1JVYsd0', 'La biela-manivela (mecanismo de transformación)', 'TECH LAPSE'], ['34Wr-azyhRc', 'Sistema Biela-Manivela', 'Pelandintecno']],
    'sm2-levas': [['Fpls57XAEWI', 'Leva y excéntrica', 'TECH LAPSE'], ['1zaqVIQi9jg', 'Tipos de levas', 'Ing. Víctor Ramírez Minjares']],
    'sm2-engranes': [['ggm0wwP4E5Q', 'Engranajes', 'Aprendo'], ['rmQesSkb5ZA', 'Tren de engranajes', 'Aprendo']],
    'sm2-poleas': [['_a-Z7oOdrg8', 'Poleas con correas: relación de transmisión', 'Aprendo'], ['DHndvrIkc0k', 'Mecanismos: transmisión poleas con correa', 'Oscar Saborido']],
    'sm2-tornillo': [['Mw4Msp_7zKs', 'Sistema piñón-cremallera', 'Pelandintecno'], ['UH_PL09gUK0', 'Sistema tornillo-tuerca', 'TECNOLOGÍANONO']],
    'sm2-explosionada': [['MLlNr_GSyTg', 'FreeCAD 1.0 · Workbench Assembly: conceptos básicos', 'juan bosh garcia'], ['qTGPazlK9AE', 'Ensamblaje en FreeCAD 1.1: vista explosionada y planos de montaje', 'Construye Mejor']],
    'sm2-seguridad': [['qFRYnaGjLvg', 'Medidas de seguridad en el uso de herramientas manuales', 'ARL SURA'], ['K8CPDspjGaA', 'Cómo usar herramientas manuales de forma segura (charla de 5 minutos)', 'Proyecto HS']],
    'sm3-presion': [['drPOCoiqaPs', 'Qué es la presión y sus unidades', 'Educar-C'], ['qA6miHF0UZA', 'Unidades de presión: Pascal, atmósfera, mm de Hg, bar, psi', 'Profesor Física y Química']],
    'sm3-pascal': [['MyybIRPX010', 'El principio de Pascal o ¿Cómo multiplicar tu fuerza?', 'CuriosaMente'], ['rEEy0yGY4nU', 'Principio de Pascal y la prensa hidráulica', 'Nuria Solorzano']],
    'sm3-aire': [['XIyyfU6v06E', 'Preparación del aire comprimido · FRL', 'Automatización Industrial'], ['9PH3B_NAt_M', '¿Cómo funciona un FRL o unidad de mantenimiento neumático?', '13 en Ingeniería']],
    'sm3-cilindros': [['2cJAK-PHXRg', 'Funcionamiento de los cilindros de simple y doble efecto', 'Nilson Ramos'], ['kClByvZcA9o', 'Cilindros neumáticos: simbología y tipos', 'Ingeniero de la productividad']],
    'sm3-valvulas': [['tx3H61vwU4o', '¿Qué es y cómo leer una válvula neumática direccional 5/2 y 3/2?', 'Neunify'], ['O-QEmBBXAVc', 'Válvulas neumáticas 3/2: guía para principiantes', 'Ingeniero de la productividad']],
    'sm3-iso1219': [['H__EmUNXsqQ', 'Neumática básica escolar: simbología', 'LDP Educación'], ['-v0WPyBsmYE', 'Norma ISO 1219: simbología neumática e hidráulica', 'AprendiendoconPitter']],
    'sm3-electro': [['GnQYvIl0ZWs', 'Automatización: principios de electroneumática', 'Carlos Juárez'], ['a2jpBAgV0XY', 'Esquema eléctrico para control de cilindro de doble efecto', 'José Ramón Vaello']],
    'sm3-motordc': [['A_VGpRxFzXQ', '¿Cómo funciona un motor eléctrico? Motor de CD explicado', 'Mentalidad De Ingeniería'], ['Z53FGMs6sfA', 'Inversor de giro para motor eléctrico: puente H con interruptores', 'Electrónica Práctica Paso a Paso']],
    'gen-mecatronica': [['pbRELYwucQI', 'Qué es la Ingeniería Mecatrónica y sus aplicaciones', 'AREATECNOLOGIA'], ['zYo8z2r3mnY', 'Qué es la Mecatrónica', 'El Quinto Talento']]
  };

  const M = E.medios = {};
  const ytId = url => { const m = String(url || '').match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/); return m ? m[1] : null; };
  const esImg = url => /\.(jpe?g|png|gif|webp|svg|avif)(\?|#|$)/i.test(String(url || ''));
  M.propios = id => ((S.get('recursos') || {})[id]) || [];
  M.figs = id => (E.FIG_TEMA || {})[id] || [];
  M.videos = id => (E.VIDEOS[id] || []).map(v => ({ yt: v[0], t: v[1], a: v[2] })).concat(M.propios(id).filter(r => r.tipo === 'video').map(r => ({ yt: r.yt, t: r.titulo || 'Mi video', a: 'Agregado por ti', propio: r.id })));
  M.imagenes = id => M.propios(id).filter(r => r.tipo === 'imagen');
  M.links = id => M.propios(id).filter(r => r.tipo === 'link');
  M.embed = (yt, auto) => 'https://www.youtube-nocookie.com/embed/' + yt + '?rel=0&modestbranding=1&playsinline=1&enablejsapi=1' + (auto ? '&autoplay=1' : '');
  M.thumb = yt => 'https://i.ytimg.com/vi/' + yt + '/mqdefault.jpg';
  const vidCard = (tema, v) => '<div class="vcard"><button type="button" class="vthumb" data-act="vid-ver" data-yt="' + v.yt + '" data-tema="' + tema + '" aria-label="Ver ' + esc(v.t) + '"><img loading="lazy" alt="" src="' + M.thumb(v.yt) + '" onerror="this.style.visibility=\'hidden\'"><span>▶</span></button><div class="vinfo"><b>' + esc(v.t) + '</b><span class="muted small">' + esc(v.a) + '</span>' + (v.propio ? btn('Quitar', 'rec-del', 'data-tema="' + tema + '" data-id="' + v.propio + '"', 'small ghost danger') : '') + '</div></div>';

  // tarjeta completa para la pantalla del tema
  M.cardHTML = t => {
    const figs = M.figs(t.id), vids = M.videos(t.id), imgs = M.imagenes(t.id), links = M.links(t.id);
    let h = '<h3>🎬 Imágenes y videos</h3>';
    if (figs.length) h += '<div class="figs">' + figs.map(id => E.fig.html(id)).join('') + '</div>';
    if (vids.length) h += '<h4>Videos</h4><div class="vgrid">' + vids.map(v => vidCard(t.id, v)).join('') + '</div><p class="muted small">Los videos necesitan internet; las animaciones funcionan sin internet. Revisa cada video antes de proyectarlo.</p>';
    if (imgs.length) h += '<h4>Mis imágenes</h4><div class="igrid">' + imgs.map(r => '<figure class="ifig"><img loading="lazy" src="' + esc(r.url) + '" alt="' + esc(r.titulo || '') + '" data-act="img-ver" data-src="' + esc(r.url) + '" data-t="' + esc(r.titulo || '') + '"><figcaption>' + esc(r.titulo || '') + ' ' + btn('Quitar', 'rec-del', 'data-tema="' + t.id + '" data-id="' + r.id + '"', 'small ghost danger') + '</figcaption></figure>').join('') + '</div>';
    if (links.length) h += '<h4>Mis enlaces</h4><ul class="risk">' + links.map(r => '<li><a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.titulo || r.url) + '</a>' + btn('Quitar', 'rec-del', 'data-tema="' + t.id + '" data-id="' + r.id + '"', 'small ghost danger') + '</li>').join('') + '</ul>';
    h += '<details class="sub"><summary>➕ Agregar un video, imagen o página</summary><p class="muted small">Pega el enlace de YouTube, de una imagen (que termine en .jpg, .png…) o de cualquier página. Se guarda en este tema y aparece en tus clases y en el proyector.</p>' +
      '<label class="fld"><span>Enlace</span><input id="rec-url-' + t.id + '" placeholder="https://youtu.be/… o https://…/foto.jpg" inputmode="url"></label><label class="fld"><span>Título (opcional)</span><input id="rec-tit-' + t.id + '" placeholder="Ej. Pinzas de presión en cámara lenta"></label>' +
      btn('Agregar', 'rec-add', 'data-tema="' + t.id + '"', 'primary') + ' <a class="btn ghost small" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=' + encodeURIComponent(t.titulo) + '">Buscar más en YouTube</a></details>';
    return h;
  };
  // versión compacta para el guion de la clase
  M.claseHTML = temaId => {
    const figs = M.figs(temaId), vids = M.videos(temaId); if (!figs.length && !vids.length && !M.imagenes(temaId).length) return '';
    return '<details class="sub cl-medios" open><summary>🎬 Imágenes y videos del tema</summary>' + (figs.length ? E.fig.html(figs[0], { pausa: true }) : '') + (figs.length > 1 ? '<p class="small"><a href="#/tema/' + temaId + '">Ver ' + (figs.length - 1) + ' figura más en el tema ›</a></p>' : '') +
      (vids.length ? '<div class="row gap wrap">' + vids.map(v => btn('▶ ' + esc(v.t.length > 46 ? v.t.slice(0, 44) + '…' : v.t), 'vid-ver', 'data-yt="' + v.yt + '" data-tema="' + temaId + '"', 'small')).join('') + '</div>' : '') + '</details>';
  };
  // diapositivas extra para el modo Proyector
  M.slides = t => ({
    figs: M.figs(t.id).map(id => ({ k: 'fig', h: E.FIGS[id].t, fig: id })),
    fin: M.videos(t.id).slice(0, 1).concat(M.videos(t.id).filter(v => v.propio)).map(v => ({ k: 'video', h: v.t, yt: v.yt, a: v.a }))
      .concat(M.imagenes(t.id).map(r => ({ k: 'img', h: r.titulo || 'Imagen', src: r.url })))
  });
  M.slideBody = (sl, mini) => {
    if (sl.k === 'fig') return '<h2>' + esc(sl.h) + '</h2>' + E.fig.html(sl.fig, { cls: 'fig-pj' });
    if (sl.k === 'video') return '<h2>' + esc(sl.h) + '</h2>' + (mini ? '<div class="pj-video"><img src="' + M.thumb(sl.yt) + '" alt="" onerror="this.style.visibility=\'hidden\'"><span class="pj-play">▶</span></div>' : '<div class="pj-video"><iframe src="' + M.embed(sl.yt) + '" title="' + esc(sl.h) + '" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>') + '<p class="pj-src">Video: ' + esc(sl.a) + ' · YouTube</p>';
    if (sl.k === 'img') return '<h2>' + esc(sl.h) + '</h2><div class="pj-imgw"><img class="pj-img" src="' + esc(sl.src) + '" alt=""></div>';
    return '';
  };

  /* ---------- acciones ---------- */
  A['vid-ver'] = el => {
    const tema = el.dataset.tema, v = M.videos(tema).find(x => x.yt === el.dataset.yt) || { yt: el.dataset.yt, t: 'Video', a: '' };
    E.modal.open(v.t, '<div class="vid"><iframe src="' + M.embed(v.yt, true) + '" title="' + esc(v.t) + '" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>' +
      '<p class="small muted">' + esc(v.a) + ' · <a href="https://www.youtube.com/watch?v=' + v.yt + '" target="_blank" rel="noopener">Abrir en YouTube</a></p>' +
      '<div class="row gap wrap">' + btn(icon('screen') + ' Proyectar este video', 'vid-proy', 'data-yt="' + v.yt + '" data-tema="' + tema + '"', 'primary') + btn('Cerrar', 'modal-close') + '</div>');
  };
  A['vid-proy'] = el => {
    const tema = el.dataset.tema, yt = el.dataset.yt; E.modal.close(); E.proj.open(tema);
    let i = E.proj.s.findIndex(s => s.k === 'video' && s.yt === yt);
    if (i < 0) { const v = M.videos(tema).find(x => x.yt === yt); E.proj.s.splice(E.proj.s.length - 1, 0, { k: 'video', h: v ? v.t : 'Video', yt: yt, a: v ? v.a : '' }); i = E.proj.s.length - 2; }
    E.proj.i = i; E.proj.draw();
  };
  A['img-ver'] = el => E.modal.open(el.dataset.t || 'Imagen', '<img class="img-grande" src="' + esc(el.dataset.src) + '" alt="">');
  A['rec-add'] = el => {
    const tema = el.dataset.tema, url = (document.getElementById('rec-url-' + tema) || {}).value.trim(), tit = (document.getElementById('rec-tit-' + tema) || {}).value.trim();
    if (!/^https?:\/\//i.test(url)) { u.toast('Pega un enlace que empiece con https://', 'err'); return; }
    const yt = ytId(url), r = { id: u.uid('rec'), url: url, titulo: tit, tipo: yt ? 'video' : esImg(url) ? 'imagen' : 'link' }; if (yt) r.yt = yt;
    S.update('recursos', d => { (d[tema] = d[tema] || []).push(r); }, {});
    u.toast(r.tipo === 'video' ? 'Video agregado' : r.tipo === 'imagen' ? 'Imagen agregada' : 'Enlace agregado', 'ok');
  };
  A['rec-del'] = el => { if (!confirm('¿Quitar este recurso del tema?')) return; S.update('recursos', d => { d[el.dataset.tema] = (d[el.dataset.tema] || []).filter(r => r.id !== el.dataset.id); }, {}); };
})();
