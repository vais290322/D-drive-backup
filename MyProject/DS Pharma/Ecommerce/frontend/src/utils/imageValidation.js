/**
 * Image Validation Utilities
 * Validates file type, size, and format for profile picture uploads
 */

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 4 * 1024 * 1024; // 4MB

/**
 * Validates image file type and size
 * @param {File} file - The file to validate
 * @throws {Error} If validation fails
 * @returns {boolean} True if valid
 */
export const validateImage = (file) => {
  if (!file) {
    throw new Error("No file provided");
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(
      "Invalid file type. Only JPG, PNG, and WebP images are allowed."
    );
  }

  if (file.size > MAX_SIZE) {
    throw new Error(
      "File size exceeds 4MB limit. Please choose a smaller image."
    );
  }

  return true;
};

/**
 * Creates a preview URL for an image file
 * @param {File} file - The image file
 * @returns {Promise<string>} Preview URL (base64)
 */
export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

/**
 * Converts file to base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} Base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to convert file"));
    reader.readAsDataURL(file);
  });
};

/**
 * Gets file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Default avatar URL
 */
export const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=10B981&color=fff&size=200";
