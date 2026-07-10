# Documentação da API REST — Revista FITITEL

## Base URL

```
https://api.fittel.co/v1
```

## Autenticação

Todas as rotas protegidas exigem o header:

```
Authorization: Bearer <token>
```

O token é obtido via `POST /auth/login` ou `POST /auth/register`.  
Os roles disponíveis: `admin`, `editor`, `reader`.

---

## 1. Autenticação

### `POST /auth/login`

Autentica um utilizador e retorna um token JWT.

**Request:**
```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "email": "joao@email.com",
    "name": "João Leitor",
    "role": "reader",
    "readerId": 1
  }
}
```

**Response (401):**
```json
{
  "error": "invalid_credentials",
  "message": "Email ou palavra-passe incorrectos."
}
```

---

### `POST /auth/register`

Regista um novo leitor.

**Request:**
```json
{
  "name": "Novo Leitor",
  "email": "novo@email.com",
  "password": "minhaSenha123"
}
```

**Constraints:**
- `name`: 2–150 caracteres
- `email`: formato email válido, único no sistema
- `password`: mínimo 6 caracteres

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "email": "novo@email.com",
    "name": "Novo Leitor",
    "role": "reader",
    "readerId": 3
  }
}
```

**Response (409):**
```json
{
  "error": "email_taken",
  "message": "Este email já está registado."
}
```

---

### `GET /auth/me`

Retorna o utilizador autenticado.  
**Protegido:** sim  
**Roles:** any

**Response (200):**
```json
{
  "email": "joao@email.com",
  "name": "João Leitor",
  "role": "reader",
  "readerId": 1
}
```

---

### `POST /auth/logout`

Invalida o token actual.  
**Protegido:** sim  
**Roles:** any

**Response (200):**
```json
{
  "message": "Sessão terminada."
}
```

---

## 2. Edições (Público)

### `GET /editions`

Lista edições publicadas, ordenadas por data descendente.

**Query params:**
| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| `limit` | int | 20 | Nº máximo de resultados |
| `offset` | int | 0 | Paginação |
| `tag` | string | — | Filtrar por tag |
| `free` | boolean | — | Filtrar gratuitas (`true`) ou pagas (`false`) |
| `q` | string | — | Pesquisa por título/descrição |

**Response (200):**
```json
{
  "data": [
    {
      "id": 24,
      "vol": 24,
      "title": "Dados que Contam Histórias",
      "subtitle": "Inovação, Talento e Futuro Digital em Angola",
      "description": "Histórias, entrevistas e análises...",
      "cover": "/images/datastream-cover.png",
      "date": "Maio 2026",
      "dateIso": "2026-05-12",
      "pages": 120,
      "price": 290000,
      "currency": "AKZ",
      "isFree": true,
      "tags": ["Tecnologia", "Negócios"],
      "status": "published"
    }
  ],
  "meta": {
    "total": 4,
    "limit": 20,
    "offset": 0
  }
}
```

---

### `GET /editions/:id`

Retorna detalhe completo de uma edição.

**Response (200):**
```json
{
  "id": 24,
  "vol": 24,
  "title": "Dados que Contam Histórias",
  "subtitle": "Inovação, Talento e Futuro Digital em Angola",
  "description": "Histórias, entrevistas e análises...",
  "cover": "/images/datastream-cover.png",
  "date": "Maio 2026",
  "dateIso": "2026-05-12",
  "editor": "Ana Pereira",
  "language": "Português",
  "pages": 120,
  "price": 290000,
  "currency": "AKZ",
  "isFree": true,
  "tags": ["Tecnologia", "Negócios", "Casos Reais", "Edição Especial"],
  "overview": "Esta edição da FITITEL mergulha...",
  "articles": [
    {
      "title": "Mapeando o ecossistema de startups em Luanda",
      "description": "Um panorama atualizado dos hubs de inovação",
      "page": 12
    }
  ],
  "technicalDetails": {
    "isbn": "978-3-16-148410-0",
    "format": "Digital (PDF/EPUB) + Flipbook",
    "dimensions": "210 x 297 mm (A4)",
    "publisher": "FITITEL Publishing, Luanda"
  },
  "status": "published",
  "relatedEditions": [23, 22],
  "createdAt": "2026-05-10T09:00:00Z",
  "updatedAt": "2026-05-12T10:00:00Z"
}
```

**Response (404):**
```json
{
  "error": "not_found",
  "message": "Edição não encontrada."
}
```

---

### `GET /editions/:id/flipbook`

Retorna dados do flipbook (páginas e comentários internos).  
**Protegido:** condicional  
— Se `isFree === true` → acesso livre  
— Se `isFree === false` → requer `role: reader` + compra verificada

**Response (200):**
```json
{
  "vol": 24,
  "title": "Dados que Contam Histórias",
  "pages": [
    {
      "id": 1,
      "type": "cover",
      "image": "/images/datastream-cover.png",
      "num": null
    },
    {
      "id": 2,
      "type": "content",
      "image": "https://cdn.fittel.co/flipbook/24/page-2.jpg",
      "num": 2
    }
  ],
  "comments": [
    {
      "id": 101,
      "pageId": 6,
      "user": "Ana Costa",
      "text": "Adoro este parágrafo de abertura.",
      "likes": 12,
      "x": 10,
      "y": 20,
      "timeAgo": "há 3 min",
      "createdAt": "2026-05-12T14:00:00Z"
    }
  ]
}
```

**Response (403) — sem acesso:**
```json
{
  "error": "purchase_required",
  "message": "É necessário adquirir esta edição para aceder ao flipbook completo."
}
```

---

## 3. Compras (Leitor)

### `GET /purchases`

Lista compras do leitor autenticado.  
**Protegido:** sim  
**Roles:** reader

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "edition": {
        "id": 23,
        "vol": 23,
        "title": "Design e Criatividade Artificial",
        "cover": "/images/nebula-artist-cover.png"
      },
      "purchasedAt": "2026-06-01T10:30:00Z"
    }
  ]
}
```

