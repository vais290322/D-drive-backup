# Architecture Refactoring - Implementation Guide

This document provides quick examples of how to use the new architecture in your components.

## ✅ What's Been Set Up

### 1. **Zustand Stores** (Global State)
- `useCartStore` - Shopping cart with localStorage persistence
- `useAuthStore` - Authentication and user session
- `useToastStore` - Toast notifications

### 2. **React Query** (Server State)
- QueryClient configured in `App.jsx`
- DevTools added for debugging

### 3. **API Layer**
- Axios client with auth interceptors
- Endpoint constants
- Service functions for products and auth

### 4. **Custom Hooks**
- Query hooks (GET): `useProducts`, `useProductDetails`, `useCategories`
- Mutation hooks (POST/PUT/DELETE): `useAddToCart`, `useLogin`, `useSignup`

---

## 🔥 Quick Usage Examples

### Using Cart Store

```jsx
import { useCartStore } from '../store/useCartStore';

function CartBadge() {
  // Get data from store
  const totalItems = useCartStore((state) => state.getTotalItems());
  
  return <span>{totalItems}</span>;
}

function ProductCard({ product }) {
  // Get actions from store
  const addItem = useCartStore((state) => state.addItem);
  
  return (
    <button onClick={() => addItem(product, 1)}>
      Add to Cart
    </button>
  );
}
```

### Using Auth Store

```jsx
import { useAuthStore } from '../store/useAuthStore';

function UserMenu() {
  const { user, isAuthenticated, logout } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Link to="/login">Login</Link>;
  }
  
  return (
    <div>
      <p>Welcome, {user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Using Toast Notifications

```jsx
import { useToastStore } from '../store/useToastStore';

function MyComponent() {
  const { success, error } = useToastStore();
  
  const handleAction = async () => {
    try {
      // Do something
      success('Action completed!');
    } catch (err) {
      error('Something went wrong');
    }
  };
  
  return <button onClick={handleAction}>Do Something</button>;
}
```

### Fetching Products with React Query

```jsx
import { useProducts } from '../hooks/queries/useProducts';

function ProductList() {
  const { data, isLoading, error } = useProducts({ 
    category: 'medicines',
    page: 1 
  });
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {data.products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Adding to Cart with Mutation

```jsx
import { useAddToCart } from '../hooks/mutations/useAddToCart';

function ProductCard({ product }) {
  const { mutate: addToCart, isPending } = useAddToCart();
  
  const handleClick = () => {
    addToCart({ product, quantity: 1 });
  };
  
  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### Login Form with Mutation

```jsx
import { useLogin } from '../hooks/mutations/useLogin';

function LoginForm() {
  const { mutate: login, isPending, error } = useLogin();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    login(credentials);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={credentials.email}
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
      />
      <input 
        type="password" 
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
      />
      {error && <p className="text-red-500">{error.message}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

---

## 🎯 Next Steps

1. **Create `.env` file** with your API URL:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

2. **Test the setup**:
   - Open React Query DevTools (floating icon on page)
   - Try adding items to cart (should persist on refresh)
   - Check localStorage for `ds-pharma-cart` and `ds-pharma-auth`

3. **Migrate existing components**:
   - Replace `useState` for cart with `useCartStore`
   - Replace `useEffect` + fetch with React Query hooks
   - Add toast notifications for user feedback

4. **Optional**: Add TypeScript for type safety

---

## 🐛 Troubleshooting

**Issue**: "Cannot find module 'zustand'"
- Run: `npm install`

**Issue**: Toast notifications not showing
- Check that `<ToastContainer />` is in `App.jsx`

**Issue**: React Query DevTools not showing
- It only appears in development mode

---

Your architecture is now production-ready! 🚀
