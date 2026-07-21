import React, { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

const AddNewExamRoutines = () => {
  const allClass = useSelector((state) => state.class.classNames);
  const allSubject = useSelector((state) => state.subject.subjectNames);
  
  const dispatch = useDispatch();
  
  const [allData, setAllData] = useState({
    id: Date.now(),
    className: "",
    subjects: [],
  });

  const [rows, setRows] = useState([
    { subjectName: "", examDate: "", startTime: "", endTime: "" },
  ]);

  // Handler to add a new row
  const addRow = () => {
    setRows([
      ...rows,
      { subjectName: "", examDate: "", startTime: "", endTime: "" },
    ]);
  };

  // Handler to delete a row
  const deleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  // Handler to update row data
  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  // Form submit handler
  const handleSubmit = async(e) => {
    e.preventDefault();
    
    try {
      const updateData= {
        ...allData,
        subjects: [...rows],
      }
      // console.log("updateData : ", updateData);
     const response =await axios.post("http://192.168.0.141:8084/api/exam-routines", updateData, {
      headers: {
        "Content-Type": "application/json",
      },
     });
    //  console.log("response : ", response);
     if(response) {
      toast.success(response.data.message || "Class Routine added successfully!");
     }
    } catch (error) {
      // console.log("error : ", error);
      toast.error(error?.response?.data?.message || "Failed to add the data");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-white  hover:text-[#242424] bg-[#452B90] hover:bg-[#c29732] hidden sm:flex ">
          <span >
            <FaPlus />
          </span>
          Add New Exam Routine
        </Button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-[40%] max-w-[80%]`}>
        <DialogHeader>
          <DialogTitle className="border-b-[1px] border-b-[rgba(0,0,0,0.3)] pb-2">
            Add New Exam Routine
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
          <form onSubmit={handleSubmit}>
            {/* Class Section */}
            <div className="mb-4">
              <label htmlFor="class" className="block text-sm font-medium">
                Class<span className="text-red-500">*</span>
              </label>
              <select
                id="class"
                className="w-full border rounded p-2 mt-1"
                required
                value={allData.className}
                onChange={(e) =>
                  setAllData({ ...allData, className: e.target.value })
                }
              >
                <option value="" disabled>Select Class</option>
                {allClass.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
                {/* Add more class options here */}
              </select>
            </div>

            {/* Rows for Exam Routine */}
            {rows.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-4 items-center mb-4"
              >
                {/* Subject */}
                <div className="col-span-3">
                  <label className="block text-sm font-medium">
                    Subject<span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full border rounded p-2 mt-1"
                    value={row.subjectName}
                    onChange={(e) =>
                      handleChange(index, "subjectName", e.target.value)
                    }
                    required
                  >
                    <option value="">Select Subject</option>
                    {allSubject.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                    {/* Add more subjects here */}
                  </select>
                </div>

                {/* Exam Date */}
                <div className="col-span-3">
                  <label className="block text-sm font-medium">
                    Exam Date<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full border rounded p-2 mt-1"
                    value={row.examDate}
                    onChange={(e) =>
                      handleChange(index, "examDate", e.target.value)
                    }
                    required
                  />
                </div>

                {/* Start Time */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium">
                    Start Time<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    className="w-full border rounded p-2 mt-1"
                    value={row.startTime}
                    onChange={(e) =>
                      handleChange(index, "startTime", e.target.value)
                    }
                    required
                  />
                </div>

                {/* End Time */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium">
                    End Time<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    className="w-full border rounded p-2 mt-1"
                    value={row.endTime}
                    onChange={(e) =>
                      handleChange(index, "endTime", e.target.value)
                    }
                    required
                  />
                </div>

                {/* Delete Button */}
                <div className="col-span-2 mt-6 flex justify-center">
                  <button
                    type="button"
                    className="bg-red-500 text-white p-2 rounded"
                    onClick={() => deleteRow(index)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}

            {/* Add Row Button */}
            <div className="text-left mb-4">
              <button
                type="button"
                className="bg-purple-600 text-white px-4 py-2 rounded"
                onClick={addRow}
              >
                + Add Another Exam
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded"
              >
                Save exam Routines
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewExamRoutines;
