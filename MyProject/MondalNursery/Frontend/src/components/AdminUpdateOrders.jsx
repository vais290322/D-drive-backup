import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import SummaryApi from '../common/index';
import { toast } from 'react-toastify';

const AdminUpdateOrders = ({
    DeliveryStatus ,
    IsPaid ,
    OrderId,
    onClose,
    callFunc,
}) => {

    // console.log("orderId", OrderId);
    
    const [deliveryStatus, setDeliveryStatus] = useState(DeliveryStatus);
    const [isPaid, setIsPaid] = useState(IsPaid);

    const handleOnChangeSelectStatus = (e) => {
        setDeliveryStatus(e.target.value);
        // console.log("for status: ", e.target.value);
    }

    const handleOnChangeSelectPaid = (e) => {
        setIsPaid(e.target.value === 'true'); // Convert to boolean
        // console.log("for paid: ", e.target.value);
    }

    // console.log("delivery status", deliveryStatus);
    // console.log("isPaid", isPaid);

    const updateOrder = async () => {
        const fetchResponse = await fetch(SummaryApi.updateOrders.url, {
            method: SummaryApi.updateOrders.method,
            credentials: 'include',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                deliveryStatus: deliveryStatus,
                isPaid: isPaid,
                orderId: OrderId
            })
        });

        const responseData = await fetchResponse.json();

        if (responseData.success) {
            toast.success(responseData.message);
            onClose();
            callFunc();
        } else {
            toast.error(responseData.message || "Order update failed");
        }

        // console.log("Order updated", responseData);
    }

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-between items-center bg-slate-200 bg-opacity-50'>
            <div className='mx-auto bg-white shadow-md p-4 w-full max-w-sm'>

                <button className='block ml-auto' onClick={onClose}>
                    <IoMdClose />
                </button>

                <h1 className='pb-4 text-lg font-medium'>Change delivery status or isPaid</h1>

                <div className='flex items-center justify-between my-4'>
                    <p>Delivery Status:</p>
                    <select className='border px-4 py-1' value={deliveryStatus} onChange={handleOnChangeSelectStatus}>
                        <option >Choose Status</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                </div>
                <div className='flex items-center justify-between my-4'>
                    <p>IsPaid:</p>
                    <select className='border px-4 py-1' value={isPaid} onChange={handleOnChangeSelectPaid}>
                        <option >Choose Payment</option>
                        <option value="true">true</option>
                        <option value="false">false</option>
                    </select>
                </div>

                <button className='w-fit mx-auto block py-1 px-3 rounded-full bg-red-600 text-white hover:bg-red-700' onClick={updateOrder}>
                    Update Order
                </button>
            </div>
        </div>
    );
}

export default AdminUpdateOrders;
