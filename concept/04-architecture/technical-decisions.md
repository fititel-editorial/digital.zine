# Decisões Técnicas — v3

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md). Documento fundido: decisões originais (1–11) mantidas na íntegra, decisões adiadas actualizadas, e decisões novas da reunião de arquitectura final (12–19) acrescentadas ao fim.

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
- Banco relacional robusto e open-source.
- Suporte nativo a enumerações (útil para `genero`, `status`, `role`).
- Bom desempenho em consultas complexas.
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
- Produtividade: reduz o código repetitivo para operações CRUD.
- Suporte a auditoria automática.
- Integração nativa com Spring Boot.

## 6. Mapper entre entidades e DTOs

**Escolha:** Mapper manual (código escrito explicitamente)
**Justificação:**
- Controlo total sobre o que é copiado — evita exposição acidental de campos sensíveis (como a palavra-passe).
- Sem dependências adicionais (diferente de MapStruct ou ModelMapper).
- Fácil de testar e depurar.
- *Nota:* Se o projecto crescer, pode ser migrado para MapStruct sem impacto nas restantes camadas.

## 7. Gestão de dependências e build

**Escolha:** Maven
**Justificação:**
- Padrão no ecossistema Spring.
- Gestão declarativa de dependências.
- Integração com plugins (compiler, surefire, spring-boot-maven-plugin).

## 8. Auditoria e Soft Delete

**Escolha:** Campos de auditoria em todas as tabelas que fizerem sentido (ver excepções em [`03-data-model/softdelete-audit.md`](../03-data-model/softdelete-audit.md)).
**Justificação:**
- Rastreabilidade de criação e modificação (necessário para conformidade e depuração).
- Soft delete preserva o histórico e evita quebra de integridade referencial.
- Permite recuperação de dados apagados acidentalmente.
- É um padrão comum em sistemas empresariais.
**Nomenclatura (actualizada pela decisão 17):** as colunas na base de dados usam português (`criado_em`, `atualizado_em`, `removido_em`), por decisão da reunião; os campos correspondentes na entidade Java usam inglês (`createdAt`, `updatedAt`, `deletedAt`), mapeados via `@Column(name = "criado_em")` etc.

## 9. Autenticação

**Escolha:** JWT stateless
**Justificação:**
- Escalável — não requer armazenamento de sessão no servidor.
- Adequado para APIs REST consumidas por múltiplos clientes (web, mobile).
- Implementação simples com Spring Security.

## 10. Arquitectura em camadas

**Escolha:** Controller → Mapper → Service → Repository → Entity
**Justificação:**
- Segue o princípio da separação de responsabilidades (SOLID).
- Facilita testes unitários e de integração.
- Permite evolução independente de cada camada.
- Alinhada com as boas práticas de *Clean Architecture* (sem excesso de abstracções).
**Confirmado na reunião de arquitectura final:** mantém-se sem alterações. Ver [`08-implementation-guides/crud-implementation-guide.md`](../08-implementation-guides/crud-implementation-guide.md) para o padrão passo a passo.

## 11. Validação de dados

**Escolha:** Jakarta Bean Validation (`@Valid`, `@NotNull`, etc.) nos DTOs.
**Justificação:**
- Validação declarativa, reduz código manual nos controladores.
- Mensagens de erro padronizadas.
- Integração nativa com Spring MVC.

---

## 12. Entrega de conteúdo: páginas-imagem, não PDF

**Escolha:** Cada página é processada (split + conversão para imagem) de forma assíncrona no upload, e servida individualmente. O PDF completo nunca é exposto por nenhum endpoint da API pública.
**Justificação:** elimina o download trivial do artigo completo e permite controlo de acesso granular por página.

## 13. Processamento assíncrono do upload

**Escolha:** `@Async` (ou fila, se o volume justificar) para o split/conversão de PDF, com o estado de processamento a reflectir o progresso.
**Justificação:** split + conversão de um PDF com dezenas de páginas não deve bloquear o request HTTP de upload.

## 14. Preço em cêntimos, não `DECIMAL`

**Escolha:** `edicao.preco` (`BIGINT`, cêntimos), sem campo de moeda separado (kwanza assumido).
**Justificação:** evita erros de arredondamento em agregações de receita.

## 15. Log de auditoria administrativa como entidade própria

**Escolha:** Tabela `log`, distinta dos campos de auditoria por registo.
**Justificação:** os campos de auditoria por tabela respondem a "quando foi alterado este registo", não a "que acções administrativas aconteceram, por quem" — que é o que o painel de logs do frontend espera consumir.

## 16. `Editor_Edicao` como associação, não como novo `role`

**Escolha:** Tabela de associação `editor_edicao` entre utilizador e edição, em vez de um terceiro valor de `role`.
**Justificação:** decisão explícita da reunião — mantém o modelo de permissões simples (2 roles), enquanto permite rastrear responsabilidade editorial por edição.

## 17. Idioma: documentação em português, código em inglês (corrigido)

**Escolha:** A documentação (este repositório de `concept/`, incluindo nomes de tabelas e colunas na base de dados, como decidido na reunião) é escrita em português. **O código-fonte Java — nomes de classes, campos, variáveis e métodos — é escrito em inglês.** O mapeamento entre os dois é feito nas anotações JPA (`@Table(name = "...")`, `@Column(name = "...")`).
**Justificação:** decisão explícita da equipa, corrigindo um registo anterior desta documentação que indicava, por engano, que o código também seria em português.
**Exemplo:** a tabela `edicao` (coluna `id_revista`, `preco`, `e_gratis`) mapeia para a classe Java `Edition` (campos `magazineId`, `price`, `free`).

## 18. Formato de imagem do flipbook: WebP

**Escolha:** As imagens de página do flipbook são geradas em formato WebP.
**Justificação:** decisão explícita da reunião — melhor compressão do que JPG para qualidade equivalente.

## 19. Armazenamento de objectos e hospedagem

**Escolha:** Supabase Storage em desenvolvimento, Cloudflare R2 em produção, ambos atrás da mesma interface de storage. Frontend na Vercel; backend em contentor Docker no Render.
**Justificação:** decisões explícitas da reunião — ver [`04-architecture/deployment.md`](./deployment.md).

---

## Decisões adiadas (versões futuras)

- **Cache (Redis)** — para melhorar o desempenho em edições muito acedidas.
- **Sessão única** — controlo de múltiplos dispositivos simultâneos.
- **Modelos 3D** — suporte a conteúdos interactivos nas páginas.
- **URLs de imagem com expiração + rate limiting anti-scraping** — reforço de segurança recomendado, não bloqueante.
- **Integração real com a EMIS/GPO** — depende de contacto e certificação junto da EMIS/banco de apoio; a implementação simulada (decisão 21 do fluxo de pagamento, ver [`04-architecture/security.md`](./security.md)) é o que existe até lá.
- ~~**Gateway de pagamento automático**~~ — decidido e desenhado nesta reunião (ver `04-architecture/security.md`); implementação real ainda pendente de acesso à EMIS.

## Pontos ainda em aberto (não são decisões técnicas fechadas)

- Autoria de artigos (`edicao_artigo` não tem campo de autor).
- Se `editor_edicao` é mesmo restrito a `ADMIN`.
- Campos exactos de `flipbook_edicao` (`estado_processamento`, `gerado_em` são propostos, não confirmados).
- Retenção do PDF original após processamento.

---

*As decisões 1–11 foram tomadas no início do projecto; as decisões 12–19 resultam da reunião de arquitectura final e devem ser revistas periodicamente, como as restantes.*
