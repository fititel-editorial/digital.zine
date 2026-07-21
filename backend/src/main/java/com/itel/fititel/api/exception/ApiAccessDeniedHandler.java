package com.itel.fititel.api.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Writes the standard {@link ApiError} body (403) when an authenticated but
 * unauthorised request hits a protected endpoint, from within the security
 * filter chain. Reuses the hand-written serialisation in
 * {@link ApiAuthenticationEntryPoint}.
 */
@Component
public class ApiAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        ApiAuthenticationEntryPoint.writeError(response, HttpStatus.FORBIDDEN,
                "Não tem permissão para aceder a este recurso.", request.getRequestURI());
    }
}
