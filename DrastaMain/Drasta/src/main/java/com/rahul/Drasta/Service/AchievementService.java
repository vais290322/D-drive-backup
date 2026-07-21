package com.rahul.Drasta.Service;

import com.rahul.Drasta.Dto.AchievementRequestDto;
import com.rahul.Drasta.Exception.AlreadyExist;
import com.rahul.Drasta.Exception.NotFoundException;
import com.rahul.Drasta.Model.Achievements;
import com.rahul.Drasta.Repository.AchievementsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AchievementService {

    private final AchievementsRepository achievementsRepository;
    private final CloudinaryService cloudinaryService;

    public Achievements saveAchievements(AchievementRequestDto requestDto){

        boolean exists = achievementsRepository.existsByTitleIgnoreCase(requestDto.getTitle());
        if (exists) {
            throw new AlreadyExist("Title already exists");
        }
        String imageUrl = cloudinaryService.uploadImage(requestDto.getImageUrl());
        Achievements achievements = new Achievements();
        achievements.setTitle(requestDto.getTitle());
        achievements.setDescription(requestDto.getDescription());
        achievements.setImageUrl(imageUrl);
        achievements.setCreateAt(LocalDateTime.now());
        return achievementsRepository.save(achievements);
    }

    public List<Achievements> allAchievements(){
        return achievementsRepository.findAll();
    }

    public Optional<Achievements> getById(String id){
        return achievementsRepository.findById(id);
    }

    public Achievements updateAchievement(String id, AchievementRequestDto requestDto){
        Achievements existAchievement = achievementsRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Achievement not found"));

        if (requestDto !=null && !requestDto.getDescription().isEmpty()){
            existAchievement.setDescription(requestDto.getDescription());
        }
        if (requestDto !=null && !requestDto.getTitle().isEmpty()){
            existAchievement.setTitle(requestDto.getTitle());
        }
        if (requestDto !=null && !requestDto.getImageUrl().isEmpty()){
            String oldImage = existAchievement.getImageUrl();
            if (oldImage !=null && !oldImage.isEmpty()){
                cloudinaryService.deleteImageByUrl(oldImage);
            }
            String newImage = cloudinaryService.uploadImage(requestDto.getImageUrl());
            existAchievement.setImageUrl(newImage);
        }
        return achievementsRepository.save(existAchievement);
    }

    public void deleteAchievement(String id){
        Achievements existAchievement = achievementsRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Achievement not found"));

        String imageUrl = existAchievement.getImageUrl();
        if (imageUrl !=null && imageUrl.isEmpty()){
            cloudinaryService.deleteImageByUrl(imageUrl);
        }
        achievementsRepository.delete(existAchievement);
    }

}
