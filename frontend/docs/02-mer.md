# Modelo Entidade-Relacionamento (MER)

## 1. Diagrama

```
┌───────────────────────────────┐
│           User                │
│───────────────────────────────│
│ PK email:        VARCHAR(255) │
│    name:         VARCHAR(150) │
│    password:     VARCHAR(255) │
│    role:         ENUM('admin',│
│                   'editor',  │
│                   'reader')  │
│    reader_id:    INT (FK*)   │  * NULL se role ≠ 'reader'
└───────────────────────────────┘
        │
        │ 1:1 (apenas se role='reader')
        ▼
┌───────────────────────────────┐
│          Reader               │
│───────────────────────────────│
│ PK id:            INT         │
│    name:          VARCHAR(150)│
│    email:         VARCHAR(255)│
│    created_at:    DATETIME    │
└───────────────────────────────┘
        │
        │ 1:N
        ├───────────────────────────────────────┐
        │                                       │
        ▼                                       ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│        Purchase            │   │        Favorite            │
│───────────────────────────│   │───────────────────────────│
│ PK id:       INT          │   │ PK id:       INT          │
│ FK reader_id: INT         │   │ FK reader_id: INT         │
│ FK edition_id: INT        │   │ FK edition_id: INT        │
│    purchased_at: DATETIME │   │    created_at: DATETIME   │
│                           │   │                           │
│ UNIQUE(reader_id,         │   │ UNIQUE(reader_id,         │
│        edition_id)        │   │        edition_id)        │
└───────────────────────────┘   └───────────────────────────┘
        │
        │ 1:N
        ▼
┌───────────────────────────┐
│     ReaderComment          │
│───────────────────────────│
│ PK id:       INT          │
│ FK reader_id: INT         │
│ FK edition_id: INT        │
│    text:      TEXT        │
│    created_at: DATETIME   │
└───────────────────────────┘

┌───────────────────────────────┐
│          Edition               │
│───────────────────────────────│
│ PK id:            INT         │
│    vol:           INT         │  ← número da edição
│    title:         VARCHAR(200)│
│    subtitle:      VARCHAR(300)│
│    description:   TEXT        │
│    cover_url:     VARCHAR(500)│
│    date_label:    VARCHAR(50) │  ← "Maio 2026"
│    date_iso:      DATE        │  ← "2026-05-12"
│    editor_name:   VARCHAR(150)│  ← nome (não FK, histórico)
│    language:      VARCHAR(50) │
│    pages:         INT         │
│    price:         INT         │  ← em cêntimos (AKZ)
│    is_free:       BOOLEAN     │
│    overview:      TEXT        │
│    status:        ENUM('draft'│
│                     ,'published')│
│    created_at:    DATETIME    │
│    updated_at:    DATETIME    │
└───────────────────────────────┘
        │
        │ 1:N
        ▼
┌───────────────────────────────┐
│    EditionTag                 │
│───────────────────────────────│
│ PK id:            INT         │
│ FK edition_id:    INT         │
│    tag:           VARCHAR(100)│
└───────────────────────────────┘

┌───────────────────────────────┐
│    EditionArticle              │
│───────────────────────────────│
│ PK id:            INT         │
│ FK edition_id:    INT         │
│    title:         VARCHAR(200)│
│    description:   TEXT        │
│    page:          INT         │
│    sort_order:    INT         │
└───────────────────────────────┘

┌───────────────────────────────┐
│  EditionTechnicalDetail        │
│───────────────────────────────│
│ PK id:            INT         │
│ FK edition_id:    INT         │
│    key:           VARCHAR(100)│
│    value:         VARCHAR(255)│
└───────────────────────────────┘

┌───────────────────────────────┐
│        Editor                  │
│───────────────────────────────│
│ PK id:            INT         │
│    name:          VARCHAR(150)│
│    email:         VARCHAR(255)│
│    status:        ENUM('active'│
│                     ,'inactive')│
│    created_at:    DATETIME    │
│    updated_at:    DATETIME    │
└───────────────────────────────┘
        │
        │ 1:N
        ▼
┌───────────────────────────────┐
│   EditorEditionAssignment      │
│───────────────────────────────│
│ PK id:            INT         │
│ FK editor_id:     INT         │
│ FK edition_id:    INT         │
│ UNIQUE(editor_id, edition_id) │
└───────────────────────────────┘

┌───────────────────────────────┐
│        Log                     │
│───────────────────────────────│
│ PK id:            INT         │
│    user_name:     VARCHAR(150)│
│    user_email:    VARCHAR(255)│
│    action:        VARCHAR(50) │  ← criou/editou/apagou
│    target_type:   VARCHAR(50) │  ← edicao/editor/leitor
│    target_id:     INT         │
│    target_name:   VARCHAR(200)│
│    details:       TEXT        │
│    created_at:    DATETIME    │
└───────────────────────────────┘

┌───────────────────────────────┐
│     FlipbookEdition            │
│───────────────────────────────│
│ PK id:            INT         │
│ FK edition_id:    INT (1:1)   │
└───────────────────────────────┘
        │
        │ 1:N
        ▼
┌───────────────────────────────┐
│     FlipbookPage               │
│───────────────────────────────│
│ PK id:            INT         │
│ FK flipbook_id:   INT         │
│    page_number:   INT         │
│    type:          ENUM('cover'│
│                     ,'content')│
│    image_url:     VARCHAR(500)│
│    sort_order:    INT         │
└───────────────────────────────┘
        │
        │ 1:N
        ▼
┌───────────────────────────────┐
│   FlipbookComment (interno)    │
│───────────────────────────────│
│ PK id:            INT         │
│ FK page_id:       INT         │
│    user:          VARCHAR(150)│
│    text:          TEXT        │
│    likes:         INT         │
│    x:             DECIMAL(5,2)│  ← % posição
│    y:             DECIMAL(5,2)│  ← % posição
│    created_at:    DATETIME    │
└───────────────────────────────┘
```

