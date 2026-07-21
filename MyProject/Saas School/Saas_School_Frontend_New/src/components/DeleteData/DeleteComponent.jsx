import React from "react";
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
import { IoMdClose } from "react-icons/io";
import { FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";

const DeleteComponent = ({ deletePath, name, onDelete, customData }) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === "light"; // In your app "light" theme seems to be dark
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      // Make a DELETE request to the API
      await axios.delete(deletePath, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success(`${name} has been deleted successfully!`);
      onDelete(); // Call the provided callback to update the Redux state
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete item");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <IoMdClose className="deleteClass sm:w-8 sm:h-8 w-6 h-6 bg-red-500 hover:bg-red-600 text-white p-1 sm:p-2 cursor-pointer rounded-md transition-colors duration-200" />
      </AlertDialogTrigger>
      <AlertDialogContent 
        className={`sm:max-w-[425px] rounded-xl ${
          isDarkTheme 
            ? "bg-gray-800 border-gray-700 text-white" 
            : "bg-white border-gray-200"
        }`}
      >
        <AlertDialogHeader>
          <AlertDialogTitle 
            className={`text-xl font-bold pb-2 border-b flex items-center gap-2 ${
              isDarkTheme 
                ? "text-white border-gray-700" 
                : "text-gray-800 border-gray-200"
            }`}
          >
            <FaExclamationTriangle className={`${isDarkTheme ? "text-red-400" : "text-red-500"}`} />
            Confirm Deletion
          </AlertDialogTitle>
          <AlertDialogDescription 
            className={`mt-4 ${isDarkTheme ? "text-gray-300" : "text-gray-600"}`}
          >
            This action cannot be undone. This will permanently delete{" "}
            <strong className={`${isDarkTheme ? "text-red-400" : "text-red-600"}`}>
              {customData && customData}
            </strong>{" "}
            from the records.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={`${isDarkTheme ? "border-t border-gray-700 pt-4 mt-4" : "border-t border-gray-200 pt-4 mt-4"}`}>
          <AlertDialogCancel 
            className={`${
              isDarkTheme
                ? "bg-gray-700 text-white hover:bg-gray-600 border-gray-600"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300"
            }`}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={`${
              isDeleting
                ? "bg-gray-500 cursor-not-allowed"
                : isDarkTheme
                  ? "bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
                  : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            } text-white`}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <FaTrash className="mr-2 h-3 w-3" />
                Delete
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteComponent;
