package com.MantriVenkatRaj.librarymanagement.rating.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookRatingDTO {
    private Long id;

    private Integer rating;
    private String review;
    private Instant createdAt;
    private Instant updatedAt;

    private Long userId;
    private String username;
    private Long bookId;
    private String bookIsbn;
    private String bookTitle;
}
