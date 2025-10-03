package com.MantriVenkatRaj.librarymanagement.rating;

import com.MantriVenkatRaj.librarymanagement.book.Book;
import com.MantriVenkatRaj.librarymanagement.rating.dto.BookRatingDTO;
import com.MantriVenkatRaj.librarymanagement.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingsRepository extends JpaRepository<Rating,Long> {
    //To return all the Ratings of a book by a User
   Optional<Rating> findByUser_IdAndBook_Id(Long userId, Long bookId);

    List<Rating> findByUser_Id(Long userId);

    Optional<Rating> findByUser_IdAndBook_Isbn(Long userId, String isbn);

    Optional<Rating> findByUser_UsernameAndBook_Isbn(String username, String isbn);
    Optional<Rating> findByIdAndUser_UsernameAndBook_Isbn(Long ratingId,String username, String isbn);

    Optional<User> findByUser_Username(String username);

    Optional<Book> findByBook_Isbn(String bookIsbn);

    @Query("""
        SELECT new com.MantriVenkatRaj.librarymanagement.rating.dto.BookRatingDTO(
            r.id,
            r.rating,
            r.review,
            r.createdAt,
            r.updatedAt,
            r.user.id,
            r.user.username,
            r.book.id,
            r.book.isbn,
            r.book.title
        )
        FROM Rating r
        WHERE r.book.isbn = :isbn
        ORDER BY r.createdAt DESC
    """)
    Page<BookRatingDTO> findRatingsByBookIsbn(@Param("isbn") String isbn, Pageable pageable);
}

