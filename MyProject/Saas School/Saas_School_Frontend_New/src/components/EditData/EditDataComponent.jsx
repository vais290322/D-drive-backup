import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { FaEdit, FaSave } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const EditDataComponent = ({
  formData,
  postApiLoading,
  onChangeFunctin,
  onSubmitFunction,
  inputValue,
  customContent,
  onEditClick,
  customClass,
  dialogTitle = "Edit this data",
}) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === "light"; // In your app "light" theme seems to be dark

  return (
    <Dialog>
      <DialogTrigger asChild>
        <FaEdit
          className="editClass sm:w-8 sm:h-8 w-6 h-6 bg-amber-500 hover:bg-amber-600 text-white p-1 sm:p-2 cursor-pointer rounded-md transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation(); // Prevent propagation issues
            onEditClick(); // Call the edit handler
          }}
        />
      </DialogTrigger>
      <DialogContent 
        className={`sm:max-w-[425px] rounded-xl ${
          isDarkTheme 
            ? "bg-gray-800 border-gray-700 text-white" 
            : "bg-white border-gray-200"
        }`}
      >
        <DialogHeader>
          <DialogTitle 
            className={`text-xl font-bold pb-2 border-b ${
              isDarkTheme 
                ? "text-white border-gray-700" 
                : "text-gray-800 border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <FaEdit className={`${isDarkTheme ? "text-amber-400" : "text-amber-500"}`} />
              {dialogTitle}
            </div>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmitFunction}>
          <div
            className={`p-4 ${
              customClass || "flex flex-col"
            } gap-4`}
          >
            {formData?.map((data, index) => (
              <div className="space-y-2" key={index}>
                <Label 
                  htmlFor={data.name} 
                  className={`text-left flex items-center gap-1 ${
                    isDarkTheme ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {data.label}
                  {data.required && (
                    <sup className="text-red-600">*</sup>
                  )}
                </Label>
                <Input
                  required={data.required}
                  id={data.name}
                  name={data.name}
                  type={data.type}
                  placeholder={data.placeholder}
                  value={inputValue[data.name] || ""}
                  onChange={onChangeFunctin}
                  className={`focus-visible:ring-1 ${
                    isDarkTheme
                      ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-amber-500 focus:border-transparent"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-amber-500 focus:border-transparent"
                  }`}
                />
              </div>
            ))}
            {customContent && customContent}
          </div>
          <DialogFooter className={`${isDarkTheme ? "border-t border-gray-700 pt-4" : "border-t border-gray-200 pt-4"}`}>
            {postApiLoading ? (
              <Button 
                disabled 
                className={`${
                  isDarkTheme
                    ? "bg-gray-600 text-white"
                    : "bg-gray-400 text-white"
                }`}
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </Button>
            ) : (
              <Button 
                type="submit" 
                className={`${
                  isDarkTheme
                    ? "bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white"
                    : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                }`}
              >
                <FaSave className="mr-2 h-4 w-4" />
                Save changes
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDataComponent;
