/* Escuadra · temas para explicar y proyectar, organizados por submódulo del Módulo II.
   Cada tema trae: explicación para ti (docente), puntos para proyectar, conceptos clave, ejemplo resuelto,
   preguntas con respuesta, errores comunes y conexión con la vida y la industria.
   sm: 'II-1' repaso de dibujo (nivelación), 'II-2' mecanismos, 'II-3' neumática/hidráulica, 'gen' formación integral. */
window.E = window.E || {};
(function (E) {
  'use strict';
  E.TEMAS = [
    /* ===================== NIVELACIÓN: SUBMÓDULO 1 ===================== */
    {
      id: 'sm1-planos', sm: 'II-1', ac: 'Representa el elemento mecánico en un plano o diagrama', titulo: 'Leer un plano: líneas, vistas, cotas y escalas', dur: '50 min',
      objetivo: 'Que lean y dibujen un plano sin ambigüedades, como lo exige la industria.',
      explica: [
        'Un plano es el idioma universal de la manufactura: si está bien hecho, cualquier técnico en cualquier planta fabrica la misma pieza. Por eso cada tipo de línea tiene un significado fijo y las cotas siguen reglas.',
        'Las vistas ortogonales (frontal, superior y lateral) muestran la pieza "de frente" desde cada lado; el isométrico la muestra en 3D para entenderla rápido. Existen dos sistemas de proyección: primer ángulo (europeo, ISO-E) y tercer ángulo (americano, ISO-A). Lo importante es usar uno e indicarlo en el cuadro de datos.',
        'La escala relaciona el tamaño en el papel con el real: 1:2 reduce a la mitad, 2:1 amplía al doble. Las cotas siempre indican la medida REAL de la pieza, sin importar la escala del dibujo.'
      ],
      pantalla: ['El plano es un contrato: la pieza se fabrica como dice el plano', 'Cada línea tiene un significado fijo', 'Vistas: frontal, superior, lateral (+ isométrico para entender)', 'Las cotas van fuera de la pieza y nunca se cruzan', 'La cota dice la medida REAL, aunque el dibujo esté a escala', 'R = radio · Ø = diámetro'],
      clave: [['Línea continua gruesa', 'Contornos y aristas visibles'], ['Línea discontinua (punteada)', 'Aristas ocultas'], ['Trazo y punto', 'Ejes de simetría y centros de barrenos'], ['Línea continua fina', 'Cotas y líneas de referencia'], ['Escala 1:2', 'Reducción: el dibujo mide la mitad'], ['Escala 2:1', 'Ampliación: el dibujo mide el doble']],
      ejemplo: { titulo: 'Escalas en la vida real', pasos: ['Una placa de 240 mm dibujada a 1:2 mide 120 mm en el papel.', 'Un engrane de reloj de 8 mm dibujado a 5:1 mide 40 mm en el papel.', 'En ambos casos la cota escrita sigue diciendo 240 y 8.'], resultado: 'Escala para ver bien, cota para fabricar bien.' },
      preguntas: [['¿Qué representa una línea discontinua?', 'Aristas o contornos ocultos detrás de la vista.'], ['Si veo "Ø30" en un barreno, ¿qué significa?', 'Un diámetro de 30 mm.'], ['Dibujo una pieza de 300 mm a escala 1:5. ¿Cuánto mide en el papel y qué número escribo en la cota?', 'Mide 60 mm en el papel; la cota dice 300.'], ['¿Qué está mal si las cotas cruzan el dibujo?', 'Se pierde claridad: las cotas van fuera del contorno y sin cruzarse.']],
      errores: ['Escribir la medida del papel en lugar de la real.', 'Poner cotas dentro de la pieza o cruzadas.', 'Olvidar indicar la escala y el sistema de proyección.', 'Repetir la misma cota en dos vistas.'],
      vida: 'En una planta del Bajío, un error en un plano puede costar miles de piezas mal hechas. Saber leer planos es lo primero que te piden en mantenimiento, ensamble o control de calidad.',
      ideas: ['pantografo', 'pr-error-del-dia'], fuente: 'Programa SEP 2024, Submódulo 1 (pp. 33-36); NOM-Z-68-1986.'
    },
    {
      id: 'sm1-restricciones', sm: 'II-1', ac: 'Diseña el elemento mecánico en un plano 2D y 3D', titulo: 'FreeCAD: dibujar con intención (restricciones)', dur: '50 min',
      objetivo: 'Que entiendan el diseño paramétrico: el boceto obedece reglas, no trazos sueltos.',
      explica: [
        'En FreeCAD no "dibujamos bonito": definimos reglas. Un boceto tiene libertad para moverse hasta que le ponemos restricciones geométricas (paralelo, perpendicular, horizontal, tangente, igual, simétrico, coincidente) y dimensionales (distancia, radio, ángulo).',
        'Cada restricción le quita "grados de libertad" al boceto. Cuando ya no le queda ninguno, FreeCAD avisa que está completamente restringido y la geometría cambia de color (verde por defecto). Ese boceto es predecible: si cambias una cota, todo se actualiza correctamente.',
        'La ventaja paramétrica es enorme en la industria: si el cliente pide la pieza 5 mm más larga, cambias un número, no redibujas.'
      ],
      pantalla: ['Paramétrico = el dibujo obedece reglas', 'Restricciones geométricas: forma (horizontal, paralela, tangente…)', 'Restricciones dimensionales: medidas (distancia, radio, ángulo)', 'Meta: boceto completamente restringido (cambia de color)', 'Cambias un número → todo se actualiza'],
      clave: [['Coincidente', 'Une dos puntos para cerrar el contorno'], ['Horizontal / vertical', 'Alinea una línea con los ejes'], ['Tangente', 'Una línea toca un arco suavemente'], ['Distancia / radio', 'Fija la medida con un número'], ['Grados de libertad', 'Lo que todavía puede moverse en el boceto']],
      ejemplo: { titulo: 'Placa de 80 × 40 con dos barrenos Ø8', pasos: ['Rectángulo: coincidencias, horizontales y verticales automáticas.', 'Cotas: 80 de largo y 40 de alto; una esquina anclada al origen.', 'Dos círculos: radio 4 (igualdad entre ellos), centros a 10 mm de los bordes.', 'Revisa el mensaje: "Completamente restringido".'], resultado: 'Si mañana la placa mide 100 mm, solo cambias el 80 por 100.' },
      preguntas: [['¿Por qué no basta con dibujar "a ojo"?', 'Porque el boceto podría moverse o deformarse y no sería fabricable con precisión.'], ['¿Qué te indica que el boceto ya está listo?', 'El aviso de "completamente restringido" y el cambio de color.'], ['¿Qué herramienta usas para quitar pedazos sobrantes de dos líneas cruzadas?', 'Recortar arista (Trim).']],
      errores: ['Poner restricciones duplicadas (FreeCAD marca conflicto en rojo).', 'Dejar puntos sin unir: luego no se puede extruir.', 'No anclar el boceto al origen.'],
      vida: 'Las empresas guardan sus diseños en CAD paramétrico porque cambian constantemente. Dominar restricciones te hace útil desde el primer día en un área de ingeniería o diseño.',
      ideas: ['mini-retos', 'pr-freecad-espejo'], fuente: 'Programa SEP 2024, Submódulo 1 (p. 34).'
    },

    /* ===================== SUBMÓDULO 2: MECANISMOS ===================== */
    {
      id: 'sm2-mecanismo', sm: 'II-2', ac: 'Modela piezas mecánicas', titulo: 'Máquina, mecanismo, eslabones y pares cinemáticos', dur: '50 min',
      objetivo: 'Que distingan máquina de mecanismo y nombren las partes de cualquier mecanismo.',
      explica: [
        'Una máquina transforma energía para hacer un trabajo útil (una prensa, un robot, una lavadora). Un mecanismo es la parte que transmite o transforma el movimiento y la fuerza. Toda máquina está hecha de mecanismos.',
        'Los mecanismos se forman con eslabones: cuerpos rígidos con al menos dos puntos de unión (nodos). Los nombres que pide el programa son: base o bancada (eslabón fijo), eslabón motriz (recibe el movimiento de entrada), eslabón conector o acoplador (transmite) y eslabón conducido (entrega el movimiento de salida).',
        'Los eslabones se unen con pares cinemáticos. Pares inferiores (contacto en superficie): giratorio o de revoluta (una bisagra), prismático o de corredera (un cajón) y helicoidal (un tornillo). Pares superiores (contacto en un punto o línea): leva con seguidor y dientes de engranes.',
        'Ojo: varias piezas atornilladas entre sí y que se mueven juntas cuentan como un solo eslabón.'
      ],
      pantalla: ['Máquina = transforma energía en trabajo útil', 'Mecanismo = transmite o transforma movimiento y fuerza', 'Eslabones: base · motriz · conector · conducido', 'Par cinemático = la unión entre dos eslabones', 'Inferiores: giratorio, prismático, helicoidal', 'Superiores: leva-seguidor, engranes'],
      clave: [['Eslabón', 'Cuerpo rígido con al menos dos nodos'], ['Base o bancada', 'Eslabón fijo de referencia'], ['Eslabón motriz', 'Recibe el movimiento de entrada'], ['Eslabón conducido', 'Entrega el movimiento de salida'], ['Par giratorio', 'Permite rotación (bisagra, pasador)'], ['Par prismático', 'Permite deslizamiento (corredera, cajón)']],
      ejemplo: { titulo: 'Analicemos unas pinzas de presión', pasos: ['Base: el mango fijo con la quijada fija.', 'Eslabón motriz: el mango que aprietas.', 'Eslabón conector: la pequeña biela interna.', 'Conducido: la quijada móvil.', 'Pares: todos giratorios (pasadores).'], resultado: 'Es un mecanismo de cuatro barras que "se traba" cerca de su punto muerto: por eso aprieta tan fuerte.' },
      preguntas: [['¿Qué par cinemático tiene una bisagra?', 'Giratorio (revoluta).'], ['¿Y un cajón?', 'Prismático (corredera).'], ['¿Qué tipo de par forman una leva y su seguidor?', 'Par superior: contacto en un punto o línea.'], ['Tres piezas soldadas que se mueven juntas, ¿cuántos eslabones son?', 'Uno solo.']],
      errores: ['Llamar "eslabón" a cada pieza física aunque se muevan juntas.', 'Olvidar que la base también es un eslabón.', 'Confundir máquina con mecanismo.'],
      vida: 'Cuando falla una máquina en planta, el técnico que entiende sus mecanismos encuentra la falla en minutos. Este vocabulario es tu primera herramienta de diagnóstico.',
      ideas: ['ing-inversa', 'pares-baratos', 'pr-camara-lenta'], fuente: 'Programa SEP 2024, Submódulo 2 (pp. 37-38); Myszka (2012), cap. 1.'
    },
    {
      id: 'sm2-movimientos', sm: 'II-2', ac: 'Modela piezas mecánicas', titulo: 'Tipos de movimiento y cómo transformarlos', dur: '50 min',
      objetivo: 'Que elijan el mecanismo correcto según el movimiento que entra y el que se necesita.',
      explica: [
        'Casi todos los motores dan movimiento giratorio continuo, pero las máquinas necesitan otros: lineal (avanzar en línea recta), alternativo (ir y venir en línea recta) u oscilante (ir y venir girando, como un péndulo).',
        'Por eso existen familias de mecanismos: de giro a giro (engranes, poleas, cadenas), de giro a lineal continuo (piñón-cremallera, tornillo-tuerca), de giro a alternativo (biela-manivela, leva-seguidor, excéntrica) y de giro a oscilante (manivela-balancín de cuatro barras).',
        'Diseñar es elegir: primero define qué movimiento entra y cuál debe salir; después escoge el mecanismo.'
      ],
      pantalla: ['Giratorio · lineal · alternativo · oscilante', 'Giro → giro: engranes, poleas, cadenas', 'Giro → lineal: piñón-cremallera, tornillo-tuerca', 'Giro → alternativo: biela-manivela, leva', 'Giro → oscilante: manivela-balancín (4 barras)', 'Diseñar = decidir qué entra y qué debe salir'],
      clave: [['Giratorio continuo', 'Da vueltas completas (eje de motor)'], ['Lineal', 'Avanza en línea recta (banda transportadora)'], ['Alternativo', 'Va y viene en línea recta (pistón)'], ['Oscilante', 'Va y viene girando (limpiaparabrisas)']],
      ejemplo: { titulo: '¿Cómo funciona un limpiaparabrisas?', pasos: ['Entra: motor eléctrico con giro continuo.', 'Sale: brazo que oscila de un lado a otro.', 'Mecanismo: manivela-balancín (cuatro barras).'], resultado: 'Un motor que solo gira en un sentido produce un vaivén perfecto.' },
      preguntas: [['¿Qué mecanismo usa un gato de tijera para subir el auto?', 'Tornillo-tuerca (giro → lineal).'], ['¿Qué movimiento hace el pistón de un motor?', 'Alternativo.'], ['Necesitas que un motor mueva una compuerta que sube y baja. ¿Qué mecanismo propones?', 'Biela-manivela, piñón-cremallera o tornillo-tuerca, según la carrera y la fuerza.']],
      errores: ['Confundir lineal (en una dirección) con alternativo (va y viene).', 'Elegir el mecanismo antes de definir el movimiento necesario.'],
      vida: 'En automatización el reto diario es justo este: convertir el giro de un motor o el empuje de un cilindro en el movimiento exacto que necesita el proceso.',
      ideas: ['pr-maquina-misteriosa', 'pr-pausa-predice'], fuente: 'Programa SEP 2024, Submódulo 2 (p. 37); Rivera (2021), Manual de Mecanismos, CNAD.'
    },
    {
      id: 'sm2-gdl', sm: 'II-2', ac: 'Arma mecanismos de sistemas mecatrónicos', titulo: 'Grados de libertad: ¿cuántos motores necesita?', dur: '50 min',
      objetivo: 'Calcular la movilidad de un mecanismo plano con la fórmula de Grübler-Kutzbach.',
      explica: [
        'Los grados de libertad (movilidad, M) dicen cuántas entradas independientes necesita un mecanismo para quedar completamente controlado; en la práctica, cuántos motores o actuadores.',
        'Para mecanismos planos: M = 3(n − 1) − 2·j1 − j2, donde n es el número de eslabones contando la base, j1 los pares de un grado de libertad (giratorios y prismáticos) y j2 los pares de dos grados (por ejemplo, ciertos contactos leva-seguidor).',
        'Interpretación: M = 1, un solo motor mueve todo; M = 0, es una estructura rígida (un triángulo); M = 2, necesita dos entradas (como un mecanismo de cinco barras); M negativo, estructura con elementos de más.'
      ],
      pantalla: ['M = 3(n − 1) − 2·j1 − j2', 'n = eslabones (incluye la base)', 'j1 = pares giratorios o prismáticos', 'M = 1 → un motor mueve todo', 'M = 0 → estructura rígida', 'M = 2 → necesita dos entradas'],
      clave: [['Grado de libertad', 'Movimiento independiente posible'], ['Movilidad M', 'Número de entradas necesarias'], ['Estructura', 'Mecanismo con M ≤ 0: no se mueve']],
      ejemplo: { titulo: 'Tres casos rápidos', pasos: ['Cuatro barras: n = 4, j1 = 4 → M = 3(3) − 8 = 1.', 'Triángulo: n = 3, j1 = 3 → M = 6 − 6 = 0 (estructura).', 'Biela-manivela: n = 4 (base, manivela, biela, corredera), j1 = 4 → M = 1.', 'Cinco barras: n = 5, j1 = 5 → M = 12 − 10 = 2.'], resultado: 'Por eso la garra del 2º parcial funciona con una sola entrada si es de cuatro barras.' },
      preguntas: [['¿Por qué las estructuras de puentes usan triángulos?', 'Porque M = 0: no tienen movilidad, son rígidas.'], ['Un mecanismo da M = 2. ¿Qué pasa si solo le pones un motor?', 'Queda una parte "suelta" sin control: se mueve de forma impredecible.'], ['Un robot industrial de 6 ejes, ¿cuántos grados de libertad tiene?', 'Seis: un motor por eje.']],
      errores: ['No contar la base como eslabón.', 'Contar dos veces un pasador que une tres eslabones (cuenta como dos pares).'],
      vida: 'Antes de comprar motores para una máquina, el ingeniero calcula los grados de libertad. Así no gasta de más ni deja partes sin control.',
      ideas: ['fc-4barras-sketch', 'pr-linkage-sim'], fuente: 'Myszka (2012), Máquinas y mecanismos, cap. 1 (criterio de Gruebler).'
    },
    {
      id: 'sm2-4barras', sm: 'II-2', ac: 'Arma mecanismos de sistemas mecatrónicos', titulo: 'Mecanismo de cuatro barras y ley de Grashof', dur: '2 × 50 min',
      objetivo: 'Predecir con números si un mecanismo de cuatro barras dará vueltas completas.',
      explica: [
        'El mecanismo de cuatro barras es el más usado del mundo: base, manivela, acoplador y balancín. Con solo cambiar las longitudes produce movimientos muy distintos.',
        'Ley de Grashof: llama s al eslabón más corto, l al más largo, y p y q a los otros dos. Si s + l ≤ p + q, al menos un eslabón da vueltas completas (mecanismo de Grashof). Si s + l > p + q, ninguno da vuelta completa: todos oscilan (triple balancín).',
        'En un mecanismo de Grashof, el tipo depende de qué eslabón es la base: si el más corto está junto a la base (es la manivela) → manivela-balancín; si el más corto es la base → doble manivela; si el más corto es el acoplador → doble balancín. Si s + l = p + q es un caso límite que puede "voltearse" en ciertas posiciones.',
        'También cuida el ángulo de transmisión (entre acoplador y balancín): conviene que se mantenga lejos de 0° y 180°, idealmente cerca de 90° y sin bajar de unos 40°, para que el mecanismo no se trabe.'
      ],
      pantalla: ['s = más corto · l = más largo · p y q = los otros dos', 'Si s + l ≤ p + q → algún eslabón da vuelta completa', 'Si s + l > p + q → todos oscilan', 'Más corto junto a la base → manivela-balancín', 'Más corto es la base → doble manivela', 'Ángulo de transmisión cercano a 90° = movimiento suave'],
      clave: [['Manivela', 'Eslabón que da vueltas completas'], ['Balancín', 'Eslabón que oscila'], ['Acoplador', 'Eslabón que une manivela y balancín'], ['Ley de Grashof', 's + l ≤ p + q']],
      ejemplo: { titulo: 'Eslabones de 40, 100, 80 y 90 mm', pasos: ['s = 40, l = 100, p + q = 80 + 90 = 170.', 's + l = 140 ≤ 170 → es de Grashof.', 'Si el de 40 es la manivela junto a la base → manivela-balancín.', 'Contraejemplo: 60, 100, 70 y 75 → s + l = 160 > 145 → triple balancín.'], resultado: 'Con una suma predices el movimiento antes de cortar una sola pieza.' },
      preguntas: [['Eslabones de 30, 70, 50 y 60. ¿Es de Grashof?', 'Sí: 30 + 70 = 100 ≤ 110.'], ['En ese mecanismo, si el de 30 es la base, ¿qué tipo es?', 'Doble manivela.'], ['¿Qué pasa si s + l > p + q?', 'Ningún eslabón gira completo: triple balancín.']],
      errores: ['Usar el eslabón "más corto" sin revisar cuál es la base.', 'Medir longitudes entre bordes en lugar de entre centros de barrenos.', 'Ignorar el ángulo de transmisión: el mecanismo se traba.'],
      vida: 'Limpiaparabrisas, pinzas de presión, cajuelas, excavadoras y bicicletas usan cuatro barras. Si lo dominas, entiendes medio mundo mecánico.',
      ideas: ['grashof', 'fc-4barras-sketch', 'pr-linkage-sim'], fuente: 'Myszka (2012), cap. 1; Programa SEP 2024, Submódulo 2 (p. 38).'
    },
    {
      id: 'sm2-biela', sm: 'II-2', ac: 'Arma mecanismos de sistemas mecatrónicos', titulo: 'Biela-manivela: del giro al vaivén', dur: '50 min',
      objetivo: 'Calcular la carrera de un mecanismo biela-manivela y reconocer sus aplicaciones.',
      explica: [
        'La biela-manivela convierte giro en movimiento alternativo (o al revés, como en el motor de un auto). Tiene manivela (gira), biela (conecta) y corredera o pistón (va y viene).',
        'En un mecanismo centrado, la carrera de la corredera es el doble del radio de la manivela: carrera = 2r. Los extremos se llaman punto muerto superior e inferior; ahí la corredera se detiene un instante y cambia de sentido.',
        'La biela debe ser bastante más larga que la manivela; en motores suele medir de 3 a 4 veces el radio para que el movimiento sea suave.'
      ],
      pantalla: ['Manivela (gira) → biela → corredera (va y viene)', 'Carrera = 2 × radio de la manivela', 'Puntos muertos: la corredera se detiene y regresa', 'Biela más larga = movimiento más suave', 'Funciona en los dos sentidos (motor y bomba)'],
      clave: [['Carrera', 'Distancia total que recorre la corredera'], ['Punto muerto', 'Posición extrema donde se invierte el movimiento'], ['Biela', 'Eslabón que une manivela y corredera']],
      ejemplo: { titulo: 'Compuerta de riego', pasos: ['Necesitas abrir una compuerta 60 mm.', 'Carrera = 2r → r = 60 / 2 = 30 mm.', 'Biela: entre 90 y 120 mm (3 a 4 veces r).'], resultado: 'Una manivela de 30 mm abre y cierra la compuerta 60 mm en cada vuelta.' },
      preguntas: [['Manivela de 25 mm, ¿cuál es la carrera?', '50 mm.'], ['¿Dónde está la velocidad de la corredera en cero?', 'En los puntos muertos.'], ['Menciona dos máquinas con biela-manivela.', 'Motor de combustión, compresor de pistón, bomba de émbolo, máquina de coser.']],
      errores: ['Usar una biela demasiado corta: el mecanismo se traba.', 'Medir el radio desde el borde y no desde el centro del eje.'],
      vida: 'El compresor que alimenta la neumática de una planta y el motor de tu camión usan este mecanismo. En el 3er parcial lo verás convertido en presión.',
      ideas: ['biela-compuerta'], fuente: 'Myszka (2012); Rivera (2021), CNAD.'
    },
    {
      id: 'sm2-levas', sm: 'II-2', ac: 'Modela piezas mecánicas', titulo: 'Levas y seguidores: movimiento programado', dur: '50 min',
      objetivo: 'Leer y dibujar un diagrama de desplazamiento de leva.',
      explica: [
        'Una leva es una pieza con un perfil especial que, al girar, empuja a un seguidor. El perfil "programa" el movimiento: cuándo sube, cuánto, cuándo se queda quieto y cuándo baja.',
        'Tipos de leva: de disco (la más común), cilíndrica o de tambor y lineal. Tipos de seguidor: de punta, de rodillo (menos fricción) y plano.',
        'El diagrama de desplazamiento muestra en el eje horizontal el ángulo de giro de la leva (0° a 360°) y en el vertical la posición del seguidor. Tiene subidas, detenimientos (reposos) y bajadas. Una leva excéntrica (círculo con el centro desplazado una distancia e) produce una carrera de 2e.'
      ],
      pantalla: ['La forma de la leva = el movimiento del seguidor', 'Subida · detenimiento · bajada · detenimiento', 'Diagrama: ángulo de leva vs. desplazamiento', 'Seguidor de rodillo = menos fricción', 'Excéntrica: carrera = 2 × excentricidad'],
      clave: [['Leva', 'Pieza con perfil que impulsa al seguidor'], ['Seguidor', 'Pieza que copia el perfil de la leva'], ['Detenimiento', 'Tramo donde el seguidor no se mueve'], ['Excentricidad', 'Distancia entre el centro del círculo y el eje de giro']],
      ejemplo: { titulo: 'Alimentador de peces', pasos: ['0° a 90°: el seguidor sube 15 mm (abre la compuerta).', '90° a 180°: detenimiento arriba (cae el alimento).', '180° a 270°: baja 15 mm.', '270° a 360°: detenimiento abajo (cerrado).'], resultado: 'Una vuelta de la leva = una porción de alimento. Cambia el perfil y cambias la dosis.' },
      preguntas: [['¿Qué representa un tramo horizontal en el diagrama?', 'Un detenimiento: el seguidor no se mueve.'], ['Excéntrica con e = 8 mm, ¿cuál es la carrera?', '16 mm.'], ['¿Dónde hay levas en un auto?', 'En el árbol de levas que abre y cierra las válvulas del motor.']],
      errores: ['Dibujar cambios bruscos de subida: el seguidor golpea.', 'Olvidar que el diagrama debe cerrar en 360° en la posición inicial.'],
      vida: 'Antes de los PLC, las máquinas de empaque se "programaban" con levas. Hoy existen levas electrónicas en servomotores: es la misma idea en software.',
      ideas: ['leva-alimentador'], fuente: 'Myszka (2012); Rivera (2021), CNAD.'
    },
    {
      id: 'sm2-engranes', sm: 'II-2', ac: 'Arma mecanismos de sistemas mecatrónicos', titulo: 'Engranes y relación de transmisión', dur: '2 × 50 min',
      objetivo: 'Calcular velocidades, torque y distancia entre centros en un par de engranes.',
      explica: [
        'Los engranes transmiten giro sin deslizar. Datos clave: número de dientes Z, diámetro primitivo d y módulo m = d / Z (en mm). Dos engranes solo pueden trabajar juntos si tienen el mismo módulo.',
        'La relación de transmisión es i = Z2 / Z1 = n1 / n2 (1 es el engrane motriz). Si el conducido tiene más dientes, gira más lento pero con más torque: idealmente T2 = T1 · i (en la realidad hay algo de pérdida por fricción).',
        'Dos engranes externos giran en sentidos contrarios. Un engrane intermedio (loco) recupera el sentido sin cambiar la relación. En un tren compuesto, la relación total es el producto de las relaciones.',
        'Distancia entre centros: a = m · (Z1 + Z2) / 2.'
      ],
      pantalla: ['Módulo m = d / Z (mismo módulo para engranar)', 'i = Z2 / Z1 = n1 / n2', 'Más dientes en la salida → menos velocidad, más torque', 'Engranes externos giran en sentido contrario', 'Distancia entre centros a = m(Z1 + Z2) / 2'],
      clave: [['Z', 'Número de dientes'], ['Módulo m', 'Tamaño del diente (mm)'], ['Relación i', 'Cuántas vueltas da la entrada por una de la salida'], ['Engrane loco', 'Intermedio: cambia el sentido, no la relación']],
      ejemplo: { titulo: 'Reductor de una banda transportadora', pasos: ['Motor a 1200 rpm con piñón Z1 = 12; engrane Z2 = 36.', 'i = 36 / 12 = 3.', 'Salida: 1200 / 3 = 400 rpm, con el triple de torque (ideal).', 'Con m = 2: a = 2 · (12 + 36) / 2 = 48 mm.'], resultado: 'Así funcionan los motorreductores que verás en cualquier planta.' },
      preguntas: [['Z1 = 15 impulsa a Z2 = 45. Si la entrada gira a 900 rpm, ¿cuánto gira la salida?', '300 rpm (i = 3).'], ['¿Pueden engranar un engrane de módulo 1 y uno de módulo 2?', 'No: el módulo debe ser igual.'], ['¿Cómo hago que la salida gire en el mismo sentido que la entrada?', 'Agregando un engrane intermedio (loco).']],
      errores: ['Invertir la relación (Z1/Z2).', 'Pensar que más velocidad también da más fuerza.', 'Mezclar módulos distintos.'],
      vida: 'Bicicletas, relojes, cajas de velocidades, motorreductores, robots: los engranes están en todas partes. Saber calcularlos te permite elegir el motor correcto.',
      ideas: ['engranes-carton'], fuente: 'Myszka (2012); Bolton (2013), Mecatrónica.'
    },
    {
      id: 'sm2-poleas', sm: 'II-2', ac: 'Arma mecanismos de sistemas mecatrónicos', titulo: 'Poleas, bandas y cadenas', dur: '50 min',
      objetivo: 'Calcular velocidades en transmisiones por banda y cadena y elegir el tipo adecuado.',
      explica: [
        'Las poleas con banda transmiten giro entre ejes separados. La relación es i = D2 / D1 = n1 / n2. Con banda abierta ambas giran en el mismo sentido; con banda cruzada, en sentidos contrarios.',
        'Bandas planas y en V pueden patinar (sirven como protección ante sobrecargas). Las bandas dentadas (síncronas) no patinan: se usan donde importa la posición, como en impresoras 3D. Las cadenas con catarinas tampoco patinan y aguantan más fuerza.',
        'La velocidad lineal de la banda es v = π · D · n (cuida las unidades).'
      ],
      pantalla: ['i = D2 / D1 = n1 / n2', 'Banda abierta: mismo sentido · cruzada: contrario', 'Plana o en V: puede patinar', 'Dentada o cadena: no patina (precisión)', 'v de la banda = π · D · n'],
      clave: [['Polea motriz', 'La que está en el motor'], ['Banda síncrona', 'Banda dentada que no patina'], ['Catarina', 'Rueda dentada para cadena']],
      ejemplo: { titulo: 'Motor de 1750 rpm', pasos: ['Polea del motor D1 = 50 mm; polea de la máquina D2 = 200 mm.', 'i = 200 / 50 = 4.', 'n2 = 1750 / 4 = 437.5 rpm.'], resultado: 'Polea grande en la máquina = menos velocidad y más torque.' },
      preguntas: [['¿Por qué una impresora 3D usa banda dentada y no plana?', 'Porque no patina y conserva la posición exacta.'], ['D1 = 100 mm, D2 = 50 mm, n1 = 600 rpm. ¿n2?', '1200 rpm.']],
      errores: ['Tensar de más la banda (se dañan los baleros).', 'Invertir la relación de diámetros.'],
      vida: 'Bandas transportadoras, ventiladores industriales, motores de autos y bicicletas: el técnico de mantenimiento revisa tensión y desgaste de bandas todos los días.',
      ideas: ['pares-baratos'], fuente: 'Myszka (2012); Rivera (2021), CNAD.'
    },
    {
      id: 'sm2-tornillo', sm: 'II-2', ac: 'Arma mecanismos de sistemas mecatrónicos', titulo: 'Tornillo-tuerca y piñón-cremallera', dur: '50 min',
      objetivo: 'Calcular el avance lineal producido por un tornillo o un piñón.',
      explica: [
        'El tornillo-tuerca convierte giro en avance lineal muy preciso y con mucha fuerza. En una rosca de una entrada, cada vuelta avanza un paso: avance = paso × número de vueltas. Muchas roscas son autobloqueantes: la carga no las hace girar de regreso.',
        'En las máquinas CNC se usan husillos de bolas, con mucha menos fricción.',
        'El piñón-cremallera también convierte giro en movimiento lineal, pero más rápido: en cada vuelta, la cremallera avanza el perímetro primitivo del piñón: π · d = π · m · Z.'
      ],
      pantalla: ['Tornillo: avance = paso × vueltas', 'Mucha fuerza, mucha precisión, poco avance', 'Piñón-cremallera: avance por vuelta = π · m · Z', 'Más rápido, menos fuerza que el tornillo'],
      clave: [['Paso', 'Distancia entre hilos de la rosca'], ['Autobloqueo', 'La carga no hace girar el tornillo de regreso'], ['Cremallera', 'Engrane "desenrollado" en línea recta']],
      ejemplo: { titulo: 'Dos formas de mover 100 mm', pasos: ['Husillo de paso 2 mm: 100 / 2 = 50 vueltas.', 'Piñón m = 1, Z = 20 → d = 20 mm → avance por vuelta = π · 20 ≈ 62.8 mm.', '100 mm requieren 100 / 62.8 ≈ 1.6 vueltas.'], resultado: 'El tornillo es lento y preciso; la cremallera, rápida.' },
      preguntas: [['Rosca de paso 1.5 mm, 20 vueltas: ¿cuánto avanza?', '30 mm.'], ['¿Qué mecanismo usa la dirección de muchos autos?', 'Piñón-cremallera.'], ['¿Por qué el gato de tijera no se baja solo con el peso del auto?', 'Porque el tornillo es autobloqueante.']],
      errores: ['Confundir paso con diámetro del tornillo.', 'Olvidar el número de entradas de la rosca.'],
      vida: 'Prensas de banco, gatos, ejes de CNC y actuadores eléctricos lineales: precisión y fuerza en espacios pequeños.',
      ideas: ['ing-inversa'], fuente: 'Myszka (2012); Bolton (2013).'
    },
    {
      id: 'sm2-explosionada', sm: 'II-2', ac: 'Representa el ensamble mecánico en vista explosionada', titulo: 'Del modelo al ensamble: vista explosionada', dur: '2 × 50 min',
      objetivo: 'Ensamblar piezas en FreeCAD, comprobar el movimiento y obtener el plano explosionado.',
      explica: [
        'Un ensamble une piezas con relaciones que imitan la realidad: una pieza queda anclada (la base) y las demás se unen con uniones (por ejemplo, giratorias en los pasadores). Así puedes mover el mecanismo en la pantalla y detectar choques antes de fabricar.',
        'La vista explosionada separa las piezas en el orden en que se arman, para que cualquiera entienda el ensamble. Acompañada de una lista de partes (BOM), es el documento que usan los ensambladores en planta.',
        'FreeCAD 1.0 trae el banco de trabajo Assembly integrado, con vistas explosionadas y listas de materiales que se llevan a TechDraw. Si el plantel tiene una versión anterior, simulen el movimiento en el Sketcher.'
      ],
      pantalla: ['Ancla la base · une con uniones que imitan la realidad', 'Mueve el ensamble: ¿choca algo? Corrige antes de cortar', 'Vista explosionada = piezas separadas en orden de armado', 'Lista de partes (BOM) + escala + cuadro de datos', 'Simular primero ahorra material (economía ecológica)'],
      clave: [['Ensamble', 'Conjunto de piezas con sus uniones'], ['Unión giratoria', 'Permite rotar sobre un eje común'], ['Vista explosionada', 'Piezas separadas para mostrar el armado'], ['BOM', 'Lista de materiales o de partes']],
      ejemplo: { titulo: 'La garra del proyecto', pasos: ['Modela base, manivela, acoplador y dedo en Part Design.', 'Ensambla: base anclada y uniones giratorias en los cuatro pasadores.', 'Mueve la manivela: si el dedo atraviesa la base, ajusta longitudes.', 'Crea la vista explosionada y la lista de partes; llévalas a TechDraw.'], resultado: 'Ese plano es la evidencia de la actividad clave "Representa el ensamble mecánico en vista explosionada".' },
      preguntas: [['¿Para qué sirve anclar una pieza?', 'Para que sea la referencia fija; si no, todo el ensamble flota.'], ['¿Qué ahorra simular antes de fabricar?', 'Material, tiempo y dinero: los choques se corrigen en pantalla.'], ['¿Qué documento acompaña a la vista explosionada?', 'La lista de partes (BOM).']],
      errores: ['No anclar la base.', 'Unir en puntos que no son el centro del barreno.', 'Entregar el explosionado sin lista de partes.'],
      vida: 'Los manuales de armado de muebles, autos y máquinas son vistas explosionadas. Hacerlas bien es una habilidad muy pedida en ingeniería de manufactura.',
      ideas: ['fc-ensamble-explosionada', 'fc-plantillas', 'pr-freecad-espejo'], fuente: 'Programa SEP 2024, Submódulo 2 (p. 36); FreeCAD 1.0 (librearts.org, nov. 2024).'
    },
    {
      id: 'sm2-materiales', sm: 'II-2', ac: 'Arma mecanismos de sistemas mecatrónicos', titulo: 'Materiales para prototipos e impacto ecológico', dur: '50 min',
      objetivo: 'Elegir material con criterio técnico y ecológico, y justificarlo.',
      explica: [
        'El programa pide determinar el tipo de material "considerando el impacto ecológico". Para prototipos escolares: cartón (barato, reciclable, poca rigidez), madera balsa (ligera, fácil de cortar), MDF (rígido y estable; su polvo es irritante: cortar con ventilación y cubrebocas), acrílico (bonito y rígido, se raya) y plástico de impresión 3D (PLA, si tienen acceso).',
        'Criterios: rigidez necesaria, peso, facilidad de corte con las herramientas disponibles, costo, desperdicio y qué pasa con el material al final.',
        'Economía ecológica en el taller: acomodar plantillas para desperdiciar menos, reutilizar cartón, separar residuos y simular antes de fabricar.'
      ],
      pantalla: ['Elige por: rigidez · peso · herramienta · costo · desperdicio', 'Cartón: barato y reciclable, poco rígido', 'MDF: rígido; su polvo irrita (ventila y cubrebocas)', 'Acomoda plantillas para desperdiciar menos', 'Simular antes de cortar también es ecología'],
      clave: [['Rigidez', 'Resistencia a doblarse'], ['Nesting', 'Acomodar piezas para aprovechar la hoja'], ['Economía ecológica', 'Producir cuidando los recursos naturales']],
      ejemplo: { titulo: 'Tabla rápida de decisión', pasos: ['Eslabón que soporta poca carga → cartón doble.', 'Base que debe ser rígida → MDF o madera.', 'Pieza que se va a ver en la feria → acrílico o madera bien lijada.'], resultado: 'Justifica cada elección en la bitácora: eso es una evidencia del programa.' },
      preguntas: [['¿Por qué no hacer todo de MDF?', 'Pesa más, su polvo irrita y no siempre se necesita tanta rigidez.'], ['Menciona dos acciones para reducir desperdicio.', 'Acomodar plantillas y reutilizar sobrantes; simular antes de cortar.']],
      errores: ['Elegir solo por "lo que había".', 'Cortar sin acomodar: desperdician media hoja.'],
      vida: 'En la industria, el material decide costo, peso y vida útil del producto. Las empresas del Bajío reportan sus indicadores de desperdicio: pensar así ya es pensar como profesional.',
      ideas: ['fc-plantillas', 'pares-baratos'], fuente: 'Programa SEP 2024, Submódulo 2 (pp. 38-40) y Conceptos Centrales de Educación para el Desarrollo Sostenible (p. 150).'
    },
    {
      id: 'sm2-seguridad', sm: 'II-2', ac: 'Arma mecanismos de sistemas mecatrónicos', titulo: 'Seguridad en el taller y equipo de protección', dur: '30 min',
      objetivo: 'Identificar riesgos del taller y usar el equipo de protección adecuado.',
      explica: [
        'La NOM-017-STPS-2008 establece que el patrón debe identificar los riesgos de cada puesto y dar el equipo de protección personal (EPP) adecuado, y el trabajador debe usarlo.',
        'Riesgos del taller escolar: cortes con cúter y segueta, proyección de partículas al perforar o cortar, quemaduras con silicón caliente, polvo de MDF y, en el 3er parcial, fluidos a presión y cortocircuitos.',
        'La prevención va primero (orden, herramienta adecuada, técnica correcta) y el EPP es la última barrera, no la única.'
      ],
      pantalla: ['NOM-017-STPS-2008: EPP según el riesgo', 'Cúter: corta hacia afuera, regla metálica, ciérralo al caminar', 'Lentes al cortar, perforar o trabajar con presión', 'Silicón caliente: base y cuidado con los dedos', 'Orden y limpieza = menos accidentes'],
      clave: [['EPP', 'Equipo de protección personal'], ['Riesgo', 'Posibilidad de que un peligro cause daño'], ['Casi accidente', 'Evento que pudo lastimar a alguien: se reporta y se aprende']],
      ejemplo: { titulo: 'Análisis de un puesto: corte de plantillas', pasos: ['Peligro: hoja del cúter.', 'Riesgo: cortes en mano y dedos.', 'Control: técnica (cortar alejándose del cuerpo), regla metálica y base de corte.', 'EPP: guante en la mano que sujeta (si el taller lo tiene).'], resultado: 'Ese mismo análisis se hace en cualquier planta antes de arrancar un trabajo.' },
      preguntas: [['¿Qué NOM regula el equipo de protección personal?', 'La NOM-017-STPS-2008.'], ['¿Qué haces si casi te cortas?', 'Lo reportas y se registra en la bitácora para prevenir.']],
      errores: ['Pensar que el EPP sustituye a la técnica.', 'Dejar herramientas abiertas en la mesa.'],
      vida: 'En las plantas, la seguridad es requisito para conservar el trabajo. Quien la vive desde la escuela llega con ventaja… y con sus diez dedos.',
      ideas: ['seguridad-cuter'], fuente: 'NOM-017-STPS-2008 (citada en el programa SEP 2024, Módulo I, p. 30).'
    },

    /* ===================== SUBMÓDULO 3: NEUMÁTICA E HIDRÁULICA ===================== */
    {
      id: 'sm3-presion', sm: 'II-3', ac: 'Interpreta planos de sistemas neumáticos, electroneumáticos, hidráulicos y electrohidráulicos', titulo: 'Presión, fuerza y caudal (y sus unidades)', dur: '2 × 50 min',
      objetivo: 'Manejar presión, fuerza y caudal y convertir sus unidades sin miedo.',
      explica: [
        'Presión es fuerza repartida en un área: P = F / A. Su unidad SI es el pascal (Pa = N/m²), muy pequeña; por eso en la industria se usan bar y psi. 1 bar = 100 000 Pa = 100 kPa ≈ 14.5 psi; 1 MPa = 10 bar. Un truco útil: 1 bar = 0.1 N/mm².',
        'La presión atmosférica es de aproximadamente 1 bar. Los manómetros industriales marcan presión manométrica (por encima de la atmosférica).',
        'Caudal es volumen por tiempo: Q = V / t. También Q = A · v (área por velocidad del fluido). 1 L/min ≈ 16.67 cm³/s. El caudal decide qué tan rápido se mueve un actuador; la presión, cuánta fuerza hace.'
      ],
      pantalla: ['P = F / A', '1 bar = 100 kPa ≈ 14.5 psi', '1 bar = 0.1 N/mm² (truco para cilindros)', 'Q = V / t = A · v', 'Presión → fuerza · Caudal → velocidad'],
      clave: [['Pascal (Pa)', 'N/m², la unidad SI de presión'], ['bar', '100 000 Pa'], ['psi', 'Libras por pulgada cuadrada'], ['Caudal', 'Volumen que pasa por unidad de tiempo']],
      ejemplo: { titulo: 'Conversiones del taller', pasos: ['Red de aire a 6 bar = 600 kPa ≈ 87 psi.', 'Una llanta a 32 psi ≈ 2.2 bar.', 'Jeringa de 20 mL vaciada en 4 s: Q = 20 / 4 = 5 mL/s = 0.3 L/min.'], resultado: 'Con dos números (bar y L/min) describes cualquier sistema neumático.' },
      preguntas: [['¿Cuántos psi son 7 bar?', 'Unos 101.5 psi.'], ['Si duplico el área con la misma fuerza, ¿qué pasa con la presión?', 'Se reduce a la mitad.'], ['¿Qué controla la velocidad de un cilindro, la presión o el caudal?', 'Principalmente el caudal.']],
      errores: ['Mezclar mm² con m² en P = F/A.', 'Confundir presión manométrica con absoluta.'],
      vida: 'Cada máquina neumática de una planta tiene un manómetro. Leerlo y saber si está bien es tarea diaria del técnico.',
      ideas: ['caudal-cronometro', 'pr-phet-presion'], fuente: 'Programa SEP 2024, Submódulo 3 (p. 40); NOM-008-SCFI-2002 (unidades).'
    },
    {
      id: 'sm3-pascal', sm: 'II-3', ac: 'Diseña elementos neumáticos, electroneumáticos, hidráulicos y electrohidráulicos', titulo: 'Principio de Pascal y la prensa hidráulica', dur: '50 min',
      objetivo: 'Calcular la multiplicación de fuerza con dos émbolos de distinta área.',
      explica: [
        'Principio de Pascal: la presión aplicada a un fluido encerrado se transmite completa a todo el fluido. Si empujas un émbolo chico, la misma presión empuja a uno grande, que hace más fuerza: F2 = F1 · (A2 / A1).',
        'No hay magia: la energía se conserva. El émbolo grande se mueve menos: d2 = d1 · (A1 / A2). Ganas fuerza, pierdes recorrido.',
        'El área de un émbolo circular es A = π · D² / 4; por eso la relación de áreas es (D2 / D1)².'
      ],
      pantalla: ['La presión se transmite a todo el fluido', 'F2 = F1 · (A2 / A1)', 'Relación de áreas = (D2 / D1)²', 'Ganas fuerza, pierdes recorrido', 'Así funcionan frenos, gatos y excavadoras'],
      clave: [['Fluido confinado', 'Encerrado, sin escape'], ['Multiplicación de fuerza', 'Efecto de usar un émbolo de salida más grande'], ['Incompresible', 'Un líquido casi no cambia de volumen al presionarlo']],
      ejemplo: { titulo: 'Jeringas del proyecto (mide las tuyas)', pasos: ['Supón D1 = 15 mm (jeringa chica) y D2 = 20 mm (grande).', 'Relación de áreas = (20 / 15)² ≈ 1.78.', 'Empujas con 10 N → la grande empuja con ≈ 17.8 N.', 'Si la chica avanza 30 mm, la grande avanza 30 / 1.78 ≈ 17 mm.'], resultado: 'La grúa levanta más peso si el "músculo" es la jeringa grande.' },
      preguntas: [['D1 = 10 mm, D2 = 30 mm. ¿Cuántas veces se multiplica la fuerza?', '9 veces ((30/10)² = 9).'], ['Y si el chico avanza 90 mm, ¿cuánto avanza el grande?', '10 mm.'], ['¿Por qué no funciona igual con aire?', 'Porque el aire se comprime: parte del recorrido se pierde comprimiéndolo.']],
      errores: ['Usar la relación de diámetros sin elevar al cuadrado.', 'Dejar burbujas: el sistema se vuelve "esponjoso".'],
      vida: 'Los frenos de un auto, el gato de un taller y las prensas industriales de cientos de toneladas funcionan con este principio.',
      ideas: ['pascal-jeringas', 'pr-phet-presion'], fuente: 'Programa SEP 2024, Submódulo 3 (p. 41); Bolton (2013).'
    },
    {
      id: 'sm3-comparativa', sm: 'II-3', ac: 'Diseña elementos neumáticos, electroneumáticos, hidráulicos y electrohidráulicos', titulo: 'Neumática, hidráulica o eléctrica: ¿cuál uso?', dur: '50 min',
      objetivo: 'Elegir la tecnología de actuación según fuerza, velocidad, precisión, costo y limpieza.',
      explica: [
        'Neumática: aire comprimido, en la industria normalmente alrededor de 6 bar. Es rápida, limpia, barata y segura ante sobrecargas, pero da fuerzas moderadas y, como el aire se comprime, es difícil detenerla en posiciones intermedias precisas.',
        'Hidráulica: aceite a presiones mucho mayores (decenas a cientos de bar). Da fuerzas enormes y movimientos suaves y controlados; a cambio requiere bomba, tanque y mantenimiento, y las fugas ensucian.',
        'Eléctrica: motores y actuadores eléctricos. Excelente precisión y control (servomotores), eficiente; puede ser más cara al inicio. Muchas máquinas combinan las tres.'
      ],
      pantalla: ['Neumática: rápida, limpia, barata, fuerza moderada', 'Hidráulica: fuerza enorme, suave, requiere más mantenimiento', 'Eléctrica: precisión y control', 'El aire se comprime; el aceite casi no', 'Elegir = fuerza · velocidad · precisión · costo · limpieza'],
      clave: [['Actuador', 'Elemento que produce el movimiento (cilindro, motor)'], ['Compresibilidad', 'Cuánto cambia el volumen con la presión'], ['Servomotor', 'Motor con control preciso de posición']],
      ejemplo: { titulo: 'Tres aplicaciones, tres decisiones', pasos: ['Expulsar piezas de una banda rápido → neumática.', 'Doblar lámina gruesa con 50 toneladas → hidráulica.', 'Posicionar un brazo con décimas de milímetro → eléctrica (servo).'], resultado: 'No hay "la mejor": hay la adecuada para cada tarea.' },
      preguntas: [['¿Por qué las líneas de alimentos prefieren la neumática?', 'Porque es limpia: si hay una fuga, solo sale aire.'], ['¿Qué tecnología usa una excavadora para mover el brazo?', 'Hidráulica.']],
      errores: ['Creer que la neumática sirve para posicionar con precisión en cualquier punto.', 'Olvidar el costo de mantenimiento de la hidráulica.'],
      vida: 'Saber elegir tecnología es lo que distingue a un técnico de un integrador. Esa es la conversación diaria entre las plantas y sus proveedores de automatización.',
      ideas: ['aire-vs-agua', 'pr-maquina-misteriosa'], fuente: 'Bolton (2013); Guillén (1999), Introducción a la Neumática.'
    },
    {
      id: 'sm3-aire', sm: 'II-3', ac: 'Interpreta planos de sistemas neumáticos, electroneumáticos, hidráulicos y electrohidráulicos', titulo: 'Del compresor al cilindro: el camino del aire', dur: '50 min',
      objetivo: 'Explicar cómo se produce, prepara y distribuye el aire comprimido.',
      explica: [
        'El compresor (de pistón o de tornillo) toma aire del ambiente y lo comprime; el depósito lo almacena y estabiliza la presión; un secador y purgas retiran el agua que se condensa; la red de tuberías lo lleva a las máquinas.',
        'Antes de cada máquina va la unidad de mantenimiento (FRL): filtro (quita agua y partículas), regulador con manómetro (fija la presión de trabajo) y lubricador (cada vez menos usado, porque muchos componentes modernos vienen lubricados de fábrica).',
        'Aire sucio o húmedo = válvulas pegadas y cilindros dañados. La preparación del aire es la base del mantenimiento neumático.'
      ],
      pantalla: ['Compresor → depósito → secado → red → FRL → válvula → cilindro', 'F = filtro · R = regulador · L = lubricador', 'El agua condensada es el enemigo: purgar', 'Regulador = fija la presión de trabajo', 'Aire limpio = componentes que duran'],
      clave: [['Compresor', 'Máquina que eleva la presión del aire'], ['Depósito', 'Tanque que almacena y estabiliza'], ['Unidad FRL', 'Filtro, regulador y lubricador'], ['Purga', 'Salida para el agua condensada']],
      ejemplo: { titulo: 'Recorrido en una planta', pasos: ['Cuarto de compresores con tanque.', 'Tubería principal con pendiente hacia las purgas.', 'Bajantes a cada máquina con su FRL a 6 bar.', 'Válvulas y cilindros en la máquina.'], resultado: 'Si una máquina falla por "baja presión", el técnico recorre este camino hacia atrás.' },
      preguntas: [['¿Qué hace el regulador?', 'Fija la presión de trabajo que recibe la máquina.'], ['¿Por qué se purga el tanque?', 'Para sacar el agua condensada que daña los componentes.']],
      errores: ['Saltarse el filtro.', 'Ajustar la presión "al máximo" sin necesidad (desperdicio de energía).'],
      vida: 'El aire comprimido es de los servicios que más energía consumen en una planta; un técnico que detecta fugas le ahorra mucho dinero a su empresa.',
      ideas: ['memorama-iso', 'pr-catalogo-real'], fuente: 'Guillén (1999); Ruiz (2015), Manual de Neumática, CNAD.'
    },
    {
      id: 'sm3-cilindros', sm: 'II-3', ac: 'Diseña elementos neumáticos, electroneumáticos, hidráulicos y electrohidráulicos', titulo: 'Cilindros de simple y doble efecto: cálculo de fuerza', dur: '2 × 50 min',
      objetivo: 'Calcular la fuerza de avance y de retroceso de un cilindro.',
      explica: [
        'Cilindro de simple efecto: el aire empuja en un sentido y un resorte lo regresa. Gasta menos aire, pero tiene carrera corta y pierde algo de fuerza contra el resorte. Doble efecto: el aire empuja en ambos sentidos.',
        'Fuerza teórica de avance: F = P · A, con A = π · D² / 4 (D = diámetro del émbolo). En el retroceso el vástago ocupa área, así que F = P · (A − a), con a = π · d² / 4 (d = diámetro del vástago). En la práctica la fricción quita algo de fuerza (se suele estimar alrededor de 10 % menos).',
        'Usa el truco 1 bar = 0.1 N/mm² y trabaja en milímetros.'
      ],
      pantalla: ['Simple efecto: aire en un sentido, resorte de regreso', 'Doble efecto: aire en ambos sentidos', 'Avance: F = P · A (A = π · D² / 4)', 'Retroceso: F = P · (A − a)', '6 bar = 0.6 N/mm²'],
      clave: [['Émbolo', 'Pistón dentro del cilindro'], ['Vástago', 'Barra que sale del cilindro'], ['Carrera', 'Distancia que recorre el vástago']],
      ejemplo: { titulo: 'Cilindro Ø32 mm, vástago Ø12 mm, a 6 bar', pasos: ['A = π · 32² / 4 ≈ 804 mm².', 'Avance: 0.6 × 804 ≈ 482 N (≈ 49 kgf).', 'a = π · 12² / 4 ≈ 113 mm².', 'Retroceso: 0.6 × (804 − 113) ≈ 415 N.'], resultado: 'El retroceso siempre es más débil que el avance.' },
      preguntas: [['¿Por qué el retroceso tiene menos fuerza?', 'Porque el vástago reduce el área donde empuja el aire.'], ['Cilindro Ø50 mm a 6 bar, ¿fuerza de avance aproximada?', '≈ 1178 N (A ≈ 1963 mm² × 0.6).'], ['¿Cuándo eliges simple efecto?', 'Cuando solo se necesita fuerza en un sentido y carrera corta (sujetar, expulsar).']],
      errores: ['Usar el diámetro del vástago para el avance.', 'Olvidar elevar el diámetro al cuadrado.', 'Mezclar bar con N/mm² sin convertir.'],
      vida: 'Elegir el diámetro correcto de un cilindro es de las tareas más comunes al diseñar una máquina: muy chico no levanta, muy grande gasta aire de más.',
      ideas: ['pr-catalogo-real', 'pascal-jeringas'], fuente: 'Serrano (2009), Neumática práctica; Guillén (1999).'
    },
    {
      id: 'sm3-valvulas', sm: 'II-3', ac: 'Diseña elementos neumáticos, electroneumáticos, hidráulicos y electrohidráulicos', titulo: 'Válvulas: vías, posiciones y accionamientos', dur: '2 × 50 min',
      objetivo: 'Nombrar y elegir válvulas distribuidoras y reguladoras de caudal.',
      explica: [
        'Las válvulas distribuidoras se nombran con dos números: vías / posiciones. Una 3/2 (3 conexiones, 2 posiciones) gobierna un cilindro de simple efecto; una 5/2 (o 4/2) gobierna uno de doble efecto. Pueden ser normalmente cerradas (NC) o normalmente abiertas (NA) en reposo.',
        'Accionamientos: manual (botón, palanca, pedal), mecánico (rodillo, leva), neumático (señal de aire o piloto) y eléctrico (solenoide). El retorno suele ser por resorte.',
        'Numeración ISO de conexiones: 1 = alimentación; 2 y 4 = utilización (hacia el cilindro); 3 y 5 = escape; 12 y 14 = pilotaje.',
        'La reguladora de caudal unidireccional (estrangulador con antirretorno) controla la velocidad del cilindro. En neumática normalmente se estrangula el aire de escape: el movimiento resulta más estable.'
      ],
      pantalla: ['Nombre = vías / posiciones (3/2, 5/2)', '3/2 → simple efecto · 5/2 → doble efecto', 'NC / NA = cómo está en reposo', 'Conexiones: 1 entrada · 2, 4 salidas · 3, 5 escapes', 'Velocidad: regula el caudal de escape'],
      clave: [['Vía', 'Conexión de la válvula'], ['Posición', 'Estado que puede tomar la válvula'], ['Solenoide', 'Bobina que acciona la válvula eléctricamente'], ['Estrangulador', 'Restricción que regula el caudal']],
      ejemplo: { titulo: 'Diseña el mando de una prensa didáctica', pasos: ['Cilindro de doble efecto → válvula 5/2.', 'Accionamiento por botón y retorno por resorte (o biestable para mantener posición).', 'Reguladoras de caudal en las dos salidas para ajustar la velocidad.'], resultado: 'Con 3 componentes ya tienes un circuito completo que puedes dibujar con ISO 1219.' },
      preguntas: [['¿Qué válvula usarías para un cilindro de simple efecto?', 'Una 3/2.'], ['En la numeración ISO, ¿qué es la conexión 1?', 'La alimentación de aire.'], ['¿Cómo se regula la velocidad de un cilindro neumático?', 'Con reguladoras de caudal, normalmente estrangulando el escape.']],
      errores: ['Confundir vías con posiciones.', 'Conectar la alimentación en un escape.', 'Regular la entrada y obtener movimientos a saltos.'],
      vida: 'Las válvulas son el "cerebro mecánico" de la neumática. En el Módulo III las vas a mandar desde un PLC: hoy aprendes lo que el PLC va a mover.',
      ideas: ['memorama-iso', 'pr-escape-iso'], fuente: 'Serrano (2009); Ruiz (2015), CNAD.'
    },
    {
      id: 'sm3-iso1219', sm: 'II-3', ac: 'Interpreta planos de sistemas neumáticos, electroneumáticos, hidráulicos y electrohidráulicos', titulo: 'Leer y dibujar diagramas con ISO 1219', dur: '50 min',
      objetivo: 'Leer un diagrama neumático o hidráulico y dibujar uno sencillo correctamente.',
      explica: [
        'Los símbolos ISO 1219 representan la FUNCIÓN de un componente, no su forma física. En una válvula, cada cuadro es una posición; las flechas indican el paso del fluido y una "T" indica una vía bloqueada.',
        'Un diagrama se ordena de abajo hacia arriba: abajo la alimentación (unidad de mantenimiento), en medio las válvulas, arriba los actuadores. Se dibuja en posición de reposo.',
        'Cada componente lleva una designación. Verás numeraciones como 1A1 (actuador del circuito 1) y 1V1 (su válvula) o, en libros más antiguos, 1.0 y 1.1. Usa la misma en toda la libreta.'
      ],
      pantalla: ['El símbolo dice la función, no la forma', 'Cada cuadro de la válvula = una posición', 'Abajo: alimentación · en medio: válvulas · arriba: actuadores', 'Se dibuja en reposo', 'Cada componente con su designación (1A1, 1V1…)'],
      clave: [['ISO 1219', 'Norma de símbolos y diagramas de potencia fluida'], ['Posición de reposo', 'Estado sin accionar nada'], ['Designación', 'Código que identifica cada componente']],
      ejemplo: { titulo: 'Lee este circuito en voz alta', pasos: ['Unidad de mantenimiento → válvula 3/2 NC con botón → cilindro de simple efecto.', 'En reposo: el cilindro está adentro (resorte).', 'Al presionar: la válvula conecta 1 con 2 y el cilindro sale.', 'Al soltar: escapa el aire por 3 y el resorte lo regresa.'], resultado: 'Si puedes narrar el circuito, lo entiendes.' },
      preguntas: [['¿Qué representa cada cuadro de una válvula?', 'Una posición.'], ['¿En qué estado se dibuja un diagrama?', 'En reposo.'], ['¿Dónde van los actuadores en el diagrama?', 'Arriba.']],
      errores: ['Dibujar el cilindro en posición accionada.', 'Mezclar símbolos de distintas normas.', 'Líneas que se cruzan sin indicar si están conectadas.'],
      vida: 'Ningún técnico conecta una máquina sin su diagrama. Leerlo bien es la diferencia entre arreglar una falla en 10 minutos o en 3 horas.',
      ideas: ['memorama-iso', 'pr-escape-iso', 'pr-error-del-dia'], fuente: 'Programa SEP 2024, Submódulo 3 (p. 40); ISO 1219.'
    },
    {
      id: 'sm3-electro', sm: 'II-3', ac: 'Arma sistemas neumáticos, electroneumáticos, hidráulicos y electrohidráulicos', titulo: 'Electroneumática: mando eléctrico y diagrama de escalera', dur: '2 × 50 min',
      objetivo: 'Leer y armar un diagrama de escalera sencillo con autorretención.',
      explica: [
        'En electroneumática y electrohidráulica, la señal es eléctrica y la fuerza es del fluido. La electroválvula (válvula con solenoide) es el puente entre ambos mundos.',
        'Elementos de mando: botones NA (normalmente abiertos) y NC (normalmente cerrados), relés (una bobina que cierra o abre contactos), finales de carrera y sensores; en cilindros con émbolo magnético se usan sensores magnéticos para saber si el vástago está afuera o adentro.',
        'El diagrama de escalera tiene dos rieles (en la industria, normalmente 24 V de CD y 0 V) y cada "escalón" es un circuito: contactos a la izquierda, la carga (bobina o lámpara) a la derecha.',
        'Autorretención o enclavamiento: un contacto NA del relé, en paralelo con el botón de arranque, mantiene la bobina energizada al soltar el botón; un botón de paro NC en serie la desenergiza.'
      ],
      pantalla: ['Señal eléctrica + fuerza del fluido', 'Electroválvula = puente entre los dos mundos', 'NA abre en reposo · NC cierra en reposo', 'Escalera: contactos a la izquierda, carga a la derecha', 'Autorretención: arranque NA + contacto del relé en paralelo + paro NC en serie'],
      clave: [['Relé', 'Interruptor accionado por una bobina'], ['Contacto NA', 'Abierto en reposo; cierra al accionarse'], ['Contacto NC', 'Cerrado en reposo; abre al accionarse'], ['Autorretención', 'El relé se mantiene activado a sí mismo']],
      ejemplo: { titulo: 'Arranque y paro de un solenoide', pasos: ['Escalón 1: Paro (NC) → Arranque (NA) ∥ contacto K1 → bobina K1.', 'Escalón 2: contacto K1 → solenoide Y1 de la válvula.', 'Presionas Arranque: K1 se activa y se retiene.', 'Presionas Paro: se corta K1 y Y1 se desactiva.'], resultado: 'Este circuito es la base de casi toda máquina industrial. En el Módulo III lo programarás en un PLC.' },
      preguntas: [['¿Por qué el botón de paro se conecta como NC?', 'Para que, si se corta un cable, la máquina se detenga (falla segura).'], ['¿Qué hace el contacto del relé en paralelo con el arranque?', 'Retiene la bobina energizada al soltar el botón.'], ['¿Qué voltaje de control es común en la industria?', '24 V de corriente directa.']],
      errores: ['Poner la carga antes de los contactos.', 'Usar un botón NA para el paro.', 'Olvidar el paro en serie con la retención.'],
      vida: 'Este es el lenguaje de los tableros de control. Quien lo entiende puede trabajar en mantenimiento eléctrico, tableros e integración de máquinas.',
      ideas: ['escalera-papel', 'pr-phet-circuitos'], fuente: 'Programa SEP 2024, Submódulo 3 (p. 42); Bolton (2013).'
    },
    {
      id: 'sm3-motordc', sm: 'II-3', ac: 'Arma sistemas neumáticos, electroneumáticos, hidráulicos y electrohidráulicos', titulo: 'Motor de CD e inversión de giro (para la grúa)', dur: '50 min',
      objetivo: 'Conectar un motor de CD de forma segura e invertir su sentido de giro.',
      explica: [
        'Un motor de corriente directa gira en un sentido u otro según la polaridad. Su velocidad depende sobre todo del voltaje y su fuerza de giro (torque) de la corriente que puede tomar.',
        'Para invertir el giro se cruza la polaridad: con un interruptor de doble polo y doble tiro (DPDT) cableado en cruz o con un puente H (de relés o transistores). Un error de cableado en el cruce puede poner la pila en corto: siempre revisa el diagrama antes de conectar.',
        'Para levantar peso con hilo y carrete: torque = fuerza × radio. Un carrete de radio pequeño da más fuerza y menos velocidad. Los motorreductores pequeños (motor con caja de engranes) dan mucho más torque que un motor solo.'
      ],
      pantalla: ['Cambiar polaridad = cambiar sentido de giro', 'DPDT en cruz o puente H para invertir', 'Revisa el cruce: un error = corto en la pila', 'Torque = fuerza × radio del carrete', 'Motorreductor = más fuerza, menos velocidad'],
      clave: [['Polaridad', 'Qué terminal es positiva y cuál negativa'], ['DPDT', 'Interruptor de doble polo y doble tiro'], ['Puente H', 'Circuito que invierte la polaridad de un motor'], ['Motorreductor', 'Motor con caja de engranes']],
      ejemplo: { titulo: 'Carrete de la grúa', pasos: ['Supón un motorreductor de 0.05 N·m (revisa su ficha).', 'Carrete de radio 5 mm = 0.005 m.', 'F = T / r = 0.05 / 0.005 = 10 N ≈ 1 kg.', 'Con radio de 10 mm solo levantaría unos 500 g.'], resultado: 'Carrete chico = más fuerza. Conecta engranes (Submódulo 2) con motores (Submódulo 3).' },
      preguntas: [['¿Cómo inviertes el giro de un motor de CD?', 'Invirtiendo la polaridad (DPDT o puente H).'], ['Dos pilas AA en serie, ¿qué voltaje dan?', '3 V.'], ['¿Qué pasa si el carrete es más grande?', 'Sube más rápido, pero levanta menos peso.']],
      errores: ['Cablear mal el cruce y provocar un corto.', 'Usar un motor sin reducción para levantar peso.', 'Dejar empalmes sin aislar.'],
      vida: 'Los motores de CD con inversión están en puertas automáticas, elevadores de ventanas y robots. Es tu primer paso hacia el control de motores industriales.',
      ideas: ['inversion-giro', 'pr-phet-circuitos'], fuente: 'Bolton (2013), Mecatrónica.'
    },
    {
      id: 'sm3-fallas', sm: 'II-3', ac: 'Verifica el funcionamiento de los sistemas neumáticos, electroneumáticos, hidráulicos y electrohidráulicos', titulo: 'Diagnóstico de fallas y seguridad con fluidos', dur: '50 min',
      objetivo: 'Aplicar un método para encontrar fallas y trabajar con presión de forma segura.',
      explica: [
        'Método de diagnóstico: 1) observa y describe el síntoma; 2) propón la causa más probable; 3) prueba UNA cosa a la vez; 4) corrige; 5) registra en la bitácora. Adivinar y cambiar todo al mismo tiempo no enseña nada.',
        'Fallas típicas: fugas en conexiones; aire atrapado en un sistema hidráulico (movimiento "esponjoso": purgar); cilindro lento (estrangulador muy cerrado o poca presión); no se mueve (sin presión o válvula mal conectada); motor que no gira (pila, polaridad, falso contacto); cortocircuito (cables pelados que se tocan).',
        'Seguridad: nunca desconectes una manguera con presión (primero despresuriza), nunca apuntes aire comprimido a una persona, usa lentes y cuida la energía almacenada (resortes, cargas levantadas).'
      ],
      pantalla: ['Síntoma → hipótesis → prueba una cosa → corrige → registra', 'Hidráulico "esponjoso" = aire atrapado: purga', 'Cilindro lento = revisa reguladora y presión', 'Despresuriza antes de desconectar', 'Nunca apuntes aire a una persona'],
      clave: [['Síntoma', 'Lo que observas que está mal'], ['Causa raíz', 'El origen real de la falla'], ['Despresurizar', 'Liberar la presión antes de intervenir']],
      ejemplo: { titulo: 'La grúa no levanta', pasos: ['Síntoma: la jeringa grande no se mueve aunque empujo.', 'Hipótesis 1: manguera desconectada → revisar: está bien.', 'Hipótesis 2: aire atrapado → purgar: ahora sube, pero con poca fuerza.', 'Hipótesis 3: fuga en la unión → silicón y cincho: funciona.'], resultado: 'Tres hipótesis, una a la vez, todo registrado: eso es pensar como técnico.' },
      preguntas: [['¿Por qué probar una sola cosa a la vez?', 'Para saber cuál fue la causa real.'], ['¿Qué haces antes de desconectar una manguera?', 'Despresurizar el sistema.'], ['Un hidráulico se siente "esponjoso". ¿Causa probable?', 'Aire atrapado.']],
      errores: ['Cambiar varias cosas al mismo tiempo.', 'No registrar lo que se hizo.', 'Intervenir con presión.'],
      vida: 'El mantenimiento es una de las áreas que más técnicos contrata en el Bajío, y su habilidad principal es diagnosticar con método. Además, sirve para la vida: los problemas se resuelven igual.',
      ideas: ['bitacora-fallas', 'galeria-errores'], fuente: 'Programa SEP 2024, Submódulo 3 (pp. 43-44).'
    },

    /* ===================== FORMACIÓN INTEGRAL ===================== */
    {
      id: 'gen-mecatronica', sm: 'gen', ac: '', titulo: '¿Qué es la Mecatrónica y por qué cambia vidas?', dur: '50 min',
      objetivo: 'Despertar orgullo y visión de futuro por su carrera.',
      explica: [
        'La palabra "mecatrónica" la acuñó en 1969 Tetsuro Mori, ingeniero de la empresa japonesa Yaskawa. Nació para nombrar productos que unían mecánica y electrónica; hoy integra mecánica, electrónica, control e informática.',
        'Está en todos lados: lavadoras, autos, impresoras 3D, elevadores, la estabilización de la cámara de un celular, robots de soldadura, máquinas de empaque.',
        'El programa de la carrera prepara para puestos reales: técnicos y mecánicos en mantenimiento de maquinaria industrial, ensambladores y montadores de maquinaria, técnicos en equipos electromecánicos, entre otros. El Bajío tiene una de las concentraciones industriales más grandes del país: automotriz, autopartes, alimentos, plásticos.',
        'El mensaje central: lo que aprenden aquí les abre puertas a un trabajo digno, a seguir estudiando o a emprender.'
      ],
      pantalla: ['1969: Tetsuro Mori (Yaskawa, Japón) crea la palabra', 'Mecánica + electrónica + control + informática', 'Está en tu lavadora, tu celular y en cada planta del Bajío', 'Tu carrera abre tres caminos: trabajar · estudiar · emprender', 'Lo que construyas aquí es tuyo para siempre'],
      clave: [['Mecatrónica', 'Integración de mecánica, electrónica, control e informática'], ['Automatización', 'Hacer que una máquina trabaje sola con control'], ['Integrador', 'Empresa que diseña y arma soluciones automatizadas']],
      ejemplo: { titulo: 'Desarma con la mirada una lavadora', pasos: ['Mecánica: tambor, banda, poleas, suspensión.', 'Electrónica: tarjeta de control, sensores de nivel y de puerta.', 'Control: programa que decide cuánta agua y cuántas vueltas.', 'Informática: la pantalla y los ciclos programados.'], resultado: 'Un aparato de casa es un sistema mecatrónico completo.' },
      preguntas: [['¿Quién acuñó la palabra mecatrónica y cuándo?', 'Tetsuro Mori, de Yaskawa, en 1969.'], ['Nombra un objeto de tu casa que sea mecatrónico y explica por qué.', 'Respuesta abierta: debe tener parte mecánica, electrónica y de control.']],
      errores: ['Pensar que mecatrónica es solo robots.'],
      vida: 'Que se vean a sí mismos en 5 años: técnicos que resuelven, ganan bien y siguen creciendo. Esa visión cambia la actitud en el salón.',
      ideas: ['pr-videollamada', 'pr-carreras', 'pr-historia'], fuente: 'Fluid Power Journal, "What is Mechatronics?"; Programa SEP 2024, ocupaciones SINCO (p. 13 y ss.).'
    },
    {
      id: 'gen-mentalidad', sm: 'gen', ac: '', titulo: 'Mentalidad de crecimiento: el error es información', dur: '30 min',
      objetivo: 'Que vean el error como parte del aprendizaje (HVyT: mentalidad de crecimiento y regulación de emociones).',
      explica: [
        'La investigadora Carol Dweck (Universidad de Stanford) distingue dos formas de pensar sobre la habilidad: mentalidad fija ("soy malo para esto") y mentalidad de crecimiento ("todavía no me sale, pero puedo mejorar con práctica y buenas estrategias").',
        'La base biológica es la plasticidad del cerebro: con práctica, las conexiones que usamos se fortalecen. Un estudio nacional en Estados Unidos (Yeager y colaboradores, Nature, 2019) encontró que una intervención breve de mentalidad de crecimiento tuvo efectos modestos pero reales, mayores en estudiantes con más dificultades.',
        'En el taller se ve así: cada mecanismo que se traba es un dato, no un fracaso. El "todavía" cambia la conversación: "todavía no gira completo".',
        'Tip docente: elogia el proceso y la estrategia ("probaste tres soluciones y registraste cada una"), no el talento ("eres muy listo").'
      ],
      pantalla: ['"No me sale" → "todavía no me sale"', 'El cerebro se fortalece con práctica', 'Cada falla es un dato para la bitácora', 'Esfuerzo + estrategia + ayuda = progreso', 'Los ingenieros fallan muchas veces antes de que algo funcione'],
      clave: [['Mentalidad fija', 'Creer que la habilidad no cambia'], ['Mentalidad de crecimiento', 'Creer que la habilidad se desarrolla'], ['Plasticidad cerebral', 'Capacidad del cerebro de cambiar con la experiencia']],
      ejemplo: { titulo: 'Reescribe la frase', pasos: ['"Soy malo para FreeCAD" → "Todavía no domino las restricciones; voy a practicar con el mini-reto".', '"Mi mecanismo no sirve" → "Se traba en un punto; voy a revisar Grashof".', '"Nunca entiendo física" → "Necesito otro ejemplo: voy a preguntar".'], resultado: 'La frase cambia la acción siguiente.' },
      preguntas: [['¿Qué palabra convierte un fracaso en un proceso?', '"Todavía".'], ['Cuenta algo que antes no sabías hacer y ahora sí. ¿Qué te ayudó?', 'Respuesta abierta: práctica, ayuda, estrategia.']],
      errores: ['Confundir mentalidad de crecimiento con "solo échale ganas": también hacen falta estrategia y ayuda.'],
      vida: 'Esta forma de pensar les sirve para un examen, para un trabajo y para la vida: los problemas no los definen, los resuelven.',
      ideas: ['galeria-errores', 'pr-respira', 'pr-yo-25'], fuente: 'Dweck, C. (2006), Mindset; Yeager, D. et al. (2019), Nature 573; Programa SEP 2024, HVyT (pp. 146-149).'
    }
  ];
})(window.E);
