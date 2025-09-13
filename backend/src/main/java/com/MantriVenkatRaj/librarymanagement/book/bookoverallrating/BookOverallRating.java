package com.MantriVenkatRaj.librarymanagement.book.bookoverallrating;

import com.MantriVenkatRaj.librarymanagement.book.Book;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bookrating")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookOverallRating {
    @Id
    @SequenceGenerator(
            name = "bookrating_seq",
            sequenceName = "bookrating_seq",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "bookrating_seq"
    )
    private Long id;
    private double avgRating;
    private long ratingCount;
    @OneToOne
    @JoinColumn(name = "book_id",referencedColumnName = "id")
    @JsonIgnore
    private Book book;

    @JsonProperty("bookId")
    public Long getBookId() { return book == null ? null : book.getId(); }


}
