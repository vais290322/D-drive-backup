package com.rahul.Drasta.auth.dto;

import com.rahul.Drasta.auth.validation.PasswordMatches;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
@PasswordMatches
public class UserRegistrationDto {

    private String id;

    @NotEmpty(message = "Full name is required")
    private String fullName;

    @NotEmpty(message = "Email is required")
    @Email(message = "Please provide a valid email")
    private String email;

    @NotEmpty(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid phone number")
    private String phoneNumber;

    @NotEmpty(message = "Password is required")
    private String password;

    @NotEmpty(message = "Confirm Password is required")
    private String confirmPassword;

//    @NotEmpty(message = "Role is required")
//    @Pattern(regexp = "ROLE_ADMIN|ROLE_CUSTOMER|ROLE_STAFF|ROLE_VENDOR",
//            message = "Role must be one of ROLE_ADMIN, ROLE_CUSTOMER, ROLE_STAFF, or ROLE_VENDOR")
    private String role;

}
