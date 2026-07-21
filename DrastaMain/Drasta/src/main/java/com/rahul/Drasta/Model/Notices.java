package com.rahul.Drasta.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "notices")
public class Notices {

    private String id;
    private String content;
    private String redirectUrl;
    private String date;
    private boolean primary;
    private boolean showNotice;
    private LocalDateTime createAt;

}
