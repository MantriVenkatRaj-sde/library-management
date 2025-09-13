package com.MantriVenkatRaj.librarymanagement.book.bookoverallrating;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookOverallRatingDTO {
    private String isbn;
    private String title;
    private Double avgRating;
    private Long ratingCount;
}
