# Fluxo de Trabalho (Workflow)

Este documento define o fluxo de trabalho recomendado para o desenvolvimento do backend.  
Não é obrigatório, mas sim um guia para manter consistência e qualidade.

## 1. Ciclo de desenvolvimento

1. Criar uma issue (GitHub/GitLab) para a tarefa ou bug.
2. Criar branch a partir de `main` (ou `develop`):
    - `feature/nome-descritivo`
    - `fix/descricao`
3. Desenvolver seguindo a arquitectura em camadas (Controller → Mapper → Service → Repository → Entity).
4. Testar localmente (executar a aplicação, testar endpoints).
5. Actualizar a documentação em `concept/` se a alteração afectar modelo de dados, API ou arquitectura.
6. Commitar seguindo a convenção (abaixo).
7. Abrir Pull Request (se aplicável) e solicitar revisão.
8. Fazer merge após aprovação.

## 2. Convenção de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

| Tipo | Uso |
|------|-----|
| `feat:` | Nova funcionalidade para o utilizador |
| `fix:` | Correção de bug |
| `docs:` | Alterações na documentação (`concept/`) |
| `refactor:` | Reestruturação sem alterar comportamento |
| `test:` | Adicionar ou corrigir testes |
| `chore:` | Tarefas de manutenção (dependências, configurações) |

**Exemplo:**  
`feat(pagamento): adiciona endpoint de aprovação`

## 3. Antes de cada commit

- [ ] O código compila sem erros.
- [ ] Os testes (se existirem) passam.
- [ ] A documentação foi actualizada se necessário.
- [ ] Não há `System.out.println` ou código comentado.

## 4. Documentação (`concept/`)

- Alterações no modelo de dados → actualizar `mer.md`, `mr.md`, `dicionario-dados.md`.
- Alterações na API → actualizar ficheiros em `05-api/`.
- Alterações na arquitectura ou fluxos → actualizar diagramas em `06-diagramas/`.

## 5. Exceções

- Tarefas muito pequenas (ex: corrigir typo) podem ser commitadas directamente em `main` após testes rápidos.
- Hotfixes podem abreviar o processo, mas devem ser documentados após a correcção.

## 6. Ferramentas recomendadas

- IDE: IntelliJ IDEA ou VS Code com extensões Spring Boot.
- Git: linha de comando ou GUI.
- Testes de API: Postman ou Insomnia (exportar colecção).