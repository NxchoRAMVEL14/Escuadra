/* Escuadra · Módulo III «Programa dispositivos de control» · Submódulo 3: Programa sistemas embebidos (80 h).
   Temas, clases hora por hora, tareas, banco de examen, ideas, figuras y proyecto del 3er parcial de 4º semestre.
   Programa SEP 2024 (Técnico en Mecatrónica), pp. 63-66; recursos didácticos de la carrera (Arduino UNO R3 y Arduino IDE,
   pp. 119-122); bibliografía del módulo (Baker, Thorpe, Arduino UNO R3 documentation) y hojas de datos de los sensores.
   Simuladores gratuitos en el navegador: Wokwi y Tinkercad Circuits. Proyecto: riego automático (Nexo agua-energía-alimento). */
(function () {
  'use strict';
  const E = window.E, H = E.mods.h, f = H.f, pick = H.pick, ops = H.ops;
  const FU = 'Programa SEP 2024, Módulo III, Submódulo 3';
  const AC = ['Inspecciona el funcionamiento interno y cableado del sistema embebido', 'Programa el código para la tarjeta', 'Verifica el funcionamiento del sistema'];

  /* =================== TEMAS =================== */
  const temas = [
    {
      id: 'm3-embebido', sm: 'III-3', ac: AC[0], titulo: '¿Qué es un sistema embebido?', dur: '50 min',
      objetivo: 'Que expliquen qué es un sistema embebido, qué hay dentro de un microcontrolador y dónde se usan.',
      explica: [
        'Un sistema embebido es una computadora pequeña dedicada a una sola tarea y metida dentro de un producto: el control de un microondas, la tarjeta de una lavadora, el módulo que controla el motor de un auto o un termostato. El usuario no lo ve como computadora: solo ve que el aparato «sabe» qué hacer.',
        'Su corazón es un microcontrolador: un circuito integrado que reúne CPU, memoria flash (donde vive el programa), RAM (las variables), EEPROM (datos que no se borran al apagar) y periféricos: pines de entrada y salida, convertidor analógico-digital, temporizadores, PWM y puertos de comunicación (serie, I2C, SPI).',
        'El Arduino Uno usa el ATmega328P a 16 MHz, con 32 KB de flash, 2 KB de RAM y 1 KB de EEPROM. Parece poco, pero alcanza para leer sensores, decidir y mover actuadores miles de veces por segundo.',
        'La diferencia con el PLC del 2º parcial: el PLC es un producto industrial terminado que se programa en lenguajes de la IEC 61131-3; un sistema embebido se diseña a la medida del producto, se programa normalmente en C o C++ y cuesta mucho menos por unidad, por eso está en millones de aparatos.'
      ],
      pantalla: ['Computadora dedicada dentro de un producto', 'Microcontrolador: CPU + memoria + periféricos en un chip', 'Flash = programa · RAM = variables · EEPROM = datos que no se borran', 'Periféricos: pines, ADC, temporizadores, PWM, serie, I2C, SPI', 'Uno: ATmega328P, 16 MHz, 32 KB flash, 2 KB RAM', 'PLC: producto industrial · embebido: a la medida del producto'],
      clave: [['Sistema embebido', 'Computadora dedicada a una tarea dentro de un producto'], ['Microcontrolador', 'Chip con CPU, memoria y periféricos'], ['Memoria flash', 'Donde se guarda el programa; no se borra al apagar'], ['RAM', 'Memoria de trabajo para las variables; se borra al apagar'], ['Periférico', 'Bloque del microcontrolador que interactúa con el exterior: pines, ADC, PWM, serie']],
      ejemplo: { titulo: 'El embebido de una lavadora', pasos: ['Entradas: perilla de programa, botón de inicio, sensor de nivel, sensor de puerta.', 'Proceso: el microcontrolador sigue las etapas del lavado.', 'Salidas: válvula de agua, motor, bomba de desagüe y pantalla.', 'Memoria: guarda el último programa elegido.'], resultado: 'Es la misma idea del PLC, pero en una tarjeta diseñada solo para esa lavadora.' },
      preguntas: [['¿Qué es un sistema embebido?', 'Una computadora pequeña dedicada a una tarea dentro de un producto.'], ['¿En qué memoria se guarda el programa del Arduino?', 'En la memoria flash.'], ['Nombra tres periféricos de un microcontrolador.', 'Pines de E/S, convertidor analógico-digital, PWM, temporizadores o puertos serie, I2C y SPI.'], ['¿Por qué hay tantos sistemas embebidos en el mundo?', 'Porque se diseñan a la medida del producto y cuestan muy poco por unidad.']],
      errores: ['Creer que el Arduino es «una computadora como la de escritorio».', 'Confundir la RAM (variables) con la flash (programa).', 'Pensar que un embebido no se puede reprogramar.', 'Creer que solo los aparatos caros tienen embebidos.'],
      vida: 'Las plantas de electrodomésticos y de autopartes del Bajío prueban, programan y reparan tarjetas embebidas todos los días; un auto moderno trae decenas de ellas.',
      ideas: ['m3-wokwi', 'pr-camara-doc'], fuente: FU + ' (p. 63); Arduino, UNO R3 documentation (docs.arduino.cc); hoja de datos del ATmega328P.'
    },
    {
      id: 'm3-uno-pines', sm: 'III-3', ac: AC[0], titulo: 'Puertos y pines del Arduino Uno', dur: '50 min',
      objetivo: 'Que identifiquen en la tarjeta los pines digitales, PWM, analógicos, de alimentación y de comunicación, con sus límites.',
      explica: [
        'El Uno tiene 14 pines digitales (0 a 13); seis de ellos (3, 5, 6, 9, 10 y 11, marcados con ~) pueden dar PWM. Los pines 0 y 1 son el puerto serie que usa el USB: mejor no usarlos para otra cosa. El pin 13 tiene un LED en la tarjeta.',
        'Tiene 6 entradas analógicas (A0 a A5) que convierten de 0 a 5 V en un número de 0 a 1023. A4 y A5 también son el bus I2C (SDA y SCL), y los pines 10 a 13 el bus SPI, para pantallas y módulos.',
        'Alimentación: por USB (5 V) o por el conector o el pin Vin con 7 a 12 V. Los pines 5V y 3.3V sirven para alimentar sensores pequeños, y GND es la tierra. Cada pin entrega o recibe como máximo unos 20 mA de forma recomendada: alcanza para un LED, no para un motor ni una bobina.',
        'Antes de energizar se revisa el diagrama: ningún pin recibe más de 5 V, ninguna salida está unida directo a GND o a 5 V y todos los GND están unidos. Un error de cableado puede dañar el pin o toda la tarjeta.'
      ],
      pantalla: ['Digitales 0-13 · PWM (~): 3, 5, 6, 9, 10, 11', '0 y 1: serie (USB) · 13: LED de la tarjeta', 'Analógicas A0-A5: 0-5 V → 0-1023', 'I2C: A4 (SDA) y A5 (SCL) · SPI: 10-13', 'Alimentación: USB 5 V o Vin 7-12 V', '~20 mA por pin: LED sí, motor no'],
      clave: [['Pin digital', 'Pin que lee o escribe 0 (LOW) o 1 (HIGH)'], ['PWM', 'Modulación por ancho de pulso: salida que se enciende y apaga rápido para simular un valor intermedio'], ['Entrada analógica', 'Pin que convierte un voltaje de 0 a 5 V en un número de 0 a 1023'], ['Vin', 'Pin de alimentación de entrada de 7 a 12 V'], ['I2C', 'Bus de dos hilos (SDA y SCL) para pantallas y sensores']],
      ejemplo: { titulo: 'Asignar pines al riego automático', pasos: ['Sensor de humedad (analógico) → A0.', 'Potenciómetro del umbral → A1.', 'Botón de riego manual → pin 2.', 'Bomba (por medio de un transistor) → pin 9.', 'LED de estado → pines 6 y 7.'], resultado: 'La tabla de pines se hace antes de cablear y se copia al inicio del programa.' },
      preguntas: [['¿Qué pines del Uno pueden dar PWM?', '3, 5, 6, 9, 10 y 11.'], ['¿Qué números da una entrada analógica?', 'De 0 a 1023 para 0 a 5 V.'], ['¿Por qué no se conecta un motor directo a un pin?', 'Porque el pin entrega unos 20 mA y el motor pide mucho más.'], ['¿Qué pines forman el bus I2C?', 'A4 (SDA) y A5 (SCL).']],
      errores: ['Usar los pines 0 y 1 y luego no poder cargar el programa.', 'Alimentar un motor desde el pin 5V.', 'Meter 12 V a un pin analógico.', 'Olvidar unir los GND de dos fuentes.'],
      vida: 'Antes de diseñar una tarjeta, el ingeniero hace la tabla de pines del microcontrolador; los técnicos la usan después para probar y reparar.',
      ideas: ['m3-tabla-direcciones', 'pr-explica-60'], fuente: FU + ' (p. 63); Arduino, UNO R3 documentation (docs.arduino.cc).'
    },
    {
      id: 'm3-cpp-basico', sm: 'III-3', ac: AC[1], titulo: 'Estructura de un programa de Arduino', dur: '50 min',
      objetivo: 'Que escriban, compilen y carguen programas con setup, loop, variables y las instrucciones básicas de E/S.',
      explica: [
        'Un programa de Arduino (sketch) se escribe en C++ y tiene dos partes obligatorias: setup(), que se ejecuta una sola vez al encender (ahí se configuran los pines), y loop(), que se repite para siempre (ahí va el trabajo). Es el mismo ciclo infinito del PLC.',
        'Las variables guardan datos: int para enteros (-32768 a 32767 en el Uno), float para decimales, bool para verdadero o falso y unsigned long para tiempos largos. Las constantes (const int BOMBA = 9;) dan nombre a los pines y hacen el código legible.',
        'Las instrucciones básicas: pinMode(pin, OUTPUT o INPUT) configura; digitalWrite(pin, HIGH o LOW) escribe; digitalRead(pin) lee; delay(ms) espera. Cada instrucción termina en punto y coma, las llaves { } agrupan, y C++ distingue mayúsculas: digitalwrite no existe.',
        'En el Arduino IDE se verifica (compila) con la palomita y se carga con la flecha, después de elegir la tarjeta (Arduino Uno) y el puerto. Los comentarios (// …) explican qué hace cada parte: el que mantiene el código puede ser otra persona… o tú en seis meses.'
      ],
      pantalla: ['setup(): una vez · loop(): para siempre', 'int, float, bool, unsigned long', 'const int BOMBA = 9; → nombres claros', 'pinMode · digitalWrite · digitalRead · delay', 'Punto y coma, llaves y MAYÚSCULAS importan', 'Verificar (✓) → Cargar (→) · comentarios //'],
      clave: [['Sketch', 'Programa de Arduino'], ['setup()', 'Función que se ejecuta una vez al encender'], ['loop()', 'Función que se repite sin fin'], ['Variable', 'Espacio con nombre que guarda un dato'], ['Compilar', 'Traducir el código a instrucciones del microcontrolador y revisar errores']],
      ejemplo: { titulo: 'Parpadeo con nombres claros', pasos: ['const int LED = 13;', 'void setup() { pinMode(LED, OUTPUT); }', 'void loop() { digitalWrite(LED, HIGH); delay(500); digitalWrite(LED, LOW); delay(500); }', 'Verificar, elegir Arduino Uno y el puerto, cargar.'], resultado: 'El LED de la tarjeta parpadea una vez por segundo.' },
      preguntas: [['¿Qué diferencia hay entre setup() y loop()?', 'setup() corre una vez al encender; loop() se repite sin fin.'], ['¿Qué tipo de variable usarías para guardar millis()?', 'unsigned long.'], ['¿Qué hace pinMode(9, OUTPUT)?', 'Configura el pin 9 como salida.'], ['¿Por qué falla digitalwrite(9, HIGH)?', 'Porque C++ distingue mayúsculas: la instrucción es digitalWrite.']],
      errores: ['Olvidar el punto y coma.', 'Escribir mal las mayúsculas de las instrucciones.', 'No configurar el pin con pinMode.', 'Elegir otra tarjeta u otro puerto al cargar.'],
      vida: 'En la industria el código embebido pasa por revisiones: nombres claros y comentarios son obligatorios porque muchas personas lo mantienen durante años.',
      ideas: ['m3-wokwi', 'm3-pseudocodigo'], fuente: FU + ' (p. 65); Arduino Language Reference (docs.arduino.cc); Baker (2021), Proyectos Arduino; Thorpe (2019), Arduino para principiantes.'
    },
    {
      id: 'm3-decisiones', sm: 'III-3', ac: AC[1], titulo: 'Decisiones, ciclos y funciones', dur: '50 min',
      objetivo: 'Que usen if, operadores lógicos, for y funciones propias para resolver la lógica de un sistema.',
      explica: [
        'if (condición) { … } else { … } ejecuta un bloque u otro. Las comparaciones son == (igual; no confundir con = que asigna), !=, <, >, <= y >=. Los operadores lógicos son los del PLC: && (Y), || (O) y ! (NO).',
        'switch (estado) { case 0: … break; case 1: … break; } elige entre varias opciones y es la base de las máquinas de estados.',
        'for (int i = 0; i < 5; i++) { … } repite un bloque un número fijo de veces; while (condición) repite mientras se cumpla (cuidado: si nunca deja de cumplirse, el programa se queda atorado).',
        'Una función propia agrupa instrucciones con un nombre: void regar(int segundos) { … }. El loop() queda corto y se lee como una receta: medir(), decidir(), actuar(). Los arreglos (int leds[] = {5, 6, 7};) guardan varios valores con un solo nombre.'
      ],
      pantalla: ['if / else · == compara, = asigna', '&& (Y) · || (O) · ! (NO)', 'switch / case: base de las máquinas de estados', 'for: repite n veces · while: mientras se cumpla', 'Funciones propias: medir(), regar()', 'Arreglos: int leds[] = {5, 6, 7};'],
      clave: [['if', 'Instrucción que ejecuta un bloque solo si se cumple una condición'], ['==', 'Operador que compara si dos valores son iguales'], ['for', 'Ciclo que repite un bloque un número fijo de veces'], ['Función', 'Bloque de código con nombre que se puede llamar varias veces'], ['Arreglo', 'Conjunto de valores del mismo tipo con un solo nombre']],
      ejemplo: { titulo: 'Decidir si se riega', pasos: ['int humedad = analogRead(A0);', 'bool hayAgua = digitalRead(FLOTADOR) == HIGH;', 'if (humedad > UMBRAL && hayAgua) { regar(5); } else { esperar(); }', 'La función regar() enciende la bomba los segundos indicados.'], resultado: 'La condición se lee igual que el escalón de un PLC: seco Y con agua.' },
      preguntas: [['¿Qué diferencia hay entre = y ==?', '= asigna un valor; == compara si dos valores son iguales.'], ['¿Cómo se escribe «A y B» en C++?', 'A && B.'], ['¿Qué ciclo usarías para encender 5 LED uno tras otro?', 'Un for de 0 a 4.'], ['¿Para qué sirven las funciones propias?', 'Para agrupar instrucciones con un nombre y hacer el loop corto y legible.']],
      errores: ['Escribir if (x = 5) en lugar de if (x == 5).', 'Olvidar break en un case.', 'Un while que nunca termina.', 'Olvidar las llaves y que solo se ejecute la primera línea.'],
      vida: 'La lógica de un termostato, de una lavadora o de una alarma es un conjunto de decisiones como estas, probadas caso por caso.',
      ideas: ['m3-pseudocodigo', 'm3-codigo-roto'], fuente: FU + ' (p. 65); Arduino Language Reference (docs.arduino.cc).'
    },
    {
      id: 'm3-entradas-dig', sm: 'III-3', ac: AC[1], titulo: 'Botones: pull-up, rebote y flancos', dur: '50 min',
      objetivo: 'Que lean botones de forma confiable con INPUT_PULLUP, antirrebote y detección de flanco.',
      explica: [
        'Con pinMode(pin, INPUT_PULLUP) el Arduino activa un resistor interno hacia 5 V: el botón se conecta entre el pin y GND, sin resistor externo. Ojo con la lógica: sin presionar se lee HIGH y presionado se lee LOW.',
        'Un contacto mecánico rebota: al cerrarse vibra unos milisegundos y el programa puede leer varias pulsaciones. El antirrebote espera que la lectura se mantenga estable unos 20 a 50 ms antes de aceptarla.',
        'Para hacer algo una sola vez por pulsación (contar, cambiar de modo), se detecta el flanco: se guarda la lectura anterior y se actúa solo cuando pasa de HIGH a LOW. Es el mismo R_TRIG del PLC.',
        'Con esto se programa un botón que enciende y apaga (toggle), un contador de pulsaciones o un selector de modos sin que el sistema se vuelva loco por el rebote.'
      ],
      pantalla: ['INPUT_PULLUP: botón entre el pin y GND', 'Sin presionar = HIGH · presionado = LOW', 'Rebote: vibración de milisegundos', 'Antirrebote: lectura estable 20-50 ms', 'Flanco: actuar solo cuando cambia', 'Toggle, contador y selector de modos'],
      clave: [['INPUT_PULLUP', 'Modo de entrada con resistor interno hacia 5 V'], ['Lógica invertida', 'Presionado = LOW, suelto = HIGH'], ['Rebote', 'Varias conmutaciones rápidas al accionar un contacto mecánico'], ['Antirrebote', 'Técnica que acepta una lectura solo si se mantiene estable'], ['Flanco', 'Momento en que una señal cambia de valor']],
      ejemplo: { titulo: 'Botón que enciende y apaga la bomba', pasos: ['pinMode(BOTON, INPUT_PULLUP);', 'bool ahora = digitalRead(BOTON);', 'if (anterior == HIGH && ahora == LOW) { bomba = !bomba; delay(30); }', 'anterior = ahora;'], resultado: 'Cada pulsación cambia el estado una sola vez.' },
      preguntas: [['Con INPUT_PULLUP, ¿qué lee el pin con el botón presionado?', 'LOW.'], ['¿Qué es el rebote?', 'Las conmutaciones rápidas que hace un contacto mecánico al cerrarse o abrirse.'], ['¿Cómo se detecta un flanco de bajada?', 'Comparando la lectura anterior (HIGH) con la actual (LOW).'], ['¿Por qué INPUT_PULLUP ahorra un resistor?', 'Porque usa el resistor interno del microcontrolador hacia 5 V.']],
      errores: ['Esperar HIGH al presionar con INPUT_PULLUP.', 'Dejar una entrada sin pull-up ni pull-down (flotante).', 'Contar pulsaciones sin antirrebote.', 'Actuar mientras el botón está presionado en lugar de en el flanco.'],
      vida: 'Los teclados de los electrodomésticos y de los paneles industriales usan antirrebote por software: sin él, cada botón «se presionaría» varias veces.',
      ideas: ['m3-wokwi', 'm3-boton-nc'], fuente: FU + ' (p. 65); Arduino, ejemplos Debounce y StateChangeDetection (docs.arduino.cc).'
    },
    {
      id: 'm3-analogica-pwm', sm: 'III-3', ac: AC[1], titulo: 'Entradas analógicas, map() y PWM', dur: '50 min',
      objetivo: 'Que lean señales analógicas, las conviertan con map() y controlen la intensidad de una salida con PWM.',
      explica: [
        'analogRead(A0) convierte de 0 a 5 V en un número de 0 a 1023 (10 bits): cada paso vale unos 4.9 mV. Para volver a voltaje: V = lectura × 5 / 1023. Un potenciómetro, una fotorresistencia en divisor o un sensor de humedad entregan este tipo de señal.',
        'map(valor, 0, 1023, 0, 100) pasa de un rango a otro con una regla de tres; trabaja con enteros y recorta los decimales. constrain(x, 0, 100) evita que un valor se salga del rango.',
        'analogWrite(pin, valor) da PWM en los pines ~ con un valor de 0 a 255: el pin se enciende y apaga cientos de veces por segundo (unos 490 Hz en la mayoría de los pines del Uno y unos 980 Hz en 5 y 6). El ciclo de trabajo es valor / 255 y el voltaje promedio es 5 × valor / 255.',
        'Con PWM se regula el brillo de un LED o la velocidad de un motor (siempre por medio de un transistor). No es una salida analógica verdadera: es un promedio que el motor o el ojo «suavizan».'
      ],
      pantalla: ['analogRead: 0-5 V → 0-1023 (≈4.9 mV por paso)', 'V = lectura × 5 / 1023', 'map(x, 0, 1023, 0, 100): regla de tres con enteros', 'analogWrite(pin, 0-255) en pines ~', 'Ciclo de trabajo = valor / 255 · V prom = 5 × valor / 255', 'PWM regula brillo y velocidad'],
      clave: [['Convertidor analógico-digital', 'Periférico que convierte un voltaje en un número'], ['Resolución', 'Número de pasos del convertidor: 10 bits = 1024 pasos'], ['map()', 'Función que convierte un valor de un rango a otro'], ['Ciclo de trabajo', 'Porcentaje del tiempo que la señal PWM está en alto'], ['analogWrite()', 'Instrucción que genera PWM de 0 a 255']],
      ejemplo: { titulo: 'Potenciómetro que regula un LED', pasos: ['int lectura = analogRead(A0);', 'int brillo = map(lectura, 0, 1023, 0, 255);', 'analogWrite(9, brillo);', 'Con la perilla a la mitad: lectura ≈ 512, brillo ≈ 127, ciclo ≈ 50 %.'], resultado: 'El LED cambia de brillo suavemente al girar la perilla.' },
      preguntas: [['¿Qué valor aproximado lee analogRead con 2.5 V?', 'Alrededor de 511.'], ['¿Qué ciclo de trabajo da analogWrite(9, 64)?', '64 / 255 ≈ 25 %.'], ['¿Qué hace map()?', 'Convierte un valor de un rango a otro con una regla de tres.'], ['¿PWM es una salida analógica verdadera?', 'No: es una señal que se enciende y apaga rápido; lo que se aprovecha es el promedio.']],
      errores: ['Usar analogWrite en un pin sin ~.', 'Confundir el rango de analogRead (0-1023) con el de analogWrite (0-255).', 'Mover un motor con PWM directo del pin.', 'Esperar decimales de map().'],
      vida: 'Los ventiladores de computadora, las tiras LED y los variadores de velocidad usan PWM; los sensores de presión y temperatura de un motor llegan a su computadora como señales analógicas.',
      ideas: ['m3-potenciometro-nivel', 'm3-wokwi'], fuente: FU + ' (p. 65); Arduino, analogRead, analogWrite y map (docs.arduino.cc).'
    },
    {
      id: 'm3-sensores-emb', sm: 'III-3', ac: AC[0], titulo: 'Sensores para sistemas embebidos', dur: '50 min',
      objetivo: 'Que conecten, calibren y lean sensores comunes, usando librerías cuando hace falta.',
      explica: [
        'Fotorresistencia (LDR): su resistencia baja con la luz; en un divisor con un resistor fijo da un voltaje que lee una entrada analógica. LM35: entrega 10 mV por cada °C (25 °C = 250 mV). DHT11 y DHT22: miden temperatura y humedad del aire y mandan los datos por un solo pin digital (necesitan su librería).',
        'Sensor de humedad de suelo: el capacitivo no se corroe como el resistivo y entrega un voltaje analógico; normalmente da más voltaje en seco que en mojado. Por eso se calibra: se lee el valor en seco y sumergido hasta la marca, y con map() se convierte a porcentaje.',
        'Ultrasónico HC-SR04: manda un pulso de sonido y mide el tiempo del eco con pulseIn(); la distancia en cm es aproximadamente tiempo en µs × 0.0343 / 2 (el sonido va y regresa). Sirve para medir el nivel de un depósito. Un flotador es aún más sencillo: es un interruptor.',
        'Las librerías se instalan desde el gestor de librerías del Arduino IDE; cada una trae ejemplos. Antes de usar un sensor se revisa su hoja de datos: voltaje de alimentación, tipo de salida y rango.'
      ],
      pantalla: ['LDR en divisor → entrada analógica', 'LM35: 10 mV/°C · DHT11/22: digital con librería', 'Humedad de suelo capacitiva: calibra seco y mojado', 'HC-SR04: cm ≈ µs × 0.0343 / 2', 'Flotador: interruptor de nivel', 'Librerías: gestor del IDE + ejemplos'],
      clave: [['Calibración', 'Relacionar las lecturas del sensor con valores conocidos'], ['Divisor de voltaje', 'Dos resistencias en serie que entregan una fracción del voltaje'], ['Librería', 'Código ya hecho para manejar un sensor o módulo'], ['pulseIn()', 'Instrucción que mide la duración de un pulso'], ['Sensor capacitivo de suelo', 'Mide humedad sin contacto metálico con la tierra, por eso no se corroe']],
      ejemplo: { titulo: 'Calibrar el sensor de humedad', pasos: ['En seco, al aire: lectura 600 (anótala).', 'Sumergido hasta la marca en agua: lectura 280.', 'humedad = map(lectura, 600, 280, 0, 100);', 'constrain(humedad, 0, 100) para no pasar de 0 a 100 %.'], resultado: 'El programa trabaja en % y no depende de los números crudos del sensor.' },
      preguntas: [['¿Qué voltaje entrega un LM35 a 30 °C?', '300 mV (10 mV por °C).'], ['¿Por qué se prefiere el sensor de humedad capacitivo?', 'Porque no se corroe como el resistivo.'], ['¿Por qué la distancia del HC-SR04 se divide entre 2?', 'Porque el sonido va y regresa.'], ['¿De dónde se instala una librería?', 'Del gestor de librerías del Arduino IDE.']],
      errores: ['Usar los números crudos del sensor sin calibrar.', 'Alimentar un sensor de 3.3 V con 5 V sin revisar su hoja.', 'Olvidar instalar la librería del DHT.', 'Mojar la parte electrónica del sensor de suelo.'],
      vida: 'La agricultura de precisión del Bajío usa sensores de humedad de suelo y estaciones meteorológicas para decidir cuándo y cuánto regar.',
      ideas: ['m3-calibra-humedad', 'm3-wokwi'], fuente: FU + ' (p. 63); hojas de datos LM35, DHT11/DHT22 y HC-SR04; Arduino, Library Manager (docs.arduino.cc).'
    },
    {
      id: 'm3-potencia-emb', sm: 'III-3', ac: AC[2], titulo: 'Etapa de potencia: transistor, MOSFET y relevador', dur: '50 min',
      objetivo: 'Que manejen cargas de 12 V (bomba, motor, relevador) desde el Arduino con la etapa de potencia correcta.',
      explica: [
        'El Arduino decide, pero no da fuerza: un pin entrega unos 20 mA a 5 V. Para mover una bomba o un motor de 12 V se usa un interruptor electrónico: un transistor NPN para cargas pequeñas, un MOSFET de nivel lógico (por ejemplo IRLZ44N) para cargas de varios amperes o un relevador para aislar por completo.',
        'Con MOSFET de canal N: el pin va a la compuerta (gate) con un resistor de unos 220 Ω, un resistor de 10 kΩ de la compuerta a GND la mantiene apagada al arrancar, la fuente (source) va a GND y la carga va entre +12 V y el drenador (drain). Muchos módulos baratos con IRF520 no conducen bien con 5 V: busca uno de nivel lógico.',
        'Toda carga inductiva (motor, bomba, bobina) lleva un diodo en paralelo con la franja hacia el +12 V, para absorber el pico de voltaje al apagarse. Y los GND del Arduino y de la fuente de 12 V se unen; el motor nunca se alimenta del pin 5V del Arduino.',
        'Con relevador (tu tablero del 1er parcial con el ULN2003 del 2º) la carga queda aislada del Arduino y puede ser de CA o CD, pero es más lento y no sirve para PWM. Con MOSFET se puede regular la velocidad de la bomba con PWM.'
      ],
      pantalla: ['El pin decide; la etapa de potencia da la fuerza', 'NPN: cargas pequeñas · MOSFET de nivel lógico: varios A · relevador: aislamiento', 'MOSFET: 220 Ω a la compuerta y 10 kΩ a GND', 'Carga entre +12 V y drenador; fuente a GND', 'Diodo en paralelo con la carga (franja al +)', 'GND comunes; nunca el motor en el pin 5V'],
      clave: [['MOSFET de nivel lógico', 'Transistor que conduce por completo con solo 5 V en su compuerta'], ['Compuerta (gate)', 'Terminal del MOSFET que recibe la señal del Arduino'], ['Drenador (drain)', 'Terminal del MOSFET al que se conecta la carga'], ['Diodo de protección', 'Diodo en paralelo con una carga inductiva que absorbe el pico al apagarla'], ['Aislamiento', 'Separación eléctrica entre el control y la carga, como en un relevador']],
      ejemplo: { titulo: 'Bomba de 12 V con MOSFET', pasos: ['Pin 9 → 220 Ω → compuerta del IRLZ44N; 10 kΩ de compuerta a GND.', 'Fuente del MOSFET → GND común.', '+12 V → bomba → drenador; diodo 1N5819 o 1N4007 en paralelo con la bomba.', 'analogWrite(9, 180) la hace trabajar más lento.'], resultado: 'El Arduino controla la bomba sin calentarse y con velocidad regulable.' },
      preguntas: [['¿Por qué no se conecta la bomba directo al pin?', 'Porque el pin entrega unos 20 mA a 5 V y la bomba pide 12 V y mucha más corriente.'], ['¿Para qué sirve el resistor de 10 kΩ de la compuerta a GND?', 'Para mantener el MOSFET apagado mientras el pin no está definido (al arrancar).'], ['¿Por qué lleva diodo la bomba?', 'Para absorber el pico de voltaje que genera al apagarse.'], ['¿Cuándo prefieres relevador en lugar de MOSFET?', 'Cuando necesitas aislamiento o la carga es de CA; no sirve para PWM.']],
      errores: ['Alimentar el motor desde el pin 5V del Arduino.', 'Olvidar unir los GND.', 'Usar un MOSFET que no es de nivel lógico.', 'Poner el diodo al revés: hace corto con la fuente.'],
      vida: 'Las tarjetas de control de electrodomésticos y autos combinan microcontrolador, MOSFET y relevadores; cuando falla una salida, el técnico revisa primero la etapa de potencia.',
      ideas: ['m3-mosfet-logico', 'm3-uln2003'], fuente: FU + ' (p. 65); hojas de datos IRLZ44N, ULN2003A y 1N4007; Baker (2021).'
    },
    {
      id: 'm3-serial', sm: 'III-3', ac: AC[0], titulo: 'Comunicación serie y pantallas', dur: '50 min',
      objetivo: 'Que usen el monitor y el graficador serie para ver lo que pasa dentro de la tarjeta y muestren datos en una pantalla.',
      explica: [
        'El puerto serie es la ventana al interior del Arduino. En setup() se abre con Serial.begin(9600) y en el programa se mandan datos con Serial.print() y Serial.println(). El monitor serie del IDE muestra los textos (a la misma velocidad: 9600 baudios).',
        'El graficador serie del Arduino IDE dibuja los números que mandas: es perfecto para ver cómo cambia la humedad o la temperatura con el tiempo. Manda un valor por línea, o varios separados por coma.',
        'Imprimir variables en puntos clave es la forma más rápida de depurar: Serial.println(humedad); te dice si el problema es el sensor, la decisión o la salida.',
        'Para que el sistema funcione sin computadora se usa una pantalla, como la LCD de 16×2 con módulo I2C (solo 4 cables: 5V, GND, SDA a A4 y SCL a A5) y su librería. Su dirección I2C suele ser 0x27 o 0x3F; si no muestra nada, revisa la dirección y el contraste.'
      ],
      pantalla: ['Serial.begin(9600) en setup()', 'Serial.print / println', 'Monitor serie a la misma velocidad', 'Graficador serie: números en el tiempo', 'Imprimir variables = depurar', 'LCD 16×2 I2C: SDA A4, SCL A5, dirección 0x27 o 0x3F'],
      clave: [['Puerto serie', 'Comunicación por la que el Arduino manda y recibe datos (por USB)'], ['Baudios', 'Velocidad de la comunicación serie'], ['Monitor serie', 'Ventana del IDE que muestra los mensajes del Arduino'], ['Graficador serie', 'Ventana del IDE que grafica los números recibidos'], ['Dirección I2C', 'Número que identifica a cada módulo en el bus I2C']],
      ejemplo: { titulo: 'Ver el riego por dentro', pasos: ['Serial.begin(9600);', 'Serial.print("Humedad: "); Serial.print(h); Serial.println(" %");', 'Serial.print("Estado: "); Serial.println(estado);', 'Abre el monitor serie a 9600.'], resultado: 'Cada 10 s ves la humedad y el estado: sabes qué decide el programa y por qué.' },
      preguntas: [['¿Qué instrucción abre la comunicación serie?', 'Serial.begin(9600).'], ['¿Qué pasa si el monitor serie está a otra velocidad?', 'Se ven caracteres sin sentido.'], ['¿Para qué sirve el graficador serie?', 'Para ver en una gráfica cómo cambian los valores con el tiempo.'], ['¿Qué pines usa la LCD con módulo I2C en el Uno?', 'A4 (SDA) y A5 (SCL), además de 5V y GND.']],
      errores: ['Olvidar Serial.begin().', 'Monitor a una velocidad distinta a la del programa.', 'Llenar el monitor de mensajes sin pausa: no se alcanza a leer.', 'Usar los pines 0 y 1 para otra cosa y perder la comunicación.'],
      vida: 'Los técnicos de electrónica conectan una computadora al puerto serie o de diagnóstico de los equipos para leer sus mensajes y códigos de falla.',
      ideas: ['m3-depura-serial', 'm3-wokwi'], fuente: FU + ' (p. 63); Arduino, Serial y Serial Plotter (docs.arduino.cc).'
    },
    {
      id: 'm3-millis-estados', sm: 'III-3', ac: AC[1], titulo: 'Tiempo sin bloquear y máquinas de estados', dur: '50 min',
      objetivo: 'Que programen tiempos con millis() y organicen el programa como máquina de estados.',
      explica: [
        'delay(5000) detiene todo durante 5 s: el Arduino no lee botones ni sensores mientras espera. Para sistemas reales se usa millis(), que da los milisegundos desde que se encendió la tarjeta: se guarda el momento de inicio y se pregunta si ya pasó el intervalo: if (millis() - inicio >= 5000) { … }.',
        'Las variables de tiempo son unsigned long. Con la resta millis() - inicio el programa sigue funcionando aunque millis() se desborde (unos 49 días), porque la resta de enteros sin signo da el resultado correcto.',
        'Una máquina de estados organiza el programa como el GRAFCET del 2º parcial: una variable estado dice en qué paso está (ESPERA, MIDE, RIEGA, PAUSA, FALLA); un switch ejecuta lo de ese estado y revisa sus condiciones para cambiar al siguiente.',
        'Así el loop() nunca se bloquea: cada vuelta revisa el estado actual, actúa y regresa en microsegundos, listo para atender un botón de paro en cualquier momento.'
      ],
      pantalla: ['delay() bloquea · millis() no', 'if (millis() - inicio >= intervalo)', 'Tiempos en unsigned long', 'Estado = paso actual (como el GRAFCET)', 'switch (estado) { case ESPERA: … }', 'El loop nunca se detiene: el paro siempre responde'],
      clave: [['millis()', 'Milisegundos transcurridos desde que encendió la tarjeta'], ['Código bloqueante', 'Instrucciones que detienen el programa, como delay()'], ['Máquina de estados', 'Programa organizado en estados y transiciones'], ['Estado', 'Paso actual del sistema'], ['Transición', 'Condición para pasar de un estado a otro']],
      ejemplo: { titulo: 'Estados del riego', pasos: ['ESPERA: cada 10 s pasa a MIDE.', 'MIDE: si está seco y hay agua → RIEGA; si no hay agua → FALLA; si no, → ESPERA.', 'RIEGA: bomba encendida hasta 5 s → PAUSA.', 'PAUSA: 30 s para que el agua se reparta → ESPERA.'], resultado: 'Cada estado es corto y claro; agregar uno nuevo no rompe los demás.' },
      preguntas: [['¿Por qué delay() es un problema en sistemas reales?', 'Porque detiene todo: no se leen botones ni sensores mientras espera.'], ['¿Qué tipo de variable se usa para guardar millis()?', 'unsigned long.'], ['¿Cómo se pregunta si ya pasaron 5 s desde inicio?', 'if (millis() - inicio >= 5000).'], ['¿Qué relación hay entre una máquina de estados y el GRAFCET?', 'Es la misma idea: etapas (estados) y transiciones con condiciones.']],
      errores: ['Usar int para guardar millis().', 'Mezclar delay() largos con botones que deben responder.', 'Olvidar guardar inicio = millis() al entrar al estado.', 'Estados sin salida: el sistema se queda atorado.'],
      vida: 'Casi todo el firmware de electrodomésticos, cajeros y máquinas expendedoras está escrito como máquinas de estados.',
      ideas: ['m3-estado-tarjetas', 'm3-grafcet-piso'], fuente: FU + ' (p. 65); Arduino, ejemplo BlinkWithoutDelay y millis() (docs.arduino.cc).'
    },
    {
      id: 'm3-nexo-energia', sm: 'III-3', ac: AC[2], titulo: 'Nexo agua-energía-alimento y eficiencia', dur: '50 min',
      objetivo: 'Que relacionen el riego automático con el cuidado del agua y la energía, y calculen el consumo de su sistema.',
      explica: [
        'El agua, la energía y los alimentos dependen unos de otros: se necesita agua para producir alimentos y energía, y energía para bombear, tratar y llevar el agua. A nivel mundial, la agricultura usa alrededor del 70 % del agua dulce que se extrae (FAO). Cuidar uno de los tres ayuda a los otros dos: a esto se le llama el nexo agua-energía-alimento.',
        'En Guanajuato muchos acuíferos están sobreexplotados: se saca más agua de la que se recarga. Regar solo cuando la tierra lo necesita, en las horas frescas y con goteo en lugar de inundación ahorra agua y también la energía de bombearla.',
        'Un riego automático bien hecho mide antes de regar, riega poco y espera a que el agua se reparta, no riega si el depósito está vacío (protege la bomba) y avisa cuando algo falla.',
        'El consumo del sistema se calcula con energía (Wh) = potencia (W) × horas: el Arduino y sus sensores consumen poco pero todo el día; la bomba consume más pero pocos minutos. Apagar LED innecesarios, alimentar el sensor solo al medir y regar con tiempos cortos reduce el consumo.'
      ],
      pantalla: ['Agua ↔ energía ↔ alimentos', 'Agricultura ≈ 70 % del agua dulce extraída (FAO)', 'Acuíferos de Guanajuato sobreexplotados', 'Mide → riega poco → espera → vuelve a medir', 'Sin agua en el depósito, no riega', 'Wh = W × h · ahorra en lo que está encendido todo el día'],
      clave: [['Nexo agua-energía-alimento', 'Relación entre los tres recursos: cuidar uno ayuda a los otros'], ['Acuífero sobreexplotado', 'Depósito subterráneo del que se extrae más agua de la que se recarga'], ['Riego por goteo', 'Riego que entrega el agua gota a gota junto a la raíz'], ['Wh', 'Watt-hora: energía de 1 W durante 1 hora'], ['Eficiencia', 'Lograr lo mismo con menos agua o energía']],
      ejemplo: { titulo: 'Consumo diario del riego', pasos: ['Arduino y sensores: 12 V × 0.06 A × 24 h = 17.3 Wh.', 'Bomba: 3 W × 0.33 h (20 min) = 1 Wh.', 'Total ≈ 18.3 Wh al día.', 'Apagando el LED de encendido y el sensor entre lecturas baja la parte que funciona todo el día.'], resultado: 'Lo que más consume no es la bomba: es lo que está encendido las 24 horas.' },
      preguntas: [['¿Qué es el nexo agua-energía-alimento?', 'La relación entre agua, energía y alimentos: cada uno necesita de los otros, así que cuidar uno ayuda a los demás.'], ['¿Por qué regar en horas frescas ahorra agua?', 'Porque se evapora menos.'], ['¿Por qué el riego no debe encender la bomba con el depósito vacío?', 'Porque la bomba se daña al trabajar en seco y se desperdicia energía.'], ['¿Cuánta energía usa una bomba de 3 W durante 2 h?', '6 Wh.']],
      errores: ['Regar por tiempo fijo sin medir la humedad.', 'Olvidar el consumo de lo que funciona las 24 horas.', 'Dejar la bomba sin protección contra trabajo en seco.', 'Confundir W (potencia) con Wh (energía).'],
      vida: 'Productores de hortalizas del Bajío usan riego por goteo con controladores automáticos para ahorrar agua y energía en el bombeo de pozos profundos.',
      ideas: ['m3-agua-cuenta', 'm3-energia-kwh'], fuente: FU + ' (p. 65, nexo agua-energía-alimento); anexo de Conceptos Centrales de la Educación para el Desarrollo Sostenible del programa (p. 150); FAO, AQUASTAT (uso del agua en la agricultura); CONAGUA (disponibilidad de acuíferos).'
    },
    {
      id: 'm3-depuracion', sm: 'III-3', ac: AC[1], titulo: 'Depuración y verificación del sistema', dur: '50 min',
      objetivo: 'Que localicen errores de compilación, de lógica y de hardware con un método y verifiquen el sistema completo.',
      explica: [
        'Hay tres tipos de errores. De compilación: el IDE marca la línea (falta punto y coma, llave, mayúscula). De lógica: compila, pero hace otra cosa (un == que debía ser >=, un estado sin salida). De hardware: el código está bien pero el cable, el sensor o la etapa de potencia fallan.',
        'Lee el primer mensaje de error de compilación: casi siempre los demás se derivan de ese. Para errores de lógica, imprime variables por serie en puntos clave y compara con lo que esperas. Para hardware, mide con el multímetro y prueba cada parte con un programa sencillo (solo el sensor, solo la bomba).',
        'Prueba por partes: primero el sensor solo, luego la decisión con valores simulados, después la salida, y al final todo junto. El simulador (Wokwi o Tinkercad) sirve para probar la lógica antes de arriesgar la tarjeta.',
        'La verificación final usa una lista de pruebas: seco con agua (riega), húmedo (no riega), depósito vacío (falla), botón manual, corte de energía y regreso. Cada versión que funciona se guarda con nombre y fecha y con el código comentado.'
      ],
      pantalla: ['Compilación: el IDE marca la línea', 'Lógica: compila pero hace otra cosa', 'Hardware: cable, sensor o potencia', 'Lee el primer error · imprime variables', 'Prueba por partes, luego todo junto', 'Lista de pruebas y versiones guardadas'],
      clave: [['Error de compilación', 'Error de escritura que impide traducir el programa'], ['Error de lógica', 'El programa corre pero no hace lo que se quería'], ['Depurar', 'Encontrar y corregir errores'], ['Prueba por partes', 'Verificar cada bloque del sistema por separado antes de unirlos'], ['Lista de pruebas', 'Casos que el sistema debe cumplir, con su resultado esperado']],
      ejemplo: { titulo: 'La bomba nunca enciende', pasos: ['Serial muestra humedad = 85 % con la tierra seca.', 'Sospecha: calibración invertida (el sensor da más voltaje en seco).', 'Se corrige map(lectura, SECO, MOJADO, 0, 100).', 'Se repite la lista de pruebas completa.'], resultado: 'Una línea de Serial.println ahorró una hora de desarmar cables.' },
      preguntas: [['¿Cuáles son los tres tipos de errores?', 'De compilación, de lógica y de hardware.'], ['¿Qué mensaje de error se lee primero?', 'El primero: los demás suelen derivarse de él.'], ['¿Cómo se encuentra un error de lógica?', 'Imprimiendo variables por serie y comparando con lo esperado.'], ['¿Por qué probar por partes?', 'Para saber en qué bloque está la falla sin adivinar.']],
      errores: ['Cambiar muchas cosas a la vez.', 'Ignorar el primer error de compilación y corregir los últimos.', 'Probar solo el caso normal.', 'No guardar la versión que sí funcionaba.'],
      vida: 'En la industria, cada cambio de firmware pasa por pruebas registradas antes de salir a producción; un error puede detener miles de aparatos.',
      ideas: ['m3-codigo-roto', 'm3-depura-serial'], fuente: FU + ' (pp. 65-66); Arduino, guía de solución de problemas (docs.arduino.cc).'
    }
  ];

  /* =================== CLASES (1 h de horario = 50 min) =================== */
  const SW = 'Arduino IDE 2 y Wokwi (gratuitos)', WK = 'https://wokwi.com/';
  const clases = [
    { id: 'm3e-encuadre', h: 3, m: 'a', tipo: 'Encuadre', t: 'Encuadre del 3er parcial y examen diagnóstico', obj: 'Que conozcan el parcial, el proyecto de riego y muestren qué recuerdan de lógica, PLC y Arduino.', ac: null,
      pasos: [[15, 'Retoma el tablero y el PLC: ahora programarán la tarjeta directamente en C++, como se hace con los aparatos que usan todos los días.'], [20, 'Encuadre: las 3 actividades clave, criterios, el proyecto (riego automático) y la feria de automatización del semestre.'], [50, 'Examen diagnóstico: lógica, escalera, voltaje y corriente, pines del Arduino (no cuenta para calificación).'], [25, 'Lluvia de ideas: ¿qué aparatos de tu casa tienen un «cerebro»?'], [25, 'Equipos y material: sensor de humedad capacitivo, mini bomba de 12 V, manguera, MOSFET y una maceta de prueba.'], [15, 'Tarea y cierre.']],
      ev: 'Examen diagnóstico contestado (Desempeño)', tarea: 'Entra a wokwi.com y prueba un ejemplo de Arduino Uno. No necesitas cuenta para simular; si quieres guardar, usa un apodo, nunca tu nombre completo.', ideas: ['primer-dia', 'roles-equipo'], pre: 'microcontrolador · programa · sensor' },
    { id: 'm3e-embebido-c', h: 2, m: 'a', tipo: 'Teoría', t: '¿Qué es un sistema embebido?', obj: 'Explicar qué es un sistema embebido y qué hay dentro de un microcontrolador.', ac: 0, dc: 1, tema: 'm3-embebido',
      pasos: [[10, '¿Qué tienen en común un microondas, un control remoto y un auto?'], [35, 'Tema en proyector.'], [30, 'Desarmado demostrativo con la cámara: un control o juguete con microcontrolador; ubican el chip y buscan su número.'], [20, 'Tabla en la libreta: aparato, entradas, proceso y salidas.'], [5, 'Boleto de salida.']],
      ideas: ['pr-camara-doc', 'm3-wokwi'], pre: 'embebido · flash · RAM · periférico' },
    { id: 'm3e-uno-c', h: 2, m: 'a', tipo: 'Teoría', t: 'Puertos y pines del Arduino Uno', obj: 'Identificar puertos de entrada, salida, voltaje y comunicación de la tarjeta.', ac: 0, dc: 0, tema: 'm3-uno-pines',
      pasos: [[10, 'Arduino en mano: ¿qué dicen las serigrafías?'], [35, 'Tema en proyector con el mapa de pines.'], [30, 'Ficha de la tarjeta con su documentación oficial: voltajes, corrientes y pines.'], [20, 'Ejercicio: asignan pines a una alarma con sensor, LED y zumbador.'], [5, 'Boleto de salida.']],
      tarea: 'Haz la tabla de pines de un semáforo con botón peatonal (qué pin, si es entrada o salida y qué se conecta).', ideas: ['m3-tabla-direcciones', 'pr-explica-60'], pre: 'PWM · analógica · Vin · I2C' },
    { id: 'm3e-ide-instala', h: 2, m: 'a', lugar: 'computo', tipo: 'Simulador', t: 'Arduino IDE y Wokwi: primer programa', obj: 'Escribir, simular, compilar y cargar el primer programa.', ac: 1, dc: 0, tema: 'm3-cpp-basico',
      pasos: [[15, 'En el proyector muestras el IDE y Wokwi.'], [55, 'Práctica guiada: parpadeo en Wokwi y después en la tarjeta real por USB; cambian los tiempos.'], [25, 'Reto: SOS en código Morse.'], [5, 'Guardan.']],
      guia: { sw: SW, link: WK, pasos: [['Wokwi', 'Entra a wokwi.com, elige Arduino Uno y un proyecto nuevo: a la izquierda el código, a la derecha el circuito.'], ['Parpadeo', 'Escribe el parpadeo del pin 13 con delay(500) e inicia la simulación (botón verde).'], ['IDE', 'Abre Arduino IDE 2, pega el código, elige Herramientas → Placa → Arduino Uno y el puerto.'], ['Verifica y carga', 'Verifica (✓) y carga (→): el LED de la tarjeta debe parpadear.'], ['Cambia', 'Prueba 100, 250 y 1000 ms y anota qué observas.'], ['Reto', 'SOS en Morse: tres cortos, tres largos, tres cortos.']], tabla: { cab: ['delay (ms)', 'Parpadeos en 10 s'], filas: [['1000', ''], ['500', ''], ['250', ''], ['100', '']] }, revisa: ['Compila sin errores', 'Se cargó a la tarjeta real'], entrega: 'Código del SOS y captura.' },
      ideas: ['m3-wokwi', 'm3-tinkercad-arduino'], pre: 'sketch · verificar · cargar' },

    { id: 'm3e-cpp-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Estructura del programa y variables', obj: 'Usar setup, loop, variables, constantes y las instrucciones básicas.', ac: 1, dc: 1, tema: 'm3-cpp-basico',
      pasos: [[10, 'Adivina qué hace este código (en pantalla).'], [35, 'Tema en proyector.'], [40, 'Ejercicios en papel: completar y corregir programas cortos.'], [10, 'Revisión.'], [5, 'Boleto de salida.']],
      ideas: ['m3-pseudocodigo', 'm3-codigo-roto'], pre: 'setup · loop · const · pinMode' },
    { id: 'm3e-semaforo-sim', h: 2, m: 'd', lugar: 'computo', tipo: 'Simulador', t: 'Semáforo con LED en Wokwi y en la tarjeta', obj: 'Programar una secuencia de salidas con constantes y comentarios.', ac: 1, dc: 2, tema: 'm3-cpp-basico', dep: ['m3e-ide-instala'],
      pasos: [[10, 'Indicaciones.'], [60, 'Arman y programan el semáforo en Wokwi.'], [25, 'Lo arman en protoboard y lo cargan a la tarjeta.'], [5, 'Guardan.']],
      mat: 'Arduino Uno, protoboard, 3 LED, 3 resistores de 220 Ω, cables.',
      guia: { sw: SW, link: WK, pasos: [['Circuito', 'LED verde, ámbar y rojo en los pines 5, 6 y 7, cada uno con resistor de 220 Ω a GND.'], ['Constantes', 'const int VERDE = 5, AMBAR = 6, ROJO = 7;'], ['setup', 'pinMode de los tres como OUTPUT.'], ['loop', 'Verde 5 s, ámbar 2 s y rojo 5 s con digitalWrite y delay.'], ['Simula', 'Comprueba los tiempos en Wokwi.'], ['Real', 'Arma en protoboard y carga a la tarjeta.']], tabla: { cab: ['Luz', 'Tiempo programado', 'Tiempo medido'], filas: [['Verde', '5 s', ''], ['Ámbar', '2 s', ''], ['Rojo', '5 s', '']] }, revisa: ['Comentarios en el código', 'Resistor en cada LED'], entrega: 'Código comentado y foto del circuito (sin rostros).' },
      ideas: ['m3-wokwi'], pre: 'secuencia · constantes · protoboard' },
    { id: 'm3e-decisiones-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Decisiones, ciclos y funciones', obj: 'Usar if, operadores lógicos, for, arreglos y funciones propias.', ac: 1, dc: 1, tema: 'm3-decisiones',
      pasos: [[10, 'Pseudocódigo del riego en el pizarrón.'], [35, 'Tema en proyector.'], [40, 'Ejercicios: escriben if, for y una función propia para 4 casos.'], [10, 'Revisión.'], [5, 'Boleto de salida.']],
      ideas: ['m3-pseudocodigo', 'm3-codigo-roto'], pre: 'if · && · for · función' },
    { id: 'm3e-entradas-c', h: 1, m: 'd', tipo: 'Teoría', t: 'Botones: pull-up, rebote y flancos', obj: 'Explicar la lectura confiable de botones.', ac: 0, dc: 1, tema: 'm3-entradas-dig',
      pasos: [[10, 'Demostración: un contador que cuenta de más por el rebote.'], [25, 'Tema en proyector con la figura animada.'], [15, 'En la libreta: diagrama del botón con INPUT_PULLUP y su tabla HIGH/LOW.']],
      ideas: ['m3-boton-nc'], pre: 'INPUT_PULLUP · rebote · flanco' },
    { id: 'm3e-botones-sim', h: 2, m: 'd', lugar: 'computo', tipo: 'Simulador', t: 'Botón: encender, alternar y contar', obj: 'Leer botones con INPUT_PULLUP, detectar flancos y aplicar antirrebote.', ac: 1, dc: 2, tema: 'm3-entradas-dig', dep: ['m3e-semaforo-sim'],
      pasos: [[10, 'Indicaciones.'], [60, 'Tres programas guiados en Wokwi: directo, alternar y contar.'], [25, 'Prueban en la tarjeta real y comparan el conteo con y sin antirrebote.'], [5, 'Guardan.']],
      guia: { sw: SW, link: WK, pasos: [['Circuito', 'Botón entre el pin 2 y GND; LED con 220 Ω en el pin 7.'], ['Directo', 'pinMode(2, INPUT_PULLUP); el LED enciende mientras presionas (presionado = LOW).'], ['Alternar', 'Detecta el flanco (anterior HIGH y ahora LOW) para que cada pulsación encienda o apague.'], ['Contar', 'Cuenta pulsaciones y muéstralas en el monitor serie.'], ['Antirrebote', 'Agrega una espera de 30 ms después del flanco y compara.']], tabla: { cab: ['Pulsaciones reales', 'Conteo sin antirrebote', 'Conteo con antirrebote'], filas: 3 }, revisa: ['Lógica invertida bien usada', 'El conteo coincide con antirrebote'], entrega: 'Código y tabla.' },
      ideas: ['m3-wokwi', 'm3-depura-serial'], pre: 'pull-up · toggle · contador' },
    { id: 'm3e-diagrama', h: 2, m: 'd', tipo: 'Práctica', t: 'Diagrama de conexión del sistema embebido', obj: 'Elaborar el diagrama para ensamblar o simular el sistema, con su tabla de pines.', ac: 0, dc: 2, tema: 'm3-uno-pines',
      pasos: [[10, 'Indicaciones y requisitos del diagrama.'], [70, 'Dibujan (en papel o en Wokwi) el diagrama del riego: tarjeta, sensores, botón, LED, etapa de potencia, fuentes y GND común, con su tabla de pines.'], [20, 'Revisión cruzada con la lista de cotejo.']],
      ev: 'Diagrama de conexión del sistema embebido con tabla de pines (Desempeño)',
      guia: { pasos: [['Bloques', 'Dibuja la tarjeta y alrededor: sensores a la izquierda, actuadores a la derecha y fuentes arriba.'], ['Pines', 'Humedad A0, umbral A1, botón 2, nivel 3, LED 6 y 7, bomba 9.'], ['Potencia', 'Bomba de 12 V con MOSFET (o el relevador K1 del tablero con el ULN2003) y su diodo.'], ['Tierras', 'GND del Arduino unido al 0 V de la fuente de 12 V.'], ['Voltajes', 'Escribe el voltaje de cada línea: 5 V, 12 V y señales.'], ['Revisa', 'Ningún pin recibe más de 5 V.']], tabla: { cab: ['Elemento', 'Pin', 'Tipo (E/S, analógica, PWM)', 'Voltaje'], filas: 8 }, revisa: ['GND común', 'Diodo en la bomba', 'Tabla de pines completa'], entrega: 'Diagrama y tabla de pines.' },
      ideas: ['m3-tabla-direcciones', 'coevaluacion'], pre: 'diagrama · tabla de pines' },
    { id: 'm3e-analogica-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Entradas analógicas, map() y PWM', obj: 'Convertir lecturas analógicas y regular salidas con PWM.', ac: 1, dc: 1, tema: 'm3-analogica-pwm',
      pasos: [[10, 'Demostración: el brillo de un LED con un potenciómetro.'], [35, 'Tema en proyector con la figura de PWM.'], [40, 'Ejercicios: lectura ↔ voltaje, map() y ciclo de trabajo.'], [10, 'Votación con tarjetas.'], [5, 'Boleto de salida.']],
      ideas: ['pr-plickers', 'm3-potenciometro-nivel'], pre: '0-1023 · map · 0-255' },
    { id: 'm3e-analogica-sim', h: 2, m: 'd', lugar: 'computo', tipo: 'Simulador', t: 'Potenciómetro, fotorresistencia y PWM', obj: 'Leer señales analógicas, convertirlas y controlar el brillo de un LED.', ac: 1, dc: 2, tema: 'm3-analogica-pwm', dep: ['m3e-botones-sim'],
      pasos: [[10, 'Indicaciones.'], [60, 'Programas guiados: lectura, voltaje, brillo y luz automática.'], [25, 'En la tarjeta real miden el voltaje en A0 y lo comparan con el calculado; usan el graficador serie.'], [5, 'Guardan.']],
      guia: { sw: SW, link: WK, pasos: [['Lectura', 'Potenciómetro en A0 (extremos a 5 V y GND); imprime analogRead(A0).'], ['Voltaje', 'Calcula y muestra lectura × 5.0 / 1023.'], ['Brillo', 'LED en el pin 9: analogWrite(9, map(lectura, 0, 1023, 0, 255)).'], ['Luz automática', 'Fotorresistencia en divisor con 10 kΩ en A1: el LED enciende cuando oscurece.'], ['Graficador', 'Abre el graficador serie y mueve el potenciómetro y la luz.']], tabla: { cab: ['Posición', 'Lectura', 'Voltaje calculado', 'Voltaje medido'], filas: [['Mínimo', '', '', ''], ['Mitad', '', '', ''], ['Máximo', '', '', '']] }, revisa: ['Voltaje calculado ≈ medido', 'PWM en un pin con ~'], entrega: 'Código y tabla.' },
      ideas: ['m3-potenciometro-nivel', 'm3-depura-serial'], pre: 'analogRead · analogWrite · graficador' },
    { id: 'm3e-serial-c', h: 1, m: 'd', tipo: 'Teoría', t: 'Comunicación serie y pantallas', obj: 'Usar el puerto serie para ver el funcionamiento interno y conocer la pantalla LCD I2C.', ac: 0, dc: 3, tema: 'm3-serial',
      pasos: [[10, 'Pregunta: ¿cómo sabes qué está «pensando» el Arduino?'], [25, 'Tema en proyector.'], [15, 'Demostración de una LCD 16×2 I2C mostrando una lectura.']],
      ideas: ['m3-depura-serial'], pre: 'Serial · baudios · I2C' },
    { id: 'm3e-sensores-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Sensores para sistemas embebidos', obj: 'Conocer, conectar y calibrar sensores comunes.', ac: 0, dc: 1, tema: 'm3-sensores-emb',
      pasos: [[10, 'Sensores reales en mano: ¿qué miden?'], [35, 'Tema en proyector.'], [40, 'Fichas de 3 sensores con su hoja de datos: voltaje, tipo de salida, rango y conexión.'], [10, 'Revisión.'], [5, 'Boleto de salida.']],
      tarea: 'Trae un vaso o maceta pequeña con tierra para calibrar el sensor de humedad.', ideas: ['m3-calibra-humedad'], pre: 'calibrar · librería · divisor' },
    { id: 'm3e-sensores-pr', h: 2, m: 'd', lugar: 'computo', tipo: 'Práctica', t: 'Sensores reales: humedad de suelo, temperatura y nivel', obj: 'Leer, calibrar y verificar sensores reales con el monitor serie.', ac: 0, dc: 3, tema: 'm3-sensores-emb', dep: ['m3e-analogica-sim'],
      pasos: [[10, 'Indicaciones y seguridad con agua.'], [60, 'Leen y calibran el sensor de humedad; leen temperatura y nivel.'], [25, 'Convierten a % y grafican.'], [5, 'Guardan.']],
      mat: 'Arduino, sensor de humedad capacitivo, LM35 o DHT11, flotador o HC-SR04, vaso con agua, tierra seca y húmeda, charola.',
      guia: { sw: SW, link: WK, pasos: [['Humedad', 'Sensor capacitivo: VCC a 5 V, GND y AOUT a A0. Lee al aire, en tierra seca, en tierra húmeda y en agua hasta la marca.'], ['Calibra', 'Con tus lecturas en seco y en agua, convierte a % con map() y constrain().'], ['Temperatura', 'LM35 en A2 (10 mV por °C) o DHT11 con su librería.'], ['Nivel', 'Flotador entre el pin 3 y GND con INPUT_PULLUP (o HC-SR04 con pulseIn).'], ['Monitor', 'Imprime todo en una línea y mira el graficador.']], tabla: { cab: ['Condición', 'Lectura A0', 'Humedad %'], filas: [['Aire (seco)', '', ''], ['Tierra seca', '', ''], ['Tierra húmeda', '', ''], ['Agua hasta la marca', '', '']] }, revisa: ['Calibración con valores reales', 'Lecturas estables'], seguridad: 'No mojes la parte electrónica del sensor; trabaja sobre una charola y lejos de la tarjeta.', entrega: 'Tabla de calibración y código.' },
      ideas: ['m3-calibra-humedad', 'm3-riego-maceta'], pre: 'calibración · % · nivel' },
    { id: 'm3e-inspecciona', h: 2, m: 'd', tipo: 'Evaluación', t: 'Inspecciona el sistema embebido (actividad clave)', obj: 'Identificar puertos, verificar voltajes y explicar el funcionamiento interno de un sistema embebido con su diagrama.', ac: 0, dc: 3, tema: 'm3-uno-pines',
      pasos: [[10, 'Indicaciones: cada equipo recibe un sistema armado por ti con su programa cargado y su diagrama (alarma con sensor, LED y zumbador).'], [70, 'Con su diagrama identifican puertos, miden voltajes, accionan entradas y explican cada periférico; tú observas con la guía de observación.'], [20, 'Reporte y retroalimentación.']],
      mat: 'Sistemas de prueba armados (uno por equipo) con su diagrama, multímetros, computadora con monitor serie si hay.', ev: 'Inspección del funcionamiento interno y cableado del sistema embebido con su diagrama (Desempeño · actividad clave)',
      guia: { pasos: [['Puertos', 'Señala los pines de entrada, salida, analógicos, PWM, alimentación y comunicación que usa el sistema.'], ['Diagrama', 'Compara el cableado real con el diagrama y marca diferencias.'], ['Voltajes', 'Mide 5 V, 3.3 V y la señal de cada sensor.'], ['Funcionamiento', 'Acciona cada entrada y observa la salida y, si hay, el monitor serie.'], ['Explica', 'Explica al docente la función de cada periférico.']], tabla: { cab: ['Punto', 'Esperado', 'Medido u observado'], filas: 6 }, revisa: ['Puertos identificados', 'Voltajes medidos', 'Diferencias con el diagrama señaladas'], entrega: 'Hoja de inspección.' },
      ideas: ['coevaluacion'], pre: 'inspeccionar · verificar' },
    { id: 'm3e-potencia-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Etapa de potencia: transistor, MOSFET y relevador', obj: 'Elegir y conectar la etapa de potencia para cargas de 12 V.', ac: 2, dc: 0, tema: 'm3-potencia-emb',
      pasos: [[10, 'Pregunta-reto: ¿por qué no conectas la bomba al pin 9?'], [35, 'Tema en proyector con la figura del MOSFET.'], [40, 'Dibujan la conexión de bomba con MOSFET y de K1 con ULN2003 y comparan.'], [10, 'Revisión.'], [5, 'Boleto de salida.']],
      ideas: ['m3-mosfet-logico', 'm3-uln2003'], pre: 'MOSFET · compuerta · diodo' },
    { id: 'm3e-potencia-pr', h: 2, m: 'd', lugar: 'computo', tipo: 'Práctica', t: 'Motor de 12 V con MOSFET y PWM', obj: 'Ensamblar una etapa de potencia con MOSFET y regular la velocidad con PWM.', ac: 2, dc: 0, tema: 'm3-potencia-emb', dep: ['m3e-analogica-sim'],
      pasos: [[10, 'Seguridad: fuente de 12 V desconectada mientras arman.'], [50, 'Arman la etapa con MOSFET y prueban la velocidad con el potenciómetro.'], [25, 'Miden voltaje promedio y corriente del motor en tres posiciones.'], [15, 'Comparan con la alternativa de relevador (sin PWM).']],
      mat: 'Arduino, MOSFET IRLZ44N o módulo de nivel lógico, resistores de 220 Ω y 10 kΩ, diodo, motor de 12 V del tablero (la bomba se prueba después con agua), fuente de 12 V, multímetro.',
      guia: { pasos: [['Bloqueo', 'Fuente de 12 V desconectada mientras armas.'], ['MOSFET', 'Pin 9 → 220 Ω → compuerta; 10 kΩ de compuerta a GND; fuente a GND común; motor entre +12 V y drenador; diodo en paralelo con el motor (franja al +12 V).'], ['Programa', 'El potenciómetro de A0 regula la velocidad con analogWrite(9, …).'], ['Mide', 'Voltaje promedio en el motor y corriente en tres posiciones de la perilla.'], ['Relevador', 'Alternativa: mueve K1 del tablero con el ULN2003 (sin PWM).']], tabla: { cab: ['Perilla', 'Valor de analogWrite', 'Voltaje en el motor', 'Corriente'], filas: [['Mínimo', '', '', ''], ['Mitad', '', '', ''], ['Máximo', '', '', '']] }, revisa: ['GND común', 'Diodo bien orientado', 'MOSFET de nivel lógico'], seguridad: 'Solo 12 V de CD y sin agua en esta práctica. Si el MOSFET se calienta mucho, desconecta y revisa.', entrega: 'Tabla y conclusión.' },
      ideas: ['m3-mosfet-logico'], pre: 'PWM · velocidad · GND común' },
    { id: 'm3e-millis-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Tiempo sin bloquear y máquinas de estados', obj: 'Programar tiempos con millis() y organizar el programa en estados.', ac: 1, dc: 1, tema: 'm3-millis-estados',
      pasos: [[10, 'Reto: un LED que parpadea y un botón que responde al mismo tiempo: con delay no se puede.'], [35, 'Tema en proyector con la figura de estados.'], [40, 'En papel: diagrama de estados y switch de un semáforo con botón peatonal.'], [10, 'Revisión.'], [5, 'Boleto de salida.']],
      ideas: ['m3-estado-tarjetas', 'm3-grafcet-piso'], pre: 'millis · estado · transición' },
    { id: 'm3e-estados-sim', h: 2, m: 'd', lugar: 'computo', tipo: 'Simulador', t: 'Semáforo peatonal sin delay', obj: 'Programar una máquina de estados con millis() y un botón que siempre responde.', ac: 1, dc: 2, tema: 'm3-millis-estados', dep: ['m3e-botones-sim'],
      pasos: [[10, 'Indicaciones.'], [60, 'Programan los estados y las transiciones en Wokwi.'], [25, 'Prueban casos y lo cargan a la tarjeta.'], [5, 'Guardan.']],
      guia: { sw: SW, link: WK, pasos: [['Estados', 'Constantes VERDE_AUTOS, AMBAR y ROJO_AUTOS (cruza el peatón) y una variable estado.'], ['Tiempo', 'unsigned long inicio; al entrar a cada estado: inicio = millis();'], ['Botón', 'En VERDE_AUTOS, si se presionó el botón y ya pasaron al menos 5 s → AMBAR.'], ['Transiciones', 'AMBAR 2 s → ROJO_AUTOS; ROJO_AUTOS 8 s → VERDE_AUTOS.'], ['Prueba', 'El botón responde en cualquier momento (sin delay).']], tabla: { cab: ['Prueba', 'Esperado', 'Resultado'], filas: [['Botón con el verde recién iniciado', 'Espera a completar 5 s', ''], ['Botón con el verde ya largo', 'Pasa pronto a ámbar', ''], ['Sin botón', 'Se queda en verde', '']] }, revisa: ['Sin delay', 'Transiciones claras'], entrega: 'Código y tabla.' },
      ideas: ['m3-estado-tarjetas'], pre: 'switch · millis · estados' },
    { id: 'm3e-repaso-medio', h: 1, m: 'd', tipo: 'Evaluación', t: 'Repaso de medio parcial', obj: 'Revisar qué temas ya dominan y cuáles no, a tiempo.', ac: null,
      pasos: [[10, 'Semáforo: cada quien marca sus temas en verde, amarillo o rojo.'], [30, '¿Quién quiere ser técnico? con preguntas del banco.'], [10, 'Acuerdos de recuperación para los temas en rojo.']], ideas: ['semaforo', 'pr-quien-quiere'] },
    { id: 'm3e-tablero-arduino', h: 2, m: 'd', lugar: 'computo', tipo: 'Práctica', t: 'El tablero del 1er parcial programado en C++', obj: 'Programar la inversión de giro del tablero como máquina de estados en C++ y compararla con el PLC.', ac: 2, dc: 1, tema: 'm3-millis-estados', dep: ['m3e-estados-sim'],
      pasos: [[10, 'Traen el tablero con su Arduino y ULN2003 del 2º parcial.'], [60, 'Escriben la inversión con estados PARO, ADELANTE, ATRÁS y PAUSA, con finales de carrera.'], [25, 'La cargan y prueban; comparan con el programa de OpenPLC.'], [5, 'Guardan.']],
      mat: 'Tablero de 12 V con Arduino y ULN2003, computadora, multímetro.', ev: 'Inversión de giro programada en C++ y probada (Desempeño)',
      guia: { sw: SW, pasos: [['Entradas', 'Tu tablero ya tiene pull-down de 10 kΩ: usa pinMode(pin, INPUT); presionado = HIGH. El paro es NC: en reposo lee HIGH.'], ['Salidas', 'K1 y K2 por el ULN2003 como OUTPUT.'], ['Estados', 'PARO, ADELANTE, ATRAS y PAUSA (1 s antes de cambiar de sentido).'], ['Seguridad', 'En cualquier estado, si PARO lee LOW → estado PARO y salidas apagadas.'], ['Límites', 'En ADELANTE, el final de carrera regresa a PARO; igual en ATRAS.'], ['Compara', '¿Qué fue más fácil, la escalera o el C++? Anota dos ventajas de cada uno.']], tabla: { cab: ['Prueba', 'Esperado', 'Resultado'], filas: [['ADELANTE', 'K1', ''], ['ATRAS con K1 activo', 'No cambia', ''], ['PARO', 'Todo apagado', ''], ['Final de carrera', 'Se detiene', '']] }, revisa: ['El paro manda siempre', 'Nunca K1 y K2 juntos'], seguridad: 'Se conserva el enclavamiento cableado entre K1 y K2.', entrega: 'Código y tabla.' },
      ideas: ['m3-boton-nc'], pre: 'estados · inversión · comparación' },
    { id: 'm3e-nexo-c', h: 2, m: 'd', tipo: 'Formación', t: 'Nexo agua-energía-alimento y riego eficiente', obj: 'Relacionar el riego automático con el cuidado del agua y la energía.', ac: 2, dc: 2, tema: 'm3-nexo-energia',
      pasos: [[10, 'Pregunta: ¿de dónde viene el agua que llega a tu casa y cuánta energía cuesta subirla?'], [35, 'Tema en proyector con la figura del nexo.'], [30, 'Calculan agua y energía de regar un huerto escolar a mano y con riego automático.'], [20, 'Cada equipo propone una mejora de ahorro para su proyecto.'], [5, 'Boleto de salida.']],
      ideas: ['m3-agua-cuenta', 'm3-energia-kwh'], pre: 'nexo · acuífero · Wh' },
    { id: 'm3e-proyecto-def', h: 2, m: 'd', tipo: 'Proyecto', t: 'Proyecto: especificación del riego automático', obj: 'Definir estados, pines, materiales y diagrama del riego automático.', ac: 0, dc: 2, tema: 'm3-millis-estados',
      pasos: [[15, 'Lees la especificación: mide cada 10 s; si está seco (umbral con perilla) y hay agua, riega máximo 5 s y espera 30 s; sin agua no riega y parpadea el LED rojo; botón de riego manual de 3 s; todo se reporta por serie.'], [55, 'En equipo: estados y transiciones, tabla de pines, lista de materiales y diagrama.'], [25, 'Presentan en 2 minutos y responden preguntas.'], [5, 'Tarea.']],
      tarea: 'Preparen la maceta de prueba, el depósito de agua con tapa y la manguera.', ideas: ['m3-estado-tarjetas', 'm3-riego-maceta'], pre: 'especificación · estados · materiales' },
    { id: 'm3e-nivel-pr', h: 1, m: 'd', lugar: 'computo', tipo: 'Práctica', t: 'Protección de la bomba: nivel del depósito', obj: 'Detectar el nivel del depósito y programar el estado de falla.', ac: 2, dc: 1, tema: 'm3-sensores-emb', dep: ['m3e-sensores-pr'],
      pasos: [[5, 'Indicaciones.'], [30, 'Conectan el flotador (o el HC-SR04) y programan el estado FALLA con LED rojo parpadeando sin delay.'], [15, 'Prueban vaciando y llenando un vaso.']],
      mat: 'Arduino, flotador o HC-SR04, LED rojo con 220 Ω, vaso con agua, charola.',
      guia: { sw: SW, link: WK, pasos: [['Flotador', 'Entre el pin 3 y GND con INPUT_PULLUP: revisa qué lee con agua y sin agua.'], ['Ultrasónico', 'Alternativa: HC-SR04 sobre el depósito; distancia = µs × 0.0343 / 2; nivel = altura del depósito − distancia.'], ['Falla', 'Si no hay agua: estado FALLA, bomba apagada y LED rojo parpadeando con millis().'], ['Recupera', 'Cuando vuelve a haber agua, regresa a ESPERA.'], ['Prueba', 'Vacía y llena el vaso tres veces.']], tabla: { cab: ['Prueba', 'Esperado', 'Resultado'], filas: [['Con agua', 'ESPERA', ''], ['Sin agua', 'FALLA y LED rojo', ''], ['Vuelve el agua', 'ESPERA', '']] }, revisa: ['La bomba nunca se activa sin agua'], seguridad: 'Trabaja sobre la charola; la tarjeta lejos del vaso.', entrega: 'Código y tabla.' },
      ideas: ['m3-riego-maceta'], pre: 'nivel · falla · protección' },
    { id: 'm3e-programa', h: 3, m: 'd', lugar: 'computo', tipo: 'Evaluación', t: 'Programa el código del riego (actividad clave)', obj: 'Programar el riego con especificaciones lógicas, sintaxis correcta y compilación sin errores.', ac: 1, dc: 2, tema: 'm3-millis-estados', dep: ['m3e-proyecto-def'],
      pasos: [[10, 'Indicaciones y rúbrica.'], [110, 'Programan: constantes de pines, funciones, máquina de estados con millis() y comentarios; compilan y simulan en Wokwi con potenciómetros en lugar de sensores.'], [30, 'Revisión con la rúbrica y carga de la versión riego_v1 a la tarjeta.']],
      ev: 'Programa del riego con especificaciones lógicas, compilado y comentado (Producto · actividad clave)',
      guia: { sw: SW, link: WK, pasos: [['Encabezado', 'Comentario con proyecto, equipo (apodos) y fecha; tabla de pines en constantes.'], ['Funciones', 'leerHumedad() en %, hayAgua(), bomba(bool) y leds(estado).'], ['Estados', 'ESPERA, MIDE, RIEGA, PAUSA y FALLA con switch y millis().'], ['Umbral', 'UMBRAL = map(analogRead(A1), 0, 1023, 20, 80): se ajusta con la perilla sin volver a cargar.'], ['Serie', 'Imprime humedad, umbral y estado en cada medición.'], ['Compila y simula', 'Sin errores; en Wokwi usa potenciómetros como sensores y un LED como bomba.'], ['Carga', 'Carga riego_v1 a tu tarjeta.']], revisa: ['Compila sin errores', 'Sin delay largos', 'Riego máximo 5 s', 'No riega sin agua', 'Código comentado'], entrega: 'Código riego_v1 y captura de la simulación.' },
      ideas: ['m3-wokwi', 'm3-pseudocodigo'], pre: 'programa · compilar · rúbrica' },
    { id: 'm3e-depuracion-c', h: 1, m: 'd', tipo: 'Teoría', t: 'Depuración y verificación del sistema', obj: 'Distinguir errores de compilación, lógica y hardware y planear la lista de pruebas.', ac: 1, dc: 2, tema: 'm3-depuracion',
      pasos: [[10, 'Código roto en pantalla: ¿cuántos errores ves?'], [25, 'Tema en proyector.'], [15, 'En parejas encuentran 5 errores en un código impreso.']],
      ideas: ['m3-codigo-roto'], pre: 'compilación · lógica · hardware' },
    { id: 'm3e-montaje-riego', h: 3, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Taller', t: 'Montaje del riego: sensores, bomba y etapa de potencia', obj: 'Ensamblar los elementos de potencia y control del riego con seguridad.', ac: 2, dc: 0, tema: 'm3-potencia-emb', dep: ['m3e-programa', 'm3e-potencia-pr'],
      pasos: [[15, 'Seguridad: agua y electricidad, charola, tarjeta elevada.'], [100, 'Montan maceta con sensor, depósito con bomba y manguera, etapa de potencia y Arduino en base elevada, con cables ordenados.'], [25, 'Revisión sin energía: polaridades, diodo y GND común; revisión del docente.'], [10, 'Orden.']],
      mat: 'Maceta o vaso con tierra, depósito con tapa, mini bomba sumergible de 12 V, manguera, sensor capacitivo, MOSFET o ULN2003 con K1, flotador, Arduino con riego_v1, fuente de 12 V, charola, cinchos.', ev: 'Sistema embebido ensamblado con su etapa de potencia (Producto)',
      guia: { pasos: [['Zonas', 'Tarjeta, fuente y etapa de potencia elevadas y lejos del agua; maceta y depósito sobre la charola.'], ['Sensor', 'Entierra el sensor hasta su marca, cerca de la raíz, sin mojar su parte electrónica.'], ['Bomba', 'Bomba sumergida en el depósito y manguera a la maceta; diodo en paralelo con la bomba.'], ['Potencia', 'MOSFET en el pin 9 (o K1 del tablero con el ULN2003); GND común.'], ['Nivel', 'Flotador en el depósito al pin 3.'], ['Revisión', 'Sin energía: polaridades, diodo y tierras; pide revisión al docente.']], revisa: ['Electrónica lejos del agua', 'Diodo y GND común', 'Cables fijos con cinchos'], seguridad: 'Solo 12 V de CD. Nada de 127 V cerca del agua. Si se moja la electrónica, desconecta todo y sécala antes de volver a energizar.', entrega: 'Foto del montaje (sin rostros).' },
      ideas: ['m3-riego-maceta', 'm3-candado-loto'], pre: 'zona seca · zona húmeda · potencia' },
    { id: 'm3e-carga-prueba', h: 2, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Práctica', t: 'Carga y prueba del riego', obj: 'Cargar el programa y comprobar cada función del sistema con la lista de pruebas.', ac: 2, dc: 1, tema: 'm3-depuracion', dep: ['m3e-montaje-riego'],
      pasos: [[10, 'Conexión y revisión.'], [55, 'Lista de pruebas: seco con agua, húmedo, depósito vacío, botón manual y corte de energía.'], [25, 'Ajustan el umbral con la perilla y observan cuánto tarda el agua en repartirse.'], [10, 'Hoja de servicio.']],
      mat: 'Sistema montado, laptop (del docente o de un equipo) si hay que recargar, multímetro, hoja de servicio.', ev: 'Lista de pruebas del riego (Desempeño)',
      guia: { pasos: [['Carga', 'Si hiciste cambios, carga la nueva versión; si no, usa riego_v1.'], ['Seco', 'Tierra seca y depósito con agua: debe regar máximo 5 s y pasar a PAUSA.'], ['Húmedo', 'Tierra húmeda: no riega.'], ['Sin agua', 'Saca el flotador del agua: no riega y parpadea el LED rojo.'], ['Manual', 'Botón: riega 3 s.'], ['Energía', 'Desconecta y reconecta: arranca en ESPERA, no regando.']], tabla: { cab: ['Prueba', 'Esperado', 'Resultado', '¿Pasó?'], filas: [['Seco con agua', 'Riega ≤ 5 s', '', ''], ['Húmedo', 'No riega', '', ''], ['Sin agua', 'FALLA', '', ''], ['Botón manual', 'Riega 3 s', '', ''], ['Corte de energía', 'Arranca en ESPERA', '', '']] }, revisa: ['Todas las pruebas pasan o tienen corrección anotada'], entrega: 'Lista de pruebas en la hoja de servicio.' },
      ideas: ['m3-hoja-servicio', 'm3-depura-serial'], pre: 'lista de pruebas · ajuste' },
    { id: 'm3e-energia-pr', h: 2, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Práctica', t: 'Consumo del sistema y ahorro de energía', obj: 'Medir el consumo del riego, calcular su energía diaria y optimizarla.', ac: 2, dc: 2, tema: 'm3-nexo-energia', dep: ['m3e-carga-prueba'],
      pasos: [[10, 'Indicaciones: multímetro en serie con la fuente de 12 V (borne de 10 A).'], [45, 'Miden la corriente en ESPERA y en RIEGA; miden cuántos mL entrega la bomba en 5 s.'], [30, 'Calculan Wh al día y litros por semana; proponen y, si hay laptop, aplican una mejora (apagar el LED de estado, alimentar el sensor solo al medir).'], [15, 'Conclusiones para el cartel de la feria.']],
      mat: 'Sistema funcionando, multímetro, vaso medidor, cronómetro.', ev: 'Cálculo de consumo y propuesta de ahorro (Producto)',
      guia: { pasos: [['Corriente en espera', 'Multímetro en serie con la fuente: anota mA en ESPERA.'], ['Corriente regando', 'Anota mA mientras riega.'], ['Agua', 'Mide los mL que entrega la bomba en 5 s.'], ['Energía', 'Wh al día = 12 V × A en espera × 24 h + W de la bomba × horas de riego.'], ['Mejora', 'Aplica o propone una mejora y estima el ahorro.']], tabla: { cab: ['Dato', 'Valor'], filas: [['Corriente en espera', ''], ['Corriente regando', ''], ['mL en 5 s', ''], ['Wh al día', ''], ['Litros por semana', '']] }, revisa: ['Cálculos con unidades', 'Mejora justificada'], seguridad: 'Regresa la punta roja al borne de voltaje al terminar.', entrega: 'Tabla y conclusión.' },
      ideas: ['m3-agua-cuenta', 'm3-energia-kwh'], pre: 'mA · Wh · litros' },
    { id: 'm3e-fallas-pr', h: 2, m: 'd', tipo: 'Práctica', t: 'Código roto y cable suelto', obj: 'Localizar errores de código y fallas de hardware con método.', ac: 1, dc: 2, tema: 'm3-depuracion',
      pasos: [[10, 'Indicaciones.'], [35, 'Ronda de código: programas impresos con errores de compilación y de lógica.'], [35, 'Ronda de hardware: falla oculta en el sistema de otro equipo (cable del sensor, GND o diodo).'], [20, 'Plenaria: ¿qué tipo de error era y cómo lo encontraron?']],
      mat: 'Códigos impresos con errores, sistemas de riego, multímetros, hojas de servicio.', ev: 'Hoja de fallas encontradas y corregidas (Desempeño)', ideas: ['m3-codigo-roto', 'm3-falla-oculta'], pre: 'compilación · lógica · hardware' },
    { id: 'm3e-ajustes', h: 2, m: 'd', lugar: 'taller', noComputo: true, tipo: 'Proyecto', t: 'Ajustes finales y ensayo de la feria', obj: 'Dejar el sistema listo, ordenado y con su cartel, y ensayar la explicación.', ac: 2, dc: 2, dep: ['m3e-energia-pr'],
      pasos: [[15, 'Lista de pendientes.'], [60, 'Terminan, ordenan cables y etiquetas, y hacen su cartel con diagrama, estados y datos de agua y energía.'], [25, 'Ensayo de la explicación en 2 minutos.']],
      ideas: ['m3-feria-proyectos', 'pr-antes-despues'], pre: 'cartel · ensayo' },
    { id: 'm3e-documenta', h: 1, m: 'd', tipo: 'Proyecto', t: 'Documentación del proyecto', obj: 'Integrar el expediente técnico del riego automático.', ac: 1, dc: 2,
      pasos: [[40, 'Expediente: diagrama, tabla de pines, código comentado impreso, lista de pruebas, consumo y conclusión sobre el nexo agua-energía-alimento.'], [10, 'Entregan.']],
      ev: 'Expediente del riego automático (Producto)', ideas: ['m3-hoja-servicio'] },

    { id: 'm3e-verifica', h: 3, m: 'c', lugar: 'taller', noComputo: true, tipo: 'Evaluación', t: 'Verifica el funcionamiento del sistema (actividad clave)', obj: 'Comprobar el sistema embebido con sus elementos de potencia y control funcionando, optimizando agua y energía.', ac: 2, dc: 2, dep: ['m3e-ajustes'],
      pasos: [[10, 'Indicaciones y orden.'], [110, 'Cada equipo demuestra su riego con la lista de pruebas; evalúas con la lista de cotejo y corrigen lo que falle.'], [30, 'Reporte de resultados, consumo y correcciones.']],
      mat: 'Sistemas de riego, lista de cotejo, multímetro.', ev: 'Sistema embebido con elementos de potencia y control funcionando (Producto · actividad clave)',
      guia: { pasos: [['Funcionamiento', 'Seco con agua, húmedo, sin agua, botón manual y corte de energía.'], ['Potencia', 'La bomba responde y la etapa de potencia no se calienta de más.'], ['Seguridad', 'Electrónica lejos del agua y GND común.'], ['Energía', 'Consumo medido y mejora aplicada o propuesta.'], ['Código', 'Comentado y versión cargada identificada.']], tabla: { cab: ['Prueba', 'Cumple', 'Corrección'], filas: 6 }, revisa: ['Todas las pruebas cumplen o están corregidas'], entrega: 'Lista de cotejo firmada y reporte.' },
      ideas: ['coevaluacion'], pre: 'verificar · reportar' },
    { id: 'm3e-feria', h: 2, m: 'c', noComputo: true, tipo: 'Proyecto', t: 'Feria de automatización del semestre', obj: 'Explicar a otros el tablero, la estación con PLC y el riego automático.', ac: 2, dc: 2,
      pasos: [[10, 'Montan sus stands.'], [70, 'Cada equipo presenta sus tres proyectos del semestre a visitantes de otros grupos; los visitantes coevalúan con una ficha.'], [20, 'Cierre y reconocimiento a la mejor explicación.']],
      ev: 'Presentación en la feria (Desempeño)', ideas: ['m3-feria-proyectos', 'coevaluacion'], pre: 'explicar · defender' },
    { id: 'examen-m3s3', h: 2, m: 'c', tipo: 'Evaluación', t: 'Examen del 3er parcial', obj: 'Evaluar los conocimientos del submódulo.', ac: null,
      pasos: [[10, 'Indicaciones y respiración antes del examen.'], [80, 'Examen escrito (Escuadra lo arma con los temas que diste).'], [10, 'Recoges y comentas lo que viene.']], ev: 'Examen del parcial', ideas: ['pr-respira'] },
    { id: 'm3e-retro', h: 2, m: 'c', tipo: 'Evaluación', t: 'Retroalimentación y evidencias pendientes', obj: 'Corregir errores del examen y recuperar evidencias.', ac: null,
      pasos: [[30, 'Errores comunes del examen en pantalla, sin nombres.'], [50, 'Recuperación de evidencias pendientes.'], [20, 'Revisión de calificaciones con cada alumno.']] },
    { id: 'm3e-cierre', h: 1, m: 'c', tipo: 'Formación', t: 'Cierre del módulo y meta para 5º semestre', obj: 'Reflexionar sobre el módulo y separar el material de forma responsable.', ac: null,
      pasos: [[20, 'Autoevaluación del módulo: tablero, PLC y sistemas embebidos.'], [15, 'Meta para el Módulo IV: máquinas CNC y robótica.'], [15, 'Desmontaje responsable: separan lo reutilizable y lo que va al acopio.']], ideas: ['m3-desmontaje', 'pr-muro-logros'] }
  ];

  /* =================== BANCO DE PREGUNTAS =================== */
  const gen = {
    m3adc: rnd => { if (rnd() < 0.5) { const V = pick(rnd, [0.5, 1, 1.25, 2, 2.5, 3, 3.3, 4, 4.5]), L = Math.round(V / 5 * 1023);
        return { q: 'Un sensor entrega ' + f(V, 2) + ' V a la entrada A0 (referencia de 5 V). ¿Qué valor aproximado da analogRead(A0)?', op: ops(String(L), [String(Math.round(V / 5 * 255)), String(Math.round(V * 100)), String(Math.round(V * 1023))], [String(Math.round(L / 2)), String(L * 2)]), r: f(V, 2) + ' / 5 × 1023 ≈ ' + L + '.' }; }
      const L = pick(rnd, [100, 205, 300, 409, 614, 700, 818, 900]), V = L * 5 / 1023;
      return { q: 'analogRead(A0) da ' + L + ' (referencia de 5 V). ¿Qué voltaje hay en A0?', op: ops(f(V, 2) + ' V', [f(L * 5 / 255, 2) + ' V', f(L / 100, 2) + ' V', f(L / 1023, 2) + ' V'], [f(5 - V, 2) + ' V', f(V * 2, 2) + ' V']), r: L + ' × 5 / 1023 = ' + f(V, 2) + ' V.' }; },
    m3pwm: rnd => { const x = pick(rnd, [26, 51, 64, 77, 102, 153, 179, 191, 204, 230]), dc = x / 255 * 100, V = 5 * x / 255;
      const T = (a, b) => f(a, 0) + ' % · ' + f(b, 2) + ' V';
      return { q: '¿Qué ciclo de trabajo y voltaje promedio da analogWrite(9, ' + x + ') con 5 V?', op: ops(T(dc, V), [T(x / 1023 * 100, 5 * x / 1023), T(dc, 5), T(100 - dc, 5 - V)], [T(dc / 2, V / 2), T(dc * 2, V * 2)]), r: x + ' / 255 = ' + f(dc, 1) + ' % del tiempo en alto; 5 × ' + x + ' / 255 = ' + f(V, 2) + ' V de promedio.' }; },
    m3map: rnd => { const out = pick(rnd, [100, 180, 255]), x = pick(rnd, [100, 256, 300, 400, 512, 600, 700, 800, 900, 1000]), r = Math.floor(x * out / 1023);
      return { q: '¿Qué devuelve map(' + x + ', 0, 1023, 0, ' + out + ')?', op: ops(String(r), [String(Math.round(x * out / 1000)), String(Math.floor(x / 4)), String(out - r)], [String(r + 2), String(x)]), r: x + ' × ' + out + ' / 1023 = ' + f(x * out / 1023, 2) + '; map() trabaja con enteros y quita los decimales: ' + r + '.' }; },
    m3distancia: rnd => { const t = pick(rnd, [580, 870, 1160, 1450, 2320, 2900, 4060, 5800, 8700]), dcm = t * 0.0343 / 2;
      return { q: 'El eco de un sensor HC-SR04 dura ' + t + ' µs. ¿A qué distancia aproximada está el objeto? (sonido: 0.0343 cm/µs)', op: ops(f(dcm, 1) + ' cm', [f(t * 0.0343, 1) + ' cm', f(t * 0.343 / 2, 1) + ' cm', f(t / 2, 0) + ' cm'], [f(dcm / 2, 1) + ' cm']), r: t + ' × 0.0343 / 2 = ' + f(dcm, 1) + ' cm; se divide entre 2 porque el sonido va y regresa.' }; },
    m3millis: rnd => { const ini = pick(rnd, [1000, 2500, 12000, 40000, 65000]), intv = pick(rnd, [500, 1000, 3000, 5000, 10000]), dt = pick(rnd, [200, 400, 900, 2500, 4000, 6000, 12000]), now = ini + dt, ya = dt >= intv;
      const SI = n => 'Sí: ya pasaron ' + n + ' ms', NO = n => 'No: faltan ' + n + ' ms';
      return { q: 'En un programa con millis(), inicio = ' + ini + ' e intervalo = ' + intv + ' ms. Si ahora millis() vale ' + now + ', ¿se cumple if (millis() - inicio >= intervalo)?', op: ops(ya ? SI(dt) : NO(intv - dt), [ya ? NO(dt - intv) : SI(dt), SI(now), NO(intv)], [NO(intv + dt), SI(intv)]), r: 'millis() - inicio = ' + now + ' - ' + ini + ' = ' + dt + ' ms; ' + (ya ? 'es mayor o igual que ' + intv + ': sí se cumple.' : 'es menor que ' + intv + ': faltan ' + (intv - dt) + ' ms.') }; },
    m3consumo: rnd => { const I = pick(rnd, [40, 50, 60, 80]), P = pick(rnd, [2, 3, 4, 5]), min = pick(rnd, [10, 15, 20, 30]), eb = 12 * I / 1000 * 24, ep = P * min / 60, tot = eb + ep;
      const Wh = x => f(x, 1) + ' Wh';
      return { q: 'Un riego automático consume ' + I + ' mA a 12 V las 24 h, y su bomba de ' + P + ' W trabaja ' + min + ' min al día. ¿Cuánta energía usa al día?', op: ops(Wh(tot), [Wh(12 * I / 1000 + P), Wh(eb + P * min), Wh(12 * I * 24 + ep)], [Wh(eb), Wh(ep)]), r: 'Control: 12 V × ' + f(I / 1000, 3) + ' A × 24 h = ' + f(eb, 2) + ' Wh; bomba: ' + P + ' W × ' + f(min / 60, 2) + ' h = ' + f(ep, 2) + ' Wh; total ≈ ' + Wh(tot) + '.' }; }
  };
  const banco = [
    // embebido
    { id: 'm3sa1', tema: 'm3-embebido', tipo: 'om', niv: 1, q: '¿Qué es un sistema embebido?', op: ['Una computadora dedicada a una tarea dentro de un producto', 'Una computadora de escritorio', 'Un programa de diseño', 'Un PLC modular'] },
    { id: 'm3sa2', tema: 'm3-embebido', tipo: 'om', niv: 1, q: '¿En qué memoria se guarda el programa del Arduino?', op: ['Flash', 'RAM', 'EEPROM', 'Caché'] },
    { id: 'm3sa3', tema: 'm3-embebido', tipo: 'om', niv: 2, q: '¿Qué microcontrolador usa el Arduino Uno?', op: ['ATmega328P', 'ESP32', 'Intel Core i5', 'ULN2003'] },
    { id: 'm3sa4', tema: 'm3-embebido', tipo: 'vf', niv: 2, q: 'La RAM conserva las variables aunque se apague la tarjeta.', v: false, exp: 'La RAM se borra al apagar; para guardar datos se usa la EEPROM.' },
    { id: 'm3sa5', tema: 'm3-embebido', tipo: 'om', niv: 2, q: '¿Cuál de estos NO es un periférico de un microcontrolador?', op: ['El monitor de la computadora', 'El convertidor analógico-digital', 'El PWM', 'El puerto serie'] },
    { id: 'm3sa6', tema: 'm3-embebido', tipo: 'ab', niv: 2, q: 'Da dos ejemplos de sistemas embebidos de tu casa e indica sus entradas y salidas.', r: 'Microondas: teclado y sensor de puerta → magnetrón, plato y pantalla. Lavadora: perilla y sensor de nivel → válvula, motor y bomba.' },
    // pines
    { id: 'm3sb1', tema: 'm3-uno-pines', tipo: 'om', niv: 1, q: '¿Cuántas entradas analógicas tiene el Arduino Uno?', op: ['6 (A0 a A5)', '14', '2', '8'] },
    { id: 'm3sb2', tema: 'm3-uno-pines', tipo: 'om', niv: 1, q: '¿Qué pines del Uno pueden dar PWM?', op: ['3, 5, 6, 9, 10 y 11', '0 a 13', 'A0 a A5', 'Solo el 13'] },
    { id: 'm3sb3', tema: 'm3-uno-pines', tipo: 'om', niv: 2, q: '¿Cuánta corriente se recomienda como máximo por pin?', op: ['Unos 20 mA', '2 A', '500 mA', '1 mA'] },
    { id: 'm3sb4', tema: 'm3-uno-pines', tipo: 'vf', niv: 2, q: 'Los pines 0 y 1 se pueden usar libremente aunque uses el monitor serie.', v: false, exp: 'Son el puerto serie del USB; usarlos interfiere con la carga y con el monitor.' },
    { id: 'm3sb5', tema: 'm3-uno-pines', tipo: 'om', niv: 2, q: '¿Qué voltaje se recomienda en el pin Vin?', op: ['7 a 12 V', '5 V exactos', '24 V', '127 V'] },
    { id: 'm3sb6', tema: 'm3-uno-pines', tipo: 'om', niv: 3, q: 'Necesitas una pantalla I2C. ¿A qué pines del Uno la conectas?', op: ['A4 (SDA) y A5 (SCL)', '0 y 1', '9 y 10', 'A0 y A1'] },
    // estructura
    { id: 'm3sc1', tema: 'm3-cpp-basico', tipo: 'om', niv: 1, q: '¿Cuántas veces se ejecuta setup()?', op: ['Una vez, al encender', 'Sin fin', 'Cada segundo', 'Nunca'] },
    { id: 'm3sc2', tema: 'm3-cpp-basico', tipo: 'om', niv: 1, q: '¿Qué instrucción configura un pin como salida?', op: ['pinMode(pin, OUTPUT)', 'digitalWrite(pin, HIGH)', 'analogRead(pin)', 'Serial.begin(9600)'] },
    { id: 'm3sc3', tema: 'm3-cpp-basico', tipo: 'om', niv: 2, q: '¿Qué tipo de variable conviene para guardar millis()?', op: ['unsigned long', 'int', 'bool', 'char'] },
    { id: 'm3sc4', tema: 'm3-cpp-basico', tipo: 'vf', niv: 1, q: 'En C++ da igual escribir digitalWrite o digitalwrite.', v: false, exp: 'C++ distingue mayúsculas: digitalwrite no existe.' },
    { id: 'm3sc5', tema: 'm3-cpp-basico', tipo: 'om', niv: 2, q: 'El IDE marca el error «expected \';\' before…». ¿Qué falta?', op: ['Un punto y coma', 'Una librería', 'Elegir la tarjeta', 'Un resistor'] },
    { id: 'm3sc6', tema: 'm3-cpp-basico', tipo: 'ab', niv: 2, q: '¿Para qué sirve dar nombre a los pines con constantes (const int BOMBA = 9;)?', r: 'Para que el código sea legible y, si cambias el pin, solo lo cambies en un lugar.' },
    // decisiones
    { id: 'm3sd1', tema: 'm3-decisiones', tipo: 'om', niv: 1, q: '¿Qué operador compara si dos valores son iguales?', op: ['==', '=', '!=', '&&'] },
    { id: 'm3sd2', tema: 'm3-decisiones', tipo: 'om', niv: 2, q: '¿Cómo se escribe «seco Y con agua» en C++?', op: ['seco && conAgua', 'seco || conAgua', 'seco = conAgua', '!seco'] },
    { id: 'm3sd3', tema: 'm3-decisiones', tipo: 'om', niv: 2, q: '¿Cuántas veces se ejecuta for (int i = 0; i < 5; i++)?', op: ['5', '4', '6', 'Sin fin'] },
    { id: 'm3sd4', tema: 'm3-decisiones', tipo: 'vf', niv: 2, q: 'if (x = 5) compara si x vale 5.', v: false, exp: '= asigna; para comparar se usa ==.' },
    { id: 'm3sd5', tema: 'm3-decisiones', tipo: 'om', niv: 2, q: '¿Qué ventaja tiene usar funciones propias como regar()?', op: ['El loop queda corto y legible y se reutiliza código', 'El programa siempre corre más rápido', 'No hay que compilar', 'Ahorra pines'] },
    { id: 'm3sd6', tema: 'm3-decisiones', tipo: 'ab', niv: 3, q: 'Escribe con if: encender la bomba si la humedad es menor que el umbral y hay agua; si no, apagarla.', r: 'if (humedad < umbral && hayAgua) { digitalWrite(BOMBA, HIGH); } else { digitalWrite(BOMBA, LOW); }' },
    // botones
    { id: 'm3se1', tema: 'm3-entradas-dig', tipo: 'om', niv: 1, q: 'Con INPUT_PULLUP, ¿qué lee el pin con el botón presionado?', op: ['LOW', 'HIGH', '1023', 'Nada'] },
    { id: 'm3se2', tema: 'm3-entradas-dig', tipo: 'om', niv: 2, q: '¿Dónde se conecta el botón con INPUT_PULLUP?', op: ['Entre el pin y GND', 'Entre el pin y 12 V', 'Entre 5 V y 12 V', 'En serie con un LED'] },
    { id: 'm3se3', tema: 'm3-entradas-dig', tipo: 'om', niv: 2, q: '¿Qué es el rebote de un botón?', op: ['Varias conmutaciones rápidas al presionarlo', 'Que el botón regresa con su resorte', 'Un error de compilación', 'Que el LED parpadea'] },
    { id: 'm3se4', tema: 'm3-entradas-dig', tipo: 'vf', niv: 2, q: 'Para contar pulsaciones se actúa en el flanco, no mientras el botón está presionado.', v: true, exp: 'Así cada pulsación cuenta una sola vez.' },
    { id: 'm3se5', tema: 'm3-entradas-dig', tipo: 'om', niv: 3, q: 'Tu tablero del 2º parcial tiene botones a +5 V con pull-down de 10 kΩ. ¿Qué pinMode usas y qué lee un botón NA presionado?', op: ['INPUT y lee HIGH', 'INPUT_PULLUP y lee LOW', 'OUTPUT y lee HIGH', 'INPUT y lee LOW'] },
    { id: 'm3se6', tema: 'm3-entradas-dig', tipo: 'ab', niv: 2, q: 'Explica cómo evitar que un botón cuente de más.', r: 'Con antirrebote: aceptar la lectura solo si se mantiene estable unos 20-50 ms, y actuar en el flanco guardando la lectura anterior.' },
    // analógica y PWM
    { id: 'm3sf1', tema: 'm3-analogica-pwm', tipo: 'om', niv: 1, q: '¿Qué rango de números da analogRead en el Uno?', op: ['0 a 1023', '0 a 255', '0 a 5', '0 a 100'] },
    { id: 'm3sf2', tema: 'm3-analogica-pwm', tipo: 'calc', niv: 2, gen: 'm3adc' },
    { id: 'm3sf3', tema: 'm3-analogica-pwm', tipo: 'calc', niv: 2, gen: 'm3pwm' },
    { id: 'm3sf4', tema: 'm3-analogica-pwm', tipo: 'calc', niv: 3, gen: 'm3map' },
    { id: 'm3sf5', tema: 'm3-analogica-pwm', tipo: 'om', niv: 2, q: '¿Qué rango usa analogWrite?', op: ['0 a 255', '0 a 1023', '0 a 5', '0 a 100'] },
    { id: 'm3sf6', tema: 'm3-analogica-pwm', tipo: 'vf', niv: 2, q: 'analogWrite funciona en cualquier pin digital del Uno.', v: false, exp: 'Solo en los pines con ~ (3, 5, 6, 9, 10 y 11).' },
    // sensores
    { id: 'm3sg1', tema: 'm3-sensores-emb', tipo: 'om', niv: 1, q: '¿Qué voltaje entrega un LM35 a 25 °C?', op: ['250 mV', '25 V', '2.5 mV', '25 mV'] },
    { id: 'm3sg2', tema: 'm3-sensores-emb', tipo: 'om', niv: 2, q: '¿Por qué se calibra el sensor de humedad de suelo?', op: ['Para relacionar sus lecturas con seco y mojado y convertir a %', 'Para que consuma menos', 'Para que no se moje', 'Porque lo pide la librería'] },
    { id: 'm3sg3', tema: 'm3-sensores-emb', tipo: 'calc', niv: 2, gen: 'm3distancia' },
    { id: 'm3sg4', tema: 'm3-sensores-emb', tipo: 'om', niv: 2, q: '¿Qué ventaja tiene el sensor de humedad capacitivo sobre el resistivo?', op: ['No se corroe', 'Siempre es más barato', 'No necesita alimentación', 'Da valores en %'] },
    { id: 'm3sg5', tema: 'm3-sensores-emb', tipo: 'vf', niv: 1, q: 'El DHT11 necesita su librería para leer temperatura y humedad.', v: true, exp: 'Envía los datos con un protocolo digital propio.' },
    { id: 'm3sg6', tema: 'm3-sensores-emb', tipo: 'ab', niv: 2, q: '¿Cómo protegerías la bomba para que no trabaje con el depósito vacío?', r: 'Con un sensor de nivel (flotador o ultrasónico): si no hay agua, el programa no enciende la bomba y avisa con un LED.' },
    // potencia
    { id: 'm3sh1', tema: 'm3-potencia-emb', tipo: 'om', niv: 1, q: '¿Por qué no se conecta una bomba de 12 V directo a un pin?', op: ['El pin da unos 20 mA a 5 V', 'Porque la bomba es de CA', 'Porque el pin es analógico', 'Porque se necesita un sensor'] },
    { id: 'm3sh2', tema: 'm3-potencia-emb', tipo: 'om', niv: 2, q: 'Con un MOSFET de canal N, ¿dónde va la carga?', op: ['Entre +12 V y el drenador', 'Entre la compuerta y GND', 'Entre la fuente y el pin', 'En el pin 5V del Arduino'] },
    { id: 'm3sh3', tema: 'm3-potencia-emb', tipo: 'om', niv: 2, q: '¿Para qué sirve el resistor de 10 kΩ entre compuerta y GND?', op: ['Mantiene apagado el MOSFET al arrancar', 'Limita la corriente del motor', 'Sube el voltaje', 'Mide la corriente'] },
    { id: 'm3sh4', tema: 'm3-potencia-emb', tipo: 'vf', niv: 2, q: 'Cualquier MOSFET conduce por completo con solo 5 V en su compuerta.', v: false, exp: 'Se necesita uno de nivel lógico (como el IRLZ44N); otros apenas conducen con 5 V.' },
    { id: 'm3sh5', tema: 'm3-potencia-emb', tipo: 'om', niv: 2, q: '¿Qué etapa de potencia NO sirve para regular velocidad con PWM?', op: ['Relevador', 'MOSFET de nivel lógico', 'Transistor NPN', 'Driver de motor'] },
    { id: 'm3sh6', tema: 'm3-potencia-emb', tipo: 'ab', niv: 3, q: 'Describe la conexión de una bomba de 12 V con MOSFET al Arduino, incluyendo sus protecciones.', r: 'Pin → 220 Ω → compuerta; 10 kΩ de compuerta a GND; fuente del MOSFET a GND común; bomba entre +12 V y drenador; diodo en paralelo con la bomba con la franja al +12 V.' },
    // serie
    { id: 'm3si1', tema: 'm3-serial', tipo: 'om', niv: 1, q: '¿Qué instrucción abre la comunicación serie?', op: ['Serial.begin(9600)', 'Serial.open()', 'pinMode(0, SERIAL)', 'analogRead(0)'] },
    { id: 'm3si2', tema: 'm3-serial', tipo: 'om', niv: 2, q: 'El monitor serie muestra caracteres raros. ¿Qué revisas primero?', op: ['Que la velocidad coincida con Serial.begin', 'El sensor', 'La fuente de 12 V', 'El diodo'] },
    { id: 'm3si3', tema: 'm3-serial', tipo: 'om', niv: 2, q: '¿Para qué sirve el graficador serie?', op: ['Para ver gráficamente cómo cambian los valores', 'Para cargar el programa', 'Para alimentar la tarjeta', 'Para medir corriente'] },
    { id: 'm3si4', tema: 'm3-serial', tipo: 'vf', niv: 2, q: 'Imprimir variables por serie es una forma de depurar.', v: true, exp: 'Muestra qué valores tiene el programa en cada momento.' },
    { id: 'm3si5', tema: 'm3-serial', tipo: 'om', niv: 2, q: '¿Qué dirección I2C suele tener una LCD 16×2 con módulo I2C?', op: ['0x27 o 0x3F', '9600', 'A4', '13'] },
    { id: 'm3si6', tema: 'm3-serial', tipo: 'ab', niv: 2, q: '¿Qué ventaja tiene una pantalla LCD sobre el monitor serie en el riego?', r: 'Funciona sin computadora: muestra humedad y estado donde está el sistema.' },
    // millis y estados
    { id: 'm3sj1', tema: 'm3-millis-estados', tipo: 'om', niv: 1, q: '¿Qué problema tiene delay() en un sistema con botones?', op: ['Detiene todo y el botón no responde', 'Consume mucha energía', 'No compila', 'Daña el pin'] },
    { id: 'm3sj2', tema: 'm3-millis-estados', tipo: 'calc', niv: 2, gen: 'm3millis' },
    { id: 'm3sj3', tema: 'm3-millis-estados', tipo: 'om', niv: 2, q: 'En una máquina de estados, ¿qué guarda la variable estado?', op: ['El paso actual del sistema', 'El voltaje del sensor', 'El número de pin', 'La hora del día'] },
    { id: 'm3sj4', tema: 'm3-millis-estados', tipo: 'vf', niv: 2, q: 'Con millis() - inicio el programa sigue funcionando aunque millis() se desborde.', v: true, exp: 'La resta de enteros sin signo da el intervalo correcto.' },
    { id: 'm3sj5', tema: 'm3-millis-estados', tipo: 'om', niv: 3, q: 'Al entrar al estado RIEGA, ¿qué conviene hacer?', op: ['Guardar inicio = millis() y encender la bomba', 'Poner delay(5000)', 'Reiniciar el Arduino', 'Leer el puerto serie'] },
    { id: 'm3sj6', tema: 'm3-millis-estados', tipo: 'ab', niv: 3, q: 'Describe los estados del riego automático y sus transiciones.', r: 'ESPERA (cada 10 s) → MIDE; MIDE: seco y con agua → RIEGA, sin agua → FALLA, si no → ESPERA; RIEGA: hasta 5 s → PAUSA; PAUSA: 30 s → ESPERA; FALLA: cuando hay agua → ESPERA.' },
    // nexo
    { id: 'm3sk1', tema: 'm3-nexo-energia', tipo: 'om', niv: 1, q: '¿Qué es el nexo agua-energía-alimento?', op: ['La relación entre agua, energía y alimentos: cuidar uno ayuda a los otros', 'Un tipo de bomba', 'Una norma eléctrica', 'Un sensor de humedad'] },
    { id: 'm3sk2', tema: 'm3-nexo-energia', tipo: 'om', niv: 2, q: 'A nivel mundial, ¿qué actividad usa la mayor parte del agua dulce extraída?', op: ['La agricultura', 'La industria electrónica', 'El uso doméstico', 'La minería'] },
    { id: 'm3sk3', tema: 'm3-nexo-energia', tipo: 'calc', niv: 3, gen: 'm3consumo' },
    { id: 'm3sk4', tema: 'm3-nexo-energia', tipo: 'vf', niv: 2, q: 'En el riego automático, lo que más energía consume al día siempre es la bomba.', v: false, exp: 'Muchas veces consume más lo que está encendido las 24 horas (tarjeta, sensores, LED).' },
    { id: 'm3sk5', tema: 'm3-nexo-energia', tipo: 'om', niv: 2, q: '¿Por qué conviene regar en horas frescas?', op: ['Se evapora menos agua', 'La bomba es más rápida', 'El sensor mide mejor', 'Por una norma eléctrica'] },
    { id: 'm3sk6', tema: 'm3-nexo-energia', tipo: 'ab', niv: 3, q: 'Propón tres mejoras para que tu riego ahorre agua y energía.', r: 'Medir antes de regar y regar poco con pausas, regar en horas frescas, no regar con el depósito vacío, apagar LED innecesarios y alimentar el sensor solo al medir.' },
    // depuración
    { id: 'm3sl1', tema: 'm3-depuracion', tipo: 'om', niv: 1, q: 'El programa compila pero hace otra cosa. ¿Qué tipo de error es?', op: ['De lógica', 'De compilación', 'De hardware', 'De ortografía'] },
    { id: 'm3sl2', tema: 'm3-depuracion', tipo: 'om', niv: 2, q: 'El IDE muestra 12 errores. ¿Cuál corriges primero?', op: ['El primero', 'El último', 'El más largo', 'Ninguno: vuelves a cargar'] },
    { id: 'm3sl3', tema: 'm3-depuracion', tipo: 'om', niv: 2, q: 'El monitor dice RIEGA, pero la bomba no enciende. ¿Dónde buscas?', op: ['En la etapa de potencia o el cableado de la bomba', 'En el sensor de humedad', 'En el código del sensor', 'En la velocidad del monitor'] },
    { id: 'm3sl4', tema: 'm3-depuracion', tipo: 'vf', niv: 1, q: 'Conviene cambiar muchas cosas a la vez para terminar rápido.', v: false, exp: 'Se cambia una cosa a la vez y se prueba, para saber qué la arregló.' },
    { id: 'm3sl5', tema: 'm3-depuracion', tipo: 'om', niv: 2, q: '¿Para qué sirve probar por partes?', op: ['Para saber en qué bloque está la falla', 'Para ahorrar cables', 'Para que compile más rápido', 'Para no usar el simulador'] },
    { id: 'm3sl6', tema: 'm3-depuracion', tipo: 'ab', niv: 2, q: 'Escribe tres casos de la lista de pruebas del riego con su resultado esperado.', r: 'Tierra seca con agua → riega máximo 5 s; tierra húmeda → no riega; depósito vacío → no riega y parpadea el LED rojo; botón manual → riega 3 s.' }
  ];

  /* =================== IDEAS =================== */
  const ideas = [
    { id: 'm3-wokwi', titulo: 'Wokwi: Arduino en el navegador', sm: ['III-3'], tipo: 'Docencia', dur: '15 min', costo: '$0', obj: 'Que programen y simulen sin arriesgar la tarjeta, también desde casa.', mat: ['Navegador con internet (wokwi.com)'],
      pasos: ['Abre un proyecto nuevo de Arduino Uno.', 'Agrega LED, botones o potenciómetros con el botón +.', 'Conecta cables haciendo clic en los pines.', 'Inicia la simulación y abre el monitor serie.'], evid: 'Liga o captura del proyecto', link: 'https://wokwi.com/', tip: 'Se puede simular sin cuenta; para guardar proyectos, que usen un apodo y nunca su nombre completo.' },
    { id: 'm3-tinkercad-arduino', titulo: 'Tinkercad: Arduino con bloques para nivelar', sm: ['III-3'], tipo: 'Docencia', dur: '20 min', costo: '$0', obj: 'Que quien se atore con la sintaxis avance con bloques y vea el código equivalente.', mat: ['Clase de Tinkercad con apodos'],
      pasos: ['Abre Tinkercad Circuits y agrega un Arduino Uno.', 'En Código elige Bloques y arma el parpadeo.', 'Cambia a Bloques + Texto para ver el C++ que genera.', 'Pasa después a texto puro.'], evid: 'Circuito guardado en la clase', link: 'https://www.tinkercad.com/', tip: 'Usa una clase de Tinkercad con apodos: no se piden correos a los alumnos.' },
    { id: 'm3-pseudocodigo', titulo: 'Pseudocódigo antes del código', sm: ['III-3'], tipo: 'Dinámica', dur: '15 min', costo: '$0', obj: 'Separar el pensar del escribir.', mat: ['Pizarrón o libreta'],
      pasos: ['Escriban en español lo que hará el programa, paso a paso.', 'Marquen entradas, decisiones y salidas.', 'Traduzcan cada línea a C++.', 'Comparen: ¿qué línea fue la difícil?'], evid: 'Pseudocódigo en la libreta', tip: 'Pide el pseudocódigo antes de ayudar con el código: muchas dudas se resuelven ahí.' },
    { id: 'm3-depura-serial', titulo: 'Depura con Serial.print', sm: ['III-3'], tipo: 'Docencia', dur: '10 min', costo: '$0', obj: 'Que vean lo que el programa «piensa».', mat: ['Arduino IDE o Wokwi'],
      pasos: ['Antes de preguntar, imprimen las variables clave.', 'Comparan lo impreso con lo esperado.', 'Ubican si falla el sensor, la decisión o la salida.', 'Comentan los mensajes al terminar.'], evid: 'Captura del monitor con la falla encontrada', tip: 'Regla de clase: «¿qué dice el monitor serie?» es la primera pregunta ante cualquier duda.' },
    { id: 'm3-calibra-humedad', titulo: 'Calibra el sensor de humedad: seco y mojado', sm: ['III-3'], tipo: 'Práctica', dur: '20 min', costo: 'Bajo', obj: 'Convertir lecturas crudas a % de humedad.', mat: ['Sensor capacitivo de humedad de suelo', 'Vaso con agua, tierra seca y tierra húmeda', 'Arduino'],
      pasos: ['Lean el sensor al aire (seco) y anoten.', 'Sumérjanlo hasta la marca en agua y anoten.', 'Prueben en tierra seca y húmeda.', 'Usen map() y constrain() para pasar a %.'], evid: 'Tabla de calibración', tip: 'Nunca sumerjan la parte de los componentes; marquen con plumón hasta dónde se mete.' },
    { id: 'm3-riego-maceta', titulo: 'Maceta de prueba para el riego', sm: ['III-3'], tipo: 'Práctica', dur: '30 min', costo: 'Bajo', obj: 'Tener un banco de pruebas seguro con agua.', mat: ['Vaso o maceta pequeña con tierra', 'Botella como depósito con tapa', 'Charola', 'Manguera delgada'],
      pasos: ['Pongan maceta y depósito sobre la charola.', 'Fijen la tarjeta y la fuente en una base elevada lejos del agua.', 'Pasen la manguera de la bomba a la maceta.', 'Revisen que un derrame no alcance la electrónica.'], evid: 'Foto del banco de pruebas (sin rostros)', tip: 'Siembren algo de crecimiento rápido (frijol o rábano): ver la planta viva motiva más que la tierra sola.' },
    { id: 'm3-codigo-roto', titulo: 'Código roto: encuentra los 5 errores', sm: ['III-3'], tipo: 'Dinámica', dur: '20 min', costo: '$0', obj: 'Practicar la depuración de errores de compilación y de lógica.', mat: ['Código impreso con 5 errores (punto y coma, mayúscula, = por ==, llave, pin sin pinMode)'],
      pasos: ['Entrega el código en parejas.', 'Encuentran y marcan los errores sin computadora.', 'Los clasifican: compilación o lógica.', 'Lo comprueban en Wokwi.'], evid: 'Hoja con errores marcados', tip: 'Incluye un error que sí compila (= en lugar de ==): es el que casi nadie encuentra.' },
    { id: 'm3-mosfet-logico', titulo: 'MOSFET de nivel lógico vs. módulo IRF520', sm: ['III-3'], tipo: 'Práctica', dur: '15 min', costo: 'Bajo', obj: 'Ver por qué importa elegir bien el MOSFET.', mat: ['IRLZ44N o módulo de nivel lógico', 'Módulo IRF520 (si lo tienen)', 'Motor de 12 V', 'Multímetro'],
      pasos: ['Conecta el motor con cada MOSFET y el pin a 5 V.', 'Mide el voltaje en el motor con cada uno.', 'Revisa con cuidado la temperatura del MOSFET tras un minuto.', 'Concluyan cuál conviene con 5 V.'], evid: 'Tabla comparativa', tip: 'Si no tienen IRF520, comparen contra un transistor NPN: también se nota la diferencia.' },
    { id: 'm3-estado-tarjetas', titulo: 'Máquina de estados con tarjetas', sm: ['III-3'], tipo: 'Dinámica', dur: '15 min', costo: '$0', obj: 'Diseñar estados y transiciones antes de programar.', mat: ['Tarjetas con nombres de estados', 'Flechas de papel con condiciones'],
      pasos: ['Cada equipo acomoda los estados del riego sobre la mesa.', 'Los unen con flechas y escriben la condición de cada una.', 'Un compañero «ejecuta» moviendo una ficha.', 'Cuando esté completo, lo pasan a switch/case.'], evid: 'Diagrama de estados', tip: 'Es el GRAFCET del 2º parcial con otro nombre: aprovecha lo que ya saben.' },
    { id: 'm3-feria-proyectos', titulo: 'Feria de automatización del semestre', sm: ['III-3'], tipo: 'Proyecto', dur: '2 h', costo: 'Bajo', obj: 'Que expliquen a otros lo que construyeron en el módulo.', mat: ['Tableros, estaciones y sistemas de riego', 'Carteles con diagrama y datos'],
      pasos: ['Cada equipo arma su stand con los tres proyectos del semestre.', 'Explican en 3 minutos a visitantes de otros grupos.', 'Los visitantes evalúan con una ficha sencilla.', 'Reconocimiento a la mejor explicación, no al más bonito.'], evid: 'Fichas de coevaluación', tip: 'Si se toman fotos para la escuela, que sean de los proyectos y las manos, nunca de rostros.' },
    { id: 'm3-agua-cuenta', titulo: '¿Cuánta agua ahorra el riego automático?', sm: ['III-3'], tipo: 'Formación', dur: '20 min', costo: '$0', obj: 'Relacionar el proyecto con el nexo agua-energía-alimento.', mat: ['Vaso medidor', 'Cronómetro', 'Bomba del proyecto'],
      pasos: ['Midan cuántos mL entrega la bomba en 5 s.', 'Comparen con regar «a ojo» con un vaso.', 'Calculen el agua por semana de cada forma.', 'Escriban una conclusión para su cartel.'], evid: 'Cálculo en la libreta', tip: 'Medir el caudal de la bomba también sirve para ajustar el tiempo de riego.' },
    { id: 'm3-desmontaje', titulo: 'Desmontaje responsable del semestre', sm: ['III-3'], tipo: 'Formación', dur: '20 min', costo: '$0', obj: 'Cerrar el módulo separando lo reutilizable y lo reciclable.', mat: ['Cajas para componentes, cables y basura electrónica'],
      pasos: ['Desconecten y desarmen en orden inverso.', 'Separen los componentes que sirven para el próximo semestre.', 'Cables y piezas dañadas, a la caja de acopio.', 'Registren qué queda en el inventario del taller.'], evid: 'Inventario actualizado', tip: 'Relevadores, botones y Arduinos en buen estado son material del Módulo IV y V: guárdalos etiquetados.' }
  ];

  /* =================== FIGURAS (SVG, sin internet) =================== */
  const d = E.fig.d, ln = d.ln, ci = d.ci, rc = d.rc, tx = d.tx, PI = Math.PI;
  const figs = {
    m3uno: { t: 'Pines del Arduino Uno', d: 'Digitales 0-13 (los marcados son PWM), analógicas A0-A5, alimentación y USB.', w: 480, h: 250, anim: false, draw: () => {
      let s = rc(40, 40, 420, 170, 'fill', 10) + rc(14, 62, 44, 40, 'fill2', 4) + tx([36, 87], 'USB', 'tbs') + rc(14, 150, 44, 34, 'fill2', 4) + tx([36, 171], 'Vin', 'tbs');
      const PWM = [3, 5, 6, 9, 10, 11];
      for (let i = 0; i < 14; i++) { const n = 13 - i, x = 176 + i * 19; s += rc(x - 7, 46, 14, 14, PWM.indexOf(n) >= 0 ? 'fillA' : 'fill2', 2) + tx([x, 36], String(n), PWM.indexOf(n) >= 0 ? 'ta' : 'tm'); }
      s += tx([150, 57], 'digitales', 'tm', 'end');
      ['3.3V', '5V', 'GND', 'GND', 'Vin'].forEach((p, i) => { const x = 110 + i * 32; s += rc(x - 7, 190, 14, 14, 'fill2', 2) + tx([x, 226], p, 'tm'); });
      for (let i = 0; i < 6; i++) { const x = 300 + i * 26; s += rc(x - 7, 190, 14, 14, 'fillA', 2) + tx([x, 226], 'A' + i, 'ta'); }
      s += rc(210, 104, 130, 46, 'fill2', 4) + tx([275, 126], 'ATmega328P', 'tb') + tx([275, 142], '16 MHz · 32 KB flash', 'tm');
      s += ci([170, 90], 5, 'dot') + tx([180, 94], 'LED 13', 'tm', 'start');
      return s + tx([240, 246], 'Resaltados: PWM (3, 5, 6, 9, 10, 11) y analógicas · I2C: A4 SDA y A5 SCL', 'tm');
    } },
    m3loop: { t: 'setup() y loop()', d: 'setup() corre una vez al encender; loop() se repite sin fin, como el ciclo de escaneo del PLC.', w: 480, h: 210, anim: true, per: 6, draw: t => {
      const ph = t % 6, enSetup = ph < 1.2, a = (ph - 1.2) / 4.8 * 2 * PI - PI / 2, c = [330, 110];
      let s = rc(30, 80, 140, 60, enSetup ? 'fillA' : 'fill2', 8) + tx([100, 106], 'setup()', enSetup ? 'ta' : 'tb') + tx([100, 124], 'una vez', 'tm');
      s += d.flecha([172, 110], [240, 110], 'k', 9) + tx([205, 100], 'encender', 'tm');
      s += ci(c, 80, 'none2') + rc(262, 86, 136, 48, enSetup ? 'fill2' : 'fillA', 8) + tx([330, 108], 'loop()', enSetup ? 'tb' : 'ta') + tx([330, 126], 'sin fin', 'tm');
      s += d.arcoFlecha(c, 80, -0.9, 0.9, 'b') + d.arcoFlecha(c, 80, 2.2, 4.0, 'b');
      if (!enSetup) s += ci([c[0] + 80 * Math.cos(a), c[1] + 80 * Math.sin(a)], 7, 'dot');
      return s + tx([240, 204], enSetup ? 'Al encender: se configuran los pines' : 'Después: lee, decide y actúa una y otra vez', 'tb');
    } },
    m3pwm: { t: 'PWM: ciclo de trabajo y promedio', d: 'El pin se enciende y apaga muy rápido; el tiempo en alto define el promedio que ven el LED o el motor.', w: 480, h: 220, anim: true, per: 8, draw: t => {
      const k = 0.1 + 0.8 * (0.5 - 0.5 * Math.cos(2 * PI * t / 8)), X0 = 30, Pw = 80, Y1 = 50, Y0 = 140;
      let p = [[X0, Y0]]; for (let i = 0; i < 4; i++) { const x = X0 + i * Pw; p.push([x, Y0], [x, Y1], [x + k * Pw, Y1], [x + k * Pw, Y0], [x + Pw, Y0]); }
      let s = ln([X0, Y0], [X0 + 4 * Pw, Y0], 'k2') + d.pl(p, 'a') + ln([X0, Y0 - k * (Y0 - Y1)], [X0 + 4 * Pw, Y0 - k * (Y0 - Y1)], 'm') + tx([X0 + 4 * Pw + 4, Y0 - k * (Y0 - Y1) + 4], 'promedio', 'tm', 'start') + tx([X0 - 4, Y1 + 4], '5 V', 'tm', 'end') + tx([X0 - 4, Y0 + 4], '0 V', 'tm', 'end');
      s += '<circle cx="448" cy="95" r="20" fill="rgba(255,190,0,' + f(k, 2) + ')" stroke="currentColor" stroke-width="2"/>' + tx([448, 132], 'LED', 'tm');
      return s + tx([240, 176], 'analogWrite(9, ' + Math.round(k * 255) + ')', 'tb') + tx([240, 198], 'ciclo de trabajo ' + Math.round(k * 100) + ' % · promedio ' + f(5 * k, 2) + ' V', 'ta');
    } },
    m3pullup: { t: 'Botón con INPUT_PULLUP', d: 'El resistor interno lleva el pin a 5 V; al presionar, el botón lo une a GND: presionado = LOW.', w: 480, h: 230, anim: true, per: 4, draw: t => {
      const on = (t % 4) > 2;
      let s = rc(30, 30, 190, 170, 'none2', 8) + tx([125, 22], 'dentro del Arduino', 'tm') + ln([90, 46], [160, 46], 'k3') + tx([90, 40], '5 V', 'tb', 'start');
      const z = [[125, 46]]; for (let i = 0; i < 6; i++) z.push([125 + (i % 2 ? 7 : -7), 52 + i * 8]); z.push([125, 104]);
      s += d.pl(z, 'k2') + tx([140, 74], 'resistor', 'tm', 'start') + tx([140, 90], 'interno', 'tm', 'start') + ln([125, 104], [125, 130], 'k2') + ci([125, 130], 4, 'dot') + ln([125, 130], [260, 130], 'k2') + tx([110, 134], 'pin 2', 'tb', 'end');
      s += ln([260, 130], [260, 140], 'k2') + ci([260, 143], 3, 'pin') + (on ? ln([260, 146], [260, 168], 'a') : ln([261, 146], [278, 164], 'k3')) + ci([260, 171], 3, 'pin') + ln([260, 174], [260, 200], 'k2') + ln([240, 200], [280, 200], 'k3') + tx([260, 216], 'GND', 'tb') + tx([290, 160], 'botón', 'tm', 'start');
      return s + rc(330, 96, 130, 66, on ? 'fillA' : 'fill2', 8) + tx([395, 122], on ? 'presionado' : 'suelto', 'tm') + tx([395, 146], 'lee ' + (on ? 'LOW' : 'HIGH'), on ? 'ta' : 'tb');
    } },
    m3estados: { t: 'Máquina de estados del riego', d: 'Un estado activo a la vez; cada flecha es una transición con su condición.', w: 480, h: 268, anim: true, per: 10, draw: t => {
      const ph = t % 10, act = ph < 2 ? 'E' : ph < 2.6 ? 'M' : ph < 4.4 ? 'R' : ph < 6.6 ? 'P' : ph < 8 ? 'E' : ph < 8.6 ? 'M' : 'F';
      const B = { E: [30, 50, 'ESPERA'], M: [190, 50, 'MIDE'], R: [350, 50, 'RIEGA'], P: [350, 180, 'PAUSA'], F: [190, 180, 'FALLA'] };
      let s = '';
      Object.keys(B).forEach(k => { const b = B[k]; s += rc(b[0], b[1], 100, 36, k === act ? 'fillA' : 'fill2', 8) + tx([b[0] + 50, b[1] + 23], b[2], k === act ? 'ta' : 'tb'); });
      s += d.flecha([130, 62], [188, 62], 'k', 8) + tx([160, 42], 'cada 10 s', 'tm') + d.flecha([190, 78], [132, 78], 'k', 8) + tx([160, 100], 'húmedo', 'tm');
      s += d.flecha([290, 68], [348, 68], 'k', 8) + tx([320, 42], 'seco y con agua', 'tm');
      s += d.flecha([400, 86], [400, 178], 'k', 8) + tx([408, 134], '≤ 5 s', 'tm', 'start');
      s += d.flecha([240, 86], [240, 178], 'k', 8) + tx([248, 134], 'sin agua', 'tm', 'start');
      s += ln([400, 216], [400, 248], 'k2') + ln([400, 248], [64, 248], 'k2') + d.flecha([64, 248], [64, 88], 'k', 8) + tx([230, 262], '30 s', 'tm');
      s += ln([190, 198], [104, 198], 'k2') + d.flecha([104, 198], [104, 88], 'k', 8) + tx([148, 192], 'hay agua', 'tm');
      return s;
    } },
    m3mosfet: { t: 'Bomba de 12 V con MOSFET', d: 'El pin manda la compuerta; la bomba va entre +12 V y el drenador, con su diodo; GND común.', w: 480, h: 244, anim: false, draw: () => {
      let s = rc(16, 104, 90, 72, 'fill', 8) + tx([61, 126], 'Arduino', 'tb') + tx([100, 139], 'pin 9', 'tm', 'end') + tx([100, 162], 'GND', 'tm', 'end');
      s += ln([106, 135], [150, 135], 'k2'); const z = [[150, 135]]; for (let i = 0; i < 6; i++) z.push([156 + i * 6, 135 + (i % 2 ? 6 : -6)]); z.push([196, 135]);
      s += d.pl(z, 'k2') + tx([173, 122], '220 Ω', 'tm') + ln([196, 135], [250, 135], 'k2') + ci([226, 135], 3, 'dot');
      const z2 = [[226, 135]]; for (let i = 0; i < 6; i++) z2.push([226 + (i % 2 ? 6 : -6), 141 + i * 7]); z2.push([226, 186]);
      s += d.pl(z2, 'k2') + tx([234, 196], '10 kΩ', 'tm', 'start') + ln([226, 186], [226, 210], 'k2');
      s += rc(250, 110, 70, 50, 'fill2', 6) + tx([285, 132], 'MOSFET', 'tbs') + tx([285, 148], 'IRLZ44N', 'tm') + tx([246, 130], 'G', 'tm', 'end') + tx([292, 104], 'D', 'tm', 'start') + tx([292, 174], 'S', 'tm', 'start');
      s += ln([285, 110], [285, 98], 'k2') + ln([285, 98], [380, 98], 'k2') + ln([380, 98], [380, 90], 'k2') + ln([285, 160], [285, 210], 'k2');
      s += ci([380, 70], 20, 'fillA') + tx([380, 74], 'bomba', 'tbs') + ln([380, 50], [380, 30], 'k2') + ln([330, 30], [464, 30], 'k3') + tx([464, 22], '+12 V', 'tb', 'end');
      s += ln([380, 98], [430, 98], 'k2') + ln([430, 98], [430, 86], 'k2') + d.pg([[422, 86], [438, 86], [430, 70]], 'fill') + ln([421, 69], [439, 69], 'k3') + ln([430, 69], [430, 30], 'k2') + tx([442, 82], 'diodo', 'tm', 'start');
      s += ln([106, 162], [126, 162], 'k2') + ln([126, 162], [126, 210], 'k2') + ln([126, 210], [464, 210], 'k3') + tx([300, 232], 'GND común (Arduino y fuente de 12 V)', 'tb');
      return s;
    } },
    m3nexo: { t: 'Nexo agua-energía-alimento', d: 'Cada recurso necesita de los otros dos: ahorrar agua también ahorra energía y cuida la producción de alimentos.', w: 480, h: 268, anim: false, draw: () => {
      const A = [240, 50], En = [90, 176], Al = [390, 176];
      let s = ci(A, 38, 'fillA') + tx([240, 55], 'Agua', 'tb') + ci(En, 38, 'fill2') + tx([90, 181], 'Energía', 'tb') + ci(Al, 38, 'fill2') + tx([390, 181], 'Alimentos', 'tb');
      s += d.flecha([207, 72], [118, 148], 'b', 9) + d.flecha([273, 72], [362, 148], 'b', 9) + d.flecha([130, 176], [350, 176], 'b', 9);
      s += tx([140, 100], 'bombear y tratar', 'tm', 'end') + tx([140, 116], 'agua usa energía', 'tm', 'end') + tx([340, 100], 'regar cultivos', 'tm', 'start') + tx([340, 116], 'usa agua', 'tm', 'start') + tx([240, 166], 'producir alimentos', 'tm') + tx([240, 200], 'usa energía', 'tm');
      return s + tx([240, 252], 'Riego automático: mide → riega poco → ahorra agua y energía', 'ta');
    } }
  };
  const figTema = { 'm3-uno-pines': ['m3uno'], 'm3-embebido': ['m3uno'], 'm3-cpp-basico': ['m3loop'], 'm3-analogica-pwm': ['m3pwm'], 'm3-entradas-dig': ['m3pullup'], 'm3-millis-estados': ['m3estados'], 'm3-potencia-emb': ['m3mosfet'], 'm3-nexo-energia': ['m3nexo'] };

  /* =================== INDUSTRIA, PROYECTO Y PLANEACIÓN =================== */
  const industria = {
    'm3-embebido': [['Electrodomésticos', 'Las plantas de lavadoras, refrigeradores y estufas de la región programan y prueban sus tarjetas de control.'], ['Automotriz', 'Un auto moderno trae decenas de módulos embebidos: motor, frenos, bolsas de aire y tablero.']],
    'm3-sensores-emb': [['Agricultura de precisión', 'Sensores de humedad y estaciones meteorológicas deciden cuándo regar invernaderos y huertas.'], ['Edificios inteligentes', 'Sensores de presencia, luz y temperatura controlan la iluminación y el aire acondicionado.']],
    'm3-potencia-emb': [['Electrodomésticos', 'La tarjeta de una lavadora maneja motor, bomba y válvulas con transistores y relevadores.'], ['Movilidad eléctrica', 'Scooters y bicicletas eléctricas controlan su motor con MOSFET y PWM.']],
    'm3-millis-estados': [['Máquinas expendedoras', 'Cada venta sigue estados: esperar pago, seleccionar, entregar y dar cambio.'], ['Equipo de laboratorio', 'Los ciclos de esterilizadores y centrífugas se programan como máquinas de estados.']],
    'm3-nexo-energia': [['Invernaderos', 'El riego por goteo automatizado ahorra agua y la energía de bombeo en la producción de hortalizas.'], ['Organismos operadores de agua', 'Automatizan pozos y rebombeos para reducir fugas y consumo eléctrico.']],
    'm3-depuracion': [['Pruebas de tarjetas', 'Las líneas de electrónica prueban cada tarjeta con programas y dispositivos de prueba antes de empacarla.'], ['Soporte de campo', 'Los técnicos leen los códigos de error de los equipos por su puerto de diagnóstico.']]
  };
  const proyecto = { nombre: 'Riego automático', et: [['especifica', 'Especificación y diagrama', ['m3e-proyecto-def', 'm3e-diagrama']], ['programa', 'Programa compilado y simulado', ['m3e-programa']], ['montaje', 'Montaje con etapa de potencia', ['m3e-montaje-riego']], ['prueba', 'Carga y pruebas', ['m3e-carga-prueba']], ['energia', 'Consumo y ahorro', ['m3e-energia-pr']], ['verifica', 'Verificación y feria', ['m3e-verifica', 'm3e-feria']]] };
  const recursos = {
    material: ['Arduino Uno R3 con cable USB', 'Protoboard, LED, resistores (220 Ω y 10 kΩ), botones, potenciómetros y fotorresistencia', 'Sensor de humedad de suelo capacitivo, LM35 o DHT11, flotador o HC-SR04', 'MOSFET de nivel lógico (IRLZ44N) y diodos 1N4007 o 1N5819', 'Mini bomba sumergible de 12 V, manguera, depósito con tapa y maceta de prueba', 'El tablero de 12 V y el ULN2003 de los parciales anteriores', 'Pantalla LCD 16×2 con módulo I2C (opcional)'],
    equipo: ['Computadoras con Arduino IDE 2 y navegador (Wokwi y Tinkercad)', 'Multímetros', 'Charolas para trabajar con agua', 'Proyector', 'Lentes de seguridad']
  };
  const plan = {
    diag: 'Examen diagnóstico de lógica, escalera, voltaje y corriente, y pines del Arduino',
    form: 'Revisión de códigos en el simulador; guía de observación de la inspección del sistema y de las prácticas con sensores y potencia',
    sum: 'Inspección del sistema embebido (guía de observación), programa del riego (rúbrica), verificación del sistema (lista de cotejo), expediente, feria de proyectos y examen del parcial',
    practicas: ['Demostrativa: primer programa en Wokwi y en la tarjeta; desarmado de un aparato con microcontrolador.', 'Guiada: semáforo, botones con antirrebote, potenciómetro y PWM, sensores reales y etapa de potencia con MOSFET.', 'Supervisada: máquina de estados con millis(); el tablero del 1er parcial programado en C++; protección por nivel del depósito.', 'Autónoma: riego automático: especificación, programa, montaje, pruebas, consumo de energía y verificación.'],
    paec: 'Riego automático con Arduino: mide la humedad del suelo, riega poco y con pausas, protege la bomba sin agua y reporta su consumo (nexo agua-energía-alimento)',
    paecEvid: 'Sistema funcionando (Producto), programa (Producto) e inspección del sistema (Desempeño)'
  };

  E.mods.registra('III-3', { temas: temas, clases: clases, banco: banco, gen: gen, ideas: ideas, figs: figs, figTema: figTema, industria: industria, proyecto: proyecto, recursos: recursos, plan: plan });
})();
