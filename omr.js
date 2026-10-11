/* Escuadra · Hojas de respuestas que se califican con la cámara (como un lector óptico o ZipGrade).
   La hoja lleva 4 marcas negras en las esquinas (la de arriba a la izquierda tiene un hueco: así se sabe hacia dónde está),
   burbujas para el número de lista y la versión, y un renglón de burbujas por cada pregunta cerrada.
   Las abiertas se siguen calificando a mano. Todo se procesa en el aparato: la foto no se guarda ni se sube. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h, UD = E.undo;
  const card = H.card, btn = H.btn, link = H.link, icon = E.icon;
  const O = E.omr = {};
  const AUTO = { vf: 1, om: 1, calc: 1 };
  const LET = 'abcd';
  const corto = (t, n) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
  const XM = () => E.examen;

  /* =================== diseño de la hoja (medidas en mm) =================== */
  const MK = 8, R = 2.3, DX = 6.6, RH = 7.2, CW = 58;
  const MC = [[8, 8], [182, 8], [182, 242], [8, 242]];          // arriba-izq (con hueco), arriba-der, abajo-der, abajo-izq
  O.layout = ex => {
    const its = XM().version(ex, 'A'), auto = its.filter(x => AUTO[x.b.tipo]);
    const K = auto.length, cols = K <= 15 ? 1 : K <= 30 ? 2 : 3, rows = Math.max(1, Math.ceil(K / cols));
    const filas = auto.map((x, i) => {
      const c = Math.floor(i / rows), r = i % rows, x0 = 14 + c * CW, y = 88 + r * RH, ops = x.b.tipo === 'vf' ? ['V', 'F'] : ['a', 'b', 'c', 'd'];
      return { n: x.n, tipo: x.b.tipo, ops: ops, lx: x0 + 9, y: y, b: ops.map((L, k) => ({ x: x0 + 15 + k * DX, y: y, L: L })) };
    });
    const fila = (n, y, x0) => Array.from({ length: n }, (_, d) => ({ x: x0 + d * DX, y: y, L: String(d) }));
    return { filas: filas, K: K, abiertas: its.length - K, dec: fila(6, 58, 64), uni: fila(10, 66, 64), ver: [{ x: 152, y: 62, L: 'A' }, { x: 161, y: 62, L: 'B' }] };
  };
  // firma corta del examen para detectar hojas impresas antes de cambiar las preguntas
  O.firma = ex => { const L = O.layout(ex); return L.K + '-' + L.filas.map(f => f.tipo[0]).join('').replace(/(.)\1*/g, m => m[0] + m.length); };

  /* ---------- la hoja en SVG (tamaño real) ---------- */
  O.hojaSVG = (g, ex, a) => {
    const L = O.layout(ex), cf = D.cfg();
    const T = (x, y, s, t, o) => '<text x="' + x + '" y="' + y + '" font-size="' + s + '"' + (o || '') + '>' + esc(t) + '</text>';
    const bub = (b, lleno) => '<circle cx="' + b.x + '" cy="' + b.y + '" r="' + R + '" fill="' + (lleno ? '#000' : '#fff') + '" stroke="#444" stroke-width=".3"/>' +
      (lleno ? '' : '<text x="' + b.x + '" y="' + (b.y + 0.85) + '" font-size="2.4" text-anchor="middle" fill="#8f8f8f">' + b.L + '</text>');
    let s = '<svg class="omr-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 250" width="190mm" height="250mm" font-family="Arial, Helvetica, sans-serif" fill="#000"><rect width="190" height="250" fill="#fff"/>';
    MC.forEach((c, i) => { s += '<rect x="' + (c[0] - MK / 2) + '" y="' + (c[1] - MK / 2) + '" width="' + MK + '" height="' + MK + '" fill="#000"/>'; if (!i) s += '<rect x="' + (c[0] - 1.6) + '" y="' + (c[1] - 1.6) + '" width="3.2" height="3.2" fill="#fff"/>'; });
    s += T(95, 10, 4.4, 'HOJA DE RESPUESTAS', ' text-anchor="middle" font-weight="bold"') + T(95, 16, 3, corto(ex.titulo, 60) + ' · Grupo ' + g.nombre, ' text-anchor="middle"');
    s += T(16, 25, 3.2, 'Nombre:', ' font-weight="bold"') + (a ? T(31, 25, 3.6, a.nombre, ' font-weight="bold"') : '<line x1="31" y1="25.6" x2="132" y2="25.6" stroke="#000" stroke-width=".25"/>') +
      T(138, 25, 3.2, 'Fecha:', ' font-weight="bold"') + '<line x1="150" y1="25.6" x2="176" y2="25.6" stroke="#000" stroke-width=".25"/>';
    s += T(16, 32, 2.7, 'Rellena todo el círculo con lápiz o pluma oscura. Una sola respuesta por pregunta. Si te equivocas, borra muy bien.') +
      T(16, 37.5, 2.7, 'No dobles la hoja ni escribas sobre las marcas negras de las esquinas.');
    // ejemplo: así sí / así no
    s += T(16, 44, 2.7, 'Así sí:', ' font-weight="bold"') + '<circle cx="30" cy="43.1" r="' + R + '" fill="#000"/>' + T(38, 44, 2.7, 'Así no:', ' font-weight="bold"') +
      '<circle cx="52" cy="43.1" r="' + R + '" fill="#fff" stroke="#444" stroke-width=".3"/><path d="M50.6 43.1 l1.1 1.2 l2.1 -2.6" fill="none" stroke="#000" stroke-width=".5"/>' +
      '<circle cx="59" cy="43.1" r="' + R + '" fill="#fff" stroke="#444" stroke-width=".3"/><path d="M57.6 41.7 l2.8 2.8 M60.4 41.7 l-2.8 2.8" stroke="#000" stroke-width=".5"/>' +
      '<circle cx="66" cy="43.1" r="' + R + '" fill="#fff" stroke="#444" stroke-width=".3"/><path d="M66 40.8 a2.3 2.3 0 0 1 0 4.6 z" fill="#000"/>';
    // número de lista y versión
    s += T(16, 54, 3.2, 'Número de lista', ' font-weight="bold"') + '<rect x="16" y="57" width="8" height="10" fill="none" stroke="#000" stroke-width=".3"/><rect x="25" y="57" width="8" height="10" fill="none" stroke="#000" stroke-width=".3"/>' +
      T(16, 70.5, 2.2, 'escríbelo y rellena', ' fill="#555"') + T(38, 58.9, 2.6, 'Decenas') + T(38, 66.9, 2.6, 'Unidades');
    const n = a ? Number(a.num) || 0 : -1;
    L.dec.forEach((b, d) => { s += bub(b, a && Math.floor(n / 10) === d); }); L.uni.forEach((b, d) => { s += bub(b, a && n % 10 === d); });
    if (a) s += T(20, 64.6, 5, String(Math.floor(n / 10)), ' text-anchor="middle" font-weight="bold"') + T(29, 64.6, 5, String(n % 10), ' text-anchor="middle" font-weight="bold"');
    s += T(140, 54, 3.2, 'Versión', ' font-weight="bold"') + L.ver.map(b => bub(b, false)).join('') + T(140, 70.5, 2.2, 'la que dice tu examen', ' fill="#555"');
    s += '<line x1="14" y1="75" x2="176" y2="75" stroke="#000" stroke-width=".3"/>' + T(16, 81.5, 3.2, 'Respuestas', ' font-weight="bold"') +
      (L.abiertas ? T(42, 81.5, 2.5, L.abiertas > 1 ? 'Las preguntas ' + (L.K + 1) + ' a ' + (L.K + L.abiertas) + ' son abiertas: contéstalas en el examen.' : 'La pregunta ' + (L.K + 1) + ' es abierta: contéstala en el examen.', ' fill="#555"') : '');
    L.filas.forEach(f => { s += T(f.lx, f.y + 1.1, 3.1, String(f.n), ' text-anchor="end" font-weight="bold"') + f.b.map(b => bub(b, false)).join(''); });
    s += T(95, 247, 2.2, 'Escuadra · ' + O.firma(ex) + ' · ' + (cf.plantel || ''), ' text-anchor="middle" fill="#777"') + '</svg>';
    return s;
  };
  A['omr-print'] = el => {
    const g = D.grupoActual(), ex = XM().get(g, el.dataset.id); if (!ex) return;
    if (!O.layout(ex).K) { u.toast('Este examen no tiene preguntas cerradas para burbujas', 'err'); return; }
    const al = el.dataset.m === 'alumnos' ? D.alumnos(g) : [null];
    E.print.run(al.map(a => '<div class="pr omr-hoja">' + O.hojaSVG(g, ex, a) + '</div>').join(''), { title: 'Hoja de respuestas ' + ex.titulo, margin: '10mm' });
  };

  /* =================== lectura de la foto =================== */
  O.gris = (data, w, h) => { const g = new Uint8Array(w * h); for (let i = 0, j = 0; j < g.length; i += 4, j++) g[j] = (data[i] * 77 + data[i + 1] * 150 + data[i + 2] * 29) >> 8; return { g: g, w: w, h: h }; };
  // copia reducida (promedio de bloques) para buscar las esquinas rápido
  const reduce = (G, max) => {
    const k = Math.max(1, Math.ceil(Math.max(G.w, G.h) / max)); if (k === 1) return { g: G.g, w: G.w, h: G.h, k: 1 };
    const w = Math.floor(G.w / k), h = Math.floor(G.h / k), o = new Uint8Array(w * h), kk = k * k;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let s = 0; for (let j = 0; j < k; j++) { const r = (y * k + j) * G.w + x * k; for (let i = 0; i < k; i++) s += G.g[r + i]; } o[y * w + x] = s / kk; }
    return { g: o, w: w, h: h, k: k };
  };
  // pixeles bastante más oscuros que su alrededor (umbral adaptativo con imagen integral)
  const oscuros = (P, win) => {
    const w = P.w, h = P.h, g = P.g, W1 = w + 1, I = new Float64Array(W1 * (h + 1)), m = new Uint8Array(w * h), r = win >> 1;
    for (let y = 0; y < h; y++) { let s = 0; for (let x = 0; x < w; x++) { s += g[y * w + x]; I[(y + 1) * W1 + x + 1] = I[y * W1 + x + 1] + s; } }
    for (let y = 0; y < h; y++) {
      const y0 = Math.max(0, y - r), y1 = Math.min(h, y + r + 1);
      for (let x = 0; x < w; x++) { const x0 = Math.max(0, x - r), x1 = Math.min(w, x + r + 1), me = (I[y1 * W1 + x1] - I[y0 * W1 + x1] - I[y1 * W1 + x0] + I[y0 * W1 + x0]) / ((x1 - x0) * (y1 - y0)); if (g[y * w + x] < me * 0.78 - 4) m[y * w + x] = 1; }
    }
    return m;
  };
  // manchas conectadas: tamaño, caja y centro
  const manchas = (m, w, h) => {
    const lab = new Int32Array(w * h), par = [0]; let n = 0;
    const raiz = a => { while (par[a] !== a) { par[a] = par[par[a]]; a = par[a]; } return a; };
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x; if (!m[i]) continue; const a = x ? lab[i - 1] : 0, b = y ? lab[i - w] : 0;
      if (a && b) { const ra = raiz(a), rb = raiz(b); lab[i] = ra < rb ? ra : rb; if (ra !== rb) par[ra > rb ? ra : rb] = ra < rb ? ra : rb; }
      else if (a || b) lab[i] = a || b; else { par.push(++n); lab[i] = n; }
    }
    const st = new Map();
    for (let i = 0; i < w * h; i++) {
      if (!lab[i]) continue; const r = raiz(lab[i]); lab[i] = r; let s = st.get(r); const x = i % w, y = (i - x) / w;
      if (!s) { s = { r: r, n: 0, sx: 0, sy: 0, x0: x, y0: y, x1: x, y1: y }; st.set(r, s); }
      s.n++; s.sx += x; s.sy += y; if (x < s.x0) s.x0 = x; if (x > s.x1) s.x1 = x; if (y < s.y0) s.y0 = y; if (y > s.y1) s.y1 = y;
    }
    return { lab: lab, st: st };
  };
  // las 4 marcas de las esquinas, en orden: arriba-izq (con hueco), arriba-der, abajo-der, abajo-izq
  O.marcadores = G => {
    const P = reduce(G, 560), w = P.w, h = P.h, win = Math.max(15, Math.round(Math.min(w, h) / 9)) | 1;
    const M = manchas(oscuros(P, win), w, h), minS = Math.max(4, Math.min(w, h) * 0.008), maxS = Math.min(w, h) * 0.14, cand = [];
    M.st.forEach(s => {
      const bw = s.x1 - s.x0 + 1, bh = s.y1 - s.y0 + 1;
      if (bw < minS || bh < minS || bw > maxS || bh > maxS || s.x0 < 1 || s.y0 < 1 || s.x1 > w - 2 || s.y1 > h - 2) return;
      if (bw / bh < 0.5 || bw / bh > 2 || s.n / (bw * bh) < 0.4) return;
      const cx = s.sx / s.n, cy = s.sy / s.n; let md = 0;
      for (let y = s.y0; y <= s.y1; y++) for (let x = s.x0; x <= s.x1; x++) if (M.lab[y * w + x] === s.r) { const d = (x - cx) * (x - cx) + (y - cy) * (y - cy); if (d > md) md = d; }
      const comp = s.n / Math.pow(Math.sqrt(md) + 0.71, 2);   // cuadrado ≈ 2, cuadrado con hueco ≈ 1.7, círculo ≈ 3
      if (comp < 1.2 || comp > 2.45) return;
      cand.push(s);
    });
    // afina el centro en la imagen grande y revisa si tiene hueco
    const k = P.k, afina = s => {
      const mg = Math.max(2, (s.x1 - s.x0 + 1) * 0.4), X0 = Math.max(0, Math.floor((s.x0 - mg) * k)), Y0 = Math.max(0, Math.floor((s.y0 - mg) * k)), X1 = Math.min(G.w, Math.ceil((s.x1 + 1 + mg) * k)), Y1 = Math.min(G.h, Math.ceil((s.y1 + 1 + mg) * k));
      let mn = 255, mx = 0; for (let y = Y0; y < Y1; y++) for (let x = X0; x < X1; x++) { const v = G.g[y * G.w + x]; if (v < mn) mn = v; if (v > mx) mx = v; }
      if (mx - mn < 40) return null; const t = (mn + mx) / 2; let sx = 0, sy = 0, n = 0;
      for (let y = Y0; y < Y1; y++) for (let x = X0; x < X1; x++) if (G.g[y * G.w + x] < t) { sx += x; sy += y; n++; }
      if (!n) return null; const cx = sx / n + 0.5, cy = sy / n + 0.5, lado = Math.sqrt(n / 0.92), hr = Math.max(1, Math.round(lado * 0.08));
      let hs = 0, hn = 0; for (let y = Math.round(cy) - hr; y <= Math.round(cy) + hr; y++) for (let x = Math.round(cx) - hr; x <= Math.round(cx) + hr; x++) if (x >= 0 && y >= 0 && x < G.w && y < G.h) { hs += G.g[y * G.w + x]; hn++; }
      return { x: cx, y: cy, n: n, lado: lado, mn: mn, mx: mx, hueco: hn > 0 && hs / hn > mn + 0.55 * (mx - mn) };
    };
    const cs = cand.sort((a, b) => b.n - a.n).slice(0, 14).map(afina).filter(Boolean);
    const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y), combos = [];
    // blanco del papel: lo más claro de la imagen (percentil 90)
    const hist = new Uint32Array(256); for (let i = 0; i < G.g.length; i += 7) hist[G.g[i]]++;
    let acc = 0, tot = 0; for (let v = 0; v < 256; v++) tot += hist[v]; let blanco = 255; for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= tot * 0.9) { blanco = v; break; } }
    const area4 = q => Math.abs((q[0][0] * q[1][1] - q[1][0] * q[0][1]) + (q[1][0] * q[2][1] - q[2][0] * q[1][1]) + (q[2][0] * q[3][1] - q[3][0] * q[2][1]) + (q[3][0] * q[0][1] - q[0][0] * q[3][1])) / 2;
    const ANI = []; for (let t = -6.5; t <= 6.5; t += 3.25) ANI.push([t, -6.5], [t, 6.5], [-6.5, t], [6.5, t]);
    // con la homografía de la combinación: cada marca mide lo esperado y está rodeada de papel
    const verifica = o => {
      const h = O.homografia(MC, o.map(p => [p.x, p.y])); if (!h) return false;
      for (let i = 0; i < 4; i++) {
        const c = MC[i], esperado = area4([[-4, -4], [4, -4], [4, 4], [-4, 4]].map(d => ap(h, c[0] + d[0], c[1] + d[1]))) * (i ? 0.97 : 0.84);
        if (o[i].n < esperado * 0.5 || o[i].n > esperado * 1.7) return false;
        const lim = o[i].mn + 0.5 * (blanco - o[i].mn); let claros = 0;
        ANI.forEach(d => { const p = ap(h, c[0] + d[0], c[1] + d[1]); if (bil(G, p[0], p[1]) > lim) claros++; });
        if (claros < ANI.length * 0.8) return false;
      }
      return true;
    };
    for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) for (let k2 = j + 1; k2 < cs.length; k2++) for (let l = k2 + 1; l < cs.length; l++) {
      const q = [cs[i], cs[j], cs[k2], cs[l]], hs = q.filter(p => p.hueco); if (hs.length !== 1) continue;
      const mx = (q[0].x + q[1].x + q[2].x + q[3].x) / 4, my = (q[0].y + q[1].y + q[2].y + q[3].y) / 4;
      q.sort((a, b) => Math.atan2(a.y - my, a.x - mx) - Math.atan2(b.y - my, b.x - mx));   // en la pantalla: sentido de las manecillas
      let conv = true; for (let t = 0; t < 4; t++) { const a = q[t], b = q[(t + 1) % 4], c = q[(t + 2) % 4]; if ((b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x) <= 0) conv = false; }
      if (!conv) continue;
      const s0 = q.indexOf(hs[0]), o = [0, 1, 2, 3].map(t => q[(s0 + t) % 4]);
      const arr = dist(o[0], o[1]), aba = dist(o[3], o[2]), izq = dist(o[0], o[3]), der = dist(o[1], o[2]);
      if (arr / aba > 1.8 || aba / arr > 1.8 || izq / der > 1.8 || der / izq > 1.8) continue;
      const asp = (arr + aba) / (izq + der); if (asp < 0.5 || asp > 1.05) continue;           // la hoja mide 174 × 234 entre marcas
      const esp = (arr + aba) / 2 * MK / 174; if (o.some(p => p.lado < esp * 0.45 || p.lado > esp * 2)) continue;
      combos.push({ o: o, area: area4(o.map(p => [p.x, p.y])) });
    }
    combos.sort((a, b) => b.area - a.area);
    for (let i = 0; i < combos.length && i < 60; i++) if (verifica(combos[i].o)) return combos[i].o;
    return null;
  };
  // homografía con 4 puntos: hoja (mm) → imagen (px)
  const resuelve = (M, b) => {
    const n = b.length, A2 = M.map((r, i) => r.concat([b[i]]));
    for (let c = 0; c < n; c++) {
      let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A2[r][c]) > Math.abs(A2[p][c])) p = r;
      if (Math.abs(A2[p][c]) < 1e-12) return null; const t = A2[c]; A2[c] = A2[p]; A2[p] = t;
      for (let r = 0; r < n; r++) if (r !== c) { const f = A2[r][c] / A2[c][c]; for (let k = c; k <= n; k++) A2[r][k] -= f * A2[c][k]; }
    }
    return A2.map((r, i) => r[n] / r[i]);
  };
  O.homografia = (src, dst) => {
    const M = [], b = [];
    for (let i = 0; i < 4; i++) { const x = src[i][0], y = src[i][1], X = dst[i][0], Y = dst[i][1]; M.push([x, y, 1, 0, 0, 0, -x * X, -y * X]); b.push(X); M.push([0, 0, 0, x, y, 1, -x * Y, -y * Y]); b.push(Y); }
    const h = resuelve(M, b); return h ? h.concat([1]) : null;
  };
  const ap = O.aplica = (h, x, y) => { const w = h[6] * x + h[7] * y + h[8]; return [(h[0] * x + h[1] * y + h[2]) / w, (h[3] * x + h[4] * y + h[5]) / w]; };
  const bil = (G, x, y) => {
    x -= 0.5; y -= 0.5; const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
    const p = (xx, yy) => G.g[Math.max(0, Math.min(G.h - 1, yy)) * G.w + Math.max(0, Math.min(G.w - 1, xx))];
    return p(x0, y0) * (1 - fx) * (1 - fy) + p(x0 + 1, y0) * fx * (1 - fy) + p(x0, y0 + 1) * (1 - fx) * fy + p(x0 + 1, y0 + 1) * fx * fy;
  };
  const AN8 = Array.from({ length: 8 }, (_, i) => [Math.cos(i * Math.PI / 4), Math.sin(i * Math.PI / 4)]), AN12 = Array.from({ length: 12 }, (_, i) => [Math.cos(i * Math.PI / 6), Math.sin(i * Math.PI / 6)]);
  // qué tan rellena está una burbuja: 0 = como el papel, 1 = negra
  const relleno = (G, h, b) => {
    let s = 0, n = 0; const pt = (dx, dy) => { const p = ap(h, b.x + dx, b.y + dy); return bil(G, p[0], p[1]); };
    s += pt(0, 0); n++; [0.3, 0.62].forEach(f => AN8.forEach(a => { s += pt(a[0] * R * f, a[1] * R * f); n++; }));
    const ref = AN12.map(a => pt(a[0] * R * 1.45, a[1] * R * 1.45)).sort((p, q) => p - q), papel = (ref[5] + ref[6] + ref[7] + ref[8]) / 4;
    return Math.max(0, Math.min(1, (papel - s / n) / Math.max(papel, 30)));
  };
  // umbral entre burbujas vacías y rellenas (Otsu), entre 0.22 y 0.5
  const otsu = vals => {
    const B = 50, hist = new Array(B).fill(0); vals.forEach(v => { hist[Math.min(B - 1, Math.floor(v * B))]++; });
    const N = vals.length; let sum = 0; hist.forEach((c, i) => { sum += i * c; });
    let sB = 0, wB = 0, best = -1, t = 0;
    for (let i = 0; i < B; i++) { wB += hist[i]; if (!wB) continue; const wF = N - wB; if (!wF) break; sB += i * hist[i]; const v = wB * wF * Math.pow(sB / wB - (sum - sB) / wF, 2); if (v > best) { best = v; t = i; } }
    return Math.max(0.22, Math.min(0.5, (t + 1) / B));
  };
  // una fila de burbujas → la marcada (o vacía, doble o dudosa)
  const decide = (d, T) => {
    const o = d.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]), m = o.filter(x => x[0] >= T);
    if (m.length === 1) return { i: m[0][1], e: 'ok' };
    if (m.length > 1) return m[0][0] - m[1][0] >= 0.22 ? { i: m[0][1], e: 'ok', borron: true } : { i: null, e: 'doble' };
    return { i: null, e: o.length && o[0][0] >= T * 0.6 ? 'dudosa' : 'blanco' };
  };
  // lee una hoja: G = imagen en grises { g, w, h }
  O.leer = (G, ex) => {
    const L = O.layout(ex), mk = O.marcadores(G); if (!mk) return { ok: false, err: 'esquinas' };
    const h = O.homografia(MC, mk.map(p => [p.x, p.y])); if (!h) return { ok: false, err: 'esquinas' };
    const dd = bs => bs.map(b => relleno(G, h, b));
    const fil = L.filas.map(f => dd(f.b)), dec = dd(L.dec), uni = dd(L.uni), ver = dd(L.ver);
    const T = otsu([].concat.apply([], fil).concat(dec, uni, ver));
    const d1 = decide(dec, T), d2 = decide(uni, T), dv = decide(ver, T);
    const num = d2.e === 'ok' && (d1.e === 'ok' || d1.e === 'blanco') ? (d1.e === 'ok' ? d1.i : 0) * 10 + d2.i : null;
    const resp = L.filas.map((f, i) => { const r = decide(fil[i], T); return { n: f.n, tipo: f.tipo, L: r.i == null ? null : f.ops[r.i], e: r.e, borron: !!r.borron, d: fil[i] }; });
    return { ok: true, h: h, mk: mk, T: T, L: L, num: num, ver: dv.e === 'ok' ? L.ver[dv.i].L : null, resp: resp, dd: { dec: dec, uni: uni, ver: ver } };
  };
  // calificación de lo leído con la clave de la versión
  const clave = x => x.b.tipo === 'vf' ? (x.vf ? 'V' : 'F') : LET[x.ok];
  O.califica = (ex, v, resp) => {
    const its = XM().version(ex, v || 'A'), m = {}; let pts = 0, max = 0, bien = 0;
    resp.forEach(r => { const x = its[r.n - 1]; if (!x || !AUTO[x.b.tipo]) return; const ok = r.L != null && r.L === clave(x); m[x.id] = ok ? 1 : 0; if (ok) { pts += x.pts; bien++; } max += x.pts; });
    return { m: m, pts: pts, max: max, bien: bien };
  };
  // figuras para dibujar encima del video o de la foto
  O.dibujo = (r, ex, v) => {
    const its = XM().version(ex, v || r.ver || 'A'), out = [{ pts: r.mk.map(p => ({ x: p.x, y: p.y })), color: '#1c7c45' }];
    const circ = (b, color, fill) => { const p = ap(r.h, b.x, b.y), q = ap(r.h, b.x + R, b.y); out.push({ c: [p[0], p[1], Math.hypot(q[0] - p[0], q[1] - p[1]) * 1.25], color: color, fill: fill }); };
    r.L.filas.forEach((f, i) => {
      const x = r.resp[i], it = its[f.n - 1], ok = it ? clave(it) : null;
      f.b.forEach((b, k) => {
        if (x.L === b.L) circ(b, x.L === ok ? '#1c7c45' : '#bf342b', x.L === ok ? 'rgba(28,124,69,.35)' : 'rgba(191,52,43,.35)');
        else if (x.e === 'doble' && x.d[k] >= r.T) circ(b, '#d68a00', 'rgba(214,138,0,.4)');
        else if (b.L === ok && x.L !== ok) circ(b, '#1c7c45', null);
      });
    });
    ['dec', 'uni', 'ver'].forEach(k => r.L[k].forEach((b, i) => { if (r.dd[k][i] >= r.T) circ(b, '#285ca8', 'rgba(40,92,168,.35)'); }));
    return out;
  };

  /* =================== revisar y guardar =================== */
  const alDe = (g, num) => num == null ? null : D.alumnos(g).find(a => Number(a.num) === num) || null;
  const nueva = r => { const g = D.grupoActual(), a = alDe(g, r.num); return { aid: a ? a.id : '', num: r.num, v: r.ver || 'A', sinVer: !r.ver, resp: r.resp.map(x => ({ n: x.n, tipo: x.tipo, L: x.L, e: x.e })) }; };
  O.guardar = (g, exId, aid, v, resp) => {
    let c = null;
    UD.run('omr', () => S.update('exa:' + g.id + ':' + exId, ex => {
      c = O.califica(ex, v, resp); ex.res = ex.res || {}; const prev = ex.res[aid] || {}, m = {};
      (ex.items || []).forEach(it => { const b = (E.BANCO || []).find(x => x.id === it.id); if (b && !AUTO[b.tipo] && prev.m && prev.m[it.id] != null) m[it.id] = prev.m[it.id]; });   // las abiertas ya calificadas se quedan
      Object.keys(c.m).forEach(k => { m[k] = c.m[k]; });
      ex.res[aid] = { v: v, m: m, np: false, lec: { r: resp.map(x => x.L || (x.e === 'doble' ? '?' : '-')).join(''), f: u.today() } };
    }, {}));
    const ex = XM().get(g, exId); if (ex) XM().sync(g, ex);
    return c;
  };
  function revHTML(enCam) {
    const s = E.ui.omr, g = D.grupoActual(), ex = XM().get(g, s.exId), r = s.r, al = D.alumnos(g);
    if (!ex) return '';
    if (!r) return '<div class="cam-res"><b>' + (s.estado === 'lee' ? 'Leyendo… no muevas el celular' : 'Apunta a la hoja') + '</b><span class="small">' + (s.estado === 'lee' ? 'Ya veo las 4 esquinas.' : 'Que se vean las 4 marcas negras de las esquinas, con buena luz y sin sombra.') + '</span></div>' +
      '<div class="row between gap wrap"><span class="small">' + s.hechos + (s.hechos === 1 ? ' hoja guardada' : ' hojas guardadas') + '</span>' + btn('Listo', 'cam-cerrar', '', 'small primary') + '</div>';
    const c = O.califica(ex, r.v, r.resp), L = O.layout(ex), its = XM().version(ex, r.v), a = al.find(x => x.id === r.aid), ya = a && (ex.res || {})[a.id] && X_pts(ex, a.id);
    const q = r.resp.map((x, i) => { const it = its[x.n - 1], ok = it ? clave(it) : '', est = x.L == null && (x.e === 'doble' || x.e === 'dudosa') ? 'warn' : x.L === ok ? 'ok' : 'bad';
      return '<button type="button" class="omr-q ' + est + '" data-act="omr-tog" data-i="' + i + '" aria-label="Pregunta ' + x.n + '"><small>' + x.n + '</small><b>' + (x.L || (x.e === 'doble' ? '2×' : x.e === 'dudosa' ? '?' : '—')) + '</b>' + (est !== 'ok' ? '<i>' + ok + '</i>' : '') + '</button>'; }).join('');
    return '<div class="omr-rev"><div class="row gap wrap omr-al"><select data-ch="omr-al" aria-label="Alumno">' + (a ? '' : '<option value="">' + (r.num == null ? '¿De quién es? No leí el número' : 'El número ' + r.num + ' no está en la lista') + '</option>') +
      al.map(x => '<option value="' + x.id + '"' + (x.id === r.aid ? ' selected' : '') + '>' + x.num + ' · ' + esc(u.corto(x.nombre)) + '</option>').join('') + '</select>' +
      '<div class="cl-seg">' + ['A', 'B'].map(v => btn('Versión ' + v, 'omr-ver', 'data-v="' + v + '"', 'small' + (r.v === v ? ' on' : ''))).join('') + '</div></div>' +
      '<p class="omr-pts"><b>' + u.round(c.pts, 1) + '</b> de ' + u.round(c.max, 1) + ' pts · ' + c.bien + ' de ' + r.resp.length + ' bien' + (L.abiertas ? (L.abiertas > 1 ? ' · las ' + L.abiertas + ' abiertas se califican a mano' : ' · la abierta se califica a mano') : '') +
      (r.sinVer ? '<br><span class="bad">No marcó la versión: revisa que sea la ' + r.v + '.</span>' : '') + (ya ? '<br><span class="warn">Ya tenía resultado: se reemplaza.</span>' : '') + '</p>' +
      '<div class="omr-grid">' + q + '</div><p class="muted small">Toca una respuesta para corregirla. Verde = bien · rojo = mal (abajo la correcta) · amarillo = revisa (dos marcas o muy tenue).</p>' +
      '<div class="row gap wrap">' + btn('✓ Guardar', 'omr-ok', a ? '' : 'disabled', 'primary') + btn(enCam ? '↺ Leer otra vez' : 'Saltar esta', 'omr-otra', '', 'ghost') + '</div></div>';
  }
  const X_pts = (ex, aid) => XM().puntaje(ex, aid) != null;
  const refresca = () => { const s = E.ui.omr; if (!s) return; if (s.modo === 'cam') E.cam.panel(); else fotoModal(); };
  A['omr-tog'] = el => {
    const s = E.ui.omr, x = s && s.r && s.r.resp[Number(el.dataset.i)]; if (!x) return;
    const ops = x.tipo === 'vf' ? ['V', 'F', null] : ['a', 'b', 'c', 'd', null], i = ops.indexOf(x.L); x.L = ops[(i + 1) % ops.length]; x.e = x.L ? 'ok' : 'blanco'; refresca();
  };
  CH['omr-al'] = el => { const s = E.ui.omr; if (s && s.r) { s.r.aid = el.value; refresca(); } };
  A['omr-ver'] = el => { const s = E.ui.omr; if (s && s.r) { s.r.v = el.dataset.v; s.r.sinVer = false; if (s.ultimo) s.dib = O.dibujo(s.ultimo, XM().get(D.grupoActual(), s.exId), s.r.v); refresca(); } };
  A['omr-ok'] = () => {
    const s = E.ui.omr, g = D.grupoActual(); if (!s || !s.r || !s.r.aid) return;
    const c = O.guardar(g, s.exId, s.r.aid, s.r.v, s.r.resp), a = D.alumno(g, s.r.aid); s.hechos++;
    u.toast('Guardado: ' + a.num + ' · ' + u.corto(a.nombre) + ' (' + u.round(c.pts, 1) + ' de ' + u.round(c.max, 1) + ')', 'ok', 1800);
    siguiente();
  };
  A['omr-otra'] = () => siguiente();
  function siguiente() {
    const s = E.ui.omr; if (!s) return;
    if (s.modo === 'cam') { s.r = null; s.ultimo = null; s.freeze = false; s.prev = ''; s.cuenta = 0; s.estado = 'busca'; s.pausa = Date.now() + 1200; E.cam.panel(); return; }
    s.i++; if (s.i >= s.cola.length) { E.modal.close(); E.ui.omr = null; u.toast(s.hechos + (s.hechos === 1 ? ' hoja guardada' : ' hojas guardadas'), 'ok', 3000); E.render(); return; }
    s.r = s.cola[s.i].r ? nueva(s.cola[s.i].r) : null; fotoModal();
  }

  /* ---------- con la cámara: se lee sola cuando la hoja se queda quieta ---------- */
  A['omr-cam'] = el => {
    const g = D.grupoActual(), ex = XM().get(g, el.dataset.id); if (!ex) return;
    if (!O.layout(ex).K) { u.toast('Este examen no tiene preguntas cerradas para burbujas', 'err'); return; }
    const s = E.ui.omr = { exId: ex.id, modo: 'cam', r: null, prev: '', cuenta: 0, freeze: false, hechos: 0, estado: 'busca', pausa: 0 };
    E.cam.abrir({ titulo: '📝 ' + corto(ex.titulo, 32), guia: 'hoja', cada: 220, proc: 1600, ancho: 1920, alto: 1080, panel: () => revHTML(true), alCerrar: () => { E.render(); },
      frame: (c, ctx, W, Hh) => {
        if (s.freeze) return s.dib || [];
        if (Date.now() < s.pausa) return [];
        const r = O.leer(O.gris(ctx.getImageData(0, 0, W, Hh).data, W, Hh), ex);
        if (!r.ok) { s.prev = ''; s.cuenta = 0; if (s.estado !== 'busca') { s.estado = 'busca'; E.cam.panel(); } return []; }
        const firma = r.num + '|' + r.ver + '|' + r.resp.map(x => x.L || x.e[0]).join('');
        s.cuenta = firma === s.prev ? s.cuenta + 1 : 1; s.prev = firma;
        const dib = O.dibujo(r, ex);
        if (s.cuenta >= 2) { s.freeze = true; s.dib = dib; s.ultimo = r; s.r = nueva(r); E.cam.bip(true); E.cam.panel(); }
        else if (s.estado !== 'lee') { s.estado = 'lee'; E.cam.panel(); }
        return dib;
      } });
  };

  /* ---------- con fotos (una o varias, de la galería o la cámara) ---------- */
  O.leerArchivo = async (file, ex) => {
    let src = null; try { src = await createImageBitmap(file); } catch (e) { src = null; }
    if (!src) { src = new Image(); const url = URL.createObjectURL(file); src.src = url; try { await src.decode(); } finally { URL.revokeObjectURL(url); } }
    const w0 = src.width, h0 = src.height, k = Math.min(1, 1800 / Math.max(w0, h0)), c = document.createElement('canvas'); c.width = Math.round(w0 * k); c.height = Math.round(h0 * k);
    const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(src, 0, 0, c.width, c.height); if (src.close) src.close();
    const r = O.leer(O.gris(x.getImageData(0, 0, c.width, c.height).data, c.width, c.height), ex);
    // vista chica con lo que se leyó (la foto no se guarda)
    const kv = Math.min(1, 520 / Math.max(c.width, c.height)), v = document.createElement('canvas'); v.width = Math.round(c.width * kv); v.height = Math.round(c.height * kv);
    const vx = v.getContext('2d'); vx.drawImage(c, 0, 0, v.width, v.height);
    if (r.ok) O.dibujo(r, ex).forEach(d => { vx.lineWidth = 2; vx.strokeStyle = d.color; vx.beginPath(); if (d.c) vx.arc(d.c[0] * kv, d.c[1] * kv, Math.max(2, d.c[2] * kv), 0, Math.PI * 2); else d.pts.forEach((p, i) => { if (i) vx.lineTo(p.x * kv, p.y * kv); else vx.moveTo(p.x * kv, p.y * kv); }); if (!d.c) vx.closePath(); if (d.fill) { vx.fillStyle = d.fill; vx.fill(); } vx.stroke(); });
    r.vista = v.toDataURL('image/jpeg', 0.75); c.width = c.height = 0;
    return r;
  };
  CH['omr-fotos'] = async el => {
    const g = D.grupoActual(), ex = XM().get(g, el.dataset.id), fs = Array.prototype.slice.call(el.files || []); el.value = ''; if (!ex || !fs.length) return;
    const s = E.ui.omr = { exId: ex.id, modo: 'foto', cola: [], i: 0, hechos: 0, r: null };
    for (let i = 0; i < fs.length; i++) {
      u.toast('Leyendo foto ' + (i + 1) + ' de ' + fs.length + '…', '', 1500);
      let r = null; try { r = await O.leerArchivo(fs[i], ex); } catch (e) { r = { ok: false, err: 'foto' }; }
      s.cola.push({ nombre: fs[i].name, r: r && r.ok ? r : null, vista: r && r.vista, err: r && !r.ok ? r.err : '' });
    }
    s.r = s.cola[0].r ? nueva(s.cola[0].r) : null; fotoModal();
  };
  function fotoModal() {
    const s = E.ui.omr, it = s.cola[s.i], tit = '📝 Hoja ' + (s.i + 1) + ' de ' + s.cola.length;
    const h = (it.vista ? '<img class="omr-vista" src="' + it.vista + '" alt="Hoja leída">' : '') +
      (s.r ? revHTML(false) : '<p class="bad">No encontré las 4 esquinas de la hoja en esta foto.</p><p class="small muted">Toma la foto de frente, con toda la hoja dentro, buena luz y sin sombras sobre las marcas negras.</p>' + btn('Saltar', 'omr-otra', '', 'primary'));
    const m = document.getElementById('modal'), b = document.getElementById('modal-body');
    if (m && !m.hidden && b) { const t = m.querySelector('.sheet-h h3'), sh = m.querySelector('.sheet'), sc = sh ? sh.scrollTop : 0; if (t) t.textContent = tit; b.innerHTML = h; if (sh) sh.scrollTop = sc; } else E.modal.open(tit, h);
  }

  /* =================== en Examen: pestaña «Con foto» =================== */
  O.capturaHTML = (g, ex) => {
    const L = O.layout(ex), al = D.alumnos(g), res = ex.res || {};
    if (!L.K) return card('<p>Este examen solo tiene preguntas abiertas: califícalo «Por alumno».</p>');
    const hechos = al.filter(a => res[a.id] && res[a.id].lec), fila = a => { const p = XM().puntaje(ex, a.id), r = res[a.id];
      return '<li><span>' + a.num + ' · ' + esc(u.corto(a.nombre)) + '</span><span class="small ' + (r && r.lec ? 'okc' : 'muted') + '">' + (r && r.np ? 'NP' : r && r.lec ? '📷 ' + u.round(p, 1) + ' / ' + ex.total : p != null ? '✍️ ' + u.round(p, 1) : 'pendiente') + '</span></li>'; };
    return card('<h3>📷 Calificar con foto</h3><ol class="small omr-pasos"><li>Imprime la hoja de respuestas: una por alumno (ya trae su número) o una en blanco para fotocopiar.</li><li>Cada alumno rellena sus burbujas y escribe su versión (A o B).</li><li>Escanea las hojas con la cámara: cada una se lee sola cuando la tienes quieta. También puedes subir fotos.</li><li>Revisa lo que salga en amarillo y guarda.' + (L.abiertas ? (L.abiertas > 1 ? ' Las ' + L.abiertas + ' abiertas las calificas «Por alumno».' : ' La abierta la calificas «Por alumno».') : '') + '</li></ol>' +
      '<div class="row gap wrap">' + btn('📷 Escanear hojas', 'omr-cam', 'data-id="' + ex.id + '"', 'primary') +
      '<label class="btn"><input type="file" accept="image/*" multiple hidden data-ch="omr-fotos" data-id="' + ex.id + '">🖼 Subir fotos</label></div>' +
      '<div class="row gap wrap mt">' + btn(icon('print') + ' Hojas con número de lista', 'omr-print', 'data-id="' + ex.id + '" data-m="alumnos"', 'small') + btn(icon('print') + ' Hoja en blanco', 'omr-print', 'data-id="' + ex.id + '" data-m="blanco"', 'small') + '</div>' +
      '<p class="muted small">' + L.K + ' preguntas cerradas en burbujas (código ' + esc(O.firma(ex)) + '). Si cambias preguntas después de imprimir, vuelve a imprimir las hojas. La foto no se guarda: solo las respuestas.</p>') +
      card('<div class="row between gap wrap"><h3>Hojas leídas</h3><span class="small muted">' + hechos.length + ' de ' + al.length + '</span></div><ul class="omr-lista">' + al.map(fila).join('') + '</ul>');
  };
  // desde la pantalla Cámara: lleva al último examen, a la pestaña «Con foto»
  A['omr-ir'] = () => { const g = D.grupoActual(), xs = g ? XM().list(g) : []; E.ui.exModo = 'foto'; location.hash = xs.length ? '#/examen/' + xs[0].id + '/captura' : '#/examen'; if (!xs.length) u.toast('Primero genera un examen recomendado', '', 3500); };
})();
