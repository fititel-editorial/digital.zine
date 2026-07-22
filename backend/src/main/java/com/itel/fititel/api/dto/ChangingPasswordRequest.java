package com.itel.fititel.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangingPasswordRequest(
    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "New password must be at least 8 characters")
    String newPassword, 
    @NotBlank(message = "Old password is required")
    String oldPassword
) {}