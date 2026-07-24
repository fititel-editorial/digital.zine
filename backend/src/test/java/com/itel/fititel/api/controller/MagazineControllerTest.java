package com.itel.fititel.api.controller;

import com.itel.fititel.api.dto.magazine.MagazineResponse;
import com.itel.fititel.api.exception.ApiAccessDeniedHandler;
import com.itel.fititel.api.exception.ApiAuthenticationEntryPoint;
import com.itel.fititel.application.service.CustomUserDetailsService;
import com.itel.fititel.application.service.JwtService;
import com.itel.fititel.application.service.MagazineService;
import com.itel.fititel.config.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Web-layer tests for {@link MagazineController}: public reads, ADMIN-only
 * writes (method security), and DTO validation. Service and JWT collaborators
 * are mocked.
 */
@WebMvcTest(MagazineController.class)
@Import({SecurityConfig.class, ApiAuthenticationEntryPoint.class, ApiAccessDeniedHandler.class,
        MagazineControllerTest.MethodSecurityConfig.class})
class MagazineControllerTest {

    /** Enables @PreAuthorize inside the web slice. */
    @TestConfiguration
    @EnableMethodSecurity
    static class MethodSecurityConfig {
    }

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    MagazineService magazineService;

    @MockitoBean
    JwtService jwtService;

    @MockitoBean
    CustomUserDetailsService customUserDetailsService;

    @Test
    void listIsPublic() throws Exception {
        when(magazineService.findAll()).thenReturn(List.of());
        mockMvc.perform(get("/api/v1/magazines"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void adminCanCreate() throws Exception {
        when(magazineService.create(any())).thenReturn(new MagazineResponse(1L, "FITITEL", LocalDateTime.now()));
        mockMvc.perform(post("/api/v1/magazines")
                        .contentType("application/json")
                        .content("{\"name\":\"FITITEL\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("FITITEL"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createWithBlankNameReturns400() throws Exception {
        mockMvc.perform(post("/api/v1/magazines")
                        .contentType("application/json")
                        .content("{\"name\":\"\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "LEITOR")
    void readerCannotCreate() throws Exception {
        mockMvc.perform(post("/api/v1/magazines")
                        .contentType("application/json")
                        .content("{\"name\":\"FITITEL\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void anonymousCannotCreate() throws Exception {
        mockMvc.perform(post("/api/v1/magazines")
                        .contentType("application/json")
                        .content("{\"name\":\"FITITEL\"}"))
                .andExpect(status().isUnauthorized());
    }
}
