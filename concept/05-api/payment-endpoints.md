# Endpoints de Pagamento

**Prefix:** `/api/v1/pagamentos`

## Leitor autenticado

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| POST | `/` | Cria pedido de pagamento (estado `PENDENTE`) |
| POST | `/{id}/comprovativo` | Envia comprovativo (multipart) → estado `ANALISE` |
| GET | `/{id}` | Consulta estado do pagamento |

### `POST /`
**Request:** `{ "idRevista": 10, "metodo": "TRANSFERENCIA" }` (ou `MCX_EXPRESS`, `UNITEL_MONEY`)  
**Response (201):** `{ "id": 5001, "estado": "PENDENTE", "mensagem": "..." }`

### `POST /{id}/comprovativo`
**Request:** `multipart` com campo `comprovativo` (PDF/IMG)  
**Response (200):** `{ "estado": "ANALISE", "mensagem": "..." }`

### `GET /{id}`
**Response (200):** `{ "id", "estado", "metodo", "dataPagamento" }`  
**Erros:** `401`, `403` (pagamento de outro leitor), `404`

---

## Administrador (prefixo `/admin`)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/admin/pagamentos` | Lista pagamentos por estado |
| PUT | `/admin/pagamentos/{id}/aprovar` | Aprova e gera token |
| PUT | `/admin/pagamentos/{id}/rejeitar` | Rejeita |

### `GET /admin/pagamentos?estado=ANALISE`
**Query obrigatória:** `estado` (PENDENTE, ANALISE, APROVADO, REJEITADO)  
**Response (200):** Lista paginada com `id, leitor, revista, urlComprovativo, estado`.

### `PUT /admin/pagamentos/{id}/aprovar`
**Response (200):** `{ "estado": "APROVADO", "tokenAcesso": "eyJ..." }`

### `PUT /admin/pagamentos/{id}/rejeitar`
**Response (200):** `{ "estado": "REJEITADO", "motivo": "..." }` (motivo opcional no body)

**Erros comuns:** `401`, `403`, `404`, `422` (pagamento já finalizado).

---

**Notas:**
- Estados: `PENDENTE` → `ANALISE` → `APROVADO`/`REJEITADO`.
- O `token_acesso` é único, gerado apenas na aprovação.
- Fluxo detalhado no [diagrama de sequência](../06-diagrams/ds-payment.md).