package com.rahul.Drasta.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "blog_rejections")
public class BlogRejection {
    
    @Id
    private String id;
    private String blogId;
    private String reason;
    private LocalDateTime rejectionDate;
    private boolean isNotified;
    private boolean isResolved;
}