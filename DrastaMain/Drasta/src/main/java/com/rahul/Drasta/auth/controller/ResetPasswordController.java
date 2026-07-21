package com.rahul.Drasta.auth.controller;

import com.rahul.Drasta.Dto.ResponseDto;
import com.rahul.Drasta.auth.model.User;
import com.rahul.Drasta.auth.service.EmailService;
import com.rahul.Drasta.auth.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Map;

@RestController
//@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class ResetPasswordController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EmailService emailService;

    // The reset token is passed as a query parameter
    @PostMapping("/reset-password")
    public ResponseEntity<ResponseDto> resetPassword(@RequestParam("token") String token,
                                                     @Valid @RequestBody Map<String, String> request) {
        // Expected JSON payload: newPassword, confirmPassword
        String newPassword = request.get("newPassword");
        String confirmPassword = request.get("confirmPassword");

        if (newPassword == null || confirmPassword == null) {
            return ResponseEntity.badRequest().body(new ResponseDto(false,"New password and confirm password are required.",null));
        }
        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(new ResponseDto(false,"Password must be at least 6 characters long.",null));
        }

        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body(new ResponseDto(false,"New password and confirm password do not match.",null));
        }

        // Debug: log the provided reset token
        System.out.println("Provided reset token: " + token);

        // Find the user by reset token
        User user = userService.findByResetToken(token);
        if (user == null) {
            return ResponseEntity.badRequest().body(new ResponseDto(false,"Invalid reset token.",null));
        }

        // Debug: log the stored reset token from user record
        System.out.println("Stored reset token for user (" + user.getEmail() + "): " + user.getResetToken());

        // Validate token expiry
        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().before(new Date())) {
            return ResponseEntity.badRequest().body(new ResponseDto(false,"Reset token has expired.",null));
        }

        // Update the user's password (encoded) and clear the reset token data
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userService.save(user);
        emailService.sendPasswordResetConfirmationEmail(user.getEmail(), user.getFullName());

        return new ResponseEntity<>(new ResponseDto(true,"Password changed successfully.",null), HttpStatus.OK);
    }
}
