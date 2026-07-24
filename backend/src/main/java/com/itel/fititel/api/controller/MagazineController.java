package com.itel.fititel.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.itel.fititel.application.service.MagazineService;
import com.itel.fititel.api.dto.magazine.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/magazines")
public class MagazineController {

    private final MagazineService magazineService;

    public MagazineController(MagazineService magazineService) {
        this.magazineService = magazineService;
    }

    @GetMapping
    public List<MagazineResponse> findAll() {
        return magazineService.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping // Removed "/new" to match REST standard and your unit tests
    public ResponseEntity<MagazineResponse> create(@Valid @RequestBody CreateMagazineRequest magazine) {
        MagazineResponse created = magazineService.create(magazine);
        return ResponseEntity.status(HttpStatus.CREATED).body(created); // Returns 201 Created
    }

    @GetMapping("/{id}")
    public ResponseEntity<MagazineResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(magazineService.findById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<MagazineResponse> update(@PathVariable Long id, @Valid @RequestBody UpdateMagazineRequest magazine) {
        return ResponseEntity.ok(magazineService.update(id, magazine));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        magazineService.remove(id);
        return ResponseEntity.noContent().build();
    }
}