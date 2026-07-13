# Auditoria e Soft Delete — v3

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md). Nomes de coluna na base de dados actualizados de inglês para português, por decisão da reunião. No código Java, os campos correspondentes da entidade usam os nomes em inglês (`createdAt`, `updatedAt`, `deletedAt`), mapeados via `@Column`.

## Padrão de auditoria

A maioria das tabelas do sistema inclui três campos automáticos para rastrear a criação e modificação dos registos:

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `criado_em` | `TIMESTAMP` | Data e hora da criação do registo. Preenchido automaticamente no momento da inserção. Nunca é alterado. |
| `atualizado_em` | `TIMESTAMP` | Data e hora da última modificação do registo. Actualizado automaticamente em cada operação de `UPDATE`. Pode ser `NULL` se o registo nunca foi modificado após a criação. |
| `removido_em` | `TIMESTAMP` | Marca temporal do soft delete. Se `NULL`, o registo está activo. Se tiver uma data, o registo foi "eliminado" logicamente e deve ser ignorado na maioria das consultas. |

## Comportamento no banco de dados

- **`criado_em`**: `DEFAULT CURRENT_TIMESTAMP NOT NULL`
- **`atualizado_em`**: `ON UPDATE CURRENT_TIMESTAMP` (pode ser `NULL` inicialmente)
- **`removido_em`**: sem valor por defeito (`NULL`)

## Soft delete (eliminação lógica)

Em vez de apagar fisicamente um registo (`DELETE`), o sistema realiza um **soft delete**:

```sql
UPDATE tabela SET removido_em = CURRENT_TIMESTAMP WHERE id = ?;
```

Todas as consultas de listagem e de detalhe devem filtrar `WHERE removido_em IS NULL`, salvo indicação explícita em contrário (ex.: um endpoint de administração que precise de ver registos removidos).

## Tabelas que fogem ao padrão

Nem todas as tabelas do sistema seguem o padrão completo de três campos — ver [`data-ditionary.md`](./data-ditionary.md) para o detalhe exacto de cada tabela:

| Tabela | Desvio | Motivo |
|--------|--------|--------|
| `pagamento` | Sem `removido_em` | Registo financeiro — não é eliminado, nem logicamente |
| `log` | Só `criado_em` | Registo de auditoria imutável — não é editado nem eliminado |
| `editor_edicao`, `edicao_tag`, `favorito` | Só `criado_em` | Registos de associação simples, sem estado próprio a editar; removem-se fisicamente (`DELETE`) quando aplicável |

## Relação com outros documentos

Este padrão aplica-se a todas as entidades listadas em [`erm.md`](./erm.md) e detalhadas em [`data-ditionary.md`](./data-ditionary.md), com as excepções acima.
