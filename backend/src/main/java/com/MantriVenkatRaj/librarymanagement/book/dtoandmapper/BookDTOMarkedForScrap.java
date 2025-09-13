package com.MantriVenkatRaj.librarymanagement.book.dtoandmapper;

import lombok.*;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookDTOMarkedForScrap {
    private String title;
    private String author;
    private String description;
    private String isbn;
    private Set<String> genres; // Names from frontend
}
