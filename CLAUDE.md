# Análise SIM TCE-CE — contexto do projeto

Leia este arquivo antes de mexer no código. Ele existe para que uma sessão nova
(em qualquer computador) não precise de explicação verbal para continuar o
trabalho.

## O que é

Aplicativo de página única (sem servidor) que cruza os arquivos de remessa
mensal ao SIM (Sistema de Informações Municipais do TCE-CE) e gera relatórios
customizados, como o Demonstrativo Analítico das Liquidações do FUNDEB. Roda
inteiramente no navegador: lê ZIPs localmente, carrega tudo num SQLite em
memória (sql.js) e consulta por construtor visual ou SQL direto. Nada sai do
computador do usuário.

Detalhes de uso, modelos de relatório e metodologia do cruzamento: `README.md`.
Dicionário completo dos 53 leiautes de arquivo (com grau de confiança por
campo): `docs/dicionario.md`, gerado a partir de `js/layouts.js`.

## Arquitetura

```
index.html                página-fonte (desenvolver aqui)
css/style.css              estilos (tela + impressão A4 paisagem)
js/layouts.js               catálogo dos 53 leiautes: nomes de campo, tipo, confiança
js/parser.js                leitura de ZIP e CSV (Windows-1252)
js/db.js                    SQLite em memória (sql.js), índices, funções SQL, visões de cruzamento
js/builder.js                construtor visual -> SQL
js/reports.js               modelos de relatório, execução, render HTML, export PDF/Excel/HTML
js/docx.js                  export Word (.docx) via OOXML gerado à mão (sem lib nova)
js/app.js                   interface / cola tudo
vendor/                     sql.js 1.14.2, JSZip 3.10.1, SheetJS 0.18.5 (offline, vendorizados do npm)
tools/build-standalone.js   gera dist/AnaliseSIMTCE.html a partir do código-fonte
dist/AnaliseSIMTCE.html     BUILD GERADO — nunca editar à mão, só via o script acima
relatorios/                 exemplos de definição de relatório (JSON) para importar
```

**Fluxo de build**: só `index.html` + `css/` + `js/` + `vendor/` são código-fonte.
Depois de qualquer mudança neles, rodar `node tools/build-standalone.js` para
regravar `dist/AnaliseSIMTCE.html` (arquivo único, sem dependências externas,
pensado para ser copiado para outro computador e aberto com duplo clique,
offline). Nunca editar `dist/AnaliseSIMTCE.html` diretamente — a próxima build
sobrescreve.

## Convenções do projeto

- Todo texto de interface, nomes de variável de domínio e comentários em
  **português**. Código (nomes de função genéricos, etc.) pode ficar em inglês
  quando for mais natural, mas o que o usuário vê é sempre PT-BR.
- Todo campo em `js/layouts.js` carrega uma tag de confiança: `certeza`
  (confirmado por cruzamento entre arquivos ou com o relatório oficial),
  `provavel` (inferência forte) ou `chute` (nome provisório). Ao adicionar ou
  corrigir um campo, sempre marcar a confiança — nunca deixar sem tag.
- Os nomes de campo foram inferidos dos dados; o Manual do SIM do TCE-CE não
  pôde ser consultado (ver "Armadilhas" abaixo). Qualquer correção vinda do
  manual oficial deve subir a tag para `certeza`.

## Como validar mudanças (não há suíte de teste automatizada)

Não existe framework de teste configurado. A validação usada até aqui foi
com Playwright headless, carregando o pacote ZIP real de uma competência
(fornecido pelo usuário) e comparando os totais do relatório gerado com o
PDF oficial `Demonstrativo_Liquidacoes_FUNDEB_2023.pdf` que o usuário enviou.
Rotina usada:

```
# Chromium "new headless" não funciona neste ambiente (binário antigo removido).
# Use o chromium_headless_shell baixado via npm (sql.js/jszip/xlsx já estão
# vendorizados; playwright é instalado à parte, sob /tmp ou scratchpad).
executablePath: '/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell'
```

