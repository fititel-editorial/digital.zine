package com.itel.fititel.api.exception;

import com.itel.fititel.application.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Test-only controller used to exercise the GlobalExceptionHandler and CORS
 * configuration. Not part of the production application.
 */
@RestController
@RequestMapping("/test")
class TestExceptionController {

    record SampleRequest(@NotBlank String name) {
    }

    @PostMapping("/validate")
    void validate(@Valid @RequestBody SampleRequest request) {
        // no-op: returns 200 when valid, 400 (via advice) when not
    }

    @GetMapping("/not-found")
    void notFound() {
        throw new ResourceNotFoundException("Edição", 99);
    }
}
