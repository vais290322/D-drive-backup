package com.rahul.Drasta.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rahul.Drasta.Dto.PaymentRequest;
import com.rahul.Drasta.Dto.PaymentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class PhonePeService {

    @Value("${phonepe.merchant.id}")
    private String merchantId;

    @Value("${phonepe.merchant.key}")
    private String merchantKey;

    @Value("${phonepe.api.url}")
    private String apiUrl;

    @Value("${app.callback.url}")
    private String callbackUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public PaymentResponse initiatePayment(PaymentRequest request) {
        try {
            // Create a unique transaction ID
            String transactionId = UUID.randomUUID().toString();

            System.out.println("Initiating payment with transaction ID: " + transactionId);

            // Create the payload for PhonePe API
            Map<String, Object> payload = new HashMap<>();
            payload.put("merchantId", merchantId);
            payload.put("merchantTransactionId", transactionId);
            payload.put("amount", request.getAmount() * 100); // Convert to paise
            payload.put("merchantUserId", "MUID" + System.currentTimeMillis());
            payload.put("redirectUrl", callbackUrl + "/api/payment/callback");
            payload.put("redirectMode", "REDIRECT");
            payload.put("callbackUrl", callbackUrl + "/api/payment/callback"); // Add this line
            payload.put("mobileNumber", "9999999999"); // Optional, can be taken from user
            payload.put("paymentInstrument", createPaymentInstrument());

            // Convert payload to JSON and print for debugging
            String jsonPayload = objectToJson(payload);
            System.out.println("Request payload: " + jsonPayload);

            // Convert payload to base64
            String base64Payload = Base64.getEncoder().encodeToString(
                    jsonPayload.getBytes(StandardCharsets.UTF_8));

            // Calculate X-VERIFY header
            String xVerify = calculateXVerify(base64Payload);
            System.out.println("X-VERIFY: " + xVerify);

            // Create request headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-VERIFY", xVerify);

            // Create request body
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("request", base64Payload);

            // Make API call to PhonePe
            String fullUrl = apiUrl + "/pg/v1/pay";
            System.out.println("Making API call to: " + fullUrl);
            
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(fullUrl, entity, Map.class);

            // Print response for debugging
            System.out.println("Response status: " + response.getStatusCode());
            System.out.println("Response body: " + objectToJson(response.getBody()));

            // Process response
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.convertValue(response.getBody(), JsonNode.class);
            
            PaymentResponse paymentResponse = new PaymentResponse();
            paymentResponse.setTransactionId(transactionId);
            
            if (rootNode.has("success") && rootNode.get("success").asBoolean()) {
                JsonNode dataNode = rootNode.get("data");
                if (dataNode != null && dataNode.has("instrumentResponse")) {
                    JsonNode instrumentNode = dataNode.get("instrumentResponse");
                    if (instrumentNode.has("redirectInfo") && instrumentNode.get("redirectInfo").has("url")) {
                        paymentResponse.setRedirectUrl(instrumentNode.get("redirectInfo").get("url").asText());
                        paymentResponse.setStatus("SUCCESS");
                        return paymentResponse;
                    }
                }
            }
            
            // If we get here, something went wrong with the response parsing
            if (rootNode.has("code")) {
                paymentResponse.setStatus("ERROR: " + rootNode.get("code").asText());
            } else {
                paymentResponse.setStatus("ERROR: Unknown response format");
            }
            return paymentResponse;
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Exception during payment initiation: " + e.getMessage());
            PaymentResponse paymentResponse = new PaymentResponse();
            paymentResponse.setStatus("ERROR: " + e.getMessage());
            return paymentResponse;
        }
    }

    private Map<String, Object> createPaymentInstrument() {
        Map<String, Object> paymentInstrument = new HashMap<>();
        paymentInstrument.put("type", "PAY_PAGE");
        return paymentInstrument;
    }

    private String calculateXVerify(String base64Payload) throws NoSuchAlgorithmException, InvalidKeyException {
        String input = base64Payload + "/pg/v1/pay" + merchantKey;
        Mac hmacSha256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(merchantKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        hmacSha256.init(secretKey);
        byte[] hash = hmacSha256.doFinal(input.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(hash) + "###1";
    }

    private String objectToJson(Object object) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(object);
        } catch (Exception e) {
            e.printStackTrace();
            return "{}";
        }
    }
}