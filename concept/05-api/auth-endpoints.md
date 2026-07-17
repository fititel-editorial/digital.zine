# Endpoints de Autenticação — v3.1 (API final em inglês)

**Prefix:** `/api/v1/auth`

## Públicos

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| POST | `/register` | Regista novo utilizador (role `LEITOR`) |
| POST | `/login` | Autentica e devolve token JWT |
| POST | `/refresh` | Renova token (requer token actual válido) |

### `POST /register`
**Request:**
```json
{
  "firstName": "João",
  "lastName": "Silva",
  "email": "joao@email.com",
  "password": "Segura123!",
  "dateOfBirth": "1990-05-15"
}
```
**Response (201):**
```json
{
  "token": "eyJ...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": 1,
    "firstName": "João",
    "lastName": "Silva",
    "email": "joao@email.com",
    "role": "LEITOR",
    "createdAt": "2026-07-13T10:00:00Z"
  }
}
```
**Erros:** `400` (validação, password fraca), `409` (email já existe).

> **Nota:** o campo `genero` presente em versões anteriores foi removido — não existe no MER.

### `POST /login`
**Request:** `{ "email": "joao@email.com", "password": "Segura123!" }`
**Response (200):**
```json
{
  "token": "eyJ...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": 1,
    "firstName": "João",
    "lastName": "Silva",
    "email": "joao@email.com",
    "role": "ADMIN",
    "editorOf": [24, 23]
  }
}
```
`editorOf` — IDs das edições a que o utilizador está atribuído via `editor_edicao`. Array vazio quando não há atribuições. O frontend usa-o para adaptar o painel administrativo.

**Erros:** `401` (credenciais inválidas ou conta removida logicamente).

### `POST /refresh`
**Header:** `Authorization: Bearer <token>`
**Response (200):** `{ "token": "novo...", "tokenType": "Bearer", "expiresIn": 3600 }`
**Erros:** `401` (token inválido ou expirado).

---

**Notas:** Palavras-passe com BCrypt. Token JWT com `id`, `email`, `role`, `exp`. O antigo `POST /logout` foi removido da especificação — sendo a API stateless, o descarte do token é responsabilidade do cliente.
