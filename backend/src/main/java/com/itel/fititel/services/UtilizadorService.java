package com.itel.fititel.services;

import org.springframework.stereotype.Service;

import com.itel.fititel.dtos.ChangingPassRequestDto;
import com.itel.fititel.dtos.ListedUserDto;
import com.itel.fititel.dtos.UpdateUserDto;
import com.itel.fititel.mapppers.UtilizadorMapper;
import com.itel.fititel.models.Utilizador;
import com.itel.fititel.repositories.UtilizadorRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UtilizadorService {
    private final UtilizadorRepository utilizadorRepository;
    private final UtilizadorMapper utilizadorMapper;

    public UtilizadorService(UtilizadorRepository utilizadorRepository, UtilizadorMapper utilizadorMapper) {
        this.utilizadorRepository = utilizadorRepository;
        this.utilizadorMapper = utilizadorMapper;
    }

    public Utilizador save(Utilizador utilizador) {
        return utilizadorRepository.save(utilizador);
    }

    public ListedUserDto findById(Long id) {
        Utilizador utilizador = utilizadorRepository.findById(id).orElseThrow(()-> new RuntimeException("User not found"));
        ListedUserDto listedUserDto = utilizadorMapper.toListedUserDto(utilizador);
        return listedUserDto;
    }

    public List<ListedUserDto> findAll() {
        return utilizadorRepository.findAll().stream()
            .map(utilizadorMapper::toListedUserDto)
            .toList();
    }

    public ListedUserDto updateById(Long id, UpdateUserDto newData){
        Utilizador user = utilizadorRepository.findById(id).orElseThrow(()-> new RuntimeException("User not found"));
        user.setpNome(newData.pNome());
        user.setSbNome(newData.sbNome());
        user.setDataNascimento(newData.dataNascimento());
        utilizadorRepository.save(user);
        return utilizadorMapper.toListedUserDto(user);
    }

    public String changingPassword(Long id, ChangingPassRequestDto body){
        
        Utilizador user = utilizadorRepository.findById(id).orElseThrow(()-> new RuntimeException("User not found"));
        Boolean isPassRight = user.getPalavraPasseHash().equals(body.oldPassword()); //the user.getPalavraPasseHash will be decrypted when JWT is implemented
        if(isPassRight){
            user.setPalavraPasseHash(body.newPassword());
            utilizadorRepository.save(user);
            return "Palavra-passe mudada com sucesso";
        }else{
            return "Palavra-passe errada";
        }
        
    }

    public String removeUser(Long id){
        Utilizador user = utilizadorRepository.findById(id).orElseThrow(()-> new RuntimeException("User not found"));
        user.setRemovidoEm(LocalDateTime.now());
        utilizadorRepository.save(user);
        return user.getRemovidoEm() != null ? "User removed successfully" : "An error occurred while removing the user";
    }
    
    public void deleteById(Long id) {
        utilizadorRepository.deleteById(id);
    }
    
}