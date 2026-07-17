# Guia de Implementação — Microsserviço de Upload e Conversão do Flipbook — v3

> Ver [`00-changelog-v3.md`](../00-changelog-v3.md). Actualiza a proposta original discutida antes da reunião: formato de imagem passa de JPG/PNG para **WebP**, e o armazenamento é Supabase Storage (dev) / Cloudflare R2 (prod), ambos acedidos pela mesma interface `StorageService`.
>
> **Correcção de nomenclatura:** os nomes de classe abaixo (`PdfToImageConverterService`, `StorageService`, `FlipbookProcessingService`) já estão em inglês e mantêm-se. Os métodos `guardar`/`ler` da `StorageService` devem ser lidos como `save`/`read`; `FlipbookEdicaoRepository`/`FlipbookPaginaRepository`/`EdicaoRepository` como `EditionFlipbookRepository`/`FlipbookPageRepository`/`EditionRepository`; e os campos `edicaoId`, `estadoProcessamento`, `geradoEm`, `paginas` como `editionId`, `processingState`, `generatedAt`, `pageNumber` (ver [`06-diagrams/dc-classes.md`](../06-diagrams/dc-classes.md)).

> **Pacotes:** `PdfToImageConverterService`, `StorageService` (+ implementações) e `FlipbookProcessingService` ficam em `com.itel.fititel.application.service`, junto dos restantes serviços — ver estrutura em [`08-implementation-guides/crud-implementation-guide.md`](./crud-implementation-guide.md).

## Objectivo

A partir de um PDF enviado pelo admin, gerar uma imagem WebP por página, guardá-las no object storage, e criar os registos `FlipbookEdicao` + `FlipbookPagina` correspondentes — de forma assíncrona, sem bloquear o pedido de upload.

## Dependência: Apache PDFBox

```xml
<dependency>
    <groupId>org.apache.pdfbox</groupId>
    <artifactId>pdfbox</artifactId>
    <version>3.0.3</version>
</dependency>
```

## Desenho geral

```
EdicaoController
      │  POST /editions/{id}/flipbook (multipart: pdf)
      ▼
FlipbookProcessingService (@Async)
      │
      ├─► PdfToImageConverterService  (PDFBox: PDFRenderer → BufferedImage → WebP)
      ├─► StorageService              (Supabase em dev / Cloudflare R2 em prod)
      └─► FlipbookEdicaoRepository / FlipbookPaginaRepository
```

## Conversão para WebP

A JDK não tem um `ImageWriter` nativo para WebP. Duas opções viáveis:

1. **`webp-imageio`** (biblioteca Java que regista um `ImageWriter` de WebP no `ImageIO`, permitindo `ImageIO.write(image, "webp", output)` directamente — mais simples de integrar no código já pensado para JPG).
2. **Chamar o binário `cwebp`** (da biblioteca `libwebp` do Google) como processo externo — mais controlo sobre qualidade/compressão, mas acopla o deployment à presença do binário no contentor Docker.

Para a v3, recomenda-se a opção 1 (`webp-imageio`), por manter tudo dentro da JVM e simplificar o `Dockerfile`. Se, mais tarde, a qualidade/tamanho gerado não for satisfatório, vale reavaliar `cwebp`.

```xml
<dependency>
    <groupId>org.sejda.imageio</groupId>
    <artifactId>webp-imageio</artifactId>
    <version>0.1.6</version>
</dependency>
```

```java
@Service
public class PdfToImageConverterService {

    private static final float DPI = 150f;

    public BufferedImage renderizarPagina(PDDocument documento, int indicePagina) throws IOException {
        PDFRenderer renderer = new PDFRenderer(documento);
        return renderer.renderImageWithDPI(indicePagina, DPI, ImageType.RGB);
    }

    public byte[] paraWebp(BufferedImage imagem, float qualidade) throws IOException {
        ByteArrayOutputStream saida = new ByteArrayOutputStream();
        ImageWriter writer = ImageIO.getImageWritersByFormatName("webp").next();
        ImageWriteParam parametros = writer.getDefaultWriteParam();
        parametros.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
        parametros.setCompressionQuality(qualidade); // ex.: 0.8f

        try (ImageOutputStream ios = ImageIO.createImageOutputStream(saida)) {
            writer.setOutput(ios);
            writer.write(null, new IIOImage(imagem, null, null), parametros);
        }
        writer.dispose();
        return saida.toByteArray();
    }
}
```

## StorageService — interface e implementações por ambiente

```java
public interface StorageService {
    String guardar(String chaveObjecto, byte[] conteudo) throws IOException;
    byte[] ler(String chaveObjecto) throws IOException;
}
```

