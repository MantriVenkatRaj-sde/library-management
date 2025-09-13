package com.MantriVenkatRaj.librarymanagement.book.dtoandmapper;

import com.MantriVenkatRaj.librarymanagement.genre.Genre;
import lombok.*;

import java.util.Set;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookComponentDTO {
    private Long id;
    private String isbn;
    private String title;
    private String author;
    private String imageLink;
    private Double avgRating;
    private Long ratingCount;
    private String description;
    private String publisher;
    private String publishedYear;
    private float likePercent;
    private Set<String> genres;
}
