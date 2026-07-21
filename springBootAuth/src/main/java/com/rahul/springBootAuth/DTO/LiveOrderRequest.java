package com.rahul.springBootAuth.DTO;


import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@RequiredArgsConstructor
public class LiveOrderRequest {
    private String SalesmanID;
    private String Type;     // "S" = Sales, "P" = Purchase (depends on API doc)
    private String Datetime; // format: yyyy-MM-dd HH:mm:ss
    private String Index;


    @Data
    @NoArgsConstructor
    public static class OrderRequest {
        private String orderNo;
        private String customerId;
        private String salesmanId;
        private List<String> productCodes;
        private List<String> quantities;
        private String orderRemarks;

    }
}