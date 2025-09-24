package com.MantriVenkatRaj.librarymanagement.message.entities;

import com.MantriVenkatRaj.librarymanagement.bookclub.entities.BookClub;
import com.MantriVenkatRaj.librarymanagement.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "message", indexes = {
        @Index(name = "idx_message_club_sentat", columnList = "club_id, sent_at"),
        @Index(name = "idx_messages_club_id", columnList = "club_id, id")
})
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(onlyExplicitlyIncluded = true)
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Who sent it
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    /**
     * Club where the message belongs. Nullable only if you later support private messages.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id", nullable = false)
    private BookClub club;

    @NotBlank
    @Column(nullable = false, columnDefinition = "text")
    private String content;

    /**
     * Message timestamp
     */
    @CreationTimestamp
    @Column(name = "sent_at", nullable = false, updatable = false)
    private Instant sentAt;
}
