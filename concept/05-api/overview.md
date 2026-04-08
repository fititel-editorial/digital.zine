
# Visão Geral da API

---

## Princípios de design

A API segue o estilo **REST** com algumas **acções específicas** (RPC leve) quando as operações não se encaixam naturalmente no CRUD.  
A metodologia adoptada para definir os endpoints foi:

1. Identificar as entidades principais (`Leitor`, `Revista`, `Pagamento`, `Comentario`, etc.).
2. Para cada entidade, expor as operações CRUD necessárias (GET, POST, PUT, DELETE).
3. Para cada requisito funcional (RF), verificar se já está coberto pelo CRUD; caso contrário, criar um endpoint de acção (ex: `/pagamentos/{id}/aprovar`).
4. Agrupar por permissão (público, leitor autenticado, administrador).

## Base URL

```
http://localhost:8080/api/v1
```

Em produção, será algo como `https://api.revistafititel.ao/v1`.

## Formato

- **Request/Response**: JSON (excepto upload de ficheiros, que usa `multipart/form-data`).
- **Encoding**: UTF-8.
- **Datas**: ISO 8601 (`yyyy-MM-dd'T'HH:mm:ss.SSSZ`).

## Autenticação

A maioria dos endpoints exige um **token JWT** no cabeçalho `Authorization`:

```
Authorization: Bearer <token>
```

- O token é obtido em `/auth/login` ou `/auth/register`.
- Duração: 1 hora (configurável).
- Renovação: `/auth/refresh`.

**Tokens de acesso a PDFs:**  
O endpoint `/revistas/{id}/completa` gera um token JWT de curta duração (5 minutos) específico para aceder ao ficheiro. Esse token é passado como query parameter ou no cabeçalho, conforme documentado no endpoint respectivo.

## Códigos de erro comuns

| Código | Significado | Quando ocorre |
|--------|-------------|----------------|
| 200 | OK | Sucesso em GET, PUT, PATCH |
| 201 | Created | Recurso criado (POST) |
| 204 | No Content | DELETE bem sucedido (sem corpo) |
| 400 | Bad Request | Erro de validação (JSON inválido, campo obrigatório) |
| 401 | Unauthorized | Token ausente, inválido ou expirado |
| 403 | Forbidden | Token válido mas sem permissão (ex: leitor a tentar endpoint admin) |
| 404 | Not Found | Recurso não existe |
| 422 | Unprocessable Entity | Regra de negócio violada (ex: pagamento já aprovado) |
| 500 | Internal Server Error | Erro no servidor (ver logs) |

## Estrutura de erro padrão

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

- **CSRF**: desabilitado (API stateless com JWT).
- **CORS**: configurado para permitir apenas origens específicas (ex: domínio do frontend).
- **HTTPS**: obrigatório em produção.
- **Protecção de palavras-passe**: nunca são devolvidas em nenhum endpoint; armazenadas com BCrypt.

## Convenções de nomenclatura

- **Recursos no plural**: `/leitores`, `/revistas`, `/pagamentos`.
- **Parâmetros de caminho** (path params) em minúsculas e sem caracteres especiais: `{id}`.
- **Parâmetros de consulta** (query params) em `camelCase`: `?estado=APROVADO&pagina=1`.
- **Acções especiais** (RPC) usam verbos no infinitivo no path: `/pagamentos/{id}/aprovar`, `/revistas/{id}/completa`.

## Endpoints por módulo (pré-visualização)

| Módulo | Ficheiro                                             | Descrição |
|--------|------------------------------------------------------|-------------|
| Autenticação | [`auth-endpoints.md`](./auth-endpoints.md)           | Registo, login, refresh, logout |
| Leitores | [`leitor-endpoints.md`](./reader-endpoints.md)       | Perfil, histórico (futuro), gestão de conta |
| Revistas | [`revista-endpoints.md`](./magazine-endpoints.md)    | Listagem, detalhe, preview, acesso completo (pago) |
| Pagamentos | [`pagamento-endpoints.md`](./payment-endpoints.md)   | Criar, enviar comprovativo, consultar estado |
| Comentários | [`comentario-endpoints.md`](./comments-endpoints.md) | Criar, responder, listar, editar, eliminar |
| Administração | [`admin-endpoints.md`](./admin-endpoints.md)         | Gestão de revistas, validação de pagamentos, moderação |

---

*Consulte os ficheiros específicos para detalhes de cada recurso e acção.*