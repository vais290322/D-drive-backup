import mongoose from "mongoose";
import Post from "../models/Post.js";
import SavedPost from "../models/SavedPost.js";
import { createNotification } from "./notifications.js";
import { cloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import path from "path";

// Get all posts with optional filtering
export const getPosts = async (req, res) => {
  try {
    const requestQuire = req.query;
    const schoolId = requestQuire.schoolId; // Remove localStorage reference
    const className = requestQuire.class;
    const section = requestQuire.section;
    const teacher = requestQuire.teacher;
    const student = requestQuire.student;
    const audience = requestQuire.audience;

    console.log("Fetching posts with filters:", requestQuire);

    // Build filter object

    const filter = {};
    if (schoolId) filter.schoolId = schoolId;

    // Add audience filters if needed
    if (audience) {
      filter["audience.type"] = audience;
    }

    if (teacher) {
      filter["audience.teachers"] = { $in: [teacher] };
    }

    if (className) {
      filter["audience.classes"] = { $in: [className] };
    }
    if (section) {
      filter["audience.sections"] = { $in: [section] };
    }

    // Add student filter if audience type is 'student' and student ID is provided
    // More explicit condition and add debug logging
    if (audience === "student") {
      console.log("Audience type is student");
      if (student && student.trim() !== "") {
        console.log("Adding student filter for ID:", student);
        filter["audience.students"] = { $in: [student] };
      } else {
        console.log("Student ID is missing or empty");
      }
    }

    console.log("Fetching posts with filter:", filter);

    // Don't use populate if author is a string
    const posts = await Post.find(filter).sort({ createdAt: -1 });

    console.log("Found posts:", posts.length);

    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch posts",
    });
  }
};

// Get a single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name avatar role")
      .populate("likes", "name avatar role")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "name avatar role",
        },
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch post",
    });
  }
};

