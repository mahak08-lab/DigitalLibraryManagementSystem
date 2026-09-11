package com.mhk.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mhk.dto.IssueBookRequestDTO;
import com.mhk.dto.LoanResponseDTO;
import com.mhk.entity.Book;
import com.mhk.entity.Booking;
import com.mhk.entity.BookingStatus;
import com.mhk.entity.Loan;
import com.mhk.entity.LoanStatus;
import com.mhk.entity.User;
import com.mhk.exception.ResourceNotFoundException;
import com.mhk.repository.BookRepository;
import com.mhk.repository.BookingRepository;
import com.mhk.repository.LoanRepository;
import com.mhk.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final BookingRepository bookingRepository;

    private static final int LOAN_DAYS = 14;
    private static final int FINE_PER_DAY = 5;

    // =========================
    // ISSUE BOOK
    // =========================
    @Transactional
    public LoanResponseDTO issueBook(IssueBookRequestDTO dto) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email));

        Book book = bookRepository.findById(dto.getBookId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Book not found with id: " + dto.getBookId()));

        if (book.getQuantity() <= 0) {
            throw new RuntimeException(
                    "Book is currently unavailable.");
        }

        Optional<Loan> existingLoan =
                loanRepository.findByUserIdAndBookIdAndStatus(
                        user.getId(),
                        book.getId(),
                        LoanStatus.ISSUED);

        if (existingLoan.isPresent()) {
            throw new RuntimeException(
                    "You have already issued this book.");
        }

        LocalDateTime issuedAt = LocalDateTime.now();
        LocalDateTime dueDate = issuedAt.plusDays(LOAN_DAYS);

        Loan loan = Loan.builder()
                .user(user)
                .book(book)
                .issuedAt(issuedAt)
                .dueDate(dueDate)
                .returnedAt(null)
                .fineAmount(BigDecimal.ZERO)
                .finePaid(false)
                .status(LoanStatus.ISSUED)
                .build();

        Loan savedLoan = loanRepository.save(loan);

        book.setQuantity(book.getQuantity() - 1);
        bookRepository.save(book);

        return convertToDTO(savedLoan);
    }

    // =========================
    // RETURN BOOK
    // =========================
    @Transactional
    public LoanResponseDTO returnBook(Long loanId) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email));

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Loan not found with id: " + loanId));

        if (!loan.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You are not authorized to return this book.");
        }

        if (loan.getStatus() == LoanStatus.RETURNED) {
            throw new RuntimeException(
                    "This book has already been returned.");
        }

        LocalDateTime returnedAt = LocalDateTime.now();

        loan.setReturnedAt(returnedAt);

        // =========================
        // CALCULATE OVERDUE DAYS
        // =========================
        long overdueDays = 0;

        if (returnedAt.isAfter(loan.getDueDate())) {

            overdueDays = ChronoUnit.DAYS.between(
                    loan.getDueDate().toLocalDate(),
                    returnedAt.toLocalDate());
        }

        // ₹5 per overdue day
        BigDecimal fine =
                BigDecimal.valueOf(overdueDays * FINE_PER_DAY);

        loan.setFineAmount(fine);

        if (fine.compareTo(BigDecimal.ZERO) == 0) {
            loan.setFinePaid(true);
        } else {
            loan.setFinePaid(false);
        }

        loan.setStatus(LoanStatus.RETURNED);

        Loan savedLoan = loanRepository.save(loan);

        // =========================
        // UPDATE BOOK QUANTITY
        // =========================
        Book book = loan.getBook();

        Optional<Booking> waitingBooking =
                bookingRepository
                        .findByBookIdAndStatusOrderByBookingDateAsc(
                                book.getId(),
                                BookingStatus.WAITING)
                        .stream()
                        .findFirst();

        if (waitingBooking.isPresent()) {

            Booking booking = waitingBooking.get();

            booking.setStatus(BookingStatus.FULFILLED);

            bookingRepository.save(booking);
        }

        // Returned copy becomes available again
        book.setQuantity(book.getQuantity() + 1);

        bookRepository.save(book);

        return convertToDTO(savedLoan);
    }

    // =========================
    // GET MY LOANS
    // =========================
    public List<LoanResponseDTO> getMyLoans() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email));

        return loanRepository
                .findByUserId(user.getId())
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // =========================
    // ADMIN - GET ALL ISSUED BOOKS
    // =========================
    public List<LoanResponseDTO> getAllIssuedBooks() {

        return loanRepository
                .findByStatus(LoanStatus.ISSUED)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // =========================
    // ENTITY → DTO
    // =========================
    private LoanResponseDTO convertToDTO(Loan loan) {

        return LoanResponseDTO.builder()
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
    }
}