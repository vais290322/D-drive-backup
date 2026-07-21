# DS Pharma Frontend - Production-Ready Folder Structure Guide

## Current State Analysis
Your project is growing with mixed concerns in the `components/ui` folder (34 files!). Components are not organized by domain/feature, making it harder to:
- Find related components
- Scale features independently
- Manage dependencies clearly
- Onboard new developers

---

## Recommended Folder Structure

```
frontend/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── favicon.ico
│
├── src/
│   │
│   ├── assets/
│   │   ├── images/
│   │   │   ├── heroes/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   └── misc/
│   │   ├── icons/
│   │   │   ├── ui/
│   │   │   ├── categories/
│   │   │   └── payment/
│   │   ├── fonts/
│   │   └── videos/
│   │
│   ├── components/
│   │   │
│   │   ├── common/                    # ⭐ Shared UI components
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Button.module.css
│   │   │   │   └── index.js
│   │   │   ├── Card/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Alert/
│   │   │   ├── Badge/
│   │   │   ├── Loader/
│   │   │   ├── Pagination/
│   │   │   ├── Tabs/
│   │   │   └── index.js (barrel export)
│   │   │
│   │   ├── layout/                    # ⭐ Layout wrapper components
│   │   │   ├── Header/
│   │   │   ├── Navigation/
│   │   │   ├── Footer/
│   │   │   ├── Sidebar/
│   │   │   ├── Layout.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── features/                  # ⭐ Feature-specific components
│   │   │   │
│   │   │   ├── product/               # Product Feature
│   │   │   │   ├── components/
│   │   │   │   │   ├── ProductCard/
│   │   │   │   │   ├── ProductImageGallery/
│   │   │   │   │   ├── ProductPriceSection/
│   │   │   │   │   ├── ProductDescription/
│   │   │   │   │   ├── ProductActionButtons/
│   │   │   │   │   ├── HighlightedProductCard/
│   │   │   │   │   ├── MedicineCard/
│   │   │   │   │   ├── PharmacyProductCard/
│   │   │   │   │   └── index.js
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useProduct.js
│   │   │   │   │   └── useFavorite.js
│   │   │   │   ├── utils/
│   │   │   │   │   └── productHelpers.js
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── cart/                  # Cart Feature
│   │   │   │   ├── components/
│   │   │   │   │   ├── CartItem/
│   │   │   │   │   ├── CartSummary/
│   │   │   │   │   └── index.js
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useCart.js
│   │   │   │   ├── utils/
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── order/                 # Order Feature
│   │   │   │   ├── components/
│   │   │   │   │   ├── OrderCard/
│   │   │   │   │   ├── OrderTimeline/
│   │   │   │   │   ├── OrderProductCard/
│   │   │   │   │   ├── OrderSummary/
│   │   │   │   │   ├── DeliveryAddressCard/
│   │   │   │   │   ├── PaymentBreakdownCard/
│   │   │   │   │   ├── OrderContactSection/
│   │   │   │   │   └── index.js
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useOrder.js
│   │   │   │   ├── utils/
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── category/              # Category Feature
│   │   │   │   ├── components/
│   │   │   │   │   ├── CategoryIcon/
│   │   │   │   │   ├── CategoryList/
│   │   │   │   │   └── index.js
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── payment/               # Payment Feature
│   │   │   │   ├── components/
│   │   │   │   │   ├── PaymentBreakdown/
│   │   │   │   │   ├── AppliedCoupon/
│   │   │   │   │   └── index.js
│   │   │   │   ├── hooks/
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── user/                  # User Feature
│   │   │       ├── components/
│   │   │       │   ├── UserProfile/
│   │   │       │   └── index.js
│   │   │       └── index.js
│   │   │
│   │   ├── sections/                  # ⭐ Page sections (Hero, About, etc.)
│   │   │   ├── HeroSection/
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   ├── HeroSection.module.css
│   │   │   │   └── index.js
│   │   │   ├── BannerSection/
│   │   │   ├── AboutUsSection/
│   │   │   ├── WhyChooseUsSection/
│   │   │   ├── HighlightedCategorySection/
│   │   │   ├── PopularCategoriesSection/
│   │   │   ├── ProductCategorySection/
│   │   │   ├── PharmacyProductsShowcase/
│   │   │   ├── Footer/
│   │   │   └── index.js
│   │   │
│   │   └── index.js (main barrel export)
│   │
│   ├── pages/                        # ⭐ Page components (routes)
│   │   ├── Home/
│   │   │   ├── Home.jsx
│   │   │   ├── Home.module.css
│   │   │   └── index.js
│   │   ├── ProductDetails/
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── ProductDetails.module.css
│   │   │   └── index.js
│   │   ├── CartDetails/
│   │   │   ├── CartDetails.jsx
│   │   │   └── index.js
│   │   ├── Orders/
│   │   │   ├── Orders.jsx
│   │   │   └── index.js
│   │   ├── OrderDetails/
│   │   │   ├── OrderDetails.jsx
│   │   │   └── index.js
│   │   ├── UserProfile/
│   │   │   ├── UserProfile.jsx
│   │   │   └── index.js
│   │   └── index.js (optional - for easy page imports)
│   │
│   ├── hooks/                        # ⭐ Shared custom hooks
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   ├── usePagination.js
│   │   ├── useLocalStorage.js
│   │   ├── useDebounce.js
│   │   └── index.js
│   │
│   ├── context/                      # ⭐ Global state (Context API)
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── ProductContext.jsx
│   │   ├── AppContext.jsx
│   │   └── index.js
│   │
│   ├── services/                     # ⭐ API services (NEW!)
│   │   ├── api/
│   │   │   ├── apiClient.js          # Axios/Fetch wrapper
│   │   │   └── baseURL.js
│   │   ├── productService.js
│   │   ├── cartService.js
│   │   ├── orderService.js
│   │   ├── authService.js
│   │   ├── paymentService.js
│   │   └── index.js
│   │
│   ├── utils/                        # ⭐ Shared utilities
│   │   ├── constants/
│   │   │   ├── appConstants.js
│   │   │   ├── statusColors.js
│   │   │   └── orderStatuses.js
│   │   ├── helpers/
│   │   │   ├── formatters.js         # Format dates, prices, etc.
│   │   │   ├── validators.js         # Form validation
│   │   │   └── calculations.js
│   │   ├── storage/
│   │   │   └── localStorage.js
│   │   ├── errors/
│   │   │   └── errorHandler.js
│   │   └── index.js
│   │
│   ├── styles/                       # ⭐ Global styles
│   │   ├── global.css
│   │   ├── variables.css              # CSS custom properties
│   │   ├── reset.css
│   │   └── animations.css
│   │
│   ├── config/                       # ⭐ Configuration (NEW!)
│   │   ├── routes.js                 # Route configuration
│   │   ├── appConfig.js              # App-wide config
│   │   └── theme.js                  # Theme configuration
│   │
│   ├── types/                        # ⭐ TypeScript types (optional)
│   │   ├── product.types.js
│   │   ├── order.types.js
│   │   ├── user.types.js
│   │   └── index.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── vite.config.js
├── tailwind.config.js
├── package.json
└── PROJECT_STRUCTURE_GUIDE.md (THIS FILE)
```

