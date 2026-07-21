package com.rahul.Drasta.Controller;

import com.rahul.Drasta.Dto.EventParticipationRequestDto;
import com.rahul.Drasta.Dto.ResponseDto;
import com.rahul.Drasta.Exception.NotFoundException;
import com.rahul.Drasta.Model.EventParticipation;
import com.rahul.Drasta.Model.Volunteer;
import com.rahul.Drasta.Repository.VolunteerRepository;
import com.rahul.Drasta.Service.EventParticipationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/event-participation")
public class EventParticipationController {

    @Autowired
    private EventParticipationService participationService;

    @Autowired
    private VolunteerRepository volunteerRepository;
    
    @PostMapping("/register")
    public ResponseEntity<ResponseDto> registerForEvent(@RequestBody EventParticipationRequestDto requestDto) {
        EventParticipation participation = participationService.registerForEvent(requestDto);
        return new ResponseEntity<>(new ResponseDto(true, "Successfully registered for the event", participation), HttpStatus.CREATED);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/event/{eventId}")
    public ResponseEntity<ResponseDto> getParticipationByEventId(@PathVariable String eventId) {
        List<EventParticipation> participation = participationService.getParticipationByEventId(eventId);
        return new ResponseEntity<>(new ResponseDto(true, "Participation fetched successfully", participation), HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('ADMIN') or hasRole('VOLUNTEER')")
    @GetMapping("/volunteer")
    public ResponseEntity<ResponseDto> getParticipationByVolunteerId(@RequestParam(required = false) String volunteerId,Authentication authentication) {

        String volLoggedId = authentication.getName();

        Volunteer volunteer = volunteerRepository.findByEmail(volLoggedId)
                .orElseThrow(() -> new NotFoundException("Volunteer not found with email: " + volLoggedId));
//        if (volunteerId){
//            List<EventParticipation> participation = participationService.getParticipationByVolunteerId(volLoggedId);
//        }
        List<EventParticipation> participation = participationService.getParticipationByVolunteerId(volunteer.getId());
        return new ResponseEntity<>(new ResponseDto(true, "Participation fetched successfully", participation), HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/email/{email}")
    public ResponseEntity<ResponseDto> getParticipationByEmail(@PathVariable String email) {
        List<EventParticipation> participation = participationService.getParticipationByEmail(email);
        return new ResponseEntity<>(new ResponseDto(true, "Participation fetched successfully", participation), HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ResponseDto> getAllParticipation() {
        List<EventParticipation> participation = participationService.getAllParticipation();
        return new ResponseEntity<>(new ResponseDto(true, "All participations fetched successfully", participation), HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('VOLUNTEER')")
    @PostMapping("/volunteer-register/{eventId}")
    public ResponseEntity<ResponseDto> volunteerRegisterForEvent(
            @PathVariable String eventId,
            Authentication authentication) {
        
        // Get the volunteer email from the authentication token
        String volunteerEmail = authentication.getName();
        
        // Set the email in the request DTO
//        requestDto.setEmail(volunteerEmail);
        
        // Call the service to register for the event
        EventParticipation participation = participationService.registerVolunteerForEvent(eventId,volunteerEmail);
        
        return new ResponseEntity<>(new ResponseDto(true, "Successfully registered for the event", participation), HttpStatus.CREATED);
    }
}