package com.rahul.Drasta.Service;

import com.rahul.Drasta.Dto.VolunteerDto;
import com.rahul.Drasta.Exception.NotFoundException;
import com.rahul.Drasta.Model.Volunteer;
import com.rahul.Drasta.Repository.VolunteerRepository;
import com.rahul.Drasta.auth.model.User;
import com.rahul.Drasta.auth.repository.UserRepository;
import com.rahul.Drasta.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VolunteerService {

    private final VolunteerRepository volunteerRepository;
    private final CloudinaryService cloudinaryService;

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final UserService userService;

    public Volunteer saveVolunteer(VolunteerDto volunteer){

        String imageUrl = null;
        if (volunteer.getProfileImage() !=null && !volunteer.getProfileImage().isEmpty()){
            imageUrl = cloudinaryService.uploadImage(volunteer.getProfileImage());
        }

        Volunteer saveDetails = new Volunteer();

        saveDetails.setFullName(volunteer.getFullName());
        saveDetails.setDob(volunteer.getDob());
        saveDetails.setNumber(volunteer.getNumber());
        saveDetails.setEmail(volunteer.getEmail());
        saveDetails.setPreferredRole(volunteer.getPreferredRole());
        saveDetails.setLanguage(volunteer.getLanguage());
        saveDetails.setSkill(volunteer.getSkill());
        saveDetails.setBloodGroup(volunteer.getBloodGroup());
        saveDetails.setPreferredState(volunteer.getPreferredState());
        saveDetails.setPreferredCity(volunteer.getPreferredCity());
        saveDetails.setDescription(volunteer.getDescription());
        saveDetails.setProfileImage(imageUrl);
        saveDetails.setCreatedAt(LocalDateTime.now());
        saveDetails.setStatus("PENDING");

        System.out.println(" i m id "+saveDetails.getId());

        Volunteer savedVolunteer = volunteerRepository.save(saveDetails);


        User saveAuth = new User();

        String formattedDob = LocalDate.parse(volunteer.getDob()).format(DateTimeFormatter.ofPattern("ddMMyyyy"));
        System.out.println(" i m id "+savedVolunteer.getId());
        saveAuth.setFullName(volunteer.getFullName());
        saveAuth.setEmail(volunteer.getEmail());
        saveAuth.setPhoneNumber(volunteer.getNumber());
        saveAuth.setUserId(savedVolunteer.getId());
        saveAuth.setActive(false);
        saveAuth.setRole("VOLUNTEER");
        saveAuth.setPassword(passwordEncoder.encode(formattedDob));

        userService.save(saveAuth);
        return savedVolunteer;
    }

    public List<Volunteer> getAllVolunteer(){
        return volunteerRepository.findAll();
    }

    public List<Volunteer> getAllVolunteerOrActive(){
        return volunteerRepository.findByActiveTrue();
    }

//    public List<Volunteer> inactiveVolunteer(String active ,String status){
//       boolean actives = Boolean.parseBoolean(active);
//       return volunteerRepository.findByActiveAndStatus(actives,status);
//    }

    public List<Volunteer> inactiveVolunteer(){
//        boolean actives = Boolean.parseBoolean(active);
        return volunteerRepository.findByStatus("PENDING");
    }

    public Optional<Volunteer> getVolunteerById(String id){
        return volunteerRepository.findById(id);
    }

//    public Volunteer volunteerActiveOrInactive(String id){
//        Volunteer activeVolunteer = volunteerRepository.findById(id)
//                .orElseThrow(()-> new NotFoundException("Volunteer not found"));
//        activeVolunteer.setActive(true);
//        return volunteerRepository.save(activeVolunteer);
//    }

    public Volunteer volunteerActiveOrInactive(String id) {
        // Find volunteer by ID or throw exception if not found
        Volunteer volunteer = volunteerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Volunteer not found"));

        // Toggle the active status
        boolean newStatus = !volunteer.isActive();
        volunteer.setActive(newStatus);

        // Save updated volunteer
        return volunteerRepository.save(volunteer);
    }


//    public Volunteer updateVolunteer(String id, VolunteerDto newVolunteer){
//        Volunteer existVolunteer = volunteerRepository.findById(id)
//                .orElseThrow(()-> new NotFoundException("Volunteer not found"));
//
//        if (newVolunteer.getProfileImage() !=null && !newVolunteer.getProfileImage().isEmpty()){
//            String oldImage = existVolunteer.getProfileImage();
//            if (oldImage !=null && !oldImage.isEmpty()){
//                cloudinaryService.deleteImageByUrl(oldImage);
//            }
//            String imageUrl = cloudinaryService.uploadImage(newVolunteer.getProfileImage());
//            existVolunteer.setProfileImage(imageUrl);
//        }
//
//        if (newVolunteer.getFullName() != null && !newVolunteer.getFullName().isEmpty()){
//            existVolunteer.setFullName(newVolunteer.getFullName());
//        }
//        if (newVolunteer.getEmail() !=null && !newVolunteer.getEmail().isEmpty()){
//            existVolunteer.setEmail(newVolunteer.getEmail());
//        }
//        if (newVolunteer.getNumber() !=null && !newVolunteer.getNumber().isEmpty()){
//            existVolunteer.setNumber(newVolunteer.getNumber());
//        }
//        if (newVolunteer.getDob() !=null && !newVolunteer.getDob().isEmpty()){
//            existVolunteer.setDob(newVolunteer.getDob());
//        }
//        if (newVolunteer.getBloodGroup() !=null && !newVolunteer.getBloodGroup().isEmpty()){
//            existVolunteer.setBloodGroup(newVolunteer.getBloodGroup());
//        }
//        if (newVolunteer.getLanguage() !=null && !newVolunteer.getLanguage().isEmpty()){
//            existVolunteer.setLanguage(newVolunteer.getLanguage());
//        }
//        if (newVolunteer.getDescription() !=null && !newVolunteer.getDescription().isEmpty()){
//            existVolunteer.setDescription(newVolunteer.getDescription());
//        }
//        if (newVolunteer.getPreferredCity() !=null && !newVolunteer.getPreferredCity().isEmpty()){
//            existVolunteer.setPreferredCity(newVolunteer.getPreferredCity());
//        }
//        if (newVolunteer.getPreferredState() !=null && !newVolunteer.getPreferredState().isEmpty()){
//            existVolunteer.setPreferredState(newVolunteer.getPreferredState());
//        }
//        if (newVolunteer.getSkill() !=null && !newVolunteer.getSkill().isEmpty()){
//            existVolunteer.setSkill(newVolunteer.getSkill());
//        }
//
//        return volunteerRepository.save(existVolunteer);
//
//    }


    public Volunteer updateVolunteer(String id, VolunteerDto newVolunteer) {
        Volunteer existVolunteer = volunteerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Volunteer not found"));

        // Handle profile image update
        if (newVolunteer.getProfileImage() != null && !newVolunteer.getProfileImage().isEmpty()) {
            String oldImage = existVolunteer.getProfileImage();
            if (oldImage != null && !oldImage.isEmpty()) {
                cloudinaryService.deleteImageByUrl(oldImage);
            }
            String imageUrl = cloudinaryService.uploadImage(newVolunteer.getProfileImage());
            existVolunteer.setProfileImage(imageUrl);
        }

        // Field updates
        if (newVolunteer.getFullName() != null && !newVolunteer.getFullName().isEmpty()) {
            existVolunteer.setFullName(newVolunteer.getFullName());
        }
        if (newVolunteer.getStatus() != null && !newVolunteer.getStatus().isEmpty()) {
            existVolunteer.setStatus(newVolunteer.getStatus());
        }
        if (newVolunteer.getActive() != null) {
            existVolunteer.setActive(newVolunteer.getActive());
        }
        if (newVolunteer.getEmail() != null && !newVolunteer.getEmail().isEmpty()) {
            existVolunteer.setEmail(newVolunteer.getEmail());
        }
        if (newVolunteer.getNumber() != null && !newVolunteer.getNumber().isEmpty()) {
            existVolunteer.setNumber(newVolunteer.getNumber());
        }
        if (newVolunteer.getDob() != null && !newVolunteer.getDob().isEmpty()) {
            existVolunteer.setDob(newVolunteer.getDob());
        }
        if (newVolunteer.getBloodGroup() != null && !newVolunteer.getBloodGroup().isEmpty()) {
            existVolunteer.setBloodGroup(newVolunteer.getBloodGroup());
        }
        if (newVolunteer.getLanguage() != null && !newVolunteer.getLanguage().isEmpty()) {
            existVolunteer.setLanguage(newVolunteer.getLanguage());
        }
        if (newVolunteer.getDescription() != null && !newVolunteer.getDescription().isEmpty()) {
            existVolunteer.setDescription(newVolunteer.getDescription());
        }
        if (newVolunteer.getPreferredCity() != null && !newVolunteer.getPreferredCity().isEmpty()) {
            existVolunteer.setPreferredCity(newVolunteer.getPreferredCity());
        }
        if (newVolunteer.getPreferredState() != null && !newVolunteer.getPreferredState().isEmpty()) {
            existVolunteer.setPreferredState(newVolunteer.getPreferredState());
        }
        if (newVolunteer.getSkill() != null && !newVolunteer.getSkill().isEmpty()) {
            existVolunteer.setSkill(newVolunteer.getSkill());
        }

        // Save updated volunteer
        Volunteer updatedVolunteer = volunteerRepository.save(existVolunteer);
        System.out.println("Updated Volunteer: " + updatedVolunteer);

        // Prepare user update
        User userUpdate = new User();

        if (newVolunteer.getFullName() != null && !newVolunteer.getFullName().isEmpty()) {
            userUpdate.setFullName(newVolunteer.getFullName());
        }
        if (newVolunteer.getEmail() != null && !newVolunteer.getEmail().isEmpty()) {
            userUpdate.setEmail(newVolunteer.getEmail());
        }
        if (newVolunteer.getNumber() != null && !newVolunteer.getNumber().isEmpty()) {
            userUpdate.setPhoneNumber(newVolunteer.getNumber());
        }

//        if (newVolunteer.getActive() !=null){
//            userUpdate.setActive(newVolunteer.getActive());
//        }
        if (newVolunteer.getDob() != null && !newVolunteer.getDob().isEmpty()) {
            String formattedDob = LocalDate.parse(newVolunteer.getDob())
                    .format(DateTimeFormatter.ofPattern("ddMMyyyy"));
            userUpdate.setPassword(passwordEncoder.encode(formattedDob));
        }

        userService.updateUser(updatedVolunteer.getId(), userUpdate);

        return updatedVolunteer;
    }





    public Optional<Volunteer> findByEmail(String email){
        return volunteerRepository.findByEmail(email);
    }

    public void deleteVolunteer (String id){
        Volunteer existVolunteer = volunteerRepository.findById(id)
                .orElseThrow(()->new NotFoundException("Volunteer not found"));
        volunteerRepository.delete(existVolunteer);
    }

    public Volunteer setActiveVolunteer(String id){
        Volunteer activeVolunteer = volunteerRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Volunteer not found"));

        activeVolunteer.setActive(true);
        activeVolunteer.setStatus("APPROVED");
        User existVolunteer = userService.findByUserId(id)
                .orElseThrow(()-> new RuntimeException("user not found"));
        existVolunteer.setActive(true);
        userRepository.save(existVolunteer);

       return volunteerRepository.save(activeVolunteer);
    }


    public Volunteer rejectVolunteer(String id, String reason) {
        // Find volunteer by ID or throw exception if not found
        Volunteer volunteer = volunteerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Volunteer not found"));
        
        // Set volunteer as inactive
        volunteer.setActive(false);
        volunteer.setRejectionReason(reason);
        volunteer.setStatus("REJECTED");
        
        // If there's a corresponding user account, update it too
        try {
            User user = userService.findByUserId(id)
                    .orElse(null);
            if (user != null) {
                user.setActive(false);
                userRepository.save(user);
            }
        } catch (Exception e) {
            // Log the error but continue with volunteer rejection
            System.err.println("Error updating user status: " + e.getMessage());
        }
        
        // Save and return updated volunteer
        return volunteerRepository.save(volunteer);
    }

    public long countActiveVolunteers() {
        return volunteerRepository.countByActiveTrue();
    }

    public long countInactiveVolunteers() {
        return volunteerRepository.countByActiveFalseAndStatus("PENDING");
    }

    public long countVolunteersRegisteredLastMonth() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = now.minusMonths(1);
        return volunteerRepository.countByCreatedAtBetween(start, now);
    }

    // Add these new search methods
    public List<Volunteer> searchByName(String name) {
        return volunteerRepository.findByFullNameContainingIgnoreCase(name);
    }
    
    public List<Volunteer> searchBySkill(String skill) {
        return volunteerRepository.findBySkillContainingIgnoreCase(skill);
    }
    
    public List<Volunteer> searchByRole(String role) {
        return volunteerRepository.findByPreferredRoleContainingIgnoreCase(role);
    }
    
    public List<Volunteer> searchByState(String state) {
        return volunteerRepository.findByPreferredStateContainingIgnoreCase(state);
    }
    
    public List<Volunteer> searchByCity(String city) {
        return volunteerRepository.findByPreferredCityContainingIgnoreCase(city);
    }
}
