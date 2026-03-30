# Auditoria e Soft Delete

## Padrão de auditoria

Todas as tabelas do sistema incluem três campos automáticos para rastrear a criação e modificação dos registos:

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `createdAt` | `TIMESTAMP` | Data e hora da criação do registo. Preenchido automaticamente no momento da inserção. Nunca é alterado. |
| `updatedAt` | `TIMESTAMP` | Data e hora da última modificação do registo. Actualizado automaticamente em cada operação de `UPDATE`. Pode ser `NULL` se o registo nunca foi modificado após criação. |
| `deletedAt` | `TIMESTAMP` | Marca temporal do soft delete. Se `NULL`, o registo está activo. Se tiver uma data, o registo foi "eliminado" logicamente e deve ser ignorado na maioria das consultas. |

## Comportamento no banco de dados

- **`createdAt`**: `DEFAULT CURRENT_TIMESTAMP NOT NULL`
- **`updatedAt`**: `ON UPDATE CURRENT_TIMESTAMP` (pode ser `NULL` inicialmente)
- **`deletedAt`**: sem valor por defeito (`NULL`)

## Soft delete (eliminação lógica)

Em vez de apagar fisicamente um registo (`DELETE`), o sistema realiza um **soft delete**:

```sql
UPDATE tabela SET deletedAt = CURRENT_TIMESTAMP WHERE id = ?;