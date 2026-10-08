/* Escuadra · Figuras animadas originales para los temas (SVG, sin internet, se ven en tema, clase y proyector).
   Cada figura dibuja su cuadro para el tiempo t (segundos); el motor solo anima las que están a la vista. */
(function () {
  'use strict';
  const E = window.E, u = E.u, esc = u.esc;
  const PI = Math.PI, sin = Math.sin, cos = Math.cos, sqrt = Math.sqrt;
  const f = n => Math.round(n * 10) / 10;
  const P = (x, y) => [x, y];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  /* ---------- piezas de dibujo ---------- */
  const ln = (a, b, c) => '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(b[0]) + '" y2="' + f(b[1]) + '" class="' + (c || 'k') + '"/>';
  const pl = (pts, c) => '<polyline points="' + pts.map(p => f(p[0]) + ',' + f(p[1])).join(' ') + '" class="' + (c || 'k') + '"/>';
  const pg = (pts, c) => '<polygon points="' + pts.map(p => f(p[0]) + ',' + f(p[1])).join(' ') + '" class="' + (c || 'fill') + '"/>';
  const ci = (p, r, c) => '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="' + f(r) + '" class="' + (c || 'k') + '"/>';
  const rc = (x, y, w, h, c, r) => '<rect x="' + f(x) + '" y="' + f(y) + '" width="' + f(Math.max(0, w)) + '" height="' + f(Math.max(0, h)) + '" rx="' + (r || 0) + '" class="' + (c || 'fill') + '"/>';
  const tx = (p, s, c, a) => '<text x="' + f(p[0]) + '" y="' + f(p[1]) + '" class="' + (c || 't') + '" text-anchor="' + (a || 'middle') + '">' + esc(s) + '</text>';
  const path = (d, c) => '<path d="' + d + '" class="' + (c || 'k') + '"/>';
  const pin = p => ci(p, 5.5, 'pin');
  function flecha(a, b, c, s) {
    s = s || 9; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
    const p1 = [b[0] - ux * s - uy * s * 0.55, b[1] - uy * s + ux * s * 0.55], p2 = [b[0] - ux * s + uy * s * 0.55, b[1] - uy * s - ux * s * 0.55];
    return ln(a, [b[0] - ux * s * 0.6, b[1] - uy * s * 0.6], c || 'k') + pg([b, p1, p2], (c === 'a' ? 'aha' : c === 'b' ? 'ahb' : 'ah'));
  }
  function apoyo(p, w) { // apoyo fijo (bancada) con achurado
    w = w || 34; let s = pg([p, [p[0] - 10, p[1] + 16], [p[0] + 10, p[1] + 16]], 'fill') + ln([p[0] - w / 2, p[1] + 16], [p[0] + w / 2, p[1] + 16], 'k2');
    for (let x = -w / 2 + 4; x <= w / 2; x += 7) s += ln([p[0] + x, p[1] + 16], [p[0] + x - 6, p[1] + 23], 'hatch');
    return s + pin(p);
  }
  function arcoFlecha(c, r, a0, a1, cl) { // flecha curva (ángulos en radianes, sentido horario en pantalla si a1 > a0)
    const p0 = [c[0] + r * cos(a0), c[1] + r * sin(a0)], p1 = [c[0] + r * cos(a1), c[1] + r * sin(a1)];
    const big = Math.abs(a1 - a0) > PI ? 1 : 0, sw = a1 > a0 ? 1 : 0;
    const da = a1 > a0 ? -0.3 : 0.3, q = [c[0] + r * cos(a1 + da), c[1] + r * sin(a1 + da)];
    return path('M' + f(p0[0]) + ' ' + f(p0[1]) + ' A' + r + ' ' + r + ' 0 ' + big + ' ' + sw + ' ' + f(p1[0]) + ' ' + f(p1[1]), cl || 'a') + flecha(q, p1, cl || 'a', 8);
  }
  function engrane(c, z, m, th, cl) { // engrane de dientes trapezoidales; th = ángulo de giro
    const rp = m * z / 2, ra = rp + m, rf = rp - 1.25 * m, pts = [], step = 2 * PI / z;
    for (let k = 0; k < z; k++) {
      const a = th + k * step;
      [[-0.5, rf], [-0.3, rf], [-0.18, ra], [0.18, ra], [0.3, rf], [0.5, rf]].forEach(q => { const ang = a + q[0] * step; pts.push([c[0] + q[1] * cos(ang), c[1] + q[1] * sin(ang)]); });
    }
    return pg(pts, cl || 'fill') + ci(c, rf * 0.35, 'k2') + ln(c, [c[0] + rf * 0.8 * cos(th), c[1] + rf * 0.8 * sin(th)], 'a') + ci(c, 4, 'pin');
  }
  function cruce(c1, r1, c2, r2, arriba) { // intersección de dos circunferencias
    const dx = c2[0] - c1[0], dy = c2[1] - c1[1], d = Math.hypot(dx, dy), a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h = sqrt(Math.max(0, r1 * r1 - a * a));
    const m = [c1[0] + a * dx / d, c1[1] + a * dy / d], s1 = [m[0] - h * dy / d, m[1] + h * dx / d], s2 = [m[0] + h * dy / d, m[1] - h * dx / d];
    return arriba ? (s1[1] < s2[1] ? s1 : s2) : (s1[1] < s2[1] ? s2 : s1);
  }
  const suave = x => (1 - cos(PI * Math.max(0, Math.min(1, x)))) / 2;

  /* ---------- figuras ---------- */
  const FIG = E.FIGS = {};

  FIG.movimientos = { t: 'Los cuatro tipos de movimiento', d: 'Giratorio, lineal, alternativo y oscilante.', w: 480, h: 190, anim: true, draw: t => {
    let s = '';
    const a = t * PI, c1 = [60, 85];
    s += ci(c1, 32, 'fill') + ln(c1, [c1[0] + 32 * cos(a), c1[1] + 32 * sin(a)], 'a') + pin(c1) + arcoFlecha(c1, 44, -2.4, -0.9, 'b') + tx([60, 170], 'Giratorio');
    const x2 = 140 + 70 * ((t % 2) / 2); s += ln([132, 112], [228, 112], 'k2') + rc(x2, 72, 26, 40, 'fill', 4) + flecha([150, 58], [215, 58], 'b') + tx([180, 170], 'Lineal');
    const x3 = 300 + 28 * sin(PI * t); s += ln([262, 112], [358, 112], 'k2') + rc(x3 - 13, 72, 26, 40, 'fill', 4) + flecha([300, 58], [338, 58], 'b') + flecha([300, 58], [262, 58], 'b') + tx([300, 170], 'Alternativo');
    const o = [420, 34], ang = 0.55 * sin(PI * t), b = [o[0] + 70 * sin(ang), o[1] + 70 * cos(ang)];
    s += ln([400, 34], [440, 34], 'k2') + ln(o, b) + ci(b, 11, 'fill') + pin(o) + arcoFlecha(o, 88, 1.1, 2.0, 'b') + tx([420, 170], 'Oscilante');
    return s;
  } };

  FIG.mecanismo = { t: 'Partes de un mecanismo', d: 'Eslabones (base, motriz, conector y conducido) y tipos de pares.', w: 480, h: 230, anim: false, draw: () => {
    const O2 = [50, 170], O4 = [190, 170], A = [80, 105], B = [175, 85];
    let s = ln(O2, O4, 'm') + ln(O2, A, 'a') + ln(A, B) + ln(O4, B, 'b') + apoyo(O2) + apoyo(O4) + pin(A) + pin(B);
    s += tx([120, 205], 'Base (fija)', 'tm') + tx([40, 128], 'Motriz', 't', 'end') + tx([128, 82], 'Conector') + tx([196, 128], 'Conducido', 't', 'start');
    s += ln([262, 20], [262, 215], 'm');
    const g = [300, 62]; s += ln([g[0] - 22, g[1] + 14], g, 'k') + ln(g, [g[0] + 26, g[1] + 12], 'k') + pin(g) + tx([340, 66], 'Giratorio', 't', 'start') + tx([340, 82], 'bisagra, pasador', 'tm', 'start');
    s += ln([280, 128], [330, 128], 'k2') + rc(292, 110, 26, 16, 'fill', 3) + flecha([305, 102], [325, 102], 'b', 7) + flecha([305, 102], [285, 102], 'b', 7) + tx([340, 124], 'Prismático', 't', 'start') + tx([340, 140], 'corredera, cajón', 'tm', 'start');
    for (let x = 282; x < 330; x += 8) s += ln([x, 176], [x + 5, 190], 'k2');
    s += rc(278, 176, 54, 14, 'none2') + rc(300, 170, 12, 26, 'fill', 2) + tx([340, 184], 'Helicoidal', 't', 'start') + tx([340, 200], 'tornillo y tuerca', 'tm', 'start');
    return s;
  } };

  FIG.gdl = { t: 'Grados de libertad: M = 3(n − 1) − 2·j1', d: 'Triángulo, cuatro barras y cinco barras.', w: 480, h: 215, anim: false, draw: () => {
    let s = '';
    const t0 = [30, 150], t1 = [110, 150], t2 = [70, 82];
    s += ln(t0, t1, 'm') + ln(t0, t2) + ln(t2, t1) + apoyo(t0, 26) + apoyo(t1, 26) + pin(t2);
    s += tx([70, 192], 'n = 3, j1 = 3') + tx([70, 210], 'M = 0 · estructura', 'tb');
    const a0 = [180, 150], a1 = [280, 150], a2 = [195, 95], a3 = [270, 85];
    s += ln(a0, a1, 'm') + ln(a0, a2, 'a') + ln(a2, a3) + ln(a3, a1, 'b') + apoyo(a0, 26) + apoyo(a1, 26) + pin(a2) + pin(a3);
    s += tx([230, 192], 'n = 4, j1 = 4') + tx([230, 210], 'M = 1 · un motor', 'tb');
    const b0 = [340, 150], b1 = [460, 150], b2 = [345, 95], b3 = [400, 70], b4 = [455, 98];
    s += ln(b0, b1, 'm') + ln(b0, b2, 'a') + ln(b2, b3) + ln(b3, b4) + ln(b4, b1, 'a') + apoyo(b0, 26) + apoyo(b1, 26) + pin(b2) + pin(b3) + pin(b4);
    s += tx([400, 192], 'n = 5, j1 = 5') + tx([400, 210], 'M = 2 · dos motores', 'tb');
    return s;
  } };

  const FB = { O2: [150, 200], O4: [260, 200], r2: 40, r3: 120, r4: 90 };
  FB.traza = (() => { const out = []; for (let k = 0; k <= 72; k++) { const th = k / 72 * 2 * PI, A = [FB.O2[0] + FB.r2 * cos(th), FB.O2[1] - FB.r2 * sin(th)], B = cruce(A, FB.r3, FB.O4, FB.r4, true); out.push([(A[0] + B[0]) / 2 + (B[1] - A[1]) * 0.35, (A[1] + B[1]) / 2 - (B[0] - A[0]) * 0.35]); } return out; })();
  FIG.cuatroBarras = { t: 'Cuatro barras manivela-balancín (Grashof)', d: 's + l = 40 + 120 = 160 ≤ p + q = 90 + 110 = 200: la manivela da vueltas completas.', w: 440, h: 270, anim: true, per: 4, draw: t => {
    const th = t * 2 * PI / 4, O2 = FB.O2, O4 = FB.O4, A = [O2[0] + FB.r2 * cos(th), O2[1] - FB.r2 * sin(th)], B = cruce(A, FB.r3, O4, FB.r4, true);
    const C = [(A[0] + B[0]) / 2 + (B[1] - A[1]) * 0.35, (A[1] + B[1]) / 2 - (B[0] - A[0]) * 0.35];
    let s = pl(FB.traza, 'traza') + ln(O2, O4, 'm') + pg([A, B, C], 'fill2') + ln(A, B) + ln(O2, A, 'a') + ln(O4, B, 'b') + apoyo(O2) + apoyo(O4) + pin(A) + pin(B) + ci(C, 4, 'dot');
    s += tx([20, 150], 'Manivela 40', 'ta', 'start') + tx([O4[0] + 46, O4[1] - 60], 'Balancín 90', 'tbb', 'start') + tx([205, 246], 'Base 110', 'tm');
    s += tx([24, 34], 'Acoplador 120', 't', 'start') + tx([24, 54], 's + l ≤ p + q', 'tm', 'start') + tx([24, 72], '160 ≤ 200 ✓', 'tb', 'start');
    return s;
  } };

  FIG.biela = { t: 'Biela-manivela', d: 'El giro de la manivela se vuelve un ir y venir; la carrera es el doble de la manivela.', w: 460, h: 210, anim: true, per: 2.5, draw: t => {
    const O = [80, 110], r = 40, L = 140, th = t * 2 * PI / 2.5, A = [O[0] + r * cos(th), O[1] - r * sin(th)], xb = O[0] + r * cos(th) + sqrt(L * L - Math.pow(r * sin(th), 2)), B = [xb, O[1]];
    let s = rc(O[0] + L - r - 24, 88, 2 * r + 48 + 30, 44, 'none2', 6) + ln([O[0] + L - r - 24, 88], [O[0] + L + r + 54, 88], 'k2') + ln([O[0] + L - r - 24, 132], [O[0] + L + r + 54, 132], 'k2');
    s += rc(xb - 18, 92, 36, 36, 'fill', 4) + ln(O, A, 'a') + ln(A, B) + apoyo(O) + pin(A) + pin(B);
    const x0 = O[0] + L - r, x1 = O[0] + L + r;
    s += ln([x0, 150], [x0, 168], 'm') + ln([x1, 150], [x1, 168], 'm') + flecha([(x0 + x1) / 2, 162], [x1, 162], 'b', 7) + flecha([(x0 + x1) / 2, 162], [x0, 162], 'b', 7) + tx([(x0 + x1) / 2, 186], 'Carrera = 2 × manivela = 80');
    s += tx([O[0], 40], 'Manivela (gira)', 'ta') + tx([O[0] + L * 0.55, 62], 'Biela') + tx([x1 + 40, 76], 'Corredera', 't');
    return s;
  } };

  FIG.leva = { t: 'Leva excéntrica y seguidor', d: 'El perfil de la leva programa el movimiento del seguidor: aquí sube y baja como una onda.', w: 470, h: 270, anim: true, per: 3, draw: t => {
    const O = [130, 195], R = 46, e = 22, th = t * 2 * PI / 3, Cc = [O[0] + e * cos(th), O[1] - e * sin(th)], ytop = Cc[1] - R;
    let s = rc(112, 34, 36, 24, 'none2', 3) + ci(Cc, R, 'fill') + ln(O, Cc, 'a') + apoyo(O) + rc(105, ytop - 8, 50, 8, 'fill', 2) + ln([130, ytop - 8], [130, 20], 'k3');
    s += tx([130, 14], 'Seguidor', 't') + tx([62, 250], 'Leva (gira)', 'ta');
    const gx = 260, gy = 120, gw = 190, A = e;
    s += ln([gx, gy + 50], [gx + gw, gy + 50], 'm') + ln([gx, gy - 50], [gx, gy + 60], 'm');
    const pts = []; for (let k = 0; k <= 60; k++) { const a = k / 60 * 2 * PI; pts.push([gx + k / 60 * gw, gy - A * sin(a) * 1.6]); }
    s += pl(pts, 'b') + ci([gx + ((th % (2 * PI)) / (2 * PI)) * gw, gy - A * sin(th) * 1.6], 6, 'dotb');
    s += tx([gx + gw / 2, gy + 92], 'Altura del seguidor en una vuelta', 'tm') + tx([gx + gw, gy + 68], '360°', 'tm', 'end') + tx([gx, gy + 68], '0°', 'tm', 'start');
    return s;
  } };

  FIG.engranes = { t: 'Par de engranes: i = Z2 / Z1 = 24 / 12 = 2', d: 'La rueda grande gira a la mitad de velocidad y en sentido contrario.', w: 440, h: 260, anim: true, per: 6, draw: t => {
    const m = 6, z1 = 12, z2 = 24, c1 = [120, 125], c2 = [c1[0] + m * (z1 + z2) / 2, 125], th1 = t * 2 * PI / 6, th2 = -th1 * z1 / z2 + PI / z2;
    let s = engrane(c1, z1, m, th1, 'fillA') + engrane(c2, z2, m, th2, 'fill');
    s += arcoFlecha(c1, 58, -2.6, -1.4, 'a') + arcoFlecha(c2, 92, -0.9, -2.1, 'b');
    s += tx([c1[0], 232], 'Motriz Z1 = 12', 'ta') + tx([c2[0], 248], 'Conducida Z2 = 24', 'tbb');
    return s;
  } };

  FIG.poleas = { t: 'Poleas y banda: i = D2 / D1 = 2', d: 'Misma dirección de giro; la polea grande va a la mitad de vueltas y con más fuerza.', w: 440, h: 230, anim: true, per: 4, draw: t => {
    const C1 = [110, 110], C2 = [300, 110], r1 = 32, r2 = 64, d = C2[0] - C1[0], al = Math.asin((r2 - r1) / d);
    const nU = [-sin(al), -cos(al)], nD = [-sin(al), cos(al)];
    const P1 = add(C1, [r1 * nU[0], r1 * nU[1]]), P2 = add(C2, [r2 * nU[0], r2 * nU[1]]), Q1 = add(C1, [r1 * nD[0], r1 * nD[1]]), Q2 = add(C2, [r2 * nD[0], r2 * nD[1]]);
    const belt = 'M' + f(P1[0]) + ' ' + f(P1[1]) + ' L' + f(P2[0]) + ' ' + f(P2[1]) + ' A' + r2 + ' ' + r2 + ' 0 1 1 ' + f(Q2[0]) + ' ' + f(Q2[1]) + ' L' + f(Q1[0]) + ' ' + f(Q1[1]) + ' A' + r1 + ' ' + r1 + ' 0 0 1 ' + f(P1[0]) + ' ' + f(P1[1]);
    const w1 = t * 2 * PI / 2, w2 = w1 * r1 / r2;
    let s = ci(C1, r1, 'fillA') + ci(C2, r2, 'fill');
    for (let k = 0; k < 3; k++) { s += ln(C1, [C1[0] + r1 * 0.85 * cos(w1 + k * 2 * PI / 3), C1[1] + r1 * 0.85 * sin(w1 + k * 2 * PI / 3)], 'k2') + ln(C2, [C2[0] + r2 * 0.88 * cos(w2 + k * 2 * PI / 3), C2[1] + r2 * 0.88 * sin(w2 + k * 2 * PI / 3)], 'k2'); }
    s += '<path d="' + belt + '" class="banda" style="stroke-dashoffset:' + f(-(t * r1 * PI) % 18) + '"/>' + pin(C1) + pin(C2);
    s += tx([C1[0], 205], 'Motriz Ø 64', 'ta') + tx([C2[0], 205], 'Conducida Ø 128', 'tbb');
    return s;
  } };

  FIG.cremallera = { t: 'Piñón y cremallera', d: 'El giro del piñón se vuelve avance en línea recta: avance = radio × ángulo.', w: 440, h: 230, anim: true, per: 4, draw: t => {
    const m = 6, z = 14, c = [220, 92], rp = m * z / 2, th = 1.3 * sin(PI * t / 2), x = rp * th, yb = c[1] + rp, p = PI * m;
    let s = engrane(c, z, m, th + PI / z / 2, 'fillA');
    const pts = [[20 + x - 2 * p, yb + 30]]; for (let k = -2; k < 20; k++) { const x0 = 20 + x + k * p; pts.push([x0, yb + 1.25 * m], [x0 + p * 0.18, yb + 1.25 * m], [x0 + p * 0.32, yb - m], [x0 + p * 0.68, yb - m], [x0 + p * 0.82, yb + 1.25 * m]); }
    pts.push([20 + x + 20 * p, yb + 30]);
    s += '<g clip-path="url(#clip-crem)">' + pg(pts, 'fill') + '</g>';
    s += '<defs><clipPath id="clip-crem"><rect x="20" y="0" width="400" height="230"/></clipPath></defs>';
    s += flecha([220, 205], [220 + (cos(PI * t / 2) >= 0 ? 60 : -60), 205], 'b', 9) + tx([220, 26], 'Piñón (gira)', 'ta') + tx([110, 222], 'Cremallera (avanza)', 'tbb');
    return s;
  } };

  FIG.tornillo = { t: 'Tornillo y tuerca', d: 'Cada vuelta del tornillo mueve la tuerca una distancia igual al paso.', w: 440, h: 170, anim: true, per: 8, draw: t => {
    const vueltas = 5 * sin(PI * t / 4), p = 14, xn = 240 + vueltas * p, off = ((vueltas % 1) + 1) % 1 * p;
    let s = rc(62, 70, 360, 30, 'fill', 4);
    for (let x = 62 - p + off; x < 422; x += p) if (x > 62) s += ln([x, 70], [Math.min(422, x + 8), 100], 'k2');
    s += rc(xn - 26, 56, 52, 58, 'fillA', 6) + rc(46, 62, 18, 46, 'fill', 3);
    s += arcoFlecha([55, 85], 34, 2.2, 4.0, 'a') + flecha([xn, 136], [xn + (cos(PI * t / 4) >= 0 ? 40 : -40), 136], 'b', 8);
    s += tx([xn, 46], 'Tuerca (avanza)', 'ta') + tx([300, 160], 'Avance por vuelta = paso', 'tm');
    return s;
  } };

  FIG.explosionada = { t: 'Vista explosionada', d: 'Las piezas se separan sobre sus ejes para ver cómo se arman; cada una lleva su número de la lista de piezas.', w: 470, h: 260, anim: true, per: 6, draw: t => {
    const e = suave((sin(PI * t / 3) + 1) / 2);
    const base = [96, 200], dir = [0.8, -0.6];
    const pos = k => [base[0] + dir[0] * e * 64 * k, base[1] + dir[1] * e * 64 * k];
    let s = ln(base, [base[0] + dir[0] * 230, base[1] + dir[1] * 230], 'm');
    const p0 = pos(0), p1 = pos(1), p2 = pos(2), p3 = pos(3);
    s += pg([[p0[0] - 50, p0[1] + 18], [p0[0] + 60, p0[1] + 18], [p0[0] + 90, p0[1] - 4], [p0[0] - 20, p0[1] - 4]], 'fill') + ci([p0[0] + 20, p0[1] + 7], 5, 'k2');
    s += pg([[p1[0] - 16, p1[1] + 6], [p1[0] + 70, p1[1] - 50], [p1[0] + 80, p1[1] - 42], [p1[0] - 6, p1[1] + 14]], 'fillA') + ci([p1[0] + 20, p1[1] - 6], 4, 'k2');
    s += rc(p2[0] + 14, p2[1] - 30, 12, 34, 'fill', 2) + rc(p2[0] + 8, p2[1] - 36, 24, 8, 'fill', 2);
    s += pg([[p3[0] + 10, p3[1] - 8], [p3[0] + 30, p3[1] - 8], [p3[0] + 36, p3[1] - 2], [p3[0] + 30, p3[1] + 4], [p3[0] + 10, p3[1] + 4], [p3[0] + 4, p3[1] - 2]], 'fill');
    [[p0, 1, -52, 22], [p1, 2, 90, -48], [p2, 3, 56, -40], [p3, 4, 60, -2]].forEach(b => { const q = [b[0][0] + b[2], b[0][1] + b[3]]; s += ln([b[0][0] + 20, b[0][1]], q, 'm') + ci(q, 11, 'globo') + tx([q[0], q[1] + 4], String(b[1]), 'tb'); });
    s += rc(330, 150, 128, 96, 'none2', 4) + tx([394, 168], 'Lista de piezas', 'tb') + tx([340, 188], '1  Base', 't', 'start') + tx([340, 206], '2  Eslabón', 't', 'start') + tx([340, 224], '3  Tornillo M3', 't', 'start') + tx([340, 242], '4  Tuerca M3', 't', 'start');
    return s;
  } };

  FIG.vistas = { t: 'Tres vistas de una pieza (primer ángulo, ISO-E)', d: 'Frontal, superior y lateral; todas con la misma escala y alineadas.', w: 470, h: 300, anim: false, draw: () => {
    let s = '';
    const fx = 40, fy = 40; // frontal: L
    s += pg([[fx, fy], [fx + 40, fy], [fx + 40, fy + 50], [fx + 100, fy + 50], [fx + 100, fy + 90], [fx, fy + 90]], 'fill') + tx([fx + 50, fy - 10], 'Frontal', 'tb');
    s += ln([fx, fy + 104], [fx + 100, fy + 104], 'm') + flecha([fx + 50, fy + 112], [fx + 100, fy + 112], 'b', 6) + flecha([fx + 50, fy + 112], [fx, fy + 112], 'b', 6) + tx([fx + 50, fy + 128], '100', 'tm');
    const sy = 190; s += rc(fx, sy, 100, 60, 'fill') + ln([fx + 40, sy], [fx + 40, sy + 60], 'k2') + tx([fx + 50, sy + 78], 'Superior', 'tb');
    const lx = 180; s += rc(lx, fy, 60, 90, 'fill') + ln([lx, fy + 50], [lx + 60, fy + 50], 'oculta') + tx([lx + 30, fy - 10], 'Lateral izq.', 'tb') + tx([lx + 30, fy + 106], 'línea oculta', 'tm');
    s += ln([fx - 10, fy + 160], [lx + 70, fy + 160], 'm') + ln([lx - 20, fy - 20], [lx - 20, sy + 70], 'm');
    const o = [312, 205], ix = [0.87, 0.5], iy = [-0.87, 0.5], iz = [0, -1];
    const Pt = (x, y, z) => [o[0] + x * ix[0] + y * iy[0] + z * iz[0], o[1] + x * ix[1] + y * iy[1] + z * iz[1]];
    s += pg([Pt(0, 0, 0), Pt(100, 0, 0), Pt(100, 0, 40), Pt(40, 0, 40), Pt(40, 0, 90), Pt(0, 0, 90)], 'fill');
    s += pg([Pt(0, 0, 90), Pt(40, 0, 90), Pt(40, -60, 90), Pt(0, -60, 90)], 'fill2') + pg([Pt(40, 0, 40), Pt(100, 0, 40), Pt(100, -60, 40), Pt(40, -60, 40)], 'fill2');
    s += pg([Pt(100, 0, 0), Pt(100, -60, 0), Pt(100, -60, 40), Pt(100, 0, 40)], 'fillA') + pg([Pt(40, 0, 40), Pt(40, -60, 40), Pt(40, -60, 90), Pt(40, 0, 90)], 'fillA');
    s += tx([382, 290], 'Isométrico', 'tb');
    return s;
  } };

  FIG.restricciones = { t: 'Boceto: de "faltan restricciones" a totalmente restringido', d: 'En FreeCAD el boceto se pone verde cuando ya no le falta ninguna restricción.', w: 470, h: 210, anim: true, per: 6, draw: t => {
    const ok = (t % 6) > 3;
    let s = rc(30, 50, 170, 100, ok ? 'verde' : 'none2', 8);
    s += tx([115, 30], ok ? 'Totalmente restringido' : 'Faltan restricciones', ok ? 'tverde' : 'tb');
    if (ok) {
      s += tx([115, 172], '100 mm', 'tm') + flecha([115, 160], [200, 160], 'm', 6) + flecha([115, 160], [30, 160], 'm', 6) + tx([214, 104], '50', 'tm', 'start');
      s += tx([115, 64], 'H', 'tm') + tx([40, 104], 'V', 'tm') + ci([30, 50], 6, 'dotb');
    } else s += tx([115, 104], '¿Ancho? ¿Alto? ¿Dónde está?', 'tm');
    s += tx([240, 64], 'Restricciones comunes', 'tb', 'start');
    ['H  horizontal', 'V  vertical', 'Coincidente', 'Tangente', 'Distancia', 'Radio o diámetro'].forEach((x, i) => { s += tx([240, 88 + i * 20], '• ' + x, 't', 'start'); });
    return s;
  } };

  FIG.presion = { t: 'Presión = Fuerza / Área', d: 'La misma fuerza en menos área produce más presión. 1 bar = 0.1 N/mm².', w: 460, h: 200, anim: false, draw: () => {
    let s = ln([20, 150], [440, 150], 'k2');
    s += rc(60, 70, 90, 80, 'fill', 4) + flecha([105, 20], [105, 64], 'b') + tx([105, 176], 'Área grande → poca presión') + rc(60, 150, 90, 8, 'presion1');
    s += rc(300, 70, 90, 60, 'fill', 4) + pg([[330, 130], [360, 130], [345, 150]], 'fill') + flecha([345, 20], [345, 64], 'b') + tx([345, 176], 'Área pequeña → mucha presión') + rc(338, 150, 14, 14, 'presion2');
    s += tx([230, 60], 'P = F / A', 'tb') + tx([230, 80], 'misma F', 'tm');
    return s;
  } };

  FIG.pascal = { t: 'Principio de Pascal: prensa hidráulica', d: 'La presión es igual en todo el líquido: F2 = F1 × (A2 / A1). Con 9 veces más área, 9 veces más fuerza, pero 9 veces menos recorrido.', w: 460, h: 260, anim: true, per: 4, draw: t => {
    const s1 = (1 - cos(PI * t / 2)) / 2, d1 = 54 * s1, d2 = d1 / 9;
    const x1 = 100, w1 = 30, x2 = 262, w2 = 90, top = 60, bot = 210;
    let s = rc(x1, top + 30 + d1, w1, bot - top - 30 - d1, 'fluido') + rc(x2, top + 30 - d2 + 54 / 9, w2, bot - top - 30 + d2 - 54 / 9, 'fluido') + rc(x1, bot - 20, x2 + w2 - x1, 20, 'fluido');
    s += ln([x1, top], [x1, bot]) + ln([x1 + w1, top], [x1 + w1, bot - 20]) + ln([x1 + w1, bot - 20], [x2, bot - 20]) + ln([x2, bot - 20], [x2, top - 30]) + ln([x2 + w2, top - 30], [x2 + w2, bot]) + ln([x1, bot], [x2 + w2, bot]);
    const yp1 = top + 30 + d1, yp2 = top + 30 - d2 + 54 / 9;
    s += rc(x1 - 2, yp1 - 10, w1 + 4, 10, 'fillA', 2) + rc(x2 - 2, yp2 - 10, w2 + 4, 10, 'fill', 2);
    s += flecha([x1 + w1 / 2, yp1 - 50], [x1 + w1 / 2, yp1 - 12], 'a', 8) + tx([x1 - 8, yp1 - 30], 'F1 = 10 N', 'ta', 'end');
    s += flecha([x2 + w2 / 2, yp2 - 12], [x2 + w2 / 2, yp2 - 62], 'b', 12) + tx([x2 + w2 + 8, yp2 - 30], 'F2 = 90 N', 'tbb', 'start');
    s += tx([x1 + w1 / 2, bot + 20], 'A1', 'tm') + tx([x2 + w2 / 2, bot + 20], 'A2 = 9 × A1', 'tm') + tx([185, 150], 'misma presión', 'tm');
    return s;
  } };

  FIG.aire = { t: 'Del compresor al cilindro', d: 'Comprime, almacena, prepara (filtro, regulador, lubricador), dirige y trabaja.', w: 480, h: 150, anim: true, per: 1.2, draw: t => {
    const cajas = [['Compresor', 'comprime'], ['Depósito', 'almacena'], ['FRL', 'prepara'], ['Válvula', 'dirige'], ['Cilindro', 'trabaja']];
    let s = ''; const w = 80, gap = 13;
    cajas.forEach((c, i) => {
      const x = 12 + i * (w + gap);
      if (i) s += '<line x1="' + (x - gap) + '" y1="60" x2="' + x + '" y2="60" class="flujo" style="stroke-dashoffset:' + f(-(t * 20) % 12) + '"/>';
      s += rc(x, 36, w, 48, i === 4 ? 'fillA' : 'fill', 8) + tx([x + w / 2, 65], c[0], 'tbs') + tx([x + w / 2, 104], c[1], 'tm');
    });
    return s;
  } };

  FIG.cilindro = { t: 'Cilindro de doble efecto', d: 'Avance: el aire entra por atrás (A). Retroceso: entra por delante (B). F = P × A y en retroceso P × (A − a).', w: 470, h: 200, anim: true, per: 5, draw: t => {
    const k = t % 5, av = k < 2.5, s0 = av ? suave(k / 2.5) : 1 - suave((k - 2.5) / 2.5), x0 = 70, x1 = 300, xp = x0 + 20 + s0 * (x1 - x0 - 46);
    let s = rc(x0, 60, xp - x0, 60, av ? 'aireP' : 'aireE') + rc(xp + 14, 60, x1 - xp - 14, 60, av ? 'aireE' : 'aireP');
    s += rc(x0, 56, x1 - x0, 68, 'none2', 6) + rc(xp, 58, 14, 64, 'fillA', 2) + rc(xp + 14, 82, 170, 16, 'fill', 3);
    s += ln([x0 + 14, 56], [x0 + 14, 30]) + ln([x1 - 14, 56], [x1 - 14, 30]) + tx([x0 + 14, 22], 'A', 'tb') + tx([x1 - 14, 22], 'B', 'tb');
    s += flecha(av ? [x0 + 14, 34] : [x0 + 30, 40], av ? [x0 + 14, 52] : [x0 + 30, 22], av ? 'a' : 'm', 7) + flecha(av ? [x1 - 30, 40] : [x1 - 14, 34], av ? [x1 - 30, 22] : [x1 - 14, 52], av ? 'm' : 'a', 7);
    s += tx([235, 160], av ? 'Avance: presión en A, B escapa' : 'Retroceso: presión en B, A escapa', 'tb') + tx([235, 182], av ? 'F = P × A' : 'F = P × (A − a): un poco menos', 'tm');
    return s;
  } };

  FIG.valvula = { t: 'Válvula 5/2 con solenoide y resorte', d: '5 vías y 2 posiciones. Reposo: 1→2 y 4→5. Con el solenoide (14): 1→4 y 2→3.', w: 480, h: 270, anim: true, per: 5, draw: t => {
    const k = t % 5, act = k < 2.5, mv = act ? suave(Math.min(1, k / 0.4)) : 1 - suave(Math.min(1, (k - 2.5) / 0.4)), W = 70, Y = 120;
    // puertos fijos alineados con la caja en uso (la de la derecha en reposo, la izquierda activada)
    const bx = 175; // x de la caja conectada
    let s = '';
    const caja = (x, a) => { let r = rc(x, Y, W, W, 'fill');
      if (a) { r += flecha([x + 35, Y + W], [x + 20, Y], 'k', 8) + flecha([x + 50, Y], [x + 58, Y + W], 'k', 8) + ln([x + 12, Y + W], [x + 12, Y + W - 12]) + ln([x + 6, Y + W - 12], [x + 18, Y + W - 12]); }
      else { r += flecha([x + 35, Y + W], [x + 50, Y], 'k', 8) + flecha([x + 20, Y], [x + 12, Y + W], 'k', 8) + ln([x + 58, Y + W], [x + 58, Y + W - 12]) + ln([x + 52, Y + W - 12], [x + 64, Y + W - 12]); }
      return r; };
    const xIzq = bx - W + mv * W, xDer = xIzq + W;
    s += caja(xIzq, true) + caja(xDer, false);
    s += rc(xIzq - 30, Y + 15, 30, 40, 'fillA', 2) + ln([xIzq - 30, Y + 55], [xIzq, Y + 15], 'k2') + tx([xIzq - 15, Y + 72], '14', 'tm');
    let z = 'M' + f(xDer + W) + ' ' + (Y + 35); for (let i = 0; i < 6; i++) z += ' L' + f(xDer + W + 6 + i * 6) + ' ' + (Y + 35 + (i % 2 ? -10 : 10)); s += path(z, 'k2') + tx([xDer + W + 22, Y + 72], '12', 'tm');
    [[bx + 12, '5'], [bx + 35, '1'], [bx + 58, '3']].forEach(q => { s += ln([q[0], Y + W], [q[0], Y + W + 22], 'k2') + tx([q[0], Y + W + 36], q[1], 'tb'); });
    [[bx + 20, '4'], [bx + 50, '2']].forEach(q => { s += ln([q[0], Y], [q[0], Y - 22], 'k2') + tx([q[0] - 10, Y - 26], q[1], 'tb'); });
    s += tx([bx + 35, Y + W + 56], act ? 'Solenoide activado: 1→4, 2→3' : 'Reposo (resorte): 1→2, 4→5', 'tb');
    // cilindro conectado a 4 (atrás) y 2 (adelante)
    const xc = 90, wc = 260, xp = xc + 12 + mv * (wc - 40);
    s += rc(xc, 22, wc, 40, 'none2', 5) + rc(xp, 24, 10, 36, 'fillA') + rc(xp + 10, 36, 120, 12, 'fill', 2) + ln([bx + 20, Y - 22], [bx + 20, 72], 'm') + ln([bx + 50, Y - 22], [bx + 50, 72], 'm');
    return s;
  } };

  FIG.simbolos = { t: 'Símbolos neumáticos básicos (ISO 1219, simplificados)', d: 'Para empezar a leer diagramas; la norma completa tiene más variantes.', w: 480, h: 330, anim: false, draw: () => {
    let s = '';
    const celda = (i, j, titulo, dib) => { const x = 10 + j * 156, y = 10 + i * 106; s += rc(x, y, 148, 98, 'none2', 6) + dib(x + 74, y + 42) + tx([x + 74, y + 88], titulo, 'tbs'); };
    celda(0, 0, 'Compresor', (x, y) => ci([x, y], 22) + pg([[x, y - 22], [x - 10, y - 4], [x + 10, y - 4]], 'none3') + ln([x, y - 22], [x, y - 34]));
    celda(0, 1, 'Cil. simple efecto', (x, y) => { let r = rc(x - 50, y - 16, 100, 32, 'none3') + ln([x - 20, y - 16], [x - 20, y + 16]) + ln([x - 20, y], [x + 60, y]); let z = 'M' + (x - 16) + ' ' + y; for (let i = 0; i < 6; i++) z += ' L' + (x - 12 + i * 10) + ' ' + (y + (i % 2 ? -10 : 10)); return r + path(z, 'k2') + ln([x - 40, y + 16], [x - 40, y + 30]); });
    celda(0, 2, 'Cil. doble efecto', (x, y) => rc(x - 50, y - 16, 100, 32, 'none3') + ln([x - 10, y - 16], [x - 10, y + 16]) + ln([x - 10, y], [x + 64, y]) + ln([x - 40, y + 16], [x - 40, y + 30]) + ln([x + 40, y + 16], [x + 40, y + 30]));
    celda(1, 0, 'Válvula 3/2 · botón', (x, y) => { const W = 34, xi = x - W; let r = rc(xi, y - 17, W, 34, 'none3') + rc(x, y - 17, W, 34, 'none3') + flecha([xi + 10, y + 17], [xi + 10, y - 17], 'k', 6) + ln([xi + 26, y + 17], [xi + 26, y + 9]) + ln([xi + 21, y + 9], [xi + 31, y + 9]) + flecha([x + 10, y - 17], [x + 26, y + 17], 'k', 6) + ln([x + 10, y + 17], [x + 10, y + 9]) + ln([x + 5, y + 9], [x + 15, y + 9]); r += ln([xi, y], [xi - 14, y]) + ln([xi - 14, y - 8], [xi - 14, y + 8]); let z = 'M' + (x + W) + ' ' + y; for (let i = 0; i < 5; i++) z += ' L' + (x + W + 5 + i * 5) + ' ' + (y + (i % 2 ? -7 : 7)); return r + path(z, 'k2'); });
    celda(1, 1, 'Válvula 5/2 · solenoide', (x, y) => { const W = 36, xi = x - W; let r = rc(xi, y - 18, W, 36, 'none3') + rc(x, y - 18, W, 36, 'none3') + flecha([xi + 18, y + 18], [xi + 8, y - 18], 'k', 5) + flecha([xi + 28, y - 18], [xi + 32, y + 18], 'k', 5) + flecha([x + 18, y + 18], [x + 28, y - 18], 'k', 5) + flecha([x + 8, y - 18], [x + 4, y + 18], 'k', 5); r += rc(xi - 16, y - 10, 16, 20, 'none3') + ln([xi - 16, y + 10], [xi, y - 10], 'k2'); let z = 'M' + (x + W) + ' ' + y; for (let i = 0; i < 5; i++) z += ' L' + (x + W + 5 + i * 5) + ' ' + (y + (i % 2 ? -7 : 7)); return r + path(z, 'k2'); });
    celda(1, 2, 'Antirretorno', (x, y) => ln([x - 50, y], [x - 12, y]) + ci([x - 4, y], 9, 'none3') + ln([x + 6, y - 14], [x + 6, y + 14]) + ln([x + 6, y], [x + 50, y]) + ln([x - 18, y - 14], [x - 4, y - 9]) + ln([x - 18, y + 14], [x - 4, y + 9]));
    celda(2, 0, 'Escape', (x, y) => ln([x, y - 26], [x, y - 2]) + pg([[x, y - 2], [x - 12, y + 16], [x + 12, y + 16]], 'none3'));
    celda(2, 1, 'Manómetro', (x, y) => ci([x, y], 20, 'none3') + flecha([x - 12, y + 12], [x + 12, y - 12], 'k', 7) + ln([x, y + 20], [x, y + 32]));
    celda(2, 2, 'Trabajo / pilotaje', (x, y) => ln([x - 54, y - 10], [x + 54, y - 10]) + ln([x - 54, y + 12], [x + 54, y + 12], 'piloto'));
    return s;
  } };

  FIG.escalera = { t: 'Diagrama de escalera básico', d: 'Al presionar S1 se energiza el relevador K1; su contacto K1 enciende el solenoide Y1 de la válvula.', w: 470, h: 228, anim: true, per: 4, draw: t => {
    const on = (t % 4) > 2; let s = ln([40, 20], [40, 190], 'k3') + ln([430, 20], [430, 190], 'k3') + tx([40, 14], '+24 V', 'tb') + tx([430, 14], '0 V', 'tb');
    const peld = (y, a, b, on2) => ln([40, y], [130, y], on2 ? 'a' : 'k2') + ln([152, y], [300, y], on2 ? 'a' : 'k2') + ln([340, y], [430, y], on2 ? 'a' : 'k2') + ln([130, y - 14], [130, y + 14]) + ln([152, y - 14], [152, y + 14]) + (on2 ? ln([130, y], [152, y], 'a') : '') + tx([141, y - 22], a, 'tb');
    s += peld(70, 'S1', '', on) + ci([320, 70], 18, on ? 'fillA' : 'none3') + tx([320, 75], 'K1', 'tb') + tx([141, 100], 'botón NA', 'tm');
    s += peld(150, 'K1', '', on) + rc(300, 136, 40, 28, on ? 'fillA' : 'none3', 2) + ln([300, 164], [340, 136], 'k2') + tx([320, 186], 'Y1 solenoide', 'tm') + tx([141, 180], 'contacto de K1', 'tm');
    s += tx([235, 220], on ? 'S1 presionado → K1 y Y1 activos' : 'S1 suelto → todo apagado', 'tb');
    return s;
  } };

  FIG.motor = { t: 'Inversión de giro de un motor de CD', d: 'El interruptor de doble polo cruza los cables: al invertir la polaridad, el motor gira al revés.', w: 470, h: 230, anim: true, per: 6, draw: t => {
    const inv = (t % 6) > 3, ang = (inv ? -1 : 1) * t * 2 * PI / 1.2;
    let s = ln([60, 60], [60, 90], 'k3') + ln([48, 90], [72, 90], 'k3') + ln([54, 100], [66, 100], 'k2') + ln([60, 100], [60, 170], 'k3') + tx([84, 82], '+', 'tb') + tx([84, 112], '−', 'tb');
    s += rc(150, 60, 110, 110, 'none2', 8) + tx([205, 52], 'Interruptor doble polo', 'tm');
    s += ln([60, 60], [150, 60], 'k2') + ln([60, 170], [150, 170], 'k2');
    if (!inv) s += ln([150, 60], [260, 80], 'a') + ln([150, 170], [260, 150], 'k2');
    else s += ln([150, 60], [260, 150], 'a') + ln([150, 170], [260, 80], 'k2');
    s += ln([260, 80], [330, 80], inv ? 'k2' : 'a') + ln([260, 150], [330, 150], inv ? 'a' : 'k2') + ci([370, 115], 40, 'fill') + tx([370, 122], 'M', 'tb');
    s += ci([370 + 30 * cos(ang), 115 + 30 * sin(ang)], 6, 'dot') + (inv ? arcoFlecha([370, 115], 54, -0.6, -2.2, 'b') : arcoFlecha([370, 115], 54, -2.2, -0.6, 'b'));
    s += tx([345, 74], inv ? '−' : '+', 'tb') + tx([345, 168], inv ? '+' : '−', 'tb') + tx([235, 212], inv ? 'Polaridad invertida → gira al revés' : 'Polaridad normal → gira en un sentido', 'tb');
    return s;
  } };

  /* ---------- qué figuras van con cada tema ---------- */
  E.FIG_TEMA = {
    'sm1-planos': ['vistas'], 'sm1-restricciones': ['restricciones'], 'sm2-mecanismo': ['mecanismo'], 'sm2-movimientos': ['movimientos'],
    'sm2-gdl': ['gdl'], 'sm2-4barras': ['cuatroBarras'], 'sm2-biela': ['biela'], 'sm2-levas': ['leva'], 'sm2-engranes': ['engranes'],
    'sm2-poleas': ['poleas'], 'sm2-tornillo': ['cremallera', 'tornillo'], 'sm2-explosionada': ['explosionada'],
    'sm3-presion': ['presion'], 'sm3-pascal': ['pascal'], 'sm3-aire': ['aire'], 'sm3-cilindros': ['cilindro'], 'sm3-valvulas': ['valvula'],
    'sm3-iso1219': ['simbolos'], 'sm3-electro': ['escalera'], 'sm3-motordc': ['motor'], 'sm3-comparativa': ['cilindro'], 'sm3-fallas': ['valvula']
  };

  /* ---------- motor de animación ---------- */
  const F = E.fig = { vivos: new Set(), raf: 0, last: 0 };
  F.html = (id, o) => {
    const d = FIG[id]; if (!d) return ''; o = o || {};
    return '<figure class="fig' + (o.cls ? ' ' + o.cls : '') + '" data-fig="' + id + '"' + (o.pausa ? ' data-pausa="1"' : '') + '><svg viewBox="0 0 ' + d.w + ' ' + d.h + '" role="img" aria-label="' + esc(d.t + '. ' + d.d) + '"></svg>' +
      (o.sinPie ? '' : '<figcaption><b>' + esc(d.t) + '</b><span>' + esc(d.d) + '</span></figcaption>') +
      (d.anim && !o.sinBotones ? '<div class="fig-ctl"><button type="button" data-act="fig-play" aria-label="Pausar o seguir">' + (o.pausa ? '▶ Animar' : '⏸') + '</button><button type="button" data-act="fig-lento">🐢 Cámara lenta</button></div>' : '') + '</figure>';
  };
  F.pintar = el => { const st = el._fig, d = FIG[st.id], svg = el.querySelector('svg'); if (svg && d) svg.innerHTML = d.draw(st.t); };
  // arranca el ciclo de animación solo si hay alguna figura moviéndose y visible (cuida la batería)
  const corre = el => el._fig.play && el._fig.vis && !document.hidden;
  F.arrancar = () => { if (!F.raf && Array.from(F.vivos).some(el => el.isConnected && corre(el))) { F.last = performance.now(); F.raf = requestAnimationFrame(F.loop); } };
  F.montar = root => {
    (root || document).querySelectorAll('figure[data-fig]').forEach(el => {
      if (el._fig) return; el._fig = { id: el.dataset.fig, t: el.dataset.pausa ? 0.6 : 0, play: !el.dataset.pausa, vel: 1, vis: true }; F.pintar(el);
      if (FIG[el._fig.id] && FIG[el._fig.id].anim) { F.vivos.add(el); if (F.io) F.io.observe(el); }
    });
    F.arrancar();
  };
  // ~30 cuadros por segundo: se ve fluido y gasta la mitad que a 60
  F.loop = now => {
    F.raf = 0; let alguna = false;
    if (now - F.last >= 32) {
      const dt = Math.min(0.1, (now - F.last) / 1000); F.last = now;
      F.vivos.forEach(el => { if (!el.isConnected) { F.vivos.delete(el); if (F.io) F.io.unobserve(el); return; } if (!corre(el)) return; alguna = true; el._fig.t += dt * el._fig.vel; F.pintar(el); });
    } else alguna = Array.from(F.vivos).some(el => el.isConnected && corre(el));
    if (alguna) F.raf = requestAnimationFrame(F.loop);
  };
  if ('IntersectionObserver' in window) F.io = new IntersectionObserver(es => { es.forEach(e => { if (e.target._fig) e.target._fig.vis = e.isIntersecting; }); F.arrancar(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) F.arrancar(); });
  // monta las figuras nuevas que aparezcan en pantalla (no reacciona a los cuadros que pinta la propia animación)
  const traeFig = n => n.nodeType === 1 && (n.matches('figure[data-fig]') || !!n.querySelector('figure[data-fig]'));
  if ('MutationObserver' in window) new MutationObserver(ms => { if (ms.some(m => Array.prototype.some.call(m.addedNodes, traeFig))) F.montar(document); }).observe(document.documentElement, { childList: true, subtree: true });
  E.actions['fig-play'] = el => { const fg = el.closest('figure'); if (!fg || !fg._fig) return; fg._fig.play = !fg._fig.play; el.textContent = fg._fig.play ? '⏸' : '▶'; F.arrancar(); };
  E.actions['fig-lento'] = el => { const fg = el.closest('figure'); if (!fg || !fg._fig) return; fg._fig.vel = fg._fig.vel === 1 ? 0.25 : 1; el.classList.toggle('on', fg._fig.vel !== 1); };
})();
