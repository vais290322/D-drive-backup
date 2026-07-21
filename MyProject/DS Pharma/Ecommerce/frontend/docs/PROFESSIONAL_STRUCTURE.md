# Professional React + Tailwind Project Structure Guide

A complete, production-ready folder organization for scalable React applications.

---

## 📁 Complete Folder Tree

```
project-root/
│
├── public/                          # Static assets served as-is
│   ├── favicon.ico
│   ├── robots.txt
│   └── manifest.json
│
├── src/
│   │
│   ├── components/                  # 🎨 Reusable UI Components
│   │   │
│   │   ├── common/                  # Shared, generic components
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Button.module.css
│   │   │   │   └── index.js
│   │   │   ├── Card/
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Card.module.css
│   │   │   │   └── index.js
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Badge/
│   │   │   ├── Loader/
│   │   │   ├── Pagination/
│   │   │   ├── Dropdown/
│   │   │   └── index.js             # Barrel export
│   │   │
│   │   ├── layout/                  # Layout wrapper components
│   │   │   ├── Navbar/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Navbar.module.css
│   │   │   │   └── index.js
│   │   │   ├── Sidebar/
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── MainLayout.jsx       # Main layout wrapper
│   │   │   └── index.js
│   │   │
│   │   ├── features/                # Feature-specific components
│   │   │   ├── product/
│   │   │   │   ├── ProductCard/
│   │   │   │   │   ├── ProductCard.jsx
│   │   │   │   │   ├── ProductCard.module.css
│   │   │   │   │   └── index.js
│   │   │   │   ├── ProductList/
│   │   │   │   ├── ProductFilters/
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useProduct.js
│   │   │   │   │   └── useProductFilter.js
│   │   │   │   ├── utils/
│   │   │   │   │   └── productHelpers.js
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm/
│   │   │   │   ├── SignupForm/
│   │   │   │   ├── ProtectedRoute/
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useAuth.js
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── cart/
│   │   │   │   ├── CartItem/
│   │   │   │   ├── CartSummary/
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useCart.js
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── dashboard/
│   │   │       ├── StatCard/
│   │   │       ├── ChartWidget/
│   │   │       └── index.js
│   │   │
│   │   └── index.js                 # Main component barrel export
│   │
│   ├── pages/                       # 📄 Page/Route Components
│   │   ├── HomePage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── ProductPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── NotFoundPage.jsx         # 404 page
│   │   └── ErrorPage.jsx            # Error boundary page
│   │
│   ├── hooks/                       # 🔧 Custom React Hooks
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   ├── useFetch.js
│   │   ├── usePagination.js
│   │   ├── useLocalStorage.js
│   │   ├── useDebounce.js
│   │   ├── useWindowSize.js
│   │   ├── useClickOutside.js
│   │   └── index.js
│   │
│   ├── context/                     # 🌍 Global State Management
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── ThemeContext.jsx
│   │   ├── NotificationContext.jsx
│   │   ├── index.js
│   │   └── README.md                # Context usage guide
│   │
│   ├── services/                    # 📡 API Services & External Integrations
│   │   ├── api/
│   │   │   ├── apiClient.js         # Axios/Fetch wrapper
│   │   │   ├── baseURL.js
│   │   │   └── interceptors.js
│   │   ├── auth.service.js
│   │   ├── product.service.js
│   │   ├── cart.service.js
│   │   ├── payment.service.js
│   │   ├── user.service.js
│   │   └── index.js
│   │
│   ├── utils/                       # 🛠️ Utility Functions
│   │   ├── constants/
│   │   │   ├── appConstants.js      # App-wide constants
│   │   │   ├── colors.js
│   │   │   ├── endpoints.js
│   │   │   ├── messages.js
│   │   │   └── validation.js
│   │   ├── helpers/
│   │   │   ├── formatters.js        # Format dates, currency, etc.
│   │   │   ├── validators.js        # Form validation
│   │   │   ├── calculations.js      # Tax, discount, etc.
│   │   │   └── stringUtils.js
│   │   ├── storage/
│   │   │   ├── localStorage.js
│   │   │   └── sessionStorage.js
│   │   ├── errors/
│   │   │   ├── ErrorHandler.js
│   │   │   └── CustomErrors.js
│   │   └── index.js
│   │
│   ├── assets/                      # 📸 Static Assets
│   │   ├── images/
│   │   │   ├── logo.png
│   │   │   ├── heroes/
│   │   │   │   ├── hero-banner.jpg
│   │   │   │   └── hero-bg.jpg
│   │   │   ├── products/
│   │   │   │   ├── product-1.jpg
│   │   │   │   └── product-2.jpg
│   │   │   ├── icons/
│   │   │   │   ├── facebook.svg
│   │   │   │   ├── twitter.svg
│   │   │   │   └── linkedin.svg
│   │   │   └── illustrations/
│   │   │       ├── empty-state.svg
│   │   │       └── error-state.svg
│   │   ├── fonts/
│   │   │   ├── Poppins-Regular.ttf
│   │   │   └── Poppins-Bold.ttf
│   │   ├── videos/
│   │   │   └── demo-video.mp4
│   │   └── data/
│   │       ├── mockData.json
│   │       └── seedData.js
│   │
│   ├── styles/                      # 🎨 Global Styles
│   │   ├── globals.css              # Global resets
│   │   ├── variables.css            # CSS custom properties
│   │   ├── animations.css           # Global animations
│   │   ├── utilities.css            # Custom utilities
│   │   └── tailwind.css             # Tailwind imports
│   │
│   ├── config/                      # ⚙️ App Configuration
│   │   ├── routes.js                # Route configuration
│   │   ├── appConfig.js             # App-wide settings
│   │   ├── theme.js                 # Theme configuration
│   │   ├── environment.js           # Environment variables
│   │   └── permissions.js           # Role-based permissions
│   │
│   ├── types/                       # 📋 TypeScript Types (if using TS)
│   │   ├── product.types.js
│   │   ├── user.types.js
│   │   ├── auth.types.js
│   │   ├── api.types.js
│   │   └── index.js
│   │
│   ├── App.jsx                      # Root component
│   ├── App.css
│   ├── index.jsx                    # Entry point
│   ├── index.css
│   └── main.jsx                     # Vite entry
│
├── __tests__/                       # 🧪 Tests (Alternative location)
│   ├── unit/
│   │   ├── utils/
│   │   └── helpers/
│   ├── integration/
│   ├── e2e/
│   └── setup.js
│
├── docs/                            # 📚 Documentation
│   ├── ARCHITECTURE.md              # Architecture overview
│   ├── CONTRIBUTING.md              # Contribution guidelines
│   ├── DEPLOYMENT.md                # Deployment guide
│   ├── API_INTEGRATION.md           # API documentation
│   └── COMPONENT_LIBRARY.md         # Component library guide
│
├── .env.example                     # Environment variables template
├── .env.local                       # Local environment variables (git ignored)
├── .eslintrc.json                   # ESLint configuration
├── .prettierrc                      # Prettier configuration
├── .gitignore
├── package.json
├── package-lock.json
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind configuration
├── postcss.config.js                # PostCSS configuration
├── README.md                        # Project README
└── FOLDER_STRUCTURE.md              # This file (or similar)
```

