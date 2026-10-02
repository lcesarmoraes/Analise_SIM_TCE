# Dicionário dos leiautes do SIM (TCE-CE) usado pelo aplicativo

Gerado a partir de `js/layouts.js`. Os nomes dos campos foram **inferidos** a partir dos dados de uma competência real (pacote 145202312P) e do cruzamento com o Demonstrativo FUNDEB; o Manual do SIM não pôde ser consultado durante a construção. Confiança por campo:

- **certeza**: confirmado por cruzamento entre arquivos ou com o relatório;
- **provavel**: inferência forte a partir do conteúdo;
- **chute**: nome provisório; conferir no Manual do SIM antes de usar em relatório oficial.

Colunas de metadados presentes em todas as tabelas: `_arquivo` (Nome do arquivo de remessa (ex.: LQ202312.DCD)), `_competencia` (Competência extraída do nome do arquivo (AAAAMM)), `_linha` (Número da linha no arquivo (1 = primeira linha)), `_pacote` (Nome do ZIP de origem (vazio se arquivo avulso)).

## Índice

| Prefixo | Registro | Grupo | Nome | Campos | Confiança do leiaute |
|---|---|---|---|---|---|
| AE | 606 | .DCD | Anulação de Empenho | 15 | provavel |
| AF | 959 | .CPF | Folha de Pagamento - Analítica (por servidor/verba) | 17 | provavel |
| AP | 951 | .CPF | Admissões de Pessoal | 40 | chute |
| AT | 402 | .DCR | Anulação de Receita Orçamentária | 16 | provavel |
| AX | 404 | .DCR | Anulação de Receita Extraorçamentária | 13 | provavel |
| BA | 308 | .BAL | Balancete Contábil Analítico (por dotação) | 25 | provavel |
| BB | 306 | .BAL | Balancete Contábil - Contas Bancárias | 15 | provavel |
| BC | 305 | .BAL | Balancete Contábil (contas sem detalhamento) | 22 | chute |
| BD | 302 | .BAL | Balancete da Despesa Orçamentária | 43 | provavel |
| BE | 307 | .BAL | Balancete Contábil - Receita por Conta | 16 | chute |
| BN | 983 | .PAT | Bens - Vínculo com Empenho | 9 | chute |
| BO | 981 | .PAT | Bens - Incorporações | 12 | chute |
| BR | 301 | .BAL | Balancete da Receita Orçamentária | 15 | provavel |
| CA | 701 | .CRD | Créditos Adicionais | 25 | provavel |
| CB | 106 | .BAS | Cadastro de Contas Bancárias | 14 | provavel |
| CO | 511 | .LCO | Contratos | 19 | provavel |
| CP | 605 | .DCD | Pagamento - Conta Bancária | 17 | provavel |
| CR | 956 | .CPF | Cargos / Vínculos | 15 | chute |
| CT | 513 | .LCO | Contratados | 14 | provavel |
| DA | 805 | .OUT | Diárias | 21 | provavel |
| DL | 507 | .LCO | Dotações da Licitação | 18 | provavel |
| DP | 609 | .DCD | Pagamento - Retenções/Consignações | 13 | chute |
| DS | 952 | .CPF | Desligamentos / Afastamentos | 19 | chute |
| DX | 304 | .BAL | Balancete da Despesa Extraorçamentária | 12 | provavel |
| EF | 607 | .DCD | Transferência Financeira entre Contas | 16 | provavel |
| EG | 611 | .DCD | Estorno de Pagamento | 13 | provavel |
| EL | 610 | .DCD | Estorno de Liquidação | 12 | certeza |
| EP | 204 | .ORC | Orçamento - Dotações da Despesa | 15 | provavel |
| FA | 702 | .CRD | Créditos Adicionais - Fonte (Anulação de dotação) | 18 | chute |
| FP | 958 | .CPF | Folha de Pagamento - Resumo | 18 | provavel |
| IF | 603 | .DCD | Itens da Nota Fiscal / Liquidação | 17 | provavel |
| LI | 501 | .LCO | Licitações | 25 | provavel |
| LQ | 612 | .DCD | Liquidação da Despesa | 17 | certeza |
| LT | 505 | .LCO | Licitantes | 13 | provavel |
| MF | 705 | .CRD | Movimentação de Fonte / Remanejamento | 21 | chute |
| MO | 902 | .OSE | Medições de Obras | 22 | chute |
| NE | 601 | .DCD | Nota de Empenho | 45 | certeza |
| NF | 602 | .DCD | Nota Fiscal / Documento da Liquidação | 29 | chute |
| NP | 604 | .DCD | Nota de Pagamento | 16 | provavel |
| OS | 901 | .OSE | Obras e Serviços de Engenharia | 32 | chute |
| PA | 203 | .ORC | Orçamento - Programas/Ações | 15 | provavel |
| PE | 502 | .LCO | Publicações da Licitação | 9 | provavel |
| PF | 613 | .DCD | Pagamento de Folha | 14 | provavel |
| RC | 999 | .CTR | Registro de Controle / Responsáveis | 13 | chute |
| RE | 201 | .ORC | Orçamento - Previsão da Receita | 10 | provavel |
| RP | 984 | .PAT | Bens - Depreciação / Reavaliação | 15 | chute |
| RX | 303 | .BAL | Balancete da Receita Extraorçamentária | 12 | provavel |
| SO | 903 | .OSE | Situação de Obras | 15 | chute |
| TL | 506 | .LCO | Itens da Licitação | 13 | provavel |
| TR | 401 | .DCR | Receita Orçamentária (lançamentos) | 23 | provavel |
| TX | 403 | .DCR | Receita Extraorçamentária (lançamentos) | 20 | chute |
| XC | 107 | .BAS | Cadastro de Contas Extraorçamentárias | 7 | chute |
| XD | 614 | .DCD | Pagamento Extraorçamentário | 20 | chute |

## Grupo .BAL

### BA - Balancete Contábil Analítico (por dotação) (registro 308)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `tipo` | txt | Tipo de registro | chute |
| 5 | `conta_contabil` | txt | Conta contábil (PCASP) | certeza |
| 6 | `orgao` | txt | Órgão | certeza |
| 7 | `unidade` | txt | Unidade | certeza |
| 8 | `funcao` | txt | Função | certeza |
| 9 | `subfuncao` | txt | Subfunção | certeza |
| 10 | `programa` | txt | Programa | certeza |
| 11 | `tipo_acao` | txt | Tipo de ação | provavel |
| 12 | `acao` | txt | Ação | certeza |
| 13 | `subacao` | txt | Subação | chute |
| 14 | `elemento_despesa` | txt | Natureza da despesa | certeza |
| 15 | `exercicio_fonte` | txt | Identificador da fonte | provavel |
| 16 | `fonte_recurso` | txt | Fonte de recursos | certeza |
| 17 | `campo17` | txt | Campo não identificado | chute |
| 18 | `competencia` | cmp | Competência da remessa | certeza |
| 19 | `natureza_saldo_anterior` | txt | D/C do saldo anterior | provavel |
| 20 | `saldo_anterior` | num | Saldo anterior | provavel |
| 21 | `debitos` | num | Débitos do mês | provavel |
| 22 | `creditos` | num | Créditos do mês | provavel |
| 23 | `natureza_saldo_atual` | txt | D/C do saldo atual | provavel |
| 24 | `saldo_atual` | num | Saldo atual | provavel |
| 25 | `campo25` | txt | Campo final | chute |

### BB - Balancete Contábil - Contas Bancárias (registro 306)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `tipo` | txt | Tipo de registro | chute |
| 5 | `conta_contabil` | txt | Conta contábil | certeza |
| 6 | `banco` | txt | Banco | certeza |
| 7 | `agencia` | txt | Agência | certeza |
| 8 | `conta` | txt | Conta bancária | certeza |
| 9 | `competencia` | cmp | Competência da remessa | certeza |
| 10 | `natureza_saldo_anterior` | txt | D/C | provavel |
| 11 | `saldo_anterior` | num | Saldo anterior | provavel |
| 12 | `debitos` | num | Débitos | provavel |
| 13 | `creditos` | num | Créditos | provavel |
| 14 | `natureza_saldo_atual` | txt | D/C | provavel |
| 15 | `saldo_atual` | num | Saldo atual | provavel |

