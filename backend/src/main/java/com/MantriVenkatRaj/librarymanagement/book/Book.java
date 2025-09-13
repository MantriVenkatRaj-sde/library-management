//package com.MantriVenkatRaj.librarymanagement.book;
//
//import com.MantriVenkatRaj.librarymanagement.book.bookmedia.BookMedia;
//import com.MantriVenkatRaj.librarymanagement.book.bookoverallrating.BookOverallRating;
//import com.MantriVenkatRaj.librarymanagement.genre.Genre;
//import com.MantriVenkatRaj.librarymanagement.rating.Rating;
//import jakarta.persistence.*;
//import jakarta.validation.constraints.NotBlank;
//import lombok.*;
//
//import java.util.ArrayList;
//import java.util.HashSet;
//import java.util.List;
//import java.util.Set;
//
//@Entity
//@Table(name = "books")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class Book {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false)
//    private String title;
//    private String series;
//    @NotBlank
//    private String author;
//    @NotBlank
//    @Column(columnDefinition = "TEXT")
//    private String description;
//    @Column(unique = true, nullable = false)
//    private String isbn;
//    private String language;
//    private Integer numOfPages;
//
//
//    // Many-to-Many with genres
//    @ManyToMany
//    @JoinTable(
//            name = "book_genres",
//            joinColumns = @JoinColumn(name = "book_id"),
//            inverseJoinColumns = @JoinColumn(name = "genre_id")
//    )
//    @Singular
//    private Set<Genre> genres = new HashSet<>();
//
//    @OneToOne(mappedBy = "book", cascade = CascadeType.ALL)
//    private BookMedia bookMedia;
//
//    // One book → many ratings
//    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Rating> ratings = new ArrayList<>();
//
//    @OneToOne(mappedBy = "book", cascade = CascadeType.ALL)
//    private BookOverallRating bookRating;
//}
package com.MantriVenkatRaj.librarymanagement.book;

import com.MantriVenkatRaj.librarymanagement.book.bookmedia.BookMedia;
import com.MantriVenkatRaj.librarymanagement.book.bookoverallrating.BookOverallRating;
import com.MantriVenkatRaj.librarymanagement.genre.Genre;
import com.MantriVenkatRaj.librarymanagement.rating.Rating;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;
    private String series;
    @NotBlank
    private String author;
    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(unique = true, nullable = false)
    private String isbn;
    private String language;
    private Integer numOfPages;

    // Many-to-Many with genres
    @ManyToMany
    @JoinTable(
            name = "book_genres",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    @Singular
    private Set<Genre> genres = new HashSet<>();

    // inverse side of the one-to-one:
    // mappedBy points to the field name in BookMedia
    @OneToOne(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private BookMedia bookMedia;

    // One book → many ratings
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> ratings = new ArrayList<>();

    @OneToOne(mappedBy = "book", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private BookOverallRating bookOverallRating;

    // Helper to keep both sides in sync
    public void setBookMedia(BookMedia media) {
        // detach old
        if (this.bookMedia != null) {
            this.bookMedia.setBook(null);
        }
        this.bookMedia = media;
        if (media != null) {
            media.setBook(this);
        }
    }
}