---

## 📖 Directory Explanations

### 1. **`/public`** - Static Assets
**Purpose:** Static files served directly by the web server
- favicon.ico
- robots.txt
- manifest.json (PWA)
- Don't put images here unless they won't change

---

### 2. **`/src/components`** - UI Components Layer

#### **`/components/common`** - Shared, Generic Components
**Purpose:** Reusable UI components with no business logic
**Examples:**
- Button.jsx - Generic button with variants
- Card.jsx - Reusable card container
- Input.jsx - Form input component
- Modal.jsx - Reusable modal
- Badge.jsx - Status/tag badge
- Loader.jsx - Loading spinner
- Pagination.jsx - Pagination component

**When to create:** If used in 2+ places across different features

```javascript
// Good example: Generic Button
export function Button({ variant = 'primary', size = 'md', children, ...props }) {
  return <button className={`btn btn-${variant} btn-${size}`}>{children}</button>;
}
```

#### **`/components/layout`** - Structural Components
**Purpose:** Components that structure page layout
- Navbar/Header - Top navigation
- Sidebar - Side navigation
- Footer - Footer component
- MainLayout - Wrapper for entire pages

**Usage:**
```javascript
<MainLayout>
  <Navbar />
  <main>{children}</main>
  <Footer />
</MainLayout>
```

