import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiX } from "react-icons/fi";

const ViewStudentModal = ({ student, isOpen, onClose }) => {
  const formatCurrency = (value) =>
    `₹${value?.toLocaleString("en-IN") || 0}`;

  const getStatusStyle = (status) => {
    const lower = status?.toLowerCase();
    if (lower === "paid") return "bg-green-100 text-green-800 border-green-200";
    if (lower === "partial") return "bg-blue-100 text-blue-800 border-blue-200";
    if (lower === "overdue") return "bg-red-100 text-red-800 border-red-200";
    if (lower === "due") return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b pb-3">
                  <Dialog.Title className="text-xl font-semibold text-gray-800">
                    Student Details
                  </Dialog.Title>
                  <button onClick={onClose}>
                    <FiX className="text-gray-500 hover:text-red-600" size={22} />
                  </button>
                </div>

                {/* Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <p className="font-medium text-gray-500">Full Name</p>
                    <p>{student?.fullName}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Email</p>
                    <p>{student?.email}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Phone</p>
                    <p>{student?.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Admission No</p>
                    <p>{student?.admissionNumber}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Course</p>
                    <p>{student?.course?.courseName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Plan</p>
                    <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full border bg-red-50 text-red-600 border-red-200">
                      {student?.course?.feePlan?.planName || "N/A"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Yearly Fee</p>
                    <p>{formatCurrency(student?.course?.feePlan?.yearlyFee)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Join Year</p>
                    <p>{student?.joinYear}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Paid Amount</p>
                    <p className="text-green-700 font-medium">
                      {formatCurrency(student?.paidAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Due Amount</p>
                    <p className="text-red-600 font-medium">
                      {formatCurrency(student?.dueAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Total Fee</p>
                    <p className="font-semibold text-gray-800">
                      {formatCurrency(student?.totalFee)}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Payment Status</p>
                    <span
                      className={`inline-block mt-1 px-3 py-1 text-xs rounded-full border font-semibold ${getStatusStyle(
                        student?.paymentStatus
                      )}`}
                    >
                      {student?.paymentStatus || "N/A"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Last Payment Date</p>
                    <p>{student?.lastPaymentDate || "N/A"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="font-medium text-gray-500">Remarks</p>
                    <p className="text-gray-700">{student?.remarks || "—"}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 text-right">
                  <button
                    onClick={onClose}
                    className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ViewStudentModal;
