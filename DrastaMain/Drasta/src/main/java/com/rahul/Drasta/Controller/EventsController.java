package com.rahul.Drasta.Controller;

import com.rahul.Drasta.Dto.EventRequestDto;
import com.rahul.Drasta.Dto.ResponseDto;
import com.rahul.Drasta.Exception.NotFoundException;
import com.rahul.Drasta.Model.Events;
import com.rahul.Drasta.Service.CloudinaryService;
import com.rahul.Drasta.Service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
//@CrossOrigin("*")
public class EventsController {

    @Autowired
    private EventService eventService;

//    @PostMapping
//    public ResponseEntity<ResponseDto> createEvent(@RequestPart EventRequestDto event) {
//        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(event));
//    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ResponseDto> createEvent(@ModelAttribute EventRequestDto event){

        System.out.println("i m req : "+event);
        Events saveEvents = eventService.createEvent(event);
        return new ResponseEntity<>(new ResponseDto(true,"Events created successfully",saveEvents),HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ResponseDto> updateEvent(@PathVariable String id, @ModelAttribute EventRequestDto event) {
        System.out.println("Request received: " + event);
        Events savedEvent = eventService.updateEvent(id, event);
        return new ResponseEntity<>(new ResponseDto(true, "Event updated successfully", savedEvent), HttpStatus.OK);
    }


    //    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/upcoming")
    public ResponseEntity<ResponseDto> getUpcomingEvents() {
        return new ResponseEntity<>(new ResponseDto(true,"Upcoming event fetched successfully",eventService.getUpcomingEvents()),HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ResponseDto> getAllEvents() {
        return new ResponseEntity<>(new ResponseDto(true,"All event fetched successfully",eventService.getAllEvents()),HttpStatus.OK);
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<ResponseDto> getEvent(@PathVariable String id) {
//        return eventService.getEventById(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(new));
//    }
    @GetMapping("/{id}")
    public ResponseEntity<ResponseDto> getEvent(@PathVariable String id){
        Events events = eventService.getEventById(id)
                .orElseThrow(()-> new NotFoundException("Event not found"));

        return new ResponseEntity<>(new ResponseDto(true,"Event fetched successfully",events),HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto> deleteEvent(@PathVariable String id) {
        eventService.deleteEvent(id);
        return new ResponseEntity<>(new ResponseDto(true,"Event deleted successfully",null),HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<ResponseDto> searchEvents(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<Events> results = null;
        String searchType = "";
        
        // Combined search across title and location if 'search' parameter is provided
        if (searchTerm != null && !searchTerm.isEmpty()) {
            results = eventService.searchByTitleOrLocationPaginated(searchTerm, page, size);
            searchType = "title or location";
        }
        // Search by title if provided
        else if (title != null && !title.isEmpty()) {
            results = eventService.searchByTitlePaginated(title, page, size);
            searchType = "title";
        } 
        // Search by specific date if provided
        else if (date != null && !date.isEmpty()) {
            try {
                LocalDate eventDate = LocalDate.parse(date);
                results = eventService.searchByDatePaginated(eventDate, page, size);
                searchType = "date";
            } catch (Exception e) {
                return new ResponseEntity<>(new ResponseDto(false, "Invalid date format. Please use YYYY-MM-DD format.", null), HttpStatus.BAD_REQUEST);
            }
        } 
        // Search by date range if both start and end dates are provided
        else if (startDate != null && !startDate.isEmpty() && endDate != null && !endDate.isEmpty()) {
            try {
                LocalDate start = LocalDate.parse(startDate);
                LocalDate end = LocalDate.parse(endDate);
                results = eventService.searchByDateRangePaginated(start, end, page, size);
                searchType = "date range";
            } catch (Exception e) {
                return new ResponseEntity<>(new ResponseDto(false, "Invalid date format. Please use YYYY-MM-DD format.", null), HttpStatus.BAD_REQUEST);
            }
        } 
        // Search by location if provided
        else if (location != null && !location.isEmpty()) {
            results = eventService.searchByLocationPaginated(location, page, size);
            searchType = "location";
        } 
        // Return all events if no search parameters are provided
        else {
            results = eventService.getAllEventsPaginated(page, size);
            searchType = "all";
        }
        
//        if (results.isEmpty()) {
//            return new ResponseEntity<>(new ResponseDto(false, "No events found for the given " + searchType + ".", null), HttpStatus.NOT_FOUND);
//        }
        
        return new ResponseEntity<>(new ResponseDto(true, "Events found for the given " + searchType + ".", results), HttpStatus.OK);
    }
}
