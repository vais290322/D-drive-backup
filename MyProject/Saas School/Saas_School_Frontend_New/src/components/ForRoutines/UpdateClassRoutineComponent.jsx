import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaTrash, FaPlus, FaEdit, FaSave, FaCalendarAlt } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import axios from "axios";
import { useSelector } from "react-redux";
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
import { teacherRoutine } from "@/common/routines";
import { useTheme } from "@/context/ThemeContext";
import { Loader2 } from "lucide-react";

const UpdateClassRoutineComponent = ({ routineData }) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === "light"; // In your app "light" theme seems to be dark
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const allClass = useSelector((state) => state.class.classNames);
  const allSection = useSelector((state) => state.section.sectionNames);
  const allSubject = useSelector((state) => state.subject.subjectNames);
  const classTime = useSelector((state) => state.classTime.classTime);
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const allTeachers = useSelector((state) => state.teacherInfo.teachersNames) || [];
  
  // State for tracking dialog open status
  const [isOpen, setIsOpen] = useState(false);
  
  // Initialize periods state
  const [periods, setPeriods] = useState([
    { id: Date.now(), periodName: "", subjectName: "", teacherName: "" },
  ]);
  
  const [allData, setAllData] = useState({
    id: Date.now(),
    className: "",
    section: "",
    day: "",
    periods: [],
  });
  
  // Function to initialize data when dialog opens
  const handleDialogOpen = () => {
    if (routineData && routineData.periods) {
      // Add id to each period if not present
      const periodsWithIds = routineData.periods.map(period => ({
        ...period,
        id: period.id || Date.now() + Math.random()
      }));
      
      setPeriods(periodsWithIds);
      setAllData({
        id: routineData.id || Date.now(),
        className: routineData.className || "",
        section: routineData.section || "",
        day: routineData.day || "",
        periods: periodsWithIds,
      });
    }
    setIsOpen(true);
  };

  // Add new period to the periods state
  const addPeriod = () => {
    if (periods.length >= 8) {
      toast.warning("You can only add up to 8 periods.");
      return;
    }
    setPeriods([
      ...periods,
      { id: Date.now(), periodName: "", subjectName: "", teacherName: "" },
    ]);
  };
  
  // Delete a period
  const deletePeriod = (id) => {
    setPeriods(periods.filter((period) => period.id !== id));
  };
  
  // Update a specific field in the period
  const handleChange = (id, field, value) => {
    setPeriods(
      periods.map((period) =>
        period.id === id ? { ...period, [field]: value } : period
      )
    );
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedData = {
      ...allData,
      periods: [...periods], // Include periods dynamically
    };
    setAllData(updatedData);
    
    try {
      const response = await axios.put(
        `${teacherRoutine}/api/v1/routine/${updatedData.id}/${schoolId}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response) {
        toast.success(response.data.message || "Routine updated successfully");
        setIsOpen(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update routine. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const sortedClassTime = [...classTime].sort((a, b) => {
    const periodOrder = (period) => {
      if (period.toLowerCase().includes("break")) return 4.5; // Place "break period" after 4th period
      const match = period.match(/\d+/); // Extract the number (e.g., 1, 2, 3)
      return match ? parseInt(match[0], 10) : Infinity; // Non-numbered periods go to the end
    };
  
    return periodOrder(a.periods) - periodOrder(b.periods);
  });
  
  const capitalizeFirstLetter = (str) =>
    str?.charAt(0).toUpperCase() + str?.slice(1);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <FaEdit
          className="sm:w-8 sm:h-8 w-6 h-6 bg-amber-500 hover:bg-amber-600 text-white p-1 sm:p-2 cursor-pointer rounded-md transition-colors duration-200 hidden sm:block"
          onClick={handleDialogOpen}
        />
      </DialogTrigger>
      <DialogContent 
        className={`sm:max-w-[70%] max-w-[90%] rounded-xl ${
          isDarkTheme 
            ? "bg-gray-800 border-gray-700 text-white" 
            : "bg-white border-gray-200"
        }`}
      >
        <DialogHeader>
          <DialogTitle 
            className={`text-xl font-bold pb-2 border-b flex items-center gap-2 ${
              isDarkTheme 
                ? "text-white border-gray-700" 
                : "text-gray-800 border-gray-200"
            }`}
          >
            <FaCalendarAlt className={`${isDarkTheme ? "text-amber-400" : "text-amber-500"}`} />
            Update Class Routine
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <form onSubmit={handleSubmit}>
            {/* Static Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

              {/* Section Selection */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="sectionName" className={isDarkTheme ? "text-gray-200" : "text-gray-700"}>
                  Select a Section <span className="text-red-500">*</span>
                </Label>
                <Select
                  required
                  value={allData.section}
                  onValueChange={(value) =>
                    setAllData({ ...allData, section: value })
                  }
                >
                  <SelectTrigger className={`w-full ${
                    isDarkTheme
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-amber-500"
                      : "bg-white border-gray-300 focus:ring-amber-500"
                  }`}>
                    <SelectValue placeholder="Select a section" />
                  </SelectTrigger>
                  <SelectContent className={
                    isDarkTheme ? "bg-gray-800 border-gray-700 text-white" : ""
                  }>
                    <SelectGroup>
                      <SelectLabel>Section</SelectLabel>
                      {allSection.map((item, index) => (
                        <SelectItem key={index} value={item}>
                          {capitalizeFirstLetter(item)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              {/* day Selection  */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="day" className={isDarkTheme ? "text-gray-200" : "text-gray-700"}>
                  Select a Day <span className="text-red-500">*</span>
                </Label>
                <Select
                  required
                  value={allData.day}
                  onValueChange={(value) =>
                    setAllData({ ...allData, day: value })
                  }
                >
                  <SelectTrigger className={`w-full ${
                    isDarkTheme
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-amber-500"
                      : "bg-white border-gray-300 focus:ring-amber-500"
                  }`}>
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent className={
                    isDarkTheme ? "bg-gray-800 border-gray-700 text-white" : ""
                  }>
                    <SelectGroup>
                      <SelectLabel>Day</SelectLabel>
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ].map((item, index) => (
                        <SelectItem key={index} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dynamic Periods */}
            <div className={`mb-6 p-4 rounded-lg ${
              isDarkTheme ? "bg-gray-700" : "bg-gray-50"
            }`}>
              <h3 className={`text-lg font-medium mb-4 ${
                isDarkTheme ? "text-white" : "text-gray-800"
              }`}>Class Periods</h3>
              
              <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {periods.map((period, index) => (
                  <div
                    key={period.id}
                    className={`grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-4 p-3 rounded-md ${
                      isDarkTheme ? "bg-gray-800" : "bg-white border border-gray-200"
                    }`}
                  >
                    <div className={`font-medium ${isDarkTheme ? "text-gray-300" : "text-gray-600"}`}>
                      Period #{index + 1}
                    </div>
                    
                    {/* Period Selection */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor={`periodName-${period.id}`} className={isDarkTheme ? "text-gray-200" : "text-gray-700"}>
                        Select a Period <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        required
                        value={period.periodName}
                        onValueChange={(value) =>
                          handleChange(period.id, "periodName", value)
                        }
                      >
                        <SelectTrigger className={`w-full ${
                          isDarkTheme
                            ? "bg-gray-700 border-gray-600 text-white focus:ring-amber-500"
                            : "bg-white border-gray-300 focus:ring-amber-500"
                        }`}>
                          <SelectValue placeholder="Select a period" />
                        </SelectTrigger>
                        <SelectContent className={
                          isDarkTheme ? "bg-gray-800 border-gray-700 text-white" : ""
                        }>
                          <SelectGroup>
                            <SelectLabel>Periods</SelectLabel>
                            {sortedClassTime.map((item, index) => (
                              <SelectItem key={index} value={item.periods}>
                                {item.periods}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Subject Selection */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor={`subjectName-${period.id}`} className={isDarkTheme ? "text-gray-200" : "text-gray-700"}>
                        Select a Subject <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        required
                        value={period.subjectName}
                        onValueChange={(value) =>
                          handleChange(period.id, "subjectName", value)
                        }
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

                    {/* Teacher Selection */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor={`teacherName-${period.id}`} className={isDarkTheme ? "text-gray-200" : "text-gray-700"}>
                        Select a Teacher <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Select
                          required
                          value={period.teacherName}
                          onValueChange={(value) =>
                            handleChange(period.id, "teacherName", value)
                          }
                          className="flex-1"
                        >
                          <SelectTrigger className={`w-full ${
                            isDarkTheme
                              ? "bg-gray-700 border-gray-600 text-white focus:ring-amber-500"
                              : "bg-white border-gray-300 focus:ring-amber-500"
                          }`}>
                            <SelectValue placeholder="Select a Teacher" />
                          </SelectTrigger>
                          <SelectContent className={
                            isDarkTheme ? "bg-gray-800 border-gray-700 text-white" : ""
                          }>
                            <SelectGroup>
                              <SelectLabel>Teachers</SelectLabel>
                              {allTeachers.map((item, index) => (
                                <SelectItem key={index} value={item}>
                                  {capitalizeFirstLetter(item)}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          type="button"
                          className={`p-2 rounded-md transition-colors ${
                            isDarkTheme
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-red-500 hover:bg-red-600 text-white"
                          }`}
                          onClick={() => deletePeriod(period.id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Add Period Button */}
              <Button
                type="button"
                className={`flex items-center gap-2 mt-2 ${
                  isDarkTheme
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                } ${periods.length >= 8 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={addPeriod}
                disabled={periods.length >= 8}
              >
                <FaPlus className="text-sm" /> 
                {periods.length >= 8 ? 'Maximum Periods Reached' : 'Add Period'}
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
                    <span>Update Routine</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateClassRoutineComponent