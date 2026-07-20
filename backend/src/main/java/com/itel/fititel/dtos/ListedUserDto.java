package com.itel.fititel.dtos;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ListedUserDto(
    Long id, 
    String prNome,
    String sbNome,
    String email,
    LocalDate dataNascimento,
    LocalDateTime createdAt,
    String role
) {}