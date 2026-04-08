# Dicionário de Dados

## Tabela `Utilizador`

Armazena todos os utilizadores da plataforma – sejam leitores comuns ou administradores. A distinção é feita pelo campo `role`.

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador único |
| `p_nome` | `VARCHAR(50)` | NOT NULL | Primeiro nome |
| `sb_nome` | `VARCHAR(100)` | NOT NULL | Sobrenome |
| `email` | `VARCHAR(150)` | UNIQUE, NOT NULL | E‑mail de acesso (utilizado no login) |
| `genero` | `VARCHAR(20)` | NOT NULL | ENUM('MASCULINO','FEMININO') |
| `palavra_passe` | `VARCHAR(255)` | NOT NULL | Hash BCrypt – nunca armazenada em texto plano |
| `data_nasc` | `DATE` | NOT NULL | Data de nascimento (para validação de idade) |
| `role` | `VARCHAR(20)` | NOT NULL, DEFAULT 'LEITOR' | ENUM('LEITOR','ADMIN') |
| `createdAt` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Auditoria – momento da criação |
| `updatedAt` | `TIMESTAMP` | NULL ON UPDATE | Auditoria – última modificação |
| `deletedAt` | `TIMESTAMP` | NULL | Soft delete – preenchido apenas se a conta foi removida |

---

## Tabela `Revista`

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador único |
| `nome` | `VARCHAR(100)` | NOT NULL | Título da revista |
| `ano_lancamento` | `INT` | NOT NULL | Ano de publicação |
| `url` | `VARCHAR(500)` | NOT NULL | Caminho (ou URL) do ficheiro PDF |
| `preco` | `DECIMAL(10,2)` | NOT NULL | Valor da revista (0.00 para edições gratuitas) |
| `qtd_paginas` | `INT` | NOT NULL | Número total de páginas do PDF |
| `id_edicao` | `BIGINT` | FK (Edicao.id), NOT NULL | Edição a que pertence |
| `id_administrador` | `BIGINT` | FK (Utilizador.id), NOT NULL | Administrador que fez o upload (deve ter `role = 'ADMIN'`) |
| `createdAt` | `TIMESTAMP` | NOT NULL | Auditoria |
| `updatedAt` | `TIMESTAMP` | NULL | Auditoria |
| `deletedAt` | `TIMESTAMP` | NULL | Soft delete |

---

## Tabela `Edicao`

Agrupa revistas por edição da FITITEL.

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador |
| `numero` | `INT` | NOT NULL | Número da edição (ex: 12) |
| `tema` | `VARCHAR(150)` | NOT NULL | Tema central daquela edição |
| `lema` | `VARCHAR(200)` | NULL | Frase de efeito ou lema |
| `createdAt` | `TIMESTAMP` | NOT NULL | Auditoria |
| `updatedAt` | `TIMESTAMP` | NULL | Auditoria |
| `deletedAt` | `TIMESTAMP` | NULL | Soft delete |

---

## Tabela `Autor_Revista`

Resolve o relacionamento N:N entre revistas e autores. Cada autor é apenas um nome (sem entidade própria).

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador |
| `nome_autor` | `VARCHAR(150)` | NOT NULL | Nome do autor ou colaborador |
| `id_revista` | `BIGINT` | FK (Revista.id), NOT NULL | Revista associada |
| `createdAt` | `TIMESTAMP` | NOT NULL | Auditoria |
| `updatedAt` | `TIMESTAMP` | NULL | Auditoria |
| `deletedAt` | `TIMESTAMP` | NULL | Soft delete |

---

## Tabela `Pagina`

Cada página de uma revista, com metadados opcionais sobre o projecto nela descrito.

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador |
| `num_pagina` | `INT` | NOT NULL | Número da página no PDF |
| `nome_projeto` | `VARCHAR(150)` | NULL | Nome do projecto tecnológico (se houver) |
| `id_revista` | `BIGINT` | FK (Revista.id), NOT NULL | Revista a que pertence |
| `createdAt` | `TIMESTAMP` | NOT NULL | Auditoria |
| `updatedAt` | `TIMESTAMP` | NULL | Auditoria |
| `deletedAt` | `TIMESTAMP` | NULL | Soft delete |

---

## Tabela `Pagamento`

Regista cada tentativa de compra. O acesso à revista completa só é libertado quando o estado é `APROVADO`.

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador |
| `metodo` | `VARCHAR(30)` | NOT NULL | ENUM('MCX_EXPRESS','TRANSFERENCIA','UNITEL_MONEY') |
| `estado` | `VARCHAR(20)` | NOT NULL | ENUM('PENDENTE','ANALISE','APROVADO','REJEITADO') |
| `url_comprov` | `VARCHAR(500)` | NULL | Link para o comprovativo (armazenado em S3 ou similar) |
| `token_acesso` | `VARCHAR(255)` | UNIQUE, NULL | Gerado apenas quando `estado = 'APROVADO'` |
| `id_utilizador` | `BIGINT` | FK (Utilizador.id), NOT NULL | Comprador |
| `id_revista` | `BIGINT` | FK (Revista.id), NOT NULL | Revista adquirida |
| `createdAt` | `TIMESTAMP` | NOT NULL | Auditoria |
| `updatedAt` | `TIMESTAMP` | NULL | Auditoria |
| `deletedAt` | `TIMESTAMP` | NULL | Soft delete |

---

## Tabela `Comentario`

Comentários dos utilizadores sobre páginas específicas. Suporta respostas aninhadas através do auto‑relacionamento `id_pai`.

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador |
| `texto` | `TEXT` | NOT NULL | Conteúdo do comentário |
| `data_efetiv` | `TIMESTAMP` | NOT NULL | Data/hora da publicação |
| `id_pagina` | `BIGINT` | FK (Pagina.id), NOT NULL | Página comentada |
| `id_utilizador` | `BIGINT` | FK (Utilizador.id), NOT NULL | Autor do comentário |
| `id_pai` | `BIGINT` | FK (Comentario.id), NULL | Auto‑relacionamento – se preenchido, indica que é uma resposta |
| `createdAt` | `TIMESTAMP` | NOT NULL | Auditoria |
| `updatedAt` | `TIMESTAMP` | NULL | Auditoria |
| `deletedAt` | `TIMESTAMP` | NULL | Soft delete |

---

## Nota sobre auditoria e soft delete

Todas as tabelas seguem o mesmo padrão: os campos `createdAt`, `updatedAt` e `deletedAt` permitem rastrear a criação, modificação e eliminação lógica de cada registo. Mais detalhes podem ser encontrados no documento [`auditoria-softdelete.md`](./softdelete-audit.md).