package com.MantriVenkatRaj.librarymanagement.user;

import com.MantriVenkatRaj.librarymanagement.signup.SignUpRequest;
import com.MantriVenkatRaj.librarymanagement.signup.SignUpService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

}
