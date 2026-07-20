package com.itel.fititel.application.exception;

/**
 * Thrown when the current state of a resource prevents the operation
 * (e.g. a duplicate). Translated to HTTP 409 by the GlobalExceptionHandler.
 */
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }
}
