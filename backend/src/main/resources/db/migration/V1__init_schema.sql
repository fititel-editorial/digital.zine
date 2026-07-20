-- =============================================================================
-- V1 - Schema inicial da Revista Digital FITITEL
-- Fonte de verdade: concept/03-data-model/data-ditionary.md (v3)
-- Convencoes: colunas em portugues; auditoria criado_em / atualizado_em /
-- removido_em (ver concept/03-data-model/softdelete-audit.md).
-- A tabela flipbook_comentario_like entra na V2 (issue #21).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- utilizador
-- ---------------------------------------------------------------------------
CREATE TABLE utilizador (
    id                  BIGSERIAL PRIMARY KEY,
    p_nome              VARCHAR(50)  NOT NULL,
    sb_nome             VARCHAR(100) NOT NULL,
    data_nascimento     DATE         NOT NULL,
    email               VARCHAR(150) NOT NULL UNIQUE,
    palavra_passe_hash  VARCHAR(255) NOT NULL,
    role                VARCHAR(20)  NOT NULL DEFAULT 'LEITOR'
                        CHECK (role IN ('LEITOR', 'ADMIN')),
    criado_em           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em       TIMESTAMP,
    removido_em         TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- revista (titulo/marca, ex.: "FITITEL")
-- ---------------------------------------------------------------------------
CREATE TABLE revista (
    id            BIGSERIAL PRIMARY KEY,
    nome          VARCHAR(100) NOT NULL,
    criado_em     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP,
    removido_em   TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- edicao (unidade vendavel)
-- ---------------------------------------------------------------------------
CREATE TABLE edicao (
    id              BIGSERIAL PRIMARY KEY,
    id_revista      BIGINT       NOT NULL REFERENCES revista (id) ON DELETE RESTRICT,
    tema            VARCHAR(150) NOT NULL,
    lema            VARCHAR(200),
    descricao       TEXT,
    preco           BIGINT       NOT NULL DEFAULT 0 CHECK (preco >= 0),
    paginas         INT          NOT NULL DEFAULT 0,
    numero          INT          NOT NULL,
    data_lancamento DATE         NOT NULL,
    e_gratis        BOOLEAN      NOT NULL DEFAULT FALSE,
    criado_em       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   TIMESTAMP,
    removido_em     TIMESTAMP
);

CREATE INDEX idx_edicao_revista ON edicao (id_revista);

-- ---------------------------------------------------------------------------
-- pagamento (registo financeiro - sem soft delete)
-- ---------------------------------------------------------------------------
CREATE TABLE pagamento (
    id                  BIGSERIAL PRIMARY KEY,
    id_utilizador       BIGINT      NOT NULL REFERENCES utilizador (id) ON DELETE RESTRICT,
    id_edicao           BIGINT      NOT NULL REFERENCES edicao (id) ON DELETE RESTRICT,
    valor               BIGINT      NOT NULL,
    status              VARCHAR(20) NOT NULL
                        CHECK (status IN ('PENDENTE', 'PROCESSANDO', 'PAGO', 'REJEITADO', 'EXPIRADO')),
    metodo_pagamento    VARCHAR(20) NOT NULL
                        CHECK (metodo_pagamento IN ('MCX_EXPRESS', 'REFERENCIA')),
    referencia_externa  VARCHAR(100) UNIQUE,
    data_pagamento      TIMESTAMP,
    criado_em           TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em       TIMESTAMP
);

CREATE INDEX idx_pagamento_utilizador ON pagamento (id_utilizador);
CREATE INDEX idx_pagamento_edicao ON pagamento (id_edicao);
CREATE INDEX idx_pagamento_status ON pagamento (status);

-- ---------------------------------------------------------------------------
-- editor_edicao (associacao utilizador ADMIN <-> edicao)
-- ---------------------------------------------------------------------------
CREATE TABLE editor_edicao (
    id            BIGSERIAL PRIMARY KEY,
    id_edicao     BIGINT    NOT NULL REFERENCES edicao (id) ON DELETE RESTRICT,
    id_utilizador BIGINT    NOT NULL REFERENCES utilizador (id) ON DELETE RESTRICT,
    criado_em     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_edicao, id_utilizador)
);

-- ---------------------------------------------------------------------------
-- edicao_tag
-- ---------------------------------------------------------------------------
CREATE TABLE edicao_tag (
    id        BIGSERIAL PRIMARY KEY,
    id_edicao BIGINT      NOT NULL REFERENCES edicao (id) ON DELETE RESTRICT,
    tag       VARCHAR(50) NOT NULL,
    criado_em TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_edicao, tag)
);

-- ---------------------------------------------------------------------------
-- edicao_artigo
-- ---------------------------------------------------------------------------
CREATE TABLE edicao_artigo (
    id            BIGSERIAL PRIMARY KEY,
    id_edicao     BIGINT       NOT NULL REFERENCES edicao (id) ON DELETE RESTRICT,
    titulo        VARCHAR(200) NOT NULL,
    descricao     TEXT,
    page          INT          NOT NULL,
    ordem         INT          NOT NULL DEFAULT 0,
    criado_em     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP,
    removido_em   TIMESTAMP
);

CREATE INDEX idx_edicao_artigo_edicao ON edicao_artigo (id_edicao);

-- ---------------------------------------------------------------------------
-- favorito
-- ---------------------------------------------------------------------------
CREATE TABLE favorito (
    id            BIGSERIAL PRIMARY KEY,
    id_utilizador BIGINT    NOT NULL REFERENCES utilizador (id) ON DELETE RESTRICT,
    id_edicao     BIGINT    NOT NULL REFERENCES edicao (id) ON DELETE RESTRICT,
    criado_em     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_utilizador, id_edicao)
);

