# Endpoints de Administração

**Prefix:** `/api/v1/admin`

## Revistas (já coberto em `revista-endpoints.md` com role ADMIN)

Apenas como lembrete: os endpoints `POST /revistas`, `PUT /revistas/{id}`, `DELETE /revistas/{id}` e `POST /revistas/{id}/upload-pdf` são exclusivos para ADMIN e estão documentados em `revista-endpoints.md`.

---

## Pagamentos (já coberto em `pagamento-endpoints.md`)

- `GET /admin/pagamentos?estado=...`
- `PUT /admin/pagamentos/{id}/aprovar`
- `PUT /admin/pagamentos/{id}/rejeitar`

---

## Comentários (moderação)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| DELETE | `/admin/comentarios/{id}` | Elimina (soft delete) qualquer comentário |

### `DELETE /admin/comentarios/{id}`
**Response (204)**  
**Erros:** `401`, `403`, `404`

---

## Estatísticas (opcional, melhoria futura)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/admin/estatisticas` | Número de leitores, revistas vendidas, comentários, etc. |

(Implementação futura, apenas placeholder.)

---

**Notas:**
- Todos os endpoints exigem `role = ADMIN`.
- A moderação de comentários também pode ser feita via `DELETE /comentarios/{id}` com role ADMIN (já documentado em `comentario-endpoints.md`). O endpoint específico `/admin/comentarios/{id}` é redundante, mas pode existir por clareza.
- Para simplicidade, podemos usar apenas o `DELETE /comentarios/{id}` com verificação de role no backend.