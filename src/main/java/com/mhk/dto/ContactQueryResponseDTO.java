package com.mhk.dto;

import java.time.LocalDateTime;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactQueryResponseDTO {

    private Long id;

    private String name;

    private String email;

    private String subject;

    private String message;

    private LocalDateTime submittedAt;

    private boolean resolved;
}