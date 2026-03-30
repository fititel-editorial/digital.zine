# Documentação Técnica – Backend da Revista FITITEL

Bem-vindo à documentação técnica do backend da **Revista Digital FITITEL**.  
Este documento é o ponto de partida para desenvolvedores que vão trabalhar no projecto.

## Visão geral
O sistema permite a gestão e distribuição digital da revista da Feira de Inovação Tecnológica do ITEL.  
Leitores podem registar-se, comprar edições, aceder a conteúdos pagos, comentar páginas e administradores podem gerir revistas e validar pagamentos.

## Módulos da documentação

| Módulo | Ficheiro                                                 | Descrição                                   |
|--------|----------------------------------------------------------|---------------------------------------------|
| Visão do produto | [`01-visao-produto.md`](./01-product-vision.md)          | Propósito, público-alvo, diferenciais       |
| Requisitos | [`02-requisitos.md`](./02-requirements.md)               | Funcionais (RF) e não funcionais (RNF)      |
| Modelo de dados | [`03-modelo-dados/`](./03-data-model/)                   | MER, MR, dicionário de dados, auditoria     |
| Arquitectura | [`04-arquitetura/`](./04-architecture/)                  | Camadas, segurança, decisões técnicas       |
| API | [`05-api/`](./05-api/)                                   | Endpoints, contratos, erros                 |
| Diagramas | [`06-diagramas/`](./06-diagrams/)                        | UML, sequência, casos de uso                |
| Melhorias futuras | [`07-melhorias-futuras.md`](./07-future-improvements.md) | Funcionalidades planeadas para versões sucessoras |

## Como usar esta documentação
- Se é novo no projecto, comece pela **Visão do produto** e depois os **Requisitos**.
- Para implementar uma feature, consulte o **Modelo de dados** e a **API**.
- Antes de mudar a arquitectura, leia as **Decisões técnicas**.

## Convenções
- Todas as tabelas têm auditoria (`createdAt`, `updatedAt`, `deletedAt`).
- Soft delete: registos com `deletedAt` não nulo são ignorados nas consultas padrão.
- Autenticação: JWT com `Bearer` token.
- Roles: `LEITOR` e `ADMIN`.

---
*Documentação mantida no repositório. Actualizações devem ser commitadas com prefixo `docs:` ou `refactor(docs)`.*