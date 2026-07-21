package com.rahul.Drasta.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VolunteerStatsDto {
    private long activeCount;
    private long inactiveCount;
    private long lastMonthRegistered;
}
