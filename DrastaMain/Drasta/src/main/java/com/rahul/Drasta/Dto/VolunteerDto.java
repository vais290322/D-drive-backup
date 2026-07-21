package com.rahul.Drasta.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
public class VolunteerDto {
    private String id;
    private String fullName;
    private String dob;
    private String number;
    private String email;
    private String preferredRole;
    private String language;
    private String skill;

    private String preferredState;
    private String preferredCity;

    private String bloodGroup;
    private String description;
    private MultipartFile profileImage;
    private String status;
    private Boolean active;

//    public VolunteerDto(String id, String fullName, String profileImage) {
//        this.id =id;
//        this.fullName =fullName;
//        this.profileImage = profileImage;
//    }
}


