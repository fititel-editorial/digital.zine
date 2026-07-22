package com.itel.fititel.application.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.itel.fititel.api.dto.magazine.CreateMagazineRequest;
import com.itel.fititel.api.dto.magazine.MagazineResponse;
import com.itel.fititel.api.dto.magazine.UpdateMagazineRequest;
import com.itel.fititel.api.mapper.MagazineMapper;
import com.itel.fititel.domain.entity.Magazine;
import com.itel.fititel.domain.repository.MagazineRepository;

@Service
public class MagazineService {

    @Autowired
    private MagazineRepository magazineRepository;

    public MagazineResponse create(CreateMagazineRequest newMagazine) {
        Magazine magazine = new Magazine();
        magazine.setTitle(newMagazine.title());
        
        Magazine savedMagazine = magazineRepository.save(magazine);

        return MagazineMapper.toResponse(savedMagazine);
    }

    public List<MagazineResponse> findAll() {
        List<Magazine> magazines = magazineRepository.findAll().stream().filter(magazine -> magazine.getDeletedAt() == null).toList();
        return magazines.stream().map(MagazineMapper::toResponse).toList();
    }

    public void remove(Long id) {
        Magazine magazine = magazineRepository.findById(id).orElseThrow(() -> new RuntimeException("Magazine not found"));
        if(magazine.getDeletedAt() != null) throw new RuntimeException("Magazine not found");
        magazine.setDeletedAt(LocalDateTime.now());
        magazineRepository.save(magazine);
    }

    public MagazineResponse findById(Long id) {
        Magazine magazine = magazineRepository.findById(id).orElseThrow(() -> new RuntimeException("Magazine not found"));
        if(magazine.getDeletedAt() != null) throw new RuntimeException("Magazine not found");
        return MagazineMapper.toResponse(magazine);
    }

    public MagazineResponse update(Long id, UpdateMagazineRequest magazine) {
        Magazine existingMagazine = magazineRepository.findById(id).orElseThrow(() -> new RuntimeException("Magazine not found"));
        if(existingMagazine.getDeletedAt() != null) throw new RuntimeException("Magazine not found");
        existingMagazine.setTitle(magazine.title());
        existingMagazine.setUpdatedAt(LocalDateTime.now());
        Magazine updatedMagazine = magazineRepository.save(existingMagazine);

        return MagazineMapper.toResponse(updatedMagazine);
    }
    
}
