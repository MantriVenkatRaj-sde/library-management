package com.MantriVenkatRaj.librarymanagement.Exception;

public class BookNotFoundException extends RuntimeException {
    public BookNotFoundException() {
        super("Book Doesn't Exist");
    }
}