### BC - Balancete Contábil (contas sem detalhamento) (registro 305)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `tipo` | txt | Tipo de registro | chute |
| 5 | `conta_contabil` | txt | Conta contábil | certeza |
| 6 | `atributo` | txt | Atributo (F/P/N) | chute |
| 7 | `campo07` | txt | Campo não identificado | chute |
| 8 | `fonte_recurso` | txt | Fonte de recursos | chute |
| 9 | `campo09` | txt | Campo não identificado | chute |
| 10 | `competencia` | cmp | Competência da remessa | certeza |
| 11 | `campo11` | txt | Campo não identificado | chute |
| 12 | `campo12` | txt | Campo não identificado | chute |
| 13 | `natureza_saldo_anterior` | txt | D/C | provavel |
| 14 | `saldo_anterior` | num | Saldo anterior | provavel |
| 15 | `debitos` | num | Débitos | provavel |
| 16 | `creditos` | num | Créditos | provavel |
| 17 | `natureza_saldo_atual` | txt | D/C | provavel |
| 18 | `saldo_atual` | num | Saldo atual | provavel |
| 19 | `valor_19` | txt | Campo não identificado | chute |
| 20 | `valor_20` | txt | Campo não identificado | chute |
| 21 | `valor_21` | txt | Campo não identificado | chute |
| 22 | `valor_22` | txt | Campo não identificado | chute |

### BD - Balancete da Despesa Orçamentária (registro 302)

Saldos por dotação (função ... elemento, fonte). As colunas de valor não foram identificadas individualmente.

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `funcao` | txt | Função | certeza |
| 7 | `subfuncao` | txt | Subfunção | certeza |
| 8 | `programa` | txt | Programa | certeza |
| 9 | `tipo_acao` | txt | Tipo de ação | provavel |
| 10 | `acao` | txt | Ação | certeza |
| 11 | `subacao` | txt | Subação | chute |
| 12 | `elemento_despesa` | txt | Natureza da despesa | certeza |
| 13 | `exercicio_fonte` | txt | Identificador da fonte | provavel |
| 14 | `fonte_recurso` | txt | Fonte de recursos | certeza |
| 15 | `competencia` | cmp | Competência da remessa | certeza |
| 16 | `natureza_saldo` | txt | Natureza (D/C) | chute |
| 17 | `valor_17` | txt | Campo não identificado | chute |
| 18 | `valor_18` | txt | Campo não identificado | chute |
| 19 | `valor_19` | txt | Campo não identificado | chute |
| 20 | `valor_20` | txt | Campo não identificado | chute |
| 21 | `valor_21` | txt | Campo não identificado | chute |
| 22 | `valor_22` | txt | Campo não identificado | chute |
| 23 | `valor_23` | txt | Campo não identificado | chute |
| 24 | `valor_24` | txt | Campo não identificado | chute |
| 25 | `valor_25` | txt | Campo não identificado | chute |
| 26 | `valor_26` | txt | Campo não identificado | chute |
| 27 | `valor_27` | txt | Campo não identificado | chute |
| 28 | `valor_28` | txt | Campo não identificado | chute |
| 29 | `valor_29` | txt | Campo não identificado | chute |
| 30 | `valor_30` | txt | Campo não identificado | chute |
| 31 | `valor_31` | txt | Campo não identificado | chute |
| 32 | `valor_32` | txt | Campo não identificado | chute |
| 33 | `valor_33` | txt | Campo não identificado | chute |
| 34 | `valor_34` | txt | Campo não identificado | chute |
| 35 | `valor_35` | txt | Campo não identificado | chute |
| 36 | `valor_36` | txt | Campo não identificado | chute |
| 37 | `valor_37` | txt | Campo não identificado | chute |
| 38 | `valor_38` | txt | Campo não identificado | chute |
| 39 | `valor_39` | txt | Campo não identificado | chute |
| 40 | `valor_40` | txt | Campo não identificado | chute |
| 41 | `valor_41` | txt | Campo não identificado | chute |
| 42 | `valor_42` | txt | Campo não identificado | chute |
| 43 | `valor_43` | txt | Campo não identificado | chute |

### BE - Balancete Contábil - Receita por Conta (registro 307)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `tipo` | txt | Tipo de registro | chute |
| 5 | `conta_contabil` | txt | Conta contábil | certeza |
| 6 | `conta_receita` | txt | Conta de receita | provavel |
| 7 | `exercicio_fonte` | txt | Identificador da fonte | provavel |
| 8 | `fonte_recurso` | txt | Fonte de recursos | certeza |
| 9 | `campo09` | txt | Campo não identificado | chute |
| 10 | `competencia` | cmp | Competência da remessa | certeza |
| 11 | `natureza_saldo_anterior` | txt | D/C | provavel |
| 12 | `saldo_anterior` | num | Saldo anterior | provavel |
| 13 | `debitos` | num | Débitos | provavel |
| 14 | `creditos` | num | Créditos | provavel |
| 15 | `natureza_saldo_atual` | txt | D/C | provavel |
| 16 | `saldo_atual` | num | Saldo atual | provavel |

### BR - Balancete da Receita Orçamentária (registro 301)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `conta_receita` | txt | Conta de receita | certeza |
| 7 | `exercicio_fonte` | txt | Identificador da fonte | provavel |
| 8 | `fonte_recurso` | txt | Fonte de recursos | certeza |
| 9 | `competencia` | cmp | Competência da remessa | certeza |
| 10 | `natureza` | txt | D/C | chute |
| 11 | `valor_11` | txt | Campo não identificado | chute |
| 12 | `valor_12` | txt | Campo não identificado | chute |
| 13 | `valor_13` | txt | Campo não identificado | chute |
| 14 | `valor_14` | txt | Campo não identificado | chute |
| 15 | `valor_15` | txt | Campo não identificado | chute |

### DX - Balancete da Despesa Extraorçamentária (registro 304)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `conta_extra` | txt | Conta extraorçamentária | chute |
| 7 | `competencia` | cmp | Competência da remessa | certeza |
| 8 | `natureza` | txt | D/C | chute |
| 9 | `valor_09` | txt | Campo não identificado | chute |
| 10 | `valor_10` | txt | Campo não identificado | chute |
| 11 | `valor_11` | txt | Campo não identificado | chute |
| 12 | `valor_12` | txt | Campo não identificado | chute |

### RX - Balancete da Receita Extraorçamentária (registro 303)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `conta_extra` | txt | Conta extraorçamentária | chute |
| 7 | `competencia` | cmp | Competência da remessa | certeza |
| 8 | `natureza` | txt | D/C | chute |
| 9 | `valor_09` | txt | Campo não identificado | chute |
| 10 | `valor_10` | txt | Campo não identificado | chute |
| 11 | `valor_11` | txt | Campo não identificado | chute |
| 12 | `valor_12` | txt | Campo não identificado | chute |

## Grupo .BAS

### CB - Cadastro de Contas Bancárias (registro 106)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `banco` | txt | Banco | certeza |
| 7 | `agencia` | txt | Agência | certeza |
| 8 | `conta` | txt | Conta bancária | certeza |
| 9 | `competencia` | cmp | Competência da remessa | certeza |
| 10 | `data` | dat | Data | chute |
| 11 | `valor` | num | Valor | chute |
| 12 | `tipo` | txt | Tipo | chute |
| 13 | `campo13` | txt | Campo | chute |
| 14 | `campo14` | txt | Campo | chute |

### XC - Cadastro de Contas Extraorçamentárias (registro 107)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `conta_extra` | txt | Código da conta extraorçamentária | chute |
| 5 | `competencia` | cmp | Competência da remessa | certeza |
| 6 | `descricao` | txt | Descrição | provavel |
| 7 | `valor` | num | Valor | chute |

## Grupo .CPF

