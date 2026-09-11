package com.mhk.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.mhk.dto.ContactQueryRequestDTO;
import com.mhk.dto.ContactQueryResponseDTO;
import com.mhk.entity.ContactQuery;
import com.mhk.exception.ResourceNotFoundException;
import com.mhk.repository.ContactQueryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContactQueryService {

    private final ContactQueryRepository contactQueryRepository;

    public ContactQueryResponseDTO submitQuery(
            ContactQueryRequestDTO dto) {

        ContactQuery query = ContactQuery.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .subject(dto.getSubject())
                .message(dto.getMessage())
                .submittedAt(LocalDateTime.now())
                .resolved(false)
                .build();

        ContactQuery savedQuery =
                contactQueryRepository.save(query);

        return convertToDTO(savedQuery);
    }

    public List<ContactQueryResponseDTO> getAllQueries() {

        return contactQueryRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public ContactQueryResponseDTO markAsResolved(Long id) {

        ContactQuery query =
                contactQueryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contact query not found with id: " + id));

        if (query.isResolved()) {
            throw new RuntimeException(
                    "Contact query is already resolved.");
        }

        query.setResolved(true);

        ContactQuery updatedQuery =
                contactQueryRepository.save(query);

        return convertToDTO(updatedQuery);
    }

    private ContactQueryResponseDTO convertToDTO(
            ContactQuery query) {

        return ContactQueryResponseDTO.builder()
                .id(query.getId())
                .name(query.getName())
                .email(query.getEmail())
                .subject(query.getSubject())
                .message(query.getMessage())
                .submittedAt(query.getSubmittedAt())
                .resolved(query.isResolved())
                .build();
    }
}