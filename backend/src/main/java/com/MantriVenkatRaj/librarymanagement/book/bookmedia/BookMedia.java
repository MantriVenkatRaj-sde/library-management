//package com.MantriVenkatRaj.librarymanagement.book.bookmedia;
//
//import com.MantriVenkatRaj.librarymanagement.book.Book;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//@Builder
//@Entity
//@Table(name = "BooksMetaData")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class BookMedia {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private long id;
//    private String imageLink;
//    private String publisher;
//    private String publishedYear;
//    private float price;
//    private int numOfRatings;
//    private float likePercent;
//    private float rating;
//
//    @OneToOne
//    @JoinColumn(name = "book_id")
//    private Book book;
//}
///*bookId', 'title', 'series', 'author', 'rating', 'description',
//       'language', 'isbn', 'genres', 'bookFormat', 'pages', 'publisher',
//       'publishDate', 'numRatings', 'ratingsByStars', 'likedPercent',
//       'coverImg','price'*/

package com.MantriVenkatRaj.librarymanagement.book.bookmedia;

import com.MantriVenkatRaj.librarymanagement.book.Book;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Builder
@Entity
@Table(name = "books_meta_data") // match your DB table name (case-insensitive in many DBs)
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class BookMedia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String imageLink;
    private String publisher;
    private String publishedYear;
    // prefer BigDecimal for money, but kept your float if you want:
    private Float price;
    private Long numOfRatings;
    private Float likePercent;
    private Float rating;

    // setter for owning-side
    // Owning side: this table stores the book_id FK
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", referencedColumnName = "id")
    @JsonIgnore                    // <<-- prevents recursion Book -> BookMedia -> Book -> ...
    private Book book;

    // expose bookId to JSON so clients can still see the relation
    @JsonProperty("bookId")
    public Long getBookId() {
        return book == null ? null : book.getId();
    }
}
