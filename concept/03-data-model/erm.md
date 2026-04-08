# Modelo Entidade-Relacionamento (MER)

## Entidades e atributos

**Utilizador** (<u>id</u>, p_nome, sb_nome, data_nascimento, email, género, palavra-passe, role, createdAt, updatedAt, deletedAt)

**Revista** (<u>id</u>, nome, ano_lançamento, url, preço, quantidade_páginas, createdAt, updatedAt, deletedAt)

**Edição** (<u>id</u>, número, tema, lema, createdAt, updatedAt, deletedAt)

**Autor_Revista** (<u>id</u>, id_revista, p_nome_autor, sb_nome_autor, createdAt, updatedAt, deletedAt)

**Página** (<u>id</u>, numero_página, nome_projeto, createdAt, updatedAt, deletedAt)

**Pagamento** (<u>id</u>, método_pagamento, data_pagamento, url_comprovativo, estado_pagamento, token_acesso, createdAt, updatedAt, deletedAt)

**Comentário** (<u>id</u>, texto, data_efetividade, createdAt, updatedAt, deletedAt)

## Relacionamentos e cardinalidades

- **Utilizador 1 : N Pagamento** – Um utilizador pode efectuar vários pagamentos.
- **Pagamento N : 1 Revista** – Muitos pagamentos podem referir a mesma revista.
- **Revista N : 1 Edição** – Uma edição pode conter várias revistas; cada revista pertence a uma única edição.
- **Revista 1 : N Página** – Uma revista é composta por muitas páginas.
- **Página 1 : N Comentário** – Uma página pode receber vários comentários.
- **Utilizador 1 : N Comentário** – Um utilizador escreve vários comentários.
- **Comentário (pai) 1 : N Comentário (filho)** – Relacionamento recursivo que permite respostas.
- **Revista 1 : N Autor_Revista** – Uma revista pode ter vários autores.
- **Utilizador (com role ADMIN) 1 : N Revista** – Um administrador (que é um utilizador com papel especial) faz o upload de várias revistas.

## Notas

- O campo `role` na entidade `Utilizador` pode ser `LEITOR` ou `ADMIN`. Não existe uma entidade separada para administrador.
- Todas as entidades incluem campos de auditoria (`createdAt`, `updatedAt`, `deletedAt`), conforme descrito no documento sobre auditoria e soft delete.
- O relacionamento recursivo de `Comentário` permite respostas aninhadas (fórum de discussão).