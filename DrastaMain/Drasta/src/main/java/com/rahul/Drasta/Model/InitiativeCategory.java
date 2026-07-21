package com.rahul.Drasta.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "initiative-category")
public class InitiativeCategory {
    private String id;
    private String title; // e.g., "Health & Nutrition"
    private String description; // Overview paragraph
}
