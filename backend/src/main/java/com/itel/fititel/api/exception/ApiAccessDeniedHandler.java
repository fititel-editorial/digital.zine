package com.itel.fititel.api.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Writes the standard {@link ApiError} body (403) when an authenticated but
 * unauthorised request hits a protected endpoint, from within the security
 * filter chain. The ObjectMapper is resolved lazily for the same reason as
 * {@link ApiAuthenticationEntryPoint}.
 */
@Component
public class ApiAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectProvider<ObjectMapper> objectMapperProvider;

    public ApiAccessDeniedHandler(ObjectProvider<ObjectMapper> objectMapperProvider) {
        this.objectMapperProvider = objectMapperProvider;
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        ApiAuthenticationEntryPoint.writeError(response, HttpStatus.FORBIDDEN,
                "Não tem permissão para aceder a este recurso.", request.getRequestURI(),
                objectMapperProvider.getObject());
    }
}
