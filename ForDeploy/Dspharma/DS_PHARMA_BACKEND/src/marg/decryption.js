import CryptoJS from "crypto-js";
import { inflateRaw } from "pako";
import { margDecryptionKey } from "../config/credentials.js";

/**
 * Marg API Response Decoder
 *
 * Based on official Marg C# SDK:
 * 1. AES-128-CBC decrypt (Key = IV, zero-padded to 16 bytes)
 * 2. Base64 decode the decrypted string
 * 3. Deflate decompress (raw, no zlib header)
 * 4. Parse as UTF-8 JSON
 */

// Get decryption key from environment
// const DECRYPTION_KEY = process.env.VITE_DECRYPTION_KEY || "N9JB7B4H0QHV";

/**
 * Decrypt AES-128-CBC encrypted data
 * Matches C# RijndaelManaged with Mode=CBC, Padding=PKCS7, KeySize=128
 * Key and IV are the same (key zero-padded to 16 bytes)
 */
function aesDecrypt(base64Data, keyStr) {
  // Create key: pad with null bytes to 16 bytes (matching C# Array.Copy with zero-filled array)
  let keyPadded = keyStr;
  if (keyStr.length < 16) {
    keyPadded = keyStr + "\0".repeat(16 - keyStr.length);
  } else if (keyStr.length > 16) {
    keyPadded = keyStr.slice(0, 16);
  }

  const keyBytes = CryptoJS.enc.Utf8.parse(keyPadded);

  // IV = Key (same bytes)
  const iv = keyBytes;

  // Decrypt
  const decrypted = CryptoJS.AES.decrypt(base64Data, keyBytes, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * Decompress deflate data
 * Input is Base64 encoded raw deflate data
 */
function deflateDecompress(base64Compressed) {
  // Base64 decode to bytes (Node.js compatible)
  const buffer = Buffer.from(base64Compressed, "base64");
  const bytes = new Uint8Array(buffer);

  // Raw deflate decompress
  const decompressed = inflateRaw(bytes, { to: "string" });

  // Remove BOM if present
  if (decompressed.charCodeAt(0) === 0xfeff) {
    return decompressed.slice(1);
  }

  return decompressed;
}

/**
 * Decode Marg API response (full pipeline)
 * @param {string} encryptedBase64 - Base64 encoded AES encrypted data from API
 * @param {string} key - Decryption key (optional, defaults to env variable)
 * @returns {Object|null} - Parsed JSON object or null on failure
 */
export const decryptData = (encryptedBase64, key = margDecryptionKey) => {
  if (!encryptedBase64 || typeof encryptedBase64 !== "string") return null;

  try {
    // Step 1: AES-128-CBC Decrypt
    let decrypted = null;
    try {
      decrypted = aesDecrypt(encryptedBase64, key);
    } catch (e) {
      // AES decryption failed (wrong key or not encrypted)
    }

    // Step 2: Deflate Decompress
    // If AES decryption worked, the result is the decompressed string (because aesDecrypt returns string)
    // Wait, let's look at the original logic:
    // Original: aesDecrypt returns string -> deflateDecompress(decrypted) -> JSON.parse

    // If AES decryption returns a non-empty string, try to decompress it
    if (decrypted) {
      try {
        const jsonString = deflateDecompress(decrypted);
        return JSON.parse(jsonString);
      } catch (e) {
        // If decompression of "decrypted" data fails, maybe it wasn't encrypted after all?
        // But if aesDecrypt returned something, it means it "succeeded" in keeping it as a string.
        // Let's rely on the fallback below if this fails.
        console.warn(
          "AES decryption succeeded but decompression/parsing failed. Trying fallback.",
          e.message,
        );
      }
    }

    // Fallback: Try direct deflate only (for wservices API and InsertOrderDetail which isn't AES encrypted)
    // The input is Base64 encoded deflate data
    try {
      const jsonString = deflateDecompress(encryptedBase64);
      return JSON.parse(jsonString);
    } catch (e) {
      console.error(
        "Marg Response Decoding Failed (both AES and Direct):",
        e.message,
      );
      return null;
    }
  } catch (error) {
    console.error("Marg Response Decoding Critical Error:", error.message);
    return null;
  }
};

// Legacy alias for backward compatibility
export const decodeMargResponse = decryptData;
