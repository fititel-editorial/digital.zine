# Decisões Técnicas

Este documento regista as principais escolhas tecnológicas e arquitectónicas do projecto, com a respectiva justificação.

## 1. Linguagem e versão do Java

**Escolha:** Java 21  
**Justificação:**
- É uma versão LTS (Long Term Support), com suporte prolongado.
- Oferece funcionalidades modernas (records, pattern matching, virtual threads) que podem simplificar o código e melhorar a performance.
- Totalmente compatível com Spring Boot 4.x.

## 2. Framework principal

**Escolha:** Spring Boot 4.0.3  
**Justificação:**
- Ecossistema maduro e amplamente utilizado para aplicações empresariais.
- Integração nativa com Spring Data JPA, Spring Security e Spring MVC.
- Suporte a Jakarta EE (em vez do antigo javax).
- Configuração rápida e desenvolvimento ágil.

## 3. Banco de dados

**Escolha:** PostgreSQL  
**Justificação:**
- Banco relacional robusto e open‑source.
- Suporte nativo a enumerações (útil para `genero`, `estado_pagamento`, `role`).
- Bom desempenho em consultas complexas (comentários aninhados, relatórios).
- Compatível com Flyway para migrações.

## 4. Migrações de esquema

**Escolha:** Flyway  
**Justificação:**
- Versionamento do esquema do banco de dados dentro do repositório.
- Executa migrações automaticamente no arranque da aplicação.
- Simples e confiável; evita inconsistências entre ambientes.

## 5. Mapeamento objecto‑relacional (ORM)

**Escolha:** Spring Data JPA (Hibernate)  
**Justificação:**
- Produtividade: reduz o código repetitivo para operações CRUD.
- Suporte a auditoria automática (`@CreatedDate`, `@LastModifiedDate`).
- Integração nativa com Spring Boot.

## 6. Mapper entre entidades e DTOs

**Escolha:** Mapper manual (código escrito explicitamente)  
**Justificação:**
- Controlo total sobre o que é copiado – evita exposição acidental de campos sensíveis (como `palavraPasse`).
- Sem dependências adicionais (diferente de MapStruct ou ModelMapper).
- Fácil de testar e depurar.
- *Nota:* Se o projecto crescer, pode ser migrado para MapStruct sem impacto nas restantes camadas.

## 7. Gestão de dependências e build

**Escolha:** Maven  
**Justificação:**
- Padrão no ecossistema Spring.
- Gestão declarativa de dependências.
- Integração com plugins (compiler, surefire, spring‑boot‑maven‑plugin).

## 8. Auditoria e Soft Delete

**Escolha:** Campos `createdAt`, `updatedAt`, `deletedAt` em todas as tabelas.  
**Justificação:**
- Rastreabilidade de criação e modificação (necessário para conformidade e depuração).
- Soft delete preserva o histórico e evita quebra de integridade referencial.
- Permite recuperação de dados apagados acidentalmente.
- É um padrão comum em sistemas empresariais.

## 9. Autenticação

**Escolha:** JWT stateless  
**Justificação:**
- Escalável – não requer armazenamento de sessão no servidor.
- Adequado para APIs REST consumidas por múltiplos clientes (web, mobile).
- Implementação simples com Spring Security.

## 10. Arquitectura em camadas

**Escolha:** Controller → Mapper → Service → Repository → Entity  
**Justificação:**
- Segue o princípio da separação de responsabilidades (SOLID).
- Facilita testes unitários e de integração.
- Permite evolução independente de cada camada.
- Alinhada com as boas práticas de *Clean Architecture* (sem excesso de abstracções).

## 11. Validação de dados

**Escolha:** Jakarta Bean Validation (`@Valid`, `@NotNull`, etc.) nos DTOs.  
**Justificação:**
- Validação declarativa, reduz código manual nos controladores.
- Mensagens de erro padronizadas.
- Integração nativa com Spring MVC.

## 12. Decisões adiadas (versões futuras)

- **Cache (Redis):** para melhorar o desempenho em revistas muito acedidas.
- **Gateway de pagamento automático:** substituir a validação manual de comprovativos por uma API bancária.
- **Sessão única:** controlo de múltiplos dispositivos simultâneos.
- **Modelos 3D:** suporte a conteúdos interactivos nas páginas.

---

*Estas decisões foram tomadas no início do projecto e devem ser revistas periodicamente.*