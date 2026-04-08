# Endpoints de Autenticação

**Prefix:** `/api/v1/auth`

## Públicos

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| POST | `/register` | Regista novo utilizador (role `LEITOR`) |
| POST | `/login` | Autentica e devolve token JWT |
| POST | `/refresh` | Renova token (requer token actual válido) |
| POST | `/logout` | (Opcional) descarta token no cliente |

### `POST /register`
**Request:**
```json
{
  "pNome": "João", "sbNome": "Silva", "email": "joao@email.com",
  "genero": "MASCULINO", "palavraPasse": "Segura123!", "dataNasc": "1990-05-15"
}
```
**Response (201):** dados do utilizador (sem password).  
**Erros:** `400` (validação), `422` (email já existe).

### `POST /login`
**Request:** `{ "email": "joao@email.com", "palavraPasse": "Segura123!" }`  
**Response (200):**
```json
{ "token": "eyJ...", "tipo": "Bearer", "expiracaoSegundos": 3600, "utilizador": { "id", "pNome", "email", "role" } }
```
**Erros:** `401` (credenciais inválidas).

### `POST /refresh`
**Header:** `Authorization: Bearer <token>`  
**Response (200):** `{ "token": "novo...", "tipo": "Bearer", "expiracaoSegundos": 3600 }`  
**Erros:** `401` (token inválido ou expirado).

### `POST /logout`
**Header:** `Authorization: Bearer <token>`  
**Response:** `204 No Content` (sempre).

---

**Notas:** Palavras-passe com BCrypt. Token JWT com `id`, `email`, `role`, `exp`.