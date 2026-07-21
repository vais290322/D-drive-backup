package com.rahul.Drasta.Repository;

import com.rahul.Drasta.Model.InitiativeCategory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InitiativeCategoryRepository extends MongoRepository<InitiativeCategory, String> {
}
