package com.MantriVenkatRaj.librarymanagement.genre;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class GenreResource {
    private  final GenreService genreService;

    public GenreResource(GenreService genreService) {
        this.genreService = genreService;

    }

    @GetMapping("/genres")
    public List<String> getAllGenres(){
        return genreService.getAllGenres();
    }
}
