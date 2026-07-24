package com.itel.fititel.api.dto.magazine;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateMagazineRequest(
    @NotBlank(message = "Title is required")
    @Size(max = 120)
    String title
) {}