#### **`/components/features`** - Domain-Specific Components
**Purpose:** Components grouped by business domain/feature
**Structure:** Each feature has:
- `components/` - Feature components
- `hooks/` - Feature-specific hooks
- `utils/` - Feature helpers
- `index.js` - Barrel export

**Examples:**
- `/product/` - All product-related components
- `/auth/` - All authentication components
- `/cart/` - All cart-related components
- `/dashboard/` - All dashboard components

```javascript
// src/components/features/product/
├── ProductCard/
├── ProductList/
├── ProductFilters/
├── hooks/useProduct.js
├── utils/productHelpers.js
└── index.js

// Usage
import { ProductCard, ProductList } from '@/components/features/product';
```

---

### 3. **`/src/pages`** - Page Components
**Purpose:** Components that map to routes
**Naming Convention:** `[FeatureName]Page.jsx`

```javascript
// Good examples:
HomePage.jsx           // /
AboutPage.jsx         // /about
ProductPage.jsx       // /products
ProductDetailPage.jsx // /products/:id
CartPage.jsx          // /cart
CheckoutPage.jsx      // /checkout
LoginPage.jsx         // /login
SignupPage.jsx        // /signup
DashboardPage.jsx     // /dashboard
ProfilePage.jsx       // /profile
NotFoundPage.jsx      // 404
ErrorPage.jsx         // Error boundary
```

**Each page file structure:**
```javascript
// ProductPage.jsx
import React from 'react';
import { ProductList, ProductFilters } from '@/components/features/product';
import { useProducts } from '@/components/features/product/hooks';

function ProductPage() {
  const { products, filters, setFilters } = useProducts();
  
  return (
    <MainLayout>
      <ProductFilters onFilter={setFilters} />
      <ProductList products={products} />
    </MainLayout>
  );
}

export default ProductPage;
```

---

### 4. **`/src/hooks`** - Custom React Hooks
**Purpose:** Reusable React logic
**Naming Convention:** `use[HookName].js`

```javascript
// Shared hooks:
useAuth.js         // Authentication logic
useApi.js          // Generic API call hook
useFetch.js        // Data fetching
usePagination.js   // Pagination logic
useLocalStorage.js // localStorage wrapper
useDebounce.js     // Debounce values
useWindowSize.js   // Window resize listener
useClickOutside.js // Click outside listener
```

**Example:**
```javascript
// hooks/useAuth.js
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      localStorage.setItem('token', response.token);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return { user, loading, login };
}
```

---

### 5. **`/src/context`** - Global State Management
**Purpose:** App-wide state using Context API
**Files:**
- `AuthContext.jsx` - Authentication state
- `CartContext.jsx` - Shopping cart state
- `ThemeContext.jsx` - Theme (dark/light mode)
- `NotificationContext.jsx` - Toast/alert messages

**Structure:**
```javascript
// context/AuthContext.jsx
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  const value = { user, setUser };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Usage
import { useContext } from 'react';
const { user } = useContext(AuthContext);
```

**Note:** Use context for truly global state (auth, theme). For feature state, use component state or feature hooks.

---

### 6. **`/src/services`** - API & External Services
**Purpose:** Centralize all API calls and integrations
**Keep out:** Business logic, component state

