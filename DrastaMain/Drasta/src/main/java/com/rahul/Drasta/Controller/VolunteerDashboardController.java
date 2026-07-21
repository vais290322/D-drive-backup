package com.rahul.Drasta.Controller;

import com.rahul.Drasta.Dto.ResponseDto;
import com.rahul.Drasta.Model.EventParticipation;
import com.rahul.Drasta.Model.Volunteer;
import com.rahul.Drasta.Service.EventParticipationService;
import com.rahul.Drasta.Service.VolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/v1/volunteer-dashboard")
public class VolunteerDashboardController {

    @Autowired
    private EventParticipationService participationService;

    @Autowired
    private VolunteerService volunteerService;

    @PreAuthorize("hasRole('VOLUNTEER')")
    @GetMapping("/stats")
    public ResponseEntity<ResponseDto> getVolunteerStats(Authentication authentication) {
        // Get the volunteer email from the authentication token
        String volunteerEmail = authentication.getName();
        
        // Get the volunteer by email
        Optional<Volunteer> volunteerOpt = volunteerService.findByEmail(volunteerEmail);
        
        if (volunteerOpt.isEmpty()) {
            return new ResponseEntity<>(new ResponseDto(false, "Volunteer not found", null), HttpStatus.NOT_FOUND);
        }
        
        Volunteer volunteer = volunteerOpt.get();
        String volunteerId = volunteer.getId();
        
        // Get all participations for this volunteer
        List<EventParticipation> participations = participationService.getParticipationByVolunteerId(volunteerId);
        
        // Calculate statistics
        int eventsParticipated = participations.size();
        
        // Calculate total hours contributed
        int totalHours = 0;
        for (EventParticipation participation : participations) {
            try {
                totalHours += Integer.parseInt(participation.getTotalHours());
            } catch (NumberFormatException e) {
                // Handle case where totalHours is not a valid number
                // Just continue with the next participation
            }
        }
        
        // Create response map
        Map<String, Object> stats = new HashMap<>();
        stats.put("eventsParticipated", eventsParticipated);
        stats.put("hoursContributed", totalHours);
        stats.put("participations", participations);
        
        return new ResponseEntity<>(new ResponseDto(true, "Volunteer statistics fetched successfully", stats), HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('VOLUNTEER')")
    @GetMapping("/certificate/{participationId}")
    public ResponseEntity<ResponseDto> generateCertificate(@PathVariable String participationId, Authentication authentication) {
        // This would generate and return a certificate for the volunteer
        // For now, we'll just return a success message
        
        // In a real implementation, you would:
        // 1. Verify the participation belongs to the authenticated volunteer
        // 2. Generate a PDF certificate
        // 3. Return it as a downloadable file
        
        Map<String, Object> response = new HashMap<>();
        response.put("certificateUrl", "/api/v1/volunteer-dashboard/download-certificate/" + participationId);
        
        return new ResponseEntity<>(new ResponseDto(true, "Certificate generated successfully", response), HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('VOLUNTEER')")
    @GetMapping("/certificates")
    public ResponseEntity<ResponseDto> getVolunteerCertificates(Authentication authentication) {
        // Get the volunteer email from the authentication token
        String volunteerEmail = authentication.getName();
        
        // Get the volunteer by email
        Optional<Volunteer> volunteerOpt = volunteerService.findByEmail(volunteerEmail);
        
        if (volunteerOpt.isEmpty()) {
            return new ResponseEntity<>(new ResponseDto(false, "Volunteer not found", null), HttpStatus.NOT_FOUND);
        }
        
        Volunteer volunteer = volunteerOpt.get();
        String volunteerId = volunteer.getId();
        
        // Get all participations for this volunteer
        List<EventParticipation> participations = participationService.getParticipationByVolunteerId(volunteerId);
        
        // Create a list of certificate links
        List<Map<String, Object>> certificates = new ArrayList<>();
        for (EventParticipation participation : participations) {
            Map<String, Object> certificate = new HashMap<>();
            certificate.put("participationId", participation.getId());
            certificate.put("eventTitle", participation.getEventTitle());
            certificate.put("date", participation.getStartDate());
            certificate.put("previewUrl", "/api/v1/volunteer-certificate/preview/" + participation.getId());
            certificate.put("downloadUrl", "/api/v1/volunteer-certificate/download/" + participation.getId());
            certificates.add(certificate);
        }
        
        return new ResponseEntity<>(new ResponseDto(true, "Volunteer certificates fetched successfully", certificates), HttpStatus.OK);
    }
}