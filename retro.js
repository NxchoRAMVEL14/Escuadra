/* Escuadra · Retroalimentación rápida: lo que hiciste bien, lo que puedes mejorar y tu siguiente paso.
   Retroalimentación concreta y accionable (EEF, Teaching and Learning Toolkit: Feedback). Se guarda en el historial del
   alumno, se copia para escribirla en su libreta y las más recientes salen en la hoja para padres. Solo lo escolar. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, esc = u.esc;
  const A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn;
  const RT = E.retro = {};
  const KR = g => 'retro:' + g.id;
  const CTX = { libreta: '📒 Libreta', practica: '💻 Práctica', examen: '📝 Examen', proyecto: '🧩 Proyecto', actitud: '🙂 Actitud' };
  const SEC = [['bien', 'Lo que hiciste bien'], ['mejora', 'Lo que puedes mejorar'], ['paso', 'Tu siguiente paso']];
  const F = E.RETRO_FRASES = {
    libreta: { bien: ['Entregaste todas las tareas completas.', 'Tus dibujos tienen cotas y se entienden.', 'Escribiste el procedimiento, no solo el resultado.', 'Tu libreta está ordenada y con fecha.', 'Corregiste lo que te marqué la vez pasada.', 'Lo explicas con tus palabras.'],
      mejora: ['Te faltan tareas: ponte al corriente.', 'Escribe las unidades en cada resultado.', 'Agrega el procedimiento, no solo la respuesta.', 'Pon fecha y título a cada trabajo.', 'Tus dibujos necesitan regla y cotas.', 'Revisa cómo se escriben los términos técnicos.'],
      paso: ['Entrega lo pendiente esta semana.', 'Rehaz el ejercicio que salió mal y explícame el error.', 'Revisa la lista de cotejo antes de entregar.', 'Escribe un resumen de 5 renglones del tema con tus palabras.'] },
    practica: { bien: ['Tu croquis quedó totalmente restringido.', 'Las medidas coinciden con el plano.', 'Terminaste y ayudaste a un compañero.', 'Guardaste con el nombre correcto.', 'Resolviste el reto.', 'Usaste las herramientas correctas sin ayuda.'],
      mejora: ['A tu croquis le faltan restricciones (no quedó en verde).', 'Revisa las medidas contra el plano antes de entregar.', 'Guarda más seguido (Ctrl + S).', 'Pide ayuda si te atoras más de 5 minutos.', 'Acota desde los bordes correctos.', 'Termina la práctica antes de intentar el reto.'],
      paso: ['Haz la siguiente práctica del nivel.', 'Intenta el reto de esta práctica.', 'Repite la práctica sin ver los pasos.', 'Sé monitor de un compañero la próxima clase.'] },
    examen: { bien: ['Planteaste los problemas con su fórmula.', 'Mejoraste respecto a tu diagnóstico.', 'Contestaste las abiertas con tus palabras.', 'Escribiste las unidades en los resultados.'],
      mejora: ['Revisa las unidades y las conversiones.', 'Escribe el procedimiento completo: da puntos aunque el resultado falle.', 'Lee completa la pregunta antes de contestar.', 'Repasa el tema donde fallaste más.'],
      paso: ['Haz los ejercicios del tema que más te costó.', 'Explícale a un compañero una pregunta que fallaste.', 'Estudia recordando: tapa tus apuntes y escribe lo que sabes.', 'Pide la segunda oportunidad del tema más bajo.'] },
    proyecto: { bien: ['Tu equipo cumplió la etapa a tiempo.', 'Su prototipo probó la idea antes de fabricar.', 'Tomaste un rol y lo cumpliste.', 'Anotaron en la bitácora qué falló y cómo lo corrigieron.'],
      mejora: ['El equipo va atrasado en una etapa.', 'Repartan las tareas para que todos trabajen.', 'Midan dos veces antes de cortar.', 'Anoten las fallas en la bitácora.'],
      paso: ['Cierren la siguiente etapa esta semana.', 'Prueben el mecanismo y anoten qué ajustar.', 'Ensayen la explicación en 2 minutos.'] },
    actitud: { bien: ['Participaste con buenas preguntas.', 'Ayudaste a un compañero sin hacerle el trabajo.', 'Llegaste puntual toda la semana.', 'Trabajaste con respeto en tu equipo.', 'No te rendiste cuando algo salió mal.'],
      mejora: ['Evita distraerte con el celular en clase.', 'Llega a tiempo: te pierdes el inicio.', 'Participa más: tus ideas cuentan.', 'Respeta los turnos para hablar.'],
      paso: ['Esta semana haz una pregunta en cada clase.', 'Siéntate donde te concentres mejor.', 'Ponte una meta pequeña para la próxima clase.'] }
  };
  RT.lista = (g, aid) => (((S.get(KR(g)) || {})[aid]) || []).slice().sort((a, b) => String(b.f).localeCompare(String(a.f)) || String(b.id).localeCompare(String(a.id)));
  RT.paraPadres = (g, aid, n) => RT.lista(g, aid).filter(x => x.padres !== false).slice(0, n || 2);
  const corto = n => { const p = String(n).split(' '); return p.length >= 3 ? u.cap(p[p.length - 2].toLowerCase()) + ' ' + u.cap(p[0].toLowerCase()) : n; };
  const texto = sel => SEC.filter(s => (sel[s[0]] || []).length).map(s => s[1] + ': ' + sel[s[0]].join(' ')).join(' ');

  /* ---------- ventana para escribirla ---------- */
  const body = () => {
    const st = E.ui.rt, fr = F[st.ctx];
    return '<div class="filters">' + Object.keys(CTX).map(k => '<button type="button" class="tab' + (k === st.ctx ? ' on' : '') + '" data-act="rt-ctx" data-ctx="' + k + '">' + CTX[k] + '</button>').join('') + '</div>' +
      SEC.map(s => '<p class="small"><b>' + s[1] + '</b></p><div class="rt-chips">' + fr[s[0]].map((x, i) => '<button type="button" class="rt-chip' + ((st.sel[s[0]] || []).indexOf(x) >= 0 ? ' on' : '') + '" data-act="rt-chip" data-s="' + s[0] + '" data-i="' + i + '">' + esc(x) + '</button>').join('') + '</div>').join('') +
      '<label class="fld mt"><span>Retroalimentación (puedes editarla)</span><textarea class="inp" id="rt-txt" rows="4" placeholder="Toca frases arriba o escribe la tuya">' + esc(st.txt || '') + '</textarea></label>' +
      '<label class="switch mt"><input type="checkbox" id="rt-pad" ' + (st.padres ? 'checked' : '') + '><span>Que salga en la hoja para padres</span></label>' +
      '<div class="row gap wrap mt">' + btn('Guardar', 'rt-save', '', 'primary') + btn('Guardar y copiar', 'rt-save', 'data-copy="1"') + '</div>' +
      '<p class="muted small">Concreta y con un siguiente paso que pueda hacer. Una o dos frases por sección bastan.</p>';
  };
  RT.abrir = (aid, ctx, ref) => {
    const g = D.grupoActual(), a = D.alumno(g, aid); if (!a) return;
    E.ui.rt = { aid: aid, ctx: F[ctx] ? ctx : 'actitud', ref: ref || '', sel: {}, txt: '', padres: true };
    E.modal.open('💬 Retroalimentación · ' + corto(a.nombre), body());
  };
  A['rt-open'] = el => RT.abrir(el.dataset.aid, el.dataset.ctx, el.dataset.ref);
  A['rt-ctx'] = el => { const st = E.ui.rt; st.txt = (document.getElementById('rt-txt') || {}).value || st.txt; st.ctx = el.dataset.ctx; st.sel = {}; E.modal.body(body()); };
  A['rt-chip'] = el => {
    const st = E.ui.rt, s = el.dataset.s, x = F[st.ctx][s][Number(el.dataset.i)], L = st.sel[s] = st.sel[s] || [];
    const i = L.indexOf(x); if (i >= 0) L.splice(i, 1); else L.push(x);
    st.padres = !!(document.getElementById('rt-pad') || {}).checked; st.txt = texto(st.sel); E.modal.body(body());
  };
  A['rt-save'] = async el => {
    const st = E.ui.rt, g = D.grupoActual(), txt = ((document.getElementById('rt-txt') || {}).value || '').trim(); if (!txt) { u.toast('Elige o escribe algo', 'err'); return; }
    const padres = !!(document.getElementById('rt-pad') || {}).checked;
    S.update(KR(g), d => { (d[st.aid] = d[st.aid] || []).push({ id: u.uid('rt'), f: u.today(), ctx: st.ctx, ref: st.ref, txt: txt, padres: padres }); }, {});
    if (el.dataset.copy) { const ok = await u.copy(txt); u.toast(ok ? 'Guardada y copiada' : 'Guardada (no se pudo copiar)', ok ? 'ok' : 'err'); } else u.toast('Guardada en su historial', 'ok');
    E.modal.close();
  };
  A['rt-del'] = el => { if (!confirm('¿Borrar esta retroalimentación?')) return; const g = D.grupoActual(); S.update(KR(g), d => { d[el.dataset.aid] = (d[el.dataset.aid] || []).filter(x => x.id !== el.dataset.id); }, {}); };
  A['rt-copy'] = async el => { const g = D.grupoActual(), x = RT.lista(g, el.dataset.aid).find(y => y.id === el.dataset.id); if (!x) return; const ok = await u.copy(x.txt); u.toast(ok ? 'Copiada' : 'No se pudo copiar', ok ? 'ok' : 'err'); };
  CH['rt-pad'] = el => { const g = D.grupoActual(); S.update(KR(g), d => { const x = (d[el.dataset.aid] || []).find(y => y.id === el.dataset.id); if (x) x.padres = el.checked; }, {}); };

  /* ---------- historial en la ficha ---------- */
  RT.alumnoHTML = (g, a) => {
    const L = RT.lista(g, a.id);
    return card('<div class="row between gap wrap"><h3>💬 Retroalimentación</h3>' + btn('+ Nueva', 'rt-open', 'data-aid="' + a.id + '" data-ctx="actitud"', 'small primary') + '</div>' +
      (L.length ? '<ul class="rt-hist">' + L.slice(0, 6).map(x => '<li><div><span class="chip">' + (CTX[x.ctx] || x.ctx) + '</span> <small class="muted">' + u.fCorta(x.f) + '</small><p class="small">' + esc(x.txt) + '</p><label class="small"><input type="checkbox" data-ch="rt-pad" data-aid="' + a.id + '" data-id="' + x.id + '" ' + (x.padres !== false ? 'checked' : '') + '> En la hoja para padres</label></div><div class="row gap">' + btn('📋', 'rt-copy', 'data-aid="' + a.id + '" data-id="' + x.id + '" aria-label="Copiar"', 'small ghost') + btn('🗑', 'rt-del', 'data-aid="' + a.id + '" data-id="' + x.id + '" aria-label="Borrar"', 'small ghost') + '</div></li>').join('') + '</ul>' + (L.length > 6 ? '<p class="muted small">Y ' + (L.length - 6) + ' anteriores.</p>' : '') : '<p class="muted small">Todavía no le has dejado retroalimentación. Úsala al revisar libreta o prácticas (botón 💬).</p>'));
  };
})();
