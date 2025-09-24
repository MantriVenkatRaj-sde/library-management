package com.MantriVenkatRaj.librarymanagement.message.dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
@Builder
@Setter
@Getter
public class MessageDTO {
        private Long id;
        private String clubname;
        private String sendername;
        private String content;
        private Instant sentAt;
}
