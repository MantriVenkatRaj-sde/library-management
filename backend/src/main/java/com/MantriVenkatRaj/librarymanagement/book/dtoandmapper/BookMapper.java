package com.MantriVenkatRaj.librarymanagement.book.dtoandmapper;


import com.MantriVenkatRaj.librarymanagement.book.Book;
import com.MantriVenkatRaj.librarymanagement.genre.Genre;
import com.MantriVenkatRaj.librarymanagement.genre.GenreRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class BookMapper {

    private final GenreRepository genreRepository;

    public BookMapper(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    public Book toEntity(BookComponentDTO dto) {
        Set<Genre> genreSet = new HashSet<>();
        for (String genreName : dto.getGenres()) {
            Genre genre = genreRepository.findByName(genreName)
                    .orElseThrow(() -> new RuntimeException("Genre not found: " + genreName));
            genreSet.add(genre);
        }

        return Book.builder()
                .title(dto.getTitle())
                .author(dto.getAuthor())
                .description(dto.getDescription())
                .isbn(dto.getIsbn())
                .genres(genreSet)
                .build();
    }
}