### AF - Folha de Pagamento - Analítica (por servidor/verba) (registro 959)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `competencia` | cmp | Competência da remessa | certeza |
| 7 | `tipo_folha` | txt | Tipo da folha | provavel |
| 8 | `data_folha` | dat | Data da folha | provavel |
| 9 | `cpf_servidor` | txt | CPF do servidor | certeza |
| 10 | `campo10` | txt | Código não identificado (C/T) | chute |
| 11 | `campo11` | txt | Código não identificado (J/H) | chute |
| 12 | `norma` | txt | Lei/norma do vínculo | chute |
| 13 | `codigo_verba` | txt | Código da verba/rubrica | provavel |
| 14 | `valor` | num | Valor da verba | certeza |
| 15 | `tipo_verba` | txt | Tipo (vazio/O) | chute |
| 16 | `competencia_folha` | cmp | Competência da folha | provavel |
| 17 | `campo17` | txt | Campo não identificado | chute |

### AP - Admissões de Pessoal (registro 951)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `cpf_servidor` | txt | CPF do servidor | certeza |
| 7 | `campo07` | txt | Código (C/T) | chute |
| 8 | `campo08` | txt | Código (J/H) | chute |
| 9 | `norma` | txt | Lei/norma | chute |
| 10 | `campo10` | txt | Código | chute |
| 11 | `data_admissao` | dat | Data de admissão | chute |
| 12 | `campo12` | txt | Código | chute |
| 13 | `ato` | txt | Ato/edital | chute |
| 14 | `data_14` | dat | Data | chute |
| 15 | `data_15` | dat | Data | chute |
| 16 | `data_16` | dat | Data | chute |
| 17 | `matricula` | txt | Matrícula | chute |
| 18 | `campo18` | txt | Campo não identificado | chute |
| 19 | `campo19` | txt | Campo não identificado | chute |
| 20 | `campo20` | txt | Campo não identificado | chute |
| 21 | `campo21` | txt | Campo não identificado | chute |
| 22 | `campo22` | txt | Campo não identificado | chute |
| 23 | `campo23` | txt | Campo não identificado | chute |
| 24 | `campo24` | txt | Campo não identificado | chute |
| 25 | `pis_pasep` | txt | PIS/PASEP (11 dígitos) | chute |
| 26 | `rg` | txt | RG | chute |
| 27 | `orgao_rg` | txt | Órgão emissor do RG | chute |
| 28 | `titulo_eleitor` | txt | Título de eleitor (13 dígitos) | chute |
| 29 | `campo29` | txt | Campo não identificado | chute |
| 30 | `campo30` | txt | Campo não identificado | chute |
| 31 | `campo31` | txt | Campo não identificado | chute |
| 32 | `nome` | txt | Nome do servidor | provavel |
| 33 | `nome_mae` | txt | Nome da mãe | chute |
| 34 | `nome_pai` | txt | Nome do pai | chute |
| 35 | `endereco` | txt | Endereço | provavel |
| 36 | `telefone` | txt | Telefone | chute |
| 37 | `data_nascimento` | dat | Data de nascimento | provavel |
| 38 | `campo38` | txt | Código não identificado | chute |
| 39 | `competencia` | cmp | Competência da remessa | certeza |
| 40 | `cargo` | txt | Cargo | provavel |

### CR - Cargos / Vínculos (registro 956)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `cpf_servidor` | txt | CPF do servidor | certeza |
| 7 | `campo07` | txt | Código (C/T) | chute |
| 8 | `campo08` | txt | Código (J/H) | chute |
| 9 | `norma` | txt | Lei/norma | chute |
| 10 | `codigo` | txt | Código do cargo/verba | chute |
| 11 | `campo11` | txt | Código (LOM) | chute |
| 12 | `campo12` | txt | Código (D) | chute |
| 13 | `data_13` | dat | Data | chute |
| 14 | `data_14` | dat | Data | chute |
| 15 | `competencia` | cmp | Competência da remessa | certeza |

### DS - Desligamentos / Afastamentos (registro 952)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `cpf_servidor` | txt | CPF do servidor | certeza |
| 7 | `campo07` | txt | Código (C/T) | chute |
| 8 | `campo08` | txt | Código (J/H) | chute |
| 9 | `norma` | txt | Lei/norma | chute |
| 10 | `ato` | txt | Ato | chute |
| 11 | `campo11` | txt | Código | chute |
| 12 | `campo12` | txt | Código | chute |
| 13 | `data_13` | dat | Data | chute |
| 14 | `data_14` | dat | Data | chute |
| 15 | `campo15` | txt | Campo não identificado | chute |
| 16 | `campo16` | txt | Campo não identificado | chute |
| 17 | `campo17` | txt | Campo não identificado | chute |
| 18 | `campo18` | txt | Campo não identificado | chute |
| 19 | `competencia` | cmp | Competência da remessa | certeza |

### FP - Folha de Pagamento - Resumo (registro 958)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `competencia` | cmp | Competência da remessa | certeza |
| 7 | `tipo_folha` | txt | Tipo da folha (AN, AD, AC) | provavel |
| 8 | `data_folha` | dat | Data da folha | provavel |
| 9 | `competencia_folha` | cmp | Competência da folha | provavel |
| 10 | `valor_bruto` | num | Valor bruto | chute |
| 11 | `valor_descontos` | num | Descontos | chute |
| 12 | `valor_12` | txt | Campo não identificado | chute |
| 13 | `valor_13` | txt | Campo não identificado | chute |
| 14 | `valor_14` | txt | Campo não identificado | chute |
| 15 | `valor_15` | txt | Campo não identificado | chute |
| 16 | `valor_16` | txt | Campo não identificado | chute |
| 17 | `valor_17` | txt | Campo não identificado | chute |
| 18 | `valor_18` | num | Valor não identificado | chute |

## Grupo .CRD

### CA - Créditos Adicionais (registro 701)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `data` | dat | Data | provavel |
| 5 | `tipo_credito` | txt | Tipo de crédito/alteração | chute |
| 6 | `orgao` | txt | Órgão | certeza |
| 7 | `unidade` | txt | Unidade | certeza |
| 8 | `funcao` | txt | Função | certeza |
| 9 | `subfuncao` | txt | Subfunção | certeza |
| 10 | `programa` | txt | Programa | certeza |
| 11 | `tipo_acao` | txt | Tipo de ação | provavel |
| 12 | `acao` | txt | Ação | certeza |
| 13 | `subacao` | txt | Subação | chute |
| 14 | `elemento_despesa` | txt | Natureza da despesa | certeza |
| 15 | `exercicio_fonte` | txt | Identificador da fonte | provavel |
| 16 | `fonte_recurso` | txt | Fonte de recursos | certeza |
| 17 | `competencia` | cmp | Competência da remessa | certeza |
| 18 | `lei` | txt | Lei autorizativa | provavel |
| 19 | `decreto` | txt | Decreto | provavel |
| 20 | `campo20` | txt | Campo não identificado | chute |
| 21 | `campo21` | txt | Campo não identificado | chute |
| 22 | `valor_22` | txt | Campo não identificado | chute |
| 23 | `valor_23` | txt | Campo não identificado | chute |
| 24 | `valor_24` | txt | Campo não identificado | chute |
| 25 | `valor_25` | txt | Campo não identificado | chute |

### FA - Créditos Adicionais - Fonte (Anulação de dotação) (registro 702)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `data` | dat | Data | provavel |
| 5 | `tipo_credito` | txt | Tipo | chute |
| 6 | `orgao` | txt | Órgão | certeza |
| 7 | `unidade` | txt | Unidade | certeza |
| 8 | `funcao` | txt | Função | certeza |
| 9 | `subfuncao` | txt | Subfunção | certeza |
| 10 | `programa` | txt | Programa | certeza |
| 11 | `tipo_acao` | txt | Tipo de ação | provavel |
| 12 | `acao` | txt | Ação | certeza |
| 13 | `subacao` | txt | Subação | chute |
| 14 | `elemento_despesa` | txt | Natureza da despesa | certeza |
| 15 | `exercicio_fonte` | txt | Identificador da fonte | provavel |
| 16 | `fonte_recurso` | txt | Fonte de recursos | certeza |
| 17 | `valor` | num | Valor | provavel |
| 18 | `competencia` | cmp | Competência da remessa | certeza |

