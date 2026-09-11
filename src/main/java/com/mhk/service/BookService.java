
package com.mhk.service;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.mhk.dto.BookRequestDTO;
import com.mhk.dto.BookResponseDTO;
import com.mhk.entity.Book;
import com.mhk.exception.ResourceConflictException;
import com.mhk.exception.ResourceNotFoundException;
import com.mhk.repository.BookRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    // ==============================
    // ADD BOOK
    // ==============================
    public BookResponseDTO addBook(BookRequestDTO dto) {

        // Check duplicate ISBN
        if (bookRepository.existsByIsbn(dto.getIsbn())) {

            throw new ResourceConflictException(
                    "A book with this ISBN already exists.");
        }

        Book book = Book.builder()
                .title(dto.getTitle())
                .author(dto.getAuthor())
                .isbn(dto.getIsbn())
                .category(dto.getCategory())
                .quantity(dto.getQuantity())
                .build();

        try {

            Book savedBook = bookRepository.save(book);

            return convertToDTO(savedBook);

        } catch (DataIntegrityViolationException ex) {

            throw new ResourceConflictException(
                    "A book with this ISBN already exists.");
        }
    }


    // ==============================
    // GET ALL BOOKS
    // ==============================
    public List<BookResponseDTO> getAllBooks() {

        return bookRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }


    // ==============================
    // SEARCH BY TITLE
    // ==============================
    public List<BookResponseDTO> searchByTitle(
            String title) {

        return bookRepository
                .findByTitleContainingIgnoreCase(title)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }


    // ==============================
    // SEARCH BY AUTHOR
    // ==============================
    public List<BookResponseDTO> searchByAuthor(
            String author) {

        return bookRepository
                .findByAuthorContainingIgnoreCase(author)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }


    // ==============================
    // SEARCH BY CATEGORY
    // ==============================
    public List<BookResponseDTO> searchByCategory(
            String category) {

        return bookRepository
                .findByCategoryContainingIgnoreCase(category)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }


    // ==============================
    // UPDATE BOOK
    // ==============================
    public BookResponseDTO updateBook(
            Long id,
            BookRequestDTO dto) {

        // Check whether book exists
        Book book = bookRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Book not found with id: " + id));

        // Check duplicate ISBN
        // Ignore the current book's own ISBN
        if (bookRepository.existsByIsbnAndIdNot(
                dto.getIsbn(), id)) {

            throw new ResourceConflictException(
                    "A book with this ISBN already exists.");
        }

        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setIsbn(dto.getIsbn());
        book.setCategory(dto.getCategory());
        book.setQuantity(dto.getQuantity());

        try {

            Book updatedBook =
                    bookRepository.save(book);

            return convertToDTO(updatedBook);

        } catch (DataIntegrityViolationException ex) {

            throw new ResourceConflictException(
                    "A book with this ISBN already exists.");
        }
    }


    // ==============================
    // DELETE BOOK
    // ==============================
    public void deleteBook(Long id) {

        // Check whether book exists
        Book book = bookRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Book not found with id: " + id));

        try {

            bookRepository.delete(book);

            // Force database operation
            bookRepository.flush();

        } catch (DataIntegrityViolationException ex) {

            throw new ResourceConflictException(
                    "Cannot delete this book because loan or booking history exists.");
        }
    }


    // ==============================
    // ENTITY → DTO
    // ==============================
    private BookResponseDTO convertToDTO(
            Book book) {

        return BookResponseDTO.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .isbn(book.getIsbn())
                .category(book.getCategory())
                .quantity(book.getQuantity())
                .build();
    }
}
