# Visão do Produto – Revista Digital FITITEL — v3

> Ver [`00-changelog-v3.md`](./00-changelog-v3.md). Terminologia actualizada: "revista" nesta visão corresponde agora a uma **edição** no modelo de dados (a FITITEL, como marca, é a "revista"); pagamento e comentários actualizados.

## O que é isto?

A **FITITEL** é a Feira de Inovação Tecnológica do ITEL. Todos os anos, a feira produz uma revista com artigos técnicos, projectos de estudantes e inovações. Até agora, essa revista era apenas um PDF estático.

Queremos transformá‑la numa **plataforma digital interactiva** – onde ler a revista seja uma experiência viva, os leitores possam comentar e discutir, e o acesso pago seja simples e controlado.

## O que o sistema permite?

- **Acesso gratuito a amostras** – qualquer visitante pode ler a capa de cada edição paga; edições marcadas como gratuitas ficam totalmente abertas.
- **Compra e desbloqueio** – quem pagar via Multicaixa Express (por telemóvel ou por referência, através do gateway GPO da EMIS) vê a edição completa.
- **Comentários** – qualquer leitor autenticado pode comentar num ponto específico de uma página e receber "gostos" de outros leitores.
- **Administração simples** – a equipa do ITEL consegue publicar novas edições, atribuir editores responsáveis e moderar comentários.

## Para quem é?

- **Leitores** – pessoas que querem acompanhar a inovação tecnológica em Angola, ler artigos técnicos e descobrir projectos.
- **Administradores** – membros da organização da FITITEL, responsáveis por manter o site actualizado e validar pagamentos.

## O que torna esta revista diferente de um PDF?

1. **Navegação contextual** – uma linha do tempo que permite saltar entre edições antigas e novas, como se folheasse a revista.
2. **Conteúdo “phygital”** – artigos com botões para expandir (e, no futuro, modelos 3D que não cabem no papel).
3. **Sistema de comentários** – anotações posicionadas na própria página, com "gostos" em vez de fios de discussão.
4. **Modelo de amostra** – o visitante vê a capa antes de comprar (ou a edição inteira, se marcada como gratuita), em vez de encontrar um muro de pagamento.

## Objectivos de negócio

- Aumentar o tempo que os visitantes passam no site.
- Transformar edições antigas em fontes de consulta recorrente.
- Gerar receita através da venda de acessos completos.

## Restrições que vêm da visão

- Apenas utilizadores autenticados **com pagamento confirmado (`status = PAGO`)** podem ver a edição completa.
- A confirmação do pagamento é automática, via gateway GPO da EMIS (Multicaixa Express) — numa fase de desenvolvimento inicial, simulada, até haver acesso oficial à EMIS.
- O sistema deve ser modular – a arquitectura em camadas e os mappers manuais foram escolhidos para permitir evoluções como modelos 3D sem reescrever tudo.

---

*Esta visão orienta cada decisão técnica, do modelo de dados à forma como os endpoints são desenhados.*