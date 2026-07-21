import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { backendDomainN } from "../../Common/index";
import { Link, Plus, Pencil, Trash2, Search } from "lucide-react";

const RecruitmentTrainingPage = () => {
  // State for candidates data
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState(null);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for search
  const [searchTerm, setSearchTerm] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewCandidate, setViewCandidate] = useState(null);

  // State for onboarding dialog
  const [onboardDialogOpen, setOnboardDialogOpen] = useState(false);
  const [onboardingCandidate, setOnboardingCandidate] = useState(null);
  const [onboardFormData, setOnboardFormData] = useState({
    employeeCode: "",
    status: "Active",
  });
  // State for address checkbox
  const [sameAsPermAddress, setSameAsPermAddress] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    description: "", // remove this field
    expectedSalary: "", // remove this field
    // Add other fields as needed
    fullName: "",
    doj: "",
    sex: "",
    father: "",
    dob: "",
    religion: "",
    weight: "",
    height: "",
    bloodGroup: "",
    chest: "",
    identificationMark: "",
    emergencyPhone: "",
    nearestBusStop: "",
    aadhaarNumber: "",
    aadhaarImage: "",
    panNumber: "",
    panImage: "",
    docs: "",
    certificate: "",
    designation:"",

    // bank details
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
    passbookImage: "",
    uanNumber: "",
    esicNumber: "",
    pfNumber:"",

    // other
    maritalStatus: "",
    nomineeName: "",
    nomineeRelation: "",

    // parmanent address
    permanentVill: "",
    permanentPost: "",
    permanentPS: "",
    permanentDist: "",
    permanentState: "",
    permanentPinCode: "",
    permanentPhone: "",
    // current address
    presentVill: "",
    presentPost: "",
    presentPS: "",
    presentDist: "",
    presentState: "",
    presentPinCode: "",
    presentPhone: "",
    // education details
    qualification: "",
    previousExperience: "",

    // Family Details
    familyDetails: [],
  });

  const [familyMembers, setFamilyMembers] = useState([
    {
      name: "",
      age: "",
      relation: "",
      dob: "",
      phone: "",
      residing: true,
    },
  ]);

  // Fetch candidates on component mount
  useEffect(() => {
    fetchCandidates();
  }, []);

  // Function to fetch candidates
  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendDomainN}/onboarding`);
      if (response) {
        setCandidates(response.data.data);
      } else {
        setError("Failed to fetch candidates");
        toast.error("Failed to fetch candidates");
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError("Error fetching candidates. Please try again.");
      toast.error("Error fetching candidates");
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog open for adding new candidate
  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentCandidate(null);
    setSameAsPermAddress(false);
    // Reset form data with all fields
    setFormData({
      email: "",
      phone: "",
      fullName: "",
      doj: "",
      sex: "",
      father: "",
      dob: "",
      religion: "",
      weight: "",
      height: "",
      bloodGroup: "",
      chest: "",
      identificationMark: "",
      emergencyPhone: "",
      nearestBusStop: "",
      aadhaarNumber: "",
      aadhaarImage: "",
      panNumber: "",
      panImage: "",
      docs: "",
      certificate: "",

      // bank details
      bankName: "",
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      branchName: "",
      passbookImage: "",
      uanNumber: "",
      esicNumber: "",
      pfNumber: "",

      // other
      maritalStatus: "",
      nomineeName: "",
      nomineeRelation: "",

      // permanent address
      permanentVill: "",
      permanentPost: "",
      permanentPS: "",
      permanentDist: "",
      permanentState: "",
      permanentPinCode: "",
      permanentPhone: "",

      // current address
      presentVill: "",
      presentPost: "",
      presentPS: "",
      presentDist: "",
      presentState: "",
      presentPinCode: "",
      presentPhone: "",

      // education details
      qualification: "",
      previousExperience: "",

      // Family Details
      familyDetails: [],
    });

    // Initialize family members
    setFamilyMembers([
      {
        name: "",
        age: "",
        relation: "",
        dob: "",
        phone: "",
        residing: true,
      },
    ]);

    setOpenDialog(true);
  };

  // Handle dialog open for editing candidate
  const handleEditClick = (candidate) => {
    setIsEditing(true);
    setCurrentCandidate(candidate);
    setSameAsPermAddress(false);

    // Populate form with candidate data or default empty values
    setFormData({
      email: candidate.email || "",
      phone: candidate.phone || "",
      fullName: candidate.fullName || "",
      doj: candidate.doj || "",
      sex: candidate.sex || "",
      father: candidate.father || "",
      dob: candidate.dob || "",
      religion: candidate.religion || "",
      weight: candidate.weight || "",
      height: candidate.height || "",
      bloodGroup: candidate.bloodGroup || "",
      chest: candidate.chest || "",
      identificationMark: candidate.identificationMark || "",
      emergencyPhone: candidate.emergencyPhone || "",
      nearestBusStop: candidate.nearestBusStop || "",
      aadhaarNumber: candidate.aadhaarNumber || "",
      aadhaarImage: candidate.aadhaarImage || "",
      panNumber: candidate.panNumber || "",
      panImage: candidate.panImage || "",
      docs: candidate.docs || "",
      certificate: candidate.certificate || "",

      // bank details
      bankName: candidate.bankName || "",
      accountHolderName: candidate.accountHolderName || "",
      accountNumber: candidate.accountNumber || "",
      ifscCode: candidate.ifscCode || "",
      branchName: candidate.branchName || "",
      passbookImage: candidate.passbookImage || "",
      uanNumber: candidate.uanNumber || "",
      esicNumber: candidate.esicNumber || "",
      pfNumber: candidate.pfNumber || "",

      // other
      maritalStatus: candidate.maritalStatus || "",
      nomineeName: candidate.nomineeName || "",
      nomineeRelation: candidate.nomineeRelation || "",

      // permanent address
      permanentVill: candidate.permanentVill || "",
      permanentPost: candidate.permanentPost || "",
      permanentPS: candidate.permanentPS || "",
      permanentDist: candidate.permanentDist || "",
      permanentState: candidate.permanentState || "",
      permanentPinCode: candidate.permanentPinCode || "",
      permanentPhone: candidate.permanentPhone || "",
      designation:candidate.designation || "",

      // current address
      presentVill: candidate.presentVill || "",
      presentPost: candidate.presentPost || "",
      presentPS: candidate.presentPS || "",
      presentDist: candidate.presentDist || "",
      presentState: candidate.presentState || "",
      presentPinCode: candidate.presentPinCode || "",
      presentPhone: candidate.presentPhone || "",

      // education details
      qualification: candidate.qualification || "",
      previousExperience: candidate.previousExperience || "",

      // Family Details
      familyDetails: candidate.familyDetails || [],
    });

    // Initialize family members from candidate data or with default
    setFamilyMembers(
      candidate.familyDetails && candidate.familyDetails.length > 0
        ? candidate.familyDetails
        : [
            {
              name: "",
              age: "",
              relation: "",
              dob: "",
              phone: "",
              residing: true,
            },
          ]
    );

    setOpenDialog(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle family member input changes
  const handleFamilyMemberChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newFamilyMembers = [...familyMembers];

    // Handle checkbox for residing field
    if (type === "checkbox") {
      newFamilyMembers[index][name] = checked;
    } else {
      newFamilyMembers[index][name] = value;
    }

    setFamilyMembers(newFamilyMembers);
  };

  // Handle same as permanent address checkbox
  const handleSameAddressChange = (e) => {
    const isChecked = e.target.checked;
    setSameAsPermAddress(isChecked);

    if (isChecked) {
      // Copy permanent address to present address
      setFormData({
        ...formData,
        presentVill: formData.permanentVill,
        presentPost: formData.permanentPost,
        presentPS: formData.permanentPS,
        presentDist: formData.permanentDist,
        presentState: formData.permanentState,
        presentPinCode: formData.permanentPinCode,
        presentPhone: formData.permanentPhone,
      });
    }
  };

  // Add new family member
  const handleAddFamilyMember = () => {
    setFamilyMembers([
      ...familyMembers,
      {
        name: "",
        age: "",
        relation: "",
        dob: "",
        phone: "",
        residing: true,
      },
    ]);
  };

  // Remove family member
  const handleRemoveFamilyMember = (index) => {
    const newFamilyMembers = [...familyMembers];
    newFamilyMembers.splice(index, 1);
    setFamilyMembers(newFamilyMembers);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const form = new FormData();

      // Append all fields from formData
      for (const key in formData) {
        const value = formData[key];

        if (key === "familyDetails") continue; // handle separately below
        if (
          isEditing &&
          (key === "aadhaarImage" ||
            key === "panImage" ||
            key === "passbookImage" ||
            key === "docs" ||
            key === "certificate") &&
          (value === "" ||
            value === null ||
            value === undefined ||
            (typeof value === "string" && value.includes("cloudinary.com")))
        ) {
          continue; // Skip this field
        }
        // If it's a file (Image/File object), append as-is
        form.append(key, value);
      }

      // Add family details as JSON string
      form.append("familyDetails", JSON.stringify(familyMembers));

      if (isEditing && currentCandidate) {
        const response = await axios.put(
          `${backendDomainN}/onboarding/${currentCandidate.id}`,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response) {
          toast.success("Candidate updated successfully");
          fetchCandidates();
        } else {
          toast.error("Failed to update candidate");
        }
      } else {
        const response = await axios.post(
          `${backendDomainN}/onboarding`,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response) {
          toast.success("Candidate added successfully");
          fetchCandidates();
        } else {
          toast.error("Failed to add candidate");
        }
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Error submitting candidate:", error);
      toast.error(
        error?.response?.data?.message || "Error submitting candidate data"
      );
    } finally {
      setIsSubmitting(false); // Reset loading state regardless of outcome
    }
  };

  // Handle delete candidate
  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      setIsDeleting(true);
      try {
        const response = await axios.delete(
          `${backendDomainN}/onboarding/${id}`
        );
        if (response) {
          toast.success("Candidate deleted successfully");
          fetchCandidates();
        } else {
          toast.error("Failed to delete candidate");
        }
      } catch (error) {
        // console.error('Error deleting candidate:', error);
        toast.error(
          error?.response?.data?.message || "Error deleting candidate"
        );
      } finally {
        setIsDeleting(false); // Reset loading state regardless of outcome
      }
    }
  };

  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter candidates based on search term
  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.phone?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      candidate.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.sex?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.qualification?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.doj?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.dob?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewClick = (candidate) => {
    setViewCandidate(candidate);
    setViewDialogOpen(true);
  };

  // Add this function to close view dialog
  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setViewCandidate(null);
  };

  const handleOnboardClick = (candidate) => {
    setOnboardingCandidate(candidate);
    setOnboardFormData({
      employeeCode: "",
      status: "Active",
    });
    setOnboardDialogOpen(true);
  };

  const handleCloseOnboardDialog = () => {
    setOnboardDialogOpen(false);
    setOnboardingCandidate(null);
  };

  const handleOnboardInputChange = (e) => {
    const { name, value } = e.target;
    setOnboardFormData({
      ...onboardFormData,
      [name]: value,
    });
  };

  const handleOnboardSubmit = async () => {
    setIsOnboarding(true);
    try {
      const response = await axios.post(
        `${backendDomainN}/onboarding/convert-to-employee/${onboardingCandidate.id}?employeeCode=${onboardFormData.employeeCode}&status=${onboardFormData.status}`
      );

      if (response.data.data) {
        toast.success("Candidate onboarded successfully");
        fetchCandidates(); // Refresh the candidates list
        handleCloseOnboardDialog();
      } else {
        toast.error(response.data.message || "Failed to onboard candidate");
      }
    } catch (error) {
      console.error("Error onboarding candidate:", error);
      toast.error(
        error?.response?.data?.message || "Error onboarding candidate"
      );
    } finally {
      setIsOnboarding(false); // Reset loading state regardless of outcome
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Recruitment Management</h1>
          <p className="text-gray-600">Manage candidate recruitment process</p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
          onClick={handleAddClick}
        >
          <Plus size={16} />
          Add Candidate
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 mb-6 rounded shadow">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sl.NO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DOJ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qualification
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Loading candidates...
                    </p>
                  </td>
                </tr>
              ) : filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <p className="text-gray-500">No candidates found</p>
                    <button
                      className="mt-2 text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                      onClick={handleAddClick}
                    >
                      Add your first candidate
                    </button>
                  </td>
                </tr>
              ) : (
                filteredCandidates
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((candidate, index) => (
                    <tr key={candidate._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {page * rowsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {candidate.fullName || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{candidate.email || "N/A"}</div>
                        <div className="text-gray-500">
                          {candidate.phone || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {candidate.doj || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {candidate.qualification || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 mr-3 cursor-pointer"
                          onClick={() => handleViewClick(candidate)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 inline"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View
                        </button>

                        {!candidate?.employee ? (
                          <button
                            className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                            onClick={() => handleOnboardClick(candidate)}
                          >
                            Onboard
                          </button>
                        ) : (
                          // <p className="text-green-400">Employee</p>
                          <button
                            className="text-green-400 hover:text-green-900 mr-3 cursor-not-allowed "
                            // onClick={() => handleOnboardClick(candidate)}
                          >
                            Employee
                          </button>
                        )}

                        <button
                          className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                          onClick={() => handleEditClick(candidate)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                          onClick={() => handleDeleteClick(candidate.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <svg
                              className="animate-spin h-4 w-4"
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
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
        {/* pagination  */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex items-center">
            <select
              className="mr-2 border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
            >
              {[5, 10, 25, 50, 100, 200, 500].map((option) => (
                <option key={option} value={option}>
                  {option} per page
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">
              Showing {page * rowsPerPage + 1} to{" "}
              {Math.min((page + 1) * rowsPerPage, filteredCandidates.length)} of{" "}
              {filteredCandidates.length} entries
            </span>
          </div>
          <div className="flex justify-between">
            <button
              onClick={(e) => handleChangePage(e, page - 1)}
              disabled={page === 0}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-2 ${
                page === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              Previous
            </button>
            <button
              onClick={(e) => handleChangePage(e, page + 1)}
              disabled={
                page >= Math.ceil(filteredCandidates.length / rowsPerPage) - 1
              }
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                page >= Math.ceil(filteredCandidates.length / rowsPerPage) - 1
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Candidate Dialog */}
      {openDialog && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {isEditing ? "Edit Candidate" : "Add New Candidate"}
                </h3>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[70vh] overflow-y-auto">
                <form className="space-y-6">
                  {/* Personal Information Section */}
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="text-md font-medium text-gray-800 mb-4">
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.fullName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Designation
                        </label>
                        <input
                          type="text"
                          id="designation"
                          name="designation"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.designation}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="doj"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Date of Joining
                        </label>
                        <input
                          type="date"
                          id="doj"
                          name="doj"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.doj}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="sex"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Sex
                        </label>
                        <select
                          id="sex"
                          name="sex"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.sex}
                          onChange={handleInputChange}
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="father"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Father's Name/ Husband:
                        </label>
                        <input
                          type="text"
                          id="father"
                          name="father"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.father}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="dob"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          id="dob"
                          name="dob"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.dob}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="religion"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Religion
                        </label>
                        <input
                          type="text"
                          id="religion"
                          name="religion"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.religion}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="maritalStatus"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Marital Status
                        </label>
                        <select
                          id="maritalStatus"
                          name="maritalStatus"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.maritalStatus}
                          onChange={handleInputChange}
                        >
                          <option value="">Select</option>
                          <option value="single">Single</option>
                          <option value="married">Married</option>
                          <option value="divorced">Divorced</option>
                          <option value="widowed">Widowed</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Physical Details Section */}
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="text-md font-medium text-gray-800 mb-4">
                      Physical Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="weight"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Weight (kg)
                        </label>
                        <input
                          type="text"
                          id="weight"
                          name="weight"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.weight}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="height"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Height (cm)
                        </label>
                        <input
                          type="text"
                          id="height"
                          name="height"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.height}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="bloodGroup"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Blood Group
                        </label>
                        <select
                          id="bloodGroup"
                          name="bloodGroup"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.bloodGroup}
                          onChange={handleInputChange}
                        >
                          <option value="">Select</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="chest"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Chest (inches)
                        </label>
                        <input
                          type="text"
                          id="chest"
                          name="chest"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.chest}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="identificationMark"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Identification Mark
                        </label>
                        <input
                          type="text"
                          id="identificationMark"
                          name="identificationMark"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.identificationMark}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact & Emergency Information */}
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="text-md font-medium text-gray-800 mb-4">
                      Contact & Emergency Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="emergencyPhone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Emergency Contact
                        </label>
                        <input
                          type="tel"
                          id="emergencyPhone"
                          name="emergencyPhone"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.emergencyPhone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="nearestBusStop"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Nearest Railway Station/ Bus Stop:
                        </label>
                        <input
                          type="text"
                          id="nearestBusStop"
                          name="nearestBusStop"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.nearestBusStop}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="nomineeName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Nominee Name
                        </label>
                        <input
                          type="text"
                          id="nomineeName"
                          name="nomineeName"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.nomineeName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="nomineeRelation"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Nominee Relation
                        </label>
                        <input
                          type="text"
                          id="nomineeRelation"
                          name="nomineeRelation"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.nomineeRelation}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ID Documents */}
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="text-md font-medium text-gray-800 mb-4">
                      ID Documents
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="aadhaarNumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Aadhaar Number
                        </label>
                        <input
                          type="text"
                          id="aadhaarNumber"
                          name="aadhaarNumber"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.aadhaarNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="aadhaarImage"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Aadhaar Image
                        </label>
                        <input
                          type="file"
                          id="aadhaarImage"
                          name="aadhaarImage"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          onChange={(e) => {
                            // Handle file upload logic here
                            // For now, just update the form state with the file name
                            handleInputChange({
                              target: {
                                name: "aadhaarImage",
                                value: e.target.files[0] || "",
                              },
                            });
                          }}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="panNumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          PAN Number
                        </label>
                        <input
                          type="text"
                          id="panNumber"
                          name="panNumber"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.panNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="panImage"
                          className="block text-sm font-medium text-gray-700"
                        >
                          PAN Image
                        </label>
                        <input
                          type="file"
                          id="panImage"
                          name="panImage"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          onChange={(e) => {
                            // Handle file upload logic here
                            handleInputChange({
                              target: {
                                name: "panImage",
                                value: e.target.files[0] || "",
                              },
                            });
                          }}
                        />
                      </div>
                      {/* for other docs  */}
                      <div>
                        <label
                          htmlFor="docs"
                          className="block text-sm font-medium text-green-700"
                        >
                          Other Document
                        </label>
                        <input
                          type="file"
                          id="docs"
                          name="docs"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          onChange={(e) => {
                            // Handle file upload logic here
                            handleInputChange({
                              target: {
                                name: "docs",
                                value: e.target.files[0] || "",
                              },
                            });
                          }}
                        />
                      </div>

                      {/* for certificate  */}

                      <div>
                        <label
                          htmlFor="certificate"
                          className="block text-sm font-medium text-green-700"
                        >
                          Other Certificate
                        </label>
                        <input
                          type="file"
                          id="certificate"
                          name="certificate"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          onChange={(e) => {
                            // Handle file upload logic here
                            handleInputChange({
                              target: {
                                name: "certificate",
                                value: e.target.files[0] || "",
                              },
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="text-md font-medium text-gray-800 mb-4">
                      Bank Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="bankName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Bank Name
                        </label>
                        <input
                          type="text"
                          id="bankName"
                          name="bankName"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.bankName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="accountHolderName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Account Holder Name
                        </label>
                        <input
                          type="text"
                          id="accountHolderName"
                          name="accountHolderName"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.accountHolderName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="accountNumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Account Number
                        </label>
                        <input
                          type="text"
                          id="accountNumber"
                          name="accountNumber"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.accountNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="ifscCode"
                          className="block text-sm font-medium text-gray-700"
                        >
                          IFSC Code
                        </label>
                        <input
                          type="text"
                          id="ifscCode"
                          name="ifscCode"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.ifscCode}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="branchName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Branch Name
                        </label>
                        <input
                          type="text"
                          id="branchName"
                          name="branchName"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.branchName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="passbookImage"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Passbook Image
                        </label>
                        <input
                          type="file"
                          id="passbookImage"
                          name="passbookImage"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          onChange={(e) => {
                            // Handle file upload logic here
                            handleInputChange({
                              target: {
                                name: "passbookImage",
                                value: e.target.files[0] || "",
                              },
                            });
                          }}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="uanNumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          UAN Number
                        </label>
                        <input
                          type="text"
                          id="uanNumber"
                          name="uanNumber"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.uanNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="esicNumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          ESIC Number
                        </label>
                        <input
                          type="text"
                          id="esicNumber"
                          name="esicNumber"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.esicNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="pfNumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          PF Number
                        </label>
                        <input
                          type="text"
                          id="pfNumber"
                          name="pfNumber"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.pfNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Permanent Address */}
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="text-md font-medium text-gray-800 mb-4">
                      Permanent Address
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="permanentVill"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Village/Street
                        </label>
                        <input
                          type="text"
                          id="permanentVill"
                          name="permanentVill"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.permanentVill}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="permanentPost"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Post Office
                        </label>
                        <input
                          type="text"
                          id="permanentPost"
                          name="permanentPost"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.permanentPost}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="permanentPS"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Police Station
                        </label>
                        <input
                          type="text"
                          id="permanentPS"
                          name="permanentPS"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.permanentPS}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="permanentDist"
                          className="block text-sm font-medium text-gray-700"
                        >
                          District
                        </label>
                        <input
                          type="text"
                          id="permanentDist"
                          name="permanentDist"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.permanentDist}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="permanentState"
                          className="block text-sm font-medium text-gray-700"
                        >
                          State
                        </label>
                        <input
                          type="text"
                          id="permanentState"
                          name="permanentState"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.permanentState}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="permanentPinCode"
                          className="block text-sm font-medium text-gray-700"
                        >
                          PIN Code
                        </label>
                        <input
                          type="text"
                          id="permanentPinCode"
                          name="permanentPinCode"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.permanentPinCode}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="permanentPhone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="permanentPhone"
                          name="permanentPhone"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.permanentPhone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Present Address */}
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-md font-medium text-gray-800">
                        Present Address
                      </h4>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="sameAsPermAddress"
                          name="sameAsPermAddress"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={sameAsPermAddress}
                          onChange={handleSameAddressChange}
                        />
                        <label
                          htmlFor="sameAsPermAddress"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Same as Permanent Address
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="presentVill"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Village/Street
                        </label>
                        <input
                          type="text"
                          id="presentVill"
                          name="presentVill"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.presentVill}
                          onChange={handleInputChange}
                          disabled={sameAsPermAddress}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="presentPost"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Post Office
                        </label>
                        <input
                          type="text"
                          id="presentPost"
                          name="presentPost"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.presentPost}
                          onChange={handleInputChange}
                          disabled={sameAsPermAddress}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="presentPS"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Police Station
                        </label>
                        <input
                          type="text"
                          id="presentPS"
                          name="presentPS"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.presentPS}
                          onChange={handleInputChange}
                          disabled={sameAsPermAddress}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="presentDist"
                          className="block text-sm font-medium text-gray-700"
                        >
                          District
                        </label>
                        <input
                          type="text"
                          id="presentDist"
                          name="presentDist"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.presentDist}
                          onChange={handleInputChange}
                          disabled={sameAsPermAddress}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="presentState"
                          className="block text-sm font-medium text-gray-700"
                        >
                          State
                        </label>
                        <input
                          type="text"
                          id="presentState"
                          name="presentState"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.presentState}
                          onChange={handleInputChange}
                          disabled={sameAsPermAddress}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="presentPinCode"
                          className="block text-sm font-medium text-gray-700"
                        >
                          PIN Code
                        </label>
                        <input
                          type="text"
                          id="presentPinCode"
                          name="presentPinCode"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.presentPinCode}
                          onChange={handleInputChange}
                          disabled={sameAsPermAddress}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="presentPhone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="presentPhone"
                          name="presentPhone"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.presentPhone}
                          onChange={handleInputChange}
                          disabled={sameAsPermAddress}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Education & Experience */}
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="text-md font-medium text-gray-800 mb-4">
                      Education & Experience
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="qualification"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Qualification
                        </label>
                        <input
                          type="text"
                          id="qualification"
                          name="qualification"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.qualification}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="previousExperience"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Previous Experience
                        </label>
                        <input
                          type="text"
                          id="previousExperience"
                          name="previousExperience"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.previousExperience}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Family Members */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-md font-medium text-gray-800">
                        Family Members
                      </h4>
                      <button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 cursor-pointer"
                        onClick={handleAddFamilyMember}
                      >
                        <Plus size={14} />
                        Add Member
                      </button>
                    </div>

                    {familyMembers.map((member, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-md p-4 mb-4"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="text-sm font-medium text-gray-700">
                            Family Member #{index + 1}
                          </h5>
                          {familyMembers.length > 1 && (
                            <button
                              type="button"
                              className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1 cursor-pointer"
                              onClick={() => handleRemoveFamilyMember(index)}
                            >
                              <Trash2 size={14} />
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label
                              htmlFor={`name-${index}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              id={`name-${index}`}
                              name="name"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              value={member.name}
                              onChange={(e) =>
                                handleFamilyMemberChange(index, e)
                              }
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`age-${index}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Age
                            </label>
                            <input
                              type="number"
                              id={`age-${index}`}
                              name="age"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              value={member.age}
                              onChange={(e) =>
                                handleFamilyMemberChange(index, e)
                              }
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`relation-${index}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Relation
                            </label>
                            <input
                              type="text"
                              id={`relation-${index}`}
                              name="relation"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              value={member.relation}
                              onChange={(e) =>
                                handleFamilyMemberChange(index, e)
                              }
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`dob-${index}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Date of Birth
                            </label>
                            <input
                              type="date"
                              id={`dob-${index}`}
                              name="dob"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              value={member.dob}
                              onChange={(e) =>
                                handleFamilyMemberChange(index, e)
                              }
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`phone-${index}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Phone
                            </label>
                            <input
                              type="tel"
                              id={`phone-${index}`}
                              name="phone"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              value={member.phone}
                              onChange={(e) =>
                                handleFamilyMemberChange(index, e)
                              }
                            />
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`residing-${index}`}
                              name="residing"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              checked={member.residing}
                              onChange={(e) =>
                                handleFamilyMemberChange(index, e)
                              }
                            />
                            <label
                              htmlFor={`residing-${index}`}
                              className="ml-2 block text-sm text-gray-700"
                            >
                              Residing with candidate
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </form>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {isEditing ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>{isEditing ? "Update" : "Add"} Candidate</>
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer "
                  onClick={handleCloseDialog}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Candidate Details Dialog */}
      {viewDialogOpen && viewCandidate && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Candidate Details
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 cursor-pointer"
                  onClick={handleCloseViewDialog}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-6">
                  {/* Personal Information Section */}
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="text-md font-medium text-gray-800 mb-4">
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Full Name
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.fullName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Email Address
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.email || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Phone Number
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.phone || "N/A"}
                        </p>
                      </div>
                       <div>
                        <p className="text-sm font-medium text-gray-500">
                          Designation
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.designation || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Date of Joining
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.doj || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Sex</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.sex || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Father's Name/ Husband:
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.father || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Date of Birth
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.dob || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Religion
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.religion || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Marital Status
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.maritalStatus || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Physical Details Section */}
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="text-md font-medium text-gray-800 mb-4">
                      Physical Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Weight (kg)
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.weight || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Height (cm)
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.height || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Blood Group
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.bloodGroup || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Chest (inches)
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.chest || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Identification Mark
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.identificationMark || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Emergency Information */}
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="text-md font-medium text-gray-800 mb-4">
                      Contact & Emergency Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Emergency Phone
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.emergencyPhone || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Nearest Railway Station/ Bus Stop:
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.nearestBusStop || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ID Documents */}
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="text-md font-medium text-gray-800 mb-4">
                      ID Documents
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Aadhaar Number
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.aadhaarNumber || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          PAN Number
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.panNumber || "N/A"}
                        </p>
                      </div>
                    </div>
                    {/* Document Images */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {viewCandidate.aadhaarImage && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">
                            Aadhaar Card Image
                          </p>
                          <div className="border border-gray-300 rounded-md p-2">
                            <img
                              src={viewCandidate.aadhaarImage}
                              alt="Aadhaar Card"
                              className="w-full h-auto max-h-64 object-contain"
                              onClick={() =>
                                window.open(
                                  viewCandidate.aadhaarImage,
                                  "_blank"
                                )
                              }
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        </div>
                      )}

                      {viewCandidate.panImage && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">
                            PAN Card Image
                          </p>
                          <div className="border border-gray-300 rounded-md p-2">
                            <img
                              src={viewCandidate.panImage}
                              alt="PAN Card"
                              className="w-full h-auto max-h-64 object-contain"
                              onClick={() =>
                                window.open(viewCandidate.panImage, "_blank")
                              }
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        </div>
                      )}

                      {viewCandidate.docs && (
                        <div>
                          <p className="text-sm font-medium text-green-500 mb-2">
                            Other Documents
                          </p>
                          <div className="border border-gray-300 rounded-md p-2">
                            <img
                              src={viewCandidate.docs}
                              alt="Docs"
                              className="w-full h-auto max-h-64 object-contain"
                              onClick={() =>
                                window.open(viewCandidate.docs, "_blank")
                              }
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        </div>
                      )}

                      {viewCandidate.certificate && (
                        <div>
                          <p className="text-sm font-medium text-green-500 mb-2">
                            Other Certificate
                          </p>
                          <div className="border border-gray-300 rounded-md p-2">
                            <img
                              src={viewCandidate.certificate}
                              alt="Docs"
                              className="w-full h-auto max-h-64 object-contain"
                              onClick={() =>
                                window.open(viewCandidate.certificate, "_blank")
                              }
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="text-md font-medium text-gray-800 mb-4">
                      Bank Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Bank Name
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.bankName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Account Holder Name
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.accountHolderName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Account Number
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.accountNumber || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          IFSC Code
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.ifscCode || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Branch Name
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.branchName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          UAN Number
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.uanNumber || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          ESIC Number
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.esicNumber || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          PF Number
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.pfNumber || "N/A"}
                        </p>
                      </div>
                    </div>
                    {/* Passbook Image */}
                    {viewCandidate.passbookImage && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500 mb-2">
                          Passbook Image
                        </p>
                        <div className="border border-gray-300 rounded-md p-2">
                          <img
                            src={viewCandidate.passbookImage}
                            alt="Bank Passbook"
                            className="w-full h-auto max-h-64 object-contain"
                            onClick={() =>
                              window.open(viewCandidate.passbookImage, "_blank")
                            }
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Permanent Address */}
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="text-md font-medium text-gray-800 mb-4">
                      Permanent Address
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Village/Street
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.permanentVill || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Post Office
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.permanentPost || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Police Station
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.permanentPS || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          District
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.permanentDist || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          State
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.permanentState || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Pin Code
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.permanentPinCode || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Phone
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.permanentPhone || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Present Address */}
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="text-md font-medium text-gray-800 mb-4">
                      Present Address
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Village/Street
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.presentVill || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Post Office
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.presentPost || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Police Station
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.presentPS || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          District
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.presentDist || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          State
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.presentState || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Pin Code
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.presentPinCode || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Phone
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.presentPhone || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Education & Experience */}
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="text-md font-medium text-gray-800 mb-4">
                      Education & Experience
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Qualification
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.qualification || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Previous Experience
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {viewCandidate.previousExperience || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Family Members */}
                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-4">
                      Family Members
                    </h4>
                    {viewCandidate.familyDetails &&
                    viewCandidate.familyDetails.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Name
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Age
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Relation
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Date of Birth
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Phone
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Residing
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {viewCandidate.familyDetails.map(
                              (member, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {member.name || "N/A"}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {member.age || "N/A"}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {member.relation || "N/A"}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {member.dob || "N/A"}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {member.phone || "N/A"}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {member.residing ? "Yes" : "No"}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No family members added
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                  onClick={handleCloseViewDialog}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {onboardDialogOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Onboard Employee
                </h3>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="employeeCode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Employee Code
                    </label>
                    <input
                      type="text"
                      id="employeeCode"
                      name="employeeCode"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={onboardFormData.employeeCode}
                      onChange={handleOnboardInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={onboardFormData.status}
                      onChange={handleOnboardInputChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Terminated">Terminated</option>
                      <option value="Leave">Leave</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                  onClick={handleOnboardSubmit}
                  disabled={isOnboarding}
                >
                  {isOnboarding ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Onboarding...
                    </>
                  ) : (
                    "Onboard"
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm cursor-pointer"
                  onClick={handleCloseOnboardDialog}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruitmentTrainingPage;
