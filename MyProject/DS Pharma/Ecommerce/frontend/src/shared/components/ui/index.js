// Generic UI Components - Reusable across features
export { default as Button } from "./Button";
export { default as Card } from "./Card";
export { default as Badge } from "./Badge";
export { default as Input } from "./Input";
export { default as Modal } from "./Modal";
export { default as Alert } from "./Alert";
export { default as Loader } from "./Loader";
export { default as LoadingSpinner } from "./LoadingSpinner";
export { default as PriceDisplay } from "./PriceDisplay";
export { default as RatingStars } from "./RatingStars";
export { default as Tabs } from "./Tabs";
export { default as Pagination } from "./Pagination";
export { default as ErrorBoundary } from "./ErrorBoundary";
export { default as CategoryIcon } from "./CategoryIcon";

// Layout & Navigation Support
export { default as ScrollToTop } from "./ScrollToTop";

// Note: mockData.js uses named exports (SAMPLE_TIMELINE_DATA, SAMPLE_ORDER_DATA, etc.)
// Import these directly from '@/components/ui/mockData' where needed

// ⚠️ NOTE: Feature-specific components have been moved to /components/features/
// - ProductImageGallery, ProductPriceSection, ProductActionButtons, ProductDescription → /components/features/product/components/
// - OrderProductCard, OrderTimeline, OrderSummary, OrderCard, OrderContactSection → /components/features/order/components/
// - DeliveryAddressCard, PaymentBreakdownCard → /components/features/order/components/
// - CartItem → /components/features/cart/components/
// - AppliedCouponCard → /components/features/payment/components/
// - MedicineCard → /components/features/product/components/
