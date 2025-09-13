package com.MantriVenkatRaj.librarymanagement.book;

import com.MantriVenkatRaj.librarymanagement.book.dtoandmapper.BookListDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

    //Find by Username
    List<Book> findByTitleContainingIgnoreCase(String title);

    //Find by Author
    List<Book> findByAuthorContainingIgnoreCase(String author);

    //Find by Publishers
    List<Book> findByBookMedia_Publisher(String publisher);

    //Find by Publication Years
    List<Book> findByBookMedia_PublishedYear(String publishedYear);

    //Find by Price
    List<Book> findByBookMedia_Price(int price);

    //Find by Ratings
    List<Book> findByBookMedia_Rating(float rating);

    //Find by Like Percent
    List<Book> findByBookMedia_LikePercent(float percent);

    //Find a book by isbn
    Optional<Book> findByIsbn(String isbn);

    //Filter by Genre
    @Query("SELECT b FROM Book b JOIN b.genres g WHERE LOWER(g.name) = LOWER(:genreName)")
    List<Book> findByGenreName(String genreName);


    @Query("SELECT DISTINCT b FROM Book b " +
            "LEFT JOIN FETCH b.bookMedia md " +
            "LEFT JOIN FETCH b.bookOverallRating br")
    List<Book> findAllWithMediaAndRating();

    @Query("SELECT DISTINCT b FROM Book b " +
            "LEFT JOIN FETCH b.bookMedia md " +
            "LEFT JOIN FETCH b.bookOverallRating br " +
            "WHERE b.isbn = :isbn")
    Optional<Book> findIsbnBookWithMediaAndRating(@Param("isbn") String isbn);

//    @Query("SELECT DISTINCT b FROM Book b JOIN b.genres g WHERE g.id = :genreId")
//    List<Book> findBooksByGenreId(@Param("genreId") Long genreId);

    @Query("""
      SELECT DISTINCT NEW com.MantriVenkatRaj.librarymanagement.book.dtoandmapper.BookListDTO(
        b.id, b.isbn, b.title, b.author,
        bm.imageLink,
        bor.avgRating, bor.ratingCount
      )
      FROM Book b
      JOIN b.genres g
      LEFT JOIN b.bookMedia bm
      LEFT JOIN b.bookOverallRating bor
      WHERE g.id = :genreId
    """)
    List<BookListDTO> findBookListDTOsByGenreId(@Param("genreId") Long genreId);

    @Query("""
      SELECT DISTINCT NEW com.MantriVenkatRaj.librarymanagement.book.dtoandmapper.BookListDTO(
        b.id, b.isbn, b.title, b.author,
        bm.imageLink,
        bor.avgRating, bor.ratingCount
      )
      FROM Book b
      JOIN b.genres g
      LEFT JOIN b.bookMedia bm
      LEFT JOIN b.bookOverallRating bor
       WHERE LOWER(b.author) LIKE :pattern ESCAPE '!'
    """)
    List<BookListDTO> findBooksByAuthorLike(@Param("pattern") String pattern);

    @Query("""
      SELECT DISTINCT NEW com.MantriVenkatRaj.librarymanagement.book.dtoandmapper.BookListDTO(
        b.id, b.isbn, b.title, b.author,
        bm.imageLink,
        bor.avgRating, bor.ratingCount
      )
      FROM Book b
      JOIN b.genres g
      LEFT JOIN b.bookMedia bm
      LEFT JOIN b.bookOverallRating bor
      WHERE LOWER(b.title) LIKE :pattern ESCAPE '!'
    """)
    List<BookListDTO> findBooksByTitleLike(@Param("pattern") String pattern);










}
