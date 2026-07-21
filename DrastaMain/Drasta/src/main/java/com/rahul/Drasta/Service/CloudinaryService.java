package com.rahul.Drasta.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.Objects;

@RequiredArgsConstructor
@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;


    public String uploadImage(MultipartFile file){
        try {
            File tempFile = File.createTempFile("temp",file.getOriginalFilename());
            file.transferTo(tempFile);
            Map<?,?> uploadResult =cloudinary.uploader().upload(tempFile, ObjectUtils.emptyMap());
            return uploadResult.get("secure_url").toString();

        }catch (IOException e){
            throw new RuntimeException("Image upload failed due to technical issue.",e);
        }
    }

    public void deleteImageByUrl(String imageUrl){
        try {
            String publicId = imageUrl.substring(imageUrl.lastIndexOf("/")+1 , imageUrl.lastIndexOf("."));
            cloudinary.uploader().destroy(publicId,ObjectUtils.emptyMap());
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to delete image from cloudinary : ",e);
        }
    }




//    public void deleteImageByUrl(String imageUrl) {
//    try {
//        String publicId = imageUrl.substring(imageUrl.lastIndexOf("/") + 1, imageUrl.lastIndexOf(".")); // crude extraction
//        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
//    } catch (Exception e) {
//        throw new RuntimeException("Failed to delete image from Cloudinary", e);
//    }
//}
}
