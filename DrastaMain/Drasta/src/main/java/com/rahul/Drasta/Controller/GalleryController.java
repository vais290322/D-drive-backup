package com.rahul.Drasta.Controller;

import com.rahul.Drasta.Dto.ResponseDto;
import com.rahul.Drasta.Model.GalleryImage;
import com.rahul.Drasta.Service.GalleryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/gallery")
public class GalleryController {

    @Autowired
    private GalleryService galleryService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseDto> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String category) throws IOException {
        return new ResponseEntity<>(new ResponseDto(true,"Image successfully added in gallery",galleryService.uploadImage(file, category)),HttpStatus.OK);
    }

//    @GetMapping
//    public ResponseEntity<ResponseDto> getAllImages() {
//        return new ResponseEntity<>(new ResponseDto(true,"All image fetch successfully",galleryService.getAllImages()),HttpStatus.OK);
//    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto> deleteImage(@PathVariable String id) {
        galleryService.deleteImage(id);
        return new ResponseEntity<>(new ResponseDto(true,"Image deleted successfully",null), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/batch-delete")
    public ResponseEntity<ResponseDto> deleteImagesByUrls(@RequestBody List<String> urls) {

        System.out.println(" url : "+urls);
        GalleryImage url=galleryService.deleteImagesByUrls(urls);
        return new ResponseEntity<>(new ResponseDto(true,"Images deleted successfully",null),HttpStatus.OK);
    }

//    @GetMapping("/fetch")
//    public ResponseEntity<ResponseDto>viewAllImageByCategory(@RequestParam String category){
//        List<GalleryImage> allCategoryImage = galleryService.getAllImageByCategory(category);
//        if (allCategoryImage.isEmpty()){
//            return new ResponseEntity<>(new ResponseDto(false," "+category+ "image not found",null),HttpStatus.NOT_FOUND);
//        }
//        return new ResponseEntity<>(new ResponseDto(true," "+category+ " image retrieve successfully.",allCategoryImage),HttpStatus.OK);
//    }


    @GetMapping
    public ResponseEntity<ResponseDto> getGallery(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "10") int size) {

        if (category !=null){
            return new ResponseEntity<>(new ResponseDto(true," "+category+ " image retrieve successfully.",galleryService.getPaginatedImagesByCategory(category, page, size)),HttpStatus.OK);
        }
//        return ResponseEntity.ok(galleryService.getPaginatedImages(page, size));
        return new ResponseEntity<>(new ResponseDto(true,"All image fetch successfully",galleryService.getPaginatedImages(page, size)),HttpStatus.OK);
    }

//    @GetMapping("/category")
//    public ResponseEntity<ResponseDto> getGalleryByCategory(
//            @RequestParam String category,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size) {
////        return ResponseEntity.ok(galleryService.getPaginatedImagesByCategory(category, page, size));
//        return new ResponseEntity<>(new ResponseDto(true," "+category+ " image retrieve successfully.",galleryService.getPaginatedImagesByCategory(category, page, size)),HttpStatus.OK);
//
//    }


}
