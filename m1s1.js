/* Escuadra · Módulo I «Construye circuitos electrónicos» · Submódulo 1: Comprueba el funcionamiento de circuitos electrónicos (64 h).
   Temas, clases hora por hora, tareas, banco de examen, ideas, figuras y proyecto del 1er parcial de 2º semestre.
   Programa SEP 2024 (clave 3071300008-23), pp. 13-31 y estrategia didáctica sugerida pp. 128-145; bibliografía del módulo
   (Boylestad, Hayt, Hermosa, Pérez Montiel, Tocci) y hojas de datos de fabricantes. Materiales de bajo costo y simuladores
   gratuitos (Tinkercad Circuits y Falstad, en el navegador). */
(function () {
  'use strict';
  const E = window.E, H = E.mods.h, f = H.f, pick = H.pick, ops = H.ops, si = H.si;
  const FU = 'Programa SEP 2024, Módulo I, Submódulo 1';

  /* =================== TEMAS =================== */
  const temas = [
    {
      id: 'm1-seguridad', sm: 'I-1', ac: 'Interpreta planos y diagramas electrónicos', titulo: 'Seguridad en el taller de electrónica', dur: '50 min',
      objetivo: 'Que trabajen con electricidad, cautín y aparatos desarmados sin lastimarse ni dañar el equipo.',
      explica: [
        'La corriente que pasa por el cuerpo es lo que lastima. Con unos cuantos miliamperes ya se siente un choque y con decenas puede perderse el control de los músculos; por eso en el taller trabajamos con fuentes de 5 a 12 V de corriente directa y nunca conectamos nada directo al contacto de 127 V.',
        'Los aparatos desarmados guardan peligros: capacitores grandes cargados (fuentes, flash de cámaras, hornos de microondas), tubos de televisión y baterías de litio que se inflan o se perforan. Por eso no se desarman microondas, televisiones de tubo ni fuentes de alto voltaje, y las baterías se retiran antes.',
        'El cautín trabaja a más de 300 °C: siempre en su soporte, cable lejos de la punta y nunca se sopla ni se sacude la soldadura. La descarga electrostática (la "chispa" al tocar algo) daña circuitos integrados: antes de manipularlos, toca una superficie metálica y no los toques por las patitas (NOM-022-STPS-2015).',
        'El equipo de protección personal (NOM-017-STPS-2024) en electrónica es sencillo: lentes de seguridad al cortar terminales o soldar, cabello recogido, nada de anillos o pulseras metálicas y área despejada.'
      ],
      pantalla: ['Lo que lastima es la corriente que pasa por el cuerpo', 'En el taller: 5 a 12 V de CD, nunca 127 V', 'No se desarman: microondas, TV de tubo, fuentes de alto voltaje', 'Cautín: >300 °C, siempre en su soporte', 'Toca metal antes de tocar un circuito integrado', 'Lentes al cortar terminales y al soldar'],
      clave: [['Corriente directa (CD)', 'Fluye siempre en un sentido: pilas, cargadores, fuentes'], ['Corriente alterna (CA)', 'Cambia de sentido 60 veces por segundo: el contacto de la casa (127 V)'], ['Descarga electrostática', 'Chispa de electricidad estática que daña los circuitos integrados'], ['EPP', 'Equipo de protección personal: lentes, ropa adecuada'], ['Capacitor cargado', 'Guarda energía aunque el aparato esté desconectado']],
      ejemplo: { titulo: 'Antes de desarmar un aparato', pasos: ['Desconéctalo y quítale pilas o batería.', 'Espera unos minutos: los capacitores se descargan.', 'Revisa que no sea microondas, TV de tubo ni fuente de alto voltaje.', 'Trabaja sobre la mesa despejada, con lentes y con el desarmador correcto.'], resultado: 'Si dudas, pregunta antes de abrir: es lo que hace un técnico en planta.' },
      preguntas: [['¿Qué es lo que realmente lastima en un choque eléctrico?', 'La corriente que circula por el cuerpo.'], ['¿Por qué no se desarma un horno de microondas en el taller?', 'Tiene un capacitor y un transformador de alto voltaje que pueden ser mortales aunque esté desconectado.'], ['¿Dónde debe estar el cautín cuando no lo usas?', 'En su soporte, con la punta lejos de cables y personas.'], ['¿Qué haces antes de tomar un circuito integrado?', 'Tocar una superficie metálica para descargar la estática y tomarlo por el cuerpo, no por las patitas.']],
      errores: ['Dejar el cautín acostado sobre la mesa.', 'Desarmar aparatos conectados.', 'Probar "a ver si da toques" con el contacto de la pared.', 'Cortar terminales sin lentes: las puntas salen volando.'],
      vida: 'En cualquier planta del Bajío, la primera capacitación de un técnico es seguridad: bloqueo de energía, EPP y riesgos eléctricos. Quien la respeta trabaja años sin accidentes.',
      ideas: ['m1-ewaste-seguro', 'pregunta-reto'], fuente: FU + ' (p. 14); NOM-017-STPS-2024; NOM-022-STPS-2015 (el programa SEP cita la NOM-017-STPS-2008 y la NOM-022-STPS-2008, sustituidas por la 2024 y la 2015).'
    },
    {
      id: 'm1-magnitudes', sm: 'I-1', ac: 'Verifica las variables eléctricas del circuito electrónico', titulo: 'Voltaje, corriente, resistencia y potencia', dur: '50 min',
      objetivo: 'Que distingan las cuatro magnitudes eléctricas con sus unidades y prefijos.',
      explica: [
        'Piensa en agua dentro de mangueras. El voltaje (V, en volts) es como la presión que empuja el agua: la diferencia de nivel entre dos puntos. La corriente (I, en amperes) es cuánta agua pasa por segundo. La resistencia (R, en ohms, Ω) es qué tan angosta está la manguera: frena el paso.',
        'La potencia (P, en watts) es qué tan rápido se convierte la energía: un foco de 9 W gasta menos que uno de 60 W. En electrónica casi todo es pequeño, por eso usamos prefijos: mili (m) = milésima, kilo (k) = mil, mega (M) = millón, micro (µ) = millonésima.',
        'Las pilas y fuentes de los circuitos electrónicos dan corriente directa (CD): un borne positivo (+) y uno negativo (−) que no cambian. El contacto de la casa da corriente alterna (CA) de 127 V: no se usa directo en el taller.'
      ],
      pantalla: ['Voltaje (V): el empuje · volts', 'Corriente (I): lo que circula · amperes', 'Resistencia (R): lo que frena · ohms (Ω)', 'Potencia (P): energía por segundo · watts', 'm = ×0.001 · k = ×1000 · M = ×1 000 000 · µ = ×0.000001'],
      clave: [['1 mA', '0.001 A (un LED usa unos 10 a 20 mA)'], ['1 kΩ', '1000 Ω'], ['1 MΩ', '1 000 000 Ω'], ['1 µF', '0.000001 F'], ['Volt (V)', 'Unidad de voltaje o diferencia de potencial'], ['Ampere (A)', 'Unidad de corriente']],
      ejemplo: { titulo: 'Conversiones de todos los días', pasos: ['Un resistor de 4.7 kΩ = 4700 Ω.', 'Un LED con 20 mA = 0.020 A.', 'Un capacitor de 470 µF = 0.000470 F.', 'Una pila de 9 V con un LED a 0.02 A entrega P = 9 × 0.02 = 0.18 W.'], resultado: 'Pasa todo a la unidad base antes de calcular.' },
      preguntas: [['¿Cuántos ohms son 2.2 kΩ?', '2200 Ω.'], ['¿Cuántos amperes son 350 mA?', '0.35 A.'], ['En la analogía del agua, ¿qué representa la corriente?', 'La cantidad de agua que pasa por segundo.'], ['¿Qué tipo de corriente da una pila?', 'Corriente directa (CD).']],
      errores: ['Calcular con kΩ y mA mezclados sin convertir.', 'Confundir m (mili) con M (mega).', 'Decir "voltios de corriente": el voltaje y la corriente son cosas distintas.'],
      vida: 'Cualquier técnico revisa placas de datos: "24 V, 2.5 A, 60 W". Leerlas bien evita quemar equipos caros en la planta.',
      ideas: ['m1-agua', 'pr-plickers'], fuente: FU + ' (p. 15); Pérez Montiel (2015), unidad 12; NOM-008-SE-2021 (el programa SEP cita la NOM-008-SCFI-2002, sustituida por la NOM-008-SE-2021 desde junio de 2024).'
    },
    {
      id: 'm1-componentes', sm: 'I-1', ac: 'Interpreta planos y diagramas electrónicos', titulo: 'Componentes electrónicos y su función', dur: '50 min',
      objetivo: 'Que reconozcan los componentes más comunes de una placa y digan para qué sirve cada uno.',
      explica: [
        'Los componentes pasivos no amplifican ni controlan: resistores (limitan la corriente), capacitores (guardan carga y filtran), inductores o bobinas (se oponen a cambios de corriente) y transformadores (suben o bajan voltaje alterno).',
        'Los componentes activos controlan la corriente: diodos (dejan pasar en un solo sentido; el LED además ilumina), transistores (interruptores y amplificadores controlados por una corriente pequeña) y circuitos integrados (muchos transistores en un solo encapsulado).',
        'Además hay elementos de conexión y protección: fuentes de voltaje, interruptores, fusibles, conectores, pistas de cobre y cables. En la placa, cada componente trae una marca serigrafiada: R para resistores, C capacitores, L bobinas, D diodos, Q transistores, U o IC circuitos integrados.'
      ],
      pantalla: ['Pasivos: resistor (R), capacitor (C), inductor (L), transformador (T)', 'Activos: diodo y LED (D), transistor (Q), circuito integrado (U, IC)', 'Conexión y protección: fusible (F), interruptor (S), conector (J)', 'La letra en la placa te dice qué es'],
      clave: [['Resistor', 'Limita la corriente'], ['Capacitor', 'Guarda carga; filtra y temporiza'], ['Inductor', 'Bobina: se opone a cambios de corriente'], ['Diodo', 'Deja pasar la corriente en un solo sentido'], ['Transistor', 'Interruptor o amplificador controlado'], ['Circuito integrado', 'Un circuito completo dentro de un encapsulado']],
      ejemplo: { titulo: 'Un cargador de celular por dentro', pasos: ['Transformador pequeño (T1): baja el voltaje.', 'Diodos (D1 a D4): convierten la CA en CD.', 'Capacitor electrolítico (C1): alisa el voltaje.', 'Circuito integrado (U1) y transistor (Q1): regulan los 5 V de salida.'], resultado: 'Con las letras de la placa ya sabes qué buscar.' },
      preguntas: [['¿Qué componente deja pasar la corriente en un solo sentido?', 'El diodo.'], ['¿Qué letra lleva un transistor en la placa?', 'Q.'], ['¿Para qué sirve un capacitor en una fuente?', 'Para alisar (filtrar) el voltaje y guardar carga.'], ['Menciona un componente activo y uno pasivo.', 'Activo: transistor o diodo; pasivo: resistor o capacitor.']],
      errores: ['Confundir un capacitor cerámico con un resistor (ambos son pequeños: el resistor tiene bandas de colores).', 'Creer que un componente sin marca no importa.', 'Arrancar componentes sin anotar dónde estaban.'],
      vida: 'Reparar es reconocer: el técnico que identifica un capacitor inflado o una resistencia quemada en segundos ahorra horas de paro.',
      ideas: ['m1-desarmado', 'm1-ewaste-seguro'], fuente: FU + ' (p. 14); Boylestad y Nashelsky (2009); Hermosa (2009).'
    },
    {
      id: 'm1-simbologia', sm: 'I-1', ac: 'Interpreta planos y diagramas electrónicos', titulo: 'Simbología y lectura de diagramas', dur: '50 min',
      objetivo: 'Que lean un diagrama esquemático: qué es cada símbolo y cómo se conectan.',
      explica: [
        'Un diagrama esquemático dibuja la función, no la forma: cada componente tiene un símbolo normalizado (en México, NMX-J-136-ANCE) y las líneas son conexiones. Un punto donde se cruzan líneas indica unión; si se cruzan sin punto, no están conectadas.',
        'Existen tres formas de representar un circuito: el pictórico (dibujo como se ve), el esquemático (con símbolos, para entender y calcular) y el de la placa (PCB: dónde van las piezas y pistas). El técnico pasa de uno a otro.',
        'Cada símbolo lleva su referencia (R1, C2, D3) y su valor (220 Ω, 10 µF, 1N4007). La tierra o común (GND) es el punto de referencia de los voltajes: casi siempre el negativo de la fuente.'
      ],
      pantalla: ['El esquemático dibuja la función, no la forma', 'Punto = unión · cruce sin punto = no se tocan', 'Cada símbolo: referencia (R1) + valor (220 Ω)', 'GND (tierra, común): referencia de 0 V', 'Pictórico → esquemático → placa (PCB)'],
      clave: [['Zigzag o rectángulo', 'Resistor'], ['Dos placas paralelas', 'Capacitor (con + si es electrolítico)'], ['Triángulo con raya', 'Diodo; con flechas que salen: LED'], ['Círculo con 3 terminales', 'Transistor (B, C, E)'], ['Líneas largas y cortas', 'Pila o batería (+ la larga)'], ['Rayas que bajan', 'Tierra (GND)']],
      ejemplo: { titulo: 'Leer una luz con interruptor', pasos: ['Pila de 9 V (B1): + arriba.', 'Interruptor S1 en serie.', 'Resistor R1 de 470 Ω limita la corriente.', 'LED D1 con su ánodo hacia R1 y su cátodo a GND.'], resultado: 'Si el LED queda al revés, no enciende: el símbolo te dice el sentido.' },
      preguntas: [['¿Qué indica un punto donde se juntan dos líneas?', 'Que están conectadas (unión).'], ['¿Qué significa GND?', 'Tierra o común: la referencia de 0 V.'], ['¿Qué diferencia hay entre diagrama pictórico y esquemático?', 'El pictórico dibuja cómo se ve; el esquemático usa símbolos para mostrar la función.'], ['En el símbolo de la pila, ¿qué línea es el positivo?', 'La línea larga.']],
      errores: ['Conectar dos cables que en el diagrama solo se cruzan.', 'Poner el LED o el electrolítico al revés.', 'Ignorar la referencia y confundir R1 con R2.'],
      vida: 'Los manuales de servicio de máquinas traen diagramas: quien los lee repara sin adivinar.',
      ideas: ['m1-memorama-simbolos', 'pr-error-del-dia'], fuente: FU + ' (p. 15); NMX-J-136-ANCE-2019.'
    },
    {
      id: 'm1-colores', sm: 'I-1', ac: 'Interpreta planos y diagramas electrónicos', titulo: 'Código de colores y valores comerciales', dur: '50 min',
      objetivo: 'Que lean el valor y la tolerancia de un resistor por sus bandas y reconozcan valores comerciales.',
      explica: [
        'Los resistores pequeños traen su valor en bandas de colores. En los de 4 bandas: 1ª y 2ª banda = dígitos, 3ª = multiplicador (cuántos ceros), 4ª = tolerancia (dorado ±5 %, plateado ±10 %). La banda dorada o plateada va a la derecha al leer.',
        'Colores: negro 0, café 1, rojo 2, naranja 3, amarillo 4, verde 5, azul 6, violeta 7, gris 8, blanco 9. Multiplicador dorado = ×0.1. En los de 5 bandas (precisión) hay tres dígitos antes del multiplicador.',
        'No existen todos los valores: se fabrican series comerciales. La más común es la E12: 10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68 y 82, multiplicados por 1, 10, 100, 1000… Por eso compras 220 Ω o 4.7 kΩ, pero no 300 Ω. Los capacitores cerámicos usan otro código: 104 = 10 seguido de 4 ceros en picofaradios = 100 nF.'
      ],
      pantalla: ['Negro 0 · Café 1 · Rojo 2 · Naranja 3 · Amarillo 4', 'Verde 5 · Azul 6 · Violeta 7 · Gris 8 · Blanco 9', '4 bandas: dígito, dígito, multiplicador, tolerancia', 'Dorado ±5 % · Plateado ±10 %', 'Serie E12: 10 12 15 18 22 27 33 39 47 56 68 82', 'Capacitor 104 = 100 nF'],
      clave: [['Rojo-rojo-café-dorado', '22 × 10 = 220 Ω ±5 %'], ['Café-negro-rojo-dorado', '10 × 100 = 1 kΩ ±5 %'], ['Amarillo-violeta-rojo', '47 × 100 = 4.7 kΩ'], ['Café-negro-naranja', '10 × 1000 = 10 kΩ'], ['Tolerancia ±5 %', 'El valor real puede variar 5 % arriba o abajo'], ['Código 103', '10 nF (capacitor cerámico)']],
      ejemplo: { titulo: 'Lee y comprueba', pasos: ['Bandas: naranja (3), naranja (3), café (×10), dorado.', 'Valor: 33 × 10 = 330 Ω ±5 %.', 'Rango aceptable: 313.5 Ω a 346.5 Ω.', 'El multímetro marca 327 Ω: está dentro de tolerancia.'], resultado: 'Si el resistor marca fuera del rango, está dañado o lo leíste al revés.' },
      preguntas: [['¿Qué valor tiene café-negro-rojo-dorado?', '1000 Ω (1 kΩ) ±5 %.'], ['¿Qué indica la banda dorada al final?', 'Tolerancia de ±5 %.'], ['¿Existe un resistor comercial de 300 Ω en la serie E12?', 'No; los más cercanos son 270 Ω y 330 Ω.'], ['¿Cuánto vale un capacitor marcado 104?', '100 nF (0.1 µF).']],
      errores: ['Leer el resistor empezando por la banda dorada.', 'Confundir café con rojo o naranja con rojo con poca luz.', 'Olvidar que el tercer color es multiplicador, no tercer dígito (en 4 bandas).'],
      vida: 'En reparación y mantenimiento se reemplaza un componente por otro de valor comercial: saber leer bandas y series te deja comprar la refacción correcta.',
      ideas: ['m1-reto-resistor', 'pr-quien-quiere'], fuente: FU + ' (p. 15); Boylestad y Nashelsky (2009); serie IEC 60063 (E12).'
    },
    {
      id: 'm1-serie-paralelo', sm: 'I-1', ac: 'Interpreta planos y diagramas electrónicos', titulo: 'Conexiones en serie, paralelo y mixtas', dur: '50 min',
      objetivo: 'Que reconozcan conexiones serie, paralelo y mixtas y calculen la resistencia equivalente.',
      explica: [
        'En serie los componentes van uno tras otro: la corriente es la misma en todos y los voltajes se reparten. La resistencia equivalente es la suma: Req = R1 + R2 + R3. Si un elemento se abre, todo se apaga (como las series navideñas antiguas).',
        'En paralelo todos comparten los mismos dos puntos: el voltaje es el mismo y las corrientes se reparten. 1/Req = 1/R1 + 1/R2…; para dos resistores, Req = R1·R2 / (R1 + R2). El equivalente siempre es menor que el más pequeño. Así se conectan los aparatos de una casa.',
        'Un circuito mixto combina ambos: se resuelve por partes, del grupo más interno al más externo. Con capacitores es al revés: en paralelo se suman y en serie se combinan como resistores en paralelo. Las bobinas se combinan como los resistores. Un circuito RC tiene resistor y capacitor; uno RLC, además, una bobina.'
      ],
      pantalla: ['Serie: misma corriente, voltajes se reparten · Req = R1 + R2', 'Paralelo: mismo voltaje, corrientes se reparten', 'Dos en paralelo: Req = R1·R2 / (R1 + R2)', 'Mixto: resuelve por partes, de adentro hacia afuera', 'Capacitores: al revés que los resistores'],
      clave: [['Serie', 'Un solo camino para la corriente'], ['Paralelo', 'Varios caminos entre los mismos dos puntos'], ['Resistencia equivalente', 'Una sola resistencia que hace lo mismo que el grupo'], ['Mixto', 'Combinación de serie y paralelo'], ['RC', 'Circuito con resistor y capacitor'], ['RLC', 'Circuito con resistor, bobina y capacitor']],
      ejemplo: { titulo: 'Circuito mixto', pasos: ['R2 = 1 kΩ y R3 = 1 kΩ en paralelo: 1000 × 1000 / 2000 = 500 Ω.', 'Ese grupo está en serie con R1 = 470 Ω.', 'Req = 470 + 500 = 970 Ω.', 'Con 9.7 V: I = 9.7 / 970 = 0.01 A = 10 mA.'], resultado: 'Por partes nunca falla.' },
      preguntas: [['¿En qué conexión la corriente es la misma en todos los elementos?', 'En serie.'], ['Dos resistores de 2 kΩ en paralelo, ¿cuánto dan?', '1 kΩ.'], ['¿Por qué los aparatos de una casa van en paralelo?', 'Para que todos reciban el mismo voltaje y uno pueda apagarse sin apagar a los demás.'], ['Dos capacitores de 10 µF en paralelo, ¿cuánto dan?', '20 µF.']],
      errores: ['Sumar resistores en paralelo.', 'Creer que en paralelo el equivalente es mayor.', 'Resolver el mixto sin identificar primero qué está en serie y qué en paralelo.'],
      vida: 'Los tableros de una planta y los arneses de un auto son redes de serie y paralelo: entenderlas permite saber por qué falla "todo" o solo "una parte".',
      ideas: ['m1-falstad', 'pr-pausa-predice'], fuente: FU + ' (p. 14); Hayt, Kemmerly y Durbin (2012).'
    },
    {
      id: 'm1-ohm-watt', sm: 'I-1', ac: 'Verifica las variables eléctricas del circuito electrónico', titulo: 'Ley de Ohm y ley de Watt', dur: '50 min',
      objetivo: 'Que calculen voltaje, corriente, resistencia y potencia en un circuito simple.',
      explica: [
        'La ley de Ohm dice que la corriente es proporcional al voltaje e inversa a la resistencia: V = I · R. De ahí salen I = V / R y R = V / I. El triángulo V arriba, I y R abajo ayuda a recordarla.',
        'La ley de Watt calcula la potencia: P = V · I. Combinándola con la de Ohm: P = I² · R = V² / R. La potencia dice cuánto se calienta un resistor: uno común de 1/4 W se quema si disipa más de 0.25 W.',
        'Aplicación clásica: el resistor limitador de un LED. R = (Vfuente − VLED) / ILED. Con 9 V, un LED rojo (2 V) a 20 mA: R = 7 / 0.02 = 350 Ω; se elige el comercial mayor más cercano, 390 Ω, para no pasarse de corriente.'
      ],
      pantalla: ['V = I · R · I = V / R · R = V / I', 'P = V · I = I² · R = V² / R', 'Siempre en unidades base: V, A, Ω, W', 'LED: R = (Vfuente − VLED) / ILED', 'Elige el valor comercial mayor más cercano'],
      clave: [['Ley de Ohm', 'V = I · R'], ['Ley de Watt', 'P = V · I'], ['Resistor de 1/4 W', 'Aguanta hasta 0.25 W'], ['Resistor limitador', 'Protege al LED de exceso de corriente'], ['VLED', 'Caída de voltaje del LED (rojo ≈ 2 V, azul o blanco ≈ 3 V)']],
      ejemplo: { titulo: 'LED en una fuente de 5 V', pasos: ['LED rojo: 2 V y 15 mA.', 'R = (5 − 2) / 0.015 = 200 Ω → comercial: 220 Ω.', 'Corriente real: I = 3 / 220 ≈ 13.6 mA.', 'Potencia en R: P = 3 × 0.0136 ≈ 0.041 W: un resistor de 1/4 W sobra.'], resultado: 'Calcula, redondea al comercial y revisa la potencia.' },
      preguntas: [['¿Qué corriente pasa por 1 kΩ con 5 V?', '5 mA.'], ['Un resistor de 100 Ω lleva 0.1 A. ¿Cuánto voltaje cae en él?', '10 V.'], ['¿Qué potencia disipa ese resistor?', 'P = 10 × 0.1 = 1 W: uno de 1/4 W se quemaría.'], ['¿Por qué se elige el resistor comercial mayor para el LED?', 'Para que la corriente quede igual o menor a la recomendada.']],
      errores: ['Usar mA sin convertir a A.', 'Olvidar restar el voltaje del LED.', 'No revisar la potencia del resistor.'],
      vida: 'Elegir protecciones, cables y resistencias en una máquina empieza con la ley de Ohm: es la cuenta más usada por un técnico.',
      ideas: ['m1-led-calculado', 'pr-explica-60'], fuente: FU + ' (p. 15); Hayt, Kemmerly y Durbin (2012).'
    },
    {
      id: 'm1-kirchhoff', sm: 'I-1', ac: 'Verifica las variables eléctricas del circuito electrónico', titulo: 'Leyes de Kirchhoff y divisor de voltaje', dur: '50 min',
      objetivo: 'Que comprueben que las corrientes en un nodo y los voltajes en una malla cuadran.',
      explica: [
        'Ley de corrientes (LCK): en un nodo (punto donde se unen cables), la corriente que entra es igual a la que sale. Si a un nodo llegan 30 mA y salen 10 mA por una rama, por la otra salen 20 mA.',
        'Ley de voltajes (LVK): en cualquier malla (camino cerrado), lo que sube la fuente es igual a la suma de lo que cae en los elementos. Con una pila de 9 V y tres resistores en serie, sus tres voltajes suman 9 V.',
        'El divisor de voltaje es la aplicación más usada: dos resistores en serie reparten el voltaje en proporción a su valor. Vsal = Ven · R2 / (R1 + R2). Así se leen sensores y se ajustan niveles.'
      ],
      pantalla: ['LCK: lo que entra a un nodo = lo que sale', 'LVK: en una malla, la fuente = suma de caídas', 'Divisor: Vsal = Ven · R2 / (R1 + R2)', 'Mide para comprobar: los números deben cuadrar'],
      clave: [['Nodo', 'Punto donde se unen dos o más conductores'], ['Malla', 'Camino cerrado de un circuito'], ['Caída de voltaje', 'Voltaje que se "queda" en un elemento'], ['Divisor de voltaje', 'Dos resistores en serie que entregan una fracción del voltaje']],
      ejemplo: { titulo: 'Divisor de 12 V a 4 V', pasos: ['R1 = 2 kΩ y R2 = 1 kΩ en serie con 12 V.', 'I = 12 / 3000 = 4 mA.', 'V en R2 = 4 mA × 1 kΩ = 4 V; en R1 = 8 V.', 'LVK: 8 + 4 = 12 V ✔.'], resultado: 'Vsal = 12 × 1 / 3 = 4 V, igual por las dos rutas.' },
      preguntas: [['A un nodo entran 50 mA; por una rama salen 20 mA. ¿Cuánto sale por la otra?', '30 mA.'], ['Una malla con fuente de 9 V tiene caídas de 3 V y 4 V. ¿Cuánto cae en el tercer resistor?', '2 V.'], ['Divisor con R1 = R2 y 10 V de entrada, ¿cuánto sale?', '5 V.'], ['¿Para qué sirve un divisor de voltaje?', 'Para obtener una fracción del voltaje, por ejemplo para leer un sensor.']],
      errores: ['Olvidar el signo: en LVK la fuente "sube" y los elementos "bajan".', 'Usar el divisor con una carga que consume mucha corriente (cambia el resultado).', 'Medir corriente en paralelo.'],
      vida: 'Diagnosticar un tablero es aplicar Kirchhoff: si en un punto no llega el voltaje esperado, la falla está antes.',
      ideas: ['m1-falstad', 'pr-pausa-predice'], fuente: FU + ' (p. 15); Hayt, Kemmerly y Durbin (2012).'
    },
    {
      id: 'm1-multimetro', sm: 'I-1', ac: 'Verifica las variables eléctricas del circuito electrónico', titulo: 'El multímetro: medir sin dañar', dur: '50 min',
      objetivo: 'Que midan voltaje, corriente, resistencia y continuidad con la conexión y escala correctas.',
      explica: [
        'El multímetro digital mide varias magnitudes. Puntas: la negra siempre en COM; la roja en V/Ω para voltaje, resistencia y continuidad, y en mA o A solo para corriente. Muchos multímetros se dañan por medir voltaje con la punta roja en A: el fusible interno se funde.',
        'El voltaje se mide en paralelo (las puntas a los dos lados del elemento) con el circuito encendido. La corriente se mide en serie: hay que abrir el circuito y hacer que la corriente pase por el multímetro. La resistencia se mide con el circuito apagado y, de preferencia, con el componente fuera de la placa.',
        'Elige la escala mayor a lo que esperas (si no es automático) y baja hasta leer bien. La continuidad (el pitido) sirve para buscar cables rotos y cortos. Anota siempre la unidad que aparece en la pantalla (mV, V, kΩ, MΩ).'
      ],
      pantalla: ['Punta negra: COM, siempre', 'Voltaje: en paralelo, circuito encendido', 'Corriente: en serie, abriendo el circuito, roja en mA/A', 'Resistencia: circuito apagado', 'Continuidad (pitido): cables y cortos', 'Lee la unidad de la pantalla'],
      clave: [['V⎓ (VDC)', 'Voltaje de corriente directa'], ['V~ (VAC)', 'Voltaje de corriente alterna'], ['COM', 'Terminal común (punta negra)'], ['Escala', 'Rango máximo que puede medir en esa posición'], ['Continuidad', 'Pitido si hay unión eléctrica'], ['Fusible interno', 'Protege la entrada de corriente']],
      ejemplo: { titulo: 'Medir la corriente de un LED', pasos: ['Apaga el circuito.', 'Desconecta el cable entre el resistor y el LED.', 'Punta roja en mA y selector en mA⎓.', 'Pon el multímetro en ese hueco (en serie) y enciende: lee, por ejemplo, 14.8 mA.'], resultado: 'Al terminar, regresa la punta roja a V/Ω para no fundir el fusible después.' },
      preguntas: [['¿Cómo se conecta el multímetro para medir voltaje?', 'En paralelo con el elemento, con el circuito encendido.'], ['¿Por qué no se mide resistencia con el circuito encendido?', 'Porque el voltaje del circuito altera la lectura y puede dañar el multímetro.'], ['¿Qué pasa si mides voltaje con la punta roja en A?', 'Haces un corto a través del multímetro y se funde su fusible.'], ['¿Para qué sirve la prueba de continuidad?', 'Para saber si dos puntos están unidos (cables rotos o cortos).']],
      errores: ['Medir corriente en paralelo.', 'Dejar la punta roja en A al terminar.', 'Medir resistencia con el componente en la placa y energizado.', 'Leer 1.000 creyendo que son 1000 cuando la pantalla dice kΩ.'],
      vida: 'El multímetro es la herramienta número uno de un técnico de mantenimiento: lo usa todos los días para encontrar fallas.',
      ideas: ['m1-multimetro-carrera'], fuente: FU + ' (p. 16); manuales de multímetros digitales.'
    },
    {
      id: 'm1-datasheet', sm: 'I-1', ac: 'Verifica las variables eléctricas del circuito electrónico', titulo: 'Hojas de datos (datasheet)', dur: '50 min',
      objetivo: 'Que encuentren en una hoja de datos los valores máximos, las terminales y las características de un componente.',
      explica: [
        'El fabricante publica una hoja de datos (datasheet) para cada componente, casi siempre en inglés. Se busca por el número impreso en la pieza: 1N4007, 2N2222, LM7805, NE555.',
        'Partes clave: descripción (qué es y para qué sirve), "Absolute Maximum Ratings" (lo que NO se debe rebasar: voltaje, corriente, temperatura), "Electrical Characteristics" (valores típicos de trabajo), diagrama de terminales ("Pin configuration" o "Pinout") y dimensiones del encapsulado (TO-92, TO-220, DIP-8).',
        'Ejemplos: el diodo 1N4007 soporta 1 A y hasta 1000 V en inversa; el transistor 2N2222 maneja cientos de miliamperes (revisa la hoja de tu fabricante); el regulador 7805 entrega 5 V hasta 1 A con disipador y necesita al menos unos 2 V más en la entrada. Comparar lo medido contra la hoja de datos es como se verifica un circuito.'
      ],
      pantalla: ['Se busca por el número impreso en la pieza', 'Absolute Maximum Ratings: lo que NO se rebasa', 'Electrical Characteristics: valores típicos', 'Pinout: qué terminal es cuál', 'Package: TO-92, TO-220, DIP-8…'],
      clave: [['Datasheet', 'Hoja de datos del fabricante'], ['Maximum ratings', 'Valores máximos absolutos'], ['Typical', 'Valor típico de funcionamiento'], ['Pinout', 'Distribución de terminales'], ['Package', 'Encapsulado (forma física)'], ['Forward voltage (VF)', 'Caída de voltaje del diodo o LED en directa']],
      ejemplo: { titulo: 'El regulador 7805', pasos: ['Busca «7805 datasheet».', 'Pinout (TO-220, viéndolo de frente): 1 entrada, 2 tierra, 3 salida.', 'Salida: 5 V; corriente: hasta 1 A con disipador.', 'Entrada mínima ≈ 7 V (necesita unos 2 V más que la salida).'], resultado: 'Con esos datos sabes cómo conectarlo y qué fuente necesita.' },
      preguntas: [['¿Qué sección dice lo que no debes rebasar?', 'Absolute Maximum Ratings (valores máximos absolutos).'], ['¿Qué es el pinout?', 'El diagrama que indica qué es cada terminal.'], ['¿Cómo encuentras la hoja de datos de un componente?', 'Buscando el número impreso en él más la palabra datasheet.'], ['¿Qué significa VF en la hoja de un LED?', 'El voltaje que cae en el LED cuando conduce.']],
      errores: ['Usar la hoja de otro componente parecido.', 'Confundir valores máximos con valores de trabajo.', 'Suponer el orden de terminales sin revisar el pinout (cambia entre fabricantes).'],
      vida: 'En planta, antes de cambiar una pieza se revisa su hoja de datos para elegir un reemplazo equivalente: es inglés técnico que vas a usar siempre.',
      ideas: ['m1-ficha-tecnica'], fuente: FU + ' (p. 16); hojas de datos 1N4007, 2N2222 y LM7805 de sus fabricantes; datasheetcatalog.com.'
    },
    {
      id: 'm1-rc', sm: 'I-1', ac: 'Interpreta planos y diagramas electrónicos', titulo: 'Capacitores y circuitos RC y RLC', dur: '50 min',
      objetivo: 'Que expliquen cómo se carga un capacitor a través de un resistor y calculen la constante de tiempo.',
      explica: [
        'Un capacitor guarda carga eléctrica. Si se carga a través de un resistor, su voltaje no sube de golpe: crece rápido al principio y cada vez más lento. La constante de tiempo es τ = R · C (en segundos con Ω y F).',
        'En 1 τ el capacitor llega a cerca del 63 % del voltaje de la fuente; en 5 τ ya se considera cargado (99 %). Al descargarse pasa lo mismo, al revés. Con 100 kΩ y 470 µF: τ = 100 000 × 0.00047 = 47 s, tan lento que se puede medir con multímetro y cronómetro.',
        'Los circuitos RC sirven para temporizar (retardos, el 555), filtrar ruido y alisar voltajes. Si se agrega una bobina se forma un RLC: aparece en filtros y en la sintonía de radios. Los electrolíticos tienen polaridad: al revés se dañan y pueden explotar.'
      ],
      pantalla: ['τ = R · C (Ω × F = segundos)', '1 τ ≈ 63 % · 5 τ ≈ cargado (99 %)', 'Usos: temporizar, filtrar, alisar', 'RLC: resistor + bobina + capacitor (filtros, radio)', 'Electrolítico: respeta la polaridad'],
      clave: [['Capacitancia', 'Capacidad de guardar carga · faradios (F)'], ['Constante de tiempo (τ)', 'R · C'], ['Carga', 'El voltaje del capacitor sube hacia el de la fuente'], ['Descarga', 'El voltaje baja hacia cero'], ['Electrolítico', 'Capacitor grande con polaridad (+ y −)']],
      ejemplo: { titulo: 'Un retardo para apagar una luz', pasos: ['R = 47 kΩ y C = 1000 µF.', 'τ = 47 000 × 0.001 = 47 s.', 'Cargado (5 τ): unos 235 s, casi 4 minutos.', 'Si quieres la mitad del tiempo, usa la mitad de R o de C.'], resultado: 'Con R y C eliges el tiempo.' },
      preguntas: [['¿Qué es la constante de tiempo de un RC?', 'τ = R · C: el tiempo en que se carga al 63 %.'], ['Con R = 10 kΩ y C = 100 µF, ¿cuánto vale τ?', '1 segundo.'], ['¿Cuántas constantes de tiempo tarda en cargarse por completo?', 'Unas 5.'], ['¿Qué pasa si conectas un electrolítico al revés?', 'Se daña, se calienta y puede reventar.']],
      errores: ['Usar µF sin convertir a F.', 'Pensar que el capacitor se carga en línea recta.', 'Conectar un electrolítico con la polaridad invertida.'],
      vida: 'Los temporizadores de las luces de escalera, los filtros de las fuentes y el arranque suave de muchos aparatos son circuitos RC.',
      ideas: ['m1-rc-cronometro', 'm1-falstad'], fuente: FU + ' (p. 14, conexiones RC y RLC); Boylestad y Nashelsky (2009).'
    }
  ];

  /* =================== CLASES (1 h de horario = 50 min) =================== */
  const clases = [
    { id: 'm1-encuadre', h: 3, m: 'a', tipo: 'Encuadre', t: 'Encuadre del módulo y examen diagnóstico', obj: 'Que conozcan el módulo, cómo se les evalúa, las reglas del taller y muestren qué saben de electricidad.', ac: null,
      pasos: [[15, 'Preséntate y cuenta qué hace un técnico en mecatrónica con la electrónica (mantenimiento, automatización, reparación).'], [20, 'Encuadre: resultados del módulo, los 3 submódulos, criterios de evaluación y proyecto del parcial: el expediente técnico de un aparato.'], [15, 'Reglamento del taller y roles de equipo.'], [60, 'Examen diagnóstico: magnitudes, ley de Ohm, componentes y seguridad (no cuenta para calificación).'], [25, 'Dinámica: ¿qué aparato electrónico usas más y qué crees que tiene adentro? Mapa de expectativas en papel.'], [15, 'Equipos de 4 o 5 y lista de material.']],
      ev: 'Examen diagnóstico contestado (Desempeño)', tarea: 'Conseguir un aparato electrónico descompuesto para desarmar (control remoto, cargador, radio, juguete). No microondas, televisiones de tubo ni fuentes de alto voltaje.', ideas: ['primer-dia', 'roles-equipo'], pre: 'voltaje · corriente · componente' },
    { id: 'm1-seguridad-c', h: 1, m: 'a', tipo: 'Taller', t: 'Seguridad en el taller de electrónica', obj: 'Trabajar con electricidad, cautín y aparatos desarmados sin riesgos.', ac: 0, dc: 0, tema: 'm1-seguridad',
      pasos: [[5, 'Pregunta-reto: ¿qué es más peligroso, 9 V o 127 V, y por qué?'], [25, 'Tema en proyector.'], [15, 'En la libreta: reglamento del taller con su firma.'], [5, 'Boleto de salida.']],
      ev: 'Reglamento del taller firmado en la libreta (Desempeño)', ideas: ['pregunta-reto', 'boleto-salida'], pre: 'EPP · descarga electrostática · cautín' },
    { id: 'm1-magnitudes-c', h: 2, m: 'a', tipo: 'Teoría', t: 'Voltaje, corriente y resistencia: la analogía del agua', obj: 'Distinguir las magnitudes eléctricas y convertir prefijos.', ac: 1, dc: 0, tema: 'm1-magnitudes',
      pasos: [[10, 'Demostración: dos botellas con manguera delgada y gruesa: ¿cuál se vacía más rápido?'], [35, 'Tema en proyector con la analogía del agua.'], [35, 'Ejercicios de prefijos en parejas: kΩ a Ω, mA a A, µF a F.'], [15, 'Votación con tarjetas para revisar.'], [5, 'Boleto de salida.']],
      tarea: 'Busca en tu casa 3 placas de datos (cargador, licuadora, foco) y anota en la libreta su voltaje, corriente o potencia.', ideas: ['m1-agua', 'pr-plickers'], pre: 'volt · ampere · ohm · watt' },
    { id: 'm1-adentro', h: 2, m: 'a', noComputo: true, tipo: 'Práctica', t: '¿Qué hay dentro de un aparato? (demostración)', obj: 'Ver cómo se desarma con seguridad un aparato y cómo se ven sus componentes.', ac: 0, dc: 0, tema: 'm1-componentes',
      pasos: [[10, 'Revisa las placas de datos de la tarea: ¿quién encontró el que más potencia gasta?'], [40, 'Práctica demostrativa: desarmas un aparato en el proyector (celular como cámara): tornillos ocultos, broches, placa y componentes.'], [30, 'Señalas cada componente y su letra en la placa (R, C, D, Q, U).'], [15, 'Preguntas y tabla inicial en la libreta.'], [5, 'Boleto de salida.']],
      mat: 'Un aparato descompuesto, desarmadores de cruz y plano, celular como cámara de documentos.', ideas: ['pr-camara-doc', 'm1-desarmado'], pre: 'placa · serigrafía · componente' },
    { id: 'm1-componentes-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Componentes electrónicos y su función', obj: 'Reconocer los componentes más comunes y su función.', ac: 0, dc: 0, tema: 'm1-componentes',
      pasos: [[40, 'Tema en proyector con piezas reales pasando de mano en mano.'], [40, 'En la libreta: tabla de 10 componentes (nombre, función, letra, cómo se ve).'], [15, 'Explícalo en 60 segundos: 4 alumnos al azar.'], [5, 'Boleto de salida.']],
      ideas: ['pr-explica-60'], pre: 'pasivo · activo · circuito integrado' },
    { id: 'm1-desarmado', h: 3, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Práctica', t: 'Desarma y clasifica (práctica guiada)', obj: 'Identificar los componentes físicos de un aparato y su función, con herramienta y seguridad.', ac: 0, dc: 0, tema: 'm1-componentes',
      pasos: [[15, 'Seguridad: aparato desconectado, sin pilas, lentes puestos.'], [70, 'Equipos: desarman su aparato y localizan la placa principal.'], [45, 'Llenan la tabla de clasificación: nombre, referencia en la placa, función y símbolo.'], [20, 'Plenaria: cada equipo muestra su componente más raro.']],
      mat: 'Aparatos descompuestos, desarmadores, pinzas de punta, lentes de seguridad, bolsas para tornillos.', ev: 'Tabla de clasificación de componentes (Producto)',
      guia: { pasos: [['Seguridad', 'Desconecta el aparato, quítale pilas o batería y espera 5 minutos.'], ['Abrir', 'Busca tornillos ocultos (bajo etiquetas o gomas) y broches; guarda los tornillos en una bolsa.'], ['Fotografía', 'Toma foto de la placa antes de mover nada.'], ['Identifica', 'Localiza al menos 10 componentes por su letra (R, C, L, D, Q, U, T, F).'], ['Registra', 'Anota en la tabla nombre, referencia, función y dibuja su símbolo.']], tabla: { cab: ['Referencia', 'Componente', 'Función', 'Símbolo', 'Valor o número'], filas: 10 }, revisa: ['Al menos 10 componentes distintos', 'Cada uno con función y símbolo', 'Tornillos y piezas guardados'], seguridad: 'Nada de microondas, televisiones de tubo ni fuentes de alto voltaje. Baterías de litio infladas: no se perforan, se entregan al docente.', entrega: 'La tabla y la foto de la placa con los componentes señalados.' },
      ideas: ['m1-desarmado', 'roles-equipo'], pre: 'referencia · resistor · capacitor · diodo' },
    { id: 'm1-desoldar', h: 2, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Práctica', t: 'Desoldar y recuperar componentes', obj: 'Extraer componentes de una placa con cautín y malla o extractor sin dañarlos.', ac: 0, dc: 0, tema: 'm1-seguridad', dep: ['m1-desarmado'],
      pasos: [[20, 'Práctica demostrativa: cómo calentar, aplicar malla o extractor y retirar la pieza.'], [55, 'Práctica supervisada en parejas: recuperan 5 componentes (resistores, capacitores, LED).'], [15, 'Clasifican lo recuperado en una caja con divisiones para usarlo en el semestre.'], [10, 'Limpieza y cuidado del cautín.']],
      mat: 'Cautín de 30 a 40 W con soporte, malla desoldadora o extractor, esponja húmeda, lentes, placas recuperadas.', ev: 'Componentes recuperados sin daño (Desempeño)',
      guia: { pasos: [['Cautín', 'Enciéndelo en su soporte y limpia la punta en la esponja húmeda.'], ['Calienta', 'Apoya la punta en la soldadura de una terminal 2 a 3 segundos.'], ['Retira', 'Coloca la malla sobre la soldadura y presiona con el cautín: la malla absorbe el estaño. O usa el extractor: aprieta el émbolo, acerca la punta y suelta.'], ['Extrae', 'Repite en la otra terminal y saca la pieza con pinzas, sin forzar.'], ['Guarda', 'Clasifica los componentes recuperados.']], revisa: ['Pistas de la placa sin levantar', 'Componentes con sus terminales completas', 'Cautín en su soporte y apagado al terminar'], seguridad: 'Lentes puestos, cabello recogido, cautín siempre en su soporte, ventila el humo y lávate las manos al terminar.', entrega: '5 componentes recuperados y clasificados.' },
      ideas: ['m1-ewaste-seguro'], pre: 'malla desoldadora · extractor · estaño' },
    { id: 'm1-simbologia-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Simbología y lectura de diagramas', obj: 'Relacionar componentes con sus símbolos y leer un esquemático.', ac: 0, dc: 2, tema: 'm1-simbologia',
      pasos: [[35, 'Tema en proyector.'], [30, 'Memorama de símbolos por equipos.'], [25, 'Ejercicio: dibujan el esquemático de un diagrama pictórico (linterna con interruptor).'], [10, 'Boleto de salida.']],
      ideas: ['m1-memorama-simbolos', 'boleto-salida'], pre: 'esquemático · GND · referencia' },
    { id: 'm1-colores-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Código de colores y valores comerciales', obj: 'Leer el valor y la tolerancia de resistores reales.', ac: 0, dc: 2, tema: 'm1-colores',
      pasos: [[35, 'Tema en proyector.'], [40, 'Reto en parejas: 10 resistores reales; anotan valor y rango de tolerancia.'], [20, '¿Quién quiere ser técnico? con valores de resistores.'], [5, 'Boleto de salida.']],
      mat: 'Bolsas con 10 resistores surtidos por pareja.', tarea: 'En la libreta: 5 ejercicios de código de colores (valor y rango de tolerancia) y 3 de capacitores (102, 103, 104).', ideas: ['m1-reto-resistor', 'pr-quien-quiere'], pre: 'banda · multiplicador · tolerancia' },
    { id: 'm1-tinkercad-c', h: 2, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Tinkercad Circuits: tu primer circuito simulado', obj: 'Armar y medir un circuito simple en el simulador antes de tocar componentes reales.', ac: 1, dc: 0, tema: 'm1-magnitudes',
      pasos: [[15, 'Entran con el código de clase que les das (no necesitan correo).'], [20, 'Yo armo, tú armas: pila de 9 V, interruptor, resistor de 470 Ω y LED.'], [35, 'Miden con el multímetro virtual el voltaje en el LED y en el resistor, y la corriente.'], [20, 'Cambian el resistor por 220 Ω y 1 kΩ: ¿qué pasa con la corriente y el brillo?'], [10, 'Captura y entrega.']],
      ev: 'Captura del circuito simulado con sus mediciones (Producto)',
      guia: { sw: 'Tinkercad Circuits', link: 'https://www.tinkercad.com/circuits', pasos: [['Entrar', 'tinkercad.com → «Unirse a la clase» con el código del docente.'], ['Crear', 'Circuitos → Crear nuevo circuito.'], ['Componentes', 'Arrastra una batería de 9 V, un interruptor deslizante, un resistor y un LED rojo.'], ['Valor', 'Haz clic en el resistor y cambia su resistencia a 470 Ω.'], ['Conectar', 'Une con cables: + de la pila → interruptor → resistor → ánodo del LED (pata doblada) → cátodo → − de la pila.'], ['Simular', 'Iniciar simulación y enciende el interruptor.'], ['Medir', 'Agrega un multímetro: en modo voltaje, en paralelo al LED y al resistor; en modo corriente, en serie.']], tabla: { cab: ['R (Ω)', 'V en R (V)', 'V en LED (V)', 'I (mA)'], filas: [['470', '', '', ''], ['220', '', '', ''], ['1000', '', '', '']] }, revisa: ['La corriente baja cuando sube R', 'V en R + V en LED ≈ 9 V'], entrega: 'Captura de pantalla con el multímetro y la tabla llena.' },
      ideas: ['m1-tinkercad-clase'], pre: 'simulador · multímetro virtual · ánodo' },
    { id: 'm1-serie-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Conexiones en serie, paralelo y mixtas', obj: 'Reconocer conexiones y calcular la resistencia equivalente.', ac: 0, dc: 1, tema: 'm1-serie-paralelo',
      pasos: [[10, 'Pausa y predice: dos focos en serie y dos en paralelo, ¿cuáles brillan más? (Falstad en proyector).'], [35, 'Tema en proyector.'], [45, 'Ejercicios de Req en parejas, de menor a mayor dificultad.'], [10, 'Boleto de salida.']],
      tarea: 'En la libreta: 4 ejercicios de resistencia equivalente (2 en serie, 1 en paralelo y 1 mixto).', ideas: ['m1-falstad', 'pr-pausa-predice'], pre: 'serie · paralelo · equivalente' },
    { id: 'm1-ohm-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Ley de Ohm y ley de Watt', obj: 'Calcular V, I, R y P y el resistor limitador de un LED.', ac: 1, dc: 0, tema: 'm1-ohm-watt',
      pasos: [[10, 'Revisa la tarea de Req con el error del día.'], [35, 'Tema en proyector.'], [40, 'Ejercicios: corriente, voltaje, potencia y resistor de LED con valor comercial.'], [15, 'Votación con tarjetas.']],
      tarea: 'Calcula el resistor para un LED rojo y uno azul con 5 V y con 9 V (20 mA) y elige el valor comercial.', ideas: ['m1-led-calculado', 'pr-error-del-dia'], pre: 'V = I · R · P = V · I' },
    { id: 'm1-multimetro-c', h: 3, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Práctica', t: 'Uso del multímetro: resistencia, voltaje y continuidad', obj: 'Medir con la conexión y escala correctas y calcular el error contra el valor nominal.', ac: 1, dc: 2, tema: 'm1-multimetro',
      pasos: [[30, 'Tema en proyector y demostración con el celular como cámara.'], [50, 'Práctica guiada: miden 6 resistores y calculan el % de error contra el código de colores.'], [40, 'Miden pilas y la fuente a distintos voltajes; prueban continuidad de cables.'], [30, 'Comparan resultados y explican las diferencias.']],
      mat: 'Multímetro por pareja, resistores surtidos, pilas, fuente de CD, cables caimán.', ev: 'Tabla de mediciones con % de error (Producto)',
      guia: { pasos: [['Puntas', 'Negra en COM y roja en V/Ω.'], ['Resistencia', 'Selector en Ω; mide cada resistor fuera del circuito, sin tocar las dos puntas con los dedos.'], ['Error', '% error = (medido − nominal) / nominal × 100.'], ['Voltaje', 'Selector en V⎓; mide pilas y la fuente en paralelo.'], ['Continuidad', 'Selector en continuidad (pitido); prueba cables buenos y uno cortado.']], tabla: { cab: ['Colores', 'Nominal (Ω)', 'Tolerancia', 'Medido (Ω)', '% error', '¿Dentro?'], filas: 6 }, revisa: ['Unidad anotada en cada medición', '% error calculado', 'Punta roja en V/Ω al terminar'], entrega: 'La tabla llena y la conclusión: ¿qué resistores están dentro de tolerancia?' },
      ideas: ['m1-multimetro-carrera'], pre: 'COM · escala · continuidad' },
    { id: 'm1-protoboard', h: 2, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Práctica', t: 'La protoboard y el LED con resistor', obj: 'Armar circuitos en protoboard sin cortos y medir voltaje y corriente.', ac: 1, dc: 2, tema: 'm1-ohm-watt', dep: ['m1-multimetro-c'],
      pasos: [[15, 'Cómo están unidas las filas y los rieles de la protoboard (con continuidad).'], [45, 'Arman el LED con el resistor que calcularon de tarea y miden V en cada elemento y la corriente.'], [30, 'Comparan lo calculado con lo medido.'], [10, 'Orden y guardado.']],
      mat: 'Protoboard, LED, resistores, pila de 9 V con broche o fuente, multímetro.', ev: 'LED funcionando con mediciones en la libreta (Desempeño)', ideas: ['m1-led-calculado'], pre: 'protoboard · riel · fila' },
    { id: 'm1-sim-serie', h: 2, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Simula serie, paralelo y mixto', obj: 'Comprobar con el simulador los cálculos de serie, paralelo y mixto.', ac: 0, dc: 1, tema: 'm1-serie-paralelo', dep: ['m1-tinkercad-c'],
      pasos: [[10, 'Recuerda cómo medir en serie y en paralelo en Tinkercad.'], [70, 'Arman tres circuitos (serie, paralelo y mixto), calculan y comparan con lo simulado.'], [20, 'Comparten capturas y explican diferencias.']],
      ev: 'Tabla calculado contra simulado de 3 circuitos (Producto)',
      guia: { sw: 'Tinkercad Circuits o Falstad', link: 'https://www.falstad.com/circuit/', pasos: [['Serie', 'Fuente de 9 V con 330 Ω, 470 Ω y 1 kΩ en serie: mide la corriente y el voltaje en cada resistor.'], ['Paralelo', 'Los mismos tres resistores en paralelo: mide la corriente de cada rama y la total.'], ['Mixto', '470 Ω en serie con (1 kΩ ∥ 1 kΩ): calcula Req e I y compáralo.'], ['Kirchhoff', 'Comprueba: en serie los voltajes suman 9 V; en paralelo las corrientes suman la total.']], tabla: { cab: ['Circuito', 'Req calculada', 'I calculada', 'I simulada', '¿Coinciden?'], filas: [['Serie', '', '', '', ''], ['Paralelo', '', '', '', ''], ['Mixto', '', '', '', '']] }, revisa: ['Unidades en cada valor', 'Diferencias menores a 2 %'], entrega: 'Tres capturas y la tabla.' },
      ideas: ['m1-falstad'], pre: 'rama · nodo · equivalente' },
    { id: 'm1-kirchhoff-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Leyes de Kirchhoff y divisor de voltaje', obj: 'Aplicar LCK, LVK y el divisor de voltaje.', ac: 1, dc: 0, tema: 'm1-kirchhoff',
      pasos: [[35, 'Tema en proyector con Falstad.'], [45, 'Ejercicios: nodos, mallas y divisores (incluido el de un sensor).'], [20, 'Explícalo en 60 segundos.']],
      tarea: 'Diseña un divisor que entregue 3 V a partir de 9 V con resistores de la serie E12 y comprueba con LVK.', ideas: ['pr-explica-60'], pre: 'nodo · malla · caída de voltaje' },
    { id: 'm1-medir-kirchhoff', h: 3, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Práctica', t: 'Comprueba Ohm y Kirchhoff midiendo', obj: 'Medir voltajes y corrientes en circuitos serie y paralelo y comprobar las leyes.', ac: 1, dc: 2, tema: 'm1-kirchhoff', dep: ['m1-protoboard'],
      pasos: [[10, 'Repaso: cómo medir corriente sin fundir el fusible.'], [60, 'Práctica supervisada: arman serie y paralelo en protoboard, miden y llenan la tabla.'], [50, 'Arman el divisor de la tarea y miden la salida con y sin carga (un LED).'], [30, 'Plenaria: ¿por qué cambia el divisor con carga?']],
      mat: 'Protoboard, resistores de la tarea, fuente o pila de 9 V, multímetro.', ev: 'Reporte calculado contra medido (Producto · actividad clave)',
      guia: { pasos: [['Serie', '330 Ω + 470 Ω + 1 kΩ a 9 V: mide la corriente y el voltaje de cada resistor.'], ['LVK', 'Suma los tres voltajes: debe dar el de la fuente.'], ['Paralelo', 'Los tres en paralelo: mide la corriente total y la de cada rama.'], ['LCK', 'Suma las corrientes de las ramas: debe dar la total.'], ['Divisor', 'Arma tu divisor de 3 V y mide Vsal; luego conecta un LED con su resistor y vuelve a medir.']], tabla: { cab: ['Medición', 'Calculado', 'Medido', '% error'], filas: 8 }, revisa: ['LVK y LCK comprobadas con números', 'Explicación de las diferencias'], seguridad: 'Para medir corriente abre el circuito y pon el multímetro en serie; al terminar, regresa la punta a V/Ω.', entrega: 'Reporte con tabla, cálculos y conclusiones.' },
      ideas: ['bitacora-fallas'], pre: 'medido · calculado · % de error' },
    { id: 'm1-repaso-medio', h: 1, m: 'd', tipo: 'Evaluación', t: 'Repaso de medio parcial', obj: 'Detectar qué temas necesitan refuerzo antes de seguir.', ac: null,
      pasos: [[35, '¿Quién quiere ser técnico? con preguntas de los temas vistos.'], [15, 'Muro de dudas: cada quien escribe su duda y se resuelven las más repetidas.']], ideas: ['pr-quien-quiere'] },
    { id: 'm1-datasheet-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Cómo leer una hoja de datos', obj: 'Localizar valores máximos, características y terminales en una hoja de datos.', ac: 1, dc: 1, tema: 'm1-datasheet',
      pasos: [[35, 'Tema en proyector con la hoja real del 1N4007 y del 7805.'], [45, 'Por equipos: con hojas impresas o en el celular, encuentran 5 datos de un LED, un diodo y un transistor.'], [15, 'Plenaria y glosario de inglés técnico en la libreta.'], [5, 'Boleto de salida.']],
      tarea: 'Anota el número impreso de 3 componentes que recuperaste para buscar su hoja de datos.', ideas: ['m1-ficha-tecnica'], pre: 'datasheet · maximum ratings · pinout' },
    { id: 'm1-ficha', h: 2, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Fichas técnicas de tus componentes', obj: 'Interpretar la hoja de datos de los componentes recuperados.', ac: 1, dc: 1, tema: 'm1-datasheet', dep: ['m1-datasheet-c'],
      pasos: [[10, 'Dónde buscar: el sitio del fabricante o datasheetcatalog.com.'], [60, 'Buscan la hoja de datos de sus 3 componentes y llenan la ficha técnica.'], [20, 'Glosario: traducen 8 términos técnicos.'], [10, 'Entrega.']],
      ev: 'Fichas técnicas de 3 componentes (Producto)',
      guia: { sw: 'Navegador', link: 'https://www.datasheetcatalog.com/', pasos: [['Buscar', 'Escribe el número impreso del componente + «datasheet».'], ['Descripción', 'Anota qué es y para qué sirve.'], ['Máximos', 'Copia 3 valores de Absolute Maximum Ratings con sus unidades.'], ['Terminales', 'Dibuja el pinout.'], ['Encapsulado', 'Anota el tipo (TO-92, TO-220, DIP…).']], tabla: { cab: ['Componente', 'Qué es', 'Máximos', 'Pinout', 'Encapsulado'], filas: 3 }, revisa: ['Valores con unidad', 'Pinout dibujado'], entrega: 'Las 3 fichas en la libreta o en un documento.' },
      ideas: ['m1-ficha-tecnica'], pre: 'encapsulado · VF · IC máx.' },
    { id: 'm1-led-datasheet', h: 2, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Práctica', t: 'El LED según su hoja de datos', obj: 'Calcular el resistor de un LED con su hoja de datos y comprobar la corriente.', ac: 1, dc: 2, tema: 'm1-ohm-watt', dep: ['m1-ficha'],
      pasos: [[15, 'Datos del LED: VF e IF de la hoja.'], [50, 'Arman LED rojo, verde y azul con su resistor calculado; miden V e I de cada uno.'], [25, 'Comparan con la hoja: ¿el LED trabaja dentro de lo recomendado?'], [10, 'Conclusiones.']],
      mat: 'LED rojo, verde y azul; resistores; protoboard; fuente de 5 V o 9 V; multímetro.', ev: 'Tabla del LED: hoja de datos contra medido (Producto)', ideas: ['m1-led-calculado'], pre: 'VF · IF · limitador' },
    { id: 'm1-rc-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Capacitores y circuitos RC', obj: 'Explicar la carga de un capacitor y calcular τ = R · C.', ac: 0, dc: 1, tema: 'm1-rc',
      pasos: [[10, 'Pausa y predice en Falstad: ¿el voltaje del capacitor sube en línea recta?'], [35, 'Tema en proyector.'], [35, 'Ejercicios de τ y de conversión de µF.'], [20, 'Planean la práctica del cronómetro: qué medir y cada cuánto.']],
      ideas: ['m1-falstad', 'm1-rc-cronometro'], pre: 'constante de tiempo · carga · electrolítico' },
    { id: 'm1-rc-lab', h: 2, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Práctica', t: 'La carga del capacitor con cronómetro', obj: 'Medir la carga de un capacitor y compararla con τ calculada.', ac: 1, dc: 2, tema: 'm1-rc', dep: ['m1-rc-c'],
      pasos: [[10, 'Seguridad: polaridad del electrolítico.'], [50, 'Miden el voltaje del capacitor cada 10 s hasta 4 minutos.'], [30, 'Grafican en la libreta y marcan dónde llega al 63 %.'], [10, 'Conclusión: ¿coincide con τ = R · C?']],
      mat: 'Capacitor de 470 µF, resistor de 100 kΩ, pila de 9 V, protoboard, multímetro, cronómetro del celular.', ev: 'Gráfica de carga del capacitor (Producto)',
      guia: { pasos: [['Arma', '9 V → resistor de 100 kΩ → capacitor de 470 µF (+ hacia el resistor) → −.'], ['Descarga', 'Antes de empezar, une las terminales del capacitor con un cable para descargarlo; retíralo.'], ['Mide', 'Multímetro en V⎓ en paralelo al capacitor. Conecta la pila y arranca el cronómetro.'], ['Registra', 'Anota el voltaje cada 10 s hasta 240 s.'], ['Grafica', 'Tiempo en el eje horizontal, voltaje en el vertical; marca el 63 % de 9 V (≈ 5.7 V).']], tabla: { cab: ['t (s)', 'V (V)', 't (s)', 'V (V)'], filas: [['0', '', '130', ''], ['10', '', '140', ''], ['20', '', '150', ''], ['30', '', '160', ''], ['40', '', '170', ''], ['50', '', '180', ''], ['60', '', '190', ''], ['70', '', '200', ''], ['80', '', '210', ''], ['90', '', '220', ''], ['100', '', '230', ''], ['120', '', '240', '']] }, revisa: ['τ calculada: 100 000 × 0.00047 = 47 s', '¿En qué tiempo llegó a ≈ 5.7 V?'], seguridad: 'El electrolítico va con su + al lado positivo; al revés se calienta y puede reventar.', entrega: 'Tabla, gráfica y comparación con τ.' },
      ideas: ['m1-rc-cronometro'], pre: 'τ · 63 % · gráfica' },
    { id: 'm1-diagramas-reales', h: 3, m: 'd', tipo: 'Práctica', t: 'Interpreta diagramas reales', obj: 'Identificar componentes, valores, códigos y conexiones en diagramas de aparatos reales.', ac: 0, dc: 2, tema: 'm1-simbologia',
      pasos: [[20, 'Práctica demostrativa: interpretas en el proyector el diagrama de un cargador.'], [60, 'Práctica supervisada por equipos con roles de supervisor: cada equipo interpreta un diagrama (luz nocturna, alarma, fuente).'], [50, 'Práctica autónoma: cada alumno interpreta el diagrama de su aparato desarmado (o uno que le das).'], [20, 'Plenaria y coevaluación con la lista de cotejo.']],
      mat: 'Diagramas impresos (luz nocturna, alarma con 555, fuente de 5 V) y del aparato desarmado.', ev: 'Diagrama interpretado: componentes, valores, símbolos y conexiones (Desempeño · actividad clave)', ideas: ['coevaluacion', 'm1-memorama-simbolos'], pre: 'interpretar · interconexión · valor' },
    { id: 'm1-ewaste', h: 1, m: 'd', tipo: 'Formación', t: 'Basura electrónica: ¿qué hacemos con ella?', obj: 'Relacionar el desarmado y reciclaje con la economía ecológica.', ac: null,
      pasos: [[15, 'Pregunta-reto: ¿qué pasa con el celular que tiras?'], [20, 'Lluvia de ideas: qué se reutiliza, qué se recicla y qué es peligroso (plomo, baterías).'], [15, 'Acuerdo del grupo: caja de componentes recuperados y punto de acopio.']],
      ideas: ['m1-ewaste-seguro', 'pregunta-reto'] },
    { id: 'm1-verificacion', h: 3, m: 'c', lugar: 'taller', noComputo: true, tipo: 'Evaluación', t: 'Verificación de un circuito: calcula, simula, arma y mide', obj: 'Verificar las variables eléctricas de un circuito y compararlas con la hoja del fabricante.', ac: 1, dc: 2, tema: 'm1-ohm-watt',
      pasos: [[10, 'Cada equipo recibe un circuito mixto con LED (5 versiones distintas).'], [40, 'Calculan corrientes, voltajes y potencias, y lo simulan si hay computadora.'], [70, 'Arman, miden y comparan con lo calculado y con la hoja de datos del LED.'], [30, 'Entregan el reporte; tú observas con la guía de observación.']],
      mat: 'Protoboard, resistores, LED, fuente o pila de 9 V, multímetro, hojas de datos.', ev: 'Verificación de variables eléctricas contra la hoja del fabricante (Producto · actividad clave)', ideas: ['coevaluacion'], pre: 'verificar · tolerancia · hoja de datos' },
    { id: 'm1-plenaria', h: 1, m: 'c', tipo: 'Evaluación', t: 'Plenaria: problemas que encontramos al medir', obj: 'Compartir las fallas encontradas y cómo se resolvieron.', ac: null,
      pasos: [[35, 'Cada equipo cuenta una falla y cómo la encontró.'], [15, 'Tú cierras con las aplicaciones en la industria.']], ideas: ['galeria-errores'] },
    { id: 'examen-m1s1', h: 2, m: 'c', tipo: 'Evaluación', t: 'Examen del 1er parcial', obj: 'Evaluar los conocimientos del submódulo.', ac: null,
      pasos: [[10, 'Indicaciones y respiración antes del examen.'], [80, 'Examen escrito (Escuadra lo arma con los temas que diste).'], [10, 'Recoges y comentas lo que viene.']], ev: 'Examen del parcial', ideas: ['pr-respira'] },
    { id: 'm1-retro', h: 2, m: 'c', tipo: 'Evaluación', t: 'Retroalimentación y evidencias pendientes', obj: 'Corregir errores del examen y recuperar evidencias.', ac: null,
      pasos: [[30, 'Errores comunes del examen en pantalla, sin nombres.'], [50, 'Recuperación de evidencias pendientes.'], [20, 'Revisión de calificaciones con cada alumno.']] },
    { id: 'm1-meta', h: 1, m: 'c', tipo: 'Formación', t: 'Autoevaluación y meta para el 2º parcial', obj: 'Reflexionar sobre su avance y fijar una meta.', ac: null,
      pasos: [[20, 'Autoevaluación: lo que domino y lo que me falta.'], [20, 'Meta concreta para el 2º parcial (circuitos analógicos y PCB).'], [10, 'Muro de logros.']], ideas: ['pr-muro-logros'] }
  ];

  /* =================== BANCO DE PREGUNTAS =================== */
  const RC = ['negro', 'café', 'rojo', 'naranja', 'amarillo', 'verde', 'azul', 'violeta', 'gris', 'blanco'];
  const E12 = [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82];
  const ohmTxt = v => v >= 1e6 ? f(v / 1e6, 2) + ' MΩ' : v >= 1000 ? f(v / 1000, 2) + ' kΩ' : f(v, 1) + ' Ω';
  const comercialMayor = r => { for (let k = 1; k <= 1e6; k *= 10) for (const b of E12) if (b * k >= r - 1e-9) return b * k; return r; };
  const gen = {
    m1ohmI: rnd => { const V = pick(rnd, [5, 9, 12, 24]), R = pick(rnd, [220, 330, 470, 1000, 2200, 4700]), I = V / R * 1000;
      return { q: '¿Qué corriente circula por un resistor de ' + ohmTxt(R) + ' conectado a ' + V + ' V?', op: ops(f(I, 2) + ' mA', [f(V * R / 1000, 2) + ' mA', f(R / V, 2) + ' mA', f(I * 10, 2) + ' mA'], [f(I / 10, 3) + ' mA']), r: 'I = V / R = ' + V + ' / ' + R + ' = ' + f(I / 1000, 5) + ' A = ' + f(I, 2) + ' mA.' }; },
    m1ohmV: rnd => { const I = pick(rnd, [2, 5, 10, 15, 20, 25]), R = pick(rnd, [100, 220, 330, 470, 1000]), V = I / 1000 * R;
      return { q: 'Por un resistor de ' + ohmTxt(R) + ' circulan ' + I + ' mA. ¿Cuánto voltaje cae en él?', op: ops(f(V, 2) + ' V', [f(I * R, 0) + ' V', f(R / I, 2) + ' V', f(V * 10, 2) + ' V'], [f(V / 2, 2) + ' V']), r: 'V = I · R = ' + f(I / 1000, 3) + ' A × ' + R + ' Ω = ' + f(V, 2) + ' V.' }; },
    m1watt: rnd => { const V = pick(rnd, [5, 9, 12]), R = pick(rnd, [47, 100, 150, 220, 330]), P = V * V / R;
      return { q: 'Un resistor de ' + R + ' Ω se conecta a ' + V + ' V. ¿Qué potencia disipa? ¿Aguanta uno de 1/4 W?', op: ops(f(P, 2) + ' W · ' + (P <= 0.25 ? 'sí aguanta' : 'no, se quema'), [f(P, 2) + ' W · ' + (P <= 0.25 ? 'no, se quema' : 'sí aguanta'), f(V / R, 3) + ' W · sí aguanta', f(V * R / 100, 2) + ' W · no, se quema'], [f(P * 2, 2) + ' W · no, se quema']), r: 'P = V² / R = ' + V + '² / ' + R + ' = ' + f(P, 3) + ' W; ' + (P <= 0.25 ? 'es menor que 0.25 W: sí aguanta.' : 'es mayor que 0.25 W: un resistor de 1/4 W se quema.') }; },
    m1serie: rnd => { const rs = [pick(rnd, [100, 220, 330]), pick(rnd, [470, 560, 680]), pick(rnd, [1000, 1500, 2200])], s = rs.reduce((a, b) => a + b, 0);
      return { q: '¿Cuál es la resistencia equivalente de ' + rs.map(ohmTxt).join(', ') + ' conectados en serie?', op: ops(ohmTxt(s), [ohmTxt(1 / rs.reduce((a, b) => a + 1 / b, 0)), ohmTxt(rs[2]), ohmTxt(s / 3)], [ohmTxt(rs[0] + rs[1])]), r: 'En serie se suman: ' + rs.join(' + ') + ' = ' + s + ' Ω (' + ohmTxt(s) + ').' }; },
    m1paralelo: rnd => { let a = pick(rnd, [100, 220, 330, 470, 1000, 2200]), b = pick(rnd, [100, 220, 330, 470, 1000, 2200]); if (a === b && rnd() < 0.5) b = pick(rnd, [680, 1500]); const p = a * b / (a + b);
      return { q: 'Dos resistores de ' + ohmTxt(a) + ' y ' + ohmTxt(b) + ' están en paralelo. ¿Cuánto vale la resistencia equivalente?', op: ops(ohmTxt(p), [ohmTxt(a + b), ohmTxt((a + b) / 2), ohmTxt(Math.max(a, b))], [ohmTxt(Math.min(a, b)), ohmTxt(p * 2 + a), ohmTxt(p / 2), ohmTxt(a * b / 100)]), r: 'Req = R1·R2 / (R1 + R2) = ' + a + '×' + b + ' / ' + (a + b) + ' = ' + f(p, 1) + ' Ω. Siempre es menor que el más pequeño.' }; },
    m1colores: rnd => { const b = pick(rnd, E12), m = pick(rnd, [0, 1, 2, 3, 4]), v = b * Math.pow(10, m), d1 = Math.floor(b / 10), d2 = b % 10;
      return { q: 'Un resistor tiene las bandas ' + RC[d1] + ', ' + RC[d2] + ', ' + RC[m] + ' y dorado. ¿Cuál es su valor?', op: ops(ohmTxt(v) + ' ±5 %', [ohmTxt(b * Math.pow(10, m + 1)) + ' ±5 %', ohmTxt(Number(String(d1) + String(d2) + String(m))) + ' ±5 %', ohmTxt(v) + ' ±10 %'], [ohmTxt(b * Math.pow(10, Math.max(0, m - 1))) + ' ±5 %', ohmTxt(b * Math.pow(10, m + 2)) + ' ±5 %', ohmTxt(v) + ' ±1 %']), r: 'Dígitos ' + d1 + ' y ' + d2 + ' → ' + b + '; multiplicador ' + RC[m] + ' = ×' + Math.pow(10, m) + ' → ' + v + ' Ω (' + ohmTxt(v) + '); dorado = ±5 %.' }; },
    m1led: rnd => { const V = pick(rnd, [5, 9, 12]), led = pick(rnd, [['rojo', 2], ['amarillo', 2.1], ['verde', 2.2], ['azul', 3.1], ['blanco', 3.2]]), I = pick(rnd, [10, 15, 20]), R = (V - led[1]) / (I / 1000), rc = comercialMayor(R);
      return { q: 'Con una fuente de ' + V + ' V, ¿qué resistor comercial (serie E12) limita un LED ' + led[0] + ' (' + f(led[1], 1) + ' V) a ' + I + ' mA o menos?', op: ops(ohmTxt(rc), [ohmTxt(comercialMayor(V / (I / 1000))), ohmTxt(comercialMayor(R / 2)), ohmTxt(comercialMayor(led[1] / (I / 1000)))], [ohmTxt(comercialMayor(R * 3))]), r: 'R = (' + V + ' − ' + f(led[1], 1) + ') / ' + f(I / 1000, 3) + ' = ' + f(R, 1) + ' Ω → el comercial mayor más cercano es ' + ohmTxt(rc) + '.' }; },
    m1divisor: rnd => { const Vin = pick(rnd, [5, 9, 12, 24]), r1 = pick(rnd, [1000, 2200, 4700, 10000]), r2 = pick(rnd, [1000, 2200, 3300, 4700, 10000]), Vo = Vin * r2 / (r1 + r2);
      return { q: 'Divisor de voltaje: R1 = ' + ohmTxt(r1) + ' (arriba) y R2 = ' + ohmTxt(r2) + ' (abajo) con ' + Vin + ' V. ¿Cuánto vale el voltaje en R2?', op: ops(f(Vo, 2) + ' V', [f(Vin * r1 / (r1 + r2), 2) + ' V', f(Vin / 2, 2) + ' V', f(Vin * r2 / r1, 2) + ' V'], [f(Vo / 2, 2) + ' V', f(Vin - Vo / 2, 2) + ' V', f(Vo * 1.5, 2) + ' V', f(Vin * 0.1, 2) + ' V']), r: 'Vsal = Vin · R2 / (R1 + R2) = ' + Vin + ' × ' + r2 + ' / ' + (r1 + r2) + ' = ' + f(Vo, 2) + ' V.' }; },
    m1lvk: rnd => { const Vs = pick(rnd, [9, 12, 15, 24]); let a = pick(rnd, [1.5, 2, 2.5, 3, 4]), b = pick(rnd, [1, 2, 3, 3.5, 4.5]); if (a + b >= Vs) { a = 2; b = 3; } const c = Vs - a - b;
      return { q: 'En una malla con fuente de ' + Vs + ' V hay tres resistores en serie. En dos caen ' + f(a, 1) + ' V y ' + f(b, 1) + ' V. ¿Cuánto cae en el tercero?', op: ops(f(c, 1) + ' V', [f(Vs + a + b, 1) + ' V', f(a + b, 1) + ' V', f(Vs / 3, 1) + ' V'], [f(Vs, 1) + ' V']), r: 'LVK: ' + Vs + ' = ' + f(a, 1) + ' + ' + f(b, 1) + ' + V3 → V3 = ' + f(c, 1) + ' V.' }; },
    m1lck: rnd => { const It = pick(rnd, [30, 40, 50, 60, 80, 100]), i1 = pick(rnd, [5, 10, 15, 20]), i2 = It - i1;
      return { q: 'A un nodo llegan ' + It + ' mA y se reparten en dos ramas. Por una salen ' + i1 + ' mA. ¿Cuánto sale por la otra?', op: ops(i2 + ' mA', [(It + i1) + ' mA', It + ' mA', f(It / 2, 0) + ' mA'], [i1 + ' mA', (i2 + 10) + ' mA', (It + 2 * i1) + ' mA', (i2 * 2) + ' mA']), r: 'LCK: lo que entra = lo que sale → ' + It + ' = ' + i1 + ' + I2 → I2 = ' + i2 + ' mA.' }; },
    m1tau: rnd => { const R = pick(rnd, [10000, 22000, 47000, 100000]), C = pick(rnd, [10, 47, 100, 220, 470, 1000]), t = R * C / 1e6;
      return { q: 'Un circuito RC tiene R = ' + ohmTxt(R) + ' y C = ' + C + ' µF. ¿Cuánto vale su constante de tiempo τ y en cuánto se carga casi por completo (5 τ)?', op: ops('τ = ' + f(t, 2) + ' s · 5τ = ' + f(5 * t, 2) + ' s', ['τ = ' + f(R * C, 0) + ' s · 5τ = ' + f(5 * R * C, 0) + ' s', 'τ = ' + f(t / 5, 2) + ' s · 5τ = ' + f(t, 2) + ' s', 'τ = ' + f(t * 1000, 0) + ' s · 5τ = ' + f(t * 5000, 0) + ' s']), r: 'τ = R · C = ' + R + ' Ω × ' + f(C / 1e6, 6) + ' F = ' + f(t, 2) + ' s; 5τ = ' + f(5 * t, 2) + ' s.' }; },
    m1prefijo: rnd => { const c = pick(rnd, [['kΩ', 'Ω', 1000, [1.5, 2.2, 4.7, 10, 47]], ['mA', 'A', 0.001, [20, 150, 350, 500, 15]], ['µF', 'F', 1e-6, [470, 100, 1000, 22]], ['MΩ', 'Ω', 1e6, [1, 2.2, 4.7]]]), v = pick(rnd, c[3]), r = v * c[2];
      const fx = x => x >= 1 ? f(x, 2) : x >= 0.001 ? f(x, 6) : f(x, 9);
      return { q: '¿Cuánto es ' + f(v, 2) + ' ' + c[0] + ' en ' + c[1] + '?', op: ops(fx(r) + ' ' + c[1], [fx(v / c[2]) + ' ' + c[1], fx(r * 10) + ' ' + c[1], fx(r / 10) + ' ' + c[1]]), r: f(v, 2) + ' ' + c[0] + ' × ' + (c[2] >= 1 ? f(c[2], 0) : c[2] === 0.001 ? '0.001' : '0.000001') + ' = ' + fx(r) + ' ' + c[1] + '.' }; },
    m1cap: rnd => { const d = pick(rnd, [10, 22, 47, 33, 68]), m = pick(rnd, [2, 3, 4, 5]), pF = d * Math.pow(10, m), txt = pF >= 1e6 ? f(pF / 1e6, 2) + ' µF' : pF >= 1000 ? f(pF / 1000, 2) + ' nF' : pF + ' pF';
      const mal = x => x >= 1e6 ? f(x / 1e6, 2) + ' µF' : x >= 1000 ? f(x / 1000, 2) + ' nF' : x + ' pF';
      return { q: 'Un capacitor cerámico está marcado «' + d + m + '». ¿Cuánto vale?', op: ops(txt, [mal(pF * 10), mal(pF / 10), d + m + ' pF']), r: d + ' seguido de ' + m + ' ceros = ' + pF + ' pF = ' + txt + '.' }; }
  };
  const banco = [
    // seguridad
    { id: 'm1s1', tema: 'm1-seguridad', tipo: 'om', niv: 1, q: '¿Qué es lo que realmente lastima en un choque eléctrico?', op: ['La corriente que pasa por el cuerpo', 'El color del cable', 'La resistencia del aparato', 'La potencia del foco'] },
    { id: 'm1s2', tema: 'm1-seguridad', tipo: 'om', niv: 1, q: '¿Cuál de estos aparatos NO se debe desarmar en el taller?', op: ['Un horno de microondas', 'Un control remoto', 'Un juguete de pilas', 'Un radio de pilas'] },
    { id: 'm1s3', tema: 'm1-seguridad', tipo: 'vf', niv: 1, q: 'El cautín puede dejarse acostado sobre la mesa si se tiene cuidado.', v: false, exp: 'Siempre va en su soporte: trabaja a más de 300 °C.' },
    { id: 'm1s4', tema: 'm1-seguridad', tipo: 'om', niv: 2, q: 'Antes de tomar un circuito integrado conviene…', op: ['Tocar una superficie metálica para descargar la estática', 'Mojarse las manos', 'Tomarlo por las patitas', 'Frotarlo con un trapo'] },
    { id: 'm1s5', tema: 'm1-seguridad', tipo: 'ab', niv: 2, q: 'Menciona tres medidas de seguridad antes de desarmar un aparato y explica por qué.', r: 'Desconectarlo y quitar pilas (evita choques), esperar a que se descarguen los capacitores, usar lentes (terminales y resortes salen volando), no abrir microondas ni TV de tubo (alto voltaje).' },
    // magnitudes
    { id: 'm1m1', tema: 'm1-magnitudes', tipo: 'om', niv: 1, q: '¿En qué unidad se mide la corriente?', op: ['Ampere (A)', 'Volt (V)', 'Ohm (Ω)', 'Watt (W)'] },
    { id: 'm1m2', tema: 'm1-magnitudes', tipo: 'om', niv: 2, q: 'En la analogía del agua, el voltaje equivale a…', op: ['La presión o diferencia de nivel', 'La cantidad de agua que pasa', 'El ancho de la manguera', 'El color del agua'] },
    { id: 'm1m3', tema: 'm1-magnitudes', tipo: 'calc', niv: 2, gen: 'm1prefijo' },
    { id: 'm1m4', tema: 'm1-magnitudes', tipo: 'vf', niv: 1, q: 'Una pila entrega corriente alterna.', v: false, exp: 'Entrega corriente directa: su + y − no cambian.' },
    { id: 'm1m5', tema: 'm1-magnitudes', tipo: 'om', niv: 1, q: '¿Qué prefijo significa «mil veces»?', op: ['kilo (k)', 'mili (m)', 'micro (µ)', 'mega (M)'] },
    // componentes
    { id: 'm1c1', tema: 'm1-componentes', tipo: 'om', niv: 1, q: '¿Qué componente deja pasar la corriente en un solo sentido?', op: ['Diodo', 'Resistor', 'Capacitor', 'Inductor'] },
    { id: 'm1c2', tema: 'm1-componentes', tipo: 'om', niv: 1, q: 'En una placa, ¿qué letra identifica a un transistor?', op: ['Q', 'R', 'C', 'L'] },
    { id: 'm1c3', tema: 'm1-componentes', tipo: 'om', niv: 2, q: '¿Cuál es un componente activo?', op: ['Transistor', 'Resistor', 'Capacitor', 'Inductor'] },
    { id: 'm1c4', tema: 'm1-componentes', tipo: 'om', niv: 2, q: '¿Para qué sirve el capacitor electrolítico grande de una fuente?', op: ['Alisa (filtra) el voltaje', 'Sube el voltaje', 'Convierte CA en CD por sí solo', 'Mide la corriente'] },
    { id: 'm1c5', tema: 'm1-componentes', tipo: 'vf', niv: 1, q: 'Un transformador sirve para subir o bajar voltaje alterno.', v: true, exp: 'Funciona con corriente alterna.' },
    { id: 'm1c6', tema: 'm1-componentes', tipo: 'ab', niv: 2, q: 'Explica la diferencia entre componentes pasivos y activos con un ejemplo de cada uno.', r: 'Los pasivos no controlan ni amplifican (resistor, capacitor, inductor); los activos controlan la corriente (diodo, transistor, circuito integrado).' },
    // simbología
    { id: 'm1y1', tema: 'm1-simbologia', tipo: 'om', niv: 1, q: 'En un esquemático, un punto donde se juntan dos líneas indica…', op: ['Que están conectadas', 'Que se cruzan sin tocarse', 'Un componente dañado', 'Tierra'] },
    { id: 'm1y2', tema: 'm1-simbologia', tipo: 'om', niv: 1, q: '¿Qué significa GND?', op: ['Tierra o común, referencia de 0 V', 'Generador', 'Ganancia', 'Fusible'] },
    { id: 'm1y3', tema: 'm1-simbologia', tipo: 'om', niv: 2, q: 'En el símbolo de una pila, la línea larga es…', op: ['El positivo (+)', 'El negativo (−)', 'La tierra', 'El fusible'] },
    { id: 'm1y4', tema: 'm1-simbologia', tipo: 'vf', niv: 2, q: 'El diagrama esquemático muestra cómo se ve físicamente el aparato.', v: false, exp: 'Muestra la función con símbolos; el pictórico muestra cómo se ve.' },
    { id: 'm1y5', tema: 'm1-simbologia', tipo: 'om', niv: 1, q: '¿Qué símbolo representa a un LED?', op: ['Triángulo con raya y flechas que salen', 'Dos placas paralelas', 'Zigzag', 'Círculo con una M'] },
    { id: 'm1y6', tema: 'm1-simbologia', tipo: 'ab', niv: 3, q: 'Describe cómo se conecta un LED con su resistor y una pila en un esquemático: qué va con qué y por qué importa el sentido.', r: '+ de la pila → resistor → ánodo del LED → cátodo → − (GND). El LED solo conduce en un sentido: al revés no enciende.' },
    // colores
    { id: 'm1k1', tema: 'm1-colores', tipo: 'calc', niv: 2, gen: 'm1colores' },
    { id: 'm1k2', tema: 'm1-colores', tipo: 'om', niv: 1, q: '¿Qué tolerancia indica la banda dorada?', op: ['±5 %', '±10 %', '±1 %', '±20 %'] },
    { id: 'm1k3', tema: 'm1-colores', tipo: 'vf', niv: 2, q: 'En la serie comercial E12 existe el resistor de 300 Ω.', v: false, exp: 'Los más cercanos son 270 Ω y 330 Ω.' },
    { id: 'm1k4', tema: 'm1-colores', tipo: 'calc', niv: 2, gen: 'm1cap' },
    { id: 'm1k5', tema: 'm1-colores', tipo: 'om', niv: 2, q: 'Un resistor de 1 kΩ ±5 % mide 1040 Ω. ¿Está bien?', op: ['Sí, el rango es 950 a 1050 Ω', 'No, debe medir exactamente 1000 Ω', 'No, el rango es 990 a 1010 Ω', 'Sí, cualquier valor sirve'] },
    // serie y paralelo
    { id: 'm1p1', tema: 'm1-serie-paralelo', tipo: 'calc', niv: 3, gen: 'm1serie' },
    { id: 'm1p2', tema: 'm1-serie-paralelo', tipo: 'calc', niv: 3, gen: 'm1paralelo' },
    { id: 'm1p3', tema: 'm1-serie-paralelo', tipo: 'om', niv: 1, q: '¿En qué conexión la corriente es la misma en todos los elementos?', op: ['Serie', 'Paralelo', 'Mixta', 'Ninguna'] },
    { id: 'm1p4', tema: 'm1-serie-paralelo', tipo: 'vf', niv: 2, q: 'La resistencia equivalente de un paralelo siempre es menor que la más pequeña del grupo.', v: true, exp: 'Cada rama agrega un camino más para la corriente.' },
    { id: 'm1p5', tema: 'm1-serie-paralelo', tipo: 'om', niv: 2, q: 'Dos capacitores de 10 µF en paralelo equivalen a…', op: ['20 µF', '5 µF', '10 µF', '100 µF'] },
    { id: 'm1p6', tema: 'm1-serie-paralelo', tipo: 'ab', niv: 2, q: '¿Por qué los aparatos de una casa se conectan en paralelo y no en serie?', r: 'En paralelo todos reciben el mismo voltaje y cada uno se enciende o apaga sin afectar a los demás.' },
    // ohm y watt
    { id: 'm1o1', tema: 'm1-ohm-watt', tipo: 'calc', niv: 3, gen: 'm1ohmI' },
    { id: 'm1o2', tema: 'm1-ohm-watt', tipo: 'calc', niv: 3, gen: 'm1ohmV' },
    { id: 'm1o3', tema: 'm1-ohm-watt', tipo: 'calc', niv: 3, gen: 'm1watt' },
    { id: 'm1o4', tema: 'm1-ohm-watt', tipo: 'calc', niv: 3, gen: 'm1led' },
    { id: 'm1o5', tema: 'm1-ohm-watt', tipo: 'om', niv: 1, q: '¿Cuál es la ley de Ohm?', op: ['V = I · R', 'P = V · I', 'V = I / R', 'R = V · I'] },
    { id: 'm1o6', tema: 'm1-ohm-watt', tipo: 'vf', niv: 2, q: 'Para el LED se elige el resistor comercial menor más cercano al calculado.', v: false, exp: 'Se elige el mayor más cercano, para no pasar de la corriente recomendada.' },
    // kirchhoff
    { id: 'm1f1', tema: 'm1-kirchhoff', tipo: 'calc', niv: 3, gen: 'm1lvk' },
    { id: 'm1f2', tema: 'm1-kirchhoff', tipo: 'calc', niv: 3, gen: 'm1lck' },
    { id: 'm1f3', tema: 'm1-kirchhoff', tipo: 'calc', niv: 3, gen: 'm1divisor' },
    { id: 'm1f4', tema: 'm1-kirchhoff', tipo: 'om', niv: 1, q: '¿Qué dice la ley de corrientes de Kirchhoff?', op: ['La corriente que entra a un nodo es igual a la que sale', 'En una malla la corriente se duplica', 'El voltaje es igual en serie', 'La resistencia es igual en paralelo'] },
    { id: 'm1f5', tema: 'm1-kirchhoff', tipo: 'ab', niv: 2, q: '¿Para qué sirve un divisor de voltaje? Da un ejemplo.', r: 'Para obtener una fracción del voltaje de entrada: por ejemplo, leer un sensor (LDR) o bajar 9 V a 3 V para una entrada.' },
    // multímetro
    { id: 'm1u1', tema: 'm1-multimetro', tipo: 'om', niv: 1, q: '¿Cómo se conecta el multímetro para medir voltaje?', op: ['En paralelo con el elemento', 'En serie con el elemento', 'Con el circuito apagado', 'Con la punta roja en A'] },
    { id: 'm1u2', tema: 'm1-multimetro', tipo: 'om', niv: 1, q: '¿Cómo se mide la corriente?', op: ['En serie, abriendo el circuito', 'En paralelo con la fuente', 'Con el selector en Ω', 'Tocando los dos extremos de la pila'] },
    { id: 'm1u3', tema: 'm1-multimetro', tipo: 'vf', niv: 2, q: 'La resistencia se puede medir con el circuito encendido.', v: false, exp: 'Se mide con el circuito apagado: el voltaje altera la lectura y puede dañar el multímetro.' },
    { id: 'm1u4', tema: 'm1-multimetro', tipo: 'om', niv: 2, q: 'Si mides voltaje con la punta roja en la entrada de corriente (A)…', op: ['Haces un corto y se funde el fusible del multímetro', 'Mides con más precisión', 'No pasa nada', 'Mides resistencia'] },
    { id: 'm1u5', tema: 'm1-multimetro', tipo: 'om', niv: 1, q: '¿Para qué sirve la prueba de continuidad?', op: ['Para saber si dos puntos están unidos', 'Para medir potencia', 'Para cargar capacitores', 'Para medir temperatura'] },
    { id: 'm1u6', tema: 'm1-multimetro', tipo: 'ab', niv: 3, q: 'Describe paso a paso cómo medir la corriente que pasa por un LED en una protoboard.', r: 'Apagar, abrir el circuito entre resistor y LED, poner la punta roja en mA y el selector en mA⎓, cerrar el circuito con el multímetro en serie, encender y leer; al final regresar la punta a V/Ω.' },
    // datasheet
    { id: 'm1d1', tema: 'm1-datasheet', tipo: 'om', niv: 1, q: '¿Qué sección de la hoja de datos indica los valores que no se deben rebasar?', op: ['Absolute Maximum Ratings', 'Package', 'Typical curves', 'Ordering information'] },
    { id: 'm1d2', tema: 'm1-datasheet', tipo: 'om', niv: 1, q: '¿Qué es el «pinout»?', op: ['El diagrama de qué es cada terminal', 'El precio del componente', 'La temperatura máxima', 'La fecha de fabricación'] },
    { id: 'm1d3', tema: 'm1-datasheet', tipo: 'om', niv: 2, q: 'El regulador 7805 entrega…', op: ['5 V', '78 V', '7.8 V', '0.5 V'] },
    { id: 'm1d4', tema: 'm1-datasheet', tipo: 'vf', niv: 2, q: 'El orden de terminales de un transistor es igual en todos los fabricantes, así que no hace falta revisarlo.', v: false, exp: 'Puede cambiar: siempre se revisa el pinout de la hoja.' },
    { id: 'm1d5', tema: 'm1-datasheet', tipo: 'om', niv: 2, q: 'En la hoja de un LED, «VF» es…', op: ['El voltaje que cae en el LED al encender', 'La frecuencia', 'El valor final', 'El voltaje de la fuente'] },
    // RC
    { id: 'm1r1', tema: 'm1-rc', tipo: 'calc', niv: 3, gen: 'm1tau' },
    { id: 'm1r2', tema: 'm1-rc', tipo: 'om', niv: 2, q: 'En una constante de tiempo (1 τ), el capacitor se carga a cerca del…', op: ['63 %', '50 %', '100 %', '10 %'] },
    { id: 'm1r3', tema: 'm1-rc', tipo: 'vf', niv: 1, q: 'Un capacitor electrolítico se puede conectar en cualquier sentido.', v: false, exp: 'Tiene polaridad: al revés se daña y puede reventar.' },
    { id: 'm1r4', tema: 'm1-rc', tipo: 'om', niv: 2, q: '¿Para qué se usa un circuito RC?', op: ['Temporizar y filtrar', 'Elevar voltaje alterno', 'Medir corriente', 'Rectificar'] },
    { id: 'm1r5', tema: 'm1-rc', tipo: 'ab', niv: 2, q: '¿Por qué el voltaje de un capacitor que se carga no sube en línea recta?', r: 'Porque al cargarse queda menos diferencia de voltaje con la fuente, la corriente disminuye y la carga se hace cada vez más lenta.' }
  ];

  /* =================== IDEAS =================== */
  const ideas = [
    { id: 'm1-agua', titulo: 'Analogía del agua con dos botellas', sm: ['I-1'], tipo: 'Práctica', dur: '15 min', costo: 'Bajo', obj: 'Ver qué es voltaje, corriente y resistencia antes de las fórmulas.', mat: ['Dos botellas de 1.5 L con un orificio abajo', 'Popotes de distinto grosor', 'Agua y una charola'],
      pasos: ['Llena las botellas a distinta altura: la altura es el voltaje.', 'Pon popote delgado en una y grueso en la otra: el grosor es la resistencia.', 'Comparen qué tan rápido sale el agua: eso es la corriente.', 'Cambien una sola cosa a la vez y que predigan antes.'], evid: 'Dibujo de la analogía en la libreta', tip: 'Hazla al aire libre o sobre una charola: mojarse en el taller de electrónica no es buena idea.' },
    { id: 'm1-desarmado', titulo: 'Desarmado seguro y clasificación de componentes', sm: ['I-1'], tipo: 'Práctica', dur: '3 h', costo: '$0', obj: 'Recuperar componentes y aprender a reconocerlos (actividad clave «Interpreta planos y diagramas», p. 14).', mat: ['Aparatos descompuestos (control, radio, cargador, juguete)', 'Desarmadores, pinzas, lentes', 'Caja con divisiones'],
      pasos: ['Pide los aparatos una semana antes y revisa que no sean peligrosos.', 'Foto de la placa antes de tocar nada.', 'Tabla: referencia, componente, función y símbolo.', 'Recuperen piezas para usarlas en el semestre.'], evid: 'Tabla de clasificación (lista de cotejo)', tip: 'Arma una caja de componentes del grupo: ahorran dinero en los circuitos del 2º y 3er parcial.' },
    { id: 'm1-ewaste-seguro', titulo: 'Punto de acopio de basura electrónica', sm: ['I-1', 'I-2'], tipo: 'Docencia', dur: '20 min', costo: '$0', obj: 'Conectar el taller con la economía ecológica (CoCEDS).', mat: ['Caja rotulada', 'Lista de lo que sí y no se recibe'],
      pasos: ['Explica qué es peligroso: plomo de la soldadura, baterías de litio, capacitores grandes.', 'Separen: reutilizable, reciclable y peligroso.', 'Investiguen un punto de acopio del municipio.', 'Lleven lo acumulado al final del semestre.'], evid: 'Registro de lo separado', tip: 'Las baterías de litio infladas no se perforan ni se tiran a la basura: guárdalas en un recipiente con arena hasta llevarlas al acopio.' },
    { id: 'm1-memorama-simbolos', titulo: 'Memorama de símbolos electrónicos', sm: ['I-1'], tipo: 'Dinámica', dur: '25 min', costo: 'Bajo', obj: 'Memorizar símbolos jugando.', mat: ['24 tarjetas: 12 con símbolo y 12 con nombre o foto'],
      pasos: ['Equipos de 4 con un juego de tarjetas.', 'Voltean dos: si son pareja (símbolo-componente) se quedan con ellas.', 'Gana quien junte más; cada pareja la explica.', 'Variante: símbolo contra componente real.'], evid: 'Lista de símbolos en la libreta', tip: 'Imprímelas en cartulina y enmícalas: duran todo el semestre y sirven para el 3er parcial (compuertas).' },
    { id: 'm1-reto-resistor', titulo: 'Reto: ¿cuánto vale este resistor?', sm: ['I-1'], tipo: 'Dinámica', dur: '20 min', costo: 'Bajo', obj: 'Leer el código de colores rápido y comprobarlo con el multímetro.', mat: ['Bolsas con 10 resistores', 'Multímetros'],
      pasos: ['Cada pareja lee los 10 valores en 5 minutos.', 'Intercambian bolsas y revisan.', 'Comprueban con el multímetro los que no coinciden.', 'Cuentan aciertos.'], evid: 'Tabla de valores', tip: 'Incluye resistores de 5 bandas y uno quemado: provoca la mejor discusión.' },
    { id: 'm1-falstad', titulo: 'Falstad: ver la corriente moverse', sm: ['I-1', 'I-2'], tipo: 'Proyector', dur: '10 min', costo: '$0', obj: 'Ver corriente y voltajes animados en el proyector para predecir antes de medir.', mat: ['Proyector', 'Navegador (falstad.com/circuit, sin cuenta)'],
      pasos: ['Abre un ejemplo de la biblioteca o arma el circuito del día.', 'Pausa y pregunta: ¿qué pasará si quito esta rama?', 'Cambia un valor en vivo y que expliquen el cambio.', 'Deja la liga para que lo exploren en casa.'], evid: 'Predicción anotada en la libreta', link: 'https://www.falstad.com/circuit/', tip: 'Funciona en el celular: pueden practicar en casa sin instalar nada.' },
    { id: 'm1-tinkercad-clase', titulo: 'Tinkercad con código de clase', sm: ['I-1', 'I-2', 'I-3'], tipo: 'Docencia', dur: '15 min', costo: '$0', obj: 'Que todo el grupo entre al simulador sin correo y tú veas sus trabajos.', mat: ['Cuenta de docente en Tinkercad', 'Computadoras con internet'],
      pasos: ['Crea una clase en Tinkercad y agrega a tus alumnos con un apodo.', 'Comparte el código de clase y el apodo de cada quien.', 'Ellos entran con «Unirse a la clase».', 'Revisas sus circuitos desde tu cuenta.'], evid: 'Circuitos guardados en la clase', link: 'https://www.tinkercad.com/', tip: 'Usa apodos que no sean el nombre completo: protege los datos de tus alumnos.' },
    { id: 'm1-multimetro-carrera', titulo: 'Rally del multímetro', sm: ['I-1'], tipo: 'Dinámica', dur: '40 min', costo: 'Bajo', obj: 'Practicar todas las funciones del multímetro con estaciones.', mat: ['5 estaciones: resistores, pilas, cables rotos, LED armado, fuente'],
      pasos: ['Cada estación pide una medición distinta.', 'Las parejas rotan cada 7 minutos.', 'Anotan valor y unidad.', 'Gana quien tenga más mediciones correctas y su multímetro sin fusible fundido.'], evid: 'Hoja del rally', tip: 'En la estación de corriente pon un cartel: «¿dónde va la punta roja?».' },
    { id: 'm1-led-calculado', titulo: 'LED bien calculado vs. LED sin resistor (en simulador)', sm: ['I-1'], tipo: 'Proyector', dur: '10 min', costo: '$0', obj: 'Ver por qué el resistor limitador es obligatorio sin quemar LED reales.', mat: ['Tinkercad o Falstad en el proyector'],
      pasos: ['Conecta un LED directo a 9 V en Tinkercad: el simulador lo marca como dañado.', 'Agrega el resistor calculado y mide la corriente.', 'Cambia a un resistor menor y observa la corriente.', 'Concluyan la regla: siempre limitador.'], evid: 'Regla anotada en la libreta', tip: 'Tinkercad avisa cuando un LED excede su corriente: aprovéchalo en vez de quemar piezas reales.' },
    { id: 'm1-ficha-tecnica', titulo: 'Ficha técnica en 10 minutos', sm: ['I-1'], tipo: 'Práctica', dur: '10 min', costo: '$0', obj: 'Practicar la lectura de hojas de datos en inglés técnico.', mat: ['Hojas de datos impresas o en el celular'],
      pasos: ['Da un componente a cada pareja.', 'Buscan: qué es, 2 valores máximos, pinout y encapsulado.', 'Lo explican en 1 minuto.', 'Glosario de inglés técnico en la libreta.'], evid: 'Ficha en la libreta', tip: 'Coordina con el docente de inglés: es la mejor práctica de lectura técnica.' },
    { id: 'm1-rc-cronometro', titulo: 'Capacitor que se carga en un minuto', sm: ['I-1'], tipo: 'Práctica', dur: '30 min', costo: 'Bajo', obj: 'Medir la carga de un capacitor con multímetro y cronómetro.', mat: ['470 µF', '100 kΩ', 'Pila de 9 V', 'Multímetro', 'Celular'],
      pasos: ['τ = 100 000 × 0.00047 = 47 s.', 'Miden cada 10 s.', 'Grafican.', 'Comparan el 63 % con τ.'], evid: 'Gráfica de carga', tip: 'La resistencia interna del multímetro (≈10 MΩ) apenas afecta con 100 kΩ: por eso se eligió ese valor.' }
  ];

  /* =================== FIGURAS (SVG, sin internet) =================== */
  const d = E.fig.d, ln = d.ln, ci = d.ci, rc = d.rc, tx = d.tx, pg = d.pg, path = d.path, fl = d.flecha;
  const resistorH = (x, y, w) => { const s = 12, n = 6, pts = [[x, y]]; for (let i = 0; i < n; i++) pts.push([x + (i + 0.5) * w / n, y + (i % 2 ? s : -s) / 1.6]); pts.push([x + w, y]); return d.pl(pts, 'k2'); };
  const resistorV = (x, y, h) => { const s = 12, n = 6, pts = [[x, y]]; for (let i = 0; i < n; i++) pts.push([x + (i % 2 ? s : -s) / 1.6, y + (i + 0.5) * h / n]); pts.push([x, y + h]); return '<rect x="' + (x - 9) + '" y="' + y + '" width="18" height="' + h + '" fill="var(--fg-bg)" stroke="none"/>' + d.pl(pts, 'k2'); };
  const figs = {
    m1agua: { t: 'Analogía del agua', d: 'Voltaje = presión (altura), corriente = caudal, resistencia = estrechamiento.', w: 480, h: 220, anim: true, draw: t => {
      let s = rc(30, 40, 90, 140, 'none3', 6) + rc(32, 70, 86, 108, 'fluido') + tx([75, 30], 'Pila = tanque alto', 'tm') + tx([75, 205], 'Voltaje: la altura', 't');
      s += path('M120 160 L250 160', 'k') + path('M250 152 L330 156 L330 164 L250 168 Z', 'fill2') + tx([290, 140], 'Resistencia', 't') + tx([290, 190], 'tubo angosto', 'tm');
      s += path('M330 160 L440 160', 'k');
      for (let i = 0; i < 9; i++) { const x = 125 + ((t * 60 + i * 36) % 315); s += ci([x, 160], x > 250 && x < 330 ? 2.5 : 4, 'dot'); }
      s += fl([360, 130], [430, 130], 'b') + tx([395, 118], 'Corriente: caudal', 'tbb');
      return s;
    } },
    m1colores: { t: 'Código de colores de un resistor', d: 'Dígito, dígito, multiplicador y tolerancia: 4.7 kΩ ±5 %.', w: 480, h: 190, anim: false, draw: () => {
      const col = ['#f2c200', '#8a2be2', '#d22', '#c9a227']; let s = ln([40, 80], [120, 80], 'k2') + ln([360, 80], [440, 80], 'k2') + rc(120, 55, 240, 50, 'fill', 22);
      [165, 205, 245, 320].forEach((x, i) => { s += '<rect x="' + x + '" y="56" width="16" height="48" fill="' + col[i] + '" stroke="none"/>'; });
      s += tx([173, 130], 'amarillo', 'tm') + tx([173, 146], '4', 'tb') + tx([213, 130], 'violeta', 'tm') + tx([213, 146], '7', 'tb') + tx([253, 130], 'rojo', 'tm') + tx([253, 146], '× 100', 'tb') + tx([328, 130], 'dorado', 'tm') + tx([328, 146], '±5 %', 'tb');
      return s + tx([240, 178], '47 × 100 = 4700 Ω = 4.7 kΩ ±5 %', 'ta');
    } },
    m1seriePar: { t: 'Serie y paralelo', d: 'En serie la corriente es la misma; en paralelo se reparte entre las ramas.', w: 480, h: 220, anim: true, draw: t => {
      let s = tx([110, 22], 'Serie', 'tb') + tx([350, 22], 'Paralelo', 'tb');
      s += rc(30, 40, 160, 150, 'none2', 4) + resistorH(60, 40, 50) + resistorH(120, 40, 50) + ln([30, 70], [30, 160], 'k') + tx([22, 120], '+', 'tb');
      for (let i = 0; i < 8; i++) { const p = ((t * 0.25 + i / 8) % 1), per = 2 * (160 + 150), q = p * per; let x, y; if (q < 160) { x = 30 + q; y = 40; } else if (q < 310) { x = 190; y = 40 + (q - 160); } else if (q < 470) { x = 190 - (q - 310); y = 190; } else { x = 30; y = 190 - (q - 470); } s += ci([x, y], 4, 'dot'); }
      s += rc(270, 40, 170, 150, 'none2', 4) + ln([330, 40], [330, 190], 'k2') + ln([390, 40], [390, 190], 'k2') + tx([350, 118], 'R1', 'tm', 'start') + tx([410, 118], 'R2', 'tm', 'start');
      for (let i = 0; i < 6; i++) { const p = (t * 0.3 + i / 6) % 1; s += ci([330, 40 + p * 150], 4, 'dot') + ci([390, 40 + ((p + 0.5) % 1) * 150], 4, 'dot'); }
      s += resistorV(330, 90, 50) + resistorV(390, 90, 50);
      return s + tx([110, 212], 'Misma corriente en todo', 'tm') + tx([355, 212], 'La corriente se reparte', 'tm');
    } },
    m1multi: { t: 'Cómo conectar el multímetro', d: 'Voltaje en paralelo (circuito encendido); corriente en serie (abriendo el circuito).', w: 480, h: 220, anim: false, draw: () => {
      let s = tx([120, 22], 'Voltaje: en paralelo', 'tb') + tx([360, 22], 'Corriente: en serie', 'tb');
      s += rc(40, 50, 150, 120, 'none2', 4) + resistorH(80, 50, 70) + rc(70, 130, 80, 60, 'fill', 8) + tx([110, 165], 'V', 'tb') + ln([80, 50], [80, 130], 'a') + ln([150, 50], [140, 130], 'a');
      s += rc(280, 50, 160, 120, 'none2', 4) + '<rect x="330" y="40" width="40" height="20" fill="var(--fg-bg)" stroke="none"/>' + rc(320, 120, 80, 60, 'fill', 8) + tx([360, 155], 'mA', 'tb') + ln([330, 50], [335, 120], 'a') + ln([370, 50], [385, 120], 'a');
      return s + tx([120, 210], 'Puntas a los dos lados del elemento', 'tm') + tx([360, 210], 'Abre el circuito y pasa por el medidor', 'tm');
    } },
    m1rc: { t: 'Carga de un capacitor', d: 'El voltaje sube rápido al principio y cada vez más lento: en τ = R·C llega al 63 %.', w: 480, h: 220, anim: true, draw: t => {
      const X0 = 50, Y0 = 180, W = 400, Hh = 140, tt = (t * 0.6) % 5.5; let s = ln([X0, Y0], [X0 + W, Y0], 'k2') + ln([X0, Y0], [X0, Y0 - Hh - 10], 'k2') + tx([X0 + W, Y0 + 18], 'tiempo', 'tm', 'end') + tx([X0 + 8, 28], 'V', 'tb', 'start');
      const pts = []; for (let i = 0; i <= 100; i++) { const x = i / 100 * 5; pts.push([X0 + x / 5 * W, Y0 - Hh * (1 - Math.exp(-x))]); } s += d.pl(pts, 'm');
      const vis = pts.filter(p => p[0] <= X0 + Math.min(tt, 5) / 5 * W); if (vis.length > 1) s += d.pl(vis, 'a');
      s += ln([X0, Y0 - Hh * 0.632], [X0 + W / 5, Y0 - Hh * 0.632], 'piloto') + ln([X0 + W / 5, Y0], [X0 + W / 5, Y0 - Hh * 0.632], 'piloto') + tx([X0 + W / 5, Y0 + 18], '1τ', 'tb') + tx([X0 + W, Y0 + 34], '5τ ≈ cargado', 'tm', 'end') + tx([X0 + W / 5 + 6, Y0 - Hh * 0.632 - 6], '63 %', 'ta', 'start');
      return s;
    } }
  };
  const figTema = { 'm1-magnitudes': ['m1agua'], 'm1-colores': ['m1colores'], 'm1-serie-paralelo': ['m1seriePar'], 'm1-kirchhoff': ['m1seriePar'], 'm1-multimetro': ['m1multi'], 'm1-rc': ['m1rc'] };

  /* =================== INDUSTRIA, PROYECTO Y PLANEACIÓN =================== */
  const industria = {
    'm1-seguridad': [['Toda planta de la región', 'Antes de trabajar en un equipo se bloquea y etiqueta su energía; el EPP es obligatorio.'], ['Talleres de reparación', 'Los técnicos descargan capacitores y usan pulseras antiestáticas al tocar tarjetas.']],
    'm1-componentes': [['Autos', 'Un auto moderno trae decenas de módulos electrónicos (motor, frenos, bolsas de aire) llenos de estos componentes.'], ['Reparación de electrodomésticos', 'El técnico cambia capacitores, fusibles y relevadores de lavadoras y refrigeradores.']],
    'm1-multimetro': [['Mantenimiento industrial', 'El multímetro es la primera herramienta para encontrar por qué una máquina no arranca.'], ['Instalaciones eléctricas', 'Se mide voltaje y continuidad antes y después de conectar.']],
    'm1-datasheet': [['Compras y mantenimiento', 'Para reemplazar una pieza obsoleta se compara la hoja de datos y se elige un equivalente.'], ['Ingeniería de producto', 'Los diseñadores eligen componentes por sus valores máximos y su costo.']],
    'm1-ohm-watt': [['Tableros eléctricos', 'Con la corriente de la carga se eligen cable, fusible y protecciones.'], ['Iluminación LED', 'Las tiras y lámparas LED llevan resistores o fuentes que limitan la corriente.']]
  };
  const proyecto = { nombre: 'Expediente técnico de un aparato', et: [['desarmado', 'Desarmado y clasificación', ['m1-desarmado']], ['recupera', 'Componentes recuperados', ['m1-desoldar']], ['fichas', 'Fichas técnicas', ['m1-ficha']], ['diagrama', 'Diagrama interpretado', ['m1-diagramas-reales']], ['verifica', 'Verificación con mediciones', ['m1-verificacion']]] };
  const recursos = {
    material: ['Aparatos electrónicos descompuestos para desarmar', 'Resistores, capacitores, LED y diodos surtidos', 'Protoboard y cables de conexión', 'Pilas de 9 V con broche', 'Soldadura, malla desoldadora y pasta para soldar', 'Hojas de datos (datasheet) de los componentes'],
    equipo: ['Multímetros digitales', 'Fuente de poder de CD', 'Cautines de 30 a 40 W con soporte', 'Desarmadores, pinzas de punta y de corte', 'Lentes de seguridad', 'Computadoras con navegador (Tinkercad Circuits y Falstad)', 'Proyector']
  };
  const plan = {
    diag: 'Examen diagnóstico de magnitudes eléctricas, ley de Ohm, componentes y seguridad; mapa de expectativas',
    form: 'Guía de observación durante el desarmado, el desoldado y las mediciones; revisión de tablas y simulaciones',
    sum: 'Diagrama interpretado (rúbrica), verificación de variables eléctricas contra la hoja del fabricante, expediente técnico y examen del parcial',
    practicas: ['Demostrativa: desarmado de un aparato y desoldado de componentes; uso del multímetro con el celular como cámara.', 'Guiada: clasificación de componentes; primer circuito en Tinkercad; mediciones de resistores contra el código de colores.', 'Supervisada: circuitos serie, paralelo y mixto en protoboard comprobando Ohm y Kirchhoff; carga de un capacitor.', 'Autónoma: verificación completa de un circuito: cálculo, simulación, armado, medición y comparación con la hoja de datos.'],
    paec: 'Expediente técnico de un aparato reciclado: desarmado, componentes recuperados, fichas técnicas, diagrama y mediciones',
    paecEvid: 'Expediente técnico (Producto) y verificación del circuito (Desempeño)'
  };

  E.mods.registra('I-1', { temas: temas, clases: clases, banco: banco, gen: gen, ideas: ideas, figs: figs, figTema: figTema, industria: industria, proyecto: proyecto, recursos: recursos, plan: plan });
})();
