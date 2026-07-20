# Melhorias Futuras — v3

> Ver [`00-changelog-v3.md`](./00-changelog-v3.md). Lista revista após a reunião de arquitectura final.

---

## 1. Histórico de Leitura (RF8)

Mantém-se adiado. Proposta: tabela `Leitura` (`id_utilizador`, `id_edicao`, `ultima_pagina`), par único, endpoint `GET /users/me/history/{editionId}`.

**Prioridade:** Média.

---

## 2. Estatísticas administrativas

Não foi decidido na reunião se entra já no escopo. Endpoints `GET /admin/statistics` (métricas gerais: utilizadores, edições vendidas, receita, comentários) e `GET /admin/reports/revenue` (receita por edição e mensal — o painel do frontend já prevê estes dados, hoje em mock).

**Prioridade:** A confirmar com a equipa.

---

## 3. URLs de imagem com expiração + rate limiting anti-scraping

O acesso à imagem de cada página é hoje verificado em cada pedido, mas a resposta em si não expira nem tem limite de frequência. Reforço recomendado: URLs assinadas com expiração curta, e rate limiting por utilizador/IP no endpoint de imagem.

**Prioridade:** Média — reavaliar cedo se houver sinais de scraping sequencial.

---

## 4. Tabela de likes únicos por utilizador

`FlipbookComment.likes` é hoje um contador simples. Para impedir múltiplos likes do mesmo utilizador, é necessária uma tabela `flipbook_comentario_like` (entidade `CommentLike`). **Actualização v3.1:** entrou na especificação final da API (`POST/DELETE /pages/{pageId}/comments/{id}/like` com unicidade) — deixou de ser melhoria futura e passa a fazer parte do escopo, via migração `V2__comment_likes.sql`. Mantém-se aqui apenas como registo histórico.

**Prioridade:** Incorporada no escopo da v3.1.

---

## 5. Reconciliação de pagamentos presos em `PROCESSANDO`

Job periódico que consulta directamente a API do GPO para pagamentos presos há mais tempo do que o esperado, cobrindo o caso de uma notificação nunca chegar.

**Prioridade:** Média — recomendado antes de escalar o volume de transacções.

---

## 6. Sessão única (anti-pirataria)

Mantém-se adiado.

**Prioridade:** Baixa.

---

## 7. Modelos 3D e conteúdo "phygital" avançado

Mantém-se adiado.

**Prioridade:** Muito baixa.

---

## 8. Decisão sobre acesso directo do frontend ao object storage

Ver nota em [`06-diagrams/ds-navigation.md`](./06-diagrams/ds-navigation.md) — decidir se as imagens passam sempre pelo backend, ou se o frontend acede directamente ao Supabase/R2 via URLs assinadas.

**Prioridade:** Alta — impacta directamente a arquitectura de servir conteúdo; deve ser decidido cedo, não é uma melhoria de longo prazo.

---

## Como lidar com estas melhorias

Cada uma deve ser registada como uma *issue* no repositório (etiqueta `enhancement`). Quando implementadas, a documentação em `concept/` deve ser actualizada.

---

*Este documento serve como um roteiro — o que pode vir a seguir, não uma promessa de entrega.*
