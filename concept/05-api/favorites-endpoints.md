# Endpoints de Favoritos — v3.1 (API final em inglês)

> Recurso correspondente à tabela `favorito`.

**Prefix:** `/api/v1/users/me/favorites`

Todos os endpoints requerem token JWT (roles `LEITOR` ou `ADMIN`).

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/` | Lista as edições marcadas como favoritas pelo utilizador |
| POST | `/{editionId}` | Marca uma edição como favorita |
| DELETE | `/{editionId}` | Remove dos favoritos |

### `GET /`
**Query params:** `page`, `size`
**Response (200):** lista paginada de edições resumidas (mesma forma que os itens de `GET /editions`).

### `POST /{editionId}`
**Response (201):** `{ "editionId": 24, "createdAt": "2026-07-13T10:00:00Z" }`
**Erros:** `401`, `404` (edição não existe), `409` (já é favorita)

### `DELETE /{editionId}`
**Response (204)** — hard delete (a tabela `favorito` não tem `removido_em`).
**Erros:** `401`, `404`

---

## Notas

- Unicidade `utilizador + edicao` garantida por constraint UNIQUE composto.
- O frontend deve substituir a função mock `toggleFavorite()` por chamadas separadas a POST/DELETE, com base no estado actual.
