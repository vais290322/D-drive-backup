import React from "react";
import { useSelector } from "react-redux";
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

const LibrarianFormStepComponent = ({ step, formData, handleChange }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "light";
  
  const allBloodGroups = 
    useSelector((state) => state.settings.bloodGroupNames) || [];
  const allGenders = useSelector((state) => state.settings.genderNames) || [];
  const allReligions =
    useSelector((state) => state.settings.religionNames) || [];
  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // Updated input classes for better dark mode appearance
  const inputClasses = `mt-1 block w-full px-3 py-2 border ${
    isDarkMode 
      ? "bg-[#0f172a] border-gray-700 text-white placeholder-gray-400" 
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`;
  
  const labelClasses = `block text-sm font-medium ${
    isDarkMode ? "text-gray-200" : "text-gray-700"
  }`;

  // Updated select classes for consistent styling
  const selectTriggerClasses = `w-full px-3 py-2 ${
    isDarkMode 
      ? "bg-[#0f172a] border-gray-700 text-white" 
      : "bg-white border-gray-300 text-gray-900"
  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`;

  const selectContentClasses = isDarkMode 
    ? "bg-[#1e293b] border border-gray-700 text-white" 
    : "bg-white border border-gray-200";

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* FOR NAME  */}
            <div className="space-y-2">
              <label className={labelClasses}>
                Librarian's Name <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="librarianName"
                value={formData.librarianName}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter full name"
              />
            </div>
            
            {/* email */}
            <div className="space-y-2">
              <label className={labelClasses}>
                Email <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter email address"
              />
            </div>
            
            {/* phone */}
            <div className="space-y-2">
              <label className={labelClasses}>
                Phone Number <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter phone number"
              />
            </div>
            
            {/* alternative phone */}
            <div className="space-y-2">
              <label className={labelClasses}>
                Alternative Phone Number{" "}
                <span className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>(Optional)</span>
              </label>
              <input
                type="text"
                name="alternativePhone"
                value={formData.alternativePhone}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter alternative phone"
              />
            </div>

            {/* Blood Group  */}
            <div className="space-y-2">
              <label htmlFor="bloodGroup" className={labelClasses}>
                Blood Group <sup className="text-red-600">*</sup>
              </label>
              <Select
                onValueChange={(value) => {
                  const event = {
                    target: {
                      name: "bloodGroup",
                      value: value
                    }
                  };
                  handleChange(event);
                }}
                value={formData.bloodGroup}
              >
                <SelectTrigger className={selectTriggerClasses}>
                  <SelectValue placeholder="Select a blood group" />
                </SelectTrigger>
                <SelectContent className={selectContentClasses}>
                  <SelectGroup>
                    <SelectLabel className={isDarkMode ? "text-gray-300" : ""}>Blood Groups</SelectLabel>
                    {allBloodGroups.map((item, index) => (
                      <SelectItem key={index} value={item} className={isDarkMode ? "text-white hover:bg-slate-700" : ""}>
                        {capitalizeFirstLetter(item)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* for gender  */}
            <div className="space-y-2">
              <label htmlFor="gender" className={labelClasses}>
                Gender <sup className="text-red-600">*</sup>
              </label>
              <Select
                onValueChange={(value) => {
                  const event = {
                    target: {
                      name: "gender",
                      value: value
                    }
                  };
                  handleChange(event);
                }}
                value={formData.gender}
              >
                <SelectTrigger className={selectTriggerClasses}>
                  <SelectValue placeholder="Select a gender" />
                </SelectTrigger>
                <SelectContent className={selectContentClasses}>
                  <SelectGroup>
                    <SelectLabel className={isDarkMode ? "text-gray-300" : ""}>Genders</SelectLabel>
                    {allGenders.map((item, index) => (
                      <SelectItem key={index} value={item} className={isDarkMode ? "text-white hover:bg-slate-700" : ""}>
                        {capitalizeFirstLetter(item)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* for Religion */}
            <div className="space-y-2">
              <label htmlFor="religion" className={labelClasses}>
                Religion <sup className="text-red-600">*</sup>
              </label>
              <Select
                onValueChange={(value) => {
                  const event = {
                    target: {
                      name: "religion",
                      value: value
                    }
                  };
                  handleChange(event);
                }}
                value={formData.religion}
              >
                <SelectTrigger className={selectTriggerClasses}>
                  <SelectValue placeholder="Select a religion" />
                </SelectTrigger>
                <SelectContent className={selectContentClasses}>
                  <SelectGroup>
                    <SelectLabel className={isDarkMode ? "text-gray-300" : ""}>Religions</SelectLabel>
                    {allReligions.map((item, index) => (
                      <SelectItem key={index} value={item} className={isDarkMode ? "text-white hover:bg-slate-700" : ""}>
                        {capitalizeFirstLetter(item)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {/* for librarian image  */}
            <div className="space-y-2">
              <label className={labelClasses}>
                Librarian's Image <sup className="text-red-600">*</sup>
              </label>
              <div className={`relative ${
                isDarkMode 
                  ? "bg-[#0f172a] border-gray-700" 
                  : "bg-gray-50 border-gray-300"
              } border rounded-lg`}>
                <input
                  required
                  type="file"
                  name="librarianImage"
                  onChange={handleChange}
                  className={`block w-full py-2 px-3 text-sm ${
                    isDarkMode 
                      ? "text-gray-200 file:bg-slate-700 file:text-white file:border-gray-600 file:hover:bg-slate-600" 
                      : "text-gray-900 file:bg-gray-100 file:text-gray-700 file:border-gray-300 file:hover:bg-gray-200"
                  } rounded-lg border-0 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:text-sm file:font-medium file:transition-colors focus:outline-none`}
                />
              </div>
            </div>
            
            {/* for maritial status */}
            <div className="space-y-2">
              <label htmlFor="maritialStatus" className={labelClasses}>
                Marital Status <sup className="text-red-600">*</sup>
              </label>
              <select
                required
                id="maritialStatus"
                name="maritialStatus"
                value={formData.maritialStatus}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">Select Status</option>
                <option value="married">Married</option>
                <option value="unmarried">Unmarried</option>
              </select>
            </div>

            {/* for joining date */}
            <div className="space-y-2">
              <label className={labelClasses}>
                Joining Date <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* country  */}
            <div className="space-y-2">
              <label className={labelClasses}>
                Country <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter country"
              />
            </div>
            
            {/* pin code */}
            <div className="space-y-2">
              <label className={labelClasses}>
                Pin Code <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter pin code"
              />
            </div>
            
            {/* state  */}
            <div className="space-y-2">
              <label className={labelClasses}>
                State <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter state"
              />
            </div>
            
            {/* district  */}
            <div className="space-y-2">
              <label className={labelClasses}>
                District <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter district"
              />
            </div>
            
            {/* city  */}
            <div className="space-y-2">
              <label className={labelClasses}>
                City <span className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>(Optional)</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter city"
              />
            </div>
            
            {/* police station */}
            <div className="space-y-2">
              <label className={labelClasses}>
                Police Station <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="policeStation"
                value={formData.policeStation}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter police station"
              />
            </div>
            
            {/* vill+post  */}
            <div className="space-y-2">
              <label className={labelClasses}>
                Village, Post Office <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="villPost"
                value={formData.villPost}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter village and post office"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="p-0">{renderStepContent()}</div>;
};

export default LibrarianFormStepComponent;