// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Rocket, Timer, Star, Sparkles, Zap, Heart, Smile } from 'lucide-react';

// const PostsFeedPage = () => {
//   const [theme] = useState('dark'); // Assuming dark theme for dramatic effect
//   const [particles, setParticles] = useState([]);
//   const [countdown, setCountdown] = useState(30);
  
//   const isDarkTheme = theme === 'dark';

//   // Generate floating particles
//   useEffect(() => {
//     const newParticles = Array.from({ length: 20 }, (_, i) => ({
//       id: i,
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       delay: Math.random() * 2,
//       duration: 3 + Math.random() * 2,
//     }));
//     setParticles(newParticles);
//   }, []);

//   // Countdown timer effect
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCountdown(prev => prev > 0 ? prev - 1 : 30);
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         delayChildren: 0.3,
//         staggerChildren: 0.2
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         damping: 12,
//         stiffness: 200
//       }
//     }
//   };

//   const floatingVariants = {
//     animate: {
//       y: [-20, 20, -20],
//       rotate: [0, 5, -5, 0],
//       transition: {
//         duration: 4,
//         repeat: Infinity,
//         ease: "easeInOut"
//       }
//     }
//   };

//   const glowVariants = {
//     animate: {
//       boxShadow: [
//         "0 0 20px rgba(99, 102, 241, 0.3)",
//         "0 0 60px rgba(99, 102, 241, 0.6)",
//         "0 0 20px rgba(99, 102, 241, 0.3)"
//       ],
//       transition: {
//         duration: 2,
//         repeat: Infinity,
//         ease: "easeInOut"
//       }
//     }
//   };

//   return (
//     <div className={`min-h-screen relative overflow-hidden ${
//       isDarkTheme ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
//     }`}>
      
//       {/* Animated Background Grid */}
//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute inset-0" style={{
//           backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
//           backgroundSize: '40px 40px'
//         }} />
//       </div>

//       {/* Floating Particles */}
//       {particles.map(particle => (
//         <motion.div
//           key={particle.id}
//           className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
//           style={{
//             left: `${particle.x}%`,
//             top: `${particle.y}%`,
//           }}
//           animate={{
//             y: [-20, -100, -20],
//             opacity: [0, 1, 0],
//             scale: [0, 1, 0]
//           }}
//           transition={{
//             duration: particle.duration,
//             repeat: Infinity,
//             delay: particle.delay,
//             ease: "easeInOut"
//           }}
//         />
//       ))}

//       {/* Main Content */}
//       <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="text-center max-w-4xl"
//         >
          
//           {/* Floating Rocket with Glow Effect */}
//           <motion.div
//             variants={floatingVariants}
//             animate="animate"
//             className="mb-12 relative"
//           >
//             <motion.div
//               variants={glowVariants}
//               animate="animate"
//               className="inline-block p-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
//             >
//               <Rocket className="w-24 h-24 text-white" />
//             </motion.div>
            
//             {/* Orbiting Elements */}
//             <motion.div
//               animate={{ rotate: 360 }}
//               transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
//               className="absolute inset-0 w-32 h-32 mx-auto"
//             >
//               <Star className="absolute -top-2 left-1/2 w-6 h-6 text-yellow-400 transform -translate-x-1/2" />
//               <Sparkles className="absolute top-1/2 -right-2 w-6 h-6 text-pink-400 transform -translate-y-1/2" />
//               <Zap className="absolute -bottom-2 left-1/2 w-6 h-6 text-green-400 transform -translate-x-1/2" />
//               <Heart className="absolute top-1/2 -left-2 w-6 h-6 text-red-400 transform -translate-y-1/2" />
//             </motion.div>
//           </motion.div>

//           {/* Animated Title */}
//           <motion.div variants={itemVariants} className="mb-8">
//             <motion.h1
//               className={`text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent`}
//               animate={{
//                 backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
//               }}
//               transition={{
//                 duration: 3,
//                 repeat: Infinity,
//                 ease: "linear"
//               }}
//               style={{
//                 backgroundSize: "200% 200%"
//               }}
//             >
//               Coming Soon!
//             </motion.h1>
            
