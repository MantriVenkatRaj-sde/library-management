package com.MantriVenkatRaj.librarymanagement.book.dtoandmapper;


import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class BookListDTO {
    private Long id;
    private String isbn;
    private String title;
    private String author;
    private String imageLink;      // from metaData
    private Double avgRating;      // from bookRating
    private Long ratingCount;
}
