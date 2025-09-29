package com.MantriVenkatRaj.librarymanagement.bookclub.entities;

import com.MantriVenkatRaj.librarymanagement.bookclub.enums.MembershipRole;
import com.MantriVenkatRaj.librarymanagement.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Entity
@Table(name = "club_member",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"club_id", "user_id"})})
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(onlyExplicitlyIncluded = true)
public class ClubMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Many ClubMembers belong to one club.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private BookClub club;

    /**
     * Many ClubMembers belong to one User.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @CreationTimestamp
    @Column(name = "joined_at", nullable = false, updatable = false)
    private Instant joinedAt;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private MembershipRole role = MembershipRole.MEMBER;

    private Long lastReadMessageId;


}
