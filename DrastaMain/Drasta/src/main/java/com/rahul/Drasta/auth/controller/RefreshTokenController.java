package com.rahul.Drasta.auth.controller;

import com.rahul.Drasta.auth.config.TokenBlacklist;
import com.rahul.Drasta.auth.service.CustomUserDetailsService;
import com.rahul.Drasta.auth.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class RefreshTokenController {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;
    private final TokenBlacklist tokenBlacklist;

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {

        String refreshToken = extractRefreshToken(request);

        System.out.println(" i m from refressToken : "+refreshToken);

        // 🔐 1. Validate token existence
        if (refreshToken == null) {
            clearAuthCookies(response);
            return ResponseEntity.status(401).body(Map.of("success","false","error", "Refresh token missing"));
        }

        // 🚫 2. Check blacklist
        if (tokenBlacklist.isBlacklisted(refreshToken)) {
            clearAuthCookies(response);
            return ResponseEntity.status(403).body(Map.of("success","false","error", "Refresh token is blacklisted"));
        }

        // ⛔ 3. Check expiration or invalid signature
        if (!jwtUtil.validateToken(refreshToken)) {
            clearAuthCookies(response);
            return ResponseEntity.status(401).body(Map.of("success","false","error", "Invalid or expired refresh token"));
        }

        // ✅ 4. All good, generate new tokens
        String email = jwtUtil.extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String newAccessToken = jwtUtil.generateToken(
                userDetails.getUsername(),
                "optional-user-id",
                userDetails.getAuthorities().stream().findFirst().get().getAuthority().replace("ROLE_", "")
        );
        String newRefreshToken = jwtUtil.generateRefreshToken(email);

        // 🍪 Set new tokens
        setTokenCookies(newAccessToken, newRefreshToken, response);

        // Example controller return
        return ResponseEntity.ok(Map.of(
                "success","true",
                "accessToken", newAccessToken,
                "refreshToken", refreshToken,
                "message", "Access token refreshed successfully!"
        ));

    }




    private String extractRefreshToken(HttpServletRequest request) {

        System.out.println(" req : "+request);
        // Fallback: Header
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
//            System.out.println(" i m from refress header : "+header);
            return header.substring(7);
        }

        // From Cookie
        if (request.getCookies() != null) {
            return Arrays.stream(request.getCookies())
                    .filter(cookie -> "refresh_token".equals(cookie.getName()))
                    .findFirst()
                    .map(Cookie::getValue)
                    .orElse(null);
        }

        return null;
    }

    private void clearAuthCookies(HttpServletResponse response) {
        Cookie authCookie = new Cookie("_auth-token", null);
        authCookie.setPath("/");
        authCookie.setHttpOnly(true);
        authCookie.setSecure(true);
        authCookie.setMaxAge(0);
        authCookie.setAttribute("SameSite", "None");

        Cookie refreshCookie = new Cookie("refresh_token", null);
        refreshCookie.setPath("/api/v1/auth/refresh");
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true);
        refreshCookie.setMaxAge(0);
        refreshCookie.setAttribute("SameSite", "None");

        response.addCookie(authCookie);
        response.addCookie(refreshCookie);
    }

    private void setTokenCookies(String accessToken, String refreshToken, HttpServletResponse response) {
        // 🍪 Access Token Cookie
        Cookie accessCookie = new Cookie("_auth-token", accessToken);
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(true); // Requires HTTPS
        accessCookie.setPath("/");
        accessCookie.setMaxAge(24 * 60 * 60); // 1 day
        accessCookie.setAttribute("SameSite", "None"); // Required for cross-site

        // 🍪 Refresh Token Cookie
        Cookie refreshCookie = new Cookie("refresh_token", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true);
        refreshCookie.setPath("/api/v1/auth/refresh"); // Scoped only to refresh endpoint
        refreshCookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
        refreshCookie.setAttribute("SameSite", "None");

        // Add cookies to response
        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);
    }


}
