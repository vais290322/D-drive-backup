package com.rahul.springBootAuth.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InsertOrderRequest {
    private String orderNo;
    private String customerId;
    private String salesmanId;
    private List<String> productCodes;
    private List<String> quantities;
}
