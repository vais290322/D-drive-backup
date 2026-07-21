import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from "@/user/components/layout/Layout.jsx";
import ScrollToTop from "@/shared/components/ScrollToTop";
import { AnnouncementProvider } from '@/shared/contexts/AnnouncementContext';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import PageLoader from './shared/components/loaders/PageLoader';

// Lazy load all page components
const Home = lazy(() => import('./user/pages/Home'));
const CartDetails = lazy(() => import('./user/pages/CartDetails'));
const ProductDetails = lazy(() => import('./user/pages/ProductDetails'));
const Orders = lazy(() => import('./user/pages/Orders'));
const OrderDetails = lazy(() => import("./user/pages/OrderDetails"));
const OrderConfirmation = lazy(() => import("./user/pages/OrderConfirmation"));
const CategoryProducts = lazy(() => import("./user/pages/CategoryProducts"));
const UserProfile = lazy(() => import("./user/pages/UserProfile"));
const LoginPage = lazy(() => import("./user/pages/LoginPage"));
const SignupPage = lazy(() => import("./user/pages/SignupPage"));
const ForgotPasswordPage = lazy(() => import("./user/pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./user/pages/ResetPasswordPage"));
const SearchPage = lazy(() => import("./user/pages/SearchPage"));
const FeaturedProductsPage = lazy(() => import("./user/pages/FeaturedProductsPage"));
const AllProductsPage = lazy(() => import('./user/pages/AllProductsPage'));
const LoadMoreProductsPage = lazy(() => import('./user/pages/LoadMoreProductsPage'));
const NotFoundPage = lazy(() => import("./user/pages/NotFoundPage"));
const AdminRouter = lazy(() => import("./admin/AdminRouter"));

import { useAuthStore } from './store/useAuthStore';
import { decodeToken } from './shared/utils/decodeToken';
import ProtectedRoute from './shared/components/ProtectedRoute';
import CategoryPage from './user/pages/CategoryPage';

import ContactPage from './user/pages/ContactPage';
import AboutPage from './user/pages/AboutPage';
import PrivacyPolicyPage from './user/pages/PrivacyPolicyPage';
import TermOfServicePage from './user/pages/TermOfServicePage';




// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 1000 * 60, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { setUser, setToken, setLoading } = useAuthStore();

  React.useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const decoded = decodeToken(token);
        if (decoded) {
          // Map backend fields to frontend user object
          const userData = {
            id: decoded.id || decoded.sub || decoded._id,
            role: decoded.role || 'user',
            email: decoded.email
          };
          setUser(userData);
          setToken(token);
        } else {
          throw new Error("Invalid token");
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        localStorage.removeItem("authToken");
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setUser, setToken, setLoading]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AnnouncementProvider>
          <Router>
            <ScrollToTop />
            <ToastContainer />

            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Auth Routes (No Layout) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:id" element={<ResetPasswordPage />} />

                {/* Admin Routes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminRouter />
                    </ProtectedRoute>
                  }
                />

                {/* Standalone Routes (No Layout) */}
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />

                {/* Protected/Main Routes (With Layout) */}
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/cart" element={<CartDetails />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/category/:categoryId" element={<CategoryProducts />} />
                  <Route path="/categories" element={<CategoryPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms-of-service" element={<TermOfServicePage />} />

                  {/* Protected User Routes */}
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders/:id"
                    element={
                      <ProtectedRoute>
                        <OrderDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/featured" element={<FeaturedProductsPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/shop" element={<AllProductsPage />} />
                  <Route path="/load-more-products" element={<LoadMoreProductsPage />} />
                </Route>

                {/* 404 - Not Found Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Router>
          <ReactQueryDevtools initialIsOpen={false} />
        </AnnouncementProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
