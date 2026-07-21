package com.rahul.Drasta.Model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PaymentDetails{
    private String orderId;
    private String paymentId;
    private Double paidAmount;
    private String status;     //paid, unPaid, pending, failed
    private LocalDateTime paidOn;

}