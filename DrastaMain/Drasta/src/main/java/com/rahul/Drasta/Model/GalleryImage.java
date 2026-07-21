package com.rahul.Drasta.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "gallery")
public class GalleryImage {

    private String id;

    private String category; // Optional: "Food Distribution", "Blood Camp", etc.
    private String imageUrl;
    private String publicId; // Cloudinary public ID to delete image later
    private LocalDateTime uploadedAt = LocalDateTime.now();


}
