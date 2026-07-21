// Utility Helpers - Validation Functions
// ============================================================
// Pure functions for form and data validation

// Validate email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Indian format)
export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// Validate password strength
export const validatePassword = (password) => {
  // At least 8 chars, 1 uppercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Get password strength level
export const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;

  if (strength <= 1) return 'weak';
  if (strength <= 2) return 'fair';
  if (strength <= 3) return 'good';
  return 'strong';
};

// Validate required field
export const isRequired = (value) => {
  if (typeof value === 'string') return value.trim().length > 0;
  return Boolean(value);
};

// Validate minimum length
export const minLength = (value, length) => {
  return String(value).length >= length;
};

// Validate maximum length
export const maxLength = (value, length) => {
  return String(value).length <= length;
};

// Validate number range
export const numberRange = (value, min, max) => {
  const num = Number(value);
  return num >= min && num <= max;
};

// Validate pincode (India)
export const validatePincode = (pincode) => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

// Validate URL
export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
