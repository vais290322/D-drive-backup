package com.rahul.Drasta.auth.controller;

import com.rahul.Drasta.Dto.ResponseDto;
import com.rahul.Drasta.auth.dto.UserRegistrationDto;
import com.rahul.Drasta.auth.model.User;
import com.rahul.Drasta.auth.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
//@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class RegistrationController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;  // Inject the PasswordEncoder


    @PostMapping("/register")
    public ResponseEntity<Map<String,Object>> registerUser(@Valid @RequestBody UserRegistrationDto registrationDto, BindingResult result) {
//        if (result.hasErrors()) {
//            List<String> errorMessages = result.getFieldErrors().stream()
//                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
//                    .toList();
//            return ResponseEntity.badRequest().body(new ResponseDto(false, errorMessages.toString(),null));
//        }

        if (result.hasErrors()) {
            List<String> errorMessages = result.getAllErrors().stream() // instead of getFieldErrors()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .toList();

//            return ResponseEntity.badRequest().body(
//                    new ResponseDto(false, errorMessages, null));

            return ResponseEntity.badRequest().body(Map.of("success",false,"message","Invalid credential","error",errorMessages));
        }

        User existingUser = userService.findByEmail(registrationDto.getEmail());
        if (existingUser != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("success",false,"message","User already registered with email: " + registrationDto.getEmail()));
        }
        // Map DTO to User entity
        User user = new User();
        user.setFullName(registrationDto.getFullName());
        user.setEmail(registrationDto.getEmail());
        user.setPhoneNumber(registrationDto.getPhoneNumber());
        // Encode the password before saving
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
//        user.setRole(registrationDto.getRole());
        user.setRole("USER");

        // Debug logging
        System.out.println("Saving user: " + user.getEmail());

        userService.save(user);
        user.setPassword(null);
        System.out.println("User saved successfully.");
//        return new ResponseEntity<>(new ResponseDto(true,"User registered successfully with role: " + registrationDto.getRole(),user), HttpStatus.CREATED);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success",true,"message","User registered successfully with role: " + registrationDto.getRole()));
    }

}


