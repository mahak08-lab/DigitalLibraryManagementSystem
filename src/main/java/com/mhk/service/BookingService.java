package com.mhk.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mhk.dto.BookingRequestDTO;
import com.mhk.dto.BookingResponseDTO;
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
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final LoanRepository loanRepository;

    // =========================
    // CREATE BOOKING
    // =========================
    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO dto) {

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

        // A booking is only allowed when the book is unavailable.
        if (book.getQuantity() > 0) {
            throw new RuntimeException(
                    "Book is currently available. You can issue it directly.");
        }

        // Check whether this user already has an active loan
        // for the same book.
        loanRepository
                .findByUserIdAndBookIdAndStatus(
                        user.getId(),
                        book.getId(),
                        LoanStatus.ISSUED)
                .ifPresent(existingLoan -> {
                    throw new RuntimeException(
                            "You already have this book issued.");
                });

        // Check duplicate waiting booking.
        bookingRepository
                .findByUserIdAndBookIdAndStatus(
                        user.getId(),
                        book.getId(),
                        BookingStatus.WAITING)
                .ifPresent(existingBooking -> {
                    throw new RuntimeException(
                            "You have already booked this book.");
                });

        Booking booking = Booking.builder()
                .user(user)
                .book(book)
                .bookingDate(LocalDateTime.now())
                .status(BookingStatus.WAITING)
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        return convertToDTO(savedBooking);
    }

    // =========================
    // GET MY BOOKINGS
    // =========================
    public List<BookingResponseDTO> getMyBookings() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email));

        return bookingRepository
                .findByUserId(user.getId())
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // =========================
    // ENTITY → DTO
    // =========================
    private BookingResponseDTO convertToDTO(Booking booking) {

        return BookingResponseDTO.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getName())
                .bookId(booking.getBook().getId())
                .bookTitle(booking.getBook().getTitle())
                .bookingDate(booking.getBookingDate())
                .status(booking.getStatus())
                .build();
    }
}