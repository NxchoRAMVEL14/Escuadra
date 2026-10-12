/* Escuadra · Módulo I «Construye circuitos electrónicos» · Submódulo 3: Diseña circuitos electrónicos digitales (96 h).
   3er parcial de 2º semestre: sistemas de numeración, BCD y display, compuertas, álgebra de Boole, mapas de Karnaugh,
   diseño combinacional, flip-flops y contadores. Proyecto: contador de piezas de 0 a 9 con display.
   Programa SEP 2024 (clave 3071300008-23), pp. 20-23 y 27-29; Tocci (2007), Botero (2022) y hojas de datos de la
   serie 74LS/74HC, CD4026 y CD4511. Simuladores gratuitos: CircuitVerse (navegador) y Logisim Evolution. */
(function () {
  'use strict';
  const E = window.E, H = E.mods.h, f = H.f, pick = H.pick, ops = H.ops;
  const FU = 'Programa SEP 2024, Módulo I, Submódulo 3';
  const bin = (n, w) => { let s = n.toString(2); while (s.length < (w || 0)) s = '0' + s; return s; };

  /* =================== TEMAS =================== */
  const temas = [
    {
      id: 'm1-digital', sm: 'I-3', ac: 'Elabora el diagrama del circuito electrónico digital', titulo: 'Analógico y digital: niveles lógicos', dur: '50 min',
      objetivo: 'Que distingan señales analógicas y digitales y reconozcan los niveles lógicos 0 y 1.',
      explica: [
        'Una señal analógica puede tomar cualquier valor (el voltaje de una LDR que cambia poco a poco). Una señal digital solo tiene dos estados: 0 (bajo) y 1 (alto). Así trabajan las computadoras, los PLC y los microcontroladores.',
        'En la familia TTL (74LS) con 5 V: una entrada se reconoce como 0 por debajo de 0.8 V y como 1 por arriba de 2 V; lo que queda en medio es zona prohibida. Un bit es un 0 o un 1; 4 bits forman un nibble y 8 bits un byte.',
        'Ventaja de lo digital: el ruido pequeño no cambia un 1 en 0, la información se copia sin errores y se procesa con lógica. Por eso un sensor analógico se convierte a digital antes de entrar a un controlador.'
      ],
      pantalla: ['Analógico: cualquier valor · Digital: solo 0 o 1', 'TTL a 5 V: 0 < 0.8 V · 1 > 2 V', 'Bit = 0 o 1 · nibble = 4 bits · byte = 8 bits', 'Lo digital resiste el ruido y se copia sin errores'],
      clave: [['Bit', 'Dígito binario: 0 o 1'], ['Byte', '8 bits'], ['Nivel alto (1)', 'Voltaje cercano a Vcc'], ['Nivel bajo (0)', 'Voltaje cercano a 0 V'], ['TTL', 'Familia lógica de 5 V (74LS…)'], ['CMOS', 'Familia lógica de bajo consumo (74HC…, CD40…)']],
      ejemplo: { titulo: '¿Analógico o digital?', pasos: ['Termómetro de mercurio: analógico.', 'Botón de un elevador: digital (oprimido o no).', 'Voltaje de una LDR: analógico.', 'Sensor de puerta abierta/cerrada: digital.'], resultado: 'Si solo tiene dos estados, es digital.' },
      preguntas: [['¿Cuántos estados tiene una señal digital?', 'Dos: 0 y 1.'], ['Con TTL a 5 V, ¿una entrada de 3.5 V es 0 o 1?', '1 (alto).'], ['¿Cuántos bits tiene un byte?', '8.'], ['Da un ejemplo de señal analógica.', 'La temperatura, el voltaje de una LDR, el volumen de un sonido.']],
      errores: ['Creer que 2.5 V siempre es un 1.', 'Confundir bit con byte.', 'Dejar entradas sin conectar (flotantes).'],
      vida: 'Los PLC de una línea de producción reciben señales digitales (botones, sensores de presencia) y analógicas (temperatura, presión): un técnico debe distinguirlas.',
      ideas: ['m1-dedos-binarios'], fuente: FU + ' (p. 20); Tocci (2007).'
    },
    {
      id: 'm1-numeracion', sm: 'I-3', ac: 'Elabora el diagrama del circuito electrónico digital', titulo: 'Sistemas de numeración: binario, octal y hexadecimal', dur: '50 min',
      objetivo: 'Que conviertan números entre decimal, binario, octal y hexadecimal.',
      explica: [
        'En decimal cada posición vale 10 veces más que la anterior. En binario (base 2) cada posición vale el doble: 1, 2, 4, 8, 16, 32, 64, 128. Para pasar de binario a decimal se suman los pesos donde hay 1: 1011 = 8 + 2 + 1 = 11.',
        'Para pasar de decimal a binario se divide entre 2 y se leen los residuos de abajo hacia arriba, o se restan los pesos más grandes que quepan: 13 = 8 + 4 + 1 = 1101.',
        'El hexadecimal (base 16) usa 0–9 y A–F (A = 10 … F = 15); cada dígito equivale a 4 bits, por eso es la forma corta de escribir binario: 1010 1111 = AF. El octal (base 8) agrupa de 3 en 3 bits: 101 111 = 57 en octal.'
      ],
      pantalla: ['Binario: pesos 128 64 32 16 8 4 2 1', 'Binario → decimal: suma los pesos con 1', 'Decimal → binario: divide entre 2 (residuos de abajo hacia arriba)', 'Hex: 0–9 y A–F · 1 dígito = 4 bits', 'Octal: grupos de 3 bits'],
      clave: [['Base 2', 'Binario: 0 y 1'], ['Base 8', 'Octal: 0 a 7'], ['Base 16', 'Hexadecimal: 0 a 9 y A a F'], ['Peso', 'Valor de cada posición'], ['MSB', 'Bit más significativo (el de la izquierda)'], ['LSB', 'Bit menos significativo (el de la derecha)']],
      ejemplo: { titulo: '45 en todas las bases', pasos: ['45 = 32 + 8 + 4 + 1 → 101101 en binario.', 'Grupos de 4 desde la derecha: 10 1101 → 2 D → 2D en hex.', 'Grupos de 3: 101 101 → 5 5 → 55 en octal.', 'Comprueba: 2 × 16 + 13 = 45 ✔.'], resultado: 'Pasa siempre por binario: es el idioma común.' },
      preguntas: [['¿Cuánto vale 1101 en decimal?', '13.'], ['¿Cómo se escribe 10 en binario?', '1010.'], ['¿Qué número decimal es F en hexadecimal?', '15.'], ['¿Cuántos bits representa un dígito hexadecimal?', '4.']],
      errores: ['Leer los residuos de arriba hacia abajo.', 'Agrupar los bits desde la izquierda.', 'Escribir 10 en lugar de A en hexadecimal.'],
      vida: 'Las direcciones de memoria, los colores de una pantalla (#FF8800) y los códigos de error de las máquinas se escriben en hexadecimal.',
      ideas: ['m1-dedos-binarios', 'pr-quien-quiere'], fuente: FU + ' (p. 20); Botero (2022); Tocci (2007).'
    },
    {
      id: 'm1-bcd7', sm: 'I-3', ac: 'Verifica el funcionamiento del circuito digital', titulo: 'Código BCD y display de 7 segmentos', dur: '50 min',
      objetivo: 'Que representen números en BCD y los muestren en un display con su decodificador.',
      explica: [
        'El BCD (decimal codificado en binario) escribe cada dígito decimal con 4 bits: 59 = 0101 1001. Solo se usan las combinaciones 0000 a 1001; de 1010 a 1111 no son válidas en BCD.',
        'Un display de 7 segmentos tiene 7 LED (a a g) y a veces el punto. En el de cátodo común, los segmentos se encienden con 1 y el común va a tierra; en el de ánodo común, se encienden con 0 y el común va a Vcc. Cada segmento lleva su resistor (220 a 330 Ω).',
        'Un decodificador convierte los 4 bits BCD en las 7 señales del display: el CD4511 (CMOS) maneja displays de cátodo común y el 74LS47 los de ánodo común. Revisa en su hoja de datos qué terminal es cada entrada (A es el bit de menor peso).'
      ],
      pantalla: ['BCD: cada dígito decimal en 4 bits', 'Válidos: 0000 a 1001', 'Cátodo común: segmento = 1 · común a GND', 'Ánodo común: segmento = 0 · común a Vcc', 'CD4511 → cátodo común · 74LS47 → ánodo común', 'Un resistor por segmento'],
      clave: [['BCD', 'Decimal codificado en binario'], ['Segmentos a–g', 'Los 7 LED del display'], ['Cátodo común', 'Todos los cátodos unidos a tierra'], ['Ánodo común', 'Todos los ánodos unidos a Vcc'], ['Decodificador', 'Convierte BCD en las señales del display']],
      ejemplo: { titulo: 'Mostrar un 7', pasos: ['7 en BCD = 0111 (D = 0, C = 1, B = 1, A = 1).', 'El CD4511 enciende los segmentos a, b y c.', 'Display de cátodo común con su común a tierra.', 'Si pones 1100 (12), el CD4511 apaga el display: no es BCD válido.'], resultado: 'Cuatro interruptores DIP + decodificador + display = número visible.' },
      preguntas: [['¿Cómo se escribe 9 en BCD?', '1001.'], ['¿1100 es un código BCD válido?', 'No; BCD solo va de 0000 a 1001.'], ['En un display de cátodo común, ¿con qué nivel se enciende un segmento?', 'Con 1 (alto).'], ['¿Qué decodificador se usa con display de ánodo común?', 'El 74LS47.']],
      errores: ['Mezclar decodificador y display de distinto tipo.', 'Omitir los resistores de los segmentos.', 'Invertir el orden de los bits (A es el de menor peso).'],
      vida: 'Básculas, relojes checadores, contadores de producción y elevadores muestran sus números con displays como estos.',
      ideas: ['m1-dip-display'], fuente: FU + ' (pp. 20 y 23); hojas de datos CD4511 y 74LS47.'
    },
    {
      id: 'm1-compuertas', sm: 'I-3', ac: 'Elabora el diagrama del circuito electrónico digital', titulo: 'Compuertas lógicas', dur: '50 min',
      objetivo: 'Que reconozcan las compuertas básicas por su símbolo, su tabla de verdad y su circuito integrado.',
      explica: [
        'AND (Y): la salida es 1 solo si todas las entradas son 1 (Y = A·B). OR (O): es 1 si al menos una es 1 (Y = A + B). NOT (NO): invierte (Y = A′).',
        'NAND y NOR son AND y OR con la salida invertida; se llaman universales porque con solo NAND (o solo NOR) se puede construir cualquier circuito. XOR (O exclusiva) da 1 cuando las entradas son distintas: sirve para comparar y sumar.',
        'Cada circuito integrado trae varias compuertas: 74LS08 (4 AND), 74LS32 (4 OR), 74LS04 (6 NOT), 74LS00 (4 NAND), 74LS02 (4 NOR), 74LS86 (4 XOR). En los de 14 terminales, la 14 es Vcc y la 7 es tierra; la muesca marca dónde empieza la terminal 1.'
      ],
      pantalla: ['AND: 1 solo si todas son 1', 'OR: 1 si alguna es 1', 'NOT: invierte', 'NAND, NOR: universales', 'XOR: 1 si son distintas', '74LS08 AND · 32 OR · 04 NOT · 00 NAND · 02 NOR · 86 XOR', '14 = Vcc · 7 = GND'],
      clave: [['AND', 'Y = A·B'], ['OR', 'Y = A + B'], ['NOT', "Y = A′"], ['NAND', "Y = (A·B)′"], ['NOR', "Y = (A + B)′"], ['XOR', 'Y = A ⊕ B']],
      ejemplo: { titulo: 'Prensa con dos manos', pasos: ['A = botón izquierdo, B = botón derecho.', 'La prensa baja solo si ambos están oprimidos: Y = A·B.', 'Compuerta AND (74LS08).', 'Tabla: 00→0, 01→0, 10→0, 11→1.'], resultado: 'La AND obliga a tener las dos manos fuera de peligro.' },
      preguntas: [['¿Cuándo da 1 una AND de 2 entradas?', 'Solo cuando las dos entradas son 1.'], ['¿Qué hace una NOT?', 'Invierte la entrada.'], ['¿Por qué NAND es universal?', 'Porque con solo NAND se puede construir cualquier función lógica.'], ['¿En qué terminal va Vcc en un 74LS08?', 'En la 14 (tierra en la 7).']],
      errores: ['Confundir el símbolo AND (recto) con el OR (curvo).', 'Olvidar alimentar el integrado.', 'Dejar entradas sin conectar.'],
      vida: 'La lógica de seguridad de una prensa o de un robot es lógica de compuertas; en un PLC se programa con contactos que hacen lo mismo.',
      ideas: ['m1-memorama-simbolos', 'm1-compuertas-humanas'], fuente: FU + ' (p. 21); hojas de datos 74LS00, 02, 04, 08, 32 y 86.'
    },
    {
      id: 'm1-boole', sm: 'I-3', ac: 'Elabora el diagrama del circuito electrónico digital', titulo: 'Álgebra de Boole y tabla de verdad', dur: '50 min',
      objetivo: 'Que obtengan la expresión booleana de una tabla de verdad y la simplifiquen con las leyes básicas.',
      explica: [
        'Una tabla de verdad lista todas las combinaciones de entradas (2ⁿ renglones para n entradas) y la salida de cada una. De ella sale la expresión en suma de productos: por cada renglón con salida 1 se escribe un producto con las variables (negadas donde valen 0) y se suman.',
        'Leyes útiles: A·1 = A, A + 0 = A, A·0 = 0, A + 1 = 1, A + A′ = 1, A·A′ = 0, A + A·B = A, y la distributiva A·B + A·C = A·(B + C).',
        'Teoremas de De Morgan: (A·B)′ = A′ + B′ y (A + B)′ = A′·B′. Sirven para convertir circuitos a solo NAND o solo NOR y ahorrar circuitos integrados.'
      ],
      pantalla: ['n entradas → 2ⁿ renglones', 'Suma de productos: un producto por cada 1', 'A + A·B = A · A + A′ = 1 · A·A′ = 0', 'De Morgan: (A·B)′ = A′ + B′', 'De Morgan: (A + B)′ = A′·B′'],
      clave: [['Tabla de verdad', 'Todas las combinaciones y su salida'], ['Minitérmino', 'Producto de todas las variables (un renglón con 1)'], ['Suma de productos', 'Expresión OR de términos AND'], ['De Morgan', 'Cambia AND por OR invirtiendo'], ['Simplificar', 'Obtener la expresión con menos compuertas']],
      ejemplo: { titulo: 'Votación de 3 jueces (mayoría)', pasos: ['Salida 1 cuando al menos 2 de A, B, C votan 1.', 'Renglones con 1: 011, 101, 110, 111.', 'Suma de productos: A′BC + AB′C + ABC′ + ABC.', 'Simplificada: AB + AC + BC.'], resultado: 'De 4 productos de 3 variables a 3 de 2: menos compuertas.' },
      preguntas: [['¿Cuántos renglones tiene la tabla de verdad de 3 entradas?', '8.'], ['Simplifica A + A·B.', 'A.'], ['Aplica De Morgan a (A·B)′.', "A′ + B′."], ['¿Cuánto vale A·A′?', '0.']],
      errores: ['Olvidar combinaciones en la tabla.', 'Negar mal las variables que valen 0.', 'Aplicar De Morgan sin cambiar AND por OR.'],
      vida: 'Simplificar la lógica ahorra componentes, dinero y fallas; en programación de PLC sirve para escribir condiciones más cortas.',
      ideas: ['m1-jueces'], fuente: FU + ' (p. 21); Tocci (2007).'
    },
    {
      id: 'm1-karnaugh', sm: 'I-3', ac: 'Elabora el diagrama del circuito electrónico digital', titulo: 'Mapas de Karnaugh', dur: '50 min',
      objetivo: 'Que simplifiquen funciones de 2, 3 y 4 variables con mapas de Karnaugh.',
      explica: [
        'El mapa de Karnaugh acomoda la tabla de verdad en una cuadrícula donde las casillas vecinas difieren en una sola variable. Por eso filas y columnas se ordenan en código Gray: 00, 01, 11, 10.',
        'Se agrupan los 1 en rectángulos de 1, 2, 4, 8 o 16 casillas (potencias de 2), lo más grandes posible; los grupos pueden traslaparse y "dar la vuelta" por las orillas. Cada grupo es un producto: se quedan solo las variables que no cambian dentro del grupo.',
        'Grupo de 2 elimina 1 variable, de 4 elimina 2, de 8 elimina 3. Las condiciones "no importa" (X) pueden usarse como 1 si ayudan a hacer grupos más grandes.'
      ],
      pantalla: ['Orden Gray: 00, 01, 11, 10', 'Agrupa 1 en 1, 2, 4, 8 casillas', 'Grupos lo más grandes posible', 'Pueden traslaparse y dar la vuelta', 'Grupo de 2 elimina 1 variable · de 4 elimina 2', 'X («no importa») ayuda si conviene'],
      clave: [['Código Gray', 'Orden en que cambia un solo bit'], ['Implicante', 'Grupo de 1 en el mapa'], ['Adyacente', 'Casillas que difieren en una variable'], ['No importa (X)', 'Combinación que nunca ocurre']],
      ejemplo: { titulo: 'Mayoría de 3 con mapa', pasos: ['Filas A = 0 y 1; columnas BC en Gray: 00, 01, 11, 10.', 'Unos en 011, 101, 110 y 111.', 'Tres grupos de 2: BC, AC y AB.', 'F = AB + AC + BC.'], resultado: 'El mapa llega a la misma respuesta que el álgebra, más rápido.' },
      preguntas: [['¿En qué orden se escriben 2 variables en el mapa?', '00, 01, 11, 10 (Gray).'], ['¿De qué tamaño pueden ser los grupos?', '1, 2, 4, 8 o 16 casillas.'], ['¿Cuántas variables elimina un grupo de 4?', '2.'], ['¿Se pueden traslapar los grupos?', 'Sí.']],
      errores: ['Ordenar las columnas 00, 01, 10, 11.', 'Hacer grupos de 3 o 6.', 'Olvidar que las orillas son vecinas.'],
      vida: 'Optimizar la cantidad de compuertas o de contactos en un programa es pensar como el mapa de Karnaugh: lo mismo con menos.',
      ideas: ['m1-karnaugh-tapete'], fuente: FU + ' (p. 21); Tocci (2007).'
    },
    {
      id: 'm1-diseno', sm: 'I-3', ac: 'Elabora el diagrama del circuito electrónico digital', titulo: 'Diseño de un circuito combinacional paso a paso', dur: '50 min',
      objetivo: 'Que diseñen un circuito digital desde un problema real hasta el diagrama con circuitos integrados.',
      explica: [
        'Pasos: 1) entender el problema y definir entradas y salidas (qué es 1 y qué es 0); 2) tabla de verdad; 3) expresión y simplificación (Boole o Karnaugh); 4) diagrama lógico con compuertas; 5) elegir los circuitos integrados y numerar terminales; 6) simular; 7) armar y validar con la tabla.',
        'Optimizar es usar la menor cantidad de compuertas y de circuitos integrados: a veces conviene convertir todo a NAND para usar un solo 74LS00.',
        'Las entradas se simulan con un interruptor DIP y un resistor (pull-down de 10 kΩ para que valgan 0 cuando el interruptor está abierto) y las salidas con LED y su resistor. Así se valida renglón por renglón.'
      ],
      pantalla: ['1. Entradas y salidas · 2. Tabla de verdad', '3. Simplifica · 4. Diagrama lógico', '5. Integrados y terminales · 6. Simula', '7. Arma y valida renglón por renglón', 'Entradas: DIP + pull-down · Salidas: LED'],
      clave: [['Combinacional', 'La salida depende solo de las entradas actuales'], ['Pull-down', 'Resistor que lleva la entrada a 0 cuando está abierta'], ['Interruptor DIP', 'Bloque de interruptores para dar 0 o 1'], ['Validar', 'Comprobar el circuito contra la tabla de verdad']],
      ejemplo: { titulo: 'Alarma de tanque', pasos: ['Entradas: N = nivel alto, B = bomba encendida, T = temperatura alta.', 'Alarma si hay nivel alto con bomba encendida, o si hay temperatura alta.', 'F = N·B + T.', 'Un 74LS08 y un 74LS32; LED rojo en la salida.'], resultado: 'Del enunciado al circuito sin adivinar.' },
      preguntas: [['¿Cuál es el primer paso del diseño?', 'Definir entradas y salidas del problema.'], ['¿Para qué sirve un resistor pull-down?', 'Para que la entrada valga 0 cuando el interruptor está abierto.'], ['¿Qué significa validar el circuito?', 'Comprobar cada renglón de la tabla de verdad en el circuito real.'], ['¿Por qué convertir todo a NAND?', 'Para usar menos tipos de integrados.']],
      errores: ['Saltarse la tabla de verdad.', 'Entradas flotantes sin pull-down.', 'No numerar terminales en el diagrama.'],
      vida: 'Así se diseñan los interbloqueos de seguridad de una máquina: primero las condiciones, luego la lógica.',
      ideas: ['m1-jueces', 'm1-reto-diseno'], fuente: FU + ' (pp. 21-23).'
    },
    {
      id: 'm1-ci-digital', sm: 'I-3', ac: 'Verifica el funcionamiento del circuito digital', titulo: 'Circuitos integrados digitales en la protoboard', dur: '50 min',
      objetivo: 'Que conecten circuitos integrados digitales sin dañarlos y eviten las fallas típicas.',
      explica: [
        'Familias: TTL (74LS) trabaja con 5 V ±5 %; CMOS (74HC, CD40…) trabaja en un rango más amplio y consume menos, pero es sensible a la estática. No mezcles familias sin revisar sus niveles en la hoja de datos.',
        'Reglas: el integrado va a caballo sobre la ranura central de la protoboard; la muesca indica la terminal 1 y se cuenta en sentido contrario a las manecillas; alimentación antes que nada (Vcc y tierra); un capacitor de 0.1 µF entre Vcc y tierra cerca de cada integrado filtra ruido.',
        'Ninguna entrada se deja al aire: en TTL una entrada flotante suele leerse como 1 pero es inestable; en CMOS puede oscilar y calentar el integrado. Las entradas sin usar van a Vcc o a tierra según convenga.'
      ],
      pantalla: ['74LS: 5 V · 74HC/CD40: más rango, cuidado con la estática', 'Integrado sobre la ranura central', 'Muesca = terminal 1 · cuenta contra reloj', 'Primero Vcc y tierra', '0.1 µF cerca de cada integrado', 'Ninguna entrada al aire'],
      clave: [['Muesca', 'Marca que indica la terminal 1'], ['Desacoplo', 'Capacitor de 0.1 µF entre Vcc y tierra'], ['Entrada flotante', 'Entrada sin conectar: valor incierto'], ['Fan-out', 'Cuántas entradas puede manejar una salida']],
      ejemplo: { titulo: 'Revisar un integrado que «no hace nada»', pasos: ['Mide 5 V entre la 14 y la 7.', 'Revisa que la muesca coincida con el diagrama.', 'Pon cada entrada a 0 y a 1 con el DIP y mide la salida.', 'Busca entradas al aire.'], resultado: 'La mayoría de las fallas son de alimentación o de orientación.' },
      preguntas: [['¿Qué indica la muesca de un integrado?', 'Dónde está la terminal 1.'], ['¿Por qué no se dejan entradas al aire?', 'Porque su valor es incierto y el circuito falla o se calienta.'], ['¿Para qué el capacitor de 0.1 µF?', 'Para filtrar el ruido de alimentación cerca del integrado.'], ['¿Con qué voltaje trabaja la familia 74LS?', '5 V.']],
      errores: ['Integrado girado 180°.', 'Olvidar la tierra.', 'Tocar CMOS sin descargar la estática.'],
      vida: 'Las tarjetas de control industriales siguen estas mismas reglas; un técnico que las conoce repara más rápido.',
      ideas: ['m1-dip-display'], fuente: FU + ' (p. 23); hojas de datos de la serie 74LS y 74HC.'
    },
    {
      id: 'm1-flipflop', sm: 'I-3', ac: 'Elabora el diagrama del circuito electrónico digital', titulo: 'Flip-flops y señal de reloj', dur: '50 min',
      objetivo: 'Que expliquen cómo un flip-flop guarda un bit y cómo el reloj sincroniza un circuito.',
      explica: [
        'Los circuitos secuenciales tienen memoria: su salida depende de las entradas y de lo que pasó antes. La memoria más simple es el flip-flop, que guarda 1 bit.',
        'El flip-flop D copia su entrada D a la salida Q en el flanco del reloj (el instante en que el reloj sube). El JK: con J = 1 y K = 0 pone Q en 1; con J = 0 y K = 1 la pone en 0; con J = K = 1 cambia de estado (toggle). Un flip-flop en toggle divide la frecuencia entre 2.',
        'El reloj es una señal cuadrada que marca el ritmo; para verlo a ojo se usa un 555 astable de alrededor de 1 Hz. Los botones rebotan (generan varios pulsos al oprimirlos), por eso se usan con un circuito antirrebote, por ejemplo un 555 monostable.'
      ],
      pantalla: ['Secuencial = tiene memoria', 'Flip-flop: guarda 1 bit', 'D: Q copia a D en el flanco del reloj', 'JK: J = K = 1 → cambia (toggle)', 'Toggle = divide la frecuencia entre 2', 'Botones rebotan: usa antirrebote'],
      clave: [['Flanco de subida', 'Instante en que el reloj pasa de 0 a 1'], ['Q y Q′', 'Salida y su inversa'], ['Toggle', 'Cambiar de estado en cada pulso'], ['Rebote', 'Pulsos falsos al oprimir un botón'], ['Reloj', 'Señal cuadrada que marca el ritmo']],
      ejemplo: { titulo: 'Divisor de frecuencia', pasos: ['Reloj de 8 Hz en un flip-flop en toggle → 4 Hz.', 'Otro flip-flop → 2 Hz.', 'Otro más → 1 Hz.', 'Tres flip-flops dividen entre 2³ = 8.'], resultado: 'Así los relojes digitales sacan 1 segundo de un cristal rápido.' },
      preguntas: [['¿Cuántos bits guarda un flip-flop?', 'Uno.'], ['¿Qué hace un flip-flop D en el flanco del reloj?', 'Copia D a la salida Q.'], ['¿Qué pasa con J = K = 1?', 'La salida cambia de estado en cada pulso (toggle).'], ['¿Qué es el rebote de un botón?', 'Varios pulsos falsos al oprimirlo.']],
      errores: ['Usar un botón sin antirrebote como reloj.', 'Confundir el flanco con el nivel.', 'Olvidar conectar las entradas de preset y clear.'],
      vida: 'Toda máquina con secuencias (primero sujeta, luego taladra, luego suelta) necesita memoria: en un PLC eso son marcas y temporizadores.',
      ideas: ['m1-reloj-555'], fuente: FU + ' (p. 21); Tocci (2007).'
    },
    {
      id: 'm1-contadores', sm: 'I-3', ac: 'Elabora el diagrama del circuito electrónico digital', titulo: 'Contadores ascendentes y descendentes', dur: '50 min',
      objetivo: 'Que determinen la secuencia de un contador y elijan el integrado adecuado.',
      explica: [
        'Un contador es una cadena de flip-flops que avanza un número en cada pulso. Con n flip-flops cuenta 2ⁿ estados (4 flip-flops: 0 a 15). Un contador de década (BCD) se reinicia después del 9.',
        'Asíncrono (de rizo): cada flip-flop recibe el reloj del anterior; es sencillo pero los cambios llegan con pequeños retardos. Síncrono: todos reciben el mismo reloj al mismo tiempo; es más rápido y confiable. Ascendente cuenta 0, 1, 2…; descendente 9, 8, 7…',
        'Integrados típicos: 74LS90 (década, asíncrono), 74LS193 (binario síncrono ascendente/descendente) y CD4026 (década con salidas para display de cátodo común). Con un decodificador (CD4511 o 74LS47) y un display se ve la cuenta.'
      ],
      pantalla: ['n flip-flops → 2ⁿ estados', 'Década (BCD): 0 a 9 y reinicia', 'Asíncrono: reloj en cadena · Síncrono: mismo reloj', 'Ascendente 0→9 · Descendente 9→0', '74LS90 · 74LS193 · CD4026', 'Contador + decodificador + display'],
      clave: [['Módulo', 'Número de estados de un contador'], ['Década', 'Contador de 10 estados (0 a 9)'], ['Asíncrono', 'Los flip-flops cambian en cadena'], ['Síncrono', 'Todos cambian con el mismo reloj'], ['Reset', 'Regresa el contador a 0']],
      ejemplo: { titulo: 'Contador de piezas', pasos: ['Sensor de paso de pieza → 555 monostable (antirrebote).', 'Pulso → reloj del contador de década.', 'Salida BCD → CD4511 → display de cátodo común.', 'Botón de reset → regresa a 0.'], resultado: 'Cada pieza que pasa suma 1 en el display.' },
      preguntas: [['¿Cuántos estados cuenta un contador de 3 flip-flops?', '8 (0 a 7).'], ['¿Qué es un contador de década?', 'Uno que cuenta de 0 a 9 y reinicia.'], ['Diferencia entre síncrono y asíncrono.', 'En el síncrono todos los flip-flops reciben el mismo reloj; en el asíncrono el reloj pasa en cadena.'], ['¿Qué integrado cuenta hacia arriba y hacia abajo?', 'El 74LS193.']],
      errores: ['Dejar el reset al aire.', 'Usar un botón con rebote como reloj.', 'Esperar que un contador binario de 4 bits se detenga en 9.'],
      vida: 'Los contadores de producción, de piezas rechazadas y de ciclos de una máquina hacen exactamente esto; en un PLC se llaman contadores CTU y CTD.',
      ideas: ['m1-reloj-555', 'm1-dip-display'], fuente: FU + ' (p. 22); hojas de datos 74LS90, 74LS193, CD4026 y CD4511.'
    }
  ];

  /* =================== CLASES =================== */
  const clases = [
    { id: 'm1c-encuadre', h: 3, m: 'a', tipo: 'Encuadre', t: 'Encuadre del 3er parcial y diagnóstico', obj: 'Presentar el proyecto del contador y saber qué traen del parcial anterior.', ac: null,
      pasos: [[20, 'Encuadre y criterios.'], [20, 'El proyecto: contador de piezas de 0 a 9 con display (muestra un video o uno armado).'], [50, 'Cuestionario diagnóstico: transistor, 555, sistemas de numeración y lógica cotidiana.'], [30, 'Dinámica: ¿dónde se cuentan cosas en una fábrica? Lluvia de ideas.'], [30, 'Equipos y lista de material.']],
      ev: 'Cuestionario diagnóstico contestado (Desempeño)', tarea: 'Conseguir por equipo: 74LS08, 74LS32, 74LS04, display de 7 segmentos de cátodo común, CD4511, interruptor DIP de 4 y resistores de 330 Ω y 10 kΩ.', ideas: ['roles-equipo', 'pregunta-reto'], pre: 'digital · binario · contador' },
    { id: 'm1c-digital-c', h: 2, m: 'a', tipo: 'Teoría', t: 'Analógico y digital: niveles lógicos', obj: 'Distinguir señales analógicas y digitales y los niveles lógicos.', ac: 0, dc: 0, tema: 'm1-digital',
      pasos: [[10, 'Pregunta-reto: ¿por qué una foto digital se copia mil veces sin perder calidad y una fotocopia no?'], [40, 'Tema en proyector.'], [35, 'Clasifican 15 señales de una máquina en analógicas o digitales.'], [15, 'Boleto de salida.']], ideas: ['pregunta-reto'], pre: 'bit · nivel lógico · TTL' },
    { id: 'm1c-numeracion-c', h: 2, m: 'a', tipo: 'Teoría', t: 'Sistemas de numeración y conversiones', obj: 'Convertir entre decimal, binario, octal y hexadecimal.', ac: 0, dc: 0, tema: 'm1-numeracion',
      pasos: [[40, 'Tema en proyector.'], [45, 'Conversiones en parejas, de menor a mayor dificultad.'], [15, 'Votación con tarjetas.']],
      tarea: 'En la libreta: tu edad, tu número de lista y el año actual en binario, octal y hexadecimal.', ideas: ['pr-plickers'], pre: 'base · peso · hexadecimal' },
    { id: 'm1c-binario-juego', h: 1, m: 'a', tipo: 'Práctica', t: 'Dedos binarios y tarjetas de puntos', obj: 'Sentir el binario contando con los dedos y con tarjetas.', ac: 0, dc: 0, tema: 'm1-numeracion',
      pasos: [[10, 'Revisión rápida de la tarea.'], [25, 'Tarjetas de 1, 2, 4, 8 y 16 puntos: 5 voluntarios forman números al frente.'], [15, 'Cuenten del 0 al 31 con los dedos de una mano.']], ideas: ['m1-dedos-binarios'], pre: 'tarjetas · conteo binario' },
    { id: 'm1c-hex', h: 2, m: 'd', tipo: 'Teoría', t: 'Hexadecimal, octal y BCD', obj: 'Agrupar bits en hexadecimal y octal y escribir números en BCD.', ac: 0, dc: 0, tema: 'm1-bcd7',
      pasos: [[30, 'Repaso: agrupar de 4 y de 3 bits.'], [30, 'El código BCD y por qué no es lo mismo que binario.'], [30, '¿Quién quiere ser técnico? con conversiones.'], [10, 'Boleto de salida.']], ideas: ['pr-quien-quiere'], pre: 'nibble · BCD · agrupar' },
    { id: 'm1c-compuertas-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Compuertas lógicas', obj: 'Reconocer compuertas por símbolo, tabla de verdad e integrado.', ac: 0, dc: 1, tema: 'm1-compuertas',
      pasos: [[10, 'Compuertas humanas: 2 alumnos con tarjetas 0/1 y uno que decide la salida.'], [40, 'Tema en proyector.'], [35, 'Tablas de verdad en la libreta de las 6 compuertas.'], [15, 'Memorama de compuertas.']],
      ideas: ['m1-compuertas-humanas', 'm1-memorama-simbolos'], pre: 'AND · OR · NOT · NAND' },
    { id: 'm1c-compuertas-sim', h: 2, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Compuertas en el simulador', obj: 'Comprobar en el simulador las tablas de verdad de las 6 compuertas.', ac: 1, dc: 0, tema: 'm1-compuertas',
      pasos: [[10, 'Cómo entrar a CircuitVerse (sin instalar) o abrir Logisim Evolution.'], [60, 'Arman cada compuerta con dos entradas y una salida y llenan la tabla de verdad.'], [20, 'Reto: XOR hecha solo con NAND.'], [10, 'Captura y entrega.']],
      ev: 'Tablas de verdad comprobadas en el simulador (Producto)',
      guia: { sw: 'CircuitVerse o Logisim Evolution', link: 'https://circuitverse.org/simulator', pasos: [['Entrar', 'circuitverse.org → Simulator (no necesitas cuenta para probar).'], ['Entradas', 'Input → coloca dos entradas (se cambian con un clic).'], ['Compuerta', 'Gates → AND; une las entradas a la compuerta.'], ['Salida', 'Output → coloca un LED o salida en la compuerta.'], ['Tabla', 'Prueba 00, 01, 10 y 11 y anota la salida.'], ['Repite', 'Con OR, NOT, NAND, NOR y XOR.']], tabla: { cab: ['A', 'B', 'AND', 'OR', 'NAND', 'NOR', 'XOR'], filas: [['0', '0', '', '', '', '', ''], ['0', '1', '', '', '', '', ''], ['1', '0', '', '', '', '', ''], ['1', '1', '', '', '', '', '']] }, revisa: ['Las 6 tablas completas', 'Reto de XOR con NAND'], entrega: 'Captura y tabla.' },
      ideas: ['m1-simulador-celular'], pre: 'simulador · tabla de verdad · entrada' },
    { id: 'm1c-ci-c', h: 1, m: 'd', tipo: 'Teoría', t: 'Circuitos integrados digitales en la protoboard', obj: 'Conectar integrados digitales sin dañarlos.', ac: 1, dc: 1, tema: 'm1-ci-digital',
      pasos: [[30, 'Tema en proyector con un 74LS08 real.'], [15, 'Ejercicio: numeran las terminales de un DIP-14 dibujado de distintas formas.'], [5, 'Boleto de salida.']], pre: 'muesca · Vcc · desacoplo' },
    { id: 'm1c-compuertas-lab', h: 3, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Práctica', t: 'Comprueba compuertas reales', obj: 'Armar y comprobar compuertas con integrados, interruptores DIP y LED.', ac: 1, dc: 2, tema: 'm1-ci-digital', dep: ['m1c-ci-c'],
      pasos: [[15, 'Práctica demostrativa: entradas con DIP y pull-down, salida con LED.'], [90, 'Práctica guiada: comprueban 74LS08, 74LS32 y 74LS04 y llenan sus tablas.'], [30, 'Prueban una entrada al aire y explican qué pasa.'], [15, 'Orden y guardado.']],
      mat: '74LS08, 74LS32, 74LS04, interruptor DIP de 4, resistores de 10 kΩ y 330 Ω, LED, protoboard, fuente de 5 V (o 7805 del parcial anterior), multímetro.', ev: 'Tablas de verdad comprobadas con integrados (Producto)',
      guia: { pasos: [['Alimenta', 'Fuente de 5 V: terminal 14 a +5 V y 7 a tierra en cada integrado; 0.1 µF entre ellas.'], ['Entradas', 'DIP a +5 V y pull-down de 10 kΩ a tierra en cada entrada.'], ['Salida', 'Salida → 330 Ω → LED → tierra.'], ['Prueba', 'Recorre 00, 01, 10, 11 y anota.'], ['Flotante', 'Desconecta el pull-down de una entrada y observa.']], tabla: { cab: ['Integrado', 'Entradas', 'Salida esperada', 'Salida real'], filas: 12 }, revisa: ['Vcc y tierra medidos (5 V)', 'Tablas completas'], seguridad: 'Usa 5 V: con 9 V los 74LS se dañan.', entrega: 'Tablas y conclusión sobre las entradas al aire.' },
      ideas: ['m1-dip-display'], pre: 'DIP · pull-down · 74LS08' },
    { id: 'm1c-boole-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Tabla de verdad y álgebra de Boole', obj: 'Obtener y simplificar la expresión de una tabla de verdad.', ac: 0, dc: 2, tema: 'm1-boole',
      pasos: [[45, 'Tema en proyector con el ejemplo de los jueces.'], [40, 'Ejercicios: de tabla a expresión y simplificación con leyes y De Morgan.'], [15, 'Boleto de salida.']], ideas: ['m1-jueces'], pre: 'minitérmino · suma de productos · De Morgan' },
    { id: 'm1c-karnaugh-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Mapas de Karnaugh de 2 y 3 variables', obj: 'Simplificar funciones con mapas de Karnaugh.', ac: 0, dc: 2, tema: 'm1-karnaugh',
      pasos: [[45, 'Tema en proyector.'], [45, 'Tapete de Karnaugh: agrupan con fichas en una cuadrícula impresa.'], [10, 'Boleto de salida.']],
      tarea: 'En la libreta: 4 mapas de 3 variables con su expresión simplificada.', ideas: ['m1-karnaugh-tapete'], pre: 'Gray · grupo · adyacente' },
    { id: 'm1c-karnaugh-4', h: 2, m: 'd', tipo: 'Teoría', t: 'Mapas de 4 variables y «no importa»', obj: 'Simplificar funciones de 4 variables usando condiciones «no importa».', ac: 0, dc: 2, tema: 'm1-karnaugh', dep: ['m1c-karnaugh-c'],
      pasos: [[10, 'Revisa la tarea con el error del día.'], [40, 'Mapas de 4 variables: grupos que dan la vuelta y X.'], [40, 'Ejercicios por parejas.'], [10, 'Votación con tarjetas.']], ideas: ['pr-error-del-dia', 'pr-plickers'], pre: 'cuatro variables · no importa · esquinas' },
    { id: 'm1c-diseno-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Diseño combinacional paso a paso', obj: 'Ir de un problema real al diagrama con integrados.', ac: 0, dc: 1, tema: 'm1-diseno',
      pasos: [[45, 'Tema en proyector: votación de 3 jueces de principio a fin.'], [45, 'En parejas: diseñan la alarma de tanque hasta el diagrama con terminales numeradas.'], [10, 'Boleto de salida.']], ideas: ['m1-jueces'], pre: 'diseño · diagrama lógico · terminales' },
    { id: 'm1c-diseno-sim', h: 2, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Simula tu diseño combinacional', obj: 'Comprobar en el simulador el diseño de la votación y de la alarma.', ac: 1, dc: 0, tema: 'm1-diseno', dep: ['m1c-diseno-c'],
      pasos: [[10, 'Indicaciones.'], [70, 'Simulan la votación (AB + AC + BC) y la alarma del tanque; validan renglón por renglón.'], [20, 'Versión solo con NAND de la votación (De Morgan).']],
      ev: 'Diseños combinacionales simulados y validados (Producto)', pre: 'validar · NAND · simulación' },
    { id: 'm1c-diseno-lab', h: 3, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Práctica', t: 'Arma la votación de 3 jueces', obj: 'Armar y validar un circuito combinacional optimizando compuertas y cableado.', ac: 1, dc: 1, tema: 'm1-diseno', dep: ['m1c-diseno-sim', 'm1c-compuertas-lab'],
      pasos: [[15, 'Revisión del diagrama con terminales numeradas.'], [90, 'Práctica supervisada: arman la votación con 74LS08 y 74LS32 (o solo 74LS00) y DIP en las entradas.'], [30, 'Validación de los 8 renglones con el docente o un compañero supervisor.'], [15, 'Coevaluación con lista de cotejo.']],
      mat: 'Integrados del equipo, DIP, resistores, LED, protoboard, fuente de 5 V.', ev: 'Circuito combinacional funcionando y validado (Producto · actividad clave)', ideas: ['coevaluacion'], pre: 'optimizar · cableado · validación' },
    { id: 'm1c-nand', h: 2, m: 'd', tipo: 'Práctica', t: 'Todo con NAND: menos integrados', obj: 'Convertir circuitos a solo NAND con De Morgan para ahorrar integrados.', ac: 0, dc: 2, tema: 'm1-boole',
      pasos: [[30, 'De Morgan aplicado: AND, OR y NOT hechas con NAND.'], [50, 'Convierten la alarma del tanque a solo NAND y cuentan integrados antes y después.'], [20, 'Plenaria: ¿cuánto ahorraron?']], pre: 'universal · De Morgan · optimizar' },
    { id: 'm1c-reto-diseno', h: 3, m: 'd', tipo: 'Proyecto', t: 'Reto de diseño industrial', obj: 'Diseñar de forma autónoma un circuito combinacional para un problema industrial.', ac: 0, dc: 1, tema: 'm1-diseno',
      pasos: [[10, 'Cada equipo saca un reto: prensa segura, semáforo de un cruce simple, control de nivel de cisterna, acceso con dos llaves.'], [100, 'Práctica autónoma: entradas y salidas, tabla, Karnaugh, diagrama con integrados y simulación (si hay computadora).'], [40, 'Exponen en 3 minutos su diseño.']],
      ev: 'Diagrama del circuito digital diseñado con métodos y técnicas (Producto · actividad clave)', ideas: ['m1-reto-diseno'], pre: 'reto · Karnaugh · diagrama' },
    { id: 'm1c-repaso-medio', h: 1, m: 'd', tipo: 'Evaluación', t: 'Repaso de medio parcial', obj: 'Detectar temas a reforzar.', ac: null,
      pasos: [[35, '¿Quién quiere ser técnico? con conversiones, compuertas y mapas.'], [15, 'Dudas más repetidas.']], ideas: ['pr-quien-quiere'] },
    { id: 'm1c-7seg-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Display de 7 segmentos y decodificador', obj: 'Mostrar números BCD en un display con su decodificador.', ac: 1, dc: 2, tema: 'm1-bcd7',
      pasos: [[40, 'Tema en proyector.'], [40, 'Ejercicio: qué segmentos enciende cada número; tabla de 0 a 9.'], [20, 'Identifican con el multímetro (función diodo) si su display es de cátodo o ánodo común.']], pre: 'segmento · cátodo común · decodificador' },
    { id: 'm1c-7seg-lab', h: 2, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Práctica', t: 'Del DIP al display', obj: 'Mostrar en el display el número BCD que marcan los interruptores.', ac: 1, dc: 2, tema: 'm1-bcd7', dep: ['m1c-7seg-c'],
      pasos: [[10, 'Revisión del pinout del CD4511 y del display.'], [65, 'Arman DIP de 4 → CD4511 → display con 7 resistores.'], [15, 'Prueban de 0000 a 1111 y anotan qué muestra.'], [10, 'Conclusión: ¿qué pasa con los códigos no BCD?']],
      mat: 'CD4511, display de cátodo común, DIP de 4, resistores de 330 Ω y 10 kΩ, protoboard, fuente de 5 V.', ev: 'Display mostrando 0 a 9 (Desempeño)',
      guia: { pasos: [['Alimenta', 'CD4511: 16 a +5 V y 8 a tierra; LT (3) y BI (4) a +5 V; LE (5) a tierra.'], ['Entradas', 'DIP con pull-down a las entradas A (7), B (1), C (2), D (6); A es el bit de menor peso.'], ['Salidas', 'a–g (13 a 9 y 15, 14) → 330 Ω → segmentos del display.'], ['Común', 'Común del display a tierra (cátodo común).'], ['Prueba', 'Marca 0000 a 1001 y luego 1010 a 1111.']], tabla: { cab: ['DCBA', 'Número mostrado'], filas: 16 }, revisa: ['0 a 9 correctos', 'Qué pasa con los códigos de 10 a 15'], seguridad: 'Confirma las terminales con la hoja de datos de tu CD4511 antes de energizar.', entrega: 'Tabla y foto del display con tu número de lista.' },
      ideas: ['m1-dip-display'], pre: 'CD4511 · BCD · segmento' },
    { id: 'm1c-ff-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Flip-flops y reloj', obj: 'Explicar cómo un flip-flop guarda un bit y cómo se genera el reloj.', ac: 0, dc: 3, tema: 'm1-flipflop',
      pasos: [[45, 'Tema en proyector.'], [35, 'Diagramas de tiempo en la libreta: D y JK con un reloj dado.'], [20, 'Demostración: rebote de un botón con un contador (cuenta de más).']], ideas: ['m1-reloj-555'], pre: 'flanco · toggle · rebote' },
    { id: 'm1c-ff-sim', h: 2, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Flip-flops y divisores en el simulador', obj: 'Comprobar el flip-flop D, el JK en toggle y un divisor de frecuencia.', ac: 1, dc: 0, tema: 'm1-flipflop', dep: ['m1c-ff-c'],
      pasos: [[10, 'Reloj en el simulador.'], [55, 'Arman D y JK; luego 3 flip-flops en toggle y observan la división entre 2, 4 y 8.'], [25, 'Diagrama de tiempo de lo observado.'], [10, 'Entrega.']],
      ev: 'Divisor de frecuencia simulado con su diagrama de tiempo (Producto)', pre: 'reloj · D · JK' },
    { id: 'm1c-contadores-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Contadores ascendentes y descendentes', obj: 'Determinar la secuencia de contadores síncronos y asíncronos.', ac: 0, dc: 3, tema: 'm1-contadores',
      pasos: [[45, 'Tema en proyector.'], [40, 'Ejercicios: secuencias, módulos y elección de integrado.'], [15, 'Boleto de salida.']], pre: 'módulo · década · síncrono' },
    { id: 'm1c-contadores-sim', h: 2, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Contador de 0 a 9 en el simulador', obj: 'Simular un contador de década ascendente y descendente con display.', ac: 0, dc: 3, tema: 'm1-contadores', dep: ['m1c-contadores-c'],
      pasos: [[10, 'Indicaciones.'], [60, 'Simulan el contador de década con display y su versión descendente.'], [20, 'Escriben la secuencia y el diagrama de estados.'], [10, 'Entrega.']],
      ev: 'Diagrama del contador con su secuencia (Producto · actividad clave)',
      guia: { sw: 'CircuitVerse o Logisim Evolution', link: 'https://circuitverse.org/simulator', pasos: [['Reloj', 'Coloca un reloj (Clock) de 1 Hz.'], ['Contador', 'Usa 4 flip-flops (o el contador de la biblioteca) con reinicio al llegar a 10.'], ['Display', 'Conecta las 4 salidas a un display hexadecimal o de 7 segmentos con decodificador.'], ['Ascendente', 'Comprueba 0, 1, 2… 9, 0.'], ['Descendente', 'Cambia la conexión o el modo para contar 9, 8… 0.']], revisa: ['Secuencia completa en ambos sentidos', 'Reinicio después del 9'], entrega: 'Capturas, secuencia y diagrama de estados.' },
      pre: 'secuencia · década · display' },
    { id: 'm1c-diagrama-proy', h: 2, m: 'd', tipo: 'Proyecto', t: 'Diagrama del contador de piezas', obj: 'Elaborar el diagrama completo del proyecto con integrados y terminales.', ac: 0, dc: 3, tema: 'm1-contadores',
      pasos: [[15, 'Bloques: sensor → antirrebote (555) → contador → decodificador → display, con reset.'], [70, 'Equipos: diagrama completo con terminales numeradas y lista de material.'], [15, 'Revisión cruzada entre equipos.']],
      ev: 'Diagrama del circuito digital del proyecto (Producto)', pre: 'bloques · antirrebote · reset' },
    { id: 'm1c-sensor', h: 2, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Práctica', t: 'Sensor de piezas con antirrebote', obj: 'Generar un pulso limpio por cada pieza con un 555 monostable.', ac: 1, dc: 2, tema: 'm1-flipflop', dep: ['m1c-ff-c'],
      pasos: [[15, 'Repaso del 555 monostable del 2º parcial.'], [60, 'Arman el sensor (botón o LDR con LED) y el monostable; prueban con un LED que se encienda un momento por cada pieza.'], [25, 'Ajustan el tiempo del pulso (R y C).']],
      mat: 'NE555, botón o LDR, LED, resistores, capacitores, protoboard, fuente de 5 V.', ev: 'Pulso limpio por cada pieza (Desempeño)', pre: 'monostable · pulso · antirrebote' },
    { id: 'm1c-proto-proy', h: 3, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Proyecto', t: 'El contador en protoboard', obj: 'Armar el contador de piezas completo en protoboard.', ac: 1, dc: 1, tema: 'm1-contadores', dep: ['m1c-diagrama-proy', 'm1c-sensor', 'm1c-7seg-lab'],
      pasos: [[10, 'Orden de armado: alimentación, display, decodificador, contador, sensor.'], [110, 'Arman por bloques probando cada uno antes de seguir.'], [30, 'Primera prueba completa.']],
      mat: 'Material del proyecto, protoboard, fuente de 5 V, multímetro.', ev: 'Contador en protoboard (Producto)', ideas: ['bitacora-fallas'], pre: 'por bloques · prueba · conteo' },
    { id: 'm1c-fallas-dig', h: 1, m: 'd', tipo: 'Teoría', t: 'Fallas típicas en circuitos digitales', obj: 'Diagnosticar fallas digitales con método.', ac: 1, dc: 1, tema: 'm1-ci-digital',
      pasos: [[30, 'Galería de fallas: integrado girado, sin tierra, entrada al aire, rebote, display de otro tipo.'], [15, 'Diagnóstico en parejas de 3 casos.'], [5, 'Boleto de salida.']], ideas: ['galeria-errores'], pre: 'flotante · rebote · alimentación' },
    { id: 'm1c-proto-proy2', h: 3, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Proyecto', t: 'Pruebas, ajuste y validación del contador', obj: 'Validar el conteo, el reset y el sensor y documentar las fallas.', ac: 1, dc: 2, tema: 'm1-contadores', dep: ['m1c-proto-proy'],
      pasos: [[100, 'Pasan 30 «piezas» y comparan el conteo; corrigen rebotes y fallas.'], [35, 'Bitácora de fallas.'], [15, 'Semáforo de avance.']],
      ev: 'Contador validado y bitácora (Producto · actividad clave)', ideas: ['bitacora-fallas', 'semaforo'], pre: 'validar · bitácora · ajuste' },
    { id: 'm1c-montaje', h: 3, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Taller', t: 'Montaje final del contador', obj: 'Pasar el contador a placa perforada (o PCB) soldando con calidad.', ac: 1, dc: 1, dep: ['m1c-proto-proy2'],
      pasos: [[15, 'Acomodo en papel cuadriculado con bases DIP.'], [115, 'Sueldan en placa perforada usando bases para los integrados.'], [20, 'Revisión de continuidad y prueba.']],
      mat: 'Placa perforada, bases DIP-14 y DIP-16, cautín, soldadura, alambre, multímetro.', ev: 'Contador montado en placa (Producto)', pre: 'base DIP · soldadura · placa perforada' },
    { id: 'm1c-gabinete', h: 2, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Proyecto', t: 'Gabinete y presentación', obj: 'Montar el contador en un gabinete funcional.', ac: 1, dc: 1, dep: ['m1c-montaje'],
      pasos: [[80, 'Gabinete con ventana para el display, botón de reset y acceso al sensor.'], [20, 'Prueba final.']],
      mat: 'Caja reutilizada o MDF (cortadora láser si hay), tornillos, pegamento.', ev: 'Contador en su gabinete (Producto)', ideas: ['m1-laser-gabinete'], pre: 'gabinete · ventana · montaje' },
    { id: 'm1c-doc', h: 2, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Documentación técnica del contador', obj: 'Documentar diagrama, tablas, secuencia, fallas y fotos.', ac: 0, dc: 3, dep: ['m1c-diagrama-proy'],
      pasos: [[80, 'Documento: diagrama, tabla de verdad o secuencia, lista de materiales con costo, bitácora y fotos.'], [20, 'Revisión cruzada.']],
      ev: 'Documentación técnica del contador (Producto)', pre: 'documentación · secuencia · costo' },
    { id: 'm1c-industria', h: 1, m: 'd', tipo: 'Formación', t: 'Lo digital en la industria', obj: 'Conectar lo aprendido con el trabajo de un técnico.', ac: null,
      pasos: [[30, 'Video o charla: contadores de producción, PLC y lógica de seguridad.'], [20, '¿Dónde voy a trabajar? Mapa del Bajío industrial.']], ideas: ['pr-carreras', 'industria-real'] },
    { id: 'm1c-ensayo', h: 1, m: 'd', tipo: 'Proyecto', t: 'Ensayo de la exposición', obj: 'Preparar una exposición clara del contador.', ac: null,
      pasos: [[10, 'Estructura de la exposición.'], [35, 'Ensayan con retroalimentación de otro equipo.'], [5, 'Orden de pase.']], ideas: ['pr-explica-60'] },
    { id: 'm1c-expo', h: 3, m: 'c', tipo: 'Proyecto', t: 'Exposición y pruebas del contador', obj: 'Demostrar el contador funcionando y explicar su diseño.', ac: 1, dc: 2,
      pasos: [[120, 'Cada equipo expone y cuenta 20 piezas frente al grupo.'], [30, 'Coevaluación con lista de cotejo.']], ev: 'Circuito digital en funcionamiento y exposición (Desempeño)', ideas: ['coevaluacion'] },
    { id: 'm1c-plenaria', h: 1, m: 'c', tipo: 'Evaluación', t: 'Plenaria del módulo', obj: 'Recapitular el módulo: de medir un circuito a diseñar uno digital.', ac: null,
      pasos: [[35, 'Mapa mental colectivo del módulo.'], [15, 'Lo que sigue en 3er semestre.']], ideas: ['pr-mapa-mental'] },
    { id: 'examen-m1s3', h: 2, m: 'c', tipo: 'Evaluación', t: 'Examen del 3er parcial', obj: 'Evaluar los conocimientos del submódulo.', ac: null,
      pasos: [[10, 'Indicaciones y respiración.'], [80, 'Examen escrito (Escuadra lo arma con los temas que diste).'], [10, 'Cierre.']], ev: 'Examen del parcial', ideas: ['pr-respira'] },
    { id: 'm1c-retro', h: 2, m: 'c', tipo: 'Evaluación', t: 'Retroalimentación y recuperación', obj: 'Corregir errores del examen y recuperar evidencias.', ac: null,
      pasos: [[30, 'Errores comunes del examen sin nombres.'], [50, 'Recuperación de evidencias.'], [20, 'Revisión de calificaciones.']] },
    { id: 'm1c-portafolio', h: 2, m: 'c', lugar: 'computo', tipo: 'Cómputo', t: 'Portafolio digital del semestre', obj: 'Reunir las evidencias del módulo y revisar la calificación final.', ac: null,
      pasos: [[70, 'Portafolio: expediente técnico, placa del intermitente y contador, fotos y bitácoras.'], [30, 'Mientras, revisas la calificación con cada alumno.']] },
    { id: 'm1c-cierre', h: 1, m: 'c', tipo: 'Formación', t: 'Cierre del semestre: mi yo de 25 años', obj: 'Conectar lo aprendido con su proyecto de vida.', ac: null,
      pasos: [[30, 'Mi yo de 25 años.'], [15, 'Muro de logros del semestre.'], [5, 'Despedida.']], ideas: ['pr-yo-25', 'pr-muro-logros'] }
  ];

  /* =================== BANCO =================== */
  const GATES = { AND: (a, b) => a & b, OR: (a, b) => a | b, NAND: (a, b) => 1 - (a & b), NOR: (a, b) => 1 - (a | b), XOR: (a, b) => a ^ b };
  const gen = {
    m1bin2dec: rnd => { const n = Math.floor(rnd() * 200) + 5, b = bin(n);
      return { q: '¿Cuánto vale el número binario ' + b + ' en decimal?', op: ops(String(n), [String(n + 1), String(n - 1), String(parseInt(b.split('').reverse().join(''), 2))], [String(n * 2), String(n + 8)]), r: 'Se suman los pesos donde hay 1: ' + b.split('').map((c, i) => c === '1' ? Math.pow(2, b.length - 1 - i) : null).filter(x => x != null).join(' + ') + ' = ' + n + '.' }; },
    m1dec2bin: rnd => { const n = Math.floor(rnd() * 120) + 6, b = bin(n);
      return { q: '¿Cómo se escribe ' + n + ' en binario?', op: ops(b, [bin(n + 1), bin(n - 1), b.split('').reverse().join('')], [bin(n ^ 2), bin(n ^ 4), bin(n + 2)]), r: n + ' = ' + b.split('').map((c, i) => c === '1' ? Math.pow(2, b.length - 1 - i) : null).filter(x => x != null).join(' + ') + ' → ' + b + '.' }; },
    m1hex: rnd => { const n = Math.floor(rnd() * 240) + 16, h = n.toString(16).toUpperCase();
      if (rnd() < 0.5) return { q: '¿Cuánto vale el hexadecimal ' + h + ' en decimal?', op: ops(String(n), [String(parseInt(h, 10) || n + 10), String(n + 16), String(n - 1)], [String(n + 1), String(n * 2)]), r: h.split('').map((c, i) => parseInt(c, 16) + '×16^' + (h.length - 1 - i)).join(' + ') + ' = ' + n + '.' };
      return { q: '¿Cómo se escribe el binario ' + bin(n, 8) + ' en hexadecimal?', op: ops(h, [(n + 1).toString(16).toUpperCase(), (n ^ 16).toString(16).toUpperCase(), (n ^ 1).toString(16).toUpperCase()], [(n + 17).toString(16).toUpperCase()]), r: 'Grupos de 4 bits: ' + bin(n, 8).slice(0, 4) + ' ' + bin(n, 8).slice(4) + ' → ' + h + '.' }; },
    m1bcd: rnd => { const n = Math.floor(rnd() * 90) + 10, s = String(n), bcd = s.split('').map(c => bin(Number(c), 4)).join(' ');
      return { q: '¿Cómo se escribe ' + n + ' en BCD?', op: ops(bcd, [bin(n, 8).replace(/(\d{4})(\d{4})/, '$1 $2'), s.split('').reverse().map(c => bin(Number(c), 4)).join(' '), s.split('').map(c => bin((Number(c) + 1) % 10, 4)).join(' ')], [bin(n + 1, 8).replace(/(\d{4})(\d{4})/, '$1 $2')]), r: 'Cada dígito en 4 bits: ' + s.split('').map(c => c + ' = ' + bin(Number(c), 4)).join(', ') + ' → ' + bcd + '.' }; },
    m1compuerta: rnd => { const g = pick(rnd, Object.keys(GATES)), a = rnd() < 0.5 ? 1 : 0, b = rnd() < 0.5 ? 1 : 0, y = GATES[g](a, b);
      return { q: 'Una compuerta ' + g + ' de 2 entradas recibe A = ' + a + ' y B = ' + b + '. ¿Qué sale?', op: ops(String(y), [String(1 - y)], ['Depende del reloj', 'Queda flotante']), r: g + ': ' + ({ AND: '1 solo si ambas son 1', OR: '1 si alguna es 1', NAND: 'AND invertida', NOR: 'OR invertida', XOR: '1 si son distintas' })[g] + ' → ' + y + '.' }; },
    m1expr: rnd => { const a = rnd() < 0.5 ? 1 : 0, b = rnd() < 0.5 ? 1 : 0, c = rnd() < 0.5 ? 1 : 0, ex = pick(rnd, [['A·B + C', (a & b) | c], ['A + B·C', a | (b & c)], ['(A + B)·C', (a | b) & c], ["A′·B + C", ((1 - a) & b) | c], ['A·B + A·C + B·C', (a & b) | (a & c) | (b & c)]]);
      return { q: 'Si A = ' + a + ', B = ' + b + ' y C = ' + c + ', ¿cuánto vale F = ' + ex[0] + '?', op: ops(String(ex[1]), [String(1 - ex[1])], ['No se puede saber', 'Vale 2']), r: 'Sustituye y evalúa: AND (·) primero y luego OR (+); ′ invierte → F = ' + ex[1] + '.' }; },
    m1estados: rnd => { const n = pick(rnd, [2, 3, 4, 5, 6]), fin = Math.pow(2, n);
      return { q: 'Un contador binario de ' + n + ' flip-flops, ¿cuántos estados tiene y hasta qué número cuenta?', op: ops(fin + ' estados (0 a ' + (fin - 1) + ')', [n * 2 + ' estados (0 a ' + (n * 2 - 1) + ')', fin + ' estados (1 a ' + fin + ')', (fin * 2) + ' estados (0 a ' + (fin * 2 - 1) + ')'], [n + ' estados (0 a ' + (n - 1) + ')']), r: '2^' + n + ' = ' + fin + ' estados: del 0 al ' + (fin - 1) + '.' }; },
    m1divfrec: rnd => { const n = pick(rnd, [1, 2, 3, 4, 5]), fin = pick(rnd, [16, 32, 64, 100, 128, 1000]), fo = fin / Math.pow(2, n);
      return { q: 'Un reloj de ' + fin + ' Hz pasa por ' + n + ' flip-flop' + (n > 1 ? 's' : '') + ' en toggle conectados en cadena. ¿Qué frecuencia sale del último?', op: ops(f(fo, 3) + ' Hz', [f(fin / (2 * n), 3) + ' Hz', f(fin * Math.pow(2, n), 0) + ' Hz', f(fin / n, 3) + ' Hz'], [f(fo * 2, 3) + ' Hz', f(fin - n, 0) + ' Hz', f(fo / 2, 3) + ' Hz', f(fin * 2, 0) + ' Hz']), r: 'Cada flip-flop en toggle divide entre 2: ' + fin + ' / 2^' + n + ' = ' + f(fo, 3) + ' Hz.' }; }
  };
  const banco = [
    { id: 'm1g1', tema: 'm1-digital', tipo: 'om', niv: 1, q: '¿Cuántos estados tiene una señal digital?', op: ['Dos', 'Diez', 'Infinitos', 'Tres'] },
    { id: 'm1g2', tema: 'm1-digital', tipo: 'om', niv: 2, q: 'Con TTL a 5 V, una entrada de 0.4 V se lee como…', op: ['0 (bajo)', '1 (alto)', 'Zona prohibida', 'Error'] },
    { id: 'm1g3', tema: 'm1-digital', tipo: 'om', niv: 1, q: '¿Cuántos bits forman un byte?', op: ['8', '4', '2', '16'] },
    { id: 'm1g4', tema: 'm1-digital', tipo: 'vf', niv: 2, q: 'La temperatura de un horno es una señal digital.', v: false, exp: 'Puede tomar cualquier valor: es analógica.' },
    { id: 'm1g5', tema: 'm1-digital', tipo: 'om', niv: 2, q: '¿Cuál es una ventaja de las señales digitales?', op: ['Resisten el ruido y se copian sin errores', 'Pueden tomar cualquier valor', 'No necesitan alimentación', 'Son más lentas'] },
    { id: 'm1n1', tema: 'm1-numeracion', tipo: 'calc', niv: 3, gen: 'm1bin2dec' },
    { id: 'm1n2', tema: 'm1-numeracion', tipo: 'calc', niv: 3, gen: 'm1dec2bin' },
    { id: 'm1n3', tema: 'm1-numeracion', tipo: 'calc', niv: 3, gen: 'm1hex' },
    { id: 'm1n4', tema: 'm1-numeracion', tipo: 'om', niv: 1, q: 'En hexadecimal, la letra C vale…', op: ['12', '13', '11', '14'] },
    { id: 'm1n5', tema: 'm1-numeracion', tipo: 'om', niv: 2, q: '¿Cuántos bits representa un dígito octal?', op: ['3', '4', '2', '8'] },
    { id: 'm1n6', tema: 'm1-numeracion', tipo: 'ab', niv: 2, q: 'Explica el método para pasar 37 a binario.', r: 'Dividir entre 2 y leer los residuos de abajo hacia arriba (o restar pesos): 37 = 32 + 4 + 1 = 100101.' },
    { id: 'm1c7', tema: 'm1-bcd7', tipo: 'calc', niv: 3, gen: 'm1bcd' },
    { id: 'm1c8', tema: 'm1-bcd7', tipo: 'om', niv: 2, q: '¿Cuál NO es un código BCD válido?', op: ['1010', '1001', '0101', '0000'] },
    { id: 'm1c9', tema: 'm1-bcd7', tipo: 'om', niv: 2, q: 'En un display de cátodo común, un segmento se enciende con…', op: ['Un 1 (alto)', 'Un 0 (bajo)', 'Corriente alterna', 'El común a Vcc'] },
    { id: 'm1c10', tema: 'm1-bcd7', tipo: 'om', niv: 2, q: '¿Qué decodificador maneja un display de ánodo común?', op: ['74LS47', 'CD4511', '74LS08', 'NE555'] },
    { id: 'm1c11', tema: 'm1-bcd7', tipo: 'vf', niv: 1, q: 'Cada segmento del display necesita su resistor limitador.', v: true, exp: 'Son LED: cada uno limita su corriente.' },
    { id: 'm1c12', tema: 'm1-bcd7', tipo: 'om', niv: 1, q: '¿Cuántos segmentos tiene un display de 7 segmentos (sin el punto)?', op: ['7', '8', '10', '4'] },
    { id: 'm1q1', tema: 'm1-compuertas', tipo: 'calc', niv: 2, gen: 'm1compuerta' },
    { id: 'm1q2', tema: 'm1-compuertas', tipo: 'om', niv: 1, q: '¿Qué compuerta da 1 solo cuando todas sus entradas son 1?', op: ['AND', 'OR', 'NOR', 'XOR'] },
    { id: 'm1q3', tema: 'm1-compuertas', tipo: 'om', niv: 2, q: '¿Qué compuerta da 1 cuando sus entradas son distintas?', op: ['XOR', 'AND', 'NAND', 'NOT'] },
    { id: 'm1q4', tema: 'm1-compuertas', tipo: 'om', niv: 1, q: 'En un 74LS de 14 terminales, ¿dónde van Vcc y tierra?', op: ['14 Vcc y 7 tierra', '1 Vcc y 14 tierra', '7 Vcc y 14 tierra', '8 Vcc y 1 tierra'] },
    { id: 'm1q5', tema: 'm1-compuertas', tipo: 'om', niv: 2, q: '¿Qué integrado trae 4 compuertas OR?', op: ['74LS32', '74LS08', '74LS04', '74LS00'] },
    { id: 'm1q6', tema: 'm1-compuertas', tipo: 'vf', niv: 2, q: 'Con solo compuertas NAND se puede construir cualquier circuito lógico.', v: true, exp: 'Por eso se llama compuerta universal.' },
    { id: 'm1o7', tema: 'm1-boole', tipo: 'calc', niv: 3, gen: 'm1expr' },
    { id: 'm1o8', tema: 'm1-boole', tipo: 'om', niv: 2, q: 'Simplifica A + A·B.', op: ['A', 'B', 'A·B', '1'] },
    { id: 'm1o9', tema: 'm1-boole', tipo: 'om', niv: 2, q: 'Según De Morgan, (A·B)′ es igual a…', op: ["A′ + B′", "A′·B′", 'A + B', "(A + B)′"] },
    { id: 'm1o10', tema: 'm1-boole', tipo: 'om', niv: 1, q: '¿Cuántos renglones tiene la tabla de verdad de 4 entradas?', op: ['16', '8', '4', '32'] },
    { id: 'm1o11', tema: 'm1-boole', tipo: 'ab', niv: 3, q: 'Escribe la tabla de verdad y la expresión simplificada de la votación de 3 jueces (sale 1 si al menos 2 votan 1).', r: 'Unos en 011, 101, 110 y 111; F = AB + AC + BC.' },
    { id: 'm1o12', tema: 'm1-boole', tipo: 'om', niv: 1, q: '¿Cuánto vale A·A′?', op: ['0', '1', 'A', "A′"] },
    { id: 'm1k6', tema: 'm1-karnaugh', tipo: 'om', niv: 1, q: '¿En qué orden se escriben las columnas de 2 variables en un mapa de Karnaugh?', op: ['00, 01, 11, 10', '00, 01, 10, 11', '11, 10, 01, 00', '01, 10, 00, 11'] },
    { id: 'm1k7', tema: 'm1-karnaugh', tipo: 'om', niv: 2, q: '¿Cuál NO es un tamaño válido de grupo en un mapa de Karnaugh?', op: ['3 casillas', '2 casillas', '4 casillas', '8 casillas'] },
    { id: 'm1k8', tema: 'm1-karnaugh', tipo: 'om', niv: 2, q: 'Un grupo de 4 casillas elimina…', op: ['2 variables', '1 variable', '4 variables', 'Ninguna variable'] },
    { id: 'm1k9', tema: 'm1-karnaugh', tipo: 'vf', niv: 2, q: 'Las casillas de las orillas opuestas de un mapa de Karnaugh son vecinas.', v: true, exp: 'El mapa «da la vuelta»: difieren en una sola variable.' },
    { id: 'm1k10', tema: 'm1-karnaugh', tipo: 'om', niv: 3, q: 'En un mapa de 3 variables hay 1 en las casillas 100, 101, 110 y 111 (A = 1). La expresión simplificada es…', op: ['F = A', 'F = A·B', "F = A′", 'F = B + C'] },
    { id: 'm1k11', tema: 'm1-karnaugh', tipo: 'om', niv: 2, q: 'Las condiciones «no importa» (X) se usan…', op: ['Como 1 o 0, según ayuden a hacer grupos más grandes', 'Siempre como 1', 'Siempre como 0', 'Nunca'] },
    { id: 'm1e1', tema: 'm1-diseno', tipo: 'om', niv: 1, q: '¿Cuál es el primer paso para diseñar un circuito combinacional?', op: ['Definir entradas y salidas del problema', 'Comprar los integrados', 'Soldar', 'Simular'] },
    { id: 'm1e2', tema: 'm1-diseno', tipo: 'om', niv: 2, q: '¿Para qué sirve un resistor pull-down en una entrada con interruptor?', op: ['Para que la entrada valga 0 con el interruptor abierto', 'Para aumentar la velocidad', 'Para encender el LED', 'Para sumar 1'] },
    { id: 'm1e3', tema: 'm1-diseno', tipo: 'om', niv: 3, q: 'Una prensa debe bajar si el botón izquierdo (A) Y el derecho (B) están oprimidos Y la guarda (G) está cerrada. La expresión es…', op: ['F = A·B·G', 'F = A + B + G', 'F = A·B + G', "F = (A·B·G)′"] },
    { id: 'm1e4', tema: 'm1-diseno', tipo: 'vf', niv: 2, q: 'Validar un circuito es comprobar en el circuito real cada renglón de la tabla de verdad.', v: true, exp: 'Renglón por renglón con los interruptores DIP.' },
    { id: 'm1e5', tema: 'm1-diseno', tipo: 'ab', niv: 3, q: 'Diseña la lógica de un acceso que abre si se usan las dos llaves (A y B) o si el guardia oprime su botón (G). Da la expresión y las compuertas.', r: 'F = A·B + G: una AND (74LS08) y una OR (74LS32).' },
    { id: 'm1i1', tema: 'm1-ci-digital', tipo: 'om', niv: 1, q: '¿Qué indica la muesca de un circuito integrado?', op: ['Dónde está la terminal 1', 'Dónde va la tierra', 'Que está dañado', 'La familia lógica'] },
    { id: 'm1i2', tema: 'm1-ci-digital', tipo: 'om', niv: 2, q: '¿Por qué no se dejan entradas al aire?', op: ['Su valor es incierto y el circuito falla', 'Consumen más energía de la pila', 'Porque se ven mal', 'Para que el circuito sea más rápido'] },
    { id: 'm1i3', tema: 'm1-ci-digital', tipo: 'om', niv: 2, q: '¿Con qué voltaje trabaja la familia 74LS?', op: ['5 V', '12 V', '3 V', '24 V'] },
    { id: 'm1i4', tema: 'm1-ci-digital', tipo: 'vf', niv: 2, q: 'Un capacitor de 0.1 µF entre Vcc y tierra cerca del integrado ayuda a filtrar ruido.', v: true, exp: 'Es el capacitor de desacoplo.' },
    { id: 'm1i5', tema: 'm1-ci-digital', tipo: 'ab', niv: 3, q: 'Tu circuito con un 74LS08 no funciona. Menciona 4 revisiones en orden.', r: 'Medir 5 V entre 14 y 7; revisar la orientación (muesca); revisar entradas al aire o pull-down; probar cada entrada y salida contra la tabla.' },
    { id: 'm1j1', tema: 'm1-flipflop', tipo: 'om', niv: 1, q: '¿Cuántos bits guarda un flip-flop?', op: ['1', '2', '4', '8'] },
    { id: 'm1j2', tema: 'm1-flipflop', tipo: 'om', niv: 2, q: 'En un flip-flop JK con J = K = 1, la salida…', op: ['Cambia de estado en cada pulso', 'Se queda en 1', 'Se queda en 0', 'Se desconecta'] },
    { id: 'm1j3', tema: 'm1-flipflop', tipo: 'calc', niv: 3, gen: 'm1divfrec' },
    { id: 'm1j4', tema: 'm1-flipflop', tipo: 'om', niv: 2, q: '¿Qué es el rebote de un botón?', op: ['Varios pulsos falsos al oprimirlo', 'Que el botón regresa', 'Una falla del integrado', 'El sonido del botón'] },
    { id: 'm1j5', tema: 'm1-flipflop', tipo: 'vf', niv: 2, q: 'El flip-flop D copia su entrada a la salida en el flanco del reloj.', v: true, exp: 'En el instante en que el reloj sube (flanco de subida).' },
    { id: 'm1t1', tema: 'm1-contadores', tipo: 'calc', niv: 3, gen: 'm1estados' },
    { id: 'm1t2', tema: 'm1-contadores', tipo: 'om', niv: 1, q: 'Un contador de década cuenta…', op: ['De 0 a 9 y reinicia', 'De 0 a 15', 'De 1 a 10', 'De 0 a 99'] },
    { id: 'm1t3', tema: 'm1-contadores', tipo: 'om', niv: 2, q: 'En un contador síncrono…', op: ['Todos los flip-flops reciben el mismo reloj', 'El reloj pasa de un flip-flop al siguiente', 'No hay reloj', 'Solo cuenta hacia abajo'] },
    { id: 'm1t4', tema: 'm1-contadores', tipo: 'om', niv: 2, q: '¿Qué integrado cuenta hacia arriba y hacia abajo?', op: ['74LS193', '74LS08', 'CD4511', '74LS47'] },
    { id: 'm1t5', tema: 'm1-contadores', tipo: 'ab', niv: 3, q: 'Dibuja en bloques un contador de piezas de 0 a 9 con display y explica qué hace cada bloque.', r: 'Sensor → antirrebote (555 monostable) → contador de década → decodificador (CD4511) → display; botón de reset al contador.' }
  ];

  const ideas = [
    { id: 'm1-dedos-binarios', titulo: 'Tarjetas binarias de puntos', sm: ['I-3'], tipo: 'Dinámica', dur: '15 min', costo: 'Bajo', obj: 'Entender los pesos binarios jugando.', mat: ['5 tarjetas grandes con 1, 2, 4, 8 y 16 puntos'],
      pasos: ['5 voluntarios al frente con las tarjetas.', 'El grupo dice un número y ellos voltean las tarjetas necesarias.', 'Cada tarjeta boca arriba es un 1.', 'Reto: ¿cuál es el número más grande con 5 tarjetas?'], evid: 'Números formados en la libreta', tip: 'Es la actividad «Contar los puntos» de CS Unplugged: funciona sin computadora.' },
    { id: 'm1-compuertas-humanas', titulo: 'Compuertas humanas', sm: ['I-3'], tipo: 'Dinámica', dur: '15 min', costo: '$0', obj: 'Vivir la tabla de verdad antes de memorizarla.', mat: ['Tarjetas 0 y 1'],
      pasos: ['Dos alumnos son entradas (levantan 0 o 1).', 'Un tercero es la compuerta y responde según su regla.', 'El grupo comprueba con la tabla.', 'Encadenan dos compuertas para formar AB + C.'], evid: 'Tablas en la libreta', tip: 'Cambia la compuerta sin decir cuál es: que el grupo la adivine por sus respuestas.' },
    { id: 'm1-jueces', titulo: 'Votación de 3 jueces', sm: ['I-3'], tipo: 'Práctica', dur: '50 min', costo: 'Bajo', obj: 'Diseño combinacional completo con un problema conocido.', mat: ['74LS08 y 74LS32 (o 74LS00)', 'DIP', 'LED'],
      pasos: ['Tabla de verdad (8 renglones).', 'Karnaugh: F = AB + AC + BC.', 'Simulación y armado.', 'Versión solo con NAND.'], evid: 'Circuito validado', tip: 'Haz que voten en serio (por ejemplo, el mejor proyecto) con su circuito.' },
    { id: 'm1-karnaugh-tapete', titulo: 'Tapete de Karnaugh con fichas', sm: ['I-3'], tipo: 'Dinámica', dur: '30 min', costo: 'Bajo', obj: 'Agrupar visualmente sin borrar.', mat: ['Cuadrículas impresas de 2×4 y 4×4', 'Fichas o tapas de colores'],
      pasos: ['Colocan fichas en los 1 de la tabla.', 'Encierran grupos con ligas o estambre.', 'Escriben el término de cada grupo.', 'Comparan con otro equipo.'], evid: 'Expresiones simplificadas', tip: 'Las ligas que «dan la vuelta» al tapete hacen visible que las orillas son vecinas.' },
    { id: 'm1-reto-diseno', titulo: 'Retos de diseño industrial', sm: ['I-3'], tipo: 'Proyecto', dur: '2 h', costo: '$0', obj: 'Diseñar lógica para problemas reales de planta.', mat: ['Tarjetas de reto'],
      pasos: ['Prensa segura: dos manos y guarda cerrada.', 'Cisterna: bomba si nivel bajo y no hay falla.', 'Acceso: dos llaves o el guardia.', 'Semáforo simple de un cruce.'], evid: 'Diagrama con integrados', tip: 'Son los mismos interbloqueos que programarán en PLC en 4º semestre: guárdenlos.' },
    { id: 'm1-dip-display', titulo: 'Del DIP al display', sm: ['I-3'], tipo: 'Práctica', dur: '50 min', costo: 'Bajo', obj: 'Ver el BCD convertido en un número.', mat: ['CD4511', 'Display de cátodo común', 'DIP de 4'],
      pasos: ['Arma DIP → CD4511 → display.', 'Marca tu número de lista en BCD.', 'Prueba los códigos no válidos.', 'Agrega un segundo dígito si te sobra tiempo.'], evid: 'Foto del display', tip: 'Antes de energizar, comprueben con la función diodo si el display es de cátodo o ánodo común.' },
    { id: 'm1-reloj-555', titulo: 'Reloj lento con 555 para ver la lógica', sm: ['I-3'], tipo: 'Práctica', dur: '20 min', costo: 'Bajo', obj: 'Ver contar a ojo con un reloj de 1 Hz.', mat: ['555 del parcial anterior', 'R y C para 1 Hz'],
      pasos: ['Arma el astable de 1 Hz.', 'Conecta su salida al reloj del contador.', 'Cuenta junto con el display.', 'Cambia C para que cuente más rápido.'], evid: 'Contador contando', tip: 'Reutiliza el intermitente del 2º parcial: su salida ya es un reloj.' },
    { id: 'm1-simulador-celular', titulo: 'Simulador digital en el celular', sm: ['I-3'], tipo: 'Proyector', dur: '10 min', costo: '$0', obj: 'Practicar en casa sin computadora (el programa menciona aplicaciones móviles).', mat: ['Celular con navegador'],
      pasos: ['Abre CircuitVerse desde el navegador del celular.', 'Arma una compuerta y su tabla.', 'Comparte la captura en el grupo.', 'Repite con el diseño de la tarea.'], evid: 'Captura', link: 'https://circuitverse.org/', tip: 'En pantalla chica conviene girar el celular a horizontal.' }
  ];

  /* =================== FIGURAS =================== */
  const d = E.fig.d, ln = d.ln, ci = d.ci, rc = d.rc, tx = d.tx, path = d.path;
  const and = (x, y, cls) => path('M' + x + ' ' + (y - 22) + ' L' + (x + 24) + ' ' + (y - 22) + ' A22 22 0 0 1 ' + (x + 24) + ' ' + (y + 22) + ' L' + x + ' ' + (y + 22) + ' Z', cls || 'fill');
  const or = (x, y, cls) => path('M' + x + ' ' + (y - 22) + ' Q' + (x + 30) + ' ' + (y - 22) + ' ' + (x + 50) + ' ' + y + ' Q' + (x + 30) + ' ' + (y + 22) + ' ' + x + ' ' + (y + 22) + ' Q' + (x + 12) + ' ' + y + ' ' + x + ' ' + (y - 22) + ' Z', cls || 'fill');
  const SEG = { a: [[12, 6], [52, 6]], b: [[56, 10], [56, 50]], c: [[56, 62], [56, 102]], d: [[12, 106], [52, 106]], e: [[8, 62], [8, 102]], f: [[8, 10], [8, 50]], g: [[12, 56], [52, 56]] };
  const DIG = ['abcdef', 'bc', 'abdeg', 'abcdg', 'bcfg', 'acdfg', 'acdefg', 'abc', 'abcdefg', 'abcdfg'];
  const display = (x, y, n) => Object.keys(SEG).map(s => { const on = DIG[n].indexOf(s) >= 0, p = SEG[s]; return '<line x1="' + (x + p[0][0]) + '" y1="' + (y + p[0][1]) + '" x2="' + (x + p[1][0]) + '" y2="' + (y + p[1][1]) + '" stroke-width="8" stroke-linecap="round" style="stroke:' + (on ? '#d23b30' : 'var(--fg-fill)') + '"/>'; }).join('');
  const figs = {
    m1compuertas: { t: 'Compuertas AND y OR', d: 'La AND da 1 solo si ambas entradas son 1; la OR da 1 si alguna es 1.', w: 480, h: 220, anim: true, draw: t => {
      const k = Math.floor(t / 1.2) % 4, a = (k >> 1) & 1, b = k & 1, col = v => v ? 'ta' : 'tm';
      let s = and(90, 80) + ln([50, 66], [90, 66], 'k2') + ln([50, 94], [90, 94], 'k2') + ln([136, 80], [170, 80], a & b ? 'a' : 'k2') + tx([110, 130], 'AND', 'tb');
      s += or(300, 80) + ln([260, 66], [306, 66], 'k2') + ln([260, 94], [306, 94], 'k2') + ln([350, 80], [390, 80], a | b ? 'a' : 'k2') + tx([325, 130], 'OR', 'tb');
      s += tx([40, 70], 'A=' + a, col(a), 'end') + tx([40, 98], 'B=' + b, col(b), 'end') + tx([250, 70], 'A=' + a, col(a), 'end') + tx([250, 98], 'B=' + b, col(b), 'end');
      s += ci([185, 80], 11, a & b ? 'fillA' : 'fill2') + ci([405, 80], 11, a | b ? 'fillA' : 'fill2');
      return s + tx([240, 180], 'Entradas: ' + a + b + ' → AND = ' + (a & b) + ' · OR = ' + (a | b), 'tb') + tx([240, 204], 'Las entradas recorren 00, 01, 10 y 11', 'tm');
    } },
    m1display: { t: 'Display de 7 segmentos con BCD', d: 'Cada número decimal en BCD (4 bits) enciende sus segmentos a–g a través del decodificador.', w: 480, h: 200, anim: true, draw: t => {
      const n = Math.floor(t / 1.1) % 10; let s = display(320, 40, n) + tx([350, 175], 'Display', 'tm');
      s += rc(170, 50, 90, 100, 'fill', 6) + tx([215, 105], 'CD4511', 'tb') + ln([260, 100], [300, 100], 'k2') + tx([280, 92], 'a–g', 'tm');
      const b = bin(n, 4); ['D', 'C', 'B', 'A'].forEach((nm, i) => { s += ln([120, 62 + i * 25], [170, 62 + i * 25], b[i] === '1' ? 'a' : 'k2') + tx([110, 66 + i * 25], nm + '=' + b[i], b[i] === '1' ? 'ta' : 'tm', 'end'); });
      return s + tx([60, 30], 'BCD: ' + b + ' = ' + n, 'tb', 'start');
    } },
    m1karnaugh: { t: 'Mapa de Karnaugh: mayoría de 3', d: 'Columnas BC en código Gray (00, 01, 11, 10); tres grupos de 2 dan F = AB + AC + BC.', w: 480, h: 220, anim: false, draw: () => {
      const X = 150, Y = 60, W = 60, Hh = 50, cols = ['00', '01', '11', '10'], val = [[0, 0, 1, 0], [0, 1, 1, 1]];
      let s = tx([X - 30, Y - 14], 'A \\ BC', 'tm', 'end');
      cols.forEach((c, j) => { s += tx([X + j * W + W / 2, Y - 14], c, 'tb'); });
      [0, 1].forEach(i => { s += tx([X - 14, Y + i * Hh + Hh / 2 + 5], String(i), 'tb', 'end'); cols.forEach((c, j) => { s += rc(X + j * W, Y + i * Hh, W, Hh, 'none2') + tx([X + j * W + W / 2, Y + i * Hh + Hh / 2 + 6], String(val[i][j]), val[i][j] ? 'ta' : 'tm'); }); });
      s += rc(X + 2 * W + 6, Y + 6, W - 12, 2 * Hh - 12, 'none3', 14) + rc(X + W + 4, Y + Hh + 8, 2 * W - 8, Hh - 16, 'none3', 14) + rc(X + 2 * W + 4, Y + Hh + 4, 2 * W - 8, Hh - 8, 'none3', 14);
      return s + tx([240, 200], 'F = AB + AC + BC', 'tb');
    } }
  };
  const figTema = { 'm1-compuertas': ['m1compuertas'], 'm1-bcd7': ['m1display'], 'm1-contadores': ['m1display'], 'm1-karnaugh': ['m1karnaugh'], 'm1-boole': ['m1karnaugh'] };

  const industria = {
    'm1-compuertas': [['Seguridad de maquinaria', 'El mando a dos manos de una prensa es una función AND: baja solo con ambas manos en los botones.'], ['PLC', 'Los contactos en serie y en paralelo de un programa de escalera son AND y OR.']],
    'm1-contadores': [['Líneas de producción', 'Se cuentan piezas buenas, rechazadas y ciclos de la máquina para los reportes de turno.'], ['Empaque', 'Una máquina cuenta productos y cierra la caja al llegar a la cantidad.']],
    'm1-numeracion': [['Mantenimiento', 'Los códigos de falla de variadores y robots suelen venir en hexadecimal.'], ['Redes industriales', 'Direcciones y datos se leen en binario y hexadecimal.']]
  };
  const proyecto = { nombre: 'Contador de piezas 0–9', et: [['simula', 'Contador simulado', ['m1c-contadores-sim']], ['diagrama', 'Diagrama del proyecto', ['m1c-diagrama-proy']], ['sensor', 'Sensor con antirrebote', ['m1c-sensor']], ['proto', 'Contador en protoboard', ['m1c-proto-proy']], ['valida', 'Validado y bitácora', ['m1c-proto-proy2']], ['monta', 'Montado en placa', ['m1c-montaje']], ['gab', 'Gabinete', ['m1c-gabinete']], ['doc', 'Documentación', ['m1c-doc']]] };
  const recursos = {
    material: ['Circuitos integrados 74LS08, 74LS32, 74LS04, 74LS00 (o equivalentes 74HC)', 'CD4511 o 74LS47, contador de década (74LS90, 74LS193 o CD4026)', 'Display de 7 segmentos (cátodo o ánodo común, según el decodificador)', 'Interruptor DIP de 4, resistores de 330 Ω y 10 kΩ, LED', 'NE555 para reloj y antirrebote', 'Placa perforada y bases DIP'],
    equipo: ['Protoboards', 'Fuente de 5 V (o regulador 7805)', 'Multímetros', 'Cautines con soporte', 'Computadoras con navegador (CircuitVerse) o Logisim Evolution', 'Proyector']
  };
  const plan = {
    diag: 'Cuestionario diagnóstico de transistor, 555, sistemas de numeración y lógica cotidiana',
    form: 'Revisión de conversiones, tablas de verdad, mapas de Karnaugh y simulaciones; guía de observación en el armado',
    sum: 'Diagrama del circuito digital (lista de cotejo), circuito digital en funcionamiento (lista de cotejo), contador de piezas expuesto y examen del parcial',
    practicas: ['Demostrativa: compuertas con DIP y LED; rebote de un botón con un contador.', 'Guiada: tablas de verdad de 74LS08, 74LS32 y 74LS04; display con CD4511.', 'Supervisada: votación de 3 jueces optimizada; contador simulado ascendente y descendente.', 'Autónoma: reto de diseño industrial y contador de piezas validado.'],
    paec: 'Proyecto: «Contador de piezas de 0 a 9 con display»',
    paecEvid: 'Contador funcionando en su gabinete (Producto) y exposición (Desempeño)'
  };

  E.mods.registra('I-3', { temas: temas, clases: clases, banco: banco, gen: gen, ideas: ideas, figs: figs, figTema: figTema, industria: industria, proyecto: proyecto, recursos: recursos, plan: plan });
})();
