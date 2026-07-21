// Utility Helpers - Formatting Functions
// ============================================================
// Pure functions for formatting data

import { CURRENCY } from '../constants/appConstants';

// Format price with currency symbol
export const formatPrice = (price) => {
  return `${CURRENCY.SYMBOL}${Number(price).toFixed(CURRENCY.DECIMAL_PLACES)}`;
};

// Format date to readable format
export const formatDate = (dateString, format = 'DD/MM/YYYY') => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  if (format === 'DD/MM/YYYY') {
    return `${day}/${month}/${year}`;
  } else if (format === 'MMM DD, YYYY') {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  return date.toLocaleDateString();
};

// Format time
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format date and time together
export const formatDateTime = (dateString) => {
  return `${formatDate(dateString)} ${formatTime(dateString)}`;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Capitalize first letter
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Format string to title case
export const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
