# DS Pharma - Complete Project Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Architecture](#project-architecture)
4. [Directory Structure](#directory-structure)
5. [Key Features](#key-features)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Authentication System](#authentication-system)
9. [User Module](#user-module)
10. [Admin Module](#admin-module)
11. [Services Layer](#services-layer)
12. [Custom Hooks](#custom-hooks)
13. [UI Components](#ui-components)
14. [Routing Structure](#routing-structure)
15. [Payment Integration](#payment-integration)
16. [Data Models](#data-models)
17. [Configuration](#configuration)
18. [Build & Deployment](#build--deployment)

---

## 📖 Project Overview

**DS Pharma** is a full-featured e-commerce platform for pharmaceutical products built with React. It provides a comprehensive online pharmacy solution with separate interfaces for customers and administrators.

### Application Details
- **Name**: DS Pharma
- **Version**: 1.0.0
- **Type**: E-commerce Platform (Pharmaceutical)
- **Target Audience**: Healthcare consumers and pharmacy administrators

### Core Objectives
1. Provide easy access to pharmaceutical products
2. Enable secure online ordering and payment
3. Offer comprehensive product catalog management
4. Support order tracking and management
5. Facilitate customer service and support

---

## 🛠 Technology Stack

### Frontend Framework
- **React 19.1.1** - Latest version for UI development
- **React DOM 19.1.1** - DOM rendering
- **Vite 7.1.7** - Build tool and development server

### Routing
- **React Router DOM 7.9.5** - Client-side routing

### State Management
- **Zustand 5.0.9** - Lightweight state management with persistence
- **TanStack React Query 5.90.11** - Server state management, caching, and data fetching
- **TanStack React Query DevTools 5.91.1** - Development tools for React Query

### Styling
- **Tailwind CSS 4.1.16** - Utility-first CSS framework
- **@tailwindcss/vite 4.1.16** - Vite integration
- **@tailwindcss/postcss 4.1.16** - PostCSS plugin
- **Tailwind Merge 3.4.0** - Merge Tailwind classes
- **clsx 2.1.1** - Conditional class names

### Animation
- **Framer Motion 12.23.24** - Animation library

### HTTP Client
- **Axios 1.13.2** - Promise-based HTTP client

### UI Components & Icons
- **Lucide React 0.552.0** - Icon library

### Notifications
- **React Hot Toast 2.6.0** - Toast notifications

### Development Tools
- **ESLint 9.36.0** - Code linting
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.21** - CSS vendor prefixing

### Type Checking
- **PropTypes 15.8.1** - Runtime type checking

---

## 🏗 Project Architecture

### Architecture Pattern
The application follows a **Feature-Based Architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         User Interface Layer            │
│  (Pages, Components, Layouts)           │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│        State Management Layer           │
│  (Zustand Stores, React Query)          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│          Services Layer                 │
│  (API Clients, Business Logic)          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│          Backend API                    │
│  (REST API at http://192.168.0.123:5000)│
└─────────────────────────────────────────┘
```

### Key Architectural Principles

1. **Separation of Concerns**
   - User and Admin modules are completely separate
   - Shared components in dedicated `shared` folder
   - Services isolated from UI components

2. **State Management Strategy**
   - **Zustand**: Client-side state (cart, auth, UI state)
   - **React Query**: Server state (products, orders, user data)
   - **Context API**: Announcements and global notifications

3. **Code Splitting & Lazy Loading**
   - All route components lazy-loaded
   - Suspense boundaries for better UX
   - Optimized bundle sizes

4. **Resilient Data Fetching**
   - Auto-retry mechanism (max 2 retries)
   - Request deduplication with AbortController
   - Smart caching (localStorage, 15-minute expiry)
   - Fail-safe defaults

---

## 📁 Directory Structure

```
frontend/
├── src/
│   ├── admin/                    # Admin Module
│   │   ├── components/
│   │   │   ├── layout/          # Admin layouts
│   │   │   ├── products/        # Product management components
│   │   │   └── ui/              # Admin-specific UI components
│   │   ├── context/
│   │   │   └── useAdminStore.js # Admin state management
│   │   ├── pages/               # Admin pages
│   │   │   ├── Announcements/
│   │   │   ├── Categories/
│   │   │   ├── Customers/
│   │   │   ├── Dashboard/
│   │   │   ├── Login/
│   │   │   ├── Orders/
│   │   │   └── Products/
│   │   ├── utils/
│   │   └── AdminRouter.jsx      # Admin routing
│   │
│   ├── user/                     # User Module
│   │   ├── components/
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── cart/            # Shopping cart components
│   │   │   ├── category/        # Category components
│   │   │   ├── layout/          # User layouts
│   │   │   ├── navigation/      # Navigation components
│   │   │   ├── order/           # Order components
│   │   │   ├── payment/         # Payment components
│   │   │   ├── product/         # Product display components
│   │   │   ├── profile/         # User profile components
│   │   │   ├── search/          # Search components
│   │   │   ├── sections/        # Page sections (Hero, Featured, etc.)
│   │   │   └── user/
│   │   └── pages/               # User-facing pages
│   │
│   ├── shared/                   # Shared Resources
│   │   ├── components/
│   │   │   ├── common/          # Common reusable components
│   │   │   ├── loaders/         # Loading components
│   │   │   ├── skeletons/       # Skeleton screens
│   │   │   └── ui/              # Shared UI components
│   │   ├── constants/           # App-wide constants
│   │   ├── contexts/            # React contexts
│   │   ├── hooks/               # Custom hooks
│   │   │   ├── mutations/       # React Query mutations
│   │   │   └── queries/         # React Query queries
│   │   └── utils/               # Utility functions
│   │
│   ├── services/                 # API Services
│   │   ├── admin/api/           # Admin API services
│   │   ├── api/                 # Core API configuration
│   │   └── [service files]      # Feature-specific services
│   │
│   ├── store/                    # Zustand Stores
│   │   ├── useAuthStore.js      # Authentication state
│   │   ├── useCartStore.js      # Shopping cart state
│   │   ├── useDataStore.js      # Application data state
│   │   ├── useOrderStore.js     # Orders state
│   │   └── useToastStore.js     # Toast notifications state
│   │
│   ├── config/                   # Configuration
│   │   ├── adminApi.js
│   │   ├── appConfig.js         # App-wide settings
│   │   ├── routes.js            # Route definitions
│   │   └── theme.js             # Theme configuration
│   │
│   ├── data/                     # Mock/Sample Data
│   │   ├── addressData.js
│   │   ├── sampleData.js
│   │   └── userData.js
│   │
│   ├── utils/                    # Utility Functions
│   │
│   ├── App.jsx                   # Main App component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
│
├── public/                       # Public assets
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
├── package.json                 # Dependencies
└── ARCHITECTURE_GUIDE.md        # Architecture documentation
```

---

## ✨ Key Features

### Customer-Facing Features

#### 1. Product Browsing & Search
- **Category-Based Navigation**: 10 product categories
- **Advanced Search**: Real-time product search with debouncing
- **Product Filters**: Price range, stock status, highlights
- **Featured Products**: Curated product showcase
- **Product Details**: Comprehensive product information with image gallery

#### 2. Shopping Cart
- **Persistent Cart**: Cart data saved to localStorage
- **Real-Time Updates**: Instant quantity adjustments
- **Cart Management**: Add, remove, update quantities
- **Price Calculation**: Automatic totals with GST and delivery charges

#### 3. Checkout & Payments
- **Multi-Step Checkout**: Address selection, payment method, confirmation
- **Payment Integration**: Razorpay (configurable)
- **Address Management**: Multiple delivery addresses
- **Order Review**: Pre-checkout order summary

#### 4. Order Management
- **Order Tracking**: Real-time order status updates
- **Order History**: Complete purchase history
- **Order Details**: Detailed view of each order
- **Order Actions**: Cancel orders, request returns
- **Timeline View**: Visual order progress tracking

#### 5. User Profile
- **Profile Management**: Update personal information
- **Profile Picture**: Upload and manage avatar
- **Address Book**: Manage multiple addresses
- **Default Address**: Set preferred delivery address

#### 6. Authentication
- **User Registration**: Email-based signup
- **Login System**: Secure authentication
- **Password Recovery**: Forgot password functionality
- **Session Management**: Persistent login with tokens

#### 7. Announcements System
- **Hero Banners**: Promotional banners on homepage
- **Marquee Messages**: Scrolling announcements
- **Alert Banners**: Top/bottom notification alerts
- **Position-Based**: Different locations (top, bottom, hero)

### Admin Features

#### 1. Dashboard
- **Analytics Overview**: Sales, orders, customers, products
- **Recent Orders**: Latest transactions
- **Quick Actions**: Shortcut to common tasks
- **Real-Time Stats**: Live data updates
- **Trend Indicators**: Growth/decline metrics

#### 2. Product Management
- **Product CRUD**: Create, read, update, delete products
- **Bulk Operations**: Multiple product actions
- **Image Management**: Product image uploads
- **Stock Management**: Inventory tracking
- **Category Assignment**: Product categorization
- **Featured Products**: Manage featured items
- **Product Visibility**: Show/hide products

#### 3. Order Management
- **Order List**: All orders with filters
- **Order Details**: Complete order information
- **Status Updates**: Change order status
- **Order Timeline**: Track order progress
- **Customer Information**: Linked customer data

#### 4. Customer Management
- **Customer List**: All registered users
- **Customer Details**: Complete customer profile
- **Order History**: Per-customer order view
- **Customer Analytics**: Purchase patterns

#### 5. Category Management
- **Category CRUD**: Manage product categories
- **Category Images**: Visual category representation
- **Visibility Control**: Show/hide categories

#### 6. Announcements Management
- **Banner Management**: Create/edit promotional banners
- **Marquee Control**: Manage scrolling messages
- **Alert Management**: Create notification alerts
- **Status Toggle**: Enable/disable announcements

---

## 🗄 State Management

### Zustand Stores

#### 1. useAuthStore
**Purpose**: Manages user authentication state

**State:**
```javascript
{
  user: null,              // Current user object
  token: null,             // JWT auth token
  isAuthenticated: false   // Auth status
}
```

**Actions:**
- `login(userData, token)` - Login user
- `logout()` - Logout user
- `updateUser(userData)` - Update user profile
- `setToken(token)` - Update auth token
- `getUser()` - Get current user
- `getToken()` - Get auth token
- `isLoggedIn()` - Check auth status

**Persistence**: localStorage (`ds-pharma-auth`)

#### 2. useCartStore
**Purpose**: Manages shopping cart

**State:**
```javascript
{
  items: []  // Array of cart items
}
```

**Actions:**
- `addItem(product, quantity)` - Add to cart
- `removeItem(productId)` - Remove from cart
- `updateQuantity(productId, quantity)` - Update quantity
- `clearCart()` - Empty cart
- `setData(items)` - Sync with API
- `getTotalItems()` - Get item count
- `getTotalPrice()` - Calculate total
- `getItemQuantity(productId)` - Get specific item quantity

**Persistence**: localStorage (`ds-pharma-cart-v2`)

#### 3. useDataStore
**Purpose**: Global application data and mock data management

**State:**
```javascript
{
  products: [],
  orders: [],
  users: [],
  banners: [],
  categories: [],
  addresses: [],
  currentUser: null,
  isAuthenticated: false,
  cart: [],
  wishlist: [],
  notifications: []
}
```

**Actions:**
- **Products**: `setProducts`, `updateProduct`, `addProduct`, `deleteProduct`
- **Orders**: `placeOrder`, `updateOrderStatus`
- **Users**: `addUser`, `login`, `logout`, `updateUser`
- **Profile**: `updateUserProfileImage`, `removeUserProfileImage`
- **Cart**: `addToCart`, `removeFromCart`, `updateCartQuantity`, `clearCart`
- **Wishlist**: `addToWishlist`, `removeFromWishlist`, `moveToCart`
- **Addresses**: `setAddresses`, `addAddress`, `updateAddress`, `deleteAddress`
- **Categories**: `setCategories`, `addCategory`, `updateCategory`, `deleteCategory`

**Persistence**: localStorage (`ds-pharma-store-v5`)

#### 4. useToastStore
**Purpose**: Toast notification management

**Actions:**
- `success(message)` - Show success toast
- `error(message)` - Show error toast
- `info(message)` - Show info toast
- `warning(message)` - Show warning toast

### React Query Configuration

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      gcTime: 10 * 60 * 1000,         // 10 minutes
      retry: 1,                        // Retry failed queries once
      refetchOnWindowFocus: false,     // Don't refetch on focus
    },
  },
});
```

### Announcement Context

**Purpose**: Manages promotional announcements (banners, marquees, alerts)

**State:**
- `banners` - Hero and promotional banners
- `marqueeMessages` - Scrolling text messages
- `alerts` - Notification alerts

**Operations:**
- Banner CRUD: `createBanner`, `updateBanner`, `deleteBanner`, `toggleBannerStatus`
- Marquee CRUD: `createMarquee`, `updateMarquee`, `deleteMarquee`, `toggleMarqueeStatus`
- Alert CRUD: `createAlert`, `updateAlert`, `deleteAlert`, `toggleAlertStatus`

**Persistence**: localStorage (`ds-pharma-announcements`)

---

## 🌐 API Integration

### Base Configuration

```javascript
// Base URL
const API_BASE_URL = "http://192.168.0.123:5000/api";

// Axios Client with Interceptors
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### API Endpoints

#### Products
- `GET /product` - Get all products
- `GET /product/:id` - Get product by ID
- `GET /productusersearch` - Search products
- `GET /productusercategory/:id` - Get category products
- `GET /productbyid/:id` - Get product details
- `POST /product` - Create product (admin)
- `PUT /product/:id` - Update product (admin)
- `DELETE /product/:id` - Delete product (admin)

#### Categories
- `GET /category` - Get all categories
- `GET /category/:id` - Get category by ID
- `POST /category` - Create category
- `PUT /category/:id` - Update category
- `DELETE /category/:id` - Delete category

#### Featured Products
- `GET /featuredget` - Get featured products
- `POST /featuredadd` - Add featured product
- `DELETE /featureddelete/:id` - Remove featured product

#### Cart
- `GET /cart` - Get cart
- `POST /cart/add` - Add to cart
- `PUT /cart/update` - Update cart
- `DELETE /cart/remove` - Remove from cart

#### Orders
- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID
- `POST /orders/create` - Create order
- `PATCH /orders/:id/status` - Update order status

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Reset password
- `GET /auth/profile` - Get user profile

### Service Layer Architecture

#### productService.js
**Features:**
- Resilient fetching with auto-retry (max 2 retries)
- Request deduplication using AbortController
- Smart caching (15-minute expiry)
- Normalized product data structure
- Fail-safe defaults

**Methods:**
- `getAllCategories()` - Fetch all categories
- `getProductsByCategory(categoryId, page, limit)` - Category products
- `getFeaturedProducts()` - Featured products
- `getProductById(id)` - Single product
- `searchUserProducts({ search, page, limit })` - Search products

#### authService.js
**Methods:**
- `login(credentials)` - User login
- `signup(userData)` - User registration
- `logout()` - User logout
- `forgotPassword(email)` - Password recovery
- `resetPassword(token, newPassword)` - Reset password
- `getProfile()` - Get user profile
- `updateProfile(profileData)` - Update profile

#### cartService.js (Deprecated)
**Note:** Cart operations now use `useDataStore` directly via mutation hooks

#### orderService.js
**Methods:**
- `getOrders()` - Fetch user orders
- `getOrderById(id)` - Single order
- `createOrder(orderData)` - Place order
- `cancelOrder(id)` - Cancel order
- `returnOrder(id)` - Request return

### Mock API Support

The application includes a comprehensive mock API for development:

```javascript
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true" || true;
```

**Mock Features:**
- Simulated network latency
- Full CRUD operations
- Data persistence via Zustand
- Realistic data filtering and pagination

---

## 🔐 Authentication System

### Flow

```
User Registration → Email/Password → Store User → Auto Login
      ↓
User Login → Validate Credentials → Generate Token → Store in Zustand
      ↓
Protected Routes → Check Auth → Allow/Redirect
      ↓
API Calls → Attach Token → Validate on Backend
      ↓
Logout → Clear Token → Clear User State
```

### Implementation

#### Login Hook
```javascript
export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials) => {
      // Calls authService.login()
      // Returns user data and token
    },
    onSuccess: (data) => {
      // Store in useDataStore
      // Navigate to home
    }
  });
};
```

#### Protected Routes
Currently, all routes are accessible. To add protection:
```javascript
<Route element={<ProtectedRoute />}>
  <Route path="/profile" element={<UserProfile />} />
</Route>
```

#### Token Management
- Stored in localStorage
- Automatically attached to API requests
- Refreshed on app reload
- Cleared on logout

---

## 👤 User Module

### Pages

#### 1. Home (/)
**Components:**
- Hero Section with banner
- Popular Categories Section
- Pharmacy Products Showcase (split into two blocks)
- Banner Section
- Featured Products Section
- Why Choose Us Section
- Alert Banners (top and bottom)

**Features:**
- Lazy-loaded sections for performance
- Dynamic category-based product display
- Responsive design

#### 2. Product Details (/product/:id)
**Features:**
- Image gallery with zoom
- Product information
- Price display with discount
- Stock status
- Add to cart functionality
- Product description
- Related products
- Customer reviews

#### 3. Category Products (/category/:categoryId)
**Features:**
- Category-specific product listing
- Pagination
- Filters (price, stock)
- Sort options
- Responsive grid layout

#### 4. Cart (/cart)
**Features:**
- Cart item listing
- Quantity adjustment
- Remove items
- Price breakdown
- Proceed to checkout button
- Empty cart state

#### 5. Orders (/orders)
**Features:**
- Order history
- Status badges
- Order search
- Filter by status
- Click to view details

#### 6. Order Details (/orders/:id)
**Features:**
- Complete order information
- Order timeline
- Product list
- Delivery address
- Payment details
- Order actions (cancel, return)

#### 7. Order Confirmation (/order-confirmation/:orderId)
**Features:**
- Success message
- Order summary
- Continue shopping button
- Track order link

#### 8. User Profile (/profile)
**Tabs:**
- **Personal Info**: Name, email, phone
- **Profile Picture**: Upload/change avatar
- **Addresses**: Manage delivery addresses
- **Orders**: Quick access to orders

#### 9. Search (/search)
**Features:**
- Real-time search results
- Search suggestions
- Filter options
- Sort functionality

#### 10. Featured Products (/featured)
**Features:**
- Curated featured products
- Grid layout
- Add to cart
- Quick view

### Navigation

#### Desktop Navigation
**Components:**
- Logo
- Search bar
- Category dropdown
- Cart button with badge
- User profile button
- Login/Signup links

#### Mobile Navigation
**Bottom Nav:**
- Home
- Categories
- Cart
- Profile

**Top Bar:**
- Logo
- Search icon
- Menu icon

---

## 👨‍💼 Admin Module

### Routes
All admin routes are prefixed with `/admin`

### Pages

#### 1. Dashboard (/admin/dashboard)
**Metrics:**
- Total Sales (with trend)
- Total Orders (with trend)
- Total Customers (with trend)
- Total Products (with trend)

**Sections:**
- Recent Orders table
- Quick Actions (Add Product, View Orders, Customers)

**Features:**
- Real-time data updates
- Gradient card designs
- Responsive layout

#### 2. Products (/admin/products)
**Features:**
- Product listing with search
- Filter by category, stock, status
- Sort options
- Actions: View, Edit, Delete
- Bulk operations
- Stock indicators

**Product Form (/admin/products/new, /admin/products/:id/edit):**
- Product name and description
- Category selection
- Price and discount
- Stock quantity
- Image upload (multiple images)
- Visibility toggle
- Featured toggle

#### 3. Featured Products (/admin/products/featured)
**Features:**
- Manage featured products
- Add/remove from featured list
- Reorder featured items
- Preview how they appear to users

#### 4. Categories (/admin/categories)
**Features:**
- Category listing
- Create new category
- Edit category
- Delete category
- Visibility toggle
- Image management

#### 5. Orders (/admin/orders)
**Features:**
- Order listing with search
- Filter by status (Placed, Shipped, Delivered, Cancelled)
- Date range filter
- Export functionality
- Order details view

**Order Details (/admin/orders/:id):**
- Customer information
- Product list
- Payment details
- Delivery address
- Order timeline
- Status update
- Actions: Cancel, Mark Shipped, Mark Delivered

#### 6. Customers (/admin/customers)
**Features:**
- Customer listing
- Search customers
- Customer details view
- Order history per customer
- Customer analytics

#### 7. Announcements (/admin/announcements)
**Types:**
- **Banners**: Hero and promotional banners
  - Image upload
  - Link URL
  - Position selection
  - Enable/disable
  
- **Marquee**: Scrolling messages
  - Multiple messages
  - Speed control
  - Color customization
  - Enable/disable

- **Alerts**: Notification banners
  - Alert type (info, warning, success, error)
  - Title and message
  - Position (top, bottom)
  - Dismissible option
  - Expiry date
  - Enable/disable

### Admin Layout

**Sidebar:**
- Dashboard
- Products
  - All Products
  - Add Product
  - Featured Products
  - Categories
- Orders
- Customers
- Announcements
- Settings (future)

**Topbar:**
- Admin name
- Notifications
- Logout

---

## 📡 Services Layer

### Core Services

#### productService.js
**Singleton service with resilient features:**

**Key Features:**
1. **Auto-Retry**: Retries failed requests up to 2 times
2. **Request Deduplication**: Cancels duplicate requests
3. **Smart Caching**: 15-minute cache with localStorage
4. **Normalized Data**: Consistent product structure
5. **Fail-Safe**: Returns cached data on failure

**Caching Strategy:**
```javascript
{
  key: "dspharma_cache_${cacheKey}",
  data: normalizedData,
  timestamp: Date.now(),
  expiry: 15 * 60 * 1000 // 15 minutes
}
```

#### authService.js
**Authentication service with mock support**

**Features:**
- Login/logout
- Registration
- Password recovery
- Profile management
- Token handling

#### orderService.js
**Order management service**

**Features:**
- Order placement
- Order retrieval
- Status updates
- Cancel/return orders
- Mock order support

#### Admin Services (services/admin/api/)

**productService.js (Admin):**
- CRUD operations for products
- Bulk operations
- Image upload handling

**orderService.js (Admin):**
- Order management
- Status updates
- Order analytics

**customerService.js (Admin):**
- Customer listing
- Customer details
- Customer analytics

**featuredService.js (Admin):**
- Manage featured products
- Add/remove featured items

### API Client Configuration

**axios.config.js:**
```javascript
{
  baseURL: "http://192.168.0.123:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
}
```

**Request Interceptor:**
- Attaches auth token
- Logs requests (dev mode)

**Response Interceptor:**
- Handles 401 (redirect to login)
- Handles 500 (show error toast)
- Handles network errors
- Extracts data from response

---

## 🎣 Custom Hooks

### Query Hooks (GET Operations)

#### useProducts
**Purpose**: Fetch products with filters and pagination

**Usage:**
```javascript
const { data, isLoading, error } = useProducts({
  categoryId: 'cat-1',
  page: 1,
  limit: 12
});
```

**Returns:**
```javascript
{
  data: {
    data: Product[],
    pagination: {
      currentPage: number,
      totalPages: number,
      totalItems: number,
      hasMore: boolean
    }
  },
  isLoading: boolean,
  error: Error | null
}
```

#### useProductDetails
**Purpose**: Fetch single product by ID

```javascript
const { data: product, isLoading } = useProductDetails(productId);
```

#### useCategories
**Purpose**: Fetch all categories

```javascript
const { data: categories } = useCategories();
```

#### useFeaturedProducts
**Purpose**: Fetch featured products

```javascript
const { data: featuredProducts } = useFeaturedProducts();
```

#### useOrders
**Purpose**: Fetch user orders

```javascript
const { data: orders } = useOrders();
```

#### useOrderDetails
**Purpose**: Fetch single order by ID

```javascript
const { data: order } = useOrderDetails(orderId);
```

#### useCart
**Purpose**: Fetch cart from store or API

```javascript
const { data: cart, refetch } = useCart();
```

#### useAddresses
**Purpose**: Fetch user addresses

```javascript
const { data: addresses } = useAddresses();
```

#### useProfile
**Purpose**: Fetch user profile

```javascript
const { data: profile } = useProfile();
```

### Mutation Hooks (POST/PUT/DELETE Operations)

#### useAddToCart
**Purpose**: Add product to cart

```javascript
const { mutate: addToCart, isPending } = useAddToCart();

addToCart({ product });
```

**Features:**
- Checks for duplicates
- Shows success toast
- Invalidates cart query

#### useUpdateCart
**Purpose**: Update cart item quantity

```javascript
const { mutate: updateCart } = useUpdateCart();

updateCart({ productId, quantity });
```

#### useRemoveFromCart
**Purpose**: Remove item from cart

```javascript
const { mutate: removeFromCart } = useRemoveFromCart();

removeFromCart(productId);
```

#### useLogin
**Purpose**: User login

```javascript
const { mutate: login, isPending, error } = useLogin();

login({ email, password });
```

**On Success:**
- Stores user in useDataStore
- Navigates to home
- Shows success toast

#### useSignup
**Purpose**: User registration

```javascript
const { mutate: signup, isPending } = useSignup();

signup({ name, email, password });
```

#### usePlaceOrder
**Purpose**: Create new order

```javascript
const { mutate: placeOrder, isPending } = usePlaceOrder();

placeOrder(orderData);
```

**Features:**
- Validates cart
- Clears cart on success
- Navigates to confirmation

#### useCancelOrder
**Purpose**: Cancel order

```javascript
const { mutate: cancelOrder } = useCancelOrder();

cancelOrder(orderId);
```

#### useReturnOrder
**Purpose**: Request order return

```javascript
const { mutate: returnOrder } = useReturnOrder();

returnOrder(orderId);
```

#### useProfileImage
**Purpose**: Upload/remove profile picture

```javascript
const { mutate: uploadImage } = useProfileImage();

uploadImage({ file, userId });
```

---

## 🎨 UI Components

### Shared Components (shared/components/ui/)

#### Button
**Variants:**
- `default` - Primary button
- `outline` - Outlined button
- `ghost` - Transparent button
- `destructive` - Danger button

**Sizes:**
- `sm` - Small
- `md` - Medium
- `lg` - Large

#### Card
**Variants:**
- `default` - Standard card
- `elevated` - With shadow
- `gradient` - Gradient background

**Parts:**
- `Card` - Container
- `CardHeader` - Header section
- `CardTitle` - Title
- `CardDescription` - Description
- `CardContent` - Main content
- `CardFooter` - Footer section

#### Input
**Types:**
- Text, email, password, number, tel, url
- Textarea variant
- With icon support
- Error state

#### Badge
**Variants:**
- `default` - Gray
- `success` - Green
- `warning` - Yellow
- `destructive` - Red
- `secondary` - Light gray
- `outline` - Bordered

#### Dialog/Modal
**Features:**
- Overlay background
- Close button
- Custom header/footer
- Responsive
- Escape to close

#### DropdownMenu
**Parts:**
- `DropdownMenuTrigger`
- `DropdownMenuContent`
- `DropdownMenuItem`
- `DropdownMenuSeparator`

#### Table
**Parts:**
- `Table` - Container
- `TableHeader` - Header row
- `TableBody` - Body
- `TableRow` - Row
- `TableHead` - Header cell
- `TableCell` - Data cell

#### Pagination
**Features:**
- Page numbers
- Previous/Next buttons
- First/Last buttons
- Current page highlight
- Responsive

#### Switch (Toggle)
**Features:**
- On/off states
- Disabled state
- Label support

#### Label
**Features:**
- Associated with inputs
- Required indicator
- Error state

#### Avatar
**Features:**
- Image support
- Fallback initials
- Size variants

### Loaders

#### PageLoader
- Full-page loading state
- Spinner with logo
- Smooth animations

#### ProductSkeleton
- Product card placeholder
- Shimmer effect

### Common Components

#### ErrorBoundary
**Features:**
- Catches React errors
- Displays fallback UI
- Error logging
- Retry option

#### SafeImage
**Features:**
- Lazy loading
- Error handling
- Fallback image
- Loading state

#### BackButton
**Features:**
- Navigate back
- Custom label
- Icon

#### ScrollToTop
**Features:**
- Scrolls to top on route change
- Smooth scroll
- Floating button (when scrolled down)

---

## 🛣 Routing Structure

### Main Routes (App.jsx)

```javascript
<Routes>
  {/* Auth Routes (No Layout) */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignupPage />} />
  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
  <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

  {/* Admin Routes */}
  <Route path="/admin/*" element={<AdminRouter />} />

  {/* Standalone Routes */}
  <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />

  {/* User Routes (With Layout) */}
  <Route element={<Layout />}>
    <Route path="/" element={<Home />} />
    <Route path="/cart" element={<CartDetails />} />
    <Route path="/product/:id" element={<ProductDetails />} />
    <Route path="/category/:categoryId" element={<CategoryProducts />} />
    <Route path="/orders" element={<Orders />} />
    <Route path="/orders/:id" element={<OrderDetails />} />
    <Route path="/featured" element={<FeaturedProductsPage />} />
    <Route path="/search" element={<SearchPage />} />
    <Route path="/profile" element={<UserProfile />} />
  </Route>

  {/* 404 */}
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

### Admin Routes (AdminRouter.jsx)

```javascript
<Routes>
  <Route element={<AdminLayout />}>
    <Route index element={<Navigate to="/admin/dashboard" replace />} />
    <Route path="dashboard" element={<Dashboard />} />
    
    {/* Products */}
    <Route path="products" element={<ProductsList />} />
    <Route path="products/new" element={<ProductForm />} />
    <Route path="products/featured" element={<FeaturedProducts />} />
    <Route path="products/:id" element={<ProductDetails />} />
    <Route path="products/:id/edit" element={<ProductForm />} />
    
    {/* Categories */}
    <Route path="categories" element={<CategoriesList />} />
    <Route path="categories/new" element={<CategoryForm />} />
    <Route path="categories/edit/:id" element={<CategoryForm />} />
    
    {/* Orders */}
    <Route path="orders" element={<OrdersList />} />
    <Route path="orders/:id" element={<OrderDetails />} />
    
    {/* Customers */}
    <Route path="customers" element={<CustomersList />} />
    <Route path="customers/:id" element={<CustomerDetails />} />
    
    {/* Announcements */}
    <Route path="announcements" element={<AnnouncementsList />} />
    <Route path="announcements/banners/new" element={<BannerForm />} />
    <Route path="announcements/banners/:id/edit" element={<BannerForm />} />
    <Route path="announcements/marquee/new" element={<MarqueeForm />} />
    <Route path="announcements/marquee/:id/edit" element={<MarqueeForm />} />
    <Route path="announcements/alerts/new" element={<AlertForm />} />
    <Route path="announcements/alerts/:id/edit" element={<AlertForm />} />
  </Route>
</Routes>
```

### Route Configuration (config/routes.js)

```javascript
export const ROUTES = {
  // Public
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAILS: "/product/:id",
  
  // User
  LOGIN: "/login",
  REGISTER: "/register",
  USER_PROFILE: "/profile",
  
  // Shopping
  CART: "/cart",
  CHECKOUT: "/checkout",
  
  // Orders
  ORDERS: "/orders",
  ORDER_DETAILS: "/orders/:id",
  
  // Admin
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_ANNOUNCEMENTS: "/admin/announcements",
};
```

---

## 💳 Payment Integration

### Payment Gateway: Razorpay

**Configuration:**
```javascript
// config/appConfig.js
{
  PAYMENT_GATEWAY: 'razorpay',
  MIN_ORDER_VALUE: 100,
  FREE_SHIPPING_THRESHOLD: 500,
}
```

### Payment Flow

```
Cart → Checkout → Address Selection → Payment Method Selection → Payment Processing → Order Confirmation
```

### Payment Component Structure

**PaymentOptions.jsx:**
- Razorpay
- Cash on Delivery (COD)
- UPI
- Credit/Debit Card
- Net Banking

### Payment Processing

**Order Creation:**
1. Validate cart
2. Calculate totals
3. Select payment method
4. Create order in backend
5. Initiate payment (if online)
6. Verify payment
7. Confirm order
8. Clear cart
9. Show confirmation

### Payment Breakdown

```javascript
{
  totalCartValue: 1000,
  discount: 100,
  coupon: 50,
  gst: 153,         // 18%
  deliveryCharges: 40,
  total: 1043
}
```

---

## 📊 Data Models

### Product
```javascript
{
  id: string,
  name: string,
  category: string,
  price: number,
  originalPrice?: number,
  discount?: number,
  image: string,          // Primary image URL
  images: string[],       // All image URLs
  description?: string,
  genericName?: string,
  manufacturer?: string,
  stock: number,
  inStock: boolean,
  unit?: string,
  prescription?: boolean,
  isFeatured?: boolean,
  isHighlighted?: boolean,
  rating?: number,
  reviews?: number,
  isVisible?: boolean,
  createdAt?: string,
  updatedAt?: string
}
```

### Category
```javascript
{
  id: string,
  name: string,
  slug: string,
  image: string,
  isVisible: boolean,
  description?: string,
  productCount?: number
}
```

### User
```javascript
{
  id: string,
  name: string,
  email: string,
  phone?: string,
  profileImage?: string,
  role: 'user' | 'admin',
  isVerified?: boolean,
  createdAt: string,
  cart?: Product[],
  wishlist?: Product[]
}
```

### Order
```javascript
{
  id: string,
  userId: string,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  items: OrderItem[],
  totals: {
    totalCartValue: number,
    discount: number,
    coupon: number,
    gst: number,
    deliveryCharges: number,
    total: number
  },
  deliveryAddress: Address,
  paymentMethod: string,
  status: OrderStatus,
  timeline: Timeline[],
  createdAt: string,
  updatedAt: string
}
```

### OrderItem
```javascript
{
  id: string,
  productName: string,
  price: number,
  quantity: number,
  image: string
}
```

### Address
```javascript
{
  id: string,
  name: string,
  phone: string,
  addressLine1: string,
  addressLine2?: string,
  city: string,
  state: string,
  pincode: string,
  isDefault: boolean
}
```

### OrderStatus
```typescript
type OrderStatus = 
  | 'PLACED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURN_APPROVED'
  | 'RETURN_COMPLETED';
```

### Timeline
```javascript
{
  status: OrderStatus,
  completed: boolean,
  active: boolean,
  date: string
}
```

---

## ⚙️ Configuration

### Environment Variables (.env)

```bash
# API Configuration
VITE_API_BASE_URL=http://192.168.0.123:5000/api

# Feature Flags
VITE_USE_MOCK=true

# Payment Gateway
VITE_RAZORPAY_KEY=your_razorpay_key
```

### App Configuration (config/appConfig.js)

```javascript
export const APP_CONFIG = {
  APP_NAME: 'DS Pharma',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'Your trusted online pharmacy',
  
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  API_TIMEOUT: 10000,
  
  DEFAULT_PAGE_SIZE: 12,
  MAX_RESULTS_PER_PAGE: 100,
  
  FEATURES: {
    ENABLE_NOTIFICATIONS: true,
    ENABLE_ANALYTICS: true,
    ENABLE_LIVE_CHAT: false,
  },
  
  CACHE_DURATION: {
    PRODUCTS: 5 * 60 * 1000,
    CART: 1 * 60 * 1000,
    USER: 10 * 60 * 1000,
  },
  
  IMAGE_CONFIG: {
    PRODUCT_WIDTH: 400,
    PRODUCT_HEIGHT: 400,
    THUMBNAIL_WIDTH: 100,
    THUMBNAIL_HEIGHT: 100,
  },
  
  PAYMENT_GATEWAY: 'razorpay',
  MIN_ORDER_VALUE: 100,
  FREE_SHIPPING_THRESHOLD: 500,
  
  CONTACT: {
    EMAIL: 'support@dspharma.com',
    PHONE: '+91-1800-123-4567',
    ADDRESS: 'DS Pharma, India',
  },
};
```

### Tailwind Configuration (tailwind.config.js)

**Custom Colors:**
```javascript
colors: {
  primary: { /* teal shades */ },
  mint: { /* mint green shades */ },
  medical: {
    blue: "#4A90E2",
    green: "#7ED321",
    lightBlue: "#B8E6FF",
    mint: "#A8E6CF",
    teal: "#4ECDC4",
    navBg: "#9ECCC7",
  },
  dsPharma: {
    gradient: {
      start: "#A8E6CF",
      mid: "#88D8C0",
      end: "#7FCDCD",
    },
    text: "#4ECDC4",
    nav: "#9ECCC7",
  },
}
```

**Custom Backgrounds:**
```javascript
backgroundImage: {
  "gradient-medical": "linear-gradient(135deg, #A8E6CF 0%, #88D8C0 50%, #7FCDCD 100%)",
  "ds-pharma": "linear-gradient(135deg, #A8E6CF 0%, #88D8C0 50%, #7FCDCD 100%)",
}
```

### Vite Configuration (vite.config.js)

```javascript
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: true,
  }
});
```

---

## 🚀 Build & Deployment

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access at: http://localhost:5173
```

### Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Lint

```bash
# Run ESLint
npm run lint
```

### Production Deployment

**Build Output:** `dist/` directory

**Deployment Options:**
1. **Vercel** (Recommended)
   - Connect GitHub repository
   - Auto-deploy on push
   - Environment variables via dashboard

2. **Netlify**
   - Drag-and-drop `dist` folder
   - Or connect repository

3. **Traditional Hosting**
   - Upload `dist` folder to server
   - Configure web server (nginx/apache)
   - Set up reverse proxy for API

**Environment Setup:**
- Set `VITE_API_BASE_URL` to production API
- Set `VITE_USE_MOCK=false` for production
- Configure payment gateway keys

### Build Optimizations

**Implemented:**
- Code splitting (route-based)
- Lazy loading
- Tree shaking
- Minification
- Image optimization
- CSS purging

**Bundle Size:**
- Optimized for performance
- Shared chunks for common code
- Vendor chunk separation

---

## 📱 Responsive Design

### Breakpoints

```javascript
// Tailwind defaults
sm: '640px',   // Small devices
md: '768px',   // Medium devices
lg: '1024px',  // Large devices
xl: '1280px',  // Extra large devices
2xl: '1536px'  // 2X large devices
```

### Mobile-First Approach

- All components designed mobile-first
- Progressive enhancement for larger screens
- Touch-friendly UI elements
- Optimized for performance on mobile devices

### Navigation Strategy

**Desktop:**
- Full navigation bar with search
- Category dropdown
- User menu

**Mobile:**
- Fixed bottom navigation
- Hamburger menu
- Compact search
- Optimized for thumb reach

---

## 🔧 Utilities & Helpers

### Utility Functions (shared/utils/)

**constants/:**
- `apiConstants.js` - API constants
- `orderConstants.js` - Order statuses
- `validationConstants.js` - Validation rules

**errors/:**
- `errorHandler.js` - Error handling
- `ApiError.js` - Custom error class

**helpers/:**
- `formatters.js` - Format dates, currency, etc.
- `validators.js` - Input validation
- `orderHelpers.js` - Order utilities
- `imageHelpers.js` - Image processing

**storage/:**
- `localStorage.js` - localStorage wrapper
- `sessionStorage.js` - sessionStorage wrapper

### Common Patterns

**Currency Formatting:**
```javascript
const formatCurrency = (amount) => {
  return amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR'
  });
};
```

**Date Formatting:**
```javascript
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};
```

---

## 🔍 Testing Strategy

### Current State
- No automated tests implemented yet

### Recommended Testing Stack
- **Unit Tests**: Vitest
- **Component Tests**: React Testing Library
- **E2E Tests**: Playwright or Cypress

### Test Coverage Goals
- Components: 80%+
- Services: 90%+
- Utilities: 95%+
- E2E: Critical user flows

---

## 🐛 Known Issues & Limitations

1. **Authentication**: No JWT refresh token mechanism
2. **Error Handling**: Limited error boundary coverage
3. **Accessibility**: ARIA labels incomplete
4. **Offline Support**: No service worker/PWA features
5. **Image Optimization**: No CDN integration
6. **Analytics**: No tracking implemented
7. **SEO**: Limited meta tags and structured data

---

## 🚧 Future Enhancements

### Phase 1 (High Priority)
- [ ] Complete authentication with refresh tokens
- [ ] Add comprehensive error handling
- [ ] Implement form validation library
- [ ] Add loading states everywhere
- [ ] Improve accessibility (WCAG 2.1)
- [ ] Add unit tests for critical paths

### Phase 2 (Medium Priority)
- [ ] PWA support (offline mode)
- [ ] Push notifications
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Real-time order tracking
- [ ] Live chat support
- [ ] Product reviews and ratings

### Phase 3 (Low Priority)
- [ ] Multi-language support (i18n)
- [ ] Dark mode
- [ ] Advanced analytics dashboard
- [ ] Recommendation engine
- [ ] Wishlist sync across devices
- [ ] Social media integration

---

## 📞 Support & Maintenance

### Code Quality
- ESLint configured
- Consistent code style
- Component structure standardized
- PropTypes validation

### Documentation
- Inline comments for complex logic
- JSDoc for functions
- README files in key directories
- Architecture guide maintained

### Version Control
- Git for source control
- Feature branch workflow recommended
- Conventional commits suggested

---

## 📚 Learning Resources

### React & Modern JavaScript
- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Vite Guide](https://vitejs.dev/guide/)

### State Management
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [TanStack Query](https://tanstack.com/query/latest)

### Styling
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

### API & Data
- [Axios Documentation](https://axios-http.com/docs/intro)
- [REST API Best Practices](https://restfulapi.net/)

---

## 🤝 Contributing Guidelines

### Development Workflow
1. Create feature branch from `main`
2. Develop with frequent commits
3. Test thoroughly
4. Create pull request
5. Code review
6. Merge after approval

### Coding Standards
- Follow existing code style
- Use meaningful variable names
- Add comments for complex logic
- Write reusable components
- Keep components small and focused

### Commit Messages
```
feat: add user profile page
fix: resolve cart calculation bug
docs: update API documentation
style: format code with prettier
refactor: simplify product service
test: add unit tests for cart
```

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 📧 Contact

For questions, issues, or suggestions:
- **Email**: support@dspharma.com
- **Phone**: +91-1800-123-4567

---

**Last Updated**: January 2026
**Documentation Version**: 1.0.0
