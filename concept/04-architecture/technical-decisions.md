# Decisões Técnicas

Este documento regista as principais escolhas a nível de tecnologias e arquitectura do projecto, bem como a justificação para cada uma.

## 1. Linguagem e versão do Java

**Escolha:** Java 21  
**Justificação:**
- LTS (Long Term Support) com suporte estendido.
- Novas funcionalidades (records, pattern matching, virtual threads) que podem simplificar o código e melhorar a performance.
- Compatibilidade com Spring Boot 4.x.

## 2. Framework principal

**Escolha:** Spring Boot 4.0.3  
**Justificação:**
- Ecossistema maduro para aplicações empresariais.
- Integração nativa com Spring Data JPA, Spring Security, Spring MVC.
- Suporte a Jakarta EE (em vez do antigo javax).
- Facilidade de configuração e rapidez de desenvolvimento.

## 3. Banco de dados

**Escolha:** PostgreSQL  
**Justificação:**
- Banco relacional robusto e open-source.
- Suporte nativo a enumerações (para `genero`, `estado_pagamento`, `role`).
- Bom desempenho para consultas complexas (ex: comentários aninhados, relatórios).
- Compatível com Flyway para migrações.

## 4. Migrações de esquema

**Escolha:** Flyway  
**Justificação:**
- Versionamento do esquema do banco de dados dentro do repositório.
- Executa migrações automaticamente no arranque da aplicação.
- Simples e confiável; evita inconsistências entre ambientes.

## 5. Mapeamento objecto-relacional (ORM)

**Escolha:** Spring Data JPA (Hibernate)  
**Justificação:**
- Produtividade: reduz código repetitivo para CRUD.
- Suporte a auditoria automática (`@CreatedDate`, `@LastModifiedDate`).
- Integração nativa com Spring Boot.

## 6. Mapper entre entidades e DTOs

**Escolha:** Mapper manual (código escrito explicitamente)  
**Justificação:**
- Controle total sobre o que é copiado (evita exposição acidental de campos sensíveis).
- Sem dependência adicional (diferente de MapStruct ou ModelMapper).
- Fácil de testar.
- *Nota:* No futuro, se o projecto crescer, pode ser migrado para MapStruct sem impacto nas demais camadas.

## 7. Gestão de dependências e build

**Escolha:** Maven  
**Justificação:**
- Padrão no ecossistema Spring.
- Gerenciamento declarativo de dependências.
- Integração com plugins (compiler, surefire, spring-boot-maven-plugin).

## 8. Auditoria e Soft Delete

**Escolha:** Campos `createdAt`, `updatedAt`, `deletedAt` em todas as tabelas.  
**Justificação:**
- Rastreabilidade de criação e modificação (obrigatório para conformidade e depuração).
- Soft delete preserva o histórico e evita quebra de integridade referencial.
- Permite recuperação de dados acidentalmente “apagados”.
- Padrão comum em sistemas empresariais.

## 9. Autenticação

**Escolha:** JWT stateless  
**Justificação:**
- Escalável (não requer armazenamento de sessão no servidor).
- Adequado para APIs REST que podem ser consumidas por múltiplos clientes (web, mobile).
- Simples de implementar com Spring Security.

## 10. Arquitectura em camadas

**Escolha:** Controller → Mapper → Service → Repository → Entity  
**Justificação:**
- Implementa fortemente o primeiro princípio da Orientação a Objectos (SOLID), por intermédio da separação clara de responsabilidades.
- Facilita testes unitários e de integração.
- Permite evolução independente das camadas.
- Alinhada com as boas práticas de Clean Architecture (mas sem excesso de abstracções).

## 11. Validação de dados

**Escolha:** Jakarta Bean Validation (`@Valid`, `@NotNull`, etc.) nos DTOs.  
**Justificação:**
- Validação declarativa, reduz código manual nos controladores.
- Mensagens de erro padronizadas.
- Integrada ao Spring MVC.

## 12. Decisões adiadas (para versões futuras)

- **Cache** (Redis) – para melhorar desempenho em revistas mais acedidas.
- **API bancária** (gateway automático) – substituir validação manual de comprovativos.
- **Sessão única** – controlo de múltiplos dispositivos.
- **Modelos 3D** – suporte a conteúdos interactivos nas páginas.

---

*Estas decisões foram tomadas no início do projecto e devem ser revistas periodicamente.*