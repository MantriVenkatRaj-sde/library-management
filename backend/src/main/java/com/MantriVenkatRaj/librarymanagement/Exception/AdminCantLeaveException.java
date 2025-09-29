package com.MantriVenkatRaj.librarymanagement.Exception;

public class AdminCantLeaveException extends RuntimeException {
    public AdminCantLeaveException(){
        super("Admins can't leave the group. Must Delete the group");
    }
}
