# Quick Import Reference Guide

A quick reference for the most common imports you'll need in your new project structure.

## Common UI Components

```javascript
// Import from common components
import { Button, Card, Modal, Input } from '@/components/common';
import { Badge, Alert, Loader } from '@/components/common';
import { Pagination, Tabs, LoadingSpinner } from '@/components/common';
import { PriceDisplay, RatingStars } from '@/components/common';
```

## Feature Components

### Product Feature
```javascript
import {
  ProductCard,
  ProductImageGallery,
  ProductPriceSection,
  ProductActionButtons,
  ProductDescription,
  MedicineCard,
  HighlightedProductCard,
  PharmacyProductCard
} from '@/components/features/product';
```

### Order Feature
```javascript
import {
  OrderCard,
  OrderTimeline,
  OrderProductCard,
  OrderSummary,
  DeliveryAddressCard,
  PaymentBreakdownCard,
  OrderContactSection
} from '@/components/features/order';
```

### Cart Feature
```javascript
import { CartItem } from '@/components/features/cart';
```

### Category Feature
```javascript
import { CategoryIcon } from '@/components/features/category';
```

### Payment Feature
```javascript
import { AppliedCouponCard } from '@/components/features/payment';
```

## Services

```javascript
// Import services
import { productService, cartService, orderService } from '@/services';

// Usage
await productService.fetchProducts();
await cartService.addToCart(product);
await orderService.fetchOrders();
```

## Utilities & Helpers

```javascript
// Formatting functions
import {
  formatPrice,
  formatDate,
  formatDateTime,
  formatTime,
  truncateText,
  capitalize,
  toTitleCase
} from '@/utils/helpers';

// Validation functions
import {
  validateEmail,
  validatePhoneNumber,
  validatePassword,
  validatePincode,
  isRequired,
  minLength,
  maxLength
} from '@/utils/helpers';

// Calculation functions
import {
  calculateDiscount,
  calculateTax,
  calculateTotal,
  calculateShipping,
  calculateCartTotal,
  calculateAverageRating
} from '@/utils/helpers';

// Or import everything from helpers
import * as helpers from '@/utils/helpers';
```

## Constants

```javascript
// App constants
import {
  APP_NAME,
  APP_SLOGAN,
  CURRENCY,
  STOCK_STATUS
} from '@/utils/constants';

// Order status constants
import {
  ORDER_STATUSES,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_BACKGROUNDS
} from '@/utils/constants';

// Or import all constants
import * as constants from '@/utils/constants';
```

## Storage

```javascript
// Local storage wrapper
import { storageService } from '@/utils/storage';

// Usage
storageService.setItem('cart', cartData);
const cart = storageService.getItem('cart');
storageService.removeItem('cart');
storageService.clear();
```

## Error Handling

```javascript
// Error handler
import { errorHandler } from '@/utils/errors';

// Usage
errorHandler.log(error, 'ProductFetch');
const message = errorHandler.getUserMessage(error);
errorHandler.handleAPIError(error, 'CartUpdate');
```

## Configuration

```javascript
// Routes
import { ROUTES, getRoute } from '@/config/routes';

// Usage
navigate(ROUTES.PRODUCT_DETAILS);
navigate(getRoute('PRODUCT_DETAILS', { id: 123 }));

// App config
import { APP_CONFIG } from '@/config';
console.log(APP_CONFIG.API_BASE_URL);

// Theme
import { THEME } from '@/config';
const primaryColor = THEME.colors.primary;
```

## Layout Components

```javascript
import { Layout } from '@/components';
```

## Pages (when creating routes)

```javascript
import Home from '@/pages/Home';
import ProductDetails from '@/pages/ProductDetails';
import CartDetails from '@/pages/CartDetails';
import Orders from '@/pages/Orders';
import OrderDetails from '@/pages/OrderDetails';
import UserProfile from '@/pages/UserProfile';
```

---

## Common Use Case Examples

### In a Product Listing Page

```javascript
import React, { useEffect, useState } from 'react';
import { Button, Card, Pagination } from '@/components/common';
import { ProductCard, PharmacyProductCard } from '@/components/features/product';
import { productService } from '@/services';
import { formatPrice } from '@/utils/helpers';
import { APP_CONFIG } from '@/config';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    productService.fetchProducts({
      page,
      limit: APP_CONFIG.DEFAULT_PAGE_SIZE
    }).then(setProducts);
  }, [page]);

  return (
    <div>
      <Card>
        {products.map(product => (
          <ProductCard
            key={product.id}
            {...product}
            price={formatPrice(product.price)}
          />
        ))}
      </Card>
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(products.length / APP_CONFIG.DEFAULT_PAGE_SIZE)}
        onPageChange={setPage}
      />
    </div>
  );
};

export default ProductList;
```

### In a Cart Page

```javascript
import React, { useEffect } from 'react';
import { Button, Card, Alert } from '@/components/common';
import { CartItem } from '@/components/features/cart';
import { cartService } from '@/services';
import { calculateCartTotal, formatPrice } from '@/utils/helpers';
import { storageService } from '@/utils/storage';
import { errorHandler } from '@/utils/errors';

const CartPage = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    cartService.fetchCart()
      .then(data => {
        setCart(data);
        storageService.setItem('cart', data);
      })
      .catch(error => {
        const message = errorHandler.getUserMessage(error);
        console.error(message);
      });
  }, []);

  const totals = calculateCartTotal(cart);

  return (
    <div>
      {cart.map(item => (
        <CartItem key={item.id} item={item} />
      ))}
      <Card>
        <p>Total: {formatPrice(totals.total)}</p>
        <Button>Checkout</Button>
      </Card>
    </div>
  );
};

export default CartPage;
```

### In an Order Tracking Page

```javascript
import React, { useEffect, useState } from 'react';
import { Card, Loader } from '@/components/common';
import { OrderTimeline, OrderProductCard } from '@/components/features/order';
import { orderService } from '@/services';
import { ORDER_STATUS_COLORS, formatDate } from '@/utils/constants';

const OrderTracker = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.fetchOrderById(orderId)
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <Loader />;

  return (
    <div>
      <Card>
        <OrderTimeline timeline={order.timeline} />
      </Card>
      {order.items.map(item => (
        <OrderProductCard key={item.id} {...item} />
      ))}
    </div>
  );
};

export default OrderTracker;
```

---

## Tips

1. **Always use `@/` alias** for imports - it's cleaner and easier to refactor
2. **Import from barrel exports** - never import directly from component files
3. **Group imports** by type: external libs → internal components → services → utils → styles
4. **Use destructuring** for multiple imports from same module
5. **Check `index.js` files** if you're unsure what's exported from a folder

---

Keep this guide handy when updating your imports! 🚀
