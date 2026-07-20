package com.itel.fititel.mapppers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import com.itel.fititel.dtos.ListedUserDto;
import com.itel.fititel.models.Utilizador;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UtilizadorMapper {

    @Mapping(target = "prNome", source = "pNome")
    @Mapping(target = "createdAt", source = "criadoEm")
    ListedUserDto toListedUserDto(Utilizador utilizador);
    
}
