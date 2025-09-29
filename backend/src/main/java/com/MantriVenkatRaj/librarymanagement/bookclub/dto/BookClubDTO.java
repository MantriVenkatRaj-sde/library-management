package com.MantriVenkatRaj.librarymanagement.bookclub.dto;

import com.MantriVenkatRaj.librarymanagement.bookclub.enums.Visibility;
import lombok.*;

import java.time.Instant;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookClubDTO {
    private Long id;
    private String name;
    private String description;
    private String admin;
    private Visibility visibility;
    private Instant createdAt;
    private boolean isMember;
    private Long numOfMembers;
    private Instant lastMessageAt;
}
