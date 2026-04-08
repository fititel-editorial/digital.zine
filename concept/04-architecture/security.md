# Segurança

## Autenticação com JWT

O sistema utiliza **JWT (JSON Web Token)** para autenticação stateless. O processo é simples:

1. O utilizador envia `email` e `palavra-passe` para `/api/v1/auth/login`.
2. As credenciais são validadas pelo serviço de autenticação.
3. Se válidas, é gerado um token JWT, assinado com uma chave secreta definida em `application.properties`.
4. O token é devolvido ao cliente no corpo da resposta.
5. Nas requisições seguintes, o cliente envia o token no cabeçalho `Authorization: Bearer <token>`.

### Regras do token

- **Duração:** 1 hora (configurável).
- **Conteúdo do payload:** `id` do utilizador, `email` e `role` (`LEITOR` ou `ADMIN`).
- **Renovação:** O endpoint `/api/v1/auth/refresh` recebe um token ainda válido (mas próximo do fim) e devolve um novo.
- **Logout:** Como a API é stateless, o cliente apenas descarta o token. Opcionalmente, pode-se manter uma blacklist de tokens revogados – isso fica para uma versão futura.

## Papéis (roles) e permissões

O campo `role` na tabela `Utilizador` define dois papéis:

| Role   | Permissões |
|--------|-------------|
| `LEITOR` | Pode comprar revistas, comentar, ver o seu perfil e histórico de compras. |
| `ADMIN`  | Tem todas as permissões de `LEITOR` e, adicionalmente, pode gerir revistas, validar pagamentos e aceder a dados administrativos. |

A protecção dos endpoints é feita com Spring Security, usando anotações como `@PreAuthorize`. A tabela abaixo ilustra alguns exemplos:

| Endpoint | Método | Role necessária |
|----------|--------|------------------|
| `/api/v1/auth/**` | POST | público (sem token) |
| `/api/v1/utilizadores/me` | GET | `LEITOR` ou `ADMIN` |
| `/api/v1/revistas` | GET | público (apenas pré‑visualização) |
| `/api/v1/revistas/{id}/completa` | GET | `LEITOR` (com pagamento aprovado) |
| `/api/v1/revistas` | POST | `ADMIN` |
| `/api/v1/pagamentos` | POST | `LEITOR` |
| `/api/v1/admin/pagamentos/{id}/validar` | PUT | `ADMIN` |
| `/api/v1/comentarios` | POST | `LEITOR` ou `ADMIN` |
| `/api/v1/comentarios/{id}` | DELETE | `LEITOR` (apenas os seus) ou `ADMIN` (qualquer) |

## Protecção de palavras-passe

- As palavras-passe são armazenadas com **BCrypt** (usando `BCryptPasswordEncoder` do Spring Security).
- Nunca são devolvidas em nenhum endpoint.
- Durante o registo ou alteração de palavra-passe, o texto é enviado em plain text (por HTTPS) e codificado antes de ser persistido.

## Considerações adicionais

- **HTTPS:** Em produção, todas as comunicações devem ser encriptadas com TLS.
- **CSRF:** Desabilitado (`http.csrf().disable()`) porque a API é stateless (JWT).
- **CORS:** Configurado para permitir apenas origens específicas (ex.: domínio do frontend).
- **Validação de tokens:** O filtro de autenticação verifica a assinatura, a expiração e (opcionalmente) a existência do utilizador na base de dados.
- **Token de acesso à revista completa:** Além do JWT de autenticação, o endpoint `/revistas/{id}/completa` gera um **token de acesso curto** (5 minutos) para download do PDF. Esse token não substitui o JWT principal.

## Fluxo completo de acesso a uma revista paga

1. O utilizador autentica‑se e obtém o JWT normal.
2. Solicita `/revistas/{id}/completa` enviando esse JWT.
3. O backend verifica:
   - JWT válido.
   - Existência de um pagamento com `estado = APROVADO` para aquele utilizador e revista.
4. Se tudo estiver correto, gera um **token temporário** (JWT curto contendo `id_revista` e `id_utilizador`).
5. Devolve uma URL (ou o próprio token) que deve ser usada para aceder ao PDF, por exemplo: `/revistas/{id}/pdf?token=...`.
6. O endpoint que serve o PDF valida o token temporário e disponibiliza o ficheiro.

## Relação com outros documentos

Os detalhes de implementação da arquitectura (onde os filtros de segurança se encaixam) estão em [camadas](./layers.md). A justificação para a escolha do JWT em vez de sessões está documentada nas [decisões técnicas](./technical-decisions.md). A especificação completa dos endpoints de autenticação encontra‑se no módulo [API](../05-api/auth-endpoints.md).

---

*Esta configuração assegura que apenas utilizadores autorizados acedem a recursos protegidos.*