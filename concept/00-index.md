# Documentação Técnica – Backend da Revista FITITEL

Bem‑vindo à documentação técnica do backend da **Revista Digital FITITEL**.  
Aqui encontrarás tudo o que precisas para compreender o sistema, desde a sua razão de ser até aos detalhes de implementação – modelo de dados, arquitectura, API e decisões de projecto.

Se és novo no projecto, começa pela [visão do produto](./01-visao-produto.md). Depois, mergulha nos [requisitos](./02-requisitos.md) para perceber o que o sistema deve fazer. Quando estiveres pronto para programar, consulta a [arquitectura em camadas](./04-arquitetura/camadas.md) e a [especificação da API](./05-api/overview.md).

---

## Módulos da documentação

| Módulo | Ficheiro                                                 | Descrição |
|--------|----------------------------------------------------------|-------------|
| Visão do produto | [`01-visao-produto.md`](./01-product-vision.md)          | Propósito, público‑alvo, diferenciais |
| Requisitos | [`02-requisitos.md`](./02-requirements.md)               | Funcionais (RF) e não funcionais (RNF) |
| Modelo de dados | [`03-modelo-dados/`](./03-data-model/)                   | MER, MR, dicionário de dados, auditoria |
| Arquitectura | [`04-arquitetura/`](./04-architecture/)                  | Camadas, segurança, decisões técnicas |
| API | [`05-api/`](./05-api/)                                   | Endpoints, contratos, códigos de erro |
| Diagramas | [`06-diagramas/`](./06-diagrams/)                        | UML, sequência, casos de uso |
| Melhorias futuras | [`07-melhorias-futuras.md`](./07-future-improvements.md) | O que fica para depois |

---

## Convenções que atravessam toda a documentação

- **Auditoria e soft delete:** Todas as tabelas têm `createdAt`, `updatedAt` e `deletedAt`. Um registo com `deletedAt` preenchido é considerado eliminado e não aparece nas consultas normais (ver [auditoria](./03-modelo-dados/auditoria-softdelete.md)).
- **Autenticação:** JWT com `Bearer` token. Obtém‑se via [`/auth/login`](./05-api/auth-endpoints.md) ou `/auth/register`.
- **Roles:** Cada utilizador tem uma `role` – `LEITOR` ou `ADMIN`. A diferença de permissões está descrita na [segurança](./04-architecture/security.md).

---

## Como actualizar esta documentação

Qualquer alteração significativa no sistema (mudança no modelo de dados, novo endpoint, nova regra de negócio) deve ser reflectida aqui. Commites relacionados com documentação devem usar o prefixo `docs:` ou `refactor(docs)`.

---

*Boa leitura e bom desenvolvimento.*