## 2. Relacionamentos Resumidos

| Entidade A | Card. | Entidade B | Descrição |
|------------|-------|------------|-----------|
| User | 1:1 | Reader | Apenas quando role='reader' |
| Reader | 1:N | Purchase | Um leitor pode comprar várias edições |
| Reader | 1:N | Favorite | Um leitor pode favoritar várias edições |
| Reader | 1:N | ReaderComment | Um leitor pode comentar várias edições |
| Edition | 1:N | Purchase | Uma edição pode ser comprada por vários leitores |
| Edition | 1:N | Favorite | Uma edição pode ser favoritada por vários leitores |
| Edition | 1:N | ReaderComment | Uma edição pode ter vários comentários |
| Edition | 1:N | EditionTag | Uma edição pode ter várias tags |
| Edition | 1:N | EditionArticle | Uma edição tem vários artigos |
| Edition | 1:N | EditionTechnicalDetail | Uma edição tem vários detalhes técnicos |
| Edition | 1:1 | FlipbookEdition | Uma edição tem um flipbook |
| FlipbookEdition | 1:N | FlipbookPage | Um flipbook tem várias páginas |
| FlipbookPage | 1:N | FlipbookComment | Uma página pode ter vários comentários internos |
| Editor | 1:N | EditorEditionAssignment | Um editor gere várias edições |
| Edition | 1:N | EditorEditionAssignment | Uma edição pode ter vários editores |

## 3. Observações sobre o Modelo

### `editions.editor_name` (string, não FK)

O campo `editor_name` na tabela `editions` guarda o nome do editor responsável no momento da publicação. Isto é intencional: se o editor mudar de nome ou for removido, o histórico da edição mantém-se correcto. A relação activa editor-edição é feita via `EditorEditionAssignment`.

### `editions.price` (INT em cêntimos)

No mock actual o preço é uma string (`"AKZ 2.900"`). Na BD deve ser um inteiro em cêntimos (ex: `290000`) para permitir cálculos, agregações e conversão cambial sem parsing.

### `editions.date_label` vs `editions.date_iso`

`date_label` é a string formatada (ex: "Maio 2026") para exibição directa. `date_iso` é a data real para ordenação e filtros. O front-end pode derivar `date_label` a partir de `date_iso`, mas mantém-se por conveniência e para evitar quebra de layouts existentes.

### `User` vs `Reader` vs `Editor`

- **User**: Tabela de autenticação universal. Contém credenciais e role.
- **Reader**: Perfil do leitor (dados públicos, sem credenciais).
- **Editor**: Perfil do editor (staff, pode ter ou não user associado).

Isto permite que um editor tenha conta de acesso (`User`) sem duplicar dados de perfil, e que leitores existam na BD mesmo antes de criarem conta (ex: importados de uma newsletter).

### Logs como tabela única

A tabela `logs` usa `target_type` + `target_id` para referenciar qualquer entidade (polimorfismo fraco). Isto simplifica o schema e evita múltiplas tabelas de log. A integridade referencial é mantida a nível de aplicação, não de BD.

---

## 4. Notação Compacta (Formato Tabular)

```
User(email, name, password_hash, role, reader_id)
    PK: email
    FK: reader_id → Reader(id)

Reader(id, name, email, created_at)
    PK: id

Editor(id, name, email, status, created_at, updated_at)
    PK: id

EditorEditionAssignment(id, editor_id, edition_id)
    PK: id
    FK: editor_id → Editor(id)
    FK: edition_id → Edition(id)
    UNIQUE(editor_id, edition_id)

Edition(id, vol, title, subtitle, description, cover_url, date_label,
       date_iso, editor_name, language, pages, price, is_free,
       overview, status, created_at, updated_at)
    PK: id

EditionTag(id, edition_id, tag)
    PK: id
    FK: edition_id → Edition(id) ON DELETE CASCADE

EditionArticle(id, edition_id, title, description, page, sort_order)
    PK: id
    FK: edition_id → Edition(id) ON DELETE CASCADE

EditionTechnicalDetail(id, edition_id, key, value)
    PK: id
    FK: edition_id → Edition(id) ON DELETE CASCADE

Purchase(id, reader_id, edition_id, purchased_at)
    PK: id
    FK: reader_id → Reader(id)
    FK: edition_id → Edition(id)
    UNIQUE(reader_id, edition_id)

Favorite(id, reader_id, edition_id, created_at)
    PK: id
    FK: reader_id → Reader(id)
    FK: edition_id → Edition(id)
    UNIQUE(reader_id, edition_id)

ReaderComment(id, reader_id, edition_id, text, created_at)
    PK: id
    FK: reader_id → Reader(id)
    FK: edition_id → Edition(id)

Log(id, user_name, user_email, action, target_type, target_id,
    target_name, details, created_at)
    PK: id

FlipbookEdition(id, edition_id)
    PK: id
    FK: edition_id → Edition(id) ON DELETE CASCADE

FlipbookPage(id, flipbook_id, page_number, type, image_url, sort_order)
    PK: id
    FK: flipbook_id → FlipbookEdition(id) ON DELETE CASCADE

FlipbookComment(id, page_id, user, text, likes, x, y, created_at)
    PK: id
    FK: page_id → FlipbookPage(id) ON DELETE CASCADE
```
