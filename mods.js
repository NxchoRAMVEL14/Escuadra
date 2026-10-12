/* Escuadra · Contenido por módulo. Cada módulo (I a V) trae sus temas, clases hora por hora, tareas, trabajos, banco de
   examen, ideas, figuras y proyecto en archivos aparte (m1s1.js, m1s2.js…). Solo se cargan los de los módulos de tus
   grupos, así la app abre igual de rápido. El Módulo II trae sus Submódulos 2 y 3 en los archivos de siempre (temas.js, clases.js, banco.js…) y el 1 en m2s1.js. */
(function () {
  'use strict';
  const E = window.E;
  const M = E.mods = {};
  // nombre corto de cada submódulo (para pestañas y etiquetas), archivos de contenido y si los submódulos van de corrido
  E.MODC = {
    I: { sm: { 1: 'Mediciones y diagramas', 2: 'Circuitos analógicos y PCB', 3: 'Circuitos digitales' }, archivos: ['m1s1.js', 'm1s2.js', 'm1s3.js'] },
    II: { sm: { 1: 'Dibujo y FreeCAD', 2: 'Mecanismos', 3: 'Neumática e hidráulica' }, archivos: ['m2s1.js'] },
    III: { sm: { 1: 'Potencia y control', 2: 'PLC', 3: 'Sistemas embebidos' }, archivos: ['m3s1.js', 'm3s2.js', 'm3s3.js'] },
    IV: { sm: { 1: 'Máquinas-herramienta y CNC', 2: 'Robótica' }, archivos: ['m4s1.js', 'm4s2.js'], flujo: true },
    V: { sm: { 1: 'Automatización', 2: 'Mantenimiento' }, archivos: ['m5s1.js', 'm5s2.js'], flujo: true }
  };
  // ayudas para los generadores de problemas de los archivos de contenido (mismas reglas que banco.js)
  M.h = {
    f: (n, d) => Number(n).toLocaleString('es-MX', { maximumFractionDigits: d == null ? 1 : d, useGrouping: false }),
    pick: (rnd, a) => a[Math.floor(rnd() * a.length) % a.length],
    // la correcta primero, sin repetidas; si faltan, completa con las de respaldo
    ops: (ok, cands, resp) => { const out = [ok]; cands.concat(resp || []).forEach(c => { if (out.length < 4 && out.indexOf(c) < 0) out.push(c); }); return out; },
    // valor con prefijo: 4700 → «4.7 kΩ»
    si: (v, un, d) => { const a = Math.abs(v), P = [[1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n']]; const p = P.find(x => a >= x[0]) || P[P.length - 1]; return M.h.f(v / p[0], d == null ? 2 : d) + ' ' + p[1] + un; }
  };
  const PACKS = {};
  const ok = {}, enCurso = {}, falla = {};
  const uniq = (arr, item) => { if (!arr.some(x => x.id === item.id)) arr.push(item); };

  /* ---------- registro: cada archivo de contenido llama E.mods.registra('I-1', {...}) ---------- */
  M.registra = (key, p) => {
    p = p || {};
    if (p.temas) p.temas.forEach(t => uniq(E.TEMAS, t));
    if (p.clases) E.CLASES[key] = p.clases;
    if (p.banco && E.BANCO) p.banco.forEach(b => uniq(E.BANCO, b));
    if (p.gen && E.GEN) Object.assign(E.GEN, p.gen);
    if (p.ideas) p.ideas.forEach(i => uniq(E.IDEAS, i));
    if (p.figs && E.FIGS) Object.assign(E.FIGS, p.figs);
    if (p.figTema && E.FIG_TEMA) Object.assign(E.FIG_TEMA, p.figTema);
    if (p.proyecto && E.proyecto) E.proyecto.ETAPAS[key] = p.proyecto;
    if (p.industria && E.INDUSTRIA) Object.assign(E.INDUSTRIA, p.industria);
    if (p.videos && E.VIDEOS) Object.assign(E.VIDEOS, p.videos);
    PACKS[key] = Object.assign(PACKS[key] || {}, p);
    if (E.clases && E.clases.limpia) E.clases.limpia();
  };
  M.pack = key => PACKS[key] || null;
  M.packs = () => PACKS;

  /* ---------- carga ---------- */
  const scripts = {};
  const cargaArchivo = f => scripts[f] || (scripts[f] = new Promise(res => {
    const s = document.createElement('script'); s.src = f; s.async = false;
    s.onload = () => { ok[f] = true; res(true); };
    s.onerror = () => { delete scripts[f]; res(false); };
    document.head.appendChild(s);
  }));
  M.archivos = mod => ((E.MODC[mod] || {}).archivos || []);
  M.listo = mod => M.archivos(mod).every(f => ok[f]);
  M.cargar = mod => {
    if (!mod || M.listo(mod)) return Promise.resolve(true);
    enCurso[mod] = true;
    return Promise.all(M.archivos(mod).map(cargaArchivo)).then(rs => { enCurso[mod] = false; const bien = rs.every(Boolean); if (!bien) falla[mod] = true; return bien; });
  };
  M.asegura = mods => Promise.all(Array.from(new Set((mods || []).filter(Boolean))).map(M.cargar));
  // módulos que usas: los de tus grupos activos y el del grupo que tienes abierto
  M.necesarios = () => {
    const D = E.data, out = []; if (!D) return out;
    try { D.gruposActivos().forEach(g => { if (g.modulo) out.push(g.modulo); }); const g = D.grupoActual(); if (g && g.modulo) out.push(g.modulo); } catch (e) { }
    return Array.from(new Set(out));
  };
  // al pintar: si falta el contenido de un módulo que usas, lo carga y vuelve a pintar
  M.vigila = () => {
    M.necesarios().forEach(m => {
      if (M.listo(m) || enCurso[m] || falla[m]) return;
      M.cargar(m).then(() => { if (E.render) E.render(); });
    });
  };
  M.cargando = mod => !!enCurso[mod];

  /* ---------- etiquetas ---------- */
  // «I-2» → «Submódulo 2 · Circuitos analógicos y PCB»
  M.smLbl = key => {
    if (key === 'gen') return 'Formación integral';
    const p = String(key || '').split('-'), m = E.MODC[p[0]]; if (!m || !p[1]) return '';
    return 'Submódulo ' + p[1] + (m.sm[p[1]] ? ' · ' + m.sm[p[1]] : '');
  };
  M.smCorto = key => { const p = String(key || '').split('-'), m = E.MODC[p[0]]; return m && m.sm[p[1]] ? m.sm[p[1]] : key; };
  // claves de submódulo de un módulo: ['I-1', 'I-2', 'I-3']
  M.smKeys = mod => Object.keys(((E.PROGRAMA.modulos[mod] || {}).sub) || {}).sort().map(n => mod + '-' + n);
  // ¿los submódulos de este módulo van de corrido entre parciales? (módulos de 2 submódulos)
  M.flujoDef = mod => !!(E.MODC[mod] || {}).flujo;
  // submódulo sugerido para cada parcial al crear un grupo
  M.subSugeridos = (mod, ps) => {
    const n = M.smKeys(mod).length, out = {};
    ps.forEach((p, i) => { out[p.id] = n >= ps.length ? String(i + 1) : n === 2 ? (i < 2 ? '1' : '2') : n === 1 ? '1' : String(Math.min(n, i + 1)); });
    return out;
  };
})();