//             {/* Typing Animation Effect */}
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{ width: "100%" }}
//               transition={{ duration: 2, delay: 1 }}
//               className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto max-w-md rounded-full"
//             />
//           </motion.div>

//           {/* Subtitle with Typewriter Effect */}
//           <motion.p
//             variants={itemVariants}
//             className={`text-xl md:text-2xl mb-12 ${
//               isDarkTheme ? 'text-gray-300' : 'text-gray-600'
//             }`}
//           >
//             🚀 Preparing something{' '}
//             <motion.span
//               animate={{ color: ['#60a5fa', '#a855f7', '#ec4899', '#60a5fa'] }}
//               transition={{ duration: 2, repeat: Infinity }}
//               className="font-bold"
//             >
//               extraordinary
//             </motion.span>{' '}
//             for you
//           </motion.p>

//           {/* Countdown Timer */}
//           {/* <motion.div
//             variants={itemVariants}
//             className="mb-12"
//           >
//             <motion.div
//               animate={{ scale: [1, 1.05, 1] }}
//               transition={{ duration: 1, repeat: Infinity }}
//               className={`inline-block px-8 py-4 rounded-2xl backdrop-blur-sm ${
//                 isDarkTheme 
//                   ? 'bg-white/10 border border-white/20' 
//                   : 'bg-white/50 border border-white/30'
//               }`}
//             >
//               <div className="flex items-center gap-3">
//                 <Timer className="w-6 h-6 text-blue-400" />
//                 <span className={`text-2xl font-mono font-bold ${
//                   isDarkTheme ? 'text-white' : 'text-gray-800'
//                 }`}>
//                   00:{countdown.toString().padStart(2, '0')}
//                 </span>
//               </div>
//             </motion.div>
//           </motion.div> */}

//           {/* Feature Cards */}
//           <motion.div
//             variants={itemVariants}
//             className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
//           >
//             {[
//               { icon: Sparkles, title: "Magical Features", desc: "Experience the future" },
//               { icon: Zap, title: "Lightning Fast", desc: "Built for speed" },
//               { icon: Smile, title: "User Delight", desc: "Crafted with love" }
//             ].map((feature, index) => (
//               <motion.div
//                 key={index}
//                 whileHover={{ 
//                   scale: 1.05,
//                   rotateY: 5,
//                   boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
//                 }}
//                 whileTap={{ scale: 0.95 }}
//                 className={`p-6 rounded-2xl backdrop-blur-sm cursor-pointer ${
//                   isDarkTheme 
//                     ? 'bg-white/10 border border-white/20 hover:bg-white/20' 
//                     : 'bg-white/50 border border-white/30 hover:bg-white/70'
//                 } transition-all duration-300`}
//               >
//                 <motion.div
//                   animate={{ rotate: [0, 10, -10, 0] }}
//                   transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
//                 >
//                   <feature.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
//                 </motion.div>
//                 <h3 className={`font-bold mb-2 ${
//                   isDarkTheme ? 'text-white' : 'text-gray-800'
//                 }`}>
//                   {feature.title}
//                 </h3>
//                 <p className={`text-sm ${
//                   isDarkTheme ? 'text-gray-300' : 'text-gray-600'
//                 }`}>
//                   {feature.desc}
//                 </p>
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* Interactive Progress Visualization */}
//           <motion.div
//             variants={itemVariants}
//             className="space-y-8"
//           >
//             {/* Progress Ring */}
//             <motion.div className="relative mx-auto w-48 h-48">
//               <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
//                 <circle
//                   cx="50"
//                   cy="50"
//                   r="45"
//                   fill="none"
//                   stroke={isDarkTheme ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
//                   strokeWidth="2"
//                 />
//                 <motion.circle
//                   cx="50"
//                   cy="50"
//                   r="45"
//                   fill="none"
//                   stroke="url(#gradient)"
//                   strokeWidth="3"
//                   strokeLinecap="round"
//                   strokeDasharray="283"
//                   animate={{
//                     strokeDashoffset: [283, 283 - (283 * 0.75), 283 - (283 * 0.85), 283 - (283 * 0.75)]
//                   }}
//                   transition={{
//                     duration: 4,
//                     repeat: Infinity,
//                     ease: "easeInOut"
//                   }}
//                 />
//                 <defs>
//                   <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                     <stop offset="0%" stopColor="#3b82f6" />
//                     <stop offset="50%" stopColor="#8b5cf6" />
//                     <stop offset="100%" stopColor="#ec4899" />
//                   </linearGradient>
//                 </defs>
//               </svg>
              
