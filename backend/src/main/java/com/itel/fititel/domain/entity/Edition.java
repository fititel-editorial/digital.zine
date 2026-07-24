package com.itel.fititel.domain.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "edicao")
@Getter 
@Setter
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
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
    @Builder.Default
    private int pageCount = 0;

    @Column(name = "numero", nullable = false)
    private int number;

    @Column(name = "data_lancamento", nullable = false)
    private LocalDate releaseDate;

    @Column(name = "e_gratis", nullable = false)
    @Builder.Default
    private boolean free = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_processamento", nullable = false)
    @Builder.Default
    private ProcessingStateEnum processingState = ProcessingStateEnum.PENDING;

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