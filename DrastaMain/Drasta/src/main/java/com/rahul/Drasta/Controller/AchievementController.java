package com.rahul.Drasta.Controller;

import com.rahul.Drasta.Dto.AchievementRequestDto;
import com.rahul.Drasta.Dto.ResponseDto;
import com.rahul.Drasta.Model.Achievements;
import com.rahul.Drasta.Service.AchievementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/achievements")
@RequiredArgsConstructor
//@CrossOrigin("*") // For frontend access (adjust origin as needed)
public class AchievementController {

    private final AchievementService achievementService;

    // ✅ Create Achievement

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ResponseDto> createAchievement(@ModelAttribute @Valid AchievementRequestDto requestDto) {
//        System.out.println(" i m request : "+requestDto);
       Achievements saved = achievementService.saveAchievements(requestDto);
       return ResponseEntity.status(HttpStatus.CREATED)
               .body(new ResponseDto(true, "Achievement created successfully", saved));
    }

    // ✅ Get All Achievements
    @GetMapping
    public ResponseEntity<ResponseDto> getAllAchievements() {
        return ResponseEntity.ok(
                new ResponseDto(true, "List of all achievements", achievementService.allAchievements())
        );
    }

    // ✅ Get Achievement by ID
    @GetMapping("/{id}")
    public ResponseEntity<ResponseDto> getAchievementById(@PathVariable String id) {
        return achievementService.getById(id)
                .map(achievement -> ResponseEntity.ok(
                        new ResponseDto(true, "Achievement found", achievement)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDto(false, "Achievement not found", null)));
    }

    // ✅ Update Achievement
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ResponseDto> updateAchievement(
            @PathVariable String id,
            @ModelAttribute AchievementRequestDto requestDto) {
        Achievements updated = achievementService.updateAchievement(id, requestDto);
        return ResponseEntity.ok(
                new ResponseDto(true, "Achievement updated successfully", updated)
        );
    }

    // ✅ Delete Achievement
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto> deleteAchievement(@PathVariable String id) {
        achievementService.deleteAchievement(id);
        return ResponseEntity.ok(
                new ResponseDto(true, "Achievement deleted successfully", null)
        );
    }
}
