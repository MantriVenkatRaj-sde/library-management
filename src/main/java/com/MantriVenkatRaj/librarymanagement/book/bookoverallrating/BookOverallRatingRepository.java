package com.MantriVenkatRaj.librarymanagement.book.bookoverallrating;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BookOverallRatingRepository extends JpaRepository<BookOverallRating,Long> {
    Optional<BookOverallRating> findByBook_Isbn(String isbn);

    // useful for locking to avoid race conditions
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM BookOverallRating b WHERE b.book.isbn = :isbn")
    Optional<BookOverallRating> findByBookIsbnForUpdate(@Param("isbn") String isbn);
}
