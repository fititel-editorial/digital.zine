# Documentação Técnica – Backend da Revista FITITEL — v3

> Ver [`00-changelog-v3.md`](./00-changelog-v3.md) para o resumo de tudo o que mudou nesta versão, decidida em reunião de arquitectura final com o colega do frontend.

Bem-vindo à documentação técnica do backend da **Revista Digital FITITEL**.
Aqui encontrarás tudo o que precisas para compreender o sistema, desde a sua razão de ser até aos detalhes de implementação — modelo de dados, arquitectura, API, decisões de projecto e guias de implementação passo a passo.

Se és novo no projecto, começa pela [visão do produto](./01-product-vision.md). Depois, mergulha nos [requisitos](./02-requirements.md) para perceber o que o sistema deve fazer. Quando estiveres pronto para programar, consulta a [arquitectura em camadas](./04-architecture/layers.md), a [especificação da API](./05-api/overview.md), e os [guias de implementação](./08-implementation-guides/).

---

## Módulos da documentação

| Módulo | Ficheiro | Descrição |
|--------|----------|-------------|
| Changelog | [`00-changelog-v3.md`](./00-changelog-v3.md) | O que mudou nesta versão e porquê |
| Visão do produto | [`01-product-vision.md`](./01-product-vision.md) | Propósito, público-alvo, diferenciais |
| Requisitos | [`02-requirements.md`](./02-requirements.md) | Funcionais (RF) e não funcionais (RNF) |
| Modelo de dados | [`03-data-model/`](./03-data-model/) | MER, MR, dicionário de dados, auditoria |
| Arquitectura | [`04-architecture/`](./04-architecture/) | Camadas, segurança, decisões técnicas, deployment |
| API | [`05-api/`](./05-api/) | Endpoints, contratos, códigos de erro |
| Diagramas | [`06-diagrams/`](./06-diagrams/) | UML, sequência, casos de uso |
| Melhorias futuras | [`07-future-improvements.md`](./07-future-improvements.md) | O que fica para depois |
| Guias de implementação | [`08-implementation-guides/`](./08-implementation-guides/) | Guia de CRUDs, guia do microsserviço de flipbook, guia do gateway de pagamento |

---

## Convenções que atravessam toda a documentação

- **Idioma:** documentação (incluindo nomes de tabelas/colunas na base de dados) em português; código-fonte Java (classes, campos, variáveis, métodos) em inglês, mapeado para a base de dados via anotações JPA.
- **Auditoria e soft delete:** a maioria das tabelas tem `criado_em`, `atualizado_em` e `removido_em`. Um registo com `removido_em` preenchido é considerado eliminado e não aparece nas consultas normais (ver [auditoria](./03-data-model/softdelete-audit.md) para as excepções a este padrão).
- **Autenticação:** JWT com `Bearer` token. Obtém-se via [`/auth/login`](./05-api/auth-endpoints.md) ou `/auth/register`.
- **Roles:** Cada utilizador tem uma `role` — `LEITOR` ou `ADMIN`. Não há um terceiro role para "editor" — essa responsabilidade é modelada como associação (`editor_edicao`). A diferença de permissões está descrita na [segurança](./04-architecture/security.md).

---

## Como actualizar esta documentação

Qualquer alteração significativa no sistema (mudança no modelo de dados, novo endpoint, nova regra de negócio) deve ser reflectida aqui. Commits relacionados com documentação devem usar o prefixo `docs:` ou `refactor(docs)`.

---

*Boa leitura e bom desenvolvimento.*
