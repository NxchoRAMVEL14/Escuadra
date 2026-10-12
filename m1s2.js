/* Escuadra · Módulo I «Construye circuitos electrónicos» · Submódulo 2: Ensambla circuitos electrónicos analógicos (112 h).
   2º parcial de 2º semestre: diodos, fuente de alimentación, regulador, transistor, sensores, 555, amplificador operacional,
   soldadura y circuito impreso. Proyecto: luz intermitente con 555 montada en su propia placa (PCB).
   Programa SEP 2024 (clave 3071300008-23), pp. 17-19 y 26-27; Boylestad y Nashelsky (2009), Lajara y Pelegrí (2013),
   hojas de datos (1N4007, LM7805, 2N2222, NE555, LM358) y NOM-018-STPS-2000 para el manejo de químicos. */
(function () {
  'use strict';
  const E = window.E, H = E.mods.h, f = H.f, pick = H.pick, ops = H.ops;
  const FU = 'Programa SEP 2024, Módulo I, Submódulo 2';
  const ohmTxt = v => v >= 1e6 ? f(v / 1e6, 2) + ' MΩ' : v >= 1000 ? f(v / 1000, 2) + ' kΩ' : f(v, 1) + ' Ω';

  /* =================== TEMAS =================== */
  const temas = [
    {
      id: 'm1-diodo', sm: 'I-2', ac: 'Arma circuitos electrónicos analógicos', titulo: 'El diodo y el LED', dur: '50 min',
      objetivo: 'Que expliquen cómo conduce un diodo, lo prueben con el multímetro y respeten su polaridad.',
      explica: [
        'El diodo es una válvula de un solo sentido: conduce cuando el ánodo es más positivo que el cátodo (polarización directa) y bloquea en sentido contrario (inversa). El cátodo está marcado con una franja.',
        'Al conducir, un diodo de silicio "se come" unos 0.7 V (caída en directa). Un LED es un diodo que ilumina; su caída depende del color: rojo cerca de 2 V, verde 2 a 3 V, azul y blanco cerca de 3 V. Siempre necesita un resistor que limite su corriente.',
        'Diodos comunes: 1N4007 (rectificador de 1 A, hasta 1000 V en inversa) y 1N4148 (señal, rápido y pequeño). El multímetro tiene una función de diodo: en directa marca la caída (≈ 0.5 a 0.7 V) y en inversa marca "OL" (no conduce). Si marca 0 en ambos sentidos, está en corto; si marca OL en ambos, está abierto.'
      ],
      pantalla: ['Ánodo (+) → cátodo (franja): conduce', 'Al revés: bloquea', 'Silicio: cae ≈ 0.7 V al conducir', 'LED: rojo ≈ 2 V · azul/blanco ≈ 3 V · siempre con resistor', 'Prueba: directa ≈ 0.6 V · inversa OL'],
      clave: [['Polarización directa', 'Ánodo más positivo que cátodo: conduce'], ['Polarización inversa', 'Cátodo más positivo: no conduce'], ['Caída en directa (VF)', '≈ 0.7 V en silicio'], ['1N4007', 'Diodo rectificador de 1 A y 1000 V'], ['1N4148', 'Diodo de señal pequeño y rápido'], ['OL', 'Fuera de rango: el multímetro no mide conducción']],
      ejemplo: { titulo: 'Probar un diodo recuperado', pasos: ['Selector en la función de diodo.', 'Roja al ánodo y negra al cátodo (franja): marca 0.58 V.', 'Invertido: marca OL.', 'Conclusión: el diodo está bien.'], resultado: 'Si marca 0.000 en ambos sentidos está en corto y se desecha.' },
      preguntas: [['¿Qué lado del diodo tiene la franja?', 'El cátodo.'], ['¿Cuánto voltaje cae en un diodo de silicio al conducir?', 'Alrededor de 0.7 V.'], ['¿Qué marca el multímetro con un diodo en inversa?', 'OL (no conduce).'], ['¿Por qué el LED necesita resistor?', 'Porque sin él la corriente sube sin control y se quema.']],
      errores: ['Poner el diodo al revés.', 'Conectar un LED sin resistor.', 'Medir diodos dentro del circuito energizado.'],
      vida: 'Cada cargador, fuente y tablero tiene diodos: protegen contra polaridad invertida y convierten CA en CD.',
      ideas: ['m1-diodo-check', 'pr-pausa-predice'], fuente: FU + ' (p. 17); Boylestad y Nashelsky (2009); hojas de datos 1N4007 y 1N4148.'
    },
    {
      id: 'm1-fuente', sm: 'I-2', ac: 'Arma circuitos electrónicos analógicos', titulo: 'Fuente de alimentación: transformador, rectificador y filtro', dur: '50 min',
      objetivo: 'Que expliquen cómo se convierte la corriente alterna del contacto en corriente directa.',
      explica: [
        'Una fuente lineal tiene cuatro etapas: transformador (baja 127 V CA a, por ejemplo, 12 V CA), rectificador (diodos que dejan pasar un solo sentido), filtro (capacitor que alisa) y regulador (mantiene el voltaje fijo).',
        'Con un solo diodo (media onda) se aprovecha medio ciclo; con un puente de 4 diodos (onda completa) se aprovechan los dos. El voltaje pico es Vp = Vrms × 1.41 menos la caída de los diodos: con 12 V CA y puente, Vp ≈ 16.97 − 1.4 ≈ 15.6 V.',
        'El capacitor de filtro se carga en los picos y entrega corriente entre ellos; lo que baja entre picos es el rizo. En onda completa (120 pulsos por segundo en México), el rizo ≈ I / (120 × C). Más capacitancia, menos rizo. El lado de 127 V lo prepara el docente: los alumnos trabajan solo del lado de bajo voltaje.'
      ],
      pantalla: ['Transformador → rectificador → filtro → regulador', 'Media onda: 1 diodo · onda completa: puente de 4', 'Vp = Vrms × 1.41 − caídas de diodos', 'Rizo (onda completa) ≈ I / (120 · C)', 'Más capacitor = menos rizo', 'El lado de 127 V no se toca'],
      clave: [['Rectificar', 'Convertir CA en pulsos de un solo sentido'], ['Puente de diodos', '4 diodos que rectifican onda completa'], ['Filtro', 'Capacitor que alisa el voltaje'], ['Rizo', 'Variación que queda después del filtro'], ['Vrms', 'Valor eficaz que marca el multímetro en CA']],
      ejemplo: { titulo: 'Fuente para 100 mA', pasos: ['Transformador de 12 V CA y puente de diodos.', 'Vp ≈ 12 × 1.41 − 1.4 ≈ 15.6 V.', 'Con C = 1000 µF: rizo ≈ 0.1 / (120 × 0.001) ≈ 0.83 V.', 'Con 2200 µF: rizo ≈ 0.38 V.'], resultado: 'Después, un 7805 deja 5 V fijos.' },
      preguntas: [['¿Cuántos diodos tiene un puente rectificador?', 'Cuatro.'], ['¿Qué hace el capacitor de filtro?', 'Se carga en los picos y alisa el voltaje.'], ['Con 12 V CA y puente, ¿cuál es el voltaje pico aproximado?', 'Unos 15.6 V.'], ['¿Qué pasa con el rizo si duplico el capacitor?', 'Se reduce a la mitad.']],
      errores: ['Medir CA con el selector en CD.', 'Conectar el electrolítico al revés.', 'Que los alumnos manipulen el lado de 127 V.'],
      vida: 'Toda máquina tiene fuentes que alimentan sensores, PLC y tarjetas: cuando fallan, la máquina se detiene. Diagnosticarlas es trabajo diario de mantenimiento.',
      ideas: ['m1-falstad', 'm1-fuente-demo'], fuente: FU + ' (p. 17); Boylestad y Nashelsky (2009).'
    },
    {
      id: 'm1-regulador', sm: 'I-2', ac: 'Arma circuitos electrónicos analógicos', titulo: 'Reguladores de voltaje: Zener y 7805', dur: '50 min',
      objetivo: 'Que obtengan un voltaje fijo con un regulador y calculen su potencia.',
      explica: [
        'Un diodo Zener se conecta en inversa y mantiene un voltaje casi fijo (5.1 V, 9.1 V, 12 V…). Necesita un resistor en serie: R = (Vin − Vz) / (Iz + Icarga). Sirve para cargas pequeñas y referencias.',
        'El regulador de la familia 78xx entrega voltaje fijo positivo: 7805 da 5 V, 7809 da 9 V, 7812 da 12 V, hasta 1 A con disipador. Terminales del 7805 (TO-220, de frente): 1 entrada, 2 tierra, 3 salida. Lleva capacitores a la entrada y a la salida según la hoja de datos.',
        'El regulador "quema" la diferencia de voltaje como calor: P = (Vin − Vout) × I. Con 12 V de entrada y 0.5 A de salida: P = 7 × 0.5 = 3.5 W: necesita disipador. Necesita al menos unos 2 V más en la entrada que en la salida.'
      ],
      pantalla: ['Zener: en inversa, voltaje casi fijo', 'R = (Vin − Vz) / (Iz + Icarga)', '7805 = 5 V · 7809 = 9 V · 7812 = 12 V', '7805: 1 entrada · 2 tierra · 3 salida', 'P = (Vin − Vout) · I → disipador', 'Entrada ≥ salida + 2 V'],
      clave: [['Diodo Zener', 'Diodo que regula trabajando en inversa'], ['Regulador lineal', 'Circuito integrado que entrega voltaje fijo'], ['Disipador', 'Pieza metálica que saca el calor'], ['Dropout', 'Diferencia mínima entre entrada y salida'], ['TO-220', 'Encapsulado con aleta para disipador']],
      ejemplo: { titulo: '¿Necesita disipador?', pasos: ['Entrada 9 V, salida 5 V, carga de 200 mA.', 'P = (9 − 5) × 0.2 = 0.8 W.', 'Sin disipador un TO-220 se calienta bastante con ≈ 1 W.', 'Con 12 V de entrada: P = 1.4 W → mejor ponle disipador.'], resultado: 'Menos voltaje de sobra = menos calor.' },
      preguntas: [['¿Qué voltaje entrega un 7812?', '12 V.'], ['¿Cuál es la terminal de salida del 7805?', 'La 3 (de frente: entrada, tierra, salida).'], ['¿Cómo se conecta un Zener para regular?', 'En inversa, con un resistor en serie.'], ['Con entrada de 12 V, salida de 5 V y 0.3 A, ¿cuánta potencia disipa?', '2.1 W.']],
      errores: ['Invertir entrada y salida del 7805.', 'Olvidar los capacitores de entrada y salida.', 'Usar 7805 con 6 V de entrada (no alcanza).'],
      vida: 'Los sensores industriales de 24 V, las tarjetas de 5 V y los microcontroladores de 3.3 V conviven en una máquina gracias a reguladores.',
      ideas: ['m1-dedo-termometro'], fuente: FU + ' (p. 17); hoja de datos LM7805.'
    },
    {
      id: 'm1-transistor', sm: 'I-2', ac: 'Arma circuitos electrónicos analógicos', titulo: 'El transistor como interruptor', dur: '50 min',
      objetivo: 'Que usen un transistor NPN para encender una carga con una señal pequeña y calculen la resistencia de base.',
      explica: [
        'El transistor bipolar NPN tiene base (B), colector (C) y emisor (E). Una corriente pequeña de base controla una corriente grande de colector: Ic ≈ β · Ib (β o hFE es la ganancia, por ejemplo 100).',
        'Como interruptor trabaja en dos estados: corte (sin corriente de base, apagado) y saturación (con suficiente corriente de base, totalmente encendido; Vce ≈ 0.2 V). Para asegurar la saturación se da más corriente de base de la mínima: Ib = 2 × Ic / β, y Rb = (Vent − 0.7) / Ib.',
        'Para cargas inductivas (relevador, motor) se pone un diodo en antiparalelo con la bobina: al apagar, la bobina genera un pico de voltaje que destruiría al transistor. Transistores comunes: BC547 (100 mA) y 2N2222 (cientos de mA); revisa el pinout en la hoja de datos de tu fabricante.'
      ],
      pantalla: ['Base (B) controla · colector (C) y emisor (E) conducen', 'Ic ≈ β · Ib', 'Corte = apagado · saturación = encendido', 'Ib = 2 · Ic / β → Rb = (Vent − 0.7) / Ib', 'Bobina = diodo de protección', 'Revisa el pinout (cambia por fabricante)'],
      clave: [['NPN', 'Transistor que conduce cuando la base es positiva'], ['β (hFE)', 'Ganancia de corriente'], ['Saturación', 'Totalmente encendido'], ['Corte', 'Totalmente apagado'], ['Diodo de rueda libre', 'Protege al transistor de la bobina'], ['Relevador', 'Interruptor mecánico movido por una bobina']],
      ejemplo: { titulo: 'Relevador de 5 V con 2N2222', pasos: ['Bobina de 70 Ω a 5 V: Ic ≈ 5 / 70 ≈ 71 mA.', 'β mínima = 100 → Ib mínima = 0.71 mA; con margen: 1.4 mA.', 'Rb = (5 − 0.7) / 0.0014 ≈ 3.1 kΩ → comercial menor: 2.7 kΩ.', 'Diodo 1N4007 en antiparalelo con la bobina.'], resultado: 'En la base se elige el comercial menor para que sobre corriente.' },
      preguntas: [['¿Qué terminal del transistor controla la corriente?', 'La base.'], ['¿Qué es la saturación?', 'El estado en que el transistor está totalmente encendido.'], ['¿Por qué se pone un diodo en la bobina del relevador?', 'Para absorber el pico de voltaje al apagar y proteger al transistor.'], ['Si β = 100 e Ic = 50 mA, ¿cuál es la Ib mínima?', '0.5 mA.']],
      errores: ['Conectar la base sin resistor.', 'Olvidar el diodo de protección.', 'Suponer el orden E-B-C sin revisar la hoja de datos.'],
      vida: 'Las salidas de los PLC y microcontroladores no pueden mover motores directamente: un transistor o relevador intermedio es la "etapa de potencia" de cualquier máquina.',
      ideas: ['m1-relevador-motor', 'm1-falstad'], fuente: FU + ' (p. 17); hojas de datos BC547 y 2N2222.'
    },
    {
      id: 'm1-sensores', sm: 'I-2', ac: 'Arma circuitos electrónicos analógicos', titulo: 'Sensores analógicos: LDR, termistor y potenciómetro', dur: '50 min',
      objetivo: 'Que conviertan luz, temperatura o posición en voltaje con un divisor.',
      explica: [
        'Muchos sensores cambian su resistencia: la fotorresistencia (LDR) baja su resistencia con la luz; el termistor NTC la baja con el calor; el potenciómetro cambia según la posición de su perilla.',
        'Para que un circuito "lea" el sensor se usa un divisor de voltaje: el sensor y un resistor fijo en serie. El voltaje del punto medio sube o baja con la luz o la temperatura. Ese voltaje puede activar un transistor, un comparador o la entrada de un microcontrolador.',
        'Con un potenciómetro en lugar del resistor fijo se ajusta el punto de disparo: así una luz nocturna se enciende justo cuando oscurece en ese lugar.'
      ],
      pantalla: ['LDR: más luz → menos resistencia', 'NTC: más calor → menos resistencia', 'Potenciómetro: resistencia según la perilla', 'Sensor + resistor = divisor → voltaje que cambia', 'Potenciómetro para ajustar el disparo'],
      clave: [['LDR', 'Fotorresistencia'], ['NTC', 'Termistor de coeficiente negativo'], ['Potenciómetro', 'Resistor variable de 3 terminales'], ['Punto de disparo', 'Voltaje en el que cambia la salida']],
      ejemplo: { titulo: 'Divisor con LDR a 5 V', pasos: ['Resistor fijo de 10 kΩ arriba y LDR abajo.', 'De día la LDR mide 1 kΩ: V = 5 × 1/11 ≈ 0.45 V.', 'De noche mide 100 kΩ: V = 5 × 100/110 ≈ 4.5 V.', 'Ese cambio enciende un transistor de noche.'], resultado: 'El divisor convierte resistencia en voltaje.' },
      preguntas: [['¿Qué le pasa a una LDR con más luz?', 'Su resistencia baja.'], ['¿Para qué sirve el divisor con el sensor?', 'Para convertir el cambio de resistencia en un voltaje.'], ['¿Qué hace un NTC con el calor?', 'Baja su resistencia.'], ['¿Para qué se usa un potenciómetro en una luz nocturna?', 'Para ajustar el nivel de oscuridad en que se enciende.']],
      errores: ['Conectar la LDR sola sin divisor.', 'Poner el sensor del lado equivocado del divisor (se enciende de día).', 'Olvidar que el potenciómetro tiene 3 terminales.'],
      vida: 'Las líneas de producción están llenas de sensores: detectan piezas, temperatura y posición para que la máquina decida.',
      ideas: ['m1-luz-nocturna'], fuente: FU + ' (p. 17); hojas de datos de LDR y NTC.'
    },
    {
      id: 'm1-555', sm: 'I-2', ac: 'Arma circuitos electrónicos analógicos', titulo: 'El temporizador 555', dur: '50 min',
      objetivo: 'Que armen un 555 astable y calculen su frecuencia.',
      explica: [
        'El 555 es un circuito integrado de 8 terminales que genera pulsos y retardos. Terminales: 1 tierra, 2 disparo, 3 salida, 4 reset, 5 control, 6 umbral, 7 descarga y 8 Vcc. Funciona de 4.5 a 15 V.',
        'En modo astable oscila solo: un capacitor se carga por R1 + R2 y se descarga por R2. Tiempo en alto: 0.693 (R1 + R2) C; en bajo: 0.693 R2 C; frecuencia: f = 1.44 / ((R1 + 2R2) C). Con R1 = 10 kΩ, R2 = 68 kΩ y C = 10 µF da cerca de 1 Hz: un parpadeo por segundo.',
        'En modo monostable da un solo pulso de duración t = 1.1 R C cada vez que se dispara: sirve para temporizar (una luz que se queda prendida unos segundos). La terminal 4 (reset) a tierra lo detiene: así una LDR puede decidir cuándo funciona.'
      ],
      pantalla: ['8 terminales: 1 GND · 3 salida · 4 reset · 8 Vcc', 'Astable: oscila solo', 'f = 1.44 / ((R1 + 2R2) · C)', 'Monostable: un pulso de t = 1.1 · R · C', 'Reset (4) a tierra = detenido'],
      clave: [['Astable', 'Oscila continuamente'], ['Monostable', 'Da un solo pulso al dispararse'], ['Frecuencia', 'Ciclos por segundo (Hz)'], ['Ciclo de trabajo', 'Porcentaje del tiempo en alto'], ['DIP-8', 'Encapsulado de 8 terminales en dos filas']],
      ejemplo: { titulo: 'Intermitente de 1 Hz', pasos: ['R1 = 10 kΩ, R2 = 68 kΩ, C = 10 µF.', 'R1 + 2R2 = 146 kΩ.', 'f = 1.44 / (146 000 × 0.00001) ≈ 0.99 Hz.', 'Alto ≈ 0.54 s y bajo ≈ 0.47 s.'], resultado: 'Para que parpadee el doble de rápido, usa la mitad de C.' },
      preguntas: [['¿Qué terminal del 555 es la salida?', 'La 3.'], ['¿Qué hace el modo astable?', 'Oscila solo, generando pulsos continuos.'], ['Si duplico C, ¿qué pasa con la frecuencia?', 'Se reduce a la mitad.'], ['¿Para qué sirve la terminal 4 (reset)?', 'Si se conecta a tierra detiene el 555.']],
      errores: ['Contar las terminales sin ubicar la muesca.', 'Dejar el reset al aire (conéctalo a Vcc).', 'Usar µF sin convertir a F.'],
      vida: 'Los temporizadores están en semáforos, alarmas, intermitentes de autos y en las secuencias de máquinas: es uno de los circuitos integrados más vendidos de la historia.',
      ideas: ['m1-falstad', 'm1-tinkercad-clase'], fuente: FU + ' (p. 17); hoja de datos NE555.'
    },
    {
      id: 'm1-opamp', sm: 'I-2', ac: 'Arma circuitos electrónicos analógicos', titulo: 'El amplificador operacional como comparador', dur: '50 min',
      objetivo: 'Que usen un amplificador operacional para comparar dos voltajes y activar una alarma.',
      explica: [
        'El amplificador operacional (op-amp) tiene dos entradas, no inversora (+) e inversora (−), y una salida. Amplifica muchísimo la diferencia entre ellas.',
        'Como comparador: si V+ es mayor que V−, la salida se va casi a Vcc; si es menor, casi a 0 V. Con un sensor en una entrada y una referencia (potenciómetro) en la otra, se tiene un detector de luz o de temperatura con disparo ajustable.',
        'El LM358 trae dos operacionales en un DIP-8 y funciona con una sola fuente (3 a 32 V). Como amplificador no inversor, la ganancia es G = 1 + Rf / R1: así se hace más grande la señal pequeña de un sensor.'
      ],
      pantalla: ['Entradas: + (no inversora) y − (inversora)', 'Comparador: V+ > V− → salida alta', 'Sensor en una entrada, referencia en la otra', 'LM358: dos op-amps, una sola fuente', 'No inversor: G = 1 + Rf / R1'],
      clave: [['Op-amp', 'Amplificador operacional'], ['Comparador', 'Decide cuál de dos voltajes es mayor'], ['Referencia', 'Voltaje fijo con el que se compara'], ['Ganancia', 'Cuántas veces se amplifica la señal']],
      ejemplo: { titulo: 'Alarma de temperatura', pasos: ['NTC con resistor de 10 kΩ en divisor → entrada +.', 'Potenciómetro → entrada − (referencia).', 'Cuando se calienta, V+ supera a V− y la salida enciende un LED o un zumbador.', 'Girando el potenciómetro eliges la temperatura de alarma.'], resultado: 'Un sensor + una referencia + un comparador = una decisión.' },
      preguntas: [['¿Qué hace un comparador?', 'Pone su salida en alto o bajo según cuál entrada es mayor.'], ['¿Cuántos operacionales trae el LM358?', 'Dos.'], ['¿Qué ganancia tiene un no inversor con Rf = 9 kΩ y R1 = 1 kΩ?', '10.'], ['¿Para qué sirve el potenciómetro en la alarma?', 'Para ajustar el voltaje de referencia (punto de disparo).']],
      errores: ['Confundir las entradas + y −.', 'Olvidar alimentar el integrado.', 'Esperar que la salida llegue exactamente a Vcc.'],
      vida: 'Los transmisores industriales de temperatura y presión amplifican señales de milivolts con operacionales antes de mandarlas al PLC.',
      ideas: ['m1-falstad'], fuente: FU + ' (p. 17); hoja de datos LM358.'
    },
    {
      id: 'm1-soldadura', sm: 'I-2', ac: 'Monta circuitos electrónicos en placas de circuito impreso', titulo: 'Soldadura blanda segura', dur: '50 min',
      objetivo: 'Que suelden uniones brillantes y firmes con seguridad.',
      explica: [
        'La soldadura electrónica une con una aleación de estaño que se funde a unos 180 a 230 °C (la de plomo-estaño funde antes que la libre de plomo). Trae fundente (flux) adentro que limpia el metal para que el estaño "moje" la unión.',
        'Técnica: punta limpia y estañada; calienta a la vez el pad y la terminal 1 a 2 segundos; acerca el estaño a la unión (no a la punta); retira primero el estaño y luego el cautín. La buena unión es brillante y con forma de volcán. Una soldadura fría se ve opaca y granulada y falla.',
        'Seguridad: el cautín en su soporte, lentes, ventilación (el humo del fundente irrita), no comer en la mesa y lavarse las manos (sobre todo con soldadura de plomo). Corta el sobrante de las terminales sujetándolo para que no salga volando.'
      ],
      pantalla: ['Punta limpia y estañada', 'Calienta pad + terminal 1–2 s', 'El estaño va a la unión, no a la punta', 'Retira estaño, luego cautín', 'Buena: brillante y en volcán · fría: opaca', 'Ventila, lentes y lávate las manos'],
      clave: [['Fundente (flux)', 'Limpia el metal para que el estaño se adhiera'], ['Soldadura fría', 'Unión opaca y débil por falta de calor'], ['Puente', 'Estaño que une dos pads que no deben tocarse'], ['Estañar', 'Cubrir la punta o un cable con estaño'], ['Pad', 'Isla de cobre donde se suelda la terminal']],
      ejemplo: { titulo: 'Soldar un resistor', pasos: ['Dobla las terminales y pásalas por los barrenos.', 'Calienta pad y terminal; acerca el estaño hasta que forme un volcán.', 'Retira estaño y cautín; no muevas la pieza 2 segundos.', 'Corta el sobrante sujetándolo.'], resultado: 'Revisa con lupa: brillante, sin puentes y sin huecos.' },
      preguntas: [['¿Dónde se aplica el estaño: en la punta o en la unión?', 'En la unión (pad y terminal calientes).'], ['¿Cómo se ve una soldadura fría?', 'Opaca y granulada.'], ['¿Qué es un puente de soldadura?', 'Estaño que une dos pads que no deben estar unidos.'], ['¿Por qué hay que ventilar al soldar?', 'Porque el humo del fundente irrita las vías respiratorias.']],
      errores: ['Llevar el estaño en la punta y "untarlo".', 'Mover la pieza antes de que solidifique.', 'Calentar demasiado y levantar la pista.'],
      vida: 'Reparar tarjetas, armar arneses y prototipos exige soldar bien: es una habilidad que se pide en electrónica automotriz y mantenimiento.',
      ideas: ['m1-reto-soldadura'], fuente: FU + ' (p. 19); NOM-017-STPS-2008.'
    },
    {
      id: 'm1-pcb-diseno', sm: 'I-2', ac: 'Monta circuitos electrónicos en placas de circuito impreso', titulo: 'Del esquemático al circuito impreso (PCB)', dur: '50 min',
      objetivo: 'Que diseñen una placa de una cara a partir de un esquemático con software de PCB.',
      explica: [
        'Un circuito impreso (PCB) reemplaza los cables por pistas de cobre sobre una placa aislante. El flujo de trabajo es: esquemático → asignar huellas (la forma física de cada componente) → acomodar → trazar pistas → revisar reglas → imprimir o fabricar.',
        'Reglas para placas hechas en el taller: pistas de al menos 0.8 a 1 mm (las de corriente, más anchas), pads grandes (≈ 2 mm), separación de al menos 0.5 mm y nada de ángulos de 90° muy cerrados. Acomoda primero conectores y componentes grandes y deja cortas las pistas de señal.',
        'KiCad es gratuito y se instala en Windows, Linux y Mac; EasyEDA funciona en el navegador. Ambos revisan errores: ERC en el esquemático (conexiones eléctricas) y DRC en la placa (separaciones y pistas).'
      ],
      pantalla: ['Esquemático → huellas → acomodo → pistas → revisión', 'Pistas ≥ 0.8–1 mm · pads ≈ 2 mm', 'Separación ≥ 0.5 mm', 'Primero conectores y piezas grandes', 'ERC (esquemático) y DRC (placa)'],
      clave: [['PCB', 'Placa de circuito impreso'], ['Huella (footprint)', 'Forma física y pads de un componente'], ['Pista', 'Camino de cobre que une pads'], ['DRC', 'Revisión de reglas de diseño'], ['Una cara', 'Placa con cobre de un solo lado'], ['Borde (Edge.Cuts)', 'Contorno de la placa']],
      ejemplo: { titulo: 'Placa del intermitente', pasos: ['Esquemático con 555, R1, R2, C, 2 LED con sus resistores y conector de pila.', 'Huellas: DIP-8, resistores de 1/4 W, electrolítico radial, LED de 5 mm.', 'Acomodo en 5 × 4 cm con el 555 al centro.', 'Pistas de 1 mm y DRC sin errores.'], resultado: 'Imprime a escala 1:1 y comprueba poniendo las piezas reales encima.' },
      preguntas: [['¿Qué es una huella (footprint)?', 'La forma física y los pads de un componente en la placa.'], ['¿Qué revisa el DRC?', 'Que las pistas y separaciones cumplan las reglas de diseño.'], ['¿Qué ancho mínimo conviene para pistas hechas en el taller?', 'Unos 0.8 a 1 mm.'], ['¿Qué se acomoda primero en la placa?', 'Conectores y componentes grandes.']],
      errores: ['Elegir una huella que no corresponde a la pieza real.', 'Pistas delgadas que se pierden al atacar.', 'Imprimir sin escala 1:1.'],
      vida: 'Las tarjetas de cualquier máquina se diseñaron así; un técnico que entiende un PCB repara siguiendo pistas y sabe pedir una tarjeta nueva.',
      ideas: ['m1-kicad-primera'], fuente: FU + ' (p. 18); Lajara y Pelegrí (2013); documentación de KiCad.'
    },
    {
      id: 'm1-pcb-fab', sm: 'I-2', ac: 'Monta circuitos electrónicos en placas de circuito impreso', titulo: 'Fabricar la placa: transferencia, atacado y perforado', dur: '50 min',
      objetivo: 'Que fabriquen una placa de una cara siguiendo el procedimiento y las medidas de seguridad con químicos.',
      explica: [
        'Método de transferencia de tóner: imprimes las pistas con impresora láser en papel couché, planchas el papel sobre la placa de cobre limpia (el tóner se pasa al cobre), remojas para retirar el papel y retocas con plumón indeleble.',
        'Atacado: en un recipiente de plástico con cloruro férrico, el cobre que no está cubierto se disuelve. Es corrosivo y mancha: guantes de nitrilo, lentes, ventilación y nunca se tira al drenaje; se guarda para reusar o se entrega para su disposición (NOM-018-STPS-2000 pide identificar el peligro de cada sustancia). Luego se quita el tóner con acetona o fibra.',
        'Perforado con broca de 0.8 a 1 mm, con la placa sujeta y lentes. Alternativas: armar sobre placa perforada (sin químicos), mandar fabricar la placa a un servicio o maquinarla con fresadora CNC si el plantel tiene una.'
      ],
      pantalla: ['Imprime 1:1 en láser → plancha → remoja', 'Retoca con plumón indeleble', 'Atacado: cloruro férrico en recipiente de plástico', 'Guantes, lentes, ventilación · nunca al drenaje', 'Perfora con 0.8–1 mm', 'Alternativas: placa perforada, servicio o CNC'],
      clave: [['Transferencia de tóner', 'Pasar la impresión al cobre con calor'], ['Cloruro férrico', 'Químico que disuelve el cobre expuesto'], ['Atacado', 'Quitar el cobre sobrante'], ['Placa perforada', 'Placa con barrenos para armar sin atacado'], ['Hoja de seguridad', 'Documento con los peligros y cuidados de un químico']],
      ejemplo: { titulo: 'Paso a paso en dos sesiones', pasos: ['Sesión 1: limpiar cobre con fibra, planchar 5 a 8 min, remojar y retirar papel, retocar.', 'Atacado de 10 a 20 min moviendo el recipiente (lo hace el equipo con EPP).', 'Enjuagar, quitar tóner, revisar pistas con continuidad.', 'Sesión 2: perforar y soldar.'], resultado: 'Si una pista se corta, se repara con un puente de alambre.' },
      preguntas: [['¿Qué impresora sirve para la transferencia?', 'Una láser (el tóner se transfiere con calor).'], ['¿Por qué no se tira el cloruro férrico al drenaje?', 'Es corrosivo y contamina; se guarda o se entrega para su disposición.'], ['¿Qué EPP se usa en el atacado?', 'Guantes de nitrilo, lentes y ventilación.'], ['¿Qué alternativa hay si no se puede atacar?', 'Armar en placa perforada o mandar fabricar la placa.']],
      errores: ['Cobre sucio: el tóner no se pega.', 'Recipiente metálico (el cloruro lo ataca).', 'Perforar sin sujetar la placa.'],
      vida: 'Los talleres de prototipos y mantenimiento hacen placas rápidas así; en la industria se fabrican igual pero en máquinas.',
      ideas: ['m1-placa-perforada'], fuente: FU + ' (p. 18); NOM-018-STPS-2000; hoja de seguridad del cloruro férrico.'
    },
    {
      id: 'm1-fallas', sm: 'I-2', ac: 'Monta circuitos electrónicos en placas de circuito impreso', titulo: 'Localizar fallas en un circuito', dur: '50 min',
      objetivo: 'Que encuentren fallas con método en lugar de cambiar piezas al azar.',
      explica: [
        'Método: 1) observa (piezas quemadas, al revés, soldaduras frías, puentes); 2) revisa la alimentación (¿llega el voltaje correcto a Vcc y tierra de cada integrado?); 3) sigue la señal etapa por etapa con el multímetro; 4) compara con lo esperado; 5) corrige una cosa a la vez y vuelve a probar.',
        'Fallas típicas: componente polarizado al revés (LED, electrolítico, diodo), integrado girado, pista cortada, puente de soldadura, valor equivocado de resistor, cable en la fila equivocada de la protoboard.',
        'Registra cada falla en la bitácora: síntoma, causa y solución. La siguiente vez la encontrarás en minutos.'
      ],
      pantalla: ['1. Observa · 2. Alimentación · 3. Sigue la señal', '4. Compara con lo esperado · 5. Corrige una cosa a la vez', 'Típicas: polaridad, integrado girado, pista cortada, puente', 'Bitácora: síntoma → causa → solución'],
      clave: [['Síntoma', 'Lo que se observa (no enciende, se calienta)'], ['Causa', 'Lo que realmente falló'], ['Punto de prueba', 'Lugar donde se mide para comparar'], ['Bitácora', 'Registro de fallas y soluciones']],
      ejemplo: { titulo: 'El intermitente no parpadea', pasos: ['Observa: el electrolítico está bien orientado.', 'Alimentación: entre las terminales 8 y 1 del 555 hay 9 V ✔.', 'Terminal 4 (reset): 0 V ✘ → está al aire o a tierra.', 'Se une el 4 a Vcc y parpadea.'], resultado: 'Medir antes de cambiar piezas ahorra tiempo y dinero.' },
      preguntas: [['¿Qué se revisa primero después de observar?', 'Que llegue la alimentación correcta.'], ['Menciona dos fallas típicas al armar.', 'Polaridad invertida, integrado girado, puente de soldadura, pista cortada.'], ['¿Por qué se cambia una sola cosa a la vez?', 'Para saber qué corrigió la falla.'], ['¿Qué se anota en la bitácora?', 'Síntoma, causa y solución.']],
      errores: ['Cambiar piezas al azar.', 'No medir la alimentación.', 'No anotar lo que se hizo.'],
      vida: 'Un técnico de mantenimiento vale por lo rápido que encuentra la causa: el método es lo que se lleva de un equipo a otro.',
      ideas: ['bitacora-fallas', 'galeria-errores'], fuente: FU + ' (pp. 17-19).'
    }
  ];

  /* =================== CLASES =================== */
  const clases = [
    { id: 'm1b-encuadre', h: 3, m: 'a', tipo: 'Encuadre', t: 'Encuadre del 2º parcial y diagnóstico', obj: 'Presentar el proyecto del parcial y saber qué recuerdan del 1er parcial.', ac: null,
      pasos: [[20, 'Encuadre y criterios de evaluación.'], [20, 'El proyecto: luz intermitente con 555 en su propia placa (PCB); muestra uno terminado o un video.'], [60, 'Cuestionario diagnóstico: Ohm, multímetro, componentes y código de colores.'], [30, 'Equipos y lista de material del proyecto.'], [20, 'Dinámica: ¿dónde han visto luces que parpadean? Lluvia de ideas.']],
      ev: 'Cuestionario diagnóstico contestado (Desempeño)', tarea: 'Conseguir por equipo: 555, 2 LED, resistores de 10 kΩ, 68 kΩ y 470 Ω, capacitor de 10 µF, broche de pila de 9 V y una placa fenólica de 5 × 5 cm.', ideas: ['roles-equipo', 'pregunta-reto'], pre: 'diodo · transistor · 555' },
    { id: 'm1b-diodo-c', h: 2, m: 'a', tipo: 'Teoría', t: 'El diodo y el LED', obj: 'Explicar cómo conduce un diodo y probarlo con el multímetro.', ac: 0, dc: 0, tema: 'm1-diodo',
      pasos: [[10, 'Pausa y predice en Falstad: ¿enciende el LED si lo volteo?'], [40, 'Tema en proyector.'], [35, 'Demostración: función diodo del multímetro con piezas recuperadas.'], [15, 'Boleto de salida.']],
      ideas: ['pr-pausa-predice', 'm1-diodo-check'], pre: 'ánodo · cátodo · caída en directa' },
    { id: 'm1b-diodo-lab', h: 2, m: 'a', lugar: 'taller', noComputo: true, tipo: 'Práctica', t: 'Prueba diodos y LED', obj: 'Clasificar diodos buenos, en corto o abiertos y medir la caída de los LED.', ac: 0, dc: 0, tema: 'm1-diodo', dep: ['m1b-diodo-c'],
      pasos: [[10, 'Indicaciones y tabla.'], [55, 'Prueban 6 diodos recuperados y LED de 3 colores con la función diodo.'], [25, 'Arman un LED con resistor y miden la caída en directa de cada color.'], [10, 'Conclusiones.']],
      mat: 'Diodos recuperados, LED de colores, resistores, protoboard, multímetro, pila de 9 V.', ev: 'Tabla de prueba de diodos y LED (Producto)',
      guia: { pasos: [['Función diodo', 'Selector en el símbolo del diodo; punta roja en V/Ω.'], ['Directa', 'Roja al ánodo, negra al cátodo (franja): anota la lectura.'], ['Inversa', 'Invierte las puntas: debe marcar OL.'], ['Diagnóstico', 'Bueno: ≈ 0.5–0.7 V y OL · En corto: 0 en ambos · Abierto: OL en ambos.'], ['LED', 'Arma cada LED con 470 Ω a 9 V y mide su caída con el selector en V⎓.']], tabla: { cab: ['Pieza', 'Directa', 'Inversa', 'Estado'], filas: 8 }, revisa: ['Estado de cada diodo', 'Caída de cada color de LED'], entrega: 'La tabla y la caída de cada color.' },
      ideas: ['m1-diodo-check'], pre: 'función diodo · OL · corto' },
    { id: 'm1b-proyecto', h: 1, m: 'a', tipo: 'Proyecto', t: 'Proyecto: ¿cómo funciona nuestro intermitente?', obj: 'Entender el circuito del proyecto antes de construirlo.', ac: 0, dc: 0, tema: 'm1-555',
      pasos: [[15, 'Proyectas el esquemático del intermitente y lo recorren bloque por bloque.'], [25, 'En equipo: bocetan para qué lo usarían (señal de bicicleta, juguete, aviso) y su caja.'], [10, 'Semáforo de avance.']],
      ideas: ['semaforo'], pre: 'esquemático · bloque · proyecto' },
    { id: 'm1b-fuente-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Fuente de alimentación: de CA a CD', obj: 'Explicar las etapas de una fuente lineal.', ac: 0, dc: 0, tema: 'm1-fuente',
      pasos: [[40, 'Tema en proyector con Falstad (rectificador y filtro animados).'], [40, 'Ejercicios: voltaje pico y rizo.'], [20, 'Boleto de salida.']],
      ideas: ['m1-falstad'], pre: 'rectificador · puente · rizo' },
    { id: 'm1b-fuente-sim', h: 2, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Simula el rectificador y el filtro', obj: 'Comprobar en el simulador la media onda, el puente y el efecto del capacitor.', ac: 0, dc: 1, tema: 'm1-fuente',
      pasos: [[10, 'Cómo abrir los ejemplos de rectificadores en Falstad.'], [60, 'Simulan media onda, puente y filtro con 3 capacitores; anotan voltaje pico y rizo.'], [20, 'Comparan con el cálculo.'], [10, 'Entrega.']],
      ev: 'Tabla de rizo contra capacitancia (Producto)',
      guia: { sw: 'Falstad Circuit Simulator', link: 'https://www.falstad.com/circuit/', pasos: [['Abrir', 'Circuits → Diodes → Half-Wave Rectifier y después Full-Wave Rectifier.'], ['Observar', 'Mira la forma de onda en el osciloscopio de la parte de abajo.'], ['Filtro', 'Agrega un capacitor en paralelo con la carga (clic derecho → Edit para cambiar su valor).'], ['Medir', 'Anota voltaje máximo y mínimo con 100 µF, 470 µF y 1000 µF; rizo = máximo − mínimo.'], ['Comparar', 'Rizo calculado ≈ I / (120 · C) en onda completa.']], tabla: { cab: ['Circuito', 'C', 'V máx.', 'V mín.', 'Rizo'], filas: 6 }, revisa: ['El rizo baja al subir C', 'La onda completa tiene menos rizo que la media onda'], entrega: 'Capturas y tabla.' },
      ideas: ['m1-falstad'], pre: 'osciloscopio · media onda · onda completa' },
    { id: 'm1b-fuente-demo', h: 1, m: 'd', noComputo: true, tipo: 'Práctica', t: 'Demostración: transformador, puente y filtro', obj: 'Ver una fuente real funcionando y medir CA y CD del lado de bajo voltaje.', ac: 0, dc: 2, tema: 'm1-fuente',
      pasos: [[10, 'Seguridad: el lado de 127 V lo conectas tú, aislado y con fusible.'], [30, 'Práctica demostrativa: mides 12 V CA, luego CD con puente y con capacitor (pasan al frente a leer).'], [10, 'Conclusiones en la libreta.']],
      mat: 'Transformador de 127/12 V CA con clavija, fusible y conexiones aisladas (preparado por el docente), puente de diodos, capacitor de 1000 µF a 25 V, multímetro.', ideas: ['m1-fuente-demo'], pre: 'CA · CD · voltaje pico' },
    { id: 'm1b-regulador-c', h: 1, m: 'd', tipo: 'Teoría', t: 'Reguladores: Zener y 7805', obj: 'Calcular un Zener y la potencia de un regulador.', ac: 0, dc: 0, tema: 'm1-regulador',
      pasos: [[30, 'Tema en proyector con la hoja de datos del 7805.'], [15, 'Ejercicios de potencia y disipador.'], [5, 'Boleto de salida.']], pre: 'Zener · 7805 · disipador' },
    { id: 'm1b-regulador-lab', h: 2, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Práctica', t: 'Arma un regulador de 5 V', obj: 'Obtener 5 V fijos con un 7805 y comprobarlos con y sin carga.', ac: 0, dc: 2, tema: 'm1-regulador', dep: ['m1b-regulador-c'],
      pasos: [[10, 'Pinout del 7805 en la hoja de datos.'], [45, 'Arman el regulador alimentado con 9 a 12 V de CD (pila o fuente) y miden la salida.'], [30, 'Agregan carga (LED o resistor de 100 Ω de 1/2 W) y miden voltaje, corriente y temperatura con el dorso del dedo.'], [15, 'Calculan la potencia del regulador y concluyen si necesita disipador.']],
      mat: '7805, capacitores de 0.33 µF y 0.1 µF (o 10 µF), protoboard, pila de 9 V o fuente, resistor de 100 Ω 1/2 W, multímetro.', ev: 'Regulador funcionando con mediciones (Producto)',
      guia: { pasos: [['Pinout', 'De frente (letras hacia ti): 1 entrada, 2 tierra, 3 salida.'], ['Capacitores', '0.33 µF de entrada a tierra y 0.1 µF de salida a tierra, cerca del regulador.'], ['Mide sin carga', 'Entrada y salida con el multímetro.'], ['Con carga', 'Conecta 100 Ω a la salida: I ≈ 50 mA; mide de nuevo.'], ['Potencia', 'P = (Vin − Vout) × I.']], tabla: { cab: ['Condición', 'Vin', 'Vout', 'I', 'P regulador'], filas: [['Sin carga', '', '', '', ''], ['Con 100 Ω', '', '', '', '']] }, revisa: ['Vout ≈ 5 V en ambos casos', 'Potencia calculada'], seguridad: 'El regulador puede calentarse: tócalo con el dorso del dedo y solo un instante.', entrega: 'Tabla y conclusión sobre el disipador.' },
      ideas: ['m1-dedo-termometro'], pre: 'entrada · tierra · salida' },
    { id: 'm1b-transistor-c', h: 2, m: 'd', tipo: 'Teoría', t: 'El transistor como interruptor', obj: 'Explicar corte y saturación y calcular la resistencia de base.', ac: 0, dc: 0, tema: 'm1-transistor',
      pasos: [[10, 'Pregunta-reto: ¿cómo enciende un motor la salida de un celular o un Arduino que da 20 mA?'], [40, 'Tema en proyector.'], [40, 'Ejercicios de Rb para un LED de alto brillo y un relevador.'], [10, 'Boleto de salida.']],
      tarea: 'Busca la hoja de datos del BC547 o del 2N2222 y dibuja su pinout en la libreta.', ideas: ['pregunta-reto'], pre: 'base · colector · emisor · saturación' },
    { id: 'm1b-transistor-sim', h: 2, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Simula el transistor como interruptor', obj: 'Comprobar en el simulador el corte, la saturación y la corriente de base.', ac: 0, dc: 1, tema: 'm1-transistor',
      pasos: [[10, 'Recuerda cómo medir corriente en Tinkercad.'], [50, 'Arman transistor NPN con botón, resistor de base y LED; miden Ib, Ic y Vce encendido y apagado.'], [30, 'Cambian el botón por un divisor con LDR y prueban con la luz del simulador.'], [10, 'Captura y entrega.']],
      ev: 'Simulación del transistor con Ib, Ic y Vce (Producto)',
      guia: { sw: 'Tinkercad Circuits', link: 'https://www.tinkercad.com/circuits', pasos: [['Componentes', 'Fuente o pila de 9 V, transistor NPN, resistor de base de 4.7 kΩ, botón, LED y resistor de 470 Ω.'], ['Base', 'Botón → resistor de base → base del NPN; emisor a tierra.'], ['Carga', '+9 V → 470 Ω → LED → colector.'], ['Mide', 'Corriente de base, corriente de colector y Vce con el botón suelto y apretado.'], ['Sensor', 'Reemplaza el botón por un divisor con fotorresistor y mueve la luz con el control deslizante.']], tabla: { cab: ['Estado', 'Ib', 'Ic', 'Vce'], filas: [['Apagado', '', '', ''], ['Encendido', '', '', '']] }, revisa: ['Ic ≫ Ib', 'Vce cerca de 0.2 V encendido'], entrega: 'Capturas y tabla.' },
      ideas: ['m1-tinkercad-clase'], pre: 'corte · saturación · Vce' },
    { id: 'm1b-transistor-lab', h: 3, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Práctica', t: 'Arma el transistor como interruptor', obj: 'Armar y medir un transistor que enciende una carga y verificarlo contra lo simulado.', ac: 0, dc: 2, tema: 'm1-transistor', dep: ['m1b-transistor-sim'],
      pasos: [[15, 'Revisión del pinout con la hoja de datos (la tarea).'], [70, 'Práctica supervisada: arman el circuito simulado en protoboard y miden Ib, Ic y Vce.'], [45, 'Comparan simulación, cálculo y medición; corrigen fallas.'], [20, 'Coevaluación con la lista de cotejo.']],
      mat: 'BC547 o 2N2222, resistores, LED de alto brillo, botón, protoboard, pila de 9 V, multímetro.', ev: 'Circuito con transistor funcionando y medido (Producto · actividad clave)', ideas: ['coevaluacion'], pre: 'pinout · hFE · interruptor' },
    { id: 'm1b-relevador', h: 2, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Práctica', t: 'Relevador y motor con transistor', obj: 'Controlar un motor de CD con un relevador movido por un transistor, con diodo de protección.', ac: 0, dc: 2, tema: 'm1-transistor', dep: ['m1b-transistor-lab'],
      pasos: [[15, 'Por qué el diodo de rueda libre: demostración en Falstad del pico de voltaje.'], [55, 'Arman relevador de 5 V con transistor, diodo y motor de CD con su propia pila.'], [20, 'Prueban y miden la corriente de la bobina.'], [10, 'Bitácora.']],
      mat: 'Relevador de 5 V, transistor, 1N4007, resistor de base, motor de CD de 3 a 6 V con su pila, protoboard, multímetro.', ev: 'Motor controlado con relevador (Desempeño)', ideas: ['m1-relevador-motor', 'bitacora-fallas'], pre: 'bobina · contacto NA · diodo de rueda libre' },
    { id: 'm1b-sensores-c', h: 1, m: 'd', tipo: 'Teoría', t: 'Sensores: LDR, termistor y potenciómetro', obj: 'Convertir luz o temperatura en voltaje con un divisor.', ac: 0, dc: 0, tema: 'm1-sensores',
      pasos: [[30, 'Tema en proyector; miden una LDR con el multímetro tapándola y destapándola.'], [15, 'Ejercicio: voltaje del divisor de día y de noche.'], [5, 'Boleto de salida.']], pre: 'LDR · NTC · divisor' },
    { id: 'm1b-luz-nocturna', h: 3, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Práctica', t: 'Luz nocturna automática', obj: 'Armar una luz que se enciende sola al oscurecer, con disparo ajustable.', ac: 0, dc: 2, tema: 'm1-sensores', dep: ['m1b-transistor-lab'],
      pasos: [[15, 'Esquemático en el proyector: LDR, potenciómetro, transistor y LED.'], [75, 'Práctica autónoma por equipos: arman, ajustan el potenciómetro y prueban tapando la LDR.'], [40, 'Miden el voltaje de base de día y de noche y lo explican con el divisor.'], [20, 'Galería: cada equipo muestra su luz.']],
      mat: 'LDR, potenciómetro de 100 kΩ, BC547, LED, resistores, protoboard, pila de 9 V, multímetro.', ev: 'Luz nocturna funcionando (Producto)', ideas: ['m1-luz-nocturna'], pre: 'disparo · ajuste · divisor' },
    { id: 'm1b-555-c', h: 2, m: 'd', tipo: 'Teoría', t: 'El temporizador 555', obj: 'Explicar el 555 astable y calcular su frecuencia.', ac: 0, dc: 0, tema: 'm1-555',
      pasos: [[45, 'Tema en proyector.'], [40, 'Ejercicios: frecuencia y tiempos con distintos R y C; ¿qué cambio para que parpadee el doble de rápido?'], [15, 'Boleto de salida.']], pre: 'astable · frecuencia · R1 + 2R2' },
    { id: 'm1b-555-sim', h: 2, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Simula el 555 del proyecto', obj: 'Comprobar en el simulador el intermitente del proyecto y ajustar su frecuencia.', ac: 0, dc: 1, tema: 'm1-555', dep: ['m1b-555-c'],
      pasos: [[10, 'Repaso del pinout del 555.'], [55, 'Arman el intermitente de 2 LED en Tinkercad y miden la frecuencia con el osciloscopio o contando parpadeos.'], [25, 'Ajustan R2 o C para 2 Hz y comparan con el cálculo.'], [10, 'Entrega.']],
      ev: 'Simulación del 555 con frecuencia calculada y medida (Producto)',
      guia: { sw: 'Tinkercad Circuits', link: 'https://www.tinkercad.com/circuits', pasos: [['Integrado', 'Busca «555» en la lista de componentes y colócalo en la protoboard virtual.'], ['Alimentación', '8 y 4 a +9 V; 1 a tierra.'], ['Red RC', 'R1 de 10 kΩ entre 8 y 7; R2 de 68 kΩ entre 7 y 6; une 6 con 2; C de 10 µF de 2 a tierra.'], ['Salida', 'Terminal 3 → 470 Ω → LED → tierra; y +9 V → 470 Ω → LED → terminal 3 (alternan).'], ['Mide', 'Cuenta parpadeos en 30 s o usa el osciloscopio en la terminal 3.']], tabla: { cab: ['R2', 'C', 'f calculada', 'f medida'], filas: [['68 kΩ', '10 µF', '', ''], ['', '', '', '']] }, revisa: ['LED alternando', 'f medida ≈ calculada'], entrega: 'Captura y tabla.' },
      ideas: ['m1-tinkercad-clase'], pre: 'pinout · osciloscopio · Hz' },
    { id: 'm1b-555-proto', h: 3, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Proyecto', t: 'El proyecto en protoboard', obj: 'Armar el intermitente del proyecto en protoboard y verificar su frecuencia.', ac: 0, dc: 2, tema: 'm1-555', dep: ['m1b-555-sim'],
      pasos: [[15, 'Revisan la lista de material y el esquemático.'], [80, 'Arman el intermitente en protoboard copiando su simulación.'], [35, 'Miden la frecuencia con cronómetro y la comparan con la simulada.'], [20, 'Reto opcional: LDR en la terminal 4 para que solo funcione en la oscuridad.']],
      mat: 'El material del proyecto, protoboard, pila de 9 V, multímetro.', ev: 'Circuito del proyecto funcionando en protoboard (Producto · actividad clave)', ideas: ['bitacora-fallas'], pre: 'protoboard · prueba · frecuencia' },
    { id: 'm1b-opamp-c', h: 2, m: 'd', tipo: 'Teoría', t: 'El amplificador operacional como comparador', obj: 'Explicar el comparador y el amplificador no inversor.', ac: 0, dc: 0, tema: 'm1-opamp',
      pasos: [[45, 'Tema en proyector con Falstad.'], [40, 'Ejercicios: ¿cuándo se enciende la alarma? y ganancia del no inversor.'], [15, 'Boleto de salida.']], pre: 'comparador · referencia · ganancia' },
    { id: 'm1b-opamp-sim', h: 2, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Alarma de temperatura simulada', obj: 'Simular un comparador con sensor y referencia ajustable.', ac: 0, dc: 1, tema: 'm1-opamp', dep: ['m1b-opamp-c'],
      pasos: [[10, 'Repaso de las entradas + y −.'], [60, 'Arman en Falstad el comparador con divisor (sensor) y potenciómetro (referencia) y un LED en la salida.'], [20, 'Encuentran el punto de disparo y lo explican.'], [10, 'Entrega.']],
      ev: 'Comparador simulado con punto de disparo (Producto)',
      guia: { sw: 'Falstad Circuit Simulator', link: 'https://www.falstad.com/circuit/', pasos: [['Op-amp', 'Draw → Active Components → Op Amp.'], ['Sensor', 'Divisor de 10 kΩ y un resistor variable (simula la NTC) en la entrada +.'], ['Referencia', 'Potenciómetro entre +5 V y tierra con su cursor en la entrada −.'], ['Salida', 'LED con resistor de 330 Ω a tierra.'], ['Prueba', 'Mueve el resistor variable y el potenciómetro: anota cuándo se enciende el LED.']], revisa: ['El LED enciende cuando V+ > V−', 'El punto de disparo cambia con el potenciómetro'], entrega: 'Captura y explicación.' },
      ideas: ['m1-falstad'], pre: 'V+ · V− · disparo' },
    { id: 'm1b-repaso-medio', h: 1, m: 'd', tipo: 'Evaluación', t: 'Repaso de medio parcial', obj: 'Detectar qué temas necesitan refuerzo.', ac: null,
      pasos: [[35, 'Votación con tarjetas: diodo, fuente, transistor y 555.'], [15, 'Resuelven en el pizarrón las 3 preguntas con más errores.']], ideas: ['pr-plickers'] },
    { id: 'm1b-seleccion', h: 2, m: 'd', tipo: 'Proyecto', t: 'Selección de componentes y lista de materiales', obj: 'Seleccionar los componentes del proyecto con hojas de datos y costo.', ac: 0, dc: 0,
      pasos: [[15, 'Qué datos importan: voltaje máximo del capacitor, potencia de resistores, corriente del LED.'], [60, 'Equipos: lista de materiales con referencia, valor, encapsulado, hoja de datos y precio.'], [15, 'Comparan costos y opciones con menos residuos (economía ecológica).'], [10, 'Entrega.']],
      ev: 'Lista de materiales con especificaciones (Producto)', ideas: ['m1-ficha-tecnica'], pre: 'lista de materiales · especificación · costo' },
    { id: 'm1b-proyecto-sim', h: 2, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Simulación completa del proyecto', obj: 'Comprobar el diseño final en el simulador antes de hacer la placa.', ac: 0, dc: 1, tema: 'm1-555', dep: ['m1b-555-proto'],
      pasos: [[10, 'Lo que cambió en su protoboard respecto a la simulación.'], [60, 'Actualizan la simulación con los valores finales y el reto (LDR) si lo hicieron.'], [20, 'Capturas para la documentación.'], [10, 'Revisión.']],
      ev: 'Simulación final del proyecto (Producto)', pre: 'diseño final · comprobar' },
    { id: 'm1b-soldadura-c', h: 1, m: 'd', tipo: 'Teoría', t: 'Soldadura blanda segura', obj: 'Conocer la técnica de soldadura y sus medidas de seguridad.', ac: 1, dc: 2, tema: 'm1-soldadura',
      pasos: [[30, 'Tema en proyector y demostración con el celular como cámara.'], [15, 'Galería de soldaduras buenas y malas (fotos).'], [5, 'Boleto de salida.']], ideas: ['pr-camara-doc'], pre: 'fundente · volcán · soldadura fría' },
    { id: 'm1b-soldadura-lab', h: 3, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Práctica', t: 'Práctica de soldadura en placa perforada', obj: 'Soldar uniones brillantes y firmes antes de soldar el proyecto.', ac: 1, dc: 2, tema: 'm1-soldadura', dep: ['m1b-soldadura-c'],
      pasos: [[15, 'Seguridad y preparación del cautín.'], [90, 'Práctica guiada y supervisada: 20 uniones (resistores, cables y un LED) en placa perforada.'], [30, 'Inspección con lupa por parejas y repaso de uniones malas.'], [15, 'Limpieza del área y lavado de manos.']],
      mat: 'Cautines con soporte, soldadura con fundente, placa perforada, resistores y cables recuperados, lentes, esponja, lupa.', ev: 'Placa de práctica con 20 uniones (Desempeño)',
      guia: { pasos: [['Prepara', 'Cautín en su soporte, esponja húmeda, punta estañada.'], ['Coloca', 'Pasa las terminales y dóblalas un poco para que no se caigan.'], ['Calienta', 'Toca pad y terminal a la vez 1 a 2 segundos.'], ['Estaño', 'Acércalo a la unión hasta formar un volcán; retíralo y luego el cautín.'], ['Corta', 'Corta el sobrante sujetándolo.'], ['Inspecciona', 'Brillante, sin huecos ni puentes.']], revisa: ['20 uniones brillantes', 'Ningún puente', 'Pads sin levantar'], seguridad: 'Lentes, cabello recogido, cautín siempre en su soporte, ventila el humo y lávate las manos al terminar.', entrega: 'La placa de práctica.' },
      ideas: ['m1-reto-soldadura'], pre: 'pad · puente · estañar' },
    { id: 'm1b-pcb-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Del esquemático al circuito impreso', obj: 'Conocer el flujo de diseño de un PCB y sus reglas básicas.', ac: 1, dc: 0, tema: 'm1-pcb-diseno',
      pasos: [[45, 'Tema en proyector con una placa real en la mano.'], [40, 'Ejercicio en papel: acomodan las piezas del intermitente en 5 × 4 cm y trazan pistas sin cruces.'], [15, 'Boleto de salida.']],
      tarea: 'Instala KiCad en tu casa si tienes computadora (es gratis) o crea tu cuenta de EasyEDA.', ideas: ['m1-kicad-primera'], pre: 'huella · pista · DRC' },
    { id: 'm1b-kicad-0', h: 3, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'KiCad: tu primera placa', obj: 'Dominar el flujo completo de KiCad con un circuito sencillo.', ac: 1, dc: 0, tema: 'm1-pcb-diseno', dep: ['m1b-pcb-c'],
      pasos: [[30, 'Yo diseño, tú diseñas: esquemático de LED con resistor y conector de pila.'], [60, 'Asignan huellas, pasan a la placa, acomodan y trazan pistas de 1 mm.'], [40, 'DRC, borde de la placa y vista 3D.'], [20, 'Guardan el proyecto en su carpeta.']],
      ev: 'Placa sencilla con DRC sin errores (Producto)',
      guia: { sw: 'KiCad', link: 'https://www.kicad.org/', pasos: [['Proyecto', 'Archivo → Nuevo proyecto; abre el Editor de esquemáticos.'], ['Símbolos', 'Tecla A: resistor (R), LED y conector de 2 pines (Conn_01x02).'], ['Cables', 'Tecla W para unir; anota referencias (R1, D1, J1) y valores.'], ['ERC', 'Inspeccionar → Comprobador de reglas eléctricas.'], ['Huellas', 'Asigna huellas: resistor axial, LED de 5 mm y conector.'], ['Placa', 'Abre el Editor de PCB y actualiza desde el esquemático (F8).'], ['Borde', 'Capa Edge.Cuts: dibuja un rectángulo de 3 × 2 cm.'], ['Pistas', 'Tecla X: traza pistas de 1 mm en la capa B.Cu; corre el DRC.']], revisa: ['ERC y DRC sin errores', 'Pistas de 1 mm', 'Borde cerrado'], entrega: 'Captura del PCB y de la vista 3D.' },
      ideas: ['m1-kicad-primera'], pre: 'ERC · huella · Edge.Cuts' },
    { id: 'm1b-kicad-1', h: 3, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'KiCad: esquemático del proyecto', obj: 'Capturar el esquemático del intermitente con referencias, valores y huellas.', ac: 1, dc: 0, tema: 'm1-pcb-diseno', dep: ['m1b-kicad-0'],
      pasos: [[15, 'Revisan su lista de materiales.'], [90, 'Capturan el esquemático completo del intermitente y asignan huellas que coincidan con sus piezas.'], [30, 'ERC y revisión por pares.'], [15, 'Guardan.']],
      ev: 'Esquemático del proyecto con ERC (Producto)', pre: 'símbolo · referencia · valor' },
    { id: 'm1b-kicad-2', h: 3, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'KiCad: diseño de la placa del proyecto', obj: 'Diseñar la placa de una cara del proyecto y prepararla para fabricar.', ac: 1, dc: 0, tema: 'm1-pcb-diseno', dep: ['m1b-kicad-1'],
      pasos: [[15, 'Reglas: pistas de 1 mm, pads de 2 mm, separación de 0.5 mm.'], [90, 'Acomodan, trazan y corren el DRC hasta cero errores.'], [30, 'Imprimen la capa B.Cu a escala 1:1 en papel normal y comprueban con las piezas reales encima.'], [15, 'Guardan el PDF para la transferencia.']],
      ev: 'Diseño de PCB del proyecto con DRC sin errores (Producto · actividad clave)',
      guia: { sw: 'KiCad', link: 'https://www.kicad.org/', pasos: [['Reglas', 'Configuración de la placa → ancho de pista 1 mm y separación 0.5 mm.'], ['Acomodo', 'Conector en una orilla, 555 al centro, LED juntos.'], ['Pistas', 'Solo en B.Cu; evita ángulos de 90° cerrados.'], ['DRC', 'Corrige hasta cero errores.'], ['Graficar', 'Archivo → Trazar: capa B.Cu y Edge.Cuts en PDF, escala 1:1, sin espejo.'], ['Comprueba', 'Imprime y pon el 555 y los LED sobre la hoja: las patitas deben caer en los pads.']], revisa: ['DRC sin errores', 'Escala 1:1 comprobada con piezas', 'Nombre del equipo en el cobre'], entrega: 'PDF de la capa de cobre y captura 3D.' },
      pre: 'acomodo · B.Cu · escala 1:1' },
    { id: 'm1b-pcb-fab-c', h: 1, m: 'd', tipo: 'Teoría', t: 'Fabricar la placa con seguridad', obj: 'Conocer el procedimiento de transferencia y atacado y sus riesgos.', ac: 1, dc: 1, tema: 'm1-pcb-fab',
      pasos: [[30, 'Tema en proyector con la hoja de seguridad del cloruro férrico.'], [15, 'Roles del equipo para la práctica: quién plancha, quién ataca con EPP, quién revisa.'], [5, 'Boleto de salida.']],
      tarea: 'Traer la impresión láser de su placa en papel couché (o la imprimes tú), una placa fenólica limpia y guantes de nitrilo.', pre: 'transferencia · cloruro férrico · hoja de seguridad' },
    { id: 'm1b-pcb-fab', h: 3, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Taller', t: 'Transferencia y atacado de la placa', obj: 'Fabricar la placa del proyecto siguiendo el procedimiento y el EPP.', ac: 1, dc: 1, tema: 'm1-pcb-fab', dep: ['m1b-kicad-2', 'm1b-pcb-fab-c'],
      pasos: [[20, 'Práctica demostrativa: limpieza, planchado y retiro del papel.'], [70, 'Práctica guiada: cada equipo transfiere su diseño y retoca con plumón.'], [45, 'Atacado por turnos con EPP en el área ventilada; enjuague y retiro del tóner.'], [15, 'Guardado del cloruro férrico en su recipiente rotulado y limpieza.']],
      mat: 'Placa fenólica, impresión láser en papel couché, plancha, fibra, plumón indeleble, cloruro férrico, recipiente de plástico, guantes de nitrilo, lentes, acetona.', ev: 'Placa transferida y atacada (Producto)',
      guia: { pasos: [['Limpia', 'Talla el cobre con fibra y agua hasta que brille; no lo toques con los dedos.'], ['Plancha', 'Papel con el tóner hacia el cobre; plancha sin vapor 5 a 8 minutos con presión.'], ['Remoja', 'Deja en agua 10 minutos y retira el papel frotando con el dedo.'], ['Retoca', 'Repara pistas incompletas con plumón indeleble.'], ['Ataca', 'Con guantes y lentes, sumerge en cloruro férrico 10 a 20 minutos moviendo el recipiente.'], ['Enjuaga', 'Enjuaga con agua y quita el tóner con acetona.']], revisa: ['Pistas completas y sin cortos', 'Cloruro guardado en su recipiente rotulado'], seguridad: 'Cloruro férrico: guantes de nitrilo, lentes, ventilación, recipiente de plástico; nunca al drenaje. Si toca la piel, enjuaga con mucha agua.', entrega: 'La placa atacada.' },
      ideas: ['m1-placa-perforada'], pre: 'planchado · atacado · EPP' },
    { id: 'm1b-perforado', h: 2, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Taller', t: 'Perforado y revisión de pistas', obj: 'Perforar la placa y comprobar sus pistas con continuidad.', ac: 1, dc: 1, tema: 'm1-pcb-fab', dep: ['m1b-pcb-fab'],
      pasos: [[15, 'Seguridad con taladro o minitaladro.'], [50, 'Perforan con broca de 0.8 a 1 mm, placa sujeta.'], [25, 'Revisan cada pista con continuidad contra el esquemático y reparan cortes con puente de alambre.'], [10, 'Limpieza.']],
      mat: 'Taladro o minitaladro, brocas de 0.8 y 1 mm, prensa o tornillo de banco, lentes, multímetro.', ev: 'Placa perforada y revisada (Desempeño)', pre: 'broca · continuidad · puente de alambre' },
    { id: 'm1b-ensamble-pcb', h: 3, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Proyecto', t: 'Soldar el proyecto en su placa', obj: 'Montar y soldar los componentes del proyecto en la PCB.', ac: 1, dc: 2, tema: 'm1-soldadura', dep: ['m1b-perforado', 'm1b-soldadura-lab'],
      pasos: [[15, 'Orden de montaje: de lo más bajo a lo más alto (resistores, base del integrado, capacitor, LED, conector).'], [100, 'Sueldan su proyecto; revisan polaridades antes de cada pieza.'], [25, 'Inspección con lupa y continuidad antes de conectar la pila.'], [10, 'Primera prueba.']],
      mat: 'Placa del proyecto, componentes, base DIP-8 para el 555, cautín, soldadura, lupa, multímetro.', ev: 'Circuito montado en placa impresa (Producto · actividad clave)', ideas: ['bitacora-fallas'], pre: 'base DIP · polaridad · inspección' },
    { id: 'm1b-fallas-c', h: 1, m: 'd', tipo: 'Teoría', t: 'Método para localizar fallas', obj: 'Encontrar fallas con método en lugar de cambiar piezas al azar.', ac: 1, dc: 2, tema: 'm1-fallas',
      pasos: [[30, 'Tema en proyector.'], [15, 'El error del día: foto de una placa con 3 fallas escondidas.'], [5, 'Boleto de salida.']], ideas: ['pr-error-del-dia'], pre: 'síntoma · causa · punto de prueba' },
    { id: 'm1b-pruebas', h: 3, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Taller', t: 'Pruebas y corrección de fallas', obj: 'Dejar el proyecto funcionando y documentar las fallas.', ac: 1, dc: 2, tema: 'm1-fallas', dep: ['m1b-ensamble-pcb'],
      pasos: [[100, 'Prueban, miden frecuencia y consumo, y corrigen fallas con el método.'], [35, 'Bitácora: síntoma, causa y solución de cada falla.'], [15, 'Semáforo de avance.']],
      mat: 'Proyecto, multímetro, cautín, malla desoldadora.', ev: 'Bitácora de fallas del proyecto (Producto)', ideas: ['bitacora-fallas', 'semaforo'], pre: 'consumo · frecuencia · bitácora' },
    { id: 'm1b-gabinete', h: 2, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Proyecto', t: 'Gabinete y acabado', obj: 'Proteger la placa en un gabinete funcional.', ac: 1, dc: 1, dep: ['m1b-pruebas'],
      pasos: [[15, 'Medidas de la placa, la pila y los LED.'], [65, 'Hacen su gabinete con material reutilizado (o MDF cortado en la cortadora láser si el plantel la tiene).'], [20, 'Montan y prueban.']],
      mat: 'Cajas reutilizadas, cartón, MDF, pegamento, tornillos M3, broca.', ev: 'Proyecto en su gabinete (Producto)', ideas: ['m1-laser-gabinete'], pre: 'gabinete · montaje · acabado' },
    { id: 'm1b-doc', h: 2, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Documentación técnica del proyecto', obj: 'Reunir esquemático, PCB, lista de materiales, mediciones y fallas en un documento.', ac: 1, dc: 0, dep: ['m1b-kicad-2'],
      pasos: [[10, 'Qué lleva una ficha técnica de producto.'], [70, 'Arman el documento: esquemático, PCB, lista de materiales con costo, mediciones, fallas y fotos.'], [20, 'Revisión cruzada.']],
      ev: 'Documentación técnica del proyecto (Producto)', pre: 'ficha técnica · lista de materiales · costo' },
    { id: 'm1b-ensayo', h: 1, m: 'd', tipo: 'Proyecto', t: 'Ensayo de la exposición', obj: 'Preparar una presentación clara de 5 minutos.', ac: null,
      pasos: [[10, 'Estructura: qué hace, cómo funciona, cómo lo hicimos, qué falló y qué aprendimos.'], [35, 'Ensayan por equipos con retroalimentación de otro equipo.'], [5, 'Orden de pase.']], ideas: ['pr-explica-60'] },
    { id: 'm1b-expo', h: 3, m: 'c', tipo: 'Proyecto', t: 'Exposición de proyectos y pruebas de funcionamiento', obj: 'Demostrar el proyecto funcionando y explicar su diseño.', ac: 1, dc: 2,
      pasos: [[120, 'Cada equipo expone 5 minutos y demuestra su intermitente; preguntas del grupo.'], [30, 'Coevaluación con la lista de cotejo.']],
      ev: 'Exposición y proyecto funcionando (Desempeño)', ideas: ['coevaluacion'] },
    { id: 'm1b-plenaria', h: 1, m: 'c', tipo: 'Evaluación', t: 'Plenaria de resultados', obj: 'Reflexionar sobre lo aprendido al fabricar su placa.', ac: null,
      pasos: [[35, 'Errores más comunes del parcial y cómo los resolvieron.'], [15, 'Dónde se usa esto en la industria.']], ideas: ['industria-real'] },
    { id: 'examen-m1s2', h: 2, m: 'c', tipo: 'Evaluación', t: 'Examen del 2º parcial', obj: 'Evaluar los conocimientos del submódulo.', ac: null,
      pasos: [[10, 'Indicaciones y respiración.'], [80, 'Examen escrito (Escuadra lo arma con los temas que diste).'], [10, 'Cierre.']], ev: 'Examen del parcial', ideas: ['pr-respira'] },
    { id: 'm1b-retro', h: 2, m: 'c', tipo: 'Evaluación', t: 'Retroalimentación y evidencias pendientes', obj: 'Corregir errores del examen y recuperar evidencias.', ac: null,
      pasos: [[30, 'Errores comunes del examen en pantalla, sin nombres.'], [50, 'Recuperación de evidencias.'], [20, 'Revisión de calificaciones.']] },
    { id: 'm1b-meta', h: 1, m: 'c', tipo: 'Formación', t: 'Autoevaluación y meta para el 3er parcial', obj: 'Reflexionar sobre su avance y fijar una meta.', ac: null,
      pasos: [[20, 'Autoevaluación.'], [20, 'Meta para el 3er parcial (electrónica digital).'], [10, 'Muro de logros.']], ideas: ['pr-muro-logros'] }
  ];

  /* =================== BANCO =================== */
  const E12 = [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82];
  const comercialMenor = r => { let best = 10; for (let k = 1; k <= 1e6; k *= 10) for (const b of E12) if (b * k <= r + 1e-9) best = b * k; return best; };
  const gen = {
    m1vpico: rnd => { const V = pick(rnd, [6, 9, 12, 15, 18, 24]), puente = rnd() < 0.6, vp = V * Math.SQRT2 - (puente ? 1.4 : 0.7);
      return { q: 'Un transformador entrega ' + V + ' V CA (rms) a un rectificador de ' + (puente ? 'puente (onda completa)' : 'media onda') + ' con diodos de silicio. ¿Cuál es el voltaje pico aproximado a la salida?', op: ops(f(vp, 1) + ' V', [f(V * Math.SQRT2, 1) + ' V', f(V - 1.4, 1) + ' V', f(V * Math.SQRT2 - (puente ? 0.7 : 1.4), 1) + ' V'], [f(V * 2, 1) + ' V']), r: 'Vp = Vrms × 1.41 − ' + (puente ? '2 diodos × 0.7 = 1.4 V' : '0.7 V') + ' = ' + V + ' × 1.414 − ' + (puente ? '1.4' : '0.7') + ' ≈ ' + f(vp, 1) + ' V.' }; },
    m1rizo: rnd => { const I = pick(rnd, [50, 100, 200, 300, 500]), C = pick(rnd, [470, 1000, 2200, 3300, 4700]), vr = (I / 1000) / (120 * C / 1e6);
      return { q: 'Una fuente de onda completa alimenta ' + I + ' mA con un capacitor de filtro de ' + C + ' µF. ¿Cuánto rizo aproximado tiene? (rizo ≈ I / (120 · C))', op: ops(f(vr, 2) + ' V', [f(vr / 2, 2) + ' V', f(vr * 2, 2) + ' V', f(I / C, 2) + ' V'], [f(vr * 120, 1) + ' V']), r: 'Rizo ≈ ' + f(I / 1000, 3) + ' / (120 × ' + f(C / 1e6, 6) + ') ≈ ' + f(vr, 2) + ' V. Más capacitancia, menos rizo.' }; },
    m1zener: rnd => { const Vin = pick(rnd, [9, 12, 15]), Vz = pick(rnd, [3.3, 5.1, 6.2]), I = pick(rnd, [10, 15, 20, 25]), R = (Vin - Vz) / (I / 1000);
      return { q: 'Un Zener de ' + f(Vz, 1) + ' V se alimenta con ' + Vin + ' V. Si la corriente total (Zener + carga) debe ser ' + I + ' mA, ¿qué resistor en serie se calcula?', op: ops(ohmTxt(R), [ohmTxt(Vin / (I / 1000)), ohmTxt(Vz / (I / 1000)), ohmTxt((Vin + Vz) / (I / 1000))], [ohmTxt(R / 2)]), r: 'R = (Vin − Vz) / I = (' + Vin + ' − ' + f(Vz, 1) + ') / ' + f(I / 1000, 3) + ' = ' + f(R, 1) + ' Ω.' }; },
    m1potreg: rnd => { const Vin = pick(rnd, [9, 12, 15, 18]), Vo = pick(rnd, [5, 5, 9]), I = pick(rnd, [0.1, 0.2, 0.3, 0.5, 0.8]); const vin = Vin <= Vo + 2 ? Vo + 4 : Vin, P = (vin - Vo) * I;
      return { q: 'Un regulador de ' + Vo + ' V recibe ' + vin + ' V y entrega ' + f(I * 1000, 0) + ' mA. ¿Qué potencia disipa en calor?', op: ops(f(P, 2) + ' W', [f(vin * I, 2) + ' W', f(Vo * I, 2) + ' W', f((vin - Vo) / I, 2) + ' W'], [f(P * 2, 2) + ' W', f(P / 2, 2) + ' W', f((vin + Vo) * I, 2) + ' W', f(P + 1, 2) + ' W']), r: 'P = (Vin − Vout) × I = (' + vin + ' − ' + Vo + ') × ' + f(I, 2) + ' = ' + f(P, 2) + ' W.' + (P > 1 ? ' Necesita disipador.' : '') }; },
    m1rbase: rnd => { const Vin = pick(rnd, [3.3, 5, 9]), Ic = pick(rnd, [20, 50, 70, 100, 150]), beta = pick(rnd, [50, 100, 150]), Ib = 2 * Ic / beta, R = (Vin - 0.7) / (Ib / 1000), rc = comercialMenor(R);
      return { q: 'Un transistor NPN (β = ' + beta + ') debe saturar con Ic = ' + Ic + ' mA. La señal de control es de ' + f(Vin, 1) + ' V. Con Ib = 2·Ic/β, ¿qué resistor de base comercial (E12, el menor más cercano) usas?', op: ops(ohmTxt(rc), [ohmTxt(comercialMenor(Vin / (Ic / 1000))), ohmTxt(comercialMenor(R * 4)), ohmTxt(comercialMenor((Vin - 0.7) / (Ic / 1000)))], [ohmTxt(comercialMenor(R / 4)), ohmTxt(comercialMenor(R * 10))]), r: 'Ib = 2 × ' + Ic + ' / ' + beta + ' = ' + f(Ib, 2) + ' mA; Rb = (' + f(Vin, 1) + ' − 0.7) / ' + f(Ib / 1000, 5) + ' ≈ ' + f(R, 0) + ' Ω → comercial menor: ' + ohmTxt(rc) + '.' }; },
    m1f555: rnd => { const R1 = pick(rnd, [1000, 4700, 10000]), R2 = pick(rnd, [10000, 22000, 47000, 68000, 100000]), C = pick(rnd, [1, 4.7, 10, 22]), fr = 1.44 / ((R1 + 2 * R2) * C / 1e6);
      return { q: '¿Qué frecuencia tiene un 555 astable con R1 = ' + ohmTxt(R1) + ', R2 = ' + ohmTxt(R2) + ' y C = ' + f(C, 1) + ' µF? (f = 1.44 / ((R1 + 2R2)·C))', op: ops(f(fr, 2) + ' Hz', [f(1.44 / ((R1 + R2) * C / 1e6), 2) + ' Hz', f(fr * 2, 2) + ' Hz', f(fr / 10, 3) + ' Hz'], [f(fr * 10, 1) + ' Hz']), r: 'f = 1.44 / ((' + R1 + ' + 2×' + R2 + ') × ' + f(C / 1e6, 7) + ') ≈ ' + f(fr, 2) + ' Hz.' }; },
    m1ldr: rnd => { const V = pick(rnd, [5, 9, 12]), Rf = pick(rnd, [4700, 10000, 22000]), Rl = pick(rnd, [500, 1000, 2000, 50000, 100000, 200000]), Vo = V * Rl / (Rl + Rf);
      return { q: 'Divisor con resistor fijo de ' + ohmTxt(Rf) + ' arriba y una LDR abajo, a ' + V + ' V. Si la LDR mide ' + ohmTxt(Rl) + ', ¿cuánto voltaje hay en la LDR?', op: ops(f(Vo, 2) + ' V', [f(V * Rf / (Rl + Rf), 2) + ' V', f(V / 2, 2) + ' V', f(V * Rl / Rf, 2) + ' V'], [f(Vo / 3, 2) + ' V', f(V - Vo / 2, 2) + ' V']), r: 'V = ' + V + ' × ' + Rl + ' / (' + Rl + ' + ' + Rf + ') = ' + f(Vo, 2) + ' V. ' + (Rl > Rf ? 'Poca luz: voltaje alto.' : 'Mucha luz: voltaje bajo.') }; },
    m1ganancia: rnd => { const R1 = pick(rnd, [1000, 2200, 4700, 10000]), k = pick(rnd, [1, 2, 4, 9, 10, 22]), Rf = R1 * k, G = 1 + Rf / R1, vin = pick(rnd, [0.1, 0.2, 0.25, 0.5]);
      return { q: 'Un amplificador no inversor tiene R1 = ' + ohmTxt(R1) + ' y Rf = ' + ohmTxt(Rf) + '. Si la entrada es ' + f(vin, 2) + ' V, ¿cuál es la salida?', op: ops(f(G * vin, 2) + ' V', [f(Rf / R1 * vin, 2) + ' V', f(vin, 2) + ' V', f(G * vin * 2, 2) + ' V'], [f((G + 1) * vin, 2) + ' V']), r: 'G = 1 + Rf / R1 = 1 + ' + k + ' = ' + G + '; Vsal = ' + G + ' × ' + f(vin, 2) + ' = ' + f(G * vin, 2) + ' V.' }; }
  };
  const banco = [
    { id: 'm1b1', tema: 'm1-diodo', tipo: 'om', niv: 1, q: '¿Qué lado del diodo está marcado con una franja?', op: ['El cátodo', 'El ánodo', 'La base', 'El colector'] },
    { id: 'm1b2', tema: 'm1-diodo', tipo: 'om', niv: 1, q: '¿Cuánto voltaje cae, aproximadamente, en un diodo de silicio que conduce?', op: ['0.7 V', '5 V', '0 V', '12 V'] },
    { id: 'm1b3', tema: 'm1-diodo', tipo: 'om', niv: 2, q: 'Con la función diodo, un diodo marca 0.000 en ambos sentidos. Está…', op: ['En corto', 'Bueno', 'Abierto', 'Al revés'] },
    { id: 'm1b4', tema: 'm1-diodo', tipo: 'vf', niv: 1, q: 'Un LED puede conectarse directo a una pila de 9 V sin resistor.', v: false, exp: 'Necesita un resistor que limite la corriente o se quema.' },
    { id: 'm1b5', tema: 'm1-diodo', tipo: 'om', niv: 2, q: '¿Qué color de LED tiene mayor caída de voltaje?', op: ['Azul o blanco', 'Rojo', 'Infrarrojo', 'Todos igual'] },
    { id: 'm1b6', tema: 'm1-diodo', tipo: 'ab', niv: 2, q: 'Explica cómo pruebas un diodo con el multímetro y cómo sabes si está bueno.', r: 'Función diodo: en directa (roja al ánodo) marca ≈ 0.5–0.7 V y en inversa OL. Si marca 0 en ambos está en corto; OL en ambos, abierto.' },
    { id: 'm1b7', tema: 'm1-fuente', tipo: 'om', niv: 1, q: '¿Cuántos diodos tiene un puente rectificador?', op: ['4', '1', '2', '8'] },
    { id: 'm1b8', tema: 'm1-fuente', tipo: 'om', niv: 2, q: '¿Qué hace el capacitor de filtro de una fuente?', op: ['Alisa el voltaje cargándose en los picos', 'Sube el voltaje', 'Convierte CD en CA', 'Limita la corriente de los LED'] },
    { id: 'm1b9', tema: 'm1-fuente', tipo: 'calc', niv: 3, gen: 'm1vpico' },
    { id: 'm1b10', tema: 'm1-fuente', tipo: 'calc', niv: 3, gen: 'm1rizo' },
    { id: 'm1b11', tema: 'm1-fuente', tipo: 'vf', niv: 2, q: 'En el taller, los alumnos conectan y manipulan el lado de 127 V del transformador.', v: false, exp: 'El lado de 127 V lo prepara el docente, aislado y con fusible; se trabaja del lado de bajo voltaje.' },
    { id: 'm1b12', tema: 'm1-fuente', tipo: 'om', niv: 1, q: 'Orden de las etapas de una fuente lineal:', op: ['Transformador, rectificador, filtro y regulador', 'Filtro, transformador, regulador y rectificador', 'Regulador, filtro, rectificador y transformador', 'Rectificador, regulador, transformador y filtro'] },
    { id: 'm1b13', tema: 'm1-regulador', tipo: 'om', niv: 1, q: '¿Qué voltaje entrega un 7809?', op: ['9 V', '78 V', '7.8 V', '0.9 V'] },
    { id: 'm1b14', tema: 'm1-regulador', tipo: 'om', niv: 2, q: 'Visto de frente, las terminales del 7805 son…', op: ['1 entrada, 2 tierra, 3 salida', '1 salida, 2 entrada, 3 tierra', '1 tierra, 2 salida, 3 entrada', 'Da igual el orden'] },
    { id: 'm1b15', tema: 'm1-regulador', tipo: 'calc', niv: 3, gen: 'm1potreg' },
    { id: 'm1b16', tema: 'm1-regulador', tipo: 'calc', niv: 3, gen: 'm1zener' },
    { id: 'm1b17', tema: 'm1-regulador', tipo: 'vf', niv: 2, q: 'Un 7805 funciona bien con 5.5 V de entrada.', v: false, exp: 'Necesita al menos unos 2 V más que la salida (≈ 7 V).' },
    { id: 'm1b18', tema: 'm1-transistor', tipo: 'om', niv: 1, q: '¿Qué terminal del transistor recibe la señal de control?', op: ['Base', 'Colector', 'Emisor', 'Ánodo'] },
    { id: 'm1b19', tema: 'm1-transistor', tipo: 'om', niv: 2, q: 'Un transistor totalmente encendido está en…', op: ['Saturación', 'Corte', 'Inversa', 'Reposo'] },
    { id: 'm1b20', tema: 'm1-transistor', tipo: 'calc', niv: 3, gen: 'm1rbase' },
    { id: 'm1b21', tema: 'm1-transistor', tipo: 'om', niv: 2, q: '¿Para qué se pone un diodo en paralelo con la bobina de un relevador?', op: ['Para absorber el pico de voltaje al apagar', 'Para que encienda más rápido', 'Para medir la corriente', 'Para invertir el giro del motor'] },
    { id: 'm1b22', tema: 'm1-transistor', tipo: 'ab', niv: 3, q: '¿Por qué una salida de microcontrolador no puede encender un motor directamente y cómo lo resuelves?', r: 'La salida da poca corriente (≈ 20 mA) y el motor pide cientos de mA; se usa un transistor o relevador como etapa de potencia, con diodo de protección.' },
    { id: 'm1b23', tema: 'm1-sensores', tipo: 'om', niv: 1, q: '¿Qué le pasa a la resistencia de una LDR con más luz?', op: ['Baja', 'Sube', 'No cambia', 'Se invierte'] },
    { id: 'm1b24', tema: 'm1-sensores', tipo: 'calc', niv: 3, gen: 'm1ldr' },
    { id: 'm1b25', tema: 'm1-sensores', tipo: 'om', niv: 2, q: 'Un termistor NTC con más calor…', op: ['Baja su resistencia', 'Sube su resistencia', 'Genera voltaje', 'Emite luz'] },
    { id: 'm1b26', tema: 'm1-sensores', tipo: 'vf', niv: 2, q: 'El potenciómetro de una luz nocturna sirve para ajustar el nivel de oscuridad en que se enciende.', v: true, exp: 'Cambia el divisor y con ello el punto de disparo.' },
    { id: 'm1b27', tema: 'm1-555', tipo: 'om', niv: 1, q: '¿Qué terminal del 555 es la salida?', op: ['3', '8', '1', '4'] },
    { id: 'm1b28', tema: 'm1-555', tipo: 'calc', niv: 3, gen: 'm1f555' },
    { id: 'm1b29', tema: 'm1-555', tipo: 'om', niv: 2, q: 'Si duplicas el capacitor de un 555 astable, la frecuencia…', op: ['Se reduce a la mitad', 'Se duplica', 'No cambia', 'Se hace cero'] },
    { id: 'm1b30', tema: 'm1-555', tipo: 'om', niv: 2, q: '¿Qué modo del 555 da un solo pulso cada vez que se dispara?', op: ['Monostable', 'Astable', 'Biestable', 'Rectificador'] },
    { id: 'm1b31', tema: 'm1-555', tipo: 'vf', niv: 2, q: 'Si la terminal 4 (reset) del 555 se conecta a tierra, el circuito se detiene.', v: true, exp: 'Por eso normalmente va a Vcc.' },
    { id: 'm1b32', tema: 'm1-opamp', tipo: 'om', niv: 2, q: 'En un comparador, si V+ es mayor que V−, la salida…', op: ['Se va a alto (cerca de Vcc)', 'Se va a 0 V', 'Se queda a la mitad', 'Oscila'] },
    { id: 'm1b33', tema: 'm1-opamp', tipo: 'calc', niv: 3, gen: 'm1ganancia' },
    { id: 'm1b34', tema: 'm1-opamp', tipo: 'om', niv: 1, q: '¿Cuántos amplificadores operacionales trae el LM358?', op: ['2', '1', '4', '8'] },
    { id: 'm1b35', tema: 'm1-opamp', tipo: 'ab', niv: 2, q: 'Describe una alarma de temperatura con un comparador: qué va en cada entrada y qué hace la salida.', r: 'Divisor con NTC en una entrada, potenciómetro (referencia) en la otra; cuando el sensor pasa la referencia, la salida cambia y enciende un LED o zumbador.' },
    { id: 'm1b36', tema: 'm1-soldadura', tipo: 'om', niv: 1, q: '¿Dónde se acerca el estaño al soldar?', op: ['A la unión caliente (pad y terminal)', 'A la punta del cautín', 'Al cable del cautín', 'A la esponja'] },
    { id: 'm1b37', tema: 'm1-soldadura', tipo: 'om', niv: 2, q: 'Una soldadura fría se ve…', op: ['Opaca y granulada', 'Brillante y en volcán', 'Transparente', 'Azul'] },
    { id: 'm1b38', tema: 'm1-soldadura', tipo: 'vf', niv: 1, q: 'Al soldar conviene ventilar y lavarse las manos al terminar.', v: true, exp: 'El humo del fundente irrita y algunas soldaduras tienen plomo.' },
    { id: 'm1b39', tema: 'm1-soldadura', tipo: 'om', niv: 2, q: '¿Qué es un puente de soldadura?', op: ['Estaño que une dos pads que no deben tocarse', 'Un cable de reparación', 'Una herramienta para desoldar', 'Una soldadura bien hecha'] },
    { id: 'm1b40', tema: 'm1-pcb-diseno', tipo: 'om', niv: 1, q: '¿Qué es una huella (footprint)?', op: ['La forma física y los pads de un componente en la placa', 'El símbolo en el esquemático', 'La hoja de datos', 'El valor del componente'] },
    { id: 'm1b41', tema: 'm1-pcb-diseno', tipo: 'om', niv: 2, q: '¿Qué revisa el DRC?', op: ['Que pistas y separaciones cumplan las reglas', 'Que los símbolos estén conectados', 'El precio de la placa', 'La frecuencia del circuito'] },
    { id: 'm1b42', tema: 'm1-pcb-diseno', tipo: 'om', niv: 2, q: 'Para placas hechas en el taller conviene que las pistas midan al menos…', op: ['0.8 a 1 mm', '0.1 mm', '5 mm', '0.01 mm'] },
    { id: 'm1b43', tema: 'm1-pcb-diseno', tipo: 'ab', niv: 2, q: 'Escribe en orden los pasos para diseñar un PCB en KiCad.', r: 'Esquemático, ERC, asignar huellas, pasar a la placa, borde, acomodo, pistas, DRC, graficar a escala 1:1.' },
    { id: 'm1b44', tema: 'm1-pcb-fab', tipo: 'om', niv: 1, q: '¿Qué impresora sirve para la transferencia de tóner?', op: ['Láser', 'De inyección de tinta', 'Térmica', 'De matriz de puntos'] },
    { id: 'm1b45', tema: 'm1-pcb-fab', tipo: 'om', niv: 2, q: '¿Qué se hace con el cloruro férrico usado?', op: ['Se guarda rotulado o se entrega para su disposición', 'Se tira al drenaje', 'Se tira a la basura', 'Se evapora al sol'] },
    { id: 'm1b46', tema: 'm1-pcb-fab', tipo: 'vf', niv: 1, q: 'El atacado con cloruro férrico se hace en un recipiente metálico.', v: false, exp: 'En plástico: el cloruro ataca los metales.' },
    { id: 'm1b47', tema: 'm1-pcb-fab', tipo: 'om', niv: 2, q: 'Una alternativa para armar un circuito sin atacar una placa es…', op: ['La placa perforada', 'La protoboard soldada', 'El papel couché', 'La cinta aislante'] },
    { id: 'm1b48', tema: 'm1-fallas', tipo: 'om', niv: 2, q: 'Después de observar el circuito, lo primero que se mide es…', op: ['La alimentación (Vcc y tierra)', 'La frecuencia', 'La temperatura del cuarto', 'El color de los cables'] },
    { id: 'm1b49', tema: 'm1-fallas', tipo: 'om', niv: 1, q: '¿Por qué se cambia una sola cosa a la vez al corregir?', op: ['Para saber qué corrigió la falla', 'Para terminar más rápido', 'Porque lo pide la norma', 'Para gastar menos estaño'] },
    { id: 'm1b51', tema: 'm1-fallas', tipo: 'om', niv: 2, q: 'Un LED de tu placa no enciende pero el otro sí. ¿Qué revisas primero?', op: ['Su polaridad y su soldadura', 'El regulador de la fuente', 'El valor del capacitor de 10 µF', 'Cambiar el 555'] },
    { id: 'm1b50', tema: 'm1-fallas', tipo: 'ab', niv: 3, q: 'Tu intermitente no enciende ningún LED. Escribe 4 cosas que revisarías en orden.', r: 'Observar polaridades y soldaduras; medir 9 V entre las terminales 8 y 1 del 555; revisar que la 4 esté a Vcc; medir la salida (3) y los LED con sus resistores.' }
  ];

  /* =================== IDEAS =================== */
  const ideas = [
    { id: 'm1-diodo-check', titulo: 'Clínica de diodos recuperados', sm: ['I-2'], tipo: 'Práctica', dur: '30 min', costo: '$0', obj: 'Probar y clasificar diodos recuperados para reutilizarlos.', mat: ['Diodos recuperados del 1er parcial', 'Multímetros'],
      pasos: ['Cada pareja prueba 6 diodos.', 'Los buenos van a la caja del grupo; los dañados a reciclaje.', 'Anotan el número impreso y buscan qué tipo es.', 'Cuentan cuántos rescataron.'], evid: 'Tabla de diodos', tip: 'Así el grupo junta su propio inventario y ahorra en el proyecto.' },
    { id: 'm1-fuente-demo', titulo: 'Fuente por etapas en el proyector', sm: ['I-2'], tipo: 'Proyector', dur: '20 min', costo: 'Bajo', obj: 'Ver cada etapa de una fuente sin que los alumnos toquen 127 V.', mat: ['Transformador preparado con fusible', 'Puente de diodos', 'Capacitor', 'Multímetro', 'Celular como cámara'],
      pasos: ['Mide CA a la salida del transformador.', 'Agrega el puente: mide CD (pulsante).', 'Agrega el capacitor: el voltaje sube y se alisa.', 'Compara con la simulación de Falstad.'], evid: 'Esquema de etapas en la libreta', tip: 'Fija el transformador a una tabla con sus conexiones de 127 V cubiertas con termofit: es tu fuente de demostración para varios semestres.' },
    { id: 'm1-dedo-termometro', titulo: '¿Cuánto se calienta el regulador?', sm: ['I-2'], tipo: 'Práctica', dur: '15 min', costo: 'Bajo', obj: 'Relacionar la potencia calculada con el calor real.', mat: ['7805', 'Resistores de carga', 'Termómetro infrarrojo si hay'],
      pasos: ['Calculen la potencia con 9 V y con 12 V de entrada.', 'Midan la temperatura (o tóquenlo con el dorso del dedo un instante).', 'Agreguen un disipador y repitan.', 'Concluyan cuándo es necesario.'], evid: 'Tabla potencia contra temperatura', tip: 'Si hay termómetro infrarrojo, es el mejor puente con el mantenimiento predictivo del 6º semestre.' },
    { id: 'm1-relevador-motor', titulo: 'El relevador que enciende un motor', sm: ['I-2'], tipo: 'Práctica', dur: '50 min', costo: 'Bajo', obj: 'Separar la parte de control (5 V) de la de potencia (motor).', mat: ['Relevador de 5 V', 'Transistor', '1N4007', 'Motor de CD con pila'],
      pasos: ['Arma primero sin motor y escucha el clic.', 'Agrega el diodo de rueda libre.', 'Conecta el motor en el contacto NA con su propia pila.', 'Explica qué parte es control y cuál es potencia.'], evid: 'Diagrama control/potencia', tip: 'Es la misma idea que un PLC con relevadores de interfaz: lo verán en 4º semestre.' },
    { id: 'm1-luz-nocturna', titulo: 'Luz nocturna con LDR', sm: ['I-2'], tipo: 'Práctica', dur: '2 h', costo: 'Bajo', obj: 'Primer circuito «que decide solo»: sensor, transistor y carga.', mat: ['LDR', 'Potenciómetro de 100 kΩ', 'BC547', 'LED', 'Resistores'],
      pasos: ['Divisor con LDR y potenciómetro a la base (con resistor).', 'LED con resistor en el colector.', 'Ajusta el potenciómetro hasta que encienda al tapar la LDR.', 'Mide el voltaje de base de día y de noche.'], evid: 'Luz funcionando y mediciones', tip: 'Si el LED queda «medio encendido», el transistor no satura: baja el resistor de base o ajusta el divisor.' },
    { id: 'm1-reto-soldadura', titulo: 'Reto de las 20 soldaduras', sm: ['I-2'], tipo: 'Práctica', dur: '60 min', costo: 'Bajo', obj: 'Practicar soldadura antes de tocar el proyecto.', mat: ['Placa perforada', 'Resistores y cables recuperados'],
      pasos: ['20 uniones por alumno.', 'Su pareja revisa con lupa y marca las malas.', 'Rehace las malas.', 'Gana el equipo con más uniones perfectas.'], evid: 'Placa de práctica', tip: 'Usa componentes recuperados del 1er parcial: practicar no cuesta.' },
    { id: 'm1-kicad-primera', titulo: 'KiCad en 3 horas: LED, resistor y conector', sm: ['I-2'], tipo: 'Proyector', dur: '3 h', costo: '$0', obj: 'Aprender el flujo completo antes del proyecto.', mat: ['Computadoras con KiCad', 'Proyector'],
      pasos: ['Yo diseño, tú diseñas, paso por paso.', 'ERC, huellas, placa, pistas y DRC.', 'Vista 3D para motivar.', 'Guardar en una carpeta con el nombre del equipo.'], evid: 'Captura del PCB', link: 'https://www.kicad.org/', tip: 'Instala KiCad en las computadoras antes del parcial; si no se puede, EasyEDA funciona en el navegador.' },
    { id: 'm1-placa-perforada', titulo: 'Plan B: placa perforada', sm: ['I-2'], tipo: 'Práctica', dur: '2 h', costo: 'Bajo', obj: 'Montar el circuito en placa perforada si no se puede atacar.', mat: ['Placa perforada con tiras o islas', 'Alambre de cobre'],
      pasos: ['Dibuja el acomodo en papel cuadriculado.', 'Coloca y suelda las piezas.', 'Une con alambre o puentes de estaño.', 'Revisa continuidad contra el esquemático.'], evid: 'Circuito en placa perforada', tip: 'Cumple con la actividad clave de montar en placa; el diseño en KiCad se hace igual.' },
    { id: 'm1-laser-gabinete', titulo: 'Gabinete cortado en láser', sm: ['I-2', 'I-3'], tipo: 'Práctica', dur: '2 h', costo: 'Bajo', obj: 'Unir el diseño electrónico con la fabricación digital.', mat: ['MDF de 3 mm', 'Cortadora láser', 'Generador de cajas en línea (por ejemplo, boxes.py)'],
      pasos: ['Miden placa, pila y LED.', 'Generan una caja con uniones de dedos y agregan los barrenos.', 'El docente corta (los alumnos observan con la tapa cerrada).', 'Arman y montan.'], evid: 'Proyecto en su gabinete', link: 'https://boxes.hackerspace-bamberg.de/', tip: 'La cortadora solo la opera quien está capacitado; nunca se deja sola mientras corta.' }
  ];

  /* =================== FIGURAS =================== */
  const d = E.fig.d, ln = d.ln, ci = d.ci, rc = d.rc, tx = d.tx, pg = d.pg, path = d.path, fl = d.flecha;
  const onda = (x0, y0, w, a, fn, cls) => { const pts = []; for (let i = 0; i <= 120; i++) { const x = i / 120; pts.push([x0 + x * w, y0 - a * fn(x * 4 * Math.PI)]); } return d.pl(pts, cls || 'a'); };
  const figs = {
    m1rect: { t: 'Rectificador y filtro', d: 'CA del transformador, onda completa con el puente y casi plana con el capacitor (el rizo es lo que baja).', w: 480, h: 230, anim: false, draw: () => {
      let s = tx([80, 22], '1. CA (transformador)', 'tm') + ln([10, 60], [150, 60], 'm') + onda(10, 60, 140, 32, Math.sin, 'a');
      s += tx([240, 22], '2. Puente: onda completa', 'tm') + ln([170, 90], [310, 90], 'm') + onda(170, 90, 140, 32, x => Math.abs(Math.sin(x)), 'b');
      s += tx([400, 22], '3. Con capacitor', 'tm') + ln([330, 90], [470, 90], 'm');
      const pts = []; for (let i = 0; i <= 120; i++) { const x = i / 120, ph = (x * 4) % 1, v = ph < 0.3 ? Math.max(0.82, Math.abs(Math.sin(x * 4 * Math.PI))) : 1 - (ph - 0.3) * 0.18 / 0.7; pts.push([330 + x * 140, 90 - 32 * Math.min(1, v)]); }
      s += d.pl(pts, 'a') + tx([400, 110], 'rizo', 'ta');
      return s + tx([240, 160], 'Transformador → rectificador → filtro → regulador', 'tb') + tx([240, 186], 'Vp ≈ Vrms × 1.41 − caída de diodos', 'tm') + tx([240, 206], 'Rizo ≈ I / (120 · C) en onda completa', 'tm');
    } },
    m1transistor: { t: 'El transistor como interruptor', d: 'Una corriente pequeña en la base enciende una corriente grande del colector al emisor.', w: 480, h: 230, anim: true, draw: t => {
      const on = Math.floor(t / 1.5) % 2 === 1; let s = ci([260, 120], 34, 'none3') + ln([200, 120], [240, 120], 'k') + ln([240, 98], [240, 142], 'k') + ln([240, 108], [272, 84], 'k') + ln([240, 132], [272, 156], 'k') + fl([255, 143], [272, 156], 'k', 8);
      s += ln([272, 84], [272, 40], 'k') + ln([272, 156], [272, 200], 'k') + tx([200, 110], 'B', 'tb') + tx([285, 60], 'C', 'tb', 'start') + tx([285, 190], 'E', 'tb', 'start');
      s += rc(110, 112, 60, 16, 'fill2', 3) + tx([140, 105], 'Rb', 'tm') + ln([60, 120], [110, 120], 'k') + ln([170, 120], [200, 120], 'k') + rc(40, 105, 22, 30, on ? 'fillA' : 'fill2', 4) + tx([51, 155], on ? 'señal 5 V' : 'señal 0 V', 'tm');
      s += ci([272, 30], 12, on ? 'fillA' : 'fill2') + tx([300, 34], on ? 'LED encendido (saturación)' : 'LED apagado (corte)', on ? 'ta' : 'tm', 'start');
      if (on) { for (let i = 0; i < 4; i++) { const p = (t * 0.8 + i / 4) % 1; s += ci([272, 44 + p * 150], 3.5, 'dot'); } s += ci([150 + ((t * 0.8) % 1) * 50, 120], 2.5, 'dot'); }
      return s + tx([240, 222], 'Ic ≈ β · Ib · Rb = (Vent − 0.7) / Ib', 'tm');
    } },
    m1555: { t: 'El 555 astable', d: 'El capacitor se carga por R1 + R2 y se descarga por R2: la salida (3) alterna alto y bajo.', w: 480, h: 230, anim: true, draw: t => {
      const T = 2, ph = (t % T) / T, alto = ph < 0.54; let s = rc(170, 50, 120, 140, 'fill', 8) + tx([230, 128], '555', 'tb');
      const L = [['8 Vcc', 70], ['7 Desc.', 100], ['6 Umbral', 130], ['2 Disparo', 160]], R = [['4 Reset', 70], ['3 Salida', 130], ['1 GND', 160]];
      L.forEach(p => { s += ln([150, p[1]], [170, p[1]], 'k2') + tx([146, p[1] + 4], p[0], 'tm', 'end'); }); R.forEach(p => { s += ln([290, p[1]], [310, p[1]], 'k2') + tx([314, p[1] + 4], p[0], 'tm', 'start'); });
      s += ci([400, 130], 13, alto ? 'fillA' : 'fill2') + tx([400, 160], alto ? 'alto' : 'bajo', alto ? 'ta' : 'tm');
      const pts = []; for (let i = 0; i <= 100; i++) { const x = i / 100, p = (x * 2) % 1; pts.push([30 + x * 420, 222 - (p < 0.54 ? 14 : 0)]); } s += d.pl(pts, 'b') + ci([30 + ((t % (2 * T)) / (2 * T)) * 420, 222 - (alto ? 14 : 0)], 4, 'dot');
      return s + tx([240, 30], 'f = 1.44 / ((R1 + 2·R2) · C)', 'tb');
    } },
    m1pcb: { t: 'Del esquemático a la placa', d: 'El mismo circuito como símbolos (izquierda) y como pistas y pads de cobre (derecha).', w: 480, h: 220, anim: false, draw: () => {
      let s = tx([110, 22], 'Esquemático', 'tb') + tx([350, 22], 'Placa (cobre)', 'tb') + ln([240, 30], [240, 210], 'm');
      s += rc(40, 60, 40, 60, 'none3', 4) + tx([60, 135], 'J1', 'tm') + ln([80, 70], [120, 70], 'k2') + rc(120, 62, 50, 16, 'fill2', 3) + tx([145, 55], 'R1 470 Ω', 'tm') + ln([170, 70], [200, 70], 'k2') + pg([[200, 60], [200, 80], [216, 70]], 'fill') + ln([216, 60], [216, 80], 'k2') + tx([208, 100], 'D1', 'tm') + path('M216 70 L226 70 L226 150 L80 150 L80 110', 'k2');
      s += rc(270, 50, 180, 140, 'none2', 6); const pad = (x, y) => ci([x, y], 7, 'fillA') + ci([x, y], 2, 'pin');
      s += path('M290 80 L340 80', 'a') + path('M380 80 L420 80 L420 120', 'a') + path('M290 110 L290 160 L420 160 L420 140', 'a');
      s += pad(290, 80) + pad(290, 110) + pad(340, 80) + pad(380, 80) + pad(420, 120) + pad(420, 140) + tx([290, 185], 'J1', 'tm') + tx([360, 70], 'R1', 'tm') + tx([440, 132], 'D1', 'tm', 'start');
      return s;
    } }
  };
  const figTema = { 'm1-fuente': ['m1rect'], 'm1-regulador': ['m1rect'], 'm1-transistor': ['m1transistor'], 'm1-555': ['m1555'], 'm1-pcb-diseno': ['m1pcb'] };

  const industria = {
    'm1-fuente': [['Mantenimiento de maquinaria', 'Las fuentes de 24 V CD alimentan sensores y PLC; una fuente dañada detiene toda la máquina.'], ['Electrodomésticos', 'Cargadores y tarjetas de control tienen rectificador, filtro y regulador.']],
    'm1-transistor': [['Automatización', 'Las tarjetas de salida a transistor de los PLC encienden válvulas y relevadores.'], ['Autos', 'Los módulos del auto encienden luces y motores con transistores de potencia.']],
    'm1-soldadura': [['Electrónica automotriz y arneses', 'Los técnicos sueldan y reparan conexiones siguiendo normas de calidad.'], ['Reparación', 'Cambiar un capacitor de una tarjeta de máquina exige soldar sin dañar pistas.']],
    'm1-pcb-diseno': [['Fabricantes de tarjetas', 'Las placas se diseñan en software como KiCad y se fabrican por miles.'], ['Mantenimiento', 'Seguir pistas en una tarjeta permite encontrar el componente dañado.']]
  };
  const proyecto = { nombre: 'Luz intermitente en PCB', et: [['proto', 'Prototipo en protoboard', ['m1b-555-proto']], ['lista', 'Lista de materiales', ['m1b-seleccion']], ['sim', 'Simulación final', ['m1b-proyecto-sim']], ['pcb', 'PCB diseñada (DRC)', ['m1b-kicad-2']], ['fab', 'Placa fabricada', ['m1b-pcb-fab']], ['perf', 'Perforada y revisada', ['m1b-perforado']], ['solda', 'Componentes soldados', ['m1b-ensamble-pcb']], ['prueba', 'Funcionando y bitácora', ['m1b-pruebas']], ['gab', 'Gabinete', ['m1b-gabinete']], ['doc', 'Documentación', ['m1b-doc']]] };
  const recursos = {
    material: ['Diodos 1N4007 y LED de colores', 'Reguladores 7805, transistores BC547 o 2N2222, relevadores de 5 V', 'LDR, termistor NTC y potenciómetros', 'NE555 y LM358 con base DIP-8', 'Placa fenólica, cloruro férrico, papel couché, plumón indeleble', 'Placa perforada, soldadura con fundente y malla desoldadora'],
    equipo: ['Multímetros', 'Fuente de CD y transformador de demostración con fusible (preparado por el docente)', 'Cautines con soporte, taladro o minitaladro con brocas de 0.8 y 1 mm', 'Guantes de nitrilo, lentes de seguridad', 'Computadoras con KiCad o EasyEDA, Falstad y Tinkercad Circuits', 'Impresora láser', 'Cortadora láser (opcional, para gabinetes)']
  };
  const plan = {
    diag: 'Cuestionario diagnóstico de ley de Ohm, multímetro, componentes y código de colores',
    form: 'Guía de observación en armado, soldadura y fabricación de la placa; revisión de simulaciones y del DRC',
    sum: 'Circuito analógico armado en protoboard (lista de cotejo), circuito montado en placa impresa (lista de cotejo), exposición, bitácora de fallas y examen del parcial',
    practicas: ['Demostrativa: fuente por etapas (transformador preparado por el docente), soldadura y transferencia de tóner con el celular como cámara.', 'Guiada: prueba de diodos, regulador 7805, primera placa en KiCad y transferencia del diseño.', 'Supervisada: transistor como interruptor, relevador con motor y 555 del proyecto en protoboard.', 'Autónoma: luz nocturna automática; PCB del proyecto soldada, probada y documentada.'],
    paec: 'Proyecto: «Luz intermitente con 555 en su propia placa de circuito impreso»',
    paecEvid: 'Placa funcionando en su gabinete (Producto) y exposición (Desempeño)'
  };

  E.mods.registra('I-2', { temas: temas, clases: clases, banco: banco, gen: gen, ideas: ideas, figs: figs, figTema: figTema, industria: industria, proyecto: proyecto, recursos: recursos, plan: plan });
})();
