package com.MantriVenkatRaj.librarymanagement.book;

import com.MantriVenkatRaj.librarymanagement.book.bookmedia.BookMedia;
import com.MantriVenkatRaj.librarymanagement.book.bookoverallrating.BookOverallRating;
import com.MantriVenkatRaj.librarymanagement.genre.Genre;
import com.MantriVenkatRaj.librarymanagement.rating.Rating;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "books",
        indexes = {
                @Index(name = "ix_books_title", columnList = "title"),
                @Index(name = "ix_books_author", columnList = "author")
        })
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private String title;

    private String series;

    @NotBlank
    private String author;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(unique = true, nullable = false, length = 32)
    private String isbn;

    private String language;

    private Integer numOfPages;

    // Many-to-Many with genres
    @Builder.Default
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "book_genres",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private Set<Genre> genres = new HashSet<>();

    // Inverse side: owning side must be in BookMedia with @JoinColumn(book_id)
    @OneToOne(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private BookMedia bookMedia;

    // One book → many ratings
    @Builder.Default
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> ratings = new ArrayList<>();

    // Inverse side: owning side must be in BookOverallRating with @JoinColumn(book_id)
    @OneToOne(mappedBy = "book", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private BookOverallRating bookOverallRating;

    // --- Helper methods to keep both sides in sync ---

    public void setBookMedia(BookMedia media) {
        if (this.bookMedia != null) this.bookMedia.setBook(null);
        this.bookMedia = media;
        if (media != null) media.setBook(this);
    }

    public void setBookOverallRating(BookOverallRating overall) {
        if (this.bookOverallRating != null) this.bookOverallRating.setBook(null);
        this.bookOverallRating = overall;
        if (overall != null) overall.setBook(this);
    }

    public void addRating(Rating rating) {
        ratings.add(rating);
        rating.setBook(this);
    }

    public void removeRating(Rating rating) {
        ratings.remove(rating);
        rating.setBook(null);
    }

    public void addGenre(Genre g) {
        genres.add(g);
        // If Genre has the reverse @ManyToMany(mappedBy="genres"), update it there as well.
        // g.getBooks().add(this);
    }

    public void removeGenre(Genre g) {
        genres.remove(g);
        // If reverse side exists:
        // g.getBooks().remove(this);
    }
}
