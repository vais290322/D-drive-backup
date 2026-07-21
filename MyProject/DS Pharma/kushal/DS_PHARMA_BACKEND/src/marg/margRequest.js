import { margApiBaseUrl } from "../config/credentials.js";
import { decryptData } from "./decryption.js";

export const makeRequest = async (endpoint, payload) => {
  console.log("Make request");
  try {
    console.log(`Making API request to ${endpoint}:`, payload);

    const response = await fetch(`${margApiBaseUrl}/${endpoint}`, {
      method: "POST",
      mode: "cors", // Explicitly set CORS mode
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log(`Response status for ${endpoint}:`, response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error response:`, errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`,
      );
    }

    // Marg API returns the response as a Base64 encoded, deflate-compressed string
    // It might be wrapped in quotes or returned as plain text
    let rawResponse = await response.text();
    console.log(
      `Raw API response from ${endpoint}:`,
      rawResponse.substring(0, 100) + "...",
    );

    // Remove surrounding quotes if present (sometimes API returns "base64string")
    if (rawResponse.startsWith('"') && rawResponse.endsWith('"')) {
      rawResponse = rawResponse.slice(1, -1);
    }

    // Decode the response (Base64 -> deflate decompress -> JSON)
    const decodedData = decryptData(rawResponse);

    if (decodedData) {
      console.log(`Decoded data from ${endpoint}:`, decodedData);
      return decodedData;
    } else {
      // If decryption failed, try parsing as plain JSON (fallback)
      try {
        const jsonData = JSON.parse(rawResponse);
        console.log(`Plain JSON response from ${endpoint}:`, jsonData);
        return jsonData;
      } catch {
        console.warn("Could not decode or parse response");
        return { error: "Failed to decode response", raw: rawResponse };
      }
    }
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    if (error.message.includes("CORS")) {
      console.error(
        "CORS Error: The API server may not allow requests from this origin.",
      );
      console.error("You may need to set up a backend proxy server.");
    }
    throw error;
  }
};
