# Endpoints de Revista e Edição — v3

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md). Substitui `magazine-endpoints.md`. `Revista` é agora o título/marca; `Edicao` é a unidade vendável — ver [`03-data-model/erm.md`](../03-data-model/erm.md).

## Revista — `/api/v1/revistas`

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
{ "id": 1, "nome": "FITITEL", "edicoes": [ { "id": 24, "numero": 24, "tema": "Dados que Contam Histórias" } ] }
```

---

## Edição — `/api/v1/edicoes`

### Públicos (sem token)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/` | Lista edições (metadados) |
| GET | `/{id}` | Detalhe de uma edição |
| GET | `/{id}/artigos` | Lista de artigos da edição (índice) |
| GET | `/{id}/tags` | Etiquetas da edição |
| GET | `/{id}/paginas` | Metadados das páginas do flipbook |

#### `GET /`
**Query params:** `idRevista`, `ano`, `tag`, `gratis`, `pagina`, `tamanho`, `ordenar`
**Response (200):** lista paginada com `id, tema, lema, numero, dataLancamento, preco, eGratis, paginas, urlCapa`.

#### `GET /{id}`
**Response (200):** detalhe completo + `estadoProcessamento` (herdado de `flipbook_edicao`).
**Erros:** `404`

#### `GET /{id}/artigos`
**Response (200):**
```json
{ "data": [ { "id": 1, "titulo": "IA aplicada à agricultura", "descricao": "...", "page": 12, "ordem": 1 } ] }
```

#### `GET /{id}/tags`
**Response (200):** `{ "tags": ["dados", "inteligência artificial"] }`

#### `GET /{id}/paginas`
**Response (200):**
```json
{
  "idEdicao": 24,
  "estadoProcessamento": "PRONTO",
  "totalPaginas": 120,
  "paginas": [
    { "ordem": 1, "tipo": "CAPA" },
    { "ordem": 2, "tipo": "CONTEUDO" }
  ]
}
```
Não devolve `urlImagem` directamente — ver secção seguinte.
**Erros:** `404`, `409` (`estadoProcessamento != PRONTO`)

### Condicional (público para páginas de capa/edições gratuitas, autenticado para as restantes)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/{id}/paginas/{ordem}/imagem` | Devolve a imagem WebP da página |

**Header:** `Authorization: Bearer <token>` — obrigatório salvo quando `edicao.e_gratis = true` ou a página é a capa.
**Response (200):** binário (`Content-Type: image/webp`).
**Erros:** `401`, `403` (sem pagamento `PAGO` para a edição), `404`

### Administrador (role `ADMIN`)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| POST | `/` | Cria edição (JSON de metadados) e dispara o upload do PDF em separado |
| PUT | `/{id}` | Actualiza metadados |
| DELETE | `/{id}` | Soft delete |
| POST | `/{id}/flipbook` | Upload do PDF; dispara split + conversão para WebP (assíncrono) |
| PATCH | `/{id}/paginas/{ordem}` | Ajusta uma página (ex.: alterna `tipo` entre `CAPA`/`CONTEUDO`) |
| POST | `/{id}/artigos` | Adiciona artigo ao índice |
| PUT | `/{id}/artigos/{idArtigo}` | Actualiza artigo |
| DELETE | `/{id}/artigos/{idArtigo}` | Remove artigo |
| POST | `/{id}/tags` | Adiciona etiqueta |
| DELETE | `/{id}/tags/{tag}` | Remove etiqueta |

#### `POST /`
```json
{ "idRevista": 1, "tema": "Dados que Contam Histórias", "lema": "...", "descricao": "...", "numero": 24, "preco": 290000, "dataLancamento": "2026-05-01", "eGratis": false }
```
**Response (201):** edição criada, `estadoProcessamento` inexistente (flipbook ainda não enviado).

#### `POST /{id}/flipbook`
**Request:** `multipart` com campo `pdf`.
**Response (202):** `{ "estadoProcessamento": "PROCESSANDO" }`
**Erros:** `400`, `403`, `409` (já existe um flipbook em processamento para esta edição)

#### `PATCH /{id}/paginas/{ordem}`
**Request:** `{ "tipo": "CAPA" }`
**Response (200):** página actualizada.

---

## Notas

- Não existe endpoint que devolva o PDF original.
- `estadoProcessamento` é herdado de `flipbook_edicao` — campo proposto, não confirmado (ver changelog).
- Artigos e etiquetas não têm campo de autor — ponto em aberto.
