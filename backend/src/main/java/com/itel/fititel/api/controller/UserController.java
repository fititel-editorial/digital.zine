package com.itel.fititel.api.controller;

import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;

import com.itel.fititel.application.service.UserService;
import com.itel.fititel.api.dto.ChangingPasswordRequest;
import com.itel.fititel.api.dto.UpdateRequest;
import com.itel.fititel.api.dto.UserResponse;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@AuthenticationPrincipal UserDetails user) {
        try{
            UserResponse userResponse = userService.findByEmail(user.getUsername());
            return ResponseEntity.status(HttpStatus.OK).body(userResponse);
        } catch (Exception e) {
            HttpStatus status = e.getMessage().contains("User not found")?HttpStatus.NOT_FOUND:HttpStatus.INTERNAL_SERVER_ERROR;
            return ResponseEntity.status(status).body(e.getMessage().contains("User not found")?"User not found":"Something went wrong");
        }
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMe(@AuthenticationPrincipal UserDetails user, @RequestBody UpdateRequest userRequest) {
        try {
            UserResponse userResponse = userService.updateMe(user.getUsername(), userRequest);
            return ResponseEntity.status(HttpStatus.OK).body(userResponse);
        } catch (Exception e) {
            HttpStatus status = e.getMessage().contains("User not found")?HttpStatus.NOT_FOUND:HttpStatus.INTERNAL_SERVER_ERROR;
            return ResponseEntity.status(status).body(e.getMessage().contains("User not found")?"User not found":"Something went wrong");
        }
    }

    @PatchMapping("/me/password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal UserDetails user, @RequestBody ChangingPasswordRequest changingPasswordRequest) {
        try {
            UserResponse userResponse = userService.ChangingPassword(user.getUsername(), changingPasswordRequest);
            return ResponseEntity.status(HttpStatus.OK).body(userResponse);
        } catch (Exception e) {
            HttpStatus status = e.getMessage().contains("User not found")?HttpStatus.NOT_FOUND:e.getMessage().contains("Old password does not match")?HttpStatus.BAD_REQUEST:HttpStatus.INTERNAL_SERVER_ERROR;
            return ResponseEntity.status(status).body(e.getMessage().contains("User not found")?"User not found":e.getMessage().contains("Old password does not match")?"Old password does not match":"Something went wrong");
        }
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteMe(@AuthenticationPrincipal UserDetails user) {
        try {
            userService.removeUser(user.getUsername());
            return ResponseEntity.status(HttpStatus.OK).body("User removed successfully");
        } catch (Exception e) {
            HttpStatus status = e.getMessage().contains("User not found")?HttpStatus.NOT_FOUND:HttpStatus.INTERNAL_SERVER_ERROR;
            return ResponseEntity.status(status).body(e.getMessage().contains("User not found")?"User not found":"Something went wrong");
        }
    }
}
