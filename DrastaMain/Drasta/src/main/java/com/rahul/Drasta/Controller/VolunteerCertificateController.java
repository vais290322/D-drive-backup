package com.rahul.Drasta.Controller;

import com.rahul.Drasta.Dto.ResponseDto;
import com.rahul.Drasta.Exception.NotFoundException;
import com.rahul.Drasta.Model.Volunteer;
import com.rahul.Drasta.Service.CertificateService;
import com.rahul.Drasta.Service.VolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/volunteer-certificate")
public class VolunteerCertificateController {

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private VolunteerService volunteerService;

//    @PreAuthorize("hasRole('VOLUNTEER')")
    @GetMapping("/preview/{participationId}")
    public ResponseEntity<ResponseDto> previewCertificate(
            @PathVariable String participationId,
            Authentication authentication) {
        
        // Get the volunteer email from the authentication token
        String volunteerEmail = authentication.getName();
        
        // Get the volunteer by email
        Optional<Volunteer> volunteerOpt = volunteerService.findByEmail(volunteerEmail);
        
        if (volunteerOpt.isEmpty()) {
            return new ResponseEntity<>(new ResponseDto(false, "Volunteer not found", null), HttpStatus.NOT_FOUND);
        }
        
        // Return a success response with a link to download the certificate
        return new ResponseEntity<>(
                new ResponseDto(true, "Certificate preview available", 
                        "/api/v1/volunteer-certificate/download/" + participationId),
                HttpStatus.OK);
    }

    @PreAuthorize("hasRole('VOLUNTEER')")
    @GetMapping("/download/{participationId}")
    public ResponseEntity<byte[]> downloadCertificate(
            @PathVariable String participationId,
            Authentication authentication) {
        
        try {
            // Get the volunteer email from the authentication token
            String volunteerEmail = authentication.getName();
            
            // Get the volunteer by email
            Optional<Volunteer> volunteerOpt = volunteerService.findByEmail(volunteerEmail);
            
            if (volunteerOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Volunteer volunteer = volunteerOpt.get();
            
            // Generate the certificate
            byte[] certificateBytes = certificateService.generateCertificate(participationId, volunteer.getId());

            // Set up response headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "volunteer_certificate.pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            
            return new ResponseEntity<>(certificateBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PreAuthorize("hasRole('VOLUNTEER')")
//    @GetMapping("/admin/membership/{volunteerId}")
    @GetMapping("/admin/membership")
//    public ResponseEntity<byte[]> adminGenerateMembershipCertificate(@PathVariable String volunteerId) {
    public ResponseEntity<byte[]> adminGenerateMembershipCertificate(Authentication authentication) {
        try {
            // Generate the certificate
            String volunteerEmail = authentication.getName();

            // Get the volunteer by email
            Optional<Volunteer> volunteerOpt = volunteerService.findByEmail(volunteerEmail);

            if (volunteerOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Volunteer volunteer = volunteerOpt.get();

            byte[] certificateBytes = certificateService.generateMembershipCertificate(volunteer.getId());

            // Set up response headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "drasta_membership_certificate_" + volunteer.getId() + ".pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            
            return new ResponseEntity<>(certificateBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}