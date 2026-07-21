package com.rahul.Drasta.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryWithEventsDto {
    private String categoryId;
    private String categoryTitle;
    private String categoryDescription;
    private List<EventResponseDto> events;
}
