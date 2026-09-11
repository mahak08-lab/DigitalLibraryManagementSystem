package com.mhk.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mhk.dto.LoginRequestDTO;
import com.mhk.dto.LoginResponseDTO;
import com.mhk.dto.UserRegistrationDTO;
import com.mhk.dto.UserResponseDTO;
import com.mhk.service.LoginService;
import com.mhk.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final LoginService loginService;

    // USER REGISTRATION
    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(
            @Valid @RequestBody UserRegistrationDTO dto) {

        UserResponseDTO response = userService.registerUser(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // USER LOGIN
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> loginUser(
            @Valid @RequestBody LoginRequestDTO dto) {

        LoginResponseDTO response = loginService.login(dto);

        return ResponseEntity.ok(response);
    }
}