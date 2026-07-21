package com.rahul.Drasta.Repository;

import com.rahul.Drasta.Model.EventParticipation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventParticipationRepository extends MongoRepository<EventParticipation, String> {
    List<EventParticipation> findByEventId(String eventId);
    List<EventParticipation> findByVolunteerId(String volunteerId);
    List<EventParticipation> findByEmail(String email);
}