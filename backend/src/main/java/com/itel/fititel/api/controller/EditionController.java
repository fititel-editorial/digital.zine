package com.itel.fititel.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.itel.fititel.api.dto.edition.CreateEditionRequest;
import com.itel.fititel.api.dto.edition.EditionResponse;
import com.itel.fititel.api.dto.edition.UpdateEditionRequest;
import com.itel.fititel.application.service.EditionService;

import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/editions")
public class EditionController {
    @Autowired
    private EditionService editionService;

    @GetMapping
    public ResponseEntity<Page<EditionResponse>> getAllEditions(@PageableDefault(size = 10) Pageable pageable) {
        Page<EditionResponse> editions = editionService.getAllEditions(pageable);
        return ResponseEntity.ok(editions);
    }

    @GetMapping("/{editionId}")
    public ResponseEntity<?> getEdition(@PathVariable Long editionId) {
        try{
            EditionResponse edition = editionService.getEdition(editionId);
            return ResponseEntity.ok(edition);
        } catch (Exception e) {
            HttpStatus status = e.getMessage().contains("não encontrado(a)") ? HttpStatus.NOT_FOUND : HttpStatus.INTERNAL_SERVER_ERROR;
            String message = e.getMessage();
            return ResponseEntity.status(status).body(message);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createEdition(@Valid @RequestBody CreateEditionRequest request) {
        try{
            EditionResponse response = editionService.createEdition(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
            String message = e.getMessage();
            return ResponseEntity.status(status).body(message);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{editionId}")
    public ResponseEntity<?> updateEdition(@PathVariable Long editionId, @Valid @RequestBody UpdateEditionRequest request) {
        try{
            EditionResponse response = editionService.updateEdition(editionId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            HttpStatus status = e.getMessage().contains("não encontrado(a)") ? HttpStatus.NOT_FOUND : HttpStatus.INTERNAL_SERVER_ERROR;
            String message = e.getMessage();
            return ResponseEntity.status(status).body(message);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{editionId}")
    public ResponseEntity<?> deleteEdition(@PathVariable Long editionId) {
        try{
            editionService.deleteEdition(editionId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            HttpStatus status = e.getMessage().contains("não encontrado(a)") ? HttpStatus.NOT_FOUND : HttpStatus.INTERNAL_SERVER_ERROR;
            String message = e.getMessage();
            return ResponseEntity.status(status).body(message);
        }
    }

    @GetMapping("/magazine/{magazineId}")
    public ResponseEntity<Page<EditionResponse>> getAllByMagazine(@PathVariable Long magazineId, @PageableDefault(size=10) Pageable pageable){
        
        Page<EditionResponse> editions = editionService.getAllEditionsByMagazine(magazineId, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(editions);
        
    }
    
}