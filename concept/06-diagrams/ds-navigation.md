# Diagrama de Sequência — Navegação do Leitor e Carregamento do Flipbook — v3

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md). Diagrama pedido na reunião de arquitectura final: mostra como o utilizador navega entre páginas e como as requisições se distribuem entre Frontend, Backend e Object Storage. **Corrigido para Mermaid.**

## Abertura de uma edição e navegação entre páginas

```mermaid
sequenceDiagram
    actor Leitor
    participant Frontend
    participant Backend
    participant Storage as Object Storage (Supabase/R2)

    Leitor->>Frontend: Abre a edição 24
    Frontend->>Backend: GET /edicoes/24
    Backend-->>Frontend: metadados da edição
    Frontend->>Backend: GET /edicoes/24/paginas
    Backend-->>Frontend: lista de páginas (sem URL)
    Frontend-->>Leitor: renderiza índice / capa

    Leitor->>Frontend: Folheia para a página 2
    Frontend->>Backend: GET /edicoes/24/paginas/2/imagem (Bearer token, se não gratuita)
    Backend->>Backend: verifica capa/gratuita ou Pagamento status=PAGO
    Backend->>Storage: lê o objecto WebP
    Storage-->>Backend: imagem
    Backend-->>Frontend: imagem (ou 403, se sem acesso)
    Frontend-->>Leitor: exibe página 2

    Note over Frontend,Storage: Pré-carregamento da página seguinte, em paralelo
    Frontend->>Backend: GET /edicoes/24/paginas/3/imagem (antecipado)
    Backend->>Storage: lê o objecto WebP
    Storage-->>Backend: imagem
    Backend-->>Frontend: imagem (já em cache no cliente)
    Leitor->>Frontend: Folheia para a página 3
    Frontend-->>Leitor: transição instantânea
```

## Nota de desenho

Este diagrama assume que **todas as imagens passam pelo backend**, que valida o acesso a cada pedido — a opção mais simples de proteger, descrita como recomendação em [`04-architecture/deployment.md`](../04-architecture/deployment.md). Se se optar por URLs assinadas consumidas directamente pelo frontend a partir do Supabase/R2, o passo "lê o objecto WebP" passaria a ser uma resposta do backend com uma URL temporária, seguida de um pedido directo do Frontend ao Object Storage. **Este ponto ainda não foi decidido — fica para confirmar com o colega do frontend.**

## Upload e processamento (contexto — ver guia dedicado)

```mermaid
sequenceDiagram
    actor Admin
    participant Frontend
    participant Backend
    participant Storage as Object Storage

    Admin->>Frontend: Faz upload do PDF
    Frontend->>Backend: POST /edicoes/24/flipbook (multipart)
    Backend-->>Frontend: 202 Accepted, estado=PROCESSANDO

    Note over Backend,Storage: Processamento assíncrono — split + conversão WebP
    Backend->>Storage: grava cada página
    Storage-->>Backend: OK

    Frontend->>Backend: GET /edicoes/24 (polling)
    Backend-->>Frontend: estadoProcessamento=PRONTO
    Frontend-->>Admin: edição publicada
```

Ver [`08-implementation-guides/flipbook-microservice-guide.md`](../08-implementation-guides/flipbook-microservice-guide.md) para a implementação.
