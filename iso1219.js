/* Escuadra · Símbolos neumáticos ISO 1219-1 dibujados en SVG (v1.36.0). Los usa el memorama (memorama.html, en el celular
   o en el proyector) y la app (fichas y cartas para imprimir). Archivo independiente: no depende de Escuadra.
   Cada símbolo: { id, cat, n (nombre), f (función o uso), svg }. Las categorías: val (válvulas y vías), acc (accionamientos),
   cil (cilindros y alimentación), aux (válvulas auxiliares). Nivel 3: válvulas completas (con su mando y su retorno). */
(function () {
  'use strict';
  const r1 = n => Math.round(n * 10) / 10;
  const L = (x1, y1, x2, y2, x) => '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '"' + (x || '') + '/>';
  const PL = (pts, x) => '<polyline points="' + pts.map(p => r1(p[0]) + ',' + r1(p[1])).join(' ') + '"' + (x || '') + '/>';
  const PG = (pts, x) => '<polygon points="' + pts.map(p => r1(p[0]) + ',' + r1(p[1])).join(' ') + '"' + (x || '') + '/>';
  const C = (cx, cy, r, x) => '<circle cx="' + r1(cx) + '" cy="' + r1(cy) + '" r="' + r1(r) + '"' + (x || '') + '/>';
  const R = (x, y, w, h, z) => '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '"' + (z || '') + '/>';
  const T = (x, y, t) => '<text x="' + r1(x) + '" y="' + r1(y) + '" stroke="none" fill="currentColor">' + t + '</text>';
  const DASH = ' stroke-dasharray="4 3"', DOT = ' stroke-dasharray="9 3 2 3"', FILL = ' fill="currentColor"';
  const svg = (w, h, body) => '<svg class="iso" viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" font-family="Arial,sans-serif" font-size="8">' + body + '</svg>';
  // punta de flecha en (x2,y2) viniendo desde (x1,y1)
  const punta = (x1, y1, x2, y2, s) => { s = s || 5; const a = Math.atan2(y2 - y1, x2 - x1), b = 0.45; return PG([[x2, y2], [x2 - s * Math.cos(a - b), y2 - s * Math.sin(a - b)], [x2 - s * Math.cos(a + b), y2 - s * Math.sin(a + b)]], FILL); };
  const flecha = (x1, y1, x2, y2, s) => L(x1, y1, x2, y2) + punta(x1, y1, x2, y2, s);
  const resorte = (x1, y, x2, h, n) => { n = n || 6; const pts = [[x1, y]], d = (x2 - x1) / n; for (let i = 1; i < n; i++) pts.push([x1 + d * i, y + (i % 2 ? -h : h)]); pts.push([x2, y]); return PL(pts); };
  const triEsc = (x, y) => PG([[x - 5, y], [x + 5, y], [x, y + 8]]); // escape (triángulo abierto hacia afuera)

  /* ---------- válvulas de vías: cuadros, vías por cuadro, mandos ---------- */
  const S = 30; // lado de cada cuadro
  // posición de cada vía en el cuadro (fracción del ancho) y si está arriba (t) o abajo (b)
  const VIAS = {
    v22: { 1: [0.5, 'b'], 2: [0.5, 't'] },
    v32: { 1: [0.3, 'b'], 3: [0.7, 'b'], 2: [0.3, 't'] },
    v42: { 1: [0.3, 'b'], 3: [0.7, 'b'], 2: [0.3, 't'], 4: [0.7, 't'] },
    v52: { 5: [0.18, 'b'], 1: [0.5, 'b'], 3: [0.82, 'b'], 4: [0.3, 't'], 2: [0.7, 't'] }
  };
  // cuadro: lista de ['a', de, a] (paso con flecha) o ['x', vía] (vía bloqueada)
  const CUADROS = {
    '22nc': ['v22', [[['a', 1, 2]], [['x', 1], ['x', 2]]], 1],
    '32nc': ['v32', [[['a', 1, 2], ['x', 3]], [['a', 2, 3], ['x', 1]]], 1],
    '32na': ['v32', [[['a', 2, 3], ['x', 1]], [['a', 1, 2], ['x', 3]]], 1],
    '42': ['v42', [[['a', 1, 4], ['a', 2, 3]], [['a', 1, 2], ['a', 4, 3]]], 1],
    '52': ['v52', [[['a', 1, 4], ['a', 2, 3], ['x', 5]], [['a', 1, 2], ['a', 4, 5], ['x', 3]]], 1],
    '53cc': ['v52', [[['a', 1, 4], ['a', 2, 3], ['x', 5]], [['x', 4], ['x', 2], ['x', 5], ['x', 1], ['x', 3]], [['a', 1, 2], ['a', 4, 5], ['x', 3]]], 1],
    '53ce': ['v52', [[['a', 1, 4], ['a', 2, 3], ['x', 5]], [['a', 4, 5], ['a', 2, 3], ['x', 1]], [['a', 1, 2], ['a', 4, 5], ['x', 3]]], 1],
    '53cp': ['v52', [[['a', 1, 4], ['a', 2, 3], ['x', 5]], [['a', 1, 4], ['a', 1, 2], ['x', 5], ['x', 3]], [['a', 1, 2], ['a', 4, 5], ['x', 3]]], 1]
  };
  const ESCAPES = { 3: 1, 5: 1 };
  // mando dibujado hacia afuera desde el borde del cuerpo (x, y); dir -1 = a la izquierda, +1 = a la derecha
  const MANDO = {
    muelle: (x, y, d) => resorte(x, y, x + d * 22, 5, 6),
    manual: (x, y, d) => L(x, y, x + d * 14, y) + L(x + d * 14, y - 7, x + d * 14, y + 7),
    pulsador: (x, y, d) => L(x, y, x + d * 12, y) + '<path d="M' + r1(x + d * 12) + ' ' + (y - 7) + ' A 7 7 0 0 ' + (d < 0 ? 0 : 1) + ' ' + r1(x + d * 12) + ' ' + (y + 7) + '"/>',
    palanca: (x, y, d) => L(x, y, x + d * 12, y) + L(x + d * 12, y, x + d * 20, y - 12) + C(x + d * 21, y - 13.5, 2),
    pedal: (x, y, d) => L(x, y, x + d * 10, y) + L(x + d * 10, y + 8, x + d * 22, y - 8) + L(x + d * 22, y - 8, x + d * 26, y - 8),
    rodillo: (x, y, d) => L(x, y, x + d * 12, y) + C(x + d * 18, y, 6),
    solenoide: (x, y, d) => R(d < 0 ? x - 12 : x, y - 8, 12, 16) + L(d < 0 ? x - 12 : x, y + 8, d < 0 ? x : x + 12, y - 8),
    neumatico: (x, y, d) => L(x + d * 8, y, x + d * 24, y, DASH) + PG([[x + d * 1, y], [x + d * 8, y - 4.5], [x + d * 8, y + 4.5]]),
    enclavamiento: (x, y, d) => L(x, y, x + d * 14, y) + L(x + d * 14, y - 7, x + d * 14, y + 7) + PL([[x + d * 3, y - 6], [x + d * 5, y - 10], [x + d * 7, y - 6], [x + d * 9, y - 10], [x + d * 11, y - 6]]) + L(x + d * 7, y - 6, x + d * 7, y)
  };
  const ANCHO_MANDO = { muelle: 24, manual: 16, pulsador: 21, palanca: 24, pedal: 28, rodillo: 26, solenoide: 14, neumatico: 26, enclavamiento: 16 };
  const valvula = (tipo, izq, der) => {
    const def = CUADROS[tipo], V = VIAS[def[0]], cs = def[1], rep = cs.length === 3 ? 1 : def[2], n = cs.length;
    const mi = (izq || []).reduce((s, k) => Math.max(s, ANCHO_MANDO[k] || 16), 0), md = (der || []).reduce((s, k) => Math.max(s, ANCHO_MANDO[k] || 16), 0);
    const x0 = 6 + mi, y0 = 16, W = x0 + n * S + md + 6, H = y0 + S + 18;
    let b = '';
    cs.forEach((q, i) => {
      const cx = x0 + i * S; b += R(cx, y0, S, S);
      const pt = v => [cx + V[v][0] * S, V[v][1] === 't' ? y0 : y0 + S];
      q.forEach(it => {
        if (it[0] === 'a') { const a = pt(it[1]), z = pt(it[2]), ya = a[1] === y0 ? y0 + 3 : y0 + S - 3, yz = z[1] === y0 ? y0 + 3 : y0 + S - 3; b += flecha(a[0], ya, z[0], yz, 4.5); }
        else { const p = pt(it[1]); if (p[1] === y0) b += L(p[0], y0, p[0], y0 + 7) + L(p[0] - 4, y0 + 7, p[0] + 4, y0 + 7); else b += L(p[0], y0 + S, p[0], y0 + S - 7) + L(p[0] - 4, y0 + S - 7, p[0] + 4, y0 + S - 7); }
      });
    });
    // vías externas solo en el cuadro de reposo, con su número
    const rx = x0 + rep * S;
    Object.keys(V).forEach(v => { const x = rx + V[v][0] * S;
      if (V[v][1] === 't') b += L(x, y0, x, y0 - 8) + T(x + 2.5, y0 - 9, v);
      else { b += L(x, y0 + S, x, y0 + S + 7) + T(x - 6.5, y0 + S + 7.5, v); if (ESCAPES[v]) b += triEsc(x, y0 + S + 7); } });
    const ym = y0 + S / 2;
    (izq || []).forEach((k, i) => { b += MANDO[k](x0, ym + (izq.length > 1 ? (i ? 7 : -7) : 0), -1); });
    (der || []).forEach((k, i) => { b += MANDO[k](x0 + n * S, ym + (der.length > 1 ? (i ? 7 : -7) : 0), 1); });
    return svg(W, H + 6, b);
  };
  const mandoSolo = k => { const x = 46, y = 30; return svg(78, 60, R(x, y - 15, 26, 30, ' stroke-dasharray="3 3" opacity=".45"') + MANDO[k](x, y, -1)); };

  /* ---------- cilindros, alimentación y auxiliares ---------- */
  const cilindro = simple => { let b = R(10, 16, 74, 28) + L(38, 16, 38, 44) + R(38, 27, 74, 6) + L(14, 44, 14, 54);
    if (simple) b += resorte(41, 21.5, 82, 3.5, 8); else b += L(80, 44, 80, 54);
    return svg(118, 60, b); };
  const SIMB = {
    compresor: svg(80, 76, C(40, 46, 18) + PG([[33, 40], [47, 40], [40, 29]]) + L(40, 28, 40, 8) + L(40, 64, 40, 72)),
    deposito: svg(110, 70, R(14, 24, 82, 30, ' rx="15"') + L(55, 24, 55, 8)),
    manometro: svg(70, 76, C(35, 32, 17) + flecha(24, 44, 46, 20, 6) + L(35, 49, 35, 70)),
    filtro: svg(110, 70, PG([[55, 15], [77, 37], [55, 59], [33, 37]]) + L(55, 18, 55, 56, DASH) + L(8, 37, 33, 37) + L(77, 37, 102, 37)),
    regulador: svg(116, 84, R(40, 30, 32, 32) + flecha(46, 50, 66, 50, 5) + L(8, 46, 40, 46) + L(72, 46, 108, 46) +
      PL([[56, 30], [51, 26], [61, 22], [51, 18], [61, 14], [56, 10]]) + flecha(46, 26, 68, 10, 5) + PL([[90, 46], [90, 74], [56, 74], [56, 62]], DASH)),
    lubricador: svg(110, 70, PG([[55, 15], [77, 37], [55, 59], [33, 37]]) + L(55, 22, 55, 44) + PG([[52, 48], [58, 48], [55, 53]], FILL) + L(8, 37, 33, 37) + L(77, 37, 102, 37)),
    unidad: svg(160, 84, R(28, 12, 106, 62, DOT) + L(4, 50, 28, 50) + L(134, 50, 156, 50) +
      PG([[48, 36], [62, 50], [48, 64], [34, 50]]) + L(48, 39, 48, 61, DASH) + L(62, 50, 70, 50) +
      R(70, 38, 24, 24) + flecha(74, 54, 90, 54, 4) + PL([[82, 38], [78, 35], [86, 32], [78, 29], [86, 26], [82, 23]]) + C(82, 18, 5) + L(94, 50, 100, 50) +
      PG([[114, 36], [128, 50], [114, 64], [100, 50]]) + L(114, 42, 114, 56)),
    escape: svg(60, 64, L(30, 8, 30, 30) + PG([[22, 30], [38, 30], [30, 44]])),
    silenciador: svg(60, 64, L(30, 8, 30, 26) + R(18, 26, 24, 18) + L(24, 30, 24, 40) + L(30, 30, 30, 40) + L(36, 30, 36, 40)),
    antirretorno: svg(110, 60, L(8, 30, 48, 30) + L(70, 30, 102, 30) + PL([[64, 18], [52, 30], [64, 42]]) + C(64, 30, 7) + L(64, 30, 70, 30)),
    estrangulador: svg(110, 70, L(8, 37, 46, 37) + L(74, 37, 102, 37) + '<path d="M46 27 Q60 37 74 27"/><path d="M46 47 Q60 37 74 47"/>' + flecha(42, 58, 78, 16, 6)),
    estrangAnti: svg(130, 90, R(26, 8, 78, 74, DOT) + L(6, 45, 36, 45) + L(94, 45, 124, 45) + L(36, 24, 36, 66) + L(94, 24, 94, 66) +
      L(36, 24, 52, 24) + L(78, 24, 94, 24) + '<path d="M52 16 Q65 24 78 16"/><path d="M52 32 Q65 24 78 32"/>' + flecha(50, 38, 80, 8, 5) +
      L(36, 66, 58, 66) + L(72, 66, 94, 66) + PL([[68, 57], [59, 66], [68, 75]]) + C(67, 66, 5)),
    or: svg(120, 70, R(34, 30, 52, 22) + L(8, 41, 34, 41) + L(86, 41, 112, 41) + L(60, 30, 60, 8) + C(60, 41, 6) + PL([[40, 33], [46, 41], [40, 49]]) + PL([[80, 33], [74, 41], [80, 49]]) + T(10, 36, '1') + T(104, 36, '1') + T(63, 14, '2')),
    and: svg(120, 70, R(34, 30, 52, 22) + L(8, 41, 34, 41) + L(86, 41, 112, 41) + L(60, 30, 60, 8) + R(39, 35, 10, 12) + R(71, 35, 10, 12) + L(49, 41, 71, 41) + L(57, 35, 63, 35) + T(10, 36, '1') + T(104, 36, '1') + T(63, 14, '2')),
    escRapido: svg(120, 80, R(36, 22, 48, 30) + L(8, 37, 36, 37) + L(84, 37, 112, 37) + PL([[54, 27], [62, 37], [54, 47]]) + C(66, 37, 6) + L(60, 52, 60, 62) + PG([[52, 62], [68, 62], [60, 74]]) + T(10, 32, '1') + T(104, 32, '2') + T(64, 60, '3'))
  };

  /* ---------- catálogo ---------- */
  const CAT = { val: 'Válvulas y vías', acc: 'Accionamientos', cil: 'Cilindros y alimentación', aux: 'Válvulas auxiliares' };
  const L1 = [
    ['v22', 'val', 'Válvula 2/2 normalmente cerrada', 'Abre o cierra el paso del aire. En reposo no deja pasar.', () => valvula('22nc', ['manual'], ['muelle'])],
    ['v32nc', 'val', 'Válvula 3/2 normalmente cerrada', 'Manda aire a una salida y luego la descarga al escape. En reposo no deja pasar: mueve un cilindro de simple efecto.', () => valvula('32nc', ['manual'], ['muelle'])],
    ['v32na', 'val', 'Válvula 3/2 normalmente abierta', 'En reposo deja pasar aire a la salida; al accionarla, la salida se va a escape.', () => valvula('32na', ['manual'], ['muelle'])],
    ['v42', 'val', 'Válvula 4/2', 'Alterna el aire entre dos salidas con un solo escape: mueve un cilindro de doble efecto.', () => valvula('42', ['manual'], ['muelle'])],
    ['v52', 'val', 'Válvula 5/2', 'Alterna el aire entre dos salidas y cada una tiene su escape: mueve un cilindro de doble efecto.', () => valvula('52', ['manual'], ['muelle'])],
    ['v53cc', 'val', 'Válvula 5/3 de centro cerrado', 'En el centro todas las vías quedan bloqueadas: puede detener el cilindro a la mitad.', () => valvula('53cc', ['manual', 'muelle'], ['manual', 'muelle'])],
    ['v53ce', 'val', 'Válvula 5/3 de centro a escape', 'En el centro las dos salidas van a escape: el cilindro queda libre, sin presión.', () => valvula('53ce', ['manual', 'muelle'], ['manual', 'muelle'])],
    ['v53cp', 'val', 'Válvula 5/3 de centro a presión', 'En el centro manda presión a las dos salidas al mismo tiempo.', () => valvula('53cp', ['manual', 'muelle'], ['manual', 'muelle'])],
    ['a-manual', 'acc', 'Accionamiento manual (general)', 'La válvula se acciona con la mano, sin decir de qué forma.', () => mandoSolo('manual')],
    ['a-pulsador', 'acc', 'Pulsador', 'Se acciona al presionar un botón con el dedo.', () => mandoSolo('pulsador')],
    ['a-palanca', 'acc', 'Palanca', 'Se acciona moviendo una palanca con la mano.', () => mandoSolo('palanca')],
    ['a-pedal', 'acc', 'Pedal', 'Se acciona con el pie.', () => mandoSolo('pedal')],
    ['a-rodillo', 'acc', 'Rodillo', 'La acciona una pieza o una leva al pasar: se usa como final de carrera.', () => mandoSolo('rodillo')],
    ['a-muelle', 'acc', 'Muelle (resorte)', 'Regresa la válvula a su posición de reposo cuando dejas de accionarla.', () => mandoSolo('muelle')],
    ['a-solenoide', 'acc', 'Solenoide (electroimán)', 'Una bobina eléctrica cambia la válvula con una señal eléctrica: electroválvula.', () => mandoSolo('solenoide')],
    ['a-neumatico', 'acc', 'Pilotaje neumático', 'La válvula cambia con una señal de aire a presión.', () => mandoSolo('neumatico')],
    ['a-enclav', 'acc', 'Enclavamiento (retención)', 'Mantiene la posición aunque sueltes el mando, hasta que la regreses.', () => mandoSolo('enclavamiento')],
    ['c-simple', 'cil', 'Cilindro de simple efecto', 'Avanza con aire y regresa con su muelle: usa una sola entrada de aire.', () => cilindro(true)],
    ['c-doble', 'cil', 'Cilindro de doble efecto', 'Avanza y regresa con aire: tiene dos entradas.', () => cilindro(false)],
    ['c-compresor', 'cil', 'Compresor', 'Toma aire del ambiente y lo comprime: es la fuente de energía de la neumática.', () => SIMB.compresor],
    ['c-deposito', 'cil', 'Depósito (acumulador)', 'Guarda aire comprimido y evita que la presión suba y baje de golpe.', () => SIMB.deposito],
    ['c-unidad', 'cil', 'Unidad de mantenimiento (FRL)', 'Filtra, regula y lubrica el aire antes de que llegue a las válvulas y cilindros.', () => SIMB.unidad],
    ['c-filtro', 'cil', 'Filtro', 'Quita polvo, agua y suciedad del aire comprimido.', () => SIMB.filtro],
    ['c-regulador', 'cil', 'Regulador de presión', 'Mantiene constante la presión de salida aunque cambie la de entrada.', () => SIMB.regulador],
    ['c-lubricador', 'cil', 'Lubricador', 'Agrega gotitas de aceite al aire para lubricar las piezas que se mueven.', () => SIMB.lubricador],
    ['c-manometro', 'cil', 'Manómetro', 'Mide y muestra la presión del aire.', () => SIMB.manometro],
    ['c-escape', 'cil', 'Escape', 'Salida del aire al ambiente.', () => SIMB.escape],
    ['c-silenciador', 'cil', 'Silenciador', 'Baja el ruido del aire que sale por el escape.', () => SIMB.silenciador],
    ['x-anti', 'aux', 'Válvula antirretorno', 'Deja pasar el aire en un solo sentido.', () => SIMB.antirretorno],
    ['x-estr', 'aux', 'Válvula estranguladora (regulable)', 'Reduce el caudal de aire en los dos sentidos para controlar la velocidad.', () => SIMB.estrangulador],
    ['x-estranti', 'aux', 'Estranguladora con antirretorno', 'Regula la velocidad en un sentido y en el otro deja pasar libre: así se ajusta la velocidad de un cilindro.', () => SIMB.estrangAnti],
    ['x-or', 'aux', 'Válvula selectora (función O)', 'Da salida si llega aire por una entrada O por la otra.', () => SIMB.or],
    ['x-and', 'aux', 'Válvula de simultaneidad (función Y)', 'Da salida solo si llega aire por las dos entradas al mismo tiempo.', () => SIMB.and],
    ['x-escr', 'aux', 'Válvula de escape rápido', 'Descarga el aire directo al escape para que el cilindro regrese más rápido.', () => SIMB.escRapido]
  ];
  // nivel 3: válvulas completas (vías y posiciones + mando + retorno)
  const L3 = [
    ['k1', '3/2 NC, pulsador y retorno por muelle', 'Al presionar el botón pasa aire de 1 a 2; al soltar, el muelle la regresa y 2 se va a escape por 3.', () => valvula('32nc', ['pulsador'], ['muelle'])],
    ['k2', '3/2 NC, rodillo y retorno por muelle', 'Final de carrera: cuando el cilindro empuja el rodillo, manda una señal de aire.', () => valvula('32nc', ['rodillo'], ['muelle'])],
    ['k3', '3/2 NA, pulsador y retorno por muelle', 'Deja pasar aire hasta que presionas el botón (sirve como paro).', () => valvula('32na', ['pulsador'], ['muelle'])],
    ['k4', '5/2, solenoide y retorno por muelle (monoestable)', 'Electroválvula: con señal eléctrica cambia; sin señal, el muelle la regresa.', () => valvula('52', ['solenoide'], ['muelle'])],
    ['k5', '5/2, pilotaje neumático por los dos lados (biestable)', 'Cambia con una señal de aire y se queda así hasta que llega la señal del otro lado: tiene memoria.', () => valvula('52', ['neumatico'], ['neumatico'])],
    ['k6', '5/2, solenoide por los dos lados (biestable)', 'Electroválvula con memoria: se queda en la última posición que le mandaste.', () => valvula('52', ['solenoide'], ['solenoide'])],
    ['k7', '4/2, palanca con enclavamiento', 'Se cambia a mano y se queda en esa posición hasta que la regresas.', () => valvula('42', ['palanca', 'enclavamiento'], ['enclavamiento'])],
    ['k8', '2/2 NC, pedal y retorno por muelle', 'Deja pasar aire mientras pisas el pedal.', () => valvula('22nc', ['pedal'], ['muelle'])],
    ['k9', '5/3 de centro cerrado, solenoides y centrada por muelles', 'Con un solenoide avanza, con el otro regresa; sin señal se centra y bloquea el cilindro.', () => valvula('53cc', ['solenoide', 'muelle'], ['solenoide', 'muelle'])],
    ['k10', '3/2 NC, pilotaje neumático y retorno por muelle', 'Cambia mientras llega una señal de aire de mando; sin señal regresa con el muelle.', () => valvula('32nc', ['neumatico'], ['muelle'])],
    ['k11', '5/2, palanca y retorno por muelle', 'Mientras sostienes la palanca el cilindro avanza; al soltar, regresa.', () => valvula('52', ['palanca'], ['muelle'])],
    ['k12', '3/2 NC, solenoide y retorno por muelle', 'Electroválvula 3/2: con señal eléctrica manda aire; sin señal, a escape.', () => valvula('32nc', ['solenoide'], ['muelle'])]
  ];
  const cache = {};
  const mk = (a, cat) => ({ id: a[0], cat: cat || a[1], n: cat ? a[1] : a[2], f: cat ? a[2] : a[3], get svg() { return cache[a[0]] || (cache[a[0]] = (cat ? a[3] : a[4])()); } });
  window.ISO1219 = { CAT: CAT, SIM: L1.map(a => mk(a)), COMPLETAS: L3.map(a => mk(a, 'comp')), valvula: valvula };
})();
