 package com.itel.fititel.dtos;

public record ChangingPassRequestDto(
   String oldPassword,
   String newPassword
) {}