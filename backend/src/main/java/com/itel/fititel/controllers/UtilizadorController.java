package com.itel.fititel.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.itel.fititel.dtos.ChangingPassRequestDto;
import com.itel.fititel.dtos.ListedUserDto;
import com.itel.fititel.dtos.UpdateUserDto;
import com.itel.fititel.services.UtilizadorService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/utilizadores")
public class UtilizadorController {
    private final UtilizadorService utilizadorService;

    public UtilizadorController(UtilizadorService utilizadorService) {
        this.utilizadorService = utilizadorService;
    }

    @GetMapping
    public List<ListedUserDto> getAllUtilizadores() {
        return utilizadorService.findAll();
    }

    //While the JWT is missing 
    @GetMapping("/me/{id}")
    public ResponseEntity<?> getUtilizadorById(@PathVariable Long id) {
        try{
            ListedUserDto user = utilizadorService.findById(id);
            return new ResponseEntity<>(user, HttpStatus.OK);
        }catch(Exception e){
            HttpStatus status = e.getMessage().contains("User not found") ? HttpStatus.NOT_FOUND : HttpStatus.INTERNAL_SERVER_ERROR;
            return new ResponseEntity<>(e.getMessage(), status);
        }
    }

    //While the JWT is missing
    @PutMapping("/me/{id}")
    public ResponseEntity<?> updateUtilizadorById(@PathVariable Long id, @RequestBody UpdateUserDto newData) {
        try{
            ListedUserDto updatedUser = utilizadorService.updateById(id, newData);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        }catch(Exception e){
            HttpStatus status = e.getMessage().contains("User not found") ? HttpStatus.NOT_FOUND : HttpStatus.INTERNAL_SERVER_ERROR;
            return new ResponseEntity<>(e.getMessage(), status);
        }
        
    }

    @PatchMapping("/me/password/{id}")
    public ResponseEntity<String> changingPassword(@PathVariable Long id, @RequestBody ChangingPassRequestDto body){
        try{
            String response = utilizadorService.changingPassword(id, body);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch(Exception e){
            HttpStatus status = e.getMessage().contains("User not found") ? HttpStatus.NOT_FOUND : HttpStatus.INTERNAL_SERVER_ERROR;
            return new ResponseEntity<>(e.getMessage(), status);
        }
        
    }

    @DeleteMapping("/me/{id}")
    public ResponseEntity<String> removeUser(@PathVariable Long id){
        try{
            String response = utilizadorService.removeUser(id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch(Exception e){
            HttpStatus status = e.getMessage().contains("User not found") ? HttpStatus.NOT_FOUND : HttpStatus.INTERNAL_SERVER_ERROR;
            return new ResponseEntity<>(e.getMessage(), status);
        }
    }

    
}