//               {/* Center Content */}
//               <div className="absolute inset-0 flex flex-col items-center justify-center">
//                 <motion.div
//                   animate={{ scale: [1, 1.1, 1] }}
//                   transition={{ duration: 2, repeat: Infinity }}
//                   className="text-center"
//                 >
//                   <div className={`text-3xl font-bold ${
//                     isDarkTheme ? 'text-white' : 'text-gray-800'
//                   }`}>
//                   90%
//                   </div>
//                   <div className={`text-sm ${
//                     isDarkTheme ? 'text-gray-400' : 'text-gray-600'
//                   }`}>
//                     Complete
//                   </div>
//                 </motion.div>
//               </div>
//             </motion.div>

//             {/* Launch Status */}
//             <motion.div
//               className={`max-w-md mx-auto p-6 rounded-2xl backdrop-blur-sm ${
//                 isDarkTheme 
//                   ? 'bg-white/10 border border-white/20' 
//                   : 'bg-white/50 border border-white/30'
//               }`}
//             >
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <span className={`text-sm font-medium ${
//                     isDarkTheme ? 'text-gray-300' : 'text-gray-600'
//                   }`}>
//                     Development
//                   </span>
//                   <motion.div
//                     animate={{ scale: [1, 1.2, 1] }}
//                     transition={{ duration: 1.5, repeat: Infinity }}
//                     className="w-3 h-3 bg-green-400 rounded-full"
//                   />
//                 </div>
                
//                 <div className="flex items-center justify-between">
//                   <span className={`text-sm font-medium ${
//                     isDarkTheme ? 'text-gray-300' : 'text-gray-600'
//                   }`}>
//                     Testing
//                   </span>
//                   <motion.div
//                     animate={{ opacity: [0.3, 1, 0.3] }}
//                     transition={{ duration: 2, repeat: Infinity }}
//                     className="w-3 h-3 bg-yellow-400 rounded-full"
//                   />
//                 </div>
                
//                 <div className="flex items-center justify-between">
//                   <span className={`text-sm font-medium ${
//                     isDarkTheme ? 'text-gray-300' : 'text-gray-600'
//                   }`}>
//                     Final Polish
//                   </span>
//                   <div className="w-3 h-3 bg-gray-400 rounded-full opacity-30" />
//                 </div>
//               </div>
//             </motion.div>

//             {/* Floating Action Buttons */}
//             <motion.div 
//               className="flex justify-center gap-4"
//               variants={itemVariants}
//             >
//               <motion.button
//                 whileHover={{ 
//                   scale: 1.1,
//                   rotate: 5,
//                   boxShadow: "0 10px 20px rgba(59, 130, 246, 0.3)"
//                 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg"
//                 title="Follow Progress"
//               >
//                 <Star className="w-6 h-6" />
//               </motion.button>
              
//               <motion.button
//                 whileHover={{ 
//                   scale: 1.1,
//                   rotate: -5,
//                   boxShadow: "0 10px 20px rgba(139, 92, 246, 0.3)"
//                 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full shadow-lg"
//                 title="Share Excitement"
//               >
//                 <Heart className="w-6 h-6" />
//               </motion.button>
              
//               <motion.button
//                 whileHover={{ 
//                   scale: 1.1,
//                   rotate: 5,
//                   boxShadow: "0 10px 20px rgba(236, 72, 153, 0.3)"
//                 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="p-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full shadow-lg"
//                 title="Join Community"
//               >
//                 <Sparkles className="w-6 h-6" />
//               </motion.button>
//             </motion.div>

