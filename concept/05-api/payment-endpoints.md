# Endpoints de Pagamento

**Prefix:** `/api/v1/pagamentos`

## Leitor autenticado (role `LEITOR` ou `ADMIN`)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| POST | `/` | Cria pedido de pagamento (estado `PENDENTE`) |
| POST | `/{id}/comprovativo` | Envia comprovativo (multipart) → estado `ANALISE` |
| GET | `/{id}` | Consulta estado do pagamento |

### `POST /`
**Request:** `{ "idRevista": 10, "metodo": "TRANSFERENCIA" }` (ou `MCX_EXPRESS`, `UNITEL_MONEY`)  
**Response (201):** `{ "id": 5001, "estado": "PENDENTE", "mensagem": "Aguardando envio do comprovativo" }`

### `POST /{id}/comprovativo`
**Request:** `multipart` com campo `comprovativo` (PDF/IMG)  
**Response (200):** `{ "estado": "ANALISE", "mensagem": "Comprovativo recebido. Aguarde validação." }`

### `GET /{id}`
**Response (200):** `{ "id": 5001, "estado": "ANALISE", "metodo": "TRANSFERENCIA", "dataPagamento": "2025-03-30T10:00:00Z" }`  
**Erros:** `401`, `403` (pagamento de outro utilizador), `404`

---

## Administrador (role `ADMIN`) – prefixo `/admin`

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/admin/pagamentos` | Lista pagamentos por estado |
| PUT | `/admin/pagamentos/{id}/aprovar` | Aprova e gera token de acesso |
| PUT | `/admin/pagamentos/{id}/rejeitar` | Rejeita pagamento |

### `GET /admin/pagamentos?estado=ANALISE`
**Query obrigatória:** `estado` (PENDENTE, ANALISE, APROVADO, REJEITADO)  
**Response (200):** Lista paginada com `id`, `utilizador` (resumo), `revista` (resumo), `urlComprovativo`, `estado`.

### `PUT /admin/pagamentos/{id}/aprovar`
**Response (200):** `{ "estado": "APROVADO", "tokenAcesso": "eyJhbGciOiJIUzI1NiIs..." }`

### `PUT /admin/pagamentos/{id}/rejeitar`
**Request (opcional):** `{ "motivo": "Comprovativo ilegível" }`  
**Response (200):** `{ "estado": "REJEITADO", "motivo": "..." }`

**Erros comuns:** `401`, `403`, `404`, `422` (pagamento já aprovado ou rejeitado)

---

## Notas

- Estados: `PENDENTE` → `ANALISE` → `APROVADO` / `REJEITADO`.  
- O `token_acesso` é único, gerado apenas na aprovação.  
- O fluxo completo está detalhado no [diagrama de sequência de pagamento](../06-diagrams/ds-payment.md).

---

*Estes endpoints implementam a compra e validação manual de pagamentos.*