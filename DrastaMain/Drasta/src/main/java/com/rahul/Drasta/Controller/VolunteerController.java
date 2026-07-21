package com.rahul.Drasta.Controller;

import com.rahul.Drasta.Dto.*;
import com.rahul.Drasta.Exception.NotFoundException;
import com.rahul.Drasta.Model.EventParticipation;
import com.rahul.Drasta.Model.Volunteer;
import com.rahul.Drasta.Service.EventParticipationService;
import com.rahul.Drasta.Service.VolunteerService;
import com.rahul.Drasta.auth.model.User;
import com.rahul.Drasta.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/volunteer")
@RequiredArgsConstructor
public class VolunteerController {

    private final VolunteerService volunteerService;
    private final EventParticipationService participationService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ResponseDto> createVolunteer(@ModelAttribute VolunteerDto volunteerDto){
        System.out.println(" i m from volunteer : "+volunteerDto);

        User existUser =  userService.findByEmail(volunteerDto.getEmail());
        if (existUser !=null){
            return new ResponseEntity<>(new ResponseDto(false,"Email already exists of this role : "+existUser.getRole(),null), HttpStatus.CONFLICT);
        }

        return new ResponseEntity<>(new ResponseDto(true,"Volunteer create successfully",volunteerService.saveVolunteer(volunteerDto)), HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ResponseDto> allVolunteer(@RequestParam(required = false) String active){

        if (active !=null){
            return new ResponseEntity<>(new ResponseDto(true,"All pending volunteer fetch successfully",volunteerService.inactiveVolunteer()),HttpStatus.OK);
        }

        List<Volunteer> allVolunteer = volunteerService.getAllVolunteer();
        if (allVolunteer.isEmpty()){
            return new ResponseEntity<>(new ResponseDto(false,"Volunteer not available",null),HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(new ResponseDto(true, "All volunteer fetched successfully", allVolunteer), HttpStatus.OK);
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/active-list")
    public ResponseEntity<ResponseDto> allVolunteerBySpecific() {

        List<Volunteer> allVolunteers = volunteerService.getAllVolunteerOrActive();

        if (allVolunteers.isEmpty()) {
            return new ResponseEntity<>(
                    new ResponseDto(false, "Volunteer not available", null),
                    HttpStatus.NOT_FOUND
            );
        }

        // Map Volunteer entities to VolunteerDTOs
        List<ActiveVolunteerDto> volunteerDTOs = allVolunteers.stream()
                .map(v -> new ActiveVolunteerDto(v.getId(), v.getFullName(), v.getProfileImage()))
                .collect(Collectors.toList());

        return new ResponseEntity<>(
                new ResponseDto(true, "All volunteers fetched successfully", volunteerDTOs),
                HttpStatus.OK
        );
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<ResponseDto> getCurrentVolunteerProfile(Authentication authentication) {
        // Extract user ID from the authentication object
        String userId = authentication.getName(); // This gets the username (email in your case)
        Optional<Volunteer> volunteer = volunteerService.findByEmail(userId);

        if (volunteer.isEmpty()) {
            return new ResponseEntity<>(new ResponseDto(false, "Volunteer profile not found", null), HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(new ResponseDto(true, "Volunteer profile fetched successfully", volunteer), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseDto> viewVolunteerById(@PathVariable String id){
        Optional<Volunteer> allVolunteer = volunteerService.getVolunteerById(id);
        if (allVolunteer.isEmpty()){
            return new ResponseEntity<>(new ResponseDto(false,"Volunteer not available",null),HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(new ResponseDto(true,"volunteer fetched successfully",allVolunteer),HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ResponseDto> updateVolunteer(@PathVariable String id, @ModelAttribute VolunteerDto volunteerDto){
        System.out.println(" i m from dto : "+volunteerDto);
        return new ResponseEntity<>(new ResponseDto(true,"Volunteer updated successfully",volunteerService.updateVolunteer(id, volunteerDto)),HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/toggle-status/{id}")
    public ResponseEntity<ResponseDto> toggleVolunteerStatus(@PathVariable String id) {
        try {
            Volunteer updatedVolunteer = volunteerService.volunteerActiveOrInactive(id);
            String message = updatedVolunteer.isActive()
                    ? "Volunteer is now active."
                    : "Volunteer is now inactive.";

            return new ResponseEntity<>(
                    new ResponseDto(true, message, updatedVolunteer),
                    HttpStatus.OK
            );
        } catch (NotFoundException e) {
            return new ResponseEntity<>(
                    new ResponseDto(false, e.getMessage(), null),
                    HttpStatus.NOT_FOUND
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ResponseDto(false, "Something went wrong", null),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto> deleteVolunteer(@PathVariable String id){
        volunteerService.deleteVolunteer(id);
        return new ResponseEntity<>(new ResponseDto(true,"Volunteer deleted successfully",null),HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/approved/{id}")
    public ResponseEntity<ResponseDto> approveVolunteer(@PathVariable String id){
        return new ResponseEntity<>(new ResponseDto(true,"Volunteer active successfully",volunteerService.setActiveVolunteer(id)),HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/reject/{id}")
    public ResponseEntity<ResponseDto> rejectVolunteer(
            @PathVariable String id,
            @RequestBody VolunteerRejectionDto rejectionDto) {
        
        try {
            Volunteer rejected = volunteerService.rejectVolunteer(id, rejectionDto.getReason());
            
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseDto(true, "Volunteer rejected successfully", rejected));
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseDto(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDto(false, "Something went wrong: " + e.getMessage(), null));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats")
    public ResponseEntity<ResponseDto> getVolunteerStats() {
        long active = volunteerService.countActiveVolunteers();
        long inactive = volunteerService.countInactiveVolunteers();
        long lastMonth = volunteerService.countVolunteersRegisteredLastMonth();

        return new ResponseEntity<>(new ResponseDto(true,"Volunteer activity fetched successfully",new VolunteerStatsDto(active, inactive, lastMonth)),HttpStatus.OK);
//        return new VolunteerStatsDto(active, inactive, lastMonth);
    }

    @GetMapping("/search")
    public ResponseEntity<ResponseDto> searchVolunteers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String city) {
        
        List<Volunteer> results = null;
        String searchType = "";
        
        if (name != null && !name.isEmpty()) {
            results = volunteerService.searchByName(name);
            searchType = "name";
        } else if (skill != null && !skill.isEmpty()) {
            results = volunteerService.searchBySkill(skill);
            searchType = "skill";
        } else if (role != null && !role.isEmpty()) {
            results = volunteerService.searchByRole(role);
            searchType = "role";
        } else if (state != null && !state.isEmpty()) {
            results = volunteerService.searchByState(state);
            searchType = "state";
        } else if (city != null && !city.isEmpty()) {
            results = volunteerService.searchByCity(city);
            searchType = "city";
        } else {
            // If no search parameters provided, return all volunteers
            results = volunteerService.getAllVolunteer();
            searchType = "all";
        }
        
        if (results.isEmpty()) {
            return new ResponseEntity<>(
                new ResponseDto(false, "No volunteers found matching your search criteria", null),
                HttpStatus.NOT_FOUND
            );
        }
        
        return new ResponseEntity<>(
            new ResponseDto(true, "Search by " + searchType + " successful", results),
            HttpStatus.OK
        );
    }

    @GetMapping("/participation-activities")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<ResponseDto> getVolunteerParticipationActivities(Authentication authentication) {
        // Extract user ID from the authentication object
        String userEmail = authentication.getName();
        Optional<Volunteer> volunteer = volunteerService.findByEmail(userEmail);
    
        if (volunteer.isEmpty()) {
            return new ResponseEntity<>(new ResponseDto(false, "Volunteer profile not found", null), HttpStatus.NOT_FOUND);
        }
        
        // Get participation activities for this volunteer
        List<EventParticipation> participations = participationService.getParticipationByVolunteerId(volunteer.get().getId());
        
        return new ResponseEntity<>(new ResponseDto(true, "Volunteer participation activities fetched successfully", participations), HttpStatus.OK);
    }
}
