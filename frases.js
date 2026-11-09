/* Escuadra · Frase del día (v1.29.2).
   La primera vez que abres la app cada día sale una frase para mecatrónicos, con una barra de avance y un engrane
   que rueda sobre ella (unos 4 segundos; tócala para entrar antes). Una frase distinta cada día, sin repetir hasta
   terminar la lista. Se apaga en Ajustes → «Frase del día al abrir». */
(function () {
  'use strict';
  const E = window.E, D = E.data, S = E.store, u = E.u, esc = u.esc;
  const F = E.frase = {};

  // [frase, autor]. Las de «Dicho del taller» son de Escuadra.
  F.LISTA = [
    ['Dadme un punto de apoyo y moveré el mundo.', 'Arquímedes'],
    ['Los científicos estudian el mundo tal como es; los ingenieros crean el mundo que nunca ha sido.', 'Theodore von Kármán'],
    ['La mejor forma de predecir el futuro es inventarlo.', 'Alan Kay'],
    ['El genio es uno por ciento inspiración y noventa y nueve por ciento transpiración.', 'Thomas Edison'],
    ['Si he visto más lejos, es porque estoy parado sobre hombros de gigantes.', 'Isaac Newton'],
    ['Nada en la vida debe ser temido, solamente comprendido.', 'Marie Curie'],
    ['La imaginación es más importante que el conocimiento.', 'Albert Einstein'],
    ['Cuando puedes medir aquello de lo que hablas y expresarlo en números, sabes algo de ello.', 'Lord Kelvin'],
    ['Un experto es alguien que ya cometió todos los errores posibles en un campo muy pequeño.', 'Niels Bohr'],
    ['El fracaso es la oportunidad de comenzar de nuevo, con más inteligencia.', 'Henry Ford'],
    ['La paciencia y el tiempo hacen más que la fuerza y la pasión.', 'Jean de La Fontaine'],
    ['Aprender sin pensar es esfuerzo perdido; pensar sin aprender, peligroso.', 'Confucio'],
    ['Lo que sabemos es una gota de agua; lo que ignoramos, el océano.', 'Isaac Newton'],
    ['No he fracasado. He encontrado diez mil formas que no funcionan.', 'Thomas Edison'],
    ['La ciencia de hoy es la tecnología de mañana.', 'Edward Teller'],
    ['Mide dos veces, corta una.', 'Dicho del taller'],
    ['Un buen técnico no adivina: mide, prueba y corrige.', 'Dicho del taller'],
    ['El plano bien hecho ahorra tres viajes al taller.', 'Dicho del taller'],
    ['Primero que funcione, luego que funcione bien, y al final que se vea bien.', 'Dicho del taller'],
    ['Cada falla que encuentras hoy es una que no te va a sorprender en la feria.', 'Dicho del taller'],
    ['La hidráulica no perdona burbujas ni prisas.', 'Dicho del taller'],
    ['Un engrane solo no mueve nada; en equipo mueven la máquina.', 'Dicho del taller'],
    ['Si no está en la bitácora, no pasó.', 'Dicho del taller'],
    ['Antes de culpar al circuito, revisa la pila.', 'Dicho del taller'],
    ['La seguridad no es un paso extra: es el primer paso.', 'Dicho del taller'],
    ['El que pregunta se ve curioso un minuto; el que no, se queda con la duda toda la vida.', 'Dicho del taller'],
    ['Pequeñas mejoras cada día hacen grandes máquinas al final del semestre.', 'Dicho del taller'],
    ['Lo difícil se hace hoy; lo imposible, con un poco más de práctica.', 'Dicho del taller'],
    ['Tus manos aprenden lo que tu cabeza ya entendió; tu cabeza entiende lo que tus manos ya probaron.', 'Dicho del taller'],
    ['Un mecatrónico junta tres mundos: lo que se mueve, lo que conduce y lo que piensa.', 'Dicho del taller'],
    ['Hoy tu prototipo falla para que mañana tu máquina no falle.', 'Dicho del taller'],
    ['Las tolerancias se respetan, los errores se corrigen y los logros se celebran.', 'Dicho del taller'],
    ['No hay pieza pequeña en una máquina grande.', 'Dicho del taller'],
    ['Enseñar es aprender dos veces.', 'Joseph Joubert'],
    ['La práctica hace al maestro.', 'Refrán'],
    ['El ingenio, más que la fuerza, mueve las cosas pesadas.', 'Dicho del taller'],
    ['Quien domina la palanca, el engrane y el circuito, domina la máquina.', 'Dicho del taller'],
    ['Haz las cosas lo más simples posible, pero no más simples.', 'Albert Einstein'],
    ['Una máquina bien pensada se arma una vez; una mal pensada, cinco.', 'Dicho del taller'],
    ['Un sueño no se hace realidad por arte de magia: necesita sudor, determinación y trabajo duro.', 'Colin Powell']
  ];

  const dia = f => Math.floor(Date.parse((f || u.today()) + 'T12:00:00Z') / 864e5);
  F.deHoy = f => { const L = F.LISTA, n = dia(f); return L[((n * 7) % L.length + L.length) % L.length]; };   // ×7: salta por la lista sin repetir hasta terminarla
  const on = () => D.cfg().fraseDia !== false;
  const visto = () => { try { return localStorage.getItem('escuadra.frase'); } catch (e) { return null; } };
  const marca = () => { try { localStorage.setItem('escuadra.frase', u.today()); } catch (e) { } };

  F.mostrar = (ms) => {
    const fr = F.deHoy(); if (!fr || document.getElementById('frase-dia')) return;
    const dur = ms || 4000, quieto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = document.createElement('div'); el.id = 'frase-dia'; el.className = 'fd'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Frase del día');
    el.innerHTML = '<div class="fd-in"><p class="fd-q"><span class="fd-c">«</span>' + esc(fr[0]) + '<span class="fd-c">»</span></p><p class="fd-a">— ' + esc(fr[1]) + '</p></div>' +
      '<div class="fd-bar"><span class="fd-eng" aria-hidden="true">⚙️</span><div class="fd-tr"><div class="fd-fill"></div></div></div>' +
      '<div class="fd-logo"><img src="icon-512.png" alt="Escuadra" width="112" height="112"><small>Toca para entrar</small></div>';
    document.body.appendChild(el);
    const fill = el.querySelector('.fd-fill'), eng = el.querySelector('.fd-eng'), t0 = performance.now(); let fin = false, raf = 0;
    const cierra = () => { if (fin) return; fin = true; cancelAnimationFrame(raf); el.classList.add('fuera'); setTimeout(() => el.remove(), 350); };
    const paso = t => { const p = Math.min(1, (t - t0) / dur); fill.style.width = (p * 100) + '%'; eng.style.left = (p * 100) + '%'; if (!quieto) eng.style.transform = 'translateX(-50%) rotate(' + Math.round(p * 720) + 'deg)'; if (p < 1) raf = requestAnimationFrame(paso); else setTimeout(cierra, 250); };
    raf = requestAnimationFrame(paso);
    el.addEventListener('click', cierra); document.addEventListener('keydown', function k() { document.removeEventListener('keydown', k); cierra(); });
    F.cierra = cierra;
  };
  // al abrir la app: solo la primera vez del día
  // (en las pruebas automáticas no sale sola, para no tapar los botones)
  F.alAbrir = () => { if (!on() || visto() === u.today() || E.modoPantalla || (navigator.webdriver && !window.__fraseTest)) return; marca(); F.mostrar(); };

  // Ajustes: prender o apagar, y verla otra vez
  if (E.views && E.views.ajustes) {
    const va = E.views.ajustes; E.views.ajustes = function () { const o = va.apply(null, arguments); if (!o || !o.h) return o; const fr = F.deHoy();
      o.h += E.h.card('<h3>💬 Frase del día</h3><p class="muted small">La primera vez que abres la app cada día sale una frase para mecatrónicos. Hoy: «' + esc(fr[0]) + '» — ' + esc(fr[1]) + '</p><div class="row gap wrap"><label class="switch"><input type="checkbox" data-ch="frase-on"' + (on() ? ' checked' : '') + '><span>Frase del día al abrir</span></label>' + E.h.btn('Verla ahora', 'frase-ver', '', 'small') + '</div>'); return o; };
  }
  E.changes['frase-on'] = el => { S.update('config', c => { c.fraseDia = !!el.checked; }, {}); };
  E.actions['frase-ver'] = () => F.mostrar();
})();
