# Guia de Implementação de CRUDs — v3 (corrigido)

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md) e [`04-architecture/layers.md`](../04-architecture/layers.md) — este guia segue exactamente os pacotes ali definidos. **Correcção:** os pacotes organizam-se **por camada** (todas as entidades em `domain.entity`, todos os DTOs em `api.dto`, etc.) — não um pacote por entidade. Identificadores de código em inglês; colunas da base de dados em português, mapeadas via `@Column`.

## Estrutura de pacotes (igual para todas as entidades)

```
com.itel.fititel/
├── domain/
│   ├── entity/          (Edition.java, User.java, Payment.java, ...)
│   └── repository/      (EditionRepository.java, UserRepository.java, ...)
├── application/
│   └── service/         (EditionService.java, EditionServiceImpl.java, ...)
└── api/
    ├── dto/              (CreateEditionRequest.java, EditionResponse.java, ...)
    ├── mapper/           (EditionMapper.java, ...)
    └── controller/       (EditionController.java, ...)
```

Cada entidade nova acrescenta **um ficheiro a cada pacote existente** — nunca cria um pacote próprio.

## Passo a passo, usando `Edition` como exemplo

### 1. Entidade — `domain/entity/Edition.java`

```java
package com.itel.fititel.domain.entity;

@Entity
@Table(name = "edicao")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Edition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_revista", nullable = false)
    private Magazine magazine;

    @Column(name = "tema", nullable = false, length = 150)
    private String theme;

    @Column(name = "lema")
    private String tagline;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String description;

    @Column(name = "preco", nullable = false)
    private Long price;

    @Column(name = "paginas", nullable = false)
    private Integer pageCount = 0;

    @Column(name = "numero", nullable = false)
    private Integer number;

    @Column(name = "data_lancamento", nullable = false)
    private LocalDate releaseDate;

    @Column(name = "e_gratis", nullable = false)
    private Boolean free = false;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "atualizado_em")
    private LocalDateTime updatedAt;

    @Column(name = "removido_em")
    private LocalDateTime deletedAt;

    @PrePersist
    void onCreate() { this.createdAt = LocalDateTime.now(); }

    @PreUpdate
    void onUpdate() { this.updatedAt = LocalDateTime.now(); }
}
```

### 2. Repositório — `domain/repository/EditionRepository.java`

```java
package com.itel.fititel.domain.repository;

public interface EditionRepository extends JpaRepository<Edition, Long> {
    Optional<Edition> findByIdAndDeletedAtIsNull(Long id);
    Page<Edition> findAllByDeletedAtIsNull(Pageable pageable);
    Page<Edition> findAllByMagazineIdAndDeletedAtIsNull(Long magazineId, Pageable pageable);
}
```

### 3. DTOs — `api/dto/CreateEditionRequest.java`, `api/dto/EditionResponse.java`

```java
package com.itel.fititel.api.dto;

public record CreateEditionRequest(
        @NotNull Long magazineId,
        @NotBlank @Size(max = 150) String theme,
        String tagline,
        String description,
        @NotNull @PositiveOrZero Long price,
        @NotNull Integer number,
        @NotNull LocalDate releaseDate,
        boolean free
) {}

public record EditionResponse(
        Long id, String theme, String tagline, Long price, Integer pageCount,
        Integer number, LocalDate releaseDate, boolean free, String processingState
) {}
```

### 4. Mapper — `api/mapper/EditionMapper.java`

```java
package com.itel.fititel.api.mapper;

public class EditionMapper {

    public static Edition toEntity(CreateEditionRequest request, Magazine magazine) {
        return Edition.builder()
                .magazine(magazine).theme(request.theme()).tagline(request.tagline())
                .description(request.description()).price(request.price())
                .number(request.number()).releaseDate(request.releaseDate())
                .free(request.free()).build();
    }

    public static EditionResponse toResponse(Edition edition, String processingState) {
        return new EditionResponse(
                edition.getId(), edition.getTheme(), edition.getTagline(), edition.getPrice(),
                edition.getPageCount(), edition.getNumber(), edition.getReleaseDate(),
                edition.getFree(), processingState
        );
    }
}
```

### 5. Serviço — `application/service/EditionService.java` + `EditionServiceImpl.java`

