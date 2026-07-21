package com.rahul.Drasta.auth.controller;

import com.rahul.Drasta.Dto.ResponseDto;
import com.rahul.Drasta.auth.model.User;
import com.rahul.Drasta.auth.service.EmailService;
import com.rahul.Drasta.auth.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Calendar;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class ForgotPasswordController {

    private final UserService userService;
    private final EmailService emailService;

    @Value("${app.frontend.reset-url}")
    public String resetBaseUrl;

    public ForgotPasswordController(UserService userService, EmailService emailService) {
        this.userService = userService;
        this.emailService = emailService;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ResponseDto> forgotPassword(@RequestBody @Valid Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    new ResponseDto(false, "Email is required", null)
            );
        }

        User user = userService.findByEmail(email);

        // Always respond the same to prevent info disclosure
        if (user == null) {
            return ResponseEntity.ok(
                    new ResponseDto(true, "If your email is registered, password reset instructions will be sent.", null)
            );
        }

        // Generate token and expiry
        String resetToken = UUID.randomUUID().toString();
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.HOUR, 1); // Token valid for 1 hour

        user.setResetToken(resetToken);
        user.setResetTokenExpiry(cal.getTime());
        userService.save(user);

        // Construct the reset link
        String resetLink = resetBaseUrl + resetToken;

        // Send the email
        emailService.sendResetPasswordHtmlEmail(user.getEmail(), user.getFullName(), resetLink);

        return ResponseEntity.ok(
                new ResponseDto(true, "If your email is registered, password reset instructions will be sent.", null)
        );
    }
}
