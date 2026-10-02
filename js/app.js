/* ==========================================================================
 * Aplicação: abas, carga de arquivos, navegação de tabelas, construtor de
 * consultas, editor SQL, relatórios e dicionário.
 * ========================================================================== */
(function (global) {
  'use strict';

  const DB = global.SIM_DB, P = global.SIM_PARSER, R = global.SIM_REPORTS, B = global.SIM_BUILDER, L = global.SIM_LAYOUTS;
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const esc = R.esc;
  const el = (tag, attrs, html) => { const e = document.createElement(tag); if (attrs) for (const k in attrs) { if (k === 'class') e.className = attrs[k]; else if (k.startsWith('on')) e.addEventListener(k.slice(2), attrs[k]); else e.setAttribute(k, attrs[k]); } if (html != null) e.innerHTML = html; return e; };

  const state = {
    tabelas: {}, contagem: {}, builder: B.novoEstado(), ultimo: null, relatorios: [], relSel: null, resultadoRel: null,
    config: { entidade: '' }, ordenacao: null,
  };

  /* ---------------------------------------------------------------- persistência */
  function lsGet(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* armazenamento indisponível */ } }

  /* ---------------------------------------------------------------- abas */
  function abrirAba(id) {
    $$('.abas button').forEach(b => b.setAttribute('aria-selected', b.dataset.aba === id ? 'true' : 'false'));
    $$('.painel').forEach(p => p.classList.toggle('ativo', p.id === 'painel-' + id));
    lsSet('sim_aba', id);
  }

  function status(msg, cls) { const s = $('#status'); s.textContent = msg; s.className = 'status' + (cls ? ' ' + cls : ''); }

  /* ---------------------------------------------------------------- carga de arquivos */
  async function carregarArquivos(files) {
    const lista = Array.from(files);
    if (!lista.length) return;
    const btn = $('#btn-arquivo'); btn.disabled = true;
    let total = 0, nArq = 0;
    const erros = [];
    for (const f of lista) {
      try {
        status(`Lendo ${f.name}…`);
        const lidos = await P.lerEntrada(f, (k, n, nome) => status(`Lendo ${f.name}: ${nome} (${k}/${n})`));
        if (!lidos.length) erros.push(`${f.name}: nenhum arquivo de remessa reconhecido (esperado AA999999.XXX)`);
        for (const item of lidos) {
          await new Promise(r => setTimeout(r, 0));
          const reg = DB.carregarArquivo(item); total += reg.linhas; nArq++;
          status(`Carregado ${reg.nome}: ${reg.linhas} registros`);
        }
      } catch (e) { erros.push(`${f.name}: ${e.message}`); }
    }
    btn.disabled = false;
    status('Atualizando cruzamentos…');
    await new Promise(r => setTimeout(r, 0));
    DB.atualizarDerivadas();
    atualizarCatalogo();
    renderArquivos(erros);
    status(`${nArq} arquivo(s) carregado(s), ${total.toLocaleString('pt-BR')} registros nesta carga. Total: ${DB.arquivos.length} arquivo(s).`, 'ok');
    if (nArq) abrirAba('tabelas');
  }

  function atualizarCatalogo() {
    state.tabelas = DB.tabelas();
    state.contagem = DB.contagem();
    renderTabelas();
    renderBuilder();
    renderRelatorios();
  }

  function periodo() {
    const comps = DB.arquivos.map(a => a.competencia).sort();
    if (!comps.length) return '-';
    const f = c => c.slice(4, 6) + '/' + c.slice(0, 4);
    return comps[0] === comps[comps.length - 1] ? f(comps[0]) : `${f(comps[0])} a ${f(comps[comps.length - 1])}`;
  }

  function renderArquivos(erros) {
    const box = $('#lista-arquivos'); box.innerHTML = '';
    const arqs = DB.arquivos.slice().sort((a, b) => (a.competencia + a.prefixo).localeCompare(b.competencia + b.prefixo));
    if (!arqs.length) box.innerHTML = '<p class="ajuda">Nenhum arquivo carregado.</p>';
    for (const a of arqs) {
      const it = el('div', { class: 'item' + (a.avisos.length ? ' com-aviso' : ''), title: a.avisos.join('\n') });
      it.innerHTML = `<span><b>${esc(a.nome)}</b><br><span class="ajuda">${esc((L.LAYOUTS[a.prefixo] || {}).nome || 'Leiaute desconhecido')}</span></span><span>${a.linhas.toLocaleString('pt-BR')}${a.avisos.length ? ' ⚠' : ''}</span>`;
      box.appendChild(it);
    }
    const e = $('#erros-arquivos'); e.hidden = !(erros && erros.length); e.textContent = (erros || []).join('\n');
    const comps = [...new Set(DB.arquivos.map(a => a.competencia))].sort();
    $('#resumo-carga').innerHTML = arqs.length ? `<b>${arqs.length}</b> arquivo(s) · <b>${comps.length}</b> competência(s): ${comps.map(c => c.slice(4) + '/' + c.slice(0, 4)).join(', ')} · <b>${arqs.reduce((s, a) => s + a.linhas, 0).toLocaleString('pt-BR')}</b> registros` : '';
  }

  /* ---------------------------------------------------------------- grade de resultados */
  function renderGrid(container, columns, values, opts) {
    opts = opts || {};
    const max = opts.max || 2000;
    const formatos = columns.map((c, i) => R.formatoColuna(c, values.slice(0, 200).map(r => r[i])));
    const numCols = formatos.map(f => f === 'moeda' || f === 'int');
    let h = `<div class="grid-scroll"><table class="grid"><thead><tr>`;
    columns.forEach((c, i) => h += `<th class="${numCols[i] ? 'num' : ''}" data-i="${i}">${esc(c)}${state.ordenacao && state.ordenacao.i === i ? (state.ordenacao.dir > 0 ? ' ▲' : ' ▼') : ''}</th>`);
    h += '</tr></thead><tbody>';
    const n = Math.min(values.length, max);
    for (let r = 0; r < n; r++) {
      h += '<tr>';
      for (let i = 0; i < columns.length; i++) h += `<td class="${numCols[i] ? 'num' : ''}" title="${esc(values[r][i])}">${esc(opts.bruto ? values[r][i] : R.formatar(values[r][i], formatos[i]))}</td>`;
      h += '</tr>';
    }
    h += '</tbody></table></div>';
    h += `<p class="ajuda">${values.length.toLocaleString('pt-BR')} linha(s)${values.length > max ? ` (exibindo as ${max} primeiras; exporte para ver todas)` : ''}, ${columns.length} coluna(s).</p>`;
    container.innerHTML = h;
    container.querySelectorAll('th').forEach(th => th.addEventListener('click', () => {
      const i = Number(th.dataset.i);
      const dir = state.ordenacao && state.ordenacao.i === i ? -state.ordenacao.dir : 1;
      state.ordenacao = { i, dir };
      values.sort((a, b) => { const x = a[i], y = b[i]; if (x == null) return 1; if (y == null) return -1; return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'pt-BR')) * dir; });
      renderGrid(container, columns, values, opts);
    }));
  }

  /* ---------------------------------------------------------------- tabelas */
  function renderTabelas() {
    const box = $('#tabelas-lista'); box.innerHTML = '';
    const nomes = Object.keys(state.tabelas).sort((a, b) => (state.tabelas[a].tipo + a).localeCompare(state.tabelas[b].tipo + b));
    for (const t of nomes) {
      const info = state.tabelas[t];
      const n = state.contagem[t];
      const b = el('button', { class: 'btn' + (n === 0 ? ' vazia' : ''), onclick: () => mostrarTabela(t) });
      b.innerHTML = `<span><span class="n">${esc(t)}</span> <span class="c">${esc(info.nome)}</span></span><span class="c">${info.tipo === 'visão' ? 'visão' : (n == null ? '' : n.toLocaleString('pt-BR'))}</span>`;
      box.appendChild(b);
    }
  }

  function mostrarTabela(t) {
    const info = state.tabelas[t];
    $('#tabela-titulo').textContent = `${t} - ${info.nome}`;
    $('#tabela-filtro').value = '';
    $('#tabela-filtro').dataset.tabela = t;
    const lay = L.LAYOUTS[t];
    $('#tabela-desc').textContent = lay ? (lay.descricao || '') + (lay.chave ? ` Chave sugerida: ${lay.chave.join(' + ')}.` : '') : '';
    let h = '<div class="tabela-wrap"><table class="grid"><thead><tr><th>#</th><th>Coluna</th><th>Tipo</th><th>Descrição</th><th>Confiança</th></tr></thead><tbody>';
    info.colunas.forEach((c, i) => h += `<tr><td>${i + 1}</td><td><code>${esc(c.n)}</code></td><td>${esc(c.t)}</td><td style="white-space:normal">${esc(c.d || '')}</td><td>${c.c ? `<span class="pill ${c.c}">${c.c}</span>` : ''}</td></tr>`);
    $('#tabela-colunas').innerHTML = h + '</tbody></table></div>';
    $('#tabela-detalhe').hidden = false;
    previewTabela();
  }

  function previewTabela() {
    const t = $('#tabela-filtro').dataset.tabela; if (!t) return;
    const f = $('#tabela-filtro').value.trim();
    const cols = state.tabelas[t].colunas.map(c => c.n);
    let sql = `SELECT * FROM "${t}"`;
    if (f) { const lit = "'%" + f.replace(/'/g, "''") + "%'"; sql += ' WHERE ' + cols.map(c => `CAST("${c}" AS TEXT) LIKE ${lit}`).join(' OR '); }
    sql += ' LIMIT 500';
    try { const res = DB.consultar(sql); state.ordenacao = null; renderGrid($('#tabela-preview'), res.columns, res.values, { max: 500 }); }
    catch (e) { $('#tabela-preview').innerHTML = `<div class="erro">${esc(e.message)}</div>`; }
    $('#btn-tabela-sql').onclick = () => { $('#sql').value = `SELECT * FROM "${t}"\nLIMIT 1000`; abrirAba('consulta'); executarSQL(); };
  }

  /* ---------------------------------------------------------------- construtor */
  function colunasDe(tab) { return (state.tabelas[tab] || { colunas: [] }).colunas; }

  function selectTabelas(valor, onchange) {
    const s = el('select', { onchange });
    const nomes = Object.keys(state.tabelas).sort((a, b) => (state.tabelas[a].tipo + a).localeCompare(state.tabelas[b].tipo + b));
    for (const t of nomes) { const o = el('option', { value: t }, `${esc(t)} - ${esc(state.tabelas[t].nome)}`); if (t === valor) o.selected = true; s.appendChild(o); }
    return s;
  }

  function aliasesDisponiveis() {
    const st = state.builder;
    return [{ alias: st.base, tabela: st.base }, ...st.joins.map((j, i) => ({ alias: B.alias(j.tabela, i + 1), tabela: j.tabela }))];
  }

  function selectColunas(aliasAtual, colAtual, onchange, comAsterisco) {
    const s = el('select', { onchange });
    if (comAsterisco) s.appendChild(el('option', { value: '*|*' }, '* (linhas)'));
    for (const a of aliasesDisponiveis()) {
      const g = el('optgroup', { label: a.alias });
      for (const c of colunasDe(a.tabela)) { const o = el('option', { value: a.alias + '|' + c.n }, esc(c.n)); if (a.alias === aliasAtual && c.n === colAtual) o.selected = true; g.appendChild(o); }
      s.appendChild(g);
    }
    return s;
  }

  function renderBuilder() {
    const st = state.builder;
    if (!state.tabelas[st.base]) st.base = Object.keys(state.tabelas)[0];
    const box = $('#builder'); box.innerHTML = '';

    // Base
    const base = el('div', { class: 'linha' });
    base.appendChild(el('label', null, 'Tabela base')).appendChild(selectTabelas(st.base, e => { st.base = e.target.value; st.colunas = []; st.filtros = []; st.aggs = []; st.ordem = []; st.joins = []; renderBuilder(); }));
    const dist = el('label', null, 'Somente linhas distintas'); const cb = el('input', { type: 'checkbox' }); cb.checked = st.distinct; cb.onchange = () => { st.distinct = cb.checked; }; dist.prepend(cb);
    base.appendChild(dist);
    box.appendChild(base);

    // Junções
    const jbox = el('details', { class: 'bloco', open: '' }); jbox.appendChild(el('summary', null, `Junções (${st.joins.length})`));
    st.joins.forEach((j, idx) => {
      const al = B.alias(j.tabela, idx + 1);
      const row = el('div', { class: 'join-linha' });
      const tipo = el('select', { onchange: e => { j.tipo = e.target.value; } });
      [['LEFT', 'LEFT JOIN (mantém todas as linhas da base)'], ['INNER', 'INNER JOIN (somente correspondências)']].forEach(([v, r]) => { const o = el('option', { value: v }, r); if (j.tipo === v) o.selected = true; tipo.appendChild(o); });
      row.appendChild(tipo);
      row.appendChild(selectTabelas(j.tabela, e => { j.tabela = e.target.value; j.chaves = B.sugerirChaves(colunasDe(st.base), colunasDe(j.tabela)).map(k => ({ a: k, b: k, aliasA: st.base })); renderBuilder(); }));
      row.appendChild(el('span', { class: 'ajuda' }, `como <b>${esc(al)}</b>, chaves:`));
      const chaves = el('div', { class: 'chaves' });
      const sugeridas = B.sugerirChaves(colunasDe(st.base), colunasDe(j.tabela));
      const todas = [...new Set([...sugeridas, ...(j.chaves || []).map(k => k.a)])];
      for (const k of todas) {
        const lab = el('label'); const c = el('input', { type: 'checkbox' }); c.checked = (j.chaves || []).some(x => x.a === k && x.b === k);
        c.onchange = () => { j.chaves = (j.chaves || []).filter(x => !(x.a === k && x.b === k)); if (c.checked) j.chaves.push({ a: k, b: k, aliasA: st.base }); };
        lab.appendChild(c); lab.appendChild(document.createTextNode(` ${k}`)); chaves.appendChild(lab);
      }
      if (!todas.length) chaves.appendChild(el('span', { class: 'ajuda' }, 'sem chaves em comum - edite o SQL gerado'));
      row.appendChild(chaves);
      row.appendChild(el('button', { class: 'btn mini perigo', onclick: () => { st.joins.splice(idx, 1); st.colunas = st.colunas.filter(c => c.alias !== al); renderBuilder(); } }, 'remover'));
      jbox.appendChild(row);
    });
    jbox.appendChild(el('button', { class: 'btn mini', onclick: () => { const t = st.base === 'LQ' ? 'NE' : 'LQ'; st.joins.push({ tabela: t, tipo: 'LEFT', chaves: B.sugerirChaves(colunasDe(st.base), colunasDe(t)).map(k => ({ a: k, b: k, aliasA: st.base })) }); renderBuilder(); } }, '+ adicionar junção'));
    box.appendChild(jbox);

    // Colunas
    const cbox = el('details', { class: 'bloco', open: '' }); cbox.appendChild(el('summary', null, `Colunas exibidas (${st.colunas.length}; nenhuma = todas da base)`));
    for (const a of aliasesDisponiveis()) {
      const d = el('details', { class: 'bloco' }); d.appendChild(el('summary', null, esc(a.alias)));
      const g = el('div', { class: 'colunas-check' });
      for (const c of colunasDe(a.tabela)) {
        const lab = el('label'); const chk = el('input', { type: 'checkbox' });
        chk.checked = st.colunas.some(x => x.alias === a.alias && x.col === c.n);
        chk.onchange = () => { if (chk.checked) st.colunas.push({ alias: a.alias, col: c.n }); else st.colunas = st.colunas.filter(x => !(x.alias === a.alias && x.col === c.n)); cbox.querySelector('summary').textContent = `Colunas exibidas (${st.colunas.length}; nenhuma = todas da base)`; };
        lab.appendChild(chk); lab.appendChild(document.createTextNode(' ' + c.n + ' ')); lab.appendChild(el('span', { class: 't' }, esc(c.t))); g.appendChild(lab);
      }
      d.appendChild(g); cbox.appendChild(d);
    }
    box.appendChild(cbox);

    // Filtros
    const fbox = el('details', { class: 'bloco', open: '' }); fbox.appendChild(el('summary', null, `Filtros (${st.filtros.length})`));
    st.filtros.forEach((f, idx) => {
      const row = el('div', { class: 'filtro-linha' });
      row.appendChild(selectColunas(f.alias, f.col, e => { const [a, c] = e.target.value.split('|'); f.alias = a; f.col = c; }));
      const op = el('select', { onchange: e => { f.op = e.target.value; } });
      B.OPS.forEach(o => { const x = el('option', { value: o.v }, esc(o.r)); if (f.op === o.v) x.selected = true; op.appendChild(x); });
      row.appendChild(op);
      row.appendChild(el('input', { type: 'text', value: f.val || '', placeholder: 'valor', oninput: e => { f.val = e.target.value; } }));
      row.appendChild(el('button', { class: 'btn mini perigo', onclick: () => { st.filtros.splice(idx, 1); renderBuilder(); } }, 'remover'));
      fbox.appendChild(row);
    });
    fbox.appendChild(el('button', { class: 'btn mini', onclick: () => { const c = colunasDe(st.base)[0]; st.filtros.push({ alias: st.base, col: c ? c.n : '', op: '=', val: '' }); renderBuilder(); } }, '+ adicionar filtro'));
    box.appendChild(fbox);

    // Agregações
    const abox = el('details', { class: 'bloco', open: st.aggs.length ? '' : null }); abox.appendChild(el('summary', null, `Totalizações (${st.aggs.length}) - ao usar, as colunas exibidas viram agrupamento`));
    st.aggs.forEach((a, idx) => {
      const row = el('div', { class: 'agg-linha' });
      const fn = el('select', { onchange: e => { a.fn = e.target.value; } });
      B.AGG.forEach(x => { const o = el('option', { value: x }, x); if (a.fn === x) o.selected = true; fn.appendChild(o); });
      row.appendChild(fn);
      row.appendChild(selectColunas(a.alias, a.col, e => { const [al, c] = e.target.value.split('|'); a.alias = al; a.col = c; }, true));
      row.appendChild(el('input', { type: 'text', value: a.rotulo || '', placeholder: 'nome da coluna (opcional)', oninput: e => { a.rotulo = e.target.value; } }));
      row.appendChild(el('button', { class: 'btn mini perigo', onclick: () => { st.aggs.splice(idx, 1); renderBuilder(); } }, 'remover'));
      abox.appendChild(row);
    });
    abox.appendChild(el('button', { class: 'btn mini', onclick: () => { const c = colunasDe(st.base).find(x => x.t === 'num'); st.aggs.push({ fn: 'SUM', alias: st.base, col: c ? c.n : '*' }); renderBuilder(); } }, '+ adicionar totalização'));
    box.appendChild(abox);

    // Ordenação e limite
    const obox = el('div', { class: 'linha' });
    st.ordem.forEach((o, idx) => {
      const row = el('div', { class: 'ordem-linha' });
      row.appendChild(el('span', null, 'Ordenar por'));
      row.appendChild(el('input', { type: 'text', value: o.col, placeholder: 'coluna ou nº', oninput: e => { o.col = e.target.value; } }));
      const dir = el('select', { onchange: e => { o.dir = e.target.value; } });
      [['ASC', 'crescente'], ['DESC', 'decrescente']].forEach(([v, r]) => { const x = el('option', { value: v }, r); if (o.dir === v) x.selected = true; dir.appendChild(x); });
      row.appendChild(dir);
      row.appendChild(el('button', { class: 'btn mini perigo', onclick: () => { st.ordem.splice(idx, 1); renderBuilder(); } }, 'remover'));
      obox.appendChild(row);
    });
    obox.appendChild(el('button', { class: 'btn mini', onclick: () => { st.ordem.push({ col: '1', dir: 'ASC' }); renderBuilder(); } }, '+ ordenação'));
    const lim = el('label', null, 'Limite de linhas'); lim.appendChild(el('input', { type: 'number', value: st.limite, min: 0, style: 'width:100px', oninput: e => { st.limite = Number(e.target.value); } }));
    obox.appendChild(lim);
    box.appendChild(obox);

    const acoes = el('div', { class: 'linha' });
    acoes.appendChild(el('button', { class: 'btn primario', onclick: () => { $('#sql').value = B.montarSQL(st, state.tabelas); executarSQL(); } }, 'Gerar SQL e executar'));
    acoes.appendChild(el('button', { class: 'btn', onclick: () => { $('#sql').value = B.montarSQL(st, state.tabelas); } }, 'Só gerar o SQL'));
    acoes.appendChild(el('button', { class: 'btn', onclick: () => { state.builder = B.novoEstado(); renderBuilder(); } }, 'Limpar'));
    box.appendChild(acoes);
  }

  /* ---------------------------------------------------------------- SQL */
  function executarSQL() {
    const sql = $('#sql').value.trim();
    if (!sql) return;
    const t0 = performance.now();
    try {
      const res = DB.consultar(sql);
      state.ultimo = { sql, columns: res.columns, values: res.values };
      state.ordenacao = null;
      $('#sql-erro').hidden = true;
      renderGrid($('#resultado'), res.columns, res.values, { max: 2000 });
      status(`Consulta executada: ${res.values.length.toLocaleString('pt-BR')} linha(s) em ${Math.round(performance.now() - t0)} ms`, 'ok');
      lsSet('sim_sql', sql);
    } catch (e) {
      $('#sql-erro').hidden = false; $('#sql-erro').textContent = e.message;
      status('Erro na consulta', 'erro');
    }
  }

  function copiarTexto(texto, btn) {
    const ok = () => { const t = btn.textContent; btn.textContent = 'Copiado!'; setTimeout(() => { btn.textContent = t; }, 1500); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texto).then(ok).catch(() => fallbackCopiar(texto, ok));
    else fallbackCopiar(texto, ok);
  }
  function fallbackCopiar(texto, ok) {
    const ta = el('textarea'); ta.value = texto; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); ok(); } catch (e) { /* sem suporte */ } document.body.removeChild(ta);
  }

  /* ---------------------------------------------------------------- relatórios */
  function todosRelatorios() { return [...R.PRESETS.map(p => Object.assign({ preset: true }, p)), ...state.relatorios]; }

  function renderRelatorios() {
    const box = $('#rel-lista'); box.innerHTML = '';
    for (const r of todosRelatorios()) {
      const it = el('div', { class: 'item' + (state.relSel === r.id ? ' selecionado' : '') });
      it.innerHTML = `<b>${esc(r.nome)}</b><span class="d">${esc(r.descricao || r.subtitulo || '')}</span><span class="d">${r.preset ? 'Modelo incluído' : 'Relatório personalizado'} · ${r.secoes.length} seção(ões)</span>`;
      const acoes = el('div', { class: 'linha' });
      acoes.appendChild(el('button', { class: 'btn mini primario', onclick: () => selecionarRelatorio(r.id) }, 'Abrir'));
      acoes.appendChild(el('button', { class: 'btn mini', onclick: () => duplicarRelatorio(r) }, 'Duplicar'));
      if (!r.preset) acoes.appendChild(el('button', { class: 'btn mini perigo', onclick: () => { if (it.dataset.confirma) { state.relatorios = state.relatorios.filter(x => x.id !== r.id); salvarRelatorios(); if (state.relSel === r.id) state.relSel = null; renderRelatorios(); } else { it.dataset.confirma = '1'; acoes.lastChild.textContent = 'Confirmar exclusão'; } } }, 'Excluir'));
      it.appendChild(acoes); box.appendChild(it);
    }
    renderRelSel();
  }

  function salvarRelatorios() { lsSet('sim_relatorios', state.relatorios); }

  function duplicarRelatorio(r) {
    const c = JSON.parse(JSON.stringify(r)); delete c.preset;
    c.id = 'rel_' + Date.now(); c.nome = r.nome + ' (cópia)';
    state.relatorios.push(c); salvarRelatorios(); state.relSel = c.id; renderRelatorios();
  }

  function relAtual() { return todosRelatorios().find(r => r.id === state.relSel); }

  function selecionarRelatorio(id) { state.relSel = id; state.resultadoRel = null; $('#folha').innerHTML = ''; renderRelatorios(); $('#rel-editor-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  function renderRelSel() {
    const r = relAtual();
    const wrap = $('#rel-editor-wrap'); wrap.hidden = !r;
    if (!r) return;
    $('#rel-sel-nome').textContent = r.nome;
    // parâmetros
    const pbox = $('#rel-params'); pbox.innerHTML = '';
    const salvos = lsGet('sim_params_' + r.id, {});
    for (const p of (r.params || [])) {
      const lab = el('label', null, `${esc(p.rotulo)}${p.ajuda ? ` <span class="ajuda">(${esc(p.ajuda)})</span>` : ''}`);
      lab.appendChild(el('input', { type: 'text', id: 'param-' + p.nome, value: salvos[p.nome] != null ? salvos[p.nome] : (p.padrao || '') }));
      pbox.appendChild(lab);
    }
    if (!(r.params || []).length) pbox.innerHTML = '<span class="ajuda">Este relatório não tem parâmetros.</span>';
    // editor (somente personalizados)
    const ed = $('#rel-editor'); ed.hidden = !!r.preset;
    $('#rel-preset-aviso').hidden = !r.preset;
    if (!r.preset) renderEditorRelatorio(r);
  }

  function lerParams(r) {
    const p = {};
    for (const x of (r.params || [])) { const i = $('#param-' + x.nome); p[x.nome] = i ? i.value : x.padrao; }
    lsSet('sim_params_' + r.id, p);
    return p;
  }

  function gerarRelatorio() {
    const r = relAtual(); if (!r) return;
    const params = lerParams(r);
    const t0 = performance.now();
    const res = R.executar(r, params, sql => DB.consultar(sql));
    state.resultadoRel = res;
    state.config.entidade = $('#entidade').value; lsSet('sim_config', state.config);
    $('#folha').innerHTML = R.renderRelatorio(res, { entidade: state.config.entidade, periodo: periodo() });
    $('#rel-erros').hidden = !res.erros.length; $('#rel-erros').textContent = res.erros.join('\n');
    $('#rel-acoes').hidden = false;
    status(`Relatório gerado em ${Math.round(performance.now() - t0)} ms`, 'ok');
    $('#folha').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderEditorRelatorio(r) {
    const ed = $('#rel-editor'); ed.innerHTML = '';
    const campo = (rot, val, oninput, tipo) => { const lab = el('label', null, rot); const i = el(tipo === 'area' ? 'textarea' : 'input', { type: 'text', value: val || '', oninput }); if (tipo === 'area') { i.value = val || ''; i.className = 'sql'; i.style.minHeight = '60px'; } lab.appendChild(i); return lab; };
    const cab = el('div', { class: 'linha' });
    cab.appendChild(campo('Nome (na lista)', r.nome, e => { r.nome = e.target.value; }));
    cab.appendChild(campo('Título impresso', r.titulo, e => { r.titulo = e.target.value; }));
    cab.appendChild(campo('Subtítulo', r.subtitulo, e => { r.subtitulo = e.target.value; }));
    cab.appendChild(campo('Rodapé', r.rodape, e => { r.rodape = e.target.value; }));
    ed.appendChild(cab);
    ed.appendChild(campo('Descrição / metodologia (impressa abaixo do cabeçalho)', r.descricao, e => { r.descricao = e.target.value; }, 'area'));
    // parâmetros
    const pb = el('div'); pb.appendChild(el('h3', null, 'Parâmetros (use {{nome}} no SQL)'));
    (r.params || []).forEach((p, i) => {
      const row = el('div', { class: 'linha' });
      row.appendChild(campo('nome', p.nome, e => { p.nome = e.target.value; }));
      row.appendChild(campo('rótulo', p.rotulo, e => { p.rotulo = e.target.value; }));
      row.appendChild(campo('padrão', p.padrao, e => { p.padrao = e.target.value; }));
      row.appendChild(el('button', { class: 'btn mini perigo', onclick: () => { r.params.splice(i, 1); renderEditorRelatorio(r); } }, 'remover'));
      pb.appendChild(row);
    });
    pb.appendChild(el('button', { class: 'btn mini', onclick: () => { r.params = r.params || []; r.params.push({ nome: 'param' + (r.params.length + 1), rotulo: 'Parâmetro', padrao: '' }); renderEditorRelatorio(r); renderRelSel(); } }, '+ parâmetro'));
    ed.appendChild(pb);
    // seções
    const sb = el('div'); sb.appendChild(el('h3', null, 'Seções'));
    r.secoes.forEach((s, i) => {
      const box = el('div', { class: 'secao-editor' });
      const l1 = el('div', { class: 'linha' });
      l1.appendChild(el('b', null, `Seção ${i + 1}`));
      l1.appendChild(campo('Título', s.titulo, e => { s.titulo = e.target.value; }));
      const tipo = el('label', null, 'Tipo'); const ts = el('select', { onchange: e => { s.tipo = e.target.value; if (s.tipo === 'pivot' && !s.pivot) s.pivot = { linha: '', coluna: '', valor: '' }; renderEditorRelatorio(r); } });
      [['tabela', 'tabela'], ['pivot', 'tabela cruzada (pivot)']].forEach(([v, rr]) => { const o = el('option', { value: v }, rr); if ((s.tipo || 'tabela') === v) o.selected = true; ts.appendChild(o); }); tipo.appendChild(ts); l1.appendChild(tipo);
      if ((s.tipo || 'tabela') === 'tabela') {
        l1.appendChild(campo('Agrupar/subtotal pela coluna', s.agrupar, e => { s.agrupar = e.target.value || undefined; }));
        const tot = el('label', null, 'Linha de total'); const c = el('input', { type: 'checkbox' }); c.checked = !!s.totalizar; c.onchange = () => { s.totalizar = c.checked; }; tot.prepend(c); l1.appendChild(tot);
        l1.appendChild(campo('Destacar linhas quando coluna=valor (ex.: situacao=Estorno)', s.destaque ? `${s.destaque.coluna}=${s.destaque.valor}` : '', e => { const m = /^([^=]+)=(.*)$/.exec(e.target.value); s.destaque = m ? { coluna: m[1].trim(), valor: m[2].trim() } : undefined; }));
      } else {
        l1.appendChild(campo('Coluna das linhas', s.pivot.linha, e => { s.pivot.linha = e.target.value; }));
        l1.appendChild(campo('Coluna das colunas', s.pivot.coluna, e => { s.pivot.coluna = e.target.value; }));
        l1.appendChild(campo('Coluna do valor', s.pivot.valor, e => { s.pivot.valor = e.target.value; }));
      }
      l1.appendChild(el('button', { class: 'btn mini', onclick: () => { if (i > 0) { r.secoes.splice(i - 1, 0, r.secoes.splice(i, 1)[0]); renderEditorRelatorio(r); } } }, '▲'));
      l1.appendChild(el('button', { class: 'btn mini', onclick: () => { if (i < r.secoes.length - 1) { r.secoes.splice(i + 1, 0, r.secoes.splice(i, 1)[0]); renderEditorRelatorio(r); } } }, '▼'));
      l1.appendChild(el('button', { class: 'btn mini perigo', onclick: () => { r.secoes.splice(i, 1); renderEditorRelatorio(r); } }, 'remover'));
      box.appendChild(l1);
      box.appendChild(campo('SQL', s.sql, e => { s.sql = e.target.value; }, 'area'));
      const l2 = el('div', { class: 'linha' });
      l2.appendChild(campo('Rótulos das colunas (coluna=Rótulo; separados por ;)', Object.entries(s.rotulos || {}).map(([k, v]) => k + '=' + v).join('; '), e => { s.rotulos = {}; e.target.value.split(';').forEach(p => { const m = /^([^=]+)=(.*)$/.exec(p.trim()); if (m) s.rotulos[m[1].trim()] = m[2].trim(); }); }));
      l2.appendChild(campo('Formatos (coluna=moeda|int|data|comp|texto; separados por ;)', Object.entries(s.formatos || {}).map(([k, v]) => k + '=' + v).join('; '), e => { s.formatos = {}; e.target.value.split(';').forEach(p => { const m = /^([^=]+)=(.*)$/.exec(p.trim()); if (m) s.formatos[m[1].trim()] = m[2].trim(); }); }));
      l2.appendChild(campo('Nota (impressa abaixo da tabela)', s.nota, e => { s.nota = e.target.value; }));
      box.appendChild(l2);
      sb.appendChild(box);
    });
    sb.appendChild(el('button', { class: 'btn mini', onclick: () => { r.secoes.push({ titulo: 'Nova seção', sql: state.ultimo ? state.ultimo.sql : 'SELECT * FROM v_liquidacoes LIMIT 100', tipo: 'tabela', totalizar: true }); renderEditorRelatorio(r); } }, '+ seção (usa o último SQL executado)'));
    ed.appendChild(sb);
    const ac = el('div', { class: 'linha' });
    ac.appendChild(el('button', { class: 'btn primario', onclick: () => { salvarRelatorios(); renderRelatorios(); status('Relatório salvo neste navegador', 'ok'); } }, 'Salvar relatório'));
    ed.appendChild(ac);
  }

  function salvarConsultaComoSecao() {
    if (!state.ultimo) { status('Execute uma consulta antes', 'erro'); return; }
    const nome = $('#secao-nome').value.trim() || 'Consulta';
    let r = state.relatorios.find(x => x.id === $('#secao-destino').value);
    if (!r) { r = { id: 'rel_' + Date.now(), nome: 'Relatório personalizado', titulo: 'Relatório Personalizado', subtitulo: '', params: [], secoes: [], rodape: 'Fonte: remessas ao SIM/TCE-CE.' }; state.relatorios.push(r); }
    r.secoes.push({ titulo: nome, sql: state.ultimo.sql, tipo: 'tabela', totalizar: true });
    salvarRelatorios(); state.relSel = r.id; renderRelatorios(); abrirAba('relatorios');
    status(`Seção "${nome}" adicionada ao relatório "${r.nome}"`, 'ok');
  }

  function renderDestinos() {
    const s = $('#secao-destino'); s.innerHTML = '<option value="">Novo relatório personalizado</option>';
    for (const r of state.relatorios) s.appendChild(el('option', { value: r.id }, esc(r.nome)));
  }

  function exportarDefinicoes() {
    R.baixar('relatorios_sim.json', JSON.stringify(state.relatorios, null, 2), 'application/json');
  }
  function importarDefinicoes(file) {
    file.text().then(t => {
      const arr = JSON.parse(t);
      const lista = Array.isArray(arr) ? arr : [arr];
      let n = 0;
      for (const r of lista) { if (!r || !r.secoes) continue; r.id = r.id && !todosRelatorios().some(x => x.id === r.id) ? r.id : 'rel_' + Date.now() + '_' + n; delete r.preset; state.relatorios.push(r); n++; }
      salvarRelatorios(); renderRelatorios(); renderDestinos(); status(`${n} relatório(s) importado(s)`, 'ok');
    }).catch(e => status('Falha ao importar: ' + e.message, 'erro'));
  }

  /* ---------------------------------------------------------------- dicionário */
  function renderDicionario() {
    const box = $('#dicionario'); let h = '';
    const grupos = {};
    for (const p of Object.keys(L.LAYOUTS)) { const g = L.LAYOUTS[p].grupo; (grupos[g] = grupos[g] || []).push(p); }
    const cont = { certeza: 0, provavel: 0, chute: 0 };
    for (const p of Object.keys(L.LAYOUTS)) for (const c of L.LAYOUTS[p].campos) cont[c.c || 'provavel']++;
    h += `<p class="ajuda">Campos catalogados: <span class="pill certeza">certeza ${cont.certeza}</span> <span class="pill provavel">provável ${cont.provavel}</span> <span class="pill chute">chute ${cont.chute}</span>. Os nomes foram inferidos a partir dos dados; confira os marcados como "chute" no Manual do SIM antes de usá-los em relatórios oficiais.</p>`;
    for (const g of Object.keys(grupos).sort()) {
      h += `<details class="bloco"><summary>Grupo .${g} (${grupos[g].length} arquivos)</summary>`;
      for (const p of grupos[g].sort()) {
        const lay = L.LAYOUTS[p];
        h += `<details class="bloco"><summary><code>${p}</code> ${esc(lay.nome)} <span class="pill ${lay.confianca}">${lay.confianca}</span> <span class="ajuda">registro ${lay.registro}, ${lay.campos.length} campos</span></summary>`;
        if (lay.descricao) h += `<p class="ajuda">${esc(lay.descricao)}</p>`;
        h += '<div class="tabela-wrap"><table class="grid"><thead><tr><th>#</th><th>Coluna</th><th>Tipo</th><th>Descrição</th><th>Confiança</th></tr></thead><tbody>';
        lay.campos.forEach((c, i) => h += `<tr><td>${i + 1}</td><td><code>${esc(c.n)}</code></td><td>${esc(c.t)}</td><td style="white-space:normal">${esc(c.d || '')}</td><td><span class="pill ${c.c}">${c.c}</span></td></tr>`);
        h += '</tbody></table></div></details>';
      }
      h += '</details>';
    }
    box.innerHTML = h;
  }

  /* ---------------------------------------------------------------- inicialização */
  async function iniciar() {
    status('Iniciando banco de dados…');
    try { await DB.init(); } catch (e) { status('Falha ao iniciar o SQLite: ' + e.message, 'erro'); $('#erro-fatal').hidden = false; $('#erro-fatal').textContent = e.message; return; }
    state.relatorios = lsGet('sim_relatorios', []);
    state.config = Object.assign({ entidade: '' }, lsGet('sim_config', {}));
    $('#entidade').value = state.config.entidade;
    $('#sql').value = lsGet('sim_sql', 'SELECT * FROM v_liquidacoes\nLIMIT 200');
    atualizarCatalogo(); renderArquivos([]); renderDicionario(); renderDestinos();

    $$('.abas button').forEach(b => b.addEventListener('click', () => abrirAba(b.dataset.aba)));
    abrirAba(lsGet('sim_aba', 'arquivos'));

    const inp = $('#input-arquivos');
    $('#btn-arquivo').addEventListener('click', () => inp.click());
    $('#zona').addEventListener('click', () => inp.click());
    inp.addEventListener('change', () => { carregarArquivos(inp.files); inp.value = ''; });
    const zona = $('#zona');
    ['dragenter', 'dragover'].forEach(ev => zona.addEventListener(ev, e => { e.preventDefault(); zona.classList.add('arrasto'); }));
    ['dragleave', 'drop'].forEach(ev => zona.addEventListener(ev, e => { e.preventDefault(); zona.classList.remove('arrasto'); }));
    zona.addEventListener('drop', e => carregarArquivos(e.dataTransfer.files));
    $('#btn-limpar').addEventListener('click', () => { if ($('#btn-limpar').dataset.c) { DB.limpar(); atualizarCatalogo(); renderArquivos([]); $('#btn-limpar').dataset.c = ''; $('#btn-limpar').textContent = 'Remover todos os arquivos'; status('Dados removidos'); } else { $('#btn-limpar').dataset.c = '1'; $('#btn-limpar').textContent = 'Clique de novo para confirmar'; } });

    $('#tabela-filtro').addEventListener('input', previewTabela);
    $('#btn-executar').addEventListener('click', executarSQL);
    $('#sql').addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); executarSQL(); } });
    $('#btn-csv').addEventListener('click', () => { if (state.ultimo) R.baixar('consulta.csv', R.resultadoParaCSV(state.ultimo.columns, state.ultimo.values), 'text/csv;charset=utf-8'); });
    $('#btn-xlsx').addEventListener('click', () => { if (state.ultimo) R.exportarResultadoXLSX(state.ultimo.columns, state.ultimo.values, 'consulta.xlsx'); });
    $('#btn-copiar').addEventListener('click', e => { if (state.ultimo) copiarTexto(R.resultadoParaTSV(state.ultimo.columns, state.ultimo.values), e.target); });
    $('#btn-secao').addEventListener('click', salvarConsultaComoSecao);
    $('#btn-gerar').addEventListener('click', gerarRelatorio);
    $('#btn-imprimir').addEventListener('click', () => window.print());
    $('#btn-rel-xlsx').addEventListener('click', () => { if (state.resultadoRel) R.exportarXLSX(state.resultadoRel, (relAtual().nome || 'relatorio').replace(/[^\w\-]+/g, '_') + '.xlsx'); });
    $('#btn-rel-copiar').addEventListener('click', e => { if (!state.resultadoRel) return; const partes = state.resultadoRel.secoes.filter(s => !s.erro).map(s => s.def.titulo + '\n' + R.resultadoParaTSV(s.rotulos, s.values)); copiarTexto(partes.join('\n\n'), e.target); });
    $('#btn-rel-html').addEventListener('click', () => { if (!state.resultadoRel) return; const css = Array.from(document.styleSheets).map(ss => { try { return Array.from(ss.cssRules).map(r => r.cssText).join('\n'); } catch (e) { return ''; } }).join('\n'); const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(relAtual().titulo)}</title><style>${css}\nbody{background:#fff}.folha{border:0}</style></head><body><main><div id="painel-relatorios" class="painel ativo"><div class="cartao folha-wrap folha">${$('#folha').innerHTML}</div></div></main></body></html>`; R.baixar((relAtual().nome || 'relatorio').replace(/[^\w\-]+/g, '_') + '.html', html, 'text/html;charset=utf-8'); });
    $('#btn-exportar-defs').addEventListener('click', exportarDefinicoes);
    $('#input-defs').addEventListener('change', e => { if (e.target.files[0]) importarDefinicoes(e.target.files[0]); e.target.value = ''; });
    $('#btn-novo-rel').addEventListener('click', () => { const r = { id: 'rel_' + Date.now(), nome: 'Novo relatório', titulo: 'Novo Relatório', subtitulo: '', params: [], secoes: [{ titulo: 'Seção 1', sql: 'SELECT elemento_despesa, fonte, SUM(valor_liquido) AS valor\nFROM v_liquidacoes\nWHERE sem_empenho = 0\nGROUP BY 1, 2\nORDER BY 1, 2', tipo: 'tabela', agrupar: 'elemento_despesa', totalizar: true }], rodape: 'Fonte: remessas ao SIM/TCE-CE.' }; state.relatorios.push(r); salvarRelatorios(); state.relSel = r.id; renderRelatorios(); renderDestinos(); });
    $('#entidade').addEventListener('input', e => { state.config.entidade = e.target.value; lsSet('sim_config', state.config); });

    const art = !!(global.claude) || /claude\.(ai|site)|claudeusercontent/.test(location.host);
    if (art) $('#aviso-artefato').hidden = false;
    status('Pronto. Carregue os pacotes ZIP das remessas.');
  }

  document.addEventListener('DOMContentLoaded', iniciar);
  global.SIM_APP = { state, executarSQL, carregarArquivos, gerarRelatorio, abrirAba };
})(window);
