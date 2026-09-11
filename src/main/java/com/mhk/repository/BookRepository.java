package com.mhk.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mhk.entity.Book;

public interface BookRepository
        extends JpaRepository<Book, Long> {

    List<Book> findByTitleContainingIgnoreCase(
            String title);

    List<Book> findByAuthorContainingIgnoreCase(
            String author);

    List<Book> findByCategoryContainingIgnoreCase(
            String category);

    boolean existsByIsbn(String isbn);

    boolean existsByIsbnAndIdNot(
            String isbn,
            Long id);
}