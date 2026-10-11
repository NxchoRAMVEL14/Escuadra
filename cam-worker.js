/* Escuadra · lee las tarjetas de respuesta en un hilo aparte para que la pantalla no se trabe.
   Usa js-aruco2 (licencia MIT, ver lib-aruco.js). Solo recibe la imagen y regresa el número y las esquinas de cada tarjeta. */
importScripts('lib-aruco.js');
let det = null;
onmessage = e => {
  const d = e.data;
  try {
    if (!det) det = new AR.Detector({ dictionaryName: d.dic, maxHammingDistance: d.maxH });
    const ms = det.detect({ width: d.w, height: d.h, data: new Uint8ClampedArray(d.buf) });
    postMessage({ id: d.id, ms: ms.map(m => ({ id: m.id, d: m.hammingDistance, corners: m.corners.map(p => ({ x: p.x, y: p.y })) })) });
  } catch (err) { postMessage({ id: d.id, ms: [], err: String(err) }); }
};
