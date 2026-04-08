# Endpoints de Revista

**Prefix:** `/api/v1/revistas`

## Públicos (sem token)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/` | Lista revistas (metadados + preview) |
| GET | `/{id}` | Detalhe de uma revista (inclui páginas) |

### `GET /`
**Query params:** `edicao`, `ano`, `pagina`, `tamanho`, `ordenar`  
**Response (200):** Lista paginada com `id, nome, anoLancamento, preco, qtdPaginas, edicao, autores, urlPreview, urlCapa`.

### `GET /{id}`
**Response (200):** Detalhe completo (igual ao `GET /` + lista de `paginas` com `numPagina, nomeProjeto`).  
**Erros:** `404`

---

## Autenticado (LEITOR ou ADMIN)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/{id}/completa` | Acede ao PDF completo (requer pagamento aprovado) |

### `GET /{id}/completa`
**Header:** `Authorization: Bearer <token>`  
**Query opcional:** `formato=json` (devolve link em vez de redireccionar)  
**Response (200):** `{ "url": "https://...?token=...", "expiracaoSegundos": 300 }` ou redireccionamento 302.  
**Erros:** `401`, `403` (sem pagamento aprovado), `404`.

---

## Administrador (role ADMIN)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| POST | `/` | Cria nova revista (multipart: `revista` JSON + `pdf`) |
| PUT | `/{id}` | Actualiza metadados |
| DELETE | `/{id}` | Soft delete |
| POST | `/{id}/upload-pdf` | Substitui o PDF |

### `POST /`
**Request (multipart):**
- `revista`: `{ "nome", "anoLancamento", "preco", "qtdPaginas", "idEdicao", "autores"[] }`
- `pdf`: ficheiro  
  **Response (201):** igual ao `GET /{id}`.  
  **Erros:** `400`, `403`, `422` (edição não existe).

### `PUT /{id}`
**Request JSON:** campos a actualizar (ex: `{ "preco": 14.99 }`).  
**Response (200):** revista actualizada.  
**Erros:** `403`, `404`.

### `DELETE /{id}`
**Response (204)**

### `POST /{id}/upload-pdf`
**Request:** `multipart` com campo `pdf`.  
**Response (200):** `{ "message": "PDF actualizado", "url": "...", "qtdPaginas": N }`.  
**Erros:** `400`, `403`, `404`.

---

**Notas:**
- O preview (amostra) é gerado automaticamente no upload (primeiras ~15% das páginas).
- Os PDFs são armazenados em object storage (S3/local).
- O token de acesso ao PDF completo é um JWT curto (5 min) gerado no momento da solicitação.
- Detalhes sobre o fluxo de pagamento e acesso estão no [diagrama de sequência](../06-diagrams/ds-payment.md).