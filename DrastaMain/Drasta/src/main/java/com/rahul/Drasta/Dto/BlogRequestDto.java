package com.rahul.Drasta.Dto;


import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Data
public class BlogRequestDto {
        private String title;
        private String content;
        private MultipartFile bannerImage;
        //    private List<String> tag;
        private boolean popular;
        private boolean publish;
        private LocalDateTime publishDate;
        private LocalDateTime updateDate;
        private String author;
        private String authorId;
        private String readTime;
}
