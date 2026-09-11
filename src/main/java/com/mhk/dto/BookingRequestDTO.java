package com.mhk.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingRequestDTO {

    @NotNull(message = "Book ID is required")
    private Long bookId;
}