package com.mhk.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mhk.dto.LoanResponseDTO;
import com.mhk.entity.Loan;
import com.mhk.service.AdminLoanService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/loans")
@RequiredArgsConstructor
public class AdminLoanController {

    private final AdminLoanService adminLoanService;

    @GetMapping("/fines")
    public ResponseEntity<List<LoanResponseDTO>> getLoansWithFines() {

        List<Loan> loans = adminLoanService.getLoansWithFines();

        List<LoanResponseDTO> response = loans.stream()
                .map(loan -> LoanResponseDTO.builder()
                        .id(loan.getId())
                        .userId(loan.getUser().getId())
                        .userName(loan.getUser().getName())
                        .bookId(loan.getBook().getId())
                        .bookTitle(loan.getBook().getTitle())
                        .issuedAt(loan.getIssuedAt())
                        .dueDate(loan.getDueDate())
                        .returnedAt(loan.getReturnedAt())
                        .fineAmount(
                                loan.getFineAmount() == null
                                        ? BigDecimal.ZERO
                                        : loan.getFineAmount())
                        .finePaid(loan.isFinePaid())
                        .status(loan.getStatus())
                        .build())
                .toList();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{loanId}/pay-fine")
    public ResponseEntity<LoanResponseDTO> markFineAsPaid(
            @PathVariable Long loanId) {

        Loan loan = adminLoanService.markFineAsPaid(loanId);

        LoanResponseDTO response = LoanResponseDTO.builder()
                .id(loan.getId())
                .userId(loan.getUser().getId())
                .userName(loan.getUser().getName())
                .bookId(loan.getBook().getId())
                .bookTitle(loan.getBook().getTitle())
                .issuedAt(loan.getIssuedAt())
                .dueDate(loan.getDueDate())
                .returnedAt(loan.getReturnedAt())
                .fineAmount(loan.getFineAmount())
                .finePaid(loan.isFinePaid())
                .status(loan.getStatus())
                .build();

        return ResponseEntity.ok(response);
    }
}