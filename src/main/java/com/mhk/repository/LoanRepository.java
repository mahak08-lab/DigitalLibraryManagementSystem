package com.mhk.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mhk.entity.Loan;
import com.mhk.entity.LoanStatus;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    Optional<Loan> findByUserIdAndBookIdAndStatus(
            Long userId,
            Long bookId,
            LoanStatus status
    );

    List<Loan> findByUserId(Long userId);

    List<Loan> findByStatus(LoanStatus status);

    List<Loan> findByFineAmountGreaterThan(BigDecimal amount);
}