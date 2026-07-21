import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { ImCross } from "react-icons/im";
import { LiaEdit } from "react-icons/lia";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import axios from "axios";
import { academicUrlApi } from "@/common";
import DeleteComponent from "@/components/DeleteData/DeleteComponent";
import { toast } from "sonner";
import assignmentUrlApi from "@/common/assignment";
import { useFetchAllSubject } from "@/helper/AllFetchFunction";
import { setSubject } from "@/utils/academic/subjectSlice";

const initialForm = {
  className: "",
  section: "",
  subject: "",
  title: "",
  description: "",
  assignmentDate: "",
  dueDate: "",
  attachment: null,
};

const Assignment = () => {
  // Add state for search class dropdown
  const [searchClassOptions, setSearchClassOptions] = useState([]);
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user);

  const fetchSubjectData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${academicUrlApi.getAllSubject.url}/${schoolId}` 
      );
      console.log("subject : ",response);
      if (response) {
        dispatch(setSubject(response.data.data));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjectData();
  }, []);

  // console.log("reole form assinmend : ",role);

  const [searchClass, setSearchClass] = useState("");
  const [searchSectionOptions, setSearchSectionOptions] = useState([]);
  const [searchSection, setSearchSection] = useState("");

  // console.log("all classesesdklj  : ",searchClassOptions)

  const subjectOptions = useSelector((state) => state.subject.subject) || [];
  // console.log("tahole jokho bikri korchi tokhon subject aschena : ",subjectOptions);
  // console.log(useSelector((state) => state.teacherInfo.teacherInfo) || []);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const userDetails = useSelector((state) => state.auth.userDetails);
  const schoolId = useSelector((state) => state.auth.schoolId);
  const teacherId = userDetails?.id;
  const { theme } = useTheme();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);

  // Add these states for class and section options
  const [classOptions, setClassOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);

  // console.log("sectionOptions  : ",classOptions)

  const [assignments, setAssignments] = useState([]);

  // Fetch class list for search dropdown on mount
  React.useEffect(() => {
    const fetchSearchClasses = async () => {
      try {
        const classResponse = await axios.get(
          `${academicUrlApi.getAllClass.url}/all/${schoolId}`
        
      );
// console.log("class : ",classResponse)
        setSearchClassOptions(
          Array.isArray(classResponse.data) ? classResponse.data : []
        );
      } catch (error) {
        setSearchClassOptions([]);
      }
    };
    const fetchSearchSections = async () => {
      try {
        const sectionResponse = await axios.get(
          `${academicUrlApi.getAllSection.url}/all/${schoolId}`
        );
        // Fix: Make sure we're getting the correct data structure
        const sections = Array.isArray(sectionResponse.data) ? sectionResponse.data : [];
        // console.log("Fetched sections:", sections);
        setSearchSectionOptions(sections);
      } catch (error) {
        // console.error("Error fetching sections:", error);
        setSearchSectionOptions([]);
      }
    };
    fetchSearchClasses();
    fetchSearchSections();
  }, []);

  const handleSearchAssignments = async () => {
    if (!schoolId || !searchClass || !searchSection) {
      toast.error("Please select class and section to search!");
      return;
    }
    try {
      const response = await axios.get(
        `${assignmentUrlApi.getAllAssignment.url}/school/${schoolId}/class/${searchClass}/section/${searchSection}`
      );
      setAssignments(
        Array.isArray(response.data?.data) ? response.data?.data : []
      );
    } catch (error) {
      setAssignments([]);
      toast.error("Select correct class and section!");
    }
  };

  
  // console.log(assignments);
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Get class and section lists from Redux
  const allClass = useSelector((state) => state.class.classNames) || [];
  const allSection = useSelector((state) => state.section.sectionNames) || [];
  

  const [editAssignment, setEditAssignment] = useState(null); // Track assignment being edited

  // Open modal for creating a new assignment
  const handleOpenModal = async () => {
    setForm(initialForm);
    setEditAssignment(null);
    try {
      const classResponse = await axios.get(
        `${academicUrlApi.getAllClass.url}/all/${schoolId}`
      );
      setClassOptions(
        Array.isArray(classResponse.data) ? classResponse.data : []
      );
    } catch (error) {
      setClassOptions([]);
    }
    setSectionOptions([]);
    setShowModal(true);
  };

  // Open modal for editing an assignment
  const openEditModal = async (assignment) => {
    setEditAssignment(assignment);
    setForm({
      className: assignment.className || "",
      section: assignment.section || "",
      subject: assignment.subject || "",
      title: assignment.title || "",
      description: assignment.description || "",
      assignmentDate: assignment.assignmentDate || "",
      dueDate: assignment.dueDate || "",
      attachment: null, // File input is always null initially
    });
    try {
      const classResponse = await axios.get(
        `${academicUrlApi.getAllClass.url}/all/${schoolId}`
      );
      setClassOptions(
        Array.isArray(classResponse.data) ? classResponse.data : []
      );
    } catch (error) {
      setClassOptions([]);
    }
    setSectionOptions([]);
    setShowModal(true);
  };

  // Fetch sections when className changes
  React.useEffect(() => {
    const fetchSections = async () => {
      if (!form.className) {
        setSectionOptions([]);
        return;
      }
      try {
        const sectionResponse = await axios.get(
          `${academicUrlApi.getAllSection.url}/all/${schoolId}`
        );
        // const sectionResponse = await axios.get("http://192.168.0.156:8081/api/v1/Academic/sections");
        setSectionOptions(
          Array.isArray(sectionResponse.data) ? sectionResponse.data : []
        );
      } catch (error) {
        setSectionOptions([]);
      }
    };
    fetchSections();
  }, [form.className, schoolId]);

  const handleCloseModal = () => {
    setShowModal(false);
    setEditAssignment(null);
  };

  const fetchAssignments = async () => {
    try {
      // const response = await axios.get("http://192.168.0.156:8089/api/assignments/teacher/67dd14e1286edb6fe68c0f6c");
      const response = await axios.get(
        `${assignmentUrlApi.getAllAssignment.url}/teacher/${teacherId}`
      );
      // setAssignments(Array.isArray(response.data?.data) ? response.data?.data : []);
      let data = Array.isArray(response.data?.data) ? response.data?.data : [];
      data = data.sort(
        (a, b) => new Date(b.assignmentDate) - new Date(a.assignmentDate)
      );
      setAssignments(data);
    } catch (error) {
      setAssignments([]);
      // console.error("Error fetching assignments:", error);
    }
  };

  React.useEffect(() => {
    fetchAssignments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const teacherId = userDetails?.id || "";
    const teacherName = userDetails?.teachersName || "";
    const missingFields = [];
    
    if (!schoolId) missingFields.push("School ID");
    if (!teacherId) missingFields.push("Teacher ID");
    if (!teacherName) missingFields.push("Teacher Name");
    if (!form.className) missingFields.push("Class Name");
    if (!form.section) missingFields.push("Section");
    if (!form.subject) missingFields.push("Subject");
    if (!form.title) missingFields.push("Title");
    if (!form.description) missingFields.push("Description");
    if (!form.assignmentDate) missingFields.push("Assignment Date");
    
    if (missingFields.length > 0) {
      toast.error(`Please fill the following required fields: ${missingFields.join(", ")}`);
      return;
    }
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("schoolId", schoolId);
      payload.append("teacherId", String(teacherId));
      payload.append("teacherName", String(teacherName));
      payload.append("className", String(form.className));
      payload.append("section", String(form.section));
      payload.append("subject", String(form.subject));
      payload.append("title", String(form.title));
      payload.append("description", String(form.description));
      payload.append("assignmentDate", String(form.assignmentDate));
      payload.append("dueDate", String(form.dueDate));
      if (form.attachment) {
        payload.append("attachment", form.attachment);
      }

      // Only Add mode: send POST request
      await axios.post(
        // "http://192.168.0.156:8089/api/assignments",
        `${assignmentUrlApi.postAssignment.url}`,
        payload
      );
      // toast.success("Assignment created successfully!", {
      toast.success(`Assignment created successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: "✔",
      });

      setShowModal(false);
      setForm(initialForm);
      setEditAssignment(null);
      fetchAssignments(); // Refresh list
      setLoading(false); // <-- Add this line
    } catch (error) {
      console.error("Error submitting assignment:", error);
      setLoading(false); // <-- Add this line
    }
  };
  // Edit assignment handler (PUT request)
  const handleEdit = async (e) => {
    e.preventDefault();

    const teacherId = userDetails?.id || "";
    const teacherName = userDetails?.teachersName || "";
    // if (!schoolId || !teacherId || !teacherName || !form.className || !form.section || !form.subject || !form.title || !form.description || !form.assignmentDate) {
    //   alert("Please fill all required fields.");
    //   return;
    // }
    setEditLoading(true);
    try {
      const payload = new FormData();
      payload.append("schoolId", schoolId);
      payload.append("teacherId", String(teacherId));
      payload.append("teacherName", String(teacherName));
      payload.append("className", String(form.className));
      payload.append("section", String(form.section));
      payload.append("subject", String(form.subject));
      payload.append("title", String(form.title));
      payload.append("description", String(form.description));
      payload.append("assignmentDate", String(form.assignmentDate));
      payload.append("dueDate", String(form.dueDate));
      if (form.attachment) {
        payload.append("attachment", form.attachment);
      }

      await axios.put(
        // `http://192.168.0.156:8089/api/assignments/${editAssignment.id}`,
        `${assignmentUrlApi.putAssignment.url}/${editAssignment.id}`,
        payload
      );

      toast.success("Assignment updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: "✔",
      });

      setShowModal(false);
      setForm(initialForm);
      setEditAssignment(null);
      fetchAssignments(); // Refresh list
      setEditLoading(false);
    } catch (error) {
      console.error("Error updating assignment:", error);
      toast.error("Failed to update assignment!");
      setEditLoading(false);
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Default page size

  // Calculate total pages
  const totalPages = Math.ceil(assignments.length / pageSize);

  // Get current page data
  const paginatedAssignments = assignments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset to first page when assignments or pageSize changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [assignments, pageSize]);
  return (
    <>
      <div className={`${theme === "light" ? "bg-black" : "bg-white"}`}>
        {/* Search Assignment */}
        <div
          className={`${
            theme === "light" ? "bg-gray-700" : "from-purple-100 to-blue-100 "
          } flex flex-col items-start gap-4 mt-6 mb-8 ml-4 mr-4 p-6 bg-gradient-to-r rounded-xl shadow-lg border border-blue-200"`}
        >
          <span
            className={`${
              theme === "light" ? "text-white" : "text-gray-800"
            } text-2xl font-bold mb-2 text-blue-900 tracking-wide"`}
          >
            🔍 Search Assignment
          </span>
          <div className="flex flex-wrap gap-4 items-end w-full">
            <div
              className={`${
                theme === "light" ? "text-white" : "text-gray-800"
              } "flex flex-col"`}
            >
              <label
                className={`${
                  theme === "light" ? "text-white" : "text-gray-800"
                }"text-sm font-semibold mb-1"`}
              >
                Class
              </label>
              <Select value={searchClass} onValueChange={setSearchClass}>
                <SelectTrigger
                  className={`text-black w-36 border border-gray-300 rounded-lg   shadow-sm focus:ring-2 focus:ring-blue-400"`}
                >
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {searchClassOptions.map((item, idx) => (
                      <SelectItem key={idx} value={item.className || item}>
                        {item.className || item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <label
                className={`${
                  theme === "light" ? "text-white" : "text-gray-800"
                } "text-sm font-semibold text-gray-700 mb-1"`}
              >
                Section
              </label>
              <Select value={searchSection} onValueChange={setSearchSection}>
                <SelectTrigger className="w-36 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400">
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {searchSectionOptions?.map((item, idx) => (
                      <SelectItem 
                        key={idx} 
                        value={item.sectionName || item}
                      >
                        {item.sectionName || item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-700 hover:to-purple-800 text-white font-semibold rounded-lg px-8 py-2 shadow-md transition-all duration-200 mt-5 sm:mt-0"
              onClick={handleSearchAssignments}
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                  />
                </svg>
                Search
              </span>
            </button>
          </div>
        </div>
        {/* --- End Search Attendance UI --- */}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl transition"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              <span className="text-red-500">
                <ImCross />
              </span>
            </button>
            <h3 className="text-2xl font-extrabold mb-6 text-left text-blue-700 tracking-wide">
              {editAssignment ? "Edit Assignment" : "Add Assignment"}
            </h3>
            <form
              onSubmit={editAssignment ? handleEdit : handleSubmit}
              className="space-y-5"
            >
              {editAssignment ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                      Title <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                      Description <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 min-h-[80px]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                      Due Date
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={form.dueDate}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Class Name <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        value={form.className}
                        onValueChange={(value) =>
                          setForm((prev) => ({
                            ...prev,
                            className: value,
                            section: "",
                          }))
                        }
                        name="className"
                        required
                      >
                        <SelectTrigger className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {classOptions.map((item, idx) => (
                              <SelectItem
                                key={idx}
                                value={item.className || item}
                              >
                                {item.className || item}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Section <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        value={form.section}
                        onValueChange={(value) =>
                          setForm((prev) => ({ ...prev, section: value }))
                        }
                        name="section"
                        required
                      >
                        <SelectTrigger className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                          <SelectValue placeholder="Select a section" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {sectionOptions?.map((item, idx) => (
                              <SelectItem
                                key={idx}
                                value={item.sectionName || item}
                              >
                                {item.sectionName || item}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Subject <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        value={form.subject}
                        onValueChange={(value) =>
                          setForm((prev) => ({ ...prev, subject: value }))
                        }
                        name="subject"
                        required={true}
                      >
                        <SelectTrigger className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {subjectOptions.map((item, idx) => (
                              <SelectItem key={idx} value={item.subjectName}>
                                {item.subjectName}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Title <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                      Description <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 min-h-[80px]"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Assignment Date <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="date"
                        name="assignmentDate"
                        value={form.assignmentDate}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Due Date
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        value={form.dueDate}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                      Assignment Image
                    </label>
                    <input
                      type="file"
                      name="attachment"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end gap-3 pt-2">
                {/* <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-5 py-2 rounded-lg transition"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-6 py-2 rounded-lg shadow transition"
                >
                  Submit
                </button> */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-5 h-12 rounded-md ${
                    loading
                      ? "bg-gray-500 text-white cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin w-4 h-4" />
                      Submitting...
                    </span>
                  ) : editAssignment ? (
                    "Update Assignment"
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* </div> */}

      <div
        className={`${
          theme === "light" ? "dark" : "light"
        } min-h-screen bg-gradient-to-b ${
          theme === "light"
            ? "from-gray-900 to-gray-800"
            : "from-gray-50 to-white"
        }`}
      >
        <div className=" rounded-xl overflow-hidden m-4">
          {/* Page Size Dropdown */}

          {/* Header */}
          <div
            className={`${
              theme === "light"
                ? "bg-gray-700"
                : "bg-gradient-to-r from-blue-600 to-white"
            } rounded-t-xl px-4 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3"`}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span role="img" aria-label="assignment" className="text-2xl">
                📝
              </span>
              Assignment Management
            </h2>
            {
              role === "teacher" && (
                <button
                className="bg-gradient-to-r from-red-400 to-purple-700 hover:from-indigo-600 hover:to-purple-800 text-white font-medium rounded-full px-3 sm:px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 text-sm sm:text-base"
                onClick={handleOpenModal}
              >
                <FaPlus /> Add New Assignment
              </button> 
              )
                
              
            }
            


          </div>
          {/* Content */}
          <div
            className={`p-6 ${
              theme === "light" ? "bg-gray-800" : "bg-white"
            } rounded-b-xl shadow-lg overflow-x-auto`}
          >
            <table
              className={`${
                theme === "light" ? "bg-gray-800" : "bg-white"
              } min-w-full text-left border-collapse`}
            >
              <thead>
                <tr
                  className={`${
                    theme === "light" ? "bg-gray-800" : "bg-blue-100"
                  }`}
                >
                  <th className="py-2 px-2 sm:px-4 rounded-tl-xl text-xs sm:text-sm">
                    S.No
                  </th>
                  <th className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                    Class
                  </th>
                  <th className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                    Section
                  </th>
                  <th className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                    Subject
                  </th>
                  <th className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                    Title
                  </th>
                  <th className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                    Assignment Date
                  </th>
                  <th className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                    Due Date
                  </th>
                  <th className="py-2 px-2 sm:px-4 rounded-tr-xl text-xs sm:text-sm">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedAssignments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-400">
                      No assignments found.
                    </td>
                  </tr>
                ) : (
                  paginatedAssignments.map((assignment, idx) => (
                    <tr
                      key={assignment.id || idx}
                      className="border-b last:border-b-0"
                    >
                      {/* <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">{idx + 1}</td>
                       */}
                      <td>{(currentPage - 1) * pageSize + idx + 1}</td>
                      <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                        {assignment.className}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                        {assignment.section}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                        {assignment.subject}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                        {assignment.title.length > 10
                          ? assignment.title.slice(0, 10) + "..."
                          : assignment.title}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                        {assignment.assignmentDate}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                        {assignment.dueDate}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 sm:px-3 py-1 rounded transition text-lg sm:text-2xl"
                            onClick={() => openEditModal(assignment)}
                          >
                            <LiaEdit />
                          </button>

                          <DeleteComponent
                            // deletePath={`http://192.168.0.156:8089/api/assignments/${assignment.id}`}
                            deletePath={`${assignmentUrlApi.deleteAssignment.url}/${assignment.id}`}
                            name={assignment.title}
                            onDelete={fetchAssignments}
                            // customData={assignment.title}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex align-middle justify-center">
            <div className="flex justify-end mt-4 mx-10">
              <label
                className={`${
                  theme === "light" ? "text-white" : "text-black"
                } mr-2  text-lg text-gray-700"`}
              >
                Rows per page:
              </label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="border text-black border-gray-300 rounded px-2 py-1 text-sm"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl transition"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              <span className="text-red-500">
                <ImCross />
              </span>
            </button>
            <h3 className="text-2xl font-extrabold mb-6 text-left text-blue-700 tracking-wide">
              {editAssignment ? "Edit Assignment" : "Add Assignment"}
            </h3>
            <form
              onSubmit={editAssignment ? handleEdit : handleSubmit}
              className="space-y-5"
            >
              {editAssignment ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                      Title <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                      Description <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 min-h-[80px]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                      Due Date
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={form.dueDate}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Class Name <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        value={form.className}
                        onValueChange={(value) =>
                          setForm((prev) => ({
                            ...prev,
                            className: value,
                            section: "",
                          }))
                        }
                        name="className"
                        required
                      >
                        <SelectTrigger className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {classOptions.map((item, idx) => (
                              <SelectItem
                                key={idx}
                                value={item.className || item}
                              >
                                {item.className || item}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Section <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        value={form.section}
                        onValueChange={(value) =>
                          setForm((prev) => ({ ...prev, section: value }))
                        }
                        name="section"
                        required
                      >
                        <SelectTrigger className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                          <SelectValue placeholder="Select a section" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {sectionOptions?.map((item, idx) => (
                              <SelectItem
                                key={idx}
                                value={item.sectionName || item}
                              >
                                {item.sectionName || item}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Subject <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        value={form.subject}
                        onValueChange={(value) =>
                          setForm((prev) => ({ ...prev, subject: value }))
                        }
                        name="subject"
                        required={true}
                      >
                        <SelectTrigger className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {subjectOptions.map((item, idx) => (
                              <SelectItem key={idx} value={item.subjectName}>
                                {item.subjectName}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Title <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                      Description <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 min-h-[80px]"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Assignment Date <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="date"
                        name="assignmentDate"
                        value={form.assignmentDate}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Due Date
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        value={form.dueDate}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                      Assignment Image
                    </label>
                    <input
                      type="file"
                      name="attachment"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-5 h-12 rounded-md ${
                    loading
                      ? "bg-gray-500 text-white cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin w-4 h-4" />
                      Submitting...
                    </span>
                  ) : editAssignment ? (
                    "Update Assignment"
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Assignment;
