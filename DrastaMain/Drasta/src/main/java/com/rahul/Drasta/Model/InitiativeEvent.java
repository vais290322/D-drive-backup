package com.rahul.Drasta.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "initiative-event")
public class InitiativeEvent {

    private String id;
    private String title; // e.g., "Daily and weekly food distribution drives"
    private String imageUrl;
    private String eventId;
    private String location;
    private LocalDate date;
    private LocalDate eventEndDate;
    private String totalHours;

    private InitiativeCategory category;
}
