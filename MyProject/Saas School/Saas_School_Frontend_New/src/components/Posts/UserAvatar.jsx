import React, { useState, useEffect } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { userUrlApi } from "@/common/posts";

const UserAvatar = ({ userId, schoolId, role, className, fallbackText }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId || !schoolId) {
        // console.log('UserAvatar: Missing userId or schoolId:', { userId, schoolId });
        setError("Missing user ID or school ID");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // console.log(`UserAvatar: Fetching user details for userId: ${userId}, schoolId: ${schoolId}`);
        const response = await axios.get(`${userUrlApi}/${userId}/${schoolId}`);
        if (response.data && response.data.data) {
          // console.log('UserAvatar: User details received:', response.data.data);
          setUserDetails(response.data.data);
        } else {
          console.error("UserAvatar: Invalid response format:", response.data);
          setError("Invalid response format");
        }
      } catch (error) {
        console.error("UserAvatar: Error fetching user details:", error);
        setError("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, schoolId]);

  const getRoleColor = (role) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
      case "VAIS":
        return "bg-indigo-500";
      case "TEACHER":
        return "bg-green-500";
      case "EDP":
        return "bg-amber-500";
      case "LIBRARIAN":
        return "bg-purple-500";
      case "STUDENT":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <Avatar className={className || "h-8 w-8 sm:h-10 sm:w-10"}>
        <AvatarFallback>
          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
        </AvatarFallback>
      </Avatar>
    );
  }

  if (error || !userDetails) {
    return (
      <Avatar className={className || "h-8 w-8 sm:h-10 sm:w-10"}>
        <AvatarFallback className={`${getRoleColor(role)} text-white text-xs sm:text-sm`}>
          {fallbackText || "?"}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className={className || "h-8 w-8 sm:h-10 sm:w-10"}>
      <AvatarImage
        src={userDetails.user?.studentImage || userDetails.user?.teachersImage || userDetails.user?.edpImage || userDetails.user?.librarianImage || userDetails.user?.schoolLogo}
        alt={userDetails.user?.studentName || userDetails.user?.teachersName || userDetails.user?.schoolPrincipalName || userDetails?.user?.edpName || userDetails?.user?.librarianName || "User"}
      />
      <AvatarFallback className={`${getRoleColor(userDetails.role)} text-white text-xs sm:text-sm`}>
        {(userDetails.user?.studentName || userDetails.user?.teachersName || userDetails.user?.schoolPrincipalName || userDetails?.user?.edpName || userDetails?.user?.librarianName || "U").charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;