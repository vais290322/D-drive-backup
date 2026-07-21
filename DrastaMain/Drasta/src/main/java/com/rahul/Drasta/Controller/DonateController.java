package com.rahul.Drasta.Controller;

import com.rahul.Drasta.Dto.ResponseDto;
import com.rahul.Drasta.Model.Donate;
import com.rahul.Drasta.Service.DonateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/donate")
@RequiredArgsConstructor
public class DonateController {

    private final DonateService donateService;

    // Save or update a donation record
    @PostMapping("/save")
    public ResponseEntity<ResponseDto> saveDonation(@RequestBody Donate donate) {
        Donate saved = donateService.savePayment(donate);
        return new ResponseEntity<>(
                new ResponseDto(true, "Donation saved successfully", saved),
                HttpStatus.CREATED
        );
    }

    // Get all donation transactions
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<ResponseDto> getAllDonations() {
        List<Donate> donations = donateService.allTransaction();
        return new ResponseEntity<>(
                new ResponseDto(true, "All donation transactions fetched", donations),
                HttpStatus.OK
        );
    }

    // Get donation by donor's email
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/by-email")
    public ResponseEntity<ResponseDto> getByEmail(@RequestParam String email) {
        Optional<Donate> donationOpt = donateService.getByCustomerDonate(email);
        return donationOpt.map(donate -> new ResponseEntity<>(
                new ResponseDto(true, "Donation found", donate),
                HttpStatus.OK
        )).orElseGet(() -> new ResponseEntity<>(
                new ResponseDto(false, "Donation not found for email: " + email, null),
                HttpStatus.NOT_FOUND
        ));
    }

    // Delete donation record by ID
    @PreAuthorize("hasRole('DEV')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseDto> deleteDonation(@PathVariable String id) {
        donateService.deleteCustomerDonate(id);
        return new ResponseEntity<>(
                new ResponseDto(true, "Donation deleted successfully", null),
                HttpStatus.OK
        );
    }

    // Download receipt for a single donation
    @GetMapping("/receipt/{id}")
    public ResponseEntity<?> downloadReceipt(@PathVariable String id) {
        try {
            byte[] receiptBytes = donateService.generateReceipt(id);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "donation_receipt_" + id + ".pdf");
            
            return new ResponseEntity<>(receiptBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(
                    new ResponseDto(false, "Failed to generate receipt: " + e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    
    // Download receipts for multiple donations
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/receipts/bulk")
    public ResponseEntity<?> downloadBulkReceipts(@RequestBody List<String> donationIds) {
        try {
            byte[] zipBytes = donateService.generateBulkReceipts(donationIds);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "donation_receipts.zip");
            
            return new ResponseEntity<>(zipBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(
                    new ResponseDto(false, "Failed to generate receipts: " + e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    
    // Email receipt to donor
    @PostMapping("/receipt/email/{id}")
    public ResponseEntity<ResponseDto> emailReceipt(@PathVariable String id) {
        try {
            donateService.emailReceipt(id);
            return new ResponseEntity<>(
                    new ResponseDto(true, "Receipt has been emailed to the donor", null),
                    HttpStatus.OK
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ResponseDto(false, "Failed to email receipt: " + e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
