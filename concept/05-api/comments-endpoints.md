# Endpoints de Comentário — v3.1 (API final em inglês)

> Existe apenas um modelo de comentário — `FlipbookComment`, posicionado (x, y) numa página do flipbook, sem resposta aninhada, com `likes`.

**Prefix:** `/api/v1/pages/{pageId}/comments`

`pageId` refere-se ao `id` de `flipbook_pagina`.

## Público (leitura livre)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/` | Lista comentários da página |

**Response (200):**
```json
[
  {
    "id": 1,
    "text": "Excelente gráfico!",
    "likes": 4,
    "x": 34.5,
    "y": 61.2,
    "user": { "id": 1, "firstName": "João" },
    "createdAt": "2026-05-15T10:00:00Z"
  }
]
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
**Request:**
```json
{ "text": "Excelente gráfico!", "x": 34.5, "y": 61.2 }
```
**Validação:** `x` e `y` entre 0 e 100 (percentagem); `text` não vazio.
**Response (201):** o comentário criado, com `likes: 0`.
**Erros:** `400`, `401`

### `PUT /{id}`
**Request:** `{ "text": "Texto actualizado" }`
Restrito ao autor. **Response (200).**
**Erros:** `403` (não é o autor)

### `DELETE /{id}`
Autor remove o próprio; `ADMIN` remove qualquer um. **Response (204).**

### `POST /{id}/like`
**Response (200):** `{ "likes": 5 }`
**Erros:** `409` (o utilizador já gostou deste comentário)

### `DELETE /{id}/like`
**Response (200):** `{ "likes": 4 }`
**Erros:** `404` (não existe like deste utilizador)

**Implementação da unicidade:** a tabela de junção `flipbook_comentario_like (id_comentario, id_utilizador)` com UNIQUE composto garante um like por utilizador por comentário — entidade `CommentLike`, adicionada via migração `V2__comment_likes.sql` (ver [`03-data-model/erm.md`](../03-data-model/erm.md); não estava no MER da reunião — proposta a confirmar).

---

## Notas importantes

- Não existe endpoint para comentário geral da edição nem resposta aninhada — ambos os conceitos foram descartados na reunião.
- As listagens filtram `removido_em IS NULL`.
- O contador `likes` em `flipbook_comentario` é actualizado atomicamente com a inserção/remoção em `flipbook_comentario_like`.
