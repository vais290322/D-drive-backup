import resultUrlApi from "@/common/result";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTheme } from "@/context/ThemeContext";
import axios from "axios";
import {
  BookOpen,
  Edit2,
  Eye,
  PlusCircle,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const backendUrl = import.meta.env.VITE_REACT_BASE_URL_LOCAL;

const BASE_URL = `${backendUrl}/api/additionalSubjectMarkRegister`;

const AditionalSubjectMarkRegisterPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "light"; // In this project "light" theme === dark bg

  /* ─────────────────────────── Redux state ─────────────────────────── */
  const allClass = useSelector((state) => state.class.classNames) || [];
  const allSection = useSelector((state) => state.section.sectionNames) || [];
  const examTypeData = useSelector((state) => state.examType.examType) || [];
  const teacherDetails = useSelector((state) => state.auth.userDetails) || {};
  const userRole = useSelector((state) => state.auth.user) || "teacher";
  const schoolId = useSelector((state) => state?.auth?.schoolId);

  /* ─────────────────────────── Tab state ───────────────────────────── */
  const [activeTab, setActiveTab] = useState("create"); // "create" | "view"

  /* ─────────────────────── CREATE TAB state ────────────────────────── */
  const [postApiLoading, setPostApiLoading] = useState(false);
  const [searchData, setSearchData] = useState({ className: "", section: "" });
  const [studentList, setStudentList] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [subjectFullMark, setSubjectFullMark] = useState(0);
  const [projectFullMark, setProjectFullMark] = useState(0);
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [marksInputData, setMarksInputData] = useState({});
  const [projectMarksData, setProjectMarksData] = useState({});
  const [createRowsPerPage, setCreateRowsPerPage] = useState(5);
  const [createCurrentPage, setCreateCurrentPage] = useState(1);

  /* ─────────────────────── VIEW TAB state ──────────────────────────── */
  const [viewSearchData, setViewSearchData] = useState({
    className: "",
    section: "",
    examType: "",
  });
  const [viewLoading, setViewLoading] = useState(false);
  const [viewRecords, setViewRecords] = useState([]);   // flat list per subject
  const [viewFetched, setViewFetched] = useState(false);

  /* ─────────────────────── EDIT / VIEW MODAL state ────────────────────────── */
  const [editModal, setEditModal] = useState(false);
  const [modalMode, setModalMode] = useState("edit");
  const [editRecord, setEditRecord] = useState(null);   // the full record row
  const [editMarks, setEditMarks] = useState({});
  const [editProjectMarks, setEditProjectMarks] = useState({});
  const [editSubjectFullMark, setEditSubjectFullMark] = useState(0);
  const [editProjectFullMark, setEditProjectFullMark] = useState(0);
  const [editLoading, setEditLoading] = useState(false);

  /* ─────────────────────── DELETE state ────────────────────────────── */
  const [deleteLoading, setDeleteLoading] = useState(null); // stores subject key being deleted

  /* ─────────────────────── View pagination ─────────────────────────── */
  const [viewRowsPerPage, setViewRowsPerPage] = useState(5);
  const [viewCurrentPage, setViewCurrentPage] = useState(1);

  /* ═══════════════════════════════════════════════════════════════════ */
  /*                         HELPERS                                    */
  /* ═══════════════════════════════════════════════════════════════════ */
  const capitalizeFirstLetter = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  const card = isDark
    ? "bg-gray-800 border border-gray-700"
    : "bg-white border border-gray-200";
  const cardHeader = isDark ? "border-gray-700" : "border-gray-200";
  const text = isDark ? "text-white" : "text-gray-800";
  const subText = isDark ? "text-gray-400" : "text-gray-500";
  const tableHead = isDark ? "bg-gray-700" : "bg-gray-50";
  const tableHeadText = isDark ? "text-gray-200" : "text-gray-700";
  const tableRowHover = isDark
    ? "hover:bg-gray-600 border-t border-gray-700"
    : "hover:bg-gray-100 border-t border-gray-200";
  const inputCls = isDark
    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
    : "bg-white border-gray-200 text-gray-800";
  const selectTriggerCls = isDark
    ? "bg-gray-700 border-gray-600 text-white"
    : "bg-white";
  const tabActive =
    "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md";
  const tabInactive = isDark
    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
    : "bg-gray-100 text-gray-600 hover:bg-gray-200";

  /* ═══════════════════════════════════════════════════════════════════ */
  /*                    CREATE TAB – SEARCH STUDENTS                    */
  /* ═══════════════════════════════════════════════════════════════════ */
  const searchStudents = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `${resultUrlApi.searchStudentForMark1.url}/${schoolId}/attendance/students?className=${searchData.className}&section=${searchData.section}`
      );
      if (res) {
        toast.success("Students fetched successfully");
        const sorted = res.data.sort((a, b) => a.rollNo - b.rollNo);
        setStudentList(sorted);
        setCreateCurrentPage(1);
        setMarksInputData(
          sorted.reduce((acc, s) => ({ ...acc, [s.id]: "" }), {})
        );
        setProjectMarksData(
          sorted.reduce((acc, s) => ({ ...acc, [s.id]: "" }), {})
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching students");
    }
  };

  /* ═══════════════════════════════════════════════════════════════════ */
  /*                     MARKS INPUT VALIDATION                         */
  /* ═══════════════════════════════════════════════════════════════════ */
  const handleMarksChange = (id, value, type) => {
    if (value && !/^\d+$/.test(value)) return;
    const num = value === "" ? "" : parseInt(value, 10);

    if (type === "subject") {
      if (num !== "" && num > subjectFullMark) {
        toast.error(`Subject mark cannot exceed ${subjectFullMark}`);
        return;
      }
      setMarksInputData((prev) => ({ ...prev, [id]: value }));
    } else {
      if (num !== "" && num > projectFullMark) {
        toast.error(`Project mark cannot exceed ${projectFullMark}`);
        return;
      }
      setProjectMarksData((prev) => ({ ...prev, [id]: value }));
    }
  };

  /* ═══════════════════════════════════════════════════════════════════ */
  /*                       SAVE ALL MARKS (CREATE)                      */
  /* ═══════════════════════════════════════════════════════════════════ */
  const handleSaveAll = async () => {
    if (!searchData.className || !searchData.section) {
      toast.error("Please select class and section");
      return;
    }
    if (!selectedExamType) {
      toast.error("Please select exam type");
      return;
    }
    if (!subjectName.trim()) {
      toast.error("Please enter subject name");
      return;
    }

    const missing = [];
    studentList.forEach((s) => {
      if (!marksInputData[s.id] || marksInputData[s.id].trim() === "") {
        missing.push(s.studentName);
      }
      if (!projectMarksData[s.id] || projectMarksData[s.id].trim() === "") {
        if (!missing.includes(s.studentName)) missing.push(s.studentName);
      }
    });
    if (missing.length > 0) {
      toast.error(`Marks missing for: ${missing.join(", ")}`);
      return;
    }

    try {
      setPostApiLoading(true);
      const marks = studentList.map((s) => ({
        roll: s.rollNo,
        name: s.studentName,
        mark: Number(marksInputData[s.id]),
        projectMark: Number(projectMarksData[s.id]),
      }));

      const payload = {
        schoolId,
        className: searchData.className,
        section: searchData.section,
        marks,
        subject: subjectName,
        teacherName: userRole === "teacher" ? teacherDetails.name : "Admin",
        examType: selectedExamType,
        subjectFullMark: Number(subjectFullMark),
        projectFullMark: Number(projectFullMark),
        fullMarks: Number(subjectFullMark) + Number(projectFullMark),
        userRole,
      };

      const res = await axios.post(`${BASE_URL}/create`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (res?.data?.success) {
        toast.success("Marks saved successfully!");
        // Reset form
        setSubjectName("");
        setSubjectFullMark(0);
        setProjectFullMark(0);
        setSelectedExamType(null);
        setMarksInputData({});
        setProjectMarksData({});
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save marks");
    } finally {
      setPostApiLoading(false);
    }
  };

  /* ═══════════════════════════════════════════════════════════════════ */
  /*               VIEW TAB – FETCH EXISTING MARK REGISTERS             */
  /* ═══════════════════════════════════════════════════════════════════ */
  const fetchViewRecords = async (e) => {
    e.preventDefault();
    if (!viewSearchData.className || !viewSearchData.section || !viewSearchData.examType) {
      toast.error("Please select class, section and exam type");
      return;
    }
    try {
      setViewLoading(true);
      setViewFetched(false);
      const res = await axios.get(`${BASE_URL}/additionalMarksheetData`, {
        params: {
          schoolId,
          className: viewSearchData.className,
          section: viewSearchData.section,
          examType: viewSearchData.examType,
        },
      });

      if (res?.data?.success) {
        // Restructure: build a per-subject list so we can show each subject's register as a row
        const data = res.data.data;
        // Aggregate all unique subjects
        const subjectMap = {};
        (data.markSheets || []).forEach((student) => {
          (student.subjects || []).forEach((subj) => {
            if (!subjectMap[subj.subject]) {
              subjectMap[subj.subject] = {
                subject: subj.subject,
                subjectFullMark: subj.subjectFullMark,
                projectFullMark: subj.projectFullMark,
                students: [],
              };
            }
            subjectMap[subj.subject].students.push({
              name: student.name,
              roll: student.roll,
              writtenMarks: subj.writtenMarks,
              projectMarks: subj.projectMarks,
              totalMarks: subj.totalMarks,
            });
          });
        });
        setViewRecords(Object.values(subjectMap));
        setViewCurrentPage(1);
        setViewFetched(true);
        toast.success(
          `Fetched ${Object.keys(subjectMap).length} subject register(s)`
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch records");
    } finally {
      setViewLoading(false);
    }
  };

  /* ═══════════════════════════════════════════════════════════════════ */
  /*                      OPEN EDIT MODAL                               */
  /* ═══════════════════════════════════════════════════════════════════ */
  const openModal = (record, mode = "edit") => {
    setModalMode(mode);
    setEditRecord(record);
    setEditSubjectFullMark(record.subjectFullMark);
    setEditProjectFullMark(record.projectFullMark);
    const initMarks = {};
    const initProject = {};
    record.students.forEach((s) => {
      initMarks[s.roll] = String(s.writtenMarks);
      initProject[s.roll] = String(s.projectMarks);
    });
    setEditMarks(initMarks);
    setEditProjectMarks(initProject);
    setEditModal(true);
  };

  const handleEditMarksChange = (roll, value, type) => {
    if (value && !/^\d+$/.test(value)) return;
    const num = value === "" ? "" : parseInt(value, 10);

    if (type === "subject") {
      if (num !== "" && num > editSubjectFullMark) {
        toast.error(`Cannot exceed ${editSubjectFullMark}`);
        return;
      }
      setEditMarks((prev) => ({ ...prev, [roll]: value }));
    } else {
      if (num !== "" && num > editProjectFullMark) {
        toast.error(`Cannot exceed ${editProjectFullMark}`);
        return;
      }
      setEditProjectMarks((prev) => ({ ...prev, [roll]: value }));
    }
  };

  /* ═══════════════════════════════════════════════════════════════════ */
  /*                         UPDATE HANDLER                             */
  /* ═══════════════════════════════════════════════════════════════════ */
  const handleUpdate = async () => {
    const missing = editRecord.students.filter(
      (s) =>
        !editMarks[s.roll] ||
        editMarks[s.roll] === "" ||
        !editProjectMarks[s.roll] ||
        editProjectMarks[s.roll] === ""
    );
    if (missing.length > 0) {
      toast.error(`Marks missing for: ${missing.map((s) => s.name).join(", ")}`);
      return;
    }

    try {
      setEditLoading(true);
      const marks = editRecord.students.map((s) => ({
        roll: s.roll,
        name: s.name,
        mark: Number(editMarks[s.roll]),
        projectMark: Number(editProjectMarks[s.roll]),
      }));

      const payload = {
        schoolId,
        className: viewSearchData.className,
        section: viewSearchData.section,
        examType: viewSearchData.examType,
        subject: editRecord.subject,
        subjectFullMark: Number(editSubjectFullMark),
        projectFullMark: Number(editProjectFullMark),
        fullMarks: Number(editSubjectFullMark) + Number(editProjectFullMark),
        teacherName: userRole === "teacher" ? teacherDetails.name : "Admin",
        userRole,
        marks,
      };

      const res = await axios.put(`${BASE_URL}/update`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (res?.data?.success) {
        toast.success("Marks updated successfully!");
        setEditModal(false);
        // Refresh view
        fetchViewRecords({ preventDefault: () => {} });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update marks");
    } finally {
      setEditLoading(false);
    }
  };

  /* ═══════════════════════════════════════════════════════════════════ */
  /*                         DELETE HANDLER                             */
  /* ═══════════════════════════════════════════════════════════════════ */
  const handleDelete = async (subject) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the mark register for "${subject}"? This action cannot be undone.`
      )
    )
      return;

    const key = `${subject}`;
    try {
      setDeleteLoading(key);
      const res = await axios.delete(`${BASE_URL}/delete`, {
        params: {
          schoolId,
          className: viewSearchData.className,
          section: viewSearchData.section,
          examType: viewSearchData.examType,
          subject,
        },
      });

      if (res?.data?.success) {
        toast.success(`Mark register for "${subject}" deleted`);
        setViewRecords((prev) => prev.filter((r) => r.subject !== subject));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeleteLoading(null);
    }
  };

  /* ═══════════════════════════════════════════════════════════════════ */
  /*                      CREATE TAB PAGINATION                         */
  /* ═══════════════════════════════════════════════════════════════════ */
  const createTotalPages = Math.ceil(studentList.length / createRowsPerPage);
  const createPaginated = studentList.slice(
    (createCurrentPage - 1) * createRowsPerPage,
    createCurrentPage * createRowsPerPage
  );

  /* ═══════════════════════════════════════════════════════════════════ */
  /*                       VIEW TAB PAGINATION                          */
  /* ═══════════════════════════════════════════════════════════════════ */
  const viewTotalPages = Math.ceil(viewRecords.length / viewRowsPerPage);
  const viewPaginated = viewRecords.slice(
    (viewCurrentPage - 1) * viewRowsPerPage,
    viewCurrentPage * viewRowsPerPage
  );

  /* ═══════════════════════════════════════════════════════════════════ */
  /*                             RENDER                                 */
  /* ═══════════════════════════════════════════════════════════════════ */
  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="container mx-auto py-6 px-3 sm:px-4 lg:px-6 max-w-7xl">

        {/* ─────────────── Page Header ─────────────── */}
        <div className={`mb-6 ${isDark ? "text-white" : "text-gray-800"}`}>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold relative inline-block">
            Additional Mark Register
            <span className="absolute bottom-[-5px] left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
          </h1>
          <p className={`mt-3 text-xs sm:text-sm ${subText}`}>
            Record, manage, and update student marks for additional subjects
          </p>
        </div>

        {/* ─────────────── Tabs ─────────────── */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === "create" ? tabActive : tabInactive
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden xs:inline">Add Marks</span>
            <span className="xs:hidden">Add</span>
          </button>
          <button
            onClick={() => setActiveTab("view")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === "view" ? tabActive : tabInactive
            }`}
          >
            <Eye className="h-4 w-4" />
            <span className="hidden xs:inline">View / Manage</span>
            <span className="xs:hidden">Manage</span>
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/*                    CREATE TAB                         */}
        {/* ══════════════════════════════════════════════════════ */}
        {activeTab === "create" && (
          <>
            {/* Search Students Card */}
            <div className={`mb-6 rounded-xl shadow-lg ${card}`}>
              <div className={`p-4 sm:p-6 border-b ${cardHeader}`}>
                <h2 className={`text-lg sm:text-xl font-bold mb-4 ${text}`}>
                  Search Students
                </h2>
                <form
                  onSubmit={searchStudents}
                  className="flex flex-col sm:flex-row flex-wrap items-end gap-3"
                >
                  <div className="w-full sm:w-auto">
                    <Label className={`mb-1 block text-xs ${subText}`}>Class</Label>
                    <Select
                      onValueChange={(v) =>
                        setSearchData({ ...searchData, className: v })
                      }
                      required
                    >
                      <SelectTrigger
                        className={`w-full sm:w-[160px] ${selectTriggerCls}`}
                      >
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Class</SelectLabel>
                          {allClass.map((c, i) => (
                            <SelectItem key={i} value={c}>
                              {capitalizeFirstLetter(c)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full sm:w-auto">
                    <Label className={`mb-1 block text-xs ${subText}`}>Section</Label>
                    <Select
                      onValueChange={(v) =>
                        setSearchData({ ...searchData, section: v })
                      }
                      required
                    >
                      <SelectTrigger
                        className={`w-full sm:w-[160px] ${selectTriggerCls}`}
                      >
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Section</SelectLabel>
                          {allSection.map((s, i) => (
                            <SelectItem key={i} value={s}>
                              {capitalizeFirstLetter(s)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </form>
              </div>
            </div>

            {/* Mark Entry Card */}
            <div className={`rounded-xl shadow-lg overflow-hidden ${card}`}>
              {/* Card Header */}
              <div
                className={`flex flex-col gap-4 p-4 sm:p-6 border-b ${cardHeader}`}
              >
                {/* Title row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className={`text-lg sm:text-xl font-bold ${text}`}>
                      Mark Register
                    </h2>
                    <p className={`text-xs mt-1 ${subText}`}>
                      {studentList.length} student{studentList.length !== 1 ? "s" : ""} found
                    </p>
                  </div>
                  <Button
                    onClick={handleSaveAll}
                    disabled={postApiLoading || studentList.length === 0}
                    className="saveMarks w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-md"
                  >
                    {postApiLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save All Marks
                      </>
                    )}
                  </Button>
                </div>

                {/* Configuration fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <Label className={`mb-1 block text-xs ${subText}`}>
                      Subject Name
                    </Label>
                    <Input
                      type="text"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      placeholder="e.g. Computer Science"
                      className={`w-full ${inputCls}`}
                    />
                  </div>
                  <div>
                    <Label className={`mb-1 block text-xs ${subText}`}>
                      Subject Full Mark
                    </Label>
                    <Input
                      type="text"
                      value={subjectFullMark}
                      onChange={(e) => {
                        if (/^\d*$/.test(e.target.value))
                          setSubjectFullMark(e.target.value);
                      }}
                      placeholder="e.g. 80"
                      className={`w-full ${inputCls}`}
                    />
                  </div>
                  <div>
                    <Label className={`mb-1 block text-xs ${subText}`}>
                      Project Full Mark
                    </Label>
                    <Input
                      type="text"
                      value={projectFullMark}
                      onChange={(e) => {
                        if (/^\d*$/.test(e.target.value))
                          setProjectFullMark(e.target.value);
                      }}
                      placeholder="e.g. 20"
                      className={`w-full ${inputCls}`}
                    />
                  </div>
                  <div>
                    <Label className={`mb-1 block text-xs ${subText}`}>
                      Exam Type
                    </Label>
                    <Select
                      onValueChange={(v) => setSelectedExamType(v)}
                    >
                      <SelectTrigger className={`w-full ${selectTriggerCls}`}>
                        <SelectValue placeholder="Select Exam Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Exam Types</SelectLabel>
                          {examTypeData.map((e, i) => (
                            <SelectItem key={i} value={e.examTypeName}>
                              {capitalizeFirstLetter(e.examTypeName)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Table */}
              {studentList.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 text-center">
                  <BookOpen
                    className={`w-14 h-14 mb-4 ${subText} opacity-50`}
                  />
                  <p className={`text-base font-medium ${text}`}>
                    No students found
                  </p>
                  <p className={`text-xs mt-1 ${subText}`}>
                    Search a class and section above
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="w-full min-w-[600px]">
                    <TableHeader className={tableHead}>
                      <TableRow>
                        {[
                          "S.No",
                          "Roll No",
                          "Student Name",
                          "Class (Section)",
                          `Subject Mark (/${subjectFullMark})`,
                          `Project Mark (/${projectFullMark})`,
                        ].map((h, i) => (
                          <TableHead
                            key={i}
                            className={`px-3 py-3 ${tableHeadText} font-semibold text-xs text-left whitespace-nowrap`}
                          >
                            {h}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {createPaginated.map((item, index) => (
                        <TableRow
                          key={item.id}
                          className={`transition-colors ${tableRowHover}`}
                        >
                          <TableCell className={`px-3 py-2 text-sm ${subText}`}>
                            {(createCurrentPage - 1) * createRowsPerPage +
                              index +
                              1}
                          </TableCell>
                          <TableCell
                            className={`px-3 py-2 font-medium text-sm ${text}`}
                          >
                            {item.rollNo}
                          </TableCell>
                          <TableCell className={`px-3 py-2 text-sm ${text}`}>
                            {item.studentName}
                          </TableCell>
                          <TableCell className="px-3 py-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {item.className} ({item.section})
                            </span>
                          </TableCell>
                          <TableCell className="px-3 py-2">
                            <input
                              type="text"
                              placeholder={`Max ${subjectFullMark}`}
                              value={marksInputData[item.id] || ""}
                              onChange={(e) =>
                                handleMarksChange(
                                  item.id,
                                  e.target.value,
                                  "subject"
                                )
                              }
                              className={`w-full min-w-[100px] p-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                isDark
                                  ? "text-white bg-gray-800 border-gray-600"
                                  : "text-black border-gray-200"
                              }`}
                            />
                          </TableCell>
                          <TableCell className="px-3 py-2">
                            <input
                              type="text"
                              placeholder={`Max ${projectFullMark}`}
                              value={projectMarksData[item.id] || ""}
                              onChange={(e) =>
                                handleMarksChange(
                                  item.id,
                                  e.target.value,
                                  "project"
                                )
                              }
                              className={`w-full min-w-[100px] p-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                isDark
                                  ? "text-white bg-gray-800 border-gray-600"
                                  : "text-black border-gray-200"
                              }`}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination */}
              {studentList.length > 0 && (
                <div className={`p-4 border-t ${cardHeader}`}>
                  <PaginationComponent
                    currentPage={createCurrentPage}
                    rowsPerPage={createRowsPerPage}
                    totalPages={createTotalPages}
                    onRowsPerPageChange={(n) => {
                      setCreateRowsPerPage(n);
                      setCreateCurrentPage(1);
                    }}
                    onPageChange={setCreateCurrentPage}
                    className={text}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════ */}
        {/*                    VIEW / MANAGE TAB                  */}
        {/* ══════════════════════════════════════════════════════ */}
        {activeTab === "view" && (
          <>
            {/* Search Form */}
            <div className={`mb-6 rounded-xl shadow-lg ${card}`}>
              <div className={`p-4 sm:p-6 border-b ${cardHeader}`}>
                <h2 className={`text-lg sm:text-xl font-bold mb-4 ${text}`}>
                  Search Existing Registers
                </h2>
                <form
                  onSubmit={fetchViewRecords}
                  className="flex flex-col sm:flex-row flex-wrap items-end gap-3"
                >
                  <div className="w-full sm:w-auto">
                    <Label className={`mb-1 block text-xs ${subText}`}>Class</Label>
                    <Select
                      onValueChange={(v) =>
                        setViewSearchData({ ...viewSearchData, className: v })
                      }
                      required
                    >
                      <SelectTrigger
                        className={`w-full sm:w-[160px] ${selectTriggerCls}`}
                      >
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Class</SelectLabel>
                          {allClass.map((c, i) => (
                            <SelectItem key={i} value={c}>
                              {capitalizeFirstLetter(c)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full sm:w-auto">
                    <Label className={`mb-1 block text-xs ${subText}`}>Section</Label>
                    <Select
                      onValueChange={(v) =>
                        setViewSearchData({ ...viewSearchData, section: v })
                      }
                      required
                    >
                      <SelectTrigger
                        className={`w-full sm:w-[160px] ${selectTriggerCls}`}
                      >
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Section</SelectLabel>
                          {allSection.map((s, i) => (
                            <SelectItem key={i} value={s}>
                              {capitalizeFirstLetter(s)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full sm:w-auto">
                    <Label className={`mb-1 block text-xs ${subText}`}>
                      Exam Type
                    </Label>
                    <Select
                      onValueChange={(v) =>
                        setViewSearchData({ ...viewSearchData, examType: v })
                      }
                      required
                    >
                      <SelectTrigger
                        className={`w-full sm:w-[180px] ${selectTriggerCls}`}
                      >
                        <SelectValue placeholder="Select exam type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Exam Types</SelectLabel>
                          {examTypeData.map((e, i) => (
                            <SelectItem key={i} value={e.examTypeName}>
                              {capitalizeFirstLetter(e.examTypeName)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    disabled={viewLoading}
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300"
                  >
                    {viewLoading ? (
                      <svg
                        className="animate-spin h-4 w-4 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    {viewLoading ? "Fetching..." : "Fetch Records"}
                  </Button>
                </form>
              </div>
            </div>

            {/* View Records Card */}
            <div className={`rounded-xl shadow-lg overflow-hidden ${card}`}>
              <div
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 sm:p-6 border-b ${cardHeader}`}
              >
                <div>
                  <h2 className={`text-lg sm:text-xl font-bold ${text}`}>
                    Mark Registers
                  </h2>
                  <p className={`text-xs mt-1 ${subText}`}>
                    {viewFetched
                      ? `${viewRecords.length} subject register(s) found`
                      : "Search above to view records"}
                  </p>
                </div>
                {viewFetched && viewRecords.length > 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ {viewSearchData.examType} — {capitalizeFirstLetter(viewSearchData.className)} - {capitalizeFirstLetter(viewSearchData.section)}
                  </span>
                )}
              </div>

              {viewLoading ? (
                <div className="flex justify-center items-center p-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500" />
                </div>
              ) : !viewFetched ? (
                <div className="flex flex-col items-center justify-center p-10 text-center">
                  <Search className={`w-14 h-14 mb-4 opacity-30 ${subText}`} />
                  <p className={`text-base font-medium ${text}`}>
                    Search to view registers
                  </p>
                  <p className={`text-xs mt-1 ${subText}`}>
                    Select class, section & exam type, then click Fetch Records
                  </p>
                </div>
              ) : viewRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 text-center">
                  <BookOpen className={`w-14 h-14 mb-4 opacity-30 ${subText}`} />
                  <p className={`text-base font-medium ${text}`}>
                    No mark registers found
                  </p>
                  <p className={`text-xs mt-1 ${subText}`}>
                    No data for this combination
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="w-full min-w-[500px]">
                    <TableHeader className={tableHead}>
                      <TableRow>
                        {[
                          "S.No",
                          "Subject",
                          "Subject Full Mark",
                          "Project Full Mark",
                          "Total Full Mark",
                          "Students",
                          "Actions",
                        ].map((h, i) => (
                          <TableHead
                            key={i}
                            className={`px-3 py-3 ${tableHeadText} font-semibold text-xs text-left whitespace-nowrap`}
                          >
                            {h}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewPaginated.map((record, index) => (
                        <TableRow
                          key={record.subject}
                          className={`transition-colors ${tableRowHover}`}
                        >
                          <TableCell className={`px-3 py-3 text-sm ${subText}`}>
                            {(viewCurrentPage - 1) * viewRowsPerPage + index + 1}
                          </TableCell>
                          <TableCell
                            className={`px-3 py-3 font-semibold text-sm ${text}`}
                          >
                            {capitalizeFirstLetter(record.subject)}
                          </TableCell>
                          <TableCell className={`px-3 py-3 text-sm ${text}`}>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {record.subjectFullMark}
                            </span>
                          </TableCell>
                          <TableCell className={`px-3 py-3 text-sm ${text}`}>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              {record.projectFullMark}
                            </span>
                          </TableCell>
                          <TableCell className={`px-3 py-3 text-sm ${text}`}>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {record.subjectFullMark + record.projectFullMark}
                            </span>
                          </TableCell>
                          <TableCell className={`px-3 py-3 text-sm ${text}`}>
                            {record.students.length}
                          </TableCell>
                          <TableCell className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openModal(record, "view")}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                                title="View marks"
                              >
                                <Eye className="h-3 w-3" />
                                <span className="hidden sm:inline">View</span>
                              </button>
                              <button
                                onClick={() => openModal(record, "edit")}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                                title="Edit marks"
                              >
                                <Edit2 className="h-3 w-3" />
                                <span className="hidden sm:inline">Edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(record.subject)}
                                disabled={deleteLoading === record.subject}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-60"
                                title="Delete register"
                              >
                                {deleteLoading === record.subject ? (
                                  <svg
                                    className="animate-spin h-3 w-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    />
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                  </svg>
                                ) : (
                                  <Trash2 className="h-3 w-3" />
                                )}
                                <span className="hidden sm:inline">Delete</span>
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {viewFetched && viewRecords.length > 0 && (
                <div className={`p-4 border-t ${cardHeader}`}>
                  <PaginationComponent
                    currentPage={viewCurrentPage}
                    rowsPerPage={viewRowsPerPage}
                    totalPages={viewTotalPages}
                    onRowsPerPageChange={(n) => {
                      setViewRowsPerPage(n);
                      setViewCurrentPage(1);
                    }}
                    onPageChange={setViewCurrentPage}
                    className={text}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/*                    EDIT MODAL                         */}
      {/* ══════════════════════════════════════════════════════ */}
      {editModal && editRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setEditModal(false)}
          />

          {/* Modal */}
          <div
            className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`flex items-center justify-between p-4 sm:p-5 border-b ${cardHeader} flex-shrink-0`}
            >
              <div>
                <h3 className={`text-base sm:text-lg font-bold ${text}`}>
                  {modalMode === "edit" ? "Edit Marks" : "View Marks"} —{" "}
                  <span className="text-purple-500">
                    {capitalizeFirstLetter(editRecord.subject)}
                  </span>
                </h3>
                <p className={`text-xs mt-0.5 ${subText}`}>
                  {capitalizeFirstLetter(viewSearchData.className)} - {capitalizeFirstLetter(viewSearchData.section)} | {viewSearchData.examType}
                </p>
              </div>
              <button
                onClick={() => setEditModal(false)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Full Mark Editors */}
            <div
              className={`px-4 sm:px-5 py-3 border-b ${cardHeader} flex-shrink-0`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className={`mb-1 block text-xs ${subText}`}>
                    Subject Full Mark
                  </Label>
                  <Input
                    type="text"
                    value={editSubjectFullMark}
                    onChange={(e) => {
                      if (/^\d*$/.test(e.target.value))
                        setEditSubjectFullMark(e.target.value);
                    }}
                    disabled={modalMode === "view"}
                    className={`w-full ${inputCls} ${modalMode === "view" ? "opacity-70 cursor-not-allowed" : ""}`}
                  />
                </div>
                <div>
                  <Label className={`mb-1 block text-xs ${subText}`}>
                    Project Full Mark
                  </Label>
                  <Input
                    type="text"
                    value={editProjectFullMark}
                    onChange={(e) => {
                      if (/^\d*$/.test(e.target.value))
                        setEditProjectFullMark(e.target.value);
                    }}
                    disabled={modalMode === "view"}
                    className={`w-full ${inputCls} ${modalMode === "view" ? "opacity-70 cursor-not-allowed" : ""}`}
                  />
                </div>
              </div>
            </div>

            {/* Table - scrollable */}
            <div className="overflow-auto flex-1">
              <Table className="w-full min-w-[500px]">
                <TableHeader
                  className={`sticky top-0 z-10 ${tableHead}`}
                >
                  <TableRow>
                    {[
                      "Roll",
                      "Student Name",
                      `Subject Mark (/${editSubjectFullMark})`,
                      `Project Mark (/${editProjectFullMark})`,
                      "Total",
                    ].map((h, i) => (
                      <TableHead
                        key={i}
                        className={`px-3 py-3 ${tableHeadText} font-semibold text-xs text-left whitespace-nowrap`}
                      >
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editRecord.students.map((s) => {
                    const sm = Number(editMarks[s.roll]) || 0;
                    const pm = Number(editProjectMarks[s.roll]) || 0;
                    return (
                      <TableRow
                        key={s.roll}
                        className={`transition-colors ${tableRowHover}`}
                      >
                        <TableCell
                          className={`px-3 py-2 font-medium text-sm ${text}`}
                        >
                          {s.roll}
                        </TableCell>
                        <TableCell className={`px-3 py-2 text-sm ${text}`}>
                          {s.name}
                        </TableCell>
                        <TableCell className="px-3 py-2">
                          {modalMode === "view" ? (
                            <span className={text}>{editMarks[s.roll] || "-"}</span>
                          ) : (
                            <input
                              type="text"
                              value={editMarks[s.roll] ?? ""}
                              onChange={(e) =>
                                handleEditMarksChange(
                                  s.roll,
                                  e.target.value,
                                  "subject"
                                )
                              }
                              placeholder={`Max ${editSubjectFullMark}`}
                              className={`w-full min-w-[90px] p-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                isDark
                                  ? "text-white bg-gray-700 border-gray-600"
                                  : "text-black border-gray-200"
                              }`}
                            />
                          )}
                        </TableCell>
                        <TableCell className="px-3 py-2">
                          {modalMode === "view" ? (
                            <span className={text}>{editProjectMarks[s.roll] || "-"}</span>
                          ) : (
                            <input
                              type="text"
                              value={editProjectMarks[s.roll] ?? ""}
                              onChange={(e) =>
                                handleEditMarksChange(
                                  s.roll,
                                  e.target.value,
                                  "project"
                                )
                              }
                              placeholder={`Max ${editProjectFullMark}`}
                              className={`w-full min-w-[90px] p-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                isDark
                                  ? "text-white bg-gray-700 border-gray-600"
                                  : "text-black border-gray-200"
                              }`}
                            />
                          )}
                        </TableCell>
                        <TableCell className="px-3 py-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {sm + pm}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Modal Footer */}
            <div
              className={`flex flex-col sm:flex-row gap-2 sm:justify-end p-4 sm:p-5 border-t ${cardHeader} flex-shrink-0`}
            >
              <Button
                variant="outline"
                onClick={() => setEditModal(false)}
                className={`w-full sm:w-auto ${
                  isDark
                    ? "border-gray-600 bg-gray-600 hover:bg-gray-700"
                    : ""
                }`}
              >
                {modalMode === "view" ? "Close" : "Cancel"}
              </Button>
              {modalMode === "edit" && (
                <Button
                  onClick={handleUpdate}
                  disabled={editLoading}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300"
                >
                  {editLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Marks
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AditionalSubjectMarkRegisterPage; 
