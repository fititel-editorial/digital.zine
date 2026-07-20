# Endpoints de Administração — v3.1 (API final em inglês)

**Prefix:** `/api/v1/admin`

Todos os endpoints exigem um token JWT de um utilizador com `role = ADMIN`.

> **Nota sobre "editores":** um editor **não é uma entidade nem um role próprio** — é um utilizador `ADMIN` atribuído a edições via `editor_edicao`. Os endpoints de "editores" abaixo gerem utilizadores `ADMIN` e as suas atribuições. O frontend adapta o seu modelo de 3 roles (admin/editor/reader) a partir do campo `editorOf` devolvido no login.

## Revistas e edições

Ver [`edition-endpoints.md`](./edition-endpoints.md): `POST/PUT/DELETE /magazines`, `POST/PUT/DELETE /editions`, `POST /editions/{id}/flipbook`, `PATCH /editions/{id}/pages/{order}`, `POST/PUT/DELETE /editions/{id}/articles`, `POST/DELETE /editions/{id}/tags`.

## Editores — `/admin/editors`

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/` | Lista utilizadores `ADMIN` com as suas atribuições |
| POST | `/` | Cria um utilizador com `role = ADMIN` |
| PUT | `/{id}` | Actualiza dados do editor |
| DELETE | `/{id}` | Desactiva (soft delete) — o utilizador deixa de poder autenticar-se |

### `GET /`
**Response (200):**
```json
[
  {
    "id": 7,
    "firstName": "Ana",
    "lastName": "Pereira",
    "email": "ana@fittel.co",
    "active": true,
    "editionsManaged": [24, 23],
    "createdAt": "2025-06-01T08:00:00Z"
  }
]
```
`active` = `removido_em IS NULL`; `editionsManaged` = IDs vindos de `editor_edicao`.

### `POST /`
```json
{ "firstName": "Carlos", "lastName": "Mendes", "email": "carlos@fittel.co", "password": "TempPass123!" }
```
**Response (201):** utilizador criado com `role = ADMIN`.
**Erros:** `400`, `409` (email já existe)

---

## Atribuição de editores — `/admin/editions/{editionId}/editors`

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/` | Lista utilizadores atribuídos como editores da edição |
| POST | `/` | Atribui um utilizador como editor da edição |
| DELETE | `/{userId}` | Remove a atribuição (hard delete) |

### `POST /`
```json
{ "userId": 7 }
```
**Response (201):** `{ "editionId": 24, "userId": 7, "createdAt": "..." }`
**Regra:** `userId` deve corresponder a um utilizador com `role = ADMIN` — assumido, a confirmar (ver changelog).
**Erros:** `400`, `403`, `404`, `409` (já atribuído), `422` (utilizador não é ADMIN)

---

## Leitores — `/admin/readers`

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/` | Lista utilizadores `LEITOR` com estatísticas resumidas |
| GET | `/{id}` | Detalhe de um leitor com actividade |

### `GET /`
**Query params:** `page`, `size`, `sort`
**Response (200):** lista paginada:
```json
{
  "content": [
    {
      "id": 1,
      "firstName": "João",
      "lastName": "Silva",
      "email": "joao@email.com",
      "purchaseCount": 3,
      "favoriteCount": 5,
      "commentCount": 12,
      "createdAt": "2026-01-10T08:00:00Z"
    }
  ],
  "totalElements": 25000, "totalPages": 1250, "number": 0, "size": 20
}
```

### `GET /{id}`
**Response (200):**
```json
{
  "id": 1,
  "firstName": "João",
  "lastName": "Silva",
  "email": "joao@email.com",
  "dateOfBirth": "1990-05-15",
  "createdAt": "2026-01-10T08:00:00Z",
  "purchases": [
    { "id": 5001, "editionId": 24, "status": "PAGO", "paidAt": "2026-07-12T15:12:03Z" }
  ],
  "favorites": [24, 23],
  "recentComments": [
    { "id": 1, "text": "Excelente!", "editionId": 24, "pageOrder": 5, "createdAt": "2026-05-15T10:00:00Z" }
  ]
}
```

---

## Pagamentos

Ver [`payment-endpoints.md`](./payment-endpoints.md): `GET /admin/payments`, `PUT /admin/payments/{id}/approve`, `PUT /admin/payments/{id}/reject`.

## Comentários (moderação)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| DELETE | `/admin/comments/{id}` | Remove (soft delete) qualquer comentário, independentemente do autor |

Mesmo efeito obtido com `DELETE` directo em [`comments-endpoints.md`](./comments-endpoints.md) quando o utilizador é admin; este endpoint é alternativa explícita para clareza no painel de moderação. Gera log administrativo.

---

## Logs de actividade — `/admin/logs`

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/` | Lista de logs de actividade administrativa |

**Query params:** `userEmail`, `action`, `targetType`, `page`, `size` (default 50)

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "userName": "Ana Pereira",
      "userEmail": "ana@fititel.co",
      "action": "criou",
      "targetType": "edicao",
      "targetId": 24,
      "createdAt": "2026-05-10T09:15:00Z"
    }
  ],
  "totalElements": 7, "totalPages": 1, "number": 0, "size": 50
}
```

**Nota de implementação:** cada endpoint de escrita relevante (`edicao`, `pagamento`, `flipbook_comentario`, `editor_edicao`) deve gravar um `ActivityLog` correspondente, na mesma transacção da operação principal. Os valores de `action` (`criou`, `editou`, `removeu`, `aprovou_pagamento`, ...) mantêm-se em português — são dados de domínio.

---

## Estatísticas e relatórios (fora do escopo da v3)

O painel do frontend prevê métricas de dashboard e relatórios de receita (`GET /admin/statistics`, `GET /admin/reports/revenue`). **Não entram na v3** — mantêm-se registados em [`07-future-improvements.md`](../07-future-improvements.md). O frontend deve ocultar essas secções ou mantê-las com dados mock até serem implementadas.
