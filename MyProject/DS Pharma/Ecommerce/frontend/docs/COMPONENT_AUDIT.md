# Component Audit - /ui vs /features Comparison

## 📋 Summary
This document identifies all components across `/components/ui` and `/components/features` to determine which should be consolidated.

---

## Components Currently in /ui
```
ui/
├── Alert.jsx ✅ STAYS (no duplicate in features)
├── AppliedCouponCard.jsx ⚠️ DUPLICATE (also in features/payment/components)
├── Badge.jsx ✅ STAYS (no duplicate in features)
├── Button.jsx ✅ STAYS (no duplicate in features)
├── Card.jsx ✅ STAYS (no duplicate in features)
├── CartItem.jsx ⚠️ DUPLICATE (also in features/cart/components)
├── CategoryIcon.jsx ✅ STAYS (no duplicate in features)
├── DeliveryAddressCard.jsx ⚠️ DUPLICATE (also in features/order/components)
├── ErrorBoundary.jsx ✅ STAYS (no duplicate in features)
├── Input.jsx ✅ STAYS (no duplicate in features)
├── Loader.jsx ✅ STAYS (no duplicate in features)
├── LoadingSpinner.jsx ✅ STAYS (no duplicate in features)
├── MedicineCard.jsx ⚠️ DUPLICATE (also in features/product/components)
├── mockData.js ✅ STAYS (data file, used by home page)
├── Modal.jsx ✅ STAYS (no duplicate in features)
├── Navigation.jsx ✅ STAYS (used by Layout.jsx)
├── OrderCard.jsx ⚠️ DUPLICATE (also in features/order/components)
├── OrderContactSection.jsx ⚠️ DUPLICATE (also in features/order/components)
├── OrderProductCard.jsx ⚠️ DUPLICATE (also in features/order/components)
├── OrderSummary.jsx ⚠️ DUPLICATE (also in features/order/components)
├── OrderTimeline.jsx ⚠️ DUPLICATE (also in features/order/components)
├── Pagination.jsx ✅ STAYS (no duplicate in features)
├── PaymentBreakdownCard.jsx ⚠️ DUPLICATE (also in features/order/components)
├── PriceDisplay.jsx ✅ STAYS (no duplicate in features)
├── ProductActionButtons.jsx ⚠️ DUPLICATE (also in features/product/components)
├── ProductDescription.jsx ⚠️ DUPLICATE (also in features/product/components)
├── ProductImageGallery.jsx ⚠️ DUPLICATE (also in features/product/components)
├── ProductPriceSection.jsx ⚠️ DUPLICATE (also in features/product/components)
├── RatingStars.jsx ✅ STAYS (no duplicate in features)
├── ScrollToTop.jsx ✅ STAYS (used by Layout.jsx)
└── Tabs.jsx ✅ STAYS (no duplicate in features)
```

---

## Components in Features Folders

### /features/product/components
- MedicineCard.jsx ✅
- PharmacyProductCard.jsx ✅
- ProductActionButtons.jsx ✅
- ProductDescription.jsx ✅
- ProductImageGallery.jsx ✅
- ProductPriceSection.jsx ✅

### /features/cart/components
- CartItem.jsx ✅

### /features/order/components
- DeliveryAddressCard.jsx ✅
- OrderCard.jsx ✅
- OrderContactSection.jsx ✅
- OrderProductCard.jsx ✅
- OrderSummary.jsx ✅
- OrderTimeline.jsx ✅
- PaymentBreakdownCard.jsx ✅

### /features/payment/components
- AppliedCouponCard.jsx ✅

---

## Action Plan

### ⚠️ DUPLICATES TO REMOVE FROM /ui (11 files)
These components exist in both /ui and /features. We must:
1. Verify no imports reference the /ui versions
2. Delete the /ui versions
3. Keep only the /features versions

| Component | /ui File | Features File | Status |
|-----------|----------|---------------|--------|
| AppliedCouponCard | ui/AppliedCouponCard.jsx | features/payment/components | TO DELETE |
| CartItem | ui/CartItem.jsx | features/cart/components | TO DELETE |
| DeliveryAddressCard | ui/DeliveryAddressCard.jsx | features/order/components | TO DELETE |
| MedicineCard | ui/MedicineCard.jsx | features/product/components | TO DELETE |
| OrderCard | ui/OrderCard.jsx | features/order/components | TO DELETE |
| OrderContactSection | ui/OrderContactSection.jsx | features/order/components | TO DELETE |
| OrderProductCard | ui/OrderProductCard.jsx | features/order/components | TO DELETE |
| OrderSummary | ui/OrderSummary.jsx | features/order/components | TO DELETE |
| OrderTimeline | ui/OrderTimeline.jsx | features/order/components | TO DELETE |
| PaymentBreakdownCard | ui/PaymentBreakdownCard.jsx | features/order/components | TO DELETE |
| ProductActionButtons | ui/ProductActionButtons.jsx | features/product/components | TO DELETE |
| ProductDescription | ui/ProductDescription.jsx | features/product/components | TO DELETE |
| ProductImageGallery | ui/ProductImageGallery.jsx | features/product/components | TO DELETE |
| ProductPriceSection | ui/ProductPriceSection.jsx | features/product/components | TO DELETE |

### ✅ KEEP IN /ui (19 files)
These are generic/reusable UI components with no feature-specific duplicates:

