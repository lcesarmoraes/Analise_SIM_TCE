# Análise SIM TCE-CE

Aplicativo para **cruzar os arquivos de remessa mensal ao SIM (Sistema de Informações Municipais do TCE-CE)** e **montar relatórios customizados**, como o Demonstrativo Analítico das Liquidações do FUNDEB.

Roda inteiramente no navegador (sem servidor, sem instalação): os pacotes ZIP das competências são lidos localmente, carregados em um banco SQLite em memória (sql.js) e consultados por um construtor visual ou por SQL. Nada sai do computador.

## Versão portátil (um único arquivo, para levar a qualquer computador)

`dist/AnaliseSIMTCE.html` é a aplicação inteira — HTML, CSS, JS e as três bibliotecas (sql.js, JSZip, SheetJS) — embutida em **um único arquivo `.html`**, sem nenhuma referência externa. Copie esse arquivo para um pendrive, anexe num e-mail ou salve na nuvem; em qualquer computador com Chrome, Edge ou Firefox basta dar duplo clique para abrir, sem internet e sem instalar nada. Nessa versão (aberta como arquivo local, fora do site do Claude) **impressão/PDF, Excel e Word funcionam normalmente** - só a página publicada como artefato do Claude bloqueia isso (é uma restrição do visualizador do claude.ai, não do aplicativo).

Para gerar o arquivo de novo depois de alterar o código-fonte (`index.html`, `css/`, `js/`):

```
node tools/build-standalone.js
```

Isso regrava `dist/AnaliseSIMTCE.html` a partir dos arquivos-fonte. Use o código-fonte (`index.html` + `css/` + `js/`) para desenvolver; use `dist/AnaliseSIMTCE.html` para usar ou distribuir.

## Como usar

1. Baixe/clone este repositório e abra `index.html` em um navegador moderno (Chrome, Edge ou Firefox).
2. Aba **1. Arquivos**: arraste os ZIPs mensais (`145202301PAAAA.zip` … `145202312PAAAA.zip`) ou arquivos avulsos (`LQ202312.DCD`, `NE202312.DCD` …). Carregue **todas as competências do exercício**: a liquidação de dezembro só ganha fonte e elemento se o empenho (emitido em outro mês) também estiver carregado.
3. Aba **2. Tabelas**: cada tipo de arquivo vira uma tabela com o nome do prefixo (`NE`, `LQ`, `NP` …), com os campos nomeados conforme o dicionário. As visões prontas fazem os cruzamentos mais usados:
   - `v_liquidacoes` = LQ × NE × EL (liquidação com fonte, elemento, credor e marcação de estorno);
   - `v_empenhos` = NE + AE + LQ + EL + NP (empenhado, anulado, liquidado, estornado, pago);
   - `v_pagamentos` = NP × NE × CP × EG.
4. Aba **3. Consulta**: monte o cruzamento escolhendo tabela base, junções (chaves em comum sugeridas), colunas, filtros e totalizações; o SQL gerado pode ser editado e executado (Ctrl+Enter). Exporte para CSV/Excel, copie para o Excel ou salve a consulta como **seção de um relatório**.
5. Aba **4. Relatórios**: escolha um modelo, informe os parâmetros, gere e então **imprima/salve em PDF**, baixe **Excel** (uma aba por quadro), **Word (.docx)**, HTML, ou copie tudo. Modelos incluídos podem ser duplicados e editados (títulos, SQL, quadros, subtotais, tabelas cruzadas). As definições ficam no navegador e podem ser exportadas/importadas em JSON (`relatorios/` guarda exemplos).
6. Aba **Dicionário**: todos os leiautes catalogados com o grau de confiança de cada nome de campo.

Toda tabela recebe as colunas `_arquivo`, `_competencia`, `_linha` (número da linha dentro do arquivo de remessa, como citado nos quadros do demonstrativo) e `_pacote`.

## Modelos de relatório incluídos

| Modelo | O que faz |
|---|---|
| Demonstrativo analítico das liquidações do FUNDEB | Quadros de totais por bloco, resumo 70% e 30% por elemento × fonte, relação analítica com arquivo/linha, relação por nota de empenho, estornos (EL) e liquidações sem empenho localizado. Parâmetros: prefixo da fonte (`54`) e detalhamento do bloco 70% (`107`). |
| Posição consolidada por empenho | Empenhado, anulado, liquidado bruto/líquido, pago, saldos a liquidar e a pagar. |
| Liquidações por credor e elemento | Bruto, estornos e líquido por credor. |
| Empenhos por elemento e fonte | Tabela cruzada e resumo por órgão/unidade. |
| Pagamentos por conta bancária | NP com o detalhe bancário de CP. |
| Inventário das remessas carregadas | Arquivos, competências e registros. |

