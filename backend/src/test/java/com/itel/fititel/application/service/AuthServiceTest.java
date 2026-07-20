package com.itel.fititel.application.service;

import com.itel.fititel.api.dto.AuthResponse;
import com.itel.fititel.api.dto.LoginRequest;
import com.itel.fititel.api.dto.RegisterRequest;
import com.itel.fititel.application.exception.ConflictException;
import com.itel.fititel.application.exception.InvalidCredentialsException;
import com.itel.fititel.domain.entity.Role;
import com.itel.fititel.domain.entity.User;
import com.itel.fititel.domain.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = new BCryptPasswordEncoder();
        jwtService = new JwtService("test-secret-0123456789-abcdefghijklmnopqrstuvwxyz-ABCDEFGHIJKL", 3600);
        authService = new AuthService(userRepository, passwordEncoder, jwtService);
    }

    @Test
    void registerCreatesReaderAndHashesPassword() {
        when(userRepository.existsByEmailAndDeletedAtIsNull("joao@email.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(1L);
            return u;
        });

        RegisterRequest req = new RegisterRequest("João", "Silva", "joao@email.com",
                "Segura123!", LocalDate.of(1990, 5, 15));
        AuthResponse response = authService.register(req);

        assertNotNull(response.token());
        assertEquals("LEITOR", response.user().role());
        assertEquals("joao@email.com", response.user().email());

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        User saved = captor.getValue();
        assertEquals(Role.LEITOR, saved.getRole());
        assertNotEquals("Segura123!", saved.getPasswordHash());
        assertTrue(passwordEncoder.matches("Segura123!", saved.getPasswordHash()));
    }

    @Test
    void registerRejectsDuplicateEmail() {
        when(userRepository.existsByEmailAndDeletedAtIsNull("joao@email.com")).thenReturn(true);

        RegisterRequest req = new RegisterRequest("João", "Silva", "joao@email.com",
                "Segura123!", LocalDate.of(1990, 5, 15));

        assertThrows(ConflictException.class, () -> authService.register(req));
        verify(userRepository, never()).save(any());
    }

    @Test
    void loginRejectsWrongPassword() {
        User user = User.builder().id(1L).email("joao@email.com").role(Role.LEITOR)
                .passwordHash(passwordEncoder.encode("Segura123!")).build();
        when(userRepository.findByEmailAndDeletedAtIsNull("joao@email.com")).thenReturn(Optional.of(user));

        assertThrows(InvalidCredentialsException.class,
                () -> authService.login(new LoginRequest("joao@email.com", "errada")));
    }

    @Test
    void loginReturnsValidTokenForCorrectCredentials() {
        User user = User.builder().id(1L).email("joao@email.com").role(Role.LEITOR)
                .passwordHash(passwordEncoder.encode("Segura123!")).build();
        when(userRepository.findByEmailAndDeletedAtIsNull("joao@email.com")).thenReturn(Optional.of(user));

        AuthResponse response = authService.login(new LoginRequest("joao@email.com", "Segura123!"));

        assertNotNull(response.token());
        assertTrue(jwtService.isValid(response.token()));
    }
}
