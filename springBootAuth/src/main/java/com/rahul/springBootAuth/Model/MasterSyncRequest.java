package com.rahul.springBootAuth.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MasterSyncRequest {
    private String CompanyCode;
    private String MargID;
    private String Datetime;
    private String Index;
}
