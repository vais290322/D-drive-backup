// import React, { useState } from "react";
// import { useTheme } from "@/context/ThemeContext";
// import axios from "axios";
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Loader2 } from "lucide-react";

// const UserProfileHover = ({ children, userId, schoolId, role }) => {
//   const { theme } = useTheme();
//   const [userDetails, setUserDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchUserDetails = async () => {
//     if (!userId || !schoolId) {
//       console.log('Missing userId or schoolId:', { userId, schoolId });
//       setError("Missing user ID or school ID");
//       setLoading(false);
//       return;
//     }
    
//     setLoading(true);
//     setError(null);
    
//     try {
//       console.log(`Fetching user details for userId: ${userId}, schoolId: ${schoolId}`);
//       const response = await axios.get(`http://192.168.0.158:8089/api/entity/${userId}/${schoolId}`);
//       console.log('User details response:', response.data);
//       if (response.data && response.data.data) {
//         setUserDetails(response.data.data);
//       } else {
//         setError("Invalid response format");
//         console.error("Invalid response format:", response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//       setError("Failed to load user details: " + (error.message || 'Unknown error'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getRoleColor = (role) => {
//     switch (role?.toUpperCase()) {
//       case "ADMIN":
//       case "VAIS":
//         return "bg-indigo-500";
//       case "TEACHER":
//         return "bg-green-500";
//       case "EDP":
//         return "bg-amber-500";
//       case "LIBRARIAN":
//         return "bg-purple-500";
//       case "STUDENT":
//         return "bg-blue-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   return (
//     <HoverCard onOpenChange={(open) => {
//       if (open && !userDetails && !loading) {
//         fetchUserDetails();
//       }
//     }}>
//       <HoverCardTrigger asChild>
//         {children}
//       </HoverCardTrigger>
//       <HoverCardContent className={`w-80 p-0 ${theme === "light" ? "bg-gray-800 text-white border-gray-700" : ""}`} >
//         {loading ? (
//           <div className="flex justify-center items-center p-4">
//             <Loader2 className="h-6 w-6 animate-spin" />
//           </div>
//         ) : error ? (
//           <div className="p-4 text-center text-red-500">{error}</div>
//         ) : userDetails ? (
//           <div>
//             {/* Header with background color based on role */}
//             <div className={`${getRoleColor(userDetails.role)} p-4 rounded-t-lg`}>
//               <div className="flex items-center gap-3">
//                 <Avatar className="h-16 w-16 border-2 border-white">
//                   <AvatarImage 
//                     src={userDetails.user?.studentImage || userDetails.user?.teachersImage || userDetails.user?.edpImage || userDetails.user?.librarianImage || userDetails.user?.schoolLogo} 
//                     alt={userDetails.user?.studentName || userDetails.user?.teachersName || userDetails.user?.schoolPrincipalName || userDetails?.user?.edpName ||  userDetails?.user?.librarianName  || "User"} 
//                   />
//                   <AvatarFallback className="text-lg">
//                     {(userDetails.user?.studentName || userDetails.user?.teachersName || userDetails.user?.schoolPrincipalName || userDetails?.user?.edpName ||  userDetails?.user?.librarianName || "U").charAt(0)}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <h3 className="font-bold text-white text-lg">
//                     {userDetails.user?.studentName || userDetails.user?.teachersName || userDetails.user?.schoolPrincipalName || userDetails?.user?.edpName ||  userDetails?.user?.librarianName  || "User"}
//                   </h3>
//                   <p className="text-white/80 text-sm">{userDetails.role}</p>
//                 </div>
//               </div>
//             </div>
            
//             {/* User details */}
//             <div className="p-4">
//               {userDetails.role === "STUDENT" && (
//                 <>
//                   <DetailItem label="Admission No" value={userDetails.user?.admissionNumber} />
//                   <DetailItem label="Class" value={`${userDetails.user?.className} ${userDetails.user?.section || ''}`} />
//                   <DetailItem label="Roll No" value={userDetails.user?.rollNo} />
//                   <DetailItem label="Email" value={userDetails.user?.email} />
//                   <DetailItem label="Phone" value={userDetails.user?.phone} />
//                 </>
//               )}
              
//               {(userDetails.role === "TEACHER" || userDetails.role === "LIBRARIAN" || userDetails.role === "EDP") && (
//                 <>
//                   <DetailItem label="Email" value={userDetails.user?.email} />
//                   <DetailItem label="Phone" value={userDetails.user?.phone} />
//                   <DetailItem label="Subject" value={userDetails.user?.subject} />
//                   <DetailItem label="Designation" value={userDetails.user?.designation} />
//                 </>
//               )}
              
