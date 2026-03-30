# Segurança

## Autenticação

O sistema utiliza **JWT (JSON Web Token)** para autenticação stateless.  
O fluxo é o seguinte:

1. O utilizador faz login com `email` e `palavra-passe` no endpoint `/api/v1/auth/login`.
2. As credenciais são validadas pelo serviço de autenticação.
3. Se válidas, é gerado um token JWT assinado com uma chave secreta (configurada no `application.properties`).
4. O token é devolvido ao cliente no corpo da resposta.
5. O cliente deve incluir o token no cabeçalho `Authorization: Bearer <token>` em todas as requisições autenticadas.

### Regras do token

- **Duração:** 1 hora (configurável).
- **Conteúdo do payload:** `id` do leitor, `email` e `role` (`LEITOR` ou `ADMIN`).
- **Renovação:** Endpoint `/api/v1/auth/refresh` que, dado um token ainda válido (mas próximo do fim), devolve um novo token.
- **Logout:** Não é necessário estado no servidor. O cliente apenas descarta o token. Opcionalmente, pode-se manter uma blacklist de tokens revogados (implementação futura).

## Roles e permissões

Existem dois papéis (roles) definidos no campo `role` da tabela `Leitor`:

| Role   | Descrição                                                                 |
|--------|---------------------------------------------------------------------------|
| LEITOR | Utilizador normal. Pode comprar revistas, comentar, ver o seu perfil.      |
| ADMIN  | Administrador. Tem todas as permissões de LEITOR, mais gestão de revistas, validação de pagamentos, e visualização de dados administrativos. |

### Mapeamento de permissões por endpoint

A protecção dos endpoints é feita com base na role, usando Spring Security com anotações como `@PreAuthorize`.

| Endpoint (exemplo)                | Método | Role necessária |
|-----------------------------------|--------|------------------|
| `/api/v1/auth/**`                 | POST   | público (sem token) |
| `/api/v1/leitores/me`             | GET    | LEITOR ou ADMIN   |
| `/api/v1/revistas`                | GET    | público (mas devolve apenas preview) |
| `/api/v1/revistas/{id}/completa`  | GET    | LEITOR (com pagamento aprovado) |
| `/api/v1/revistas`                | POST   | ADMIN             |
| `/api/v1/pagamentos`              | POST   | LEITOR            |
| `/api/v1/admin/pagamentos/{id}/validar` | PUT | ADMIN        |
| `/api/v1/comentarios`             | POST   | LEITOR ou ADMIN   |
| `/api/v1/comentarios/{id}`        | DELETE | LEITOR (apenas os seus) ou ADMIN (qualquer) |

## Protecção de palavras-passe

- As palavras-passe são armazenadas com **BCrypt** (Spring Security `BCryptPasswordEncoder`).
- Nunca são devolvidas em nenhum endpoint.
- Na criação/actualização de um leitor, a palavra-passe é enviada em plain text (HTTPS) e codificada antes de ser persistida.

## Considerações adicionais

- **HTTPS:** Em produção, todas as comunicações devem ser encriptadas com TLS.
- **CSRF:** Como a API é stateless (JWT), a protecção CSRF está desabilitada (`http.csrf().disable()`).
- **CORS:** Configurado para permitir apenas origens específicas (ex: domínio do frontend).
- **Validação de tokens:** O filtro de autenticação verifica a assinatura, a expiração e a existência do utilizador no banco (opcional: cache).
- **Token de acesso à revista:** Além do JWT de autenticação, o endpoint `/revistas/{id}/completa` gera um **token de acesso curto** (5 minutos) para permitir o download do PDF. Este token não substitui o JWT principal.

## Fluxo completo de acesso a uma revista paga

1. Leitor autentica-se (obtém JWT normal).
2. Solicita `/revistas/{id}/completa` com o JWT normal.
3. O backend verifica:
    - JWT válido.
    - Existe um pagamento com `estado = APROVADO` para aquele leitor e revista.
4. Se ok, gera um **token de acesso temporário** (JWT com duração curta, contendo `id_revista` e `id_leitor`).
5. Devolve uma URL ou o próprio token, que deve ser usado para aceder ao PDF (ex: `/revistas/{id}/pdf?token=...`).
6. O endpoint de PDF valida o token temporário e serve o ficheiro.

## Relacionamentos com outros módulos

- [Camadas da arquitectura](./layers.md) – onde se encaixa a segurança (filtros, configuração).
- [Decisões técnicas](./technical-decisions.md) – justificativa para JWT em vez de sessão.
- [API - Auth](../05-api/auth-endpoints.md) – detalhes dos endpoints de autenticação.

---

*Esta configuração garante que apenas utilizadores autorizados acedem aos recursos protegidos.*