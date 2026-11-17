/* Escuadra · Test de vida y carrera (v1.37.0): datos compartidos por la página de los alumnos (vida.html) y la app.
   1) Intereses vocacionales (modelo de Holland, RIASEC): 60 actividades adaptadas del O*NET Interest Profiler Short Form
      (U.S. Department of Labor, Employment and Training Administration). Traducción al español y adaptación propias
      (formato digital, orden y textos de resultados); no es una versión oficial ni está respaldada por USDOL/ETA.
      O*NET® es marca registrada de USDOL/ETA. Versión oficial en español: https://www.miproximopaso.org/explore/ip
   2) Habilidades y fortalezas, 3) áreas de la mecatrónica y 4) proyecto de vida: autoevaluaciones escritas para Escuadra,
      orientativas (no son pruebas estandarizadas).
   Archivo independiente: no depende de Escuadra. */
(function () {
  'use strict';
  const RIASEC = [
    { k: 'R', n: 'Realista', v: 'Hacer', d: 'Te gusta trabajar con tus manos, herramientas y máquinas: armar, reparar y ver resultados concretos.', mec: 'Ensamble, manufactura, mantenimiento y trabajo en taller o en planta.', job: ['Técnico de mantenimiento', 'Operador de CNC', 'Técnico electromecánico', 'Ingeniería mecánica o mecatrónica'] },
    { k: 'I', n: 'Investigador', v: 'Pensar', d: 'Te gusta entender cómo funcionan las cosas, investigar, analizar y resolver problemas difíciles.', mec: 'Diagnóstico de fallas, diseño de circuitos, control, calidad y metrología.', job: ['Técnico de pruebas y calidad', 'Diseño electrónico', 'Ingeniería en control y automatización', 'Investigación y desarrollo'] },
    { k: 'A', n: 'Artístico', v: 'Crear', d: 'Te gusta imaginar, diseñar y crear cosas nuevas con tu propio estilo.', mec: 'Diseño CAD, prototipos, impresión 3D, interfaces y diseño de producto.', job: ['Diseñador CAD', 'Diseño industrial', 'Prototipado e impresión 3D', 'Desarrollo de interfaces'] },
    { k: 'S', n: 'Social', v: 'Ayudar', d: 'Te gusta enseñar, ayudar y trabajar con otras personas.', mec: 'Capacitación técnica, soporte a clientes, seguridad industrial y trabajo en equipo.', job: ['Instructor técnico', 'Soporte técnico en campo', 'Seguridad e higiene industrial', 'Docencia técnica'] },
    { k: 'E', n: 'Emprendedor', v: 'Dirigir', d: 'Te gusta convencer, organizar a la gente, tomar decisiones y emprender.', mec: 'Ventas técnicas, supervisión de línea, gestión de proyectos y tu propio taller o integradora.', job: ['Ingeniero de ventas técnicas', 'Supervisor de producción', 'Líder de proyectos', 'Emprender una integradora o taller'] },
    { k: 'C', n: 'Convencional', v: 'Organizar', d: 'Te gusta el orden, los datos y los procedimientos claros.', mec: 'Control de calidad, inventarios, planeación del mantenimiento, documentación y procesos.', job: ['Técnico de calidad', 'Planeación de mantenimiento', 'Control de inventarios y almacén', 'Documentación de procesos'] }
  ];
  // 60 actividades (10 por tipo); el orden de presentación va en pares R R I I A A S S E E C C, como el original
  const ACT = {
    R: ['Construir gabinetes de cocina', 'Manejar un camión para entregar paquetes a oficinas y casas', 'Colocar ladrillo o azulejo', 'Revisar la calidad de piezas antes de enviarlas', 'Reparar aparatos electrodomésticos', 'Reparar e instalar cerraduras', 'Criar peces en un criadero', 'Preparar y operar máquinas para fabricar productos', 'Ensamblar piezas electrónicas', 'Apagar incendios forestales'],
    I: ['Desarrollar una nueva medicina', 'Investigar la causa de un incendio', 'Estudiar formas de reducir la contaminación del agua', 'Desarrollar una forma de predecir mejor el clima', 'Hacer experimentos químicos', 'Trabajar en un laboratorio de biología', 'Estudiar el movimiento de los planetas', 'Inventar un sustituto del azúcar', 'Examinar muestras de sangre con un microscopio', 'Hacer pruebas de laboratorio para identificar enfermedades'],
    A: ['Escribir libros u obras de teatro', 'Pintar escenografías para obras de teatro', 'Tocar un instrumento musical', 'Escribir guiones para cine o televisión', 'Componer o hacer arreglos musicales', 'Bailar jazz o zapateado', 'Hacer dibujos', 'Cantar en una banda', 'Crear efectos especiales para películas', 'Editar películas'],
    S: ['Enseñarle a una persona una rutina de ejercicio', 'Enseñarles a niños a practicar deportes', 'Ayudar a personas con problemas personales o emocionales', 'Enseñar lengua de señas a personas sordas', 'Dar orientación vocacional a otras personas', 'Ayudar a dirigir una sesión de terapia de grupo', 'Dar terapia de rehabilitación', 'Cuidar niños en una guardería', 'Hacer trabajo voluntario en una organización sin fines de lucro', 'Dar clases en una preparatoria'],
    E: ['Comprar y vender acciones en la bolsa', 'Negociar contratos de negocios', 'Administrar una tienda', 'Representar a un cliente en un juicio', 'Tener una estética o peluquería', 'Promocionar una nueva línea de ropa', 'Dirigir un departamento en una empresa grande', 'Vender mercancía en una tienda departamental', 'Poner tu propio negocio', 'Administrar una tienda de ropa'],
    C: ['Hacer una hoja de cálculo en la computadora', 'Calcular los sueldos de los empleados', 'Revisar registros o formularios para corregir errores', 'Hacer el inventario de materiales con una computadora de mano', 'Instalar programas en las computadoras de una red grande', 'Registrar los pagos de renta', 'Usar una calculadora', 'Llevar el registro del inventario', 'Llevar el registro de envíos y recepciones', 'Sellar, ordenar y repartir el correo de una organización']
  };
  const ORDEN = []; for (let b = 0; b < 5; b++) 'RIASEC'.split('').forEach(k => { ORDEN.push([k, b * 2]); ORDEN.push([k, b * 2 + 1]); });
  const HAB = [
    { k: 'manual', n: 'Manual y mecánica', rol: 'Constructor/a', it: ['Arreglo o armo cosas con mis manos', 'Uso herramientas con cuidado y precisión', 'Me fijo cómo funciona un aparato por dentro'] },
    { k: 'logica', n: 'Lógica y matemáticas', rol: 'Analista de fallas', it: ['Resuelvo problemas de matemáticas sin rendirme rápido', 'Encuentro la causa de un problema paso a paso', 'Me gustan los acertijos y retos de lógica'] },
    { k: 'digital', n: 'Tecnología y programación', rol: 'Programador/a', it: ['Aprendo rápido programas o apps nuevas', 'Me gustaría programar o ya lo he hecho', 'Encuentro en internet cómo resolver algo técnico'] },
    { k: 'creativa', n: 'Creatividad y diseño', rol: 'Diseñador/a', it: ['Se me ocurren ideas diferentes para resolver algo', 'Dibujo o diseño cosas', 'Mejoro o personalizo objetos'] },
    { k: 'comunica', n: 'Comunicación', rol: 'Vocero/a del equipo', it: ['Explico mis ideas de forma que otros me entienden', 'Puedo hablar frente al grupo', 'Escucho a los demás antes de responder'] },
    { k: 'equipo', n: 'Trabajo en equipo', rol: 'Coordinador/a de apoyo', it: ['Ayudo a mis compañeros cuando no entienden', 'Me llevo bien en equipos distintos', 'Cumplo mi parte en un trabajo en equipo'] },
    { k: 'orden', n: 'Organización y calidad', rol: 'Responsable de calidad y bitácora', it: ['Organizo mis cosas y mi tiempo', 'Sigo instrucciones y procedimientos con cuidado', 'Reviso mi trabajo antes de entregarlo'] },
    { k: 'lider', n: 'Liderazgo e iniciativa', rol: 'Líder de proyecto', it: ['Tomo la iniciativa cuando hay que hacer algo', 'Me gusta coordinar a otros', 'Tomo decisiones aunque sean difíciles'] }
  ];
  const AREAS = [
    { k: 'mec', n: 'Mecánica y manufactura', ico: '⚙️', it: ['Maquinar una pieza en un torno o una CNC', 'Armar un mecanismo con engranes y poleas', 'Medir piezas con vernier y micrómetro', 'Diseñar la estructura de una máquina'] },
    { k: 'ele', n: 'Electrónica', ico: '🔌', it: ['Armar y soldar un circuito', 'Medir voltaje y corriente con el multímetro', 'Diseñar una placa de circuito impreso', 'Reparar una tarjeta electrónica'] },
    { k: 'prog', n: 'Programación y control', ico: '💻', it: ['Programar un Arduino', 'Programar un PLC para una línea de producción', 'Hacer una app que controle un dispositivo', 'Ajustar el control de un motor o de una temperatura'] },
    { k: 'cad', n: 'Diseño CAD e impresión 3D', ico: '📐', it: ['Dibujar piezas en FreeCAD o SolidWorks', 'Imprimir en 3D un prototipo', 'Hacer los planos de una pieza', 'Simular cómo se mueve un ensamble'] },
    { k: 'mant', n: 'Mantenimiento industrial', ico: '🛠️', it: ['Encontrar por qué se paró una máquina', 'Dar mantenimiento preventivo a motores y bombas', 'Revisar un sistema neumático con fugas', 'Llevar la bitácora de mantenimiento de una planta'] },
    { k: 'auto', n: 'Automatización y robótica', ico: '🤖', it: ['Programar un brazo robótico', 'Instalar sensores en una banda transportadora', 'Automatizar un proceso que hoy se hace a mano', 'Diseñar una celda robotizada'] }
  ];
  const RUEDA = ['Escuela', 'Familia', 'Amigos', 'Salud y deporte', 'Diversión', 'Dinero y ahorro', 'Crecimiento personal', 'Mi futuro y carrera'];
  const ESCALA = ['Nada como yo', 'Poco', 'Más o menos', 'Bastante', 'Totalmente como yo'];

  /* ---------- puntajes ---------- */
  const top = (arr, n) => arr.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]).slice(0, n).map(x => x[1]);
  const codigoHolland = r => top(r, 3).map(i => RIASEC[i].k).join('');

  /* ---------- código para el profe: 8 caracteres (7 de datos + 1 de verificación) ---------- */
  const ALF = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const fnv = s => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const empaca = (r, h, a) => { let p = 0; r.forEach(x => { p = p * 11 + Math.max(0, Math.min(10, x | 0)); }); p = p * 64 + h[0] * 8 + h[1]; p = p * 36 + a[0] * 6 + a[1]; return p; };
  const desempaca = p => { const a1 = p % 6, a0 = Math.floor(p / 6) % 6; p = Math.floor(p / 36); const h1 = p % 8, h0 = Math.floor(p / 8) % 8; p = Math.floor(p / 64); const r = []; for (let i = 0; i < 6; i++) { r.unshift(p % 11); p = Math.floor(p / 11); } return { r: r, h: [h0, h1], a: [a0, a1] }; };
  const codigo = (c, num, r, h, a) => { let p = empaca(r, h, a), s = ''; for (let i = 0; i < 7; i++) { s = ALF[p % 32] + s; p = Math.floor(p / 32); } s += ALF[fnv('vida|' + c + '|' + num + '|' + s) % 32]; return s.slice(0, 4) + '-' + s.slice(4); };
  const lee = (c, num, cod) => {
    const s = String(cod || '').toUpperCase().replace(/[^0-9A-Z]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1').replace(/U/g, 'V'); if (s.length !== 8) return null;
    const d = s.slice(0, 7); if (ALF[fnv('vida|' + c + '|' + num + '|' + d) % 32] !== s[7]) return null;
    let p = 0; for (const ch of d) { const v = ALF.indexOf(ch); if (v < 0) return null; p = p * 32 + v; }
    const o = desempaca(p); if (o.r.some(x => x > 10) || o.h.some(x => x > 7) || o.a.some(x => x > 5)) return null; return o;
  };
  window.VIDA = { RIASEC: RIASEC, ACT: ACT, ORDEN: ORDEN, HAB: HAB, AREAS: AREAS, RUEDA: RUEDA, ESCALA: ESCALA, top: top, codigoHolland: codigoHolland, codigo: codigo, lee: lee,
    FUENTE: 'Intereses: adaptado del O*NET Interest Profiler Short Form (USDOL/ETA), traducción y adaptación propias, no oficial. O*NET® es marca registrada de USDOL/ETA. Habilidades, áreas y proyecto de vida: autoevaluaciones orientativas de Escuadra.' };
})();
