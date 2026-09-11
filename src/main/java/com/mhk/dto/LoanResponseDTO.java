package com.mhk.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.mhk.entity.LoanStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanResponseDTO {

    private Long id;

    private Long userId;
    private String userName;

    private Long bookId;
    private String bookTitle;

    private LocalDateTime issuedAt;
    private LocalDateTime dueDate;
    private LocalDateTime returnedAt;

    private BigDecimal fineAmount;
    private boolean finePaid;

    private LoanStatus status;
}