import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "@/utils/posts/postsSlice";
import axios from "axios";
import { toast } from "sonner";
import postsUrlApi from "@/common/posts";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Image,
  FileVideo,
  FileText,
  X,
  Upload,
  Loader2,
  Users,
  Mail,
  ChevronDown,
  User,
} from "lucide-react";
import { createPostAsync } from "@/utils/posts/postsSlice";

const CreatePostDialog = ({ open, onOpenChange }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const userId = useSelector(
    (state) => state?.auth?.userDetails?.id || "user1"
  );
  const postCreator = useSelector(
    (state) => state?.auth?.userDetails || "Admin"
  );

  const userRole = useSelector((state) => state?.auth?.user);
  // console.log("user Id : ", userRole);
  const userName = useSelector((state) => {
    // console.log("state", state);
    const user = state?.auth?.user;
    if (user === "student")
      return state?.auth?.userDetails?.studentName || "Student";
    if (user === "teacher")
      return state?.auth?.userDetails?.teachersName || "Teacher";
    if (user === "edp") return state?.auth?.userDetails?.edpName || "EDP";
    if (user === "librarian")
      return state?.auth?.userDetails?.librarianName || "Librarian";
    if (user === "admin")
      return state?.auth?.userDetails?.userName || "admin";
    return "User";
  });
  const userAvatar = useSelector((state) => {
    // console.log("state", state);
    const user = state?.auth?.user;
    if (user === "student")
      return state?.auth?.userDetails?.studentImage || "Student";
    if (user === "teacher")
      return state?.auth?.userDetails?.teachersImage || "Teacher";
    if (user === "edp") return state?.auth?.userDetails?.edpImage || "EDP";
    if (user === "librarian")
      return state?.auth?.userDetails?.librarianImage || "Librarian";
    if (user === "admin")
      return state?.institute?.institute?.schoolLogo || "admin";
    return "User";
  });

  const allClass = useSelector((state) => state.class.classNames) || [];
  const allSection = useSelector((state) => state.section.sectionNames) || [];

  const allTeachers = useSelector(
    (state) => state.teacherInfo?.teacherInfo || []
  );

  // console.log("allTeachers", allTeachers);

  const [content, setContent] = useState("");
  const [audienceType, setAudienceType] = useState("all");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherInputType, setTeacherInputType] = useState("dropdown"); // "dropdown" or "manual"
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [mediaType, setMediaType] = useState("image"); // Default to image
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMediaFile(file);

    // Create preview
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setMediaPreview(null);
    }
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
  };

  const handleClassChange = (value) => {
    if (selectedClasses.includes(value)) {
      setSelectedClasses(selectedClasses.filter((c) => c !== value));
    } else {
      setSelectedClasses([...selectedClasses, value]);
    }
  };

  const handleSectionChange = (value) => {
    if (selectedSections.includes(value)) {
      setSelectedSections(selectedSections.filter((s) => s !== value));
    } else {
      setSelectedSections([...selectedSections, value]);
    }
  };

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
    setTeacherEmail(teacher.email);
  };

  // Update the handleSubmit function
  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Please enter some content for your post");
      return;
    }

    if (audienceType === "class" && selectedClasses.length === 0) {
      toast.error("Please select at least one class");
      return;
    }

    if (audienceType === "student" && !admissionNumber.trim()) {
      toast.error("Please enter a student admission number");
      return;
    }

    if (audienceType === "specificTeacher" && !teacherEmail.trim()) {
      toast.error("Please select a teacher or enter a teacher email");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare media data
      let mediaData = null;
      if (mediaFile) {
        // In a real implementation, you would upload the file to a server
        // and get back a URL. For now, we'll use a placeholder URL.
        let mediaUrl = "";
        if (mediaType === "image") {
          mediaUrl = mediaPreview || "https://via.placeholder.com/800x600";
        } else if (mediaType === "video") {
          mediaUrl = "https://example.com/video.mp4";
        } else if (mediaType === "document") {
          mediaUrl = "https://example.com/document.pdf";
        }

        mediaData = {
          type: mediaType,
          url: mediaUrl,
          fileName: mediaFile.name,
        };
      }

      // Create form data for API request
      const formData = new FormData();
      formData.append("content", content);
      formData.append("audienceType", audienceType);
      formData.append("userId", userId);
      // formData.append('userId', postCreator );
      formData.append("schoolId", schoolId || "default-school-id");

      // Add audience details if needed
      if (audienceType === "class" && selectedClasses.length > 0) {
        formData.append("classes", JSON.stringify(selectedClasses));
      }

      if (audienceType === "class" && selectedSections.length > 0) {
        formData.append("sections", JSON.stringify(selectedSections));
      }

      if (audienceType === "student" && admissionNumber) {
        formData.append("students", JSON.stringify([admissionNumber]));
      }

      if (audienceType === "specificTeacher" && teacherEmail) {
        formData.append("teachers", JSON.stringify([teacherEmail]));
      }

      // Add media file if present
      if (mediaFile) {
        formData.append("media", mediaFile);
        formData.append("mediaType", mediaType);
      }

      // Send the API request
      const response = await axios.post(`${postsUrlApi}/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        // Add the new post to Redux store
        // dispatch(addPost(response.data.data));
        dispatch({ type: "posts/addPost", payload: response.data.data });
        toast.success("Post created successfully");
        onOpenChange(false);

        // Reset form
        setContent("");
        setAudienceType("all");
        setSelectedClasses([]);
        setSelectedSections([]);
        setAdmissionNumber("");
        setTeacherEmail("");
        setMediaType(null);
        setMediaFile(null);
        setMediaPreview(null);
      } else {
        toast.error(response.data.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Media Upload section with custom tabs implementation
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto ${
          theme === "light" ? "bg-gray-800 text-white border-gray-700" : ""
        }`}
      >
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 mt-2">
          {/* Author Info */}
          <div className="flex items-center">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{userName}</h3>
              <Select value={audienceType} onValueChange={setAudienceType}>
              <SelectTrigger
                className={`h-6 sm:h-7 text-xs w-[120px] sm:w-[140px] ${
                  theme === "light" ? "bg-gray-700 border-gray-600" : ""
                }`}
              >
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent
                  className={
                    theme === "light" ? "bg-gray-700 border-gray-600" : ""
                  }
                >
                  {/* First three options removed as requested */}
                  {(userRole === "admin" || userRole === "edp") && (
                    <>
                      <SelectItem value="all">Everyone</SelectItem>
                      <SelectItem value="class">Specific Class</SelectItem>
                      <SelectItem value="student">Specific Student</SelectItem>
                      <SelectItem value="allTeachers">All Teachers</SelectItem>
                      <SelectItem value="specificTeacher">
                        Specific Teacher
                      </SelectItem>
                    </>
                  )}
                  {(userRole === "teacher" || userRole === "librarian") && (
                    <>
                      <SelectItem value="all">Everyone</SelectItem>
                      <SelectItem value="class">Specific Class</SelectItem>
                      <SelectItem value="student">Specific Student</SelectItem>
                    </>
                  )}
                  {/* For students, only show these two options */}
                  {userRole === "student" && (
                    <>
                      <SelectItem value="specificTeacher">
                        Specific Teacher
                      </SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Audience Selection */}
          {audienceType === "class" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="class" className="text-sm">Select Classes</Label>
                <div className="mt-1 space-y-1 sm:space-y-2 max-h-28 sm:max-h-32 overflow-y-auto p-2 border rounded-md">
                  {allClass.map((className, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`class-${className}`}
                        checked={selectedClasses.includes(className)}
                        onChange={() => handleClassChange(className)}
                        className="mr-2"
                      />
                      <label htmlFor={`class-${className}`}>{className}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="section" className="text-sm">Select Sections</Label>
                <div className="mt-1 space-y-1 sm:space-y-2 max-h-28 sm:max-h-32 overflow-y-auto p-2 border rounded-md">
                  {allSection.map((section, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`section-${section}`}
                        checked={selectedSections.includes(section)}
                        onChange={() => handleSectionChange(section)}
                        className="mr-2"
                      />
                      <label htmlFor={`section-${section}`}>{section}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {audienceType === "student" && (
            <div>
              <Label htmlFor="admissionNumber" className="text-sm">Student Admission Number</Label>
              <Input
                id="admissionNumber"
                value={admissionNumber}
                onChange={(e) => setAdmissionNumber(e.target.value)}
                placeholder="Enter admission number"
                className={`text-sm ${
                  theme === "light" ? "bg-gray-700 border-gray-600" : ""
                }`}
              />
            </div>
          )}

          {/* Teacher Email Input - For admin and student */}
          {(userRole === "admin" || userRole === "student") &&
            audienceType === "specificTeacher" && (
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <Label htmlFor="teacherInputType" className="text-sm">Select teacher by:</Label>
                  <div className="flex rounded-md overflow-hidden border">
                    <button
                      type="button"
                      onClick={() => setTeacherInputType("dropdown")}
                      className={`px-2 sm:px-3 py-1 text-xs sm:text-sm ${
                        teacherInputType === "dropdown"
                          ? "bg-indigo-600 text-white"
                          : theme === "light"
                          ? "bg-gray-700"
                          : "bg-gray-100"
                      }`}
                    >
                      List
                    </button>
                    <button
                      type="button"
                      onClick={() => setTeacherInputType("manual")}
                      className={`px-2 sm:px-3 py-1 text-xs sm:text-sm ${
                        teacherInputType === "manual"
                          ? "bg-indigo-600 text-white"
                          : theme === "light"
                          ? "bg-gray-700"
                          : "bg-gray-100"
                      }`}
                    >
                      Manual
                    </button>
                  </div>
                </div>

                {teacherInputType === "dropdown" ? (
                  <div>
                    <Label htmlFor="teacherSelect" className="text-sm">Select Teacher</Label>
                    <div
                      className={`relative mt-1 ${
                        theme === "light" ? "text-white" : ""
                      }`}
                    >
                      <div
                        className={`flex items-center justify-between p-2 border rounded-md cursor-pointer ${
                          theme === "light" ? "bg-gray-700 border-gray-600" : ""
                        }`}
                        onClick={() =>
                          document
                            .getElementById("teacherDropdown")
                            .classList.toggle("hidden")
                        }
                      >
                        <div className="flex items-center">
                          {selectedTeacher ? (
                            <>
                              <User className="h-4 w-4 mr-2" />
                              <span>
                                {selectedTeacher.name} ({selectedTeacher.email})
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-400">
                              Select a teacher
                            </span>
                          )}
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </div>

                      <div
                        id="teacherDropdown"
                        className={`absolute z-10 w-full mt-1 max-h-48 sm:max-h-60 overflow-auto rounded-md shadow-lg hidden ${
                          theme === "light"
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border border-gray-200"
                        }`}
                      >
                        {allTeachers.length > 0 ? (
                          allTeachers.map((teacher) => (
                            <div
                              key={teacher.id || teacher.email}
                              className={`p-2 cursor-pointer flex items-center ${
                                theme === "light"
                                  ? "hover:bg-gray-600"
                                  : "hover:bg-gray-100"
                              }`}
                              onClick={() => {
                                handleTeacherSelect(teacher);
                                document
                                  .getElementById("teacherDropdown")
                                  .classList.add("hidden");
                              }}
                            >
                              <User className="h-4 w-4 mr-2" />
                              <div>
                                <div>{teacher.name}</div>
                                <div
                                  className={`text-xs ${
                                    theme === "light"
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {teacher.email}  ({teacher.teachersName})
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-2 text-center text-gray-500">
                            No teachers available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="teacherEmail" className="text-sm">Teacher Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <Input
                        id="teacherEmail"
                        value={teacherEmail}
                        onChange={(e) => setTeacherEmail(e.target.value)}
                        placeholder="Enter teacher email"
                        type="email"
                        className={
                          theme === "light" ? "bg-gray-700 border-gray-600" : ""
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* All Teachers Info - Only for admin */}
          {userRole === "admin" && audienceType === "allTeachers" && (
            <div
              className={`p-3 rounded-md flex items-center ${
                theme === "light" ? "bg-gray-700" : "bg-blue-50"
              }`}
            >
              <Users
                className={`h-5 w-5 mr-2 ${
                  theme === "light" ? "text-blue-300" : "text-blue-500"
                }`}
              />
              <p
                className={`text-sm ${
                  theme === "light" ? "text-gray-300" : "text-blue-700"
                }`}
              >
                This post will be visible to all teachers in the school.
              </p>
            </div>
          )}

          {/* Admin audience info - Only for students */}
          {userRole === "student" && audienceType === "admin" && (
            <div
              className={`p-3 rounded-md flex items-center ${
                theme === "light" ? "bg-gray-700" : "bg-blue-50"
              }`}
            >
              <Users
                className={`h-5 w-5 mr-2 ${
                  theme === "light" ? "text-blue-300" : "text-blue-500"
                }`}
              />
              <p
                className={`text-sm ${
                  theme === "light" ? "text-gray-300" : "text-blue-700"
                }`}
              >
                This post will be visible to all admin users in the school.
              </p>
            </div>
          )}

          {/* Post Content */}
          <div>
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className={`w-full rounded-md border p-2 sm:p-3 text-sm sm:text-base resize-none ${
                theme === "light"
                  ? "bg-gray-700 border-gray-600"
                  : "border-gray-300"
              }`}
            />
          </div>
        </div>

        {/* Custom Media Upload Tabs */}
        {!mediaFile && (
          <div>
            {/* Custom Tabs List */}
            <div className="flex border-b overflow-x-auto">
              <button
                onClick={() => setMediaType("image")}
                className={`px-3 sm:px-4 py-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  mediaType === "image"
                    ? theme === "light"
                      ? "border-b-2 border-white text-white"
                      : "border-b-2 border-indigo-500 text-indigo-600"
                    : theme === "light"
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Image
              </button>
              <button
                onClick={() => setMediaType("video")}
                className={`px-3 sm:px-4 py-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  mediaType === "video"
                    ? theme === "light"
                      ? "border-b-2 border-white text-white"
                      : "border-b-2 border-indigo-500 text-indigo-600"
                    : theme === "light"
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Video
              </button>
              <button
                onClick={() => setMediaType("document")}
                className={`px-3 sm:px-4 py-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  mediaType === "document"
                    ? theme === "light"
                      ? "border-b-2 border-white text-white"
                      : "border-b-2 border-indigo-500 text-indigo-600"
                    : theme === "light"
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Document
              </button>
            </div>

            {/* Custom Tabs Content */}
            <div className="mt-3 sm:mt-4">
              {/* Image Tab Content */}
              {mediaType === "image" && (
                <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-4 sm:p-6">
                  <label className="flex flex-col items-center cursor-pointer">
                    <Image className="h-6 w-6 sm:h-8 sm:w-8 mb-2" />
                    <span className="text-xs sm:text-sm">Upload Image</span>
                    <span className="text-xs text-gray-500 mt-1">Max size: 10 MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleMediaChange}
                    />
                  </label>
                </div>
              )}

              {/* Video Tab Content */}
              {mediaType === "video" && (
                <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-4 sm:p-6">
                  <label className="flex flex-col items-center cursor-pointer">
                    <FileVideo className="h-6 w-6 sm:h-8 sm:w-8 mb-2" />
                    <span className="text-xs sm:text-sm">Upload Video</span>
                    <span className="text-xs text-gray-500 mt-1">Max size: 60 MB</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleMediaChange}
                    />
                  </label>
                </div>
              )}

              {/* Document Tab Content */}
              {mediaType === "document" && (
                <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-4 sm:p-6">
                  <label className="flex flex-col items-center cursor-pointer">
                    <FileText className="h-6 w-6 sm:h-8 sm:w-8 mb-2" />
                    <span className="text-xs sm:text-sm">Upload Document</span>
                    <span className="text-xs text-gray-500 mt-1">Max size: 50 MB</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      className="hidden"
                      onChange={handleMediaChange}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Media Preview */}
        {mediaFile && (
          <div className="relative border rounded-lg overflow-hidden">
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 sm:top-2 sm:right-2 h-6 w-6 sm:h-8 sm:w-8 rounded-full z-10"
              onClick={handleRemoveMedia}
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            {mediaType === "image" && mediaPreview && (
              <img
                src={mediaPreview}
                alt="Preview"
                className="max-h-48 sm:max-h-64 w-full object-contain"
              />
            )}

            {(mediaType === "video" || mediaType === "document") && (
              <div className="flex items-center justify-center p-4 sm:p-6 bg-gray-100">
                {mediaType === "video" ? (
                  <FileVideo className="h-8 w-8 sm:h-12 sm:w-12 text-gray-500" />
                ) : (
                  <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-gray-500" />
                )}
                <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-700 truncate">{mediaFile.name}</span>
              </div>
            )}
          </div>
        )}

        {/* Dialog Footer with Submit Button */}
        <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-0 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className={`w-full sm:w-auto ${
              theme === "light" ? "bg-gray-700 hover:bg-gray-600 sm:mr-2" : "sm:mr-2"
            }`}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                <span className="text-sm sm:text-base">Posting...</span>
              </>
            ) : (
              <>
                <Upload className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-sm sm:text-base">Post</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
