package com.itel.fititel.api.dto;

/**
 * Returned by register and login: the JWT plus the authenticated user.
 */
public record AuthResponse(
        String token,
        String tokenType,
        long expiresIn,
        UserResponse user
) {
}
