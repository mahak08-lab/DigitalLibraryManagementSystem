package com.mhk.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mhk.entity.Booking;
import com.mhk.entity.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByBookIdAndStatusOrderByBookingDateAsc(
            Long bookId,
            BookingStatus status);

    Optional<Booking> findByUserIdAndBookIdAndStatus(
            Long userId,
            Long bookId,
            BookingStatus status);
}