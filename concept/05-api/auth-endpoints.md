
# Endpoints de Autenticação

Prefix: `/api/v1/auth`

## Públicos (sem autenticação)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| POST | `/register` | Registo de novo leitor (cria conta com role `LEITOR`) |
| POST | `/login` | Autenticação por email e palavra-passe |
| POST | `/refresh` | Renova o token JWT (requer token actual ainda válido) |
| POST | `/logout` | (Opcional) Invalida o token no lado do cliente|

---

### `POST /register`

Regista um novo leitor no sistema.  
A palavra-passe é codificada com BCrypt antes de ser armazenada. O campo `role` é definido automaticamente como `LEITOR`.

**Request Body (JSON):**
```json
{
  "pNome": "João",
  "sbNome": "Silva",
  "email": "joao.silva@exemplo.com",
  "genero": "MASCULINO",
  "palavraPasse": "Segura123!",
  "dataNasc": "1990-05-15"
}
```

**Regras de validação:**
- `email`: obrigatório, formato válido, único na base de dados.
- `palavraPasse`: mínimo 8 caracteres, pelo menos uma letra maiúscula, um número e um caractere especial (recomendação; pode ser configurável).
- `dataNasc`: deve ser uma data fornecida.

**Resposta (201 Created):**
```json
{
  "id": 101,
  "pNome": "João",
  "sbNome": "Silva",
  "email": "joao.silva@exemplo.com",
  "genero": "MASCULINO",
  "role": "LEITOR",
  "dataNasc": "1990-05-15",
  "createdAt": "2025-03-30T10:00:00.123Z"
}
```

**Erros possíveis:**
- `400` – validação de campos (ex: email inválido, palavra-passe fraca)
- `422` – email já registado

---

### `POST /login`

Autentica um leitor e devolve um token JWT.

**Request Body (JSON):**
```json
{
  "email": "joao.silva@exemplo.com",
  "palavraPasse": "Segura123!"
}
```

**Resposta (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "tipo": "Bearer",
  "expiracaoSegundos": 3600,
  "leitor": {
    "id": 101,
    "pNome": "João",
    "sbNome": "Silva",
    "email": "joao.silva@exemplo.com",
    "role": "LEITOR"
  }
}
```

**Erros possíveis:**
- `401` – Credenciais inválidas (email ou palavra-passe errados)

---

### `POST /refresh`

Recebe um token JWT ainda válido (mas próximo da expiração) e devolve um novo token com duração renovada.

**Request Header:**
```
Authorization: Bearer <token_atual>
```

**Request Body:** (vazio)

**Resposta (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...novo",
  "tipo": "Bearer",
  "expiracaoSegundos": 3600
}
```

**Erros possíveis:**
- `401` – Token inválido ou expirado (não é possível renovar)

---

### `POST /logout` (opcional)

Embora o backend seja stateless, este endpoint pode ser usado para descartar o token no cliente.  
Para uma blacklist futura, poderia invalidar o token no servidor.

**Request Header:**
```
Authorization: Bearer <token_a_invalidar>
```

**Resposta (204 No Content)** – independentemente de o token ser válido ou não.

---

## Notas de implementação (Spring Security)

- O filtro de autenticação deve ignorar os endpoints `/register`, `/login` e `/refresh`.
- As palavras-passe são codificadas com `BCryptPasswordEncoder` (força 10).
- O token JWT deve conter no payload: `id`, `email`, `role` e `exp` (expiração).
- Para `/refresh`, validar a assinatura e expiração; se o token expirou, não renovar.
- A blacklist de tokens (logout) pode ser implementada futuramente com Redis ou uma tabela `TokenInvalido`.

---

*Estes endpoints são a porta de entrada para todos os recursos protegidos.*