---

### `POST /purchases`

Compra uma edição.  
**Protegido:** sim  
**Roles:** reader

**Request:**
```json
{
  "editionId": 23
}
```

**Response (201):**
```json
{
  "id": 3,
  "editionId": 23,
  "purchasedAt": "2026-07-09T12:00:00Z"
}
```

**Response (409) — já comprada:**
```json
{
  "error": "already_purchased",
  "message": "Já adquiriu esta edição."
}
```

---

### `DELETE /purchases/:id`

Remove uma compra (reembolso).  
**Protegido:** sim  
**Roles:** reader (apenas próprias), admin

**Response (200):**
```json
{
  "message": "Compra removida."
}
```

---

## 4. Favoritos (Leitor)

### `GET /favorites`

Lista favoritos do leitor autenticado.  
**Protegido:** sim  
**Roles:** reader

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "edition": {
        "id": 24,
        "vol": 24,
        "title": "Dados que Contam Histórias",
        "cover": "/images/datastream-cover.png"
      },
      "createdAt": "2026-05-15T09:00:00Z"
    }
  ]
}
```

---

### `POST /favorites`

Adiciona edição aos favoritos (toggle).  
**Protegido:** sim  
**Roles:** reader

**Request:**
```json
{
  "editionId": 24
}
```

**Response (201):**
```json
{
  "message": "Edição adicionada aos favoritos.",
  "favorited": true
}
```

Se já estava favoritada, remove:
```json
{
  "message": "Edição removida dos favoritos.",
  "favorited": false
}
```

---

## 5. Comentários de Leitores

### `GET /editions/:id/comments`

Comentários públicos de leitores numa edição.  
**Protegido:** não

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "reader": {
        "id": 1,
        "name": "João Leitor"
      },
      "text": "Excelente artigo sobre open data!",
      "createdAt": "2026-05-15T10:00:00Z"
    }
  ]
}
```

---

### `POST /editions/:id/comments`

Adiciona comentário a uma edição.  
**Protegido:** sim  
**Roles:** reader

**Request:**
```json
{
  "text": "Adorei esta edição!"
}
```

**Constraints:**
- `text`: 1–500 caracteres

**Response (201):**
```json
{
  "id": 6,
  "editionId": 24,
  "text": "Adorei esta edição!",
  "createdAt": "2026-07-09T12:00:00Z"
}
```

---

## 6. Gestão — Edições (Admin/Editor)

### `GET /admin/editions`

Lista todas as edições (incluindo rascunhos).  
**Protegido:** sim  
**Roles:** admin, editor

**Query params:**
| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| `limit` | int | 50 | Nº máximo de resultados |
| `offset` | int | 0 | Paginação |
| `status` | string | — | Filtrar por status (`draft`, `published`) |

---

### `POST /admin/editions`

Cria uma nova edição.  
**Protegido:** sim  
**Roles:** admin, editor

**Request:**
```json
{
  "vol": 25,
  "title": "Nova Edição",
  "subtitle": "Subtítulo da edição",
  "description": "Descrição curta...",
  "cover": "/images/nova-cover.png",
  "date": "Julho 2026",
  "dateIso": "2026-07-15",
  "language": "Português",
  "pages": 100,
  "price": 290000,
  "currency": "AKZ",
  "isFree": false,
  "tags": ["Tecnologia"],
  "overview": "Texto longo...",
  "articles": [
    { "title": "Artigo 1", "description": "Desc...", "page": 10 }
  ],
  "technicalDetails": {
    "isbn": "978-3-16-148410-4",
    "format": "Digital (PDF/EPUB) + Flipbook",
    "dimensions": "210 x 297 mm (A4)",
    "publisher": "FITITEL Publishing, Luanda"
  },
  "status": "draft",
  "editorIds": [1, 2]
}
```

