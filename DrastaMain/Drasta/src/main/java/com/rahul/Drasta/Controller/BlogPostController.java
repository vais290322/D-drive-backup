package com.rahul.Drasta.Controller;


import com.cloudinary.utils.ObjectUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rahul.Drasta.Dto.BlogRejectionDto;
import com.rahul.Drasta.Dto.BlogRequestDto;
import com.rahul.Drasta.Dto.ResponseDto;
import com.rahul.Drasta.Exception.NotFoundException;
import com.rahul.Drasta.Model.BlogPost;
import com.rahul.Drasta.Model.Events;
import com.rahul.Drasta.Repository.BlogPostRepository;
import com.rahul.Drasta.Service.BlogPostService;
import com.rahul.Drasta.Service.CloudinaryService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/blogs")
//@CrossOrigin(origins = "*") // Optional: allow CORS
public class BlogPostController {

    @Autowired
    private BlogPostService blogPostService;
    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private BlogPostRepository blogPostRepository;

    @GetMapping("/popular")
    public ResponseEntity<ResponseDto>viewPopularBlog(){
        List<BlogPost> allBlog = blogPostService.getPopularPost();
//        if (allBlog.isEmpty()){
//            return new ResponseEntity<>(new ResponseDto(false,"Popular blog not available in database.",null),HttpStatus.NOT_FOUND);
//        }
        return new ResponseEntity<>(new ResponseDto(true,"Popular blog retrieve successfully.",allBlog),HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<ResponseDto> searchByTitle(@RequestParam(required = false) String title,@RequestParam(required = false) String author) {

        if (author !=null){
            return ResponseEntity.ok(new ResponseDto(true, "Search by author successful", blogPostService.searchThroughAuthor(author)));
        }

        List<BlogPost> posts = blogPostService.searchThroughTitle(title);
        return ResponseEntity.ok(new ResponseDto(true, "Search by title successful", posts));
    }

//    @GetMapping("/search")
//    public ResponseEntity<ResponseDto> searchByAuthor(@RequestParam String author) {
//        List<BlogPost> posts = blogPostService.searchThroughAuthor(author);
//        return ResponseEntity.ok(new ResponseDto(true, "Search by author successful", posts));
//    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping(value = "/upload", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ResponseDto> createBlogWithImage(@ModelAttribute BlogRequestDto requestDto){
//        System.out.println(" i m req from akshay  : "+request);
        BlogPost saveBlog = blogPostService.createBlogPost(requestDto);
        return new ResponseEntity<>(new ResponseDto(true,"Blog created successfully",saveBlog),HttpStatus.CREATED);
    }



//    @GetMapping
//    public ResponseEntity<ResponseDto> getAllBlogs() {
//        List<BlogPost> blogPosts = blogPostService.getAllBlogPosts();
//
//        if (blogPosts.isEmpty()) {
//            return ResponseEntity.ok(new ResponseDto(false, "No blog posts found", blogPosts));
//        }
//
//        return ResponseEntity.ok(new ResponseDto(true, "Blog posts retrieved successfully", blogPosts));
//    }

//    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @GetMapping
    public ResponseEntity<ResponseDto> getBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String publish,
            @RequestParam(defaultValue = "10") int size) {
        Page<BlogPost> paginatedPosts = blogPostService.getPaginatedPosts(page, size,publish);
        return new ResponseEntity<>(new ResponseDto(true,"All blog post fetched successfully.",paginatedPosts),HttpStatus.OK);
    }

    // Get blog post by ID
    @GetMapping("/{id}")
    public ResponseEntity<ResponseDto> getBlogById(@PathVariable String id) {
        BlogPost blogPost = blogPostService.getBlogPostById(id)
                .orElseThrow(() -> new NotFoundException("Blog post not found with ID: " + id));
        return ResponseEntity.ok(new ResponseDto(true, "Post retrieved successfully", blogPost));
    }

//    // Update blog post
//    @PutMapping("/{id}")
//    public ResponseEntity<BlogPost> updateBlog(@PathVariable String id, @RequestBody BlogPost updatedPost) {
//        try {
//            return ResponseEntity.ok(blogPostService.updateBlogPost(id, updatedPost));
//        } catch (RuntimeException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseDto> updateBlogPostWithImage(
            @PathVariable String id,
            @ModelAttribute BlogRequestDto requestDto) {
//        System.out.println("Content-Type: " + request.getContentType());
        System.out.println("update req");

        try {
            BlogPost updated = blogPostService.updateBlogPostWithImage(id,requestDto);
            return new ResponseEntity<>(new ResponseDto(true,"Blog post updated successfully",updated),HttpStatus.OK);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseDto(false, ex.getMessage(),null));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseDto(false, "update failed",null));
        }
    }

//    @RequestMapping("*")
//    public void debug(HttpServletRequest request) {
//
//    }

    // Delete blog post
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto> deleteBlog(@PathVariable String id) {
        blogPostService.deleteBlogPost(id);
        return ResponseEntity.status(HttpStatus.OK).body(new ResponseDto(true,"Blog post deleted successfully",null));
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/approved/{id}")
    public ResponseEntity<ResponseDto> approvePost(@PathVariable String id) {
        BlogPost published = blogPostService.publishPost(id);
        return ResponseEntity.status(HttpStatus.OK).body(new ResponseDto(true,"Post approved and publish successfully",published));
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/reject/{id}")
    public ResponseEntity<ResponseDto> rejectPost(
            @PathVariable String id,
            @RequestBody BlogRejectionDto rejectionDto) {
        
        BlogPost rejected = blogPostService.rejectPost(id, rejectionDto.getReason());
        
        // Trigger notification asynchronously
        blogPostService.notifyAuthorOfRejection(id);
        
        return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseDto(true, "Post rejected successfully", rejected));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending-review")
    public ResponseEntity<ResponseDto> getPostsNeedingReview() {
        List<BlogPost> pendingPosts = blogPostRepository.findByNeedsReviewTrue();
        
        if (pendingPosts.isEmpty()) {
            return ResponseEntity.ok(new ResponseDto(false, "No posts pending review", pendingPosts));
        }
        
        return ResponseEntity.ok(new ResponseDto(true, "Posts pending review retrieved successfully", pendingPosts));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/popular/{id}")
    public ResponseEntity<ResponseDto> createPopular(@PathVariable String id) {
        BlogPost published = blogPostService.createPopular(id);
        return ResponseEntity.status(HttpStatus.OK).body(new ResponseDto(true,"Post popular successfully",published));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/test")
    public String test(HttpServletRequest request, Authentication auth) {
        System.out.println("Logged in user: " + auth.getName());
        System.out.println("Authorities: " + auth.getAuthorities());
        return "Secured!";
    }

}
