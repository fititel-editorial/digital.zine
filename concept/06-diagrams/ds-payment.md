# Diagrama de Sequência — Pagamento — v3

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md) e [`04-architecture/security.md`](../04-architecture/security.md). **Corrigido para Mermaid** (linguagem obrigatória para todos os diagramas desta documentação).

## Fluxo — Multicaixa Express (confirmação por telemóvel)

```mermaid
sequenceDiagram
    actor Leitor
    participant Frontend
    participant Backend
    participant GPO as GPO (EMIS)

    Leitor->>Frontend: Escolhe edição + Express
    Frontend->>Backend: POST /payments { editionId, paymentMethod: MCX_EXPRESS, phoneNumber }
    Backend->>Backend: cria Pagamento, status=PROCESSANDO
    Backend->>GPO: iniciarPagamentoExpress()
    GPO-->>Leitor: pede confirmação no nº de telemóvel
    Backend-->>Frontend: "confirme na app MCX Express"
    Frontend-->>Leitor: instrução de confirmação

    Leitor->>GPO: abre app MCX Express e confirma
    GPO->>Backend: notificação assíncrona (referenciaExterna, estado)
    Backend->>Backend: status=PAGO, grava Log

    Frontend->>Backend: GET /payments/{id} (polling)
    Backend-->>Frontend: status=PAGO
    Frontend-->>Leitor: acede à edição completa
```

## Fluxo — Referência (ATM / homebanking)

```mermaid
sequenceDiagram
    actor Leitor
    participant Frontend
    participant Backend
    participant GPO as GPO (EMIS)

    Leitor->>Frontend: Escolhe edição + Referência
    Frontend->>Backend: POST /payments { editionId, paymentMethod: REFERENCIA }
    Backend->>Backend: cria Pagamento, status=PROCESSANDO
    Backend->>GPO: gerarReferencia()
    GPO-->>Backend: Entidade / Referência / Valor
    Backend-->>Frontend: { entity, reference, amount }
    Frontend-->>Leitor: mostra dados para pagamento

    Leitor->>GPO: paga no ATM ou homebanking (fora da aplicação)
    GPO->>Backend: notificação assíncrona (compensação, normalmente ao fim do dia)
    Backend->>Backend: status=PAGO, grava Log

    Frontend->>Backend: GET /payments/{id} (polling)
    Backend-->>Frontend: status=PAGO
    Frontend-->>Leitor: acede à edição completa
```

## Variante em desenvolvimento — gateway simulado

```mermaid
sequenceDiagram
    actor Dev as Admin/Dev
    participant Backend

    Dev->>Backend: POST /dev/payments/{id}/simulate { result: "PAGO" }
    Backend->>Backend: SimuladoGatewayPagamentoService actualiza o Pagamento
    Backend->>Backend: status=PAGO, grava Log
    Note over Backend: Só existe em dev/local — nunca exposto em produção
```

## Fluxo de falha ou expiração

```mermaid
sequenceDiagram
    participant GPO as GPO (EMIS)
    participant Backend

    alt Notificação de falha
        GPO->>Backend: notificação de falha
        Backend->>Backend: status=REJEITADO, grava Log
    else Sem notificação dentro do prazo
        Backend->>Backend: job agendado: status=EXPIRADO
    end
```

Ver [`08-implementation-guides/payment-gateway-guide.md`](../08-implementation-guides/payment-gateway-guide.md) para a implementação simulada.