// Get all posts from a specific school (no audience filtering)
export const getAllSchoolPosts = async (req, res) => {
  try {
    const { schoolId } = req.query;
    
    if (!schoolId) {
      return res.status(400).json({
        success: false,
        message: "School ID is required"
      });
    }

    console.log("Fetching all posts for school:", schoolId);

    // Only filter by schoolId, no audience filtering
    const filter = { schoolId };
    
    console.log("Fetching posts with filter:", filter);

    const posts = await Post.find(filter).sort({ createdAt: -1 });

    console.log("Found posts:", posts.length);

    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    console.error("Error fetching school posts:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch school posts"
    });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    // console.log('Creating post with data:', req.body);

    const { content, audienceType } = req.body;

    // Create post data object
    const postData = {
      content: content || "",
      author: req.body.userId || "default-user-id",
      schoolId: req.body.schoolId || "default-school-id",
      audience: {
        type: audienceType || "all",
      },
    };

    // Add audience details if provided
    if (req.body.classes) {
      try {
        postData.audience.classes = Array.isArray(req.body.classes)
          ? req.body.classes
          : JSON.parse(req.body.classes);
      } catch (e) {
        console.log("Error parsing classes:", e);
        postData.audience.classes = [];
      }
    }

    if (req.body.sections) {
      try {
        postData.audience.sections = Array.isArray(req.body.sections)
          ? req.body.sections
          : JSON.parse(req.body.sections);
      } catch (e) {
        console.log("Error parsing sections:", e);
        postData.audience.sections = [];
      }
    }

    if (req.body.students) {
      postData.audience.students = JSON.parse(req.body.students);
    }

    if (req.body.teachers) {
      postData.audience.teachers = JSON.parse(req.body.teachers);
    }

    // Handle media upload if provided
    if (req.file) {
      try {
        let result;
        if (req.body.mediaType === "document") {
          result = await cloudinary.uploader.upload(req.file.path, {
            folder: "school_feed",
            resource_type: "raw",
            // resource_type:'auto',
          });
        } else if (req.body.mediaType === "video") {
          result = await cloudinary.uploader.upload(req.file.path, {
            folder: "school_feed",
            resource_type: "video",
          });
        } else {
          result = await cloudinary.uploader.upload(req.file.path, {
            folder: "school_feed",
            resource_type: "image",
          });
        }

        console.log("Media uploaded successfully:", result);

        postData.media = {
          url: result.secure_url,
          publicId: result.public_id,
          // type: req.file.mimetype.startsWith('image') ? 'image' : 'video'
          type: req.body.mediaType,
          format: result.format,
        };

        // ... existing code ...
        console.log("Media uploaded successfully:", result);

        postData.media = {
          url: result.secure_url,
          publicId: result.public_id,
          // type: req.file.mimetype.startsWith('image') ? 'image' : 'video'
          type: req.body.mediaType,
          format: result.format,
        };

        // Add a delay before attempting to delete the file
        setTimeout(() => {
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.error("Error deleting temporary file:", err);
              // If still getting EBUSY, try again with a longer delay
              if (err.code === "EBUSY") {
                setTimeout(() => {
                  fs.unlink(req.file.path, (unlinkErr) => {
                    if (unlinkErr) {
                      console.error(
                        "Second attempt to delete file failed:",
                        unlinkErr
                      );
                    } else {
                      console.log(
                        "Temporary file deleted successfully on second attempt:",
                        req.file.path
                      );
                    }
                  });
                }, 2000); // 2 second delay for second attempt
              }
            } else {
              console.log(
                "Temporary file deleted successfully:",
                req.file.path
              );
            }
          });
        }, 1000); // 1 second delay before first deletion attempt
        // ... existing code ...
      } catch (uploadError) {
        console.error("Error uploading media:", uploadError);
        setTimeout(() => {
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.error(
                "Error deleting temporary file after failed upload:",
                err
              );
              // Try again if busy
              if (err.code === "EBUSY") {
                setTimeout(() => {
                  fs.unlink(req.file.path, () => {});
                }, 2000);
              }
            }
          });
        }, 1000);
      }
    }

    // Create the post
    const post = await Post.create(postData);

    // Create notifications based on audience type
    if (post.audience.type === "admin") {
      // Notify all admins in the school
      const adminNotification = {
        recipient: "admin",
        audienceType: "admin",
        sender: post.author,
        title: "New Post",
        message: `A new post has been created for administrators`,
        type: "post",
        postId: post._id,
        schoolId: post.schoolId,
      };
      await createNotification(adminNotification);
    } else if (
      post.audience.type === "teacher" 
    ) {
      // For each teacher in the audience, create a notification
      if (post.audience.teachers && post.audience.teachers.length > 0) {
        for (const teacherId of post.audience.teachers) {
          const teacherNotification = {
            recipient: teacherId,
            sender: post.author,
            title: "New Post",
            message: `A new post has been created for you`,
            type: "post",
            postId: post._id,
            schoolId: post.schoolId,
          };
          await createNotification(teacherNotification);
        }
      }
    } else if (
      post.audience.type === "allTeachers" 
    ) {
      // For each teacher in the audience, create a notification
      if (post.audience.teachers && post.audience.teachers.length > 0) {
        for (const teacherId of post.audience.teachers) {
          const allTeachersNotification = {
            recipient: 'allTeachers',
            audienceType: 'allTeachers',
            sender: post.author,
            title: 'New Post',
            message: `A new post has been created for all teachers`,
            type: 'post',
            postId: post._id,
            schoolId: post.schoolId
          };
          await createNotification(allTeachersNotification);
        }
      }
    }
    
    else if (post.audience.type === "student") {
      // For each student in the audience, create a notification
      if (post.audience.students && post.audience.students.length > 0) {
        for (const studentId of post.audience.students) {
          const studentNotification = {
            recipient: studentId,
            sender: post.author,
            title: "New Post",
            message: `A new post has been created for you`,
            type: "post",
            postId: post._id,
            schoolId: post.schoolId,
          };
          await createNotification(studentNotification);
        }
      }
    } else if (post.audience.type === "all") {
      // Create a system-wide notification for all users
      const allUsersNotification = {
        recipient: "all",
        audienceType: "all",
        sender: post.author,
        title: "New Post",
        message: `A new post has been created for everyone`,
        type: "post",
        postId: post._id,
        schoolId: post.schoolId,
      };
      await createNotification(allUsersNotification);
    }

    return res.status(201).json({
      success: true,
      data: post,
      message: "Post created successfully",
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create post",
    });
  }
};

