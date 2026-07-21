import React from 'react';
import { useSelector } from 'react-redux';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Calendar, Hash, User, Users } from "lucide-react";

const IssueFormComponent = ({ step, formData, handleChange, theme }) => {
  const allClass = useSelector((state) => state.class.classNames) || [];
  const allSection = useSelector((state) => state.section.sectionNames) || [];
  
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Book Name */}
            <div className="space-y-2">
              <Label htmlFor="bookName" className={`text-base ${theme === "light" ? "text-gray-200" : "text-gray-700"}`}>
                Book Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  required
                  type="text"
                  id="bookName"
                  name="bookName"
                  value={formData.bookName}
                  onChange={handleChange}
                  placeholder="Enter book name"
                  className={`pl-10 ${theme === "light" ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "bg-white border-gray-300 placeholder:text-gray-400"}`}
                />
              </div>
            </div>
            
            {/* Book Number */}
            <div className="space-y-2">
              <Label htmlFor="bookNumber" className={`text-base ${theme === "light" ? "text-gray-200" : "text-gray-700"}`}>
                Book Number <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  required
                  type="text"
                  id="bookNumber"
                  name="bookNumber"
                  value={formData.bookNumber}
                  onChange={handleChange}
                  placeholder="Enter book number"
                  className={`pl-10 ${theme === "light" ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "bg-white border-gray-300 placeholder:text-gray-400"}`}
                />
              </div>
            </div>
            
            {/* Issue Date */}
            <div className="space-y-2">
              <Label htmlFor="issueDate" className={`text-base ${theme === "light" ? "text-gray-200" : "text-gray-700"}`}>
                Issue Date <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  required
                  type="date"
                  id="issueDate"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  className={`pl-10 ${theme === "light" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                />
              </div>
            </div>
            
            {/* Return Date */}
            <div className="space-y-2">
              <Label htmlFor="returnDate" className={`text-base ${theme === "light" ? "text-gray-200" : "text-gray-700"}`}>
                Return Date <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  required
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  className={`pl-10 ${theme === "light" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                />
              </div>
            </div>
            
            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity" className={`text-base ${theme === "light" ? "text-gray-200" : "text-gray-700"}`}>
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                required
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                min="1"
                className={`${theme === "light" ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "bg-white border-gray-300 placeholder:text-gray-400"}`}
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Student Name */}
            <div className="space-y-2">
              <Label htmlFor="studentName" className={`text-base ${theme === "light" ? "text-gray-200" : "text-gray-700"}`}>
                Student Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  required
                  type="text"
                  id="studentName"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  className={`pl-10 ${theme === "light" ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "bg-white border-gray-300 placeholder:text-gray-400"}`}
                />
              </div>
            </div>
            
            {/* Student ID */}
            <div className="space-y-2">
              <Label htmlFor="studentId" className={`text-base ${theme === "light" ? "text-gray-200" : "text-gray-700"}`}>
                Student ID <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  required
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="Enter student ID"
                  className={`pl-10 ${theme === "light" ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" : "bg-white border-gray-300 placeholder:text-gray-400"}`}
                />
              </div>
            </div>
            
            {/* Class */}
            <div className="space-y-2">
              <Label htmlFor="classAssigned" className={`text-base ${theme === "light" ? "text-gray-200" : "text-gray-700"}`}>
                Class Assigned <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                <select
                  required
                  id="classAssigned"
                  name="classAssigned"
                  value={formData.classAssigned}
                  onChange={handleChange}
                  className={`pl-10 w-full h-10 rounded-md border px-3 py-2 ${
                    theme === "light" 
                      ? "bg-gray-700 border-gray-600 text-white" 
                      : "bg-white border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                  <option value="" disabled>Select a class</option>
                  {allClass.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Section */}
            <div className="space-y-2">
              <Label htmlFor="section" className={`text-base ${theme === "light" ? "text-gray-200" : "text-gray-700"}`}>
                Section <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                <select
                  required
                  id="section"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className={`pl-10 w-full h-10 rounded-md border px-3 py-2 ${
                    theme === "light" 
                      ? "bg-gray-700 border-gray-600 text-white" 
                      : "bg-white border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                  <option value="" disabled>Select a section</option>
                  {allSection.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderStepContent()}
    </div>
  );
};

export default IssueFormComponent;


