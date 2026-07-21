package com.rahul.Drasta.auth.repository;

import com.rahul.Drasta.auth.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    User findByEmail(String email);

    User findByResetToken(String token);

    List<User> findByCreatedBy(String vendorId);

    long countByCreatedBy(String vendorId);

    void deleteByEmail(String email);

    Optional<User> findByUserId(String userId);

//    Optional<User> findByEmail(String email);
}

