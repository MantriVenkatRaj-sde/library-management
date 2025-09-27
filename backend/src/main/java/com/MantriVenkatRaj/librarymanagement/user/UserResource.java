package com.MantriVenkatRaj.librarymanagement.user;

import com.MantriVenkatRaj.librarymanagement.book.dtoandmapper.BookListDTO;
import com.MantriVenkatRaj.librarymanagement.signup.SignUpRequest;
import com.MantriVenkatRaj.librarymanagement.signup.SignUpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
public class UserResource {
    private final UserService userService;


    public UserResource(UserService userService) {
        this.userService = userService;

    }
    @GetMapping("/users")
    public List<UserDTO> getAllUsers(){
        return userService.AllUsersToUserDTO();
    }

    @GetMapping("/users/{username}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String username){
        return ResponseEntity.ok(userService.getUser(username));
    }

    @GetMapping("/{username}/readersList")
    public Set<BookListDTO> getReadersList(@PathVariable String username){
        return userService.getReadersList(username);
    }
    @PostMapping("/user/{username}/book/{isbn}/likeBook")
    public ResponseEntity<String> likeBook(@PathVariable String username,@PathVariable String isbn){
        return userService.likeBook(username,isbn);
    }

    @DeleteMapping("/user/{username}/book/{isbn}/unlikeBook")
    public ResponseEntity<String> unlikeBook(@PathVariable String username,@PathVariable String isbn){
        return userService.unlikeBook(username,isbn);
    }
    @GetMapping("/user/{username}/liked")
    public ResponseEntity<Set<BookListDTO>> getLikedBooks(@PathVariable String username){
        return userService.getLikedBooks(username);
    }
    @GetMapping("user/{username}/{isbn}/isLiked")
    public ResponseEntity<Boolean> isLiked(@PathVariable String username,@PathVariable String isbn){
        return ResponseEntity.ok(userService.isLiked(username,isbn));
    }

    @GetMapping("user/{username}/{isbn}/isSaved")
    public ResponseEntity<Boolean> isSaved(@PathVariable String username,@PathVariable String isbn){
        return ResponseEntity.ok(userService.isSaved(username,isbn));
    }


}