```javascript
// services/auth.service.js
import { apiClient } from './api/apiClient';

export const authService = {
  login: (email, password) => 
    apiClient.post('/auth/login', { email, password }),
  
  signup: (userData) => 
    apiClient.post('/auth/signup', userData),
  
  logout: () => 
    apiClient.post('/auth/logout'),
  
  getCurrentUser: () => 
    apiClient.get('/auth/me'),
};

// services/product.service.js
export const productService = {
  getAll: (filters) => 
    apiClient.get('/products', { params: filters }),
  
  getById: (id) => 
    apiClient.get(`/products/${id}`),
  
  create: (data) => 
    apiClient.post('/products', data),
};
```

**API Client Setup:**
```javascript
// services/api/apiClient.js
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

### 7. **`/src/utils`** - Helper Functions

#### **`/utils/constants`** - Constants & Configuration
```javascript
// utils/constants/appConstants.js
export const API_TIMEOUT = 5000;
export const ITEMS_PER_PAGE = 10;
export const SESSION_TIMEOUT = 1800000; // 30 minutes

// utils/constants/messages.js
export const MESSAGES = {
  SUCCESS: 'Operation successful',
  ERROR: 'An error occurred',
  CONFIRM: 'Are you sure?',
  LOADING: 'Loading...',
};

// utils/constants/validation.js
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^\d{10}$/;
export const PASSWORD_MIN_LENGTH = 8;
```

#### **`/utils/helpers`** - Pure Functions
```javascript
// utils/helpers/formatters.js
export const formatDate = (date) => 
  new Date(date).toLocaleDateString('en-US');

export const formatCurrency = (amount) => 
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);

// utils/helpers/validators.js
export const isValidEmail = (email) => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPassword = (password) => 
  password.length >= 8;

// utils/helpers/calculations.js
export const calculateTax = (price, taxRate) => 
  price * (taxRate / 100);

export const calculateDiscount = (price, discountPercent) => 
  price * (1 - discountPercent / 100);
```

#### **`/utils/storage`** - Storage Utilities
```javascript
// utils/storage/localStorage.js
export const storage = {
  get: (key) => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  },
  
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  
  remove: (key) => {
    localStorage.removeItem(key);
  },
  
  clear: () => {
    localStorage.clear();
  }
};
```

#### **`/utils/errors`** - Error Handling
```javascript
// utils/errors/CustomErrors.js
export class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
  }
}
```

---

### 8. **`/src/assets`** - Static Assets

**Organization by type (not by feature):**

```
assets/
├── images/
│   ├── logo.png              # Logo
│   ├── favicon.ico           # Favicon
│   ├── heroes/               # Hero images
│   │   ├── banner-1.jpg
│   │   └── banner-2.jpg
│   ├── products/             # Product images
│   │   ├── product-1.jpg
│   │   └── product-2.jpg
│   ├── icons/                # Icon SVGs
│   │   ├── facebook.svg
│   │   ├── twitter.svg
│   │   └── instagram.svg
│   └── illustrations/        # Illustrations
│       ├── empty.svg
│       └── error.svg
├── fonts/
│   ├── Poppins-Regular.ttf
│   └── Poppins-Bold.ttf
├── videos/
│   └── demo.mp4
└── data/
    ├── mockData.json
    └── seedData.js
```

**Import Images:**
```javascript
import logo from '@/assets/images/logo.png';
import emptyState from '@/assets/images/illustrations/empty.svg';

<img src={logo} alt="Logo" />
```

---

### 9. **`/src/styles`** - Global Styles

```css
/* styles/globals.css */
@import url('./variables.css');
@import url('./animations.css');
@import url('./utilities.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-family: 'Poppins', sans-serif;
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
}
```

```css
/* styles/variables.css - CSS Custom Properties */
:root {
  /* Colors */
  --primary: #3b82f6;
  --secondary: #8b5cf6;
  --danger: #ef4444;
  --success: #10b981;
  --warning: #f59e0b;
  
  --bg-color: #ffffff;
  --text-color: #1f2937;
  --border-color: #e5e7eb;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  
  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 300ms ease-in-out;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #1f2937;
    --text-color: #f3f4f6;
    --border-color: #374151;
  }
}
```

---

### 10. **`/src/config`** - Configuration

```javascript
// config/routes.js
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  NOT_FOUND: '*',
};

