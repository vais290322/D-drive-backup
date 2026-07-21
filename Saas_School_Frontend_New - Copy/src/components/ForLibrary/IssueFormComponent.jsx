import React from 'react'
import { useSelector } from 'react-redux';
const IssueFormComponent = ({ step, formData, handleChange }) => {
  const allClass = useSelector((state) => state.class.classNames) || [];
  const allSection = useSelector((state) => state.section.sectionNames) || [];
  
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Book Name */}
            <div>
              <label className="block text-sm font-medium">
                Book Name <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="bookName"
                value={formData.bookName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Book Number */}
            <div>
              <label className="block text-sm font-medium">
                Book Number <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="bookNumber"
                value={formData.bookNumber}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Issue Date */}
            <div>
              <label className="block text-sm font-medium">
                Issue Date <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Return Date */}
            <div>
              <label className="block text-sm font-medium">
                Return Date <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium">
                Quantity <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Name */}
            <div>
              <label className="block text-sm font-medium">
                Student Name <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Student ID */}
            <div>
              <label className="block text-sm font-medium">
                Student ID <sup className="text-red-600">*</sup>
              </label>
              <input
                required
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Class */}
            <div>
              <label className="block text-sm font-medium">
                Class Assigned <sup className="text-red-600">*</sup>
              </label>
              <select
                required
                name="classAssigned"
                value={formData.classAssigned}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>
                  Select a class
                </option>
                {allClass.map((item,index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            {/* Section */}
            <div>
              <label className="block text-sm font-medium">
                Section <sup className="text-red-600">*</sup>
              </label>
              <select
                required
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>
                  Select a section
                </option>
                {allSection.map((item,index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <div>{renderStepContent()}</div>;
};

export default IssueFormComponent;


