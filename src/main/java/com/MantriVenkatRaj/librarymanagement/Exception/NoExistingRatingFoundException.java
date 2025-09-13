package com.MantriVenkatRaj.librarymanagement.Exception;

public class NoExistingRatingFoundException extends RuntimeException{
    public NoExistingRatingFoundException() {
        super("No Existing Rating found");
    }
}
