import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { FaPlus, FaEdit, FaSearch, FaGraduationCap } from "react-icons/fa";
import { Loader2, FileSpreadsheet } from "lucide-react";
import { teacherRoutine } from "@/common/routines";

// UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Custom Components
import DeleteComponent from "@/components/DeleteData/DeleteComponent";
import PaginationComponent from "@/components/pagination/PaginationComponent";

const SetMarksForExamTypePage = () => {
  const { theme } = useTheme();
  const isDarkTheme = theme === "light"; // In your app "light" theme seems to be dark
  const dispatch = useDispatch();
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const role = useSelector((state) => state?.auth?.user);
  console.log("role ; ", role);

  // Redux data
  const examTypeData = useSelector((state) => state.examType.examType) || [];
  const allSubjects = useSelector((state) => state.subject.subjectNames) || [];
  const allClasses = useSelector((state) => state.class.classNames) || [
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
  ]; // Fallback if not in Redux

  // State for marks data
  const [marksData, setMarksData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // State for dynamic subject entries
  const [subjectEntries, setSubjectEntries] = useState([
    { id: 1, subject: "", theoryMarks: 0, projectMarks: 0, totalMarks: 0 },
  ]);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchExamType, setSearchExamType] = useState("_all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sample data (replace with actual API call)
  useEffect(() => {
    fetchMarksData();
  }, []);

  const fetchMarksData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://collage.vaisacademy.com/service6/api/schools/criteria/${schoolId}`
      );

      // console.log("Marks Data Response:", response);

      const transformedData = response.data.map((item) => ({
        id: item.id, // Assuming MongoDB adds _id field
        examType: item.examType,
        className: item.className,
        passingMarks: item.passingMark,
        subjects: item.subjects.map((subject) => ({
          subject: subject.subjectName,
          theoryMarks: subject.subjectMark,
          projectMarks: subject.projectMark,
          totalMarks: subject.fullMark,
        })),
      }));
      setMarksData(transformedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching marks data:", error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch marks data"
      );
      setIsLoading(false);
    }
  };

  // Handle adding new marks
  const handleAddMarks = async (data) => {
    try {
      const payload = {
        schoolId: schoolId,
        className: data[0].className,
        examType: data[0].examType,
        passingMark: parseFloat(data[0].passingMarks),
        subjects: data.map((item) => ({
          subjectName: item.subject,
          subjectMark: parseFloat(item.theoryMarks),
          projectMark: parseFloat(item.projectMarks),
          fullMark: parseFloat(item.totalMarks),
        })),
      };

      const response = await axios.post(
        `https://collage.vaisacademy.com/service6/api/schools/criteria/${schoolId}`,
        payload
      );

      // console.log("Add Marks Response:", response);

      if (response.data) {
        toast.success(`Marks structure added successfully!`);
        fetchMarksData(); // Refresh the data
        setAddDialogOpen(false);
        setSubjectEntries([
          {
            id: 1,
            subject: "",
            theoryMarks: 0,
            projectMarks: 0,
            totalMarks: 0,
          },
        ]);
      }
    } catch (error) {
      // console.error("Error adding marks:", error);
      toast.error(error?.response?.data || "Failed to add marks");
    }
  };

  // Handle updating marks
  const handleUpdateMarks = async (data) => {
    try {
      const payload = {
        schoolId: schoolId,
        className: data.className,
        examType: data.examType,
        passingMark: parseFloat(data.passingMarks),
        subjects: data.subjects.map((subject) => ({
          subjectName: subject.subject, // Fixed: was missing subjectName
          subjectMark: parseFloat(subject.theoryMarks) || 0, // Fixed: proper mapping
          projectMark: parseFloat(subject.projectMarks) || 0, // Fixed: proper mapping
          fullMark: parseFloat(subject.totalMarks) || 0, // Fixed: proper mapping
        })),
      };

      const response = await axios.put(
        `https://collage.vaisacademy.com/service6/api/schools/criteria/${data.id}/${schoolId}`,
        payload
      );

      if (response.data) {
        toast.success("Marks structure updated successfully!");
        fetchMarksData(); // Refresh the data
        setUpdateDialogOpen(false);
      }
    } catch (error) {
      toast.error(error?.response?.data || "Failed to update marks");
    }
  };

  // Handle deleting marks
  const handleDeleteMarks = (id) => {
    // This function will be passed to DeleteComponent
    // After successful deletion, update the state
    const updatedData = marksData.filter((item) => item.id !== id);
    setMarksData(updatedData);
  };

  // Filter data based on search terms
  const filteredData = marksData.filter((item) => {
    // console.log("Filtering item:", item);
    const matchesSearch =
      searchTerm === "" ||
      item?.subject?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      item?.examType?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      item?.className?.toLowerCase()?.includes(searchTerm?.toLowerCase());

    const matchesExamType =
      searchExamType === "" ||
      searchExamType === "_all" ||
      item.examType === searchExamType;

    return matchesSearch && matchesExamType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData?.length / rowsPerPage);
  const paginatedData = filteredData?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle opening update dialog
  const openUpdateDialog = (item, singleSubject = null) => {
    if (singleSubject) {
      // Editing a single subject
      const initialSubjects = [
        {
          id: 1,
          subject: singleSubject.subject,
          theoryMarks: singleSubject.theoryMarks,
          projectMarks: singleSubject.projectMarks,
          totalMarks: singleSubject.totalMarks,
        },
      ];

      setSelectedItem({
        id: item.id,
        examType: item.examType,
        className: item.className,
        passingMarks: item.passingMarks,
        editingMode: "single", // Flag to indicate single subject editing
      });
      setSubjectEntries(initialSubjects);
    } else {
      // Editing all subjects for this exam type/class combination
      const initialSubjects =
        item.subjects?.map((subject, index) => ({
          id: index + 1,
          subject: subject.subject,
          theoryMarks: subject.theoryMarks,
          projectMarks: subject.projectMarks,
          totalMarks: subject.totalMarks,
        })) || [];

      setSelectedItem({
        id: item.id,
        examType: item.examType,
        className: item.className,
        passingMarks: item.passingMarks,
        editingMode: "multiple", // Flag to indicate multiple subjects editing
      });
      setSubjectEntries(initialSubjects);
    }
    setUpdateDialogOpen(true);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkTheme ? "bg-[#0c1425] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center mb-4 sm:mb-0">
            <FaGraduationCap
              className={`mr-2 h-6 w-6 ${
                isDarkTheme ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
            <h1 className="text-2xl font-bold">Set Marks for Exam Types</h1>
          </div>
          { (role === "admin" || role === "edp")  && (
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className={`flex items-center gap-2 ${
                      isDarkTheme
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    } rounded-md shadow-md transition-all duration-300`}
                  >
                    <FaPlus className="text-sm" />
                    <span>Add New Marks Structure</span>
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className={`sm:max-w-[800px] max-w-[95%] rounded-xl ${
                    isDarkTheme
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-200"
                  } max-h-[90vh] overflow-y-auto`}
                >
                  <DialogHeader>
                    <DialogTitle
                      className={`text-xl font-bold pb-2 border-b flex items-center gap-2 ${
                        isDarkTheme
                          ? "text-white border-gray-700"
                          : "text-gray-800 border-gray-200"
                      }`}
                    >
                      <FileSpreadsheet
                        className={`${
                          isDarkTheme ? "text-indigo-400" : "text-indigo-600"
                        }`}
                      />
                      Add New Marks Structure
                    </DialogTitle>
                  </DialogHeader>

                  <div className="p-4">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const examType = formData.get("examType");
                        const className = formData.get("className");
                        const passingMarks =
                          parseInt(formData.get("passingMarks")) || 33;

                        // Create a new marks structure for each subject entry
                        const newItems = subjectEntries
                          .filter((entry) => entry.subject) // Only include entries with a subject selected
                          .map((entry) => ({
                            id:
                              Date.now().toString() +
                              Math.random().toString(36).substr(2, 5),
                            examType,
                            className,
                            subject: entry.subject,
                            theoryMarks: entry.theoryMarks,
                            projectMarks: entry.projectMarks,
                            totalMarks: entry.totalMarks,
                            passingMarks: passingMarks,
                            createdAt: new Date().toISOString().split("T")[0],
                          }));

                        if (newItems.length === 0) {
                          toast.error(
                            "Please add at least one subject with marks"
                          );
                          return;
                        }

                        handleAddMarks(newItems);
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Class Selection */}
                        <div className="flex flex-col gap-2">
                          <Label
                            htmlFor="className"
                            className={
                              isDarkTheme ? "text-gray-200" : "text-gray-700"
                            }
                          >
                            Select Class <span className="text-red-500">*</span>
                          </Label>
                          <Select name="className" required>
                            <SelectTrigger
                              className={`w-full ${
                                isDarkTheme
                                  ? "bg-gray-700 border-gray-600 text-white focus:ring-indigo-500"
                                  : "bg-white border-gray-300 focus:ring-indigo-500"
                              }`}
                            >
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent
                              className={
                                isDarkTheme
                                  ? "bg-gray-800 border-gray-700 text-white"
                                  : ""
                              }
                            >
                              <SelectGroup>
                                <SelectLabel>Classes</SelectLabel>
                                {allClasses.map((item, index) => (
                                  <SelectItem key={index} value={item}>
                                    {item}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Exam Type Selection */}
                        <div className="flex flex-col gap-2">
                          <Label
                            htmlFor="examType"
                            className={
                              isDarkTheme ? "text-gray-200" : "text-gray-700"
                            }
                          >
                            Select Exam Type{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Select name="examType" required>
                            <SelectTrigger
                              className={`w-full ${
                                isDarkTheme
                                  ? "bg-gray-700 border-gray-600 text-white focus:ring-indigo-500"
                                  : "bg-white border-gray-300 focus:ring-indigo-500"
                              }`}
                            >
                              <SelectValue placeholder="Select exam type" />
                            </SelectTrigger>
                            <SelectContent
                              className={
                                isDarkTheme
                                  ? "bg-gray-800 border-gray-700 text-white"
                                  : ""
                              }
                            >
                              <SelectGroup>
                                <SelectLabel>Exam Type</SelectLabel>
                                {examTypeData?.map((item, index) => (
                                  <SelectItem
                                    key={index}
                                    value={item.examTypeName}
                                  >
                                    {item.examTypeName}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Global Passing Marks */}
                      <div className="mb-6">
                        <div className="flex flex-col gap-2">
                          <Label
                            htmlFor="passingMarks"
                            className={
                              isDarkTheme ? "text-gray-200" : "text-gray-700"
                            }
                          >
                            Global Passing Marks{" "}
                            <span className="text-red-500">*</span>
                            <span className="text-xs ml-2 font-normal">
                              (This will be applied to all subjects)
                            </span>
                          </Label>
                          <Input
                            id="passingMarks"
                            name="passingMarks"
                            type="number"
                            min="0"
                            max="100"
                            defaultValue="33"
                            className={`w-full ${
                              isDarkTheme
                                ? "bg-gray-700 border-gray-600 text-white focus:ring-indigo-500"
                                : "bg-white border-gray-300 focus:ring-indigo-500"
                            }`}
                            required
                          />
                        </div>
                      </div>

                      {/* Subject Entries Section */}
                      <div
                        className={`p-4 rounded-lg mb-6 ${
                          isDarkTheme ? "bg-gray-700" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3
                            className={`text-lg font-medium ${
                              isDarkTheme ? "text-white" : "text-gray-800"
                            }`}
                          >
                            Subject Marks Distribution
                          </h3>
                          <Button
                            type="button"
                            onClick={() => {
                              const newId =
                                subjectEntries.length > 0
                                  ? Math.max(
                                      ...subjectEntries.map((entry) => entry.id)
                                    ) + 1
                                  : 1;
                              setSubjectEntries([
                                ...subjectEntries,
                                {
                                  id: newId,
                                  subject: "",
                                  theoryMarks: 0,
                                  projectMarks: 0,
                                  totalMarks: 0,
                                },
                              ]);
                            }}
                            className={`${
                              isDarkTheme
                                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                : "bg-indigo-500 hover:bg-indigo-600 text-white"
                            }`}
                            size="sm"
                          >
                            <FaPlus className="mr-1" /> Add Subject
                          </Button>
                        </div>

                        {/* Column Headers */}
                        <div className="grid grid-cols-12 gap-2 mb-2 font-medium">
                          <div className="col-span-4">Subject</div>
                          <div className="col-span-2 text-center">
                            Theory Marks
                          </div>
                          <div className="col-span-2 text-center">
                            Project Marks
                          </div>
                          <div className="col-span-2 text-center">
                            Total Marks
                          </div>
                          <div className="col-span-2 text-center">Actions</div>
                        </div>

                        {/* Subject Entry Rows */}
                        {subjectEntries.map((entry, index) => (
                          <div
                            key={entry.id}
                            className={`grid grid-cols-12 gap-2 mb-3 p-2 rounded ${
                              isDarkTheme ? "bg-gray-800" : "bg-white"
                            }`}
                          >
                            {/* Subject Selection */}
                            <div className="col-span-4">
                              <Select
                                value={entry.subject}
                                onValueChange={(value) => {
                                  const updatedEntries = [...subjectEntries];
                                  updatedEntries[index].subject = value;
                                  setSubjectEntries(updatedEntries);
                                }}
                                required
                              >
                                <SelectTrigger
                                  className={`w-full ${
                                    isDarkTheme
                                      ? "bg-gray-700 border-gray-600 text-white"
                                      : "bg-white border-gray-300"
                                  }`}
                                >
                                  <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                                <SelectContent
                                  className={
                                    isDarkTheme
                                      ? "bg-gray-800 border-gray-700 text-white"
                                      : ""
                                  }
                                >
                                  <SelectGroup>
                                    {allSubjects
                                      .filter(
                                        (subject) =>
                                          !subjectEntries
                                            .filter((e, i) => i !== index) // Exclude current entry
                                            .map((e) => e.subject)
                                            .includes(subject)
                                      )
                                      .map((item, idx) => (
                                        <SelectItem key={idx} value={item}>
                                          {item}
                                        </SelectItem>
                                      ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Theory Marks */}
                            <div className="col-span-2">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={entry.theoryMarks}
                                onChange={(e) => {
                                  const theoryValue =
                                    parseInt(e.target.value) || 0;
                                  const updatedEntries = [...subjectEntries];
                                  updatedEntries[index].theoryMarks =
                                    theoryValue;
                                  updatedEntries[index].totalMarks =
                                    theoryValue +
                                    updatedEntries[index].projectMarks;
                                  setSubjectEntries(updatedEntries);
                                }}
                                className={`w-full ${
                                  isDarkTheme
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-white border-gray-300"
                                }`}
                                required
                              />
                            </div>

                            {/* Project Marks */}
                            <div className="col-span-2">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={entry.projectMarks}
                                onChange={(e) => {
                                  const projectValue =
                                    parseInt(e.target.value) || 0;
                                  const updatedEntries = [...subjectEntries];
                                  updatedEntries[index].projectMarks =
                                    projectValue;
                                  updatedEntries[index].totalMarks =
                                    updatedEntries[index].theoryMarks +
                                    projectValue;
                                  setSubjectEntries(updatedEntries);
                                }}
                                className={`w-full ${
                                  isDarkTheme
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-white border-gray-300"
                                }`}
                                required
                              />
                            </div>

                            {/* Total Marks (Auto-calculated) */}
                            <div className="col-span-2">
                              <div
                                className={`w-full p-2 rounded-md border text-center ${
                                  isDarkTheme
                                    ? "bg-gray-800 border-gray-600 text-indigo-400"
                                    : "bg-gray-100 border-gray-300 text-indigo-600"
                                }`}
                              >
                                {entry.totalMarks}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="col-span-2 flex justify-center items-center">
                              <button
                                type="button"
                                onClick={() => {
                                  if (subjectEntries.length > 1) {
                                    setSubjectEntries(
                                      subjectEntries.filter(
                                        (e) => e.id !== entry.id
                                      )
                                    );
                                  } else {
                                    toast.error(
                                      "At least one subject is required"
                                    );
                                  }
                                }}
                                className={`p-1 rounded-full ${
                                  isDarkTheme
                                    ? "bg-red-700 hover:bg-red-800 text-white"
                                    : "bg-red-500 hover:bg-red-600 text-white"
                                }`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Submit Button */}
                      <div
                        className={`flex justify-end gap-4 mt-6 pt-4 border-t ${
                          isDarkTheme ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setAddDialogOpen(false);
                            setSubjectEntries([
                              {
                                id: 1,
                                subject: "",
                                theoryMarks: 0,
                                projectMarks: 0,
                                totalMarks: 0,
                              },
                            ]);
                          }}
                          className={`${
                            isDarkTheme
                              ? "bg-gray-700 text-white hover:bg-gray-600 border-gray-600"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300"
                          }`}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all ${
                            isDarkTheme
                              ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                          }`}
                        >
                          Save Marks Structure
                        </Button>
                      </div>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            )}
        </div>

        {/* Search and Filter Section */}
        <div
          className={`p-4 rounded-lg mb-6 ${
            isDarkTheme
              ? "bg-gray-800"
              : "bg-white shadow-sm border border-gray-200"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isDarkTheme ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <Input
                  type="text"
                  placeholder="Search by  class or exam type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 ${
                    isDarkTheme
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-indigo-500"
                      : "bg-white border-gray-300 focus:ring-indigo-500"
                  }`}
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select value={searchExamType} onValueChange={setSearchExamType}>
                <SelectTrigger
                  className={`w-full ${
                    isDarkTheme
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-indigo-500"
                      : "bg-white border-gray-300 focus:ring-indigo-500"
                  }`}
                >
                  <SelectValue placeholder="Filter by exam type" />
                </SelectTrigger>
                <SelectContent
                  className={
                    isDarkTheme ? "bg-gray-800 border-gray-700 text-white" : ""
                  }
                >
                  <SelectGroup>
                    <SelectItem value="_all">All Exam Types</SelectItem>
                    {examTypeData?.map((item, index) => (
                      <SelectItem key={index} value={item.examTypeName}>
                        {item.examTypeName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSearchExamType("_all");
                }}
                className={`${
                  isDarkTheme
                    ? "bg-gray-700 text-white hover:bg-gray-600 border-gray-600"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300"
                }`}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Marks Data Table */}
        <div
          className={`rounded-lg overflow-hidden ${
            isDarkTheme
              ? "bg-gray-800"
              : "bg-white shadow-sm border border-gray-200"
          }`}
        >
          <Table>
            <TableHeader className={isDarkTheme ? "bg-gray-800" : "bg-gray-50"}>
              <TableRow>
                {/* <TableHead
                  className={`font-semibold ${
                    isDarkTheme ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Sl No.
                </TableHead> */}
                <TableHead
                  className={`font-semibold ${
                    isDarkTheme ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Exam Type
                </TableHead>
                <TableHead
                  className={`font-semibold ${
                    isDarkTheme ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Class
                </TableHead>
                <TableHead
                  className={`font-semibold ${
                    isDarkTheme ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Subject
                </TableHead>
                <TableHead
                  className={`font-semibold text-center ${
                    isDarkTheme ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Theory Marks
                </TableHead>
                <TableHead
                  className={`font-semibold text-center ${
                    isDarkTheme ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Project Marks
                </TableHead>
                <TableHead
                  className={`font-semibold text-center ${
                    isDarkTheme ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Total Marks
                </TableHead>
                <TableHead
                  className={`font-semibold text-center ${
                    isDarkTheme ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Passing Marks
                </TableHead>
                <TableHead
                  className={`font-semibold text-center ${
                    isDarkTheme ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Created Date
                </TableHead>
                <TableHead
                  className={`font-semibold text-right ${
                    isDarkTheme ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <Loader2
                        className={`h-8 w-8 animate-spin ${
                          isDarkTheme ? "text-indigo-400" : "text-indigo-600"
                        }`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className={`text-center py-8 ${
                      isDarkTheme ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No marks data found. Add your first marks structure!
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) =>
                  item.subjects.map((subject, subIndex) => (
                    <TableRow
                      key={`${item.id}-${subIndex}`}
                      className={
                        isDarkTheme
                          ? "border-gray-700 hover:bg-gray-800/50"
                          : "hover:bg-gray-50"
                      }
                    >
                      {/* <TableCell
                        className={`text-center font-medium ${
                          isDarkTheme ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {(currentPage - 1) * rowsPerPage + subIndex + 1}
                      </TableCell> */}
                      <TableCell className={isDarkTheme ? "text-white" : ""}>
                        {item.examType}
                      </TableCell>
                      <TableCell className={isDarkTheme ? "text-white" : ""}>
                        {item.className}
                      </TableCell>
                      <TableCell className={isDarkTheme ? "text-white" : ""}>
                        {subject.subject}
                      </TableCell>
                      <TableCell
                        className={`text-center ${
                          isDarkTheme ? "text-white" : ""
                        }`}
                      >
                        {subject.theoryMarks}
                      </TableCell>
                      <TableCell
                        className={`text-center ${
                          isDarkTheme ? "text-white" : ""
                        }`}
                      >
                        {subject.projectMarks}
                      </TableCell>
                      <TableCell
                        className={`text-center font-medium ${
                          isDarkTheme ? "text-indigo-400" : "text-indigo-600"
                        }`}
                      >
                        {subject.totalMarks}
                      </TableCell>
                      <TableCell
                        className={`text-center ${
                          isDarkTheme ? "text-white" : ""
                        }`}
                      >
                        {item.passingMarks}
                      </TableCell>
                      <TableCell
                        className={`text-center ${
                          isDarkTheme ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {new Date().toISOString().split("T")[0]}{" "}
                        {/* You might want to add createdAt to your schema */}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* <Button
                            onClick={() =>
                              openUpdateDialog(item, {
                                subject: subject.subject,
                                theoryMarks: subject.theoryMarks,
                                projectMarks: subject.projectMarks,
                                totalMarks: subject.totalMarks,
                              })
                            }
                            size="sm"
                            variant="outline"
                            className={`p-2 ${
                              isDarkTheme
                                ? "bg-gray-700 hover:bg-gray-600 text-indigo-400 border-gray-600"
                                : "bg-gray-100 hover:bg-gray-200 text-indigo-600 border-gray-300"
                            }`}
                          >
                            <FaEdit className="h-4 w-4" />
                          </Button> */}

                          <Button
                            onClick={() => openUpdateDialog(item)} // Pass the entire item instead of individual subject
                            size="sm"
                            variant="outline"
                            className={`p-2 ${
                              isDarkTheme
                                ? "bg-gray-700 hover:bg-gray-600 text-indigo-400 border-gray-600"
                                : "bg-gray-100 hover:bg-gray-200 text-indigo-600 border-gray-300"
                            }`}
                          >
                            <FaEdit className="h-4 w-4" />
                          </Button>

                          <DeleteComponent
                            id={item.id}
                            name={`${subject.subject} marks for ${item.examType}`}
                            deletePath={`https://collage.vaisacademy.com/service6/api/schools/criteria/${item.id}/${schoolId}`}
                            onSuccess={() => {
                              handleDeleteMarks(item.id);
                              fetchMarksData();
                            }}
                            buttonVariant="destructive"
                            buttonSize="sm"
                            buttonClassName={`p-2 ${
                              isDarkTheme
                                ? "bg-red-700 hover:bg-red-800 text-white"
                                : "bg-red-500 hover:bg-red-600 text-white"
                            }`}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!isLoading && filteredData.length > 0 && (
          <div className="mt-6">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={setRowsPerPage}
              totalItems={filteredData.length}
              isDarkTheme={isDarkTheme}
            />
          </div>
        )}
      </div>

      {/* Update Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent
          className={`sm:max-w-[800px] max-w-[95%] rounded-xl ${
            isDarkTheme
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-200"
          } max-h-[90vh] overflow-y-auto`}
        >
          <DialogHeader>
            <DialogTitle
              className={`text-xl font-bold pb-2 border-b flex items-center gap-2 ${
                isDarkTheme
                  ? "text-white border-gray-700"
                  : "text-gray-800 border-gray-200"
              }`}
            >
              <FaEdit
                className={isDarkTheme ? "text-indigo-400" : "text-indigo-600"}
              />
              Update Marks Structure
            </DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  // Get passing marks from form
                  const formData = new FormData(e.target);
                  const passingMarks = formData.get("passingMarks");

                  // Validate that all subjects have required data
                  const validSubjects = subjectEntries.filter(
                    (entry) =>
                      entry.subject &&
                      entry.subject.trim() !== "" &&
                      entry.theoryMarks !== undefined &&
                      entry.projectMarks !== undefined &&
                      entry.totalMarks !== undefined
                  );

                  if (validSubjects.length === 0) {
                    toast.error(
                      "Please add at least one subject with valid marks"
                    );
                    return;
                  }

                  // Prepare the data object
                  const updatedItem = {
                    id: selectedItem.id,
                    className: selectedItem.className,
                    examType: selectedItem.examType,
                    passingMarks: parseFloat(passingMarks) || 33,
                    subjects: validSubjects.map((entry) => ({
                      subject: entry.subject,
                      theoryMarks: parseFloat(entry.theoryMarks) || 0,
                      projectMarks: parseFloat(entry.projectMarks) || 0,
                      totalMarks: parseFloat(entry.totalMarks) || 0,
                    })),
                  };

                  handleUpdateMarks(updatedItem);
                }}
              >
                {/* Static Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex flex-col gap-2">
                    <Label>Class</Label>
                    <p className={`font-medium p-2 bg-gray-700 rounded-md  ${
                        isDarkTheme
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      } `}>
                      {selectedItem.className}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Exam Type</Label>
                    <p className={`font-medium p-2 bg-gray-700 rounded-md ${
                        isDarkTheme
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      }`}>
                      {selectedItem.examType}
                    </p>
                  </div>
                </div>

                {/* Global Passing Marks */}
                <div className="mb-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="passingMarks">
                      Global Passing Marks{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="passingMarks"
                      name="passingMarks"
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={selectedItem.passingMarks}
                      className={`w-full ${
                        isDarkTheme
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      }`}
                      required
                    />
                  </div>
                </div>

                {/* Subject Marks Distribution */}
                <div
                  className={`p-4 rounded-lg mb-6 ${
                    isDarkTheme ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                      Subject Marks Distribution
                    </h3>
                    <Button
                      type="button"
                      onClick={() => {
                        const newId =
                          Math.max(...subjectEntries.map((e) => e.id)) + 1;
                        setSubjectEntries([
                          ...subjectEntries,
                          {
                            id: newId,
                            subject: "",
                            theoryMarks: 0,
                            projectMarks: 0,
                            totalMarks: 0,
                          },
                        ]);
                      }}
                      className={
                        isDarkTheme ? "bg-indigo-600 hover:bg-indigo-700" : ""
                      }
                      size="sm"
                    >
                      <FaPlus className="mr-1" /> Add Subject
                    </Button>
                  </div>

                  {/* Subject Entries Table */}
                  <div className="grid grid-cols-12 gap-2 mb-2 font-medium">
                    <div className="col-span-4">Subject</div>
                    <div className="col-span-2 text-center">Theory Marks</div>
                    <div className="col-span-2 text-center">Project Marks</div>
                    <div className="col-span-2 text-center">Total Marks</div>
                    <div className="col-span-2 text-center">Actions</div>
                  </div>

                  {subjectEntries?.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`grid grid-cols-12 gap-2 mb-3 p-2 rounded ${
                        isDarkTheme ? "bg-gray-800" : "bg-white"
                      }`}
                    >
                      <div className="col-span-4">
                        <Select
                          value={entry.subject}
                          onValueChange={(value) => {
                            const updated = [...subjectEntries];
                            updated[index] = {
                              ...updated[index],
                              subject: value,
                            };
                            setSubjectEntries(updated);
                          }}
                        >
                          <SelectTrigger
                            className={`w-full ${
                              isDarkTheme
                                ? "bg-gray-700 border-gray-600 text-white"
                                : ""
                            }`}
                          >
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {allSubjects
                                ?.filter(
                                  (subject) =>
                                    !subjectEntries
                                      ?.filter((e, i) => i !== index)
                                      ?.map((e) => e.subject)
                                      ?.includes(subject) ||
                                    subject === entry.subject
                                )
                                ?.map((item, idx) => (
                                  <SelectItem key={idx} value={item}>
                                    {item}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="col-span-2">
                        <Input
                          type="number"
                          min="0"
                          value={entry.theoryMarks}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            const updated = [...subjectEntries];
                            updated[index] = {
                              ...updated[index],
                              theoryMarks: value,
                              totalMarks:
                                value + (updated[index].projectMarks || 0),
                            };
                            setSubjectEntries(updated);
                          }}
                          className={
                            isDarkTheme
                              ? "bg-gray-700 border-gray-600 text-white"
                              : ""
                          }
                        />
                      </div>

                      <div className="col-span-2">
                        <Input
                          type="number"
                          min="0"
                          value={entry.projectMarks}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            const updated = [...subjectEntries];
                            updated[index] = {
                              ...updated[index],
                              projectMarks: value,
                              totalMarks:
                                (updated[index].theoryMarks || 0) + value,
                            };
                            setSubjectEntries(updated);
                          }}
                          className={
                            isDarkTheme
                              ? "bg-gray-700 border-gray-600 text-white"
                              : ""
                          }
                        />
                      </div>

                      <div className="col-span-2">
                        <div
                          className={`p-2 text-center rounded ${
                            isDarkTheme
                              ? "bg-gray-700 text-indigo-400"
                              : "bg-gray-100"
                          }`}
                        >
                          {entry.totalMarks}
                        </div>
                      </div>

                      <div className="col-span-2 flex justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (subjectEntries.length > 1) {
                              setSubjectEntries(
                                subjectEntries.filter((e) => e.id !== entry.id)
                              );
                            } else {
                              toast.error("At least one subject is required");
                            }
                          }}
                          className={`p-1 rounded-full ${
                            isDarkTheme
                              ? "bg-red-700 hover:bg-red-800"
                              : "bg-red-500 hover:bg-red-600"
                          } text-white`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div
                  className={`flex justify-end gap-4 pt-4 border-t ${
                    isDarkTheme ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setUpdateDialogOpen(false)}
                    className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Update All Marks
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SetMarksForExamTypePage;
