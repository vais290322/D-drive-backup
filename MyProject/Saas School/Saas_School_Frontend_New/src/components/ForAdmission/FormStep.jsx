import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import axios from "axios";
import serviceUrlApi from "@/common/service";
const FormStep = ({ step, formData, handleChange }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "light";
  const allClass = useSelector((state) => state.class.classNames) || [];
  const allSection = useSelector((state) => state.section.sectionNames) || [];
  const allBloodGroups = useSelector((state) => state.settings.bloodGroupNames) || [];
  const allGenders = useSelector((state) => state.settings.genderNames) || [];
  const allReligions = useSelector((state) => state.settings.religionNames) || [];

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);
  
  const [serviceTypes, setServiceTypes] = useState([]);
  const schoolId = useSelector((state) => state.auth.schoolId);

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const response = await axios.get(`${serviceUrlApi.getServiceApi.url}/${schoolId}`);
        // If response.data is an array of objects with serviceType property
        setServiceTypes(Array.isArray(response.data) ? response.data : response.data.serviceType || []);
      } catch (error) {
        setServiceTypes([]);
      }
    };
    fetchServiceTypes();
  }, [schoolId]);


   // Updated input classes for better dark mode appearance
   const inputClasses = `mt-1 block w-full px-3 py-2 border ${
    isDarkMode 
      ? "bg-[#0f172a] border-gray-700 text-white placeholder-gray-400" 
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`;
  
  const labelClasses = `block text-sm font-medium ml-2 ${
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
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4  `}>
            {/* FOR NAME  */}
            <div>
              <label className={`block text-sm font-medium  `}>
                Student Name <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                className={inputClasses}
               
              />
            </div>
            {/* FOR ROLL  */}
            <div>
              <label className="block text-sm font-medium ">
                Roll No <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            {/* for class  */}
            <div>
              <label className="block text-sm font-medium ">
                Select Class <sup className="text-red-600">*</sup>
              </label>
              <Select
                className="border-red-600 border "
                onValueChange={(value)=>formData.className=value}
                name="className"
              >
                <SelectTrigger className={selectTriggerClasses}>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent className={selectContentClasses}>
                  <SelectGroup>
                    <SelectLabel className={isDarkMode ? "text-gray-300" : ""}>class</SelectLabel>
                    {allClass.map((item, index) => (
                      <SelectItem key={index} value={item} className={isDarkMode ? "text-white hover:bg-slate-700" : ""}>
                        {capitalizeFirstLetter(item)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {/* for section  */}
            <div>
              <label className="block text-sm font-medium ">
              Select Section <sup className="text-red-600">*</sup>
              </label>
              <Select
                className="border-red-600 border "
                onValueChange={(value)=>formData.section=value}
                name="section"
              >
                <SelectTrigger className={selectTriggerClasses}>
                  <SelectValue placeholder="Select a section" />
                </SelectTrigger>
                <SelectContent className={selectContentClasses}>
                  <SelectGroup>
                    <SelectLabel className={isDarkMode ? "text-gray-300" : ""}>sections</SelectLabel>
                    {allSection?.map((item, index) => (
                      <SelectItem key={index} value={item} className={isDarkMode ? "text-white hover:bg-slate-700" : ""}>
                        {capitalizeFirstLetter(item)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {/* for section  */}
            {/* <div>
              <label className="block text-sm font-medium ">
                Select Section <sup className="text-red-600">*</sup>
              </label>
              <Select
                className="border-red-600 border "
                onValueChange={(value)=>formData.section=value}
                name="section"
              >
                <SelectTrigger cclassName={selectTriggerClasses}>
                  <SelectValue placeholder="Select a section" />
                </SelectTrigger>
                <SelectContent className={selectContentClasses} >
                  <SelectGroup>
                    <SelectLabel className={isDarkMode ? "text-gray-300" : ""} >sections</SelectLabel>
                    {allSection.map((item, index) => (
                      <SelectItem key={index} value={item} className={isDarkMode ? "text-white hover:bg-slate-700" : ""}>
                        {capitalizeFirstLetter(item)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div> */}
            {/* for admission date */}
            <div>
              <label className="block text-sm font-medium ">
                Admission Date <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            {/* for academic year */}
            <div>
              <label className="block text-sm font-medium ">
                Academic Year <sup className="text-red-600">*</sup>
              </label>
              <input
              
                type="text"
                name="academicYear"
                min="1900"
                max="3099"
                value={formData.academicYear}
                onChange={handleChange}
                className={inputClasses}
                placeholder="e.g. 2025-2026"
                required
              />
            </div>

            {/* for student image  */}
          
            <div className="space-y-1">
              <label className={labelClasses}>
              Student's Image <sup className="text-red-600">*</sup>
              </label>
              <div className={`relative ${
                isDarkMode 
                  ? "bg-[#0f172a] border-gray-700" 
                  : "bg-gray-50 border-gray-300"
              } border rounded-lg`}>
                <input
                  required
                  type="file"
                  name="studentImage"
                  onChange={handleChange}
                  className={`mt-1 block w-full py-2 px-3 text-sm ${
                    isDarkMode 
                      ? "text-gray-200 file:bg-slate-700 file:text-white file:border-gray-600 file:hover:bg-slate-600" 
                      : "text-gray-900 file:bg-gray-100 file:text-gray-700 file:border-gray-300 file:hover:bg-gray-200"
                  } rounded-lg border-0 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:text-sm file:font-medium file:transition-colors focus:outline-none`}
                />
              </div>
            </div>

          </div>
        );
      
        // case 1:
        
        // return (
        //   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        //     <div>
        //       <label className="block text-lg font-medium pb-3">
        //         Service Type Name <sup className="text-red-600">*</sup>
        //       </label>
        //       <div className={`${theme === "light" ? "dark" : "light"}  bg-gradient-to-b ${theme === "light" ? "from-gray-900 to-gray-800" : "from-gray-50 to-white"} h-80 flex flex-col gap-3 border border-gray-400 rounded p-3 overflow-y-auto  bg-white w-[1200px]`}>
        //         {serviceTypes.length > 0 ? (
        //           serviceTypes.map((item, index) => {
        //             const valueObj = {
        //               serviceType: item.serviceType || item,
        //               description: item.description || "",
        //               charge: item.charge !== undefined ? item.charge : ""
        //             };
        //             // Check if this service is selected
        //             const checked = Array.isArray(formData.services)
        //               ? formData.services.some(
        //                   v =>
        //                     v.serviceType === valueObj.serviceType &&
        //                     v.description === valueObj.description &&
        //                     v.charge === valueObj.charge
        //                 )
        //               : false;
        //             return (
        //               <label
        //                 key={index}
        //                 className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:bg-purple-50 transition-all shadow-sm"
        //                 style={{ minHeight: "48px" }}
        //               >
        //                 <input
        //                   type="checkbox"
        //                   name="services"
        //                   value={valueObj.serviceType}
        //                   checked={checked}
        //                   onChange={e => {
        //                     let newValues = Array.isArray(formData.services)
        //                       ? [...formData.services]
        //                       : [];
        //                     if (e.target.checked) {
        //                       newValues.push(valueObj);
        //                     } else {
        //                       newValues = newValues.filter(
        //                         v =>
        //                           !(
        //                             v.serviceType === valueObj.serviceType &&
        //                             v.description === valueObj.description &&
        //                             v.charge === valueObj.charge
        //                           )
        //                       );
        //                     }
        //                     handleChange({
        //                       target: {
        //                         name: "services",
        //                         value: newValues
        //                       }
        //                     });
        //                   }}
        //                   className="w-5 h-5 accent-purple-500"
        //                 />
        //                 <span className="flex flex-row gap-16 items-center w-full">
        //                   <span className="font-medium text-base text-gray-800 min-w-[150px]">{valueObj.serviceType}</span>
        //                   <span className="text-gray-500 text-sm min-w-[250px]">
        //                     {valueObj.description}
        //                   </span>
        //                   {valueObj.charge !== "" && (
        //                     <span className="ml-2 text-purple-600 font-semibold min-w-[80px]">
        //                       ₹{valueObj.charge}
        //                     </span>
        //                   )}
        //                 </span>
        //               </label>
        //             );
        //           })
        //         ) : (
        //           <span className="text-gray-400">No services found</span>
        //         )}
        //       </div>
        //     </div>
        //   </div>
        // );


      case 1:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            {/* Blood Group  */}
            <div className="flex flex-col items-start space-y-1">
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
            <div className="flex flex-col items-start space-y-1">
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

            {/* for date of birth */}
            <div>
              <label className="block text-sm font-medium ">
                Date of Birth <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            {/* for Religion */}
            <div className="flex flex-col items-start space-y-1">
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

            {/* Other Academic Info Fields */}
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            {/* Father's Name */}
            <div>
              <label className="block text-sm font-medium ">
                Father's Name <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            {/* Mother's Name  */}
            <div>
              <label className="block text-sm font-medium ">
                Mother's Name <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            {/* phone number  */}
            <div>
              <label className="block text-sm font-medium ">
                Phone Number <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            {/* alternate phone number  */}
            <div>
              <label className="block text-sm font-medium ">
                Alternate Phone Number{" "}
                <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                name="alternativePhone"
                value={formData.alternativePhone}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            {/* joint image  */}
          
            <div className="space-y-1">
              <label className={labelClasses}>
              Parent's Joint Image 
              </label>
              <div className={`relative ${
                isDarkMode 
                  ? "bg-[#0f172a] border-gray-700" 
                  : "bg-gray-50 border-gray-300"
              } border rounded-lg`}>
                <input
                  
                  type="file"
                  name="jointImage"
                  onChange={handleChange}
                  className={`mt-1 block w-full py-2 px-3 text-sm ${
                    isDarkMode 
                      ? "text-gray-200 file:bg-slate-700 file:text-white file:border-gray-600 file:hover:bg-slate-600" 
                      : "text-gray-900 file:bg-gray-100 file:text-gray-700 file:border-gray-300 file:hover:bg-gray-200"
                  } rounded-lg border-0 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:text-sm file:font-medium file:transition-colors focus:outline-none`}
                />
              </div>
            </div>

            {/* parent's email  */}
            <div>
              <label className="block text-sm font-medium ">
                Parent's Email <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            {/* country  */}
            <div>
              <label className="block text-sm font-medium ">
                Country <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            {/* pin code */}
            <div>
              <label className="block text-sm font-medium ">
                Pin Code <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            {/* state  */}
            <div>
              <label className="block text-sm font-medium ">
                State <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            {/* district  */}
            <div>
              <label className="block text-sm font-medium ">
                District <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            {/* city  */}
            <div>
              <label className="block text-sm font-medium ">
                City <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            {/* police statioin */}
            <div>
              <label className="block text-sm font-medium ">
                Police Station <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="policeStation"
                value={formData.policeStation}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            {/* vill+post  */}
            <div>
              <label className="block text-sm font-medium ">
                Village, Post Office <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="villagePost"
                value={formData.villagePost}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <div>{renderStepContent()}</div>;
};

export default FormStep;