## Metodologia do cruzamento (como o demonstrativo FUNDEB é reproduzido)

- **Chave empenho**: `orgao + unidade + numero_empenho + data_empenho`. O número do empenho (`DDMMSSSS`) se repete entre órgãos, por isso órgão e unidade fazem parte da chave.
- **Fonte completa** = `exercicio_fonte` (1 = exercício corrente) + `fonte_recurso` (9 dígitos). Ex.: `1` + `542107000` = `1542107000`.
- **Bloco 70%** = fontes cujo detalhamento (posições 4-6 da fonte de 9 dígitos) é `107`; as demais fontes `54x` formam o bloco de 30%.
- **Estorno de liquidação**: um registro de `EL` casa com a liquidação de `LQ` pelo empenho e pela **data da liquidação** (EL não traz o sequencial "sub"). Se houver duas liquidações do mesmo empenho na mesma data, ambas serão marcadas como estornadas - conferir manualmente nesse caso.
- Valores líquidos = liquidações - estornos.

## Divergências encontradas entre o PDF enviado e os arquivos de 12/2023

Ao reproduzir o demonstrativo com os arquivos `NE202312.DCD` e `LQ202312.DCD`, todas as linhas citadas com `LQ202312.DCD` batem em número da linha, valor, elemento e fonte, **exceto duas fontes**:

| Empenho | Linha LQ | PDF diz | Arquivo NE diz | Balancete BD confirma |
|---|---|---|---|---|
| 01120034 | 74 | 1540107000 | 1542107000 | 1542107000 (ação 041) |
| 01120037 | 48 | 1540107000 | 1542107000 | 1542107000 |

O total do bloco 70% não muda (todas são fontes do bloco), mas a distribuição por coluna de fonte no Quadro 2 do PDF está deslocada em R$ 308.060,38 entre as colunas 1540107000 e 1542107000, salvo se houve retransmissão corrigindo a fonte em outra competência.

Os Quadros 1 (conciliação com o Modelo 10) e 6 (lançamentos não refletidos na base de consulta do SIM) do PDF dependem de dados externos às remessas (Modelo 10 e a base de consulta do TCE) e por isso não são gerados automaticamente - podem ser montados como seção de texto/tabela a partir de uma consulta e dos valores informados.

## Limitações conhecidas

- Os nomes dos campos foram inferidos dos dados (ver `docs/dicionario.md`); 320 campos estão marcados como "chute". NE, LQ, EL, AE, NP, CP, PF e os identificadores de função/subfunção/programa/ação/elemento/fonte estão confirmados.
- Os três valores da NE (`valor_empenho`, `valor_22`, `valor_23`) somam (`valor_empenho = valor_22 + valor_23` em 100% da amostra), mas o significado exato das parcelas não foi confirmado.
- A versão publicada como artefato no claude.ai não permite impressão nem download, para nenhum artefato (restrição do visualizador, não deste aplicativo); use "Copiar" lá, ou abra `dist/AnaliseSIMTCE.html` localmente para PDF/Excel/Word.
- O conversor para `.docx` escreve o OOXML diretamente (sem biblioteca), com tabelas, subtotais, destaques e página em paisagem A4; não reproduz estilos avançados do Word (não é necessário para abrir, editar ou imprimir).
- Relatórios personalizados ficam no `localStorage` do navegador: exporte o JSON para não perdê-los. O `localStorage` é por origem - a versão portátil (arquivo local) e a publicada no claude.ai guardam relatórios separadamente.

## Estrutura

```
index.html                página única da aplicação (código-fonte, para desenvolver)
css/style.css             estilos (tela e impressão A4 paisagem)
js/layouts.js             catálogo dos leiautes (nomes, tipos, confiança)
js/parser.js              leitura de ZIP e CSV (Windows-1252)
js/db.js                  SQLite em memória, índices, funções SQL e visões de cruzamento
js/builder.js             construtor visual -> SQL
js/reports.js             modelos de relatório, execução, renderização e exportação (PDF/Excel/HTML)
js/docx.js                exportação para Word (.docx), OOXML gerado diretamente
js/app.js                 interface
vendor/                   sql.js 1.14.2, JSZip 3.10.1, SheetJS 0.18.5 (uso offline)
tools/build-standalone.js gera dist/AnaliseSIMTCE.html a partir do código-fonte
dist/AnaliseSIMTCE.html   versão portátil: um único arquivo, para usar em qualquer computador
docs/dicionario.md        dicionário gerado a partir de js/layouts.js
relatorios/               exemplos de definições de relatório (JSON) para importar
```

Funções SQL extras disponíveis: `data_br(aaaammdd)`, `comp_br(aaaamm)`, `moeda(v)`, `fonte_completa(ex, fonte)`, `fonte_recurso_ok(prefixo, fonte)`.
