package com.itel.fititel.application.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.itel.fititel.api.dto.magazine.CreateMagazineRequest;
import com.itel.fititel.api.dto.magazine.MagazineResponse;
import com.itel.fititel.api.dto.magazine.UpdateMagazineRequest;
import com.itel.fititel.api.mapper.MagazineMapper;
import com.itel.fititel.application.exception.ResourceNotFoundException;
import com.itel.fititel.domain.entity.Magazine;
import com.itel.fititel.domain.repository.MagazineRepository;

@Service
public class MagazineService {

    private final MagazineRepository magazineRepository;

    public MagazineService(MagazineRepository magazineRepository) {
        this.magazineRepository = magazineRepository;
    }

    public MagazineResponse create(CreateMagazineRequest request) {
        Magazine magazine = new Magazine();
        magazine.setName(request.name());
        return MagazineMapper.toResponse(magazineRepository.save(magazine));
    }

    public List<MagazineResponse> findAll() {
        return magazineRepository.findAllByDeletedAtIsNull().stream()
                .map(MagazineMapper::toResponse)
                .toList();
    }

    public MagazineResponse findById(Long id) {
        return MagazineMapper.toResponse(getActiveOrThrow(id));
    }

    public MagazineResponse update(Long id, UpdateMagazineRequest request) {
        Magazine magazine = getActiveOrThrow(id);
        magazine.setName(request.name());
        return MagazineMapper.toResponse(magazineRepository.save(magazine));
    }

    public void remove(Long id) {
        Magazine magazine = getActiveOrThrow(id);
        magazine.setDeletedAt(java.time.LocalDateTime.now());
        magazineRepository.save(magazine);
    }

    private Magazine getActiveOrThrow(Long id) {
        return magazineRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Revista", id));
    }
}
