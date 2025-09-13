package com.MantriVenkatRaj.librarymanagement.signup;

import jakarta.validation.constraints.*;

public record SignUpRequest(

        @NotBlank(message = "Username is required")
        String username,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters long")
        String password,

        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        String email,

        @NotBlank(message = "Phone is required")
        @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
        String phone,
        @PositiveOrZero(message = "Your age is mentioned")
        int age,
        @NotBlank(message = "Address is required")
        String address
) {}
