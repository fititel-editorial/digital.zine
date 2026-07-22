package com.itel.fititel.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.itel.fititel.application.service.MagazineService;
import com.itel.fititel.api.dto.magazine.*;

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

    @PostMapping("/new")
    public ResponseEntity<?> create(@RequestBody CreateMagazineRequest magazine) {
        try{
            return ResponseEntity.ok(magazineService.create(magazine));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong trying to create the magazine");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(magazineService.findById(id));
        } catch (Exception e) {
            HttpStatus status = e.getMessage().contains("Magazine not found")?HttpStatus.NOT_FOUND:HttpStatus.INTERNAL_SERVER_ERROR;
            String message = e.getMessage().contains("Magazine not found")?"Magazine not found":e.getMessage();
            return ResponseEntity.status(status).body(message);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UpdateMagazineRequest magazine) {
        try{
            return ResponseEntity.ok(magazineService.update(id, magazine));
        } catch (Exception e) {
            HttpStatus status = e.getMessage().contains("Magazine not found")?HttpStatus.NOT_FOUND:HttpStatus.INTERNAL_SERVER_ERROR;
            String message = e.getMessage().contains("Magazine not found")?"Magazine not found":e.getMessage();
            return ResponseEntity.status(status).body(message);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remove(@PathVariable Long id) {
        try{
            magazineService.remove(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            HttpStatus status = e.getMessage().contains("Magazine not found")?HttpStatus.NOT_FOUND:HttpStatus.INTERNAL_SERVER_ERROR;
            String message = e.getMessage().contains("Magazine not found")?"Magazine not found":e.getMessage();
            return ResponseEntity.status(status).body(message);
        }
    }
    
}
