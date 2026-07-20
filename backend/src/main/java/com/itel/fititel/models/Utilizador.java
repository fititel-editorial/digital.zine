package com.itel.fititel.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "utilizador")
public class Utilizador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "p_nome", length = 50, nullable = false)
    private String pNome;

    @Column(name = "sb_nome", length = 100, nullable = false)
    private String sbNome;

    @Column(name = "data_nascimento", nullable = false)
    private LocalDate dataNascimento;

    @Column(length = 150, unique = true, nullable = false)
    private String email;

    @Column(name = "palavra_passe_hash", length = 255, nullable = false)
    private String palavraPasseHash;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private UserRole role = UserRole.LEITOR; // Sets the default value

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    @Column(name = "removido_em")
    private LocalDateTime removidoEm;

    // --- Lifecycle Hooks for Timestamps ---

    @PrePersist
    protected void onCreate() {
        this.criadoEm = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.atualizadoEm = LocalDateTime.now();
    }

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getpNome() { return pNome; }
    public void setpNome(String pNome) { this.pNome = pNome; }

    public String getSbNome() { return sbNome; }
    public void setSbNome(String sbNome) { this.sbNome = sbNome; }

    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPalavraPasseHash() { return palavraPasseHash; }
    public void setPalavraPasseHash(String palavraPasseHash) { this.palavraPasseHash = palavraPasseHash; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }

    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
    public void setAtualizadoEm(LocalDateTime atualizadoEm) { this.atualizadoEm = atualizadoEm; }

    public LocalDateTime getRemovidoEm() { return removidoEm; }
    public void setRemovidoEm(LocalDateTime removidoEm) { this.removidoEm = removidoEm; }
}