import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

// const creatCouponUrl = import.meta.env.VITE_CREATE_COUPON;
// const getAllCoupon = import.meta.env.VITE_GET_ALL_COUPON;
// const deleteCouponUrl = import.meta.env.VITE_DELETE_COUPON
import urls from "../../../common/url"

const { creatCouponUrl,getAllCoupon,deleteCouponUrl} = urls;
const CreateCoupon = () => {
  const [selectedOption, setSelectedOption] = useState("default");
  const [couponData, setCouponData] = useState({
    discount: "20", // Default value
    startDate: new Date().toISOString().split("T")[0], // Set today's date
    endDate: "",
  });
  const [allCouponData, setAllCouponData] = useState([]);

  // Handle radio button change
  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);

    if (value === "default") {
      setCouponData((prev) => ({
        ...prev,
        discount: "20",
      }));
    } else {
      setCouponData({});
    }
  };

  // Handle input change
  const handleChangeCoupon = (e) => {
    const { name, value } = e.target;
    setCouponData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch all coupons
  const getAllCoupons = async () => {
    try {
      const response = await fetch(getAllCoupon, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (data.message !== "All coupons retrieved successfully") {
        toast.error("Error fetching coupon data");
        return;
      }
      setAllCouponData(data.data.reverse() || []);
    } catch (error) {
      toast.error("Error fetching coupons");
      console.error(error);
    }
  };

  // Submit coupon
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(creatCouponUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(couponData),
      });
      const res = await response.json();
      console.log("response : ",response);

      if (res.message !== "Coupons created successfully") {
        toast.error("Coupon not created");
        return;
      }

      toast.success(res.message);
      setAllCouponData((prev) => [res.data, ...prev]);
      setCouponData({
        discount: selectedOption === "default" ? "20" : "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
      });
    } catch (error) {
      toast.error("Server error");
      console.error(error);
    }
  };

  // Delete a coupon
  const handleDeleteCoupon = async (id) => {
    try {
      const response = await fetch(`${deleteCouponUrl}/${id}`, {
        method: "DELETE",
      });
      const res = await response.json();

      if (res.message !== `Coupon deleted successfully: ${id}`) {
        toast.error("Coupon not deleted");
        return;
      }

      toast.success(res.message);
      setAllCouponData((prev) => prev.filter((coupon) => coupon.id !== id));
    } catch (error) {
      toast.error("Server error");
      console.error(error);
    }
  };

  // Fetch coupons on component mount
  useEffect(() => {
    getAllCoupons();
  }, []);

  return (
  //   <>
  //   <div className="flex space-x-4 mb-6">
  //     <label className="flex items-center space-x-2 cursor-pointer">
  //       <input
  //         type="radio"
  //         name="taxOption"
  //         value="default"
  //         checked={selectedOption === "default"}
  //         onChange={handleChange}
  //         className="form-radio text-indigo-600 focus:ring-indigo-500"
  //       />
  //       <span className="text-gray-700">Default</span>
  //     </label>
  
  //     <label className="flex items-center space-x-2 cursor-pointer">
  //       <input
  //         type="radio"
  //         name="taxOption"
  //         value="customize"
  //         checked={selectedOption === "customize"}
  //         onChange={handleChange}
  //         className="form-radio text-indigo-600 focus:ring-indigo-500"
  //       />
  //       <span className="text-gray-700">Customize</span>
  //     </label>
  //   </div>
  
  //   <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg border border-gray-200 p-6">
  //     <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Discount Coupon</h2>
  //     <form className="space-y-6" onSubmit={handelSubmit}>
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage:</label>
  //         <input
  //           type="number"
  //           name="discount"
  //           placeholder={selectedOption === "default" ? "By default 20%" : "Enter discount in %"}
  //           required
  //           disabled={selectedOption === "default"}
  //           onChange={handleChangeCoupon}
  //           className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-200"
  //         />
  //       </div>
  
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-2">Start Date:</label>
  //         <input
  //           type="date"
  //           name="startDate"
  //           required
  //           disabled
  //           defaultValue={new Date().toISOString().split("T")[0]}
  //           className="w-full p-3 border border-gray-300 rounded-md bg-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
  //         />
  //       </div>
  
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-2">End Date:</label>
  //         <input
  //           type="date"
  //           name="endDate"
  //           required
  //           onChange={handleChangeCoupon}
  //           className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
  //         />
  //       </div>
  
  //       <button
  //         type="submit"
  //         className="w-full bg-indigo-600 text-white py-3 rounded-md text-lg font-medium hover:bg-indigo-700 transition"
  //       >
  //         Save Coupon
  //       </button>
  //     </form>
  //   </div>
  
  //   <div className="mt-8">
  //     <CouponTable data={allCouponData} onDelete={handleDeleteCoupon} />
  //   </div>
  // </>


  <>
  <div className="flex space-x-4 mb-6">
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        name="couponOption"
        value="default"
        checked={selectedOption === "default"}
        onChange={handleChange}
        className="form-radio text-indigo-600 focus:ring-indigo-500"
      />
      <span className="text-gray-700">Default</span>
    </label>

    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        name="couponOption"
        value="customize"
        checked={selectedOption === "customize"}
        onChange={handleChange}
        className="form-radio text-indigo-600 focus:ring-indigo-500"
      />
      <span className="text-gray-700">Customize</span>
    </label>
  </div>

  <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg border border-gray-200 p-6">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Discount Coupon</h2>
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Discount Percentage */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage:</label>
        <input
          type="number"
          name="discount"
          placeholder={selectedOption === "default" ? "By default 20%" : "Enter discount in %"}
          required
          disabled={selectedOption === "default"}
          value={couponData.discount || ""}
          onChange={handleChangeCoupon}
          className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-200"
        />
      </div>

      {/* Start Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date:</label>
        <input
          type="date"
          name="startDate"
          required
          value={couponData.startDate}
          onChange={handleChangeCoupon}
          className="w-full p-3 border border-gray-300 rounded-md bg-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
      </div>

      {/* End Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">End Date:</label>
        <input
          type="date"
          name="endDate"
          required
          value={couponData.endDate || ""}
          onChange={handleChangeCoupon}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-3 rounded-md text-lg font-medium hover:bg-indigo-700 transition"
      >
        Save Coupon
      </button>
    </form>
  </div>

  {/* Coupon Table */}
  <div className="mt-8">
    <CouponTable data={allCouponData} onDelete={handleDeleteCoupon} />
  </div>
</>
//   <>
//   <div className="space-x-4">
//     <label className="inline-flex items-center">
//       <input
//         type="radio"
//         name="taxOption"
//         value="default"
//         checked={selectedOption === "default"}
//         onChange={handleChange}
//         className="form-radio"
//       />
//       <span className="ml-2">Default</span>
//     </label>

//     <label className="inline-flex items-center">
//       <input
//         type="radio"
//         name="taxOption"
//         value="customize"
//         checked={selectedOption === "customize"}
//         onChange={handleChange}
//         className="form-radio"
//       />
//       <span className="ml-2">Customize</span>
//     </label>
//   </div>

//   {selectedOption === "customize" && (
//     <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//         Create Discount Coupon
//       </h2>
//       <form className="space-y-6" onSubmit={handelSubmit}>
//         {/* Discount Percentage Field */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Discount Percentage:
//           </label>
//           <input
//             type="number"
//             name="discount"
//             value={couponData.discount || ""}
//             placeholder="Enter discount in %"
//             required
//             onChange={handleChangeCoupon}
//             className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//           />
//         </div>

//         {/* Start Date Field */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Start Date:
//           </label>
//           <input
//             disabled
//             type="date"
//             name="startDate"
//             onChange={handleChangeCoupon}
//             required
//             defaultValue={new Date().toISOString().split("T")[0]} // Set default to today's date
//             className="w-full p-3 border  border-gray-300 bg-gray-200  rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//           />
//         </div>

//         {/* End Date Field */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             End Date:
//           </label>
//           <input
//             type="date"
//             name="endDate"
//             value={couponData.endDate || ""}
//             onChange={handleChangeCoupon}
//             required
//             className="w-full p-3 border border-gray-300  rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full bg-indigo-600 text-white py-3 rounded-md text-lg font-medium hover:bg-indigo-700 transition"
//         >
//           Save Coupon
//         </button>
//       </form>
//     </div>
//   )}
//   {selectedOption === "default" && (
//     <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//         Create Discount Coupon
//       </h2>
//       <form className="space-y-6" onSubmit={handelSubmit}>
//         {/* Discount Percentage Field */}
//         <div>
//           <label className="block  text-sm font-medium text-gray-700 mb-2">
//             Discount Percentage:
//           </label>
//           <input
//             disabled
//             type="number"
//             name="discount"
//             placeholder="By default 20%"
//             required
//             value={couponData.discount || ""}
//             onChange={handleChangeCoupon}
//             className="w-full p-3 border border-gray-300 bg-gray-200 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//           />
//         </div>

//         {/* Start Date Field */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Start Date:
//           </label>
//           <input
//             type="date"
//             name="startDate"
//             onChange={handleChangeCoupon}
//             required
//             defaultValue={new Date().toISOString().split("T")[0]} // Set default to today's date
//             className="w-full p-3 border border-gray-300 rounded-md bg-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//           />
//         </div>

//         {/* End Date Field */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             End Date:
//           </label>
//           <input
//             type="date"
//             name="endDate"
//             onChange={handleChangeCoupon}
//             required
//             className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full bg-indigo-600 text-white py-3 rounded-md text-lg font-medium hover:bg-indigo-700 transition"
//         >
//           Save Coupon
//         </button>
//       </form>
//     </div>
//   )}
//   {/* Coupons Table */}
//   <CouponTable data = {allCouponData} onDelete={handleDeleteCoupon}/>
// </>



  );
};

