import React, { useState } from "react";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
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
    <div className="bg-slate-200 p-4 rounded ">
      <div className="w-40">
        <div className="w-32 h-32 flex justify-center items-center">
          <img
            src={data?.productImage[0]}
            className="mx-auto object-fill h-full"
          />
        </div>
        <h1 className="text-ellipsis line-clamp-2">{data.productName}</h1>

        <div>
          <p className="font-semibold">
            {displayINRCurrency(data.sellingPrice)}
          </p>

          <div className="flex">
            <div
              className="w-fit ml-auto p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer"
              onClick={() => setEditProduct(true)}
            >
              <MdModeEditOutline />
            </div>
            <div
              className="w-fit ml-auto p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              <MdDelete />
            </div>
          </div>
        </div>
      </div>

      {editProduct && (
        <AdminEditProduct
          productData={data}
          onClose={() => setEditProduct(false)}
          fetchdata={fetchdata}
        />
      )}

{showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this product?</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                onClick={() => setShowDeleteConfirmation(false)} // Close the pop-up
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                onClick={handleDelete} // Perform the delete operation
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
   
    </div>
  );
};

export default AdminProductCard;
