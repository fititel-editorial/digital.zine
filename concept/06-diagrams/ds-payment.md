# Diagrama de Sequência – Pagamento com Comprovativo

Este diagrama ilustra o fluxo completo desde o pedido de pagamento pelo leitor até à libertação do acesso à revista completa (token de acesso).

```mermaid
sequenceDiagram
    participant Leitor
    participant Frontend
    participant Controller as PagamentoController
    participant Service as PagamentoService
    participant Repository as PagamentoRepository
    participant Admin

    %% 1. Leitor inicia pedido de pagamento
    Leitor->>Frontend: Selecciona revista e clica "Comprar"
    Frontend->>Controller: POST /api/v1/pagamentos { id_revista, metodo }
    Controller->>Service: criarPagamento(leitorId, revistaId, metodo)
    Service->>Repository: save(pagamento)
    Repository-->>Service: Pagamento com estado = PENDENTE
    Service-->>Controller: PagamentoDTO (id, estado)
    Controller-->>Frontend: 201 Created (dados do pagamento)
    Frontend-->>Leitor: Mostra formulário para upload do comprovativo

    %% 2. Leitor envia comprovativo
    Leitor->>Frontend: Envia ficheiro (PDF/IMG)
    Frontend->>Controller: POST /api/v1/pagamentos/{id}/comprovativo (multipart)
    Controller->>Service: anexarComprovativo(pagamentoId, ficheiro)
    Service->>Service: Valida formato e tamanho
    Service->>Service: Salva ficheiro no storage (S3/local)
    Service->>Repository: atualizar url_comprov e estado = ANALISE
    Repository-->>Service: OK
    Service-->>Controller: PagamentoDTO (estado = ANALISE)
    Controller-->>Frontend: 200 OK (comprovativo recebido)
    Frontend-->>Leitor: "Comprovativo enviado. Aguarde validação."

    %% 3. Admin valida comprovativo
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

    %% 4. Leitor acede à revista completa (opcional, fluxo subsequente)
    Note over Leitor, Frontend: Mais tarde, o leitor solicita a revista
    Leitor->>Frontend: Clica "Ler revista completa"
    Frontend->>Controller: GET /api/v1/revistas/{id}/completa (com JWT normal)
    Controller->>Service: verificarAcesso(leitorId, revistaId)
    Service->>Repository: verificarPagamentoAprovado(leitorId, revistaId)
    alt Pagamento aprovado
        Repository-->>Service: token_acesso válido
        Service->>Service: Gera URL temporária ou redirecciona para PDF
        Service-->>Controller: URL ou token curto
        Controller-->>Frontend: 302 Redirect ou JSON com link
        Frontend-->>Leitor: Carrega PDF completo
    else Sem pagamento ou pendente/rejeitado
        Service-->>Controller: 403 Forbidden
        Controller-->>Frontend: "Acesso negado. Revista não adquirida."
        Frontend-->>Leitor: Mostra mensagem de erro
    end