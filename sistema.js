/* Escuadra · Sistema (v1.28): Historial de cambios (Más → Historial de cambios), y en Ajustes los respaldos diarios y
   el reporte de errores para Claude. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const HI = E.historial;

  /* ---------- qué es cada documento, en palabras ---------- */
  const fc = f => (/^\d{4}-\d{2}-\d{2}$/.test(f || '') ? u.fCorta(f) : f);
  const grupoN = gid => { const g = D.grupo(gid); return g ? g.nombre : gid; };
  const doc = k => { const d = S.docs[k]; return d && d.data; };
  E.descDoc = k => {
    const p = String(k).split(':'), t = p[0], gid = p[1], x = p[2];
    const nom = () => { const d = doc(k) || {}; return d.nombre || d.titulo || d.concepto || ''; };
    switch (t) {
      case 'asis': return 'Pase de lista del ' + fc(x);
      case 'part': return 'Participación del ' + fc(x);
      case 'act': return 'Actividad «' + (nom() || x) + '»';
      case 'grupo': return 'Grupo ' + grupoN(gid) + ' (alumnos y datos)';
      case 'config': return 'Ajustes';
      case 'parciales': return 'Fechas de parciales';
      case 'exa': return 'Examen «' + (nom() || x) + '»';
      case 'rep': return 'Calentamiento o boleto del ' + fc(x);
      case 'cierre': return 'Cierre del día ' + fc(x);
      case 'obs': case 'obsnota': return 'Observaciones del ' + fc(x);
      case 'tutadeu': return 'Adeudos e inscripción';
      case 'tutseg': return 'Seguimiento de tutoría';
      case 'tut': return 'Tutoría (plan y ajustes)';
      case 'coop': return 'Cooperación «' + (nom() || x || '') + '»';
      case 'cerrado': { const pp = C.parcial(x); return 'Cierre del ' + (pp ? pp.nombre : 'parcial'); }
      case 'casaRep': return 'Códigos del repaso para casa';
      case 'proy': { const pp = C.parcial(x); return 'Proyecto del ' + (pp ? pp.nombre : 'parcial'); }
      case 'prueba': { const pp = C.parcial(x); return 'Pruebas físicas del proyecto (' + (pp ? pp.nombre : 'parcial') + ')'; }
      case 'rubFisica': return 'Rúbricas de prueba física';
      case 'cobro': return 'Cobro «' + (nom() || 'de copias') + '»';
      case 'impLog': return 'Registro de impresiones';
      case 'cobAvisos': return 'Avisos de cobros';
      case 'cobrosCfg': return 'Precio por hoja';
      case 'plan': return 'Planeación';
      case 'libreta': return 'Libreta';
      case 'manual': return 'Calificaciones capturadas a mano';
      case 'clases': return 'Plan de clases';
      default: return t.charAt(0).toUpperCase() + t.slice(1) + (x ? ' ' + fc(x) : '');
    }
  };
  const accion = lbl => { const N = (E.undo && E.undo.NOMBRE) || {}; return /^hist-rev/.test(lbl || '') ? 'Revertiste un cambio' : lbl === 'tut-cifra' ? 'Cambio en tutoría' : N[lbl] ? 'Cambio de ' + N[lbl] : 'Cambio'; };

  /* ---------- Historial de cambios ---------- */
  V.historial = dia => {
    const hoy = u.today(), ay = u.addDays(hoy, -1), f = dia === 'ayer' ? ay : hoy, L = HI ? HI.entradas(f) : [];
    let h = '<div class="filters"><a class="tab ' + (f === hoy ? 'on' : '') + '" href="#/historial">Hoy</a><a class="tab ' + (f === ay ? 'on' : '') + '" href="#/historial/ayer">Ayer</a></div>';
    h += card('<h3>🕘 Historial de cambios</h3><p class="muted small">Cada cosa que guardas queda aquí con cómo estaba antes. «↺ Revertir» regresa solo ese cambio (y se puede deshacer). Vive en este aparato y guarda hoy y ayer.</p>');
    if (!L.length) return { t: 'Historial', h: h + card('<p class="muted">Sin cambios ' + (f === hoy ? 'hoy' : 'ayer') + ' en este aparato.</p>') };
    h += '<ul class="hist-l">' + L.map(x => {
      const ks = Object.keys(x.prev), desp = HI.cambiadoDespues(x);
      return '<li class="card hist-i' + (x.revertida ? ' rev' : '') + '"><div class="row between gap wrap"><div><b>' + new Date(x.t).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) + ' · ' + esc(accion(x.lbl)) + '</b>' +
        '<br><small class="muted">' + ks.slice(0, 4).map(k => esc(E.descDoc(k)) + (x.prev[k] == null ? ' (nuevo)' : '')).join(' · ') + (ks.length > 4 ? ' · y ' + (ks.length - 4) + ' más' : '') + '</small>' +
        (x.revertida ? '<br><small class="okc">Revertido a las ' + new Date(x.revertida).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) + '</small>' : desp.length ? '<br><small class="muted">Después cambió otra vez: ' + desp.slice(0, 2).map(k => esc(E.descDoc(k))).join(', ') + '</small>' : '') +
        '</div>' + (x.revertida ? '' : btn('↺ Revertir', 'hist-rev', 'data-id="' + x.id + '" data-f="' + f + '"', 'small')) + '</div></li>';
    }).join('') + '</ul>';
    return { t: 'Historial', h: h };
  };
  A['hist-rev'] = el => {
    const x = (HI.dias[el.dataset.f] || []).find(y => y.id === el.dataset.id); if (!x) return;
    const desp = HI.cambiadoDespues(x);
    if (desp.length && !confirm('Después de este cambio volviste a cambiar ' + desp.map(k => E.descDoc(k)).join(', ') + '. Revertir lo regresa a como estaba ANTES de este cambio y también quita lo que hiciste después en eso. ¿Continuar?')) return;
    HI.revertir(x); u.toast('↺ Revertido · ↶ Deshacer si te equivocaste', 'ok', 3500); E.render();
  };

  /* ---------- en Ajustes: respaldos diarios y reporte de errores ---------- */
  if (V.ajustes) {
    const va = V.ajustes;
    V.ajustes = function () {
      const o = va.apply(null, arguments); if (!o || /Algo falló/.test(o.h)) return o;
      const ER = E.errores, n = ER ? ER.lista().length : 0, ul = n ? ER.lista()[n - 1] : null;
      if (E.respaldo) o.h += card('<h3>🗓 Respaldos diarios</h3>' + E.respaldo.html(), 'aj-resp');
      o.h += card('<h3>🐞 Reporte de errores</h3><p class="small">' + (n ? n + (n === 1 ? ' error anotado' : ' errores anotados') + ' en este aparato · el último: ' + new Date(ul.t).toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + '.' : 'Sin errores anotados en este aparato. 👍') + '</p><p class="muted small">Si algo no funciona, toca «Copiar reporte» y pégaselo a Claude: lleva la versión, la pantalla y el error, sin nombres de alumnos ni calificaciones.</p>' +
        '<div class="row gap wrap">' + btn('📋 Copiar reporte para Claude', 'err-copiar', '', n ? 'primary' : '') + (n ? btn('Borrar la lista', 'err-borrar', '', 'small ghost') : '') + '</div>');
      o.h += card('<div class="row between gap wrap"><h3>🕘 Historial de cambios</h3>' + link('Abrir', 'historial', 'small') + '</div><p class="muted small">Lo que cambiaste hoy y ayer en este aparato; revierte un cambio en particular.</p>');
      const prev = o.after; o.after = () => { if (prev) prev(); if (E.respaldo) E.respaldo.pinta(); };
      return o;
    };
  }
  A['err-copiar'] = async () => { const ok = await u.copy(E.errores ? E.errores.reporte() : 'Sin registro'); u.toast(ok ? 'Reporte copiado: pégaselo a Claude' : 'No se pudo copiar', ok ? 'ok' : 'err'); };
  A['err-borrar'] = () => { if (E.errores) E.errores.borrar(); u.toast('Lista de errores borrada', 'ok'); E.render(); };
})();
