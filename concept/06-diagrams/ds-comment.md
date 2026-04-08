# Diagrama de Sequência – Comentários e Respostas

O fluxo abaixo mostra como os utilizadores criam, respondem, editam e eliminam comentários nas páginas da revista. A hierarquia é mantida através do campo `id_pai`.

```mermaid
sequenceDiagram
    participant Utilizador
    participant Frontend
    participant Controller as ComentarioController
    participant Service as ComentarioService
    participant Repository as ComentarioRepository

    Utilizador->>Frontend: Abre página da revista (ex: página 15)
    Frontend->>Controller: GET /api/v1/paginas/{id}/comentarios
    Controller->>Service: listarComentarios(paginaId)
    Service->>Repository: findComentariosByPaginaIdOrderByData(paginaId)
    Repository-->>Service: Lista de comentários (planos)
    Service->>Service: Organiza hierarquia (pai/respostas)
    Service-->>Controller: List<ComentarioResponseDTO> (árvore)
    Controller-->>Frontend: 200 OK
    Frontend-->>Utilizador: Exibe comentários e respostas

    Utilizador->>Frontend: Escreve texto e clica "Comentar"
    Frontend->>Controller: POST /api/v1/comentarios { texto, id_pagina }
    Note over Frontend,Controller: id_pai = null (comentário raiz)
    Controller->>Service: criarComentario(utilizadorId, dto)
    Service->>Service: Valida autenticação, define data_efetiv = now()
    Service->>Repository: save(comentario)
    Repository-->>Service: Comentário salvo
    Service-->>Controller: ComentarioResponseDTO
    Controller-->>Frontend: 201 Created
    Frontend-->>Utilizador: Comentário publicado

    Utilizador->>Frontend: Clica "Responder" num comentário
    Frontend->>Controller: POST /api/v1/comentarios { texto, id_pagina, id_pai }
    Note over Frontend,Controller: id_pai = id do comentário original
    Controller->>Service: criarComentario(utilizadorId, dto)
    Service->>Repository: findById(id_pai)
    alt Comentário pai existe e pertence à mesma página
        Repository-->>Service: Comentário pai encontrado
        Service->>Service: Define data_efetiv = now()
        Service->>Repository: save(comentarioFilho)
        Repository-->>Service: Resposta salva
        Service-->>Controller: ComentarioResponseDTO (com id_pai)
        Controller-->>Frontend: 201 Created
        Frontend-->>Utilizador: Resposta publicada
    else Comentário pai inválido
        Service-->>Controller: 422 Unprocessable Entity
        Controller-->>Frontend: Erro: "Comentário pai inválido"
        Frontend-->>Utilizador: Mensagem de erro
    end

    Utilizador->>Frontend: Edita texto de um comentário seu
    Frontend->>Controller: PUT /api/v1/comentarios/{id} { texto }
    Controller->>Service: editarComentario(utilizadorId, id, novoTexto)
    Service->>Repository: findById(id)
    alt Comentário existe e pertence ao utilizador
        Service->>Repository: update(texto, updatedAt)
        Repository-->>Service: OK
        Service-->>Controller: ComentarioResponseDTO actualizado
        Controller-->>Frontend: 200 OK
        Frontend-->>Utilizador: Comentário actualizado
    else Sem permissão
        Service-->>Controller: 403 Forbidden
        Controller-->>Frontend: "Não autorizado"
        Frontend-->>Utilizador: Erro de permissão
    end

    Utilizador->>Frontend: Elimina um comentário seu
    Frontend->>Controller: DELETE /api/v1/comentarios/{id}
    Controller->>Service: eliminarComentario(utilizadorId, id)
    Service->>Repository: findById(id)
    alt Comentário existe e pertence ao utilizador (ou admin)
        Service->>Repository: softDelete(id) (deletedAt = now())
        Repository-->>Service: OK
        Service-->>Controller: 204 No Content
        Controller-->>Frontend: 204
        Frontend-->>Utilizador: Comentário removido (apenas oculto)
    else Sem permissão
        Service-->>Controller: 403 Forbidden
        Controller-->>Frontend: "Não autorizado"
        Frontend-->>Utilizador: Erro
    end