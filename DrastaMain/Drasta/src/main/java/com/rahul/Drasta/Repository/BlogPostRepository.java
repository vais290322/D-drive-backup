package com.rahul.Drasta.Repository;

import com.rahul.Drasta.Model.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogPostRepository extends MongoRepository<BlogPost,String> {
    List<BlogPost> findByPopularTrue();

    Object countDistinctByAuthor();

//    List<BlogPost> findTop5ByOrderByCreateDateDesc();

    List<BlogPost> findTop5ByOrderByPublishDesc();

//    List<BlogPost> findByTitleIgnoreCase(String title);
//
//    List<BlogPost> findByAuthorIgnoreCase(String author);

    List<BlogPost> findByTitleContainingIgnoreCase(String title);

    List<BlogPost> findByAuthorContainingIgnoreCase(String author);

    Page<BlogPost> findByPublish(boolean isPublish, Pageable pageable);

    List<BlogPost> findByTitleContainingIgnoreCaseAndPublishTrue(String title);

    Optional<BlogPost> findByIdAndPublishTrue(String id);

    List<BlogPost> findByPopularTrueAndPublishTrue();

    // Add these methods to your existing repository
    List<BlogPost> findByNeedsReviewTrue();
    Page<BlogPost> findByStatus(String status,Pageable pageable);

    Page<BlogPost> findByPublishTrue(Pageable pageable);
}
