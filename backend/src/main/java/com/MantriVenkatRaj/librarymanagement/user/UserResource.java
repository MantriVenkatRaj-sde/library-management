package com.MantriVenkatRaj.librarymanagement.user;

import com.MantriVenkatRaj.librarymanagement.book.dtoandmapper.BookListDTO;
import com.MantriVenkatRaj.librarymanagement.signup.SignUpRequest;
import com.MantriVenkatRaj.librarymanagement.signup.SignUpService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
//@RequestMapping("")
public class UserResource {
    private final UserService userService;


    public UserResource(UserService userService) {
        this.userService = userService;

    }
    @GetMapping("/users")
    public List<UserDTO> getAllUsers(){
        return userService.AllUsersToUserDTO();
    }
    @GetMapping("/{username}/readersList")
    public Set<BookListDTO> getReadersList(@PathVariable String username){
        return userService.getReadersList(username);
    }

}
