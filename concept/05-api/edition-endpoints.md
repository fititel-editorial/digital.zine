# Endpoints de Revista e Edição — v3.1 (API final em inglês)

> `Magazine` (`revista`) é o título/marca; `Edition` (`edicao`) é a unidade vendável — ver [`03-data-model/erm.md`](../03-data-model/erm.md).

## Magazine — `/api/v1/magazines`

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/` | Lista revistas (marcas) |
| GET | `/{id}` | Detalhe de uma revista, com as suas edições |
| POST | `/` *(ADMIN)* | Cria nova revista |
| PUT | `/{id}` *(ADMIN)* | Actualiza nome |
| DELETE | `/{id}` *(ADMIN)* | Soft delete |

### `GET /{id}`
**Response (200):**
```json
{
  "id": 1,
  "name": "FITITEL",
  "editions": [
    { "id": 24, "number": 24, "theme": "Dados que Contam Histórias" }
  ]
}
```

### `POST /`
**Request:** `{ "name": "FITITEL" }`
**Response (201):** revista criada.

---

## Edition — `/api/v1/editions`

### Públicos (sem token)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/` | Lista edições (metadados) |
| GET | `/{id}` | Detalhe de uma edição |
| GET | `/{id}/articles` | Lista de artigos da edição (índice) |
| GET | `/{id}/tags` | Etiquetas da edição |
| GET | `/{id}/flipbook` | Metadados do flipbook + lista de páginas |

#### `GET /`
**Query params:** `magazineId`, `year`, `tag`, `free`, `page`, `size`, `sort`
**Response (200):** lista paginada:
```json
{
  "content": [
    {
      "id": 24,
      "theme": "Dados que Contam Histórias",
      "tagline": "Inovação, Talento e Futuro Digital em Angola",
      "description": "Histórias, entrevistas e análises...",
      "price": 290000,
      "pageCount": 120,
      "number": 24,
      "releaseDate": "2026-05-01",
      "free": true,
      "coverUrl": "/api/v1/editions/24/pages/1/image",
      "tags": ["Tecnologia", "Negócios"],
      "processingState": "PRONTO",
      "magazineId": 1,
      "magazineName": "FITITEL"
    }
  ],
  "totalElements": 42, "totalPages": 3, "number": 0, "size": 20
}
```
`price` em **cêntimos** (kwanza): `290000` = AKZ 2.900,00 — o frontend formata. `coverUrl` aponta para o endpoint da imagem da página `CAPA`; `null` se o flipbook ainda não foi enviado.

#### `GET /{id}`
**Response (200):** detalhe completo — mesma forma da listagem, mais:
```json
{
  "articles": [
    { "id": 1, "title": "Mapeando o ecossistema de startups em Luanda", "description": "...", "page": 12, "order": 1 }
  ],
  "editors": [
    { "userId": 7, "firstName": "Ana", "lastName": "Pereira" }
  ],
  "createdAt": "2026-04-20T09:00:00Z"
}
```
`editors` vem da associação `editor_edicao`; `articles` é embutido para evitar chamada extra.
**Erros:** `404`

#### `GET /{id}/articles`
**Response (200):**
```json
[
  { "id": 1, "title": "IA aplicada à agricultura", "description": "...", "page": 12, "order": 1 }
]
```

#### `GET /{id}/tags`
**Response (200):** `{ "tags": ["dados", "inteligência artificial"] }`

#### `GET /{id}/flipbook`
**Response (200):**
```json
{
  "editionId": 24,
  "processingState": "PRONTO",
  "generatedAt": "2026-05-01T12:00:00Z",
  "totalPages": 120,
  "pages": [
    { "order": 1, "type": "CAPA" },
    { "order": 2, "type": "CONTEUDO" }
  ]
}
```
Não devolve URLs de imagem — o frontend constrói o path do endpoint a partir de `order` (ver secção seguinte). Isto evita a fuga de URLs de conteúdo pago.
**Erros:** `404` (flipbook não enviado)

### Condicional (público para capa/edições gratuitas, autenticado para as restantes)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/{id}/pages/{order}/image` | Devolve a imagem WebP da página |

**Regras de acesso:**
- Edição gratuita (`free = true`): todas as páginas acessíveis sem token.
- Edição paga, página `CAPA`: acessível sem token (amostra).
- Edição paga, página `CONTEUDO`: requer token + pagamento com `status = PAGO` para a edição.
- `ADMIN`: acesso total.

**Response (200):** binário (`Content-Type: image/webp`).
**Erros:** `401`, `403` (sem pagamento `PAGO` para a edição), `404`

### Administrador (role `ADMIN`)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| POST | `/` | Cria edição (JSON de metadados); o upload do PDF é feito em separado |
| PUT | `/{id}` | Actualiza metadados |
| DELETE | `/{id}` | Soft delete |
| POST | `/{id}/flipbook` | Upload do PDF; dispara split + conversão para WebP (assíncrono) |
| PATCH | `/{id}/pages/{order}` | Ajusta uma página (ex.: alterna `type` entre `CAPA`/`CONTEUDO`) |
| POST | `/{id}/articles` | Adiciona artigo ao índice |
| PUT | `/{id}/articles/{articleId}` | Actualiza artigo |
| DELETE | `/{id}/articles/{articleId}` | Remove artigo (soft delete) |
| POST | `/{id}/tags` | Adiciona etiqueta |
| DELETE | `/{id}/tags/{tag}` | Remove etiqueta (hard delete) |

#### `POST /`
```json
{
  "magazineId": 1,
  "theme": "Dados que Contam Histórias",
  "tagline": "...",
  "description": "...",
  "number": 24,
  "price": 290000,
  "releaseDate": "2026-05-01",
  "free": false
}
```
**Response (201):** edição criada, com `processingState: null` (flipbook ainda não enviado).
**Erros:** `400` (validação), `404` (revista não existe)

#### `POST /{id}/flipbook`
**Request:** `multipart/form-data` com campo `pdf`.
**Response (202):** `{ "processingState": "PROCESSANDO" }`
**Erros:** `400` (ficheiro não é PDF), `403`, `409` (já existe um flipbook em processamento para esta edição)

#### `PATCH /{id}/pages/{order}`
**Request:** `{ "type": "CAPA" }`
**Response (200):** página actualizada.

#### `POST /{id}/tags`
**Request:** `{ "tag": "Inteligência Artificial" }`
**Erros:** `409` (tag duplicada na mesma edição)

---

## Notas

- Não existe endpoint que devolva o PDF original.
- `processingState` é herdado de `flipbook_edicao` — campo proposto, não confirmado (ver changelog).
- Artigos e etiquetas não têm campo de autor — ponto em aberto.
- Campos do frontend sem correspondência no MER (`status` published/draft, `language`, `priceNote`, `technicalDetails`, `technicalMd`, `relatedEditions`) **não existem na API** — o frontend ajusta-se (ver especificação final da API, secção "Frontend Adjustments").
