# Requisitos do Sistema — v3

> Ver [`00-changelog-v3.md`](./00-changelog-v3.md). Este documento define o que o sistema deve fazer (requisitos funcionais) e as propriedades que deve ter (requisitos não funcionais), actualizado com as decisões da reunião de arquitectura final.

## Requisitos Funcionais (RF)

| ID | Descrição |
|----|------------|
| RF1 | O sistema permite que qualquer pessoa crie uma conta (registo) e passe a ser um **utilizador** autenticado. |
| RF2 | Qualquer visitante — registado ou não — pode ver a capa de cada edição paga; edições marcadas como gratuitas (`e_gratis = true`) ficam totalmente abertas. Para ver o conteúdo completo de uma edição paga, é necessário comprar. |
| RF3 | Um utilizador que tenha efectuado o pagamento só consegue aceder ao conteúdo completo se estiver autenticado na sua conta. |
| RF4 | **(alterado)** O sistema gere pagamentos através do gateway EMIS/GPO, numa primeira fase apenas Multicaixa Express, com duas formas: confirmação por telemóvel ("Express") ou pagamento por referência ("ATM"/homebanking). A confirmação chega de forma assíncrona. Cada pagamento fica associado ao utilizador e à edição comprada. |
| RF5 | Existe um painel administrativo (apenas para quem tem `role = ADMIN`) onde se pode fazer upload de novas edições (PDF e metadados) e gerir o que já foi publicado. |
| RF6 | **(alterado)** O acesso à amostra gratuita é definido ao nível da edição (`e_gratis`), com a capa sempre visível como pré-visualização das edições pagas. |
| RF7 | **(alterado)** Utilizadores autenticados podem criar comentários posicionados (x, y) numa página do flipbook, e dar "like" nos comentários de outros leitores. Não há resposta aninhada nem comentário geral sobre a edição — ambos foram descartados na reunião. |
| RF8 | O sistema deve gerar um histórico de leitura, para que o utilizador saiba onde parou em cada edição. **Mantém-se adiado** — ver [`07-future-improvements.md`](./07-future-improvements.md). |
| RF9 | **(novo)** O sistema regista um log de actividade administrativa (`Log`), consultável por administradores. |
| RF10 | **(novo)** Um administrador pode atribuir outros utilizadores como editores responsáveis por uma edição específica (`Editor_Edicao`), sem que isso implique um novo `role`. |
| RF11 | **(novo)** Um leitor autenticado pode marcar/desmarcar edições como favoritas (`Favorito`). |
| RF12 | **(novo)** Uma edição pode ter etiquetas (`Edicao_Tag`) e um índice de artigos (`Edicao_Artigo`), cada um associado à página onde começa. |

## Requisitos Não Funcionais (RNF)

| ID | Descrição |
|----|------------|
| RNF1 | As palavras-passe são armazenadas com hash BCrypt — nunca em texto plano. |
| RNF2 | A visualização das edições (mesmo em ligações instáveis) deve ser fluida, usando carregamento progressivo (página a página) e pré-carregamento da página seguinte, conforme [`06-diagrams/ds-navigation.md`](./06-diagrams/ds-navigation.md). |
| RNF3 | O backend garante que só se acede a uma página de conteúdo (não-capa) de uma edição paga se existir um pagamento no estado `PAGO` para aquele utilizador e edição. |
| RNF4 | O backend é organizado em camadas (Controller → Mapper → Service → Repository → Entity), como descrito na [arquitectura](./04-architecture/layers.md). Sem alterações face a versões anteriores. |
| RNF5 | A confirmação de pagamento via GPO deve ser resiliente a notificações duplicadas (idempotência) e a falhas temporárias de rede, sem duplicar transacções nem cobrar duas vezes. |
| RNF6 | **(novo, corrigido)** A documentação, incluindo nomes de tabelas/colunas na base de dados, é escrita em português. O código-fonte Java (classes, campos, variáveis, métodos) é escrito em inglês. |
| RNF7 | **(novo)** As imagens de página do flipbook são armazenadas em formato WebP. |

## Regras de Negócio (RN)

- **Validação de pagamento:** o acesso ao conteúdo completo só é libertado depois de `Pagamento.status = 'PAGO'`, confirmado pelo GPO (ou, em desenvolvimento, pela simulação — ver [`08-implementation-guides/payment-gateway-guide.md`](./08-implementation-guides/payment-gateway-guide.md)).
- **Atribuição de editor:** assumida como restrita a utilizadores `role = ADMIN` — a confirmar (ver changelog).
- **Amostra:** a capa de uma edição paga é sempre visível; o restante conteúdo só após pagamento.

## Relação com outros documentos

Os RFs e RNFs alimentam o [modelo de dados](./03-data-model/erm.md) e a [API](./05-api/overview.md). O fluxo de pagamento está desenhado em [`04-architecture/security.md`](./04-architecture/security.md) e nos diagramas de sequência em [`06-diagrams/`](./06-diagrams/).
