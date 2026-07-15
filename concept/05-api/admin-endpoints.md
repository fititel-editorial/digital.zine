# Endpoints de Administração — v3

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md). Corrigidas as referências cruzadas para os nomes reais dos ficheiros (a versão anterior apontava para nomes de ficheiro que não existiam). Adicionados os endpoints de atribuição de editor e de logs.

**Prefix:** `/api/v1/admin`

Todos os endpoints exigem um token JWT de um utilizador com `role = ADMIN`.

## Revistas e edições

Ver [`edition-endpoints.md`](./edition-endpoints.md): `POST/PUT/DELETE /revistas`, `POST/PUT/DELETE /edicoes`, `POST /edicoes/{id}/flipbook`, `PATCH /edicoes/{id}/paginas/{ordem}`, `POST/PUT/DELETE /edicoes/{id}/artigos`, `POST/DELETE /edicoes/{id}/tags`.

## Pagamentos

Ver [`payment-endpoints.md`](./payment-endpoints.md): `GET /admin/pagamentos`, `PUT /admin/pagamentos/{id}/aprovar`, `PUT /admin/pagamentos/{id}/rejeitar`.

## Comentários (moderação)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| DELETE | `/admin/comentarios/{id}` | Remove (soft delete) qualquer comentário, independentemente do autor |

Mesmo efeito obtido com `DELETE` directo em [`comments-endpoints.md`](./comments-endpoints.md) quando o utilizador é admin; este endpoint é alternativa explícita para clareza no painel de moderação.

---

## Editores de edição — `/admin/edicoes/{idEdicao}/editores`

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/` | Lista utilizadores atribuídos como editores da edição |
| POST | `/` | Atribui um utilizador como editor da edição |
| DELETE | `/{idUtilizador}` | Remove a atribuição |

### `POST /`
```json
{ "idUtilizador": 7 }
```
**Response (201):** `{ "idEdicao": 24, "idUtilizador": 7, "criadoEm": "..." }`
**Regra:** `idUtilizador` deve corresponder a um utilizador com `role = ADMIN` — assumido, a confirmar (ver changelog).
**Erros:** `400`, `403`, `404`, `409` (já atribuído)

---

## Logs de actividade — `/admin/logs`

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/` | Lista de logs de actividade administrativa |

**Query params:** `utilizador` (email), `accao`, `targetType`, `pagina`, `tamanho` (default 50)

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "nomeUtilizador": "Ana Pereira",
      "emailUtilizador": "ana@fititel.co",
      "accao": "criou",
      "targetType": "edicao",
      "targetId": 24,
      "criadoEm": "2026-05-10T09:15:00Z"
    }
  ],
  "meta": { "total": 7, "pagina": 1, "tamanho": 50 }
}
```

**Nota de implementação:** cada endpoint de escrita relevante (`edicao`, `pagamento`, `flipbook_comentario`, `editor_edicao`) deve gravar um `Log` correspondente, na mesma transacção da operação principal.

---

## Estatísticas (ainda não decidido nesta reunião — mantém-se como melhoria futura)

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET | `/admin/estatisticas` | Métricas como número de utilizadores, edições vendidas, total de comentários, etc. |

Não foi discutido na reunião se isto entra no escopo da v3 — mantém-se registado em [`07-future-improvements.md`](../07-future-improvements.md) até ser confirmado.
