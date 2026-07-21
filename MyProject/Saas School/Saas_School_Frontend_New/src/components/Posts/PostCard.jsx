import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import {
  likePostAsync,
  unlikePostAsync,
  addCommentAsync,
  savePostAsync,
  unsavePostAsync,
  fetchSavedPostIds,
} from "@/utils/posts/postsSlice";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Send,
  Download,
  FileText,
  Film,
  Bookmark,
  Flag,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";
import UserProfileHover from "./UserProfileHover";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import postsUrlApi, { userUrlApi } from "@/common/posts";

const PostCard = ({ post }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state?.auth?.userDetails?.id);
  const savedPostIds = useSelector((state) => state.posts.savedPostIds) || [];
  // console.log("savedPostIds : ",savedPostIds);
  const userName = useSelector((state) => {
    const user = state?.auth?.user;
    if (user === "student") return state?.auth?.userDetails?.studentName;
    if (user === "teacher") return state?.auth?.userDetails?.teachersName;
    if (user === "edp") return state?.auth?.userDetails?.edpName;
    if (user === "librarian") return state?.auth?.userDetails?.librarianName;
    return "User";
  });
  const [currentUserImage, setCurrentUserImage] = useState("");
  const schoolId = useSelector(
    (state) =>
      state?.auth?.schoolId ||
      state?.auth?.userDetails?.schoolId ||
      state?.institute?.institute?.id
  );
  const [authorDetails, setAuthorDetails] = useState({});
  const [authorRole, setAuthorRole] = useState("");
  const [commentUsers, setCommentUsers] = useState({});
  const [likeUsers, setLikeUsers] = useState({});

  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [likesDialogOpen, setLikesDialogOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // Check if post has an _id property, if not use id
  const postId = post._id || post.id;
  // const isSaved = savedPostIds ? savedPostIds.includes(postId) : false;
  const isSaved = Array.isArray(savedPostIds) && savedPostIds.includes(postId);

  // Make sure we have a valid post ID before checking likes
  const isLiked =
    postId && post.likes
      ? post.likes.some((like) => like.userId === userId)
      : false;

  useEffect(() => {
    if (userId) {
      dispatch(fetchSavedPostIds(userId));
    }
  }, [dispatch, userId]);

  const handleLikeToggle = async () => {
    if (!postId) {
      toast.error("Invalid post ID");
      return;
    }

    setIsLiking(true);
    try {
      if (isLiked) {
        dispatch(unlikePostAsync(postId));
      } else {
        dispatch(likePostAsync(postId));
      }
    } catch (error) {
      toast.error("Failed to update like status");
    } finally {
      setTimeout(() => setIsLiking(false), 300);
    }
  };

  const handleSaveToggle = async () => {
    if (!postId) {
      toast.error("Invalid post ID");
      return;
    }

    try {
      if (isSaved) {
        await dispatch(unsavePostAsync({ postId, userId })).unwrap();
        toast.success("Post removed from saved");
      } else {
        await dispatch(savePostAsync({ postId, userId, schoolId })).unwrap();
        toast.success("Post saved successfully");
      }
    } catch (error) {
      toast.error(error || "Failed to save/unsave post");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!postId) {
      toast.error("Invalid post ID");
      return;
    }

    try {
      dispatch(
        addCommentAsync({
          postId: postId,
          content: commentText,
        })
      );

      setCommentText("");
      toast.success("Comment added successfully!");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "some time ago";
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "from-indigo-500 to-purple-600",
      vais: "from-indigo-500 to-purple-600",
      teacher: "from-green-500 to-emerald-600",
      edp: "from-amber-500 to-orange-600",
      librarian: "from-purple-500 to-pink-600",
      student: "from-blue-500 to-cyan-600",
      default: "from-gray-500 to-gray-600",
    };
    return colors[role] || colors.default;
  };

  const getRoleBadgeStyle = (role) => {
    const styles = {
      admin: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white",
      vais: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white",
      teacher: "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
      edp: "bg-gradient-to-r from-amber-500 to-orange-600 text-white",
      librarian: "bg-gradient-to-r from-purple-500 to-pink-600 text-white",
      student: "bg-gradient-to-r from-blue-500 to-cyan-600 text-white",
      default: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
    };
    return styles[role] || styles.default;
  };

  const getAudienceText = () => {
    if (post.audience.type === "all") {
      return "📢 Posted to everyone";
    } else if (post.audience.type === "class") {
      return `🎓 Class ${post.audience.classes.join(", ")} ${
        post.audience.sections.length > 0
          ? `Section ${post.audience.sections.join(", ")}`
          : ""
      }`;
    } else if (post.audience.type === "student") {
      return "👥 Posted to specific students";
    }
    return "";
  };

  const shouldTruncateContent = (content) => {
    // Check if content exists and is a string
    return typeof content === "string" && content.length > 200;
  };

  const getTruncatedContent = (content) => {
    // If content doesn't exist or isn't a string, return empty string
    if (typeof content !== "string") return "";

    // If content doesn't need truncation, return as is
    if (!shouldTruncateContent(content)) return content;

    // Return full or truncated content based on state
    return showFullContent ? content : `${content.substring(0, 200)}...`;
  };

  const handleMediaClick = (e) => {
    e.stopPropagation();
    setMediaDialogOpen(true);
  };

  const handleDeletePost = async () => {
    try {
      // await dispatch(deletePostAsync(post._id)).unwrap();
      const response = await axios.delete(`${postsUrlApi}/posts/${post._id}`);
      // console.log("delte response : ",response)
      if (response.data.success) {
        toast.success("Post deleted successfully");
        setDeleteDialogOpen(false);
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response.data.message || "Failed to delete post");
    }
  };

  useEffect(() => {
    const fetchAuthorDetails = async () => {
      if (post.author && schoolId) {
        try {
          const res = await axios.get(
            `${userUrlApi}/${post.author}/${post.schoolId}`
          );
          setAuthorDetails(res.data.data.user);
          setAuthorRole(res.data.data.role);
        } catch (error) {
          console.error("Error fetching author details", error);
        }
      }
    };

    fetchAuthorDetails();
  }, [post.author, schoolId]);

  const fetchUserDetails = async (userId, schoolId) => {
    try {
      const res = await axios.get(
        `${userUrlApi}/${userId}/${schoolId}`
      );
      return res.data.data;
    } catch (err) {
      console.error("Failed to fetch user", userId, err);
      return null;
    }
  };

  useEffect(() => {
    const loadUserDetails = async () => {
      const commentMap = {};
      const likeMap = {};

      await Promise.all(
        post.comments.map(async (cmt) => {
          if (!commentMap[cmt.author]) {
            const data = await fetchUserDetails(cmt.author, schoolId);
            if (data) commentMap[cmt.author] = data.user;
          }
        })
      );

      await Promise.all(
        post.likes.map(async (like) => {
          if (!likeMap[like.userId]) {
            const data = await fetchUserDetails(like.userId, schoolId);
            if (data) likeMap[like.userId] = data.user;
          }
        })
      );

      setCommentUsers(commentMap);
      setLikeUsers(likeMap);
    };

    if (schoolId) {
      loadUserDetails();
    }
  }, [post.comments, post.likes, schoolId]);

  const authorName =
    authorDetails?.studentName ||
    authorDetails?.teachersName ||
    authorDetails?.schoolPrincipalName ||
    authorDetails?.edpName ||
    authorDetails?.librarianName ||
    "User";

  const authorImage =
    authorDetails?.studentImage ||
    authorDetails?.teachersImage ||
    authorDetails?.edpImage ||
    authorDetails?.librarianImage ||
    authorDetails?.schoolLogo;

  useEffect(() => {
    const fetchCurrentUserImage = async () => {
      if (userId && schoolId) {
        try {
          const res = await axios.get(
            `${userUrlApi}/${userId}/${schoolId}`
          );
          if (res.data && res.data.data && res.data.data.user) {
            const user = res.data.data.user;
            const userImage =
              user?.studentImage ||
              user?.teachersImage ||
              user?.edpImage ||
              user?.librarianImage ||
              user?.schoolLogo;
            setCurrentUserImage(userImage);
          }
        } catch (error) {
          console.error("Error fetching current user image", error);
        }
      }
    };

    fetchCurrentUserImage();
  }, [userId, schoolId]);

  // Add this function after your state declarations
  const getDocumentDisplay = (url) => {
    // Extract file extension from URL
    // Extract file extension from URL or use content-type if available
    let fileExtension = "";

    // Try to extract extension from URL
    const urlParts = url.split(".");
    if (urlParts.length > 1) {
      fileExtension = urlParts.pop().toLowerCase();
    }

    // For Cloudinary raw uploads that don't have extensions in the URL
    // Check if it's a Cloudinary URL
    if (!fileExtension && url.includes("cloudinary.com/raw/upload")) {
      // Try to determine file type from original filename if available in post metadata
      if (post.media?.originalFilename) {
        const originalFilenameParts = post.media.originalFilename.split(".");
        if (originalFilenameParts.length > 1) {
          fileExtension = originalFilenameParts.pop().toLowerCase();
        }
      }

      // If still no extension, try to infer from the URL pattern or default to a generic viewer
      if (!fileExtension) {
        // Check for common document types in the URL or metadata
        if (post.media?.mimeType) {
          console.log("file format : ", post.media.mimeType);
          // Extract from MIME type if available
          const mimeTypeParts = post.media.mimeType.split("/");
          if (mimeTypeParts.length > 1) {
            const subtype = mimeTypeParts[1];
            if (subtype === "pdf") fileExtension = "pdf";
            else if (subtype.includes("word") || subtype === "docx")
              fileExtension = "docx";
            else if (subtype.includes("excel") || subtype === "xlsx")
              fileExtension = "xlsx";
            else if (subtype.includes("powerpoint") || subtype === "pptx")
              fileExtension = "pptx";
            else if (subtype === "plain") fileExtension = "txt";
          }
        }
      }
    }
    // Handle different file types
    switch (fileExtension) {
      case "pdf":
        return (
          <object
            data={url}
            type="application/pdf"
            width="100%"
            height="600px"
            className="rounded-xl overflow-hidden shadow-lg"
          >
            <p className="text-center p-4">
              Your browser doesn't support inline PDFs.{" "}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Download the document
              </a>
              .
            </p>
          </object>
        );
      case "doc":
      case "docx":
        return (
          <div className="flex flex-col items-center justify-center p-8 bg-blue-50 rounded-xl">
            <FileText className="h-24 w-24 mb-4 text-blue-600" />
            <p className="mb-2 font-medium">Word Document</p>
            <p className="text-sm text-gray-500 mb-4">
              Microsoft Word documents cannot be previewed directly.
            </p>
          </div>
        );
      case "xls":
      case "xlsx":
        return (
          <div className="flex flex-col items-center justify-center p-8 bg-green-50 rounded-xl">
            <FileText className="h-24 w-24 mb-4 text-green-600" />
            <p className="mb-2 font-medium">Excel Spreadsheet</p>
            <p className="text-sm text-gray-500 mb-4">
              Microsoft Excel files cannot be previewed directly.
            </p>
          </div>
        );
      case "ppt":
      case "pptx":
        return (
          <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-xl">
            <FileText className="h-24 w-24 mb-4 text-red-600" />
            <p className="mb-2 font-medium">PowerPoint Presentation</p>
            <p className="text-sm text-gray-500 mb-4">
              PowerPoint presentations cannot be previewed directly.
            </p>
          </div>
        );
      case "txt":
        return (
          <iframe
            src={url}
            width="100%"
            height="600px"
            className="rounded-xl overflow-hidden shadow-lg"
          >
            <p className="text-center p-4">
              Your browser doesn't support inline text files.{" "}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Download the document
              </a>
              .
            </p>
          </iframe>
        );
      default:
        // For unknown file types
        return (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl">
            <FileText className="h-24 w-24 mb-4 text-gray-600" />
            <p className="mb-2 font-medium">Document</p>
            <p className="text-sm text-gray-500 mb-4">
              This document type cannot be previewed directly.
            </p>
          </div>
        );
    }
  };

  return (
    <div
      className={`group relative overflow-hidden transition-all duration-300 rounded-xl sm:rounded-2xl mx-2 sm:mx-0 ${
        theme === "light"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 shadow-lg"
          : "bg-white border border-gray-200 shadow-md "
      }`}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none " />

      {/* Post Header */}
      <div className="relative p-3 sm:p-5 pb-2 sm:pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <UserProfileHover
              userId={post.author}
              schoolId={schoolId}
              role={authorRole}
            >
              <div className="relative">
                <Avatar className="h-11 w-11 ring-2 ring-white/20 ring-offset-2 ring-offset-transparent transition-all duration-300 hover:ring-4 hover:ring-blue-500/30 cursor-pointer">
                  <AvatarImage
                    src={authorImage}
                    alt={authorName}
                    className="object-cover"
                  />
                  <AvatarFallback
                    className={`bg-gradient-to-br ${getRoleColor(
                      authorRole
                    )} text-white font-semibold text-lg`}
                  >
                    {authorName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator */}
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white animate-pulse" />
              </div>
            </UserProfileHover>

            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3
                  className={`font-bold text-base ${
                    theme === "light" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {authorName}
                </h3>
                {authorRole && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeStyle(
                      authorRole
                    )} shadow-sm`}
                  >
                    {authorRole.toUpperCase()}
                  </span>
                )}
                <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
              </div>

              <div className="flex items-center space-x-2 mt-0.5">
                <span
                  className={`text-xs font-medium ${
                    theme === "light" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {formatDate(post.createdAt)}
                </span>
                <span
                  className={`text-xs ${
                    theme === "light" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  •
                </span>
                <span
                  className={`text-xs ${
                    theme === "light" ? "text-blue-400" : "text-blue-600"
                  } font-medium`}
                >
                  {getAudienceText()}
                </span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full transition-all duration-200 hover:scale-110 cursor-pointer ${
                  theme === "light"
                    ? "hover:bg-gray-700/50 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={`${
                theme === "light"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-200"
              } shadow-xl rounded-xl border backdrop-blur-sm`}
            >
              <DropdownMenuItem className="flex items-center space-x-2 hover:bg-blue-500/10 cursor-pointer">
                <Bookmark className="w-4 h-4" />
                <span>Save Post</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2 hover:bg-yellow-500/10 cursor-pointer">
                <Flag className="w-4 h-4" />
                <span>Report Post</span>
              </DropdownMenuItem>
              {userId === post.author && (
                <DropdownMenuItem
                  className="flex items-center space-x-2 text-red-500 hover:bg-red-500/10 cursor-pointer"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Post</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-3 sm:px-5 pb-2 sm:pb-3">
        <div className="prose max-w-none">
          <p
            className={`text-sm sm:text-base leading-relaxed ${
              theme === "light" ? "text-gray-200" : "text-gray-700"
            } whitespace-pre-line`}
          >
            {getTruncatedContent(post.content)}
          </p>
          {shouldTruncateContent(post.content) && (
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent any parent click events
                e.stopPropagation(); // Ensure the click doesn't propagate
                setShowFullContent(!showFullContent);
              }}
              className={`mt-1.5 flex items-center text-xs sm:text-sm font-medium cursor-pointer ${
                theme === "light"
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
              } transition-colors duration-200`}
            >
              {showFullContent ? (
                <>
                  Show less <ChevronUp className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </>
              ) : (
                <>
                  Read more <ChevronDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Post Media */}
      {post.media && (
        <div className="relative mx-3 sm:mx-5 mb-3 sm:mb-4 rounded-lg sm:rounded-xl overflow-hidden shadow-lg cursor-pointer">
          {post.media.type === "image" && (
            <div className="relative group/image">
              <img
                src={post.media.url}
                alt="Post attachment"
                className="w-full h-auto max-h-64 sm:max-h-96 object-cover transition-transform duration-300 group-hover/image:scale-105"
                onClick={handleMediaClick}
              />
              <div
                className="absolute inset-0 bg-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                onClick={handleMediaClick}
              >
                <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
              </div>
            </div>
          )}

          {/* {post.media.type === "video" && (
            <div
              className="w-full aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center group/video relative overflow-hidden"
              onClick={handleMediaClick}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover/video:from-blue-500/30 group-hover/video:to-purple-500/30 transition-all duration-300" />
              <Film className="h-16 w-16 text-white opacity-80 drop-shadow-lg group-hover/video:scale-110 transition-transform duration-300" />
            </div>
          )} */}

          {post.media.type === "video" && (
            <div className="w-full aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center group/video relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover/video:from-blue-500/30 group-hover/video:to-purple-500/30 transition-all duration-300" />
              <video
                src={post.media.url}
                className="w-full h-full object-contain absolute inset-0 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  if (e.target.paused) {
                    e.target.play();
                  } else {
                    e.target.pause();
                    setMediaDialogOpen(true);
                  }
                }}
              />
              <Film
                className="h-16 w-16 text-white opacity-80 drop-shadow-lg group-hover/video:scale-110 transition-transform duration-300"
                onClick={() => setMediaDialogOpen(true)}
              />
            </div>
          )}

          {post.media.type === "document" && (
            <div
              className={`w-full p-6 flex items-center justify-center group/doc ${
                theme === "light"
                  ? "bg-gradient-to-br from-gray-700 to-gray-800"
                  : "bg-gradient-to-br from-gray-50 to-gray-100"
              } transition-all duration-300 hover:shadow-inner`}
              onClick={handleMediaClick}
            >
              <div className="flex flex-col items-center">
                <FileText
                  className={`h-16 w-16 ${
                    theme === "light" ? "text-gray-300" : "text-gray-600"
                  } group-hover/doc:scale-110 transition-transform duration-300`}
                />
                <span className="mt-3 text-lg font-medium">View Document</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Post's states  */}
      <div
        className={`flex justify-between items-center p-1 border-t ${
          theme === "light" ? "border-gray-700/50" : "border-gray-200"
        }`}
      >
        {/* Likes Button */}
        <div
          className={`relative flex items-center space-x-2 hover:text-red-500 transition-colors duration-200`}
        >
          {/* Avatars: allow overflow so they don’t clip siblings */}
          <div className="flex -space-x-1 overflow-visible z-10">
            {post.likes.slice(0, 3).map((like) => {
              const user = likeUsers[like.userId];
              const img =
                user?.studentImage ||
                user?.teachersImage ||
                user?.edpImage ||
                user?.librarianImage ||
                user?.schoolLogo;
              return (
                <UserProfileHover
                  key={like.userId}
                  userId={like.userId}
                  schoolId={schoolId}
                  role={user?.role || ""}
                >
                  <Avatar
                    className="w-6 h-6 border-2 border-white cursor-pointer"
                    onClick={() =>
                      post.likes.length > 0 && setLikesDialogOpen(true)
                    }
                  >
                    <AvatarImage src={img} />
                    <AvatarFallback className="text-xs bg-red-500 text-white">
                      {(user?.studentName || user?.teachersName || "U")[0]}
                    </AvatarFallback>
                  </Avatar>
                </UserProfileHover>
              );
            })}
          </div>

          {/* Lift the text button on top */}
          <button
            type="button"
            onClick={() => post.likes.length > 0 && setLikesDialogOpen(true)}
            className="relative z-20 font-medium cursor-pointer bg-transparent p-0 border-none"
          >
            {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
          </button>
        </div>

        {/* Comments Button (no negative-margin avatars here, but lift anyway) */}
        <div className="relative flex items-center space-x-2 hover:text-blue-500 transition-colors duration-200">
          <MessageCircle className="w-4 h-4 z-10" />
          <button
            type="button"
            onClick={() => setShowComments((prev) => !prev)}
            className="relative z-20 font-medium cursor-pointer bg-transparent p-0 border-none"
          >
            {post.comments.length} comments
          </button>
        </div>
      </div>

      <Separator className={theme === "light" ? "bg-gray-700" : ""} />
      {/* Post Actions */}
      <div
        className={`px-5 py-2 flex justify-around ${
          theme === "light" ? "border-gray-700/50" : "border-gray-200"
        }`}
      >
        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 mx-1 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer ${
            isLiked
              ? "text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
              : theme === "light"
              ? "text-gray-300 hover:text-red-400 hover:bg-red-900/20"
              : "text-gray-600 hover:text-red-500 hover:bg-red-50"
          } ${isLiking ? "animate-pulse" : ""}`}
          onClick={handleLikeToggle}
          disabled={isLiking}
        >
          <div className="flex items-center justify-center">
            <Heart
              className={`mr-2 h-4 w-4 transition-all duration-300 ${
                isLiked ? "fill-current animate-bounce" : ""
              } ${isLiking ? "animate-pulse" : ""}`}
            />
            <span>Like</span>
          </div>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 mx-1 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer ${
            showComments
              ? "text-blue-500 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30"
              : theme === "light"
              ? "text-gray-300 hover:text-blue-400 hover:bg-blue-900/20"
              : "text-gray-600 hover:text-blue-500 hover:bg-blue-50"
          }`}
          onClick={() => setShowComments(!showComments)}
        >
          <div className="flex items-center justify-center">
            <MessageCircle className="mr-2 h-4 w-4" />
            <span>Comment</span>
          </div>
        </Button>

        {/* <Button
          variant="ghost"
          size="sm"
          className={`flex-1 mx-1 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer ${
            theme === "light"
              ? "text-gray-300 hover:text-green-400 hover:bg-green-900/20"
              : "text-gray-600 hover:text-green-500 hover:bg-green-50"
          }`}
        >
          <div className="flex items-center justify-center">
            <Share2 className="mr-2 h-4 w-4" />
            <span>Share</span>
          </div>
        </Button> */}

        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 mx-1 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer ${
            theme === "light"
              ? " hover:text-green-400 hover:bg-green-900/20"
              : " hover:text-green-500 hover:bg-green-50"
          }r ${isSaved ? "text-blue-500" : ""}`}
          onClick={handleSaveToggle}
        >
          <Bookmark
            className={`h-5 w-5 mr-1 ${isSaved ? "fill-current" : ""}`}
          />
          <span>{isSaved ? "Unsave" : "Save"}</span>
        </Button>
      </div>

      {/* Comments Section */}

      {showComments && (
        <div
          className={`mx-3 sm:mx-5 mb-3 sm:mb-5 rounded-lg sm:rounded-xl transition-all duration-30 ${
            theme === "light" ? "bg-gray-800/50 " : "bg-gray-50"
          }`}
        >
          {/* Comment Form */}
          <form
            onSubmit={handleAddComment}
            className="p-2 sm:p-3 border-b border-gray-200/20"
          >
            <div className="flex gap-2 sm:gap-3">
              <Avatar className="h-6 w-6 sm:h-8 sm:w-8 ring-1 sm:ring-2 ring-white/20">
                <AvatarImage src={currentUserImage} alt={userName} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs sm:text-sm">
                  {userName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-1 sm:gap-2">
                <Input
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className={`flex-1 rounded-lg sm:rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 text-sm ${
                    theme === "light"
                      ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300"
                  }`}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="px-2 sm:px-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
                  disabled={!commentText.trim()}
                >
                  <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-2 sm:space-y-3 mt-2 p-2 sm:p-3">
            {post.comments.map((comment) => {
              const user = commentUsers[comment.author];
              const userName =
                user?.studentName ||
                user?.teachersName ||
                user?.edpName ||
                user?.librarianName ||
                user?.schoolPrincipalName ||
                "User";
              const userImage =
                user?.studentImage ||
                user?.teachersImage ||
                user?.edpImage ||
                user?.librarianImage ||
                user?.schoolLogo;

              return (
                <div
                  key={comment._id}
                  className={`flex gap-3 p-3 rounded-lg  ${
                    theme === "light"
                      ? "hover:bg-gray-700/30"
                      : "hover:bg-white/70"
                  }`}
                >
                  <UserProfileHover
                    userId={comment.author}
                    schoolId={schoolId}
                    role={user?.role || ""}
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-white/20 hover:ring-4 hover:ring-blue-500/30 transition-all duration-300 cursor-pointer">
                      <AvatarImage src={userImage} alt={userName} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-xs sm:text-sm">
                        {userName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </UserProfileHover>

                  <div className="flex-1">
                    <div
                      className={`p-3 rounded-2xl ${
                        theme === "light"
                          ? "bg-gray-700/50 text-white"
                          : "bg-white shadow-sm text-gray-800"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-sm">
                          {userName}
                        </span>
                        <span
                          className={`text-xs ${
                            theme === "light"
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            {post.comments.length === 0 && (
              <div
                className={`text-center py-6 ${
                  theme === "light" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Likes Dialog */}

      <Dialog open={likesDialogOpen} onOpenChange={setLikesDialogOpen}>
        <DialogContent
          className={
            theme === "light" ? "bg-gray-800 text-white border-gray-700" : ""
          }
        >
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg font-bold">
              <Heart className="w-5 h-5 text-red-500 fill-current" />
              <span>People who liked this</span>
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {post.likes.map((like) => {
              const user = likeUsers[like.userId];
              const userName =
                user?.studentName ||
                user?.teachersName ||
                user?.edpName ||
                user?.librarianName ||
                user?.schoolPrincipalName ||
                "User";
              const userImage =
                user?.studentImage ||
                user?.teachersImage ||
                user?.edpImage ||
                user?.librarianImage ||
                user?.schoolLogo;

              return (
                <div
                  key={like.userId}
                  className="flex items-center gap-2 py-2 cursor-pointer"
                >
                  <UserProfileHover
                    userId={like.userId}
                    schoolId={schoolId}
                    role={user?.role || ""}
                  >
                    <div className="flex gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userImage} alt={userName} />
                        <AvatarFallback>{userName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex justify-between items-center w-48 sm:w-96">
                        <span className="font-semibold">{userName}</span>
                        <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                      </div>
                    </div>
                  </UserProfileHover>
                </div>
              );
            })}
            {post.likes.length === 0 && (
              <div
                className={`text-center py-6 ${
                  theme === "light" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <Heart className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No likes yet!</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Media Dialog */}

      <Dialog open={mediaDialogOpen} onOpenChange={setMediaDialogOpen}>
        <DialogContent
          className={`w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto ${
            theme === "light" ? "bg-gray-800 text-white border-gray-700" : ""
          }`}
        >
          <DialogHeader>
            <DialogTitle>Post Attachment</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {post.media?.type === "image" && (
              <>
                <img
                  src={post.media.url}
                  alt="Post attachment"
                  className="max-h-[70vh] max-w-full object-contain"
                />
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-lg p-1.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 cursor-pointer"
                    onClick={() => window.open(post.media.url, "_blank")}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </>
            )}

            {post.media?.type === "video" && (
              <video
                src={post.media.url}
                controls
                className="max-h-[70vh] max-w-full"
              />
            )}

            {post.media?.type === "document" && (
              <div className="w-full">
                {getDocumentDisplay(post.media.url)}
                <div className="mt-2 text-right">
                  <Button onClick={() => window.open(post.media.url, "_blank")}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Document
                  </Button>
                </div>
              </div>
            )}

            {/* {post.media?.type === "document" && (
              <div className="w-full">
                <object
                  data={post.media.url}
                  type="application/pdf"
                  width="100%"
                  height="600px"
                  className="rounded-xl overflow-hidden shadow-lg"
                >
                  <p className="text-center p-4">
                    Your browser doesn’t support inline PDFs.{" "}
                    <a
                      href={post.media.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Download the document
                    </a>
                    .
                  </p>
                </object>
                <div className="mt-2 text-right">
                  <Button onClick={() => window.open(post.media.url, "_blank")}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Document
                  </Button>
                </div>
              </div>
            )} */}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent
          className={`w-[95vw] max-w-md ${
            theme === "light"
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <AlertDialogHeader>
            <AlertDialogTitle
              className={theme === "light" ? "text-white" : "text-gray-900"}
            >
              Delete Post
            </AlertDialogTitle>
            <AlertDialogDescription
              className={theme === "light" ? "text-gray-300" : "text-gray-500"}
            >
              Are you sure you want to delete this post? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className={
                theme === "light"
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PostCard;
