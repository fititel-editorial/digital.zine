# Modelo Relacional (MR)

Após o mapeamento do Modelo Entidade‑Relacionamento, obtivemos as seguintes tabelas. Todas implementam os campos de auditoria (`createdAt`, `updatedAt`, `deletedAt`) e suporte a soft delete, conforme documentado em [`auditoria-softdelete.md`](./softdelete-audit.md).

**Utilizador** (<u>id</u>, p_nome, sb_nome, data_nascimento, email, género, palavra_passe, role, createdAt, updatedAt, deletedAt)

**Edição** (<u>id</u>, número, tema, lema, createdAt, updatedAt, deletedAt)

**Revista** (<u>id</u>, nome, ano_lançamento, url, preço, quantidade_páginas, id_edição, id_administrador, createdAt, updatedAt, deletedAt)

**Autor_Revista** (<u>id</u>, nome_autor, id_revista, createdAt, updatedAt, deletedAt)

**Página** (<u>id</u>, numero_página, nome_projeto, id_revista, createdAt, updatedAt, deletedAt)

**Pagamento** (<u>id</u>, método_pagamento, data_pagamento, url_comprovativo, estado_pagamento, token_acesso, id_utilizador, id_revista, createdAt, updatedAt, deletedAt)

**Comentário** (<u>id</u>, texto, data_efetividade, id_página, id_utilizador, id_comentário_pai, createdAt, updatedAt, deletedAt)

## Chaves estrangeiras e integridade referencial

- `Pagamento.id_utilizador` → `Utilizador.id`
- `Pagamento.id_revista` → `Revista.id`
- `Revista.id_edição` → `Edição.id`
- `Revista.id_administrador` → `Utilizador.id` (deve corresponder a um utilizador com `role = 'ADMIN'`)
- `Página.id_revista` → `Revista.id`
- `Comentário.id_página` → `Página.id`
- `Comentário.id_utilizador` → `Utilizador.id`
- `Comentário.id_comentário_pai` → `Comentário.id`
- `Autor_Revista.id_revista` → `Revista.id`

Todas as chaves estrangeiras utilizam `ON DELETE RESTRICT` – a remoção física é impedida; a eliminação lógica (soft delete) é feita através do campo `deletedAt`. As consultas padrão devem filtrar `deletedAt IS NULL`.

## Notas

- A tabela `Utilizador` substitui a antiga `Leitor`. O campo `role` (`LEITOR` ou `ADMIN`) define o nível de permissão.
- A tabela `Autor_Revista` mantém‑se como tabela de ligação simples, pois a entidade Autor não possui atributos adicionais nem comportamento próprio.
- O campo `token_acesso` em `Pagamento` é gerado apenas quando o estado passa para `APROVADO`; é único e pode ser usado para acesso temporário ao PDF completo.
- O auto‑relacionamento `Comentário.id_comentário_pai` permite respostas aninhadas (comentários filhos).