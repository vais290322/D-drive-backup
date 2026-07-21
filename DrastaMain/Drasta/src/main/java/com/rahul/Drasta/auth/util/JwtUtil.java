package com.rahul.Drasta.auth.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {

    private static final long ACCESS_TOKEN_EXPIRATION = 24 * 60 * 60 * 1000; // 1 day
//    private static final long ACCESS_TOKEN_EXPIRATION = 60 * 1000; // 1 min
    private static final long REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 days
//    private static final long REFRESH_TOKEN_EXPIRATION = 60 * 5 * 1000; // 5 minute

    @Value("${JWT_SECRET_KEY:}")
    private String jwtSecretKey;
    private SecretKey secretKey;
    @PostConstruct
    public void init() {
        if (jwtSecretKey == null || jwtSecretKey.isEmpty()) {
            System.out.println("Warning: JWT_SECRET_KEY not set, using random key (dev only)");
            secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
        } else {
            secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecretKey));
        }
    }
//    public JwtUtil() {
//        String keyString = System.getenv("JWT_SECRET_KEY");
//        if (keyString == null || keyString.isEmpty()) {
//            System.out.println("Warning: JWT_SECRET_KEY not set, using random key (development only)");
//            secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
//        } else {
//            byte[] keyBytes = Decoders.BASE64.decode(keyString);
//            secretKey = Keys.hmacShaKeyFor(keyBytes);
//        }
//    }

    public String generateToken(String email, String id, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("id", id)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    public boolean validateToken(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }


    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Returns the expiration date of the token
    public Date getExpirationDate(String token) {
        return getClaims(token).getExpiration();
    }

    // Checks whether the token is expired
    public boolean isTokenExpired(String token) {
        try {
            Date expiration = getExpirationDate(token);
            return expiration.before(new Date());
        } catch (Exception e) {
            return true; // If parsing fails, treat as expired
        }
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}