### MF - Movimentação de Fonte / Remanejamento (registro 705)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `data` | dat | Data | provavel |
| 5 | `tipo_credito` | txt | Tipo | chute |
| 6 | `campo06` | txt | Campo não identificado | chute |
| 7 | `orgao` | txt | Órgão | certeza |
| 8 | `unidade` | txt | Unidade | certeza |
| 9 | `funcao` | txt | Função | certeza |
| 10 | `subfuncao` | txt | Subfunção | certeza |
| 11 | `programa` | txt | Programa | certeza |
| 12 | `tipo_acao` | txt | Tipo de ação | provavel |
| 13 | `acao` | txt | Ação | certeza |
| 14 | `subacao` | txt | Subação | chute |
| 15 | `elemento_despesa` | txt | Natureza da despesa | certeza |
| 16 | `exercicio_fonte_origem` | txt | Identificador da fonte de origem | chute |
| 17 | `fonte_origem` | txt | Fonte de origem | chute |
| 18 | `exercicio_fonte_destino` | txt | Identificador da fonte de destino | chute |
| 19 | `fonte_destino` | txt | Fonte de destino | chute |
| 20 | `valor` | num | Valor | provavel |
| 21 | `competencia` | cmp | Competência da remessa | certeza |

## Grupo .CTR

### RC - Registro de Controle / Responsáveis (registro 999)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do registro | certeza |
| 2 | `cpf_gestor` | txt | CPF do gestor | provavel |
| 3 | `nome_gestor` | txt | Nome do gestor | provavel |
| 4 | `campo04` | txt | Campo não identificado | chute |
| 5 | `campo05` | txt | Campo não identificado | chute |
| 6 | `campo06` | txt | Campo não identificado | chute |
| 7 | `campo07` | txt | Campo não identificado | chute |
| 8 | `campo08` | txt | Campo não identificado | chute |
| 9 | `campo09` | txt | Campo não identificado | chute |
| 10 | `campo10` | txt | Campo não identificado | chute |
| 11 | `campo11` | txt | Campo não identificado | chute |
| 12 | `campo12` | txt | Campo não identificado | chute |
| 13 | `campo13` | txt | Campo não identificado | chute |

## Grupo .DCD

### AE - Anulação de Empenho (registro 606)

Anulações (totais ou parciais) de empenho.

Chave sugerida: `orgao` + `unidade` + `numero_empenho` + `data_empenho`

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `data_empenho` | dat | Data de emissão do empenho | certeza |
| 7 | `numero_empenho` | txt | Número do empenho anulado | certeza |
| 8 | `numero_anulacao` | txt | Número da nota de anulação | provavel |
| 9 | `competencia` | cmp | Competência da remessa | certeza |
| 10 | `data_anulacao` | dat | Data da anulação | provavel |
| 11 | `tipo_anulacao` | txt | Tipo (P = parcial?) | chute |
| 12 | `motivo` | txt | Motivo da anulação | certeza |
| 13 | `saldo_apos` | num | Saldo do empenho após a anulação (= saldo_anterior - valor_anulacao) | provavel |
| 14 | `valor_anulacao` | num | Valor anulado | provavel |
| 15 | `saldo_anterior` | num | Saldo do empenho antes da anulação | provavel |

### CP - Pagamento - Conta Bancária (registro 605)

Detalhe bancário dos pagamentos (banco, agência, conta, documento).

Chave sugerida: `orgao` + `unidade` + `numero_empenho` + `numero_liquidacao` + `numero_pagamento`

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `data_empenho` | dat | Data de emissão do empenho | certeza |
| 7 | `numero_empenho` | txt | Número do empenho | certeza |
| 8 | `numero_liquidacao` | txt | Sequencial da liquidação | provavel |
| 9 | `numero_pagamento` | txt | Número do pagamento | provavel |
| 10 | `banco` | txt | Código do banco | certeza |
| 11 | `agencia` | txt | Agência | certeza |
| 12 | `conta` | txt | Conta bancária | certeza |
| 13 | `numero_documento_bancario` | txt | Número do documento bancário (OB/cheque/transferência) | provavel |
| 14 | `competencia` | cmp | Competência da remessa | certeza |
| 15 | `data_pagamento` | dat | Data do pagamento | provavel |
| 16 | `valor` | num | Valor do documento | provavel |
| 17 | `tipo_documento` | txt | Tipo do documento bancário (código) | chute |

### DP - Pagamento - Retenções/Consignações (registro 609)

Detalhe do pagamento por conta extraorçamentária (retenções). O código casa com o campo conta_extra de TX/DX/XD.

Chave sugerida: `orgao` + `unidade` + `numero_empenho` + `numero_liquidacao` + `numero_pagamento`

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `data_empenho` | dat | Data de emissão do empenho | certeza |
| 7 | `numero_empenho` | txt | Número do empenho | certeza |
| 8 | `numero_liquidacao` | txt | Sequencial da liquidação | provavel |
| 9 | `numero_pagamento` | txt | Número do pagamento | provavel |
| 10 | `conta_extra` | txt | Código da conta extraorçamentária (retenção/consignação) | chute |
| 11 | `competencia` | cmp | Competência da remessa | certeza |
| 12 | `valor` | num | Valor | provavel |
| 13 | `tipo` | txt | Código de tipo (E) | chute |

### EF - Transferência Financeira entre Contas (registro 607)

Movimentações entre contas bancárias.

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `data` | dat | Data da transferência | provavel |
| 4 | `sequencial` | txt | Sequencial | chute |
| 5 | `tipo` | txt | Tipo (T) | chute |
| 6 | `banco_origem` | txt | Banco de origem | provavel |
| 7 | `agencia_origem` | txt | Agência de origem | provavel |
| 8 | `conta_origem` | txt | Conta de origem | provavel |
| 9 | `documento` | txt | Documento | chute |
| 10 | `banco_destino` | txt | Banco de destino | provavel |
| 11 | `agencia_destino` | txt | Agência de destino | provavel |
| 12 | `conta_destino` | txt | Conta de destino | provavel |
| 13 | `valor` | num | Valor | certeza |
| 14 | `historico` | txt | Histórico | certeza |
| 15 | `tipo_documento` | txt | Tipo de documento | chute |
| 16 | `competencia` | cmp | Competência da remessa | certeza |

### EG - Estorno de Pagamento (registro 611)

Estornos de pagamento (referencia empenho, liquidação e pagamento).

Chave sugerida: `orgao` + `unidade` + `numero_empenho` + `numero_liquidacao` + `numero_pagamento`

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `data_empenho` | dat | Data de emissão do empenho | certeza |
| 7 | `numero_empenho` | txt | Número do empenho | certeza |
| 8 | `numero_liquidacao` | txt | Sequencial da liquidação | provavel |
| 9 | `numero_pagamento` | txt | Número do pagamento estornado | provavel |
| 10 | `data_estorno` | dat | Data do estorno | provavel |
| 11 | `competencia` | cmp | Competência da remessa | certeza |
| 12 | `nome_ordenador` | txt | Nome do ordenador | provavel |
| 13 | `motivo` | txt | Motivo do estorno | certeza |

### EL - Estorno de Liquidação (registro 610)

Estornos de liquidação. Casa com LQ por orgao + unidade + numero_empenho + data_liquidacao.

Chave sugerida: `orgao` + `unidade` + `numero_empenho` + `data_liquidacao`

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `data_empenho` | dat | Data de emissão do empenho | certeza |
| 7 | `numero_empenho` | txt | Número do empenho | certeza |
| 8 | `data_liquidacao` | dat | Data da liquidação estornada | certeza |
| 9 | `data_estorno` | dat | Data do estorno | certeza |
| 10 | `competencia` | cmp | Competência da remessa | certeza |
| 11 | `nome_ordenador` | txt | Nome do ordenador de despesa | provavel |
| 12 | `motivo` | txt | Motivo / histórico do estorno | certeza |

