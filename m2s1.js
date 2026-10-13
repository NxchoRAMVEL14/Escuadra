/* Escuadra · Módulo II «Construye sistemas mecatrónicos» · Submódulo 1: Dibuja planos de elementos mecánicos (64 h).
   Temas, clases hora por hora, tareas, láminas, banco de examen, ideas, figuras y proyecto de 3er semestre. Dos caminos a la
   vez: dibujo técnico a mano en el aula (unidades, líneas, trazos, escalas, isométrico, vistas, cotas y cortes) y FreeCAD en el
   centro de cómputo (croquis con restricciones, sólidos y plano en TechDraw). Las prácticas de FreeCAD son las de Escuadra
   (practicas.js), con su plano acotado. Los temas «Leer un plano» y «Restricciones» ya venían en temas.js.
   Programa SEP 2024 (Técnico en Mecatrónica), pp. 32-35; bibliografía del módulo (Estrada y Llamas, Dibujo Técnico I);
   NOM-Z-68-1986, NOM-008-SE-2021; ISO 128, 129-1, 216, 3098, 5455, 5456, 5457 y 7200; documentación de FreeCAD. */
(function () {
  'use strict';
  const E = window.E, H = E.mods.h, f = H.f, pick = H.pick, ops = H.ops;
  const FU = 'Programa SEP 2024, Módulo II, Submódulo 1';
  const AC = ['Representa el elemento mecánico en un plano o diagrama', 'Diseña el elemento mecánico en un plano 2D y 3D'];

  /* =================== TEMAS =================== */
  const temas = [
    {
      id: 'm2-dibujo-tecnico', sm: 'II-1', ac: AC[0], titulo: 'El dibujo técnico: el idioma de la industria', dur: '50 min',
      objetivo: 'Que expliquen por qué el dibujo técnico sigue normas y preparen una lámina con formato, margen y cuadro de datos.',
      explica: [
        'Un dibujo artístico expresa; un dibujo técnico informa. Debe decir lo mismo a cualquier persona que lo lea, en cualquier planta del mundo: forma, medidas, material y tolerancias. Para eso existen normas que fijan el formato de la hoja, los tipos de línea, la rotulación, las escalas y la forma de acotar.',
        'En México, la NOM-Z-68-1986 trata las dimensiones y formatos de las láminas de dibujo, y la industria usa también las normas ISO. Los formatos de la serie A (ISO 216) guardan la misma proporción: A4 mide 210 × 297 mm, A3 297 × 420 mm y cada formato es la mitad del anterior.',
        'La lámina lleva un marco con margen de 20 mm del lado izquierdo (para engargolar o archivar) y 10 mm en los otros lados (ISO 5457). Abajo a la derecha va el cuadro de datos (ISO 7200): nombre de la pieza, quién dibujó, fecha, escala, unidades, sistema de proyección, material y número de plano.',
        'Instrumentos básicos: escuadras de 45° y de 30-60°, regla graduada o escalímetro, compás, lápices de dos durezas (2H para líneas finas y HB para las gruesas) o portaminas de 0.5 mm, y goma. En la industria casi todo se dibuja en CAD, pero el croquis a mano y saber leer un plano siguen siendo diarios.'
      ],
      pantalla: ['Dibujo técnico = información que todos leen igual', 'Normas: formato, líneas, letras, escalas y cotas', 'A4 = 210 × 297 mm · A3 = 297 × 420 mm', 'Margen: 20 mm a la izquierda, 10 mm en los demás lados', 'Cuadro de datos abajo a la derecha', 'Lápiz 2H para lo fino, HB para lo grueso'],
      clave: [['Lámina', 'Hoja de dibujo con formato, marco y cuadro de datos'], ['Formato A4', 'Hoja de 210 × 297 mm (ISO 216)'], ['Margen', 'Espacio entre la orilla de la hoja y el marco: 20 mm a la izquierda y 10 mm en los demás lados'], ['Cuadro de datos', 'Recuadro con nombre de la pieza, dibujante, escala, unidades, proyección, material y fecha'], ['Norma', 'Documento que fija cómo se hace algo para que todos lo hagan igual']],
      ejemplo: { titulo: 'Preparar una lámina A4 vertical', pasos: ['Hoja A4 vertical: 210 de ancho por 297 de alto.', 'Marco: 20 mm desde la orilla izquierda y 10 mm desde las otras tres.', 'El área de dibujo queda de 180 × 277 mm.', 'Cuadro de datos abajo a la derecha, dentro del marco, con letras de 3.5 mm.'], resultado: 'Con la misma plantilla haces todas las láminas del parcial y se ven profesionales.' },
      preguntas: [['¿Por qué el dibujo técnico sigue normas?', 'Para que cualquier persona lo lea igual y fabrique la misma pieza.'], ['¿Cuánto mide una hoja A4?', '210 × 297 mm.'], ['¿Qué margen lleva el lado izquierdo y por qué?', '20 mm, para engargolar o archivar sin tapar el dibujo.'], ['¿Qué datos lleva el cuadro de datos?', 'Pieza, dibujante, fecha, escala, unidades, sistema de proyección, material y número de plano.']],
      errores: ['Dibujar sin marco ni cuadro de datos: el plano no dice escala ni unidades.', 'Usar un solo lápiz: todas las líneas salen iguales y no se distinguen.', 'Rotular con letra cursiva o de distintos tamaños.', 'Creer que en la industria ya nadie dibuja a mano: el croquis es diario.'],
      vida: 'En las plantas del Bajío el técnico recibe planos todos los días: para fabricar, para inspeccionar o para pedir una refacción. Un plano bien leído evita piezas mal hechas y paros de línea.',
      ideas: ['m2-dictado-dibujo', 'm2-caligrafia-tecnica'], fuente: FU + ' (p. 33); NOM-Z-68-1986; ISO 216, ISO 5457 e ISO 7200; Estrada y Llamas (2012), Dibujo Técnico I.'
    },
    {
      id: 'm2-unidades', sm: 'II-1', ac: AC[0], titulo: 'Sistemas de unidades, medición y conversiones', dur: '50 min',
      objetivo: 'Que midan piezas, conviertan entre milímetros y pulgadas y expresen medidas en el sistema que pide el plano.',
      explica: [
        'En México el sistema oficial es el Sistema Internacional (NOM-008-SE-2021). En dibujo mecánico la unidad es el milímetro: los planos escriben solo el número (80, no 80 mm) y lo aclaran una vez en el cuadro de datos: «Medidas en mm».',
        'Aun así convive el sistema inglés: tubería, tornillería, llaves, brocas y muchas máquinas de origen estadounidense usan pulgadas. La conversión es exacta: 1 in = 25.4 mm. Las pulgadas fraccionarias se convierten así: 3/8 in = 3 ÷ 8 × 25.4 = 9.525 mm.',
        'Para medir se usa el instrumento adecuado: flexómetro para lo grande, regla para lo que cabe en ella y vernier (calibrador) para piezas pequeñas, diámetros y profundidades. El vernier común lee 0.05 mm o 0.02 mm en su escala métrica y 1/128 in o 0.001 in en la inglesa.',
        'Prefijos útiles: 1 m = 1000 mm, 1 cm = 10 mm. Antes de dibujar, todas las medidas se pasan a una sola unidad; mezclar centímetros y milímetros es el error más común.'
      ],
      pantalla: ['En el plano: milímetros, sin escribir «mm» en cada cota', '1 in = 25.4 mm (exacto)', '3/8 in = 3 ÷ 8 × 25.4 = 9.525 mm', '1 m = 1000 mm · 1 cm = 10 mm', 'Vernier: piezas chicas, diámetros y profundidades', 'Todo a una sola unidad antes de dibujar'],
      clave: [['SI', 'Sistema Internacional de Unidades; el oficial en México (NOM-008-SE-2021)'], ['Milímetro', 'Unidad de los planos mecánicos'], ['Pulgada (in)', 'Unidad inglesa: 25.4 mm exactos'], ['Pulgada fraccionaria', 'Medida en fracciones como 1/4, 3/8 o 1/2 in'], ['Vernier', 'Calibrador que mide exteriores, interiores y profundidades con precisión de 0.05 o 0.02 mm']],
      ejemplo: { titulo: 'Un tornillo de 1/4 in en un plano métrico', pasos: ['1/4 in = 1 ÷ 4 × 25.4 = 6.35 mm.', 'El barreno de paso para ese tornillo suele ser un poco mayor: 6.5 o 7 mm.', 'En el plano se escribe Ø7 y en el cuadro de datos «Medidas en mm».'], resultado: 'Conviertes una vez, dibujas en milímetros y nadie se confunde.' },
      preguntas: [['¿Cuántos mm tiene una pulgada?', '25.4 mm exactos.'], ['¿Cuánto mide en mm una broca de 1/2 in?', '12.7 mm.'], ['¿Por qué no se escribe «mm» en cada cota?', 'Porque el cuadro de datos aclara una vez que las medidas están en mm.'], ['¿Qué instrumento usas para medir el diámetro de un barreno de 8 mm?', 'El vernier, con sus puntas de interiores.']],
      errores: ['Multiplicar por 2.54 en vez de 25.4: eso da centímetros.', 'Mezclar cm y mm en el mismo dibujo.', 'Leer el vernier sin cerrar antes para ver que marque cero.', 'Redondear 9.525 a 10 en una pieza que debe ajustar.'],
      vida: 'En mantenimiento llegan máquinas de Estados Unidos, Japón y Alemania: saber convertir y medir bien es la diferencia entre pedir la refacción correcta o esperar otra semana.',
      ideas: ['m2-carrera-conversiones', 'pr-plickers'], fuente: FU + ' (p. 33); NOM-008-SE-2021, Sistema general de unidades de medida (el programa SEP cita la NOM-008-SCFI-2002, sustituida por la NOM-008-SE-2021 desde junio de 2024).'
    },
    {
      id: 'm2-lineas', sm: 'II-1', ac: AC[0], titulo: 'Alfabeto de líneas y rotulación', dur: '50 min',
      objetivo: 'Que usen cada tipo de línea con su significado y rotulen con letra normalizada.',
      explica: [
        'En un plano cada línea tiene un significado fijo (ISO 128). Se usan dos grosores en proporción 2:1, por ejemplo 0.5 mm la gruesa y 0.25 mm la fina. A mano se logra con dos lápices: HB para lo grueso y 2H para lo fino.',
        'Continua gruesa: contornos y aristas visibles. Continua fina: líneas de cota, líneas auxiliares, líneas de referencia y rayado de cortes. Discontinua fina (trazos cortos): aristas ocultas. Trazo largo y punto fina: ejes de simetría y centros de barrenos. A mano alzada o en zigzag: líneas de rotura de una vista parcial.',
        'Cuando dos líneas caen en el mismo lugar manda la más importante: visible sobre oculta, y oculta sobre eje.',
        'La rotulación normalizada (ISO 3098) usa letras de alturas fijas: 2.5, 3.5, 5, 7 y 10 mm. En una lámina A4 lo común es 5 mm para títulos y 3.5 mm para cotas y notas, en mayúsculas, rectas o inclinadas a 75°, siempre entre líneas guía tenues.'
      ],
      pantalla: ['Dos grosores: gruesa = 2 × fina', 'Continua gruesa: lo que se ve', 'Continua fina: cotas, auxiliares, rayado', 'Discontinua: lo que está oculto', 'Trazo y punto: ejes y centros', 'Letras de 5 y 3.5 mm entre líneas guía'],
      clave: [['Línea visible', 'Continua gruesa: contornos y aristas que se ven'], ['Línea oculta', 'Discontinua fina: aristas que quedan detrás'], ['Línea de eje', 'Trazo largo y punto: ejes de simetría y centros de barrenos'], ['Línea de cota', 'Continua fina con flechas; lleva la medida'], ['Rotulación', 'Letras y números normalizados para títulos, cotas y notas']],
      ejemplo: { titulo: 'Una placa con un barreno en una vista', pasos: ['Contorno exterior y círculo del barreno: continua gruesa.', 'Cruz de centro del barreno: trazo largo y punto, saliendo unos 3 mm del círculo.', 'En la vista de lado, el barreno se ve como dos líneas discontinuas.', 'Cotas con continua fina y número de 3.5 mm.'], resultado: 'Cualquier técnico entiende al instante qué es contorno, qué es hueco y dónde está el centro.' },
      preguntas: [['¿Qué línea representa una arista oculta?', 'La discontinua fina.'], ['¿Para qué sirve la línea de trazo largo y punto?', 'Para ejes de simetría y centros de barrenos.'], ['¿Qué relación de grosor hay entre la línea gruesa y la fina?', '2 a 1.'], ['Si una arista visible coincide con un eje, ¿cuál dibujas?', 'La visible.']],
      errores: ['Dibujar todo con la misma presión de lápiz.', 'Ejes que no sobresalen del círculo o que terminan en punto en vez de trazo.', 'Discontinuas con trazos de distinto largo.', 'Letras sin líneas guía: cambian de tamaño.'],
      vida: 'Los inspectores de calidad leen el plano para saber qué medir. Una línea oculta confundida con una visible puede hacer que rechacen piezas buenas o acepten piezas malas.',
      ideas: ['m2-caligrafia-tecnica', 'pr-error-del-dia'], fuente: FU + ' (p. 33); ISO 128 (líneas) e ISO 3098 (rotulación); Estrada y Llamas (2012), Dibujo Técnico I.'
    },
    {
      id: 'm2-geometria', sm: 'II-1', ac: AC[0], titulo: 'Trazos geométricos para piezas mecánicas', dur: '50 min',
      objetivo: 'Que tracen perpendiculares, paralelas, mediatrices, polígonos y enlaces tangentes con escuadras y compás.',
      explica: [
        'Las piezas mecánicas se forman con rectas y arcos: placas, ranuras, eslabones, llaves y levas. Antes de dibujarlas hay que dominar unos cuantos trazos: paralela y perpendicular con las dos escuadras, mediatriz con el compás, división de un segmento en partes iguales y polígonos regulares.',
        'Hexágono regular: su lado mide lo mismo que el radio de la circunferencia que lo encierra. Con el compás abierto al radio se marcan 6 puntos sobre la circunferencia y se unen. Así se dibujan tuercas y cabezas de tornillo.',
        'Tangencia: una recta es tangente a un círculo cuando lo toca en un solo punto, y en ese punto es perpendicular al radio. Dos circunferencias son tangentes cuando sus centros y el punto de contacto están alineados.',
        'Enlace: unir dos rectas (o una recta y un arco) con un arco de radio dado, sin escalón. El centro del arco de enlace está a la distancia del radio de las dos líneas que une. Es el redondeo de las esquinas de una pieza, el mismo que hace FreeCAD con Fillet.'
      ],
      pantalla: ['Paralelas y perpendiculares: dos escuadras', 'Mediatriz: dos arcos desde los extremos', 'Hexágono: lado = radio', 'Tangente: perpendicular al radio en el punto de contacto', 'Enlace: centro a distancia r de las dos líneas', 'Redondeo a mano = Fillet en FreeCAD'],
      clave: [['Mediatriz', 'Recta perpendicular a un segmento por su punto medio'], ['Tangente', 'Recta que toca a un círculo en un solo punto'], ['Punto de tangencia', 'Donde se tocan; ahí la recta es perpendicular al radio'], ['Enlace', 'Arco que une dos líneas sin escalón'], ['Polígono regular', 'Lados y ángulos iguales; el hexágono tiene lado igual al radio']],
      ejemplo: { titulo: 'Redondear la esquina de una placa con R10', pasos: ['Traza una paralela a cada lado de la esquina, a 10 mm hacia adentro.', 'Donde se cruzan está el centro del arco.', 'Desde el centro, perpendiculares a cada lado: ahí están los puntos de tangencia.', 'Traza el arco de R10 entre los dos puntos y borra la esquina.'], resultado: 'La esquina queda redonda y sin escalón, igual que en la pieza real.' },
      preguntas: [['¿Cuánto mide el lado de un hexágono inscrito en una circunferencia de radio 20?', '20 mm: el lado es igual al radio.'], ['¿Cómo es una tangente respecto al radio en el punto de contacto?', 'Perpendicular.'], ['¿Dónde está el centro de un arco de enlace de radio r entre dos rectas?', 'Donde se cruzan las paralelas trazadas a distancia r de cada recta.'], ['¿Qué herramienta de FreeCAD hace lo mismo que un enlace en una arista?', 'Fillet (redondeo).']],
      errores: ['Buscar el punto de tangencia «a ojo»: queda un escalón.', 'Mover la escuadra que sirve de guía al trazar paralelas.', 'Abrir el compás de más al marcar el hexágono: no cierra.', 'Borrar las construcciones antes de remarcar.'],
      vida: 'Los perfiles de levas, ganchos, llaves y eslabones se fabrican con cortes que siguen exactamente estos enlaces. Una tangencia mal trazada se nota en la pieza como un escalón donde se concentra el esfuerzo.',
      ideas: ['pr-error-del-dia', 'm2-galeria-laminas'], fuente: FU + ' (p. 33); Estrada y Llamas (2012), Dibujo Técnico I (construcciones geométricas).'
    },
    {
      id: 'm2-escalas', sm: 'II-1', ac: AC[0], titulo: 'Escalas: dibujar grande lo pequeño y pequeño lo grande', dur: '50 min',
      objetivo: 'Que elijan la escala normalizada adecuada y calculen medidas en el papel y reales.',
      explica: [
        'La escala es la relación entre la medida en el dibujo y la medida real: dibujo : real. 1:1 es tamaño natural; 1:2, 1:5 y 1:10 son de reducción (el dibujo es más pequeño); 2:1, 5:1 y 10:1 son de ampliación (el dibujo es más grande). Las escalas recomendadas están en ISO 5455.',
        'Medida en el papel = medida real × (primer número ÷ segundo número). A 1:5, una pieza de 300 mm se dibuja de 60 mm; a 2:1, una pieza de 15 mm se dibuja de 30 mm.',
        'Regla de oro: las cotas siempre dicen la medida REAL, aunque el dibujo esté a escala. Quien fabrica no mide el papel: lee la cota.',
        'Para elegir la escala: calcula el área útil de la lámina (sin cotas ni cuadro de datos) y busca la mayor escala normalizada con la que la pieza y su espacio para cotas quepan. Si hay detalles muy pequeños, se agrega una vista de detalle a otra escala.'
      ],
      pantalla: ['Escala = dibujo : real', 'Reducción: 1:2 · 1:5 · 1:10', 'Ampliación: 2:1 · 5:1 · 10:1', 'Papel = real × (1.º ÷ 2.º)', 'La cota siempre dice la medida REAL', 'Elige la mayor escala que quepa'],
      clave: [['Escala natural', '1:1, el dibujo mide lo mismo que la pieza'], ['Escala de reducción', '1:n; el dibujo es n veces más pequeño'], ['Escala de ampliación', 'n:1; el dibujo es n veces más grande'], ['Escalímetro', 'Regla con varias escalas impresas para medir sin hacer cuentas'], ['Vista de detalle', 'Parte ampliada de un dibujo para ver algo pequeño']],
      ejemplo: { titulo: 'Una placa de 360 × 150 en una lámina A4', pasos: ['Área útil aproximada de una A4 vertical para una vista con cotas: 160 × 200 mm.', 'A 1:1 no cabe (360 > 160). A 1:2 mide 180: tampoco.', 'A 1:5 mide 72 × 30: cabe con espacio para cotas.', 'En las cotas escribes 360 y 150; en el cuadro de datos, «Escala 1:5».'], resultado: 'La escala es para que quepa; la cota es para fabricar.' },
      preguntas: [['¿Qué significa la escala 1:5?', 'Que 1 mm del dibujo representa 5 mm reales: el dibujo es 5 veces más pequeño.'], ['Una pieza de 12 mm a escala 5:1, ¿cuánto mide en el papel?', '60 mm.'], ['En un plano a 1:2 una línea mide 45 mm. ¿Cuánto mide la pieza?', '90 mm.'], ['¿Qué número escribes en la cota de una pieza de 300 mm dibujada a 1:5?', '300.']],
      errores: ['Escribir en la cota lo que mide el papel.', 'Invertir la escala: 2:1 no reduce, amplía.', 'Usar escalas raras como 1:3 o 1:7 en lugar de las normalizadas.', 'No anotar la escala en el cuadro de datos.'],
      vida: 'Los planos de una nave industrial van a 1:100; los de una pieza de reloj o un conector a 5:1 o 10:1. Un error de escala en una plantilla de corte desperdicia todo el material.',
      ideas: ['m2-escala-salon', 'pantografo'], fuente: FU + ' (p. 33); ISO 5455 (escalas); NOM-Z-68-1986.'
    },
    {
      id: 'm2-isometrico', sm: 'II-1', ac: AC[0], titulo: 'Dibujo isométrico', dur: '50 min',
      objetivo: 'Que dibujen piezas en isométrico con medidas reales sobre los ejes, caras inclinadas y círculos.',
      explica: [
        'El isométrico muestra la pieza en tres dimensiones en un solo dibujo: tres ejes separados 120°, uno vertical y dos a 30° de la horizontal. Se traza con la escuadra de 30-60° apoyada en una regla horizontal.',
        'En el dibujo isométrico se miden las longitudes reales sobre los ejes y sobre las líneas paralelas a ellos (en la proyección isométrica teórica se reducen a 0.816, pero para dibujar se usa el tamaño real). Las líneas que no son paralelas a los ejes, como las de una cara inclinada, no se miden: se ubican sus extremos y se unen.',
        'Método de la caja: se dibuja una caja con el largo, ancho y alto totales de la pieza y luego se recorta, como si se tallara. Las aristas que son paralelas en la pieza son paralelas en el dibujo.',
        'Los círculos se ven como elipses. A mano se trazan con el método de cuatro centros: se dibuja el rombo del tamaño del diámetro sobre la cara, y con cuatro arcos tangentes a sus lados se forma la elipse. En isométrico normalmente no se dibujan las aristas ocultas.'
      ],
      pantalla: ['Ejes a 120°: uno vertical, dos a 30°', 'Medidas reales sobre los ejes', 'Líneas inclinadas: ubica extremos y une', 'Método de la caja: dibuja y recorta', 'Círculo → elipse por cuatro centros', 'Sin aristas ocultas'],
      clave: [['Isométrico', 'Dibujo en 3D con ejes a 120° y medidas reales sobre ellos'], ['Línea isométrica', 'Paralela a uno de los tres ejes; se mide directo'], ['Línea no isométrica', 'Inclinada respecto a los ejes; se ubica por sus extremos'], ['Método de la caja', 'Encerrar la pieza en una caja y recortar'], ['Elipse isométrica', 'Cómo se ve un círculo en isométrico']],
      ejemplo: { titulo: 'Bloque escalonado de 60 × 40 × 30', pasos: ['Caja de 60 de largo, 40 de fondo y 30 de alto.', 'Escalón: al frente baja a 15 de alto en los primeros 20 de fondo.', 'Barreno Ø10 en el escalón: rombo de 10 × 10 sobre la cara de arriba y elipse por cuatro centros.', 'Remarca solo lo visible.'], resultado: 'Un solo dibujo dice cómo es la pieza; las vistas dirán sus medidas exactas.' },
      preguntas: [['¿Qué ángulo forman los ejes isométricos con la horizontal?', '30°.'], ['¿Se miden longitudes reales en una arista inclinada?', 'No: se ubican sus extremos sobre líneas paralelas a los ejes y se unen.'], ['¿Cómo se ve un círculo en isométrico?', 'Como una elipse.'], ['¿Para qué sirve el método de la caja?', 'Para dibujar primero el volumen total y recortar lo que sobra.']],
      errores: ['Usar la escuadra de 45° en lugar de la de 30-60°.', 'Medir la arista inclinada directo.', 'Dibujar círculos redondos en las caras.', 'Perder el paralelismo: el bloque «se abre» como abanico.'],
      vida: 'Los manuales de ensamble, los catálogos de refacciones y las instrucciones de trabajo de las plantas usan isométricos porque cualquiera entiende la pieza de un vistazo.',
      ideas: ['m2-cubos-iso', 'm2-pieza-misteriosa'], fuente: FU + ' (p. 33); Estrada y Llamas (2012), Dibujo Técnico I (dibujo isométrico).'
    },
    {
      id: 'm2-vistas', sm: 'II-1', ac: AC[0], titulo: 'Proyección ortogonal: vistas en primer y tercer diedro', dur: '50 min',
      objetivo: 'Que obtengan y acomoden las vistas de una pieza en primer diedro y reconozcan el tercero.',
      explica: [
        'Proyectar ortogonalmente es mirar la pieza de frente a cada cara, con rayos paralelos: así cada vista muestra medidas verdaderas. Las principales son frontal (alzado), superior (planta) y lateral (perfil). Se elige como frontal la que más dice de la forma.',
        'Primer diedro (método europeo, ISO-E): la pieza está entre el observador y el plano. La vista superior se dibuja abajo del frente y la lateral izquierda (vista desde la izquierda) se dibuja a la derecha del frente. Es el que usan las prácticas de FreeCAD de Escuadra.',
        'Tercer diedro (método americano, ISO-A): el plano está entre el observador y la pieza. La vista superior va arriba del frente y la lateral derecha a la derecha. Es común en planos de Estados Unidos. Los dos métodos se reconocen por su símbolo (un cono truncado y sus círculos), que va en el cuadro de datos (ISO 5456).',
        'Las vistas se alinean: frente y superior comparten el largo; frente y lateral comparten la altura; superior y lateral comparten el fondo. En cada vista, lo que no se ve se dibuja con línea oculta y los ejes con trazo y punto.'
      ],
      pantalla: ['Vistas = mirar de frente cada cara', 'Frontal: la que más dice de la pieza', 'Primer diedro: superior abajo, lateral izquierda a la derecha', 'Tercer diedro: superior arriba, lateral derecha a la derecha', 'Símbolo del método en el cuadro de datos', 'Largo, alto y fondo alineados entre vistas'],
      clave: [['Proyección ortogonal', 'Representación con rayos perpendiculares al plano; medidas verdaderas'], ['Vista frontal (alzado)', 'La pieza vista de frente'], ['Vista superior (planta)', 'La pieza vista desde arriba'], ['Primer diedro', 'Método europeo ISO-E: la superior va abajo del frente'], ['Tercer diedro', 'Método americano ISO-A: la superior va arriba del frente']],
      ejemplo: { titulo: 'Bloque escalonado en primer diedro', pasos: ['Frente: rectángulo de 60 × 30 con una línea a 15 de altura (el escalón).', 'Superior, abajo del frente: rectángulo de 60 × 40, la línea del escalón a 20 y el círculo del barreno Ø10.', 'Lateral izquierda, a la derecha del frente: perfil en L de 40 × 30 con el escalón.', 'El barreno aparece como líneas ocultas en el frente y en la lateral.'], resultado: 'Con tres vistas alineadas y sus cotas, la pieza queda definida sin ambigüedad.' },
      preguntas: [['En primer diedro, ¿dónde va la vista superior?', 'Abajo de la vista frontal.'], ['En tercer diedro, ¿dónde va la vista superior?', 'Arriba de la vista frontal.'], ['¿Qué medida comparten la vista frontal y la superior?', 'El largo.'], ['¿Cómo sabes con qué método está hecho un plano?', 'Por el símbolo del cono truncado en el cuadro de datos.']],
      errores: ['Mezclar métodos en el mismo plano.', 'Vistas sin alinear: no se puede trasladar medidas.', 'Olvidar las líneas ocultas de los barrenos.', 'Elegir como frente la vista con menos información.'],
      vida: 'Un técnico en una planta con clientes de Estados Unidos y de Europa recibe planos en los dos métodos. Leer mal el método es fabricar la pieza al revés.',
      ideas: ['m2-caja-proyeccion', 'm2-pieza-misteriosa'], fuente: FU + ' (p. 33); ISO 5456 (métodos de proyección) e ISO 128 (vistas); Estrada y Llamas (2012), Dibujo Técnico I.'
    },
    {
      id: 'm2-acotacion', sm: 'II-1', ac: AC[0], titulo: 'Acotación: las medidas que necesita el taller', dur: '50 min',
      objetivo: 'Que acoten piezas con todas las medidas necesarias, sin repetir y siguiendo las reglas de la norma.',
      explica: [
        'Una cota tiene cuatro elementos: líneas auxiliares (salen de la pieza con un pequeño espacio y pasan unos 2 mm de la línea de cota), línea de cota (paralela a lo que se mide), flechas o terminaciones, y la cifra de cota encima de la línea, legible desde abajo o desde la derecha (ISO 129-1).',
        'Reglas: cada medida aparece una sola vez, en la vista que mejor muestra la forma; las cotas van fuera del contorno, las más cortas cerca de la pieza y las largas afuera para que no se crucen; no se acota sobre líneas ocultas ni se usan aristas o ejes como líneas de cota.',
        'Símbolos: Ø diámetro (barrenos y piezas redondas), R radio (arcos y redondeos), □ cuadrado. Los barrenos se ubican por su centro. Si hay varios iguales: «4× Ø6».',
        'Acotación en cadena: una tras otra; los errores se acumulan. En paralelo (desde una base o referencia): todas desde la misma orilla; cada medida es independiente y es la preferida para ubicar barrenos. Se pueden combinar.'
      ],
      pantalla: ['Auxiliar · línea de cota · flechas · cifra', 'Cada medida una sola vez', 'Cotas afuera; cortas adentro, largas afuera', 'Ø diámetro · R radio · 4× Ø6', 'En cadena: los errores se suman', 'En paralelo: todas desde una referencia'],
      clave: [['Cota', 'Medida escrita en el plano con sus líneas y flechas'], ['Línea auxiliar', 'Línea fina que sale de la pieza para llevar la cota afuera'], ['Cifra de cota', 'Número con la medida real'], ['Acotación en cadena', 'Cotas una tras otra; se acumulan errores'], ['Acotación en paralelo', 'Todas las cotas desde una misma referencia']],
      ejemplo: { titulo: 'Placa de 80 × 40 con dos barrenos', pasos: ['Cotas totales: 80 de largo y 40 de alto, por fuera.', 'Barrenos desde el borde izquierdo (en paralelo): 12 y 68.', 'Altura de los centros: 20 desde abajo, una sola vez.', 'Diámetro: «2× Ø8» con línea de referencia.'], resultado: 'Con 5 cotas el taller fabrica la placa sin preguntar nada.' },
      preguntas: [['¿Dónde se colocan las cotas?', 'Fuera del contorno, sin cruzarse, las cortas cerca de la pieza.'], ['¿Qué significa «4× Ø6»?', 'Cuatro barrenos de 6 mm de diámetro.'], ['¿Por qué se prefiere acotar en paralelo los barrenos?', 'Porque cada medida es independiente y los errores no se acumulan.'], ['¿Se puede repetir una cota en dos vistas?', 'No: cada medida aparece una sola vez.']],
      errores: ['Cotas cruzadas o encima de la pieza.', 'Repetir la misma medida en dos vistas.', 'Acotar un barreno por su orilla en vez de por su centro.', 'Escribir R en un barreno completo (es Ø).'],
      vida: 'En control de calidad se mide exactamente lo que dice el plano. Una cota que falta obliga a llamar al ingeniero; una cota repetida y distinta para la línea entera.',
      ideas: ['m2-error-plano', 'pr-error-del-dia'], fuente: FU + ' (p. 33); ISO 129-1 (acotación); Estrada y Llamas (2012), Dibujo Técnico I.'
    },
    {
      id: 'm2-cortes', sm: 'II-1', ac: AC[0], titulo: 'Cortes y secciones', dur: '50 min',
      objetivo: 'Que representen el interior de una pieza con un corte en lugar de muchas líneas ocultas.',
      explica: [
        'Cuando una pieza tiene huecos interiores (bujes, poleas, tapas), sus vistas se llenan de líneas ocultas difíciles de leer. Un corte imagina la pieza partida por un plano y quita la parte que estorba: lo de adentro se ve con línea visible.',
        'El plano de corte se indica en otra vista con una línea de trazo largo y punto, con extremos gruesos, flechas que señalan hacia dónde se mira y letras: «A-A». La vista cortada se titula igual: «Corte A-A».',
        'Las superficies que tocó el corte se rayan con líneas finas a 45°, todas en la misma dirección y con la misma separación en una pieza. Los huecos no se rayan. Si hay dos piezas en contacto, cada una lleva rayado en dirección distinta.',
        'Tipos comunes: corte total (atraviesa toda la pieza), medio corte (en piezas simétricas: media vista exterior y medio corte) y sección (solo la superficie cortada, por ejemplo de un brazo o una viga). Ejes, tornillos y pasadores macizos no se cortan a lo largo.'
      ],
      pantalla: ['Corte = partir la pieza para ver adentro', 'Plano de corte: trazo y punto, extremos gruesos, flechas y letras', 'Rayado fino a 45° solo donde hay material', 'Huecos sin rayar', 'Corte total · medio corte · sección', 'Ejes y tornillos no se cortan a lo largo'],
      clave: [['Corte', 'Vista de la pieza partida por un plano imaginario'], ['Plano de corte', 'Por dónde se parte la pieza; se marca con letras A-A'], ['Rayado', 'Líneas finas a 45° en la superficie cortada'], ['Medio corte', 'Mitad en vista y mitad en corte, para piezas simétricas'], ['Sección', 'Solo la superficie que tocó el corte']],
      ejemplo: { titulo: 'Buje con barreno escalonado', pasos: ['En la vista de frente, el interior serían 6 líneas ocultas.', 'Se corta por el eje: plano A-A marcado en la vista superior.', 'En el «Corte A-A» los escalones del barreno se ven como líneas visibles.', 'Las dos paredes cortadas se rayan a 45°; el hueco queda en blanco.'], resultado: 'Un vistazo basta para ver los diámetros y profundidades interiores.' },
      preguntas: [['¿Para qué sirve un corte?', 'Para ver el interior de una pieza sin llenar la vista de líneas ocultas.'], ['¿Qué superficies se rayan?', 'Solo las que tocó el plano de corte (donde hay material).'], ['¿Cómo se indica el plano de corte?', 'Con trazo largo y punto, extremos gruesos, flechas y letras (A-A).'], ['¿Se corta a lo largo un tornillo?', 'No: ejes, tornillos y pasadores macizos se dibujan sin cortar.']],
      errores: ['Rayar también los huecos.', 'Cambiar la dirección del rayado dentro de la misma pieza.', 'Olvidar las letras y flechas del plano de corte.', 'Seguir dibujando líneas ocultas en la vista cortada.'],
      vida: 'Los planos de carcasas, bombas, válvulas y cilindros neumáticos se leen casi siempre en corte; es justo lo que verás en el Submódulo 3.',
      ideas: ['m2-pieza-misteriosa'], fuente: FU + ' (p. 33); ISO 128 (cortes, secciones y rayados); Estrada y Llamas (2012), Dibujo Técnico I.'
    },
    {
      id: 'm2-freecad-entorno', sm: 'II-1', ac: AC[1], titulo: 'FreeCAD: entorno y diseño paramétrico', dur: '50 min',
      objetivo: 'Que se muevan en FreeCAD (bancos, árbol, vista 3D y unidades) y entiendan qué es un modelo paramétrico.',
      explica: [
        'FreeCAD es un programa de CAD (diseño asistido por computadora) libre y gratuito, para Windows, Mac y Linux. Funciona por bancos de trabajo: Sketcher para croquis 2D, Part Design para piezas sólidas, TechDraw para planos y Assembly para ensambles. En esta clase se usa la versión 1.0 o más nueva.',
        'Pantalla: a la izquierda la vista combinada con el árbol del modelo (cada croquis y operación, en orden) y las propiedades; al centro la vista 3D; arriba las barras del banco activo. El árbol es la historia de la pieza: se puede volver a cualquier paso y cambiarlo.',
        'Antes de empezar: Editar → Preferencias → General → Unidades, sistema estándar (mm). Navegación: rueda para acercar, botón de en medio para mover; el cubo de la esquina o las teclas 0 a 6 cambian a vistas isométrica, frente, superior, lateral.',
        'Paramétrico quiere decir que la pieza se construye con medidas y reglas, no con trazos sueltos. Si el cliente pide la placa 5 mm más larga, cambias un número y todo se actualiza. El flujo en Part Design es: Body (cuerpo) → Sketch (croquis) totalmente restringido → operación (Pad, Pocket, Revolution…) → más croquis y operaciones.'
      ],
      pantalla: ['CAD libre: FreeCAD 1.0 o más nuevo', 'Bancos: Sketcher · Part Design · TechDraw · Assembly', 'Árbol del modelo = historia de la pieza', 'Unidades: Editar → Preferencias → General → Unidades', 'Paramétrico: cambias un número y todo se actualiza', 'Body → Sketch → Pad / Pocket → …'],
      clave: [['CAD', 'Diseño asistido por computadora'], ['Banco de trabajo', 'Conjunto de herramientas para una tarea (croquis, piezas, planos)'], ['Árbol del modelo', 'Lista ordenada de croquis y operaciones de la pieza'], ['Body', 'Cuerpo: contenedor de una pieza sólida en Part Design'], ['Paramétrico', 'Modelo definido por medidas y reglas que se pueden cambiar']],
      ejemplo: { titulo: 'La placa de montaje en cinco pasos', pasos: ['Part Design → Create body.', 'Create sketch en el plano XY: rectángulo y dos círculos.', 'Restricciones hasta que el croquis quede totalmente restringido.', 'Pad de 5 mm: los círculos quedan como barrenos.', 'Doble clic en la cota de 80 → 100: la placa se alarga sola.'], resultado: 'En 10 minutos tienes una pieza que se puede cambiar en 10 segundos.' },
      preguntas: [['¿Qué banco de trabajo usas para hacer una pieza sólida?', 'Part Design.'], ['¿Dónde configuras que FreeCAD trabaje en milímetros?', 'Editar → Preferencias → General → Unidades.'], ['¿Qué muestra el árbol del modelo?', 'Los croquis y operaciones de la pieza en el orden en que se hicieron.'], ['¿Qué ventaja tiene un modelo paramétrico?', 'Se cambia una medida y todo se actualiza sin redibujar.']],
      errores: ['Dibujar sin crear antes el Body.', 'Trabajar en pulgadas sin darse cuenta.', 'Guardar con nombres como «nuevo1»: luego nadie encuentra el archivo.', 'Borrar una operación del árbol y perder lo que dependía de ella.'],
      vida: 'Las áreas de ingeniería de las plantas modifican piezas cada semana; los modelos paramétricos les ahorran horas. FreeCAD te deja practicar en casa lo mismo que se usa en software comercial.',
      ideas: ['pr-freecad-espejo', 'mini-retos'], fuente: FU + ' (p. 34); documentación oficial de FreeCAD (wiki.freecad.org: Getting started, Part Design, Sketcher).'
    },
    {
      id: 'm2-modelado-3d', sm: 'II-1', ac: AC[1], titulo: 'Método de elaboración de un modelo 3D', dur: '50 min',
      objetivo: 'Que decidan el orden de operaciones para modelar una pieza y elijan entre extrusión, revolución, vaciado, redondeo y chaflán.',
      explica: [
        'Antes de abrir FreeCAD conviene planear: ¿cuál es la forma principal de la pieza? Si es un perfil que se repite a lo largo, se extruye (Pad). Si es redonda, se dibuja medio perfil y se gira (Revolution). Lo que se quita (barrenos, ranuras, cajas) se hace con Pocket.',
        'En el programa SEP aparece el «vaciado». En FreeCAD hay dos ideas: quitar material con un croquis (Pocket, que en español a veces se traduce como vaciado o cajera) y ahuecar una pieza dejando paredes de cierto espesor (Thickness, lo que en otros programas se llama «vaciado» o «shell»). Con Thickness se hace una caja o una carcasa de pared delgada.',
        'Los detalles van al final: redondeos (Fillet) y chaflanes (Chamfer) en aristas, y patrones (Polar pattern, Linear pattern) para repetir barrenos. Así, si cambia la forma principal, los detalles no se rompen.',
        'Método recomendado: 1) forma principal; 2) operaciones que quitan material; 3) detalles; 4) revisar medidas contra el croquis; 5) plano. Cada croquis totalmente restringido y anclado al origen. Escribe el plan en la libreta antes de modelar.'
      ],
      pantalla: ['1. Forma principal: Pad o Revolution', '2. Quitar material: Pocket', 'Vaciado: Pocket (quita) o Thickness (ahueca)', '3. Detalles al final: Fillet, Chamfer, patrones', '4. Revisa medidas · 5. Plano', 'Planea en la libreta antes de modelar'],
      clave: [['Pad', 'Extrusión: le da espesor a un croquis'], ['Pocket', 'Quita material con la forma de un croquis'], ['Revolution', 'Gira un perfil alrededor de un eje: piezas redondas'], ['Thickness', 'Ahueca un sólido dejando paredes de espesor fijo'], ['Fillet · Chamfer', 'Redondeo y chaflán de aristas']],
      ejemplo: { titulo: 'Plan de modelado de una polea', pasos: ['Forma principal redonda → Revolution de medio perfil (con el canal en V ya dibujado).', 'Barreno central: ya incluido en el perfil (no llega al eje).', 'Detalle: chaflán de 0.5 mm en las orillas.', 'Revisión: Ø exterior, Ø del fondo del canal y ancho.'], resultado: 'Una sola operación principal y un detalle: modelo rápido y fácil de cambiar.' },
      preguntas: [['¿Qué operación usas para una pieza redonda como una polea?', 'Revolution.'], ['¿Qué diferencia hay entre Pocket y Thickness?', 'Pocket quita material con un croquis; Thickness ahueca la pieza dejando paredes de espesor fijo.'], ['¿Por qué los redondeos se hacen al final?', 'Para que no se rompan si cambia la forma principal.'], ['¿Qué haces antes de abrir FreeCAD?', 'Plano o croquis y el orden de operaciones en la libreta.']],
      errores: ['Modelar una pieza redonda con muchos Pad apilados.', 'Poner redondeos al principio y que fallen al cambiar una medida.', 'Dibujar el perfil completo para Revolution: sale doble.', 'Hacer cada barreno en un croquis distinto cuando un patrón bastaba.'],
      vida: 'En diseño se revisa el árbol de operaciones de los demás. Un modelo bien ordenado lo puede modificar cualquier compañero; uno desordenado hay que rehacerlo.',
      ideas: ['m2-pieza-misteriosa', 'mini-retos'], fuente: FU + ' (p. 34); documentación oficial de FreeCAD (Part Design: Pad, Pocket, Revolution, Thickness, Fillet, Chamfer).'
    },
    {
      id: 'm2-techdraw', sm: 'II-1', ac: AC[1], titulo: 'Del modelo al plano: TechDraw', dur: '50 min',
      objetivo: 'Que obtengan el plano de un modelo 3D con vistas, cotas, escala, material y cuadro de datos, y lo exporten a PDF.',
      explica: [
        'TechDraw es el banco de FreeCAD para planos. Las vistas salen del modelo 3D, así que si cambias la pieza el plano se actualiza. Flujo: Insert Default Page (hoja con cuadro de datos) → seleccionar el Body → Insert Projection Group (frente, superior, lateral) → cotas → llenar el cuadro de datos → Export Page as PDF.',
        'En el grupo de proyección se elige el método (Projection Type: First angle o Third angle) y la escala. Escuadra usa primer diedro, igual que en las láminas a mano. Se puede agregar una vista isométrica chica para entender la pieza.',
        'Las cotas se colocan seleccionando aristas o círculos en las vistas: longitud, diámetro, radio o ángulo. Valen las mismas reglas que a mano: cada medida una vez, afuera de la pieza y sin cruzarse.',
        'Para imprimir a escala hay que imprimir al 100 % (tamaño real), nunca «ajustar a la página». Comprobación rápida: mide con regla una cota grande en el papel; si dice 80 y mide 80 mm (a 1:1), el plano está bien.'
      ],
      pantalla: ['Vistas que salen del modelo: cambian solas', 'Página → Projection Group → cotas → cuadro de datos → PDF', 'Projection Type: First angle (primer diedro)', 'Cotas con las mismas reglas que a mano', 'Imprimir al 100 %, nunca «ajustar a la página»', 'Comprueba con regla una cota grande'],
      clave: [['TechDraw', 'Banco de planos de FreeCAD'], ['Default Page', 'Hoja con marco y cuadro de datos'], ['Projection Group', 'Grupo de vistas alineadas (frente, superior, lateral)'], ['Template', 'Plantilla de la hoja: tamaño y cuadro de datos'], ['Export Page as PDF', 'Guardar el plano listo para imprimir o enviar']],
      ejemplo: { titulo: 'Plano de la placa de montaje', pasos: ['Insert Default Page (A4 horizontal).', 'Selecciona el Body → Insert Projection Group: First angle, frente y superior, escala 1:1.', 'Cotas: 80, 40, 12 desde el borde, 20 de altura y 2× Ø8.', 'Doble clic en el cuadro de datos: pieza, nombre, grupo, material, escala.', 'Export Page as PDF e imprime al 100 %.'], resultado: 'El plano dice todo lo que el taller necesita y está ligado al modelo.' },
      preguntas: [['¿Qué ventaja tienen las vistas de TechDraw sobre las dibujadas a mano?', 'Salen del modelo y se actualizan si la pieza cambia.'], ['¿Dónde eliges primer o tercer diedro?', 'En el Projection Type del grupo de proyección.'], ['¿Cómo compruebas que el PDF salió a escala?', 'Imprimiendo al 100 % y midiendo con regla una cota grande.'], ['¿Qué debe llevar el cuadro de datos?', 'Pieza, dibujante, fecha, escala, unidades, método de proyección y material.']],
      errores: ['Imprimir con «ajustar a la página»: la escala deja de ser real.', 'Dejar el cuadro de datos con los textos de ejemplo.', 'Tercer diedro sin darse cuenta: las vistas quedan al revés.', 'Cotas encima de la pieza o repetidas en dos vistas.'],
      vida: 'En las empresas el plano sale del modelo 3D y se manda en PDF al proveedor o al taller. Un PDF mal escalado o con el cuadro de datos vacío regresa sin fabricar.',
      ideas: ['m2-error-plano', 'mini-retos'], fuente: FU + ' (p. 34); documentación oficial de FreeCAD (TechDraw: Insert Default Page, Projection Group, Dimension, Export Page as PDF).'
    },
    {
      id: 'm2-materiales', sm: 'II-1', ac: AC[1], titulo: 'Elegir el material: masa, costo e impacto ambiental', dur: '50 min',
      objetivo: 'Que justifiquen el material de una pieza por su función, su masa y su impacto ecológico.',
      explica: [
        'El plano dice de qué material es la pieza. Para elegirlo se pregunta: ¿qué esfuerzo aguanta?, ¿se moja o se calienta?, ¿cuánto debe pesar?, ¿cómo se va a fabricar? y ¿qué pasa con ella al final de su vida?',
        'La masa sale del volumen y la densidad: m = V × ρ. Densidades aproximadas (g/cm³): acero 7.85, latón 8.5, aluminio 2.70, acrílico 1.19, PLA (impresión 3D) 1.24, ABS 1.04, MDF 0.75. Una pieza de 20 cm³ pesa 157 g en acero y 54 g en aluminio. FreeCAD calcula el volumen del sólido; en la libreta se calcula con largo × ancho × espesor menos los barrenos.',
        'Impacto ecológico: fabricar aluminio nuevo consume mucha energía, pero reciclarlo ahorra cerca del 95 % de ella; el acero se recicla una y otra vez; el MDF usa fibras de madera y resinas y es difícil de reciclar; los plásticos dependen del petróleo, aunque el PLA es de origen vegetal. Usar menos material (barrenos de aligeramiento, paredes delgadas con Thickness) y acomodar piezas para desperdiciar menos lámina también reduce el impacto.',
        'En el cuadro de datos se anota el material y, en el expediente, por qué se eligió: función, masa, costo y fin de vida.'
      ],
      pantalla: ['¿Qué aguanta? ¿Se moja? ¿Cuánto pesa? ¿Cómo se fabrica? ¿Y al final?', 'm = V × ρ', 'Acero 7.85 · aluminio 2.70 · acrílico 1.19 · MDF 0.75 g/cm³', 'Reciclar aluminio ahorra cerca del 95 % de la energía', 'Menos material = menos impacto', 'Material y razón en el plano y el expediente'],
      clave: [['Densidad (ρ)', 'Masa por unidad de volumen, en g/cm³'], ['Masa', 'm = V × ρ'], ['Ciclo de vida', 'Del material extraído a la pieza usada y desechada o reciclada'], ['Aligeramiento', 'Quitar material donde no hace falta para bajar masa'], ['Reciclable', 'Material que se puede volver a usar como materia prima']],
      ejemplo: { titulo: 'Placa de 80 × 40 × 5 con dos barrenos Ø8', pasos: ['Volumen bruto: 80 × 40 × 5 = 16 000 mm³.', 'Barrenos: 2 × π × 4² × 5 ≈ 503 mm³.', 'Volumen: 15 497 mm³ ≈ 15.5 cm³.', 'En aluminio: 15.5 × 2.70 ≈ 41.8 g; en acero: 15.5 × 7.85 ≈ 121.7 g.'], resultado: 'Si la placa no carga mucho, el aluminio pesa casi tres veces menos y es muy reciclable.' },
      preguntas: [['¿Cómo calculas la masa de una pieza?', 'Multiplicando su volumen por la densidad del material.'], ['¿Cuántas veces es más denso el acero que el aluminio, aproximadamente?', 'Unas 2.9 veces (7.85 contra 2.70).'], ['¿Qué ventaja ambiental tiene reciclar aluminio?', 'Ahorra cerca del 95 % de la energía de fabricarlo nuevo.'], ['Menciona dos formas de bajar el impacto de una pieza desde el diseño.', 'Usar menos material (aligerar, paredes delgadas) y acomodar las piezas para desperdiciar menos lámina.']],
      errores: ['Olvidar restar los barrenos al calcular el volumen.', 'Mezclar mm³ y cm³ (1 cm³ = 1000 mm³).', 'Elegir el material solo por el color o porque «se ve bonito».', 'Usar acero donde basta MDF o plástico.'],
      vida: 'Las armadoras y sus proveedores piden reducir peso porque cada kilo menos en un auto ahorra combustible; elegir bien el material es parte del trabajo de diseño.',
      ideas: ['m2-materiales-huella'], fuente: FU + ' (p. 34); densidades de tablas de propiedades de materiales; The Aluminum Association (ahorro de energía del aluminio reciclado).'
    }
  ];

  /* =================== CLASES (55 h: 43 h en aula y 12 h en el centro de cómputo) =================== */
  const FC = 'FreeCAD 1.0 o más nuevo', FCL = 'https://www.freecad.org/';
  const clases = [
    { id: 'm2a-encuadre', h: 3, m: 'a', tipo: 'Encuadre', t: 'Encuadre del parcial y examen diagnóstico', obj: 'Que conozcan cómo se les evalúa, el proyecto del parcial y muestren qué saben de dibujo técnico y FreeCAD.', ac: null,
      tarea: 'Conseguir para la próxima clase: lápices 2H y HB (o portaminas de 0.5 mm), goma, juego de escuadras de 45° y 30-60°, compás y regla graduada. Si no tienes todo, organízate en parejas.',
      pasos: [[20, 'Encuadre: Examen 50 · Libreta/Proyecto/Bitácora 40 · Asistencia 5 · Participación 5.'], [15, 'Reglas: material de dibujo cada clase, cuidado de las computadoras y archivos con tu apellido.'], [15, 'Presenta el proyecto: «Del objeto al plano», el expediente de una pieza mecánica real, y el catálogo de piezas de repuesto para el plantel.'], [60, 'Examen diagnóstico de dibujo técnico y FreeCAD.'], [25, '¿Dónde se usan planos? Lluvia de ideas con objetos del salón: quién los diseñó y cómo los fabricaron.'], [15, 'Boleto de salida y tarea.']],
      ev: 'Examen diagnóstico contestado (Desempeño)', ideas: ['primer-dia', 'pr-diagnostico-visible'], pre: 'plano · norma · escala' },
    { id: 'm2a-dibujo-c', h: 2, m: 'a', tipo: 'Teoría', t: 'El dibujo técnico: el idioma de la industria', obj: 'Explicar por qué el dibujo técnico sigue normas y preparar una lámina con formato, margen y cuadro de datos.', ac: 0, dc: 0, tema: 'm2-dibujo-tecnico',
      pasos: [[10, 'Dictado de dibujo: describes una pieza sin enseñarla y la dibujan; comparan resultados.'], [35, 'Tema en proyector: normas, formatos, margen y cuadro de datos.'], [40, 'Lámina 0: margen de 20 y 10 mm y cuadro de datos con letra normalizada.'], [10, 'Revisión entre parejas con la lista de la pantalla.'], [5, 'Boleto de salida.']],
      ev: 'Lámina 0: formato con margen y cuadro de datos (Producto)',
      guia: { pasos: [['Formato', 'Hoja A4 vertical (210 × 297 mm) o tamaño carta.'], ['Margen', 'Marco con línea gruesa: 20 mm desde la orilla izquierda y 10 mm desde las otras tres.'], ['Cuadro de datos', 'Abajo a la derecha, dentro del marco: pieza, alumno, grupo, escala, unidades (mm), método de proyección, material, fecha y número de lámina.'], ['Rotulación', 'Mayúsculas de 3.5 mm entre dos líneas guía tenues; títulos de 5 mm.'], ['Plantilla', 'Guárdala: con ella harás las láminas del parcial.']], revisa: ['Márgenes medidos con regla', 'Cuadro de datos completo y legible', 'Letras del mismo alto'], entrega: 'Lámina 0 con margen y cuadro de datos.' },
      ideas: ['m2-dictado-dibujo', 'm2-caligrafia-tecnica'], pre: 'formato A4 · margen · cuadro de datos' },
    { id: 'm2a-freecad-c', h: 1, m: 'd', tipo: 'Teoría', t: 'FreeCAD: entorno y diseño paramétrico', obj: 'Conocer los bancos de trabajo, el árbol del modelo y la idea de diseño paramétrico.', ac: 1, dc: 0, tema: 'm2-freecad-entorno',
      tarea: 'Si tienes computadora, instala FreeCAD (gratuito, freecad.org) y ábrelo; si no, escribe en tu libreta para qué sirven Body, Sketch, Pad y Pocket con un dibujo de cada uno.',
      pasos: [[10, '¿Qué cambia si el cliente pide la pieza 5 mm más larga: en papel y en CAD?'], [30, 'Tema en proyector: bancos, árbol, unidades y navegación, con FreeCAD abierto.'], [10, 'Glosario rápido en la libreta: Body, Sketch, Pad, Pocket y restricción.']],
      ideas: ['pr-freecad-espejo'], pre: 'CAD · paramétrico · árbol del modelo' },
    { id: 'm2a-restricciones-c', h: 1, m: 'd', tipo: 'Teoría', t: 'Restricciones: dibujar con intención', obj: 'Distinguir restricciones geométricas y de medida y reconocer un croquis totalmente restringido.', ac: 1, dc: 0, tema: 'sm1-restricciones',
      pasos: [[10, 'Demostración: un croquis sin restricciones se deforma al arrastrarlo; uno restringido no.'], [25, 'Tema en proyector.'], [15, 'En la libreta: qué restricciones le pondrías a la placa de dos barrenos y cuántas cotas necesita.']],
      ideas: ['mini-retos'], pre: 'coincidente · horizontal · cota · verde' },
    { id: 'm2a-unidades-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Unidades, medición y conversiones', obj: 'Convertir entre milímetros y pulgadas y medir con el instrumento adecuado.', ac: 0, dc: 0, tema: 'm2-unidades',
      tarea: 'Busca 5 objetos con medidas en pulgadas (tubería, llaves, brocas, pantallas o rines de bicicleta) y conviértelas a milímetros en tu libreta.',
      pasos: [[10, '¿Cuánto mide una pulgada? Comparan reglas, flexómetros y una llave de 1/2 in.'], [30, 'Tema en proyector y lectura del vernier en métrico y en pulgadas.'], [45, 'Ejercicios en la libreta: mm ↔ cm ↔ m, pulgadas enteras y fraccionarias a mm, y lectura de 4 medidas con vernier.'], [10, 'Votación con tarjetas.'], [5, 'Boleto de salida.']],
      mat: 'Vernier, flexómetro, regla y una llave o broca en pulgadas.', ideas: ['m2-carrera-conversiones', 'pr-plickers'], pre: 'SI · pulgada · vernier' },
    { id: 'm2a-lineas-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Alfabeto de líneas y rotulación', obj: 'Usar cada tipo de línea con su significado y rotular con letra normalizada.', ac: 0, dc: 0, tema: 'm2-lineas',
      tarea: 'Rotula en tu libreta tu nombre completo y el nombre de tu carrera con letra de 5 mm entre líneas guía, tres veces, cada vez más parejo.',
      pasos: [[10, 'Un plano real en pantalla: ¿qué significa cada tipo de línea?'], [30, 'Tema en proyector.'], [50, 'Lámina 1: alfabeto de líneas y rotulación normalizada.'], [10, 'Revisión con la lista de cotejo.']],
      ev: 'Lámina 1: alfabeto de líneas y rotulación (Producto)',
      guia: { pasos: [['Grosores', 'Gruesa de unos 0.5 mm (HB o portaminas 0.5) y fina de unos 0.25 mm (2H, sin apretar).'], ['Líneas', 'Un renglón de cada una: continua gruesa, continua fina, discontinua (oculta), trazo largo y punto (eje) y a mano alzada (rotura).'], ['Uso', 'Junto a cada renglón escribe para qué sirve.'], ['Rotulación', 'Alfabeto y números en mayúsculas de 5 mm y de 3.5 mm entre líneas guía tenues.'], ['Cuadro de datos', 'Llena el cuadro de datos de la lámina.']], revisa: ['Se distinguen dos grosores', 'Trazos y espacios parejos en la discontinua y en la de eje', 'Letras del mismo alto'], entrega: 'Lámina 1.' },
      ideas: ['m2-caligrafia-tecnica', 'pr-error-del-dia'], pre: 'visible · oculta · eje · cota' },
    { id: 'm2a-fc-entorno', h: 2, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'FreeCAD: unidades, navegación y primer croquis', obj: 'Configurar FreeCAD en milímetros, moverse en la vista 3D y modelar una placa desde un croquis restringido.', ac: 1, dc: 0, tema: 'm2-freecad-entorno', dep: ['m2a-freecad-c'], firme: ['m2a-freecad-c'],
      pasos: [[15, 'Abren FreeCAD: unidades en mm (Editar → Preferencias → General → Unidades), navegación, bancos y árbol del modelo.'], [70, 'Práctica guiada «Yo modelo, tú modelas»: placa de montaje con dos barrenos.'], [15, 'Guardan Apellido_Placa.FCStd en la carpeta del grupo y toman captura con el árbol.']],
      ev: 'Placa modelada con croquis totalmente restringido (Producto)', ideas: ['pr-freecad-espejo', 'mini-retos'], pre: 'Body · Sketch · Pad' },
    { id: 'm2a-fc-croquis', h: 2, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Croquis totalmente restringidos', obj: 'Dibujar croquis en verde con restricciones geométricas y de medida.', ac: 1, dc: 0, tema: 'sm1-restricciones', dep: ['m2a-restricciones-c', 'm2a-fc-entorno'], firme: ['m2a-restricciones-c'],
      pasos: [[10, 'Reto de 5 minutos: rectángulo de 50 × 30 totalmente restringido con una esquina en el origen.'], [60, 'Práctica: eslabón de 100 mm entre centros.'], [30, 'Mini-retos cronometrados: tres croquis con arcos tangentes y barrenos.']],
      ev: 'Croquis en verde del eslabón (Producto)', ideas: ['mini-retos'], pre: 'Slot · tangente · igualdad' },
    { id: 'm2a-geometria-pr', h: 2, m: 'd', tipo: 'Práctica', t: 'Trazos geométricos para piezas mecánicas', obj: 'Trazar mediatrices, paralelas, perpendiculares, hexágonos y enlaces tangentes con escuadras y compás.', ac: 0, dc: 1, tema: 'm2-geometria',
      tarea: 'Traza en tu libreta el contorno de una llave plana o de un eslabón con extremos redondos, marcando los centros y los puntos de tangencia.',
      pasos: [[10, 'Reto: un hexágono perfecto solo con compás.'], [20, 'Demostración en el pizarrón: perpendicular, mediatriz, paralela, hexágono y enlace de dos rectas con un arco.'], [60, 'Lámina 2: trazos geométricos y el redondeo de las esquinas de una placa.'], [10, 'Galería rápida y revisión.']],
      ev: 'Lámina 2: trazos geométricos (Producto)',
      guia: { pasos: [['Mediatriz', 'Desde cada extremo del segmento, arcos de igual radio que se crucen; une los dos cruces.'], ['Paralela y perpendicular', 'Desliza una escuadra sobre la otra sin mover la que sirve de guía.'], ['Hexágono', 'Circunferencia de radio R; con el compás abierto a R marca 6 puntos sobre ella y únelos.'], ['Tangencia', 'El punto de tangencia está donde la perpendicular desde el centro toca la recta.'], ['Enlace', 'Paralelas a distancia r de cada recta: su cruce es el centro del arco de enlace.']], revisa: ['Construcciones visibles en línea fina', 'Hexágono con lados iguales', 'Arcos que se unen sin escalón'], seguridad: 'El compás se pasa cerrado y con la punta hacia abajo.', entrega: 'Lámina 2.' },
      ideas: ['m2-galeria-laminas'], pre: 'mediatriz · tangente · enlace' },
    { id: 'm2a-escalas-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Escalas', obj: 'Elegir la escala normalizada adecuada y calcular medidas en el papel y reales.', ac: 0, dc: 0, tema: 'm2-escalas',
      tarea: 'Haz el plano de tu cuarto o de tu cocina a escala 1:50, con las medidas reales en las cotas y la escala en el cuadro de datos.',
      pasos: [[10, '¿Cómo cabe un tráiler en una hoja y cómo se ve en grande un engrane de reloj?'], [30, 'Tema en proyector.'], [45, 'Lámina 3: la misma placa a escala 1:2, 1:1 y 2:1, con las cotas reales.'], [10, 'Votación con tarjetas.'], [5, 'Boleto de salida.']],
      ev: 'Lámina 3: una pieza a tres escalas (Producto)',
      guia: { pasos: [['Pieza', 'Placa de 60 × 30 con un barreno Ø10 al centro.'], ['Tres escalas', 'Dibújala a 1:2 (30 × 15), 1:1 (60 × 30) y 2:1 (120 × 60).'], ['Cotas', 'En los tres dibujos escribe 60, 30 y Ø10: la medida real.'], ['Título', 'Debajo de cada dibujo, su escala.']], tabla: { cab: ['Escala', 'Largo en el papel', 'Alto en el papel', 'Cota escrita'], filas: 3 }, revisa: ['Medidas en el papel correctas', 'Cotas con la medida real'], entrega: 'Lámina 3.' },
      ideas: ['m2-escala-salon', 'pantografo'], pre: '1:2 · 2:1 · escalímetro' },
    { id: 'm2a-modelado-c', h: 1, m: 'd', tipo: 'Teoría', t: 'Método de elaboración de un modelo 3D', obj: 'Decidir el orden de operaciones de una pieza y elegir entre extrusión, revolución, vaciado, redondeo y chaflán.', ac: 1, dc: 1, tema: 'm2-modelado-3d',
      tarea: 'Elige 2 objetos de tu casa (una tapa, una perilla, un soporte, un vaso) y escribe en tu libreta con qué operaciones los modelarías y en qué orden.',
      pasos: [[10, 'Piezas reales en la mesa: ¿extrusión, revolución o vaciado?'], [30, 'Tema en proyector con el flujo de FreeCAD.'], [10, 'Plan de modelado de la placa y de una polea en la libreta.']],
      ideas: ['m2-pieza-misteriosa'], pre: 'Pad · Pocket · Revolution · Thickness' },
    { id: 'm2a-fc-3d', h: 2, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Del croquis al sólido: Pad, Pocket, Fillet y Chamfer', obj: 'Modelar piezas prismáticas con extrusiones, barrenos, redondeos y chaflanes.', ac: 1, dc: 2, tema: 'm2-modelado-3d', dep: ['m2a-modelado-c', 'm2a-fc-croquis'], firme: ['m2a-modelado-c'],
      pasos: [[10, 'Demostración: el bloque escalonado del isométrico, convertido en modelo.'], [70, 'Prácticas: bloque escalonado y escuadra de refuerzo en L.'], [20, 'Cambian una cota y observan qué se actualiza y qué se rompe.']],
      ev: 'Bloque y escuadra modelados (Producto)', ideas: ['pr-freecad-espejo'], pre: 'Pad · Pocket · Fillet · Chamfer' },
    { id: 'm2a-isometrico-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Dibujo isométrico', obj: 'Dibujar piezas en isométrico con medidas reales sobre los ejes.', ac: 0, dc: 1, tema: 'm2-isometrico',
      tarea: 'Dibuja en isométrico 2 objetos de tu casa con forma de caja (un cajón, un ladrillo, un estuche, una caja de cereal) con sus medidas.',
      pasos: [[10, 'Con una caja de cereal: ¿cómo dibujarías tres caras a la vez?'], [30, 'Tema en proyector con la figura animada.'], [50, 'Ejercicios en papel isométrico: 4 bloques a partir de piezas de madera o de cubos.'], [10, 'Revisión.']],
      mat: 'Papel isométrico impreso (o cuadrícula), bloques o cubos de madera.', ideas: ['m2-cubos-iso'], pre: 'ejes a 30° · método de la caja' },
    { id: 'm2a-isometrico-pr', h: 3, m: 'd', tipo: 'Práctica', t: 'Lámina 4: isométricos con caras inclinadas y círculos', obj: 'Dibujar a escuadra isométricos con caras inclinadas y elipses.', ac: 0, dc: 1, tema: 'm2-isometrico', dep: ['m2a-isometrico-c'],
      pasos: [[15, 'Demostración: elipse isométrica por el método de cuatro centros.'], [110, 'Lámina 4: cuatro isométricos a escuadra (bloque escalonado, cara inclinada, barreno y pieza cilíndrica).'], [15, 'Coevaluación en parejas con la lista de cotejo.'], [10, 'Entrega.']],
      ev: 'Lámina 4: dibujos isométricos (Producto)',
      guia: { pasos: [['Ejes', 'Un eje vertical y dos a 30° de la horizontal con la escuadra de 30-60° sobre una regla.'], ['Caja', 'Encierra cada pieza en una caja con su largo, fondo y alto reales.'], ['Recorta', 'Escalones y caras inclinadas: mide solo sobre aristas paralelas a los ejes; las inclinadas se trazan uniendo extremos.'], ['Círculos', 'Rombo del tamaño del diámetro sobre la cara; cuatro centros y cuatro arcos forman la elipse.'], ['Remarca', 'Aristas visibles en línea gruesa; en isométrico no se dibujan las ocultas.']], revisa: ['Medidas reales sobre los ejes', 'Las aristas paralelas en la pieza son paralelas en el dibujo', 'Cada elipse orientada según su cara'], entrega: 'Lámina 4.' },
      ideas: ['m2-cubos-iso', 'coevaluacion'], pre: 'elipse · cuatro centros · cara inclinada' },
    { id: 'm2a-materiales-c', h: 1, m: 'd', tipo: 'Teoría', t: 'Elegir el material: masa, costo e impacto ambiental', obj: 'Justificar el material de una pieza por su función, su masa y su impacto ecológico.', ac: 1, dc: 1, tema: 'm2-materiales',
      tarea: 'Busca en tu casa 3 objetos con el mismo uso hechos de materiales distintos (por ejemplo, vasos de vidrio, plástico y metal) y escribe ventajas y desventajas de cada uno para el ambiente.',
      pasos: [[10, '¿De qué material harías tu pieza y por qué?'], [25, 'Tema en proyector.'], [15, 'En la libreta: masa de la placa de montaje en aluminio, acero y MDF; ¿cuál eligen y por qué?']],
      ideas: ['m2-materiales-huella'], pre: 'densidad · masa · reciclable' },
    { id: 'm2a-fc-revolucion', h: 2, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Revolución y vaciado: Revolution y Thickness', obj: 'Modelar piezas redondas girando un perfil y piezas huecas de pared delgada.', ac: 1, dc: 2, tema: 'm2-modelado-3d', dep: ['m2a-fc-3d'],
      pasos: [[10, '¿Cómo modelas una polea o una caja sin dibujar cada pared?'], [75, 'Prácticas: polea con canal en V (Revolution) y caja con paredes de 2 mm (Thickness).'], [15, 'Guardan y capturan el árbol de cada pieza.']],
      ev: 'Polea y caja modeladas (Producto)', ideas: ['mini-retos'], pre: 'Revolution · Thickness · eje' },
    { id: 'm2a-vistas-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Proyección ortogonal: vistas en primer y tercer diedro', obj: 'Obtener y acomodar las vistas de una pieza en primer diedro y reconocer el tercero.', ac: 0, dc: 1, tema: 'm2-vistas',
      tarea: 'Dibuja a mano alzada las vistas frontal, superior y lateral izquierda de un objeto de tu casa (un sacapuntas, una goma, un control remoto) en primer diedro.',
      pasos: [[10, 'Caja de proyección: una pieza dentro de una caja de cartón; dibujan en cada cara lo que ven.'], [35, 'Tema en proyector con la figura de primer y tercer diedro.'], [40, 'Ejercicios: de isométrico a vistas y «adivina la pieza» a partir de sus vistas.'], [10, 'Votación con tarjetas.'], [5, 'Boleto de salida.']],
      ideas: ['m2-caja-proyeccion', 'm2-pieza-misteriosa'], pre: 'frontal · superior · lateral · diedro' },
    { id: 'm2a-vistas-pr', h: 3, m: 'd', tipo: 'Práctica', t: 'Lámina 5: vistas ortogonales', obj: 'Dibujar a escuadra las tres vistas de piezas a partir de su isométrico, con ocultas y ejes.', ac: 0, dc: 1, tema: 'm2-vistas', dep: ['m2a-vistas-c'],
      pasos: [[15, 'Repaso: dónde va cada vista en primer diedro y cómo se alinean.'], [110, 'Lámina 5: tres piezas en vistas frontal, superior y lateral, con líneas ocultas y de eje, a partir de su isométrico.'], [15, 'Coevaluación con la lista de cotejo.'], [10, 'Entrega.']],
      ev: 'Lámina 5: vistas ortogonales (Producto)',
      guia: { pasos: [['Frente', 'Elige como frente la cara que más dice de la pieza.'], ['Acomoda', 'Primer diedro: la superior abajo del frente y la lateral izquierda a la derecha del frente.'], ['Alinea', 'Pasa alturas y largos con líneas tenues; el fondo, con una línea a 45° entre la superior y la lateral.'], ['Ocultas y ejes', 'Lo que no se ve, discontinua; el eje de cada barreno, trazo y punto.'], ['Símbolo', 'Dibuja el símbolo de primer diedro en el cuadro de datos.']], revisa: ['Vistas alineadas y en su lugar', 'Ocultas y ejes donde van', 'Símbolo del método de proyección'], entrega: 'Lámina 5.' },
      ideas: ['m2-pieza-misteriosa', 'coevaluacion'], pre: 'alinear · oculta · símbolo' },
    { id: 'm2a-acotacion-c', h: 2, m: 'd', tipo: 'Teoría', t: 'Acotación', obj: 'Acotar piezas con todas las medidas necesarias, sin repetir y siguiendo la norma.', ac: 0, dc: 2, tema: 'm2-acotacion',
      tarea: 'Busca un plano, instructivo o diagrama con medidas (de un mueble para armar o de un manual) y marca qué cotas están bien y cuáles cambiarías y por qué.',
      pasos: [[10, 'Un plano con 10 errores de acotación: ¿cuántos encuentran?'], [35, 'Tema en proyector.'], [40, 'Ejercicios en la libreta: acotan dos piezas, una en cadena y otra en paralelo, con Ø y R.'], [10, 'Revisión.'], [5, 'Boleto de salida.']],
      ideas: ['m2-error-plano'], pre: 'cota · Ø · R · paralelo' },
    { id: 'm2a-croquis-pr', h: 2, m: 'd', tipo: 'Proyecto', t: 'Croquis acotado de una pieza real', obj: 'Medir una pieza real y dibujar su croquis a mano alzada con todas las medidas.', ac: 0, dc: 2, tema: 'm2-acotacion', dep: ['m2a-acotacion-c'],
      pasos: [[10, 'Indicaciones: cada equipo recibe o trae su pieza real (soporte, bisagra, polea, eslabón, perilla).'], [15, 'Repaso de lectura del vernier.'], [60, 'Croquis a mano alzada: isométrico y vistas, con todas las medidas tomadas con vernier.'], [15, 'Revisión cruzada: ¿otro equipo podría fabricarla con su croquis?']],
      mat: 'Piezas reales, vernier, flexómetro y regla.', ev: 'Croquis acotado de la pieza del proyecto (Producto)',
      guia: { pasos: [['Observa', 'Elige el frente; cuenta caras, barrenos y redondeos.'], ['Proporción', 'Dibuja a mano alzada respetando proporciones, sin medir todavía.'], ['Mide', 'Con vernier: largo, ancho, alto, diámetros y centros de barrenos; anota en la tabla.'], ['Acota', 'Cada medida una sola vez, en la vista que mejor la muestra.'], ['Comprueba', 'Otro equipo lee tu croquis y dice si podría fabricar la pieza.']], tabla: { cab: ['Medida', 'Valor (mm)', 'Instrumento'], filas: 8 }, revisa: ['Todas las medidas necesarias, sin repetir', 'Proporciones parecidas a la pieza real'], seguridad: 'Piezas sin filo ni rebabas; el vernier se cierra y se guarda en su estuche.', entrega: 'Croquis acotado y tabla de medidas.' },
      ideas: ['m2-croquis-casa'], pre: 'croquis · mano alzada · vernier' },
    { id: 'm2a-fc-plano', h: 2, m: 'd', lugar: 'computo', tipo: 'Cómputo', t: 'Del modelo al plano en TechDraw', obj: 'Obtener el plano de un modelo con vistas, cotas, escala y cuadro de datos, y exportarlo a PDF.', ac: 1, dc: 3, tema: 'm2-techdraw', dep: ['m2a-fc-3d'],
      pasos: [[15, 'En pantalla: hoja, grupo de proyección en primer diedro, cotas y cuadro de datos.'], [70, 'Práctica: plano en TechDraw y PDF a escala 1:1.'], [15, 'Revisan el PDF: ¿la cota de 80 mide 80 mm al imprimir al 100 %?']],
      ev: 'Plano en PDF con vistas, cotas y cuadro de datos (Producto)', ideas: ['m2-error-plano'], pre: 'TechDraw · Projection Group · PDF' },
    { id: 'm2a-diseno-eval', h: 2, m: 'd', lugar: 'computo', tipo: 'Evaluación', t: 'Diseña la pieza del proyecto en 2D y 3D (actividad clave)', obj: 'Modelar la pieza del proyecto con las medidas del croquis y obtener su plano con vistas, cotas, escala, material y cuadro de datos.', ac: 1, dc: 3, tema: 'm2-techdraw', dep: ['m2a-fc-plano', 'm2a-croquis-pr'],
      pasos: [[10, 'Indicaciones y lista de cotejo en pantalla.'], [75, 'Modelan su pieza con las medidas del croquis y sacan su plano en TechDraw: vistas, cotas, escala, material y cuadro de datos.'], [15, 'Entregan el archivo .FCStd y el PDF.']],
      ev: 'Pieza diseñada en 2D y 3D con su plano (Producto · actividad clave)',
      guia: { sw: FC, link: FCL, pasos: [['Método', 'Ordena: forma principal (Pad o Revolution), lo que se quita (Pocket) y al final redondeos y chaflanes.'], ['Croquis', 'Cada croquis totalmente restringido (verde) y anclado al origen.'], ['Medidas', 'Compara cada medida del modelo con tu croquis acotado.'], ['Material', 'Elige el material y anota su masa y por qué (función, costo y fin de vida).'], ['Plano', 'TechDraw: grupo de proyección en primer diedro, isométrico chico, cotas sin repetir, escala, material y cuadro de datos; exporta a PDF.']], tabla: { cab: ['Operación', 'Croquis o arista', 'Medida'], filas: 6 }, revisa: ['Croquis en verde', 'Medidas iguales a las del croquis', 'Plano completo y a escala', 'Material justificado'], entrega: 'Apellido_Pieza.FCStd y el plano en PDF.' },
      ideas: ['coevaluacion'], pre: 'modelo · plano · material' },
    { id: 'm2a-plano-eval', h: 3, m: 'd', tipo: 'Evaluación', t: 'Representa la pieza en un plano (actividad clave)', obj: 'Dibujar a mano el plano de la pieza del proyecto con isométrico, vistas ortogonales, cotas, escala y cuadro de datos.', ac: 0, dc: 2, tema: 'sm1-planos', dep: ['m2a-croquis-pr', 'm2a-vistas-pr'],
      pasos: [[10, 'Indicaciones y lista de cotejo en pantalla.'], [120, 'Lámina 6: plano a mano de la pieza del proyecto con isométrico, tres vistas, cotas, escala y cuadro de datos.'], [20, 'Entrega y autoevaluación con la lista de cotejo.']],
      ev: 'Plano de vistas ortogonales e isométricas de la pieza (Producto · actividad clave)',
      guia: { pasos: [['Escala', 'Elige la mayor escala normalizada con la que quepan las vistas y sus cotas.'], ['Vistas', 'Frente, superior y lateral en primer diedro, alineadas, con ocultas y ejes.'], ['Isométrico', 'En el espacio libre, isométrico de la pieza.'], ['Cotas', 'Todas las medidas del croquis, cada una una vez, por fuera y sin cruzarse.'], ['Cuadro de datos', 'Pieza, alumno, grupo, escala, mm, símbolo de primer diedro, material y fecha.']], revisa: ['Usa el sistema de unidades indicado y convierte correctamente', 'Vistas alineadas e isométrico proporcionado', 'Alfabeto de líneas correcto', 'Cotas completas, fuera del contorno y sin cruzarse', 'Limpio, con escala y cuadro de datos'], entrega: 'Lámina 6: plano de la pieza del proyecto.' },
      ideas: ['coevaluacion'], pre: 'plano · lista de cotejo' },
    { id: 'm2a-cortes-c', h: 1, m: 'd', tipo: 'Teoría', t: 'Cortes y secciones', obj: 'Representar el interior de una pieza con un corte en lugar de muchas líneas ocultas.', ac: 0, dc: 2, tema: 'm2-cortes',
      tarea: 'Dibuja en tu libreta un objeto partido a la mitad (un vaso, una tuerca, un carrete de hilo) como corte: raya solo donde hay material.',
      pasos: [[10, '¿Cómo muestras lo de adentro de una polea sin llenarla de líneas ocultas?'], [25, 'Tema en proyector con la figura del corte A-A.'], [15, 'Ejercicio en la libreta: corte total de un buje con barreno escalonado.']],
      ideas: ['m2-pieza-misteriosa'], pre: 'corte A-A · rayado · sección' },
    { id: 'm2a-expediente', h: 1, m: 'c', tipo: 'Proyecto', t: 'Integración del expediente', obj: 'Reunir croquis, láminas, modelo, plano y ficha del material en un expediente ordenado.', ac: 1, dc: 3, dep: ['m2a-plano-eval'],
      pasos: [[10, 'Lista del expediente en pantalla.'], [35, 'Ordenan: portada, croquis, plano a mano, capturas del modelo, plano en PDF impreso y ficha del material con su justificación.'], [5, 'Revisan con la lista y anotan lo que falta.']],
      ev: 'Expediente de la pieza (Producto)', ideas: ['m2-galeria-laminas'], pre: 'expediente · ficha técnica' },
    { id: 'm2a-expo', h: 2, m: 'c', tipo: 'Proyecto', t: 'Presentación de expedientes, catálogo de repuestos y repaso', obj: 'Presentar la pieza del objeto al plano, entregar el catálogo de piezas de repuesto para el plantel y repasar para el examen.', ac: 0, dc: 2, dep: ['m2a-expediente'],
      pasos: [[10, 'Indicaciones: 3 minutos por equipo con la pieza real, su plano y su modelo.'], [60, 'Presentaciones y preguntas; coevaluación con la lista de cotejo.'], [10, 'Integran el catálogo de planos para el personal de mantenimiento del plantel.'], [20, 'Repaso para el examen: ejercicios para proyectar de escalas, conversiones, vistas y cotas.']],
      ev: 'Presentación del expediente (Desempeño)', ideas: ['m2-galeria-laminas', 'coevaluacion', 'pr-plickers'], pre: 'presentación · coevaluación · repaso' },
    { id: 'examen-m2s1', h: 2, m: 'c', tipo: 'Evaluación', t: 'Examen del 1er parcial', obj: 'Evaluar los conocimientos del submódulo.', ac: null,
      pasos: [[10, 'Indicaciones y respiración antes del examen.'], [80, 'Examen escrito (Escuadra lo arma con los temas que diste).'], [10, 'Recoges y comentas lo que viene.']], ev: 'Examen del parcial', ideas: ['pr-respira'] },
    { id: 'm2a-retro', h: 2, m: 'c', tipo: 'Evaluación', t: 'Retroalimentación y pendientes', obj: 'Corregir errores del examen y recuperar evidencias.', ac: null,
      pasos: [[30, 'Errores comunes del examen en pantalla, sin nombres.'], [50, 'Recuperación de láminas y prácticas pendientes.'], [20, 'Revisión de calificaciones con cada alumno.']], ideas: ['galeria-errores'] },
    { id: 'm2a-cierre', h: 1, m: 'c', tipo: 'Formación', t: 'Autoevaluación y meta: de la pieza al mecanismo', obj: 'Reflexionar sobre su avance y fijar una meta para el Submódulo 2.', ac: null, dep: ['m2a-retro'],
      pasos: [[20, 'Autoevaluación: lo que domino y lo que me falta en dibujo y FreeCAD.'], [20, 'Meta concreta para el 2º parcial: mecanismos que se diseñan, se dibujan y se arman.'], [10, 'Muro de logros.']], ideas: ['pr-muro-logros'] }
  ];

  /* =================== BANCO DE PREGUNTAS =================== */
  const ESC = [[5, 1], [2, 1], [1, 1], [1, 2], [1, 5], [1, 10], [1, 20], [1, 50]], escT = e => e[0] + ':' + e[1];
  const gen = {
    m2conv: rnd => { const v = Math.floor(rnd() * 3);
      if (v === 0) { const fr = pick(rnd, [[1, 8], [1, 4], [3, 8], [1, 2], [5, 8], [3, 4], [7, 8]]), n = fr[0], d = fr[1], q = n / d, mm = q * 25.4, obj = pick(rnd, ['una broca', 'un tornillo', 'una llave', 'una tuerca']), M = x => f(x, 3) + ' mm';
        return { q: 'Convierte a milímetros la medida de ' + obj + ' de ' + n + '/' + d + ' in.', op: ops(M(mm), [M(q * 2.54), M(q * 10), M(d / n * 25.4)], [M(mm * 2), M(mm / 2), M(mm + 1)]), r: n + ' ÷ ' + d + ' = ' + f(q, 3) + ' in; × 25.4 = ' + M(mm) + '.' }; }
      if (v === 1) { const inch = pick(rnd, [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3]), mm = inch * 25.4, I = x => f(x, 2) + ' in';
        return { q: 'Un tubo mide ' + f(mm, 2) + ' mm de diámetro exterior. ¿Cuántas pulgadas son?', op: ops(I(inch), [I(mm / 2.54), I(mm / 10), I(inch * 2)], [I(inch / 2), I(inch + 1), I(inch + 0.25)]), r: f(mm, 2) + ' ÷ 25.4 = ' + I(inch) + '.' }; }
      const u = pick(rnd, ['m', 'cm']), val = u === 'm' ? pick(rnd, [0.35, 1.2, 0.08, 2.5, 0.125, 0.6]) : pick(rnd, [4.5, 12, 0.8, 25.4, 7.5, 32]), k = u === 'm' ? 1000 : 10, M = x => f(x, 2) + ' mm';
      return { q: 'Una placa mide ' + f(val, 3) + ' ' + u + ' de largo. ¿Cuánto es en milímetros?', op: ops(M(val * k), [M(val * 100), M(val * 10), M(val * 1000)], [M(val * 10000), M(val / 10), M(val)]), r: '1 ' + u + ' = ' + k + ' mm; ' + f(val, 3) + ' × ' + k + ' = ' + M(val * k) + '.' }; },
    m2escala: rnd => { const e = pick(rnd, [[1, 2], [1, 5], [1, 10], [1, 20], [2, 1], [5, 1], [10, 1]]), k = e[0] / e[1], red = k < 1, v = Math.floor(rnd() * 3), M = x => f(x, 1) + ' mm';
      if (v === 0) { const L = red ? pick(rnd, [120, 150, 240, 300, 360, 450, 600, 800]) : pick(rnd, [4, 6, 8, 12, 15, 18, 25]);
        return { q: 'Una pieza de ' + L + ' mm se dibuja a escala ' + escT(e) + '. ¿Cuánto mide en el papel?', op: ops(M(L * k), [M(L / k), M(L), M(L * k * 10)], [M(L * k / 10), M(L * k * 2), M(L * k + 1)]), r: L + ' × ' + e[0] + ' ÷ ' + e[1] + ' = ' + M(L * k) + ' en el papel (la cota sigue diciendo ' + L + ').' }; }
      if (v === 1) { const P = pick(rnd, [12, 18, 24, 36, 45, 60, 75, 90]);
        return { q: 'En un plano a escala ' + escT(e) + ', una línea mide ' + P + ' mm en el papel. ¿Cuánto mide la pieza real?', op: ops(M(P / k), [M(P * k), M(P), M(P / k * 10)], [M(P / k / 10), M(P / k * 2), M(P / k + 1)]), r: P + ' × ' + e[1] + ' ÷ ' + e[0] + ' = ' + M(P / k) + ' reales.' }; }
      const L = red ? pick(rnd, [200, 300, 400, 500, 600, 1000]) : pick(rnd, [5, 8, 10, 12, 15, 20]), P = L * k, inv = escT([e[1], e[0]]);
      return { q: 'Una pieza de ' + L + ' mm se dibujó de ' + f(P, 1) + ' mm en el papel. ¿Qué escala se usó?', op: ops(escT(e), [inv, '1:1', escT(red ? [1, e[1] * 2] : [e[0] * 2, 1])], ['1:2', '1:5', '2:1', '5:1', '1:10', '10:1']), r: f(P, 1) + ' : ' + L + ' = ' + escT(e) + ' (dibujo : real).' }; },
    m2formato: rnd => { const A = pick(rnd, [[180, 120], [250, 170], [380, 250]]), L = pick(rnd, [12, 20, 35, 60, 90, 140, 220, 400, 700, 1200, 2500]), W = Math.round(L * pick(rnd, [0.3, 0.5, 0.6, 0.8]));
      const cabe = e => L * e[0] / e[1] <= A[0] && W * e[0] / e[1] <= A[1], i = ESC.findIndex(cabe), ok = ESC[i], sig = ESC[i - 1];
      const cand = [ESC[i + 1], ESC[i - 1], ESC[i + 2], ESC[i - 2]].filter(Boolean).map(escT);
      return { q: 'Una pieza de ' + L + ' × ' + W + ' mm debe caber en un área de dibujo de ' + A[0] + ' × ' + A[1] + ' mm. ¿Cuál es la mayor escala normalizada con la que cabe (5:1, 2:1, 1:1, 1:2, 1:5, 1:10, 1:20 o 1:50)?', op: ops(escT(ok), cand, ESC.map(escT)),
        r: 'A ' + escT(ok) + ' mide ' + f(L * ok[0] / ok[1], 1) + ' × ' + f(W * ok[0] / ok[1], 1) + ' mm y cabe' + (sig ? '; a ' + escT(sig) + ' mediría ' + f(L * sig[0] / sig[1], 1) + ' × ' + f(W * sig[0] / sig[1], 1) + ' mm y ya no cabe.' : '.') }; },
    m2cadena: rnd => { const n = pick(rnd, [2, 3, 4]), c = [pick(rnd, [8, 10, 12, 15])]; for (let i = 1; i < n; i++) c.push(pick(rnd, [15, 20, 25, 30])); c.push(pick(rnd, [8, 10, 12, 15]));
      const pos = []; let acc = 0; for (let i = 0; i < n; i++) { acc += c[i]; pos.push(acc); } const tot = c.reduce((a, b) => a + b, 0), v = Math.floor(rnd() * 3), M = x => x + ' mm';
      if (v === 0) return { q: 'Una placa tiene ' + n + ' barrenos acotados en cadena desde el borde izquierdo: ' + c.join(', ') + ' (la última cota llega al borde derecho). ¿Cuánto mide la placa de largo?', op: ops(M(tot), [M(tot - c[n]), M(tot - c[0]), M(pos[n - 1])], [M(tot + c[0]), M(tot + 10), M(tot - 5)]), r: 'Suma de la cadena: ' + c.join(' + ') + ' = ' + M(tot) + '.' };
      if (v === 1) { const k = 2 + Math.floor(rnd() * (n - 1));
        return { q: 'Una placa tiene ' + n + ' barrenos acotados en cadena desde el borde izquierdo: ' + c.join(', ') + ' (la última cota llega al borde derecho). ¿A qué distancia del borde izquierdo está el centro del barreno ' + k + '?', op: ops(M(pos[k - 1]), [M(c[k - 1]), M(pos[k - 2]), M(tot - pos[k - 1])], [M(pos[k - 1] + c[0]), M(pos[k - 1] + 5), M(pos[k - 1] - 5)]), r: 'Se suman las cotas hasta el barreno ' + k + ': ' + c.slice(0, k).join(' + ') + ' = ' + M(pos[k - 1]) + '.' }; }
      const a = 1, b = n; return { q: 'En una placa acotada en paralelo desde el borde izquierdo, los centros de los barrenos están a ' + pos.join(', ') + ' mm. ¿Qué distancia hay entre el centro del barreno ' + a + ' y el del barreno ' + b + '?', op: ops(M(pos[b - 1] - pos[a - 1]), [M(pos[b - 1]), M(pos[b - 1] + pos[a - 1]), M(c[b - 1])], [M(pos[b - 1] - pos[a - 1] + 5), M(pos[b - 1] - pos[a - 1] - 5), M(tot)]), r: 'Las dos cotas salen de la misma referencia: ' + pos[b - 1] + ' − ' + pos[a - 1] + ' = ' + M(pos[b - 1] - pos[a - 1]) + '.' }; },
    m2masa: rnd => { const mt = pick(rnd, [['aluminio', 2.7], ['acero', 7.85], ['acrílico', 1.19], ['MDF', 0.75], ['latón', 8.5]]), L = pick(rnd, [60, 80, 100, 120]), A = pick(rnd, [30, 40, 50]), e = pick(rnd, [3, 5, 6, 10]), n = pick(rnd, [0, 1, 2, 4]), d = pick(rnd, [5, 6, 8, 10]);
      const Vb = L * A * e, Vh = n * Math.PI * d * d / 4 * e, V = Vb - Vh, m = V / 1000 * mt[1], G = x => f(x, 1) + ' g';
      return { q: 'Una placa de ' + mt[0] + ' (ρ = ' + f(mt[1], 2) + ' g/cm³) mide ' + L + ' × ' + A + ' × ' + e + ' mm y ' + (n ? 'tiene ' + n + (n > 1 ? ' barrenos pasados' : ' barreno pasado') + ' de Ø' + d : 'no tiene barrenos') + '. ¿Cuál es su masa?',
        op: ops(G(m), [G(Vb / 1000 * mt[1]), G((Vb - n * Math.PI * d * d * e) / 1000 * mt[1]), G(V / 100 * mt[1])], [G(V / 1000 / mt[1]), G(m * 2), G(m + 10)]),
        r: 'V = ' + L + ' × ' + A + ' × ' + e + (n ? ' − ' + n + ' × π × ' + d + '² ÷ 4 × ' + e : '') + ' = ' + f(V, 0) + ' mm³ = ' + f(V / 1000, 2) + ' cm³; m = ' + f(V / 1000, 2) + ' × ' + f(mt[1], 2) + ' = ' + G(m) + '.' }; }
  };
  const banco = [
    // el dibujo técnico
    { id: 'm2aa1', tema: 'm2-dibujo-tecnico', tipo: 'om', niv: 1, q: '¿Cuánto mide una hoja A4?', op: ['210 × 297 mm', '216 × 279 mm', '297 × 420 mm', '200 × 300 mm'] },
    { id: 'm2aa2', tema: 'm2-dibujo-tecnico', tipo: 'om', niv: 1, q: 'Según ISO 5457, ¿qué margen lleva el lado izquierdo de una lámina?', op: ['20 mm', '10 mm', '5 mm', '30 mm'] },
    { id: 'm2aa3', tema: 'm2-dibujo-tecnico', tipo: 'om', niv: 2, q: '¿Dónde va el cuadro de datos?', op: ['Abajo a la derecha, dentro del marco', 'Arriba a la izquierda', 'En cualquier lugar libre', 'En la parte de atrás de la hoja'] },
    { id: 'm2aa4', tema: 'm2-dibujo-tecnico', tipo: 'vf', niv: 1, q: 'Un dibujo técnico puede interpretarse de distintas maneras según quién lo lea.', v: false, exp: 'Las normas existen para que todos lo lean igual.' },
    { id: 'm2aa5', tema: 'm2-dibujo-tecnico', tipo: 'calc', niv: 2, gen: 'm2formato' },
    { id: 'm2aa6', tema: 'm2-dibujo-tecnico', tipo: 'ab', niv: 2, q: '¿Qué datos lleva el cuadro de datos de un plano y para qué sirve cada uno?', r: 'Pieza (qué es), dibujante y fecha (quién y cuándo), escala (relación con el tamaño real), unidades (mm), método de proyección (cómo leer las vistas), material (de qué se fabrica) y número de plano (para encontrarlo).' },
    // unidades
    { id: 'm2ab1', tema: 'm2-unidades', tipo: 'om', niv: 1, q: '¿Cuántos milímetros tiene una pulgada?', op: ['25.4', '2.54', '10', '12'] },
    { id: 'm2ab2', tema: 'm2-unidades', tipo: 'calc', niv: 2, gen: 'm2conv' },
    { id: 'm2ab3', tema: 'm2-unidades', tipo: 'om', niv: 2, q: '¿Qué norma establece el sistema de unidades oficial en México?', op: ['NOM-008-SE-2021', 'NOM-017-STPS-2024', 'NOM-001-SEDE-2012', 'NOM-Z-68-1986'] },
    { id: 'm2ab4', tema: 'm2-unidades', tipo: 'vf', niv: 2, q: 'En un plano mecánico se escribe «mm» junto a cada cota.', v: false, exp: 'Se aclara una vez en el cuadro de datos: «Medidas en mm».' },
    { id: 'm2ab5', tema: 'm2-unidades', tipo: 'om', niv: 2, q: '¿Con qué instrumento mides el diámetro interior de un barreno de 10 mm?', op: ['Vernier, con sus puntas de interiores', 'Flexómetro', 'Transportador', 'Escuadra de 45°'] },
    { id: 'm2ab6', tema: 'm2-unidades', tipo: 'ab', niv: 2, q: 'Explica cómo conviertes 5/8 in a milímetros.', r: '5 ÷ 8 = 0.625 in; 0.625 × 25.4 = 15.875 mm.' },
    // líneas
    { id: 'm2ac1', tema: 'm2-lineas', tipo: 'om', niv: 1, q: '¿Qué línea representa las aristas ocultas?', op: ['Discontinua fina', 'Continua gruesa', 'Trazo largo y punto', 'Continua fina'] },
    { id: 'm2ac2', tema: 'm2-lineas', tipo: 'om', niv: 1, q: '¿Con qué línea se dibujan los ejes de simetría y los centros de barrenos?', op: ['Trazo largo y punto', 'Discontinua', 'Continua gruesa', 'Zigzag'] },
    { id: 'm2ac3', tema: 'm2-lineas', tipo: 'om', niv: 2, q: '¿Qué proporción de grosor hay entre la línea gruesa y la fina?', op: ['2 a 1', '1 a 1', '3 a 1', '4 a 1'] },
    { id: 'm2ac4', tema: 'm2-lineas', tipo: 'vf', niv: 2, q: 'Las líneas de cota se dibujan con línea continua fina.', v: true, exp: 'Igual que las auxiliares, las de referencia y el rayado de los cortes.' },
    { id: 'm2ac5', tema: 'm2-lineas', tipo: 'om', niv: 2, q: 'Si una arista visible coincide con una oculta, ¿cuál dibujas?', op: ['La visible', 'La oculta', 'Las dos, una encima de otra', 'Ninguna'] },
    { id: 'm2ac6', tema: 'm2-lineas', tipo: 'om', niv: 2, q: '¿Qué alturas de letra normalizada son comunes en una lámina A4?', op: ['5 mm para títulos y 3.5 mm para cotas', '1 mm para todo', '20 mm para las cotas', 'La que quepa'] },
    // geometría
    { id: 'm2ad1', tema: 'm2-geometria', tipo: 'om', niv: 1, q: 'El lado de un hexágono regular inscrito en una circunferencia mide…', op: ['Lo mismo que el radio', 'Lo mismo que el diámetro', 'La mitad del radio', 'El doble del diámetro'] },
    { id: 'm2ad2', tema: 'm2-geometria', tipo: 'om', niv: 2, q: 'En el punto de tangencia, ¿cómo es la recta tangente respecto al radio?', op: ['Perpendicular', 'Paralela', 'A 45°', 'A 30°'] },
    { id: 'm2ad3', tema: 'm2-geometria', tipo: 'om', niv: 2, q: '¿Dónde está el centro del arco que enlaza dos rectas con un radio r?', op: ['En el cruce de dos paralelas a distancia r de cada recta', 'En la esquina donde se unen las rectas', 'A la mitad de una de las rectas', 'En cualquier punto entre las rectas'] },
    { id: 'm2ad4', tema: 'm2-geometria', tipo: 'vf', niv: 2, q: 'En dos circunferencias tangentes, los centros y el punto de contacto están alineados.', v: true, exp: 'El punto de tangencia está sobre la recta que une los centros.' },
    { id: 'm2ad5', tema: 'm2-geometria', tipo: 'om', niv: 2, q: '¿Qué herramienta de FreeCAD redondea una arista como un enlace?', op: ['Fillet', 'Pad', 'Pocket', 'Mirror'] },
    { id: 'm2ad6', tema: 'm2-geometria', tipo: 'ab', niv: 2, q: 'Describe cómo trazas la mediatriz de un segmento con compás.', r: 'Con una abertura mayor que la mitad del segmento trazo arcos desde cada extremo, arriba y abajo; uno los dos cruces: la recta es perpendicular al segmento y pasa por su punto medio.' },
    // escalas
    { id: 'm2ae1', tema: 'm2-escalas', tipo: 'om', niv: 1, q: '¿Qué tipo de escala es 1:5?', op: ['De reducción', 'De ampliación', 'Natural', 'De ajuste a la página'] },
    { id: 'm2ae2', tema: 'm2-escalas', tipo: 'calc', niv: 2, gen: 'm2escala' },
    { id: 'm2ae3', tema: 'm2-escalas', tipo: 'om', niv: 2, q: '¿Qué número escribes en la cota de una pieza de 240 mm dibujada a escala 1:2?', op: ['240', '120', '480', '2'] },
    { id: 'm2ae4', tema: 'm2-escalas', tipo: 'vf', niv: 1, q: 'La escala 2:1 hace el dibujo más grande que la pieza.', v: true, exp: 'Es de ampliación: 1 mm real se dibuja de 2 mm.' },
    { id: 'm2ae5', tema: 'm2-escalas', tipo: 'om', niv: 2, q: '¿Qué escala usarías para dibujar un engrane de reloj de 6 mm de diámetro en una hoja A4?', op: ['10:1', '1:1', '1:10', '1:100'] },
    { id: 'm2ae6', tema: 'm2-escalas', tipo: 'ab', niv: 2, q: '¿Por qué la cota siempre dice la medida real aunque el dibujo esté a escala?', r: 'Porque quien fabrica la pieza lee el número, no mide el papel; la escala solo sirve para que el dibujo quepa o se vea bien.' },
    // isométrico
    { id: 'm2af1', tema: 'm2-isometrico', tipo: 'om', niv: 1, q: '¿Qué ángulo forman con la horizontal los dos ejes isométricos que no son verticales?', op: ['30°', '45°', '60°', '90°'] },
    { id: 'm2af2', tema: 'm2-isometrico', tipo: 'om', niv: 2, q: '¿Qué escuadra usas para trazar los ejes isométricos?', op: ['La de 30-60°', 'La de 45°', 'Ninguna: se traza a mano', 'Solo el transportador'] },
    { id: 'm2af3', tema: 'm2-isometrico', tipo: 'om', niv: 2, q: '¿Cómo se ve en isométrico un círculo de una cara de la pieza?', op: ['Como una elipse', 'Como un círculo', 'Como un rombo', 'Como un cuadrado'] },
    { id: 'm2af4', tema: 'm2-isometrico', tipo: 'vf', niv: 2, q: 'En el dibujo isométrico se miden las longitudes reales sobre las líneas paralelas a los ejes.', v: true, exp: 'Las líneas inclinadas no: se ubican sus extremos y se unen.' },
    { id: 'm2af5', tema: 'm2-isometrico', tipo: 'vf', niv: 2, q: 'En isométrico normalmente se dibujan todas las aristas ocultas.', v: false, exp: 'Solo se dibuja lo visible para que el dibujo sea claro.' },
    { id: 'm2af6', tema: 'm2-isometrico', tipo: 'ab', niv: 2, q: 'Explica el método de la caja para dibujar una pieza en isométrico.', r: 'Dibujo una caja con el largo, fondo y alto totales sobre los ejes isométricos y luego recorto escalones, caras inclinadas y huecos midiendo sobre aristas paralelas a los ejes.' },
    // vistas
    { id: 'm2ag1', tema: 'm2-vistas', tipo: 'om', niv: 1, q: 'En primer diedro (ISO-E), ¿dónde se dibuja la vista superior?', op: ['Abajo de la vista frontal', 'Arriba de la vista frontal', 'A la derecha de la frontal', 'A la izquierda de la frontal'] },
    { id: 'm2ag2', tema: 'm2-vistas', tipo: 'om', niv: 2, q: 'En primer diedro, la vista lateral izquierda se dibuja…', op: ['A la derecha de la frontal', 'A la izquierda de la frontal', 'Arriba de la frontal', 'Abajo de la superior'] },
    { id: 'm2ag3', tema: 'm2-vistas', tipo: 'om', niv: 2, q: '¿Qué medida comparten la vista frontal y la lateral?', op: ['La altura', 'El largo', 'El fondo', 'Ninguna'] },
    { id: 'm2ag4', tema: 'm2-vistas', tipo: 'vf', niv: 2, q: 'En tercer diedro (método americano) la vista superior va arriba de la frontal.', v: true, exp: 'Es al revés que en el primer diedro.' },
    { id: 'm2ag5', tema: 'm2-vistas', tipo: 'om', niv: 2, q: '¿Qué vista eliges como frontal?', op: ['La que más información da de la forma', 'La más pequeña', 'La de abajo', 'Cualquiera, da igual'] },
    { id: 'm2ag6', tema: 'm2-vistas', tipo: 'ab', niv: 3, q: '¿Por qué es peligroso no indicar el método de proyección en un plano?', r: 'Porque en primer diedro la superior va abajo y en tercer diedro arriba (y las laterales se intercambian); quien lea con el método equivocado puede fabricar la pieza al revés o en espejo.' },
    // acotación
    { id: 'm2ah1', tema: 'm2-acotacion', tipo: 'om', niv: 1, q: '¿Qué significa el símbolo Ø en una cota?', op: ['Diámetro', 'Radio', 'Cuadrado', 'Ángulo'] },
    { id: 'm2ah2', tema: 'm2-acotacion', tipo: 'calc', niv: 2, gen: 'm2cadena' },
    { id: 'm2ah3', tema: 'm2-acotacion', tipo: 'om', niv: 2, q: '¿Dónde se colocan las cotas?', op: ['Fuera del contorno, sin cruzarse', 'Dentro de la pieza', 'Sobre las líneas ocultas', 'Donde haya espacio, aunque se crucen'] },
    { id: 'm2ah4', tema: 'm2-acotacion', tipo: 'vf', niv: 2, q: 'Una misma medida se puede repetir en dos vistas para que se lea mejor.', v: false, exp: 'Cada medida aparece una sola vez.' },
    { id: 'm2ah5', tema: 'm2-acotacion', tipo: 'om', niv: 2, q: '¿Qué ventaja tiene acotar en paralelo, desde una referencia?', op: ['Cada medida es independiente y los errores no se acumulan', 'Ocupa menos espacio', 'No necesita números', 'Solo sirve para círculos'] },
    { id: 'm2ah6', tema: 'm2-acotacion', tipo: 'om', niv: 2, q: '¿Qué significa «4× Ø6»?', op: ['Cuatro barrenos de 6 mm de diámetro', 'Un barreno de 24 mm', 'Cuatro barrenos de 6 mm de radio', 'Un barreno de 6 mm y 4 mm de profundidad'] },
    // cortes
    { id: 'm2ai1', tema: 'm2-cortes', tipo: 'om', niv: 1, q: '¿Para qué sirve un corte?', op: ['Para ver el interior sin llenar la vista de líneas ocultas', 'Para ahorrar papel', 'Para indicar el material', 'Para cambiar la escala'] },
    { id: 'm2ai2', tema: 'm2-cortes', tipo: 'om', niv: 2, q: '¿Qué se raya en un corte?', op: ['Solo las superficies donde el plano de corte toca material', 'Los huecos', 'Toda la vista', 'Las líneas ocultas'] },
    { id: 'm2ai3', tema: 'm2-cortes', tipo: 'om', niv: 2, q: '¿Con qué inclinación se dibuja normalmente el rayado?', op: ['45°', '90°', '30°', '0°'] },
    { id: 'm2ai4', tema: 'm2-cortes', tipo: 'vf', niv: 2, q: 'Los tornillos y ejes macizos se dibujan cortados a lo largo cuando el plano de corte pasa por ellos.', v: false, exp: 'Se dibujan sin cortar; se cortan las piezas huecas o de forma interior compleja.' },
    { id: 'm2ai5', tema: 'm2-cortes', tipo: 'om', niv: 2, q: '¿Cómo se indica el plano de corte en otra vista?', op: ['Trazo largo y punto con extremos gruesos, flechas y letras', 'Una línea continua gruesa', 'Una línea discontinua', 'Solo con una nota escrita'] },
    { id: 'm2ai6', tema: 'm2-cortes', tipo: 'om', niv: 2, q: '¿Qué tipo de corte conviene en una pieza simétrica?', op: ['Medio corte', 'Corte total siempre', 'Ninguno', 'Sección de un detalle'] },
    // FreeCAD
    { id: 'm2aj1', tema: 'm2-freecad-entorno', tipo: 'om', niv: 1, q: '¿Qué banco de trabajo de FreeCAD usas para hacer piezas sólidas?', op: ['Part Design', 'TechDraw', 'Assembly', 'Spreadsheet'] },
    { id: 'm2aj2', tema: 'm2-freecad-entorno', tipo: 'om', niv: 1, q: '¿Qué muestra el árbol del modelo?', op: ['Los croquis y operaciones en el orden en que se hicieron', 'Las carpetas de Windows', 'Las capas de colores', 'Las impresiones'] },
    { id: 'm2aj3', tema: 'm2-freecad-entorno', tipo: 'om', niv: 2, q: '¿Dónde configuras las unidades en FreeCAD?', op: ['Editar → Preferencias → General → Unidades', 'Ver → Escala', 'Archivo → Exportar', 'En la herramienta de cota'] },
    { id: 'm2aj4', tema: 'm2-freecad-entorno', tipo: 'vf', niv: 2, q: 'Un modelo paramétrico se actualiza solo al cambiar una medida.', v: true, exp: 'Es su ventaja principal frente a dibujar trazos sueltos.' },
    { id: 'm2aj5', tema: 'm2-freecad-entorno', tipo: 'om', niv: 2, q: '¿Qué tecla muestra la vista isométrica en FreeCAD?', op: ['0', '1', '2', 'I'] },
    { id: 'm2aj6', tema: 'm2-freecad-entorno', tipo: 'ab', niv: 2, q: 'Escribe en orden los pasos para hacer una placa con barrenos en Part Design.', r: 'Create body; Create sketch en el plano XY; rectángulo y círculos; restricciones hasta que quede totalmente restringido; cerrar el croquis; Pad con el espesor; guardar con mi apellido.' },
    // modelado 3D
    { id: 'm2ak1', tema: 'm2-modelado-3d', tipo: 'om', niv: 1, q: '¿Qué operación le da espesor a un croquis?', op: ['Pad', 'Pocket', 'Fillet', 'Mirror'] },
    { id: 'm2ak2', tema: 'm2-modelado-3d', tipo: 'om', niv: 2, q: '¿Qué operación usarías para modelar una polea?', op: ['Revolution', 'Pad', 'Thickness', 'Chamfer'] },
    { id: 'm2ak3', tema: 'm2-modelado-3d', tipo: 'om', niv: 2, q: '¿Qué hace Thickness?', op: ['Ahueca un sólido dejando paredes de espesor fijo', 'Hace un barreno', 'Redondea aristas', 'Repite una operación'] },
    { id: 'm2ak4', tema: 'm2-modelado-3d', tipo: 'vf', niv: 2, q: 'Conviene hacer los redondeos y chaflanes al final del modelo.', v: true, exp: 'Así no se rompen si cambia la forma principal.' },
    { id: 'm2ak5', tema: 'm2-modelado-3d', tipo: 'om', niv: 2, q: 'Para Revolution, ¿qué parte del perfil se dibuja?', op: ['Medio perfil, de un lado del eje', 'El perfil completo, de los dos lados del eje', 'Solo el contorno exterior', 'Un círculo'] },
    { id: 'm2ak6', tema: 'm2-modelado-3d', tipo: 'ab', niv: 3, q: 'Escribe el plan de modelado de una caja abierta de 60 × 40 × 30 con esquinas redondeadas y paredes de 2 mm.', r: 'Croquis rectangular de 60 × 40 centrado en el origen; Pad de 30; Fillet en las 4 aristas verticales; Thickness de 2 mm quitando la cara de arriba.' },
    // TechDraw
    { id: 'm2al1', tema: 'm2-techdraw', tipo: 'om', niv: 1, q: '¿Qué banco de FreeCAD sirve para hacer planos?', op: ['TechDraw', 'Part Design', 'Sketcher', 'Assembly'] },
    { id: 'm2al2', tema: 'm2-techdraw', tipo: 'om', niv: 2, q: '¿Qué herramienta inserta frente, superior y lateral a la vez?', op: ['Insert Projection Group', 'Insert Default Page', 'Export Page as PDF', 'Balloon'] },
    { id: 'm2al3', tema: 'm2-techdraw', tipo: 'om', niv: 2, q: '¿Cómo debes imprimir un plano para que salga a escala?', op: ['Al 100 %, tamaño real', 'Ajustado a la página', 'Al 50 %', 'Como captura de pantalla'] },
    { id: 'm2al4', tema: 'm2-techdraw', tipo: 'vf', niv: 2, q: 'Si cambias una medida del modelo, las vistas de TechDraw se actualizan.', v: true, exp: 'Las vistas salen del modelo 3D.' },
    { id: 'm2al5', tema: 'm2-techdraw', tipo: 'om', niv: 2, q: '¿Dónde eliges primer o tercer diedro en TechDraw?', op: ['En el Projection Type del grupo de proyección', 'En las preferencias de la impresora', 'En el croquis', 'No se puede elegir'] },
    { id: 'm2al6', tema: 'm2-techdraw', tipo: 'ab', niv: 2, q: '¿Cómo compruebas que tu plano impreso está a escala 1:1?', r: 'Mido con regla una cota grande en el papel; si la cota dice 80 y mide 80 mm, la escala es correcta.' },
    // materiales
    { id: 'm2am1', tema: 'm2-materiales', tipo: 'om', niv: 1, q: '¿Cómo se calcula la masa de una pieza?', op: ['Volumen × densidad', 'Volumen ÷ densidad', 'Largo × ancho', 'Densidad ÷ volumen'] },
    { id: 'm2am2', tema: 'm2-materiales', tipo: 'calc', niv: 2, gen: 'm2masa' },
    { id: 'm2am3', tema: 'm2-materiales', tipo: 'om', niv: 2, q: '¿Cuál de estos materiales es el más denso?', op: ['Acero', 'Aluminio', 'Acrílico', 'MDF'] },
    { id: 'm2am4', tema: 'm2-materiales', tipo: 'vf', niv: 2, q: 'Reciclar aluminio ahorra cerca del 95 % de la energía de fabricarlo nuevo.', v: true, exp: 'Por eso el aluminio reciclado es tan valioso.' },
    { id: 'm2am5', tema: 'm2-materiales', tipo: 'om', niv: 2, q: '¿Qué decisión de diseño reduce el impacto ambiental de una pieza?', op: ['Quitar material donde no hace falta', 'Hacerla más gruesa por si acaso', 'Usar siempre acero', 'Pintarla'] },
    { id: 'm2am6', tema: 'm2-materiales', tipo: 'ab', niv: 3, q: 'Justifica qué material elegirías para el soporte de un sensor ligero en un lugar seco.', r: 'Aluminio, o MDF o acrílico si el esfuerzo es muy bajo: no hay humedad y carga poco. El aluminio es ligero, resistente y muy reciclable; el MDF es barato y fácil de cortar, pero difícil de reciclar. El acero pesaría de más.' }
  ];

  /* =================== IDEAS =================== */
  const S1 = ['II-1'];
  const ideas = [
    { id: 'm2-dictado-dibujo', titulo: 'Dictado de dibujo', sm: S1, tipo: 'Dinámica', dur: '15 min', costo: '$0', obj: 'Descubrir por qué hacen falta normas para describir una pieza.', mat: ['Una pieza sencilla escondida en una bolsa', 'Hojas'],
      pasos: ['Un alumno ve la pieza y la describe sin gestos y sin decir «como un…».', 'Los demás la dibujan sin preguntar.', 'Comparan sus dibujos con la pieza real.', 'Repiten permitiendo medidas y palabras como «vista de frente».'], evid: 'Los dos dibujos en la libreta con una conclusión', tip: 'La segunda ronda mejora tanto que ellos solos concluyen para qué sirven las normas.' },
    { id: 'm2-caligrafia-tecnica', titulo: 'Rotulación con líneas guía', sm: S1, tipo: 'Práctica', dur: '10 min', costo: '$0', obj: 'Rotular con letras de altura pareja y legibles.', mat: ['Hojas con líneas guía de 5 y 3.5 mm', 'Lápiz HB'],
      pasos: ['Trazan líneas guía tenues de 5 mm.', 'Copian el alfabeto en mayúsculas rectas.', 'Escriben su nombre y el de la pieza del proyecto.', 'Intercambian y marcan las letras que salieron de la guía.'], evid: 'Renglones de rotulación en la libreta', tip: 'Cinco minutos al inicio de cada clase de láminas bastan para que en dos semanas rotulen parejo.' },
    { id: 'm2-carrera-conversiones', titulo: 'Relevos de conversiones', sm: S1, tipo: 'Dinámica', dur: '15 min', costo: '$0', obj: 'Practicar conversiones entre pulgadas y milímetros con rapidez y sin errores.', mat: ['Tarjetas con medidas en pulgadas y en mm', 'Calculadora'],
      pasos: ['Equipos en fila frente al pizarrón.', 'El primero toma una tarjeta, convierte y escribe el resultado.', 'Si está bien, pasa el siguiente; si no, lo corrige su equipo.', 'Gana el equipo con más conversiones correctas en 8 minutos.'], evid: 'Lista de conversiones del equipo', tip: 'Incluye objetos reales (broca de 3/8, llave de 1/2) para que vean que la pulgada sigue viva en el taller.' },
    { id: 'm2-escala-salon', titulo: 'Plano del salón a escala 1:50', sm: S1, tipo: 'Práctica', dur: '50 min', costo: '$0', obj: 'Aplicar escalas midiendo un espacio real.', mat: ['Flexómetro', 'Hojas', 'Escuadras'],
      pasos: ['Por equipos miden el salón, puertas, ventanas y el escritorio.', 'Convierten a escala 1:50 (cada metro = 20 mm).', 'Dibujan el plano con cotas reales.', 'Comparan: ¿cabe el plano en una hoja carta?'], evid: 'Plano del salón con escala y cotas', tip: 'Pregunta qué escala usarían para una nave industrial de 80 m: así entienden por qué existen 1:100 y 1:200.' },
    { id: 'm2-cubos-iso', titulo: 'Cubos e isométricos', sm: S1, tipo: 'Práctica', dur: '20 min', costo: '$0', obj: 'Pasar de un objeto 3D a su isométrico y de regreso.', mat: ['Cubos de madera o cajas de cerillos', 'Papel isométrico impreso'],
      pasos: ['Un equipo arma una figura con 5 a 8 cubos y la dibuja en papel isométrico.', 'Otro equipo la arma viendo solo el dibujo.', 'Comparan figura y dibujo.', 'Cambian de papel: ahora del dibujo a la figura.'], evid: 'Isométricos de las figuras', tip: 'Las cajas de cerillos vacías sirven de cubos y caben en el bolsillo.' },
    { id: 'm2-caja-proyeccion', titulo: 'Caja de proyección de cartón', sm: S1, tipo: 'Práctica', dur: '30 min', costo: '$0', obj: 'Entender de dónde salen las vistas y por qué se acomodan así.', mat: ['Caja de cartón abierta por un lado', 'Una pieza sencilla', 'Plumón'],
      pasos: ['Meten la pieza en la caja y miran por cada lado.', 'Dibujan en cada cara interior lo que ven de frente.', 'Desdoblan la caja sobre la mesa.', 'Comparan cómo quedan las vistas con el primer diedro.'], evid: 'Caja desdoblada con las vistas', tip: 'Con la caja desdoblada se ve claro por qué la superior queda abajo del frente en primer diedro.' },
    { id: 'm2-pieza-misteriosa', titulo: 'La pieza misteriosa', sm: S1, tipo: 'Proyector', dur: '15 min', costo: '$0', obj: 'Imaginar el volumen a partir de las vistas.', mat: ['Proyector con 3 vistas de una pieza'],
      pasos: ['Proyecta solo la vista frontal: ¿qué podría ser?', 'Agrega la superior: descartan opciones.', 'Agrega la lateral y dibujan el isométrico.', 'Revela la pieza o su modelo en FreeCAD.'], evid: 'Isométrico en la libreta', tip: 'Elige piezas donde dos vistas no basten: así descubren para qué sirve la tercera.' },
    { id: 'm2-error-plano', titulo: 'Los 10 errores del plano', sm: S1, tipo: 'Proyector', dur: '15 min', costo: '$0', obj: 'Reconocer errores de acotación y de líneas antes de cometerlos.', mat: ['Plano con 10 errores sembrados'],
      pasos: ['Proyecta el plano con errores (cotas repetidas, cruzadas, sin escala, línea equivocada).', 'En parejas los buscan durante 5 minutos.', 'Revelas uno por uno y explican la regla.', 'Cada pareja corrige en su libreta los tres que no vio.'], evid: 'Lista de errores corregidos', tip: 'Usa un plano hecho por ti; los alumnos disfrutan encontrar los errores del profesor.' },
    { id: 'm2-croquis-casa', titulo: 'Croquis de un objeto de casa', sm: S1, tipo: 'Práctica', dur: '1 h', costo: '$0', obj: 'Practicar medición y croquis acotado con un objeto propio.', mat: ['Un objeto de casa (perilla, bisagra, soporte, gancho)', 'Regla o vernier'],
      pasos: ['Eligen el frente del objeto.', 'Dibujan a mano alzada el isométrico y las vistas.', 'Miden y acotan cada medida una vez.', 'Un compañero revisa si podría fabricarlo.'], evid: 'Croquis acotado', tip: 'Las piezas de repuesto del plantel (bisagras, soportes de mesa) sirven también para el catálogo del proyecto.' },
    { id: 'm2-materiales-huella', titulo: 'La huella del material', sm: S1, tipo: 'Dinámica', dur: '20 min', costo: '$0', obj: 'Comparar materiales por masa, costo y fin de vida.', mat: ['Muestras de aluminio, acero, acrílico y MDF', 'Báscula de cocina'],
      pasos: ['Pesan muestras del mismo tamaño.', 'Calculan la masa de su pieza en cada material.', 'Discuten de dónde viene cada material y qué pasa al tirarlo.', 'Eligen material y escriben la justificación.'], evid: 'Tabla de comparación y justificación', tip: 'Una lata de aluminio y un tornillo de acero bastan para empezar la conversación del reciclaje.' },
    { id: 'm2-galeria-laminas', titulo: 'Galería de láminas', sm: S1, tipo: 'Evaluación', dur: '20 min', costo: '$0', obj: 'Aprender de las láminas de los demás con una lista de cotejo.', mat: ['Láminas en las paredes', 'Notas adhesivas', 'Lista de cotejo'],
      pasos: ['Pegan sus láminas en la pared.', 'Recorren la galería con la lista de cotejo.', 'Dejan una nota con algo bien hecho y algo que mejorar.', 'Cada quien lee sus notas y corrige una cosa.'], evid: 'Lámina con su corrección', tip: 'Pide notas concretas («las cotas cruzan») en vez de «está bonito».' },
    { id: 'm2-jabon-vistas', titulo: 'Tallar la pieza a partir de sus vistas', sm: S1, tipo: 'Práctica', dur: '50 min', costo: '$', obj: 'Comprobar que entienden las vistas fabricando el volumen.', mat: ['Barra de jabón o plastilina', 'Palillo o cuchara de plástico (sin navajas)', 'Vistas impresas de una pieza sencilla'],
      pasos: ['Cada equipo recibe las tres vistas de una pieza.', 'Marcan las vistas en las caras del jabón.', 'Tallan quitando material poco a poco.', 'Comparan su pieza con el isométrico que proyectas.'], evid: 'Pieza tallada y foto de las manos trabajando (sin rostros)', tip: 'Usa piezas con escalones y una cara inclinada: no necesitan herramientas de filo.' }
  ];

  /* =================== FIGURAS (SVG, sin internet) =================== */
  const d = E.fig.d, ln = d.ln, ci = d.ci, rc = d.rc, tx = d.tx, pl = d.pl, pg = d.pg, PI = Math.PI;
  const r1 = n => Math.round(n * 10) / 10;
  // línea de eje (trazo largo y punto)
  const eje = (a, b, c) => '<line x1="' + r1(a[0]) + '" y1="' + r1(a[1]) + '" x2="' + r1(b[0]) + '" y2="' + r1(b[1]) + '" class="' + (c || 'none2') + '" stroke-dasharray="14 4 2 4"/>';
  // rayado a 45° dentro de rectángulos [x0, y0, x1, y1] (las líneas siguen x + y = c y quedan alineadas entre rectángulos)
  const rayado = (rs, paso) => { let s = ''; paso = paso || 9; const cmin = Math.min.apply(null, rs.map(q => q[0] + q[1])), cmax = Math.max.apply(null, rs.map(q => q[2] + q[3]));
    for (let c = Math.ceil(cmin / paso) * paso; c <= cmax; c += paso) rs.forEach(q => { const xa = Math.max(q[0], c - q[3]), xb = Math.min(q[2], c - q[1]); if (xb - xa > 0.5) s += ln([xa, c - xa], [xb, c - xb], 'hatch'); });
    return s; };
  const cota = (a, b, t, p, c) => d.flecha([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], a, c || 'k2', 7) + d.flecha([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], b, c || 'k2', 7) + (t ? tx(p, t, 'tb') : '');
  const figs = {
    m2formato: { t: 'Lámina A4 con margen y cuadro de datos', d: 'Margen de 20 mm a la izquierda para archivar y de 10 mm en los demás lados; el cuadro de datos va abajo a la derecha (ISO 5457 e ISO 7200).', w: 480, h: 262, anim: false, draw: () => {
      let s = rc(24, 10, 168, 237.6, 'fill2', 0) + rc(40, 18, 144, 221.6, 'none3', 0);
      s += ln([40, 207.6], [184, 207.6], 'k2') + ln([40, 223.6], [184, 223.6], 'k2') + ln([128, 207.6], [128, 223.6], 'k2') + ln([92, 223.6], [92, 239.6], 'k2') + ln([160, 223.6], [160, 239.6], 'k2');
      s += tx([84, 219.5], 'PIEZA', 'tbs') + tx([156, 219.5], 'ESCALA', 'tbs') + tx([66, 235.5], 'DIBUJÓ', 'tbs') + tx([126, 235.5], 'MATERIAL', 'tbs');
      s += pg([[163, 229.6], [170, 227], [170, 236.2], [163, 233.6]], 'fill2') + ci([177, 231.6], 4.5, 'k2') + ci([177, 231.6], 2, 'k2');
      s += d.flecha([32, 120], [24.5, 120], 'k2', 5) + d.flecha([32, 120], [39.5, 120], 'k2', 5) + tx([32, 112], '20', 'tbs');
      s += tx([112, 112], 'Área de dibujo', 'tm') + tx([112, 128], '180 × 277 mm', 'tm');
      s += tx([212, 34], 'Hoja A4 vertical: 210 × 297 mm', 'tb', 'start') + tx([212, 58], 'Margen izquierdo: 20 mm (archivar)', 'tm', 'start') + tx([212, 78], 'Otros márgenes: 10 mm', 'tm', 'start') + tx([212, 98], 'Marco con línea gruesa', 'tm', 'start') + tx([212, 122], 'Cuadro de datos abajo a la derecha', 'ta', 'start');
      s += rc(300, 142, 126, 89, 'fill2', 0) + ln([363, 142], [363, 231], 'oculta') + tx([331.5, 191], 'A4', 'tm') + tx([394.5, 191], 'A4', 'tm');
      return s + tx([363, 252], 'A3 (297 × 420) = dos A4', 'tbs');
    } },
    m2lineas: { t: 'Alfabeto de líneas', d: 'Cada línea tiene un significado fijo (ISO 128); la gruesa mide el doble que la fina.', w: 480, h: 236, anim: false, draw: () => {
      const F = [['Continua gruesa', 'Contornos y aristas visibles'], ['Continua fina', 'Cotas, auxiliares y rayado'], ['Discontinua fina', 'Aristas ocultas'], ['Trazo largo y punto', 'Ejes y centros de barrenos'], ['A mano alzada', 'Rotura de una vista parcial'], ['Trazo y punto, extremos gruesos', 'Plano de corte (A-A)']];
      let s = '';
      F.forEach((r, i) => {
        const y = 30 + 36 * i;
        if (i === 0) s += ln([18, y], [104, y], 'k'); else if (i === 1) s += ln([18, y], [104, y], 'k2'); else if (i === 2) s += ln([18, y], [104, y], 'oculta');
        else if (i === 3) s += eje([18, y], [104, y], 'k2');
        else if (i === 4) { const p = []; for (let x = 18, k = 0; x <= 104; x += 6, k++) p.push([x, y + (k % 2 ? -3 : 3) * (0.6 + 0.4 * Math.sin(k))]); s += pl(p, 'k2'); }
        else s += eje([30, y], [92, y], 'k2') + ln([18, y], [30, y], 'k') + ln([92, y], [104, y], 'k');
        s += tx([116, y - 2], r[0], 'tbs', 'start') + tx([116, y + 13], r[1], 'tm', 'start');
      });
      s += tx([385, 24], 'En una pieza', 'tb') + rc(315, 50, 140, 90, 'fill', 0) + rc(315, 50, 140, 90, 'none3', 0);
      s += ln([373, 50], [373, 140], 'oculta') + ln([397, 50], [397, 140], 'oculta') + eje([385, 40], [385, 150], 'k2');
      s += ln([315, 145], [315, 171], 'k2') + ln([455, 145], [455, 171], 'k2') + cota([315, 165], [455, 165], '60', [385, 159]);
      return s + tx([385, 196], 'barreno: líneas ocultas', 'tm') + tx([385, 214], 'eje: trazo y punto · cota: fina', 'tm');
    } },
    m2iso: { t: 'Dibujo isométrico paso a paso', d: 'Ejes a 30° y vertical; caja con las medidas totales; se recorta el escalón y el barreno se dibuja como elipse.', w: 480, h: 250, anim: true, per: 12, draw: t => {
      const ph = Math.floor((t % 12) / 3), O = [150, 232], k = 2.1, P = (x, y, z) => [O[0] + (x - y) * 0.866 * k, O[1] - (x + y) * 0.5 * k - z * k];
      const T = [62, 92], ux = [0.866, -0.5], uy = [-0.866, -0.5];
      let s = ln([T[0] - 46, T[1]], [T[0] + 46, T[1]], 'none2') + d.flecha(T, [T[0] + 40 * ux[0], T[1] + 40 * ux[1]], ph === 0 ? 'a' : 'k2', 6) + d.flecha(T, [T[0] + 40 * uy[0], T[1] + 40 * uy[1]], ph === 0 ? 'a' : 'k2', 6) + d.flecha(T, [T[0], T[1] - 44], ph === 0 ? 'a' : 'k2', 6);
      s += tx([T[0] + 42, T[1] - 26], 'x', 'tbb') + tx([T[0] - 42, T[1] - 26], 'y', 'tbb') + tx([T[0], T[1] - 50], 'z', 'tbb') + tx([T[0] + 30, T[1] + 14], '30°', 'tm') + tx([T[0] - 30, T[1] + 14], '30°', 'tm');
      s += ln([O[0] - 95, O[1]], [O[0] + 120, O[1]], 'none2');
      const caja = [[0, 0, 0], [60, 0, 0], [60, 40, 0], [0, 40, 0], [0, 0, 30], [60, 0, 30], [60, 40, 30], [0, 40, 30]].map(q => P(q[0], q[1], q[2]));
      if (ph === 0) s += pg([caja[0], caja[3], caja[7], caja[4]], 'fillA') + pg([caja[0], caja[1], caja[5], caja[4]], 'fill') + pg([caja[4], caja[5], caja[6], caja[7]], 'fill2');
      else {
        [[4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [3, 7], [0, 1], [0, 3]].forEach(e => { s += ln(caja[e[0]], caja[e[1]], 'none2'); });
        s += pg([P(0, 0, 0), P(0, 40, 0), P(0, 40, 30), P(0, 20, 30), P(0, 20, 15), P(0, 0, 15)], 'fillA') + pg([P(0, 0, 0), P(60, 0, 0), P(60, 0, 15), P(0, 0, 15)], 'fill');
        s += pg([P(0, 0, 15), P(60, 0, 15), P(60, 20, 15), P(0, 20, 15)], 'fill2') + pg([P(0, 20, 15), P(60, 20, 15), P(60, 20, 30), P(0, 20, 30)], 'fill') + pg([P(0, 20, 30), P(60, 20, 30), P(60, 40, 30), P(0, 40, 30)], 'fill2');
      }
      if (ph >= 2) {
        if (ph === 2) s += pg([P(25, 5, 15), P(35, 5, 15), P(35, 15, 15), P(25, 15, 15)], 'none2');
        const el = []; for (let i = 0; i < 36; i++) { const a = i / 36 * 2 * PI; el.push(P(30 + 5 * Math.cos(a), 10 + 5 * Math.sin(a), 15)); } s += pg(el, 'fill');
      }
      if (ph === 3) { const m1 = P(30, 0, 0), m2 = P(0, 20, 0), m3 = P(0, 40, 15); s += tx([m1[0] + 12, m1[1] + 16], '60', 'ta') + tx([m2[0] - 12, m2[1] + 16], '40', 'ta') + tx([m3[0] - 14, m3[1] + 4], '30', 'ta'); }
      const L = ['1. Ejes a 30° y vertical', '2. Caja 60 × 40 × 30', '3. Recorta el escalón', '4. Rombo → elipse Ø10', '5. Remarca lo visible'], on = [[0, 1], [2], [3], [4]][ph];
      s += tx([316, 40], 'Dibujo isométrico', 'tb', 'start'); L.forEach((x, i) => { s += tx([316, 70 + 24 * i], x, on.indexOf(i) >= 0 ? 'ta' : 'tm', 'start'); });
      return s + tx([390, 210], 'Medidas reales sobre los ejes', 'tm');
    } },
    m2vistas: { t: 'Primer y tercer diedro', d: 'El mismo bloque escalonado: en primer diedro (ISO-E) la superior va abajo del frente; en tercer diedro (ISO-A), arriba. El símbolo va en el cuadro de datos.', w: 480, h: 270, anim: true, per: 12, draw: t => {
      const pri = (t % 12) < 6;
      const frente = (x, y) => rc(x, y, 108, 54, 'fill', 0) + ln([x, y + 27], [x + 108, y + 27], 'k2') + ln([x + 45, y + 27], [x + 45, y + 54], 'oculta') + ln([x + 63, y + 27], [x + 63, y + 54], 'oculta') + eje([x + 54, y + 20], [x + 54, y + 60]) + tx([x + 54, y - 6], 'Frontal', 'tm');
      const sup = (x, y) => rc(x, y, 108, 72, 'fill', 0) + ln([x, y + 36], [x + 108, y + 36], 'k2') + ci([x + 54, y + 54], 9, 'fill2') + eje([x + 41, y + 54], [x + 67, y + 54]) + eje([x + 54, y + 41], [x + 54, y + 67]) + tx([x + 54, y - 6], 'Superior', 'tm');
      const latI = (x, y) => pg([[x, y + 54], [x + 72, y + 54], [x + 72, y + 27], [x + 36, y + 27], [x + 36, y], [x, y]], 'fill') + ln([x + 45, y + 27], [x + 45, y + 54], 'oculta') + ln([x + 63, y + 27], [x + 63, y + 54], 'oculta') + eje([x + 54, y + 20], [x + 54, y + 60]) + tx([x + 36, y - 6], 'Lateral izquierda', 'tm');
      const latD = (x, y) => pg([[x, y + 54], [x + 72, y + 54], [x + 72, y], [x + 36, y], [x + 36, y + 27], [x, y + 27]], 'fill') + ln([x + 9, y + 27], [x + 9, y + 54], 'oculta') + ln([x + 27, y + 27], [x + 27, y + 54], 'oculta') + eje([x + 18, y + 20], [x + 18, y + 60]) + tx([x + 36, y - 6], 'Lateral derecha', 'tm');
      let s = '';
      if (pri) s += frente(30, 34) + sup(30, 112) + latI(162, 34) + ln([30, 92], [30, 108], 'none2') + ln([138, 92], [138, 108], 'none2') + ln([142, 34], [158, 34], 'none2') + ln([142, 88], [158, 88], 'none2');
      else s += sup(30, 22) + frente(30, 118) + latD(162, 118) + ln([30, 98], [30, 114], 'none2') + ln([138, 98], [138, 114], 'none2') + ln([142, 118], [158, 118], 'none2') + ln([142, 172], [158, 172], 'none2');
      s += tx([258, 34], pri ? 'Primer diedro (ISO-E)' : 'Tercer diedro (ISO-A)', 'tb', 'start') + tx([258, 56], pri ? 'Método europeo' : 'Método americano', 'tm', 'start');
      s += tx([258, 80], pri ? 'Superior: abajo del frente' : 'Superior: arriba del frente', 'ta', 'start') + tx([258, 100], pri ? 'Lateral izquierda: a la derecha' : 'Lateral derecha: a la derecha', 'ta', 'start');
      const cono = x => pg([[x, 165], [x + 40, 155], [x + 40, 195], [x, 185]], 'fill2'), circ = x => ci([x, 175], 20, 'fill2') + ci([x, 175], 10, 'k2');
      s += pri ? cono(290) + circ(370) : circ(310) + cono(350);
      s += eje([280, 175], [400, 175]) + eje(pri ? [370, 150] : [310, 150], pri ? [370, 200] : [310, 200]);
      return s + tx([340, 222], 'Símbolo en el cuadro de datos', 'tm') + tx([340, 244], 'Escuadra usa primer diedro', 'tm');
    } },
    m2acota: { t: 'Elementos de una cota', d: 'Línea auxiliar, línea de cota con flechas y cifra con la medida real. Barrenos ubicados por su centro, en paralelo desde una referencia.', w: 480, h: 272, anim: false, draw: () => {
      let s = rc(100, 60, 240, 120, 'fill', 0) + rc(100, 60, 240, 120, 'none3', 0) + ci([136, 120], 12, 'fill2') + ci([304, 120], 12, 'fill2');
      [136, 304].forEach(x => { s += eje([x - 20, 120], [x + 20, 120]) + eje([x, 100], [x, 140]); });
      s += ln([100, 184], [100, 213], 'k2') + ln([340, 184], [340, 213], 'k2') + cota([100, 206], [340, 206], '80', [220, 200]);
      s += ln([96, 60], [67, 60], 'k2') + ln([96, 180], [67, 180], 'k2') + cota([74, 60], [74, 180]) + tx([64, 124], '40', 'tb', 'end');
      s += ln([100, 56], [100, 16], 'k2') + ln([136, 56], [136, 37], 'k2') + ln([304, 56], [304, 17], 'k2') + cota([100, 44], [136, 44], '12', [118, 38]) + cota([100, 24], [304, 24], '68', [202, 18]);
      s += ln([344, 120], [380, 120], 'k2') + ln([344, 180], [380, 180], 'k2') + cota([373, 120], [373, 180]) + tx([382, 155], '20', 'tb', 'start');
      s += ln([312.5, 111.5], [350, 84], 'k2') + ln([350, 84], [362, 84], 'k2') + tx([366, 88], '2× Ø8', 'tb', 'start');
      s += d.flecha([100, 238], [100, 217], 'b', 6) + tx([100, 251], 'línea auxiliar', 'tm');
      s += d.flecha([172, 252], [160, 210], 'b', 6) + tx([180, 265], 'línea de cota', 'tm');
      s += d.flecha([262, 238], [230, 204], 'b', 6) + tx([280, 251], 'cifra de cota', 'tm');
      return s + tx([440, 251], 'en mm', 'tm');
    } },
    m2escala: { t: 'Una pieza, tres escalas', d: 'La placa de 60 × 30 con un barreno de 10 mm dibujada a 1:2, 1:1 y 2:1. Cambia el tamaño en el papel; las cotas no.', w: 480, h: 250, anim: false, draw: () => {
      let s = ''; const S = 1.4;
      [[0.5, 60, '1:2', '30 × 15'], [1, 190, '1:1', '60 × 30'], [2, 378, '2:1', '120 × 60']].forEach(q => {
        const k = q[0], cx = q[1], w = 60 * k * S, h = 30 * k * S, x = cx - w / 2, y = 170 - h, rr = 5 * k * S, cy = 170 - h / 2;
        s += rc(x, y, w, h, 'fill', 0) + rc(x, y, w, h, 'none3', 0) + ci([cx, cy], rr, 'fill2') + eje([cx - rr - 5, cy], [cx + rr + 5, cy]) + eje([cx, cy - rr - 5], [cx, cy + rr + 5]);
        s += cota([x, y - 12], [x + w, y - 12], '60', [cx, y - 17]) + cota([x - 10, y], [x - 10, 170]) + tx([x - 15, cy + 5], '30', 'tbs', 'end');
        s += k < 2 ? tx([x + w + 6, cy + 4], 'Ø10', 'tbs', 'start') : tx([cx, cy + rr + 18], 'Ø10', 'tbs');
        s += tx([cx, 196], 'Escala ' + q[2], 'tb') + tx([cx, 212], 'en el papel: ' + q[3], 'tm');
      });
      return s + tx([240, 240], 'La cota siempre dice la medida real: 60, 30 y Ø10', 'ta');
    } },
    m2corte: { t: 'Corte A-A de un buje', d: 'El plano de corte se marca con trazo y punto, extremos gruesos, flechas y letras. En el corte se raya solo donde hay material.', w: 480, h: 260, anim: false, draw: () => {
      const c = [110, 130];
      let s = ci(c, 60, 'fill') + ci(c, 42, 'k2') + ci(c, 30, 'fill2') + eje([110, 62], [110, 198]);
      s += eje([44, 130], [176, 130], 'k2') + ln([28, 130], [44, 130], 'k') + ln([176, 130], [192, 130], 'k') + d.flecha([36, 130], [36, 104], 'k2', 7) + d.flecha([184, 130], [184, 104], 'k2', 7) + tx([36, 96], 'A', 'tb') + tx([184, 96], 'A', 'tb');
      s += rayado([[280, 70, 298, 100], [280, 100, 310, 190], [382, 70, 400, 100], [370, 100, 400, 190]]);
      s += rc(280, 70, 120, 120, 'none3', 0) + ln([298, 70], [298, 100], 'k3') + ln([382, 70], [382, 100], 'k3') + ln([298, 100], [382, 100], 'k3') + ln([310, 100], [310, 190], 'k3') + ln([370, 100], [370, 190], 'k3');
      s += eje([340, 60], [340, 200]);
      s += tx([110, 222], 'Vista superior', 'tb') + tx([340, 222], 'Corte A-A', 'tb');
      return s + tx([240, 248], 'Rayado fino a 45° solo donde hay material; el hueco no se raya', 'tm');
    } },
    m2fcflujo: { t: 'Flujo en FreeCAD: del croquis al plano', d: 'Croquis totalmente restringido, Pad para darle espesor, Pocket para los barrenos y TechDraw para el plano. El árbol del modelo guarda cada paso.', w: 480, h: 250, anim: true, per: 12, draw: t => {
      const ph = Math.floor((t % 12) / 3), X = [62, 182, 302, 422];
      let s = '';
      X.forEach((cx, i) => { s += rc(cx - 52, 26, 104, 104, i === ph ? 'fillA' : 'none2', 8); if (i < 3) s += d.flecha([cx + 53, 78], [cx + 67, 78], 'b', 6); });
      s += rc(X[0] - 36, 56, 72, 44, 'verde', 0) + ci([X[0] - 22, 78], 6, 'verde') + ci([X[0] + 22, 78], 6, 'verde') + ci([X[0] - 36, 100], 3, 'dot');
      const losa = (cx, hoyos) => { const O = [cx - 14, 108], k = 0.7, Q = (x, y, z) => [O[0] + (x - y) * 0.866 * k, O[1] - (x + y) * 0.5 * k - z * k];
        let q = pg([Q(0, 0, 0), Q(0, 40, 0), Q(0, 40, 10), Q(0, 0, 10)], 'fillA') + pg([Q(0, 0, 0), Q(80, 0, 0), Q(80, 0, 10), Q(0, 0, 10)], 'fill') + pg([Q(0, 0, 10), Q(80, 0, 10), Q(80, 40, 10), Q(0, 40, 10)], 'fill2');
        if (hoyos) [15, 65].forEach(hx => { const el = []; for (let i = 0; i < 24; i++) { const a = i / 24 * 2 * PI; el.push(Q(hx + 7 * Math.cos(a), 20 + 7 * Math.sin(a), 10)); } q += pg(el, 'fill'); });
        return q; };
      s += losa(X[1], false) + losa(X[2], true);
      const x3 = X[3]; s += rc(x3 - 40, 40, 80, 80, 'fill2', 0) + rc(x3 - 35, 44, 72, 72, 'none2', 0) + rc(x3 - 28, 52, 36, 16, 'fill', 0) + rc(x3 - 28, 74, 36, 22, 'fill', 0) + ci([x3 - 19, 85], 3, 'fill2') + ci([x3 - 1, 85], 3, 'fill2') + rc(x3 + 8, 102, 29, 14, 'none2', 0);
      [['Sketch', 'croquis en verde'], ['Pad', 'le da espesor'], ['Pocket', 'barrenos'], ['TechDraw', 'plano en PDF']].forEach((q, i) => { s += tx([X[i], 150], q[0], i === ph ? 'ta' : 'tb') + tx([X[i], 166], q[1], 'tm'); });
      s += rc(20, 184, 440, 56, 'none2', 6) + tx([32, 204], 'Árbol del modelo', 'tbs', 'start');
      const A = [['Body', 132, 0], ['Sketch', 175, 0], ['Pad', 232, 1], ['Sketch001', 268, 2], ['Pocket', 349, 2], ['Page', 406, 3]];
      A.forEach((q, i) => { if (q[2] <= ph) { s += tx([q[1], 226], q[0], q[2] === ph ? 'ta' : 'tm', 'start'); if (i && A[i - 1][2] <= ph) s += tx([q[1] - 7, 226], '›', 'tm'); } });
      return s;
    } },
    m2enlace: { t: 'Enlace de dos rectas con un arco', d: 'Paralelas a distancia r de cada recta: su cruce es el centro; las perpendiculares desde el centro dan los puntos de tangencia.', w: 480, h: 240, anim: true, per: 8, draw: t => {
      const ph = Math.floor((t % 8) / 2), V = [60, 200], A = [280, 200], B = [150, 44], C = [129.3, 160], T1 = [129.3, 200], T2 = [94.6, 140];
      let s = '';
      if (ph < 3) s += ln(V, A, 'k') + ln(V, B, 'k');
      else s += ln(V, T1, 'none2') + ln(V, T2, 'none2') + ln(T1, A, 'k') + ln(T2, B, 'k') + d.path('M' + T2[0] + ' ' + T2[1] + ' A40 40 0 0 0 ' + T1[0] + ' ' + T1[1], 'k');
      if (ph >= 1) s += ln([70, 160], [280, 160], 'oculta') + ln([100.4, 210], [192.8, 50], 'oculta') + tx([262, 185], 'r', 'ta') + tx([196, 96], 'r', 'ta');
      if (ph >= 2) s += ln(C, T1, 'none2') + ln(C, T2, 'none2') + ci(C, 4, 'dot') + ci(T1, 4, 'dot') + ci(T2, 4, 'dot') + tx([C[0] + 10, C[1] - 6], 'centro', 'tm', 'start');
      const L = ['1. Las dos rectas', '2. Paralelas a distancia r', '3. Centro y tangencias', '4. Arco r; borra la esquina'];
      s += tx([304, 40], 'Enlace de dos rectas', 'tb', 'start'); L.forEach((x, i) => { s += tx([304, 70 + 24 * i], x, i === ph ? 'ta' : 'tm', 'start'); });
      return s + tx([380, 200], 'Igual que Fillet en FreeCAD', 'tm');
    } }
  };
  const figTema = { 'm2-dibujo-tecnico': ['m2formato'], 'm2-lineas': ['m2lineas'], 'm2-geometria': ['m2enlace'], 'm2-escalas': ['m2escala'], 'm2-isometrico': ['m2iso'], 'm2-vistas': ['m2vistas', 'vistas'], 'm2-acotacion': ['m2acota'], 'm2-cortes': ['m2corte'], 'm2-freecad-entorno': ['m2fcflujo'], 'm2-modelado-3d': ['m2fcflujo'], 'm2-techdraw': ['m2fcflujo', 'm2vistas'], 'sm1-planos': ['vistas', 'm2acota', 'm2escala'] };

  const industria = {
    'm2-dibujo-tecnico': [['Manufactura automotriz', 'Las plantas y proveedores del Bajío trabajan con planos de clientes de varios países; los técnicos los interpretan todos los días.'], ['Servicios de dibujo', 'Despachos de dibujo y diseño hacen planos para talleres y proveedores de la región.']],
    'm2-unidades': [['Mantenimiento', 'Las refacciones de máquinas estadounidenses vienen en pulgadas; el técnico convierte para pedirlas o fabricarlas.']],
    'm2-lineas': [['Control de calidad', 'Los inspectores distinguen en el plano qué arista es visible, cuál oculta y dónde está el centro de cada barreno antes de medir.']],
    'm2-geometria': [['Corte láser y troquelado', 'Los perfiles de levas, ganchos y llaves se cortan siguiendo arcos tangentes; un escalón en la tangencia se nota en la pieza.']],
    'm2-escalas': [['Construcción de plantas', 'Las naves industriales se dibujan a 1:100 o 1:200 y los conectores eléctricos a 5:1 o 10:1 para ver sus detalles.']],
    'm2-isometrico': [['Instrucciones de trabajo', 'Las hojas de ensamble y los catálogos de refacciones usan isométricos para que cualquier operador entienda la pieza.']],
    'm2-cortes': [['Bombas y válvulas', 'Los planos de bombas, válvulas y cilindros neumáticos se leen en corte para ver sellos, émbolos y pasajes interiores.']],
    'm2-modelado-3d': [['Diseño de herramentales', 'Los diseñadores de dispositivos y moldes ordenan sus operaciones en CAD para cambiar medidas sin rehacer el modelo.']],
    'm2-vistas': [['Control de calidad', 'Los inspectores comparan la pieza con las vistas del plano usando vernier, micrómetro y calibradores.']],
    'm2-acotacion': [['Metrología', 'Los laboratorios de metrología miden exactamente las cotas del plano para liberar piezas.']],
    'm2-freecad-entorno': [['Diseño', 'Las áreas de diseño modelan en CAD paramétrico (SolidWorks, NX, Inventor o FreeCAD) para cambiar piezas rápido.']],
    'm2-techdraw': [['Proveedores', 'El plano en PDF con el cuadro de datos completo es lo que se manda al proveedor para cotizar y fabricar.']],
    'm2-materiales': [['Autopartes', 'Las armadoras piden aligerar piezas: cambiar acero por aluminio o plástico donde se puede ahorra combustible.']]
  };

  /* =================== PROYECTO, RECURSOS Y PLANEACIÓN =================== */
  const proyecto = { nombre: 'Del objeto al plano: expediente de una pieza mecánica', et: [['croquis', 'Croquis acotado de la pieza real', ['m2a-croquis-pr']], ['laminas', 'Láminas de isométrico y vistas', ['m2a-isometrico-pr', 'm2a-vistas-pr']], ['plano', 'Plano a mano (actividad clave)', ['m2a-plano-eval']], ['modelo', 'Modelo 3D y plano en FreeCAD', ['m2a-diseno-eval']], ['expediente', 'Expediente y presentación', ['m2a-expediente', 'm2a-expo']]] };
  const recursos = {
    material: ['Juego de escuadras de 45° y 30-60°, compás, regla graduada o escalímetro, lápices 2H y HB (o portaminas de 0.5 mm) y goma', 'Hojas A4 o tamaño carta y papel isométrico impreso', 'Piezas mecánicas reales para medir (bisagras, soportes, poleas, eslabones, perillas)', 'Vernier, flexómetro y regla', 'Cubos de madera o cajas de cerillos, caja de cartón para la caja de proyección'],
    equipo: ['Computadoras con FreeCAD 1.0 o más nuevo (gratuito)', 'Proyector', 'Impresora para comprobar planos a escala 1:1']
  };
  const plan = {
    diag: 'Examen diagnóstico de dibujo técnico y FreeCAD (geometría, líneas, escalas, cotas y Sketcher)',
    form: 'Coevaluación de láminas con lista de cotejo, revisión por alumno de las prácticas de FreeCAD y boletos de salida',
    sum: 'Plano de vistas ortogonales e isométricas (lista de cotejo), pieza diseñada en 2D y 3D con su plano (lista de cotejo), expediente de la pieza y examen del parcial',
    practicas: ['Demostrativa: trazos geométricos, isométrico y elipse por cuatro centros en el pizarrón; primeras herramientas de FreeCAD en el proyector.', 'Guiada: «Yo modelo, tú modelas» en FreeCAD (placa, eslabón y bloque) y láminas de líneas y escalas.', 'Supervisada: láminas de isométricos y vistas; prácticas de Revolution, Thickness y TechDraw.', 'Autónoma: croquis, plano a mano, modelo y plano en FreeCAD de la pieza del proyecto.'],
    paec: 'Catálogo de planos de piezas de repuesto para el mantenimiento del plantel (bisagras, soportes, perillas y ganchos), con el material elegido por su función y su impacto ambiental',
    paecEvid: 'Planos y modelos de las piezas (Producto) y presentación al personal de mantenimiento del plantel (Desempeño)'
  };

  E.mods.registra('II-1', { temas: temas, clases: clases, banco: banco, gen: gen, ideas: ideas, figs: figs, figTema: figTema, industria: industria, proyecto: proyecto, recursos: recursos, plan: plan });
})();