//               {(userDetails.role === "ADMIN" || userDetails.role === "VAIS") && (
//                 <>
//                   <DetailItem label="Email" value={userDetails.user?.email} />
//                   <DetailItem label="Role" value={userDetails.role} />
//                 </>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div className="p-4 text-center">No user information available</div>
//         )}
//       </HoverCardContent>
//     </HoverCard>
//   );
// };

// // Helper component for displaying user details
// const DetailItem = ({ label, value }) => {
//   if (!value) return null;
  
//   return (
//     <div className="mb-2">
//       <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
//       <p className="text-sm">{value}</p>
//     </div>
//   );
// };

// export default UserProfileHover;

// version 2 

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import axios from "axios";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Mail, Phone, BookOpen, Award, Hash, User, School } from "lucide-react";
import { userUrlApi } from "@/common/posts";

const UserProfileHover = ({ children, userId, schoolId, role }) => {
  const { theme } = useTheme();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserDetails = async () => {
    if (!userId || !schoolId) {
      console.log('Missing userId or schoolId:', { userId, schoolId });
      setError("Missing user ID or school ID");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // console.log(`Fetching user details for userId: ${userId}, schoolId: ${schoolId}`);
      const response = await axios.get(`${userUrlApi}/${userId}/${schoolId}`);
      // console.log('User details response:', response.data);
      if (response.data && response.data.data) {
        setUserDetails(response.data.data);
      } else {
        setError("Invalid response format");
        // console.error("Invalid response format:", response.data);
      }
    } catch (error) {
      // console.error("Error fetching user details:", error);
      setError("Failed to load user details: " + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const getRoleGradient = (role) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
      case "VAIS":
        return "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500";
      case "TEACHER":
        return "bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500";
      case "EDP":
        return "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500";
      case "LIBRARIAN":
        return "bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500";
      case "STUDENT":
        return "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500";
      default:
        return "bg-gradient-to-br from-gray-500 via-slate-500 to-gray-600";
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
      case "VAIS":
        return <Award className="h-3 w-3 sm:h-4 sm:w-4" />;
      case "TEACHER":
        return <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />;
      case "EDP":
        return <User className="h-3 w-3 sm:h-4 sm:w-4" />;
      case "LIBRARIAN":
        return <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />;
      case "STUDENT":
        return <School className="h-3 w-3 sm:h-4 sm:w-4" />;
      default:
        return <User className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };

  const getUserName = (userDetails) => {
    return userDetails.user?.studentName || 
           userDetails.user?.teachersName || 
           userDetails.user?.schoolPrincipalName || 
           userDetails?.user?.edpName ||  
           userDetails?.user?.librarianName || 
           "User";
  };

  const getUserImage = (userDetails) => {
    return userDetails.user?.studentImage || 
           userDetails.user?.teachersImage || 
           userDetails.user?.edpImage || 
           userDetails.user?.librarianImage || 
           userDetails.user?.schoolLogo;
  };

  return (
    <HoverCard onOpenChange={(open) => {
      if (open && !userDetails && !loading) {
        fetchUserDetails();
      }
    }}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent 
        className={`
          w-80 sm:w-96 max-w-[90vw] p-0 border-0 shadow-2xl 
          ${theme === "light" ? "bg-gray-800 text-white" : "bg-white text-gray-900"} 
          rounded-2xl overflow-hidden backdrop-blur-sm
        `}
        side="top"
        sideOffset={5}
      >
        {loading ? (
          <div className="flex justify-center items-center p-4 sm:p-6">
            <div className="relative">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-500" />
              <div className="absolute inset-0 h-6 w-6 sm:h-8 sm:w-8 rounded-full border-2 border-blue-200 animate-pulse"></div>
            </div>
          </div>
        ) : error ? (
          <div className="p-4 sm:p-6 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-red-100 light:bg-red-900/30 rounded-full mb-2 sm:mb-3">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
            </div>
            <p className="text-red-500 text-xs sm:text-sm font-medium px-2">{error}</p>
          </div>
        ) : userDetails ? (
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600"></div>
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>

            {/* Header with gradient background */}
            <div className={`${getRoleGradient(userDetails.role)} p-3 sm:p-4 relative overflow-hidden`}>
              {/* Decorative elements - adjusted for mobile */}
              <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 -translate-y-8 sm:-translate-y-10 translate-x-8 sm:translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 translate-y-6 sm:translate-y-8 -translate-x-6 sm:-translate-x-8"></div>
              
              <div className="relative z-10 flex items-center gap-2 sm:gap-3">
                <div className="relative flex-shrink-0">
                  <Avatar className="h-10 w-10 sm:h-14 sm:w-14 border-2 sm:border-3 border-white/20 shadow-lg ring-1 sm:ring-2 ring-white/10">
                    <AvatarImage 
                      src={getUserImage(userDetails)} 
                      alt={getUserName(userDetails)} 
                      className="object-cover"
                    />
                    <AvatarFallback className="text-sm sm:text-lg font-bold bg-white/20 text-white">
                      {getUserName(userDetails).charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm text-white">
                    {getRoleIcon(userDetails.role)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-sm sm:text-lg mb-0.5 drop-shadow-sm truncate">
                    {getUserName(userDetails)}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-white/90 text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/20 rounded-full backdrop-blur-sm">
                      {userDetails.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* User details with improved mobile spacing */}
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
              {userDetails.role === "STUDENT" && (
                <div className="grid grid-cols-1 gap-2 sm:gap-3">
                  <DetailItem 
                    theme={theme}
                    icon={<Hash className="h-3 w-3 sm:h-3.5 sm:w-3.5" />} 
                    label="Admission No" 
                    value={userDetails.user?.admissionNumber} 
                  />
                  <DetailItem 
                    theme={theme}
                    icon={<School className="h-3 w-3 sm:h-3.5 sm:w-3.5" />} 
                    label="Class, Section & Roll No" 
                    value={`${userDetails.user?.className} - ${userDetails.user?.section || ''} - ${userDetails.user?.rollNo}`} 
                  />
                  {/* <DetailItem 
                    theme={theme}
                    icon={<Hash className="h-3 w-3 sm:h-3.5 sm:w-3.5" />} 
                    label="Roll No" 
                    value={userDetails.user?.rollNo} 
                  /> */}
                  <DetailItem 
                    theme={theme}
                    icon={<Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5" />} 
                    label="Email" 
                    value={userDetails.user?.email} 
                  />
                  <DetailItem 
                    theme={theme}
                    icon={<Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5" />} 
                    label="Phone" 
                    value={userDetails.user?.phone} 
                  />
                </div>
              )}
              
              {(userDetails.role === "TEACHER" || userDetails.role === "LIBRARIAN" || userDetails.role === "EDP") && (
                <div className="grid grid-cols-1 gap-2 sm:gap-3">
                  <DetailItem 
                    theme={theme}
                    icon={<Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5" />} 
                    label="Email" 
                    value={userDetails.user?.email} 
                  />
                  <DetailItem 
                    theme={theme}
                    icon={<Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5" />} 
                    label="Phone" 
                    value={userDetails.user?.phone} 
                  />
                  <DetailItem 
                    theme={theme}
                    icon={<BookOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5" />} 
                    label="Subject" 
                    value={userDetails.user?.subject} 
                  />
                  <DetailItem 
                    theme={theme}
                    icon={<Award className="h-3 w-3 sm:h-3.5 sm:w-3.5" />} 
                    label="Designation" 
                    value={userDetails.user?.designation} 
                  />
                </div>
              )}
              
              {(userDetails.role === "ADMIN" || userDetails.role === "VAIS") && (
                <div className="grid grid-cols-1 gap-2 sm:gap-3">
                  <DetailItem 
                    theme={theme}
                    icon={<Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5" />} 
                    label="Email" 
                    value={userDetails.user?.schoolPrincipalEmail} 
                  />
                  <DetailItem 
                    theme={theme}
                    icon={<Award className="h-3 w-3 sm:h-3.5 sm:w-3.5" />} 
                    label="Role" 
                    value={userDetails.role} 
                  />
                </div>
              )}
            </div>

            {/* Footer with subtle branding */}
            <div className={`px-3 sm:px-4 py-1.5 sm:py-2 border-t ${theme === "light" ? "border-gray-700 bg-gray-800/50" : "border-gray-100 bg-gray-50"}`}>
              <p className="text-xs text-gray-500 text-center">School Management System</p>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-6 text-center">
            <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 ${theme === "light" ? "bg-gray-700" : "bg-gray-100"} rounded-full mb-2 sm:mb-3`}>
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-xs sm:text-sm">No user information available</p>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

// Enhanced DetailItem component with responsive design
const DetailItem = ({ icon, label, value, theme }) => {
  if (!value) return null;
  
  return (
    <div className={`
      flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-lg 
      ${theme === "light" ? "bg-gray-700/50 hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100"} 
      transition-colors duration-200
    `}>
      <div className={`
        flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 
        ${theme === "light" ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"} 
        rounded-lg flex items-center justify-center
      `}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`
          text-xs font-medium 
          ${theme === "light" ? "text-gray-400" : "text-gray-500"} 
          uppercase tracking-wide
        `}>
          {label}
        </p>
        <p className={`
          text-xs sm:text-sm font-medium 
          ${theme === "light" ? "text-gray-200" : "text-gray-900"} 
          truncate
        `}>
          {value}
        </p>
      </div>
    </div>
  );
};

export default UserProfileHover;