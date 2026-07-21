package com.rahul.Drasta.auth.controller;


import com.rahul.Drasta.auth.model.User;
import com.rahul.Drasta.auth.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
//@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Admin can see all users, Vendors can only see their customers
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('VENDOR')")
    public ResponseEntity<?> getUsers(@RequestParam(required = false) String vendorId) {
        List<User> users = (vendorId != null) ? userService.findByCreatedBy(vendorId) : userService.findAll();
        return ResponseEntity.ok(users);
    }

    // Fetch customers created by a specific vendor
    @GetMapping("/vendor/{vendorId}/customers")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VENDOR')")
    public ResponseEntity<?> getCustomersByVendor(@PathVariable String vendorId) {
        List<User> customers = userService.findByCreatedBy(vendorId);
        return ResponseEntity.ok(customers);
    }

    // Get count of customers created by a Vendor
    @GetMapping("/vendor/{vendorId}/customers/count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VENDOR')")
    public ResponseEntity<?> getVendorCustomerCount(@PathVariable String vendorId) {
        long count = userService.countCustomersByVendor(vendorId);
        return ResponseEntity.ok(Map.of("vendorId", vendorId, "customerCount", count));
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VENDOR')")
    public ResponseEntity<?> createUser(@RequestBody User user, @RequestParam(required = false) String createdBy) {
        if (createdBy != null) {
            user.setCreatedBy(createdBy);
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User createdUser = userService.save(user);
        return ResponseEntity.ok(createdUser);
    }
}
