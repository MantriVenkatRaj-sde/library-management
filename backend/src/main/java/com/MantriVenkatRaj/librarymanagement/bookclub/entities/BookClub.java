package com.MantriVenkatRaj.librarymanagement.bookclub.entities;

import com.MantriVenkatRaj.librarymanagement.bookclub.enums.Visibility;
import com.MantriVenkatRaj.librarymanagement.message.entities.Message;
import com.MantriVenkatRaj.librarymanagement.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "book_club")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(onlyExplicitlyIncluded = true)
public class BookClub {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Book club name is required")
    @Column(nullable = false,unique = true)
    private String name;

    @NotBlank(message = "Add a description about this club")
    @Column(nullable = false, columnDefinition = "text")
    private String description;

    /**
     * Owner / admin of the club. Many clubs can be owned by a single user.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private User admin;


    @Column(name = "visibility", nullable = false)
    @Enumerated(EnumType.STRING)
    private Visibility visibility;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    /**
     * Members of this club. mappedBy = "club" in ClubMember.
     * LAZY fetch to avoid loading on every club fetch.
     */
    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ClubMember> members = new ArrayList<>();

    /**
     * Messages in the club. mappedBy = "club" in Message.
     */
    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Message> messages = new ArrayList<>();

    public void addMember(ClubMember m) {
        members.add(m);
        m.setClub(this);
    }

    public void removeMember(ClubMember m) {
        members.remove(m);
        m.setClub(null);
    }
}
