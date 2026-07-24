package com.itel.fititel.application.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Service;

import com.itel.fititel.api.dto.edition.CreateEditionRequest;
import com.itel.fititel.api.dto.edition.EditionResponse;
import com.itel.fititel.api.dto.edition.UpdateEditionRequest;
import com.itel.fititel.api.mapper.EditionMapper;
import com.itel.fititel.application.exception.ResourceNotFoundException;
import com.itel.fititel.domain.entity.Edition;
import com.itel.fititel.domain.entity.Magazine;
import com.itel.fititel.domain.entity.ProcessingStateEnum;
import com.itel.fititel.domain.repository.EditionRepository;
import com.itel.fititel.domain.repository.MagazineRepository;

@Service
public class EditionService {

    @Autowired
    private EditionRepository editionRepository;

    @Autowired
    private MagazineRepository magazineRepository;


    public EditionResponse createEdition(CreateEditionRequest request) {
        Magazine magazine = magazineRepository.findByIdAndDeletedAtIsNull(request.magazineId())
            .orElseThrow(() -> new ResourceNotFoundException("Magazine", request.magazineId()));
        
        Edition edition = new Edition();
        edition.setTheme(request.theme());
        edition.setTagline(request.tagline());
        edition.setDescription(request.description());
        edition.setPrice(request.price());
        edition.setNumber(request.number());
        edition.setReleaseDate(request.releaseDate());
        edition.setFree(request.free());
        edition.setProcessingState(ProcessingStateEnum.PENDING);
        edition.setMagazine(magazine);
        editionRepository.save(edition);
        return EditionMapper.toResponse(edition);
    }

    public Page<EditionResponse> getAllEditions(@PageableDefault(size = 10) Pageable pageable) {
        Page<Edition> editions = editionRepository.findAllByDeletedAtIsNull(pageable);
        return editions.map(EditionMapper::toResponse);
    }

    public Page<EditionResponse> getAllEditionsByMagazine(Long magazineId, @PageableDefault(size = 10) Pageable pageable) {
        Page<Edition> editions = editionRepository.findAllByMagazineIdAndDeletedAtIsNull(magazineId, pageable);
        return editions.map(EditionMapper::toResponse);
    }

    public EditionResponse getEdition(Long editionId) {
        Edition edition = editionRepository.findByIdAndDeletedAtIsNull(editionId)
                .orElseThrow(() -> new ResourceNotFoundException("Edition", editionId));
        return EditionMapper.toResponse(edition);
    }

    public EditionResponse updateEdition(Long editionId, UpdateEditionRequest request) {
        Edition edition = editionRepository.findByIdAndDeletedAtIsNull(editionId)
                .orElseThrow(() -> new ResourceNotFoundException("Edition", editionId));
        
        edition.setTheme(request.theme());
        edition.setTagline(request.tagline());
        edition.setDescription(request.description());
        edition.setPrice(request.price());
        edition.setNumber(request.number());
        edition.setReleaseDate(request.releaseDate());
        edition.setFree(request.free());
        editionRepository.save(edition);
        return EditionMapper.toResponse(edition);
    }

    public EditionResponse updateProcessingState(Long editionId, ProcessingStateEnum state) {
        Edition edition = editionRepository.findByIdAndDeletedAtIsNull(editionId)
                .orElseThrow(() -> new ResourceNotFoundException("Edition", editionId));
        edition.setProcessingState(state);
        return EditionMapper.toResponse(edition);
    }

    public void deleteEdition(Long editionId) {
        Edition edition = editionRepository.findByIdAndDeletedAtIsNull(editionId)
                .orElseThrow(() -> new ResourceNotFoundException("Edition", editionId));
        edition.setDeletedAt(LocalDateTime.now());
        editionRepository.save(edition);
    }

    
}

