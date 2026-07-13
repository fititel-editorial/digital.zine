# Arquitectura em Camadas — v3

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md). Sem alterações estruturais — mantém-se a mesma arquitectura decidida em reunião. Único ajuste: exemplo de campo interno actualizado para a convenção de nomenclatura em português.

O backend adopta uma arquitectura em camadas (*Layered Architecture*). Esta escolha garante separação clara de responsabilidades, facilidade de manutenção e testabilidade. As camadas organizam‑se da seguinte forma:

## 1. Camada de Entidade (*Entity*)

- **Pacote:** `com.itel.fititel.domain.entity`
- **Responsabilidade:** Representar uma tabela do banco de dados. Cada entidade contém apenas atributos, construtores, getters e setters (podemos usar anotações do Lombok como `@Data`). O mapeamento é feito com JPA (`@Entity`, `@Table`, `@Id`, etc.).
- **Regras:** A entidade não contém lógica de negócio nem é exposta directamente ao cliente.

## 2. Camada de Repositório (*Repository*)

- **Pacote:** `com.itel.fititel.domain.repository`
- **Responsabilidade:** Fornecer métodos de acesso a dados – operações CRUD e consultas personalizadas. Utilizamos Spring Data JPA, estendendo `JpaRepository` ou criando interfaces customizadas.
- **Regras:** O repositório interage apenas com entidades. Não conhece DTOs, serviços ou controladores.

## 3. Camada de Serviço (*Service*)

- **Pacote:** `com.itel.fititel.application.service`
- **Responsabilidade:** Implementar a lógica de negócio, as regras de validação, a orquestração de repositórios e a gestão de transacções. Um serviço pode chamar outros serviços.
- **Regras:** Recebe e retorna **entidades** (nunca DTOs). É a única camada anotada com `@Transactional`. Permanece alheia aos controladores.

## 4. Camada de *Mapper* (conversor manual)

- **Pacote:** `com.itel.fititel.api.mapper`
- **Responsabilidade:** Converter entidades em DTOs e vice‑versa. Optámos por **mappers manuais** – cada mapper é uma classe simples com métodos estáticos ou de instância (ex.: `toDto(Entidade entidade)`, `toEntity(DTORequest dto)`).
- **Regras:** O mapper não contém lógica de negócio e só depende das classes que converte (entidades e DTOs). Os mapeamentos são explícitos, fáceis de testar e de seguir.

## 5. Camada de DTO (*Data Transfer Object*)

- **Pacote:** `com.itel.fititel.api.dto`
- **Responsabilidade:** Definir a estrutura dos dados que entram (*request*) e saem (*response*) da API. Os DTOs podem incluir validações (ex.: `@NotNull`, `@Size`, `@Email` do Jakarta Validation).
- **Regras:** Os DTOs não contêm lógica de negócio. São específicos para cada operação ou endpoint, podendo agregar campos de várias entidades.

## 6. Camada de Controlador (*Controller*)

- **Pacote:** `com.itel.fititel.api.controller`
- **Responsabilidade:** Receber requisições HTTP, delegar ao serviço apropriado (através do mapper) e devolver respostas HTTP. O controlador também trata códigos de status, excepções básicas e validação de DTOs com `@Valid`.
- **Regras:** O controlador não contém lógica de negócio nem acede directamente a repositórios. Usa o mapper para a conversão entre DTOs e entidades.

## Fluxo típico de uma requisição

1. O **cliente** envia um JSON; o controlador recebe-o como um DTO de *request* (ex.: `EditionRequestDTO`).
2. O controlador valida o DTO com `@Valid`.
3. O controlador chama o mapper (`EditionMapper.toEntity(request)`) para obter a entidade correspondente (`Edition`).
4. O controlador invoca o serviço (`editionService.create(edition)`).
5. O serviço executa a lógica de negócio e retorna a entidade persistida.
6. O controlador usa novamente o mapper (`EditionMapper.toResponse(savedEdition)`) para construir o DTO de resposta (`EditionResponseDTO`).
7. Por fim, o controlador devolve um `ResponseEntity` com o DTO e o código de status (ex.: `201 Created`).

## Benefícios desta arquitectura

- **Manutenção facilitada** – cada camada evolui isoladamente.
- **Testabilidade** – é possível testar cada camada separadamente, recorrendo a *mocks* para as dependências.
- **Segurança** – a entidade nunca é exposta na API, evitando o vazamento de campos internos (como `palavra_passe_hash` ou `removido_em`).
- **Flexibilidade** – a estrutura dos DTOs pode ser alterada sem impactar o esquema do banco de dados.

## Relação com outros módulos da documentação

Os detalhes sobre autenticação, roles e protecção de endpoints estão no documento de [segurança](./security.md). As justificativas para as escolhas tecnológicas (mapper manual, Spring Data JPA, etc.) encontram‑se nas [decisões técnicas](./technical-decisions.md). E a especificação completa dos endpoints e DTOs está disponível no módulo [API](../05-api/overview.md).

---

*Esta arquitectura será a base para toda a implementação do backend.*