//             {/* Status Message */}
//             <motion.p
//               animate={{
//                 opacity: [0.7, 1, 0.7],
//                 y: [0, -5, 0]
//               }}
//               transition={{
//                 duration: 3,
//                 repeat: Infinity,
//                 ease: "easeInOut"
//               }}
//               className={`text-center mt-[-8rem] text-sm ${
//                 isDarkTheme ? 'text-gray-400' : 'text-gray-500  '
//               }`}
//             >
//               🔥 Almost ready to blow your mind
//             </motion.p>
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* Animated Corner Decorations */}
//       <motion.div
//         animate={{
//           rotate: 360,
//           scale: [1, 1.2, 1]
//         }}
//         transition={{
//           rotate: { duration: 20, repeat: Infinity, ease: "linear" },
//           scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
//         }}
//         className="absolute top-10 left-10"
//       >
//         <Star className="w-12 h-12 text-yellow-400/30" />
//       </motion.div>
      
//       <motion.div
//         animate={{
//           rotate: -360,
//           scale: [1, 1.3, 1]
//         }}
//         transition={{
//           rotate: { duration: 15, repeat: Infinity, ease: "linear" },
//           scale: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }
//         }}
//         className="absolute top-20 right-20"
//       >
//         <Sparkles className="w-10 h-10 text-pink-400/30" />
//       </motion.div>
      
//       <motion.div
//         animate={{
//           rotate: 360,
//           scale: [1, 1.1, 1]
//         }}
//         transition={{
//           rotate: { duration: 25, repeat: Infinity, ease: "linear" },
//           scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
//         }}
//         className="absolute bottom-10 left-20"
//       >
//         <Zap className="w-8 h-8 text-green-400/30" />
//       </motion.div>
      
//       <motion.div
//         animate={{
//           rotate: -360,
//           scale: [1, 1.4, 1]
//         }}
//         transition={{
//           rotate: { duration: 18, repeat: Infinity, ease: "linear" },
//           scale: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
//         }}
//         className="absolute bottom-20 right-10 " 
//       >
//         <Heart className="w-10 h-10 text-red-400/30" />
//       </motion.div>
//     </div>
//   );
// };

// export default PostsFeedPage;

// real page for post feed 

import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  fetchMyPosts,
  fetchSavedPosts,
  fetchSavedPostIds,
  fetchAllSchoolPosts,
} from "@/utils/posts/postsSlice";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Filter,
  RefreshCw,
  Loader2,
  Clock,
  Sparkles,
  Users,
  UserCircle,
  School,
  BookMarkedIcon,
} from "lucide-react";
import PostCard from "@/components/Posts/PostCard";
import CreatePostDialog from "@/components/Posts/CreatePostDialog";
import PostFilterDialog from "@/components/Posts/PostFilterDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PiMagnifyingGlassPlusDuotone } from "react-icons/pi";

