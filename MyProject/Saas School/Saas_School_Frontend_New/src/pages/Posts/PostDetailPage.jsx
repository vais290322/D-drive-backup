import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentPost,
  addComment,
  toggleLike,
} from "@/utils/posts/postsSlice";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import postsUrlApi, { userUrlApi } from "@/common/posts";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageCircle,
  Share2,
  ArrowLeft,
  Send,
  Download,
  FileText,
  Film,
  Users,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  fetchPostById,
  likePostAsync,
  unlikePostAsync,
  addCommentAsync,
} from "@/utils/posts/postsSlice";

const PostDetailPage = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentPost, posts, isLoading } = useSelector((state) => state.posts);
  const userId = useSelector((state) => state?.auth?.userDetails?.id);
  const userName = useSelector((state) => {
    const user = state?.auth?.user;
    if (user === "student") return state?.auth?.userDetails?.studentName;
    if (user === "teacher") return state?.auth?.userDetails?.teachersName;
    if (user === "edp") return state?.auth?.userDetails?.edpName;
    if (user === "librarian") return state?.auth?.userDetails?.librarianName;
    return "User";
  });
  const schoolId = useSelector((state) => state?.auth?.schoolId);

  const [commentText, setCommentText] = useState("");
  const [likesDialogOpen, setLikesDialogOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const { error } = useSelector((state) => state.posts);

  const [authorDetails, setAuthorDetails] = useState({});
  const [authorRole, setAuthorRole] = useState("");
  const [currentUserImage, setCurrentUserImage] = useState("");

  const [commentDetails, setCommentDetails] = useState({});
  const [likeDetails, setLikeDetails] = useState({});

// console.log("current post : ",currentPost)

  // Add this function to fetch user details
  const fetchUserDetails = async (userId, schoolId) => {
    if (!userId || !schoolId) return null;
    
    try {
      const res = await axios.get(
        `${userUrlApi}/${userId}/${schoolId}`
      );
      if (res.data && res.data.data && res.data.data.user) {
        return res.data.data.user;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user details", error);
      return null;
    }
  };

  // Add this useEffect to fetch comment details
  useEffect(() => {
    const fetchCommentsDetails = async () => {
      if (currentPost?.comments && currentPost.comments.length > 0 && schoolId) {
        const commentDetailsObj = {};
        
        for (const comment of currentPost.comments) {
          const userDetails = await fetchUserDetails(comment.userId, schoolId);
          if (userDetails) {
            commentDetailsObj[comment.id] = userDetails;
          }
        }
        
        setCommentDetails(commentDetailsObj);
      }
    };
    
    if (currentPost) {
      fetchCommentsDetails();
    }
  }, [currentPost, schoolId]);
  
  // Add this useEffect to fetch like details
  useEffect(() => {
    const fetchLikesDetails = async () => {
      if (currentPost?.likes && currentPost.likes.length > 0 && schoolId) {
        const likeDetailsObj = {};
        
        for (const like of currentPost.likes) {
          const userDetails = await fetchUserDetails(like.userId, schoolId);
          if (userDetails) {
            likeDetailsObj[like.userId] = userDetails;
          }
        }
        
        setLikeDetails(likeDetailsObj);
      }
    };
    
    if (currentPost) {
      fetchLikesDetails();
    }
  }, [currentPost, schoolId]);

  // Add this function to fetch current user image
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
            setAuthorDetails(user);
          }
        } catch (error) {
          console.error("Error fetching current user image", error);
        }
      }
    };

    fetchCurrentUserImage();
  }, [userId, schoolId]);

  // Define author name and image variables
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

  // Move useEffect hooks before the conditional returns
  useEffect(() => {
    if (postId) {
      dispatch(fetchPostById(postId));
      console.log("fetch is called ")
    }
  }, [postId, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error || "Failed to fetch post details");
      navigate("/posts");
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex justify-center items-center ${
          theme === "light"
            ? "bg-[#0c1425] text-white"
            : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Add a check for null currentPost
  if (!currentPost) {
    return (
      <div
        className={`min-h-screen flex justify-center items-center flex-col gap-4 ${
          theme === "light"
            ? "bg-[#0c1425] text-white"
            : "bg-gray-50 text-gray-900"
        }`}
      >
        <p>Post not found or still loading...</p>
        <Button
          variant="ghost"
          onClick={() => navigate("/posts")}
          className={`${
            theme === "light"
              ? "text-gray-300 hover:text-white hover:bg-gray-800"
              : ""
          }`}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Posts
        </Button>
      </div>
    );
  }

  const isLiked = currentPost?.likes?.some((like) => like.userId === userId);

  // Rest of the component remains the same
  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        dispatch(unlikePostAsync(currentPost?._id));
      } else {
        dispatch(likePostAsync(currentPost?._id));
      }
    } catch (error) {
      toast.error("Failed to update like status");
    }
  };




  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      dispatch(
        addCommentAsync({
          postId: currentPost?.id,
          content: commentText,
        })
      );

      setCommentText("");
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
      admin: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white",
      vais: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white",
      teacher: "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
      edp: "bg-gradient-to-r from-amber-500 to-orange-600 text-white",
      librarian: "bg-gradient-to-r from-purple-500 to-pink-600 text-white",
      student: "bg-gradient-to-r from-blue-500 to-cyan-600 text-white",
      default: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
    };
    return colors[role] || colors.default;
  };

  const getAudienceText = () => {
    if (currentPost?.audience?.type === "all") {
      return "Posted to everyone";
    } else if (currentPost?.audience?.type === "class") {
      return `Posted to Class ${currentPost?.audience?.classes?.join(", ")} ${
        currentPost?.audience.sections.length > 0
          ? `Section ${currentPost?.audience.sections.join(", ")}`
          : ""
      }`;
    } else if (currentPost?.audience.type === "student") {
      return "Posted to specific students";
    }
    return "";
  };

  return (
    <div
      className={`min-h-screen pb-16 ${
        theme === "light"
          ? "bg-[#0c1425] text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/posts")}
          className={`mb-4 sm:mb-6 ${
            theme === "light"
              ? "text-gray-300 hover:text-white hover:bg-gray-800"
              : ""
          }`}
        >
          <ArrowLeft className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-sm sm:text-base">Back to Posts</span>
        </Button>

        <div
          className={`rounded-lg sm:rounded-xl shadow-md overflow-hidden ${
            theme === "light"
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          {/* Post Header */}
          <div className="p-3 sm:p-4 lg:p-6 flex justify-between items-start">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 mr-3 sm:mr-4">
                <AvatarImage
                  src={authorImage || currentUserImage}
                  alt={authorName || currentPost?.author?.name}
                />
                <AvatarFallback
                  className={getRoleColor( authorRole || currentPost?.author?.role || 'default')}
                >
                  {/* {currentPost?.author?.name ? currentPost?.author?.name.charAt(0) : '?'} */}
                  {authorName ? authorName.charAt(0) : '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-base sm:text-lg truncate">
                  {authorName || currentPost?.author?.name}
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span
                    className={`text-xs sm:text-sm ${
                      theme === "light" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {formatDate(currentPost?.createdAt)}
                  </span>
                  <span
                    className={`mx-1 text-xs sm:text-sm hidden sm:inline ${
                      theme === "light" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    •
                  </span>
                  <span
                    className={`text-xs sm:text-sm truncate ${
                      theme === "light" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {getAudienceText()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4">
            <p
              className={`whitespace-pre-line text-sm sm:text-base lg:text-lg leading-relaxed ${
                theme === "light" ? "text-gray-200" : "text-gray-700"
              }`}
            >
              {currentPost?.content}
            </p>
          </div>

          {/* Post Media */}
          {currentPost?.media && (
            <div className="relative mx-3 sm:mx-0">
              {currentPost?.media?.type === "image" && (
                <img
                  src={currentPost?.media?.url}
                  alt="Post attachment"
                  className="w-full h-auto max-h-64 sm:max-h-96 lg:max-h-[500px] object-contain cursor-pointer"
                  onClick={() => setMediaDialogOpen(true)}
                  onError={(e) => {
                    console.error(
                      "Image failed to load:",
                      currentPost?.media?.url
                    );
                    e.target.src =
                      "https://via.placeholder.com/800x400?text=Image+Not+Available";
                    e.target.onerror = null; // Prevent infinite fallback loop
                  }}
                />
              )}

              {currentPost?.media?.type === "video" && (
                <div
                  className="w-full aspect-video bg-black flex items-center justify-center cursor-pointer"
                  onClick={() => setMediaDialogOpen(true)}
                >
                  <Film className="h-12 w-12 sm:h-16 sm:w-16 text-white opacity-80" />
                </div>
              )}

              {currentPost?.media?.type === "document" && (
                <div
                  className={`w-full p-4 sm:p-6 lg:p-8 flex items-center justify-center cursor-pointer ${
                    theme === "light" ? "bg-gray-700" : "bg-gray-100"
                  }`}
                  onClick={() => setMediaDialogOpen(true)}
                >
                  <div className="flex flex-col items-center">
                    <FileText
                      className={`h-12 w-12 sm:h-16 sm:w-16 ${
                        theme === "light" ? "text-gray-300" : "text-gray-600"
                      }`}
                    />
                    <span className="mt-2 text-xs sm:text-sm">View Document</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Post Stats */}
          <div
            className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 flex justify-between ${
              theme === "light" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <button
              className="text-xs sm:text-sm flex items-center"
              onClick={() =>
                currentPost?.likes?.length > 0 && setLikesDialogOpen(true)
              }
            >
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span>{currentPost?.likes?.length} likes</span>
            </button>

            <span className="text-xs sm:text-sm flex items-center">
              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span>{currentPost?.comments?.length} comments</span>
            </span>
          </div>

          <Separator className={theme === "light" ? "bg-gray-700" : ""} />

          {/* Post Actions */}
          <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 flex justify-around">
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 text-xs sm:text-sm ${
                isLiked
                  ? "text-red-500"
                  : theme === "light"
                  ? "text-gray-300 hover:text-gray-100"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={handleLikeToggle}
            >
              <Heart
                className={`mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 ${isLiked ? "fill-current" : ""}`}
              />
              <span className="hidden sm:inline">Like</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 text-xs sm:text-sm ${
                theme === "light"
                  ? "text-gray-300 hover:text-gray-100"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => document.getElementById("commentInput").focus()}
            >
              <MessageCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Comment</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 text-xs sm:text-sm ${
                theme === "light"
                  ? "text-gray-300 hover:text-gray-100"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Share2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>

          <Separator className={theme === "light" ? "bg-gray-700" : ""} />

          {/* Comments Section */}
          <div
            className={`p-3 sm:p-4 lg:p-6 ${
              theme === "light" ? "bg-gray-900" : "bg-gray-50"
            }`}
          >
            <h3 className="font-medium text-base sm:text-lg mb-3 sm:mb-4">Comments</h3>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2 mb-4 sm:mb-6">
              <Input
                id="commentInput"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className={`text-sm ${
                  theme === "light" ? "bg-gray-800 border-gray-700" : ""
                }`}
              />
              <Button type="submit" size="sm" variant="ghost">
                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </form>

            
            {/* Comments List */}
            <div className="space-y-3 sm:space-y-4">
              {currentPost?.comments?.length > 0 ? (
                currentPost?.comments?.map((comment) => {
                  // console.log("comment secion ",comment);
                  const userDetail = commentDetails[comment.author];
                  const userImage = userDetail ? (
                    userDetail?.studentImage ||
                    userDetail?.teachersImage ||
                    userDetail?.edpImage ||
                    userDetail?.librarianImage ||
                    userDetail?.schoolLogo
                  ) : null;
                  const userRole = userDetail?.role || 'default';
                  
                  return (
                    <div key={comment.id} className="flex gap-2 sm:gap-3">
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                        <AvatarImage src={userImage} alt={comment.userName} />
                        <AvatarFallback className={`${getRoleColor(userRole)} text-xs sm:text-sm`}>
                          {comment.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm flex-1 ${
                          theme === "light"
                            ? "bg-gray-800"
                            : "bg-white border border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <span className="font-medium truncate">{comment.userName}</span>
                            {userDetail?.role && (
                              <span
                                className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${getRoleColor(userRole)} hidden sm:inline-block`}
                              >
                                {userDetail.role}
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-xs flex-shrink-0 ml-2 ${
                              theme === "light"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <p
                    className={`text-sm ${
                      theme === "light" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              )}
            </div>

            </div>
          </div>
        </div>
      {/* Likes Dialog */}
      <Dialog open={likesDialogOpen} onOpenChange={setLikesDialogOpen}>
        <DialogContent
          className={`w-[95vw] max-w-md max-h-[70vh] overflow-y-auto ${
            theme === "light" ? "bg-gray-800 text-white border-gray-700" : ""
          }`}
        >
          <DialogHeader>
            <DialogTitle>People who liked this post</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {currentPost?.likes?.map((like) => {
              const userDetail = likeDetails[like.userId];
              const userImage = userDetail ? (
                userDetail?.studentImage ||
                userDetail?.teachersImage ||
                userDetail?.edpImage ||
                userDetail?.librarianImage ||
                userDetail?.schoolLogo
              ) : null;
              const userRole = userDetail?.role || 'default';
              
              return (
                <div key={like.userId} className="flex items-center py-2">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={userImage} alt={like.userName} />
                    <AvatarFallback className={getRoleColor(userRole)}>
                      {like.userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center">
                    <span>{like.userName}</span>
                    {userDetail?.role && (
                      <span 
                        className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getRoleColor(userRole)}`}
                      >
                        {userDetail.role}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
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
            {currentPost?.media?.type === "image" && (
              <img
                src={currentPost?.media.url}
                alt="Post attachment"
                className="max-h-[70vh] max-w-full object-contain"
                onError={(e) => {
                  console.error(
                    "Image failed to load in dialog:",
                    currentPost?.media.url
                  );
                  e.target.src =
                    "https://via.placeholder.com/800x600?text=Image+Not+Available";
                  e.target.onerror = null;
                }}
              />
            )}

            {currentPost?.media?.type === "video" && (
              <video
                src={currentPost?.media.url}
                controls
                className="max-h-[70vh] max-w-full"
              />
            )}

            {currentPost?.media?.type === "document" && (
              <div className="flex flex-col items-center">
                <FileText className="h-24 w-24 mb-4" />
                <p className="mb-4">Document Preview</p>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download Document
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostDetailPage;
