package com.mhk.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.mhk.entity.Loan;
import com.mhk.exception.ResourceNotFoundException;
import com.mhk.repository.LoanRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminLoanService {

    private final LoanRepository loanRepository;

    public Loan markFineAsPaid(Long loanId) {

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Loan not found with id: " + loanId));

        if (loan.getFineAmount() == null
                || loan.getFineAmount().signum() <= 0) {

            throw new RuntimeException(
                    "No fine exists for this loan");
        }

        if (loan.isFinePaid()) {

            throw new RuntimeException(
                    "Fine is already marked as paid");
        }

        loan.setFinePaid(true);

        return loanRepository.save(loan);
    }

    public List<Loan> getLoansWithFines() {
        return loanRepository.findByFineAmountGreaterThan(BigDecimal.ZERO);
    }
}