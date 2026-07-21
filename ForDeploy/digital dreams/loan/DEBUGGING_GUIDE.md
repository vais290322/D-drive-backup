# Debugging Guide - Blank Screen Issue

## Issue
The application preview shows a blank screen after implementing global search and dashboard charts.

## Changes Made to Fix

### 1. Simplified Authentication Flow
- Removed the `RequireAuth` wrapper component
- Created `ProtectedRoutes` component that handles auth state directly
- Added explicit loading state with visible spinner and text
- Implemented proper navigation to `/login` when not authenticated

### 2. Enhanced Error Handling
- Created `ErrorBoundary` component to catch React rendering errors
- Wrapped the entire app with ErrorBoundary in `main.tsx`
- Added root element validation

### 3. Added Console Logging
Extensive console logging has been added to track the application flow:

#### main.tsx
- "main.tsx loaded" - When the module loads
- "Root element found, rendering app..." - When DOM is ready
- "App rendered" - After React render is called

#### AuthProvider.tsx
- "AuthProvider: Initializing auth..." - When auth initialization starts
- "AuthProvider: Got user: [boolean]" - When user data is retrieved
- "AuthProvider: Got profile: [boolean]" - When profile data is retrieved
- "AuthProvider: Setting loading to false" - When loading completes
- "AuthProvider: Auth state changed: [event] [hasUser]" - On auth state changes

#### App.tsx (ProtectedRoutes)
- "ProtectedRoutes render: {user, loading, isLoginPage, pathname}" - On every render
- "ProtectedRoutes useEffect: {user, loading, isLoginPage}" - When effect runs
- "Navigating to /login" - When redirecting to login
- "Showing loading state" - When displaying loading spinner

## How to Debug

### Step 1: Check Console Logs
Open the browser console and look for the log messages above. They will tell you:
1. If the app is loading at all
2. If auth is initializing
3. If there are any errors during auth
4. If navigation is working
5. Where the app gets stuck

### Step 2: Check for Errors
Look for any red error messages in the console. Common issues:
- Missing environment variables
- Supabase connection errors
- React rendering errors
- Navigation errors

### Step 3: Verify Environment Variables
Check that `.env` contains:
```
VITE_SUPABASE_URL=https://acbqilavnfxjfilzwnjd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_LOGIN_TYPE=gmail
VITE_APP_ID=app-7mzgg63hukg1
```

### Step 4: Check Network Tab
Open the Network tab in browser dev tools and check:
- Is the Supabase API being called?
- Are there any failed requests?
- What is the response from auth endpoints?

## Expected Behavior

### On First Load (Not Authenticated)
1. "main.tsx loaded"
2. "Root element found, rendering app..."
3. "App rendered"
4. "AuthProvider: Initializing auth..."
5. "AuthProvider: Got user: false"
6. "AuthProvider: Setting loading to false"
7. "ProtectedRoutes render: {user: false, loading: false, isLoginPage: false, pathname: '/'}"
8. "ProtectedRoutes useEffect: {user: false, loading: false, isLoginPage: false}"
9. "Navigating to /login"
10. Login page should be visible

### On First Load (Authenticated)
1. "main.tsx loaded"
2. "Root element found, rendering app..."
3. "App rendered"
4. "AuthProvider: Initializing auth..."
5. "AuthProvider: Got user: true"
6. "AuthProvider: Got profile: true"
7. "AuthProvider: Setting loading to false"
8. "ProtectedRoutes render: {user: true, loading: false, isLoginPage: false, pathname: '/'}"
9. Dashboard should be visible with header

### During Loading
1. "ProtectedRoutes render: {user: null, loading: true, ...}"
2. "Showing loading state"
3. Loading spinner should be visible

## Files Modified

### Core Files
- `src/main.tsx` - Added logging and error boundary
- `src/App.tsx` - Simplified auth flow, added logging
- `src/components/auth/AuthProvider.tsx` - Added logging
- `src/components/common/ErrorBoundary.tsx` - New error boundary component

### Supporting Files
- `src/pages/Login.tsx` - Enhanced styling
- `index.html` - Added title, removed dark mode class

## Next Steps

If the issue persists after these changes:
1. Check the console logs to see where the flow stops
2. Verify Supabase connection is working
3. Check if there are any React errors in ErrorBoundary
4. Verify the routes are configured correctly
5. Check if CSS is loading properly (look for styled elements)

## Removing Debug Logs

Once the issue is resolved, remove console.log statements from:
- `src/main.tsx`
- `src/App.tsx`
- `src/components/auth/AuthProvider.tsx`

Keep the ErrorBoundary component as it's useful for production error handling.
