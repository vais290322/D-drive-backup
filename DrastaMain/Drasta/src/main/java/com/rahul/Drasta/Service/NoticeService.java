package com.rahul.Drasta.Service;

import com.rahul.Drasta.Exception.NotFoundException;
import com.rahul.Drasta.Model.Notices;
import com.rahul.Drasta.Repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;


    public Notices createNotice(Notices notice) {
        notice.setCreateAt(LocalDateTime.now());
        return noticeRepository.save(notice);
    }

    // Get all notices
    public List<Notices> getAllNotices() {
        return noticeRepository.findAll();
    }
    
    // Get paginated notices
    public Page<Notices> getAllNoticesPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createAt"));
        return noticeRepository.findAll(pageable);
    }

    // Get a notice by ID
    public Notices getNoticeById(String id) {
        return noticeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Notice not found with id: " + id));
    }

    // Update a notice
    public Notices updateNotice(String id, Notices updatedNotice) {
        Notices existing = getNoticeById(id);

        if (updatedNotice.getContent() != null) existing.setContent(updatedNotice.getContent());
        if (updatedNotice.getRedirectUrl() != null) existing.setRedirectUrl(updatedNotice.getRedirectUrl());
        if (updatedNotice.getDate() != null) existing.setDate(updatedNotice.getDate());

        existing.setPrimary(updatedNotice.isPrimary());
        existing.setShowNotice(updatedNotice.isShowNotice());

        return noticeRepository.save(existing);
    }

    // Delete a notice
    public void deleteNotice(String id) {
        Notices existing = getNoticeById(id);
        noticeRepository.delete(existing);
    }

    public Notices setAsPrimary(String id) {
        // Find the notice to be set as primary
        Notices targetNotice = getNoticeById(id);

        // Unset primary from all other notices
        List<Notices> allNotices = noticeRepository.findAll();
        for (Notices notice : allNotices) {
            if (!notice.getId().equals(id) && notice.isPrimary()) {
                notice.setPrimary(false);
                notice.setShowNotice(false);
                noticeRepository.save(notice);
            }
        }

        // Set this notice as primary
        targetNotice.setPrimary(true);
        targetNotice.setShowNotice(true);
        return noticeRepository.save(targetNotice);
    }

    public Notices getPrimaryNotice() {
        return noticeRepository.findFirstByPrimaryTrue();
//                .orElseThrow(() -> new NotFoundException("No primary notice found"));
    }
}