export default CreateCoupon;


const CouponTable = ({ data, onDelete }) => {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleDeleteClick = (couponId) => {
    setSelectedCoupon(couponId);
    setShowPopup(true);
  };

  const confirmDelete = () => {
    onDelete(selectedCoupon);
    setShowPopup(false);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-md">
      <div className="overflow-hidden border rounded-lg">
        <table className="w-full text-sm text-gray-700 bg-white">
          <thead className="bg-gray-100 text-gray-800 uppercase text-left">
            <tr>
              <th className="px-4 py-3">Coupon Code</th>
              <th className="px-4 py-3">Discount (%)</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Start Date</th>
              <th className="px-4 py-3">End Date</th>
              <th className="px-4 py-3">Used</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((coupon, index) => (
              <tr
                key={coupon.id}
                className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition-all`}
              >
                <td className="px-4 py-3 font-medium">{coupon.couponCode}</td>
                <td className="px-4 py-3">{coupon.discount}%</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${coupon.active ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}>
                    {coupon.active ? "Active" : "Deactive"}
                  </span>
                </td>
                <td className="px-4 py-3">{new Date(coupon.startDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">{new Date(coupon.endDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">{coupon.used ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-center">
                  <button 
                    className="text-red-600 hover:text-red-800 transition-all"
                    onClick={() => handleDeleteClick(coupon.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <p className="text-gray-800 text-lg font-medium mb-4">Are you sure you want to delete this coupon?</p>
            <div className="flex justify-end space-x-3">
              <button className="bg-gray-300 px-4 py-2 rounded-lg" onClick={() => setShowPopup(false)}>Cancel</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// export default CouponTable;
