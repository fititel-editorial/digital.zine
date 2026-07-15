# Endpoints de Comentário — v3

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md). Substitui a proposta anterior de dois modelos de comentário — agora existe apenas `FlipbookComentario`, sem resposta aninhada, com `likes`.

**Prefix:** `/api/v1/paginas/{idPagina}/comentarios`

`idPagina` refere-se ao `id` de `flipbook_pagina`.

## Público (leitura livre)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/` | Lista comentários da página |

**Response (200):**
```json
{
  "data": [
    { "id": 1, "texto": "Excelente gráfico!", "likes": 4, "x": 34.5, "y": 61.2, "utilizador": { "id": 1, "pNome": "João" }, "criadoEm": "2026-05-15T10:00:00Z" }
  ]
}
```
**Erros:** `404` (página não existe)

## Autenticado (roles `LEITOR` ou `ADMIN`)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| POST | `/` | Cria um comentário posicionado |
| PUT | `/{id}` | Edita o próprio comentário (texto) |
| DELETE | `/{id}` | Soft delete (próprio, ou qualquer, se admin) |
| POST | `/{id}/like` | Regista um "like" no comentário |
| DELETE | `/{id}/like` | Remove o "like" do próprio utilizador |

### `POST /`
```json
{ "texto": "Excelente gráfico!", "x": 34.5, "y": 61.2 }
```
**Response (201):** o comentário criado, com `likes: 0`.
**Erros:** `400`, `401`

### `PUT /{id}` / `DELETE /{id}`
Restrito ao autor (ou admin, para `DELETE`).

### `POST /{id}/like` / `DELETE /{id}/like`
**Response (200):** `{ "likes": 5 }`
**Nota de implementação:** para evitar múltiplos likes do mesmo utilizador no mesmo comentário, é necessária uma tabela de junção `flipbook_comentario_like (id_comentario, id_utilizador)` — **não estava no MER decidido em reunião**; proposta a confirmar. Sem ela, o contador `likes` só pode ser incrementado/decrementado de forma agregada, sem impedir votos duplicados do mesmo utilizador.

---

## Notas importantes

- Não existe mais endpoint para comentário geral da edição (`ComentarioRevista`) nem resposta aninhada (`idPai`) — ambos os conceitos foram descartados na reunião.
- As listagens filtram `removido_em IS NULL`.
