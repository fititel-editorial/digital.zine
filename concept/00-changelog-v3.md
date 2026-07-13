# Changelog da Documentação — Arquitectura Final (v3)

Esta versão substitui por completo a proposta anterior. O modelo de dados aqui descrito foi **decidido em reunião conjunta com o colega do frontend** e é a fonte de verdade a partir de agora — inclusive onde contradiz análises anteriores feitas só do lado do backend.

> **Correcção pós-reunião:** uma primeira versão deste changelog registou, por engano, "código também em português" — a decisão real da equipa é **documentação em português, código-fonte em inglês** (ver decisão 17 em [`04-architecture/technical-decisions.md`](./04-architecture/technical-decisions.md)). Os pontos abaixo já reflectem a correcção. O boilerplate de backend gerado inicialmente foi também removido, por não cumprir a arquitectura em camadas — será refeito de raiz seguindo [`08-implementation-guides/crud-implementation-guide.md`](./08-implementation-guides/crud-implementation-guide.md).

## Decisões da reunião (resumo)

| Tema | Decisão |
|------|---------|
| Modelo de dados | Novo MER, com `Revista` como título/marca (ex.: "FITITEL") e `Edicao` como a unidade vendável (o que antes se chamava "revista" em edições anteriores da documentação) |
| Pagamento | Gateway EMIS/GPO, numa primeira fase só Multicaixa Express — via número de telemóvel ("Express") ou via referência para pagamento em ATM/homebanking ("ATM"). Confirmação chega ao backend de forma assíncrona. |
| Comentários | Um único modelo — `FlipbookComentario`, posicionado (x, y) numa página do flipbook, com contagem de `likes`. **Não há mais resposta aninhada nem review geral da edição** — ambos os conceitos foram descartados nesta reunião. |
| Editores | `Editor_Edicao` — tabela de associação entre utilizadores e edições, para atribuir responsabilidade editorial sem criar um terceiro `role`. |
| Novidades de conteúdo | `Edicao_Tag` (etiquetas), `Edicao_Artigo` (artigos dentro de uma edição, com página e ordem), `Favorito` (marcadores do leitor) |
| Auditoria | `Log` — registo de actividade administrativa (sem `id_alvo`/`nome_alvo` detalhado nos campos extra da v2; mantém-se simples, como decidido em reunião) |
| Imagem do flipbook | Formato **WebP** (substituiu JPG/PNG) |
| Armazenamento de objectos | Supabase Storage em desenvolvimento; Cloudflare R2 em produção |
| Hospedagem | Frontend na Vercel; backend no Render; ambos em contentores Docker |
| Idioma | Documentação em português, incluindo nomes de tabelas/colunas na base de dados (`criado_em/atualizado_em/removido_em`, decididos em reunião). **Código-fonte Java em inglês** (`createdAt/updatedAt/deletedAt` como campos da entidade, mapeados via `@Column`) |
| Arquitectura | Mantém-se em camadas (Controller → Mapper → Service → Repository → Entity), sem alterações |

## Correcção de inconsistências identificadas nesta revisão

Ao rever a documentação anterior à luz do novo MER, foram encontrados os seguintes pontos que precisavam de correcção, para além das decisões explícitas da reunião:

