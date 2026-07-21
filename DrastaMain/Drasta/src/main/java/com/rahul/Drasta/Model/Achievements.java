package com.rahul.Drasta.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "achievements")
public class Achievements {

    private String id;
    @Indexed(unique = true)
    private String title;
    private String description;
    private String imageUrl;
    private LocalDateTime createAt;
}
