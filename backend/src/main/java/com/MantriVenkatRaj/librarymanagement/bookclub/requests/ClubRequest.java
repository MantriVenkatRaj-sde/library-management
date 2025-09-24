package com.MantriVenkatRaj.librarymanagement.bookclub.requests;

import com.MantriVenkatRaj.librarymanagement.bookclub.enums.Visibility;
import com.MantriVenkatRaj.librarymanagement.user.User;

public record ClubRequest(String name, String description, Visibility visibility, String admin){}
