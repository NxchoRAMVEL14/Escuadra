/* Escuadra · Banco de preguntas para el examen recomendado.
   Tipos: om = opción múltiple (la primera opción es la correcta; se revuelven al imprimir), vf = verdadero o falso,
   ab = abierta (respuesta modelo), calc = problema con datos que cambian en cada versión (generador con semilla).
   Nivel: 1 = recordar, 2 = comprender, 3 = aplicar. Todo sale del contenido de Temas (programa SEP 2024 y su bibliografía). */
(function () {
  'use strict';
  const E = window.E;
  const f = (n, d) => Number(n).toLocaleString('es-MX', { maximumFractionDigits: d == null ? 1 : d, useGrouping: false });
  const pick = (rnd, a) => a[Math.floor(rnd() * a.length) % a.length];
  // opciones: la correcta primero, sin repetidas; si faltan, completa con las de respaldo
  const ops = (ok, cands, resp) => { const out = [ok]; cands.concat(resp || []).forEach(c => { if (out.length < 4 && out.indexOf(c) < 0) out.push(c); }); return out; };
  const PI = Math.PI;

  /* ---------- generadores de problemas ---------- */
  const G = E.GEN = {
    gdl: rnd => {
      let n, j1, j2, M, t = 0;
      do { n = pick(rnd, [4, 5, 6]); j2 = pick(rnd, [0, 0, 1]); j1 = n + pick(rnd, [-1, 0, 1, 2]); M = 3 * (n - 1) - 2 * j1 - j2; } while ((M < 0 || M > 2 || j1 < 3) && ++t < 80);
      if (M < 0 || M > 2) { n = 4; j1 = 4; j2 = 0; M = 1; }
      const L = m => 'M = ' + m + (m <= 0 ? ' (estructura: no se mueve)' : m === 1 ? ' (un motor mueve todo)' : ' (necesita ' + m + ' entradas)');
      const d = [3 * n - 2 * j1 - j2, 3 * (n - 1) - j1 - j2, 3 * (n - 1) - 2 * j1 + j2, M + 1, M - 1, M + 2].filter(x => x !== M);
      return { q: 'Un mecanismo plano tiene n = ' + n + ' eslabones (incluida la base), j1 = ' + j1 + ' pares giratorios o prismáticos y j2 = ' + j2 + (j2 === 1 ? ' par superior' : ' pares superiores') + ' (leva o engrane). Calcula su movilidad con M = 3(n − 1) − 2·j1 − j2.',
        op: ops(L(M), d.map(L)), r: 'M = 3(' + n + ' − 1) − 2·' + j1 + ' − ' + j2 + ' = ' + 3 * (n - 1) + ' − ' + 2 * j1 + ' − ' + j2 + ' = ' + M + '.' };
    },
    grashof: rnd => {
      let L, o, t = 0;
      do { L = []; while (L.length < 4) { const x = 5 * (4 + Math.floor(rnd() * 21)); if (L.indexOf(x) < 0) L.push(x); } o = L.slice().sort((a, b) => a - b); } while ((o[0] + o[3] === o[1] + o[2] || o[3] >= o[0] + o[1] + o[2] || (o[0] + o[3] > o[1] + o[2] && rnd() < 0.6)) && ++t < 50);
      const s = o[0], l = o[3], pq = o[1] + o[2], pos = Math.floor(rnd() * 4), i = L.indexOf(s), R = [0, 1, 2, 3].map(k => L[(i - pos + k + 4) % 4]);
      const gr = s + l < pq, T = ['Manivela-balancín', 'Doble manivela', 'Doble balancín', 'Triple balancín'];
      const ok = !gr ? T[3] : pos === 0 ? T[1] : pos === 2 ? T[2] : T[0];
      const donde = pos === 0 ? 'el más corto es la base' : pos === 2 ? 'el más corto es el acoplador' : 'el más corto está unido a la base';
      return { q: 'Un mecanismo de cuatro barras mide: base = ' + R[0] + ' mm, eslabón de entrada (unido a la base) = ' + R[1] + ' mm, acoplador = ' + R[2] + ' mm y eslabón de salida (unido a la base) = ' + R[3] + ' mm. Según la ley de Grashof, ¿qué tipo de mecanismo es?',
        op: ops(ok, T), r: 's + l = ' + s + ' + ' + l + ' = ' + (s + l) + '; p + q = ' + o[1] + ' + ' + o[2] + ' = ' + pq + '. ' + (gr ? (s + l) + ' ≤ ' + pq + ': es de Grashof y ' + donde + ' → ' + ok + '.' : (s + l) + ' > ' + pq + ': no es de Grashof → triple balancín.') };
    },
    biela: rnd => {
      const r = pick(rnd, [15, 20, 25, 30, 35, 40]);
      if (rnd() < 0.5) return { q: 'La manivela de un mecanismo biela-manivela mide ' + r + ' mm (del centro del eje al centro del pasador). ¿Cuál es la carrera de la corredera?', op: ops(2 * r + ' mm', [r + ' mm', 4 * r + ' mm', f(r / 2) + ' mm']), r: 'Carrera = 2 × r = 2 × ' + r + ' = ' + 2 * r + ' mm.' };
      const c = 2 * r; return { q: 'Necesitas que la corredera de un mecanismo biela-manivela tenga una carrera de ' + c + ' mm (distancia entre sus dos puntos muertos). ¿Qué radio de manivela necesitas?', op: ops(r + ' mm', [c + ' mm', 2 * c + ' mm', f(r / 2) + ' mm']), r: 'Carrera = 2r → r = ' + c + ' / 2 = ' + r + ' mm.' };
    },
    excentrica: rnd => { const e = pick(rnd, [4, 5, 6, 7, 8, 9, 10, 12, 15]); return { q: 'Una leva excéntrica tiene una excentricidad de ' + e + ' mm. ¿Cuál es la carrera del seguidor?', op: ops(2 * e + ' mm', [e + ' mm', 4 * e + ' mm', f(e / 2) + ' mm']), r: 'Carrera = 2 × e = 2 × ' + e + ' = ' + 2 * e + ' mm.' }; },
    escala: rnd => {
      if (rnd() < 0.6) { let L, k, t = 0; do { L = pick(rnd, [120, 160, 200, 240, 300, 400, 500, 600]); k = pick(rnd, [2, 4, 5]); } while (L % k && ++t < 30); if (L % k) { L = 240; k = 2; }
        const P = L / k, x = (p, c) => 'Mide ' + p + ' mm en el papel y la cota dice ' + c;
        return { q: 'Una pieza de ' + L + ' mm se dibuja a escala 1:' + k + '. ¿Cuánto mide en el papel y qué número se escribe en la cota?', op: ops(x(P, L), [x(P, P), x(L * k, L), x(L, P)]), r: 'Papel: ' + L + ' / ' + k + ' = ' + P + ' mm. La cota siempre dice la medida real: ' + L + '.' }; }
      const S = pick(rnd, [6, 8, 12, 15]), k = pick(rnd, [2, 5]), x = (p, c) => 'Mide ' + p + ' mm en el papel y la cota dice ' + c;
      return { q: 'Una pieza pequeña de ' + S + ' mm se dibuja a escala ' + k + ':1. ¿Cuánto mide en el papel y qué número se escribe en la cota?', op: ops(x(S * k, S), [x(S * k, S * k), x(f(S / k), S), x(S, S * k)]), r: 'Papel: ' + S + ' × ' + k + ' = ' + S * k + ' mm. La cota dice la medida real: ' + S + '.' };
    },
    engranes: rnd => {
      let Z1, i, t = 0; do { Z1 = pick(rnd, [10, 12, 15, 16, 18, 20, 24]); i = pick(rnd, [2, 2.5, 3, 4]); } while ((Z1 * i) % 1 && ++t < 30); if ((Z1 * i) % 1) { Z1 = 12; i = 3; }
      let Z2 = Z1 * i; const sube = rnd() < 0.3; if (sube) { const x = Z1; Z1 = Z2; Z2 = x; }
      const n1 = pick(rnd, [600, 900, 1200, 1500, 1800]), r = Z2 / Z1, n2 = n1 / r;
      return { q: 'Un engrane motriz de Z1 = ' + Z1 + ' dientes gira a ' + n1 + ' rpm e impulsa a un engrane de Z2 = ' + Z2 + ' dientes. ¿A cuántas rpm gira la salida?', op: ops(f(n2) + ' rpm', [f(n1 * r) + ' rpm', n1 + ' rpm', f(n2 * 2) + ' rpm'], [f(n2 / 2) + ' rpm', f(n2 * 1.5) + ' rpm']),
        r: 'i = Z2 / Z1 = ' + Z2 + ' / ' + Z1 + ' = ' + f(r, 2) + '; n2 = n1 × Z1 / Z2 = ' + n1 + ' × ' + Z1 + ' / ' + Z2 + ' = ' + f(n2) + ' rpm. ' + (sube ? 'La salida gira más rápido y con menos torque.' : 'La salida gira más lento y con ' + f(r, 2) + ' veces el torque (ideal).') };
    },
    centros: rnd => {
      const m = pick(rnd, [1, 1.5, 2, 2.5, 3]), Z1 = pick(rnd, [12, 14, 16, 18, 20, 24]), Z2 = pick(rnd, [30, 32, 36, 40, 45, 48]), a = m * (Z1 + Z2) / 2;
      return { q: 'Dos engranes rectos externos de módulo m = ' + f(m) + ' mm tienen Z1 = ' + Z1 + ' y Z2 = ' + Z2 + ' dientes. ¿A qué distancia deben quedar sus centros?', op: ops(f(a) + ' mm', [f(m * (Z1 + Z2)) + ' mm', f(m * (Z2 - Z1) / 2) + ' mm', f((Z1 + Z2) / 2) + ' mm'], [f(a * 1.5) + ' mm']), r: 'a = m(Z1 + Z2) / 2 = ' + f(m) + ' × (' + Z1 + ' + ' + Z2 + ') / 2 = ' + f(a) + ' mm.' };
    },
    poleas: rnd => {
      let D1, i, t = 0; do { D1 = pick(rnd, [50, 60, 75, 80, 100]); i = pick(rnd, [1.5, 2, 2.5, 3, 4]); } while ((D1 * i) % 1 && ++t < 30);
      let D2 = D1 * i; if (i <= 2 && rnd() < 0.4) { const x = D1; D1 = D2; D2 = x; }
      const n1 = pick(rnd, [1200, 1500, 1750, 1800]), n2 = n1 * D1 / D2;
      return { q: 'La polea del motor (D1 = ' + D1 + ' mm) gira a ' + n1 + ' rpm y mueve con banda una polea de D2 = ' + D2 + ' mm. ¿A cuántas rpm gira la polea conducida?', op: ops(f(n2) + ' rpm', [f(n1 * D2 / D1) + ' rpm', n1 + ' rpm', f(n2 / 2) + ' rpm'], [f(n2 * 2) + ' rpm']),
        r: 'i = D2 / D1 = ' + D2 + ' / ' + D1 + ' = ' + f(D2 / D1, 2) + '; n2 = n1 / i = ' + n1 + ' × ' + D1 + ' / ' + D2 + ' = ' + f(n2) + ' rpm.' };
    },
    tornillo: rnd => {
      const p = pick(rnd, [1, 1.25, 1.5, 2, 2.5, 3, 4, 5]);
      if (rnd() < 0.55) { const v = pick(rnd, [8, 10, 12, 16, 20, 24, 30, 40]), a = p * v; return { q: 'Un tornillo de una entrada tiene paso de ' + f(p, 2) + ' mm. ¿Cuánto avanza la tuerca si el tornillo da ' + v + ' vueltas?', op: ops(f(a, 2) + ' mm', [f(v / p, 2) + ' mm', f(p + v, 2) + ' mm', f(2 * a, 2) + ' mm'], [f(a / 2, 2) + ' mm', f(a * 1.5, 2) + ' mm']), r: 'Avance = paso × vueltas = ' + f(p, 2) + ' × ' + v + ' = ' + f(a, 2) + ' mm.' }; }
      const k = pick(rnd, [10, 12, 16, 20, 25, 30, 40]), d = p * k;
      return { q: 'Un husillo de paso ' + f(p, 2) + ' mm (una entrada) debe mover una mesa ' + f(d, 2) + ' mm. ¿Cuántas vueltas debe dar?', op: ops(k + ' vueltas', [f(d * p, 2) + ' vueltas', 2 * k + ' vueltas', f(k / 2, 1) + ' vueltas'], [f(k * 1.5, 1) + ' vueltas', (k + 10) + ' vueltas']), r: 'Vueltas = distancia / paso = ' + f(d, 2) + ' / ' + f(p, 2) + ' = ' + k + '.' };
    },
    cremallera: rnd => {
      const m = pick(rnd, [1, 1.5, 2]), Z = pick(rnd, [12, 15, 16, 18, 20, 24]), v = pick(rnd, [1, 2, 3]), a = PI * m * Z * v;
      return { q: 'Un piñón de módulo m = ' + f(m) + ' mm y Z = ' + Z + ' dientes mueve una cremallera. ¿Cuánto avanza la cremallera si el piñón da ' + v + (v === 1 ? ' vuelta' : ' vueltas') + '?', op: ops(f(a) + ' mm', [f(m * Z * v) + ' mm', f(a / 2) + ' mm', f(PI * Z * v) + ' mm'], [f(a * 2) + ' mm', f(a / 3) + ' mm']),
        r: 'Avance por vuelta = π · m · Z = π × ' + f(m) + ' × ' + Z + ' = ' + f(PI * m * Z) + ' mm; × ' + v + ' = ' + f(a) + ' mm.' };
    },
    presion: rnd => {
      let F, A, t = 0; do { F = pick(rnd, [600, 800, 1200, 1500, 1800, 2400, 3000]); A = pick(rnd, [500, 1000, 1500, 2000, 2500, 3000]); } while (Math.round(10 * F / A * 100) !== 10 * F / A * 100 && ++t < 40);
      const b = 10 * F / A;
      return { q: 'Una fuerza de ' + F + ' N actúa sobre un área de ' + A + ' mm². ¿Qué presión es, en bar? (1 bar = 0.1 N/mm²)', op: ops(f(b, 2) + ' bar', [f(F / A, 3) + ' bar', f(100 * F / A, 1) + ' bar', f(10 * A / F, 2) + ' bar'], [f(b * 2, 2) + ' bar']), r: 'P = F / A = ' + F + ' / ' + A + ' = ' + f(F / A, 3) + ' N/mm² = ' + f(b, 2) + ' bar.' };
    },
    psi: rnd => { const b = pick(rnd, [2, 3, 4, 5, 6, 7, 8]); return { q: 'El regulador de una máquina marca ' + b + ' bar. ¿Cuántos psi son aproximadamente? (1 bar ≈ 14.5 psi)', op: ops(f(b * 14.5) + ' psi', [f(b / 14.5, 2) + ' psi', b * 100 + ' psi', b * 10 + ' psi']), r: b + ' × 14.5 = ' + f(b * 14.5) + ' psi.' }; },
    caudal: rnd => { const V = pick(rnd, [10, 15, 20, 30, 40, 60]), t = pick(rnd, [2, 4, 5, 8, 10]), Q = V / t; return { q: 'Una jeringa de ' + V + ' mL se vacía en ' + t + ' s. ¿Cuál es el caudal?', op: ops(f(Q, 2) + ' mL/s', [V * t + ' mL/s', f(t / V, 2) + ' mL/s', f(Q * 60, 1) + ' mL/s'], [f(Q * 2, 2) + ' mL/s']), r: 'Q = V / t = ' + V + ' / ' + t + ' = ' + f(Q, 2) + ' mL/s.' }; },
    pascal: rnd => {
      const D1 = pick(rnd, [10, 12, 15, 20]), D2 = pick(rnd, [30, 40, 45, 50, 60]), F1 = pick(rnd, [10, 20, 25, 50, 100]), k = (D2 / D1) * (D2 / D1), F2 = F1 * k;
      return { q: 'En una prensa hidráulica, el émbolo chico mide D1 = ' + D1 + ' mm y el grande D2 = ' + D2 + ' mm. Si empujas el chico con ' + F1 + ' N, ¿con qué fuerza empuja el grande?', op: ops(f(F2) + ' N', [f(F1 * D2 / D1) + ' N', f(F1 / k, 2) + ' N', F1 + ' N'], [f(F2 * 2) + ' N']),
        r: 'Relación de áreas = (D2 / D1)² = (' + D2 + ' / ' + D1 + ')² ≈ ' + f(k, 2) + '; F2 = F1 × D2² / D1² = ' + F1 + ' × ' + D2 * D2 + ' / ' + D1 * D1 + ' = ' + f(F2) + ' N.' };
    },
    pascalRec: rnd => {
      const D1 = pick(rnd, [10, 15, 20]), D2 = pick(rnd, [30, 40, 60]), x = pick(rnd, [30, 45, 60, 90]), k = (D2 / D1) * (D2 / D1), y = x / k;
      return { q: 'En una prensa hidráulica con émbolos de D1 = ' + D1 + ' mm y D2 = ' + D2 + ' mm, el émbolo chico avanza ' + x + ' mm. ¿Cuánto avanza el grande?', op: ops(f(y, 2) + ' mm', [f(x * k) + ' mm', f(x * D1 / D2, 1) + ' mm', x + ' mm'], [f(y * 2, 2) + ' mm']),
        r: 'Relación de áreas = (' + D2 + ' / ' + D1 + ')² ≈ ' + f(k, 2) + '; avance = x × D1² / D2² = ' + x + ' × ' + D1 * D1 + ' / ' + D2 * D2 + ' = ' + f(y, 2) + ' mm. Ganas fuerza, pierdes recorrido.' };
    },
    cilindro: rnd => {
      const D = pick(rnd, [20, 25, 32, 40, 50, 63]), P = pick(rnd, [4, 5, 6, 7]), A = PI * D * D / 4, F = 0.1 * P * A;
      return { q: 'Un cilindro neumático de doble efecto tiene émbolo de Ø' + D + ' mm y trabaja a ' + P + ' bar. ¿Cuál es su fuerza teórica de avance? (1 bar = 0.1 N/mm²)', op: ops(f(F, 0) + ' N', [f(P * A, 0) + ' N', f(4 * F, 0) + ' N', f(F / 4, 0) + ' N']),
        r: 'A = π · D² / 4 = π × ' + D + '² / 4 ≈ ' + f(A, 0) + ' mm²; P = ' + P + ' bar = ' + f(0.1 * P, 1) + ' N/mm²; F = ' + f(0.1 * P, 1) + ' × ' + f(A, 0) + ' ≈ ' + f(F, 0) + ' N (≈ ' + f(F / 9.81, 0) + ' kgf).' };
    },
    cilindroRet: rnd => {
      const c = pick(rnd, [[20, 8], [25, 10], [32, 12], [40, 16], [50, 20], [63, 20]]), D = c[0], d = c[1], P = pick(rnd, [4, 5, 6, 7]);
      const A = PI * D * D / 4, a = PI * d * d / 4, F = 0.1 * P * (A - a);
      return { q: 'Un cilindro de doble efecto tiene émbolo de Ø' + D + ' mm y vástago de Ø' + d + ' mm, a ' + P + ' bar. ¿Cuál es su fuerza teórica de retroceso? (1 bar = 0.1 N/mm²)', op: ops(f(F, 0) + ' N', [f(0.1 * P * A, 0) + ' N', f(0.1 * P * a, 0) + ' N', f(P * (A - a), 0) + ' N']),
        r: 'A = π·' + D + '²/4 ≈ ' + f(A, 0) + ' mm²; a = π·' + d + '²/4 ≈ ' + f(a, 0) + ' mm²; F = ' + f(0.1 * P, 1) + ' × (' + f(A, 0) + ' − ' + f(a, 0) + ') ≈ ' + f(F, 0) + ' N. El retroceso siempre es más débil que el avance.' };
    },
    torque: rnd => {
      const T = pick(rnd, [0.02, 0.04, 0.05, 0.08, 0.1]), r = pick(rnd, [5, 8, 10, 15, 20]), F = T / (r / 1000);
      return { q: 'Un motorreductor da un torque de ' + f(T, 2) + ' N·m y enrolla un hilo en un carrete de radio ' + r + ' mm. ¿Con qué fuerza puede jalar el hilo?', op: ops(f(F) + ' N', [f(T / r, 4) + ' N', f(T * r, 2) + ' N', f(F / 2) + ' N'], [f(F * 2) + ' N']),
        r: 'F = T / r = ' + f(T, 2) + ' / ' + f(r / 1000, 3) + ' m = ' + f(F) + ' N (puede levantar ≈ ' + f(F / 9.81, 2) + ' kg). Carrete más chico = más fuerza.' };
    }
  };

  /* ---------- preguntas ---------- */
  const B = E.BANCO = [
    // Submódulo 1 (nivelación)
    { id: 'pl1', tema: 'sm1-planos', tipo: 'om', niv: 1, q: 'En un plano, ¿qué representa una línea discontinua (punteada)?', op: ['Aristas o contornos ocultos', 'Ejes de simetría', 'Contornos visibles', 'Líneas de cota'] },
    { id: 'pl2', tema: 'sm1-planos', tipo: 'om', niv: 1, q: '¿Qué significa «Ø30» en un plano?', op: ['Un diámetro de 30 mm', 'Un radio de 30 mm', 'Una profundidad de 30 mm', 'Un ángulo de 30°'] },
    { id: 'pl3', tema: 'sm1-planos', tipo: 'om', niv: 1, q: '¿Qué línea se usa para los ejes de simetría y los centros de barrenos?', op: ['Trazo y punto', 'Continua gruesa', 'Discontinua', 'Continua fina'] },
    { id: 'pl4', tema: 'sm1-planos', tipo: 'calc', niv: 3, gen: 'escala' },
    { id: 'pl5', tema: 'sm1-planos', tipo: 'vf', niv: 2, q: 'Si el dibujo está a escala 1:2, la cota debe escribir la mitad de la medida real.', v: false, exp: 'La cota siempre dice la medida real, aunque el dibujo esté a escala.' },
    { id: 'pl6', tema: 'sm1-planos', tipo: 'ab', niv: 2, q: 'Menciona dos errores que vuelven ambiguo un plano y cómo se corrigen.', r: 'Cotas dentro de la pieza o cruzadas (van fuera y sin cruzarse); repetir una cota en dos vistas; olvidar escala o sistema de proyección; escribir la medida del papel en vez de la real.' },
    { id: 'rs1', tema: 'sm1-restricciones', tipo: 'om', niv: 1, q: 'En FreeCAD, ¿qué te indica que un boceto ya está listo?', op: ['El aviso «completamente restringido» y el cambio de color', 'Que el contorno se ve cerrado y sin huecos a simple vista', 'Que el boceto ya tiene una cota en cada línea dibujada', 'Que ya guardaste el archivo con el nombre de la pieza'] },
    { id: 'rs2', tema: 'sm1-restricciones', tipo: 'om', niv: 1, q: '¿Qué restricción une dos puntos para cerrar un contorno?', op: ['Coincidente', 'Tangente', 'Horizontal', 'Distancia'] },
    { id: 'rs3', tema: 'sm1-restricciones', tipo: 'om', niv: 2, q: '¿Cuál de estas es una restricción dimensional?', op: ['Radio de 4 mm', 'Paralela', 'Tangente', 'Vertical'] },
    { id: 'rs4', tema: 'sm1-restricciones', tipo: 'vf', niv: 2, q: 'Si pones dos restricciones que se contradicen, FreeCAD marca un conflicto.', v: true, exp: 'Las restricciones duplicadas o contradictorias se marcan en rojo.' },
    { id: 'rs5', tema: 'sm1-restricciones', tipo: 'ab', niv: 2, q: '¿Qué ventaja tiene un boceto paramétrico si mañana cambia una medida del diseño?', r: 'Solo cambias el número de la cota y todo el modelo se actualiza; no hay que volver a dibujar.' },
    // Mecanismos
    { id: 'me1', tema: 'sm2-mecanismo', tipo: 'om', niv: 1, q: '¿Cuál es la diferencia entre máquina y mecanismo?', op: ['La máquina transforma energía en trabajo útil; el mecanismo transmite o transforma movimiento y fuerza', 'Son lo mismo: las dos palabras nombran a cualquier aparato que se mueve', 'El mecanismo siempre lleva un motor eléctrico y la máquina funciona a mano', 'La máquina tiene un solo eslabón y el mecanismo tiene varios eslabones unidos'] },
    { id: 'me2', tema: 'sm2-mecanismo', tipo: 'om', niv: 1, q: '¿Qué par cinemático forma un cajón con sus guías?', op: ['Prismático', 'Giratorio', 'Helicoidal', 'Superior (leva-seguidor)'] },
    { id: 'me3', tema: 'sm2-mecanismo', tipo: 'om', niv: 2, q: 'Tres piezas soldadas entre sí que se mueven juntas cuentan como…', op: ['Un solo eslabón', 'Tres eslabones', 'Dos eslabones y un par', 'Un par cinemático'] },
    { id: 'me4', tema: 'sm2-mecanismo', tipo: 'om', niv: 2, q: 'En unas pinzas de presión, ¿qué eslabón es la base?', op: ['El mango fijo con la quijada fija', 'La quijada móvil', 'El mango que aprietas', 'La pequeña biela interna'] },
    { id: 'me5', tema: 'sm2-mecanismo', tipo: 'vf', niv: 1, q: 'La base o bancada no cuenta como eslabón porque no se mueve.', v: false, exp: 'La base sí es un eslabón: es el eslabón fijo de referencia.' },
    { id: 'me6', tema: 'sm2-mecanismo', tipo: 'om', niv: 2, q: '¿Qué tipo de par forman una leva y su seguidor?', op: ['Par superior', 'Par giratorio', 'Par prismático', 'Par helicoidal'] },
    { id: 'mv1', tema: 'sm2-movimientos', tipo: 'om', niv: 1, q: '¿Qué movimiento hace el pistón de un motor?', op: ['Alternativo', 'Giratorio continuo', 'Lineal', 'Oscilante'] },
    { id: 'mv2', tema: 'sm2-movimientos', tipo: 'om', niv: 1, q: '¿Qué movimiento hace un limpiaparabrisas?', op: ['Oscilante', 'Alternativo', 'Lineal', 'Giratorio continuo'] },
    { id: 'mv3', tema: 'sm2-movimientos', tipo: 'om', niv: 2, q: '¿Qué mecanismo convierte un giro en movimiento lineal?', op: ['Piñón-cremallera', 'Engranes rectos', 'Engranes cónicos', 'Manivela-balancín'] },
    { id: 'mv4', tema: 'sm2-movimientos', tipo: 'om', niv: 3, q: 'Un motor gira siempre en un sentido y necesitas que un brazo oscile de un lado a otro. ¿Qué mecanismo usas?', op: ['Manivela-balancín (cuatro barras)', 'Tornillo-tuerca', 'Poleas con banda abierta', 'Tren de engranes'] },
    { id: 'mv5', tema: 'sm2-movimientos', tipo: 'vf', niv: 2, q: 'Lineal y alternativo son lo mismo: los dos van en línea recta.', v: false, exp: 'Lineal avanza en una dirección; alternativo va y viene.' },
    { id: 'mv6', tema: 'sm2-movimientos', tipo: 'ab', niv: 3, q: 'Un motor debe subir y bajar una compuerta. Propón un mecanismo y justifica tu elección.', r: 'Biela-manivela, piñón-cremallera o tornillo-tuerca, justificando con la carrera, la fuerza y la velocidad (por ejemplo, tornillo: mucha fuerza y no se baja solo; cremallera: más rápido).' },
    { id: 'gd1', tema: 'sm2-gdl', tipo: 'calc', niv: 3, gen: 'gdl' },
    { id: 'gd2', tema: 'sm2-gdl', tipo: 'om', niv: 1, q: 'En M = 3(n − 1) − 2·j1 − j2, ¿qué es n?', op: ['El número de eslabones, incluida la base', 'El número de pares', 'El número de motores', 'El número de eslabones sin contar la base'] },
    { id: 'gd3', tema: 'sm2-gdl', tipo: 'om', niv: 2, q: 'Un mecanismo da M = 0. ¿Qué significa?', op: ['Es una estructura rígida: no se mueve', 'Necesita un motor', 'Necesita dos motores', 'Se mueve libremente sin control'] },
    { id: 'gd4', tema: 'sm2-gdl', tipo: 'om', niv: 2, q: 'Un mecanismo da M = 2 y solo le pones un motor. ¿Qué pasa?', op: ['Una parte queda sin control y se mueve de forma impredecible', 'Se mueve igual de controlado que si tuviera dos motores', 'Se vuelve una estructura rígida y ya no se mueve nada', 'El motor se frena porque el mecanismo pide el doble de fuerza'] },
    { id: 'gd5', tema: 'sm2-gdl', tipo: 'vf', niv: 2, q: 'Un pasador que une tres eslabones cuenta como dos pares giratorios.', v: true, exp: 'Es un error común contarlo como uno solo.' },
    { id: 'gd6', tema: 'sm2-gdl', tipo: 'ab', niv: 2, q: '¿Por qué los puentes y las torres usan triángulos? Usa la fórmula de movilidad.', r: 'Un triángulo tiene n = 3 y j1 = 3: M = 3(2) − 2(3) = 0. No tiene movilidad, es rígido.' },
    { id: 'cb1', tema: 'sm2-4barras', tipo: 'calc', niv: 3, gen: 'grashof' },
    { id: 'cb2', tema: 'sm2-4barras', tipo: 'om', niv: 1, q: 'En un cuatro barras, ¿cómo se llama el eslabón que da vueltas completas?', op: ['Manivela', 'Balancín', 'Acoplador', 'Bancada'] },
    { id: 'cb3', tema: 'sm2-4barras', tipo: 'om', niv: 2, q: 'Si s + l > p + q, ¿qué pasa con el mecanismo?', op: ['Ningún eslabón gira completo: triple balancín', 'Dos eslabones giran completo: doble manivela', 'Solo el más corto gira completo: manivela-balancín', 'El mecanismo no se puede armar con esas medidas'] },
    { id: 'cb4', tema: 'sm2-4barras', tipo: 'om', niv: 2, q: 'En un mecanismo de Grashof, si el eslabón más corto es la base, el mecanismo es…', op: ['Doble manivela', 'Manivela-balancín', 'Doble balancín', 'Triple balancín'] },
    { id: 'cb5', tema: 'sm2-4barras', tipo: 'vf', niv: 2, q: 'Las longitudes de los eslabones se miden entre los centros de los barrenos, no entre los bordes.', v: true, exp: 'Medir entre bordes es un error común que cambia el resultado de Grashof.' },
    { id: 'cb6', tema: 'sm2-4barras', tipo: 'om', niv: 2, q: 'Para que el mecanismo se mueva suave y no se trabe, el ángulo de transmisión conviene que esté cerca de…', op: ['90°', '0°', '180°', '360°'] },
    { id: 'bm1', tema: 'sm2-biela', tipo: 'calc', niv: 3, gen: 'biela' },
    { id: 'bm2', tema: 'sm2-biela', tipo: 'om', niv: 1, q: 'En el mecanismo biela-manivela, ¿dónde es cero la velocidad de la corredera?', op: ['En los puntos muertos', 'A la mitad de la carrera', 'Nunca se detiene', 'Es igual en todo el recorrido'] },
    { id: 'bm3', tema: 'sm2-biela', tipo: 'om', niv: 1, q: '¿Cuál de estas máquinas usa biela-manivela?', op: ['El motor de combustión', 'La dirección de un auto', 'El gato de tijera', 'Una banda transportadora'] },
    { id: 'bm4', tema: 'sm2-biela', tipo: 'vf', niv: 2, q: 'El mecanismo biela-manivela funciona en los dos sentidos: de giro a vaivén y de vaivén a giro.', v: true, exp: 'Por eso sirve como motor y como bomba o compresor.' },
    { id: 'bm5', tema: 'sm2-biela', tipo: 'om', niv: 2, q: '¿Qué pasa si la biela es demasiado corta?', op: ['El mecanismo se puede trabar', 'La carrera aumenta al doble', 'La corredera va más suave', 'No cambia nada'] },
    { id: 'lv1', tema: 'sm2-levas', tipo: 'calc', niv: 3, gen: 'excentrica' },
    { id: 'lv2', tema: 'sm2-levas', tipo: 'om', niv: 1, q: 'En el diagrama de desplazamiento de una leva, ¿qué representa un tramo horizontal?', op: ['Un detenimiento: el seguidor no se mueve', 'La subida más rápida del seguidor', 'Un golpe del seguidor contra la leva', 'La bajada del seguidor a velocidad constante'] },
    { id: 'lv3', tema: 'sm2-levas', tipo: 'om', niv: 1, q: '¿Para qué sirve un seguidor de rodillo?', op: ['Para reducir la fricción', 'Para aumentar la carrera', 'Para que la leva gire más rápido', 'Para eliminar los detenimientos'] },
    { id: 'lv4', tema: 'sm2-levas', tipo: 'om', niv: 2, q: '¿Dónde hay levas en un auto?', op: ['En el árbol de levas del motor', 'En la cremallera de la dirección', 'En los discos de freno', 'En la columna del volante'] },
    { id: 'lv5', tema: 'sm2-levas', tipo: 'vf', niv: 2, q: 'El diagrama de una leva debe terminar en 360° en la misma posición en la que empezó.', v: true, exp: 'Una vuelta completa regresa al seguidor a su posición inicial.' },
    { id: 'lv6', tema: 'sm2-levas', tipo: 'ab', niv: 3, q: 'Dibuja el diagrama de desplazamiento de una leva que sube 15 mm de 0° a 90°, se detiene arriba hasta 180°, baja hasta 270° y se detiene abajo hasta 360°. ¿Para qué podría servir?', r: 'Subida de 0 a 15 mm (0°–90°), tramo horizontal arriba (90°–180°), bajada a 0 (180°–270°) y tramo horizontal abajo (270°–360°). Ejemplo: abrir una compuerta, dejar caer una porción y cerrar (alimentador).' },
    { id: 'en1', tema: 'sm2-engranes', tipo: 'calc', niv: 3, gen: 'engranes' },
    { id: 'en2', tema: 'sm2-engranes', tipo: 'calc', niv: 3, gen: 'centros' },
    { id: 'en3', tema: 'sm2-engranes', tipo: 'om', niv: 2, q: 'Con engranes externos, ¿cómo haces que la salida gire en el mismo sentido que la entrada?', op: ['Agregando un engrane intermedio (loco)', 'Usando un piñón con más dientes', 'Cambiando el módulo', 'No se puede con engranes'] },
    { id: 'en4', tema: 'sm2-engranes', tipo: 'om', niv: 1, q: 'Para que dos engranes puedan engranar deben tener el mismo…', op: ['Módulo', 'Número de dientes', 'Diámetro', 'Material'] },
    { id: 'en5', tema: 'sm2-engranes', tipo: 'vf', niv: 2, q: 'Si el engrane de salida tiene más dientes que el de entrada, gira más lento pero con más torque.', v: true, exp: 'i = Z2/Z1 > 1: menos velocidad, más torque (ideal).' },
    { id: 'en6', tema: 'sm2-engranes', tipo: 'vf', niv: 2, q: 'En un par de engranes, más velocidad en la salida también significa más fuerza.', v: false, exp: 'Velocidad y torque se intercambian: si sube una, baja la otra.' },
    { id: 'po1', tema: 'sm2-poleas', tipo: 'calc', niv: 3, gen: 'poleas' },
    { id: 'po2', tema: 'sm2-poleas', tipo: 'om', niv: 2, q: '¿Por qué una impresora 3D usa banda dentada y no plana?', op: ['Porque no patina y conserva la posición exacta', 'Porque es más barata y fácil de conseguir', 'Porque gira más rápido que una banda plana', 'Porque no necesita ninguna tensión para trabajar'] },
    { id: 'po3', tema: 'sm2-poleas', tipo: 'om', niv: 1, q: 'Con banda cruzada, la polea conducida gira…', op: ['En sentido contrario a la motriz', 'En el mismo sentido que la motriz', 'Siempre más rápido', 'Solo media vuelta'] },
    { id: 'po4', tema: 'sm2-poleas', tipo: 'vf', niv: 2, q: 'Tensar de más la banda la hace durar más y no afecta a los baleros.', v: false, exp: 'El exceso de tensión daña los baleros.' },
    { id: 'po5', tema: 'sm2-poleas', tipo: 'om', niv: 1, q: '¿Cómo se llama la rueda dentada de una transmisión por cadena?', op: ['Catarina', 'Polea', 'Cremallera', 'Leva'] },
    { id: 'to1', tema: 'sm2-tornillo', tipo: 'calc', niv: 3, gen: 'tornillo' },
    { id: 'to2', tema: 'sm2-tornillo', tipo: 'calc', niv: 3, gen: 'cremallera' },
    { id: 'to3', tema: 'sm2-tornillo', tipo: 'om', niv: 2, q: '¿Por qué el gato de tijera no se baja solo con el peso del auto?', op: ['Porque el tornillo es autobloqueante', 'Porque una cremallera lo frena', 'Porque el aceite lo detiene', 'Porque tiene un resorte'] },
    { id: 'to4', tema: 'sm2-tornillo', tipo: 'om', niv: 1, q: '¿Qué mecanismo usa la dirección de muchos autos?', op: ['Piñón-cremallera', 'Biela-manivela', 'Leva-seguidor', 'Polea-banda'] },
    { id: 'to5', tema: 'sm2-tornillo', tipo: 'om', niv: 2, q: 'Comparado con el piñón-cremallera, el tornillo-tuerca es…', op: ['Más lento, más preciso y con más fuerza', 'Más rápido y con menos fuerza', 'Igual de rápido y de preciso', 'Menos preciso y más rápido'] },
    { id: 'ex1', tema: 'sm2-explosionada', tipo: 'om', niv: 1, q: '¿Para qué se ancla una pieza en un ensamble de FreeCAD?', op: ['Para que sea la referencia fija; si no, todo el ensamble flota', 'Para poder mandarla a imprimir en 3D después', 'Para que FreeCAD le cambie el color y se distinga', 'Para que las demás piezas se muevan más rápido'] },
    { id: 'ex2', tema: 'sm2-explosionada', tipo: 'om', niv: 1, q: '¿Qué documento acompaña a la vista explosionada?', op: ['La lista de partes (BOM)', 'La factura del material', 'El diagrama de escalera', 'La hoja de asistencia'] },
    { id: 'ex3', tema: 'sm2-explosionada', tipo: 'om', niv: 2, q: '¿Qué muestra una vista explosionada?', op: ['Las piezas separadas en el orden en que se arman', 'La pieza cortada por la mitad para ver su interior', 'Solo la vista frontal con todas sus cotas', 'Las fuerzas que soporta cada una de las piezas'] },
    { id: 'ex4', tema: 'sm2-explosionada', tipo: 'vf', niv: 2, q: 'Simular el movimiento del ensamble antes de cortar ahorra material, tiempo y dinero.', v: true, exp: 'Los choques se corrigen en pantalla y no con material.' },
    { id: 'ex5', tema: 'sm2-explosionada', tipo: 'ab', niv: 2, q: '¿Qué unión usas entre la manivela y la base en el ensamble, y dónde la colocas?', r: 'Una unión giratoria (revoluta) en el centro del barreno, porque permite rotar sobre un eje común como el pasador real.' },
    { id: 'ma1', tema: 'sm2-materiales', tipo: 'om', niv: 2, q: 'Para la base de un mecanismo que debe ser rígida, ¿qué material conviene más?', op: ['MDF o madera', 'Cartón sencillo', 'Hoja de papel', 'Fomi delgado'] },
    { id: 'ma2', tema: 'sm2-materiales', tipo: 'om', niv: 1, q: '¿Qué es el nesting?', op: ['Acomodar las piezas para aprovechar la hoja', 'Pegar las piezas con silicón caliente', 'Lijar las orillas después de cortar', 'Pintar el prototipo antes de armarlo'] },
    { id: 'ma3', tema: 'sm2-materiales', tipo: 'vf', niv: 2, q: 'Al cortar MDF conviene ventilar y usar cubrebocas porque su polvo irrita.', v: true, exp: 'El polvo fino de MDF (fibras con resinas) irrita ojos y vías respiratorias; por eso se corta con ventilación y cubrebocas.' },
    { id: 'ma4', tema: 'sm2-materiales', tipo: 'ab', niv: 2, q: 'Menciona dos acciones para reducir el desperdicio de material en tu prototipo.', r: 'Acomodar plantillas (nesting), reutilizar sobrantes, simular antes de cortar.' },
    { id: 'se1', tema: 'sm2-seguridad', tipo: 'om', niv: 1, q: '¿Qué norma regula el equipo de protección personal (EPP) en México?', op: ['NOM-017-STPS-2008', 'ISO 1219', 'NOM-001-SEDE', 'NOM-035-STPS'] },
    { id: 'se2', tema: 'sm2-seguridad', tipo: 'om', niv: 2, q: '¿Cuál es la forma correcta de usar el cúter?', op: ['Cortar alejándose del cuerpo, con regla metálica, y cerrarlo al caminar', 'Cortar hacia el cuerpo para tener más fuerza', 'Usar regla de plástico', 'Dejarlo abierto en la mesa para tenerlo a la mano'] },
    { id: 'se3', tema: 'sm2-seguridad', tipo: 'vf', niv: 2, q: 'Si usas equipo de protección ya no importa la técnica de trabajo.', v: false, exp: 'El EPP no sustituye a la técnica correcta.' },
    { id: 'se4', tema: 'sm2-seguridad', tipo: 'om', niv: 2, q: '¿Qué haces si casi te cortas (casi accidente)?', op: ['Lo reportas y se registra para prevenir', 'Nada, no pasó nada', 'Lo ocultas para no meterte en problemas', 'Cambias de herramienta sin decir nada'] },
    // Neumática e hidráulica
    { id: 'pr1', tema: 'sm3-presion', tipo: 'calc', niv: 3, gen: 'presion' },
    { id: 'pr2', tema: 'sm3-presion', tipo: 'calc', niv: 3, gen: 'psi' },
    { id: 'pr3', tema: 'sm3-presion', tipo: 'om', niv: 2, q: 'Si duplicas el área y la fuerza es la misma, la presión…', op: ['Se reduce a la mitad', 'Se duplica', 'No cambia', 'Se cuadruplica'] },
    { id: 'pr4', tema: 'sm3-presion', tipo: 'om', niv: 2, q: 'En un cilindro neumático, ¿qué controla principalmente la velocidad?', op: ['El caudal', 'La presión', 'El diámetro del vástago', 'El largo de la manguera'] },
    { id: 'pr5', tema: 'sm3-presion', tipo: 'om', niv: 1, q: '¿A cuántos pascales equivale 1 bar?', op: ['100 000 Pa', '1 000 Pa', '10 Pa', '14.5 Pa'] },
    { id: 'pr6', tema: 'sm3-presion', tipo: 'calc', niv: 3, gen: 'caudal' },
    { id: 'pa1', tema: 'sm3-pascal', tipo: 'calc', niv: 3, gen: 'pascal' },
    { id: 'pa2', tema: 'sm3-pascal', tipo: 'calc', niv: 3, gen: 'pascalRec' },
    { id: 'pa3', tema: 'sm3-pascal', tipo: 'om', niv: 2, q: '¿Por qué una prensa no funciona igual con aire que con aceite?', op: ['Porque el aire se comprime y parte del recorrido se pierde', 'Porque el aire pesa más que el aceite dentro del cilindro', 'Porque el aceite se evapora con la presión y se pierde', 'Porque el aire no transmite la presión a todo el recipiente'] },
    { id: 'pa4', tema: 'sm3-pascal', tipo: 'om', niv: 2, q: 'En una prensa hidráulica ganas fuerza en el émbolo grande. ¿Qué pierdes?', op: ['Recorrido: el émbolo grande avanza menos', 'Presión: el émbolo grande recibe menos', 'Nada: la fuerza extra sale gratis', 'Fluido: se gasta más aceite'] },
    { id: 'pa5', tema: 'sm3-pascal', tipo: 'vf', niv: 2, q: 'Para la relación de fuerzas basta con dividir los diámetros, sin elevarlos al cuadrado.', v: false, exp: 'La relación de áreas es (D2 / D1)².' },
    { id: 'co1', tema: 'sm3-comparativa', tipo: 'om', niv: 2, q: 'Para doblar lámina gruesa con 50 toneladas, ¿qué tecnología conviene?', op: ['Hidráulica', 'Neumática', 'Eléctrica con motor pequeño', 'Manual'] },
    { id: 'co2', tema: 'sm3-comparativa', tipo: 'om', niv: 2, q: '¿Por qué las líneas de alimentos prefieren la neumática?', op: ['Porque es limpia: si hay una fuga solo sale aire', 'Porque da más fuerza que la hidráulica', 'Porque posiciona con décimas de milímetro', 'Porque no usa energía'] },
    { id: 'co3', tema: 'sm3-comparativa', tipo: 'om', niv: 2, q: 'Para posicionar un brazo con precisión de décimas de milímetro, ¿qué conviene?', op: ['Eléctrica (servomotor)', 'Neumática', 'Hidráulica sin control', 'Un resorte'] },
    { id: 'co4', tema: 'sm3-comparativa', tipo: 'vf', niv: 2, q: 'La neumática sirve para posicionar con precisión en cualquier punto de la carrera.', v: false, exp: 'El aire se comprime; para precisión se usa control eléctrico (servo).' },
    { id: 'ai1', tema: 'sm3-aire', tipo: 'om', niv: 1, q: '¿Qué significa FRL en una unidad de mantenimiento?', op: ['Filtro, regulador y lubricador', 'Fuerza, resistencia y longitud', 'Fusible, relé y lámpara', 'Filtro, refrigerador y lavador'] },
    { id: 'ai2', tema: 'sm3-aire', tipo: 'om', niv: 2, q: '¿Cuál es el orden correcto del camino del aire comprimido?', op: ['Compresor → depósito → secado → red → FRL → válvula → cilindro', 'Cilindro → válvula → FRL → red → compresor', 'Compresor → válvula → cilindro → FRL → depósito', 'FRL → compresor → cilindro → depósito → válvula'] },
    { id: 'ai3', tema: 'sm3-aire', tipo: 'om', niv: 1, q: '¿Para qué se purga el tanque de aire?', op: ['Para sacar el agua condensada', 'Para subir la presión', 'Para lubricar el sistema', 'Para enfriar el compresor'] },
    { id: 'ai4', tema: 'sm3-aire', tipo: 'om', niv: 1, q: '¿Qué hace el regulador?', op: ['Fija la presión de trabajo que recibe la máquina', 'Atrapa el polvo y el agua del aire comprimido', 'Agrega una niebla de aceite al aire que pasa', 'Produce el aire comprimido para toda la red'] },
    { id: 'ai5', tema: 'sm3-aire', tipo: 'vf', niv: 2, q: 'Ajustar la presión al máximo siempre es mejor, aunque la máquina no lo necesite.', v: false, exp: 'Es desperdicio de energía y desgasta los componentes.' },
    { id: 'ci1', tema: 'sm3-cilindros', tipo: 'calc', niv: 3, gen: 'cilindro' },
    { id: 'ci2', tema: 'sm3-cilindros', tipo: 'calc', niv: 3, gen: 'cilindroRet' },
    { id: 'ci3', tema: 'sm3-cilindros', tipo: 'om', niv: 2, q: '¿Por qué el retroceso de un cilindro de doble efecto tiene menos fuerza que el avance?', op: ['Porque el vástago reduce el área donde empuja el aire', 'Porque un resorte interno frena el regreso del émbolo', 'Porque la presión de la red baja cuando el cilindro regresa', 'Porque el aire sale más rápido por el escape al regresar'] },
    { id: 'ci4', tema: 'sm3-cilindros', tipo: 'om', niv: 2, q: '¿Cuándo eliges un cilindro de simple efecto?', op: ['Cuando solo necesitas fuerza en un sentido y carrera corta', 'Cuando necesitas fuerza en los dos sentidos', 'Para carreras muy largas con mucha carga', 'Cuando no hay aire comprimido'] },
    { id: 'ci5', tema: 'sm3-cilindros', tipo: 'vf', niv: 1, q: 'En un cilindro de simple efecto, el regreso lo hace un resorte.', v: true, exp: 'El aire empuja en un sentido y el resorte regresa el vástago.' },
    { id: 'va1', tema: 'sm3-valvulas', tipo: 'om', niv: 1, q: 'En una válvula 5/2, ¿qué significan los números?', op: ['5 vías (conexiones) y 2 posiciones', '5 posiciones y 2 vías', '5 bar y 2 salidas', '5 cilindros y 2 botones'] },
    { id: 'va2', tema: 'sm3-valvulas', tipo: 'om', niv: 2, q: '¿Qué válvula usarías para mandar un cilindro de doble efecto?', op: ['5/2', '3/2', '2/2', 'Una reguladora de caudal sola'] },
    { id: 'va3', tema: 'sm3-valvulas', tipo: 'om', niv: 1, q: 'En la numeración ISO de una válvula, ¿qué es la conexión 1?', op: ['La alimentación de aire', 'Un escape', 'La salida al cilindro', 'El pilotaje'] },
    { id: 'va4', tema: 'sm3-valvulas', tipo: 'om', niv: 2, q: '¿Cómo se regula normalmente la velocidad de un cilindro neumático?', op: ['Con reguladoras de caudal, estrangulando el escape', 'Subiendo la presión al máximo', 'Cambiando el diámetro del vástago', 'Con un solenoide más grande'] },
    { id: 'va5', tema: 'sm3-valvulas', tipo: 'vf', niv: 2, q: 'Una válvula NC (normalmente cerrada) deja pasar el aire cuando está en reposo.', v: false, exp: 'NC: en reposo no deja pasar; abre al accionarse.' },
    { id: 'is1', tema: 'sm3-iso1219', tipo: 'om', niv: 1, q: 'En un diagrama ISO 1219, ¿qué representa cada cuadro de una válvula?', op: ['Una posición', 'Una vía', 'Un cilindro', 'Un escape'] },
    { id: 'is2', tema: 'sm3-iso1219', tipo: 'om', niv: 1, q: '¿En qué estado se dibuja un diagrama neumático?', op: ['En reposo', 'Accionado', 'A la mitad de la carrera', 'Como se vea mejor'] },
    { id: 'is3', tema: 'sm3-iso1219', tipo: 'om', niv: 1, q: '¿Dónde van los actuadores (cilindros) en el diagrama?', op: ['Arriba', 'Abajo, junto a la alimentación', 'En medio', 'Donde quepan'] },
    { id: 'is4', tema: 'sm3-iso1219', tipo: 'vf', niv: 2, q: 'En un diagrama, si dos líneas se cruzan siempre están conectadas.', v: false, exp: 'Se debe indicar la conexión; las líneas que solo se cruzan no están unidas.' },
    { id: 'is5', tema: 'sm3-iso1219', tipo: 'ab', niv: 3, q: 'Narra qué pasa en un circuito con unidad de mantenimiento, válvula 3/2 NC con botón y cilindro de simple efecto, en reposo y al presionar el botón.', r: 'En reposo el cilindro está adentro por el resorte. Al presionar, la válvula conecta 1 con 2 y el cilindro sale. Al soltar, el aire escapa por 3 y el resorte lo regresa.' },
    { id: 'el1', tema: 'sm3-electro', tipo: 'om', niv: 2, q: '¿Por qué el botón de paro se conecta como NC?', op: ['Para que, si se corta un cable, la máquina se detenga (falla segura)', 'Porque un botón NC es más barato que uno NA', 'Para que la máquina arranque sola al energizar', 'Porque así lo exige la bobina del solenoide'] },
    { id: 'el2', tema: 'sm3-electro', tipo: 'om', niv: 2, q: 'En una autorretención, ¿qué hace el contacto del relé en paralelo con el botón de arranque?', op: ['Mantiene la bobina energizada al soltar el botón', 'Detiene la máquina cuando se presiona el paro', 'Invierte el sentido de giro del motor', 'Protege el circuito contra un corto circuito'] },
    { id: 'el3', tema: 'sm3-electro', tipo: 'om', niv: 1, q: 'Un contacto NA (normalmente abierto)…', op: ['Está abierto en reposo y cierra al accionarse', 'Está cerrado en reposo y abre al accionarse', 'Siempre está cerrado', 'Solo se usa en válvulas'] },
    { id: 'el4', tema: 'sm3-electro', tipo: 'om', niv: 1, q: '¿Qué voltaje de control es el estándar para PLC, sensores y electroválvulas en la industria?', op: ['24 V de corriente directa', '127 V de corriente alterna', '1.5 V', '440 V'] },
    { id: 'el5', tema: 'sm3-electro', tipo: 'vf', niv: 2, q: 'En un diagrama de escalera, la carga (bobina o solenoide) va a la izquierda y los contactos a la derecha.', v: false, exp: 'Los contactos van a la izquierda y la carga a la derecha.' },
    { id: 'el6', tema: 'sm3-electro', tipo: 'ab', niv: 3, q: 'Dibuja el escalón de autorretención con botón de paro, botón de arranque y relé K1.', r: 'Paro (NC) en serie → (Arranque NA en paralelo con contacto NA de K1) → bobina K1.' },
    { id: 'mo1', tema: 'sm3-motordc', tipo: 'om', niv: 1, q: '¿Cómo inviertes el sentido de giro de un motor de CD?', op: ['Invirtiendo la polaridad (DPDT o puente H)', 'Subiendo el voltaje de la fuente', 'Agregando un resistor en serie', 'Cambiando el carrete por uno más grande'] },
    { id: 'mo2', tema: 'sm3-motordc', tipo: 'calc', niv: 3, gen: 'torque' },
    { id: 'mo3', tema: 'sm3-motordc', tipo: 'om', niv: 2, q: 'Si en la grúa pones un carrete más grande, el motor…', op: ['Sube más rápido pero levanta menos peso', 'Sube más lento y levanta más peso', 'Levanta exactamente lo mismo', 'Invierte su giro'] },
    { id: 'mo4', tema: 'sm3-motordc', tipo: 'om', niv: 1, q: 'Dos pilas AA de 1.5 V conectadas en serie dan…', op: ['3 V', '1.5 V', '0.75 V', '6 V'] },
    { id: 'mo5', tema: 'sm3-motordc', tipo: 'vf', niv: 2, q: 'Un error en el cruce del interruptor DPDT puede provocar un corto en la pila.', v: true, exp: 'Por eso se revisa el cruce antes de conectar.' },
    { id: 'fa1', tema: 'sm3-fallas', tipo: 'om', niv: 2, q: 'Un sistema hidráulico se siente «esponjoso». ¿Cuál es la causa probable?', op: ['Aire atrapado', 'Demasiado aceite', 'Presión muy alta', 'Manguera nueva'] },
    { id: 'fa2', tema: 'sm3-fallas', tipo: 'om', niv: 1, q: '¿Qué haces antes de desconectar una manguera?', op: ['Despresurizar el sistema', 'Subir la presión', 'Lubricarla', 'Nada, se puede desconectar así'] },
    { id: 'fa3', tema: 'sm3-fallas', tipo: 'om', niv: 2, q: 'Al buscar una falla, ¿por qué se prueba una sola cosa a la vez?', op: ['Para saber cuál fue la causa real', 'Porque es más rápido cambiar todo', 'Para gastar menos aire', 'No importa el orden'] },
    { id: 'fa4', tema: 'sm3-fallas', tipo: 'om', niv: 2, q: 'Un cilindro se mueve muy lento. ¿Qué revisas primero?', op: ['La reguladora de caudal y la presión', 'El color del cilindro', 'El diagrama de escalera', 'La lista de partes'] },
    { id: 'fa5', tema: 'sm3-fallas', tipo: 'vf', niv: 1, q: 'Nunca se debe apuntar aire comprimido a una persona.', v: true, exp: 'Puede causar lesiones graves.' }
  ];
  E.BANCO_TIPO = { om: 'Opción múltiple', vf: 'Verdadero o falso', calc: 'Problema', ab: 'Abierta' };
  E.BANCO_NIV = { 1: 'Recordar', 2: 'Comprender', 3: 'Aplicar' };
})();
