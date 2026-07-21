import React from 'react';
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
import { FaEdit } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';

const EditDataComponent = ({ 
    formData, 
    postApiLoading, 
    onChangeFunctin, 
    onSubmitFunction, 
    inputValue, 
    customContent, 
    onEditClick,
    customClass
    
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild >
                      <FaEdit className='sm:w-8 sm:h-8 w-6 h-6 bg-[#FF9F00] text-white p-1 sm:p-2 cursor-pointer rounded-sm'  onClick={(e) => {
                        e.stopPropagation(); // Prevent propagation issues
                        onEditClick(); // Call the edit handler
                    }}  />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit this data</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmitFunction}>
                    <div className={`columns-lg p-[0.675rem] ${customClass || "flex flex-col"} gap-4`}>
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
                        {customContent && customContent}
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
