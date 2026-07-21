import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  ChevronLeft,
  Menu,
  LogOut,
  Sparkles,
  Megaphone,
  Tags,
  Star,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/admin/utils/cn';
import Button from '@/shared/components/ui/Button';
import useDataStore from '@/store/useDataStore';

const AdminSidebar = ({ isCollapsed, toggleCollapse, isMobile, onCloseMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useDataStore();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Tags },
    { name: 'Featured', href: '/admin/products/featured', icon: Star },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { name: 'Contact', href: '/admin/contact', icon: MessageSquare },
  ];

  const NavItem = ({ item }) => {
    const isActive = 
      location.pathname === item.href || 
      (location.pathname.startsWith(item.href) && 
       (item.href !== '/admin/products' || !location.pathname.startsWith('/admin/products/featured')) &&
       (item.href !== '/admin/dashboard' || location.pathname === '/admin/dashboard'));
    return (
      <NavLink
        to={item.href}
        onClick={isMobile ? onCloseMobile : undefined}
        style={{ marginBottom: '10px', textDecoration: 'none', padding: '5px' }}
        className={cn(
          "group relative flex justify-start  items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
          isActive 
            ? "bg-linear-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 mt-1" 
            : "text-slate-300 hover:bg-slate-800/80 hover:text-white",
          isCollapsed && !isMobile ? "justify-center" : ""
        )}
        title={isCollapsed && !isMobile ? item.name : undefined}
      >
        {isActive && (
          <div className="absolute inset-0 bg-linear-to-r from-emerald-400/20 to-teal-400/20 rounded-xl blur-xl"  />
        )}
        <item.icon className={cn(
          "h-5 w-5 shrink-0  relative z-10 transition-transform group-hover:scale-110", 
          isActive ? "text-white drop-shadow-lg" : "text-slate-400 group-hover:text-emerald-400"
          
        )} />
        
        {/* Text with CSS transition for smooth expand/collapse */}
        <span 
          style={{ padding: '5px', marginTop: '5px' }}
          className={cn(
            "relative z-10 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out origin-left flex items-center",
            (!isCollapsed || isMobile) ? "w-auto opacity-100 ml-3 delay-100" : "hidden"
          )}
        >
          <span style={{}}>{item.name}</span>
        </span>
      </NavLink>
    );
  };

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-800/50 transition-all duration-300 ease-in-out z-[100]",
        "before:absolute before:inset-0 before:bg-linear-to-br before:from-emerald-500/5 before:to-teal-500/5 before:pointer-events-none overflow-hidden",
        isMobile 
          ? "fixed inset-y-0 left-0 w-64 max-sm:w-56 shadow-2xl shadow-emerald-900/50" 
          : cn(
              "sticky top-0 h-screen",
              isCollapsed ? "w-16" : "w-64 max-lg:hidden"
            )
      )}
      style={isMobile ? { transform: `translateX(0)` } : {}}
    >
      {/* Header */}
      <div style={{ marginBottom: '10px' }} className={cn(
        "flex h-14 items-center px-4 mb-6 border-b border-slate-800/50 relative overflow-hidden transition-all duration-300",
        isCollapsed && !isMobile ? "justify-center" : "justify-between"
      )}>
        <div className="absolute inset-0 bg-linear-to-r from-emerald-500/10 to-teal-500/10" />
        
        {/* Logo and Title Container */}
        <div className="flex items-center text-center gap-2 relative z-10 transition-all duration-300">
             {/* Logo Icon - Always visible */}
              {/* <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg shadow-emerald-500/30 shrink-0">
                <Sparkles className="text-white h-5 w-5" />
              </div> */}

              {/* Title Text - Transitions smoothly */}
              <div className={cn(
                  "whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out origin-left", 
                  (!isCollapsed || isMobile) ? "w-45 opacity-100 ml-0 delay-100" : "w-0 opacity-0"
                  
              )}>
                <h1 className="font-bold text-lg bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  AdminPanel
                </h1>
                <p className="text-[10px] text-slate-500 font-medium">DS Pharma</p>
              </div>
        </div>
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCollapse} 
            className="text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 relative z-10"
          >
             {isCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div style={{ padding: '0px 5px' }} className="flex-1 overflow-y-auto py-2 px-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent" >
        {navigation.map((item) => (
          <NavItem key={item.name} item={item}/>
        ))}

        
      </div>

      {/* Footer */}
      <div style={{ padding: '5px' }} className="w-full flex justify-center items-center text-center border-t border-slate-800/50 p-4 bg-linear-to-t from-slate-950 to-transparent" >
        <button 
            onClick={handleLogout}
            className={cn(
                "flex items-center gap-2 rounded-md px-3 py-3 text-sm font-medium text-slate-400 hover:bg-red-200/10 hover:text-red-100 transition-all duration-200 group",
                isCollapsed && !isMobile ? "justify-center" : ""
            )}
            style={{ padding: '5px 20px' }}
        >
          <LogOut className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
          {(!isCollapsed || isMobile) && <span className="shrink-0 group-hover:scale-110 transition-transform" style={{ marginTop: '5px' }}>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
