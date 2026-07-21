/**
 * Razorpay Configuration
 *
 * Payment gateway configuration for Maquam Holidays
 * Currency: INR (Indian Rupees)
 * Market: India
 */

export const razorpayConfig = {
  // Razorpay API credentials (from environment variables)
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
  keySecret: import.meta.env.VITE_RAZORPAY_KEY_SECRET || '',

  // Currency and locale
  currency: 'INR',
  locale: 'en',

  // Company branding
  companyName: 'Maquam Holidays Pvt Ltd',
  companyLogo: '/logo.png',
  companyDescription: 'Islamic-Friendly Travel & Pilgrimage Services',

  // Theme colors (Islamic-friendly design)
  theme: {
    color: '#0D9488', // Deep teal
    backdrop_color: '#F9FAFB',
  },

  // Payment options
  paymentMethods: {
    card: true,
    netbanking: true,
    wallet: true,
    upi: true,
    emi: true,
    paylater: false,
  },

  // Payout configuration
  payoutConfig: {
    defaultSchedule: 'weekly', // daily, weekly, monthly
    defaultMode: 'IMPS', // IMPS, NEFT, RTGS
    commissionRate: 0.15, // 15% platform commission
    firstThreeMonthsCommission: 0, // 0% for first 3 months
    minPayoutAmount: 100, // Minimum ₹100
  },
};

/**
 * Load Razorpay script dynamically
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (typeof window.Razorpay !== 'undefined') {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

/**
 * Format amount for display (INR)
 */
export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Convert amount to paise (Razorpay uses paise)
 */
export const toPaise = (rupees) => {
  return Math.round(rupees * 100);
};

/**
 * Convert paise to rupees
 */
export const toRupees = (paise) => {
  return paise / 100;
};
