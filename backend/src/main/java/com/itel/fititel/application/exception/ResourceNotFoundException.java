package com.itel.fititel.application.exception;

/**
 * Thrown by the service layer when a requested resource does not exist
 * (or is soft-deleted). Translated to HTTP 404 by the GlobalExceptionHandler.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resource, Object id) {
        super("%s não encontrado(a) (id: %s).".formatted(resource, id));
    }
}
