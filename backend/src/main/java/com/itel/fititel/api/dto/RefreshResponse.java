package com.itel.fititel.api.dto;

/**
 * Returned by the refresh endpoint: a freshly issued JWT.
 */
public record RefreshResponse(
        String token,
        String tokenType,
        long expiresIn
) {
}
