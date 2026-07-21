import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaTrash, FaPlus } from "react-icons/fa";
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
import routineUrlApi from "@/common/routines";

const AddNewClassRoutines = () => {
  const allClass = useSelector((state) => state.class.classNames) || [];
  const allSection = useSelector((state) => state.section.sectionNames) || [];
  const allSubject = useSelector((state) => state.subject.subjectNames) || [];
  const classTime = useSelector((state) => state.classTime.classTime) || [];
  // console.log("class : ", classTime);
  const allTeachers = useSelector((state) => state.teacherInfo.teachersNames) || [];
  const [periods, setPeriods] = useState([
    { id: Date.now(), periodName: "", subjectName: "", teacherName: "" },
  ]);

  const [allData, setAllData] = useState({
    // id: Date.now(),
    className: "",
    section: "",
    day: "",
    periods: [],
  });

  // console.log(Date.now())

  // Add new period to the periods state
  const addPeriod = () => {
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

  // // Handle form submission
  // const handleSubmit = async (e) => {
  //   try {
  //     e.preventDefault();
  //     const updatedData = {
  //       ...allData,
  //       periods: [...periods], // Include periods dynamically
  //     };
  //     setAllData(updatedData);
  
  //     console.log("updatedData : ", updatedData);
  //     // console.log("alldata : ", allData);
  
  //     const response = await axios.post(
  //       "http://192.168.0.141:8084/api/v1/routine",
  //       updatedData,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     // console.log("add response : ", response);
  
  //     if (response) {
  //       toast.success( response.data.message || "Class Routine added successfully!");
  //       console.log("response from class routine page from server: ", response);
  //     }
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || "Failed to add the data");
  //   }

  //   // console.log("Class Routine Submitted:", allData);
    
  // };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
  
      // Create a copy of periods without the id field
      const filteredPeriods = periods.map(({ id, ...rest }) => rest);
  
      const updatedData = {
        ...allData,
        periods: filteredPeriods, // Use the filtered periods without id
      };
  
      // console.log("updatedData : ", updatedData);
  
      const response = await axios.post(
        `${routineUrlApi.getRoutine.url}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response) {
        toast.success(response.data.message || "Class Routine added successfully!");
        // console.log("Response from server: ", response);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add the data");
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
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-white hover:text-[#242424] bg-[#452B90] hover:bg-[#c29732] hidden sm:flex ">
          <span>
            <FaPlus />
          </span>
          <span>Add Class Routine</span>
        </Button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-[60%] max-w-[80%]`}>
        <DialogHeader>
          <DialogTitle className="border-b-[1px] border-b-[rgba(0,0,0,0.3)] pb-2">
            Add New Class Routine
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <form onSubmit={handleSubmit}>
            {/* Static Fields */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Class Selection */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="className">Select a Class</Label>
                <Select
                  onValueChange={(value) =>
                    setAllData({ ...allData, className: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
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
                <Label htmlFor="sectionName">Select a Section</Label>
                <Select
                  onValueChange={(value) =>
                    setAllData({ ...allData, section: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a section" />
                  </SelectTrigger>
                  <SelectContent>
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
                <Label htmlFor="sectionName">Select a Day</Label>
                <Select
                  onValueChange={(value) =>
                    setAllData({ ...allData, day: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent>
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
            <div>
              {periods.map((period) => (
                <div
                  key={period.id}
                  className="grid grid-cols-4 gap-4 items-center mb-2"
                >
                  {/* Period Selection */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="periodName">Select a Period</Label>
                    <Select
                      onValueChange={(value) =>
                        handleChange(period.id, "periodName", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Periods</SelectLabel>
                          {sortedClassTime.map((item, index) => (
                            // console.log(item),
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
                    <Label htmlFor="subjectName">Select a Subject</Label>
                    <Select
                      onValueChange={(value) =>
                        handleChange(period.id, "subjectName", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
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
                <Label htmlFor="teacherName">Select a Teacher</Label>
                <Select
                   onValueChange={(value) =>
                    handleChange(period.id, "teacherName", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Teachers</SelectLabel>
                      {allTeachers.map((item, index) => (
                        <SelectItem key={index+12} value={item}>
                          {capitalizeFirstLetter(item)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
                  <Button
                    type="button"
                    className="bg-red-500 text-white p-2 rounded w-1/4 mt-6"
                    onClick={() => deletePeriod(period.id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add Period Button */}
            <Button
              type="button"
              className="bg-blue-500 text-white flex items-center px-4 py-2 mb-4"
              onClick={addPeriod}
            >
              <FaPlus className="mr-2" /> Add Period
            </Button>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2"
              >
                Add Routine
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewClassRoutines;
