package com.MantriVenkatRaj.librarymanagement.Exception;

public class ClubNotFoundException extends RuntimeException{
    public ClubNotFoundException() {
        super("Club not found");
    }
}
