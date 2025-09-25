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
    @Getter
    @Setter
    public static class PresenceRequest {
        private String username;
        private String clubname;
    }


}
