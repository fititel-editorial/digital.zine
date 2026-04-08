# Diagrama de Sequência – Pagamento com Comprovativo

O fluxo abaixo mostra o processo completo desde a criação do pedido de pagamento pelo utilizador até à validação manual pelo administrador e o subsequente acesso à revista completa.

```mermaid
sequenceDiagram
    participant Utilizador
    participant Frontend
    participant Controller as PagamentoController
    participant Service as PagamentoService
    participant Repository as PagamentoRepository
    participant Admin

    Utilizador->>Frontend: Selecciona revista e clica "Comprar"
    Frontend->>Controller: POST /api/v1/pagamentos { id_revista, metodo }
    Controller->>Service: criarPagamento(utilizadorId, revistaId, metodo)
    Service->>Repository: save(pagamento)
    Repository-->>Service: Pagamento com estado = PENDENTE
    Service-->>Controller: PagamentoDTO (id, estado)
    Controller-->>Frontend: 201 Created (dados do pagamento)
    Frontend-->>Utilizador: Mostra formulário para upload do comprovativo

    Utilizador->>Frontend: Envia ficheiro (PDF/IMG)
    Frontend->>Controller: POST /api/v1/pagamentos/{id}/comprovativo (multipart)
    Controller->>Service: anexarComprovativo(pagamentoId, ficheiro)
    Service->>Service: Valida formato e tamanho
    Service->>Service: Salva ficheiro no storage (S3/local)
    Service->>Repository: atualizar url_comprov e estado = ANALISE
    Repository-->>Service: OK
    Service-->>Controller: PagamentoDTO (estado = ANALISE)
    Controller-->>Frontend: 200 OK (comprovativo recebido)
    Frontend-->>Utilizador: "Comprovativo enviado. Aguarde validação."

    Admin->>Frontend: Acede ao painel administrativo
    Frontend->>Controller: GET /api/v1/admin/pagamentos?estado=ANALISE
    Controller->>Service: listarPagamentosPorEstado("ANALISE")
    Service->>Repository: findPagamentosByEstado()
    Repository-->>Service: Lista de pagamentos
    Service-->>Controller: List<PagamentoDTO>
    Controller-->>Frontend: Lista de pagamentos pendentes
    Frontend-->>Admin: Mostra lista com comprovativos

    Admin->>Frontend: Clica "Aprovar" num pagamento
    Frontend->>Controller: PUT /api/v1/admin/pagamentos/{id}/aprovar
    Controller->>Service: aprovarPagamento(pagamentoId)
    Service->>Service: Gera token_acesso único (UUID ou JWT)
    Service->>Repository: atualizar estado = APROVADO, token_acesso = token
    Repository-->>Service: OK
    Service-->>Controller: PagamentoDTO (estado = APROVADO, token)
    Controller-->>Frontend: 200 OK (pagamento aprovado)
    Frontend-->>Admin: "Pagamento aprovado. Token gerado."

    Note over Utilizador, Frontend: Mais tarde, o utilizador solicita a revista
    Utilizador->>Frontend: Clica "Ler revista completa"
    Frontend->>Controller: GET /api/v1/revistas/{id}/completa (com JWT normal)
    Controller->>Service: verificarAcesso(utilizadorId, revistaId)
    Service->>Repository: verificarPagamentoAprovado(utilizadorId, revistaId)
    alt Pagamento aprovado
        Repository-->>Service: token_acesso válido
        Service->>Service: Gera URL temporária ou redirecciona para PDF
        Service-->>Controller: URL ou token curto
        Controller-->>Frontend: 302 Redirect ou JSON com link
        Frontend-->>Utilizador: Carrega PDF completo
    else Sem pagamento aprovado
        Service-->>Controller: 403 Forbidden
        Controller-->>Frontend: "Acesso negado. Revista não adquirida."
        Frontend-->>Utilizador: Mostra mensagem de erro
    end