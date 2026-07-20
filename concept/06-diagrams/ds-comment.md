# Diagrama de Sequência – Comentários e Likes — v3

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md). Substitui por completo a versão anterior (que tinha resposta aninhada e dois modelos de comentário). Agora existe apenas `FlipbookComentario`, sem resposta, com `likes`.

```mermaid
sequenceDiagram
    participant Utilizador
    participant Frontend
    participant Controller as FlipbookComentarioController
    participant Service as FlipbookComentarioService
    participant Repository as FlipbookComentarioRepository

    Utilizador->>Frontend: Abre a página 15 do flipbook
    Frontend->>Controller: GET /api/v1/pages/{pageId}/comments
    Controller->>Service: listar(idPagina)
    Service->>Repository: findByIdPaginaAndRemovidoEmIsNull(idPagina)
    Repository-->>Service: Lista de comentários
    Service-->>Controller: List<FlipbookComentarioResponseDTO>
    Controller-->>Frontend: 200 OK
    Frontend-->>Utilizador: Exibe comentários posicionados sobre a imagem

    Utilizador->>Frontend: Clica num ponto da página e escreve um comentário
    Frontend->>Controller: POST /api/v1/pages/{pageId}/comments { text, x, y }
    Controller->>Service: criar(idUtilizador, idPagina, dto)
    Service->>Service: valida autenticação
    Service->>Repository: save(comentario, likes = 0)
    Repository-->>Service: Comentário guardado
    Service-->>Controller: FlipbookComentarioResponseDTO
    Controller-->>Frontend: 201 Created
    Frontend-->>Utilizador: Comentário publicado

    Utilizador->>Frontend: Clica "gostar" num comentário
    Frontend->>Controller: POST /api/v1/pages/{pageId}/comments/{commentId}/like
    Controller->>Service: registarLike(idUtilizador, idComentario)
    Service->>Repository: findById(idComentario)
    alt Comentário existe
        Service->>Repository: incrementarLikes(idComentario)
        Repository-->>Service: OK
        Service-->>Controller: { likes: n+1 }
        Controller-->>Frontend: 200 OK
        Frontend-->>Utilizador: Contador de likes actualizado
    else Comentário não existe
        Service-->>Controller: 404 Not Found
        Controller-->>Frontend: Erro
        Frontend-->>Utilizador: Mensagem de erro
    end

    Utilizador->>Frontend: Edita texto de um comentário seu
    Frontend->>Controller: PUT /api/v1/pages/{pageId}/comments/{commentId} { text }
    Controller->>Service: editar(idUtilizador, idComentario, novoTexto)
    Service->>Repository: findById(idComentario)
    alt Comentário existe e pertence ao utilizador
        Service->>Repository: update(texto, atualizado_em)
        Repository-->>Service: OK
        Service-->>Controller: FlipbookComentarioResponseDTO actualizado
        Controller-->>Frontend: 200 OK
    else Sem permissão
        Service-->>Controller: 403 Forbidden
        Controller-->>Frontend: "Não autorizado"
    end

    Utilizador->>Frontend: Elimina um comentário seu
    Frontend->>Controller: DELETE /api/v1/pages/{pageId}/comments/{commentId}
    Controller->>Service: eliminar(idUtilizador, idComentario)
    Service->>Repository: findById(idComentario)
    alt Comentário existe e pertence ao utilizador (ou admin)
        Service->>Repository: softDelete(idComentario) (removido_em = now())
        Repository-->>Service: OK
        Service-->>Controller: 204 No Content
        Controller-->>Frontend: 204
    else Sem permissão
        Service-->>Controller: 403 Forbidden
        Controller-->>Frontend: "Não autorizado"
    end
```

## Nota sobre likes duplicados

Este diagrama assume, para simplicidade, um incremento directo em `likes`. Como referido em [`comments-endpoints.md`](../05-api/comments-endpoints.md), impedir que o mesmo utilizador dê like duas vezes requer uma tabela de junção adicional (`flipbook_comentario_like`) — não estava no MER decidido em reunião, fica como proposta a confirmar.
