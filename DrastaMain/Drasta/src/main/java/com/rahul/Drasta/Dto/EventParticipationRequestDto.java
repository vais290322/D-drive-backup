package com.rahul.Drasta.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventParticipationRequestDto {
    private String fullName;
    private String mobileNumber;
    private String email;
    private String location;
    private String eventId;
    private String totalHours;
    private LocalDate startDate;
    private LocalDate endDate;
}