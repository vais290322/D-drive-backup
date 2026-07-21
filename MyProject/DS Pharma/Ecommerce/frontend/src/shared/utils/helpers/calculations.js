// Utility Helpers - Calculation Functions
// ============================================================
// Pure functions for business logic calculations

import { CURRENCY } from '../constants/appConstants';

// Calculate discount percentage
export const calculateDiscount = (originalPrice, currentPrice) => {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// Calculate tax on amount
export const calculateTax = (amount, taxRate = 18) => {
  return (amount * taxRate) / 100;
};

// Calculate total with tax
export const calculateTotal = (subtotal, taxRate = 18, discountAmount = 0) => {
  const tax = calculateTax(subtotal, taxRate);
  return subtotal + tax - discountAmount;
};

// Calculate shipping cost
export const calculateShipping = (cartTotal, freeShippingThreshold = 500) => {
  if (cartTotal >= freeShippingThreshold) return 0;
  return 50; // Fixed shipping cost below threshold
};

// Calculate cart total with all fees
export const calculateCartTotal = (items, discountAmount = 0, freeShippingThreshold = 500) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = calculateShipping(subtotal, freeShippingThreshold);
  const tax = calculateTax(subtotal, 18);
  const total = subtotal + tax + shipping - discountAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    discount: discountAmount,
    total: Math.round(total * 100) / 100,
  };
};

// Round to 2 decimal places (for currency)
export const roundToTwoDecimals = (number) => {
  return Math.round(number * 100) / 100;
};

// Average rating calculation
export const calculateAverageRating = (ratings) => {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return roundToTwoDecimals(sum / ratings.length);
};

// Days until date
export const daysUntilDate = (targetDate) => {
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Days since date
export const daysSinceDate = (pastDate) => {
  const today = new Date();
  const past = new Date(pastDate);
  const diffTime = today - past;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