---

## Directory Explanations

### 1. **`/src/components`** - The Heart of Your UI

#### `common/` - Shared UI Library
**Purpose:** Reusable, generic components used across features
**Examples:** Button, Card, Modal, Input, Badge, Loader

**Why separate?**
- No business logic
- Highly reusable across features
- Easy to test and maintain
- Forms the "Design System"

**Import Pattern:**
```javascript
import { Button, Card, Modal } from '@/components/common';
```

#### `features/` - Domain-Driven Organization
**Purpose:** Group components by business domain/feature
**Structure:** Each feature is self-contained with its own:
- Components
- Custom hooks
- Utils/helpers
- (Eventually: Redux slices, services if needed)

**Why this approach?**
- **Scalability:** Add new features without touching existing code
- **Debugging:** Bug in Orders? Check `/features/order/`
- **Refactoring:** Move/delete a feature easily
- **Team work:** Teams can work on different features independently

**Example - Product Feature:**
```
product/
├── components/          # Only product-related components
├── hooks/              # useProduct, useFavorite
├── utils/              # Product helpers
└── index.js            # Main export
```

**Import Pattern:**
```javascript
import { ProductCard, ProductPriceSection } from '@/components/features/product';
import { useProduct } from '@/components/features/product/hooks';
```

#### `layout/` - Structural Components
**Purpose:** Layout wrappers (Header, Navigation, Footer, Sidebar)
**Why separate?**
- Not a "feature" but not a generic "common" component
- Often wraps entire page sections
- Manages page-level layout

