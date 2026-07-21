import React, { useEffect, useState } from 'react';
import SummaryApi from '../common/index';
import { toast } from 'react-toastify';
import moment from 'moment';
import { MdModeEdit } from "react-icons/md";
import AdminUpdateOrders from '../components/AdminUpdateOrders';
import '../style.css';  // Import the CSS file
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const AllOrders = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [openUpdateRole, setOpenUpdateRole] = useState(false);
    const [updateOrderDetails, setUpdateOrderDetails] = useState({
        DeliveryStatus: "",
        IsPaid: "",
        _id: ""
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchAllOrders = async () => {
        const fetchData = await fetch(SummaryApi.allOrders.url, {
            method: SummaryApi.allUser.method,
            credentials: 'include'
        });

        const dataResponse = await fetchData.json();

        // console.log("data response : ", dataResponse);

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
    const currentOrders = allOrders?.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(allOrders.length / itemsPerPage);

    const closeModal = () => {
        setSelectedOrder(null);
    };

    const handleEditClick = (e, el) => {
        e.stopPropagation(); // Stop the row click event
        setUpdateOrderDetails(el);
        setOpenUpdateRole(true); // Open the AdminUpdateOrders modal
    };


    return (
        <div className='bg-white p-4'>
            <table className='w-full table-auto border-collapse'>
                <thead>
                    <tr className='bg-black text-white'>
                        <th className='p-2'>Sr.</th>
                        <th className='p-2 hidden md:table-cell'>Shipping Address</th>
                        <th className='p-2 hidden md:table-cell'>Payment Method</th>
                        <th className='p-2'>Total Price</th>
                        <th className='p-2'>Is Paid</th>
                        <th className='p-2'>Delivery Status</th>
                        <th className='p-2 hidden md:table-cell'>Order Date</th>
                        <th className='p-2'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders?.map((el, index) => (
                        // console.log(el),
                        <tr key={index} className='border-b cursor-pointer hover:bg-gray-200' onClick={() => setSelectedOrder(el)} >
                            <td className='p-2 text-center'>{indexOfFirstItem + index + 1}</td>
                            <td className='p-2 hidden md:table-cell'>
                                <div className='text-sm '>
                                    <strong>Name:</strong> {el?.shippingAddress.fullName}<br />
                                    <strong>Email:</strong> {el?.shippingAddress.email}<br />
                                    <strong>City:</strong> {el?.shippingAddress.city}<br />
                                    <strong>Phone:</strong> {el?.shippingAddress.phoneNumber}<br />
                                    <strong>State:</strong> {el?.shippingAddress.state}<br />
                                    <strong>Zip:</strong> {el?.shippingAddress.zipCode}<br />
                                    <strong>Street:</strong> {el?.shippingAddress.streetAddress}
                                </div>
                            </td>
                            <td className='p-2 font-medium text-center hidden md:table-cell'>{el?.paymentMethod}</td>
                            <td className='p-2 font-medium text-center'>{el?.totalPrice}</td>
                            <td className={`p- font-medium  text-center ${el.isPaid ? 'text-green' : 'text-red'}`}>
                                {el.isPaid ? "Yes" : "No"}
                            </td>
                            <td className={`p-2 font-medium  text-center ${getStatusClass(el.deliveryStatus)}`}>
                                {el?.deliveryStatus}
                            </td>
                            <td className='p-2 font-medium  text-center hidden md:table-cell'>{moment(el?.createdAt).format('LL')}</td>
                            <td className='p-2 text-center'>
                                <button
                                    className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white'
                                    onClick={(e) => handleEditClick(e, el)}
                                >
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
                    disabled={currentPage === totalPages || allOrders.length === 0}
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



            {/* {selectedOrder && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl relative'>
                        <button
                            className='absolute top-2 right-2 text-red-500 hover:text-red-700'
                            onClick={closeModal}
                        >
                            <IoMdClose size={24} />
                        </button>
                        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                        <p><strong>Total Price:</strong> {selectedOrder.totalPrice}</p>
                        <p><strong>Shipping Price:</strong> {selectedOrder.shippingPrice}</p>
                        <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                        <p><strong>Delivery Status:</strong> {selectedOrder.deliveryStatus}</p>

                        <h2 className='text-xl font-bold mb-4'>Order Details</h2>
                        {selectedOrder.orderItems.map((item, idx) => (
                            <div key={idx} className='border-b pb-4 mb-4'>
                                <h3 className='font-semibold'><strong>Product Name:</strong> {item.productId.productName}</h3>
                                <p><strong>Brand:</strong> {item.productId.brandName}</p>
                                <p><strong>Category:</strong> {item.productId.category}</p>
                                <p><strong>Selling Price:</strong> {item.productId.sellingPrice}</p>
                                <p><strong>Quantity:</strong> {item.quantity}</p>
                                <div className='flex gap-2 mt-2'>
                                    {item.productId.productImage.map((img, imgIdx) => (
                                        <img key={imgIdx} src={img} alt='Product' className='w-20 h-20 object-cover rounded-lg' />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )} */}

            {selectedOrder && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mt-4'>
                    <div className='bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl relative max-h-[90vh] flex flex-col'>
                        <button
                            className='absolute top-2 right-2 text-red-500 hover:text-red-700'
                            onClick={closeModal}
                        >
                            <IoMdClose size={24} />
                        </button>

                        <div className="flex-none">
                            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                            <p><strong>Total Price:</strong> {selectedOrder.totalPrice}</p>
                            <p><strong>Shipping Price:</strong> {selectedOrder.shippingPrice}</p>
                            <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                            <p><strong>Delivery Status:</strong> {selectedOrder.deliveryStatus}</p>
                            <h2 className='text-xl font-bold mb-4'>Order Details</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2">
                            {selectedOrder.orderItems.map((item, idx) => (
                                <div key={idx} className='border-b pb-4 mb-4'>
                                    <h3 className='font-semibold'><strong>Product Name:</strong> {item.productId.productName}</h3>
                                    <p><strong>Brand:</strong> {item.productId.brandName}</p>
                                    <p><strong>Category:</strong> {item.productId.category}</p>
                                    <p><strong>Selling Price:</strong> {item.productId.sellingPrice}</p>
                                    <p><strong>Quantity:</strong> {item.quantity}</p>
                                    <div className='flex gap-2 mt-2'>
                                        {item.productId.productImage.map((img, imgIdx) => (
                                            <img key={imgIdx} src={img?.url} alt='Product' className='w-20 h-20 object-cover rounded-lg' />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default AllOrders;


