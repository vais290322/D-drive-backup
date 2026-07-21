package com.rahul.Drasta.Repository;

import com.rahul.Drasta.Model.GalleryImage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryRepository extends MongoRepository<GalleryImage,String> {
    List<GalleryImage> findAllByImageUrlIn(List<String> urls);

//    List<GalleryImage> findByCategory(String category);

    Page<GalleryImage> findByCategory(String category, Pageable pageable);
}
