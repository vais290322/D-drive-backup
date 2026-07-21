import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FiMoreVertical, FiPhone, FiMail, FiPlus, FiTrash } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-hot-toast"; // or use react-toastify if preferred

const StudentActionMenu = ({ student, onCall, onEmail, onAddPayment, onDeleted }) => {
  const [deleting, setDeleting] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);
  // const handleDelete = async () => {
  //   const confirm = window.confirm("Are you sure you want to delete this student?");
  //   if (!confirm) return;

  //   setDeleting(true);
  //   try {
  //     await axios.delete(`http://192.168.0.156:8080/api/v1/students/${student?.id}`);
  //     toast.success("Student deleted successfully");
  //     if (onDeleted) onDeleted();
  //   } catch (error) {
  //     console.error("Delete error:", error);
  //     toast.error("Failed to delete student");
  //   } finally {
  //     setDeleting(false);
  //   }
  // };

  return (
    <Menu as="div" className="relative inline-block text-left z-999">
      <div >
        <Menu.Button className="text-gray-500 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-full">
          <FiMoreVertical size={16} />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Menu.Items className=" absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-xl border border-gray-200 focus:outline-none">
          <div className="p-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onCall}
                  className={`${active ? "bg-gray-100" : ""} flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700`}
                >
                  <FiPhone /> Call Student
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onEmail}
                  className={`${active ? "bg-gray-100" : ""} flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700`}
                >
                  <FiMail /> Send Email
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onAddPayment}
                  className={`${active ? "bg-gray-100" : ""} flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700`}
                >
                  <FiPlus /> Add Payment
                </button>
              )}
            </Menu.Item>
            {/* <Menu.Item>
              {({ active }) => (
                <button
                  disabled={deleting}
                  onClick={() => setShowConfirm(true)}
                  
                  className={`${
                    active ? "bg-red-50 text-red-700" : "text-red-600"
                  } flex items-center gap-2 w-full px-4 py-2 text-sm`}
                >
                  <FiTrash />
                  {deleting ? "Deleting..." : "Delete Student"}
                </button>
              )}
            </Menu.Item> */}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default StudentActionMenu;
