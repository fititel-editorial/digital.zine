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
 * Unit tests for {@link MagazineService}. Repository is mocked, so these run
 * without a database or Spring context. Soft-delete filtering is done by the
 * repository ({@code findAllByDeletedAtIsNull} / {@code findByIdAndDeletedAtIsNull}).
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
        magazine.setName("Revista ITEL");
        magazine.setCreatedAt(LocalDateTime.now());
    }

    // ---------- create ----------

    @Test
    void create_shouldPersistAndReturnResponse() {
        CreateMagazineRequest request = new CreateMagazineRequest("Revista ITEL");
        when(magazineRepository.save(any(Magazine.class))).thenReturn(magazine);

        MagazineResponse response = magazineService.create(request);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.name()).isEqualTo("Revista ITEL");

        ArgumentCaptor<Magazine> captor = ArgumentCaptor.forClass(Magazine.class);
        verify(magazineRepository).save(captor.capture());
        assertThat(captor.getValue().getName()).isEqualTo("Revista ITEL");
    }

    // ---------- findAll ----------

    @Test
    void findAll_shouldReturnActiveMagazines() {
        when(magazineRepository.findAllByDeletedAtIsNull()).thenReturn(List.of(magazine));

        List<MagazineResponse> result = magazineService.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).name()).isEqualTo("Revista ITEL");
    }

    @Test
    void findAll_shouldReturnEmptyList_whenNoneActive() {
        when(magazineRepository.findAllByDeletedAtIsNull()).thenReturn(List.of());

        assertThat(magazineService.findAll()).isEmpty();
    }

    // ---------- findById ----------

    @Test
    void findById_shouldReturnResponse_whenActive() {
        when(magazineRepository.findByIdAndDeletedAtIsNull(1L)).thenReturn(Optional.of(magazine));

        assertThat(magazineService.findById(1L).name()).isEqualTo("Revista ITEL");
    }

    @Test
    void findById_shouldThrow_whenNotFoundOrSoftDeleted() {
        when(magazineRepository.findByIdAndDeletedAtIsNull(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> magazineService.findById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    // ---------- update ----------

    @Test
    void update_shouldModifyAndReturnResponse_whenActive() {
        when(magazineRepository.findByIdAndDeletedAtIsNull(1L)).thenReturn(Optional.of(magazine));
        when(magazineRepository.save(any(Magazine.class))).thenReturn(magazine);

        MagazineResponse response = magazineService.update(1L, new UpdateMagazineRequest("Revista ITEL - Edição 2"));

        assertThat(response.name()).isEqualTo("Revista ITEL - Edição 2");
        verify(magazineRepository).save(magazine);
    }

    @Test
    void update_shouldThrow_whenNotFoundOrSoftDeleted() {
        when(magazineRepository.findByIdAndDeletedAtIsNull(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> magazineService.update(99L, new UpdateMagazineRequest("Novo")))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(magazineRepository, never()).save(any());
    }

    // ---------- remove ----------

    @Test
    void remove_shouldSoftDelete_whenActive() {
        when(magazineRepository.findByIdAndDeletedAtIsNull(1L)).thenReturn(Optional.of(magazine));
        when(magazineRepository.save(any(Magazine.class))).thenReturn(magazine);

        magazineService.remove(1L);

        assertThat(magazine.getDeletedAt()).isNotNull();
        verify(magazineRepository).save(magazine);
    }

    @Test
    void remove_shouldThrow_whenNotFoundOrSoftDeleted() {
        when(magazineRepository.findByIdAndDeletedAtIsNull(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> magazineService.remove(99L))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(magazineRepository, never()).save(any());
    }
}
