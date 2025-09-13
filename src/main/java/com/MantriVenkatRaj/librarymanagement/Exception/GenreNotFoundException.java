package com.MantriVenkatRaj.librarymanagement.Exception;

public class GenreNotFoundException extends RuntimeException {
    public GenreNotFoundException() {
        super("Genre Doesn't Exist");
    }
}
