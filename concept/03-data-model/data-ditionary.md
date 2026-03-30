# Dicionário de Dados

## Tabela `Leitor`

Armazena todos os utilizadores (leitores e administradores).

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador único |
| `p_nome` | `VARCHAR(50)` | NOT NULL | Primeiro nome |
| `sb_nome` | `VARCHAR(100)` | NOT NULL | Sobrenome |
| `email` | `VARCHAR(150)` | UNIQUE, NOT NULL | E‑mail de acesso |
| `genero` | `VARCHAR(20)` | NOT NULL | ENUM('MASCULINO','FEMININO') |
| `palavra_passe` | `VARCHAR(255)` | NOT NULL | Hash BCrypt |
| `data_nasc` | `DATE` | NOT NULL | Data de nascimento |
| `role` | `VARCHAR(20)` | NOT NULL, DEFAULT 'LEITOR' | ENUM('LEITOR','ADMIN') |
| `createdAt` | `TIMESTAMP` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Auditoria |
| `updatedAt` | `TIMESTAMP` | NULL ON UPDATE | Auditoria |
| `deletedAt` | `TIMESTAMP` | NULL | Soft delete |

## Tabela `Revista`

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador único |
| `nome` | `VARCHAR(100)` | NOT NULL | Título da revista |
| `ano_lancamento` | `INT` | NOT NULL | Ano de publicação |
| `url` | `VARCHAR(500)` | NOT NULL | Caminho do PDF |
| `preco` | `DECIMAL(10,2)` | NOT NULL | Preço (0.00 para gratuitas) |
| `qtd_paginas` | `INT` | NOT NULL | Número total de páginas |
| `id_edicao` | `BIGINT` | FK (Edicao.id), NOT NULL | Edição a que pertence |
| `id_admin` | `BIGINT` | FK (Leitor.id), NOT NULL | Administrador que fez upload (role=ADMIN) |
| `createdAt` | `TIMESTAMP` | NOT NULL | Auditoria |
| `updatedAt` | `TIMESTAMP` | NULL | Auditoria |
| `deletedAt` | `TIMESTAMP` | NULL | Soft delete |

## Tabela `Edicao`

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador |
| `numero` | `INT` | NOT NULL | Número da edição |
| `tema` | `VARCHAR(150)` | NOT NULL | Tema central |
| `lema` | `VARCHAR(200)` | NULL | Lema da edição |
| `createdAt` | `TIMESTAMP` | NOT NULL | Auditoria |
| `updatedAt` | `TIMESTAMP` | NULL | Auditoria |
| `deletedAt` | `TIMESTAMP` | NULL | Soft delete |

## Tabela `Autor_Revista`

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador |
| `nome_autor` | `VARCHAR(150)` | NOT NULL | Nome do autor |
| `id_revista` | `BIGINT` | FK (Revista.id), NOT NULL | Revista associada |
| `createdAt` | `TIMESTAMP` | NOT NULL | Auditoria |
| `updatedAt` | `TIMESTAMP` | NULL | Auditoria |
| `deletedAt` | `TIMESTAMP` | NULL | Soft delete |

## Tabela `Pagina`

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador |
| `num_pagina` | `INT` | NOT NULL | Número da página no PDF |
| `nome_projeto` | `VARCHAR(150)` | NULL | Nome do projecto (se houver) |
| `id_revista` | `BIGINT` | FK (Revista.id), NOT NULL | Revista a que pertence |
| `createdAt` | `TIMESTAMP` | NOT NULL | Auditoria |
| `updatedAt` | `TIMESTAMP` | NULL | Auditoria |
| `deletedAt` | `TIMESTAMP` | NULL | Soft delete |

## Tabela `Pagamento`

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador |
| `metodo` | `VARCHAR(30)` | NOT NULL | ENUM('MCX_EXPRESS','TRANSFERENCIA','UNITEL_MONEY') |
| `estado` | `VARCHAR(20)` | NOT NULL | ENUM('PENDENTE','ANALISE','APROVADO','REJEITADO') |
| `url_comprov` | `VARCHAR(500)` | NULL | Link para comprovativo (storage) |
| `token_acesso` | `VARCHAR(255)` | UNIQUE, NULL | Gerado apenas se estado = APROVADO |
| `id_leitor` | `BIGINT` | FK (Leitor.id), NOT NULL | Comprador |
| `id_revista` | `BIGINT` | FK (Revista.id), NOT NULL | Revista comprada |
| `createdAt` | `TIMESTAMP` | NOT NULL | Auditoria |
| `updatedAt` | `TIMESTAMP` | NULL | Auditoria |
| `deletedAt` | `TIMESTAMP` | NULL | Soft delete |

## Tabela `Comentario`

| Campo | Tipo SQL | Restrições | Descrição |
|-------|----------|-------------|------------|
| `id` | `BIGINT` | PK, NOT NULL, AUTO_INCREMENT | Identificador |
| `texto` | `TEXT` | NOT NULL | Conteúdo do comentário |
| `data_efetiv` | `TIMESTAMP` | NOT NULL | Data/hora da publicação |
| `id_pagina` | `BIGINT` | FK (Pagina.id), NOT NULL | Página comentada |
| `id_leitor` | `BIGINT` | FK (Leitor.id), NOT NULL | Autor do comentário |
| `id_pai` | `BIGINT` | FK (Comentario.id), NULL | Auto-relacionamento (resposta) |
| `createdAt` | `TIMESTAMP` | NOT NULL | Auditoria |
| `updatedAt` | `TIMESTAMP` | NULL | Auditoria |
| `deletedAt` | `TIMESTAMP` | NULL | Soft delete |

---
*Todas as tabelas seguem o padrão de auditoria e soft delete para rastreabilidade.*