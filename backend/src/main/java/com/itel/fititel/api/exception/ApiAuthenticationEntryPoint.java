package com.itel.fititel.api.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Writes the standard {@link ApiError} body (401) when an unauthenticated
 * request hits a protected endpoint. Runs inside the security filter chain,
 * before the DispatcherServlet, so the GlobalExceptionHandler cannot catch it.
 *
 * <p>The ObjectMapper is resolved lazily (at request time) because the security
 * filter chain is built very early during context startup — earlier than the
 * Jackson auto-configuration — so an eager constructor dependency would fail.</p>
 */
@Component
public class ApiAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectProvider<ObjectMapper> objectMapperProvider;

    public ApiAuthenticationEntryPoint(ObjectProvider<ObjectMapper> objectMapperProvider) {
        this.objectMapperProvider = objectMapperProvider;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        writeError(response, HttpStatus.UNAUTHORIZED, "Autenticação necessária.",
                request.getRequestURI(), objectMapperProvider.getObject());
    }

    static void writeError(HttpServletResponse response, HttpStatus status, String message,
                           String path, ObjectMapper objectMapper) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        objectMapper.writeValue(response.getWriter(), ApiError.of(status, message, path));
    }
}
