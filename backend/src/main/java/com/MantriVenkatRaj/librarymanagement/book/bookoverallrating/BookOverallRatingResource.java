package com.MantriVenkatRaj.librarymanagement.book.bookoverallrating;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class BookOverallRatingResource {
    private final BookOverallRatingService bookRatingService;

    public BookOverallRatingResource(BookOverallRatingService bookRatingService) {
        this.bookRatingService = bookRatingService;
    }

    @GetMapping("/books/overall-rating")
    public List<BookOverallRatingDTO> getBooksOverallRating(){
        return  bookRatingService.getBooksOverallRatings();
    }


}
