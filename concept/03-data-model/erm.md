# Modelo Entidade-Relacionamento (MER) — v3.1

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md). **Actualização v3.1:** o MER passa a usar nomenclatura em **inglês**, alinhada com as classes Java e com a especificação final da API. Os nomes físicos de tabelas/colunas da base de dados mantêm-se em português (ver [`data-ditionary.md`](./data-ditionary.md)), mapeados via anotações JPA `@Column`/`@Table`.

## Entidades e atributos

**User** (<u>id</u>, firstName, lastName, dateOfBirth, email, passwordHash, role, createdAt, updatedAt, deletedAt)

**Magazine** (<u>id</u>, name, createdAt, updatedAt, deletedAt)

**Edition** (<u>id</u>, magazineId, theme, tagline, description, price, pageCount, number, releaseDate, free, createdAt, updatedAt, deletedAt)

**Payment** (<u>id</u>, userId, editionId, amount, status, paymentMethod, externalReference, paidAt, createdAt, updatedAt)

**EditionEditor** (<u>id</u>, editionId, userId, createdAt)

**EditionTag** (<u>id</u>, editionId, tag, createdAt)

**EditionArticle** (<u>id</u>, editionId, title, description, page, order, createdAt, updatedAt, deletedAt)

**Favorite** (<u>id</u>, userId, editionId, createdAt)

**ActivityLog** (<u>id</u>, userName, userEmail, action, targetType, targetId, createdAt)

**EditionFlipbook** (<u>id</u>, editionId, processingState, generatedAt, createdAt, updatedAt)

**FlipbookPage** (<u>id</u>, flipbookId, pageNumber, type, imageUrl, order, createdAt, updatedAt, deletedAt)

**FlipbookComment** (<u>id</u>, pageId, userId, text, likes, x, y, createdAt, updatedAt, deletedAt)

**CommentLike** (<u>id</u>, commentId, userId, createdAt) — *entidade adicionada na especificação final da API para garantir unicidade de likes (um like por utilizador por comentário); requer migração Flyway própria (`V2__comment_likes.sql`). A confirmar com a equipa.*

## Relacionamentos e cardinalidades

- **Magazine 1 : N Edition** — Uma revista (título/marca, ex.: "FITITEL") agrupa várias edições ao longo do tempo. `Edition` é a unidade efectivamente vendida e lida.
- **User 1 : N Payment** — Um utilizador pode efectuar vários pagamentos.
- **Payment N : 1 Edition** — Um pagamento refere-se a uma edição específica.
- **User N : M Edition** (via **EditionEditor**) — Um utilizador pode ser responsável editorial por várias edições; uma edição pode ter vários editores atribuídos. *(assumido restrito a `role = ADMIN` — ver ponto em aberto no changelog)*
- **Edition 1 : N EditionTag** — Uma edição pode ter várias etiquetas.
- **Edition 1 : N EditionArticle** — Uma edição é composta por vários artigos, cada um com a página onde começa (`page`) e a ordem de apresentação (`order`).
- **User N : M Edition** (via **Favorite**) — Um utilizador pode marcar várias edições como favoritas.
- **Edition 1 : 1 EditionFlipbook** — Cada edição tem, no máximo, um flipbook associado (gerado a partir do PDF), com o seu próprio estado de processamento.
- **EditionFlipbook 1 : N FlipbookPage** — Um flipbook é composto por várias páginas-imagem.
- **FlipbookPage 1 : N FlipbookComment** — Uma página do flipbook recebe vários comentários posicionados.
- **User 1 : N FlipbookComment** — Um utilizador escreve comentários.
- **User N : M FlipbookComment** (via **CommentLike**) — Um utilizador pode gostar de vários comentários; um comentário recebe likes de vários utilizadores, no máximo um por utilizador.
- **ActivityLog** — Sem chave estrangeira formal; referencia qualquer entidade através de `targetType` + `targetId` (polimorfismo fraco, resolvido a nível de aplicação).

## Notas

- `Magazine` deixou de conter preço, páginas ou data de lançamento — esses campos migraram para `Edition`, que é agora a unidade de venda. Isto resolve a ambiguidade "Edição vs Revista" identificada antes da reunião.
- `Edition.free` substitui qualquer regra de amostra por percentagem — uma edição é, na íntegra, gratuita ou paga. O controlo fino de quais páginas específicas ficam visíveis antes da compra é feito a nível de `FlipbookPage.type` (`CAPA`/`CONTEUDO` — ver dicionário de dados).
- `Payment.status` e `Payment.paymentMethod` cobrem o fluxo de gateway EMIS/GPO — ver [`04-architecture/security.md`](../04-architecture/security.md). Os **valores** dos enums de domínio mantêm-se em português (`PENDENTE/PROCESSANDO/PAGO/REJEITADO/EXPIRADO`, `MCX_EXPRESS/REFERENCIA`, `LEITOR/ADMIN`, `CAPA/CONTEUDO`), pois são valores de dados, não identificadores de código.
- `Payment` não tem `deletedAt` — registos financeiros não são eliminados, nem logicamente.
- `FlipbookComment` substitui tanto o antigo `ComentarioPagina` como o `ComentarioRevista` de propostas anteriores — é o único modelo de comentário, sem resposta aninhada.
- `EditionFlipbook.processingState` e `generatedAt` são uma proposta minha para tornar a entidade operacional (o MER da reunião só regista `id, editionId`) — a confirmar com a equipa.
- Todas as entidades têm `createdAt`; `updatedAt` e `deletedAt` aplicam-se onde faz sentido (não em `ActivityLog`, `EditionEditor`, `EditionTag`, `Favorite` nem `CommentLike`, que são registos de associação/evento sem edição posterior).
- **Correspondência física:** o mapeamento entidade → tabela (ex.: `User` → `utilizador`, `Edition` → `edicao`) e atributo → coluna (ex.: `firstName` → `p_nome`) está no [dicionário de dados](./data-ditionary.md) e no [diagrama de classes](../06-diagrams/dc-classes.md).