// config/appConfig.js
export const APP_CONFIG = {
  APP_NAME: 'MyApp',
  APP_VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@myapp.com',
  API_BASE_URL: process.env.VITE_API_BASE_URL,
  ITEMS_PER_PAGE: 12,
  MAX_FILE_SIZE: 5242880, // 5MB
};

// config/theme.js
export const THEME = {
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
  }
};
```

---

### 11. **`/src/types`** - TypeScript Type Definitions (Optional)

```javascript
// types/user.types.js
export const USER_TYPES = {
  id: 'number',
  email: 'string',
  name: 'string',
  role: 'admin|user|guest',
  createdAt: 'date',
};

// types/product.types.js
export const PRODUCT_TYPES = {
  id: 'number',
  name: 'string',
  price: 'number',
  category: 'string',
  image: 'string',
};
```

If using TypeScript:
```typescript
// types/user.types.ts
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
```

---

### 12. **`/__tests__`** - Test Files

```
__tests__/
├── unit/
│   ├── utils/
│   │   ├── formatters.test.js
│   │   └── validators.test.js
│   └── helpers/
├── integration/
│   ├── auth.integration.test.js
│   └── product.integration.test.js
├── e2e/
│   ├── login.e2e.test.js
│   └── checkout.e2e.test.js
└── setup.js
```

---

### 13. **`/docs`** - Documentation

```
ARCHITECTURE.md       - System design & data flow
CONTRIBUTING.md       - How to contribute
DEPLOYMENT.md         - Deployment instructions
API_INTEGRATION.md    - API endpoints & usage
COMPONENT_LIBRARY.md  - Component documentation
```

---

## 🎯 Naming Conventions

### Components
```javascript
// React Components: PascalCase
HomePage.jsx
ProductCard.jsx
MainLayout.jsx
UserProfile.jsx
ErrorBoundary.jsx

// Files for components with styles
Button.jsx           // Main component
Button.module.css    // Component styles
Button.test.jsx      // Component tests
index.js             // Export
```

### Hooks
```javascript
// Custom Hooks: useXxx
useAuth.js
useFetch.js
usePagination.js
useLocalStorage.js
useDebounce.js
useClickOutside.js
```

### Utilities & Services
```javascript
// Lowercase with camelCase
formatters.js
validators.js
productService.js
authService.js
calculateTax.js
parseJSON.js
```

### Constants
```javascript
// UPPER_SNAKE_CASE
API_BASE_URL
MAX_FILE_SIZE
DEFAULT_TIMEOUT
EMAIL_REGEX
ORDER_STATUSES
```

### Folders
```javascript
// kebab-case or lowercase
components
features
pages
utils
services
styles
assets
config
```

---

## 📊 Component Organization Examples

### Example 1: Button Component
```
components/common/Button/
├── Button.jsx                    // Component
├── Button.module.css            // Styles
├── Button.test.jsx              // Tests
└── index.js                     // export { default } from './Button'

// Button.jsx
export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  ...props
}) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Example 2: Feature Structure (Product)
```
components/features/product/
├── components/
│   ├── ProductCard/
│   │   ├── ProductCard.jsx
│   │   ├── ProductCard.module.css
│   │   └── index.js
│   ├── ProductList/
│   │   ├── ProductList.jsx
│   │   └── index.js
│   └── ProductFilters/
│       ├── ProductFilters.jsx
│       └── index.js
├── hooks/
│   ├── useProduct.js
│   └── useProductFilter.js
├── utils/
│   └── productHelpers.js
└── index.js

// index.js - Barrel export
export { default as ProductCard } from './components/ProductCard';
export { default as ProductList } from './components/ProductList';
export { default as ProductFilters } from './components/ProductFilters';
export { useProduct } from './hooks/useProduct';
export * as productHelpers from './utils/productHelpers';
```

