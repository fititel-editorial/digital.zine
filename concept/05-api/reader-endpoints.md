# Endpoints de Leitor

Prefix: `/api/v1/leitores`

## Autenticação exigida

Todos os endpoints deste módulo exigem um token JWT válido (role `LEITOR` ou `ADMIN`).  
O token deve ser enviado no cabeçalho:

```
Authorization: Bearer <token>
```

---

## Endpoints disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/me` | Obtém o perfil do leitor autenticado |
| PUT | `/me` | Actualiza os dados do próprio leitor (excepto role e palavra-passe) |
| PATCH | `/me/password` | Altera a palavra-passe |
| GET | `/me/compras` | Lista as compras (pagamentos) do leitor autenticado |
| GET | `/me/compras/{id}` | Detalhe de um pagamento específico |
| GET | `/me/comentarios` | Lista os comentários feitos pelo leitor |
| DELETE | `/me` | (Opcional) Soft delete da própria conta |

> **Nota:** O histórico de leitura (RF8) será adicionado num endpoint `/me/historico` numa versão futura, conforme [melhorias futuras](../07-future-improvements.md).

---

### `GET /me`

Devolve o perfil completo do leitor autenticado (excepto palavra-passe).

**Resposta (200 OK):**
```json
{
  "id": 101,
  "pNome": "João",
  "sbNome": "Silva",
  "email": "joao.silva@exemplo.com",
  "genero": "MASCULINO",
  "role": "LEITOR",
  "dataNasc": "1990-05-15",
  "createdAt": "2025-03-30T10:00:00.123Z",
  "updatedAt": "2025-03-30T10:00:00.123Z"
}
```

**Erros possíveis:**
- `401` – Token inválido ou ausente.

---

### `PUT /me`

Actualiza os dados do leitor autenticado.  
**Não permite alterar** `email`, `role` nem `palavra-passe` (estes têm endpoints específicos).

**Request Body (JSON):**
```json
{
  "pNome": "João Carlos",
  "sbNome": "Silva Santos",
  "genero": "MASCULINO",
  "dataNasc": "1990-05-15"
}
```

**Resposta (200 OK):** (mesma estrutura do `GET /me`, com os campos actualizados)

**Erros possíveis:**
- `400` – Validação de campos (ex: dataNasc inválida)
- `401` – Token inválido
- `422` – Regra de negócio violada (ex: tentativa de alterar email via este endpoint)

---

### `PATCH /me/password`

Altera a palavra-passe do leitor autenticado.  
A nova palavra-passe é codificada com BCrypt antes de ser armazenada.

**Request Body (JSON):**
```json
{
  "palavraPasseActual": "Segura123!",
  "novaPalavraPasse": "NovaSegura456@"
}
```

**Regras de validação:**
- `palavraPasseActual` deve corresponder à armazenada.
- `novaPalavraPasse` deve cumprir os requisitos de complexidade (mínimo 8 caracteres, maiúscula, número, especial).

**Resposta (204 No Content)** – sem corpo.

**Erros possíveis:**
- `400` – Nova palavra-passe fraca
- `401` – Token inválido
- `422` – Palavra-passe actual incorrecta

---

### `GET /me/compras`

Lista todos os pagamentos efectuados pelo leitor autenticado, com suporte a paginação e filtros.

**Query Parameters (opcionais):**

| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-------------|---------|
| `estado` | string | Filtra por estado do pagamento | `APROVADO`, `PENDENTE`, `ANALISE`, `REJEITADO` |
| `pagina` | int | Número da página (default 0) | `2` |
| `tamanho` | int | Itens por página (default 10, max 50) | `20` |

**Resposta (200 OK):**
```json
{
  "content": [
    {
      "id": 5001,
      "metodo": "TRANSFERENCIA",
      "estado": "APROVADO",
      "dataPagamento": "2025-03-28T14:30:00Z",
      "revista": {
        "id": 10,
        "nome": "Revista FITITEL 2025",
        "preco": 9.99
      },
      "tokenAcesso": "eyJhbGciOiJIUzI1NiIs..."
    }
  ],
  "pageable": { "pageNumber": 0, "pageSize": 10 },
  "totalPages": 3,
  "totalElements": 25
}
```

**Erros possíveis:**
- `401` – Token inválido.

---

### `GET /me/compras/{id}`

Obtém o detalhe de um pagamento específico do leitor.

**Path parameter:** `id` – identificador do pagamento.

**Resposta (200 OK):**
```json
{
  "id": 5001,
  "metodo": "TRANSFERENCIA",
  "estado": "APROVADO",
  "urlComprovativo": "https://storage.../comprovante.pdf",
  "tokenAcesso": "eyJhbGciOiJIUzI1NiIs...",
  "dataPagamento": "2025-03-28T14:30:00Z",
  "revista": {
    "id": 10,
    "nome": "Revista FITITEL 2025",
    "preco": 9.99,
    "urlCapa": "https://storage.../capa.jpg"
  }
}
```

**Erros possíveis:**
- `401` – Token inválido.
- `403` – Tentativa de aceder a pagamento de outro leitor.
- `404` – Pagamento não encontrado.

---

### `GET /me/comentarios`

Lista os comentários escritos pelo leitor, com suporte a paginação.

**Query Parameters (opcionais):**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `pagina` | int | Número da página (default 0) |
| `tamanho` | int | Itens por página (default 10) |

**Resposta (200 OK):**
```json
{
  "content": [
    {
      "id": 3001,
      "texto": "Excelente artigo!",
      "dataEfetiv": "2025-03-29T09:15:00Z",
      "pagina": {
        "id": 155,
        "numPagina": 15,
        "revista": { "id": 10, "nome": "Revista FITITEL 2025" }
      },
      "respostasCount": 2
    }
  ],
  "pageable": { "..." },
  "totalPages": 2,
  "totalElements": 12
}
```

**Erros possíveis:**
- `401` – Token inválido.

---

### `DELETE /me` 

Elimina logicamente (soft delete) a conta do leitor autenticado.  
O registo permanece na base de dados com `deletedAt` preenchido, mas o leitor não consegue mais fazer login nem aceder a recursos.

**Resposta (204 No Content)**

**Erros possíveis:**
- `401` – Token inválido.
- `409` (opcional) – Se existirem pagamentos aprovados associados, pode impedir a eliminação (regra de negócio).

---

## Notas de implementação

- A palavra-passe **nunca** é devolvida em nenhum endpoint.
- As operações de escrita (`PUT`, `PATCH`, `DELETE`) devem actualizar automaticamente o campo `updatedAt` da entidade `Leitor`.
- O soft delete da conta deve também impedir o acesso a qualquer recurso protegido (o filtro JWT deve rejeitar tokens de leitores com `deletedAt` não nulo).
- A listagem de compras e comentários deve incluir apenas registos com `deletedAt IS NULL` (a menos que seja um admin).

## Relação com outros módulos

- [Autenticação](./auth-endpoints.md) – obtenção do token JWT.
- [API de pagamentos](./payment-endpoints.md) – criação de novos pagamentos.
- [API de comentários](./comments-endpoints.md) – criação e gestão de comentários.
- [Melhorias futuras](../07-future-improvements.md) – histórico de leitura.

---

*Estes endpoints permitem que o leitor gerencie a sua conta e consulte o seu histórico de interacções.*