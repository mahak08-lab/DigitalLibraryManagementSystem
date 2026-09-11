package com.mhk.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookResponseDTO {

    private Long id;

    private String title;

    private String author;

    private String isbn;

    private String category;

    private Integer quantity;
}