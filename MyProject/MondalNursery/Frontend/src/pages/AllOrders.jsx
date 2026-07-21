import React, { useEffect, useState } from 'react';
import SummaryApi from '../common/index';
import { toast } from 'react-toastify';
import moment from 'moment';
import { MdModeEdit } from "react-icons/md";
import AdminUpdateOrders from '../components/AdminUpdateOrders';
import '../style.css';  // Import the CSS file
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";

const AllOrders = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [openUpdateRole, setOpenUpdateRole] = useState(false);
    const [updateOrderDetails, setUpdateOrderDetails] = useState({
        DeliveryStatus: "",
        IsPaid: "",
        _id: ""
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchAllOrders = async () => {
        const fetchData = await fetch(SummaryApi.allOrders.url, {
            method: SummaryApi.allUser.method,
            credentials: 'include'
        });

        const dataResponse = await fetchData.json();

        if (dataResponse.success) {
            setAllOrders(dataResponse.data);
        } else if (dataResponse.error) {
            toast.error(dataResponse.message);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending':
                return 'text-pending';
            case 'Processing':
                return 'text-processing';
            case 'Shipped':
                return 'text-shipped';
            case 'Delivered':
                return 'text-delivered';
            default:
                return '';
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = allOrders.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(allOrders.length / itemsPerPage);

    return (
        <div className='bg-white p-4'>
            <table className='w-full table-auto border-collapse'>
                <thead>
                    <tr className='bg-black text-white'>
                        <th className='p-2'>Sr.</th>
                        <th className='p-2'>Shipping Address</th>
                        <th className='p-2'>Payment Method</th>
                        <th className='p-2'>Total Price</th>
                        <th className='p-2'>Is Paid</th>
                        <th className='p-2'>Delivery Status</th>
                        <th className='p-2'>Order Date</th>
                        <th className='p-2'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.map((el, index) => (
                        <tr key={index} className='border-b'>
                            <td className='p-2 text-center'>{indexOfFirstItem + index + 1}</td>
                            <td className='p-2'>
                                <div className='text-sm'>
                                    <strong>Name:</strong> {el?.shippingAddress.fullName}<br />
                                    <strong>Email:</strong> {el?.shippingAddress.email}<br />
                                    <strong>City:</strong> {el?.shippingAddress.city}<br />
                                    <strong>Phone:</strong> {el?.shippingAddress.phoneNumber}<br />
                                    <strong>State:</strong> {el?.shippingAddress.state}<br />
                                    <strong>Zip:</strong> {el?.shippingAddress.zipCode}<br />
                                    <strong>Street:</strong> {el?.shippingAddress.streetAddress}
                                </div>
                            </td>
                            <td className='p-2 font-medium text-center'>{el?.paymentMethod}</td>
                            <td className='p-2 font-medium text-center'>{el?.totalPrice}</td>
                            <td className={`p- font-medium  text-center ${el.isPaid ? 'text-green' : 'text-red'}`}>
                                {el.isPaid ? "Yes" : "No"}
                            </td>
                            <td className={`p-2 font-medium  text-center ${getStatusClass(el.deliveryStatus)}`}>
                                {el?.deliveryStatus}
                            </td>
                            <td className='p-2 font-medium  text-center'>{moment(el?.createdAt).format('LL')}</td>
                            <td className='p-2 text-center'>
                                <button className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white'
                                    onClick={() => {
                                        setUpdateOrderDetails(el);
                                        setOpenUpdateRole(true);
                                    }}>
                                    <MdModeEdit />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
                <button
                    className={`p-2 font-medium text-3xl  ${currentPage === 1 ? 'text-gray-200' : 'text-blue-500 '} rounded`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <FaArrowLeftLong />
                    
                </button>

                <span className='font-medium'>Page {currentPage} of {totalPages}</span>
                <button
                    className={`p-2 font-medium text-3xl ${currentPage === totalPages ? 'text-gray-200' : 'text-blue-500 '} rounded`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <FaArrowRightLong />
                    
                </button>
            </div>

            {openUpdateRole && (
                <AdminUpdateOrders
                    onClose={() => setOpenUpdateRole(false)}
                    DeliveryStatus={updateOrderDetails.DeliveryStatus}
                    IsPaid={updateOrderDetails.IsPaid}
                    OrderId={updateOrderDetails._id}
                    callFunc={fetchAllOrders}
                />
            )}
        </div>
    )
}

export default AllOrders;
