package com.mhk.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mhk.dto.UserRegistrationDTO;
import com.mhk.dto.UserResponseDTO;
import com.mhk.entity.Role;
import com.mhk.entity.User;
import com.mhk.exception.ResourceConflictException;
import com.mhk.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponseDTO registerUser(
            UserRegistrationDTO dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {

            throw new ResourceConflictException(
                    "Email is already registered.");
        }

        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(
                        passwordEncoder.encode(
                                dto.getPassword()))
                .role(Role.USER)
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        return UserResponseDTO.builder()
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();
    }
}