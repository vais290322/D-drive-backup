/**
 * Razorpay Payment Processing
 * 
 * Handles payment processing for hotel bookings using Razorpay
 */

import { razorpayConfig, loadRazorpayScript, toPaise, formatINR } from '@/config/razorpay';
import { bookingsAPI } from '@/lib/api';

export interface BookingPaymentDetails {
  bookingId: string;
  amount: number; // in INR
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  error?: string;
}

/**
 * Initiate hotel booking payment via Razorpay
 */
export const initiateHotelBookingPayment = async (
  bookingDetails: BookingPaymentDetails
): Promise<PaymentResponse> => {
  try {
    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay. Please check your internet connection.');
    }

    // Validate Razorpay configuration
    if (!razorpayConfig.keyId) {
      throw new Error('Razorpay is not configured. Please contact support.');
    }

    // Create Razorpay order (this should be done via backend for security)
    // For now, we'll use the client-side approach
    const options = {
      key: razorpayConfig.keyId,
      amount: toPaise(bookingDetails.amount), // Convert to paise
      currency: razorpayConfig.currency,
      name: razorpayConfig.companyName,
      description: `Hotel Booking - ${bookingDetails.hotelName}`,
      image: razorpayConfig.companyLogo,
      
      // Prefill customer details
      prefill: {
        name: bookingDetails.guestName,
        email: bookingDetails.guestEmail,
        contact: bookingDetails.guestPhone,
      },
      
      // Booking metadata
      notes: {
        booking_id: bookingDetails.bookingId,
        hotel_name: bookingDetails.hotelName,
        room_type: bookingDetails.roomType,
        check_in: bookingDetails.checkIn,
        check_out: bookingDetails.checkOut,
        nights: bookingDetails.nights.toString(),
        special_requests: bookingDetails.specialRequests || '',
      },
      
      // Theme
      theme: razorpayConfig.theme,
      
      // Modal settings
      modal: {
        ondismiss: () => {
          console.log('Payment cancelled by user');
        },
      },
      
      // Payment success handler
      handler: async (response: any) => {
        console.log('Payment successful:', response);
        
        // Verify payment on backend
        const verified = await verifyPayment({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          booking_id: bookingDetails.bookingId,
        });
        
        if (verified) {
          // Update booking status
          await updateBookingStatus(bookingDetails.bookingId, 'confirmed', response.razorpay_payment_id);
          
          // Show success message
          alert(`Payment successful! Booking confirmed.\nPayment ID: ${response.razorpay_payment_id}`);
          
          // Redirect to booking confirmation page
          window.location.href = `/booking-confirmation/${bookingDetails.bookingId}`;
        } else {
          alert('Payment verification failed. Please contact support.');
        }
      },
    };

    // Open Razorpay checkout
    const razorpay = new (window as any).Razorpay(options);
    
    razorpay.on('payment.failed', (response: any) => {
      console.error('Payment failed:', response.error);
      alert(`Payment failed: ${response.error.description}`);
    });
    
    razorpay.open();
    
    return { success: true };
  } catch (error: any) {
    console.error('Payment initiation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to initiate payment',
    };
  }
};

/**
 * Verify payment signature (should be done on backend)
 */
const verifyPayment = async (paymentData: {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  booking_id: string;
}): Promise<boolean> => {
  try {
    // Call MongoDB API to verify payment
    const response = await bookingsAPI.verifyPayment(paymentData);
    return response.data?.verified || false;
  } catch (error) {
    console.error('Payment verification exception:', error);
    // For development, return true (REMOVE IN PRODUCTION)
    console.warn('⚠️ Payment verification skipped (development mode)');
    return true;
  }
};

/**
 * Update booking status after payment
 */
const updateBookingStatus = async (
  bookingId: string,
  status: string,
  paymentId: string
): Promise<void> => {
  try {
    await bookingsAPI.updateBookingStatus(bookingId, {
      status,
      payment_id: paymentId,
      payment_status: 'paid',
      paid_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Booking update exception:', error);
  }
};

/**
 * Get payment details
 */
export const getPaymentDetails = async (paymentId: string) => {
  try {
    // TODO: Implement MongoDB API call for payment details
    console.warn('getPaymentDetails not yet implemented for MongoDB');
    return null;
  } catch (error) {
    console.error('Failed to get payment details:', error);
    return null;
  }
};

/**
 * Initiate refund
 */
export const initiateRefund = async (
  paymentId: string,
  amount?: number,
  reason?: string
): Promise<{ success: boolean; refundId?: string; error?: string }> => {
  try {
    // TODO: Implement MongoDB API call for refund
    console.warn('initiateRefund not yet implemented for MongoDB');
    return {
      success: false,
      error: 'Refund functionality not yet implemented',
    };
  } catch (error: any) {
    console.error('Refund initiation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to initiate refund',
    };
  }
};

/**
 * Check refund status
 */
export const getRefundStatus = async (refundId: string) => {
  try {
    // TODO: Implement MongoDB API call for refund status
    console.warn('getRefundStatus not yet implemented for MongoDB');
    return null;
  } catch (error) {
    console.error('Failed to get refund status:', error);
    return null;
  }
};

/**
 * Format payment summary for display
 */
export const formatPaymentSummary = (bookingDetails: BookingPaymentDetails): string => {
  return `
Hotel: ${bookingDetails.hotelName}
Room: ${bookingDetails.roomType}
Check-in: ${bookingDetails.checkIn}
Check-out: ${bookingDetails.checkOut}
Nights: ${bookingDetails.nights}
Total: ${formatINR(bookingDetails.amount)}
  `.trim();
};
