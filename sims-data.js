/* Escuadra · Simuladores de diagrama escalera (v1.48.0). Lo comparten sim.html (el simulador interactivo) y la app (hoja de
   práctica y lista de material). Contactos: 'X' = normalmente abierto (conduce si X está activo), '/X' = normalmente cerrado
   (conduce si X NO está activo). Ramas: ['s', …] en serie, ['p', …] en paralelo. Temporizadores a la conexión (TON):
   la bobina T1 cuenta mientras está energizada y su contacto T1 se cierra al llegar al tiempo. Como en el elevador, sigue lo
   visto en «Electroneumática: mando eléctrico» y «Diagrama de escalera». */
(function () {
  'use strict';
  const SIMS = {};
  SIMS.LIST = [
    { id: 'arranque', ico: '⚙️', t: 'Arranque y paro de un motor', sub: 'Autorretención con paro y protección térmica',
      obj: 'Armar y explicar el circuito de arranque y paro con autorretención, paro de emergencia NC y relevador térmico.',
      vars: { S0: ['Botón de paro', 'NC', 'boton'], S1: ['Botón de arranque', 'NA', 'boton'], F1: ['Relevador térmico (sobrecarga)', 'NC', 'falla'], K1: ['Contactor del motor', 'bobina', 'contactor'], H1: ['Luz piloto: motor encendido', 'luz', 'luz'] },
      rungs: [{ out: 'K1', ex: ['s', '/S0', '/F1', ['p', 'S1', 'K1']] }, { out: 'H1', ex: 'K1' }],
      mat: [['Motor monofásico pequeño o ventilador de 24 V (o simúlalo con una luz)', 1]],
      pasos: ['Identifica en el diagrama cada botón, el térmico, la bobina del contactor y la luz.', 'Arma el renglón 1: paro NC, térmico NC y arranque NA en serie; pon el contacto K1 en paralelo con el arranque.', 'Arma el renglón 2: contacto K1 y la luz piloto H1.', 'Revisa con tu profe antes de energizar.', 'Prueba: arranca, suelta el botón (debe seguir encendido), para; luego simula la sobrecarga.'],
      preguntas: ['¿Por qué el motor sigue encendido al soltar el botón de arranque?', '¿Por qué el botón de paro es normalmente cerrado y no abierto?', '¿Qué pasa si se dispara el térmico? ¿Vuelve a arrancar solo al rearmarlo?', '¿Dónde se usa este circuito en una fábrica?'],
      criterios: ['Identifica NA, NC y la autorretención', 'Arma el circuito según el diagrama', 'Prueba arranque, paro y sobrecarga con seguridad', 'Explica la función de cada elemento'] },
    { id: 'semaforo', ico: '🚦', t: 'Semáforo con temporizadores', sub: 'Secuencia rojo → verde → amarillo que se repite',
      obj: 'Usar temporizadores a la conexión (TON) en cascada para hacer una secuencia que se repite sola.',
      vars: { S0: ['Botón de paro', 'NC', 'boton'], S1: ['Botón de arranque', 'NA', 'boton'], K0: ['Relevador de marcha', 'bobina', 'relevador'], T1: ['Temporizador del rojo', 'ton', 'timer', 5], T2: ['Temporizador del verde', 'ton', 'timer', 4], T3: ['Temporizador del amarillo', 'ton', 'timer', 2], H1: ['Luz roja', 'luz', 'luz', 'red'], H2: ['Luz verde', 'luz', 'luz', 'green'], H3: ['Luz amarilla', 'luz', 'luz', 'amber'] },
      rungs: [{ out: 'K0', ex: ['s', '/S0', ['p', 'S1', 'K0']] }, { out: 'T1', ex: ['s', 'K0', '/T3'] }, { out: 'T2', ex: 'T1' }, { out: 'T3', ex: 'T2' }, { out: 'H1', ex: ['s', 'K0', '/T1'] }, { out: 'H2', ex: ['s', 'T1', '/T2'] }, { out: 'H3', ex: ['s', 'T2', '/T3'] }],
      mat: [],
      pasos: ['Lee el diagrama renglón por renglón: marcha con autorretención y tres temporizadores en cascada.', 'Observa: cuando T3 termina, abre su contacto en el renglón de T1 y todo se reinicia.', 'Arma primero la marcha y la luz roja; prueba.', 'Agrega T1 y la luz verde; prueba. Luego T2 y T3 con la amarilla.', 'Cambia los tiempos y comprueba que la secuencia se respeta.'],
      preguntas: ['¿Qué hace el contacto /T3 en el renglón de T1?', '¿Por qué la luz roja usa el contacto NC de T1?', 'Si quisieras el verde más largo, ¿qué cambias?', '¿Qué otras secuencias de una fábrica se hacen con temporizadores?'],
      criterios: ['Explica el temporizador a la conexión', 'La secuencia cumple los tiempos', 'Se repite sola y para con el botón de paro', 'Documenta los tiempos usados'] },
    { id: 'banda', ico: '📦', t: 'Banda transportadora con sensor', sub: 'Se detiene sola cuando la pieza llega al final',
      obj: 'Usar un sensor (o final de carrera) NC en serie para detener una banda cuando la pieza llega al final.',
      vars: { S0: ['Botón de paro', 'NC', 'boton'], S1: ['Botón de arranque', 'NA', 'boton'], B1: ['Sensor de pieza al final de la banda', 'NA', 'sensor'], K1: ['Contactor del motor de la banda', 'bobina', 'contactor'], H1: ['Luz: pieza lista para recoger', 'luz', 'luz', 'amber'] },
      rungs: [{ out: 'K1', ex: ['s', '/S0', '/B1', ['p', 'S1', 'K1']] }, { out: 'H1', ex: 'B1' }],
      mat: [['Banda (motorreductor de 12–24 V con rodillos) o maqueta', 1]],
      pasos: ['Identifica el sensor B1 y por qué su contacto en el renglón 1 es NC.', 'Arma la marcha con autorretención igual que en arranque y paro.', 'Agrega el contacto NC del sensor en serie.', 'Prueba: pon una pieza, arranca y observa que la banda se detiene al llegar al sensor.', 'Retira la pieza: ¿arranca sola? Explica por qué no.'],
      preguntas: ['¿Por qué la banda no arranca sola al quitar la pieza?', '¿Qué tipo de sensor usarías para una pieza de metal? ¿Y de cartón?', '¿Cómo harías que la banda arranque sola al quitar la pieza?', '¿Qué riesgo hay en una banda real y cómo se protege a las personas?'],
      criterios: ['Coloca el sensor y su contacto correctos', 'La banda se detiene con la pieza al final', 'Explica por qué se pierde la autorretención', 'Trabaja con seguridad'] },
    { id: 'cilindro', ico: '🔩', t: 'Cilindro neumático A+ A−', sub: 'Electroválvula 5/2 y finales de carrera, ciclo único o continuo',
      obj: 'Controlar un cilindro de doble efecto con una electroválvula 5/2 monoestable y dos finales de carrera.',
      vars: { S3: ['Botón de marcha (un ciclo)', 'NA', 'boton'], S4: ['Selector de ciclo continuo', 'NA', 'selector'], S1: ['Final de carrera: cilindro adentro (a0)', 'NA', 'final'], S2: ['Final de carrera: cilindro afuera (a1)', 'NA', 'final'], K1: ['Relevador auxiliar de ciclo', 'bobina', 'relevador'], Y1: ['Bobina de la electroválvula 5/2 (A+)', 'valvula', 'valvula'] },
      rungs: [{ out: 'K1', ex: ['s', ['p', ['s', ['p', 'S3', 'S4'], 'S1'], 'K1'], '/S2'] }, { out: 'Y1', ex: 'K1' }],
      mat: [['Cilindro neumático de doble efecto', 1], ['Electroválvula 5/2 monoestable de 24 V DC', 1], ['Unidad de mantenimiento (filtro y regulador) y compresor', 1], ['Manguera de 4 o 6 mm y conectores rápidos', 1]],
      pasos: ['Identifica a0 (S1) y a1 (S2) en el cilindro y en el diagrama.', 'Arma el circuito neumático: compresor → unidad de mantenimiento → válvula 5/2 → cilindro.', 'Arma el renglón de K1 y el de la válvula.', 'Ajusta la presión a 3–4 bar, revisa con tu profe y prueba un ciclo.', 'Activa el selector: el cilindro debe ir y venir solo. Apaga el selector y comprueba que termina el ciclo.'],
      preguntas: ['¿Por qué el ciclo solo empieza si el cilindro está adentro (S1)?', '¿Qué hace el contacto /S2?', '¿Qué pasa si se va el aire a medio ciclo?', '¿Por qué la válvula es monoestable y qué cambiaría con una biestable?'],
      criterios: ['Arma el circuito neumático y el eléctrico', 'El ciclo A+ A− funciona', 'Usa los finales de carrera correctos', 'Ajusta la presión con seguridad'] },
    { id: 'prensa', ico: '🙌', t: 'Prensa hidráulica a dos manos', sub: 'Seguridad: baja solo con las dos manos y sube al soltar',
      obj: 'Aplicar el mando bimanual de seguridad: la prensa baja solo con los dos botones y sube si sueltas uno.',
      vars: { S1: ['Botón mano izquierda', 'NA', 'boton'], S2: ['Botón mano derecha', 'NA', 'boton'], B1: ['Final de carrera: prensa arriba', 'NA', 'final'], B2: ['Final de carrera: prensa abajo', 'NA', 'final'], K2: ['Relevador: ya prensó', 'bobina', 'relevador'], Y1: ['Electroválvula: bajar la prensa', 'valvula', 'valvula'], H1: ['Luz: pieza prensada', 'luz', 'luz', 'green'] },
      rungs: [{ out: 'K2', ex: ['s', ['p', 'B2', 'K2'], ['p', 'S1', 'S2']] }, { out: 'Y1', ex: ['s', 'S1', 'S2', '/K2'] }, { out: 'H1', ex: 'K2' }],
      mat: [['Cilindro hidráulico pequeño o jeringas con manguera (maqueta)', 1], ['Electroválvula (o simúlala con una luz)', 1]],
      pasos: ['Explica por qué una prensa no debe bajar con una sola mano.', 'Arma el renglón de Y1: los dos botones en serie y el NC de K2.', 'Arma el renglón de K2: se activa abajo (B2) y se queda mientras haya una mano en un botón.', 'Prueba: con una mano no baja; con las dos baja; al soltar una, sube.', 'Al llegar abajo sube sola y para volver a bajar hay que soltar las dos manos.'],
      preguntas: ['¿Por qué los dos botones van en serie?', '¿Qué evita el relevador K2?', '¿Cómo harías que además se tengan que presionar casi al mismo tiempo?', '¿Qué otras máquinas usan mando a dos manos?'],
      criterios: ['Explica el mando bimanual', 'No baja con una sola mano', 'Sube al soltar y al llegar abajo', 'Relaciona el circuito con la seguridad en el trabajo'] }
  ];
  SIMS.get = id => SIMS.LIST.find(s => s.id === id);
  // ---------- evaluación (un ciclo de barrido como en un PLC) ----------
  const lee = (ex, v) => { if (typeof ex === 'string') { const nc = ex[0] === '/', k = nc ? ex.slice(1) : ex; return nc ? !v[k] : !!v[k]; } return ex[0] === 's' ? ex.slice(1).every(x => lee(x, v)) : ex.slice(1).some(x => lee(x, v)); };
  SIMS.lee = lee;
  SIMS.paso = (s, v, dt) => { // v: estado de variables; v._t: acumulado de temporizadores
    v._t = v._t || {}; s.rungs.forEach(r => { const on = lee(r.ex, v), d = s.vars[r.out];
      if (d && d[1] === 'ton') { v._c = v._c || {}; v._c[r.out] = on; v._t[r.out] = on ? Math.min(d[3], (v._t[r.out] || 0) + dt) : 0; v[r.out] = on && v._t[r.out] >= d[3]; }
      else v[r.out] = on; }); return v; };
  // ---------- dibujo del diagrama escalera (SVG) ----------
  const CW = 78, RH = 58;
  const med = ex => { if (typeof ex === 'string') return { w: CW, h: 1 }; const ch = ex.slice(1).map(med); return ex[0] === 's' ? { w: ch.reduce((a, b) => a + b.w, 0), h: Math.max.apply(null, ch.map(c => c.h)) } : { w: Math.max.apply(null, ch.map(c => c.w)), h: ch.reduce((a, b) => a + b.h, 0) }; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const ON = '#16a34a', OFF = '#334155';
  SIMS.svg = (s, v, opt) => {
    v = v || {}; opt = opt || {}; const vivo = !!opt.vivo, ms = s.rungs.map(r => med(r.ex)), wE = Math.max.apply(null, ms.map(m => m.w)), X0 = 26, XC = X0 + 18 + wE + 40, W = XC + 185;
    let y = 16, out = '';
    const col = c => vivo ? (c ? ON : OFF) : OFF;
    const dib = (ex, x, y0, w) => { // dibuja ex en [x, x+w] con centro de su primer renglón en y0; devuelve svg
      if (typeof ex === 'string') { const nc = ex[0] === '/', k = nc ? ex.slice(1) : ex, c = lee(ex, v), cx = x + w / 2, k0 = col(c); let g = '<line x1="' + x + '" y1="' + y0 + '" x2="' + (cx - 9) + '" y2="' + y0 + '" stroke="' + OFF + '" stroke-width="2"/><line x1="' + (cx + 9) + '" y1="' + y0 + '" x2="' + (x + w) + '" y2="' + y0 + '" stroke="' + OFF + '" stroke-width="2"/>';
        g += '<line x1="' + (cx - 9) + '" y1="' + (y0 - 12) + '" x2="' + (cx - 9) + '" y2="' + (y0 + 12) + '" stroke="' + k0 + '" stroke-width="3"/><line x1="' + (cx + 9) + '" y1="' + (y0 - 12) + '" x2="' + (cx + 9) + '" y2="' + (y0 + 12) + '" stroke="' + k0 + '" stroke-width="3"/>' + (nc ? '<line x1="' + (cx - 13) + '" y1="' + (y0 + 12) + '" x2="' + (cx + 13) + '" y2="' + (y0 - 12) + '" stroke="' + k0 + '" stroke-width="2.5"/>' : '');
        if (vivo && c) g += '<rect x="' + (cx - 9) + '" y="' + (y0 - 12) + '" width="18" height="24" fill="' + ON + '" fill-opacity=".18"/>';
        return g + '<text x="' + cx + '" y="' + (y0 - 18) + '" text-anchor="middle" font-size="13" font-weight="700" fill="#0f172a">' + esc(k) + '</text><text x="' + cx + '" y="' + (y0 + 27) + '" text-anchor="middle" font-size="9" fill="#64748b">' + (nc ? 'NC' : 'NA') + '</text>'; }
      const ch = ex.slice(1), m = ch.map(med);
      if (ex[0] === 's') { let g = '', xx = x; const tot = m.reduce((a, b) => a + b.w, 0), extra = (w - tot) / ch.length; ch.forEach((c, i) => { const wi = m[i].w + extra; g += dib(c, xx, y0, wi); xx += wi; }); return g; }
      let g = '', yy = y0; const ys = []; ch.forEach((c, i) => { ys.push(yy); g += dib(c, x + 10, yy, w - 20) + '<line x1="' + x + '" y1="' + yy + '" x2="' + (x + 10) + '" y2="' + yy + '" stroke="' + OFF + '" stroke-width="2"/><line x1="' + (x + w - 10) + '" y1="' + yy + '" x2="' + (x + w) + '" y2="' + yy + '" stroke="' + OFF + '" stroke-width="2"/>'; yy += m[i].h * RH; });
      return g + '<line x1="' + x + '" y1="' + ys[0] + '" x2="' + x + '" y2="' + ys[ys.length - 1] + '" stroke="' + OFF + '" stroke-width="2"/><line x1="' + (x + w) + '" y1="' + ys[0] + '" x2="' + (x + w) + '" y2="' + ys[ys.length - 1] + '" stroke="' + OFF + '" stroke-width="2"/>'; };
    s.rungs.forEach((r, i) => { const yc = y + 26, d = s.vars[r.out] || [r.out, 'bobina'], on = vivo && (d[1] === 'ton' ? (v._c || {})[r.out] : v[r.out]);
      out += '<text x="4" y="' + (yc + 4) + '" font-size="10" fill="#94a3b8">' + (i + 1) + '</text>';
      out += '<line x1="' + X0 + '" y1="' + yc + '" x2="' + (X0 + 18) + '" y2="' + yc + '" stroke="' + OFF + '" stroke-width="2"/>' + dib(r.ex, X0 + 18, yc, wE) + '<line x1="' + (X0 + 18 + wE) + '" y1="' + yc + '" x2="' + (XC - 16) + '" y2="' + yc + '" stroke="' + OFF + '" stroke-width="2"/><line x1="' + (XC + 16) + '" y1="' + yc + '" x2="' + (W - 26) + '" y2="' + yc + '" stroke="' + OFF + '" stroke-width="2"/>';
      out += '<circle cx="' + XC + '" cy="' + yc + '" r="16" fill="' + (on ? ON : '#fff') + '" stroke="' + (on ? ON : OFF) + '" stroke-width="2.5"/><text x="' + XC + '" y="' + (yc + 4) + '" text-anchor="middle" font-size="11" font-weight="700" fill="' + (on ? '#fff' : '#0f172a') + '">' + esc(r.out) + '</text>' +
        '<text x="' + (XC + 22) + '" y="' + (yc - 6) + '" font-size="10" fill="#334155">' + esc(String(d[0]).length > 24 ? String(d[0]).slice(0, 23) + '…' : d[0]) + '</text>' + (d[1] === 'ton' ? '<text x="' + (XC + 22) + '" y="' + (yc + 16) + '" font-size="10" fill="#b45309">TON ' + d[3] + ' s' + (vivo && (v._t || {})[r.out] ? ' · ' + (v._t[r.out]).toFixed(1) : '') + '</text>' : '');
      y += med(r.ex).h * RH + 14; });
    return '<svg viewBox="0 0 ' + W + ' ' + (y + 6) + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagrama escalera: ' + esc(s.t) + '"><line x1="' + X0 + '" y1="8" x2="' + X0 + '" y2="' + y + '" stroke="#b91c1c" stroke-width="4"/><line x1="' + (W - 26) + '" y1="8" x2="' + (W - 26) + '" y2="' + y + '" stroke="#1d4ed8" stroke-width="4"/><text x="' + (X0 - 4) + '" y="8" font-size="10" fill="#b91c1c" text-anchor="end">+24 V</text><text x="' + (W - 22) + '" y="8" font-size="10" fill="#1d4ed8">0 V</text>' + out + '</svg>';
  };
  // ---------- lista de material sacada del diagrama ----------
  SIMS.material = s => {
    const usados = {}; const marca = ex => { if (typeof ex === 'string') { const k = ex.replace('/', ''); usados[k] = usados[k] || { na: 0, nc: 0 }; usados[k][ex[0] === '/' ? 'nc' : 'na']++; } else ex.slice(1).forEach(marca); };
    s.rungs.forEach(r => marca(r.ex)); const out = [], cuenta = {}, add = (t, n) => { cuenta[t] = (cuenta[t] || 0) + (n || 1); };
    Object.keys(s.vars).forEach(k => { const d = s.vars[k], c = d[2];
      if (c === 'boton') add(d[1] === 'NC' ? 'Botón pulsador NC (rojo)' : 'Botón pulsador NA (verde o negro)');
      else if (c === 'selector') add('Selector de 2 posiciones');
      else if (c === 'falla') add('Relevador térmico (o simúlalo con un interruptor NC)');
      else if (c === 'sensor') add('Sensor de proximidad o final de carrera NA de 24 V');
      else if (c === 'final') add('Final de carrera (microinterruptor con palanca)');
      else if (c === 'contactor') add('Contactor con bobina de 24 V' + ((usados[k] || {}).na ? ' y contacto auxiliar NA' : ''));
      else if (c === 'relevador') add('Relevador de 24 V con base (contactos: ' + ((usados[k] || {}).na || 0) + ' NA, ' + ((usados[k] || {}).nc || 0) + ' NC)');
      else if (c === 'timer') add('Temporizador a la conexión (TON) de 24 V, ajustado a ' + d[3] + ' s');
      else if (c === 'luz') add('Luz piloto de 24 V' + (d[3] === 'red' ? ' roja' : d[3] === 'green' ? ' verde' : d[3] === 'amber' ? ' ámbar' : ''));
      else if (c === 'valvula') add('Bobina de electroválvula de 24 V DC'); });
    Object.keys(cuenta).forEach(t => out.push([t, cuenta[t]]));
    (s.mat || []).forEach(m => out.push(m));
    out.push(['Fuente de 24 V DC', 1], ['Cable calibre 18–22 AWG (rojo para +24 V, azul para 0 V)', 1], ['Clemas o protoboard de tornillo', 1], ['Multímetro para revisar continuidad', 1]);
    return out;
  };
  window.SIMS = SIMS; if (window.E) window.E.sims = SIMS;
})();
