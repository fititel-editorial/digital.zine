# Diagrama de Classes (UML)

O diagrama abaixo mostra as principais entidades do sistema, seus atributos mais relevantes e os relacionamentos.  
As classes estão simplificadas para foco na modelagem de domínio.

```mermaid
classDiagram
    class Leitor {
        +Long id
        +String p_nome
        +String sb_nome
        +String email
        +String genero
        +String palavra_passe
        +LocalDate data_nasc
        +String role
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
        +LocalDateTime deletedAt
    }

    class Revista {
        +Long id
        +String nome
        +Integer ano_lancamento
        +String url
        +BigDecimal preco
        +Integer qtd_paginas
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
        +LocalDateTime deletedAt
    }

    class Edicao {
        +Long id
        +Integer numero
        +String tema
        +String lema
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
        +LocalDateTime deletedAt
    }

    class Pagina {
        +Long id
        +Integer num_pagina
        +String nome_projeto
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
        +LocalDateTime deletedAt
    }

    class Pagamento {
        +Long id
        +String metodo
        +String estado
        +String url_comprov
        +String token_acesso
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
        +LocalDateTime deletedAt
    }

    class Comentario {
        +Long id
        +String texto
        +LocalDateTime data_efetiv
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
        +LocalDateTime deletedAt
    }

    class Autor_Revista {
        +Long id
        +String nome_autor
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
        +LocalDateTime deletedAt
    }

    %% Relacionamentos
    Leitor "1" --> "0..*" Pagamento : faz
    Pagamento "*" --> "1" Revista : refere-se a
    Revista "*" --> "1" Edicao : pertence a
    Revista "1" --> "0..*" Pagina : contém
    Pagina "1" --> "0..*" Comentario : recebe
    Leitor "1" --> "0..*" Comentario : escreve
    Comentario "0..1" --> "0..*" Comentario : respostas
    Revista "1" --> "0..*" Autor_Revista : tem
    Leitor "1" --> "0..*" Revista : (admin) publica