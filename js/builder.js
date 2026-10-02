/* ==========================================================================
 * Construtor visual de consultas: gera SQL a partir de base, junções,
 * colunas, filtros, agregações e ordenação.
 * ========================================================================== */
(function (global) {
  'use strict';

  const { JOIN_KEYS } = global.SIM_LAYOUTS;
  const OPS = [
    { v: '=', r: 'igual a' }, { v: '<>', r: 'diferente de' }, { v: '>', r: 'maior que' }, { v: '>=', r: 'maior ou igual' },
    { v: '<', r: 'menor que' }, { v: '<=', r: 'menor ou igual' }, { v: 'contem', r: 'contém' }, { v: 'comeca', r: 'começa com' },
    { v: 'in', r: 'em lista (a, b, c)' }, { v: 'nulo', r: 'é vazio/nulo' }, { v: 'naonulo', r: 'não é vazio' },
  ];
  const AGG = ['SUM', 'COUNT', 'AVG', 'MIN', 'MAX'];

  function novoEstado() {
    return { base: 'v_liquidacoes', joins: [], colunas: [], filtros: [], aggs: [], ordem: [], limite: 1000, distinct: false };
  }

  /** Sugere pares de chaves comuns entre duas tabelas */
  function sugerirChaves(colsA, colsB) {
    const a = new Set(colsA.map(c => c.n)), b = new Set(colsB.map(c => c.n));
    return JOIN_KEYS.filter(k => a.has(k) && b.has(k) && k !== '_competencia');
  }

  function q(id) { return `"${id}"`; }

  function alias(tabela, idx) { return idx === 0 ? tabela : `${tabela}_${idx}`; }

  function litValor(v, tipo) {
    const s = String(v == null ? '' : v).trim();
    if (tipo === 'num' && s !== '' && !isNaN(Number(s.replace(',', '.')))) return s.replace(',', '.');
    return "'" + s.replace(/'/g, "''") + "'";
  }

  /** Gera o SQL a partir do estado. tabelas = catálogo {nome: {colunas}} */
  function montarSQL(st, tabelas) {
    const tipoCol = (tab, col) => { const t = tabelas[tab]; const c = t && t.colunas.find(x => x.n === col); return c ? c.t : 'txt'; };
    const aliases = [st.base, ...st.joins.map((j, i) => alias(j.tabela, i + 1))];
    const tabDe = al => al === st.base ? st.base : st.joins[aliases.indexOf(al) - 1].tabela;
    const sel = [];
    const plain = st.colunas.map(c => `${q(c.alias)}.${q(c.col)}`);
    for (const c of st.colunas) sel.push(`${q(c.alias)}.${q(c.col)}${c.rotulo ? ' AS ' + q(c.rotulo) : (aliases.length > 1 ? ' AS ' + q(c.alias === st.base ? c.col : c.alias + '_' + c.col) : '')}`);
    for (const a of st.aggs) sel.push(`${a.fn}(${a.col === '*' ? '*' : q(a.alias) + '.' + q(a.col)}) AS ${q(a.rotulo || (a.fn.toLowerCase() + '_' + (a.col === '*' ? 'linhas' : a.col)))}`);
    if (!sel.length) sel.push(`${q(st.base)}.*`);
    let sql = `SELECT ${st.distinct ? 'DISTINCT ' : ''}${sel.join(',\n       ')}\nFROM ${q(st.base)}`;
    st.joins.forEach((j, i) => {
      const al = alias(j.tabela, i + 1);
      const on = (j.chaves || []).map(k => `${q(al)}.${q(k.b)} = ${q(k.aliasA || st.base)}.${q(k.a)}`);
      sql += `\n${j.tipo || 'LEFT'} JOIN ${q(j.tabela)}${al !== j.tabela ? ' AS ' + q(al) : ''} ON ${on.length ? on.join(' AND ') : '1 = 1 /* defina as chaves */'}`;
    });
    const where = [];
    for (const f of st.filtros) {
      if (!f.col) continue;
      const ref = `${q(f.alias)}.${q(f.col)}`;
      const tipo = tipoCol(tabDe(f.alias), f.col);
      switch (f.op) {
        case 'contem': where.push(`${ref} LIKE ${litValor('%' + f.val + '%')}`); break;
        case 'comeca': where.push(`${ref} LIKE ${litValor(f.val + '%')}`); break;
        case 'in': where.push(`${ref} IN (${String(f.val).split(',').map(x => litValor(x.trim(), tipo)).join(', ')})`); break;
        case 'nulo': where.push(`(${ref} IS NULL OR ${ref} = '')`); break;
        case 'naonulo': where.push(`(${ref} IS NOT NULL AND ${ref} <> '')`); break;
        default: where.push(`${ref} ${f.op} ${litValor(f.val, tipo)}`);
      }
    }
    if (where.length) sql += `\nWHERE ${where.join('\n  AND ')}`;
    if (st.aggs.length && plain.length) sql += `\nGROUP BY ${plain.join(', ')}`;
    if (st.ordem.length) sql += `\nORDER BY ${st.ordem.map(o => `${/^\d+$/.test(o.col) ? o.col : q(o.col)} ${o.dir || 'ASC'}`).join(', ')}`;
    if (st.limite) sql += `\nLIMIT ${Number(st.limite)}`;
    return sql;
  }

  global.SIM_BUILDER = { novoEstado, sugerirChaves, montarSQL, OPS, AGG, alias };
})(window);
