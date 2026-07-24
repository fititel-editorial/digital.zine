package com.itel.fititel.api.dto.edition;

import java.time.LocalDate;

import com.itel.fititel.domain.entity.ProcessingStateEnum;

public record EditionResponse(
        Long id, 
        String theme, 
        String tagline, 
        Long price, 
        Integer pageCount,
        Integer number, 
        LocalDate releaseDate, 
        boolean free, 
        ProcessingStateEnum processingState
) {}
