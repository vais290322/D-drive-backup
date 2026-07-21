import React from "react";
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
const FormStep = ({ step, formData, handleChange }) => {
  const { theme } = useTheme();
  const allClass = useSelector((state) => state.class.classNames) || [];
  const allSection = useSelector((state) => state.section.sectionNames) || [];
  const allBloodGroups = useSelector((state) => state.settings.bloodGroupNames) || [];
  const allGenders = useSelector((state) => state.settings.genderNames) || [];
  const allReligions = useSelector((state) => state.settings.religionNames) || [];

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);
  

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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                <SelectTrigger className="w-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>class</SelectLabel>
                    {allClass.map((item, index) => (
                      <SelectItem key={index} value={item}>
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
                <SelectTrigger className="border border-gray-300 focus:ring-green-500 focus:border-green-500 ">
                  <SelectValue placeholder="Select a section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>sections</SelectLabel>
                    {allSection.map((item, index) => (
                      <SelectItem key={index} value={item}>
                        {capitalizeFirstLetter(item)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* for student image  */}
            <div>
              <label className="block text-sm font-medium ">
                Student Image <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="file"
                name="studentImage"
                onChange={handleChange}
                className="mt-1 block w-full py-2 px-3  text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:ring-green-500 focus:border-green-500 "
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            {/* Blood Group  */}
            <div className="flex flex-col items-start ">
              <label htmlFor="bloodGroup" className="text-sm font-medium ">
                Blood Group <sup className="text-red-600">*</sup>
              </label>
              <Select
                className="border-red-600 border "
                onValueChange={(value)=>formData.bloodGroup=value}
              >
                <SelectTrigger className="w-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Select a blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Blood Groups</SelectLabel>
                    {allBloodGroups.map((item, index) => (
                      <SelectItem key={index} value={item}>
                        {capitalizeFirstLetter(item)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* for gender  */}
            <div className="flex flex-col items-start ">
              <label htmlFor="gender" className="text-sm font-medium ">
                Gender <sup className="text-red-600">*</sup>
              </label>
              <Select
                className="border-red-600 border "
                onValueChange={(value)=>formData.gender=value}
              >
                <SelectTrigger className="w-full border border-gray-300 focus:ring-green-500 focus:border-green-500">
                  <SelectValue placeholder="Select a gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Genders</SelectLabel>
                    {allGenders.map((item, index) => (
                      <SelectItem key={index} value={item}>
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* for Religion */}
            <div className="flex flex-col items-start ">
              <label htmlFor="religion" className="text-sm font-medium ">
                Religion <sup className="text-red-600">*</sup>
              </label>
              <Select
                className="border-red-600 border "
                onValueChange={(value)=>formData.religion=value}
              >
                <SelectTrigger className="w-full border border-gray-300 focus:ring-green-500 focus:border-green-500">
                  <SelectValue placeholder="Select a religion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Religions</SelectLabel>
                    {allReligions.map((item, index) => (
                      <SelectItem key={index} value={item}>
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            {/* joint image  */}
            <div>
              <label className="block text-sm font-medium ">
                Parent's Joint Image <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="file"
                name="jointImage"
                onChange={handleChange}
                className="mt-1 block w-full py-2 px-3  text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:ring-blue-500 focus:border-blue-500"
              />
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
