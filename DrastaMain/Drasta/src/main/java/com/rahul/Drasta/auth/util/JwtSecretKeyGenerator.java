package com.rahul.Drasta.auth.util;


import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

public class JwtSecretKeyGenerator {
    public static void main(String[] args) {
        // Generate a secret key for HS512 (512 bits = 64 bytes)
        SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS512);

        // Convert the key to a Base64-encoded string
        String base64Key = Encoders.BASE64.encode(key.getEncoded());
        System.out.println("Your secret key: " + base64Key);
    }
}

