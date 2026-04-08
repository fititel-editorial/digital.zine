# Endpoints de Administração

**Prefix:** `/api/v1/admin`

Todos os endpoints exigem um token JWT de um utilizador com `role = ADMIN`. A autenticação é feita através do cabeçalho `Authorization: Bearer <token>`.

## Revistas

Os endpoints de criação, edição, eliminação e substituição de PDF de revistas estão documentados em [`revista-endpoints.md`](./revista-endpoints.md). Apenas utilizadores com papel `ADMIN` podem aceder a:

- `POST /revistas`
- `PUT /revistas/{id}`
- `DELETE /revistas/{id}`
- `POST /revistas/{id}/upload-pdf`

## Pagamentos

A gestão de pagamentos está detalhada em [`pagamento-endpoints.md`](./pagamento-endpoints.md). Os seguintes endpoints são exclusivos para administradores:

- `GET /admin/pagamentos?estado=...`
- `PUT /admin/pagamentos/{id}/aprovar`
- `PUT /admin/pagamentos/{id}/rejeitar`

## Comentários (moderação)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| DELETE | `/admin/comentarios/{id}` | Remove (soft delete) qualquer comentário, independentemente do autor |

### `DELETE /admin/comentarios/{id}`

**Resposta:** `204 No Content`  
**Erros:** `401` (não autenticado), `403` (não é admin), `404` (comentário não encontrado)

> **Nota:** O mesmo efeito pode ser obtido com `DELETE /comentarios/{id}` se o utilizador tiver role `ADMIN` (conforme documentado em [`comentario-endpoints.md`](./comentario-endpoints.md)). O endpoint `/admin/comentarios/{id}` é uma alternativa redundante para clareza.

## Estatísticas (opcional – melhoria futura)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/admin/estatisticas` | Retorna métricas como número de utilizadores, revistas vendidas, total de comentários, etc. |

Este endpoint não será implementado na versão inicial; fica registado como sugestão para versões futuras.

---

*Estes endpoints permitem a gestão completa do sistema por administradores.*