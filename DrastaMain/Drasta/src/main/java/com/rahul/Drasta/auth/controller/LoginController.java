package com.rahul.Drasta.auth.controller;

import com.rahul.Drasta.auth.dto.UserLoginDto;
import com.rahul.Drasta.auth.model.User;
import com.rahul.Drasta.auth.repository.UserRepository;
import com.rahul.Drasta.auth.service.EmailService;
import com.rahul.Drasta.auth.service.LoginAttemptService;
import com.rahul.Drasta.auth.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1")
public class LoginController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final LoginAttemptService loginAttemptService;
    private final EmailService emailService;


    @PostMapping("/login")
    public ResponseEntity<Map<String,Object>> login(@Valid @RequestBody UserLoginDto loginDto,
                                   BindingResult result,
                                   HttpServletRequest request,
                                   HttpServletResponse response) {

        // 🧪 Validate input
        if (result.hasErrors()) {
            List<String> errorMessages = result.getAllErrors()
                    .stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(Map.of("success",false,"message",errorMessages));
        }

        // 🔎 Fetch user
        User user = userRepository.findByEmail(loginDto.getEmail());

        System.out.println(" i m from user Id : "+user);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("success",false,"message","User not found"));
        }

        if (loginAttemptService.isBlocked(loginDto.getEmail())) {
            return ResponseEntity.status(429).body(Map.of("success",false,"message","Too many failed attempts. Try again later."));
        }

        // 🛡️ Check account status
        if (user.isBlocked()) {
            return ResponseEntity.status(403).body(Map.of("success",false,"message","Your account is blocked. Contact support."));
        }
        if (!user.isActive()) {
            return ResponseEntity.status(403).body(Map.of("success",false,"message","Your account is not active."));
        }

        // 🔑 Verify password
        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            loginAttemptService.loginFailed(user.getEmail());
            return ResponseEntity.badRequest().body(Map.of("success",false,"message","Invalid credentials"));
        }

        // ✅ Generate access + refresh tokens
        String accessToken = null;
        if (user.getRole().equalsIgnoreCase("VOLUNTEER")){
            accessToken = jwtUtil.generateToken(user.getEmail(), user.getUserId(), user.getRole());
            System.out.println(" i m from : volunteer : "+user.getUserId());
        }else {
            accessToken = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole());
        }

        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail()); // Optional: Add ID or role if needed

//        // 🍪 Set access token cookie (optional if client uses header instead)
//        Cookie accessCookie = new Cookie("_auth-token", accessToken);
//        accessCookie.setHttpOnly(true);
//        accessCookie.setSecure(true);
//        accessCookie.setPath("/");
//        accessCookie.setMaxAge(86400); // 1 day
//        accessCookie.setAttribute("SameSite", "None");
//
//        // 🍪 Set refresh token cookie
//        Cookie refreshCookie = new Cookie("refresh_token", refreshToken);
//        refreshCookie.setHttpOnly(true);
//        refreshCookie.setSecure(true);
//        refreshCookie.setPath("/api/v1/auth/refresh");
//        refreshCookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
//        refreshCookie.setAttribute("SameSite", "None");
//        response.addCookie(accessCookie);
//        response.addCookie(refreshCookie);

        response.addCookie(createCookie("_auth-token", accessToken, "/", 86400));
//        response.addCookie(createCookie("_auth-token", accessToken, "/", 60));
//        response.addCookie(createCookie("refresh_token", refreshToken, "/api/v1/auth/refresh", 300));
        response.addCookie(createCookie("refresh_token", refreshToken, "/api/v1/auth/refresh", 7 * 24 * 60 * 60));


        // 🧾 Return response with tokens and basic user info
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("status", "success");
        responseBody.put("message", "Login successful!");
        responseBody.put("accessToken", accessToken);
        responseBody.put("refreshToken", refreshToken);

        Map<String, Object> userData = new HashMap<>();
        userData.put("userId", user.getId());
        userData.put("fullName", user.getFullName());
        userData.put("role", user.getRole());

        responseBody.put("data", userData);

        loginAttemptService.loginSucceeded(user.getEmail());
//        emailService.sendLoginAlert(user.getEmail(), request.getRemoteAddr(), new Date());

//        emailService.sendLoginAlert(
//                user.getEmail(),
//                user.getFullName(),
//                request,
//                new Date()
//        );

        return ResponseEntity.ok(responseBody);
    }

    private Cookie createCookie(String name, String value, String path, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath(path);
        cookie.setMaxAge(maxAge);
        cookie.setAttribute("SameSite", "None");
        return cookie;
    }


    @GetMapping("/auth/me")
    public ResponseEntity<?> getLoggedInUser(@CookieValue(name = "_auth-token", required = false) String token) {
        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }

        String email = jwtUtil.extractUsername(token);
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not found"));
        }

        return ResponseEntity.ok(Map.of(
                "userId", user.getId(),
                "fullName", user.getFullName(),
                "email", user.getEmail(),
                "role", user.getRole()
        ));
    }



}
