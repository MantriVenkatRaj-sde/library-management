package com.MantriVenkatRaj.librarymanagement.rating;

import com.MantriVenkatRaj.librarymanagement.book.BookService;
import com.MantriVenkatRaj.librarymanagement.rating.dto.BookRatingDTO;
import com.MantriVenkatRaj.librarymanagement.rating.dto.RatingRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RatingsResource {
    private final BookService bookService;
    private final RatingsService ratingsService;

    public RatingsResource(BookService bookService, RatingsService ratingsService) {
        this.bookService = bookService;
        this.ratingsService = ratingsService;
    }

    //Get all the ratings ever rated by the user
    @GetMapping("/users/{username}/ratings")
    public List<BookRatingDTO> getAllRatingsbyUser(@PathVariable String username){
        return ratingsService.getRatingsByUser(username);
    }

    //Get all the ratings of a particular book
    @GetMapping("/books/{book_isbn}/ratings")
    public List<BookRatingDTO> getAllRatingsOfaBook(@PathVariable String book_isbn){
        return ratingsService.getRatingsOfaBook(book_isbn);
    }
    //Get All Ratings
    @GetMapping("/books/ratings")
    public List<BookRatingDTO> getAllRatings(){
        return ratingsService.getAllRatings();
    }

    //Add a rating to a book
    @PostMapping("/users/{username}/books/{isbn}/add-rating")
    public String RateTheBook(@PathVariable String isbn,
                              @PathVariable String username,
                              @RequestBody RatingRequest ratingRequest){
        ratingsService.RateABook(isbn,username,ratingRequest);
        return "Rating added";
    }

    @PutMapping("users/{username}/books/{isbn}/update-rating")
    public ResponseEntity<String> UpdateTheRatingOfTheBook(@PathVariable String isbn,
                                                           @PathVariable String username,
                                                           @RequestBody RatingRequest ratingRequest){
        ratingsService.UpdateTheRatingOfTheBook(isbn,username,ratingRequest);
        return ResponseEntity.ok("Rating updated");
    }

    @DeleteMapping("users/{username}/{isbn}/ratings/{ratingId}/delete")
    public ResponseEntity<String> DeleteTheRatingOfTheBook(@PathVariable String isbn,@PathVariable String username,@PathVariable Long ratingId){

        ratingsService.DeleteTheRatingOfTheBook(isbn,username,ratingId);
        return ResponseEntity.ok("Rating Deleted");
    }

}
