/* ==========================================================================
 * Exportação para Word (.docx) - gera OOXML mínimo válido com o mesmo
 * conteúdo do relatório impresso (cabeçalho, seções, tabelas, subtotais,
 * destaques e notas), usando o JSZip já vendorizado. Sem dependências novas.
 * ========================================================================== */
(function (global) {
  'use strict';

  // Página A4 paisagem (medidas em twips: 1 cm = 567 twips)
  const PAG_LARGURA = 16838, PAG_ALTURA = 11906, MARGEM = 850; // ~1,5cm
  const LARGURA_UTIL = PAG_LARGURA - 2 * MARGEM;

  const xesc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/\r?\n/g, '</w:t></w:r><w:r><w:br/><w:t xml:space="preserve">');

  function run(texto, opts) {
    opts = opts || {};
    const props = [];
    if (opts.b) props.push('<w:b/>');
    if (opts.i) props.push('<w:i/>');
    if (opts.cor) props.push(`<w:color w:val="${opts.cor}"/>`);
    if (opts.tam) props.push(`<w:sz w:val="${opts.tam * 2}"/>`);
    if (opts.fonte) props.push(`<w:rFonts w:ascii="${opts.fonte}" w:hAnsi="${opts.fonte}"/>`);
    const rpr = props.length ? `<w:rPr>${props.join('')}</w:rPr>` : '';
    return `<w:r>${rpr}<w:t xml:space="preserve">${xesc(texto)}</w:t></w:r>`;
  }

  function paragrafo(texto, opts) {
    opts = opts || {};
    const pprParts = [];
    if (opts.espacoDepois != null) pprParts.push(`<w:spacing w:after="${opts.espacoDepois}" w:before="${opts.espacoAntes || 0}"/>`);
    if (opts.alinhar) pprParts.push(`<w:jc w:val="${opts.alinhar}"/>`);
    const ppr = pprParts.length ? `<w:pPr>${pprParts.join('')}</w:pPr>` : '';
    return `<w:p>${ppr}${run(texto, opts)}</w:p>`;
  }

  function celula(texto, opts) {
    opts = opts || {};
    const larguraTwips = opts.larguraTwips || 1000;
    const sombreado = opts.fundo ? `<w:shd w:val="clear" w:color="auto" w:fill="${opts.fundo}"/>` : '';
    const alinhar = opts.numero ? 'right' : 'left';
    return `<w:tc><w:tcPr><w:tcW w:w="${larguraTwips}" w:type="dxa"/>${sombreado}<w:vAlign w:val="center"/></w:tcPr>` +
      `<w:p><w:pPr><w:jc w:val="${alinhar}"/></w:pPr>${run(texto, { b: opts.b, i: opts.i, tam: 9 })}</w:p></w:tc>`;
  }

  function linhaTabela(celulas) { return `<w:tr>${celulas.join('')}</w:tr>`; }

  function bordasTabela() {
    const b = ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']
      .map(s => `<w:${s} w:val="single" w:sz="4" w:space="0" w:color="999999"/>`).join('');
    return `<w:tblBorders>${b}</w:tblBorders>`;
  }

  /** Converte uma seção executada (de reports.js, mesma estrutura de renderSecao) em XML de tabela Word */
  function tabelaSecao(sec) {
    const s = sec.def;
    if (sec.erro) return paragrafo(`Erro na consulta: ${sec.erro}`, { i: true, cor: 'B00020' });
    if (!sec.values.length) return paragrafo('Nenhum registro.', { i: true });
    const n = sec.columns.length;
    const larguraCol = Math.max(600, Math.floor(LARGURA_UTIL / n));
    const grid = `<w:tblGrid>${sec.columns.map(() => `<w:gridCol w:w="${larguraCol}"/>`).join('')}</w:tblGrid>`;
    const gi = s.agrupar ? sec.columns.indexOf(s.agrupar) : -1;
    const di = s.destaque ? sec.columns.indexOf(s.destaque.coluna) : -1;
    const colsVis = sec.columns.map((c, i) => i).filter(i => i !== gi);
    const R = global.SIM_REPORTS;

    const linhaCab = linhaTabela(colsVis.map(i => celula(sec.rotulos[i], { b: true, fundo: 'E4E4E4', larguraTwips: larguraCol })));
    const somar = (vals, i) => { let t = 0; for (const r of vals) t += Number(r[i]) || 0; return t; };
    const somaCols = sec.formatos.map(f => f === 'moeda' || (f === 'int' && sec.pivot));
    const linhaDados = (r, destacar) => linhaTabela(colsVis.map(i => celula(R.formatar(r[i], sec.formatos[i]), { numero: somaCols[i], cor: destacar ? 'B00020' : undefined, larguraTwips: larguraCol })));
    const linhaTot = (rotulo, vals, fundo) => linhaTabela(colsVis.map((i, k) => somaCols[i]
      ? celula(R.formatar(somar(vals, i), sec.formatos[i]), { numero: true, b: true, fundo, larguraTwips: larguraCol })
      : celula(k === 0 ? rotulo : '', { b: true, fundo, larguraTwips: larguraCol })));

    let linhas = '';
    if (gi >= 0) {
      let grupo = null, buf = [];
      const flush = () => { if (buf.length) linhas += linhaTot('Subtotal', buf, 'F7F7F7'); buf = []; };
      for (const r of sec.values) {
        const g = r[gi] == null ? '' : String(r[gi]);
        if (g !== grupo) { flush(); grupo = g; linhas += linhaTabela([celula(`${sec.rotulos[gi]}: ${g}`, { b: true, fundo: 'F0F0F0', larguraTwips: larguraCol * colsVis.length })]); }
        const destacar = di >= 0 && s.destaque && String(r[di]) === String(s.destaque.valor);
        linhas += linhaDados(r, destacar); buf.push(r);
      }
      flush();
    } else {
      for (const r of sec.values) { const destacar = di >= 0 && s.destaque && String(r[di]) === String(s.destaque.valor); linhas += linhaDados(r, destacar); }
    }
    if (sec.pivot || s.totalizar) { if (somaCols.some(Boolean)) linhas += linhaTot('TOTAL', sec.values, 'E4E4E4'); }

    const tbl = `<w:tbl><w:tblPr><w:tblW w:w="${LARGURA_UTIL}" w:type="dxa"/>${bordasTabela()}<w:tblLayout w:type="fixed"/></w:tblPr>${grid}${linhaCab}${linhas}</w:tbl>`;
    let out = tbl + paragrafo(`${sec.values.length.toLocaleString('pt-BR')} registro(s).`, { tam: 8, i: true, espacoAntes: 40, espacoDepois: 120 });
    if (s.nota) out += paragrafo(s.nota, { tam: 8, i: true, espacoDepois: 120 });
    return out;
  }

  function documentoXML(res, cab) {
    const hoje = new Date().toLocaleDateString('pt-BR');
    let body = '';
    body += paragrafo(cab.entidade || '', { b: true, tam: 11, espacoDepois: 20 });
    body += paragrafo(res.def.titulo, { b: true, tam: 16, espacoDepois: 20 });
    if (res.def.subtitulo) body += paragrafo(res.def.subtitulo, { tam: 10, cor: '444444', espacoDepois: 80 });
    body += paragrafo(`Período das remessas: ${cab.periodo || '-'}    ·    Gerado em ${hoje}`, { tam: 9, cor: '444444', espacoDepois: 160 });
    const ps = (res.def.params || []).filter(p => res.params[p.nome] !== '' && res.params[p.nome] != null);
    if (ps.length) body += paragrafo('Parâmetros: ' + ps.map(p => `${p.rotulo} = ${res.params[p.nome]}`).join('; '), { tam: 9, cor: '444444', espacoDepois: 160 });
    if (res.def.descricao) body += paragrafo(res.def.descricao, { tam: 9.5, espacoDepois: 200 });
    for (const sec of res.secoes) {
      body += paragrafo(sec.def.titulo, { b: true, tam: 12, espacoAntes: 200, espacoDepois: 100 });
      body += tabelaSecao(sec);
    }
    if (res.def.rodape) body += paragrafo(res.def.rodape, { tam: 8.5, cor: '444444', espacoAntes: 200 });
    const sectPr = `<w:sectPr><w:pgSz w:w="${PAG_LARGURA}" w:h="${PAG_ALTURA}" w:orient="landscape"/>` +
      `<w:pgMar w:top="${MARGEM}" w:right="${MARGEM}" w:bottom="${MARGEM}" w:left="${MARGEM}" w:header="0" w:footer="0" w:gutter="0"/></w:sectPr>`;
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
      `<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">` +
      `<w:body>${body}${sectPr}</w:body></w:document>`;
  }

  const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
    `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
    `<Default Extension="xml" ContentType="application/xml"/>` +
    `<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>` +
    `<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>` +
    `<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>` +
    `</Types>`;
  const RELS_RAIZ = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>` +
    `<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>` +
    `</Relationships>`;
  const RELS_DOC = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
    `</Relationships>`;
  const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">` +
    `<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="20"/></w:rPr></w:rPrDefault></w:docDefaults>` +
    `<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>` +
    `</w:styles>`;

  function coreXML(titulo) {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
      `<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/">` +
      `<dc:title>${xesc(titulo)}</dc:title><dc:creator>Análise SIM TCE-CE</dc:creator></cp:coreProperties>`;
  }

  /** Gera o .docx do relatório e dispara o download. `res` é o resultado de SIM_REPORTS.executar(); `cab` = {entidade, periodo}. */
  async function exportar(res, nomeArquivo, cab) {
    if (!global.JSZip) throw new Error('JSZip não carregado');
    const zip = new global.JSZip();
    zip.file('[Content_Types].xml', CONTENT_TYPES);
    zip.folder('_rels').file('.rels', RELS_RAIZ);
    zip.folder('docProps').file('core.xml', coreXML(res.def.titulo));
    const word = zip.folder('word');
    word.file('document.xml', documentoXML(res, cab || {}));
    word.file('styles.xml', STYLES);
    word.folder('_rels').file('document.xml.rels', RELS_DOC);
    const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = nomeArquivo; document.body.appendChild(a); a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 500);
  }

  global.SIM_DOCX = { exportar };
})(window);
