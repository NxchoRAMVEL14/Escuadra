/* Escuadra · Prácticas de FreeCAD para el centro de cómputo y ejercicios para proyectar.
   Cada práctica trae su plano acotado (dibujado aquí, funciona sin internet), pasos con el nombre de la herramienta,
   qué revisar, errores comunes, reto y entrega. Se proyecta, se imprime como hoja de práctica o se marca como hecha.
   Los nombres de herramientas son los de FreeCAD 1.0 en inglés (documentación oficial de FreeCAD); el glosario da el
   nombre en español. Ejercicios: preguntas del banco del tema, con opciones y respuesta que se revela en el proyector. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const PI = Math.PI, cos = Math.cos, sin = Math.sin, rad = g => g * PI / 180;

  /* =================== dibujo técnico en SVG (medidas en mm) =================== */
  let NID = 0;
  function dib(x0, y0, w, h, o) {
    o = o || {};
    const k = 560 / Math.max(w, h), W = Math.round(w * k), HH = Math.round(h * k), out = [], defs = [];
    const r = n => Math.round(n * 10) / 10, X = x => r((x - x0) * k), Y = y => r((y - y0) * k);
    const AL = 11, AW = 3.6, GAP = 4, OVER = 7, FS = o.fs || 17;
    const L = (x1, y1, x2, y2, c) => out.push('<line class="' + c + '" x1="' + r(x1) + '" y1="' + r(y1) + '" x2="' + r(x2) + '" y2="' + r(y2) + '"/>');
    const AR = (x, y, a) => { const bx = x - AL * cos(a), by = y - AL * sin(a), px = -sin(a) * AW, py = cos(a) * AW; out.push('<path class="ar" d="M' + r(x) + ' ' + r(y) + 'L' + r(bx + px) + ' ' + r(by + py) + 'L' + r(bx - px) + ' ' + r(by - py) + 'Z"/>'); };
    const T = (x, y, s, c, a, rot, fs) => out.push('<text class="' + (c || 'dt') + '" x="' + r(x) + '" y="' + r(y) + '"' + (a && a !== 'start' ? ' text-anchor="' + a + '"' : '') + (rot ? ' transform="rotate(' + rot + ' ' + r(x) + ' ' + r(y) + ')"' : '') + (fs ? ' font-size="' + fs + '"' : '') + '>' + esc(s) + '</text>');
    const pth = cs => cs.map(c => c[0] === 'A' ? 'A' + r(c[1] * k) + ' ' + r(c[1] * k) + ' 0 ' + c[2] + ' ' + c[3] + ' ' + X(c[4]) + ' ' + Y(c[5]) : c[0] === 'Z' ? 'Z' : c[0] + X(c[1]) + ' ' + Y(c[2])).join('');
    const fillA = f => f ? ' fill="' + f + '"' : '';
    const d = {
      k: k,
      hatch(ang) {
        const id = 'pfh' + (++NID);
        defs.push('<pattern id="' + id + '" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(' + (ang == null ? 45 : ang) + ')"><line class="hl" x1="0" y1="0" x2="0" y2="9"/></pattern>');
        return 'url(#' + id + ')';
      },
      path(cs, c, f) { out.push('<path class="' + (c || 'pz') + '"' + fillA(f) + ' d="' + pth(cs) + '"/>'); return d; },
      poly(pts, c, f, abierta) { out.push('<path class="' + (c || 'pz') + '"' + fillA(f) + ' d="' + pts.map((p, i) => (i ? 'L' : 'M') + X(p[0]) + ' ' + Y(p[1])).join('') + (abierta ? '' : 'Z') + '"/>'); return d; },
      rect(x, y, w, h, c, f) { out.push('<rect class="' + (c || 'pz') + '"' + fillA(f) + ' x="' + X(x) + '" y="' + Y(y) + '" width="' + r(w * k) + '" height="' + r(h * k) + '"/>'); return d; },
      circ(cx, cy, rr, c, f) { out.push('<circle class="' + (c || 'pz') + '"' + fillA(f) + ' cx="' + X(cx) + '" cy="' + Y(cy) + '" r="' + r(rr * k) + '"/>'); return d; },
      line(x1, y1, x2, y2, c) { L(X(x1), Y(y1), X(x2), Y(y2), c || 'ol'); return d; },
      // cruz de centro (líneas de trazo y punto)
      cl(cx, cy, e) { d.line(cx - e, cy, cx + e, cy, 'cl'); d.line(cx, cy - e, cx, cy + e, 'cl'); return d; },
      // arco con ángulos en grados (0 = derecha, positivo hacia arriba)
      arc(cx, cy, rr, a1, a2, c) {
        const p1 = [cx + rr * cos(rad(a1)), cy - rr * sin(rad(a1))], p2 = [cx + rr * cos(rad(a2)), cy - rr * sin(rad(a2))];
        return d.path([['M', p1[0], p1[1]], ['A', rr, (a2 - a1) > 180 ? 1 : 0, 0, p2[0], p2[1]]], c || 'dl');
      },
      // cota horizontal: x1, x2 = extremos; yo = de dónde salen las líneas de extensión; yd = altura de la línea de cota
      dimH(x1, x2, yo, yd, t, oo) {
        oo = oo || {}; const X1 = X(x1), X2 = X(x2), YD = Y(yd), s = yd < yo ? -1 : 1, g = oo.g == null ? GAP : oo.g;
        const ya = Y(oo.o1 == null ? yo : oo.o1), yb = Y(oo.o2 == null ? yo : oo.o2);
        L(X1, ya + s * g, X1, YD + s * OVER, 'dl'); L(X2, yb + s * g, X2, YD + s * OVER, 'dl');
        if (X2 - X1 >= 2.6 * AL + 4) { L(X1, YD, X2, YD, 'dl'); AR(X1, YD, PI); AR(X2, YD, 0); }
        else { L(X1 - 16, YD, X2 + 16, YD, 'dl'); AR(X1, YD, 0); AR(X2, YD, PI); }
        T((X1 + X2) / 2 + (oo.dx || 0), YD - 6, t, 'dt', 'middle');
        return d;
      },
      dimV(y1, y2, xo, xd, t, oo) {
        oo = oo || {}; const Y1 = Y(Math.min(y1, y2)), Y2 = Y(Math.max(y1, y2)), XD = X(xd), s = xd < xo ? -1 : 1, g = oo.g == null ? GAP : oo.g;
        const xa = X(oo.o1 == null ? xo : oo.o1), xb = X(oo.o2 == null ? xo : oo.o2);
        L(xa + s * g, Y1, XD + s * OVER, Y1, 'dl'); L(xb + s * g, Y2, XD + s * OVER, Y2, 'dl');
        if (Y2 - Y1 >= 2.6 * AL + 4) { L(XD, Y1, XD, Y2, 'dl'); AR(XD, Y1, -PI / 2); AR(XD, Y2, PI / 2); }
        else { L(XD, Y1 - 16, XD, Y2 + 16, 'dl'); AR(XD, Y1, PI / 2); AR(XD, Y2, -PI / 2); }
        if (oo.h) T(XD + s * 9, (Y1 + Y2) / 2 + 6, t, 'dt', s > 0 ? 'start' : 'end'); else T(XD - 6, (Y1 + Y2) / 2 + (oo.dy || 0), t, 'dt', 'middle', -90);
        return d;
      },
      // línea de referencia: la flecha toca (x1, y1) y el texto queda después de (x2, y2)
      lead(x1, y1, x2, y2, t, oo) {
        oo = oo || {}; const P1 = [X(x1), Y(y1)], P2 = [X(x2), Y(y2)], dir = oo.dir || (P2[0] >= P1[0] ? 1 : -1);
        L(P1[0], P1[1], P2[0], P2[1], 'dl'); L(P2[0], P2[1], P2[0] + dir * 10, P2[1], 'dl');
        AR(P1[0], P1[1], Math.atan2(P1[1] - P2[1], P1[0] - P2[0]));
        T(P2[0] + dir * 13, P2[1] + 5.5, t, oo.c || 'dt', dir > 0 ? 'start' : 'end');
        return d;
      },
      // diámetro o radio de un círculo con su línea de referencia (ángulo en grados)
      dia(cx, cy, rr, ang, len, t) { const a = rad(ang); return d.lead(cx + rr * cos(a), cy - rr * sin(a), cx + (rr + len) * cos(a), cy - (rr + len) * sin(a), t); },
      txt(x, y, s, oo) { oo = oo || {}; T(X(x), Y(y), s, oo.c || 'lab', oo.a || 'middle', oo.rot, oo.fs); return d; },
      // globo de vista explosionada
      globo(x, y, n) { d.circ(x, y, 5.2, 'glb'); T(X(x), Y(y) + 5.5, String(n), 'lab', 'middle'); return d; },
      svg(alt) { return '<svg' + (FS === 17 ? ' class="pf-n"' : '') + ' viewBox="0 0 ' + W + ' ' + HH + '" width="' + W + '" height="' + HH + '" font-size="' + FS + '" role="img" aria-label="' + esc(alt) + '">' + (defs.length ? '<defs>' + defs.join('') + '</defs>' : '') + out.join('') + '</svg>'; }
    };
    return d;
  }
  // ranura (eslabón con extremos redondos) de centro a centro, horizontal
  const ranura = (d, x, y, lg, rr, c) => d.path([['M', x, y - rr], ['L', x + lg, y - rr], ['A', rr, 0, 1, x + lg, y + rr], ['L', x, y + rr], ['A', rr, 0, 1, x, y - rr], ['Z']], c || 'pz');
  const engranePts = (cx, cy, z, m, off) => {
    const ra = m * (z + 2) / 2, rf = m * (z - 2.5) / 2, p = 2 * PI / z, pts = [];
    for (let i = 0; i < z; i++) { const t = off + i * p; [[rf, t - 0.3 * p], [ra, t - 0.12 * p], [ra, t + 0.12 * p], [rf, t + 0.3 * p]].forEach(q => pts.push([cx + q[0] * cos(q[1]), cy - q[0] * sin(q[1])])); }
    return pts;
  };
  const espejo = pts => pts.map(p => [-p[0], p[1]]);

  const FIG = {
    placa() {
      const d = dib(-27, -20, 130, 86);
      d.rect(0, 0, 80, 40); d.circ(12, 20, 4, 'hole'); d.circ(68, 20, 4, 'hole');
      d.line(5, 20, 88, 20, 'cl'); d.line(12, 13, 12, 27, 'cl'); d.line(68, 13, 68, 27, 'cl');
      d.dimH(0, 12, 0, -9, '12'); d.dimH(68, 80, 0, -9, '12');
      d.dimH(0, 80, 40, 51, '80'); d.dimV(0, 40, 0, -12, '40'); d.dimV(20, 40, 80, 96, '20', { o1: 88, g: 0 });
      d.dia(68, 20, 4, 50, 13, '2× Ø8');
      d.txt(40, 63, 'Espesor 5 · medidas en mm', { c: 'nt' });
      return d.svg('Placa de 80 por 40 por 5 mm con dos barrenos de 8 mm');
    },
    eslabon() {
      const d = dib(-36, -32, 174, 60);
      ranura(d, 0, 0, 100, 10); d.circ(0, 0, 2.5, 'hole'); d.circ(100, 0, 2.5, 'hole');
      d.line(-15, 0, 115, 0, 'cl'); d.line(0, -15, 0, 15, 'cl'); d.line(100, -15, 100, 15, 'cl');
      d.dimH(0, 100, -15, -23, '100 entre centros', { g: 0 });
      d.lead(107.07, -7.07, 117, -19, 'R10');
      d.dia(0, 0, 2.5, 225, 13, '2× Ø5');
      d.txt(50, 25, 'Espesor 4 · medidas en mm', { c: 'nt' });
      return d.svg('Eslabón de 100 mm entre centros, extremos de radio 10 y barrenos de 5 mm');
    },
    escuadra() {
      const d = dib(-28, -16, 96, 96);
      d.path([['M', 0, 0], ['L', 6, 0], ['L', 6, 41], ['A', 3, 0, 0, 9, 44], ['L', 50, 44], ['L', 50, 50], ['L', 0, 50], ['Z']]);
      d.line(25.5, 44, 25.5, 50, 'hid'); d.line(30.5, 44, 30.5, 50, 'hid'); d.line(28, 40, 28, 54, 'cl');
      d.line(0, 19.5, 6, 19.5, 'hid'); d.line(0, 24.5, 6, 24.5, 'hid'); d.line(-4, 22, 10, 22, 'cl');
      d.dimH(0, 6, 0, -8, '6'); d.dimV(44, 50, 50, 58, '6', { h: 1 });
      d.dimH(0, 28, 50, 58, '28', { o2: 54, g: 0 }); d.dimH(0, 50, 50, 68, '50');
      d.dimV(22, 50, 0, -9, '28', { o1: -4, g: 0 }); d.dimV(0, 50, 0, -19, '50');
      d.lead(6.9, 43.1, 17, 33, 'R3');
      d.lead(30.5, 47, 37, 38, '2× Ø5 pasados');
      d.txt(26, 78, 'Ancho 20 (Pad simétrico) · medidas en mm', { c: 'nt' });
      return d.svg('Escuadra en L de 50 por 50, espesor 6, redondeo interior de 3 y dos barrenos de 5 mm');
    },
    brida() {
      const d = dib(-54, -48, 112, 100);
      d.circ(0, 0, 30); d.circ(0, 0, 10, 'hole'); d.circ(0, 0, 22, 'clc');
      for (let i = 0; i < 6; i++) { const a = rad(i * 60), x = 22 * cos(a), y = -22 * sin(a); d.circ(x, y, 3, 'hole'); d.cl(x, y, 4.5); }
      d.line(-35, 0, 35, 0, 'cl'); d.line(0, -35, 0, 35, 'cl'); d.line(0, 0, 22 * cos(rad(60)), -22 * sin(rad(60)), 'cl');
      d.arc(0, 0, 15, 0, 60); d.txt(17.5 * cos(rad(30)) + 1, -17.5 * sin(rad(30)) + 1, '60°', { c: 'dt', a: 'start' });
      d.dia(0, 0, 30, 125, 9, 'Ø60'); d.dia(0, 0, 10, 330, 26, 'Ø20'); d.dia(0, 0, 22, 215, 15, 'Ø44');
      d.dia(22 * cos(rad(60)), -22 * sin(rad(60)), 3, 60, 16, '6× Ø6');
      d.txt(0, 47, 'Espesor 6 · medidas en mm', { c: 'nt' });
      return d.svg('Brida de 60 mm con barreno central de 20 y seis barrenos de 6 mm en un círculo de 44');
    },
    engrane() {
      const d = dib(-26, -58, 122, 124);
      const p2 = 2 * PI / 36;
      d.poly(engranePts(0, 0, 12, 2, 0)); d.poly(engranePts(48, 0, 36, 2, PI + p2 / 2));
      d.circ(0, 0, 12, 'clc'); d.circ(48, 0, 36, 'clc'); d.circ(0, 0, 3, 'hole'); d.circ(48, 0, 3, 'hole');
      d.line(-18, 0, 90, 0, 'cl'); d.line(0, -18, 0, 18, 'cl'); d.line(48, -42, 48, 42, 'cl');
      d.dimH(0, 48, -18, -49, 'a = 48', { o2: -42, g: 0 });
      d.txt(0, 25, 'Z1 = 12', {}); d.txt(48, 50, 'Z2 = 36', {});
      d.txt(35, 59, 'm = 2 · ángulo de presión 20° · espesor 8 · barreno Ø6', { c: 'nt' });
      d.txt(35, 65, 'Trazo y punto: diámetros primitivos d = m·Z = Ø24 y Ø72', { c: 'nt' });
      return d.svg('Par de engranes de 12 y 36 dientes, módulo 2, con 48 mm entre centros');
    },
    polea() {
      const d = dib(-52, -16, 104, 53);
      const P = [[4, 16], [30, 16], [30, 10.18], [24, 8], [30, 5.82], [30, 0], [4, 0]];
      d.poly(espejo(P), 'gh'); d.poly(P, 'sec', d.hatch());
      d.line(0, -6, 0, 23, 'cl');
      d.dimH(-30, 30, 0, -9, 'Ø60'); d.dimH(-4, 4, 16, 24, 'Ø8'); d.dimV(0, 16, -30, -42, '16');
      d.lead(-27, 6.91, -40, -6, '40°'); d.lead(-24, 8, -36, 22, 'Ø48');
      ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'].forEach((n, i) => { const p = P[i], dx = [1.5, 2, 2, -1.5, 2, 2, 1.5][i], dy = [4.4, 4.4, 1.8, 1.4, 1.8, -1.6, -1.6][i]; d.txt(p[0] + dx, p[1] + dy, n, { c: 'pl', a: dx < 0 ? 'end' : 'start' }); });
      d.txt(0, 30.5, 'Rayado: tu croquis (la mitad derecha)', { c: 'nt' }); d.txt(0, 35.5, 'Trazo y punto: eje de giro', { c: 'nt' });
      return d.svg('Perfil de polea con canal en V: exterior 60, fondo del canal 48, barreno 8, ancho 16');
    },
    leva() {
      const d = dib(-34, -38, 86, 72);
      d.circ(8, 0, 20); d.circ(0, 0, 4, 'hole');
      d.line(-16, 0, 32, 0, 'cl'); d.line(0, -25, 0, 25, 'cl'); d.line(8, -25, 8, 25, 'cl');
      d.dimH(0, 8, -25, -30, 'e = 8', { g: 0 });
      d.dia(8, 0, 20, 40, 7, 'Ø40'); d.dia(0, 0, 4, 215, 20, 'Ø8 eje');
      d.txt(9, 31, 'Espesor 6 · carrera = 2·e = 16 mm', { c: 'nt' });
      return d.svg('Leva excéntrica: disco de 40 mm con el eje de 8 mm a 8 mm del centro');
    },
    manivela() {
      const d = dib(-24, -28, 140, 96);
      ranura(d, 0, 0, 30, 8); d.circ(0, 0, 2.5, 'hole'); d.circ(30, 0, 2.5, 'hole');
      d.line(-11, 0, 41, 0, 'cl'); d.line(0, -12, 0, 12, 'cl'); d.line(30, -12, 30, 12, 'cl');
      d.rect(60, -10, 30, 20); d.circ(75, 0, 2.5, 'hole'); d.cl(75, 0, 6);
      ranura(d, 0, 36, 100, 8); d.circ(0, 36, 2.5, 'hole'); d.circ(100, 36, 2.5, 'hole');
      d.line(-11, 36, 111, 36, 'cl'); d.line(0, 24, 0, 48, 'cl'); d.line(100, 24, 100, 48, 'cl');
      d.dimH(0, 30, -12, -19, '30', { g: 0 }); d.lead(35.66, -5.66, 44, -17, 'R8');
      d.dimH(60, 90, -10, -19, '30'); d.dimV(-10, 10, 90, 98, '20');
      d.dimH(0, 100, 48, 54, '100', { g: 0 });
      d.txt(15, 15, 'Manivela', {}); d.txt(75, 16, 'Corredera (espesor 15)', {}); d.txt(50, 34.2, 'Biela', {});
      d.txt(48, 61, 'Barrenos Ø5 · manivela y biela: R8, espesor 4 · carrera = 2 × 30 = 60', { c: 'nt' });
      return d.svg('Manivela de 30, biela de 100 entre centros y corredera de 30 por 20 por 15');
    },
    resorte() {
      const d = dib(-38, -14, 78, 66);
      const R = 10, p = 5, N = 8, Hh = 40, ww = 2 * d.k;
      const back = [], front = []; let cur = null, lado = null;
      for (let i = 0; i <= N * 64; i++) {
        const t = i / 64, x = R * cos(2 * PI * t), z = sin(2 * PI * t), y = Hh - p * t, f = z >= 0;
        if (f !== lado) { if (cur) cur.push([x, y]); cur = [[x, y]]; (f ? front : back).push(cur); lado = f; } else cur.push([x, y]);
      }
      const run = (c, cls) => d.poly(c, cls, null, true);
      back.forEach(c => run(c, 'wb')); front.forEach(c => run(c, 'wf'));
      d.line(0, -6, 0, 46, 'cl');
      d.dimH(-10, 10, -2, -8, 'Ø20 medio'); d.dimV(0, 40, 12, 22, '40');
      d.dimV(32.5, 37.5, -12, -20, 'paso 5', { h: 1 });
      d.lead(-1.5, 38.6, -14, 47, 'alambre Ø2');
      d.txt(20, -9, '8 vueltas', { c: 'nt', a: 'start' });
      return { svg: d.svg('Resorte de compresión: diámetro medio 20, alambre de 2, paso 5, altura 40'), ww: ww };
    },
    ensamble4b() {
      const d = dib(-52, -100, 194, 160);
      const O2 = [0, 0], O4 = [80, 0], A2 = [40 * cos(rad(60)), -40 * sin(rad(60))];
      const dx = O4[0] - A2[0], dy = O4[1] - A2[1], dd = Math.hypot(dx, dy), a = (100 * 100 - 90 * 90 + dd * dd) / (2 * dd), hh = Math.sqrt(100 * 100 - a * a);
      const Pm = [A2[0] + a * dx / dd, A2[1] + a * dy / dd], B = [Pm[0] + hh * dy / dd, Pm[1] - hh * dx / dd];
      d.circ(0, 0, 40, 'tr');
      d.line(O2[0], O2[1], O4[0], O4[1], 'lkb');
      d.line(O2[0], O2[1], A2[0], A2[1], 'lk'); d.line(A2[0], A2[1], B[0], B[1], 'lk'); d.line(O4[0], O4[1], B[0], B[1], 'lk');
      [O2, O4].forEach(p => { d.poly([[p[0], p[1]], [p[0] - 6, p[1] + 8], [p[0] + 6, p[1] + 8]], 'gnd'); for (let i = -1; i <= 2; i++) d.line(p[0] - 8 + i * 4.5, p[1] + 12, p[0] - 4 + i * 4.5, p[1] + 8, 'ol0'); d.line(p[0] - 9, p[1] + 8, p[0] + 9, p[1] + 8, 'ol0'); });
      [O2, O4, A2, B].forEach(p => d.circ(p[0], p[1], 2.4, 'pin'));
      d.txt(-2, -22, '40 manivela', { a: 'end' });
      d.txt((A2[0] + B[0]) / 2 - 6, (A2[1] + B[1]) / 2 - 4, '100 acoplador', { a: 'end' });
      d.txt((O4[0] + B[0]) / 2 + 6, (O4[1] + B[1]) / 2, '90 balancín', { a: 'start' });
      d.txt(40, 18, '80 base (fija)', {});
      d.txt(40, 49, 'Círculo punteado: recorrido de la manivela', { c: 'nt' });
      d.txt(40, 56, 'Grashof: 40 + 100 = 140 ≤ 80 + 90 = 170 → la de 40 da la vuelta', { c: 'nt' });
      return d.svg('Mecanismo de cuatro barras: base 80, manivela 40, acoplador 100 y balancín 90');
    },
    techdraw() {
      const d = dib(-4, -4, 305, 218, { fs: 11 });
      d.rect(0, 0, 297, 210, 'pg'); d.rect(10, 10, 277, 190, 'ol0');
      d.rect(167, 170, 120, 30, 'ol0'); d.line(167, 180, 287, 180, 'ol0'); d.line(167, 190, 287, 190, 'ol0'); d.line(227, 170, 227, 200, 'ol0');
      d.txt(170, 177.5, 'Nombre:', { a: 'start', c: 'tb' }); d.txt(230, 177.5, 'Grupo: 3°A', { a: 'start', c: 'tb' });
      d.txt(170, 187.5, 'Pieza: Placa', { a: 'start', c: 'tb' }); d.txt(230, 187.5, 'Material: MDF', { a: 'start', c: 'tb' });
      d.txt(170, 197.5, 'Escala 1:1 · mm', { a: 'start', c: 'tb' }); d.txt(230, 197.5, 'Primer diedro', { a: 'start', c: 'tb' });
      // frente
      d.rect(40, 40, 80, 40); d.circ(52, 60, 4, 'hole'); d.circ(108, 60, 4, 'hole'); d.line(45, 60, 115, 60, 'cl'); d.line(52, 53, 52, 67, 'cl'); d.line(108, 53, 108, 67, 'cl');
      // superior (abajo del frente en primer diedro)
      d.rect(40, 100, 80, 5); d.line(48, 100, 48, 105, 'hid'); d.line(56, 100, 56, 105, 'hid'); d.line(104, 100, 104, 105, 'hid'); d.line(112, 100, 112, 105, 'hid'); d.line(52, 97, 52, 108, 'cl'); d.line(108, 97, 108, 108, 'cl');
      // lateral izquierda (a la derecha del frente en primer diedro)
      d.rect(150, 40, 5, 40); d.line(150, 56, 155, 56, 'hid'); d.line(150, 64, 155, 64, 'hid'); d.line(147, 60, 158, 60, 'cl');
      d.line(40, 82, 40, 98, 'pj'); d.line(120, 82, 120, 98, 'pj'); d.line(122, 40, 148, 40, 'pj'); d.line(122, 80, 148, 80, 'pj');
      d.dimH(40, 120, 40, 30, '80'); d.dimV(40, 80, 40, 30, '40'); d.dia(108, 60, 4, 40, 10, '2× Ø8');
      d.txt(80, 91, 'FRENTE', { c: 'vn' }); d.txt(80, 116, 'SUPERIOR', { c: 'vn' }); d.txt(152.5, 91, 'LATERAL IZQ.', { c: 'vn' });
      d.txt(220, 50, 'Hoja A4', { c: 'nt' }); d.txt(220, 60, 'Vista superior: abajo', { c: 'nt' }); d.txt(220, 70, 'Lateral izquierda: a la derecha', { c: 'nt' });
      return d.svg('Hoja A4 de TechDraw con frente, vista superior abajo y lateral izquierda a la derecha (primer diedro) y cuadro de datos');
    },
    explosionada() {
      const d = dib(-6, -14, 268, 104, { fs: 13 });
      d.line(40, -10, 40, 82, 'cl');
      d.rect(34, 0, 12, 4); d.rect(38.5, 4, 3, 26); for (let y = 12; y < 30; y += 2.5) d.line(38.5, y, 41.5, y + 1.2, 'ol0');
      d.rect(8, 40, 64, 4); d.line(38.5, 40, 38.5, 44, 'hid'); d.line(41.5, 40, 41.5, 44, 'hid');
      d.rect(0, 54, 100, 6); d.line(38.5, 54, 38.5, 60, 'hid'); d.line(41.5, 54, 41.5, 60, 'hid');
      d.rect(35, 70, 10, 4); d.line(38.5, 70, 38.5, 74, 'hid'); d.line(41.5, 70, 41.5, 74, 'hid');
      [[46, 2, 1], [72, 42, 2], [100, 57, 3], [45, 72, 4]].forEach(b => { d.line(b[0], b[1], 112.5, b[1] === 57 ? 57 : b[1], 'dl'); d.globo(118, b[1], b[2]); });
      const x = [128, 142, 206, 224, 260], ys = [0, 10, 20, 30, 40, 50];
      d.txt(194, -5, 'Lista de materiales', { c: 'lab' });
      ys.forEach(y => d.line(x[0], y, x[4], y, 'ol0')); x.forEach(xx => d.line(xx, 0, xx, 50, 'ol0'));
      [['N.º', 'Pieza', 'Cant.', 'Material'], ['1', 'Tornillo M3 × 30', '1', 'Acero'], ['2', 'Eslabón', '1', 'Cartón'], ['3', 'Base', '1', 'MDF'], ['4', 'Tuerca M3', '1', 'Acero']].forEach((row, i) => {
        d.txt(135, ys[i] + 7, row[0], { c: i ? 'tb' : 'lab' }); d.txt(145, ys[i] + 7, row[1], { a: 'start', c: i ? 'tb' : 'lab' }); d.txt(215, ys[i] + 7, row[2], { c: i ? 'tb' : 'lab' }); d.txt(227, ys[i] + 7, row[3], { a: 'start', c: i ? 'tb' : 'lab' });
      });
      d.txt(0, 86, 'Cada pieza se separa sobre el eje en que se arma', { c: 'nt', a: 'start' });
      return d.svg('Vista explosionada de una articulación: tornillo, eslabón, base y tuerca separados sobre su eje, con globos y lista de materiales');
    },
    cilindro() {
      const d = dib(-36, -42, 252, 96, { fs: 15 });
      const hh = d.hatch(45), hp = d.hatch(-45);
      d.rect(0, -20, 100, 4, 'sec', hh); d.rect(0, 16, 100, 4, 'sec', hh);
      d.rect(-5, -20, 5, 40, 'sec', hh); d.rect(100, -20, 5, 14, 'sec', hh); d.rect(100, 6, 5, 14, 'sec', hh);
      d.rect(30, -16, 10, 32, 'sec', hp); d.rect(40, -6, 120, 12);
      d.line(-12, 0, 168, 0, 'cl');
      d.dimH(0, 100, -20, -30, '100'); d.dimV(-20, 20, -5, -17, 'Ø40'); d.dimV(-6, 6, 160, 170, 'Ø12');
      d.lead(35, 10, 22, 32, 'émbolo Ø32 × 10'); d.lead(75, 18, 86, 32, 'camisa Ø40 / Ø32');
      d.lead(140, -6, 148, -22, 'vástago Ø12 × 120');
      d.txt(15, -7, 'aire →', { c: 'nt' });
      d.txt(85, 49, 'A = π·32²/4 ≈ 804 mm² · a 6 bar (0.6 N/mm²): F ≈ 482 N al avanzar, 415 N al regresar', { c: 'nt' });
      return d.svg('Corte de un cilindro de doble efecto: camisa de 40 por 32, émbolo de 32 y vástago de 12 por 120');
    },
    abrazadera() {
      const d = dib(-24, -26, 106, 82);
      d.path([['M', 0, 0], ['L', 14.5, 0], ['A', 10.5, 0, 0, 35.5, 0], ['L', 50, 0], ['L', 50, 30], ['L', 0, 30], ['Z']]);
      d.circ(7, 15, 2, 'hole'); d.circ(43, 15, 2, 'hole'); d.cl(7, 15, 5); d.cl(43, 15, 5); d.cl(25, 0, 5);
      d.dimV(0, 30, 0, -10, '30'); d.dimV(15, 30, 50, 60, '15', { o1: 48, g: 0 });
      d.dimH(0, 7, 30, 38, '7'); d.dimH(43, 50, 30, 38, '7'); d.dimH(0, 50, 30, 47, '50');
      d.lead(25 + 7.42, 7.42, 40, -14, 'R10.5');
      d.dia(43, 15, 2, 45, 12, 'Ø4 (×2)');
      d.txt(25, 55, 'Espesor 10 · R = Ø de tu jeringa / 2 + 0.5 de juego', { c: 'nt' });
      return d.svg('Abrazadera de 50 por 30 con hueco de radio 10.5 para la jeringa y dos barrenos de 4 mm');
    },
    carrete() {
      const d = dib(-44, -16, 100, 58);
      const P = [[1, 24], [12, 24], [12, 22], [5, 22], [5, 2], [12, 2], [12, 0], [1, 0]];
      d.poly(espejo(P), 'gh'); d.poly(P, 'sec', d.hatch());
      d.line(0, -6, 0, 30, 'cl');
      d.dimH(-12, 12, 0, -9, 'Ø24'); d.dimH(-1, 1, 24, 32, 'Ø2', { dx: 22 });
      d.dimV(2, 22, -12, -20, '20'); d.dimV(0, 24, -12, -30, '24'); d.dimV(0, 2, 12, 19, '2', { h: 1 });
      d.lead(5, 12, 22, 12, 'Ø10 (r = 5)');
      d.txt(6, 39.5, 'Rayado: tu croquis · el hilo se enrolla en el Ø10', { c: 'nt' });
      return d.svg('Perfil de carrete: pestañas de 24 por 2, tambor de 10 por 20 y barreno de 2 mm');
    }
  };

  /* =================== las prácticas =================== */
  const PR = E.PRACTICAS = [
    { id: 'placa', t: 'Placa de montaje con dos barrenos', nivel: 1, min: 35, sm: ['II-2'], en: ['fc-nivel'],
      obj: 'Dibujar un boceto totalmente restringido (en verde) y convertirlo en sólido con Pad.',
      pasos: [['Body', 'Archivo → Nuevo. Entra al banco Part Design y crea un cuerpo (Body).'], ['Sketch', 'Crea un croquis en el plano XY.'],
        ['Rectangle', 'Dibuja un rectángulo empezando justo en el origen (el punto rojo donde se cruzan los ejes).'],
        ['Dimension', 'Distancia horizontal 80 y vertical 40. Si la esquina no quedó pegada al origen, únelos con Coincident.'],
        ['Circle', 'Dos círculos adentro: al primero diámetro 8; al segundo Equal con el primero (mismo tamaño).'],
        ['Dimension', 'Centros: el izquierdo a 12 del borde izquierdo y a 20 del de abajo; el derecho a 12 del borde derecho y Horizontal con el primero.'],
        ['', 'El panel debe decir «Fully constrained» (totalmente restringido) y todo se pone verde. Si no, arrastra líneas: la que se mueve es la que falta.'],
        ['Pad', 'Cierra el croquis (Close). Con el croquis seleccionado: Pad → Length 5 → OK. Los círculos de adentro se vuelven barrenos solos.'],
        ['Ctrl+S', 'Guarda como Apellido_Placa.FCStd en la carpeta del grupo.']],
      revisa: ['El croquis dice totalmente restringido (verde).', 'La placa mide 80 × 40 × 5.', 'Los dos barrenos atraviesan toda la placa.', 'El archivo lleva tu apellido.'],
      errores: ['El rectángulo no empieza en el origen y el croquis nunca queda verde: usa Coincident con el origen.', 'Poner 8 como radio: el barreno sale del doble. La cota debe decir Ø.', 'Croquis con esquinas sin unir: Pad marca error. Revisa que el contorno esté cerrado.'],
      reto: 'Cambia el 80 por 100 (doble clic en la cota). ¿El barreno derecho sigue a 12 mm del borde? Si lo acotaste desde el borde derecho, sí: eso es intención de diseño.',
      entrega: 'Captura de pantalla con el árbol del modelo y la pieza, y el archivo .FCStd.' },
    { id: 'eslabon', t: 'Eslabón de 100 mm entre centros', nivel: 1, min: 30, sm: ['II-2'], en: ['fc-nivel', 'fc-eslabones'],
      obj: 'Usar la ranura del croquis y las restricciones de radio y distancia para hacer el eslabón del cuatro barras.',
      pasos: [['Sketch', 'Body nuevo y croquis en el plano XY.'], ['Slot', 'Dibuja una ranura (Slot) horizontal: es el contorno del eslabón con extremos redondos.'],
        ['Coincident', 'Pon el centro del arco izquierdo en el origen.'], ['Dimension', 'Distancia horizontal entre los centros de los arcos: 100. Radio de un arco: 10.'],
        ['Circle', 'Un círculo en cada centro de arco (que coincidan) con diámetro 5; el segundo con Equal.'], ['', 'Verde = totalmente restringido. Cierra el croquis.'],
        ['Pad', 'Pad de 4 mm.'], ['Ctrl+S', 'Guarda como Apellido_Eslabon100.FCStd.']],
      revisa: ['100 mm de centro a centro (de punta a punta mide 120).', 'Barrenos Ø5 en los centros de los arcos.', 'Croquis en verde.'],
      errores: ['Medir 100 de orilla a orilla: el mecanismo no tendrá las longitudes que calculaste.', 'Círculo que no coincide con el centro del arco: barreno chueco.', 'Ranura inclinada: le falta la restricción Horizontal.'],
      reto: 'Haz los 4 eslabones de un manivela-balancín: Guardar como… y cambia solo la cota de 100 por 40, 80 y 90. Grashof: 40 + 100 = 140 ≤ 80 + 90 = 170, así que el de 40 da vueltas completas. Los usarás en el ensamble.',
      entrega: 'Los archivos de los eslabones y una captura del de 100 mm.' },
    { id: 'leva', t: 'Leva excéntrica', nivel: 1, min: 25, sm: ['II-2'], en: [],
      obj: 'Modelar una leva circular con el eje fuera del centro y calcular la carrera del seguidor.',
      pasos: [['Sketch', 'Body nuevo y croquis en XY.'], ['Circle', 'Círculo Ø8 con centro en el origen: es el eje.'],
        ['Circle', 'Círculo Ø40 con centro sobre el eje horizontal (Point on object) a 8 mm del origen (Dimension).'], ['Pad', 'Cierra el croquis y haz Pad de 6 mm.']],
      revisa: ['Excentricidad e = 8 entre el centro del disco y el del eje.', 'Carrera del seguidor = 2 · e = 16 mm.'],
      errores: ['Poner el disco en el origen: es una rueda, no una leva (carrera 0).', 'Confundir excentricidad con carrera: la carrera es el doble.'],
      reto: 'Leva de huevo: círculo base R20 en el origen, círculo «nariz» R8 con centro 22 mm arriba y dos líneas tangentes (Tangent) a los dos círculos; recorta lo que sobra con Trim edge. ¿Cuánto sube el seguidor? 22 + 8 − 20 = 10 mm.',
      entrega: 'Captura de la leva y el cálculo de la carrera en tu libreta.' },
    { id: 'manivela', t: 'Biela-manivela: manivela, biela y corredera', nivel: 1, min: 45, sm: ['II-2'], en: [],
      obj: 'Reutilizar el eslabón para hacer las tres piezas de un biela-manivela y calcular su carrera.',
      pasos: [['Guardar como', 'Abre tu eslabón de 100 → Archivo → Guardar como Apellido_Biela.FCStd. Cambia R10 por R8: ya tienes la biela.'],
        ['Guardar como', 'Guardar como Apellido_Manivela.FCStd y cambia 100 por 30.'],
        ['Sketch', 'Archivo nuevo para la corredera: Body, croquis en XY, rectángulo 30 × 20 centrado en el origen (Symmetric de dos esquinas opuestas respecto al origen) y círculo Ø5 en el origen.'],
        ['Pad', 'Pad de 15 mm.']],
      revisa: ['Manivela 30 y biela 100 entre centros, R8, barrenos Ø5, espesor 4.', 'Corredera 30 × 20 × 15 con barreno Ø5 al centro.', 'Carrera = 2 × 30 = 60 mm.'],
      errores: ['Cambiar la cota en el archivo original sin «Guardar como»: pierdes el eslabón de 100.', 'Barreno de la corredera fuera del centro: la biela jala chueco.'],
      reto: '¿Qué manivela necesitas para una carrera de 50 mm? r = 50 / 2 = 25. Hazla y compárala con la de 30.',
      entrega: 'Los tres archivos y una captura de cada pieza.' },
    { id: 'escuadra', t: 'Escuadra de refuerzo en L', nivel: 2, min: 40, sm: ['II-2'], en: ['fc-eslabones'],
      obj: 'Extruir un perfil, redondear una arista y hacer barrenos pasados en dos direcciones con Pocket.',
      pasos: [['Sketch', 'Body nuevo y croquis en el plano XZ (así la L queda parada).'], ['Polyline', 'Dibuja la L con Polyline (6 líneas) y ciérrala en el punto inicial.'],
        ['Dimension', '50 y 50 por fuera y 6 de espesor en cada ala; la esquina exterior en el origen.'], ['Pad', 'Cierra el croquis → Pad 20 con «Symmetric to plane» ✓.'],
        ['Fillet', 'Selecciona la arista de la esquina interior → Fillet → radio 3.'],
        ['Sketch', 'Croquis en el plano XY (Origin → XY_Plane): círculo Ø5 a 28 del origen sobre el eje horizontal. Pocket → Through all + Symmetric to plane.'],
        ['Pocket', 'Croquis en el plano YZ: círculo Ø5 a 28 del origen sobre el eje vertical. Pocket → Through all + Symmetric to plane.']],
      revisa: ['Perfil 50 × 50 × 6 con 20 de ancho.', 'Redondeo interior R3.', 'Dos barrenos Ø5 pasados, a 28 de la esquina exterior.'],
      errores: ['Pocket sin Through all: barreno ciego.', 'Pocket que no corta nada: el croquis está del otro lado; activa Symmetric to plane o Reversed.', 'Seleccionar la arista exterior para el Fillet: redondea por fuera.'],
      reto: 'Cambia el Fillet por un Chamfer de 3 mm. ¿Qué es más fácil de hacer con segueta y lima?',
      entrega: 'Captura con la pieza y el árbol (Pad, Fillet y dos Pocket).' },
    { id: 'brida', t: 'Brida con 6 barrenos (patrón polar)', nivel: 2, min: 35, sm: ['II-2'], en: [],
      obj: 'Hacer un barreno y repetirlo en círculo con Polar pattern en lugar de dibujar seis.',
      pasos: [['Sketch', 'Body nuevo; croquis en XY: dos círculos con centro en el origen, Ø60 y Ø20.'], ['Pad', 'Pad de 6 mm (el círculo de adentro queda hueco).'],
        ['Sketch', 'Croquis otra vez en el plano XY: círculo Ø6 con centro sobre el eje horizontal a 22 del origen.'], ['Pocket', 'Pocket → Through all + Symmetric to plane.'],
        ['Polar pattern', 'Selecciona el Pocket en el árbol → Polar pattern → Axis: Base Z axis (eje Z del cuerpo), Angle 360°, Occurrences 6.']],
      revisa: ['6 barrenos iguales cada 60°.', 'El círculo de barrenos mide Ø44 (radio 22).', 'En el árbol: un Pocket y un PolarPattern.'],
      errores: ['Dibujar los 6 círculos a mano: si cambia una medida hay que mover 6.', 'Eje equivocado en Polar pattern: los barrenos salen fuera de la pieza.', 'Olvidar que 22 es radio: el plano dice Ø44.'],
      reto: 'Cambia Occurrences a 8 y el diámetro exterior a 70. ¿Cuántas cotas tuviste que tocar?',
      entrega: 'Captura con el árbol mostrando el PolarPattern.' },
    { id: 'polea', t: 'Polea con canal en V (Revolution)', nivel: 2, min: 40, sm: ['II-2'], en: [],
      obj: 'Hacer una pieza redonda dibujando solo medio perfil y girándolo con Revolution.',
      tabla: { cab: ['Punto', 'Del eje (x)', 'Altura (y)'], filas: [['P1', 4, 0], ['P2', 30, 0], ['P3', 30, 5.82], ['P4', 24, 8], ['P5', 30, 10.18], ['P6', 30, 16], ['P7', 4, 16]] },
      pasos: [['Sketch', 'Body nuevo; croquis en XY. El eje vertical del croquis será el eje de la polea.'], ['Polyline', 'Dibuja el perfil cerrado P1 → P7 → P1 de la tabla, todo a la derecha del eje.'],
        ['Dimension', 'Acota cada punto: distancia horizontal desde el eje y vertical desde abajo, hasta que quede verde.'],
        ['Revolution', 'Cierra el croquis → Revolution → Axis: Vertical sketch axis, Angle 360° → OK.'], ['Ctrl+S', 'Guarda como Apellido_Polea.FCStd.']],
      revisa: ['Exterior Ø60, fondo del canal Ø48, barreno Ø8, ancho 16.', 'Canal de 40° (cada lado a 20° de la horizontal).'],
      errores: ['Perfil que cruza el eje: Revolution marca error.', 'Dibujar las dos mitades: sale una pieza doble.', 'Elegir el eje horizontal: sale un «plato» acostado.'],
      reto: 'Borra las cotas 5.82 y 10.18 y en su lugar usa Symmetric (los dos puntos del canal respecto a una línea de construcción horizontal a la altura de P4) y Angle de 40° entre las dos líneas del canal.',
      entrega: 'Captura de la polea y del croquis en verde.' },
    { id: 'engrane', t: 'Par de engranes de 12 y 36 dientes', nivel: 2, min: 45, sm: ['II-2'], en: [],
      obj: 'Generar engranes reales con el asistente de involuta y comprobar la relación de transmisión.',
      pasos: [['Body', 'Archivo nuevo y Body nuevo.'], ['Involute gear', 'Menú Part Design → Involute gear…: Number of teeth 12, Modules 2, Pressure angle 20°, External gear ✓ → OK.'],
        ['Pad', 'Selecciona el engrane en el árbol → Pad 8 mm.'], ['Pocket', 'Croquis en el plano XY con un círculo Ø6 en el origen → Pocket → Through all + Symmetric to plane.'],
        ['Body', 'Otro Body en el mismo archivo y repite con 36 dientes.'],
        ['Placement', 'Selecciona el Body del grande → propiedad Placement → Position x = 48 (a = m·(Z1 + Z2)/2 = 2·48/2).'],
        ['Placement', 'Si los dientes se enciman, gira el grande medio diente: Angle 5° sobre z (360° / 36 / 2).']],
      revisa: ['Diámetros primitivos 24 y 72 (d = m·Z).', 'Centros a 48 mm y dientes que engranan sin encimarse.', 'Barreno Ø6 en los dos.'],
      errores: ['Módulos distintos en los dos engranes: nunca engranan.', 'Calcular la distancia entre centros con el diámetro exterior en vez del primitivo.', 'Hacer Pad sin seleccionar el engrane en el árbol.'],
      reto: 'i = Z2 / Z1 = 36 / 12 = 3: si el chico da 3 vueltas, el grande da 1. Calcula la distancia entre centros con un grande de 24 dientes (a = 2·(12 + 24)/2 = 36) y compruébalo moviendo el Placement.',
      entrega: 'Captura de los dos engranes acomodados.' },
    { id: 'abrazadera', t: 'Abrazadera para la jeringa de la grúa', nivel: 2, min: 35, sm: ['II-3'], en: [],
      obj: 'Diseñar una pieza a la medida de un objeto real: medir la jeringa y dejarle juego.',
      pasos: [['', 'Mide con vernier el diámetro exterior de tu jeringa (la de 20 ml mide unos 20 mm). Radio = Ø / 2 + 0.5 de juego.'],
        ['Sketch', 'Body nuevo; croquis en XY: rectángulo 50 × 30 con la esquina de abajo a la izquierda en el origen.'],
        ['Arc', 'Arco con centro sobre el lado de arriba (Point on object) a 25 del origen y radio 10.5; sus extremos también sobre el lado de arriba.'],
        ['Trim edge', 'Trim edge: borra el tramo del lado de arriba que queda dentro del arco.'],
        ['Circle', 'Dos círculos Ø4: centros a 7 de cada lado y a 15 de abajo.'], ['Pad', 'Pad de 10 mm.']],
      revisa: ['Contorno cerrado y en verde.', 'Radio = tu jeringa / 2 + 0.5.', 'Barrenos Ø4 para tornillo M3 con juego.'],
      errores: ['Usar el diámetro como radio: hueco enorme.', 'Sin juego (radio exacto): la jeringa no entra al cortar o imprimir.', 'No recortar el tramo de arriba: el croquis no es un contorno válido.'],
      reto: 'Haz la versión para la jeringa de 10 ml (mídela) cambiando solo el radio.',
      entrega: 'Captura y la medida de tu jeringa.' },
    { id: 'carrete', t: 'Carrete del malacate de la grúa', nivel: 2, min: 35, sm: ['II-3'], en: [],
      obj: 'Modelar el tambor donde se enrolla el hilo y calcular el par que necesita el motor.',
      tabla: { cab: ['Punto', 'Del eje (x)', 'Altura (y)'], filas: [['P1', 1, 0], ['P2', 12, 0], ['P3', 12, 2], ['P4', 5, 2], ['P5', 5, 22], ['P6', 12, 22], ['P7', 12, 24], ['P8', 1, 24]] },
      pasos: [['', 'Mide el eje de tu motor (los de juguete suelen tener Ø2 mm).'], ['Sketch', 'Body nuevo; croquis en XY: perfil cerrado con los 8 puntos de la tabla, a la derecha del eje vertical.'],
        ['Dimension', 'Acota hasta que quede verde.'], ['Revolution', 'Revolution 360° sobre Vertical sketch axis.'],
        ['', 'Calcula: si el hilo carga 5 N y se enrolla en r = 5 mm, τ = F · r = 5 N × 0.005 m = 0.025 N·m.']],
      revisa: ['Pestañas Ø24 de 2 mm, tambor Ø10 de 20 mm, barreno igual al eje de tu motor.', 'Cálculo del par con r en metros.'],
      errores: ['Usar el diámetro (10) como radio en τ = F · r: sale el doble.', 'Barreno más grande que el eje: el carrete patina.'],
      reto: '¿Y con un tambor de Ø20? r = 10 mm → τ = 0.05 N·m, el doble. Un tambor chico ayuda a un motor débil, pero enrolla más lento.',
      entrega: 'Captura y tu cálculo del par.' },
    { id: 'techdraw', t: 'Plano en TechDraw y PDF a escala 1:1', nivel: 2, min: 45, sm: ['II-2', 'II-3'], en: ['fc-plano', 'doc-grua'],
      obj: 'Sacar el plano de una pieza en primer diedro con cotas y cuadro de datos, y comprobar la escala impresa.',
      pasos: [['', 'Abre tu placa (o una pieza del proyecto) y cambia al banco TechDraw.'], ['Insert Default Page', 'Insert Default Page: hoja con cuadro de datos.'],
        ['Insert Projection Group', 'Selecciona el Body en el árbol → Insert Projection Group: Projection First angle, marca frente, superior y lateral, Scale 1:1.'],
        ['Dimension', 'Selecciona una arista → cota de longitud; un círculo → cota de diámetro. No repitas una cota en dos vistas.'],
        ['', 'Cuadro de datos: doble clic en los textos editables de la hoja (nombre, grupo, escala, material, fecha).'],
        ['Export Page as PDF', 'Export Page as PDF. Imprime al 100 % (tamaño real, sin «ajustar a la página»).'], ['', 'Mide con regla la cota de 80: si mide 80 mm en el papel, la escala está bien.']],
      revisa: ['Primer diedro: la superior va abajo del frente y la lateral izquierda a la derecha.', 'Todas las medidas necesarias, sin repetir.', 'Cuadro de datos lleno.', 'El 80 mide 80 mm impreso.'],
      errores: ['Imprimir con «ajustar a la página»: ya no es 1:1.', 'Tercer diedro sin darte cuenta: las vistas quedan al revés.', 'Cotas encima de la pieza: muévelas afuera.'],
      reto: 'Agrega una vista isométrica chica (Insert View) y la nota «Medidas en mm».',
      entrega: 'El PDF del plano.' },
    { id: 'resorte', t: 'Resorte de compresión (hélice)', nivel: 3, min: 30, sm: ['II-3'], en: [],
      obj: 'Usar Additive helix para barrer un círculo a lo largo de una hélice.',
      pasos: [['Sketch', 'Body nuevo; croquis en el plano XZ.'], ['Circle', 'Círculo Ø2 (el alambre) con centro sobre el eje horizontal a 10 mm del eje vertical.'],
        ['Additive helix', 'Cierra el croquis → Additive helix → Axis: Vertical sketch axis → Mode: Pitch-Height-Angle → Pitch 5, Height 40 → OK.'], ['', 'Cuenta las vueltas: 40 / 5 = 8.']],
      revisa: ['Diámetro medio 20 (radio 10 al centro del alambre).', 'Altura 40, paso 5, 8 vueltas.', 'Las vueltas no se tocan.'],
      errores: ['Círculo encima del eje: la hélice se cruza consigo misma y marca error.', 'Paso igual o menor que el alambre (2 mm): las vueltas se enciman.'],
      reto: 'Cambia el paso a 2 y explica en tu libreta qué pasa y por qué. Luego haz un resorte más duro: alambre Ø3 y diámetro medio 16.',
      entrega: 'Captura del resorte y tu explicación.' },
    { id: 'ensamble4b', t: 'Ensamble de cuatro barras que se mueve', nivel: 3, min: 50, sm: ['II-2'], en: ['fc-ensamble'],
      obj: 'Unir los eslabones con uniones giratorias en Assembly y comprobar Grashof arrastrando la manivela.',
      pasos: [['', 'Abre tus 4 eslabones (40, 80, 90 y 100) del reto del eslabón.'], ['Create Assembly', 'Archivo nuevo → banco Assembly → Create Assembly.'],
        ['Insert Component', 'Insert Component: agrega los 4 eslabones.'], ['Toggle Grounded', 'Selecciona el de 80 (la base) → Toggle Grounded: queda fijo.'],
        ['Revolute joint', 'Selecciona la orilla del barreno de la base y la del barreno de la manivela (40) → Revolute joint. Repite: manivela con acoplador (100), acoplador con balancín (90) y balancín con base.'],
        ['', 'Arrastra la manivela con el mouse: debe dar vueltas completas y el balancín solo ir y venir.']],
      revisa: ['Base fija.', 'Cuatro uniones Revolute.', 'La de 40 da la vuelta completa: 40 + 100 = 140 ≤ 80 + 90 = 170.'],
      errores: ['Seleccionar la cara en vez de la orilla circular del barreno: la unión queda en otro lugar.', 'Olvidar fijar la base: todo el ensamble flota.', 'Eslabones encimados: usa el Offset de la unión para separarlos 4 mm.'],
      reto: 'Cambia el acoplador por uno de 140 mm: 40 + 140 = 180 > 170. ¿Sigue dando vueltas? Compruébalo y anótalo en la bitácora.',
      entrega: 'Video corto o dos capturas del mecanismo en posiciones distintas.' },
    { id: 'explosionada', t: 'Vista explosionada con globos y lista de materiales', nivel: 3, min: 45, sm: ['II-2', 'II-3'], en: ['fc-plano'],
      obj: 'Separar las piezas del ensamble para mostrar cómo se arma, numerarlas con globos y hacer su lista de materiales.',
      pasos: [['', 'Abre tu ensamble (cuatro barras o tu proyecto).'], ['Create Exploded View', 'Create Exploded View: selecciona una pieza y arrastra la flecha para separarla en la dirección en que se arma. Repite con cada pieza.'],
        ['Create Bill of Materials', 'Create Bill of Materials: revisa nombre y cantidad de cada pieza.'],
        ['Insert Default Page', 'TechDraw: hoja nueva; selecciona la vista explosionada → Insert View (isométrica). Si tu versión no la acepta, toma captura y usa Insert Bitmap Image.'],
        ['Balloon', 'Insert Balloon: clic en la vista y luego en cada pieza; el número es el mismo de la lista.'],
        ['', 'Agrega la lista de materiales con Insert Spreadsheet View o como tabla en el cuadro.'], ['Export Page as PDF', 'Export Page as PDF.']],
      revisa: ['Cada pieza separada en la dirección en que se arma.', 'Globos con el mismo número que la lista.', 'Lista con número, pieza, cantidad y material.'],
      errores: ['Separar piezas al azar: no se entiende cómo se arma.', 'Globos que no coinciden con la lista.'],
      reto: 'Agrega a la lista los tornillos M3 y las tuercas (aunque no los modeles) con su cantidad total.',
      entrega: 'PDF con vista explosionada, globos y lista (es el producto de la actividad clave).' },
    { id: 'cilindro', t: 'Cilindro neumático de doble efecto', nivel: 3, min: 60, sm: ['II-3'], en: [],
      obj: 'Modelar camisa, tapas, émbolo y vástago, ensamblarlos con una unión deslizante y calcular su fuerza.',
      pasos: [['Revolution', 'Camisa: croquis en XY, rectángulo de x = 16 a 20 y de y = 0 a 100 → Revolution 360° sobre el eje vertical: tubo Ø40 / Ø32 × 100.'],
        ['Revolution', 'Émbolo y vástago en un solo Body: perfil (0,0) (16,0) (16,10) (6,10) (6,130) (0,130) → Revolution: émbolo Ø32 × 10 y vástago Ø12 × 120.'],
        ['Pad', 'Tapas: círculo Ø40 → Pad 5. La delantera con un círculo Ø12 adentro (paso del vástago).'],
        ['Create Assembly', 'Assembly: inserta camisa, dos tapas y émbolo. Fija la camisa con Toggle Grounded.'], ['Fixed joint', 'Una Fixed joint para cada tapa en su extremo de la camisa.'],
        ['Slider joint', 'Slider joint entre la orilla circular del émbolo y la orilla interior de la camisa. Arrástralo: debe ir y venir.'],
        ['', 'En la libreta: A = π·D²/4 = π·32²/4 ≈ 804 mm². A 6 bar (0.6 N/mm²): F ≈ 482 N al avanzar. Al regresar: A = π·(32² − 12²)/4 ≈ 691 mm² → F ≈ 415 N.']],
      revisa: ['Tubo Ø40 / Ø32 × 100.', 'Émbolo Ø32 × 10 y vástago Ø12 × 120.', 'El émbolo se desliza sin salirse.', 'F ≈ 482 N avance y 415 N retroceso.'],
      errores: ['Usar el radio como D en A = π·D²/4: la fuerza sale 4 veces más chica.', 'Olvidar restar el vástago al regresar.', 'Revolute en vez de Slider: el émbolo gira en vez de deslizarse.'],
      reto: '¿Qué presión necesitas para empujar 300 N con este cilindro? P = F / A = 300 / 804 ≈ 0.37 N/mm² ≈ 3.7 bar.',
      entrega: 'Captura del ensamble y tus cálculos.' }
  ];
  PR.forEach((p, i) => { p.ord = i; });

  /* glosario: herramienta (como aparece en FreeCAD en inglés) → nombre en español y para qué sirve */
  const GLOS = E.FC_GLOSARIO = [
    ['Part Design', 'Diseño de piezas', 'Banco para hacer piezas sólidas'], ['Body', 'Cuerpo', 'Contenedor de la pieza'], ['Sketch', 'Croquis', 'Dibujo 2D sobre un plano'],
    ['Rectangle · Circle · Arc', 'Rectángulo · Círculo · Arco', 'Geometría del croquis'], ['Polyline', 'Polilínea', 'Líneas seguidas; cierra en el punto inicial'], ['Slot', 'Ranura (croquis)', 'Contorno con extremos redondos'],
    ['Trim edge', 'Recortar arista', 'Borra el tramo que sobra'], ['Coincident', 'Coincidente', 'Une dos puntos'], ['Point on object', 'Punto sobre objeto', 'Pone un punto sobre una línea o eje'],
    ['Horizontal · Vertical', 'Horizontal · Vertical', 'Endereza líneas o alinea puntos'], ['Equal', 'Igualdad', 'Mismo tamaño'], ['Symmetric', 'Simetría', 'Dos puntos simétricos respecto a otro o a una línea'], ['Tangent', 'Tangente', 'Línea que toca un arco sin cortarlo'],
    ['Dimension', 'Cota', 'Distancia, radio o diámetro (en versiones viejas: Constrain distance, radius, diameter)'], ['Fully constrained', 'Totalmente restringido', 'El croquis ya no se mueve: se pone verde'],
    ['Pad', 'Pastilla (extrusión)', 'Le da espesor al croquis'], ['Pocket', 'Cajera (vaciado)', 'Quita material; Through all = pasado'], ['Symmetric to plane', 'Simétrico al plano', 'Extruye o corta hacia los dos lados'],
    ['Revolution', 'Revolución', 'Gira el croquis alrededor de un eje'], ['Fillet · Chamfer', 'Redondeo · Chaflán', 'Redondea o bisela aristas'], ['Polar pattern', 'Patrón polar', 'Repite una operación en círculo'],
    ['Additive helix', 'Hélice aditiva', 'Barre el croquis en espiral'], ['Involute gear', 'Engranaje de involuta', 'Asistente que dibuja el perfil del engrane'], ['Placement', 'Ubicación', 'Posición y giro de un objeto'],
    ['Assembly', 'Ensamble', 'Banco para unir piezas'], ['Insert Component', 'Insertar componente', 'Trae piezas al ensamble'], ['Toggle Grounded', 'Fijar', 'Deja una pieza fija'],
    ['Revolute · Slider · Fixed joint', 'Unión giratoria · deslizante · fija', 'Cómo se mueve una pieza respecto a otra'], ['Create Exploded View', 'Crear vista explosionada', 'Separa las piezas para ver cómo se arman'], ['Create Bill of Materials', 'Crear lista de materiales', 'Tabla de piezas y cantidades'],
    ['TechDraw', 'TechDraw', 'Banco de planos'], ['Insert Default Page', 'Insertar página predeterminada', 'Hoja con cuadro de datos'], ['Insert Projection Group', 'Insertar grupo de proyección', 'Frente, superior y lateral de una vez'],
    ['Balloon', 'Globo', 'Número que señala una pieza'], ['Export Page as PDF', 'Exportar página como PDF', 'Plano listo para imprimir']
  ];
  // nombre en español de cada herramienta que aparece en los pasos
  const ES = E.FC_ES = { Body: 'Cuerpo', Sketch: 'Croquis', Rectangle: 'Rectángulo', Circle: 'Círculo', Arc: 'Arco', Polyline: 'Polilínea', Slot: 'Ranura', 'Trim edge': 'Recortar arista',
    Coincident: 'Coincidente', Dimension: 'Cota', Pad: 'Pastilla', Pocket: 'Cajera', Fillet: 'Redondeo', 'Polar pattern': 'Patrón polar', Revolution: 'Revolución', 'Additive helix': 'Hélice aditiva',
    'Involute gear': 'Engranaje de involuta', Placement: 'Ubicación', 'Create Assembly': 'Crear ensamble', 'Insert Component': 'Insertar componente', 'Toggle Grounded': 'Fijar',
    'Revolute joint': 'Unión giratoria', 'Slider joint': 'Unión deslizante', 'Fixed joint': 'Unión fija', 'Create Exploded View': 'Vista explosionada', 'Create Bill of Materials': 'Lista de materiales',
    'Insert Default Page': 'Hoja predeterminada', 'Insert Projection Group': 'Grupo de proyección', Balloon: 'Globo', 'Export Page as PDF': 'Exportar como PDF', 'Ctrl+S': 'Guardar', 'Guardar como': 'Guardar como' };
  const chipTool = t => !t ? '' : '<span class="fc-tool">' + esc(t) + (ES[t] && ES[t] !== t ? ' <small>' + esc(ES[t]) + '</small>' : '') + '</span>';
  const NIV = { 1: 'Básico', 2: 'Intermedio', 3: 'Avanzado' };
  const smTxt = sm => sm.map(s => s === 'II-2' ? '2º parcial' : '3er parcial').join(' y ');

  const F = E.fc = {
    get: id => PR.find(p => p.id === id),
    // prácticas que son el centro de una actividad de Clases
    de: itId => PR.filter(p => p.en.indexOf(itId) >= 0),
    fig(p, o) {
      o = o || {}; const f = FIG[p.id](), svg = typeof f === 'string' ? f : f.svg;
      return '<figure class="fig pfig' + (o.cls ? ' ' + o.cls : '') + '"' + (f.ww ? ' style="--pf-ww:' + Math.round(f.ww * 10) / 10 + 'px"' : '') + '>' + svg + (o.sinPie ? '' : '<figcaption><b>' + esc(p.t) + '</b><span>Medidas en mm</span></figcaption>') + '</figure>';
    },
    tabla: p => !p.tabla ? '' : '<table class="fc-tabla"><thead><tr>' + p.tabla.cab.map(c => '<th>' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + p.tabla.filas.map(f => '<tr>' + f.map(c => '<td>' + esc(String(c)) + '</td>').join('') + '</tr>').join('') + '</tbody></table>',
    pasosHTML: (p, desde, hasta) => '<ol class="fc-pasos" start="' + ((desde || 0) + 1) + '">' + p.pasos.slice(desde || 0, hasta == null ? p.pasos.length : hasta).map(s => '<li>' + chipTool(s[0]) + '<span>' + esc(s[1]) + '</span></li>').join('') + '</ol>',
    // diapositivas para el proyector
    slides(p) {
      const s = [{ k: 'cover', h: p.t, sub: 'Práctica FreeCAD · Nivel ' + p.nivel + ' (' + NIV[p.nivel].toLowerCase() + ') · ~' + p.min + ' min', p: p.obj }];
      s.push({ k: 'html', h: 'Modela esta pieza', html: '<div class="pj-fc' + (p.tabla ? ' con-tabla' : '') + '">' + F.fig(p, { sinPie: true }) + F.tabla(p) + '</div>' });
      const n = p.pasos.length, por = n > 6 ? 3 : n > 4 ? 3 : n;
      for (let i = 0; i < n; i += por) s.push({ k: 'html', h: 'Pasos ' + (i + 1) + (Math.min(n, i + por) > i + 1 ? '–' + Math.min(n, i + por) : '') + ' de ' + n, html: '<div class="pj-2c"><div>' + F.pasosHTML(p, i, i + por) + '</div>' + F.fig(p, { sinPie: true, cls: 'chica' }) + '</div>' });
      s.push({ k: 'list', h: 'Revisa antes de entregar', items: p.revisa, foot: 'Entrega: ' + p.entrega });
      s.push({ k: 'list', h: 'Cuidado con…', items: p.errores });
      s.push({ k: 'vida', h: '¿Terminaste? Reto', p: p.reto });
      return s;
    },
    proyectar(id) { const p = F.get(id); if (p) E.proj.abrir({ id: 'fc-' + p.id, titulo: p.t }, F.slides(p)); },
    // hechas a mano (doc fcp:{grupo}) y las que ya tocaron en una clase pasada
    estado(g) {
      const out = {}; if (!g) return out; const man = S.get('fcp:' + g.id) || {}, hoy = u.today();
      try {
        D.parciales().forEach(pa => {
          if (!E.CLASES[E.clases.smKey(g, pa.id)]) return;
          E.clases.plan(g, pa.id).bloques.forEach(b => { if (b.perdida || b.fecha >= hoy) return; b.parts.forEach(pt => F.de(pt.it.id).forEach(p => { if (!out[p.id]) out[p.id] = { f: b.fecha, auto: true }; })); });
        });
      } catch (e) { }
      S.keys('fcal:' + g.id + ':').forEach(k => { const d = S.get(k) || {}; Object.keys(d.fechas || {}).forEach(aid => { const fe = d.fechas[aid] || {}; Object.keys(fe).forEach(id => { if (!out[id] || out[id].auto) out[id] = { f: fe[id], auto: false, rev: true }; else if (fe[id] < out[id].f) out[id].f = fe[id]; }); }); });
      Object.keys(man).forEach(id => { if (man[id]) out[id] = { f: man[id], auto: false }; });
      return out;
    },
    siguientes(g, sm, quitar, n) {
      const est = F.estado(g);
      return PR.filter(p => p.sm.indexOf(sm) >= 0 && !est[p.id] && quitar.indexOf(p.id) < 0).sort((a, b) => a.nivel - b.nivel || a.ord - b.ord).slice(0, n || 3);
    },
    // en el guion del día, para los bloques de centro de cómputo
    bloqueHTML(g, pid, b, delDia) {
      const sm = E.clases.smKey(g, pid), hoy = [];
      (delDia || [b]).forEach(bb => bb.parts.forEach(pt => F.de(pt.it.id).forEach(p => { if (hoy.indexOf(p.id) < 0) hoy.push(p.id); })));
      const sig = F.siguientes(g, sm, hoy, 3), aco = b === (delDia || [b]).filter(x => x.lugar === 'computo')[0] ? F.acomodoHTML(g, b.fecha) : '';
      if (!sig.length) return aco;
      return aco + '<div class="fc-blq"><b>💻 Si terminan antes: más prácticas de FreeCAD</b><p class="small muted">Las que este grupo todavía no hace, de la más fácil a la más difícil.</p>' +
        sig.map(p => fila(p)).join('') + '<div class="mt">' + link('Ver las ' + PR.length + ' prácticas', 'freecad', 'small') + '</div></div>';
    }
  };
  const fila = p => { const r = (S.get('fcprep') || {})[p.id];
    return '<div class="fc-fila"><span class="chip">N' + p.nivel + '</span><a href="#/freecad/' + p.id + '">' + esc(p.t) + '</a><span class="muted small">~' + p.min + ' min' + (r && r.min ? ' · tú: ' + r.min + ' min' : '') + '</span>' + btn('📽 Proyectar', 'fc-proj', 'data-id="' + p.id + '"', 'small ghost') + link('✅ Revisar', 'freecad/' + p.id + '/revisar', 'small ghost') + '</div>' + (r && r.nota ? '<p class="small fc-tip">🧑‍🏫 Donde tú te atoraste: ' + esc(r.nota) + '</p>' : ''); };
  F.fila = fila;

  /* =================== vistas =================== */
  const CONSEJOS = [
    ['Yo modelo, tú modelas', 'Proyecta tu FreeCAD y avanza un paso a la vez: lo haces tú, lo repiten ellos y levantan la mano cuando lo tienen. Sigues hasta que la mayoría lo tenga.'],
    ['Deja el plano a la vista', 'Mientras trabajan, deja proyectada la diapositiva del plano o de los pasos; la hoja impresa sirve a quien va más lento.'],
    ['Monitores', 'Quien termina ayuda a dos compañeros con las manos atrás: explica, pero no toca el mouse del otro.'],
    ['Tres antes que yo', 'Antes de preguntarte, revisan el paso en el proyector, la hoja y a un compañero. Tú atiendes lo que nadie pudo resolver.'],
    ['Guarda seguido', 'Ctrl + S cada 10 minutos, nombre Apellido_Practica.FCStd en la carpeta del grupo; copia en USB o en la nube al final.'],
    ['Evidencia rápida', 'Captura de pantalla (Windows: Win + Shift + S) con la pieza y el árbol visibles; se entrega con el archivo.'],
    ['Si algo sale rojo', 'Ctrl + Z, revisa en el árbol qué operación tiene el signo de error y vuelve a abrir su croquis.'],
    ['FreeCAD en español', 'Los íconos son los mismos; el glosario de abajo dice cómo se llama cada herramienta en español.']
  ];
  V.freecad = (id, sub, pid) => {
    const g = D.grupoActual();
    if (id && sub === 'revisar') { const p = F.get(id); if (!g) return H.noGroup(); if (p) return revisar(g, p, pid); }
    if (id) return detalle(g, id);
    const est = F.estado(g), rv = {};
    if (g) S.keys('fcal:' + g.id + ':').forEach(k => { const d = S.get(k) || {}; Object.keys(d.marcas || {}).forEach(aid => Object.keys(d.marcas[aid] || {}).forEach(id => { rv[id] = (rv[id] || 0) + 1; })); });
    let h = card('<h3>💻 Prácticas de FreeCAD</h3><p class="muted small">' + PR.length + ' prácticas para el centro de cómputo, cada una con su plano acotado, pasos con el nombre de la herramienta, qué revisar, errores comunes y un reto para quien termina antes. Proyéctalas, imprímelas o márcalas cuando el grupo las termine. Pensadas para FreeCAD 1.0 o más nuevo.</p>' +
      '<div class="row gap wrap">' + btn('🖨 Imprimir cuadernillo (todas)', 'fc-print-all', '', '') + btn('🖨 Solo 2º parcial', 'fc-print-all', 'data-sm="II-2"', 'ghost') + btn('🖨 Solo 3er parcial', 'fc-print-all', 'data-sm="II-3"', 'ghost') + '</div>');
    [1, 2, 3].forEach(n => {
      h += '<h4 class="cl-sem">Nivel ' + n + ' · ' + NIV[n] + '</h4><div class="fc-grid">' + PR.filter(p => p.nivel === n).map(p => {
        const e = est[p.id];
        return '<section class="card fc-card' + (e ? ' hecha' : '') + '"><a class="fc-mini" href="#/freecad/' + p.id + '">' + F.fig(p, { sinPie: true }) + '</a><div class="fc-info"><a href="#/freecad/' + p.id + '"><b>' + esc(p.t) + '</b></a>' +
          '<div class="row gap wrap"><span class="chip">~' + p.min + ' min</span><span class="chip">' + esc(smTxt(p.sm)) + '</span>' + (e ? '<span class="chip ok">✓ ' + (e.auto ? 'en clase ' : '') + esc(u.fCorta(e.f)) + '</span>' : '') + (rv[p.id] ? '<span class="chip">' + rv[p.id] + ' revisados</span>' : '') + ((S.get('fcprep') || {})[p.id] ? '<span class="chip">tú: ' + S.get('fcprep')[p.id].min + ' min</span>' : '') + '</div>' +
          '<div class="row gap wrap mt">' + btn('📽 Proyectar', 'fc-proj', 'data-id="' + p.id + '"', 'small primary') + link('Ver', 'freecad/' + p.id, 'small') + '</div></div></section>';
      }).join('') + '</div>';
    });
    h += card('<details data-sec="fc-tips"><summary><b>Consejos para el centro de cómputo</b></summary><ul class="fc-tips">' + CONSEJOS.map(c => '<li><b>' + esc(c[0]) + ':</b> ' + esc(c[1]) + '</li>').join('') + '</ul><p class="muted small">Basado en los principios de instrucción de Rosenshine (2012): modelar paso a paso, práctica guiada, revisar que todos entiendan y luego práctica independiente.</p></details>');
    h += card('<details data-sec="fc-glos"><summary><b>Glosario: herramientas en inglés y en español</b></summary><table class="fc-glos"><thead><tr><th>En FreeCAD</th><th>En español (puede variar)</th><th>Para qué</th></tr></thead><tbody>' + GLOS.map(r => '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>').join('') + '</tbody></table></details>');
    h += '<p class="muted small">Fuentes: documentación oficial de FreeCAD (wiki, Part Design, Sketcher, Assembly y TechDraw de la versión 1.0); fórmulas de los Temas de la app.</p>';
    return { t: 'FreeCAD', h: h };
  };
  function detalle(g, id) {
    const p = F.get(id); if (!p) return { t: 'FreeCAD', h: card('<p>No encontré esa práctica.</p>' + link('Ver todas', 'freecad', 'primary')) };
    const e = F.estado(g)[p.id], man = g && (S.get('fcp:' + g.id) || {})[p.id];
    let h = card('<div class="row gap wrap"><span class="chip brand">Nivel ' + p.nivel + ' · ' + NIV[p.nivel] + '</span><span class="chip">~' + p.min + ' min</span><span class="chip">' + esc(smTxt(p.sm)) + '</span>' + (e ? '<span class="chip ok">✓ ' + (e.auto ? 'Vista en clase el ' : 'Hecha el ') + esc(u.fCorta(e.f)) + '</span>' : '') + '</div>' +
      '<h3 class="mt">' + esc(p.t) + '</h3><p>' + esc(p.obj) + '</p>' + F.fig(p) + F.tabla(p) +
      '<div class="row gap wrap mt">' + btn('📽 Proyectar práctica', 'fc-proj', 'data-id="' + p.id + '"', 'primary') + btn('🖨 Imprimir hoja', 'fc-print', 'data-id="' + p.id + '"') +
      (g ? link('✅ Revisar por alumno', 'freecad/' + p.id + '/revisar', '') + btn(man ? '↺ Quitar «hecha»' : '✓ El grupo ya la hizo', 'fc-hecha', 'data-id="' + p.id + '"', man ? 'ghost' : '') : '') + link('Todas las prácticas', 'freecad', 'ghost') + '</div>');
    h += prepCard(p);
    h += card('<h3>Pasos</h3>' + F.pasosHTML(p));
    h += '<div class="grid2">' + card('<h3>Revisa antes de entregar</h3><ul>' + p.revisa.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><p class="small"><b>Entrega:</b> ' + esc(p.entrega) + '</p>') +
      card('<h3>Errores comunes</h3><ul>' + p.errores.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>') + '</div>';
    h += card('<h3>¿Terminaste? Reto</h3><p>' + esc(p.reto) + '</p>', 'accent');
    if (p.en.length && g) {
      const its = []; D.parciales().forEach(pa => { const L = E.CLASES[E.clases.smKey(g, pa.id)]; if (L) L.forEach(it => { if (p.en.indexOf(it.id) >= 0) its.push(it); }); });
      if (its.length) h += card('<h3>En tus clases</h3><p class="small">Es la práctica central de: ' + its.map(it => '<b>' + esc(it.t) + '</b>').join(', ') + '. Aparece en el guion del día con su botón para proyectar.</p>');
    }
    h += '<p class="muted small">Herramientas con su nombre de FreeCAD 1.0 en inglés; en el glosario de la lista de prácticas está su nombre en español. Fuente: documentación oficial de FreeCAD.</p>';
    return { t: 'Práctica FreeCAD', h: h };
  }

  /* =================== revisión por alumno (✓ ½ ✗) → Libreta / Proyecto / Bitácora =================== */
  const KF = (g, pid) => 'fcal:' + g.id + ':' + pid;
  const MARK = { 2: ['✓', 'Completa', 'ok'], 1: ['½', 'A medias', 'warn'], 0: ['✗', 'No la hizo', 'bad'] };
  const corto = n => { const p = String(n).split(' '); return p.length >= 3 ? u.cap(p[p.length - 2].toLowerCase()) + ' ' + u.cap(p[0].toLowerCase()) : n; };
  const presentes = (g, f) => { const doc = S.get('asis:' + g.id + ':' + f); return D.alumnos(g).filter(a => !doc || ['A', 'R'].indexOf(doc[a.id] || 'A') >= 0); };
  F.rev = (g, pid) => S.get(KF(g, pid)) || {};
  // calificación de prácticas de un alumno en un parcial: promedio de las que ya tienen marca (las pendientes no cuentan)
  F.calif = (g, pid, aid, doc) => {
    doc = doc || F.rev(g, pid); const m = (doc.marcas || {})[aid] || {}, orden = doc.orden || [], ids = orden.filter(id => m[id] != null);
    if (!ids.length) return { v: null, n: 0, pend: orden.length, ok: 0 };
    return { v: Math.round(ids.reduce((a, id) => a + Number(m[id]), 0) / (2 * ids.length) * 100), n: ids.length, pend: orden.length - ids.length, ok: ids.filter(id => Number(m[id]) === 2).length };
  };
  // crea (la primera vez) y mantiene al día la actividad «Prácticas de FreeCAD» del parcial
  F.sync = (g, pid) => {
    const doc = F.rev(g, pid); if (!(doc.orden || []).length) return false;
    let id = doc.actId, creada = false;
    if (!id || !S.get('act:' + g.id + ':' + id)) {
      const p = C.parcial(pid); id = u.uid('act'); creada = true;
      S.put('act:' + g.id + ':' + id, { id: id, parcial: pid, categoria: 'trabajos', nombre: 'Prácticas de FreeCAD', peso: 1, max: 100, fecha: p.fin, instrumento: 'LC', cuenta: true, notas: {}, freecad: true }, { silent: true });
      S.update(KF(g, pid), d => { d.actId = id; }, {});
    }
    const k = 'act:' + g.id + ':' + id, a = S.get(k), d2 = F.rev(g, pid), notas = {};
    D.alumnos(g).forEach(x => { const r = F.calif(g, pid, x.id, d2); notas[x.id] = r.v == null ? '' : r.v; });
    const n = d2.orden.length, nombre = 'Prácticas de FreeCAD (' + n + (n === 1 ? ' práctica' : ' prácticas') + ')';
    if (JSON.stringify(a.notas || {}) !== JSON.stringify(notas) || a.nombre !== nombre) S.update(k, x => { x.notas = notas; x.nombre = nombre; });
    return creada;
  };
  // nivel FreeCAD: el más alto en el que tiene al menos una práctica completa
  F.nivelAlumno = (g, aid) => {
    const cnt = { 1: { ok: 0, med: 0 }, 2: { ok: 0, med: 0 }, 3: { ok: 0, med: 0 } }, hechas = [];
    S.keys('fcal:' + g.id + ':').forEach(k => { const d = S.get(k) || {}, m = (d.marcas || {})[aid] || {}, fe = (d.fechas || {})[aid] || {}; Object.keys(m).forEach(id => { const p = F.get(id); if (!p) return; const v = Number(m[id]); if (v === 2) cnt[p.nivel].ok++; else if (v === 1) cnt[p.nivel].med++; hechas.push({ p: p, v: v, f: fe[id] }); }); });
    let n = 0; [1, 2, 3].forEach(x => { if (cnt[x].ok) n = x; });
    const pts = [1, 2, 3].reduce((s, x) => s + x * (cnt[x].ok + cnt[x].med / 2), 0);
    return { n: n, cnt: cnt, hechas: hechas.sort((a, b) => String(a.f || '').localeCompare(String(b.f || ''))), hay: hechas.length > 0, pts: pts };
  };
  // acomodo para el centro de cómputo: quién necesita monitor y quién puede serlo
  F.acomodoHTML = (g, f) => {
    const al = presentes(g, f); if (!al.length) return '';
    const nv = al.map(a => ({ a: a, r: F.nivelAlumno(g, a.id) })); if (!nv.some(x => x.r.hay)) return '';
    const apoyo = nv.filter(x => x.r.n === 0 && x.r.hay), mon = nv.filter(x => x.r.pts > 0).sort((a, b) => b.r.pts - a.r.pts).slice(0, Math.max(2, Math.min(5, Math.ceil(apoyo.length / 2))));
    if (!apoyo.length && !mon.length) return '';
    return '<div class="fc-blq"><b>🪑 Acomodo sugerido</b><p class="small muted">Según las prácticas que ya les revisaste.</p>' +
      (apoyo.length ? '<p class="small"><b>Junto a un monitor</b> (aún sin práctica completa): ' + apoyo.slice(0, 10).map(x => '<a href="#/alumno/' + x.a.id + '">' + esc(corto(x.a.nombre)) + '</a>').join(', ') + (apoyo.length > 10 ? ' y ' + (apoyo.length - 10) + ' más' : '') + '</p>' : '<p class="small">Todos tienen al menos una práctica completa. 👏</p>') +
      (mon.length ? '<p class="small"><b>Posibles monitores:</b> ' + mon.map(x => '<a href="#/alumno/' + x.a.id + '">' + esc(corto(x.a.nombre)) + '</a> (N' + x.r.n + ')').join(', ') + '</p>' : '') + '</div>';
  };
  F.alumnoHTML = (g, a) => {
    const r = F.nivelAlumno(g, a.id); if (!r.hay) return '';
    return card('<h3>💻 FreeCAD · ' + (r.n ? 'Nivel ' + r.n + ' (' + NIV[r.n].toLowerCase() + ')' : 'todavía sin práctica completa') + '</h3><p class="small">' + [1, 2, 3].map(n => 'Nivel ' + n + ': ' + r.cnt[n].ok + ' ✓' + (r.cnt[n].med ? ', ' + r.cnt[n].med + ' ½' : '')).join(' · ') + '</p>' +
      '<ul class="small fc-hechas">' + r.hechas.map(x => '<li><span class="' + MARK[x.v][2] + 'c">' + MARK[x.v][0] + '</span> <a href="#/freecad/' + x.p.id + '">' + esc(x.p.t) + '</a>' + (x.f ? ' <span class="muted">' + u.fCorta(x.f) + '</span>' : '') + '</li>').join('') + '</ul>');
  };
  function revisar(g, p, pid) {
    const al = D.alumnos(g); if (!al.length) return H.needAlumnos('Revisar práctica');
    const ps = D.parciales(); pid = ps.some(x => x.id === pid) ? pid : C.parcialActual().id; const pa = C.parcial(pid);
    const doc = F.rev(g, pid), m = doc.marcas || {}, asis = S.get('asis:' + g.id + ':' + u.today());
    const cnt = { 2: 0, 1: 0, 0: 0, p: 0 }; al.forEach(a => { const v = (m[a.id] || {})[p.id]; if (v == null) cnt.p++; else cnt[v]++; });
    let h = '<div class="filters">' + ps.map(x => '<a class="tab ' + (x.id === pid ? 'on' : '') + '" href="#/freecad/' + p.id + '/revisar/' + x.id + '">' + esc(x.nombre) + '</a>').join('') + '</div>';
    h += card('<h3>✅ Revisar: ' + esc(p.t) + '</h3><p class="muted small">' + esc(pa.nombre) + ' · ✓ completa (100) · ½ a medias (50) · ✗ no la hizo (0). Lo que no marques queda pendiente y todavía no cuenta.</p>' +
      '<p class="small"><b>' + cnt[2] + '</b> ✓ · <b>' + cnt[1] + '</b> ½ · <b>' + cnt[0] + '</b> ✗ · <b>' + cnt.p + '</b> pendientes</p>' +
      '<ul class="fc-rev">' + al.map(a => { const v = (m[a.id] || {})[p.id], falto = asis && ['A', 'R'].indexOf(asis[a.id] || 'A') < 0;
        return '<li><span class="fc-al">' + a.num + '. ' + esc(a.nombre) + (falto ? ' <span class="chip">faltó hoy</span>' : '') + '</span><div class="cl-seg">' + [2, 1, 0].map(x => btn(MARK[x][0], 'fc-marca', 'data-id="' + p.id + '" data-pid="' + pid + '" data-aid="' + a.id + '" data-v="' + x + '" aria-label="' + MARK[x][1] + '" title="' + MARK[x][1] + '"', 'small' + (v != null && Number(v) === x ? ' on ' + MARK[x][2] : ''))).join('') + (E.retro ? btn('💬', 'rt-open', 'data-aid="' + a.id + '" data-ctx="practica" data-ref="' + p.id + '" aria-label="Retroalimentación" title="Retroalimentación"', 'small ghost') : '') + '</div></li>'; }).join('') + '</ul>' +
      '<div class="row gap wrap mt">' + (cnt.p && cnt.p < al.length ? btn('Pasar pendientes a ✗', 'fc-pend', 'data-id="' + p.id + '" data-pid="' + pid + '"', 'small ghost danger') : '') + link('‹ Volver a la práctica', 'freecad/' + p.id, 'small ghost') + '</div>');
    const a = doc.actId && S.get('act:' + g.id + ':' + doc.actId);
    h += card('<h3>📊 A Calificaciones</h3>' + (a ? '<p class="small">Entra sola a <a href="#/actividad/' + a.id + '">' + esc(a.nombre) + '</a> (Libreta / Proyecto / Bitácora): el promedio de las prácticas ya marcadas de cada alumno en el ' + esc(pa.nombre) + '.</p>' : '<p class="small">Con la primera marca se crea sola la actividad «Prácticas de FreeCAD» en Libreta / Proyecto / Bitácora (' + D.cfg().pond.trabajos + '%).</p>') +
      ((doc.orden || []).length ? '<p class="small muted">Cuentan en este parcial: ' + doc.orden.map(id => esc((F.get(id) || {}).t || id)).join(', ') + '.</p>' : ''));
    return { t: 'Revisar práctica', h: h };
  }
  A['fc-marca'] = el => {
    const g = D.grupoActual(), pid = el.dataset.pid, id = el.dataset.id, aid = el.dataset.aid, v = Number(el.dataset.v);
    S.update(KF(g, pid), d => {
      d.marcas = d.marcas || {}; d.fechas = d.fechas || {}; d.orden = d.orden || [];
      const m = d.marcas[aid] = d.marcas[aid] || {}, fe = d.fechas[aid] = d.fechas[aid] || {};
      if (m[id] != null && Number(m[id]) === v) { delete m[id]; delete fe[id]; } else { m[id] = v; fe[id] = u.today(); }
      if (d.orden.indexOf(id) < 0) d.orden.push(id);
      if (!Object.keys(d.marcas).some(x => d.marcas[x][id] != null)) d.orden = d.orden.filter(x => x !== id);
    }, {});
    if (F.sync(g, pid)) u.toast('Creé la actividad «Prácticas de FreeCAD» en Libreta / Proyecto / Bitácora', 'ok', 4500);
  };
  A['fc-pend'] = el => {
    const g = D.grupoActual(), pid = el.dataset.pid, id = el.dataset.id;
    if (!confirm('Los alumnos sin marca quedarán con ✗ (no la entregaron). ¿Continuar?')) return;
    S.update(KF(g, pid), d => { d.marcas = d.marcas || {}; d.fechas = d.fechas || {}; D.alumnos(g).forEach(a => { const m = d.marcas[a.id] = d.marcas[a.id] || {}; if (m[id] == null) { m[id] = 0; (d.fechas[a.id] = d.fechas[a.id] || {})[id] = u.today(); } }); }, {});
    F.sync(g, pid);
  };

  /* =================== prepara tu clase: hazla tú primero y mide tu tiempo =================== */
  const KT = 'escuadra.fcTimer';
  const timer = () => { try { return JSON.parse(localStorage.getItem(KT) || 'null'); } catch (e) { return null; } };
  const setTimer = t => { try { if (t) localStorage.setItem(KT, JSON.stringify(t)); else localStorage.removeItem(KT); } catch (e) { } };
  const mmss = ms => { const s = Math.max(0, Math.floor(ms / 1000)); return Math.floor(s / 60) + ':' + u.pad(s % 60); };
  setInterval(() => { const el = document.getElementById('fc-crono'); if (el) el.textContent = mmss(Date.now() - Number(el.dataset.t0)); }, 1000);
  const prep = () => S.get('fcprep') || {};
  const estima = (p, r) => '<p class="note ' + (2 * r.min > p.min ? 'warn' : 'ok') + ' small">La hiciste en <b>' + r.min + ' min</b> (' + u.fCorta(r.f) + '). Para el grupo calcula ~' + 2 * r.min + '–' + 3 * r.min + ' min' +
    (2 * r.min > p.min ? ': más de los ~' + p.min + ' planeados. Deja el reto como opcional o divídela en dos clases.' : ', dentro de lo planeado (~' + p.min + ').') + (r.nota ? '<br>Dónde te atoraste: ' + esc(r.nota) + ' (avísales antes de ese paso).' : '') + '</p>';
  function prepCard(p) {
    const r = prep()[p.id], t = timer(), corre = t && t.id === p.id;
    return card('<h3>🧑‍🏫 Hazla tú primero</h3><p class="small muted">Modelarla antes que el grupo te muestra dónde se van a atorar. Mide tu tiempo: a ellos les tomará de 2 a 3 veces más.</p>' + (r && r.min ? estima(p, r) : '') +
      '<div class="row gap wrap">' + (corre ? '<span class="fc-crono" id="fc-crono" data-t0="' + t.t0 + '">' + mmss(Date.now() - t.t0) + '</span>' + btn('⏹ Terminé', 'fc-crono-fin', 'data-id="' + p.id + '"', 'primary') + btn('Cancelar', 'fc-crono-x', '', 'ghost') : btn('⏱ Empezar cronómetro', 'fc-crono-ini', 'data-id="' + p.id + '"', r ? '' : 'primary')) + '</div>' +
      '<details class="sub"' + (r ? '' : ' open') + '><summary>Escribir mis minutos y dónde me atoré</summary><div class="row gap wrap"><label class="fld"><span>Minutos</span><input id="fc-min" type="number" min="1" max="600" inputmode="numeric" value="' + (r && r.min ? r.min : '') + '" style="max-width:110px"></label><label class="fld grow"><span>¿Dónde te atoraste?</span><input id="fc-nota" value="' + esc((r && r.nota) || '') + '" placeholder="Ej. la simetría del canal"></label></div>' + btn('Guardar', 'fc-prep-save', 'data-id="' + p.id + '"', 'small') + '</details>');
  }
  const guardaPrep = (id, min, nota) => S.update('fcprep', d => { d[id] = { min: min, f: u.today(), nota: nota == null ? ((d[id] || {}).nota || '') : nota }; }, {});
  A['fc-crono-ini'] = el => { setTimer({ id: el.dataset.id, t0: Date.now() }); E.render(); };
  A['fc-crono-x'] = () => { setTimer(null); E.render(); };
  A['fc-crono-fin'] = el => { const t = timer(); if (!t) return; const min = Math.max(1, Math.round((Date.now() - t.t0) / 60000)), nt = document.getElementById('fc-nota'); setTimer(null); guardaPrep(el.dataset.id, min, nt && nt.value.trim() ? nt.value.trim() : null); u.toast('Guardado: ' + min + ' min', 'ok'); };
  A['fc-prep-save'] = el => { const min = Number((document.getElementById('fc-min') || {}).value), nota = ((document.getElementById('fc-nota') || {}).value || '').trim(); if (!(min > 0)) { u.toast('Escribe los minutos', 'err'); return; } guardaPrep(el.dataset.id, Math.round(min), nota); u.toast('Guardado', 'ok'); };
  // tarjeta de Inicio: desde 2 días antes de cada clase en centro de cómputo
  F.preparaHTML = (g, hoy) => {
    for (let i = 0; i <= 2; i++) {
      const f = u.addDays(hoy, i); if (!C.esClase(g, f)) continue;
      let d = null; try { d = E.clases.dia(g, f); } catch (e) { d = null; }
      const bs = d ? d.bloques.filter(b => !b.perdida && b.lugar === 'computo') : []; if (!bs.length) continue;
      let ids = []; bs.forEach(b => b.parts.forEach(pt => F.de(pt.it.id).forEach(p => { if (ids.indexOf(p.id) < 0) ids.push(p.id); })));
      const extra = !ids.length; if (extra) ids = F.siguientes(g, E.clases.smKey(g, d.p.id), [], 2).map(p => p.id);
      if (!ids.length) return '';
      const pr = prep(), falt = ids.filter(id => !pr[id]), cuando = i === 0 ? 'hoy' : i === 1 ? 'mañana' : u.fLarga(f);
      return card('<h3>🧑‍🏫 Prepara tu clase de cómputo · ' + esc(cuando) + '</h3><p class="small muted">' + (extra ? 'Ese día modelan sus piezas; estas son las que les sugiero si terminan antes. ' : '') + 'Hazla tú primero y mide cuánto tardas: a ellos les tomará de 2 a 3 veces más.</p>' +
        ids.map(id => { const p = F.get(id), r = pr[id]; return '<div class="fc-fila"><span class="chip ' + (r ? 'ok' : 'warn') + '">' + (r ? '✓ ' + r.min + ' min' : '⏳ pendiente') + '</span><a href="#/freecad/' + id + '">' + esc(p.t) + '</a><span class="muted small">' + (r ? 'grupo ~' + 2 * r.min + '–' + 3 * r.min + ' min' : 'planeada ~' + p.min + ' min') + '</span>' + (r ? '' : link('Hazla tú', 'freecad/' + id, 'small primary')) + '</div>'; }).join('') +
        link('Ver el guion', 'clase/' + f, 'small'), falt.length ? 'accent' : '');
    }
    return '';
  };

  /* ---------- impresión: hoja de práctica ---------- */
  const hoja = p => '<div class="pr pfh"><div class="pfh-top"><span>PRÁCTICA DE FREECAD · NIVEL ' + p.nivel + ' (' + NIV[p.nivel].toUpperCase() + ') · ~' + p.min + ' MIN</span><span>Nombre: ________________________________ Grupo: ______ Fecha: ________</span></div>' +
    '<h2>' + esc(p.t) + '</h2><p class="pfh-obj">' + esc(p.obj) + '</p><div class="pfh-fig' + (p.tabla ? ' con-tabla' : '') + '">' + F.fig(p, { sinPie: true }) + F.tabla(p) + '</div><p class="tiny">Medidas en mm.</p>' +
    '<h3>Pasos</h3>' + F.pasosHTML(p) +
    '<div class="pfh-cols"><div><h3>Revisa (marca ✓)</h3><ul class="pfh-chk">' + p.revisa.map(x => '<li>☐ ' + esc(x) + '</li>').join('') + '</ul></div><div><h3>Cuidado con…</h3><ul>' + p.errores.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div></div>' +
    '<h3>Reto</h3><p>' + esc(p.reto) + '</p><p><b>Entrega:</b> ' + esc(p.entrega) + '</p></div>';
  A['fc-print'] = el => { const p = F.get(el.dataset.id); if (p) E.print.run(hoja(p), { title: 'Práctica FreeCAD · ' + p.t, margin: '10mm' }); };
  A['fc-print-all'] = el => { const sm = el.dataset.sm, ps = PR.filter(p => !sm || p.sm.indexOf(sm) >= 0).sort((a, b) => a.nivel - b.nivel || a.ord - b.ord); E.print.run(ps.map(hoja).join(''), { title: 'Prácticas de FreeCAD', margin: '10mm' }); };
  A['fc-proj'] = el => F.proyectar(el.dataset.id);
  A['fc-hecha'] = el => {
    const g = D.grupoActual(); if (!g) return; const id = el.dataset.id; let ya = false;
    S.update('fcp:' + g.id, d => { if (d[id]) { delete d[id]; ya = true; } else d[id] = u.today(); }, {});
    u.toast(ya ? 'Quitada' : 'Marcada como hecha: ya no se sugiere en «Si terminan antes»', 'ok', 3500);
  };

  /* =================== ejercicios del banco para proyectar =================== */
  const LET = ['A', 'B', 'C', 'D', 'E'];
  const mezcla = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = b[i]; b[i] = b[j]; b[j] = t; } return b; };
  E.ejer = {
    items: tid => (E.BANCO || []).filter(b => b.tema === tid),
    // una pregunta del banco lista para el proyector (rnd: azar con semilla para que salga igual todo el día)
    pregunta(b, rnd) {
      rnd = rnd || Math.random;
      const mk = (q, op, a) => { const ord = op.map((v, j) => j); for (let i = ord.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = ord[i]; ord[i] = ord[j]; ord[j] = t; } return { q: q, opts: ord.map(j => op[j]), ok: ord.indexOf(0), a: a }; };
      if (b.tipo === 'calc') { const gx = E.GEN[b.gen](rnd); return mk(gx.q, gx.op, gx.r); }
      if (b.tipo === 'vf') return { q: b.q, opts: ['Verdadero', 'Falso'], ok: b.v ? 0 : 1, a: b.exp || '' };
      if (b.tipo === 'ab') return { q: b.q, opts: null, a: 'Respuesta modelo: ' + b.r };
      return mk(b.q, b.op, b.exp || '');
    },
    hay: tid => E.ejer.items(tid).length,
    slides(tid) {
      const t = (E.TEMAS || []).find(x => x.id === tid), its = E.ejer.items(tid).slice().sort((a, b) => a.niv - b.niv), qs = [];
      its.forEach(b => {
        if (b.tipo === 'calc') {
          const g1 = E.GEN[b.gen](Math.random); let g2 = E.GEN[b.gen](Math.random), k = 0; while (g2.q === g1.q && k++ < 8) g2 = E.GEN[b.gen](Math.random);
          qs.push({ et: 'Lo resolvemos juntos', q: g1.q, op: g1.op, a: g1.r }); qs.push({ et: 'Ahora tú', q: g2.q, op: g2.op, a: g2.r });
        } else if (b.tipo === 'vf') qs.push({ et: 'Verdadero o falso', q: b.q, opts: ['Verdadero', 'Falso'], ok: b.v ? 0 : 1, a: b.exp || '' });
        else if (b.tipo === 'ab') qs.push({ et: 'Contesta en tu libreta', q: b.q, a: 'Respuesta modelo: ' + b.r });
        else qs.push({ et: E.BANCO_NIV[b.niv] || 'Opción múltiple', q: b.q, op: b.op, a: b.exp || '' });
      });
      const n = qs.length;
      const s = [{ k: 'cover', h: 'Ejercicios: ' + (t ? t.titulo : tid), sub: n + ' ejercicios · práctica de recuperación', p: 'Contesta en tu libreta antes de ver la respuesta. Al final cuentas tus aciertos.' }];
      qs.forEach((x, i) => {
        let opts = x.opts, ok = x.ok;
        if (!opts && x.op) { const ord = mezcla(x.op.map((v, j) => j)); opts = ord.map(j => x.op[j]); ok = ord.indexOf(0); }
        s.push({ k: 'q', h: 'Ejercicio ' + (i + 1) + ' de ' + n + ' · ' + x.et, q: x.q, opts: opts || null, ok: ok, a: x.a });
      });
      s.push({ k: 'vida', h: '¿Cuántas acertaste?', p: 'Anota en tu libreta: aciertos de ' + n + ' y cuál te costó más. Esa es la que repasas hoy.' });
      return s;
    },
    abrir(tid) { if (!E.ejer.hay(tid)) { u.toast('Este tema todavía no tiene ejercicios en el banco', 'err'); return; } const t = (E.TEMAS || []).find(x => x.id === tid); E.proj.abrir({ id: 'ej-' + tid, titulo: 'Ejercicios: ' + (t ? t.titulo : tid) }, E.ejer.slides(tid)); }
  };
  A['ej-proj'] = el => E.ejer.abrir(el.dataset.id);
})();
