# Modelo Relacional (MR)

Após executado o MER e feito o devido mapeamento para o MR, obtivemos os seguintes resultados a nível de tabelas:

**Leitor** (<u>id</u>, p_nome, sb_nome, data_nascimento, email, gênero, palavra-passe, role, createdAt, updatedAt, deletedAt)

**Edição** (<u>id</u>, número, tema, lema, createdAt, updatedAt, deletedAt)

**Revista** (<u>id</u>, nome, ano_lançamento, url, preço, quantidade_páginas, id_edição, id_administrador, createdAt, updatedAt, deletedAt)

**Autor_Revista** (<u>id</u>, nome_autor, id_revista, createdAt, updatedAt, deletedAt)

**Página** (<u>id</u>, numero_página, nome_projeto, id_revista, createdAt, updatedAt, deletedAt)

**Pagamento** (<u>id</u>, método_pagamento, data_pagamento, url_comprovativo, estado_pagamento, token_acesso, id_leitor, id_revista, createdAt, updatedAt, deletedAt)

**Comentário** (<u>id</u>, texto, data_efetividade, id_página, id_leitor, id_comentário_pai, createdAt, updatedAt, deletedAt)

## Notas

- `role` na tabela `Leitor` pode ser `'LEITOR'` ou `'ADMIN'`. O administrador não tem tabela própria.
- `id_administrador` em `Revista` referencia `Leitor(id)` e deve corresponder a um leitor com `role = 'ADMIN'` (regra de negócio).
- `token_acesso` é gerado apenas quando `estado_pagamento = 'APROVADO'`.
- `id_comentário_pai` é uma chave estrangeira para `Comentário(id)`, permitindo respostas.
> Todas as tabelas seguem o padrão de auditoria descrito em [`softdelete-audit.md`](./softdelete-audit.md) 