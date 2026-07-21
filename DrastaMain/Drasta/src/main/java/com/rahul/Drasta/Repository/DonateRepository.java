package com.rahul.Drasta.Repository;

import com.rahul.Drasta.Model.Donate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DonateRepository extends MongoRepository<Donate,String> {
    Donate findByEmailAndName(String email, String name);

    Optional<Donate> findByEmail(String email);
}
