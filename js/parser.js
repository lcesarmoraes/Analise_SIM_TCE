/* ==========================================================================
 * Leitura dos arquivos de remessa (CSV em Windows-1252) e dos pacotes ZIP
 * ========================================================================== */
(function (global) {
  'use strict';

  const RE_NOME = /^([A-Z]{2})(\d{6})\.([A-Z]{3})$/i;

  /** Interpreta o nome do arquivo de remessa: LQ202312.DCD -> {prefixo, competencia, extensao} */
  function parseNome(nome) {
    const base = nome.split(/[\\/]/).pop();
    const m = RE_NOME.exec(base);
    if (!m) return null;
    return { nome: base.toUpperCase(), prefixo: m[1].toUpperCase(), competencia: m[2], extensao: m[3].toUpperCase() };
  }

  /** Parser CSV com aspas, vírgula como separador, CRLF ou LF. Devolve array de arrays. */
  function parseCSV(text) {
    const rows = [];
    let row = [], field = '', inQ = false, i = 0;
    const n = text.length;
    while (i < n) {
      const ch = text[i];
      if (inQ) {
        if (ch === '"') {
          if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
          inQ = false; i++; continue;
        }
        field += ch; i++; continue;
      }
      if (ch === '"') { inQ = true; i++; continue; }
      if (ch === ',') { row.push(field); field = ''; i++; continue; }
      if (ch === '\r') { i++; continue; }
      if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue; }
      field += ch; i++;
    }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  function decode(buf) {
    try { return new TextDecoder('windows-1252').decode(buf); }
    catch (e) { return new TextDecoder('iso-8859-1').decode(buf); }
  }

  /** Lê um File/Blob (ZIP ou arquivo avulso) e devolve lista de {info, rows, pacote} */
  async function lerEntrada(file, onProgress) {
    const out = [];
    const nome = file.name;
    if (/\.zip$/i.test(nome)) {
      if (!global.JSZip) throw new Error('JSZip não carregado');
      const zip = await global.JSZip.loadAsync(file);
      const entries = Object.values(zip.files).filter(f => !f.dir);
      let k = 0;
      for (const entry of entries) {
        k++;
        const info = parseNome(entry.name);
        if (!info) continue;
        const buf = await entry.async('arraybuffer');
        out.push({ info, rows: parseCSV(decode(buf)), pacote: nome });
        if (onProgress) onProgress(k, entries.length, info.nome);
      }
    } else {
      const info = parseNome(nome);
      if (!info) return out;
      const buf = await file.arrayBuffer();
      out.push({ info, rows: parseCSV(decode(buf)), pacote: '' });
      if (onProgress) onProgress(1, 1, info.nome);
    }
    return out;
  }

  global.SIM_PARSER = { parseNome, parseCSV, decode, lerEntrada };
})(window);
