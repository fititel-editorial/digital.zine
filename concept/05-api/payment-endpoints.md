# Endpoints de Pagamento — v3

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md) e [`04-architecture/security.md`](../04-architecture/security.md).

**Prefix:** `/api/v1/pagamentos`

## Leitor autenticado (role `LEITOR` ou `ADMIN`)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| POST | `/` | Inicia um pagamento para uma edição |
| GET | `/{id}` | Consulta estado do pagamento (para polling do cliente) |
| GET | `/` | Lista os pagamentos do próprio utilizador (ver também `/utilizadores/me/compras`) |

### `POST /`

**Request (Express):**
```json
{ "idEdicao": 24, "metodoPagamento": "MCX_EXPRESS", "telemovel": "923000000" }
```
**Request (Referência):**
```json
{ "idEdicao": 24, "metodoPagamento": "REFERENCIA" }
```

**Response (201) — Express:**
```json
{ "id": 5001, "status": "PROCESSANDO", "mensagem": "Confirme o pagamento na app MCX Express" }
```
**Response (201) — Referência:**
```json
{
  "id": 5002,
  "status": "PROCESSANDO",
  "referencia": { "entidade": "00611", "referencia": "123456789", "valor": 290000 }
}
```

**Erros:** `400` (edição/método inválido), `409` (já existe um pagamento `PAGO` para esta edição e este utilizador)

### `GET /{id}`

**Response (200):**
```json
{
  "id": 5001,
  "status": "PAGO",
  "metodoPagamento": "MCX_EXPRESS",
  "dataPagamento": "2026-07-12T15:12:03Z",
  "edicao": { "id": 24, "tema": "Dados que Contam Histórias" }
}
```
**Erros:** `401`, `403` (pagamento de outro utilizador), `404`

---

## Notificação do GPO (produção — quando a integração real estiver disponível)

**Prefix:** `/api/v1/webhooks/pagamentos`

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| POST | `/gpo` | Notificação assíncrona do GPO sobre o resultado de um pagamento |

Este endpoint **não usa `Authorization: Bearer`** — a autenticidade depende da verificação própria exigida pela EMIS/banco de apoio (assinatura, IP de origem, ou outro mecanismo — a confirmar depois da certificação). Requisições não verificadas são rejeitadas com `401`, sem alterar qualquer registo.

**Comportamento:** localiza o `Pagamento` por `referencia_externa`, valida idempotência (não reprocessa uma notificação já aplicada), actualiza `status` e `data_pagamento`.

## Endpoint de desenvolvimento — simulação (apenas em ambiente `dev`, nunca exposto em produção)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| POST | `/dev/pagamentos/{id}/simular` | Simula a confirmação (ou rejeição) de um pagamento, sem depender do GPO real |

**Request:** `{ "resultado": "PAGO" }` ou `{ "resultado": "REJEITADO" }`
**Response (200):** pagamento actualizado.

Detalhe da implementação simulada em [`08-implementation-guides/payment-gateway-guide.md`](../08-implementation-guides/payment-gateway-guide.md).

---

## Administrador (role `ADMIN`)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/admin/pagamentos` | Lista pagamentos por estado e/ou método |
| PUT | `/admin/pagamentos/{id}/aprovar` | Aprova manualmente — caminho de excepção (ex.: notificação do GPO falhou, mas o pagamento foi confirmado junto do banco) |
| PUT | `/admin/pagamentos/{id}/rejeitar` | Rejeita manualmente |

**Erros comuns:** `401`, `403`, `404`, `422` (pagamento já num estado final)

---

## Notas

- `Pagamento.status`: `PENDENTE` → `PROCESSANDO` → `PAGO`/`REJEITADO`/`EXPIRADO`.
- Não existe caminho de "transferência manual com comprovativo" nesta versão — foi substituído pelo fluxo de gateway. Se, na prática, se mostrar necessário um caminho de recurso para leitores sem acesso ao Multicaixa Express, isso deve voltar a ser discutido — não estava no escopo da reunião.
- O fluxo completo está detalhado no [diagrama de sequência de pagamento](../06-diagrams/ds-payment.md).
