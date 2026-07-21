package com.rahul.Drasta.Service;

import com.phonepe.sdk.pg.payments.v2.models.request.StandardCheckoutPayRequest;
import com.phonepe.sdk.pg.payments.v2.models.response.StandardCheckoutPayResponse;
import com.rahul.Drasta.Exception.NotFoundException;
import com.rahul.Drasta.Model.Donate;
import com.rahul.Drasta.Model.PaymentDetails;
import com.rahul.Drasta.Repository.DonateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DonateService {

    private final DonateRepository donateRepository;
    private final ReceiptService receiptService;


//    public Donate savePayment(Donate donate){
//        return donateRepository.save(donate);
//    }

    public Donate savePayment(Donate donate) {
        Optional<Donate> existingDonateOpt = donateRepository.findByEmail(donate.getEmail());

        if (existingDonateOpt.isPresent()) {
            Donate existingDonate = existingDonateOpt.get();

            // Append new payment details
            List<PaymentDetails> existingDetails = existingDonate.getPaymentDetails();
            existingDetails.addAll(donate.getPaymentDetails());
            existingDonate.setPaymentDetails(existingDetails);

            // Optionally update amount and status
            existingDonate.setDonateAmount(existingDonate.getDonateAmount() + donate.getDonateAmount());
            existingDonate.setStatus(donate.getStatus()); // or handle status update logic if needed

            return donateRepository.save(existingDonate);
        } else {
            // New donor

            return donateRepository.save(donate);
        }
    }


    public List<Donate> allTransaction(){
        List<Donate> donations = donateRepository.findAll();
        
        // Sort donations by the most recent payment date (latest payment first)
        donations.sort((d1, d2) -> {
            // Get the most recent payment date for each donation
            LocalDateTime d1Latest = getMostRecentPaymentDate(d1);
            LocalDateTime d2Latest = getMostRecentPaymentDate(d2);
            
            // Sort in descending order (most recent first)
            return d2Latest.compareTo(d1Latest);
        });
        
        return donations;
    }
    
    // Helper method to get the most recent payment date from a donation
    private LocalDateTime getMostRecentPaymentDate(Donate donate) {
        // First check if there are payment details
        if (donate.getPaymentDetails() != null && !donate.getPaymentDetails().isEmpty()) {
            // Find the most recent paidOn date from payment details
            return donate.getPaymentDetails().stream()
                    .map(PaymentDetails::getPaidOn)
                    .filter(date -> date != null)
                    .max(LocalDateTime::compareTo)
                    .orElse(donate.getPaidOne()); // Fallback to paidOne if no valid dates in details
        }
        
        // If no payment details, use the paidOne field
        return donate.getPaidOne() != null ? donate.getPaidOne() : LocalDateTime.MIN;
    }

    public Optional<Donate>getByCustomerDonate(String email){
        return donateRepository.findByEmail(email);
    }

    public void deleteCustomerDonate(String id){
        Donate existDonate = donateRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Donated customer not found"));
        donateRepository.delete(existDonate);
    }


//    public String createCheckoutUrl(Donate donate) {
//        String merchantOrderId = UUID.randomUUID().toString();
//        long amountInPaise = Math.round(donate.getDonateAmount() * 100); // e.g., ₹500 → 50000
//
//        StandardCheckoutPayRequest req = StandardCheckoutPayRequest.builder()
//                .merchantOrderId(merchantOrderId)
//                .amount(amountInPaise)
//                .redirectUrl(callbackUrl)
//                .build();
//
//        StandardCheckoutPayResponse resp = phonepeClient.pay(req);
//        return resp.getRedirectUrl();
//    }

    public Optional<Donate> getDonationById(String id) {
        return donateRepository.findById(id);
    }

    
    /**
     * Generate a receipt for a single donation
     */
    public byte[] generateReceipt(String donationId) throws IOException {
        return receiptService.generateReceipt(donationId);
    }
    
    /**
     * Generate receipts for multiple donations
     */
    public byte[] generateBulkReceipts(List<String> donationIds) throws IOException {
        return receiptService.generateBulkReceipts(donationIds);
    }
    
    /**
     * Email a receipt to the donor
     */
    public void emailReceipt(String donationId) {
        receiptService.emailReceipt(donationId);
    }
}