1. **Nomenclatura de auditoria mista.** A documentação anterior usava `createdAt/updatedAt/deletedAt` (inglês) em todas as entidades, mas o próprio MER decidido em reunião já usa `criado_em/atualizado_em` no `Pagamento`. Padronizado para português **na documentação e nos nomes de tabela/coluna da base de dados**; o código Java usa os equivalentes em inglês (ver decisão 17).
2. **`Log` não tem campos de auditoria próprios.** Sendo um registo de eventos, não faz sentido ter `atualizado_em`/`removido_em` — mantém-se apenas `criado_em`, implícito no momento da inserção. Este ponto já vinha da v2 e mantém-se válido.
3. **`FlipbookEdicao` como entidade separada de `Edicao`.** O MER regista-a com apenas `id, id_edicao` — a decisão de a manter separada (em vez de juntar os campos a `Edicao`) só faz sentido se ela guardar estado próprio do processamento do flipbook. Adicionei, como proposta a confirmar, os campos `estado_processamento` e `gerado_em` — ver nota na secção de dados abaixo.
4. **Papel de `Editor_Edicao` face ao `role` do utilizador.** O MER não esclarece se um utilizador `LEITOR` pode ser atribuído como editor de uma edição, ou se isso é exclusivo de `ADMIN`. Assumi, para efeitos de implementação, que só utilizadores com `role = ADMIN` podem ser atribuídos via `Editor_Edicao` — **a confirmar**.
5. **Terminologia "RUPE".** Tecnicamente, RUPE (*Referência Única de Pagamento ao Estado*) é o sistema da EMIS especificamente para pagamentos ao Estado angolano (impostos, taxas), gerido pela AGT. O mecanismo que uma loja privada usa através do GPO é o **pagamento por referência** (Entidade + Referência + Valor, compensado ao fim do dia) — funciona de forma muito semelhante (o utilizador paga num ATM/homebanking, a confirmação chega depois), mas não é literalmente um RUPE. Na documentação técnica abaixo uso "referência Multicaixa (GPO)", mantendo "RUPE" apenas como o termo coloquial já usado internamente pela equipa.
6. **Autoria de artigos.** A antiga entidade `Autor_Revista` desapareceu do novo MER — `Edicao_Artigo` guarda `titulo`/`descricao`/`page`/`ordem`, mas não um campo de autor. Isto não foi decidido explicitamente em reunião; fica como ponto em aberto (ver secção final).

## Ficheiros actualizados nesta versão

- `02-requirements.md`
- `03-data-model/erm.md`, `data-ditionary.md`, `rm.md`, `softdelete-audit.md`
- `04-architecture/security.md`, `technical-decisions.md`, `deployment.md` (novo)
- `05-api/payment-endpoints.md`, `edition-endpoints.md` (substitui `magazine-endpoints.md`), `comments-endpoints.md`, `admin-endpoints.md`, `favorites-endpoints.md` (novo)
- `06-diagrams/dc-classes.md`, `ds-payment.md`, `ds-navigation.md` (novo)
- `06-diagrams/use-cases.md`, `ds-comment.md` (actualizados para o modelo de comentário simplificado)
- `01-product-vision.md` (actualização pontual de terminologia)
- `00-index.md` (novos módulos)
- `08-implementation-guides/` (novo — guia de CRUDs, guia do microsserviço de flipbook, guia do gateway de pagamento)
- `backend/` — mantém apenas a migração Flyway (`V1__init_schema.sql`) com o schema completo. O boilerplate de entidades/repositórios gerado numa primeira versão foi removido, por não implementar a arquitectura em camadas na íntegra (só tinha Entity + Repository, sem Service/Mapper/Controller) — a implementar de raiz seguindo [`08-implementation-guides/crud-implementation-guide.md`](./08-implementation-guides/crud-implementation-guide.md), com `Edition` como exemplo completo em inglês

Os ficheiros `auth-endpoints.md`, `user-endpoints.md` e `layers.md` mantiveram-se estruturalmente, com apenas as referências a nomes de coluna de auditoria corrigidas para a convenção da base de dados em português (o código Java associado mantém-se em inglês).

## Pontos ainda em aberto (não decididos em reunião)

1. **Autoria de artigos** — `Edicao_Artigo` não tem campo de autor; confirmar se é necessário e como modelar.
2. **`Editor_Edicao` restrito a `ADMIN`** — assumido para efeitos de implementação; confirmar.
3. **Campos de `FlipbookEdicao`** — assumi `estado_processamento` e `gerado_em`; confirmar se é isto ou algo diferente.
4. **Retenção do PDF original** — não foi discutido em reunião se o PDF original fica guardado após o processamento (para reprocessamento futuro) ou é descartado. Assumi que fica guardado no object storage, fora do domínio da API.
