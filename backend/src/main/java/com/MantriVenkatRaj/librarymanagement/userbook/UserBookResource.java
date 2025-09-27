package com.MantriVenkatRaj.librarymanagement.userbook;

import com.MantriVenkatRaj.librarymanagement.book.Book;
import com.MantriVenkatRaj.librarymanagement.user.UserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserBookResource {
    private final UserBookService userBookService;
    public UserBookResource(UserBookService userBookService) {
        this.userBookService = userBookService;
    }
    //To get Users Read list
    @GetMapping("/users/{username}/library")
    public List<Book> getUsersLibrary(@PathVariable String username){
        return userBookService.getUserBooksList(username);
    }
    // All the Readers of a book
    @GetMapping("/admins/{username}/{title}/users")
    public List<UserDTO> getUsersReadingSameBook(@PathVariable String username, @PathVariable String title){
        return userBookService.getUsersListReadingTheSameBook(title);
    }

    //Adding a book to a user's Read list using bookId
    @PostMapping("/users/{username}/books/id/{bookId}")
    public ResponseEntity<String> addBookToReadListById(@PathVariable String username,@PathVariable long bookId){
        userBookService.addNewUserBookById(username,bookId);
        return ResponseEntity.ok("Book was added to User's Read List");
    }
    //Adding a book to a user's Read list using isbn
    @PostMapping("/users/{username}/books/isbn/{isbn}")
    public ResponseEntity<String> addBookToReadListByIsbn(@PathVariable String username, @PathVariable String isbn) {
        userBookService.addNewUserBookByIsbn(username, isbn);
        return ResponseEntity.ok("Book was added to User's Read List");
    }
    @PutMapping("/users/{username}/books/isbn/{isbn}/{readStatus}")
    public ResponseEntity<Object> updateBookReadingStatus(@PathVariable String username, @PathVariable String isbn, @PathVariable String readStatus){
        UserBook.ReadStatus status;
        try {
            status = UserBook.ReadStatus.fromString(readStatus); // helper shown below
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }

        if (status == UserBook.ReadStatus.Abandoned) {
            // abandon -> delete record (single-step)
            userBookService.abandonAndDelete(username, isbn);
            return ResponseEntity.noContent().build(); // 204
        } else {
            // normal status update (Reading / Completed / Readlist etc.)
            userBookService.updateBookReadingStatus(username, isbn, readStatus);
            return ResponseEntity.ok().build(); // 200
        }
    }


}
