# Dicionário de Dados — v3

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md).

## Tabela `utilizador`

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador único |
| `p_nome` | `VARCHAR(50)` | NOT NULL | Primeiro nome |
| `sb_nome` | `VARCHAR(100)` | NOT NULL | Sobrenome |
| `data_nascimento` | `DATE` | NOT NULL | Data de nascimento |
| `email` | `VARCHAR(150)` | UNIQUE, NOT NULL | E-mail de acesso |
| `palavra_passe_hash` | `VARCHAR(255)` | NOT NULL | Hash BCrypt |
| `role` | `VARCHAR(20)` | NOT NULL, DEFAULT 'LEITOR' | ENUM('LEITOR','ADMIN') |
| `criado_em` | `TIMESTAMP` | NOT NULL | Data de criação |
| `atualizado_em` | `TIMESTAMP` | NULL | Última alteração |
| `removido_em` | `TIMESTAMP` | NULL | Soft delete |

---

## Tabela `revista`

Título/marca da publicação (ex.: "FITITEL"). Agrupa várias edições.

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador |
| `nome` | `VARCHAR(100)` | NOT NULL | Nome da revista/marca |
| `criado_em` | `TIMESTAMP` | NOT NULL | Data de criação |
| `atualizado_em` | `TIMESTAMP` | NULL | Última alteração |
| `removido_em` | `TIMESTAMP` | NULL | Soft delete |

---

## Tabela `edicao`

A unidade efectivamente vendida e lida — o que antes era chamado de "revista" em versões anteriores da documentação.

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador |
| `id_revista` | `BIGINT` | FK (revista.id), NOT NULL | Revista a que pertence |
| `tema` | `VARCHAR(150)` | NOT NULL | Tema central da edição |
| `lema` | `VARCHAR(200)` | NULL | Frase de efeito |
| `descricao` | `TEXT` | NULL | Descrição longa |
| `preco` | `BIGINT` | NOT NULL, DEFAULT 0 | Preço em cêntimos (kwanza). `0` quando `e_gratis = true` |
| `paginas` | `INT` | NOT NULL, DEFAULT 0 | Preenchido automaticamente após o processamento do flipbook |
| `numero` | `INT` | NOT NULL | Número da edição |
| `data_lancamento` | `DATE` | NOT NULL | Data de publicação |
| `e_gratis` | `BOOLEAN` | NOT NULL, DEFAULT FALSE | Se `true`, toda a edição é gratuita |
| `criado_em` | `TIMESTAMP` | NOT NULL | Data de criação |
| `atualizado_em` | `TIMESTAMP` | NULL | Última alteração |
| `removido_em` | `TIMESTAMP` | NULL | Soft delete |

**Nota:** `preco` em cêntimos evita problemas de arredondamento em relatórios de receita — herdado de análise anterior, mantido por ser boa prática, não por decisão explícita da reunião.

---

## Tabela `pagamento`

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador |
| `id_utilizador` | `BIGINT` | FK (utilizador.id), NOT NULL | Comprador |
| `id_edicao` | `BIGINT` | FK (edicao.id), NOT NULL | Edição comprada |
| `valor` | `BIGINT` | NOT NULL | Valor pago, em cêntimos |
| `status` | `VARCHAR(20)` | NOT NULL | ENUM('PENDENTE','PROCESSANDO','PAGO','REJEITADO','EXPIRADO') |
| `metodo_pagamento` | `VARCHAR(20)` | NOT NULL | ENUM('MCX_EXPRESS','REFERENCIA') |
| `referencia_externa` | `VARCHAR(100)` | NULL, UNIQUE | Referência/identificador devolvido pelo GPO (Entidade+Referência, ou id de transacção Express) |
| `data_pagamento` | `TIMESTAMP` | NULL | Momento em que o GPO confirmou o pagamento |
| `criado_em` | `TIMESTAMP` | NOT NULL | Data de criação |
| `atualizado_em` | `TIMESTAMP` | NULL | Última alteração de estado |

**Nota:** sem `removido_em` — registos financeiros não são eliminados.

---

## Tabela `editor_edicao`

Associação entre utilizadores e edições, para atribuir responsabilidade editorial sem criar um terceiro `role`.

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador |
| `id_edicao` | `BIGINT` | FK (edicao.id), NOT NULL | Edição |
| `id_utilizador` | `BIGINT` | FK (utilizador.id), NOT NULL | Utilizador atribuído como editor — **assumido `role = ADMIN`, a confirmar** |
| `criado_em` | `TIMESTAMP` | NOT NULL | Data da atribuição |

`UNIQUE (id_edicao, id_utilizador)` — não faz sentido atribuir o mesmo utilizador duas vezes à mesma edição.

---

## Tabela `edicao_tag`

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador |
| `id_edicao` | `BIGINT` | FK (edicao.id), NOT NULL | Edição etiquetada |
| `tag` | `VARCHAR(50)` | NOT NULL | Texto da etiqueta (ex.: "inteligência artificial") |
| `criado_em` | `TIMESTAMP` | NOT NULL | Data de criação |

