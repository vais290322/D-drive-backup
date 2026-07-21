package com.rahul.Drasta.Service;


import com.rahul.Drasta.Dto.BlogRequestDto;
import com.rahul.Drasta.Exception.NotFoundException;
import com.rahul.Drasta.Model.BlogPost;
import com.rahul.Drasta.Model.BlogRejection;
import com.rahul.Drasta.Repository.BlogPostRepository;
import com.rahul.Drasta.Repository.BlogRejectionRepository;
import com.rahul.Drasta.auth.model.User;
import com.rahul.Drasta.auth.repository.UserRepository;
import com.rahul.Drasta.auth.service.EmailService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BlogPostService {

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private BlogRejectionRepository rejectionRepository;

    @Autowired
    private EmailService emailService;


    // Create a new blog post
//    public BlogPost createBlogPost(BlogRequestDto requestDto) {
//
//
////        blogPost.setPublishDate(LocalDateTime.now());
//
////        if (requestDto !=null && requestDto.getBannerImage().isEmpty()){
////            String imageUrl = cloudinaryService.uploadImage(requestDto.getBannerImage());
////        }
//        String imageUrl = null;
//        if (requestDto != null && requestDto.getBannerImage() != null && !requestDto.getBannerImage().isEmpty()) {
//            imageUrl = cloudinaryService.uploadImage(requestDto.getBannerImage());
//        }
//        BlogPost blogPost = new BlogPost();
//        blogPost.setBannerImageUrl(imageUrl);
//        blogPost.setTitle(requestDto.getTitle());
//        blogPost.setContent(requestDto.getContent());
//        blogPost.setReadTime(calculateReadTime(requestDto.getContent()));
//        return blogPostRepository.save(blogPost);
//    }

public BlogPost createBlogPost(BlogRequestDto requestDto) {
    String imageUrl = null;
    if (requestDto != null && requestDto.getBannerImage() != null && !requestDto.getBannerImage().isEmpty()) {
        imageUrl = cloudinaryService.uploadImage(requestDto.getBannerImage());
    }

    // Get current user (email from authentication)
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String email = authentication.getName(); // email from JWT or form login
    User user = userRepository.findByEmail(email);
//            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    // Save the blog post
    BlogPost blogPost = new BlogPost();
    blogPost.setBannerImageUrl(imageUrl);
    blogPost.setTitle(requestDto.getTitle());
    blogPost.setContent(requestDto.getContent());
    blogPost.setReadTime(calculateReadTime(requestDto.getContent()));

    if (user.getRole().equals("ADMIN")){
        blogPost.setAuthor(user.getFullName());
        blogPost.setPublishDate(LocalDateTime.now());
        blogPost.setPublish(requestDto.isPublish());
        blogPost.setPopular(requestDto.isPopular());
        blogPost.setStatus("PENDING");

    }else {
        blogPost.setAuthor(user.getFullName()); // assuming this is a User field
        blogPost.setUserId(user.getId());
        blogPost.setPublishDate(LocalDateTime.now());
        blogPost.setStatus("PENDING");
    }

    return blogPostRepository.save(blogPost);
}

    // Get all blog posts
    public List<BlogPost> getAllBlogPosts() {
        return blogPostRepository.findAll();
    }


//    public Page<BlogPost> getPaginatedPosts(int page, int size) {
//        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishDate"));
//        return blogPostRepository.findAll(pageable);
//    }

//    public Page<BlogPost> getPaginatedPosts(int page, int size, String publish) {
//        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishDate"));
//
//        if (publish == null) {
//            return blogPostRepository.findAll(pageable);
//        }
//
//        boolean isPublished = Boolean.parseBoolean(publish);
//        return blogPostRepository.findByPublish(isPublished, pageable);
//    }

    public Page<BlogPost> getPaginatedPosts(int page, int size, String publishParam) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishDate"));

        if (publishParam == null) {
            return blogPostRepository.findAll(pageable);
        }

        if (publishParam.equalsIgnoreCase("true")) {
            // Return only published posts
            return blogPostRepository.findByPublishTrue(pageable);
        } else if (publishParam.equalsIgnoreCase("false")) {
            // Return only pending posts based on status
            return blogPostRepository.findByStatus("PENDING", pageable);
        } else {
            // Fallback if an invalid value is passed
            throw new IllegalArgumentException("Invalid publish parameter. Use true, false, or null.");
        }
    }



    public List<BlogPost>getPopularPost(){
        return blogPostRepository.findByPopularTrueAndPublishTrue();
    }

    public List<BlogPost> searchThroughTitle(String title){
        return blogPostRepository.findByTitleContainingIgnoreCaseAndPublishTrue(title);
    }

    public List<BlogPost> searchThroughAuthor(String author){
        return blogPostRepository.findByAuthorContainingIgnoreCase(author);
    }

    // Get blog post by ID
    public Optional<BlogPost> getBlogPostById(String id) {
        return blogPostRepository.findById(id);
    }


    public BlogPost updateBlogPostWithImage(String id, BlogRequestDto updatedPost) {
        BlogPost existingPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + id));

        // Title
        if (updatedPost != null && updatedPost.getTitle() != null && !updatedPost.getTitle().isEmpty()) {
            existingPost.setTitle(updatedPost.getTitle());
        }

        existingPost.setUpdateDate(LocalDateTime.now());

        // Banner Image Upload (optional)
        if (updatedPost !=null && updatedPost.getBannerImage() != null && !updatedPost.getBannerImage().isEmpty()) {
            String oldImage = existingPost.getBannerImageUrl();

            // Delete old image if present
            if (oldImage != null && !oldImage.isEmpty()) {
                cloudinaryService.deleteImageByUrl(oldImage);
            }

            // Always upload new image
            String imageUrl = cloudinaryService.uploadImage(updatedPost.getBannerImage());
            existingPost.setBannerImageUrl(imageUrl);
        }
        if (updatedPost !=null && !updatedPost.getContent().isEmpty()){
            existingPost.setReadTime(calculateReadTime(updatedPost.getContent()));
        }

        // If the post was previously rejected, mark it for review
        if (existingPost.getStatus() != null && existingPost.getStatus().equals("REJECTED")) {
            existingPost.setNeedsReview(true);
            existingPost.setStatus("PENDING");
        }
        
        return blogPostRepository.save(existingPost);
    }


    public void deleteBlogPost(String id){
        BlogPost existBlog = blogPostRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Blog not found"));

        String imageUrl = existBlog.getBannerImageUrl();
        if (imageUrl !=null && !imageUrl.isEmpty()){
            cloudinaryService.deleteImageByUrl(imageUrl);
        }
        blogPostRepository.delete(existBlog);
//        return existBlog;
    }

    public BlogPost publishPost(String id){
        BlogPost existBlog = blogPostRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Blog not available"));
        existBlog.setPublish(true);
        existBlog.setStatus("APPROVED");
        existBlog.setPublishDate(LocalDateTime.now());
        return blogPostRepository.save(existBlog);
    }


    public BlogPost createPopular(String id){
        BlogPost existBlog = blogPostRepository.findByIdAndPublishTrue(id)
                .orElseThrow(()-> new NotFoundException("Blog not available"));
        existBlog.setPopular(true);
        return blogPostRepository.save(existBlog);
    }




    public BlogPost rejectPost(String id, String reason) {
        BlogPost existingPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Blog not available"));

        // Update blog status
        existingPost.setPublish(false);
        existingPost.setStatus("REJECTED");

        // Create rejection record
        BlogRejection rejection = new BlogRejection();
        rejection.setBlogId(id);
        rejection.setReason(reason);
        rejection.setRejectionDate(LocalDateTime.now());
        rejection.setNotified(false);
        rejection.setResolved(false);
        rejectionRepository.save(rejection);

        return blogPostRepository.save(existingPost);
    }

    public void notifyAuthorOfRejection(String blogId) {
        BlogPost post = blogPostRepository.findById(blogId)
                .orElseThrow(() -> new NotFoundException("Blog not found"));

        BlogRejection rejection = rejectionRepository.findTopByBlogIdOrderByRejectionDateDesc(blogId)
                .orElseThrow(() -> new NotFoundException("Rejection record not found"));

        // Find the author's email
        User author = userRepository.findByEmail(post.getAuthor());
        if (author != null && author.getEmail() != null) {
            // Send email notification
            String subject = "Your blog post was not approved";
            String content = "Your blog post titled '" + post.getTitle() + "' was not approved for the following reason: " + rejection.getReason();
            emailService.sendSimpleMessage(author.getEmail(), subject, content);

            // Update notification status
            rejection.setNotified(true);
            rejectionRepository.save(rejection);
        }
    }