```java
package com.itel.fititel.application.service;

public interface EditionService {
    Edition create(Edition edition);
    Edition findById(Long id);
    Page<Edition> list(Long magazineId, Pageable pageable);
    Edition update(Long id, Edition updatedData);
    void remove(Long id);
}

@Service
@RequiredArgsConstructor
public class EditionServiceImpl implements EditionService {

    private final EditionRepository repository;
    private final ActivityLogService activityLogService;

    @Override
    @Transactional
    public Edition create(Edition edition) {
        Edition saved = repository.save(edition);
        activityLogService.record("criou", "edicao", saved.getId(), saved.getTheme());
        return saved;
    }

    @Override
    public Edition findById(Long id) {
        return repository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Edition", id));
    }

    @Override
    public Page<Edition> list(Long magazineId, Pageable pageable) {
        return magazineId != null
                ? repository.findAllByMagazineIdAndDeletedAtIsNull(magazineId, pageable)
                : repository.findAllByDeletedAtIsNull(pageable);
    }

    @Override
    @Transactional
    public Edition update(Long id, Edition updatedData) {
        Edition existing = findById(id);
        existing.setTheme(updatedData.getTheme());
        existing.setTagline(updatedData.getTagline());
        existing.setPrice(updatedData.getPrice());
        Edition saved = repository.save(existing);
        activityLogService.record("editou", "edicao", saved.getId(), saved.getTheme());
        return saved;
    }

    @Override
    @Transactional
    public void remove(Long id) {
        Edition existing = findById(id);
        existing.setDeletedAt(LocalDateTime.now());
        repository.save(existing);
        activityLogService.record("removeu", "edicao", existing.getId(), existing.getTheme());
    }
}
```

### 6. Controlador — `api/controller/EditionController.java`

```java
package com.itel.fititel.api.controller;

@RestController
@RequestMapping("/api/v1/editions")
@RequiredArgsConstructor
public class EditionController {

    private final EditionService service;
    private final MagazineService magazineService;
    private final EditionFlipbookService flipbookService;

    @GetMapping
    public ResponseEntity<Page<EditionResponse>> list(
            @RequestParam(required = false) Long magazineId, Pageable pageable) {
        return ResponseEntity.ok(service.list(magazineId, pageable).map(this::toResponseWithState));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EditionResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(toResponseWithState(service.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EditionResponse> create(@Valid @RequestBody CreateEditionRequest request) {
        Magazine magazine = magazineService.findById(request.magazineId());
        Edition created = service.create(EditionMapper.toEntity(request, magazine));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseWithState(created));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        service.remove(id);
        return ResponseEntity.noContent().build();
    }

    private EditionResponse toResponseWithState(Edition edition) {
        return EditionMapper.toResponse(edition, flipbookService.findProcessingState(edition.getId()));
    }
}
```

## Replicando o padrão para outras entidades

| Entidade (BD) | Classe (código) | Ficheiros a acrescentar (um em cada pacote já existente) |
|---|---|---|
| `edicao_tag` | `EditionTag` | `domain/entity`, `domain/repository`, `api/dto`, `api/mapper`, `api/controller` |
| `edicao_artigo` | `EditionArticle` | idem |
| `favorito` | `Favorite` | idem |
| `editor_edicao` | `EditionEditor` | idem |
| `flipbook_comentario` | `FlipbookComment` | idem |
| `log` | `ActivityLog` | só `domain/entity`, `domain/repository`, `application/service` — sem DTO/controller próprio (é escrito internamente por outros serviços) |

Notas:

- **Entidades de associação simples** (`Favorite`, `EditionEditor`, `EditionTag`) não precisam de `update` no `Service` — normalmente só `create`/`remove`/`list`.
- **Entidades sem soft delete** (`Payment`, `ActivityLog`, `Favorite`, `EditionEditor`, `EditionTag`) não têm `deletedAt` — usa `deleteById` directamente.
- Todo endpoint de escrita relevante chama `ActivityLogService.record(...)`.

## Checklist antes de dar um CRUD como terminado

- [ ] Entidade em `domain/entity`, com `createdAt`/`updatedAt`/`deletedAt` correctos, mapeados para as colunas em português
- [ ] Repositório em `domain/repository`, respeitando `deletedAt IS NULL` onde aplicável
- [ ] DTOs em `api/dto`, com validação Jakarta
- [ ] Mapper em `api/mapper`, sem lógica de negócio
- [ ] Serviço em `application/service`, `@Transactional` nas operações de escrita
- [ ] Controller em `api/controller`, com `@PreAuthorize` correcto
- [ ] Chamada a `ActivityLogService` nas operações de escrita relevantes
