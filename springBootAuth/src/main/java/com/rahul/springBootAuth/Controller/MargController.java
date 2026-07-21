package com.rahul.springBootAuth.Controller;

import com.rahul.springBootAuth.DTO.LiveOrderRequest;
import com.rahul.springBootAuth.Model.InsertOrderRequest;
import com.rahul.springBootAuth.Model.LiveOrderStatusRequest;
import com.rahul.springBootAuth.Model.MasterSyncRequest;
import com.rahul.springBootAuth.Service.MargApiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/marg")
public class MargController {


    @Value("${marg.api.base-url}")
    private String baseUrl;

    @Value("${marg.api.company-code}")
    private String companyCode;

    @Value("${marg.api.marg-id}")
    private String margId;

    private final RestTemplate restTemplate = new RestTemplate();

    private final MargApiService margApiService;

    public MargController(MargApiService margApiService) {
        this.margApiService = margApiService;
    }

    @GetMapping("/sync-masters")
    public String syncMasters() {
        return margApiService.syncMasters();
    }




    // ✅ Live Order Status
    @PostMapping("/live-orders")
    public ResponseEntity<String> getLiveOrders(@RequestBody LiveOrderRequest request) {
        return ResponseEntity.ok(margApiService.getLiveOrderStatus(request));
    }





    @PostMapping("/insertOrder")
    public String insertOrder(@RequestBody InsertOrderRequest request) {
        return margApiService.insertOrder(
                request.getOrderNo(),
                request.getCustomerId(),
                request.getSalesmanId(),
                request.getProductCodes(),
                request.getQuantities()
        );
    }



//    @PostMapping("/insert-order")
//    public String insertOrder(String orderNo, String customerId, List<String> productCodes, List<String> quantities) {
//        String url = baseUrl + "/InsertOrderDetail";
//
//        // Prepare comma-separated product codes and quantities
//        String productCodeStr = String.join(",", productCodes);
//        String quantityStr = String.join(",", quantities);
//
//        Map<String, Object> request = new HashMap<>();
//        request.put("OrderID", "");
//        request.put("OrderNo", orderNo);
//        request.put("CustomerID", customerId);
//        request.put("MargID", margId);
//        request.put("Type", "S");
////        request.put("Sid", salesmanId);
//        request.put("ProductCode", productCodeStr);
//        request.put("Quantity", quantityStr);
//        request.put("Free", "0,".repeat(productCodes.size()).replaceAll(",$",""));
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
//        request.put("Paymentmode", "1");
//        request.put("PaymentmodeAmount", "0");
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
//                System.out.println("⚠️ No response from Marg InsertOrderDetail API");
//                return null;
//            }
//
//            // Optional: decrypt if your API requires encryption, e.g.
//            // String decrypted = MargDecryptor.decrypt(response, apiPassword);
//
//            System.out.println("✅ Marg InsertOrderDetail Response preview: " +
//                    response.substring(0, Math.min(500, response.length())));
//
//            return response;
//
//        } catch (Exception e) {
//            System.err.println("❌ Order insertion failed: " + e.getMessage());
//            return e.getMessage();
//        }
//    }

}
