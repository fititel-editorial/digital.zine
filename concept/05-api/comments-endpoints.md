# Endpoints de Comentário

**Prefix:** `/api/v1/comentarios`

## Autenticação exigida

Todos os endpoints requerem token JWT (roles `LEITOR` ou `ADMIN`). O token é enviado no cabeçalho `Authorization: Bearer <token>`.

## Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/paginas/{idPagina}/comentarios` | Lista comentários de uma página (em árvore) |
| POST | `/` | Cria um comentário (raiz ou resposta) |
| PUT | `/{id}` | Edita o próprio comentário |
| DELETE | `/{id}` | Soft delete (próprio ou qualquer, se admin) |

---

### `GET /paginas/{idPagina}/comentarios`

**Response (200):** Lista hierárquica – cada comentário inclui `id`, `texto`, `dataEfetiv`, `utilizador` (resumo) e `respostas[]` (mesma estrutura).  
**Erros:** `404` (página não existe).

---

### `POST /`

Cria um comentário raiz (`idPai = null`) ou uma resposta (`idPai` preenchido).

**Request:**
```json
{
  "texto": "Excelente artigo!",
  "idPagina": 15,
  "idPai": null
}
```
**Response (201):** o comentário criado (mesma estrutura da listagem).  
**Regra:** `idPai`, se fornecido, deve existir e pertencer à mesma página.  
**Erros:** `400`, `401`, `422` (pai inválido).

---

### `PUT /{id}`

Edita apenas o texto de um comentário que pertença ao próprio utilizador (ou a qualquer um, se admin).

**Request:** `{ "texto": "Texto corrigido" }`  
**Response (200):** comentário actualizado.  
**Erros:** `401`, `403` (não autor), `404`.

---

### `DELETE /{id}`

Soft delete: o comentário fica com `deletedAt` preenchido e deixa de aparecer nas listagens padrão. Administradores podem eliminar qualquer comentário.

**Response:** `204 No Content`  
**Erros:** `401`, `403`, `404`.

---

## Notas importantes

- As listagens padrão filtram `deletedAt IS NULL`.
- O campo `idPai` permite respostas aninhadas (sem limite definido de profundidade).
- O diagrama de sequência que detalha este fluxo está em [`../06-diagramas/ds-comentario.md`](../06-diagrams/ds-comment.md).