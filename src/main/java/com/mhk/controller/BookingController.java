package com.mhk.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mhk.dto.BookingRequestDTO;
import com.mhk.dto.BookingResponseDTO;
import com.mhk.service.BookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

private final BookingService bookingService;


// =========================================================
// USER - CREATE ADVANCE BOOKING
// =========================================================

@PostMapping
public ResponseEntity<BookingResponseDTO> createBooking(
        @Valid @RequestBody BookingRequestDTO dto) {

    return ResponseEntity.ok(
            bookingService.createBooking(dto)
    );
}


// =========================================================
// USER - GET MY BOOKINGS
// =========================================================

@GetMapping("/my")
public ResponseEntity<List<BookingResponseDTO>> getMyBookings() {

    return ResponseEntity.ok(
            bookingService.getMyBookings()
    );
}


// =========================================================
// ADMIN - GET ALL BOOKINGS
// =========================================================

@GetMapping
public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {

    return ResponseEntity.ok(
            bookingService.getAllBookings()
    );
}


}
