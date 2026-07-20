# Visão Geral da API — v3.1 (API final em inglês)

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md). **Actualização v3.1:** a API passa a usar **inglês** em todos os recursos, endpoints e campos JSON, alinhada com o código Java e com a especificação final acordada com o frontend. A prosa da documentação mantém-se em português.

## Princípios de design

A API segue o estilo **REST**, complementado por **acções específicas** (RPC leve) quando as operações não se encaixam no CRUD puro. A definição dos endpoints obedeceu a:

1. Identificar as entidades principais (`User`, `Magazine`, `Edition`, `Payment`, `FlipbookComment`, etc.).
2. Para cada entidade, expor as operações CRUD necessárias (GET, POST, PUT, DELETE).
3. Para cada requisito funcional, verificar se já está coberto pelo CRUD; senão, criar um endpoint de acção (ex.: `/payments/check-access`).
4. Agrupar por permissão: público, utilizador autenticado (`LEITOR`) ou administrador (`ADMIN`).

## Base URL

```
http://localhost:8080/api/v1
```
Em produção (Render): a definir o domínio final.

## Formato

- **Request/Response:** JSON (excepto upload de ficheiros, que usa `multipart/form-data`).
- **Encoding:** UTF-8.
- **Datas:** ISO 8601 (`yyyy-MM-dd'T'HH:mm:ss.SSSZ`).
- **Campos JSON:** inglês, em `camelCase` (correspondem directamente aos campos dos DTOs Java).
- **Valores de enum de domínio:** mantêm-se em português (`PAGO`, `LEITOR`, `CAPA`, etc.) — são dados, não identificadores de código.

## Autenticação

A maioria dos endpoints exige um **token JWT** no cabeçalho `Authorization: Bearer <token>`.
- Obtido em `/auth/login` ou `/auth/register`.
- Duração: 1 hora (configurável).
- Renovação: `/auth/refresh`.
- Payload: `id`, `email`, `role`, `exp`.

A resposta de login inclui `editorOf` — array de IDs de edições a que o utilizador está atribuído via `editor_edicao`. O frontend usa este campo para adaptar o painel administrativo (um "editor" é um `ADMIN` com atribuições, não um terceiro role).

**Acesso ao conteúdo:** não existe download do PDF completo em nenhum endpoint — o conteúdo é servido página a página, como imagem WebP, com controlo de acesso feito directamente em `GET /editions/{id}/pages/{order}/image` (ver [`edition-endpoints.md`](./edition-endpoints.md) e [`04-architecture/security.md`](../04-architecture/security.md)).

## Paginação

Endpoints de listagem paginada aceitam `?page=0&size=20&sort=createdAt,desc` e devolvem o envelope padrão do Spring:

```json
{
  "content": [],
  "totalElements": 42,
  "totalPages": 3,
  "number": 0,
  "size": 20
}
```

## Códigos de erro comuns

| Código | Significado | Quando ocorre |
|--------|-------------|----------------|
| 200 | OK | GET, PUT, PATCH bem-sucedidos |
| 201 | Created | POST bem-sucedido |
| 202 | Accepted | Processamento assíncrono iniciado (upload de flipbook) |
| 204 | No Content | DELETE bem-sucedido |
| 400 | Bad Request | Validação de campos ou JSON inválido |
| 401 | Unauthorized | Token ausente, inválido ou expirado |
| 403 | Forbidden | Token válido mas sem permissão |
| 404 | Not Found | Recurso não existe |
| 409 | Conflict | Estado actual do recurso impede a operação (ex.: pagamento duplicado) |
| 422 | Unprocessable Entity | Regra de negócio violada |
| 500 | Internal Server Error | Erro no servidor (ver logs) |

**Estrutura de erro padrão:**
```json
{
  "timestamp": "2026-07-13T12:00:00.123Z",
  "status": 409,
  "error": "Conflict",
  "message": "A payment already exists for this edition.",
  "path": "/api/v1/payments"
}
```

## Versionamento

A versão está no path (`/v1`). Alterações incompatíveis geram uma nova versão (`/v2`), mantendo a anterior por um período de transição.

## Segurança adicional

- **CSRF:** desabilitado (API stateless com JWT).
- **CORS:** permite apenas a origem do frontend (Vercel).
- **HTTPS:** obrigatório em produção.
- **Palavras-passe:** armazenadas com BCrypt, nunca devolvidas.

## Convenções de nomenclatura

- Recursos em inglês, no plural: `/users`, `/magazines`, `/editions`, `/payments`, `/pages`.
- Parâmetros de caminho: `{id}` (minúsculas, camelCase quando composto — `{editionId}`).
- Parâmetros de consulta: `camelCase` (ex.: `?status=PAGO&page=0`).
- Acções especiais: verbos no infinitivo em inglês no path (ex.: `/admin/payments/{id}/approve`).

## Correspondência JSON ↔ base de dados

Os campos JSON (inglês) correspondem aos campos das entidades Java; as colunas físicas mantêm-se em português, mapeadas via `@Column`:

| Coluna (BD, PT) | Campo JSON (EN) |
|------------------|------------------|
| `p_nome` | `firstName` |
| `sb_nome` | `lastName` |
| `data_nascimento` | `dateOfBirth` |
| `palavra_passe_hash` | *(nunca exposto)* |
| `tema` | `theme` |
| `lema` | `tagline` |
| `descricao` | `description` |
| `preco` | `price` |
| `paginas` | `pageCount` |
| `numero` | `number` |
| `data_lancamento` | `releaseDate` |
| `e_gratis` | `free` |
| `metodo_pagamento` | `paymentMethod` |
| `referencia_externa` | `externalReference` |
| `data_pagamento` | `paidAt` |
| `estado_processamento` | `processingState` |
| `url_imagem` | *(nunca exposto — a imagem é servida pelo endpoint)* |
| `criado_em` | `createdAt` |
| `atualizado_em` | `updatedAt` |
| `removido_em` | *(nunca exposto)* |

## Endpoints por módulo

| Módulo | Ficheiro | Descrição |
|--------|----------|-------------|
| Autenticação | [`auth-endpoints.md`](./auth-endpoints.md) | Registo, login, refresh |
| Utilizadores | [`user-endpoints.md`](./user-endpoints.md) | Perfil, compras, comentários |
| Revistas e edições | [`edition-endpoints.md`](./edition-endpoints.md) | Marca, edição, artigos, tags, páginas do flipbook |
| Pagamentos | [`payment-endpoints.md`](./payment-endpoints.md) | Iniciar, consultar, verificação de acesso, notificação do GPO |
| Comentários | [`comments-endpoints.md`](./comments-endpoints.md) | Criar, listar, editar, eliminar, gostar |
| Favoritos | [`favorites-endpoints.md`](./favorites-endpoints.md) | Marcar/desmarcar edições favoritas |
| Administração | [`admin-endpoints.md`](./admin-endpoints.md) | Editores, leitores, pagamentos, moderação, logs |

---

*Consulte os ficheiros específicos para detalhes de cada recurso.*
