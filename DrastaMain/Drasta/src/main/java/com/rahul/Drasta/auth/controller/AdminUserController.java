package com.rahul.Drasta.auth.controller;
import com.rahul.Drasta.Dto.ResponseDto;
import com.rahul.Drasta.auth.model.User;
import com.rahul.Drasta.auth.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/users")
//@CrossOrigin(origins = "*")
public class AdminUserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Get all users
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDto> getAllUsers() {
        List<User> users = userService.findAll();
        if (users.isEmpty()){
            return new ResponseEntity<>(new ResponseDto(false,"User not found",null),HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(new ResponseDto(true,"All user fetched successfully",users),HttpStatus.OK);
    }

    // Get a specific user by ID
    @GetMapping("/{id}")
    public ResponseEntity<ResponseDto> getUserById(@PathVariable("id") String id) {
        User user = userService.findById(id);
        if (user == null) {
            return ResponseEntity.badRequest().body(new ResponseDto(false,"User not found",null));
        }
        return new ResponseEntity<>(new ResponseDto(true,"User found successfully",user),HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<ResponseDto> createUser(@RequestBody User user) {
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body(new ResponseDto(false,"password is required",null));
        }
        // Encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedBy("ADMIN");
        // Save the user
        return new ResponseEntity<>(new ResponseDto(true,"User added successfully", userService.save(user)),HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseDto> updateUser(@PathVariable("id") String id, @RequestBody User updatedUser) {
        User user = userService.findById(id);
        if (user == null) {
            return ResponseEntity.badRequest().body(new ResponseDto(false,"User not found",null));
        }
        // Update fields
        if (updatedUser.getFullName() !=null && !updatedUser.getFullName().isEmpty()){
            user.setFullName(updatedUser.getFullName());
        }
        if (updatedUser.getEmail() !=null && !updatedUser.getEmail().isEmpty()){
            user.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getPhoneNumber() !=null && !updatedUser.getPhoneNumber().isEmpty()){
            user.setPhoneNumber(updatedUser.getPhoneNumber());
        }

        if (updatedUser.getRole() !=null && !updatedUser.getRole().isEmpty()){
            user.setRole(updatedUser.getRole());
        }

        userService.save(user);
        return ResponseEntity.status(HttpStatus.OK).body(new ResponseDto(true,"Details update successfully",user) );
    }

    // Delete a user
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseDto> deleteUser(@PathVariable("id") String id) {
        User user = userService.findById(id);
        if (user == null) {
            return ResponseEntity.badRequest().body(new ResponseDto(false,"User not found",null));
        }
        userService.deleteById(id);
        return new ResponseEntity<>(new ResponseDto(true,"User deleted successfully.",user),HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/activate")
    public ResponseEntity<ResponseDto> toggleActiveStatus(@PathVariable("id") String id) {
        User user = userService.findById(id);
        if (user == null) {
            return ResponseEntity.badRequest().body(new ResponseDto(false,"User not found",null));
        }

        // Toggle the active status
        boolean newStatus = !user.isActive();
        user.setActive(newStatus);
        userService.save(user);

        String message = newStatus ? "User activated successfully." : "User deactivated successfully.";
        return new ResponseEntity<>(new ResponseDto(true,message,null),HttpStatus.OK);
    }



    // Block a user and Unblock a user
    @PostMapping("/{id}/block")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDto> toggleBlockStatus(@PathVariable("id") String id) {
        User user = userService.findById(id);
        if (user == null) {
            return ResponseEntity.badRequest().body(new ResponseDto(false,"User not found",null));
        }

        // Toggle the block status
        boolean newStatus = !user.isBlocked();
        user.setBlocked(newStatus);
        userService.save(user);

        String message = newStatus ? "User blocked successfully." : "User unblocked successfully.";
        return new ResponseEntity<>(new ResponseDto(true,message,null),HttpStatus.OK);
    }
}

