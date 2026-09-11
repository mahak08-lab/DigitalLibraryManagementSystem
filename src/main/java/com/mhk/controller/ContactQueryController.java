package com.mhk.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mhk.dto.ContactQueryRequestDTO;
import com.mhk.dto.ContactQueryResponseDTO;
import com.mhk.service.ContactQueryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactQueryController {

    private final ContactQueryService contactQueryService;

    // Submit a contact query
    @PostMapping
    public ResponseEntity<ContactQueryResponseDTO> submitQuery(
            @Valid @RequestBody ContactQueryRequestDTO dto) {

        ContactQueryResponseDTO response =
                contactQueryService.submitQuery(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Admin - View all contact queries
    @GetMapping
    public ResponseEntity<List<ContactQueryResponseDTO>> getAllQueries() {

        return ResponseEntity.ok(
                contactQueryService.getAllQueries());
    }

    // Admin - Mark query as resolved
    @PatchMapping("/{id}/resolve")
    public ResponseEntity<ContactQueryResponseDTO> markAsResolved(
            @PathVariable Long id) {

        ContactQueryResponseDTO response =
                contactQueryService.markAsResolved(id);

        return ResponseEntity.ok(response);
    }
}