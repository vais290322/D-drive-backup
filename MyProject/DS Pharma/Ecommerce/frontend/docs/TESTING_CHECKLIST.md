# 🧪 Production Testing Checklist

**Before deploying to production, verify all scenarios below.**

---

## ✅ Pre-Testing Setup

### **1. Clear All Caches**
```javascript
// Open DevTools Console (F12)
localStorage.clear()
sessionStorage.clear()
```

### **2. Hard Refresh**
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### **3. Open DevTools**
- Console Tab (check for errors)
- Network Tab (monitor requests)
- Application → Local Storage (verify cache)

---

## 🧪 Test Scenarios

### **Test 1: Home Page Load** ⬜

**Steps:**
1. Navigate to home page
2. Wait for all categories to load
3. Scroll through product sections

**Expected:**
- ✅ All category sections load
- ✅ Products display with images
- ✅ No console errors
- ✅ No duplicate API calls (check Network tab)

**Console Check:**
```javascript
// Should see these logs (Dev mode):
// [API] GET /category (XXms)
// [API] GET /productusercategory/Medicine (XXms)
// [API] ✓ GET /category (XXms)
```

**Verify:**
- [ ] All sections loaded
- [ ] Images visible
- [ ] No errors
- [ ] API calls = number of categories + 1

---

### **Test 2: Category Navigation** ⬜

**Steps:**
1. Click on a category card
2. Wait for products to load
3. Verify product grid displays

**Expected:**
- ✅ Products load quickly
- ✅ All images visible
- ✅ Product count correct
- ✅ No console errors

**Verify:**
- [ ] Products loaded
- [ ] Images visible
- [ ] Count accurate
- [ ] No errors

---

### **Test 3: Rapid Category Switching** ⬜

**Steps:**
1. Click category A
2. Immediately click category B
3. Immediately click category C
4. Wait for final category to load

**Expected:**
- ✅ Only category C products shown
- ✅ No products from A or B
- ✅ Console shows canceled requests
- ✅ No error toasts

**Console Check:**
```javascript
// Should see:
// [API] Request canceled: /productusercategory/CategoryA
// [API] Request canceled: /productusercategory/CategoryB
// [API] ✓ GET /productusercategory/CategoryC (XXms)
```

**Verify:**
- [ ] Only last category shown
- [ ] No mixed products
- [ ] Cancellations silent
- [ ] No toasts

---

### **Test 4: Infinite Scroll** ⬜

**Steps:**
1. Go to category with 20+ products
2. Scroll to bottom of first page
3. Wait for next page to load
4. Repeat until end

**Expected:**
- ✅ New products append smoothly
- ✅ No duplicate requests
- ✅ "Loading more..." indicator shows
- ✅ "You've reached the end" message appears

**Network Tab Check:**
- Page 1: `/productusercategory/X?page=1&limit=12`
- Page 2: `/productusercategory/X?page=2&limit=12`
- No duplicate page requests

**Verify:**
- [ ] Smooth loading
- [ ] No duplicates
- [ ] Loading indicator
- [ ] End message shown

---

### **Test 5: Search Functionality** ⬜

**Steps:**
1. Use search bar
2. Type "paracetamol"
3. Wait for results
4. Verify images display

**Expected:**
- ✅ Results load quickly
- ✅ All images visible
- ✅ Proper product data
- ✅ No console errors

**Verify:**
- [ ] Results accurate
- [ ] Images visible
- [ ] Data complete
- [ ] No errors

---

### **Test 6: Cache System** ⬜

**Steps:**
1. Visit home page (cold start)
2. Note load time
3. Navigate away and back
4. Note load time (should be instant)

**Expected:**
- ✅ First load: 1-2s
- ✅ Second load: <100ms (cache hit)
- ✅ Console shows "Cache hit"

**Console Check:**
```javascript
// Second visit should show:
// [ProductService] Cache hit: categories_all
// [ProductService] Cache hit: category_123?page=1&limit=5
```

**localStorage Check:**
```javascript
// Open DevTools → Application → Local Storage
// Should see keys like:
// dspharma_v2_categories_all
// dspharma_v2_category_123?page=1&limit=12
```

**Verify:**
- [ ] First load normal
- [ ] Second load instant
- [ ] Cache logs visible
- [ ] localStorage populated

---

### **Test 7: Network Error Handling** ⬜

**Steps:**
1. Load page (let it cache)
2. DevTools → Network → Set to "Offline"
3. Navigate to different category
4. Check behavior

**Expected:**
- ✅ Shows cached data if available
- ✅ Error message if no cache
- ✅ No console spam
- ✅ Graceful degradation

**Verify:**
- [ ] Cached data shown
- [ ] Friendly error (if no cache)
- [ ] No error spam
- [ ] UI not broken

---

### **Test 8: Slow Network** ⬜

**Steps:**
1. DevTools → Network → Set to "Slow 3G"
2. Navigate to category
3. Scroll to trigger infinite scroll

**Expected:**
- ✅ Loading indicators show
- ✅ No duplicate requests
- ✅ Requests wait for previous to complete
- ✅ Smooth UX despite slowness