### IF - Itens da Nota Fiscal / Liquidação (registro 603)

Itens (descrição, quantidade, unitário) dos documentos liquidados.

Chave sugerida: `orgao` + `unidade` + `numero_empenho` + `data_empenho`

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `data_empenho` | dat | Data de emissão do empenho | certeza |
| 7 | `numero_empenho` | txt | Número do empenho | certeza |
| 8 | `data_liquidacao` | dat | Data da liquidação | provavel |
| 9 | `tipo_documento` | txt | Tipo do documento | chute |
| 10 | `numero_documento` | txt | Número do documento | provavel |
| 11 | `item` | txt | Sequencial do item | provavel |
| 12 | `descricao` | txt | Descrição do item | certeza |
| 13 | `unidade_medida` | txt | Unidade de medida | certeza |
| 14 | `quantidade` | num | Quantidade | certeza |
| 15 | `valor_unitario` | num | Valor unitário | certeza |
| 16 | `valor_total` | num | Valor total do item | certeza |
| 17 | `campo17` | txt | Campo final | chute |

### LQ - Liquidação da Despesa (registro 612)

Liquidações do mês. Chave: orgao + unidade + numero_empenho + numero_liquidacao.

Chave sugerida: `orgao` + `unidade` + `numero_empenho` + `data_empenho` + `numero_liquidacao`

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `data_empenho` | dat | Data de emissão do empenho | certeza |
| 7 | `numero_empenho` | txt | Número do empenho | certeza |
| 8 | `data_liquidacao` | dat | Data da liquidação | certeza |
| 9 | `competencia` | cmp | Competência da remessa | certeza |
| 10 | `cpf_ordenador` | txt | CPF do ordenador de despesa | provavel |
| 11 | `nome_ordenador` | txt | Nome do ordenador de despesa | provavel |
| 12 | `numero_liquidacao` | txt | Sequencial da liquidação dentro do empenho ("Sub") | certeza |
| 13 | `valor_liquidacao` | num | Valor liquidado | certeza |
| 14 | `competencia_folha` | cmp | Competência da folha de pagamento (0 quando não é folha) | provavel |
| 15 | `tipo_folha` | txt | Tipo da folha (AN, AD, AC); vazio quando não é folha | provavel |
| 16 | `data_folha` | dat | Data da folha (0 quando não é folha) | provavel |
| 17 | `valor_folha` | num | Valor da folha | provavel |

### NE - Nota de Empenho (registro 601)

Empenhos emitidos na competência. Chave: orgao + unidade + numero_empenho (+ data_empenho).

Chave sugerida: `orgao` + `unidade` + `numero_empenho` + `data_empenho`

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `data_empenho` | dat | Data de emissão do empenho | certeza |
| 7 | `numero_empenho` | txt | Número do empenho (DDMMSSSS) | certeza |
| 8 | `competencia` | cmp | Competência da remessa | certeza |
| 9 | `funcao` | txt | Função | certeza |
| 10 | `subfuncao` | txt | Subfunção | certeza |
| 11 | `programa` | txt | Programa | certeza |
| 12 | `tipo_acao` | txt | Tipo de ação (1=projeto, 2=atividade, 0=op. especial) | provavel |
| 13 | `acao` | txt | Ação (projeto/atividade) | certeza |
| 14 | `subacao` | txt | Subação / detalhamento da ação | chute |
| 15 | `elemento_despesa` | txt | Natureza da despesa (8 dígitos) | certeza |
| 16 | `exercicio_fonte` | txt | Identificador da fonte: 1=exercício corrente, 2=exercícios anteriores | provavel |
| 17 | `fonte_recurso` | txt | Fonte/destinação de recursos (9 dígitos). Fonte completa = exercicio_fonte // fonte_recurso | certeza |
| 18 | `campo18` | txt | Campo vazio na amostra | chute |
| 19 | `tipo_empenho` | txt | Tipo: O=ordinário, G=global, E=estimativo | certeza |
| 20 | `historico` | txt | Histórico / objeto do empenho | certeza |
| 21 | `valor_empenho` | num | Valor do empenho (= valor_22 + valor_23 em 100% da amostra) | provavel |
| 22 | `valor_22` | num | Parcela do empenho - coincide com a liquidação do mês na maior parte da amostra | chute |
| 23 | `valor_23` | num | Parcela complementar (valor_empenho - valor_22) | chute |
| 24 | `cpf_24` | txt | CPF (possivelmente do responsável/fiscal do contrato) | chute |
| 25 | `numero_contrato` | txt | Número do contrato | provavel |
| 26 | `data_contrato` | dat | Data do contrato | provavel |
| 27 | `numero_licitacao` | txt | Número da licitação | provavel |
| 28 | `data_licitacao` | dat | Data da licitação | provavel |
| 29 | `tipo_licitacao` | txt | Código de modalidade/situação (F, N, D, R) | chute |
| 30 | `tipo_credor` | txt | Tipo de credor (1=PJ, 2=PF, 6/7=folha de pagamento) | provavel |
| 31 | `cpf_cnpj_credor` | txt | CPF/CNPJ do credor | certeza |
| 32 | `nome_credor` | txt | Nome do credor | certeza |
| 33 | `endereco_credor` | txt | Endereço do credor | certeza |
| 34 | `telefone_credor` | txt | Telefone do credor | provavel |
| 35 | `cep_credor` | txt | CEP do credor | certeza |
| 36 | `cidade_credor` | txt | Cidade do credor | certeza |
| 37 | `uf_credor` | txt | UF do credor | certeza |
| 38 | `data_38` | dat | Data não identificada | chute |
| 39 | `campo39` | txt | Código não identificado (O/S) | chute |
| 40 | `campo40` | txt | Código não identificado | chute |
| 41 | `cpf_ordenador` | txt | CPF do ordenador de despesa (coincide com cpf_ordenador da LQ) | provavel |
| 42 | `data_42` | dat | Data não identificada (convênio/termo?) | chute |
| 43 | `campo43` | txt | Referência não identificada (ex.: "02/2021 - 02") | chute |
| 44 | `campo44` | txt | Código não identificado (ex.: "TC") | chute |
| 45 | `campo45` | txt | Campo final ("0000") | chute |

### NF - Nota Fiscal / Documento da Liquidação (registro 602)

Documentos fiscais vinculados às liquidações.

Chave sugerida: `orgao` + `unidade` + `numero_empenho` + `data_empenho`

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `data_empenho` | dat | Data de emissão do empenho | certeza |
| 7 | `numero_empenho` | txt | Número do empenho | certeza |
| 8 | `data_liquidacao` | dat | Data da liquidação | provavel |
| 9 | `tipo_documento` | txt | Tipo do documento (S = serviço?) | chute |
| 10 | `numero_documento` | txt | Número da nota fiscal / documento | provavel |
| 11 | `competencia` | cmp | Competência da remessa | certeza |
| 12 | `campo12` | txt | Campo não identificado | chute |
| 13 | `campo13` | txt | Campo não identificado | chute |
| 14 | `campo14` | txt | Campo não identificado | chute |
| 15 | `campo15` | txt | Campo não identificado | chute |
| 16 | `data_emissao` | dat | Data de emissão do documento | chute |
| 17 | `serie_ou_numero2` | txt | Série / número secundário | chute |
| 18 | `uf_documento` | txt | UF de emissão | chute |
| 19 | `data_19` | dat | Data não identificada | chute |
| 20 | `valor_documento` | num | Valor do documento | provavel |
| 21 | `valor_21` | num | Valor não identificado | chute |
| 22 | `valor_22` | num | Valor não identificado | chute |
| 23 | `aliquota` | num | Alíquota (%) | chute |
| 24 | `base_calculo` | num | Base de cálculo | chute |
| 25 | `campo25` | txt | Campo não identificado | chute |
| 26 | `campo26` | txt | Campo não identificado | chute |
| 27 | `campo27` | txt | Campo não identificado | chute |
| 28 | `chave_acesso` | txt | Chave/código de verificação do documento | chute |
| 29 | `cnpj_emitente` | txt | CPF/CNPJ do emitente | provavel |

