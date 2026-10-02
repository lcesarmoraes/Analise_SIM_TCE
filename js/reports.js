/* ==========================================================================
 * Relatórios: definição (JSON), execução (SQL com parâmetros), renderização
 * (HTML imprimível) e exportação (XLSX / CSV / área de transferência).
 *
 * Estrutura de um relatório:
 * {
 *   id, nome, titulo, subtitulo, descricao,
 *   params: [{ nome, rotulo, padrao, ajuda }],
 *   secoes: [{
 *     titulo, nota, sql,
 *     tipo: 'tabela' | 'pivot',
 *     pivot: { linha, coluna, valor },         // só para tipo pivot
 *     agrupar: 'coluna',                       // subtotais por grupo (tabela)
 *     totalizar: true,                         // linha de total (tabela)
 *     formatos: { coluna: 'moeda'|'data'|'comp'|'int'|'texto' },
 *     rotulos: { coluna: 'Título da coluna' },
 *     destaque: { coluna: 'situacao', valor: 'Estorno' }   // realce de linhas
 *   }],
 *   rodape
 * }
 * Parâmetros são usados no SQL como {{nome}} (texto, aspas simples escapadas).
 * ========================================================================== */
(function (global) {
  'use strict';

  const FILTRO_FUNDEB = `fonte_recurso LIKE '{{fonte_prefixo}}%'`;
  const BLOCO70 = `substr(fonte_recurso, 4, 3) = '{{detalhe_70}}'`;
  const BLOCO30 = `substr(fonte_recurso, 4, 3) <> '{{detalhe_70}}'`;

  const PRESETS = [
    {
      id: 'fundeb_liquidacoes', nome: 'Demonstrativo analítico das liquidações do FUNDEB',
      titulo: 'Demonstrativo Analítico das Liquidações do FUNDEB',
      subtitulo: 'Cruzamento NE × LQ × EL - fontes do FUNDEB, blocos de 70% e 30%',
      descricao: 'Reproduz a lógica do demonstrativo: cada liquidação (LQ) é ligada ao seu empenho (NE) para obter fonte e elemento; estornos (EL) são identificados por empenho + data da liquidação. O bloco de 70% é definido pelo detalhamento da fonte (posições 4 a 6 da fonte de 9 dígitos).',
      params: [
        { nome: 'fonte_prefixo', rotulo: 'Prefixo da fonte (9 dígitos)', padrao: '54', ajuda: '54 = FUNDEB (540, 541, 542...)' },
        { nome: 'detalhe_70', rotulo: 'Detalhamento do bloco 70%', padrao: '107', ajuda: 'Posições 4-6 da fonte. 107 = remuneração dos profissionais da educação' },
      ],
      secoes: [
        {
          titulo: 'Quadro 1 - Totais por bloco',
          sql: `SELECT CASE WHEN ${BLOCO70} THEN 'Bloco 70% (fontes *{{detalhe_70}}*)' ELSE 'Bloco 30% (demais fontes)' END AS bloco,
                       COUNT(*) AS lancamentos, SUM(estornada) AS estornos, SUM(valor_liquidacao) AS bruto,
                       SUM(CASE WHEN estornada = 1 THEN valor_liquidacao ELSE 0 END) AS valor_estornos, SUM(valor_liquido) AS liquido
                FROM v_liquidacoes WHERE ${FILTRO_FUNDEB} AND sem_empenho = 0 GROUP BY 1 ORDER BY 1 DESC`,
          totalizar: true, formatos: { lancamentos: 'int', estornos: 'int' },
          rotulos: { bloco: 'Bloco', lancamentos: 'Nº lançamentos', estornos: 'Nº estornos', bruto: 'Bruto (R$)', valor_estornos: '(-) Estornos (R$)', liquido: 'Líquido (R$)' },
        },
        {
          titulo: 'Quadro 2 - FUNDEB 70% - Resumo por elemento de despesa e fonte de recurso', tipo: 'pivot',
          pivot: { linha: 'elemento_despesa', coluna: 'fonte', valor: 'valor' },
          sql: `SELECT elemento_despesa, fonte, SUM(valor_liquido) AS valor FROM v_liquidacoes
                WHERE ${FILTRO_FUNDEB} AND ${BLOCO70} AND sem_empenho = 0 GROUP BY 1, 2 ORDER BY 1, 2`,
          nota: 'Valores líquidos de estornos.',
        },
        {
          titulo: 'Quadro 3 - FUNDEB 70% - Relação analítica das liquidações',
          sql: `SELECT elemento_despesa, numero_empenho, data_br(data_empenho) AS emissao, numero_liquidacao AS sub, data_br(data_liquidacao) AS data_liquidacao,
                       comp_br(_competencia) AS competencia, _arquivo AS arquivo, _linha AS linha, fonte, valor_liquidacao AS valor, situacao, valor_liquido
                FROM v_liquidacoes WHERE ${FILTRO_FUNDEB} AND ${BLOCO70} AND sem_empenho = 0
                ORDER BY elemento_despesa, numero_empenho, numero_liquidacao, data_liquidacao`,
          agrupar: 'elemento_despesa', totalizar: true, formatos: { linha: 'int' },
          rotulos: { numero_empenho: 'Empenho', emissao: 'Emissão', sub: 'Sub', data_liquidacao: 'Data da liquidação', competencia: 'Competência', arquivo: 'Arquivo de remessa', linha: 'Linha', fonte: 'Fonte', valor: 'Valor (R$)', situacao: 'Situação', valor_liquido: 'Líquido (R$)' },
          destaque: { coluna: 'situacao', valor: 'Estorno' },
          nota: 'Lançamentos de estorno indicados em vermelho e deduzidos do valor líquido.',
        },
        {
          titulo: 'Quadro 4 - FUNDEB 30% - Resumo por elemento de despesa e fonte de recurso', tipo: 'pivot',
          pivot: { linha: 'elemento_despesa', coluna: 'fonte', valor: 'valor' },
          sql: `SELECT elemento_despesa, fonte, SUM(valor_liquido) AS valor FROM v_liquidacoes
                WHERE ${FILTRO_FUNDEB} AND ${BLOCO30} AND sem_empenho = 0 GROUP BY 1, 2 ORDER BY 1, 2`,
          nota: 'Valores líquidos de estornos.',
        },
        {
          titulo: 'Quadro 5 - FUNDEB 30% - Relação das liquidações por nota de empenho',
          sql: `SELECT elemento_despesa, numero_empenho, emissao, fonte, lancamentos, competencias, bruto, estornos, liquido FROM (
                  SELECT elemento_despesa, numero_empenho, data_br(data_empenho) AS emissao, fonte, COUNT(*) AS lancamentos,
                         (SELECT GROUP_CONCAT(c, ', ') FROM (SELECT DISTINCT comp_br(x._competencia) AS c FROM v_liquidacoes x
                            WHERE x.orgao = l.orgao AND x.unidade = l.unidade AND x.numero_empenho = l.numero_empenho AND x.data_empenho = l.data_empenho ORDER BY x._competencia)) AS competencias,
                         SUM(valor_liquidacao) AS bruto, SUM(CASE WHEN estornada = 1 THEN valor_liquidacao ELSE 0 END) AS estornos, SUM(valor_liquido) AS liquido
                  FROM v_liquidacoes l WHERE ${FILTRO_FUNDEB} AND ${BLOCO30} AND sem_empenho = 0
                  GROUP BY elemento_despesa, l.orgao, l.unidade, numero_empenho, data_empenho, fonte)
                ORDER BY elemento_despesa, numero_empenho`,
          agrupar: 'elemento_despesa', totalizar: true, formatos: { lancamentos: 'int' },
          rotulos: { numero_empenho: 'Empenho', emissao: 'Emissão', fonte: 'Fonte', lancamentos: 'Nº de lançamentos', competencias: 'Arquivos de remessa (competência)', bruto: 'Bruto (R$)', estornos: 'Estornos (R$)', liquido: 'Líquido (R$)' },
        },
        {
          titulo: 'Quadro 6 - Estornos de liquidação (EL) nas fontes do FUNDEB',
          sql: `SELECT numero_empenho, numero_liquidacao AS sub, data_br(data_liquidacao) AS data_liquidacao, data_br(data_estorno) AS data_estorno,
                       comp_br(competencia_estorno) AS competencia_estorno, _arquivo AS arquivo_lq, _linha AS linha_lq, fonte, elemento_despesa, valor_liquidacao AS valor, motivo_estorno
                FROM v_liquidacoes WHERE ${FILTRO_FUNDEB} AND estornada = 1 ORDER BY numero_empenho, numero_liquidacao`,
          totalizar: true, formatos: { linha_lq: 'int' },
          rotulos: { numero_empenho: 'Empenho', sub: 'Sub', data_liquidacao: 'Data da liquidação', data_estorno: 'Data do estorno', competencia_estorno: 'Competência do estorno', arquivo_lq: 'Arquivo LQ', linha_lq: 'Linha', fonte: 'Fonte', elemento_despesa: 'Elemento', valor: 'Valor (R$)', motivo_estorno: 'Motivo' },
        },
        {
          titulo: 'Quadro 7 - Liquidações sem nota de empenho localizada nas remessas carregadas',
          sql: `SELECT numero_empenho, data_br(data_empenho) AS emissao, numero_liquidacao AS sub, data_br(data_liquidacao) AS data_liquidacao, comp_br(_competencia) AS competencia,
                       _arquivo AS arquivo, _linha AS linha, orgao, unidade, valor_liquidacao AS valor
                FROM v_liquidacoes WHERE sem_empenho = 1 ORDER BY data_empenho, numero_empenho, numero_liquidacao`,
          totalizar: true, formatos: { linha: 'int' },
          rotulos: { numero_empenho: 'Empenho', emissao: 'Emissão', sub: 'Sub', data_liquidacao: 'Data da liquidação', competencia: 'Competência', arquivo: 'Arquivo', linha: 'Linha', valor: 'Valor (R$)' },
          nota: 'Estas liquidações não puderam ser classificadas por fonte/elemento porque o empenho não está em nenhum arquivo NE carregado (normalmente empenhos de competências ainda não carregadas ou de exercícios anteriores). Carregue todas as competências do exercício para zerar este quadro.',
        },
      ],
      rodape: 'Fonte: arquivos NE, LQ e EL das remessas mensais ao Sistema de Informações Municipais (SIM/TCE-CE).',
    },
    {
      id: 'posicao_empenhos', nome: 'Posição consolidada por empenho (empenhado × liquidado × pago)',
      titulo: 'Posição Consolidada dos Empenhos', subtitulo: 'Empenhado, anulado, liquidado, estornado e pago por nota de empenho',
      descricao: 'Para cada empenho (NE) soma anulações (AE), liquidações (LQ), estornos de liquidação (EL) e pagamentos (NP).',
      params: [
        { nome: 'orgao', rotulo: 'Órgão (vazio = todos)', padrao: '' },
        { nome: 'fonte_prefixo', rotulo: 'Prefixo da fonte (vazio = todas)', padrao: '' },
        { nome: 'elemento_prefixo', rotulo: 'Prefixo do elemento (vazio = todos)', padrao: '' },
      ],
      secoes: [{
        titulo: 'Empenhos',
        sql: `SELECT orgao, unidade, numero_empenho, data_br(data_empenho) AS emissao, tipo_empenho, elemento_despesa, fonte, nome_credor,
                     valor_empenho, valor_anulado, valor_liquidado_bruto, valor_estornado, (valor_liquidado_bruto - valor_estornado) AS valor_liquidado, valor_pago,
                     (valor_empenho - valor_anulado - (valor_liquidado_bruto - valor_estornado)) AS saldo_a_liquidar,
                     ((valor_liquidado_bruto - valor_estornado) - valor_pago) AS saldo_a_pagar
              FROM v_empenhos
              WHERE ('{{orgao}}' = '' OR orgao = '{{orgao}}') AND fonte_recurso_ok('{{fonte_prefixo}}', fonte) AND ('{{elemento_prefixo}}' = '' OR elemento_despesa LIKE '{{elemento_prefixo}}%')
              ORDER BY orgao, unidade, data_empenho, numero_empenho`,
        totalizar: true,
        rotulos: { numero_empenho: 'Empenho', emissao: 'Emissão', tipo_empenho: 'Tipo', elemento_despesa: 'Elemento', nome_credor: 'Credor', valor_empenho: 'Empenhado (R$)', valor_anulado: 'Anulado (R$)', valor_liquidado_bruto: 'Liquidado bruto (R$)', valor_estornado: 'Estornado (R$)', valor_liquidado: 'Liquidado líquido (R$)', valor_pago: 'Pago (R$)', saldo_a_liquidar: 'Saldo a liquidar (R$)', saldo_a_pagar: 'Saldo a pagar (R$)' },
      }],
      rodape: 'Fonte: arquivos NE, AE, LQ, EL e NP das remessas ao SIM/TCE-CE.',
    },
    {
      id: 'liquidacoes_credor', nome: 'Liquidações por credor e elemento de despesa',
      titulo: 'Liquidações por Credor', subtitulo: 'Valores líquidos de estornos, agrupados por credor e elemento',
      params: [{ nome: 'fonte_prefixo', rotulo: 'Prefixo da fonte (vazio = todas)', padrao: '' }],
      secoes: [{
        titulo: 'Credores',
        sql: `SELECT nome_credor, cpf_cnpj_credor, elemento_despesa, COUNT(*) AS lancamentos, SUM(valor_liquidacao) AS bruto,
                     SUM(CASE WHEN estornada = 1 THEN valor_liquidacao ELSE 0 END) AS estornos, SUM(valor_liquido) AS liquido
              FROM v_liquidacoes WHERE sem_empenho = 0 AND fonte_recurso_ok('{{fonte_prefixo}}', fonte)
              GROUP BY 1, 2, 3 ORDER BY nome_credor, elemento_despesa`,
        agrupar: 'nome_credor', totalizar: true, formatos: { lancamentos: 'int' },
        rotulos: { nome_credor: 'Credor', cpf_cnpj_credor: 'CPF/CNPJ', elemento_despesa: 'Elemento', lancamentos: 'Nº lançamentos', bruto: 'Bruto (R$)', estornos: 'Estornos (R$)', liquido: 'Líquido (R$)' },
      }],
    },
    {
      id: 'empenhos_elemento_fonte', nome: 'Empenhos por elemento de despesa e fonte',
      titulo: 'Empenhos por Elemento e Fonte', subtitulo: 'Valor empenhado líquido de anulações',
      params: [{ nome: 'orgao', rotulo: 'Órgão (vazio = todos)', padrao: '' }],
      secoes: [
        { titulo: 'Resumo', tipo: 'pivot', pivot: { linha: 'elemento_despesa', coluna: 'fonte', valor: 'valor' },
          sql: `SELECT elemento_despesa, fonte, SUM(valor_empenho - valor_anulado) AS valor FROM v_empenhos WHERE ('{{orgao}}' = '' OR orgao = '{{orgao}}') GROUP BY 1, 2` },
        { titulo: 'Por órgão e unidade',
          sql: `SELECT orgao, unidade, elemento_despesa, COUNT(*) AS empenhos, SUM(valor_empenho) AS empenhado, SUM(valor_anulado) AS anulado, SUM(valor_empenho - valor_anulado) AS liquido
                FROM v_empenhos WHERE ('{{orgao}}' = '' OR orgao = '{{orgao}}') GROUP BY 1, 2, 3 ORDER BY 1, 2, 3`,
          agrupar: 'orgao', totalizar: true, formatos: { empenhos: 'int' },
          rotulos: { elemento_despesa: 'Elemento', empenhos: 'Nº empenhos', empenhado: 'Empenhado (R$)', anulado: 'Anulado (R$)', liquido: 'Líquido (R$)' } },
      ],
    },
    {
      id: 'pagamentos_conta', nome: 'Pagamentos por conta bancária',
      titulo: 'Pagamentos por Conta Bancária', subtitulo: 'Notas de pagamento (NP) com o detalhe bancário (CP)',
      params: [],
      secoes: [
        { titulo: 'Resumo por conta', sql: `SELECT banco, agencia, conta, COUNT(*) AS pagamentos, SUM(valor_pago) AS valor FROM v_pagamentos GROUP BY 1, 2, 3 ORDER BY 1, 2, 3`, totalizar: true, formatos: { pagamentos: 'int' }, rotulos: { pagamentos: 'Nº pagamentos', valor: 'Valor pago (R$)' } },
        { titulo: 'Pagamentos', sql: `SELECT comp_br(_competencia) AS competencia, numero_empenho, numero_liquidacao AS sub, numero_pagamento, data_br(data_pagamento) AS data_pagamento, nome_credor, elemento_despesa, fonte, banco, agencia, conta, numero_documento_bancario AS documento, valor_pago, CASE WHEN estornado = 1 THEN 'Estornado' ELSE '' END AS situacao FROM v_pagamentos ORDER BY _competencia, data_pagamento, numero_pagamento`,
          totalizar: true, destaque: { coluna: 'situacao', valor: 'Estornado' },
          rotulos: { competencia: 'Competência', numero_empenho: 'Empenho', sub: 'Sub', numero_pagamento: 'Pagamento', data_pagamento: 'Data', nome_credor: 'Credor', elemento_despesa: 'Elemento', valor_pago: 'Valor (R$)', situacao: 'Situação' } },
      ],
    },
    {
      id: 'inventario_remessas', nome: 'Inventário das remessas carregadas',
      titulo: 'Inventário das Remessas Carregadas', subtitulo: 'Arquivos, competências e quantidade de registros',
      params: [],
      secoes: [
        { titulo: 'Arquivos', sql: `SELECT prefixo, comp_br(competencia) AS competencia, nome, linhas, pacote, avisos FROM _arquivos ORDER BY competencia, prefixo`, totalizar: true, formatos: { linhas: 'int' }, rotulos: { prefixo: 'Tipo', competencia: 'Competência', nome: 'Arquivo', linhas: 'Registros', pacote: 'Pacote', avisos: 'Avisos' } },
        { titulo: 'Registros por tipo e competência', tipo: 'pivot', pivot: { linha: 'prefixo', coluna: 'competencia', valor: 'linhas' }, formatos: { valor: 'int' }, sql: `SELECT prefixo, comp_br(competencia) AS competencia, linhas FROM _arquivos` },
      ],
    },
  ];

  /* ---------------------------------------------------------------- utilidades */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtMoeda = v => v == null || v === '' ? '' : Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtInt = v => v == null || v === '' ? '' : Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 0 });
  const fmtData = v => { const s = String(v == null ? '' : v); return /^\d{8}$/.test(s) ? `${s.slice(6, 8)}/${s.slice(4, 6)}/${s.slice(0, 4)}` : s; };
  const fmtComp = v => { const s = String(v == null ? '' : v); return /^\d{6}$/.test(s) ? `${s.slice(4, 6)}/${s.slice(0, 4)}` : s; };

  const RE_MOEDA = /(^|_)(valor|total|bruto|liquido|estorno|estornos|saldo|pago|empenhado|anulado|liquidado|retencoes|subtotal|dotacao|debitos|creditos|quantidade|valor_unitario)/i;

  /** Decide o formato de cada coluna: explícito > nome da coluna > tipo dos dados */
  function formatoColuna(nome, valores, explicitos) {
    if (explicitos && explicitos[nome]) return explicitos[nome];
    if (/^data_|_data$|^data$|^emissao$/i.test(nome)) return 'data';
    if (/competencia/i.test(nome)) return 'comp';
    const n = nome.toLowerCase();
    if (/^_?linha$|^qtd|^lancamentos$|^count|^quantidade_|^n_|^num_|^registros$/.test(n)) return 'int';
    const amostra = valores.find(v => v != null && v !== '');
    if (typeof amostra === 'number') return RE_MOEDA.test(nome) || !Number.isInteger(amostra) ? 'moeda' : (/^\d{8}$/.test(String(amostra)) ? 'texto' : 'moeda');
    return 'texto';
  }

  function formatar(v, f) {
    if (v == null) return '';
    switch (f) {
      case 'moeda': return typeof v === 'number' ? fmtMoeda(v) : String(v);
      case 'int': return typeof v === 'number' ? fmtInt(v) : String(v);
      case 'data': return fmtData(v);
      case 'comp': return fmtComp(v);
      default: return String(v);
    }
  }

  function aplicarParams(sql, params) {
    return sql.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (m, k) => String(params[k] == null ? '' : params[k]).replace(/'/g, "''"));
  }

  /** Transforma um resultado longo (linha, coluna, valor) em tabela cruzada */
  function pivotar(res, pv) {
    const ci = res.columns.indexOf(pv.linha), cj = res.columns.indexOf(pv.coluna), cv = res.columns.indexOf(pv.valor);
    if (ci < 0 || cj < 0 || cv < 0) throw new Error(`Pivot: colunas ${pv.linha}/${pv.coluna}/${pv.valor} não encontradas no resultado`);
    const linhas = new Map(), colunas = new Set();
    for (const r of res.values) {
      const a = r[ci] == null ? '' : String(r[ci]), b = r[cj] == null ? '' : String(r[cj]);
      colunas.add(b);
      if (!linhas.has(a)) linhas.set(a, new Map());
      const m = linhas.get(a); m.set(b, (m.get(b) || 0) + (Number(r[cv]) || 0));
    }
    const cols = [...colunas].sort();
    const out = { columns: [pv.linha, ...cols, 'Total'], values: [], pivot: true };
    const totCol = new Array(cols.length + 1).fill(0);
    for (const k of [...linhas.keys()].sort()) {
      const m = linhas.get(k); let tot = 0;
      const row = [k];
      cols.forEach((c, i) => { const v = m.get(c) || 0; row.push(v); tot += v; totCol[i] += v; });
      row.push(tot); totCol[cols.length] += tot; out.values.push(row);
    }
    out.total = ['TOTAL', ...totCol];
    return out;
  }

  /** Executa todas as seções do relatório. Devolve estrutura pronta para renderizar/exportar. */
  function executar(def, params, consultar) {
    const p = Object.assign({}, ...(def.params || []).map(x => ({ [x.nome]: x.padrao })), params || {});
    const out = { def, params: p, secoes: [], erros: [] };
    for (const s of def.secoes) {
      const sql = aplicarParams(s.sql, p);
      let res;
      try { res = consultar(sql); }
      catch (e) { out.erros.push(`${s.titulo}: ${e.message}`); out.secoes.push({ def: s, erro: e.message, sql }); continue; }
      const sec = { def: s, sql, columns: res.columns, values: res.values };
      if (s.tipo === 'pivot') {
        const pv = pivotar(res, s.pivot);
        sec.columns = pv.columns; sec.values = pv.values; sec.total = pv.total; sec.pivot = true;
        sec.formatos = pv.columns.map((c, i) => i === 0 ? 'texto' : ((s.formatos && s.formatos.valor) || 'moeda'));
      } else {
        sec.formatos = res.columns.map((c, i) => formatoColuna(c, res.values.map(r => r[i]), s.formatos));
      }
      sec.rotulos = sec.columns.map(c => (s.rotulos && s.rotulos[c]) || c);
      out.secoes.push(sec);
    }
    return out;
  }

  /* ---------------------------------------------------------------- renderização HTML */
  function somar(values, idx) { let t = 0; for (const r of values) t += Number(r[idx]) || 0; return t; }

  function renderSecao(sec) {
    const s = sec.def;
    let h = `<section class="rel-secao"><h3>${esc(s.titulo)}</h3>`;
    if (sec.erro) return h + `<p class="rel-erro">Erro na consulta: ${esc(sec.erro)}</p></section>`;
    if (!sec.values.length) return h + `<p class="rel-vazio">Nenhum registro.</p>${s.nota ? `<p class="rel-nota">${esc(s.nota)}</p>` : ''}</section>`;
    const numCols = sec.formatos.map(f => f === 'moeda' || f === 'int');
    const somaCols = sec.formatos.map((f, i) => f === 'moeda' || (f === 'int' && sec.pivot));
    const gi = s.agrupar ? sec.columns.indexOf(s.agrupar) : -1;
    const di = s.destaque ? sec.columns.indexOf(s.destaque.coluna) : -1;
    const colsVis = sec.columns.map((c, i) => i).filter(i => i !== gi);
    h += `<div class="tabela-wrap"><table class="rel-tabela"><thead><tr>`;
    for (const i of colsVis) h += `<th class="${numCols[i] ? 'num' : ''}">${esc(sec.rotulos[i])}</th>`;
    h += `</tr></thead><tbody>`;
    const linhaTotal = (rotulo, vals, cls) => {
      let t = `<tr class="${cls}">`;
      let primeiro = true;
      for (const i of colsVis) {
        if (somaCols[i]) t += `<td class="num">${formatar(somar(vals, i), sec.formatos[i])}</td>`;
        else t += `<td>${primeiro ? esc(rotulo) : ''}</td>`;
        primeiro = false;
      }
      return t + '</tr>';
    };
    if (gi >= 0) {
      let grupo = null, buf = [];
      const flush = () => { if (buf.length) h += linhaTotal('Subtotal', buf, 'rel-subtotal'); buf = []; };
      for (const r of sec.values) {
        const g = r[gi] == null ? '' : String(r[gi]);
        if (g !== grupo) { flush(); grupo = g; h += `<tr class="rel-grupo"><td colspan="${colsVis.length}">${esc(sec.rotulos[gi])}: ${esc(g)}</td></tr>`; }
        h += renderLinha(r, colsVis, sec, numCols, di, s.destaque); buf.push(r);
      }
      flush();
    } else {
      for (const r of sec.values) h += renderLinha(r, colsVis, sec, numCols, di, s.destaque);
    }
    if (sec.pivot) h += linhaTotal('TOTAL', sec.values, 'rel-total');
    else if (s.totalizar && somaCols.some(Boolean)) h += linhaTotal('TOTAL', sec.values, 'rel-total');
    h += `</tbody></table></div>`;
    h += `<p class="rel-contagem">${sec.values.length.toLocaleString('pt-BR')} registro(s).</p>`;
    if (s.nota) h += `<p class="rel-nota">${esc(s.nota)}</p>`;
    return h + '</section>';
  }

  function renderLinha(r, colsVis, sec, numCols, di, destaque) {
    const cls = di >= 0 && destaque && String(r[di]) === String(destaque.valor) ? ' class="rel-destaque"' : '';
    let t = `<tr${cls}>`;
    for (const i of colsVis) t += `<td class="${numCols[i] ? 'num' : ''}">${esc(formatar(r[i], sec.formatos[i]))}</td>`;
    return t + '</tr>';
  }

  function renderRelatorio(res, cab) {
    const d = res.def;
    const hoje = new Date().toLocaleDateString('pt-BR');
    let h = `<article class="relatorio"><header class="rel-cab"><div><div class="rel-entidade">${esc(cab.entidade || '')}</div><h2>${esc(d.titulo)}</h2>`;
    if (d.subtitulo) h += `<div class="rel-sub">${esc(d.subtitulo)}</div>`;
    h += `</div><div class="rel-meta"><div>Período das remessas: ${esc(cab.periodo || '-')}</div><div>Gerado em ${hoje}</div>`;
    const ps = (d.params || []).filter(p => res.params[p.nome] !== '' && res.params[p.nome] != null);
    if (ps.length) h += `<div>Parâmetros: ${ps.map(p => `${esc(p.rotulo)} = <b>${esc(res.params[p.nome])}</b>`).join('; ')}</div>`;
    h += `</div></header>`;
    if (d.descricao) h += `<p class="rel-descricao">${esc(d.descricao)}</p>`;
    for (const s of res.secoes) h += renderSecao(s);
    if (d.rodape) h += `<footer class="rel-rodape">${esc(d.rodape)}</footer>`;
    return h + '</article>';
  }

  /* ---------------------------------------------------------------- exportação */
  function secaoParaAOA(sec, comTotal) {
    const aoa = [sec.rotulos.slice()];
    for (const r of sec.values) aoa.push(r.map((v, i) => sec.formatos[i] === 'data' ? fmtData(v) : sec.formatos[i] === 'comp' ? fmtComp(v) : v));
    if (comTotal && (sec.pivot || sec.def.totalizar)) {
      const tot = sec.columns.map((c, i) => (sec.formatos[i] === 'moeda' || (sec.pivot && i > 0)) ? somar(sec.values, i) : (i === 0 ? 'TOTAL' : ''));
      aoa.push(tot);
    }
    return aoa;
  }

  function nomeAba(s, i) { return (String(i + 1).padStart(2, '0') + ' ' + s.replace(/[\\/?*\[\]:]/g, ' ')).slice(0, 31); }

  function exportarXLSX(res, nomeArquivo) {
    if (!global.XLSX) throw new Error('SheetJS não carregado');
    const wb = global.XLSX.utils.book_new();
    res.secoes.forEach((sec, i) => {
      if (sec.erro) return;
      const ws = global.XLSX.utils.aoa_to_sheet(secaoParaAOA(sec, true));
      // formato numérico nas colunas de moeda
      const range = global.XLSX.utils.decode_range(ws['!ref'] || 'A1');
      for (let R = 1; R <= range.e.r; R++) for (let C = 0; C <= range.e.c; C++) {
        const cell = ws[global.XLSX.utils.encode_cell({ r: R, c: C })];
        if (cell && typeof cell.v === 'number' && sec.formatos[C] === 'moeda') cell.z = '#,##0.00';
      }
      ws['!cols'] = sec.columns.map((c, ci) => ({ wch: Math.min(60, Math.max(10, ...[sec.rotulos[ci].length, ...sec.values.slice(0, 200).map(r => String(r[ci] == null ? '' : r[ci]).length)])) }));
      global.XLSX.utils.book_append_sheet(wb, ws, nomeAba(sec.def.titulo, i));
    });
    global.XLSX.writeFile(wb, nomeArquivo);
  }

  function resultadoParaCSV(columns, values) {
    const q = v => { const s = v == null ? '' : (typeof v === 'number' ? String(v).replace('.', ',') : String(v)); return /[";\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    return '﻿' + [columns.map(q).join(';'), ...values.map(r => r.map(q).join(';'))].join('\r\n');
  }

  function resultadoParaTSV(columns, values) {
    const q = v => v == null ? '' : (typeof v === 'number' ? String(v).replace('.', ',') : String(v).replace(/[\t\r\n]+/g, ' '));
    return [columns.map(q).join('\t'), ...values.map(r => r.map(q).join('\t'))].join('\n');
  }

  function baixar(nome, conteudo, tipo) {
    const blob = new Blob([conteudo], { type: tipo || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = nome; document.body.appendChild(a); a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 500);
  }

  function exportarResultadoXLSX(columns, values, nome) {
    const ws = global.XLSX.utils.aoa_to_sheet([columns, ...values]);
    const wb = global.XLSX.utils.book_new(); global.XLSX.utils.book_append_sheet(wb, ws, 'Consulta');
    global.XLSX.writeFile(wb, nome);
  }

  global.SIM_REPORTS = { PRESETS, executar, renderRelatorio, exportarXLSX, resultadoParaCSV, resultadoParaTSV, baixar, exportarResultadoXLSX, aplicarParams, formatar, formatoColuna, esc, fmtMoeda };
})(window);
