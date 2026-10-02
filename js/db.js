/* ==========================================================================
 * Camada de banco de dados: SQLite em memória (sql.js) com uma tabela por
 * tipo de arquivo, funções auxiliares em SQL e visões de cruzamento.
 * ========================================================================== */
(function (global) {
  'use strict';

  const { LAYOUTS, META } = global.SIM_LAYOUTS;
  let SQL = null, db = null;
  const arquivos = [];          // {nome, competencia, prefixo, linhas, pacote, avisos}
  const extras = {};            // tabelas desconhecidas: prefixo -> ncols

  function b64ToBytes(b64) {
    const bin = atob(b64); const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  async function init() {
    if (db) return db;
    const cfg = {};
    if (global.SQL_WASM_B64) cfg.wasmBinary = b64ToBytes(global.SQL_WASM_B64);
    else cfg.locateFile = f => 'vendor/' + f;
    SQL = await global.initSqlJs(cfg);
    db = new SQL.Database();
    registrarFuncoes();
    criarTabelas();
    criarVisoes();
    return db;
  }

  function registrarFuncoes() {
    // data_br('20231227') -> '27/12/2023'
    db.create_function('data_br', v => {
      if (v == null) return null; const s = String(v);
      return s.length === 8 ? s.slice(6, 8) + '/' + s.slice(4, 6) + '/' + s.slice(0, 4) : s;
    });
    // comp_br('202312') -> '12/2023'
    db.create_function('comp_br', v => {
      if (v == null) return null; const s = String(v);
      return s.length === 6 ? s.slice(4, 6) + '/' + s.slice(0, 4) : s;
    });
    // moeda(1234.5) -> '1.234,50'
    db.create_function('moeda', v => v == null ? null : Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    // fonte_completa('1','542107000') -> '1542107000'
    db.create_function('fonte_completa', (ex, f) => (ex == null ? '' : String(ex)) + (f == null ? '' : String(f)));
    // fonte_recurso_ok('154', '1542107000') -> 1 ; prefixo vazio aceita tudo; aceita prefixo com ou sem o dígito do exercício
    db.create_function('fonte_recurso_ok', (pref, fonte) => {
      const p = pref == null ? '' : String(pref).trim(); if (!p) return 1;
      const f = fonte == null ? '' : String(fonte);
      return (f.startsWith(p) || f.slice(1).startsWith(p)) ? 1 : 0;
    });
    db.create_function('regexp', (re, s) => (s != null && new RegExp(re).test(String(s))) ? 1 : 0);
  }

  function colType(t) { return t === 'num' ? 'REAL' : 'TEXT'; }

  function ddlTabela(prefixo, campos) {
    const cols = campos.map(c => `"${c.n}" ${colType(c.t)}`).concat(META.map(c => `"${c.n}" ${colType(c.t)}`));
    return `CREATE TABLE IF NOT EXISTS "${prefixo}" (${cols.join(', ')})`;
  }

  function criarTabelas() {
    for (const p of Object.keys(LAYOUTS)) db.run(ddlTabela(p, LAYOUTS[p].campos));
    db.run(`CREATE TABLE IF NOT EXISTS _arquivos (nome TEXT, prefixo TEXT, competencia TEXT, extensao TEXT, linhas INTEGER, pacote TEXT, avisos TEXT)`);
    // Índices nas chaves de cruzamento (essenciais quando há 12 competências carregadas)
    for (const p of ['NE', 'LQ', 'EL', 'AE', 'NP', 'CP', 'DP', 'PF', 'EG', 'NF', 'IF'])
      db.run(`CREATE INDEX IF NOT EXISTS "ix_${p}_emp" ON "${p}" (orgao, unidade, numero_empenho, data_empenho)`);
    db.run(`CREATE INDEX IF NOT EXISTS ix_EL_liq ON EL (orgao, unidade, numero_empenho, data_empenho, data_liquidacao)`);
    db.run(`CREATE INDEX IF NOT EXISTS ix_LQ_liq ON LQ (orgao, unidade, numero_empenho, data_empenho, data_liquidacao)`);
  }

  function criarVisoes() {
    // ne_unica: uma linha por empenho, materializada (recalculada após cada carga) para que as junções sejam rápidas
    db.run(ddlTabela('ne_unica', LAYOUTS.NE.campos));
    db.run(`CREATE INDEX IF NOT EXISTS ix_ne_unica ON ne_unica (orgao, unidade, numero_empenho, data_empenho)`);
    db.run(`DROP VIEW IF EXISTS v_ne`);
    db.run(`CREATE VIEW v_ne AS SELECT * FROM ne_unica`);
    db.run(`DROP VIEW IF EXISTS v_estornos_liq`);
    db.run(`CREATE VIEW v_estornos_liq AS
      SELECT orgao, unidade, numero_empenho, data_empenho, data_liquidacao, MIN(data_estorno) AS data_estorno, MIN(_competencia) AS competencia_estorno,
             COUNT(*) AS qtd_estornos, GROUP_CONCAT(motivo, ' | ') AS motivo
      FROM EL GROUP BY orgao, unidade, numero_empenho, data_empenho, data_liquidacao`);
    db.run(`DROP VIEW IF EXISTS v_liquidacoes`);
    // Liquidações enriquecidas com os dados do empenho e a marcação de estorno
    db.run(`CREATE VIEW v_liquidacoes AS
      SELECT lq.orgao, lq.unidade, lq.numero_empenho, lq.data_empenho, lq.numero_liquidacao, lq.data_liquidacao, lq.competencia,
             lq.valor_liquidacao, lq.cpf_ordenador, lq.nome_ordenador, lq.tipo_folha, lq.competencia_folha, lq.data_folha, lq.valor_folha,
             lq._arquivo, lq._competencia, lq._linha, lq._pacote,
             ne.elemento_despesa, ne.exercicio_fonte, ne.fonte_recurso, fonte_completa(ne.exercicio_fonte, ne.fonte_recurso) AS fonte,
             ne.funcao, ne.subfuncao, ne.programa, ne.acao, ne.tipo_empenho, ne.tipo_credor, ne.cpf_cnpj_credor, ne.nome_credor,
             ne.historico, ne.valor_empenho, ne.numero_contrato, ne.numero_licitacao, ne._competencia AS competencia_ne,
             CASE WHEN ne.numero_empenho IS NULL THEN 1 ELSE 0 END AS sem_empenho,
             CASE WHEN el.numero_empenho IS NOT NULL THEN 1 ELSE 0 END AS estornada,
             el.data_estorno, el.competencia_estorno, el.motivo AS motivo_estorno,
             CASE WHEN el.numero_empenho IS NOT NULL THEN 'Estorno' ELSE 'Liquidação' END AS situacao,
             CASE WHEN el.numero_empenho IS NOT NULL THEN -lq.valor_liquidacao ELSE lq.valor_liquidacao END AS valor_liquido
      FROM LQ lq
      LEFT JOIN v_ne ne ON ne.orgao = lq.orgao AND ne.unidade = lq.unidade AND ne.numero_empenho = lq.numero_empenho AND ne.data_empenho = lq.data_empenho
      LEFT JOIN v_estornos_liq el ON el.orgao = lq.orgao AND el.unidade = lq.unidade AND el.numero_empenho = lq.numero_empenho
            AND el.data_empenho = lq.data_empenho AND el.data_liquidacao = lq.data_liquidacao`);
    db.run(`DROP VIEW IF EXISTS v_pagamentos`);
    db.run(`CREATE VIEW v_pagamentos AS
      SELECT np.*, ne.elemento_despesa, fonte_completa(ne.exercicio_fonte, ne.fonte_recurso) AS fonte, ne.nome_credor, ne.cpf_cnpj_credor, ne.historico,
             cp.banco, cp.agencia, cp.conta, cp.numero_documento_bancario, cp.qtd_documentos, cp.valor_documentos,
             CASE WHEN eg.numero_empenho IS NOT NULL THEN 1 ELSE 0 END AS estornado
      FROM NP np
      LEFT JOIN v_ne ne ON ne.orgao = np.orgao AND ne.unidade = np.unidade AND ne.numero_empenho = np.numero_empenho AND ne.data_empenho = np.data_empenho
      LEFT JOIN (SELECT orgao, unidade, numero_empenho, data_empenho, numero_liquidacao, numero_pagamento, _competencia,
                        MIN(banco) AS banco, MIN(agencia) AS agencia, MIN(conta) AS conta, GROUP_CONCAT(numero_documento_bancario, ', ') AS numero_documento_bancario,
                        COUNT(*) AS qtd_documentos, SUM(valor) AS valor_documentos
                 FROM CP GROUP BY orgao, unidade, numero_empenho, data_empenho, numero_liquidacao, numero_pagamento, _competencia) cp
            ON cp.orgao = np.orgao AND cp.unidade = np.unidade AND cp.numero_empenho = np.numero_empenho AND cp.data_empenho = np.data_empenho
            AND cp.numero_liquidacao = np.numero_liquidacao AND cp.numero_pagamento = np.numero_pagamento AND cp._competencia = np._competencia
      LEFT JOIN (SELECT DISTINCT orgao, unidade, numero_empenho, data_empenho, numero_liquidacao, numero_pagamento FROM EG) eg
            ON eg.orgao = np.orgao AND eg.unidade = np.unidade AND eg.numero_empenho = np.numero_empenho AND eg.data_empenho = np.data_empenho
            AND eg.numero_liquidacao = np.numero_liquidacao AND eg.numero_pagamento = np.numero_pagamento`);
    db.run(`DROP VIEW IF EXISTS v_empenhos`);
    // Posição consolidada por empenho: empenhado, anulado, liquidado, estornado, pago
    db.run(`CREATE VIEW v_empenhos AS
      SELECT ne.orgao, ne.unidade, ne.numero_empenho, ne.data_empenho, ne.competencia AS competencia_empenho, ne.tipo_empenho,
             ne.elemento_despesa, fonte_completa(ne.exercicio_fonte, ne.fonte_recurso) AS fonte, ne.funcao, ne.subfuncao, ne.programa, ne.acao,
             ne.tipo_credor, ne.cpf_cnpj_credor, ne.nome_credor, ne.historico, ne.numero_contrato, ne.numero_licitacao,
             ne.valor_empenho,
             IFNULL((SELECT SUM(valor_anulacao) FROM AE a WHERE a.orgao = ne.orgao AND a.unidade = ne.unidade AND a.numero_empenho = ne.numero_empenho AND a.data_empenho = ne.data_empenho), 0) AS valor_anulado,
             IFNULL((SELECT SUM(valor_liquidacao) FROM LQ l WHERE l.orgao = ne.orgao AND l.unidade = ne.unidade AND l.numero_empenho = ne.numero_empenho AND l.data_empenho = ne.data_empenho), 0) AS valor_liquidado_bruto,
             IFNULL((SELECT SUM(valor_liquidacao) FROM v_liquidacoes l WHERE l.estornada = 1 AND l.orgao = ne.orgao AND l.unidade = ne.unidade AND l.numero_empenho = ne.numero_empenho AND l.data_empenho = ne.data_empenho), 0) AS valor_estornado,
             IFNULL((SELECT SUM(valor_pago) FROM NP p WHERE p.orgao = ne.orgao AND p.unidade = ne.unidade AND p.numero_empenho = ne.numero_empenho AND p.data_empenho = ne.data_empenho), 0) AS valor_pago,
             (SELECT COUNT(*) FROM LQ l WHERE l.orgao = ne.orgao AND l.unidade = ne.unidade AND l.numero_empenho = ne.numero_empenho AND l.data_empenho = ne.data_empenho) AS qtd_liquidacoes,
             ne._arquivo, ne._competencia, ne._linha
      FROM v_ne ne`);
  }

  /** Carrega um arquivo lido (info + rows) na tabela correspondente. Devolve resumo. */
  function carregarArquivo({ info, rows, pacote }) {
    const layout = LAYOUTS[info.prefixo];
    const avisos = [];
    let campos;
    if (layout) campos = layout.campos;
    else {
      const ncols = Math.max(1, ...rows.map(r => r.length));
      campos = []; for (let i = 1; i <= ncols; i++) campos.push({ n: 'c' + String(i).padStart(2, '0'), t: 'txt' });
      if (!extras[info.prefixo]) { db.run(ddlTabela(info.prefixo, campos)); extras[info.prefixo] = ncols; }
      else if (extras[info.prefixo] < ncols) {
        for (let i = extras[info.prefixo] + 1; i <= ncols; i++) db.run(`ALTER TABLE "${info.prefixo}" ADD COLUMN "c${String(i).padStart(2, '0')}" TEXT`);
        extras[info.prefixo] = ncols;
      }
      avisos.push('Leiaute desconhecido: colunas genéricas c01..c' + String(ncols).padStart(2, '0'));
    }
    // Substitui carga anterior do mesmo arquivo
    const ja = arquivos.findIndex(a => a.nome === info.nome);
    if (ja >= 0) { db.run(`DELETE FROM "${info.prefixo}" WHERE _arquivo = ?`, [info.nome]); db.run(`DELETE FROM _arquivos WHERE nome = ?`, [info.nome]); arquivos.splice(ja, 1); avisos.push('Arquivo recarregado (carga anterior substituída)'); }

    const ncol = campos.length;
    const placeholders = new Array(ncol + META.length).fill('?').join(',');
    const stmt = db.prepare(`INSERT INTO "${info.prefixo}" VALUES (${placeholders})`);
    let mismatch = 0, linhas = 0;
    db.run('BEGIN');
    try {
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        if (r.length === 1 && r[0] === '') continue;
        if (r.length !== ncol) mismatch++;
        const vals = new Array(ncol);
        for (let c = 0; c < ncol; c++) {
          const raw = c < r.length ? r[c] : null;
          if (campos[c].t === 'num') { const x = raw === null || raw === '' ? null : Number(raw); vals[c] = Number.isFinite(x) ? x : null; }
          else vals[c] = raw;
        }
        vals.push(info.nome, info.competencia, i + 1, pacote || '');
        stmt.run(vals); linhas++;
      }
      db.run('COMMIT');
    } catch (e) { db.run('ROLLBACK'); stmt.free(); throw e; }
    stmt.free();
    if (mismatch) avisos.push(`${mismatch} linha(s) com número de colunas diferente do leiaute (${ncol})`);
    const reg = { nome: info.nome, prefixo: info.prefixo, competencia: info.competencia, extensao: info.extensao, linhas, pacote: pacote || '', avisos };
    arquivos.push(reg);
    db.run(`INSERT INTO _arquivos VALUES (?,?,?,?,?,?,?)`, [reg.nome, reg.prefixo, reg.competencia, reg.extensao, linhas, reg.pacote, avisos.join('; ')]);
    return reg;
  }

  /** Recalcula as tabelas derivadas (chamar após uma carga ou remoção). */
  function atualizarDerivadas() {
    db.run('DELETE FROM ne_unica');
    // Se o mesmo empenho for retransmitido, prevalece a competência mais recente (e a última linha do arquivo)
    db.run(`INSERT INTO ne_unica SELECT * FROM NE n WHERE NOT EXISTS (
              SELECT 1 FROM NE x WHERE x.orgao = n.orgao AND x.unidade = n.unidade AND x.numero_empenho = n.numero_empenho AND x.data_empenho = n.data_empenho
                AND (x._competencia > n._competencia OR (x._competencia = n._competencia AND x.rowid > n.rowid)))`);
  }

  function limpar() {
    for (const p of Object.keys(LAYOUTS)) db.run(`DELETE FROM "${p}"`);
    for (const p of Object.keys(extras)) db.run(`DELETE FROM "${p}"`);
    db.run('DELETE FROM _arquivos');
    db.run('DELETE FROM ne_unica');
    arquivos.length = 0;
  }

  /** Executa SQL e devolve {columns, values} do primeiro resultado (ou vazio). */
  function consultar(sql, params) {
    const res = db.exec(sql, params || undefined);
    if (!res.length) return { columns: [], values: [] };
    return res[res.length - 1];
  }

  function tabelas() {
    const t = {};
    for (const p of Object.keys(LAYOUTS)) t[p] = { nome: LAYOUTS[p].nome, tipo: 'tabela', colunas: LAYOUTS[p].campos.concat(META) };
    for (const p of Object.keys(extras)) { const cols = []; for (let i = 1; i <= extras[p]; i++) cols.push({ n: 'c' + String(i).padStart(2, '0'), t: 'txt', d: 'Campo genérico', c: 'chute' }); t[p] = { nome: 'Leiaute desconhecido', tipo: 'tabela', colunas: cols.concat(META) }; }
    const views = {
      v_liquidacoes: 'Liquidações × Empenho × Estornos (LQ + NE + EL)',
      v_empenhos: 'Posição consolidada por empenho (NE + AE + LQ + EL + NP)',
      v_pagamentos: 'Pagamentos × Empenho × Conta bancária (NP + NE + CP + EG)',
      v_ne: 'Empenhos sem duplicidade (NE, última competência)',
      v_estornos_liq: 'Estornos de liquidação agrupados (EL)',
    };
    for (const v of Object.keys(views)) {
      const cols = db.exec(`PRAGMA table_info("${v}")`);
      t[v] = { nome: views[v], tipo: 'visão', colunas: cols.length ? cols[0].values.map(r => ({ n: r[1], t: r[2] === 'REAL' ? 'num' : 'txt', d: '', c: 'certeza' })) : [] };
    }
    return t;
  }

  function contagem() {
    const out = {};
    for (const p of Object.keys(LAYOUTS).concat(Object.keys(extras))) {
      const r = db.exec(`SELECT COUNT(*) FROM "${p}"`); out[p] = r[0].values[0][0];
    }
    return out;
  }

  global.SIM_DB = { init, carregarArquivo, atualizarDerivadas, limpar, consultar, tabelas, contagem, arquivos, get db() { return db; } };
})(window);
