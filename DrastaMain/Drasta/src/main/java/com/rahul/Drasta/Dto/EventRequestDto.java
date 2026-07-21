package com.rahul.Drasta.Dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class EventRequestDto {

    private String id;
    private String eventTitle;
    private String description;
    private MultipartFile eventBannerUrl;
    private String location;
//    private List<String> requiredSkills;
    private String totalHours;
    private LocalDate eventDate;
    private LocalDate eventEndDate;
    private String categoryId;
}
