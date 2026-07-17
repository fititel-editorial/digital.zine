# Endpoints de Utilizador — v3.1 (API final em inglês)

**Prefix:** `/api/v1/users`

## Autenticação exigida

Todos os endpoints requerem token JWT (roles `LEITOR` ou `ADMIN`).
Enviar no cabeçalho: `Authorization: Bearer <token>`.

## Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/me` | Perfil do utilizador autenticado |
| PUT | `/me` | Actualiza dados próprios (excepto `email`, `role`, `password`) |
| PATCH | `/me/password` | Altera a palavra‑passe |
| GET | `/me/purchases` | Lista pagamentos efectuados |
| GET | `/me/purchases/{id}` | Detalhe de um pagamento específico |
| GET | `/me/comments` | Lista comentários escritos pelo utilizador |
| DELETE | `/me` | Soft delete da própria conta |

> **Nota:** Favoritos ficaram num recurso próprio — ver [`favorites-endpoints.md`](./favorites-endpoints.md). O histórico de leitura (RF8) será adicionado em `/me/history` numa versão futura (ver [melhorias futuras](../07-future-improvements.md)).

---

### `GET /me`
**Response (200):**
```json
{
  "id": 1,
  "firstName": "João",
  "lastName": "Silva",
  "email": "joao@email.com",
  "dateOfBirth": "1990-05-15",
  "role": "LEITOR",
  "editorOf": [],
  "createdAt": "2026-01-10T08:00:00Z"
}
```
**Erros:** `401`.

### `PUT /me`
**Request:** campos a actualizar:
```json
{ "firstName": "João Pedro", "lastName": "Silva", "dateOfBirth": "1990-05-15" }
```
**Response (200):** perfil actualizado (mesma forma do GET).
**Erros:** `400`, `401`, `422` (tentativa de alterar campo não permitido).

### `PATCH /me/password`
**Request:** `{ "currentPassword": "...", "newPassword": "..." }`
**Response (204)**
**Erros:** `400` (password fraca), `401`, `422` (actual incorrecta).

### `GET /me/purchases`
**Query params:** `status`, `page`, `size`
**Response (200):** lista paginada de pagamentos:
```json
{
  "content": [
    {
      "id": 5001,
      "status": "PAGO",
      "paymentMethod": "MCX_EXPRESS",
      "paidAt": "2026-07-12T15:12:03Z",
      "amount": 290000,
      "edition": {
        "id": 24,
        "theme": "Dados que Contam Histórias",
        "number": 24,
        "coverUrl": "/api/v1/editions/24/pages/1/image"
      }
    }
  ],
  "totalElements": 3, "totalPages": 1, "number": 0, "size": 20
}
```
**Erros:** `401`.

### `GET /me/purchases/{id}`
**Response (200):** detalhe do pagamento (inclui `externalReference`).
**Erros:** `401`, `403` (pagamento de outro), `404`.

### `GET /me/comments`
**Query params:** `page`, `size`
**Response (200):** lista paginada de comentários:
```json
{
  "content": [
    {
      "id": 1,
      "text": "Excelente gráfico!",
      "likes": 4,
      "x": 34.5,
      "y": 61.2,
      "pageOrder": 5,
      "editionId": 24,
      "createdAt": "2026-05-15T10:00:00Z"
    }
  ],
  "totalElements": 1, "totalPages": 1, "number": 0, "size": 20
}
```
**Erros:** `401`.

### `DELETE /me`
**Response (204)** – soft delete da conta; logins seguintes devolvem `401`.
**Erros:** `401`, `409` (se houver pagamentos `PAGO` – regra de negócio opcional).

---

## Notas de implementação

- A palavra-passe nunca é devolvida.
- Operações de escrita actualizam `atualizado_em`.
- Utilizadores com `removido_em` não nulo são rejeitados pelo filtro JWT.
- As listagens ignoram registos com `removido_em` não nulo.

---

*Estes endpoints permitem a gestão da conta e consulta de histórico.*
