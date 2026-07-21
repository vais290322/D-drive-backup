import { CustomDialog } from "@/components/Dialog";
import { useState } from "react";

export function ShowAchievementDialog({ achievement }) {
  const { title, description, imageUrl } = achievement;
  const [open, setOpen] = useState(false);

  return (
    <CustomDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button className="self-end text-sm font-semibold text-primary hover:scale-[1.1] transition cursor-pointer">
          Show
        </button>
      }
      title={title}
      description="Full details of this achievement"
      contentClass="w-full max-w-sm sm:max-w-md lg:max-w-lg p-4 sm:p-6 lg:p-8"
      footer={
        <button
          className="mt-4 w-full sm:w-auto px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition cursor-pointer"
          onClick={() => setOpen(false)}
        >
          Close
        </button>
      }
    >
      <div className="flex flex-col gap-6">
        {imageUrl && (
          <div className="w-full bg-gray-100 rounded-md flex justify-center items-center p-2">
            <img
              src={imageUrl}
              alt={title}
              className="max-h-80 sm:max-h-96 lg:max-h-[20rem] w-auto object-contain"
            />
          </div>
        )}
        <div className="max-h-[60vh] overflow-y-auto text-sm sm:text-base leading-relaxed text-gray-800">
            <p className="mb-3 last:mb-0">
              {description}
            </p>
        </div>
      </div>
    </CustomDialog>
  );
}
