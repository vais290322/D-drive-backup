import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              Shipping System
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md hover:bg-blue-700">
              Dashboard
            </Link>
            <Link to="/products" className="px-3 py-2 rounded-md hover:bg-blue-700">
              Products
            </Link>
            <Link to="/orders" className="px-3 py-2 rounded-md hover:bg-blue-700">
              Orders
            </Link>
            <Link to="/shiprocket" className="px-3 py-2 rounded-md hover:bg-blue-700">
              Shiprocket
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;