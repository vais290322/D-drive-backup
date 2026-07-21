package com.rahul.Drasta.Repository;

import com.rahul.Drasta.Model.InitiativeEvent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InitiativeEventRepository extends MongoRepository<InitiativeEvent, String> {
    List<InitiativeEvent> findByCategory_Id(String categoryId);
    
    InitiativeEvent findByEventId(String eventId);
    
    // Add methods for upcoming events
    List<InitiativeEvent> findByDateAfter(LocalDate date);
    
    List<InitiativeEvent> findByCategory_IdAndDateAfter(String categoryId, LocalDate date);
}
