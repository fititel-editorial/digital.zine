package com.itel.fititel.api.mapper;

import com.itel.fititel.api.dto.magazine.MagazineResponse;
import com.itel.fititel.domain.entity.Magazine;
public class MagazineMapper {
    public static MagazineResponse toResponse(Magazine magazine) {
        return new MagazineResponse(
            magazine.getId(),
            magazine.getTitle(),
            magazine.getCreatedAt(),
            magazine.getUpdatedAt()
        );
    }
}
