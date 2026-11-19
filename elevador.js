/* Escuadra · Elevador de 2 pisos (v1.41.0): el diagrama escalera del elevador para explicarlo renglón por renglón en el
   proyector (sigue lo visto en «Electroneumática: mando eléctrico» y «Diagrama de escalera»: rieles, contactos a la
   izquierda y carga a la derecha, NA/NC, autorretención y paro NC), el simulador interactivo (elevador.html) y la hoja
   para la tarea. Sale en las clases de diagrama de escalera y en Inicio el día de la clase. */
(function () {
  'use strict';
  const E = window.E, u = E.u, esc = u.esc, A = E.actions, V = E.views, H = E.h, card = H.card;
  const EL = E.elev = {}, DT = () => window.ELEV_DATA || null;
  EL.FECHA = '2026-11-19';
  EL.URL = 'elevador.html';
  const R = [
    ['CRPE', 'Seguridad: el paro de emergencia', ['El paro (PE) es NC: en reposo deja pasar la corriente', 'CRPE energizado = «todo en orden»', 'Si presionan el paro, CRPE cae y sus contactos cortan todo lo que se mueve']],
    ['CR1', 'Memoria «ir al piso 1»', ['B1 o B4 en paralelo: paralelo = «O»', 'El contacto CR1 en paralelo con los botones es la autorretención (¡lo de ayer!)', 'CR2 NC: si ya va al piso 2, ignora esta llamada', 'TC NC: borra la memoria al terminar el ciclo']],
    ['CR2', 'Memoria «ir al piso 2»', ['B2 o B3 en paralelo', 'Autorretención con su propio contacto CR2', 'CR1 NC: nunca las dos memorias a la vez', 'TC NC: borra la memoria al terminar']],
    ['CRP', 'Llegó al piso pedido', ['Rama de arriba: quieren el piso 1 Y está en S1', 'Rama de abajo: quieren el piso 2 Y está en S2', 'Serie = «Y» · Paralelo = «O»', 'CRP arranca el ciclo de las puertas']],
    ['KM1B', 'Motor 1: bajar', ['Con CR1, el motor baja mientras S1 no esté pisado (NC)', 'Al llegar, S1 abre su NC y el motor se detiene solo', 'KM1S NC: nunca subir y bajar a la vez (enclavamiento)']],
    ['KM1S', 'Motor 1: subir', ['Con CR2, sube hasta que S2 abre su NC', 'KM1B NC: enclavamiento', 'CRPE en serie: el paro lo detiene']],
    ['TA', 'Temporizador: tiempo para abrir', ['Temporizador a la conexión (TON) de 2 s', 'Empieza a contar cuando CRP se energiza', 'Sus contactos cambian cuando termina de contar']],
    ['KM2A', 'Motor 2: abrir puertas', ['Abre mientras TA no termine (NC temporizado)', 'CRPE en serie: con paro no abre', 'KM2C NC: no abrir y cerrar a la vez']],
    ['TE', 'Temporizador: puertas abiertas', ['Cuando TA termina, su NA temporizado cierra', 'TE cuenta 5 s con las puertas abiertas', 'Tiempo para que la gente entre o salga']],
    ['TC', 'Temporizador: tiempo para cerrar', ['Cuando TE termina, TC cuenta 2 s', 'Al terminar, su NC borra CR1 o CR2 (renglones 2 y 3)', 'Todo regresa a reposo']],
    ['KM2C', 'Motor 2: cerrar puertas', ['Rama 1, ciclo normal: después de TE y antes de que termine TC', 'Rama 2, paro: CRPE NC cierra durante TPE', 'KM2A NC: enclavamiento']],
    ['TPE', 'Temporizador: cierre por paro', ['Con el paro presionado cuenta 2 s', 'Luego KM2C deja de cerrar para no forzar el motor']]
  ];
  const Q = {
    2: ['¿Qué pasa si quitamos el contacto CR1 que está en paralelo con B1 y B4?', 'Al soltar el botón se apaga CR1: el elevador solo se movería mientras alguien lo tenga presionado. Esa es la autorretención.'],
    5: ['¿Por qué S1 aparece como NA en el renglón 4 y como NC en el renglón 5?', 'Es el mismo final de carrera con dos contactos: el NA avisa «ya llegué» y arranca las puertas; el NC detiene el motor.'],
    8: ['¿Qué pasaría si quitamos el contacto NC de KM2C del renglón 8?', 'Podrían energizarse «abrir» y «cerrar» al mismo tiempo: corto en el circuito de fuerza del motor 2.'],
    12: ['Va subiendo y alguien presiona el paro. ¿Qué bobinas cambian?', 'CRPE cae → se borra CR2 y se apaga KM1S; KM2C cierra las puertas durante TPE (2 s).']
  };
  // escalera: recorta un renglón o muestra todo con el actual resaltado y los que faltan tenues
  const lad = (n, modo) => { const d = DT(); if (!d) return ''; let s = d.lad;
    if (modo === 'mini') d.rg.forEach(r => { if (r[0] > n) s = s.replace('<g class="rg" data-n="' + r[0] + '">', '<g class="rg" data-n="' + r[0] + '" opacity=".1">'); });
    s = s.replace(new RegExp('(<g class="rg" data-n="' + n + '"[^>]*><rect[^>]*?)fill="transparent"'), '$1fill="#ffd84d" fill-opacity=".3"');
    const r = d.rg.find(x => x[0] === n) || [n, 0, d.H], vb = modo === 'mini' ? '0 0 ' + d.W + ' ' + d.H : '0 ' + (r[1] - 2) + ' ' + d.W + ' ' + (r[2] + 5);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" class="el-' + (modo || 'big') + '" role="img" aria-label="Renglón ' + n + ' del diagrama escalera">' + s + '</svg>'; };
  EL.lad = lad;
  EL.slides = () => {
    const d = DT(), sl = [];
    sl.push({ k: 'cover', sub: 'Técnico en Mecatrónica · Diagrama de escalera', h: 'El elevador de 2 pisos', p: 'Lo de ayer, aplicado: renglón por renglón, entre todos' });
    sl.push({ k: 'q', h: 'Repaso de ayer · 1', q: 'En un diagrama de escalera, ¿dónde van los contactos y dónde la carga (bobina)?', a: 'Contactos a la izquierda, la carga a la derecha, entre los dos rieles (24 V y 0 V).' });
    sl.push({ k: 'q', h: 'Repaso de ayer · 2', q: '¿Qué es la autorretención (enclavamiento)?', a: 'Un contacto NA del relé en paralelo con el botón de arranque: mantiene la bobina energizada al soltar el botón.' });
    sl.push({ k: 'q', h: 'Repaso de ayer · 3', q: '¿Por qué el botón de paro se conecta como NC?', a: 'Para que, si se corta un cable, la máquina se detenga (falla segura).' });
    if (d) sl.push({ k: 'html', h: 'La maqueta', html: '<div class="el-maq"><svg viewBox="0 0 520 640" role="img" aria-label="Elevador de dos pisos">' + d.maq + '</svg><ul class="el-pts"><li><b>M1</b> sube y baja la cabina</li><li><b>M2</b> abre y cierra las puertas</li><li><b>B1</b> ▲ llama al piso 1 · <b>B2</b> ▼ llama al piso 2</li><li><b>B3</b> ▲ y <b>B4</b> ▼ en la cabina</li><li><b>PE</b>: paro de emergencia (NC)</li><li><b>S1</b> y <b>S2</b>: finales de carrera de cada piso</li></ul></div>' });
    sl.push({ k: 'list', h: '¿Cómo debe funcionar?', items: ['Llaman en un piso y la cabina ya está ahí: abre 2 s, espera 5 s abierta y cierra', 'Llaman y la cabina está en el otro piso: M1 la lleva y se detiene en el final de carrera', 'Al llegar: abre, espera 5 s y cierra', 'Los botones de la cabina hacen lo mismo hacia el otro piso', 'Paro de emergencia: M1 se detiene y M2 cierra las puertas por seguridad'] });
    sl.push({ k: 'list', h: 'El plan: 12 renglones en 5 bloques', items: ['1 · Seguridad: el paro (CRPE)', '2 y 3 · Memorias: ¿a qué piso quieren ir? (CR1 y CR2)', '4 · Llegada al piso pedido (CRP)', '5 y 6 · Motor 1: bajar y subir', '7 a 12 · Puertas: abrir, esperar y cerrar, y cierre por paro'] });
    R.forEach((r, i) => { const n = i + 1;
      sl.push({ k: 'html', h: 'Renglón ' + n + ' de 12 · ' + r[0] + ': ' + r[1], html: '<div class="el-rg"><div class="el-izq">' + lad(n) + '<ul class="el-pts">' + r[2].map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div><div class="el-der">' + lad(n, 'mini') + '</div></div>' });
      if (Q[n]) sl.push({ k: 'q', h: 'Pregunta al grupo', q: Q[n][0], a: Q[n][1] }); });
    sl.push({ k: 'list', h: 'La secuencia completa: está en el piso 1 y presionan B2', items: ['B2 → CR2 se enclava (renglón 3)', 'S2 NC deja pasar → KM1S: sube (6)', 'Pisa S2: KM1S se apaga y CRP se energiza (4 y 6)', 'CRP → TA y KM2A: abre 2 s (7 y 8)', 'TA termina → TE: 5 s abiertas (9)', 'TE termina → KM2C cierra y TC cuenta 2 s (10 y 11)', 'TC termina → su NC borra CR2: reposo'] });
    sl.push({ k: 'list', h: 'De tarea', items: ['¿Por qué S1 es NA en el renglón 4 y NC en el 5?', '¿Qué pasa sin el NC de KM1S en el 5 o el de KM2C en el 8?', '¿Por qué el paro es NC y por qué necesitamos CRPE?', 'Piso 2 y presionan B1: escribe en orden qué bobinas se energizan y se apagan', 'Reto: que recuerde una llamada mientras viaja'] });
    sl.push({ k: 'cover', sub: 'Escuadra → Clases → 🛗 Elevador', h: '¡Pruébalo en el simulador!', p: 'Toca los botones y mira por dónde pasa la corriente' });
    return sl;
  };
  A['elev-proj'] = () => { if (!DT()) { u.toast('Falta cargar el diagrama; actualiza la app', 'err'); return; } E.proj.abrir({ id: 'elevador', titulo: 'Elevador de 2 pisos · Diagrama escalera' }, EL.slides()); };
  EL.botones = () => '<div class="row gap wrap mt">' + H.btn('📽 Proyectar renglón por renglón', 'elev-proj', '', 'small primary') + '<a class="btn small" href="' + EL.URL + '" target="_blank" rel="noopener">🎮 Simulador</a><a class="btn small ghost" href="' + EL.URL + '#imprimir" target="_blank" rel="noopener">🖨 Hoja para la tarea (PDF)</a></div>';
  EL.enClase = it => !!it && /escalera|mando eléctrico|relevador|electro/i.test(JSON.stringify([it.id, it.t, it.pasos || [], it.ideas || [], it.tema || '']));
  EL.claseHTML = () => '<div class="el-cl"><b>🛗 Elevador de 2 pisos en diagrama escalera</b><p class="small muted">Para explicarlo entre todos: repaso de lo de ayer, la maqueta, los 12 renglones uno por uno con preguntas al grupo y la tarea.</p>' + EL.botones() + '</div>';
  // idea en el banco de ideas
  if (Array.isArray(E.IDEAS) && !E.IDEAS.some(x => x.id === 'elevador-escalera')) E.IDEAS.push({ id: 'elevador-escalera', titulo: 'Elevador de 2 pisos: diagrama escalera renglón por renglón', sm: ['II-3'], tipo: 'Práctica', dur: '50 a 100 min', costo: '$0',
    obj: 'Leer y explicar un diagrama de escalera real con memorias, finales de carrera, enclavamientos, temporizadores y paro de emergencia.',
    mat: ['Proyector', 'Libreta', 'Hoja para la tarea (PDF)'],
    pasos: ['Repaso rápido: contactos a la izquierda, carga a la derecha, NA/NC, autorretención y paro NC.', 'Presenta la maqueta y cómo debe funcionar.', 'Proyecta los 12 renglones uno por uno: el grupo dice qué hace cada contacto antes de que lo expliques.', 'Contesten en voz alta las 4 preguntas al grupo.', 'Prueben los escenarios en el simulador y dejen la tarea.'],
    evid: 'Tarea con las preguntas del diagrama del elevador', tip: 'Pide que copien cada renglón en su libreta mientras lo explicas: al final tienen el diagrama completo.' });
  // Inicio: el día de la clase
  if (V.inicio) { const vi = V.inicio; V.inicio = function () { const o = vi.apply(null, arguments); if (!o || !o.h || u.today() !== EL.FECHA) return o; o.h = card('<h3>🛗 Hoy: el elevador en diagrama escalera</h3><p class="small">Para la clase de las 10:30: proyecta los 12 renglones uno por uno, con preguntas al grupo.</p>' + EL.botones()) + o.h; return o; }; }
})();
