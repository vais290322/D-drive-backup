package com.rahul.springBootAuth.Service;

import com.rahul.springBootAuth.DTO.LiveOrderRequest;
import com.rahul.springBootAuth.Model.InsertOrderRequest;
import com.rahul.springBootAuth.Model.LiveOrderStatusRequest;
import com.rahul.springBootAuth.Model.MasterSyncRequest;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class MargApiService {

    // Put this RestTemplate init in a @PostConstruct or service constructor
    private final RestTemplate restTemplate;

    public MargApiService() {
        this.restTemplate = new RestTemplate();
        // Ensure UTF-8 String converter is first
        restTemplate.getMessageConverters().add(0, new org.springframework.http.converter.StringHttpMessageConverter(java.nio.charset.StandardCharsets.UTF_8));
    }

    @Value("${marg.api.base-url}")
    private String baseUrl;

    @Value("${marg.api.company-code}")
    private String companyCode;

    @Value("${marg.api.marg-id}")
    private String margId;

    @Value("${marg.api.password}")
    private String apiPassword;


    public String syncMasters() {
        String url = baseUrl + "/MargMST2017";
        MasterSyncRequest request = new MasterSyncRequest(companyCode, margId, "", "0");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

        HttpEntity<MasterSyncRequest> entity = new HttpEntity<>(request, headers);

        String encryptedResponse = restTemplate.postForObject(url, entity, String.class);

        if (encryptedResponse == null || encryptedResponse.isEmpty()) {
            System.out.println("⚠️ No data returned from Marg API");
            return null;
        }

//        System.out.println("🔒 Raw Marg Response preview: " +
//                encryptedResponse.substring(0, Math.min(200, encryptedResponse.length())));

        try {
            String decrypted = MargDecryptor.decrypt(encryptedResponse, apiPassword);
            System.out.println("✅ Decrypted Marg Response preview: " +
                    decrypted.substring(0, Math.min(500, decrypted.length())));
            return decrypted;
        } catch (Exception e) {
            System.err.println("❌ Decryption failed: " + e.getMessage());
//            e.printStackTrace();
            return e.getMessage();
        }
    }


    public String insertOrder(String orderNo, String customerId, String salesmanId,
                              List<String> productCodes, List<String> quantities) {

        if (productCodes.size() != quantities.size()) {
            throw new IllegalArgumentException("Product codes and quantities must have the same length");
        }

        String url = baseUrl + "/InsertOrderDetail";

        String productCodeStr = String.join(",", productCodes);
        String quantityStr = String.join(",", quantities);
        String freeStr = "0,".repeat(productCodes.size()).replaceAll(",$", "");

        Map<String, Object> request = new HashMap<>();
        request.put("OrderID", "");
        request.put("OrderNo", orderNo);
        request.put("CustomerID", customerId);
        request.put("MargID", margId);
        request.put("Type", "S");
        request.put("Sid", salesmanId);      // Mandatory field
        request.put("ProductCode", productCodeStr);
        request.put("Quantity", quantityStr);
        request.put("Free", freeStr);
        request.put("Lat", "");
        request.put("Lng", "");
        request.put("Address", "");
        request.put("GpsID", "0");
        request.put("UserType", "1");
        request.put("Points", "0.0");
        request.put("Discounts", "0");
        request.put("Transport", "");
        request.put("Delivery", "");
        request.put("Bankname", "");
        request.put("BankAdd1", "");
        request.put("BankAdd2", "");
        request.put("shipname", "");
        request.put("shipAdd1", "");
        request.put("shipAdd2", "");
        request.put("shipAdd3", "");
        request.put("paymentmode", "1");
        request.put("paymentmodeAmount", "0");
        request.put("payment_remarks", "");
        request.put("order_remarks", "Order created via API");
        request.put("CustMobile", "");
        request.put("CompanyCode", companyCode);
        request.put("OrderFrom", companyCode);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        try {
            String response = restTemplate.postForObject(url, entity, String.class);

            if (response == null || response.isEmpty()) {
                return "⚠️ No response from Marg InsertOrderDetail API";
            }

            // 🔐 Decrypt the response using MargDecryptor
            String decrypted = MargDecryptor.decrypt(response, apiPassword);
            System.out.println("✅ Decrypted Marg Response: " + decrypted);

            return decrypted;

        } catch (Exception e) {
            e.printStackTrace();
            return "❌ Order insertion failed: " + e.getMessage();
        }
    }



//    public String insertOrder(String orderNo, String customerId, String salesmanId,
//                              List<String> productCodes, List<String> quantities) {
//
//        if (productCodes.size() != quantities.size()) {
//            throw new IllegalArgumentException("Product codes and quantities must have the same length");
//        }
//
//        String url = baseUrl + "/InsertOrderDetail";
//
//        String productCodeStr = String.join(",", productCodes);
//        String quantityStr = String.join(",", quantities);
//        String freeStr = "0,".repeat(productCodes.size()).replaceAll(",$", "");
//
//        Map<String, Object> request = new HashMap<>();
//        request.put("OrderID", "");
//        request.put("OrderNo", orderNo);
//        request.put("CustomerID", customerId);
//        request.put("MargID", margId);
//        request.put("Type", "S");
//        request.put("Sid", salesmanId);      // Mandatory field
//        request.put("ProductCode", productCodeStr);
//        request.put("Quantity", quantityStr);
//        request.put("Free", freeStr);
//        request.put("Lat", "");
//        request.put("Lng", "");
//        request.put("Address", "");
//        request.put("GpsID", "0");
//        request.put("UserType", "1");
//        request.put("Points", "0.0");
//        request.put("Discounts", "0");
//        request.put("Transport", "");
//        request.put("Delivery", "");
//        request.put("Bankname", "");
//        request.put("BankAdd1", "");
//        request.put("BankAdd2", "");
//        request.put("shipname", "");
//        request.put("shipAdd1", "");
//        request.put("shipAdd2", "");
//        request.put("shipAdd3", "");
//        request.put("paymentmode", "1");
//        request.put("paymentmodeAmount", "0");
//        request.put("payment_remarks", "");
//        request.put("order_remarks", "Order created via API");
//        request.put("CustMobile", "");
//        request.put("CompanyCode", companyCode);
//        request.put("OrderFrom", companyCode);
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//
//        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
//
//        try {
//            String response = restTemplate.postForObject(url, entity, String.class);
//
//            if (response == null || response.isEmpty()) {
//                return "⚠️ No response from Marg InsertOrderDetail API";
//            }
//
//            return response;
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return "❌ Order insertion failed: " + e.getMessage();
//        }
//    }





//    public String insertOrder(InsertOrderRequest orderRequest) {
//        String url = baseUrl + "/InsertOrderDetail";
//
//        // Mandatory system fields
////        orderRequest.setCompanyCode(companyCode);
////        orderRequest.setMargID(margId);
////        orderRequest.setOrderFrom(companyCode);
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//        headers.set("ApiPassword", apiPassword);
//
//        HttpEntity<InsertOrderRequest> entity = new HttpEntity<>(orderRequest, headers);
//
//        try {
//            // Send request
//            String encryptedResponse = restTemplate.postForObject(url, entity, String.class);
//            System.out.println("🔒 Raw Marg Response: " + encryptedResponse);
//
//            // Decrypt response
//            String decrypted = MargDecryptor.decrypt(encryptedResponse, apiPassword);
//            System.out.println("✅ Decrypted Marg Response: " + decrypted);
//            return decrypted;
//
//        } catch (HttpServerErrorException e) {
//            System.err.println("❌ Marg API Error: " + e.getResponseBodyAsString());
//            throw new RuntimeException("Marg API returned 500 Internal Server Error", e);
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to process Marg API response", e);
//        }
//    }



    public String getLiveOrderStatus(LiveOrderRequest request) {
        String url = baseUrl + "/LiveOrderDispatchStatus2017";

        LiveOrderStatusRequest statusRequest = new LiveOrderStatusRequest(companyCode,margId, request.getSalesmanID(), request.getType(), request.getDatetime(), request.getIndex());

//        request.setCompanyCode(companyCode);
//        request.setMargID(margId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("ApiPassword", apiPassword);

        HttpEntity<LiveOrderStatusRequest> entity = new HttpEntity<>(statusRequest, headers);

        String response = restTemplate.postForObject(url, entity, String.class);

        if (response == null || response.isEmpty()) {
            System.out.println("⚠️ No data returned from Marg API");
            return null;
        }

//        System.out.println("🔒 Raw Marg LiveOrder Response: " +
//                response.substring(0, Math.min(200, response.length())));

        try {
            // Heuristic: if response looks like JSON (starts with { or [), don’t decrypt
            if (response.trim().startsWith("{") || response.trim().startsWith("[")) {
                System.out.println("ℹ️ Response is plain JSON, skipping decryption.");
                return response;
            }

            // Otherwise, decrypt
            String decrypted = MargDecryptor.decrypt(response, apiPassword);
            System.out.println("✅ Decrypted Marg LiveOrder Response: " +
                    decrypted.substring(0, Math.min(500, decrypted.length())));
            return decrypted;

        } catch (Exception e) {
            System.err.println("❌ Decryption failed: " + e.getMessage());
            e.printStackTrace();
            return response; // return raw response so at least you can inspect
        }
    }



}
