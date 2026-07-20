# Endpoints de Pagamento — v3.1 (API final em inglês)

> Ver [`04-architecture/security.md`](../04-architecture/security.md) para o fluxo completo do gateway EMIS/GPO.

**Prefix:** `/api/v1/payments`

## Máquina de estados

```
PENDENTE ──► PROCESSANDO ──► PAGO
                         ──► REJEITADO
                         ──► EXPIRADO
```

`PAGO` é o único estado que liberta o conteúdo. As transições são só para a frente; notificações duplicadas são idempotentes.

## Leitor autenticado (role `LEITOR` ou `ADMIN`)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| POST | `/` | Inicia um pagamento para uma edição |
| GET | `/{id}` | Consulta estado do pagamento (para polling do cliente) |
| POST | `/check-access` | Verifica se o utilizador tem acesso a uma edição |

### `POST /`

**Request (Express):**
```json
{ "editionId": 24, "paymentMethod": "MCX_EXPRESS", "phoneNumber": "923000000" }
```
**Request (Referência):**
```json
{ "editionId": 24, "paymentMethod": "REFERENCIA" }
```

**Response (201) — Express:**
```json
{ "id": 5001, "status": "PROCESSANDO", "message": "Confirm the payment in the MCX Express app." }
```
**Response (201) — Referência:**
```json
{
  "id": 5002,
  "status": "PROCESSANDO",
  "reference": { "entity": "00611", "reference": "123456789", "amount": 290000 }
}
```

**Erros:** `400` (método inválido, telefone em falta no Express), `404` (edição não existe), `409` (já existe pagamento activo/concluído para esta edição e utilizador), `422` (edição gratuita — não requer pagamento)

### `GET /{id}`

**Response (200):**
```json
{
  "id": 5001,
  "status": "PAGO",
  "paymentMethod": "MCX_EXPRESS",
  "amount": 290000,
  "externalReference": "SIM-abc123",
  "paidAt": "2026-07-12T15:12:03Z",
  "edition": { "id": 24, "theme": "Dados que Contam Histórias", "number": 24 },
  "createdAt": "2026-07-12T15:10:00Z"
}
```
**Erros:** `401`, `403` (pagamento de outro utilizador), `404`

### `POST /check-access`

**Request:** `{ "editionId": 24 }`
**Response (200):**
```json
{ "hasAccess": true, "reason": "PAID" }
```
Valores de `reason`: `PAID`, `FREE`, `ADMIN`, `NO_PAYMENT`, `PAYMENT_PENDING`.

O frontend usa este endpoint para decidir entre mostrar o flipbook completo ou o convite à compra — substitui a verificação mock `hasPurchased()`.

---

## Notificação do GPO (produção — quando a integração real estiver disponível)

**Prefix:** `/api/v1/webhooks/payments`

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| POST | `/gpo` | Notificação assíncrona do GPO sobre o resultado de um pagamento |

Este endpoint **não usa `Authorization: Bearer`** — a autenticidade depende da verificação própria exigida pela EMIS/banco de apoio (assinatura, IP de origem, ou outro mecanismo — a confirmar depois da certificação). Requisições não verificadas são rejeitadas com `401`, sem alterar qualquer registo.

**Comportamento:** localiza o `Payment` por `externalReference`, valida idempotência (não reprocessa uma notificação já aplicada), actualiza `status` e `paidAt`.

## Endpoint de desenvolvimento — simulação (apenas em ambiente `dev`, nunca exposto em produção)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| POST | `/dev/payments/{id}/simulate` | Simula a confirmação (ou rejeição) de um pagamento, sem depender do GPO real |

**Request:** `{ "result": "PAGO" }` ou `{ "result": "REJEITADO" }`
**Response (200):** pagamento actualizado.

Detalhe da implementação simulada em [`08-implementation-guides/payment-gateway-guide.md`](../08-implementation-guides/payment-gateway-guide.md).

---

## Administrador (role `ADMIN`)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/admin/payments` | Lista pagamentos, filtrável por estado e/ou método |
| PUT | `/admin/payments/{id}/approve` | Aprova manualmente — caminho de excepção (ex.: notificação do GPO falhou, mas o pagamento foi confirmado junto do banco) |
| PUT | `/admin/payments/{id}/reject` | Rejeita manualmente |

**Query params de `GET /admin/payments`:** `status`, `paymentMethod`, `page`, `size`

Aprovação/rejeição só é válida com `status = PROCESSANDO`; ambas geram log administrativo.

**Erros comuns:** `401`, `403`, `404`, `422` (pagamento já num estado final)

---

## Notas

- `Payment.status`: `PENDENTE` → `PROCESSANDO` → `PAGO`/`REJEITADO`/`EXPIRADO` — valores de enum mantêm-se em português (são dados de domínio).
- Não existe caminho de "transferência manual com comprovativo" nesta versão — foi substituído pelo fluxo de gateway.
- O fluxo completo está detalhado no [diagrama de sequência de pagamento](../06-diagrams/ds-payment.md).
