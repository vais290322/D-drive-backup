package com.rahul.Drasta.auth.service;



import com.rahul.Drasta.auth.model.User;
import com.rahul.Drasta.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User save(User user) {
        // Here you would encrypt the password before saving (e.g., BCryptPasswordEncoder)
//        User existUser = userRepository.findByEmail(user.getEmail());
        return userRepository.save(user);
    }


    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByUserId(String userId){
        return userRepository.findByUserId(userId);
    }

    public User findByResetToken(String token) {
        return userRepository.findByResetToken(token);
    }


    public User findById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public void deleteById(String id) {
        userRepository.deleteById(id);
    }

    public void updateUser(String userId, User newUser){
        Optional<User> existUser = userRepository.findByUserId(userId);
        if (existUser.isPresent()){
            User oldUser = existUser.get();
            if (newUser.getFullName() !=null && !newUser.getFullName().isEmpty()){
                oldUser.setFullName(newUser.getFullName());
            }
            if (newUser.getEmail() !=null && !newUser.getEmail().isEmpty()){
                oldUser.setEmail(newUser.getEmail());
            }
            if (newUser.getPhoneNumber() != null && !newUser.getPhoneNumber().isEmpty()){
                oldUser.setPhoneNumber(newUser.getPhoneNumber());
            }
//            if (newUser.getActive() !=null){
//                oldUser.setActive(newUser.getActive());
//            }

            if (newUser.getPassword() != null && !newUser.getPassword().isEmpty()) {
                oldUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
            }
            userRepository.save(oldUser);
        }
    }


    public List<User> findByCreatedBy(String vendorId) {
        return userRepository.findByCreatedBy(vendorId);
    }

    // Count customers created by a vendor
    public long countCustomersByVendor(String vendorId) {
        return userRepository.countByCreatedBy(vendorId);
    }
}