const PostsFeedPage = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { posts, isLoading, error } = useSelector((state) => state.posts);
  const schoolId = useSelector((state) => state.institute.institute);
  const userRole = useSelector((state) => state?.auth?.user);
  const userId = useSelector(
    (state) =>
      state?.auth?.userDetails?.admissionNumber ||
      state?.auth?.userDetails?.email
  );
  const userDetails = useSelector((state) => state?.auth?.userDetails);
  // console.log("userDetails:", userDetails);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("everyone");
  const [filters, setFilters] = useState({
    audience: "all",
    class: "",
    section: "",
    student: "",
    teacher: "",
    teacherEmail: "",
  });

  // Fetch posts from API
  const fetchPostsData = async (tabFilters = {}) => {
    const updatedFilters = {
      ...filters,
      ...tabFilters,
      // schoolId: schoolId.id
      schoolId: userDetails?.schoolId || userDetails.id,
    };
    try {
      // console.log("Sending filters to API:", updatedFilters); // Add logging to debug
      dispatch(fetchPosts(updatedFilters));
    } catch (error) {
      // console.error("Error fetching posts:", error);
      toast.error(error.message || "Failed to fetch posts");
    }
  };

  const fetchMyPostsData = async () => {
    const myPostsFilters = {
      userId: userDetails.id,
      schoolId: userDetails?.schoolId || userDetails.id,
    };

    try {
      dispatch(fetchMyPosts(myPostsFilters));
    } catch (error) {
      toast.error(error.message || "Failed to fetch your posts");
    }
  };

  // Add function to fetch saved posts
  const fetchSavedPostsData = async () => {
    const savedPostsFilters = {
      userId: userDetails.id,
      schoolId: userDetails?.schoolId || userDetails.id,
    };

    try {
      dispatch(fetchSavedPosts(savedPostsFilters));
    } catch (error) {
      toast.error(error.message || "Failed to fetch saved posts");
    }
  };

  // Fetch saved post IDs when component mounts
  useEffect(() => {
    if (userId) {
      dispatch(fetchSavedPostIds(userId));
    }
  }, [dispatch, userId]);

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value);
    let tabFilters = {};

    // Reset all filters first
    setFilters({
      audience: "all",
      class: "",
      section: "",
      student: "",
      teacher: "",
      teacherEmail: "",
    });

    switch (value) {
      case "everyone":
        tabFilters = { audience: "all" };
        break;
      case "class":
        // For class tab, filter by the student's class and section
        tabFilters = {
          audience: "class",
          class: userDetails?.className || "", // Get user's class
          section: userDetails?.section || "", // Get user's section
        };
        break;
      case "teachers":
        tabFilters = { audience: "allTeachers" };
        break;
      case "personal":
        // Check if user is a student or teacher and use appropriate filter
        if (userRole === "student") {
          tabFilters = {
            audience: "student", // Set the correct audience type
            student: userId, // Use student admission number
            class: "", // Clear class
            section: "", // Clear section
          };
        } else if (
          userRole === "teacher" ||
          userRole === "edp" ||
          userRole === "librarian"
        ) {
          tabFilters = {
            audience: "specificTeacher", // Set the correct audience type
            teacher: userId, // Use teacher email
            class: "", // Clear class
            section: "", // Clear section
          };
        } else if (userRole === "admin") {
          // For admin users, filter posts where audience.type is 'admin'
          tabFilters = {
            audience: "admin",
            schoolId: userDetails?.schoolId || userDetails.id,
          };
        }
        break;
      case "myPosts":
        // For my posts tab, we'll use a different action
        fetchMyPostsData();
        return;
      case "savedPosts":
        fetchSavedPostsData();
        return;
      case "allSchoolPosts": // Add this case
        fetchAllSchoolPostsData();
        return;
      default:
        tabFilters = { audience: "all" };
    }

    // Only update filters with the tab-specific ones
    fetchPostsData(tabFilters);
  };

  // Apply filters from dialog
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    fetchPostsData(newFilters);
  };

  useEffect(() => {
    fetchPostsData();
  }, [dispatch]);

  // Add a function to fetch all school posts
  const fetchAllSchoolPostsData = async () => {
    const schoolId = userDetails?.schoolId || userDetails.id;

    try {
      dispatch(fetchAllSchoolPosts(schoolId));
    } catch (error) {
      toast.error(error.message || "Failed to fetch school posts");
    }
  };

  // Show error if any
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div
      className={`min-h-screen pb-16 ${
        theme === "light"
          ? "bg-[#0c1425] text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">School Social Feed</h1>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setFilterDialogOpen(true)}
              className={
                theme === "light"
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : ""
              }
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>

            <Button
              variant="outline"
              onClick={() => fetchPostsData(filters)}
              className={
                theme === "light"
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : ""
              }
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>

            <Button
              onClick={() => setCreatePostOpen(true)}
              className={
                theme === "light" ? "bg-indigo-600 hover:bg-indigo-700" : ""
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </div>
        </div>

        {/* {userRole !== "admin" ? ( */}
        <Tabs
          defaultValue="everyone"
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList
            className={`w-full justify-start mb-4 ${
              theme === "light" ? "bg-gray-700" : "bg-slate-200"
            }`}
          >
            <TabsTrigger
              value="everyone"
              className={
                theme === "light"
                  ? "data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                  : "data-[state=active]:bg-green-600 data-[state=active]:text-white"
              }
            >
              <Users className="h-4 w-4 mr-2" />
              Everyone
            </TabsTrigger>
            {userRole === "student" && (
              <TabsTrigger
                value="class"
                className={`text-xs sm:text-sm whitespace-nowrap ${
                  theme === "light"
                    ? "data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                    : "data-[state=active]:bg-green-600 data-[state=active]:text-white"
                }`}
              >
                <School className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Class & Sections</span>
                <span className="sm:hidden">Class</span>
              </TabsTrigger>
            )}
            {(userRole === "teacher" || userRole === "librarian") && (
              <TabsTrigger
                value="teachers"
                className={`text-xs sm:text-sm whitespace-nowrap ${
                  theme === "light"
                    ? "data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                    : "data-[state=active]:bg-green-600 data-[state=active]:text-white"
                }`}
              >
                <UserCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Teachers</span>
                <span className="sm:hidden">Staff</span>
              </TabsTrigger>
            )}

            <TabsTrigger
              value="personal"
              className={`text-xs sm:text-sm whitespace-nowrap ${
                theme === "light"
                  ? "data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                  : "data-[state=active]:bg-green-600 data-[state=active]:text-white"
              }`}
            >
              <UserCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Personal</span>
              <span className="sm:hidden">Me</span>
            </TabsTrigger>
            <TabsTrigger
              value="myPosts"
              className={`text-xs sm:text-sm whitespace-nowrap ${
                theme === "light"
                  ? "data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                  : "data-[state=active]:bg-green-600 data-[state=active]:text-white"
              }`}
            >
              <PiMagnifyingGlassPlusDuotone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">My Posts</span>
              <span className="sm:hidden">Mine</span>
            </TabsTrigger>
            <TabsTrigger
              value="savedPosts"
              className={`text-xs sm:text-sm whitespace-nowrap ${
                theme === "light"
                  ? "data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                  : "data-[state=active]:bg-green-600 data-[state=active]:text-white"
              }`}
            >
              <BookMarkedIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Saved Posts</span>
              <span className="sm:hidden">Saved</span>
            </TabsTrigger>
            {userRole === "admin" && (
              <TabsTrigger
                value="allSchoolPosts"
                className={`text-xs sm:text-sm whitespace-nowrap ${
                  theme === "light"
                    ? "data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                    : "data-[state=active]:bg-green-600 data-[state=active]:text-white"
                }`}
              >
                <BookMarkedIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden lg:inline">School's all Posts</span>
                <span className="lg:hidden">All Posts</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="everyone" className="mt-0">
            {renderPosts()}
          </TabsContent>

          {userRole === "student" && (
            <TabsContent value="class" className="mt-0">
              {renderPosts()}
            </TabsContent>
          )}

          <TabsContent value="teachers" className="mt-0">
            {renderPosts()}
          </TabsContent>

          <TabsContent value="personal" className="mt-0">
            {renderPosts()}
          </TabsContent>

          <TabsContent value="myPosts" className="mt-0">
            {renderPosts()}
          </TabsContent>

          <TabsContent value="savedPosts">{renderPosts()}</TabsContent>

          {userRole === "admin" && (
            <TabsContent value="allSchoolPosts" className="mt-0">
              {renderPosts()}
            </TabsContent>
          )}
        </Tabs>
        {/* ) : ( */}

        {/* <div className="mt-4">{renderPosts()}</div> */}
        {/* )} */}
      </div>

      <CreatePostDialog
        open={createPostOpen}
        onOpenChange={setCreatePostOpen}
      />
      <PostFilterDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        filters={filters}
        setFilters={applyFilters} // Use the new applyFilters function
      />
    </div>
  );

  // Helper function to render posts
  function renderPosts() {
    if (isLoading && posts.length === 0) {
      return (
        <div className="flex justify-center items-center py-12 sm:py-20">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-indigo-500" />
        </div>
      );
    } else if (posts.length === 0) {
      return (
        <div className="text-center py-12 sm:py-20 px-4">
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            No posts found. Create your first post!
          </p>
        </div>
      );
    } else {
      return (
        <div className="space-y-4 sm:space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      );
    }
  }
};

export default PostsFeedPage;