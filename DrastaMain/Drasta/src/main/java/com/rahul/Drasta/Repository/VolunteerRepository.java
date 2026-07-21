package com.rahul.Drasta.Repository;

import com.rahul.Drasta.Model.Volunteer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerRepository extends MongoRepository<Volunteer,String> {
//    List<Volunteer> findAllAndActiveTrue();

    List<Volunteer> findByActiveTrue();

    Optional<Volunteer> findByEmail(String email);

    List<Volunteer> findByActiveFalse();
    long countByActiveTrue();
    long countByActiveFalse();

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

//    List<Volunteer> findByActiveFalseAndStatus(String status);

//    List<Volunteer> findByActiveAndStatus(boolean active, String status);

    List<Volunteer> findByStatus(String PENDING);

    // Add these new search methods
    List<Volunteer> findByFullNameContainingIgnoreCase(String name);
    List<Volunteer> findBySkillContainingIgnoreCase(String skill);
    List<Volunteer> findByPreferredRoleContainingIgnoreCase(String role);
    List<Volunteer> findByPreferredStateContainingIgnoreCase(String state);
    List<Volunteer> findByPreferredCityContainingIgnoreCase(String city);

    long countByActiveFalseAndStatus(String pending);
}