**Import Pattern:**
```javascript
import { Layout, Header, Navigation } from '@/components/layout';
```

#### `sections/` - Page Sections
**Purpose:** Large, page-specific sections (Hero, About, Why Choose Us)
**When to use:**
- Combinations of multiple components
- Visual sections within pages
- Reused across multiple pages

---

### 2. **`/src/pages`** - Route Components
**Purpose:** Components that map to routes
**Structure:** One folder per page, consistent naming

```
pages/
├── Home/
│   ├── Home.jsx          # Main page component
│   ├── Home.module.css   # Page-specific styles
│   └── index.js          # Export
├── ProductDetails/
├── CartDetails/
└── ...
```

**Why folders?**
- Room to grow (add page-specific hooks, utils, styles)
- Consistency
- Easy to understand route structure

**Import Pattern:**
```javascript
import { Home } from '@/pages';
// or
import Home from '@/pages/Home';
```

---

### 3. **`/src/services`** - API & External Services
**Purpose:** Centralize all API calls and external integrations
**Why separate from components?**
- Reusability across components
- Easy to mock for testing
- Single place to manage API base URLs
- Better error handling

**Structure:**
```javascript
// services/productService.js
export const fetchProducts = (filters) => apiClient.get('/products', { params: filters });
export const fetchProductById = (id) => apiClient.get(`/products/${id}`);
```

**Import Pattern:**
```javascript
import { fetchProducts } from '@/services';
```

---

### 4. **`/src/hooks`** - Custom React Hooks
**Purpose:** Reusable hook logic
**Examples:** `useAuth`, `useApi`, `usePagination`, `useLocalStorage`

**Separate from features because:** Shared across multiple features

**Import Pattern:**
```javascript
import { useCart, usePagination } from '@/hooks';
```

---

### 5. **`/src/context`** - Global State Management
**Purpose:** App-wide state (Auth, Cart, Theme, Notifications)

**Structure:**
```javascript
// Each context as a separate file
export const AuthContext = createContext();
export const CartContext = createContext();
```

**When to use Context vs Services:**
- **Context:** UI state (logged in user, theme, notifications)
- **Services:** Data fetching, API calls

---

### 6. **`/src/utils`** - Helper Functions
**Purpose:** Reusable, pure utility functions

**Organize by type:**
```
utils/
├── constants/           # App-wide constants
│   ├── appConstants.js  # Order statuses, colors, etc.
│   └── orderStatuses.js
├── helpers/            # Pure functions
│   ├── formatters.js   # formatPrice, formatDate, etc.
│   ├── validators.js   # Email validation, etc.
│   └── calculations.js # Tax calculations, etc.
├── storage/            # localStorage helpers
└── errors/             # Error handling utilities
```

**Import Pattern:**
```javascript
import { formatPrice, formatDate } from '@/utils/helpers';
import { ORDER_STATUSES } from '@/utils/constants';
```

---

### 7. **`/src/config`** - Application Configuration
**Purpose:** Centralized app configuration

```javascript
// config/routes.js
export const ROUTES = {
  HOME: '/',
  PRODUCT: '/products/:id',
  CART: '/cart',
  ORDERS: '/orders',
  ORDER_DETAILS: '/orders/:id'
};

// config/appConfig.js
export const APP_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_URL,
  APP_NAME: 'DS Pharma',
  ITEMS_PER_PAGE: 12
};
```

**Benefits:**
- Single source of truth for routes
- Easy to find and update configuration
- Environment-specific configs

---

### 8. **`/src/assets`** - Static Assets
**Organize by type, NOT by feature:**

```
assets/
├── images/
│   ├── heroes/      # Hero section images
│   ├── products/    # Product images
│   ├── categories/  # Category icons/images
│   └── misc/        # Misc images
├── icons/
│   ├── ui/          # Generic UI icons
│   ├── categories/  # Category icons
│   └── payment/     # Payment method icons
├── fonts/
└── videos/
```

**Why by type?** Easier to manage and import

---

### 9. **`/src/styles`** - Global Styles
**Purpose:** Global CSS, not component-specific

```
styles/
├── global.css      # Global resets and styles
├── variables.css   # CSS custom properties
├── reset.css       # Browser resets
└── animations.css  # Global animations
```

**Note:** Use CSS Modules or Tailwind for component styles

---

## Barrel Exports Pattern (index.js)

**What:** Re-export all components from a folder in `index.js`

**Why:** Cleaner imports and centralized control

