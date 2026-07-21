import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";
import {
  CourseUrl,
  PlanUrl,
  StudentUrl,
  getAuthHeaders,
  SessionUrl,
} from "../config/config";
import toast from "react-hot-toast";

const AddStudentModal = ({ isOpen, onClose, onStudentAdded }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    guardianName: "",
    mobile: "",
    email: "",
    dateOfBirth: "",
    address: "",
    courseName: "",
    planName: "",
    courseId: "",
    planId: "",
    session: "",
    totalAdmissionFee: "",
    paidAdmissionFee: "",
    dueAdmissionFee: "",
    noOfInstallment: "",
    feesPerInstallment: "",
    purposeOfPayment: "Admission Fee",
    totalFees: "",
    dueFees: "",
    paymentMode: "",
    transactionId: "",
    payingAmount: "",
    remark: "",
    supportingDocs: null,
    chequeNumber: "",
    chequeDate: "",
    bankName: "",
  });

  const [errors, setErrors] = useState({});
  const [courses, setCourses] = useState([]);
  const [plans, setPlans] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCourses();
      fetchPlans();
      fetchSessions();
    }
  }, [isOpen]);

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${SessionUrl.getSessions}`, {
        headers: getAuthHeaders(),
      });
      setSessions(res.data?.data || []);
    } catch (err) {
      // console.error("Failed to fetch sessions:", err);
      toast.error(err.response?.data?.message || "Failed to fetch sessions");
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${CourseUrl.getCourses}`, {
        headers: getAuthHeaders(),
      });
      setCourses(res.data?.data || []);
    } catch (err) {
      // console.error("Failed to fetch courses:", err);
      toast.error(err.response?.data?.message || "Failed to fetch courses");
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${PlanUrl.getPlans}`, {
        headers: getAuthHeaders(),
      });
      setPlans(res.data?.data || []);
    } catch (err) {
      // console.error("Failed to fetch plans:", err);
      toast.error(err.response?.data?.message || "Failed to fetch plans");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // console.log("file", file);
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, supportingDocs: file }));
    } else {
      setFormData((prev) => ({ ...prev, supportingDocs: null }));
      toast.error("Only image files are allowed for supporting document.");
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      studentId: "",
      guardianName: "",
      mobile: "",
      email: "",
      dateOfBirth: "",
      address: "",
      courseName: "",
      planName: "",
      courseId: "",
      planId: "",
      session: "",
      admissionDate: new Date().toISOString().split("T")[0],
      totalAdmissionFee: "",
      paidAdmissionFee: "",
      dueAdmissionFee: "",
      noOfInstallment: "",
      feesPerInstallment: "",
      purposeOfPayment: "",
      totalFees: "",
      dueFees: "",
      paymentMode: "",
      transactionId: "",
      payingAmount: "",
      nextDueDate: "",
      paymentStatus: "Pending",
      category: "General",
      remark: "",
      supportingDocs: null,
      chequeNumber: "",
      chequeDate: "",
      bankName: "",
    });
  };

  useEffect(() => {
    const totalAdmissionFee = Number(formData.totalAdmissionFee) || 0;
    const paidAdmissionFee = Number(formData.paidAdmissionFee) || 0;
    const noOfInstallment = Number(formData.noOfInstallment) || 0;
    const feesPerInstallment = Number(formData.feesPerInstallment) || 0;

    const dueAdmissionFee = totalAdmissionFee - paidAdmissionFee;
    const installmentAmount = noOfInstallment * feesPerInstallment;
    const totalFees = installmentAmount + totalAdmissionFee;
    const dueFees = totalFees - paidAdmissionFee;

    setFormData((prev) => ({
      ...prev,
      dueAdmissionFee:
        dueAdmissionFee >= 0 ? dueAdmissionFee.toFixed(2) : "0.00",
      totalFees: totalFees.toFixed(2),
      dueFees: dueFees >= 0 ? dueFees.toFixed(2) : "0.00",
      payingAmount: paidAdmissionFee > 0 ? paidAdmissionFee.toFixed(2) : "",
    }));
  }, [
    formData.totalAdmissionFee,
    formData.paidAdmissionFee,
    formData.noOfInstallment,
    formData.feesPerInstallment,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${StudentUrl.postStudent}`, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Student added successfully!");
      onStudentAdded();
      resetForm();
      onClose();
    } catch (err) {
      console.error("Error adding student:", err);
      toast.error(err.response?.data?.message || "Failed to add student");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all">
                {/* Header */}
                <div className="text-center mb-6">
                  <Dialog.Title className="text-xl font-semibold text-red-600">
                    Add New Student
                  </Dialog.Title>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1 text-sm">
                        Full Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                      />
                      {errors.fullName && (
                        <div className="text-xs text-red-600 mt-1">
                          {errors.fullName}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">
                        Student ID <span className="text-red-600">*</span>
                      </label>
                      <input
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                      />
                      {errors.studentId && (
                        <div className="text-xs text-red-600 mt-1">
                          {errors.studentId}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">
                        Session <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="session"
                          value={formData.session}
                          onChange={handleChange}
                          className="w-full border px-3 py-2 rounded appearance-none bg-white pr-8"
                        >
                          <option value="">Select session</option>
                          {sessions.map((session) => (
                            <option key={session.id} value={session.session}>
                              {session.session}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <FiChevronDown className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      {errors.session && (
                        <div className="text-xs text-red-600 mt-1">
                          {errors.session}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1 text-sm">
                        Guardian Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        name="guardianName"
                        value={formData.guardianName}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                      />
                      {errors.guardianName && (
                        <div className="text-xs text-red-600 mt-1">
                          {errors.guardianName}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">
                        Course Plan <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="planName"
                          value={formData.planName}
                          onChange={(e) => {
                            const selectedPlan = plans.find(
                              (plan) => plan?.plan?.planName === e.target.value
                            );
                            setFormData((prev) => ({
                              ...prev,
                              planName: e.target.value,
                              planId: selectedPlan?.plan?.id || "",
                            }));
                          }}
                          className="w-full border px-3 py-2 rounded appearance-none bg-white pr-8"
                        >
                          <option value="">Select course plan</option>
                          {plans.map((plan) => (
                            <option key={plan.id} value={plan.planName}>
                              {plan?.plan?.planName}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <FiChevronDown className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      {errors.planName && (
                        <div className="text-xs text-red-600 mt-1">
                          {errors.planName}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">
                        Course Name <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="courseName"
                          value={formData.courseName}
                          onChange={(e) => {
                            const selectedCourse = courses.find(
                              (course) =>
                                course?.course?.courseName === e.target.value
                            );
                            setFormData((prev) => ({
                              ...prev,
                              courseName: e.target.value,
                              courseId: selectedCourse?.course?.id || "",
                            }));
                          }}
                          className="w-full border px-3 py-2 rounded appearance-none bg-white pr-8"
                        >
                          <option value="">Select course</option>
                          {courses.map((course) => (
                            <option key={course.id} value={course?.courseName}>
                              {course?.course?.courseName}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <FiChevronDown className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      {errors.courseName && (
                        <div className="text-xs text-red-600 mt-1">
                          {errors.courseName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1 text-sm">
                        Mobile <span className="text-red-600">*</span>
                      </label>
                      <input
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                      />
                      {errors.mobile && (
                        <div className="text-xs text-red-600 mt-1">
                          {errors.mobile}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                      />
                      {errors.email && (
                        <div className="text-xs text-red-600 mt-1">
                          {errors.email}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">
                        Date Of Birth <span className="text-red-600">*</span>
                      </label>
                      <input
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                      />
                      {errors.dateOfBirth && (
                        <div className="text-xs text-red-600 mt-1">
                          {errors.dateOfBirth}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm">Address </label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                    {errors.address && (
                      <div className="text-xs text-red-600 mt-1">
                        {errors.address}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1 text-sm">
                        Total Admission Fee{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <input
                        name="totalAdmissionFee"
                        type="number"
                        value={formData.totalAdmissionFee}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                      />
                      {errors.totalAdmissionFee && (
                        <div className="text-xs text-red-600 mt-1">
                          {errors.totalAdmissionFee}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">
                        Paid Admission Fee{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <input
                        name="paidAdmissionFee"
                        type="number"
                        value={formData.paidAdmissionFee}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                      />
                      {errors.paidAdmissionFee && (
                        <div className="text-xs text-red-600 mt-1">
                          {errors.paidAdmissionFee}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">
                        Due Admission Fee{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <input
                        name="dueAdmissionFee"
                        type="number"
                        value={formData.dueAdmissionFee}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded bg-gray-100"
                        disabled
                      />
                      {errors.dueAdmissionFee && (
                        <div className="text-xs text-red-600 mt-1">
                          {errors.dueAdmissionFee}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1 text-sm">
                        No of Total Installment{" "}
                      </label>
                      <input
                        name="noOfInstallment"
                        value={formData.noOfInstallment}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded appearance-none bg-white"
                      />
                      {errors.noOfInstallment && (
                        <div className="text-xs text-red-600 mt-1">
                          {errors.noOfInstallment}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">
                        Fees per Installment{" "}
                      </label>
                      <input
                        name="feesPerInstallment"
                        type="number"
                        value={formData.feesPerInstallment}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                      />
                      {errors.feesPerInstallment && (
                        <div className="text-xs text-red-600 mt-1">
                          {errors.feesPerInstallment}
                        </div>
                      )}
                    </div>
                      <div>
                      <label className="block mb-1 text-sm">Installment Amount</label>
                      <div className="w-full border px-3 py-2 rounded bg-gray-100">
                        {(formData.noOfInstallment * formData.feesPerInstallment).toFixed(2) || "0.00"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1 text-sm">
                        Purpose of Payment{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="purposeOfPayment"
                          value={formData.purposeOfPayment}
                          onChange={handleChange}
                          className="w-full border px-3 py-2 rounded appearance-none bg-white pr-8"
                          required
                        >
                          <option value="">Select purpose</option>
                          <option value="Installment">Installment</option>
                          {/* <option value="Semester">Semester</option> */}
                          <option value="Admission Fee">Admission Fee</option>
                          <option value="Seat Booking">Seat Booking</option>
                          {/* <option value="University Enrollment">
                            University Enrollment
                          </option> */}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <FiChevronDown className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      {errors.purposeOfPayment && (
                        <div className="text-xs text-red-600 mt-1">
                          {errors.purposeOfPayment}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">
                        Total Fees <span className="text-red-600">*</span>
                      </label>
                      <input
                        name="totalFees"
                        type="number"
                        value={formData.totalFees}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded bg-gray-100"
                        disabled
                      />
                      {errors.totalFees && (
                        <div className="text-xs text-red-600 mt-1">
                          {errors.totalFees}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">
                        Due Fees <span className="text-red-600">*</span>
                      </label>
                      <input
                        name="dueFees"
                        type="number"
                        value={formData.dueFees}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded bg-gray-100"
                        disabled
                      />
                      {errors.dueFees && (
                        <div className="text-xs text-red-600 mt-1">
                          {errors.dueFees}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1 text-sm">
                        Payment Mode <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="paymentMode"
                          value={formData.paymentMode}
                          onChange={handleChange}
                          className="w-full border px-3 py-2 rounded appearance-none bg-white pr-8"
                        >
                          <option value="">Select mode</option>
                          <option value="Cash">Cash</option>
                          <option value="UPI">UPI</option>
                          <option value="Online">Online</option>
                          <option value="Cheque">Cheque</option>
                          <option value="Demand Draft">Demand Draft</option>
                          <option value="NEFT">NEFT</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <FiChevronDown className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      {errors.paymentMode && (
                        <div className="text-xs text-red-600 mt-1">
                          {errors.paymentMode}
                        </div>
                      )}
                    </div>
                    {/* Only show Transaction ID if payment mode is not Cash */}
                    {formData.paymentMode !== "Cash" && (
                      <div>
                        <label className="block mb-1 text-sm">
                          Transaction ID <span className="text-red-600">*</span>
                        </label>
                        <input
                          name="transactionId"
                          value={formData.transactionId}
                          onChange={handleChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                        {errors.transactionId && (
                          <div className="text-xs text-red-600 mt-1">
                            {errors.transactionId}
                          </div>
                        )}
                      </div>
                    )}
                    <div>
                      <label className="block mb-1 text-sm">
                        Paying Amount <span className="text-red-600">*</span>
                      </label>
                      <input
                        name="payingAmount"
                        type="number"
                        value={formData.payingAmount}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                      />
                      {errors.payingAmount && (
                        <div className="text-xs text-red-600 mt-1">
                          {errors.payingAmount}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Conditional fields for Cheque payment mode */}
                  {formData.paymentMode === "Cheque" && (
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block mb-1 text-sm">
                          Cheque Number <span className="text-red-600">*</span>
                        </label>
                        <input
                          name="chequeNumber"
                          value={formData.chequeNumber || ""}
                          onChange={handleChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                        {errors.chequeNumber && (
                          <div className="text-xs text-red-600 mt-1">
                            {errors.chequeNumber}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block mb-1 text-sm">
                          Cheque Date <span className="text-red-600">*</span>
                        </label>
                        <input
                          name="chequeDate"
                          type="date"
                          value={formData.chequeDate || ""}
                          onChange={handleChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                        {errors.chequeDate && (
                          <div className="text-xs text-red-600 mt-1">
                            {errors.chequeDate}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block mb-1 text-sm">
                          Bank Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          name="bankName"
                          value={formData.bankName || ""}
                          onChange={handleChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                        {errors.bankName && (
                          <div className="text-xs text-red-600 mt-1">
                            {errors.bankName}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm">
                        Remark (optional)
                      </label>
                      <textarea
                        name="remark"
                        value={formData.remark}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        rows="3"
                      ></textarea>
                    </div>
                    <div>
                      <div className="flex">
                        <label className="block mb-1 text-sm">
                          Supporting Document
                        </label>
                        <sup className="text-red-600 top-1 text-[15px]">*</sup>
                      </div>
                      <div className="border rounded p-6 flex items-center justify-center bg-gray-100 h-[80px]">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          id="document-upload"
                          accept="image/*"
                        />
                        <label
                          htmlFor="document-upload"
                          className="cursor-pointer w-full h-full flex items-center justify-center"
                        >
                          {formData.supportingDocs ? (
                            <div className="flex  items-center gap-5">
                              <img
                                src={URL.createObjectURL(
                                  formData.supportingDocs
                                )}
                                alt="Supporting Document Preview"
                                className="h-16 w-auto object-contain rounded mb-1"
                              />
                              <div className="flex  items-center gap-2">
                                <span className="text-xs text-gray-700">
                                  {formData.supportingDocs.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {(
                                    formData.supportingDocs.size / 1024
                                  ).toFixed(2)}{" "}
                                  KB
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                              <span className="text-xs text-gray-500 mt-1">
                                Upload Image
                              </span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-6">
                    {isSubmitting ? (
                      <div className="mr-4 text-red-600 font-semibold">
                        Please wait...
                      </div>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-red-600 text-white rounded font-medium transition px-6 py-2 hover:bg-red-700 disabled:opacity-70"
                      >
                        Add Student
                      </button>
                    )}
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddStudentModal;
