package com.itel.fititel.api.dto.edition;

import java.time.LocalDate;

import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CreateEditionRequest(
        @NotNull 
        Long magazineId,
        
        @NotBlank(message = "Theme is obrigatory")
        @Size(max = 150) 
        String theme,
        
        String tagline,
        
        String description,
        
        @NotNull 
        @PositiveOrZero(message = "Price cannot be negative") 
        Long price,
        
        @NotNull
        @Positive(message = "Edition number must be gretaer than 0")
        int number,
        
        @NotNull
        @Past
        LocalDate releaseDate,
        
        boolean free
) {}