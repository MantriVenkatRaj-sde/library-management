package com.MantriVenkatRaj.librarymanagement.message.requests;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor(force = true)
@AllArgsConstructor

public class MessageCreateRequest {
    private final String clubname;
    private final String sendername;
    private final String content;
    /**
     * Small embedded class used for presence events where we need userId + clubId.
     * Re-uses the request shape for simplicity.
     */
    public static class PresenceRequest {
        private Long userId;
        private Long clubId;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public Long getClubId() { return clubId; }
        public void setClubId(Long clubId) { this.clubId = clubId; }
    }


}
