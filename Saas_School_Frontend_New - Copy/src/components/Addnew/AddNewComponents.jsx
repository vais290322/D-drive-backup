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
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-white hover:text-[#242424] bg-[#452B90] hover:bg-[#c29732]">
          <span className="hidden sm:block">
            <FaPlus />
          </span>{" "}
          Add New {dialogHeader}
        </Button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-[30%] max-w-[80%]`}>
        <DialogHeader>
          <DialogTitle className="border-b-[1px] border-b-[rgba(0,0,0,0.3)] pb-2">
            Create {dialogHeader}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmitFunction}>
          <div className={`columns-lg  p-[0.675rem] ${customClass || "flex flex-col"} gap-4`}>
          {expenseType && expenseType}
            {formData.map((data, index) => (
              <div className="col-span-2 items-center space-y-2" key={index}>
                <Label htmlFor={data.name} className="text-left">
                  {data.label} <sup className="text-red-600 hidden sm:inline">*</sup>
                </Label>
                <Input
                  required={data.required}
                  id={data.name}
                  name={data.name}
                  type={data.type}
                  placeholder={data.placeholder}
                  value={inputValue[data.name] || ""}
                  onChange={onChangeFunctin}
                  className="focus-visible:ring-1"
                />
              </div>
            ))}
            {customContent &&  customContent}
            
          </div>
          <DialogFooter>
            {postApiLoading ? (
              <Button className="bg-[#452B90] hover:bg-[#352072]">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-[#452B90] hover:bg-[#352072]"
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