//    @Override
//    public BlogPost updateBlogPostWithImage(String id, BlogRequestDto updatedPost) {
//        BlogPost existingPost = blogPostRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + id));
//
//        // Title
//        if (updatedPost != null && updatedPost.getTitle() != null && !updatedPost.getTitle().isEmpty()) {
//            existingPost.setTitle(updatedPost.getTitle());
//        }
//
//        existingPost.setUpdateDate(LocalDateTime.now());
//
//        // Banner Image Upload (optional)
//        if (updatedPost !=null && updatedPost.getBannerImage() != null && !updatedPost.getBannerImage().isEmpty()) {
//            String oldImage = existingPost.getBannerImageUrl();
//
//            // Delete old image if present
//            if (oldImage != null && !oldImage.isEmpty()) {
//                cloudinaryService.deleteImageByUrl(oldImage);
//            }
//
//            // Always upload new image
//            String imageUrl = cloudinaryService.uploadImage(updatedPost.getBannerImage());
//            existingPost.setBannerImageUrl(imageUrl);
//        }
//        if (updatedPost !=null && !updatedPost.getContent().isEmpty()){
//            existingPost.setReadTime(calculateReadTime(updatedPost.getContent()));
//        }
//
//        return blogPostRepository.save(existingPost);
//    }





    private String calculateReadTime(String content) {
        if (content == null || content.trim().isEmpty()) {
            return "1 min";
        }

        // Strip HTML tags to count actual readable words
        String text = content.replaceAll("<[^>]*>", " ").replaceAll("\\s+", " ").trim();
        int wordCount = text.split(" ").length;

        int minutes = Math.max(1, wordCount / 200); // Ensure at least 1 minute
        return minutes + " min";
    }


}


