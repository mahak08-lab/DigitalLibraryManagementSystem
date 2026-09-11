package com.mhk.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mhk.dto.BookRequestDTO;
import com.mhk.dto.BookResponseDTO;
import com.mhk.service.BookService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;


    // =========================
    // ADD BOOK
    // ADMIN ONLY
    // =========================

    @PostMapping
    public ResponseEntity<BookResponseDTO> addBook(
            @Valid @RequestBody BookRequestDTO dto) {

        BookResponseDTO response =
                bookService.addBook(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =========================
    // GET ALL BOOKS
    // =========================

    @GetMapping
    public ResponseEntity<List<BookResponseDTO>> getAllBooks() {

        return ResponseEntity.ok(
                bookService.getAllBooks());
    }


    // =========================
    // SEARCH BY TITLE
    // =========================

    @GetMapping("/search/title")
    public ResponseEntity<List<BookResponseDTO>> searchByTitle(
            @RequestParam String title) {

        return ResponseEntity.ok(
                bookService.searchByTitle(title));
    }


    // =========================
    // SEARCH BY AUTHOR
    // =========================

    @GetMapping("/search/author")
    public ResponseEntity<List<BookResponseDTO>> searchByAuthor(
            @RequestParam String author) {

        return ResponseEntity.ok(
                bookService.searchByAuthor(author));
    }


    // =========================
    // SEARCH BY CATEGORY
    // =========================

    @GetMapping("/search/category")
    public ResponseEntity<List<BookResponseDTO>> searchByCategory(
            @RequestParam String category) {

        return ResponseEntity.ok(
                bookService.searchByCategory(category));
    }


    // =========================
    // UPDATE BOOK
    // ADMIN ONLY
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<BookResponseDTO> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookRequestDTO dto) {

        return ResponseEntity.ok(
                bookService.updateBook(id, dto));
    }


    // =========================
    // DELETE BOOK
    // ADMIN ONLY
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(
            @PathVariable Long id) {

        bookService.deleteBook(id);

        return ResponseEntity.noContent().build();
    }
}