```java
@Service
@Profile("dev")
@RequiredArgsConstructor
public class SupabaseStorageService implements StorageService {

    @Value("${supabase.storage.url}")
    private String supabaseUrl;
    @Value("${supabase.storage.bucket}")
    private String bucket;
    @Value("${supabase.storage.service-key}")
    private String serviceKey;

    private final RestClient restClient = RestClient.create();

    @Override
    public String guardar(String chaveObjecto, byte[] conteudo) {
        restClient.post()
                .uri("{url}/storage/v1/object/{bucket}/{chave}", supabaseUrl, bucket, chaveObjecto)
                .header("Authorization", "Bearer " + serviceKey)
                .header("Content-Type", "image/webp")
                .body(conteudo)
                .retrieve()
                .toBodilessEntity();
        return "%s/storage/v1/object/public/%s/%s".formatted(supabaseUrl, bucket, chaveObjecto);
    }

    @Override
    public byte[] ler(String chaveObjecto) {
        return restClient.get()
                .uri("{url}/storage/v1/object/{bucket}/{chave}", supabaseUrl, bucket, chaveObjecto)
                .header("Authorization", "Bearer " + serviceKey)
                .retrieve()
                .body(byte[].class);
    }
}
```

```java
@Service
@Profile("prod")
@RequiredArgsConstructor
public class CloudflareR2StorageService implements StorageService {

    // R2 é compatível com a API do S3 — usa-se o AWS SDK for Java v2 (S3Client),
    // apontado para o endpoint do R2 em vez do endpoint da AWS.

    private final S3Client s3Client;

    @Value("${r2.bucket}")
    private String bucket;
    @Value("${r2.public-base-url}")
    private String publicBaseUrl;

    @Override
    public String guardar(String chaveObjecto, byte[] conteudo) {
        s3Client.putObject(
                PutObjectRequest.builder().bucket(bucket).key(chaveObjecto).contentType("image/webp").build(),
                RequestBody.fromBytes(conteudo)
        );
        return "%s/%s".formatted(publicBaseUrl, chaveObjecto);
    }

    @Override
    public byte[] ler(String chaveObjecto) {
        return s3Client.getObject(GetObjectRequest.builder().bucket(bucket).key(chaveObjecto).build())
                .readAllBytes();
    }
}
```

## Orquestração assíncrona

```java
@Service
@RequiredArgsConstructor
public class FlipbookProcessingService {

    private final PdfToImageConverterService converter;
    private final StorageService storageService;
    private final FlipbookEdicaoRepository flipbookEdicaoRepository;
    private final FlipbookPaginaRepository flipbookPaginaRepository;
    private final EdicaoRepository edicaoRepository;

    @Async
    @Transactional
    public void processar(Long idEdicao, File pdf) {
        FlipbookEdicao flipbook = flipbookEdicaoRepository.findByEdicaoId(idEdicao)
                .orElseGet(() -> flipbookEdicaoRepository.save(
                        FlipbookEdicao.builder().edicaoId(idEdicao).estadoProcessamento("PROCESSANDO").build()));

        try (PDDocument documento = Loader.loadPDF(pdf)) {
            int totalPaginas = documento.getNumberOfPages();

            for (int i = 0; i < totalPaginas; i++) {
                BufferedImage imagem = converter.renderizarPagina(documento, i);
                byte[] webp = converter.paraWebp(imagem, 0.8f);

                String chave = "edicoes/%d/pagina-%03d.webp".formatted(idEdicao, i + 1);
                String url = storageService.guardar(chave, webp);

                FlipbookPagina pagina = FlipbookPagina.builder()
                        .flipbook(flipbook)
                        .paginas(i + 1)
                        .tipo(i == 0 ? "CAPA" : "CONTEUDO")
                        .urlImagem(url)
                        .ordem(i + 1)
                        .build();
                flipbookPaginaRepository.save(pagina);
            }

            Edicao edicao = edicaoRepository.findById(idEdicao).orElseThrow();
            edicao.setPaginas(totalPaginas);
            edicaoRepository.save(edicao);

            flipbook.setEstadoProcessamento("PRONTO");
            flipbook.setGeradoEm(LocalDateTime.now());

        } catch (IOException e) {
            flipbook.setEstadoProcessamento("FALHOU");
            throw new FlipbookProcessingException(idEdicao, e);
        } finally {
            flipbookEdicaoRepository.save(flipbook);
        }
    }
}
```

## Configuração por ambiente (`application.properties` / variáveis do Render)

```properties
# dev (Supabase)
supabase.storage.url=${SUPABASE_URL}
supabase.storage.bucket=flipbook-fititel
supabase.storage.service-key=${SUPABASE_SERVICE_KEY}

# prod (Cloudflare R2)
r2.bucket=flipbook-fititel
r2.public-base-url=${R2_PUBLIC_BASE_URL}
r2.endpoint=${R2_ENDPOINT}
r2.access-key=${R2_ACCESS_KEY}
r2.secret-key=${R2_SECRET_KEY}
```

## Pontos a decidir/confirmar (ver changelog)

- Se o PDF original fica guardado (para reprocessamento) ou é descartado após a conversão.
- Se `FlipbookEdicao.estadoProcessamento`/`geradoEm` são mesmo os campos certos — propostos por mim, não confirmados em reunião.
- Se o frontend consome as imagens sempre via backend, ou directamente do Supabase/R2 com URLs assinadas (ver [`06-diagrams/ds-navigation.md`](../06-diagrams/ds-navigation.md)).
