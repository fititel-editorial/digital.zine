package com.itel.fititel.application.exception;

/**
 * Thrown when a business rule is violated (the request is well-formed but
 * cannot be processed). Translated to HTTP 422 by the GlobalExceptionHandler.
 */
public class BusinessRuleException extends RuntimeException {

    public BusinessRuleException(String message) {
        super(message);
    }
}
