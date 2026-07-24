package com.itel.fititel.domain.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.itel.fititel.domain.entity.Edition;

public interface EditionRepository extends JpaRepository<Edition, Long> {
    Optional<Edition> findByIdAndDeletedAtIsNull(Long id);
    Page<Edition> findAllByDeletedAtIsNull(Pageable pageable);
    Page<Edition> findAllByMagazineIdAndDeletedAtIsNull(Long magazineId, Pageable pageable);
}