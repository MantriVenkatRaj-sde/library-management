package com.MantriVenkatRaj.librarymanagement.Exception;

public class NotTheAdminException extends RuntimeException {
    public NotTheAdminException(){
        super("Non Admins are restricted from performing this operation");
    }
}
