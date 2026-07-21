package com.rahul.Drasta.Controller;


import com.rahul.Drasta.Dto.PaymentRequest;
import com.rahul.Drasta.Dto.PaymentResponse;
import com.rahul.Drasta.Service.PhonePeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
//@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PhonePeService phonePeService;

//    @PostMapping("/initiate")
//    public ResponseEntity<PaymentResponse> initiatePayment(@RequestBody PaymentRequest request) {
//        PaymentResponse response = phonePeService.initiatePayment(request);
//        return ResponseEntity.ok(response);
//    }
//
//    @GetMapping("/callback")
//    public ResponseEntity<String> paymentCallback(
//            @RequestParam("transactionId") String transactionId,
//            @RequestParam("status") String status) {
//
//        phonePeService.updatePaymentStatus(transactionId, status);
//
//        // Redirect to frontend with status
//        return ResponseEntity.ok("Payment " + status);
//    }


    @PostMapping("/initiate")
    public ResponseEntity<PaymentResponse> initiatePayment(@RequestBody PaymentRequest request) {
        PaymentResponse response = phonePeService.initiatePayment(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/callback")
    public ResponseEntity<String> paymentCallback(@RequestBody Map<String, Object> callbackData) {
        // Process callback data from PhonePe
        // Update payment status in your database
        // Redirect user to success/failure page

        return ResponseEntity.ok("Payment processed");
    }

}