**Response (201):**
```json
{
  "id": 25,
  "vol": 25,
  "title": "Nova Edição",
  "status": "draft",
  "createdAt": "2026-07-09T12:00:00Z"
}
```

---

### `PUT /admin/editions/:id`

Actualiza uma edição.  
**Protegido:** sim  
**Roles:** admin, editor  
**Body:** mesmos campos que POST (parcial)

**Response (200):**
```json
{
  "id": 25,
  "message": "Edição actualizada.",
  "updatedAt": "2026-07-09T13:00:00Z"
}
```

---

### `DELETE /admin/editions/:id`

Remove uma edição.  
**Protegido:** sim  
**Roles:** admin

**Response (200):**
```json
{
  "message": "Edição removida."
}
```

---

## 7. Gestão — Editores (Admin)

### `GET /admin/editors`

Lista todos os editores.  
**Protegido:** sim  
**Roles:** admin

---

### `POST /admin/editors`

Cria um novo editor.  
**Protegido:** sim  
**Roles:** admin

**Request:**
```json
{
  "name": "Novo Editor",
  "email": "novo@fittel.co",
  "status": "active",
  "editionIds": []
}
```

---

### `PUT /admin/editors/:id`

Actualiza um editor.  
**Protegido:** sim  
**Roles:** admin

---

### `DELETE /admin/editors/:id`

Remove um editor.  
**Protegido:** sim  
**Roles:** admin

---

## 8. Gestão — Leitores (Admin)

### `GET /admin/readers`

Lista todos os leitores com estatísticas.  
**Protegido:** sim  
**Roles:** admin

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "João Leitor",
      "email": "joao@email.com",
      "stats": {
        "purchases": 1,
        "favorites": 1,
        "comments": 2
      },
      "createdAt": "2026-01-15T09:00:00Z"
    }
  ]
}
```

---

### `GET /admin/readers/:id`

Detalhe completo de um leitor, com listas de compras, favoritos e comentários.  
**Protegido:** sim  
**Roles:** admin

**Response (200):**
```json
{
  "id": 1,
  "name": "João Leitor",
  "email": "joao@email.com",
  "purchases": [
    {
      "editionId": 23,
      "editionTitle": "Design e Criatividade Artificial",
      "editionVol": 23,
      "purchasedAt": "2026-06-01T10:30:00Z"
    }
  ],
  "favorites": [
    {
      "editionId": 24,
      "editionTitle": "Dados que Contam Histórias",
      "editionVol": 24,
      "createdAt": "2026-05-15T09:00:00Z"
    }
  ],
  "comments": [
    {
      "id": 1,
      "editionId": 24,
      "editionTitle": "Dados que Contam Histórias",
      "text": "Excelente artigo sobre open data!",
      "createdAt": "2026-05-15T10:00:00Z"
    }
  ],
  "createdAt": "2026-01-15T09:00:00Z"
}
```

---

## 9. Relatórios (Admin)

### `GET /admin/reports/overview`

Métricas do dashboard.  
**Protegido:** sim  
**Roles:** admin

**Response (200):**
```json
{
  "totalEditions": 42,
  "publishedThisYear": 5,
  "totalEditors": 4,
  "activeEditors": 3,
  "totalReaders": 25000,
  "totalRevenue": 2840000,
  "revenueThisMonth": 986000,
  "avgRating": 4.7
}
```

---

### `GET /admin/reports/revenue`

Receita por edição e por mês.  
**Protegido:** sim  
**Roles:** admin

**Response (200):**
```json
{
  "byEdition": [
    {
      "vol": 24,
      "title": "Dados que Contam Histórias",
      "sales": 340,
      "revenue": 986000,
      "period": "Mai 2026",
      "growth": 12.5
    }
  ],
  "monthly": [
    {
      "month": "Jan",
      "revenue": 450000,
      "subscribers": 980
    }
  ]
}
```

---

## 10. Logs (Admin)

### `GET /admin/logs`

Lista de logs de actividade.  
**Protegido:** sim  
**Roles:** admin

**Query params:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `user` | string | Filtrar por email do utilizador |
| `action` | string | Filtrar por acção (`criou`, `editou`, `apagou`) |
| `targetType` | string | Filtrar por tipo (`edicao`, `editor`, `leitor`) |
| `limit` | int | Nº máximo (default 50) |
| `offset` | int | Paginação |

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "user": "Ana Pereira",
      "userEmail": "ana@fittel.co",
      "action": "criou",
      "targetType": "edicao",
      "targetId": 24,
      "targetName": "Dados que Contam Histórias",
      "details": "Criou a edição com 5 artigos, 120 páginas",
      "createdAt": "2026-05-10T09:15:00Z"
    }
  ],
  "meta": {
    "total": 7,
    "limit": 50,
    "offset": 0
  }
}
```