-- ---------------------------------------------------------------------------
-- log (auditoria administrativa - imutavel, sem FK formal para o alvo)
-- ---------------------------------------------------------------------------
CREATE TABLE log (
    id               BIGSERIAL PRIMARY KEY,
    nome_utilizador  VARCHAR(150) NOT NULL,
    email_utilizador VARCHAR(150) NOT NULL,
    accao            VARCHAR(50)  NOT NULL,
    target_type      VARCHAR(50)  NOT NULL,
    target_id        BIGINT       NOT NULL,
    criado_em        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_log_target ON log (target_type, target_id);
CREATE INDEX idx_log_email ON log (email_utilizador);

-- ---------------------------------------------------------------------------
-- flipbook_edicao (1:1 com edicao)
-- ---------------------------------------------------------------------------
CREATE TABLE flipbook_edicao (
    id                   BIGSERIAL PRIMARY KEY,
    id_edicao            BIGINT      NOT NULL UNIQUE REFERENCES edicao (id) ON DELETE RESTRICT,
    estado_processamento VARCHAR(20) NOT NULL DEFAULT 'PROCESSANDO'
                         CHECK (estado_processamento IN ('PROCESSANDO', 'PRONTO', 'FALHOU')),
    gerado_em            TIMESTAMP,
    criado_em            TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em        TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- flipbook_pagina
-- ---------------------------------------------------------------------------
CREATE TABLE flipbook_pagina (
    id            BIGSERIAL PRIMARY KEY,
    id_flipbook   BIGINT       NOT NULL REFERENCES flipbook_edicao (id) ON DELETE RESTRICT,
    paginas       INT          NOT NULL,
    tipo          VARCHAR(20)  NOT NULL DEFAULT 'CONTEUDO'
                  CHECK (tipo IN ('CAPA', 'CONTEUDO')),
    url_imagem    VARCHAR(500) NOT NULL,
    ordem         INT          NOT NULL,
    criado_em     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP,
    removido_em   TIMESTAMP
);

CREATE INDEX idx_flipbook_pagina_flipbook ON flipbook_pagina (id_flipbook);

-- ---------------------------------------------------------------------------
-- flipbook_comentario (comentarios posicionados x,y em percentagem)
-- ---------------------------------------------------------------------------
CREATE TABLE flipbook_comentario (
    id            BIGSERIAL PRIMARY KEY,
    id_pagina     BIGINT        NOT NULL REFERENCES flipbook_pagina (id) ON DELETE RESTRICT,
    id_utilizador BIGINT        NOT NULL REFERENCES utilizador (id) ON DELETE RESTRICT,
    texto         TEXT          NOT NULL,
    likes         INT           NOT NULL DEFAULT 0,
    x             DECIMAL(5, 2) NOT NULL CHECK (x >= 0 AND x <= 100),
    y             DECIMAL(5, 2) NOT NULL CHECK (y >= 0 AND y <= 100),
    criado_em     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP,
    removido_em   TIMESTAMP
);

CREATE INDEX idx_flipbook_comentario_pagina ON flipbook_comentario (id_pagina);
CREATE INDEX idx_flipbook_comentario_utilizador ON flipbook_comentario (id_utilizador);
