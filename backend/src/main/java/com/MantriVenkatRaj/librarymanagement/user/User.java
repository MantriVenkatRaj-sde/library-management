package com.MantriVenkatRaj.librarymanagement.user;

import com.MantriVenkatRaj.librarymanagement.book.Book;
import com.MantriVenkatRaj.librarymanagement.bookclub.entities.ClubMember;
import com.MantriVenkatRaj.librarymanagement.rating.Rating;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.*;

@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_users_username", columnNames = "username"),
                @UniqueConstraint(name = "uk_users_email", columnNames = "email")
        }
)
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Builder.Default
    private boolean enabled = true;

    @NotBlank(message = "Please provide a username")
    @Column(nullable = false, length = 50)
    private String username;

    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Column(nullable = false)
    private String password;

    @Email
    @NotBlank
    @Column(nullable = false, length = 255)
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    @Column(length = 20)
    private String phone;

    @Column(length = 500)
    private String address;

    @Min(0) @Max(150)
    private int age;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    // Ratings given by the user
    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Rating> ratings = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private Instant createdAt;

    // If you want a generic "updated at", keep this.
    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    // If you want "last login", manage this manually in auth logic (no annotation):
    // private Instant lastLogin;

    // Book club memberships
    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ClubMember> memberships = new HashSet<>();

    // User's reading list / favorites
    @Builder.Default
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_readers_list",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "book_id")
    )
    private Set<Book> readersList = new HashSet<>();

    //User's Liked Books
    @Builder.Default
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_liked_books",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "book_id")
    )
    private Set<Book> readersLikedBooks = new HashSet<>();

    // --- Helper methods ---

    public void addMembership(ClubMember m) {
        memberships.add(m);
        m.setUser(this);
    }

    public void removeMembership(ClubMember m) {
        memberships.remove(m);
        m.setUser(null);
    }

    public void addToReadersList(Book book) {
        readersList.add(book);
        // If Book also keeps a reverse relation, set it there as well.
    }

    public void removeFromReadersList(Book book) {
        readersList.remove(book);
    }

    public void addRating(Rating rating) {
        ratings.add(rating);
        rating.setUser(this);
    }

    public void removeRating(Rating rating) {
        ratings.remove(rating);
        rating.setUser(null);
    }

    public enum Role {
        USER, ADMIN
    }
}
