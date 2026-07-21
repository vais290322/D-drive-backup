package com.rahul.Drasta.Model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "donate")
public class Donate {

    private String id;
    private String name;
    private String email;
    private Double donateAmount;
    private String paymentMode;
    private String transactionId;
    private String note;
    private String paymentType;
    private String status;
    private List<PaymentDetails> paymentDetails = new ArrayList<>();
    private LocalDateTime paidOne;



}
