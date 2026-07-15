# Endpoints de Favoritos — v3 (novo)

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md). Recurso novo, correspondente à tabela `favorito`.

**Prefix:** `/api/v1/utilizadores/me/favoritos`

Todos os endpoints requerem token JWT (roles `LEITOR` ou `ADMIN`).

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/` | Lista as edições marcadas como favoritas pelo utilizador |
| POST | `/{idEdicao}` | Marca uma edição como favorita |
| DELETE | `/{idEdicao}` | Remove dos favoritos |

### `GET /`
**Query params:** `pagina`, `tamanho`
**Response (200):** lista paginada de edições resumidas (mesma forma que `GET /edicoes`).

### `POST /{idEdicao}`
**Response (201):** `{ "idEdicao": 24, "criadoEm": "2026-07-13T10:00:00Z" }`
**Erros:** `401`, `404` (edição não existe), `409` (já é favorita)

### `DELETE /{idEdicao}`
**Response (204)**
**Erros:** `401`, `404`
