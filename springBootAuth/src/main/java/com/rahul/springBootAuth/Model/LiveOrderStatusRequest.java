package com.rahul.springBootAuth.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LiveOrderStatusRequest {
    private String CompanyCode;   // e.g., "MARGLIVE"
    private String MargID;        // e.g., "8835"
    private String SalesmanID;    // e.g., "Test"
    private String Type;          // e.g., "S"
    private String Datetime;      // e.g., "2025-09-16 10:00:00"
    private String Index;         // e.g., "0"
}
