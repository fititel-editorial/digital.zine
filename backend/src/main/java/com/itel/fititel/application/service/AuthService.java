package com.itel.fititel.application.service;

import com.itel.fititel.api.dto.AuthResponse;
import com.itel.fititel.api.dto.LoginRequest;
import com.itel.fititel.api.dto.RefreshResponse;
import com.itel.fititel.api.dto.RegisterRequest;
import com.itel.fititel.api.mapper.UserMapper;
import com.itel.fititel.application.exception.ConflictException;
import com.itel.fititel.application.exception.InvalidCredentialsException;
import com.itel.fititel.domain.entity.Role;
import com.itel.fititel.domain.entity.User;
import com.itel.fititel.domain.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Registration, login and token refresh. Passwords are hashed with BCrypt and
 * never returned. New accounts are always created with role {@code LEITOR}.
 */
@Service
public class AuthService {

    private static final String BEARER = "Bearer";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailAndDeletedAtIsNull(request.email())) {
            throw new ConflictException("Já existe uma conta com este email.");
        }
        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .dateOfBirth(request.dateOfBirth())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(Role.LEITOR)
                .build();
        User saved = userRepository.save(user);
        return buildAuthResponse(saved);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(request.email())
                .filter(u -> passwordEncoder.matches(request.password(), u.getPasswordHash()))
                .orElseThrow(() -> new InvalidCredentialsException("Email ou palavra-passe inválidos."));
        return buildAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public RefreshResponse refresh(String email) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new InvalidCredentialsException("Sessão inválida."));
        String token = jwtService.generateToken(user);
        return new RefreshResponse(token, BEARER, jwtService.getExpirationSeconds());
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtService.generateToken(user);
        // editorOf stays empty until the EditionEditor entity exists (admin issues).
        return new AuthResponse(token, BEARER, jwtService.getExpirationSeconds(),
                UserMapper.toResponse(user, List.of()));
    }
}
