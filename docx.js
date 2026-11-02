/* Escuadra · Planeación en Word de verdad (.docx) (v1.28).
   Convierte la misma planeación que se imprime (P.planHTML) a un documento de Word con tablas, colores de encabezado,
   viñetas y el logo de CETAC 19 en el encabezado de CADA hoja (arriba a la derecha). Se arma aquí mismo, sin internet:
   un .docx es un .zip con archivos XML; este archivo escribe ese zip (sin comprimir, que Word acepta igual).
   Abre en Word, Google Docs y LibreOffice. Si algo falla, se descarga el .doc de antes. */
(function () {
  'use strict';
  const E = window.E, u = E.u, A = E.actions;
  const P = E.print, DX = E.docx = {};

  /* ---------- zip sin compresión ---------- */
  const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc32 = b => { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
  DX.zip = files => {
    const enc = new TextEncoder(), parts = [], cen = []; let off = 0;
    const u16 = (v, a, i) => { a[i] = v & 255; a[i + 1] = (v >>> 8) & 255; }, u32 = (v, a, i) => { a[i] = v & 255; a[i + 1] = (v >>> 8) & 255; a[i + 2] = (v >>> 16) & 255; a[i + 3] = (v >>> 24) & 255; };
    files.forEach(f => {
      const name = enc.encode(f.name), data = typeof f.data === 'string' ? enc.encode(f.data) : f.data, crc = crc32(data);
      const h = new Uint8Array(30 + name.length); u32(0x04034b50, h, 0); u16(20, h, 4); u16(0x0800, h, 6); u16(0, h, 8); u16(0, h, 10); u16(0x21, h, 12); u32(crc, h, 14); u32(data.length, h, 18); u32(data.length, h, 22); u16(name.length, h, 26); u16(0, h, 28); h.set(name, 30);
      const c = new Uint8Array(46 + name.length); u32(0x02014b50, c, 0); u16(20, c, 4); u16(20, c, 6); u16(0x0800, c, 8); u16(0, c, 10); u16(0, c, 12); u16(0x21, c, 14); u32(crc, c, 16); u32(data.length, c, 20); u32(data.length, c, 24); u16(name.length, c, 28); u16(0, c, 30); u16(0, c, 32); u16(0, c, 34); u16(0, c, 36); u32(0, c, 38); u32(off, c, 42); c.set(name, 46);
      parts.push(h, data); cen.push(c); off += h.length + data.length;
    });
    const csz = cen.reduce((s, c) => s + c.length, 0), e = new Uint8Array(22); u32(0x06054b50, e, 0); u16(0, e, 4); u16(0, e, 6); u16(files.length, e, 8); u16(files.length, e, 10); u32(csz, e, 12); u32(off, e, 16); u16(0, e, 20);
    return new Blob(parts.concat(cen, [e]), { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  };

  /* ---------- HTML de la planeación → WordprocessingML ---------- */
  const X = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const ANCHO = 12240 - 2 * 648;   // carta, márgenes de 0.45 in (twips)
  const SHADE = { h: 'F8CBAD', hs: 'FBE4D5' };
  const run = (t, f) => '<w:r><w:rPr>' + (f.b ? '<w:b/>' : '') + (f.i ? '<w:i/>' : '') + '<w:sz w:val="' + f.sz + '"/><w:szCs w:val="' + f.sz + '"/></w:rPr><w:t xml:space="preserve">' + X(t) + '</w:t></w:r>';
  const par = (runs, f) => '<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/>' + (f.al ? '<w:jc w:val="' + f.al + '"/>' : '') + (f.ind ? '<w:ind w:left="' + f.ind + '" w:hanging="160"/>' : '') + '</w:pPr>' + runs + '</w:p>';
  // convierte el contenido de un nodo (celda, párrafo) en párrafos: <br> y bloques parten párrafo; ul/li llevan viñeta
  function bloques(node, f0) {
    const out = []; let cur = [];
    const cierra = f => { if (cur.length) { out.push(par(cur.join(''), f)); cur = []; } };
    const fmt = (el, f) => {
      const g = Object.assign({}, f), cl = el.classList || { contains: () => false }, tg = el.tagName;
      if (tg === 'B' || tg === 'STRONG' || tg === 'TH' || cl.contains('h') || cl.contains('hs') || cl.contains('ttl') || cl.contains('x')) g.b = true;
      if (tg === 'I' || tg === 'EM') g.i = true;
      if (cl.contains('tiny')) g.sz = 14; if (cl.contains('ttl')) g.sz = 19;
      const st = (el.getAttribute && el.getAttribute('style')) || '';
      if (cl.contains('c') || cl.contains('h') || cl.contains('hs') || cl.contains('ttl') || cl.contains('x') || (tg === 'TH' && !/text-align:\s*left/.test(st))) g.al = 'center';
      if (/text-align:\s*left/.test(st)) g.al = 'left';
      return g;
    };
    const walk = (n, f) => {
      if (n.nodeType === 3) { const t = n.nodeValue.replace(/\s+/g, ' '); if (t.trim() || (cur.length && t)) cur.push(run(t, f)); return; }
      if (n.nodeType !== 1) return; const tg = n.tagName, g = fmt(n, f);
      if (tg === 'BR') { cierra(f); return; }
      if (tg === 'STYLE' || tg === 'SCRIPT') return;
      if (tg === 'UL' || tg === 'OL') { cierra(f); [...n.children].forEach(li => { const sub = bloques(li, Object.assign({}, g, { ind: 220 })); sub.forEach((p, i) => out.push(i === 0 ? p.replace('<w:pPr>', '<w:pPr>').replace(/(<\/w:pPr>)/, '$1' + run('• ', g)) : p)); }); return; }
      if (tg === 'P' || tg === 'DIV' || tg === 'LI') { cierra(f); [...n.childNodes].forEach(c => walk(c, g)); cierra(g); return; }
      if (tg === 'TABLE') { cierra(f); out.push(tabla(n)); return; }
      [...n.childNodes].forEach(c => walk(c, g));
    };
    [...node.childNodes].forEach(c => walk(c, f0));
    cierra(f0);
    return out;
  }
  function tabla(t) {
    const rows = [...t.rows], ncol = Math.max(1, ...rows.map(r => [...r.cells].reduce((s, c) => s + (c.colSpan || 1), 0))), cw = Math.floor(ANCHO / ncol);
    const sinBorde = '<w:tcBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/></w:tcBorders>';
    let x = '<w:tbl><w:tblPr><w:tblW w:w="' + ANCHO + '" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblBorders>' + ['top', 'left', 'bottom', 'right', 'insideH', 'insideV'].map(b => '<w:' + b + ' w:val="single" w:sz="4" w:space="0" w:color="000000"/>').join('') + '</w:tblBorders><w:tblCellMar><w:left w:w="70" w:type="dxa"/><w:right w:w="70" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>' + Array(ncol).fill('<w:gridCol w:w="' + cw + '"/>').join('') + '</w:tblGrid>';
    rows.forEach(r => {
      const alto = [...r.cells].map(c => { const m = (c.getAttribute('style') || '').match(/height:\s*(\d+)px/); return m ? Number(m[1]) * 15 : 0; }).reduce((a, b) => Math.max(a, b), 0);
      x += '<w:tr><w:trPr><w:cantSplit/>' + (alto ? '<w:trHeight w:val="' + alto + '" w:hRule="atLeast"/>' : '') + '</w:trPr>';
      let usadas = 0;
      [...r.cells].forEach((c, i, arr) => {
        let sp = c.colSpan || 1; if (i === arr.length - 1 && usadas + sp < ncol) sp = ncol - usadas; usadas += sp;
        const cl = c.classList, st = c.getAttribute('style') || '', sh = cl.contains('h') ? SHADE.h : cl.contains('hs') ? SHADE.hs : null;
        const f = { sz: r.closest && r.closest('.tv') ? 14 : 17 };
        let ps = bloques(c, f); if (!ps.length) ps = [par('', f)];
        x += '<w:tc><w:tcPr><w:tcW w:w="' + cw * sp + '" w:type="dxa"/>' + (sp > 1 ? '<w:gridSpan w:val="' + sp + '"/>' : '') + (cl.contains('sp') || cl.contains('ttl') ? sinBorde : '') + (sh ? '<w:shd w:val="clear" w:color="auto" w:fill="' + sh + '"/>' : '') + '<w:vAlign w:val="' + (/vertical-align:\s*bottom/.test(st) ? 'bottom' : 'top') + '"/></w:tcPr>' + ps.join('') + '</w:tc>';
      });
      x += '</w:tr>';
    });
    return x + '</w:tbl>' + par('', { sz: 8 });
  }
  const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';
  const LOGO_EMU = 612000;   // 17 mm
  const header = () => '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr ' + NS + '><w:p><w:pPr><w:jc w:val="right"/><w:spacing w:before="0" w:after="0"/></w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="' + LOGO_EMU + '" cy="' + LOGO_EMU + '"/><wp:docPr id="1" name="Logo CETAC 19"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="1" name="logo.jpg"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rLogo"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="' + LOGO_EMU + '" cy="' + LOGO_EMU + '"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p></w:hdr>';
  DX.documento = html => {
    const t = document.createElement('div'); t.innerHTML = html;
    const cuerpo = bloques(t, { sz: 17 }).join('');
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ' + NS + '><w:body>' + cuerpo +
      '<w:sectPr><w:headerReference w:type="default" r:id="rHdr"/><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1300" w:right="648" w:bottom="648" w:left="648" w:header="420" w:footer="360" w:gutter="0"/></w:sectPr></w:body></w:document>';
  };
  DX.archivos = html => {
    const b = atob(P.LOGO.split(',')[1]), img = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) img[i] = b.charCodeAt(i);
    return [
      { name: '[Content_Types].xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="jpg" ContentType="image/jpeg"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/></Types>' },
      { name: '_rels/.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>' },
      { name: 'word/_rels/document.xml.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rSty" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rHdr" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/></Relationships>' },
      { name: 'word/_rels/header1.xml.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rLogo" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/logo.jpg"/></Relationships>' },
      { name: 'word/styles.xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Arial" w:cs="Arial"/><w:sz w:val="17"/><w:szCs w:val="17"/><w:lang w:val="es-MX"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style></w:styles>' },
      { name: 'word/header1.xml', data: header() },
      { name: 'word/media/logo.jpg', data: img },
      { name: 'word/document.xml', data: DX.documento(html) }
    ];
  };
  DX.plan = pl => DX.zip(DX.archivos(P.planHTML(pl)));
  P.planWord = pl => {
    try {
      const blob = DX.plan(pl), a = document.createElement('a'), url = URL.createObjectURL(blob);
      a.href = url; a.download = 'Planeacion_' + pl.grupoId + '_' + pl.parcial + '_SM' + pl.sm + '.docx'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
      u.toast('Descargado (.docx, con el logo en cada hoja). Ábrelo con Word o súbelo a Drive.', 'ok', 6000);
    } catch (e) { console.error(e); u.toast('No se pudo armar el .docx; descargo el formato anterior', 'err', 4000); P.planWordHTML(pl); }
  };
})();
