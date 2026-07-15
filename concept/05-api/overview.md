# Visão Geral da API — v3

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md). Corrigidas referências desactualizadas (endpoint de download de PDF, nomes de ficheiro na tabela de módulos).

## Princípios de design

A API segue o estilo **REST**, complementado por **acções específicas** (RPC leve) quando as operações não se encaixam no CRUD puro. A definição dos endpoints obedeceu a:

1. Identificar as entidades principais (`Utilizador`, `Revista`, `Edicao`, `Pagamento`, `FlipbookComentario`, etc.).
2. Para cada entidade, expor as operações CRUD necessárias (GET, POST, PUT, DELETE).
3. Para cada requisito funcional, verificar se já está coberto pelo CRUD; senão, criar um endpoint de acção (ex: `/pagamentos/{id}` para consultar estado).
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

## Autenticação

A maioria dos endpoints exige um **token JWT** no cabeçalho `Authorization: Bearer <token>`.
- Obtido em `/auth/login` ou `/auth/register`.
- Duração: 1 hora (configurável).
- Renovação: `/auth/refresh`.

**Acesso ao conteúdo:** não existe download do PDF completo em nenhum endpoint — o conteúdo é servido página a página, como imagem WebP, com controlo de acesso feito directamente em `GET /edicoes/{id}/paginas/{ordem}/imagem` (ver [`edition-endpoints.md`](./edition-endpoints.md) e [`04-architecture/security.md`](../04-architecture/security.md)).

## Códigos de erro comuns

| Código | Significado | Quando ocorre |
|--------|-------------|----------------|
| 200 | OK | GET, PUT, PATCH bem-sucedidos |
| 201 | Created | POST bem-sucedido |
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
  "message": "Já existe um pagamento em curso para esta edição.",
  "path": "/api/v1/pagamentos"
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

- Recursos no plural: `/utilizadores`, `/revistas`, `/edicoes`, `/pagamentos`.
- Parâmetros de caminho: `{id}` (minúsculas).
- Parâmetros de consulta: `camelCase` (ex: `?status=PAGO&pagina=1`).
- Acções especiais: verbos no infinitivo no path (ex: `/pagamentos/{id}/aprovar`).

## Endpoints por módulo

| Módulo | Ficheiro | Descrição |
|--------|----------|-------------|
| Autenticação | [`auth-endpoints.md`](./auth-endpoints.md) | Registo, login, refresh, logout |
| Utilizadores | [`user-endpoints.md`](./user-endpoints.md) | Perfil, compras, comentários |
| Revistas e edições | [`edition-endpoints.md`](./edition-endpoints.md) | Marca, edição, artigos, tags, páginas do flipbook |
| Pagamentos | [`payment-endpoints.md`](./payment-endpoints.md) | Iniciar, consultar, notificação do GPO |
| Comentários | [`comments-endpoints.md`](./comments-endpoints.md) | Criar, listar, editar, eliminar, gostar |
| Favoritos | [`favorites-endpoints.md`](./favorites-endpoints.md) | Marcar/desmarcar edições favoritas |
| Administração | [`admin-endpoints.md`](./admin-endpoints.md) | Gestão de revistas/edições, editores, pagamentos, logs |

---

*Consulte os ficheiros específicos para detalhes de cada recurso.*
