package com.itel.fititel.api.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Public view of a user. Never includes the password hash. {@code editorOf}
 * lists the edition IDs the user is assigned to via {@code editor_edicao}
 * (empty until the EditionEditor entity is added in a later issue).
 */
public record UserResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        String role,
        List<Long> editorOf,
        LocalDateTime createdAt
) {
}
