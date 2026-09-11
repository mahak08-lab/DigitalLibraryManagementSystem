package com.mhk.dto;

import java.time.LocalDateTime;

import com.mhk.entity.BookingStatus;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponseDTO {

    private Long id;

    private Long userId;
    private String userName;

    private Long bookId;
    private String bookTitle;

    private LocalDateTime bookingDate;

    private BookingStatus status;
}