### NP - Nota de Pagamento (registro 604)

Pagamentos (ordens de pagamento) do mês.

Chave sugerida: `orgao` + `unidade` + `numero_empenho` + `numero_liquidacao` + `numero_pagamento`

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `data_empenho` | dat | Data de emissão do empenho | certeza |
| 7 | `numero_empenho` | txt | Número do empenho | certeza |
| 8 | `numero_liquidacao` | txt | Sequencial da liquidação paga | provavel |
| 9 | `numero_pagamento` | txt | Número do pagamento | provavel |
| 10 | `competencia` | cmp | Competência da remessa | certeza |
| 11 | `numero_documento` | txt | Número do documento (repete numero_pagamento na amostra) | chute |
| 12 | `data_pagamento` | dat | Data do pagamento | provavel |
| 13 | `valor_pago` | num | Valor pago | provavel |
| 14 | `valor_retencoes` | num | Valor retido/deduzido | chute |
| 15 | `cpf_responsavel` | txt | CPF do responsável pelo pagamento (tesoureiro) | chute |
| 16 | `nome_responsavel` | txt | Nome do responsável pelo pagamento | chute |

### PF - Pagamento de Folha (registro 613)

Pagamentos vinculados a folhas de pagamento.

Chave sugerida: `orgao` + `unidade` + `numero_empenho` + `numero_liquidacao` + `numero_pagamento`

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `data_empenho` | dat | Data de emissão do empenho | certeza |
| 7 | `numero_empenho` | txt | Número do empenho | certeza |
| 8 | `numero_liquidacao` | txt | Sequencial da liquidação | provavel |
| 9 | `numero_pagamento` | txt | Número do pagamento | provavel |
| 10 | `competencia` | cmp | Competência da remessa | certeza |
| 11 | `tipo_folha` | txt | Tipo da folha (AN, AD, AC) | provavel |
| 12 | `data_folha` | dat | Data da folha | provavel |
| 13 | `competencia_folha` | cmp | Competência da folha | provavel |
| 14 | `valor` | num | Valor pago | provavel |

### XD - Pagamento Extraorçamentário (registro 614)

Pagamentos de contas extraorçamentárias (consignações, retenções) por conta bancária.

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `conta_extra` | txt | Código da conta extraorçamentária | chute |
| 7 | `banco` | txt | Banco | provavel |
| 8 | `agencia` | txt | Agência | provavel |
| 9 | `conta` | txt | Conta bancária | provavel |
| 10 | `numero` | txt | Número do lançamento | chute |
| 11 | `competencia` | cmp | Competência da remessa | certeza |
| 12 | `numero_documento` | txt | Número do documento | chute |
| 13 | `data` | dat | Data do pagamento | provavel |
| 14 | `valor` | num | Valor | provavel |
| 15 | `valor_15` | num | Valor não identificado | chute |
| 16 | `tipo_documento` | txt | Tipo de documento | chute |
| 17 | `nome_credor` | txt | Nome do beneficiário | provavel |
| 18 | `competencia_referencia` | cmp | Competência de referência | chute |
| 19 | `valor_19` | num | Valor não identificado | chute |
| 20 | `valor_20` | num | Valor não identificado | chute |

## Grupo .DCR

### AT - Anulação de Receita Orçamentária (registro 402)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `conta_receita` | txt | Conta de receita | certeza |
| 7 | `exercicio_fonte` | txt | Identificador da fonte | provavel |
| 8 | `fonte_recurso` | txt | Fonte de recursos | certeza |
| 9 | `numero_lancamento` | txt | Lançamento anulado | provavel |
| 10 | `data_lancamento` | dat | Data do lançamento original | provavel |
| 11 | `data_anulacao` | dat | Data da anulação | provavel |
| 12 | `competencia` | cmp | Competência da remessa | certeza |
| 13 | `tipo` | txt | Tipo (T) | chute |
| 14 | `valor` | num | Valor anulado | certeza |
| 15 | `motivo` | txt | Motivo | certeza |
| 16 | `campo16` | txt | Campo final | chute |

### AX - Anulação de Receita Extraorçamentária (registro 404)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `conta_extra` | txt | Conta extraorçamentária | chute |
| 7 | `numero_lancamento` | txt | Lançamento anulado | provavel |
| 8 | `data_lancamento` | dat | Data do lançamento original | provavel |
| 9 | `data_anulacao` | dat | Data da anulação | provavel |
| 10 | `competencia` | cmp | Competência da remessa | certeza |
| 11 | `tipo` | txt | Tipo (T) | chute |
| 12 | `valor` | num | Valor anulado | certeza |
| 13 | `motivo` | txt | Motivo | certeza |

### TR - Receita Orçamentária (lançamentos) (registro 401)

Lançamentos de arrecadação da receita orçamentária.

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `conta_receita` | txt | Conta de receita (natureza) | certeza |
| 7 | `exercicio_fonte` | txt | Identificador da fonte (1/2) | provavel |
| 8 | `fonte_recurso` | txt | Fonte de recursos | certeza |
| 9 | `numero_lancamento` | txt | Número do lançamento | provavel |
| 10 | `data` | dat | Data do lançamento | certeza |
| 11 | `competencia` | cmp | Competência da remessa | certeza |
| 12 | `valor` | num | Valor arrecadado | certeza |
| 13 | `historico` | txt | Histórico | certeza |
| 14 | `tipo_credor` | txt | Tipo de pessoa (1=PJ, 2=PF) | provavel |
| 15 | `cpf_cnpj` | txt | CPF/CNPJ do depositante | provavel |
| 16 | `nome` | txt | Nome do depositante | provavel |
| 17 | `banco` | txt | Banco | provavel |
| 18 | `agencia` | txt | Agência | provavel |
| 19 | `conta` | txt | Conta bancária | provavel |
| 20 | `numero_documento` | txt | Documento bancário | chute |
| 21 | `data_documento` | dat | Data do documento | chute |
| 22 | `tipo_documento` | txt | Tipo de documento | chute |
| 23 | `campo23` | txt | Campo final | chute |

### TX - Receita Extraorçamentária (lançamentos) (registro 403)

Ingressos extraorçamentários (retenções/consignações) - o código da conta casa com DP.conta_extra.

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `conta_extra` | txt | Código da conta extraorçamentária | chute |
| 7 | `numero_lancamento` | txt | Número do lançamento | provavel |
| 8 | `data` | dat | Data | certeza |
| 9 | `competencia` | cmp | Competência da remessa | certeza |
| 10 | `valor` | num | Valor | certeza |
| 11 | `historico` | txt | Histórico | certeza |
| 12 | `tipo_credor` | txt | Tipo de pessoa | chute |
| 13 | `cpf_cnpj_ou_tipo` | txt | CPF/CNPJ ou descrição do tipo | chute |
| 14 | `nome` | txt | Nome | provavel |
| 15 | `banco` | txt | Banco | provavel |
| 16 | `agencia` | txt | Agência | provavel |
| 17 | `conta` | txt | Conta bancária | provavel |
| 18 | `numero_documento` | txt | Documento | chute |
| 19 | `data_documento` | dat | Data do documento | chute |
| 20 | `tipo_documento` | txt | Tipo de documento | chute |

## Grupo .LCO

### CO - Contratos (registro 511)

Chave sugerida: `numero_contrato`

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `cpf_gestor` | txt | CPF do gestor/signatário | chute |
| 4 | `numero_contrato` | txt | Número do contrato | certeza |
| 5 | `data_contrato` | dat | Data do contrato | provavel |
| 6 | `tipo` | txt | Tipo (O) | chute |
| 7 | `campo07` | txt | Código não identificado (AR) | chute |
| 8 | `cpf_08` | txt | CPF não identificado | chute |
| 9 | `numero_licitacao` | txt | Número da licitação | provavel |
| 10 | `data_licitacao` | dat | Data da licitação | provavel |
| 11 | `inicio_vigencia` | dat | Início da vigência | provavel |
| 12 | `fim_vigencia` | dat | Fim da vigência | provavel |
| 13 | `objeto` | txt | Objeto | certeza |
| 14 | `valor` | num | Valor | provavel |
| 15 | `campo15` | txt | Campo não identificado | chute |
| 16 | `campo16` | txt | Campo não identificado | chute |
| 17 | `campo17` | txt | Campo não identificado | chute |
| 18 | `campo18` | txt | Campo não identificado | chute |
| 19 | `competencia` | cmp | Competência da remessa | certeza |

