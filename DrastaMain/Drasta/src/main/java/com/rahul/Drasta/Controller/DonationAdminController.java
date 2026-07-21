package com.rahul.Drasta.Controller;

import com.rahul.Drasta.Dto.ResponseDto;
import com.rahul.Drasta.Model.Donate;
import com.rahul.Drasta.Model.PaymentDetails;
import com.rahul.Drasta.Service.DonateService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;

@RestController
@RequestMapping("/api/v1/admin/donations")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class DonationAdminController {

    private final DonateService donateService;


    @GetMapping("/stats")
    public ResponseEntity<ResponseDto> getDonationStats() {
        List<Donate> allDonations = donateService.allTransaction();
        
        // Calculate total donation amount
        double totalAmount = allDonations.stream()
                .mapToDouble(Donate::getDonateAmount)
                .sum();
        
        // Count total donors (unique by email)
        long totalDonors = allDonations.stream()
                .map(Donate::getEmail)
                .distinct()
                .count();
        
        // Calculate this month's donations
        YearMonth currentMonth = YearMonth.now();
        double thisMonthAmount = allDonations.stream()
                .flatMap(donate -> donate.getPaymentDetails().stream())
                .filter(payment -> {
                    LocalDateTime paidOn = payment.getPaidOn();
                    return paidOn != null && 
                           YearMonth.from(paidOn).equals(currentMonth) && 
                           "paid".equalsIgnoreCase(payment.getStatus());
                })
                .mapToDouble(PaymentDetails::getPaidAmount)
                .sum();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDonations", totalAmount);
        stats.put("totalDonors", totalDonors);
        stats.put("thisMonth", thisMonthAmount);
        
        return new ResponseEntity<>(
                new ResponseDto(true, "Donation statistics fetched successfully", stats),
                HttpStatus.OK
        );
    }

    /**
     * Get paginated donations with optional filtering
     */
    @GetMapping("/list")
    public ResponseEntity<ResponseDto> getPaginatedDonations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) String paymentMode,
            @RequestParam(required = false) String transactionId
    ) {
        // Get all donations first (we'll filter in memory since MongoDB doesn't support complex filtering)
        List<Donate> allDonations = donateService.allTransaction();


        // Apply filters
        List<Donate> filteredDonations = allDonations.stream()
                .filter(donate -> name == null || donate.getName().toLowerCase().contains(name.toLowerCase()))
                .filter(donate -> email == null || donate.getEmail().toLowerCase().contains(email.toLowerCase()))
                .filter(donate -> transactionId == null || donate.getPaymentDetails().stream()
                        .anyMatch(payment -> payment.getPaymentId() != null && 
                                  payment.getPaymentId().contains(transactionId)))
                .filter(donate -> paymentMode == null || true) // Placeholder for payment mode filter
                .filter(donate -> {
                    if (fromDate == null && toDate == null) return true;

                    return donate.getPaymentDetails().stream()
                            .anyMatch(payment -> {
                                if (payment.getPaidOn() == null) return false;

                                LocalDate paidDate = payment.getPaidOn().toLocalDate();
                                boolean afterFromDate = fromDate == null || !paidDate.isBefore(fromDate);
                                boolean beforeToDate = toDate == null || !paidDate.isAfter(toDate);

                                return afterFromDate && beforeToDate;
                            });
                })
                .toList();
        
        // Manual pagination
        int start = Math.min(page * size, filteredDonations.size());
        int end = Math.min(start + size, filteredDonations.size());
        
        List<Donate> paginatedDonations = filteredDonations.subList(start, end);
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", paginatedDonations);
        response.put("totalElements", filteredDonations.size());
        response.put("totalPages", (int) Math.ceil((double) filteredDonations.size() / size));
        response.put("currentPage", page);
        
        return new ResponseEntity<>(
                new ResponseDto(true, "Donations fetched successfully", response),
                HttpStatus.OK
        );
    }

    /**
     * Add a manual donation entry
     */
    @PostMapping("/manual-entry")
    public ResponseEntity<ResponseDto> addManualDonation(@RequestBody Donate donate) {
        // Ensure the donation has at least one payment detail
        if (donate.getPaymentDetails() == null || donate.getPaymentDetails().isEmpty()) {
            PaymentDetails paymentDetail = new PaymentDetails();
            paymentDetail.setOrderId("MANUAL-" + System.currentTimeMillis());
            paymentDetail.setPaymentId("MANUAL-" + System.currentTimeMillis());
            paymentDetail.setPaidAmount(donate.getDonateAmount());
            paymentDetail.setStatus("paid");
            paymentDetail.setPaidOn(LocalDateTime.now());
            
            donate.getPaymentDetails().add(paymentDetail);
        }
        
        // Set status if not provided
        if (donate.getStatus() == null || donate.getStatus().isEmpty()) {
            donate.setStatus("paid");
        }
        System.out.println(" i m from manual donate : "+donate);
        Donate saved = donateService.savePayment(donate);
        
        return new ResponseEntity<>(
                new ResponseDto(true, "Manual donation entry added successfully", saved),
                HttpStatus.CREATED
        );
    }

    /**
     * Get donation by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResponseDto> getDonationById(@PathVariable String id) {
        Optional<Donate> donationOpt = donateService.getDonationById(id);
        
        return donationOpt.map(donate -> new ResponseEntity<>(
                new ResponseDto(true, "Donation found", donate),
                HttpStatus.OK
        )).orElseGet(() -> new ResponseEntity<>(
                new ResponseDto(false, "Donation not found with ID: " + id, null),
                HttpStatus.NOT_FOUND
        ));
    }

    /**
     * Update donation status
     */
    @PutMapping("/status/{id}")
    public ResponseEntity<ResponseDto> updateDonationStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> statusUpdate) {
        
        String newStatus = statusUpdate.get("status");
        if (newStatus == null || newStatus.isEmpty()) {
            return new ResponseEntity<>(
                    new ResponseDto(false, "Status value is required", null),
                    HttpStatus.BAD_REQUEST
            );
        }
        
        Optional<Donate> donationOpt = donateService.getDonationById(id);
        if (donationOpt.isEmpty()) {
            return new ResponseEntity<>(
                    new ResponseDto(false, "Donation not found with ID: " + id, null),
                    HttpStatus.NOT_FOUND
            );
        }
        
        Donate donation = donationOpt.get();
        donation.setStatus(newStatus);
        
        Donate updated = donateService.savePayment(donation);
        
        return new ResponseEntity<>(
                new ResponseDto(true, "Donation status updated successfully", updated),
                HttpStatus.OK
        );
    }

    // Download receipts for filtered donations
    @GetMapping("/receipts/filtered")
    public ResponseEntity<?> downloadFilteredReceipts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) String paymentMode,
            @RequestParam(required = false) String transactionId
    ) {
        try {
            // Get all donations first
            List<Donate> allDonations = donateService.allTransaction();
            
            // Apply filters (similar to getPaginatedDonations method)
            List<Donate> filteredDonations = allDonations.stream()
                    .filter(d -> name == null || d.getName().toLowerCase().contains(name.toLowerCase()))
                    .filter(d -> email == null || d.getEmail().toLowerCase().contains(email.toLowerCase()))
                    .filter(d -> paymentMode == null || (d.getPaymentMode() != null && d.getPaymentMode().equalsIgnoreCase(paymentMode)))
                    .filter(d -> transactionId == null || (d.getTransactionId() != null && d.getTransactionId().contains(transactionId)))
                    // Date filtering would need to be implemented based on your data model
                    .toList();
            
            // Extract IDs for bulk receipt generation
            List<String> donationIds = filteredDonations.stream()
                    .map(Donate::getId)
                    .toList();
            
            byte[] zipBytes = donateService.generateBulkReceipts(donationIds);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "filtered_donation_receipts.zip");
            
            return new ResponseEntity<>(zipBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(
                    new ResponseDto(false, "Failed to generate receipts: " + e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get donations aggregated over time (daily, monthly, yearly)
     */
    @GetMapping("/over-time")
    public ResponseEntity<ResponseDto> getDonationsOverTime(
            @RequestParam(defaultValue = "monthly") String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        
        // Set default date range if not provided
        LocalDate endDate = toDate != null ? toDate : LocalDate.now();
        LocalDate startDate;

        // Default: last 12 months for monthly, last 30 days for daily, last 5 years for yearly
        startDate = Objects.requireNonNullElseGet(fromDate, () -> switch (period.toLowerCase()) {
            case "daily" -> endDate.minusDays(30);
            case "yearly" -> endDate.minusYears(5);
            default -> endDate.minusMonths(12);
        });
        
        // Get all donations
        List<Donate> allDonations = donateService.allTransaction();
        
        // Filter donations by date range
        List<PaymentDetails> paymentsInRange = allDonations.stream()
                .flatMap(donate -> donate.getPaymentDetails().stream())
                .filter(payment -> {
                    if (payment.getPaidOn() == null || !"paid".equalsIgnoreCase(payment.getStatus())) {
                        return false;
                    }
                    
                    LocalDate paidDate = payment.getPaidOn().toLocalDate();
                    return !paidDate.isBefore(startDate) && !paidDate.isAfter(endDate);
                })
                .toList();
        
        // Aggregate data based on period
        Map<String, Double> aggregatedData = new HashMap<>();
        
        for (PaymentDetails payment : paymentsInRange) {
            LocalDate paidDate = payment.getPaidOn().toLocalDate();
            String key = switch (period.toLowerCase()) {
                case "daily" -> paidDate.toString(); // YYYY-MM-DD
                case "yearly" -> String.valueOf(paidDate.getYear()); // YYYY
                default -> paidDate.getYear() + "-" +
                        String.format("%02d", paidDate.getMonthValue()); // YYYY-MM
            };

            aggregatedData.put(key,
                    aggregatedData.getOrDefault(key, 0.0) + payment.getPaidAmount());
        }
        
        // Convert to list of data points for easier frontend processing
        List<Map<String, Object>> dataPoints = aggregatedData.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> point = new HashMap<>();
                    point.put("period", entry.getKey());
                    point.put("amount", entry.getValue());
                    return point;
                })
                .sorted((p1, p2) -> ((String) p1.get("period")).compareTo((String) p2.get("period")))
                .toList();


        Map<String, Object> response = new HashMap<>();
        response.put("period", period);
        response.put("startDate", startDate);
        response.put("endDate", endDate);
        response.put("monthly", dataPoints);
        response.put("totalAmount", dataPoints.stream()
                .mapToDouble(point -> (Double) point.get("amount"))
                .sum());
        
        return new ResponseEntity<>(
                new ResponseDto(true, "Donations over time fetched successfully", response),
                HttpStatus.OK
        );
    }
}