package com.itel.fititel.api.mapper;

import com.itel.fititel.api.dto.edition.EditionResponse;
import com.itel.fititel.domain.entity.Edition;

public class EditionMapper {
    public static EditionResponse toResponse(Edition edition) {
        return new EditionResponse(
                edition.getId(),
                edition.getTheme(),
                edition.getTagline(),
                edition.getPrice(),
                edition.getPageCount(),
                edition.getNumber(),
                edition.getReleaseDate(),
                edition.isFree(),
                edition.getProcessingState()
        );
    }
}