### CT - Contratados (registro 513)

Chave sugerida: `numero_contrato`

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `cpf_gestor` | txt | CPF do gestor/signatário | chute |
| 4 | `numero_contrato` | txt | Número do contrato | certeza |
| 5 | `data_contrato` | dat | Data do contrato | provavel |
| 6 | `tipo_pessoa` | txt | Tipo (1=PJ, 2=PF) | provavel |
| 7 | `cpf_cnpj` | txt | CPF/CNPJ do contratado | certeza |
| 8 | `nome` | txt | Nome do contratado | certeza |
| 9 | `endereco` | txt | Endereço | certeza |
| 10 | `telefone` | txt | Telefone | provavel |
| 11 | `cep` | txt | CEP | certeza |
| 12 | `cidade` | txt | Cidade | certeza |
| 13 | `uf` | txt | UF | certeza |
| 14 | `competencia` | cmp | Competência da remessa | certeza |

### DL - Dotações da Licitação (registro 507)

Chave sugerida: `numero_licitacao`

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `data_licitacao` | dat | Data da licitação | provavel |
| 4 | `numero_licitacao` | txt | Número da licitação | certeza |
| 5 | `exercicio` | txt | Exercício | certeza |
| 6 | `orgao` | txt | Órgão | certeza |
| 7 | `unidade` | txt | Unidade | certeza |
| 8 | `funcao` | txt | Função | certeza |
| 9 | `subfuncao` | txt | Subfunção | certeza |
| 10 | `programa` | txt | Programa | certeza |
| 11 | `tipo_acao` | txt | Tipo de ação | provavel |
| 12 | `acao` | txt | Ação | certeza |
| 13 | `subacao` | txt | Subação | chute |
| 14 | `elemento_despesa` | txt | Natureza da despesa | certeza |
| 15 | `exercicio_fonte` | txt | Identificador da fonte | provavel |
| 16 | `fonte_recurso` | txt | Fonte de recursos | certeza |
| 17 | `valor` | num | Valor | provavel |
| 18 | `competencia` | cmp | Competência da remessa | certeza |

### LI - Licitações (registro 501)

Chave sugerida: `numero_licitacao`

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `data_licitacao` | dat | Data da licitação | provavel |
| 4 | `numero_licitacao` | txt | Número da licitação | certeza |
| 5 | `modalidade` | txt | Modalidade (código) | provavel |
| 6 | `objeto` | txt | Objeto | certeza |
| 7 | `valor_estimado` | num | Valor estimado | provavel |
| 8 | `cpf_responsavel` | txt | CPF do responsável (pregoeiro/presidente) | chute |
| 9 | `nome_responsavel` | txt | Nome do responsável | chute |
| 10 | `cpf_ordenador` | txt | CPF do ordenador/gestor | chute |
| 11 | `data_10` | dat | Data não identificada (nomeação?) | chute |
| 12 | `campo12` | txt | Campo não identificado | chute |
| 13 | `cpf_13` | txt | CPF não identificado | chute |
| 14 | `nome_14` | txt | Nome não identificado | chute |
| 15 | `data_abertura` | dat | Data de abertura | chute |
| 16 | `hora_abertura` | txt | Hora de abertura | chute |
| 17 | `data_publicacao` | dat | Data de publicação | chute |
| 18 | `campo18` | txt | Campo não identificado | chute |
| 19 | `campo19` | txt | Campo não identificado | chute |
| 20 | `valor_20` | num | Valor | chute |
| 21 | `campo21` | txt | Campo não identificado | chute |
| 22 | `campo22` | txt | Campo não identificado | chute |
| 23 | `campo23` | txt | Campo não identificado | chute |
| 24 | `campo24` | txt | Campo não identificado | chute |
| 25 | `competencia` | cmp | Competência da remessa | certeza |

### LT - Licitantes (registro 505)

Chave sugerida: `numero_licitacao`

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `data_licitacao` | dat | Data da licitação | provavel |
| 4 | `numero_licitacao` | txt | Número da licitação | certeza |
| 5 | `tipo_pessoa` | txt | Tipo (1=PJ, 2=PF) | provavel |
| 6 | `cpf_cnpj` | txt | CPF/CNPJ do licitante | certeza |
| 7 | `nome` | txt | Nome do licitante | certeza |
| 8 | `endereco` | txt | Endereço | certeza |
| 9 | `telefone` | txt | Telefone | provavel |
| 10 | `cep` | txt | CEP | certeza |
| 11 | `cidade` | txt | Cidade | certeza |
| 12 | `uf` | txt | UF | certeza |
| 13 | `competencia` | cmp | Competência da remessa | certeza |

### PE - Publicações da Licitação (registro 502)

Chave sugerida: `numero_licitacao`

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `data_licitacao` | dat | Data da licitação | provavel |
| 4 | `numero_licitacao` | txt | Número da licitação | certeza |
| 5 | `tipo_publicacao` | txt | Tipo de publicação | chute |
| 6 | `veiculo_codigo` | txt | Código do veículo | chute |
| 7 | `veiculo` | txt | Veículo de publicação | certeza |
| 8 | `data_publicacao` | dat | Data da publicação | certeza |
| 9 | `competencia` | cmp | Competência da remessa | certeza |

### TL - Itens da Licitação (registro 506)

Chave sugerida: `numero_licitacao`

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `data_licitacao` | dat | Data da licitação | provavel |
| 4 | `numero_licitacao` | txt | Número da licitação | certeza |
| 5 | `item` | txt | Número do item | provavel |
| 6 | `descricao` | txt | Descrição do item | certeza |
| 7 | `unidade_medida` | txt | Unidade | certeza |
| 8 | `quantidade` | num | Quantidade | certeza |
| 9 | `valor_unitario` | num | Valor unitário | certeza |
| 10 | `valor_total` | num | Valor total | certeza |
| 11 | `tipo_pessoa_vencedor` | txt | Tipo do vencedor | chute |
| 12 | `cpf_cnpj_vencedor` | txt | CPF/CNPJ do vencedor | provavel |
| 13 | `competencia` | cmp | Competência da remessa | certeza |

## Grupo .ORC

### EP - Orçamento - Dotações da Despesa (registro 204)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `funcao` | txt | Função | certeza |
| 7 | `subfuncao` | txt | Subfunção | certeza |
| 8 | `programa` | txt | Programa | certeza |
| 9 | `tipo_acao` | txt | Tipo de ação | provavel |
| 10 | `acao` | txt | Ação | certeza |
| 11 | `subacao` | txt | Subação | chute |
| 12 | `elemento_despesa` | txt | Natureza da despesa | certeza |
| 13 | `exercicio_fonte` | txt | Identificador da fonte | provavel |
| 14 | `fonte_recurso` | txt | Fonte de recursos | certeza |
| 15 | `valor` | num | Valor da dotação | provavel |

### PA - Orçamento - Programas/Ações (registro 203)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `funcao` | txt | Função | certeza |
| 7 | `subfuncao` | txt | Subfunção | certeza |
| 8 | `programa` | txt | Programa | certeza |
| 9 | `tipo_acao` | txt | Tipo de ação | provavel |
| 10 | `acao` | txt | Ação | certeza |
| 11 | `subacao` | txt | Subação | chute |
| 12 | `tipo` | txt | Tipo (F) | chute |
| 13 | `nome_acao` | txt | Nome da ação | provavel |
| 14 | `descricao_acao` | txt | Descrição da ação | provavel |
| 15 | `valor` | num | Valor | provavel |

