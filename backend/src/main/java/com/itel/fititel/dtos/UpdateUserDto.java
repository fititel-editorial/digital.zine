package com.itel.fititel.dtos;

import java.time.LocalDate;

public record UpdateUserDto(
    String pNome,
    String sbNome,
    LocalDate dataNascimento
) {}