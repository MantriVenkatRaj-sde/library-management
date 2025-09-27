package com.MantriVenkatRaj.librarymanagement.book;

import com.MantriVenkatRaj.librarymanagement.book.dtoandmapper.BookComponentDTO;
import com.MantriVenkatRaj.librarymanagement.book.dtoandmapper.BookDTOMarkedForScrap;
import com.MantriVenkatRaj.librarymanagement.book.dtoandmapper.BookListDTO;
import com.MantriVenkatRaj.librarymanagement.rating.Rating;
import com.MantriVenkatRaj.librarymanagement.rating.dto.BookRatingDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class BookResource {

    private final BookService bookService;


    public BookResource(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/all-books")
    public List<BookListDTO> getAllBooks(){
        return bookService.getAllBooksHomePageDTO();
    }
    @PostMapping("/add-new-book")
    public String addNewBookToLibrary(@Valid @RequestBody BookDTOMarkedForScrap bookDTO){
        bookService.addNewBookToLibrary(bookDTO);
        return "Book was added to the Library successfully !";
    }
//    @GetMapping("/by-author/{author}")
//    public List<Book> findByAuthor(@PathVariable String author){
//        return bookService.findByAuthorContainingIgnoreCase(author);
//    }
//
//    @GetMapping("/by-title/{title}")
//    public List<Book> findByBookTitle(@PathVariable String title){
//        return bookService.findByTitleContainingIgnoreCase(title);
//    }
//
//    @GetMapping("/by-genre/{genre}")
//    public List<Book> findByGenre(@PathVariable String genre){
//        return bookService.findByGenreName(genre);
//    }

    @GetMapping("/book/{isbn}")
    public BookComponentDTO findBookByIsbn(@PathVariable String isbn){
       return  bookService.findBookByIsbn(isbn);
    }
    @GetMapping("/{genre}/books")
    public List<BookListDTO> findBooksByGenres(@PathVariable String genre){
        return bookService.findBooksByGenres(genre);
    }
    @GetMapping("/books/search/{q}")
    public List<BookListDTO> searchQuery(@PathVariable String q){
        return bookService.searchQuery(q);
    }

    @GetMapping("/book/{isbn}/ratings")
    public ResponseEntity<List<BookRatingDTO>> getBookRatings(@PathVariable String isbn){
        return ResponseEntity.ok(bookService.getRatings(isbn));
    }
}
