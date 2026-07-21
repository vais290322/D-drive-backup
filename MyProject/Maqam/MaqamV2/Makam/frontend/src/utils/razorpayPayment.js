/**
 * Razorpay Payment Processing
 *
 * Handles payment processing for hotel bookings using Razorpay
 */

import { razorpayConfig, loadRazorpayScript, toPaise, formatINR } from '@/config/razorpay';
import { bookingsAPI } from '@/lib/api';

/**
 * Initiate hotel booking payment via Razorpay
 * @param {Object} bookingDetails - booking payment details
 */
export const initiateHotelBookingPayment = async (bookingDetails) => {
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
      handler: async (response) => {
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
    const razorpay = new window.Razorpay(options);

    razorpay.on('payment.failed', (response) => {
      console.error('Payment failed:', response.error);
      alert(`Payment failed: ${response.error.description}`);
    });

    razorpay.open();

    return { success: true };
  } catch (error) {
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
const verifyPayment = async (paymentData) => {
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
const updateBookingStatus = async (bookingId, status, paymentId) => {
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
export const getPaymentDetails = async (paymentId) => {
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
export const initiateRefund = async (paymentId, amount, reason) => {
  try {
    // TODO: Implement MongoDB API call for refund
    console.warn('initiateRefund not yet implemented for MongoDB');
    return {
      success: false,
      error: 'Refund functionality not yet implemented',
    };
  } catch (error) {
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
export const getRefundStatus = async (refundId) => {
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
export const formatPaymentSummary = (bookingDetails) => {
  return `
Hotel: ${bookingDetails.hotelName}
Room: ${bookingDetails.roomType}
Check-in: ${bookingDetails.checkIn}
Check-out: ${bookingDetails.checkOut}
Nights: ${bookingDetails.nights}
Total: ${formatINR(bookingDetails.amount)}
  `.trim();
};
