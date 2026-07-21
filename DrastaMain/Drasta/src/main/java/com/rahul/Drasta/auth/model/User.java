package com.rahul.Drasta.auth.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "auth-users")
public class User {

        @Id
        private String id;

        @NotEmpty(message = "Full name is required")
        private String fullName;

        @NotEmpty(message = "Email is required")
        @Email(message = "Please provide a valid email")
//        @Pattern(regexp = "^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$",message = )
        private String email;

        @NotEmpty(message = "Phone number is required")
        @Pattern(regexp = "^\\+?[0-9]\\d{10,15}$", message = "Invalid phone number")
        private String phoneNumber;

        @NotEmpty(message = "Password is required")
        private String password;

        private String userId;

        //@NotEmpty(message = "Role is required")
        private String role;

    private boolean active = true; // true if account is active
    private boolean blocked = false;

    ///for forget password
    private String resetToken;
    private Date resetTokenExpiry;

    ///for refresh token
    private String refreshToken;
    private Date refreshTokenExpiry;

    private String createdBy;

}
