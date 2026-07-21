
import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { bookingsAPI } from '@/lib/api';
import { BookingPaymentDetails } from './razorpayPayment';

interface PayPalPaymentProps {
    bookingDetails: BookingPaymentDetails;
    onSuccess: (details: any) => void;
    onError: (error: any) => void;
}

export const PayPalPayment: React.FC<PayPalPaymentProps> = ({ bookingDetails, onSuccess, onError }) => {
    const [error, setError] = useState<string | null>(null);

    const initialOptions = {
        clientId: "ARNNMkrFio0-YeiAd4V2k9e43yvhCciEiBTIMqJw1kDe260e810I5RM56dKc7zvK9ZtVUyipCmh-7xby", // Using the sandbox ID provided
        currency: "USD", // PayPal often requires USD or major currencies in sandbox. INR might not work in some sandbox accounts without specific setup. Let's assume USD for now or check.
        intent: "capture",
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            <div className="z-0 relative">
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={async (data, actions) => {
                        try {
                            // Option 1: Create order on backend
                            const response = await bookingsAPI.initiatePayPalPayment(bookingDetails.bookingId);
                            return response.data.orderId;
                        } catch (err) {
                            setError("Failed to initiate PayPal payment");
                            onError(err);
                            throw err;
                        }
                    }}
                    onApprove={async (data, actions) => {
                        try {
                            // Capture order on backend
                            const response = await bookingsAPI.confirmPayPalPayment({
                                bookingId: bookingDetails.bookingId,
                                orderId: data.orderID
                            });

                            if (response.data.status === 'success') {
                                onSuccess(response.data);
                            } else {
                                throw new Error('Payment confirmation failed');
                            }
                        } catch (err) {
                            setError("Failed to confirm payment");
                            onError(err);
                        }
                    }}
                    onError={(err) => {
                        console.error("PayPal Error:", err);
                        setError("PayPal encountered an error");
                        onError(err);
                    }}
                />
            </div>
        </PayPalScriptProvider>
    );
};
