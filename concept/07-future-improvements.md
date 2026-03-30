# Melhorias Futuras

Este documento regista as funcionalidades que foram identificadas durante a fase conceptual mas que **não serão implementadas na versão inicial** do sistema.  
A decisão de adiar permite entregar um MVP (Mínimo Produto Viável) mais rapidamente, sem comprometer a qualidade ou a segurança.

---

## 1. Histórico de Leitura (RF8)

**Descrição original:**  
O sistema deve gerar um histórico de acessos/leituras para que o utilizador saiba onde parou a leitura de cada revista.

**Estado actual:**  
Não modelado. A funcionalidade será implementada numa versão futura.

**Sugestão de implementação (quando for retomada):**

Criar uma tabela `Leitura` com os seguintes campos:

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `id` | `BIGINT` | PK |
| `id_leitor` | `BIGINT` | FK para `Leitor(id)` |
| `id_revista` | `BIGINT` | FK para `Revista(id)` |
| `ultima_pagina` | `INT` | Número da última página lida |
| `updatedAt` | `TIMESTAMP` | Última actualização (quando o leitor avançou) |
| `createdAt` | `TIMESTAMP` | Criação do registo (primeiro acesso) |

**Regras de negócio:**
- Cada par `(id_leitor, id_revista)` é único.
- Sempre que o leitor navegar para uma página, o campo `ultima_pagina` é actualizado.
- O frontend pode consultar o endpoint `GET /leitores/me/historico/{id_revista}` para obter a última página lida e posicionar automaticamente.

**Prioridade:** Média – melhoria de experiência do utilizador, mas não bloqueia a venda ou o acesso.

---

## 2. Gestão de Amostras Configurável (RF6)

**Descrição original:**  
O sistema deve permitir a gestão de "Amostras" (Preview), definindo quais páginas ou secções são de acesso público e quais são restritas.

**Estado actual:**  
Na versão inicial, a amostra será implementada de forma **fixa**: uma percentagem (ex: 15%) das primeiras páginas de cada revista é pública.  
Não há controlo fino por página.

**Sugestão de implementação futura:**

Adicionar um campo `is_public_preview` (booleano) na tabela `Pagina`.
- `true`: página visível na pré-visualização (amostra).
- `false`: página bloqueada, exige pagamento aprovado.

Alternativa mais flexível: criar uma tabela `AmostraConfig` que define intervalos de páginas ou percentagens por edição.

**Prioridade:** Baixa – pode ser implementada posteriormente sem quebrar a API (basta adicionar campo e ajustar a lógica de serviço).

---

## 3. Gateway de Pagamento Automático (RN - Validação de Pagamento)

**Descrição original:**  
A validação de pagamentos pode ser feita via API bancária, em vez de comprovativo manual.

**Estado actual:**  
Apenas validação manual (administrador analisa comprovativo enviado pelo leitor).

**Sugestão futura:**  
Integrar com um gateway (ex: MCX Express, Unitel Money via API). O fluxo passaria a ser:

1. Leitor escolhe método e é redireccionado para o gateway.
2. O gateway notifica o backend via webhook.
3. O estado do pagamento muda automaticamente para `APROVADO` e o `token_acesso` é gerado.

**Prioridade:** Média – reduz trabalho administrativo, mas exige negociação com fornecedores e implementação de webhooks.

---

## 4. Sessão Única (Opcional)

**Descrição original (RN - Sessão Única):**  
Para evitar pirataria, o sistema pode impedir que a mesma conta visualize a revista paga em mais de dois dispositivos simultaneamente.

**Estado actual:**  
Não implementado. Qualquer leitor autenticado pode aceder a partir de múltiplos dispositivos.

**Sugestão futura:**  
Manter um registo de sessões activas (tabela `Sessao` com `id_leitor`, `token_jwt`, `ultima_atividade`). Ao aceder à revista completa, verificar se o número de sessões activas excede o limite.

**Prioridade:** Baixa – depende de análise de abuso real.

---

## 5. Modelos 3D e Conteúdo "Phygital" Avançado

**Descrição original (feature 1.1.2):**  
Artigos técnicos que possuem botões para expandir, e quem sabe, no futuro, modelos em 3D que não cabem no papel.

**Estado actual:**  
Não modelado nem implementado.

**Sugestão futura:**
- Criar uma tabela `ConteudoExtra` (`id`, `id_pagina`, `tipo` (ex: 'MODELO_3D', 'VIDEO', 'ANIMACAO'), `url_recurso`).
- O frontend renderizaria o recurso adicional quando disponível.

**Prioridade:** Muito baixa – é uma funcionalidade inovadora mas não essencial para o lançamento.

---

## Como proceder com estas melhorias

- Cada melhoria deve ser registada como uma **issue** no repositório (GitHub) com a etiqueta `enhancement`.
- Quando forem implementadas, actualizar a documentação (`concept/`) para reflectir as mudanças no modelo de dados e na API.
- As melhorias não devem quebrar a compatibilidade com versões anteriores da API.

---

*Este documento serve como roteiro para futuras iterações do projecto.*