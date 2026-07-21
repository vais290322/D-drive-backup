package com.rahul.Drasta.Repository;

import com.rahul.Drasta.Model.Events;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends MongoRepository<Events,String> {
    List<Events> findByEventDateAfter(LocalDate now);

    long countByEventDateAfter(LocalDate now);

    // Add these new search methods
    List<Events> findByEventTitleContainingIgnoreCase(String eventTitle);
    List<Events> findByEventDate(LocalDate eventDate);
    List<Events> findByEventDateBetween(LocalDate startDate, LocalDate endDate);
    List<Events> findByLocationContainingIgnoreCase(String location);
    
    // Add combined search method for title OR location
    @Query("{$or: [{eventTitle: {$regex: ?0, $options: 'i'}}, {location: {$regex: ?0, $options: 'i'}}]}")
    List<Events> findByEventTitleOrLocationContainingIgnoreCase(String searchTerm);
    
    // Paginated versions
    Page<Events> findByEventTitleContainingIgnoreCase(String eventTitle, Pageable pageable);
    Page<Events> findByEventDate(LocalDate eventDate, Pageable pageable);
    Page<Events> findByEventDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);
    Page<Events> findByLocationContainingIgnoreCase(String location, Pageable pageable);
    
    // Paginated combined search
    @Query("{$or: [{eventTitle: {$regex: ?0, $options: 'i'}}, {location: {$regex: ?0, $options: 'i'}}]}")
    Page<Events> findByEventTitleOrLocationContainingIgnoreCase(String searchTerm, Pageable pageable);
}
