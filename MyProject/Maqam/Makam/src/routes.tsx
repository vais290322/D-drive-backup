import Home from './pages/Home';
import Flights from './pages/Flights';
import Hotels from './pages/Hotels';
import Packages from './pages/Packages';
import AIPackageGenerator from './pages/AIPackageGenerator';
import Booking from './pages/Booking';
import Login from './pages/Login';
import CustomerPortal from './pages/CustomerPortal';
import PaymentSuccess from './pages/PaymentSuccess';
import Contact from './pages/Contact';
import Resources from './pages/Resources';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminFlights from './pages/admin/AdminFlights';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />,
    visible: true
  },
  {
    name: 'Flights',
    path: '/flights',
    element: <Flights />,
    visible: true
  },
  {
    name: 'Hotels',
    path: '/hotels',
    element: <Hotels />,
    visible: true
  },
  {
    name: 'Packages',
    path: '/packages',
    element: <Packages />,
    visible: true
  },
  {
    name: 'AI Package Generator',
    path: '/ai-package-generator',
    element: <AIPackageGenerator />,
    visible: true
  },
  {
    name: 'Resources',
    path: '/resources',
    element: <Resources />,
    visible: true
  },
  {
    name: 'Contact',
    path: '/contact',
    element: <Contact />,
    visible: true
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    visible: false
  },
  {
    name: 'Booking',
    path: '/booking',
    element: <Booking />,
    visible: false
  },
  {
    name: 'Customer Portal',
    path: '/customer-portal',
    element: <CustomerPortal />,
    visible: false
  },
  {
    name: 'Payment Success',
    path: '/payment-success',
    element: <PaymentSuccess />,
    visible: false
  }
];

export default routes;
