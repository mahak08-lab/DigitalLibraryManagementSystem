package com.mhk.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mhk.dto.IssueBookRequestDTO;
import com.mhk.dto.LoanResponseDTO;
import com.mhk.service.LoanService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    // Issue a book
    @PostMapping("/issue")
    public ResponseEntity<LoanResponseDTO> issueBook(
            @Valid @RequestBody IssueBookRequestDTO dto) {

        LoanResponseDTO response =
                loanService.issueBook(dto);

        return ResponseEntity.ok(response);
    }

    // Return a book
    @PostMapping("/{loanId}/return")
    public ResponseEntity<LoanResponseDTO> returnBook(
            @PathVariable Long loanId) {

        LoanResponseDTO response =
                loanService.returnBook(loanId);

        return ResponseEntity.ok(response);
    }

    // Get current user's loans
    @GetMapping("/my")
    public ResponseEntity<List<LoanResponseDTO>> getMyLoans() {

        return ResponseEntity.ok(
                loanService.getMyLoans()
        );
    }

    // Admin: get all currently issued books
    @GetMapping("/issued")
    public ResponseEntity<List<LoanResponseDTO>> getAllIssuedBooks() {

        return ResponseEntity.ok(
                loanService.getAllIssuedBooks()
        );
    }
}