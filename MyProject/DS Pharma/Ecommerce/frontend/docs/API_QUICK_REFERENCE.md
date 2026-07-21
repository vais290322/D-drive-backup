# 🚨 API & Product Service Quick Reference

## 🎯 What Changed

### **apiClient.js**
- ✅ Proper CanceledError handling (no toast spam)
- ✅ Error classification (network, timeout, retriable)
- ✅ Dev-only logging
- ✅ Silent cancellations

### **productService.js**
- ✅ Multi-layer cache (memory + localStorage)
- ✅ Smart request deduplication
- ✅ Intelligent retry (network/5xx only)
- ✅ Graceful fallback (cached data on error)
- ✅ Category validation

---

## 📖 How to Use

### **1. Basic Product Fetching**

```javascript
import productService from '@/services/productService';

// Get products by category
const result = await productService.getProductsByCategory(categoryId, page, limit);
// Returns: { data: [...], pagination: {...} }

// Get featured products
const featured = await productService.getFeaturedProducts();
// Returns: [...]

// Get product by ID
const product = await productService.getProductById(productId);
// Returns: {...} or null

// Search products
const searchResults = await productService.searchUserProducts({
  search: "paracetamol",
  page: 1,
  limit: 12
});
// Returns: { data: [...], pagination: {...} }
```

---

### **2. Cancellation (Automatic)**

```javascript
// Requests are automatically canceled when:
// 1. New request for same resource arrives
// 2. Component unmounts
// 3. Category changes

useEffect(() => {
  const fetchData = async () => {
    const data = await productService.getProductsByCategory(categoryId);
    setProducts(data);
  };
  
  fetchData();
  
  // Automatic cleanup - cancels pending requests
  return () => {
    productService.cancelAllRequests();
  };
}, [categoryId]);
```

---

### **3. Cache Management**

```javascript
// Get categories (cached for 5 minutes)
const categories = await productService.getAllCategories();

// Skip cache (force fresh data)
const freshData = await productService.getProductsByCategory(
  categoryId, 
  1, 
  12, 
  { skipCache: true }
);

// Clear all caches
productService.clearAllCaches();
```

---

### **4. Error Handling**

```javascript
try {
  const data = await productService.getProductsByCategory(categoryId);
  
  if (data.error) {
    // API failed, check if data is cached
    if (data.data.length > 0) {
      // Using cached data
      console.log("Showing cached products");
    } else {
      // No data available
      setError(true);
    }
  }
} catch (error) {
  // Only thrown if no fallback available
  console.error("Failed to load products:", error);
  setError(true);
}
```

---

### **5. Infinite Scroll Pattern**

```javascript
const [products, setProducts] = useState([]);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const fetchingRef = useRef(false);

const fetchNextPage = useCallback(async () => {
  if (fetchingRef.current || !hasMore) return;
  
  fetchingRef.current = true;
  
  try {
    const result = await productService.getProductsByCategory(
      categoryId, 
      page + 1, 
      12
    );
    
    if (result?.data) {
      setProducts(prev => [...prev, ...result.data]);
      setPage(page + 1);
      setHasMore(result.pagination?.hasMore || false);
    }
  } finally {
    fetchingRef.current = false;
  }
}, [categoryId, page, hasMore]);

// IntersectionObserver
const lastElementRef = useCallback(node => {
  if (!node || !hasMore) return;
  
  const observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting && !fetchingRef.current) {
        fetchNextPage();
      }
    },
    { rootMargin: '100px', threshold: 0.1 }
  );
  
  observer.observe(node);
  
  return () => observer.disconnect();
}, [hasMore, fetchNextPage]);
```

---

## 🔧 Utility Functions

### **normalizeProduct**

Ensures every product has consistent structure:

```javascript
import { normalizeProduct } from '@/services/productService';

const rawProduct = { /* from API */ };
const normalized = normalizeProduct(rawProduct);

// Guaranteed fields:
// - id, _id
// - image (single URL)
// - images (array)
// - category (object or string)
// - categoryId
// - price, mrp, originalPrice, discount
// - stock, inStock
// - isVisible, display
```

---

## 🐛 Debugging

### **Check Cache**

```javascript
// Open DevTools Console
localStorage.getItem('dspharma_v2_categories_all')
localStorage.getItem('dspharma_v2_category_123?page=1&limit=12')
```

### **Monitor Requests**

```javascript
// Dev mode automatically logs:
// [API] GET /productusercategory/Medicine (234ms)
// [API] Request canceled: /productusercategory/Medicine
```

### **Check Active Requests**

```javascript
// In productService.js, add temporarily:
console.log('Active requests:', activeRequests.size);
```

---

## ⚠️ Common Pitfalls

### **❌ DON'T manually abort requests**

```javascript
// BAD
const controller = new AbortController();
apiClient.get(url, { signal: controller.signal });
controller.abort(); // Don't do this!
```

```javascript
// GOOD
const data = await productService.getProductsByCategory(id);
// Automatic cancellation handled
```

### **❌ DON'T ignore error states**

```javascript
// BAD
const data = await productService.getProductsByCategory(id);
setProducts(data.data); // Might be empty on error!
```

```javascript
// GOOD
const data = await productService.getProductsByCategory(id);
if (data.error && data.data.length === 0) {
  setError(true);
} else {
  setProducts(data.data);
}
```

### **❌ DON'T retry in components**

```javascript
// BAD
catch (error) {
  // Retry logic here
}
```

```javascript
// GOOD
// productService handles retries automatically
const data = await productService.getProductsByCategory(id);
```

---

## 📊 Performance Tips

### **1. Use cache wisely**

```javascript
// Fast: Uses cache
const categories = await productService.getAllCategories();

// Slower: Skips cache
const fresh = await productService.getAllCategories({ skipCache: true });
```

### **2. Batch requests**

```javascript
// Good: Parallel requests
const [categories, featured] = await Promise.all([
  productService.getAllCategories(),
  productService.getFeaturedProducts()
]);
```

### **3. Pre-fetch on hover**

```javascript
<CategoryCard
  onMouseEnter={() => {
    // Pre-fetch products
    productService.getProductsByCategory(category.id, 1, 5);
  }}
/>
```

---

## 🎯 Migration Guide

### **If you have existing code:**

**Before:**
```javascript
const response = await apiClient.get('/productusercategory/Medicine');
const products = response.data.data.map(p => ({
  ...p,
  id: p._id,
  image: p.image[0]
}));
```

**After:**
```javascript
const result = await productService.getProductsByCategory(categoryId);
const products = result.data; // Already normalized!
```

---

## 🔗 Related Files

- `src/services/api/apiClient.js` - HTTP client
- `src/services/productService.js` - Product API wrapper
- `src/services/api/baseURL.js` - Endpoint definitions
- `src/user/pages/CategoryProducts.jsx` - Infinite scroll example
- `PRODUCTION_FIXES_COMPLETE.md` - Full documentation

---

## 🆘 Need Help?

### **Issue: Products not loading**

1. Check console for errors
2. Verify backend is running
3. Check network tab in DevTools
4. Clear cache: `productService.clearAllCaches()`

### **Issue: Stale data**

1. Check cache expiry (10 minutes)
2. Use `skipCache: true` option
3. Clear localStorage manually
4. Hard refresh browser

### **Issue: Duplicate requests**

1. Ensure proper cleanup in useEffect
2. Check for multiple instances of same component
3. Verify `fetchingRef` is working
4. Use React DevTools Profiler

---

**Last Updated:** January 2026  
**Version:** 2.0 (Production)
