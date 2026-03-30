# Modelo Entidade-Relacionamento (MER)

## Entidades (atributos)

**Leitor** (<u>id</u>, p_nome, sb_nome, data_nascimento, email, gênero, palavra-passe, role, createdAt, updatedAt, deletedAt)

**Revista** (<u>id</u>, nome, ano_lançamento, url, preço, quantidade_páginas, createdAt, updatedAt, deletedAt)

**Edição** (<u>id</u>, número, tema, lema, createdAt, updatedAt, deletedAt)

**Autor_Revista** (<u>id</u>, nome_autor, createdAt, updatedAt, deletedAt)

**Página** (<u>id</u>, numero_página, nome_projeto, createdAt, updatedAt, deletedAt)

**Pagamento** (<u>id</u>, método_pagamento, data_pagamento, url_comprovativo, estado_pagamento, token_acesso, createdAt, updatedAt, deletedAt)

**Comentário** (<u>id</u>, texto, data_efetividade, createdAt, updatedAt, deletedAt)

## Relacionamentos e Cardinalidades

- **Leitor 1 : N Pagamento** – Um leitor pode ter vários registos de pagamento.
- **Pagamento N : 1 Revista** – Vários pagamentos diferentes podem referenciar a mesma edição.
- **Revista N : 1 Edição** – Uma edição pode conter várias revistas; uma revista pertence a uma edição.
- **Revista 1 : N Página** – Uma revista contém muitas páginas.
- **Página 1 : N Comentário** – Uma página recebe vários comentários.
- **Leitor 1 : N Comentário** – Um leitor escreve vários comentários.
- **Comentário (Pai) 1 : N Comentário (Filho)** – Relacionamento unário/recursivo (respostas).
- **Revista 1 : N Autor_Revista** – Uma revista pode ter muitos autores.
- **Leitor (com role ADMIN) 1 : N Revista** – Um administrador faz o upload de várias revistas.

## Notas

- O papel de **Administrador** é definido pelo atributo `role` na entidade `Leitor` (valores: `LEITOR` ou `ADMIN`). Não existe entidade separada.
- Todas as entidades incluem campos de auditoria (`createdAt`, `updatedAt`, `deletedAt`) para rastreabilidade e suporte a soft delete.
- O relacionamento recursivo de `Comentário` permite respostas aninhadas.