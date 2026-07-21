import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { backendDomainA } from "../../../common/index";
import { IoMdClose } from "react-icons/io";

const ReceivedPoPage = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentItem, setCurrentItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [totalSellingAmount, setTotalSellingAmount] = useState(0);

  // console.log("currentItem : ", currentItem);
  const handleOpenModal = (item) => { 
    setCurrentItem(item);
    setOpenModal(true);
  };

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item?.buyer?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      item?.date?.includes(searchTerm.toLowerCase()) 
     

    return matchesSearch;
  });

  const fetchAllPO = async () => {
    try {
      const response = await axios.get(
        `${backendDomainA}/api/v1/purchase-order/all`
      );
      // console.log("response : ", response);

      if (response) {
        toast.success(response?.data?.message);
        setData(response?.data?.data);
        
        // Calculate total selling amount
        const total = response?.data?.data?.reduce((sum, item) => {
          return sum + (parseFloat(item?.totalAmount) || 0);
        }, 0);
        setTotalSellingAmount(total);
      }
    } catch (error) {
      console.log("error : ", error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchAllPO();
  }, []);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData?.length / rowsPerPage);

  return (
    <div className="p-4">
       <div className="mb-6 bg-white p-4">
        <h1 className="text-2xl font-semibold text-gray-800">All transer items lists in MNS to Snigdha </h1>
        <p className="text-gray-600">Manage and review all transfer list here.</p>
        
        {/* Total Selling Amount Card */}
        <div className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium opacity-90">Total Transfer Amount</h2>
              <p className="text-3xl font-bold mt-1">₹ {totalSellingAmount.toLocaleString()}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-sm opacity-80">
            <span>Total from {data.length} transfer list </span>
          </div>
        </div>
      </div>

      {/* for searching by name or email, segment, and status */}
      <div className="bg-white p-4 mb-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <input
          type="text"
          placeholder="Search name or date "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        />
      </div>

      {/* table */}
      <div className="overflow-x-auto bg-white">
      <div className="max-h-auto overflow-y-auto border border-b-none border-gray-300 rounded-lg">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-gray-300 px-4 py-2 text-left">
                S.No
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Buyer Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Contact
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Total Amount
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Ship Location
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((item, index) => (
              <tr
                key={item.id}
                className="hover:bg-gray-200 cursor-pointer"
                onClick={() => handleOpenModal(item)}
              >
                <td className="border border-gray-300 px-4 py-2 text-left">
                  {indexOfFirstRow + index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item?.buyer}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item?.contactPersonNumber}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item?.totalAmount}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item?.shipLocation}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item?.date
                    ? new Date(item.date).toISOString().split("T")[0]
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => handlePageChange("prev")}
           className="bg-gradient-to-r from-pink-500 to-blue-500 cursor-pointer text-black px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-green-500 transition duration-300 border-amber-300 hover:to-pink-500 disabled:opacity-50 "
        >
        Previous  
        </button>
        <div>
          <select
            className="border p-2 rounded"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </div>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange("next")}
           className="bg-gradient-to-r from-pink-500 to-blue-500 cursor-pointer text-black px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-green-500 transition duration-300 border-amber-300 hover:to-pink-500 disabled:opacity-50 "
        >
        Next  
        </button>
      </div>

      {openModal && currentItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white w-[60%] max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <IoMdClose size={24} />
            </button>

            {/* Modal Header */}
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-4">
              Purchase Order Details
            </h2>

            {/* General Details */}
            <div className="mb-6 grid grid-cols-2 gap-4 text-gray-700">
              <p>
                <strong className="text-gray-900">PO ID:</strong>{" "}
                {currentItem._id}
              </p>
              <p>
                <strong className="text-gray-900">Date:</strong>{" "}
                {new Date(currentItem.date).toISOString().split("T")[0]}
              </p>
              <p>
                <strong className="text-gray-900">Vendor Quote Ref:</strong>{" "}
                {currentItem.vendorQuoteRef}
              </p>
              <p>
                <strong className="text-gray-900">Billing Location:</strong>{" "}
                {currentItem.billLocation}
              </p>
              <p>
                <strong className="text-gray-900">Client ID:</strong>{" "}
                {currentItem.clientId}
              </p>
            </div>

            {/* Buyer & Seller Details */}
            <div className="grid grid-cols-2 gap-6">
              {/* Buyer Section */}
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Buyer Details
                </h3>
                <p>
                  <strong>Buyer Name:</strong>{" "}
                  {currentItem?.buyer}
                </p>
                <p>
                  <strong>Contact Person's Name:</strong>{" "}
                  {currentItem?.contactPerson}
                </p>
                <p>
                  <strong>Phone:</strong> {currentItem?.contactPersonNumber}
                </p>
                {/* <p>
                  <strong>Address:</strong>{" "}
                  {currentItem?.buyer_details?.address}
                </p>
                <p>
                  <strong>Email:</strong> {currentItem?.buyer_details?.email}
                </p> */}
              </div>

              {/* Seller Section */}
              {/* <div className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Seller Details
                </h3>
                <p>
                  <strong>Name:</strong>{" "}
                  {currentItem?.seller_details?.seller_name}
                </p>
                <p>
                  <strong>Phone:</strong> {currentItem?.seller_details?.ph_no}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {currentItem?.seller_details?.address}
                </p>
                <p>
                  <strong>Email:</strong> {currentItem?.seller_details?.email}
                </p>
              </div>  */}
            </div>

            {/* Company Details */}
            {/* <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Company Details
              </h3>
              <p>
                <strong>Company Name:</strong>{" "}
                {currentItem?.companyDetails?.companyName}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {currentItem?.companyDetails?.companyAddress}
              </p>
              <p>
                <strong>Email:</strong> {currentItem?.companyDetails?.email}
              </p>
              <p>
                <strong>GSTIN:</strong> {currentItem?.companyDetails?.GST_IN}
              </p>
              <p>
                <strong>PAN No:</strong> {currentItem?.companyDetails?.panNo}
              </p>
              <p>
                <strong>Phone:</strong> {currentItem?.companyDetails?.ph_no}
              </p>
            </div> */}

            {/* Item Details Table */}
            {currentItem?.items && currentItem.items.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Items
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-200 text-gray-700">
                      <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Item Name
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Quantity
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Total Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItem.items.map((item, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="border border-gray-300 px-4 py-2">
                            {item.item_name}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {item.quantity}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {item.total_prize}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Purchase Order Summary */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Purchase Order Summary
              </h3>
              <p>
                <strong>Requested By:</strong> {currentItem?.requestedBy}
              </p>
              <p>
                <strong>Department:</strong> {currentItem?.department}
              </p>
              {/* <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-white ${
                    currentItem.status === "pending"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                >
                  {currentItem?.status}
                </span>
              </p> */}
              <p>
                <strong>Total Amount:</strong>{" "}
                <span className="text-lg font-bold text-gray-800">
                  {currentItem?.totalAmount} INR
                </span>
              </p>
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setOpenModal(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceivedPoPage;
