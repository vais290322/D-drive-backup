package com.rahul.Drasta.Dto;

import lombok.Data;

@Data
public class PaymentResponse {
    private String transactionId;
    private String redirectUrl;
    private String status;

}