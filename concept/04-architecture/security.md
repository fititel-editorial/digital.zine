# Segurança — v3

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md). O fluxo de pagamento nesta versão é o decidido em reunião: gateway EMIS/GPO, numa primeira fase apenas Multicaixa Express. A implementação inicial do gateway é **simulada** — a equipa ainda vai contactar a EMIS para obter acesso e certificação oficial.

## Autenticação com JWT

Inalterado face às versões anteriores:

1. O utilizador envia `email` e `palavra_passe` para `/api/v1/auth/login`.
2. As credenciais são validadas.
3. É gerado um JWT assinado, devolvido ao cliente.
4. Requisições seguintes enviam `Authorization: Bearer <token>`.

**Regras do token:** duração de 1 hora, payload com `id`, `email`, `role`. Renovação via `/api/v1/auth/refresh`.

## Papéis e permissões

| Role | Permissões |
|------|-------------|
| `LEITOR` | Compra edições (via gateway), comenta no flipbook, marca favoritos, vê o seu perfil e histórico de compras |
| `ADMIN` | Todas as permissões de `LEITOR`, mais: gere revistas/edições, atribui editores (`editor_edicao`), consulta logs, modera comentários, acompanha pagamentos |

A atribuição de um utilizador como "editor" de uma edição (`editor_edicao`) **não é um terceiro `role`** — é uma associação, assumida como restrita a utilizadores `ADMIN` (ponto a confirmar, ver changelog).

## Acesso ao conteúdo — páginas do flipbook

O PDF completo nunca é exposto por nenhum endpoint da API pública. Cada página é processada de forma assíncrona (split + conversão para WebP) e disponibilizada individualmente via `flipbook_pagina.url_imagem`.

### Regras de acesso

- Se `edicao.e_gratis = true`: todas as páginas do flipbook são acessíveis livremente.
- Se `edicao.e_gratis = false`: a página de capa (`flipbook_pagina.tipo = 'CAPA'`) é sempre acessível como amostra; as páginas de conteúdo (`tipo = 'CONTEUDO'`) só ficam acessíveis a um `LEITOR` autenticado com um `Pagamento` no estado `PAGO` para aquela edição.

## Pagamento via gateway EMIS/GPO — Multicaixa Express

### Duas formas de pagamento, uma primeira fase

1. **Express** — o leitor introduz o seu número de telemóvel associado ao MCX Express (ou lê um código QR); confirma o pagamento directamente na app MCX Express.
2. **Referência (ATM/homebanking)** — o backend pede ao GPO a geração de uma referência de pagamento (Entidade + Referência + Valor); o leitor paga num ATM ou no homebanking do seu banco, fora da aplicação. Internamente a equipa refere-se a esta referência como "RUPE" — tecnicamente, RUPE é o sistema de referência específico para pagamentos ao Estado (via AGT); o mecanismo real aqui é o **pagamento por referência do GPO**, que funciona de forma semelhante mas não é o mesmo sistema. Ver nota no changelog.

Ambas as formas são geridas pelo mesmo fluxo assíncrono: o backend inicia o pedido junto do GPO, e só sabe que o pagamento foi concluído quando recebe uma notificação (callback/webhook) do gateway — não há confirmação síncrona no momento do clique.

### Estado do `Pagamento`

```
PENDENTE ──(leitor inicia pagamento no GPO)──► PROCESSANDO
PROCESSANDO ──(callback confirma sucesso)──► PAGO
PROCESSANDO ──(callback confirma falha)──► REJEITADO
PROCESSANDO ──(sem confirmação dentro do prazo)──► EXPIRADO
```

`PAGO` é o único estado em que a edição fica liberada ao leitor.

### Fluxo completo (visão de alto nível)

1. O leitor escolhe a edição e o método (`MCX_EXPRESS` ou `REFERENCIA`) → `POST /payments`.
2. O backend chama a API do GPO para iniciar a transacção (Express: pede confirmação por telemóvel; Referência: pede geração de Entidade/Referência/Valor). Estado: `PROCESSANDO`.
3. O leitor conclui o pagamento fora da aplicação (na app MCX Express, ou num ATM/homebanking).
4. O GPO notifica o backend de forma assíncrona (o mecanismo exacto de notificação — webhook HTTP, polling periódico, ou outro — depende da forma de integração escolhida junto do banco de apoio; ver [`08-implementation-guides/payment-gateway-guide.md`](../08-implementation-guides/payment-gateway-guide.md)).
5. O backend actualiza `pagamento.status`, `referencia_externa` e `data_pagamento`, e liberta o acesso à edição.
6. O cliente faz *polling* a `GET /payments/{id}` até ver o estado mudar.

### Ambiente de desenvolvimento (antes do acesso oficial à EMIS)

Enquanto o acesso oficial à EMIS/GPO não está disponível, o backend usa um **adaptador simulado** (`GatewayPagamentoService` com uma implementação `SimuladoGatewayPagamentoService`), que:

- Gera uma referência fictícia com o mesmo formato esperado (Entidade/Referência/Valor).
- Permite, num endpoint de desenvolvimento (não exposto em produção), simular manualmente a chegada da confirmação — para testar o fluxo completo sem depender do GPO real.
- É substituído por uma implementação real (`GpoGatewayPagamentoService`) assim que houver credenciais, sem alterar o resto do sistema — o mesmo padrão de interface + implementação já usado no `StorageService`.

Detalhe completo em [`08-implementation-guides/payment-gateway-guide.md`](../08-implementation-guides/payment-gateway-guide.md).

## Protecção de palavras-passe

Inalterado: BCrypt, nunca devolvidas, HTTPS obrigatório em produção, CORS restrito ao domínio do frontend (Vercel).

## Relação com outros documentos

Modelo de dados: [`03-data-model/data-ditionary.md`](../03-data-model/data-ditionary.md). Endpoints: [`05-api/payment-endpoints.md`](../05-api/payment-endpoints.md), [`05-api/edition-endpoints.md`](../05-api/edition-endpoints.md). Diagrama de sequência: [`06-diagrams/ds-payment.md`](../06-diagrams/ds-payment.md). Infra-estrutura: [`04-architecture/deployment.md`](./deployment.md).
