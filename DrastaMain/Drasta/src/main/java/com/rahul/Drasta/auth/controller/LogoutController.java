package com.rahul.Drasta.auth.controller;

import com.rahul.Drasta.auth.config.TokenBlacklist;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class LogoutController {

    private final TokenBlacklist tokenBlacklist;

//    @PostMapping("/logout")
//    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
//
//        String token = extractTokenFromRequest(request);
//
//        // 🔒 Add token to blacklist if valid
//        if (token != null) {
//            tokenBlacklist.blacklistToken(token);
//        }
//
//        // 🍪 Clear auth token cookie
//        Cookie authCookie = new Cookie("_auth-token", null);
//        authCookie.setHttpOnly(true);
//        authCookie.setSecure(true);
//        authCookie.setPath("/");
//        authCookie.setMaxAge(0);
//        authCookie.setAttribute("SameSite", "None");
//        response.addCookie(authCookie);
//
//        // 🍪 Clear refresh token cookie
//        Cookie refreshCookie = new Cookie("refresh_token", null);
//        refreshCookie.setHttpOnly(true);
//        refreshCookie.setSecure(true);
//        refreshCookie.setPath("/api/v1/auth/refresh");
//        refreshCookie.setMaxAge(0);
//        refreshCookie.setAttribute("SameSite", "None");
//        response.addCookie(refreshCookie);
//
//        return ResponseEntity.ok(Collections.singletonMap("message", "Logged out successfully"));
//    }
//
    private String extractTokenFromRequest(HttpServletRequest request) {
        // From Authorization header
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }

        // From cookie
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("_auth-token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        return null;
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        String token = extractTokenFromRequest(request);

        if (token != null && !token.isBlank()) {
            tokenBlacklist.blacklistToken(token);
        }

        invalidateCookie("_auth-token", "/", response);
        invalidateCookie("refresh_token", "/api/v1/auth/refresh", response);

        return ResponseEntity.ok(Collections.singletonMap("message", "Logged out successfully"));
    }

    private void invalidateCookie(String name, String path, HttpServletResponse response) {
        Cookie cookie = new Cookie(name, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath(path);
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", "None");
        response.addCookie(cookie);
    }

}
