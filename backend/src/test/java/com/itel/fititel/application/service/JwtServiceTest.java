package com.itel.fititel.application.service;

import com.itel.fititel.domain.entity.Role;
import com.itel.fititel.domain.entity.User;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    private static final String SECRET = "test-secret-0123456789-abcdefghijklmnopqrstuvwxyz-ABCDEFGHIJKL";

    private User sampleUser() {
        return User.builder().id(1L).email("joao@email.com").role(Role.LEITOR).build();
    }

    @Test
    void generatesValidTokenAndExtractsEmail() {
        JwtService jwt = new JwtService(SECRET, 3600);
        String token = jwt.generateToken(sampleUser());

        assertTrue(jwt.isValid(token));
        assertEquals("joao@email.com", jwt.extractEmail(token));
    }

    @Test
    void rejectsExpiredToken() {
        JwtService jwt = new JwtService(SECRET, -1); // already expired
        String token = jwt.generateToken(sampleUser());

        assertFalse(jwt.isValid(token));
    }

    @Test
    void rejectsTamperedToken() {
        JwtService jwt = new JwtService(SECRET, 3600);
        String token = jwt.generateToken(sampleUser());

        assertFalse(jwt.isValid(token + "tampered"));
    }
}
