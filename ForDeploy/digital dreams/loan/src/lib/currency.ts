/**
 * Currency formatting utilities for INR (Indian Rupee)
 */

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) {
    return '₹0.00';
  }

  return `₹${num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCurrencyCompact(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) {
    return '₹0';
  }

  if (num >= 10000000) {
    // Crores
    return `₹${(num / 10000000).toFixed(2)}Cr`;
  } else if (num >= 100000) {
    // Lakhs
    return `₹${(num / 100000).toFixed(2)}L`;
  } else if (num >= 1000) {
    // Thousands
    return `₹${(num / 1000).toFixed(2)}K`;
  }

  return `₹${num.toFixed(2)}`;
}

export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';
export const CURRENCY_NAME = 'Indian Rupee';