**Verify:**
- [ ] Loading states work
- [ ] No duplicates
- [ ] Proper queuing
- [ ] Good UX

---

### **Test 9: Product Details** ⬜

**Steps:**
1. Click on a product card
2. Wait for details to load
3. Verify all data displays

**Expected:**
- ✅ All images load
- ✅ Price, name, description visible
- ✅ Category info present
- ✅ Stock status shown

**Verify:**
- [ ] Images loaded
- [ ] All data present
- [ ] Layout correct
- [ ] No errors

---

### **Test 10: Cart Operations** ⬜

**Steps:**
1. Add product to cart
2. View cart
3. Verify product data
4. Check images

**Expected:**
- ✅ Product added successfully
- ✅ Cart shows correct item
- ✅ Images visible
- ✅ Pricing correct

**Verify:**
- [ ] Add successful
- [ ] Cart accurate
- [ ] Images visible
- [ ] Prices correct

---

## 🔍 Console Error Monitoring

### **What's Acceptable:**

✅ **GOOD (Expected in Dev):**
```
[API] GET /category (234ms)
[API] ✓ GET /productusercategory/Medicine (456ms)
[ProductService] Cache hit: categories_all
[API] Request canceled: /productusercategory/OldCategory
```

❌ **BAD (Should NOT appear):**
```
Network error or server unreachable
❌ CanceledError shown to user
❌ Uncaught exception
❌ Cannot read property 'image' of undefined
❌ Maximum update depth exceeded
```

---

## 📊 Performance Checks

### **Network Tab Analysis:**

1. **Count API Calls (Home Page):**
   - Expected: ~10-15 calls
   - Each category = 1 call
   - Categories list = 1 call

2. **Check for Duplicates:**
   - Filter by endpoint
   - Should see ONE request per unique URL+params

3. **Response Times:**
   - First load: 200-500ms per request
   - Cached: 0ms (from cache)

4. **Canceled Requests:**
   - Should show as "canceled" (not error)
   - Should be intentional (category switch)

---

## 🎯 Success Criteria

**Mark ✅ when ALL of these are true:**

- [ ] Home page loads without errors
- [ ] All category sections display products
- [ ] Images load on all product cards
- [ ] Category navigation works smoothly
- [ ] Rapid switching doesn't break UI
- [ ] Infinite scroll works without duplicates
- [ ] Search returns results with images
- [ ] Cache system works (instant second load)
- [ ] Offline mode shows cached data
- [ ] Slow network doesn't cause issues
- [ ] Product details page loads correctly
- [ ] Cart operations work properly
- [ ] Console shows ZERO unexpected errors
- [ ] No error toasts during normal use
- [ ] Network tab shows no duplicate requests

---

## 🚨 If Tests Fail

### **Scenario 1: Still seeing console errors**

**Fix:**
```bash
# 1. Clear all caches
localStorage.clear()

# 2. Hard refresh
Ctrl + Shift + R

# 3. Restart dev server
npm run dev

# 4. Check file versions
git status
```

### **Scenario 2: Duplicate requests**

**Fix:**
```javascript
// Check if old productService is cached
// Add this temporarily to productService.js:
console.log('ProductService Version: 2.0');

// Should see in console on load
// If not, clear cache and rebuild
```

### **Scenario 3: Images not loading**

**Fix:**
```javascript
// Open Console
// Check product data structure:
console.log(products[0])

// Should have:
// - image: "https://..."
// - images: ["https://..."]

// If missing, check normalizeProduct is imported correctly
```

### **Scenario 4: Cache not working**

**Fix:**
```javascript
// Check localStorage size
Object.keys(localStorage).filter(k => k.startsWith('dspharma_v2_')).length

// Should be > 0 after first page load
// If 0, check browser storage settings
```

---

## 📝 Test Results Log

**Date:** __________  
**Tester:** __________  
**Environment:** [ ] Local [ ] Staging [ ] Production

| Test | Status | Notes |
|------|--------|-------|
| 1. Home Page Load | ⬜ | |
| 2. Category Navigation | ⬜ | |
| 3. Rapid Switching | ⬜ | |
| 4. Infinite Scroll | ⬜ | |
| 5. Search | ⬜ | |
| 6. Cache System | ⬜ | |
| 7. Network Error | ⬜ | |
| 8. Slow Network | ⬜ | |
| 9. Product Details | ⬜ | |
| 10. Cart Operations | ⬜ | |

**Overall Status:** [ ] PASS [ ] FAIL  
**Deploy Ready:** [ ] YES [ ] NO

---

## 🎉 Sign-Off

**When ALL tests pass:**

- [ ] Verified by Developer
- [ ] Verified by QA
- [ ] Verified by Product Owner
- [ ] Documentation reviewed
- [ ] Ready for production

**Approved by:** __________________  
**Date:** __________________

---

**Need help?** Check [FIXES_SUMMARY.md](./FIXES_SUMMARY.md) or [API_QUICK_REFERENCE.md](./API_QUICK_REFERENCE.md)
