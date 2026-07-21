package com.rahul.Drasta.Controller;

import com.rahul.Drasta.Dto.CategoryWithEventsDto;
import com.rahul.Drasta.Dto.EventResponseDto;
import com.rahul.Drasta.Dto.ResponseDto;
import com.rahul.Drasta.Model.InitiativeCategory;
import com.rahul.Drasta.Model.InitiativeEvent;
import com.rahul.Drasta.Service.InitiativeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/initiatives")
public class InitiativeController {

    @Autowired
    private InitiativeService service;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/category")
    public ResponseDto createCategory(@RequestBody InitiativeCategory category) {

        System.out.println(" i m in : "+category);
        InitiativeCategory created = service.createCategory(category);
        return new ResponseDto(true, "Category created successfully", created);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/categories")
    public ResponseDto getAllCategories() {
        List<InitiativeCategory> categories = service.getAllCategories();
        return new ResponseDto(true, "Fetched all categories", categories);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/event")
    public ResponseDto createEvent(@RequestBody InitiativeEvent event) {
        InitiativeEvent created = service.createEvent(event);
        return new ResponseDto(true, "Event created successfully", created);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/events")
    public ResponseDto getAllEvents() {
        List<InitiativeEvent> events = service.getAllEvents();
        return new ResponseDto(true, "Fetched all events", events);
    }
    
    @GetMapping("/events/upcoming")
    public ResponseDto getUpcomingEvents() {
        List<InitiativeEvent> events = service.getUpcomingEvents();
        return new ResponseDto(true, "Fetched upcoming events", events);
    }

//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/events/category/{categoryId}")
//    public ResponseDto getEventsByCategory(@PathVariable String categoryId) {
//        List<InitiativeEvent> events = service.getEventsByCategory(categoryId);
//        return new ResponseDto(true, "Fetched events by category", events);
//    }
    
//    @GetMapping("/events/upcoming/{categoryId}")
//    @GetMapping("/events/category/{categoryId}")
//    public ResponseDto getUpcomingEventsByCategory(@PathVariable String categoryId) {
//        List<EventResponseDto> events = service.getUpcomingEventsByCategory(categoryId);
//        return new ResponseDto(true, "Fetched upcoming events by category", events);
//    }

    @GetMapping("/category/{categoryId}/events")
    public ResponseDto getCategoryWithEvents(@PathVariable String categoryId) {
        CategoryWithEventsDto categoryWithEvents = service.getCategoryWithEvents(categoryId);
        return new ResponseDto(true, "Fetched category with events", categoryWithEvents);
    }

//    @GetMapping("/category/{categoryId}/upcoming-events")
    @GetMapping("/events/category/{categoryId}")
    public ResponseDto getCategoryWithUpcomingEvents(@PathVariable String categoryId) {
        CategoryWithEventsDto categoryWithEvents = service.getCategoryWithUpcomingEvents(categoryId);
        return new ResponseDto(true, "Fetched category with upcoming events", categoryWithEvents);
    }

    @GetMapping("/grouped")
    public ResponseDto getGrouped() {
        List<CategoryWithEventsDto> grouped = service.getGroupedEvents();
        return new ResponseDto(true, "Grouped events fetched", grouped);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ResponseDto> deleteCategory(@PathVariable String id){
        service.deleteCategory(id);
        return new ResponseEntity<>(new ResponseDto(true,"Category deleted successfully",null), HttpStatus.OK);
    }
    
    @GetMapping("/grouped/upcoming")
    public ResponseDto getGroupedUpcoming() {
        List<CategoryWithEventsDto> grouped = service.getGroupedUpcomingEvents();
        return new ResponseDto(true, "Grouped upcoming events fetched", grouped);
    }
}
