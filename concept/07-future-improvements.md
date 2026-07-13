# Melhorias Futuras — v3

> Ver [`00-changelog-v3.md`](./00-changelog-v3.md). Lista revista após a reunião de arquitectura final.

---

## 1. Histórico de Leitura (RF8)

Mantém-se adiado. Proposta: tabela `Leitura` (`id_utilizador`, `id_edicao`, `ultima_pagina`), par único, endpoint `GET /utilizadores/me/historico/{idEdicao}`.

**Prioridade:** Média.

---

## 2. Estatísticas administrativas

Não foi decidido na reunião se entra já no escopo. Endpoint `GET /admin/estatisticas` com métricas gerais (utilizadores, edições vendidas, receita, comentários).

**Prioridade:** A confirmar com a equipa.

---

## 3. URLs de imagem com expiração + rate limiting anti-scraping

O acesso à imagem de cada página é hoje verificado em cada pedido, mas a resposta em si não expira nem tem limite de frequência. Reforço recomendado: URLs assinadas com expiração curta, e rate limiting por utilizador/IP no endpoint de imagem.

**Prioridade:** Média — reavaliar cedo se houver sinais de scraping sequencial.

---

## 4. Tabela de likes únicos por utilizador

`FlipbookComentario.likes` é hoje um contador simples. Para impedir múltiplos likes do mesmo utilizador, é necessária uma tabela `flipbook_comentario_like` — não estava no MER da reunião, fica como proposta.

**Prioridade:** Média — antes de lançar publicamente, para evitar manipulação do contador.

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
