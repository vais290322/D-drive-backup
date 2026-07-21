package com.rahul.Drasta.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "events")
public class Events {

    private String id;
    private String eventTitle;
    private String description;
    private String eventBannerUrl;
    private String location;
    private String totalHours;
    private LocalDate eventDate;
    private LocalDate eventEndDate;
    private String categoryId;


}
