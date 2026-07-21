package com.rahul.springBootAuth.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Base64;
import java.util.zip.GZIPInputStream;
import java.util.zip.Inflater;
import java.util.zip.InflaterInputStream;


// Improved version of MargDecryptor with multiple decoding strategies and debug logs
public class MargDecryptor {

    public static String decrypt(String encrypted, String apiPassword) throws Exception {
        if (encrypted == null || encrypted.isEmpty()) {
            throw new IllegalArgumentException("Encrypted text is null/empty");
        }

        // 🔑 Clean: remove quotes if API wrapped ciphertext in JSON string
        encrypted = encrypted.trim();
        if (encrypted.startsWith("\"") && encrypted.endsWith("\"")) {
            encrypted = encrypted.substring(1, encrypted.length() - 1);
        }

        // 🔑 Prepare AES key/IV (16 bytes, same as C# DLL)
        byte[] pwdBytes = apiPassword.getBytes(StandardCharsets.UTF_8);
        byte[] keyBytes = new byte[16];
        int len = Math.min(pwdBytes.length, keyBytes.length);
        System.arraycopy(pwdBytes, 0, keyBytes, 0, len);



        SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");
        IvParameterSpec ivSpec = new IvParameterSpec(keyBytes);

        // 🔑 Decode ciphertext (try Base64 → Base64 URL → Hex)
        byte[] encryptedBytes = tryDecode(encrypted);

        // 🔍 Debug logs
        System.out.println("👉 Decrypting input: " + encrypted);
        System.out.println("👉 Decoded length = " + encryptedBytes.length);
        System.out.println("👉 First bytes (hex) = " + bytesToHex(Arrays.copyOf(encryptedBytes, Math.min(16, encryptedBytes.length))));

        if (encryptedBytes.length % 16 != 0) {
            System.out.println("⚠️ Skipping AES: trying compression fallback");
            String decompressed = tryDecompress(encryptedBytes);
            if (decompressed != null) return decompressed;
            return new String(encryptedBytes, StandardCharsets.UTF_8);
        }


        // 🔑 AES decrypt (CBC/PKCS5Padding)
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);
        byte[] decryptedBytes = cipher.doFinal(encryptedBytes);

        String decryptedText = new String(decryptedBytes, StandardCharsets.UTF_8).trim();

        // ✅ If decrypted is already JSON, return it
        if (decryptedText.startsWith("{") || decryptedText.startsWith("[")) {
            return decryptedText;
        }

        // ✅ Otherwise, try decompress (zlib / deflate / gzip)
        byte[] compressedBytes;
        try {
            compressedBytes = Base64.getDecoder().decode(decryptedText);
        } catch (IllegalArgumentException iae) {
            return decryptedText; // Not Base64 → return raw
        }

        try { return decompressWithInflater(compressedBytes, false); } catch (Exception ignore) {}
        try { return decompressWithInflater(compressedBytes, true); } catch (Exception ignore) {}
        try { return decompressWithGzip(compressedBytes); } catch (Exception ignore) {}

        return decryptedText;
    }

    // 🔧 Try multiple decoding strategies
    private static byte[] tryDecode(String encrypted) {
        // 1) Normal Base64
        try {
            byte[] b = Base64.getMimeDecoder().decode(encrypted);
            if (b.length % 16 == 0) return b;
        } catch (Exception ignored) {}

        // 2) URL-safe Base64
        try {
            byte[] b = Base64.getUrlDecoder().decode(encrypted);
            if (b.length % 16 == 0) return b;
        } catch (Exception ignored) {}

        // 3) Hex
        try {
            byte[] b = hexStringToByteArray(encrypted);
            if (b.length % 16 == 0) return b;
        } catch (Exception ignored) {}

        // fallback: just return normal Base64 decode (even if not aligned)
        return Base64.getMimeDecoder().decode(encrypted);
    }

    private static byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                    + Character.digit(s.charAt(i + 1), 16));
        }
        return data;
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02X", b));
        }
        return sb.toString();
    }

    private static String decompressWithInflater(byte[] src, boolean nowrap) throws Exception {
        try (ByteArrayInputStream bais = new ByteArrayInputStream(src);
             InflaterInputStream iis = new InflaterInputStream(bais, new Inflater(nowrap));
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            byte[] buffer = new byte[4096];
            int read;
            while ((read = iis.read(buffer)) != -1) {
                baos.write(buffer, 0, read);
            }
            return baos.toString(StandardCharsets.UTF_8);
        }
    }


    private static String decompressWithGzip(byte[] src) throws Exception {
        try (ByteArrayInputStream bais = new ByteArrayInputStream(src);
             GZIPInputStream gis = new GZIPInputStream(bais);
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            byte[] buffer = new byte[4096];
            int read;
            while ((read = gis.read(buffer)) != -1) {
                baos.write(buffer, 0, read);
            }
            return baos.toString(StandardCharsets.UTF_8);
        }
    }


    private static String tryDecompress(byte[] bytes) {
        try {
            return decompressWithInflater(bytes, false);
        } catch (Exception e1) {
            try {
                return decompressWithInflater(bytes, true);
            } catch (Exception e2) {
                try {
                    return decompressWithGzip(bytes);
                } catch (Exception e3) {
                    return null;
                }
            }
        }
    }
}

