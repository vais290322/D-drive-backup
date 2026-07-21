package com.rahul.Drasta.Model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "volunteer")
public class Volunteer {

    private String id;
    private String fullName;
    private String dob;
    private String number;
    private String email;
    private String preferredRole;
    private String language;
    private String skill;
    private String bloodGroup;
    private String preferredState;
    private String preferredCity;
    private String description;
    private String profileImage;
    private String rejectionReason;
    private boolean active;
    private String status;

    private LocalDateTime createdAt;

}