// Update a post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Update post fields
    if (req.body.content) post.content = req.body.content;

    // Save updated post
    await post.save();

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update post",
    });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Delete media from cloudinary if exists
    if (post.media && post.media.publicId) {
      await cloudinary.uploader.destroy(post.media.publicId);
    }

    // Delete the post
    await post.deleteOne();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete post",
    });
  }
};

// Get posts by author (for "My Posts" feature)
export const getPostsByAuthor = async (req, res) => {
  try {
    const { userId, schoolId } = req.query;
    console.log("Fetching posts by author:", userId, "for school:", schoolId);
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    console.log("Fetching posts by author:", userId, "for school:", schoolId);

    // Build filter object
    const filter = {
      author: userId,
    };

    // Add schoolId filter if provided
    if (schoolId) {
      filter.schoolId = schoolId;
    }

    console.log("Fetching posts with filter:", filter);

    const posts = await Post.find(filter).sort({ createdAt: -1 });

    console.log("Found posts:", posts.length);

    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching posts by author:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch posts by author",
    });
  }
};

// Add a comment to a post
export const addComment = async (req, res) => {
  try {
    // console.log('Adding comment to post with ID:', req.params.id);

    // Check if post ID is valid
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Create comment object
    const comment = {
      content: req.body.content,
      author: req.body.userId || "default-user-id",
      userName: req.body.userName || "User",
      createdAt: Date.now(),
    };

    // Add comment to post
    post.comments.push(comment);
    await post.save();
    // Get the newly added comment
    const newComment = post.comments[post.comments.length - 1];

    // Create notification for post author
    if (post.author !== req.body.userId) {
      // Don't notify if user comments on their own post
      const notification = {
        recipient: post.author,
        sender: req.body.userId,
        title: "New Comment",
        message: `${
          req.body.userName
        } commented on your post: "${req.body.content.substring(0, 30)}${
          req.body.content.length > 300 ? "..." : ""
        }"`,
        type: "comment",
        postId: post._id,
        schoolId: post.schoolId,
      };
      await createNotification(notification);
    }

    return res.status(201).json({
      success: true,
      data: newComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add comment",
    });
  }
};

// Like a post
export const likePost = async (req, res) => {
  try {
    // console.log('Liking post with ID:', req.params.id);

    // Check if post ID is valid
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Use provided userId or default
    const userId = req.body.userId || "default-user-id";
    const userName = req.body.userName || "User";

    // Check if post is already liked by this user
    const isLiked = post.likes.some(
      (like) => (like.userId && like.userId === userId) || like === userId
    );

    if (isLiked) {
      return res.status(400).json({
        success: false,
        message: "Post already liked",
      });
    }

    // Add user to likes array
    post.likes.push({ userId, userName });
    await post.save();

    // Create notification for post author
    if (post.author !== userId) {
      // Don't notify if user likes their own post
      const notification = {
        recipient: post.author,
        sender: userId,
        title: "New Like",
        message: `${userName} liked your post`,
        type: "like",
        postId: post._id,
        schoolId: post.schoolId,
      };
      await createNotification(notification);
    }

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    // console.error('Error liking post:', error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to like post",
    });
  }
};

