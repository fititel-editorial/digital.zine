# Modelo Entidade-Relacionamento (MER) — v3

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md). Este é o modelo decidido em reunião com o colega do frontend — substitui por completo as versões anteriores.

## Entidades e atributos

**Utilizador** (<u>id</u>, p_nome, sb_nome, data_nascimento, email, palavra_passe_hash, role, criado_em, atualizado_em, removido_em)

**Revista** (<u>id</u>, nome, criado_em, atualizado_em, removido_em)

**Edicao** (<u>id</u>, id_revista, tema, lema, descricao, preco, paginas, numero, data_lancamento, e_gratis, criado_em, atualizado_em, removido_em)

**Pagamento** (<u>id</u>, id_utilizador, id_edicao, valor, status, metodo_pagamento, referencia_externa, data_pagamento, criado_em, atualizado_em)

**Editor_Edicao** (<u>id</u>, id_edicao, id_utilizador, criado_em)

**Edicao_Tag** (<u>id</u>, id_edicao, tag, criado_em)

**Edicao_Artigo** (<u>id</u>, id_edicao, titulo, descricao, page, ordem, criado_em, atualizado_em, removido_em)

**Favorito** (<u>id</u>, id_utilizador, id_edicao, criado_em)

**Log** (<u>id</u>, nome_utilizador, email_utilizador, accao, target_type, target_id, criado_em)

**FlipbookEdicao** (<u>id</u>, id_edicao, estado_processamento, gerado_em, criado_em, atualizado_em)

**FlipbookPagina** (<u>id</u>, id_flipbook, paginas, tipo, url_imagem, ordem, criado_em, atualizado_em, removido_em)

**FlipbookComentario** (<u>id</u>, id_pagina, id_utilizador, texto, likes, x, y, criado_em, atualizado_em, removido_em)

## Relacionamentos e cardinalidades

- **Revista 1 : N Edicao** — Uma revista (título/marca, ex.: "FITITEL") agrupa várias edições ao longo do tempo. `Edicao` é a unidade efectivamente vendida e lida.
- **Utilizador 1 : N Pagamento** — Um utilizador pode efectuar vários pagamentos.
- **Pagamento N : 1 Edicao** — Um pagamento refere-se a uma edição específica.
- **Utilizador N : M Edicao** (via **Editor_Edicao**) — Um utilizador pode ser responsável editorial por várias edições; uma edição pode ter vários editores atribuídos. *(assumido restrito a `role = ADMIN` — ver ponto em aberto no changelog)*
- **Edicao 1 : N Edicao_Tag** — Uma edição pode ter várias etiquetas.
- **Edicao 1 : N Edicao_Artigo** — Uma edição é composta por vários artigos, cada um com a página onde começa (`page`) e a ordem de apresentação (`ordem`).
- **Utilizador N : M Edicao** (via **Favorito**) — Um utilizador pode marcar várias edições como favoritas.
- **Edicao 1 : 1 FlipbookEdicao** — Cada edição tem, no máximo, um flipbook associado (gerado a partir do PDF), com o seu próprio estado de processamento.
- **FlipbookEdicao 1 : N FlipbookPagina** — Um flipbook é composto por várias páginas-imagem.
- **FlipbookPagina 1 : N FlipbookComentario** — Uma página do flipbook recebe vários comentários posicionados.
- **Utilizador 1 : N FlipbookComentario** — Um utilizador escreve comentários.
- **Log** — Sem chave estrangeira formal; referencia qualquer entidade através de `target_type` + `target_id` (polimorfismo fraco, resolvido a nível de aplicação).

## Notas

- `Revista` deixou de conter preço, páginas ou data de lançamento — esses campos migraram para `Edicao`, que é agora a unidade de venda. Isto resolve a ambiguidade "Edição vs Revista" identificada antes da reunião.
- `Edicao.e_gratis` substitui qualquer regra de amostra por percentagem — uma edição é, na íntegra, gratuita ou paga. O controlo fino de quais páginas específicas ficam visíveis antes da compra é feito a nível de `FlipbookPagina.tipo` (ver dicionário de dados).
- `Pagamento.status` e `Pagamento.metodo_pagamento` cobrem o fluxo de gateway EMIS/GPO — ver [`04-architecture/security.md`](../04-architecture/security.md).
- `Pagamento` não tem `removido_em` — registos financeiros não são eliminados, nem logicamente.
- `FlipbookComentario` substitui tanto o antigo `ComentarioPagina` como o `ComentarioRevista` de propostas anteriores — é o único modelo de comentário, sem resposta aninhada, com `likes` em vez de discussão em árvore.
- `FlipbookEdicao.estado_processamento` e `gerado_em` são uma proposta minha para tornar a entidade operacional (o MER da reunião só regista `id, id_edicao`) — a confirmar com a equipa.
- Todas as entidades têm `criado_em`; `atualizado_em` e `removido_em` aplicam-se onde faz sentido (não em `Log`, `Editor_Edicao`, `Edicao_Tag` nem `Favorito`, que são registos de associação/evento sem edição posterior).
