# Diagrama de Classes (UML) — v3 (corrigido)

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md). Nomes de classes e campos em **inglês** (código), com o nome da coluna/tabela em português entre parênteses onde difere — ver [`03-data-model/data-ditionary.md`](../03-data-model/data-ditionary.md) para os nomes reais na base de dados.

```mermaid
classDiagram
    class User {
        +Long id
        +String firstName
        +String lastName
        +LocalDate birthDate
        +String email
        +String passwordHash
        +String role
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
        +LocalDateTime deletedAt
    }

    class Magazine {
        +Long id
        +String name
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
        +LocalDateTime deletedAt
    }

    class Edition {
        +Long id
        +String theme
        +String tagline
        +String description
        +Long price
        +Integer pageCount
        +Integer number
        +LocalDate releaseDate
        +Boolean free
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
        +LocalDateTime deletedAt
    }

    class Payment {
        +Long id
        +Long amount
        +String status
        +String paymentMethod
        +String externalReference
        +LocalDateTime paidAt
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
    }

    class EditionEditor {
        +Long id
        +LocalDateTime createdAt
    }

    class EditionTag {
        +Long id
        +String tag
        +LocalDateTime createdAt
    }

    class EditionArticle {
        +Long id
        +String title
        +String description
        +Integer page
        +Integer order
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
        +LocalDateTime deletedAt
    }

    class Favorite {
        +Long id
        +LocalDateTime createdAt
    }

    class ActivityLog {
        +Long id
        +String actorName
        +String actorEmail
        +String action
        +String targetType
        +Long targetId
        +LocalDateTime createdAt
    }

    class EditionFlipbook {
        +Long id
        +String processingState
        +LocalDateTime generatedAt
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
    }

    class FlipbookPage {
        +Long id
        +Integer pageNumber
        +String type
        +String imageUrl
        +Integer order
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
        +LocalDateTime deletedAt
    }

    class FlipbookComment {
        +Long id
        +String text
        +Integer likes
        +BigDecimal x
        +BigDecimal y
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
        +LocalDateTime deletedAt
    }

    Magazine "1" --> "0..*" Edition : groups
    User "1" --> "0..*" Payment : makes
    Payment "*" --> "1" Edition : refers to
    User "1" --> "0..*" EditionEditor : assigned via
    Edition "1" --> "0..*" EditionEditor : has editors via
    Edition "1" --> "0..*" EditionTag : has
    Edition "1" --> "0..*" EditionArticle : contains
    User "1" --> "0..*" Favorite : marks via
    Edition "1" --> "0..*" Favorite : marked via
    Edition "1" --> "1" EditionFlipbook : generates
    EditionFlipbook "1" --> "0..*" FlipbookPage : contains
    FlipbookPage "1" --> "0..*" FlipbookComment : receives
    User "1" --> "0..*" FlipbookComment : writes
```

## Correspondência classe Java ↔ tabela na base de dados

| Classe (código, EN) | Tabela (BD, PT) |
|---|---|
| `User` | `utilizador` |
| `Magazine` | `revista` |
| `Edition` | `edicao` |
| `Payment` | `pagamento` |
| `EditionEditor` | `editor_edicao` |
| `EditionTag` | `edicao_tag` |
| `EditionArticle` | `edicao_artigo` |
| `Favorite` | `favorito` |
| `ActivityLog` | `log` |
| `EditionFlipbook` | `flipbook_edicao` |
| `FlipbookPage` | `flipbook_pagina` |
| `FlipbookComment` | `flipbook_comentario` |

Cada campo é mapeado individualmente via `@Column(name = "...")` — ver exemplo completo em [`08-implementation-guides/crud-implementation-guide.md`](../08-implementation-guides/crud-implementation-guide.md).
