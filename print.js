/* Escuadra · impresión (listas, cotejo, rúbrica, acta, planeación) y exportaciones. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const P = E.print = {};
  const SYM = { A: '•', F: 'F', R: 'R', J: 'J' };

  P.run = (html, o) => {
    o = o || {};
    const root = document.getElementById('print-root'); root.innerHTML = html;
    let st = document.getElementById('page-style'); if (!st) { st = document.createElement('style'); st.id = 'page-style'; document.head.appendChild(st); }
    st.textContent = '@page{size:letter ' + (o.landscape ? 'landscape' : 'portrait') + ';margin:' + (o.margin || '9mm') + '}';
    const t = document.title; document.title = o.title || t;
    setTimeout(() => { try { window.print(); } catch (e) { u.toast('No se pudo abrir la impresión', 'err'); } setTimeout(() => { document.title = t; }, 1000); }, 120);
  };
  function head(g, titulo, extra) {
    const c = D.cfg();
    return '<table class="p-head"><tr><td>OPCIÓN EDUCATIVA: ' + esc(c.opcion) + '</td><td>ENTIDAD: ' + esc(c.entidad) + '</td></tr>' +
      '<tr><td>PLANTEL: ' + esc(c.plantel) + '</td><td>C.C.T.: ' + esc(c.cct) + '</td></tr>' +
      '<tr><td>CARRERA: ' + esc(g.carrera) + '</td><td>TURNO: ' + esc(c.turno) + '</td></tr>' +
      '<tr><td>SEMESTRE: ' + esc(g.semestre) + '</td><td>GRUPO: ' + esc(g.grupo) + '</td></tr>' +
      '<tr><td>CICLO ESCOLAR ' + esc(c.ciclo) + ' · PERIODO: ' + esc(c.periodo) + '</td><td>' + esc(extra || '') + '</td></tr></table>' +
      '<div class="p-title">' + esc(titulo) + '</div>';
  }
  const firma = () => '<div class="sig"><div>' + esc(D.cfg().docente) + '<br>Nombre y firma del docente</div></div>';
  const smTxt = (g, p) => { const sm = D.submodulo(g, p.id); return sm ? 'MÓDULO ' + g.modulo + ' · SUBMÓDULO ' + sm.num + ': ' + sm.nombre.toUpperCase() : ''; };

  P.asistencia = (g, p, o) => {
    o = o || {}; const al = D.alumnos(g), fechas = C.fechasLista(g, p);
    const th = fechas.map(f => '<th class="dc"><div class="vd">' + u.DIAS3[u.dow(f)] + ' ' + u.fDM(f) + '</div></th>').join('');
    const rows = al.map(a => {
      let na = 0, nf = 0;
      const tds = fechas.map(f => {
        if (!o.marcas) return '<td></td>'; const doc = S.get('asis:' + g.id + ':' + f); if (!doc) return '<td></td>';
        const st = doc[a.id] || 'A'; if (C.cuenta(st)) na++; else nf++; return '<td class="c' + (st === 'F' ? ' f' : '') + '">' + SYM[st] + '</td>';
      }).join('');
      return '<tr><td class="c">' + a.num + '</td><td class="nm">' + esc(a.nombre) + '</td>' + tds + '<td class="c">' + (o.marcas ? na : '') + '</td><td class="c">' + (o.marcas ? nf : '') + '</td></tr>';
    }).join('');
    P.run('<div class="pr">' + head(g, 'LISTA DE ASISTENCIA · ' + p.nombre.toUpperCase(), 'DOCENTE: ' + D.cfg().docente) + '<p class="tiny c">' + esc(smTxt(g, p)) + '</p>' +
      '<table class="grid"><thead><tr><th>No.</th><th class="l">NOMBRE</th>' + th + '<th>A</th><th>F</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<p class="tiny">• Asistencia · F Falta · R Retardo · J Justificada. Fechas según el horario, sin asuetos.</p>' + firma() + '</div>', { landscape: true, title: 'Lista ' + g.grupo + ' ' + p.nombre });
  };
  P.participacion = (g, p, o) => {
    o = o || {}; const al = D.alumnos(g), fechas = C.fechasLista(g, p);
    const th = fechas.map(f => '<th class="dc"><div class="vd">' + u.DIAS3[u.dow(f)] + ' ' + u.fDM(f) + '</div></th>').join('');
    const rows = al.map(a => {
      let tot = 0;
      const tds = fechas.map(f => { if (!o.marcas) return '<td></td>'; const n = Number((S.get('part:' + g.id + ':' + f) || {})[a.id] || 0); tot += n; return '<td class="c">' + (n || '') + '</td>'; }).join('');
      return '<tr><td class="c">' + a.num + '</td><td class="nm">' + esc(a.nombre) + '</td>' + tds + '<td class="c">' + (o.marcas ? tot : '') + '</td></tr>';
    }).join('');
    P.run('<div class="pr">' + head(g, 'REGISTRO DE PARTICIPACIÓN · ' + p.nombre.toUpperCase(), 'DOCENTE: ' + D.cfg().docente) + '<p class="tiny c">' + esc(smTxt(g, p)) + '</p>' +
      '<table class="grid"><thead><tr><th>No.</th><th class="l">NOMBRE</th>' + th + '<th>Total</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<p class="tiny">Anota una marca por participación. Meta del parcial: ' + D.cfg().metaPart + ' participaciones = 100 (vale ' + D.cfg().pond.participacion + '% de la calificación).</p>' + firma() + '</div>', { landscape: true, title: 'Participación ' + g.grupo + ' ' + p.nombre });
  };
  function filas(g, o) {
    if (o && o.modo === 'equipos') return Array.from({ length: Math.max(1, Number(o.equipos) || 6) }, (_, k) => ({ num: k + 1, nombre: 'Equipo ' + (k + 1) + ': ' }));
    return D.alumnos(g);
  }
  P.cotejo = (g, p, i, o) => {
    const sm = D.submodulo(g, p.id), ac = sm && sm.ac[i]; if (!ac) { u.toast('Elige un producto', 'err'); return; }
    const cr = ac.criterios || [], fs = filas(g, o), eq = o && o.modo === 'equipos';
    const leg = '<ol class="crit">' + cr.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol>';
    const th = cr.map((_, k) => '<th style="width:9mm">C' + (k + 1) + '</th>').join('');
    const rows = fs.map(a => '<tr' + (eq ? ' class="tall"' : '') + '><td class="c">' + a.num + '</td><td class="nm">' + esc(a.nombre) + '</td>' + cr.map(() => '<td></td>').join('') + '<td></td><td></td><td></td></tr>').join('');
    P.run('<div class="pr">' + head(g, 'LISTA DE COTEJO · ' + p.nombre.toUpperCase(), 'FECHA: ____________________') +
      '<table class="grid"><tr><td><b>Actividad clave:</b> ' + esc(ac.titulo) + '<br><b>Producto:</b> ' + esc(ac.producto || '') + '<br><span class="tiny">' + esc(smTxt(g, p)) + ' · Programa 2024, p. ' + esc(ac.pag || '') + '</span></td></tr></table>' +
      '<p class="tiny"><b>Instrucciones:</b> marca ✓ si cumple y ✗ si no. Calificación = criterios cumplidos ÷ ' + cr.length + ' × 100.</p>' + leg +
      '<table class="grid"><thead><tr><th>No.</th><th class="l">' + (eq ? 'EQUIPO E INTEGRANTES' : 'NOMBRE') + '</th>' + th + '<th style="width:12mm">Cumple</th><th style="width:12mm">Calif.</th><th style="width:40mm">Observaciones</th></tr></thead><tbody>' + rows + '</tbody></table>' + firma() + '</div>',
      { landscape: true, title: 'Cotejo ' + g.grupo });
  };
  const NIV = [['Excelente', 4, 'Lo hace completo, correcto y de forma autónoma.'], ['Bueno', 3, 'Lo hace correctamente con apoyo mínimo.'], ['Suficiente', 2, 'Lo hace en parte o con errores que corrige con apoyo.'], ['Insuficiente', 1, 'No lo hace o tiene errores graves.']];
  P.rubrica = (g, p, i) => {
    const sm = D.submodulo(g, p.id), ac = sm && sm.ac[i]; if (!ac) { u.toast('Elige un producto', 'err'); return; }
    const cr = ac.criterios || [], max = cr.length * 4;
    const rows = cr.map(x => '<tr><td><b>' + esc(x) + '</b></td>' + NIV.map(n => '<td class="tiny">' + esc(n[2]) + '</td>').join('') + '<td></td></tr>').join('');
    P.run('<div class="pr">' + head(g, 'RÚBRICA · ' + p.nombre.toUpperCase(), '') +
      '<table class="grid"><tr><td><b>Nombre / equipo:</b> ______________________________________________ <b>Fecha:</b> ____________</td></tr><tr><td><b>Actividad clave:</b> ' + esc(ac.titulo) + '<br><b>Producto:</b> ' + esc(ac.producto || '') + '<br><span class="tiny">' + esc(smTxt(g, p)) + ' · Programa 2024, p. ' + esc(ac.pag || '') + '</span></td></tr></table><br>' +
      '<table class="grid"><thead><tr><th class="l" style="width:30%">Criterio</th>' + NIV.map(n => '<th>' + n[0] + ' (' + n[1] + ')</th>').join('') + '<th style="width:14mm">Puntos</th></tr></thead><tbody>' + rows +
      '<tr><td colspan="5" style="text-align:right"><b>Total (máximo ' + max + ')</b></td><td></td></tr><tr><td colspan="5" style="text-align:right"><b>Calificación = total ÷ ' + max + ' × 100</b></td><td></td></tr></tbody></table>' +
      '<p class="tiny"><b>Retroalimentación:</b></p><div class="box"></div>' + firma() + '</div>', { landscape: false, title: 'Rúbrica ' + g.grupo });
  };

  /* ---------- acta ---------- */
  const ACTA_H = ['No.', 'NOMBRE', '1 PAR', 'ASIS', 'FAL', '2 PAR', 'ASIS', 'FAL', '3 PAR', 'ASIS', 'FAL', '', 'CALIFICACION FINAL'];
  P.acta = g => {
    const al = D.alumnos(g);
    const rows = al.map(a => { const r = C.actaFila(g, a.id); return '<tr><td class="c">' + a.num + '</td><td class="nm">' + esc(a.nombre) + '</td>' + r.slice(0, 9).map(v => '<td class="c">' + esc(v) + '</td>').join('') + '<td class="c"><b>' + esc(r[9]) + '</b></td></tr>'; }).join('');
    P.run('<div class="pr">' + head(g, 'ACTA PARA ENVÍO DE CALIFICACIONES', 'DOCENTE: ' + D.cfg().docente) +
      '<table class="grid"><thead><tr><th>No.</th><th class="l">NOMBRE</th><th>1 PAR</th><th>ASIS</th><th>FAL</th><th>2 PAR</th><th>ASIS</th><th>FAL</th><th>3 PAR</th><th>ASIS</th><th>FAL</th><th>CALIF. FINAL</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<p class="tiny">Escala: ' + (Number(D.cfg().escalaActa) === 10 ? '10' : '100') + ' · ASIS/FAL por ' + (D.cfg().conteoActa === 'horas' ? 'hora' : 'día de clase') + '. Generado con Escuadra el ' + u.fFecha(u.today()) + '.</p>' + firma() + '</div>', { landscape: true, title: 'Acta ' + g.grupo });
  };
  P.actaCopy = async g => {
    const t = D.alumnos(g).map(a => C.actaFila(g, a.id).slice(0, 9).join('\t')).join('\n');
    const ok = await u.copy(t);
    u.toast(ok ? 'Copiado. En la hoja "ACTA CAL." pégalo en la celda C9 (1 PAR del alumno 1). La columna final de la escuela ya tiene su fórmula.' : 'No se pudo copiar', ok ? 'ok' : 'err', 8000);
  };
  P.actaXlsx = async g => {
    try {
      if (!window.XLSX) { u.toast('Preparando Excel…'); await u.loadScript(E.XLSX_CDN); }
      const c = D.cfg(), X = window.XLSX;
      const aoa = [['OPCION EDUCATIVA: ' + c.opcion, '', 'ENTIDAD: ' + c.entidad], ['PLANTEL: ' + c.plantel, '', 'C.C.T.: ' + c.cct], ['CARRERA: ' + g.carrera, '', 'TURNO: ' + c.turno], ['SEMESTRE: ' + g.semestre, '', 'GRUPO: ' + g.grupo], ['CICLO ESCOLAR ' + c.ciclo + ' PERIODO : ' + c.periodo], ['ACTA PARA ENVIO DE CALIFICACIONES'], [], ACTA_H];
      D.alumnos(g).forEach(a => { const r = C.actaFila(g, a.id); aoa.push([a.num, a.nombre].concat(r.slice(0, 9), [''], [r[9]])); });
      const ws = X.utils.aoa_to_sheet(aoa); ws['!cols'] = [{ wch: 5 }, { wch: 42 }].concat(Array(11).fill({ wch: 8 })); ws['!cols'][12] = { wch: 20 };
      const wb = X.utils.book_new(); X.utils.book_append_sheet(wb, ws, ('ACTA CAL.' + g.grupo + ' ' + (g.id.indexOf('MEC') >= 0 ? 'MEC' : '')).slice(0, 31));
      X.writeFile(wb, 'ACTA_' + g.id + '_' + u.today() + '.xlsx');
    } catch (e) { u.toast('No se pudo crear el Excel: ' + e.message, 'err', 6000); }
  };

  /* ---------- planeación ---------- */
  const PP_CSS = '.pp{font:8.5pt/1.25 Arial,Helvetica,sans-serif;color:#000}.pp table{border-collapse:collapse;width:100%;margin:0}.pp td,.pp th{border:1px solid #000;padding:3px 5px;vertical-align:top}.pp .h{background:#f8cbad;font-weight:bold;text-align:center;letter-spacing:.1em}.pp .hs{background:#fbe4d5;font-weight:bold;text-align:center}.pp ul{margin:0;padding-left:14px}.pp .x{text-align:center;font-weight:bold;width:12px}.pp .c{text-align:center}.pp .tiny{font-size:7pt}.pp .tv td{font-size:6.8pt}.pp .ttl{text-align:center;font-weight:bold;font-size:9.5pt;border:0;padding-bottom:6px}.pp .sp{height:6px;border:0}';
  P.planHTML = pl => {
    const g = D.grupo(pl.grupoId) || D.grupoActual() || {}, c = D.cfg(), m = E.PROGRAMA.modulos[pl.modulo] || {}, sm = (m.sub || {})[pl.sm] || {}, id = pl.ident || {};
    const X = b => b ? '☒' : '☐';
    const L = arr => (arr && arr.length) ? '<ul>' + arr.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '';
    const sq = pl.secuencia || {}, tr = pl.transv || {}, rc = pl.recursos || {}, es = pl.estrategia || {}, va = pl.valida || {};
    const cols = [E.FUND.soc, E.FUND.areas, E.AMP, E.HVYT[0].items, E.HVYT[1].items, E.HVYT[2].items, E.HVYT[3].items, E.COCEDS];
    const keys = ['fund', 'fund', 'amp', 'hvyt', 'hvyt', 'hvyt', 'hvyt', 'cocends'];
    const nR = Math.max.apply(null, cols.map(x => x.length)); let tRows = '';
    for (let r = 0; r < nR; r++) tRows += '<tr>' + cols.map((col, ci) => { const o = col[r]; return o ? '<td>' + esc(o) + '</td><td class="x">' + ((tr[keys[ci]] || []).indexOf(o) >= 0 ? 'X' : '') + '</td>' : '<td></td><td class="x"></td>'; }).join('') + '</tr>';
    const mom = (k, lbl, tipo) => {
      const s = sq[k] || {}, ev = s.eval || {}, ins = s.instr || {};
      return '<tr><td><b>' + lbl + ':</b>' + (s.periodo ? '<br><i>' + esc(s.periodo) + '</i>' : '') + '<br>' + esc(s.desc || '') + '</td><td class="c">' + esc(s.horas == null ? '' : s.horas) + (s.ei !== '' && s.ei != null ? ' / ' + esc(s.ei) : '') + '<br><span class="tiny">Total: ' + (Number(s.horas || 0) + Number(s.ei || 0)) + '</span></td><td>' + L(s.tecnicas) + '</td><td>' + L(s.evidencias) + '</td>' +
        '<td><b>' + tipo + ':</b><br>A ' + X(ev.A) + ' C ' + X(ev.C) + ' H ' + X(ev.H) + '<br><b>Instrumento:</b><br>R ' + X(ins.R) + ' LC ' + X(ins.LC) + ' GO ' + X(ins.GO) + '<br>B ' + X(ins.B) + ' Exa ' + X(ins.Exa) + '<br>Otro: ' + esc(s.otro || '____') + '<br><b>Ponderación: ' + esc(s.pond == null ? '' : s.pond) + ' %</b></td></tr>';
    };
    const pond = k => (sq[k] || {}).pond == null ? '' : (sq[k] || {}).pond;
    return '<div class="pp">' +
      '<table><tr><td class="ttl">Subsecretaría de Educación Media Superior</td></tr></table>' +
      '<table><tr><td class="c"><b>Planeación didáctica para el Currículum Laboral</b><br><b>Semestre ' + esc(c.semestreTexto) + '</b></td></tr><tr><td class="hs" style="text-align:left">Plantel: ' + esc(c.plantel) + '</td></tr><tr><td class="h">A) I D E N T I F I C A C I Ó N</td></tr><tr><td class="hs" style="text-align:left">Parcial: ' + esc(id.parcialTxt) + '</td></tr></table>' +
      '<table><tr><th class="hs">Carrera</th><th class="hs" colspan="2">Docente(s)</th><th class="hs">Periodo en que se desarrolla(n) la(s) competencia(s):</th></tr><tr><td class="c">Técnico en Mecatrónica</td><td class="tiny" style="width:22mm">Elaborada:<br>Individual ' + X(id.elaboracion !== 'Colegiada') + '<br>Colegiada ' + X(id.elaboracion === 'Colegiada') + '</td><td>' + esc(id.docente || c.docente) + '</td><td>Fecha de inicio y de cierre: ' + esc(id.fechas) + '</td></tr></table>' +
      '<table><tr><th class="hs">MÓDULO</th><th class="hs">' + esc(pl.modulo) + '</th><th class="hs">SUBMÓDULO</th><th class="hs">' + esc(pl.sm) + '</th><th class="hs">Semestre</th><th class="hs">Grupos</th><th class="hs">Horas de mediación docente</th><th class="hs">Horas de estudio independiente</th><th class="hs">Horas totales</th></tr>' +
      '<tr><td colspan="2">' + esc(m.nombre) + '</td><td colspan="2">' + esc(sm.nombre) + '</td><td class="c">' + esc(g.semestre || '') + '°</td><td class="c">' + esc(id.grupoTxt) + '</td><td class="c">' + esc(id.horasMD) + '</td><td class="c">' + esc(id.horasEI) + '</td><td class="c">' + esc(id.horasTot) + '</td></tr></table>' +
      '<table><tr><td class="h">B) I N T E N C I O N E S &nbsp; F O R M A T I V A S</td></tr><tr><td><b>Resultado de aprendizaje del Módulo:</b>' + L(pl.resModulo) + '</td></tr><tr><td><b>Resultado de aprendizaje del Submódulo:</b> ' + esc(pl.resSM) + '</td></tr><tr><td class="hs">PROCESO PARA LA FORMACIÓN EN COMPETENCIAS</td></tr><tr><td>' + L(pl.proceso) + '</td></tr><tr><td><b>Desarrollo de la competencia:</b>' + L(pl.desarrollo) + '</td></tr></table>' +
      '<table class="tv"><tr><td class="h" colspan="16">C) T R A N S V E R S A L I D A D &nbsp; C U R R I C U L A R</td></tr><tr><td class="hs" colspan="16">M U L T I D I S C I P L I N A R I E D A D</td></tr>' +
      '<tr><th class="hs" colspan="4">CURRÍCULO FUNDAMENTAL</th><th class="hs" colspan="2">CURRÍCULO AMPLIADO</th><th class="hs" colspan="8">HABILIDADES PARA LA VIDA Y EL TRABAJO</th><th class="hs" colspan="2" rowspan="2">CONCEPTOS CENTRALES DE LA EDUCACIÓN PARA EL DESARROLLO SOSTENIBLE</th></tr>' +
      '<tr><th class="hs" colspan="2">RECURSOS SOCIOCOGNITIVOS</th><th class="hs" colspan="2">ÁREAS DE CONOCIMIENTO</th><th class="hs" colspan="2">RECURSOS SOCIOEMOCIONALES</th><th class="hs" colspan="2">EMPODERAMIENTO</th><th class="hs" colspan="2">CIUDADANÍA ACTIVA</th><th class="hs" colspan="2">APRENDIZAJE</th><th class="hs" colspan="2">EMPLEABILIDAD</th></tr>' + tRows +
      '<tr><td class="hs" colspan="12">I N T E R D I S C I P L I N A R I E D A D / T R A N S D I S C I P L I N A R I E D A D</td><td class="hs" colspan="4">Evidencia articuladora Producto/Desempeño</td></tr>' +
      '<tr><td colspan="12"><b>Nombre de la evidencia articuladora final o PAEC:</b> ' + esc(pl.paec) + '</td><td colspan="4">' + esc(pl.paecEvid || '') + '</td></tr>' +
      (pl.uac || [{}, {}, {}]).map((x, i) => '<tr><td colspan="3"><b>UAC ' + (i + 1) + '</b> ' + esc((x || {}).uac || '') + '</td><td colspan="7">' + (i === 0 ? '<b>Progresión</b> ' : '') + esc((x || {}).prog || '') + '</td><td colspan="2"><b>S.</b> ' + esc((x || {}).sem || '') + '</td><td colspan="4"></td></tr>').join('') + '</table>' +
      '<table><tr><td class="hs" style="width:30%;text-align:left">D) ESTRATEGIA DE ENSEÑANZA Y APRENDIZAJE:</td><td><ul><li>Diagnóstica: ' + esc(es.diag || '') + ' (' + pond('apertura') + '%).</li><li>Formativa: ' + esc(es.form || '') + ' (' + pond('desarrollo') + '%).</li><li>Sumativa: ' + esc(es.sum || '') + ' (' + pond('cierre') + '%).</li></ul></td></tr>' +
      '<tr><td class="hs" style="text-align:left">E) PRÁCTICAS A DESARROLLAR PARA EL LOGRO DE LA(S) COMPETENCIA(S) LABORAL(ES):<br><span class="tiny">(demostrativa, guiada, supervisada y autónoma)</span></td><td>' + L(pl.practicas) + '</td></tr></table>' +
      '<table><tr><td class="h" colspan="5">F) S E C U E N C I A &nbsp; D I D Á C T I C A</td></tr><tr><th class="hs" style="width:34%">Momentos didácticos:</th><th class="hs" style="width:9%">Tiempo (h) MD/EI</th><th class="hs">Técnicas didácticas, dinámicas y/o Prácticas</th><th class="hs">Evidencia(s) de Logro de Competencias Laborales: Producto/Desempeño</th><th class="hs" style="width:17%">Estrategia de Evaluación:</th></tr>' +
      mom('apertura', 'Apertura', 'Diagnóstica') + mom('desarrollo', 'Desarrollo', 'Formativa') + mom('cierre', 'Cierre', 'Sumativa') + '</table>' +
      '<table><tr><td class="h" colspan="3">G) R E C U R S O S &nbsp; D I D Á C T I C O S</td></tr><tr><th class="hs">Software/Material:</th><th class="hs">Equipo/Herramienta:</th><th class="hs">Fuentes de información:</th></tr><tr><td>' + L(rc.material) + '</td><td>' + L(rc.equipo) + '</td><td>' + L(rc.fuentes) + '</td></tr></table>' +
      '<table><tr><td class="sp" colspan="3"></td></tr><tr><td class="h" colspan="3">H) V A L I D A C I Ó N</td></tr><tr><th class="hs">Elaboró:</th><th class="hs">Revisó:</th><th class="hs">Avaló:</th></tr><tr><td class="c" style="height:52px;vertical-align:bottom">' + esc(va.elaboro || '') + '<br>Nombre(s)</td><td class="c" style="vertical-align:bottom">' + esc(va.reviso || '') + '<br>Nombre y cargo</td><td class="c" style="vertical-align:bottom">' + esc(va.avalo || '') + '<br>Nombre y cargo</td></tr></table>' +
      '<p class="tiny"><b>Nomenclatura:</b> UAC: Unidad de aprendizaje curricular · M: Módulo · SM: Submódulo · PAEC: Programa de Trabajo aula, escuela y comunidad · P: Progresión · S: Semana · A: Autoevaluación · C: Coevaluación · H: Heteroevaluación · R: Rúbrica · LC: Lista de Cotejo · GO: Guía de Observación · B: Bitácora · Exa: Examen · MD: mediación docente · EI: estudio independiente.</p></div>';
  };
  P.planeacion = pl => P.run('<style>' + PP_CSS + '</style>' + P.planHTML(pl), { landscape: false, margin: '8mm', title: 'Planeacion ' + pl.parcial });
  P.planWord = pl => {
    const html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Planeación</title><style>@page WordSection1{size:8.5in 11in;margin:0.45in} div.WordSection1{page:WordSection1} body{font-family:Arial} ' + PP_CSS + '</style></head><body><div class="WordSection1">' + P.planHTML(pl) + '</div></body></html>';
    u.download('Planeacion_' + pl.grupoId + '_' + pl.parcial + '_SM' + pl.sm + '.doc', '﻿' + html, 'application/msword');
    u.toast('Descargado. Ábrelo con Word (o súbelo a Drive y ábrelo con Google Docs).', 'ok', 6000);
  };
})();
