package com.itel.fititel.application.exception;

/**
 * Thrown on a failed login (unknown email or wrong password). Translated to
 * HTTP 401 by the GlobalExceptionHandler. The message is deliberately generic
 * so it does not reveal whether the email exists.
 */
public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException(String message) {
        super(message);
    }
}
