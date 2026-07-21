import { LogOut, X } from "lucide-react";
import { NavLink } from "react-router-dom";

export function AppSidebar({ open, setOpen, menuItems = [], onLogout }) {
  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-[#F0F0F0] py-12
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:block px-1
        `}
      >
        {/* Mobile close button */}
        <div className="absolute top-4 right-4 md:hidden">
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2 px-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              onClick={() => setOpen(false)} // close on click (mobile only)
              className={({ isActive }) =>
                `block w-full text-center px-4 sm:px-6 md:px-8 py-2 font-medium transition rounded-md ${
                  isActive
                    ? "bg-white text-black"
                    : "text-black hover:bg-gray-200"
                }`
              }
            >
              {item.title}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button at bottom */}
        <div className="absolute bottom-6 w-full px-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 text-black hover:bg-gray-200 px-4 py-2 rounded-md"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
