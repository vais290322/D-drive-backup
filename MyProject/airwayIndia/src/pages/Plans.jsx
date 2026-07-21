import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { PlanUrl, getAuthHeaders } from "../config/config";
import EditPlanModal from "../components/EditPlan";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { toast } from "react-hot-toast";

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const navigate = useNavigate();

  const planStyles = {
    Gold: {
      border: "border-yellow-300",
      badge: "bg-yellow-100 text-yellow-800",
    },
    Platinum: {
      border: "border-purple-300",
      badge: "bg-purple-100 text-purple-800",
    },
    Silver: {
      border: "border-gray-300",
      badge: "bg-gray-100 text-gray-800",
    },
    Bronze: {
      border: "border-orange-300",
      badge: "bg-orange-100 text-orange-800",
    },
    Diamond: {
      border: "border-blue-300",
      badge: "bg-blue-100 text-blue-800",
    },
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${PlanUrl.getPlans}`, { headers: getAuthHeaders() });
      setPlans(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching plans:", err);
      toast.error(err.response?.data?.message || "Failed to fetch plans");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${PlanUrl.deletePlan}/${selectedPlanId}`, { headers: getAuthHeaders() });
      fetchPlans();
      setIsDeleteOpen(false);
      toast.success("Plan deleted successfully!");
    } catch (err) {
      console.error("Error deleting plan:", err);
      toast.error(err.response?.data?.message || "Failed to delete plan");
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Fee Plans</h2>
          <p className="text-sm text-gray-500">
            Manage fee structures and pricing plans
          </p>
        </div>
        <button
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          onClick={() => navigate("/add-plans")}
        >
          Add Plan
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search plans..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
        />
      </div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {plans
          .filter((plan) =>
            plan.planName.toLowerCase().includes(search.toLowerCase())
          )
          .map((plan) => {
            const styles = planStyles[plan.planName] || {
              border: "border-gray-200",
              badge: "bg-gray-100 text-gray-700",
            };

            return (
              <div
                key={plan.id}
                className={`border-2 ${styles.border} bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 relative`}
              >
                {/* Badge */}
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${styles.badge} shadow-sm`}
                >
                  {plan.planName}
                </div>

                {/* Price */}
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {formatPrice(plan.yearlyFee)}
                  <span className="text-sm font-medium text-gray-500 ml-1">
                    /year
                  </span>
                </h2>

                {/* Divider */}
                <hr className="my-4 border-dashed" />

                {/* Details */}
                <div className="text-sm text-gray-600 space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Courses</span>
                    <span className="font-semibold">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Students</span>
                    <span className="font-semibold">-</span>
                  </div>
                </div>

                {/* Features */}
                {plan.features?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Features
                    </p>
                    <ul className="list-disc list-inside text-green-600 text-sm space-y-1">
                      {plan.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between border-t pt-4 mt-4">
                  <button
                    className="flex items-center gap-1 text-sm px-4 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                    onClick={() => {
                      setSelectedPlanId(plan.id);
                      setIsModalOpen(true);
                    }}
                  >
                    <FiEdit className="text-gray-500" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPlanId(plan.id);
                      setIsDeleteOpen(true);
                    }}
                    className="flex items-center gap-1 text-sm px-4 py-1.5 border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition"
                  >
                    <FiTrash2 className="text-red-400" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* Modals */}
      {isModalOpen && (
        <EditPlanModal
          planId={selectedPlanId}
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={fetchPlans}
        />
      )}
      <ConfirmDeleteModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Plans;
