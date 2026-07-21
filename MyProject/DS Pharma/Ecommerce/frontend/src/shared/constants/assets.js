import fallbackImage from "@/assets/images/medicine.jpeg";

export const FALLBACK_IMAGE = fallbackImage;

export const handleImageError = (e) => {
  e.currentTarget.onerror = null; // Prevent infinite loop
  e.currentTarget.src = FALLBACK_IMAGE;
};
