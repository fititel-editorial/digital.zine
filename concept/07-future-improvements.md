# Melhorias Futuras

Nem tudo o que planeámos cabe na versão inicial. Algumas ideias ficaram no papel para serem amadurecidas ou simplesmente porque não são críticas para o primeiro lançamento. Este documento regista essas funcionalidades – um roteiro do que pode vir a seguir.

---

## 1. Histórico de Leitura (RF8)

**A ideia original:**  
Saber onde o utilizador parou a leitura em cada revista, para que ao regressar possa retomar do ponto exacto.

**O que temos agora:**  
Nada. A funcionalidade não foi modelada.

**Como poderá ser implementada no futuro:**  
Uma tabela `Leitura` com os campos `id_utilizador`, `id_revista`, `ultima_pagina` e os habituais timestamps de auditoria. O par `(id_utilizador, id_revista)` seria único, e cada vez que o utilizador avançasse para uma página, o campo `ultima_pagina` seria actualizado. O frontend poderia consultar um endpoint como `GET /utilizadores/me/historico/{id_revista}` para posicionar automaticamente a visualização.

**Prioridade:** Média. Não é essencial para vender ou aceder às revistas, mas melhora a experiência.

---

## 2. Gestão Fina de Amostras (RF6)

**A ideia original:**  
Permitir que o administrador escolha, página a página, quais trechos da revista são visíveis na pré-visualização gratuita.

**O que temos agora:**  
Uma solução simples e fixa: as primeiras 15% das páginas de cada revista são públicas. Não há controlo individual.

**Como poderá ser evoluído:**  
Adicionar um campo booleano `is_public_preview` na tabela `Pagina`. Assim, cada página pode ser marcada como “visível na amostra” ou “bloqueada”. Uma alternativa mais flexível seria uma tabela `AmostraConfig` para definir intervalos ou percentagens por edição.

**Prioridade:** Baixa. Pode ser adicionada depois sem quebrar a API actual.

---

## 3. Pagamento Automático via Gateway

**A ideia original:**  
Eliminar a validação manual de comprovativos, integrando directamente com serviços como MCX Express ou Unitel Money.

**O que temos agora:**  
Apenas o fluxo manual: o utilizador envia um comprovativo (PDF/imagem) e o administrador analisa e aprova.

**Como poderá ser evoluído:**  
Integrar com um gateway que notifique o backend por webhook. O fluxo passaria a ser: o utilizador escolhe o método, é redireccionado para o gateway, e após o pagamento bem-sucedido o sistema muda o estado para `APROVADO` e gera o token de acesso automaticamente.

**Prioridade:** Média. Reduz trabalho administrativo, mas exige negociação com fornecedores e implementação de webhooks.

---

## 4. Sessão Única (Anti‑Pirataria)

**A ideia original:**  
Impedir que a mesma conta seja usada em mais de dois dispositivos ao mesmo tempo para aceder a revistas pagas.

**O que temos agora:**  
Nada. Qualquer utilizador autenticado pode aceder a partir de quantos dispositivos quiser.

**Como poderá ser evoluído:**  
Manter uma tabela de sessões activas (`id_utilizador`, `token_jwt`, `ultima_atividade`). Ao aceder a uma revista completa, verificar se o número de sessões activas ultrapassa o limite (ex: 2). Se sim, bloquear o acesso.

**Prioridade:** Baixa. Só faz sentido se houver abuso real; pode ser decidido mais tarde.

---

## 5. Modelos 3D e Conteúdo “Phygital” Avançado

**A ideia original (feature 1.1.2):**  
Artigos com botões para expandir, modelos 3D, animações – coisas que não cabem no papel.

**O que temos agora:**  
Nada. É uma visão futurista.

**Como poderá ser evoluído:**  
Criar uma tabela `ConteudoExtra` (`id`, `id_pagina`, `tipo`, `url_recurso`). O frontend, ao detectar que uma página tem conteúdos extra, renderizaria botões ou visualizações adicionais.

**Prioridade:** Muito baixa. É um diferencial interessante, mas não essencial para o lançamento.

---

## Como lidar com estas melhorias

Cada uma delas deve ser registada como uma *issue* no repositório (com a etiqueta `enhancement`). Quando forem implementadas, a documentação em `concept/` deve ser actualizada para reflectir as mudanças. O objectivo é não quebrar a compatibilidade com versões anteriores da API.

---

*Este documento serve como um roteiro – o que pode vir a seguir, não uma promessa de entrega.*