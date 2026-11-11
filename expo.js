/* Escuadra · Expo de la carrera (v1.32.0). Evento aparte del proyecto del 3er parcial: los equipos (los mismos del proyecto
   o nuevos) eligen una de 6 ideas fáciles (menos de 2 semanas, material comprado por ellos), se proyectan para elegir, se
   imprimen fichas con material, pasos y guion de 1 minuto, letreros para el stand y el avance de cada equipo.
   Participar es opcional: quien no entra no pierde nada. La calificación es decisión del docente: no cuenta, completa su
   participación (5 %) o da puntos extra en el parcial del evento, solo a los equipos que presentaron. */
(function () {
  const E = window.E, S = E.store, D = E.data, C = E.calc, u = E.u, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h, card = H.card, btn = H.btn, link = H.link;
  const X = E.expo = {};
  const K = g => 'expo:' + g.id;

  X.IDEAS = [
    { id: 'pulso', ico: '⚡', n: 'Juego de pulso', dif: 1, costo: 'Bajo', hace: 'Un recorrido de alambre: si el aro lo toca, suena el zumbador y se prende un LED.', vis: 'Lleva el aro de un extremo al otro sin tocar el alambre. ¿Quién llega más lejos?',
      mat: ['1 m de alambre galvanizado o de cobre grueso (calibre 12 a 14)', 'Base de MDF o madera de 30 × 15 cm', 'Aro: alambre doblado con mango (un plumón vacío)', 'Zumbador de 5 a 12 V y 1 LED con resistencia de 220 Ω', 'Pila de 9 V con broche (o portapilas de 2 AA)', 'Cable, cinta de aislar y 2 tornillos para fijar el alambre'],
      pasos: ['Doblar el recorrido con curvas y fijarlo a la base.', 'Hacer el aro y soldarle o amarrarle el cable.', 'Conectar en serie: alambre → zumbador → pila → aro, y el LED con su resistencia en paralelo al zumbador (al tocar, se cierra el circuito).', 'Probar, aislar los extremos de «inicio» y «meta» y decorar con niveles de dificultad.'],
      dem: 'Circuitos eléctricos: un circuito abierto y uno cerrado, en serie, como un sensor de contacto.' },
    { id: 'carrito', ico: '🏎️', n: 'Carrito con control alámbrico', dif: 2, costo: 'Medio', hace: 'Un carrito con 2 motores que avanza, retrocede y gira con un control de cable.', vis: 'Maneja el carrito por una pista con conos. ¡Echa carreras con tu amigo!',
      mat: ['Chasis de MDF o acrílico de 15 × 20 cm', '2 motorreductores amarillos (TT) con llantas y 1 rueda loca', 'Portapilas de 4 AA con pilas', '2 interruptores de palanca de 3 posiciones (DPDT con retorno al centro)', '2 m de cable de 4 hilos (tipo telefónico o de alarma)', 'Caja pequeña para el control, cinchos y cinta'],
      pasos: ['Montar los motores, las llantas y la rueda loca en el chasis.', 'Cablear cada interruptor DPDT como inversor de giro de su motor.', 'Llevar el cable del carrito al control y fijar el portapilas.', 'Probar adelante, atrás y giros; armar la pista con conos.'],
      dem: 'Control de motores: cambiar el sentido de giro invirtiendo la polaridad, como en las máquinas del taller.' },
    { id: 'banda', ico: '📦', n: 'Banda transportadora', dif: 2, costo: 'Medio', hace: 'Una banda que mueve piezas y se detiene sola cuando la pieza llega al final.', vis: 'Pon una pieza en la banda, arráncala y mira cómo se para sola al llegar.',
      mat: ['Estructura de MDF (2 laterales de 40 × 8 cm)', '2 rodillos de tubo de PVC de 1/2" con eje (varilla roscada o tornillo largo)', 'Banda: liga ancha, tela gruesa o cámara de bicicleta', '1 motorreductor amarillo (TT) y portapilas de 4 AA', '1 botón de arranque y 1 final de carrera (microswitch) normalmente cerrado', 'Cable, tornillos y 1 LED indicador (opcional)'],
      pasos: ['Armar la estructura y montar los rodillos para que giren libres.', 'Colocar la banda tensa y acoplar el motor a un rodillo.', 'Conectar el final de carrera en serie: al llegar la pieza lo abre y la banda se detiene.', 'Probar con piezas pequeñas y ajustar la tensión.'],
      dem: 'Automatización industrial: sensores de fin de carrera que deciden solos, como en una línea de producción.' },
    { id: 'elevador', ico: '🛗', n: 'Elevador de 2 pisos', dif: 3, costo: 'Medio', hace: 'Una cabina que sube y baja con un motor y se detiene sola en cada piso.', vis: 'Aprieta el botón y llama al elevador a tu piso.',
      mat: ['Torre de MDF o cartón rígido de unos 50 cm de alto', 'Cabina ligera (caja pequeña) e hilo de nylon resistente', '1 motorreductor amarillo (TT) con un carrete para enrollar el hilo', '2 finales de carrera (arriba y abajo) y 2 diodos 1N4007', '1 interruptor de palanca de 3 posiciones (subir, parar, bajar)', 'Portapilas de 4 AA, cable y tornillos'],
      pasos: ['Armar la torre con una guía para que la cabina no se ladee.', 'Montar el motor arriba con el carrete y amarrar el hilo a la cabina.', 'Conectar el interruptor como inversor y cada final de carrera con su diodo para que corte solo en su sentido.', 'Probar con cuidado y marcar los pisos.'],
      dem: 'Seguridad y control: límites de carrera que protegen la máquina, igual que en elevadores y grúas reales.' },
    { id: 'pluma', ico: '🚧', n: 'Pluma de estacionamiento', dif: 2, costo: 'Bajo', hace: 'Una pluma que se levanta y se baja con un motor, con luz roja y verde.', vis: 'Aprieta el botón para dejar pasar el carro y mira cómo cambia la luz.',
      mat: ['Base de MDF y un poste de madera', 'Brazo ligero (abatelenguas o palito de madera de 25 cm)', '1 motorreductor amarillo (TT)', '2 finales de carrera (arriba y abajo) y 2 diodos 1N4007', '1 interruptor de palanca de 3 posiciones, 1 LED rojo y 1 verde con resistencias', 'Portapilas de 4 AA, cable y un carrito de juguete para la demostración'],
      pasos: ['Montar el motor en el poste y fijar el brazo al eje.', 'Colocar los finales de carrera donde la pluma debe parar (arriba y abajo).', 'Conectar el inversor, los diodos y los LED (verde arriba, rojo abajo).', 'Probar, pintar la pluma y armar la entrada del estacionamiento.'],
      dem: 'Control de acceso: motor, sensores e indicadores trabajando juntos, como en las plumas de las plazas.' },
    { id: 'mano', ico: '🖐️', n: 'Mano robótica con hilos', dif: 1, costo: 'Bajo', hace: 'Una mano de cartón con «tendones» de hilo que cierra los dedos al jalar.', vis: 'Mete tus dedos en los anillos y mueve la mano robot. ¿Puedes agarrar un vaso?',
      mat: ['Cartón grueso o foami (silueta de una mano grande)', 'Popotes cortados en pedazos de 2 a 3 cm (las falanges)', 'Hilo resistente o cordón encerado', 'Ligas delgadas para que los dedos regresen', 'Silicón caliente y 5 anillos (de hilo, cinta o tapas)', 'Base o soporte para el antebrazo'],
      pasos: ['Recortar la mano y marcar las articulaciones con dobleces.', 'Pegar los popotes en cada falange y pasar un hilo por cada dedo.', 'Amarrar los hilos a los anillos y poner ligas por detrás para el regreso.', 'Probar que cada dedo cierre y abra, y decorar.'],
      dem: 'Mecanismos: tendones y articulaciones, la misma idea que las garras y prótesis robóticas.' }
  ];
  X.ETAPAS = ['Idea elegida', 'Material comprado', 'Armado', 'Funciona', 'Letrero y explicación ensayada'];
  X.idea = id => X.IDEAS.find(x => x.id === id);
  X.doc = g => Object.assign({ nombre: 'Expo de Mecatrónica', fecha: '2026-11-26', charla: '2026-11-25', equipos: [], destino: 'no', puntos: 1 }, S.get(K(g)) || {});
  const put = (g, f) => S.update(K(g), d => { const b = X.doc(g); Object.keys(b).forEach(k => { if (d[k] == null) d[k] = b[k]; }); f(d); }, {});
  X.parcialDe = g => { const f = X.doc(g).fecha, ps = D.parciales(); return (ps.find(p => f >= p.inicio && f <= p.fin) || ps[ps.length - 1] || {}).id; };
  X.equipoDe = (g, aid) => X.doc(g).equipos.find(e => (e.al || []).indexOf(aid) >= 0);
  const estrellas = n => '★'.repeat(n) + '☆'.repeat(3 - n);
  const DIF = ['', 'Fácil', 'Media', 'Retadora'];
  const destTxt = d => d.destino === 'part' ? 'A quienes presenten, se les completa la participación (5 %) del parcial.' : d.destino === 'extra' ? 'A quienes presenten: ' + d.puntos + (Number(d.puntos) === 1 ? ' punto extra' : ' puntos extra') + ' en el parcial.' : 'Participar es voluntario. Si no participas, no te baja nada.';

  // el bono a la calificación (solo si el docente lo decide y el equipo presentó)
  C.bonos.push((g, pid, aid) => {
    const d = X.doc(g); if (d.destino !== 'part' && d.destino !== 'extra') return null; if (X.parcialDe(g) !== pid) return null;
    const e = X.equipoDe(g, aid); if (!e || !e.presento) return null;
    return d.destino === 'part' ? { part: true, t: d.nombre } : { extra: Math.max(0, Math.min(2, Number(d.puntos) || 0)), t: d.nombre };
  });

  /* ---------- proyectar las ideas ---------- */
  X.slides = g => {
    const d = X.doc(g), fl = f => u.fLarga(f);
    const ideaHTML = x => '<div class="pjx"><div class="pjx-h"><span class="pjx-ico">' + x.ico + '</span><div><h2>' + esc(x.n) + '</h2><p class="pjx-tag">' + estrellas(x.dif) + ' ' + DIF[x.dif] + ' · costo ' + x.costo.toLowerCase() + '</p></div></div>' +
      '<p class="pjx-p"><b>Qué hace:</b> ' + esc(x.hace) + '</p><p class="pjx-p"><b>El visitante:</b> ' + esc(x.vis) + '</p>' +
      '<div class="pjx-cols"><div><b>Material</b><ul>' + x.mat.map(m => '<li>' + esc(m) + '</li>').join('') + '</ul></div><div><b>Cómo se arma</b><ol>' + x.pasos.map(m => '<li>' + esc(m) + '</li>').join('') + '</ol><p class="pjx-dem">🎓 ' + esc(x.dem) + '</p></div></div></div>';
    return [{ k: 'cover', sub: 'Mecatrónica · ' + (g.nombre || ''), h: d.nombre, p: 'Charlas: ' + fl(d.charla) + ' · Expo: ' + fl(d.fecha) + ' · ¡Que los de 1º quieran ser mecatrónicos!' },
      { k: 'list', h: '¿Cómo va a ser?', items: ['Cada equipo arma un proyecto que los de 1º puedan PROBAR, no solo ver.', 'Mismos equipos del proyecto (o se acomodan distinto): una idea por equipo, sin repetir.', 'Ustedes compran su material: todo es barato y se consigue en electrónica o papelería.', 'Va aparte del proyecto hidráulico del 3er parcial: no lo descuiden.', destTxt(d)] },
      { k: 'list', h: 'Las 6 ideas', items: X.IDEAS.map(x => x.ico + ' ' + x.n + ' · ' + DIF[x.dif]) }]
      .concat(X.IDEAS.map(x => ({ k: 'html', h: '', html: ideaHTML(x) })))
      .concat([{ k: 'list', h: 'Calendario', items: ['Hoy: elijan equipo e idea y hagan su lista de material.', 'Antes de la siguiente semana: material comprado.', 'Semana del 17: armado.', 'Semana del 23: que funcione, letrero y ensayar la explicación de 1 minuto.', u.fLarga(d.charla) + ': charlas.', u.fLarga(d.fecha) + ': ¡Expo!'] },
        { k: 'list', h: 'En el stand (1 minuto)', items: ['«Hola, somos el equipo ___. Esto es un ___.»', '«Funciona así: ___.»', '«En Mecatrónica aprendes esto en ___.»', '«¡Pruébalo!» (y que lo prueben)'], foot: 'Lo que convence a los de 1º es tocarlo y que ustedes se vean contentos de estudiar esto.' },
        { k: 'cover', sub: 'Ahora sí', h: '¿Qué idea eligen?', p: 'Dígale a su profe el nombre del equipo, quiénes lo forman y qué idea van a hacer.' }]);
  };

  /* ---------- impresos ---------- */
  const ficha = x => '<div class="bt-pg"><div class="pr exf"><div class="exf-h"><span class="exf-ico">' + x.ico + '</span><div><h1>' + esc(x.n) + '</h1><p>' + estrellas(x.dif) + ' ' + DIF[x.dif] + ' · costo ' + x.costo.toLowerCase() + '</p></div></div>' +
    '<p><b>Qué hace:</b> ' + esc(x.hace) + '</p><p><b>Lo que hace el visitante:</b> ' + esc(x.vis) + '</p>' +
    '<h3>Material (lo compran ustedes)</h3><ul class="exf-ck">' + x.mat.map(m => '<li><span class="bt-ck"></span>' + esc(m) + '</li>').join('') + '</ul>' +
    '<h3>Cómo se arma</h3><ol>' + x.pasos.map(m => '<li>' + esc(m) + '</li>').join('') + '</ol>' +
    '<h3>Qué demuestra de la carrera</h3><p>' + esc(x.dem) + '</p>' +
    '<h3>Explicación de 1 minuto</h3><div class="exf-gu"><p>«Hola, somos el equipo ____________. Esto es un(a) ' + esc(x.n.toLowerCase()) + '.»</p><p>«Funciona así: _______________________________________________.»</p><p>«En Mecatrónica aprendes esto en _______________________________.»</p><p>«¡Pruébalo!»</p></div>' +
    '<div class="exf-eq"><b>Equipo:</b> __________________________ &nbsp; <b>Integrantes:</b> ______________________________________________</div></div></div>';
  const letrero = (g, e) => { const x = X.idea(e.idea) || {}, al = D.alumnos(g).filter(a => (e.al || []).indexOf(a.id) >= 0);
    return '<div class="bt-pg"><div class="pr exl"><div class="exl-ico">' + (x.ico || '⚙️') + '</div><h1>' + esc(x.n || 'Proyecto') + '</h1><p class="exl-vis">' + esc(x.vis || '') + '</p><p class="exl-eq"><b>' + esc(e.nombre || 'Equipo') + '</b>' + (al.length ? ' · ' + al.map(a => esc(a.nombre.split(' ')[0])).join(', ') : '') + '</p><p class="exl-pie">Técnico en Mecatrónica · ' + esc(g.nombre || '') + ' · ¡Pruébalo!</p></div></div>'; };

  /* ---------- pantalla ---------- */
  V.expo = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const al = D.alumnos(g); if (!al.length) return H.needAlumnos('Expo');
    const d = X.doc(g), usadas = {}; d.equipos.forEach(e => { if (e.idea) usadas[e.idea] = (usadas[e.idea] || 0) + 1; });
    const enEq = {}; d.equipos.forEach(e => (e.al || []).forEach(a => { enEq[a] = e.id; })); const libres = al.filter(a => !enEq[a.id]);
    let h = card('<h3>🎪 ' + esc(d.nombre) + '</h3><p class="small">Charlas: <b>' + esc(u.fLarga(d.charla)) + '</b> · Expo: <b>' + esc(u.fLarga(d.fecha)) + '</b></p><p class="muted small">Va aparte del proyecto del 3er parcial: equipos, avance y calificación propios. Participar es opcional.</p>' +
      '<div class="row gap wrap">' + btn('📽 Proyectar las 6 ideas', 'ex-proj', '', 'primary') + btn('🖨 Fichas de las ideas', 'ex-fichas', '', '') + (d.equipos.length ? btn('🖨 Letreros del stand', 'ex-letreros', '', '') : '') + '</div>' +
      '<details class="sub"><summary>Nombre y fechas</summary><div class="fgrid"><label class="fld"><span>Nombre</span><input class="inp" data-ch="ex-f" data-k="nombre" value="' + esc(d.nombre) + '"></label><label class="fld"><span>Charlas</span><input class="inp" type="date" data-ch="ex-f" data-k="charla" value="' + esc(d.charla) + '"></label><label class="fld"><span>Expo</span><input class="inp" type="date" data-ch="ex-f" data-k="fecha" value="' + esc(d.fecha) + '"></label></div></details>');
    h += card('<h3>💡 Las ideas</h3><ul class="plain">' + X.IDEAS.map(x => '<li class="row between gap"><span>' + x.ico + ' <b>' + esc(x.n) + '</b> <small class="muted">' + estrellas(x.dif) + ' · costo ' + x.costo.toLowerCase() + '</small></span>' + (usadas[x.id] ? '<span class="chip ' + (usadas[x.id] > 1 ? 'warn' : 'brand') + '">' + (usadas[x.id] > 1 ? usadas[x.id] + ' equipos' : 'elegida') + '</span>' : '<span class="chip">libre</span>') + '</li>').join('') + '</ul>');
    // equipos
    const optIdea = e => '<select class="inp" data-ch="ex-eq" data-id="' + e.id + '" data-k="idea"><option value="">— Idea —</option>' + X.IDEAS.map(x => '<option value="' + x.id + '"' + (e.idea === x.id ? ' selected' : '') + '>' + x.ico + ' ' + esc(x.n) + (usadas[x.id] && e.idea !== x.id ? ' (ya la tiene otro)' : '') + '</option>').join('') + '</select>';
    const eqHTML = e => { const mi = al.filter(a => enEq[a.id] === e.id), av = e.avance || {}, n = X.ETAPAS.filter((t, i) => av[i]).length;
      return '<div class="momento"><div class="row between gap wrap"><input class="inp" style="max-width:60%" data-ch="ex-eq" data-id="' + e.id + '" data-k="nombre" value="' + esc(e.nombre || '') + '" aria-label="Nombre del equipo"><span class="chip ' + (n === X.ETAPAS.length ? 'ok' : n >= 3 ? 'brand' : 'warn') + '">' + n + '/' + X.ETAPAS.length + '</span></div>' + optIdea(e) +
        '<p class="small mt">' + (mi.length ? mi.map(a => '<span class="chip">' + esc(a.nombre.split(' ').slice(0, 2).join(' ')) + ' <button type="button" class="linkbtn" data-act="ex-quita" data-id="' + e.id + '" data-aid="' + a.id + '" aria-label="Quitar">✕</button></span>').join(' ') : '<span class="muted">Sin integrantes</span>') + '</p>' +
        (libres.length ? '<select class="inp" data-ch="ex-mete" data-id="' + e.id + '"><option value="">+ Agregar integrante</option>' + libres.map(a => '<option value="' + a.id + '">' + a.num + '. ' + esc(a.nombre) + '</option>').join('') + '</select>' : '') +
        '<div class="row gap wrap mt">' + X.ETAPAS.map((t, i) => '<label class="ck small"><input type="checkbox" data-ch="ex-av" data-id="' + e.id + '" data-i="' + i + '"' + (av[i] ? ' checked' : '') + '><span>' + esc(t) + '</span></label>').join('') + '</div>' +
        '<div class="row between gap wrap mt"><label class="ck"><input type="checkbox" data-ch="ex-eq" data-id="' + e.id + '" data-k="presento"' + (e.presento ? ' checked' : '') + '><span>✅ Presentó en la expo</span></label>' + btn('Borrar equipo', 'ex-borra', 'data-id="' + e.id + '"', 'small ghost') + '</div></div>'; };
    h += card('<h3>👥 Equipos (' + d.equipos.length + ')</h3>' + (d.equipos.length ? d.equipos.map(eqHTML).join('') : '<p class="small">Puedes copiar los equipos del proyecto y luego mover a quien quiera cambiarse, o armarlos desde cero.</p>') +
      '<div class="row gap wrap mt">' + btn('Copiar equipos del proyecto', 'ex-copia', '', d.equipos.length ? 'small' : 'primary') + btn('+ Equipo nuevo', 'ex-nuevo', '', 'small') + '</div>');
    h += card('<h3>🙋 Sin equipo (' + libres.length + ')</h3>' + (libres.length ? '<p class="small">' + libres.map(a => esc(a.num + '. ' + a.nombre)).join(' · ') + '</p>' : '<p class="small">Todos están en un equipo.</p>') + '<p class="muted small">Quien no participa se queda aquí. No le afecta en nada su calificación del 3er parcial.</p>');
    const pid = X.parcialDe(g), pn = (C.parcial(pid) || {}).nombre || '';
    h += card('<h3>📊 ¿Cuenta para la calificación?</h3><label class="fld"><span>Para los equipos que presenten (' + esc(pn) + ')</span><select class="inp" data-ch="ex-f" data-k="destino">' +
      [['no', 'No cuenta (todavía lo estoy pensando)'], ['part', 'Completa su participación (5 %)'], ['extra', 'Puntos extra en la calificación del parcial']].map(o => '<option value="' + o[0] + '"' + (d.destino === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></label>' +
      (d.destino === 'extra' ? '<label class="fld"><span>Puntos extra (de 0.5 a 2)</span><input class="inp" type="number" step="0.5" min="0.5" max="2" data-ch="ex-f" data-k="puntos" value="' + esc(d.puntos) + '"></label>' : '') +
      '<p class="muted small">' + (d.destino === 'part' ? 'Completar el 5 % de participación vale hasta medio punto (si ya la tenía completa, no cambia). ' : d.destino === 'extra' ? 'Se suma a la calificación del parcial (sin pasar de 10) y sigue sin decimales. ' : '') + 'Solo cuenta para los equipos marcados con «Presentó en la expo». Quien no participa no pierde nada.</p>');
    return { t: 'Expo', h: h };
  };
  CH['ex-f'] = el => { const g = D.grupoActual(), k = el.dataset.k; let v = el.value; if (k === 'puntos') { v = Number(v); if (!(v >= 0.5 && v <= 2)) { u.toast('De 0.5 a 2 puntos', 'err'); return; } } put(g, d => { d[k] = v; }); };
  CH['ex-eq'] = el => { const g = D.grupoActual(), k = el.dataset.k; put(g, d => { const e = d.equipos.find(x => x.id === el.dataset.id); if (!e) return; e[k] = k === 'presento' ? el.checked : el.value; if (k === 'idea' && el.value) { e.avance = e.avance || {}; e.avance[0] = true; } }); };
  CH['ex-av'] = el => { const g = D.grupoActual(); put(g, d => { const e = d.equipos.find(x => x.id === el.dataset.id); if (!e) return; e.avance = e.avance || {}; e.avance[el.dataset.i] = el.checked; }); };
  CH['ex-mete'] = el => { const g = D.grupoActual(), aid = el.value; if (!aid) return; put(g, d => { d.equipos.forEach(e => { e.al = (e.al || []).filter(x => x !== aid); }); const e = d.equipos.find(x => x.id === el.dataset.id); if (e) e.al.push(aid); }); };
  A['ex-quita'] = el => { const g = D.grupoActual(); put(g, d => { const e = d.equipos.find(x => x.id === el.dataset.id); if (e) e.al = (e.al || []).filter(x => x !== el.dataset.aid); }); };
  A['ex-nuevo'] = () => { const g = D.grupoActual(); put(g, d => { d.equipos.push({ id: u.uid('ex'), nombre: 'Equipo ' + (d.equipos.length + 1), idea: '', al: [], avance: {} }); }); };
  A['ex-borra'] = el => { if (!confirm('¿Borrar este equipo? Sus integrantes quedan sin equipo.')) return; const g = D.grupoActual(); put(g, d => { d.equipos = d.equipos.filter(x => x.id !== el.dataset.id); }); };
  A['ex-copia'] = () => {
    const g = D.grupoActual(), PJ = E.proyecto; if (!PJ) return; const ps = D.parciales(), i = ps.findIndex(p => p.id === X.parcialDe(g));
    let src = []; for (let k = i; k >= 0 && !src.length; k--) src = (PJ.doc(g, ps[k].id).equipos || []).filter(e => (e.al || []).length);
    if (!src.length) { u.toast('El proyecto todavía no tiene equipos', 'err'); return; }
    if (X.doc(g).equipos.length && !confirm('Ya hay equipos de la expo. ¿Reemplazarlos por los del proyecto?')) return;
    put(g, d => { d.equipos = src.map((e, j) => ({ id: u.uid('ex'), nombre: e.nombre || 'Equipo ' + (j + 1), idea: '', al: (e.al || []).slice(), avance: {} })); });
    u.toast('Copiados ' + src.length + ' equipos. Mueve a quien quiera cambiarse.', 'ok');
  };
  A['ex-proj'] = () => { const g = D.grupoActual(); E.proj.abrir({ id: 'expo', titulo: X.doc(g).nombre }, X.slides(g)); };
  A['ex-fichas'] = () => E.print.run(X.IDEAS.map(ficha).join(''), { title: 'Fichas de las ideas · ' + X.doc(D.grupoActual()).nombre });
  A['ex-letreros'] = () => { const g = D.grupoActual(), eqs = X.doc(g).equipos.filter(e => e.idea); if (!eqs.length) { u.toast('Primero elige la idea de cada equipo', 'err'); return; } E.print.run(eqs.map(e => letrero(g, e)).join(''), { title: 'Letreros del stand', landscape: true }); };
})();
