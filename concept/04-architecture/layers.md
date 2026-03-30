# Arquitectura em Camadas

O backend segue uma arquitectura em camadas (Layered Architecture) para garantir separação de responsabilidades, manutenibilidade e testabilidade. As camadas são organizadas da seguinte forma:



## 1. Camada de Entidade (Entity)

- **Pacote:** `com.itel.fititel.domain.entity`
- **Responsabilidade:** Representar uma tabela do banco de dados. Contém apenas atributos, construtores, getters e setters (ou anotações do Lombok como `@Data`). Mapeada com JPA (`@Entity`, `@Table`, `@Id`, etc.).
- **Regras:** Não contém lógica de negócio. Não é exposta directamente ao cliente.

## 2. Camada de Repositório (Repository)

- **Pacote:** `com.itel.fititel.domain.repository`
- **Responsabilidade:** Fornecer métodos de acesso a dados (CRUD, consultas customizadas). Utiliza Spring Data JPA (`JpaRepository` ou interfaces customizadas).
- **Regras:** Apenas interage com entidades. Não conhece DTOs, serviços ou controladores.

## 3. Camada de Serviço (Service)

- **Pacote:** `com.itel.fititel.application.service`
- **Responsabilidade:** Implementar a lógica de negócio, regras de validação, orquestração de repositórios e transacções. Pode chamar outros serviços.
- **Regras:** Recebe e retorna **entidades** (nunca DTOs). É a única camada que pode ter anotação `@Transactional`. Não conhece os controladores.

## 4. Camada de Mapper (Conversor manual)

- **Pacote:** `com.itel.fititel.api.mapper` 
- **Responsabilidade:** Converter entidades em DTOs e vice‑versa. Como a opção é por **mappers manuais**, cada mapper será uma classe simples com métodos estáticos ou de instância (ex: `toDto(Entidade entidade)`, `toEntity(DTORequest dto)`).
- **Regras:** Não contém lógica de negócio. Não depende de outras camadas excepto das classes que converte (entidades e DTOs). Os mapeamentos devem ser explícitos e fáceis de testar.

## 5. Camada de DTO (Data Transfer Object)

- **Pacote:** `com.itel.fititel.api.dto`
- **Responsabilidade:** Definir a estrutura dos dados que entram (request) e saem (response) da API. Os DTOs podem incluir **validações** (ex: `@NotNull`, `@Size`, `@Email` do Jakarta Validation).
- **Regras:** Não contêm lógica de negócio. São específicos para cada endpoint/operação, podendo agregar campos de várias entidades.

## 6. Camada de Controlador (Controller)

- **Pacote:** `com.itel.fititel.api.controller`
- **Responsabilidade:** Receber requisições HTTP, delegar ao serviço apropriado (via mapper) e retornar respostas HTTP. Gerencia códigos de status, tratamento básico de excepções e validação de DTOs (`@Valid`).
- **Regras:** Não contém lógica de negócio. Não acede directamente a repositórios. Utiliza o mapper para converter entre DTOs e entidades.

## Fluxo típico de uma requisição

1. **Cliente** envia JSON → Controlador recebe como `RevistaRequestDTO`.
2. Controlador valida o DTO com `@Valid`.
3. Controlador chama `RevistaMapper.toEntity(request)` para obter uma entidade `Revista`.
4. Controlador invoca `revistaService.criar(revista)`.
5. Service executa a lógica de negócio e retorna uma entidade `Revista` salva.
6. Controlador chama `RevistaMapper.toResponse(revistaSalva)` para obter `RevistaResponseDTO`.
7. Controlador devolve `ResponseEntity` com o DTO e status `201 Created`.

## Benefícios desta arquitectura

- **Manutenção facilitada:** cada camada pode evoluir isoladamente.
- **Testabilidade:** é possível testar cada camada separadamente (mock das dependências).
- **Segurança:** a entidade nunca é exposta na API, evitando vazamento de campos internos (ex: `palavraPasse`, `deletedAt`).
- **Flexibilidade:** a estrutura dos DTOs pode ser alterada sem impactar o banco de dados.

## Relação com outros módulos da documentação

- [Segurança](./security.md) – autenticação, roles e protecção de endpoints.
- [Decisões Técnicas](./technical-decisions.md) – justificativa para escolhas como mapper manual, Spring Data JPA, etc.
- [API](../05-api/overview.md) – detalhes dos endpoints e DTOs específicos.

---

*Esta arquitectura será a base para toda a implementação do backend.*
