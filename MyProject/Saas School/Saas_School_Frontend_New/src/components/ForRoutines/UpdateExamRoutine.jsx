import React, { useState, useEffect } from "react";
import { FaEdit, FaPlus, FaTrash, FaCalendarAlt, FaSave } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { teacherRoutine } from "@/common/routines";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/context/ThemeContext";
import { Loader2 } from "lucide-react";

const UpdateExamRoutine = ({ data }) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === "light"; // In your app "light" theme seems to be dark
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const allClass = useSelector((state) => state.class.classNames);
  const allSubject = useSelector((state) => state.subject.subjectNames);
  const examTypeData = useSelector((state) => state.examType.examType) || [];
  const dispatch = useDispatch();
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  
  // Add state to control dialog open/close
  const [open, setOpen] = useState(false);

  const [allData, setAllData] = useState({
    id: Date.now(),
    className: "",
    examType: "",
    subjects: [],
  });
  
  useEffect(() => {
    if (data && data.subjects && data.subjects.length > 0) {
      setAllData({
        id: data.id,
        className: data.className,
        examType: data.examType,
      });
      setRows(data.subjects);
    }
  }, [data]);
  
  const [rows, setRows] = useState([
    { subjectName: "", examDate: "", startTime: "", endTime: "" },
  ]);

  // Handler to add a new row
  const addRow = () => {
    if (rows.length >= 8) {
      toast.warning("You cannot add more than 8 exams");
      return;
    }
    setRows([
      ...rows,
      { subjectName: "", examDate: "", startTime: "", endTime: "" },
    ]);
  };

  // Handler to delete a row
  const deleteRow = (index) => {
    if(rows.length === 1){
      toast.error("At least one subject is required.");
      return;
    }
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  // Handler to update row data
  const handleChange = (index, field, value) => {
    const updatedRows = rows.map((row, i) => {
      if (i === index) {
        // Create a completely new object instead of modifying the existing one
        return { ...row, [field]: value };
      }
      return row;
    });
    setRows(updatedRows);
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updateData = {
      ...allData,
      subjects: [...rows],
    };

    try {
      const response = await axios.put(
        `${teacherRoutine}/api/exam-routines/${updateData.id}/${schoolId}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        toast.success(response.data?.message || "Exam routine updated successfully!");
        
        // Reset form fields after successful update
        setAllData({
          id: Date.now(),
          className: "",
          examType: "",
        });
        setRows([{ subjectName: "", examDate: "", startTime: "", endTime: "" }]);
        
        // Close the dialog after successful update
        setOpen(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update exam routine"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const capitalizeFirstLetter = (str) =>
    str?.charAt(0).toUpperCase() + str?.slice(1);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <FaEdit 
          className="sm:w-8 sm:h-8 w-6 h-6 bg-amber-500 hover:bg-amber-600 text-white p-1 sm:p-2 cursor-pointer rounded-md transition-colors duration-200 hidden sm:block" 
          onClick={() => setOpen(true)}
        />
      </DialogTrigger>
      <DialogContent className={`sm:max-w-[70%] max-w-[90%] rounded-xl ${
        isDarkTheme 
          ? "bg-gray-800 border-gray-700 text-white" 
          : "bg-white border-gray-200"
      }`}>
        <DialogHeader>
          <DialogTitle className={`text-xl font-bold pb-2 border-b flex items-center gap-2 ${
            isDarkTheme 
              ? "text-white border-gray-700" 
              : "text-gray-800 border-gray-200"
          }`}>
            <FaCalendarAlt className={`${isDarkTheme ? "text-amber-400" : "text-amber-500"}`} />
            Update Exam Routine
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <form onSubmit={handleSubmit}>
            {/* Static Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Class Selection */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="className" className={isDarkTheme ? "text-gray-200" : "text-gray-700"}>
                  Select a Class <span className="text-red-500">*</span>
                </Label>
                <Select
                  required
                  value={allData.className}
                  onValueChange={(value) =>
                    setAllData({ ...allData, className: value })
                  }
                >
                  <SelectTrigger className={`w-full ${
                    isDarkTheme
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-amber-500"
                      : "bg-white border-gray-300 focus:ring-amber-500"
                  }`}>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent className={
                    isDarkTheme ? "bg-gray-800 border-gray-700 text-white" : ""
                  }>
                    <SelectGroup>
                      <SelectLabel>Class</SelectLabel>
                      {allClass.map((item, index) => (
                        <SelectItem key={index} value={item}>
                          {capitalizeFirstLetter(item)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Exam Type Selection */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="examType" className={isDarkTheme ? "text-gray-200" : "text-gray-700"}>
                  Select Exam Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  required
                  value={allData.examType}
                  onValueChange={(value) =>
                    setAllData({ ...allData, examType: value })
                  }
                >
                  <SelectTrigger className={`w-full ${
                    isDarkTheme
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-amber-500"
                      : "bg-white border-gray-300 focus:ring-amber-500"
                  }`}>
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent className={
                    isDarkTheme ? "bg-gray-800 border-gray-700 text-white" : ""
                  }>
                    <SelectGroup>
                      <SelectLabel>Exam Type</SelectLabel>
                      {examTypeData?.map((item, index) => (
                        <SelectItem key={index} value={item.examTypeName}>
                          {item.examTypeName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dynamic Exam Rows */}
            <div className={`mb-6 p-4 rounded-lg ${
              isDarkTheme ? "bg-gray-700" : "bg-gray-50"
            }`}>
              <h3 className={`text-lg font-medium mb-4 ${
                isDarkTheme ? "text-white" : "text-gray-800"
              }`}>Exam Schedule</h3>
              
              <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {rows.map((row, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-4 p-3 rounded-md ${
                      isDarkTheme ? "bg-gray-800" : "bg-white border border-gray-200"
                    }`}
                  >
                    <div className={`font-medium ${isDarkTheme ? "text-gray-300" : "text-gray-600"}`}>
                      Exam #{index + 1}
                    </div>
                    
                    {/* Subject Selection */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor={`subject-${index}`} className={isDarkTheme ? "text-gray-200" : "text-gray-700"}>
                        Subject <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        required
                        value={row.subjectName || ""}
                        onValueChange={(value) => handleChange(index, "subjectName", value)}
                      >
                        <SelectTrigger className={`w-full ${
                          isDarkTheme
                            ? "bg-gray-700 border-gray-600 text-white focus:ring-amber-500"
                            : "bg-white border-gray-300 focus:ring-amber-500"
                        }`}>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent className={
                          isDarkTheme ? "bg-gray-800 border-gray-700 text-white" : ""
                        }>
                          <SelectGroup>
                            <SelectLabel>Subjects</SelectLabel>
                            {allSubject.map((item, index) => (
                              <SelectItem key={index} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Exam Date */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor={`date-${index}`} className={isDarkTheme ? "text-gray-200" : "text-gray-700"}>
                        Exam Date <span className="text-red-500">*</span>
                      </Label>
                      <input
                        type="date"
                        id={`date-${index}`}
                        required
                        value={row.examDate}
                        onChange={(e) => handleChange(index, "examDate", e.target.value)}
                        className={`w-full p-2 rounded-md ${
                          isDarkTheme
                            ? "bg-gray-700 border-gray-600 text-white focus:ring-amber-500"
                            : "bg-white border-gray-300 focus:ring-amber-500"
                        }`}
                      />
                    </div>

                    {/* Time Range */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor={`time-${index}`} className={isDarkTheme ? "text-gray-200" : "text-gray-700"}>
                        Time Range <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="time"
                          required
                          value={row.startTime}
                          onChange={(e) => handleChange(index, "startTime", e.target.value)}
                          className={`w-full p-2 rounded-md ${
                            isDarkTheme
                              ? "bg-gray-700 border-gray-600 text-white focus:ring-amber-500"
                              : "bg-white border-gray-300 focus:ring-amber-500"
                          }`}
                        />
                        <span className={isDarkTheme ? "text-gray-400" : "text-gray-500"}>to</span>
                        <input
                          type="time"
                          required
                          value={row.endTime}
                          onChange={(e) => handleChange(index, "endTime", e.target.value)}
                          className={`w-full p-2 rounded-md ${
                            isDarkTheme
                              ? "bg-gray-700 border-gray-600 text-white focus:ring-amber-500"
                              : "bg-white border-gray-300 focus:ring-amber-500"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Delete Button */}
                    <div className="flex items-end justify-end">
                      <Button
                        type="button"
                        className={`p-2 rounded-md transition-colors ${
                          isDarkTheme
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                        onClick={() => deleteRow(index)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Add Row Button */}
              <Button
                type="button"
                className={`flex items-center gap-2 mt-2 ${
                  isDarkTheme
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                } ${rows.length >= 8 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={addRow}
                disabled={rows.length >= 8}
              >
                <FaPlus className="text-sm" /> 
                {rows.length >= 8 ? 'Maximum Exams Reached' : 'Add Another Exam'}
              </Button>
            </div>

            {/* Submit Button */}
            <div className={`flex justify-end gap-4 mt-6 pt-4 border-t ${
              isDarkTheme ? "border-gray-700" : "border-gray-200"
            }`}>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : isDarkTheme
                      ? "bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white"
                      : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="text-sm" />
                    <span>Update Exam Routine</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateExamRoutine;
