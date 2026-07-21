package com.rahul.Drasta.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor

@Document(collection = "blog")
public class BlogPost {

    private String id;
    private String title;
    private String content;
    private String bannerImageUrl;
//    private List<String> tag;
    private boolean popular;
    private boolean publish;
    private LocalDateTime publishDate;
    private LocalDateTime updateDate;
    private String author;
    private String userId;
    private String readTime;
    private String status; // "PENDING", "APPROVED", "REJECTED"
    private boolean needsReview; // Flag to indicate if post was updated after rejection
}
