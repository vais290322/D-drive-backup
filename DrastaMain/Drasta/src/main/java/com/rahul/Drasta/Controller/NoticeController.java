package com.rahul.Drasta.Controller;

import com.rahul.Drasta.Dto.ResponseDto;
import com.rahul.Drasta.Model.Notices;
import com.rahul.Drasta.Service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notice")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    // Create a new notice
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ResponseDto> createNotice(@RequestBody Notices notice) {
        Notices savedNotice = noticeService.createNotice(notice);
        return new ResponseEntity<>(
                new ResponseDto(true, "Notice created successfully", savedNotice),
                HttpStatus.CREATED
        );
    }

    // Get all notices
//    @GetMapping
//    public ResponseEntity<ResponseDto> getAllNotices() {
//        List<Notices> notices = noticeService.getAllNotices();
//        return ResponseEntity.ok(new ResponseDto(true, "Notices fetched successfully", notices));
//    }

    // Get paginated notices
//    @GetMapping("/paginated")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ResponseDto> getPaginatedNotices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Notices> noticePage = noticeService.getAllNoticesPaginated(page, size);
        return ResponseEntity.ok(new ResponseDto(
                true, 
                "Notices fetched successfully",
                noticePage));
    }

    // Get a specific notice by ID
    @GetMapping("/{id}")
    public ResponseEntity<ResponseDto> getNoticeById(@PathVariable String id) {
        Notices notice = noticeService.getNoticeById(id);
        return ResponseEntity.ok(new ResponseDto(true, "Notice fetched successfully", notice));
    }

    // Update a notice
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ResponseDto> updateNotice(@PathVariable String id, @RequestBody Notices updatedNotice) {
        Notices updated = noticeService.updateNotice(id, updatedNotice);
        return ResponseEntity.ok(new ResponseDto(true, "Notice updated successfully", updated));
    }

    // Delete a notice
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto> deleteNotice(@PathVariable String id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok(new ResponseDto(true, "Notice deleted successfully", null));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/set-primary/{id}")
    public ResponseEntity<ResponseDto> setNoticeAsPrimary(@PathVariable String id) {
        Notices updated = noticeService.setAsPrimary(id);
        return ResponseEntity.ok(new ResponseDto(true, "Notice set as primary", updated));
    }

    @GetMapping("/primary")
    public ResponseEntity<ResponseDto> getPrimaryNotice() {
        Notices notice = noticeService.getPrimaryNotice();
        return ResponseEntity.ok(new ResponseDto(true, "Primary notice fetched successfully", notice));
    }
}
