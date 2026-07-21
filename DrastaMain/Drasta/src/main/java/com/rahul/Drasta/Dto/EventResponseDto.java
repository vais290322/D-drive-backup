package com.rahul.Drasta.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventResponseDto {
    private String title;
    private String imageUrl;
    private LocalDate date;
    private String location;
    private String totalHours;
    private LocalDate eventEndDate;
    private String eventId;
    
    // Category information
//    private String categoryId;
//    private String categoryTitle;

}
