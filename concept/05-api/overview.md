# Visão Geral da API

## Princípios de design

A API segue o estilo **REST**, complementado por **acções específicas** (RPC leve) quando as operações não se encaixam no CRUD puro. A definição dos endpoints obedeceu a:

1. Identificar as entidades principais (`Utilizador`, `Revista`, `Pagamento`, `Comentário`, etc.).
2. Para cada entidade, expor as operações CRUD necessárias (GET, POST, PUT, DELETE).
3. Para cada requisito funcional, verificar se já está coberto pelo CRUD; senão, criar um endpoint de acção (ex: `/pagamentos/{id}/aprovar`).
4. Agrupar por permissão: público, utilizador autenticado (`LEITOR`) ou administrador (`ADMIN`).

## Base URL

```
http://localhost:8080/api/v1
```
Em produção: `https://api.revistafititel.ao/v1`.

## Formato

- **Request/Response:** JSON (excepto upload de ficheiros, que usa `multipart/form-data`).
- **Encoding:** UTF-8.
- **Datas:** ISO 8601 (`yyyy-MM-dd'T'HH:mm:ss.SSSZ`).

## Autenticação

A maioria dos endpoints exige um **token JWT** no cabeçalho `Authorization: Bearer <token>`.  
- Obtido em `/auth/login` ou `/auth/register`.  
- Duração: 1 hora (configurável).  
- Renovação: `/auth/refresh`.  

**Tokens de acesso a PDFs:** o endpoint `/revistas/{id}/completa` gera um token JWT de curta duração (5 minutos) para download do ficheiro.

## Códigos de erro comuns

| Código | Significado | Quando ocorre |
|--------|-------------|----------------|
| 200 | OK | GET, PUT, PATCH bem‑sucedidos |
| 201 | Created | POST bem‑sucedido |
| 204 | No Content | DELETE bem‑sucedido |
| 400 | Bad Request | Validação de campos ou JSON inválido |
| 401 | Unauthorized | Token ausente, inválido ou expirado |
| 403 | Forbidden | Token válido mas sem permissão |
| 404 | Not Found | Recurso não existe |
| 422 | Unprocessable Entity | Regra de negócio violada |
| 500 | Internal Server Error | Erro no servidor (ver logs) |

**Estrutura de erro padrão:**
```json
{
  "timestamp": "2025-03-30T12:00:00.123Z",
  "status": 422,
  "error": "Unprocessable Entity",
  "message": "Já existe um pagamento aprovado para esta revista.",
  "path": "/api/v1/pagamentos"
}
```

## Versionamento

A versão está no path (`/v1`). Alterações incompatíveis geram uma nova versão (`/v2`), mantendo a anterior por um período de transição.

## Segurança adicional

- **CSRF:** desabilitado (API stateless com JWT).
- **CORS:** permite apenas origens específicas (ex: domínio do frontend).
- **HTTPS:** obrigatório em produção.
- **Palavras‑passe:** armazenadas com BCrypt, nunca devolvidas.

## Convenções de nomenclatura

- Recursos no plural: `/utilizadores`, `/revistas`, `/pagamentos`.
- Parâmetros de caminho: `{id}` (minúsculas).
- Parâmetros de consulta: `camelCase` (ex: `?estado=APROVADO&pagina=1`).
- Acções especiais: verbos no infinitivo no path (ex: `/pagamentos/{id}/aprovar`).

## Endpoints por módulo

| Módulo | Ficheiro                                             | Descrição |
|--------|------------------------------------------------------|-------------|
| Autenticação | [`auth-endpoints.md`](./auth-endpoints.md)           | Registo, login, refresh, logout |
| Utilizadores | [`utilizador-endpoints.md`](./user-endpoints.md)     | Perfil, compras, comentários |
| Revistas | [`revista-endpoints.md`](./magazine-endpoints.md)    | Listagem, detalhe, preview, acesso completo |
| Pagamentos | [`pagamento-endpoints.md`](./payment-endpoints.md)   | Criar, enviar comprovativo, consultar |
| Comentários | [`comentario-endpoints.md`](./comments-endpoints.md) | Criar, responder, listar, editar, eliminar |
| Administração | [`admin-endpoints.md`](./admin-endpoints.md)         | Gestão de revistas, validação de pagamentos, moderação |

---

*Consulte os ficheiros específicos para detalhes de cada recurso.*