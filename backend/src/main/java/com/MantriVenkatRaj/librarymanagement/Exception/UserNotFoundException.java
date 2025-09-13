package com.MantriVenkatRaj.librarymanagement.Exception;

public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException() {
        super("User not found");
    }
}
