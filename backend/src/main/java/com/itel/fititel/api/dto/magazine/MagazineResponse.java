package com.itel.fititel.api.dto.magazine;

import java.time.LocalDateTime;

public record MagazineResponse(
    Long id,
    String title,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}