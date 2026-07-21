package com.rahul.Drasta.Dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private String name;
    private String email;
    private double amount;

}