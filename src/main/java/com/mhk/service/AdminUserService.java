package com.mhk.service;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.mhk.dto.UserResponseDTO;
import com.mhk.entity.Loan;
import com.mhk.entity.User;
import com.mhk.exception.ResourceConflictException;
import com.mhk.exception.ResourceNotFoundException;
import com.mhk.repository.LoanRepository;
import com.mhk.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final LoanRepository loanRepository;

    // =========================
    // GET ALL USERS
    // =========================
    public List<UserResponseDTO> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // =========================
    // GET USER BY ID
    // =========================
    public UserResponseDTO getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + id));

        return convertToDTO(user);
    }

    // =========================
    // DELETE USER
    // =========================
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + id));

        // Check whether user has loan history
        List<Loan> loans = loanRepository.findByUserId(id);

        if (!loans.isEmpty()) {
            throw new ResourceConflictException(
                    "Cannot delete this member because loan history exists.");
        }

        try {

            userRepository.delete(user);
            userRepository.flush();

        } catch (DataIntegrityViolationException ex) {

            throw new ResourceConflictException(
                    "Cannot delete this member because related records exist.");
        }
    }

    // =========================
    // ENTITY → DTO
    // =========================
    private UserResponseDTO convertToDTO(User user) {

        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}