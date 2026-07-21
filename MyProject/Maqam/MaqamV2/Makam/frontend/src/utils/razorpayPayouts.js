/**
 * Razorpay Payout Management
 *
 * Handles payouts to hotel partners using Razorpay Payouts API
 *
 * NOTE: This module is currently disabled pending MongoDB backend implementation.
 * All functions return placeholder responses.
 */

import { formatINR, toRupees } from '@/config/razorpay';

export const createPayout = async (payoutDetails) => {
  console.warn('createPayout not yet implemented for MongoDB');
  return {
    success: false,
    error: 'Payout functionality not yet implemented',
  };
};

export const getPayoutStatus = async (payoutId) => {
  console.warn('getPayoutStatus not yet implemented for MongoDB');
  return null;
};

export const calculateHotelierPayout = (bookingAmount, commissionRate = 0.15) => {
  const platformFee = bookingAmount * commissionRate;
  const hotelierAmount = bookingAmount - platformFee;
  return { hotelierAmount, platformFee };
};

export const formatPayoutSummary = (payout) => {
  return `Payout ${payout.id}: ${formatINR(toRupees(payout.amount))} - ${payout.status}`;
};

export default {
  createPayout,
  getPayoutStatus,
  calculateHotelierPayout,
  formatPayoutSummary,
};
