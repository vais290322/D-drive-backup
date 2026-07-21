import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SummaryApi from "../common";
import { useDispatch } from "react-redux";
import { setShippingCostValue } from "../store/shippingCostSlice";

const AddShippingCost = () => {
  const [shippingCost, setShippingCost] = useState(""); // Shipping cost value
  const [isUpdate, setIsUpdate] = useState(false); // Track if in "Add" or "Update" mode
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shippingCost.trim()) {
      toast.error("Cost cannot be empty");
      return;
    }

    try {
      const apiUrl = isUpdate
        ? `${SummaryApi.updateShippingCost.url}`
        : `${SummaryApi.addShippingCost.url}`;
      const method = isUpdate ? "POST" : "POST";

      const response = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: shippingCost }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          isUpdate ? "Shipping cost updated successfully" : "Shipping cost added successfully"
        );
        dispatch(setShippingCostValue(data.value));
        setShippingCost(data.value);
        setIsUpdate(true); // Switch to update mode after adding
      } else {
        toast.error(data.message || "Failed to save shipping cost");
      }
    } catch (error) {
      console.error("Error saving shipping cost:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const fetchShippingCost = async () => {
    try {
      const response = await fetch(SummaryApi.fetchShippingCost.url);
      const dataResponse = await response.json();

      if (response.ok && dataResponse.data) {
        setShippingCost(dataResponse.data.value); // Set the fetched cost
        setIsUpdate(true); // Mark as update mode
      } else {
        setIsUpdate(false); // No shipping cost found, allow adding
      }
    } catch (error) {
      toast.error("Failed to fetch shipping cost");
      setIsUpdate(false); // Default to add mode if there's an error
    }
  };

  useEffect(() => {
    fetchShippingCost(); // Fetch shipping cost on mount
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-md mt-10">
      <h2 className="text-xl font-bold mb-4">
        {isUpdate ? "Update Shipping Cost" : "Add Shipping Cost"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="shippingCost" className="block text-sm font-medium">
            {isUpdate ? "Update shipping cost per order" : "Add shipping cost per order"}
          </label>
          <input
            type="number"
            id="shippingCost"
            value={shippingCost}
            onChange={(e) => setShippingCost(e.target.value)}
            placeholder="Enter shipping cost"
            className="mt-1 block w-full p-2 border rounded-md shadow-sm"
            required
          />
        </div>
        <button
          type="submit"
          className={`px-4 py-2 ${
            isUpdate ? "bg-blue-600" : "bg-green-600"
          } text-white rounded-md hover:${
            isUpdate ? "bg-blue-700" : "bg-green-700"
          }`}
        >
          {isUpdate ? "Update Shipping Cost" : "Add Shipping Cost"}
        </button>
      </form>
    </div>
  );
};

export default AddShippingCost;
