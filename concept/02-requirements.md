# Requisitos do Sistema

## Requisitos Funcionais (RF)

| ID | Descrição |
|----|------------|
| RF1 | O sistema deve permitir que utilizadores se registem e possuam uma conta. |
| RF2 | Utilizadores registados ou não podem ver uma pré-visualização (amostra) da revista. Para ver completa, precisam de pagar. |
| RF3 | Utilizadores que efectuarem o pagamento só podem ver a revista completa se estiverem autenticados. |
| RF4 | O sistema deve gerir pagamentos (comprovativo manual ou gateway), associando a transacção ao utilizador e à edição. |
| RF5 | Deve existir um painel administrativo para upload de novas edições (PDF/imagens) e gestão de metadados (tema, autores, data). |
| RF6 | O sistema deve permitir definir quais páginas ou secções são de acesso público (amostra) e quais são restritas (adiado para versão futura). |
| RF7 | Utilizadores autenticados podem criar e visualizar comentários/anotações em pontos específicos das páginas. |
| RF8 | O sistema deve gerar um histórico de leitura para saber onde o utilizador parou (adiado para versão futura). |

## Requisitos Não Funcionais (RNF)

| ID | Descrição |
|----|------------|
| RNF1 | As palavras-passe devem ser armazenadas com hash (BCrypt). |
| RNF2 | As visualizações das revistas devem ser optimizadas para fluidez mesmo em ligações instáveis. |
| RNF3 | O banco de dados deve garantir integridade referencial: só acede à revista completa quem tem pagamento confirmado. |
| RNF4 | A arquitectura do backend deve ser modular (camadas) para permitir futuras implementações (ex: modelos 3D). |

## Regras de Negócio (RN)

- **Validação de pagamento**: O acesso à revista completa só é libertado após validação manual do administrador (via comprovativo) ou automática via API.
- **Sessão única (opcional)**: Pode impedir a mesma conta de visualizar a revista em mais de dois dispositivos simultâneamente.
- **Expiração de amostra**: Utilizador não logado tem acesso a no máximo 15% do conteúdo total de cada edição (percentagem configurável futuramente).

---
*Estes requisitos foram extraídos do README original e mantêm-se como base para o desenvolvimento.*