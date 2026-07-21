package com.rahul.Drasta.Controller;

import com.rahul.Drasta.Dto.ResponseDto;

import com.rahul.Drasta.Model.TimeUtils;
import com.rahul.Drasta.Repository.BlogPostRepository;
import com.rahul.Drasta.Repository.DonateRepository;
import com.rahul.Drasta.Repository.EventRepository;
import com.rahul.Drasta.Repository.VolunteerRepository;
import com.rahul.Drasta.Service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
public class DashboardController {
    
    @Autowired
    private BlogPostRepository blogPostRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private EventService eventService;
    
    @Autowired
    private DonateRepository donateRepository;
    
    @Autowired
    private VolunteerRepository volunteerRepository;
    
    /**
     * Get recent activity for the dashboard
     * @return ResponseEntity with recent activity data
     */
    @GetMapping("/dashboard/recent-activity")
    public ResponseEntity<ResponseDto> getRecentActivity() {
        Map<String, Object> response = new HashMap<>();
        
        // Get recent blog posts
        List<Map<String, Object>> recentPosts = blogPostRepository.findTop5ByOrderByPublishDesc()
                .stream()
                .map(post -> {
                    Map<String, Object> postMap = new HashMap<>();
                    postMap.put("id", post.getId());
                    postMap.put("title", post.getTitle());
                    postMap.put("author", post.getAuthor());
                    postMap.put("timeAgo", TimeUtils.getTimeAgo(post.getPublishDate()));
                    return postMap;
                })
                .collect(Collectors.toList());
        
        response.put("recentPosts", recentPosts);
        
        // Get upcoming events
        List<Map<String, Object>> upcomingEvents = eventRepository.findByEventDateAfter(LocalDate.now())
                .stream()
                .limit(5) // Limit to 5 events
                .map(event -> {
                    Map<String, Object> eventMap = new HashMap<>();
                    eventMap.put("id", event.getId());
                    eventMap.put("title", event.getEventTitle());
                    eventMap.put("location", event.getLocation());
                    eventMap.put("date", event.getEventDate());
                    return eventMap;
                })
                .collect(Collectors.toList());
        
        response.put("upcomingEvents", upcomingEvents);
        
        // Get recent donations
        List<Map<String, Object>> recentDonations = donateRepository.findAll()
                .stream()
                .limit(5) // Limit to 5 donations
                .map(donate -> {
                    Map<String, Object> donationMap = new HashMap<>();
                    donationMap.put("id", donate.getId());
                    donationMap.put("name", donate.getName());
                    donationMap.put("amount", donate.getDonateAmount());
                    donationMap.put("status", donate.getStatus());
                    return donationMap;
                })
                .collect(Collectors.toList());
        
        response.put("recentDonations", recentDonations);
        
        // Get active volunteers
        List<Map<String, Object>> activeVolunteers = volunteerRepository.findByActiveTrue()
                .stream()
                .limit(5) // Limit to 5 volunteers
                .map(volunteer -> {
                    Map<String, Object> volunteerMap = new HashMap<>();
                    volunteerMap.put("id", volunteer.getId());
                    volunteerMap.put("name", volunteer.getFullName());
                    volunteerMap.put("email", volunteer.getEmail());
                    return volunteerMap;
                })
                .collect(Collectors.toList());
        
        response.put("activeVolunteers", activeVolunteers);
        
        return new ResponseEntity<>(new ResponseDto(true, "Recent activity fetched successfully", response), HttpStatus.OK);
    }
    
    /**
     * Get dashboard metrics
     * @return ResponseEntity with dashboard metrics
     */
    @GetMapping("/dashboard/metrics")
    public ResponseEntity<ResponseDto> getDashboardMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        // Count upcoming events
        long upcomingEventsCount = eventService.getUpcomingEventsCount();
        metrics.put("upcomingEventsCount", upcomingEventsCount);
        
        // Count total blog posts
        long totalBlogPosts = blogPostRepository.count();
        metrics.put("totalBlogPosts", totalBlogPosts);
        
        // Count popular blog posts
        long popularBlogPosts = blogPostRepository.findByPopularTrue().size();
        metrics.put("popularBlogPosts", popularBlogPosts);
        
        // Count total donations
        long totalDonations = donateRepository.count();
        metrics.put("totalDonations", totalDonations);
        
        // Count active volunteers
        long activeVolunteers = volunteerRepository.findByActiveTrue().size();
        metrics.put("activeVolunteers", activeVolunteers);
        
        return new ResponseEntity<>(new ResponseDto(true, "Dashboard metrics fetched successfully", metrics), HttpStatus.OK);
    }
    
    /**
     * Admin dashboard endpoint
     * @return ResponseEntity with admin dashboard data
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/dashboard")
    public ResponseEntity<ResponseDto> getAdminDashboard() {
        Map<String, Object> dashboardData = new HashMap<>();
        
        // Get metrics
        Map<String, Object> metrics = (Map<String, Object>) getDashboardMetrics().getBody().getData();
        dashboardData.put("metrics", metrics);
        
        // Get recent activity
        Map<String, Object> recentActivity = (Map<String, Object>) getRecentActivity().getBody().getData();
        dashboardData.put("recentActivity", recentActivity);
        
        return new ResponseEntity<>(new ResponseDto(true, "Admin dashboard data fetched successfully", dashboardData), HttpStatus.OK);
    }
    
    /**
     * User dashboard endpoint
     * @return ResponseEntity with user dashboard data
     */
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/user/dashboard")
    public ResponseEntity<ResponseDto> getUserDashboard() {
        Map<String, Object> dashboardData = new HashMap<>();
        
        // Get recent blog posts
        List<Map<String, Object>> recentPosts = (List<Map<String, Object>>) ((Map<String, Object>) getRecentActivity().getBody().getData()).get("recentPosts");
        dashboardData.put("recentPosts", recentPosts);
        
        // Get upcoming events
        List<Map<String, Object>> upcomingEvents = (List<Map<String, Object>>) ((Map<String, Object>) getRecentActivity().getBody().getData()).get("upcomingEvents");
        dashboardData.put("upcomingEvents", upcomingEvents);
        
        return new ResponseEntity<>(new ResponseDto(true, "User dashboard data fetched successfully", dashboardData), HttpStatus.OK);
    }
    
    /**
     * Volunteer dashboard endpoint
     * @return ResponseEntity with volunteer dashboard data
     */
    @PreAuthorize("hasRole('VOLUNTEER')")
    @GetMapping("/volunteer/dashboard")
    public ResponseEntity<ResponseDto> getVolunteerDashboard() {
        Map<String, Object> dashboardData = new HashMap<>();
        
        // Get upcoming events
        List<Map<String, Object>> upcomingEvents = (List<Map<String, Object>>) ((Map<String, Object>) getRecentActivity().getBody().getData()).get("upcomingEvents");
        dashboardData.put("upcomingEvents", upcomingEvents);
        
        // Get active volunteers
        List<Map<String, Object>> activeVolunteers = (List<Map<String, Object>>) ((Map<String, Object>) getRecentActivity().getBody().getData()).get("activeVolunteers");
        dashboardData.put("activeVolunteers", activeVolunteers);
        
        return new ResponseEntity<>(new ResponseDto(true, "Volunteer dashboard data fetched successfully", dashboardData), HttpStatus.OK);
    }
}
