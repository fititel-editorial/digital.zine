package com.itel.fititel.domain.entity;

/**
 * User role. Stored in the {@code utilizador.role} column as its name
 * ('LEITOR' or 'ADMIN'). There is no third role for "editor" — that is an
 * association ({@code editor_edicao}); see technical-decisions.md #16.
 */
public enum Role {
    LEITOR,
    ADMIN
}
