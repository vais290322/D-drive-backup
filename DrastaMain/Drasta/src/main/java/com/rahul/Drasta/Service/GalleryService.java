package com.rahul.Drasta.Service;

import com.rahul.Drasta.Exception.NotFoundException;
import com.rahul.Drasta.Model.GalleryImage;
import com.rahul.Drasta.Repository.GalleryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class GalleryService {

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private GalleryRepository galleryRepository;

    public GalleryImage uploadImage(MultipartFile file, String title) throws IOException {

        String uploadResult = cloudinaryService.uploadImage(file);

        GalleryImage image = new GalleryImage();
        image.setCategory(title);
        image.setImageUrl(uploadResult);

        return galleryRepository.save(image);
    }

    public List<GalleryImage> getAllImages() {
        return galleryRepository.findAll();
    }

    public Page<GalleryImage> getPaginatedImages(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id")); // or "createdAt" if you have one
        return galleryRepository.findAll(pageable);
    }

    public void deleteImage(String id) {
        GalleryImage image = galleryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Image not found"));

        if (image.getImageUrl() !=null && !image.getImageUrl().isEmpty()){
            cloudinaryService.deleteImageByUrl(image.getImageUrl());
        }
        galleryRepository.deleteById(id);
    }

//    public List<GalleryImage> getAllImageByCategory(String category){
//        return galleryRepository.findByCategory(category);
//    }

    public Page<GalleryImage> getPaginatedImagesByCategory(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return galleryRepository.findByCategory(category, pageable);
    }

    public GalleryImage deleteImagesByUrls(List<String> urls) {
        List<GalleryImage> images = galleryRepository.findAllByImageUrlIn(urls);

        for (GalleryImage image : images) {
            cloudinaryService.deleteImageByUrl(image.getImageUrl());
            galleryRepository.deleteById(image.getId());
        }
        return null;
    }

}
