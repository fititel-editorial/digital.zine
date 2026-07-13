# Modelo Relacional (MR) — v3

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md).

**utilizador** (<u>id</u>, p_nome, sb_nome, data_nascimento, email, palavra_passe_hash, role, criado_em, atualizado_em, removido_em)

**revista** (<u>id</u>, nome, criado_em, atualizado_em, removido_em)

**edicao** (<u>id</u>, id_revista, tema, lema, descricao, preco, paginas, numero, data_lancamento, e_gratis, criado_em, atualizado_em, removido_em)

**pagamento** (<u>id</u>, id_utilizador, id_edicao, valor, status, metodo_pagamento, referencia_externa, data_pagamento, criado_em, atualizado_em)

**editor_edicao** (<u>id</u>, id_edicao, id_utilizador, criado_em)

**edicao_tag** (<u>id</u>, id_edicao, tag, criado_em)

**edicao_artigo** (<u>id</u>, id_edicao, titulo, descricao, page, ordem, criado_em, atualizado_em, removido_em)

**favorito** (<u>id</u>, id_utilizador, id_edicao, criado_em)

**log** (<u>id</u>, nome_utilizador, email_utilizador, accao, target_type, target_id, criado_em)

**flipbook_edicao** (<u>id</u>, id_edicao, estado_processamento, gerado_em, criado_em, atualizado_em)

**flipbook_pagina** (<u>id</u>, id_flipbook, paginas, tipo, url_imagem, ordem, criado_em, atualizado_em, removido_em)

**flipbook_comentario** (<u>id</u>, id_pagina, id_utilizador, texto, likes, x, y, criado_em, atualizado_em, removido_em)

## Chaves estrangeiras e integridade referencial

- `edicao.id_revista` → `revista.id`
- `pagamento.id_utilizador` → `utilizador.id`
- `pagamento.id_edicao` → `edicao.id`
- `editor_edicao.id_edicao` → `edicao.id`; `editor_edicao.id_utilizador` → `utilizador.id`; `UNIQUE(id_edicao, id_utilizador)`
- `edicao_tag.id_edicao` → `edicao.id`; `UNIQUE(id_edicao, tag)`
- `edicao_artigo.id_edicao` → `edicao.id`
- `favorito.id_utilizador` → `utilizador.id`; `favorito.id_edicao` → `edicao.id`; `UNIQUE(id_utilizador, id_edicao)`
- `flipbook_edicao.id_edicao` → `edicao.id`, `UNIQUE`
- `flipbook_pagina.id_flipbook` → `flipbook_edicao.id`
- `flipbook_comentario.id_pagina` → `flipbook_pagina.id`; `flipbook_comentario.id_utilizador` → `utilizador.id`
- `log` não tem chaves estrangeiras formais — `target_type` + `target_id` referenciam qualquer entidade por convenção de aplicação.

Chaves estrangeiras com `ON DELETE RESTRICT`. A remoção lógica é feita através de `removido_em`, onde a tabela o suportar (ver nota abaixo). As consultas padrão filtram `removido_em IS NULL`.

## Tabelas sem soft delete

`pagamento` (registo financeiro), `editor_edicao`, `edicao_tag`, `favorito` e `log` são registos de associação/evento — removem-se fisicamente (`DELETE`) quando aplicável, ou simplesmente não se removem (caso do `log`, que é imutável).

## O que mudou face às versões anteriores da documentação

- A nomenclatura de auditoria **na base de dados** passou de inglês (`createdAt/updatedAt/deletedAt`) para português (`criado_em/atualizado_em/removido_em`) — decisão da reunião. No código Java, os campos da entidade mantêm-se em inglês, mapeados por `@Column`.
- `Revista` e `Edicao` trocaram de papel: `Revista` é agora o título/marca; `Edicao` é a unidade vendável (antes, "Revista" acumulava as duas coisas).
- `Comentario`/`ComentarioPagina`/`ComentarioRevista` (propostas anteriores) foram substituídos por um único modelo, `flipbook_comentario`, sem resposta aninhada, com `likes`.
- `Pagina` foi substituída por `flipbook_pagina`, ligada a `flipbook_edicao` em vez de directamente a `edicao`.
- Novas tabelas: `editor_edicao`, `edicao_tag`, `edicao_artigo`, `favorito`, `flipbook_edicao`.
- `Autor_Revista` (de propostas anteriores) não tem equivalente no novo MER — ponto em aberto.
