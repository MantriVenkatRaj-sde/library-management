package com.MantriVenkatRaj.librarymanagement.bookclub.dto;

import com.MantriVenkatRaj.librarymanagement.bookclub.enums.MembershipRole;
import lombok.*;

import java.time.Instant;

@Builder
@Data
@AllArgsConstructor
public class MembershipDTO {
    private Long id;
    private Long userId;
    private String username;
    private Long clubId;
    private String clubName;
    private MembershipRole role;
    private Instant joinedAt;
}

