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
import axios from "axios";
import { toast } from "sonner";

const DeleteComponent = ({ deletePath, name, onDelete }) => {
  const handleDelete = async () => {
    try {
      // Make a DELETE request to the API
      await axios.delete(deletePath, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success(`${name} has been deleted successfully!`);
      onDelete(); // Call the provided callback to update the Redux state
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting data");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <IoMdClose className="sm:w-8 sm:h-8 w-6 h-6 bg-[#FF5E5E] text-white p-1 sm:p-2 cursor-pointer rounded-sm" />
      </AlertDialogTrigger>
      <AlertDialogContent className={`sm:max-w-[30%] max-w-[80%]`}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <strong>{name}</strong> from the records.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-[#452B90] hover:bg-[#352072]"
            onClick={handleDelete}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteComponent;
