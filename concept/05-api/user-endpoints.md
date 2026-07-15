# Endpoints de Utilizador — v3

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md). Campos de auditoria actualizados para português; `/me/comentarios` reflecte o modelo único de comentário (sem `respostasCount`); adicionada referência a `/me/favoritos`.

**Prefix:** `/api/v1/utilizadores`

## Autenticação exigida

Todos os endpoints requerem token JWT (roles `LEITOR` ou `ADMIN`).  
Enviar no cabeçalho: `Authorization: Bearer <token>`.

## Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/me` | Perfil do utilizador autenticado |
| PUT | `/me` | Actualiza dados próprios (excepto `email`, `role`, `password`) |
| PATCH | `/me/password` | Altera a palavra‑passe |
| GET | `/me/compras` | Lista pagamentos efectuados |
| GET | `/me/compras/{id}` | Detalhe de um pagamento específico |
| GET | `/me/comentarios` | Lista comentários escritos pelo utilizador |
| DELETE | `/me` | Soft delete da própria conta |

> **Nota:** Favoritos ficaram num recurso próprio — ver [`favorites-endpoints.md`](./favorites-endpoints.md). O histórico de leitura (RF8) será adicionado em `/me/historico` numa versão futura (ver [melhorias futuras](../07-future-improvements.md)).

---

### `GET /me`
**Response (200):** dados do utilizador (sem palavra‑passe).  
**Erros:** `401`.

### `PUT /me`
**Request:** campos a actualizar (ex: `{ "pNome": "Novo nome" }`).  
**Response (200):** perfil actualizado.  
**Erros:** `400`, `401`, `422` (tentativa de alterar campo não permitido).

### `PATCH /me/password`
**Request:** `{ "palavraPasseActual": "...", "novaPalavraPasse": "..." }`  
**Response (204)**  
**Erros:** `400` (password fraca), `401`, `422` (actual incorrecta).

### `GET /me/compras`
**Query params:** `status`, `pagina`, `tamanho`  
**Response (200):** lista paginada de pagamentos (com `id`, `metodoPagamento`, `status`, `dataPagamento`, `edicao` resumida).  
**Erros:** `401`.

### `GET /me/compras/{id}`
**Response (200):** detalhe do pagamento (inclui `referenciaExterna`).  
**Erros:** `401`, `403` (pagamento de outro), `404`.

### `GET /me/comentarios`
**Query params:** `pagina`, `tamanho`  
**Response (200):** lista paginada de comentários (com `id`, `texto`, `likes`, `x`, `y`, `pagina` resumida).  
**Erros:** `401`.

### `DELETE /me`
**Response (204)** – soft delete da conta.  
**Erros:** `401`, `409` (se houver pagamentos `PAGO` – regra de negócio opcional).

---

## Notas de implementação

- A palavra-passe nunca é devolvida.
- Operações de escrita actualizam `atualizado_em`.
- Utilizadores com `removido_em` não nulo são rejeitados pelo filtro JWT.
- As listagens ignoram registos com `removido_em` não nulo.

---

*Estes endpoints permitem a gestão da conta e consulta de histórico.*