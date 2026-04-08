# Requisitos do Sistema

Este documento define o que o sistema deve fazer (requisitos funcionais) e as propriedades que deve ter (requisitos não funcionais). Tudo nasce da visão do produto e alimenta o modelo de dados, a arquitectura e a API.

---

## Requisitos Funcionais (RF)

| ID | Descrição |
|----|------------|
| RF1 | O sistema permite que qualquer pessoa crie uma conta (registo) e passe a ser um **utilizador** autenticado. |
| RF2 | Qualquer visitante – registado ou não – pode ver uma pré‑visualização (amostra) de cada revista. Para ver o conteúdo completo, é necessário pagar. |
| RF3 | Um utilizador que tenha efectuado o pagamento só consegue aceder à revista completa se estiver autenticado na sua conta. |
| RF4 | O sistema gerencia pagamentos, seja por envio de comprovativo (validação manual) ou, futuramente, por integração com um *gateway*. Cada pagamento fica associado ao utilizador e à edição comprada. |
| RF5 | Existe um painel administrativo (apenas para quem tem `role = ADMIN`) onde se pode fazer upload de novas edições (PDF e metadados) e gerir o que já foi publicado. |
| RF6 | O sistema deve permitir configurar quais páginas ou secções são públicas (amostra) e quais são restritas. **Nota:** Esta funcionalidade ficou para uma versão futura – na versão inicial usamos uma percentagem fixa (15% das primeiras páginas). |
| RF7 | Utilizadores autenticados podem criar comentários e anotações em pontos específicos das páginas, bem como responder a comentários existentes. |
| RF8 | O sistema deve gerar um histórico de leitura, para que o utilizador saiba onde parou em cada revista. **Nota:** Também adiada para uma versão futura. |

Os detalhes de implementação de cada RF estão espalhados pela documentação – especialmente nos diagramas de sequência ([pagamento](06-diagrams/ds-payment.md), [comentários](06-diagrams/ds-comment.md)) e na especificação da [API](05-api/overview.md).

---

## Requisitos Não Funcionais (RNF)

| ID | Descrição                                                                                                                                                                                                                          |
|----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| RNF1 | As palavras‑passe são armazenadas com hash BCrypt – nunca em texto plano.                                                                                                                                                          |
| RNF2 | A visualização das revistas (mesmo em ligações instáveis) deve ser fluida, usando carregamento progressivo e cache quando possível.                                                                                                |
| RNF3 | O banco de dados garante integridade referencial: só se acede à revista completa se existir um pagamento confirmado (estado `APROVADO`) para aquele utilizador e revista.                                                          |
| RNF4 | O backend é organizado em camadas (Controller → Mapper → Service → Repository → Entity), como descrito na [arquitectura](04-architecture/layers.md). Isso permite evoluir para modelos 3D ou outras inovações sem reescrever tudo. |

---

## Regras de Negócio (RN)

Estas são regras que orientam o comportamento do sistema, independentemente da tecnologia.

- **Validação de pagamento:** O acesso à revista completa só é libertado depois de o pagamento ser aprovado – manualmente (via comprovativo) ou, futuramente, por *gateway* automático.
- **Sessão única (opcional):** Para evitar partilha de contas, o sistema *poderá* impedir que uma mesma conta visualize a revista paga em mais de dois dispositivos simultaneamente. Esta regra não está implementada na versão inicial.
- **Expiração de amostra:** Um visitante não autenticado tem acesso a, no máximo, 15% do conteúdo total de cada edição (percentagem fixa na versão inicial, mas futuramente configurável).

---

## Relação com outros documentos

- Os RFs e RNFs são o ponto de partida para o [modelo de dados](03-data-model/erm.md) e a [API](05-api/overview.md).
- A regra de validação de pagamento está desenhada no [diagrama de sequência de pagamento](06-diagrams/ds-payment.md).
- A questão da sessão única e das amostras configuráveis está anotada nas [melhorias futuras](./07-future-improvements.md).

---

*Este documento mantém‑se vivo: sempre que um requisito muda, actualizamo‑lo e reflectimos a mudança nos artefactos técnicos.*