| Component | Reason |
|-----------|--------|
| Alert.jsx | Generic alert component - no feature duplicate |
| Badge.jsx | Generic badge component - no feature duplicate |
| Button.jsx | Generic button component - no feature duplicate |
| Card.jsx | Generic card container - no feature duplicate |
| CategoryIcon.jsx | Generic icon component - no feature duplicate |
| ErrorBoundary.jsx | Error handling wrapper - no feature duplicate |
| Input.jsx | Generic form input - no feature duplicate |
| Loader.jsx | Generic loader component - no feature duplicate |
| LoadingSpinner.jsx | Generic spinner - no feature duplicate |
| mockData.js | Sample data for home page - data file |
| Modal.jsx | Generic modal dialog - no feature duplicate |
| Navigation.jsx | Used by Layout.jsx (in components/layout) - KEEP |
| Pagination.jsx | Generic pagination component - no feature duplicate |
| PriceDisplay.jsx | Generic price component - no feature duplicate |
| RatingStars.jsx | Generic rating component - no feature duplicate |
| ScrollToTop.jsx | Used by Layout.jsx (in components/layout) - KEEP |
| Tabs.jsx | Generic tabs component - no feature duplicate |

---

## Current Imports Status

### ✅ Already Updated (Features-First)
- `src/pages/CartDetails.jsx` - Uses features imports
- `src/pages/Orders.jsx` - Uses features imports
- `src/pages/ProductDetails.jsx` - Uses features imports
- `src/pages/OrderDetails.jsx` - Uses features imports

### ⚠️ Still Using /ui Imports
- `src/components/layout/Layout.jsx` - Imports Navigation and ScrollToTop from /ui (CORRECT - these stay in /ui)

---

## Deletion Priority

### Phase 1: Immediate Deletions (No breaking changes)
Delete these 14 files from /ui - all have been migrated to features:

```
ui/AppliedCouponCard.jsx
ui/CartItem.jsx
ui/DeliveryAddressCard.jsx
ui/MedicineCard.jsx
ui/OrderCard.jsx
ui/OrderContactSection.jsx
ui/OrderProductCard.jsx
ui/OrderSummary.jsx
ui/OrderTimeline.jsx
ui/PaymentBreakdownCard.jsx
ui/ProductActionButtons.jsx
ui/ProductDescription.jsx
ui/ProductImageGallery.jsx
ui/ProductPriceSection.jsx
```

### Phase 2: Verification
Before deletion, verify:
- [ ] No imports reference deleted files
- [ ] All feature components are exported via barrel exports
- [ ] Build passes with no errors

---

## Index File Updates Needed

### /components/ui/index.js
Remove exports for the 14 duplicate components.

**Current exports to remove:**
- `AppliedCouponCard`
- `CartItem`
- `DeliveryAddressCard`
- `MedicineCard`
- `OrderCard`
- `OrderContactSection`
- `OrderProductCard`
- `OrderSummary`
- `OrderTimeline`
- `PaymentBreakdownCard`
- `ProductActionButtons`
- `ProductDescription`
- `ProductImageGallery`
- `ProductPriceSection`

Keep exports for: Alert, Badge, Button, Card, CategoryIcon, ErrorBoundary, Input, Loader, LoadingSpinner, Modal, Navigation, Pagination, PriceDisplay, RatingStars, ScrollToTop, Tabs

---

## Final Structure After Cleanup

### /components/ui (Generic UI Components - 17 files)
```
ui/
├── Alert.jsx
├── Badge.jsx
├── Button.jsx
├── Card.jsx
├── CategoryIcon.jsx
├── ErrorBoundary.jsx
├── Input.jsx
├── Loader.jsx
├── LoadingSpinner.jsx
├── mockData.js
├── Modal.jsx
├── Navigation.jsx (layout support)
├── Pagination.jsx
├── PriceDisplay.jsx
├── RatingStars.jsx
├── ScrollToTop.jsx (layout support)
├── Tabs.jsx
└── index.js
```

### /components/features (Domain-Specific Components)
```
features/
├── product/
│   ├── components/
│   │   ├── MedicineCard.jsx ✅
│   │   ├── PharmacyProductCard.jsx ✅
│   │   ├── ProductActionButtons.jsx ✅
│   │   ├── ProductDescription.jsx ✅
│   │   ├── ProductImageGallery.jsx ✅
│   │   ├── ProductPriceSection.jsx ✅
│   │   └── index.js
│   └── index.js
├── cart/
│   ├── components/
│   │   ├── CartItem.jsx ✅
│   │   └── index.js
│   └── index.js
├── order/
│   ├── components/
│   │   ├── DeliveryAddressCard.jsx ✅
│   │   ├── OrderCard.jsx ✅
│   │   ├── OrderContactSection.jsx ✅
│   │   ├── OrderProductCard.jsx ✅
│   │   ├── OrderSummary.jsx ✅
│   │   ├── OrderTimeline.jsx ✅
│   │   ├── PaymentBreakdownCard.jsx ✅
│   │   └── index.js
│   └── index.js
├── payment/
│   ├── components/
│   │   ├── AppliedCouponCard.jsx ✅
│   │   └── index.js
│   └── index.js
└── index.js
```

---

## Import Pattern After Cleanup

```javascript
// Generic UI Components (common, reusable)
import { Button, Card, Modal, Input } from '@/components/ui';
import { Alert, Badge, Loader } from '@/components/ui';

// Feature-Specific Components
import { ProductCard, MedicineCard } from '@/components/features/product';
import { CartItem } from '@/components/features/cart';
import { OrderCard, OrderTimeline } from '@/components/features/order';
import { AppliedCouponCard } from '@/components/features/payment';
```

---

## Verification Checklist

- [ ] No imports of deleted /ui files in entire codebase
- [ ] Build runs without errors
- [ ] Dev server starts successfully
- [ ] All pages render correctly
- [ ] Features still work as expected
- [ ] Cart icon styling is pixel-perfect
- [ ] Navigation and layout components work properly

---

**Last Updated:** November 12, 2025
**Status:** Audit Complete - Ready for Implementation
