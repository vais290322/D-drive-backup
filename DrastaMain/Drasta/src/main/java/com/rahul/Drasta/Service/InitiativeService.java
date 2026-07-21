package com.rahul.Drasta.Service;

import com.rahul.Drasta.Dto.CategoryWithEventsDto;
import com.rahul.Drasta.Dto.EventResponseDto;
import com.rahul.Drasta.Exception.NotFoundException;
import com.rahul.Drasta.Model.InitiativeCategory;
import com.rahul.Drasta.Model.InitiativeEvent;
import com.rahul.Drasta.Repository.InitiativeCategoryRepository;
import com.rahul.Drasta.Repository.InitiativeEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class InitiativeService {

    @Autowired
    private InitiativeCategoryRepository categoryRepo;

    @Autowired
    private InitiativeEventRepository eventRepo;

    public InitiativeCategory createCategory(InitiativeCategory category) {
        return categoryRepo.save(category);
    }

    public InitiativeEvent createEvent(InitiativeEvent event) {
        // Fetch full category object from DB using the id
//        String categoryId = event.getCategory().getId();
//        InitiativeCategory category = categoryRepo.findById(categoryId)
//                .orElseThrow(() -> new RuntimeException("Category not found"));
//
//        event.setCategory(category); // Replace partial category with full one

//        event.setDate(LocalDate.now());
        return eventRepo.save(event);
    }

    public InitiativeEvent updateEvent(String eventId, InitiativeEvent updatedEvent) {
        InitiativeEvent existingEvent = eventRepo.findById(eventId)
                .orElseThrow(() -> new NotFoundException("Initiative event not found"));

        // Update title
        if (updatedEvent.getTitle() != null) {
            existingEvent.setTitle(updatedEvent.getTitle());
        }

        // Update description
//        if (updatedEvent.getDescription() != null) {
//            existingEvent.setDescription(updatedEvent.getDescription());
//        }

        // Update image URL
        if (updatedEvent.getImageUrl() != null) {
            existingEvent.setImageUrl(updatedEvent.getImageUrl());
        }

        // Update category if provided
        if (updatedEvent.getCategory() != null && updatedEvent.getCategory().getId() != null) {
            String categoryId = updatedEvent.getCategory().getId();
            InitiativeCategory category = categoryRepo.findById(categoryId)
                    .orElseThrow(() -> new NotFoundException("Category not found"));
            existingEvent.setCategory(category);
        }

        // Optionally update the date
        if (updatedEvent.getDate() != null) {
            existingEvent.setDate(updatedEvent.getDate());
        }

        return eventRepo.save(existingEvent);
    }



    public List<InitiativeCategory> getAllCategories() {
        return categoryRepo.findAll();
    }

    public List<InitiativeEvent> getEventsByCategory(String categoryId) {
        return eventRepo.findByCategory_Id(categoryId);
    }
    
//    // Add method to get upcoming events by category
//    public List<EventResponseDto> getUpcomingEventsByCategory(String categoryId) {
//        // First, get the category to include its information
//        InitiativeCategory category = categoryRepo.findById(categoryId)
//                .orElseThrow(() -> new NotFoundException("Category not found"));
//
//        // Get the events
//        List<InitiativeEvent> events = eventRepo.findByCategory_IdAndDateAfter(categoryId, LocalDate.now());
//
//        // Convert to DTOs with category information
//        return events.stream()
//                .map(e -> {
//                    EventResponseDto dto = new EventResponseDto(
//                        e.getTitle(),
//                        e.getImageUrl(),
//                        e.getDate(),
//                        e.getLocation(),
//                        e.getTotalHours(),
//                        e.getEventEndDate(),
//                        e.getEventId()
//                    );
//
//                    // Add category information
//                    dto.setCategoryId(category.getId());
//                    dto.setCategoryTitle(category.getTitle());
//
//                    return dto;
//                })
////                .filter(dto -> !dto.getEvents().isEmpty())
//                .collect(Collectors.toList());
//    }

    public List<InitiativeEvent> getAllEvents() {
        return eventRepo.findAll();
    }
    
    // Add method to get all upcoming events
    public List<InitiativeEvent> getUpcomingEvents() {
        return eventRepo.findByDateAfter(LocalDate.now());
    }

    public void deleteInitiative(String eventId){
        InitiativeEvent existEvent = eventRepo.findByEventId(eventId);
         eventRepo.delete(existEvent);
    }

    public List<CategoryWithEventsDto> getGroupedEvents() {
        List<InitiativeCategory> categories = categoryRepo.findAll();
        List<InitiativeEvent> events = eventRepo.findAll();

        Map<String, List<InitiativeEvent>> grouped = events.stream()
                .collect(Collectors.groupingBy(e -> e.getCategory().getId()));

        return categories.stream().map(cat -> {
            List<EventResponseDto> catEvents = grouped.getOrDefault(cat.getId(), new ArrayList<>())
                    .stream()
                    // Sort events by ID (newest created first)
                    // MongoDB ObjectIds contain a timestamp component, so sorting by ID
                    // will effectively sort by creation time
                    .sorted((e1, e2) -> e2.getId().compareTo(e1.getId()))
                    .map(e -> new EventResponseDto(e.getTitle(), e.getImageUrl(), e.getDate(), e.getLocation(), e.getTotalHours(), e.getEventEndDate(), e.getEventId()))
                    .collect(Collectors.toList());

            return new CategoryWithEventsDto(cat.getId(), cat.getTitle(), cat.getDescription(), catEvents);
        })
        .filter(dto -> !dto.getEvents().isEmpty()) // Filter out categories with empty events
        .collect(Collectors.toList());
    }
    
    // Add method to get grouped upcoming events
    public List<CategoryWithEventsDto> getGroupedUpcomingEvents() {
        List<InitiativeCategory> categories = categoryRepo.findAll();
        LocalDate today = LocalDate.now();
        
        // Get only upcoming events
        List<InitiativeEvent> upcomingEvents = eventRepo.findByDateAfter(today);

        Map<String, List<InitiativeEvent>> grouped = upcomingEvents.stream()
                .collect(Collectors.groupingBy(e -> e.getCategory().getId()));

        return categories.stream().map(cat -> {
            List<EventResponseDto> catEvents = grouped.getOrDefault(cat.getId(), new ArrayList<>())
                    .stream()
                    // Sort events by date (nearest upcoming first)
                    .sorted(Comparator.comparing(InitiativeEvent::getDate))
                    .map(e -> new EventResponseDto(e.getTitle(), e.getImageUrl(), e.getDate(), e.getLocation(), e.getTotalHours(), e.getEventEndDate(), e.getEventId()))
                    .collect(Collectors.toList());

            return new CategoryWithEventsDto(cat.getId(), cat.getTitle(), cat.getDescription(), catEvents);
        })
        .filter(dto -> !dto.getEvents().isEmpty()) // Filter out categories with empty events
        .collect(Collectors.toList());
    }

    // Add this new method to get a single category with its events
    public CategoryWithEventsDto getCategoryWithEvents(String categoryId) {
        // Get the category
        InitiativeCategory category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category not found"));
        
        // Get the events for this category
        List<InitiativeEvent> events = eventRepo.findByCategory_Id(categoryId);
        
        // Convert events to DTOs
        List<EventResponseDto> eventDtos = events.stream()
                .map(e -> new EventResponseDto(
                    e.getTitle(), 
                    e.getImageUrl(), 
                    e.getDate(),
                    e.getLocation(),
                    e.getTotalHours(),
                    e.getEventEndDate(), 
                    e.getEventId()
                ))
                .collect(Collectors.toList());
        
        // Create and return the DTO
        return new CategoryWithEventsDto(
            category.getId(),
            category.getTitle(),
            category.getDescription(),
            eventDtos
        );
    }


    public void deleteCategory(String id){
        categoryRepo.deleteById(id);
    }

    // Add this method to get a single category with its upcoming events
    public CategoryWithEventsDto getCategoryWithUpcomingEvents(String categoryId) {
        // Get the category
        InitiativeCategory category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category not found"));
        
        // Get the upcoming events for this category
        List<InitiativeEvent> events = eventRepo.findByCategory_IdAndDateAfter(categoryId, LocalDate.now());
        
        // Convert events to DTOs and sort by date in ascending order (nearest upcoming first)
        List<EventResponseDto> eventDtos = events.stream()
                .sorted(Comparator.comparing(InitiativeEvent::getDate))
                .map(e -> new EventResponseDto(
                    e.getTitle(), 
                    e.getImageUrl(), 
                    e.getDate(),
                    e.getLocation(),
                    e.getTotalHours(),
                    e.getEventEndDate(), 
                    e.getEventId()
                ))
                .collect(Collectors.toList());
        
        // Create and return the DTO
        return new CategoryWithEventsDto(
            category.getId(),
            category.getTitle(),
            category.getDescription(),
            eventDtos
        );
    }
}
