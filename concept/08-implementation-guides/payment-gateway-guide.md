# Guia de Implementação — Gateway de Pagamento (EMIS/GPO) — v3

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md) e [`04-architecture/security.md`](../04-architecture/security.md). Guia de como construir o fluxo já desde já, sem ainda ter acesso oficial à EMIS.
>
> **Correcção de nomenclatura:** as interfaces/classes (`GatewayPagamentoService`, `SimuladoGatewayPagamentoService`, `GpoGatewayPagamentoService`, `PagamentoService`) e os campos (`utilizadorId`, `edicaoId`) devem ser lidos como `PaymentGatewayService`, `SimulatedPaymentGatewayService`, `GpoPaymentGatewayService`, `PaymentService`, `userId`, `editionId` — em inglês, por decisão 17 ([`04-architecture/technical-decisions.md`](../04-architecture/technical-decisions.md)).

## Interface comum

> **Pacote:** `com.itel.fititel.application.service`, junto dos restantes serviços.

```java
public interface GatewayPagamentoService {
    ResultadoInicioPagamento iniciarExpress(Pagamento pagamento, String telemovel);
    ResultadoInicioPagamento iniciarReferencia(Pagamento pagamento);
    ResultadoNotificacao interpretarNotificacao(String payload, Map<String, String> headers);
}

public record ResultadoInicioPagamento(String referenciaExterna, String entidade, String referencia) {}
public record ResultadoNotificacao(String referenciaExterna, String estado) {} // estado: PAGO | REJEITADO
```

## Implementação simulada (usar já, em `dev`)

```java
@Service
@Profile("dev")
public class SimuladoGatewayPagamentoService implements GatewayPagamentoService {

    @Override
    public ResultadoInicioPagamento iniciarExpress(Pagamento pagamento, String telemovel) {
        return new ResultadoInicioPagamento("SIM-" + UUID.randomUUID(), null, null);
    }

    @Override
    public ResultadoInicioPagamento iniciarReferencia(Pagamento pagamento) {
        String referencia = String.valueOf(100000000 + new Random().nextInt(899999999));
        return new ResultadoInicioPagamento("SIM-" + referencia, "00611", referencia);
    }

    @Override
    public ResultadoNotificacao interpretarNotificacao(String payload, Map<String, String> headers) {
        throw new UnsupportedOperationException("Usar POST /dev/pagamentos/{id}/simular em vez de webhook real");
    }
}
```

O endpoint `POST /dev/pagamentos/{id}/simular` (só activo em `dev`) chama directamente `PagamentoService.confirmar(id, estado)`, sem passar por `interpretarNotificacao` — porque não há notificação real a interpretar.

## Implementação real (a desenvolver após certificação)

```java
@Service
@Profile("prod")
@RequiredArgsConstructor
public class GpoGatewayPagamentoService implements GatewayPagamentoService {
    // Endpoints, payloads e forma de verificação de assinatura confirmam-se
    // com a documentação oficial da EMIS após a certificação junto do banco de apoio.
    // A estrutura abaixo é ilustrativa, não definitiva.

    private final RestClient restClient;

    @Override
    public ResultadoInicioPagamento iniciarExpress(Pagamento pagamento, String telemovel) {
        // POST à API do GPO com { telemovel, valor, referenciaComerciante }
        // devolve um id de transacção do lado do GPO
        throw new UnsupportedOperationException("A implementar após acesso à EMIS");
    }

    @Override
    public ResultadoInicioPagamento iniciarReferencia(Pagamento pagamento) {
        // POST à API do GPO pedindo geração de Entidade/Referência/Valor
        throw new UnsupportedOperationException("A implementar após acesso à EMIS");
    }

    @Override
    public ResultadoNotificacao interpretarNotificacao(String payload, Map<String, String> headers) {
        // 1. Verificar assinatura/origem (mecanismo exacto a confirmar com a EMIS)
        // 2. Fazer parse do payload para extrair referenciaExterna + estado
        throw new UnsupportedOperationException("A implementar após acesso à EMIS");
    }
}
```

## Serviço de pagamento (usa a interface, agnóstico de qual implementação está activa)

```java
@Service
@RequiredArgsConstructor
public class PagamentoService {

    private final GatewayPagamentoService gateway;
    private final PagamentoRepository repository;
    private final LogService logService;

    @Transactional
    public Pagamento iniciar(Long idUtilizador, Long idEdicao, String metodo, String telemovel) {
        Pagamento pagamento = repository.save(Pagamento.builder()
                .utilizadorId(idUtilizador).edicaoId(idEdicao)
                .metodoPagamento(metodo).status("PROCESSANDO").build());

        ResultadoInicioPagamento resultado = "MCX_EXPRESS".equals(metodo)
                ? gateway.iniciarExpress(pagamento, telemovel)
                : gateway.iniciarReferencia(pagamento);

        pagamento.setReferenciaExterna(resultado.referenciaExterna());
        return repository.save(pagamento);
    }

    @Transactional
    public void confirmar(String referenciaExterna, String novoEstado) {
        Pagamento pagamento = repository.findByReferenciaExterna(referenciaExterna)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Pagamento", referenciaExterna));

        if (!"PROCESSANDO".equals(pagamento.getStatus())) return; // idempotência

        pagamento.setStatus(novoEstado);
        pagamento.setDataPagamento(LocalDateTime.now());
        repository.save(pagamento);
        logService.registar("aprovou_pagamento", "pagamento", pagamento.getId(), null);
    }
}
```

## Pontos a confirmar depois do contacto com a EMIS

- Formato exacto do payload da notificação e mecanismo de verificação de assinatura/origem.
- Se a confirmação chega por webhook HTTP, ou se é preciso fazer polling periódico à API do GPO.
- Prazo de expiração de uma transacção `PROCESSANDO` (usado para o job de expiração — ver [`07-future-improvements.md`](../07-future-improvements.md)).
