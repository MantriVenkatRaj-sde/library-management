package com.MantriVenkatRaj.librarymanagement.Exception;

public class NotAClubMemberException extends RuntimeException{
    public NotAClubMemberException() {
        super("Membership not found");
    }
}
