package com.rahul.Drasta.Repository;

import com.rahul.Drasta.Model.Notices;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NoticeRepository extends MongoRepository<Notices,String> {

//    Optional<Notices> findFirstByPrimaryTrue();
    Notices findFirstByPrimaryTrue();

    // Add pagination support
    Page<Notices> findAll(Pageable pageable);
}
