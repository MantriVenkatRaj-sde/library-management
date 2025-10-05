package com.MantriVenkatRaj.librarymanagement.book;

import com.MantriVenkatRaj.librarymanagement.book.dtoandmapper.BookComponentDTO;
import com.MantriVenkatRaj.librarymanagement.book.dtoandmapper.BookListDTO;
import com.MantriVenkatRaj.librarymanagement.rating.Rating;
import com.MantriVenkatRaj.librarymanagement.rating.dto.BookRatingDTO;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
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
    public List<BookListDTO> getBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return bookService.getBooks(page, size).getContent();
    }
    @PostMapping("/add-new-book")
    public String addNewBookToLibrary(@Valid @RequestBody BookComponentDTO bookDTO){
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
    public ResponseEntity<Page<BookListDTO>> findBooksByGenres(@PathVariable String genre,
                                               @RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "50") int size){
        return ResponseEntity.ok(bookService.findBooksByGenres(genre,page,size));
    }

    @GetMapping("/books/search/{q}")
    public Page<BookListDTO> searchQuery(
            @PathVariable String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    )
    {
        return bookService.searchQuery(q, page, size);
    }

    @GetMapping("/book/{isbn}/ratings")
    public ResponseEntity<List<BookRatingDTO>> getBookRatings(@PathVariable String isbn){
        return ResponseEntity.ok(bookService.getRatings(isbn));
    }
}
