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

const FormStep = ({ step, formData, handleChange }) => {
  const allBloodGroups = useSelector((state) => state.settings.bloodGroupNames) || [];
  const allGenders = useSelector((state) => state.settings.genderNames) || [];
  const allReligions = useSelector((state) => state.settings.religionNames) || [];
  const allSubjects = useSelector((state) => state.subject.subjectNames) || [];

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);
  

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4  `}>
            {/* FOR NAME  */}
            <div>
              <label className={`block text-sm font-medium  `}>
                Teacher Name <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="teachersName"
                value={formData.teachersName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
              />
            </div>
            {/* email */}
            <div>
              <label className="block text-sm font-medium ">
                Email <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            {/* phone */}
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
            {/* alternative phone */}
            <div>
              <label className="block text-sm font-medium ">
               Alternative Phone Number <span className="text-gray-400" >(Optional)</span>
              </label>
              <input
                required
                type="text"
                name="alternativePhone"
                value={formData.alternativePhone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

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
            {/* for teacher image  */}
            <div>
              <label className="block text-sm font-medium ">
                Teacher Image <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="file"
                name="teachersImage"
                onChange={handleChange}
                className="mt-1 block w-full py-2 px-3  text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:ring-green-500 focus:border-green-500 "
              />
            </div>
             {/* for maritial status */}
             <div className="flex flex-col items-start ">
              <label htmlFor="religion" className="text-sm font-medium ">
                Maritial Status <sup className="text-red-600">*</sup>
              </label>
              <select
                required
                id="maritalStatus"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-[#1f1f1f] border border-slate-200 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select Status</option>
                <option value="married">Married</option>
                <option value="unmarried">Unmarried</option>
              </select>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* for joining date */}
            <div>
              <label className="block text-sm font-medium ">
                Joining Date <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* for subject */}
            <div className="flex flex-col items-start ">
              <label htmlFor="religion" className="text-sm font-medium ">
                Subject <sup className="text-red-600">*</sup>
              </label>
              <Select
                className="border-red-600 border "
                onValueChange={(value)=>formData.subject=value}
              >
                <SelectTrigger className="w-full border border-gray-300 focus:ring-green-500 focus:border-green-500">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Subjects</SelectLabel>
                    {allSubjects.map((item, index) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
