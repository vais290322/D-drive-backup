import React, { useState } from "react";
import { MdDelete, MdModeEditOutline, MdCategory } from "react-icons/md";
import { FaLeaf } from "react-icons/fa";
import AdminEditProduct from "./AdminEditProduct";
import displayINRCurrency from "../helpers/displayCurrency";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const AdminProductCard = ({ data, fetchdata }) => {
  const [editProduct, setEditProduct] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${SummaryApi.deleteProduct.url}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: data._id }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Product deleted successfully!");
        setShowDeleteConfirmation(false); // Close the pop-up
        fetchdata(); // Refresh the product list
      } else {
        throw new Error(result.message || "Failed to delete the product.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while deleting the product.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        {/* Product Image */}
        <div className="h-48 overflow-hidden bg-gray-50">
          <img
            src={data?.productImage[0]}
            alt={data.productName}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
            <MdCategory className="mr-1" />
            {data.category}
          </span>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="p-4">
        <h3 className="font-medium text-gray-800 text-lg mb-1 line-clamp-2 h-14">{data.productName}</h3>
        <p className="text-sm text-gray-500 mb-2">Brand: {data.brandName}</p>
        
        {/* Description Preview */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
          {data.description}
        </p>
        
        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <button
            className="flex items-center text-emerald-600 hover:text-emerald-800 transition-colors"
            onClick={() => setEditProduct(true)}
          >
            <MdModeEditOutline className="mr-1" />
            <span className="text-sm">Edit</span>
          </button>
          
          <button
            className="flex items-center text-red-500 hover:text-red-700 transition-colors"
            onClick={() => setShowDeleteConfirmation(true)}
          >
            <MdDelete className="mr-1" />
            <span className="text-sm">Delete</span>
          </button>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editProduct && (
        <AdminEditProduct
          productData={data}
          onClose={() => setEditProduct(false)}
          fetchdata={fetchdata}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mb-4">
                <MdDelete size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Confirm Deletion</h2>
            </div>
            
            <p className="text-gray-600 mb-6 text-center">
              Are you sure you want to delete <span className="font-medium text-gray-800">{data.productName}</span>? 
              This action cannot be undone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-center">
              <button
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors flex-1 sm:flex-initial"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex-1 sm:flex-initial"
                onClick={handleDelete}
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductCard;