### Example 3: Page with Multiple Features
```javascript
// pages/ProductPage.jsx
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import {
  ProductCard,
  ProductList,
  ProductFilters,
  useProduct
} from '@/components/features/product';
import { Pagination } from '@/components/common';

function ProductPage() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const { products, total, loading } = useProduct({ ...filters, page });
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Products</h1>
        
        <div className="grid grid-cols-4 gap-6">
          <ProductFilters onFilter={setFilters} />
          
          <div className="col-span-3">
            <ProductList products={products} loading={loading} />
            <Pagination
              current={page}
              total={total}
              onChange={setPage}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ProductPage;
```

---

## 🗂️ File Organization Best Practices

### 1. **Barrel Exports (index.js)**
```javascript
// Good: Easy imports
import { Button, Card, Modal } from '@/components/common';

// index.js content
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Modal } from './Modal';
```

### 2. **Avoid Deep Imports**
```javascript
// ❌ Avoid
import Button from '@/components/common/Button/Button';

// ✅ Preferred
import { Button } from '@/components/common';
```

### 3. **Keep Component Folders Focused**
```javascript
// ✅ Good structure
ComponentName/
├── ComponentName.jsx        // Main component only
├── ComponentName.module.css // Component styles only
└── index.js               // Export only

// ❌ Avoid putting unrelated files
ComponentName/
├── useUnrelated.js        // Should be in features/hooks
├── helperTool.js         // Should be in utils
└── mockData.json         // Should be in assets/data
```

---

## 🔄 Typical Component Flow

```
Page (ProductPage.jsx)
  ↓
Feature Component (ProductList.jsx)
  ↓
Feature Sub-components (ProductCard.jsx)
  ↓
Common Components (Button, Card, Badge)
  ↓
Styling (Tailwind CSS + CSS Modules)
  ↓
State Management (Hooks/Context)
  ↓
Services (API calls)
  ↓
Utils (Formatters, Validators, Helpers)
```

---

## ✅ Pre-Commit Checklist

Before committing, ensure:

- [ ] Component properly named and placed
- [ ] All imports use path aliases (@/)
- [ ] No deep imports from node_modules
- [ ] Barrel exports updated
- [ ] CSS properly scoped (CSS Modules)
- [ ] No console.log() left
- [ ] No unused imports
- [ ] Component tested locally
- [ ] README updated if needed
- [ ] No breaking changes to shared components

---

## 📈 Scaling Guide

### When to Create a New Feature Folder
1. **Multiple components** for same domain (2+)
2. **Feature-specific hooks** needed
3. **Feature-specific utilities** needed
4. Feature is **isolated** from others
5. Feature can be **added/removed** independently

### When to Move to Common
1. Component used in **2+ features**
2. Component has **no business logic**
3. Component is **highly reusable**

### Example: Adding E-commerce Feature
```
Before: components/ui/ (34 files mixed)

After:
components/
├── common/              (reusable UI)
└── features/
    ├── product/        ← NEW
    ├── cart/           ← NEW
    └── order/          ← NEW
```

---

## 🚀 Project Setup Checklist

- [ ] Create folder structure
- [ ] Setup path aliases in vite.config.js
- [ ] Configure Tailwind CSS
- [ ] Setup ESLint & Prettier
- [ ] Create .env.example
- [ ] Initialize Git
- [ ] Setup test framework (Jest/Vitest)
- [ ] Document architecture
- [ ] Setup CI/CD pipeline
- [ ] Create contributing guide

---

## Key Takeaways

✅ **Separation of Concerns** - Each folder has one purpose
✅ **Feature-Based** - Organize by business domain
✅ **Scalable** - Easily add/remove features
✅ **Debugging** - Error location = feature location
✅ **Collaboration** - Teams work independently
✅ **Maintenance** - Clear structure = easy updates
✅ **Reusability** - Common components truly shared

This structure supports projects from 10 to 10,000+ components! 🎉
