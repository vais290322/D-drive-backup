package com.rahul.Drasta.Repository;

import com.rahul.Drasta.Model.BlogRejection;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogRejectionRepository extends MongoRepository<BlogRejection, String> {
    List<BlogRejection> findByBlogId(String blogId);
    Optional<BlogRejection> findTopByBlogIdOrderByRejectionDateDesc(String blogId);
    List<BlogRejection> findByIsNotifiedFalse();
}