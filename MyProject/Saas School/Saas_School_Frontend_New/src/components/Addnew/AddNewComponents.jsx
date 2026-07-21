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
import { FaPlus } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const AddNewComponents = ({
  onChangeFunctin,
  onSubmitFunction,
  dialogHeader,
  formData,
  inputValue,
  postApiLoading,
  customContent,
  expenseType,
  customClass,
  isDarkMode,
}) => {
  const { theme } = useTheme();
  const darkMode = isDarkMode !== undefined ? isDarkMode : theme === "light";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className={`flex items-center gap-2 text-white ${
            darkMode 
              ? "bg-[#2563eb] hover:bg-[#1d4ed8]" 
              : "bg-[#452B90] hover:bg-[#352072]"
          }`}
        >
          <FaPlus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Add New</span> {dialogHeader}
        </Button>
      </DialogTrigger>
      <DialogContent 
        className={`sm:max-w-[500px] max-w-[95%] ${
          darkMode 
            ? "bg-[#111c38] text-white border-[#1e2a4a]" 
            : "bg-white"
        }`}
      >
        <DialogHeader>
          <DialogTitle 
            className={`border-b pb-3 ${
              darkMode 
                ? "border-[#1e2a4a] text-white" 
                : "border-gray-200 text-gray-900"
            }`}
          >
            Create {dialogHeader}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmitFunction}>
          <div className={`grid gap-4 py-4 ${
            customClass || "grid-cols-1 md:grid-cols-2"
          }`}>
            {expenseType && expenseType}
            {formData.map((data, index) => (
              <div className="space-y-2" key={index}>
                <Label 
                  htmlFor={data.name} 
                  className={`text-left ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {data.label} 
                  {data.required && (
                    <span className="text-red-500 ml-1">*</span>
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
                    darkMode 
                      ? "bg-[#1a2747] border-[#1e2a4a] text-white placeholder:text-gray-400" 
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>
            ))}
            {customContent && customContent}
          </div>
          <DialogFooter className="mt-6">
            {postApiLoading ? (
              <Button 
                disabled 
                className={`${
                  darkMode 
                    ? "bg-[#1a2747] text-gray-300" 
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </Button>
            ) : (
              <Button
                type="submit"
                className={`${
                  darkMode 
                    ? "bg-[#2563eb] hover:bg-[#1d4ed8] text-white" 
                    : "bg-[#452B90] hover:bg-[#352072] text-white"
                }`}
              >
                Save
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewComponents;