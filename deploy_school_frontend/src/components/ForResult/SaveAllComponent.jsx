// import React from "react";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Button } from "../ui/button";
// import { SaveAllIcon } from "lucide-react";

// const SaveAllComponent = () => {
//   return (
//     <AlertDialog>
//       <AlertDialogTrigger asChild>
//         <Button
//           className="bg-[#452B90] hover:bg-[#c29732]"
//         >
//           <SaveAllIcon /> <span>Save All</span>
//         </Button>
//       </AlertDialogTrigger>
//       <AlertDialogContent className={`sm:max-w-[30%] max-w-[80%]`}>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//           <AlertDialogDescription>
//             This action cannot be undone. This will save all data.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel>Cancel</AlertDialogCancel>
//           <AlertDialogAction className="bg-[#452B90] hover:bg-[#352072]">
//             Continue
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// };

// export default SaveAllComponent;

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SaveAllIcon } from "lucide-react";
import { toast } from "sonner";

const SaveAllComponent = ({ handleSaveAll }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleConfirm = () => {
    setIsConfirmOpen(true); // Open the confirmation modal/dialog
  };

  const handleCancel = () => {
    setIsConfirmOpen(false); // Close the modal/dialog
  };

  const handleContinue = () => {
    setIsConfirmOpen(false); // Close the modal/dialog
    handleSaveAll(); // Call the parent-provided save function
  };

  return (
    <>
      {/* Save All Button */}
      <Button
        onClick={handleConfirm}
        className="bg-[#452B90] hover:bg-[#c29732] flex items-center"
      >
        <SaveAllIcon className="mr-2" />
        Save All
      </Button>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Save</h2>
            <p className="mb-4">
              Are you sure you want to save all marks? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={handleCancel}
                className="bg-gray-300 text-black hover:bg-gray-400"
              >
                Cancel
              </Button>
              <Button
                onClick={handleContinue}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SaveAllComponent;
