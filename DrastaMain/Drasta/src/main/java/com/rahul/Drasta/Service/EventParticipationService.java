package com.rahul.Drasta.Service;

import com.rahul.Drasta.Dto.EventParticipationRequestDto;
import com.rahul.Drasta.Exception.NotFoundException;
import com.rahul.Drasta.Model.EventParticipation;
import com.rahul.Drasta.Model.Events;
import com.rahul.Drasta.Model.Volunteer;
import com.rahul.Drasta.Repository.EventParticipationRepository;
import com.rahul.Drasta.Repository.EventRepository;
import com.rahul.Drasta.Repository.VolunteerRepository;
import com.rahul.Drasta.auth.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class EventParticipationService {

    @Autowired
    private EventParticipationRepository participationRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private VolunteerRepository volunteerRepository;
    
    @Autowired
    private NotificationService notificationService; // Add NotificationService dependency
    
    public EventParticipation registerVolunteerForEvent(String eventId, String volunteerEmail) {
        // Verify the event exists
        Events event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException("Event not found"));
        
        // Get the volunteer by email
        Volunteer volunteer = volunteerRepository.findByEmail(volunteerEmail)
                .orElseThrow(() -> new NotFoundException("Volunteer not found with email: " + volunteerEmail));
        
        // Create participation record
        EventParticipation participation = new EventParticipation();
        participation.setFullName(volunteer.getFullName());
        participation.setMobileNumber(volunteer.getNumber());
        participation.setEmail(volunteerEmail);
        participation.setLocation(event.getLocation());
        participation.setEventId(eventId);
        participation.setEventTitle(event.getEventTitle());
        participation.setTotalHours(event.getTotalHours());
        participation.setStartDate(event.getEventDate());
        participation.setEndDate(event.getEventEndDate());
        participation.setVolunteerId(volunteer.getId());
        participation.setCreatedAt(LocalDateTime.now());
        
        EventParticipation savedParticipation = participationRepository.save(participation);
        
        // Send notification email
        notificationService.sendEventRegistrationNotification(savedParticipation);
        
        return savedParticipation;
    }
    
    public EventParticipation registerForEvent(EventParticipationRequestDto requestDto) {
        // Verify the event exists
        Events event = eventRepository.findById(requestDto.getEventId())
                .orElseThrow(() -> new NotFoundException("Event not found"));
        
        // Create participation record
        EventParticipation participation = new EventParticipation();
        participation.setFullName(requestDto.getFullName());
        participation.setMobileNumber(requestDto.getMobileNumber());
        participation.setEmail(requestDto.getEmail());
        participation.setLocation(requestDto.getLocation());
        participation.setEventId(requestDto.getEventId());
        participation.setEventTitle(event.getEventTitle());
        participation.setTotalHours(requestDto.getTotalHours());
        participation.setStartDate(requestDto.getStartDate());
        participation.setEndDate(requestDto.getEndDate());
        participation.setCreatedAt(LocalDateTime.now());
        
        // Check if the participant is a registered volunteer
        Optional<Volunteer> volunteerOpt = volunteerRepository.findByEmail(requestDto.getEmail());
        volunteerOpt.ifPresent(volunteer -> participation.setVolunteerId(volunteer.getId()));
        
        EventParticipation savedParticipation = participationRepository.save(participation);
        
        // Send notification email
        notificationService.sendEventRegistrationNotification(savedParticipation);
        
        return savedParticipation;
    }
    
    public List<EventParticipation> getParticipationByEventId(String eventId) {
        return participationRepository.findByEventId(eventId);
    }
    
//    public List<EventParticipation> getParticipationByVolunteerId(String volunteerId) {
//        return participationRepository.findByVolunteerId(volunteerId);
//    }

    public List<EventParticipation> getParticipationByVolunteerId(String volunteerId) {
        List<EventParticipation> participations = participationRepository.findByVolunteerId(volunteerId);
        participations.sort(Comparator.comparing(EventParticipation::getEndDate).reversed()); // Sort by most recent endDate
        return participations;
    }


    public List<EventParticipation> getParticipationByEmail(String email) {
        return participationRepository.findByEmail(email);
    }
    
    public List<EventParticipation> getAllParticipation() {
        return participationRepository.findAll();
    }
}