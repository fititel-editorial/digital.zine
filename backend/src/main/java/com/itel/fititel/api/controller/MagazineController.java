package com.itel.fititel.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.itel.fititel.api.dto.magazine.CreateMagazineRequest;
import com.itel.fititel.api.dto.magazine.MagazineResponse;
import com.itel.fititel.api.dto.magazine.UpdateMagazineRequest;
import com.itel.fititel.application.service.MagazineService;

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

    @GetMapping("/{id}")
    public ResponseEntity<MagazineResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(magazineService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MagazineResponse> create(@Valid @RequestBody CreateMagazineRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(magazineService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MagazineResponse> update(@PathVariable Long id, @Valid @RequestBody UpdateMagazineRequest request) {
        return ResponseEntity.ok(magazineService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        magazineService.remove(id);
        return ResponseEntity.noContent().build();
    }
}