`UNIQUE (id_edicao, tag)` — evita etiquetas duplicadas na mesma edição.

---

## Tabela `edicao_artigo`

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador |
| `id_edicao` | `BIGINT` | FK (edicao.id), NOT NULL | Edição a que pertence |
| `titulo` | `VARCHAR(200)` | NOT NULL | Título do artigo |
| `descricao` | `TEXT` | NULL | Resumo/descrição |
| `page` | `INT` | NOT NULL | Página do flipbook onde o artigo começa |
| `ordem` | `INT` | NOT NULL, DEFAULT 0 | Ordem de apresentação no índice da edição |
| `criado_em` | `TIMESTAMP` | NOT NULL | Data de criação |
| `atualizado_em` | `TIMESTAMP` | NULL | Última alteração |
| `removido_em` | `TIMESTAMP` | NULL | Soft delete |

**Nota:** não existe campo de autor — ponto em aberto, ver changelog.

---

## Tabela `favorito`

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador |
| `id_utilizador` | `BIGINT` | FK (utilizador.id), NOT NULL | Quem marcou |
| `id_edicao` | `BIGINT` | FK (edicao.id), NOT NULL | Edição marcada |
| `criado_em` | `TIMESTAMP` | NOT NULL | Data em que marcou como favorita |

`UNIQUE (id_utilizador, id_edicao)`.

---

## Tabela `log`

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador |
| `nome_utilizador` | `VARCHAR(150)` | NOT NULL | Nome de quem executou a acção (cópia — sobrevive à eliminação da conta) |
| `email_utilizador` | `VARCHAR(150)` | NOT NULL | E-mail de quem executou a acção |
| `accao` | `VARCHAR(50)` | NOT NULL | Ex.: `criou`, `editou`, `removeu`, `aprovou_pagamento` |
| `target_type` | `VARCHAR(50)` | NOT NULL | Ex.: `edicao`, `pagamento`, `comentario` |
| `target_id` | `BIGINT` | NOT NULL | Identificador do recurso afectado |
| `criado_em` | `TIMESTAMP` | NOT NULL | Momento da acção — **registo imutável**, sem `atualizado_em`/`removido_em` |

---

## Tabela `flipbook_edicao`

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador |
| `id_edicao` | `BIGINT` | FK (edicao.id), UNIQUE, NOT NULL | Edição associada (1:1) |
| `estado_processamento` | `VARCHAR(20)` | NOT NULL, DEFAULT 'PROCESSANDO' | ENUM('PROCESSANDO','PRONTO','FALHOU') — **campo proposto, a confirmar** |
| `gerado_em` | `TIMESTAMP` | NULL | Momento em que o processamento terminou com sucesso — **campo proposto, a confirmar** |
| `criado_em` | `TIMESTAMP` | NOT NULL | Data de criação |
| `atualizado_em` | `TIMESTAMP` | NULL | Última alteração de estado |

---

## Tabela `flipbook_pagina`

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador |
| `id_flipbook` | `BIGINT` | FK (flipbook_edicao.id), NOT NULL | Flipbook a que pertence |
| `paginas` | `INT` | NOT NULL | Número da página no PDF original |
| `tipo` | `VARCHAR(20)` | NOT NULL, DEFAULT 'CONTEUDO' | ENUM('CAPA','CONTEUDO') — controla, entre outras coisas, apresentação no frontend |
| `url_imagem` | `VARCHAR(500)` | NOT NULL | Caminho/URL da imagem gerada (WebP), no object storage |
| `ordem` | `INT` | NOT NULL | Ordem de exibição no flipbook |
| `criado_em` | `TIMESTAMP` | NOT NULL | Data de criação |
| `atualizado_em` | `TIMESTAMP` | NULL | Última alteração |
| `removido_em` | `TIMESTAMP` | NULL | Soft delete |

---

## Tabela `flipbook_comentario`

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador |
| `id_pagina` | `BIGINT` | FK (flipbook_pagina.id), NOT NULL | Página comentada |
| `id_utilizador` | `BIGINT` | FK (utilizador.id), NOT NULL | Autor do comentário |
| `texto` | `TEXT` | NOT NULL | Conteúdo do comentário |
| `likes` | `INT` | NOT NULL, DEFAULT 0 | Contador de gostos |
| `x` | `DECIMAL(5,2)` | NOT NULL | Posição horizontal, em percentagem da imagem (0–100) |
| `y` | `DECIMAL(5,2)` | NOT NULL | Posição vertical, em percentagem da imagem (0–100) |
| `criado_em` | `TIMESTAMP` | NOT NULL | Data de criação |
| `atualizado_em` | `TIMESTAMP` | NULL | Última alteração |
| `removido_em` | `TIMESTAMP` | NULL | Soft delete |

**Nota:** não existe `id_pai` — este modelo substitui o anterior de comentários com resposta aninhada. Um "like" é a única forma de interacção sobre um comentário existente.
