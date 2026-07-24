package com.itel.fititel.application.service;

import com.itel.fititel.api.dto.magazine.CreateMagazineRequest;
import com.itel.fititel.api.dto.magazine.MagazineResponse;
import com.itel.fititel.api.dto.magazine.UpdateMagazineRequest;
import com.itel.fititel.application.exception.ResourceNotFoundException;
import com.itel.fititel.domain.entity.Magazine;
import com.itel.fititel.domain.repository.MagazineRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link MagazineService}.
 * Repository is mocked, so these run without a database or Spring context.
 */
@ExtendWith(MockitoExtension.class)
class MagazineServiceTest {

    @Mock
    private MagazineRepository magazineRepository;

    @InjectMocks
    private MagazineService magazineService;

    private Magazine magazine;

    @BeforeEach
    void setUp() {
        magazine = new Magazine();
        magazine.setId(1L);
        magazine.setTitle("Revista ITEL");
        magazine.setCreatedAt(LocalDateTime.now());
    }

    // ---------- create ----------

    @Test
    void create_shouldPersistAndReturnResponse() {
        CreateMagazineRequest request = new CreateMagazineRequest("Revista ITEL");
        when(magazineRepository.save(any(Magazine.class))).thenReturn(magazine);

        MagazineResponse response = magazineService.create(request);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.title()).isEqualTo("Revista ITEL");

        ArgumentCaptor<Magazine> captor = ArgumentCaptor.forClass(Magazine.class);
        verify(magazineRepository).save(captor.capture());
        assertThat(captor.getValue().getTitle()).isEqualTo("Revista ITEL");
    }

    // ---------- findAll ----------

    @Test
    void findAll_shouldExcludeSoftDeletedMagazines() {
        Magazine deleted = new Magazine();
        deleted.setId(2L);
        deleted.setTitle("Revista Antiga");
        deleted.setDeletedAt(LocalDateTime.now());

        when(magazineRepository.findAll()).thenReturn(List.of(magazine, deleted));

        List<MagazineResponse> result = magazineService.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).id()).isEqualTo(1L);
    }

    @Test
    void findAll_shouldReturnEmptyList_whenNoMagazinesExist() {
        when(magazineRepository.findAll()).thenReturn(List.of());

        List<MagazineResponse> result = magazineService.findAll();

        assertThat(result).isEmpty();
    }

    // ---------- findById ----------

    @Test
    void findById_shouldReturnResponse_whenMagazineExists() {
        when(magazineRepository.findById(1L)).thenReturn(Optional.of(magazine));

        MagazineResponse response = magazineService.findById(1L);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.title()).isEqualTo("Revista ITEL");
    }

    @Test
    void findById_shouldThrow_whenMagazineDoesNotExist() {
        when(magazineRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> magazineService.findById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void findById_shouldThrow_whenMagazineIsSoftDeleted() {
        magazine.setDeletedAt(LocalDateTime.now());
        when(magazineRepository.findById(1L)).thenReturn(Optional.of(magazine));

        assertThatThrownBy(() -> magazineService.findById(1L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    // ---------- update ----------

    @Test
    void update_shouldModifyAndReturnResponse_whenMagazineExists() {
        UpdateMagazineRequest request = new UpdateMagazineRequest("Revista ITEL - Edição 2");
        when(magazineRepository.findById(1L)).thenReturn(Optional.of(magazine));
        when(magazineRepository.save(any(Magazine.class))).thenReturn(magazine);

        MagazineResponse response = magazineService.update(1L, request);

        assertThat(response.title()).isEqualTo("Revista ITEL - Edição 2");
        verify(magazineRepository).save(magazine);
    }

    @Test
    void update_shouldThrow_whenMagazineDoesNotExist() {
        UpdateMagazineRequest request = new UpdateMagazineRequest("Novo Título");
        when(magazineRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> magazineService.update(99L, request))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(magazineRepository, never()).save(any());
    }

    @Test
    void update_shouldThrow_whenMagazineIsSoftDeleted() {
        magazine.setDeletedAt(LocalDateTime.now());
        UpdateMagazineRequest request = new UpdateMagazineRequest("Novo Título");
        when(magazineRepository.findById(1L)).thenReturn(Optional.of(magazine));

        assertThatThrownBy(() -> magazineService.update(1L, request))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(magazineRepository, never()).save(any());
    }

    // ---------- remove ----------

    @Test
    void remove_shouldSoftDelete_whenMagazineExists() {
        when(magazineRepository.findById(1L)).thenReturn(Optional.of(magazine));
        when(magazineRepository.save(any(Magazine.class))).thenReturn(magazine);

        magazineService.remove(1L);

        assertThat(magazine.getDeletedAt()).isNotNull();
        verify(magazineRepository).save(magazine);
    }

    @Test
    void remove_shouldThrow_whenMagazineDoesNotExist() {
        when(magazineRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> magazineService.remove(99L))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(magazineRepository, never()).save(any());
    }

    @Test
    void remove_shouldThrow_whenMagazineAlreadyDeleted() {
        magazine.setDeletedAt(LocalDateTime.now());
        when(magazineRepository.findById(1L)).thenReturn(Optional.of(magazine));

        assertThatThrownBy(() -> magazineService.remove(1L))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(magazineRepository, never()).save(any());
    }
}