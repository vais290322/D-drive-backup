package com.rahul.Drasta.Service;

import com.rahul.Drasta.Dto.EventRequestDto;
import com.rahul.Drasta.Exception.NotFoundException;
import com.rahul.Drasta.Model.Events;
import com.rahul.Drasta.Model.InitiativeCategory;
import com.rahul.Drasta.Model.InitiativeEvent;
import com.rahul.Drasta.Repository.EventRepository;
import com.rahul.Drasta.Repository.InitiativeCategoryRepository;
import com.rahul.Drasta.Repository.InitiativeEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.ws.rs.BadRequestException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private InitiativeCategoryRepository categoryRepository;

    @Autowired
    private InitiativeService initiativeService;

    @Autowired
    private InitiativeEventRepository initiativeEventRepository;

    public Events createEvent(EventRequestDto event) {

        String bannerImage = null;
       if (event !=null && event.getEventBannerUrl() !=null && !event.getEventBannerUrl().isEmpty()){
           bannerImage = cloudinaryService.uploadImage(event.getEventBannerUrl());
       }
        Events events = new Events();
        events.setEventTitle(event.getEventTitle());
        events.setEventDate(event.getEventDate());
        events.setDescription(event.getDescription());
        events.setLocation(event.getLocation());
        events.setCategoryId(event.getCategoryId());
        events.setEventDate(event.getEventDate());
        events.setEventBannerUrl(bannerImage);
        events.setTotalHours(event.getTotalHours());
        events.setEventEndDate(event.getEventEndDate());

        eventRepository.save(events);

        //for initiative event creation
        InitiativeEvent initiativeEvent = new InitiativeEvent();
        initiativeEvent.setTitle(event.getEventTitle());
        initiativeEvent.setImageUrl(bannerImage);
        initiativeEvent.setEventId(events.getId());
        initiativeEvent.setDate(event.getEventDate());
        initiativeEvent.setEventEndDate(event.getEventEndDate());
        initiativeEvent.setLocation(event.getLocation());
        initiativeEvent.setTotalHours(event.getTotalHours());

        // fetch full category using ID

        if (event.getCategoryId() == null) {
            throw new BadRequestException("Category ID must be provided");
        }

        String categoryId = event.getCategoryId();  // this must be present in EventRequestDto
        InitiativeCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category not found"));
        initiativeEvent.setCategory(category);

        initiativeService.createEvent(initiativeEvent);
//        return eventRepository.save(events);
        return events;
    }

    public Events updateEvent(String eventId, EventRequestDto eventRequestDto) {
        // Fetch existing event
        Events existingEvent = eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException("Event not found"));

        // Update fields only if provided
        if (eventRequestDto.getEventTitle() != null) {
            existingEvent.setEventTitle(eventRequestDto.getEventTitle());
        }

        if (eventRequestDto.getEventDate() != null) {
            existingEvent.setEventDate(eventRequestDto.getEventDate());
        }

        if (eventRequestDto.getEventEndDate() !=null){
            existingEvent.setEventEndDate(eventRequestDto.getEventEndDate());
        }
        if (eventRequestDto.getTotalHours() !=null){
            existingEvent.setTotalHours(eventRequestDto.getTotalHours());
        }

        if (eventRequestDto.getDescription() != null) {
            existingEvent.setDescription(eventRequestDto.getDescription());
        }

        if (eventRequestDto.getLocation() != null) {
            existingEvent.setLocation(eventRequestDto.getLocation());
        }

        if (eventRequestDto.getCategoryId() != null) {
            InitiativeCategory category = categoryRepository.findById(eventRequestDto.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Category not found"));
            existingEvent.setCategoryId(eventRequestDto.getCategoryId());

            // Also update InitiativeEvent's category
            InitiativeEvent initiativeEvent = initiativeEventRepository.findByEventId(eventId);  // You need this method in InitiativeService
//                    orElseThrow(()-> new NotFoundException("Initiative event not found"));
            if (initiativeEvent != null) {
                initiativeEvent.setCategory(category);
                initiativeService.updateEvent(eventId,initiativeEvent); // You also need an update method
            }
        }

        // Handle banner image update
        if (eventRequestDto.getEventBannerUrl() != null && !eventRequestDto.getEventBannerUrl().isEmpty()) {
            String bannerImage = cloudinaryService.uploadImage(eventRequestDto.getEventBannerUrl());
            existingEvent.setEventBannerUrl(bannerImage);

            // Update initiative event banner
            InitiativeEvent initiativeEvent = initiativeEventRepository.findByEventId(eventId);
            if (initiativeEvent != null) {
                initiativeEvent.setImageUrl(bannerImage);
                initiativeService.updateEvent(eventId,initiativeEvent);
            }
        }

        // Update InitiativeEvent title if event title is changed
        if (eventRequestDto.getEventTitle() != null) {
            InitiativeEvent initiativeEvent = initiativeEventRepository.findByEventId(eventId);
            if (initiativeEvent != null) {
                initiativeEvent.setTitle(eventRequestDto.getEventTitle());
                initiativeService.updateEvent(eventId,initiativeEvent);
            }
        }

        return eventRepository.save(existingEvent);
    }


    public List<Events> getUpcomingEvents() {
        return eventRepository.findByEventDateAfter(LocalDate.now());
    }

    public long getUpcomingEventsCount() {
        return eventRepository.countByEventDateAfter(LocalDate.now());
    }


    public Optional<Events> getEventById(String id) {
        return eventRepository.findById(id);
    }

    public void deleteEvent(String id) {
        initiativeService.deleteInitiative(id);
        eventRepository.deleteById(id);
    }

    public List<Events> getAllEvents() {
        return eventRepository.findAll();
    }

    // Add these new paginated search methods
    public List<Events> searchByTitleOrLocation(String searchTerm) {
        return eventRepository.findByEventTitleOrLocationContainingIgnoreCase(searchTerm);
    }

    // Add these new paginated methods
    public Page<Events> getAllEventsPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "eventDate"));
        return eventRepository.findAll(pageable);
    }

    public Page<Events> searchByTitlePaginated(String title, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "eventDate"));
        return eventRepository.findByEventTitleContainingIgnoreCase(title, pageable);
    }

    public Page<Events> searchByDatePaginated(LocalDate date, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "eventDate"));
        return eventRepository.findByEventDate(date, pageable);
    }

    public Page<Events> searchByDateRangePaginated(LocalDate startDate, LocalDate endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "eventDate"));
        return eventRepository.findByEventDateBetween(startDate, endDate, pageable);
    }

    public Page<Events> searchByLocationPaginated(String location, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "eventDate"));
        return eventRepository.findByLocationContainingIgnoreCase(location, pageable);
    }

    public Page<Events> searchByTitleOrLocationPaginated(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "eventDate"));
        return eventRepository.findByEventTitleOrLocationContainingIgnoreCase(searchTerm, pageable);
    }
}
