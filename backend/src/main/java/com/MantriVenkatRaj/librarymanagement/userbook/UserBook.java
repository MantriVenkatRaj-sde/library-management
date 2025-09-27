package com.MantriVenkatRaj.librarymanagement.userbook;

import com.MantriVenkatRaj.librarymanagement.book.Book;
import com.MantriVenkatRaj.librarymanagement.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Builder
@Entity
@Table(name = "UserBook")
@Data
@NoArgsConstructor
@AllArgsConstructor
//This is a class for keeping a track of ---Which user has which book in his/her library
public class UserBook {
    public UserBook(User user, Book book, ReadStatus role) {
        this.user = user;
        this.book = book;
        this.status = role;
    }
    @Id
    @SequenceGenerator(
            name = "userbook_seq",
            sequenceName = "userbook_seq",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "userbook_seq"
    )
    private Long id;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id")
    @JsonIgnore
    private Book book;

    @Enumerated(EnumType.STRING)
    private ReadStatus status;

    @JsonProperty("bookId")
    public Long getBookId() { return book == null ? null : book.getId(); }


    public enum ReadStatus {
        Reading,
        Readlist,
        Completed,
        Abandoned;
        public static ReadStatus fromString(String s) {
            if (s == null) throw new IllegalArgumentException("status must not be null");
            String trimmed = s.trim();
            for (ReadStatus rs : ReadStatus.values()) {
                if (rs.name().equalsIgnoreCase(trimmed)) return rs;
            }
            throw new IllegalArgumentException("Invalid ReadStatus: " + s);
        }
    }

}