---

## 11. Dashboard (Admin & Editor)

### `GET /admin/dashboard`

Métricas do dashboard.  
**Protegido:** sim  
**Roles:** admin, editor

O conteúdo varia por role:
- **Admin**: todas as métricas (incluindo receita e leitores)
- **Editor**: apenas métricas de edições e editores (sem receita)

---

## 12. Upload de Ficheiros

### `POST /upload`

Upload de imagem/PDF para a CDN.  
**Protegido:** sim  
**Roles:** admin, editor

**Request:** `multipart/form-data`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `file` | file | O ficheiro a enviar |
| `type` | string | `cover` ou `pdf` |

**Response (201):**
```json
{
  "url": "https://cdn.fittel.co/covers/edition-25-cover.png"
}
```

**Constraints:**
- Formatos permitidos: PNG, JPG, JPEG, PDF
- Tamanho máximo: 10MB (capa), 50MB (PDF)

---

## 13. Resumo de Endpoints

| Método | Path | Auth | Roles | Descrição |
|--------|------|------|-------|-----------|
| POST | `/auth/login` | — | — | Login |
| POST | `/auth/register` | — | — | Registo |
| GET | `/auth/me` | ✓ | any | Perfil actual |
| POST | `/auth/logout` | ✓ | any | Logout |
| GET | `/editions` | — | — | Lista edições |
| GET | `/editions/:id` | — | — | Detalhe edição |
| GET | `/editions/:id/flipbook` | cond. | — | Flipbook |
| GET | `/editions/:id/comments` | — | — | Comentários |
| POST | `/editions/:id/comments` | ✓ | reader | Novo comentário |
| GET | `/purchases` | ✓ | reader | Minhas compras |
| POST | `/purchases` | ✓ | reader | Comprar edição |
| DELETE | `/purchases/:id` | ✓ | reader, admin | Remover compra |
| GET | `/favorites` | ✓ | reader | Meus favoritos |
| POST | `/favorites` | ✓ | reader | Toggle favorito |
| GET | `/admin/dashboard` | ✓ | admin, editor | Dashboard |
| GET | `/admin/editions` | ✓ | admin, editor | Lista edições (gestão) |
| POST | `/admin/editions` | ✓ | admin, editor | Criar edição |
| PUT | `/admin/editions/:id` | ✓ | admin, editor | Actualizar edição |
| DELETE | `/admin/editions/:id` | ✓ | admin | Remover edição |
| GET | `/admin/editors` | ✓ | admin | Lista editores |
| POST | `/admin/editors` | ✓ | admin | Criar editor |
| PUT | `/admin/editors/:id` | ✓ | admin | Actualizar editor |
| DELETE | `/admin/editors/:id` | ✓ | admin | Remover editor |
| GET | `/admin/readers` | ✓ | admin | Lista leitores |
| GET | `/admin/readers/:id` | ✓ | admin | Detalhe leitor |
| GET | `/admin/reports/overview` | ✓ | admin | Métricas |
| GET | `/admin/reports/revenue` | ✓ | admin | Receita |
| GET | `/admin/logs` | ✓ | admin | Logs |
| POST | `/upload` | ✓ | admin, editor | Upload ficheiro |

## 14. Códigos de Erro Comuns

| Código | Significado |
|--------|-------------|
| `invalid_credentials` | Email ou senha incorrectos |
| `email_taken` | Email já registado |
| `not_found` | Recurso não encontrado |
| `purchase_required` | É necessário comprar a edição |
| `already_purchased` | Edição já foi comprada |
| `forbidden` | Sem permissão para o recurso |
| `unauthorized` | Token ausente ou inválido |
| `validation_error` | Dados inválidos (campos específicos no `fields`) |
| `file_too_large` | Ficheiro excede o tamanho máximo |
| `invalid_file_type` | Formato de ficheiro não permitido |

## 15. Paginação

Endpoints que retornam listas usam o formato:

**Request:** `?limit=20&offset=0`

**Response:**
```json
{
  "data": [ ... ],
  "meta": {
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}
```

## 16. Datas

Todos os timestamps seguem o formato ISO 8601:

```
2026-07-09T12:00:00Z
```

O front-end é responsável pela formatação para exibição localizada.
