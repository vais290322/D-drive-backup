import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X, User, Mail, ChevronDown } from "lucide-react";

const PostFilterDialog = ({ open, onOpenChange, filters, setFilters }) => {
  const { theme } = useTheme();
  const allClass = useSelector((state) => state.class.classNames) || [];
  const allSection = useSelector((state) => state.section.sectionNames) || [];
  const allTeachers = useSelector((state) => state.teacherInfo?.teacherInfo || []);
  const userRole = useSelector((state) => state?.auth?.user);
  
  const [tempFilters, setTempFilters] = React.useState({ ...filters });
  const [teacherInputType, setTeacherInputType] = React.useState("dropdown");
  const [selectedTeacher, setSelectedTeacher] = React.useState(null);
  
  const handleReset = () => {
    setTempFilters({
      audience: "all",
      class: "",
      section: "",
      student: "",
      teacher: "",
      teacherEmail: ""
    });
    setSelectedTeacher(null);
  };
  
  const handleApply = () => {
    // Make sure we're passing the complete filter object
    const finalFilters = {
      ...tempFilters,
      // Make sure these fields are properly set
      audience: tempFilters.audience || "all",
      class: tempFilters.class || "",
      section: tempFilters.section || "",
      student: tempFilters.student || "",
      teacher: tempFilters.teacher || "",
      teacherEmail: tempFilters.teacherEmail || ""
    };
    
    console.log("Applying filters:", finalFilters); // Add logging
    setFilters(finalFilters);
    onOpenChange(false);
  };
  
  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
    setTempFilters({
      ...tempFilters,
      teacherEmail: teacher.email
    });
  };
  
  React.useEffect(() => {
    if (open) {
      setTempFilters({ ...filters });
      // If there's a teacher email in filters, try to find the matching teacher
      if (filters.teacherEmail) {
        const teacher = allTeachers.find(t => t.email === filters.teacherEmail);
        setSelectedTeacher(teacher || null);
      } else {
        setSelectedTeacher(null);
      }
    }
  }, [open, filters, allTeachers]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`w-[95vw] max-w-md max-h-[90vh] overflow-y-auto ${
        theme === "light" ? "bg-gray-800 text-white border-gray-700" : ""
      }`}>
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Filter Posts</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 sm:space-y-4 mt-2">
          <div>
            <Label htmlFor="audience" className="text-sm font-medium">Show Posts For</Label>
            <Select
              value={tempFilters.audience}
              onValueChange={(value) => setTempFilters({ ...tempFilters, audience: value })}
            >
              <SelectTrigger className={`mt-1 ${
                theme === "light" ? "bg-gray-700 border-gray-600" : ""
              }`}>
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent className={
                theme === "light" ? "bg-gray-700 border-gray-600" : ""
              }>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="class">Class Specific</SelectItem>
                <SelectItem value="student">Student Specific</SelectItem>
                {userRole === "admin" && (
                  <>
                    <SelectItem value="allTeachers">All Teachers</SelectItem>
                    <SelectItem value="specificTeacher">Specific Teacher</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          
          {tempFilters.audience === "class" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="class" className="text-sm font-medium">Class</Label>
                <Select
                  value={tempFilters.class}
                  onValueChange={(value) => setTempFilters({ ...tempFilters, class: value })}
                >
                  <SelectTrigger className={`mt-1 ${
                    theme === "light" ? "bg-gray-700 border-gray-600" : ""
                  }`}>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent className={
                    theme === "light" ? "bg-gray-700 border-gray-600" : ""
                  }>
                    <SelectItem value="all_classes">All Classes</SelectItem>
                    {allClass.map((className, index) => (
                      <SelectItem key={index} value={className}>
                        {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="section" className="text-sm font-medium">Section</Label>
                <Select
                  value={tempFilters.section}
                  onValueChange={(value) => setTempFilters({ ...tempFilters, section: value })}
                >
                  <SelectTrigger className={`mt-1 ${
                    theme === "light" ? "bg-gray-700 border-gray-600" : ""
                  }`}>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent className={
                    theme === "light" ? "bg-gray-700 border-gray-600" : ""
                  }>
                    <SelectItem value="all_sections">All Sections</SelectItem>
                    {allSection.map((section, index) => (
                      <SelectItem key={index} value={section}>
                        {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {tempFilters.audience === "student" && (
            <div>
              <Label htmlFor="student" className="text-sm font-medium">Admission Number</Label>
              <Input
                id="student"
                value={tempFilters.student}
                onChange={(e) => setTempFilters({ ...tempFilters, student: e.target.value })}
                placeholder="Enter admission number"
                className={`mt-1 text-sm ${theme === "light" ? "bg-gray-700 border-gray-600" : ""}`}
              />
            </div>
          )}
          
          {userRole === "admin" && tempFilters.audience === "specificTeacher" && (
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Label htmlFor="teacherInputType" className="text-sm font-medium">Select teacher by:</Label>
                <div className="flex rounded-md overflow-hidden border">
                  <button
                    type="button"
                    onClick={() => setTeacherInputType("dropdown")}
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm ${
                      teacherInputType === "dropdown"
                        ? "bg-indigo-600 text-white"
                        : theme === "light"
                          ? "bg-gray-700"
                          : "bg-gray-100"
                    }`}
                  >
                    List
                  </button>
                  <button
                    type="button"
                    onClick={() => setTeacherInputType("manual")}
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm ${
                      teacherInputType === "manual"
                        ? "bg-indigo-600 text-white"
                        : theme === "light"
                          ? "bg-gray-700"
                          : "bg-gray-100"
                    }`}
                  >
                    Manual
                  </button>
                </div>
              </div>
              
              {teacherInputType === "dropdown" ? (
                <div>
                  <Label htmlFor="teacherSelect" className="text-sm font-medium">Select Teacher</Label>
                  <div className={`relative mt-1 ${
                    theme === "light" ? "text-white" : ""
                  }`}>
                    <div
                      className={`flex items-center justify-between p-2 border rounded-md cursor-pointer ${
                        theme === "light" ? "bg-gray-700 border-gray-600" : ""
                      }`}
                      onClick={() => document.getElementById("teacherFilterDropdown").classList.toggle("hidden")}
                    >
                      <div className="flex items-center">
                        {selectedTeacher ? (
                          <>
                            <User className="h-4 w-4 mr-2" />
                            <span>{selectedTeacher.name} ({selectedTeacher.email})</span>
                          </>
                        ) : (
                          <span className="text-gray-400">Select a teacher</span>
                        )}
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                    
                    <div
                      id="teacherFilterDropdown"
                      className={`absolute z-10 w-full mt-1 max-h-48 sm:max-h-60 overflow-auto rounded-md shadow-lg hidden ${
                        theme === "light" ? "bg-gray-700 border-gray-600" : "bg-white border border-gray-200"
                      }`}
                    >
                      {allTeachers.length > 0 ? (
                        allTeachers.map((teacher) => (
                          <div
                            key={teacher.id || teacher.email}
                            className={`p-2 cursor-pointer flex items-center ${
                              theme === "light" 
                                ? "hover:bg-gray-600" 
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              handleTeacherSelect(teacher);
                              document.getElementById("teacherFilterDropdown").classList.add("hidden");
                            }}
                          >
                            <User className="h-4 w-4 mr-2" />
                            <div>
                              <div>{teacher.name}</div>
                              <div className={`text-xs ${
                                theme === "light" ? "text-gray-400" : "text-gray-500"
                              }`}>
                                {teacher.email}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-center text-gray-500">No teachers available</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="teacherEmail" className="text-sm font-medium">Teacher Email</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                    <Input
                      id="teacherEmail"
                      value={tempFilters.teacherEmail || ""}
                      onChange={(e) => setTempFilters({ ...tempFilters, teacherEmail: e.target.value })}
                      placeholder="Enter teacher email"
                      type="email"
                      className={`text-sm ${theme === "light" ? "bg-gray-700 border-gray-600" : ""}`}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 mt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className={`w-full sm:w-auto ${theme === "light" ? "bg-gray-700 hover:bg-gray-600" : ""}`}
          >
            <X className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-sm sm:text-base">Reset</span>
          </Button>
          <Button
            onClick={handleApply}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <Filter className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-sm sm:text-base">Apply Filters</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostFilterDialog;