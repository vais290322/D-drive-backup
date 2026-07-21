package com.rahul.Drasta.Repository;

import com.rahul.Drasta.Model.Achievements;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AchievementsRepository extends MongoRepository<Achievements,String> {
    boolean existsByTitleIgnoreCase(String title);
}
