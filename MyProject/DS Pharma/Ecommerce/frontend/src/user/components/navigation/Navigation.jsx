import { useNavigate } from 'react-router-dom';
import useDataStore from '@/store/useDataStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useActiveNavItem } from '@/user/components/navigation/hooks/useActiveNavItem';
import { DesktopNavigation } from '@/user/components/navigation/DesktopNavigation';
import { MobileTopBar } from '@/user/components/navigation/MobileTopBar';
import { MobileBottomNav } from '@/user/components/navigation/MobileBottomNav';
import { NAV_ITEMS } from '@/user/components/navigation/constants';
import { LayoutGrid } from 'lucide-react';

/**
 * Main Navigation component - orchestrates all navigation sub-components
 */
const Navigation = () => {
  const navigate = useNavigate();
  
  // Use useAuthStore for primary authentication state
  const { user, isAuthenticated } = useAuthStore();
  // Use useDataStore only for shop data like cart
  const { cart } = useDataStore();
  
  // Calculate total items
  const totalCartItems = cart?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
  
  const activeItem = useActiveNavItem();
  
  // Filter navigation items based on authentication status and roles
  const filteredNavItems = [...NAV_ITEMS.filter(item => 
    (isAuthenticated && item.auth) || (!isAuthenticated && item.guest)
  )];

  // Inject Admin link if user is an admin
  if (isAuthenticated && user?.role === 'admin') {
    // Add it after Orders or at the end
    filteredNavItems.push({ 
      name: "Admin Panel", 
      href: "/admin/dashboard", 
      icon: LayoutGrid, 
      auth: true 
    });
  }

  const handleNavClick = (itemName, href) => {
    if (href.startsWith('/')) {
      navigate(href);
    } else if (href.startsWith('#')) {
      if (window.location.pathname === '/') {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        navigate(`/${href}`);
      }
    }
  };

  return (
    <>
      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 767px) {
          .nav-links-container {
            gap: 0.5rem !important;
          }
          .nav-link-item {
            font-size: 13px !important;
            padding-bottom: 6px !important;
            white-space: nowrap !important;
          }
          .nav-icons-container {
            gap: 0.5rem !important;
            padding-right: 0.5rem !important;
            flex-shrink: 0 !important;
          }
          .nav-search-icon {
            width: 32px !important;
            height: 30px !important;
          }
          .nav-search-icon svg {
            width: 16px !important;
            height: 16px !important;
          }
          .nav-cart-icon {
            width: 32px !important;
            height: 32px !important;
          }
          .nav-cart-icon img {
            width: 16px !important;
            height: 16px !important;
          }
          .nav-user-profile {
            width: 32px !important;
            height: 32px !important;
            padding: 0 !important;
          }
          .nav-user-profile svg {
            width: 16px !important;
            height: 16px !important;
          }
          .nav-user-name {
            display: none !important;
          }
          .nav-user-avatar-container {
            width: 32px !important;
            height: 32px !important;
          }
          .nav-user-avatar-container svg {
            width: 16px !important;
            height: 16px !important;
          }
          .nav-search-expanded {
            width: 160px !important;
            padding: 0.375rem 0.75rem !important;
          }
          .nav-search-expanded input {
            font-size: 11px !important;
            padding: 0.25rem !important;
          }
          .nav-search-expanded svg {
            width: 16px !important;
            height: 16px !important;
          }
        }
        @media (min-width: 768px) and (max-width: 900px) {
          .nav-links-container {
            gap: 0.75rem !important;
          }
          .nav-link-item {
            font-size: 12px !important;
          }
          .nav-user-text {
            font-size: 11px !important;
          }
        }
      `}</style>

      {/* Desktop Navigation */}
        <DesktopNavigation
          activeItem={activeItem}
          onNavClick={handleNavClick}
          totalCartItems={totalCartItems}
          isAuthenticated={isAuthenticated}
          user={user}
          navItems={filteredNavItems}
        />

      {/* Mobile Top Bar */}
      <MobileTopBar
        totalCartItems={totalCartItems}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeItem={activeItem}
        onNavClick={handleNavClick}
        navItems={filteredNavItems}
      />
    </>
  );
};

export default Navigation;
