# Fluxo de Trabalho (Workflow)

Este documento sugere um fluxo de trabalho para o desenvolvimento do backend. Não é obrigatório, mas sim uma referência para manter consistência e qualidade.

---

## 1. Ciclo de desenvolvimento

1. Criar uma *issue* para a tarefa ou bug.
2. Criar uma *branch* a partir de `main` (ou `develop`):  
   `feature/nome-descritivo` ou `fix/descricao`.
3. Desenvolver seguindo a [arquitectura em camadas](./04-architecture/layers.md).
4. Testar localmente (executar a aplicação, testar endpoints).
5. Actualizar a documentação em `concept/` se necessário.
6. Commitar seguindo a convenção abaixo.
7. Abrir Pull Request (se aplicável) e solicitar revisão.
8. Fazer merge após aprovação.

---

## 2. Convenção de commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

| Tipo | Uso |
|------|-----|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `docs:` | Documentação (`concept/`) |
| `refactor:` | Reestruturação sem alterar comportamento |
| `test:` | Testes |
| `chore:` | Manutenção (dependências, configurações) |

Exemplo: `feat(pagamento): adiciona endpoint de aprovação`

---

## 3. Antes de cada commit

- [ ] O código compila sem erros.
- [ ] Os testes (se existirem) passam.
- [ ] A documentação foi actualizada se necessário.
- [ ] Não há `System.out.println` ou código comentado.

---

## 4. Documentação (`concept/`)

Lembre-se de actualizar os ficheiros conforme a alteração:

- Modelo de dados → `mer.md`, `mr.md`, `dicionario-dados.md`
- API → ficheiros em `05-api/`
- Fluxos ou arquitectura → diagramas em `06-diagramas/`

---

## 5. Exceções

- Tarefas muito pequenas (ex: corrigir typo) podem ser commitadas directamente em `main` após testes rápidos.
- *Hotfixes* urgentes podem abreviar o processo, mas devem ser documentados posteriormente.

---

## 6. Ferramentas recomendadas

- IDE: IntelliJ IDEA ou VS Code com extensões Spring Boot.
- Git: linha de comando ou GUI.
- Testes de API: Postman ou Insomnia (exportar colecção para o repositório).

---

*Este guia pode ser ajustado conforme a necessidade do projecto.*