```javascript
// components/common/index.js
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Modal } from './Modal';
export { default as Input } from './Input';
// ... etc

// Usage
import { Button, Card } from '@/components/common';
// Instead of
import Button from '@/components/common/Button/Button';
import Card from '@/components/common/Card/Card';
```

---

## Path Aliases (Recommended Setup)

**In `vite.config.js`:**
```javascript
export default {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
};
```

**Benefits:**
- Cleaner imports: `@/components/common` vs `../../../components/common`
- Easier refactoring: paths don't change when moving files
- Better IDE autocomplete

---

## Scaling Guidelines

### 1. **Component Size Limits**
- If a component folder has 5+ files → split into sub-features
- If a component JSX exceeds 300 lines → extract smaller components

### 2. **Adding New Features**
```
1. Create /components/features/[featureName]/
2. Add components/, hooks/, utils/ inside
3. Create barrel export (index.js)
4. Add feature-specific services if needed
5. Use context only for global state
```

### 3. **When to Extract a Component**
- Used in 2+ places → move to `/common` or share within feature
- Complex logic → extract hooks and utilities
- Styling complexity → use CSS Modules or styled-components

### 4. **Naming Conventions**
```
Components:    PascalCase (Button.jsx, ProductCard.jsx)
Utilities:     camelCase (formatDate.js, validators.js)
Hooks:         useXxx (useCart.js, useAuth.js)
Context:       XxxContext.jsx (CartContext.jsx)
Constants:     UPPER_SNAKE_CASE (ORDER_STATUSES)
Folders:       kebab-case or camelCase (common, features, product)
```

---

## File Organization Within Each Component Folder

```
Button/
├── Button.jsx          # Main component
├── Button.module.css   # Component styles
├── Button.test.jsx     # Tests (when you add them)
├── useButtonLogic.js   # Custom hooks if complex
└── index.js            # Export

// index.js
export { default } from './Button';
```

**Rule:** Keep component folder minimal, focused on that component

---

## Migration Path (Step-by-Step)

If restructuring, follow this order to minimize breaks:

1. **Move common components** → `/components/common/`
2. **Create feature folders** → `/components/features/product/`, `/order/`, etc.
3. **Move feature components** into respective feature folders
4. **Update imports** in pages and other components
5. **Create services folder** → Move API logic here
6. **Create hooks folder** → Extract custom logic
7. **Organize utils** → Group by purpose
8. **Update `App.jsx`** routes

---

## Why This Structure Wins

| Aspect | Benefit |
|--------|---------|
| **Scalability** | Add features without touching existing code |
| **Debugging** | Error in Orders? Check `/features/order/` |
| **Testing** | Isolated components = easier unit tests |
| **Collaboration** | Teams work independently on features |
| **Maintenance** | Clear dependency graph, easy to refactor |
| **Onboarding** | New devs understand structure immediately |
| **Refactoring** | Move/delete features with confidence |
| **Reusability** | Common components are truly shared |

---

## Quick Reference Diagram

```
🎯 User navigates to page
  ↓
📄 /pages/ProductDetails loads
  ↓
📦 Composes /features/product components
  ↓
🎨 Uses /components/common (Button, Card, etc.)
  ↓
🔌 Calls /services/productService
  ↓
⚙️ Manages state with /context & /hooks
  ↓
💾 Fetches/formats data with /utils
```

---

## Additional Recommendations

### 1. **ESLint Rules** (Enforce Structure)
```json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          "../../*",
          "../../../*"
        ]
      }
    ]
  }
}
```

### 2. **Git Ignore Pattern**
Add to `.gitignore`:
```
# Component generated files
*.module.css.d.ts
*.styles.ts.d.ts
```

### 3. **Documentation Template**
For each feature, add `README.md`:
```markdown
# Product Feature

## Overview
Manages product listing, details, and interactions

## Components
- ProductCard: Single product card
- ProductImageGallery: Image carousel

## Hooks
- useProduct: Fetch product data

## Services
- productService: API calls
```

### 4. **Pre-commit Hook** (Prevent Bad Imports)
Use `husky` + `lint-staged` to validate structure on commit

---

## Summary

This structure provides:
- ✅ **Clear separation of concerns**
- ✅ **Independent feature development**
- ✅ **Shared component reusability**
- ✅ **Easy debugging and maintenance**
- ✅ **Production-ready scalability**
- ✅ **Team collaboration friendly**

Implement it incrementally—don't rush the refactor! 🚀
