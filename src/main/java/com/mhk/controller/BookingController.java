package com.mhk.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // Create advance booking
    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(
            @Valid @RequestBody BookingRequestDTO dto) {

        return ResponseEntity.ok(
                bookingService.createBooking(dto));
    }

    // Get logged-in user's bookings
    @GetMapping("/my")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings() {

        return ResponseEntity.ok(
                bookingService.getMyBookings());
    }
}