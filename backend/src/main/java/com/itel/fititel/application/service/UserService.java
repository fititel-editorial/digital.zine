package com.itel.fititel.application.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.itel.fititel.domain.entity.User;
import com.itel.fititel.api.dto.ChangingPasswordRequest;
import com.itel.fititel.api.dto.UpdateRequest;
import com.itel.fititel.api.dto.UserResponse;
import com.itel.fititel.api.mapper.UserMapper;
import com.itel.fititel.domain.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse findByEmail(String email) {
        return UserMapper.toResponse(userRepository.findByEmailAndDeletedAtIsNull(email)
            .orElseThrow(()-> new RuntimeException("User not found")), List.of());
    }

    public UserResponse updateMe(String email, UpdateRequest updateRequest) {
        
        User user = userRepository.findByEmailAndDeletedAtIsNull(email).orElseThrow(()-> new RuntimeException("User not found"));
        user.setFirstName(updateRequest.firstName());
        user.setLastName(updateRequest.lastName());
        user.setDateOfBirth(updateRequest.dateOfBirth());
        user.setUpdatedAt(LocalDateTime.now());

        System.out.println(updateRequest.firstName());

        User savedUser = userRepository.save(user);
        
        return UserMapper.toResponse(savedUser, List.of());
    }

    public UserResponse ChangingPassword(String email, ChangingPasswordRequest changingPasswordRequest) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(email).orElseThrow(()-> new RuntimeException("User not found"));
        if(!passwordEncoder.matches(changingPasswordRequest.oldPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Old password does not match");
        }
        String encodedPassword = passwordEncoder.encode(changingPasswordRequest.newPassword());
        
        user.setPasswordHash(encodedPassword);
        user.setUpdatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);
        return UserMapper.toResponse(savedUser, List.of());
    }

    public void removeUser(String email) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(email).orElseThrow(()-> new RuntimeException("User not found"));
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }
}