### RE - Orçamento - Previsão da Receita (registro 201)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `conta_receita` | txt | Conta de receita | certeza |
| 7 | `exercicio_fonte` | txt | Identificador da fonte | provavel |
| 8 | `fonte_recurso` | txt | Fonte de recursos | certeza |
| 9 | `descricao` | txt | Descrição da receita | certeza |
| 10 | `valor` | num | Valor previsto | provavel |

## Grupo .OSE

### MO - Medições de Obras (registro 902)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `data_empenho` | dat | Data do empenho | provavel |
| 7 | `numero_empenho` | txt | Número do empenho | provavel |
| 8 | `data_obra` | dat | Data da obra | chute |
| 9 | `tipo` | txt | Tipo (O/S) | chute |
| 10 | `numero_obra` | txt | Número da obra | provavel |
| 11 | `numero_medicao` | txt | Número da medição | chute |
| 12 | `valor` | num | Valor da medição | provavel |
| 13 | `data_medicao` | dat | Data da medição | chute |
| 14 | `campo14` | txt | Campo não identificado | chute |
| 15 | `campo15` | txt | Campo não identificado | chute |
| 16 | `campo16` | txt | Campo não identificado | chute |
| 17 | `campo17` | txt | Campo não identificado | chute |
| 18 | `campo18` | txt | Campo não identificado | chute |
| 19 | `campo19` | txt | Campo não identificado | chute |
| 20 | `campo20` | txt | Campo não identificado | chute |
| 21 | `campo21` | txt | Campo não identificado | chute |
| 22 | `competencia` | cmp | Competência da remessa | certeza |

### OS - Obras e Serviços de Engenharia (registro 901)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `data` | dat | Data | chute |
| 4 | `tipo` | txt | Tipo (O/S) | chute |
| 5 | `numero_obra` | txt | Número da obra | provavel |
| 6 | `exercicio` | txt | Exercício | certeza |
| 7 | `orgao` | txt | Órgão | certeza |
| 8 | `unidade` | txt | Unidade | certeza |
| 9 | `objeto` | txt | Objeto | certeza |
| 10 | `campo10` | txt | Campo não identificado | chute |
| 11 | `campo11` | txt | Campo não identificado | chute |
| 12 | `campo12` | txt | Campo não identificado | chute |
| 13 | `valor` | num | Valor | chute |
| 14 | `campo14` | txt | Campo não identificado | chute |
| 15 | `campo15` | txt | Campo não identificado | chute |
| 16 | `campo16` | txt | Campo não identificado | chute |
| 17 | `campo17` | txt | Campo não identificado | chute |
| 18 | `campo18` | txt | Campo não identificado | chute |
| 19 | `campo19` | txt | Campo não identificado | chute |
| 20 | `campo20` | txt | Campo não identificado | chute |
| 21 | `campo21` | txt | Campo não identificado | chute |
| 22 | `campo22` | txt | Campo não identificado | chute |
| 23 | `campo23` | txt | Campo não identificado | chute |
| 24 | `campo24` | txt | Campo não identificado | chute |
| 25 | `campo25` | txt | Campo não identificado | chute |
| 26 | `campo26` | txt | Campo não identificado | chute |
| 27 | `campo27` | txt | Campo não identificado | chute |
| 28 | `campo28` | txt | Campo não identificado | chute |
| 29 | `campo29` | txt | Campo não identificado | chute |
| 30 | `campo30` | txt | Campo não identificado | chute |
| 31 | `campo31` | txt | Campo não identificado | chute |
| 32 | `campo32` | txt | Campo não identificado | chute |

### SO - Situação de Obras (registro 903)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `data_obra` | dat | Data da obra | chute |
| 4 | `tipo` | txt | Tipo (O/S) | chute |
| 5 | `numero_obra` | txt | Número da obra | provavel |
| 6 | `data` | dat | Data da situação | chute |
| 7 | `campo07` | txt | Código | chute |
| 8 | `cpf_responsavel` | txt | CPF do responsável técnico | chute |
| 9 | `nome_responsavel` | txt | Nome do responsável | chute |
| 10 | `telefone` | txt | Telefone | chute |
| 11 | `campo11` | txt | Campo | chute |
| 12 | `situacao` | txt | Situação da obra | provavel |
| 13 | `campo13` | txt | Campo não identificado | chute |
| 14 | `campo14` | txt | Campo não identificado | chute |
| 15 | `campo15` | txt | Campo não identificado | chute |

## Grupo .OUT

### DA - Diárias (registro 805)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `exercicio` | txt | Exercício orçamentário (AAAA00) | certeza |
| 4 | `orgao` | txt | Código do órgão | certeza |
| 5 | `unidade` | txt | Código da unidade orçamentária | certeza |
| 6 | `cpf_beneficiario` | txt | CPF do beneficiário | provavel |
| 7 | `numero_ato` | txt | Número do ato/portaria | provavel |
| 8 | `data_ato` | dat | Data do ato | provavel |
| 9 | `competencia` | cmp | Competência da remessa | certeza |
| 10 | `finalidade` | txt | Finalidade | certeza |
| 11 | `cidade_destino` | txt | Cidade de destino | certeza |
| 12 | `uf_destino` | txt | UF de destino | certeza |
| 13 | `data_inicio` | dat | Data de início | provavel |
| 14 | `data_fim` | dat | Data de fim | provavel |
| 15 | `quantidade_diarias` | num | Quantidade de diárias | provavel |
| 16 | `valor_unitario` | num | Valor unitário | provavel |
| 17 | `valor_total` | num | Valor total | provavel |
| 18 | `data_empenho` | dat | Data do empenho | provavel |
| 19 | `numero_empenho` | txt | Número do empenho | provavel |
| 20 | `numero_liquidacao` | txt | Sequencial da liquidação | chute |
| 21 | `numero_pagamento` | txt | Número do pagamento | chute |

## Grupo .PAT

### BN - Bens - Vínculo com Empenho (registro 983)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `numero_bem` | txt | Número do bem | provavel |
| 4 | `exercicio` | txt | Exercício | certeza |
| 5 | `orgao` | txt | Órgão | certeza |
| 6 | `unidade` | txt | Unidade | certeza |
| 7 | `data_empenho` | dat | Data do empenho | provavel |
| 8 | `numero_empenho` | txt | Número do empenho | provavel |
| 9 | `competencia` | cmp | Competência da remessa | certeza |

### BO - Bens - Incorporações (registro 981)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `numero_bem` | txt | Número do bem (tombamento) | provavel |
| 4 | `data` | dat | Data | provavel |
| 5 | `competencia` | cmp | Competência da remessa | certeza |
| 6 | `exercicio` | txt | Exercício | certeza |
| 7 | `orgao` | txt | Órgão | certeza |
| 8 | `unidade` | txt | Unidade | certeza |
| 9 | `cpf_responsavel` | txt | CPF do responsável | chute |
| 10 | `campo10` | txt | Código | chute |
| 11 | `campo11` | txt | Código | chute |
| 12 | `documento` | txt | Documento/portaria | chute |

### RP - Bens - Depreciação / Reavaliação (registro 984)

| # | Coluna | Tipo | Descrição | Confiança |
|---|---|---|---|---|
| 1 | `registro` | txt | Código do tipo de registro (identifica o leiaute) | certeza |
| 2 | `municipio` | txt | Código do município no TCE-CE | certeza |
| 3 | `numero_bem` | txt | Número do bem | provavel |
| 4 | `data` | dat | Data | provavel |
| 5 | `tipo` | txt | Tipo | chute |
| 6 | `competencia` | cmp | Competência da remessa | certeza |
| 7 | `exercicio` | txt | Exercício | certeza |
| 8 | `orgao` | txt | Órgão | certeza |
| 9 | `unidade` | txt | Unidade | certeza |
| 10 | `cpf_responsavel` | txt | CPF do responsável | chute |
| 11 | `campo11` | txt | Código | chute |
| 12 | `campo12` | txt | Código | chute |
| 13 | `documento` | txt | Documento | chute |
| 14 | `valor` | num | Valor | provavel |
| 15 | `historico` | txt | Histórico | certeza |

