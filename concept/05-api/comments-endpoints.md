# Endpoints de Comentário

**Prefix:** `/api/v1/comentarios`

## Leitor autenticado (ou ADMIN)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/paginas/{idPagina}/comentarios` | Lista comentários de uma página (com hierarquia) |
| POST | `/` | Cria comentário (raiz ou resposta) |
| PUT | `/{id}` | Edita próprio comentário |
| DELETE | `/{id}` | Soft delete (próprio ou qualquer se admin) |

### `GET /paginas/{idPagina}/comentarios`
**Response (200):** Lista em árvore (cada comentário tem `id, texto, dataEfetiv, leitor, respostas[]`).  
**Erros:** `404` (página não existe).

### `POST /`
**Request:** `{ "texto": "...", "idPagina": 15, "idPai": null }` (opcional, para resposta)  
**Response (201):** comentário criado (mesma estrutura da listagem).  
**Regras:** `idPai` deve pertencer à mesma página.  
**Erros:** `400`, `401`, `422` (pai inválido).

### `PUT /{id}`
**Request:** `{ "texto": "novo texto" }`  
**Response (200):** comentário actualizado.  
**Erros:** `401`, `403` (não é autor nem admin), `404`.

### `DELETE /{id}`
**Response (204)** (soft delete).  
**Erros:** `401`, `403`, `404`.

---

**Notas:**
- A listagem padrão filtra `deletedAt IS NULL`.
- Administradores podem eliminar qualquer comentário.
- O auto-relacionamento `idPai` permite respostas aninhadas (máximo 2 níveis? sem limite definido).
- Diagrama de sequência: [`ds-comments.md`](../06-diagrams/ds-comment.md).