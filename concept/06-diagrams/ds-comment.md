# Diagrama de Sequência – Comentários e Respostas

Este diagrama ilustra o fluxo de criação de comentários e respostas em páginas específicas da revista, bem como a listagem dos comentários com hierarquia.

```mermaid
sequenceDiagram
    participant Leitor
    participant Frontend
    participant Controller as ComentarioController
    participant Service as ComentarioService
    participant Repository as ComentarioRepository

    %% 1. Leitor acede a uma página da revista
    Leitor->>Frontend: Abre página da revista (ex: página 15)
    Frontend->>Controller: GET /api/v1/paginas/{id}/comentarios
    Controller->>Service: listarComentarios(paginaId)
    Service->>Repository: findComentariosByPaginaIdOrderByData(paginaId)
    Repository-->>Service: Lista de comentários (planos ou aninhados)
    Service->>Service: Organiza hierarquia (comentários pai e respostas)
    Service-->>Controller: List<ComentarioResponseDTO> (com estrutura de árvore)
    Controller-->>Frontend: 200 OK (lista de comentários formatada)
    Frontend-->>Leitor: Exibe comentários e respostas

    %% 2. Leitor escreve um comentário novo (comentário pai)
    Leitor->>Frontend: Escreve texto e clica "Comentar"
    Frontend->>Controller: POST /api/v1/comentarios { texto, id_pagina }
    Note over Frontend,Controller: id_pai = null (comentário raiz)
    Controller->>Service: criarComentario(leitorId, dto)
    Service->>Service: Valida se leitor está autenticado
    Service->>Service: Define data_efetiv = now()
    Service->>Repository: save(comentario)
    Repository-->>Service: Comentário salvo (com id gerado)
    Service-->>Controller: ComentarioResponseDTO
    Controller-->>Frontend: 201 Created
    Frontend-->>Leitor: Comentário publicado

    %% 3. Leitor responde a um comentário existente
    Leitor->>Frontend: Clica "Responder" num comentário
    Frontend->>Controller: POST /api/v1/comentarios { texto, id_pagina, id_pai }
    Note over Frontend,Controller: id_pai = id do comentário original
    Controller->>Service: criarComentario(leitorId, dto)
    Service->>Service: Valida se id_pai existe na mesma página
    Service->>Repository: findById(id_pai)
    alt Comentário pai existe e pertence à mesma página
        Repository-->>Service: Comentário pai encontrado
        Service->>Service: Define data_efetiv = now()
        Service->>Repository: save(comentarioFilho)
        Repository-->>Service: Resposta salva
        Service-->>Controller: ComentarioResponseDTO (com id_pai preenchido)
        Controller-->>Frontend: 201 Created
        Frontend-->>Leitor: Resposta publicada
    else Comentário pai não existe ou pertence a outra página
        Service-->>Controller: 422 Unprocessable Entity
        Controller-->>Frontend: Erro: "Comentário pai inválido"
        Frontend-->>Leitor: Mensagem de erro
    end

    %% 4. Leitor edita seu próprio comentário 
    Leitor->>Frontend: Edita texto de um comentário seu
    Frontend->>Controller: PUT /api/v1/comentarios/{id} { texto }
    Controller->>Service: editarComentario(leitorId, id, novoTexto)
    Service->>Repository: findById(id)
    alt Comentário existe e pertence ao leitor
        Service->>Repository: update(texto, updatedAt)
        Repository-->>Service: OK
        Service-->>Controller: ComentarioResponseDTO actualizado
        Controller-->>Frontend: 200 OK
        Frontend-->>Leitor: Comentário actualizado
    else Comentário não pertence ao leitor
        Service-->>Controller: 403 Forbidden
        Controller-->>Frontend: "Não autorizado"
        Frontend-->>Leitor: Erro de permissão
    end

    %% 5. Leitor elimina seu comentário (soft delete)
    Leitor->>Frontend: Elimina um comentário seu
    Frontend->>Controller: DELETE /api/v1/comentarios/{id}
    Controller->>Service: eliminarComentario(leitorId, id)
    Service->>Repository: findById(id)
    alt Comentário existe e pertence ao leitor ou é admin
        Service->>Repository: softDelete(id) (deletedAt = now())
        Repository-->>Service: OK
        Service-->>Controller: 204 No Content
        Controller-->>Frontend: 204
        Frontend-->>Leitor: Comentário removido (apenas oculto)
    else Sem permissão
        Service-->>Controller: 403 Forbidden
        Controller-->>Frontend: "Não autorizado"
        Frontend-->>Leitor: Erro
    end