Checklist mínimo antes de considerar uma mudança pronta:
1. `node --check js/<arquivo>.js` em todo arquivo tocado.
2. Carregar o ZIP de teste, gerar o relatório FUNDEB, comparar linha a linha
   com o PDF oficial (quando a mudança afeta cruzamento/valores).
3. Testar carga com várias competências (não só uma) — há índices e uma
   tabela materializada (`ne_unica`) justamente porque o NE pode ser
   retransmitido em meses diferentes; sem isso o app fica lento ou erra com
   12 meses carregados.
4. Depois de qualquer mudança em `index.html`/`css/`/`js/`, rodar
   `node tools/build-standalone.js` e testar o `dist/AnaliseSIMTCE.html`
   também (ele roda fora do navegador do artefato, então impressão/export
   real só se testa nele).

## Armadilhas já encontradas (não repetir)

- **SheetJS minificado contém `$&`/`$'` no próprio código** (usado em
  formatação de número). Se esse conteúdo for passado como *string* para
  `String.prototype.replace()`, o motor interpreta esses `$` como padrões de
  regex e corrompe a saída. `tools/build-standalone.js` usa uma *função* de
  substituição por causa disso — nunca trocar de volta para string.
- **O visualizador de artefato do claude.ai bloqueia `window.print()` e
  qualquer download**, para qualquer página publicada ali, sem exceção. Isso
  não é bug do app. `js/app.js` detecta esse ambiente (`art` em `iniciar()`)
  e esconde os botões de exportação nesse caso, apontando para a versão
  portátil (`dist/AnaliseSIMTCE.html`).
- Acesso à web para `tce.ce.gov.br` é bloqueado pelo proxy de rede deste
  ambiente (checar `environment.network` se isso mudar) — por isso os nomes
  de campo em `js/layouts.js` vieram de engenharia reversa dos dados, não do
  Manual do SIM. Se algum dia o manual oficial for lido, revisar
  `js/layouts.js` inteiro contra ele.
- `EL` (estorno de liquidação) **não traz o sequencial "sub" da liquidação**,
  só empenho + data. A junção em `v_liquidacoes` casa por
  órgão+unidade+empenho+data_empenho+data_liquidacao; se duas liquidações do
  mesmo empenho caírem na mesma data, ambas são marcadas como estornadas
  mesmo que só uma tenha sido. Documentado no README; não é bug a corrigir
  sem mais informação sobre o leiaute real do EL.

## Divergência de dados conhecida, ainda sem explicação

No pacote de teste `145202312PAAAA.zip`, os empenhos `01120034` e `01120037`
aparecem no PDF oficial do usuário com fonte `1540107000`, mas o arquivo
`NE202312.DCD` (confirmado pelo balancete `BD202312.DCD`) registra
`1542107000` para os dois. Não muda o total do bloco 70% do FUNDEB, só desloca
R$ 308.060,38 entre duas colunas do Quadro 2. Detalhes no README, seção
"Divergências encontradas". Se o usuário trouxer mais competências e a mesma
divergência aparecer de novo, vale perguntar a ele em vez de silenciosamente
"corrigir" para bater com o PDF — o PDF pode estar certo e o app errado, ou
vice-versa.

## Estado atual do repositório

- Única branch: `claude/analise-sim-app` — é também a branch padrão do
  GitHub (o repositório foi criado vazio nesta mesma sessão de trabalho, não
  havia `master`/`main` prévio). Não há PR aberto nem processo de
  code review configurado.
- **Não há CI/CD nem automação agendada** (`.github/workflows` não existe,
  nenhuma Routine/trigger foi criada para este projeto). Se o usuário
  perguntar por que "a automação não rodou", a resposta é que nunca houve
  automação configurada — não é uma falha, é ausência de configuração.
- Validado até agora só com os dados de uma competência real (12/2023) mais
  um teste de performance com 12 meses sintéticos (416 mil registros, carga
  em ~9s, relatórios entre 0,03s e 1,6s). Ainda não foi testado com dados
  reais de mais de uma competência.
