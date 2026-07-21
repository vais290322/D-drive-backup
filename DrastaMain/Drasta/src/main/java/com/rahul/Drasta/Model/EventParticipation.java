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
@Document(collection = "event_participations")
public class EventParticipation {

    private String id;
    private String fullName;
    private String mobileNumber;
    private String email;
    private String location;
    private String eventTitle;
    private String totalHours;
    private LocalDate startDate;
    private LocalDate endDate;
    
    // References to related entities
    private String eventId;
    private String volunteerId; // Optional - if the participant is a registered volunteer
    
    private LocalDateTime createdAt;
}