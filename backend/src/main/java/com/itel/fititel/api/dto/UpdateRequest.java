package com.itel.fititel.api.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.*;

public record UpdateRequest(
    @Size(min = 3, max = 50, message = "First name must be between 3 and 50 characters")
    @NotBlank(message = "First name is required")
    String firstName,
    
    @Size(min = 3, max = 50, message = "Last name must be between 3 and 50 characters")
    @NotBlank(message = "Last name is required")
    String lastName,

    @Past(message = "Date of birth must be in the past")
    @NotNull(message = "Date of birth is required")
    LocalDate dateOfBirth
) 
{} 