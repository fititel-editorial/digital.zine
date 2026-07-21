package com.itel.fititel.api.controller;

import com.itel.fititel.api.dto.AuthResponse;
import com.itel.fititel.api.dto.LoginRequest;
import com.itel.fititel.api.dto.RefreshResponse;
import com.itel.fititel.api.dto.RegisterRequest;
import com.itel.fititel.application.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /** Requires a valid (non-expired) Bearer token; issues a fresh one. */
    @PostMapping("/refresh")
    public ResponseEntity<RefreshResponse> refresh(Authentication authentication) {
        return ResponseEntity.ok(authService.refresh(authentication.getName()));
    }
}