// Unlike a post
export const unlikePost = async (req, res) => {
  try {
    console.log("Unliking post with ID:", req.params.id);

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Use provided userId or default
    const userId = req.body.userId || "default-user-id";

    // Check if post.likes is an array of objects or strings
    let isLiked = false;
    if (Array.isArray(post.likes)) {
      if (post.likes.length > 0 && typeof post.likes[0] === "object") {
        // If likes is an array of objects with userId property
        isLiked = post.likes.some((like) => like.userId === userId);
      } else {
        // If likes is an array of strings (user IDs)
        isLiked = post.likes.includes(userId);
      }
    }

    if (!isLiked) {
      return res.status(400).json({
        success: false,
        message: "Post not liked yet",
      });
    }

    // Remove user from likes array based on its structure
    if (Array.isArray(post.likes)) {
      if (post.likes.length > 0 && typeof post.likes[0] === "object") {
        post.likes = post.likes.filter((like) => like.userId !== userId);
      } else {
        post.likes = post.likes.filter((id) => id !== userId);
      }
    }

    await post.save();

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Error unliking post:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to unlike post",
    });
  }
};

// Save a post
export const savePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId, schoolId } = req.body;
    // console.log('Saving post with ID:', postId, 'for user:', userId, 'in school:', schoolId);

    if (!postId || !userId || !schoolId) {
      return res.status(400).json({
        success: false,
        message: "Post ID, User ID, and School ID are required",
      });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Check if already saved
    const existingSave = await SavedPost.findOne({ userId, postId });
    if (existingSave) {
      return res
        .status(400)
        .json({ success: false, message: "Post already saved" });
    }

    // Create new saved post entry
    const savedPost = new SavedPost({
      userId,
      postId,
      schoolId,
    });

    await savedPost.save();

    // Get all saved post IDs for this user
    const savedPosts = await SavedPost.find({ userId });
    const savedPostIds = savedPosts.map((save) => save.postId);

    return res.status(200).json({
      success: true,
      message: "Post saved successfully",
      data: savedPostIds,
    });
  } catch (error) {
    console.error("Error saving post:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to save post",
    });
  }
};

// Unsave a post
export const unsavePost = async (req, res) => {
  try {
    // const { postId } = req.params;
    const postId = req.params.id;
    const { userId } = req.body;

    if (!postId || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Post ID and User ID are required" });
    }

    // Delete the saved post entry
    const result = await SavedPost.findOneAndDelete({ userId, postId });

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Saved post not found" });
    }

    // Get all saved post IDs for this user
    const savedPosts = await SavedPost.find({ userId });
    const savedPostIds = savedPosts.map((save) => save.postId);

    return res.status(200).json({
      success: true,
      message: "Post unsaved successfully",
      data: savedPostIds,
    });
  } catch (error) {
    console.error("Error unsaving post:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to unsave post",
    });
  }
};

// Get saved posts
export const getSavedPosts = async (req, res) => {
  try {
    const { userId, schoolId } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    // Find all saved posts for this user
    const savedPosts = await SavedPost.find({ userId });

    if (savedPosts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No saved posts found",
        data: [],
      });
    }

    // Get the post IDs
    const postIds = savedPosts.map((save) => save.postId);

    // Find the actual posts
    let posts = await Post.find({ _id: { $in: postIds } })
      .populate("author", "name role avatar")
      .populate("likes.userId", "name role avatar")
      .populate("comments.author", "name role avatar");

    // Filter by schoolId if provided
    if (schoolId) {
      posts = posts.filter((post) => post.schoolId === schoolId);
    }

    return res.status(200).json({
      success: true,
      message: "Saved posts retrieved successfully",
      data: posts,
    });
  } catch (error) {
    console.error("Error getting saved posts:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get saved posts",
    });
  }
};

// Get saved post IDs
export const getSavedPostIds = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    // Find all saved posts for this user
    const savedPosts = await SavedPost.find({ userId });

    // Get the post IDs
    const postIds = savedPosts.map((save) => save.postId);

    return res.status(200).json({
      success: true,
      message: "Saved post IDs retrieved successfully",
      data: postIds,
    });
  } catch (error) {
    console.error("Error getting saved post IDs:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get saved post IDs",
    });
  }
};
